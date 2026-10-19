import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(path.resolve(process.cwd(), "src/views/CreatorVaultOS.tsx"), "utf8")
const controls = fs.readFileSync(path.resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")

describe("CreatorVaultOS Studio legend dropdown migration", () => {
 it("supports explicit single-selection semantics in the shared primitive", () => {
  expect(controls).toContain('selectionMode?: "single" | "multiple"')
  expect(controls).toContain('if (selectionMode === "single")')
  expect(controls).toContain("setSelected([option.value])")
  expect(controls).toContain("setOpen(false)")
 })
 it("uses StudioLegendMultiDropdown for Sort, View, and State", () => {
  expect(source).toContain('import { StudioLegendMultiDropdown, StudioTextBox } from "../studio-ui/primitives/StudioControls"')
  expect(source.match(/<StudioLegendMultiDropdown/g)).toHaveLength(3)
  for (const label of ["Sort", "View", "State"]) {
   expect(source).toContain(`label="${label}"`)
  }
  expect(source).not.toMatch(/<SubToolboxDropdownControl\s+label="(?:Sort|View|State)"/)
 })

 it("preserves each dropdown's single-selection behavior and original option values", () => {
  expect(source).toContain('options={["updated-desc", "updated-asc", "name-asc", "name-desc"].map((option) => ({ value: option, label: option.toUpperCase() }))}')
  expect(source).toContain('options={["grid", "masonry", "list", "filmstrip", "lineage"].map((option) => ({ value: option, label: option.toUpperCase() }))}')
  expect(source).toContain('options={["active", "recent", "generated", "inbox", "favorites", "archive", "trash"].map((option) => ({ value: option, label: option.toUpperCase() }))}')
  expect(source.match(/value=\{\[(?:sort|viewMode|special)\]\}/g)).toHaveLength(3)
  expect(source.match(/selectionMode="single"/g)).toHaveLength(3)
  expect(source.match(/const next = values\[0\]/g)).toHaveLength(3)
 })
})
