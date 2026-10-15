import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const styles = readFileSync("src/styles/studio-control-system.css", "utf8")

test("canonical Studio Controls owns the split stepper and keeps native numeric editing", () => {
  assert.match(component, /export const StudioSplitStepper/)
  assert.match(component, /data-vt-studio-control-kind="split-stepper"/)
  assert.match(component, /data-vt-studio-username-foundation="true"/)
  assert.match(component, /<input[\s\S]*?type="number"/)
  assert.match(component, /data-size=\{size\}/)
  assert.match(component, /<ChevronsUp aria-hidden="true" \/>/)
  assert.match(component, /<ChevronsDown aria-hidden="true" \/>/)
})

test("both steppers share the username-input primary/secondary design foundation", () => {
  assert.match(styles, /\.vt-studio-username-input\s*\{/)
  assert.match(styles, /\.vt-studio-inline-stepper,\s*\.vt-studio-split-stepper\s*\{[^}]*--vt-stepper-primary:/s)
  assert.match(styles, /background:\s*color-mix\(in srgb, var\(--vt-stepper-primary\) var\(--vt-studio-control-default-fill-opacity, 50%\), transparent\)/)
  assert.match(styles, /\.vt-studio-split-stepper-rail\s*\{[^}]*background:\s*var\(--vt-stepper-secondary\)/s)
  assert.match(styles, /\.vt-studio-split-stepper\s*\{[^}]*box-shadow:\s*none/s)
})

test("split value pane has squared inner edge and rail owns the vertical seam", () => {
  const inputRule = styles.match(/\.vt-studio-split-stepper input\.vt-studio-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
  assert.match(inputRule, /border-radius:\s*0/)
  assert.match(inputRule, /border:\s*0/)
  assert.doesNotMatch(styles, /\.vt-studio-split-stepper-rail\s*\{[^}]*border-left:/s)
  assert.match(styles, /\.vt-studio-split-stepper-rail::after\s*\{[^}]*left:\s*0[^}]*top:\s*0[^}]*bottom:\s*0[^}]*width:\s*var\(--vt-stepper-stroke\)/s)
})

test("horizontal divider is centered, both actions have equal rows, and repeat stops at bounds", () => {
  assert.match(styles, /\.vt-studio-split-stepper-rail::before\s*\{[^}]*left:\s*0[^}]*right:\s*0[^}]*top:\s*50%/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(component, /if \(\(heldDirection\.current > 0 && valueRef\.current < max\) \|\| \(heldDirection\.current < min\)\) scheduleRepeatRef\.current\(\)/)
  assert.match(styles, /\.vt-studio-split-stepper-rail button:focus-visible\s*\{\s*outline:\s*2px solid/)
})
