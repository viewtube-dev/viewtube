import React from "react"
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

  it("exposes selection and expansion state for accessible keyboard interaction", () => {
    const html = renderToStaticMarkup(<StudioSplitRailAccordion items={items} />)
    expect(html).toContain('aria-label="Middle"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-pressed="false"')
  })
})
