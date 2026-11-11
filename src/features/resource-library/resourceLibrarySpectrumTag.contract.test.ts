import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Resource Library Spectrum Tag contract", () => {
  it("keeps the donor-exact 15px tag and exposes a proportional 20px bracket", () => {
    const component = read("src/studio-ui/primitives/StudioControls.tsx")
    const styles = read("src/styles/studio-control-system.css")
    expect(component).toContain('size?: "15px" | "20px"')
    expect(component).toContain('size === "20px" && "is-20px"')
    expect(styles).toContain("height: 20px")
    expect(styles).toContain("border-width: 2.6667px")
    expect(styles).toContain("border-radius: 5.3333px")
    expect(styles).toContain("font-size: 10.6667px")
  })

  it("renders resource title metadata and topic tags with StudioSpectrumTag", () => {
    const renderer = read("src/features/resource-library/ResourceDocumentRenderer.tsx")
    expect(renderer).toContain('import { StudioSpectrumTag } from "../../studio-ui"')
    expect(renderer).toContain('selected size="20px"')
    expect(renderer).toContain('spectrumKey={tag} size="15px"')
    expect(renderer).not.toContain("<span key={tag}>{tag}</span>")
  })

  it("lists every previously missing production component in the direct representative module", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    for (const component of [
      "StudioSideTextCounter",
      "StudioCalendarEventChip",
      "StudioCalendarMultiDayBar",
      "StudioCalendarThumbnailEventChip",
      "StudioCalendarMediaRail",
      "StudioChatComposerDock",
      "StudioPublishingCard",
      "ResourceLibrarySplitButton",
    ]) {
      expect(catalog).toContain(`data-vt-library-component="${component}"`)
    }
  })
})
