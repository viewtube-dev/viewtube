import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fixturesEnabled, resolveFromFixture, snapshotFromFixture } from "./publicHandleMode.fixtures"

describe("public handle fixtures", () => {
  const storage = new Map<string, string>()
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    })
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("resolves the allowlisted handles and aliases", () => {
    vi.stubEnv("DEV", true)
    expect(resolveFromFixture("@THEMOTIONVIS")?.title).toBe("The Motion Vis (fixture)")
    expect(snapshotFromFixture("themotionvis")?.channelId).toBe("UC_FIXTURE_THEMOTIONVIS")
    expect(resolveFromFixture("@viewtube_demo")?.title).toBe("ViewTube Demo (fixture)")
    expect(resolveFromFixture("demo")?.channelId).toBe("UC_FIXTURE_VIEWTUBE_DEMO")
  })

  it("does not resolve unknown handles when fixtures are enabled", () => {
    vi.stubEnv("DEV", true)
    expect(resolveFromFixture("@not_allowlisted")).toBeNull()
  })

  it("can be enabled explicitly in local storage", () => {
    storage.set("vt_public_handle_fixtures", "1")
    expect(fixturesEnabled()).toBe(true)
    expect(snapshotFromFixture("@themotionvis")?.source).toBe("fixture")
  })

  it("does not enable fixtures by default in production", () => {
    vi.stubEnv("DEV", false)
    vi.stubEnv("VITE_PUBLIC_HANDLE_FIXTURES", "")
    storage.delete("vt_public_handle_fixtures")
    expect(fixturesEnabled()).toBe(false)
    expect(snapshotFromFixture("@themotionvis")).toBeNull()
  })
})
