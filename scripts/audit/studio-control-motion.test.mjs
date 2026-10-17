import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const systemCss = readFileSync("src/styles/studio-control-system.css", "utf8")
const motionCss = readFileSync("src/styles/studio-control-motion.css", "utf8")
const css = systemCss + "\n" + motionCss
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
  assert.ok(motionCss.includes(".vt-studio-floating-field > :is(input, textarea)"))
  assert.match(css, /top\s+180ms/)
  assert.match(motionCss, /border-color\s+180ms/)
})

test("reduced-motion users receive no motion from every animated control", () => {
  assert.match(systemCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  assert.match(motionCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  assert.match(systemCss, /transition:\s*none\s*!important/)
  assert.match(motionCss, /transition:\s*none\s*!important/)
  assert.match(systemCss, /\.vt-studio-44-switch[\s\S]*?\.vt-studio-floating-field > \.vt-studio-floating-field-label/)
  assert.match(motionCss, /\.vt-studio-44-word-handle[\s\S]*?\.vt-studio-floating-field > :is\(input, textarea\)/)
  assert.match(systemCss, /animation:\s*none\s*!important/)
  assert.match(motionCss, /animation:\s*none\s*!important/)
})

test("motion stylesheet loads after the canonical Studio control stylesheet", () => {
  const baseIndex = entry.indexOf('import "../styles/studio-control-system.css"')
  const motionIndex = entry.indexOf('import "../styles/studio-control-motion.css"')
  assert.ok(baseIndex >= 0, "canonical stylesheet import must exist")
  assert.ok(motionIndex > baseIndex, "motion stylesheet must load after canonical styles")
})

test("restored motion does not add shell movement or shadow effects", () => {
  assert.doesNotMatch(motionCss, /button\[data-vt-studio-button=.*?:hover/)
  assert.doesNotMatch(motionCss, /box-shadow\s*:/)
  assert.doesNotMatch(motionCss, /translate\s*:/)
})
