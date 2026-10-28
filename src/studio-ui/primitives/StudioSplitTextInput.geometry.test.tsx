import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitTextInput } from "./StudioSplitTextInput"
import StudioHubConfirmedPrimitiveCatalog from "../../components/studio-hub/StudioHubConfirmedPrimitiveCatalog"

describe("StudioSplitTextInput geometry comparison variants", () => {
  it("exposes the baseline, half-vertical-padding, and username-matched-height variants", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSplitTextInput aria-label="Baseline" geometryVariant="current" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Padding reference" geometryVariant="padding-reference" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Half padding" geometryVariant="half-vertical-padding" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Username height" geometryVariant="username-height" leftIcon={<svg viewBox="0 0 24 24" />} />
      </>,
    )

    expect(html).toContain('data-geometry-variant="current"')
    expect(html).toContain('data-geometry-variant="padding-reference"')
    expect(html).toContain('data-geometry-variant="half-vertical-padding"')
    expect(html).toContain('data-geometry-variant="username-height"')
    expect(html.match(/data-vt-studio-split-rail="start"/g)).toHaveLength(4)
    expect(html.match(/class="vt-studio-split-text-input__field"/g)).toHaveLength(4)
  })


  it("makes all three geometry variants visible in the confirmed Studio library", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain("Split Text Input · Vertical Geometry Comparison")
    expect(html).toContain("CURRENT · BASELINE")
    expect(html).toContain("4PX VERTICAL PADDING REFERENCE")
    expect(html).toContain("HALF OF 4PX VERTICAL PADDING · 2PX")
    expect(html).toContain("USERNAME-MATCHED INNER HEIGHT")
    expect(html).toContain('data-geometry-variant="current"')
    expect(html).toContain('data-geometry-variant="half-vertical-padding"')
    expect(html).toContain('data-geometry-variant="username-height"')
  })

  it("changes only field padding or field height while preserving the rail's centered geometry", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-text-input.css"), "utf8")
    const railStart = css.indexOf(".vt-studio-split-text-input > .vt-studio-split-shell__rail")
    const railEnd = css.indexOf(".vt-studio-split-text-input[data-vt-studio-split=\"right\"]")
    const railRules = css.slice(railStart, railEnd)

    expect(html).toContain('data-vt-studio-field-kind="text-input" data-geometry-variant="current"')
    expect(html).toContain('data-vt-studio-field-kind="text-input" data-geometry-variant="padding-reference"')
    expect(html).toContain('data-vt-studio-field-kind="text-input" data-geometry-variant="half-vertical-padding"')
    expect(html).toContain('data-vt-studio-field-kind="text-input" data-geometry-variant="username-height"')
    expect(css).toContain('.vt-studio-split-text-input__field[data-geometry-variant="padding-reference"]')
    expect(css).toContain("padding-block: var(--vt-studio-space-unit, 4px);")
    expect(css).toContain('.vt-studio-split-text-input__field[data-geometry-variant="half-vertical-padding"]')
    expect(css).toContain("padding-block: calc(var(--vt-studio-space-unit, 4px) / 2);")
    expect(css).toContain('.vt-studio-split-text-input__field[data-geometry-variant="username-height"]')
    expect(css).toContain("height: calc(var(--vt-studio-control-height, 44px) - 2 * var(--vt-studio-control-stroke, 3px));")
    expect(railRules).toContain("display: grid;")
    expect(railRules).toContain("place-items: center;")
    expect(railRules).toContain("flex: 0 0 calc(var(--vt-studio-control-height, 44px) - 2 * var(--vt-studio-control-stroke, 3px));")
    expect(railRules).toContain("height: 100%;")
    expect(railRules).not.toContain("transform:")
  })
})
