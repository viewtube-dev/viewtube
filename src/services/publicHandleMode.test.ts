import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchPublicChannelSnapshot, resolvePublicChannel } from "./publicHandleMode"

const storage = new Map<string, string>()
const mockStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

const jsonResponse = (payload: unknown) => ({
  ok: true,
  json: async () => payload,
}) as Response

describe("public channel mode public ingestion and fixtures", () => {
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal("localStorage", mockStorage)
    vi.stubEnv("DEV", false)
    vi.stubEnv("VITE_PUBLIC_HANDLE_FIXTURES", "")
    vi.stubEnv("VITE_YOUTUBE_API_KEY", "")
  })
  afterEach(() => {
    storage.clear()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("resolves allowlisted fixture aliases without login or API key", async () => {
    storage.set("vt_public_handle_fixtures", "1")
    const resolved = await resolvePublicChannel("@THEMOTIONVIS")
    expect(resolved).toMatchObject({
      resolvedChannelId: "UC_FIXTURE_THEMOTIONVIS",
      resolvedHandle: "@themotionvis",
      channelTitle: "The Motion Vis (fixture)",
    })
    expect(resolved.reason).toContain("Fixture data only")
    const snapshot = await fetchPublicChannelSnapshot("themotionvis")
    expect(snapshot?.source).toBe("fixture")
    expect(snapshot?.channelId).toBe("UC_FIXTURE_THEMOTIONVIS")
  })

  it("gives a clear error for unknown handles when fixture mode is enabled", async () => {
    storage.set("vt_public_handle_fixtures", "1")
    const resolved = await resolvePublicChannel("@unknown_channel")
    expect(resolved.resolvedChannelId).toBeNull()
    expect(resolved.reason).toMatch(/no fixture|Public channel ingestion/i)
    expect(await fetchPublicChannelSnapshot("@unknown_channel")).toBeNull()
  })


  it("resolves and snapshots a public handle without login or a YouTube Data API key", async () => {
    const snapshot = {
      mode: "public_handle",
      source: "public_page",
      fetchedAt: "2026-10-27T12:00:00.000Z",
      channelId: "UC1234567890123456789012",
      handle: "@public_creator",
      title: "Public Creator",
      subscriberCount: null,
      videoCount: null,
      viewCount: null,
      topVideos: [{ videoId: "abc123", title: "Latest upload", publishedAt: "2026-10-26T12:00:00.000Z", viewCount: null, likeCount: null, commentCount: null }],
    }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      resolution: { resolvedChannelId: snapshot.channelId, resolvedHandle: snapshot.handle, channelTitle: snapshot.title, reason: null },
      snapshot,
    }))
    vi.stubGlobal("fetch", fetchMock)

    const resolved = await resolvePublicChannel("@public_creator")
    expect(resolved).toMatchObject({
      resolvedChannelId: snapshot.channelId,
      resolvedHandle: snapshot.handle,
      channelTitle: snapshot.title,
      reason: null,
    })
    const ingested = await fetchPublicChannelSnapshot("@public_creator")
    expect(ingested).toMatchObject({ source: "public_page", channelId: snapshot.channelId, topVideos: snapshot.topVideos })
    expect(fetchMock).toHaveBeenCalledWith("/public-channel/resolve?handle=%40public_creator", { headers: { Accept: "application/json" } })
  })

  it("uses the server-side public resolver even when a legacy browser API key exists", async () => {
    storage.set("yt_public_api_key", "test-real-key")
    const payload = {
      resolution: { resolvedChannelId: "UC1234567890123456789012", resolvedHandle: "@themotionvis", channelTitle: "Public channel", reason: null },
      snapshot: {
        mode: "public_handle",
        source: "public_page",
        fetchedAt: "2026-10-27T12:00:00.000Z",
        channelId: "UC1234567890123456789012",
        handle: "@themotionvis",
        title: "Public channel",
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos: [],
      },
    }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal("fetch", fetchMock)

    const resolved = await resolvePublicChannel("@themotionvis")
    const snapshot = await fetchPublicChannelSnapshot("@themotionvis")

    expect(resolved).toMatchObject({ resolvedChannelId: payload.snapshot.channelId, channelTitle: "Public channel", reason: null })
    expect(snapshot).toMatchObject({ source: "public_page", channelId: payload.snapshot.channelId })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls.every(([url]) => String(url).includes("/public-channel/resolve"))).toBe(true)
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes("googleapis.com"))).toBe(false)
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes("test-real-key"))).toBe(false)
  })

  it("does not accept fixture channel IDs returned by the live resolver as real channels", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      resolution: { resolvedChannelId: "UC_FIXTURE_THEMOTIONVIS", resolvedHandle: "@fake", channelTitle: "Fixture", reason: null },
      snapshot: { channelId: "UC_FIXTURE_THEMOTIONVIS" },
    }))
    vi.stubGlobal("fetch", fetchMock)

    const resolved = await resolvePublicChannel("@not-a-real-channel")

    expect(resolved.resolvedChannelId).toBeNull()
    expect(resolved.reason).toContain("Public channel ingestion is unavailable")
  })

  it("rejects resolver payloads whose resolution and snapshot belong to different channels", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      resolution: { resolvedChannelId: "UC1234567890123456789012", resolvedHandle: "@creator_a", channelTitle: "Creator A", reason: null },
      snapshot: {
        mode: "public_handle",
        source: "public_page",
        fetchedAt: "2026-10-27T12:00:00.000Z",
        channelId: "UC9876543210987654321098",
        handle: "@creator_b",
        title: "Creator B",
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos: [],
      },
    }))
    vi.stubGlobal("fetch", fetchMock)

    expect(await fetchPublicChannelSnapshot("@creator_a")).toBeNull()
    const resolved = await resolvePublicChannel("@creator_a")
    expect(resolved.resolvedChannelId).toBeNull()
  })

  it("does not enable fixtures by default in production", async () => {
    const resolved = await resolvePublicChannel("@themotionvis")
    expect(resolved.resolvedChannelId).toBeNull()
    expect(resolved.reason).toContain("Public channel ingestion is unavailable")
  })

  it("caches public snapshots by normalized handle and preserves source provenance", async () => {
    const fetchedAt = new Date().toISOString()
    const snapshot = {
      mode: "public_handle",
      source: "public_page",
      fetchedAt,
      channelId: "UC1234567890123456789012",
      handle: "@public_creator",
      title: "Public Creator",
      subscriberCount: 123,
      videoCount: 45,
      viewCount: 6789,
      topVideos: [{ videoId: "abc123", title: "Latest upload", publishedAt: fetchedAt, viewCount: 999, likeCount: 10, commentCount: 2 }],
    }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      resolution: { resolvedChannelId: snapshot.channelId, resolvedHandle: snapshot.handle, channelTitle: snapshot.title, reason: null },
      snapshot,
      limitations: ["Public metadata only."],
    }))
    vi.stubGlobal("fetch", fetchMock)

    const first = await fetchPublicChannelSnapshot("@public_creator")
    const second = await fetchPublicChannelSnapshot("https://www.youtube.com/@public_creator")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first?.provenance).toMatchObject({
      schemaVersion: 1,
      outcome: "resolved",
      cacheStatus: "fresh",
      identity: { handle: "@public_creator", channelId: snapshot.channelId },
      limitations: ["Public metadata only."],
    })
    expect(second?.provenance).toMatchObject({
      schemaVersion: 1,
      outcome: "resolved",
      cacheStatus: "cached",
      identity: { handle: "@public_creator", channelId: snapshot.channelId },
    })
    expect(second?.fetchedAt).toBe(fetchedAt)
    expect(second?.subscriberCount).toBeNull()
    expect(second?.topVideos[0]).toMatchObject({ viewCount: null, likeCount: null, commentCount: null })
  })

  it("never reuses a cached public snapshot for a different handle", async () => {
    const makePayload = (handle: string, channelId: string) => ({
      resolution: { resolvedChannelId: channelId, resolvedHandle: handle, channelTitle: handle, reason: null },
      snapshot: {
        mode: "public_handle",
        source: "public_page",
        fetchedAt: new Date().toISOString(),
        channelId,
        handle,
        title: handle,
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos: [],
      },
    })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(makePayload("@creator_a", "UC1234567890123456789012")))
      .mockResolvedValueOnce(jsonResponse(makePayload("@creator_b", "UC9876543210987654321098")))
    vi.stubGlobal("fetch", fetchMock)

    const first = await fetchPublicChannelSnapshot("@creator_a")
    const second = await fetchPublicChannelSnapshot("@creator_b")

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(first?.channelId).toBe("UC1234567890123456789012")
    expect(second?.channelId).toBe("UC9876543210987654321098")
    expect(second?.provenance?.identity.handle).toBe("@creator_b")
  })

  it("ignores malformed public cache storage and resolves from the canonical endpoint", async () => {
    storage.set("vt_public_channel_cache_v1", "{not-json")
    const payload = {
      resolution: { resolvedChannelId: "UC1234567890123456789012", resolvedHandle: "@public_creator", channelTitle: "Public Creator", reason: null },
      snapshot: {
        mode: "public_handle",
        source: "public_page",
        fetchedAt: new Date().toISOString(),
        channelId: "UC1234567890123456789012",
        handle: "@public_creator",
        title: "Public Creator",
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos: [],
      },
    }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal("fetch", fetchMock)

    const snapshot = await fetchPublicChannelSnapshot("@public_creator")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(snapshot?.channelId).toBe(payload.snapshot.channelId)
    expect(snapshot?.provenance?.schemaVersion).toBe(1)
  })

})
