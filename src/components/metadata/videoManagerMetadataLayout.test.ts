import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("Video Manager metadata layout contract", () => {
  it("uses the canonical metadata component as the single Manager controls surface", () => {
    const manager = read("src/views/VideoManager.tsx")
    expect(manager).toContain("<CanonicalMetadataSections")
    expect(manager).not.toContain("<PublishingControls")
    expect(manager).toContain("playlistOptions={userPlaylists.map")
    expect(manager).toContain("selectedPlaylistIds={selectedPlaylistIds}")
  })

  it("maps channel playlists, category dropdowns, and audience semantics in the shared metadata component", () => {
    const metadata = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(metadata).toContain("CHANNEL PLAYLISTS")
    expect(metadata).toContain("YOUTUBE_CATEGORY_OPTIONS")
    expect(metadata).toContain("IS IT MADE FOR KIDS?")
    expect(metadata).toContain("AI USE")
    expect(metadata).toContain("locationSuggestions.map")
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
})
