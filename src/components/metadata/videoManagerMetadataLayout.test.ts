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

  it("keeps the colored right-side labels above the field surface", () => {
    const styles = read("src/styles/subtoolbox-system.css")
    expect(styles).toContain(".vt-subtoolbox-labeled-field-overlay{")
    expect(styles).toContain("z-index:3;")
    expect(styles).toContain("padding-right:52%!important;")
    expect(styles).not.toContain(".vt-subtoolbox-labeled-field:focus-within .vt-subtoolbox-labeled-field-overlay{")
  })

  it("uses the canonical thumbnail overlay label", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain('overlayLabel={thumbnailLabel}')
  })

  it("does not contain escaped newline text in the Manager JSX", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager).not.toContain("<ProjectManifestation\\n")
  })
  it("renders publishing fields in the canonical visual order", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    const renderedLayout = metadata.slice(metadata.indexOf("export const CanonicalMetadataSections"))
    const markers = [
      'overlayLabel={titleLabel}',
      'overlayLabel={thumbnailLabel}',
      'placement="pre-description"',
      'overlayLabel={descriptionLabel}',
      'placement="post-description"',
      'PLAYLISTS',
      'placement="post-playlists"',
      'TAGS',
      'label="CATEGORY"',
    ]
    const positions = markers.map(marker => renderedLayout.indexOf(marker))
    expect(positions.every(position => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })


  it("supports a visibility-only global toggle for metadata field actions", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    const publisher = read("src/views/VideoPublisher.tsx")
    const manager = read("src/views/VideoManager.tsx")
    expect(metadata).toContain("showFieldActions?: boolean")
    expect(metadata).toContain("showFieldActions = true")
    expect(metadata).toContain("showFieldActions && (!actionFields || actionFields.includes(field))")
    expect(publisher).toContain('aria-label="Show or hide field actions"')
    expect(publisher).toContain("showFieldActions={showFieldActions}")
    expect(manager).toContain('aria-label="Show or hide field actions"')
    expect(manager).toContain("showFieldActions={showFieldActions}")
  })

  it("exports the shared YouTube category options imported by Publisher and Manager", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain("export const YOUTUBE_CATEGORY_OPTIONS = [")
    expect(metadata).toContain('{ value: "27", label: "Education" }')
    expect(metadata).toContain('{ value: "22", label: "People & Blogs" }')
    expect(metadata).toContain('{ value: "28", label: "Science & Technology" }')
  })

})
