/**
 * Channel Intelligence Engine — pure view-model core (roadmap item 1).
 *
 * Derives the engine's coherent view (patterns, audience summary, data-gap
 * recommendations, missing-input inventory, coverage) from the canonical Brain
 * snapshot contracts in `shared/brainContracts.ts` — the same shapes
 * `BrainContextBroker.buildBrainContextPack` consumes on the target branch.
 *
 * Pure functions only: no fetching, no persistence, no second analytics engine.
 * All recommendations cite the evidence (dataset/video IDs) that motivated them.
 */
import type {
  AIBrainContextSnapshotView,
  BrainEvidenceQualityView,
  BrainUserControlsView,
} from "../shared/brainContracts"
import type { ChannelIntelligenceSourceData } from "../shared/capabilityAdapter"

export interface PatternFinding {
  id: string
  kind: "momentum" | "consistency" | "outlier" | "cadence"
  title: string
  detail: string
  /** Canonical evidence refs (video/dataset IDs) backing this finding. */
  evidenceRefs: string[]
  confidence: "low" | "medium" | "high"
}

export interface AudienceSummaryView {
  confidence: "low" | "medium" | "high"
  window: string | null
  signals: Array<{ kind: string; label: string; detail: string; evidenceRef: string | null }>
  missingEvidence: string[]
  evidenceBoundary: string[]
}

export interface DataGapRecommendation {
  id: string
  /** Missing dataset/input ID the creator should connect to strengthen the picture. */
  missingInputId: string
  title: string
  rationale: string
  severity: "low" | "medium" | "high"
}

export interface IntelligenceCoverage {
  evidenceReferenceCount: number
  coverageRatio: number
  scopeMatch: "exact" | "partial" | "none" | "unreported"
  confidence: "low" | "medium" | "high" | "unreported"
  staleDatasetIds: string[]
  failedDatasetIds: string[]
  partialDatasetIds: string[]
}

export interface ChannelIntelligenceView {
  channelId: string | null
  generatedAt: string
  channelLabel: string
  patterns: PatternFinding[]
  audienceSummary: AudienceSummaryView | null
  recommendations: DataGapRecommendation[]
  missingInputs: string[]
  coverage: IntelligenceCoverage
  /** Analytics disabled by creator controls — the engine must not infer private metrics. */
  analyticsDisabled: boolean
  limitations: string[]
}

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

/** Videos with known view counts, newest-publish first (snapshot order is not guaranteed). */
const withViews = (snapshot: AIBrainContextSnapshotView) =>
  snapshot.evidencePack.videos
    .filter((video) => typeof video.views === "number")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))

/**
 * Momentum: compare the recent half of evidenced videos against the older half.
 * Only reported when both halves have data — never inferred from missing views.
 */
export function derivePatterns(
  snapshot: AIBrainContextSnapshotView,
  quality: BrainEvidenceQualityView | null,
): PatternFinding[] {
  const findings: PatternFinding[] = []
  const videos = withViews(snapshot)
  if (videos.length >= 4) {
    const half = Math.floor(videos.length / 2)
    const recent = videos.slice(0, half)
    const older = videos.slice(half)
    const recentAvg = recent.reduce((sum, v) => sum + (v.views ?? 0), 0) / recent.length
    const olderAvg = older.reduce((sum, v) => sum + (v.views ?? 0), 0) / older.length
    if (olderAvg > 0) {
      const ratio = recentAvg / olderAvg
      const direction = ratio >= 1.25 ? "up" : ratio <= 0.8 ? "down" : "flat"
      findings.push({
        id: "momentum:recent-vs-older",
        kind: "momentum",
        title:
          direction === "up"
            ? "Recent videos are outperforming older ones"
            : direction === "down"
              ? "Recent videos are underperforming older ones"
              : "Recent and older videos perform at a similar level",
        detail: `Median-aware comparison across ${videos.length} evidenced videos: recent-half average ${Math.round(recentAvg).toLocaleString()} views vs older-half average ${Math.round(olderAvg).toLocaleString()} views.`,
        evidenceRefs: videos.map((video) => video.videoId),
        confidence: quality ? quality.confidence : "low",
      })
    }
  }

  const allViews = snapshot.evidencePack.videos
    .map((video) => video.views)
    .filter((value): value is number => typeof value === "number")
  if (allViews.length >= 3) {
    const med = median(allViews)
    const spread = med > 0 ? Math.max(...allViews) / Math.max(1, Math.min(...allViews)) : 0
    findings.push({
      id: "consistency:view-spread",
      kind: "consistency",
      title:
        spread > 4
          ? "View counts vary widely between videos"
          : "View counts are relatively consistent across videos",
      detail: `Median ${Math.round(med).toLocaleString()} views across ${allViews.length} evidenced videos; top/bottom spread ${spread.toFixed(1)}×.`,
      evidenceRefs: snapshot.evidencePack.videos.map((video) => video.videoId),
      confidence: quality ? quality.confidence : "low",
    })

    const outliers = snapshot.evidencePack.videos.filter(
      (video) => typeof video.views === "number" && med > 0 && video.views > med * 3,
    )
    for (const video of outliers) {
      findings.push({
        id: `outlier:${video.videoId}`,
        kind: "outlier",
        title: `Top outlier: “${video.title}”`,
        detail: `${(video.views ?? 0).toLocaleString()} views — more than 3× the evidenced median (${Math.round(med).toLocaleString()}).`,
        evidenceRefs: [video.videoId],
        confidence: "medium",
      })
    }
  }

  if (snapshot.inferredProfile.contentPillars.length > 0) {
    findings.push({
      id: "cadence:content-pillars",
      kind: "cadence",
      title: `Content pillars: ${snapshot.inferredProfile.contentPillars.join(", ")}`,
      detail: `Inferred from ${snapshot.inferredProfile.videoCount ?? "an unknown number of"} known videos in the evidence pack.`,
      evidenceRefs: snapshot.evidencePack.videos.map((video) => video.videoId),
      confidence: "medium",
    })
  }
  return findings
}

/**
 * Audience summary from the evidence the snapshot actually carries. This pure
 * core never fabricates demographics — when the canonical AudienceIntelligence
 * snapshot is absent, the summary is null and the gap is surfaced instead.
 */
export function deriveAudienceSummary(
  snapshot: AIBrainContextSnapshotView,
  quality: BrainEvidenceQualityView | null,
): AudienceSummaryView | null {
  const missing = quality
    ? [
        ...quality.missingness.unavailableDatasetIds,
        ...quality.missingness.failedDatasetIds,
        ...quality.missingness.partialDatasetIds,
      ]
    : [...snapshot.evidencePack.missingInputs]
  const signals = snapshot.evidencePack.videos.slice(0, 5).map((video) => ({
    kind: "video",
    label: video.title,
    detail:
      typeof video.views === "number"
        ? `${video.views.toLocaleString()} views`
        : "views unknown in evidence pack",
    evidenceRef: video.videoId,
  }))
  if (signals.length === 0 && missing.length === 0) return null
  return {
    confidence: quality ? quality.confidence : "low",
    window: null,
    signals,
    missingEvidence: missing,
    evidenceBoundary: [
      "Audience demographics require the canonical AudienceIntelligence dataset; this view only summarizes evidenced video performance.",
    ],
  }
}

/** Data-gap recommendations: every missing input becomes an actionable, cited ask. */
export function deriveRecommendations(
  snapshot: AIBrainContextSnapshotView,
  quality: BrainEvidenceQualityView | null,
): DataGapRecommendation[] {
  const recommendations: DataGapRecommendation[] = []
  const seen = new Set<string>()
  const push = (missingInputId: string, title: string, rationale: string, severity: DataGapRecommendation["severity"]) => {
    if (seen.has(missingInputId)) return
    seen.add(missingInputId)
    recommendations.push({ id: `gap:${missingInputId}`, missingInputId, title, rationale, severity })
  }

  for (const missing of snapshot.evidencePack.missingInputs) {
    push(
      missing,
      `Connect missing input: ${missing}`,
      `The intelligence view is weaker without “${missing}” — it is listed as missing in the evidence pack.`,
      "medium",
    )
  }
  if (quality) {
    for (const id of quality.missingness.unavailableDatasetIds) {
      push(id, `Dataset unavailable: ${id}`, "Reported unavailable by the evidence quality report.", "high")
    }
    for (const id of quality.missingness.failedDatasetIds) {
      push(id, `Dataset failed: ${id}`, "The dataset load failed; re-authorization or a retry may recover it.", "high")
    }
    for (const id of quality.missingness.partialDatasetIds) {
      push(id, `Dataset partial: ${id}`, "Only part of this dataset was available, which narrows the conclusions it can support.", "medium")
    }
    for (const stale of quality.freshness.staleDatasetIds) {
      push(stale, `Dataset stale: ${stale}`, "This dataset is stale; refresh it before treating derived patterns as current.", "low")
    }
  }
  return recommendations
}

export function deriveMissingInputs(
  snapshot: AIBrainContextSnapshotView,
  quality: BrainEvidenceQualityView | null,
): string[] {
  const merged = new Set(snapshot.evidencePack.missingInputs)
  if (quality) {
    for (const id of [
      ...quality.missingness.unavailableDatasetIds,
      ...quality.missingness.failedDatasetIds,
      ...quality.missingness.partialDatasetIds,
    ]) {
      merged.add(id)
    }
  }
  return Array.from(merged).sort()
}

export function deriveCoverage(
  snapshot: AIBrainContextSnapshotView,
  quality: BrainEvidenceQualityView | null,
): IntelligenceCoverage {
  return {
    evidenceReferenceCount: quality ? quality.evidenceReferenceCount : snapshot.evidencePack.videos.length,
    coverageRatio: quality ? quality.coverageRatio : 0,
    scopeMatch: quality ? quality.scopeMatch : "unreported",
    confidence: quality ? quality.confidence : "unreported",
    staleDatasetIds: quality ? [...quality.freshness.staleDatasetIds] : [],
    failedDatasetIds: quality ? [...quality.missingness.failedDatasetIds] : [],
    partialDatasetIds: quality ? [...quality.missingness.partialDatasetIds] : [],
  }
}

/** Full engine view-model from one canonical source snapshot. */
export function buildChannelIntelligenceView(
  source: ChannelIntelligenceSourceData,
  controls: BrainUserControlsView,
): ChannelIntelligenceView {
  const generatedAt = new Date().toISOString()
  if (!controls.allowAnalytics) {
    return {
      channelId: source.snapshot.channel.channelId,
      generatedAt,
      channelLabel: source.snapshot.channel.label,
      patterns: [],
      audienceSummary: null,
      recommendations: [],
      missingInputs: deriveMissingInputs(source.snapshot, source.evidenceQuality),
      coverage: deriveCoverage(source.snapshot, source.evidenceQuality),
      analyticsDisabled: true,
      limitations: [
        "Analytics evidence access is disabled by the creator in Brain User Controls. Private channel metrics are not inferred or quoted.",
      ],
    }
  }
  return {
    channelId: source.snapshot.channel.channelId,
    generatedAt,
    channelLabel: source.snapshot.channel.label,
    patterns: derivePatterns(source.snapshot, source.evidenceQuality),
    audienceSummary: deriveAudienceSummary(source.snapshot, source.evidenceQuality),
    recommendations: deriveRecommendations(source.snapshot, source.evidenceQuality),
    missingInputs: deriveMissingInputs(source.snapshot, source.evidenceQuality),
    coverage: deriveCoverage(source.snapshot, source.evidenceQuality),
    analyticsDisabled: false,
    limitations: source.evidenceQuality ? [...source.evidenceQuality.limitations] : [],
  }
}
