import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const globalCss = await readFile(new URL("../../src/index.css", import.meta.url), "utf8")
const studioCss = await readFile(new URL("../../src/styles/studio-control-system.css", import.meta.url), "utf8")

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
  const fieldBlock = studioCss.slice(
    studioCss.indexOf("/* Canonical text-entry family"),
    studioCss.indexOf("/* 2. Canonical 44px selection-control geometry"),
  )
  assert.match(fieldBlock, /border:\s*var\(--vt-field-stroke\) solid #000/)
  assert.match(fieldBlock, /caret-color:\s*var\(--vt-field-primary\)/)
  assert.match(fieldBlock, /background:\s*color-mix\(in srgb, var\(--vt-field-primary\) var\(--vt-studio-control-default-fill-opacity\), transparent\)/)
  assert.match(fieldBlock, /outline:\s*var\(--vt-field-outline-stroke\) solid var\(--vt-field-secondary\)/)
  assert.match(fieldBlock, /inset 0 0 0 var\(--vt-field-stroke\) var\(--vt-field-primary\)/)
  assert.match(fieldBlock, /min-height:\s*var\(--vt-studio-44-height\)/)
  assert.match(fieldBlock, /min-height:\s*var\(--vt-studio-28-height\)/)
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

test("button faces use the solid primary color and own their aligned shadow", () => {
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*\{[^}]*box-shadow:\s*none/s)
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*>\s*\[data-vt-studio-button-face\]\s*\{[^}]*background:\s*var\(--vt-studio-control-accent/s)
  assert.match(studioCss, /button\[data-vt-studio-button="true"\]\s*>\s*\[data-vt-studio-button-face\]\s*\{[^}]*box-shadow:\s*var\(--vt-studio-control-shadow\)/s)
})
