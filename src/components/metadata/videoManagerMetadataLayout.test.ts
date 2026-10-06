import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

describe("Video Manager metadata layout contract", () => {
  const source = fs.readFileSync(path.resolve(process.cwd(), "src/components/metadata/CanonicalMetadataSections.tsx"), "utf8")

  it("uses the canonical labeled primitives without duplicate section labels", () => {
    expect(source).toContain("<SubToolboxLabeledInput overlayLabel={titleLabel}")
    expect(source).toContain("<SubToolboxLabeledTextArea overlayLabel={descriptionLabel}")
    expect(source).not.toContain('<SubToolboxSection label="TITLE">')
    expect(source).not.toContain('<SubToolboxSection label="DESCRIPTION">')
    expect(source.match(/<SubToolboxLabeledTextArea overlayLabel=\{descriptionLabel\}/g)?.length).toBe(1)
  })

  it("uses the canonical tag editor primitive and keeps ranked tags", () => {
    expect(source).toContain("<SubToolboxTagEditor")
    expect(source).toContain("renderTag={(tag, remove) =>")
    expect(source).toContain("addIcon={<Plus size={15} />}")
    expect(source).toContain("<TagRankTag")
  })

  it("keeps Generate, Refine, and Analyze in one three-column action row", () => {
    expect(source).toContain('<SubToolboxActions columns={3} className="mt-2">')
    expect(source).toContain("GENERATE")
    expect(source).toContain("REFINE")
    expect(source).toContain("ANALYZE")
  })
})
