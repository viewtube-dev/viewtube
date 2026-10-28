export type BrainRetryEvidenceMode = "saved" | "fresh"

export type BrainRetryContextContinuity =
 | "original_input_restored"
 | "fresh_evidence_retry"
 | "legacy_context_reconstructed"

/**
 * Persisted, serializable inputs needed to repeat a Brain generation faithfully.
 * This is stored inside the canonical conversation turn metadata, not in a new store.
 */
export interface BrainGenerationInputSnapshot<TSnapshot = unknown> {
 snapshot: TSnapshot
 systemPrompt: string
 growthContext: unknown
 recentTurns?: unknown[]
 history?: unknown[]
 projectId?: string | null
 project?: unknown
 projects?: unknown[]
 visibleContext?: Record<string, unknown> | null
 artifactRefs?: string[]
}

export const resolveBrainRetryInput = <TSnapshot,>(input: {
 mode: BrainRetryEvidenceMode
 saved?: BrainGenerationInputSnapshot<TSnapshot> | null
 current: BrainGenerationInputSnapshot<TSnapshot>
}): {
 generationInput: BrainGenerationInputSnapshot<TSnapshot>
 continuity: BrainRetryContextContinuity
} => {
 if (input.mode === "fresh") {
  return { generationInput: input.current, continuity: "fresh_evidence_retry" }
 }

 if (input.saved
  && typeof input.saved.systemPrompt === "string"
  && input.saved.snapshot !== undefined
  && input.saved.growthContext !== undefined) {
  return { generationInput: input.saved, continuity: "original_input_restored" }
 }

 // Legacy turns predate the saved generation-input manifest. Use the current
 // context only as a compatibility fallback and never label it as the original.
 return { generationInput: input.current, continuity: "legacy_context_reconstructed" }
}
