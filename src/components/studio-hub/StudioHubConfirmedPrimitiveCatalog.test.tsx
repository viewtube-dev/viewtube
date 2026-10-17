import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioHubConfirmedPrimitiveCatalog } from "./StudioHubConfirmedPrimitiveCatalog"

describe("confirmed composite primitive catalog", () => {
  it("registers the production Play/Pause split-left control at standard and compact sizes", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('Play/Pause Split-left Button · 44px + 28px')
    expect(html).toContain('data-vt-studio-play-pause="true"')
    expect(html).toContain('data-vt-library-component="StudioPlayPauseButton"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('data-vt-studio-play-pause-measure="play"')
    expect(html).toContain('data-vt-studio-play-pause-measure="pause"')
  })

  it("registers the circular icon shape by reusing the canonical square icon button contract", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('Circle Icon Button · 44px + 28px')
    expect(html).toContain('data-vt-studio-circle-icon-button="true"')
    expect(html).toContain('data-vt-studio-icon-button="true"')
    expect(html).toContain('data-vt-library-component="StudioCircleIconButton"')
    expect(html).toContain('aria-label="Circle icon button V1"')
    expect(html).toContain('aria-label="Compact circle icon button V4"')
  })

  it("registers the username composite with standard and compact native inputs", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('Username Split-left Input · 44px + 28px')
    expect(html).toContain('data-vt-studio-username-input="true"')
    expect(html).toContain('data-vt-studio-username-rail="true"')
    expect(html).toContain('data-icon-size-variant="large"')
    expect(html).toContain('data-vt-library-component="StudioUsernameInput"')
    expect(html).toContain('aria-label="Standard username"')
    expect(html).toContain('aria-label="Compact username"')
    expect(html).toContain('aria-label="Disabled username"')
  })
  it("registers the production closeable badge and animated tag editor under global rule exceptions", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain("Global Rules Exceptions · Closeable Badge + Tag Editor")
    expect(html).toContain('data-vt-studio-badge="true"')
    expect(html).toContain('data-vt-studio-tag-editor="true"')
    expect(html).toContain("StudioCloseableBadge / StudioTagEditor")
    expect(html).toContain("H 20px")
    expect(html).toContain("action H 28px")
    expect(html).toContain("vt-studio-tag-editor__square-action")
  })

  it("uses the canonical compact Studio text input and staged flight transition", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain('.vt-studio-tag-editor__fly[data-targeted="true"] { opacity: 1; }')
    expect(css).toContain('.vt-studio-tag-editor__fly[data-arrived="true"] { opacity: 0; }')
  })

  it("preserves the requested comparison rows and 50-color spectrum sample", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    for (const label of [
      "Square icon button V1 primary fill",
      "Square icon button V2 secondary fill",
      "Toggle square icon button selection",
      "Square icon button V4 black fill",
      "Compact square icon button V1",
      "Compact square icon button V2",
      "Toggle compact square icon button selection",
      "Compact square icon button V4",
      "ROTATED TOGGLE",
      "3D FLIP",
      "TOOLTIP",
      "MORPH",
      "SUCCESS STATE",
    ]) {
      expect(html).toContain(label)
    }
    expect(html).toContain('class="vt-confirmed-square-variant-grid"')
    expect(html).toContain('class="vt-confirmed-square-effect-grid"')
    expect(html).toContain('class="vt-confirmed-stepper-row-grid"')
    expect(html).toContain('class="vt-confirmed-spectrum-tag-grid"')
    for (const label of [
      "AARDVARK", "AZURE", "BANANA", "BLUEBELL", "CANDY", "CITRUS",
      "DAFFODIL", "DENIM", "EBONY", "EMERALD", "FERN", "FROST",
      "GOLD", "GREEN", "HAZEL", "HONEY", "INDIGO", "IVORY",
      "JADE", "JASMINE", "KIWI", "KUMQUAT", "LAVENDER", "LEMON",
      "MAGENTA", "MINT", "NAVY", "NEON", "OPAL", "ORANGE",
      "PEACH", "PERIWINKLE", "QUARTZ", "QUINCE", "ROSE", "RUBY",
      "SAPPHIRE", "SCARLET", "TEAL", "TURQUOISE", "ULTRAMARINE", "UMBER",
      "VIOLET", "VIRIDIAN", "WALNUT", "WHITE", "XANTHAN", "XENON",
      "YELLOW", "ZUCCHINI",
    ]) {
      expect(html).toContain(`>${label}</button>`)
    }
    expect(html).toContain("44px standard")
    expect(html).toContain("28px compact")
  })


  it("registers shared split-right and double-split badges and the global spacing/micro contracts", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('data-vt-studio-split-badge="right"')
    expect(html).toContain('data-vt-studio-split-badge="double"')
    expect(html).toContain("SPLIT-RIGHT BADGE · SHARED FOUNDATION")
    expect(html).toContain("DOUBLE-SPLIT BADGE · SHARED FOUNDATION")
    expect(html).toContain('data-size="micro"')
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("--vt-studio-space-unit: 4px")
    expect(css).toContain('[data-size="micro"]')
    expect(css).toContain("box-shadow: none !important")
    expect(css).toContain("transition: none !important")
  })


  it("declares the canonical flat and stationary primitive contract", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("Confirmed Primitive flat-control contract (2026-10-16)")
    expect(css).toContain("box-shadow: none !important")
    expect(css).toContain("transition: none !important")
    expect(css).toContain("translate: none !important")
    expect(css).toContain("prefers-reduced-motion: reduce")
    const catalog = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(catalog).toContain("flat and stationary")
    expect(catalog).not.toContain("Current CSS translates outer action 1.5px on hover")
  })


  it("documents and enforces row-fill defaults, three size tiers, and distinct field typography", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const tokens = readFileSync(resolve(process.cwd(), "src/studio-ui/tokens.ts"), "utf8")
    const catalog = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(css).toContain('data-width="content"')
    expect(css).toContain("width: 100%")
    expect(css).toContain('--vt-studio-control-text-stroke: 1px')
    expect(css).toContain('--vt-studio-control-text-stroke: .5px')
    expect(css).toContain('--vt-studio-control-text-stroke: .25px')
    expect(css).toContain("--vt-studio-textarea-font-size: 14px")
    expect(css).toContain(".vt-studio-floating-field > .vt-studio-floating-field-label")
    expect(css).toContain(".vt-studio-fixed-label-field > .vt-studio-fixed-field-label")
    expect(tokens).toContain('width: "row"')
    expect(tokens).toContain("standardTextStroke: 1")
    expect(tokens).toContain("compactTextStroke: 0.5")
    expect(tokens).toContain("fontWeight: 1000")
    expect(catalog).toContain("row-fill by default")
    expect(catalog).toContain("data-width=&quot;content&quot;")
  })

})
