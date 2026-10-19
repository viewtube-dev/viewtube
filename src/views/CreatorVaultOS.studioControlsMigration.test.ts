import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(path.resolve(process.cwd(), "src/views/CreatorVaultOS.tsx"), "utf8")
const controls = fs.readFileSync(path.resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")

describe("Creator Vault canonical Studio Controls migration", () => {
  it("uses the canonical split-left input and upload frame for Vault search and file intake", () => {
    expect(source).toContain("StudioSplitLeftInput")
    expect(source).toContain("StudioUploadFrame")
    expect(source).toContain("onFilesChange")
    expect(source).not.toContain("SubToolboxSplitField")
    expect(source).not.toContain("SubToolboxFileTarget")
  })

  it("uses single-select semantics for Sort, View, and State", () => {
    expect(source.match(/selectionMode="single"/g)).toHaveLength(3)
    expect(source).toContain('accessibleLabel="Sort assets"')
    expect(source).toContain('accessibleLabel="Vault view"')
    expect(source).toContain('accessibleLabel="Vault state"')
    expect(controls).toContain('selectionMode?: "single" | "multiple"')
    expect(controls).toContain("setSelected([option.value])")
  })
})
