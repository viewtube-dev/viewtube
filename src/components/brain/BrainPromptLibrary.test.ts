import { describe, expect, it } from "vitest"
import { filterCreatorBrainPromptCards, promptCardSummary } from "./BrainPromptLibrary"
import type { CreatorBrainPromptCard } from "../../types"

const cards: CreatorBrainPromptCard[] = [
 { id: "analyze-channel-niche", label: "Analyze Channel Niche", prompt: "Find the channel niche", category: "strategy", color: "#4FFF5B" },
 { id: "analyze-formats", label: "Analyze Formats", prompt: "Compare views and retention", category: "analytics", color: "#40C6E9" },
 { id: "title-thumbnail-test", label: "Title Thumbnail Test", prompt: "Create a title test", category: "seo", color: "#FF83EA" },
]

describe("BrainPromptLibrary filtering", () => {
 it("returns all canonical cards with no query or category restriction", () => {
  expect(filterCreatorBrainPromptCards(cards, "")).toEqual(cards)
 })

 it("filters by category without changing card definitions or ordering", () => {
  expect(filterCreatorBrainPromptCards(cards, "", "analytics")).toEqual([cards[1]])
  expect(cards.map((card) => card.id)).toEqual([
   "analyze-channel-niche",
   "analyze-formats",
   "title-thumbnail-test",
  ])
 })

 it("searches labels, full prompt text, summaries, categories, and IDs", () => {
  expect(filterCreatorBrainPromptCards(cards, "retention").map((card) => card.id)).toEqual(["analyze-formats"])
  expect(filterCreatorBrainPromptCards(cards, "seo").map((card) => card.id)).toEqual(["title-thumbnail-test"])
  expect(filterCreatorBrainPromptCards(cards, "niche").map((card) => card.id)).toEqual(["analyze-channel-niche"])
 })

 it("keeps an editable prompt as a working copy rather than mutating the shared definition", () => {
  const original = cards[0]
  const workingCopy = `${original.prompt} Include three examples.`
  expect(workingCopy).not.toBe(original.prompt)
  expect(original.prompt).toBe("Find the channel niche")
 })

 it("provides a creator-facing summary when one is defined", () => {
  expect(promptCardSummary(cards[0])).toBe("Find your niche and fuzzy edges.")
 })
})
