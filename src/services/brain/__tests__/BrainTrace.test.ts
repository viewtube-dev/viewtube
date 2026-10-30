import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
 beginBrainTrace,
 resetBrainTraceSink,
 setBrainTraceSink,
 type BrainTrace,
} from "../BrainTrace"

const collectSink = () => {
 const written: BrainTrace[] = []
 return {
  written,
  sink: {
   write: (trace: BrainTrace) => { written.push(trace) },
   list: () => written,
  },
 }
}

let collector = collectSink()

beforeEach(() => {
 collector = collectSink()
 setBrainTraceSink(collector.sink)
})

afterEach(() => {
 resetBrainTraceSink()
 vi.useRealTimers()
})

describe("beginBrainTrace", () => {
 it("does not write to the sink until completed", () => {
  const trace = beginBrainTrace({ kind: "asset", channelId: "channel-1" })
  trace.recordGrade("grounding", 90)
  expect(collector.written).toHaveLength(0)
  trace.complete()
  expect(collector.written).toHaveLength(1)
 })

 it("starts in a running state and completes with latency", () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-09-12T00:00:00Z"))
  const trace = beginBrainTrace({ kind: "question", channelId: "channel-1" })
  expect(trace.snapshot().status).toBe("running")
  vi.advanceTimersByTime(1_250)
  const finished = trace.complete()
  expect(finished.status).toBe("complete")
  expect(finished.latencyMs).toBe(1_250)
  expect(finished.completedAt).toBe("2026-09-12T00:00:01.250Z")
 })

 it("accumulates the full decision record of one operation", () => {
  const trace = beginBrainTrace({
   kind: "asset",
   channelId: "channel-1",
   assetType: "community_post",
  })
  trace.setIntent({ intent: "content_generation", taskProfileId: "asset-draft" })
  trace.recordCapabilities(["content-generation", "channel-profile"])
  trace.recordCapabilities(["channel-profile"]) // deduplicates
  trace.recordEvidence({
   requested: ["top_videos", "community_history"],
   returned: ["dataset:top_videos:snap-1"],
   missing: ["community_history"],
  })
  trace.recordContext({ tokensEstimated: 4_200, sectionsIncluded: ["style", "evidence"] })
  trace.recordModel({
   capability: "text",
   requested: "gemini-3.1-pro",
   served: "gemini-3.1-flash-lite",
   substituted: true,
   reason: "capability_policy_override",
  })
  trace.recordPromptVersion("constitution", "v1")
  trace.recordPromptVersion("community_post", "v3")
  trace.recordClaims({ fabricated: [], unverifiedDerived: ["34%"] })
  trace.recordStyle({ styleProfileId: "style-1", styleScore: 78 })
  trace.recordGrade("grounding", 100)
  trace.recordGrade("styleFidelity", 78)
  trace.recordRepairAttempt()

  const finished = trace.complete({ outputRef: "asset_9f2" })

  expect(finished.assetType).toBe("community_post")
  expect(finished.capabilitiesInvoked).toEqual(["content-generation", "channel-profile"])
  expect(finished.evidence.missing).toEqual(["community_history"])
  expect(finished.context.tokensEstimated).toBe(4_200)
  // The substitution is preserved, so a later quality comparison is attributable.
  expect(finished.model?.served).toBe("gemini-3.1-flash-lite")
  expect(finished.model?.substituted).toBe(true)
  expect(finished.promptVersions).toEqual({ constitution: "v1", community_post: "v3" })
  expect(finished.claims.unverifiedDerived).toEqual(["34%"])
  expect(finished.styleScore).toBe(78)
  expect(finished.grades).toEqual({ grounding: 100, styleFidelity: 78 })
  expect(finished.repairAttempts).toBe(1)
  // outputRef is what lets an outcome be joined back to this generation.
  expect(finished.outputRef).toBe("asset_9f2")
 })


 it("retains typed evidence records alongside legacy evidence refs", () => {
  const record = {
   id: "analytics:snapshot-1:channel_summary:views",
   owner: "analytics-canon" as const,
   sourceRef: "channel_summary",
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   metric: "views",
   value: 2800,
   unit: "count" as const,
   observedAt: "2026-09-27T16:00:00.000Z",
   updatedAt: "2026-10-19T00:00:00.000Z",
   freshness: "stale" as const,
   epistemicState: "OBSERVED" as const,
   confidence: 0.8,
   provenance: { evidenceIds: ["source-evidence-1"], sourceRoute: "/analytics", sourceVersion: "canon-v1" },
  }
  const trace = beginBrainTrace({ kind: "question", channelId: "channel-1" })
  trace.recordEvidence({
   requested: ["channel_summary"],
   returned: [record.id],
   missing: [],
   records: [record],
  })

  const finished = trace.complete()

  expect(finished.evidence.records).toEqual([record])
  expect(finished.evidence.returned).toContain(record.id)
 })

 it("preserves shared operation and workflow identity when supplied by the caller", () => {
  const trace = beginBrainTrace({
   kind: "asset",
   channelId: "channel-1",
   operationId: "operation-1",
   workflowId: "workflow-1",
  })
  expect(trace.snapshot().operationId).toBe("operation-1")
  expect(trace.snapshot().workflowId).toBe("workflow-1")
  const finished = trace.complete({ outputRef: "asset-1" })
  expect(finished.operationId).toBe("operation-1")
  expect(finished.workflowId).toBe("workflow-1")
 })

 it("records a failure with its reason", () => {
  const trace = beginBrainTrace({ kind: "asset", channelId: null })
  const finished = trace.complete({ status: "failed", failureReason: "provider_error" })
  expect(finished.status).toBe("failed")
  expect(finished.failureReason).toBe("provider_error")
  expect(finished.channelId).toBeNull()
 })


 it("records provider identity separately from requested and served model names", () => {
  const trace = beginBrainTrace({ kind: "question", channelId: "channel-1" })
  trace.recordModelIdentity({
   provider: "google-genai",
   requested: "gemini-3.1-pro",
   served: "gemini-3.1-flash-lite",
   status: "served_known",
  })
  expect(trace.snapshot()).toMatchObject({
   modelProvider: "google-genai",
   modelRequested: "gemini-3.1-pro",
   modelServed: "gemini-3.1-flash-lite",
   modelIdentityStatus: "served_known",
  })
 })

 it("records requested-versus-served model identity without claiming an unknown served model", () => {
  const trace = beginBrainTrace({ kind: "question", channelId: "channel-1" })
  trace.recordModelIdentity({
   requested: "gemini-requested",
   served: null,
   status: "requested_known_served_not_exposed",
  })
  expect(trace.snapshot()).toMatchObject({
   modelRequested: "gemini-requested",
   modelServed: null,
   modelIdentityStatus: "requested_known_served_not_exposed",
  })
  const finished = trace.complete()
  expect(finished.modelRequested).toBe("gemini-requested")
  expect(finished.modelServed).toBeNull()
  expect(finished.modelIdentityStatus).toBe("requested_known_served_not_exposed")
 })

 it("gives every trace a distinct id", () => {
  const ids = new Set(
   Array.from({ length: 25 }, () => beginBrainTrace({ kind: "question" }).id),
  )
  expect(ids.size).toBe(25)
 })

 it("snapshot does not expose mutable internal state", () => {
  const trace = beginBrainTrace({ kind: "question" })
  const snapshot = trace.snapshot()
  snapshot.status = "failed"
  expect(trace.snapshot().status).toBe("running")
 })
})
