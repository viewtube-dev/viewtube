import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitStepper } from "../../studio-ui/primitives/StudioSplitStepper"

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
    expect(css).toContain("grid-template-columns: minmax(0, calc(var(--vt-split-stepper-inner) * 2)) var(--vt-split-stepper-inner)")
    expect(css).toContain("box-shadow: none;")
    expect(css).toContain("width: 136%; height: 136%")
    expect(css).toContain("var(--vt-studio-control-default-fill-opacity, 50%)")
    const inputRule = css.match(/\.vt-studio-split-stepper input\.vt-studio-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
    expect(inputRule).toContain("border-radius: 0;")
    expect(inputRule).toContain("border: 0;")
  })

  it("centers the rail divider and gives both actions equal rows", () => {
    expect(css).toMatch(/\.vt-studio-split-stepper-rail\s*\{[^}]*grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/s)
    expect(css).toMatch(/\.vt-studio-split-stepper-rail::before\s*\{[^}]*top:\s*50%/s)
    expect(css).toContain("button:focus-visible { outline: 2px solid")
  })

  it("preserves draft editing, bounds, controlled synchronization and hold-repeat behavior", () => {
    expect(source).toContain("if (!inputFocused) setDraft(String(value))")
    expect(source).toContain("Math.min(max, Math.max(min, parsed))")
    expect(source).toContain("scheduleRepeat")
    expect(source).toContain("inputFocused || holding")
    expect(source).toContain("data-vt-studio-control-family=\"stepper\"")
    expect(source).toContain("onPointerDown")
    expect(source).toContain("type=\"number\"")
  })
})
