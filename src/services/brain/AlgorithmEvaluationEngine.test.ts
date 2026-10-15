import { describe, expect, it } from "vitest"
import { buildAlgorithmEvaluationLifecycleIdentity } from "./AlgorithmEvaluationEngine"
import type { AlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

const event = (metadata: Record<string, unknown>): AlgorithmIntelligenceEvent => ({
 id: "checkpoint-1",
 channelId: "channel-1",
 projectId: "project-1",
 videoId: "video-1",
 kind: "CHECKPOINT_REACHED",
 sourceSystem: "workflow",
 sourceId: "day-7",
 parentEventIds: ["publication-1"],
 recommendationId: "recommendation-1",
 actionPacketId: "action-packet-1",
 workflowId: "workflow-1",
 evidenceIds: ["analytics-row-1"],
 confidence: "high",
 title: "Day 7 checkpoint",
 summary: "Checkpoint",
 evaluationTargets: [],
 metadata,
 createdAt: 100,
})

describe("buildAlgorithmEvaluationLifecycleIdentity", () => {
 it("reads the canonical publishTransactionId key used by post-publish checkpoint events", () => {
  expect(buildAlgorithmEvaluationLifecycleIdentity(event({
   contentBuildId: "build-1",
   publishTransactionId: "publish-tx-1",
   approvedSnapshotId: "snapshot-1",
   approvedSnapshotHash: "hash-1",
   checkpointId: "day-7",
   experimentId: "experiment-1",
  }))).toMatchObject({
   recommendationId: "recommendation-1",
   projectId: "project-1",
   contentBuildId: "build-1",
   videoId: "video-1",
   actionPacketId: "action-packet-1",
   publicationTransactionId: "publish-tx-1",
   approvedSnapshotId: "snapshot-1",
   checkpointId: "day-7",
  })
 })

 it("continues to read the legacy publicationTransactionId alias", () => {
  expect(buildAlgorithmEvaluationLifecycleIdentity(event({
   publicationTransactionId: "legacy-publish-tx",
  })).publicationTransactionId).toBe("legacy-publish-tx")
 })
})
