import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("../../styles/studio-split-text-input.css", import.meta.url), "utf8")

describe("split input real interior border contract", () => {
  it("uses the native input border rather than a decorative layer", () => {
    expect(css).toContain('border: var(--vt-studio-control-stroke, 3px) solid var(--vt-split-field-primary)')
    expect(css).not.toContain('::after')
    expect(css).not.toContain('::before')
    expect(css).not.toContain('linear-gradient(')
    expect(css).not.toContain('position: absolute')
    expect(css).toContain('box-shadow: none')
  })
  it("inherits the appropriate inner corner radii", () => {
    expect(css).toContain('border-radius: inherit')
    expect(css).toContain('--vt-split-field-inner-radius: max(0px, calc(var(--vt-studio-control-radius, 6px) - var(--vt-studio-control-stroke, 3px)))')
    expect(css).toContain('[data-split="left"]')
    expect(css).toContain('[data-split="right"]')
  })
  it("stretches within the shell instead of independently calculating a label height", () => {
    expect(css).toContain('grid-template-rows: minmax(0, 1fr)')
    expect(css).toContain('height: auto')
    expect(css).toContain('height: 100%')
    expect(css).toContain('box-sizing: border-box')
    expect(css).toContain('margin: 0')
    expect(css).not.toContain('height: calc(var(--vt-studio-control-height) - 2')
  })
  it("preserves resting/focus fills and the secondary shell outline", () => {
    expect(css).toContain('var(--vt-split-field-primary) 50%, transparent')
    expect(css).toContain('var(--vt-split-field-primary) 15%, transparent')
    expect(css).toContain(':focus-within > [data-vt-studio-control="true"]')
    expect(css).toContain('outline-offset: 0 !important')
    expect(css).toContain('-webkit-text-fill-color: #000')
    expect(css).toContain('-webkit-text-stroke-color: #000')
  })
})
