import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { normalizeStudioInlineStepperValue, StudioInlineStepper, StudioSplitStepper } from "./StudioControls"

describe("StudioInlineStepper", () => {
  it("renders the horizontal decrement, editable value, increment layout as a canonical Studio control", () => {
    const html = renderToStaticMarkup(
      <StudioInlineStepper value={22} onValueChange={() => undefined} ariaLabel="Package count" />,
    )
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-studio-control-family="stepper"')
    expect(html).toContain('data-vt-studio-control-kind="inline-stepper"')
    expect(html).toContain('data-vt-studio-username-foundation="true"')
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
    const allCss = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const start = allCss.indexOf("/* Studio Controls-owned stepper family styles moved from primitive sidecars. */")
    const css = allCss.slice(start)
    expect(css).toContain("var(--vt-studio-control-height")
    expect(css).toContain("var(--vt-studio-control-stroke")
    expect(css).toContain("var(--vt-studio-control-radius")
    expect(css).toContain("var(--vt-studio-control-font-family")
    expect(css).toContain("var(--pair-a")
    expect(css).toContain("var(--pair-b")
    expect(css).toContain(".vt-studio-inline-stepper,\n.vt-studio-split-stepper {\n  --vt-stepper-primary: var(--vt-studio-control-accent, var(--pair-a, #36e0f6));")
    expect(css).toContain("background: color-mix(in srgb, var(--vt-stepper-primary) var(--vt-studio-control-default-fill-opacity, 50%), transparent);")
    expect(css).not.toContain("subtoolbox")
  })
})


describe("StudioSplitStepper username-input foundation", () => {
  it("renders the editable numeric pane and vertical secondary-color rail as a canonical Studio control", () => {
    const html = renderToStaticMarkup(<StudioSplitStepper value={4} onValueChange={() => undefined} min={0} max={9} ariaLabel="Count" />)
    expect(html).toContain('data-vt-studio-control-kind="split-stepper"')
    expect(html).toContain('data-vt-studio-username-foundation="true"')
    expect(html).toContain('type="number"')
    expect(html).toContain('class="vt-studio-split-stepper-rail"')
    expect(html).toContain('data-size="standard"')
    expect(html).not.toContain("subtoolbox")
  })

  it("uses shared username input tokens for the primary inset strokes and secondary rail", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain(".vt-studio-username-input {")
    expect(css).toContain(".vt-studio-inline-stepper,\n.vt-studio-split-stepper {")
    expect(css).toContain("--vt-stepper-primary: var(--vt-studio-control-accent, var(--pair-a, #36e0f6));")
    expect(css).toContain("background: var(--vt-stepper-secondary);")
    expect(css).toContain("box-shadow: none;")
  })
})


describe("Studio stepper single-shell geometry regression", () => {
  it("clips all inline stepper layers inside one compact root instead of letting child surfaces stack outward", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toMatch(/\.vt-studio-inline-stepper\s*\{[^}]*overflow:\s*hidden;/s)
    expect(css).toMatch(/\.vt-studio-inline-stepper\s*\{[^}]*max-width:\s*100%;/s)
    expect(css).toMatch(/\.vt-studio-inline-stepper__button\s*\{[^}]*position:\s*relative;/s)
    expect(css).toMatch(/\.vt-studio-inline-stepper__value\s*\{[^}]*position:\s*relative;/s)
    expect(css).toMatch(/\.vt-studio-split-stepper\s*\{[^}]*overflow:\s*hidden;/s)
    expect(css).toMatch(/\.vt-studio-split-stepper\s*\{[^}]*max-width:\s*100%;/s)
    expect(css).toMatch(/\.vt-studio-split-stepper-rail\s*\{[^}]*overflow:\s*hidden;/s)
    expect(css).toMatch(/\.vt-studio-split-stepper-rail button\s*\{[^}]*position:\s*relative;/s)
  })
})


describe("split stepper value pane geometry and username-input styling", () => {
  it("locks the input pane to a 2:1 ratio against the square rail", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const start = css.indexOf("/* Split stepper: the editable input pane is 2:1")
    const end = css.indexOf("/* Simple dropdown is a visual variant", start)
    const splitCss = css.slice(start, end)
    expect(splitCss).toContain("grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);")
    expect(splitCss).toContain("aspect-ratio: 3 / 1;")
    expect(splitCss).toContain("width: min(100%, calc(3 * var(--vt-stepper-height)));")
  })

  it("inherits the username input's font, weight, stroke, fill, padding and focus treatment", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const start = css.indexOf("/* Split stepper: the editable input pane is 2:1")
    const end = css.indexOf("/* Simple dropdown is a visual variant", start)
    const splitCss = css.slice(start, end)
    expect(splitCss).toContain("font-family: var(--vt-studio-control-font-family, Inter, ui-sans-serif, system-ui, sans-serif) !important;")
    expect(splitCss).toContain("font-weight: var(--vt-studio-control-font-weight, 1000) !important;")
    expect(splitCss).toContain("font-size: var(--vt-studio-control-font-size, 38px) !important;")
    expect(splitCss).toContain("padding: 0 14px !important;")
    expect(splitCss).toContain("inset calc(0px - var(--vt-stepper-stroke)) 0 0 0 var(--vt-stepper-primary)")
    expect(splitCss).toContain(".vt-studio-split-stepper:focus-within")
    expect(splitCss).toContain("-webkit-text-stroke: .5px #000;")
  })
})
