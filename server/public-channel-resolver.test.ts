import { Readable } from "node:stream"
import { afterEach, describe, expect, it } from "vitest"
import {
  handlePublicChannelResolveRoute,
  normalizePublicChannelInput,
  resetPublicChannelResolverForTests,
} from "./public-channel-resolver.mjs"

const request = (body, remoteAddress = "127.0.0.1") => {
  const req = Readable.from([JSON.stringify(body)])
  req.method = "POST"
  req.headers = {}
  req.socket = { remoteAddress }
  return req
}

const response = () => ({
  statusCode: 200,
  headers: {},
  body: "",
  writeHead(status, headers) { this.statusCode = status; this.headers = headers },
  end(body) { this.body = body },
  json() { return JSON.parse(this.body) },
})

afterEach(resetPublicChannelResolverForTests)

describe("public channel resolver", () => {
  it("accepts handles, channel IDs and supported YouTube channel URLs only", () => {
    expect(normalizePublicChannelInput("@HistoryLab")).toEqual({ kind: "handle", value: "HistoryLab" })
    expect(normalizePublicChannelInput("https://youtube.com/@HistoryLab/videos")).toEqual({ kind: "handle", value: "HistoryLab" })
    expect(normalizePublicChannelInput("https://youtube.com/channel/UC1234567890123456789012")).toEqual({ kind: "channelId", value: "UC1234567890123456789012" })
    expect(normalizePublicChannelInput("https://youtu.be/abcdefghijk")).toBeNull()
    expect(normalizePublicChannelInput("https://example.com/@HistoryLab")).toBeNull()
  })

  it("fails closed when the server has no configured public API key", async () => {
    const res = response()
    await handlePublicChannelResolveRoute(request({ input: "@HistoryLab" }), res, { apiKey: "" })
    expect(res.statusCode).toBe(503)
    expect(res.json().code).toBe("PUBLIC_LOOKUP_UNAVAILABLE")
  })

  it("returns public channel data with explicit nulls and public provenance", async () => {
    const fetchImpl = async (url) => {
      const parsed = new URL(url)
      let payload
      if (parsed.pathname.endsWith("/channels")) {
        payload = { items: [{ id: "UC1234567890123456789012", snippet: { title: "History Lab", customUrl: "@HistoryLab" }, statistics: { videoCount: "12" } }] }
      } else if (parsed.pathname.endsWith("/search")) {
        payload = { items: [{ id: { videoId: "video123" }, snippet: { title: "Public video", publishedAt: "2026-01-01T00:00:00Z" } }] }
      } else {
        payload = { items: [{ id: "video123", statistics: { viewCount: "42" } }] }
      }
      return { ok: true, status: 200, json: async () => payload }
    }
    const res = response()
    await handlePublicChannelResolveRoute(request({ input: "@HistoryLab" }), res, { apiKey: "server-test-key", fetchImpl })
    expect(res.statusCode).toBe(200)
    const result = res.json()
    expect(result.channelId).toBe("UC1234567890123456789012")
    expect(result.subscriberCount).toBeNull()
    expect(result.viewCount).toBeNull()
    expect(result.topVideos[0]).toMatchObject({ videoId: "video123", viewCount: 42, likeCount: null, commentCount: null })
    expect(result.provenance).toEqual({ source: "youtube_data_api_public", evidenceMode: "public_handle", privateMetricsIncluded: false })
  })

  it("rejects invalid JSON and oversized request bodies", async () => {
    const invalid = Readable.from(["{not json"])
    invalid.method = "POST"; invalid.headers = {}; invalid.socket = { remoteAddress: "invalid-json" }
    const invalidRes = response()
    await handlePublicChannelResolveRoute(invalid, invalidRes, { apiKey: "server-test-key" })
    expect(invalidRes.statusCode).toBe(400)

    const large = Readable.from([JSON.stringify({ input: "x".repeat(5000) })])
    large.method = "POST"; large.headers = {}; large.socket = { remoteAddress: "large-body" }
    const largeRes = response()
    await handlePublicChannelResolveRoute(large, largeRes, { apiKey: "server-test-key" })
    expect(largeRes.statusCode).toBe(413)
  })
})
