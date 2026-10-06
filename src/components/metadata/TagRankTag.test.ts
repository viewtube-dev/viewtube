import { describe, expect, it } from "vitest"
import { getTagRankColor } from "./TagRankTag"

describe("ranked metadata tag colors", () => {
  it("uses the legacy five rank bands", () => {
    expect(getTagRankColor(1)).toBe("#36E0F6")
    expect(getTagRankColor(10)).toBe("#36E0F6")
    expect(getTagRankColor(11)).toBe("#3FEE56")
    expect(getTagRankColor(20)).toBe("#3FEE56")
    expect(getTagRankColor(21)).toBe("#FFDA47")
    expect(getTagRankColor(30)).toBe("#FFDA47")
    expect(getTagRankColor(31)).toBe("#FFA85C")
    expect(getTagRankColor(40)).toBe("#FFA85C")
    expect(getTagRankColor(41)).toBe("#FA618A")
  })

  it("falls back to the default rank color when rank is absent", () => {
    expect(getTagRankColor()).toBe("#36E0F6")
  })
})
