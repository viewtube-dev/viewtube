import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const css = readFileSync("src/styles/studio-control-motion.css", "utf8")
const entry = readFileSync("src/studio-ui/index.ts", "utf8")

test("Studio selection controls animate only their inner state", () => {
  for (const selector of [
    ".vt-studio-44-switch .vt-studio-44-handle",
    ".vt-studio-44-choice .vt-studio-44-dot",
    ".vt-studio-44-choice.is-checkbox svg",
    ".vt-studio-44-word-handle",
  ]) {
    assert.ok(css.includes(selector), `missing state-motion selector: ${selector}`)
  }
  assert.match(css, /background-color\s+180ms/)
  assert.match(css, /transform\s+220ms/)
  assert.match(css, /stroke-dashoffset\s+220ms/)
})

test("floating labels and field feedback have transitions", () => {
  assert.ok(css.includes(".vt-studio-floating-field > .vt-studio-floating-field-label"))
  assert.ok(css.includes(".vt-studio-floating-field > :is(input, textarea)"))
  assert.match(css, /top\s+180ms/)
  assert.match(css, /border-color\s+180ms/)
})

test("reduced-motion users receive no motion from the restored controls", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"))
  assert.match(reduced, /transition:\s*none\s*!important/)
  assert.match(reduced, /animation:\s*none\s*!important/)
  for (const selector of [
    ".vt-studio-44-switch",
    ".vt-studio-44-word-handle",
    ".vt-studio-floating-field > :is(input, textarea)",
  ]) {
    assert.ok(reduced.includes(selector), `reduced-motion rules omit ${selector}`)
  }
})

test("motion stylesheet loads after the canonical Studio control stylesheet", () => {
  const baseIndex = entry.indexOf('import "../styles/studio-control-system.css"')
  const motionIndex = entry.indexOf('import "../styles/studio-control-motion.css"')
  assert.ok(baseIndex >= 0, "canonical stylesheet import must exist")
  assert.ok(motionIndex > baseIndex, "motion stylesheet must load after canonical styles")
})

test("restored motion does not add shell movement or shadow effects", () => {
  assert.doesNotMatch(css, /button\[data-vt-studio-button=.*?:hover/)
  assert.doesNotMatch(css, /box-shadow\s*:/)
  assert.doesNotMatch(css, /translate\s*:/)
})
