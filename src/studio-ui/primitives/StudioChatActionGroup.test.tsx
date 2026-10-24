import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioChatActionGroup } from "./StudioChatActionGroup"

const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")

describe("StudioChatActionGroup", () => {
  it("renders caller-owned actions in an accessible, compact group", () => {
    const html = renderToStaticMarkup(
      <StudioChatActionGroup aria-label="Answer actions">
        <button type="button">Copy</button>
        <button type="button">Retry</button>
        <button type="button">Edit</button>
      </StudioChatActionGroup>,
    )
    expect(html).toContain('data-vt-studio-control="chat-action-group"')
    expect(html).toContain('data-vt-studio-size="compact"')
    expect(html).toContain('role="group"')
    expect(html).toContain('aria-label="Answer actions"')
    expect(html).toContain("Copy")
    expect(html).toContain("Retry")
    expect(html).toContain("Edit")
  })

  it("supports size variants and preserves custom classes", () => {
    const html = renderToStaticMarkup(
      <StudioChatActionGroup sizeVariant="micro" className="answer-tools" aria-label="Answer tools">
        <span>Use in project</span>
      </StudioChatActionGroup>,
    )
    expect(html).toContain('data-vt-studio-size="micro"')
    expect(html).toContain('class="vt-studio-chat-action-group answer-tools"')
    expect(html).toContain("Use in project")
  })

  it("is registered in the Confirmed Primitive Library with source provenance", () => {
    expect(catalog).toContain('data-vt-library-component="StudioChatActionGroup"')
    expect(catalog).toContain('primitive="StudioChatActionGroup"')
    expect(catalog).toContain('css="src/styles/studio-chat-action-group.css"')
  })

  it("uses a wrapping flex layout without shadows or geometry movement", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-chat-action-group.css"), "utf8")
    expect(css).toContain("display: flex")
    expect(css).toContain("flex-wrap: wrap")
    expect(css).toContain("min-width: 0")
    expect(css).toContain("gap: 4px")
    expect(css).not.toContain("box-shadow")
    expect(css).not.toContain("transform:")
  })
})
