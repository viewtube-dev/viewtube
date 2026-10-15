import type { BrainEvidenceHealth } from "./BrainEvidenceContract"
import type { ChannelKnowledgeRecord } from "./ChannelKnowledgeProjection"

export interface BrainHealthSnapshotInput {
 evidenceHealth: BrainEvidenceHealth | null
 knowledgeRecords: ChannelKnowledgeRecord[]
 evaluationBacklog: {
  due: number
  overdue: number
  unattributedOutcomes: number
 }
 learningCandidates: {
  pendingReview: number
  held: number
  rejected: number
 }
 generatedAt?: string
}

export interface BrainHealthSnapshot {
 version: "vt-brain-health-snapshot-v1"
 generatedAt: string
 status: "healthy" | "attention" | "insufficient_data"
 evidence: {
  confidence: BrainEvidenceHealth["confidence"] | "unavailable"
  coverageRatio: number | null
  missingCount: number
  staleCount: number
  contradictionCount: number
  scopeMismatchCount: number
  limitations: string[]
 }
 knowledge: {
  active: number
  stale: number
  contradictory: number
  superseded: number
  hypotheses: number
 }
 evaluation: {
  due: number
  overdue: number
  unattributedOutcomes: number
 }
 learning: {
  pendingReview: number
  held: number
  rejected: number
 }
 alerts: string[]
}

/** Read-only health projection. Counts source-owned records; it never promotes learning. */
export const buildBrainHealthSnapshot = (input: BrainHealthSnapshotInput): BrainHealthSnapshot => {
 const records = input.knowledgeRecords
 const evidence = input.evidenceHealth
 const knowledge = {
  active: records.filter((record) => record.lifecycleState === "active").length,
  stale: records.filter((record) => record.lifecycleState === "stale").length,
  contradictory: records.filter((record) => record.contradiction).length,
  superseded: records.filter((record) => record.lifecycleState === "superseded").length,
  hypotheses: records.filter((record) => record.knowledgeClass === "HYPOTHESIS" || record.lifecycleState === "hypothesis").length,
 }
 const evaluation = {
  due: Math.max(0, Math.floor(input.evaluationBacklog.due)),
  overdue: Math.max(0, Math.floor(input.evaluationBacklog.overdue)),
  unattributedOutcomes: Math.max(0, Math.floor(input.evaluationBacklog.unattributedOutcomes)),
 }
 const learning = {
  pendingReview: Math.max(0, Math.floor(input.learningCandidates.pendingReview)),
  held: Math.max(0, Math.floor(input.learningCandidates.held)),
  rejected: Math.max(0, Math.floor(input.learningCandidates.rejected)),
 }
 const alerts: string[] = []
 if (!evidence) alerts.push("Evidence health is unavailable; performance claims should be treated as unverified.")
 else {
  if (evidence.confidence === "insufficient") alerts.push("Evidence coverage is insufficient for confident recommendations.")
  if (evidence.missingIds.length) alerts.push(`${evidence.missingIds.length} evidence item(s) are missing.`)
  if (evidence.staleIds.length) alerts.push(`${evidence.staleIds.length} evidence item(s) are stale.`)
  if (evidence.conflictingClaimKeys.length) alerts.push(`${evidence.conflictingClaimKeys.length} evidence claim(s) conflict.`)
  if (evidence.scopeMismatchIds.length) alerts.push(`${evidence.scopeMismatchIds.length} evidence item(s) have a scope mismatch.`)
 }
 if (knowledge.stale) alerts.push(`${knowledge.stale} knowledge record(s) need stale-knowledge review.`)
 if (knowledge.contradictory) alerts.push(`${knowledge.contradictory} knowledge record(s) are marked contradictory.`)
 if (evaluation.overdue) alerts.push(`${evaluation.overdue} outcome evaluation(s) are overdue.`)
 if (evaluation.unattributedOutcomes) alerts.push(`${evaluation.unattributedOutcomes} outcome(s) lack verified attribution.`)
 if (learning.pendingReview) alerts.push(`${learning.pendingReview} learning candidate(s) await review.`)

 const hasActionableAlert = alerts.length > 0
 const status = !evidence || evidence.confidence === "insufficient"
  ? "insufficient_data"
  : hasActionableAlert ? "attention" : "healthy"

 return {
  version: "vt-brain-health-snapshot-v1",
  generatedAt: input.generatedAt || new Date().toISOString(),
  status,
  evidence: {
   confidence: evidence?.confidence || "unavailable",
   coverageRatio: evidence?.coverageRatio ?? null,
   missingCount: evidence?.missingIds.length || 0,
   staleCount: evidence?.staleIds.length || 0,
   contradictionCount: evidence?.conflictingClaimKeys.length || 0,
   scopeMismatchCount: evidence?.scopeMismatchIds.length || 0,
   limitations: [...(evidence?.limitations || [])],
  },
  knowledge,
  evaluation,
  learning,
  alerts,
 }
}
