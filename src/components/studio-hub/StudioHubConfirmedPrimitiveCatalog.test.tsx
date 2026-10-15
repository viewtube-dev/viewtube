import React from "react"
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
  it("preserves the requested comparison rows and 20-color spectrum sample", () => {
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
      "APPLE", "BERRY", "CITRUS", "DRAGONFRUIT", "ELDERBERRY",
      "FIG", "GRAPE", "HONEYDEW", "INDIGO", "JASMINE",
      "KIWI", "LEMON", "MANGO", "NECTARINE", "ORANGE",
      "PEACH", "QUINCE", "RASPBERRY", "STRAWBERRY", "TANGERINE",
    ]) {
      expect(html).toContain(`>${label}</button>`)
    }
    expect(html).toContain("44px standard")
    expect(html).toContain("28px compact")
  })

})
