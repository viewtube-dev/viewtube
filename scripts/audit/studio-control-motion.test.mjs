import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const css = readFileSync("src/styles/studio-control-motion.css", "utf8")
const system = readFileSync("src/styles/studio-control-system.css", "utf8")
const entry = readFileSync("src/studio-ui/index.ts", "utf8")

test("Studio selection controls animate only their inner state", () => {
  for (const selector of [
    ".vt-studio-44-switch .vt-studio-44-handle",
    ".vt-studio-44-choice .vt-studio-44-dot",
    ".vt-studio-44-choice.is-checkbox svg",
    ".vt-studio-44-choice.is-checkbox svg path",
    ".vt-studio-44-word-handle",
  ]) {
    assert.ok(css.includes(selector), `missing state-motion selector: ${selector}`)
  }
  assert.match(css, /background-color\s+180ms/)
  assert.match(css, /transform\s+220ms/)
  assert.match(css, /stroke-dashoffset\s+220ms/)
})

test("flat-shell policy does not suppress inner field motion or inline strokes", () => {
  assert.doesNotMatch(system, /\[data-vt-studio-control="true"\]:is\(input, textarea, select\)/)
  const shellPolicyStart = system.indexOf("/* Global shell policy:")
  const shellPolicyEnd = system.indexOf("\n}", shellPolicyStart)
  assert.ok(shellPolicyStart >= 0 && shellPolicyEnd > shellPolicyStart)
  const shellPolicy = system.slice(shellPolicyStart, shellPolicyEnd)
  assert.doesNotMatch(shellPolicy, /transition:\s*none\s*!important/)
  assert.doesNotMatch(shellPolicy, /\[data-vt-studio-control\]\s*\*/)
  assert.ok(shellPolicy.includes("[data-vt-studio-control]:not(input):not(textarea):not(select)"), "field controls must be excluded from flat-shell shadow suppression")
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

test("the canonical Studio stylesheet entry imports all layers in dependency order", () => {
  const entryCss = readFileSync("src/styles/studio-control-entry.css", "utf8")
  const expected = [
    '@import "./studio-control-system.css";',
    '@import "./studio-control-vars.generated.css";',
    '@import "./studio-control-core.css";',
    '@import "./studio-control-split.css";',
    '@import "./studio-control-fields.css";',
    '@import "./studio-control-motion.css";',
  ]
  const positions = expected.map((statement) => entryCss.indexOf(statement))
  assert.ok(positions.every((position) => position >= 0), "all canonical Studio stylesheets must be imported")
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), "Studio CSS must preserve system → tokens → core → split → fields → motion order")
  assert.ok(entry.includes('import "../styles/studio-control-entry.css"'), "Studio library index must use the canonical stylesheet entry")
  assert.ok(readFileSync("src/studio-ui/primitives/StudioTextInput.tsx", "utf8").includes('import "../../styles/studio-control-entry.css"'))
  assert.ok(readFileSync("src/studio-ui/primitives/StudioTextArea.tsx", "utf8").includes('import "../../styles/studio-control-entry.css"'))
})

test("restored motion does not add shell movement or shadow effects", () => {
  assert.doesNotMatch(css, /button\[data-vt-studio-button=.*?:hover/)
  assert.doesNotMatch(css, /box-shadow\s*:/)
  assert.doesNotMatch(css, /translate\s*:/)
})


test("focus mode fades out using the token-owned 500ms outline duration", () => {
  const tokens = readFileSync("src/studio-ui/tokens.ts", "utf8")
  const generated = readFileSync("src/styles/studio-control-vars.generated.css", "utf8")
  assert.match(tokens, /focusTransitionMs:\s*500/)
  assert.match(tokens, /outlineFadeMs:\s*500/)
  assert.match(generated, /--vt-studio-focus-outline-fade-ms:\s*500ms/)
  assert.match(system, /outline-color\s+var\(--vt-studio-focus-outline-fade-ms\)\s+ease-out/)
  assert.match(system, /outline-width\s+var\(--vt-studio-focus-outline-fade-ms\)\s+ease-out/)
});

test("bar percentage tooltip is exposed on hover and keyboard focus", () => {
  const distill = readFileSync("src/styles/studio-control-distill-overrides.css", "utf8")
  assert.match(distill, /\.vt-studio-split-shell\.vt-studio-value-toggle--bar:is\(:hover,\s*:focus-within\)\s+\.vt-studio-value-toggle__bar-tooltip/)
});
