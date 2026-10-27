import { createHash } from "node:crypto"

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
const CACHE_TTL_MS = 3 * 60 * 60 * 1000
const NOT_FOUND_TTL_MS = 30 * 60 * 1000
const MAX_CACHE_ENTRIES = 250
const MAX_REQUESTS_PER_WINDOW = 30
const RATE_WINDOW_MS = 60 * 1000
const cache = new Map()
const rateBuckets = new Map()

const validChannelId = (value) => /^UC[a-zA-Z0-9_-]{20,}$/.test(String(value || ""))
const normalizeInput = (value) => String(value || "").trim()
const cacheKey = (value) => createHash("sha256").update(value.toLowerCase()).digest("hex")

export const resetPublicChannelResolverForTests = () => {
  cache.clear()
  rateBuckets.clear()
}

export const normalizePublicChannelInput = (value) => {
  const input = normalizeInput(value)
  if (!input || input.length > 200) return null
  if (input.startsWith("@")) {
    const handle = input.slice(1)
    return /^[\p{L}\p{N}._-]{3,30}$/u.test(handle) ? { kind: "handle", value: handle } : null
  }
  if (validChannelId(input)) return { kind: "channelId", value: input }
  const urlInput = /^[a-z][a-z\d+.-]*:\/\//i.test(input)
    ? input
    : /^(?:www\.)?youtube\.com\//i.test(input)
      ? `https://${input}`
      : null
  if (!urlInput) {
    return /^[\p{L}\p{N}._-]{3,30}$/u.test(input) ? { kind: "handle", value: input } : null
  }
  try {
    const url = new URL(urlInput)
    if (!["https:", "http:"].includes(url.protocol)) return null
    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname.toLowerCase())) return null
    const segments = url.pathname.split("/").filter(Boolean)
    if (segments[0]?.startsWith("@") && segments.length >= 1) {
      const handle = segments[0].slice(1)
      return /^[\p{L}\p{N}._-]{3,30}$/u.test(handle) ? { kind: "handle", value: handle } : null
    }
    if (segments[0] === "channel" && validChannelId(segments[1])) return { kind: "channelId", value: segments[1] }
    if (["c", "user"].includes(segments[0]) && segments[1] && /^[\p{L}\p{N}._-]{3,30}$/u.test(segments[1])) {
      return { kind: "legacy", value: segments[1] }
    }
    return null
  } catch {
    return null
  }
}

const json = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" })
  res.end(JSON.stringify(payload))
}

const apiRequest = async (endpoint, params, apiKey, fetchImpl) => {
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`)
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value))
  url.searchParams.set("key", apiKey)
  const response = await fetchImpl(url, { headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error(`YouTube public API returned ${response.status}`)
  return response.json()
}

const cacheSet = (key, value, ttl) => {
  if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value)
  cache.set(key, { value, expiresAt: Date.now() + ttl })
}

const resolveChannel = async (input, apiKey, fetchImpl) => {
  const parsed = normalizePublicChannelInput(input)
  if (!parsed) return { ok: false, code: "INVALID_CHANNEL_INPUT", message: "Enter a valid YouTube channel handle, channel URL, or channel ID." }
  const key = cacheKey(`${parsed.kind}:${parsed.value}`)
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.value
  if (cached) cache.delete(key)

  let channel = null
  if (parsed.kind === "channelId") {
    const data = await apiRequest("channels", { part: "snippet,statistics", id: parsed.value }, apiKey, fetchImpl)
    channel = data.items?.[0] || null
  } else if (parsed.kind === "handle") {
    const data = await apiRequest("channels", { part: "snippet,statistics", forHandle: parsed.value }, apiKey, fetchImpl)
    channel = data.items?.[0] || null
  } else {
    const data = await apiRequest("search", { part: "snippet", type: "channel", maxResults: 5, q: parsed.value }, apiKey, fetchImpl)
    const channelId = data.items?.find((item) => item.id?.channelId)?.id?.channelId
    if (channelId) {
      const details = await apiRequest("channels", { part: "snippet,statistics", id: channelId }, apiKey, fetchImpl)
      channel = details.items?.[0] || null
    }
  }
  if (!channel?.id) {
    const result = { ok: false, code: "CHANNEL_NOT_FOUND", message: "No public channel could be resolved from that input." }
    cacheSet(key, result, NOT_FOUND_TTL_MS)
    return result
  }

  const search = await apiRequest("search", { part: "snippet", channelId: channel.id, order: "date", type: "video", maxResults: 10 }, apiKey, fetchImpl)
  const videos = (search.items || []).filter((item) => item.id?.videoId)
  const ids = videos.map((item) => item.id.videoId)
  let statsById = new Map()
  if (ids.length) {
    const stats = await apiRequest("videos", { part: "statistics", id: ids.join(",") }, apiKey, fetchImpl)
    statsById = new Map((stats.items || []).map((item) => [item.id, item.statistics || {}]))
  }
  const numberOrNull = (value) => value === undefined || value === null || value === "" || !Number.isFinite(Number(value)) ? null : Number(value)
  const result = {
    ok: true,
    mode: "public_handle",
    fetchedAt: new Date().toISOString(),
    channelId: channel.id,
    handle: channel.snippet?.customUrl || (parsed.kind === "handle" ? `@${parsed.value}` : null),
    title: channel.snippet?.title || null,
    subscriberCount: numberOrNull(channel.statistics?.subscriberCount),
    videoCount: numberOrNull(channel.statistics?.videoCount),
    viewCount: numberOrNull(channel.statistics?.viewCount),
    topVideos: videos.map((item) => {
      const stats = statsById.get(item.id.videoId) || {}
      return {
        videoId: item.id.videoId,
        title: item.snippet?.title || item.id.videoId,
        publishedAt: item.snippet?.publishedAt || null,
        viewCount: numberOrNull(stats.viewCount),
        likeCount: numberOrNull(stats.likeCount),
        commentCount: numberOrNull(stats.commentCount),
      }
    }),
    provenance: { source: "youtube_data_api_public", evidenceMode: "public_handle", privateMetricsIncluded: false },
  }
  cacheSet(key, result, CACHE_TTL_MS)
  return result
}

export const handlePublicChannelResolveRoute = async (req, res, options = {}) => {
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const apiKey = String(options.apiKey || process.env.YOUTUBE_DATA_API_KEY || process.env.YOUTUBE_API_KEY || "").trim()
  const now = Date.now()
  const clientKey = req.socket?.remoteAddress || "unknown"
  const bucket = rateBuckets.get(clientKey) || { start: now, count: 0 }
  if (now - bucket.start >= RATE_WINDOW_MS) { bucket.start = now; bucket.count = 0 }
  bucket.count += 1
  rateBuckets.set(clientKey, bucket)
  if (rateBuckets.size > 1000) {
    for (const [key, value] of rateBuckets) {
      if (now - value.start >= RATE_WINDOW_MS) rateBuckets.delete(key)
    }
  }
  if (bucket.count > MAX_REQUESTS_PER_WINDOW) return json(res, 429, { ok: false, code: "RATE_LIMITED", message: "Too many public channel lookups. Try again shortly." })
  if (req.method !== "POST") return json(res, 405, { ok: false, code: "METHOD_NOT_ALLOWED" })
  if (!apiKey) return json(res, 503, { ok: false, code: "PUBLIC_LOOKUP_UNAVAILABLE", message: "Public channel lookup is not configured on the server." })

  let body
  try {
    const chunks = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > 4096) return json(res, 413, { ok: false, code: "REQUEST_TOO_LARGE" })
      chunks.push(chunk)
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")
  } catch {
    return json(res, 400, { ok: false, code: "INVALID_JSON", message: "Request body must be valid JSON." })
  }
  const input = normalizeInput(body?.input)
  if (input.length > 200) return json(res, 400, { ok: false, code: "INVALID_CHANNEL_INPUT", message: "Channel input is too long." })
  if (!input) return json(res, 400, { ok: false, code: "INVALID_CHANNEL_INPUT", message: "A channel handle, URL, or ID is required." })
  try {
    const result = await resolveChannel(input, apiKey, fetchImpl)
    return json(res, result.ok ? 200 : result.code === "CHANNEL_NOT_FOUND" ? 404 : 400, result)
  } catch (error) {
    return json(res, 502, { ok: false, code: "PUBLIC_LOOKUP_FAILED", message: "Public channel lookup failed. Please retry later." })
  }
}
