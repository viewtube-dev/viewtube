export type GeminiKeyValidationFailureClass =
 | "credential_rejected"
 | "permission_denied"
 | "rate_limited"
 | "provider_unavailable"
 | "verification_unavailable"

/** Classifies provider failures without retaining or returning credential material. */
export const classifyGeminiKeyValidationError = (
 error: unknown,
): GeminiKeyValidationFailureClass => {
 const value = error && typeof error === "object" ? error as Record<string, unknown> : {}
 const status = Number(value.status ?? value.code)
 const message = String(value.message ?? "").toLowerCase()

 if (
  status === 401 ||
  /api[_ -]?key[_ -]?invalid|invalid api key|unauthorized|authentication failed|invalid credential/.test(message)
 ) return "credential_rejected"

 if (status === 403 || /permission denied|forbidden|access not configured/.test(message)) {
  return "permission_denied"
 }

 if (status === 429 || /rate limit|resource exhausted|quota exceeded|too many requests/.test(message)) {
  return "rate_limited"
 }

 if (status >= 500 || /network|fetch failed|failed to fetch|temporarily unavailable|service unavailable|econnreset|timeout/.test(message)) {
  return "provider_unavailable"
 }

 return "verification_unavailable"
}
