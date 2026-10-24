import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const globalCss = await readFile(new URL("../../src/index.css", import.meta.url), "utf8")
const studioCss = await readFile(new URL("../../src/styles/studio-control-system.css", import.meta.url), "utf8")
const fieldsCss = await readFile(new URL("../../src/styles/studio-control-fields.css", import.meta.url), "utf8")
const inputCss = await readFile(new URL("../../src/styles/studio-text-input.css", import.meta.url), "utf8")

test("global field normalization excludes canonical Studio fields in every state", () => {
  const globalFieldBlock = globalCss.slice(
    globalCss.indexOf("/* Global field normalization"),
    globalCss.indexOf("/* Chart interior hard isolation"),
  )
  assert.match(globalFieldBlock, /:not\(\[data-vt-studio-control="true"\]\)/)
  assert.match(globalFieldBlock, /:focus/)
  assert.match(globalFieldBlock, /::placeholder/)
})

test("Studio fields own their fill, caret, border, inset stroke, and secondary focus treatment", () => {
  const fieldBlock = fieldsCss
  assert.match(fieldBlock, /border:\s*var\(--vt-studio-control-stroke, 3px\) solid #000/)
  assert.match(fieldBlock, /caret-color:\s*var\(--vt-field-primary/)
  assert.match(fieldBlock, /background:\s*color-mix\(in srgb, var\(--vt-field-primary\)/)
  assert.match(fieldBlock, /outline:\s*calc\(var\(--vt-studio-control-stroke, 3px\) \* var\(--vt-studio-focus-outline-width-ratio, \.65\)\) solid var\(--vt-field-secondary/)
  assert.match(fieldBlock, /inset 0 0 0 var\(--vt-field-inline-width\)/)
  assert.match(inputCss, /height:\s*var\(--vt-studio-standard-height, 44px\)/)
  assert.match(inputCss, /height:\s*var\(--vt-studio-compact-height, 28px\)/)
})

test("rounded switches and choice controls are excluded from generic button appearance", () => {
  const genericButtonRule = studioCss.slice(
    studioCss.indexOf("button[data-vt-studio-control]:not(.vt-studio-legend-trigger)"),
    studioCss.indexOf("[data-vt-studio-button-icon]"),
  )
  assert.match(genericButtonRule, /:not\(\.vt-studio-44-switch\)/)
  assert.match(genericButtonRule, /:not\(\.vt-studio-44-choice\)/)
  assert.match(studioCss, /button\.vt-studio-44-choice\.is-round\s*\{\s*border-radius:\s*50%/)
  assert.match(studioCss, /button\.vt-studio-44-switch\.is-round\s*\{\s*border-radius:\s*999px/)
})

test("button faces use the solid primary color and stay flat and stationary", () => {
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*\{[^}]*box-shadow:\s*none/s)
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*>\s*\[data-vt-studio-button-face\]\s*\{[^}]*background:\s*var\(--vt-studio-control-accent/s)
  assert.match(studioCss, /Canonical button-only default effects[\s\S]*?box-shadow:\s*none/)
})

test("textarea typography inherits input size tiers and uses the shared multiline line-height token", () => {
  const textareaBlock = studioCss.slice(
    studioCss.indexOf('textarea[data-vt-studio-control="true"][data-vt-studio-field-kind="textarea"] {'),
    studioCss.indexOf("/* Vertical toolbox header toggles"),
  )
  assert.match(textareaBlock, /line-height:\s*var\(--vt-studio-textarea-line-height, 1\)/)
  assert.doesNotMatch(textareaBlock, /vt-studio-textarea-(?:standard|compact)-(?:font-size|text-stroke|line-height)/)
  assert.match(fieldsCss, /textarea[\s\S]*?background-color:\s*color-mix\(in srgb, var\(--vt-field-primary[\s\S]*?15%, transparent\)/)
  assert.match(fieldsCss, /font-size:\s*var\(--vt-studio-textarea-standard-font-size, 18px\)/)
})
