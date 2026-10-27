import { describe, expect, it } from "vitest"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import {
  DEFAULT_BRAIN_USER_CONTROLS,
  type BrainUserControls,
} from "../../services/brain/BrainUserControls"
import type { BrainCapabilityDefinition } from "../../types"
import {
  capabilityPromptFor,
  filterBrainCapabilities,
  getBrainCapabilityAvailability,
} from "./BrainCapabilityBrowser"

const audienceCapability = {
  id: "audience-language",
  label: "Audience Language",
  description: "Find audience interests and wording.",
  intents: ["audience", "language"],
  requiresChannelData: false,
} as BrainCapabilityDefinition

const snapshot = {
  inferredProfile: { videoCount: 0 },
  brain: { activeProjects: 0 },
} as unknown as AIBrainContextSnapshot

const controls = (overrides: Partial<BrainUserControls> = {}): BrainUserControls => ({
  ...DEFAULT_BRAIN_USER_CONTROLS,
  ...overrides,
})

describe("Brain capability contracts", () => {
  it("filters capabilities by label, description, id, and intent", () => {
    expect(filterBrainCapabilities([audienceCapability], "audience")).toEqual([audienceCapability])
    expect(filterBrainCapabilities([audienceCapability], "language")).toEqual([audienceCapability])
    expect(filterBrainCapabilities([audienceCapability], "no-match")).toEqual([])
  })

  it("blocks requests when Brain is disabled", () => {
    const availability = getBrainCapabilityAvailability(
      audienceCapability,
      controls({ enabled: false }),
      snapshot,
    )

    expect(availability.status).toBe("blocked")
    expect(availability.label).toBe("Brain is off")
  })

  it("identifies missing channel data without misclassifying it as a permission block", () => {
    const availability = getBrainCapabilityAvailability(
      { ...audienceCapability, requiresChannelData: true },
      controls(),
      snapshot,
    )

    expect(availability.status).toBe("needs-channel-data")
    expect(availability.status).not.toBe("blocked")
  })

  it("builds a guided request that describes evidence limits without claiming execution", () => {
    const prompt = capabilityPromptFor(audienceCapability)

    expect(prompt).toContain("Help me with audience language.")
    expect(prompt).toContain("what the available evidence supports")
    expect(prompt).toContain("call out missing inputs or uncertainty")
    expect(prompt).toContain("Do not claim this capability ran")
  })
})
