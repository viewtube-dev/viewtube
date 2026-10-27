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

describe("public channel mode fixtures", () => {
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
    expect(resolved.reason).toContain("no fixture")
    expect(await fetchPublicChannelSnapshot("@unknown_channel")).toBeNull()
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
    expect(resolved.reason).toContain("Missing VITE_YOUTUBE_API_KEY")
  })
})
