import { describe, expect, it } from "vitest"
import { audiencePulseSignalToBrainClaim, buildAudiencePulseSignals, classifyAudienceIntent, projectCommentThreadsToAudienceFeedback } from "./audiencePulse"
import { VIEWTUBE_TOOL_CAPABILITIES } from "../../services/viewTubeToolChains"
import { buildAudiencePulseProposalPacket } from "./audiencePulseHandoff"

describe("classifyAudienceIntent", () => {
  it("classifies explicit requests with bounded confidence", () => {
    expect(classifyAudienceIntent("Could you make a tutorial on this?")).toEqual({
      intent: "request",
      confidence: 0.72,
    })
  })

  it("leaves ambiguous and missing text unclassified", () => {
    expect(classifyAudienceIntent("Interesting")).toEqual({ intent: "unknown", confidence: null })
    expect(classifyAudienceIntent("")).toEqual({ intent: "unknown", confidence: null })
    expect(classifyAudienceIntent(undefined)).toEqual({ intent: "unknown", confidence: null })
  })

  it("does not choose between conflicting intent cues", () => {
    expect(classifyAudienceIntent("Thanks, but this is broken")).toEqual({
      intent: "unknown",
      confidence: null,
    })
  })
})

describe("projectCommentThreadsToAudienceFeedback", () => {
  it("adapts existing YouTube comment threads without replacing canonical IDs", () => {
    const records = projectCommentThreadsToAudienceFeedback([
      {
        id: "thread-1",
        snippet: {
          videoId: "video-1",
          topLevelComment: {
            id: "comment-1",
            snippet: { textOriginal: "Could you explain this?", publishedAt: "2026-10-01T10:00:00Z" },
          },
        },
      },
    ], "channel-1")

    expect(records).toEqual([{
      sourceId: "comment-1",
      source: "comment",
      text: "Could you explain this?",
      channelId: "channel-1",
      videoId: "video-1",
      observedAt: "2026-10-01T10:00:00Z",
    }])
  })
})

describe("buildAudiencePulseSignals", () => {
  it("clusters only same-intent feedback within the same scope and deduplicates canonical source IDs", () => {
    const signals = buildAudiencePulseSignals([
      { sourceId: "c1", source: "comment", text: "Could you explain this?", channelId: "ch1", videoId: "v1", observedAt: "2026-10-01T10:00:00Z" },
      { sourceId: "c1", source: "comment", text: "Could you explain this?", channelId: "ch1", videoId: "v1", observedAt: "2026-10-01T10:00:00Z" },
      { sourceId: "c2", source: "comment", text: "Please show a tutorial", channelId: "ch1", videoId: "v1", observedAt: "2026-10-02T10:00:00Z" },
      { sourceId: "c3", source: "comment", text: "Please show a tutorial", channelId: "ch1", videoId: "v2", observedAt: "2026-10-03T10:00:00Z" },
    ])

    expect(signals).toHaveLength(2)
    expect(signals[0].sourceIds).toEqual(["c1", "c2"])
    expect(signals[0].evidenceIds).toEqual(["comment:c1", "comment:c2"])
    expect(signals[0].sourceWindow).toEqual({
      start: "2026-10-01T10:00:00.000Z",
      end: "2026-10-02T10:00:00.000Z",
    })
    expect(signals[0].suggestedTargets).toContain("comment-responder")
    expect(signals[1].videoId).toBe("v2")
  })

  it("does not merge different scopes when IDs contain key delimiters", () => {
    const signals = buildAudiencePulseSignals([
      { sourceId: "a", source: "comment", text: "Could you explain this?", channelId: "channel:one", videoId: "video", projectId: "project" },
      { sourceId: "b", source: "comment", text: "Could you explain this?", channelId: "channel", videoId: "one:video", projectId: "project" },
    ])

    expect(signals).toHaveLength(2)
    expect(new Set(signals.map((signal) => signal.channelId))).toEqual(new Set(["channel:one", "channel"]))
  })

  it("preserves unknown observations without inventing intent or action targets", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "p1", source: "community-post", text: "Interesting", channelId: "ch1" },
    ])

    expect(signal.intent).toBe("unknown")
    expect(signal.confidence).toBeNull()
    expect(signal.suggestedTargets).toEqual([])
    expect(signal.limitations).toContain("Source timestamps are missing or invalid.")
  })

  it("ignores records without canonical source IDs and never emits empty signals", () => {
    expect(buildAudiencePulseSignals([
      { sourceId: " ", source: "comment", text: "Thanks", channelId: "ch1" },
      { sourceId: "", source: "community-post", text: "Please explain", channelId: "ch1" },
    ])).toEqual([])
  })

  it("routes proposed opportunities without executing or publishing them", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "c7", source: "comment", text: "I wish you made more videos about this", channelId: "ch1" },
    ])

    expect(signal.intent).toBe("desire")
    expect(signal.suggestedTargets).toEqual(["ai-brain", "opportunity-radar"])
    expect(signal.limitations).toContain("Content Architect and Experiment Lab are not registered as canonical handoff receivers; their routing is unavailable rather than simulated.")
    expect(signal).not.toHaveProperty("publish")
    expect(signal).not.toHaveProperty("execute")
  })
  it("only suggests destinations registered in the canonical tool capability registry", () => {
    const registeredTargets = new Set(VIEWTUBE_TOOL_CAPABILITIES.map((tool) => tool.id))
    const signals = buildAudiencePulseSignals([
      { sourceId: "c11", source: "comment", text: "Could you make a tutorial?", channelId: "ch1" },
      { sourceId: "c12", source: "comment", text: "This is broken", channelId: "ch1" },
      { sourceId: "p11", source: "community-post", text: "I want more videos about this", channelId: "ch1" },
    ])

    for (const signal of signals) {
      for (const target of signal.suggestedTargets) {
        expect(registeredTargets.has(target), `unregistered suggested target: ${target}`).toBe(true)
      }
    }
  })

  it("keeps same-ID records from different source systems distinct in provenance and counts", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "shared-id", source: "comment", text: "Could you explain this?", channelId: "ch1" },
      { sourceId: "shared-id", source: "community-post", text: "Could you explain this?", channelId: "ch1" },
    ])

    expect(signal.sourceIds).toEqual(["shared-id"])
    expect(signal.sourceReferences).toEqual([
      { source: "comment", sourceId: "shared-id" },
      { source: "community-post", sourceId: "shared-id" },
    ])
    expect(signal.evidenceIds).toEqual(["comment:shared-id", "community-post:shared-id"])
    expect(signal.sourceKinds).toEqual(["comment", "community-post"])
    expect(signal.sourceReferences).toHaveLength(2)
    expect(audiencePulseSignalToBrainClaim(signal).value).toBe(2)
  })

})

describe("buildAudiencePulseProposalPacket", () => {
  it("creates a stable pending evidence proposal only for compatible canonical receivers", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "c-proposal", source: "comment", text: "Could you make a tutorial?", channelId: "ch-proposal", videoId: "v-proposal" },
    ])
    const packet = buildAudiencePulseProposalPacket(signal)

    expect(packet).not.toBeNull()
    expect(packet?.id).toMatch(/^audience-pulse-proposal:/)
    expect(buildAudiencePulseProposalPacket(signal)?.id).toBe(packet?.id)
    const updatedEvidence = buildAudiencePulseProposalPacket({
      ...signal,
      evidenceIds: [...signal.evidenceIds, "comment:new-evidence"],
    })
    expect(updatedEvidence?.id).not.toBe(packet?.id)
    expect(packet?.sourceToolId).toBe("comment-responder")
    expect(packet?.payloadKind).toBe("evidence")
    expect(packet?.intent).toBe("propose")
    expect(packet?.approvalState).toBe("pending")
    expect(packet?.suggestedTargets).toEqual(["ai-brain", "opportunity-radar"])
    expect(packet?.evidence).toEqual(signal.evidenceIds)
    expect(packet?.provenance).toContain("source:comment:c-proposal")
    for (const targetId of packet?.suggestedTargets || []) {
      const target = VIEWTUBE_TOOL_CAPABILITIES.find((tool) => tool.id === targetId)
      expect(target?.accepts).toContain("evidence")
    }
  })

  it("does not create a proposal for unknown or evidence-free signals", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "c-unknown", source: "comment", text: "Interesting", channelId: "ch-proposal" },
    ])
    expect(buildAudiencePulseProposalPacket(signal)).toBeNull()
    expect(buildAudiencePulseProposalPacket({ ...signal, intent: "request", evidenceIds: [] })).toBeNull()
  })
})

describe("audiencePulseSignalToBrainClaim", () => {
  it("preserves evidence provenance and distinguishes inferred intent from observed unknowns", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "c9", source: "comment", text: "Could you explain this?", channelId: "ch1", videoId: "v1", observedAt: "2026-10-01T10:00:00Z" },
    ])
    const claim = audiencePulseSignalToBrainClaim(signal)

    expect(claim.epistemicState).toBe("INFERRED")
    expect(claim.value).toBe(1)
    expect(claim.provenance.evidenceIds).toEqual(["comment:c9"])
    expect(claim.provenance.sourceVersion).toBe("audience-pulse-patterns-v1")
    expect(claim.freshness).toBe("unknown")
    expect(claim.timeframe?.start).toBe("2026-10-01T10:00:00.000Z")
  })

  it("does not claim intent or confidence when the text is ambiguous", () => {
    const [signal] = buildAudiencePulseSignals([
      { sourceId: "c10", source: "comment", text: "Interesting", channelId: "ch1" },
    ])
    const claim = audiencePulseSignalToBrainClaim(signal)

    expect(claim.epistemicState).toBe("OBSERVED")
    expect(claim.confidence).toBeNull()
    expect(claim.value).toBe(1)
    expect(claim.timeframe).toBeNull()
  })
})
