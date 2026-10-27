const CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{20,}$/
const HANDLE_PATTERN = /^[\p{L}\p{N}._-]{3,30}$/u
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"])

const validCandidate = (value: string): string | null => {
  const candidate = value.replace(/^@/, "").trim()
  if (CHANNEL_ID_PATTERN.test(candidate)) return candidate
  return HANDLE_PATTERN.test(candidate) ? candidate : null
}

/**
 * Normalizes a user-entered public YouTube channel identifier.
 *
 * This is deliberately only an input parser: it does not resolve legacy custom
 * URLs, fetch channel data, or imply access to connected/private analytics.
 */
export const normalizeHandle = (input: string): string | null => {
  const trimmed = String(input ?? "").trim()
  if (!trimmed) return null

  if (trimmed.startsWith("@")) return validCandidate(trimmed)
  if (CHANNEL_ID_PATTERN.test(trimmed)) return trimmed

  // Accept a bare YouTube hostname for convenience without treating arbitrary
  // URLs or lookalike hosts as channel identifiers.
  const urlInput = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : /^(?:www\.)?youtube\.com\//i.test(trimmed)
      ? `https://${trimmed}`
      : null
  if (!urlInput) return validCandidate(trimmed)

  try {
    const url = new URL(urlInput)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null

    const segments = url.pathname.split("/").filter(Boolean)
    if (!segments.length) return null

    const first = segments[0]
    if (first.startsWith("@")) return validCandidate(first)
    if (first === "channel" && segments[1]) {
      return CHANNEL_ID_PATTERN.test(segments[1]) ? segments[1] : null
    }
    if ((first === "c" || first === "user") && segments[1]) {
      return validCandidate(segments[1])
    }
    return null
  } catch {
    return null
  }
}
