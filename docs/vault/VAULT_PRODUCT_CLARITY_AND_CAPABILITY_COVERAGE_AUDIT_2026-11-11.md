# Vault Product Clarity & Capability Coverage Audit

**Date:** 2026-11-11  
**Repository:** `viewtube-dev/viewtube`  
**Audit target:** `master/consolidated-feature-integration`  
**Target snapshot:** `524fbcefd37f34b12d34a57d2725b2280c6692ab`  
**Execution branch:** `audit/vault-product-clarity-2026-11-11`  
**Audit type:** source/document inspection; not a live browser or runtime certification.

## 1. Executive summary

The Vault is not a blank slate and must not be rebuilt as a second product. The target branch already contains a production `/vault` route, a substantial `CreatorVaultOS` workbench, canonical local asset/search adapters, import preflight, tags, collections, selection, compare/lineage, task tracking, Inspector-related workflows, Project handoffs, and a read-only Brain adapter.

The main product problem is not simply missing tools. It is the gap between the breadth of the existing capability surface and the user's ability to understand, discover, safely operate, and reuse those capabilities. A previous screenshot-backed UI density audit found that configuration and overlapping navigation/actions dominated the mobile page before the asset library. The existing UX and component-density task lanes remain unchecked in the current task ledger.

**Current verdict:** substantial functional foundation; user-facing clarity and responsive information architecture remain an open major workstream. Exact runtime availability, authenticated durability, processor health, and live visual quality are not certified by this audit.

### Highest-impact findings

1. **P1 — Information architecture remains overloaded.** The prior UI density audit records overlapping Navigator/Explorer responsibilities, workspace settings in normal page flow, persistent Asset Operations, and external handoffs styled alongside Vault-native actions. Existing tasks RH-UX120–146 remain unchecked.
2. **P1 — Capability discovery is not yet a verified end-to-end contract.** The adaptive capability module covers a limited set of capability IDs and UI eligibility; a label or capability record does not prove that its full action path, permission, persistence and outcome are wired.
3. **P1 — Brain resource evidence has a stale destination.** `BrainVaultAdapter.ts` returns evidence routes pointing to `/reference-studio/toolbox-system`, rather than a resource-specific Vault destination. The adapter is read-only and permission-gated, which is a good boundary, but evidence navigation needs reconciliation with the canonical Vault deep-link contract.
4. **P1 — Storage and operation durability need explicit product truth.** `vaultAdapter.ts` stores asset records in browser localStorage. The Vault master explicitly says this is not server durability or server authorization; server operation storage fails closed without `VAULT_OPERATION_STORAGE_DIR` and is not itself a processing worker.
5. **P1 — The page has a high coordination burden.** `CreatorVaultOS.tsx` imports many domain services and owns a broad set of workspace, selection, intake, task, collection, Inspector and editor state. Any UI simplification must preserve those behaviors and move ownership only to existing canonical modules.
6. **P2 — Several useful capabilities remain missing, partial or blocked.** The task ledger leaves vision/suggested-tag processing, arbitrary local-file transcription, proxy derivatives, multiple Projects improvements, Editor safety/transform work and matching-tool audits open.
7. **P2 — Existing design-system migration needs reconciliation.** The page imports canonical Studio Controls alongside SubToolbox primitives. Continue the documented migration/ownership work; do not introduce page-local lookalikes or a competing primitive layer.

## 2. Scope, sources and limitations

### Repository sources inspected

- `src/app/AppRoutes.tsx` — `/vault` mounts `CreatorVaultOS`.
- `src/views/CreatorVaultOS.tsx` — production page composition, state, service imports and interaction handlers (sampled sections).
- `src/services/vaultAdapter.ts` — asset identity, local persistence, metadata search and mutation behavior.
- `src/features/vault-workbench/capabilities.ts` and `VaultAdaptiveWorkbenchHost.tsx` — adaptive capability IDs, modes and UI eligibility.
- `src/services/brain/BrainVaultAdapter.ts` — Brain's read-only Vault retrieval and evidence projection.
- `src/services/__tests__/vaultBrainSearch.test.ts` — permission and canonical-search tests.
- `src/app/__tests__/vaultRoute.production.test.ts` and `src/views/CreatorVaultOS.laneA.test.ts` — route and selected page-contract tests.
- `tasks/viewtube-vault/SPEC-vault.md` — product jobs, modes, UI contract, import, search, Inspector, lifecycle and ownership boundaries.
- `docs/Vault.md` and `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md` — canonical architecture and implementation caveats.
- `tasks/viewtube-vault/plan.md` and `tasks/viewtube-vault/todo.md` — existing continuation plan and unfinished work.
- `tasks/viewtube-vault/REHARVEST-GAP-REGISTRY.md` — donor capability gap register.
- `tasks/viewtube-vault/UI-DENSITY-AUDIT-2026-09-25.md` — previous screenshot-backed UI findings.

### What was not verified

- No local checkout or repository shell was available in this session; no source edits, tests, typecheck, lint, build or browser run were executed.
- No current deployment URL was confirmed for this target commit.
- The previous UI density audit is dated 2026-09-25. Its 9/20 score is historical evidence, not a fresh score for the 2026-10-31 target snapshot.
- GitHub source search and file reads are static evidence. They cannot prove that a processor is configured, a server worker is healthy, account authorization is enforced, or a UI interaction works in the browser.
- The Impeccable technical audit command and Product Design visual-prototype workflow could not be run in this standard chat environment. Do not describe this document as a completed live UIAudit or visual certification.

## 3. Capability-to-UI coverage matrix

Status meanings: **PRESENT-SOURCE** = source/UI foothold found; **PARTIAL** = some path exists but contract or verification is incomplete; **MISSING/OPEN** = current task ledger explicitly leaves it open; **BLOCKED/UNVERIFIED** = required backend, authorization, runtime or evidence is absent.

| Capability family | Canonical owner / evidence | Status | User impact / next action |
|---|---|---|---|
| Production Vault route | `AppRoutes.tsx`, `vaultRoute.production.test.ts` | PRESENT-SOURCE | Keep route; certify on exact head and live runtime. |
| Asset identity and search | `vaultAdapter.ts`, `VaultAsset` | PRESENT-SOURCE / local-only | Keep one identity; explain local/server sync truth and do not imply cloud durability. |
| Library modes, search and filters | `CreatorVaultOS.tsx`, `vaultWorkspaceState.ts`, `vaultAdapter.ts` | PRESENT-SOURCE | Simplify presentation without removing filters or saved state. Search is metadata substring search, not semantic search. |
| Spectrum Tags and import | `CreatorVaultOS.tsx`, `vaultImport.ts`, metadata/hash/preview helpers | PRESENT-SOURCE / PARTIAL | Retain direct vs staged intake; clearly distinguish preflight from completed ingestion. |
| Collections and smart collections | `vaultCollections.ts`, `vaultManualCollections.ts` | PRESENT-SOURCE | Make collection creation and applied-filter saving discoverable and unambiguous. |
| Selection and batch organization | `vaultSelection.ts`, page handlers, task ledger RH-B | PRESENT-SOURCE | Keep selection-dependent actions contextual; verify partial batch outcomes. |
| Quick Look, compare, versions, lineage | page, `vaultVersions.ts`, Asset Engine | PRESENT-SOURCE / runtime unverified | Use one clear preview/compare/lineage interaction model. |
| Inspector, rights, usage, custom fields | page, `vaultInspection.ts`, `vaultReviewGovernance.ts`, `vaultCustomFields.ts` | PRESENT-SOURCE / PARTIAL | Distinguish factual metadata, creator assertions, advisory findings and legal/rights decisions. |
| Task Center and media jobs | `vaultTaskCenter.ts`, operation ledger | PARTIAL | A task record is not proof a worker ran. Show truthful queued/processing/completed/failed states. |
| Image workbench | `VaultImageWorkbench` | PRESENT-SOURCE | Verify all operations create real outputs and preserve source lineage. |
| Video/audio processing | capability registry and specialist workbenches | BLOCKED/UNVERIFIED | Never advertise processing unless a verified processor is connected and healthy. |
| Brain retrieval | `BrainVaultAdapter.ts`, `vaultBrainSearch.test.ts` | PRESENT-SOURCE / read-only | Preserve permission gate and canonical search; fix resource evidence destination and verify exact evidence pack usage. |
| Brain resource actions | Brain runtime and approved action contracts | PARTIAL / proposal-first | Brain may discover and propose; mutating operations require existing approval/receipt contracts. |
| Projects / ContentBuild | `vaultProjectHandoff.ts`, ContentBuild repository | PRESENT-SOURCE / workflow gaps | Preserve canonical project identity; remaining Project enhancements belong to Projects. |
| Vision tagging / suggestions | task ledger RH-C049 | MISSING/OPEN | Do not show as active until a real provider and approval flow exist. |
| Arbitrary local transcription | task ledger RH-C050 | PARTIAL / BLOCKED | YouTube-linked path exists; local-file speech-to-text backend remains pending. |
| Proxy derivatives | task ledger RH-C051 | MISSING/OPEN | Requires real processor, bounded queue, safe retries, lineage and durable receipts. |
| UX clarity / mobile hierarchy | prior UI audit; RH-UX120–146 | OPEN | Complete compact Library-first layout and row-density pass. |
| Projects enhancements | RH-E080–093 | OPEN | Route tasks to canonical Projects/ContentBuild owners; no Vault project store. |
| Editor/media safeguards | RH-F100–104 | OPEN | Audit VT_E1 first; prefer derivative and protect GOLDEN assets. |
| Matching-tool donor audits | RH-G110–115 | OPEN | Keep each capability with its existing specialist owner. |

## 4. Confirmed architecture and ownership decisions

These are existing repository decisions to preserve, not new architecture proposals:

- **Vault:** asset access, creator organization, inspection, lifecycle, provenance presentation and workflow handoff.
- **Asset Engine / ContentBuild:** cross-workflow asset identity relationships, versions, derivatives, selections and lineage according to their current contracts.
- **Projects:** project intent, project workflow state, board/calendar and project membership.
- **BrainRuntime:** reasoning, research and suggestions; not a competing asset store.
- **ActionPacket/Handoff:** cross-tool movement with source identity and provenance.
- **Specialist tools:** image/video/audio editing and processing remain in their current owners; Vault routes to them.
- **Studio / Toolbox:** shared primitives and shells own control appearance and interaction contracts.

Do not add another Vault database, Brain memory store, project store, asset registry, processing engine, capability registry or localStorage source of truth.

## 5. UX diagnosis and product direction

### The user-facing promise

A creator should be able to answer four questions without learning the internal architecture:

1. **What am I looking at?** A named asset, collection, search result, task or workflow.
2. **What can I do here?** A small set of relevant actions with clear names.
3. **What will happen?** Inputs, destination, overwrite/derivative behavior and consequences.
4. **What happened?** Actual result, error, receipt, history and next available step.

### Recommended primary information architecture

Keep the number of top-level destinations small:

- **Library** — the default destination; asset content appears immediately.
- **Collections** — manual and rule-based groupings.
- **Import** — a clear staged/direct intake entry, reusing Import & Tags.
- **Tools** — contextual Vault-native utilities and specialist handoffs.
- **Activity** — processing jobs, history, failures and recovery.
- **Workspace settings** — density, visibility and arrangement preferences, off the primary content path.

This is a presentation model, not a request to create six separate applications or data stores. The exact final tree must be reconciled with current routes and shared Toolbox conventions.

### Library-first desktop composition

- Compact page header with Vault identity and a clearly named global action.
- One compact toolbar for search, current library state, filters, sort and view.
- Applied filters shown as removable chips.
- Asset grid/list as the dominant central region.
- Optional library navigation rail.
- Contextual Inspector on the right when space permits.
- Selection action bar appears only when selection exists.
- Workspace preferences and advanced filters open in popovers/sheets.

### Mobile composition

- Asset content is the first useful content on a normal return visit.
- Navigator/Explorer become one contextual drawer/sheet, not two competing navigation systems.
- Inspector becomes a bottom sheet or dedicated detail state.
- Task Center collapses to a compact status entry unless active/failed tasks need attention.
- No squeezed three-column desktop layout.
- Preserve selection, filter state, view mode, scroll position and active asset across orientation changes.

### Tool communication contract

Every visible tool/action must expose, in plain language:

- **Name:** verb + object where possible (e.g. “Find similar images”).
- **Purpose:** one short sentence describing the result.
- **Availability:** available, unavailable, needs setup, permission required or unsupported.
- **Inputs:** what the user must select or provide.
- **Effect:** what changes and where the result goes.
- **Safety:** whether the action is reversible, destructive, external or creates a derivative.
- **Outcome:** real progress, success, partial success or failure with recovery.

Icon-only controls require an accessible name and tooltip/focus/long-press explanation. Disabled actions should explain the missing prerequisite. Never display a fake progress or success state.

## 6. Brain integration requirements

### Current verified foothold

`BrainVaultAdapter.ts`:
- checks Brain controls and `allowVault`;
- searches through `searchVaultAssets`;
- returns a bounded metadata projection rather than raw files or Drive IDs;
- maps results to `BrainEvidenceItem` records;
- has tests for canonical search and the Vault permission gate.

### Finding to fix

The adapter currently assigns every evidence item the route `/reference-studio/toolbox-system`. That is not a resource-specific Vault deep link. Reconcile with `resolveVaultAssetDeepLink.ts` and the actual `/vault` route so a citation opens the referenced canonical asset. Preserve the evidence ID and permission behavior; add a test that asserts the exact destination and that unavailable/deleted assets fail gracefully.

### Target Brain workflow

1. Brain interprets the creator's request and resolves the current channel/project/task context using existing context contracts.
2. Brain searches canonical Vault metadata through the existing adapter and capability path.
3. The turn receives only the relevant, permitted evidence pack, with stable Vault IDs and freshness.
4. The response cites the exact resources actually supplied to that turn.
5. Opening a citation resolves the canonical asset detail, not a generic landing page.
6. Brain may propose organization, summary, metadata or derivative actions only where an existing capability supports them.
7. Mutations remain review-only until an approved action contract authorizes execution.
8. Actual outcomes use existing operation receipts and canonical output IDs; no generated or saved result is claimed without authoritative confirmation.

Do not create a second Brain resource index, memory store, evidence store, orchestration runtime or tool registry.

## 7. Prioritized implementation plan

### Phase 0 — Reconcile current truth (blocking)

- Re-fetch exact target files and current task/PR status before each code slice.
- Build the capability-to-UI/action/service/permission/result/test map for every visible Vault module and subtool.
- Classify each as covered, partial, missing UI, broken wiring, stale UI, misleading UI, duplicate UI or unverified.
- Establish current test/typecheck/build baseline and capture known failures.
- Confirm current route, deep-link, Toolbox/SubToolbox and Studio primitive owners.
- Confirm which branch/PR already contains any unfinished Vault work before creating another implementation branch.

**Exit:** a source-backed inventory with exact symbols, tests, UI entry points, permissions, dependencies and honest status.

### Phase 1 — Library-first UX and plain-language clarity

- Implement the existing RH-UX120–135 compact information-architecture decisions.
- Implement RH-UX136–146 control inventory, row packing and responsive verification.
- Replace persistent secondary modules with contextual actions/drawers/sheets where the existing plan specifies.
- Make Vault-native actions visually distinct from “Send to ViewTube…” handoffs.
- Give every tool, button, toggle, filter, status and empty state clear plain-language copy.
- Preserve all existing operations and persisted workspace preferences.
- Reuse existing Studio and Toolbox primitives; no new primitive or component without the design-system decision gate.

**Exit:** users reach assets immediately; one obvious owner per navigation/filter/action concern; no clipping/overflow at 320–430 CSS px; desktop, portrait and landscape screenshots reviewed.

### Phase 2 — Capability discoverability and truthful states

- Create/maintain a capability record using the existing owner/registry where one exists.
- For each tool, expose purpose, supported media types, selection requirements, permissions, inputs, consequence, destination, lifecycle and recovery.
- Ensure every visible control maps to a real action and every supported live capability has a discoverable entry point.
- Hide irrelevant actions or explain unavailable prerequisites contextually.
- Remove stale or duplicate affordances only after tracing their real call paths.

**Exit:** no dead/fake controls, no capability claims based only on labels or mocks, and no missing-UI gap without an explicit disposition.

### Phase 3 — Resource discovery and organization improvements

- Improve metadata search and filter usability first; preserve saved filters and IDs.
- Add semantic search only through an approved, evidence-backed retrieval design with bounded inputs and clear provenance.
- Improve smart collections, bulk organization, similarity review and asset health without duplicating current services.
- Add automated categorization/tagging only when a real provider exists and suggestions require user acceptance.

**Exit:** search and organization operations have tested query semantics, visible filters, exact result identity and honest provider/availability state.

### Phase 4 — Brain and ViewTube workflow integration

- Fix Brain evidence deep links to canonical Vault asset details.
- Verify evidence pack selection, permission gate, source freshness and exact turn-bound evidence.
- Connect project-aware resource discovery through existing context contracts.
- Preserve asset IDs and provenance across Studio, Projects, Editor, Research and Publishing handoffs.
- Keep Brain operations proposal-first; use existing approval, ToolReceipts and output records.

**Exit:** an end-to-end Brain conversation can retrieve a permitted asset, cite it, open it, propose a supported action, and display only the actual authoritative result.

### Phase 5 — Complete high-value missing capabilities

Sequence by dependency and real backend availability:
- vision/suggested tags;
- local-file transcription;
- proxy derivatives;
- derivative/overwrite guards and batch transform handoffs;
- Projects-linked asset picker and remaining canonical project features;
- matching-tool audits for Packaging, Hook, Video Manager, Analytics and VT_E1.

Do not start a feature if the real processor, canonical owner or permission contract is missing. Mark it blocked with a clear user-facing reason.

### Phase 6 — Release certification

- Focused regression tests and relevant suites.
- Typecheck, changed-file lint, architecture/governance checks and production build.
- Keyboard-only and screen-reader checks.
- Desktop, mobile portrait and mobile landscape screenshots.
- Actual import, search, select, inspect, organize, compare, handoff, retry and recovery workflows.
- Verify exact deployed commit and post-merge target read-back.

## 8. Initial implementation backlog

The existing task ledger remains the task authority. Do not replace its task IDs or create a parallel tracker.

| Priority | Existing tasks / next work | Acceptance |
|---|---|---|
| P1 | RH-A019 | Exact-head tests, build and browser verification baseline recorded. |
| P1 | RH-UX120–135 | Library-first navigation, contextual action bar, media-first cards and clear handoffs. |
| P1 | RH-UX136–146 | All rendered SubToolboxes inventoried and packed responsively; full screenshot matrix. |
| P1 | Brain evidence deep-link correction | Citation opens exact canonical Vault asset; permission and missing-asset tests pass. |
| P1 | Capability-to-UI audit | Every visible tool/action mapped to real service, permission, state, output and tests. |
| P2 | RH-C049–051 | Real provider/worker, durable receipts, safe retry and output lineage. |
| P2 | RH-E080–093 | Projects-only workflow enhancements, canonical ContentBuild identity. |
| P2 | RH-F100–104 | VT_E1 owner audit and safe derivative/batch handoffs. |
| P2 | RH-G110–115 | Specialist-tool audits; no duplicate ownership. |

## 9. Verification commands and gates

Commands found in the target `package.json` and existing Vault guidance:

- `npx vitest run src/views/CreatorVaultOS*.test.ts src/services/__tests__/vaultBrainSearch.test.ts` (adjust exact glob to the repository shell/test runner).
- `npm run test:vault-operation-store`.
- `npm run typecheck` (`tsc -b`).
- `npm run build`.
- `npm run check:src-governance` and relevant architecture checks.
- Changed-file ESLint.
- Browser capture and interaction review at desktop, mobile portrait and mobile landscape.

**No command above was run for this audit.** Record exact outputs and distinguish pre-existing failures from introduced failures. Do not certify a browser, worker, authorization or production deployment from source inspection alone.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Rebuilding a second Vault/toolbox | Extend `CreatorVaultOS` and existing owners; trace imports/call sites before adding anything. |
| Removing a control that hides unique behavior | Trace every event handler and service path; preserve behavior in a contextual destination. |
| UI promises a processor that is not connected | Capability state must come from verified dependencies, not optimistic props or labels. |
| Brain cites the wrong resource | Stable canonical IDs plus exact resource deep-link tests. |
| Brain silently mutates assets | Proposal-first and existing approval/receipt contracts only. |
| localStorage mistaken for durable cloud storage | Explain scope and block cloud durability claims until authenticated server storage is verified. |
| UI density harms accessibility | Preserve touch targets, focus, labels, keyboard access, multiline editing and zoom. |
| New primitive duplicates Studio | Existing production exports and source-of-truth docs win; request design-system approval for genuine gaps. |
| Too many independent feature modules | One adaptive workbench with contextual capabilities and a small number of reusable surfaces. |

## 11. Decisions and approvals

**Decisions already settled by existing repository authority:**
- Keep one canonical Vault/Asset Engine identity.
- Keep Projects and ContentBuild ownership outside Vault.
- Keep Brain read-only for retrieval and proposal-first for mutations.
- Keep specialist media processing in its canonical owner.
- Keep the current Toolbox/SubToolbox and Studio design-system hierarchy.

**Implementation gate:** This audit and plan do not authorize a new primitive, a schema migration, a new provider/storage dependency, or an irreversible data operation. Begin with Phase 0 verification and the already-recorded UX task lane. Any genuinely new shared UI piece must pass the existing ui-consistency decision gate before code is written.
