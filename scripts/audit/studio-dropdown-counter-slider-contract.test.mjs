import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const css = readFileSync("src/styles/studio-control-system.css", "utf8")
const dropdown = component.slice(component.indexOf("export const StudioDropdown"), component.indexOf("export interface StudioSimpleDropdownOption"))

test("dropdown chevron geometry has one token-owned source shared by single and multi-select", () => {
  assert.match(tokens, /STUDIO_DROPDOWN_TOKENS/)
  assert.match(css, /--vt-studio-dropdown-standard-chevron-size/)
  assert.match(css, /\.vt-studio-legend-trigger[\s\S]*?--vt-studio-dropdown-chevron-size/)
})

test("simple dropdown has no split rail; split-left dropdown uses split-shell anatomy and trailing chevron", () => {
  assert.match(dropdown, /variant === "simple"/)
  assert.match(dropdown, /data-vt-studio-split="left"/)
  assert.match(dropdown, /data-vt-studio-split-rail/)
  assert.match(dropdown, /data-vt-studio-dropdown-chevron/)
  assert.match(dropdown, /splitIcon/)
  assert.doesNotMatch(dropdown, /variant === "split-left" \? <span className="vt-studio-dropdown-chevron is-leading"/)
})

test("split dropdown rail uses secondary fill and leaves chevron on the trailing side", () => {
  assert.match(css, /\.vt-studio-dropdown\.is-split-left[\s\S]*?data-vt-studio-split-rail[\s\S]*?var\(--vt-studio-control-secondary/)
  assert.match(css, /\.vt-studio-dropdown-chevron[\s\S]*?--vt-studio-dropdown-chevron-size/)
  assert.match(css, /\.vt-studio-dropdown\.is-split-left button\[data-dropdown-trigger="true"\][\s\S]*?minmax\(0, 1fr\)\s+minmax\(0, 1fr\)/)
})

test("side counter divider is a centered overlay and does not consume either action row", () => {
  assert.match(css, /\.vt-studio-side-counter__actions button:first-child::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)[^}]*height:\s*var\(--vt-studio-control-stroke/s)
  assert.doesNotMatch(css, /\.vt-studio-side-counter__actions button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-studio-control-stroke/)
})

test("counter and slider readouts share default mix and black active numeral tokens", () => {
  assert.match(tokens, /STUDIO_COUNTER_NUMBER_TOKENS/)
  assert.match(css, /--vt-studio-number-default-white-mix:\s*50%/)
  assert.match(css, /\.vt-studio-double-split-slider__value[\s\S]*?color-mix\\(in srgb, #fff var\\(--vt-studio-number-default-white-mix, 50%\\), var\\(--vt-studio-number-background/)
  assert.match(css, /\.vt-studio-double-split-slider:has\([\s\S]*?\.vt-studio-double-split-slider__value[\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke[^;]*#000/s)
  assert.match(css, /\.vt-studio-side-counter:has\([\s\S]*?\.vt-studio-side-counter__value[\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke[^;]*#000/s)
})
