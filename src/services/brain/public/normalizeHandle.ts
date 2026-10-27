export type PublicChannelInputKind = "handle" | "channel_id" | "custom_url" | "username"

export interface NormalizedPublicChannelInput {
  kind: PublicChannelInputKind
  value: string
  canonicalUrl: string | null
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
])

const CHANNEL_ID = /^UC[a-zA-Z0-9_-]{20,}$/
const HANDLE = /^[a-zA-Z0-9._-]{1,100}$/

const result = (
  kind: PublicChannelInputKind,
  value: string,
  canonicalUrl: string | null = null,
): NormalizedPublicChannelInput => ({ kind, value, canonicalUrl })

/**
 * Normalize user-entered public YouTube channel identifiers without making
 * network requests. This is intentionally a parser, not a channel resolver.
 */
export const normalizePublicChannelInput = (
  input: string,
): NormalizedPublicChannelInput | null => {
  const raw = String(input || "").trim()
  if (!raw) return null

  if (raw.startsWith("@")) {
    const handle = raw.slice(1).trim()
    return HANDLE.test(handle) ? result("handle", handle) : null
  }

  if (CHANNEL_ID.test(raw)) {
    return result("channel_id", raw, `https://www.youtube.com/channel/${raw}`)
  }

  let url: URL | null = null
  try {
    if (/^https?:\/\//i.test(raw)) {
      url = new URL(raw)
    } else if (/^(?:www\.|m\.|music\.)?youtube\.com\//i.test(raw)) {
      url = new URL(`https://${raw}`)
    }
  } catch {
    return null
  }

  if (url) {
    if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase()) || (url.protocol !== "https:" && url.protocol !== "http:")) {
      return null
    }
    const segments = url.pathname.split("/").filter(Boolean)
    const first = segments[0] || ""
    if (first.startsWith("@")) {
      const handle = first.slice(1)
      return HANDLE.test(handle) ? result("handle", handle, `https://www.youtube.com/@${handle}`) : null
    }
    if (first === "channel" && segments[1] && CHANNEL_ID.test(segments[1])) {
      return result("channel_id", segments[1], `https://www.youtube.com/channel/${segments[1]}`)
    }
    if (first === "c" && segments[1] && HANDLE.test(segments[1])) {
      return result("custom_url", segments[1], `https://www.youtube.com/c/${segments[1]}`)
    }
    if (first === "user" && segments[1] && HANDLE.test(segments[1])) {
      return result("username", segments[1], `https://www.youtube.com/user/${segments[1]}`)
    }
    return null
  }

  return HANDLE.test(raw) ? result("handle", raw.replace(/^@/, "")) : null
}
