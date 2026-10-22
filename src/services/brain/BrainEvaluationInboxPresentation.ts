import type { AlgorithmLearningReviewDecision } from "./AlgorithmLearningGovernance"

export interface BrainLearningReviewFeedback {
 label: string
 message: string
 eventId: string
 profileMutated: false
}

export const describeBrainLearningReview = (
 decision: AlgorithmLearningReviewDecision,
 eventId: string,
): BrainLearningReviewFeedback => {
 const details: Record<AlgorithmLearningReviewDecision, Pick<BrainLearningReviewFeedback, "label" | "message">> = {
  hold: {
   label: "Candidate held",
   message: "This candidate remains on hold. No channel profile change was made.",
  },
  reject: {
   label: "Candidate rejected",
   message: "This candidate was rejected from further profile review. No channel profile change was made.",
  },
  approve_for_profile_review: {
   label: "Approved for profile review",
   message: "This candidate is eligible for a separate profile-promotion step. The channel profile has not changed.",
  },
 }
 return { ...details[decision], eventId, profileMutated: false }
}
