import { describe, expect, it } from "vitest"
import { syncLegacyAnswersToChannelContext } from "./aiBrainContext"
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
})
