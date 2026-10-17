import { describe, expect, it } from "vitest"
import type { AIBrainEvidencePack } from "../../types"
import { buildOpportunityEvidenceFromBrainPack, buildOpportunityEvidenceFromCanonicalBundle } from "./OpportunityEvidenceAdapter"

const pack = (): AIBrainEvidencePack => ({
 promptVersion: "brain-chat-v2",
 intent: "strategy",
 channelId: "channel-a",
 channelName: "History Workshop",
 channelDescription: null,
 capturedAt: "2026-09-25T12:00:00.000Z",
 dataStatus: "ready",
 topVideos: [
  {
   id: "video-top",
   evidenceId: "ev-top",
   title: "Cavalry Explained",
   publishedAt: "2026-09-01T12:00:00.000Z",
   format: "long",
   descriptionSnippet: null,
   tags: ["cavalry"],
   metrics: { views: 1000, watchTime: 100, subscribers: 20, revenue: null, ctr: 6, averagePercentageViewed: 55, likes: 40, comments: 8 },
  },
 ],
 recentVideos: [
  {
   id: "video-recent",
   evidenceId: "ev-recent",
   title: "Artillery Explained",
   publishedAt: "2026-09-20T12:00:00.000Z",
   format: "long",
   descriptionSnippet: null,
   tags: ["artillery"],
   metrics: { views: 500, watchTime: null, subscribers: null, revenue: null, ctr: null, averagePercentageViewed: null, likes: null, comments: null },
  },
 ],
 searchTerms: [],
 trafficSources: [],
 items: [],
 availableMetrics: ["views", "watchTime", "subscribers", "ctr", "averagePercentageViewed"],
 missingInputs: [],
 evidenceIds: ["ev-top", "ev-recent"],
 transcriptRouteRequired: false,
})

describe("OpportunityEvidenceAdapter", () => {
 it("derives bounded channel-scoped opportunities from canonical Brain evidence", () => {
  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack: pack(),
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result).toHaveLength(2)
  expect(result[0]).toMatchObject({
   channelId: "channel-a",
   kind: "performance_candidate",
   evidenceIds: ["ev-top"],
  })
  // In-sample ranking is not proof of a catalog gap or measured trend.
  expect(result.every((item) => item.kind === "performance_candidate")).toBe(true)
  expect(result.every((item) => item.baselineValue === null && item.relativeDelta === null)).toBe(true)
  expect(result.every((item) => item.confidence >= 0 && item.confidence <= 100)).toBe(true)
  expect(result.every((item) => item.impactScore >= 0 && item.impactScore <= 100)).toBe(true)
 })

 it("deduplicates videos present in both top and recent evidence", () => {
  const evidencePack = pack()
  evidencePack.recentVideos.push(evidencePack.topVideos[0])

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result.filter((item) => item.videoId === "video-top")).toHaveLength(1)
 })

 it("preserves missing views as unknown when other metrics exist", () => {
  const evidencePack = pack()
  evidencePack.recentVideos[0].metrics = {
   views: null,
   watchTime: 20,
   subscribers: 3,
   revenue: null,
   ctr: 5,
   averagePercentageViewed: 50,
   likes: null,
   comments: null,
  }

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })
  const recent = result.find((item) => item.videoId === "video-recent")

  expect(recent).toMatchObject({
   currentValue: null,
   confidence: 80,
   evidenceIds: ["ev-recent"],
  })
 })

 it("does not derive a metric-backed opportunity when every metric is missing", () => {
  const evidencePack = pack()
  evidencePack.recentVideos[0].metrics = {
   views: null,
   watchTime: null,
   subscribers: null,
   revenue: null,
   ctr: null,
   averagePercentageViewed: null,
   likes: null,
   comments: null,
  }

  const result = buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
   now: new Date("2026-09-25T12:00:00.000Z"),
  })

  expect(result.some((item) => item.videoId === "video-recent")).toBe(false)
 })

 it("refuses cross-channel evidence instead of relabeling it", () => {
  const evidencePack = pack()
  evidencePack.channelId = "channel-b"

  expect(buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
  })).toEqual([])
 })

 it("returns no invented opportunity when evidence is missing", () => {
  const evidencePack = pack()
  evidencePack.dataStatus = "missing"
  evidencePack.topVideos = []
  evidencePack.recentVideos = []

  expect(buildOpportunityEvidenceFromBrainPack({
   channelId: "channel-a",
   evidencePack,
  })).toEqual([])
 })
})


describe("buildOpportunityEvidenceFromCanonicalBundle", () => {
 const makeBundle = (overrides: Record<string, unknown> = {}) => ({
  version: "vt-intelligence-evidence-v1",
  snapshotId: "snapshot-canonical-1",
  channelId: "channel-1",
  channelName: "Test channel",
  capturedAt: "2026-10-15T00:00:00.000Z",
  generatedAt: "2026-10-15T00:00:00.000Z",
  selectedWindow: "90d",
  coverage: { total: 1, available: 1, partial: 0, stale: 0, failed: 0, unavailable: 0, represented: 1 },
  requestedSectionIds: ["strategy-engine"],
  omittedDatasetIds: [],
  contextText: "",
  datasets: [{
   id: "videos",
   label: "Video Catalog Analytics",
   description: "",
   categoryIds: ["videos"],
   status: "available",
   rowCount: 2,
   sources: ["youtube_analytics_v2"],
   missingMetrics: [],
   updatedAt: "2026-10-15T00:00:00.000Z",
   columns: [],
   metrics: {},
   evidenceRefs: ["snapshot-canonical-1:videos:1", "snapshot-canonical-1:videos:2"],
   sampleRows: [
    { videoId: "video-1", title: "Measured video", views: 240, watchTime: 12, publishedAt: "2026-09-01" },
    { videoId: "video-2", title: "Partial video", views: null, watchTime: 4, publishedAt: null },
   ],
  }],
  ...overrides,
 } as any)

 it("projects only canonical video rows and preserves row provenance, window and missing metrics", () => {
  const result = buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeBundle(),
   now: new Date("2026-10-15T00:00:00.000Z"),
  })

  expect(result).toHaveLength(2)
  expect(result[0].evidenceIds).toEqual(["snapshot-canonical-1:videos:1"])
  expect(result[0].kind).toBe("performance_candidate")
  expect(result[0].baselineValue).toBeNull()
  expect(result[0].relativeDelta).toBeNull()
  expect(result[0].currentValue).toBe(240)
  expect(result[0].provenance).toMatchObject({
   sourceOwner: "analytics-canon",
   window: "90d",
   sourceSnapshotId: "snapshot-canonical-1",
   datasetId: "videos",
  })
  expect(result.find((item) => item.videoId === "video-2")?.currentValue).toBeNull()
 })

 it("fails closed when the canonical bundle belongs to another channel", () => {
  expect(buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeBundle({ channelId: "channel-2" }),
  })).toEqual([])
 })

 it("degrades opportunity confidence for partial and stale datasets", () => {
  const makeStatusBundle = (status: "partial" | "stale") => {
   const bundle = makeBundle()
   bundle.datasets[0].status = status
   return bundle
  }
  const partial = buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeStatusBundle("partial"),
  })
  const stale = buildOpportunityEvidenceFromCanonicalBundle({
   channelId: "channel-1",
   bundle: makeStatusBundle("stale"),
  })

  expect(partial[0].confidence).toBeLessThan(40)
  expect(stale[0].confidence).toBeLessThan(partial[0].confidence)
 })

 it("does not produce metric opportunities from failed or unavailable video datasets", () => {
  for (const status of ["failed", "unavailable"]) {
   const bundle = makeBundle({
    datasets: [{ ...makeBundle().datasets[0], status }],
   })
   expect(buildOpportunityEvidenceFromCanonicalBundle({ channelId: "channel-1", bundle })).toEqual([])
  }
 })
})


describe("Opportunity Radar to Tactics Engine handoff contract", () => {
  it("fails closed until an opportunity has been accepted", async () => {
    const { buildOpportunityTacticsPacket } = await import("./OpportunityIntelligence")
    const opportunity = {
      id: "op-1", kind: "performance_candidate" as const, channelId: "channel-1",
      evidenceIds: ["ev-1"], confidence: 70, impactScore: 80,
      provenance: { sourceOwner: "analytics-canon" as const, sourceSnapshotId: "snapshot-1", datasetId: "videos", window: "90d", datasetStatus: "available" },
    }
    expect(buildOpportunityTacticsPacket({ opportunity, lifecycleState: "reviewed", createdAt: "2026-10-17T12:00:00.000Z" }))
      .toMatchObject({ ok: false, code: "opportunity_not_accepted" })
  })

  it("preserves canonical evidence and source provenance in an accepted packet", async () => {
    const { buildOpportunityTacticsPacket } = await import("./OpportunityIntelligence")
    const opportunity = {
      id: "op-1", kind: "performance_candidate" as const, channelId: "channel-1",
      evidenceIds: ["ev-1", "ev-2"], confidence: 70, impactScore: 80,
      baselineValue: null, relativeDelta: null,
      provenance: { sourceOwner: "analytics-canon" as const, sourceSnapshotId: "snapshot-1", datasetId: "videos", window: "90d", datasetStatus: "available" },
    }
    const result = buildOpportunityTacticsPacket({ opportunity, lifecycleState: "accepted", createdAt: "2026-10-17T12:00:00.000Z" })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.packet).toMatchObject({
      schemaVersion: "vt-opportunity-tactics-handoff-v1",
      opportunityId: "op-1", channelId: "channel-1", validationState: "accepted",
      evidenceIds: ["ev-1", "ev-2"],
      provenance: { sourceOwner: "analytics-canon", sourceSnapshotId: "snapshot-1", datasetId: "videos", window: "90d" },
    })
    expect(result.packet.limitations).toContain("Baseline and relative change are unknown.")
  })

  it("rejects accepted opportunities without evidence IDs", async () => {
    const { buildOpportunityTacticsPacket } = await import("./OpportunityIntelligence")
    expect(buildOpportunityTacticsPacket({
      opportunity: { id: "op-1", kind: "performance_candidate" as const, channelId: "channel-1", evidenceIds: [], confidence: 50, impactScore: 50 },
      lifecycleState: "accepted", createdAt: "2026-10-17T12:00:00.000Z",
    })).toMatchObject({ ok: false, code: "missing_evidence" })
  })

  it("rejects mismatched tactic source/evidence and requires creator approval plus operation identity", async () => {
    const { buildOpportunityTacticsPacket, validateTacticProposal, canDispatchTacticProposal } = await import("./OpportunityIntelligence")
    const opportunity = {
      id: "op-1", kind: "performance_candidate" as const, channelId: "channel-1",
      evidenceIds: ["ev-1", "ev-2"], confidence: 70, impactScore: 80,
    }
    const result = buildOpportunityTacticsPacket({ opportunity, lifecycleState: "accepted", createdAt: "2026-10-17T12:00:00.000Z" })
    if (!result.ok) throw new Error("fixture packet should be valid")
    const tactic = {
      id: "tactic-1", sourceOpportunityId: "op-1", channelId: "channel-1", evidenceIds: ["ev-1"],
      targetOutcome: "Improve qualified watch time", actionSteps: ["Draft a follow-up"],
      prerequisites: [], expectedImpact: { hypothesis: "May improve watch time", confidence: 0.55, horizon: "28d" },
      risks: ["Relative ranking is not causal evidence"],
      successMetrics: [{ metricId: "watch_time", targetDirection: "increase", guardrail: false }],
      approvalState: "pending" as const, operationId: null,
    }
    expect(validateTacticProposal(result.packet, { ...tactic, sourceOpportunityId: "other" }))
      .toContain("Tactic source opportunity does not match the accepted opportunity.")
    expect(validateTacticProposal(result.packet, { ...tactic, evidenceIds: ["unknown"] }))
      .toContain("Tactic references evidence outside the accepted opportunity packet.")
    expect(canDispatchTacticProposal(result.packet, tactic).allowed).toBe(false)
    expect(canDispatchTacticProposal(result.packet, { ...tactic, approvalState: "approved" }).allowed).toBe(false)
    expect(canDispatchTacticProposal(result.packet, { ...tactic, approvalState: "approved", operationId: "op:channel-1:tactic-1" }))
      .toEqual({ allowed: true, reasons: [] })
  })
})


describe("canonical tool-chain registration for Opportunity Radar → Tactics Engine", () => {
  it("keeps the Radar tool distinct and routes accepted packets to Tactics Engine for review", async () => {
    const { VIEWTUBE_TOOL_CAPABILITIES, VIEWTUBE_SUGGESTED_TOOL_CHAINS, createOpportunityTacticsActionPacket } =
      await import("../viewTubeToolChains")
    const radar = VIEWTUBE_TOOL_CAPABILITIES.find((tool) => tool.id === "opportunity-radar")
    const tactics = VIEWTUBE_TOOL_CAPABILITIES.find((tool) => tool.id === "tactics-engine")
    const chain = VIEWTUBE_SUGGESTED_TOOL_CHAINS.find((item) => item.id === "opportunity-radar-to-tactics")

    expect(radar).toMatchObject({ kind: "studio-tool", status: "partial", produces: ["evidence"] })
    expect(tactics).toMatchObject({ kind: "studio-tool", accepts: expect.arrayContaining(["evidence"]) })
    expect(chain?.steps.map((step) => step.toolId)).toEqual(["opportunity-radar", "tactics-engine", "project-calendar"])

    const packet = {
      schemaVersion: "vt-opportunity-tactics-handoff-v1" as const,
      opportunityId: "op-accepted",
      channelId: "channel-1",
      videoId: "video-1",
      entity: "Measured candidate",
      metric: "views",
      kind: "performance_candidate" as const,
      validationState: "accepted" as const,
      createdAt: "2026-10-17T12:00:00.000Z",
      evidenceIds: ["ev-1"],
      confidence: 70,
      impactScore: 80,
      currentValue: 1200,
      baselineValue: null,
      relativeDelta: null,
      provenance: { sourceOwner: "analytics-canon" as const, sourceSnapshotId: "snapshot-1", datasetId: "videos", window: "90d", datasetStatus: "available" },
      limitations: ["Baseline and relative change are unknown."],
    }
    const actionPacket = createOpportunityTacticsActionPacket(packet)
    expect(actionPacket).toMatchObject({
      sourceToolId: "opportunity-radar",
      payloadKind: "evidence",
      suggestedTargets: ["tactics-engine"],
      intent: "propose",
      approvalState: "pending",
      evidence: ["ev-1"],
      idempotencyKey: "opportunity-tactics:channel-1:op-accepted:snapshot-1",
    })
    expect(actionPacket.payload).toEqual(packet)
  })
})

  it("refuses malformed or unaccepted packets at the canonical action-packet boundary", async () => {
    const { createOpportunityTacticsActionPacket } = await import("../viewTubeToolChains")
    const valid = {
      schemaVersion: "vt-opportunity-tactics-handoff-v1" as const,
      opportunityId: "op-accepted", channelId: "channel-1", videoId: null, entity: "Candidate", metric: "views",
      kind: "performance_candidate" as const, validationState: "accepted" as const,
      createdAt: "2026-10-17T12:00:00.000Z", evidenceIds: ["ev-1"], confidence: 70, impactScore: 80,
      currentValue: 1200, baselineValue: null, relativeDelta: null,
      provenance: { sourceOwner: "analytics-canon" as const, sourceSnapshotId: "snapshot-1", datasetId: "videos", window: "90d", datasetStatus: "available" },
      limitations: [],
    }
    expect(() => createOpportunityTacticsActionPacket({ ...valid, validationState: "reviewed" } as any)).toThrow(
      "Only accepted opportunities with canonical evidence can be handed to Tactics Engine.",
    )
    expect(() => createOpportunityTacticsActionPacket({ ...valid, evidenceIds: [] })).toThrow(
      "Only accepted opportunities with canonical evidence can be handed to Tactics Engine.",
    )
  })
