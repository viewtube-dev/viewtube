import type { BrainConfidenceLevel, SuperToolId } from "../../types"
import { captureAIBrainLearningEvent } from "../aiBrainSelfImprovement"
import type { ContentBuildPublicationIdentity } from "../asset-engine/contracts"
import { enqueueBrainLearningRecord } from "./BrainLearningPersistence"

const STORAGE_KEY = "vt_brain_outcome_ledger_v1"
export const BRAIN_OUTCOME_EVENT = "vt_brain_outcome_ledger_changed"

export type BrainOutcomeKind = "accepted" | "rejected" | "corrected" | "completed" | "abandoned"

export interface BrainOutcomeRecord {
 id: string
 channelId: string | null
 sourceToolId: SuperToolId
 targetToolId: SuperToolId | null
 actionPacketId?: string | null
 workflowId?: string | null
 recommendationId?: string | null
 experimentId?: string | null
 /** Stable identity of the producer record that emitted this outcome. */
 sourceRecordId?: string | null
 /** Shared orchestration identity from the producing operation, when available. */
 operationId?: string | null
 /** Shared trace identity linking this outcome to diagnostic and operation events. */
 correlationId?: string | null
 /** Event identity that directly caused this outcome, when available. */
 causationId?: string | null
 contextRevision?: number | null
 /** Generation trace and asset identity, when this outcome came from Asset Engine. */
 traceId?: string | null
 assetId?: string | null
 assetType?: string | null
 contentBuildId?: string | null
 projectId?: string | null
 publishTransactionId?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 publishedVideoId?: string | null
 publicationIdentity?: ContentBuildPublicationIdentity | null
 analyticsCheckpointIds?: string[]
 evidenceIds?: string[]
 outcome: BrainOutcomeKind
 summary: string
 evidence: string[]
 confidence: BrainConfidenceLevel
 createdAt: number
}

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined"

const read = (): BrainOutcomeRecord[] => {
 if (!canUseStorage()) return []
 try {
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  return Array.isArray(parsed) ? parsed : []
 } catch {
  return []
 }
}

const write = (records: BrainOutcomeRecord[]) => {
 if (!canUseStorage()) return
 localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 500)))
 window.dispatchEvent(new CustomEvent(BRAIN_OUTCOME_EVENT, { detail: records }))
}

export const hydrateBrainOutcomes = (durableRecords: BrainOutcomeRecord[]) => {
 const merged = new Map(read().map((record) => [record.id, record]))
 for (const record of durableRecords || []) {
  if (!record || typeof record.id !== "string" || !record.id || !record.channelId) continue
  merged.set(record.id, record)
 }
 const records = [...merged.values()].sort((left, right) => right.createdAt - left.createdAt).slice(0, 500)
 write(records)
 return records.length
}

export const listBrainOutcomes = (channelId?: string | null) => {
 const records = read().sort((a, b) => b.createdAt - a.createdAt)
 return channelId ? records.filter((record) => record.channelId === channelId) : records
}

export const recordBrainOutcome = async (input: Omit<BrainOutcomeRecord, "id" | "createdAt">) => {
 if (input.sourceRecordId) {
  const records = read()
  const existing = records.find((record) => record.channelId === input.channelId && record.sourceRecordId === input.sourceRecordId)
  if (existing) {
   // A source-record retry is idempotent only for the same logical outcome.
   // Conflicting identity must not be hidden by returning an older local row.
   const immutableFields = [
    "sourceToolId", "targetToolId", "outcome", "summary", "confidence",
    "operationId", "correlationId", "causationId", "contextRevision", "traceId", "assetId", "assetType", "contentBuildId", "projectId",
    "actionPacketId", "workflowId", "recommendationId", "experimentId",
    "publishTransactionId", "approvedSnapshotId", "approvedSnapshotHash",
    "publishedVideoId", "publicationIdentity", "evidence",
   ] as const
   for (const field of immutableFields) {
    const previous = existing[field]
    const requested = input[field]
    if (previous != null && requested != null && JSON.stringify(previous) !== JSON.stringify(requested)) {
     throw new Error(`Brain outcome sourceRecordId ${input.sourceRecordId} was reused with conflicting ${field}.`)
    }
   }
   const enrichableFields = [
    "targetToolId", "operationId", "correlationId", "causationId", "contextRevision", "traceId", "assetId", "assetType", "contentBuildId", "projectId",
    "actionPacketId", "workflowId", "recommendationId", "experimentId",
    "publishTransactionId", "approvedSnapshotId", "approvedSnapshotHash",
    "publishedVideoId", "publicationIdentity",
   ] as const
   const enriched = { ...existing }
   let changed = false
   for (const field of enrichableFields) {
    if (enriched[field] == null && input[field] != null) {
     ;(enriched as Record<string, unknown>)[field] = input[field]
     changed = true
    }
   }
   // Evidence references and analytics checkpoints are append-only provenance:
   // retries may learn about additional canonical records without changing the outcome.
   for (const field of ["evidenceIds", "analyticsCheckpointIds"] as const) {
    const previous = enriched[field] || []
    const requested = input[field] || []
    const merged = [...new Set([...previous, ...requested])]
    if (merged.length !== previous.length) {
     ;(enriched as Record<string, unknown>)[field] = merged
     changed = true
    }
   }
   if (changed) write(records.map((record) => record.id === existing.id ? enriched : record))
   void enqueueBrainLearningRecord(enriched.channelId, "brainOutcome", enriched)
   return enriched
  }
 }
 const record: BrainOutcomeRecord = {
  ...input,
  id: crypto.randomUUID(),
  createdAt: Date.now(),
 }
 write([record, ...read()])
 void enqueueBrainLearningRecord(record.channelId, "brainOutcome", record)

 const positive = input.outcome === "accepted" || input.outcome === "completed"
 const corrective = input.outcome === "corrected" || input.outcome === "rejected"
 await captureAIBrainLearningEvent({
  channelId: input.channelId,
  source: "command_handoff",
  summary: input.summary,
  detail: `${input.sourceToolId}${input.targetToolId ? ` → ${input.targetToolId}` : ""}: ${input.outcome}`,
  category: corrective ? "correction" : "tool_workflow",
  confidence: input.confidence,
  evidence: input.evidence,
  metadata: {
   outcome: input.outcome,
   positive,
   corrective,
   actionPacketId: input.actionPacketId || null,
   workflowId: input.workflowId || null,
   sourceRecordId: input.sourceRecordId || null,
   operationId: input.operationId || null,
   correlationId: input.correlationId || null,
   causationId: input.causationId || null,
   contextRevision: input.contextRevision ?? null,
   traceId: input.traceId || null,
   assetId: input.assetId || null,
   assetType: input.assetType || null,
   contentBuildId: input.contentBuildId || null,
   projectId: input.projectId || null,
   publishTransactionId: input.publishTransactionId || null,
   approvedSnapshotId: input.approvedSnapshotId || null,
   approvedSnapshotHash: input.approvedSnapshotHash || null,
   publishedVideoId: input.publishedVideoId || null,
   analyticsCheckpointIds: input.analyticsCheckpointIds || [],
   recommendationId: input.recommendationId || null,
   experimentId: input.experimentId || null,
   sourceToolId: input.sourceToolId,
   targetToolId: input.targetToolId,
  },
 })
 return record
}

/**
 * Attach verified publication and analytics provenance to an existing outcome.
 * The original outcome identity is retained; mismatched channel/source pairs fail closed.
 */
export const updateBrainOutcomePublicationLineage = (input: {
 channelId: string
 sourceRecordId: string
 publicationIdentity: ContentBuildPublicationIdentity
 analyticsCheckpointIds?: string[]
 evidenceIds?: string[]
}): BrainOutcomeRecord | null => {
 if (input.publicationIdentity.channelId !== input.channelId) return null
 const records = read()
 const found = records.find((record) =>
  record.channelId === input.channelId && record.sourceRecordId === input.sourceRecordId
 )
 if (!found) return null
 if (found.publishTransactionId && found.publishTransactionId !== input.publicationIdentity.publishTransactionId) return null
 if (found.publishedVideoId && found.publishedVideoId !== input.publicationIdentity.youtubeVideoId) return null
 const next: BrainOutcomeRecord = {
  ...found,
  contentBuildId: input.publicationIdentity.contentBuildId,
  projectId: input.publicationIdentity.projectId,
  actionPacketId: input.publicationIdentity.actionPacketId || found.actionPacketId || null,
  workflowId: input.publicationIdentity.workflowId || found.workflowId || null,
  recommendationId: input.publicationIdentity.recommendationId || found.recommendationId || null,
  experimentId: input.publicationIdentity.experimentId || found.experimentId || null,
  publishTransactionId: input.publicationIdentity.publishTransactionId,
  approvedSnapshotId: input.publicationIdentity.approvedSnapshotId,
  approvedSnapshotHash: input.publicationIdentity.approvedSnapshotHash,
  publishedVideoId: input.publicationIdentity.youtubeVideoId,
  publicationIdentity: input.publicationIdentity,
  analyticsCheckpointIds: [...new Set([...(found.analyticsCheckpointIds || []), ...(input.analyticsCheckpointIds || [])])],
  evidenceIds: [...new Set([...(found.evidenceIds || []), ...(input.evidenceIds || [])])],
 }
 write(records.map((record) => record.id === found.id ? next : record))
 void enqueueBrainLearningRecord(next.channelId, "brainOutcome", next)
 return next
}

export const summarizeBrainOutcomes = (channelId?: string | null) => {
 const records = listBrainOutcomes(channelId)
 const count = (kind: BrainOutcomeKind) => records.filter((record) => record.outcome === kind).length
 const accepted = count("accepted") + count("completed")
 const negative = count("rejected") + count("corrected") + count("abandoned")
 return {
  total: records.length,
  accepted,
  negative,
  acceptanceRate: records.length ? Math.round((accepted / records.length) * 100) : 0,
  completed: count("completed"),
  corrected: count("corrected"),
  rejected: count("rejected"),
  abandoned: count("abandoned"),
 }
}
