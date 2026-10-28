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
  return { statusCode, body: body as { resolution?: { resolvedChannelId?: string; resolvedHandle?: string; channelTitle?: string }; snapshot?: { source?: string; channelId?: string; topVideos?: Array<{ videoId: string; title: string }> }; error?: string } }
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
  it("parses reordered HTML attributes and decodes public channel metadata", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response('<meta content="Public &amp; Creator" property="og:title"><link href="https://www.youtube.com/@public_creator" rel="canonical"><script>{"externalId":"UC1234567890123456789012"}</script>'))
      .mockResolvedValueOnce(response('<feed><entry><yt:videoId>abc123</yt:videoId><title>Maker &#39;s &amp; Notes</title><published>2026-10-26T12:00:00Z</published></entry></feed>'))
    vi.stubGlobal("fetch", fetchMock)

    const result = await invoke("@public_creator")

    expect(result.statusCode).toBe(200)
    expect(result.body.resolution).toMatchObject({
      resolvedChannelId: "UC1234567890123456789012",
      resolvedHandle: "public_creator",
      channelTitle: "Public & Creator",
    })
    expect(result.body.snapshot?.topVideos?.[0]?.title).toBe("Maker 's & Notes")
  })

  it("does not trust a redirect to a non-YouTube host", async () => {
    const redirected = { ...response('<script>{"channelId":"UC1234567890123456789012"}</script>'), url: "https://attacker.example/redirected" } as Response
    const fetchMock = vi.fn().mockResolvedValueOnce(redirected)
    vi.stubGlobal("fetch", fetchMock)

    const result = await invoke("@public_creator")

    expect(result.statusCode).toBe(502)
    expect(result.body.error).toMatch(/redirect|host|YouTube/i)
  })

  it("resolves channel IDs directly without requesting a channel page", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response('<feed><entry><yt:videoId>abc123</yt:videoId><title>Latest upload</title><published>2026-10-26T12:00:00Z</published></entry></feed>'))
    vi.stubGlobal("fetch", fetchMock)

    const result = await invoke("UC1234567890123456789012")

    expect(result.statusCode).toBe(200)
    expect(result.body.resolution?.resolvedChannelId).toBe("UC1234567890123456789012")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toContain("/feeds/videos.xml?channel_id=")
  })

  it("rejects methods other than GET before performing upstream requests", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    let statusCode = 200
    let body: unknown
    const res = {
      setHeader: vi.fn(),
      status(code: number) { statusCode = code; return this },
      json(payload: unknown) { body = payload; return this },
    }
    await handler({ method: "POST", query: { handle: "@public_creator" }, url: "/api/public-channel" } as never, res as never)
    expect(statusCode).toBe(405)
    expect(body).toMatchObject({ error: "Method not allowed." })
    expect(fetchMock).not.toHaveBeenCalled()
  })

})
