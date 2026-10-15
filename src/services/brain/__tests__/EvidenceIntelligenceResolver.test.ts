import { describe, expect, it, vi } from "vitest"
import {
 resolveEvidenceIntelligence,
 type EvidenceIntelligenceResolverDependencies,
} from "../EvidenceIntelligenceResolver"

const canonicalEvidence = {
 snapshotId: "snapshot-1",
 channelId: "channel-1",
 selectedWindow: "28d",
 datasets: [],
 coverage: { total: 0 },
 omittedDatasetIds: [],
} as any

const evidenceQuality = {
 version: "vt-brain-evidence-quality-v1",
 scopeMatch: "exact",
 confidence: "high",
 coverageRatio: 1,
} as any

const statisticsIntelligence = {
 confidence: "high",
 selectedWindow: "28d",
 metrics: [],
 limitations: [],
} as any

const audienceIntelligence = {
 confidence: "medium",
 selectedWindow: "28d",
 signals: [],
 missingEvidence: [],
 evidenceBoundary: [],
} as any

const opportunities = [{
 id: "opportunity-1",
 kind: "emerging_search",
 channelId: "channel-1",
 confidence: 0.8,
 impactScore: 0.7,
 evidenceIds: ["evidence-1"],
}] as any

const evidenceRecords = [{
 id: "analytics:snapshot-1:channel_summary:views",
 owner: "analytics-canon",
 sourceRef: "channel_summary",
 sourceSnapshotId: "snapshot-1",
 channelId: "channel-1",
 metric: "views",
 value: 100,
 unit: "count",
 aggregation: "sum",
 freshness: "fresh",
 epistemicState: "observed",
 provenance: { evidenceIds: ["evidence-1"] },
}] as any

const makeDeps = (
 quality = evidenceQuality,
): EvidenceIntelligenceResolverDependencies => ({
 getCanonicalEvidence: vi.fn(() => canonicalEvidence),
 buildQuality: vi.fn(() => quality),
 buildStatistics: vi.fn(() => statisticsIntelligence),
 buildAudience: vi.fn(() => audienceIntelligence),
 buildOpportunities: vi.fn(() => opportunities),
 projectEvidence: vi.fn(() => evidenceRecords),
})

describe("EvidenceIntelligenceResolver", () => {
 it("builds one runtime evidence envelope from one canonical analytics snapshot and forwards the requested window", () => {
  const deps = makeDeps()

  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   window: "90d",
   sectionIds: ["algorithm-diagnosis"],
   includeAudience: true,
   includeOpportunities: true,
   brainEvidencePack: { channelId: "channel-1", topVideos: [], searchTerms: [], trafficSources: [] } as any,
  }, deps)

  expect(result.version).toBe("vt-evidence-intelligence-v1")
  expect(result.canonicalEvidence).toBe(canonicalEvidence)
  expect(result.evidenceRecords).toBe(evidenceRecords)
  expect(result.evidenceQuality).toBe(evidenceQuality)
  expect(result.statisticsIntelligence).toBe(statisticsIntelligence)
  expect(result.audienceIntelligence).toBe(audienceIntelligence)
  expect(result.opportunityEvidence).toBe(opportunities)
  expect(result.scopeUsable).toBe(true)
  expect(deps.getCanonicalEvidence).toHaveBeenCalledTimes(1)
  expect(deps.getCanonicalEvidence).toHaveBeenCalledWith({
   window: "90d",
   sectionIds: ["algorithm-diagnosis"],
   maximumRowsPerDataset: 8,
   maximumCharacters: 16_000,
  })
  expect(deps.projectEvidence).toHaveBeenCalledTimes(1)
  expect(deps.projectEvidence).toHaveBeenCalledWith(canonicalEvidence)
 })

 it("exposes only exact-scope deterministic finding context to the Brain runtime", () => {
  const deps = makeDeps()
  const deterministicFinding = {
   id: "finding-1",
   kind: "comparison",
   findingType: "comparison",
   label: "Views increased",
   channelId: "channel-1",
   datasetId: "daily",
   metric: "views",
   filters: {},
   window: "28d",
   sourceSnapshotIds: ["snapshot-before", "snapshot-after"],
   aggregation: "sum",
   observedFact: { currentValue: 140, baselineValue: 100, delta: 40, relativeDeltaPercent: 40 },
   calculation: { formula: "current - baseline", algorithmVersion: "vt-deterministic-analytics-insights-v1", deterministic: true },
   validationState: "validated",
   interpretation: null,
   recommendation: null,
   currentValue: 140,
   baselineValue: 100,
   delta: 40,
   relativeDeltaPercent: 40,
   unit: "source-metric-value",
   confidence: 0.8,
   evidenceRefs: ["analytics:snapshot-before:daily:views", "analytics:snapshot-after:daily:views"],
   formula: "current - baseline",
   algorithmVersion: "vt-deterministic-analytics-insights-v1",
   deterministic: true,
   limitations: ["descriptive only"],
  } as any

  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   deterministicInsights: [deterministicFinding],
  }, deps)

  expect(result.analyticsFindingContext.status).toBe("ready")
  expect(result.analyticsFindingContext.findingIds).toEqual(["finding-1"])
  expect(result.analyticsFindingContext.findings[0].currentValue).toBe(140)
  expect(result.analyticsFindingContext.findings[0].evidenceRefs).toHaveLength(2)
 })

 it("blocks all analytics-derived projections when canonical evidence belongs to another channel", () => {
  const deps = makeDeps({ ...evidenceQuality, scopeMatch: "mismatch", confidence: "insufficient" } as any)

  const result = resolveEvidenceIntelligence({
   channelId: "channel-2",
   includeAudience: true,
   includeOpportunities: true,
   brainEvidencePack: { channelId: "channel-2", topVideos: [], searchTerms: [], trafficSources: [] } as any,
  }, deps)

  expect(result.scopeUsable).toBe(false)
  expect(result.evidenceRecords).toEqual([])
  expect(result.statisticsIntelligence).toBeNull()
  expect(result.audienceIntelligence).toBeNull()
  expect(result.opportunityEvidence).toEqual([])
  expect(deps.projectEvidence).not.toHaveBeenCalled()
  expect(deps.buildOpportunities).not.toHaveBeenCalled()
 })

 it("does not build optional audience or opportunity projections when the task does not request them", () => {
  const deps = makeDeps()

  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   includeAudience: false,
   includeOpportunities: false,
  }, deps)

  expect(result.evidenceRecords).toBe(evidenceRecords)
  expect(result.audienceIntelligence).toBeNull()
  expect(result.opportunityEvidence).toEqual([])
  expect(deps.buildAudience).not.toHaveBeenCalled()
  expect(deps.buildOpportunities).not.toHaveBeenCalled()
 })

 it("blocks opportunity evidence that is explicitly scoped to a different channel", () => {
  const deps = makeDeps()
  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   includeOpportunities: true,
   brainEvidencePack: { channelId: "channel-2", topVideos: [], searchTerms: [], trafficSources: [] } as any,
  }, deps)

  expect(result.opportunityEvidence).toEqual([])
  expect(deps.buildOpportunities).not.toHaveBeenCalled()
 })
})


describe("canonical opportunity convergence", () => {
 it("uses canonical dataset rows for opportunity evidence when the production adapter is available", () => {
  const deps = {
   ...makeDeps(),
   buildCanonicalOpportunities: vi.fn(() => opportunities),
  }
  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   window: "90d",
   sectionIds: ["strategy-engine"],
   includeOpportunities: true,
   brainEvidencePack: { channelId: "channel-2", topVideos: [], searchTerms: [], trafficSources: [] } as any,
  }, deps)

  expect(deps.buildCanonicalOpportunities).toHaveBeenCalledWith({
   channelId: "channel-1",
   bundle: canonicalEvidence,
  })
  expect(deps.buildOpportunities).not.toHaveBeenCalled()
  expect(result.provenance.opportunitySource).toBe("analytics-canon")
 })

 it("blocks every projection when canonical evidence has no verifiable channel scope", () => {
  const deps = makeDeps({ ...evidenceQuality, scopeMatch: "unscoped", confidence: "insufficient" } as any)
  const result = resolveEvidenceIntelligence({
   channelId: "channel-1",
   includeAudience: true,
   includeOpportunities: true,
   brainEvidencePack: { channelId: "channel-1", topVideos: [], searchTerms: [], trafficSources: [] } as any,
  }, deps)

  expect(result.scopeUsable).toBe(false)
  expect(result.evidenceRecords).toEqual([])
  expect(result.statisticsIntelligence).toBeNull()
  expect(result.audienceIntelligence).toBeNull()
  expect(result.opportunityEvidence).toEqual([])
 })
})
