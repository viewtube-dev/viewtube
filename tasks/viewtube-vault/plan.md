# ViewTube Creator Vault — Revised Implementation Plan

## Reset reason

The uploaded donor ZIP proved the earlier plan captured the large systems but missed several interaction/workflow details and cross-tool donor opportunities. This plan replaces the previous single-owner merge assumption.

## Phase 0 — planning and merge reset

- merge the re-harvest authority documents;
- PR #425 is historical planning provenance; this plan supersedes its donor analysis;
- PR #426 already merged and is the Lane A implementation baseline;
- do not wholesale merge Vault-Tool;
- audit current main against this revised plan before continuing follow-on donor features.

## Phase 1 — Lane A: Vault foundation

- real /vault route;
- canonical Toolbox/SubToolbox shell;
- Asset Library / Navigator / Inspector;
- search/filter/sort;
- Spectrum Tags;
- base workspace persistence;
- multi-select;
- base Batch Processor;
- base Import Station.

Follow-up repairs on the merged baseline:
- Shift range selection;
- direct/staged intake distinction;
- compatibility with PR #427 media-player primitives;
- route + service tests and rendered verification.

## Phase 2 — Lane B: interaction and organization

- Space Quick Look using canonical media-player primitives;
- Esc close behavior;
- Cmd/Ctrl+K Vault command/search action;
- Cmd/Ctrl+G create/attach project from selection;
- split-pane explorer;
- chronological timeline;
- Smart Collections;
- Favorites / Inbox / Archive / Trash;
- workspace Arrange Mode;
- module visibility preferences;
- optional 2/3-column density preference;
- saved scratchpad/checklist panels.

## Phase 3 — Lane C: intake and processing jobs

- global drag/drop capture;
- file metadata extraction;
- image dimensions;
- video duration/resolution;
- video thumbnail frame extraction;
- direct import;
- staged editable intake drafts;
- content hash;
- duplicate check;
- per-item accept/reject;
- real scanner/job lanes for EXIF/vision/transcript only when backed;
- proxy derivative job;
- progress/retry/error/task center.

## Phase 4 — Lane D: versions, captions, dependency projection

- version carousel;
- detach version preserving lineage;
- lineage/usage/rights;
- transcript/caption linked artifact;
- timestamped caption editor;
- real SRT/VTT export when available;
- transcript → Script derivative;
- project/content-build creation from selected assets;
- dependency/readiness projection;
- manifest JSON;
- factual package/storage size.

## Phase 5 — Lane E: Project Builder / Board donor upgrades

- map donor nine-stage creator lanes to canonical ContentBuild lifecycle;
- priority;
- due date;
- detail tabs;
- core promise/audience/runtime;
- phase progress;
- storyboard shot records;
- title drafts + primary selection;
- phased checklists;
- derive phase progress from checklist completion;
- script word/read-time;
- linked Vault picker;
- BrainRuntime project research handoff;
- published metric projection.

## Phase 6 — Lane F: Editor/media donor upgrades

Only after VT_E1 gap audit:
- default Create Derivative;
- explicit overwrite guard;
- batch transform request;
- trim/crop/color/LUT gaps;
- alias filename;
- protected asset enforcement.

## Phase 7 — Lane G: other matching-tool harvests

Separate PRs:
- End Screen/Packaging reference image + 16:9 + layout/palette controls;
- Hook polish modes + timing simulator;
- Video Manager tag/playlist UX if missing;
- Analytics report structured chart suggestions if useful;
- Shorts/keyframe/snapping only if current VT_E1 lacks equivalent.

## Testing and certification

Every lane:
- tests first for behavior changes;
- typecheck;
- focused Vitest;
- full relevant suite;
- build;
- changed-file lint;
- browser verification;
- desktop/mobile portrait/mobile landscape;
- keyboard/touch/accessibility;
- no simulated processor presented as real.

## Definition of done

The donor is fully harvested when every useful behavior has one of:
- implemented in canonical owner;
- explicitly scheduled in gap registry;
- verified already present;
- explicitly rejected with reason.

No valuable donor capability should remain discoverable only inside the donor ZIP.


## Phase 2B — Vault mobile density / information architecture redesign

This phase is a UX architecture reset driven by the 2026-09-25 mobile screenshot audit. It does not remove Vault capabilities; it changes where they live and when they are visible.

### Architecture decisions
- Asset Library becomes the primary surface and should appear immediately after a compact Library toolbar.
- Workspace Controls leaves normal document flow and becomes a Workspace/Layout popover or mobile sheet.
- Navigator stops being a standalone SubToolbox. Search, state, view, filter, and sort move into the Library toolbar; advanced metadata filters move into a sheet/popover.
- Explorer stops being a standalone mobile SubToolbox. Logical browsing becomes a Library drawer/desktop rail containing Projects, Collections, Brand Kit, Unassigned, and saved Smart Collections.
- Asset Operations stops being a persistent full-page module. Selection-dependent actions become a contextual Selection Action Bar.
- External destinations are labeled **Send to ViewTube…** and separated visually from Vault-native actions.
- Import & Tags remains one independent SubToolbox with TAGS / IMPORT modes.
- Text Editor remains its own independent SubToolbox.
- Task Center defaults to a compact status entry unless work is running, failed, or explicitly opened.
- Inspector is contextual: bottom sheet / scroll target on mobile, persistent right rail on wide desktop.

### Asset-card redesign
- replace the fixed preview + always-visible tags/notes split with a media-first card;
- use source aspect ratio and remove unnecessary preview letterboxing;
- default card shows media, title, compact metadata, and a small tag summary;
- notes and deep metadata move to Inspector;
- document cards show text excerpts, audio shows waveform/metadata, video shows extracted still;
- selected cards may expose a small contextual action row, not a second Inspector.

### Responsive targets
- portrait mobile: toolbar + asset browser first, drawers/sheets for secondary controls;
- landscape mobile: asset browser plus optional Inspector/detail rail;
- desktop: compact left Library rail + center Asset Library + right Inspector;
- preserve selection, filters, view mode, scroll position and workspace state across orientation changes.

### Verification targets
- first asset content is visible in the first viewport on a normal return visit;
- pre-library default control chrome is <= 180 CSS px;
- no full-width module-visibility button stack in page flow;
- no clipped segmented controls at 320–430 CSS px;
- no duplicated ownership between Library toolbar, Library drawer, Selection Action Bar and Inspector;
- external ViewTube destinations cannot be mistaken for Vault-native tools;
- empty notes/status areas do not reserve card height;
- asset-card non-media chrome <= 96px in compact mode;
- desktop, portrait and landscape screenshots pass a single bounded UI audit.


---

## Continuation plan — adaptive Vault Workbench (2026-10-13)

**Status:** PROPOSED CONTINUATION PLAN — implementation and runtime status must be reverified before each work slice.  
**Capability:** `CAP-ASSET-LINEAGE`  
**Plan family:** `PLAN-FAMILY-ASSET-VAULT`  
**Canonical capability authority:** `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md`  
**Vault workbench authority:** `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`  
**Existing work checked:** `tasks/viewtube-vault/plan.md`, `tasks/viewtube-vault/todo.md`, `tasks/viewtube-vault/CAPABILITY-MAP.md`, `tasks/viewtube-vault/SPEC-vault.md`, `docs/handoffs/VIEWTUBE_VAULT_MASTER_HANDOFF_2026-09-26.md`, `docs/recovery/handoffs/VIEWTUBE_VAULT_PROJECTS_CONVERSATION_RECOVERY_2026-10-04.md`, current `src/views/CreatorVaultOS.tsx`, and `src/services/vaultWorkspaceState.ts`.

**Convergence decision: EXTEND.** Continue the existing Vault implementation and its existing plan family. Do not create a second Vault application, parallel asset store, duplicate service, new Workbench mini-app per tool, or a competing task ledger. The current canonical page source found is `src/views/CreatorVaultOS.tsx`; the previously reported `src/features/vault-workbench/*` host/capability files were not found at the expected paths on `main`, so their existence and ownership remain unverified. Reconcile source paths and runtime ownership before porting or recreating any adaptive host code.

### Objective

Deliver a compact, reliable Vault Asset Workbench where creators can find, preview, inspect, organize, safely transform and reuse assets, while preserving canonical asset identity, versions/derivatives, permissions, lineage, and handoffs to Projects/ContentBuild and other ViewTube tools.

The target remains **one adaptive Workbench, many contextual capabilities, a small number of reusable surfaces**: Browse/View, Inspect, Edit, Compare, Process, Organize and Workflow. These are modes inside the existing Vault experience, not separate applications.

### Non-negotiable architecture and UI rules

1. **Preserve one canonical asset identity.** Extend the existing asset adapter/service/schema after inspecting it. Do not create a second Vault store or duplicate project/collection membership model.
2. **Keep ownership boundaries explicit.** Vault owns durable asset access and organization; Asset Engine owns cross-workflow asset relationships/versions/derivatives where its current contract says so; Projects/ContentBuild own project intent and lifecycle; BrainRuntime proposes/suggests rather than becoming an asset database; ActionPacket/Handoff routes work between tools.
3. **Reuse the canonical Toolbox/SubToolbox shells.** For control primitives, use the canonical Studio Controls system: `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`. Do not add new production primitives or copy styles into `src/components/subtoolbox/SubToolboxPrimitives.tsx` / `src/styles/subtoolbox-system.css`. Audit existing usages and migrate confirmed missing primitives/variants through the canonical owner before consuming them in Vault.
4. **Do not claim capabilities from a catalog alone.** Record each as VERIFIED, PARTIAL, MISSING, BLOCKED or UNKNOWN with source, tests, dependencies and runtime evidence.
5. **Safe-by-default operations.** Prefer non-destructive derivatives; protect approved/GOLDEN assets; validate permissions and parameters; show preview/confirmation where consequential; preserve source IDs, operation receipts, history and lineage; make retry/cancel/partial failure explicit.
6. **Keep external destinations as handoffs.** Vault-native actions stay distinct from “Send to ViewTube…” destinations. Reuse existing ActionPacket/handoff contracts.
7. **Do not promote task states or allocate permanent VT IDs from this plan.** Reconcile proposed tasks through Task Authority and the active Task Index writer before canonical task mutation.

### Phase 0 — Canonical-source and baseline reconciliation (blocking)

**Purpose:** Establish exactly what current `main` implements before changing the architecture.

Tasks:
- Inventory the live `/vault` route, `CreatorVaultOS`, Vault adapters/services, asset types/schemas, import/task processing, collections, selection, Inspector, operation handoffs, and related tests.
- Trace the actual asset identity and persistence owner across Vault, Asset Engine, Projects/ContentBuild and ActionPacket. Map each target capability to exact source symbols and tests.
- Reconcile the existing Vault task ledger with current `main`; retain its historical IDs as local aliases, but route new/changed task state through Task Authority.
- Capture the baseline build, focused tests, lint/typecheck results and current browser behavior. Distinguish pre-existing failures from new regressions.
- Locate the current convergence capability home and any active branch/PR/missions before creating or porting implementation work.

**Acceptance / exit gate**
- A source-backed capability matrix marks implemented, partial, missing, blocked and unknown.
- No planned capability is credited as implemented without source and relevant test/runtime evidence.
- The actual route, service/schema owners, primitive APIs and supported media dependencies are identified.
- Baseline failures are recorded so the work introduces no unexplained new failures.

### Phase 1 — Finish the already-planned compact Vault UX (first implementation wave)

Use the existing **Lane UX — compact Vault information architecture redesign** in `tasks/viewtube-vault/todo.md` as the detailed source list; do not create a competing redesign plan.

Priority order:
1. Move Workspace/Layout configuration out of normal page flow.
2. Make the Asset Library the immediate primary surface with a compact toolbar for search, view, sort and core filters.
3. Consolidate browsing into a contextual drawer/desktop rail; remove duplicate Navigator/Explorer/filter/tag ownership.
4. Replace the persistent full-page Asset Operations module with a selection-dependent action bar and contextual actions.
5. Keep Import & Tags together as one independent SubToolbox; keep Text Editor separate and collapsed by default.
6. Make Inspector contextual on mobile and a right rail only at suitable desktop widths; make Task Center compact while idle.
7. Redesign cards as media-first, aspect-ratio-aware previews with only essential metadata visible.
8. Reduce nested border/shadow and secondary-action chrome without inventing page-local primitive geometry.

**Acceptance**
- The first viewport on a normal return visit shows useful Asset Library content rather than configuration modules.
- No duplicate owner for search, filtering, tags, selection actions or Inspector.
- No clipped controls at 320–430 CSS px; desktop, portrait mobile and landscape mobile are reviewed.
- Saved filters, selection, view/density, scroll and workspace preferences survive navigation/orientation changes where currently supported.
- Screenshot capture → critique → correction → recapture is completed; keyboard/touch/focus and empty/loading/error states are exercised.

**Checkpoint A:** targeted tests and production build pass with no new failures; responsive screenshot matrix is reviewed before moving to another feature wave.

### Phase 2 — Complete reliable intake and processing jobs

Continue existing Lane C gaps only after Phase 0 verifies their current status:
- Finish or explicitly block the vision/suggested-tag task unless backed by a real service.
- Finish arbitrary local-file transcript processing only when a real supported speech-to-text backend exists; preserve the already-existing YouTube-linked acquisition path.
- Add proxy derivative generation only with a real processor, resource limits, queued/running/succeeded/failed/cancelled states, retry safety and durable lineage.
- Preserve direct-import vs staged-editable-intake semantics, duplicate preflight, per-item accept/reject, metadata extraction and task-center recovery.
- Do not present placeholder/mock work as a completed scanner or processor.

**Acceptance**
- Valid and invalid files, duplicate files, permission failures, processor failures and retry/cancel behavior are tested.
- Each successful derivative links to its source; partial batch outcomes remain visible; retries do not create duplicate outputs or external side effects.
- Unsupported services are explicitly marked BLOCKED with a clear UI explanation.

### Phase 3 — Harden the shared operation and adaptive capability contract

Do this by extending current services and UI patterns, not by starting a parallel Workbench subsystem:
- Define/verify the shared capability record: stable ID, purpose, supported asset types/cardinality, preconditions, permission, parameters, consequence, operation semantics, output, canonical owner, dependencies, error/retry/cancel behavior, provenance, UI surface and tests.
- Map the seven Workbench modes to the existing page/surface structure and determine which actions should be contextual by selected asset type, selection count, state and permissions.
- Normalize operations around Validate → Preview/Confirm → Execute → Result → Lineage/History → Optional Handoff.
- Reuse the existing operation/action envelope and receipts where available; reconcile ActionPacket, generation, Vault task/history and ContentBuild event identifiers rather than adding competing operation IDs.
- Add capability search/pinning/preferences only after the basic action routing and state preservation are reliable.

**Acceptance**
- One representative read-only action, metadata mutation and derivative operation each pass through the verified shared contract.
- Disabled actions explain missing prerequisites where actionable.
- Creator-approved masters are not silently overwritten; operations preserve source identity and record outputs/provenance.
- No capability gets its own mini-application solely because it has a distinct label.

### Phase 4 — Finish Projects / ContentBuild handoff and project-workflow gaps

Reconcile each existing Lane D/E item with the actual Projects/ContentBuild owner before implementation:
- Complete the selected-assets → new/existing Project or ContentBuild path and linked Vault picker.
- Map the donor's nine-stage creator lanes to the canonical ContentBuild lifecycle; do not create a second project workflow or board.
- Add only schema-supported fields such as priority, due date, core promise/audience/runtime, storyboard shot records, title drafts/primary choice and phased checklists.
- Derive progress from checklist/lifecycle state rather than maintaining duplicate counters.
- Add BrainRuntime project-research handoff through its canonical service, and project/published analytics only where attribution and data contracts exist.
- Verify manifest/package outputs are projections, not rival canonical stores.

**Acceptance**
- Asset IDs and project/content identity survive create → reopen → edit → handoff → return.
- Project/collection relationships are durable and authorization-scoped.
- No duplicated Projects schema/store, ContentBuild lifecycle, package identity or analytics facts are introduced.

### Phase 5 — Safe media transforms and matching-tool integrations

- Audit the canonical editor/media system (VT_E1) before adding crop, trim, color/LUT, batch transform or overwrite controls.
- Prefer “Create Derivative”; require explicit confirmation for overwrite and enforce GOLDEN/protected asset guards at the service boundary.
- Keep media operations in Vault/Asset Engine/Editor according to existing ownership; Vault is not automatically a full nonlinear editor.
- Harvest End Screen/Packaging, Hook, Video Manager and Analytics donor behaviors only in separate bounded PRs after verifying that the behavior is missing and belongs in that tool.
- Route generation through BrainRuntime/Video Director where appropriate; generated results return as canonical versioned assets with provenance.

**Acceptance**
- Every transform produces a real output or is clearly marked unsupported/blocked.
- Permission, resource/time limits, unsafe input, overwrite, cancellation and failure cases are tested.
- Adjacent tools retain one owner for each capability.

### Phase 6 — Capability coverage and release certification

- Maintain evidence-backed coverage for every implemented/actively planned capability using the existing master and Tool Record Contract; do not duplicate the inventory into another master.
- Certify Vault ↔ Asset Engine ↔ Projects/ContentBuild ↔ ActionPacket/Handoff ↔ Publisher where applicable.
- Verify access boundaries, data integrity, lineage, history, responsive UI and accessibility.
- Run focused tests, relevant integration tests, typecheck/lint, production build, browser smoke and exact-commit deployment verification where deployment is available.
- Update the existing canonical Vault and Asset Engine authorities only for durable contract changes; update governed registry metadata in the same PR when an authority is substantively changed. Record actual verification in a receipt/work handoff.

**Final exit gate**
- The compact Library-first UX is visually certified.
- Each claimed capability has source/test/runtime evidence and honest status.
- No new unexplained build/test failures versus baseline.
- No duplicate asset/project/operation stores or parallel primitive systems.
- All consequential actions preserve authorization, source identity, history and lineage.
- The exact merged commit is rechecked after merge; a branch-only success is not production verification.

### Existing-work / convergence findings

- Existing plan family: `PLAN-FAMILY-ASSET-VAULT`; survivor authority: `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md`.
- Existing Vault work plan and task list already contain Lane A–G and UX requirements. This section extends their sequencing; it does not replace their unique donor findings.
- Current source inspection confirms `src/views/CreatorVaultOS.tsx` and `src/services/vaultWorkspaceState.ts` exist on `main`. The previously reported `src/features/vault-workbench/*` paths were not found at those exact paths, so the adaptive-host implementation must be located or rebuilt by extending the actual canonical owner only after Phase 0.
- No runtime implementation was performed by this planning update. All phase completion states remain unverified until the work is executed and evidenced.


---

## Phase 2C — Vault SubToolbox component layout and vertical-density audit

**Status:** PLAN ONLY. Source-level audit performed against the current canonical branch. The earlier screenshot-backed mobile audit dated 2026-09-25 is retained as historical evidence; a fresh live screenshot pass across desktop, portrait and landscape is still a required acceptance gate.

### Objective

Audit every currently rendered Vault SubToolbox and the shared primitives/layout recipes it uses. Re-compose controls into compact, task-coherent rows; use shorter component variants where appropriate; reduce repeated padding, labels, nested frames and unnecessary vertical stacks while preserving behavior, legibility, touch access, the ViewTube visual identity and the existing canonical component owners.

### Source evidence and verified findings

Reviewed current canonical source:
- `src/views/CreatorVaultOS.tsx` — Vault page and rendered SubToolbox composition.
- `src/views/vault/VaultImageWorkbench.tsx` and `src/views/vault/VaultVideoWorkbench.tsx` — image/video operation forms.
- `src/components/Toolbox.tsx` — Toolbox/SubToolbox shell.
- `src/components/subtoolbox/SubToolboxPrimitives.tsx` — shared controls.
- `src/components/subtoolbox/SubToolboxLayouts.tsx` — reusable stack/grid/actions/section composition.
- `src/components/subtoolbox/tokens.ts` and `src/styles/subtoolbox-system.css` — structural levels, spacing, control sizing and responsive rules.
- Existing `tasks/viewtube-vault/UI-DENSITY-AUDIT-2026-09-25.md` and the current Lane UX task ledger.

Confirmed source findings:
1. The Vault page currently renders first-class SubToolboxes for Asset Library, Image Workbench, Video Workbench, Compare & Versions, Import & Tags, Text Editor, Workspace Notes, Task Center, Asset Health, Relationships & Duplicates, and Inspector. Legacy module IDs/labels also remain in workspace state for migration compatibility and should not be confused with visible panels.
2. `CreatorVaultOS.tsx` contains high call-site counts for `SubToolboxInnerActionButton` (90), `SubToolboxSelect` (17), `SubToolboxInput` (11), `SubToolboxTextArea` (6), `SubToolboxDataTable` (4), and `SubToolboxSegmentedToggle` (5). These counts are audit signals, not a claim that every instance is oversized.
3. The canonical layout API already provides `SubToolboxGrid`, `SubToolboxActions`, `SubToolboxStack`, and `SubToolboxSection`; current Vault composition leans heavily on local utility-class stacks/wrapping rather than consistently expressing control groups through those named recipes. Audit which existing patterns can be replaced by shared recipes before inventing any new layout primitive.
4. Canonical spacing tokens include 4/8/12/16/24px tiers. The SubToolbox CSS defaults to 12px gaps and 16px section gaps; those defaults are too generous for repeated low-priority rows when each row also contains full-size controls.
5. Canonical structural controls include L0 56px, L1 48px, and L2 32px. Primitive family variants include micro/compact/standard sizes. Compactness should be chosen by task and viewport, not by globally shrinking every control.
6. The Image and Video Workbench sections use their own bordered, padded inner `section` surfaces inside a SubToolbox. Their operation forms should be audited for redundant frame/padding, stacked labels, and controls that can share a row.
7. The current CSS allows compact 32px controls and 26px micro controls, while mobile editable text has a separate 16px minimum guidance in the toolbox-builder contract. Do not make touch targets smaller than 44×44px merely to achieve visual density: use a compact visual variant inside an accessible hit area or reserve the compact variant for non-touch/secondary controls.
8. Text areas are intentional multiline surfaces and must preserve enough height for long text. They are not candidates for a blanket one-line compact conversion.

### Audit scope — every visible module

| Module | Layout audit focus | Proposed density direction |
|---|---|---|
| Asset Library | Search, state/view/sort/filter controls, kind filters, active filter chips, selection actions, list/grid controls | One compact toolbar row where width permits; on narrow portrait use two deliberate rows (primary search + state/actions, then horizontally scrollable filters), not several wrapping full-width rows. Keep active chips only when applied. |
| Image Workbench | Transform parameters, crop/rotation/flip, resize dimensions, format/quality, focal point, palette, preview/result/save actions | Group related numeric/select controls into responsive 2-column rows; put paired dimensions together; keep one primary Apply/Generate row and a compact result-action row. Crop-only controls appear only when crop is enabled. Keep preview/result visible when present. |
| Video Workbench | Operation, quality, trim start/end, frame timestamp, duration, output/result actions | Put operation + quality on one row; pair trim start/end or timestamp/duration in one row according to selected operation; show only fields relevant to the chosen operation; keep processing status and errors compact but readable. |
| Compare & Versions | Pair selection, before/after, version list, lineage/usage actions | Pair eligible selectors/actions into rows; do not reserve space for unavailable comparison actions; use compact metadata rows and a single responsive media comparison region. |
| Import & Tags | TAGS/IMPORT mode, tag selection/editor, file intake, pending items, duplicate review, accept/reject | Keep mode toggle in the header/first row; arrange small tag controls in compact wrapping rows; pending item controls in one row per item where possible; retain clear per-item accept/reject hit targets and error details. |
| Text Editor | Document identity, title/format, multiline content, save/download/create | Pair title with format and adjacent short actions; preserve tall multiline editor; keep Save/Download/Create actions together. Do not shrink textarea typography/height in ways that impair long-text editing. |
| Workspace Notes | Scratchpad/checklist mode, note editor, checklist actions | Default collapsed as already specified in Lane UX; in active state pair title/save and checklist controls, with notes as the intentional tall surface. |
| Task Center | Summary/status, filters, retry/clear actions, task rows | Idle state becomes one compact status entry; active/failed state uses compact rows with status + task label + contextual retry/cancel/clear, avoiding one full-width action per task. |
| Asset Health | Counts/readiness, issue groups, affected assets, project readiness | Use compact status badges/metric rows; put issue filters and project status selectors on shared rows; expand detailed asset lists only for selected issue groups. |
| Relationships & Duplicates | Similarity/duplicate actions, relationship groups, asset lists, readiness summaries | Use compact group headers and count badges; keep asset identity and action together in selectable rows; details expand on demand rather than stacking every issue's full detail. |
| Inspector | Asset title/identity, metadata, tags, lifecycle/protection, versions, rights, captions/transcript, custom fields, usage/lineage, export/handoff | Group short metadata fields into responsive two-column rows; use full width only for multiline/editable long content, tables, media, and high-consequence actions. Group actions by task and hide ineligible/empty sections. On mobile, retain contextual sheet/scroll target behavior. |

### Shared component and primitive rules

- **No new duplicate primitive system.** Use the canonical SubToolbox composition APIs for shell/layout and the canonical Studio Controls owner for text-input geometry/typography. Feature components should choose primitives and recipes, not restyle or clone them.
- Prefer `SubToolboxActions` for related action rows, `SubToolboxGrid minItemWidth="compact"` for short fields, `SubToolboxStack density="dense"` for tight groups, and `SubToolboxSection` only where a visible section label materially helps scanning. Do not wrap every single control in another card/section.
- Use L2/compact/micro variants for short selectors, filter chips, small secondary actions and metadata controls when legible; preserve standard/large variants for primary commits, prominent states and controls requiring larger touch affordances.
- Put related fields on the same row: width/height, start/end time, format/quality, title/format, search/state, status/count/action, label/value, and retry/clear actions. Use responsive grid breakpoints rather than hard-coded fixed widths.
- Replace stacked labels plus full-width control pairs with compact field groups only when labels remain programmatically associated and visible/accessible. Do not rely on placeholder-only labels.
- Use icon-only controls only when the action is unambiguous, has an accessible name, has a visible tooltip/help path, and remains easy to tap. Prefer short text labels for ambiguous operations.
- Avoid wrapping a single action to its own row when two or more independent actions can safely share one row. Do not place destructive actions adjacent to primary actions without clear separation/confirmation.
- Reduce nested borders and repeated padding; keep one strong SubToolbox shell and use interior surfaces only to distinguish genuinely different tasks or results.
- Hide empty sections and ineligible actions instead of reserving blank regions. Preserve loading, error, success, permission, and no-compatible-asset states.
- Preserve existing business behavior, asset identity, operation parameters, source/derivative lineage, selection, and saved workspace state.

### Responsive layout contract

- **Mobile portrait (320–430 CSS px):** use the smallest reasonable number of rows; toolbar controls may occupy two planned rows but must not wrap unpredictably. No horizontal page overflow, clipped labels, or offscreen action controls. Text entry remains usable with a 16px minimum effective font size on mobile WebKit; touch targets remain at least 44×44px.
- **Mobile landscape (roughly 667–900 CSS px wide and short height):** reclaim horizontal space with 2–4-column compact field/action groups; prioritize the working canvas and selected asset preview; avoid tall stacked parameter panels. Respect the virtual keyboard and preserve scroll/selection across orientation changes.
- **Tablet / narrow desktop:** use responsive compact grids with a readable minimum field width; avoid a single control spanning the full row when several short controls fit.
- **Wide desktop:** use denser multi-column layouts for short controls, but keep long text, media previews, tables and complex comparisons at useful width.
- **All breakpoints:** do not shrink multiline textareas indiscriminately; do not introduce horizontal scrolling for the entire page; horizontal scrolling is acceptable only for clearly bounded chips/tabs/toolbars when discoverable and keyboard/touch accessible.

### Implementation sequence and checkpoints

1. **Baseline and inventory:** record current branch/commit, enumerate all visible SubToolboxes and primitive call sites, run current typecheck/focused tests/build, capture desktop + mobile portrait + mobile landscape screenshots, and note pre-existing failures.
2. **Shared recipe proof:** identify the highest-reuse row/grid patterns; map existing local flex/grid markup to canonical `SubToolboxActions/Grid/Stack/Section` and canonical Studio input variants. Add/extend shared recipe support only if the current API cannot express a verified repeated need.
3. **Library + selection controls:** compact the toolbar and filter/action rows first because they dominate first-viewport height; preserve search/filter/sort/state/view behavior and saved values.
4. **Image + Video Workbench:** group short operation fields and actions into responsive rows; conditionally reveal operation-specific controls; preserve output preview, progress, errors, save/download, and derivative metadata.
5. **Import & Tags + Text Editor + Workspace Notes:** compact mode/action rows; keep multiline content intentionally tall; avoid duplicate tags/filter controls.
6. **Compare & Versions + Inspector:** pack short metadata and contextual actions into rows; keep media comparison, long descriptions, tables and advanced metadata readable.
7. **Task Center + Asset Health + Relationships:** compact idle/status/summary states; show details on demand and retain recovery actions for active/failed tasks.
8. **Regression and final audit:** run tests/typecheck/lint/build; verify all controls and keyboard/touch access; capture a single batched screenshot matrix at desktop, mobile portrait and mobile landscape; fix the full set of verified issues in one bounded pass and allow at most one confirmation capture.

### Definition of done

- Every visible Vault SubToolbox is inventoried and has a documented row/grouping plan.
- Every primitive use is classified as standard, compact/L2, micro, full-width, or multiline exception, with a reason.
- Related short controls share rows at supported widths; no full-width secondary control is left alone without a usability reason.
- The first useful Asset Library content is not pushed below the fold by configuration or redundant control chrome.
- Portrait and landscape layouts show no clipped controls or page-level horizontal overflow.
- Touch targets, labels, focus indicators, keyboard access and text-entry usability remain accessible.
- Multiline text areas remain tall enough for real editing; mobile input font-size contract is preserved.
- No behavior, metadata, derivative lineage, import review, or handoff semantics regress.
- Exact commit has a successful build and the desktop/portrait/landscape screenshot review is recorded.
