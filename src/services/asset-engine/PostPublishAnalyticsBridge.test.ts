import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  appendContentBuildEvent: vi.fn(),
  getContentBuild: vi.fn(),
  listContentBuildEvents: vi.fn(),
  bindYouTubeVideo: vi.fn(),
  getPublishTransaction: vi.fn(),
  getApprovedPublishSnapshot: vi.fn(),
  verifyApprovedPublishSnapshot: vi.fn(),
  recordAlgorithmEvaluation: vi.fn(),
  recordAlgorithmIntelligenceEvent: vi.fn(),
  linkAssetOutcomeToPublication: vi.fn(),
  listAssetOutcomes: vi.fn(),
  createPublicationEvaluationRecordWithDiagnostics: vi.fn(),
  getCurrentCanonicalIntelligenceEvidence: vi.fn(),
}))

vi.mock("./ContentBuildRepository", () => ({
  appendContentBuildEvent: mocks.appendContentBuildEvent,
  getContentBuild: mocks.getContentBuild,
  listContentBuildEvents: mocks.listContentBuildEvents,
  bindYouTubeVideo: mocks.bindYouTubeVideo,
}))
vi.mock("./PublishTransaction", () => ({
  getPublishTransaction: mocks.getPublishTransaction,
}))
vi.mock("./ApprovedPublishSnapshot", () => ({
  getApprovedPublishSnapshot: mocks.getApprovedPublishSnapshot,
  verifyApprovedPublishSnapshot: mocks.verifyApprovedPublishSnapshot,
}))
vi.mock("../brain/AlgorithmEvaluationEngine", () => ({
  recordAlgorithmEvaluation: mocks.recordAlgorithmEvaluation,
}))
vi.mock("../brain/AlgorithmIntelligenceEventLedger", () => ({
  recordAlgorithmIntelligenceEvent: mocks.recordAlgorithmIntelligenceEvent,
}))
vi.mock("../brain/assetOutcomes", () => ({
  linkAssetOutcomeToPublication: mocks.linkAssetOutcomeToPublication,
  listAssetOutcomes: mocks.listAssetOutcomes,
}))
vi.mock("../viewTubeEvaluationLedger", () => ({
  createPublicationEvaluationRecordWithDiagnostics: mocks.createPublicationEvaluationRecordWithDiagnostics,
}))
vi.mock("../analytics-canon", () => ({
  getCurrentCanonicalIntelligenceEvidence: mocks.getCurrentCanonicalIntelligenceEvidence,
}))

import {
  buildPostPublishCheckpointEventId,
  recordAnalyticsCheckpointForEvaluation,
  recordPostPublishIdentity,
} from "./PostPublishAnalyticsBridge"

const transaction = {
  id: "publish-tx-1",
  contentBuildId: "build-1",
  videoPackageId: "package-1",
  idempotencyKey: "publish:build-1:snapshot-1",
  approvedSnapshotId: "snapshot-1",
  approvedSnapshotHash: "hash-1",
  status: "completed",
  steps: { "verify-remote-state": { status: "completed" } },
  assetLock: {
    projectionRevision: 8,
    titleAssetId: "title-v3",
    thumbnailAssetId: "thumbnail-v4",
    finalRenderAssetId: "render-v2",
    descriptionAssetId: "description-v2",
    tagsAssetId: "tags-v1",
    scheduledAt: null,
    lockedAt: "2026-10-01T00:00:00.000Z",
  },
  youtubeVideoId: "youtube-123",
  startedAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:01:00.000Z",
}
const snapshot = {
  schemaVersion: 1,
  id: "snapshot-1",
  hash: "hash-1",
  contentBuildId: "build-1",
  contentBuildRevision: 8,
  projectId: "project-1",
  videoPackageId: "package-1",
  assets: {
    titleAssetId: "title-v3",
    thumbnailAssetId: "thumbnail-v4",
    finalRenderAssetId: "render-v2",
    descriptionAssetId: "description-v2",
    tagsAssetId: "tags-v1",
    endScreenAssetId: null,
    outroAssetId: null,
  },
  scheduledAt: null,
  approval: { approvedBy: "creator-1", approvedAt: "2026-10-01T00:00:00.000Z" },
}
const build = {
  schemaVersion: 1,
  id: "build-1",
  revision: 9,
  channelId: "channel-1",
  legacyProjectId: "project-1",
  profile: {},
  stage: "published",
  assetIds: [],
  selections: {},
  relations: [],
  versions: [],
  variantGroups: [],
  workflow: { completedStepIds: [], blockerIds: [] },
  youtube: null,
  createdAt: "2026-09-30T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
}

describe("Post-publish analytics bridge", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getPublishTransaction.mockReturnValue(transaction)
    mocks.getApprovedPublishSnapshot.mockReturnValue(snapshot)
    mocks.verifyApprovedPublishSnapshot.mockReturnValue(true)
    mocks.getContentBuild.mockReturnValue(build)
    mocks.listContentBuildEvents.mockReturnValue([])
    mocks.listAssetOutcomes.mockReturnValue([])
    mocks.bindYouTubeVideo.mockReturnValue({ ...build, youtube: { videoId: "youtube-123", status: "published" } })
    mocks.appendContentBuildEvent.mockImplementation((input) => ({
      id: "event-1",
      timestamp: input.timestamp || "2026-10-01T00:00:00.000Z",
      ...input,
    }))
    mocks.recordAlgorithmIntelligenceEvent.mockImplementation((input) => input)
    mocks.recordAlgorithmEvaluation.mockReturnValue({ evaluation: { status: "positive" }, recorded: { id: "outcome-1" } })
    mocks.getCurrentCanonicalIntelligenceEvidence.mockReturnValue({ selectedWindow: "28d" })
    mocks.createPublicationEvaluationRecordWithDiagnostics.mockReturnValue({ status: "created", record: { id: "publication-evaluation-1" } })
  })

  it("binds the published video to its exact ContentBuild, approved snapshot, selected assets and producer ancestry", () => {
    mocks.listAssetOutcomes.mockReturnValue([
      { id: "outcome-title", assetId: "title-v3", traceId: "trace-title", channelId: "channel-1" },
      { id: "outcome-thumbnail", assetId: "thumbnail-v4", traceId: "trace-thumbnail", channelId: "channel-1" },
      { id: "outcome-unselected", assetId: "other-asset", traceId: "trace-other", channelId: "channel-1" },
    ])
    const result = recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
      correlationId: "creator-loop-1",
      actionPacketId: "action-packet-1",
      workflowId: "workflow-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
    })

    expect(result.identity.assetOutcomeRecordIds).toEqual(["outcome-thumbnail", "outcome-title"])
    expect(result.identity.generationTraceIds).toEqual(["trace-thumbnail", "trace-title"])
    expect(mocks.bindYouTubeVideo).toHaveBeenCalledWith(expect.objectContaining({
      contentBuildId: "build-1",
      videoId: "youtube-123",
      initialTitleAssetId: "title-v3",
      initialThumbnailAssetId: "thumbnail-v4",
      finalRenderAssetId: "render-v2",
    }))
    expect(result.identity).toMatchObject({
      schemaVersion: 1,
      contentBuildId: "build-1",
      projectId: "project-1",
      projectAssociationStatus: "verified",
      videoPackageId: "package-1",
      publishTransactionId: "publish-tx-1",
      youtubeVideoId: "youtube-123",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "hash-1",
      idempotencyKey: "post-publish-identity:publish-tx-1:hash-1",
      actionPacketId: "action-packet-1",
      workflowId: "workflow-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
    })
    expect(mocks.bindYouTubeVideo).toHaveBeenCalledWith(expect.objectContaining({
      idempotencyKey: "post-publish-binding:publish-tx-1:hash-1",
    }))
    expect(result).toMatchObject({
      contentBuildId: "build-1",
      projectId: "project-1",
      videoId: "youtube-123",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "hash-1",
      selectedVariantAssetIds: ["title-v3", "thumbnail-v4", "render-v2", "description-v2", "tags-v1"],
    })
    expect(mocks.linkAssetOutcomeToPublication).toHaveBeenCalledWith(expect.objectContaining({
      assetId: "title-v3",
      channelId: "channel-1",
      publicationIdentity: expect.objectContaining({
        publishTransactionId: "publish-tx-1",
        youtubeVideoId: "youtube-123",
        approvedSnapshotHash: "hash-1",
      }),
    }))
    expect(mocks.appendContentBuildEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: "youtube.state.changed",
      entityType: "publish-identity-receipt",
      metadata: expect.objectContaining({
        publishTransactionId: "publish-tx-1",
        approvedSnapshotId: "snapshot-1",
        approvedSnapshotHash: "hash-1",
        correlationId: "creator-loop-1",
        actionPacketId: "action-packet-1",
        workflowId: "workflow-1",
        recommendationId: "recommendation-1",
        experimentId: "experiment-1",
        assetOutcomeRecordIds: ["outcome-thumbnail", "outcome-title"],
        generationTraceIds: ["trace-thumbnail", "trace-title"],
      }),
    }))
  })

  it("reports snapshot-only project association instead of guessing a missing Project link", () => {
    mocks.getContentBuild.mockReturnValue({ ...build, legacyProjectId: null })

    const result = recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
    })

    expect(result.identity.projectAssociationStatus).toBe("snapshot-only")
    expect(result.identity.projectId).toBe("project-1")
  })

  it("reuses an existing identity receipt without rebinding or appending a duplicate", () => {
    const existingReceipt = {
      id: "event-existing",
      contentBuildId: "build-1",
      timestamp: "2026-10-01T00:00:00.000Z",
      eventType: "youtube.state.changed",
      entityType: "publish-identity-receipt",
      entityId: "publish-tx-1",
      actorType: "youtube",
      inputAssetIds: [],
      outputAssetIds: ["youtube-123"],
      evidenceIds: [],
      idempotencyKey: "post-publish-identity:publish-tx-1:hash-1",
      metadata: { approvedSnapshotHash: "hash-1", actionPacketId: "action-packet-1", workflowId: "workflow-1", recommendationId: "recommendation-1", experimentId: "experiment-1", assetOutcomeRecordIds: ["outcome-existing"], generationTraceIds: ["trace-existing"] },
    }
    mocks.listContentBuildEvents.mockReturnValue([existingReceipt])

    const result = recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
    })

    expect(result.event.id).toBe("event-existing")
    expect(result.identity).toMatchObject({
      actionPacketId: "action-packet-1",
      workflowId: "workflow-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
    })
    expect(mocks.bindYouTubeVideo).not.toHaveBeenCalled()
    expect(mocks.appendContentBuildEvent).not.toHaveBeenCalled()
  })

  it("rejects a transaction whose video identity does not match", () => {
    expect(() => recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "different-video",
    })).toThrow(/does not match/)
    expect(mocks.bindYouTubeVideo).not.toHaveBeenCalled()
  })

  it("rejects a snapshot that points to a different source project", () => {
    mocks.getContentBuild.mockReturnValue({ ...build, legacyProjectId: "other-project" })

    expect(() => recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
    })).toThrow(/does not match the source ContentBuild project/)
    expect(mocks.bindYouTubeVideo).not.toHaveBeenCalled()
    expect(mocks.appendContentBuildEvent).not.toHaveBeenCalled()
  })

  it("rejects a publish transaction that has not completed", () => {
    mocks.getPublishTransaction.mockReturnValue({ ...transaction, status: "running" })

    expect(() => recordPostPublishIdentity({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
    })).toThrow(/before the publish transaction is completed/)
    expect(mocks.bindYouTubeVideo).not.toHaveBeenCalled()
  })

  it("records a checkpoint on ContentBuild and sends it to canonical evaluation with exact lineage", () => {
    const result = recordAnalyticsCheckpointForEvaluation({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
      checkpointId: "day-7",
      checkpointAt: 1790812800000,
      actionPacketId: "action-packet-1",
      workflowId: "workflow-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
      observations: [{ metric: "views", value: 1200, observedAt: 1790812800000, evidenceId: "evidence-1" }],
      evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 1000 }],
      evidenceIds: ["evidence-1"],
    })

    const expectedId = "post-publish-checkpoint:build-1:youtube-123:day-7"
    expect(buildPostPublishCheckpointEventId({
      contentBuildId: "build-1",
      videoId: "youtube-123",
      checkpointId: "day-7",
    })).toBe(expectedId)
    expect(mocks.appendContentBuildEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: "analytics.checkpoint",
      entityId: expectedId,
      metadata: expect.objectContaining({
        contentBuildId: "build-1",
        projectId: "project-1",
        videoId: "youtube-123",
        publishTransactionId: "publish-tx-1",
        actionPacketId: "action-packet-1",
        workflowId: "workflow-1",
        recommendationId: "recommendation-1",
        experimentId: "experiment-1",
        approvedSnapshotId: "snapshot-1",
        selectedVariantAssetIds: ["title-v3", "thumbnail-v4", "render-v2", "description-v2", "tags-v1"],
      }),
    }))
    expect(mocks.recordAlgorithmIntelligenceEvent).toHaveBeenCalledWith(expect.objectContaining({
      id: expectedId,
      channelId: "channel-1",
      projectId: "project-1",
      videoId: "youtube-123",
      kind: "CHECKPOINT_REACHED",
      evidenceIds: ["evidence-1"],
    }))
    expect(mocks.recordAlgorithmEvaluation).toHaveBeenCalledWith(expect.objectContaining({
      sourceEventId: expectedId,
      metadata: expect.objectContaining({
        contentBuildId: "build-1",
        publishTransactionId: "publish-tx-1",
        approvedSnapshotHash: "hash-1",
      }),
    }))
    expect(result.evaluation.status).toBe("positive")
    expect(result.publicationEvaluation).toEqual({ id: "publication-evaluation-1" })
    expect(mocks.createPublicationEvaluationRecordWithDiagnostics).toHaveBeenCalledWith(expect.objectContaining({
      publicationIdentity: expect.objectContaining({
        contentBuildId: "build-1",
        publishTransactionId: "publish-tx-1",
        youtubeVideoId: "youtube-123",
        approvedSnapshotHash: "hash-1",
      }),
      selectedWindow: "28d",
      source: "post-publication-checkpoint",
      comparabilityStatus: "unknown",
      causalAssessment: "insufficient_evidence",
    }))
  })

  it("surfaces a canonical evaluation skip reason to post-publish callers", () => {
    mocks.createPublicationEvaluationRecordWithDiagnostics.mockReturnValue({
      status: "skipped",
      reason: "published-video-not-found-in-canonical-videos-dataset",
    })

    const result = recordAnalyticsCheckpointForEvaluation({
      transactionId: "publish-tx-1",
      videoId: "youtube-123",
      checkpointId: "day-7-missing-video",
      checkpointAt: 1790812800000,
      observations: [{ metric: "views", value: 1200, observedAt: 1790812800000, evidenceId: "evidence-1" }],
      evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 1000 }],
      evidenceIds: ["evidence-1"],
    })

    expect(result.publicationEvaluation).toBeNull()
    expect(result.publicationEvaluationStatus).toBe("skipped")
    expect(result.publicationEvaluationError).toBe("published-video-not-found-in-canonical-videos-dataset")
    expect(mocks.recordAlgorithmIntelligenceEvent).toHaveBeenCalledWith(expect.objectContaining({
      id: "publication-evaluation-blocked:publish-tx-1:day-7-missing-video",
      kind: "EVALUATION_BLOCKED",
      sourceSystem: "evaluation",
      metadata: expect.objectContaining({
        evaluationStatus: "skipped",
        skipReason: "published-video-not-found-in-canonical-videos-dataset",
      }),
    }))
  })

})
