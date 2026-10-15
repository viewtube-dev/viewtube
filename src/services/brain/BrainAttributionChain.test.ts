import { describe, expect, it } from "vitest"
import { buildBrainAttributionChain } from "./BrainAttributionChain"
import type { AlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

const event = (overrides: Partial<AlgorithmIntelligenceEvent>): AlgorithmIntelligenceEvent => ({
 id: "recommendation-1",
 channelId: "channel-1",
 kind: "RECOMMENDATION_CREATED",
 sourceSystem: "opportunity",
 parentEventIds: [],
 evidenceIds: ["evidence-1"],
 confidence: "high",
 title: "Recommendation",
 summary: "Try a clearer title.",
 evaluationTargets: [],
 metadata: { outputRef: "output-1" },
 createdAt: 100,
 ...overrides,
})

describe("buildBrainAttributionChain", () => {
 it("joins recommendation, creator decision, execution, publication and outcome by explicit IDs", () => {
  const result = buildBrainAttributionChain({
   channelId: "channel-1",
   recommendationEventId: "recommendation-1",
   events: [
    event({}),
    event({ id: "decision-1", kind: "RECOMMENDATION_DECISION_RECORDED", sourceSystem: "decision", parentEventIds: ["recommendation-1"], recommendationId: "rec-1" }),
    event({ id: "execution-1", kind: "RECOMMENDATION_EXECUTED", sourceSystem: "workflow", parentEventIds: ["decision-1"], recommendationId: "rec-1", actionPacketId: "packet-1" }),
    event({ id: "publication-1", kind: "PUBLICATION_CONFIRMED", sourceSystem: "workflow", parentEventIds: ["execution-1"], recommendationId: "rec-1", actionPacketId: "packet-1", videoId: "video-1" }),
    event({ id: "outcome-1", kind: "OUTCOME_MEASURED", sourceSystem: "evaluation", parentEventIds: ["publication-1"], recommendationId: "rec-1", actionPacketId: "packet-1", videoId: "video-1" }),
    event({ id: "learning-1", kind: "LEARNING_CANDIDATE_CREATED", sourceSystem: "learning", parentEventIds: ["outcome-1"], recommendationId: "rec-1", actionPacketId: "packet-1", videoId: "video-1" }),
   ],
  })
  expect(result.status).toBe("complete")
  expect(result.recommendation.id).toBe("recommendation-1")
  expect(result.decisions.map(row => row.id)).toContain("decision-1")
  expect(result.executions.map(row => row.id)).toContain("execution-1")
  expect(result.publications.map(row => row.id)).toContain("publication-1")
  expect(result.outcomes.map(row => row.id)).toContain("outcome-1")
  expect(result.learningCandidates.map(row => row.id)).toContain("learning-1")
  expect(result.unresolvedStages).toEqual([])
 })

 it("does not infer links from timestamps or shared project scope alone", () => {
  const result = buildBrainAttributionChain({
   channelId: "channel-1",
   recommendationEventId: "recommendation-1",
   events: [
    event({}),
    event({ id: "unrelated-outcome", kind: "OUTCOME_MEASURED", sourceSystem: "evaluation", projectId: "project-1", createdAt: 101 }),
   ],
  })
  expect(result.outcomes).toEqual([])
  expect(result.status).toBe("incomplete")
  expect(result.unresolvedStages).toContain("execution")
  expect(result.unresolvedStages).toContain("publication")
  expect(result.unresolvedStages).toContain("outcome")
 })

 it("does not resolve recommendations from another channel", () => {
  expect(buildBrainAttributionChain({
   channelId: "channel-1",
   recommendationEventId: "recommendation-1",
   events: [event({ channelId: "channel-2" })],
  }).status).toBe("not_found")
 })
})
