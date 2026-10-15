import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import {
  HardcodedGenericControl,
  StudioHubCompletePrimitiveCatalog,
} from "./StudioHubCompletePrimitiveCatalog"

describe("confirmed Square Icon Button component-library entry", () => {
  it("renders the canonical production primitive for all four skins and seven interaction patterns", () => {
    const html = renderToStaticMarkup(
      <HardcodedGenericControl
        name="Square Icon Button"
        level="l1"
        index={4}
        paletteIndex={7}
      />,
    )

    expect(html).toContain('data-vt-confirmed-component="StudioSquareIconButton"')
    for (const variant of ["v1", "v2", "v3", "v4"]) {
      expect(html).toContain(`data-icon-variant="${variant}"`)
    }
    for (const effect of ["standard", "notification", "rotated-toggle", "flip", "tooltip", "morph", "success"]) {
      expect(html).toContain(`data-icon-effect="${effect}"`)
    }
    expect(html).toContain('data-pop="true"')
    expect(html).toContain('data-vt-square-badge')
    expect(html).toContain('data-vt-square-flip-inner')
    expect(html).toContain('data-vt-square-morph-inner')
    expect(html).toContain('data-vt-square-tooltip')
    expect(html).toContain('data-vt-square-success-label')
    expect(html).toContain("44×44 standard / 28×28 compact")
  })

  it("certifies the Square Icon Button family as production-backed in the complete catalog", () => {
    const html = renderToStaticMarkup(<StudioHubCompletePrimitiveCatalog paletteIndex={7} />)
    expect(html).toContain('data-vt-family="Square Icon Button"')
    expect(html).toContain('data-vt-certification-state="confirmed-production-primitive"')
    expect(html).toContain('data-vt-confirmed-component="StudioSquareIconButton"')
  })
})
