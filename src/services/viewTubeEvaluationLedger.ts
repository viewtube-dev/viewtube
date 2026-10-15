import { evaluateViewTubeControl } from "./viewTubeUserControls"

export type EvaluationOutcome = "pending" | "positive" | "neutral" | "negative"
export interface EvaluationRecord {
 id: string
 createdAt: number
 updatedAt: number
 channelId?: string | null
 projectId?: string | null
 source: string
 recommendation: string
 evidenceIds: string[]
 actionPacketId?: string | null
 sourceOutcomeIds?: string[]
 sourceRecordIds?: string[]
 traceIds?: string[]
 assetIds?: string[]
 publishedVideoId?: string | null
 contentBuildId?: string | null
 publishTransactionId?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 analyticsCheckpointIds?: string[]
 baselineSnapshotId?: string | null
 comparisonSnapshotId?: string | null
 selectedWindow?: string | null
 comparabilityStatus?: "comparable" | "partially_comparable" | "not_comparable" | "unknown"
 evidenceStatus?: "available" | "partial" | "stale" | "failed" | "unavailable"
 confounders?: string[]
 causalAssessment?: "observed_association" | "experimentally_supported" | "insufficient_evidence"
 idempotencyKey?: string | null
 outcome: EvaluationOutcome
 outcomeNote?: string
 metricsBefore?: Record<string, number>
 metricsAfter?: Record<string, number>
}
export interface WorkflowCandidate {
 id: string
 createdAt: number
 channelId?: string | null
 projectId?: string | null
 title: string
 toolIds: string[]
 reason: string
 evidenceRecordIds: string[]
 evaluationRecordId?: string | null
 /** Caller key for idempotent candidate creation within one evaluation/scope. */
 idempotencyKey?: string | null
 sourceOutcomeIds?: string[]
 evaluationOutcome?: Exclude<EvaluationOutcome, "pending">
 selectedWindow?: string | null
 comparabilityStatus?: EvaluationRecord["comparabilityStatus"]
 evidenceStatus?: EvaluationRecord["evidenceStatus"]
 /** Stable caller key for retry-safe candidate creation. */
 idempotencyKey?: string | null
 status: "candidate" | "approved" | "rejected"
 scope: "channel" | "global-experiment"
}

const EVAL_KEY = "viewtube:evaluation-ledger:v1"
const CANDIDATE_KEY = "viewtube:workflow-candidates:v1"
const read = <T,>(key: string): T[] => { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem(key) || "[]") as T[] } catch { return [] } }
const write = <T,>(key: string, values: T[]) => { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(values)) }

export const listEvaluationRecords = () => read<EvaluationRecord>(EVAL_KEY)
export const createEvaluationRecord = (input: Omit<EvaluationRecord,"id"|"createdAt"|"updatedAt"|"outcome">) => {
 if (!evaluateViewTubeControl("creator-learning").allowed) return null
 const records = listEvaluationRecords()
 if (input.idempotencyKey) {
  const existing = records.find((record) =>
   record.idempotencyKey === input.idempotencyKey &&
   record.channelId === (input.channelId || null) &&
   record.projectId === (input.projectId || null)
  )
  if (existing) return existing
 }
 const now = Date.now()
 const item: EvaluationRecord = { ...input, channelId: input.channelId || null, projectId: input.projectId || null, id: crypto.randomUUID(), createdAt: now, updatedAt: now, outcome: "pending" }
 write(EVAL_KEY, [item, ...records].slice(0, 5000))
 return item
}
export const resolveEvaluationRecord = (id: string, outcome: Exclude<EvaluationOutcome,"pending">, outcomeNote?: string, metricsAfter?: Record<string,number>) => {
 const records = listEvaluationRecords(); const found = records.find((r) => r.id === id); if (!found) return null
 const next = { ...found, outcome, outcomeNote, metricsAfter, updatedAt: Date.now() }; write(EVAL_KEY, records.map((r) => r.id === id ? next : r)); return next
}
export const listWorkflowCandidates = () => read<WorkflowCandidate>(CANDIDATE_KEY)
export const proposeWorkflowCandidate = (input: Omit<WorkflowCandidate,"id"|"createdAt"|"status">) => {
 if (!evaluateViewTubeControl("creator-learning").allowed) return null
 const item: WorkflowCandidate = { ...input, id: crypto.randomUUID(), createdAt: Date.now(), status: "candidate" }; write(CANDIDATE_KEY, [item, ...listWorkflowCandidates()].slice(0,1000)); return item
}
/**
 * Create a reviewable candidate only from a resolved evaluation with trustworthy evidence.
 * Candidate creation never approves or promotes durable Channel Knowledge.
 */
export const proposeEvaluationLearningCandidate = (
 evaluationRecordId: string,
 input: Omit<WorkflowCandidate, "id" | "createdAt" | "status" | "evaluationRecordId" | "sourceOutcomeIds" | "evaluationOutcome" | "evidenceRecordIds" | "selectedWindow" | "comparabilityStatus" | "evidenceStatus">,
) => {
 if (!evaluateViewTubeControl("creator-learning").allowed) return null
 const evaluation = listEvaluationRecords().find((record) => record.id === evaluationRecordId)
 if (!evaluation || evaluation.outcome === "pending") return null
 if (!evaluation.evidenceIds.some((id) => typeof id === "string" && id.trim().length > 0) || evaluation.evidenceStatus !== "available") return null
 if (evaluation.comparabilityStatus !== "comparable" && evaluation.causalAssessment !== "experimentally_supported") return null
 if (input.idempotencyKey) {
  const existing = listWorkflowCandidates().find((candidate) =>
   candidate.idempotencyKey === input.idempotencyKey &&
   candidate.evaluationRecordId === evaluation.id &&
   candidate.channelId === (input.channelId || null) &&
   candidate.projectId === (input.projectId || null)
  )
  if (existing) return existing
 }
 if (input.scope === "channel" && !input.channelId) return null
 // Never infer or broaden scope when an evaluation omitted its channel/project identity.
 if ((input.channelId || null) !== (evaluation.channelId || null)) return null
 if ((input.projectId || null) !== (evaluation.projectId || null)) return null
 if (input.idempotencyKey) {
  const existing = listWorkflowCandidates().find((candidate) =>
   candidate.idempotencyKey === input.idempotencyKey &&
   candidate.evaluationRecordId === evaluation.id &&
   (candidate.channelId || null) === (input.channelId || null) &&
   (candidate.projectId || null) === (input.projectId || null)
  )
  if (existing) return existing
 }
 const item: WorkflowCandidate = {
  ...input,
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  status: "candidate",
  evaluationRecordId: evaluation.id,
  sourceOutcomeIds: [...(evaluation.sourceOutcomeIds || [])],
  evaluationOutcome: evaluation.outcome,
  evidenceRecordIds: [...evaluation.evidenceIds],
  selectedWindow: evaluation.selectedWindow || null,
  comparabilityStatus: evaluation.comparabilityStatus,
  evidenceStatus: evaluation.evidenceStatus,
  idempotencyKey: input.idempotencyKey || null,
 }
 write(CANDIDATE_KEY, [item, ...listWorkflowCandidates()].slice(0, 1000))
 return item
}

export const reviewWorkflowCandidate = (id: string, status: "approved"|"rejected") => {
 const values = listWorkflowCandidates(); const found = values.find((v) => v.id === id); if (!found) return null
 const next = { ...found, status }; write(CANDIDATE_KEY, values.map((v) => v.id === id ? next : v)); return next
}
