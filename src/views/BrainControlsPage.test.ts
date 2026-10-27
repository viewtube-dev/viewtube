import { describe, expect, it } from "vitest"
import { BRAIN_CAPABILITY_REGISTRY, BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS } from "../services/brain/BrainCapabilityRegistry"
import { getBrainCapabilityGroups } from "./BrainControlsPage"

describe("Brain controls capability discovery", () => {
  it("surfaces every registered capability exactly once", () => {
    const surfaced = getBrainCapabilityGroups().flatMap(group => group.capabilities.map(capability => capability.id))
    expect(surfaced).toHaveLength(BRAIN_CAPABILITY_REGISTRY.length)
    expect(new Set(surfaced).size).toBe(surfaced.length)
    expect([...surfaced].sort()).toEqual(BRAIN_CAPABILITY_REGISTRY.map(capability => capability.id).sort())
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
