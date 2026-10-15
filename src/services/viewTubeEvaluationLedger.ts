import type { ContentBuildPublicationIdentity } from "./asset-engine/contracts"
import { listContentBuildEvents } from "./asset-engine/ContentBuildRepository"
import { listAssetOutcomes } from "./brain/assetOutcomes"
import { getCurrentCanonicalIntelligenceDatasetRows, getCurrentCanonicalIntelligenceEvidence, type AnalyticsWindow } from "./analytics-canon"
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
 contentBuildId?: string | null
 videoPackageId?: string | null
 publishTransactionId?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 projectAssociationStatus?: ContentBuildPublicationIdentity["projectAssociationStatus"]
 selectedVariantAssetIds?: string[]
 correlationId?: string | null
 sourceOutcomeIds?: string[]
 sourceRecordIds?: string[]
 traceIds?: string[]
 assetIds?: string[]
 publishedVideoId?: string | null
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
 metricsBefore?: Record<string, number | null>
 metricsAfter?: Record<string, number | null>
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

/**
 * Create a post-publication evaluation only when the published video is present
 * in the same current canonical analytics snapshot and channel scope. Missing
 * rows are not converted to zeroes or guessed from title/date similarity.
 */
export const createPublicationEvaluationRecord = (input: {
 publicationIdentity: ContentBuildPublicationIdentity
 selectedWindow: AnalyticsWindow
 source: string
 recommendation: string
 baselineSnapshotId?: string | null
 comparabilityStatus?: EvaluationRecord["comparabilityStatus"]
 confounders?: string[]
 causalAssessment?: EvaluationRecord["causalAssessment"]
}) => {
 const identity = input.publicationIdentity
 if (!identity.youtubeVideoId || !identity.publishTransactionId || !identity.approvedSnapshotId || !identity.approvedSnapshotHash) return null
 const evidence = getCurrentCanonicalIntelligenceEvidence({ window: input.selectedWindow, sectionIds: ["executive-summary"] })
 const currentRows = getCurrentCanonicalIntelligenceDatasetRows("videos")
 const dataset = currentRows.dataset
 if (!dataset || currentRows.snapshotId !== evidence.snapshotId || currentRows.channelId !== identity.channelId || evidence.channelId !== identity.channelId || dataset.channelId !== identity.channelId) return null
 const rowIndex = dataset.rows.findIndex((row) =>
  ["videoId", "video_id", "videoIdExternal", "video_id_external", "id"].some((key) => row[key] === identity.youtubeVideoId)
 )
 if (rowIndex < 0) return null
 const manifest = evidence.datasets.find((item) => item.id === "videos")
 const publicationOutcomes = listAssetOutcomes().filter((outcome) =>
  outcome.channelId === identity.channelId &&
  outcome.publishTransactionId === identity.publishTransactionId &&
  outcome.publishedVideoId === identity.youtubeVideoId
 )
 const analyticsCheckpointIds = listContentBuildEvents(identity.contentBuildId)
  .filter((event) => {
   if (event.eventType !== "analytics.checkpoint") return false
   const metadata = event.metadata as Record<string, unknown> | undefined
   return metadata?.youtubeVideoId === identity.youtubeVideoId || metadata?.publishedVideoId === identity.youtubeVideoId
  })
  .map((event) => event.id)
 const evidenceStatus: EvaluationRecord["evidenceStatus"] = manifest?.status === "available"
  ? "available"
  : manifest?.status === "partial" ? "partial"
  : manifest?.status === "stale" ? "stale"
  : manifest?.status === "failed" ? "failed"
  : "unavailable"
 return createEvaluationRecord({
  channelId: identity.channelId,
  projectId: identity.projectId,
  source: input.source,
  recommendation: input.recommendation,
  evidenceIds: [`${dataset.snapshotId}:videos:${rowIndex + 1}`],
  contentBuildId: identity.contentBuildId,
  videoPackageId: identity.videoPackageId,
  publishTransactionId: identity.publishTransactionId,
  publishedVideoId: identity.youtubeVideoId,
  contentBuildId: identity.contentBuildId,
  videoPackageId: identity.videoPackageId,
  publishTransactionId: identity.publishTransactionId,
  approvedSnapshotId: identity.approvedSnapshotId,
  baselineSnapshotId: input.baselineSnapshotId || null,
  comparisonSnapshotId: dataset.snapshotId,
  approvedSnapshotHash: identity.approvedSnapshotHash,
  projectAssociationStatus: identity.projectAssociationStatus,
  selectedVariantAssetIds: [...identity.selectedVariantAssetIds],
  correlationId: identity.correlationId,
  sourceOutcomeIds: publicationOutcomes.map((outcome) => outcome.id),
  sourceRecordIds: [identity.publishTransactionId, ...publicationOutcomes.map((outcome) => outcome.id)],
  traceIds: [...new Set(publicationOutcomes.map((outcome) => outcome.traceId))],
  assetIds: [...identity.selectedVariantAssetIds],
  analyticsCheckpointIds,
  selectedWindow: evidence.selectedWindow,
  comparabilityStatus: input.comparabilityStatus || "unknown",
  evidenceStatus,
  confounders: [...(input.confounders || [])],
  causalAssessment: input.causalAssessment || "insufficient_evidence",
  idempotencyKey: `publication-evaluation:${identity.publishTransactionId}:${dataset.snapshotId}:${evidence.selectedWindow}`,
 })
}

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
export const resolveEvaluationRecord = (id: string, outcome: Exclude<EvaluationOutcome,"pending">, outcomeNote?: string, metricsAfter?: Record<string,number | null>) => {
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
