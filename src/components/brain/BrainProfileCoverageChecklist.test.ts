import { describe, expect, it } from "vitest"
import { buildBrainProfileCoverageItems } from "./BrainProfileCoverageChecklist"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"

type SnapshotOverrides = {
 evidencePack?: { channelDescription: string | null }
 inferredProfile?: { videoCount: number }
 vtSync?: { videos: number }
 brain?: { goals: number }
 conversations?: { answeredQuestions: string[] }
 tools?: AIBrainContextSnapshot["tools"]
}

const makeSnapshot = (overrides: SnapshotOverrides = {}) => ({
 evidencePack: { channelDescription: null },
 inferredProfile: { videoCount: 0 },
 vtSync: { videos: 0 },
 brain: { goals: 0 },
 conversations: { answeredQuestions: [] },
 tools: [],
 ...overrides,
}) as unknown as AIBrainContextSnapshot

describe("buildBrainProfileCoverageItems", () => {
 it("offers concrete next steps for missing creator profile evidence", () => {
  const items = buildBrainProfileCoverageItems(makeSnapshot())
  expect(items.find((item) => item.id === "channel-description")).toMatchObject({
   label: "Channel description missing",
   complete: false,
   actionLabel: "Add description",
  })
  expect(items.find((item) => item.id === "video-evidence")).toMatchObject({
   label: "No videos analyzed",
   complete: false,
   actionRoute: "/vt-sync-local",
  })
  expect(items.find((item) => item.id === "creator-goals")).toMatchObject({
   label: "Goals unconfirmed",
   complete: false,
   actionLabel: "Confirm goals",
  })
  expect(items.find((item) => item.id === "style-preference")).toMatchObject({
   label: "Style preference unconfirmed",
   complete: false,
   actionLabel: "Add style examples",
  })
 })

 it("uses saved answers and actual profile evidence rather than a synthetic confidence score", () => {
  const items = buildBrainProfileCoverageItems(makeSnapshot({
   evidencePack: { channelDescription: "Practical woodworking tutorials" },
   inferredProfile: { videoCount: 42 },
   vtSync: { videos: 39 },
   brain: { goals: 1 },
   conversations: { answeredQuestions: ["What is your editing style? Answer: Fast-paced, close-up demonstrations."] },
   tools: [{
    toolId: "cinematic-analytics-lab",
    title: "Analytics",
    route: "/analytics",
    surface: "analytics",
    sourceOfTruth: "Analytics registry",
    status: "ready",
   }],
  }))
  expect(items.find((item) => item.id === "channel-description")).toMatchObject({ complete: true, label: "Channel description" })
  expect(items.find((item) => item.id === "video-evidence")).toMatchObject({ complete: true, label: "42 videos analyzed" })
  expect(items.find((item) => item.id === "creator-goals")).toMatchObject({ complete: true, label: "Goals confirmed" })
  expect(items.find((item) => item.id === "style-preference")).toMatchObject({ complete: true, label: "Style preference confirmed" })
  expect(items.find((item) => item.id === "analytics-capability")).toMatchObject({ complete: true, label: "Analytics capability available" })
 })
})
