import { resolveFromFixture, snapshotFromFixture, fixturesEnabled } from "./publicHandleMode.fixtures"

export interface PublicChannelResolution {
  input: string
  resolvedChannelId: string | null
  resolvedHandle: string | null
  channelTitle: string | null
  reason: string | null
}

export interface PublicChannelProvenance {
  schemaVersion: 1
  outcome: "resolved"
  cacheStatus: "fresh" | "cached"
  identity: { handle: string | null; channelId: string }
  fetchedAt: string
  expiresAt: string
  sourceRefs: string[]
  limitations: string[]
}

export interface PublicChannelSnapshot {
  mode: "public_handle"
  provenance?: PublicChannelProvenance
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

const PUBLIC_CACHE_KEY = "vt_public_channel_cache_v1"
const PUBLIC_CACHE_SCHEMA_VERSION = 1
const PUBLIC_CACHE_TTL_MS = 3 * 60 * 60 * 1000
const PUBLIC_CACHE_MAX_ENTRIES = 20

type PublicCacheEntry = {
  identity: { handle: string | null; channelId: string }
  fetchedAt: string
  expiresAt: string
  sourceRefs: string[]
  limitations: string[]
  snapshot: PublicChannelSnapshot
}
type PublicCacheEnvelope = { schemaVersion: 1; entries: Record<string, PublicCacheEntry> }

const normalizedCacheKey = (candidate: string): string =>
  /^UC[\w-]{20,}$/.test(candidate) ? candidate : candidate.toLowerCase()

const readPublicCache = (): PublicCacheEnvelope => {
  try {
    if (typeof localStorage === "undefined") return { schemaVersion: 1, entries: {} }
    const parsed = JSON.parse(localStorage.getItem(PUBLIC_CACHE_KEY) || "null") as Partial<PublicCacheEnvelope> | null
    if (!parsed || parsed.schemaVersion !== PUBLIC_CACHE_SCHEMA_VERSION || !parsed.entries || typeof parsed.entries !== "object") {
      return { schemaVersion: 1, entries: {} }
    }
    return { schemaVersion: 1, entries: parsed.entries as Record<string, PublicCacheEntry> }
  } catch {
    return { schemaVersion: 1, entries: {} }
  }
}

const cacheEntryMatches = (entry: PublicCacheEntry, candidate: string): boolean => {
  if (!entry || !entry.snapshot || !isRealChannelId(entry.identity?.channelId) || entry.snapshot.channelId !== entry.identity.channelId) return false
  if (candidate.startsWith("UC")) return candidate === entry.identity.channelId
  const expected = candidate.replace(/^@/, "").toLowerCase()
  const actual = String(entry.identity.handle || entry.snapshot.handle || "").replace(/^@/, "").toLowerCase()
  return Boolean(actual && expected === actual)
}

const readCachedPublicSnapshot = (candidate: string): PublicChannelSnapshot | null => {
  const entry = readPublicCache().entries[normalizedCacheKey(candidate)]
  if (!entry || !cacheEntryMatches(entry, candidate)) return null
  const expiresAt = Date.parse(entry.expiresAt)
  const fetchedAt = Date.parse(entry.fetchedAt)
  if (!Number.isFinite(expiresAt) || !Number.isFinite(fetchedAt) || expiresAt <= Date.now()) return null
  return {
    ...entry.snapshot,
    fetchedAt: entry.fetchedAt,
    subscriberCount: null,
    videoCount: null,
    viewCount: null,
    topVideos: entry.snapshot.topVideos.map((video) => ({ ...video, viewCount: null, likeCount: null, commentCount: null })),
    provenance: {
      schemaVersion: 1,
      outcome: "resolved",
      cacheStatus: "cached",
      identity: entry.identity,
      fetchedAt: entry.fetchedAt,
      expiresAt: entry.expiresAt,
      sourceRefs: [...entry.sourceRefs],
      limitations: [...entry.limitations],
    },
  }
}

const writePublicCache = (candidate: string, snapshot: PublicChannelSnapshot, limitations: string[]): PublicChannelSnapshot => {
  const fetchedAt = Number.isFinite(Date.parse(snapshot.fetchedAt)) ? snapshot.fetchedAt : new Date().toISOString()
  const expiresAt = new Date(Date.parse(fetchedAt) + PUBLIC_CACHE_TTL_MS).toISOString()
  const identity = { handle: withHandlePrefix(snapshot.handle), channelId: snapshot.channelId }
  const sourceRefs = [
    `https://www.youtube.com/channel/${snapshot.channelId}`,
    `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(snapshot.channelId)}`,
  ]
  const normalizedSnapshot: PublicChannelSnapshot = {
    ...snapshot,
    fetchedAt,
    handle: identity.handle,
    subscriberCount: null,
    videoCount: null,
    viewCount: null,
    topVideos: snapshot.topVideos.map((video) => ({ ...video, viewCount: null, likeCount: null, commentCount: null })),
    provenance: {
      schemaVersion: 1,
      outcome: "resolved",
      cacheStatus: "fresh",
      identity,
      fetchedAt,
      expiresAt,
      sourceRefs,
      limitations: [...limitations],
    },
  }
  try {
    if (typeof localStorage !== "undefined") {
      const envelope = readPublicCache()
      const entries = { ...envelope.entries, [normalizedCacheKey(identity.handle || candidate)]: {
        identity, fetchedAt, expiresAt, sourceRefs, limitations: [...limitations], snapshot: normalizedSnapshot,
      } }
      const boundedEntries = Object.fromEntries(Object.entries(entries).slice(-PUBLIC_CACHE_MAX_ENTRIES))
      localStorage.setItem(PUBLIC_CACHE_KEY, JSON.stringify({ schemaVersion: 1, entries: boundedEntries }))
    }
  } catch {
    // Storage is an optimization; a successful public response remains usable without it.
  }
  return normalizedSnapshot
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
  if (candidate) {
    const cached = readCachedPublicSnapshot(candidate)
    if (cached) return {
      input: handleInput,
      resolvedChannelId: cached.channelId,
      resolvedHandle: cached.handle,
      channelTitle: cached.title,
      reason: null,
    }
  }
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
  const cached = readCachedPublicSnapshot(candidate)
  if (cached) return cached

  try {
    const payload = await fetchPublicPageIngestion(handleInput)
    const snapshot = payload?.snapshot
    if (snapshot && isRealChannelId(snapshot.channelId)) {
      const normalized: PublicChannelSnapshot = {
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
      return writePublicCache(candidate, normalized, Array.isArray(payload?.limitations) ? payload.limitations.map(String) : [])
    }
  } catch {
    // Try explicit local fixtures after a public resolver outage.
  }

  return snapshotFromFixture(handleInput)
}
