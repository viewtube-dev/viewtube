import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const css = readFileSync(new URL("./studio-split-text-input.css", import.meta.url), "utf8")

describe("split text input canonical field styling", () => {
  it("fills its row and clears solid badge paint behind the input", () => {
    expect(css).toContain('width: 100% !important')
    expect(css).toContain('max-width: none !important')
    expect(css).toContain('background: transparent !important')
  })
  it("uses 50% primary resting fill and 15% focus fill", () => {
    expect(css).toContain('var(--vt-split-field-primary) 50%, transparent')
    expect(css).toContain('var(--vt-split-field-primary) 15%, transparent')
  })
  it("paints primary inner edges without adding a second black border or shadow", () => {
    expect(css.match(/linear-gradient\(var\(--vt-split-field-primary\)/g)).toHaveLength(4)
    expect(css).toContain('--vt-split-field-inline-width: var(--vt-studio-control-stroke, 3px)')
    expect(css).toContain('border: 0 !important')
    expect(css).toContain('box-shadow: none')
  })
  it("focuses the complete shell with a zero-offset secondary outline and black text", () => {
    expect(css).toContain(':focus-within > [data-vt-studio-control="true"]')
    expect(css).toContain('var(--vt-studio-control-stroke, 3px) * .65')
    expect(css).toContain('outline-offset: 0 !important')
    expect(css).toContain('-webkit-text-fill-color: #000')
    expect(css).toContain('-webkit-text-stroke-color: #000')
  })
})
