import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => {
 const candidate = {
  id: "algorithm-learning:repackage",
  channelId: "channel-1",
  category: "algorithm_recommendation" as const,
  statement: "REPACKAGE has repeatedly improved measured outcomes.",
  confidence: "high" as const,
  sourceEventIds: ["outcome-1", "outcome-2", "outcome-3"],
  evidenceIds: ["evidence-1", "evidence-2"],
  operationIds: ["operation-1"],
  workflowIds: ["workflow-1"],
  traceIds: ["trace-1"],
  outputRefs: ["asset-1"],
  actionPacketIds: ["packet-1"],
  sampleSize: 3,
  positiveRate: 1,
  status: "candidate" as const,
 }
 const sourceEvent = { id: "candidate-event-1", parentEventIds: ["outcome-1", "outcome-2", "outcome-3"] }
 const review = {
  candidateId: candidate.id,
  decision: "approve_for_profile_review" as const,
  reviewedAt: 1000,
  eventId: "review-event-1",
 }
 return {
  candidate,
  sourceEvent,
  review,
  teachAIBrainExplicitly: vi.fn(async (_input?: any): Promise<any> => ({
   entry: { id: "brain-entry-1" },
   promotion: { allowed: true, claimId: "claim-1" },
  })),
  readBrainUserControls: vi.fn((_channelId?: string): any => ({ enabled: true, personalization: true, learnFromInteractions: true })),
  shouldBrainLearnFromInteraction: vi.fn((_controls?: any): boolean => true),
  listApprovedAlgorithmLearningCandidates: vi.fn((_channelId?: string): any[] => [{ candidate, sourceEvent, review }]),
  listAlgorithmIntelligenceEvents: vi.fn((_input?: any): any[] => []),
  recordAlgorithmIntelligenceEvent: vi.fn((input?: any): any => ({ id: input?.id || "promotion-event-1", ...input })),
  listBrainTraces: vi.fn((_channelId?: string): any[] => [{
   id: "trace-1",
   channelId: "channel-1",
   evidence: {
    returned: ["evidence-1", "evidence-2"],
    records: [
     { id: "evidence-1", owner: "analytics-canon", sourceRef: "analytics://snapshot/1", sourceSnapshotId: "snapshot-1", channelId: "channel-1", freshness: "fresh", epistemicState: "OBSERVED", provenance: { evidenceIds: ["source-1"] } },
     { id: "evidence-2", owner: "youtube-read", sourceRef: "youtube://video/2", sourceSnapshotId: "snapshot-2", channelId: "channel-1", freshness: "fresh", epistemicState: "KNOWN", provenance: { evidenceIds: ["source-2"] } },
    ],
   },
  }]),
 }
})

vi.mock("../../aiBrainSelfImprovement", () => ({
 teachAIBrainExplicitly: mocks.teachAIBrainExplicitly,
}))

vi.mock("../BrainUserControls", () => ({
 readBrainUserControls: mocks.readBrainUserControls,
 shouldBrainLearnFromInteraction: mocks.shouldBrainLearnFromInteraction,
}))

vi.mock("../AlgorithmLearningGovernance", () => ({
 listApprovedAlgorithmLearningCandidates: mocks.listApprovedAlgorithmLearningCandidates,
}))

vi.mock("../AlgorithmIntelligenceEventLedger", () => ({
 listAlgorithmIntelligenceEvents: mocks.listAlgorithmIntelligenceEvents,
 recordAlgorithmIntelligenceEvent: mocks.recordAlgorithmIntelligenceEvent,
}))

import { promoteApprovedAlgorithmLearningToProfile } from "../AlgorithmLearningProfilePromotion"

describe("AlgorithmLearningProfilePromotion", () => {
 beforeEach(() => {
  mocks.teachAIBrainExplicitly.mockClear()
  mocks.readBrainUserControls.mockClear()
  mocks.shouldBrainLearnFromInteraction.mockClear()
  mocks.listApprovedAlgorithmLearningCandidates.mockClear()
  mocks.recordAlgorithmIntelligenceEvent.mockClear()
  mocks.listAlgorithmIntelligenceEvents.mockReset()
  mocks.listAlgorithmIntelligenceEvents.mockReturnValue([])
  mocks.shouldBrainLearnFromInteraction.mockReturnValue(true)
  mocks.listApprovedAlgorithmLearningCandidates.mockReturnValue([
   { candidate: mocks.candidate, sourceEvent: mocks.sourceEvent, review: mocks.review },
  ])
  mocks.teachAIBrainExplicitly.mockResolvedValue({
   entry: { id: "brain-entry-1" },
   promotion: { allowed: true, claimId: "claim-1" },
  })
 })

 it("requires explicit creator approval even after governance approval", async () => {
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: false,
  })
  expect(result.status).toBe("creator_approval_required")
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
  expect(mocks.recordAlgorithmIntelligenceEvent).not.toHaveBeenCalled()
 })

 it("respects Brain learning controls", async () => {
  mocks.shouldBrainLearnFromInteraction.mockReturnValue(false)
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
  })
  expect(result.status).toBe("learning_disabled")
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
 })

 it("requires prior governance approval for Profile review", async () => {
  mocks.listApprovedAlgorithmLearningCandidates.mockReturnValue([])
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
  })
  expect(result.status).toBe("not_approved_for_profile_review")
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
 })

 it("rejects a candidate with missing evidence or incomplete source-event lineage", async () => {
  mocks.listApprovedAlgorithmLearningCandidates.mockReturnValue([{
   candidate: { ...mocks.candidate, evidenceIds: [] },
   sourceEvent: mocks.sourceEvent,
   review: mocks.review,
  }])
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
  })
  expect(result.status).toBe("invalid_candidate_evidence")
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
 })

 it("rejects a candidate whose persisted channel scope differs from the request", async () => {
  mocks.listApprovedAlgorithmLearningCandidates.mockReturnValue([{
   candidate: { ...mocks.candidate, channelId: "channel-foreign" },
   sourceEvent: mocks.sourceEvent,
   review: mocks.review,
  }])
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
  })
  expect(result.status).toBe("channel_scope_mismatch")
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
 })

 it("does not teach the same candidate twice after durable promotion", async () => {
  const priorPromotion = {
   id: `algorithm-learning-promoted:${mocks.candidate.id}`,
   channelId: "channel-1",
   kind: "LEARNING_PROMOTED",
   sourceId: mocks.candidate.id,
   metadata: { durableProfileMutation: true, promotion: { allowed: true, claimId: "existing-claim" } },
  }
  mocks.listAlgorithmIntelligenceEvents.mockReturnValue([priorPromotion])

  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
  })

  expect(result.status).toBe("already_promoted")
  expect(result.event).toBe(priorPromotion)
  expect(mocks.teachAIBrainExplicitly).not.toHaveBeenCalled()
  expect(mocks.recordAlgorithmIntelligenceEvent).not.toHaveBeenCalled()
 })

 it("reuses the existing Brain teaching path after both approvals", async () => {
  const result = await promoteApprovedAlgorithmLearningToProfile({
   channelId: "channel-1",
   candidateId: mocks.candidate.id,
   creatorApproved: true,
   note: "Keep using this pattern when the evidence conditions match.",
  })
  expect(result.status).toBe("promoted")
  expect(mocks.teachAIBrainExplicitly).toHaveBeenCalledWith(expect.objectContaining({
   channelId: "channel-1",
   summary: mocks.candidate.statement,
   category: "channel_fact",
   evidence: mocks.candidate.evidenceIds,
  }))
  expect(mocks.recordAlgorithmIntelligenceEvent).toHaveBeenCalledWith(expect.objectContaining({
   kind: "LEARNING_PROMOTED",
   sourceId: mocks.candidate.id,
   operationId: "operation-1",
   workflowId: "workflow-1",
   traceId: "trace-1",
   outputRef: "asset-1",
   actionPacketId: "packet-1",
   parentEventIds: expect.arrayContaining(["candidate-event-1", "review-event-1"]),
  }))
 })
})
