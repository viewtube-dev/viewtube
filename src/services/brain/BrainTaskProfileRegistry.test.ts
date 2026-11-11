import { describe, expect, it } from "vitest"
import { resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"
import { BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS, selectBrainCapabilities } from "./BrainCapabilityRegistry"
import { DEFAULT_BRAIN_USER_CONTROLS, clearBrainUserControlOverride, writeBrainUserControls } from "./BrainUserControls"
import { resolveBrainContextSections } from "./BrainContextResolution"

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

describe("Brain task, capability, context, and response-mode contract", () => {
 const cases = [
  { label: "direct question", text: "What does my channel do best?", capabilities: ["channel-profile", "goal-coach"], mode: "strategy_brief" },
  { label: "strategy request", text: "Help me position my channel for growth", capabilities: ["channel-profile", "goal-coach"], mode: "strategy_brief" },
  { label: "analytics diagnosis", text: "Analyze my channel views and retention", capabilities: ["analytics-diagnosis", "statistics-intelligence"], mode: "analytics_diagnosis" },
  { label: "channel profile question", text: "What is my channel niche and identity?", capabilities: ["channel-profile", "goal-coach"], mode: "strategy_brief" },
  { label: "creator asset generation", text: "Draft a pinned comment for my latest video", capabilities: ["content-generation"], mode: "creator_asset_draft" },
 ] as const

 it.each(cases)("keeps $label task, capability, required-context, and response-mode aligned", ({ text, capabilities: expectedCapabilities, mode }) => {
  const channelId = "brain-context-contract-test"
  writeBrainUserControls(DEFAULT_BRAIN_USER_CONTROLS, channelId)
  try {
   const profile = resolveBrainTaskProfile(text)
   const selected = selectBrainCapabilities({
    channelId,
    userText: text,
    snapshot: { inferredProfile: { videoCount: 8, status: "ready" } } as any,
    maximum: 8,
   })
   const selectedIds = selected.map((capability) => capability.id)
   expect(profile.answerMode).toBe(mode)
   for (const id of expectedCapabilities) expect(selectedIds).toContain(id)

   const sectionIds = [
    "confirmed_creator_context", "channel_knowledge", "channel_evidence", "evidence_quality",
    "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings",
    "algorithm_channel_opportunity_intelligence", "audience_intelligence", "creator_style",
    "public_niche_knowledge", "active_project_context", "current_public_research",
   ]
   const sections = [
    "System prompt\nA fixed system instruction.",
    "\nCreator control policy\nCreator permission boundaries.",
    ...sectionIds.map((id) => `
${id.replace(/_/g, " ")}
Canonical section for ${id}.`),
   ]
   const resolved = resolveBrainContextSections(sections, {
    userText: text,
    maximumCharacters: 20_000,
    capabilityIds: selectedIds,
   })
   const expectedRequiredSections = selectedIds.flatMap((id) => BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[id] || [])
   for (const sectionId of expectedRequiredSections) expect(resolved.requiredSectionIds).toContain(sectionId)
   expect(resolved.selectedSectionIds).toContain("system_prompt")
  } finally {
   clearBrainUserControlOverride(channelId)
  }
 })
})
