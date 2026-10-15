import { describe, expect, it, vi } from "vitest"
import { buildBrainContextPack } from "./BrainContextBroker"

vi.mock("./BrainUserControls", () => ({
 readBrainUserControls: () => ({
  enabled: true,
  personalization: false,
  allowAnalytics: true,
  allowProjects: true,
  learnFromInteractions: true,
 }),
}))

const snapshot = {
 channel: { label: "Channel One" },
 inferredProfile: {
  niche: "crafts",
  contentPillars: ["tutorials"],
  videoCount: 12,
  topEvidenceVideos: [{ title: "Observed video", views: 1200 }],
 },
 evidencePack: { missingInputs: [] },
 brain: { identityAndAspirations: "", contentDNA: "", futureStateMap: "" },
 conversations: { recentFacts: [] },
} as any

const quality = (scopeMatch: "exact" | "mismatch" | "unscoped") => ({
 version: "vt-brain-evidence-quality-v1",
 generatedAt: "2026-10-15T00:00:00.000Z",
 sourceSnapshotId: "canonical-snapshot-90d",
 channelId: scopeMatch === "exact" ? "channel-1" : scopeMatch === "mismatch" ? "channel-2" : null,
 selectedWindow: "90d",
 scopeMatch,
 confidence: scopeMatch === "exact" ? "high" : "insufficient",
 coverageRatio: 0.9,
 evidenceReferenceCount: 4,
 datasets: [],
 requestedSectionIds: ["strategy-engine"],
 evaluatedDatasetIds: ["videos"],
 freshness: { staleDatasetIds: [], newestDatasetAt: null },
 missingness: { unavailableDatasetIds: [], failedDatasetIds: [], partialDatasetIds: [], omittedDatasetIds: [] },
 limitations: scopeMatch === "exact" ? [] : ["Scope is not safe for channel-specific claims."],
} as any)

const build = (scopeMatch: "exact" | "mismatch" | "unscoped", project: Record<string, unknown> | null = null) => buildBrainContextPack({
 channelId: "channel-1",
 systemPrompt: "Use evidence carefully.",
 snapshot,
 recentTurns: [],
 userText: "Analyze channel performance",
 evidenceQuality: quality(scopeMatch),
 statisticsIntelligence: {
  confidence: "high",
  coverageRatio: 1,
  selectedWindow: "90d",
  metrics: [{ datasetId: "videos", metric: "views", count: 1, sum: 1200, average: 1200, minimum: 1200, maximum: 1200, evidenceRef: "ref-1" }],
  limitations: [],
 } as any,
 audienceIntelligence: { confidence: "high", selectedWindow: "90d", signals: [], missingEvidence: [], evidenceBoundary: [] } as any,
 algorithmIntelligence: {
  channelId: "channel-1",
  generatedAt: "2026-10-15T00:00:00.000Z",
  channelIntelligence: { patterns: [] },
  primingPlan: null,
  anomalySignals: [],
  opportunitySignals: [{ id: "signal-1", kind: "traffic_expansion", impactScore: 80, confidence: 80, evidenceIds: ["ref-1"] }],
  directSignals: [],
  allDecisionSignals: [],
  recommendations: [],
  primaryRecommendation: null,
  architecture: { channelIntelligenceRole: "", anomalyRole: "", opportunityRole: "", primingRole: "", decisionRole: "" },
 } as any,
 creatorContext: {
  version: "vt-creator-context-v1",
  channelId: "channel-1",
  controls: { enabled: true, personalization: false, allowAnalytics: true, allowProjects: true, learnFromInteractions: true },
  project,
  channelKnowledge: null,
  styleProfile: null,
  provenance: {},
 } as any,
})

describe("BrainContextBroker canonical evidence health", () => {
 it("includes the selected reporting window and snapshot provenance for exact scope", () => {
  const result = build("exact")
  expect(result.systemInstruction).toContain("window=90d")
  expect(result.systemInstruction).toContain("snapshot=canonical-snapshot-90d")
  expect(result.systemInstruction).toContain("DETERMINISTIC STATISTICS INTELLIGENCE")
 })

 it.each(["mismatch", "unscoped"] as const)("blocks channel-specific analytics context for %s evidence", (scope) => {
  const result = build(scope)
  expect(result.systemInstruction).toContain("Analytics evidence is blocked")
  expect(result.systemInstruction).not.toContain("DETERMINISTIC STATISTICS INTELLIGENCE")
  expect(result.systemInstruction).not.toContain("ALGORITHM / CHANNEL / OPPORTUNITY INTELLIGENCE")
  expect(result.budget.omittedSections).toContain("analytics_scope_blocked")
 })

 it("injects the canonical ContentBuild phase and phase-relevant capabilities into Brain context", () => {
  const result = build("exact", {
   projectId: "project-1",
   contentBuildId: "build-1",
   title: "Launch guide",
   lifecycle: {
    status: "resolved",
    currentPhase: "package",
    sourceStage: "package",
    relevantCapabilities: ["title", "thumbnail", "metadata"],
    audiencePromisePresent: true,
    blockers: ["creator-review"],
   },
  })
  expect(result.systemInstruction).toContain("currentLifecyclePhase=package")
  expect(result.systemInstruction).toContain("phaseCapabilities=title,thumbnail,metadata")
  expect(result.systemInstruction).toContain("workflowBlockers=creator-review")
  expect(result.systemInstruction).toContain("prioritize only phase-relevant capabilities")
 })
})
