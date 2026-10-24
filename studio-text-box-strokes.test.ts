import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const stylesheet = fs.readFileSync(path.resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
const textBoxStart = stylesheet.indexOf(".vt-studio-text-box[data-vt-studio-control=\"true\"] {")
const textBoxEnd = stylesheet.indexOf("\n.vt-studio-text-box[data-vt-studio-control=\"true\"][data-size=\"compact\"]", textBoxStart)
const textBoxBlock = stylesheet.slice(textBoxStart, textBoxEnd)

describe("StudioTextBox default stroke contract", () => {
 it("sources border, outline, and letterform strokes from the shared text-field tokens", () => {
  expect(textBoxBlock).toContain("--studio-text-box-stroke-width: var(--vt-studio-control-stroke, 3px);")
  expect(textBoxBlock).toContain("--studio-text-box-text-stroke-width: var(--vt-studio-control-text-stroke, 1px);")
  expect(textBoxBlock).toContain("border: var(--studio-text-box-stroke-width) solid #000")
  expect(textBoxBlock).toContain("box-shadow: none")
  expect(textBoxBlock).toContain("outline: var(--studio-text-box-stroke-width) solid var(--vt-field-secondary")
  expect(textBoxBlock).toContain("outline-offset: 0")
  expect(textBoxBlock).not.toContain("--vt-studio-control-stroke:")
 })

 it("keeps the 50% fill, black text, and primary inline stroke across all size variants", () => {
  expect(textBoxBlock).toContain("var(--vt-studio-control-default-fill-opacity, 50%)")
  expect(textBoxBlock).toContain("color: #000")
  expect(textBoxBlock).toContain("-webkit-text-fill-color: #000")
  expect(textBoxBlock).toContain("-webkit-text-stroke: var(--studio-text-box-text-stroke-width) var(--vt-field-primary")
  expect(stylesheet).toContain('.vt-studio-text-box[data-vt-studio-control="true"]::before')
  expect(stylesheet).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="compact"]')
  expect(stylesheet).toContain('.vt-studio-text-box[data-vt-studio-control="true"][data-size="micro"]')
  expect(textBoxBlock).toContain("line-height: var(--textarea-description-line-height, 1);")
 })
})
