import { describe, expect, it } from "vitest"
import { projectEvidenceRecordToBrainClaim } from "../BrainEvidenceContract"
import type { EvidenceRecord } from "../EvidenceRecord"

const record = (epistemicState: EvidenceRecord["epistemicState"], value: EvidenceRecord["value"] = 12): EvidenceRecord => ({
 id: `evidence-${epistemicState}`,
 owner: "analytics-canon",
 sourceRef: "channel_summary",
 channelId: "channel-1",
 metric: "views",
 value,
 freshness: "fresh",
 epistemicState,
 provenance: { evidenceIds: ["source-1"] },
})

describe("shared evidence epistemic contract", () => {
 it.each([
  ["KNOWN", "KNOWN"],
  ["OBSERVED", "OBSERVED"],
  ["CALCULATED", "CALCULATED"],
  ["USER_PROVIDED", "USER_PROVIDED"],
  ["INFERRED", "INFERRED"],
  ["HYPOTHESIS", "HYPOTHESIS"],
  ["ESTIMATE", "ESTIMATE"],
  ["STALE", "STALE"],
  ["MISSING", "MISSING"],
  ["CONFLICTING", "CONFLICTING"],
 ] as const)("preserves %s as the canonical claim state", (input, expected) => {
  const claim = projectEvidenceRecordToBrainClaim(record(input))
  expect(claim.epistemicState).toBe(expected)
 })

 it("never exposes a value for missing evidence", () => {
  expect(projectEvidenceRecordToBrainClaim(record("MISSING", 0)).value).toBeNull()
 })

 it("lets explicit stale freshness override a current epistemic label", () => {
  expect(projectEvidenceRecordToBrainClaim({
   ...record("OBSERVED"),
   freshness: "STALE",
  }).epistemicState).toBe("STALE")
 })
})
