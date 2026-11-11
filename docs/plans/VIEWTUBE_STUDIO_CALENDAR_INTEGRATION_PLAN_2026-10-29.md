# ViewTube Studio Calendar — Primitive Integration & Copy Contract

**Date:** 2026-10-29  
**PR target branch:** `fix/studio-controls-regression-recovery-2026-10-31`  
**Implementation branch:** `feat/calendar-resource-analytics-consolidation-2026-11-11`  
**Canonical data owner:** Projects / Project records; no second calendar store  
**Status:** Phases 0–3 implementation in progress on the recovery-targeted branch; runtime verification and release gates remain open

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
| 6. Development workflow/data | Preserve project opening, schedule edits, task dates, and identity; reconcile external publishing state only through existing owners | **Integrated locally; external refresh remains pending** | Current Project `publishDate` and `tasks` remain canonical; saved ContentBuild YouTube binding status is displayed and schedule-date drift is surfaced. This is a read-only saved-state view, not a live YouTube API refresh. Post-publish checkpoints remain outside this phase |
| 7. Docs, regression, PR | Record copy contract, add tests/catalog coverage, run gates, open PR | **In progress** | This document and focused tests are added; CI/browser review and PR creation remain |


## Recovery-branch execution record — phases 0–3

### Phase 0 — source and branch reconciliation

- The recovery branch is the PR base: `fix/studio-controls-regression-recovery-2026-10-31`.
- The implementation branch is based directly on that recovery branch, preserving its 28 commits that are not present on `master/consolidated-feature-integration`.
- The target branch has two commits not present on the recovery branch. They are not merged wholesale; calendar work is being selectively applied to the recovery branch to avoid replacing Studio Controls recovery work.
- The October 29 calendar integration and catalog branches are historical references, not merge candidates. The standalone calendar HTML is a visual/interaction specimen only; its localStorage demo data is not production persistence.
- Canonical source references reconciled: this plan, the 13B Planner Calendar guides, the Projects / Asset Engine / Publishing architecture plan, the integrated content lifecycle plan, the Brain master resource, and the Studio Hub component-library source of truth.
- Repository hygiene: do not overwrite the unrelated Settings task files. This calendar plan remains the single calendar roadmap; older 13B guides are behavioral references, not competing checklists.

### Phase 1 — event contract and source ownership

The shared projection contract is `src/services/calendar/calendarEventContract.ts`. It defines a source-owned event projection, stable owner/record identity, inclusive date ranges, status, optional timezone, Asset Engine/Vault thumbnail identity, and externally verified schedule metadata.

| Calendar projection | Canonical owner | Existing field / rule |
| --- | --- | --- |
| Project publication | Projects | `Project.publishDate`; one-day event |
| Project task | Projects | `Project.tasks[].dueDate`; one-day event |
| YouTube scheduled/published state | Publisher / ContentBuild | `ContentBuild.youtube`; show only verified external state |
| Thumbnail/media | Asset Engine / Vault | Asset ID and provenance; UI resolves preview URL |
| Multi-day project/campaign bar | Owning project/workflow | Requires an explicit owner-managed start/end range |

No calendar table, browser-local calendar store, duplicate task store, or new Project date-range fields are introduced in this phase. `publishDate` remains the publication date and must not be overloaded as a project start/end date. A future range field must be approved and persisted by the owning Projects workflow before the calendar projects it.

### Phase 2 — Mini Studio calendar primitives

- `StudioCalendarEventChip` now has a Mini size variant while retaining its existing Standard default and removal/status behavior.
- `StudioCalendarMultiDayBar` represents one-day and week-segmented bars with explicit start/middle/end/single segments, status, selected state, optional progress, and channel-wide dashed treatment.
- `StudioCalendarThumbnailEventChip` adds an inline left 16:9 thumbnail section sized from the Mini chip height; it accepts a resolved thumbnail URL and has an accessible empty-image fallback.
- `StudioCalendarMediaRail` remains the larger 16:9 / 9:16 media composition and is not repurposed as a thumbnail chip.
- Mini geometry follows the shared Studio size ladder: 20px overall height, 1.5px border, 3px horizontal padding. Calendar fills use 50% white mixed with the semantic color, never 50% transparency.
- The new primitives use the existing global Studio control tokens and are publicly exported from `src/studio-ui/index.ts`.

### Phase 3 — confirmed primitive catalog

- The confirmed catalog imports the production calendar primitives directly from `StudioCalendarPrimitives.tsx`.
- The calendar family presents Mini event chips, the segmented multi-day bar, and the thumbnail event chip as actual components, alongside the existing larger media-rail specimens.
- Catalog regression coverage asserts the new production component markers, Mini size, segment variants, 16:9 thumbnail split, and public exports.

### Verification status

The source changes and regression assertions have been authored on the implementation branch. The repository runtime is not available in this execution environment, so the focused Vitest test, Studio Controls test gate, typecheck, build, and browser rendering have **not** been run here. Do not treat phases 2–3 as certified until those checks run in CI or a repository-capable environment.

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
- [ ] PR is opened against `fix/studio-controls-regression-recovery-2026-10-31` with honest verification results.
