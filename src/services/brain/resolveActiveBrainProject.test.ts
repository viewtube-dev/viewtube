import { describe, expect, it } from "vitest"
import { resolveActiveBrainProject } from "./resolveActiveBrainProject"

const projects = [
  { id: "draft", status: "draft", name: "Draft project" },
  { id: "active", status: "active", name: "Active project" },
]

describe("resolveActiveBrainProject", () => {
  it("returns no project when the creator explicitly cleared project context", () => {
    expect(resolveActiveBrainProject(projects, "active", true)).toBeNull()
  })

  it("prefers the explicitly selected project over the active fallback", () => {
    expect(resolveActiveBrainProject(projects, "draft")?.id).toBe("draft")
  })

  it("uses the active project when no explicit project is selected", () => {
    expect(resolveActiveBrainProject(projects, null)?.id).toBe("active")
  })

  it("returns no project when there is no selected or active project", () => {
    expect(resolveActiveBrainProject([{ id: "draft", status: "draft" }], null)).toBeNull()
  })
})
