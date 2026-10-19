import { describe, expect, it } from "vitest"
import {
  createOperationEnvelope,
  createOperationIdempotencyKey,
  hasOperationIdempotencyConflict,
  type OperationEnvelopeInput,
} from "./OperationEnvelope"

const baseInput: OperationEnvelopeInput = {
  eventId: "evt-1",
  eventType: "publish.started",
  operationId: "op-1",
  channelId: "channel-1",
  projectId: "project-1",
  contentBuildId: "build-1",
  actor: { type: "tool", id: "video-publisher" },
  correlationId: "corr-1",
  idempotencyKey: "publish:build-1:approval-7",
  occurredAt: "2026-10-14T00:00:00.000Z",
}

describe("OperationEnvelope", () => {
  it("normalizes optional references and causation to explicit empty/null values", () => {
    expect(createOperationEnvelope(baseInput)).toMatchObject({
      schemaVersion: 1,
      eventId: "evt-1",
      operationId: "op-1",
      correlationId: "corr-1",
      causationId: null,
      evidenceRefs: [],
      artifactRefs: [],
    })
  })

  it("preserves causation and evidence/artifact references", () => {
    expect(createOperationEnvelope({
      ...baseInput,
      causationId: "evt-parent",
      evidenceRefs: ["evidence-1"],
      artifactRefs: ["asset-version-4"],
    })).toMatchObject({
      causationId: "evt-parent",
      evidenceRefs: ["evidence-1"],
      artifactRefs: ["asset-version-4"],
    })
  })

  it("rejects envelopes without stable operation and idempotency identities", () => {
    expect(() => createOperationEnvelope({ ...baseInput, operationId: " " })).toThrow(/operationId/)
    expect(() => createOperationEnvelope({ ...baseInput, idempotencyKey: "" })).toThrow(/idempotencyKey/)
  })

  it("builds collision-safe deterministic idempotency keys from scoped command identity", () => {
    const first = createOperationIdempotencyKey({
      operationType: "publish.step",
      scope: ["channel-1", "build-1"],
      commandId: "upload-video",
    })
    expect(first).toBe(createOperationIdempotencyKey({
      operationType: "publish.step",
      scope: ["channel-1", "build-1"],
      commandId: "upload-video",
    }))
    expect(first).not.toBe(createOperationIdempotencyKey({
      operationType: "publish.step",
      scope: ["channel-1:build-1"],
      commandId: "upload-video",
    }))
  })

  it("detects duplicate idempotency keys without conflating different operations", () => {
    const existing = [createOperationEnvelope(baseInput)]
    expect(hasOperationIdempotencyConflict(existing, createOperationEnvelope({
      ...baseInput,
      eventId: "evt-2",
      operationId: "op-2",
    }))).toBe(true)
    expect(hasOperationIdempotencyConflict(existing, createOperationEnvelope({
      ...baseInput,
      eventId: "evt-3",
      operationId: "op-3",
      idempotencyKey: "publish:build-1:approval-8",
    }))).toBe(false)
  })
})
