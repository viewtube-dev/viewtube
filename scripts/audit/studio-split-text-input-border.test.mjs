import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const entryCss = await readFile(new URL("../../src/styles/studio-control-entry.css", import.meta.url), "utf8")
const splitCss = await readFile(new URL("../../src/styles/studio-control-split.css", import.meta.url), "utf8")

test("split text input shell owns one black perimeter and the native field stays borderless", () => {
  const shell = entryCss.slice(entryCss.indexOf(".vt-studio-split-text-input {"), entryCss.indexOf(".vt-studio-split-text-input__field {"))
  const field = entryCss.slice(entryCss.indexOf(".vt-studio-split-text-input__field {"), entryCss.indexOf(".vt-studio-split-text-input:focus-within {"))
  assert.match(shell, /border:\s*var\(--vt-studio-control-stroke,\s*3px\) solid #000/)
  assert.match(field, /border:\s*0 !important/)
  assert.match(field, /box-shadow:\s*none !important/)
  assert.match(splitCss, /\.vt-studio-split-shell\s*\{[\s\S]*?border:\s*var\(--vt-studio-control-stroke,\s*3px\) solid #000/)
})

test("split text input keeps a primary inset stroke without adding a second border box", () => {
  const field = entryCss.slice(entryCss.indexOf(".vt-studio-split-text-input__field {"), entryCss.indexOf(".vt-studio-split-text-input:focus-within {"))
  assert.match(field, /background-image:[\s\S]*linear-gradient\(var\(--vt-field-primary\), var\(--vt-field-primary\)\)/)
  assert.match(field, /background-size:[\s\S]*var\(--vt-studio-control-stroke, 3px\)/)
  assert.match(field, /background-position:\s*top left, bottom left, top right/)
  assert.match(field, /-webkit-text-fill-color:\s*var\(--vt-field-text\)/)
  assert.match(entryCss, /\.vt-studio-split-text-input:focus-within \.vt-studio-split-text-input__field\s*\{[\s\S]*-webkit-text-fill-color:\s*var\(--vt-field-text-focus\)[\s\S]*caret-color:\s*var\(--vt-field-caret-focus\)/)
})
