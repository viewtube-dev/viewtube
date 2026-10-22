import { describe, expect, it } from "vitest"
import { describeBrainLearningReview } from "../BrainEvaluationInboxPresentation"

describe("describeBrainLearningReview", () => {
 it("distinguishes approval for profile review from an actual profile mutation", () => {
  expect(describeBrainLearningReview("approve_for_profile_review", "review-event-1")).toEqual({
   label: "Approved for profile review",
   message: "This candidate is eligible for a separate profile-promotion step. The channel profile has not changed.",
   eventId: "review-event-1",
   profileMutated: false,
  })
 })
 it("reports hold and reject decisions with their canonical event identity", () => {
  expect(describeBrainLearningReview("hold", "review-event-2")).toMatchObject({
   label: "Candidate held",
   eventId: "review-event-2",
   profileMutated: false,
  })
  expect(describeBrainLearningReview("reject", "review-event-3")).toMatchObject({
   label: "Candidate rejected",
   eventId: "review-event-3",
   profileMutated: false,
  })
 })
})
