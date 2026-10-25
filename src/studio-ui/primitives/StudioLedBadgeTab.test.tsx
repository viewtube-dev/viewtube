import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioLedBadgeTab } from "./StudioLedBadgeTab"

describe("StudioLedBadgeTab", () => {
  it("renders the four Brain destinations as compact accessible two-line tabs", () => {
    const html = renderToStaticMarkup(
      <StudioLedBadgeTab mode="tab" sizeVariant="compact" label="BRAIN STATUS" firstLine="BRAIN" secondLine="STATUS" active onClick={() => undefined} />,
    )
    expect(html).toContain('role="tab"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('data-vt-studio-primitive="StudioLedBadgeTab"')
    expect(html).toContain("BRAIN")
    expect(html).toContain("STATUS")
    expect(html).toContain("is-compact")
  })

  it("supports all five requested LED animation styles", () => {
    const animations = ["prism", "radar", "flare2", "steady", "blink"] as const
    for (const animation of animations) {
      const html = renderToStaticMarkup(<StudioLedBadgeTab label={animation} animation={animation} led="rainbow" />)
      expect(html).toContain(`motion-${animation}`)
      expect(html).toContain(`data-vt-led-animation="${animation}"`)
    }
  })

  it("supports off, single-color, and rainbow LED states", () => {
    expect(renderToStaticMarkup(<StudioLedBadgeTab label="Off" led="off" />)).toContain("led-off")
    expect(renderToStaticMarkup(<StudioLedBadgeTab label="Solid" led="solid" tone="green" />)).toContain("tone-green")
    expect(renderToStaticMarkup(<StudioLedBadgeTab label="Rainbow" led="rainbow" />)).toContain("led-rainbow")
  })

  it("keeps LEDs at text height and suppresses motion for reduced-motion users", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-led-badge-tab.css"), "utf8")
    expect(css).toContain("width:10px;height:10px")
    expect(css).toContain(".vt-studio-led-badge-tab.is-mini .vt-studio-led-badge-tab__led{width:9px;height:9px}")
    expect(css).toContain("@media(prefers-reduced-motion:reduce)")
    expect(css).toContain("box-shadow:none")
    expect(css).toContain("text-overflow:clip")
  })
})
