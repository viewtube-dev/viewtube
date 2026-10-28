import type { AiBrainContext } from "../aiBrainContext"
import { CHANNEL_CONTEXT_QUESTIONS } from "../../context/channelContextQuestions"
import type { EvidenceRecord } from "./EvidenceRecord"

export const isCreatorAnswerProfileEligible = (input: {
 channelScoped: boolean
 profileName?: string | null
 activeChannelLabel?: string | null
}): boolean => {
 if (input.channelScoped) return true
 const normalizeLabel = (value?: string | null): string =>
  String(value || "").trim().replace(/^@/, "").replace(/\s+/g, " ").toLocaleLowerCase()
 const profileName = normalizeLabel(input.profileName)
 return Boolean(profileName && profileName === normalizeLabel(input.activeChannelLabel))
}

const clean = (value: unknown): string => {
 if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(", ")
 if (typeof value === "number" || typeof value === "boolean") return String(value)
 return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""
}

const readPath = (value: unknown, path: string): unknown =>
 path.split(".").reduce<unknown>((current, key) =>
  current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, value)

const legacyAnswers: Array<{ field: keyof AiBrainContext; label: string; canonicalPath: string }> = [
 { field: "channelDescription", label: "Channel description", canonicalPath: "identity.description" },
 { field: "mainTopicFocus", label: "Main topic focus", canonicalPath: "identity.niche" },
 { field: "audienceDescription", label: "Audience description", canonicalPath: "audience.idealViewer" },
 { field: "successDefinition", label: "Success definition", canonicalPath: "goals.successDefinition" },
 { field: "mainYoutubeGoal", label: "Main YouTube goal", canonicalPath: "goals.primaryGoal" },
 { field: "recurringSeriesName", label: "Recurring series name", canonicalPath: "content.recurringSeriesName" },
 { field: "recurringSeriesDescription", label: "Recurring series description", canonicalPath: "content.recurringSeriesDescription" },
 { field: "biggestWeakness", label: "Creator-identified weakness", canonicalPath: "content.biggestWeakness" },
 { field: "mostSuccessfulVideo", label: "Creator-identified successful video", canonicalPath: "content.mostSuccessfulVideo" },
 { field: "signupReason", label: "Reason for using ViewTube", canonicalPath: "intelligence.signupReason" },
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
   limitations: ["Creator-stated answer (" + label + "); not independently verified public or analytics evidence."],
   provenance: {
    evidenceIds: [id],
    sourceRoute: "settings/ai/channel-context",
    sourceVersion: "creator-context-unification-v1",
   },
  })
 }
 legacyAnswers.forEach(({ field, label, canonicalPath }) => {
  const legacyValue = clean(context[field])
  const canonicalValue = clean(readPath(context.channelContext, canonicalPath))
  if (legacyValue && legacyValue !== canonicalValue) add(`legacy.${field}`, label, legacyValue)
 })
 CHANNEL_CONTEXT_QUESTIONS.forEach((question) => {
  add(`channelContext.${question.contextField}`, question.title, readPath(context.channelContext, question.contextField))
 })
 return records
}
