import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/components/subtoolbox/SubToolboxSplitStepper.tsx", "utf8")
const styles = readFileSync("src/components/subtoolbox/subtoolbox-split-stepper.css", "utf8")

test("stepper uses a native numeric input, not a nested Studio input primitive", () => {
  assert.doesNotMatch(component, /StudioNumberInput/)
  assert.match(component, /<input[\s\S]*?type="number"/)
})

test("the number pane has square edges and leaves the seam to the rail", () => {
  const inputRule = styles.match(/\.vt-subtoolbox-split-stepper input\.vt-subtoolbox-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
  assert.match(inputRule, /border-radius:\s*0/)
  assert.doesNotMatch(inputRule, /border-right:/)
  assert.match(styles, /\.vt-subtoolbox-split-stepper-rail\s*\{[^}]*border-left:\s*var\(--vt-stepper-stroke\) solid #000/s)
})

test("the rail divider is centered and spans only the button rail", () => {
  assert.match(styles, /\.vt-subtoolbox-split-stepper-rail::before\s*\{[^}]*position:\s*absolute[^}]*left:\s*0[^}]*right:\s*0[^}]*top:\s*50%/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.doesNotMatch(styles, /\.vt-subtoolbox-split-stepper-rail button \+ button\s*\{[^}]*border-top:/s)
})
