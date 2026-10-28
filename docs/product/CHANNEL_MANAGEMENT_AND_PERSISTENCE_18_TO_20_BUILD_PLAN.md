# Build Plan: Channel Management, Public Resolution, and Persistence (Capabilities 18–20)

**Target:** `master/consolidated-feature-integration`  
**Parent resource:** [Hidden Capabilities Resource & Roadmap](./VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md)  
**Scope:** (18) Manage Channel Information, (19) Public Channel Resolution Without Login, (20) Project/Package Persistence and Resume.

## 1. Outcome
Provide reliable channel/source settings, robust public-handle resolution with honest data availability, and project/build/package resume from canonical saved state. Settings and public-channel controls already exist in source; this is a verified reachability/integration/defect plan, not an assumption that a new page is needed.

## 2. Canonical footholds and references
- [Settings.tsx](../../src/views/Settings.tsx) — settings route/container.
- [SettingsAccountPanel.tsx](../../src/views/settings/SettingsAccountPanel.tsx) — account/public-channel panel.
- [publicHandleMode.ts](../../src/services/publicHandleMode.ts) — public handle resolution/snapshot.
- [CreatorContextResolver.ts](../../src/services/brain/CreatorContextResolver.ts) — governed context facade; imports ContentBuild repository/contracts.
- [Creator Context capability](../capabilities/creator-context.md).
- [Creator Context reachability audit](../../tasks/system-convergence/CREATOR-CONTEXT-REACHABILITY.md).
- [Projects / Asset Engine / ContentBuild Workflow Master Resource](../architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md).
- [System Convergence and Consolidation](../architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md).
- [Studio hierarchy](../ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md) and [Component Library source of truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md).

Verify each path and actual caller on target branch. An existing control/helper does not prove runtime correctness.

## 3. Guardrails
- No second channel profile, public-channel store, Project, ContentBuild, Vault, or Brain store.
- Separate authenticated channel data from public-handle and fixture/degraded data.
- Do not claim keyless live resolution unless the actual resolver/provider path proves it.
- Never present fixture data as live; show source, fetch time, missing fields and failure reason when available.
- Preserve existing profile/project state; no silent reset/migration.
- Permission-check side effects and require confirmation where appropriate.

## Phase 0 — Baseline and state map
**Task 0.1**
- Inspect target branch, working tree, settings route/children, tests and current runtime errors.
- Trace channel identity, handle, resolved channel ID, ingest mode, local persistence, account state, public snapshots and errors.
- Trace Project → ContentBuild → package/asset save/load/restore paths.

**Acceptance**
- [ ] State/ownership diagram separates authenticated channel, public channel, and project/build state.
- [ ] Existing UI entry points and real handlers are listed.
- [ ] Each item is classified A hidden-functional, B disconnected, C partial, or D legacy.
- [ ] Baseline test/build failures are recorded.

## Phase 1 — Manage Channel Information (18)
**Task 1.1: Consolidate current settings**
- Verify which channel fields/actions Settings and SettingsAccountPanel already expose.
- Repair route/navigation reachability or conflicting controls; do not add a duplicate settings screen.
- Use production Toolbox/SubToolbox and Studio primitives.

**Task 1.2: Canonical save/refresh state**
- Ensure controls read/write through the existing owner and refresh from canonical state after confirmation.
- Distinguish pending, saved, unsaved, unavailable and error states based on real results.
- Do not show optimistic success before persistence confirms.

**Task 1.3: Reconcile channel context**
- Verify updates reach CreatorContextResolver consumers.
- Prevent authenticated profile fields from overwriting public-handle state and vice versa.
- Add tests for channel switching, missing fields, failed refresh and state restoration.

**Acceptance**
- [ ] One discoverable settings entry point; no duplicate state owner.
- [ ] Displayed identity matches canonical stored/resolved state.
- [ ] Save/refresh errors are visible and recoverable.
- [ ] Context consumers see confirmed changes.
- [ ] Keyboard, screen-reader, narrow-mobile and desktop checks pass.

## Phase 2 — Public Channel Mode / keyless resolution (19)
**Task 2.1: Verify the no-key contract**
- Trace handle input → UI → `publicHandleMode.ts` → provider/fixture resolver → snapshot → context ingestion.
- Identify live-provider, fixture/test, cache and unavailable paths.
- Confirm missing YouTube API key does not block supported public handle intake; do not bypass real provider constraints or call fixture output live data.

**Task 2.2: Correct the UI state model**
- Permit handle entry/submission without irrelevant login/API-key gates when supported by the actual public path.
- Show resolving, resolved, partial-data, fixture/test, no-match, unavailable-provider and error states as applicable.
- Preserve normalized handle and resolved channel ID through reload per current persistence contract.
- Make retries safe/idempotent and never invent missing counts.

**Task 2.3: Connect resolved context**
- Prove the resolved channel is the channel downstream Brain/context ingestion uses.
- Prevent mixing with signed-in identity or stale prior handle.
- Test valid/invalid handle, missing key/provider, partial fields, fixture mode, repeated resolve, refresh/reload and switching handles.

**Acceptance**
- [ ] Supported no-key path works end-to-end in its declared mode.
- [ ] Live versus fixture/degraded data is truthfully labeled.
- [ ] No fabricated metrics or misleading success.
- [ ] New resolution supersedes stale identity safely.
- [ ] Downstream context uses resolved channel ID.
- [ ] Regression tests cover no-key and failure paths.

## Phase 3 — Project/package persistence and resume (20)
**Task 3.1: Identify canonical owner**
- Follow Project → ContentBuild → asset/package state using the workflow resource.
- Inventory save/load/list/restore and active-project selection.
- Determine whether each gap is a missing caller/UI or missing implementation; do not build a second persistence layer.

**Task 3.2: Resume canonical records**
- Expose existing projects/builds/packages through the appropriate current workspace.
- Show real saved state, updated time, project/build identity and supported status from canonical records.
- Resume by loading the existing record and restoring context, not reconstructing from labels or browser-only copies when canonical records exist.
- Handle no-project, deleted/missing asset, stale/partial build and restore failure.

**Task 3.3: Preserve cross-tool continuity**
- Ensure CreatorContextResolver sees active Project/ContentBuild context when one exists.
- Preserve origin/evidence/output IDs across Brain-to-tool handoff.
- Test project switching, no-ContentBuild projects, partial assets, reload and stale IDs.
- If save/load does not exist, stop and create a separately approved persistence implementation spec; don't disguise a new data model as UI exposure.

**Acceptance**
- [ ] Resume loads canonical saved state.
- [ ] Active project/build context reaches consumers through canonical resolver.
- [ ] Missing/deleted/stale data is clear and recoverable.
- [ ] No duplicate Project/ContentBuild/asset store.
- [ ] Existing creation and restore tests remain green.

## 4. Checkpoints
- **A — baseline:** reviewed state map, code ownership, classification and baseline.
- **B — settings:** save/state/context reconciliation tests pass.
- **C — public mode:** keyless test matrix passes with data-source distinctions.
- **D — resume:** project/build resume tests pass and downstream context is verified.

## 5. Likely files
`src/views/Settings.tsx`, `src/views/settings/SettingsAccountPanel.tsx`, `src/services/publicHandleMode.ts` and directly called helpers, `src/services/brain/CreatorContextResolver.ts`, canonical Project/ContentBuild repositories/contracts, focused tests and related docs. Only touch files proven to own the behavior.

## 6. Verification
Discover current package scripts and run focused settings/public-handle/context-scope/persistence/restore tests, typecheck, lint/source-governance and production build. Browser-check keyless entry, switching handles, reload, resume, keyboard and mobile layouts. Record exact commands/results; do not claim unobserved visual or browser verification.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Existing settings mistaken for missing UI | Audit real UI and handlers before adding screens |
| Fixture data presented as live | Explicit source labeling and fixture tests |
| Public/authenticated channels mixed | Channel-scoped identity tests |
| API key blocks supported public intake | Test actual resolver path without bypassing provider constraints |
| Duplicate project persistence | Reuse canonical Project/ContentBuild/asset owners |
| Resume fabricates state | Load canonical records and show missing/stale errors |

## 8. Definition of done
Items 18–20 have source-backed classifications; settings/public mode connect to real owners; keyless behavior is accurately described and tested; resume uses canonical records; context remains scoped; no duplicate stores are added; tests/build and observed responsive/accessibility checks are recorded; missing underlying implementation is split out rather than hidden by a UI patch.
## Follow-up — local channel profile scope

`src/services/aiBrainContext.ts` now supports channel-scoped local profile, completion, and dismissal keys. The Brain workspace uses the stable channel ID first, reloads the profile when the active channel changes, and passes that same scope through intake saves and prompt construction. Legacy global data is retained and only copied into a channel scope when its saved profile name matches the active label. `CreatorContextResolver` exposes the saved creator answers through its canonical envelope while personalization is enabled.

Persistence remains local to the browser/device. This is not cross-device sync, and browser data clearing, storage quotas, eviction, and private browsing can affect retention. Automated tests/typecheck/build and mobile/desktop runtime verification are still pending.
