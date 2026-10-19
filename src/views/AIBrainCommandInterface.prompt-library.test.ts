import { describe, expect, it } from "vitest"
import type { CreatorBrainPromptCard } from "../types"
import { filterCreatorBrainPromptCards, shouldSendBrainComposerKey } from "./AIBrainCommandInterface"

const cards: CreatorBrainPromptCard[] = [
 { id: "analyze-channel-niche", label: "Channel niche", prompt: "Analyze my channel niche", category: "strategy", color: "#C0F240" },
 { id: "why-views-changed", label: "Views changed", prompt: "Diagnose why views changed this week", category: "analytics", color: "#36E0F6" },
 { id: "seo-script-drafter", label: "SEO script", prompt: "Draft an SEO-ready script", category: "seo", color: "#FF7AC8" },
]

describe("Brain launchpad prompt discovery", () => {
 it("searches prompt labels, full prompt text, category, and IDs", () => {
  expect(filterCreatorBrainPromptCards(cards, "niche").map((card) => card.id)).toEqual(["analyze-channel-niche"])
  expect(filterCreatorBrainPromptCards(cards, "this week").map((card) => card.id)).toEqual(["why-views-changed"])
  expect(filterCreatorBrainPromptCards(cards, "seo").map((card) => card.id)).toEqual(["seo-script-drafter"])
 })

 it("applies category filters and reports no accidental cross-category matches", () => {
  expect(filterCreatorBrainPromptCards(cards, "", "analytics").map((card) => card.id)).toEqual(["why-views-changed"])
  expect(filterCreatorBrainPromptCards(cards, "niche", "seo")).toEqual([])
  expect(filterCreatorBrainPromptCards(cards, "  ", "all")).toHaveLength(3)
 })

 it("keeps Enter-to-send from firing during IME composition", () => {
  expect(shouldSendBrainComposerKey({ key: "Enter", isComposing: true })).toBe(false)
  expect(shouldSendBrainComposerKey({ key: "Enter", isComposing: false })).toBe(true)
  expect(shouldSendBrainComposerKey({ key: "Escape", isComposing: false })).toBe(false)
 })
})
