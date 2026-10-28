import type { AiBrainContext } from "../aiBrainContext"
import { CHANNEL_CONTEXT_QUESTIONS } from "../../context/channelContextQuestions"
import type { EvidenceRecord } from "./EvidenceRecord"

const clean = (value: unknown): string => {
 if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(", ")
 if (typeof value === "number" || typeof value === "boolean") return String(value)
 return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""
}

const readPath = (value: unknown, path: string): unknown =>
 path.split(".").reduce<unknown>((current, key) =>
  current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, value)

const legacyAnswers: Array<{ field: keyof AiBrainContext; label: string }> = [
 { field: "channelDescription", label: "Channel description" },
 { field: "mainTopicFocus", label: "Main topic focus" },
 { field: "audienceDescription", label: "Audience description" },
 { field: "successDefinition", label: "Success definition" },
 { field: "mainYoutubeGoal", label: "Main YouTube goal" },
 { field: "recurringSeriesName", label: "Recurring series name" },
 { field: "recurringSeriesDescription", label: "Recurring series description" },
 { field: "biggestWeakness", label: "Creator-identified weakness" },
 { field: "mostSuccessfulVideo", label: "Creator-identified successful video" },
 { field: "signupReason", label: "Reason for using ViewTube" },
]

/**
 * Projects both generations of creator intake answers into the shared evidence
 * contract. These records prove what the creator told us, not that the claim is
 * independently verified. No separate persistence is introduced.
 */
export const buildCreatorAnswerEvidenceRecords = (
 context: AiBrainContext,
 channelId: string | null | undefined,
): EvidenceRecord[] => {
 const scope = String(channelId || "").trim()
 if (!scope) return []
 const records: EvidenceRecord[] = []
 const add = (field: string, label: string, rawValue: unknown) => {
  const value = clean(rawValue)
  if (!value) return
  const id = `creator-answer:${scope}:${field}`
  records.push({
   id,
   owner: "creator-confirmed",
   sourceRef: `ai-brain-context:${field}`,
   sourceSnapshotId: context.updatedAt || context.completedAt || null,
   channelId: scope,
   metric: null,
   value,
   unit: null,
   freshness: "fresh",
   epistemicState: "USER_PROVIDED",
   confidence: 1,
   observedAt: context.updatedAt || context.completedAt || null,
   limitations: ["Records the creator's answer; not independently verified public or analytics evidence."],
   provenance: {
    evidenceIds: [id],
    sourceRoute: "settings/ai/channel-context",
    sourceVersion: "creator-context-unification-v1",
   },
  })
 }
 legacyAnswers.forEach(({ field, label }) => add(`legacy.${field}`, label, context[field]))
 CHANNEL_CONTEXT_QUESTIONS.forEach((question) => {
  add(`channelContext.${question.contextField}`, question.title, readPath(context.channelContext, question.contextField))
 })
 return records
}
