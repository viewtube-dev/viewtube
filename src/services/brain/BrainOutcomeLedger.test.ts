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
})
