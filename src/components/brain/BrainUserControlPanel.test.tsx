import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainUserControlPanel } from "./BrainUserControlPanel"

describe("BrainUserControlPanel Studio controls", () => {
 it("uses Studio checkboxes and buttons while preserving accessible descriptions", () => {
  const html = renderToStaticMarkup(
   <BrainUserControlPanel open channelId="channel-1" onClose={() => undefined} />,
  )
  expect(html).toContain('role="region" aria-label="Brain user controls"')
  expect(html).toContain('role="checkbox"')
  expect(html).toContain('data-vt-studio-control="true"')
  expect(html).toContain('aria-labelledby=')
  expect(html).toContain('aria-describedby=')
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Brain enabled")
  expect(html).toContain("De-identified research contribution")
  expect(html).toContain("Use global defaults")
  expect(html).toContain("Done")
 })
})
