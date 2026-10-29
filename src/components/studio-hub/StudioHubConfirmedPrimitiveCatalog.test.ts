import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")
const readStudioControlCss = () => [
  "studio-control-system.css", "studio-control-core.css", "studio-control-split.css", "studio-control-fields.css",
].map((file) => read("src/styles/" + file)).join("\n")

describe("confirmed Studio button primitive library", () => {
  it("uses real StudioButton and StudioSplitLeftButton exports", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    expect(catalog).toContain('import { StudioButton, StudioSplitLeftButton } from "../../studio-ui"')
    expect(catalog).toContain('title="StudioButton"')
    expect(catalog).toContain('title="StudioSplitLeftButton"')
    expect(catalog).toContain('sizeVariant="standard"')
    expect(catalog).toContain('sizeVariant="compact"')
    expect(catalog).not.toContain("heightVariant=")
  })

  it("defines matching typography and 44px/28px production variants", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const css = readStudioControlCss()
    expect(controls).toContain('heightVariant?: "44" | "28"')
    expect(controls).toContain('sizeVariant = "standard"')
    expect(controls).toContain("StudioSplitLeftBadge")
    expect(css).toContain(".vt-studio-split-left-badge")
    expect(css).toContain("box-shadow: none !important")
    expect(css).toContain("transition: none !important")
    expect(css).toContain('data-size="micro"')
    expect(css).toContain("border-radius: 44px")
    expect(css).toContain("height: 44px")
    expect(css).toContain(".vt-studio-44-choice.is-checkbox { border-radius: 44px; }")
    expect(css).toContain('data-height-variant="44"')
    expect(css).toContain('data-height-variant="28"')
    expect(css).toContain('font-size: 14px !important')
    expect(css).toContain('data-height-variant="28"] [data-vt-studio-split-rail]')
  })

  it("mounts a third confirmed-primitives toolbox without changing the other tracks", () => {
    const library = read("src/components/ToolboxUIReferenceLibrary.tsx")
    expect(library).toContain('track="hardcoded"')
    expect(library).toContain('track="primitive"')
    expect(library).toContain('track="confirmed"')
    expect(library).toContain("StudioHubConfirmedPrimitiveCatalog")
  })

  it("places split-left badge specimens in the confirmed primitive library", () => {
    const catalog = read("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    expect(catalog).toContain("StudioSplitLeftBadge")
    expect(catalog).toContain('title="Split-left Badge · Standard + Compact + Micro"')
    expect(catalog).toContain("STANDARD · FULL ROW")
    expect(catalog).toContain("STANDARD · HALF ROW")
    expect(catalog).toContain("STANDARD · QUARTER ROW · 4×1")
    expect(catalog).toContain("COMPACT · QUARTER ROW · 4×1")
    expect(catalog).toContain("MICRO · LEFT HALF ONLY · 1×1 / 2×1 / 4×1")
    expect(catalog).toContain('tsx="src/studio-ui/primitives/StudioControls.tsx"')
    expect(catalog).toContain('css="src/styles/studio-control-system.css"')
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

  it("enforces the global size, palette, badge shape, and field focus contract", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const tokens = read("src/studio-ui/tokens.ts")
    const css = readStudioControlCss()
    expect(controls).toContain('sizeVariant?: "standard" | "compact" | "micro"')
    expect(controls).toContain('globalRuleException: false')
    expect(controls).toContain('focusOutlineWidth: "65% of border width: 1.95px standard / 1.3px compact / 0.65px micro"')
    expect(tokens).toContain('textAlign: "left"')
    expect(tokens).toContain('focusOutlineWidth: "65% of border width"')
    expect(css).toContain("Canonical primitive + text-field token contract (2026-10-17)")
    expect(css).toContain('height: var(--vt-studio-control-height, 44px)')
    expect(css).toContain('border-radius: var(--vt-studio-control-radius, 6px)')
    expect(css).toContain('text-align: left')
    expect(css).toContain('color-mix(in srgb, var(--vt-field-primary) var(--vt-studio-control-focus-fill-opacity), transparent)')
    expect(css).toContain('outline: calc(var(--vt-studio-control-stroke, 3px) * .65) solid var(--vt-field-secondary')
    expect(css).not.toMatch(/\.vt-studio-closeable-badge\s*\{[^}]*height:\s*20px;[^}]*border-radius:\s*999px/s)
  })


  it("documents fixed-ratio control defaults and enforces heavy badge typography", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const css = readStudioControlCss()
    for (const rule of ["fixedRatioDefaults:", "radioButtons:", "squareIconButtons:", "circleIconButtons:", "splitIconRailColor:", "badgeTypography:"]) {
      expect(controls).toContain(rule)
    }
    expect(css).toContain("Global fixed-ratio contract")
    expect(css).toContain("font-weight: 1000 !important")
    expect(css).toContain("aspect-ratio: 1 / 1")
    expect(css).toContain("place-items: center")
    expect(css).toContain("Canonical split-left label centering rule")
    expect(css).toContain("justify-content: center;")
  })

})

describe("confirmed specimen tier contract", () => {
  it("keeps all five canonical size tiers available to the specimen grid", () => {
    const grid = read("src/components/studio-hub/ConfirmedSpecimenGrid.tsx")
    const tokens = read("src/studio-ui/tokens.ts")
    expect(grid).toContain('export type SpecimenTier = "supreme" | "standard" | "compact" | "mini" | "micro"')
    expect(grid).toContain('const SPECIMEN_TIERS = ["supreme", "standard", "compact", "mini", "micro"] as const')
    for (const tier of ["supreme", "standard", "compact", "mini", "micro"]) {
      expect(tokens).toContain(tier)
      expect(grid).toContain(tier)
    }
  })
})
