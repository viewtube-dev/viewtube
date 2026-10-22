import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioPanelAccordion } from "./StudioPanelAccordion"

const items = [
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" /></svg>, label: "Left", content: "Left content" },
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" /></svg>, label: "Middle", content: "Middle content" },
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" /></svg>, label: "Right", content: "Right content" },
] as const

describe("StudioPanelAccordion", () => {
  it("renders three square-rail panel selectors and one active panel", () => {
    const html = renderToStaticMarkup(<StudioPanelAccordion items={items} defaultActiveIndex={1} />)
    expect((html.match(/vt-studio-panel-accordion__rail/g) || []).length).toBe(3)
    expect(html).toContain('data-active-index="1"')
    expect(html).toContain('aria-expanded="true"')
    expect(html).toContain("Middle")
  })

  it("supports compact Studio sizing", () => {
    const html = renderToStaticMarkup(<StudioPanelAccordion items={items} size="compact" />)
    expect(html).toContain('data-size="compact"')
  })
})
