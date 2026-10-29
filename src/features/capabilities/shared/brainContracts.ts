/**
 * Canonical contract types for roadmap "Priority 25" systems 1 and 2.
 *
 * These mirror the shapes the real Brain pipeline feeds into
 * `src/services/brain/BrainContextBroker.ts` (`buildBrainContextPack`) and
 * `BrainOrchestrator.ts` on the `consolidated-feature-integration` branch:
 *   - `AIBrainContextSnapshot` (channel label, inferred profile, evidence pack)
 *   - `BrainEvidenceQualityReport` (confidence, coverage, missingness, freshness, limitations)
 *   - `StatisticsIntelligenceSnapshot` / `AudienceIntelligenceSnapshot`
 *   - `CreatorBrainResponse` (headline / keyInsight / body / modules / actions / citations)
 *   - `BrainAnswerEvaluation` (the orchestrator's invented-number scan + unsupported-claims gate)
 *
 * They are typed declarations only (zero runtime imports), so nothing here creates a
 * second Brain runtime, evidence store or context store — canonical owners stay canonical.
 * When the target branch is wired, import the canonical types from `src/types` /
 * `src/services/brain/*` instead and delete the mirrors via this one file boundary.
 */

/** Per-video evidence item inside the snapshot's evidence pack. */
export interface EvidencePackVideo {
  videoId: string
  title: string
  publishedAt: string | null
  views: number | null
}

/** Canonical evidence pack supplied to a Brain turn (see BrainContextBroker evidence section). */
export interface BrainEvidencePack {
  packId: string
  channelLabel: string
  videos: EvidencePackVideo[]
  missingInputs: string[]
}

/** Inferred channel profile (from AIBrainContextSnapshot.inferredProfile). */
export interface InferredProfileView {
  niche: string | null
  contentPillars: string[]
  videoCount: number | null
  topEvidenceVideos: EvidencePackVideo[]
}

/** Channel identity shown verbatim from the snapshot — never invented. */
export interface ChannelSnapshotView {
  channelId: string | null
  label: string
}

export interface AIBrainContextSnapshotView {
  channel: ChannelSnapshotView
  inferredProfile: InferredProfileView
  evidencePack: BrainEvidencePack
}

/** BrainEvidenceQualityReport subset (mirrors the broker's EVIDENCE QUALITY section). */
export interface BrainEvidenceQualityView {
  confidence: "low" | "medium" | "high"
  coverageRatio: number
  scopeMatch: "exact" | "partial" | "none"
  evidenceReferenceCount: number
  missingness: {
    unavailableDatasetIds: string[]
    failedDatasetIds: string[]
    partialDatasetIds: string[]
  }
  freshness: {
    staleDatasetIds: string[]
  }
  limitations: string[]
}

/** BrainUserControls subset (mirrors the broker's CREATOR CONTROL POLICY section). */
export interface BrainUserControlsView {
  enabled: boolean
  personalization: boolean
  allowAnalytics: boolean
  learnFromInteractions: boolean
}

export interface CreatorControlsView {
  controls: BrainUserControlsView
}
