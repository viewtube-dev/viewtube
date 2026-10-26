import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { BrainComposerDock } from "./BrainComposerDock"

const renderComposer = (overrides: Partial<React.ComponentProps<typeof BrainComposerDock>> = {}) =>
  renderToStaticMarkup(
    <BrainComposerDock
      value=""
      onChange={vi.fn()}
      onSend={vi.fn()}
      onOpenPrompts={vi.fn()}
      onOpenCapabilities={vi.fn()}
      onOpenContext={vi.fn()}
      onOpenJournal={vi.fn()}
      {...overrides}
    />,
  )

describe("BrainComposerDock", () => {
  it("keeps the message field primary and capability entry points concise", () => {
    const html = renderComposer()

    expect(html).toContain('aria-label="Brain message composer"')
    expect(html).toContain("vt-brain-composer-dock")
    expect(html).toContain("vt-brain-composer-input")
    expect(html).toContain("vt-brain-composer-send")
    expect(html).toContain('role="group" aria-label="Brain tools"')
    expect(html).toContain('aria-haspopup="dialog"')
    expect(html).toContain('data-vt-composer-layout="toolbar-actions"')
    expect(html.indexOf('placeholder="What would you like to work on?"')).toBeLessThan(html.indexOf('aria-label="Open Prompt Library"'))
    expect(html).toContain('placeholder="What would you like to work on?"')
    expect(html).toContain('aria-label="Open Prompt Library"')
    expect(html).toContain('aria-label="Open Brain capabilities"')
    expect(html).toContain('aria-label="Open channel context"')
    expect(html).toContain('aria-label="Open AI Journal"')
    expect(html).toContain("Enter to send")
    expect(html).toContain("Shift+Enter for a new line")
    expect(html).not.toContain("Ask about your next video, audience, analytics, goals, SEO, or publishing")
  })

  it("does not enable send for an empty or whitespace-only draft", () => {
    for (const html of [renderComposer(), renderComposer({ value: "   " })]) {
      expect(html).toContain('aria-label="Send message"')
      expect(html).toContain('disabled=""')
    }
  })

  it("enables send for a non-empty draft and disables it while Brain is working", () => {
    const ready = renderComposer({ value: "Review my latest video" })
    const busy = renderComposer({ value: "Review my latest video", busy: true })

    expect(ready).toContain('aria-label="Send message"')
    expect(ready).not.toContain('disabled=""')
    expect(busy).toContain('aria-label="Sending message"')
    expect(busy).toContain('disabled=""')
    expect(busy).toContain("Working")
  })
})
