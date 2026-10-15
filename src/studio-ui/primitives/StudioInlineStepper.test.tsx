import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { normalizeStudioInlineStepperValue, StudioInlineStepper } from "./StudioInlineStepper"

describe("StudioInlineStepper", () => {
  it("renders the horizontal decrement, editable value, increment layout as a canonical Studio control", () => {
    const html = renderToStaticMarkup(
      <StudioInlineStepper value={22} onValueChange={() => undefined} ariaLabel="Package count" />,
    )
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-studio-control-family="stepper"')
    expect(html).toContain('data-vt-studio-control-kind="inline-stepper"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('aria-label="Package count"')
    expect(html).toContain('aria-label="Decrease Package count"')
    expect(html).toContain('aria-label="Increase Package count"')
    expect(html).toContain('type="number"')
    expect(html).toContain('value="22"')
    expect(html.indexOf("Decrease Package count")).toBeLessThan(html.indexOf('value="22"'))
    expect(html.indexOf('value="22"')).toBeLessThan(html.indexOf("Increase Package count"))
    expect(html).not.toContain("subtoolbox")
  })

  it("uses the canonical compact size marker", () => {
    const html = renderToStaticMarkup(
      <StudioInlineStepper value={3} onValueChange={() => undefined} size="compact" />,
    )
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('class="vt-studio-inline-stepper is-compact"')
  })

  it("normalizes step changes without leaking invalid values and respects bounds", () => {
    expect(normalizeStudioInlineStepperValue(4, 1, 1, 0, 10)).toBe(5)
    expect(normalizeStudioInlineStepperValue(4, -1, 0.25, 0, 10)).toBe(3.75)
    expect(normalizeStudioInlineStepperValue(0.2, 1, 0.1, 0, 10)).toBe(0.3)
    expect(normalizeStudioInlineStepperValue(10, 1, 1, 0, 10)).toBe(10)
    expect(normalizeStudioInlineStepperValue(0, -1, 1, 0, 10)).toBe(0)
    expect(normalizeStudioInlineStepperValue(Number.NaN, 1, 1, 0, 10)).toBe(1)
  })

  it("uses global Studio size tokens and has no SubToolbox style authority", () => {
    const css = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/studio-inline-stepper.css"), "utf8")
    expect(css).toContain("var(--vt-studio-control-height")
    expect(css).toContain("var(--vt-studio-control-stroke")
    expect(css).toContain("var(--vt-studio-control-radius")
    expect(css).toContain("var(--vt-studio-control-font-family")
    expect(css).toContain("var(--pair-a")
    expect(css).toContain("var(--pair-b")
    expect(css).toContain("grid-template-columns: var(--vt-inline-stepper-side) minmax(0, 2fr) var(--vt-inline-stepper-side)")
    expect(css).not.toContain("subtoolbox")
  })
})
