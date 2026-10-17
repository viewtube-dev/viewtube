import { describe, expect, it } from "vitest"
import { buildAudiencePulseSignals, classifyAudienceIntent } from "./audiencePulse"

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
    expect(signals[0].evidenceIds).toEqual(["c1", "c2"])
    expect(signals[0].sourceWindow).toEqual({
      start: "2026-10-01T10:00:00.000Z",
      end: "2026-10-02T10:00:00.000Z",
    })
    expect(signals[0].suggestedTargets).toContain("comment-responder")
    expect(signals[1].videoId).toBe("v2")
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
    expect(signal.suggestedTargets).toEqual(["content-architect", "comment-responder"])
    expect(signal).not.toHaveProperty("publish")
    expect(signal).not.toHaveProperty("execute")
  })
})
