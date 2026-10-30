/**
 * Shared operation identity contract.
 *
 * This is a typed projection over existing ActionPacket, GenerationRequest,
 * ToolReceipt, GenerationRecord, BrainTrace and publication records. It is not
 * a new persistence owner. Existing systems retain their write authority.
 */

export const OPERATION_RECORD_SCHEMA_VERSION = 1 as const

export type OperationKind =
 | "reasoning"
 | "research"
 | "generation"
 | "transform"
 | "render"
 | "handoff"
 | "publish"
 | "external-execution"

export type OperationStatus =
 | "created"
 | "awaiting-approval"
 | "approved"
 | "running"
 | "succeeded"
 | "failed"
 | "cancelled"
 | "abandoned"
 | "recovery-required"

export type OperationMutationClass =
 | "read-only"
 | "prepare"
 | "proposal"
 | "user-approved-write"
 | "external-write"

export type OperationApprovalStatus = "not-required" | "pending" | "approved" | "rejected"

export interface OperationApproval {
 status: OperationApprovalStatus
 approvedBy: string | null
 approvedAt: string | null
 rejectedBy: string | null
 rejectedAt: string | null
}

export interface OperationLineage {
 creatorId: string | null
 channelId: string | null
 projectId: string | null
 contentBuildId: string | null
 videoId: string | null
 assetIds: string[]
 evidenceIds: string[]
 traceId: string | null
 actionPacketId: string | null
 toolReceiptId: string | null
 generationRecordId: string | null
 publishTransactionId: string | null
 approvedSnapshotId: string | null
 approvedSnapshotHash: string | null
 recommendationId: string | null
 experimentId: string | null
 parentOperationId: string | null
}

export interface OperationRecord {
 schemaVersion: typeof OPERATION_RECORD_SCHEMA_VERSION
 operationId: string
 workflowId: string
 idempotencyKey: string | null
 kind: OperationKind
 status: OperationStatus
 mutationClass: OperationMutationClass
 requiresExplicitApproval: boolean
 approval: OperationApproval
 sourceToolId: string | null
 destinationToolId: string | null
 parentOperationId: string | null
 lineage: OperationLineage
 createdAt: string
 updatedAt: string
 startedAt: string | null
 completedAt: string | null
 errorCode: string | null
 errorMessage: string | null
 reversible: boolean
 undoOperationId: string | null
 metadata: Record<string, unknown>
}

export type OperationRecordInput = Omit<
 OperationRecord,
 "schemaVersion" | "requiresExplicitApproval" | "createdAt" | "updatedAt" | "startedAt" | "completedAt" | "errorCode" | "errorMessage"
> & {
 createdAt?: string
 updatedAt?: string
 startedAt?: string | null
 completedAt?: string | null
 errorCode?: string | null
 errorMessage?: string | null
}

const EXPLICIT_APPROVAL_CLASSES = new Set<OperationMutationClass>([
 "user-approved-write",
 "external-write",
])

export const buildScopedOperationIdempotencyKey = (input: {
 scopeId: string
 producer: string
 callerKey: string
}): string => {
 const scopeId = input.scopeId.trim()
 const producer = input.producer.trim()
 const callerKey = input.callerKey.trim()
 if (!scopeId || !producer || !callerKey) {
  throw new Error("Operation idempotency keys require non-empty scopeId, producer, and callerKey.")
 }
 return `operation:v1:${encodeURIComponent(scopeId)}:${encodeURIComponent(producer)}:${encodeURIComponent(callerKey)}`
}

export const createOperationRecord = (
 input: OperationRecordInput,
): OperationRecord => {
 const operationId = input.operationId.trim()
 const workflowId = input.workflowId.trim()
 if (!operationId || !workflowId) {
  throw new Error("OperationRecord requires stable operationId and workflowId.")
 }
 const createdAt = input.createdAt || new Date().toISOString()
 const updatedAt = input.updatedAt || createdAt
 const requiresExplicitApproval = EXPLICIT_APPROVAL_CLASSES.has(input.mutationClass)
 if (requiresExplicitApproval && input.approval.status === "not-required") {
  throw new Error("Write operations must retain an explicit approval state.")
 }
 return {
  ...input,
  schemaVersion: OPERATION_RECORD_SCHEMA_VERSION,
  operationId,
  workflowId,
  requiresExplicitApproval,
  createdAt,
  updatedAt,
  startedAt: input.startedAt ?? null,
  completedAt: input.completedAt ?? null,
  errorCode: input.errorCode ?? null,
  errorMessage: input.errorMessage ?? null,
  lineage: {
   ...input.lineage,
   assetIds: [...new Set(input.lineage.assetIds.filter(Boolean))],
   evidenceIds: [...new Set(input.lineage.evidenceIds.filter(Boolean))],
  },
  metadata: { ...input.metadata },
 }
}

const TRANSITIONS: Readonly<Record<OperationStatus, readonly OperationStatus[]>> = {
 created: ["awaiting-approval", "approved", "running", "cancelled", "abandoned"],
 "awaiting-approval": ["approved", "cancelled", "abandoned"],
 approved: ["running", "cancelled", "abandoned"],
 running: ["succeeded", "failed", "cancelled", "recovery-required"],
 succeeded: [],
 failed: ["running", "cancelled", "abandoned"],
 cancelled: [],
 abandoned: [],
 "recovery-required": ["running", "succeeded", "failed", "cancelled"],
}

export const transitionOperationRecord = (
 record: OperationRecord,
 nextStatus: OperationStatus,
 input: {
  at?: string
  errorCode?: string | null
  errorMessage?: string | null
 } = {},
): OperationRecord => {
 if (!TRANSITIONS[record.status].includes(nextStatus)) {
  throw new Error(`Invalid operation status transition: ${record.status} -> ${nextStatus}.`)
 }
 if (
  nextStatus === "running" &&
  record.requiresExplicitApproval &&
  record.approval.status !== "approved"
 ) {
  throw new Error("A write operation cannot run before explicit approval is recorded.")
 }
 const at = input.at || new Date().toISOString()
 return {
  ...record,
  status: nextStatus,
  updatedAt: at,
  startedAt: nextStatus === "running" ? record.startedAt || at : record.startedAt,
  completedAt: ["succeeded", "failed", "cancelled", "abandoned"].includes(nextStatus)
   ? at
   : null,
  errorCode: input.errorCode ?? (nextStatus === "failed" ? record.errorCode : null),
  errorMessage: input.errorMessage ?? (nextStatus === "failed" ? record.errorMessage : null),
 }
}

type ActionPacketProjection = {
 id: string
 operationId?: string
 workflowId?: string
 idempotencyKey?: string | null
 parentPacketId?: string | null
 creatorId?: string | null
 sourceToolId?: string
 suggestedTargets?: string[]
 contentBuildId?: string | null
 projectId?: string | null
 channelId?: string | null
 videoId?: string | null
 assetIds?: string[]
 evidence?: string[]
 provenance?: string[]
 recommendationId?: string | null
 experimentId?: string | null
 contextManifestId?: string | null
 promptRecipeId?: string | null
 promptRecipeVersion?: string | null
 intent?: "inspect" | "prepare" | "propose" | "execute"
 approvalState?: "not-required" | "pending" | "approved" | "rejected"
 approvedBy?: string | null
 approvedAt?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 createdAt?: number
 payload?: unknown
}

export const operationRecordFromActionPacket = (
 packet: ActionPacketProjection,
 options: {
  kind?: OperationKind
  mutationClass?: OperationMutationClass
  destinationToolId?: string | null
  at?: string
 } = {},
): OperationRecord => {
 const requestedApprovalStatus = packet.approvalState || "not-required"
 const approvalStatus = packet.intent === "execute" && requestedApprovalStatus === "not-required"
  ? "pending"
  : requestedApprovalStatus
 const mutationClass = options.mutationClass || (
  packet.intent === "execute" ? "external-write" :
  packet.intent === "propose" ? "proposal" :
  packet.intent === "inspect" ? "read-only" : "prepare"
 )
 const approval: OperationApproval = {
  status: approvalStatus,
  approvedBy: packet.approvedBy || null,
  approvedAt: packet.approvedAt || null,
  rejectedBy: null,
  rejectedAt: null,
 }
 const createdAt = packet.createdAt ? new Date(packet.createdAt).toISOString() : options.at
 const operationId = packet.operationId || packet.id
 const workflowId = packet.workflowId || `workflow:${packet.id}`
 const status: OperationStatus = approvalStatus === "pending"
  ? "awaiting-approval"
  : approvalStatus === "approved" ? "approved" : "created"
 return createOperationRecord({
  operationId,
  workflowId,
  idempotencyKey: packet.idempotencyKey || null,
  kind: options.kind || "handoff",
  status,
  mutationClass,
  approval,
  sourceToolId: packet.sourceToolId || null,
  destinationToolId: options.destinationToolId || packet.suggestedTargets?.[0] || null,
  parentOperationId: packet.parentPacketId || null,
  lineage: {
   creatorId: packet.creatorId || null,
   channelId: packet.channelId || null,
   projectId: packet.projectId || null,
   contentBuildId: packet.contentBuildId || null,
   videoId: packet.videoId || null,
   assetIds: packet.assetIds || [],
   evidenceIds: packet.evidence || [],
   traceId: null,
   actionPacketId: packet.id,
   toolReceiptId: null,
   generationRecordId: null,
   publishTransactionId: null,
   approvedSnapshotId: packet.approvedSnapshotId || null,
   approvedSnapshotHash: packet.approvedSnapshotHash || null,
   recommendationId: packet.recommendationId || null,
   experimentId: packet.experimentId || null,
   parentOperationId: packet.parentPacketId || null,
  },
  createdAt,
  updatedAt: options.at || createdAt,
  startedAt: null,
  completedAt: null,
  errorCode: null,
  errorMessage: null,
  reversible: mutationClass !== "external-write",
  undoOperationId: null,
  metadata: {
   source: "ViewTubeActionPacket",
   intent: packet.intent || "prepare",
   contextManifestId: packet.contextManifestId || null,
   promptRecipeId: packet.promptRecipeId || null,
   promptRecipeVersion: packet.promptRecipeVersion || null,
   provenance: packet.provenance || [],
  },
 })
}

type ToolReceiptProjection = {
 id: string
 requestId: string
 operationId?: string
 workflowId?: string
 contentBuildId: string
 projectId: string | null
 toolId: string
 inputAssetIds: string[]
 outputAssetIds: string[]
 evidenceIds: string[]
 generationRecordId: string | null
 traceId: string | null
 completedAt: string
 promptReceipt?: unknown
}

export const operationRecordFromToolReceipt = (
 receipt: ToolReceiptProjection,
 options: {
  operationId?: string
  workflowId?: string
  channelId?: string | null
  videoId?: string | null
  recommendationId?: string | null
  experimentId?: string | null
  publishTransactionId?: string | null
  approvedSnapshotId?: string | null
  approvedSnapshotHash?: string | null
  at?: string
 } = {},
): OperationRecord => {
 const operationId = options.operationId || receipt.operationId || receipt.requestId
 const workflowId = options.workflowId || receipt.workflowId || `workflow:${receipt.contentBuildId}`
 const at = options.at || receipt.completedAt
 return createOperationRecord({
  operationId,
  workflowId,
  idempotencyKey: null,
  kind: "generation",
  status: "succeeded",
  mutationClass: "prepare",
  approval: {
   status: "not-required",
   approvedBy: null,
   approvedAt: null,
   rejectedBy: null,
   rejectedAt: null,
  },
  sourceToolId: receipt.toolId,
  destinationToolId: null,
  parentOperationId: null,
  lineage: {
   creatorId: null,
   channelId: options.channelId || null,
   projectId: receipt.projectId || null,
   contentBuildId: receipt.contentBuildId,
   videoId: options.videoId || null,
   assetIds: [...receipt.inputAssetIds, ...receipt.outputAssetIds],
   evidenceIds: receipt.evidenceIds,
   traceId: receipt.traceId,
   actionPacketId: null,
   toolReceiptId: receipt.id,
   generationRecordId: receipt.generationRecordId,
   publishTransactionId: options.publishTransactionId || null,
   approvedSnapshotId: options.approvedSnapshotId || null,
   approvedSnapshotHash: options.approvedSnapshotHash || null,
   recommendationId: options.recommendationId || null,
   experimentId: options.experimentId || null,
   parentOperationId: null,
  },
  createdAt: at,
  updatedAt: at,
  startedAt: null,
  completedAt: receipt.completedAt,
  errorCode: null,
  errorMessage: null,
  reversible: true,
  undoOperationId: null,
  metadata: { source: "ToolReceipt", requestId: receipt.requestId, promptReceipt: receipt.promptReceipt ?? null },
 })
}


type GenerationRequestProjection = {
 id: string
 operationId?: string
 workflowId?: string
 contentBuildId: string
 projectId: string | null
 channelId: string | null
 toolId: string
 operation: string
 targetSlot: string
 mode: "create" | "new-option" | "new-version" | "transform"
 sourceAssetIds: string[]
 evidenceIds: string[]
 parentAssetId: string | null
 variantGroupId: string | null
 traceId: string | null
 requestedAt: string
 contextManifestId: string
}

export const operationRecordFromGenerationRequest = (
 request: GenerationRequestProjection,
 options: {
  selectedAssetIds?: string[]
  creatorId?: string | null
  workflowId?: string
 } = {},
): OperationRecord => {
 const normalizedOperation = request.operation.toLowerCase()
 const kind: OperationKind = normalizedOperation.includes("render")
  ? "render"
  : normalizedOperation.includes("research")
   ? "research"
   : request.mode === "transform" ? "transform" : "generation"
 const workflowId = options.workflowId || request.workflowId || `workflow:${request.contentBuildId}`
 return createOperationRecord({
  operationId: request.operationId || request.id,
  workflowId,
  idempotencyKey: null,
  kind,
  status: "running",
  mutationClass: "prepare",
  approval: {
   status: "not-required",
   approvedBy: null,
   approvedAt: null,
   rejectedBy: null,
   rejectedAt: null,
  },
  sourceToolId: request.toolId,
  destinationToolId: null,
  parentOperationId: null,
  lineage: {
   creatorId: options.creatorId || null,
   channelId: request.channelId || null,
   projectId: request.projectId || null,
   contentBuildId: request.contentBuildId,
   videoId: null,
   assetIds: [...(options.selectedAssetIds || []), ...request.sourceAssetIds],
   evidenceIds: request.evidenceIds,
   traceId: request.traceId,
   actionPacketId: null,
   toolReceiptId: null,
   generationRecordId: null,
   publishTransactionId: null,
   approvedSnapshotId: null,
   approvedSnapshotHash: null,
   recommendationId: null,
   experimentId: null,
   parentOperationId: null,
  },
  createdAt: request.requestedAt,
  updatedAt: request.requestedAt,
  startedAt: request.requestedAt,
  completedAt: null,
  errorCode: null,
  errorMessage: null,
  reversible: true,
  undoOperationId: null,
  metadata: {
   source: "GenerationRequest",
   contextManifestId: request.contextManifestId,
   operation: request.operation,
   mode: request.mode,
   targetSlot: request.targetSlot,
   parentAssetId: request.parentAssetId,
   variantGroupId: request.variantGroupId,
  },
 })
}
