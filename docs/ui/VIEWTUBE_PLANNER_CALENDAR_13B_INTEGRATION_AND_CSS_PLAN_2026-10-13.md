# Planner Calendar (HTML Component 13b): Integration and CSS Plan

Date: 2026-10-13  
Target branch: `master/consolidated-feature-integration`  
Source: `ViewTube-Primitives-Components-Source-6.html`, section **13b — Planner Calendar**

## Purpose

Prepare the existing 13b Planner Calendar as a reusable calendar view that can replace the current calendar in the Project Board toolbox and later be reused by other Studio Hub/project workflows. This is a focused integration guide, not a request to copy the standalone demo unchanged.

## What component 13b contains

- Month navigation and a 7-column, 42-cell month grid.
- Date selection and a right-side details panel.
- Event chips for publishing dates, tasks, deadlines, milestones, and projects.
- Multi-day bars for campaign/series ranges.
- Drag-and-drop movement of event chips and multi-day bars.
- Quick-add menu, legend, per-date notes, and project/event detail cards.
- Responsive CSS: at widths at or below 640px, the detail panel moves below the calendar.

The relevant class family is `.vt-planner*`, with event chips `.vt-pev*`, multi-day bars `.vt-bar*`, detail cards `.vt-pcard*`, notes `.vt-pnote*`, and quick-add menu `.vt-qadd*`. Styling uses shared tokens such as `--vt-stroke`, `--vt-radius`, `--vt-shadow`, `--vt-font`, `--vt-h`, `--pair-a`, and `--pair-b`.

## Minimal integration plan

1. **Extract the component structure and CSS** into the project’s canonical calendar component and stylesheet locations. Preserve the 13b class family initially to make visual parity and debugging straightforward; avoid bringing unrelated component-library styles with it.
2. **Replace demo-owned state with props/callbacks.** Pass in the visible month, selected date, events, multi-day ranges, notes, and available event types. Emit callbacks for month change, date selection, event move, quick-add, and note changes. The parent Project Board/workspace remains the source of truth.
3. **Map real project records to calendar items.** Use stable project/event/package IDs and real dates/status/type/thumbnail references. Do not treat the hard-coded October 2026 seed data or gradient thumbnail placeholders as real data.
4. **Connect interactions to existing project workflows.** A date click selects a day; event click opens the relevant project/package/task; drag-and-drop requests a date change through the parent callback; quick-add opens the existing create flow or a parent-provided handler.
5. **Add the calendar to Project Board as a view option** beside the current Board view. Keep its existing toolbox header and canonical `ToolboxHeaderToggle`/view-toggle behavior. Do not duplicate header controls inside the calendar.
6. **Make it reusable elsewhere** by keeping project-specific navigation and data fetching outside the calendar. Other toolboxes should be able to pass a different event source and handle the same callbacks.

## UI/CSS adjustment plan

- **Tokenize colors:** replace hard-coded event/legend colors with the app’s approved semantic palette tokens where available; keep type distinctions readable when palette assignments change.
- **Use canonical design tokens:** map borders, radii, shadows, fonts, icon sizes, and stroke widths to existing ViewTube primitives/tokens instead of defining a parallel design system.
- **Respect container sizing:** the source sets `width: min(100%, 720px)`. Remove or parameterize the 720px cap so the component can fill the Project Board toolbox container; use `min-width: 0` and avoid forcing page-level width.
- **Responsive layout:** retain the side-panel-below-grid breakpoint as a starting point, then verify narrow mobile and landscape layouts. Ensure quick-add stays inside the calendar bounds and is not clipped.
- **Accessibility:** use buttons or grid/date-button semantics for interactive days and event actions, keyboard navigation/focus states, and accessible labels for event type/status. Do not rely on color alone.
- **Interaction polish:** show clear focus, selected, today, drag-over, loading, and empty states. Confirm touch alternatives to HTML drag-and-drop.
- **Safe rendering:** replace event-title `innerHTML` interpolation with text nodes or escaped rendering. Keep icon markup static/trusted. This is required before binding user/project content.
- **Remove demo assumptions:** “today” is hard-coded to October 11, 2026; seed events, local notes, local-only event mutations, and local `nextId` are demo behavior. Use actual current-date logic and parent persistence instead.

## Important boundaries

- The HTML prototype is a visual/interaction reference, not production persistence.
- The sample events, notes, and drag-and-drop edits live only in local JavaScript memory; they are lost on reload.
- The prototype's quick-add choices do not themselves create durable Project Board records.
- Do not introduce a new calendar database or parallel project/event identity. Reuse canonical project, task, publishing-package, and schedule records.
- Keep this as a focused component migration; do not rewrite the entire Project Board or calendar system as part of the initial swap.

## Acceptance checklist

- [ ] Project Board can switch between Board and Calendar using the existing canonical header toggle.
- [ ] The calendar renders real records for the active workspace/project scope.
- [ ] Month navigation, date selection, details, and event activation work.
- [ ] Add/move/note actions persist through parent-owned callbacks and survive reload.
- [ ] Multi-day ranges render correctly across the month grid; boundary behavior is tested.
- [ ] Responsive behavior works in mobile portrait and landscape.
- [ ] Keyboard/focus/accessibility and non-drag touch interactions are usable.
- [ ] No hard-coded demo events, demo dates, or local-only mutation paths remain in production.
- [ ] CSS uses canonical ViewTube tokens and does not regress other toolboxes.
- [ ] Component can be reused by another workspace by supplying data and callbacks.

## Suggested implementation order

1. Extract markup and scoped CSS.
2. Define the event/date/callback interface.
3. Replace seed data with Project Board records.
4. Wire selection, open, create, move, and note callbacks.
5. Apply token and responsive CSS adjustments.
6. Add focused component tests and verify Board/Calendar toggle integration.
