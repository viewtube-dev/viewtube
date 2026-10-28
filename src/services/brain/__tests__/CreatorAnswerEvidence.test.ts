import { describe, expect, it } from "vitest"
import { buildCreatorAnswerEvidenceRecords } from "../CreatorAnswerEvidence"
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
