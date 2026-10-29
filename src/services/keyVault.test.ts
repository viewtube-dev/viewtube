import { afterEach, describe, expect, it, vi } from "vitest"
import { getVaultKey, getVaultSnapshot, setVaultKey, setVaultSnapshot } from "./keyVault"

describe("keyVault without browser storage", () => {
 afterEach(() => vi.unstubAllGlobals())

 it("returns safe defaults when localStorage is unavailable", () => {
  vi.stubGlobal("localStorage", undefined)
  expect(getVaultKey("gemini")).toBe("")
  expect(getVaultKey("googleClientId")).toContain(".apps.googleusercontent.com")
  expect(getVaultSnapshot()).toMatchObject({ gemini: "", elevenLabs: "", auphonic: "" })
 })

 it("does not throw when writes are requested without browser storage", () => {
  vi.stubGlobal("localStorage", undefined)
  expect(() => setVaultKey("gemini", "test-key")).not.toThrow()
  expect(() => setVaultSnapshot({ elevenLabs: "test-key", auphonic: "" })).not.toThrow()
 })
})

describe("Gemini key readiness notifications", () => {
 afterEach(() => vi.unstubAllGlobals())

 it("notifies a mounted Brain surface when the Gemini key is saved", () => {
  const dispatchEvent = vi.fn()
  const storage = new Map<string, string>()
  vi.stubGlobal("localStorage", {
   getItem: (key: string) => storage.get(key) ?? null,
   setItem: (key: string, value: string) => storage.set(key, value),
   removeItem: (key: string) => storage.delete(key),
  })
  vi.stubGlobal("window", { dispatchEvent })

  setVaultKey("gemini", " test-key ")

  expect(dispatchEvent).toHaveBeenCalledWith(
   expect.objectContaining({ type: "vt:gemini-key-updated" }),
  )
  expect(storage.get("yt_api_key")).toBe("test-key")
 })

 it("notifies a mounted Brain surface when the Gemini key is cleared", () => {
  const dispatchEvent = vi.fn()
  const storage = new Map<string, string>([["yt_api_key", "test-key"]])
  vi.stubGlobal("localStorage", {
   getItem: (key: string) => storage.get(key) ?? null,
   setItem: (key: string, value: string) => storage.set(key, value),
   removeItem: (key: string) => storage.delete(key),
  })
  vi.stubGlobal("window", { dispatchEvent })

  setVaultSnapshot({ gemini: "" })

  expect(dispatchEvent).toHaveBeenCalledWith(
   expect.objectContaining({ type: "vt:gemini-key-updated" }),
  )
  expect(storage.has("yt_api_key")).toBe(false)
 })

 it("does not emit Gemini readiness events for unrelated keys", () => {
  const dispatchEvent = vi.fn()
  vi.stubGlobal("localStorage", {
   getItem: () => null,
   setItem: vi.fn(),
   removeItem: vi.fn(),
  })
  vi.stubGlobal("window", { dispatchEvent })

  setVaultKey("elevenLabs", "voice-key")

  expect(dispatchEvent).not.toHaveBeenCalled()
 })
})
