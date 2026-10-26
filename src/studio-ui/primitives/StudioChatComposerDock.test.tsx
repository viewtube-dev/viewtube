import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioChatComposerDock } from "./StudioChatComposerDock"

const renderDock = (layout?: "inline-actions" | "toolbar-actions") =>
  renderToStaticMarkup(
    <StudioChatComposerDock
      layout={layout}
      field={<textarea aria-label="Message" />}
      tray={<button type="button">Tools</button>}
      action={<button type="button">Send</button>}
    />,
  )

describe("StudioChatComposerDock", () => {
  it("preserves the existing inline-actions layout by default", () => {
    const html = renderDock()

    expect(html).toContain('data-vt-composer-layout="inline-actions"')
    expect(html.indexOf('aria-label="Composer tools"')).toBeLessThan(html.indexOf('aria-label="Message"'))
    expect(html.indexOf('aria-label="Message"')).toBeLessThan(html.indexOf(">Send</button>"))
    expect(html).toContain('data-vt-composer-part="field-row"')
  })

  it("supports a bottom toolbar after the message field", () => {
    const html = renderDock("toolbar-actions")

    expect(html).toContain('data-vt-composer-layout="toolbar-actions"')
    expect(html.indexOf('aria-label="Message"')).toBeLessThan(html.indexOf('aria-label="Composer tools"'))
    expect(html.indexOf('aria-label="Composer tools"')).toBeLessThan(html.indexOf(">Send</button>"))
    expect(html).toContain('data-vt-composer-part="bottom-row"')
  })
})
