import { describe, expect, it } from "vitest"
import { buildBrainHealthSnapshot } from "../BrainHealthSnapshot"
import type { BrainEvidenceHealth } from "../BrainEvidenceContract"

const evidenceHealth: BrainEvidenceHealth = {
 version: "vt-brain-evidence-health-v1",
 scope: "exact",
 coverageRatio: 0.5,
 totalClaims: 4,
 usableClaims: 2,
 missingIds: ["missing-1"],
 staleIds: ["stale-1"],
 conflictingClaimKeys: ["views:24h"],
 scopeMismatchIds: [],
 confidence: "low",
 limitations: ["Only one window is available."],
}

describe("buildBrainHealthSnapshot", () => {
 it("summarizes evidence, knowledge and backlog without changing learning state", () => {
  const result = buildBrainHealthSnapshot({
   evidenceHealth,
   knowledgeRecords: [
    { id: "a", lifecycleState: "active", contradiction: false, knowledgeClass: "CREATOR_PREFERENCE" } as never,
    { id: "b", lifecycleState: "stale", contradiction: true, knowledgeClass: "HYPOTHESIS" } as never,
   ],
   evaluationBacklog: { due: 3, overdue: 1, unattributedOutcomes: 2 },
   learningCandidates: { pendingReview: 4, held: 1, rejected: 0 },
   generatedAt: "2026-10-15T00:00:00.000Z",
  })

  expect(result.status).toBe("attention")
  expect(result.evidence.missingCount).toBe(1)
  expect(result.knowledge.stale).toBe(1)
  expect(result.knowledge.contradictory).toBe(1)
  expect(result.evaluation.overdue).toBe(1)
  expect(result.learning.pendingReview).toBe(4)
  expect(result.alerts.length).toBeGreaterThan(0)
 })

 it("fails closed when evidence health is unavailable", () => {
  const result = buildBrainHealthSnapshot({
   evidenceHealth: null,
   knowledgeRecords: [],
   evaluationBacklog: { due: 0, overdue: 0, unattributedOutcomes: 0 },
   learningCandidates: { pendingReview: 0, held: 0, rejected: 0 },
  })
  expect(result.status).toBe("insufficient_data")
  expect(result.evidence.coverageRatio).toBeNull()
  expect(result.alerts[0]).toContain("Evidence health is unavailable")
 })
})
