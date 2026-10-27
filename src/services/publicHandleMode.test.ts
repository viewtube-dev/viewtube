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
    expect(resolved.reason).toContain("no fixture") || expect(resolved.reason).toContain("Public channel ingestion")
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
    expect(fetchMock).toHaveBeenCalledWith("/api/public-channel?handle=%40public_creator")
  })

  it("keeps a supplied real local API key on the live path", async () => {
    storage.set("yt_public_api_key", "test-real-key")
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      items: [{ id: { channelId: "UC1234567890123456789012" }, snippet: { title: "Live channel", customUrl: "@themotionvis" } }],
    }))
    vi.stubGlobal("fetch", fetchMock)
    const resolved = await resolvePublicChannel("@themotionvis")
    expect(resolved.channelTitle).toBe("Live channel")
    expect(resolved.resolvedChannelId).toBe("UC1234567890123456789012")
    expect(resolved.reason).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toContain("key=test-real-key")
  })

  it("does not enable fixtures by default in production", async () => {
    const resolved = await resolvePublicChannel("@themotionvis")
    expect(resolved.resolvedChannelId).toBeNull()
    expect(resolved.reason).toContain("Public channel ingestion is unavailable")
  })
})
