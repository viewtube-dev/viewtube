import { describe, expect, it } from "vitest"
import type { CanonicalIntelligenceEvidenceBundle } from "../../analytics-canon"
import {
 compareEvidenceRecords,
 EVIDENCE_EPISTEMIC_STATES,
 formatEvidenceRecordForPrompt,
 projectCanonicalEvidenceRecords,
 selectEvidenceRecordsForPrompt,
 type EvidenceRecord,
} from "../EvidenceRecord"
import { buildBrainEvidenceRecordQuality } from "../BrainEvidenceQuality"

const bundle: CanonicalIntelligenceEvidenceBundle = {
 version: "vt-intelligence-evidence-v1",
 snapshotId: "snapshot-1",
 channelId: "channel-1",
 channelName: "Channel",
 capturedAt: "2026-09-27T16:00:00.000Z",
 selectedWindow: "28d",
 generatedAt: "2026-09-27T16:00:01.000Z",
 coverage: {
  total: 1,
  available: 1,
  partial: 0,
  stale: 0,
  failed: 0,
  unavailable: 0,
  represented: 1,
 },
 datasets: [{
  id: "channel_summary",
  label: "Channel summary",
  description: "Canonical channel totals.",
  categoryIds: ["channel"],
  status: "available",
  rowCount: 1,
  updatedAt: "2026-09-27T15:00:00.000Z",
  sources: ["youtube_analytics_v2"],
  missingMetrics: [],
  columns: [],
  evidenceRefs: ["evidence:channel-summary"],
  metrics: {
   views: {
    count: 1,
    sum: 2800,
    average: 2800,
    minimum: 2800,
    maximum: 2800,
   },
  },
  sampleRows: [],
 }],
 requestedSectionIds: ["channel-pulse"],
 omittedDatasetIds: [],
 contextText: "",
}

describe("EvidenceRecord", () => {
 it("defines one canonical ten-state epistemic vocabulary", () => {
  expect(EVIDENCE_EPISTEMIC_STATES).toEqual([
   "KNOWN", "OBSERVED", "CALCULATED", "USER_PROVIDED", "INFERRED",
   "HYPOTHESIS", "ESTIMATE", "STALE", "MISSING", "CONFLICTING",
  ])
 })

 it("projects canonical analytics metrics without changing their source owner or provenance", () => {
  const records = projectCanonicalEvidenceRecords(bundle)

  expect(records).toHaveLength(1)
  expect(records[0]).toMatchObject({
   owner: "analytics-canon",
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   datasetId: "channel_summary",
   metric: "views",
   value: 2800,
   aggregation: "sum",
   freshness: "fresh",
   epistemicState: "OBSERVED",
  })
  expect(records[0].provenance.evidenceIds).toEqual(["evidence:channel-summary"])
  expect(records[0].window?.kind).toBe("28d")
  expect(records[0].observedAt).toBeNull()
  expect(records[0].updatedAt).toBe("2026-09-27T15:00:00.000Z")
 })

 it("preserves missing metrics as explicit missing records and never normalizes them to zero", () => {
  const records = projectCanonicalEvidenceRecords({
   ...bundle,
   datasets: [{
    ...bundle.datasets[0],
    status: "partial",
    missingMetrics: ["impressions", "clickThroughRate"],
    metrics: {
     views: bundle.datasets[0].metrics.views,
    },
   }],
  })

  expect(records).toHaveLength(3)
  expect(records.find((record) => record.metric === "views")).toMatchObject({
   value: 2800,
   epistemicState: "OBSERVED",
   observedAt: null,
  })
  expect(records.find((record) => record.metric === "impressions")).toMatchObject({
   id: "analytics:snapshot-1:channel_summary:impressions:missing",
   value: null,
   epistemicState: "MISSING",
   availability: "unavailable",
   missingness: ["impressions"],
   observedAt: null,
  })
  expect(records.find((record) => record.metric === "clickThroughRate")).toMatchObject({
   value: null,
   epistemicState: "MISSING",
   availability: "unavailable",
  })
 })

 it("selects exactly the records that fit the bounded prompt evidence budget", () => {
  const records: EvidenceRecord[] = Array.from({ length: 7 }, (_, index) => ({
   id: `evidence-${index}`,
   owner: "analytics-canon",
   sourceRef: `dataset-${index}`,
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   metric: "views",
   value: index + 1,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: [`source-${index}`] },
  }))
  const selected = selectEvidenceRecordsForPrompt(records, { maximumRecords: 5, maximumCharacters: 800 })

  expect(selected.length).toBeGreaterThan(0)
  expect(selected.length).toBeLessThanOrEqual(5)
  expect(selected.map(formatEvidenceRecordForPrompt).join("\n").length).toBeLessThanOrEqual(800)
  expect(selected.every((record) => records.includes(record))).toBe(true)
 })

 it("allows exact comparisons only when metric, unit, scope and window semantics match", () => {
  const left: EvidenceRecord = {
   id: "left",
   owner: "analytics-canon",
   sourceRef: "dataset-a",
   sourceSnapshotId: "s1",
   channelId: "channel-1",
   datasetId: "dataset-a",
   metric: "ctr",
   value: 5.2,
   unit: "percent",
   aggregation: "rate",
   population: "impressions",
   format: "longform",
   geography: "global",
   window: { kind: "28d" },
   observedAt: null,
   updatedAt: null,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["e1"] },
  }
  const right: EvidenceRecord = {
   ...left,
   id: "right",
   sourceRef: "dataset-b",
   sourceSnapshotId: "s2",
   value: 5.8,
   provenance: { evidenceIds: ["e2"] },
  }

  expect(compareEvidenceRecords(left, right)).toEqual({
   comparable: true,
   level: "exact",
   reasons: [],
   normalization: null,
  })
 })

 it("returns normalized for compatible rates/averages across different time windows", () => {
  const left: EvidenceRecord = {
   id: "left",
   owner: "analytics-canon",
   sourceRef: "dataset",
   channelId: "channel-1",
   metric: "averagePercentageViewed",
   value: 62,
   unit: "percent",
   aggregation: "average",
   population: "views",
   format: "longform",
   geography: "global",
   window: { kind: "7d" },
   observedAt: null,
   updatedAt: null,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["e1"] },
  }
  const right: EvidenceRecord = {
   ...left,
   id: "right",
   value: 59,
   window: { kind: "28d" },
   provenance: { evidenceIds: ["e2"] },
  }

  const result = compareEvidenceRecords(left, right)
  expect(result.comparable).toBe(true)
  expect(result.level).toBe("normalized")
  expect(result.normalization).toContain("window-independent")
 })

 it("rejects mismatched metrics, channels, units or populations instead of asking the model to reconcile them", () => {
  const base: EvidenceRecord = {
   id: "base",
   owner: "analytics-canon",
   sourceRef: "dataset",
   channelId: "channel-1",
   metric: "views",
   value: 100,
   unit: "count",
   aggregation: "sum",
   population: "videos",
   format: "longform",
   geography: "global",
   window: { kind: "28d" },
   observedAt: null,
   updatedAt: null,
   freshness: "fresh",
   epistemicState: "OBSERVED",
   provenance: { evidenceIds: ["e1"] },
  }

  expect(compareEvidenceRecords(base, { ...base, id: "metric", metric: "watchTime" }).level).toBe("invalid")
  expect(compareEvidenceRecords(base, { ...base, id: "channel", channelId: "channel-2" }).level).toBe("invalid")
  expect(compareEvidenceRecords(base, { ...base, id: "unit", unit: "hours" }).level).toBe("invalid")
  expect(compareEvidenceRecords(base, { ...base, id: "population", population: "viewers" }).level).toBe("invalid")
 })

 it("downgrades stale evidence to directional even when dimensions otherwise match", () => {
  const records = projectCanonicalEvidenceRecords({
   ...bundle,
   datasets: [{ ...bundle.datasets[0], status: "stale" }],
  })
  const left = records[0]
  const right = { ...left, id: "right", value: 3100 }

  const result = compareEvidenceRecords(left, right)
  expect(result.comparable).toBe(true)
  expect(result.level).toBe("directional")
  expect(result.reasons.join(" ")).toContain("stale")
 })
 it("fingerprints the exact ordered evidence records used by prompt and grading", () => {
  const selected = selectEvidenceRecordsForPrompt(projectCanonicalEvidenceRecords(bundle))
  const records = [...selected, { ...selected[0], id: "second-evidence", metric: "likes", value: 42 }]
  const quality = buildBrainEvidenceRecordQuality(records, { expectedChannelId: "channel-1" })
  const reordered = buildBrainEvidenceRecordQuality([...records].reverse(), { expectedChannelId: "channel-1" })
  const changedValue = buildBrainEvidenceRecordQuality(records.map((record) => ({ ...record, value: 2801 })), { expectedChannelId: "channel-1" })

  expect(quality.evidenceFingerprint).toBeTruthy()
  expect(reordered.evidenceFingerprint).not.toBe(quality.evidenceFingerprint)
  expect(changedValue.evidenceFingerprint).not.toBe(quality.evidenceFingerprint)
 })

})
