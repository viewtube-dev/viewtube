// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const algorithmMocks = vi.hoisted(() => ({
  recordAlgorithmEvaluation: vi.fn(),
  recordAlgorithmIntelligenceEvent: vi.fn((input: Record<string, unknown>) => input),
  listAlgorithmIntelligenceEvents: vi.fn(() => []),
}))

vi.mock("./brain/AlgorithmEvaluationEngine", () => ({
  recordAlgorithmEvaluation: algorithmMocks.recordAlgorithmEvaluation,
}))
vi.mock("./brain/AlgorithmIntelligenceEventLedger", () => ({
  recordAlgorithmIntelligenceEvent: algorithmMocks.recordAlgorithmIntelligenceEvent,
  listAlgorithmIntelligenceEvents: algorithmMocks.listAlgorithmIntelligenceEvents,
}))

import {
  createContentBuild,
  listContentBuildEvents,
  listContentBuildMetadataHistory,
  recordContentBuildMetadataChange,
  resetContentBuildRepositoryForTests,
  updateContentBuild,
} from "./asset-engine/ContentBuildRepository"
import {
  beginPublishTransaction,
  completePublishStep,
  completePublishTransaction,
  resetPublishTransactionRepositoryForTests,
} from "./asset-engine/PublishTransaction"
import { resetApprovedPublishSnapshotRepositoryForTests } from "./asset-engine/ApprovedPublishSnapshot"
import { recordAnalyticsCheckpointForEvaluation } from "./asset-engine/PostPublishAnalyticsBridge"
import { fetchAndRecordHistoricalMetadataComparison } from "./historicalMetadataIntelligence"
import { createMetadataLearningCandidate, summarizeMetadataIntelligence } from "./MetadataLearningGovernance"

const createTestStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, String(value)) },
    removeItem: (key: string) => { values.delete(key) },
    clear: () => values.clear(),
  }
}

const projection = () => ({
  schemaVersion: 1 as const,
  contentBuildId: "cb-golden",
  projectId: "project-golden",
  videoPackageId: "video-package-golden",
  revision: 7,
  titleAssetId: "title-v1",
  thumbnailAssetId: "thumbnail-v1",
  scriptAssetId: "script-v1",
  storyboardAssetId: "storyboard-v1",
  finalRenderAssetId: "render-v1",
  descriptionAssetId: "description-v1",
  tagsAssetId: "tags-v1",
  endScreenAssetId: null,
  outroAssetId: null,
  scheduledAt: null,
  publishedVideoId: null,
  approval: {
    status: "approved" as const,
    approvedBy: "creator-golden",
    approvedAt: "2026-10-07T12:00:00.000Z",
  },
  checks: [],
  blockers: [],
  ready: true,
  missing: [],
})

const analyticsRows = () => {
  const rows: Array<{
    day: string
    views: number
    estimatedMinutesWatched: number
    averageViewPercentage: number
    likes: number
    comments: number
    estimatedRevenue: number
  }> = []
  const day = new Date("2026-09-01T00:00:00.000Z")
  const end = new Date("2026-12-15T00:00:00.000Z")
  let index = 0
  while (day <= end) {
    rows.push({
      day: day.toISOString().slice(0, 10),
      views: 100 + index * 10,
      estimatedMinutesWatched: 500 + index * 20,
      averageViewPercentage: 35 + index / 10,
      likes: 10 + index,
      comments: 2 + index / 5,
      estimatedRevenue: 1 + index / 100,
    })
    day.setUTCDate(day.getUTCDate() + 1)
    index += 1
  }
  return rows
}

const recordMetadataVersion = (input: {
  versionId: string
  operationId: string
  occurredAt: string
  before: string | null
  after: string
  publishTransactionId: string
  approvedSnapshotId: string
  approvedSnapshotHash: string
}) => recordContentBuildMetadataChange({
  contentBuildId: "cb-golden",
  metadataVersionId: input.versionId,
  operationId: input.operationId,
  operation: input.before == null ? "publish" : "edit",
  actorType: "creator",
  sourceToolId: input.before == null ? "video-publisher" : "video-manager",
  publishedVideoId: "youtube-golden",
  publishTransactionId: input.publishTransactionId,
  approvedSnapshotId: input.approvedSnapshotId,
  approvedSnapshotHash: input.approvedSnapshotHash,
  fields: [{ field: "title", before: input.before, after: input.after }],
  sourceAssetIds: input.before == null ? ["title-v1"] : ["title-" + input.versionId + "-before"],
  resultingAssetIds: ["title-" + input.versionId + "-after"],
  evidenceIds: ["metadata-evidence-" + input.versionId],
  occurredAt: input.occurredAt,
})

describe("post-publication analytics and metadata intelligence golden path", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createTestStorage())
    resetContentBuildRepositoryForTests()
    resetApprovedPublishSnapshotRepositoryForTests()
    resetPublishTransactionRepositoryForTests()
    algorithmMocks.recordAlgorithmIntelligenceEvent.mockClear()
    algorithmMocks.recordAlgorithmEvaluation.mockReset()
    algorithmMocks.recordAlgorithmEvaluation.mockReturnValue({
      evaluation: { status: "positive" },
      recorded: { id: "measured-outcome-golden" },
    })
    createContentBuild({
      id: "cb-golden",
      channelId: "channel-golden",
      legacyProjectId: "project-golden",
      stage: "package",
    })
    // A previous golden-path run may leave this stable ID in jsdom's window storage.
    // Re-establish the canonical publishable fixture rather than trusting create-if-absent.
    updateContentBuild("cb-golden", current => ({
      ...current,
      stage: "package",
      workflow: { ...current.workflow, blockerIds: [] },
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("joins publication identity, measured analytics, metadata comparisons and review-only Brain learning", async () => {
    const transaction = beginPublishTransaction(projection())
    completePublishStep({
      transactionId: transaction.id,
      step: "upload-video",
      youtubeVideoId: "youtube-golden",
      youtubeBinding: { status: "published", publishedAt: "2026-10-08T12:00:00.000Z" },
    })
    completePublishStep({
      transactionId: transaction.id,
      step: "verify-remote-state",
      youtubeVideoId: "youtube-golden",
      youtubeBinding: {
        status: "published",
        publishedAt: "2026-10-08T12:00:00.000Z",
        lastVerifiedAt: "2026-10-08T12:05:00.000Z",
      },
    })
    expect(completePublishTransaction(transaction.id).status).toBe("completed")

    const checkpointInput = {
      transactionId: transaction.id,
      videoId: "youtube-golden",
      checkpointId: "day-7",
      checkpointAt: Date.parse("2026-10-17T12:00:00.000Z"),
      observations: [{
        metric: "views",
        value: 900,
        observedAt: Date.parse("2026-10-17T12:00:00.000Z"),
        evidenceId: "youtube-analytics-day-7",
      }],
      evaluationTargets: [{ metric: "views", direction: "increase" as const, baselineValue: 700 }],
      evidenceIds: ["youtube-analytics-day-7"],
      now: Date.parse("2026-10-17T12:05:00.000Z"),
    }
    const measured = recordAnalyticsCheckpointForEvaluation(checkpointInput)
    const replay = recordAnalyticsCheckpointForEvaluation(checkpointInput)

    expect(measured.identity).toMatchObject({
      contentBuildId: "cb-golden",
      projectId: "project-golden",
      videoId: "youtube-golden",
      approvedSnapshotId: transaction.approvedSnapshotId,
      approvedSnapshotHash: transaction.approvedSnapshotHash,
    })
    expect(measured.evaluation.status).toBe("positive")
    expect(measured.recorded.id).toBe("measured-outcome-golden")
    expect(replay.identity.event.id).toBe(measured.identity.event.id)
    expect(listContentBuildEvents("cb-golden").filter(event =>
      event.eventType === "analytics.checkpoint" &&
      (event.metadata as Record<string, unknown> | undefined)?.checkpointId === "day-7"
    )).toHaveLength(1)
    expect(algorithmMocks.recordAlgorithmEvaluation).toHaveBeenCalledTimes(2)

    const sharedLineage = {
      publishTransactionId: transaction.id,
      approvedSnapshotId: transaction.approvedSnapshotId,
      approvedSnapshotHash: transaction.approvedSnapshotHash,
    }
    recordMetadataVersion({
      versionId: "metadata-v1",
      operationId: "publish-metadata-v1",
      occurredAt: "2026-10-08T12:00:00.000Z",
      before: null,
      after: "Launch title A",
      ...sharedLineage,
    })
    recordMetadataVersion({
      versionId: "metadata-v2",
      operationId: "edit-title-v2",
      occurredAt: "2026-10-20T12:00:00.000Z",
      before: "Launch title A",
      after: "Launch title B",
      ...sharedLineage,
    })
    recordMetadataVersion({
      versionId: "metadata-v3",
      operationId: "edit-title-v3",
      occurredAt: "2026-11-01T12:00:00.000Z",
      before: "Launch title B",
      after: "Launch title C",
      ...sharedLineage,
    })
    expect(listContentBuildMetadataHistory("cb-golden")).toHaveLength(3)

    const rows = analyticsRows()
    const fetchReport = vi.fn().mockResolvedValue({
      columnHeaders: [
        { name: "day" },
        { name: "views" },
        { name: "estimatedMinutesWatched" },
        { name: "averageViewPercentage" },
        { name: "likes" },
        { name: "comments" },
        { name: "estimatedRevenue" },
      ],
      rows: rows.map(row => [
        row.day,
        row.views,
        row.estimatedMinutesWatched,
        row.averageViewPercentage,
        row.likes,
        row.comments,
        row.estimatedRevenue,
      ]),
    })
    const comparisons = []
    for (const metadataVersionId of ["metadata-v1", "metadata-v2", "metadata-v3"]) {
      comparisons.push(await fetchAndRecordHistoricalMetadataComparison({
        contentBuildId: "cb-golden",
        videoId: "youtube-golden",
        metadataVersionId,
        channelId: "channel-golden",
        now: new Date("2026-12-15T12:00:00.000Z"),
        fetchReport,
      }))
    }
    expect(comparisons.every(comparison => comparison.status === "ready")).toBe(true)
    expect(new Set(comparisons.map(comparison => comparison.metadataVersionId)).size).toBe(3)

    const candidate = createMetadataLearningCandidate({
      contentBuildId: "cb-golden",
      field: "title",
      metric: "views",
      direction: "increase",
      now: new Date("2026-12-15T12:10:00.000Z"),
    })
    expect(candidate.resultingState).toMatchObject({
      status: "pending-creator-review",
      independentComparisonCount: 3,
      causalConclusion: null,
    })

    const summary = summarizeMetadataIntelligence(listContentBuildEvents("cb-golden"))
    expect(summary).toMatchObject({
      metadataVersionCount: 3,
      comparisonCount: 3,
      readyComparisonCount: 3,
      learningCandidateCount: 1,
      promotedKnowledgeCount: 0,
      latestComparison: {
        status: "ready",
        interpretation: "descriptive-association-only",
        causalConclusion: null,
      },
    })
    expect(fetchReport).toHaveBeenCalledTimes(3)
  })

  it("rejects a checkpoint for a video other than the completed transaction's video", () => {
    const transaction = beginPublishTransaction(projection())
    completePublishStep({
      transactionId: transaction.id,
      step: "upload-video",
      youtubeVideoId: "youtube-golden",
      youtubeBinding: { status: "published" },
    })
    completePublishStep({
      transactionId: transaction.id,
      step: "verify-remote-state",
      youtubeVideoId: "youtube-golden",
      youtubeBinding: { status: "published" },
    })
    completePublishTransaction(transaction.id)

    expect(() => recordAnalyticsCheckpointForEvaluation({
      transactionId: transaction.id,
      videoId: "youtube-other",
      checkpointId: "day-7",
      checkpointAt: Date.parse("2026-10-17T12:00:00.000Z"),
      observations: [{ metric: "views", value: 900, observedAt: Date.parse("2026-10-17T12:00:00.000Z") }],
      evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 700 }],
    })).toThrow(/does not match/)
    expect(listContentBuildEvents("cb-golden").some(event => event.eventType === "analytics.checkpoint" && event.metadata?.videoId === "youtube-other")).toBe(false)
  })
})
