import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AlgorithmIntelligenceEvent } from "../AlgorithmIntelligenceEventLedger";

const ledger = vi.hoisted(() => ({
 list: vi.fn(),
 record: vi.fn(),
}));

vi.mock("../AlgorithmIntelligenceEventLedger", () => ({
 listAlgorithmIntelligenceEvents: ledger.list,
 recordAlgorithmIntelligenceEvent: ledger.record,
}));

import { recordAlgorithmEvaluation } from "../AlgorithmEvaluationEngine";

const sourceEvent: AlgorithmIntelligenceEvent = {
 id: "recommendation:stable-42",
 channelId: "channel-1",
 projectId: "project-7",
 videoId: "video-9",
 kind: "RECOMMENDATION_CREATED",
 sourceSystem: "decision",
 sourceId: "recommendation-source-42",
 parentEventIds: ["opportunity:stable-41"],
 recommendationId: "recommendation-42",
 actionPacketId: "action-packet-42",
 workflowId: "workflow-42",
 evidenceIds: ["analytics:snapshot-4:videos:row-9"],
 confidence: "medium",
 title: "Improve packaging",
 summary: "Use measured evidence to refine the package.",
 evaluationTargets: [{
  metric: "views",
  direction: "increase",
  baselineValue: 100,
  targetValue: 120,
  baselineComparisonContext: null,
 }],
 metadata: {},
 createdAt: 1_000,
};

describe("algorithm outcome lineage contract", () => {
 beforeEach(() => {
  vi.clearAllMocks();
  ledger.list.mockReturnValue([sourceEvent]);
  ledger.record.mockImplementation((event) => ({ ...event, createdAt: 2_000 }));
 });

 it("records measured outcomes with stable identity and links to the source recommendation", () => {
  const observations = [{
   metric: "views",
   value: 125,
   observedAt: 2_000,
   evidenceId: "analytics:snapshot-5:videos:row-9",
  }];

  const first = recordAlgorithmEvaluation({ sourceEventId: sourceEvent.id, observations, now: 2_000 });
  const second = recordAlgorithmEvaluation({ sourceEventId: sourceEvent.id, observations, now: 3_000 });

  expect(first.recorded.id).toBe(`algorithm-outcome:${sourceEvent.id}`);
  expect(second.recorded.id).toBe(first.recorded.id);
  expect(ledger.record).toHaveBeenLastCalledWith(expect.objectContaining({
   id: `algorithm-outcome:${sourceEvent.id}`,
   kind: "OUTCOME_MEASURED",
   sourceSystem: "evaluation",
   sourceId: sourceEvent.id,
   parentEventIds: [sourceEvent.id],
   channelId: sourceEvent.channelId,
   projectId: sourceEvent.projectId,
   videoId: sourceEvent.videoId,
   recommendationId: sourceEvent.recommendationId,
   actionPacketId: sourceEvent.actionPacketId,
   workflowId: sourceEvent.workflowId,
   evidenceIds: ["analytics:snapshot-5:videos:row-9"],
  }));
  expect(first.evaluation.status).toBe("positive");
 });

 it("keeps missing observations unavailable instead of converting them to zero-valued outcomes", () => {
  const result = recordAlgorithmEvaluation({
   sourceEventId: sourceEvent.id,
   observations: [],
   now: 2_000,
  });

  expect(result.evaluation.status).toBe("insufficient_data");
  expect(result.evaluation.targetResults[0]).toMatchObject({
   status: "unavailable",
   baselineValue: 100,
   observedValue: null,
   relativeChange: null,
  });
  expect(ledger.record).toHaveBeenCalledWith(expect.objectContaining({
   kind: "OUTCOME_MEASURED",
   metadata: expect.objectContaining({
    evaluation: expect.objectContaining({ status: "insufficient_data" }),
   }),
  }));
 });
});
