# 13B Planner Calendar — Integration Guide

**Source:** `ViewTube-Primitives-Components-Source-6.html`, section **13b — Planner Calendar**.  
**Purpose:** prepare the existing 13B calendar for replacement of the calendar in the Project Board toolbox and reuse in other ViewTube workspaces.

## What the component contains

- Month navigation and a 42-cell, Sunday-first month grid.
- Day markers for publishing dates, tasks, deadlines, milestones, and projects.
- Multi-day campaign/series bars.
- A selected-date detail panel with event cards and notes.
- Quick-add actions and drag-and-drop rescheduling.
- A legend and responsive layout: the detail panel moves below the calendar at widths up to 640px.

## Where to find it in the HTML source

- **Markup:** section headed `13b — Planner Calendar`; root is `<div class="vt-planner" data-planner>`.
- **Styles:** the `/* 13b PLANNER CALENDAR */` block, selectors beginning `.vt-planner`, `.vt-pev`, `.vt-bar`, `.vt-leg`, `.vt-pcard`, `.vt-pnote`, and `.vt-qadd`.
- **Behavior:** the `/* Planner Calendar */` script block. It initializes each `[data-planner]` root and uses `data-pl-*` hooks for navigation, grid, side panel, and quick-add controls.

Keep these three parts together during extraction. Do not copy the entire HTML file's global reset or unrelated component styles into the application.

## Small adjustments before integration

1. **Move tokens to the canonical design system.** Replace standalone colors/sizing with the app's shared palette and spacing tokens. The source uses `--pair-a`, `--pair-b`, `--vt-h`, `--vt-stroke`, `--vt-radius`, and `--vt-icon`.
2. **Scope styles.** Keep the calendar selectors under a component root so the HTML demo's global `button`, `svg`, and reset rules do not leak into Project Board or other tools.
3. **Remove demo data.** The script seeds example events for October 2026, starts on that month, and hard-codes the highlighted date. Replace these with props/state supplied by the host workspace.
4. **Replace in-memory mutations with callbacks.** Quick-add, note edits, and drag/drop currently mutate local JavaScript arrays/objects only. Connect them to the Project/Content Build/calendar data owner; do not treat them as persisted changes.
5. **Use canonical project/event identity.** Each displayed event should carry a stable ID, event type, start date, status, and optional project/package/asset references. Map these to existing project records rather than creating duplicate project data.
6. **Harden rendering.** The demo builds some card content using `innerHTML`. Render project titles, statuses, and notes as text or framework elements so user content cannot be interpreted as HTML.
7. **Check interaction and accessibility.** Keep accessible names on navigation/add controls; use keyboard-operable date/event controls, visible focus, and a non-drag alternative for moving events. Verify the mobile breakpoint inside the actual Toolbox width, not just the viewport width.

## Suggested reusable component contract

Implement as a framework component (for example, `PlannerCalendar`) with data and actions supplied by its parent:

- `events`: canonical events for the visible range.
- `selectedDate` and `visibleMonth`: controlled selection and navigation state.
- `onSelectDate(date)`: date selection.
- `onCreateEvent(type, date)`: quick-add request.
- `onMoveEvent(eventId, newDate)`: rescheduling request.
- `notesByDate` and `onChangeNote(date, text)`: note state and persistence callback.
- Optional `onSelectProject(projectId)`: open the selected project from its event/card.

Treat this as an integration contract, not an existing API in the HTML source. Keep persistence and project/package ownership in the host application.

## Swap-in sequence for Project Board

1. Extract the 13B markup, scoped styles, and behavior into a dedicated component; do not paste the demo script into the Project Board page.
2. Feed it the Project Board's existing project/schedule records and current selected date.
3. Connect create, select, move, and note actions to the existing project/calendar handlers.
4. Place the component in the current Project Board calendar slot, preserving the canonical Toolbox/SubToolbox shell and its header/palette behavior.
5. Verify month changes, date selection, project navigation, event creation/move, notes after reload, empty dates, and the mobile Toolbox layout.
6. Reuse the same component in another workspace by supplying a different event filter/data source—not by cloning its markup or CSS.

## Important limitations of the HTML prototype

The source is a visual/interaction prototype, not a production calendar data system. Its events and multi-day bars are seeded in memory; notes are held in a local JavaScript object; quick-add creates temporary demo records; drag/drop updates those arrays only. Multi-day bars are drawn from their start day within the same month. Persistence, cross-month span layout, backend synchronization, authorization, and production project connections must be implemented by the host app.

**Acceptance rule:** the calendar is not considered integrated until all mutations go through the canonical data owner and survive reload, and the Project Board uses this component through the standard toolbox system.
