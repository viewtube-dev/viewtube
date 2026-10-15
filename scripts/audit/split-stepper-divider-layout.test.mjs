import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/components/subtoolbox/SubToolboxSplitStepper.tsx", "utf8")
const styles = readFileSync("src/components/subtoolbox/subtoolbox-split-stepper.css", "utf8")

test("stepper uses a native numeric input, not a nested Studio input primitive", () => {
  assert.doesNotMatch(component, /StudioNumberInput/)
  assert.match(component, /<input[\s\S]*?type="number"/)
  assert.match(component, /data-size=\{size === "compact" \? "compact" : "standard"\}/)
})

test("the number pane has square edges and leaves the seam to the rail overlay", () => {
  const inputRule = styles.match(/\.vt-subtoolbox-split-stepper input\.vt-subtoolbox-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
  assert.match(inputRule, /border-radius:\s*0/)
  assert.doesNotMatch(inputRule, /border-right:/)
  assert.doesNotMatch(styles, /\.vt-subtoolbox-split-stepper-rail\s*\{[^}]*border-left:/s)
  assert.match(styles, /\.vt-subtoolbox-split-stepper-rail::after\s*\{[^}]*left:\s*0[^}]*top:\s*0[^}]*bottom:\s*0[^}]*width:\s*var\(--vt-stepper-stroke\)/s)
})

test("the horizontal divider is centered across the rail and both rows remain equal", () => {
  assert.match(styles, /\.vt-subtoolbox-split-stepper-rail::before\s*\{[^}]*position:\s*absolute[^}]*left:\s*0[^}]*right:\s*0[^}]*top:\s*50%/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.doesNotMatch(styles, /\.vt-subtoolbox-split-stepper-rail button \+ button\s*\{[^}]*border-top:/s)
})

test("long press repeats without activating the full-component focus outline", () => {
  assert.doesNotMatch(component, /\(inputFocused \|\| held\)/)
  assert.doesNotMatch(component, /const \[held, setHeld\]/)
  assert.match(component, /scheduleRepeat\(\)/)
})
