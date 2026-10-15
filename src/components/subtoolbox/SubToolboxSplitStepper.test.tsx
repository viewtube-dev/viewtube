import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SubToolboxSplitStepper } from "./SubToolboxSplitStepper"

describe("SubToolboxSplitStepper fixed-ratio input behavior", () => {
  it("renders the editable value through the canonical Studio text-input primitive", () => {
    const html = renderToStaticMarkup(
      <SubToolboxSplitStepper value={7} onValueChange={() => undefined} ariaLabel="Count" />,
    )
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
    expect(html).toContain('type="number"')
    expect(html).toContain('value="7"')
    expect(html).toContain('aria-label="Count"')
    expect(html).toContain('class="vt-subtoolbox-split-stepper-value"')
  })

  it("uses a fixed 2:1 value pane and square rail with no component shadow", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/subtoolbox-split-stepper.css"), "utf8")
    expect(css).toContain("width: calc(var(--vt-stepper-height) + var(--vt-stepper-height) + var(--vt-stepper-height))")
    expect(css).toContain("grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)")
    expect(css).toContain("grid-template-rows: minmax(0, 1fr) minmax(0, 1fr)")
    expect(css).toContain("box-shadow: none")
    expect(css).not.toContain("box-shadow: var(--vt-stepper-shadow)")
  })

  it("doubles the chevron size and wraps the whole stepper in focus mode", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/subtoolbox-split-stepper.css"), "utf8")
    const source = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/SubToolboxSplitStepper.tsx"), "utf8")
    expect(css).toContain("width: calc(var(--vt-stepper-height) * .68)")
    expect(css).toContain(".vt-subtoolbox-split-stepper.is-focused")
    expect(css).toContain("outline: 3px solid")
    expect(source).toContain("setIsEditing(true)")
    expect(source).toContain("setIsHolding(true)")
    expect(source).toContain("HOLD_FOCUS_DELAY")
  })
})
