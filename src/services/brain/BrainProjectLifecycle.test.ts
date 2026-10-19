import { describe, expect, it } from "vitest"
import { resolveBrainProjectLifecycle } from "./BrainProjectLifecycle"

describe("resolveBrainProjectLifecycle", () => {
 it("uses the canonical ContentBuild stage and limits capabilities to that phase", () => {
  const result = resolveBrainProjectLifecycle({
   contentBuild: {
    stage: "package",
    profile: { audiencePromise: "A practical guide for new creators" },
    workflow: { currentStepId: "metadata", completedStepIds: [], blockerIds: [] },
   },
  })
  expect(result.currentPhase).toBe("package")
  expect(result.sourceStage).toBe("package")
  expect(result.relevantCapabilities).toContain("thumbnail")
  expect(result.relevantCapabilities).toContain("metadata")
  expect(result.relevantCapabilities).not.toContain("script")
  expect(result.audiencePromisePresent).toBe(true)
 })

 it("fails closed when canonical ContentBuild stage is absent", () => {
  expect(resolveBrainProjectLifecycle({ contentBuild: null })).toEqual({
   status: "insufficient_context",
   currentPhase: null,
   sourceStage: null,
   relevantCapabilities: [],
   audiencePromisePresent: false,
   blockers: ["A canonical ContentBuild snapshot is required to resolve project phase."],
  })
 })

 it("maps evaluation and learning to review capabilities rather than generation", () => {
  const result = resolveBrainProjectLifecycle({
   contentBuild: {
    stage: "evaluation",
    profile: {},
    workflow: { completedStepIds: [], blockerIds: [] },
   },
  })
  expect(result.currentPhase).toBe("evaluation")
  expect(result.relevantCapabilities).toContain("outcome_evaluation")
  expect(result.relevantCapabilities).toContain("learning_candidate_review")
  expect(result.relevantCapabilities).not.toContain("script")
 })
})
