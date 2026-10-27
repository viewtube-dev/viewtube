import { describe, expect, it } from "vitest"
import { scoreContext } from "./ChannelContextScoring"
import type { ChannelContextProfile } from "./ChannelContextProfile"

describe("scoreContext", () => {
  it("reports real missing field paths and 0% for an empty profile", () => {
    const result = scoreContext({ identity: {}, goals: {}, audience: {}, content: {}, brand: {}, intelligence: {} })
    expect(result.completionScore).toBe(0)
    expect(result.missingFields).toContain("identity.name")
    expect(result.missingFields).not.toContain("required_0")
  })

  it("counts required arrays only when they contain a meaningful value", () => {
    const context: ChannelContextProfile = {
      identity: { name: "Creator", description: "One sentence", niche: "History" },
      goals: { primaryGoal: "Grow", successDefinition: "Reach a sustainable weekly audience" },
      audience: { idealViewer: "Curious adults", problem: "Understand history", experienceLevel: "beginner", transformation: "Learn something useful" },
      content: { types: ["Explainers"], frequency: "Weekly" },
      brand: { voice: "Warm", creativity: 7 },
      intelligence: { sources: ["Public videos"], capabilities: ["Research"] },
    }
    expect(scoreContext(context).completionScore).toBe(100)
    expect(scoreContext(context).missingFields).toEqual([])
  })

  it("treats zero as a valid numeric answer and trims whitespace-only strings", () => {
    const result = scoreContext({
      identity: { name: "  ", description: " ", niche: "" },
      goals: { primaryGoal: "", successDefinition: "" },
      audience: { idealViewer: "", problem: "", experienceLevel: "", transformation: "" },
      content: { types: [], frequency: "" },
      brand: { voice: "", creativity: 0 },
      intelligence: { sources: [], capabilities: [] },
    })
    expect(result.completionScore).toBe(0)
  })
})
