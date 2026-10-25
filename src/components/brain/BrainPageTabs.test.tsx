import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainPageTabs } from "./BrainPageTabs"

describe("BrainPageTabs", () => {
  it("renders four accessible page tabs with one roving keyboard stop", () => {
    const html = renderToStaticMarkup(<BrainPageTabs activeTab="review" onChange={() => undefined} />)
    expect(html.match(/role="tab"/g)).toHaveLength(4)
    expect(html).toContain('id="brain-page-tab-chat"')
    expect(html).toContain('id="brain-page-tab-my-brain"')
    expect(html).toContain('id="brain-page-tab-review"')
    expect(html).toContain('id="brain-page-tab-controls"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('aria-controls="brain-page-panel-review"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('tabindex="-1"')
    expect(html).not.toContain("Prompt Library")
    expect(html).not.toContain("Capabilities Browser")
    expect(html).not.toContain("Channel Context")
  })

  it("keeps the tab row flat and sizes the LED from the label text", () => {
    const css = readFileSync(resolve(process.cwd(), "src/styles/studio-led-badge-tab.css"), "utf8")
    expect(css).toContain("--led-size: 1em")
    expect(css).toContain("box-shadow: none")
    expect(css).toContain("gap: 0")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(css).toContain("animation: none !important")
  })

  it("supports the requested animation set and the review deep link wiring", () => {
    const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")
    const brainPage = readFileSync(resolve(process.cwd(), "src/views/AIBrainCommandInterface.tsx"), "utf8")
    for (const animation of ["steady", "prism", "radar", "flare2", "blink"]) {
      expect(catalog).toContain(`animation="${animation}"`)
    }
    expect(brainPage).toContain('searchParams.get("tab")')
    expect(brainPage).toContain('requestedPageTab === "review"')
    expect(brainPage).toContain('<BrainReviewPanel channelId={channelId} />')
    expect(brainPage).toContain('onOpenPrompts={() => setPromptRailOpen(true)}')
    expect(brainPage).toContain('onOpenContext={() => setContextRailOpen(true)}')
  })
})
