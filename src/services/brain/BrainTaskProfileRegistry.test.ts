import { describe, expect, it } from "vitest"
import { resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"

describe("Brain task-profile routing matrix", () => {
 const cases = [
  { label: "direct question", text: "What does my channel do best?", id: "strategy", intent: "strategy", mode: "strategy_brief" },
  { label: "strategy request", text: "Help me position my channel for growth", id: "strategy", intent: "strategy", mode: "strategy_brief" },
  { label: "analytics diagnosis", text: "Analyze my channel views and retention", id: "analytics", intent: "analytics", mode: "analytics_diagnosis" },
  { label: "channel profile question", text: "What is my channel niche and identity?", id: "strategy", intent: "strategy", mode: "strategy_brief" },
  { label: "creator asset generation", text: "Draft a pinned comment for my latest video", id: "creator_asset_draft", intent: "content_generation", mode: "creator_asset_draft", assetKind: "pinned_comment" },
 ] as const

 it.each(cases)("routes $label to its explicit task profile", (testCase) => {
  const profile = resolveBrainTaskProfile(testCase.text)
  expect(profile.id).toBe(testCase.id)
  expect(profile.intent).toBe(testCase.intent)
  expect(profile.answerMode).toBe(testCase.mode)
  if ("assetKind" in testCase) expect(profile.assetKind).toBe(testCase.assetKind)
 })
})
