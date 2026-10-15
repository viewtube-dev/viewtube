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

test("floating labels preserve input-area typography and animate to 80% size with a 40% border overlap", () => {
  const floatingBlock = studioCss.slice(
    studioCss.indexOf("/* Shared floating-label fields"),
    studioCss.indexOf("/* Permanent label-box variants"),
  )
  assert.match(floatingBlock, /transition:[^;]*font-size/)
  assert.match(floatingBlock, /font-size:\s*calc\(var\(--vt-studio-floating-label-size\)\s*\*\s*\.8\)/)
  assert.match(floatingBlock, /transform:translateY\(-60%\)/)
  assert.doesNotMatch(floatingBlock, /transform:translateY\(-75%\)\s*scale\(\.75\)/)
  assert.match(floatingBlock, /padding:\s*2\.25px\s+4\.5px/)
})

test("floating-label variant B matches the focus stroke color and width for standard and compact inputs", () => {
  const floatingBlock = studioCss.slice(
    studioCss.indexOf("/* Shared floating-label fields"),
    studioCss.indexOf("/* Permanent label-box variants"),
  )
  assert.match(floatingBlock, /data-vt-floating-variant="b"[^{}]*:is\(:focus, :focus-visible\)/)
  assert.match(floatingBlock, /:is\(:focus, :focus-visible\) \+ \.vt-studio-floating-field-label/)
  assert.doesNotMatch(floatingBlock, /data-vt-floating-variant="b"[^{}]*\[data-size="compact"\]/)
  assert.match(floatingBlock, /outline:\s*var\(--vt-studio-control-focus-outline-width,\s*3px\) solid var\(--vt-studio-control-secondary/)
  assert.match(floatingBlock, /outline-offset:\s*0/)
})

test("circle icon buttons render icons at 80% of their canonical icon dimensions", () => {
  assert.match(studioCss, /button\[data-vt-studio-circle-icon-button="true"\][^{}]*\[data-vt-studio-button-icon\]\s+svg\s*\{[^}]*width:\s*calc\(var\(--vt-studio-control-icon-size,\s*28px\)\s*\*\s*\.8\)[^}]*height:\s*calc\(var\(--vt-studio-control-icon-size,\s*28px\)\s*\*\s*\.8\)/s)
})
