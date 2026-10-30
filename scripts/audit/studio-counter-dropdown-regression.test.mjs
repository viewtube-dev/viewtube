import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const styles = readFileSync("src/styles/studio-control-system.css", "utf8")
const distill = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8")
const recovery = readFileSync("src/styles/studio-control-recovery-overrides.css", "utf8")
const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
const emitter = readFileSync("scripts/emit-studio-control-vars.mjs", "utf8")
const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8")

test("counter primitives use global full-row width without fixed widths or 2:1 value ratios", () => {
  const start = styles.indexOf("/* New independent StudioCounter")
  const end = styles.indexOf("/* Side Toggle arrow", start)
  const counters = styles.slice(start, end)
  assert.ok(start >= 0 && end > start)
  assert.match(counters, /\.vt-studio-counter,[\s\S]*?\.vt-studio-side-counter,[\s\S]*?\.vt-studio-left-counter\s*\{[^}]*width:\s*100%/)
  assert.doesNotMatch(counters, /vt-studio-counter-width|2fr/)
  assert.doesNotMatch(recovery, /\.vt-studio-counter__value[^}]*aspect-ratio:\s*2\s*\/\s*1/)
  const wordStart = styles.indexOf("/* Double-split word counter")
  const wordStyles = styles.slice(wordStart)
  assert.match(wordStyles, /\.vt-studio-word-counter[\s\S]*?width:\s*100%/)
  assert.doesNotMatch(wordStyles, /176px|2fr/)
})

test("double-split word counter uses the primitive's solid primary face and black focus text", () => {
  const wordStart = styles.indexOf("/* Double-split word counter")
  const wordStyles = styles.slice(wordStart)
  const shell = wordStyles.match(/\.vt-studio-word-counter\s*\{[^}]*\}/)?.[0] ?? ""
  assert.match(shell, /background:\s*var\(--vt-studio-control-accent/)
  assert.doesNotMatch(shell, /color-mix\([^;]*50%/)
  assert.match(wordStyles, /\.vt-studio-word-counter > \[data-vt-studio-split-label\][\s\S]*?background:\s*var\(--vt-studio-control-accent/)
  assert.match(wordStyles, /:focus-within[\s\S]*?color:\s*#000/)
  assert.doesNotMatch(styles + distill + recovery, /\.vt-studio-value-toggle--arrow[^}]*background:\s*color-mix\([^}]*50%/)
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
  assert.doesNotMatch(dropdown + generated, /#36e0f6|#ff7f6b/)
})
