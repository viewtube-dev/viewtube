import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("confirmed Studio button primitive library", () => {
  it("uses real StudioButton and StudioSplitLeftButton exports", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    expect(catalog).toContain("StudioButton,")
    expect(catalog).toContain("StudioSplitLeftButton,")
    expect(catalog).toContain('from "../../studio-ui/primitives/StudioControls"')
    expect(catalog).toContain('title="StudioButton"')
    expect(catalog).toContain('title="StudioSplitLeftButton"')
    expect(catalog).toContain('heightVariant="44"')
    expect(catalog).toContain('heightVariant="28"')
  })

  it("defines matching typography and 44px/28px production variants", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const css = read("src/styles/studio-control-system.css")
    expect(controls).toContain('heightVariant?: "44" | "28"')
    expect(controls).toContain('sizeVariant = "standard"')
    expect(controls).toContain("data-height-variant={resolvedHeight}")
    expect(css).toContain(':has([data-height-variant="28"])')
    expect(css).toContain('font-size: 14px !important')
    expect(css).toContain('button[data-vt-studio-button="true"][data-size="compact"][data-split-left="true"] [data-vt-studio-split-rail]')
  })

  it("mounts a third confirmed-primitives toolbox without changing the other tracks", () => {
    const library = read("src/components/ToolboxUIReferenceLibrary.tsx")
    expect(library).toContain('track="hardcoded"')
    expect(library).toContain('track="primitive"')
    expect(library).toContain('track="confirmed"')
    expect(library).toContain("StudioHubConfirmedPrimitiveCatalog")
  })

  it("documents source paths, token settings and importing files", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    for (const value of [
      "src/studio-ui/primitives/StudioControls.tsx",
      "src/styles/studio-control-system.css",
      "src/components/CommunityPostGenerator.tsx",
      "src/views/VideoDirector.tsx",
      "44px / 28px",
      "3px black stroke",
    ]) expect(catalog).toContain(value)
  })
})
