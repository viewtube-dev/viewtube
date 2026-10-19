import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const css = readFileSync("src/styles/studio-control-system.css", "utf8")
const generator = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8")
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8")
const dropdown = component.slice(component.indexOf("export const StudioDropdown"), component.indexOf("export interface StudioSimpleDropdownOption"))

test("dropdown chevron geometry has one token-owned source shared by single and multi-select", () => {
  assert.match(tokens, /STUDIO_DROPDOWN_TOKENS/)
  assert.match(css, /--vt-studio-dropdown-standard-chevron-size/)
  assert.match(css, /--vt-studio-dropdown-compact-chevron-size/)
  assert.match(css, /--vt-legend-chevron-size:\s*var\(--vt-studio-dropdown-chevron-size\)/)
  assert.match(css, /\.vt-studio-legend-chevron\s*\{\s*stroke-width:\s*var\(--vt-studio-dropdown-chevron-stroke/)
})

test("simple dropdown has no split rail; split-left dropdown uses split-shell anatomy and trailing chevron", () => {
  assert.match(dropdown, /variant === "simple"/)
  assert.match(dropdown, /data-vt-studio-split=\{variant === "split-left" \? "left" : undefined\}/)
  assert.match(dropdown, /StudioSplitShell[\s\S]*?layout="double"[\s\S]*?faceOnly/)
  assert.match(component, /interface StudioSplitShellProps[\s\S]*?rightRailClassName/)
  assert.match(dropdown, /data-vt-studio-dropdown-chevron/)
  assert.match(dropdown, /splitIcon/)
  assert.match(dropdown, /rightRailProps=\{\{ "data-vt-studio-dropdown-chevron": "true"/)
  assert.doesNotMatch(dropdown, /variant === "split-left" \? <span className="vt-studio-dropdown-chevron is-leading"/)
})

test("split dropdown rail uses secondary fill and reserves the trailing rail for the chevron", () => {
  assert.match(css, /\.vt-studio-dropdown-split-rail\s*\{[\s\S]*?background:\s*var\(--vt-studio-control-secondary/)
  assert.match(css, /\.vt-studio-dropdown\.is-split-left button\[data-dropdown-trigger="true"\]\s*\{\s*grid-template-columns:\s*var\(--vt-studio-dropdown-rail-size\) minmax\(0, 1fr\) var\(--vt-studio-dropdown-rail-size\)/)
  assert.match(dropdown, /className="vt-studio-dropdown-chevron is-trailing"/)
  assert.match(css, /\\.vt-studio-dropdown \\.vt-studio-dropdown-chevron\\[data-rail="end"\\] svg \\{ width: var\\(--vt-studio-dropdown-chevron-size\\); height: var\\(--vt-studio-dropdown-chevron-size\\); \\}/)
})

test("side counter divider is a centered overlay and does not consume either action row", () => {
  assert.match(css, /\.vt-studio-side-counter__actions button:first-child::after\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)[^}]*height:\s*var\(--vt-studio-control-stroke/s)
  assert.doesNotMatch(css, /\.vt-studio-side-counter__actions button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-studio-control-stroke/)
  assert.doesNotMatch(css, /\.vt-studio-left-counter\.is-reversed \.vt-studio-side-counter__actions button:first-child\s*\{[^}]*border-bottom:/)
})

test("counter and slider readouts share default mix and black active numeral tokens", () => {
  assert.match(tokens, /STUDIO_COUNTER_NUMBER_TOKENS/)
  assert.match(css, /--vt-studio-number-default-white-mix:\s*50%/)
  assert.match(css, /\.vt-studio-counter \{[^}]*--vt-studio-number-background:\s*var\(--pair-a\)/)
  assert.match(css, /\.vt-studio-left-counter\.is-reversed \{[^}]*--vt-studio-number-background:\s*var\(--pair-b\)/)
  assert.match(css, /\.vt-studio-double-split-slider \.vt-studio-double-split-slider__value\s*\{[^}]*color-mix\(in srgb, #fff var\(--vt-studio-number-default-white-mix, 50%\), var\(--vt-studio-number-background\)\)/s)
  assert.match(css, /\.vt-studio-double-split-slider:has\(input\[type="range"\]:is\(:active, :focus\)\) \.vt-studio-double-split-slider__value\s*\{[^}]*-webkit-text-stroke-color:\s*var\(--vt-studio-number-active-stroke, #000\)/s)
  assert.match(css, /\.vt-studio-left-counter:has\([\s\S]*?\.vt-studio-side-counter__value[\s\S]*?-webkit-text-stroke-color:\s*var\(--vt-studio-number-active-stroke, #000\)/)
  assert.match(css, /\.vt-studio-side-counter:has\([\s\S]*?\.vt-studio-side-counter__value[\s\S]*?-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke, 1px\) var\(--vt-studio-number-active-stroke, #000\)/s)
})

test("generated CSS variables stay synchronized with the canonical token module", () => {
  assert.ok(generator.includes('readFile(resolve(root, "src/studio-ui/tokens.ts")'))
  assert.match(generator, /STUDIO_DROPDOWN_TOKENS/)
  assert.match(generator, /STUDIO_COUNTER_NUMBER_TOKENS/)
  assert.match(generated, /--vt-studio-dropdown-standard-chevron-size: 28px/)
  assert.match(generated, /--vt-studio-dropdown-compact-chevron-size: 18px/)
  assert.match(generated, /--vt-studio-number-default-white-mix: 50%/)
  assert.match(generated, /--vt-studio-number-active-color: #000/)
  assert.match(generated, /--vt-studio-number-active-stroke: #000/)
})
