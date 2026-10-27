import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainPageTabs } from "./BrainPageTabs"

describe("BrainPageTabs", () => {
  it("uses the default Studio Split Accordion with accessible destinations and one active tab", () => {
    const html = renderToStaticMarkup(<BrainPageTabs activeTab="review" onChange={() => undefined} />)

    expect(html.match(/role="tab"/g)).toHaveLength(4)
    for (const label of ["CHAT", "PROFILE", "LEARNING", "ACCESS"]) {
      expect(html).toContain(`aria-label="${label}"`)
      expect(html).toContain(`>${label}</span>`)
    }
    expect(html).toContain('data-vt-library-component="StudioSplitAccordion"')
    expect(html).toContain('aria-label="Brain pages"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('data-active="true"')
    expect(html).not.toContain("Prompt Library")
    expect(html).not.toContain("Capabilities Browser")
    expect(html).not.toContain("Channel Context")
  })

  it("keeps navigation on the canonical primitive rather than custom tab geometry", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/brain/BrainPageTabs.tsx"), "utf8")

    expect(source).toContain('import { StudioSplitAccordion, type StudioSplitAccordionItem } from "../../studio-ui"')
    expect(source).toContain("<StudioSplitAccordion")
    expect(source).toContain("<StudioSplitAccordion")
    expect(source).not.toContain("vt-brain-hub-primary-nav__tab")
  })

  it("preserves review deep links and the Brain page's prompt/context launch wiring", () => {
    const brainPage = readFileSync(resolve(process.cwd(), "src/views/AIBrainCommandInterface.tsx"), "utf8")

    expect(brainPage).toContain('searchParams.get("tab")')
    expect(brainPage).toContain('requestedPageTab === "review"')
    expect(brainPage).toContain('<BrainReviewPanel channelId={channelId} />')
    expect(brainPage).toContain('setLauncherMode("prompts"); setPromptRailOpen(true)')
    expect(brainPage).toContain('setContextRailOpen(true)')
  })
})
