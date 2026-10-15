import { latestCompleteAnalyticsDate } from "./analytics/windows"
import { fetchCanonicalAnalyticsReport, rowsToObjects } from "./canonicalSync/query"
import {
  appendContentBuildEvent,
  listContentBuildEvents,
  listContentBuildMetadataHistory,
  type ContentBuildMetadataHistoryEntry,
} from "./asset-engine/ContentBuildRepository"

export type HistoricalMetadataMetricName =
  | "views"
  | "watchTimeMinutes"
  | "averageViewPercentage"
  | "likes"
  | "comments"
  | "revenue"

export interface HistoricalMetadataMetricComparison {
  metric: HistoricalMetadataMetricName
  baselineAverage: number | null
  followUpAverage: number | null
  absoluteChange: number | null
  percentChange: number | null
  baselineDaysObserved: number
  followUpDaysObserved: number
}

export interface HistoricalMetadataComparison {
  schemaVersion: 1
  contentBuildId: string
  videoId: string
  metadataVersionId: string
  operationId: string
  changedAt: string
  fieldChanges: ContentBuildMetadataHistoryEntry["fields"]
  baselineStartDate: string
  baselineEndDate: string
  followUpStartDate: string
  followUpEndDate: string
  completeThrough: string
  status: "ready" | "partial" | "unavailable"
  metrics: HistoricalMetadataMetricComparison[]
  evidenceIds: string[]
  analyticsCheckpointIds: string[]
  interpretation: "descriptive-association-only"
  causalConclusion: null
  confounders: string[]
  sampleCoverage: "low" | "medium" | "high"
}

export interface HistoricalMetadataContext {
  contentBuildId: string
  videoId: string
  metadataVersions: ContentBuildMetadataHistoryEntry[]
  analyticsCheckpointEvents: Array<{
    eventId: string
    checkpointId: string | null
    timestamp: string
    evidenceIds: string[]
    metadata: Record<string, unknown>
    result: Record<string, unknown>
  }>
  relevantMetadataVersionIds: string[]
  evidenceIds: string[]
}

const DAY_MS = 24 * 60 * 60 * 1000
const METRICS: Array<{ name: HistoricalMetadataMetricName; aliases: string[] }> = [
  { name: "views", aliases: ["views"] },
  { name: "watchTimeMinutes", aliases: ["estimatedMinutesWatched", "watchTimeMinutes"] },
  { name: "averageViewPercentage", aliases: ["averageViewPercentage", "avp"] },
  { name: "likes", aliases: ["likes"] },
  { name: "comments", aliases: ["comments"] },
  { name: "revenue", aliases: ["estimatedRevenue", "revenue"] },
]

const comparisonFingerprint = (value: unknown) => {
  const input = JSON.stringify(value) ?? "undefined"
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

const dateOnly = (value: Date) => value.toISOString().slice(0, 10)
const parseDay = (value: string) => {
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
const addDays = (value: Date, days: number) => {
  const result = new Date(value)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}
const numeric = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}
const valueFor = (row: Record<string, unknown> | undefined, aliases: string[]) => {
  if (!row) return null
  for (const alias of aliases) {
    const value = numeric(row[alias])
    if (value != null) return value
  }
  return null
}
const average = (values: Array<number | null>) => {
  const present = values.filter((value): value is number => value != null && Number.isFinite(value))
  return present.length ? present.reduce((sum, value) => sum + value, 0) / present.length : null
}
const confidenceFor = (minObservedDays: number): HistoricalMetadataComparison["sampleCoverage"] =>
  minObservedDays >= 7 ? "high" : minObservedDays >= 5 ? "medium" : "low"

/**
 * Resolves only explicit ContentBuild metadata-version and analytics-checkpoint
 * references. It never joins records by title, URL, or fuzzy text matching.
 */
export const resolveHistoricalMetadataContext = (input: {
  contentBuildId: string
  videoId: string
  changeAt?: number
  daysBefore?: number
  daysAfter?: number
}): HistoricalMetadataContext => {
  const daysBefore = input.daysBefore ?? 7
  const daysAfter = input.daysAfter ?? 7
  const changeAt = input.changeAt ?? Date.now()
  const start = changeAt - daysBefore * DAY_MS
  const end = changeAt + daysAfter * DAY_MS
  const metadataVersions = listContentBuildMetadataHistory(input.contentBuildId)
  const relevantMetadataVersions = metadataVersions.filter(entry => {
    const at = Date.parse(entry.occurredAt)
    return Number.isFinite(at) && at >= start && at <= end &&
      (!entry.publishedVideoId || entry.publishedVideoId === input.videoId)
  })
  const analyticsCheckpointEvents = listContentBuildEvents(input.contentBuildId)
    .filter(event =>
      event.eventType === "analytics.checkpoint" ||
      (event.eventType === "analysis.completed" && event.entityType === "metadata-performance-comparison")
    )
    .filter(event => {
      const metadata = event.metadata as Record<string, unknown> | undefined
      const videoId = metadata?.videoId
      const at = Date.parse(event.timestamp)
      return videoId === input.videoId && Number.isFinite(at) && at >= start && at <= end
    })
    .map(event => {
      const metadata = (event.metadata || {}) as Record<string, unknown>
      return {
        eventId: event.id,
        checkpointId: typeof metadata.checkpointId === "string" ? metadata.checkpointId : null,
        timestamp: event.timestamp,
        evidenceIds: event.evidenceIds || [],
        metadata,
        result: (event.resultingState && typeof event.resultingState === "object" && !Array.isArray(event.resultingState))
          ? event.resultingState as Record<string, unknown>
          : {},
      }
    })
  return {
    contentBuildId: input.contentBuildId,
    videoId: input.videoId,
    metadataVersions: relevantMetadataVersions,
    analyticsCheckpointEvents,
    relevantMetadataVersionIds: relevantMetadataVersions.map(entry => entry.metadataVersionId),
    evidenceIds: [...new Set([
      ...relevantMetadataVersions.flatMap(entry => entry.evidenceIds),
      ...analyticsCheckpointEvents.flatMap(event => event.evidenceIds),
    ])],
  }
}

/**
 * Compare observed daily metrics around one explicit metadata change.
 * Missing days/metrics remain missing; they are never silently converted to zero.
 * Results describe temporal association, not causal impact.
 */
export const buildHistoricalMetadataComparison = (input: {
  contentBuildId: string
  videoId: string
  metadataVersion: ContentBuildMetadataHistoryEntry
  rows: Record<string, unknown>[]
  now?: Date
}): HistoricalMetadataComparison => {
  if (input.metadataVersion.contentBuildId !== input.contentBuildId) {
    throw new Error("Metadata version does not belong to the requested ContentBuild.")
  }
  if (input.metadataVersion.publishedVideoId && input.metadataVersion.publishedVideoId !== input.videoId) {
    throw new Error("Metadata version is associated with a different published video.")
  }
  const changedAt = Date.parse(input.metadataVersion.occurredAt)
  if (!Number.isFinite(changedAt)) throw new Error("Metadata version has an invalid occurredAt timestamp.")
  const changedDay = new Date(changedAt)
  const baselineStart = dateOnly(addDays(new Date(Date.UTC(changedDay.getUTCFullYear(), changedDay.getUTCMonth(), changedDay.getUTCDate())), -7))
  const baselineEnd = dateOnly(addDays(new Date(Date.UTC(changedDay.getUTCFullYear(), changedDay.getUTCMonth(), changedDay.getUTCDate())), -1))
  const followUpStart = dateOnly(addDays(new Date(Date.UTC(changedDay.getUTCFullYear(), changedDay.getUTCMonth(), changedDay.getUTCDate())), 1))
  const followUpTargetEnd = dateOnly(addDays(new Date(Date.UTC(changedDay.getUTCFullYear(), changedDay.getUTCMonth(), changedDay.getUTCDate())), 7))
  const now = input.now || new Date()
  const completeThrough = dateOnly(latestCompleteAnalyticsDate(now))
  const queryEnd = followUpTargetEnd < completeThrough ? followUpTargetEnd : completeThrough
  const byDay = new Map(input.rows.map(row => {
    const day = String(row.day || row.date || "")
    return [day, row] as const
  }).filter(([day]) => Boolean(parseDay(day))))
  const baselineDays = Array.from({ length: 7 }, (_, index) => dateOnly(addDays(parseDay(baselineStart)!, index)))
  const followUpDays = Array.from({ length: 7 }, (_, index) => dateOnly(addDays(parseDay(followUpStart)!, index)))
    .filter(day => day <= queryEnd)
  const metrics = METRICS.map(({ name, aliases }) => {
    const baselineValues = baselineDays.map(day => valueFor(byDay.get(day), aliases))
    const followUpValues = followUpDays.map(day => valueFor(byDay.get(day), aliases))
    const baselineAverage = average(baselineValues)
    const followUpAverage = average(followUpValues)
    const absoluteChange = baselineAverage != null && followUpAverage != null
      ? followUpAverage - baselineAverage
      : null
    return {
      metric: name,
      baselineAverage,
      followUpAverage,
      absoluteChange,
      percentChange: baselineAverage != null && baselineAverage !== 0 && absoluteChange != null
        ? absoluteChange / Math.abs(baselineAverage) * 100
        : null,
      baselineDaysObserved: baselineValues.filter(value => value != null).length,
      followUpDaysObserved: followUpValues.filter(value => value != null).length,
    }
  })
  const hasBaselineRows = baselineDays.some(day => byDay.has(day))
  const hasFollowUpRows = followUpDays.some(day => byDay.has(day))
  const afterWindowComplete = queryEnd >= followUpTargetEnd && followUpDays.length === 7
  const observedDays = Math.min(
    ...metrics.map(metric => Math.min(metric.baselineDaysObserved, metric.followUpDaysObserved)),
  )
  const hasAdequateMetricCoverage = metrics.some(metric =>
    metric.baselineAverage != null && metric.followUpAverage != null &&
    metric.baselineDaysObserved >= 5 && metric.followUpDaysObserved >= 5
  )
  const status = !hasBaselineRows && !hasFollowUpRows
    ? "unavailable"
    : afterWindowComplete && hasAdequateMetricCoverage
      ? "ready"
      : "partial"
  return {
    schemaVersion: 1,
    contentBuildId: input.contentBuildId,
    videoId: input.videoId,
    metadataVersionId: input.metadataVersion.metadataVersionId,
    operationId: input.metadataVersion.operationId,
    changedAt: input.metadataVersion.occurredAt,
    fieldChanges: input.metadataVersion.fields,
    baselineStartDate: baselineStart,
    baselineEndDate: baselineEnd,
    followUpStartDate: followUpStart,
    followUpEndDate: followUpTargetEnd,
    completeThrough,
    status,
    metrics,
    evidenceIds: [...new Set(input.metadataVersion.evidenceIds)],
    analyticsCheckpointIds: [...new Set(input.metadataVersion.analyticsCheckpointIds)],
    interpretation: "descriptive-association-only",
    causalConclusion: null,
    confounders: [
      "Other metadata or creative changes may have occurred in the same period.",
      "Traffic source, audience mix, impressions, seasonality, and distribution changes may affect outcomes.",
      "Daily aggregates do not isolate the effect of an individual field.",
      "A missing metric or date is unknown, not zero.",
    ],
    sampleCoverage: confidenceFor(Math.max(0, observedDays)),
  }
}

/** Fetch canonical daily analytics for one explicit metadata version and persist the comparison on ContentBuild. */
export const fetchAndRecordHistoricalMetadataComparison = async (input: {
  contentBuildId: string
  videoId: string
  metadataVersionId: string
  channelId?: string | null
  now?: Date
  fetchReport?: typeof fetchCanonicalAnalyticsReport
}): Promise<HistoricalMetadataComparison & { analysisEventId: string | null }> => {
  const history = listContentBuildMetadataHistory(input.contentBuildId)
  const metadataVersion = history.find(entry => entry.metadataVersionId === input.metadataVersionId)
  if (!metadataVersion) {
    throw new Error("Unknown metadata version for this ContentBuild: " + input.metadataVersionId)
  }
  if (metadataVersion.publishedVideoId && metadataVersion.publishedVideoId !== input.videoId) {
    throw new Error("Metadata version does not belong to the requested published video.")
  }
  const changedAt = Date.parse(metadataVersion.occurredAt)
  if (!Number.isFinite(changedAt)) throw new Error("Metadata version has an invalid occurredAt timestamp.")
  const changedDay = new Date(changedAt)
  const changeDay = new Date(Date.UTC(changedDay.getUTCFullYear(), changedDay.getUTCMonth(), changedDay.getUTCDate()))
  const startDate = dateOnly(addDays(changeDay, -7))
  const targetEndDate = dateOnly(addDays(changeDay, 7))
  const now = input.now || new Date()
  const latestComplete = dateOnly(latestCompleteAnalyticsDate(now))
  const queryEndDate = targetEndDate < latestComplete ? targetEndDate : latestComplete
  const canQuery = queryEndDate >= startDate
  const payload = canQuery
    ? await (input.fetchReport || fetchCanonicalAnalyticsReport)({
        startDate,
        endDate: queryEndDate,
        metrics: [
          "views",
          "estimatedMinutesWatched",
          "averageViewPercentage",
          "likes",
          "comments",
          "estimatedRevenue",
        ],
        dimensions: ["day"],
        filters: [`video==${input.videoId}`],
        sort: "day",
      }, "Historical metadata performance comparison")
    : { columnHeaders: [], rows: [] }
  const comparison = buildHistoricalMetadataComparison({
    contentBuildId: input.contentBuildId,
    videoId: input.videoId,
    metadataVersion,
    rows: rowsToObjects(payload),
    now,
  })
  const evidenceId = `youtube-analytics:video:${input.videoId}:${startDate}:${queryEndDate}`
  const comparisonHash = comparisonFingerprint({
    metadataVersionId: comparison.metadataVersionId,
    baselineStartDate: comparison.baselineStartDate,
    baselineEndDate: comparison.baselineEndDate,
    followUpStartDate: comparison.followUpStartDate,
    followUpEndDate: comparison.followUpEndDate,
    status: comparison.status,
    metrics: comparison.metrics,
  })
  const idempotencyKey = `historical-metadata-comparison:${input.contentBuildId}:${input.videoId}:${input.metadataVersionId}:${queryEndDate}:${comparison.status}:${comparisonHash}`
  const event = appendContentBuildEvent({
    contentBuildId: input.contentBuildId,
    idempotencyKey,
    eventType: "analysis.completed",
    entityType: "metadata-performance-comparison",
    entityId: input.metadataVersionId,
    actorType: "analytics",
    toolId: "historical-metadata-intelligence",
    evidenceIds: [...new Set([...comparison.evidenceIds, evidenceId])],
    resultingState: comparison,
    timestamp: now.toISOString(),
    metadata: {
      videoId: input.videoId,
      channelId: input.channelId || null,
      metadataVersionId: input.metadataVersionId,
      operationId: metadataVersion.operationId,
      baselineStartDate: comparison.baselineStartDate,
      baselineEndDate: comparison.baselineEndDate,
      followUpStartDate: comparison.followUpStartDate,
      followUpEndDate: comparison.followUpEndDate,
      queryEndDate,
      status: comparison.status,
      interpretation: comparison.interpretation,
      causalConclusion: null,
      idempotencyKey,
    },
  })
  return { ...comparison, analysisEventId: event.id }
}
