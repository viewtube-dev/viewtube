import type { AlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

export type BrainAttributionChainStatus = "complete" | "incomplete" | "not_found"

export interface BrainAttributionChain {
 status: BrainAttributionChainStatus
 recommendation: AlgorithmIntelligenceEvent | null
 decisions: AlgorithmIntelligenceEvent[]
 executions: AlgorithmIntelligenceEvent[]
 publications: AlgorithmIntelligenceEvent[]
 outcomes: AlgorithmIntelligenceEvent[]
 learningCandidates: AlgorithmIntelligenceEvent[]
 eventIds: string[]
 unresolvedStages: Array<"decision" | "execution" | "publication" | "outcome" | "learning">
 limitations: string[]
}

const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value.trim() : null
const stringArray = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []

const linkedByIdentity = (candidate: AlgorithmIntelligenceEvent, known: AlgorithmIntelligenceEvent[]): boolean => {
 const knownIds = new Set(known.map((event) => event.id))
 if (candidate.parentEventIds.some((id) => knownIds.has(id))) return true
 if (candidate.sourceId && knownIds.has(candidate.sourceId)) return true
 const metadata = candidate.metadata || {}
 const related = stringArray(metadata.relatedBrainEventIds)
 if (related.some((id) => knownIds.has(id))) return true
 const originalRecommendationEventId = text(metadata.originalRecommendationEventId)
 if (originalRecommendationEventId && knownIds.has(originalRecommendationEventId)) return true

 const strongKeys: Array<keyof AlgorithmIntelligenceEvent> = ["recommendationId", "actionPacketId", "workflowId"]
 for (const key of strongKeys) {
  const candidateValue = text(candidate[key])
  if (candidateValue && known.some((event) => event.channelId === candidate.channelId && text(event[key]) === candidateValue)) return true
 }
 const candidateMetadataRefs = [
  text(metadata.outputRef),
  text(metadata.modifiedOutputRef),
  text(metadata.videoPackageId),
  text(metadata.publishTransactionId),
  text(metadata.approvedSnapshotId),
 ]
  .filter((value): value is string => Boolean(value))
 const knownMetadataRefs = new Set(known.flatMap((event) => {
  const values = [
   text(event.metadata?.outputRef),
   text(event.metadata?.modifiedOutputRef),
   text(event.metadata?.videoPackageId),
   text(event.metadata?.publishTransactionId),
   text(event.metadata?.approvedSnapshotId),
  ]
  return values.filter((value): value is string => Boolean(value))
 }))
 return candidateMetadataRefs.some((value) => knownMetadataRefs.has(value))
}

export const buildBrainAttributionChain = (input: {
 channelId: string
 recommendationEventId: string
 events: AlgorithmIntelligenceEvent[]
}): BrainAttributionChain => {
 const channelId = input.channelId.trim()
 const recommendation = input.events.find((event) =>
  event.channelId === channelId
  && event.id === input.recommendationEventId
  && event.kind === "RECOMMENDATION_CREATED",
 ) || null
 if (!recommendation) return {
  status: "not_found",
  recommendation: null,
  decisions: [],
  executions: [],
  publications: [],
  outcomes: [],
  learningCandidates: [],
  eventIds: [],
  unresolvedStages: [],
  limitations: ["The recommendation was not found in the requested channel scope."],
 }

 const scoped = input.events.filter((event) => event.channelId === channelId)
 const chain: AlgorithmIntelligenceEvent[] = [recommendation]
 const included = new Set([recommendation.id])
 let changed = true
 while (changed) {
  changed = false
  const known = chain.slice()
  for (const candidate of scoped) {
   if (included.has(candidate.id)) continue
   if (!linkedByIdentity(candidate, known)) continue
   included.add(candidate.id)
   chain.push(candidate)
   changed = true
  }
 }

 const decisions = chain.filter((event) => ["RECOMMENDATION_DECISION_RECORDED", "CREATOR_APPROVAL_RECORDED"].includes(event.kind))
 const executions = chain.filter((event) => ["RECOMMENDATION_EXECUTED", "PRIMING_STEP_EXECUTED"].includes(event.kind))
 const publications = chain.filter((event) => ["PUBLICATION_CONFIRMED", "PUBLICATION_CHECKPOINT_RECORDED"].includes(event.kind))
 const outcomes = chain.filter((event) => event.kind === "OUTCOME_MEASURED")
 const learningCandidates = chain.filter((event) => ["LEARNING_CANDIDATE_CREATED", "LEARNING_CANDIDATE_REVIEWED", "LEARNING_PROMOTED"].includes(event.kind))
 const unresolvedStages: BrainAttributionChain["unresolvedStages"] = []
 if (!decisions.length) unresolvedStages.push("decision")
 if (!executions.length) unresolvedStages.push("execution")
 if (!publications.length) unresolvedStages.push("publication")
 if (!outcomes.length) unresolvedStages.push("outcome")
 if (!learningCandidates.length) unresolvedStages.push("learning")

 return {
  status: unresolvedStages.length ? "incomplete" : "complete",
  recommendation,
  decisions,
  executions,
  publications,
  outcomes,
  learningCandidates,
  eventIds: chain.map((event) => event.id),
  unresolvedStages,
  limitations: [
   "Links are based on explicit event ancestry or exact stable identity fields; timestamps and project co-membership are never sufficient.",
   "A publication confirmation is lifecycle evidence, not proof of performance impact or causal attribution.",
   ...(unresolvedStages.length ? [`Attribution chain is missing: ${unresolvedStages.join(", ")}.`] : []),
  ],
 }
}
