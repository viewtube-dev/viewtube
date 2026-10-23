import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync(new URL("./BrainContextRail.tsx", import.meta.url), "utf8")

describe("Brain context rail Studio chrome", () => {
  it("uses canonical Studio controls for creator-context actions", () => {
    expect(source).toContain("StudioSplitLeftButton")
    expect(source).toContain("StudioSquareIconButton")
    expect(source).toContain("StudioTwoLineButton")
    expect(source).not.toMatch(/<button\b/)
    expect(source).toContain("onEditPrompt")
    expect(source).toContain("onAskInsight")
  })

  it("uses compact Studio badges for channel topic chips", () => {
    expect(source).toContain("StudioSplitLeftBadge")
    expect(source).toContain('sizeVariant="micro"')
    expect(source).not.toContain('rounded-[7px] border-[2px] border-black bg-[#36E0F6]')
  })
})
