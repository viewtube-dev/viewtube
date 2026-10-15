import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SubToolboxSplitStepper } from "./SubToolboxSplitStepper"

const source = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/SubToolboxSplitStepper.tsx"), "utf8")
const css = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/subtoolbox-split-stepper.css"), "utf8")

describe("SubToolboxSplitStepper", () => {
  it("renders a native editable numeric field and accessible stacked actions", () => {
    const html = renderToStaticMarkup(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
    expect(html).toContain('class="vt-subtoolbox-split-stepper is-standard"')
    expect(html).toContain('data-stepper-size="standard"')
    expect(html).toContain('type="number"')
    expect(html).toContain('class="vt-subtoolbox-split-stepper-value"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('aria-label="Value"')
    expect(html).toContain('aria-label="Increase Value"')
    expect(html).toContain('aria-label="Decrease Value"')
    expect(source).not.toContain("StudioNumberInput")
  })

  it("uses the split-left field contract with a fixed 2:1 value pane and square rail", () => {
    expect(css).toContain("flex: 0 0 auto;")
    expect(css).toContain("grid-template-columns: minmax(0, calc(var(--vt-stepper-inner-height) * 2)) var(--vt-stepper-inner-height);")
    expect(css).toContain("width: calc(var(--vt-stepper-inner-height) * 3 + (var(--vt-stepper-stroke) * 2));")
    expect(css).toContain("width: var(--vt-stepper-inner-height);")
    expect(css).toContain("box-shadow: none;")
    expect(css).toContain("background: color-mix(in srgb, var(--pair-a, #73deff) 50%, transparent);")
    const inputRule = css.match(/\.vt-subtoolbox-split-stepper input\.vt-subtoolbox-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
    expect(inputRule).toContain("border-radius: 0;")
    expect(inputRule).not.toContain("border-right:")
    expect(inputRule).toContain("inset var(--vt-stepper-stroke) 0 0 0 var(--pair-a, #73deff)")
  })

  it("draws both seams as centered rail overlays without shrinking either button row", () => {
    expect(css).toMatch(/\.vt-subtoolbox-split-stepper-rail\s*\{[^}]*grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/s)
    expect(css).toMatch(/\.vt-subtoolbox-split-stepper-rail::after\s*\{[^}]*left:\s*0[^}]*top:\s*0[^}]*bottom:\s*0[^}]*width:\s*var\(--vt-stepper-stroke\)/s)
    expect(css).toMatch(/\.vt-subtoolbox-split-stepper-rail::before\s*\{[^}]*left:\s*0[^}]*right:\s*0[^}]*top:\s*50%/s)
    expect(css).not.toMatch(/\.vt-subtoolbox-split-stepper-rail\s*\{[^}]*border-left:/s)
    expect(css).not.toMatch(/\.vt-subtoolbox-split-stepper-rail button \+ button\s*\{[^}]*border-top:/s)
  })

  it("keeps full-component focus for numeric editing but not for a held rail press", () => {
    expect(source).toContain('inputFocused ? "is-interacting" : ""')
    expect(source).toContain("onFocus={() => setInputFocused(true)}")
    expect(source).toContain("scheduleRepeat()")
    expect(source).toContain("}, 360)")
    expect(source).not.toContain("const [held, setHeld]")
    expect(css).toContain(".vt-subtoolbox-split-stepper.is-interacting")
    expect(css).toContain("outline: 2px solid var(--pair-b, #fff);")
  })

  it("preserves numeric drafts while focused and clamps committed values", () => {
    expect(source).toContain("if (!inputFocused) setDraft(String(value))")
    expect(source).toContain("setDraft(nextDraft)")
    expect(source).toContain("Math.min(max, Math.max(min, parsed))")
    expect(source).toContain('data-size={size === "compact" ? "compact" : "standard"}')
  })
})
