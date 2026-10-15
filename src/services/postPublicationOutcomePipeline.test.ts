import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  listContentBuilds: vi.fn(),
  listContentBuildEvents: vi.fn(),
  listContentBuildMetadataHistory: vi.fn(),
  listPublishTransactions: vi.fn(),
  recordAnalyticsCheckpointForEvaluation: vi.fn(),
  fetchAndRecordHistoricalMetadataComparison: vi.fn(),
  fetchCanonicalAnalyticsReport: vi.fn(),
  listAlgorithmIntelligenceEvents: vi.fn(),
  recordAlgorithmEvaluation: vi.fn(),
}))

vi.mock("./asset-engine/ContentBuildRepository", () => ({
  listContentBuilds: mocks.listContentBuilds,
  listContentBuildEvents: mocks.listContentBuildEvents,
  listContentBuildMetadataHistory: mocks.listContentBuildMetadataHistory,
}))
vi.mock("./asset-engine/PublishTransaction", () => ({
  listPublishTransactions: mocks.listPublishTransactions,
}))
vi.mock("./asset-engine/PostPublishAnalyticsBridge", () => ({
  recordAnalyticsCheckpointForEvaluation: mocks.recordAnalyticsCheckpointForEvaluation,
}))
vi.mock("./historicalMetadataIntelligence", () => ({
  fetchAndRecordHistoricalMetadataComparison: mocks.fetchAndRecordHistoricalMetadataComparison,
}))
vi.mock("./canonicalSync/query", () => ({
  fetchCanonicalAnalyticsReport: mocks.fetchCanonicalAnalyticsReport,
  rowsToObjects: (payload: { columnHeaders: Array<{ name: string }>; rows: unknown[][] }) =>
    payload.rows.map(row => Object.fromEntries(payload.columnHeaders.map((header, index) => [header.name, row[index]]))),
}))
vi.mock("./brain/AlgorithmIntelligenceEventLedger", () => ({
  listAlgorithmIntelligenceEvents: mocks.listAlgorithmIntelligenceEvents,
}))
vi.mock("./brain/AlgorithmEvaluationEngine", () => ({
  recordAlgorithmEvaluation: mocks.recordAlgorithmEvaluation,
}))
vi.mock("./analytics/windows", () => ({
  latestCompleteAnalyticsDate: (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)),
}))

import { runPostPublicationOutcomePipeline } from "./postPublicationOutcomePipeline"

describe("post-publication outcome pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.listContentBuilds.mockReturnValue([{
      id: "build-1",
      channelId: "channel-1",
      youtube: { status: "published", videoId: "video-1" },
    }])
    mocks.listContentBuildEvents.mockReturnValue([])
    mocks.listContentBuildMetadataHistory.mockReturnValue([{
      schemaVersion: 1,
      contentBuildId: "build-1",
      metadataVersionId: "metadata-v1",
      operationId: "publish-op-1",
      operation: "publish",
      fields: [{ field: "title", before: null, after: "Launch title" }],
      actorType: "creator",
      actorId: "creator-1",
      sourceToolId: "video-publisher",
      generationRecordId: null,
      promptRecipeId: null,
      promptRecipeVersion: null,
      sourceAssetIds: ["title-asset-1"],
      resultingAssetIds: ["title-asset-1"],
      publishTransactionId: "tx-1",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "snapshot-hash-1",
      publishedVideoId: "video-1",
      analyticsCheckpointIds: [],
      evidenceIds: ["publish-receipt-1"],
      occurredAt: "2026-10-01T12:00:00.000Z",
    }])
    mocks.listPublishTransactions.mockReturnValue([{
      id: "tx-1",
      contentBuildId: "build-1",
      status: "completed",
      youtubeVideoId: "video-1",
      approvedSnapshotId: "snapshot-1",
      approvedSnapshotHash: "snapshot-hash-1",
      workflowId: "workflow-1",
      operationId: "operation-1",
      actionPacketId: "packet-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
    }])
    mocks.listAlgorithmIntelligenceEvents.mockImplementation(({ kind }: { kind?: string }) =>
      kind === "OUTCOME_MEASURED" ? [] : [{
        id: "recommendation-1",
        channelId: "channel-1",
        videoId: "video-1",
        kind: "RECOMMENDATION_CREATED",
        checkpointAt: Date.parse("2026-10-10T12:00:00.000Z"),
        evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 100 }],
        metadata: { contentBuildId: "build-1" },
        parentEventIds: [],
      }]
    )
    mocks.fetchCanonicalAnalyticsReport.mockResolvedValue({
      columnHeaders: [
        { name: "day" },
        { name: "views" },
        { name: "estimatedMinutesWatched" },
        { name: "averageViewPercentage" },
        { name: "likes" },
        { name: "comments" },
        { name: "estimatedRevenue" },
      ],
      rows: Array.from({ length: 8 }, (_, index) => [
        new Date(Date.UTC(2026, 9, 7 + index)).toISOString().slice(0, 10),
        100 + index * 10,
        500 + index * 20,
        40 + index,
        10 + index,
        2 + index,
        1 + index / 10,
      ]),
    })
    mocks.recordAnalyticsCheckpointForEvaluation.mockReturnValue({
      identity: { event: { id: "identity-1" } },
      checkpointEvent: { id: "checkpoint-event-1" },
      evaluation: { status: "neutral" },
      recorded: { id: "checkpoint-outcome-1" },
      publicationEvaluation: { id: "publication-evaluation-1" },
      publicationEvaluationError: null,
    })
    mocks.recordAlgorithmEvaluation.mockReturnValue({ evaluation: { status: "positive" }, recorded: { id: "recommendation-outcome-1" } })
    mocks.fetchAndRecordHistoricalMetadataComparison.mockResolvedValue({
      status: "ready",
      analysisEventId: "comparison-event-1",
    })
  })

  it("connects a verified publication to daily checkpoints, recommendation outcomes, and historical comparisons", async () => {
    const result = await runPostPublicationOutcomePipeline({
      channelId: "channel-1",
      now: new Date("2026-10-15T12:00:00.000Z"),
    })

    expect(mocks.fetchCanonicalAnalyticsReport).toHaveBeenCalledWith(expect.objectContaining({
      startDate: "2026-10-07",
      endDate: "2026-10-14",
      dimensions: ["day"],
      filters: ["video==video-1"],
    }), "Post-publication outcome checkpoint")
    expect(mocks.recordAnalyticsCheckpointForEvaluation).toHaveBeenCalledWith(expect.objectContaining({
      transactionId: "tx-1",
      videoId: "video-1",
      actionPacketId: "packet-1",
      workflowId: "workflow-1",
      recommendationId: "recommendation-1",
      experimentId: "experiment-1",
      correlationId: "operation-1",
      checkpointId: "daily:2026-10-14",
      toolId: "canonical-analytics-sync",
    }))
    expect(mocks.recordAlgorithmEvaluation).toHaveBeenCalledWith(expect.objectContaining({
      sourceEventId: "recommendation-1",
      metadata: expect.objectContaining({
        contentBuildId: "build-1",
        publicationTransactionId: "tx-1",
        workflowId: "workflow-1",
        operationId: "operation-1",
        actionPacketId: "packet-1",
        recommendationId: "recommendation-1",
        experimentId: "experiment-1",
        checkpointId: "daily:2026-10-14",
        causalConclusion: null,
      }),
    }))
    expect(mocks.fetchAndRecordHistoricalMetadataComparison).toHaveBeenCalledWith(expect.objectContaining({
      contentBuildId: "build-1",
      videoId: "video-1",
      metadataVersionId: "metadata-v1",
    }))
    expect(result).toMatchObject({
      status: "complete",
      publishedBuildsChecked: 1,
      checkpointsRecorded: 1,
      recommendationEvaluations: 1,
      metadataComparisonsRecorded: 1,
      metadataComparisonsReady: 1,
      failures: [],
    })
  })

  it("retries an existing daily checkpoint so missing recommendation outcomes can recover", async () => {
    mocks.listContentBuildEvents.mockReturnValue([{
      eventType: "analytics.checkpoint",
      entityType: "analytics-checkpoint",
      metadata: { videoId: "video-1", checkpointId: "daily:2026-10-14" },
    }])

    const result = await runPostPublicationOutcomePipeline({
      channelId: "channel-1",
      now: new Date("2026-10-15T12:00:00.000Z"),
    })

    expect(mocks.recordAnalyticsCheckpointForEvaluation).toHaveBeenCalled()
    expect(mocks.recordAlgorithmEvaluation).toHaveBeenCalledWith(expect.objectContaining({
      sourceEventId: "recommendation-1",
      metadata: expect.objectContaining({ checkpointId: "daily:2026-10-14" }),
    }))
    expect(result).toMatchObject({
      status: "complete",
      checkpointsRecorded: 0,
      recommendationEvaluations: 1,
      failures: [],
    })
  })

  it("surfaces a missing canonical publication evaluation as a partial pipeline failure", async () => {
    mocks.recordAnalyticsCheckpointForEvaluation.mockReturnValue({
      identity: { event: { id: "identity-1" } },
      checkpointEvent: { id: "checkpoint-event-1" },
      evaluation: { status: "neutral" },
      recorded: { id: "checkpoint-outcome-1" },
      publicationEvaluation: null,
      publicationEvaluationError: "Exact published video is absent from the current canonical snapshot.",
    })

    const result = await runPostPublicationOutcomePipeline({
      channelId: "channel-1",
      now: new Date("2026-10-15T12:00:00.000Z"),
    })

    expect(result.status).toBe("partial")
    expect(result.failures).toContainEqual(expect.objectContaining({
      contentBuildId: "build-1",
      stage: "analytics-checkpoint",
      code: "canonical-publication-evaluation-unavailable",
    }))
  })

  it("does not query or join another channel's publication history", async () => {
    const result = await runPostPublicationOutcomePipeline({
      channelId: "channel-other",
      now: new Date("2026-10-15T12:00:00.000Z"),
    })
    expect(mocks.fetchCanonicalAnalyticsReport).not.toHaveBeenCalled()
    expect(mocks.recordAnalyticsCheckpointForEvaluation).not.toHaveBeenCalled()
    expect(mocks.fetchAndRecordHistoricalMetadataComparison).not.toHaveBeenCalled()
    expect(result.status).toBe("idle")
  })
})
