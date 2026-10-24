import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioDropdown, StudioLegendMultiDropdown, StudioSplitLeftInput, StudioUploadFrame } from "./StudioControls"
import { StudioSplitTextInput } from "./StudioSplitTextInput"

describe("Studio Controls migrations for Vault and Studio Hub", () => {
  it("renders the split-left search input with native input props and the icon rail", () => {
    const html = renderToStaticMarkup(
      <StudioSplitLeftInput icon={<span aria-hidden="true">⌕</span>} value="thumbnail" placeholder="Search assets…" aria-label="Search Vault assets" />,
    )
    expect(html).toContain('data-vt-studio-username-input="true"')
    expect(html).toContain('aria-label="Search Vault assets"')
    expect(html).toContain('placeholder="Search assets…"')
    expect(html).toContain('value="thumbnail"')
  })

  it("supports a single-select legend dropdown without multi-select affordances", () => {
    const html = renderToStaticMarkup(
      <StudioLegendMultiDropdown
        label="Sort"
        accessibleLabel="Sort assets"
        selectionMode="single"
        value={["recent"]}
        options={[{ value: "recent", label: "RECENT" }, { value: "name", label: "NAME" }]}
      />,
    )
    expect(html).toContain('data-vt-studio-dropdown-variant="single-select"')
    expect(html).toContain('aria-multiselectable="false"')
    expect(html).toContain("RECENT")
    expect(html).not.toContain("CLEAR ALL")
  })

  it("supports multiple files and preserves the accepted types on the canonical upload frame", () => {
    const html = renderToStaticMarkup(
      <StudioUploadFrame
        multiple
        accept="image/*,video/*,audio/*,.pdf,.txt,.md,.json,.csv,.zip"
        aria-label="Vault asset import"
      />,
    )
    expect(html).toContain('multiple=""')
    expect(html).toContain('accept="image/*,video/*,audio/*,.pdf,.txt,.md,.json,.csv,.zip"')
    expect(html).toContain('aria-label="Vault asset import"')
  })
  it("renders the simple dropdown as a variant of the canonical dropdown", () => {
    const html = renderToStaticMarkup(
      <StudioDropdown
        variant="simple"
        ariaLabel="Simple dropdown"
        defaultValue="balanced"
        options={[{ value: "balanced", label: "Balanced" }, { value: "focused", label: "Focused" }]}
      />,
    )
    expect(html).toContain('data-vt-studio-dropdown-variant="simple"')
    expect(html).toContain('data-vt-studio-dropdown')
    expect(html).toContain("Balanced")
  })

  it("renders split text input rails as part of one shared shell", () => {
    const html = renderToStaticMarkup(
      <StudioSplitTextInput
        sizeVariant="compact"
        split="left"
        leftIcon={<span aria-hidden="true">⌕</span>}
        aria-label="Search assets"
        placeholder="TYPE HERE"
      />,
    )
    expect(html).toContain('data-vt-studio-split-shell="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('aria-label="Search assets"')
    expect(html).toContain('placeholder="TYPE HERE"')
    expect(html).toContain('data-rail="start"')
  })

})
