import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainEvidenceExplorerPanel,
 filterEvidenceExplorerDatasets,
 filterEvidenceExplorerRecords,
 formatEvidenceExplorerValue,
} from "./BrainEvidenceExplorerPanel"
import type { EvidenceRecord } from "../../services/brain/EvidenceRecord"

const dataset = (overrides: Record<string, unknown> = {}) => ({
 id: "videos",
 label: "Videos",
 description: "Video performance data",
 categoryIds: ["content"],
 status: "available",
 rowCount: 3,
 updatedAt: "2026-10-30T12:00:00.000Z",
 sources: ["youtube_analytics_v2"],
 missingMetrics: [],
 columns: [],
 evidenceRefs: ["source-1"],
 metrics: {},
 sampleRows: [],
 ...overrides,
}) as any

const record = (overrides: Partial<EvidenceRecord> = {}): EvidenceRecord => ({
 id: "analytics:snapshot-1:videos:views",
 owner: "analytics-canon",
 sourceRef: "videos",
 datasetId: "videos",
 channelId: "channel-1",
 metric: "views",
 value: 125,
 unit: "count",
 freshness: "fresh",
 epistemicState: "OBSERVED",
 provenance: { evidenceIds: ["source-1"], sourceRoute: "/analytics" },
 ...overrides,
})

describe("Brain Evidence Explorer filters", () => {
 it("filters dataset cards by canonical status without collapsing unavailable and failed", () => {
  const results = filterEvidenceExplorerDatasets([
   dataset({ status: "available" }),
   dataset({ id: "comments", label: "Comments", status: "failed" }),
   dataset({ id: "revenue", label: "Revenue", status: "unavailable" }),
  ], "", "unavailable")
  expect(results.map((item) => item.id)).toEqual(["revenue"])
 })

 it("matches dataset labels, missing metrics and source names", () => {
  const results = filterEvidenceExplorerDatasets([
   dataset({ missingMetrics: ["impressions"], sources: ["youtube_analytics_v2"] }),
  ], "impressions")
  expect(results).toHaveLength(1)
 })

 it("filters evidence records by exact dataset identity and source fields", () => {
  const results = filterEvidenceExplorerRecords([
   record(),
   record({ id: "analytics:snapshot-1:comments:likes", datasetId: "comments", metric: "likes" }),
  ], "views", "videos")
  expect(results.map((item) => item.id)).toEqual(["analytics:snapshot-1:videos:views"])
 })

 it("renders missing values as unknown rather than numeric zero", () => {
  expect(formatEvidenceExplorerValue(record({ value: null, epistemicState: "MISSING" }))).toBe("Unknown")
  expect(formatEvidenceExplorerValue(record({ value: 0, epistemicState: "MISSING" }))).toBe("Unknown")
  expect(formatEvidenceExplorerValue(record({ value: 0 }))).toBe("0")
 })
})


describe("BrainEvidenceExplorerPanel", () => {
 it("requires a verified channel id before reading canonical evidence", () => {
  const html = renderToStaticMarkup(React.createElement(BrainEvidenceExplorerPanel, { channelId: null }))
  expect(html).toContain("Connect a channel to inspect evidence")
  expect(html).toContain("A verified channel ID is required")
 })
})
