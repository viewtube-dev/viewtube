import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StudioCalendarEventChip, StudioCalendarMediaRail } from "../../studio-ui/primitives/StudioCalendarPrimitives"

describe("Studio Calendar control compositions", () => {
  it("renders event chips with semantic event identity and accessible action", () => {
    const html = renderToStaticMarkup(
      <StudioCalendarEventChip
        label="Publish episode"
        kind="publish"
        status="scheduled"
        selected
        onClick={() => undefined}
      />,
    )
    expect(html).toContain('data-vt-calendar-event="true"')
    expect(html).toContain('data-event-kind="publish"')
    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain("PUBLISH EPISODE")
  })

  it("supports landscape and portrait media rails without changing the project data owner", () => {
    const html = renderToStaticMarkup(
      <>
        <StudioCalendarMediaRail aspectRatio="16:9" label="Landscape thumbnail" />
        <StudioCalendarMediaRail aspectRatio="9:16" label="Shorts thumbnail" />
      </>,
    )
    expect(html).toContain('data-aspect-ratio="16:9"')
    expect(html).toContain('data-aspect-ratio="9:16"')
    expect(html).toContain('aria-label="Landscape thumbnail"')
    expect(html).toContain('aria-label="Shorts thumbnail"')
    expect(html).toContain("vt-studio-calendar-media-rail")
  })
})
