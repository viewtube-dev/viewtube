import {
 getContentBuild,
} from "./ContentBuildRepository"
import { assertContentBuildCapability } from "./ContentBuildCapabilities"
import type { BrainPromptRunReceipt } from "../brain/BrainPromptGovernance"
import {
 operationRecordFromGenerationRequest,
 operationRecordFromToolReceipt,
} from "../operations/OperationRecord"
import {
 recordContentBuildToolInput,
 recordContentBuildToolOutput,
 resolveContentBuildToolContext,
 type ContentBuildToolContext,
} from "./ToolContext"

export const GENERATION_WORKFLOW_SCHEMA_VERSION = 1 as const

export type GenerationMode =
 | "create"
 | "new-option"
 | "new-version"
 | "transform"

export interface GenerationContextManifest {
 schemaVersion: typeof GENERATION_WORKFLOW_SCHEMA_VERSION
 id: string
 contentBuildId: string
 contentBuildRevision: number
 projectId: string | null
 channelId: string | null
 toolId: string
 requestedSlots: string[]
 selectedAssetIds: string[]
 sourceAssetIds: string[]
 evidenceIds: string[]
 createdAt: string
}

export interface GenerationRequest {
 schemaVersion: typeof GENERATION_WORKFLOW_SCHEMA_VERSION
 id: string
 /** Stable operation identity shared with receipts, traces and ContentBuild events. */
 operationId?: string
 workflowId?: string
 contentBuildId: string
 projectId: string | null
 channelId: string | null
 toolId: string
 operation: string
 targetSlot: string
 mode: GenerationMode
 sourceAssetIds: string[]
 evidenceIds: string[]
 contextManifestId: string
 contextRevision: number
 creatorIntent: string
 constraints: Record<string, unknown>
 outputSpec: Record<string, unknown>
 parentAssetId: string | null
 variantGroupId: string | null
 traceId: string | null
 requestedAt: string
}

export interface PreparedGenerationRequest {
 request: GenerationRequest
 contextManifest: GenerationContextManifest
 context: ContentBuildToolContext
}

export interface ToolReceipt {
 schemaVersion: typeof GENERATION_WORKFLOW_SCHEMA_VERSION
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
 versionIds: string[]
 variantGroupId: string | null
 relationshipIds: string[]
 traceId: string | null
 completedAt: string
 /** Exact prompt/model receipt from the governed asset runner, when available. */
 promptReceipt?: BrainPromptRunReceipt | null
}

const createId = (prefix: string): string => {
 if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
  return `${prefix}_${crypto.randomUUID()}`
 }
 return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

const unique = (values: Array<string | null | undefined>): string[] =>
 [...new Set(values.filter((value): value is string => Boolean(value)))]

const assertCanonicalScope = (input: {
 contentBuildId: string
 channelId?: string | null
 projectId?: string | null
}) => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) {
  throw new Error(`Unknown ContentBuild: ${input.contentBuildId}`)
 }

 if (input.channelId && build.channelId && input.channelId !== build.channelId) {
  throw new Error(
   `GenerationRequest channel scope mismatch for ContentBuild ${build.id}: expected ${build.channelId}, received ${input.channelId}.`,
  )
 }

 if (
  input.projectId &&
  build.legacyProjectId &&
  input.projectId !== build.legacyProjectId
 ) {
  throw new Error(
   `GenerationRequest project scope mismatch for ContentBuild ${build.id}: expected ${build.legacyProjectId}, received ${input.projectId}.`,
  )
 }

 return build
}

/**
 * Conservative finalization guard: once a build is published or has moved into
 * post-publication measurement/learning/archive, new generation requests and
 * receipts must not mutate that lifecycle implicitly. Re-open the build through
 * an explicit canonical stage transition before generating again.
 */
const assertGenerationStageAllowed = (build: ReturnType<typeof getContentBuild>) => {
 if (!build) throw new Error("Generation requires an existing canonical ContentBuild.")
 assertContentBuildCapability(build, "generate")
}

export const prepareGenerationRequest = (input: {
 contentBuildId: string
 channelId?: string | null
 projectId?: string | null
 toolId: string
 operation: string
 targetSlot: string
 mode: GenerationMode
 creatorIntent: string
 requestedSlots?: string[]
 sourceAssetIds?: string[]
 evidenceIds?: string[]
 constraints?: Record<string, unknown>
 outputSpec?: Record<string, unknown>
 parentAssetId?: string | null
 variantGroupId?: string | null
 traceId?: string | null
 operationId?: string | null
 workflowId?: string | null
}): PreparedGenerationRequest => {
 const canonicalBuild = assertCanonicalScope(input)
 assertGenerationStageAllowed(canonicalBuild)
 const channelId = canonicalBuild.channelId || input.channelId || null
 const projectId = canonicalBuild.legacyProjectId || input.projectId || null
 const requestedSlots = unique(input.requestedSlots || [input.targetSlot])
 const sourceAssetIds = unique(input.sourceAssetIds || [])
 const evidenceIds = unique(input.evidenceIds || [])

 const context = resolveContentBuildToolContext({
  contentBuildId: canonicalBuild.id,
  channelId,
  projectId,
  projectName: canonicalBuild.legacyProjectName || null,
  videoId: canonicalBuild.youtube?.videoId || null,
  toolId: input.toolId,
  requestedSlots,
  evidenceIds,
 })

 if (!context) {
  throw new Error(
   `Unable to resolve generation context for ContentBuild ${canonicalBuild.id}.`,
  )
 }

 const timestamp = new Date().toISOString()
 const contextManifest: GenerationContextManifest = {
  schemaVersion: GENERATION_WORKFLOW_SCHEMA_VERSION,
  id: createId("context"),
  contentBuildId: canonicalBuild.id,
  contentBuildRevision: canonicalBuild.revision,
  projectId,
  channelId,
  toolId: input.toolId,
  requestedSlots,
  selectedAssetIds: unique(
   Object.values(context.selectedAssets).map((asset) => asset?.id),
  ),
  sourceAssetIds,
  evidenceIds,
  createdAt: timestamp,
 }

 const requestId = createId("generation_request")
 const request: GenerationRequest = {
  schemaVersion: GENERATION_WORKFLOW_SCHEMA_VERSION,
  id: requestId,
  operationId: input.operationId || requestId,
  workflowId: input.workflowId || `workflow:${canonicalBuild.id}`,
  contentBuildId: canonicalBuild.id,
  projectId,
  channelId,
  toolId: input.toolId,
  operation: input.operation,
  targetSlot: input.targetSlot,
  mode: input.mode,
  sourceAssetIds,
  evidenceIds,
  contextManifestId: contextManifest.id,
  contextRevision: canonicalBuild.revision,
  creatorIntent: input.creatorIntent,
  constraints: input.constraints || {},
  outputSpec: input.outputSpec || {},
  parentAssetId: input.parentAssetId || null,
  variantGroupId: input.variantGroupId || null,
  traceId: input.traceId || null,
  requestedAt: timestamp,
 }

 recordContentBuildToolInput({
  contentBuildId: request.contentBuildId,
  toolId: request.toolId,
  assetIds: unique([
   ...contextManifest.selectedAssetIds,
   ...request.sourceAssetIds,
  ]),
  evidenceIds: request.evidenceIds,
  traceId: request.traceId,
  summary: request.creatorIntent,
  metadata: {
   requestId: request.id,
   operationId: request.operationId || request.id,
   workflowId: request.workflowId || `workflow:${request.contentBuildId}`,
   contextManifestId: request.contextManifestId,
   contextRevision: request.contextRevision,
   operation: request.operation,
   targetSlot: request.targetSlot,
   mode: request.mode,
   requestedSlots: contextManifest.requestedSlots,
   parentAssetId: request.parentAssetId,
   variantGroupId: request.variantGroupId,
   generationRequest: request,
   operationRecord: operationRecordFromGenerationRequest(request, {
    selectedAssetIds: contextManifest.selectedAssetIds,
    workflowId: request.workflowId,
   }),
   contextManifest,
  },
 })

 return {
  request,
  contextManifest,
  context,
 }
}

export const recordToolReceipt = (input: {
 request: GenerationRequest
 outputAssetIds?: string[]
 generationRecordId?: string | null
 versionIds?: string[]
 variantGroupId?: string | null
 relationshipIds?: string[]
 traceId?: string | null
 promptReceipt?: BrainPromptRunReceipt | null
 summary?: string
 metadata?: Record<string, unknown>
}): ToolReceipt => {
 const build = getContentBuild(input.request.contentBuildId)
 if (!build) {
  throw new Error(`Unknown ContentBuild: ${input.request.contentBuildId}`)
 }
 assertGenerationStageAllowed(build)

 // A prepared request is tied to the exact canonical revision used to build its
 // context manifest. Reject stale requests rather than recording output against
 // a build that changed while generation was in flight.
 if (input.request.contextRevision !== build.revision) {
  throw new Error(
   `Generation request revision is stale for ContentBuild ${build.id}: expected current revision ${build.revision}, received ${input.request.contextRevision}.`,
  )
 }
 if (input.request.channelId && build.channelId && input.request.channelId !== build.channelId) {
  throw new Error(`Generation request channel scope mismatch for ContentBuild ${build.id}.`)
 }
 if (input.request.projectId && build.legacyProjectId && input.request.projectId !== build.legacyProjectId) {
  throw new Error(`Generation request project scope mismatch for ContentBuild ${build.id}.`)
 }

 const completedAt = new Date().toISOString()
 const receipt: ToolReceipt = {
  schemaVersion: GENERATION_WORKFLOW_SCHEMA_VERSION,
  id: createId("tool_receipt"),
  requestId: input.request.id,
  operationId: input.request.operationId || input.request.id,
  workflowId: input.request.workflowId || `workflow:${input.request.contentBuildId}`,
  contentBuildId: input.request.contentBuildId,
  projectId: input.request.projectId,
  toolId: input.request.toolId,
  inputAssetIds: [...input.request.sourceAssetIds],
  outputAssetIds: unique(input.outputAssetIds || []),
  evidenceIds: [...input.request.evidenceIds],
  generationRecordId: input.generationRecordId || null,
  versionIds: unique(input.versionIds || []),
  variantGroupId: input.variantGroupId || input.request.variantGroupId || null,
  relationshipIds: unique(input.relationshipIds || []),
  traceId: input.traceId || input.request.traceId || null,
  completedAt,
  promptReceipt: input.promptReceipt || null,
 }

 recordContentBuildToolOutput({
  contentBuildId: receipt.contentBuildId,
  toolId: receipt.toolId,
  assetIds: receipt.outputAssetIds,
  evidenceIds: receipt.evidenceIds,
  generationRecordId: receipt.generationRecordId,
  traceId: receipt.traceId,
  summary: input.summary || "",
  metadata: {
   receiptId: receipt.id,
   requestId: receipt.requestId,
   operationId: receipt.operationId || input.request.operationId || input.request.id,
   workflowId: receipt.workflowId || input.request.workflowId || `workflow:${input.request.contentBuildId}`,
   contextManifestId: input.request.contextManifestId,
   contextRevision: input.request.contextRevision,
   operation: input.request.operation,
   targetSlot: input.request.targetSlot,
   mode: input.request.mode,
   versionIds: receipt.versionIds,
   variantGroupId: receipt.variantGroupId,
   relationshipIds: receipt.relationshipIds,
   toolReceipt: receipt,
   promptReceipt: receipt.promptReceipt || null,
   operationRecord: operationRecordFromToolReceipt(receipt, {
    operationId: receipt.operationId || input.request.operationId || input.request.id,
    workflowId: receipt.workflowId || input.request.workflowId || `workflow:${input.request.contentBuildId}`,
    channelId: input.request.channelId,
   }),
   ...(input.metadata || {}),
  },
 })

 return receipt
}
