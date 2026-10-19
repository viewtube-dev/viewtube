import { describe, expect, it } from "vitest"
import { normalizeVtSyncSnapshot } from "../../features/vt-sync-local/adapters/snapshot"
import { buildAIBrainEvidencePack, parseEvidenceRequestSpec } from "../aiBrainCommandInterface"

describe("buildAIBrainEvidencePack", () => {
 it("projects canonical evidence into the Brain Hub display contract", () => {
  const snapshot = normalizeVtSyncSnapshot({
   source: "vt_sync",
   channelId: "channel-1",
   channelName: "Example channel",
   channelDescription: "A channel about practical craft.",
   videos: [{
    id: "video-1",
    title: "A practical example",
    publishedAt: "2026-09-20",
    metrics: { views: 1200 },
   }],
   searchTerms: [{ term: "practical craft", views: 120 }],
   trafficSources: [{ source: "External", views: 90 }],
   syncManifest: { stop_reason: "completed" },
  })

  const pack = buildAIBrainEvidencePack("Give me a strategy read", snapshot)

  expect(pack.items.map((item) => item.id)).toEqual(expect.arrayContaining([
   "video:video-1",
   "search:practical-craft",
  ]))
  expect(pack.items.every((item) => item.label && item.source)).toBe(true)
  expect(pack.requestSpec.selectionMode).toBe("both")
  expect(pack.trafficSources).toEqual([])
 })
 it("parses requested count, format, date range, and ranking metric", () => {
  const spec = parseEvidenceRequestSpec(
   "Show me the top 10 long-form videos from the past year ranked by views",
   new Date("2026-10-19T12:00:00.000Z"),
  )

  expect(spec).toMatchObject({
   count: 10,
   formats: ["long"],
   since: "2025-10-19",
   until: "2026-10-19",
   rankBy: "views",
   selectionMode: "top",
  })
 })

 it("selects only matching videos and reports when the requested cohort is short", () => {
  const snapshot = normalizeVtSyncSnapshot({
   source: "vt_sync",
   channelId: "channel-cohort",
   channelName: "Example channel",
   channelDescription: "A channel about practical craft.",
   capturedAt: "2026-10-19T12:00:00.000Z",
   videos: [
    { id: "long-low", title: "Long low views", format: "long", publishedAt: "2026-07-01", metrics: { views: 100 } },
    { id: "short-high", title: "Short high views", format: "short", publishedAt: "2026-08-01", metrics: { views: 900 } },
    { id: "long-high", title: "Long high views", format: "long", publishedAt: "2026-02-01", metrics: { views: 500 } },
    { id: "long-old", title: "Old long video", format: "long", publishedAt: "2024-02-01", metrics: { views: 1000 } },
   ],
   syncManifest: { stop_reason: "completed" },
  })

  const pack = buildAIBrainEvidencePack(
   "Show me the top 10 long-form videos from the past year ranked by views",
   snapshot,
  )

  expect(pack.topVideos.map((video) => video.id)).toEqual(["long-high", "long-low"])
  expect(pack.recentVideos).toEqual([])
  expect(pack.evidenceIds).toEqual(expect.arrayContaining(["video:long-high", "video:long-low"]))
  expect(pack.missingInputs).toContain("Requested 10 matching videos; found 2")
 })

 it("filters a requested topic and ranks by watch time", () => {
  const snapshot = normalizeVtSyncSnapshot({
   source: "vt_sync",
   channelId: "channel-topic",
   channelName: "Example channel",
   videos: [
    { id: "artillery", title: "Artillery explained", format: "long", publishedAt: "2026-08-01", metrics: { views: 100, watchTime: 900 } },
    { id: "cavalry", title: "Cavalry explained", format: "long", publishedAt: "2026-08-01", metrics: { views: 500, watchTime: 300 } },
    { id: "artillery-2", title: "Artillery tactics", format: "long", publishedAt: "2026-07-01", metrics: { views: 80, watchTime: 1200 } },
   ],
   syncManifest: { stop_reason: "completed" },
  })

  const pack = buildAIBrainEvidencePack("Top 5 long-form videos about artillery by watch time", snapshot)

  expect(pack.topVideos.map((video) => video.id)).toEqual(["artillery-2", "artillery"])
  expect(pack.requestSpec.filters).toEqual(["artillery"])
  expect(pack.requestSpec.rankBy).toBe("watchTime")
 })

})
