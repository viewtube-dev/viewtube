import { afterEach, describe, expect, it, vi } from "vitest"
import { persistPublicHandleForIngestion } from "./publicHandleMode"

describe("persistPublicHandleForIngestion", () => {
  const storage = new Map<string, string>()
  const localStorageMock = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, String(value)),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  }

  afterEach(() => {
    storage.clear()
    vi.unstubAllGlobals()
  })

  it("persists a handle as public ingestion when resolution is unavailable", () => {
    vi.stubGlobal("localStorage", localStorageMock)
    expect(persistPublicHandleForIngestion("@themotionvis")).toBe("@themotionvis")
    expect(localStorage.getItem("vt_public_channel_handle")).toBe("@themotionvis")
    expect(localStorage.getItem("vt_public_channel_input")).toBe("@themotionvis")
    expect(localStorage.getItem("vt_ingest_mode")).toBe("public_handle")
    expect(localStorage.getItem("vt_public_channel_id")).toBeNull()
  })

  it("accepts YouTube channel URLs and channel IDs", () => {
    vi.stubGlobal("localStorage", localStorageMock)
    expect(persistPublicHandleForIngestion("https://www.youtube.com/@themotionvis")).toBe("@themotionvis")
    expect(persistPublicHandleForIngestion("UC1234567890123456789012")).toBe("UC1234567890123456789012")
  })

  it("does not persist empty or invalid inputs", () => {
    vi.stubGlobal("localStorage", localStorageMock)
    expect(persistPublicHandleForIngestion("")).toBeNull()
    expect(persistPublicHandleForIngestion("not a channel !!!")).toBeNull()
    expect(localStorage.getItem("vt_ingest_mode")).toBeNull()
  })
})
