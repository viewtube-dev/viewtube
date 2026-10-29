/**
 * Tests for the Channel Intelligence Engine pure core (roadmap item 1).
 * Run: vitest run src/features/capabilities/channel-intelligence-engine/channelIntelligence.test.ts
 */
import { describe, expect, it } from "vitest"

import type {
  AIBrainContextSnapshotView,
  BrainEvidenceQualityView,
} from "../shared/brainContracts"
import { buildChannelIntelligenceView, derivePatterns } from "./channelIntelligence"

const video = (id: string, views: number | null, daysAgo: number, title = `Video ${id}`) => ({
  videoId: id,
  title,
  publishedAt: new Date(Date.parse("2026-01-01T00:00:00Z") - daysAgo * 86_400_000).toISOString(),
  views,
})

const controls = {
  enabled: true,
  personalization: true,
  allowAnalytics: true,
  learnFromInteractions: true,
}

const snapshot = (
  videos: Array<ReturnType<typeof video>>,
  missing: string[] = [],
): AIBrainContextSnapshotView => ({
  channel: { channelId: "UC_test", label: "Test Channel" },
  inferredProfile: {
    niche: "testing",
    contentPillars: ["tutorials", "reviews"],
    videoCount: videos.length,
    topEvidenceVideos: videos.slice(0, 3),
  },
  evidencePack: { packId: "pack_1", channelLabel: "Test Channel", videos, missingInputs: missing },
})

const quality: BrainEvidenceQualityView = {
  confidence: "medium",
  coverageRatio: 0.75,
  scopeMatch: "partial",
  evidenceReferenceCount: 4,
  missingness: {
    unavailableDatasetIds: ["audience_demo"],
    failedDatasetIds: ["retention"],
    partialDatasetIds: ["ctr"],
  },
  freshness: { staleDatasetIds: ["subs_daily"] },
  limitations: ["Window limited to 28 days."],
}

describe("derivePatterns", () => {
  it("finds momentum across recent vs older halves", () => {
    const findings = derivePatterns(
      snapshot([
        video("v1", 1000, 1),
        video("v2", 1200, 3),
        video("v3", 100, 20),
        video("v4", 90, 25),
      ]),
      null,
    )
    const momentum = findings.find((finding) => finding.id === "momentum:recent-vs-older")
    expect(momentum).toBeDefined()
    expect(momentum?.title).toContain("outperforming")
    expect(momentum?.evidenceRefs).toEqual(["v1", "v2", "v3", "v4"])
  })

  it("flags outliers above 3x the median", () => {
    const findings = derivePatterns(
      snapshot([video("v1", 10000, 1), video("v2", 100, 3), video("v3", 90, 5)]),
      null,
    )
    expect(findings.some((finding) => finding.id === "outlier:v1")).toBe(true)
  })

  it("never invents patterns when no views are evidenced", () => {
    const findings = derivePatterns(snapshot([video("v1", null, 1), video("v2", null, 2)]), null)
    expect(findings.every((finding) => finding.kind !== "momentum")).toBe(true)
    expect(findings.every((finding) => finding.kind !== "outlier")).toBe(true)
  })
})

describe("buildChannelIntelligenceView", () => {
  it("respects the disabled-analytics control: no patterns, explicit limitation", () => {
    const view = buildChannelIntelligenceView(
      { snapshot: snapshot([video("v1", 500, 1), video("v2", 400, 2)]), evidenceQuality: quality },
      { ...controls, allowAnalytics: false },
    )
    expect(view.analyticsDisabled).toBe(true)
    expect(view.patterns).toEqual([])
    expect(view.audienceSummary).toBeNull()
    expect(view.limitations.some((limitation) => limitation.includes("disabled"))).toBe(true)
  })

  it("derives cited data-gap recommendations and coverage from the quality report", () => {
    const view = buildChannelIntelligenceView(
      { snapshot: snapshot([video("v1", 500, 1)], ["demographics"]), evidenceQuality: quality },
      controls,
    )
    const ids = view.recommendations.map((recommendation) => recommendation.missingInputId)
    expect(ids).toContain("audience_demo")
    expect(ids).toContain("retention")
    expect(ids).toContain("demographics")
    expect(view.coverage.coverageRatio).toBe(0.75)
    expect(view.coverage.scopeMatch).toBe("partial")
    expect(view.limitations).toContain("Window limited to 28 days.")
  })
})
