import {
 listAlgorithmIntelligenceEvents,
 recordAlgorithmIntelligenceEvent,
 type AlgorithmIntelligenceEvent,
} from "./AlgorithmIntelligenceEventLedger"

export type BrainRecommendationDecisionKind = "accept" | "reject" | "modify" | "defer"

export interface BrainRecommendationModification {
 summary?: string
 fields?: Record<string, unknown>
 modifiedOutputRef?: string | null
}

export interface BrainRecommendationDecision {
 schemaVersion: "brain-recommendation-decision-v1"
 id: string
 idempotencyKey: string
 channelId: string
 projectId: string | null
 recommendationEventId: string
 recommendationId: string
 originalOutputRef: string | null
 decision: BrainRecommendationDecisionKind
 note: string | null
 modification: BrainRecommendationModification | null
 evidenceIds: string[]
 traceId: string | null
 promptReceipt: Record<string, unknown> | null
 decidedAt: number
}

export interface RecordBrainRecommendationDecisionInput {
 channelId: string
 recommendationEventId: string
 decision: BrainRecommendationDecisionKind
 idempotencyKey: string
 projectId?: string | null
 note?: string | null
 modification?: BrainRecommendationModification | null
 decidedAt?: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
 value !== null && typeof value === "object" && !Array.isArray(value)

const stableStringify = (value: unknown): string => JSON.stringify(value, (_key, item) =>
 item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item,
)

const decisionFromEvent = (event: AlgorithmIntelligenceEvent): BrainRecommendationDecision | null => {
 const decision = event.metadata?.decision
 return isRecord(decision) && decision.schemaVersion === "brain-recommendation-decision-v1"
  ? decision as unknown as BrainRecommendationDecision
  : null
}

/**
 * Record the creator's decision as an immutable child event. It never edits or executes
 * the recommendation, and a modified draft is stored separately from the original output.
 */
export const recordBrainRecommendationDecision = (
 input: RecordBrainRecommendationDecisionInput,
): { decision: BrainRecommendationDecision; event: AlgorithmIntelligenceEvent; idempotentReplay: boolean } => {
 const channelId = input.channelId.trim()
 const recommendationEventId = input.recommendationEventId.trim()
 const idempotencyKey = input.idempotencyKey.trim()
 if (!channelId) throw new Error("channelId is required")
 if (!recommendationEventId) throw new Error("recommendationEventId is required")
 if (!idempotencyKey) throw new Error("idempotencyKey is required")
 if (!["accept", "reject", "modify", "defer"].includes(input.decision)) throw new Error("Unsupported recommendation decision")
 if (input.decision === "modify") {
  const modification = input.modification
  if (!modification || (
   !modification.summary?.trim()
   && !modification.modifiedOutputRef?.trim()
   && !Object.keys(modification.fields || {}).length
  )) throw new Error("A modify decision must preserve a summary, changed fields, or a modified output reference")
 }
 if (input.decision !== "modify" && input.modification) {
  throw new Error("Modification details are only valid for a modify decision")
 }

 const source = listAlgorithmIntelligenceEvents({ channelId })
  .find((event) => event.id === recommendationEventId && event.kind === "RECOMMENDATION_CREATED")
 if (!source) throw new Error("Recommendation does not exist in the requested channel scope")
 if (input.projectId && source.projectId && input.projectId !== source.projectId) {
  throw new Error("Recommendation project scope does not match the requested project")
 }
 const projectId = input.projectId ?? source.projectId ?? null
 const eventId = `brain-recommendation-decision:${channelId}:${idempotencyKey}`
 const existingEvent = listAlgorithmIntelligenceEvents({ channelId }).find((event) => event.id === eventId)
 if (existingEvent) {
  const existingDecision = decisionFromEvent(existingEvent)
  const candidate = existingDecision ? {
   ...existingDecision,
   decision: input.decision,
   note: input.note?.trim() || null,
   modification: input.modification || null,
   projectId,
  } : null
  if (!existingDecision || stableStringify(candidate) !== stableStringify(existingDecision)) {
   throw new Error("Idempotency key was already used for a different recommendation decision")
  }
  return { decision: existingDecision, event: existingEvent, idempotentReplay: true }
 }

 const metadataReceipt = source.metadata?.promptReceipt
 const promptReceipt = isRecord(metadataReceipt) ? metadataReceipt : null
 const decision: BrainRecommendationDecision = {
  schemaVersion: "brain-recommendation-decision-v1",
  id: eventId,
  idempotencyKey,
  channelId,
  projectId,
  recommendationEventId: source.id,
  recommendationId: source.recommendationId || source.sourceId || source.id,
  originalOutputRef: typeof source.metadata?.outputRef === "string" ? source.metadata.outputRef : source.sourceId || null,
  decision: input.decision,
  note: input.note?.trim() || null,
  modification: input.decision === "modify" ? input.modification || null : null,
  evidenceIds: [...new Set(source.evidenceIds)],
  traceId: typeof source.metadata?.traceId === "string" ? source.metadata.traceId : null,
  promptReceipt,
  decidedAt: input.decidedAt ?? Date.now(),
 }
 const event = recordAlgorithmIntelligenceEvent({
  id: eventId,
  channelId,
  projectId,
  videoId: source.videoId || null,
  kind: "RECOMMENDATION_DECISION_RECORDED",
  sourceSystem: "decision",
  sourceId: source.id,
  recommendationId: decision.recommendationId,
  parentEventIds: [source.id],
  evidenceIds: decision.evidenceIds,
  confidence: source.confidence,
  title: `Creator ${({ accept: "accepted", reject: "rejected", modify: "modified", defer: "deferred" } as const)[input.decision]} recommendation`,
  summary: decision.note || `Creator decision: ${input.decision}.`,
  metadata: {
   decision,
   originalRecommendationEventId: source.id,
   originalOutputRef: decision.originalOutputRef,
   modifiedOutputRef: decision.modification?.modifiedOutputRef || null,
   sourcePromptReceiptPreserved: Boolean(promptReceipt),
   recommendationMutated: false,
   actionExecuted: false,
  },
 })
 return { decision, event, idempotentReplay: false }
}

export const listBrainRecommendationDecisions = (input: {
 channelId: string
 recommendationEventId?: string
}): BrainRecommendationDecision[] => listAlgorithmIntelligenceEvents({ channelId: input.channelId })
 .filter((event) => event.kind === "RECOMMENDATION_DECISION_RECORDED")
 .map(decisionFromEvent)
 .filter((decision): decision is BrainRecommendationDecision => Boolean(decision))
 .filter((decision) => !input.recommendationEventId || decision.recommendationEventId === input.recommendationEventId)
 .sort((left, right) => right.decidedAt - left.decidedAt)
