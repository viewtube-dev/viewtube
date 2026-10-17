import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitStepper } from "../../studio-ui/primitives/StudioControls"

const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")

describe("StudioSplitStepper", () => {
  it("renders a native editable number field and accessible rail actions", () => {
    const html = renderToStaticMarkup(<StudioSplitStepper value={5} onValueChange={() => {}} />)
    expect(html).toContain('data-vt-studio-control-kind="split-stepper"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('type="number"')
    expect(html).toContain('aria-label="Value"')
    expect(html).toContain('aria-label="Increase Value"')
    expect(html).toContain('aria-label="Decrease Value"')
  })

  it("uses canonical Studio Controls sizing and a fixed 2:1 value pane", () => {
    expect(css).toContain("var(--vt-studio-control-height, 44px)")
    expect(css).toContain("var(--vt-studio-control-stroke, 3px)")
    expect(css).toContain("var(--vt-studio-control-radius, 6px)")
    expect(css).toContain("grid-template-columns: minmax(0, 2fr) var(--vt-stepper-height)")
    expect(css).toContain("box-shadow: none;")
    expect(css).toContain("width: 70%;")
    expect(css).toContain("height: 70%;")
    expect(css).toContain("var(--vt-studio-control-default-fill-opacity, 50%)")
    const inputRule = css.match(/\.vt-studio-split-stepper input\.vt-studio-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
    expect(inputRule).toMatch(/border-radius:\s*0(?:\s*!important)?;/)
    expect(inputRule).toMatch(/border:\s*0(?:\s*!important)?;/)
  })

  it("centers the rail divider and gives both actions equal rows", () => {
    expect(css).toMatch(/\.vt-studio-split-stepper-rail\s*\{[^}]*grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/s)
    expect(css).toContain(".vt-studio-split-stepper-rail button:first-child { border-bottom: var(--vt-stepper-stroke) solid #000; }")
    expect(css).toContain(".vt-studio-split-stepper-rail button:first-child { border-bottom: var(--vt-stepper-stroke) solid #000; }")
    expect(css).toContain(".vt-studio-split-stepper-rail button:focus-visible { outline: 3px solid")
  })

  it("preserves draft editing, bounds, controlled synchronization and hold-repeat behavior", () => {
    expect(source).toContain("if (!inputFocused) setDraft(String(value))")
    expect(source).toContain("normalizeStudioInlineStepperValue(parsed, 0, safeStep, min, max)")
    expect(source).toContain("scheduleRepeat")
    expect(source).toContain("inputFocused || holding")
    expect(source).toContain("data-vt-studio-control-family=\"stepper\"")
    expect(source).toContain("onPointerDown")
    expect(source).toContain("type=\"number\"")
  })
})
