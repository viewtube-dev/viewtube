import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioResponseMetaRow } from "./StudioResponseMetaRow"

describe("StudioResponseMetaRow", () => {
  it("renders a compact title with optional status and trailing metadata", () => {
    const html = renderToStaticMarkup(
      <StudioResponseMetaRow
        title="ANSWER SUMMARY"
        status={<span>VERIFIED</span>}
        metadata={<span>3 sources</span>}
        trailing={<button type="button">Details</button>}
      />,
    )
    expect(html).toContain('data-vt-studio-control="response-meta-row"')
    expect(html).toContain('data-vt-studio-size="compact"')
    expect(html).toContain('aria-label="ANSWER SUMMARY metadata"')
    expect(html).toContain("ANSWER SUMMARY")
    expect(html).toContain("VERIFIED")
    expect(html).toContain("3 sources")
    expect(html).toContain("Details")
  })

  it("keeps optional slots absent when not supplied and supports a custom accessible label", () => {
    const html = renderToStaticMarkup(
      <StudioResponseMetaRow title="SOURCES" aria-label="Evidence sources" />,
    )
    expect(html).toContain('aria-label="Evidence sources"')
    expect(html).toContain("SOURCES")
    expect(html).not.toContain("data-slot=\"status\"")
    expect(html).not.toContain("data-slot=\"metadata\"")
    expect(html).not.toContain("data-slot=\"trailing\"")
  })

  it("defines compact wrapping layout without geometry movement or shadows", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-response-meta-row.css"), "utf8")
    expect(css).toContain("display: flex")
    expect(css).toContain("flex-wrap: wrap")
    expect(css).toContain("min-width: 0")
    expect(css).toContain("overflow-wrap: anywhere")
    expect(css).not.toContain("box-shadow")
    expect(css).not.toContain("transform:")
  })
})
