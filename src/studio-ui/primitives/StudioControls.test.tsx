import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioTextArea, StudioTextInput } from "./StudioControls"
import { StudioHubCompletePrimitiveCatalog } from "../../components/studio-hub/StudioHubCompletePrimitiveCatalog"

describe("standalone Studio text fields", () => {
  it("renders the standard text input with only canonical Studio field markers", () => {
    const html = renderToStaticMarkup(<StudioTextInput aria-label="Title" placeholder="Enter title" />)
    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
    expect(html).toContain('data-size="standard"')
    expect(html).toContain('type="text"')
    expect(html).not.toContain("subtoolbox")
  })

  it("renders compact text input with canonical compact size", () => {
    const html = renderToStaticMarkup(<StudioTextInput sizeVariant="compact" aria-label="Compact title" />)
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-vt-studio-field-kind="text-input"')
  })

  it("renders standard and compact text areas without SubToolbox wrappers", () => {
    const standard = renderToStaticMarkup(<StudioTextArea aria-label="Description" />)
    const compact = renderToStaticMarkup(<StudioTextArea sizeVariant="compact" aria-label="Short description" />)
    expect(standard).toContain('data-vt-studio-field-kind="textarea"')
    expect(standard).toContain('data-size="standard"')
    expect(standard).toContain('rows="4"')
    expect(standard).not.toContain("subtoolbox")
    expect(compact).toContain('data-vt-studio-field-kind="textarea"')
    expect(compact).toContain('data-size="compact"')
  })

  it("renders fixed label-box variants through the canonical input and textarea families", () => {
    const standardInput = renderToStaticMarkup(<StudioTextInput variant="fixed-label" label="TITLE" aria-label="Title" />)
    const compactInput = renderToStaticMarkup(<StudioTextInput variant="fixed-label" label="TITLE" sizeVariant="compact" aria-label="Compact title" />)
    const compactArea = renderToStaticMarkup(<StudioTextArea variant="fixed-label" label="DESCRIPTION" sizeVariant="compact" aria-label="Compact description" />)
    expect(standardInput).toContain('data-vt-studio-field-variant="fixed-label"')
    expect(standardInput).toContain('class="vt-studio-fixed-field-label"')
    expect(standardInput).toContain('data-size="standard"')
    expect(compactInput).toContain('data-size="compact"')
    expect(compactArea).toContain('data-vt-studio-field-kind="textarea"')
    expect(compactArea).toContain('class="vt-studio-fixed-field-label"')
    expect(compactArea).toContain('rows="4"')
  })
})

describe("Studio text field library entries", () => {
  it("renders the standalone Studio text input and textarea as distinct catalog specimens", () => {
    const html = renderToStaticMarkup(<StudioHubCompletePrimitiveCatalog />);
    expect(html).toContain('data-vt-library-component="StudioTextInput"');
    expect(html).toContain('data-vt-library-component="StudioTextArea"');
    expect(html).toContain('aria-label="Canonical Studio text input"');
    expect(html).toContain('aria-label="Canonical Studio text area"');
  });
});

describe("canonical Studio field, selection, and action contracts", () => {
  it("keeps default and placeholder field typography primary and identical", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const contract = css.slice(css.lastIndexOf("/* Canonical Studio Controls contract (single authoritative tail)."))
    const fields = contract.slice(0, contract.indexOf("/* 2. Canonical 44px"))
    expect(fields).toContain("color: var(--vt-field-primary);")
    expect(fields).toContain("-webkit-text-fill-color: var(--vt-field-primary);")
    expect(fields).toContain("-webkit-text-stroke: .5px var(--vt-field-primary);")
    expect(fields).toContain("font: inherit")
    expect(fields).toContain("font-weight: var(--vt-studio-control-font-weight);")
    expect(fields).not.toContain("-webkit-text-stroke: 0 !important")
    expect(fields).toContain("font-size: var(--vt-studio-textarea-standard-font-size, 18px) !important")
    expect(fields).toContain("font-size: var(--vt-studio-textarea-compact-font-size, 14px) !important")
  })

  it("uses the supplied 44px control geometry and explicit indicator colors", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const contract = css.slice(css.lastIndexOf("/* Canonical Studio Controls contract (single authoritative tail)."))
    expect(contract).toContain("width: 75.68px")
    expect(contract).toContain("width: 36.667px")
    expect(contract).toContain("transform: translateX(31.68px)")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-black-indicator svg")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-white-indicator svg")
    expect(contract).toContain(".vt-studio-44-choice.is-checkbox.is-color-swap.is-on svg")
    expect(contract).toContain(".vt-studio-44-switch.is-black-indicator.is-on")
    expect(contract).toContain(".vt-studio-44-choice.is-white-indicator.is-on")
  })

  it("keeps the split-left primitive catalog aligned with the button face layer", () => {
    const catalogCss = readFileSync(resolve(process.cwd(), "src/components/studio-hub/studio-hub-primitive-catalogs.css"), "utf8")
    expect(catalogCss).toContain('.vt-complete-catalog .vt-catalog-split-primitive[data-vt-studio-button="true"] > [data-vt-studio-button-face]')
    expect(catalogCss).toContain("grid-template-columns: var(--h) minmax(0, 1fr) !important")
    expect(catalogCss).toContain("width: 100% !important")
  })

  it("keeps fixed label boxes on the secondary pair and fits compact shadows to their faces", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const controls = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")
    expect(css).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))")
    expect(css).toContain('.vt-studio-fixed-label-field:focus-within > .vt-studio-fixed-field-label')
    expect(css).toContain('button[data-vt-studio-button="true"][data-size="compact"]::before')
    expect(css).toContain('button[data-vt-studio-button="true"][data-size="compact"] {')
    expect(css).toContain("box-shadow: none !important;")
    expect(css).toContain("width: 100%;");
    expect(css).toContain("height: 100%;")
    expect(css).toContain("letter-spacing: -.02em;")
    expect(controls).toContain('letterSpacing: "-0.02em"')
  })

  it("anchors the action shadow while only the face moves", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const contract = css.slice(css.lastIndexOf("/* Canonical Studio Controls contract (single authoritative tail)."))
    expect(contract).toContain('button[data-vt-studio-button="true"]::before')
    expect(contract).toContain("[data-vt-studio-button-face]")
    expect(contract).toContain("transition: transform 150ms ease-out")
    expect(contract).toContain("transition-duration: 300ms")
    expect(contract).toContain("--vt-studio-control-shadow-x:1px")
    expect(contract).toContain("button[data-vt-studio-button=\"true\"][data-split-left=\"true\"] [data-vt-studio-split-rail]")
  })
})

describe("Studio primitive catalog control layout", () => {
  it("puts standard word toggles one per row and centers three compact word-toggle skins", () => {
    const html = renderToStaticMarkup(<StudioHubCompletePrimitiveCatalog />)
    expect(html).toContain('class="vt-catalog-control-variants is-word-toggle-44"')
    expect(html).toContain('class="vt-catalog-control-variants is-word-toggle-28"')
    expect(html).toContain('class="vt-catalog-control-row vt-catalog-word-toggle-row is-word-toggle-44"')
    expect(html).toContain('class="vt-catalog-control-row vt-catalog-word-toggle-row is-word-toggle-28"')
  })
})


describe("Studio text-field module ownership and typography", () => {
  it("exports each labeled field alongside its matching standalone field module", async () => {
    const inputModule = await import("./StudioTextInput")
    const areaModule = await import("./StudioTextArea")
    expect(inputModule.StudioTextInput).toBeDefined()
    expect(inputModule.StudioTextInput).toBeDefined()
    expect(areaModule.StudioTextArea).toBeDefined()
    expect(renderToStaticMarkup(<StudioTextInput variant="floating-label" label="Title" />)).toContain("vt-studio-floating-field")
    expect(renderToStaticMarkup(<StudioTextArea variant="floating-label" label="Description" />)).toContain("vt-studio-floating-field")
    expect(areaModule.StudioTextArea).toBeDefined()
  })

  it("defines the 18px standard and 14px compact typography for both input and textarea", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toMatch(/input\[data-vt-studio-control="true"\]\[data-size="standard"\][\s\S]*?font-size:\s*var\(--vt-studio-text-input-standard-font-size, 18px\) !important/)
    expect(css).toMatch(/input\[data-vt-studio-control="true"\]\[data-size="compact"\][\s\S]*?font-size:\s*var\(--vt-studio-text-input-compact-font-size, 14px\) !important/)
    expect(css).toContain("--vt-studio-textarea-standard-font-size: 18px")
    expect(css).toContain("--vt-studio-textarea-compact-font-size: 14px")
  })
})
