// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { listDueAlgorithmEvaluations } from "./BrainEvaluationLoop"
import { recordAlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

const STORAGE_KEY = "vt_algorithm_intelligence_events_v1"

describe("BrainEvaluationLoop checkpoint boundaries", () => {
 beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY)
 })

 it("includes an evaluation scheduled exactly at timestamp zero", () => {
  const event = recordAlgorithmIntelligenceEvent({
   id: "algorithm-event:zero-checkpoint",
   channelId: "channel-zero",
   kind: "RECOMMENDATION_EXECUTED",
   sourceSystem: "workflow",
   sourceId: "recommendation-zero",
   title: "Zero checkpoint",
   summary: "Boundary regression test",
   confidence: "high",
   checkpointAt: 0,
   evaluationTargets: [{ metric: "views", direction: "increase", targetValue: 1 }],
  })

  const due = listDueAlgorithmEvaluations({ channelId: event.channelId, now: 0 })

  expect(due).toHaveLength(1)
  expect(due[0]).toMatchObject({
   event: { id: event.id },
   dueAt: 0,
   overdueByMs: 0,
   requiredMetrics: ["views"],
  })
 })
})
