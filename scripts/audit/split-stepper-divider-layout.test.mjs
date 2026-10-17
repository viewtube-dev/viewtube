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

test("stepper variants retain shared palette tokens while the split stepper keeps its username-input foundation", () => {
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
  assert.match(styles, /\.vt-studio-split-stepper-rail button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-stepper-stroke\) solid #000/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(component, /if \(\(heldDirection\.current > 0 && valueRef\.current < max\) \|\| \(heldDirection\.current < 0 && valueRef\.current > min\)\) scheduleRepeatRef\.current\(\)/)
  assert.match(styles, /\.vt-studio-split-stepper-rail button:focus-visible\s*\{\s*outline:\s*3px solid/)
})

test("inline stepper is built on the canonical double-split shell with interactive square rails", () => {
  const inlineStart = component.indexOf("export const StudioInlineStepper")
  const inlineEnd = component.indexOf('StudioInlineStepper.displayName', inlineStart)
  const inline = component.slice(inlineStart, inlineEnd)
  assert.match(inline, /<StudioSplitShell[\s\S]*?layout="double"/)
  assert.match(inline, /interactiveRails/)
  assert.match(component, /data-vt-studio-split-rail data-rail="start"/)
  assert.match(inline, /"data-vt-studio-control-kind": "inline-stepper"/)
  assert.doesNotMatch(inline, /<StudioSplitLeftButton/)
  assert.doesNotMatch(inline, /<StudioUsernameInput/)
  assert.match(styles, /\.vt-studio-inline-stepper\s*\{[^}]*grid-template-columns:\s*var\(--vt-inline-stepper-side\) minmax\(40px, 1fr\) var\(--vt-inline-stepper-side\)/s)
  assert.match(styles, /\[data-vt-studio-control="true"\]\[data-vt-studio-split="double"\]\.vt-studio-inline-stepper\s*\{/)
  assert.match(styles, /--vt-inline-stepper-side:\s*var\(--vt-studio-control-height, 44px\)/)
  assert.match(styles, /\.vt-studio-inline-stepper__value\s*\{[^}]*border:\s*0/s)
  assert.match(styles, /\.vt-studio-inline-stepper__rail\s*\{[^}]*cursor:\s*pointer/s)
})

test("inline stepper remains a single shell with no nested shell or duplicate perimeter", () => {
  const inlineStart = component.indexOf("export const StudioInlineStepper")
  const inlineEnd = component.indexOf('StudioInlineStepper.displayName', inlineStart)
  const inline = component.slice(inlineStart, inlineEnd)
  assert.equal((inline.match(/<StudioSplitShell/g) ?? []).length, 1)
  assert.doesNotMatch(inline, /<StudioSplitLeftButton|<StudioUsernameInput/)
  assert.match(styles, /\.vt-studio-inline-stepper,\s*\.vt-studio-split-stepper\s*\{[^}]*border:\s*var\(--vt-stepper-stroke\) solid #000/s)
})
