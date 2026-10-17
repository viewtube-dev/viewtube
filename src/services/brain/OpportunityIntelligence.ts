import type { AlgorithmSignal } from "./AlgorithmStrategyEngine"
import type { DerivedSignal } from "./EvidenceRecord"

export type OpportunityKind =
 | "emerging_search"
 | "catalog_gap"
 | "performance_candidate"
 | "audience_interest"
 | "session_adjacency"
 | "topic_resurgence"
 | "format_opportunity"
 | "packaging_opportunity"

export interface OpportunityEvidence {
 id: string
 kind: OpportunityKind
 channelId: string
 videoId?: string | null
 entity?: string | null
 metric?: string | null
 currentValue?: number | null
 baselineValue?: number | null
 relativeDelta?: number | null
 confidence: number
 impactScore: number
 evidenceIds: string[]
 context?: AlgorithmSignal["context"]
 provenance?: {
  sourceOwner: "analytics-canon" | "brain-evidence-pack"
  sourceSnapshotId?: string
  datasetId?: string
  window?: string
  datasetStatus?: string
 }
}

export const opportunityToDerivedSignal = (opportunity: OpportunityEvidence): DerivedSignal => ({
 id: `derived:opportunity:${opportunity.id}`,
 kind: "opportunity",
 channelId: opportunity.channelId,
 videoId: opportunity.videoId,
 label: `Opportunity: ${opportunity.entity || opportunity.kind.replaceAll("_", " ")}`,
 metric: opportunity.metric,
 currentValue: opportunity.currentValue,
 baselineValue: opportunity.baselineValue,
 delta: (
  typeof opportunity.currentValue === "number"
  && typeof opportunity.baselineValue === "number"
 )
  ? opportunity.currentValue - opportunity.baselineValue
  : null,
 relativeDelta: opportunity.relativeDelta,
 confidence: opportunity.confidence,
 impact: opportunity.impactScore,
 evidenceIds: [...new Set(opportunity.evidenceIds)],
 derivation: {
  method: "opportunity-evidence-normalization",
  version: "v1",
  deterministic: true,
 },
 metadata: {
  sourceKind: opportunity.kind,
  ...(opportunity.provenance ? { sourceOwner: opportunity.provenance.sourceOwner } : {}),
  ...(opportunity.provenance?.sourceSnapshotId ? { sourceSnapshotId: opportunity.provenance.sourceSnapshotId } : {}),
  ...(opportunity.provenance?.datasetId ? { datasetId: opportunity.provenance.datasetId } : {}),
  ...(opportunity.provenance?.window ? { window: opportunity.provenance.window } : {}),
  ...(opportunity.provenance?.datasetStatus ? { datasetStatus: opportunity.provenance.datasetStatus } : {}),
 },
})

export const opportunityToAlgorithmSignal = (opportunity: OpportunityEvidence): AlgorithmSignal => {
 const derived = opportunityToDerivedSignal(opportunity)
 const kind: AlgorithmSignal["kind"] = (() => {
  switch (opportunity.kind) {
   case "emerging_search": return "search_breakout"
   case "session_adjacency": return "session_opportunity"
   case "topic_resurgence": return "back_catalog_resurgence"
   case "packaging_opportunity": return "packaging_decline"
   case "audience_interest": return "traffic_expansion"
   case "format_opportunity": return "traffic_expansion"
   case "catalog_gap":
   case "performance_candidate": return "unknown"
  }
 })()

 return {
  id: `opportunity:${opportunity.id}`,
  origin: "opportunity",
  kind,
  channelId: opportunity.channelId,
  videoId: derived.videoId,
  entity: opportunity.entity,
  metric: derived.metric,
  currentValue: derived.currentValue,
  baselineValue: derived.baselineValue,
  relativeDelta: derived.relativeDelta,
  impactScore: derived.impact ?? opportunity.impactScore,
  confidence: derived.confidence,
  evidenceIds: derived.evidenceIds,
  context: opportunity.context,
 }
}

export const deriveOpportunitySignals = (opportunities: OpportunityEvidence[]): AlgorithmSignal[] =>
 opportunities.map(opportunityToAlgorithmSignal)


/** Versioned, in-memory handoff contract. Persistence remains owned by the canonical destination. */
export type OpportunityLifecycleState = "candidate" | "reviewed" | "validated" | "accepted" | "rejected" | "deferred" | "superseded"

export interface OpportunityTacticsPacket {
 schemaVersion: "vt-opportunity-tactics-handoff-v1"
 opportunityId: string
 channelId: string
 videoId: string | null
 entity: string | null
 metric: string | null
 kind: OpportunityKind
 validationState: "accepted"
 createdAt: string
 evidenceIds: string[]
 confidence: number
 impactScore: number
 currentValue: number | null
 baselineValue: number | null
 relativeDelta: number | null
 provenance: {
  sourceOwner: "analytics-canon" | "brain-evidence-pack" | null
  sourceSnapshotId: string | null
  datasetId: string | null
  window: string | null
  datasetStatus: string | null
 }
 limitations: string[]
}

export type OpportunityTacticsPacketResult =
 | { ok: true; packet: OpportunityTacticsPacket }
 | { ok: false; code: "opportunity_not_accepted" | "invalid_opportunity" | "missing_evidence" | "invalid_timestamp"; message: string }

/**
 * Build a safe transfer packet only after creator acceptance. This function is
 * pure: it neither persists a duplicate opportunity nor triggers downstream work.
 */
export const buildOpportunityTacticsPacket = (input: {
 opportunity: OpportunityEvidence
 lifecycleState: OpportunityLifecycleState
 createdAt: string
}): OpportunityTacticsPacketResult => {
 const { opportunity } = input
 if (input.lifecycleState !== "accepted") {
  return { ok: false, code: "opportunity_not_accepted", message: "The opportunity must be accepted before tactics can be proposed." }
 }
 if (!opportunity.id?.trim() || !opportunity.channelId?.trim()) {
  return { ok: false, code: "invalid_opportunity", message: "A canonical opportunity ID and channel ID are required." }
 }
 const timestamp = Date.parse(input.createdAt)
 if (!input.createdAt || !Number.isFinite(timestamp)) {
  return { ok: false, code: "invalid_timestamp", message: "A valid packet creation timestamp is required." }
 }
 const evidenceIds = [...new Set((opportunity.evidenceIds || []).filter((id) => typeof id === "string").map((id) => id.trim()).filter(Boolean))]
 if (!evidenceIds.length) {
  return { ok: false, code: "missing_evidence", message: "At least one canonical evidence reference is required." }
 }
 const limitations: string[] = []
 if (typeof opportunity.baselineValue !== "number" || !Number.isFinite(opportunity.baselineValue)
  || typeof opportunity.relativeDelta !== "number" || !Number.isFinite(opportunity.relativeDelta)) {
  limitations.push("Baseline and relative change are unknown.")
 }
 if (!opportunity.provenance?.sourceSnapshotId) limitations.push("Source snapshot identity is unavailable.")
 if (!opportunity.provenance?.window) limitations.push("Source reporting window is unavailable.")
 if (opportunity.provenance?.datasetStatus && opportunity.provenance.datasetStatus !== "available") {
  limitations.push("Source dataset is not fully available; review its status before acting.")
 }
 return {
  ok: true,
  packet: {
   schemaVersion: "vt-opportunity-tactics-handoff-v1",
   opportunityId: opportunity.id.trim(),
   channelId: opportunity.channelId.trim(),
   videoId: opportunity.videoId || null,
   entity: opportunity.entity || null,
   metric: opportunity.metric || null,
   kind: opportunity.kind,
   validationState: "accepted",
   createdAt: new Date(timestamp).toISOString(),
   evidenceIds,
   confidence: Math.max(0, Math.min(100, Number.isFinite(opportunity.confidence) ? opportunity.confidence : 0)),
   impactScore: Math.max(0, Math.min(100, Number.isFinite(opportunity.impactScore) ? opportunity.impactScore : 0)),
   currentValue: typeof opportunity.currentValue === "number" && Number.isFinite(opportunity.currentValue) ? opportunity.currentValue : null,
   baselineValue: typeof opportunity.baselineValue === "number" && Number.isFinite(opportunity.baselineValue) ? opportunity.baselineValue : null,
   relativeDelta: typeof opportunity.relativeDelta === "number" && Number.isFinite(opportunity.relativeDelta) ? opportunity.relativeDelta : null,
   provenance: {
    sourceOwner: opportunity.provenance?.sourceOwner || null,
    sourceSnapshotId: opportunity.provenance?.sourceSnapshotId || null,
    datasetId: opportunity.provenance?.datasetId || null,
    window: opportunity.provenance?.window || null,
    datasetStatus: opportunity.provenance?.datasetStatus || null,
   },
   limitations,
  },
 }
}

export interface TacticProposal {
 id: string
 sourceOpportunityId: string
 channelId: string
 evidenceIds: string[]
 targetOutcome: string
 actionSteps: string[]
 prerequisites: string[]
 expectedImpact: { hypothesis: string; confidence: number | null; horizon: string | null }
 risks: string[]
 successMetrics: Array<{ metricId: string; targetDirection: "increase" | "decrease" | "maintain"; guardrail: boolean }>
 approvalState: "pending" | "approved" | "rejected"
 operationId: string | null
}

/** Validate linkage and evidence before a tactic can be reviewed or routed. */
export const validateTacticProposal = (
 packet: OpportunityTacticsPacket,
 tactic: TacticProposal,
): string[] => {
 const errors: string[] = []
 if (packet.schemaVersion !== "vt-opportunity-tactics-handoff-v1" || packet.validationState !== "accepted") {
  errors.push("Source opportunity packet is not an accepted compatible version.")
 }
 if (tactic.sourceOpportunityId !== packet.opportunityId) {
  errors.push("Tactic source opportunity does not match the accepted opportunity.")
 }
 if (tactic.channelId !== packet.channelId) errors.push("Tactic channel does not match the accepted opportunity.")
 const evidence = new Set(packet.evidenceIds)
 if (!tactic.evidenceIds.length || tactic.evidenceIds.some((id) => !evidence.has(id))) {
  errors.push("Tactic references evidence outside the accepted opportunity packet.")
 }
 if (!tactic.targetOutcome.trim() || !tactic.actionSteps.some((step) => step.trim().length > 0)) {
  errors.push("A tactic needs a target outcome and at least one actionable step.")
 }
 if (!tactic.successMetrics.length || tactic.successMetrics.some((metric) => !metric.metricId.trim())) {
  errors.push("A tactic needs at least one named success metric.")
 }
 if (tactic.expectedImpact.confidence !== null
  && (!Number.isFinite(tactic.expectedImpact.confidence) || tactic.expectedImpact.confidence < 0 || tactic.expectedImpact.confidence > 1)) {
  errors.push("Expected-impact confidence must use the 0..1 scale or remain unknown.")
 }
 return errors
}

/** Approval and an idempotency key are mandatory before a downstream write. */
export const canDispatchTacticProposal = (
 packet: OpportunityTacticsPacket,
 tactic: TacticProposal,
): { allowed: boolean; reasons: string[] } => {
 const reasons = validateTacticProposal(packet, tactic)
 if (tactic.approvalState !== "approved") reasons.push("Creator approval is required before dispatch.")
 if (tactic.approvalState === "rejected") reasons.push("Rejected tactics cannot be dispatched.")
 if (!tactic.operationId?.trim()) reasons.push("A stable operation/idempotency identity is required before dispatch.")
 return { allowed: reasons.length === 0, reasons: [...new Set(reasons)] }
}
