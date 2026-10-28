import { describe, expect, it } from "vitest"
import { resolveBrainRetryInput, type BrainGenerationInputSnapshot } from "./BrainRetryContinuity"

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

 it("restores the complete original model-visible snapshot for saved-evidence generation-only retries", async () => {
  const { resolveBrainModelInputSnapshot } = await import("./BrainRetryContinuity")
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true,
   generationOnly: true,
   mode: "saved",
   continuity: "original_input_restored",
   saved,
  })).toEqual(saved)
 })

 it.each([
  ["ordinary generation", { retryTurn: false, generationOnly: true, mode: "saved" as const, continuity: "original_input_restored" as const }],
  ["non-generation retry", { retryTurn: true, generationOnly: false, mode: "saved" as const, continuity: "original_input_restored" as const }],
  ["fresh evidence", { retryTurn: true, generationOnly: true, mode: "fresh" as const, continuity: "original_input_restored" as const }],
  ["legacy reconstruction", { retryTurn: true, generationOnly: true, mode: "saved" as const, continuity: "legacy_context_reconstructed" as const }],
  ["missing snapshot", { retryTurn: true, generationOnly: true, mode: "saved" as const, continuity: "original_input_restored" as const }],
 ])("does not reuse saved model input for %s", (_label, options) => {
  const { resolveBrainModelInputSnapshot } = require("./BrainRetryContinuity") as typeof import("./BrainRetryContinuity")
  expect(resolveBrainModelInputSnapshot({ ...options, saved: _label === "missing snapshot" ? undefined : saved })).toBeUndefined()
 })

 it("rejects a saved payload without a string system instruction", async () => {
  const { resolveBrainModelInputSnapshot } = await import("./BrainRetryContinuity")
  expect(resolveBrainModelInputSnapshot({
   retryTurn: true,
   generationOnly: true,
   mode: "saved",
   continuity: "original_input_restored",
   saved: { ...saved, systemInstruction: undefined },
  })).toBeUndefined()
 })
})
