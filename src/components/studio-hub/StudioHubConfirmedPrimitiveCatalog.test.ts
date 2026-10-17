import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("confirmed Studio primitive certification catalog", () => {
  it("mounts production primitives from the canonical StudioControls module", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    expect(catalog).toContain('from "../../studio-ui/primitives/StudioControls"')
    for (const primitive of ["StudioButton", "StudioSplitLeftButton", "StudioSplitLeftBadge", "StudioTextInput", "StudioTextArea"]) {
      expect(catalog).toContain(primitive)
    }
    expect(catalog).toContain('title="StudioButton"')
    expect(catalog).toContain('title="StudioSplitLeftButton"')
  })

  it("documents standard, compact, and badge-only micro through the public size contract", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const tokens = read("src/studio-ui/tokens.ts")
    const css = read("src/styles/studio-control-system.css")

    expect(catalog).toContain('title="Split-left Badge · Standard + Compact + Micro"')
    expect(catalog).toContain('sizeVariant="standard"')
    expect(catalog).toContain('sizeVariant="compact"')
    expect(catalog).toContain('sizeVariant="micro"')
    expect(controls).toContain("sizeVariant?: StudioBadgeSize")
    expect(tokens).toContain('micro: { height: 14, stroke: 1, radius: 2, fontSize: 10')
    expect(tokens).toContain('export type StudioBadgeSize = StudioControlSize | "micro"')
    expect(tokens).toContain('export type StudioControlSize = "standard" | "compact"')
    expect(css).toContain('.vt-studio-split-left-badge[data-size="micro"]')
    expect(css).toContain("--vt-studio-badge-height: var(--vt-studio-14-height, 14px)")
    expect(css).toContain("--vt-studio-badge-stroke: var(--vt-studio-14-stroke, 1px)")
    expect(css).toContain("--vt-studio-control-font-size: var(--vt-studio-14-font-size, 10px)")
    expect(css).not.toContain('.vt-studio-split-left-badge:is([data-size="compact"], [data-size="micro"])')
  })

  it("keeps the confirmed track separate from hardcoded and migration-oriented tracks", () => {
    const library = read("src/components/ToolboxUIReferenceLibrary.tsx")
    expect(library).toContain('track="hardcoded"')
    expect(library).toContain('track="primitive"')
    expect(library).toContain('track="confirmed"')
    expect(library).toContain("StudioHubConfirmedPrimitiveCatalog")
  })

  it("discloses production provenance and labels actual global-rule exceptions", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    expect(catalog).toContain('tsx="src/studio-ui/primitives/StudioControls.tsx"')
    expect(catalog).toContain('css="src/styles/studio-control-system.css"')
    expect(catalog).toContain("Global Rules Exceptions · Vault Spectrum Tags")
    expect(catalog).toContain("Global Rules Exceptions · Closeable Badge + Tag Editor")
    expect(controls).toContain("STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS")
  })
})
