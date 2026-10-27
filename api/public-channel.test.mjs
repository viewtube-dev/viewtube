import { afterEach, describe, expect, it, vi } from "vitest"
import handler from "./public-channel.mjs"

const response = (body: string) => ({
  ok: true,
  status: 200,
  text: async () => body,
}) as Response

const invoke = async (handle: string) => {
  const req = { method: "GET", query: { handle }, url: `/api/public-channel?handle=${encodeURIComponent(handle)}` }
  let statusCode = 200
  let body: unknown
  const res = {
    setHeader: vi.fn(),
    status(code: number) { statusCode = code; return this },
    json(payload: unknown) { body = payload; return this },
  }
  await handler(req as never, res as never)
  return { statusCode, body: body as Record<string, any> }
}

describe("public channel ingestion endpoint", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("resolves a public handle and ingests RSS videos without authentication or Data API credentials", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response('<meta property="og:title" content="Public Creator"><link rel="canonical" href="https://www.youtube.com/@public_creator"><script>{"channelId":"UC1234567890123456789012"}</script>'))
      .mockResolvedValueOnce(response('<feed><entry><yt:videoId>abc123</yt:videoId><title>Latest upload</title><published>2026-10-26T12:00:00Z</published></entry></feed>'))
    vi.stubGlobal("fetch", fetchMock)

    const result = await invoke("@public_creator")

    expect(result.statusCode).toBe(200)
    expect(result.body.resolution).toMatchObject({
      resolvedChannelId: "UC1234567890123456789012",
      resolvedHandle: "public_creator",
      channelTitle: "Public Creator",
    })
    expect(result.body.snapshot).toMatchObject({
      source: "public_page",
      channelId: "UC1234567890123456789012",
      topVideos: [{ videoId: "abc123", title: "Latest upload" }],
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[0][0])).toContain("youtube.com/@public_creator")
    expect(String(fetchMock.mock.calls[1][0])).toContain("/feeds/videos.xml?channel_id=")
  })

  it("rejects arbitrary external URLs instead of fetching them", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const result = await invoke("https://example.com/private")

    expect(result.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
