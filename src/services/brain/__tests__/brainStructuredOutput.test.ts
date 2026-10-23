import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { buildGoldenChannelFixture, restorationRichSpec, emptyChannelSpec } from "../fixtures"
import { fromStructuredOutput, validateBrainResponse } from "../BrainOrchestrator"
import type { StructuredBrainModelOutput } from "../../gemini"
import type { EvidenceRecord } from "../EvidenceRecord"

const createStorage = () => {
 const store = new Map<string, string>()
 return {
  getItem: vi.fn((key: string) => store.get(key) || null),
  setItem: vi.fn((key: string, value: string) => {
   store.set(key, value)
  }),
  removeItem: vi.fn((key: string) => {
   store.delete(key)
  }),
  clear: vi.fn(() => {
   store.clear()
  }),
 }
}

const baseOutput = (overrides: Partial<StructuredBrainModelOutput> = {}): StructuredBrainModelOutput => ({
 headline: "Analytics Diagnosis",
 keyInsight: "Your restoration lane carries the clearest signal.",
 body: "Compare recent uploads against your strongest restoration videos.",
 mode: "analytics_diagnosis",
 modules: [],
 actions: ["Rewrite one title"],
 ...overrides,
})


const promptEvidenceRecord = (id: string, value: number): EvidenceRecord => ({
 id,
 owner: "analytics-canon",
 sourceRef: "channel_summary",
 metric: id === "record-views" ? "views" : "clickThroughRate",
 value,
 freshness: "fresh",
 epistemicState: "OBSERVED",
 provenance: { evidenceIds: ["source-1"] },
})

describe("structured model output -> CreatorBrainResponse", () => {
 let storage: ReturnType<typeof createStorage>

 beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal("localStorage", storage)
 })

 afterEach(() => {
  vi.unstubAllGlobals()
 })

 it("carries structured module data (metrics, points, ranked items) through", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const output = baseOutput({
   modules: [
    {
     title: "Metric Pulse",
     body: "Reach improved while click-through slipped.",
     tone: "blue",
     kind: "metric_comparison",
     data: { metrics: [{ label: "CTR", displayValue: "6.8%", change: -0.8 }] },
    },
    {
     title: "Views Trend",
     body: "Momentum is building.",
     tone: "green",
     kind: "trend_chart",
     data: { points: [{ label: "w1", value: 10 }, { label: "w2", value: 14 }, { label: "w3", value: 22 }] },
    },
    {
     title: "Top Videos",
     body: "",
     tone: "blue",
     kind: "idea_scorecard",
     data: { items: [{ title: "Restoring a Rusted 1940s Hand Plane", detail: "512K views" }] },
    },
   ],
  })

  const response = fromStructuredOutput(output, snapshot)
  const modules = response.modules || []
  expect(modules.find((module) => module.title === "Metric Pulse")?.data?.metrics?.[0]?.displayValue).toBe("6.8%")
  expect(modules.find((module) => module.title === "Views Trend")?.data?.points).toHaveLength(3)
  expect(modules.find((module) => module.title === "Top Videos")?.data?.items?.[0]?.title).toBe(
   "Restoring a Rusted 1940s Hand Plane",
  )
 })


 it("keeps claim-to-evidence links only when claims are verbatim and IDs belong to the supplied prompt manifest", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const output = baseOutput({
   keyInsight: "Views increased to 12,400 after the title change.",
   body: "CTR reached 6.8% in the latest window.",
   claimEvidence: [
    { claim: "Views increased to 12,400 after the title change.", evidenceIds: ["record-views", "not-in-prompt"] },
    { claim: "This sentence is not in the response: 12,400.", evidenceIds: ["record-views"] },
    { claim: "CTR reached 6.8% in the latest window.", evidenceIds: ["record-window"] },
   ],
  } as Partial<StructuredBrainModelOutput>)

  const response = fromStructuredOutput(output, snapshot, [promptEvidenceRecord("record-views", 12400), promptEvidenceRecord("record-window", 6.8)])

  expect(response.claimEvidence).toEqual([
   { claim: "Views increased to 12,400 after the title change.", evidenceIds: ["record-views"], verification: "direct_value_match" },
   { claim: "CTR reached 6.8% in the latest window.", evidenceIds: ["record-window"], verification: "direct_value_match" },
  ])
 })

 it("drops claim links with no verified prompt evidence IDs", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const output = baseOutput({
   keyInsight: "Views reached 9,999.",
   claimEvidence: [{ claim: "Views reached 9,999.", evidenceIds: ["record-views"] }],
  } as Partial<StructuredBrainModelOutput>)

  const response = fromStructuredOutput(output, snapshot, [promptEvidenceRecord("record-views", 12400)])
  expect(response.claimEvidence).toBeUndefined()
 })

 it("rejects invented numbers inside structured data via the number guard", () => {
  const snapshot = buildGoldenChannelFixture(emptyChannelSpec).snapshot
  const output = baseOutput({
   mode: "analytics_diagnosis",
   modules: [
    {
     title: "Metric Pulse",
     body: "Your channel is doing great.",
     tone: "blue",
     kind: "metric_comparison",
     // 874321 appears nowhere in an empty channel's evidence — it is invented.
     data: { metrics: [{ label: "Views", displayValue: "874321 views" }] },
    },
   ],
  })

  const response = fromStructuredOutput(output, snapshot)
  const evaluation = validateBrainResponse({ response, snapshot })
  expect(evaluation.unsupportedNumbers).toContain("874321")
  expect(evaluation.passed).toBe(false)
 })

 it("does not downgrade a creative asset draft that contains legitimate numbers", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  // A drafted description with a year and a count — perfectly valid creative copy that
  // isn't in the analytics evidence. Analytics rules would reject it; asset drafts must not.
  const output = baseOutput({
   mode: "creator_asset_draft",
   keyInsight: "Here is a paste-ready description for your next restoration video.",
   body: "In this 1940s hand plane restoration, I walk through all 12 steps from rust to razor-sharp.",
   modules: [{ title: "Description", body: "Restored from a rusty 1943 relic in 12 stages.", tone: "green", kind: "recommendation_stack" }],
  })
  const response = fromStructuredOutput(output, snapshot)

  const asDraft = validateBrainResponse({ response, snapshot, expectedMode: "creator_asset_draft" })
  expect(asDraft.passed).toBe(true)

  // The same copy judged as an analytics answer would be rejected for invented numbers.
  const asAnalytics = validateBrainResponse({ response, snapshot, expectedMode: "analytics_diagnosis" })
  expect(asAnalytics.passed).toBe(false)
 })

 it("drops empty structured payloads so a module falls back to prose", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const output = baseOutput({
   modules: [{ title: "Next Move", body: "Repeat your best format.", tone: "green", kind: "recommendation_stack", data: {} }],
  })
  const response = fromStructuredOutput(output, snapshot)
  expect(response.modules?.[0]?.data).toBeUndefined()
 })

 it("fails closed when the model output mode does not match the requested task", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const response = fromStructuredOutput(baseOutput({
   mode: "analytics_diagnosis",
   keyInsight: "The channel has a clear opportunity.",
   body: "Review the latest videos.",
  }), snapshot)

  const evaluation = validateBrainResponse({
   response,
   snapshot,
   expectedMode: "creator_asset_draft",
  })

  expect(evaluation.passed).toBe(false)
  expect(evaluation.repairReasons.some((reason) => reason.includes("does not match"))).toBe(true)
 })

 it("requires audience insight answers to include a finding, usable language, and an evidence boundary", () => {
  const snapshot = buildGoldenChannelFixture(restorationRichSpec).snapshot
  const incomplete = fromStructuredOutput(baseOutput({
   mode: "audience_insight",
   keyInsight: "Your audience is interested in restoration.",
   body: "This could be a useful direction.",
   actions: ["Make more videos."],
  }), snapshot)

  const evaluation = validateBrainResponse({
   response: incomplete,
   snapshot,
   expectedMode: "audience_insight",
  })

  expect(evaluation.passed).toBe(false)
  expect(evaluation.repairReasons).toContain(
   "Answer the audience-language task with an audience finding, concrete language guidance, and an evidence boundary.",
  )
 })
})
