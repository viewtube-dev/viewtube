import { describe, expect, it } from "vitest"
import {
  GEMINI_MODEL_REGISTRY,
  getGeminiModel,
  normalizeGeminiModelId,
  resolveGeminiModel,
  classifyGeminiFailure,
} from "../geminiModelGovernance"

describe("canonical Gemini model governance", () => {
  it("normalizes provider resource names and known aliases", () => {
    expect(normalizeGeminiModelId("models/gemini-3.1-flash")).toBe("gemini-3.1-flash")
    expect(normalizeGeminiModelId(" gemini-3.1-flash-latest ")).toBe("gemini-3.1-flash")
  })

  it("resolves a requested model through the capability policy and reports substitutions", () => {
    expect(resolveGeminiModel({ preference: "gemini-3.1-pro", capability: "text" })).toMatchObject({
      requested: "gemini-3.1-pro",
      served: "gemini-3.1-flash-lite",
      substituted: true,
      reason: "capability_policy_override",
    })
    expect(resolveGeminiModel({ preference: "gemini-3.1-pro", capability: "image" }).served)
      .toBe("gemini-3.1-flash-image-preview")
  })

  it("does not fabricate availability or pricing for unknown models", () => {
    expect(getGeminiModel("gemini-future-model")).toBeUndefined()
    expect(resolveGeminiModel({ preference: "gemini-future-model", capability: "text" }).served)
      .toBe("gemini-future-model")
    expect(GEMINI_MODEL_REGISTRY["gemini-3.1-flash"]?.pricing?.verified).toBe(false)
  })

  it("does not permit fallback for credential, permission, or quota failures", () => {
    expect(classifyGeminiFailure({ status: 401 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 403 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 429 }).fallbackAllowed).toBe(false)
    expect(classifyGeminiFailure({ status: 503 }).fallbackAllowed).toBe(true)
  })
})
