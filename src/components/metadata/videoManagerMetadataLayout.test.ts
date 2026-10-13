import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("Video Manager metadata layout contract", () => {
  it("renders canonical metadata before Publishing Controls", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager.indexOf("<CanonicalMetadataSections")).toBeLessThan(manager.indexOf("<PublishingControls"))
  })

  it("uses a responsive three-button row for metadata actions", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    const styles = read("src/styles/subtoolbox-system.css")
    expect(metadata).toContain('<SubToolboxActions columns={3} className="vt-metadata-field-actions mt-2">')
    expect(metadata).not.toContain('<SubToolboxActions columns={3} forceRow')
    expect(metadata).toContain('componentLevel="l1"')
    expect(metadata).toContain('"--vt-component-height": "44px"')
    expect(styles).toContain(".vt-metadata-field-actions{")
    expect(styles).toContain("--vt-component-stroke:3px!important")
    expect(styles).toContain(".vt-metadata-field-actions{grid-template-columns:minmax(0,1fr)}")
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


  it("keeps metadata field actions visible without a show/hide header toggle", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    const publisher = read("src/views/VideoPublisher.tsx")
    const manager = read("src/views/VideoManager.tsx")
    expect(metadata).toContain("showFieldActions?: boolean")
    expect(metadata).toContain("showFieldActions = true")
    expect(metadata).toContain("showFieldActions && (!actionFields || actionFields.includes(field))")
    expect(publisher).toContain("showFieldActions={true}")
    expect(manager).toContain("showFieldActions={true}")
    expect(publisher).not.toContain('label: "Show Actions"')
    expect(publisher).not.toContain('label: "Hide Actions"')
    expect(manager).not.toContain('label: "Show Actions"')
    expect(manager).not.toContain('label: "Hide Actions"')
  })

  it("exports the shared YouTube category options imported by Publisher and Manager", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain("export const YOUTUBE_CATEGORY_OPTIONS = [")
    expect(metadata).toContain('{ value: "27", label: "Education" }')
    expect(metadata).toContain('{ value: "22", label: "People & Blogs" }')
    expect(metadata).toContain('{ value: "28", label: "Science & Technology" }')
  })


  it("keeps Manager and Publisher mode toggles inside the shared toolbox header", () => {
    const toolbox = read("src/components/Toolbox.tsx")
    const manager = read("src/views/VideoManager.tsx")
    const publisher = read("src/views/VideoPublisher.tsx")
    expect(toolbox).toContain('headerActionsPlacement?: "header" | "below"')
    expect(toolbox).toContain('headerActionsPlacement === "below"')
    expect(manager).toContain('headerActionsPlacement="header"')
    expect(publisher).toContain('headerActionsPlacement="header"')
    expect(manager).toContain('label: "Manage"')
    expect(manager).toContain('label: "Generate"')
    expect(publisher).toContain('{ value: "write", label: "Write" }')
    expect(publisher).toContain('{ value: "create", label: "Create / Generate" }')
    expect(publisher).toContain('media.duration < 180')
    expect(publisher).toContain('media.videoHeight >= media.videoWidth')
  })

  it("uses the intrinsic-width word-toggle primitive with a pink selected handle", () => {
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    const styles = read("src/styles/subtoolbox-system.css")
    expect(primitives).toContain('data-vt-header-toggle-primitive="word-toggle"')
    expect(primitives).toContain("has-noninitial-selection")
    expect(primitives).toContain("aria-pressed={option.value === value}")
    expect(styles).toContain(".vt-toolbox-header-toggle.is-word-toggle")
    expect(styles).toContain(".vt-toolbox-header-toggle.is-word-toggle.has-noninitial-selection .vt-word-toggle-handle{background:var(--pair-b,#f276c5)}")
    expect(styles).toContain("@media(max-width:767px)")
  })


  it("keeps mode toggles inline in the colored header and uses the owning toolbox palette pair", () => {
    const toolbox = read("src/components/Toolbox.tsx")
    const styles = read("src/styles/toolbox-system.css")
    const primitiveStyles = read("src/styles/subtoolbox-system.css")
    expect(toolbox).toContain('headerActionsPlacement === "header" ? "is-header-placement" : ""')
    expect(toolbox).toContain('vt-toolbox-header-secondary-actions is-mobile-header-fallback')
    expect(toolbox).toContain('["--pair-a" as string]: palette.header')
    expect(toolbox).toContain('["--pair-b" as string]: palette.icon')
    expect(styles).toContain('.vt-toolbox-header-extras.is-header-placement')
    expect(styles).toContain('display: flex !important;')
    expect(styles).toContain('.vt-toolbox-header-secondary-actions')
    expect(styles).toContain('display: none !important;')
    expect(primitiveStyles).toContain('background:color-mix(in srgb,var(--pair-a,#20f13e) 55%,transparent)')
    expect(primitiveStyles).toContain('background:var(--pair-b,#f276c5)')
  })

})


describe("Video Manager published-video boundary", () => {
  it("describes management of published videos instead of upload or concept creation", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager).toContain('const subtitleBase = "Manage your published YouTube videos')
    expect(manager).not.toContain('const subtitleBase = "Generate titles, descriptions, tags')
    expect(manager).not.toContain('const subtitleAdditions = ["If you don\'t have a video just upload a script!"')
    expect(manager).not.toContain('const subtitleButtonLabels = ["don\'t have a video?"')
  })
})
