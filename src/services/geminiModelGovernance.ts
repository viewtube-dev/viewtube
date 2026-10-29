/**
 * Canonical Gemini model metadata and routing policy.
 *
 * Model availability is credential/region/API dependent; registry membership is not
 * proof that a model is available to a particular key. Pricing entries below preserve
 * the application's existing estimates and are explicitly marked unverified until
 * reconciled with current provider pricing.
 */
export type GeminiCapability =
  | "text" | "image" | "video" | "thinking" | "analysis"
  | "fast-text" | "audio" | "tts" | "live"

export type GeminiModelPricing = {
  inputUsdPer1k: number
  outputUsdPer1k: number
  source: "legacy-app-estimate"
  verified: false
}

export interface GeminiModelMetadata {
  id: string
  displayName: string
  family: "3.0" | "3.1"
  tier: "flash" | "pro" | "lite" | "image"
  capabilities: readonly GeminiCapability[]
  lifecycle: "preview" | "stable" | "legacy"
  costMultiplier: number
  pricing?: GeminiModelPricing
}

const legacyPricing = (inputUsdPer1k: number, outputUsdPer1k: number): GeminiModelPricing => ({
  inputUsdPer1k,
  outputUsdPer1k,
  source: "legacy-app-estimate",
  verified: false,
})

export const GEMINI_MODEL_REGISTRY: Readonly<Record<string, GeminiModelMetadata>> = Object.freeze({
  "gemini-3.1-pro-preview": {
    id: "gemini-3.1-pro-preview", displayName: "Gemini 3.1 Pro Preview", family: "3.1",
    tier: "pro", capabilities: ["text", "thinking", "analysis"], lifecycle: "preview",
    costMultiplier: 15,
    pricing: legacyPricing(0.0035, 0.0105),
  },
  "gemini-3.1-flash-lite": {
    id: "gemini-3.1-flash-lite", displayName: "Gemini 3.1 Flash Lite", family: "3.1",
    tier: "lite", capabilities: ["text", "fast-text"], lifecycle: "preview",
    costMultiplier: 1,
    pricing: legacyPricing(0.0001, 0.0003),
  },
  "gemini-3.1-flash-image-preview": {
    id: "gemini-3.1-flash-image-preview", displayName: "Gemini 3.1 Flash Image Preview", family: "3.1",
    tier: "image", capabilities: ["image", "text"], lifecycle: "preview",
    costMultiplier: 5,
    pricing: legacyPricing(0.001, 0.005),
  },
  "gemini-3-flash-preview": {
    id: "gemini-3-flash-preview", displayName: "Gemini 3 Flash Preview", family: "3.0",
    tier: "flash", capabilities: ["text", "video", "audio"], lifecycle: "preview",
    costMultiplier: 2,
    pricing: legacyPricing(0.0004, 0.0012),
  },
  "gemini-3.1-pro": {
    id: "gemini-3.1-pro", displayName: "Gemini 3.1 Pro", family: "3.1",
    tier: "pro", capabilities: ["text", "thinking", "analysis"], lifecycle: "stable",
    costMultiplier: 15,
    pricing: legacyPricing(0.0035, 0.0105),
  },
  "gemini-3.1-flash": {
    id: "gemini-3.1-flash", displayName: "Gemini 3.1 Flash", family: "3.1",
    tier: "flash", capabilities: ["text", "fast-text"], lifecycle: "stable",
    costMultiplier: 1.5,
    pricing: legacyPricing(0.00035, 0.00105),
  },
  "gemini-3.0-pro": {
    id: "gemini-3.0-pro", displayName: "Gemini 3.0 Pro (legacy)", family: "3.0",
    tier: "pro", capabilities: ["text", "thinking", "analysis"], lifecycle: "legacy",
    costMultiplier: 10,
    pricing: legacyPricing(0.003, 0.009),
  },
  "gemini-3.0-flash": {
    id: "gemini-3.0-flash", displayName: "Gemini 3.0 Flash (legacy)", family: "3.0",
    tier: "flash", capabilities: ["text", "fast-text"], lifecycle: "legacy",
    costMultiplier: 1,
    pricing: legacyPricing(0.0003, 0.0009),
  },
})

const MODEL_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  "gemini-3.1-flash-latest": "gemini-3.1-flash",
  "gemini-3.1-pro-latest": "gemini-3.1-pro",
})

export const normalizeGeminiModelId = (modelId: string): string => {
  const normalized = String(modelId ?? "").trim().replace(/^models\//i, "")
  return MODEL_ALIASES[normalized] ?? normalized
}

export const getGeminiModel = (modelId: string): GeminiModelMetadata | undefined =>
  GEMINI_MODEL_REGISTRY[normalizeGeminiModelId(modelId)]

/** Canonicalizes legacy/provider model names without claiming live availability. */
export const canonicalizeGeminiModelId = (modelId: string): string => {
  const normalized = normalizeGeminiModelId(modelId)
  if (GEMINI_MODEL_REGISTRY[normalized]) return normalized
  const lower = normalized.toLowerCase()
  if (lower.includes("image")) return "gemini-3.1-flash-image-preview"
  if (lower.includes("pro")) return "gemini-3.1-pro-preview"
  if (lower.includes("lite")) return "gemini-3.1-flash-lite"
  if (lower.includes("flash") && (lower.includes("3.0") || lower.includes("3-flash"))) {
    return "gemini-3-flash-preview"
  }
  if (lower.includes("flash")) return "gemini-3.1-flash-lite"
  return "gemini-3.1-flash-lite"
}

export type GeminiSubstitutionReason =
  | "honoured" | "capability_requires_model" | "capability_policy_override"

export interface GeminiModelResolution {
  capability: GeminiCapability
  requested: string
  served: string
  substituted: boolean
  reason: GeminiSubstitutionReason
}

const MODALITY_REQUIRED: Partial<Record<GeminiCapability, string>> = {
  image: "gemini-3.1-flash-image-preview",
  video: "gemini-3-flash-preview",
  audio: "gemini-3-flash-preview",
}
const CAPABILITY_POLICY: Partial<Record<GeminiCapability, string>> = {
  thinking: "gemini-3.1-pro-preview",
  analysis: "gemini-3.1-pro-preview",
  text: "gemini-3.1-flash-lite",
  "fast-text": "gemini-3.1-flash-lite",
}

export const resolveGeminiModel = (input: {
  preference: string
  capability: GeminiCapability
}): GeminiModelResolution => {
  const requested = normalizeGeminiModelId(input.preference)
  const metadata = getGeminiModel(requested)
  const required = MODALITY_REQUIRED[input.capability]
  const policy = CAPABILITY_POLICY[input.capability]
  // Modality constraints always win. Otherwise honor a known compatible user
  // choice; only apply the capability default when metadata proves incompatibility.
  const served = required
    ?? (!metadata || metadata.capabilities.includes(input.capability)
      ? requested
      : policy ?? requested)
  const reason: GeminiSubstitutionReason = required
    ? "capability_requires_model"
    : served !== requested
      ? "capability_policy_override"
      : "honoured"
  return {
    capability: input.capability,
    requested,
    served,
    substituted: served !== requested,
    reason,
  }
}

export const isGeminiSubstitutionSurprising = (resolution: GeminiModelResolution): boolean =>
  resolution.substituted && resolution.reason === "capability_policy_override"

export interface GeminiGenerationSettings {
  temperature?: number
  topP?: number
  topK?: number
  maxOutputTokens?: number
  responseMimeType?: "text/plain" | "application/json"
  thinkingLevel?: "LOW" | "MEDIUM" | "HIGH"
}

export interface GeminiGenerationProfileResolution {
  capability: GeminiCapability
  modelId?: string
  settings: GeminiGenerationSettings
  sources: Partial<Record<keyof GeminiGenerationSettings, "platform" | "capability" | "user" | "task">>
}

/** Platform baseline is intentionally conservative; feature callers may supply capability, user, and task layers. */
const PLATFORM_GENERATION_DEFAULTS: GeminiGenerationSettings = {
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 2048,
}

const CAPABILITY_GENERATION_DEFAULTS: Partial<Record<GeminiCapability, GeminiGenerationSettings>> = {
  "fast-text": { temperature: 0.25, maxOutputTokens: 1024 },
  analysis: { temperature: 0.2, maxOutputTokens: 4096 },
  thinking: { temperature: 0.4, maxOutputTokens: 4096, thinkingLevel: "HIGH" },
  image: { temperature: 0.7 },
  video: { temperature: 0.3 },
  audio: { temperature: 0.3 },
  tts: { temperature: 0.5 },
  live: { temperature: 0.5 },
}

const validateGenerationSettings = (
  capability: GeminiCapability,
  modelId: string | undefined,
  settings: GeminiGenerationSettings,
): void => {
  if (settings.temperature !== undefined && (!Number.isFinite(settings.temperature) || settings.temperature < 0 || settings.temperature > 2)) {
    throw new Error("Gemini temperature must be between 0 and 2.")
  }
  if (settings.topP !== undefined && (!Number.isFinite(settings.topP) || settings.topP < 0 || settings.topP > 1)) {
    throw new Error("Gemini topP must be between 0 and 1.")
  }
  if (settings.topK !== undefined && (!Number.isInteger(settings.topK) || settings.topK < 1)) {
    throw new Error("Gemini topK must be a positive integer.")
  }
  if (settings.maxOutputTokens !== undefined && (!Number.isInteger(settings.maxOutputTokens) || settings.maxOutputTokens < 1)) {
    throw new Error("Gemini maxOutputTokens must be a positive integer.")
  }
  if (settings.thinkingLevel && capability !== "thinking" && capability !== "analysis") {
    throw new Error("Thinking level can only be set for thinking or analysis capabilities.")
  }
  if (modelId) {
    const metadata = getGeminiModel(modelId)
    if (metadata && !metadata.capabilities.includes(capability)) {
      throw new Error(`Gemini model "${modelId}" does not declare the "${capability}" capability.`)
    }
  }
}

/**
 * Resolves generation settings in the documented order:
 * platform defaults → capability profile → user preference → task override.
 * Task overrides are last by design, but all merged values are validated before use.
 */
export const resolveGeminiGenerationProfile = (input: {
  capability: GeminiCapability
  modelId?: string
  userSettings?: GeminiGenerationSettings
  taskOverride?: GeminiGenerationSettings
}): GeminiGenerationProfileResolution => {
  const settings: GeminiGenerationSettings = { ...PLATFORM_GENERATION_DEFAULTS }
  const sources: GeminiGenerationProfileResolution["sources"] = {}

  for (const key of Object.keys(PLATFORM_GENERATION_DEFAULTS) as (keyof GeminiGenerationSettings)[]) {
    sources[key] = "platform"
  }
  const layers: Array<[ "capability" | "user" | "task", GeminiGenerationSettings | undefined ]> = [
    ["capability", CAPABILITY_GENERATION_DEFAULTS[input.capability]],
    ["user", input.userSettings],
    ["task", input.taskOverride],
  ]
  for (const [source, layer] of layers) {
    if (!layer) continue
    for (const key of Object.keys(layer) as (keyof GeminiGenerationSettings)[]) {
      const value = layer[key]
      if (value !== undefined) {
        ;(settings as Record<string, unknown>)[key] = value
        sources[key] = source
      }
    }
  }

  validateGenerationSettings(input.capability, input.modelId, settings)
  return { capability: input.capability, modelId: input.modelId, settings, sources }
}

export type GeminiFailureClassification = {
  kind: "authentication" | "permission" | "quota" | "unsupported_model" | "transient" | "unknown"
  fallbackAllowed: boolean
}

export const classifyGeminiFailure = (error: { status?: unknown; code?: unknown; message?: unknown }): GeminiFailureClassification => {
  const status = Number(error?.status ?? error?.code)
  const message = String(error?.message ?? "")
  if (status === 401 || /invalid api key|unauthenticated/i.test(message)) {
    return { kind: "authentication", fallbackAllowed: false }
  }
  if (status === 403 || /permission denied|forbidden/i.test(message)) {
    return { kind: "permission", fallbackAllowed: false }
  }
  if (status === 429 || /quota|rate.?limit|resource exhausted/i.test(message)) {
    return { kind: "quota", fallbackAllowed: false }
  }
  if (status === 404 || /model.+(not found|not supported)|unsupported model/i.test(message)) {
    return { kind: "unsupported_model", fallbackAllowed: true }
  }
  if (status >= 500 || /timeout|temporar|unavailable|network/i.test(message)) {
    return { kind: "transient", fallbackAllowed: true }
  }
  return { kind: "unknown", fallbackAllowed: false }
}
