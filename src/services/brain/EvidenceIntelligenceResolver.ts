import type { AIBrainEvidencePack } from "../../types"
import {
 getCurrentCanonicalIntelligenceEvidence,
 type CanonicalIntelligenceEvidenceBundle,
} from "../analytics-canon"
import {
 buildBrainEvidenceQuality,
 type BrainEvidenceQualityReport,
} from "./BrainEvidenceQuality"
import {
 buildStatisticsIntelligence,
 type StatisticsIntelligenceSnapshot,
} from "./StatisticsIntelligence"
import {
 buildAudienceIntelligence,
 type AudienceIntelligenceSnapshot,
} from "./AudienceIntelligence"
import {
 buildOpportunityEvidenceFromBrainPack,
 buildOpportunityEvidenceFromCanonicalBundle,
} from "./OpportunityEvidenceAdapter"
import type { OpportunityEvidence } from "./OpportunityIntelligence"
import { projectCanonicalEvidenceRecords, type EvidenceRecord } from "./EvidenceRecord"
import type { DeterministicAnalyticsInsight } from "./DeterministicAnalyticsInsights"
import { buildBrainAnalyticsFindingContext, type BrainAnalyticsFindingContext } from "./AnalyticsIntelligenceWorkflow"
import { buildCurrentCanonicalAnalyticsInsights } from "./CurrentCanonicalAnalyticsInsights"

export const EVIDENCE_INTELLIGENCE_VERSION = "vt-evidence-intelligence-v1" as const

type AnalyticsWindow = CanonicalIntelligenceEvidenceBundle["selectedWindow"]

export interface ResolveEvidenceIntelligenceInput {
 channelId?: string | null
 window?: AnalyticsWindow
 sectionIds?: string[]
 includeAudience?: boolean
 includeOpportunities?: boolean
 /** Optional findings computed by the deterministic analytics layer; never model-authored. */
 deterministicInsights?: DeterministicAnalyticsInsight[]
 /** Generate trends only from full current canonical daily rows matching this evidence snapshot. */
 includeCurrentTrends?: boolean
 brainEvidencePack?: AIBrainEvidencePack | null
}

export interface EvidenceIntelligenceEnvelope {
 version: typeof EVIDENCE_INTELLIGENCE_VERSION
 channelId: string | null
 canonicalEvidence: CanonicalIntelligenceEvidenceBundle
 evidenceRecords: EvidenceRecord[]
 evidenceQuality: BrainEvidenceQualityReport
 scopeUsable: boolean
 statisticsIntelligence: StatisticsIntelligenceSnapshot | null
 audienceIntelligence: AudienceIntelligenceSnapshot | null
 opportunityEvidence: OpportunityEvidence[]
 analyticsFindingContext: BrainAnalyticsFindingContext
 provenance: {
  analyticsOwner: "analytics-canon"
  sourceSnapshotId: string
  opportunitySource: "analytics-canon" | "brain-evidence-pack" | null
 }
}

export interface EvidenceIntelligenceResolverDependencies {
 getCanonicalEvidence: (input: {
  window?: AnalyticsWindow
  sectionIds?: string[]
  maximumRowsPerDataset?: number
  maximumCharacters?: number
 }) => CanonicalIntelligenceEvidenceBundle
 buildQuality: (
  bundle: CanonicalIntelligenceEvidenceBundle,
  options?: { expectedChannelId?: string | null },
 ) => BrainEvidenceQualityReport
 buildStatistics: (
  bundle: CanonicalIntelligenceEvidenceBundle,
 ) => StatisticsIntelligenceSnapshot
 buildAudience: (
  evidence: CanonicalIntelligenceEvidenceBundle,
  statistics: StatisticsIntelligenceSnapshot,
 ) => AudienceIntelligenceSnapshot
 buildOpportunities: (input: {
  channelId: string
  evidencePack: AIBrainEvidencePack
  limit?: number
 }) => OpportunityEvidence[]
 buildCanonicalOpportunities?: (input: {
  channelId: string
  bundle: CanonicalIntelligenceEvidenceBundle
  limit?: number
 }) => OpportunityEvidence[]
 projectEvidence: (bundle: CanonicalIntelligenceEvidenceBundle) => EvidenceRecord[]
}

const DEFAULT_DEPENDENCIES: EvidenceIntelligenceResolverDependencies = {
 getCanonicalEvidence: getCurrentCanonicalIntelligenceEvidence,
 buildQuality: buildBrainEvidenceQuality,
 buildStatistics: buildStatisticsIntelligence,
 buildAudience: buildAudienceIntelligence,
 buildOpportunities: buildOpportunityEvidenceFromBrainPack,
 buildCanonicalOpportunities: buildOpportunityEvidenceFromCanonicalBundle,
 projectEvidence: projectCanonicalEvidenceRecords,
}

/**
 * Read-only Brain runtime projection over canonical evidence owners.
 *
 * analytics-canon remains the analytics source of truth. The caller may request
 * a reporting window and task-specific dataset sections, but all deterministic
 * quality/statistics/audience projections in this envelope share one canonical
 * snapshot. Scope mismatches fail closed for every analytics-derived projection.
 */
export const resolveEvidenceIntelligence = (
 input: ResolveEvidenceIntelligenceInput,
 dependencies: EvidenceIntelligenceResolverDependencies = DEFAULT_DEPENDENCIES,
): EvidenceIntelligenceEnvelope => {
 const canonicalEvidence = dependencies.getCanonicalEvidence({
  window: input.window,
  sectionIds: input.sectionIds,
  maximumRowsPerDataset: input.includeOpportunities ? 8 : input.includeAudience ? 5 : 0,
  maximumCharacters: input.includeAudience || input.includeOpportunities ? 16_000 : 12_000,
 })
 const evidenceQuality = dependencies.buildQuality(canonicalEvidence, {
  expectedChannelId: input.channelId,
 })
 const scopeUsable = Boolean(input.channelId && evidenceQuality.scopeMatch === "exact")
 const evidenceRecords = scopeUsable
  ? dependencies.projectEvidence(canonicalEvidence)
  : []
 const statisticsIntelligence = scopeUsable
  ? dependencies.buildStatistics(canonicalEvidence)
  : null
 const audienceIntelligence = scopeUsable && input.includeAudience && statisticsIntelligence
  ? dependencies.buildAudience(canonicalEvidence, statisticsIntelligence)
  : null
 const channelId = String(input.channelId || "").trim() || null
 const currentTrends = scopeUsable && input.includeCurrentTrends
  ? buildCurrentCanonicalAnalyticsInsights({
   channelId,
   expectedSnapshotId: canonicalEvidence.snapshotId,
  }).findings
  : []
 const analyticsFindingContext = buildBrainAnalyticsFindingContext({
  expectedChannelId: channelId,
  canonicalChannelId: canonicalEvidence.channelId,
  findings: scopeUsable ? [...(input.deterministicInsights || []), ...currentTrends] : [],
 })
 const opportunityPackScopeUsable = Boolean(
  scopeUsable
  && channelId
  && input.brainEvidencePack
  && (!input.brainEvidencePack.channelId || input.brainEvidencePack.channelId === channelId),
 )
 const usesCanonicalOpportunitySource = Boolean(dependencies.buildCanonicalOpportunities)
 const opportunityEvidence = input.includeOpportunities && scopeUsable && channelId
  ? dependencies.buildCanonicalOpportunities
   ? dependencies.buildCanonicalOpportunities({ channelId, bundle: canonicalEvidence })
   : opportunityPackScopeUsable && input.brainEvidencePack
    ? dependencies.buildOpportunities({ channelId, evidencePack: input.brainEvidencePack })
    : []
  : []

 return {
  version: EVIDENCE_INTELLIGENCE_VERSION,
  channelId,
  canonicalEvidence,
  evidenceRecords,
  evidenceQuality,
  scopeUsable,
  statisticsIntelligence,
  audienceIntelligence,
  opportunityEvidence,
  analyticsFindingContext,
  provenance: {
   analyticsOwner: "analytics-canon",
   sourceSnapshotId: canonicalEvidence.snapshotId,
   opportunitySource: opportunityEvidence.length ? (usesCanonicalOpportunitySource ? "analytics-canon" : "brain-evidence-pack") : null,
  },
 }
}
