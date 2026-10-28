import { describe, expect, it } from "vitest"
import { buildCreatorAnswerEvidenceRecords } from "../CreatorAnswerEvidence"
import { CHANNEL_CONTEXT_QUESTIONS } from "../../../context/channelContextQuestions"
import type { AiBrainContext } from "../../aiBrainContext"

const context = {
 channelDescription: "History explained clearly",
 mainTopicFocus: "",
 audienceDescription: "",
 successDefinition: "",
 mainYoutubeGoal: "",
 recurringSeriesName: "",
 recurringSeriesDescription: "",
 biggestWeakness: "",
 mostSuccessfulVideo: "",
 signupReason: "",
 whatNext: "",
 primaryGoal: "views",
 audienceNiche: "",
 oneMonthGoals: [],
 completedAt: "2026-10-27T10:00:00.000Z",
 deferredAt: null,
 updatedAt: "2026-10-27T10:00:00.000Z",
 source: "wizard",
 version: 2,
 channelContext: {
  identity: { name: "History Channel", niche: "Historical explainers", subNiches: ["Napoleonic history"] },
  goals: { primaryGoal: "Build a loyal audience" },
  audience: { idealViewer: "Curious history fans" },
  content: { types: ["Long-form explainers"] },
  brand: { voice: "Measured and accessible", creativity: 7 },
  intelligence: { sources: ["Public videos"], capabilities: ["Research"] },
 },
} as AiBrainContext

describe("buildCreatorAnswerEvidenceRecords", () => {
 it("converts legacy and channel-profile answers into scoped USER_PROVIDED evidence", () => {
  const records = buildCreatorAnswerEvidenceRecords(context, "channel-1")
  expect(records.map((record) => record.id)).toContain("creator-answer:channel-1:legacy.channelDescription")
  expect(records.map((record) => record.id)).toContain("creator-answer:channel-1:channelContext.identity.niche")
  expect(records.find((record) => record.id.endsWith("channelContext.brand.creativity"))?.value).toBe("7")
  expect(records.every((record) => record.owner === "creator-confirmed" && record.epistemicState === "USER_PROVIDED")).toBe(true)
  expect(records.every((record) => record.channelId === "channel-1" && record.provenance.evidenceIds.includes(record.id))).toBe(true)
  expect(records.every((record) => record.limitations?.some((limitation) => limitation.includes("not independently verified")))).toBe(true)
 })

 it("projects every answered intake question into channel-scoped evidence with source provenance", () => {
  const profile = {
   identity: { name: "History Channel" } as Record<string, unknown>,
   goals: {} as Record<string, unknown>,
   audience: {} as Record<string, unknown>,
   content: {} as Record<string, unknown>,
   brand: {} as Record<string, unknown>,
   intelligence: {} as Record<string, unknown>,
  }
  const arrayFields = new Set(["subNiches", "competitors", "priorityRanking", "offers", "segments", "types", "bestFormats", "priorityThemes", "blockedThemes", "influences", "sources", "capabilities"])
  for (const question of CHANNEL_CONTEXT_QUESTIONS) {
   const [section, field] = question.contextField.split(".")
   if (field === "name") continue
   profile[section as keyof typeof profile][field] = field === "creativity"
    ? 8
    : arrayFields.has(field)
     ? [`Answer for ${question.id}`]
     : `Answer for ${question.id}`
  }
  const unified = { ...context, channelContext: profile } as unknown as AiBrainContext
  const records = buildCreatorAnswerEvidenceRecords(unified, "channel-1")

  for (const question of CHANNEL_CONTEXT_QUESTIONS) {
   const record = records.find((candidate) => candidate.id === `creator-answer:channel-1:channelContext.${question.contextField}`)
   expect(record, `missing evidence for ${question.id}`).toBeTruthy()
   expect(record?.channelId).toBe("channel-1")
   expect(record?.epistemicState).toBe("USER_PROVIDED")
   expect(record?.provenance.sourceRoute).toBe("settings/ai/channel-context")
   expect(record?.provenance.evidenceIds).toContain(record?.id)
  }
 })

 it("projects all populated canonical intake answers to evidence records", () => {
  const complete = {
   ...context,
   channelContext: {
    identity: { name: "History Channel", description: "History documentaries", niche: "Military history", subNiches: ["Naval history"], competitors: ["HistoryLab"] },
    goals: { primaryGoal: "Grow returning viewers", successDefinition: "Build a loyal audience", priorityRanking: ["retention", "views"], offers: ["Membership"], primaryCTA: "Subscribe" },
    audience: { idealViewer: "Curious adults", experienceLevel: "Enthusiast", transformation: "Understand history", problem: "Shallow coverage", segments: ["Students"] },
    content: { types: ["Long-form"], frequency: "Weekly", bestFormats: ["Documentary"], priorityThemes: ["Turning points"], blockedThemes: ["Graphic detail"], recurringSeriesName: "History in Motion", recurringSeriesDescription: "One turning point per episode", biggestWeakness: "Inconsistent publishing", mostSuccessfulVideo: "The Siege of Vienna" },
    brand: { voice: "Measured and curious", influences: ["Documentary makers"], creativity: 7 },
    intelligence: { sources: ["Public videos"], capabilities: ["Strategy"], signupReason: "Improve decisions" },
   },
  } as AiBrainContext
  const records = buildCreatorAnswerEvidenceRecords(complete, "channel-1")
  const canonicalRecords = records.filter((record) => record.id.includes(":channelContext."))
  expect(canonicalRecords.map((record) => record.id)).toEqual(
   CHANNEL_CONTEXT_QUESTIONS.map((question) => "creator-answer:channel-1:channelContext." + question.contextField),
  )
  expect(canonicalRecords.every((record) => record.value !== null && record.value !== undefined && String(record.value).length > 0 && record.epistemicState === "USER_PROVIDED")).toBe(true)
 })

 it("does not emit evidence without an active channel scope", () => {
  expect(buildCreatorAnswerEvidenceRecords(context, null)).toEqual([])
 })
 it("deduplicates legacy aliases once the unified profile contains the same answer", () => {
  const unified = {
   ...context,
   channelDescription: "History explained clearly",
   channelContext: {
    ...context.channelContext,
    identity: { ...context.channelContext.identity, description: "History explained clearly" },
   },
  } as AiBrainContext
  const records = buildCreatorAnswerEvidenceRecords(unified, "channel-1")
  expect(records.map((record) => record.id)).not.toContain("creator-answer:channel-1:legacy.channelDescription")
  expect(records.map((record) => record.id)).toContain("creator-answer:channel-1:channelContext.identity.description")
 })
})
