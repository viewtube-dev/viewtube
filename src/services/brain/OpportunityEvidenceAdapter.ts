import type { AIBrainEvidencePack, AIBrainEvidenceVideo } from "../../types"
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
