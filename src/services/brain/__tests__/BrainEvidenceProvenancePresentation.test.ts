import { describe, expect, it } from "vitest"
import { buildEvidenceProvenanceChips } from "../BrainOrchestrator"
import type { EvidenceIntelligenceEnvelope } from "../EvidenceIntelligenceResolver"

const makeEvidence = (overrides: Record<string, unknown> = {}) => ({
 evidenceQuality: {
  scopeMatch: "exact",
  selectedWindow: "28d",
  confidence: "high",
  coverageRatio: 0.9,
  sourceSnapshotId: "snapshot-123456789",
  freshness: { staleDatasetIds: ["old-dataset"] },
  missingness: {
   unavailableDatasetIds: ["search-terms"],
   failedDatasetIds: [],
   omittedDatasetIds: [],
  },
  limitations: ["Some search evidence is unavailable."],
 },
 evidenceClaims: [{
  claim: "views",
  value: 1234,
  unit: "views",
  epistemicState: "OBSERVED",
  freshness: "fresh",
  sourceOwner: "analytics-canon",
  timeframe: { kind: "28d", start: "2026-09-01", end: "2026-09-28" },
 }],
 ...overrides,
}) as unknown as EvidenceIntelligenceEnvelope

describe("Brain evidence provenance presentation", () => {
 it("summarizes canonical scope, reporting window, confidence and snapshot", () => {
  const chips = buildEvidenceProvenanceChips(makeEvidence())
  expect(chips[0]).toContain("scope: exact")
  expect(chips[0]).toContain("window: 28d")
  expect(chips[1]).toContain("snapshot: snapshot")
 })

 it("shows source, epistemic state, freshness, timeframe and missing-data caveats", () => {
  const chips = buildEvidenceProvenanceChips(makeEvidence())
  expect(chips.some((chip) => chip.includes("analytics-canon"))).toBe(true)
  expect(chips.some((chip) => chip.includes("OBSERVED".toLowerCase()))).toBe(true)
  expect(chips.some((chip) => chip.includes("Stale datasets: 1"))).toBe(true)
  expect(chips.some((chip) => chip.includes("missing is not zero"))).toBe(true)
  expect(chips.some((chip) => chip.includes("Some search evidence is unavailable."))).toBe(true)
 })

 it("returns no canonical analytics provenance for non-analytics turns", () => {
  expect(buildEvidenceProvenanceChips(null)).toEqual([])
 })

 it("bounds the amount of provenance shown to the creator", () => {
  const evidence = makeEvidence({
   evidenceClaims: Array.from({ length: 20 }, (_, index) => ({
    claim: `metric-${index}`, value: index, unit: null, epistemicState: "OBSERVED",
    freshness: "fresh", sourceOwner: "analytics-canon", timeframe: null,
   })),
  })
  expect(buildEvidenceProvenanceChips(evidence).length).toBeLessThanOrEqual(8)
 })
})
