import { describe, expect, it } from "vitest"
import { resolveBrainRetryInput, resolveBrainModelInputSnapshot, type BrainGenerationInputSnapshot } from "./BrainRetryContinuity"

type Snapshot = { evidenceIds: string[]; revision: string }
const input = (revision: string): BrainGenerationInputSnapshot<Snapshot> => ({
 snapshot: { evidenceIds: [revision], revision },
 systemPrompt: `system-${revision}`,
 growthContext: { revision },
 recentTurns: [{ id: revision }],
 history: [{ content: revision }],
 projectId: `project-${revision}`,
 visibleContext: { revision },
})

describe("resolveBrainRetryInput", () => {
 it("restores the exact saved generation input for a saved-evidence retry", () => {
  const saved = input("original")
  const current = input("rebuilt")

  const result = resolveBrainRetryInput({ mode: "saved", saved, current })

  expect(result.continuity).toBe("original_input_restored")
  expect(result.generationInput).toEqual(saved)
 })

 it("uses the current snapshot and labels a fresh-evidence retry", () => {
  const saved = input("original")
  const current = input("fresh")

  const result = resolveBrainRetryInput({ mode: "fresh", saved, current })

  expect(result.continuity).toBe("fresh_evidence_retry")
  expect(result.generationInput).toEqual(current)
 })

 it("labels a legacy retry as reconstructed when no saved generation input exists", () => {
  const current = input("rebuilt")

  const result = resolveBrainRetryInput({ mode: "saved", current })

  expect(result.continuity).toBe("legacy_context_reconstructed")
  expect(result.generationInput).toEqual(current)
 })
})


describe("resolveBrainModelInputSnapshot", () => {
 const saved = {
  systemInstruction: "exact original system instruction",
  history: [{ role: "user", content: "original history" }],
  userText: "original question",
  evidenceRecords: [{ id: "analytics-1", value: 42 }],
  creatorAnswerEvidenceRecords: [{ id: "creator-answer-1", value: "goal" }],
 }

 it("restores the complete original model-visible snapshot for saved-evidence generation-only retries", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true,
   generationOnly: true,
   mode: "saved",
   continuity: "original_input_restored",
   saved,
  })).toEqual(saved)
 })

 it("does not restore saved model input for ordinary generation", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: false, generationOnly: true, mode: "saved",
   continuity: "original_input_restored", saved,
  })).toBeUndefined()
 })

 it("does not restore saved model input for retries that are not generation-only", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true, generationOnly: false, mode: "saved",
   continuity: "original_input_restored", saved,
  })).toBeUndefined()
 })

 it("rebuilds model input for fresh-evidence retries", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true, generationOnly: true, mode: "fresh",
   continuity: "original_input_restored", saved,
  })).toBeUndefined()
 })

 it("does not label reconstructed legacy context as the original model input", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true, generationOnly: true, mode: "saved",
   continuity: "legacy_context_reconstructed", saved,
  })).toBeUndefined()
 })

 it("does not restore when the saved snapshot is missing or lacks a system instruction", () => {
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true, generationOnly: true, mode: "saved",
   continuity: "original_input_restored",
  })).toBeUndefined()
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true, generationOnly: true, mode: "saved",
   continuity: "original_input_restored",
   saved: { ...saved, systemInstruction: undefined },
  })).toBeUndefined()
 })
})
