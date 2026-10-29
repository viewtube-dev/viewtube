import { describe, expect, it } from "vitest"
import { formatDiagnostics, readDiagnostics, recordDiagnostic, reportDiagnostic, sanitizeDiagnosticData } from "./diagnostics"

describe("ViewTube developer diagnostics", () => {
 it("redacts credential-shaped keys and bearer/query tokens", () => {
  expect(sanitizeDiagnosticData({
   authorization: "Bearer abc.def",
   nested: { apiKey: "secret", url: "https://example.test/?access_token=visible" },
  })).toEqual({
   authorization: "[REDACTED]",
   nested: { apiKey: "[REDACTED]", url: "https://example.test/?access_token=[REDACTED]" },
  })
 })

 it("deduplicates repeated failures with occurrence counts", () => {
  recordDiagnostic("warn", "proxy", "409 reconnect")
  recordDiagnostic("warn", "proxy", "409 reconnect")
  const entry = readDiagnostics().find((candidate) => candidate.tag === "proxy" && candidate.message === "409 reconnect")
  expect(entry?.count).toBe(2)
  expect(formatDiagnostics(entry ? [entry] : [])).toContain("(x2)")
 })

 it("records structured subsystem diagnostics in the shared buffer", () => {
  reportDiagnostic({
   area: "account",
   event: "snapshot_fallback",
   level: "warn",
   whatHappened: "Snapshot failed",
   debugData: { cookie: "private", status: 503 },
  })

  expect(readDiagnostics().at(-1)).toMatchObject({
   level: "warn",
   tag: "account:snapshot_fallback",
   message: "Snapshot failed",
  })
 })
 it("normalizes existing Google, Brain, analytics, account, backend, and frontend events into shared subsystem details", () => {
  const cases = [
   { area: "google-read", event: "GOOGLE_SCOPE_REQUIRED", subsystem: "authorization" },
   { area: "brain-gemini", event: "model_unavailable", subsystem: "brain" },
   { area: "youtube-analytics", event: "query_failed", subsystem: "analytics" },
   { area: "account-billing", event: "usage_limit", subsystem: "account" },
   { area: "backend-api", event: "request_failed", subsystem: "backend" },
   { area: "frontend-runtime", event: "render_failed", subsystem: "frontend" },
  ] as const

  for (const item of cases) {
   reportDiagnostic({
    area: item.area,
    event: item.event,
    level: "error",
    whatHappened: `${item.area} test failure`,
    whatItMeans: "The request did not complete.",
    whatToCheck: ["Inspect the response contract."],
    debugData: { statusCode: 503, apiKey: "must-not-leak" },
   })
   const entry = readDiagnostics().at(-1)
   expect(entry?.details).toMatchObject({
    source: item.area,
    subsystem: item.subsystem,
    kind: item.event,
    status: "failed",
    explanation: "The request did not complete.",
    recommendedActions: ["Inspect the response contract."],
    metadata: { statusCode: 503, apiKey: "[REDACTED]" },
   })
  }
 })

})