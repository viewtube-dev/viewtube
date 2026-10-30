// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
 captureAIBrainLearningEvent: vi.fn(async () => ({ id: "learning-1" })),
 enqueueBrainLearningRecord: vi.fn(async () => ({ ok: true })),
}))

vi.mock("../aiBrainSelfImprovement", () => ({
 captureAIBrainLearningEvent: mocks.captureAIBrainLearningEvent,
}))
vi.mock("./BrainLearningPersistence", () => ({
 enqueueBrainLearningRecord: mocks.enqueueBrainLearningRecord,
}))

import { listBrainOutcomes, recordBrainOutcome } from "./BrainOutcomeLedger"
import type { BrainOutcomeRecord } from "./BrainOutcomeLedger"

const input = (overrides: Partial<Omit<BrainOutcomeRecord, "id" | "createdAt">> = {}): Omit<BrainOutcomeRecord, "id" | "createdAt"> => ({
 channelId: "channel-1",
 sourceToolId: "brain-command-center",
 targetToolId: "packaging-lab-pro",
 sourceRecordId: "action-packet-1",
 traceId: "trace-1",
 assetId: "asset-1",
 assetType: "thumbnail",
 contentBuildId: "build-1",
 projectId: "project-1",
 actionPacketId: "action-packet-1",
 workflowId: "workflow-1",
 recommendationId: "recommendation-1",
 experimentId: "experiment-1",
 publishTransactionId: null,
 approvedSnapshotId: null,
 approvedSnapshotHash: null,
 publishedVideoId: null,
 publicationIdentity: null,
 analyticsCheckpointIds: [],
 evidenceIds: ["evidence-1"],
 outcome: "completed",
 summary: "Thumbnail generation completed",
 evidence: ["asset output recorded"],
 confidence: "high",
 ...overrides,
})

describe("Brain outcome source-record replay identity", () => {
 beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
 })

 it("returns the existing outcome for an exact source-record retry", async () => {
  const first = await recordBrainOutcome(input())
  const replay = await recordBrainOutcome(input())

  expect(replay.id).toBe(first.id)
  expect(listBrainOutcomes("channel-1")).toHaveLength(1)
  expect(mocks.captureAIBrainLearningEvent).toHaveBeenCalledTimes(1)
 })

 it("fails closed when a source-record retry changes immutable lineage", async () => {
  await recordBrainOutcome(input())

  await expect(recordBrainOutcome(input({ traceId: "trace-conflict" })))
   .rejects.toThrow(/sourceRecordId action-packet-1 was reused with conflicting traceId/i)
  expect(listBrainOutcomes("channel-1")).toHaveLength(1)
  expect(listBrainOutcomes("channel-1")[0].traceId).toBe("trace-1")
 })

 it("enriches a legacy outcome when a retry adds previously absent provenance", async () => {
  const first = await recordBrainOutcome(input({ traceId: null, assetId: null }))
  const replay = await recordBrainOutcome(input({ traceId: "trace-restored", assetId: "asset-restored" }))

  expect(replay.id).toBe(first.id)
  expect(replay.traceId).toBe("trace-restored")
  expect(replay.assetId).toBe("asset-restored")
  expect(listBrainOutcomes("channel-1")[0]).toMatchObject({
   id: first.id,
   traceId: "trace-restored",
   assetId: "asset-restored",
  })
 })

 it("merges additional canonical evidence and analytics checkpoints on replay", async () => {
  const first = await recordBrainOutcome(input({
   evidenceIds: ["evidence-1"],
   analyticsCheckpointIds: ["checkpoint-1"],
  }))
  const replay = await recordBrainOutcome(input({
   evidenceIds: ["evidence-1", "evidence-2"],
   analyticsCheckpointIds: ["checkpoint-1", "checkpoint-2"],
  }))

  expect(replay.id).toBe(first.id)
  expect(replay.evidenceIds).toEqual(["evidence-1", "evidence-2"])
  expect(replay.analyticsCheckpointIds).toEqual(["checkpoint-1", "checkpoint-2"])
  expect(listBrainOutcomes("channel-1")).toHaveLength(1)
  expect(mocks.captureAIBrainLearningEvent).toHaveBeenCalledTimes(1)
 })

 it("fails closed when a replay changes the supporting outcome evidence", async () => {
  await recordBrainOutcome(input())

  await expect(recordBrainOutcome(input({ evidence: ["different support"] })))
   .rejects.toThrow(/sourceRecordId action-packet-1 was reused with conflicting evidence/i)
  expect(listBrainOutcomes("channel-1")).toHaveLength(1)
 })


 it("preserves and enriches shared correlation and causation identity on replay", async () => {
  const first = await recordBrainOutcome(input({ correlationId: null, causationId: null }))
  const replay = await recordBrainOutcome(input({
   correlationId: "correlation-7",
   causationId: "event-parent-3",
  }))

  expect(replay.id).toBe(first.id)
  expect(replay.correlationId).toBe("correlation-7")
  expect(replay.causationId).toBe("event-parent-3")
  expect(listBrainOutcomes("channel-1")[0]).toMatchObject({
   correlationId: "correlation-7",
   causationId: "event-parent-3",
  })
 })

 it("rejects a retry that reuses a source record with conflicting correlation identity", async () => {
  await recordBrainOutcome(input({ correlationId: "correlation-original" }))

  await expect(recordBrainOutcome(input({ correlationId: "correlation-other" })))
   .rejects.toThrow(/sourceRecordId action-packet-1 was reused with conflicting correlationId/i)
  expect(listBrainOutcomes("channel-1")[0].correlationId).toBe("correlation-original")
 })

})
