import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("Video Manager metadata layout contract", () => {
  it("renders canonical metadata before Publishing Controls", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager.indexOf("<CanonicalMetadataSections")).toBeLessThan(manager.indexOf("<PublishingControls"))
  })

  it("uses a forced three-button row for metadata actions", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain('<SubToolboxActions columns={3} forceRow')
  })

  it("uses the canonical thumbnail overlay label", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain('overlayLabel={thumbnailLabel}')
  })

  it("does not contain escaped newline text in the Manager JSX", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager).not.toContain("<ProjectManifestation\\n")
  })
})
