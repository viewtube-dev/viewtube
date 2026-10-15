import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/components/subtoolbox/SubToolboxSplitStepper.tsx", "utf8")
const styles = readFileSync("src/components/subtoolbox/subtoolbox-split-stepper.css", "utf8")

test("split stepper uses the canonical editable number input", () => {
  assert.match(component, /import \{ StudioNumberInput \} from "\.\.\/\.\.\/studio-ui\/primitives\/StudioTextInput"/)
  assert.match(component, /<StudioNumberInput/)
  assert.match(component, /setDraft\(event\.currentTarget\.value\)/)
  assert.match(component, /const next = Math\.min\(max, Math\.max\(min, parsed\)\)/)
})

test("split stepper keeps fixed 2:1 field and square rail geometry without shadows", () => {
  assert.match(styles, /grid-template-columns:\s*minmax\(0, 2fr\) minmax\(0, 1fr\)/)
  assert.match(styles, /width:\s*calc\(var\(--vt-stepper-inner-height\) \* 3 \+ \(var\(--vt-stepper-stroke\) \* 2\)\)/)
  assert.match(styles, /width:\s*var\(--vt-stepper-inner-height\)/)
  assert.match(styles, /box-shadow:\s*none/)
  assert.match(styles, /background:\s*color-mix\(in srgb, var\(--pair-a, #73deff\) 50%, transparent\)/)
  assert.match(styles, /box-shadow:\s*inset 0 0 0 var\(--vt-stepper-stroke\) var\(--pair-a, #73deff\)/)
  assert.match(styles, /width:\s*calc\(var\(--vt-stepper-height\) \* \.68\)/)
  assert.doesNotMatch(styles, /width:\s*100%;\s*\n\s*min-width:\s*0;\s*\n\s*max-width:\s*none;/)
})

test("whole component focus is limited to editing and a held button press", () => {
  assert.match(component, /data-input-focused=\{inputFocused \? "true" : "false"\}/)
  assert.match(component, /data-press-hold=\{pressHeld \? "true" : "false"\}/)
  assert.match(component, /setTimeout\(\(\) => setPressHeld\(true\), 180\)/)
  assert.match(styles, /\[data-input-focused="true"\]::after/)
  assert.match(styles, /\[data-press-hold="true"\]::after/)
})
