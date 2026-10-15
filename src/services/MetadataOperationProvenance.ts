import { appendContentBuildEvent, type ContentBuildEvent } from "./asset-engine/ContentBuildRepository"

export type MetadataOperationKind = "generate" | "refine" | "analyze" | "rank" | "compare" | "restore"

export interface RecordMetadataOperationProvenanceInput {
  contentBuildId: string
  operationId: string
  operation: MetadataOperationKind
  toolId: "metadata-master" | "video-manager" | "video-publisher"
  recipeId: string
  recipeVersion: string
  contextManifestId?: string | null
  contentBuildRevision?: number | null
  projectId?: string | null
  videoId?: string | null
  fields: string[]
  outputPackageIds?: string[]
  evidenceIds?: string[]
  generationRecordId?: string | null
  traceId?: string | null
  provider?: string | null
  model?: string | null
  actorType?: ContentBuildEvent["actorType"]
  actorId?: string | null
  inputFingerprintSource: Record<string, unknown>
  timestamp?: string
}

const fingerprint = (value: unknown) => {
  const serialized = JSON.stringify(value) ?? "undefined"
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash = Math.imul(hash ^ serialized.charCodeAt(index), 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

/**
 * Stores operation provenance, not raw prompts or source text. ContentBuild
 * remains the history owner; model/provider values are only recorded when known.
 */
export const recordMetadataOperationProvenance = (
  input: RecordMetadataOperationProvenanceInput,
): ContentBuildEvent => {
  const contentBuildId = input.contentBuildId.trim()
  const operationId = input.operationId.trim()
  const recipeId = input.recipeId.trim()
  const recipeVersion = input.recipeVersion.trim()
  if (!contentBuildId || !operationId || !recipeId || !recipeVersion) {
    throw new Error("Metadata operation provenance requires ContentBuild, operation, recipe and recipe-version IDs.")
  }
  const timestamp = input.timestamp || new Date().toISOString()
  const idempotencyKey = `metadata-operation:${contentBuildId}:${operationId}`
  const evidenceIds = [...new Set((input.evidenceIds || []).filter(Boolean))]
  const outputPackageIds = [...new Set((input.outputPackageIds || []).filter(Boolean))]
  const fields = [...new Set(input.fields.map(field => field.trim()).filter(Boolean))]
  return appendContentBuildEvent({
    contentBuildId,
    idempotencyKey,
    eventType: "tool.output.recorded",
    entityType: "metadata-operation",
    entityId: operationId,
    actorType: input.actorType || "brain",
    actorId: input.actorId || null,
    toolId: input.toolId,
    generationRecordId: input.generationRecordId || null,
    traceId: input.traceId || null,
    inputAssetIds: [],
    outputAssetIds: outputPackageIds,
    evidenceIds,
    timestamp,
    resultingState: {
      schemaVersion: 1,
      operationId,
      operation: input.operation,
      contentBuildId,
      projectId: input.projectId || null,
      videoId: input.videoId || null,
      contextManifestId: input.contextManifestId || null,
      contentBuildRevision: input.contentBuildRevision ?? null,
      fields,
      recipe: { id: recipeId, version: recipeVersion },
      model: { provider: input.provider || null, name: input.model || null },
      inputFingerprint: fingerprint(input.inputFingerprintSource),
      outputPackageIds,
      evidenceIds,
      occurredAt: timestamp,
      rawPromptPersisted: false,
      rawSourceTextPersisted: false,
    },
    metadata: {
      operationId,
      operation: input.operation,
      projectId: input.projectId || null,
      videoId: input.videoId || null,
      contextManifestId: input.contextManifestId || null,
      recipeId,
      recipeVersion,
      fields,
      outputPackageIds,
      idempotencyKey,
    },
  })
}
