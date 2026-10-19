import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainSettingsSwitch, BrainSettingsRange } from "./BrainSettingsControls"

describe("accessible Brain settings controls", () => {
  it("gives switches explicit names, descriptions, visible state and native buttons", () => {
    const html = renderToStaticMarkup(<BrainSettingsSwitch label="Analytics access" detail="Use private analytics" checked onChange={() => undefined} />)
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-checked="true"')
    expect(html).toContain('aria-labelledby=')
    expect(html).toContain('aria-describedby=')
    expect(html).toContain('type="button"')
    expect(html).toContain('min-h-11')
    expect(html).toContain('>On</span>')
  })
  it("labels native keyboard-operable sliders and exposes their bounds", () => {
    const html = renderToStaticMarkup(<BrainSettingsRange label="Evidence items" detail="Maximum items" min={3} max={30} value={12} onChange={() => undefined} />)
    expect(html).toContain('<label for=')
    expect(html).toContain('aria-describedby=')
    expect(html).toContain('type="range"')
    expect(html).toContain('min="3"')
    expect(html).toContain('max="30"')
    expect(html).toContain('value="12"')
  })
})
