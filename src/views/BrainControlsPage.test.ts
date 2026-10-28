import { describe, expect, it } from "vitest"
import { BRAIN_CAPABILITY_REGISTRY, BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS } from "../services/brain/BrainCapabilityRegistry"
import { getBrainCapabilityGroups } from "./BrainControlsPage"
import { capabilityPromptFor } from "../components/brain/BrainCapabilityBrowser"
import { isCreatorAnswerProfileEligible } from "../services/brain/CreatorAnswerEvidence"

describe("Brain controls capability discovery", () => {
  it("surfaces every registered capability exactly once", () => {
    const surfaced = getBrainCapabilityGroups().flatMap(group => group.capabilities.map(capability => capability.id))
    expect(surfaced).toHaveLength(BRAIN_CAPABILITY_REGISTRY.length)
    expect(new Set(surfaced).size).toBe(surfaced.length)
    expect([...surfaced].sort()).toEqual(BRAIN_CAPABILITY_REGISTRY.map(capability => capability.id).sort())
  })

  it("creates a non-executing composer draft for every capability", () => {
    for (const capability of BRAIN_CAPABILITY_REGISTRY) {
      const prompt = capabilityPromptFor(capability)
      expect(prompt).toContain(capability.label.toLowerCase())
      expect(prompt).toContain(capability.description)
      expect(prompt).toContain("Do not claim this capability ran")
    }
  })

  it("uses channel-scoped profiles without requiring a display name", () => {
    expect(isCreatorAnswerProfileEligible({
      channelScoped: true,
      profileName: "",
      activeChannelLabel: "My Channel",
    })).toBe(true)
  })

  it("only accepts an unscoped legacy profile when its name matches the active channel", () => {
    expect(isCreatorAnswerProfileEligible({
      channelScoped: false,
      profileName: "My Channel",
      activeChannelLabel: "@my   channel",
    })).toBe(true)
    expect(isCreatorAnswerProfileEligible({
      channelScoped: false,
      profileName: "Another Channel",
      activeChannelLabel: "My Channel",
    })).toBe(false)
  })

  it("provides a discoverable title, description, intents, and invocation limit for every capability", () => {
    for (const capability of BRAIN_CAPABILITY_REGISTRY) {
      expect(capability.label.trim(), capability.id).not.toBe("")
      expect(capability.description.trim(), capability.id).not.toBe("")
      expect(capability.intents.length, capability.id).toBeGreaterThan(0)
      expect(capability.maximumInvocationsPerTurn, capability.id).toBeGreaterThan(0)
      expect(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[capability.id], capability.id).toBeDefined()
    }
  })
})
