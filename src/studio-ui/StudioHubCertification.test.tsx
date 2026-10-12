import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioDropdown } from "./primitives/StudioDropdown"
import { StudioButton, StudioIconButton, StudioSplitLeftButton } from "./primitives/StudioControls"

describe("Studio Hub canonical controls", () => {
  it("marks every action with the Studio ownership boundary and registered size", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioButton sizeVariant="compact">Compact</StudioButton>
        <StudioIconButton label="Icon" icon={<span>i</span>} />
        <StudioSplitLeftButton icon={<span>i</span>}>Split</StudioSplitLeftButton>
      </>,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-icon-only="true"')
    expect(html).toContain('data-split-left="true"')
    expect(html).toContain("data-vt-studio-split-rail")
  })

  it("centers split-left icon rails and labels against the full control height", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain('button[data-vt-studio-control][data-split-left="true"] > [data-vt-studio-split-rail]')
    expect(css).toContain("height: 100%")
    expect(css).toContain("place-items: center")
    expect(css).toContain('button[data-vt-studio-control][data-split-left="true"] > [data-vt-studio-split-label]')
    expect(css).toContain("align-items: center")
  })

  it("keeps disconnected dropdown messaging inside the canonical trigger", () => {
    const html = renderToStaticMarkup(
      <StudioDropdown
        ariaLabel="Video selector"
        options={[]}
        connectionMessage="Connect your YouTube channel to load videos"
      />,
    )

    expect(html).toContain('data-vt-studio-dropdown="true"')
    expect(html).toContain('data-dropdown-trigger="true"')
    expect(html).toContain("Connect your YouTube channel to load videos")
    expect(html).toContain('aria-haspopup="listbox"')
  })
})
