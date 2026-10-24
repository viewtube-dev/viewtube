import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioInterModule } from "./StudioInterModule"

describe("StudioInterModule", () => {
  it("renders a collapsed compact module with accessible disclosure semantics", () => {
    const html = renderToStaticMarkup(
      <StudioInterModule title="ANALYTICS" startIcon={<span>icon</span>} sizeVariant="compact">
        <p>Nested content</p>
      </StudioInterModule>,
    )
    expect(html).toContain('data-vt-studio-inter-module="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-open="false"')
    expect(html).toContain('role="button"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain(">+</span>")
    expect(html).not.toContain("Nested content")
  })

  it("renders expanded content and honors non-collapsible header mode", () => {
    const expanded = renderToStaticMarkup(
      <StudioInterModule title="ANALYTICS" defaultOpen sizeVariant="micro">
        <p>Nested content</p>
      </StudioInterModule>,
    )
    expect(expanded).toContain('data-size="micro"')
    expect(expanded).toContain('data-open="true"')
    expect(expanded).toContain("Nested content")
    expect(expanded).toContain("aria-expanded=\"true\"")

    const fixed = renderToStaticMarkup(
      <StudioInterModule title="STATIC" collapsible={false} sizeVariant="standard">
        <p>Always visible</p>
      </StudioInterModule>,
    )
    expect(fixed).toContain("Always visible")
    expect(fixed).not.toContain('role="button"')
    expect(fixed).not.toContain("aria-expanded=")
  })

  it("supports rich ReactNode titles without narrowing them to native title text", () => {
    const html = renderToStaticMarkup(
      <StudioInterModule title={<><span>AI BRAIN</span><strong> · PROMPTS</strong></>} collapsible={false}>
        <p>Prompt content</p>
      </StudioInterModule>,
    )
    expect(html).toContain("<span>AI BRAIN</span>")
    expect(html).toContain("<strong> · PROMPTS</strong>")
  })

  it("keeps nested module chrome edge-flush without exterior side borders", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-inter-module.css"), "utf8")
    expect(css).toContain('border-bottom: var(--vt-im-stroke) solid #000')
    expect(css).toContain('border-right: var(--vt-im-stroke) solid #000')
    expect(css).toContain('border-left: var(--vt-im-stroke) solid #000')
    expect(css).toContain('width: calc(100% + 16px)')
    expect(css).toContain('margin-inline: -8px')
    expect(css).toContain('text-overflow: clip')
    expect(css).not.toMatch(/\.vt-studio-inter-module\s*\{[^}]*border-left:\s*[^0]/s)
    expect(css).not.toMatch(/\.vt-studio-inter-module\s*\{[^}]*border-right:\s*[^0]/s)
  })
})
