import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainSettingsSwitch, BrainSettingsRange } from "./BrainSettingsControls"

describe("accessible Brain settings controls", () => {
  it("uses the canonical Studio switch with explicit accessible names and state", () => {
    const html = renderToStaticMarkup(<BrainSettingsSwitch label="Analytics access" detail="Use private analytics" checked onChange={() => undefined} />)
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-checked="true"')
    expect(html).toContain('aria-labelledby=')
    expect(html).toContain('aria-describedby=')
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain("vt-studio-44-switch")
    expect(html).not.toContain(">On</span>")
  })
  it("uses the accessible bounded StudioCounter for numeric settings", () => {
    const html = renderToStaticMarkup(<BrainSettingsRange label="Evidence items" detail="Maximum items" min={3} max={30} value={12} onChange={() => undefined} />)
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="Evidence items"')
    expect(html).toContain('aria-describedby=')
    expect(html).toContain('data-vt-library-component="StudioCounter"')
    expect(html).toContain("Decrease Evidence items")
    expect(html).toContain("Increase Evidence items")
    expect(html).toContain("12")
  })
})
