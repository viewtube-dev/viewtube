import { latestCompleteAnalyticsDate } from "./analytics/windows"
import {
  fetchCanonicalAnalyticsReport,
  rowsToObjects,
  toMetricNumber,
} from "./canonicalSync/query"
import {
  appendContentBuildEvent,
  listContentBuildEvents,
} from "./asset-engine/ContentBuildRepository"
import { listPublishTransactions } from "./asset-engine/PublishTransaction"
import { recordAnalyticsCheckpointForEvaluation } from "./asset-engine/PostPublishAnalyticsBridge"

export type LongformDailyComparisonPhase = "before" | "change" | "after"

export interface LongformOptimizationDailyDay {
  date: string
  relativeDay: number
  phase: LongformDailyComparisonPhase
  pending: boolean
  views: number | null
  watchTimeMinutes: number | null
  avp: number | null
  likes: number | null
  comments: number | null
  revenue: number | null
}

export interface LongformOptimizationDailySummary {
  daysObserved: number
  viewsAverage: number | null
  watchTimeMinutesAverage: number | null
  avpAverage: number | null
  likesAverage: number | null
  commentsAverage: number | null
  revenueAverage: number | null
}

export interface LongformOptimizationDailyComparison {
  version: "longform-daily-comparison-v1"
  videoId: string
  changeAt: number
  startDate: string
  changeDate: string
  targetEndDate: string
  queryEndDate: string
  completeThrough: string
  capturedAt: string
  status: "ready" | "partial" | "unavailable"
  days: LongformOptimizationDailyDay[]
  before: LongformOptimizationDailySummary
  after: LongformOptimizationDailySummary
  contentBuildEventId?: string | null
}

export interface LongformDailyComparisonWindow {
  startDate: string
  changeDate: string
  targetEndDate: string
  queryEndDate: string
  completeThrough: string
}


const dateOnly = (value: Date) => value.toISOString().slice(0, 10)

const dateFromIsoDay = (value: string) => {
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const addDays = (value: Date, days: number) => {
  const next = new Date(value)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

const minDate = (left: Date, right: Date) =>
  left.getTime() <= right.getTime() ? left : right

const comparisonFingerprint = (value: unknown) => {
  const input = JSON.stringify(value) ?? "undefined"
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

const average = (values: Array<number | null>) => {
  const present = values.filter((value): value is number => value != null && Number.isFinite(value))
  if (!present.length) return null
  return present.reduce((total, value) => total + value, 0) / present.length
}

export const buildLongformDailyComparisonWindow = (
  changeAt: number,
  now = new Date(),
): LongformDailyComparisonWindow => {
  const change = new Date(changeAt)
  const changeDay = new Date(Date.UTC(change.getUTCFullYear(), change.getUTCMonth(), change.getUTCDate()))
  const start = addDays(changeDay, -7)
  const targetEnd = addDays(changeDay, 7)
  const latestComplete = latestCompleteAnalyticsDate(now)
  const queryEnd = minDate(targetEnd, latestComplete)
  return {
    startDate: dateOnly(start),
    changeDate: dateOnly(changeDay),
    targetEndDate: dateOnly(targetEnd),
    queryEndDate: dateOnly(queryEnd),
    completeThrough: dateOnly(latestComplete),
  }
}

const metric = (row: Record<string, unknown> | undefined, ...keys: string[]) => {
  if (!row) return null
  for (const key of keys) {
    const value = toMetricNumber(row[key])
    if (value != null) return value
  }
  return null
}

const summaryFor = (
  days: LongformOptimizationDailyDay[],
): LongformOptimizationDailySummary => {
  const observed = days.filter((day) => !day.pending && [
    day.views, day.watchTimeMinutes, day.avp, day.likes, day.comments, day.revenue,
  ].some(value => value != null && Number.isFinite(value)))
  return {
    daysObserved: observed.length,
    viewsAverage: average(observed.map((day) => day.views)),
    watchTimeMinutesAverage: average(observed.map((day) => day.watchTimeMinutes)),
    avpAverage: average(observed.map((day) => day.avp)),
    likesAverage: average(observed.map((day) => day.likes)),
    commentsAverage: average(observed.map((day) => day.comments)),
    revenueAverage: average(observed.map((day) => day.revenue)),
  }
}

export const buildLongformOptimizationDailyComparison = (input: {
  videoId: string
  changeAt: number
  rows: Record<string, unknown>[]
  now?: Date
}): LongformOptimizationDailyComparison => {
  const now = input.now || new Date()
  const window = buildLongformDailyComparisonWindow(input.changeAt, now)
  const changeDate = dateFromIsoDay(window.changeDate)!
  const completeThrough = dateFromIsoDay(window.completeThrough)!
  const byDay = new Map(
    input.rows
      .map((row) => [String(row.day || row.date || ""), row] as const)
      .filter(([day]) => Boolean(dateFromIsoDay(day))),
  )

  const days: LongformOptimizationDailyDay[] = Array.from({ length: 15 }, (_, index) => {
    const relativeDay = index - 7
    const date = dateOnly(addDays(changeDate, relativeDay))
    const row = byDay.get(date)
    const phase: LongformDailyComparisonPhase = relativeDay < 0
      ? "before"
      : relativeDay > 0
        ? "after"
        : "change"
    const pending = addDays(changeDate, relativeDay).getTime() > completeThrough.getTime()
    return {
      date,
      relativeDay,
      phase,
      pending,
      views: pending ? null : metric(row, "views"),
      watchTimeMinutes: pending ? null : metric(row, "estimatedMinutesWatched", "watchTimeMinutes"),
      avp: pending ? null : metric(row, "averageViewPercentage", "avp"),
      likes: pending ? null : metric(row, "likes"),
      comments: pending ? null : metric(row, "comments"),
      revenue: pending ? null : metric(row, "estimatedRevenue", "revenue"),
    }
  })

  const beforeDays = days.filter((day) => day.phase === "before")
  const afterDays = days.filter((day) => day.phase === "after")
  const beforeComplete = beforeDays.every((day) => !day.pending && byDay.has(day.date))
  const afterComplete = afterDays.every((day) => !day.pending && byDay.has(day.date))
  const before = summaryFor(beforeDays)
  const after = summaryFor(afterDays)
  const hasAdequateMetricCoverage = before.daysObserved >= 5 && after.daysObserved >= 5 &&
    [
      [before.viewsAverage, after.viewsAverage],
      [before.watchTimeMinutesAverage, after.watchTimeMinutesAverage],
      [before.avpAverage, after.avpAverage],
      [before.likesAverage, after.likesAverage],
      [before.commentsAverage, after.commentsAverage],
      [before.revenueAverage, after.revenueAverage],
    ].some(([baseline, observed]) => baseline != null && observed != null)

  return {
    version: "longform-daily-comparison-v1",
    videoId: input.videoId,
    changeAt: input.changeAt,
    ...window,
    capturedAt: now.toISOString(),
    status: window.queryEndDate < window.startDate
      ? "unavailable"
      : beforeComplete && afterComplete && hasAdequateMetricCoverage
        ? "ready"
        : "partial",
    days,
    before,
    after,
    contentBuildEventId: null,
  }
}

const listMetadataVersionIdsForComparison = (contentBuildId: string, changeAt: number) =>
  listContentBuildEvents(contentBuildId)
    .filter(event => event.entityType === "metadata-version")
    .filter(event => {
      const metadata = event.metadata as Record<string, unknown> | undefined
      const entry = metadata?.metadataHistory as Record<string, unknown> | undefined
      const occurredAt = typeof entry?.occurredAt === "string" ? Date.parse(entry.occurredAt) : NaN
      return Number.isFinite(occurredAt) && occurredAt >= changeAt - 7 * 86400000 && occurredAt <= changeAt + 7 * 86400000
    })
    .map(event => event.entityId)
    .filter((id): id is string => Boolean(id))

export const fetchAndRecordLongformOptimizationDailyComparison = async (input: {
  videoId: string
  contentBuildId: string
  channelId?: string | null
  changeAt: number
  now?: Date
  fetchReport?: typeof fetchCanonicalAnalyticsReport
}): Promise<LongformOptimizationDailyComparison> => {
  const now = input.now || new Date()
  const window = buildLongformDailyComparisonWindow(input.changeAt, now)
  const queryStart = dateFromIsoDay(window.startDate)!
  const queryEnd = dateFromIsoDay(window.queryEndDate)!
  const canQuery = queryEnd.getTime() >= queryStart.getTime()

  const payload = canQuery
    ? await (input.fetchReport || fetchCanonicalAnalyticsReport)({
        startDate: window.startDate,
        endDate: window.queryEndDate,
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
      }, "Longform Optimizer 7+7 daily comparison")
    : { columnHeaders: [], rows: [] }

  const comparison = buildLongformOptimizationDailyComparison({
    videoId: input.videoId,
    changeAt: input.changeAt,
    rows: rowsToObjects(payload),
    now,
  })

  const metadataVersionIds = listMetadataVersionIdsForComparison(input.contentBuildId, input.changeAt)
  const comparisonHash = comparisonFingerprint({
    version: comparison.version,
    status: comparison.status,
    before: comparison.before,
    after: comparison.after,
    metadataVersionIds,
    days: comparison.days.map(day => [day.date, day.views, day.watchTimeMinutes, day.avp, day.likes, day.comments, day.revenue]),
  })
  const comparisonEventKey = `longform-comparison:${input.contentBuildId}:${input.videoId}:${comparison.changeDate}:${comparison.queryEndDate}:${comparison.status}:${comparisonHash}`
  const event = appendContentBuildEvent({
    contentBuildId: input.contentBuildId,
    idempotencyKey: comparisonEventKey,
    eventType: "analytics.checkpoint",
    entityType: "longform-optimization-daily-comparison",
    entityId: `longform-daily:${input.videoId}:${comparison.changeDate}`,
    actorType: "analytics",
    toolId: "longform-optimizer",
    resultingState: comparison,
    evidenceIds: [
      `youtube-analytics:video:${input.videoId}:${comparison.startDate}:${comparison.queryEndDate}`,
    ],
    metadata: {
      channelId: input.channelId || null,
      videoId: input.videoId,
      changeAt: input.changeAt,
      changeDate: comparison.changeDate,
      startDate: comparison.startDate,
      targetEndDate: comparison.targetEndDate,
      queryEndDate: comparison.queryEndDate,
      status: comparison.status,
      beforeDaysObserved: comparison.before.daysObserved,
      afterDaysObserved: comparison.after.daysObserved,
      source: "youtube-analytics-v2",
      comparisonVersion: comparison.version,
      idempotencyKey: comparisonEventKey,
      metadataVersionIds,
    },
  })

  // A completed seven-day window is a measurable checkpoint. Bridge it into
  // the canonical evaluation ledger only when the source ContentBuild has a
  // completed transaction for this exact published YouTube video.
  if (comparison.status === "ready") {
    const transaction = listPublishTransactions(input.contentBuildId).find(candidate =>
      candidate.status === "completed" && candidate.youtubeVideoId === input.videoId
    )
    if (transaction) {
      const checkpointAt = new Date(`${comparison.targetEndDate}T23:59:59.999Z`).getTime()
      const evidenceId = `youtube-analytics:video:${input.videoId}:${comparison.startDate}:${comparison.queryEndDate}`
      const metrics = [
        ["views", comparison.before.viewsAverage, comparison.after.viewsAverage],
        ["watchTimeMinutes", comparison.before.watchTimeMinutesAverage, comparison.after.watchTimeMinutesAverage],
        ["avp", comparison.before.avpAverage, comparison.after.avpAverage],
        ["likes", comparison.before.likesAverage, comparison.after.likesAverage],
        ["comments", comparison.before.commentsAverage, comparison.after.commentsAverage],
        ["revenue", comparison.before.revenueAverage, comparison.after.revenueAverage],
      ] as const
      const comparableMetrics = metrics.filter(([, baselineValue, observedValue]) =>
        baselineValue != null && Number.isFinite(baselineValue) &&
        observedValue != null && Number.isFinite(observedValue)
      )
      if (comparableMetrics.length > 0) {
        recordAnalyticsCheckpointForEvaluation({
          transactionId: transaction.id,
          videoId: input.videoId,
          checkpointId: `longform-daily:${input.videoId}:${comparison.changeDate}`,
          checkpointAt,
          observations: comparableMetrics.map(([metricName, , value]) => ({
            metric: metricName,
            value: value as number,
            observedAt: checkpointAt,
            evidenceId,
          })),
          evaluationTargets: comparableMetrics.map(([metricName, baselineValue]) => ({
            metric: metricName,
            direction: "increase" as const,
            baselineValue: baselineValue as number,
          })),
          evidenceIds: [evidenceId],
          now: now.getTime(),
          summary: `Completed 7+7-day longform optimization comparison for ${input.videoId}; only metrics with observed baseline and follow-up values were evaluated.`,
          toolId: "longform-optimizer",
        })
      }
    }
  }

  return {
    ...comparison,
    contentBuildEventId: event.id,
  }
}

const isComparison = (value: unknown): value is LongformOptimizationDailyComparison => {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<LongformOptimizationDailyComparison>
  return candidate.version === "longform-daily-comparison-v1"
    && typeof candidate.videoId === "string"
    && Array.isArray(candidate.days)
}

export const readLatestLongformOptimizationDailyComparison = (input: {
  contentBuildId: string
  videoId: string
}): LongformOptimizationDailyComparison | null => {
  const event = listContentBuildEvents(input.contentBuildId)
    .filter((candidate) => candidate.eventType === "analytics.checkpoint")
    .filter((candidate) => candidate.entityType === "longform-optimization-daily-comparison")
    .filter((candidate) => candidate.metadata && (candidate.metadata as Record<string, unknown>).videoId === input.videoId)
    .at(-1)
  if (!event || !isComparison(event.resultingState)) return null
  return {
    ...event.resultingState,
    contentBuildEventId: event.id,
  }
}
