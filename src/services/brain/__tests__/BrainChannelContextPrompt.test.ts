import { describe, expect, it } from "vitest"
import { buildChannelContextInstruction } from "../../aiBrainCommandInterface"
import type { ChannelContextProfile } from "../../../context/ChannelContextProfile"

const emptyProfile: ChannelContextProfile = {
  identity: {}, goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
}

describe("buildChannelContextInstruction", () => {
  it("omits an empty profile", () => {
    expect(buildChannelContextInstruction(emptyProfile)).toBe("")
    expect(buildChannelContextInstruction(null)).toBe("")
  })

  it("includes creator answers while marking them as unverified context", () => {
    const profile: ChannelContextProfile = {
      ...emptyProfile,
      identity: { name: "History Lab", niche: "Military history" },
      goals: { primaryGoal: "Grow returning viewers" },
      content: { blockedThemes: ["unverified conspiracy claims"], types: ["Explainers"] },
      brand: { voice: "Clear, curious", creativity: 7 },
      intelligence: { sources: ["Public YouTube videos"], capabilities: ["Research"] },
    }
    const result = buildChannelContextInstruction(profile)
    expect(result).toContain("SAVED CHANNEL CONTEXT (creator-provided; not independently verified)")
    expect(result).toContain("Channel name: History Lab")
    expect(result).toContain("Primary goal: Grow returning viewers")
    expect(result).toContain("Themes to avoid: unverified conspiracy claims")
    expect(result).toContain("Requested creativity (1–10): 7")
    expect(result).toContain("not a substitute for runtime authorization")
  })

  it("omits blank strings and empty arrays rather than adding empty claims", () => {
    const profile: ChannelContextProfile = {
      ...emptyProfile,
      identity: { name: "  ", competitors: ["", "  "] },
      content: { priorityThemes: ["Documentary history"] },
    }
    const result = buildChannelContextInstruction(profile)
    expect(result).not.toContain("Channel name:")
    expect(result).not.toContain("Competitors or inspiration channels:")
    expect(result).toContain("Priority themes: Documentary history")
  })
})
