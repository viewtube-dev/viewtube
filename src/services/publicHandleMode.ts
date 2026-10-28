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
  source?: "public_page" | "fixture"
  topVideos: Array<{
    videoId: string
    title: string
    publishedAt: string
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
  }>
}

const extractHandleLike = (input: string): string | null => {
  const trimmed = String(input || "").trim()
  if (!trimmed || trimmed.length > 512) return null
  if (/^UC[\w-]{20,}$/.test(trimmed)) return trimmed
  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1)
    return /^[a-zA-Z0-9._-]{1,100}$/.test(handle) ? `@${handle}` : null
  }

  try {
    const url = new URL(trimmed.startsWith("www.") ? `https://${trimmed}` : trimmed)
    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname.toLowerCase())) return null
    const handlePath = url.pathname.match(/^\/@([^/]+)(?:\/.*)?$/)
    if (handlePath) {
      const handle = decodeURIComponent(handlePath[1])
      return /^[a-zA-Z0-9._-]{1,100}$/.test(handle) ? `@${handle}` : null
    }
    const channelPath = url.pathname.match(/^\/channel\/(UC[\w-]{20,})(?:\/.*)?$/i)
    if (channelPath) return channelPath[1]
    const legacyPath = url.pathname.match(/^\/(?:c|user)\/([^/]+)(?:\/.*)?$/i)
    if (legacyPath) {
      const legacyName = decodeURIComponent(legacyPath[1])
      return /^[a-zA-Z0-9._-]{1,100}$/.test(legacyName) ? `@${legacyName}` : null
    }
    return null
  } catch {
    const bare = trimmed.replace(/^@+/, "")
    return /^[a-zA-Z0-9._-]{1,100}$/.test(bare) ? `@${bare}` : null
  }
}

/**
 * Persist the user's selected public source even if the public page is
 * temporarily unreachable. It never invents a channel ID or fetched data.
 */
export const persistPublicHandleForIngestion = (input: string): string | null => {
  const candidate = extractHandleLike(input)
  if (!candidate) return null
  const trimmed = input.trim()
  localStorage.setItem("vt_public_channel_handle", candidate)
  localStorage.setItem("vt_public_channel_input", trimmed)
  localStorage.setItem("vt_ingest_mode", "public_handle")
  return candidate
}

type PublicPageIngestionPayload = {
  resolution?: {
    resolvedChannelId?: string | null
    resolvedHandle?: string | null
    channelTitle?: string | null
    reason?: string | null
  }
  snapshot?: PublicChannelSnapshot
  limitations?: string[]
}

const isRealChannelId = (value: unknown): value is string =>
  typeof value === "string" && /^UC[\w-]{20,}$/.test(value) && !value.startsWith("UC_FIXTURE_")

const withHandlePrefix = (value: string | null | undefined): string | null => {
  if (!value) return null
  if (/^UC[\w-]{20,}$/.test(value)) return value
  return value.startsWith("@") ? value : `@${value}`
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
      const resolvedId = payload.resolution?.resolvedChannelId
      const snapshotId = payload.snapshot?.channelId
      if (isRealChannelId(resolvedId) && isRealChannelId(snapshotId) && resolvedId !== snapshotId) continue
      if (isRealChannelId(resolvedId) || isRealChannelId(snapshotId)) return payload
    } catch {
      // Try the other supported deployment route; fixtures remain explicitly allowlisted.
    }
  }
  return null
}

const fixtureResolution = (input: string): PublicChannelResolution | null => {
  const fixture = resolveFromFixture(input)
  if (!fixture) return null
  return {
    input,
    resolvedChannelId: fixture.channelId,
    resolvedHandle: fixture.handle,
    channelTitle: fixture.title,
    reason: "Fixture data only — not live YouTube analytics.",
  }
}

const unresolvedReason = (candidate: string): string => fixturesEnabled()
  ? `Public channel ingestion could not resolve "${candidate}" and no fixture matched.`
  : "Public channel ingestion is unavailable. The resolver uses public YouTube pages and RSS; confirm the /api/public-channel route is deployed."

export const resolvePublicChannel = async (handleInput: string): Promise<PublicChannelResolution> => {
  const candidate = extractHandleLike(handleInput)
  if (!candidate) {
    return {
      input: handleInput,
      resolvedChannelId: null,
      resolvedHandle: null,
      channelTitle: null,
      reason: "Enter a valid YouTube handle, channel URL, or channel ID.",
    }
  }

  try {
    const payload = await fetchPublicPageIngestion(handleInput)
    const resolution = payload?.resolution
    const channelId = isRealChannelId(resolution?.resolvedChannelId)
      ? resolution.resolvedChannelId
      : isRealChannelId(payload?.snapshot?.channelId) ? payload.snapshot.channelId : null
    if (channelId) {
      return {
        input: handleInput,
        resolvedChannelId: channelId,
        resolvedHandle: withHandlePrefix(resolution?.resolvedHandle || payload?.snapshot?.handle || (candidate.startsWith("UC") ? null : candidate)),
        channelTitle: resolution?.channelTitle || payload?.snapshot?.title || null,
        reason: null,
      }
    }
  } catch {
    // Resolver outage is not a reason to fabricate a live channel record.
  }

  return fixtureResolution(handleInput) || {
    input: handleInput,
    resolvedChannelId: null,
    resolvedHandle: candidate,
    channelTitle: null,
    reason: unresolvedReason(candidate),
  }
}

export const fetchPublicChannelSnapshot = async (handleInput: string): Promise<PublicChannelSnapshot | null> => {
  const candidate = extractHandleLike(handleInput)
  if (!candidate) return null

  try {
    const payload = await fetchPublicPageIngestion(handleInput)
    const snapshot = payload?.snapshot
    if (snapshot && isRealChannelId(snapshot.channelId)) {
      return {
        ...snapshot,
        source: "public_page",
        handle: withHandlePrefix(snapshot.handle || payload?.resolution?.resolvedHandle || (candidate.startsWith("UC") ? null : candidate)),
        title: snapshot.title || payload?.resolution?.channelTitle || null,
        subscriberCount: null,
        videoCount: null,
        viewCount: null,
        topVideos: Array.isArray(snapshot.topVideos) ? snapshot.topVideos.map((video) => ({
          videoId: String(video.videoId || ""),
          title: String(video.title || video.videoId || ""),
          publishedAt: String(video.publishedAt || ""),
          viewCount: null,
          likeCount: null,
          commentCount: null,
        })) : [],
      }
    }
  } catch {
    // Try explicit local fixtures after a public resolver outage.
  }

  return snapshotFromFixture(handleInput)
}
