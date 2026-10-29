# ViewTube Studio Calendar — Primitive Integration & Copy Contract

**Date:** 2026-10-29  
**Target branch:** `master/consolidated-feature-integration`  
**Implementation branch:** `feat/studio-calendar-controls-integration-2026-10-29`  
**Canonical data owner:** Projects / Project records; no second calendar store  
**Status:** Implementation in progress; release gates not yet certified

## Product contract

The Studio Calendar is the publishing-calendar view inside the existing Projects page. Preserve the current Board/Calendar toggle, selected-day detail panel, month navigation, quick scheduling/moving, unscheduling, project opening, and task visibility.

The calendar must continue to read Projects and their tasks from the existing Brain/Projects owner. A date change must continue to call `updateProject` for `publishDate`; no calendar-specific localStorage, independent project list, or parallel schedule database is introduced.

The visual language stays neo-brutalist and uses the canonical Studio controls for controls and tags. Layout-specific calendar geometry belongs to the calendar stylesheet; primitive geometry and state remain owned by the Studio primitives.

## Phase tracker

| Phase | Scope | Status | Completion evidence / remaining gate |
|---|---|---|---|
| 1. Source audit | Inspect the current Projects page, Board/Calendar owner, project date/task fields, and canonical Studio controls | **Complete** | `ProjectCalendarPage` → `ProjectBoardWorkspace` → `EmbeddedPublishingSchedule` → `ProjectPlannerCalendar`; schedule writes use the canonical project record |
| 2. Standalone workbench | Preserve the standalone interaction/design workbench before production migration | **Complete** | `docs/ui/prototypes/VIEWTUBE_STUDIO_CALENDAR_STUDIO_PRIMITIVE_LIBRARY.html` is checked in |
| 3. Studio primitives | Add reusable event-chip and 16:9/9:16 media-rail compositions; expose and catalogue them | **Implemented; verification pending** | `StudioCalendarEventChip`, `StudioCalendarMediaRail`, public exports, confirmed-library specimens, and focused regression test added |
| 4. Validation | Run focused tests, CSS parsing, typecheck, production build, full suite, and mobile/browser checks | **Pending** | CI must confirm tests and typecheck; manually inspect desktop, narrow phone, portrait/landscape media rails, keyboard focus, and reduced motion |
| 5. Projects integration | Use Studio primitives in the existing calendar without replacing its state/data owner | **Implemented; verification pending** | Calendar controls use Studio button, square icon button, dropdown, closeable badge, event-chip and media-rail primitives; inline styles moved to `ProjectPlannerCalendar.css` |
| 6. Development workflow/data | Preserve project opening, schedule edits, task dates, and identity; reconcile external publishing state only through existing owners | **Partial** | Current Project `publishDate` and `tasks` remain canonical. YouTube scheduled/live-state reconciliation and post-publish checkpoints are not claimed complete |
| 7. Docs, regression, PR | Record copy contract, add tests/catalog coverage, run gates, open PR | **In progress** | This document and focused tests are added; CI/browser review and PR creation remain |

## Creator-facing copy contract

Use short, action-led language. Avoid implementation terms such as “calendar state,” “record mutation,” “projection,” or “ContentBuild” in creator-facing controls.

| Surface | Approved copy |
|---|---|
| Project Builder subtitle | “Plan channel priorities and take each project from idea to publication” |
| Project Board subtitle | “Track production stages and schedule publication dates” |
| Storyboard Studio subtitle | “Shape scenes, sequences, and the visual story before editing” |
| Selected-day heading | “Schedule for” |
| Selected-day summary | “N scheduled projects · N tasks” (singularize each count in the UI) |
| Empty day | “Nothing planned for this day yet. Choose a project below to schedule it.” |
| Schedule selector group | “Schedule a project” |
| Selector accessible name | “Choose project to schedule or move” |
| Selector placeholder | “CHOOSE A PROJECT” |
| Schedule action | “Schedule project here” |
| Move action | “Move project here” |
| No-project state | “NO PROJECTS AVAILABLE” with helper “CREATE A PROJECT FIRST” |
| Schedule feedback | “Choose a project to schedule it for this date.” |
| Successful schedule feedback | “{project title} scheduled for {full date}.” |
| Unschedule feedback | “{project title} removed from the publishing calendar.” |
| Calendar footer | “Schedule changes save to the project” |
| Day navigation labels | “Previous month”, “Next month”, “Today” |
| Event types | “Publish”, “Task”, “Milestone”, “Reminder”, “Deadline” |
| Project row action | “View project” |
| Task state | “Completed” / “Not completed” |

The design uses uppercase Studio faces for compact control labels; explanatory helper text remains plain language. Every icon-only action needs a meaningful accessible label.

## Primitive responsibilities

- **StudioCalendarEventChip**: compact event identity built on the shared spectrum tag; carries event kind/status and supports removable events through the canonical closeable badge.
- **StudioCalendarMediaRail**: ratio-aware thumbnail/event composition supporting `16:9` landscape and `9:16` portrait plus left/right/double rails. Rails use the semantic secondary color and a single divider.
- **Studio controls**: own button, dropdown, tag, close interaction, focus and size behavior.
- **ProjectPlannerCalendar**: owns calendar view state only (cursor and selected date), and reads/writes the existing Project owner.
- **Project**: remains the source for `publishDate`, `thumbnailUrl`, and project task due dates.
- **Standalone prototype**: a visual/interaction reference only; its demo data is not production persistence.

## Release checklist

- [ ] Focused Studio Calendar primitive tests pass.
- [ ] Confirmed catalog coverage audit passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm test` passes, or all failures are traced and classified without suppressing tests.
- [ ] Browser verification at desktop, narrow mobile portrait, and landscape is complete.
- [ ] Keyboard navigation and screen-reader labels are verified.
- [ ] Reduced-motion behavior is verified.
- [ ] Project schedule changes are verified to persist through the existing Project owner.
- [ ] External YouTube publish/scheduled state is reconciled only through its canonical integration; no fake status or inferred sync.
- [ ] PR is opened against `master/consolidated-feature-integration` with honest verification results.
