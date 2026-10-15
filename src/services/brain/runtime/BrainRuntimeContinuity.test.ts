import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ runBrainTurn: vi.fn() }))

vi.mock("../BrainOrchestrator", () => ({ runBrainTurn: mocks.runBrainTurn }))
vi.mock("./BrainModelGateway", () => ({
 defaultBrainModelGateway: { generateStructuredResponse: vi.fn() },
}))

import { runBrainTask } from "./BrainRuntime"

describe("BrainRuntime assistant continuity adoption", () => {
 beforeEach(() => {
  mocks.runBrainTurn.mockReset()
  mocks.runBrainTurn.mockResolvedValue({ turn: { id: "turn-1" }, response: null })
 })

 it("passes one scoped evidence trace into live runtime context for the sidebar surface", async () => {
  await runBrainTask({
   surface: "sidebar-chatbot",
   channelId: "channel-a",
   projectId: "project-a",
   userText: "Analyze this video",
   snapshot: { evidencePack: { evidenceIds: ["evidence-2", "evidence-1"] } } as any,
   systemPrompt: "Base system prompt",
   growthContext: {} as any,
   allowModel: false,
   visibleContext: {
    route: "/studio",
    contentBuildId: "build-1",
    videoId: "video-1",
    title: "Current video",
   },
  } as any)

  const firstCall = mocks.runBrainTurn.mock.calls[0]
  if (!firstCall) throw new Error("Expected BrainRuntime to invoke the canonical orchestrator")
  const [legacyInput] = firstCall
  expect(legacyInput.visibleContext.assistantContinuityTrace).toMatchObject({
   version: "vt-brain-assistant-trace-v1",
   surface: "sidebar",
   scope: {
    channelId: "channel-a",
    projectId: "project-a",
    contentBuildId: "build-1",
    videoId: "video-1",
   },
   evidenceIds: ["evidence-1", "evidence-2"],
  })
  expect(legacyInput.systemPrompt).toContain("ASSISTANT CONTINUITY TRACE")
  expect(legacyInput.systemPrompt).toContain('"surface": "sidebar"')
 })
})
