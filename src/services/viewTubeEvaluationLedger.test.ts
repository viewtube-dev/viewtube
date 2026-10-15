import { beforeEach, describe, expect, it, vi } from "vitest"

const lineageMocks = vi.hoisted(() => ({
 appendContentBuildEvent: vi.fn(),
 listContentBuildEvents: vi.fn(),
 listAssetOutcomes: vi.fn(),
 linkAssetOutcomeToPublication: vi.fn(),
 captureAIBrainLearningEvent: vi.fn(),
 promoteBrainClaim: vi.fn(),
 rebuildAffectedToolContextPacks: vi.fn(),
 readBrainUserControls: vi.fn(),
}))

vi.mock("./viewTubeUserControls", () => ({
 evaluateViewTubeControl: () => ({ allowed: true }),
}))

vi.mock("./asset-engine/ContentBuildRepository", () => ({
 appendContentBuildEvent: lineageMocks.appendContentBuildEvent,
 listContentBuildEvents: lineageMocks.listContentBuildEvents,
}))

vi.mock("./brain/assetOutcomes", () => ({
 listAssetOutcomes: lineageMocks.listAssetOutcomes,
 linkAssetOutcomeToPublication: lineageMocks.linkAssetOutcomeToPublication,
}))
vi.mock("./aiBrainSelfImprovement", () => ({ captureAIBrainLearningEvent: lineageMocks.captureAIBrainLearningEvent }))
vi.mock("./brain/BrainMemoryClaims", () => ({ promoteBrainClaim: lineageMocks.promoteBrainClaim, rebuildAffectedToolContextPacks: lineageMocks.rebuildAffectedToolContextPacks }))
vi.mock("./brain/BrainUserControls", () => ({ readBrainUserControls: lineageMocks.readBrainUserControls }))

vi.mock("./analytics-canon", () => ({
 getCurrentCanonicalIntelligenceEvidence: vi.fn(() => ({
  snapshotId: "snapshot-current",
  channelId: "channel-a",
  selectedWindow: "28d",
  datasets: [{ id: "videos", status: "available" }],
 })),
 getCurrentCanonicalIntelligenceDatasetRows: vi.fn(() => ({
  snapshotId: "snapshot-current",
  channelId: "channel-a",
  dataset: {
   snapshotId: "snapshot-current",
   channelId: "channel-a",
   rows: [{ videoId: "youtube-1", views: 120 }],
  },
 })),
}))


import {
 createEvaluationRecord,
 createPublicationEvaluationRecord,
 listEvaluationRecords,
 proposeEvaluationLearningCandidate,
 listWorkflowCandidates,
 resolveEvaluationRecord,
 reviewWorkflowCandidate,
 promoteEvaluationLearningCandidateToChannelKnowledge,
} from "./viewTubeEvaluationLedger"

const store = new Map<string, string>()

beforeEach(() => {
 store.clear()
 lineageMocks.appendContentBuildEvent.mockImplementation((input: Record<string, unknown>) => ({
  id: `event:${String(input.idempotencyKey || "checkpoint")}`,
  ...input,
 }))
 lineageMocks.listContentBuildEvents.mockReturnValue([{
  id: "publish-receipt-a",
  contentBuildId: "build-a",
  eventType: "youtube.state.changed",
  entityType: "publish-identity-receipt",
  entityId: "publish-a",
  metadata: {
   publishTransactionId: "publish-a",
   youtubeVideoId: "youtube-1",
   approvedSnapshotId: "approved-a",
   approvedSnapshotHash: "hash-a",
   channelId: "channel-a",
  },
 }])
 lineageMocks.listAssetOutcomes.mockReturnValue([{
  id: "outcome-a",
  assetId: "title-a",
  channelId: "channel-a",
  kind: "published",
  publishedVideoId: "youtube-1",
  publishTransactionId: "publish-a",
  traceId: "trace-a",
 }])
 lineageMocks.captureAIBrainLearningEvent.mockImplementation(async (input: Record<string, unknown>) => ({ id: "learning-promoted", channelId: input.channelId, category: input.category, source: input.source, summary: input.summary, detail: input.detail, evidence: input.evidence, confidence: input.confidence, status: "reflected", recurrenceCount: 5, metadata: input.metadata }))
 lineageMocks.promoteBrainClaim.mockResolvedValue({ claim: { id: "claim-promoted" }, decision: { decision: "promote" } })
 lineageMocks.rebuildAffectedToolContextPacks.mockResolvedValue(undefined)
 lineageMocks.readBrainUserControls.mockReturnValue({ enabled: true, personalization: true, learnFromInteractions: true })
 vi.stubGlobal("window", {
  localStorage: {
   getItem: (key: string) => store.get(key) ?? null,
   setItem: (key: string, value: string) => { store.set(key, value) },
   removeItem: (key: string) => { store.delete(key) },
  },
 })
})

describe("outcome evaluation and governed learning lineage", () => {
 it("joins a completed publication identity to its exact canonical video row and preserves lineage", () => {
  const record = createPublicationEvaluationRecord({
   publicationIdentity: {
    schemaVersion: 1,
    contentBuildId: "build-a",
    projectId: "project-a",
    projectAssociationStatus: "verified",
    videoPackageId: "package-a",
    publishTransactionId: "publish-a",
    youtubeVideoId: "youtube-1",
    channelId: "channel-a",
    approvedSnapshotId: "approved-a",
    approvedSnapshotHash: "hash-a",
    selectedVariantAssetIds: ["title-a", "thumb-a", "render-a"],
    correlationId: "publish-a",
    idempotencyKey: "publish:build-a:approved-a",
    publishedAt: "2026-10-15T10:00:00.000Z",
   },
   selectedWindow: "28d",
   source: "post-publication",
   recommendation: "Evaluate the published title variant",
   baselineSnapshotId: "snapshot-baseline",
   comparabilityStatus: "comparable",
   confounders: ["seasonality"],
  })
  expect(record).toMatchObject({
   channelId: "channel-a",
   projectId: "project-a",
   contentBuildId: "build-a",
   videoPackageId: "package-a",
   publishTransactionId: "publish-a",
   publishedVideoId: "youtube-1",
   approvedSnapshotId: "approved-a",
   approvedSnapshotHash: "hash-a",
   selectedVariantAssetIds: ["title-a", "thumb-a", "render-a"],
   baselineSnapshotId: "snapshot-baseline",
   comparisonSnapshotId: "snapshot-current",
   selectedWindow: "28d",
   evidenceIds: ["snapshot-current:videos:1"],
   sourceOutcomeIds: ["outcome-a"],
   sourceRecordIds: ["outcome-a", "publish-a"],
   traceIds: ["trace-a"],
   assetIds: ["title-a"],
   analyticsCheckpointIds: ["event:analytics-checkpoint:publish-a:snapshot-current:28d"],
   evidenceStatus: "available",
   comparabilityStatus: "comparable",
   outcome: "pending",
  })
 })

 it("does not attribute an outcome to a publication without an exact transaction match", () => {
  lineageMocks.listAssetOutcomes.mockReturnValue([{
   id: "unlinked-outcome",
   assetId: "title-a",
   channelId: "channel-a",
   kind: "published",
   publishedVideoId: "youtube-1",
   traceId: "trace-a",
  }])
  const record = createPublicationEvaluationRecord({
   publicationIdentity: {
    schemaVersion: 1,
    contentBuildId: "build-a",
    projectId: "project-a",
    projectAssociationStatus: "verified",
    videoPackageId: "package-a",
    publishTransactionId: "publish-a",
    youtubeVideoId: "youtube-1",
    channelId: "channel-a",
    approvedSnapshotId: "approved-a",
    approvedSnapshotHash: "hash-a",
    selectedVariantAssetIds: ["title-a", "thumb-a", "render-a"],
    correlationId: "publish-a",
    idempotencyKey: "publish:build-a:approved-a",
    publishedAt: "2026-10-15T10:00:00.000Z",
   },
   selectedWindow: "28d",
   source: "post-publication",
   recommendation: "Evaluate the published title variant",
  })
  expect(record?.sourceOutcomeIds).toEqual([])
  expect(record?.sourceRecordIds).toEqual(["publish-a"])
 })

 it("fails closed unless the immutable publication receipt exists in ContentBuild", () => {
  lineageMocks.listContentBuildEvents.mockReturnValue([])
  const record = createPublicationEvaluationRecord({
   publicationIdentity: {
    schemaVersion: 1,
    contentBuildId: "build-a",
    projectId: "project-a",
    projectAssociationStatus: "verified",
    videoPackageId: "package-a",
    publishTransactionId: "publish-a",
    youtubeVideoId: "youtube-1",
    channelId: "channel-a",
    approvedSnapshotId: "approved-a",
    approvedSnapshotHash: "hash-a",
    selectedVariantAssetIds: ["title-a", "thumb-a", "render-a"],
    correlationId: "publish-a",
    idempotencyKey: "publish:build-a:approved-a",
    publishedAt: "2026-10-15T10:00:00.000Z",
   },
   selectedWindow: "28d",
   source: "post-publication",
   recommendation: "Evaluate the published title variant",
  })
  expect(record).toBeNull()
  expect(lineageMocks.appendContentBuildEvent).not.toHaveBeenCalled()
 })

 it("keeps evaluation retries idempotent within channel and project scope", () => {
  const input = {
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Compare title change against baseline",
   evidenceIds: ["snapshot-a:videos:1"],
   idempotencyKey: "evaluation:publish-42:28d",
   selectedWindow: "28d",
   comparabilityStatus: "comparable" as const,
   evidenceStatus: "available" as const,
   sourceOutcomeIds: ["outcome-a"],
  }
  const first = createEvaluationRecord(input)
  const retry = createEvaluationRecord(input)
  expect(retry?.id).toBe(first?.id)
  expect(listEvaluationRecords()).toHaveLength(1)
 })

 it("requires a resolved, evidence-backed comparable evaluation before proposing learning", () => {
  const evaluation = createEvaluationRecord({
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate title variant B",
   evidenceIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
   sourceOutcomeIds: ["outcome-a"],
  })
  expect(evaluation).not.toBeNull()
  expect(proposeEvaluationLearningCandidate(evaluation!.id, {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Title decision effectiveness",
   toolIds: ["packaging-lab-pro"],
   reason: "Observed comparable outcome; review before any promotion.",
   scope: "channel",
  })).toBeNull()

  resolveEvaluationRecord(evaluation!.id, "positive", "CTR was higher in the comparison window.")
  const candidate = proposeEvaluationLearningCandidate(evaluation!.id, {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Title decision effectiveness",
   toolIds: ["packaging-lab-pro"],
   reason: "Observed comparable outcome; review before any promotion.",
   scope: "channel",
  })

  expect(candidate).toMatchObject({
   status: "candidate",
   evaluationRecordId: evaluation!.id,
   sourceOutcomeIds: ["outcome-a"],
   evidenceRecordIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
   evaluationOutcome: "positive",
  })
  expect(listWorkflowCandidates()).toHaveLength(1)
 })

 it("rejects a channel candidate when the source evaluation has no matching channel scope", () => {
  const evaluation = createEvaluationRecord({
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate title variant B",
   evidenceIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
  })
  resolveEvaluationRecord(evaluation!.id, "positive")
  expect(proposeEvaluationLearningCandidate(evaluation!.id, {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Must remain unscoped",
   toolIds: [],
   reason: "A missing channel identity must not be inferred.",
   scope: "channel",
  })).toBeNull()
  expect(listWorkflowCandidates()).toHaveLength(0)
 })

 it("deduplicates candidate retries by idempotency key within the source evaluation scope", () => {
  const evaluation = createEvaluationRecord({
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate title variant B",
   evidenceIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
   sourceOutcomeIds: ["outcome-a"],
  })
  resolveEvaluationRecord(evaluation!.id, "positive")
  const input = {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Review title decision",
   toolIds: ["packaging-lab-pro"],
   reason: "Review comparable evidence before promotion.",
   scope: "channel" as const,
   idempotencyKey: "candidate:evaluation-1:channel-a",
  }
  const first = proposeEvaluationLearningCandidate(evaluation!.id, input)
  const retry = proposeEvaluationLearningCandidate(evaluation!.id, input)
  expect(retry?.id).toBe(first?.id)
  expect(listWorkflowCandidates()).toHaveLength(1)
 })

 it("preserves publication and analytics checkpoint lineage through evaluation", () => {
  const evaluation = createEvaluationRecord({
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate selected title variant",
   evidenceIds: ["snapshot-a:videos:1"],
   sourceOutcomeIds: ["outcome-a"],
   sourceRecordIds: ["asset-outcome-a"],
   traceIds: ["trace-a"],
   assetIds: ["asset-a"],
   contentBuildId: "build-a",
   publishTransactionId: "publish-a",
   publishedVideoId: "video-a",
   approvedSnapshotId: "approved-a",
   approvedSnapshotHash: "sha256:approved-a",
   analyticsCheckpointIds: ["checkpoint-a"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
  })
  expect(evaluation).toMatchObject({
   contentBuildId: "build-a",
   publishTransactionId: "publish-a",
   publishedVideoId: "video-a",
   approvedSnapshotId: "approved-a",
   approvedSnapshotHash: "sha256:approved-a",
   analyticsCheckpointIds: ["checkpoint-a"],
   sourceOutcomeIds: ["outcome-a"],
   evidenceIds: ["snapshot-a:videos:1"],
  })
 })

 it("deduplicates learning candidates by scoped idempotency key", () => {
  const evaluation = createEvaluationRecord({
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate selected title variant",
   evidenceIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "comparable",
   evidenceStatus: "available",
  })
  resolveEvaluationRecord(evaluation!.id, "positive")
  const input = {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Review title outcome",
   toolIds: ["packaging-lab-pro"],
   reason: "Comparable evidence is available for review.",
   scope: "channel" as const,
   idempotencyKey: "candidate-evaluation-a",
  }
  const first = proposeEvaluationLearningCandidate(evaluation!.id, input)
  const retry = proposeEvaluationLearningCandidate(evaluation!.id, input)
  expect(retry?.id).toBe(first?.id)
  expect(listWorkflowCandidates()).toHaveLength(1)
 })

 it("requires a named creator reviewer before approving a candidate", () => {
  const evaluation = createEvaluationRecord({ channelId: "channel-a", projectId: "project-a", source: "post-publication", recommendation: "Evaluate title variant B", evidenceIds: ["snapshot-a:videos:1"], selectedWindow: "28d", comparabilityStatus: "comparable", evidenceStatus: "available" })
  resolveEvaluationRecord(evaluation!.id, "positive")
  const candidate = proposeEvaluationLearningCandidate(evaluation!.id, { channelId: "channel-a", projectId: "project-a", title: "Title decision", toolIds: ["packaging-lab-pro"], reason: "Evidence-backed decision.", scope: "channel" })
  expect(reviewWorkflowCandidate(candidate!.id, "approved")).toBeNull()
  expect(listWorkflowCandidates()[0].status).toBe("candidate")
 })

 it("promotes only after five independent comparable positive publication evaluations and explicit review", async () => {
  const evaluationIds: string[] = []
  for (let index = 1; index <= 5; index += 1) {
   const evaluation = createEvaluationRecord({ channelId: "channel-a", projectId: "project-a", source: "post-publication", recommendation: "Use the selected title strategy", evidenceIds: [`snapshot-${index}:videos:1`], publishedVideoId: `youtube-${index}`, comparisonSnapshotId: `snapshot-${index}`, selectedWindow: "28d", comparabilityStatus: "comparable", evidenceStatus: "available", causalAssessment: "observed_association" })
   evaluationIds.push(evaluation!.id)
   resolveEvaluationRecord(evaluation!.id, "positive")
  }
  const candidate = proposeEvaluationLearningCandidate(evaluationIds[0], { channelId: "channel-a", projectId: "project-a", title: "Selected title strategy", toolIds: ["packaging-lab-pro"], reason: "Repeated positive outcomes in comparable windows; descriptive association only.", scope: "channel", idempotencyKey: "candidate:title-strategy" })!
  expect(await promoteEvaluationLearningCandidateToChannelKnowledge({ candidateId: candidate.id, reviewedBy: "creator-1" })).toBeNull()
  expect(reviewWorkflowCandidate(candidate.id, "approved", "creator-1")?.status).toBe("approved")
  const result = await promoteEvaluationLearningCandidateToChannelKnowledge({ candidateId: candidate.id, reviewedBy: "creator-1" })
  expect(result).toMatchObject({ claim: { id: "claim-promoted" }, candidate: { promotedClaimId: "claim-promoted" } })
  expect(lineageMocks.captureAIBrainLearningEvent).toHaveBeenCalledWith(expect.objectContaining({ channelId: "channel-a", category: "analytics_insight", confidence: "high", evidence: expect.arrayContaining(["snapshot-1:videos:1", "snapshot-5:videos:1"]), metadata: expect.objectContaining({ creatorInitiated: true, confirmed: true, reviewedBy: "creator-1", evaluationRecordIds: expect.arrayContaining(evaluationIds), causalConclusion: null }) }))
  expect(lineageMocks.promoteBrainClaim).toHaveBeenCalled()
  expect(lineageMocks.rebuildAffectedToolContextPacks).toHaveBeenCalledWith(expect.objectContaining({ channelId: "channel-a", affectedContextPacks: ["performance", "analytics_tools"] }))
 })

 it("fails closed for non-comparable or cross-channel learning candidates", () => {
  const evaluation = createEvaluationRecord({
   channelId: "channel-a",
   projectId: "project-a",
   source: "post-publication",
   recommendation: "Evaluate title variant B",
   evidenceIds: ["snapshot-a:videos:1"],
   selectedWindow: "28d",
   comparabilityStatus: "not_comparable",
   evidenceStatus: "available",
  })
  resolveEvaluationRecord(evaluation!.id, "positive")
  expect(proposeEvaluationLearningCandidate(evaluation!.id, {
   channelId: "channel-a",
   projectId: "project-a",
   title: "Unsafe causal claim",
   toolIds: [],
   reason: "Must not be promoted from incompatible windows.",
   scope: "channel",
  })).toBeNull()
  expect(proposeEvaluationLearningCandidate(evaluation!.id, {
   channelId: "channel-b",
   projectId: "project-b",
   title: "Cross-channel candidate",
   toolIds: [],
   reason: "Wrong scope.",
   scope: "channel",
  })).toBeNull()
  expect(listWorkflowCandidates()).toHaveLength(0)
 })
})
