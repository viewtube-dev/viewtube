import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
 listAlgorithmIntelligenceEvents: vi.fn((_input?: any): any[] => []),
 recordAlgorithmIntelligenceEvent: vi.fn((input?: any): any => ({ id: input?.id || "recorded-event", ...input })),
}))

vi.mock("../AlgorithmIntelligenceEventLedger", () => ({
 listAlgorithmIntelligenceEvents: mocks.listAlgorithmIntelligenceEvents,
 recordAlgorithmIntelligenceEvent: mocks.recordAlgorithmIntelligenceEvent,
}))

import { deriveAlgorithmLearningCandidates, recordAlgorithmLearningCandidates } from "../AlgorithmLearningCandidates"

const evaluations = (identities: Array<{
 operationId: string
 workflowId: string
 traceId: string
 outputRef: string
 actionPacketId: string
}>) => identities.map((identity, index) => ({
 id: `evaluation-${index + 1}`,
 channelId: "channel-1",
 kind: "OUTCOME_MEASURED",
 sourceSystem: "evaluation",
 sourceId: "recommendation-1",
 recommendationId: "recommendation-1",
 parentEventIds: [`recommendation-event-${index + 1}`],
 evidenceIds: [`evidence-${index + 1}`],
 confidence: "high",
 title: "Measured outcome",
 summary: "Positive outcome",
 evaluationTargets: [],
 metadata: { evaluation: { status: "positive" } },
 createdAt: index + 1,
 ...identity,
}))

describe("Algorithm learning candidate lineage", () => {
 beforeEach(() => {
  mocks.listAlgorithmIntelligenceEvents.mockReset()
  mocks.recordAlgorithmIntelligenceEvent.mockReset()
  mocks.recordAlgorithmIntelligenceEvent.mockImplementation((input?: any): any => ({
   id: input?.id || "recorded-event",
   ...input,
  }))
 })

 it("carries a shared lifecycle identity onto the candidate event", () => {
  mocks.listAlgorithmIntelligenceEvents.mockReturnValue(evaluations([
   { operationId: "operation-1", workflowId: "workflow-1", traceId: "trace-1", outputRef: "asset-1", actionPacketId: "packet-1" },
   { operationId: "operation-1", workflowId: "workflow-1", traceId: "trace-1", outputRef: "asset-1", actionPacketId: "packet-1" },
   { operationId: "operation-1", workflowId: "workflow-1", traceId: "trace-1", outputRef: "asset-1", actionPacketId: "packet-1" },
  ]) as any)

  const candidate = deriveAlgorithmLearningCandidates("channel-1")[0]
  expect(candidate).toMatchObject({
   operationIds: ["operation-1"],
   workflowIds: ["workflow-1"],
   traceIds: ["trace-1"],
   outputRefs: ["asset-1"],
   actionPacketIds: ["packet-1"],
   status: "candidate",
  })

  recordAlgorithmLearningCandidates("channel-1")
  expect(mocks.recordAlgorithmIntelligenceEvent).toHaveBeenCalledWith(expect.objectContaining({
   kind: "LEARNING_CANDIDATE_CREATED",
   operationId: "operation-1",
   workflowId: "workflow-1",
   traceId: "trace-1",
   outputRef: "asset-1",
   actionPacketId: "packet-1",
   parentEventIds: ["evaluation-1", "evaluation-2", "evaluation-3"],
   metadata: { candidate: expect.objectContaining({
    operationIds: ["operation-1"],
    workflowIds: ["workflow-1"],
    traceIds: ["trace-1"],
    outputRefs: ["asset-1"],
    actionPacketIds: ["packet-1"],
   }) },
  }))
 })

 it("does not invent a single identity when measured samples span multiple operations", () => {
  mocks.listAlgorithmIntelligenceEvents.mockReturnValue(evaluations([
   { operationId: "operation-1", workflowId: "workflow-1", traceId: "trace-1", outputRef: "asset-1", actionPacketId: "packet-1" },
   { operationId: "operation-2", workflowId: "workflow-2", traceId: "trace-2", outputRef: "asset-2", actionPacketId: "packet-2" },
   { operationId: "operation-3", workflowId: "workflow-3", traceId: "trace-3", outputRef: "asset-3", actionPacketId: "packet-3" },
  ]) as any)

  recordAlgorithmLearningCandidates("channel-1")
  expect(mocks.recordAlgorithmIntelligenceEvent).toHaveBeenCalledWith(expect.objectContaining({
   operationId: null,
   workflowId: null,
   traceId: null,
   outputRef: null,
   actionPacketId: null,
   metadata: { candidate: expect.objectContaining({
    operationIds: ["operation-1", "operation-2", "operation-3"],
    workflowIds: ["workflow-1", "workflow-2", "workflow-3"],
    traceIds: ["trace-1", "trace-2", "trace-3"],
    outputRefs: ["asset-1", "asset-2", "asset-3"],
    actionPacketIds: ["packet-1", "packet-2", "packet-3"],
   }) },
  }))
 })
})
