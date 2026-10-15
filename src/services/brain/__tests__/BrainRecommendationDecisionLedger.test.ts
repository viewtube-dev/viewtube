// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { listAlgorithmIntelligenceEvents, recordAlgorithmIntelligenceEvent } from "../AlgorithmIntelligenceEventLedger"
import {
 listBrainRecommendationDecisions,
 recordBrainRecommendationDecision,
} from "../BrainRecommendationDecisionLedger"

const sourceRecommendation = (channelId = "channel-1", projectId = "project-1") =>
 recordAlgorithmIntelligenceEvent({
  id: `recommendation:${channelId}:one`,
  channelId,
  projectId,
  kind: "RECOMMENDATION_CREATED",
  sourceSystem: "decision",
  sourceId: "recommendation-output-1",
  recommendationId: `recommendation:${channelId}:one`,
  videoId: "video-1",
  title: "Improve title clarity",
  summary: "Use the actual audience promise.",
  confidence: "medium",
  evidenceIds: ["snapshot-1", "row-1"],
  metadata: {
   traceId: "trace-1",
   outputRef: "original-output-1",
   promptReceipt: { promptVersion: "packaging-v1", outputSchemaVersion: "recommendation-v1" },
  },
 })

beforeEach(() => localStorage.clear())

describe("Brain recommendation decisions", () => {
 it("records accept/reject/defer as separate events without mutating the source recommendation", () => {
  const source = sourceRecommendation()
  const result = recordBrainRecommendationDecision({
   channelId: "channel-1", recommendationEventId: source.id,
   decision: "accept", idempotencyKey: "accept-1", decidedAt: 100,
  })
  expect(result.decision.originalOutputRef).toBe("original-output-1")
  expect(result.decision.evidenceIds).toEqual(["snapshot-1", "row-1"])
  expect(result.decision.traceId).toBe("trace-1")
  expect(result.decision.promptReceipt).toMatchObject({ promptVersion: "packaging-v1" })
  expect(result.event.parentEventIds).toContain(source.id)
  expect(result.event.metadata.recommendationMutated).toBe(false)
  expect(listAlgorithmIntelligenceEvents({ channelId: "channel-1" }).find((event) => event.id === source.id)?.summary)
   .toBe("Use the actual audience promise.")
 })

 it("preserves the original and modified output separately", () => {
  const source = sourceRecommendation()
  const result = recordBrainRecommendationDecision({
   channelId: "channel-1", recommendationEventId: source.id,
   decision: "modify", idempotencyKey: "modify-1",
   modification: { summary: "Keep the first half, remove the claim.", fields: { title: "Rebuilding a 1954 Fordson" }, modifiedOutputRef: "creator-edit-1" },
  })
  expect(result.decision.originalOutputRef).toBe("original-output-1")
  expect(result.decision.modification?.modifiedOutputRef).toBe("creator-edit-1")
  expect(result.event.metadata.modifiedOutputRef).toBe("creator-edit-1")
  expect(result.event.metadata.actionExecuted).toBe(false)
 })

 it("is idempotent for the same key and rejects a conflicting reuse", () => {
  const source = sourceRecommendation()
  const input = { channelId: "channel-1", recommendationEventId: source.id, decision: "defer" as const, idempotencyKey: "same-key", decidedAt: 200 }
  const first = recordBrainRecommendationDecision(input)
  const replay = recordBrainRecommendationDecision(input)
  expect(replay.idempotentReplay).toBe(true)
  expect(replay.decision.id).toBe(first.decision.id)
  expect(() => recordBrainRecommendationDecision({ ...input, decision: "reject" })).toThrow(/Idempotency key/)
  expect(listBrainRecommendationDecisions({ channelId: "channel-1" })).toHaveLength(1)
 })

 it("rejects cross-channel or project scope confusion", () => {
  const source = sourceRecommendation("channel-1", "project-1")
  expect(() => recordBrainRecommendationDecision({
   channelId: "channel-2", recommendationEventId: source.id, decision: "accept", idempotencyKey: "wrong-channel",
  })).toThrow(/requested channel scope/)
  expect(() => recordBrainRecommendationDecision({
   channelId: "channel-1", recommendationEventId: source.id, projectId: "project-2",
   decision: "accept", idempotencyKey: "wrong-project",
  })).toThrow(/project scope/)
 })

 it("requires a substantive modification and scopes reads by channel", () => {
  const first = sourceRecommendation("channel-1", "project-1")
  sourceRecommendation("channel-2", "project-2")
  expect(() => recordBrainRecommendationDecision({
   channelId: "channel-1", recommendationEventId: first.id, decision: "modify",
   idempotencyKey: "empty-modification", modification: {},
  })).toThrow(/must preserve/)
  recordBrainRecommendationDecision({
   channelId: "channel-1", recommendationEventId: first.id, decision: "reject", idempotencyKey: "reject-1",
  })
  expect(listBrainRecommendationDecisions({ channelId: "channel-1" })).toHaveLength(1)
  expect(listBrainRecommendationDecisions({ channelId: "channel-2" })).toHaveLength(0)
 })
})
