import { describe, expect, it, vi } from "vitest"
import { readDiagnostics } from "../diagnostics"
import {
 GoogleRequestError,
 readGoogleProxyError,
 requestGoogleWithRetry,
} from "./googleProxyErrors"

const failure = (
 status: number,
 error: Record<string, unknown> | string,
 headers: Record<string, string> = {},
) => new Response(JSON.stringify({ error }), {
 status,
 headers: { "Content-Type": "application/json", ...headers },
})

describe("Google proxy failure contract", () => {
 it("does not retry a generic legacy 500", async () => {
  const request = vi.fn(async () => failure(500, "legacy failure"))
  const response = await requestGoogleWithRetry(request)
  expect(response.status).toBe(500)
  expect(request).toHaveBeenCalledTimes(1)
 })

 it("retries only responses explicitly classified as retryable", async () => {
  const request = vi.fn()
   .mockResolvedValueOnce(failure(503, {
    code: "GOOGLE_UPSTREAM_UNAVAILABLE",
    message: "temporary",
    retryable: true,
    reconnectRequired: false,
   }, { "Retry-After": "0" }))
   .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }))

  const response = await requestGoogleWithRetry(request)
  expect(response.ok).toBe(true)
  expect(request).toHaveBeenCalledTimes(2)
 })

 it("throws immediately when Google must be reconnected", async () => {
  const request = vi.fn(async () => failure(409, {
   code: "GOOGLE_RECONNECT_REQUIRED",
   message: "Reconnect Google.",
   retryable: false,
   reconnectRequired: true,
   requestId: "request-1",
  }))

  await expect(requestGoogleWithRetry(request)).rejects.toBeInstanceOf(GoogleRequestError)
  expect(request).toHaveBeenCalledTimes(1)
 })

 it("preserves scope failures without retrying", async () => {
  const response = failure(403, {
   code: "GOOGLE_SCOPE_REQUIRED",
   message: "Reconnect for analytics.",
   retryable: false,
   reconnectRequired: false,
  })
  const details = await readGoogleProxyError(response)
  expect(details).toMatchObject({ code: "GOOGLE_SCOPE_REQUIRED", retryable: false })
 })

 // Real user hit an 8x cascade of GOOGLE_SCOPE_REQUIRED errors on the mobile
 // sync flow that were actually the Vercel proxy handler rejecting the
 // request with body 'Request origin is not allowed.' The 403-fallback
 // classifier mapped it to GOOGLE_SCOPE_REQUIRED — sync then gave up and
 // reported 'done' with zero rows loaded. The remap below sends origin
 // rejections down PROXY_ORIGIN_REJECTED so callers can bypass the proxy.
 it("remaps 'Request origin is not allowed' 403s to PROXY_ORIGIN_REJECTED (not scope)", async () => {
  const response = new Response("Request origin is not allowed.", {
   status: 403,
   headers: { "Content-Type": "text/plain" },
  })
  const details = await readGoogleProxyError(response)
  expect(details?.code).toBe("PROXY_ORIGIN_REJECTED")
  expect(details?.retryable).toBe(false)
  expect(details?.reconnectRequired).toBe(false)
 })

 it("also catches origin rejections served as 401 with a JSON error field", async () => {
  const response = new Response(
   JSON.stringify({ error: "Request origin is not allowed." }),
   { status: 401, headers: { "Content-Type": "application/json" } },
  )
  const details = await readGoogleProxyError(response)
  expect(details?.code).toBe("PROXY_ORIGIN_REJECTED")
 })

 it("catches 'Account request failed' bodies from an unrouted proxy path", async () => {
  const response = new Response("Account request failed (404).", {
   status: 404,
   headers: { "Content-Type": "text/plain" },
  })
  const details = await readGoogleProxyError(response)
  expect(details?.code).toBe("PROXY_ORIGIN_REJECTED")
 })

 it("leaves genuine scope errors alone when the body carries an explicit code", async () => {
  // Precedence sanity: an explicit GOOGLE_SCOPE_REQUIRED from the proxy
  // must not accidentally match the origin-rejection sniff.
  const response = failure(403, {
   code: "GOOGLE_SCOPE_REQUIRED",
   message: "Reconnect for analytics.",
   retryable: false,
   reconnectRequired: false,
  })
  const details = await readGoogleProxyError(response)
  expect(details?.code).toBe("GOOGLE_SCOPE_REQUIRED")
 })
 it("records structured Google API failure details without retaining credential material", async () => {
  const response = failure(403, {
   code: "GOOGLE_SCOPE_REQUIRED",
   message: "Reconnect for analytics.",
   retryable: false,
   reconnectRequired: false,
   requestId: "request-safe-1",
   upstreamStatus: 403,
  })
  await requestGoogleWithRetry(async () => response, { operation: "youtube-analytics" })
  const entry = readDiagnostics().filter((item) => item.tag === "google-read:GOOGLE_SCOPE_REQUIRED").at(-1)
  expect(entry?.details).toMatchObject({
   source: "google-read",
   subsystem: "authorization",
   kind: "GOOGLE_SCOPE_REQUIRED",
   status: "failed",
   expected: "Google API request completes successfully",
   actual: "GOOGLE_SCOPE_REQUIRED (HTTP 403)",
   metadata: {
    operation: "youtube-analytics",
    failureCode: "GOOGLE_SCOPE_REQUIRED",
    attempts: 1,
    upstreamStatus: 403,
   },
  })
  expect(JSON.stringify(entry?.details)).not.toContain("apiKey")
 })

})