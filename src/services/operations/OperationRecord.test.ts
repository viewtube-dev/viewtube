import { describe, expect, it } from "vitest"
import {
 buildScopedOperationIdempotencyKey,
 createOperationRecord,
 operationRecordFromActionPacket,
 operationRecordFromToolReceipt,
 transitionOperationRecord,
 type OperationRecordInput,
} from "./OperationRecord"

const baseInput = (overrides: Partial<OperationRecordInput> = {}): OperationRecordInput => ({
 operationId: "op-1",
 workflowId: "workflow-1",
 idempotencyKey: "idem-1",
 kind: "generation",
 status: "created",
 mutationClass: "prepare",
 approval: {
  status: "not-required",
  approvedBy: null,
  approvedAt: null,
  rejectedBy: null,
  rejectedAt: null,
 },
 sourceToolId: "thumbnail-studio",
 destinationToolId: null,
 parentOperationId: null,
 lineage: {
  creatorId: "creator-1",
  channelId: "channel-1",
  projectId: "project-1",
  contentBuildId: "build-1",
  videoId: null,
  assetIds: ["asset-1", "asset-1"],
  evidenceIds: ["evidence-1", "evidence-1"],
  traceId: "trace-1",
  actionPacketId: null,
  toolReceiptId: null,
  generationRecordId: null,
  publishTransactionId: null,
  approvedSnapshotId: null,
  approvedSnapshotHash: null,
  recommendationId: null,
  experimentId: null,
  parentOperationId: null,
 },
 reversible: true,
 undoOperationId: null,
 metadata: {},
 ...overrides,
})

describe("OperationRecord v1", () => {
 it("normalizes identity, timestamps, and duplicate lineage references", () => {
  const record = createOperationRecord(baseInput({ operationId: " op-1 ", workflowId: " workflow-1 " }))
  expect(record.schemaVersion).toBe(1)
  expect(record.operationId).toBe("op-1")
  expect(record.workflowId).toBe("workflow-1")
  expect(record.lineage.assetIds).toEqual(["asset-1"])
  expect(record.lineage.evidenceIds).toEqual(["evidence-1"])
  expect(record.updatedAt).toBe(record.createdAt)
  expect(record.requiresExplicitApproval).toBe(false)
 })

 it("builds a stable scoped idempotency key and rejects missing scope", () => {
  const input = { scopeId: "channel/1", producer: "publisher", callerKey: "retry 2" }
  expect(buildScopedOperationIdempotencyKey(input)).toBe(buildScopedOperationIdempotencyKey(input))
  expect(buildScopedOperationIdempotencyKey(input)).toContain("channel%2F1")
  expect(() => buildScopedOperationIdempotencyKey({ ...input, callerKey: " " })).toThrow(/non-empty/)
 })

 it("projects ActionPacket identity without replacing its persistence owner", () => {
  const record = operationRecordFromActionPacket({
   id: "packet-1",
   operationId: "op-packet-1",
   workflowId: "wf-1",
   sourceToolId: "thumbnail-studio",
   projectId: "project-1",
   contentBuildId: "build-1",
   assetIds: ["asset-1"],
   evidence: ["evidence-1"],
   intent: "execute",
   approvalState: "pending",
   createdAt: Date.parse("2026-10-15T10:00:00.000Z"),
  })
  expect(record.operationId).toBe("op-packet-1")
  expect(record.workflowId).toBe("wf-1")
  expect(record.status).toBe("awaiting-approval")
  expect(record.requiresExplicitApproval).toBe(true)
  expect(record.lineage.actionPacketId).toBe("packet-1")
  expect(record.lineage.contentBuildId).toBe("build-1")
 })


 it("fails closed when a legacy execute packet has no approval receipt", () => {
  const record = operationRecordFromActionPacket({
   id: "legacy-execute-packet",
   sourceToolId: "video-publisher",
   intent: "execute",
  })
  expect(record.status).toBe("awaiting-approval")
  expect(record.approval.status).toBe("pending")
  expect(record.requiresExplicitApproval).toBe(true)
 })

 it("projects ToolReceipt outputs, trace, and generation record into shared lineage", () => {
  const record = operationRecordFromToolReceipt({
   id: "receipt-1",
   requestId: "request-1",
   operationId: "operation-1",
   workflowId: "workflow-1",
   contentBuildId: "build-1",
   projectId: "project-1",
   toolId: "thumbnail-studio",
   inputAssetIds: ["source-1"],
   outputAssetIds: ["output-1"],
   evidenceIds: ["evidence-1"],
   generationRecordId: "generation-1",
   traceId: "trace-1",
   completedAt: "2026-10-15T10:00:00.000Z",
  }, { channelId: "channel-1" })
  expect(record.status).toBe("succeeded")
  expect(record.operationId).toBe("request-1")
  expect(record.lineage.assetIds).toEqual(["source-1", "output-1"])
  expect(record.lineage.generationRecordId).toBe("generation-1")
  expect(record.lineage.toolReceiptId).toBe("receipt-1")
  expect(record.lineage.traceId).toBe("trace-1")
 })

 it("requires explicit approval before a write operation can run", () => {
  const record = createOperationRecord(baseInput({
   mutationClass: "external-write",
   approval: { status: "pending", approvedBy: null, approvedAt: null, rejectedBy: null, rejectedAt: null },
  }))
  expect(record.requiresExplicitApproval).toBe(true)
  expect(() => transitionOperationRecord(record, "running", { at: "2026-10-15T10:01:00.000Z" }))
   .toThrow(/before explicit approval/)
 })

 it("allows an approved write to run and preserves its start timestamp on retry", () => {
  const record = createOperationRecord(baseInput({
   mutationClass: "user-approved-write",
   approval: { status: "approved", approvedBy: "creator-1", approvedAt: "2026-10-15T10:00:00.000Z", rejectedBy: null, rejectedAt: null },
  }))
  const started = transitionOperationRecord(record, "running", { at: "2026-10-15T10:01:00.000Z" })
  expect(started.startedAt).toBe("2026-10-15T10:01:00.000Z")
  const failed = transitionOperationRecord(started, "failed", {
   at: "2026-10-15T10:02:00.000Z",
   errorCode: "REMOTE_TIMEOUT",
   errorMessage: "Remote service timed out.",
  })
  const retry = transitionOperationRecord(failed, "running", { at: "2026-10-15T10:03:00.000Z" })
  expect(retry.startedAt).toBe(started.startedAt)
  expect(retry.errorCode).toBeNull()
 })

 it("rejects invalid transitions and keeps terminal operations terminal", () => {
  const succeeded = transitionOperationRecord(
   createOperationRecord(baseInput()),
   "running",
   { at: "2026-10-15T10:01:00.000Z" },
  )
  const done = transitionOperationRecord(succeeded, "succeeded", { at: "2026-10-15T10:02:00.000Z" })
  expect(done.completedAt).toBe("2026-10-15T10:02:00.000Z")
  expect(() => transitionOperationRecord(done, "running")).toThrow(/Invalid operation status transition/)
 })
})
