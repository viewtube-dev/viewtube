import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioPublishingCard } from "./StudioPublishingCard"

describe("StudioPublishingCard size variants", () => {
  it.each([
    ["standard", "standard"],
    ["compact", "compact"],
    ["micro", "micro"],
  ] as const)("renders the %s card density through canonical controls", (size, expectedSize) => {
    const html = renderToStaticMarkup(
      <StudioPublishingCard
        sizeVariant={size}
        title="A title"
        description="A description"
        tags={["FEATURED"]}
        metadata={{ playlist: ["featured"], category: [], location: [], publishDate: ["2026-10-21"] }}
      />,
    )

    expect(html).toContain('data-vt-studio-publishing-card="true"')
    expect(html).toContain(`data-size="${expectedSize}"`)
    expect(html).toContain('data-vt-studio-field="fixed-label-input"')
    expect(html).toContain('data-vt-studio-field="fixed-label-textarea"')
    expect(html).toContain('data-vt-studio-field="legend-multi-dropdown"')
    expect(html).toContain('data-vt-studio-upload-frame="true"')
    expect(html).toContain("FEATURED")
  })

  it("locks outer card and thumbnail ratios against parent grid stretching", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-publishing-card.css"), "utf8")
    const cardRule = css.match(/\.vt-studio-publishing-card\s*\{([^}]*)\}/)?.[1] ?? ""
    const thumbnailRule = css.match(/\.vt-studio-publishing-card__thumbnail\s*\{([^}]*)\}/)?.[1] ?? ""
    const uploadRule = css.match(/\.vt-studio-publishing-card__upload\s*\{([^}]*)\}/)?.[1] ?? ""

    expect(cardRule).toContain("aspect-ratio: 5 / 7;")
    expect(cardRule).toContain("height: auto;")
    expect(cardRule).toContain("align-self: start;")
    expect(cardRule).toContain("min-height: 0;")

    expect(thumbnailRule).toContain("aspect-ratio: 16 / 9;")
    expect(thumbnailRule).toContain("position: relative;")
    expect(thumbnailRule).toContain("align-self: start;")
    expect(thumbnailRule).toContain("height: auto;")

    expect(uploadRule).toContain("position: absolute;")
    expect(uploadRule).toContain("inset: 0;")
    expect(uploadRule).toContain("width: 100%;")
    expect(uploadRule).toContain("height: 100%;")
    expect(uploadRule).toContain("min-height: 0;")
  })

  it("preserves pair fill, size-matched strokes, and undistorted thumbnail media", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-publishing-card.css"), "utf8")

    expect(css).toContain("color-mix(in srgb, var(--vt-publishing-secondary) 25%, transparent)")
    expect(css).toContain('--vt-publishing-stroke: 3px;')
    expect(css).toContain('--vt-publishing-stroke: 2px;')
    expect(css).toContain('--vt-publishing-stroke: 1px;')
    expect(css).toContain('--vt-publishing-radius: 6px;')
    expect(css).toContain('--vt-publishing-radius: 4px;')
    expect(css).toContain('--vt-publishing-radius: 2px;')
    expect(css).toContain("object-fit: cover;")
    expect(css).toContain("outline: var(--vt-publishing-focus-outline) solid var(--vt-publishing-secondary)")
    expect(css).toContain("inset 0 0 0 var(--vt-publishing-stroke) var(--vt-publishing-primary)")
  })
})
