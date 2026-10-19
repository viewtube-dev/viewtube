import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const stylesheet = fs.readFileSync(path.resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
const textBoxStart = stylesheet.indexOf(".vt-studio-text-box[data-vt-studio-control=\"true\"] {")
const textBoxEnd = stylesheet.indexOf("\n.vt-studio-text-box[data-vt-studio-control=\"true\"][data-size=\"compact\"]", textBoxStart)
const textBoxBlock = stylesheet.slice(textBoxStart, textBoxEnd)

describe("StudioTextBox default stroke contract", () => {
 it("derives a half-width stroke from the selected size token without changing the token", () => {
  expect(textBoxBlock).toContain("--studio-text-box-stroke-width: calc(var(--vt-studio-control-stroke, 3px) * 0.5)")
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
  expect(textBoxBlock).toContain("line-height: var(--vt-studio-textarea-line-height, .85)")
 })
})
