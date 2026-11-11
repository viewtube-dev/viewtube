import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { BrainWorkspaceNavigation } from "./BrainWorkspaceNavigation"

describe("BrainWorkspaceNavigation", () => {
  it("exposes the existing Brain and adjacent workspace routes with accessible names", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/ai-brain"]}>
        <BrainWorkspaceNavigation />
      </MemoryRouter>,
    )

    expect(markup).toContain('aria-label="Brain workspace navigation"')
    expect(markup).toContain('data-vt-brain-part="workspace-route-link"')
    expect(markup).toContain('aria-label="Brain chat"')
    expect(markup).toContain('aria-label="Brain command"')
    expect(markup).toContain('aria-label="Analytics"')
    expect(markup).toContain('aria-label="Projects"')
    expect(markup).toContain('aria-label="Studio"')
    expect(markup).toContain('aria-current="page"')
  })
})
