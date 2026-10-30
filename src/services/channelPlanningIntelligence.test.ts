import { beforeEach, describe, expect, it, vi } from "vitest"

const { generateJsonObject } = vi.hoisted(() => ({ generateJsonObject: vi.fn() }))
vi.mock("./brain/runtime/BrainModelGateway", () => ({
 defaultBrainModelGateway: { generateJsonObject },
}))

import { generateChannelPlanningSuggestions } from "./channelPlanningIntelligence"

beforeEach(() => generateJsonObject.mockReset())

describe("channel planning gateway boundary", () => {
 it("uses the canonical JSON gateway with channel context and a typed response schema", async () => {
  generateJsonObject.mockResolvedValue([{
   text: "Publish a restoration comparison",
   category: "Content",
   rationale: "Builds on the current project backlog",
   evidence: "Active restoration project",
  }])

  await expect(generateChannelPlanningSuggestions("todo", {
   channelTitle: "Workshop Stories",
   targetNiche: "restoration",
   channelHub: { toDos: [{ text: "Edit the radio repair" }] },
  })).resolves.toEqual([{
   text: "Publish a restoration comparison",
   category: "Content",
   rationale: "Builds on the current project backlog",
   evidence: "Active restoration project",
  }])

  expect(generateJsonObject).toHaveBeenCalledWith(expect.objectContaining({
   capability: "thinking",
   responseSchema: expect.objectContaining({ type: "ARRAY" }),
   systemInstruction: expect.stringContaining("Workshop Stories"),
   userText: expect.stringContaining("authoritative creator context"),
  }))
 })
 it("returns no suggestions for an invalid structured payload", async () => {
  generateJsonObject.mockResolvedValue({ suggestions: "not-an-array" })
  await expect(generateChannelPlanningSuggestions("goal", {})).resolves.toEqual([])
 })
})
