import { describe, expect, it } from "vitest"
import { resolveBrainContextSections } from "./BrainContextResolution"

describe("Brain context resolution", () => {
 it("prioritizes task-relevant context while keeping readable source order", () => {
  const result = resolveBrainContextSections([
   "System prompt",
   "\nCHANNEL EVIDENCE\n" + "e".repeat(120),
   "\nCREATOR STYLE\n" + "s".repeat(120),
   "\nACTIVE PROJECT CONTEXT\n" + "p".repeat(120),
   "\nCONTENT GENERATION TASK\nDraft a title.",
  ], { userText: "Write a title for my video", maximumCharacters: 400 })
  expect(result.selectedSectionIds).toContain("creator_style")
  expect(result.selectedSectionIds).not.toContain("channel_evidence")
  expect(result.text).toContain("CREATOR STYLE")
 })

 it("honors the character budget and reports omissions", () => {
  const result = resolveBrainContextSections([
   "System prompt",
   "\nCREATOR CONTROL POLICY\nAlways obey creator permissions.",
   "\nCHANNEL EVIDENCE\n" + "e".repeat(500),
   "\nCURRENT PUBLIC RESEARCH\n" + "r".repeat(500),
  ], { userText: "Analyze my channel views", maximumCharacters: 180 })
  expect(result.characterCount).toBeLessThanOrEqual(180)
  expect(result.omittedSectionIds.length).toBeGreaterThan(0)
  expect(result.selectedSectionIds).toContain("system_prompt")
  expect(result.selectedSectionIds).toContain("channel_evidence")
  expect(result.selectedSectionIds).not.toContain("current_public_research")
 })

 it("reports capability-required evidence sections that are absent instead of silently treating them as available", () => {
  const result = resolveBrainContextSections([
   "System prompt",
   "\\nCREATOR CONTROL POLICY\\nAnalytics evidence access is enabled.",
  ], {
   userText: "Analyze my channel views",
   maximumCharacters: 2000,
   capabilityIds: ["statistics-intelligence"],
  })
  expect(result.omittedSectionIds).toContain("required_evidence_missing:channel_evidence")
  expect(result.omittedSectionIds).toContain("required_evidence_missing:evidence_quality")
  expect(result.omittedSectionIds).toContain("required_evidence_missing:shared_evidence_contract")
  expect(result.omittedSectionIds).toContain("required_evidence_missing:deterministic_statistics_intelligence")
 })

 it("deduplicates repeated context sections", () => {
  const repeated = "\nCHANNEL KNOWLEDGE\n" + "same statement ".repeat(8)
  const result = resolveBrainContextSections(["System prompt", repeated, repeated], {
   userText: "Plan my channel strategy",
   maximumCharacters: 2000,
  })
  expect(result.omittedSectionIds).toContain("channel_knowledge:duplicate")
  expect(result.selectedSectionIds.filter((id) => id === "channel_knowledge")).toHaveLength(1)
 })
})
