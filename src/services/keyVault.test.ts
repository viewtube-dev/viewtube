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
