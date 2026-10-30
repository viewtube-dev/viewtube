// @vitest-environment jsdom
import { act, createElement } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const listModels = vi.hoisted(() => vi.fn())
const reportDiagnostic = vi.hoisted(() => vi.fn())

vi.mock("@google/genai", () => ({
 GoogleGenAI: class {
  models = { list: listModels }
 },
}))
vi.mock("../services/diagnostics", () => ({ reportDiagnostic }))

import { GeminiKeyProvider, useGeminiKey } from "./GeminiKeyContext"
import { getVaultKey } from "../services/keyVault"

let exposed: ReturnType<typeof useGeminiKey> | null = null
const Probe = () => {
 exposed = useGeminiKey()
 return null
}

let root: Root | null = null
let container: HTMLDivElement | null = null

const mount = async () => {
 container = document.createElement("div")
 document.body.appendChild(container)
 root = createRoot(container)
 await act(async () => {
  root!.render(createElement(GeminiKeyProvider, { children: createElement(Probe) }))
 })
}

const listSuccess = () => listModels.mockResolvedValue({
 async *[Symbol.asyncIterator]() {
  yield { name: "models/gemini-3.1-flash-lite" }
 },
})

beforeEach(() => {
 localStorage.clear()
 reportDiagnostic.mockReset()
 listModels.mockReset()
 exposed = null
})

afterEach(async () => {
 if (root) await act(async () => root!.unmount())
 root = null
 container?.remove()
 container = null
})

describe("Gemini key validation runtime", () => {
 it("saves a key when model discovery succeeds", async () => {
  listSuccess()
  await mount()
  let result = false
  await act(async () => { result = await exposed!.validateAndSaveKey("valid-test-key") })
  expect(result).toBe(true)
  expect(getVaultKey("gemini")).toBe("valid-test-key")
  expect(exposed?.validationError).toBeNull()
 })

 it("rejects an explicitly invalid credential and does not save it", async () => {
  listModels.mockRejectedValue(Object.assign(new Error("API_KEY_INVALID"), { status: 400 }))
  await mount()
  let result = true
  await act(async () => { result = await exposed!.validateAndSaveKey("invalid-test-key") })
  expect(result).toBe(false)
  expect(getVaultKey("gemini")).toBe("")
  expect(exposed?.validationError).toContain("Google rejected this API key")
 })

 it.each([
  [{ status: 403, message: "Permission denied" }, /Google denied verification/],
  [{ status: 429, message: "Resource exhausted" }, /rate-limited verification/],
  [{ status: 503, message: "Service unavailable" }, /temporarily unavailable/],
 ])("saves a credential when verification is degraded: %j", async (error, message) => {
  listModels.mockRejectedValue(Object.assign(new Error(error.message), { status: error.status }))
  await mount()
  let result = false
  await act(async () => { result = await exposed!.validateAndSaveKey("saved-despite-verification-key") })
  expect(result).toBe(true)
  expect(getVaultKey("gemini")).toBe("saved-despite-verification-key")
  expect(exposed?.validationError).toMatch(message)
  expect(JSON.stringify(reportDiagnostic.mock.calls)).not.toContain("saved-despite-verification-key")
 })

 it("does not expose an unvalidated credential setter to provider consumers", async () => {
  listSuccess()
  await mount()
  expect(exposed).not.toHaveProperty("setApiKey")
  expect(exposed).toHaveProperty("validateAndSaveKey")
 })

})
