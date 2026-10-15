import { describe, expect, it } from "vitest"
import type { EvidenceRecord } from "./EvidenceRecord"
import {
 assessBrainEvidenceScope,
 projectEvidenceRecordToBrainClaim,
 summarizeBrainEvidenceHealth,
} from "./BrainEvidenceContract"

const record = (overrides: Partial<EvidenceRecord> = {}): EvidenceRecord => ({
 id: "evidence-1",
 owner: "analytics-canon",
 sourceRef: "videos",
 sourceSnapshotId: "snapshot-1",
 channelId: "channel-1",
 metric: "views",
 value: 42,
 unit: "count",
 window: { kind: "28d", start: "2026-09-01", end: "2026-09-28" },
 freshness: "fresh",
 epistemicState: "observed",
 confidence: 1,
 provenance: { evidenceIds: ["source-row-1"], sourceRoute: "/analytics", sourceVersion: "v1" },
 ...overrides,
})

describe("Brain evidence contract", () => {
 it("projects canonical provenance and scope without replacing the source record", () => {
  const source = record()
  const claim = projectEvidenceRecordToBrainClaim(source)
  expect(claim).toMatchObject({
   id: "evidence-1",
   sourceOwner: "analytics-canon",
   sourceId: "videos",
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   metric: "views",
   value: 42,
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["source-row-1"], sourceRoute: "/analytics" },
  })
  expect(source.value).toBe(42)
 })

 it("keeps missing evidence null instead of converting it to zero", () => {
  const claim = projectEvidenceRecordToBrainClaim(record({
   id: "missing-views",
   value: 0,
   epistemicState: "missing",
   confidence: 0,
   freshness: "unknown",
  }))
  expect(claim.epistemicState).toBe("MISSING")
  expect(claim.value).toBeNull()
  const health = summarizeBrainEvidenceHealth([claim], { channelId: "channel-1" })
  expect(health.missingIds).toContain("missing-views")
  expect(health.usableClaims).toBe(0)
 })

 it("fails closed on channel and project scope mismatches", () => {
  const claim = projectEvidenceRecordToBrainClaim(record({ projectId: "project-a" }))
  expect(assessBrainEvidenceScope(claim, { channelId: "channel-1", projectId: "project-b" })).toBe("mismatch")
  const health = summarizeBrainEvidenceHealth([claim], { channelId: "channel-1", projectId: "project-b" })
  expect(health.scopeMismatchIds).toContain("evidence-1")
  expect(health.confidence).toBe("insufficient")
 })

 it("reports stale evidence and conflicting same-scope values explicitly", () => {
  const stale = projectEvidenceRecordToBrainClaim(record({
   id: "stale-views",
   value: 42,
   freshness: "stale",
   epistemicState: "stale",
  }))
  const current = projectEvidenceRecordToBrainClaim(record({ id: "current-views", value: 90 }))
  const health = summarizeBrainEvidenceHealth([stale, current], { channelId: "channel-1" })
  expect(health.staleIds).toContain("stale-views")
  expect(health.conflictingClaimKeys.length).toBeGreaterThan(0)
  expect(health.limitations).toContain("Stale evidence must not be represented as current.")
 })
})
