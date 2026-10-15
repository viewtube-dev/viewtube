import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/studio-ui/primitives/StudioSplitStepper.tsx", "utf8")
const styles = readFileSync("src/studio-ui/primitives/studio-split-stepper.css", "utf8")

test("stepper is implemented in Studio Controls and retains native numeric input", () => {
  assert.match(component, /data-vt-studio-control-kind="split-stepper"/)
  assert.match(component, /<input[\s\S]*?type="number"/)
  assert.match(component, /data-size=\{size\}/)
})

test("number pane has squared inner edge and rail owns the vertical seam", () => {
  const inputRule = styles.match(/\.vt-studio-split-stepper input\.vt-studio-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
  assert.match(inputRule, /border-radius:\s*0/)
  assert.match(inputRule, /border:\s*0/)
  assert.doesNotMatch(styles, /\.vt-studio-split-stepper-rail\s*\{[^}]*border-left:/s)
  assert.match(styles, /\.vt-studio-split-stepper-rail::after\s*\{[^}]*left:\s*0[^}]*top:\s*0[^}]*bottom:\s*0[^}]*width:\s*var\(--vt-split-stepper-stroke\)/s)
})

test("horizontal divider is centered and both actions have equal rows", () => {
  assert.match(styles, /\.vt-studio-split-stepper-rail::before\s*\{[^}]*left:\s*0[^}]*right:\s*0[^}]*top:\s*50%/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
})

test("hold repetition stops at bounds and visible focus remains available", () => {
  assert.match(component, /if \(valueRef\.current !== max && valueRef\.current !== min\) scheduleRepeat\(\)/)
  assert.match(styles, /button:focus-visible \{ outline: 2px solid/)
})
