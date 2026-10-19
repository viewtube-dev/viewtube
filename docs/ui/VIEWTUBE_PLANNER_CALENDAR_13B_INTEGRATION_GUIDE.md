# Planner Calendar (13B) — Adjustment & Integration Guide

**Purpose:** a short handoff for adapting the calendar shown in `ViewTube-Primitives-Components-Source-6.html` and replacing the calendar inside the Project Board toolbox, while keeping it reusable elsewhere.

## What 13B contains

The HTML's **Planner Calendar** is the richer calendar system, initialized by JavaScript for each root matching `[data-planner]`. It is different from the simpler `[data-cal]` date-picker earlier in the file.

It includes:
- A 42-cell, seven-column month grid with adjacent-month days muted.
- Event chips for **Publish, Task, Deadline, Milestone, and Project**.
- Multi-day bars, drag-and-drop rescheduling, selected-day styling, and a selected-day side panel.
- Quick-add UI, per-date notes, and event cards with status/type labels.
- Palette-aware styling through `--pair-a` / `--pair-b`.

## Main source hooks to preserve

| Hook / class | Purpose |
|---|---|
| `[data-planner]` | Calendar root; supports initializing more than one calendar instance. |
| `[data-pl-title]` | Current month/year title. |
| `[data-pl-grid]` | Render target for the 42 day cells. |
| `[data-pl-side-date]` | Selected date heading in the detail panel. |
| `[data-pl-side]` | Selected-date event cards and notes. |
| `[data-pl-add]`, `[data-pl-qadd]` | Add button and quick-add UI. |
| `.vt-planner__*` | Calendar frame, grid, cell, day number, and empty state. |
| `.vt-pev`, `.vt-pev--pub/task/dead/mile/proj` | Event chips and type styling. |
| `.vt-bar`, `.vt-bar--camp`, `.vt-bar--series` | Multi-day timeline bars. |
| `.vt-pcard*`, `.vt-pnote` | Selected-day event cards and notes. |

The CSS is coupled to these class names, so either preserve the hooks during migration or update markup, styles, and behavior together.

## How to adjust it safely

1. **Remove the demo data.** The script seeds sample October 2026 events, multi-day bars, a selected date, and a hard-coded “today” marker. Replace these with props/data from the Project Board; compute today from the actual date instead of checking for 2026-10-11.
2. **Define a canonical event shape.** Map project/publishing records into a view model such as `{ id, type, title, date, status, thumbnail, projectId }`. Keep the calendar from becoming a second owner of project data.
3. **Keep mutations outside the calendar.** Clicking a date/event should call parent callbacks; moving an event should request a schedule update from the Project Board/project service. Do not treat the current in-memory `events`, `bars`, and `notes` arrays as durable storage.
4. **Extract styles.** Move the relevant `.vt-planner__*`, `.vt-pev*`, `.vt-bar*`, `.vt-pcard*`, and `.vt-pnote` rules into the canonical calendar stylesheet. Replace hard-coded colors with existing ViewTube palette tokens where possible.
5. **Replace direct DOM rendering with the app's component conventions.** The source uses `innerHTML`, `document.createElement`, and per-element listeners. When porting into React/TSX, render from data and use component state/callbacks; do not paste this script directly into a React view.
6. **Keep the calendar reusable.** Separate the visual calendar from the Project Board's data source. Give it inputs for events, current month, selected date, and optional multi-day items; expose callbacks for date selection, event selection, event move, and quick-add.
7. **Check responsive layout.** The desktop design includes a grid and side panel. At narrow widths, stack or collapse the side panel, keep controls usable, prevent event chips from overflowing, and verify drag-and-drop has an alternative interaction on touch screens.
8. **Check accessibility.** Use keyboard-operable day buttons, accessible date labels, focus indicators, and a non-drag way to reschedule events. The HTML prototype's calendar cells are `div` elements, so this needs attention in the TSX port.

## Suggested integration contract

Keep the calendar presentational and callback-driven. Exact prop names can follow the existing Project Board conventions.

```ts
type CalendarEventType = "pub" | "task" | "dead" | "mile" | "proj";

type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  title: string;
  date: string;        // ISO date or a normalized date value
  status?: string;
  thumbnailUrl?: string;
  projectId?: string;
};

type PlannerCalendarProps = {
  events: CalendarEvent[];
  selectedDate?: string;
  onSelectDate(date: string): void;
  onSelectEvent(eventId: string): void;
  onMoveEvent?(eventId: string, date: string): void;
  onQuickAdd?(date: string): void;
};
```

This is a proposed integration contract, not an existing API. Multi-day bars and notes can be added as optional data/callbacks if the Project Board needs them.

## Project Board swap checklist

- [ ] Locate the existing Project Board calendar view and its current data owner.
- [ ] Port the 13B markup/styles into a dedicated reusable calendar component; do not replace the whole toolbox.
- [ ] Connect events to canonical projects, publishing packages, tasks, milestones, and scheduled publish dates.
- [ ] Route add/move/select actions through existing project callbacks/services.
- [ ] Preserve the toolbox's canonical header, palette, sizing, and responsive rules.
- [ ] Test month boundaries, leap years, empty dates, multiple events per day, multi-day spans, project switching, reload persistence, mobile layout, and keyboard operation.
- [ ] Reuse the same component elsewhere by supplying a different event list and callbacks, not a copied implementation.

## Important boundary

The source HTML is a self-contained visual/interaction prototype with seeded in-memory data. It is a reference for layout and interactions—not proof of production persistence, channel scheduling, or the application's canonical project/package relationships. Those connections must be supplied by the ViewTube app.
