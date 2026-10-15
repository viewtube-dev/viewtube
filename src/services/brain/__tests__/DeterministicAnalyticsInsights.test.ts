import { describe, expect, it } from "vitest"
import type {
 CanonicalIntelligenceDatasetManifest,
 CanonicalIntelligenceEvidenceBundle,
 CanonicalIntelligenceDatasetRows,
} from "../../analytics-canon"
import {
 buildPeriodComparisonInsights,
 buildTrafficSourceContributionInsights,
} from "../DeterministicAnalyticsInsights"

const dataset = (
 id: string,
 metrics: CanonicalIntelligenceDatasetManifest["metrics"],
 overrides: Partial<CanonicalIntelligenceDatasetManifest> = {},
): CanonicalIntelligenceDatasetManifest => ({
 id,
 label: id,
 description: "fixture",
 categoryIds: [],
 status: "available",
 rowCount: 2,
 updatedAt: "2026-10-14T00:00:00.000Z",
 sources: ["youtube_analytics_v2"],
 missingMetrics: [],
 columns: [],
 evidenceRefs: [`analytics:${id}`],
 metrics,
 sampleRows: [],
 ...overrides,
})

const bundle = (
 snapshotId: string,
 metrics: CanonicalIntelligenceDatasetManifest["metrics"],
 overrides: Partial<CanonicalIntelligenceEvidenceBundle> = {},
): CanonicalIntelligenceEvidenceBundle => ({
 version: "vt-intelligence-evidence-v1",
 snapshotId,
 channelId: "channel-1",
 channelName: "Fixture channel",
 capturedAt: "2026-10-14T00:00:00.000Z",
 selectedWindow: "28d",
 generatedAt: "2026-10-14T00:00:00.000Z",
 coverage: { total: 1, available: 1, partial: 0, stale: 0, failed: 0, unavailable: 0, represented: 1 },
 datasets: [dataset("daily", metrics)],
 requestedSectionIds: [],
 omittedDatasetIds: [],
 contextText: "",
 ...overrides,
})

const period = (label: string, startDate: string, endDate: string) => ({
 label,
 startDate,
 endDate,
})

describe("deterministic analytics insights", () => {
 it("compares explicit non-overlapping periods with a reproducible formula and source refs", () => {
  const result = buildPeriodComparisonInsights({
   baseline: {
    bundle: bundle("snapshot-old", { views: { count: 1, sum: 100, average: 100, minimum: 100, maximum: 100 } }),
    period: period("Previous 28 days", "2026-08-19", "2026-09-15"),
   },
   current: {
    bundle: bundle("snapshot-new", { views: { count: 1, sum: 125, average: 125, minimum: 125, maximum: 125 } }),
    period: period("Current 28 days", "2026-09-16", "2026-10-13"),
   },
  })

  expect(result.blockedReasons).toEqual([])
  expect(result.insights).toHaveLength(1)
  expect(result.insights[0]).toMatchObject({
   kind: "comparison",
   metric: "views",
   currentValue: 125,
   baselineValue: 100,
   delta: 25,
   relativeDeltaPercent: 25,
   formula: "delta=current-baseline; relativeDeltaPercent=(delta/abs(baseline))*100",
   deterministic: true,
   evidenceRefs: expect.arrayContaining([
    "analytics:daily",
    "analytics:snapshot-old:daily:views",
    "analytics:snapshot-new:daily:views",
   ]),
  })
  expect(result.insights[0].id).toBe(
   buildPeriodComparisonInsights({
    baseline: {
     bundle: bundle("snapshot-old", { views: { count: 1, sum: 100, average: 100, minimum: 100, maximum: 100 } }),
     period: period("Previous 28 days", "2026-08-19", "2026-09-15"),
    },
    current: {
     bundle: bundle("snapshot-new", { views: { count: 1, sum: 125, average: 125, minimum: 125, maximum: 125 } }),
     period: period("Current 28 days", "2026-09-16", "2026-10-13"),
    },
   }).insights[0].id,
  )
 })

 it("does not invent a relative change when the baseline is zero", () => {
  const result = buildPeriodComparisonInsights({
   baseline: {
    bundle: bundle("snapshot-old", { views: { count: 1, sum: 0, average: 0, minimum: 0, maximum: 0 } }),
    period: period("Previous", "2026-08-19", "2026-09-15"),
   },
   current: {
    bundle: bundle("snapshot-new", { views: { count: 1, sum: 12, average: 12, minimum: 12, maximum: 12 } }),
    period: period("Current", "2026-09-16", "2026-10-13"),
   },
  })
  expect(result.insights[0].delta).toBe(12)
  expect(result.insights[0].relativeDeltaPercent).toBeNull()
  expect(result.insights.some((insight) => insight.kind === "material-change")).toBe(false)
 })

 it("blocks mismatched channels and overlapping or invalid period bounds", () => {
  const base = bundle("snapshot-old", { views: { count: 1, sum: 100, average: 100, minimum: 100, maximum: 100 } })
  const current = bundle("snapshot-new", { views: { count: 1, sum: 125, average: 125, minimum: 125, maximum: 125 } })
  expect(buildPeriodComparisonInsights({
   baseline: { bundle: base, period: period("Previous", "2026-08-19", "2026-09-15") },
   current: { bundle: { ...current, channelId: "channel-other" }, period: period("Current", "2026-09-16", "2026-10-13") },
  }).blockedReasons).toContain("Channel identity does not match.")
  expect(buildPeriodComparisonInsights({
   baseline: { bundle: base, period: period("Previous", "2026-09-01", "2026-09-30") },
   current: { bundle: current, period: period("Current", "2026-09-16", "2026-10-13") },
  }).blockedReasons).toContain("Comparison periods overlap or are not in chronological order.")
  expect(buildPeriodComparisonInsights({
   baseline: { bundle: base, period: period("Previous", "not-a-date", "2026-09-28") },
   current: { bundle: current, period: period("Current", "2026-09-16", "2026-10-13") },
  }).blockedReasons).toContain("Period boundaries must be valid YYYY-MM-DD dates.")
 })

 it("fails closed for partial, stale, missing, or non-finite metric evidence", () => {
  const oldMetrics = { views: { count: 1, sum: 100, average: 100, minimum: 100, maximum: 100 } }
  const oldBundle = bundle("snapshot-old", oldMetrics)
  const partial = bundle("snapshot-new", oldMetrics, {
   datasets: [dataset("daily", oldMetrics, { status: "partial" })],
  })
  expect(buildPeriodComparisonInsights({
   baseline: { bundle: oldBundle, period: period("Previous", "2026-08-19", "2026-09-15") },
   current: { bundle: partial, period: period("Current", "2026-09-16", "2026-10-13") },
  }).blockedReasons).toContain("Dataset daily is not fully available in both periods.")
  const missing = bundle("snapshot-new", {})
  const missingResult = buildPeriodComparisonInsights({
   baseline: { bundle: oldBundle, period: period("Previous", "2026-08-19", "2026-09-15") },
   current: { bundle: missing, period: period("Current", "2026-09-16", "2026-10-13") },
  })
  expect(missingResult.insights).toEqual([])
  expect(missingResult.blockedReasons).toContain("Metric views is missing from the current period in dataset daily.")
 })

 it("emits threshold-based material-change signals but does not call them statistical significance", () => {
  const result = buildPeriodComparisonInsights({
   baseline: {
    bundle: bundle("snapshot-old", { views: { count: 1, sum: 100, average: 100, minimum: 100, maximum: 100 } }),
    period: period("Previous", "2026-08-19", "2026-09-15"),
   },
   current: {
    bundle: bundle("snapshot-new", { views: { count: 1, sum: 130, average: 130, minimum: 130, maximum: 130 } }),
    period: period("Current", "2026-09-16", "2026-10-13"),
   },
   minimumMaterialChangePercent: 20,
  })
  expect(result.insights.map((insight) => insight.kind)).toEqual(["comparison", "material-change"])
  expect(result.insights[1].limitations).toContain("Threshold-based materiality is not a statistical significance test.")
 })

 it("calculates traffic-source shares only from complete usable rows", () => {
  const source: CanonicalIntelligenceDatasetRows = {
   datasetId: "traffic",
   label: "Traffic",
   status: "available",
   snapshotId: "snapshot-traffic",
   channelId: "channel-1",
   updatedAt: "2026-10-14T00:00:00.000Z",
   sources: ["youtube_analytics_v2"],
   missingMetrics: [],
   rows: [
    { trafficSource: "Search", views: 60 },
    { trafficSource: "Suggested", views: 30 },
    { trafficSource: "Browse", views: 10 },
   ],
  }
  const result = buildTrafficSourceContributionInsights({ dataset: source, metricKey: "views", dimensionKey: "trafficSource", sourceRowCount: 3 })
  expect(result.limitations).toEqual([])
  expect(result.insights.map((insight) => [insight.label, insight.currentValue, insight.sharePercent])).toEqual([
   ["Search", 60, 60],
   ["Suggested", 30, 30],
   ["Browse", 10, 10],
  ])
  expect(result.insights.every((insight) => insight.evidenceRefs.includes("analytics:snapshot-traffic:traffic:views"))).toBe(true)
 })

 it("blocks incomplete traffic rows and zero denominators instead of fabricating shares", () => {
  const base: CanonicalIntelligenceDatasetRows = {
   datasetId: "traffic",
   label: "Traffic",
   status: "available",
   snapshotId: "snapshot-traffic",
   channelId: "channel-1",
   sources: ["youtube_analytics_v2"],
   missingMetrics: [],
   rows: [{ trafficSource: "Search", views: 60 }, { trafficSource: "Suggested", views: 30 }],
  }
  expect(buildTrafficSourceContributionInsights({
   dataset: base, metricKey: "views", dimensionKey: "trafficSource", sourceRowCount: 3,
  }).limitations).toContain("Canonical row count does not match the supplied complete-row count.")
  expect(buildTrafficSourceContributionInsights({
   dataset: { ...base, rows: [{ trafficSource: "Search", views: 0 }, { trafficSource: "Suggested", views: 0 }] },
   metricKey: "views",
   dimensionKey: "trafficSource",
   sourceRowCount: 2,
  }).limitations).toContain("Contribution shares require a positive metric total.")
  expect(buildTrafficSourceContributionInsights({
   dataset: { ...base, status: "partial" },
   metricKey: "views",
   dimensionKey: "trafficSource",
   sourceRowCount: 2,
  }).insights).toEqual([])
 })
})
