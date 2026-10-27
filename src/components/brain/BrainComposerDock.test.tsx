import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
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
  it("keeps the textarea dominant and places Prompts and Send as split-left actions beside it", () => {
    const html = renderComposer()
    const css = readFileSync(resolve(process.cwd(), "src/components/brain/BrainComposerDock.css"), "utf8")

    expect(html).toContain('aria-label="Brain message composer"')
    expect(html).toContain('data-vt-composer-layout="inline-actions"')
    expect(html).toContain('aria-label="Message to ViewTube Brain"')
    expect(html).toContain('data-vt-brain-component="BrainComposerPromptLibraryAction"')
    expect(html).toContain('aria-label="Open prompt library"')
    expect(html).toContain('data-vt-brain-component="BrainComposerSendAction"')
    expect(html).toContain('aria-label="Send message"')
    expect(html.indexOf('aria-label="Message to ViewTube Brain"')).toBeLessThan(html.indexOf('aria-label="Open prompt library"'))
    expect(html.indexOf('aria-label="Open prompt library"')).toBeLessThan(html.indexOf('aria-label="Send message"'))
    expect(css).toContain('grid-template-columns: minmax(0, 4.4fr) minmax(0, 1fr)')
    expect(css).toContain('grid-template-rows: repeat(2, minmax(0, 1fr))')
    expect(css).toContain('gap: 4px')
    expect(html).toContain("Enter to send")
    expect(html).toContain("Shift+Enter for a new line")
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
