import { describe, expect, it } from "vitest"
import { STUDIO_CONTROL_SIZE_BASE, STUDIO_DROPDOWN_TOKENS } from "./tokens"
import { readFileSync } from "node:fs"

describe("Studio global stroke-tier contract", () => {
  it("uses the Standard stroke system for Supreme", () => {
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.stroke).toBe(3)
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.textStroke).toBe(1)
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.focusOutlineWidth).toBe(1.95)
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.secondaryFocusOutlineWidth).toBe(1.95)
    expect(STUDIO_CONTROL_SIZE_BASE.supreme.iconStroke).toBe(1.9)
    expect(STUDIO_DROPDOWN_TOKENS.chevronStroke.supreme).toBe(STUDIO_DROPDOWN_TOKENS.chevronStroke.standard)
  })

  it("uses the Mini stroke system for Micro", () => {
    expect(STUDIO_CONTROL_SIZE_BASE.micro.stroke).toBe(1.5)
    expect(STUDIO_CONTROL_SIZE_BASE.micro.textStroke).toBe(0.375)
    expect(STUDIO_CONTROL_SIZE_BASE.micro.focusOutlineWidth).toBe(0.975)
    expect(STUDIO_CONTROL_SIZE_BASE.micro.secondaryFocusOutlineWidth).toBe(0.975)
    expect(STUDIO_CONTROL_SIZE_BASE.micro.iconStroke).toBe(STUDIO_CONTROL_SIZE_BASE.mini.iconStroke)
    expect(STUDIO_DROPDOWN_TOKENS.chevronStroke.micro).toBe(STUDIO_DROPDOWN_TOKENS.chevronStroke.mini)
  })

  it("does not retain the retired Supreme/Micro stroke overrides in shared CSS", () => {
    const css = readFileSync("src/styles/studio-control-system.css", "utf8")
    expect(css).not.toContain("4.09px")
    expect(css).not.toContain("2.66px")
    expect(css).not.toContain("1.36px")
    expect(css).not.toContain("2.59")
    expect(css).not.toContain("micro-stroke, 1px")
    expect(css).not.toContain("micro-text-stroke, 0.25px")
  })

  it("exports and documents the shared split text input primitive", () => {
    const index = readFileSync("src/studio-ui/index.ts", "utf8")
    const catalog = readFileSync("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx", "utf8")
    expect(index).toContain('export { StudioSplitTextInput } from "./primitives/StudioSplitTextInput"')
    expect(catalog).toContain('title="Studio Split Text Input · Left + Right + Double"')
    expect(catalog).toContain('data-vt-library-component="StudioSplitTextInput"')
  })
})
