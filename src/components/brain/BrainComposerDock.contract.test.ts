import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const styles = readFileSync(new URL("./BrainComposerDock.css", import.meta.url), "utf8")

describe("Brain composer Studio field contract", () => {
  it("keeps a black outer border and primary inline stroke in the default state", () => {
    const defaultState = styles.slice(
      styles.indexOf(".vt-brain-composer-dock .vt-brain-composer-input {"),
      styles.indexOf(".vt-brain-composer-dock .vt-brain-composer-input::placeholder"),
    )
    expect(defaultState).toContain("border: var(--vt-studio-control-stroke, 3px) solid #000000")
    expect(defaultState).toContain("inset 0 0 0 var(--vt-studio-control-stroke, 3px) var(--pair-a, #36e0f6)")
    expect(defaultState).not.toContain("border: 0 !important")
  })

  it("uses black text and glyph stroke on focus with the primary inset retained", () => {
    const focusState = styles.slice(
      styles.indexOf(".vt-brain-composer-dock .vt-brain-composer-input:focus {"),
      styles.indexOf(".vt-brain-composer-dock .vt-brain-composer-input:disabled"),
    )
    expect(focusState).toContain("color: #000000")
    expect(focusState).toContain("-webkit-text-stroke: 1px #000000")
    expect(focusState).toContain("var(--pair-a, #36e0f6)")
    expect(focusState).toContain("var(--pair-b, #ff7ac8)")
    expect(focusState).not.toContain("var(--brain-composer-accent)")
  })

  it("respects the Studio focus outline ratio without shadow or movement effects", () => {
    expect(styles).toContain("outline: 1.95px solid var(--pair-b)")
    expect(styles).toContain("outline-offset: 0")
    expect(styles).not.toContain("box-shadow: 0 ")
    expect(styles).not.toMatch(/transform\\s*:/i)
  })
})
