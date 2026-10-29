import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioSplitTextInput } from "./StudioSplitTextInput"

describe("StudioSplitTextInput canonical geometry", () => {
  it("renders left, right, and double split modes through the badge-owned shell", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSplitTextInput aria-label="Left split field" split="left" leftIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Right split field" split="right" rightIcon={<svg viewBox="0 0 24 24" />} />
        <StudioSplitTextInput aria-label="Double split field" split="double" leftIcon={<svg viewBox="0 0 24 24" />} rightIcon={<svg viewBox="0 0 24 24" />} />
      </>,
    )
    expect(html).toContain('class="vt-studio-split-text-input"')
    expect(html).toContain('data-split="left"')
    expect(html).toContain('data-split="right"')
    expect(html).toContain('data-split="double"')
    expect(html).toContain('class="vt-studio-text-input')
    expect(html).not.toContain("data-geometry-variant")
  })

  it("uses one inset field stroke, semantic primary fill, and the shared focus outline", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-split-text-input.css"), "utf8")
    expect(css).toContain("box-shadow: inset 0 0 0 var(--vt-studio-control-stroke, 3px) var(--vt-split-field-primary);")
    expect(css).toContain("background-color: color-mix(in srgb, var(--vt-split-field-primary) 50%, transparent);")
    expect(css).toContain("background-color: color-mix(in srgb, var(--vt-split-field-primary) 15%, transparent);")
    expect(css).toContain("-webkit-text-stroke-color: #000;")
    expect(css).toContain("focus-outline-width-ratio, .65")
    expect(css).toContain("outline-offset: 0;")
    expect(css).not.toContain("geometryVariant")
    expect(css).not.toContain("data-geometry-variant")
  })
})
