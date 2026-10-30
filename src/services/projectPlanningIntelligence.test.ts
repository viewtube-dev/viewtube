import { beforeEach, describe, expect, it, vi } from "vitest"

const { generateJsonObject } = vi.hoisted(() => ({ generateJsonObject: vi.fn() }))
vi.mock("./brain/runtime/BrainModelGateway", () => ({
 defaultBrainModelGateway: { generateJsonObject },
}))

import { generateProjectPlanningSuggestions } from "./projectPlanningIntelligence"

beforeEach(() => generateJsonObject.mockReset())

describe("project planning gateway boundary", () => {
 it("uses the canonical JSON gateway with the supplied project and channel context", async () => {
  generateJsonObject.mockResolvedValue([{
   text: "Record the prototype walkthrough",
   category: "Production",
   rationale: "Closes the next project milestone",
   evidence: "Current project plan",
  }])
  const project = { id: "project-1", name: "Radio restoration", status: "active", concept: "Repair a vintage radio" } as any
  const brain = { targetNiche: "restoration", channelProfile: { audience: "DIY repairers" } } as any

  await expect(generateProjectPlanningSuggestions("todo", project, brain)).resolves.toMatchObject([{
   text: "Record the prototype walkthrough",
   category: "Production",
  }])

  expect(generateJsonObject).toHaveBeenCalledWith(expect.objectContaining({
   capability: "thinking",
   responseSchema: expect.objectContaining({ type: "ARRAY" }),
  }))
  const input = generateJsonObject.mock.calls[0][0]
  expect(input.userText).toContain("Radio restoration")
  expect(input.userText).toContain("DIY repairers")
 })
 it("returns no suggestions for an invalid structured payload", async () => {
  generateJsonObject.mockResolvedValue({ tasks: [] })
  await expect(generateProjectPlanningSuggestions("goal", {} as any, {} as any)).resolves.toEqual([])
 })
})
