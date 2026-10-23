import { describe, expect, it } from "vitest"
import type { CreatorBrainResponse } from "../../types"
import { buildWorkflowRecommendationFromBrainResponse } from "./brainWorkflowRecommendations"

const response = (actions: string[]): CreatorBrainResponse => ({
 id: "response-1",
 mode: "advice" as CreatorBrainResponse["mode"],
 body: "Review the packaging plan.",
 evidenceIds: [],
 headline: "Title performance plan",
 keyInsight: "Use the best evidence to improve the title.",
 evidenceChips: [],
 actions,
 learningSummary: "",
 questions: [],
 confidence: "medium",
})

describe("buildWorkflowRecommendationFromBrainResponse", () => {
 it("reuses the answer headline and key insight and gates risky actions", () => {
  const recommendation = buildWorkflowRecommendationFromBrainResponse(
   response(["Improve the title and thumbnail", "Review and publish the final package"]),
   "turn-123",
  )

  expect(recommendation).toMatchObject({
   title: "Title performance plan",
   goal: "Use the best evidence to improve the title.",
   steps: [
    { title: "Improve the title and thumbnail", requiresApproval: false, toolId: "packaging-lab-pro" },
    { title: "Review and publish the final package", requiresApproval: true, toolId: "packaging-lab-pro" },
   ],
  })
 })

 it("does not create a blank action plan when the answer has no actionable steps", () => {
  expect(buildWorkflowRecommendationFromBrainResponse(response([]), "turn-empty")).toBeNull()
 })
})
