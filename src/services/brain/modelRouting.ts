/**
 * Compatibility facade for existing Brain routing consumers.
 * Canonical IDs, aliases, capability rules, and substitution semantics live in
 * geminiModelGovernance.ts; keep new routing policy out of this module.
 */
import {
  isGeminiSubstitutionSurprising,
  resolveGeminiModel,
  type GeminiCapability,
  type GeminiSubstitutionReason,
  type GeminiModelResolution,
} from "../geminiModelGovernance"

export type ModelCapability = GeminiCapability
export type ModelSubstitutionReason = GeminiSubstitutionReason
export type ModelResolution = GeminiModelResolution

export const resolveModelForCapability = (input: {
  /** Creator preference; aliases and provider resource prefixes are normalized. */
  preference: string
  capability: ModelCapability
}): ModelResolution => resolveGeminiModel(input)

export const isSurprisingSubstitution = (resolution: ModelResolution): boolean =>
  isGeminiSubstitutionSurprising(resolution)
