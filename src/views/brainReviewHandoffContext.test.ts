import { describe, expect, it } from "vitest"
import { resolveBrainReviewHandoffContext } from "./brainReviewHandoffContext"

const projects = [
  { id: "draft", status: "draft", contentBuildId: "build-draft" },
  { id: "active", status: "active", contentBuildId: "build-active" },
]

describe("resolveBrainReviewHandoffContext", () => {
  it("does not reattach a project build after the creator clears project context", () => {
    expect(resolveBrainReviewHandoffContext(projects, "active", true, [])).toEqual({
      project: null,
      selectedContentId: null,
    })
  })

  it("preserves explicit video evidence even when project context was cleared", () => {
    expect(resolveBrainReviewHandoffContext(projects, "active", true, ["video:123", "metric:views"])).toEqual({
      project: null,
      selectedContentId: "video:123",
    })
  })

  it("uses the resolved project build only when project context remains active", () => {
    expect(resolveBrainReviewHandoffContext(projects, "active", false, [])).toEqual({
      project: projects[1],
      selectedContentId: "build-active",
    })
  })

  it("prefers an explicit video evidence reference to the project build", () => {
    expect(resolveBrainReviewHandoffContext(projects, "active", false, ["video:123"])).toEqual({
      project: projects[1],
      selectedContentId: "video:123",
    })
  })
})
