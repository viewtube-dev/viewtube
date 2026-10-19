import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("./studio-split-text-input.css", import.meta.url), "utf8")

describe("split text input paint ownership", () => {
  it("fills the row and fixes the interior to the space inside the shell border", () => {
    expect(css).toContain('width: 100% !important')
    expect(css).toContain('max-width: none !important')
    expect(css).toContain('height: calc(var(--vt-studio-control-height) - 2 * var(--vt-studio-control-stroke)) !important')
    expect(css).toContain('height: 100% !important')
  })
  it("paints all four primary edges on a non-interactive perimeter overlay", () => {
    expect(css).toContain('[data-vt-studio-split-label]::after')
    expect(css).toContain('inset: 0')
    expect(css).toContain('border: var(--vt-split-field-inline-width) solid var(--vt-split-field-primary)')
    expect(css).toContain('box-sizing: border-box')
    expect(css).toContain('pointer-events: none')
    expect(css).not.toContain('linear-gradient(')
    expect(css).toContain('box-shadow: none')
  })
  it("keeps fill on the label region and makes the native input transparent in focus", () => {
    expect(css).toContain('var(--vt-split-field-primary) 50%, transparent')
    expect(css).toContain('[data-vt-studio-split-label]:focus-within')
    expect(css).toContain('var(--vt-split-field-primary) 15%, transparent')
    expect(css).toContain('background: transparent !important')
    expect(css).not.toContain('background-image:')
  })
  it("retains secondary shell focus outline and black focused glyphs", () => {
    expect(css).toContain(':focus-within > [data-vt-studio-control="true"]')
    expect(css).toContain('var(--vt-studio-control-stroke, 3px) * .65')
    expect(css).toContain('outline-offset: 0 !important')
    expect(css).toContain('-webkit-text-fill-color: #000')
    expect(css).toContain('-webkit-text-stroke-color: #000')
  })
})
