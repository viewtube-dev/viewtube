import { afterEach, describe, expect, it } from "vitest"
import {
  ingestDiagnostic,
  listDiagnosticAdapters,
  registerDiagnosticAdapter,
  type UnifiedDiagnosticEvent,
} from "./unified"
import { formatDiagnostics, readDiagnostics } from "../diagnostics"

const testAdapter = {
  id: "test-runner",
  normalize(raw: unknown): UnifiedDiagnosticEvent | null {
    if (!raw || typeof raw !== "object") return null
    const value = raw as Record<string, unknown>
    if (typeof value.summary !== "string") return null
    return {
      source: "untrusted-source",
      subsystem: "brain",
      kind: "test",
      severity: "error",
      status: "failed",
      code: "TEST_FAILED",
      summary: value.summary,
      correlationId: "run-123",
      expected: "a successful response",
      actual: "request failed",
      evidenceRefs: ["test://brain/chat"],
      recommendedActions: ["Inspect the failing request and response contract."],
      confidence: "confirmed",
      privacy: "sanitized",
      metadata: { apiKey: "must-not-appear", statusCode: 503 },
    }
  },
}

describe("unified diagnostics integration adapters", () => {
  let unregister: (() => void) | undefined

  afterEach(() => {
    unregister?.()
    unregister = undefined
  })

  it("registers an adapter and exposes its id for integration discovery", () => {
    unregister = registerDiagnosticAdapter(testAdapter)
    expect(listDiagnosticAdapters()).toContain("test-runner")
  })

  it("normalizes external failures into the existing diagnostics buffer with actionable detail", () => {
    unregister = registerDiagnosticAdapter(testAdapter)
    const accepted = ingestDiagnostic("test-runner", {
      summary: "Gemini request failed",
      statusCode: 503,
    })

    expect(accepted).toBe(true)
    expect(readDiagnostics().at(-1)).toMatchObject({
      tag: "brain:TEST_FAILED",
      message: "Gemini request failed",
      details: {
        source: "test-runner",
        subsystem: "brain",
        correlationId: "run-123",
        status: "failed",
        expected: "a successful response",
        actual: "request failed",
        evidenceRefs: ["test://brain/chat"],
        recommendedActions: ["Inspect the failing request and response contract."],
        metadata: { apiKey: "[REDACTED]", statusCode: 503 },
      },
    })
  })

  it("rejects unknown adapters and malformed payloads without throwing", () => {
    expect(ingestDiagnostic("not-installed", {})).toBe(false)
    unregister = registerDiagnosticAdapter(testAdapter)
    expect(ingestDiagnostic("test-runner", null)).toBe(false)
  })

  it("does not allow adapter output to spoof its registered source id", () => {
    unregister = registerDiagnosticAdapter(testAdapter)
    ingestDiagnostic("test-runner", { summary: "Source check" })
    expect(readDiagnostics().at(-1)?.details?.source).toBe("test-runner")
  })

  it("formats structured details into a readable diagnostic report", () => {
    unregister = registerDiagnosticAdapter(testAdapter)
    ingestDiagnostic("test-runner", { summary: "Gemini request failed" })
    const report = formatDiagnostics(readDiagnostics().slice(-1))
    expect(report).toContain("Source: test-runner")
    expect(report).toContain("Status: failed")
    expect(report).toContain("Expected: a successful response")
    expect(report).toContain("Actual: request failed")
    expect(report).toContain("Next steps: Inspect the failing request and response contract.")
  })

  it("omits evidence and raw metadata for events classified as sensitive", () => {
    unregister = registerDiagnosticAdapter({
      id: "sensitive-source",
      normalize: () => ({
        source: "spoofed",
        subsystem: "account",
        kind: "payment",
        severity: "error",
        status: "failed",
        code: "PAYMENT_FAILURE",
        summary: "Payment provider failed",
        expected: "payment accepted for test account",
        actual: "private customer payload",
        evidenceRefs: ["private://customer/123"],
        privacy: "sensitive",
        metadata: { customerEmail: "person@example.com", paymentToken: "secret" },
      }),
    })
    ingestDiagnostic("sensitive-source", {})
    expect(readDiagnostics().at(-1)?.details).toMatchObject({
      source: "sensitive-source",
      privacy: "sensitive",
    })
    expect(readDiagnostics().at(-1)?.details).not.toHaveProperty("metadata")
    expect(readDiagnostics().at(-1)?.details).not.toHaveProperty("evidenceRefs")
    expect(readDiagnostics().at(-1)?.details?.actual).toBe("[OMITTED: sensitive]")
  })
})
