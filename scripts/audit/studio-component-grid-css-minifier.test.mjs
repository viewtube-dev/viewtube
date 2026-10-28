import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const gridCss = readFileSync("src/styles/studio-component-grid.css", "utf8")

test("component grid CSS never uses custom properties inside nth-child An+B selectors", () => {
  assert.doesNotMatch(
    gridCss,
    /:nth-(?:last-)?child\([^{}]*\bvar\s*\(/,
    "CSS custom properties cannot parameterize the An+B selector grammar and break Lightning CSS minification",
  )
})

test("component grid creates single-stroke dividers with the parent gap", () => {
  assert.match(gridCss, /\.vt-studio-component-grid\s*\{[^}]*gap:\s*var\(--scg-gap\);/s)
  assert.match(gridCss, /\.vt-studio-component-grid\s*\{[^}]*--scg-gap:\s*var\(--scg-stroke\);/s)
  assert.match(gridCss, /\.vt-studio-component-grid\s*\{[^}]*background-color:\s*#000;/s)
  assert.match(gridCss, /\.vt-studio-component-grid\s*\{[^}]*border:\s*var\(--scg-stroke\) solid #000;/s)
  assert.match(gridCss, /\.vt-studio-component-grid__cell\s*\{[^}]*margin:\s*0;[^}]*padding:\s*0;[^}]*background-color:\s*#fff;/s)
  assert.match(gridCss, /\.vt-studio-component-grid__cell\s*>\s*\*\s*\{[^}]*border:\s*none\s*!important;/s)
  assert.match(gridCss, /\.vt-studio-component-grid__cell\s*>\s*\*\s*\{[^}]*border-radius:\s*0\s*!important;/s)
  assert.match(gridCss, /\.vt-studio-component-grid\[data-size\]\s+\.vt-studio-value-toggle--double\s*\{[^}]*border:\s*none\s*!important;[^}]*border-radius:\s*0\s*!important;/s)
})
