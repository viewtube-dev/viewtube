import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioHubConfirmedPrimitiveCatalog } from "./StudioHubConfirmedPrimitiveCatalog"

const readStudioControlCss = () => [
  "studio-control-system.css",
  "studio-control-core.css",
  "studio-control-split.css",
  "studio-control-fields.css",
].map((file) => readFileSync(resolve(process.cwd(), "src/styles", file), "utf8")).join("\n")

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

  it("registers StudioTextInput floating-label and fixed-label variants", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('data-vt-studio-field="floating-input"')
    expect(html).toContain('data-vt-studio-field="fixed-label-input"')
    expect(html).toContain('class="vt-studio-floating-field-label"')
    expect(html).toContain('class="vt-studio-fixed-field-label"')
    expect(html).toContain('aria-label="Studio floating-label input standard A"')
    expect(html).toContain('aria-label="Studio fixed-label input standard A"')
    expect(html).toContain('data-vt-floating-variant="b"')
  })

  it("uses the canonical compact Studio text input and staged flight transition", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    const css = readStudioControlCss()
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
    const css = readStudioControlCss()
    expect(css).toContain("--vt-studio-space-unit: 4px")
    expect(css).toContain('[data-size="micro"]')
    expect(css).toContain("box-shadow: none !important")
    expect(css).toContain("transition: none !important")
  })


  it("declares the canonical flat and stationary primitive contract", () => {
    const css = readStudioControlCss()
    expect(css).toContain("Confirmed Primitive flat-control contract (2026-10-16)")
    expect(css).toContain("box-shadow: none !important")
    expect(css).toContain("transition: none !important")
    expect(css).toContain("translate: none !important")
    expect(css).toContain("prefers-reduced-motion: reduce")
    const catalog = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(catalog).toContain("flat and stationary")
    expect(catalog).not.toContain("Current CSS translates outer action 1.5px on hover")
  })


  it("keeps split badges to one perimeter border and square micro rails", () => {
    const css = readStudioControlCss()
    expect(css).toContain('.vt-studio-split-shell[data-vt-studio-split="double"]')
    expect(css).toContain("border-radius: 0;")
    expect(css).toContain("aspect-ratio: 1 / 1;")
    expect(css).toContain("border-right: var(--vt-studio-control-stroke")
    expect(css).toContain("border-left: var(--vt-studio-control-stroke")
    expect(css).toContain('[data-vt-studio-control="true"][data-size="micro"]')
  })

  it("uses primary/secondary rail colors and contains split-right/double-split labels", () => {
    const css = readStudioControlCss()
    expect(css).toContain("--vt-studio-control-accent: var(--pair-a")
    expect(css).toContain("--vt-studio-control-secondary: var(--pair-b")
    expect(css).toContain(".vt-studio-split-right-badge__label")
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) var(--vt-studio-control-height")
    expect(css).toContain("[data-vt-studio-split-label]")
    expect(css).toContain("text-overflow: ellipsis")
    expect(css).toContain("white-space: nowrap")
    const labelBlock = css.slice(css.indexOf(".vt-studio-split-left-badge__label,"), css.indexOf(".vt-studio-split-shell > [data-vt-studio-split-field]"))
    expect(labelBlock).not.toContain("flex: 1 1 0%")
    expect(labelBlock).not.toMatch(/(?:^|\n)\s*width:\s*0(?:;|\s|$)/)
  })

  it("enforces global primary/secondary palette, centered labels, 1000 weight, and full-row defaults", () => {
    const css = readStudioControlCss()
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(css).toContain("--vt-studio-control-accent: var(--pair-a")
    expect(css).toContain("--vt-studio-control-secondary: var(--pair-b")
    expect(css).toContain("font-weight: 1000 !important")
    expect(css).toContain("text-align: center")
    expect(css).toContain('width: 100%')
    expect(css).toContain('[data-vt-studio-width="content"]')
    expect(controls).toContain('width: "full-row by default; data-width=content is an explicit opt-in exception"')
    expect(controls).toContain('labelAlignment: "centered by default for all primitive labels"')
  })

  it("enforces square-ratio split segments, outer-edge label centering, and shared orb dividers", () => {
    const css = readStudioControlCss()
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(css).toContain('.vt-studio-split-shell[data-vt-studio-split="double"]')
    expect(css).toContain("grid-template-columns: var(--vt-studio-control-height")
    expect(css).toContain("aspect-ratio: 1 / 1;")
    expect(css).toContain("align-items: center")
    expect(css).toContain("justify-content: center")
    expect(css).toContain(".vt-studio-split-shell > [data-vt-studio-split-rail]")
    expect(css).toContain("justify-content: center")
    expect(css).toContain("text-align: center")
    expect(css).toContain("border-right: var(--vt-studio-control-stroke")
    expect(css).toContain("border-left: var(--vt-studio-control-stroke")
    expect(controls).toContain('splitSegmentRatio: "icon rails are square (1:1) to the selected size tier; labels center in the remaining text region against the outer perimeter bounds"')
    expect(controls).toContain('splitDividers: "single split has exactly one shared internal divider; double split has exactly two; dividers use the global border width and are never duplicated on label edges"')
  })

  it("documents and enforces row-fill defaults, three size tiers, and distinct field typography", () => {
    const css = readStudioControlCss()
    const tokens = readFileSync(resolve(process.cwd(), "src/studio-ui/tokens.ts"), "utf8")
    const catalog = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(css).toContain('data-vt-studio-width="content"')
    expect(css).toContain("width: 100%")
    expect(css).toContain("--vt-studio-control-text-stroke: var(--vt-studio-44-text-stroke, 1px)")
    expect(css).toContain("--vt-studio-control-text-stroke: var(--vt-studio-28-text-stroke, .5px)")
    expect(css).toContain("--vt-studio-14-text-stroke, .25px")
    expect(css).toContain("--vt-studio-textarea-standard-font-size: 18px")
    expect(css).toContain("--vt-studio-textarea-compact-font-size: 14px")
    expect(css).toContain(".vt-studio-floating-field > .vt-studio-floating-field-label")
    expect(css).toContain(".vt-studio-fixed-label-field > .vt-studio-fixed-field-label")
    expect(tokens).toContain('width: "row"')
    expect(tokens).toContain('inlineStrokeWidth: "same as border width"')
    expect(tokens).toContain("compactTextStroke: 0.35")
    expect(tokens).toContain("fontWeight: 1000")
    expect(catalog).toContain("row-fill by default")
    expect(catalog).toContain("data-width=&quot;content&quot;")
  })

})


it("keeps one square-icon family and exposes all four canonical toggle/choice skins", () => {
  const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
  expect(html).not.toContain("Button + Split-left · Complete Variant Matrix")
  expect(html.match(/Square Icon Button · 44px \+ 28px/g)).toHaveLength(1)
  expect(html).not.toContain("Square Icon Button · All Presets + Animations")
  expect(html).toContain("Square icon button V1 primary fill")
  expect(html).toContain("HEART + STATE FEEDBACK")
  expect(html).toContain("V1 · PRIMARY / SECONDARY")
  expect(html).toContain("V2 · PRIMARY ↔ SECONDARY")
  expect(html).toContain("V3 · WHITE INDICATOR")
  expect(html).toContain("V4 · BLACK INDICATOR")
  expect(html).toContain("COUNTER-CONTROLLED · UP / DOWN")
  const source = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")
  const css = readStudioControlCss()
  expect(source).not.toContain("StudioIconButton")
  expect(source).not.toContain('title="Icon Button · 44px + 28px"')
  expect(source).toContain("const CHOICE_SKINS = CANONICAL_SKINS")
  expect(source).toContain("const WORD_TOGGLE_SKINS = CANONICAL_SKINS")
  const choiceFamily = source.slice(source.indexOf('<Family title="44px Radio + Checkbox"'), source.indexOf('<Family title="Word Toggles'))
  expect(choiceFamily).toContain("CHOICE_SKINS.map")
  expect(choiceFamily).toContain("StudioCheckbox")
  expect(choiceFamily).toContain("StudioXCheckbox")
  expect(css).toContain("Four canonical state-fill / indicator-shape variants shared by switches")
  expect(css).toContain('background: color-mix(in srgb, var(--vt-studio-control-accent, var(--pair-a, #36e0f6)) 50%, transparent) !important')
  expect(css).toContain(".vt-studio-44-choice.is-color-swap.is-on")
  expect(css).toContain(".vt-studio-44-word-toggle.is-white-indicator .vt-studio-44-word-handle")
  expect(css).toContain(".vt-studio-44-word-toggle.is-black-indicator .vt-studio-44-word-handle")
});


describe("restored confirmed primitive sections", () => {
  it("renders the distinct production representatives section before the family modules", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain("Representatives · Production Primitives")
    expect(html).toContain("READ-ONLY TEXT BOX")
    expect(html).toContain("PRIMARY ACTION")
    expect(html).toContain("TEXT ENTRY")
  })

  it("renders all restored production primitives and their expected size tiers", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    for (const marker of [
      'data-vt-studio-vertical-word-toggle="true"',
      'data-vt-studio-icon-button-group="true"',
      'data-vt-studio-text-box="true"',
      'data-vt-studio-split-accordion="true"',
      'data-vt-studio-value-toggle="arrow"',
      'data-vt-studio-value-toggle="side"',
      'data-vt-studio-value-toggle="double"',
      'data-vt-studio-value-toggle="bar"',
      'data-vt-studio-control-kind="studio-double-split-word-counter"',
      'data-vt-library-component="StudioLeftWordCounter"',
    ]) expect(html).toContain(marker)
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-size="micro"')
  })

  it("starts all five grouped square icon buttons in primary and marks selected squares independently", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('aria-label="standard action group"')
    expect(html).toContain('aria-label="Settings"')
    expect(html).toContain('data-vt-studio-icon-button-group="true"')
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('aria-pressed="true"')
  })
})
