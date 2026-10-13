import { describe, expect, it } from "vitest"
import {
  inferAssistantTargetTool,
  listAssistantIntelligenceSystems,
} from "./assistantIntelligenceSystem"

describe("assistant intelligence system registry", () => {
  it("lists static Brain systems and dashboard widget systems after module initialization", () => {
    const systems = listAssistantIntelligenceSystems()

    expect(systems.some(system => system.id === "central-brain-memory")).toBe(true)
    expect(systems.some(system => system.id.startsWith("widget:"))).toBe(true)
  })

  it("continues to resolve creator-intent routing from the assembled registry", () => {
    expect(inferAssistantTargetTool("help me with my AI Journal")).toBe("brain-command-center")
  })
})
