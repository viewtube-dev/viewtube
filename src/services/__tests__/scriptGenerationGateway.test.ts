import { describe, expect, it, vi } from "vitest"
import { generateScript } from "../gemini"
import { emptyScriptProject } from "../../features/script-architect/scriptProjectStore"
import { buildScriptBudget } from "../scriptBudget"

describe("Script Architect provider boundary", () => {
 it("requires and uses the supplied BrainRuntime JSON task instead of a provider fallback", async () => {
  const project = emptyScriptProject()
  const budget = buildScriptBudget(project)
  const task = vi.fn().mockResolvedValue({
   outline: [],
   sections: [],
   visualSuggestions: [],
   shortsIdeas: [],
   assumptions: [],
   groundingNotes: [],
  })
  const result = await generateScript(project, budget, undefined, task)
  expect(task).toHaveBeenCalledWith(expect.objectContaining({
   userText: expect.stringContaining("SECTION PLAN"),
   responseSchema: expect.objectContaining({ type: "OBJECT" }),
  }))
  expect(result.sections).toHaveLength(budget.sections.length)
 })
 it("propagates the governed task failure without retrying through a direct provider path", async () => {
  const project = emptyScriptProject()
  const budget = buildScriptBudget(project)
  const task = vi.fn().mockRejectedValue(new Error("BrainRuntime unavailable"))
  await expect(generateScript(project, budget, undefined, task))
   .rejects.toThrow("BrainRuntime unavailable")
  expect(task).toHaveBeenCalledTimes(1)
 })
})
