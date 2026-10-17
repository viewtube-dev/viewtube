import { describe, expect, it } from "vitest"
import { buildAlgorithmEvaluationLifecycleIdentity, evaluateAlgorithmEvent } from "../AlgorithmEvaluationEngine"
import type { AlgorithmIntelligenceEvent } from "../AlgorithmIntelligenceEventLedger"
import type { MetricComparisonContext } from "../../analytics-canon"

const comparisonContext = (
 overrides: Partial<MetricComparisonContext> = {},
): MetricComparisonContext => ({
 metricKey: "ctr",
 unit: "percent",
 entityScope: "video",
 formatScope: "long",
 window: "28d",
 aggregation: "snapshot",
 coverage: 1,
 availability: "available",
 ...overrides,
})

const event = (overrides: Partial<AlgorithmIntelligenceEvent> = {}): AlgorithmIntelligenceEvent => ({
 id: "algorithm-event:test",
 channelId: "channel-1",
 kind: "RECOMMENDATION_EXECUTED",
 sourceSystem: "workflow",
 sourceId: "signal-1",
 parentEventIds: [],
 recommendationId: "recommendation-1",
 evidenceIds: [],
 confidence: "high",
 title: "Test recommendation",
 summary: "Test",
 evaluationTargets: [
  { metric: "ctr", direction: "increase", baselineValue: 0.04, minimumRelativeChange: 0.05, windowHours: 72 },
 ],
 checkpointAt: 1_000,
 metadata: {},
 createdAt: 0,
 ...overrides,
})

describe("AlgorithmEvaluationEngine", () => {
 it("keeps an evaluation pending before its checkpoint", () => {
  const result = evaluateAlgorithmEvent({
   event: event(),
   observations: [{ metric: "ctr", value: 0.05, observedAt: 500 }],
   now: 500,
  })
  expect(result.status).toBe("pending")
 })

 it("marks a recommendation positive when its measured target is met", () => {
  const result = evaluateAlgorithmEvent({
   event: event(),
   observations: [{ metric: "ctr", value: 0.045, observedAt: 2_000, evidenceId: "evidence-1" }],
   now: 2_000,
  })
  expect(result.status).toBe("positive")
  expect(result.targetResults[0].status).toBe("met")
  expect(result.evidenceIds).toContain("evidence-1")
 })

 it("marks a recommendation negative when its measured target is missed", () => {
  const result = evaluateAlgorithmEvent({
   event: event(),
   observations: [{ metric: "ctr", value: 0.039, observedAt: 2_000 }],
   now: 2_000,
  })
  expect(result.status).toBe("negative")
  expect(result.targetResults[0].status).toBe("missed")
 })

 it("rejects semantically incomparable baseline/current evidence before calculating an outcome", () => {
  const result = evaluateAlgorithmEvent({
   event: event({
    evaluationTargets: [{
     metric: "ctr",
     direction: "increase",
     baselineValue: 4,
     minimumRelativeChange: 0.05,
     baselineComparisonContext: comparisonContext({ window: "28d" }),
    }],
   }),
   observations: [{
    metric: "ctr",
    value: 5,
    observedAt: 2_000,
    evidenceId: "evidence-current",
    comparisonContext: comparisonContext({ window: "90d" }),
   }],
   now: 2_000,
  })

  expect(result.status).toBe("insufficient_data")
  expect(result.targetResults[0].status).toBe("unavailable")
  expect(result.targetResults[0].comparability?.comparable).toBe(false)
  expect(result.targetResults[0].comparability?.reasons).toContainEqual(
   expect.objectContaining({ code: "window_mismatch" }),
  )
 })

 it("allows comparable canonical baseline/current evidence to be evaluated normally", () => {
  const context = comparisonContext()
  const result = evaluateAlgorithmEvent({
   event: event({
    evaluationTargets: [{
     metric: "ctr",
     direction: "increase",
     baselineValue: 4,
     minimumRelativeChange: 0.05,
     baselineComparisonContext: context,
    }],
   }),
   observations: [{
    metric: "ctr",
    value: 5,
    observedAt: 2_000,
    evidenceId: "evidence-current",
    comparisonContext: context,
   }],
   now: 2_000,
  })

  expect(result.status).toBe("positive")
  expect(result.targetResults[0].status).toBe("met")
  expect(result.targetResults[0].comparability).toEqual({ comparable: true, reasons: [] })
 })

 it("returns insufficient data rather than inventing an outcome", () => {
  const result = evaluateAlgorithmEvent({ event: event(), observations: [], now: 2_000 })
  expect(result.status).toBe("insufficient_data")
  expect(result.confidence).toBe("low")
 })

 it("can report mixed outcomes across multiple targets", () => {
  const result = evaluateAlgorithmEvent({
   event: event({
    evaluationTargets: [
     { metric: "ctr", direction: "increase", baselineValue: 0.04, minimumRelativeChange: 0.05 },
     { metric: "watch_quality", direction: "hold", baselineValue: 0.60, minimumRelativeChange: 0.05 },
    ],
   }),
   observations: [
    { metric: "ctr", value: 0.05, observedAt: 2_000 },
    { metric: "watch_quality", value: 0.50, observedAt: 2_000 },
   ],
   now: 2_000,
  })
  expect(result.status).toBe("mixed")
 })
})


describe("AlgorithmEvaluationEngine lifecycle identity", () => {
 it("preserves exact publication, packet, approved snapshot, and metadata-version lineage", () => {
  const source = event({
   projectId: "project-1",
   videoId: "video-1",
   actionPacketId: "packet-1",
   metadata: {
    contentBuildId: "content-build-1",
    publicationTransactionId: "publish-1",
    approvedSnapshotId: "snapshot-1",
    metadataVersionIds: ["metadata-v2", "metadata-v1"],
    checkpointId: "checkpoint-1",
   },
  })
  expect(buildAlgorithmEvaluationLifecycleIdentity(source)).toEqual({
   recommendationId: "recommendation-1",
   projectId: "project-1",
   contentBuildId: "content-build-1",
   videoId: "video-1",
   actionPacketId: "packet-1",
   publicationTransactionId: "publish-1",
   approvedSnapshotId: "snapshot-1",
   metadataVersionIds: ["metadata-v2", "metadata-v1"],
   checkpointId: "checkpoint-1",
  })
 })

 it("does not invent missing lifecycle identities", () => {
  expect(buildAlgorithmEvaluationLifecycleIdentity(event())).toEqual({
   recommendationId: "recommendation-1",
   projectId: null,
   contentBuildId: null,
   videoId: null,
   actionPacketId: null,
   publicationTransactionId: null,
   approvedSnapshotId: null,
   metadataVersionIds: [],
   checkpointId: null,
  })
 })
})


describe("AlgorithmEvaluationEngine zero-baseline safeguards", () => {
 it("does not claim a relative-change outcome when the baseline is zero", () => {
  const result = evaluateAlgorithmEvent({
   event: event({
    evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 0, minimumRelativeChange: 0.1 }],
    checkpointAt: 1_000,
   }),
   observations: [{ metric: "views", value: 12, observedAt: 2_000, evidenceId: "views-current" }],
   now: 2_000,
  })

  expect(result.status).toBe("insufficient_data")
  expect(result.targetResults[0]).toMatchObject({
   status: "unavailable",
   baselineValue: 0,
   observedValue: 12,
   relativeChange: null,
  })
 })

 it("honors an explicit target value when the baseline is zero", () => {
  const result = evaluateAlgorithmEvent({
   event: event({
    evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 0, targetValue: 10 }],
    checkpointAt: 1_000,
   }),
   observations: [{ metric: "views", value: 12, observedAt: 2_000 }],
   now: 2_000,
  })

  expect(result.status).toBe("positive")
  expect(result.targetResults[0].status).toBe("met")
 })

 it("respects an explicitly supplied zero evaluation timestamp", () => {
  const result = evaluateAlgorithmEvent({
   event: event({ checkpointAt: 1 }),
   observations: [{ metric: "ctr", value: 0.05, observedAt: 0 }],
   now: 0,
  })

  expect(result.status).toBe("pending")
  expect(result.evaluatedAt).toBe(0)
 })
})
