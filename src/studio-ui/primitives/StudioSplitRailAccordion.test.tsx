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


  it("uses inset rail dividers and item-owned motion with a pure content clip window", () => {
    const css = readFileSync(new URL("./StudioSplitRailAccordion.css", import.meta.url), "utf8");
    const contentStart = css.indexOf(".vt-studio-split-rail-accordion__content {");
    const contentEnd = css.indexOf('[data-active="true"]', contentStart);
    const contentRule = css.slice(contentStart, contentEnd);
    const itemStart = css.indexOf(".vt-studio-split-rail-accordion__item {");
    const itemEnd = css.indexOf('[data-active="true"]', itemStart);
    const itemRule = css.slice(itemStart, itemEnd);
    expect(css).toContain("--vt-studio-split-rail-face: calc(var(--vt-studio-split-rail-size) - 2 * var(--vt-studio-split-rail-stroke));");
    expect(css).toContain("flex: 0 0 var(--vt-studio-split-rail-face);");
    expect(css).toContain("width: var(--vt-studio-split-rail-face);");
    expect(css).toContain("box-shadow: inset calc(-1 * var(--vt-studio-split-rail-stroke)) 0 0 #000;");
    expect(css).not.toContain("::before");
    expect(css).not.toContain("::after");
    expect(css).not.toContain("transform: translateX(-50%)");
    expect(css).not.toContain("transform: translateX(50%)");
    expect(css).not.toContain("width: auto;");
    expect(css).not.toContain("aspect-ratio: 1 / 1;");
    expect(itemRule).toContain("transition: flex-grow var(--vt-studio-split-rail-slide-duration)");
    expect(contentRule).toContain("flex: 1 1 0;");
    expect(contentRule).toContain("clip-path: inset(0 100% 0 0)");
    expect(contentRule).toContain("transition: clip-path var(--vt-studio-split-rail-slide-duration)");
    expect(contentRule).not.toContain("flex-grow");
    expect(contentRule).not.toContain("max-width");
    expect(contentRule).not.toMatch(/(^|\\n)\\s*width: 0;/);
    expect(contentRule).toContain("background: transparent;");
    expect(css).toContain('.vt-studio-split-rail-accordion__item[data-active="true"]:not(:last-child)');
    expect(css).toContain("box-shadow: inset calc(-1 * var(--vt-studio-split-rail-stroke)) 0 0 #000;");
    expect(css).toContain("[data-vt-studio-split-rail-label] {");
    expect(css).toContain("left: 0;");
    expect(css).toContain("align-items: center;");
    expect(css).toContain("line-height: 1;");
    expect(css).toContain("opacity: 1;");
    expect(css).toContain("width: 86%;");
    expect(css).toContain("height: 86%;");
    expect(css).toContain("place-items: center;");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("exposes selection and expansion state for accessible keyboard interaction", () => {
    const html = renderToStaticMarkup(<StudioSplitRailAccordion items={items} />)
    expect(html).toContain('aria-label="Middle"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-pressed="false"')
  })
})
