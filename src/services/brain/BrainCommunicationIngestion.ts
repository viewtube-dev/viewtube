import {
 listAlgorithmIntelligenceEvents,
 recordAlgorithmIntelligenceEvent,
 type AlgorithmIntelligenceEvent,
} from "./AlgorithmIntelligenceEventLedger"
import { canCaptureCreatorCommunications, readBrainUserControls } from "./BrainUserControls"

export type CreatorCommunicationLabel =
 | "instruction"
 | "preference"
 | "correction"
 | "criticism"
 | "factual_claim"
 | "goal"
 | "constraint"
 | "approval"
 | "rejection"
 | "experiment_note"
 | "style_feedback"

export interface CreatorCommunicationClassification {
 schemaVersion: "brain-creator-communication-v1"
 labels: CreatorCommunicationLabel[]
 confidence: "low" | "medium" | "high"
 durableMemoryPromoted: false
 requiresGovernedReview: true
 rationale: string[]
}

export interface RecordCreatorCommunicationInput {
 channelId: string
 communicationId: string
 text: string
 projectId?: string | null
 relatedEventIds?: string[]
 occurredAt?: number
}

const fingerprintText = (value: string): string => {
 // A compact deterministic fingerprint supports retry/collision checks without retaining the message.
 // Raw text is never written to the event ledger or server persistence payload.
 let hash = 0xcbf29ce484222325n
 for (const byte of new TextEncoder().encode(value)) {
  hash ^= BigInt(byte)
  hash = BigInt.asUintN(64, hash * 0x100000001b3n)
 }
 return hash.toString(16).padStart(16, "0")
}

const RULES: Array<{ label: CreatorCommunicationLabel; pattern: RegExp; rationale: string }> = [
 { label: "approval", pattern: /\b(approved|approve this|looks good|ship it|use version [a-z0-9]+|i accept)\b/i, rationale: "Explicit approval language." },
 { label: "rejection", pattern: /\b(reject|rejected|not approved|don't use|do not use|no thanks|i decline)\b/i, rationale: "Explicit rejection language." },
 { label: "correction", pattern: /\b(correction|actually,?|i meant|that's wrong|that is wrong|incorrect|you misunderstood|not .{1,40} but)\b/i, rationale: "Correction or replacement language." },
 { label: "experiment_note", pattern: /\b(experiment|hypothesis|test (?:this|the|a|an|whether)|measure (?:whether|if|the)|next experiment)\b/i, rationale: "Explicit experiment or measurement language." },
 { label: "constraint", pattern: /\b(without|must not|cannot|can't|do not|don't|never|at most|no more than|under \d+|avoid)\b/i, rationale: "Constraint or exclusion language." },
 { label: "preference", pattern: /\b(i prefer|my preference|i like|i dislike|i hate|i'd rather|i would rather|i want this to|prefer .{1,60} over)\b/i, rationale: "Explicit preference language." },
 { label: "instruction", pattern: /\b(always|please|must|should|keep|use|make sure|from now on|change this|set the|write|create|generate|replace|add|remove)\b/i, rationale: "Directive or requested action language." },
 { label: "goal", pattern: /\b(goal|aim|target|objective|trying to|want to grow|increase .{1,40}|improve .{1,40})\b/i, rationale: "Goal or target language." },
 { label: "style_feedback", pattern: /\b(style|tone|thumbnail|font|colour|color|visual|pacing|voice|text-free|uppercase|lowercase|composition|layout)\b/i, rationale: "Creator style or presentation language." },
 { label: "criticism", pattern: /\b(too [a-z]+|weak|poor|bad|missed the point|doesn't work|does not work|confusing|unhelpful|disappointing)\b/i, rationale: "Critical or corrective evaluation language." },
 { label: "factual_claim", pattern: /\b(is|are|was|were|because|caused|increased|decreased|shows|means|measured|the result)\b/i, rationale: "Statement presented as a factual or causal claim; verification remains separate." },
]

export const classifyCreatorCommunication = (text: string): CreatorCommunicationClassification => {
 const normalized = text.trim().replace(/\s+/g, " ")
 const matched = RULES.filter((rule) => rule.pattern.test(normalized))
 const labels = matched.map((rule) => rule.label)
 const decisive = labels.some((label) => ["approval", "rejection", "correction", "experiment_note"].includes(label))
 return {
  schemaVersion: "brain-creator-communication-v1",
  labels: Array.from(new Set(labels)),
  confidence: decisive ? "high" : labels.length >= 2 ? "medium" : "low",
  durableMemoryPromoted: false,
  requiresGovernedReview: true,
  rationale: matched.length
   ? matched.map((rule) => rule.rationale)
   : ["No deterministic communication signal; do not infer a fact or preference."],
 }
}

/**
 * Stores communication as an immutable intelligence event. This is evidence of what
 * the creator said, not a memory write; promotion remains a separate governed workflow.
 */
/**
 * One-time privacy migration for pre-consent records. Redaction is always allowed:
 * it removes retained creator text and writes the sanitized event back through the
 * existing idempotent durable-sync path. It does not classify new communication.
 */
export const redactLegacyCreatorCommunicationText = (channelIdInput: string): number => {
 const channelId = channelIdInput.trim()
 if (!channelId) return 0
 const legacy = listAlgorithmIntelligenceEvents({ channelId }).filter((event) =>
  event.kind === "CREATOR_COMMUNICATION_CLASSIFIED" && typeof event.metadata?.communicationText === "string",
 )
 legacy.forEach((event) => {
  const originalText = String(event.metadata.communicationText || "")
  const { communicationText: _discardedText, ...metadata } = event.metadata
  recordAlgorithmIntelligenceEvent({
   id: event.id,
   channelId: event.channelId,
   projectId: event.projectId || null,
   videoId: event.videoId || null,
   kind: "CREATOR_COMMUNICATION_CLASSIFIED",
   sourceSystem: "communication",
   sourceId: event.sourceId || event.id,
   parentEventIds: event.parentEventIds,
   recommendationId: event.recommendationId || null,
   primingPlanId: event.primingPlanId || null,
   primingStepId: event.primingStepId || null,
   actionPacketId: event.actionPacketId || null,
   workflowId: event.workflowId || null,
   evidenceIds: event.evidenceIds,
   confidence: event.confidence,
   title: event.title,
   summary: "Creator communication classified; legacy raw text redacted.",
   evaluationTargets: event.evaluationTargets,
   checkpointAt: event.checkpointAt || null,
   metadata: {
    ...metadata,
    communicationText: undefined,
    communicationTextFingerprint: fingerprintText(originalText),
    rawCommunicationTextRetained: false,
    retentionPolicy: "classification-and-fingerprint-only-v1",
   },
  })
 })
 return legacy.length
}

export const recordCreatorCommunicationEvidence = (
 input: RecordCreatorCommunicationInput,
): { classification: CreatorCommunicationClassification; event: AlgorithmIntelligenceEvent; idempotentReplay: boolean } => {
 const channelId = input.channelId.trim()
 const communicationId = input.communicationId.trim()
 const text = input.text.trim().replace(/\s+/g, " ").slice(0, 4000)
 if (!channelId) throw new Error("channelId is required")
 if (!communicationId) throw new Error("communicationId is required")
 if (!text) throw new Error("communication text is required")

 const controls = readBrainUserControls(channelId)
 if (!canCaptureCreatorCommunications(controls)) {
  throw new Error("Explicit creator communication capture consent is required")
 }
 const classification = classifyCreatorCommunication(text)
 if (!classification.labels.length) throw new Error("Communication does not match a supported classification")
 const id = `creator-communication:${channelId}:${communicationId}`
 const existing = listAlgorithmIntelligenceEvents({ channelId }).find((event) => event.id === id)
 const textFingerprint = fingerprintText(text)
 const relatedEventIds = Array.from(new Set((input.relatedEventIds || []).map((value) => value.trim()).filter(Boolean)))
 const projectId = input.projectId?.trim() || null
 if (existing) {
  const existingParents = [...existing.parentEventIds].sort()
  const requestedParents = [...relatedEventIds].sort()
  if (
   existing.metadata?.communicationTextFingerprint !== textFingerprint
   || (existing.projectId || null) !== projectId
   || JSON.stringify(existingParents) !== JSON.stringify(requestedParents)
  ) {
   throw new Error("Communication ID was already used for different text or scope")
  }
  return { classification, event: existing, idempotentReplay: true }
 }
 const event = recordAlgorithmIntelligenceEvent({
  id,
  channelId,
  projectId,
  kind: "CREATOR_COMMUNICATION_CLASSIFIED",
  sourceSystem: "communication",
  sourceId: communicationId,
  parentEventIds: relatedEventIds,
  evidenceIds: [communicationId],
  confidence: classification.confidence,
  title: `Creator communication: ${classification.labels.join(", ")}`,
  summary: `Creator communication classified (${classification.labels.join(", ")}); raw text intentionally not retained.`,
  checkpointAt: input.occurredAt ?? Date.now(),
  metadata: {
   classification,
   communicationId,
   communicationTextFingerprint: textFingerprint,
   rawCommunicationTextRetained: false,
   retentionPolicy: "classification-and-fingerprint-only-v1",
   durableMemoryPromoted: false,
   promotionRequiresGovernedReview: true,
   sourceIdentityVerified: true,
  },
 })
 return { classification, event, idempotentReplay: false }
}
