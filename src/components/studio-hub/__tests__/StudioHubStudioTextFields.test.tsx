import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioHubPrimitiveMigrationCatalog, STUDIO_HUB_MIGRATED_FAMILIES } from "../StudioHubPrimitiveMigrationCatalog"
import { StudioHubConfirmedPrimitiveCatalog } from "../StudioHubConfirmedPrimitiveCatalog"

describe("standalone Studio text fields in the UI Reference Library", () => {
  it("registers both canonical fields in the production primitive track", () => {
    expect(STUDIO_HUB_MIGRATED_FAMILIES).toEqual(expect.arrayContaining([
      "Studio Text Input",
      "Studio Text Area",
    ]))
  })

  it("renders both canonical fields in the production primitive track", () => {
    const html = renderToStaticMarkup(<StudioHubPrimitiveMigrationCatalog />)
    expect(html).toContain('data-vt-family="Studio Text Input"')
    expect(html).toContain('data-vt-family="Studio Text Area"')
    expect(html).toContain('data-vt-library-component="StudioTextInput"')
    expect(html).toContain('data-vt-library-component="StudioTextArea"')
  })

  it("renders both standalone fields in the confirmed primitive track", () => {
    const html = renderToStaticMarkup(<StudioHubConfirmedPrimitiveCatalog />)
    expect(html).toContain('Studio Text Input · Standalone')
    expect(html).toContain('Studio Text Area · Standalone')
    expect(html).toContain('data-vt-library-component="StudioTextInput"')
    expect(html).toContain('data-vt-library-component="StudioTextArea"')
    expect(html).toContain('src/studio-ui/primitives/StudioControls.tsx')
    expect(html).toContain('src/styles/studio-control-system.css')
  })
})
