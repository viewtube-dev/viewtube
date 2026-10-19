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
    expect(markup).toContain('href="/ai-brain"')
    expect(markup).toContain('href="/tools/brain-command-center"')
    expect(markup).toContain('href="/analytics"')
    expect(markup).toContain('href="/projects"')
    expect(markup).toContain('href="/studio"')
    expect(markup).toContain('aria-current="page"')
  })
})
