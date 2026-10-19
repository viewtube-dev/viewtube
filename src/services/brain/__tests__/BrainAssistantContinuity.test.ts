import { describe, expect, it } from "vitest"
import { resolveBrainAssistantContinuity } from "../BrainAssistantContinuity"

describe("resolveBrainAssistantContinuity", () => {
 it("uses the shared task-aware resolver and emits an explainability trace", () => {
  const result = resolveBrainAssistantContinuity({
   location: {
    surface: "sidebar",
    route: "/studio/projects",
    toolId: "project-planner",
    channelId: "channel-1",
    projectId: "project-2",
   },
   userText: "Write 3 titles about cozy games",
   contextSections: [
    "System prompt\nFollow the safety and evidence rules.",
    "Active project context\nProject details here.",
    "Channel knowledge\nCreator preferences here.",
    "Recent conversation\nOlder discussion here.",
   ],
   evidenceIds: ["ev-2", "ev-1", "ev-2"],
   maximumCharacters: 2000,
  })

  expect(result.version).toBe("vt-brain-assistant-context-v1")
  expect(result.taskProfile.id).toBe("creator_asset_draft")
  expect(result.contextKey).toContain("channel-1:project-2")
  expect(result.trace.surface).toBe("sidebar")
  expect(result.trace.selectedSectionIds).toContain("system_prompt")
  expect(result.trace.evidenceIds).toEqual(["ev-1", "ev-2"])
 })

 it("records missing scope and budget omissions instead of inventing context", () => {
  const result = resolveBrainAssistantContinuity({
   location: { surface: "brain_hub", videoId: "video-9" },
   userText: "Analyze my channel analytics",
   contextSections: [
    "System prompt\nSystem rules.",
    "Channel evidence\n".concat("x".repeat(300)),
    "Evidence quality\n".concat("y".repeat(300)),
   ],
   evidenceIds: [],
   maximumCharacters: 80,
  })

  expect(result.trace.limitations).toContain("No channel scope was provided; channel-specific knowledge must not be inferred.")
  expect(result.trace.limitations).toContain("No evidence identifiers were supplied for an evidence trace.")
  expect(result.trace.omittedSectionIds.length).toBeGreaterThan(0)
 })
})
