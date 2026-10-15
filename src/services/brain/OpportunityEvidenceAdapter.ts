import type { AIBrainEvidencePack, AIBrainEvidenceVideo } from "../../types"
import type { CanonicalIntelligenceEvidenceBundle } from "../analytics-canon"
import type { OpportunityEvidence } from "./OpportunityIntelligence"

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))

const ageDays = (publishedAt: string | null, now: Date): number | null => {
 const timestamp = publishedAt ? new Date(publishedAt).getTime() : Number.NaN
 if (!Number.isFinite(timestamp)) return null
 return Math.max(0, (now.getTime() - timestamp) / 86_400_000)
}

const metricCoverage = (video: AIBrainEvidenceVideo): number => {
 const values = [
  video.metrics.views,
  video.metrics.watchTime,
  video.metrics.averagePercentageViewed,
  video.metrics.subscribers,
  video.metrics.ctr,
 ]
 return values.filter((value) => typeof value === "number" && Number.isFinite(value)).length / values.length
}

/**
 * Converts the canonical Brain evidence pack into deterministic Opportunity
 * Intelligence evidence. It does not infer external demand or create another
 * analytics store: every output retains the source evidence ID.
 */
export const buildOpportunityEvidenceFromBrainPack = (input: {
 channelId: string
 evidencePack: AIBrainEvidencePack
 now?: Date
 limit?: number
}): OpportunityEvidence[] => {
 if (
  input.evidencePack.dataStatus === "missing" ||
  (input.evidencePack.channelId && input.evidencePack.channelId !== input.channelId)
 ) return []

 const now = input.now || new Date()
 const unique = new Map<string, AIBrainEvidenceVideo>()
 for (const video of [...input.evidencePack.topVideos, ...input.evidencePack.recentVideos]) {
  if (!unique.has(video.id)) unique.set(video.id, video)
 }
 const videos = [...unique.values()]
  // A catalog opportunity must have at least one measured metric. Video
  // metadata alone is not proof of performance or a gap.
  .filter((video) => metricCoverage(video) > 0)
 if (!videos.length) return []

 const observedViews = videos
  .map((video) => video.metrics.views)
  .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
 const maxViews = Math.max(1, ...observedViews)

 return videos
  .map((video): OpportunityEvidence & { _score: number } => {
   const views = typeof video.metrics.views === "number" && Number.isFinite(video.metrics.views)
    ? video.metrics.views
    : null
   const performance = views === null ? null : clamp(views / maxViews, 0, 1)
   const age = ageDays(video.publishedAt, now)
   const recency = age === null ? null : clamp(1 - Math.min(age, 365) / 365, 0, 1)
   const coverage = metricCoverage(video)

   // Missing performance/date inputs are excluded from the weighted average,
   // rather than being silently converted to zero and penalizing the video.
   const weighted = [
    { value: performance, weight: 0.6 },
    { value: recency, weight: 0.25 },
    { value: coverage, weight: 0.15 },
   ].filter((part): part is { value: number; weight: number } => part.value !== null)
   const totalWeight = weighted.reduce((sum, part) => sum + part.weight, 0)
   const score = totalWeight > 0
    ? weighted.reduce((sum, part) => sum + part.value * part.weight, 0) / totalWeight
    : 0

   return {
    id: `brain-catalog:${video.id}`,
    kind: "catalog_gap",
    channelId: input.channelId,
    videoId: video.id,
    entity: video.title,
    metric: "views",
    currentValue: views,
    baselineValue: null,
    relativeDelta: null,
    confidence: Math.round(clamp(coverage * 100)),
    impactScore: Math.round(clamp(score * 100)),
    evidenceIds: [video.evidenceId],
    _score: score,
   }
  })
  .sort((left, right) => right._score - left._score)
  .slice(0, input.limit ?? 8)
  .map(({ _score: _ignored, ...opportunity }) => opportunity)
}


const canonicalNumber = (row: Record<string, unknown>, keys: string[]): number | null => {
 for (const key of keys) {
  const value = row[key]
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
   const parsed = Number(value.replace(/[$,% ,]/g, ""))
   if (Number.isFinite(parsed)) return parsed
  }
 }
 return null
}

const canonicalText = (row: Record<string, unknown>, keys: string[]): string | null => {
 for (const key of keys) {
  const value = row[key]
  if (typeof value === "string" && value.trim()) return value.trim()
 }
 return null
}

/**
 * Canonical Opportunity Intelligence projection. It consumes the videos
 * dataset from the same analytics-canon bundle used by Brain quality and
 * statistics. Missing values stay null; each item retains the canonical row
 * evidence reference and selected reporting window via context.
 */
export const buildOpportunityEvidenceFromCanonicalBundle = (input: {
 channelId: string
 bundle: CanonicalIntelligenceEvidenceBundle
 now?: Date
 limit?: number
}): OpportunityEvidence[] => {
 const channelId = input.channelId.trim()
 if (!channelId || input.bundle.channelId !== channelId) return []
 const dataset = input.bundle.datasets.find((candidate) => candidate.id === "videos")
 if (!dataset || ["failed", "unavailable"].includes(dataset.status)) return []

 const rows = dataset.sampleRows
  .map((row, index) => ({
   row: row as Record<string, unknown>,
   evidenceId: dataset.evidenceRefs[index] || `${input.bundle.snapshotId}:videos:${index + 1}`,
  }))
  .filter(({ row }) => Boolean(canonicalText(row, ["videoId", "id"])))
  .filter(({ row }) => [
   canonicalNumber(row, ["views"]),
   canonicalNumber(row, ["watchTime", "watchTimeHours"]),
   canonicalNumber(row, ["averagePercentageViewed", "averageViewPercentage"]),
   canonicalNumber(row, ["subscribersGained", "netSubscribers"]),
   canonicalNumber(row, ["likes", "comments", "shares"]),
  ].some((value) => value !== null))
 if (!rows.length) return []

 const maxViews = Math.max(1, ...rows
  .map(({ row }) => canonicalNumber(row, ["views"]))
  .filter((value): value is number => value !== null))
 const now = input.now || new Date()

 return rows.map(({ row, evidenceId }): OpportunityEvidence & { _score: number } => {
  const videoId = canonicalText(row, ["videoId", "id"])!
  const title = canonicalText(row, ["title", "videoTitle", "name"]) || videoId
  const views = canonicalNumber(row, ["views"])
  const publishedAt = canonicalText(row, ["publishedAt", "uploadDate"])
  const age = ageDays(publishedAt, now)
  const performance = views === null ? null : clamp(views / maxViews, 0, 1)
  const recency = age === null ? null : clamp(1 - Math.min(age, 365) / 365, 0, 1)
  const measuredMetrics = [
   canonicalNumber(row, ["views"]),
   canonicalNumber(row, ["watchTime", "watchTimeHours"]),
   canonicalNumber(row, ["averagePercentageViewed", "averageViewPercentage"]),
   canonicalNumber(row, ["subscribersGained", "netSubscribers"]),
   canonicalNumber(row, ["likes", "comments", "shares"]),
  ]
  const coverage = measuredMetrics.filter((value) => value !== null).length / measuredMetrics.length
  const weighted = [
   { value: performance, weight: 0.6 },
   { value: recency, weight: 0.25 },
   { value: coverage, weight: 0.15 },
  ].filter((part): part is { value: number; weight: number } => part.value !== null)
  const weight = weighted.reduce((sum, part) => sum + part.weight, 0)
  const score = weight
   ? weighted.reduce((sum, part) => sum + part.value * part.weight, 0) / weight
   : coverage

  return {
   id: `canonical-catalog:${input.bundle.snapshotId}:${videoId}`,
   kind: "catalog_gap",
   channelId,
   videoId,
   entity: title,
   metric: "views",
   currentValue: views,
   baselineValue: null,
   relativeDelta: null,
   confidence: Math.round(clamp(coverage * 100)),
   impactScore: Math.round(clamp(score * 100)),
   evidenceIds: [evidenceId],
   provenance: {
    sourceOwner: "analytics-canon",
    sourceSnapshotId: input.bundle.snapshotId,
    datasetId: dataset.id,
    window: input.bundle.selectedWindow,
    datasetStatus: dataset.status,
   },
   _score: score,
  }
 })
  .sort((left, right) => right._score - left._score)
  .slice(0, input.limit ?? 8)
  .map(({ _score: _ignored, ...opportunity }) => opportunity)
}
