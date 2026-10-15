import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SubToolboxSplitStepper } from "./SubToolboxSplitStepper"

const source = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/SubToolboxSplitStepper.tsx"), "utf8")
const css = readFileSync(resolve(process.cwd(), "src/components/subtoolbox/subtoolbox-split-stepper.css"), "utf8")

describe("SubToolboxSplitStepper", () => {
  it("renders the canonical editable numeric Studio input and stacked action buttons", () => {
    const html = renderToStaticMarkup(<SubToolboxSplitStepper value={5} onValueChange={() => {}} />)
    expect(html).toContain('class="vt-subtoolbox-split-stepper is-standard"')
    expect(html).toContain('data-stepper-size="standard"')
    expect(html).toContain('type="number"')
    expect(html).toContain('class="vt-subtoolbox-split-stepper-value"')
    expect(html).toContain('aria-label="Value"')
    expect(html).toContain('aria-label="Increase Value"')
    expect(html).toContain('aria-label="Decrease Value"')
  })

  it("keeps fixed 2:1 value-field geometry and a square rail without outer shadow", () => {
    expect(css).toContain("flex: 0 0 auto;")
    expect(css).toContain("width: calc(var(--vt-stepper-inner-height) * 3 + (var(--vt-stepper-stroke) * 2));")
    expect(css).toContain("width: var(--vt-stepper-inner-height);")
    expect(css).toContain("box-shadow: none;")
    expect(css).toContain("background: color-mix(in srgb, var(--pair-a, #73deff) 50%, transparent);")
    expect(css).toContain("box-shadow: inset 0 0 0 var(--vt-stepper-stroke) var(--pair-a, #73deff);")
    expect(css).toContain("width: calc(var(--vt-stepper-height) * .68);")
    expect(css).toContain("outline: 2px solid var(--pair-b, #fff);")
  })

  it("uses the full-component focus state for editing and held presses, not ordinary clicks", () => {
    expect(source).toContain('(inputFocused || held) ? "is-interacting" : ""')
    expect(source).toContain("onFocus={() => setInputFocused(true)}")
    expect(source).toContain("setHeld(true)")
    expect(source).toContain("}, 360)")
    expect(source).toContain("if (event.detail === 0 && !disabled")
    expect(css).toContain(".vt-subtoolbox-split-stepper.is-interacting")
  })

  it("keeps numeric drafts while focused and clamps committed values", () => {
    expect(source).toContain('if (!inputFocused) setDraft(String(value))')
    expect(source).toContain("setDraft(nextDraft)")
    expect(source).toContain("Math.min(max, Math.max(min, parsed))")
    expect(source).toContain('sizeVariant={size === "compact" ? "compact" : "standard"}')
  })
})
