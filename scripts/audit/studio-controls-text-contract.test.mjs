import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const read = (path) => readFileSync(resolve(process.cwd(), path), "utf8")

const coreCss = read("src/styles/studio-control-core.css")
const systemCss = read("src/styles/studio-control-system.css")
const overridesCss = read("src/styles/studio-control-distill-overrides.css")
const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

const blockFor = (source, selector) => {
  const start = source.indexOf(selector)
  assert.notEqual(start, -1, "Expected selector: " + selector)
  const open = source.indexOf("{", start)
  assert.notEqual(open, -1, "Expected opening brace for: " + selector)
  let depth = 0
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1
    if (source[i] === "}") depth -= 1
    if (depth === 0) return source.slice(open + 1, i)
  }
  assert.fail("Unclosed CSS block for: " + selector)
}

test("Studio button labels use the shared clipped-text default, never ellipsis", () => {
  assert.match(coreCss, /\[data-vt-studio-button-face\]/)
  assert.match(coreCss, /text-overflow:\s*clip/)
  assert.doesNotMatch(coreCss, /text-overflow:\s*ellipsis/i)
  assert.doesNotMatch(overridesCss, /text-overflow:\s*ellipsis/i)
})

test("StudioTextBox uses black glyphs, a primary inset stroke, and a secondary outline", () => {
  const textBox = blockFor(systemCss, '.vt-studio-text-box[data-vt-studio-control="true"]')
  assert.match(textBox, /-webkit-text-stroke:\s*var\(--vt-studio-control-text-stroke, 1px\) #000/)
  assert.match(textBox, /box-shadow:\s*inset 0 0 0 var\(--vt-studio-control-stroke, 3px\) var\(--vt-field-primary/)
  assert.match(textBox, /outline:\s*calc\(var\(--vt-studio-control-stroke, 3px\) \* var\(--vt-studio-focus-outline-width-ratio, \.65\)\) solid var\(--vt-field-secondary/)
  const finalRuleStart = systemCss.lastIndexOf('.vt-studio-text-box[data-vt-studio-control="true"] {')
  const finalTextBox = blockFor(systemCss.slice(finalRuleStart), '.vt-studio-text-box[data-vt-studio-control="true"]')
  assert.match(finalTextBox, /-webkit-text-stroke-color:\s*#000/)
  assert.match(finalTextBox, /box-shadow:\s*inset 0 0 0 var\(--vt-studio-control-stroke, 3px\) var\(--vt-field-primary/)
  for (const tier of ["supreme", "compact", "mini", "micro"]) {
    const tierRule = blockFor(systemCss, `.vt-studio-text-box[data-vt-studio-control="true"][data-size="${tier}"]`)
    assert.match(tierRule, /-webkit-text-stroke:[^;]*#000/)
  }
})

test("focused textarea keeps a secondary outline without a primary focus text stroke", () => {
  const fieldDefaults = blockFor(systemCss, '[data-vt-studio-control] {')
  assert.match(fieldDefaults, /--vt-field-focus-outline:[^;]*var\(--vt-studio-control-secondary/)
  const focusedFields = blockFor(overridesCss, 'html body textarea[data-vt-studio-control="true"]:is(:focus, :focus-visible)')
  assert.match(focusedFields, /outline:\s*var\(--vt-field-focus-outline\)/)
  assert.doesNotMatch(focusedFields, /-webkit-text-stroke-color:\s*var\(--vt-field-primary/)
})

test("Confirmed Primitive Library documents the canonical text box stroke contract", () => {
  assert.match(catalog, /StudioTextBox/)
  assert.match(catalog, /primary inline stroke/i)
  assert.match(catalog, /secondary focus(?:\/outer)? outline/i)
})
