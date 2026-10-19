import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { StudioBrainStatusIndicator } from "../../studio-ui/primitives/StudioControls"

describe("StudioBrainStatusIndicator", () => {
 it("renders a rectangular status badge with a centered lens ring and a readable label", () => {
  const html = renderToStaticMarkup(<StudioBrainStatusIndicator status="running" label="Running" />)
  expect(html).toContain('data-vt-library-component="StudioBrainStatusIndicator"')
  expect(html).toContain('data-status="running"')
  expect(html).toContain('class="vt-studio-brain-status__lens"')
  expect(html).toContain("Running")
  expect(html).toContain('data-variant="dark"')
 })
 it("supports tinted variants and reduced-motion-friendly pulse disabling", () => {
  const html = renderToStaticMarkup(<StudioBrainStatusIndicator status="warning" label="Warning" variant="tinted" size="micro" pulse={false} />)
  expect(html).toContain('data-variant="tinted"')
  expect(html).toContain('data-size="micro"')
  expect(html).toContain('data-pulse="false"')
 })
})
