import React from "react"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioSplitRailAccordion } from "./StudioSplitRailAccordion"

const items = [
  { accessibleLabel: "Left", icon: <span>L</span>, content: "LEFT PANEL" },
  { accessibleLabel: "Middle", icon: <span>M</span>, content: "MIDDLE PANEL" },
  { accessibleLabel: "Right", icon: <span>R</span>, content: "RIGHT PANEL" },
] as const

describe("StudioSplitRailAccordion", () => {
  it("defaults to the rightmost panel and renders three square icon rails", () => {
    const html = renderToStaticMarkup(<StudioSplitRailAccordion items={items} />)
    expect(html.match(/data-vt-studio-split-rail-icon="true"/g)).toHaveLength(3)
    expect(html).toContain('data-active-index="2"')
    expect(html).toContain("RIGHT PANEL")
    expect(html).not.toContain("MIDDLE PANEL")
    expect(html).not.toContain("LEFT PANEL")
  })

  it("supports a compact default-left state", () => {
    const html = renderToStaticMarkup(<StudioSplitRailAccordion items={items} defaultActiveIndex={0} sizeVariant="compact" />)
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-active-index="0"')
    expect(html).toContain("LEFT PANEL")
  })


  it("keeps label position fixed while revealing it by clipping, with persistent square-rail borders", () => {
    const css = readFileSync(new URL("./StudioSplitRailAccordion.css", import.meta.url), "utf8");
    const contentStart = css.indexOf(".vt-studio-split-rail-accordion__content {");
    const contentEnd = css.indexOf(".vt-studio-split-rail-accordion[data-size=\"compact\"] .vt-studio-split-rail-accordion__content {", contentStart);
    const contentRule = css.slice(contentStart, contentEnd);
    expect(contentRule).toContain("justify-content: flex-start");
    expect(contentRule).toContain("clip-path: inset(0 100% 0 0)");
    expect(contentRule).not.toContain("opacity:");
    expect(contentRule).not.toContain("transition: opacity");
    expect(css).toContain("[data-vt-studio-split-rail-label] {");
    expect(css).toContain("inset: 0 auto 0 4px;");
    expect(css).toContain("align-items: center;");
    expect(css).toContain("transform: none;");
    expect(css).toContain("opacity: 1;");
    expect(css).toContain("-webkit-text-fill-color: #000;");
    expect(css).toContain("height: 100%;");
    expect(css).toContain("aspect-ratio: 1 / 1;");
    expect(css).not.toContain("min-height: var(--vt-studio-control-height, 44px);");
    expect(css).toContain("width: var(--vt-studio-split-rail-stroke);");
    expect(css).toContain("transform: translateX(-50%);");
    expect(css).toContain("transform: translateX(50%);");
    expect(css).toContain(".vt-studio-split-rail-accordion__item:first-child [data-vt-studio-split-rail-icon]::before");
    expect(css).toContain(".vt-studio-split-rail-accordion__item:last-child [data-vt-studio-split-rail-icon]::after");
    expect(css).toContain("flex: 1 1 0;");
    expect(css).toContain("max-width: 100%;");
    expect(css).not.toContain("top: 50%;");
    expect(css).not.toContain("translateY(-50%)");
  });

  it("exposes selection and expansion state for accessible keyboard interaction", () => {
    const html = renderToStaticMarkup(<StudioSplitRailAccordion items={items} />)
    expect(html).toContain('aria-label="Middle"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-pressed="false"')
  })
})
