import { describe, expect, it } from "vitest"
import { DEFAULT_BRAIN_USER_CONTROLS } from "../../../services/brain/BrainUserControls"
import { BRAIN_CAPABILITY_REGISTRY } from "../../../services/brain/BrainCapabilityRegistry"
import { filterBrainCapabilities, getBrainCapabilityAvailability, capabilityPromptFor } from "./BrainCapabilityBrowser"
import type { AIBrainContextSnapshot } from "../../../services/aiBrainCommandInterface"

const snapshot = (videoCount: number) => ({
 inferredProfile: { videoCount },
 brain: { activeProjects: 1 },
}) as AIBrainContextSnapshot

describe("Brain capability browser", () => {
 it("searches capability names, descriptions, IDs, and intents without mutating the registry", () => {
  const originalIds = BRAIN_CAPABILITY_REGISTRY.map((item) => item.id)
  expect(filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, "analytics").some((item) => item.id === "statistics-intelligence")).toBe(true)
  expect(filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, "content_generation").some((item) => item.id === "content-generation")).toBe(true)
  expect(filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, "no-such-capability")).toEqual([])
  expect(BRAIN_CAPABILITY_REGISTRY.map((item) => item.id)).toEqual(originalIds)
 })

 it("explains when Brain is disabled and does not offer an enabled-looking state", () => {
  const result = getBrainCapabilityAvailability(BRAIN_CAPABILITY_REGISTRY[0], { ...DEFAULT_BRAIN_USER_CONTROLS, enabled: false }, snapshot(12))
  expect(result.status).toBe("blocked")
  expect(result.reason).toContain("Enable Brain")
 })

 it("respects disabled analytics permissions", () => {
  const capability = BRAIN_CAPABILITY_REGISTRY.find((item) => item.id === "statistics-intelligence")!
  const result = getBrainCapabilityAvailability(capability, { ...DEFAULT_BRAIN_USER_CONTROLS, allowAnalytics: false }, snapshot(12))
  expect(result.status).toBe("blocked")
  expect(result.label).toBe("Analytics access off")
 })

 it("distinguishes missing channel data from permission blocks", () => {
  const capability = BRAIN_CAPABILITY_REGISTRY.find((item) => item.id === "analytics-diagnosis")!
  const result = getBrainCapabilityAvailability(capability, DEFAULT_BRAIN_USER_CONTROLS, snapshot(0))
  expect(result.status).toBe("needs-channel-data")
  expect(result.reason).toContain("Connect or sync")
 })

 it("blocks project-dependent capabilities when project access is disabled", () => {
  const capability = BRAIN_CAPABILITY_REGISTRY.find((item) => item.id === "daily-oracle")!
  const result = getBrainCapabilityAvailability(capability, { ...DEFAULT_BRAIN_USER_CONTROLS, allowProjects: false }, snapshot(12))
  expect(result.status).toBe("blocked")
  expect(result.label).toBe("Project access off")
 })

 it("reports missing project context without pretending the capability is ready", () => {
  const capability = BRAIN_CAPABILITY_REGISTRY.find((item) => item.id === "daily-oracle")!
  const noProject = { ...snapshot(12), brain: { activeProjects: 0 } }
  const result = getBrainCapabilityAvailability(capability, DEFAULT_BRAIN_USER_CONTROLS, noProject)
  expect(result.status).toBe("needs-project-context")
  expect(result.reason).toContain("Select or create a project")
 })

 it("creates a request prompt that explicitly preserves evidence and execution boundaries", () => {
  const capability = BRAIN_CAPABILITY_REGISTRY.find((item) => item.id === "analytics-diagnosis")!
  const prompt = capabilityPromptFor(capability)
  expect(prompt).toContain("available evidence")
  expect(prompt).toContain("Do not claim this capability ran")
 })
})
