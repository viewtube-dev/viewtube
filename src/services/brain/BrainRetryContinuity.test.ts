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
