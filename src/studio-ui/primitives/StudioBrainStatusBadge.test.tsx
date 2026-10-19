import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioBrainStatusBadge } from "./StudioControls"

describe("StudioBrainStatusBadge", () => {
  it("renders a borderless dark badge with a smaller saturated LED and accessible status text", () => {
    const html = renderToStaticMarkup(
      <StudioBrainStatusBadge label="READY" tone="green" appearance="dark" sizeVariant="compact" />,
    )
    expect(html).toContain('data-vt-studio-brain-status="true"')
    expect(html).toContain('data-appearance="dark"')
    expect(html).toContain('data-tone="green"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('role="status"')
    expect(html).toContain('class="vt-studio-brain-status-badge__ripple"')
    expect(html).toContain("READY")
  })

  it("supports lighter matching fills, inactive states, and reduced-density sizing", () => {
    const html = renderToStaticMarkup(
      <StudioBrainStatusBadge label="REVIEW" tone="yellow" appearance="tinted" active={false} sizeVariant="micro" />,
    )
    expect(html).toContain('data-appearance="tinted"')
    expect(html).toContain('data-tone="yellow"')
    expect(html).toContain('data-active="false"')
    expect(html).toContain('data-size="micro"')
  })
})
