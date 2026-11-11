# ViewTube Component Standardization — Phases 0–3

**Date:** 2026-11-11  
**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `feat/calendar-resource-analytics-consolidation-2026-11-11`  
**Requested merge target:** `fix/studio-controls-regression-recovery-2026-10-31`  
**Status:** Implementation branch assembled; automated and visual verification pending

## Scope and guardrails

This branch consolidates the calendar-specific recovery work with the first Resource Index and Analytics presentation migrations. It is based directly on the requested Studio Controls recovery target.

- Do not merge the stale calendar branches wholesale.
- Do not create a second calendar persistence model, analytics store, token hierarchy, or parallel Studio primitive set.
- Preserve Projects as the owner of project publish dates and task due dates.
- Preserve Publisher, Asset Engine/Vault, and Analytics as the owners of their own source records.
- Reuse the public Studio UI API and production primitives.
- Keep charts and data visualization engines under their own domain contracts; standardize the controls and metadata around them.
- Treat the standalone calendar workbench as a design reference, not a runtime or persistence source.

## Phase 0 — Branch and PR reconciliation

### Calendar branch dispositions

| Branch / PR | Evidence | Disposition |
|---|---|---|
| `feat/studio-calendar-controls-integration-2026-10-29` / [PR #1160](https://github.com/viewtube-dev/viewtube/pull/1160) | PR merged; branch is 0 ahead / 1,260 behind the requested target; event chip/media rail primitives, Project calendar integration, stylesheet extraction, tests and copy contract | Already represented in the requested target history; no duplicate replay |
| `feat/studio-calendar-catalog-representatives-2026-10-29` / [PR #1166](https://github.com/viewtube-dev/viewtube/pull/1166) | PR merged; branch is 0 ahead / 1,237 behind the requested target; five event kinds, statuses, both aspect ratios and three rail layouts in confirmed catalog | Already represented; no duplicate replay |
| `master/calendar-toolbox-status-badges-2026-10-11` / [PR #23](https://github.com/viewtube-dev/viewtube/pull/23) and [PR #24](https://github.com/viewtube-dev/viewtube/pull/24) | Both PRs merged; branch is 0 ahead / 7,940 behind the requested target; calendar sizing, selected-day details, task markers, date normalization and shared dense status badges | Historical baseline; current target already contains later calendar implementation |
| `master/analytics-status-badge-primitive-2026-10-12` | Four unique historical commits; branch is 4 ahead / 7,938 behind; outlined/dense status badge API, CSS and catalog examples are already present in the requested target | Superseded API/style work not replayed. Its old ProjectPlannerCalendar marker JSX is not copied over the newer calendar composition |
| `feat/calendar-phases-0-3-studio-recovery-2026-11-11` | Diverged at 11 ahead / 7 behind the requested target; includes useful calendar contract, mini primitives and catalog work | Selectively recovered through the clean sync branch; original divergent branch not merged |
| `feat/calendar-phases-0-3-studio-recovery-sync-2026-11-11` | Cleanly based on requested target; 10 commits ahead / 0 behind, including seven initial calendar commits plus three follow-up refinements | Source of calendar recovery. All seven changed paths and latest refinements were synchronized into this branch |
| `feat/calendar-resource-analytics-consolidation-2026-11-11` | Created from the requested target and advanced with calendar recovery plus Resource Index and Analytics work | Single consolidated working branch for this delivery |

### Recovery notes

- The old calendar feature branches are historical and far behind the requested target; their merged PR contributions are already represented in the target lineage.
- Calendar recovery was taken from the target-based sync branch, not from the older diverged branch.
- The latest sync follow-ups were also included: canonical owner vs. record-type distinction, reduced multi-day bar API surface, and shared Mini secondary focus outline.
- No target branch was force-updated. The recovery target remains unchanged.
- The legacy Analytics status-badge branch was inspected. Its reusable badge API/styles already exist on the target, so only the current Analytics visual context bar is changed in this branch.

## Phase 1 — Component inventory and ownership map

### Classification

| Class | Responsibility | Examples |
|---|---|---|
| Primitive | One reusable visual/interaction contract | Studio split-left button, spectrum tag, dropdown, text input, toggle |
| Compound | Composes primitives into a reusable domain pattern | Calendar event chip, media rail, Resource Index row, Analytics metric split badge |
| Layout | Structural arrangement without owning domain data | Toolbox/SubToolbox, split module, grid, scroll region |
| Data visualization | Charts, axes, scales, metric encoding and rendering | Recharts visuals, Analytics visual modules |
| Domain component | Reads/writes records through the canonical domain owner | ProjectPlannerCalendar, Resource Library reader, Analytics context bar |

### Studio primitive registry

The current Studio Hub Confirmed Primitive Library index lists 62 registered production component families. They remain the shared base inventory; calendar mini variants are additional examples/variants, not a reason to create duplicate family names.

**Buttons and actions:** Primary Button, Secondary Button, Neutral Button, Destructive Button, Square Icon Button, Split Left Button, Head Tail Action, Disabled Button, Disabled Split Button.

**Menus and fields:** Split Menu, Dropdown, Select Menu, Context Menu, Text Input, Textarea, Split Search, Number Field, Input Action, Stepper.

**Controls:** Slider, Range Slider, Toggle, Settings Switch, Checkbox, Radio, Segmented Choice, Button Group, Knob Dial, Controller Switch.

**Tags and status:** Tag, Removable Tag, Selectable Tag, Tag Editor, Badge, Status Badge, Alphabetical Spectrum Tags, Dashboard Pill Tags, LED Light.

**Information and progress:** Progress Bar, Progress Value, KPI, Stat Card, Metric Strip, Data Stats Module, Two Color Data Stats, Monochrome Data Stats, Tiny Data Stats.

**Structure and utility:** Tooltip, Popover, Disclosure, Divider, Horizontal Scrollbar, Vertical Scrollbar, Upload Frame, Pagination, Icon Rail Control, Tooltip Dark, Tooltip Color.

**Vault media specimens:** Vault Landscape Asset, Vault Portrait Asset, Vault Audio Asset, Vault Document Asset.

### Calendar family

| Component | Class | Owner / contract |
|---|---|---|
| `StudioCalendarEventChip` | Compound primitive | Uses Studio spectrum tag or closeable badge; five event kinds, selected/status/removal states |
| `StudioCalendarMultiDayBar` | Compound primitive | Mini multi-day segment; single/start/middle/end; bounded progress; no persistence |
| `StudioCalendarThumbnailEventChip` | Compound primitive | Mini thumbnail/event presentation with 16:9 media |
| `StudioCalendarMediaRail` | Compound primitive | 16:9 and 9:16 media with left/right/double rails |
| `calendarEventContract.ts` | Domain read-model contract | Separates canonical owner from source record type; no calendar-local store |
| `ProjectPlannerCalendar` | Domain composition | Reads/writes Project publish dates and tasks through the existing Project owner |
| `ProjectCalendarPage` / Project Board schedule composition | Page/layout | Hosts the existing Board/Calendar experience |

**Calendar ownership invariant:** Project publish dates and task due dates remain Project-owned. Publisher schedule timestamps are surfaced only when verified by the Publisher/ContentBuild owner. Asset thumbnails resolve through Asset Engine/Vault identity. Analytics checkpoints are projections of Analytics-owned evidence. Multi-day bars require explicit source-owned date ranges; do not infer a range from a single publish date.

### Resource Library / Resource Index

| Component | Class | Current migration |
|---|---|---|
| `ResourceLibrary` | Domain page | Retains search, category, learning-path, selection and completion behavior |
| Resource Index document row | Compound | Now uses public `StudioSplitLeftButton` |
| Category label | Metadata child | Uses the row's secondary pair color, increased to 10px |
| Completed marker | Status child | Uses canonical `StudioSpectrumTag`, inline with category |
| `ResourceDocumentRenderer` | Domain renderer | Remains separate from list-row presentation |
| `resourceLibraryRegistry` | Data registry | Remains the owner of document metadata, category, tags and Markdown source |

The row's icon rail and outer button geometry are owned by Studio Controls. Resource-specific styling is limited to palette assignment and text arrangement; no second rail/border implementation is retained.

### Analytics

| Component | Class | Current migration |
|---|---|---|
| `AnalyticsVisualIcon` | Icon primitive/adapter | Reused for metric identity in the split rail |
| `AnalyticsActiveStats` | Compound | Now renders the canonical `StudioSplitLeftButton` |
| `AnalyticsVisualContextBar` | Domain presentation | Retains metric colors, value formatting, dark-canvas behavior and click handlers |
| `UnifiedAnalyticsVisualModule` / `AnalyticsVisualShell` | Domain/layout composition | Remain responsible for module framing and chart presentation |
| Recharts chart modules | Data visualization | Not converted into Studio buttons or badges |

The Analytics metric badge uses a square Studio icon rail, metric color on the rail, and a compact right-side label/value pane. Metric value color, dark-canvas behavior, reserved width and existing click/disabled behavior are retained.

### Cross-surface ownership boundaries

- **Toolbox UI Master Resource:** global shell geometry, tokens, responsive behavior and shared layout.
- **Studio Controls:** reusable control geometry, state, focus and interaction.
- **Studio Hub Confirmed Primitive Catalog:** production specimen registration and coverage.
- **Projects:** project planning, calendar dates and task scheduling.
- **Vault / Asset Engine:** durable artifact identity, versions, variants and provenance.
- **Analytics Canon:** normalized analytical evidence and metric semantics.
- **Brain:** reasoning, evidence/context planning and governed learning; it consumes the canonical owners rather than maintaining duplicate project, asset or analytics stores.
- **Channel pages:** compose channel-owned data with the same shared primitives; they do not redefine the primitive system.

### Product-surface inventory (production entry points and adjacent compositions)

| Surface | Production entry points / compositions inspected | Inventory treatment |
|---|---|---|
| Channel | `src/views/Channelytics.tsx`, `src/components/ChannelyticsChartToolbox.tsx`, `src/components/projects/ChannelPlanningSubtoolboxes.tsx` | Channel metrics and channel planning are domain compositions; their controls should consume Studio primitives, while channel identity and channel-level goals/tasks remain channel-owned |
| Resource Library / Index | `ResourceLibrary.tsx`, `ResourceDocumentRenderer.tsx`, `resourceLibraryRegistry.ts`, discovery and palette contract tests | Registry owns document metadata; renderer owns document content; Resource Index row owns only selection presentation |
| Resource Vault / Asset Management | `src/views/CreatorVaultOS.tsx`, `src/features/vault-workbench/VaultAdaptiveWorkbenchHost.tsx`, `ContentAssetEngine.tsx`, `ProjectAssetEngineSimple.tsx`, Vault asset-card / collection / metadata / selection test families | Vault owns durable artifacts and provenance; Asset Engine coordinates ContentBuild assets; Vault surfaces should reuse Studio inputs, dropdowns, upload frames, split buttons, badges and tags |
| Analytics | `SimpleAnalytics.tsx`, `CinematicAnalyticsLab.tsx`, `InternalAnalyticsPanel.tsx`, `VtSyncLocalAnalyticsPage.tsx`, `AnalyticsVisualShell.tsx`, `UnifiedAnalyticsVisualModule.tsx`, `analyticsVisualContextBar.tsx`, `AnalyticsVisualIcon.tsx`, `StandardKPI.tsx` | Analytics Canon owns metric evidence; visual shells own chart composition; metric controls and stat badges reuse Studio primitives |
| Studio Hub | `StudioHub.tsx`, `ToolboxUIReferenceLibrary.tsx`, `StudioHubCompletePrimitiveCatalog.tsx`, `StudioHubConfirmedPrimitiveCatalog.tsx`, `StudioHubPrimitiveMigrationCatalog.tsx`, `StudioControls.tsx`, Studio primitive CSS and contract tests | The 62-family confirmed registry is the shared component inventory; catalog specimens must render production primitives, not local lookalikes |
| Projects / Calendar | `ProjectBuilder.tsx`, `ProjectBoardWorkspace.tsx`, `EmbeddedProjectKanbanWorkspace.tsx`, `ProjectPlannerCalendar.tsx`, `EmbeddedPublishingSchedule.tsx`, `ProjectScheduleContextSubtoolbox.tsx`, `projectCalendarPublicationState.ts` | Projects owns tasks, dates and schedule state; calendar components project this data and never persist duplicate events |
| AI Brain | `AIBrainCommandInterface.tsx`, `AIBrainStudioWorkspace.tsx`, `BrainCommandCenter.tsx`, `BrainEvidenceHandoff.tsx`, `brainProjectContext.ts`, `brainReviewHandoffContext.ts` | Brain owns reasoning and governed learning; shared controls standardize presentation while evidence, project and asset records remain with their canonical owners |

This inventory is the Phase 0–3 implementation scope and adjacent ownership map. It is not a claim that every individual JSX node across every ViewTube route has been exhaustively classified; a route-by-route UI coverage audit remains a separate certification pass. The production primitive family list above is the complete registered Studio Hub base family index currently referenced by the canonical component-index document.

## Phase 2 — Resource Index split-left document rows

### Implemented

- Replaced the hand-built icon rail/list border with the public `StudioSplitLeftButton`.
- Added per-resource `--pair-a` and `--pair-b` values from the existing resource palette mapping so the canonical rail and face use the document's palette.
- Category label now uses the secondary rail color and a larger 10px face.
- Completed status now uses `StudioSpectrumTag` and is inline to the right of category, rather than a separate metadata row.
- Removed the old bespoke 48px icon rail, duplicate outer border/grid anatomy and local completed-mark styling.
- Kept search, filters, learning-path selection, URL selection, completion persistence and reader rendering unchanged.
- Added a focused server-rendered contract test for canonical split-left row anatomy and inline category metadata.

### Acceptance criteria

- [x] Uses the public Studio split-left button.
- [x] Icon rail geometry is inherited from Studio Controls.
- [x] Category color follows the rail's secondary pair color.
- [x] Completed tag is a canonical Spectrum tag, inline with category.
- [x] Search, category filters, learning paths and URL-selected resource behavior remain in the same page code path.
- [ ] Focused tests and browser visual certification.

## Phase 3 — Analytics split badge/button

### Implemented

- Replaced the two-tier stacked Analytics stat button with the public `StudioSplitLeftButton`.
- Uses `AnalyticsVisualIcon` in the canonical square icon rail.
- Resolves a metric icon from the label unless the caller supplies `iconKey`.
- Keeps the metric's resolved tone on the icon rail and preserves the light/dark value-color contract.
- Uses a compact right-side label/value arrangement with zero vertical padding.
- Reserves width for the widest declared label/value variants.
- Applies an inline width:auto / flex:0 0 auto exception only inside the horizontal stat strip; the shared Studio button and global full-row default are unchanged.
- Preserves the existing click callback and disabled behavior.
- Added a server-rendered test for the split-left component identity, rail and compact text pane.

### Acceptance criteria

- [x] Uses the public Studio split-left button rather than hand-built rail markup.
- [x] Square icon rail is supplied by the shared primitive.
- [x] Right-side label/value content has no vertical padding.
- [x] The horizontal stat strip uses an inline width:auto / flex:0 0 auto exception rather than changing the global Studio width default.
- [x] Metric colors, dark-canvas behavior, width candidates and callbacks are retained in the component contract.
- [ ] Focused tests, typecheck and browser visual certification.

## Verification record

**Not yet run in this environment:** focused Vitest tests, `npm run typecheck`, `npm run build`, `npm run test:studio-controls`, broader test suite, desktop/mobile browser checks, keyboard/screen-reader checks and reduced-motion checks.

The code changes and regression assertions are committed to the working branch, but the phases are not release-certified until those checks pass. At the current PR head, no GitHub Actions workflow run is associated with the commit; the three Vercel status checks fail with the provider's build-rate-limit URL. That is an infrastructure/account limit, not evidence of a source failure or a passing build. This environment cannot clone the repository to run tests locally. Do not describe CI, build or visual verification as green without fresh evidence from the branch's head commit.

## Next verification commands

```bash
npx vitest run src/features/resource-library/ResourceLibrary.contract.test.tsx src/components/analyticsVisualContextBar.test.tsx src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.test.tsx src/components/projects/ProjectPlannerCalendar.studio-primitives.test.tsx
npm run typecheck
npm run build
npm run test:studio-controls
npm test
```

Browser certification should cover Resource Index rows at desktop and narrow mobile widths; Analytics light/dark context bars with clickable and disabled metrics; Calendar event kinds, status states, mini segments, thumbnail chips, media rails and keyboard focus.
