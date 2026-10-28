import { describe, expect, it } from "vitest"
import { loadAiBrainContext, saveChannelContextProfile, syncChannelContextToLegacyAnswers, syncLegacyAnswersToChannelContext } from "./aiBrainContext"
import type { ChannelContextProfile } from "../context/ChannelContextProfile"

const profile: ChannelContextProfile = {
 identity: { name: "History Channel", niche: "Historical explainers" },
 goals: { primaryGoal: "Grow a loyal audience" },
 audience: { idealViewer: "Curious history fans" },
 content: { types: ["Long-form"] },
 brand: { voice: "Measured" },
 intelligence: { sources: ["Public videos"] },
}

describe("Creator Brain intake convergence", () => {
 it("projects legacy intake answers into the same canonical channel profile", () => {
  const result = syncLegacyAnswersToChannelContext(profile, {
   channelDescription: "A channel about overlooked history",
   recurringSeriesName: "History in Motion",
   recurringSeriesDescription: "Documentary episodes built around a single turning point",
   biggestWeakness: "Inconsistent publishing",
   mostSuccessfulVideo: "The Siege of Vienna",
   signupReason: "Improve strategy",
  })
  expect(result.identity.description).toBe("A channel about overlooked history")
  expect(result.content.recurringSeriesName).toBe("History in Motion")
  expect(result.content.recurringSeriesDescription).toContain("turning point")
  expect(result.content.biggestWeakness).toBe("Inconsistent publishing")
  expect(result.content.mostSuccessfulVideo).toBe("The Siege of Vienna")
  expect(result.intelligence.signupReason).toBe("Improve strategy")
  expect(result.identity.name).toBe("History Channel")
  expect(result.goals.primaryGoal).toBe("Grow a loyal audience")
 })

 it("updates only legacy fields supplied by the intake flow", () => {
  const result = syncLegacyAnswersToChannelContext(profile, { channelDescription: "Updated description" })
  expect(result.identity.description).toBe("Updated description")
  expect(result.identity.niche).toBe("Historical explainers")
  expect(result.audience.idealViewer).toBe("Curious history fans")
 })
 it("projects canonical profile answers back to every legacy compatibility field", () => {
  const result = syncChannelContextToLegacyAnswers({
   channelDescription: "", mainTopicFocus: "", audienceDescription: "", successDefinition: "", mainYoutubeGoal: "",
   recurringSeriesName: "", recurringSeriesDescription: "", biggestWeakness: "", mostSuccessfulVideo: "", signupReason: "",
   whatNext: "", primaryGoal: "views", audienceNiche: "", oneMonthGoals: [], completedAt: null, deferredAt: null, updatedAt: null,
   source: "system", version: 2, channelContext: profile,
  }, {
   ...profile,
   identity: { ...profile.identity, description: "A channel about overlooked history" },
   goals: { ...profile.goals, primaryGoal: "Grow subscribers", successDefinition: "Build a loyal audience" },
   content: { ...profile.content, recurringSeriesName: "History in Motion", recurringSeriesDescription: "A turning-point documentary", biggestWeakness: "Consistency", mostSuccessfulVideo: "The Siege of Vienna" },
   intelligence: { ...profile.intelligence, signupReason: "Improve strategy" },
  })
  expect(result.channelDescription).toBe("A channel about overlooked history")
  expect(result.mainYoutubeGoal).toBe("Grow subscribers")
  expect(result.successDefinition).toBe("Build a loyal audience")
  expect(result.recurringSeriesName).toBe("History in Motion")
  expect(result.recurringSeriesDescription).toBe("A turning-point documentary")
  expect(result.biggestWeakness).toBe("Consistency")
  expect(result.mostSuccessfulVideo).toBe("The Siege of Vienna")
  expect(result.signupReason).toBe("Improve strategy")
 })
 it("uses legacy audienceNiche only as a fallback when mainTopicFocus is absent", () => {
  const result = syncLegacyAnswersToChannelContext(profile, { audienceNiche: "Napoleonic history" })
  expect(result.identity.niche).toBe("Napoleonic history")
  expect(result.identity.description).toBeUndefined()
  expect(result.goals.primaryGoal).toBe("Grow a loyal audience")
 })
 it("migrates legacy answers only into missing canonical fields", () => {
  const canonical = { ...profile, identity: { ...profile.identity, description: "Canonical description", niche: "Canonical niche" }, audience: { ...profile.audience, idealViewer: undefined } }
  const migrated = syncLegacyAnswersToChannelContext(canonical, {
   channelDescription: "Old description",
   mainTopicFocus: "Old niche",
   audienceDescription: "Old audience",
  }, true)
  expect(migrated.identity.description).toBe("Canonical description")
  expect(migrated.identity.niche).toBe("Canonical niche")
  expect(migrated.audience.idealViewer).toBe("Old audience")
 })
 it("persists every canonical intake answer locally and restores it through the canonical loader", () => {
  localStorage.clear()
  const completeProfile: ChannelContextProfile = {
   identity: { name: "History Channel", description: "Long-form history documentaries", niche: "Military history", subNiches: ["Naval history"], competitors: ["HistoryLab"] },
   goals: { primaryGoal: "Grow returning viewers", successDefinition: "Build a loyal audience", priorityRanking: ["retention", "views"], offers: ["Membership"], primaryCTA: "Subscribe" },
   audience: { idealViewer: "Curious adults", experienceLevel: "Enthusiast", transformation: "Understand history", problem: "Too much shallow coverage", segments: ["Students"] },
   content: { types: ["Long-form"], frequency: "Weekly", bestFormats: ["Documentary"], priorityThemes: ["Turning points"], blockedThemes: ["Graphic detail"], recurringSeriesName: "History in Motion", recurringSeriesDescription: "One turning point per episode", biggestWeakness: "Inconsistent publishing", mostSuccessfulVideo: "The Siege of Vienna" },
   brand: { voice: "Measured and curious", influences: ["Documentary makers"], creativity: 7 },
   intelligence: { sources: ["Public videos", "Creator answers"], capabilities: ["Strategy"], signupReason: "Improve channel decisions" },
  }
  saveChannelContextProfile(completeProfile)
  const raw = localStorage.getItem("vt_ai_brain_context_v1")
  expect(raw).not.toBeNull()
  expect(JSON.parse(raw || "{}").channelContext).toEqual(completeProfile)
  expect(loadAiBrainContext().channelContext).toEqual(completeProfile)
  expect(loadAiBrainContext().channelDescription).toBe("Long-form history documentaries")
  expect(loadAiBrainContext().recurringSeriesName).toBe("History in Motion")
  expect(loadAiBrainContext().signupReason).toBe("Improve channel decisions")
 })
 it("isolates locally saved channel profiles and restores the selected channel only", () => {
  localStorage.clear()
  const historyProfile: ChannelContextProfile = {
   identity: { name: "History Channel", niche: "History" },
   goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
  }
  const cookingProfile: ChannelContextProfile = {
   identity: { name: "Cooking Channel", niche: "Cooking" },
   goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
  }

  saveChannelContextProfile(historyProfile, "channel-history")
  saveChannelContextProfile(cookingProfile, "channel-cooking")

  expect(loadAiBrainContext("channel-history").channelContext.identity.name).toBe("History Channel")
  expect(loadAiBrainContext("channel-cooking").channelContext.identity.name).toBe("Cooking Channel")
  expect(loadAiBrainContext("channel-other").channelContext.identity.name).toBeUndefined()
  expect(localStorage.getItem("vt_ai_brain_context_v1:channel:channel-history")).not.toBeNull()
  expect(localStorage.getItem("vt_ai_brain_context_v1:channel:channel-cooking")).not.toBeNull()
 })

 it("migrates a legacy global profile only when its name matches the active channel label", () => {
  localStorage.clear()
  const legacyProfile: ChannelContextProfile = {
   identity: { name: "History Channel", niche: "History" },
   goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
  }
  saveChannelContextProfile(legacyProfile)

  expect(loadAiBrainContext("history channel", "History Channel").channelContext.identity.name).toBe("History Channel")
  expect(localStorage.getItem("vt_ai_brain_context_v1:channel:history%20channel")).not.toBeNull()
  expect(loadAiBrainContext("channel-cooking", "Cooking Channel").channelContext.identity.name).toBeUndefined()
  expect(localStorage.getItem("vt_ai_brain_context_v1")).not.toBeNull()
 })

 it("migrates handle-scoped answers to the stable channel ID when identity matches", () => {
  localStorage.clear()
  const saved = saveChannelContextProfile(profile, "@history")

  const restored = loadAiBrainContext("UC_HISTORY_123", "History Channel", ["@history"])

  expect(restored.channelContext).toEqual(saved.channelContext)
  expect(JSON.parse(localStorage.getItem("vt_ai_brain_context_v1:channel:uc_history_123") || "{}").channelContext)
   .toEqual(saved.channelContext)
  expect(localStorage.getItem("vt_ai_brain_context_v1:channel:%40history")).not.toBeNull()
 })

 it("does not migrate a handle-scoped profile when the active channel label conflicts", () => {
  localStorage.clear()
  saveChannelContextProfile({ ...profile, identity: { ...profile.identity, name: "Cooking Channel" } }, "@history")

  const restored = loadAiBrainContext("UC_HISTORY_123", "History Channel", ["@history"])

  expect(restored.channelContext.identity.name).toBeUndefined()
  expect(localStorage.getItem("vt_ai_brain_context_v1:channel:uc_history_123")).toBeNull()
 })

 it("keeps the canonical stable-ID profile when a stale handle profile also exists", () => {
  localStorage.clear()
  const canonical = saveChannelContextProfile(profile, "UC_HISTORY_123")
  saveChannelContextProfile({ ...profile, identity: { ...profile.identity, name: "Stale handle profile" } }, "@history")

  const restored = loadAiBrainContext("UC_HISTORY_123", "History Channel", ["@history"])

  expect(restored.channelContext).toEqual(canonical.channelContext)
 })

})
