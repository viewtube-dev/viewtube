import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { StudioButton, StudioSquareIconButton } from "./StudioControls"
import { STUDIO_CONTROL_SIZE_CONTRACT } from "../tokens"

describe("StudioSquareIconButton interaction effects", () => {
  const icon = <svg viewBox="0 0 24 24"><path d="M2 2h20v20H2z" /></svg>

  it("inherits the canonical 44px and 38px standard icon geometry instead of defining effect-specific sizes", () => {
    expect(STUDIO_CONTROL_SIZE_CONTRACT.standard).toMatchObject({
      height: 44,
      stroke: 3,
      radius: 6,
      iconSize: 38,
    })
    expect(STUDIO_CONTROL_SIZE_CONTRACT.compact).toMatchObject({
      height: 28,
      stroke: 2,
      radius: 4,
      iconSize: 24,
    })
  })


  it("keeps controls flat by default and exposes shadows only as an explicit button primitive feature", () => {
    const flatHtml = renderToStaticMarkup(<StudioButton>Flat</StudioButton>)
    const shadowHtml = renderToStaticMarkup(<StudioButton shadow>Opt-in shadow</StudioButton>)
    expect(flatHtml).not.toContain('data-vt-button-shadow="true"')
    expect(shadowHtml).toContain('data-vt-button-shadow="true"')
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain('button[data-vt-button-shadow="true"]')
    expect(css).not.toMatch(/button[^{}]*:(?:hover|active)[^{}]*\{[^}]*\btransform\s*:/s)
    expect(css).not.toMatch(/button[^{}]*:(?:hover|active)[^{}]*\{[^}]*\bbox-shadow\s*:/s)
  })

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

  it("preserves all four visual skins independently from effects", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSquareIconButton label="Skin one" icon={icon} variant="v1" />
        <StudioSquareIconButton label="Skin two" icon={icon} variant="v2" />
        <StudioSquareIconButton label="Selectable skin" icon={icon} variant="v3" defaultSelected />
        <StudioSquareIconButton label="Black skin" icon={icon} variant="v4" />
      </>,
    )
    expect(html).toContain('data-icon-variant="v1"')
    expect(html).toContain('data-icon-variant="v2"')
    expect(html).toContain('data-icon-variant="v3"')
    expect(html).toContain('data-icon-variant="v4"')
    expect(html).toContain('aria-pressed="true"')
  })

  it("exposes opt-in pop feedback and announces confirmed success", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioSquareIconButton label="Refresh" icon={icon} animate />
        <StudioSquareIconButton label="Save" icon={icon} effect="success" success tooltip="Saved" />
      </>,
    )
    expect(html).not.toContain('data-pop="true"')
    expect(html).toContain('aria-label="Save"')
    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('aria-atomic="true"')
  })

  it("scopes effect animations and respects reduced motion", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("@keyframes vt-studio-square-pop")
    expect(css).toContain("@keyframes vt-studio-square-shake")
    expect(css).toContain("[data-vt-square-flip-inner]")
    expect(css).toContain("[data-vt-square-morph-inner]")
    expect(css).toContain("[data-vt-square-tooltip]")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(css).toContain("180ms cubic-bezier(.2,.8,.2,1)")
    expect(css).toContain("220ms cubic-bezier(.2,.8,.2,1)")
    expect(css).toContain("320ms ease-in-out")
    expect(css).toContain('is-effect-notification[data-notification-pulse="true"]')
    expect(css).not.toContain('is-effect-notification[data-has-badge="true"]:not(:disabled) [data-vt-square-icon-current]')
    expect(css).toContain("450ms cubic-bezier(.2,.8,.2,1)")
    expect(css).toContain("500ms cubic-bezier(.2,.8,.2,1)")
    expect(css).toContain("outline: var(--vt-studio-control-focus-outline-width)")
    expect(css).toContain("outline-offset: var(--vt-studio-control-focus-outline-offset)")
    expect(css).toContain('button[data-vt-studio-icon-button="true"] *')
  })
})
