import { afterEach, describe, expect, it } from "vitest"
import { loadAiBrainContext, saveChannelContextProfile } from "../aiBrainContext"
import { CHANNEL_CONTEXT_QUESTIONS } from "../../context/channelContextQuestions"
import type { ChannelContextProfile } from "../../context/ChannelContextProfile"
import { buildCreatorAnswerEvidenceRecords, isCreatorAnswerProfileEligible } from "./CreatorAnswerEvidence"

afterEach(() => localStorage.clear())

describe("creator intake evidence convergence", () => {
  it("projects every saved canonical answer into stable USER_PROVIDED evidence records", () => {
    const profile: ChannelContextProfile = {
      identity: { name: "History Channel", description: "History documentaries", niche: "Military history", subNiches: ["Naval history"], competitors: ["HistoryLab"] },
      goals: { primaryGoal: "Grow returning viewers", successDefinition: "Build a loyal audience", priorityRanking: ["retention", "views"], offers: ["Membership"], primaryCTA: "Subscribe" },
      audience: { idealViewer: "Curious adults", experienceLevel: "Enthusiast", transformation: "Understand history", problem: "Shallow coverage", segments: ["Students"] },
      content: { types: ["Long-form"], frequency: "Weekly", bestFormats: ["Documentary"], priorityThemes: ["Turning points"], blockedThemes: ["Graphic detail"], recurringSeriesName: "History in Motion", recurringSeriesDescription: "One turning point per episode", biggestWeakness: "Inconsistent publishing", mostSuccessfulVideo: "The Siege of Vienna" },
      brand: { voice: "Measured and curious", influences: ["Documentary makers"], creativity: 7 },
      intelligence: { sources: ["Public videos", "Creator answers"], capabilities: ["Strategy"], signupReason: "Improve channel decisions" },
    }
    saveChannelContextProfile(profile)

    const saved = loadAiBrainContext()
    const first = buildCreatorAnswerEvidenceRecords(saved, "channel-123")
    const second = buildCreatorAnswerEvidenceRecords(saved, "channel-123")

    expect(first).toHaveLength(CHANNEL_CONTEXT_QUESTIONS.length)
    expect(first.every(record => record.epistemicState === "USER_PROVIDED")).toBe(true)
    expect(first.every(record => record.channelId === "channel-123")).toBe(true)
    expect(first.every(record => record.metric === null)).toBe(true)
    expect(first.map(record => record.id)).toEqual(second.map(record => record.id))
    expect(first.find(record => record.id === "creator-answer:channel-123:channelContext.identity.name")?.value).toBe("History Channel")
    expect(first.find(record => record.id === "creator-answer:channel-123:channelContext.brand.creativity")?.value).toBe("7")
    expect(first.every(record => record.limitations.some(note => note.includes("not independently verified")))).toBe(true)
  })

  it("trusts channel-scoped profiles without requiring a display name", () => {
    expect(isCreatorAnswerProfileEligible({
      channelScoped: true,
      profileName: "",
      activeChannelLabel: "History Channel",
    })).toBe(true)
  })

  it("rejects mismatched legacy profiles but accepts normalized matching labels", () => {
    expect(isCreatorAnswerProfileEligible({
      channelScoped: false,
      profileName: "Cooking Channel",
      activeChannelLabel: "History Channel",
    })).toBe(false)
    expect(isCreatorAnswerProfileEligible({
      channelScoped: false,
      profileName: "@History   Channel",
      activeChannelLabel: "history channel",
    })).toBe(true)
    expect(isCreatorAnswerProfileEligible({
      channelScoped: false,
      profileName: "",
      activeChannelLabel: "History Channel",
    })).toBe(false)
  })

  it("does not emit evidence for an unanswered field or without an explicit channel scope", () => {
    saveChannelContextProfile({ identity: { name: "History Channel" }, goals: {}, audience: {}, content: {}, brand: {}, intelligence: {} })
    const saved = loadAiBrainContext()
    expect(buildCreatorAnswerEvidenceRecords(saved, null)).toEqual([])
    const records = buildCreatorAnswerEvidenceRecords(saved, "channel-123")
    expect(records).toHaveLength(1)
    expect(records[0].value).toBe("History Channel")
  })
})
