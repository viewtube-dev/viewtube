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

test("StudioTextBox uses primary ink for its inline text stroke without a shadow", () => {
  const textBox = blockFor(systemCss, '.vt-studio-text-box[data-vt-studio-control="true"]')
  assert.match(textBox, /-webkit-text-stroke:\s*var\(--studio-text-box-text-stroke-width\)\s*var\(--vt-field-primary/)
  assert.match(textBox, /box-shadow:\s*none/)
  assert.doesNotMatch(textBox, /-webkit-text-stroke:\s*var\(--studio-text-box-text-stroke-width\)\s*#000/i)
  assert.match(systemCss, /\.vt-studio-text-box\[data-vt-studio-control="true"\]::before[\s\S]*?border:\s*var\(--studio-text-box-stroke-width\) solid var\(--vt-field-primary/)
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
