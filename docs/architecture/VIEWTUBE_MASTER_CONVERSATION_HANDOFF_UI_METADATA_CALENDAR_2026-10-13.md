# ViewTube Master Conversation Handoff — UI System, Saved Metadata Sets, Planner Calendar
**Prepared:** 2026-10-13  
**Purpose:** Durable handoff of the decisions, source findings, UI/CSS requirements, proposed reusable components, unfinished work, and execution order captured in this conversation.  
**Status:** Planning/source-audit handoff. This document does not certify tests, builds, runtime behavior, or deployment.

## 1. Repository, branch, and safety constraints

- Repository: https://github.com/viewtube-dev/viewtube
- Working branch: `master/consolidated-feature-integration`
- Draft PR: https://github.com/viewtube-dev/viewtube/pull/16 (targets `integration`, not `main`)
- Consolidation plan: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/architecture/VIEWTUBE_CONSOLIDATED_MASTER_BRANCH_2026-10-10.md
- 25-item backlog: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/architecture/VIEWTUBE_CONSOLIDATED_25_ITEM_IMPLEMENTATION_BACKLOG_2026-10-11.md
- Prior handoff: `docs/architecture/VIEWTUBE_CONVERSATION_HANDOFF_2026-10-12.md` if present in this branch.

### Non-negotiable rules
1. Work on `master/consolidated-feature-integration` unless explicitly redirected. Do not change or merge to `main` without explicit authorization.
2. Do not deploy without explicit workspace/deployment confirmation.
3. Never claim tests, typecheck, build, runtime behavior, or deployment are verified unless actually executed/observed.
4. Use the canonical Toolbox/SubToolbox design system and UI Reference Library. Do not create hard-coded copies of existing primitives.
5. Preserve one clear write owner and canonical identity for Project, ContentBuild, Video Package, Publishing Package, Asset Engine, and Vault.
6. Publisher prepares/publishes unpublished projects; Video Manager manages published videos and must not offer video upload; Metadata Master proposes/compares candidates but never silently applies or publishes.
7. Keep changes additive until production callers, parity, tests, and zero-caller certification justify removing legacy code.
8. Do not wholesale merge `audit/system-convergence-identity-certification`; harvest only reviewed compatible hunks. Do not use `visual-test/canonical-default-system-65-66` as implementation baseline/evidence.
9. `StudioHubCompletePrimitiveCatalog.tsx` is frozen and must not be changed.

## 2. Executive status

- Saved Metadata Sets: several recent code changes preserve Audience as tri-state, but the full package save/switch/reload round trip is **not certified**.
- UI/CSS system: canonical header toggle and responsive layout work exists in the branch, but relevant tests/build have not been confirmed run.
- Planner Calendar: HTML source was identified as section **13b Planner Calendar** in `ViewTube-Primitives-Components-Source-6.html`; a concise integration plan is captured below. It has **not** been extracted into React or integrated into Project Board.
- Ten reusable components: proposed build list, not completed work.
- No deployment verification is established.
- Next priority: fix and test Saved Metadata Sets save-mode, asset references, and blank-field semantics; then implement the 13b calendar adapter and resolve scheduled-date/status styling.

## 3. Product boundaries and canonical metadata contract

### Tool ownership
- **Video Publisher:** unpublished projects and publishing workflow. Keep the existing idea/script/rough-edit/video creation workflow on a separate **Create** page; publishing metadata belongs on **Write**.
- **Video Manager:** manage already-published videos; no video-upload control. Edit/refine/rank/generate metadata for published videos.
- **Metadata Master:** metadata intelligence, candidate generation, scoring/comparison, goals and strategies. It proposes candidates and sends them to Publisher/Manager for explicit review; it is not a competing publisher.
- **Project / ContentBuild / Video Package / Publishing Package / Asset Engine / Vault:** retain canonical identities and clear ownership; do not make duplicate disconnected copies of state.

### Required metadata section order
1. Video Upload (Publisher only; not Manager)
2. Title
3. Thumbnail
4. Visibility
5. Audience
6. Timestamps
7. Description
8. Location
9. Playlists
10. Community
11. AI Use
12. Tags
13. Category

### Field behavior decisions
- Visibility: Public, Private, Unlisted, Scheduled, with valid schedule semantics.
- Audience: `true | false | null` = Yes / No / Unset. Never coerce Unset to false.
- Playlists: channel-connected dropdown, not a popup of radio buttons.
- Location: input with matching/similar-location suggestions.
- Internal AI-use tracking must be separate from the platform's altered/synthetic-content disclosure.
- Education category may reveal a timestamped questions/phrases textarea. Validate timestamp format at line start (four-digit-or-longer timestamp followed by colon as agreed) or disable invalid entries.
- Preserve the canonical ranked/color-coded tag editor and Add Tags primitive.
- Inputs should retain last edits and provide an explicit option to re-apply the last saved state.
- Publishing package tracking should retain metadata, media references, generations, edits, refinements, decisions, publish date, and later analytics effects.

## 4. Saved Metadata Sets: source changes and audit

### Recent commits already on the working branch
1. `src/components/metadata/CanonicalMetadataSections.tsx` — commit `d02d5821f88b768bf159cadec31e2744afc3f777`: Audience prop/callback accepts `boolean | null`; UI cycles Unset → Yes → No → Unset; default changed from false to null.
2. `src/services/publisherMetadataProjectPersistence.ts` — commit `2a4b7e0adff5dc54185b89e44f994f0c75372214`: preserves Audience with `state.audience ?? null`, avoiding Boolean coercion.
3. `src/views/VideoPublisher.tsx` — commit `474b2639834af843d005c11615d62469df1c4654`: Audience state is `boolean | null`; restore keeps null as Unset.
4. `src/services/publisherMetadataPackageOptions.ts` — commit `52c7c7d8f30e00b83fc73e4b4052d5ec98f67a35`: package option payload Audience type accepts `boolean | null`.

Source links:
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/components/metadata/CanonicalMetadataSections.tsx
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/publisherMetadataProjectPersistence.ts
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/VideoPublisher.tsx
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/publisherMetadataPackageOptions.ts
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/components/PublisherMetadataPackageOptions.tsx
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/publisherMetadataProjectPersistence.test.ts
- https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/publisherMetadataPackageOptions.test.ts

### Audit conclusion
**Partial source-level pass; full save/restore round trip is not certified.** Source and test files were inspected via GitHub. Vitest, typecheck, production build, and browser runtime round-trip were not run in this audit.

### Findings that must be fixed
1. **Save as Option may mutate active Project fields.** In `VideoPublisher.tsx`, `persistPublisherProject()` calls `updateProject()` after saving regardless of mode. An alternative save should add a candidate without replacing the active working state or legacy Project fields. Update active Project fields only for a current-set save unless a documented ownership contract says otherwise.
2. **Thumbnail/final-video asset references are not passed consistently.** Publisher state includes `finalVideoAssetId`, but persistence uses `input.finalVideoAsset?.id` and ContentBuild selection. The Publisher call does not pass the `finalVideoAsset` object; selected `thumbnailFile` is not passed as a registered thumbnail asset. Trace canonical Asset Engine/Vault registration and persist canonical IDs/references. A local preview URL or filename is not a durable asset reference.
3. **Empty field clearing semantics are unclear.** The selection service updates ContentBuild field selections only when an option has a valid asset ID. An intentionally blank title/description/tags field may leave an older asset selection active. Define explicit clear/null semantics and test them.
4. **Hydration on mount/reload/project switch is not proven.** Option UI restoration depends on the `onSelected` callback, and selected state is not necessarily replayed into form fields on mount. Establish one deterministic hydration path for first mount, reload, and project switch.
5. **Persistence durability boundary is browser-local.** Inspected ContentBuild repository and Vault adapter use browser `localStorage`. Same-browser reload does not prove cross-device/account durability. Document the boundary and verify any server/account sync path before claiming cross-device persistence.
6. **Existing tests are narrow and have not been run in this audit.** Existing tests cover grouping/selection, preserving the same ContentBuild, and avoiding duplicate provenance when re-selecting. They do not prove complete UI → package → reload behavior.

### Required regression matrix
- [ ] Save Current; verify it becomes the selected set.
- [ ] Save two named alternatives; verify both remain listed.
- [ ] Save as Option does not mutate active Project fields or active ContentBuild selection.
- [ ] Select an alternative and restore every supported metadata field.
- [ ] Blank title/description/tags in an option explicitly clear old values/selections.
- [ ] Audience round-trips Unset, Yes, and No distinctly.
- [ ] Visibility and scheduled publication time restore.
- [ ] Playlist IDs, timestamps, location, Community, and AI-use fields restore where supported.
- [ ] Thumbnail and final-video references restore from canonical asset records.
- [ ] Browser reload recovers selected option and all form values.
- [ ] Project switch never leaks options across ContentBuilds.
- [ ] Repeated selection does not duplicate package, variant, or provenance.
- [ ] Test partial failure/retry if save writes multiple stores.
- [ ] Determine and separately test server/account persistence if supported.

### Immediate implementation steps
1. Fetch latest branch versions of the four changed source files and both tests.
2. Trace exact `persistPublisherProject()` save-mode and `updateProject()` flow.
3. Separate Save Current from Save as Option side effects.
4. Trace asset registration and persist canonical thumbnail/video references.
5. Define blank/null clearing semantics in selection and hydration.
6. Make selected-option hydration deterministic on mount and project switch.
7. Add the regression tests above.
8. Run targeted Vitest, `npm run typecheck`, and `npm run build`; record exact commands/results.
9. Test browser reload and project switching. Do not claim cross-device persistence without server/account-backed evidence.

## 5. Ten reusable front-end components to build

These are proposals, not completed components. Implement them using the canonical Toolbox/SubToolbox primitives, shared CSS/tokens, and UI Reference Library. Avoid cloned one-off implementations.

1. **Canonical Metadata Field** — shared field shell for input, textarea, dropdown, toggle, tag editor, and asset selector; consistent label/help/validation/dirty-saved state; standardized action placement.
2. **Saved Metadata Set Switcher** — Save Current, Save as Option, switch, compare, restore, named options, timestamps, unsaved-change protection.
3. **Publishing Asset Selector** — canonical video/thumbnail references, preview/replace/inspect, explicit local-vs-saved state, no dependence on temporary object URLs.
4. **Publishing Package Status Header** — project/package identity, draft/review/scheduled/published/error state, saved/dirty status, canonical header toggles.
5. **Metadata Candidate Comparison** — side-by-side title/description/tags/category/thumbnail candidates, evidence/strategy explanation, explicit selection only.
6. **Canonical Ranked Tag Editor** — ranked/color-coded pills, circular X controls, add/reorder, standard/focus modes, library-matched colors.
7. **Field Intelligence Action Bar** — Generate/Refine/Analyze split-left icon actions in one row where space permits, consistent loading/error state, optional dropdowns, explicit propose-vs-apply semantics.
8. **Publishing Settings Group** — visibility/schedule, Audience Yes/No/Unset, channel playlists, location suggestions, Community, internal AI-use distinct from platform disclosure.
9. **Package Change History Timeline** — before/after values, reason, actor/action, timestamps, links to metadata set/package version, proposed vs approved vs published distinction.
10. **Adaptive Toolbox Section Shell** — canonical title/description, header toggles, collapsible body, palette/spacing/size variants, responsive wrapping, empty/loading/error/disabled/success states.

### Suggested component delivery order
1. Saved Metadata Set Switcher + persistence contract.
2. Canonical Metadata Field + Publishing Asset Selector.
3. Publishing Settings Group + Field Intelligence Action Bar.
4. Ranked Tag Editor + Adaptive Toolbox Section Shell.
5. Candidate Comparison + Change History Timeline.

## 6. UI/CSS plan and front-end acceptance checklist

The checklist below is a target for audit and implementation; it does not imply all items are currently broken or already fixed.

### Canonical component rules
- Use the canonical Toolbox/SubToolbox system, shared primitives, and the UI Reference Library. Do not use a parallel component system or duplicate hard-coded primitive markup.
- The canonical UI system intended for new primitives is `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`. Do not create new primitives in `src/components/subtoolbox/SubToolboxPrimitives.tsx` / `src/styles/subtoolbox-system.css` as a replacement system. Existing SubToolbox primitives may be used where already canonical/required; new canonical controls should follow the approved StudioControls path and documented migration strategy.
- Preserve established component geometry and token relationships; don't globally change strokes, radii, font sizes, or shadows without checking the actual source/library.
- Use canonical palette pair vars: `--pair-a` (Toolbox header) and `--pair-b` (Toolbox icon rail) where appropriate.
- The measured `ToolboxHeaderToggle` is a word toggle with intrinsic label width and selected-state geometry; don't replace it with a generic fixed-width switch.
- `StudioHubCompletePrimitiveCatalog.tsx` remains frozen.

### Front-end checklist (10 groups)
1. **Canonical metadata layout:** exact 13-section order above.
2. **Publisher/Manager separation:** Publisher for unpublished work; Manager for published videos; shared metadata components; Manager has no video upload.
3. **Publisher Write/Create:** separate publishing metadata workflow from idea/script/rough-edit/video creation.
4. **Header action toggles:** keep Show/Hide Actions, Live Editor, and Intelligence distinct; preserve Publisher Publish/Generate and Manager Manage/Generate.
5. **Tag editor:** use canonical primitive 30 tag editor; pill tags, circular X controls, dedicated add button, established library colors.
6. **Buttons and field actions:** Generate/Refine/Analyze split-left icon buttons in one row; consistent controls below fields or in appropriate header.
7. **Sizing/responsive:** requested 44px control standard where applicable; fix portrait mobile overlap, landscape sizing/strokes, wrapping, and header alignment. Apply sizing changes proportionally and verify against the canonical library.
8. **Shared palette/toggles:** preserve measured word-toggle geometry, selected state, palette pairs, canonical Toolbox/SubToolbox styles.
9. **Inputs/secondary settings:** title/description labels in specified upper-right position; dropdowns for playlist/visibility; location suggestions; compact secondary toggles.
10. **Accessibility/feedback:** keyboard support, visible focus, accessible names, disabled states, validation, loading, success/error feedback.

### Known toggle/layout work in branch (verify before altering)
- `ToolboxHeaderToggle`: `src/components/subtoolbox/SubToolboxPrimitives.tsx`; CSS `src/styles/subtoolbox-system.css`.
- Palette pair variables `--pair-a` and `--pair-b`.
- `Toolbox.tsx` header-placement/mobile fallback work. Prior commits: `76bda28203f602200f4cc1aa82c5851fc3e3a74e`, `16e47c1b40f9e668ca241d9447187f1f02e22c8a`, `4f2192f9c431e0c64d2ece4dec5ee25dcabf4a7d`.
- Publisher Publish/Generate and format auto-detection commit: `0c0e20ee3fc53f1f2b72de030bd8842bb83b8d20`.
- Manager Manage/Generate commit: `2722c2dd9ffa0e7d984e989317e34761149c0a2c`.
- Source-contract tests commit: `527a6a4a97a105b0d2ffcb23f597a29f06033b45`.
- Project Board Board/Calendar toggle commit: `a3a1080d83722b37e61773716915d0da3e96745b`.
- ProjectStudio Channel/Projects toggle commit: `72f50e5429f75b73b2286c4c1f930cdba0b99dd6`.
- These commits' tests/build have not been confirmed run.

## 7. Calendar component handoff — HTML section 13b Planner Calendar

### Source and choice
The uploaded HTML is `ViewTube-Primitives-Components-Source-6.html`. It contains:
- **13 — Calendar**: `.vt-cal`, `data-cal` (basic month/date selector).
- **13b — Planner Calendar**: `.vt-planner`, `data-planner` (advanced calendar intended for Project Board and later reuse).

Use **13b Planner Calendar** as the primary component for the requested integration unless the user changes direction. The guide below is a source-grounded integration plan; it is not evidence the calendar has already been integrated. User explicitly asked to make a brief guide and add it to GitHub; this handoff records that task, but the dedicated guide/component has not yet been committed as a separate repo artifact.

### Existing source features
- Month navigation.
- Date/event markers and multi-day event bars.
- Drag-and-drop.
- Right-side event detail panel.
- Legend.
- Quick-add.
- Demo JavaScript seeds hard-coded sample events for October 2026.
- Event type codes: `pub` = Publish/Scheduled; `task` = Task/Open; `dead` = Deadline/Due; `mile` = Milestone/Hit; `proj` = Project/In Progress. CSS legend also includes campaign.
- Sample event fields include `id`, `type`, `title`, `day`, `y`, `m`, `status`, and optional `thumb`.

### Markup/CSS anchors
- Root: `.vt-planner[data-planner]`
- Main layout: `.vt-planner__main`
- Header/nav: `.vt-planner__head`, `[data-pl-prev]`, `[data-pl-next]`, `[data-pl-title]`
- Weekday row: `.vt-planner__dow`
- Grid: `.vt-planner__grid` / `[data-pl-grid]`
- Legend: `.vt-planner__legend`
- Layout uses a calendar column plus `minmax(200px, 240px)` detail panel.
- Tokens include `--vt-stroke`, `--vt-radius`, `--vt-shadow`, `--vt-font`, `--vt-h`, `--vt-icon`, `--vt-icon-stroke`, `--vt-weight`, `--vt-tracking`, `--pair-a`, and `--pair-b`. Map these to canonical app tokens/props; do not create a parallel token system.

### Minimal reusable integration contract
1. Inspect the full 13b markup/CSS/JS and current Project Board calendar implementation before editing.
2. Extract a dedicated React/TypeScript component (working name `ProjectPlannerCalendar`, subject to repository naming conventions).
3. Replace hard-coded sample events with props/state. Suggested event model: stable ID, event type, title, start date, optional end date, status, project/package reference, optional thumbnail/reference, and action metadata.
4. Keep view and data separate. Project events use Project IDs; publish events reference the canonical Video/Publishing Package and scheduled/published state; tasks/deadlines/milestones retain their types.
5. Selecting a date filters/shows that day's events. Selecting an event opens the canonical project/package/detail workflow.
6. Drag-and-drop must invoke the owning scheduling/update service and persist changes, not only change a local day number.
7. Quick-add must create through the owning service with validation and required IDs; no in-memory-only additions.
8. Port CSS intentionally and replace demo-specific hard-coded colors with canonical palette/tokens. Reuse the analytics page's monochromatic status badge primitive/style (colored stroke, lightly tinted fill, matching colored text); do not duplicate badge CSS.
9. Responsive behavior: stack/collapse detail pane on narrow screens; prevent month controls/header actions from overflowing; preserve useful calendar grid sizing.
10. Accessibility: keyboard date/event navigation, visible focus, accessible labels, selected state, and event labels that don't rely on color alone.
11. Integrate behind Project Board's existing canonical Board/Calendar toggle first. Only after it is stable, make it reusable elsewhere.
12. Add tests for month navigation including year boundaries, selected date, events spanning dates, scheduled publish date mapping, empty days, event selection, drag/drop persistence, quick-add, and responsive layout.

### Known calendar issues to investigate
- User reports projects with scheduled publish dates still appear as unscheduled.
- User reports calendar status badges use black text instead of the Analytics page's monochromatic colored-border/tinted-fill/text style.
- Determine the canonical source of scheduled publish date (Publishing Package/video project vs legacy Project field).
- Derive scheduled state from canonical publication state/date, not merely a project status label.
- Check date parsing/timezone semantics to prevent events shifting a day.
- Ensure correctly scheduled items appear on the correct date and leave the unscheduled group.
- Preserve project/package identity when opening an item from the calendar.

### Brief adjustment guide (for the implementation PR)
- **Change appearance:** edit the extracted component's dedicated stylesheet or mapped canonical tokens; keep selectors scoped under the planner root, and don't edit global primitive styles to patch a single calendar.
- **Change event types/labels:** update the event-type map and legend together; keep type/status semantic fields separate from display labels.
- **Change event data:** adapt canonical Project/Publishing Package records into the calendar event contract at the boundary; don't let the calendar invent its own persistence.
- **Change actions:** route select/drag/quick-add through callbacks supplied by the owning toolbox/service.
- **Reuse elsewhere:** keep the component independent of Project Board layout; pass events, selected date, palette, and callbacks via props.
- **Before swapping callers:** compare behavior, confirm scheduled/unscheduled classification, test responsive states, then replace only the Project Board calendar implementation behind the existing toggle.

## 8. Publication, analytics, package lineage, and Brain backlog

These items are planned/incomplete unless independently verified:
- Canonical package identity across Project, ContentBuild, Video Package, Publishing Package, and assets.
- Full metadata round-trip, named sets, current set, and restore.
- Generation/refinement/selection provenance and asset lineage.
- Exact approved publication snapshot, including values/assets actually sent.
- Reconcile published video ID/date back to original project/package.
- Channel playlist selection, visibility/scheduling, location autocomplete, Audience tri-state, timestamps, Community, AI-use/disclosure separation.
- Analytics checkpoints linked to the exact published package/version.
- Before/after change history and rationale.
- Post-publication outcome/evaluation loop.
- Governed Brain learning from observed evidence; no unsupported performance guarantees.
- Manager analytics-linked change history.
- Metadata Master workspace, candidate scoring/comparison, goal/style strategies.
- Publisher Write/Create workflow separation.
- Canonical primitive-family inventory and migration coverage.
- Responsive, keyboard, screen-reader/accessibility certification.
- Recovery/resource/experimental workspace reconciliation.
- Reproducible integration/release baseline and documented verification evidence.
- Safe save/publish retries and recovery from partial failures.
- Cross-tool handoffs among Studio Hub, Publisher, Manager, Vault, Project Board, and Brain.

Related docs:
- `tasks/system-convergence/plan.md`
- `tasks/system-convergence/SYSTEM-CLASSIFICATION.md` (working registry; do not use as destructive-removal approval)
- `docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_UI_INTEGRATION_PLAN_2026-10-11.md`
- `docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_UI_PORT_LEDGER_2026-10-11.md`
- `docs/architecture/VIEWTUBE_CONSOLIDATED_25_ITEM_IMPLEMENTATION_BACKLOG_2026-10-11.md`

System convergence uses six canonical domains:
1. Creator Context & Knowledge
2. Evidence & Intelligence
3. Project/Content/Asset Graph
4. Creator Operations & Generation
5. Outcomes/Evaluation/Learning
6. Brain Runtime & Experience

Follow the convergence protocol: responsibility inventory → production reachability → donor harvest → destination assignment → additive successor contract → parity tests → caller migration → observability → zero-caller certification → quarantine → post-quarantine audit → removal receipt. Destructive changes are blocked until zero-caller certification.

## 9. Recommended delivery order

### Phase 0 — Establish source baseline
- Fetch current branch HEAD and current source files/tests.
- Check the canonical branch and ownership contracts.
- Record the exact source paths/symbols before changing them.
- Reconcile this handoff with the 25-item backlog and system-convergence ledger.

### Phase 1 — Saved Metadata Sets correctness
- Fix Save Current vs Save as Option side effects.
- Fix canonical thumbnail/video references.
- Define explicit blank/null clearing.
- Add deterministic hydration on mount/reload/project switch.
- Add full regression tests and run targeted tests, typecheck, build.
- Verify browser reload and document persistence boundary.

### Phase 2 — Canonical metadata fields/settings
- Verify 13-section order and Publisher/Manager split.
- Complete visibility/scheduling, playlist IDs, location, audience tri-state, timestamps, Community, AI-use/disclosure separation.
- Build Canonical Metadata Field and Publishing Asset Selector only after contract is clear.

### Phase 3 — 13b Planner Calendar
- Inspect full HTML and current Project Board implementation.
- Create a concise standalone integration guide in repository docs.
- Extract the planner to React with canonical tokens and callbacks.
- Fix scheduled-publish date source, timezone mapping, unscheduled classification, and Analytics badge style.
- Test and replace the existing Project Board calendar behind Board/Calendar toggle.
- Reuse elsewhere only after first integration is stable.

### Phase 4 — Shared front-end components and CSS
- Build Publishing Settings Group, Field Intelligence Action Bar, Ranked Tag Editor, Adaptive Toolbox Section Shell.
- Then Metadata Candidate Comparison and Package Change History Timeline.
- Apply 44px standard where applicable; verify all size/stroke/radius/font ratios against canonical UI library.
- Add responsive and accessibility coverage.

### Phase 5 — Publication and learning lineage
- Store exact approved publish snapshot and published identity.
- Link analytics checkpoints to that snapshot.
- Add before/after decisions, post-publish evaluation, and governed Brain learning.

### Phase 6 — Release/recovery gate
- Reconcile resource/recovery/experimental workspaces.
- Run targeted tests, full tests where available, typecheck, production build, responsive/accessibility checks, and runtime tests.
- Record commit, command, result, runtime evidence, risks, and next action in docs.
- Deploy only after explicit authorization and chosen workspace.

## 10. Verification ledger — current status at handoff

| Work item | Status |
|---|---|
| Audience tri-state source changes | Committed; source reviewed; regression not fully executed |
| Save Current vs Save as Option isolation | Needs correction |
| Thumbnail/video canonical asset round-trip | Needs correction |
| Blank-field clearing | Needs contract + tests |
| Initial/reload/project-switch hydration | Not proven |
| Same-browser reload round-trip | Not executed |
| Cross-device/account durability | Not established |
| Saved Metadata Sets test suite | Existing narrow tests; not run in this audit |
| Typecheck/build | Not run in this audit |
| Ten reusable UI components | Proposed only |
| UI CSS/front-end checklist | Documented requirements; full audit incomplete |
| 13b Planner Calendar source identified | Yes, based on HTML-source search/handoff |
| Dedicated calendar guide committed to GitHub | Not yet confirmed; this handoff records the task but does not substitute for the standalone guide |
| Calendar extracted to React | Not done |
| Scheduled date mapping/unscheduled classification | Needs investigation/fix |
| Analytics status badge reused | Not done |
| Calendar regression/accessibility/responsive tests | Not done |
| Deployment | Not verified; no authorization assumed |
| `main` changes | None authorized |

## 11. Definition of done for each implementation task

Each task is not complete until its handoff records:
- Source path(s) and symbol(s) changed.
- Canonical contract and ownership respected.
- Commit SHA and branch.
- Exact tests/commands run and their outcomes (or explicit reason not run).
- Runtime evidence when relevant.
- Remaining risks and next action.
- No claims of cross-device persistence or deployment without direct evidence.

**Next action:** start with Saved Metadata Sets correctness, add/run regression coverage, and then deliver the standalone 13b Planner Calendar integration guide plus implementation on the same working branch. Do not modify `main` or deploy without explicit authorization.
