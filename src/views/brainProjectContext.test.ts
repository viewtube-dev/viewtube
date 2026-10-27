import { describe, expect, it } from "vitest"
import { resolveActiveBrainProject } from "./brainProjectContext"

const projects = [
  { id: "project-1", name: "Draft A", status: "active" },
  { id: "project-2", name: "Draft B", status: "paused" },
]

describe("resolveActiveBrainProject", () => {
  it("returns no project when project context was explicitly cleared", () => {
    expect(resolveActiveBrainProject(projects, "project-2", true)).toBeNull()
  })

  it("uses the selected project when context has not been cleared", () => {
    expect(resolveActiveBrainProject(projects, "project-2", false)).toBe(projects[1])
  })

  it("falls back to the active project when no selected project exists", () => {
    expect(resolveActiveBrainProject(projects, null, false)).toBe(projects[0])
  })

  it("returns no project when there is no selection or active project", () => {
    expect(resolveActiveBrainProject([], null, false)).toBeNull()
  })
})
