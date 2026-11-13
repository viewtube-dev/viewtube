# ViewTube Vault Donor Re-Harvest — Task Ledger

## 2026-11-11 continuation on 10-31 target

- [x] Correct Brain Vault evidence links to canonical /vault asset deep links; add regression assertion.
- [x] Align Inspector archive/trash recovery visibility with the canonical lifecycle fields written by the Vault adapter; expose the existing single-asset archive handler.
- [x] Add transcript video-ID source-resolution coverage (canonical metadata, legacy metadata, ContentBuild fallback, invalid candidates).
- [x] Add detached-version regression coverage for new identity, source preservation, and lineage metadata.
- [ ] Run focused Vitest, typecheck, lint, build, and browser certification on the exact target branch; GitHub source readback is not a substitute for execution.
- [ ] Complete RH-UX120–146 visual/responsive acceptance.
- [ ] Complete RH-CAP200–205 action-to-handler/policy/receipt/recovery mapping and capability-host integration.
- [ ] Continue RH-C049–051 (Vision suggestions, arbitrary local-file transcription backend, proxy derivative task).
- [ ] Continue RH-D lineage/dependency end-to-end verification and missing regression coverage.


## Planning / reconciliation
- [x] RH-P001 Unzip and audit uploaded donor source.
- [x] RH-P002 Reclassify donor as multi-owner harvest.
- [x] RH-P003 Create full donor re-harvest authority.
- [x] RH-P004 Create 44-item gap registry.
- [x] RH-P005 Create owner-based revised merge plan.
- [x] RH-P006 Merge revised planning authority.
- [x] RH-P007 Confirm PR #425 merged as historical planning provenance; supersede its donor analysis with #428.
- [x] RH-P008 Confirm PR #426 already merged as Lane A baseline.
- [x] RH-P009 Audit merged #426 code on current main against revised Lane A scope.

## Lane A — Vault foundation
- [x] RH-A010 Production /vault route exists in PR #426.
- [x] RH-A011 Toolbox/SubToolbox Vault shell exists in PR #426.
- [x] RH-A012 Search/kind/source/sort basics exist in PR #426.
- [x] RH-A013 Spectrum Tags basics exist in PR #426.
- [x] RH-A014 Base Import Station exists in PR #426.
- [x] RH-A015 Base multi-select/Batch Processor exists in PR #426.
- [x] RH-A016 Add Shift range selection.
- [x] RH-A017 Reconcile Import Station with direct-vs-staged contract.
- [x] RH-A018 Use current media-player primitives where appropriate.
- [ ] RH-A019 Run/repair tests, build and browser verification on current main baseline.

## Lane B — interaction / organization
- [x] RH-B020 Space Quick Look.
- [x] RH-B021 Escape close contract.
- [x] RH-B022 Cmd/Ctrl+K Vault command/search.
- [x] RH-B023 Cmd/Ctrl+G selected-assets Project/ContentBuild handoff.
- [x] RH-B024 Split-pane explorer.
- [x] RH-B025 Timeline view.
- [x] RH-B026 Smart Collections.
- [x] RH-B027 Favorites/Inbox/Archive/Trash.
- [x] RH-B028 Arrange Mode/module reorder.
- [x] RH-B029 Module visibility preferences.
- [x] RH-B030 Workspace layout density preference.
- [x] RH-B031 Saved scratchpad/checklist panels.

- [x] RH-B032 Asset-aware Send To launcher through canonical ActionPackets.
- [x] RH-B033 Asset lifecycle + GOLDEN/protection controls.
- [x] RH-B034 Manual creator-curated Collections using canonical asset IDs.
- [x] RH-B035 Two-asset Compare Mode with mobile horizontal comparison.
- [x] RH-B036 Detailed Finder-style LIST with canonical data-table primitive.
- [x] RH-B037 Structured metadata filters for lifecycle/MIME/dimensions/duration/file size.
- [x] RH-B038 Typed custom fields / schema metadata in Inspector.
- [x] RH-B039 Archive/Trash recovery + guarded permanent delete.
- [x] RH-B040 Exact-duplicate review action resolves to existing canonical asset.
- [x] RH-B041 Local perceptual image fingerprints + Find Similar.
- [x] RH-B042 Deterministic local dominant-color palette extraction.
- [x] RH-B043 Before/After reveal for two selected image assets.
- [x] RH-B044 Editable Rights & License metadata.
- [x] RH-B045 Persistent Masonry library view.
- [x] RH-B046 Advanced metadata-filter workspace persistence.
- [x] RH-B047 Brand Kit role, direct creation/reuse, and curated Explorer surface.
- [x] RH-B048 Safe manual-collection rename + selected-asset membership management.
- [x] RH-B049 Smart Collections preserve full advanced filter state.
- [x] RH-B050 Recent and Generated primary library modes.
- [x] RH-B051 Typed custom fields projected into Finder schema columns.
- [x] RH-B052 Factual Needs Attention reasons + manual review flag/note.
- [x] RH-B053 Numeric 1–9 Spectrum Tag hotkeys.
- [x] RH-B054 Enter shortcut scrolls selected asset Inspector into view.
- [x] RH-B055 Orientation metadata filter persisted through workspace + Smart Collections.
- [x] RH-B056 Updated date-range filter persisted through workspace + Smart Collections.
- [x] RH-B057 Persistent horizontal Filmstrip library view.
- [x] RH-B058 Persistent canonical Lineage library view.
- [x] RH-B059 Asset Operations SubToolbox owns Search, Batch, Groups and Tools.
- [x] RH-B060 Import Station + Spectrum Tags consolidated into one independent Import & Tags SubToolbox.
- [x] RH-B061 Text Editor is its own independent SubToolbox and creates/edits canonical plain-text/Markdown assets.
- [x] RH-B062 Persist Asset Operations and Import & Tags internal modes; migrate legacy workspace module visibility/order.
- [x] RH-B063 Project / Asset Group Builder creates or attaches canonical Projects/ContentBuilds and Vault Collections.
- [x] RH-B064 Asset-aware Tools mode centralizes compatible Send To actions, selection manifests and metadata export.
- [x] RH-B065 Remove noncanonical batch project-name assignment path.
- [x] RH-B066 Asset Operations utility shelf: Quick Look, Compare Pair, Filmstrip, Lineage, Copy Asset ID.
- [x] RH-B067 Centralize Send To + metadata export ownership in Asset Operations instead of duplicating Inspector actions.

## Lane C — intake jobs
- [x] RH-C040 Global workspace drag/drop.
- [x] RH-C041 File type/MIME/size extraction.
- [x] RH-C042 Image dimension extraction.
- [x] RH-C043 Video duration/resolution extraction.
- [x] RH-C044 Video thumbnail frame extraction.
- [x] RH-C045 Direct import path.
- [x] RH-C046 Editable staged intake drafts.
- [x] RH-C047 Content hash/duplicate preflight.
- [x] RH-C048 EXIF metadata task.
- [ ] RH-C049 Vision/suggested-tag task.
- [ ] RH-C050 Transcript task. (YouTube-linked acquisition + durable retry complete; arbitrary local-file speech-to-text backend still pending)
- [ ] RH-C051 Proxy derivative task.
- [x] RH-C052 Background task center/retry/error.
- [x] RH-C053 Per-item staged tag editing before canonical ingest.
- [x] RH-C054 Zone Tag drag/drop ingestion through canonical preflight.

## Lane D — versions/captions/dependencies
- [x] RH-D060 Version carousel.
- [x] RH-D061 Detach version preserving lineage.
- [x] RH-D062 Lineage/usage/rights inspector.
- [x] RH-D063 Caption artifact editor.
- [x] RH-D064 SRT/VTT export.
- [x] RH-D065 Transcript→Script derivative.
- [x] RH-D066 Selected assets→new Project/ContentBuild.
- [x] RH-D067 Attach selected assets→existing Project.
- [x] RH-D068 Dependency/readiness projection.
- [x] RH-D069 Manifest JSON export.
- [x] RH-D070 Factual package/storage sizing.

## Lane E — Projects
- [ ] RH-E080 Nine-stage creator-lane mapping.
- [ ] RH-E081 Priority.
- [ ] RH-E082 Due date.
- [ ] RH-E083 Detail tabs.
- [ ] RH-E084 Core promise/audience/runtime.
- [ ] RH-E085 Phase progress.
- [ ] RH-E086 Storyboard shot records.
- [ ] RH-E087 Title drafts/primary.
- [ ] RH-E088 Phase checklists.
- [ ] RH-E089 Checklist-derived progress.
- [ ] RH-E090 Script word/read time.
- [ ] RH-E091 Linked Vault picker.
- [ ] RH-E092 Brain project research handoff.
- [ ] RH-E093 Published stats projection.

## Lane F — Editor/media
- [ ] RH-F100 Audit VT_E1 before scheduling donor transformations.
- [ ] RH-F101 Create derivative vs overwrite semantics.
- [ ] RH-F102 Protected asset overwrite guard.
- [ ] RH-F103 Batch transform request.
- [ ] RH-F104 Fill only verified crop/color/LUT/trim gaps.

## Lane G — matching tools
- [ ] RH-G110 Packaging/End Screen audit + donor slice.
- [ ] RH-G111 Hook polish modes.
- [ ] RH-G112 Hook timed preview simulator.
- [ ] RH-G113 Video Manager donor interaction audit.
- [ ] RH-G114 Analytics report donor audit.
- [ ] RH-G115 Shorts/VT_E1 conditional donor audit.


## Lane UX — compact Vault information architecture redesign
- [ ] RH-UX120 Remove Workspace Controls from normal page flow; replace with Workspace/Layout popover/sheet.
- [ ] RH-UX121 Replace standalone Navigator with compact Library toolbar: search, state, filters, sort, view.
- [ ] RH-UX122 Replace standalone mobile Explorer with Library drawer; keep optional compact desktop rail.
- [ ] RH-UX123 Move Brand Kit / collection creation out of Explorer and into Group Builder.
- [ ] RH-UX124 Replace persistent Asset Operations module with contextual Selection Action Bar.
- [ ] RH-UX125 Split Vault-native utilities from external handoffs; external destinations live under “Send to ViewTube…”.
- [ ] RH-UX126 Keep Import & Tags as one independent collapsed-by-default SubToolbox.
- [ ] RH-UX127 Keep Text Editor as one independent collapsed-by-default SubToolbox.
- [ ] RH-UX128 Redesign SubToolboxVaultAsset to media-first compact card with no always-reserved Notes panel.
- [ ] RH-UX129 Add document text-excerpt preview, compact audio representation, and ratio-aware image/video previews.
- [ ] RH-UX130 Make Task Center compact when idle and expand only for active/failed jobs.
- [ ] RH-UX131 Make Inspector contextual on mobile and persistent right rail only at wide desktop.
- [ ] RH-UX132 Remove duplicate tag/filter affordances from Navigator/Library once Import & Tags owns tag management.
- [ ] RH-UX133 Reduce nested border/shadow hierarchy and full-width secondary actions while preserving neo-brutalist identity.
- [ ] RH-UX134 Add mobile density acceptance tests for first-asset visibility, control-height budget, overflow and clipping.
- [ ] RH-UX135 Verify portrait, landscape and desktop screenshots; re-run UI audit after fixes.

### Checkpoint — UX architecture
- [ ] Asset Library is reachable without scrolling through configuration modules.
- [ ] Workspace configuration is off-canvas/contextual, not primary content.
- [ ] Library navigation and filtering have one obvious owner.
- [ ] Selection actions appear only when relevant.
- [ ] External ViewTube tools are visibly handoff destinations.
- [ ] Default asset cards prioritize media over metadata chrome.


## Lane UX-C — SubToolbox component row-packing and density pass
- [ ] RH-UX136 Inventory all currently rendered Vault SubToolboxes and primitive call sites; classify each control as primary, secondary, status, short field, long text, media, or contextual-only.
- [ ] RH-UX137 Capture baseline desktop, mobile portrait, and mobile landscape screenshots and record pre-existing build/typecheck/test failures before layout edits.
- [ ] RH-UX138 Standardize reusable compact row/grid/stack recipes using existing `SubToolboxActions`, `SubToolboxGrid`, `SubToolboxStack`, `SubToolboxSection`, and canonical Studio Controls; add no duplicate primitive authority.
- [ ] RH-UX139 Pack Asset Library search/state/view/sort/filter and selection controls into intentional responsive rows; preserve all filter chips and state.
- [ ] RH-UX140 Pack Image Workbench and Video Workbench short parameter fields and action buttons into responsive rows; reveal only operation-relevant fields.
- [ ] RH-UX141 Pack Import & Tags, Text Editor, and Workspace Notes control rows; preserve tall multiline editing surfaces.
- [ ] RH-UX142 Pack Compare & Versions and Inspector short metadata/action groups; preserve media, tables, long text, and consequential-action safety.
- [ ] RH-UX143 Compact Task Center, Asset Health, and Relationships & Duplicates into status/summary rows with on-demand details.
- [ ] RH-UX144 Apply compact row composition to all remaining visible Vault controls; remove redundant nested frames, repeated labels/padding, and empty reserved regions where behavior allows.
- [ ] RH-UX145 Add responsive layout assertions/tests for control grouping, no page-level overflow, touch target size, and mobile text-entry sizing.
- [ ] RH-UX146 Re-run UIAudit and capture one batched desktop / portrait / landscape screenshot matrix; fix verified defects and perform at most one confirmation pass.

### Checkpoint — component density
- [ ] Every rendered SubToolbox has a documented layout/row plan and all controls are accounted for.
- [ ] Related short fields/actions share rows at supported widths without clipped text or accidental wrapping.
- [ ] Portrait and landscape are both optimized for limited viewport height, not only width.
- [ ] Touch, keyboard, focus, accessible names, labels, error states, and multiline text remain usable.
- [ ] No duplicate primitive styling authority or feature-local component geometry is introduced.
- [ ] Typecheck, focused tests, relevant suite, lint, and production build are green or any baseline failure is explicitly documented.
- [ ] Final live screenshot review confirms the deployed exact commit.


---

## Phases 0–2 execution snapshot — 2026-11-11

**Target:** `fix/studio-controls-regression-recovery-2026-10-31`  
**Target head at audit start:** `d237d97b576ef30e1bb398b8be4194cd9712a46d`  
**Evidence:** `docs/vault/VAULT_PHASE_0_1_2_TARGET_BRANCH_AUDIT_2026-11-11.md`

### Phase 0 — target reconciliation

- [x] Confirm the 10-31 branch as the implementation target.
- [x] Inspect the production Vault route, CreatorVaultOS, canonical asset adapter, deep-link resolver, Brain adapter, capability registry, adaptive host, tests and package scripts on the target.
- [x] Confirm the canonical resolver filename is `src/services/vaultAssetDeepLink.ts`; do not add a duplicate resolver.
- [x] Reject wholesale merge of `audit/vault-product-clarity-2026-11-11` (diverged: 5 ahead / 136 behind at comparison).
- [ ] Run focused Vault/Brain tests, operation-store tests, typecheck, governance checks, build and changed-file lint on an exact local checkout.
- [ ] Capture desktop, mobile portrait and mobile landscape baseline screenshots.

**Phase 0 status:** source reconciliation complete; runtime/build/browser baseline still blocked and not certified.

### Phase 1 — Library-first UX

Verified in target source (not yet browser-certified):
- [x] Workspace layout settings already open in a modal rather than occupying the normal page flow.
- [x] Library search, navigation and filters have dedicated toolbar entry points.
- [x] Navigation and filter drawers close one another when opened.
- [x] Batch, Group Builder and “Send to ViewTube…” actions are selection- and mode-dependent.
- [x] External destinations are grouped under “Send to ViewTube…”.
- [x] Asset cards use the shared media-first `VaultAssetModule`.

Remaining work stays tracked by RH-UX120–146:
- [ ] Verify and finish Library-first first-viewport placement at desktop and mobile sizes.
- [ ] Complete responsive row-packing across every visible SubToolbox.
- [ ] Verify list overflow, drawers, focus, keyboard, touch targets and mobile orientation behavior.
- [ ] Complete exact-commit screenshot and UI audit certification.

**Phase 1 status:** substantial source implementation verified; remaining responsive and visual acceptance is open.

### Phase 2 — capability discoverability and truthful states

- [x] Confirm the existing capability registry and adaptive host; do not create a second registry.
- [x] Confirm video/audio processor availability defaults to false in CreatorVaultOS and unavailable reasons are surfaced.
- [x] Confirm the adaptive host labels availability and reasons.
- [ ] RH-CAP200 Map every visible Vault action to its UI entry point, handler, canonical service, permission/policy, output/receipt, recovery path and tests.
- [ ] RH-CAP201 Reconcile adaptive capability entries with existing page actions; do not duplicate controls or handlers.
- [ ] RH-CAP202 Give every visible action a plain-language purpose, prerequisites, consequence, destination and recovery explanation.
- [ ] RH-CAP203 Add tests for selection compatibility, unavailable reasons, protected assets and capability-to-handler coverage.
- [ ] RH-CAP204 Ensure no status chip or mode tab implies execution unless a real operation callback is wired.
- [ ] RH-CAP205 Complete accessibility review for capability modes, disabled states, labels, focus and keyboard operation.

**Phase 2 status:** registry/status foundation exists; end-to-end action mapping and verification remain open.


### 2026-11-11 follow-on — transcript resolver integration
- [x] Use the shared, unit-tested transcript video-ID resolver in the Vault Inspector.
- [x] Preserve ContentBuild YouTube binding fallback and add `youtubeId` metadata alias coverage.
- [ ] Run focused transcript and CreatorVaultOS Vitest suites on the exact 10-31 branch.


### 2026-11-11 follow-on — capability eligibility alignment
- [x] Gate Send To capability on a single selected asset and a registered compatible handoff target.
- [x] Use canonical local lifecycle policy for archive, permanent-delete and metadata-edit eligibility.
- [x] Add regression coverage for unavailable handoff status and Inspector policy/target wiring.
- [ ] Execute focused capability and CreatorVaultOS Vitest suites, then typecheck, governance, lint and build.

- [x] Prevent the Send to ViewTube panel from offering first-asset-only handoffs during multi-selection; keep batch metadata exports available.


### 2026-11-11 follow-on — restore transition policy
- [x] Require canonical restore eligibility before clearing archive/trash state in the asset adapter.
- [x] Add regression coverage for rejecting restore requests against active assets.
- [ ] Run `src/services/__tests__/vaultRecovery.test.ts` and the broader Vault lifecycle/recovery tests on the exact 10-31 checkout.
