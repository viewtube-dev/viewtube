import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CanonicalIntelligenceDatasetRows } from "../../analytics-canon/contracts"
import type { DeterministicAnalyticsInsight } from "../DeterministicAnalyticsInsights"

const getCurrentRows = vi.hoisted(() => vi.fn())
const buildTrendInsights = vi.hoisted(() => vi.fn())

vi.mock("../../analytics-canon", () => ({
 getCurrentCanonicalIntelligenceDatasetRows: getCurrentRows,
}))

vi.mock("../DeterministicAnalyticsInsights", () => ({
 buildTrendInsights,
}))

import { buildCurrentCanonicalAnalyticsInsights } from "../CurrentCanonicalAnalyticsInsights"

const dataset = (overrides: Partial<CanonicalIntelligenceDatasetRows> = {}): CanonicalIntelligenceDatasetRows => ({
 datasetId: "daily",
 label: "Daily analytics",
 status: "available",
 snapshotId: "snapshot-1",
 channelId: "channel-1",
 sources: ["youtube_analytics_v2"],
 missingMetrics: [],
 rows: [{ date: "2026-10-01", views: 10 }],
 ...overrides,
})

describe("current canonical analytics insights", () => {
 beforeEach(() => {
  getCurrentRows.mockReset()
  buildTrendInsights.mockReset()
  buildTrendInsights.mockReturnValue({ insights: [], limitations: [] })
 })

 it("fails closed when the canonical daily dataset is unavailable", () => {
  getCurrentRows.mockReturnValue({ snapshotId: "snapshot-1", channelId: "channel-1", dataset: null })

  const result = buildCurrentCanonicalAnalyticsInsights({ channelId: "channel-1" })

  expect(result.findings).toEqual([])
  expect(result.limitations).toContain("Canonical daily dataset is unavailable.")
  expect(buildTrendInsights).not.toHaveBeenCalled()
 })

 it("does not join a dataset from another channel", () => {
  getCurrentRows.mockReturnValue({
   snapshotId: "snapshot-1",
   channelId: "channel-2",
   dataset: dataset({ channelId: "channel-2" }),
  })

  const result = buildCurrentCanonicalAnalyticsInsights({ channelId: "channel-1" })

  expect(result.findings).toEqual([])
  expect(result.limitations[0]).toContain("channel does not exactly match")
  expect(buildTrendInsights).not.toHaveBeenCalled()
 })

 it("rejects a dataset whose snapshot differs from its enclosing canonical snapshot", () => {
  getCurrentRows.mockReturnValue({
   snapshotId: "snapshot-1",
   channelId: "channel-1",
   dataset: dataset({ snapshotId: "snapshot-stale" }),
  })

  const result = buildCurrentCanonicalAnalyticsInsights({ channelId: "channel-1" })

  expect(result.findings).toEqual([])
  expect(result.limitations[0]).toContain("does not match its enclosing evidence snapshot")
  expect(buildTrendInsights).not.toHaveBeenCalled()
 })

 it("rejects a canonical snapshot that differs from the requested evidence snapshot", () => {
  getCurrentRows.mockReturnValue({
   snapshotId: "snapshot-1",
   channelId: "channel-1",
   dataset: dataset(),
  })

  const result = buildCurrentCanonicalAnalyticsInsights({
   channelId: "channel-1",
   expectedSnapshotId: "snapshot-expected",
  })

  expect(result.findings).toEqual([])
  expect(result.limitations[0]).toContain("does not match the active evidence snapshot")
  expect(buildTrendInsights).not.toHaveBeenCalled()
 })

 it("evaluates only metrics actually present in the canonical daily rows", () => {
  const insight = { id: "analytics-insight-1" } as DeterministicAnalyticsInsight
  getCurrentRows.mockReturnValue({
   snapshotId: "snapshot-1",
   channelId: "channel-1",
   dataset: dataset(),
  })
  buildTrendInsights.mockReturnValue({ insights: [insight], limitations: [] })

  const result = buildCurrentCanonicalAnalyticsInsights({ channelId: "channel-1" })

  expect(buildTrendInsights).toHaveBeenCalledTimes(1)
  expect(buildTrendInsights).toHaveBeenCalledWith(expect.objectContaining({
   dataset: expect.objectContaining({ datasetId: "daily", snapshotId: "snapshot-1" }),
   metricKey: "views",
   dateKey: "date",
  }))
  expect(result.findings).toEqual([insight])
  expect(result.sourceSnapshotId).toBe("snapshot-1")
 })
})
