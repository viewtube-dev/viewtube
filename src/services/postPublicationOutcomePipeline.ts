import {
  listContentBuildEvents,
  listContentBuildMetadataHistory,
  listContentBuilds,
} from "./asset-engine/ContentBuildRepository"
import { listPublishTransactions } from "./asset-engine/PublishTransaction"
import { recordAnalyticsCheckpointForEvaluation } from "./asset-engine/PostPublishAnalyticsBridge"
import {
  fetchAndRecordHistoricalMetadataComparison,
} from "./historicalMetadataIntelligence"
import { fetchCanonicalAnalyticsReport, rowsToObjects } from "./canonicalSync/query"
import { latestCompleteAnalyticsDate } from "./analytics/windows"
import {
  listAlgorithmIntelligenceEvents,
  type AlgorithmIntelligenceEvent,
  type AlgorithmEvaluationTarget,
} from "./brain/AlgorithmIntelligenceEventLedger"
import {
  recordAlgorithmEvaluation,
  type AlgorithmMetricObservation,
} from "./brain/AlgorithmEvaluationEngine"

const DAY_MS = 24 * 60 * 60 * 1000
const METRICS = [
  { metric: "views", aliases: ["views"] },
  { metric: "watchTimeMinutes", aliases: ["estimatedMinutesWatched", "watchTimeMinutes"] },
  { metric: "averageViewPercentage", aliases: ["averageViewPercentage"] },
  { metric: "likes", aliases: ["likes"] },
  { metric: "comments", aliases: ["comments"] },
  { metric: "revenue", aliases: ["estimatedRevenue", "revenue"] },
] as const

const aliasesForMetric = (metric: string): readonly string[] => {
  if (metric === "estimatedMinutesWatched" || metric === "watchTimeMinutes") return ["estimatedMinutesWatched", "watchTimeMinutes"]
  if (metric === "estimatedRevenue" || metric === "revenue") return ["estimatedRevenue", "revenue"]
  if (metric === "averageViewPercentage") return ["averageViewPercentage"]
  if (metric === "views") return ["views"]
  if (metric === "likes") return ["likes"]
  if (metric === "comments") return ["comments"]
  return [metric]
}

export interface PostPublicationOutcomePipelineResult {
  channelId: string
  status: "complete" | "partial" | "idle"
  publishedBuildsChecked: number
  checkpointsRecorded: number
  recommendationEvaluations: number
  metadataComparisonsRecorded: number
  metadataComparisonsReady: number
  skipped: number
  failures: Array<{ contentBuildId: string; stage: "analytics-checkpoint" | "metadata-comparison"; code: string }>
  completedAt: string
}

const dateOnly = (date: Date) => date.toISOString().slice(0, 10)
const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string" && value.trim()) {
    const number = Number(value)
    return Number.isFinite(number) ? number : null
  }
  return null
}
const valueFor = (row: Record<string, unknown> | undefined, aliases: readonly string[]) => {
  if (!row) return null
  for (const alias of aliases) {
    const value = parseNumber(row[alias])
    if (value !== null) return value
  }
  return null
}
const average = (values: Array<number | null>) => {
  const available = values.filter((value): value is number => value !== null)
  return available.length ? available.reduce((sum, value) => sum + value, 0) / available.length : null
}
const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

const recommendationsFor = (
  events: AlgorithmIntelligenceEvent[],
  contentBuildId: string,
  videoId: string,
  now: number,
) => events.filter(event =>
  (event.kind === "RECOMMENDATION_CREATED" || event.kind === "RECOMMENDATION_EXECUTED") &&
  event.videoId === videoId &&
  event.metadata?.contentBuildId === contentBuildId &&
  event.checkpointAt != null &&
  event.checkpointAt <= now &&
  event.evaluationTargets.length > 0
)

const hasRecordedCheckpoint = (
  contentBuildId: string,
  videoId: string,
  checkpointId: string,
) => listContentBuildEvents(contentBuildId).some(event => {
  if (event.eventType !== "analytics.checkpoint" || event.entityType !== "analytics-checkpoint") return false
  const metadata = isRecord(event.metadata) ? event.metadata : {}
  return metadata.videoId === videoId && metadata.checkpointId === checkpointId
})

const hasReadyComparison = (
  contentBuildId: string,
  metadataVersionId: string,
  throughDate: string,
) => listContentBuildEvents(contentBuildId).some(event => {
  if (event.entityType !== "metadata-performance-comparison") return false
  const metadata = isRecord(event.metadata) ? event.metadata : {}
  const result = isRecord(event.resultingState) ? event.resultingState : {}
  return metadata.metadataVersionId === metadataVersionId &&
    result.status === "ready" &&
    typeof metadata.queryEndDate === "string" &&
    metadata.queryEndDate >= throughDate
})

/**
 * Runs after canonical analytics sync. It joins only exact ContentBuild,
 * publication-transaction, approved-snapshot, and YouTube video identities.
 * It never fuzzy-matches by title and never asserts metadata changes caused
 * observed performance.
 */
export const runPostPublicationOutcomePipeline = async (input: {
  channelId: string
  now?: Date
  fetchReport?: typeof fetchCanonicalAnalyticsReport
}): Promise<PostPublicationOutcomePipelineResult> => {
  const now = input.now || new Date()
  const nowMs = now.getTime()
  const completeThrough = latestCompleteAnalyticsDate(now)
  const endDate = dateOnly(completeThrough)
  const startDate = dateOnly(new Date(completeThrough.getTime() - 7 * DAY_MS))
  const result: PostPublicationOutcomePipelineResult = {
    channelId: input.channelId,
    status: "idle",
    publishedBuildsChecked: 0,
    checkpointsRecorded: 0,
    recommendationEvaluations: 0,
    metadataComparisonsRecorded: 0,
    metadataComparisonsReady: 0,
    skipped: 0,
    failures: [],
    completedAt: now.toISOString(),
  }
  const builds = listContentBuilds().filter(build =>
    build.channelId === input.channelId &&
    build.youtube?.status === "published" &&
    Boolean(build.youtube.videoId)
  )
  if (!builds.length) return result

  const algorithmEvents = listAlgorithmIntelligenceEvents({ channelId: input.channelId })
  for (const build of builds) {
    const videoId = build.youtube?.videoId
    if (!videoId) {
      result.skipped += 1
      continue
    }
    const transaction = listPublishTransactions(build.id).find(candidate =>
      candidate.status === "completed" && candidate.youtubeVideoId === videoId
    )
    if (!transaction) {
      result.failures.push({
        contentBuildId: build.id,
        stage: "analytics-checkpoint",
        code: "verified-publish-transaction-unavailable",
      })
      continue
    }
    result.publishedBuildsChecked += 1

    try {
      const report = await (input.fetchReport || fetchCanonicalAnalyticsReport)({
        startDate,
        endDate,
        metrics: [...new Set(METRICS.map(metric => metric.aliases[0]))],
        dimensions: ["day"],
        filters: [`video==${videoId}`],
        sort: "day",
      }, "Post-publication outcome checkpoint")
      const rows = rowsToObjects(report)
        .map(row => ({ ...row, day: String(row.day || row.date || "") }))
        .filter(row => /^\d{4}-\d{2}-\d{2}$/.test(row.day))
        .sort((left, right) => left.day.localeCompare(right.day))
      const latestRow = rows.find(row => row.day === endDate) || null
      if (!latestRow) {
        result.failures.push({
          contentBuildId: build.id,
          stage: "analytics-checkpoint",
          code: "latest-complete-video-analytics-row-unavailable",
        })
      } else {
        const checkpointId = `daily:${endDate}`
        const checkpointAlreadyRecorded = hasRecordedCheckpoint(build.id, videoId, checkpointId)
        if (checkpointAlreadyRecorded) result.skipped += 1

        const baselineRows = rows.filter(row => row.day < endDate).slice(-7)
        const dueRecommendations = recommendationsFor(algorithmEvents, build.id, videoId, nowMs)
        const recommendationTargets = dueRecommendations.flatMap(event => event.evaluationTargets)
        const observationMetricNames = [...new Set([
          ...METRICS.map(({ metric }) => metric),
          ...recommendationTargets.map(target => target.metric),
        ])]
        const observations: AlgorithmMetricObservation[] = observationMetricNames.map(metric => ({
          metric,
          value: valueFor(latestRow, aliasesForMetric(metric)),
          observedAt: Date.parse(`${endDate}T23:59:59.999Z`),
          evidenceId: `youtube-analytics:video:${videoId}:${endDate}:${metric}`,
        }))
        const targets: AlgorithmEvaluationTarget[] = recommendationTargets.length
          ? recommendationTargets
          : METRICS.map(({ metric, aliases }) => ({
              metric,
              direction: "inspect" as const,
              baselineValue: average(baselineRows.map(row => valueFor(row, aliases))),
            }))

        // Re-enter the idempotent bridge on retries. A checkpoint event may have
        // committed before its publication evaluation or recommendation outcome,
        // so the existing checkpoint alone is not proof that lineage is complete.
        const checkpoint = recordAnalyticsCheckpointForEvaluation({
          transactionId: transaction.id,
          videoId,
          actionPacketId: transaction.actionPacketId || null,
          workflowId: transaction.workflowId || null,
          recommendationId: transaction.recommendationId || null,
          experimentId: transaction.experimentId || null,
          correlationId: transaction.operationId || transaction.id,
          checkpointId,
          checkpointAt: Date.parse(`${endDate}T23:59:59.999Z`),
          observations,
          evaluationTargets: targets,
          evidenceIds: observations.flatMap(observation => observation.evidenceId ? [observation.evidenceId] : []),
          now: nowMs,
          toolId: "canonical-analytics-sync",
          summary: `Canonical YouTube analytics synced through ${endDate}; linked to the verified publishing transaction and approved metadata snapshot.`,
        })
        if (!checkpointAlreadyRecorded) result.checkpointsRecorded += 1

        if (!checkpoint.publicationEvaluation || checkpoint.publicationEvaluationError) {
          result.failures.push({
            contentBuildId: build.id,
            stage: "analytics-checkpoint",
            code: "canonical-publication-evaluation-unavailable",
          })
        }

        // Outcome evaluation is deliberately outside the new-checkpoint branch:
        // if an earlier attempt wrote the checkpoint and then crashed, a retry
        // can still finish each recommendation exactly once.
        for (const recommendation of dueRecommendations) {
          const alreadyMeasured = listAlgorithmIntelligenceEvents({
            channelId: input.channelId,
            kind: "OUTCOME_MEASURED",
          }).some(event => {
            if (!event.parentEventIds.includes(recommendation.id)) return false
            const status = (event.metadata?.evaluation as { status?: string } | undefined)?.status || ""
            return ["positive", "neutral", "negative", "mixed"].includes(status)
          })
          if (alreadyMeasured) continue
          recordAlgorithmEvaluation({
            sourceEventId: recommendation.id,
            observations,
            now: nowMs,
            metadata: {
              contentBuildId: build.id,
              videoId,
              publicationTransactionId: transaction.id,
              workflowId: transaction.workflowId || null,
              operationId: transaction.operationId || transaction.id,
              actionPacketId: transaction.actionPacketId || null,
              recommendationId: recommendation.id,
              experimentId: transaction.experimentId || null,
              approvedSnapshotId: transaction.approvedSnapshotId,
              approvedSnapshotHash: transaction.approvedSnapshotHash,
              metadataVersionIds: listContentBuildMetadataHistory(build.id).map(version => version.metadataVersionId),
              checkpointId,
              checkpointEventId: checkpoint.checkpointEvent?.id || checkpoint.identity.event.id,
              interpretation: "descriptive-association-only",
              causalConclusion: null,
            },
          })
          result.recommendationEvaluations += 1
        }
      }
    } catch {
      result.failures.push({
        contentBuildId: build.id,
        stage: "analytics-checkpoint",
        code: "canonical-analytics-checkpoint-failed",
      })
    }

    const history = listContentBuildMetadataHistory(build.id)
      .filter(version => version.publishedVideoId === videoId)
      .slice(-12)
    for (const version of history) {
      const changedAt = Date.parse(version.occurredAt)
      if (!Number.isFinite(changedAt)) {
        result.skipped += 1
        continue
      }
      const targetEnd = dateOnly(new Date(Date.parse(dateOnly(new Date(changedAt)) + "T00:00:00.000Z") + 7 * DAY_MS))
      if (endDate < targetEnd || hasReadyComparison(build.id, version.metadataVersionId, targetEnd)) {
        result.skipped += 1
        continue
      }
      try {
        const comparison = await fetchAndRecordHistoricalMetadataComparison({
          contentBuildId: build.id,
          videoId,
          metadataVersionId: version.metadataVersionId,
          channelId: input.channelId,
          now,
          fetchReport: input.fetchReport,
        })
        result.metadataComparisonsRecorded += 1
        if (comparison.status === "ready") result.metadataComparisonsReady += 1
      } catch {
        result.failures.push({
          contentBuildId: build.id,
          stage: "metadata-comparison",
          code: "historical-metadata-comparison-failed",
        })
      }
    }
  }
  result.status = result.failures.length ? "partial" : "complete"
  return result
}
