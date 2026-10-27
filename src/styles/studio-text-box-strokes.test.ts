import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const stylesheet = fs.readFileSync(path.resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
const textBoxStart = stylesheet.indexOf(".vt-studio-text-box[data-vt-studio-control=\"true\"] {")
const textBoxEnd = stylesheet.indexOf("\n.vt-studio-text-box[data-vt-studio-control=\"true\"][data-size=\"compact\"]", textBoxStart)
const textBoxBlock = stylesheet.slice(textBoxStart, textBoxEnd)

describe("StudioTextBox default stroke contract", () => {
 it("derives a half-width stroke from the selected size token without changing the token", () => {
  expect(textBoxBlock).toContain("--field-border-width: var(--vt-studio-control-stroke, 3px);")
  expect(textBoxBlock).toContain("--studio-text-box-stroke-width: calc(var(--field-border-width) * 0.5);")
  expect(textBoxBlock).toContain("border: var(--studio-text-box-stroke-width) solid #000")
  expect(textBoxBlock).toContain("box-shadow: inset 0 0 0 var(--studio-text-box-stroke-width)")
  expect(textBoxBlock).toContain("outline: var(--studio-text-box-stroke-width) solid var(--vt-field-secondary")
  expect(textBoxBlock).toContain("outline-offset: 0")
  expect(textBoxBlock).not.toContain("--vt-studio-control-stroke:")
 })

 it("keeps the 50% fill and black text across all size variants", () => {
  expect(textBoxBlock).toContain("var(--vt-studio-control-default-fill-opacity, 50%)")
  expect(textBoxBlock).toContain("color: #000")
  expect(textBoxBlock).toContain("-webkit-text-fill-color: #000")
  expect(stylesheet).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="compact"]')
  expect(stylesheet).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="micro"]')
  expect(stylesheet).toContain('-webkit-text-stroke: var(--vt-studio-control-text-stroke, .5px) #000;')
  expect(stylesheet).toContain('-webkit-text-stroke: var(--vt-studio-control-text-stroke, .25px) #000;')
  expect(textBoxBlock).toContain("line-height: var(--textarea-description-line-height, 0.75);")
 })
})


const finalOverrides = fs.readFileSync(path.resolve(process.cwd(), "src/styles/studio-control-distill-overrides.css"), "utf8")

describe("TextBox and side-toggle visual exceptions", () => {
 it("keeps read-only TextBox glyph fill and stroke black while preserving its secondary outline", () => {
  const start = finalOverrides.indexOf("/* Read-only TextBox intentionally keeps black text and black glyph stroke.")
  const end = finalOverrides.indexOf("/* Side and double-side toggle faces", start)
  const block = finalOverrides.slice(start, end)
  expect(block).toContain("color: #000 !important")
  expect(block).toContain("-webkit-text-fill-color: #000 !important")
  expect(block).toContain("-webkit-text-stroke-color: #000 !important")
  expect(block).toContain("text-stroke: var(--vt-studio-control-text-stroke, 1px) #000 !important")
  expect(block).not.toContain("outline:")
 })

 it("uses solid primary faces and secondary arrow cells for side and double-side toggles", () => {
  const start = finalOverrides.indexOf("/* Side and double-side toggle faces")
  const block = finalOverrides.slice(start)
  expect(block).toContain(".vt-studio-value-toggle--side .vt-studio-value-toggle__face")
  expect(block).toContain(".vt-studio-value-toggle--double .vt-studio-value-toggle__face")
  expect(block).toContain("background: var(--vt-studio-control-accent, var(--pair-a, #36e0f6)) !important")
  expect(block).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b)) !important")
  expect(block).toContain(".vt-studio-value-toggle--double .vt-studio-value-toggle__arrow svg")
 })
})
