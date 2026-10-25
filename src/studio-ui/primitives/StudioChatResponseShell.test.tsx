import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioChatResponseShell } from "./StudioChatResponseShell"

const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")

describe("StudioChatResponseShell", () => {
  it("composes metadata, response content, evidence, and caller-owned actions", () => {
    const html = renderToStaticMarkup(
      <StudioChatResponseShell
        metadata={<div>ANSWER · VERIFIED</div>}
        evidence={<details><summary>Evidence (3)</summary><p>Source details</p></details>}
        actions={<div role="group" aria-label="Response actions"><button type="button">Copy</button></div>}
      >
        <p>The answer comes first.</p>
      </StudioChatResponseShell>,
    )

    expect(html).toContain('data-vt-studio-control="chat-response-shell"')
    expect(html).toContain('data-slot="metadata"')
    expect(html).toContain('data-slot="response"')
    expect(html).toContain('data-slot="evidence"')
    expect(html).toContain('data-slot="actions"')
    expect(html).toContain("ANSWER · VERIFIED")
    expect(html).toContain("The answer comes first.")
    expect(html).toContain("Source details")
    expect(html).toContain("Copy")
  })

  it("omits optional evidence and actions without creating empty regions", () => {
    const html = renderToStaticMarkup(
      <StudioChatResponseShell aria-label="Assistant response" metadata={<span>Ready</span>}>
        <p>Response only</p>
      </StudioChatResponseShell>,
    )

    expect(html).toContain('aria-label="Assistant response"')
    expect(html).toContain("Response only")
    expect(html).not.toContain('data-slot="evidence"')
    expect(html).not.toContain('data-slot="actions"')
  })

  it("supports size variants and preserves custom classes", () => {
    const html = renderToStaticMarkup(
      <StudioChatResponseShell sizeVariant="standard" className="brain-answer">
        Response
      </StudioChatResponseShell>,
    )
    expect(html).toContain('data-vt-studio-size="standard"')
    expect(html).toContain('class="vt-studio-chat-response-shell brain-answer"')
  })

  it("is registered in the Confirmed Primitive Library with source provenance", () => {
    expect(catalog).toContain('data-vt-library-component="StudioChatResponseShell"')
    expect(catalog).toContain('primitive="StudioChatResponseShell"')
    expect(catalog).toContain('css="src/styles/studio-chat-response-shell.css"')
  })

  it("uses responsive, wrapping layout without shadows or geometry movement", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-chat-response-shell.css"), "utf8")
    expect(css).toContain("min-width: 0")
    expect(css).toContain("overflow-wrap: anywhere")
    expect(css).toContain("@media")
    expect(css).not.toContain("box-shadow")
    expect(css).not.toContain("transform:")
  })
})
