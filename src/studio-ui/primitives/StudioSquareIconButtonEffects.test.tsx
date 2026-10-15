import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { StudioSquareIconButton } from "./StudioControls"

describe("StudioSquareIconButton interaction effects", () => {
  const icon = <svg viewBox="0 0 24 24"><path d="M2 2h20v20H2z" /></svg>

  it("preserves canonical square geometry while rendering optional effects", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSquareIconButton label="Standard" icon={icon} />
        <StudioSquareIconButton label="Notifications" icon={icon} effect="notification" badge={3} sizeVariant="compact" />
        <StudioSquareIconButton label="Rotate mode" icon={icon} effect="rotated-toggle" defaultSelected />
        <StudioSquareIconButton label="Flip state" icon={icon} activeIcon={<span>back</span>} effect="flip" defaultSelected />
        <StudioSquareIconButton label="Morph state" icon={icon} activeIcon={<span>on</span>} effect="morph" defaultSelected />
        <StudioSquareIconButton label="Context" icon={icon} effect="tooltip" tooltip="Edit item" />
        <StudioSquareIconButton label="Saved" icon={icon} effect="success" success tooltip="Saved" />
      </>,
    )
    expect(html).toContain('data-icon-effect="standard"')
    expect(html).toContain('data-icon-effect="notification"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-vt-square-badge')
    expect(html).toContain('data-icon-effect="rotated-toggle"')
    expect(html).toContain('data-vt-square-flip-inner')
    expect(html).toContain('data-vt-square-morph-inner')
    expect(html).toContain('role="tooltip"')
    expect(html).toContain('data-success="true"')
    expect(html).toContain('data-vt-square-success-label')
    expect(html).toContain('aria-label="Saved"')
  })

  it("scopes effect animations and respects reduced motion", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("@keyframes vt-studio-square-pop")
    expect(css).toContain("@keyframes vt-studio-square-shake")
    expect(css).toContain("[data-vt-square-flip-inner]")
    expect(css).toContain("[data-vt-square-morph-inner]")
    expect(css).toContain("[data-vt-square-tooltip]")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(css).toContain('button[data-vt-studio-icon-button="true"] *')
  })
})
