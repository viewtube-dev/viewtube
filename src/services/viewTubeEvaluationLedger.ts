import type { ContentBuildPublicationIdentity } from "./asset-engine/contracts"
import { appendContentBuildEvent, listContentBuildEvents } from "./asset-engine/ContentBuildRepository"
import { linkAssetOutcomeToPublication, listAssetOutcomes } from "./brain/assetOutcomes"
import { getCurrentCanonicalIntelligenceDatasetRows, getCurrentCanonicalIntelligenceEvidence, type AnalyticsWindow } from "./analytics-canon"
import { captureAIBrainLearningEvent } from "./aiBrainSelfImprovement"
import { promoteBrainClaim, rebuildAffectedToolContextPacks } from "./brain/BrainMemoryClaims"
import { readBrainUserControls } from "./brain/BrainUserControls"
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
 workflowId?: string | null
 recommendationId?: string | null
 experimentId?: string | null
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
 actionPacketId?: string | null
 workflowId?: string | null
 recommendationId?: string | null
 experimentId?: string | null
 contentBuildId?: string | null
 publishTransactionId?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 analyticsCheckpointIds?: string[]
 sourceRecordIds?: string[]
 traceIds?: string[]
 assetIds?: string[]
 publishedVideoIds?: string[]
 sourceOutcomeIds?: string[]
 evaluationOutcome?: Exclude<EvaluationOutcome, "pending">
 selectedWindow?: string | null
 comparabilityStatus?: EvaluationRecord["comparabilityStatus"]
 evidenceStatus?: EvaluationRecord["evidenceStatus"]
 /** Stable caller key for retry-safe candidate creation. */
 idempotencyKey?: string | null
 reviewedBy?: string | null
 reviewedAt?: number
 promotedClaimId?: string | null
 promotedAt?: number
 supportingEvaluationIds?: string[]
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
 if (!evaluateViewTubeControl("creator-learning").allowed) return null
 const identity = input.publicationIdentity
 if (
  identity.schemaVersion !== 1 ||
  !identity.channelId ||
  !identity.contentBuildId ||
  !identity.youtubeVideoId ||
  !identity.publishTransactionId ||
  !identity.approvedSnapshotId ||
  !identity.approvedSnapshotHash
 ) return null

 const receipt = listContentBuildEvents(identity.contentBuildId).find((event) => {
  if (event.eventType !== "youtube.state.changed" ||
      event.entityType !== "publish-identity-receipt" ||
      event.entityId !== identity.publishTransactionId) return false
  const metadata = event.metadata as Record<string, unknown> | undefined
  return metadata?.publishTransactionId === identity.publishTransactionId &&
   metadata?.youtubeVideoId === identity.youtubeVideoId &&
   metadata?.approvedSnapshotId === identity.approvedSnapshotId &&
   metadata?.approvedSnapshotHash === identity.approvedSnapshotHash &&
   metadata?.contentBuildId === identity.contentBuildId &&
   metadata?.channelId === identity.channelId &&
   (!identity.actionPacketId || metadata?.actionPacketId === identity.actionPacketId) &&
   (!identity.workflowId || metadata?.workflowId === identity.workflowId) &&
   (!identity.recommendationId || metadata?.recommendationId === identity.recommendationId) &&
   (!identity.experimentId || metadata?.experimentId === identity.experimentId)
 })
 if (!receipt) return null

 const evidence = getCurrentCanonicalIntelligenceEvidence({
  window: input.selectedWindow,
  sectionIds: ["executive-summary"],
 })
 const currentRows = getCurrentCanonicalIntelligenceDatasetRows("videos")
 const dataset = currentRows.dataset
 if (
  !dataset ||
  currentRows.snapshotId !== evidence.snapshotId ||
  currentRows.channelId !== identity.channelId ||
  evidence.channelId !== identity.channelId ||
  dataset.channelId !== identity.channelId
 ) return null
 const rowIndex = dataset.rows.findIndex((row) =>
  ["videoId", "video_id", "videoIdExternal", "video_id_external", "id"]
   .some((key) => row[key] === identity.youtubeVideoId)
 )
 if (rowIndex < 0) return null

 const manifest = evidence.datasets.find((item) => item.id === "videos")
 const evidenceStatus: EvaluationRecord["evidenceStatus"] = manifest?.status === "available"
  ? "available"
  : manifest?.status === "partial" ? "partial"
  : manifest?.status === "stale" ? "stale"
  : manifest?.status === "failed" ? "failed"
  : "unavailable"
 const canonicalEvidenceId = `${dataset.snapshotId}:videos:${rowIndex + 1}`
 const checkpointIdempotencyKey = `analytics-checkpoint:${identity.publishTransactionId}:${dataset.snapshotId}:${evidence.selectedWindow}`
 const checkpoint = appendContentBuildEvent({
  contentBuildId: identity.contentBuildId,
  idempotencyKey: checkpointIdempotencyKey,
  eventType: "analytics.checkpoint",
  entityType: "published-video-analytics",
  entityId: identity.youtubeVideoId,
  actorType: "analytics",
  toolId: "analytics-canon",
  inputAssetIds: [...identity.selectedVariantAssetIds],
  outputAssetIds: [],
  evidenceIds: [canonicalEvidenceId],
  timestamp: evidence.capturedAt || undefined,
  metadata: {
   contentBuildId: identity.contentBuildId,
   projectId: identity.projectId,
   projectAssociationStatus: identity.projectAssociationStatus,
   videoPackageId: identity.videoPackageId,
   publishTransactionId: identity.publishTransactionId,
   youtubeVideoId: identity.youtubeVideoId,
   approvedSnapshotId: identity.approvedSnapshotId,
   approvedSnapshotHash: identity.approvedSnapshotHash,
   selectedVariantAssetIds: [...identity.selectedVariantAssetIds],
   correlationId: identity.correlationId,
   canonicalSnapshotId: dataset.snapshotId,
   datasetId: "videos",
   selectedWindow: evidence.selectedWindow,
   evidenceStatus,
   comparabilityStatus: input.comparabilityStatus || "unknown",
   baselineSnapshotId: input.baselineSnapshotId || null,
   idempotencyKey: checkpointIdempotencyKey,
  },
 })
 for (const assetId of identity.selectedVariantAssetIds) {
  linkAssetOutcomeToPublication({
   assetId,
   channelId: identity.channelId,
   publicationIdentity: identity,
   analyticsCheckpointIds: [checkpoint.id],
   evidenceIds: [canonicalEvidenceId],
  })
 }
 const linkedOutcomes = listAssetOutcomes({ channelId: identity.channelId }).filter((outcome) =>
  outcome.kind === "published" &&
  identity.selectedVariantAssetIds.includes(outcome.assetId) &&
  outcome.publishedVideoId === identity.youtubeVideoId &&
  outcome.publishTransactionId === identity.publishTransactionId
 )
 const sourceOutcomeIds = linkedOutcomes.map((outcome) => outcome.id)
 const sourceRecordIds = [...new Set([...sourceOutcomeIds, identity.publishTransactionId])]
 return createEvaluationRecord({
  channelId: identity.channelId,
  projectId: identity.projectId,
  source: input.source,
  recommendation: input.recommendation,
  evidenceIds: [canonicalEvidenceId],
  contentBuildId: identity.contentBuildId,
  videoPackageId: identity.videoPackageId,
  publishTransactionId: identity.publishTransactionId,
  publishedVideoId: identity.youtubeVideoId,
  baselineSnapshotId: input.baselineSnapshotId || null,
  comparisonSnapshotId: dataset.snapshotId,
  approvedSnapshotId: identity.approvedSnapshotId,
  approvedSnapshotHash: identity.approvedSnapshotHash,
  projectAssociationStatus: identity.projectAssociationStatus,
  selectedVariantAssetIds: [...identity.selectedVariantAssetIds],
  correlationId: identity.correlationId,
  sourceOutcomeIds,
  sourceRecordIds,
  actionPacketId: identity.actionPacketId || null,
  workflowId: identity.workflowId || null,
  recommendationId: identity.recommendationId || null,
  experimentId: identity.experimentId || null,
  traceIds: [...new Set(linkedOutcomes.map((outcome) => outcome.traceId))],
  assetIds: [...new Set(linkedOutcomes.map((outcome) => outcome.assetId))],
  analyticsCheckpointIds: [checkpoint.id],
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
   if (existing) {
    const sameLogicalEvaluation =
     existing.source === input.source &&
     existing.recommendation === input.recommendation &&
     (existing.publishTransactionId || null) === (input.publishTransactionId || null) &&
     (existing.publishedVideoId || null) === (input.publishedVideoId || null) &&
     (existing.selectedWindow || null) === (input.selectedWindow || null) &&
     (existing.comparisonSnapshotId || null) === (input.comparisonSnapshotId || null) &&
     (existing.approvedSnapshotHash || null) === (input.approvedSnapshotHash || null)
    if (!sameLogicalEvaluation) throw new Error("Evaluation idempotency key was reused for a different publication or evidence scope.")
    return existing
   }
  }
 const now = Date.now()
 const item: EvaluationRecord = { ...input, channelId: input.channelId || null, projectId: input.projectId || null, id: crypto.randomUUID(), createdAt: now, updatedAt: now, outcome: "pending" }
 write(EVAL_KEY, [item, ...records].slice(0, 5000))
 return item
}
export const resolveEvaluationRecord = (
 id: string,
 outcome: Exclude<EvaluationOutcome, "pending">,
 outcomeNote?: string,
 metricsAfter?: Record<string, number | null>,
) => {
 const records = listEvaluationRecords()
 const found = records.find((record) => record.id === id)
 if (!found) return null
 // A resolved evaluation is immutable; retries are idempotent and contradictory
 // re-resolution must be represented by a new evaluation record.
 if (found.outcome !== "pending") return found.outcome === outcome ? found : null
 const next = { ...found, outcome, outcomeNote, metricsAfter, updatedAt: Date.now() }
 write(EVAL_KEY, records.map((record) => record.id === id ? next : record))
 return next
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
 input: Omit<WorkflowCandidate, "id" | "createdAt" | "status" | "evaluationRecordId" | "sourceOutcomeIds" | "evaluationOutcome" | "evidenceRecordIds" | "selectedWindow" | "comparabilityStatus" | "evidenceStatus" | "reviewedBy" | "reviewedAt" | "promotedClaimId" | "promotedAt" | "supportingEvaluationIds" | "actionPacketId" | "workflowId" | "recommendationId" | "experimentId" | "contentBuildId" | "publishTransactionId" | "approvedSnapshotId" | "approvedSnapshotHash" | "analyticsCheckpointIds" | "sourceRecordIds" | "traceIds" | "assetIds" | "publishedVideoIds">,
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

export const reviewWorkflowCandidate = (
 id: string,
 status: "approved" | "rejected",
 reviewedBy?: string,
) => {
 const reviewer = String(reviewedBy || "").trim()
 if (!reviewer) return null
 const values = listWorkflowCandidates()
 const found = values.find((value) => value.id === id)
 if (!found) return null
 if (found.status !== "candidate") return found.status === status && found.reviewedBy === reviewer ? found : null
 const next: WorkflowCandidate = {
  ...found,
  status,
  reviewedBy: reviewer,
  reviewedAt: Date.now(),
 }
 write(CANDIDATE_KEY, values.map((value) => value.id === id ? next : value))
 return next
}

/**
 * Promote a reviewed candidate into the existing Brain Channel Knowledge store.
 * Promotion requires five or more distinct published videos with positive,
 * comparable, available observations in the same channel/project/window. This
 * records descriptive association only; it never asserts causal effect.
 */
export const promoteEvaluationLearningCandidateToChannelKnowledge = async (input: {
 candidateId: string
 reviewedBy: string
 minimumIndependentEvaluations?: number
}) => {
 const reviewer = input.reviewedBy.trim()
 if (!reviewer) return null
 const candidate = listWorkflowCandidates().find((value) => value.id === input.candidateId)
 if (
  !candidate ||
  candidate.status !== "approved" ||
  candidate.reviewedBy !== reviewer ||
  candidate.promotedClaimId ||
  !candidate.channelId
 ) return null
 const controls = readBrainUserControls(candidate.channelId)
 if (!controls.enabled || !controls.personalization) return null

 const sourceEvaluation = listEvaluationRecords().find((record) => record.id === candidate.evaluationRecordId)
 if (
  !sourceEvaluation ||
  sourceEvaluation.channelId !== candidate.channelId ||
  (sourceEvaluation.projectId || null) !== (candidate.projectId || null) ||
  sourceEvaluation.outcome !== "positive" ||
  sourceEvaluation.evidenceStatus !== "available" ||
  sourceEvaluation.comparabilityStatus !== "comparable" ||
  !sourceEvaluation.selectedWindow
 ) return null

 const minimum = Math.max(5, Math.floor(input.minimumIndependentEvaluations || 5))
 const eligible = listEvaluationRecords().filter((record) =>
  record.channelId === sourceEvaluation.channelId &&
  (record.projectId || null) === (sourceEvaluation.projectId || null) &&
  record.source === sourceEvaluation.source &&
  record.recommendation === sourceEvaluation.recommendation &&
  record.outcome === "positive" &&
  record.evidenceStatus === "available" &&
  record.comparabilityStatus === "comparable" &&
  record.selectedWindow === sourceEvaluation.selectedWindow &&
  Boolean(record.publishedVideoId) &&
  record.evidenceIds.some((id) => typeof id === "string" && id.trim().length > 0)
 )
 const byPublishedVideo = new Map<string, EvaluationRecord>()
 for (const record of eligible) {
  if (record.publishedVideoId && !byPublishedVideo.has(record.publishedVideoId)) {
   byPublishedVideo.set(record.publishedVideoId, record)
  }
 }
 const supporting = [...byPublishedVideo.values()]
 if (supporting.length < minimum) return null
 const evaluationRecordIds = supporting.map((record) => record.id)
 const evidenceIds = [...new Set(supporting.flatMap((record) => record.evidenceIds))]
 if (evidenceIds.length < minimum) return null

 const learningEntry = await captureAIBrainLearningEvent({
  channelId: sourceEvaluation.channelId,
  source: "copilot",
  summary: candidate.title,
  detail: `Repeated positive post-publication observations for “${sourceEvaluation.recommendation}” across ${supporting.length} distinct published videos. Descriptive association only; no causal conclusion.`,
  category: "analytics_insight",
  confidence: "high",
  evidence: evidenceIds,
  metadata: {
   creatorInitiated: true,
   confirmed: true,
   reviewedBy: reviewer,
   evaluationLearningCandidateId: candidate.id,
   evaluationRecordIds,
   publishedVideoIds: supporting.map((record) => record.publishedVideoId),
   actionPacketIds: [...new Set(supporting.map((record) => record.actionPacketId).filter((id): id is string => Boolean(id)))],
   workflowIds: [...new Set(supporting.map((record) => record.workflowId).filter((id): id is string => Boolean(id)))],
   recommendationIds: [...new Set(supporting.map((record) => record.recommendationId).filter((id): id is string => Boolean(id)))],
   experimentIds: [...new Set(supporting.map((record) => record.experimentId).filter((id): id is string => Boolean(id)))],
   publishTransactionIds: [...new Set(supporting.map((record) => record.publishTransactionId).filter((id): id is string => Boolean(id)))],
   approvedSnapshotIds: [...new Set(supporting.map((record) => record.approvedSnapshotId).filter((id): id is string => Boolean(id)))],
   analyticsCheckpointIds: [...new Set(supporting.flatMap((record) => record.analyticsCheckpointIds || []))],
   selectedWindow: sourceEvaluation.selectedWindow,
   interpretation: "descriptive-association-only",
   causalConclusion: null,
  },
 })
 if (learningEntry.status === "dismissed") return null
 const promoted = await promoteBrainClaim(learningEntry)
 if (!promoted.claim || !["promote", "supersede"].includes(promoted.decision.decision)) return null
 await rebuildAffectedToolContextPacks({
  channelId: sourceEvaluation.channelId,
  affectedContextPacks: ["performance", "analytics_tools"],
 })
 const updatedCandidate: WorkflowCandidate = {
  ...candidate,
  promotedClaimId: promoted.claim.id,
  promotedAt: Date.now(),
  supportingEvaluationIds: evaluationRecordIds,
 }
 write(CANDIDATE_KEY, listWorkflowCandidates().map((value) =>
  value.id === candidate.id ? updatedCandidate : value
 ))
 return { candidate: updatedCandidate, claim: promoted.claim, decision: promoted.decision }
}
