import type { AIBrainLearningEntry, BrainMemoryClaim } from "../../types"
import { captureAIBrainLearningEvent, teachAIBrainExplicitly } from "../aiBrainSelfImprovement"
import { getBrainMemoryClaimDB } from "./Persistence"
import { listActiveBrainMemoryClaims } from "./BrainMemoryClaims"

export type BrainContextCorrectionSource =
 | "brain_memory_claim"
 | "channel_knowledge_model"
 | "learning_candidate"

export type BrainContextCorrectionResult =
 | { status: "applied"; entryId: string; claimId: string; supersededClaimId: string; message: string }
 | { status: "proposal_recorded"; entryId: string; message: string }
 | { status: "held"; entryId: string; message: string }
 | { status: "blocked"; entryId: string; message: string }
 | { status: "unresolved"; entryId: string; message: string }

export interface SubmitBrainContextCorrectionInput {
 channelId: string
 source: BrainContextCorrectionSource
 sourceId: string
 currentStatement: string
 correctedStatement: string
 evidenceRefs?: string[]
}

export interface BrainContextCorrectionDependencies {
 getClaim: (claimId: string) => Promise<BrainMemoryClaim | null>
 listActiveClaims: (channelId: string) => Promise<BrainMemoryClaim[]>
 teachExplicitly: typeof teachAIBrainExplicitly
 captureProposal: typeof captureAIBrainLearningEvent
}

const DEFAULT_DEPENDENCIES: BrainContextCorrectionDependencies = {
 getClaim: getBrainMemoryClaimDB,
 listActiveClaims: listActiveBrainMemoryClaims,
 teachExplicitly: teachAIBrainExplicitly,
 captureProposal: captureAIBrainLearningEvent,
}

const clean = (value: string): string => value.replace(/\s+/g, " ").trim()

/**
 * Apply corrections only through the canonical Brain memory-claim governance
 * path. Model hypotheses and learning candidates do not have a generic update
 * contract, so they become explicit, unconfirmed proposals instead of being
 * silently overwritten or presented as applied.
 */
export const submitBrainContextCorrection = async (
 input: SubmitBrainContextCorrectionInput,
 dependencies: BrainContextCorrectionDependencies = DEFAULT_DEPENDENCIES,
): Promise<BrainContextCorrectionResult> => {
 const channelId = clean(input.channelId)
 const sourceId = clean(input.sourceId)
 const currentStatement = clean(input.currentStatement)
 const correctedStatement = clean(input.correctedStatement)
 if (!channelId) throw new Error("An active channel is required to correct Brain context.")
 if (!sourceId || !currentStatement) throw new Error("The context item has no resolvable canonical source.")
 if (!correctedStatement) throw new Error("Enter a correction before submitting it.")
 if (correctedStatement === currentStatement) throw new Error("The correction is identical to the current statement.")

 const evidence = [...new Set([sourceId, ...(input.evidenceRefs || [])].map(clean).filter(Boolean))]

 if (input.source === "brain_memory_claim") {
  const claim = await dependencies.getClaim(sourceId)
  if (!claim) throw new Error("The canonical Brain memory claim no longer exists.")
  if (claim.channelId !== channelId) throw new Error("This context claim does not belong to the active channel.")
  if (claim.status !== "active") throw new Error("This context claim is no longer active. Refresh the context before correcting it.")
  if (clean(claim.value) !== currentStatement) {
   throw new Error("This context changed since it was shown. Refresh the context before correcting it.")
  }

  const teaching = await dependencies.teachExplicitly({
   channelId,
   summary: correctedStatement,
   detail: correctedStatement,
   category: claim.category,
   evidence,
  })
  if (!teaching.promotion.allowed) {
   return {
    status: "held",
    entryId: teaching.entry.id,
    message: teaching.promotion.reason || "The existing Brain governance policy held this correction.",
   }
  }

  const nextClaim = (await dependencies.listActiveClaims(channelId))
   .filter((item) => item.category === claim.category && clean(item.value) === correctedStatement)
   .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0]
  if (!nextClaim) {
   return {
    status: "unresolved",
    entryId: teaching.entry.id,
    message: "The correction was submitted to governance, but the resulting active claim could not be resolved. The previous context has not been reported as replaced.",
   }
  }
  return {
   status: "applied",
   entryId: teaching.entry.id,
   claimId: nextClaim.id,
   supersededClaimId: claim.id,
   message: "The correction was accepted by Brain governance and saved as a new canonical claim. The previous claim is superseded; verify the next answer against the refreshed context.",
  }
 }

 const proposal = await dependencies.captureProposal({
  channelId,
  source: "journal",
  summary: `Correction proposed for ${input.source} record ${sourceId}`,
  detail: `Current statement: ${currentStatement}\nProposed correction: ${correctedStatement}`,
  category: "correction",
  confidence: "high",
  evidence,
  metadata: {
   confirmed: false,
   creatorInitiated: true,
   sourceType: input.source,
   sourceId,
   originalStatement: currentStatement,
   proposedReplacement: correctedStatement,
   awaitingSourceGovernance: true,
  },
 })
 if (proposal.metadata?.blockedByUserControls === true || proposal.status === "dismissed") {
  return {
   status: "blocked",
   entryId: proposal.id,
   message: "Brain controls prevented this correction proposal from being saved. No source record was changed.",
  }
 }
 return {
  status: "proposal_recorded",
  entryId: proposal.id,
  message: "The correction proposal was recorded for review. This source has no generic update contract, so the original hypothesis/candidate remains unchanged and has not been promoted.",
 }
}
