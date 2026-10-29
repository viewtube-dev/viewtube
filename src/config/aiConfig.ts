import { GEMINI_MODEL_REGISTRY } from "@/services/geminiModelGovernance"

export type GeminiModelFamily = "3.0" | "3.1"
export type GeminiModelTier = "flash" | "pro" | "lite" | "image"

export interface GeminiModel {
  id: string
  name: string
  family: GeminiModelFamily
  tier: GeminiModelTier
  costMultiplier: number
  description: string
}

/**
 * UI compatibility projection of the canonical governance registry.
 * Do not add model IDs here; add reviewed metadata to geminiModelGovernance.ts.
 */
export const GEMINI_MODELS: GeminiModel[] = Object.values(GEMINI_MODEL_REGISTRY).map((model) => ({
  id: model.id,
  name: model.displayName,
  family: model.family,
  tier: model.tier,
  costMultiplier: model.costMultiplier,
  description: model.capabilities.includes("image")
    ? "Image generation and multimodal image tasks."
    : model.capabilities.includes("thinking")
      ? "Reasoning and complex analysis tasks."
      : model.lifecycle === "legacy"
        ? "Legacy compatibility model; availability must be verified for the active key."
        : "Text and multimodal generation; availability depends on provider access.",
}))

export const DEFAULT_MODEL_ID = "gemini-3.1-flash-lite"
