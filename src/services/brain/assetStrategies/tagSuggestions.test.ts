import { describe, expect, it } from "vitest"
import { tagSuggestionsStrategy } from "./tagSuggestions"

describe("tag suggestions specialist strategy", () => {
 it("uses a typed ranked-tag array contract", () => {
  expect(tagSuggestionsStrategy.assetType).toBe("tags")
  expect(tagSuggestionsStrategy.outputSchemaVersion).toBe("tag-suggestions-v1")
  expect(tagSuggestionsStrategy.schema).toMatchObject({
   type: "ARRAY",
   items: { type: "OBJECT", required: ["tag", "score", "searchVolume", "competition", "rank", "tripleKeyword"] },
  })
 })
 it("distinguishes generation from analysis and labels market numbers as estimates", () => {
  const task = tagSuggestionsStrategy.buildTaskInstruction({
   channelId: "channel-1",
   assetType: "tags",
   instruction: "Improve tags",
   inputs: { mode: "analyze", title: "Repair a vintage radio", description: "A restoration walkthrough", tags: ["radio repair", "electronics"] },
  }, { requested: [], refs: [], missing: [], payload: {}, summary: "" })
  expect(task).toContain("Analyze the supplied tags")
  expect(task).toContain("estimates, not live YouTube search measurements")
  expect(task).toContain("radio repair")
 })
 it("rejects empty, duplicate and out-of-range tag suggestions", () => {
  const findings = tagSuggestionsStrategy.rubric?.([
   { tag: "", score: 120, searchVolume: -2, competition: 0, rank: 0, tripleKeyword: false },
   { tag: "duplicate", score: 50, searchVolume: 10, competition: 10, rank: 2, tripleKeyword: false },
   { tag: "DUPLICATE", score: 50, searchVolume: 10, competition: 10, rank: 2, tripleKeyword: false },
  ], { channelId: "channel-1", assetType: "tags", instruction: "Generate tags" })
  expect(findings?.map(item => item.rule)).toEqual(expect.arrayContaining([
   "tag_required", "tag_score_range", "tag_estimate_nonnegative", "tag_rank_positive", "tag_unique",
  ]))
 })
})
