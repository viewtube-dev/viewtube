import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const styles = readFileSync("src/styles/studio-control-system.css", "utf8")
const split = readFileSync("src/styles/studio-control-split.css", "utf8")
const distill = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8")
const recovery = readFileSync("src/styles/studio-control-recovery-overrides.css", "utf8")
const valueToggleStyles = readFileSync("src/styles/studio-control-value-toggles.css", "utf8")
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const emitter = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8")
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8")

test("counter shells use square size-tier rails and a 2:1 value face", () => {
  assert.match(styles, /\.vt-studio-counter\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*var\(--vt-studio-control-height,\s*44px\)\s+minmax\(0,\s*1fr\)\s+var\(--vt-studio-control-height,\s*44px\)/s)
  assert.match(styles, /\.vt-studio-counter__value,[\s\S]*?aspect-ratio:\s*2\s*\/\s*1/)
  assert.match(generated, /--vt-studio-counter-value-area-aspect-ratio:\s*2\s*\/\s*1/)
  assert.match(tokens, /valueAreaAspectRatio:\s*2/)
  assert.match(split, /\[data-vt-studio-control="true"\] \[data-vt-studio-split-rail\][\s\S]*?width: var\(--vt-studio-control-height,\s*44px\)/)
  assert.doesNotMatch(recovery, /vt-studio-counter.*width|vt-studio-side-counter.*width/)
})

test("double-split word counter inherits a solid primary face and black focus text", () => {
  assert.match(valueToggleStyles, /\.vt-studio-value-toggle\s*\{[^}]*--vt-toggle-fill:\s*var\(--vt-studio-control-accent/)
  assert.match(valueToggleStyles, /\.vt-studio-split-shell\.vt-studio-value-toggle\s*\{[^}]*background:\s*var\(--vt-toggle-fill/)
  assert.match(valueToggleStyles, /:focus-within[\s\S]*?\.vt-studio-word-counter__value[\s\S]*?color:\s*var\(--vt-studio-number-active-color,\s*#000\)/)
  assert.match(valueToggleStyles, /\.vt-studio-word-counter\[data-vt-studio-control="true"\] > \[data-vt-studio-split-label\][\s\S]*?border-left:/)
  assert.doesNotMatch(valueToggleStyles, /\.vt-studio-value-toggle--arrow[^}]*background:\s*color-mix\([^}]*50%/)
})

test("bar toggle tooltip is focus-only, the shell has a focus outline, and bars layer above rails", () => {
  const barStyles = distill.slice(distill.indexOf("/* Bar percentage appears only while the control is focused"))
  assert.match(barStyles, /\.vt-studio-value-toggle__bar-tooltip\s*\{[^}]*visibility:\s*hidden/)
  assert.match(barStyles, /:focus-within[\s\S]*?\.vt-studio-value-toggle__bar-tooltip[\s\S]*?visibility:\s*visible/)
  assert.match(barStyles, /\.vt-studio-value-toggle--bar:focus-within[\s\S]*?outline:/)
  assert.match(barStyles, /\.vt-studio-value-toggle--bar\s*>\s*\[data-vt-studio-split-label\][\s\S]*?position:\s*relative[\s\S]*?z-index:\s*3/)
})

test("selected split buttons swap label face to secondary and rails to primary", () => {
  assert.match(styles, /button\[data-vt-studio-button="true"\]\[data-vt-studio-split\]\[data-selected="true"\] > \[data-vt-studio-button-face\][\s\S]*?background:\s*var\(--vt-studio-control-secondary/)
  assert.match(styles, /button\[data-vt-studio-button="true"\]\[data-vt-studio-split\]\[data-selected="true"\] \[data-vt-studio-split-rail\][\s\S]*?background:\s*var\(--vt-studio-control-accent/)
})

test("Play/Pause selected state uses secondary text panel and primary rail", () => {
  const playPause = styles.slice(styles.lastIndexOf("/* Play/Pause uses the same selected palette swap"))
  assert.match(playPause, /aria-pressed="true"\]\s*>\s*\[data-vt-studio-button-face\][\s\S]*?background:\s*var\(--vt-studio-control-secondary/)
  assert.match(playPause, /aria-pressed="true"\][\s\S]*?\[data-vt-studio-split-rail\][\s\S]*?background:\s*var\(--vt-studio-control-accent/)
  assert.doesNotMatch(playPause, /color-mix\([^;]+50%/)
})

test("dropdowns use primary/secondary pair tokens, centered labels, and token-owned chevron spacing", () => {
  const dropdown = styles.slice(styles.lastIndexOf("/* Global dropdown menu contract"))
  assert.match(tokens, /menuFill:\s*"primary"/)
  assert.match(tokens, /unselectedRowFill:\s*"white"/)
  assert.match(tokens, /selectedRowFill:\s*"secondary"/)
  assert.match(tokens, /chevronInset:\s*6/)
  assert.match(dropdown, /\.vt-studio-dropdown-menu\s*\{[^}]*background:\s*var\(--vt-studio-dropdown-menu-fill/)
  assert.match(dropdown, /\.vt-studio-dropdown-option\[data-selected="true"\],[\s\S]*?background:\s*var\(--vt-studio-dropdown-selected-fill/)
  assert.match(dropdown, /\[data-vt-studio-dropdown-value\][\s\S]*?text-align:\s*center/)
  assert.match(dropdown, /\.vt-studio-dropdown-chevron[\s\S]*?padding-inline:\s*var\(--vt-studio-dropdown-chevron-inset/)
  assert.match(dropdown, /\.vt-studio-dropdown\[data-open="true"\] button\[data-dropdown-trigger="true"\][\s\S]*?border-radius:/)
  assert.match(emitter, /function readMenuNumber/)
  assert.match(emitter, /function readMenuName/)
  assert.ok(emitter.includes("(?:^|\\\\s)${property}"))
  assert.match(emitter, /dropdownChevronInset/)
  assert.match(generated, /--vt-studio-dropdown-menu-fill:\s*var\(--vt-studio-control-accent, var\(--pair-a\)\)/)
  assert.match(generated, /--vt-studio-dropdown-selected-fill:\s*var\(--vt-studio-control-secondary, var\(--pair-b\)\)/)
  assert.match(generated, /--vt-studio-dropdown-chevron-inset:\s*6px/)
  assert.match(dropdown, /--vt-studio-dropdown-menu-fill/)
  assert.match(dropdown, /--vt-studio-dropdown-selected-fill/)
})
