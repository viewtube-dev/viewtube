import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("./viewTubeUserControls", () => ({
 evaluateViewTubeControl: () => ({ allowed: true }),
}))

import {
 createEvaluationRecord,
 listEvaluationRecords,
 proposeEvaluationLearningCandidate,
 listWorkflowCandidates,
 resolveEvaluationRecord,
} from "./viewTubeEvaluationLedger"

const store = new Map<string, string>()

beforeEach(() => {
 store.clear()
 vi.stubGlobal("window", {
  localStorage: {
   getItem: (key: string) => store.get(key) ?? null,
   setItem: (key: string, value: string) => { store.set(key, value) },
   removeItem: (key: string) => { store.delete(key) },
  },
 })
})

describe("outcome evaluation and governed learning lineage", () => {
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
