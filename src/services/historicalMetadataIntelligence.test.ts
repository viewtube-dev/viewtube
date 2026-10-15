// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import {
  appendContentBuildEvent,
  createContentBuild,
  recordContentBuildMetadataChange,
  resetContentBuildRepositoryForTests,
} from "./asset-engine/ContentBuildRepository"
import {
  buildHistoricalMetadataComparison,
  resolveHistoricalMetadataContext,
} from "./historicalMetadataIntelligence"

const metadataVersion = (occurredAt = "2026-10-08T12:00:00.000Z") => ({
  schemaVersion: 1 as const,
  contentBuildId: "cb-history",
  metadataVersionId: "metadata-v2",
  operationId: "operation-edit-title",
  operation: "edit" as const,
  fields: [{ field: "title", before: "Old title", after: "New title" }],
  actorType: "creator" as const,
  actorId: "creator-1",
  sourceToolId: "video-manager",
  generationRecordId: null,
  promptRecipeId: null,
  promptRecipeVersion: null,
  sourceAssetIds: ["title-v1"],
  resultingAssetIds: ["title-v2"],
  publishTransactionId: "publish-tx-1",
  approvedSnapshotId: "snapshot-1",
  approvedSnapshotHash: "snapshot-hash-1",
  publishedVideoId: "video-1",
  analyticsCheckpointIds: ["checkpoint-7d"],
  evidenceIds: ["metadata-edit-evidence"],
  occurredAt,
})

const dailyRows = (start: string, count: number, startViews = 100) => {
  const first = new Date(`${start}T00:00:00.000Z`)
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(first)
    day.setUTCDate(day.getUTCDate() + index)
    return {
      day: day.toISOString().slice(0, 10),
      views: startViews + index * 10,
      estimatedMinutesWatched: 500 + index * 20,
      averageViewPercentage: 40 + index,
      likes: 10 + index,
      comments: 2 + index,
      estimatedRevenue: 1 + index * 0.1,
    }
  })
}

describe("historical metadata intelligence", () => {
  beforeEach(() => {
    localStorage.clear()
    resetContentBuildRepositoryForTests()
  })

  it("compares a field change to observed pre/post metrics without asserting causality", () => {
    const version = metadataVersion()
    const result = buildHistoricalMetadataComparison({
      contentBuildId: "cb-history",
      videoId: "video-1",
      metadataVersion: version,
      rows: [...dailyRows("2026-10-01", 7, 100), ...dailyRows("2026-10-09", 7, 200)],
      now: new Date("2026-10-17T12:00:00.000Z"),
    })

    expect(result).toMatchObject({
      status: "ready",
      metadataVersionId: "metadata-v2",
      fieldChanges: [{ field: "title", before: "Old title", after: "New title" }],
      interpretation: "descriptive-association-only",
      causalConclusion: null,
    })
    expect(result.metrics.find(metric => metric.metric === "views")).toMatchObject({
      baselineAverage: 130,
      followUpAverage: 230,
      absoluteChange: 100,
    })
    expect(result.evidenceIds).toContain("metadata-edit-evidence")
    expect(result.confounders.length).toBeGreaterThan(0)
  })

  it("keeps incomplete windows and missing metrics explicit instead of treating them as zero", () => {
    const rows = dailyRows("2026-10-01", 7, 100)
    rows.push(
      { day: "2026-10-09", views: 220, estimatedMinutesWatched: 500, averageViewPercentage: 45, likes: 12, comments: 3, estimatedRevenue: 1 },
      { day: "2026-10-10", views: 240, estimatedMinutesWatched: 520, averageViewPercentage: 46, likes: 13, comments: 4, estimatedRevenue: 1.2 },
    )
    const result = buildHistoricalMetadataComparison({
      contentBuildId: "cb-history",
      videoId: "video-1",
      metadataVersion: metadataVersion(),
      rows,
      now: new Date("2026-10-12T12:00:00.000Z"),
    })

    expect(result.status).toBe("partial")
    expect(result.metrics.find(metric => metric.metric === "views")?.followUpDaysObserved).toBe(2)
    expect(result.metrics.find(metric => metric.metric === "views")?.followUpAverage).toBe(230)
    expect(result.causalConclusion).toBeNull()
  })

  it("resolves history and analytics only through canonical ContentBuild event IDs", () => {
    createContentBuild({ id: "cb-history", channelId: "channel-1", legacyProjectId: "project-1" })
    recordContentBuildMetadataChange({
      contentBuildId: "cb-history",
      metadataVersionId: "metadata-v2",
      operationId: "operation-edit-title",
      operation: "edit",
      fields: [{ field: "title", before: "Old title", after: "New title" }],
      publishedVideoId: "video-1",
      analyticsCheckpointIds: ["checkpoint-7d"],
      evidenceIds: ["metadata-edit-evidence"],
      occurredAt: "2026-10-08T12:00:00.000Z",
    })
    appendContentBuildEvent({
      contentBuildId: "cb-history",
      eventType: "analytics.checkpoint",
      entityType: "analytics-checkpoint",
      entityId: "checkpoint-7d",
      actorType: "analytics",
      timestamp: "2026-10-10T12:00:00.000Z",
      evidenceIds: ["analytics-evidence-1"],
      metadata: { videoId: "video-1", checkpointId: "checkpoint-7d" },
    })

    const context = resolveHistoricalMetadataContext({
      contentBuildId: "cb-history",
      videoId: "video-1",
      changeAt: Date.parse("2026-10-08T12:00:00.000Z"),
    })

    expect(context.relevantMetadataVersionIds).toEqual(["metadata-v2"])
    expect(context.analyticsCheckpointEvents).toHaveLength(1)
    expect(context.evidenceIds).toEqual(expect.arrayContaining(["metadata-edit-evidence", "analytics-evidence-1"]))
  })
})
