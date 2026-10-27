import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitTextInput } from "./StudioSplitTextInput"

describe("StudioSplitTextInput geometry comparison variants", () => {
  it("exposes the baseline, half-vertical-padding, and username-matched-height variants", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSplitTextInput aria-label="Baseline" geometryVariant="current" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Half padding" geometryVariant="half-vertical-padding" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Username height" geometryVariant="username-height" leftIcon={<svg viewBox="0 0 24 24" />} />
      </>,
    )

    expect(html).toContain('data-geometry-variant="current"')
    expect(html).toContain('data-geometry-variant="half-vertical-padding"')
    expect(html).toContain('data-geometry-variant="username-height"')
    expect(html.match(/data-vt-studio-split-rail="start"/g)).toHaveLength(3)
    expect(html.match(/class="vt-studio-split-text-input__field"/g)).toHaveLength(3)
  })

  it("changes only field padding or field height while preserving the rail's centered geometry", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-text-input.css"), "utf8")
    const railStart = css.indexOf(".vt-studio-split-text-input > .vt-studio-split-shell__rail")
    const railEnd = css.indexOf(".vt-studio-split-text-input[data-vt-studio-split=\"right\"]")
    const railRules = css.slice(railStart, railEnd)

    expect(css).toContain('data-geometry-variant="half-vertical-padding"] > .vt-studio-split-text-input__field')
    expect(css).toContain("padding-block: calc(var(--vt-studio-space-unit, 4px) / 2);")
    expect(css).toContain('data-geometry-variant="username-height"] > .vt-studio-split-text-input__field')
    expect(css).toContain("height: calc(var(--vt-studio-control-height, 44px) - 2 * var(--vt-studio-control-stroke, 3px));")
    expect(railRules).toContain("display: grid;")
    expect(railRules).toContain("place-items: center;")
    expect(railRules).toContain("flex: 0 0 calc(var(--vt-studio-control-height, 44px) - 2 * var(--vt-studio-control-stroke, 3px));")
    expect(railRules).toContain("height: 100%;")
    expect(railRules).not.toContain("transform:")
  })
})
