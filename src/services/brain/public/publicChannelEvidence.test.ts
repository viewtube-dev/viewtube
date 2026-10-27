import { describe, expect, it } from "vitest"
import { isEvidenceRecord } from "../EvidenceRecord"
import type { PublicChannelSnapshot } from "../../publicHandleMode"
import { buildPublicChannelEvidenceRecords } from "./publicChannelEvidence"

const snapshot: PublicChannelSnapshot = {
  mode: "public_handle",
  fetchedAt: "2026-10-27T12:00:00.000Z",
  channelId: "UC1234567890123456789012",
  handle: "@HistoryLab",
  title: "History Lab",
  subscriberCount: null,
  videoCount: 12,
  viewCount: 3400,
  topVideos: [{
    videoId: "abc123",
    title: "A public video",
    publishedAt: "2026-10-20T12:00:00.000Z",
    viewCount: 900,
    likeCount: null,
    commentCount: 4,
  }],
}

describe("buildPublicChannelEvidenceRecords", () => {
  it("uses the canonical evidence record contract and public provenance", () => {
    const records = buildPublicChannelEvidenceRecords(snapshot)
    expect(records.length).toBe(9)
    expect(records.every(isEvidenceRecord)).toBe(true)
    expect(records.every((record) => record.owner === "research")).toBe(true)
    expect(records.every((record) => record.provenance.sourceRoute === "/api/public-channel/resolve")).toBe(true)
    expect(records.every((record) => record.limitations?.some((item) => item.includes("not private YouTube Analytics")))).toBe(true)
  })

  it("preserves unknown public counts as missing instead of inventing values", () => {
    const records = buildPublicChannelEvidenceRecords(snapshot)
    const subscribers = records.find((record) => record.metric === "subscriber_count")
    const likes = records.find((record) => record.metric === "video_like_count")
    expect(subscribers).toMatchObject({ value: null, epistemicState: "MISSING", freshness: "fresh" })
    expect(subscribers?.missingness).toContain("not_returned_by_public_source")
    expect(likes).toMatchObject({ value: null, epistemicState: "MISSING" })
  })

  it("keeps each video metric linked to its public video reference", () => {
    const records = buildPublicChannelEvidenceRecords(snapshot).filter((record) => record.videoId === "abc123")
    expect(records).toHaveLength(5)
    expect(records.every((record) => record.sourceRef === "https://www.youtube.com/watch?v=abc123")).toBe(true)
    expect(records.every((record) => record.channelId === snapshot.channelId)).toBe(true)
  })
  it("clearly marks fixture records as synthetic rather than live analytics", () => {
    const fixtureSnapshot: PublicChannelSnapshot = {
      ...snapshot,
      channelId: "UC_FIXTURE_THEMOTIONVIS",
      provenance: { source: "fixture", evidenceMode: "public_handle", privateMetricsIncluded: false },
    }
    const records = buildPublicChannelEvidenceRecords(fixtureSnapshot)
    expect(records.every((record) => record.provenance.sourceRoute === "local://public-handle-fixtures")).toBe(true)
    expect(records.every((record) => record.limitations?.some((item) => item.includes("SYNTHETIC FIXTURE DATA")))).toBe(true)
  })

})
