import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioButton, StudioTwoLineButton } from "./StudioControls"

describe("StudioButton two-line layout variant", () => {
  it("renders two centered text rows through the canonical button at standard size", () => {
    const html = renderToStaticMarkup(
      <StudioButton sizeVariant="standard" textLayout="two-line" firstLine="GENERATE" secondLine="METADATA" aria-label="Generate metadata" />,
    )

    expect(html).toContain('data-vt-studio-button="true"')
    expect(html).toContain('data-vt-studio-button-lines="two"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('data-vt-studio-button-line="first">GENERATE</span>')
    expect(html).toContain('data-vt-studio-button-line="second">METADATA</span>')
  })

  it("uses the same StudioButton variant for compact rows and preserves the compatibility wrapper", () => {
    const direct = renderToStaticMarkup(
      <StudioButton sizeVariant="compact" textLayout="two-line" firstLine="AI" secondLine="REFINE" />,
    )
    const compatibility = renderToStaticMarkup(
      <StudioTwoLineButton sizeVariant="compact" firstLine="AI" secondLine="REFINE" />,
    )

    expect(direct).toContain('data-size="compact"')
    expect(direct).toContain('data-vt-studio-button-lines="two"')
    expect(compatibility).toContain('data-vt-studio-button-lines="two"')
    expect(compatibility).toContain('data-vt-studio-button-line="first">AI</span>')
    expect(compatibility).toContain('data-vt-studio-button-line="second">REFINE</span>')
  })
})
