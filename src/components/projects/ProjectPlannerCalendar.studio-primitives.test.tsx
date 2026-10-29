import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
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
  it("integrates the shared Studio primitives without creating a parallel calendar store", () => {
    const calendar = readFileSync(resolve(process.cwd(), "src/components/projects/ProjectPlannerCalendar.tsx"), "utf8")
    const styles = readFileSync(resolve(process.cwd(), "src/components/projects/ProjectPlannerCalendar.css"), "utf8")
    expect(calendar).toContain('import "./ProjectPlannerCalendar.css"')
    expect(calendar).toContain("StudioCalendarEventChip")
    expect(calendar).toContain("StudioCalendarMediaRail")
    expect(calendar).toContain("StudioCloseableBadge")
    expect(calendar).toContain("StudioCheckbox")
    expect(calendar).toContain("updateProject(projectId, { tasks, updatedAt: Date.now() })")
    expect(calendar).toContain("StudioSplitLeftButton")
    expect(calendar).toContain("StudioSquareIconButton")
    expect(calendar).toContain("StudioDropdown")
    const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")
    expect(catalog).toContain("Calendar Event & Media Rails")
    expect(catalog).toContain("StudioCalendarEventChip")
    expect(catalog).toContain("StudioCalendarMediaRail")
    expect(calendar).toContain("updateProject(project.id, { publishDate: selectedDate")
    expect(calendar).toContain("project.tasks")
    expect(calendar).toContain("getContentBuild(project.contentBuildId)")
    expect(calendar).toContain("getProjectCalendarPublicationBadge")
    expect(calendar).toContain("StudioCheckbox")
    expect(calendar).not.toContain("localStorage")
    expect(calendar).not.toContain("<style>")
    expect(styles).toContain("grid-template-columns:repeat(7,minmax(0,1fr))")
    expect(styles).toContain("@media (max-width: 420px)")
  })

})
