import { describe, expect, it } from "vitest"
import { classifyGeminiKeyValidationError } from "./geminiKeyValidation"

describe("Gemini key validation failure taxonomy", () => {
 it.each([
  [{ status: 401, message: "Unauthorized" }, "credential_rejected"],
  [{ status: 400, message: "API_KEY_INVALID" }, "credential_rejected"],
  [{ status: 403, message: "Permission denied" }, "permission_denied"],
  [{ status: 429, message: "Resource exhausted" }, "rate_limited"],
  [{ status: 503, message: "Service unavailable" }, "provider_unavailable"],
  [{ message: "Failed to fetch" }, "provider_unavailable"],
  [{ status: 404, message: "Model catalog endpoint unavailable" }, "verification_unavailable"],
 ] as const)("classifies %j without exposing its message", (error, expected) => {
  expect(classifyGeminiKeyValidationError(error)).toBe(expected)
 })
 it("does not classify unrelated malformed requests as invalid credentials", () => {
  expect(classifyGeminiKeyValidationError({ status: 400, message: "Invalid page size" }))
   .toBe("verification_unavailable")
 })
})
