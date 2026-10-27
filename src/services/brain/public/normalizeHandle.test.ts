import { describe, expect, it } from "vitest"
import { normalizeHandle } from "./normalizeHandle"

describe("normalizeHandle", () => {
  it("normalizes handles with or without the leading @", () => {
    expect(normalizeHandle("@HistoryLab")).toBe("HistoryLab")
    expect(normalizeHandle("  HistoryLab  ")).toBe("HistoryLab")
  })

  it("extracts handles from supported YouTube channel URLs", () => {
    expect(normalizeHandle("https://www.youtube.com/@HistoryLab/videos")).toBe("HistoryLab")
    expect(normalizeHandle("youtube.com/@HistoryLab")).toBe("HistoryLab")
    expect(normalizeHandle("https://youtube.com/c/HistoryLab")).toBe("HistoryLab")
    expect(normalizeHandle("https://www.youtube.com/user/HistoryLab")).toBe("HistoryLab")
  })

  it("preserves YouTube channel IDs", () => {
    expect(normalizeHandle("UC1234567890123456789012")).toBe("UC1234567890123456789012")
    expect(normalizeHandle("https://www.youtube.com/channel/UC1234567890123456789012")).toBe("UC1234567890123456789012")
  })

  it("rejects video links, short links, unrelated hosts, and malformed input", () => {
    expect(normalizeHandle("https://youtu.be/abcdefghijk")).toBeNull()
    expect(normalizeHandle("https://www.youtube.com/watch?v=abcdefghijk")).toBeNull()
    expect(normalizeHandle("https://example.com/@HistoryLab")).toBeNull()
    expect(normalizeHandle("")).toBeNull()
    expect(normalizeHandle("@")).toBeNull()
    expect(normalizeHandle("bad handle")).toBeNull()
  })
})
