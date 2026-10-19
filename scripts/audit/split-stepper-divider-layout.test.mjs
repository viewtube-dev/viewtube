import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const component = readFileSync("src/studio-ui/primitives/StudioControls.tsx", "utf8")
const styles = readFileSync("src/styles/studio-control-system.css", "utf8")

test("canonical Studio Controls owns the split stepper and keeps native numeric editing", () => {
  assert.match(component, /export const StudioSplitStepper/)
  assert.match(component, /"data-vt-studio-control-kind": "split-stepper"/)
  assert.match(component, /layout="right"/)
  assert.match(component, /"data-vt-library-component": "StudioSplitRightBadge"/)
  assert.match(component, /<input[\s\S]*?type="number"/)
  assert.match(component, /data-size=\{size\}/)
  assert.match(component, /<ChevronUp aria-hidden="true" \/>/)
  assert.match(component, /<ChevronDown aria-hidden="true" \/>/)
})

test("split stepper shares palette tokens and uses the canonical split-right rail", () => {
  assert.match(styles, /\.vt-studio-split-right-badge\s*\{/)
  assert.match(styles, /\.vt-studio-inline-stepper,\s*\.vt-studio-split-stepper\s*\{[^}]*--vt-stepper-primary:/s)
  assert.match(styles, /background:\s*color-mix\(in srgb, var\(--vt-stepper-primary\) var\(--vt-studio-control-default-fill-opacity, 50%\), transparent\)/)
  assert.match(styles, /\.vt-studio-split-stepper-actions\s*\{[^}]*grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/s)
  assert.match(styles, /\.vt-studio-split-stepper\s*\{[^}]*border:\s*var\(--vt-stepper-stroke\) solid #000/s)
  assert.match(component, /rightRailContent=/)
})

test("split value pane has squared inner edge and rail owns the vertical seam", () => {
  const inputRule = styles.match(/\.vt-studio-split-stepper input\.vt-studio-split-stepper-value[^}]*\{([^}]*)\}/)?.[1] ?? ""
  assert.match(inputRule, /border-radius:\s*0/)
  assert.match(inputRule, /border:\s*0/)
  assert.match(styles, /\[data-vt-studio-control="true"\]\[data-vt-studio-split="right"\]\.vt-studio-split-stepper > \[data-vt-studio-split-rail\]\.vt-studio-split-stepper-rail\s*\{[^}]*border-left:\s*var\(--vt-stepper-stroke\) solid #000/s)
  assert.match(styles, /\.vt-studio-split-stepper-actions button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-stepper-stroke\) solid #000/s)
})

test("horizontal divider is centered, both actions have equal rows, and repeat stops at bounds", () => {
  assert.match(styles, /\.vt-studio-split-stepper-actions button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-stepper-stroke\) solid #000/s)
  assert.match(styles, /grid-template-rows:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(component, /if \(\(heldDirection\.current > 0 && valueRef\.current < max\) \|\| \(heldDirection\.current < 0 && valueRef\.current > min\)\) scheduleRepeatRef\.current\(\)/)
  assert.match(styles, /\.vt-studio-split-stepper-actions button:focus-visible\s*\{\s*outline:\s*3px solid/)
  const splitStart = component.indexOf("export const StudioSplitStepper")
  const splitEnd = component.indexOf("/** Closeable metadata badge", splitStart)
  const splitStepper = component.slice(splitStart, splitEnd)
  assert.doesNotMatch(splitStepper, /<StudioUsernameInput|<StudioSplitLeftButton/)
  assert.match(splitStepper, /rightRailContent=/)
  assert.match(splitStepper, /className="vt-studio-split-stepper-rail"/)
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

test("split stepper enforces the 2:1 value-to-rail ratio after legacy CSS and keeps the action divider", () => {
  assert.match(styles, /html body \[data-vt-studio-control="true"\]\[data-vt-studio-split="right"\]\.vt-studio-split-stepper\s*\{[^}]*grid-template-columns:\s*minmax\(0, 2fr\) minmax\(0, 1fr\) !important/s)
  assert.match(styles, /html body \.vt-studio-split-stepper \.vt-studio-split-stepper-actions > button:first-child\s*\{[^}]*border-bottom:\s*var\(--vt-stepper-stroke, 3px\) solid #000 !important/s)
})
