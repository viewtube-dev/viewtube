import { resolveFromFixture, snapshotFromFixture, fixturesEnabled } from "./publicHandleMode.fixtures"
export interface PublicChannelResolution {
 input: string
 resolvedChannelId: string | null
 resolvedHandle: string | null
 channelTitle: string | null
 reason: string | null
}

export interface PublicChannelSnapshot {
 mode: "public_handle"
 fetchedAt: string
 channelId: string
 handle: string | null
 title: string | null
 subscriberCount: number | null
 videoCount: number | null
 viewCount: number | null
 source?: "youtube_data_api_public" | "public_page" | "fixture"
 topVideos: Array<{
  videoId: string
  title: string
  publishedAt: string
  viewCount: number | null
  likeCount: number | null
  commentCount: number | null
 }>
}

const YT_DATA_BASE = "https://www.googleapis.com/youtube/v3"

const extractHandleLike = (input: string): string | null => {
 const trimmed = input.trim()
 if (!trimmed) return null

 if (trimmed.startsWith("@")) return trimmed.slice(1)

 try {
  const url = new URL(trimmed)
  const pathname = url.pathname
  if (pathname.startsWith("/@")) return pathname.slice(2)
  if (pathname.startsWith("/channel/")) return pathname.replace("/channel/", "")
  if (pathname.startsWith("/c/")) return pathname.replace("/c/", "")
  if (pathname.startsWith("/user/")) return pathname.replace("/user/", "")
 } catch {
  // not a URL
 }

 return trimmed
}


/**
 * Persist a public handle as a selected ingestion source even when public
 * metadata resolution is temporarily unavailable (for example, a missing
 * Data API key and an unavailable public-page resolver). This deliberately
 * does not invent a channel ID or claim that metadata was fetched.
 */
export const persistPublicHandleForIngestion = (input: string): string | null => {
 const candidate = extractHandleLike(input)
 if (!candidate) return null
 const trimmed = input.trim()
 const isChannelId = /^UC[a-zA-Z0-9_-]{20,}$/.test(candidate)
 const isHandle = /^@?[a-zA-Z0-9._-]{2,100}$/.test(candidate)
 let isYoutubeChannelUrl = false
 try {
  const url = new URL(trimmed)
  isYoutubeChannelUrl =
   (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com") || url.hostname === "www.youtube.com") &&
   (/^\/@[a-zA-Z0-9._-]+$/.test(url.pathname) || /^\/channel\/UC[a-zA-Z0-9_-]{20,}$/.test(url.pathname) || /^\/(c|user)\/[a-zA-Z0-9._-]+$/.test(url.pathname))
 } catch {
  // Handle or channel ID input, not a URL.
 }
 if (!isChannelId && !isHandle && !isYoutubeChannelUrl) return null
 const normalized = candidate.startsWith("@") ? candidate : isChannelId ? candidate : `@${candidate}`
 localStorage.setItem("vt_public_channel_handle", normalized)
 localStorage.setItem("vt_public_channel_input", trimmed)
 localStorage.setItem("vt_ingest_mode", "public_handle")
 return normalized
}

const toNum = (value: unknown): number | null => {
 if (typeof value === "number" && Number.isFinite(value)) return value
 if (typeof value === "string") {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
 }
 return null
}

const getApiKey = (): string | null => {
 const fromEnv = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined
 if (fromEnv && fromEnv.trim()) return fromEnv.trim()
 const fromLocal = localStorage.getItem("yt_public_api_key")
 if (fromLocal && fromLocal.trim()) return fromLocal.trim()
 return null
}

type PublicPageIngestionPayload = {
 resolution?: { resolvedChannelId?: string | null; resolvedHandle?: string | null; channelTitle?: string | null; reason?: string | null }
 snapshot?: PublicChannelSnapshot
}

const fetchPublicPageIngestion = async (handleInput: string): Promise<PublicPageIngestionPayload | null> => {
 const configuredBase = String(import.meta.env.VITE_BILLING_API_BASE || "").replace(/\/$/, "")
 const query = `?handle=${encodeURIComponent(handleInput)}`
 const urls = configuredBase
  ? [`${configuredBase}/public-channel/resolve${query}`, `${configuredBase}/api/public-channel${query}`]
  : [`/public-channel/resolve${query}`, `/api/public-channel${query}`]
 for (const url of urls) {
  try {
   const response = await fetch(url, { headers: { Accept: "application/json" } })
   if (!response.ok) continue
   const payload = await response.json() as PublicPageIngestionPayload
   if (payload.resolution?.resolvedChannelId || payload.snapshot?.channelId) return payload
  } catch {
   // Try the other supported deployment route, then allowlisted local fixtures.
  }
 }
 return null
}

export const resolvePublicChannel = async (
 handleInput: string,
): Promise<PublicChannelResolution> => {
 const apiKey = getApiKey()
 const candidate = extractHandleLike(handleInput)

 if (!candidate) {
  return {
   input: handleInput,
   resolvedChannelId: null,
   resolvedHandle: null,
   channelTitle: null,
   reason: "Enter a YouTube handle, channel URL, or channel ID.",
  }
 }

 if (!apiKey) {
  try {
   const payload = await fetchPublicPageIngestion(handleInput)
   if (payload?.resolution?.resolvedChannelId) {
    return {
     input: handleInput,
     resolvedChannelId: payload.resolution.resolvedChannelId,
     resolvedHandle: payload.resolution.resolvedHandle || candidate,
     channelTitle: payload.resolution.channelTitle || null,
     reason: null,
    }
   }
  } catch {
   // Local fixture fallback remains available when the public ingestion route is not hosted.
  }
  const fixture = resolveFromFixture(handleInput)
  if (fixture) {
   return {
    input: handleInput,
    resolvedChannelId: fixture.channelId,
    resolvedHandle: fixture.handle,
    channelTitle: fixture.title,
    reason: "Fixture data only — not live YouTube analytics.",
   }
  }
  return {
   input: handleInput,
   resolvedChannelId: null,
   resolvedHandle: candidate,
   channelTitle: null,
   reason: fixturesEnabled()
    ? 'Public channel ingestion could not resolve "' + candidate + '" and no fixture matched.'
    : "Public channel ingestion is unavailable. This path uses public channel pages and RSS, not a YouTube Data API key; confirm the /api/public-channel route is deployed.",
  }
 }

 const isLikelyChannelId = /^UC[a-zA-Z0-9_-]{20,}$/.test(candidate)
 const byChannelIdUrl = `${YT_DATA_BASE}/channels?part=snippet&id=${encodeURIComponent(candidate)}&key=${apiKey}`
 const byHandleUrl = `${YT_DATA_BASE}/channels?part=snippet&forHandle=${encodeURIComponent(candidate.replace(/^@/, ""))}&key=${apiKey}`
 const bySearchUrl = `${YT_DATA_BASE}/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(candidate)}&key=${apiKey}`

 const tryUrls = isLikelyChannelId
  ? [byChannelIdUrl, byHandleUrl, bySearchUrl]
  : [byHandleUrl, bySearchUrl, byChannelIdUrl]

 for (const url of tryUrls) {
  try {
   const response = await fetch(url)
   if (!response.ok) continue
   const data = (await response.json()) as {
    items?: Array<{
     id?: string | { channelId?: string }
     snippet?: { title?: string; customUrl?: string }
    }>
   }

   const item = data.items?.[0]
   if (!item) continue

   const channelId =
    typeof item.id === "string"
     ? item.id
     : typeof item.id === "object"
       ? item.id.channelId
       : null

   if (!channelId) continue

   return {
    input: handleInput,
    resolvedChannelId: channelId,
    resolvedHandle: item.snippet?.customUrl || candidate.replace(/^@/, ""),
    channelTitle: item.snippet?.title || null,
    reason: null,
   }
  } catch {
   // try next
  }
 }

 return {
  input: handleInput,
  resolvedChannelId: null,
  resolvedHandle: candidate,
  channelTitle: null,
  reason: "Channel could not be resolved from the provided input.",
 }
}

export const fetchPublicChannelSnapshot = async (
 handleInput: string,
): Promise<PublicChannelSnapshot | null> => {
 const apiKey = getApiKey()
 if (!apiKey) {
  try {
   const payload = await fetchPublicPageIngestion(handleInput)
   if (payload?.snapshot?.channelId) return payload.snapshot
  } catch {
   // Fall through to allowlisted fixtures for local testing.
  }
 }
 const resolved = await resolvePublicChannel(handleInput)
 const candidate = extractHandleLike(handleInput)
 if (resolved.resolvedChannelId?.startsWith("UC_FIXTURE_") || !apiKey) {
  if (candidate) {
   const fixture = snapshotFromFixture(candidate) || snapshotFromFixture(handleInput)
   if (fixture) return fixture
  }
 }
 if (!resolved.resolvedChannelId) return null
 if (!apiKey) return null

 const channelId = resolved.resolvedChannelId
 const profileUrl = `${YT_DATA_BASE}/channels?part=snippet,statistics&id=${encodeURIComponent(channelId)}&key=${apiKey}`
 const searchUrl = `${YT_DATA_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}&order=date&type=video&maxResults=10&key=${apiKey}`

 const profileResponse = await fetch(profileUrl)
 if (!profileResponse.ok) return null
 const profileData = (await profileResponse.json()) as {
  items?: Array<{
   snippet?: { title?: string; customUrl?: string }
   statistics?: {
    subscriberCount?: string
    videoCount?: string
    viewCount?: string
   }
  }>
 }

 const channel = profileData.items?.[0]
 if (!channel) return null

 const searchResponse = await fetch(searchUrl)
 const searchData = searchResponse.ok
  ? ((await searchResponse.json()) as {
     items?: Array<{
      id?: { videoId?: string }
      snippet?: { title?: string; publishedAt?: string }
     }>
    })
  : { items: [] }

 const videoIds = (searchData.items || [])
  .map((item) => item.id?.videoId)
  .filter((value): value is string => !!value)

 let statsByVideoId = new Map<string, { viewCount: number | null; likeCount: number | null; commentCount: number | null }>()
 if (videoIds.length > 0) {
  const statsUrl = `${YT_DATA_BASE}/videos?part=statistics&id=${videoIds.join(",")}&key=${apiKey}`
  const statsResponse = await fetch(statsUrl)
  if (statsResponse.ok) {
   const statsData = (await statsResponse.json()) as {
    items?: Array<{
     id?: string
     statistics?: { viewCount?: string; likeCount?: string; commentCount?: string }
    }>
   }
   statsByVideoId = new Map(
    (statsData.items || []).map((item) => [
     item.id || "",
     {
      viewCount: toNum(item.statistics?.viewCount),
      likeCount: toNum(item.statistics?.likeCount),
      commentCount: toNum(item.statistics?.commentCount),
     },
    ]),
   )
  }
 }

 return {
  mode: "public_handle",
  source: "youtube_data_api_public",
  fetchedAt: new Date().toISOString(),
  channelId,
  handle: channel.snippet?.customUrl || resolved.resolvedHandle || null,
  title: channel.snippet?.title || resolved.channelTitle || null,
  subscriberCount: toNum(channel.statistics?.subscriberCount),
  videoCount: toNum(channel.statistics?.videoCount),
  viewCount: toNum(channel.statistics?.viewCount),
  topVideos: (searchData.items || []).map((item) => {
   const videoId = item.id?.videoId || ""
   const stats = statsByVideoId.get(videoId)
   return {
    videoId,
    title: item.snippet?.title || videoId,
    publishedAt: item.snippet?.publishedAt || "",
    viewCount: stats?.viewCount ?? null,
    likeCount: stats?.likeCount ?? null,
    commentCount: stats?.commentCount ?? null,
   }
  }),
 }
}
