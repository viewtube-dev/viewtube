import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioDropdown } from "./primitives/StudioDropdown"
import { StudioActionButton, StudioButton, StudioCloseableBadge, StudioIconButton, StudioSplitLeftButton, StudioTagEditor } from "./primitives/StudioControls"

describe("Studio Hub canonical controls", () => {
  it("marks every action with the Studio ownership boundary and registered size", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioButton sizeVariant="compact">Compact</StudioButton>
        <StudioActionButton>Action</StudioActionButton>
        <StudioIconButton label="Icon" icon={<span>i</span>} />
        <StudioSplitLeftButton icon={<span>i</span>}>Split</StudioSplitLeftButton>
      </>,
    )

    expect(html).toContain('data-vt-studio-control="true"')
    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-vt-studio-action-button="true"')
    expect(html).toContain('data-icon-only="true"')
    expect(html).toContain('data-split-left="true"')
    expect(html).toContain("data-vt-studio-split-rail")
    expect(html).toContain("data-vt-studio-button-face")
    expect(html).toContain('data-vt-studio-button="true"')
  })

  it("centers split-left icon rails and labels against the full control height", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain('button[data-vt-studio-button="true"][data-split-left="true"] [data-vt-studio-split-rail]')
    expect(css).toContain("height: 100%")
    expect(css).toContain("place-items: center")
    expect(css).toContain('button[data-vt-studio-button="true"][data-split-left="true"] [data-vt-studio-split-label]')
    expect(css).toContain("align-items: center")
  })

  it("keeps split-left size tokens aligned with explicit height geometry", () => {
    const html = renderToStaticMarkup(
      <StudioSplitLeftButton icon={<span>i</span>} heightVariant="28">Compact split</StudioSplitLeftButton>,
    )

    expect(html).toContain('data-size="compact"')
    expect(html).toContain('data-height-variant="28"')
  })

  it("uses the global standard/compact icon tokens for split-left controls and keeps smaller presets opt-in", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("--vt-studio-control-icon-size: var(--vt-studio-44-icon-size, 38px)")
    expect(css).toContain("--vt-studio-control-icon-stroke: var(--vt-studio-44-icon-stroke, 1.9)")
    expect(css).toContain("--vt-studio-control-icon-size: var(--vt-studio-28-icon-size, 24px)")
    expect(css).toContain("--vt-studio-control-icon-stroke: var(--vt-studio-28-icon-stroke, 2.0)")
    expect(css).toContain('[data-split-left="true"][data-icon-size-variant="current"]')
    expect(css).toContain('[data-split-left="true"][data-icon-size-variant="moderate"]')

    const standard = renderToStaticMarkup(<StudioSplitLeftButton icon={<span>i</span>}>Standard</StudioSplitLeftButton>)
    const compact = renderToStaticMarkup(<StudioSplitLeftButton icon={<span>i</span>} sizeVariant="compact">Compact</StudioSplitLeftButton>)
    expect(standard).toContain('data-size="standard"')
    expect(compact).toContain('data-size="compact"')
    expect(standard).toContain('data-icon-size-variant="large"')
    expect(compact).toContain('data-icon-size-variant="large"')
  })

  it("defines one final field and split-left geometry contract", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    // Assert across the current layered stylesheet; the old "1. Canonical field family" marker was retired.
    const finalContract = css

    expect(finalContract).toContain("caret-shape: block")
    expect(finalContract).toContain("border-right:var(--vt-studio-control-stroke) solid #000")
    expect(finalContract).not.toContain("--vt-studio-control-hover-offset")
    expect(finalContract).toContain("--vt-studio-control-icon-size:18px")
    expect(finalContract).toContain('button[data-vt-studio-control="true"][data-vt-studio-action-button')
  })

  it("keeps split-left and split-stepper geometry stable without pseudo-shadow layers", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).not.toContain('button[data-vt-studio-button="true"][data-split-left="true"]::before')
    expect(css).not.toContain(".vt-studio-split-stepper::before")
    expect(css).toContain('button[data-vt-button-shadow="true"]')
    const splitStepper = css.slice(css.indexOf(".vt-studio-split-stepper {"), css.indexOf('.vt-studio-split-stepper[data-size="compact"]'))
    expect(splitStepper).not.toContain("box-shadow")
    expect(splitStepper).not.toContain("--vt-studio-control-shadow-x")
  })

  it("uses canonical standard and compact tokens for flat split-left badges", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const badge = css.slice(css.indexOf(".vt-studio-split-left-badge {"), css.indexOf("/* Choice controls must occupy the full 44px standard control height. */"))

    expect(badge).toContain("--vt-studio-badge-height: var(--vt-studio-44-height, 44px)")
    expect(badge).toContain("--vt-studio-badge-stroke: var(--vt-studio-44-stroke, 3px)")
    expect(badge).toContain("--vt-studio-badge-radius: var(--vt-studio-44-radius, 6px)")
    expect(badge).toContain("--vt-studio-badge-height: var(--vt-studio-28-height, 28px)")
    expect(badge).toContain("--vt-studio-badge-stroke: var(--vt-studio-28-stroke, 2px)")
    expect(badge).toContain("--vt-studio-badge-radius: var(--vt-studio-28-radius, 4px)")
    expect(badge).not.toContain(".vt-studio-split-left-badge::before")
    expect(badge).not.toContain("box-shadow")
    expect(badge).not.toContain("--vt-studio-badge-shadow")
    expect(badge).not.toContain("--vt-studio-badge-radius: 10px")
    expect(badge).not.toContain("--vt-studio-badge-radius: 7px")
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

  it("renders the canonical closeable badge anatomy and accessible close action", () => {
    const html = renderToStaticMarkup(<StudioCloseableBadge label="Featured" entering={false} />)
    expect(html).toContain('data-vt-studio-badge="true"')
    expect(html).toContain("FEATURED")
    expect(html).toContain('aria-label="Remove FEATURED"')
    expect(html).toContain("vt-studio-closeable-badge__close")
  })

  it("renders the canonical tag editor actions and compact Studio composer contract", () => {
    const html = renderToStaticMarkup(<StudioTagEditor defaultValue={["tag one"]} />)
    expect(html).toContain('data-vt-studio-tag-editor="true"')
    expect(html).toContain("TAG ONE")
    expect(html).toContain('aria-label="Add tag"')
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    expect(css).toContain("@keyframes vt-studio-badge-enter")
    expect(css).toContain("@keyframes vt-studio-badge-swap")
    expect(css).toContain(".vt-studio-tag-editor__fly")
    expect(css).toContain("prefers-reduced-motion: reduce")
  })

  it("keeps the simple dropdown single-select and Studio-palette driven", () => {
    const html = renderToStaticMarkup(
      <StudioDropdown
        ariaLabel="Choose one"
        options={[{ value: "one", label: "Option One" }, { value: "two", label: "Option Two" }]}
        defaultValue="one"
      />,
    )
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-control-system.css"), "utf8")
    const primitive = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioDropdown.tsx"), "utf8")

    expect(html).toContain('aria-haspopup="listbox"')
    expect(html).not.toContain("aria-multiselectable")
    expect(html).not.toContain("vt-studio-legend-check")
    expect(primitive).not.toContain("vt-studio-legend-check")
    expect(primitive).not.toContain("aria-multiselectable")
    expect(css).toContain(".vt-studio-dropdown-menu")
    expect(css).toContain("background: var(--vt-studio-control-accent, var(--pair-a, #36e0f6))")
    expect(css).toContain("background: #fff")
    expect(css).toContain("background: var(--vt-studio-control-secondary, var(--pair-b, #ff7f6b))")
    expect(css).toContain(".vt-studio-dropdown-option[data-selected=\"true\"]")
  })

})
