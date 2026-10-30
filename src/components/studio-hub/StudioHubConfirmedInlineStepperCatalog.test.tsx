import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioHubConfirmedPrimitiveCatalog } from "./StudioHubConfirmedPrimitiveCatalog"

describe("confirmed Studio inline stepper catalog entry", () => {
  it("renders the canonical inline stepper in standard and compact sizes", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('StudioInlineStepper</strong>')
    expect(html).toContain('data-vt-library-component="StudioInlineStepper"')
    expect(html).toContain('aria-label="Standard inline stepper"')
    expect(html).toContain('aria-label="Compact inline stepper"')
    expect(html).toContain('title="Studio Inline Stepper · Standard + Compact"')
  })
})
