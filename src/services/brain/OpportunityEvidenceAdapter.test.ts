import { describe, expect, it } from "vitest"
import type { AIBrainEvidencePack } from "../../types"
import { buildOpportunityEvidenceFromBrainPack, buildOpportunityEvidenceFromCanonicalBundle } from "./OpportunityEvidenceAdapter"

const pack = (): AIBrainEvidencePack => ({
 promptVersion: "brain-chat-v2",
 intent: "strategy",
 channelId: "channel-a",
 channelName: "History Workshop",
 channelDescription: null,
 capturedAt: "2026-09-25T12:00:00.000Z",
 dataStatus: "ready",
 topVideos: [
  {
   id: "video-top",
   evidenceId: "ev-top",
   title: "Cavalry Explained",
   publishedAt: "2026-09-01T12:00:00.000Z",
   format: "long",
   descriptionSnippet: null,
   tags: ["cavalry"],
   metrics: { views: 1000, watchTime: 100, subscribers: 20, revenue: null, ctr: 6, averagePercentageViewed: 55, likes: 40, comments: 8 },
  },
 ],
 recentVideos: [
  {
   id: "video-recent",
   evidenceId: "ev-recent",
   title: "Artillery Explained",
   publishedAt: "2026-09-20T12:00:00.000Z",
   format: "long",
   descriptionSnippet: null,
   tags: ["artillery"],
   metrics: { views: 500, watchTime: null, subscribers: null, revenue: null, ctr: null, averagePercentageViewed: null, likes: null, comments: null },
  },
 ],
 searchTerms: [],
 trafficSources: [],
 items: [],
 availableMetrics: ["views", "watchTime", "subscribers", "ctr", "averagePercentageViewed"],
 missingInputs: [],
 evidenceIds: ["ev-top", "ev-recent"],
 transcriptRouteRequired: false,
})

describe("OpportunityEvidenceAdapter", () => {
 it("derives bounded channel-scoped opportunities from canonical Brain evidence", () => {
  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack: pack(),
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject({
   channelId: "channel-a",
   kind: "catalog_gap",
   evidenceIds: ["ev-top"],
  })
  expect(result.every((item) => item.confidence >= 0 && item.confidence <= 100)).toBe(true)
  expect(result.every((item) => item.impactScore >= 0 && item.impactScore <= 100)).toBe(true)
 })

 it("deduplicates videos present in both top and recent evidence", () => {
  const evidencePack = pack()
  evidencePack.recentVideos.push(evidencePack.topVideos[0])

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result.filter((item) => item.videoId === "video-top")).toHaveLength(1)
 })

 it("preserves missing views as unknown when other metrics exist", () => {
  const evidencePack = pack()
  evidencePack.recentVideos[0].metrics = {
   views: null,
   watchTime: 20,
   subscribers: 3,
   revenue: null,
   ctr: 5,
   averagePercentageViewed: 50,
   likes: null,
   comments: null,
  }

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })
  const recent = result.find((item) => item.videoId === "video-recent")

  expect(recent).toMatchObject({
   currentValue: null,
   confidence: 80,
   evidenceIds: ["ev-recent"],
  })
 })

 it("does not derive a metric-backed opportunity when every metric is missing", () => {
  const evidencePack = pack()
  evidencePack.recentVideos[0].metrics = {
   views: null,
   watchTime: null,
   subscribers: null,
   revenue: null,
   ctr: null,
   averagePercentageViewed: null,
   likes: null,
   comments: null,
  }

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result.some((item) => item.videoId === "video-recent")).toBe(false)
 })

 it("refuses cross-channel evidence instead of relabeling it", () => {
  const evidencePack = pack()
  evidencePack.channelId = "channel-b"

  expect(buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
  })).toEqual([])
 })

 it("returns no invented opportunity when evidence is missing", () => {
  const evidencePack = pack()
  evidencePack.dataStatus = "missing"
  evidencePack.topVideos = []
  evidencePack.recentVideos = []

  expect(buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
  })).toEqual([])
 })
})


describe("buildOpportunityEvidenceFromCanonicalBundle", () => {
 const makeBundle = (overrides: Record<string, unknown> = {}) => ({
  version: "vt-intelligence-evidence-v1",
  snapshotId: "snapshot-canonical-1",
  channelId: "channel-1",
  channelName: "Test channel",
  capturedAt: "2026-10-15T00:00:00.000Z",
  generatedAt: "2026-10-15T00:00:00.000Z",
  selectedWindow: "90d",
  coverage: { total: 1, available: 1, partial: 0, stale: 0, failed: 0, unavailable: 0, represented: 1 },
  requestedSectionIds: ["strategy-engine"],
  omittedDatasetIds: [],
  contextText: "",
  datasets: [{
   id: "videos",
   label: "Video Catalog Analytics",
   description: "",
   categoryIds: ["videos"],
   status: "available",
   rowCount: 2,
   sources: ["youtube_analytics_v2"],
   missingMetrics: [],
   updatedAt: "2026-10-15T00:00:00.000Z",
   columns: [],
   metrics: {},
   evidenceRefs: ["snapshot-canonical-1:videos:1", "snapshot-canonical-1:videos:2"],
   sampleRows: [
    { videoId: "video-1", title: "Measured video", views: 240, watchTime: 12, publishedAt: "2026-09-01" },
    { videoId: "video-2", title: "Partial video", views: null, watchTime: 4, publishedAt: null },
   ],
  }],
  ...overrides,
 } as any)

 it("projects only canonical video rows and preserves row provenance, window and missing metrics", () => {
  const result = buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeBundle(),
   now: new Date("2026-10-15T00:00:00.000Z"),
  })

  expect(result).toHaveLength(2)
  expect(result[0].evidenceIds).toEqual(["snapshot-canonical-1:videos:1"])
  expect(result[0].currentValue).toBe(240)
  expect(result[0].context).toMatchObject({
   window: "90d",
   sourceSnapshotId: "snapshot-canonical-1",
   datasetId: "videos",
  })
  expect(result.find((item) => item.videoId === "video-2")?.currentValue).toBeNull()
 })

 it("fails closed when the canonical bundle belongs to another channel", () => {
  expect(buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeBundle({ channelId: "channel-2" }),
  })).toEqual([])
 })

 it("does not produce metric opportunities from failed or unavailable video datasets", () => {
  for (const status of ["failed", "unavailable"]) {
   const bundle = makeBundle({
    datasets: [{ ...makeBundle().datasets[0], status }],
   })
   expect(buildOpportunityEvidenceFromCanonicalBundle({ channelId: "channel-1", bundle })).toEqual([])
  }
 })
})
