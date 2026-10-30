import { describe, expect, it, vi } from "vitest"
import {
  GEMINI_MODEL_REGISTRY,
  getGeminiModel,
  normalizeGeminiModelId,
  canonicalizeGeminiModelId,
  resolveGeminiModel,
  classifyGeminiFailure,
  resolveGeminiGenerationProfile,
  executeGeminiWithFallback,
  pickGeminiGenerationOverrides,
} from "../geminiModelGovernance"

describe("canonical Gemini model governance", () => {
  it("normalizes provider resource names and known aliases", () => {
    expect(normalizeGeminiModelId("models/gemini-3.1-flash")).toBe("gemini-3.1-flash")
    expect(normalizeGeminiModelId(" gemini-3.1-flash-latest ")).toBe("gemini-3.1-flash")
  })

  it("resolves a requested model through the capability policy and reports substitutions", () => {
    expect(resolveGeminiModel({ preference: "gemini-3.1-pro", capability: "text" })).toMatchObject({
      requested: "gemini-3.1-pro",
      served: "gemini-3.1-pro",
      substituted: false,
      reason: "honoured",
    })
    expect(resolveGeminiModel({ preference: "gemini-3.1-flash-lite", capability: "analysis" })).toMatchObject({
      requested: "gemini-3.1-flash-lite",
      served: "gemini-3.1-pro-preview",
      substituted: true,
      reason: "capability_policy_override",
    })
    expect(resolveGeminiModel({ preference: "gemini-3.1-pro", capability: "image" }).served)
      .toBe("gemini-3.1-flash-image-preview")
  })

  it("does not fabricate availability or pricing for unknown models", () => {
    expect(getGeminiModel("gemini-future-model")).toBeUndefined()
    expect(canonicalizeGeminiModelId("gemini-future-model")).toBe("gemini-future-model")
    expect(canonicalizeGeminiModelId("gemini-future-pro-model")).toBe("gemini-future-pro-model")
    expect(canonicalizeGeminiModelId("gemini-2.5-pro")).toBe("gemini-3.1-pro-preview")
    expect(resolveGeminiModel({ preference: "gemini-future-model", capability: "text" }).served)
      .toBe("gemini-future-model")
    expect(GEMINI_MODEL_REGISTRY["gemini-3.1-flash"]?.pricing?.verified).toBe(false)
  })

  it("resolves generation settings in platform → capability → user → task order", () => {
    const result = resolveGeminiGenerationProfile({
      capability: "analysis",
      modelId: "gemini-3.1-pro-preview",
      userSettings: { temperature: 0.8, maxOutputTokens: 3000 },
      taskOverride: { temperature: 0.1 },
    })
    expect(result.settings.temperature).toBe(0.1)
    expect(result.settings.maxOutputTokens).toBe(3000)
    expect(result.sources.temperature).toBe("task")
    expect(result.sources.maxOutputTokens).toBe("user")
    expect(result.sources.topP).toBe("platform")
  })

  it("rejects unsupported capability/model and invalid generation overrides", () => {
    expect(() => resolveGeminiGenerationProfile({
      capability: "image",
      modelId: "gemini-3.1-pro",
    })).toThrow(/does not declare the "image" capability/)
    expect(() => resolveGeminiGenerationProfile({
      capability: "text",
      userSettings: { temperature: 3 },
    })).toThrow(/temperature must be between 0 and 2/)
    expect(() => resolveGeminiGenerationProfile({
      capability: "text",
      taskOverride: { thinkingLevel: "HIGH" },
    })).toThrow(/only be set for thinking or analysis/)
  })

  it("falls back only for classified provider failures and reports the served model", async () => {
    const execute = vi.fn()
      .mockRejectedValueOnce({ status: 404, message: "model not found" })
      .mockResolvedValueOnce({ ok: true })
    const onFallback = vi.fn()
    const result = await executeGeminiWithFallback({
      modelCandidates: ["model-a", "model-b"],
      execute,
      onFallback,
    })
    expect(result).toEqual({ response: { ok: true }, servedModel: "model-b", attempts: 2 })
    expect(onFallback).toHaveBeenCalledWith({
      sourceModel: "model-a",
      fallbackModel: "model-b",
      reason: "unsupported_model",
      attempt: 1,
    })
  })

  it.each([
    [{ status: 401, message: "invalid API key" }, "authentication"],
    [{ status: 403, message: "permission denied" }, "permission"],
    [{ status: 429, message: "quota exceeded" }, "quota"],
    [{ status: 400, message: "invalid argument" }, "unknown"],
  ])("does not fallback for terminal provider failures", async (error) => {
    const execute = vi.fn().mockRejectedValue(error)
    await expect(executeGeminiWithFallback({
      modelCandidates: ["model-a", "model-b"],
      execute,
    })).rejects.toBe(error)
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it("limits transient retries to one alternate model", async () => {
    const error = { status: 503, message: "temporarily unavailable" }
    const execute = vi.fn().mockRejectedValue(error)
    await expect(executeGeminiWithFallback({
      modelCandidates: ["model-a", "model-b", "model-c"],
      execute,
    })).rejects.toBe(error)
    expect(execute).toHaveBeenCalledTimes(2)
  })

  it("extracts only generation profile fields from provider config", () => {
    expect(pickGeminiGenerationOverrides({
      temperature: 0.2,
      maxOutputTokens: 900,
      responseSchema: { type: "OBJECT" },
      tools: [{ googleSearch: {} }],
    })).toEqual({ temperature: 0.2, maxOutputTokens: 900 })
  })

  it("does not permit fallback for credential, permission, or quota failures", () => {
    expect(classifyGeminiFailure({ status: 401 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 403 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 429 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 503 }).fallbackAllowed).toBe(true)
  })
})
