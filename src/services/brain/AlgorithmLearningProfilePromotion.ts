import { teachAIBrainExplicitly } from "../aiBrainSelfImprovement"
import { readBrainUserControls, shouldBrainLearnFromInteraction } from "./BrainUserControls"
import { listApprovedAlgorithmLearningCandidates } from "./AlgorithmLearningGovernance"
import { listAlgorithmIntelligenceEvents, recordAlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"
import { listBrainTraces } from "./BrainTrace"
import { isEvidenceRecord, type EvidenceRecord } from "./EvidenceRecord"

export interface AlgorithmLearningPromotionRequest {
 channelId: string
 candidateId: string
 creatorApproved: boolean
 note?: string | null
}

interface CandidateEvidenceResolution {
 records: EvidenceRecord[]
 missingIds: string[]
 conflictingIds: string[]
}

/** Resolve IDs only from canonical, channel-scoped records actually returned on candidate traces. */
const resolveCandidateEvidenceRecords = (
 channelId: string,
 candidate: { evidenceIds: string[]; traceIds?: string[] },
): CandidateEvidenceResolution => {
 const requestedIds = [...new Set(candidate.evidenceIds)]
 const traceIds = new Set(candidate.traceIds || [])
 const byId = new Map<string, EvidenceRecord>()
 const conflictingIds = new Set<string>()

 listBrainTraces(channelId).forEach((trace) => {
  if (trace.channelId !== channelId || !traceIds.has(trace.id)) return
  const returned = new Set(trace.evidence?.returned || [])
  ;(trace.evidence?.records || []).forEach((record) => {
   if (!isEvidenceRecord(record) || record.channelId !== channelId || !returned.has(record.id)) return
   const existing = byId.get(record.id)
   if (existing && JSON.stringify(existing) !== JSON.stringify(record)) {
    conflictingIds.add(record.id)
    return
   }
   byId.set(record.id, record)
  })
 })

 return {
  records: requestedIds.flatMap((id) => byId.has(id) && !conflictingIds.has(id) ? [byId.get(id)!] : []),
  missingIds: requestedIds.filter((id) => !byId.has(id)),
  conflictingIds: [...conflictingIds],
 }
}

/**
 * Final governed bridge from a measured Algorithm learning candidate into the
 * existing Brain memory system.
 *
 * This adapter intentionally requires BOTH:
 * 1. prior governance approval (`approve_for_profile_review`), and
 * 2. an explicit creator approval at the moment of promotion.
 *
 * It reuses the existing Brain teaching/promotion path rather than creating a
 * second Channel Profile writer.
 */
export const promoteApprovedAlgorithmLearningToProfile = async (
 input: AlgorithmLearningPromotionRequest,
) => {
 if (!input.creatorApproved) {
  return {
   status: "creator_approval_required" as const,
   claim: null,
   candidate: null,
  }
 }

 const controls = readBrainUserControls(input.channelId)
 if (!shouldBrainLearnFromInteraction(controls)) {
  return {
   status: "learning_disabled" as const,
   claim: null,
   candidate: null,
  }
 }

 const row = listApprovedAlgorithmLearningCandidates(input.channelId)
  .find(({ candidate }) => candidate.id === input.candidateId)
 if (!row) {
  return {
   status: "not_approved_for_profile_review" as const,
   claim: null,
   candidate: null,
  }
 }

 const { candidate, sourceEvent, review } = row
 const sourceEventIds = Array.isArray(candidate.sourceEventIds)
  ? [...new Set(candidate.sourceEventIds.filter((id) => typeof id === "string" && id.trim().length > 0))]
  : []
 const evidenceIds = Array.isArray(candidate.evidenceIds)
  ? [...new Set(candidate.evidenceIds.filter((id) => typeof id === "string" && id.trim().length > 0))]
  : []
 const candidateEventParents = Array.isArray(sourceEvent.parentEventIds) ? sourceEvent.parentEventIds : []
 const hasCompleteLineage = candidateEventParents.length > 0
  && sourceEventIds.length === candidate.sampleSize
  && sourceEventIds.every((id) => candidateEventParents.includes(id))
  && evidenceIds.length > 0
  && candidate.sampleSize >= 3
  && Number.isFinite(candidate.positiveRate)
  && candidate.positiveRate >= 0.67
  && candidate.positiveRate <= 1
 if (candidate.channelId !== input.channelId || !hasCompleteLineage) {
  return {
   status: candidate.channelId !== input.channelId ? "channel_scope_mismatch" as const : "invalid_candidate_evidence" as const,
   candidate,
   claim: null,
  }
 }

 const evidenceResolution = resolveCandidateEvidenceRecords(input.channelId, {
  evidenceIds,
  traceIds: candidate.traceIds,
 })
 if (evidenceResolution.records.length !== evidenceIds.length
  || evidenceResolution.missingIds.length > 0
  || evidenceResolution.conflictingIds.length > 0) {
  return {
   status: "invalid_candidate_evidence" as const,
   candidate,
   claim: null,
   evidenceResolution: {
    missingIds: evidenceResolution.missingIds,
    conflictingIds: evidenceResolution.conflictingIds,
   },
  }
 }
 const resolvedEvidenceIds = evidenceResolution.records.map((record) => record.id)
 const scalarIdentity = (values?: string[]): string | null =>
  values?.length === 1 ? values[0] : null
 const priorPromotion = listAlgorithmIntelligenceEvents({
  channelId: input.channelId,
  kind: "LEARNING_PROMOTED",
 }).find((event) =>
  event.sourceId === candidate.id && event.metadata?.durableProfileMutation === true,
 )
 if (priorPromotion) {
  return {
   status: "already_promoted" as const,
   candidate,
   event: priorPromotion,
   claim: priorPromotion.metadata?.promotion ?? null,
  }
 }

 const teaching = await teachAIBrainExplicitly({
  channelId: input.channelId,
  summary: candidate.statement,
  detail: input.note || `Promoted from measured Algorithm Intelligence learning candidate ${candidate.id}.`,
  category: "channel_fact",
  evidence: resolvedEvidenceIds,
 })

 const event = recordAlgorithmIntelligenceEvent({
  id: `algorithm-learning-promoted:${candidate.id}`,
  channelId: input.channelId,
  kind: "LEARNING_PROMOTED",
  sourceSystem: "learning",
  sourceId: candidate.id,
  operationId: scalarIdentity(candidate.operationIds),
  workflowId: scalarIdentity(candidate.workflowIds),
  traceId: scalarIdentity(candidate.traceIds),
  outputRef: scalarIdentity(candidate.outputRefs),
  actionPacketId: scalarIdentity(candidate.actionPacketIds),
  parentEventIds: [sourceEvent.id, review?.eventId].filter(Boolean) as string[],
  evidenceIds: resolvedEvidenceIds,
  confidence: candidate.confidence,
  title: "Algorithm learning promoted to Channel Profile",
  summary: candidate.statement,
  metadata: {
   candidate,
   review: review || null,
   creatorApproved: true,
   brainLearningEntryId: teaching.entry.id,
   promotion: teaching.promotion,
   durableProfileMutation: Boolean(teaching.promotion.allowed),
   evidenceResolution: {
    resolvedRecordIds: resolvedEvidenceIds,
    owners: [...new Set(evidenceResolution.records.map((record) => record.owner))],
    sourceSnapshotIds: [...new Set(evidenceResolution.records.map((record) => record.sourceSnapshotId).filter((id): id is string => Boolean(id)))],
    traceIds: [...new Set(candidate.traceIds || [])],
   },
  },
 })

 return {
  status: teaching.promotion.allowed ? "promoted" as const : "promotion_held" as const,
  candidate,
  review,
  teaching,
  event,
  claim: teaching.promotion,
 }
}
