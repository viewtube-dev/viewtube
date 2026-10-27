import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchPublicChannelSnapshot, resolvePublicChannel } from "./publicHandleMode"

const storage = new Map<string, string>()
const mockStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, String(value)),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
}

const response = (payload: unknown, ok: boolean, status = 200) => ({
  ok,
  status,
  json: async () => payload,
}) as Response

describe("public channel mode fixture fallback", () => {
  afterEach(() => {
    storage.clear()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("uses allowlisted fixture when server reports missing API key and fixtures are enabled", async () => {
    vi.stubEnv("DEV", false)
    vi.stubEnv("VITE_PUBLIC_HANDLE_FIXTURES", "")
    vi.stubGlobal("localStorage", mockStorage)
    localStorage.setItem("vt_public_handle_fixtures", "1")
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({
      ok: false,
      code: "PUBLIC_LOOKUP_UNAVAILABLE",
      message: "Public channel lookup is not configured on the server.",
    }, false, 503)))

    const resolved = await resolvePublicChannel("@THEMOTIONVIS")
    expect(resolved).toMatchObject({
      resolvedChannelId: "UC_FIXTURE_THEMOTIONVIS",
      channelTitle: "The Motion Vis (fixture)",
    })
    expect(resolved.reason).toContain("Fixture data only")
    const snapshot = await fetchPublicChannelSnapshot("@themotionvis")
    expect(snapshot?.provenance?.source).toBe("fixture")
    expect(snapshot?.channelId).toBe("UC_FIXTURE_THEMOTIONVIS")
  })

  it("returns a clear allowlist error when fixtures are enabled but the handle is unknown", async () => {
    vi.stubEnv("DEV", false)
    vi.stubEnv("VITE_PUBLIC_HANDLE_FIXTURES", "")
    vi.stubGlobal("localStorage", mockStorage)
    localStorage.setItem("vt_public_handle_fixtures", "1")
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({
      ok: false,
      code: "PUBLIC_LOOKUP_UNAVAILABLE",
      message: "Public channel lookup is not configured on the server.",
    }, false, 503)))

    const result = await resolvePublicChannel("@not_allowlisted")
    expect(result.resolvedChannelId).toBeNull()
    expect(result.reason).toContain("no fixture")
    expect(await fetchPublicChannelSnapshot("@not_allowlisted")).toBeNull()
  })

  it("keeps the live server result preferred when it succeeds", async () => {
    vi.stubEnv("DEV", true)
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({
      ok: true,
      fetchedAt: "2026-10-27T12:00:00.000Z",
      channelId: "UC1234567890123456789012",
      handle: "@themotionvis",
      title: "Live API channel",
      subscriberCount: 42,
      videoCount: 3,
      viewCount: 900,
      topVideos: [],
      provenance: { source: "youtube_data_api_public", evidenceMode: "public_handle", privateMetricsIncluded: false },
    }, true)))

    const result = await resolvePublicChannel("@themotionvis")
    expect(result.channelTitle).toBe("Live API channel")
    expect(result.resolvedChannelId).toBe("UC1234567890123456789012")
    expect(result.reason).toBeNull()
  })
})
