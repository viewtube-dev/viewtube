import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("canonical Studio split-left button ownership", () => {
  it("uses StudioSplitLeftButton for metadata Generate/Refine/Analyze", () => {
    const source = read("src/components/metadata/CanonicalMetadataSections.tsx")
    expect(source).toContain('import { StudioSplitLeftButton } from "../../studio-ui"')
    expect(source).toContain("<StudioSplitLeftButton")
    expect(source).not.toContain("<SplitLeftButton")
    expect(source).not.toContain('from "../subtoolbox/SubToolboxSplitPrimitives"')
  })

  it("uses StudioSplitLeftButton for Video Manager Load/Refresh", () => {
    const source = read("src/views/VideoManager.tsx")
    expect(source).toContain('import { StudioSplitLeftButton } from "../studio-ui"')
    expect(source).toContain("<StudioSplitLeftButton")
    expect(source).not.toContain('tone="ink"')
  })

  it("uses StudioSplitLeftButton for Post Workspace type choices", () => {
    const source = read("src/components/CommunityPostGenerator.tsx")
    expect(source).toContain("StudioSplitLeftButton")
    expect(source).not.toContain("<SplitLeftButton")
  })

  it("defaults to the shared action typography scale and prevents stacked split shadows", () => {
    const component = read("src/studio-ui/primitives/StudioControls.tsx")
    const css = read("src/styles/studio-split-left-consistency.css")
    expect(component).toContain('sizeVariant = "action"')
    expect(css).toContain("filter: none !important")
    expect(css).toContain("button.vt-subtoolbox-split-button:active:not(:disabled)")
  })
})
