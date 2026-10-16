import type { ContentBuildPublicationIdentity } from "./asset-engine/contracts"
import { appendContentBuildEvent, listContentBuildEvents } from "./asset-engine/ContentBuildRepository"
import { linkAssetOutcomeToPublication, listAssetOutcomes } from "./brain/assetOutcomes"
import { getCurrentCanonicalIntelligenceDatasetRows, getCurrentCanonicalIntelligenceEvidence, type AnalyticsWindow } from "./analytics-canon"
import { captureAIBrainLearningEvent } from "./aiBrainSelfImprovement"
import { promoteBrainClaim, rebuildAffectedToolContextPacks } from "./brain/BrainMemoryClaims"
import { readBrainUserControls } from "./brain/BrainUserControls"
import { evaluateViewTubeControl } from "./viewTubeUserControls"
import { enqueueBrainLearningRecord } from "./brain/BrainLearningPersistence"

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
 supportingEvaluationIds?: string[]
 contradictingEvaluationIds?: string[]
 observedEvaluationCount?: number
 positiveOutcomeRate?: number
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
 status: "candidate" | "approved" | "rejected"
 scope: "channel" | "global-experiment"
}

const EVAL_KEY = "viewtube:evaluation-ledger:v1"
const CANDIDATE_KEY = "viewtube:workflow-candidates:v1"
const read = <T,>(key: string): T[] => { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem(key) || "[]") as T[] } catch { return [] } }
const write = <T,>(key: string, values: T[]) => { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(values)) }

/** Merge server-authoritative rows into the existing evaluation and candidate ledgers. */
export const hydrateBrainLearningRecords = (input: {
 evaluations: EvaluationRecord[]
 candidates: WorkflowCandidate[]
}) => {
 const evaluations = new Map(listEvaluationRecords().map((record) => [record.id, record]))
 for (const record of input.evaluations || []) {
  if (!record?.id || !record.channelId) continue
  evaluations.set(record.id, record)
 }
 const candidates = new Map(listWorkflowCandidates().map((record) => [record.id, record]))
 for (const record of input.candidates || []) {
  if (!record?.id || !record.channelId) continue
  candidates.set(record.id, record)
 }
 const mergedEvaluations = [...evaluations.values()].sort((left, right) => right.updatedAt - left.updatedAt).slice(0, 5000)
 const mergedCandidates = [...candidates.values()].sort((left, right) => right.createdAt - left.createdAt).slice(0, 1000)
 write(EVAL_KEY, mergedEvaluations)
 write(CANDIDATE_KEY, mergedCandidates)
 return { evaluations: mergedEvaluations.length, candidates: mergedCandidates.length }
}

/**
 * Create a post-publication evaluation only when the published video is present
 * in the same current canonical analytics snapshot and channel scope. Missing
 * rows are not converted to zeroes or guessed from title/date similarity.
 */
export const createPublicationEvaluationRecordWithDiagnostics = (input: {
 publicationIdentity: ContentBuildPublicationIdentity
 selectedWindow: AnalyticsWindow
 source: string
 recommendation: string
 baselineSnapshotId?: string | null
 comparabilityStatus?: EvaluationRecord["comparabilityStatus"]
 confounders?: string[]
 causalAssessment?: EvaluationRecord["causalAssessment"]
}) => {
 if (!evaluateViewTubeControl("creator-learning").allowed) return { status: "skipped", reason: "creator-learning-control-disabled" } as const
 const identity = input.publicationIdentity
 if (
  identity.schemaVersion !== 1 ||
  !identity.channelId ||
  !identity.contentBuildId ||
  !identity.youtubeVideoId ||
  !identity.publishTransactionId ||
  !identity.approvedSnapshotId ||
  !identity.approvedSnapshotHash
 ) return { status: "skipped", reason: "invalid-publication-identity" } as const

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
 if (!receipt) return { status: "skipped", reason: "publication-identity-receipt-missing" } as const

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
 ) return { status: "skipped", reason: "invalid-publication-identity" } as const
 const rowIndex = dataset.rows.findIndex((row) =>
  ["videoId", "video_id", "videoIdExternal", "video_id_external", "id"]
   .some((key) => row[key] === identity.youtubeVideoId)
 )
 if (rowIndex < 0) return { status: "skipped", reason: "published-video-not-found-in-canonical-videos-dataset" } as const

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
 const record = createEvaluationRecord({
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
 return record ? { status: "created", record } as const : { status: "skipped", reason: "evaluation-record-not-created" } as const
}


/** Backwards-compatible record-only API. Call the diagnostic variant when a caller
 * must distinguish missing canonical evidence from a successful evaluation. */
export const createPublicationEvaluationRecord = (
 input: Parameters<typeof createPublicationEvaluationRecordWithDiagnostics>[0],
): EvaluationRecord | null => {
 const result = createPublicationEvaluationRecordWithDiagnostics(input)
 return result.status === "created" ? result.record : null
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
     (existing.approvedSnapshotHash || null) === (input.approvedSnapshotHash || null) &&
     (existing.actionPacketId || null) === (input.actionPacketId || null) &&
     (existing.workflowId || null) === (input.workflowId || null) &&
     (existing.recommendationId || null) === (input.recommendationId || null) &&
     (existing.experimentId || null) === (input.experimentId || null) &&
     [...(existing.evidenceIds || [])].sort().join("|") === [...(input.evidenceIds || [])].sort().join("|")
    if (!sameLogicalEvaluation) throw new Error("Evaluation idempotency key was reused for a different publication or evidence scope.")
    return existing
   }
  }
 const now = Date.now()
 const item: EvaluationRecord = { ...input, channelId: input.channelId || null, projectId: input.projectId || null, id: crypto.randomUUID(), createdAt: now, updatedAt: now, outcome: "pending" }
 write(EVAL_KEY, [item, ...records].slice(0, 5000))
 if (item.channelId) void enqueueBrainLearningRecord(item.channelId, "evaluation", item)
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
 if (next.channelId) void enqueueBrainLearningRecord(next.channelId, "evaluation", next)
 return next
}
export const listWorkflowCandidates = () => read<WorkflowCandidate>(CANDIDATE_KEY)
export const proposeWorkflowCandidate = (input: Omit<WorkflowCandidate,"id"|"createdAt"|"status">) => {
 if (!evaluateViewTubeControl("creator-learning").allowed) return null
 const item: WorkflowCandidate = { ...input, id: crypto.randomUUID(), createdAt: Date.now(), status: "candidate" }; write(CANDIDATE_KEY, [item, ...listWorkflowCandidates()].slice(0,1000)); if (item.channelId) void enqueueBrainLearningRecord(item.channelId, "learningCandidate", item); return item
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
 if (item.channelId) void enqueueBrainLearningRecord(item.channelId, "learningCandidate", item)
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
 if (next.channelId) void enqueueBrainLearningRecord(next.channelId, "learningCandidate", next)
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
 if (!reviewer || !evaluateViewTubeControl("creator-learning").allowed) return null
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
 const observations = listEvaluationRecords().filter((record) =>
  record.channelId === sourceEvaluation.channelId &&
  (record.projectId || null) === (sourceEvaluation.projectId || null) &&
  record.source === sourceEvaluation.source &&
  record.recommendation === sourceEvaluation.recommendation &&
  record.outcome !== "pending" &&
  record.evidenceStatus === "available" &&
  record.comparabilityStatus === "comparable" &&
  record.selectedWindow === sourceEvaluation.selectedWindow &&
  Boolean(record.publishedVideoId) &&
  record.evidenceIds.some((id) => typeof id === "string" && id.trim().length > 0)
 )
 const observationsByVideo = new Map<string, EvaluationRecord[]>()
 for (const record of observations) {
  if (!record.publishedVideoId) continue
  const rows = observationsByVideo.get(record.publishedVideoId) || []
  rows.push(record)
  observationsByVideo.set(record.publishedVideoId, rows)
 }
 const conflictedVideos = [...observationsByVideo.entries()]
  .filter(([, rows]) => new Set(rows.map((row) => row.outcome)).size > 1)
 const resolvedByVideo = [...observationsByVideo.entries()]
  .filter(([, rows]) => new Set(rows.map((row) => row.outcome)).size === 1)
  .map(([, rows]) => rows.sort((left, right) => right.updatedAt - left.updatedAt)[0])
 const supporting = resolvedByVideo.filter((record) => record.outcome === "positive")
 const observedCount = resolvedByVideo.length
 const positiveOutcomeRate = observedCount ? supporting.length / observedCount : 0
 const conflictingEvaluationIds = conflictedVideos.flatMap(([, rows]) => rows.map((row) => row.id))
 if (
  supporting.length < minimum ||
  positiveOutcomeRate < 0.8 ||
  !supporting.some((record) => record.id === sourceEvaluation.id)
 ) return null
 const evaluationRecordIds = resolvedByVideo.map((record) => record.id)
 const supportingEvaluationIds = supporting.map((record) => record.id)
 const evidenceIds = [...new Set(resolvedByVideo.flatMap((record) => record.evidenceIds))]
 if (evidenceIds.length < minimum) return null

 const learningEntry = await captureAIBrainLearningEvent({
  channelId: sourceEvaluation.channelId,
  source: "copilot",
  summary: candidate.title,
  detail: `Positive outcomes in ${supporting.length} of ${observedCount} distinct comparable published videos for “${sourceEvaluation.recommendation}” (${Math.round(positiveOutcomeRate * 100)}% positive). Contradictory outcomes remain attached as evidence. Descriptive association only; no causal conclusion.`,
  category: "analytics_insight",
  confidence: "high",
  evidence: evidenceIds,
  metadata: {
   creatorInitiated: true,
   confirmed: true,
   reviewedBy: reviewer,
   evaluationLearningCandidateId: candidate.id,
   evaluationRecordIds,
   supportingEvaluationIds,
   contradictingEvaluationIds: [
    ...resolvedByVideo.filter((record) => record.outcome === "negative" || record.outcome === "neutral").map((record) => record.id),
    ...conflictingEvaluationIds,
   ],
   observedEvaluationCount: observedCount,
   positiveOutcomeRate,
   publishedVideoIds: resolvedByVideo.map((record) => record.publishedVideoId),
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
  supportingEvaluationIds,
  contradictingEvaluationIds: [
   ...resolvedByVideo.filter((record) => record.outcome === "negative" || record.outcome === "neutral").map((record) => record.id),
   ...conflictingEvaluationIds,
  ],
  observedEvaluationCount: observedCount,
  positiveOutcomeRate,
 }
 write(CANDIDATE_KEY, listWorkflowCandidates().map((value) =>
  value.id === candidate.id ? updatedCandidate : value
 ))
 if (updatedCandidate.channelId) void enqueueBrainLearningRecord(updatedCandidate.channelId, "learningCandidate", updatedCandidate)
 return { candidate: updatedCandidate, claim: promoted.claim, decision: promoted.decision }
}
