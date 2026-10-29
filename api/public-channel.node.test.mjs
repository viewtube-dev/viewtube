import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import handler from "./public-channel.mjs"

const originalFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = originalFetch })

const response = (body, url = "") => ({ ok: true, status: 200, url, text: async () => body })
const invoke = async (handle, method = "GET") => {
  const req = { method, query: { handle }, url: "/api/public-channel?handle=" + encodeURIComponent(handle) }
  let statusCode = 200
  let body
  const res = {
    setHeader() {},
    status(code) { statusCode = code; return this },
    json(payload) { body = payload; return this },
  }
  await handler(req, res)
  return { statusCode, body }
}

test("resolves public handle metadata and recent RSS uploads", async () => {
  const calls = []
  globalThis.fetch = async (url) => {
    calls.push(String(url))
    if (calls.length === 1) return response('<meta property="og:title" content="Public Creator"><link rel="canonical" href="https://www.youtube.com/@public_creator"><script>{"channelId":"UC1234567890123456789012"}</script>')
    return response("<feed><entry><yt:videoId>abc123</yt:videoId><title>Latest upload</title><published>2026-10-26T12:00:00Z</published></entry></feed>")
  }
  const result = await invoke("@public_creator")
  assert.equal(result.statusCode, 200)
  assert.deepEqual(result.body.resolution, { resolvedChannelId: "UC1234567890123456789012", resolvedHandle: "public_creator", channelTitle: "Public Creator", reason: null })
  assert.equal(result.body.snapshot.source, "public_page")
  assert.equal(result.body.snapshot.topVideos[0].title, "Latest upload")
  assert.equal(calls.length, 2)
  assert.match(calls[0], /youtube\.com\/@public_creator/)
  assert.match(calls[1], /\/feeds\/videos\.xml\?channel_id=/)
})

test("rejects arbitrary external URLs without an upstream request", async () => {
  let called = false
  globalThis.fetch = async () => { called = true; return response("") }
  const result = await invoke("https://example.com/private")
  assert.equal(result.statusCode, 400)
  assert.equal(called, false)
})

test("parses reordered metadata attributes and decodes HTML entities", async () => {
  let callCount = 0
  globalThis.fetch = async () => {
    callCount += 1
    if (callCount === 1) return response('<meta content="Public &amp; Creator" property="og:title"><link href="https://www.youtube.com/@public_creator" rel="canonical"><script>{"externalId":"UC1234567890123456789012"}</script>')
    return response("<feed><entry><yt:videoId>abc123</yt:videoId><title>Maker &#39;s &amp; Notes</title><published>2026-10-26T12:00:00Z</published></entry></feed>")
  }
  const result = await invoke("@public_creator")
  assert.equal(result.statusCode, 200)
  assert.equal(result.body.resolution.channelTitle, "Public & Creator")
  assert.equal(result.body.snapshot.topVideos[0].title, "Maker 's & Notes")
})

test("rejects redirects to hosts outside the YouTube allowlist", async () => {
  globalThis.fetch = async () => response('<script>{"channelId":"UC1234567890123456789012"}</script>', "https://attacker.example/redirected")
  const result = await invoke("@public_creator")
  assert.equal(result.statusCode, 502)
  assert.match(result.body.error, /redirect|host|YouTube/i)
})

test("blocks an external redirect before fetching the redirected host", async () => {
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), redirect: options?.redirect })
    return {
      ok: false,
      status: 302,
      url: String(url),
      headers: { get: (name) => name.toLowerCase() === "location" ? "https://attacker.example/collect" : null },
      text: async () => "",
    }
  }

  const result = await invoke("@public_creator")

  assert.equal(result.statusCode, 502)
  assert.match(result.body.error, /redirect|host|YouTube/i)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].redirect, "manual")
})

test("resolves a channel ID directly from RSS without fetching its page", async () => {
  const calls = []
  globalThis.fetch = async (url) => { calls.push(String(url)); return response("<feed><entry><yt:videoId>abc123</yt:videoId><title>Latest upload</title><published>2026-10-26T12:00:00Z</published></entry></feed>") }
  const result = await invoke("UC1234567890123456789012")
  assert.equal(result.statusCode, 200)
  assert.equal(result.body.resolution.resolvedChannelId, "UC1234567890123456789012")
  assert.equal(calls.length, 1)
  assert.match(calls[0], /\/feeds\/videos\.xml\?channel_id=/)
})

test("rejects non-GET methods before upstream requests", async () => {
  let called = false
  globalThis.fetch = async () => { called = true; return response("") }
  const result = await invoke("@public_creator", "POST")
  assert.equal(result.statusCode, 405)
  assert.deepEqual(result.body, { error: "Method not allowed." })
  assert.equal(called, false)
})
