import { appendContentBuildEvent, getContentBuild, listContentBuildEvents, bindYouTubeVideo } from "./ContentBuildRepository"
import { getPublishTransaction } from "./PublishTransaction"
import { getApprovedPublishSnapshot, verifyApprovedPublishSnapshot } from "./ApprovedPublishSnapshot"
import {
  recordAlgorithmEvaluation,
  type AlgorithmMetricObservation,
} from "../brain/AlgorithmEvaluationEngine"
import {
  recordAlgorithmIntelligenceEvent,
  type AlgorithmEvaluationTarget,
} from "../brain/AlgorithmIntelligenceEventLedger"
import type { BrainConfidenceLevel } from "../../types"
import { linkAssetOutcomeToPublication, listAssetOutcomes } from "../brain/assetOutcomes"
import { createPublicationEvaluationRecordWithDiagnostics } from "../viewTubeEvaluationLedger"
import { getCurrentCanonicalIntelligenceEvidence, type AnalyticsWindow } from "../analytics-canon"
import { CONTENT_BUILD_PUBLICATION_IDENTITY_SCHEMA_VERSION, type ContentBuildEvent, type ContentBuildPublicationIdentity, type ContentBuildYouTubeBinding } from "./contracts"

export interface PostPublishIdentityInput {
  transactionId: string
  videoId: string
  status?: ContentBuildYouTubeBinding["status"]
  publishedAt?: string | null
  correlationId?: string | null
  actionPacketId?: string | null
  workflowId?: string | null
  recommendationId?: string | null
  experimentId?: string | null
  toolId?: string
}

export interface PostPublishIdentityReceipt {
  event: ContentBuildEvent
  identity: ContentBuildPublicationIdentity
  contentBuildId: string
  projectId: string
  videoId: string
  approvedSnapshotId: string
  approvedSnapshotHash: string
  selectedVariantAssetIds: string[]
}

const required = (value: string | null | undefined, label: string): string => {
  if (!value || !value.trim()) throw new Error(`Post-publish identity requires ${label}.`)
  return value.trim()
}

const selectedAssets = (transaction: NonNullable<ReturnType<typeof getPublishTransaction>>) =>
  [...new Set([
    transaction.assetLock.titleAssetId,
    transaction.assetLock.thumbnailAssetId,
    transaction.assetLock.finalRenderAssetId,
    transaction.assetLock.descriptionAssetId,
    transaction.assetLock.tagsAssetId,
  ].filter((id): id is string => Boolean(id)))]

const linkPublishedAssetOutcomes = (identity: ContentBuildPublicationIdentity) => {
  if (!identity.channelId) return
  for (const assetId of identity.selectedVariantAssetIds) {
    linkAssetOutcomeToPublication({
      assetId,
      channelId: identity.channelId,
      publicationIdentity: identity,
    })
  }
}

const resolvePublishIdentity = (transactionId: string, videoId: string) => {
  const transaction = getPublishTransaction(required(transactionId, "transactionId"))
  if (!transaction) throw new Error(`Unknown publish transaction: ${transactionId}`)
  if (transaction.status !== "completed") {
    throw new Error("Post-publish identity cannot be recorded before the publish transaction is completed.")
  }
  if (transaction.youtubeVideoId !== videoId) {
    throw new Error("Post-publish video ID does not match the completed publish transaction.")
  }

  const snapshot = getApprovedPublishSnapshot(transaction.approvedSnapshotId)
  if (!snapshot || !verifyApprovedPublishSnapshot(snapshot)) {
    throw new Error("Post-publish identity requires a valid approved publish snapshot.")
  }
  if (
    snapshot.contentBuildId !== transaction.contentBuildId ||
    snapshot.id !== transaction.approvedSnapshotId ||
    snapshot.hash !== transaction.approvedSnapshotHash
  ) {
    throw new Error("Publish transaction and approved snapshot identity do not match.")
  }

  const build = getContentBuild(transaction.contentBuildId)
  if (!build) throw new Error(`Unknown ContentBuild: ${transaction.contentBuildId}`)
  required(snapshot.projectId, "approved snapshot projectId")
  if (build.legacyProjectId && build.legacyProjectId !== snapshot.projectId) {
    throw new Error("Approved snapshot project does not match the source ContentBuild project.")
  }

  return { transaction, snapshot, build }
}

/**
 * Writes the immutable publication-to-ContentBuild link as a receipt on the
 * existing ContentBuild event stream. The ContentBuild repository remains the
 * lifecycle owner; this module does not create another event store.
 */
export const recordPostPublishIdentity = (
  input: PostPublishIdentityInput,
): PostPublishIdentityReceipt => {
  const videoId = required(input.videoId, "videoId")
  const { transaction, snapshot, build } = resolvePublishIdentity(input.transactionId, videoId)
  const assetIds = selectedAssets(transaction)
  const selectedOutcomes = listAssetOutcomes({ channelId: build.channelId || undefined })
    .filter((outcome) => assetIds.includes(outcome.assetId))
    .sort((left, right) => left.id.localeCompare(right.id))
  const assetOutcomeRecordIds = [...new Set(selectedOutcomes.map((outcome) => outcome.id))]
  const generationTraceIds = [...new Set(selectedOutcomes.map((outcome) => outcome.traceId).filter(Boolean))]
  if (build.youtube?.videoId && build.youtube.videoId !== videoId) {
    throw new Error("ContentBuild is already bound to a different YouTube video; refusing to overwrite lineage.")
  }
  const identityKey = `post-publish-identity:${transaction.id}:${snapshot.hash}`
  const bindingKey = `post-publish-binding:${transaction.id}:${snapshot.hash}`
  const identity: ContentBuildPublicationIdentity = {
    schemaVersion: CONTENT_BUILD_PUBLICATION_IDENTITY_SCHEMA_VERSION,
    contentBuildId: build.id,
    projectId: snapshot.projectId,
    projectAssociationStatus: build.legacyProjectId === snapshot.projectId ? "verified" : "snapshot-only",
    videoPackageId: transaction.videoPackageId,
    publishTransactionId: transaction.id,
    youtubeVideoId: videoId,
    channelId: build.channelId || null,
    approvedSnapshotId: snapshot.id,
    approvedSnapshotHash: snapshot.hash,
    selectedVariantAssetIds: assetIds,
    correlationId: input.correlationId || transaction.id,
    actionPacketId: input.actionPacketId || transaction.actionPacketId || null,
    workflowId: input.workflowId || transaction.workflowId || null,
    recommendationId: input.recommendationId || transaction.recommendationId || null,
    experimentId: input.experimentId || transaction.experimentId || null,
    assetOutcomeRecordIds,
    generationTraceIds,
    idempotencyKey: identityKey,
    publishedAt: input.publishedAt || build.youtube?.publishedAt || null,
  }
  const existingReceipt = listContentBuildEvents(build.id).find(event =>
    event.eventType === "youtube.state.changed" &&
    event.entityType === "publish-identity-receipt" &&
    event.entityId === transaction.id &&
    ((event.idempotencyKey === identityKey) ||
      (event.metadata as Record<string, unknown> | undefined)?.idempotencyKey === identityKey ||
      (event.metadata as Record<string, unknown> | undefined)?.approvedSnapshotHash === snapshot.hash)
  )

  if (existingReceipt) {
    const receiptMetadata = existingReceipt.metadata as Record<string, unknown> | undefined
    const decisionIdentityPairs = [
      ["actionPacketId", input.actionPacketId || transaction.actionPacketId],
      ["workflowId", input.workflowId || transaction.workflowId],
      ["recommendationId", input.recommendationId || transaction.recommendationId],
      ["experimentId", input.experimentId || transaction.experimentId],
    ] as const
    for (const [key, requestedValue] of decisionIdentityPairs) {
      if (requestedValue && receiptMetadata?.[key] !== requestedValue) {
        throw new Error(`Existing publication receipt conflicts with ${key}; immutable decision lineage cannot be relinked.`)
      }
    }
    const receiptString = (key: string): string | null =>
      typeof receiptMetadata?.[key] === "string" ? receiptMetadata[key] as string : null
    const receiptStringArray = (key: string): string[] =>
      Array.isArray(receiptMetadata?.[key])
        ? (receiptMetadata[key] as unknown[]).filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
        : []
    identity.actionPacketId = identity.actionPacketId || receiptString("actionPacketId")
    identity.workflowId = identity.workflowId || receiptString("workflowId")
    identity.recommendationId = identity.recommendationId || receiptString("recommendationId")
    identity.experimentId = identity.experimentId || receiptString("experimentId")
    identity.assetOutcomeRecordIds = [...new Set([...receiptStringArray("assetOutcomeRecordIds"), ...(identity.assetOutcomeRecordIds || [])])]
    identity.generationTraceIds = [...new Set([...receiptStringArray("generationTraceIds"), ...(identity.generationTraceIds || [])])]
    linkPublishedAssetOutcomes(identity)
    return {
      event: existingReceipt,
      identity,
      contentBuildId: build.id,
      projectId: snapshot.projectId,
      videoId,
      approvedSnapshotId: snapshot.id,
      approvedSnapshotHash: snapshot.hash,
      selectedVariantAssetIds: assetIds,
    }
  }

  const binding = bindYouTubeVideo({
    idempotencyKey: bindingKey,
    contentBuildId: build.id,
    videoId,
    channelId: build.channelId || null,
    status: input.status || build.youtube?.status || "published",
    publishedAt: input.publishedAt || build.youtube?.publishedAt || null,
    uploadStartedAt: build.youtube?.uploadStartedAt || null,
    uploadCompletedAt: build.youtube?.uploadCompletedAt || null,
    scheduledAt: transaction.assetLock.scheduledAt,
    initialTitleAssetId: transaction.assetLock.titleAssetId,
    initialThumbnailAssetId: transaction.assetLock.thumbnailAssetId,
    finalRenderAssetId: transaction.assetLock.finalRenderAssetId,
    lastVerifiedAt: build.youtube?.lastVerifiedAt || null,
    toolId: input.toolId || "video-publisher",
  })

  const event = appendContentBuildEvent({
    contentBuildId: build.id,
    idempotencyKey: identityKey,
    eventType: "youtube.state.changed",
    entityType: "publish-identity-receipt",
    entityId: transaction.id,
    actorType: "youtube",
    actionPacketId: identity.actionPacketId || null,
    toolId: input.toolId || "video-publisher",
    previousState: build.youtube || null,
    resultingState: binding.youtube || null,
    inputAssetIds: assetIds,
    outputAssetIds: [videoId],
    timestamp: input.publishedAt || undefined,
    metadata: {
      operationId: transaction.operationId || transaction.id,
      ...identity,
      publishIdempotencyKey: transaction.idempotencyKey,
    },
  })

  linkPublishedAssetOutcomes(identity)
  return {
    event,
    identity,
    contentBuildId: build.id,
    projectId: snapshot.projectId,
    videoId,
    approvedSnapshotId: snapshot.id,
    approvedSnapshotHash: snapshot.hash,
    selectedVariantAssetIds: assetIds,
  }
}

export interface AnalyticsCheckpointBridgeInput extends PostPublishIdentityInput {
  checkpointId: string
  selectedWindow?: AnalyticsWindow
  checkpointAt: number
  observations: AlgorithmMetricObservation[]
  evaluationTargets: AlgorithmEvaluationTarget[]
  evidenceIds?: string[]
  confidence?: BrainConfidenceLevel
  now?: number
  summary?: string
}

export const buildPostPublishCheckpointEventId = (input: {
  contentBuildId: string
  videoId: string
  checkpointId: string
}) => `post-publish-checkpoint:${required(input.contentBuildId, "contentBuildId")}:${required(input.videoId, "videoId")}:${required(input.checkpointId, "checkpointId")}`

/**
 * Joins one analytics checkpoint to the exact completed publication and sends
 * it through the existing Algorithm Intelligence evaluation ledger. Metric
 * comparability remains enforced by AlgorithmEvaluationEngine.
 */
export const recordAnalyticsCheckpointForEvaluation = (
  input: AnalyticsCheckpointBridgeInput,
) => {
  const checkpointId = required(input.checkpointId, "checkpointId")
  if (!Number.isFinite(input.checkpointAt) || input.checkpointAt <= 0) {
    throw new Error("Analytics checkpoint requires a valid epoch-millisecond checkpointAt.")
  }
  const identity = recordPostPublishIdentity(input)
  const { transaction, snapshot, build } = resolvePublishIdentity(input.transactionId, input.videoId)
  const eventId = buildPostPublishCheckpointEventId({
    contentBuildId: identity.contentBuildId,
    videoId: identity.videoId,
    checkpointId,
  })
  const evidenceIds = [...new Set(input.evidenceIds || input.observations
    .map(observation => observation.evidenceId)
    .filter((id): id is string => Boolean(id)))]
  const metadata = {
    checkpointId,
    checkpointAt: input.checkpointAt,
    contentBuildId: build.id,
    projectId: snapshot.projectId,
    videoId: identity.videoId,
    publishTransactionId: transaction.id,
    operationId: transaction.operationId || transaction.id,
    actionPacketId: identity.identity.actionPacketId,
    workflowId: identity.identity.workflowId,
    recommendationId: identity.identity.recommendationId,
    experimentId: identity.identity.experimentId,
    correlationId: input.correlationId || transaction.operationId || transaction.id,
    approvedSnapshotId: snapshot.id,
    approvedSnapshotHash: snapshot.hash,
    selectedVariantAssetIds: identity.selectedVariantAssetIds,
    idempotencyKey: eventId,
  }

  if (!listContentBuildEvents(build.id).some(event =>
    event.eventType === "analytics.checkpoint" &&
    (event.metadata as Record<string, unknown> | undefined)?.checkpointId === checkpointId &&
    (event.metadata as Record<string, unknown> | undefined)?.videoId === identity.videoId
  )) {
    appendContentBuildEvent({
      contentBuildId: build.id,
      idempotencyKey: eventId,
      eventType: "analytics.checkpoint",
      entityType: "analytics-checkpoint",
      entityId: eventId,
      actorType: "analytics",
      toolId: input.toolId || "analytics-canon",
      evidenceIds,
      inputAssetIds: identity.selectedVariantAssetIds,
      timestamp: new Date(input.checkpointAt).toISOString(),
      metadata: { ...metadata, observations: input.observations },
    })
  }

  const checkpointEvent = recordAlgorithmIntelligenceEvent({
    id: eventId,
    channelId: required(build.channelId, "ContentBuild channelId"),
    projectId: snapshot.projectId,
    videoId: identity.videoId,
    kind: "CHECKPOINT_REACHED",
    sourceSystem: "workflow",
    sourceId: checkpointId,
    parentEventIds: [identity.event.id],
    evidenceIds,
    confidence: input.confidence || "medium",
    title: `Publication analytics checkpoint: ${checkpointId}`,
    summary: input.summary || "Analytics checkpoint linked to the approved publication snapshot and source ContentBuild.",
    evaluationTargets: input.evaluationTargets,
    checkpointAt: input.checkpointAt,
    metadata: { ...metadata, observations: input.observations },
  })

  const result = recordAlgorithmEvaluation({
    sourceEventId: checkpointEvent.id,
    observations: input.observations,
    now: input.now,
    metadata: {
      ...metadata,
      checkpointEventId: checkpointEvent.id,
      evaluationBridge: "contentbuild-publication-analytics-v1",
    },
  })

  let publicationEvaluation = null
  let publicationEvaluationStatus: "created" | "skipped" | "error" = "skipped"
  let publicationEvaluationError: string | null = null
  try {
    const canonical = getCurrentCanonicalIntelligenceEvidence({
      window: input.selectedWindow,
      sectionIds: ["executive-summary"],
    })
    const evaluationResult = createPublicationEvaluationRecordWithDiagnostics({
      publicationIdentity: identity.identity,
      selectedWindow: input.selectedWindow || canonical.selectedWindow,
      source: "post-publication-checkpoint",
      recommendation: input.summary || "Evaluate observed performance for the published variant.",
      comparabilityStatus: "unknown",
      causalAssessment: "insufficient_evidence",
    })
    if (evaluationResult.status === "created") {
      publicationEvaluation = evaluationResult.record
      publicationEvaluationStatus = "created"
    } else {
      publicationEvaluationStatus = "skipped"
      publicationEvaluationError = evaluationResult.reason
      recordAlgorithmIntelligenceEvent({
        id: "publication-evaluation-blocked:" + identity.identity.publishTransactionId + ":" + input.checkpointId,
        channelId: identity.identity.channelId,
        projectId: identity.identity.projectId,
        videoId: identity.identity.youtubeVideoId,
        kind: "EVALUATION_BLOCKED",
        sourceSystem: "evaluation",
        sourceId: checkpointEvent.id,
        parentEventIds: [checkpointEvent.id],
        recommendationId: identity.identity.recommendationId || null,
        actionPacketId: identity.identity.actionPacketId || null,
        workflowId: identity.identity.workflowId || null,
        evidenceIds: input.evidenceIds || [],
        confidence: "low",
        title: "Publication evaluation deferred",
        summary: "Canonical publication evaluation skipped: " + evaluationResult.reason,
        evaluationTargets: input.evaluationTargets || [],
        checkpointAt: input.checkpointAt,
        metadata: {
          contentBuildId: identity.identity.contentBuildId,
          publishTransactionId: identity.identity.publishTransactionId,
          approvedSnapshotId: identity.identity.approvedSnapshotId,
          approvedSnapshotHash: identity.identity.approvedSnapshotHash,
          checkpointId: input.checkpointId,
          selectedWindow: input.selectedWindow || canonical.selectedWindow,
          evaluationStatus: "skipped",
          skipReason: evaluationResult.reason,
          evaluationBridge: "contentbuild-publication-analytics-v1",
        },
      })
    }
  } catch (cause) {
    publicationEvaluationStatus = "error"
    publicationEvaluationError = cause instanceof Error ? cause.message : String(cause)
  }

  return { identity, checkpointEvent, ...result, publicationEvaluation, publicationEvaluationStatus, publicationEvaluationError }
}
