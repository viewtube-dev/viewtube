# System Convergence + UI Integration Execution Plan

**Date:** 2026-10-11  
**Target branch:** `master/consolidated-feature-integration`  
**Donor branch:** `audit/system-convergence-identity-certification`  
**Scope:** Selective integration of audit/system-convergence work, shared upload/header/palette UI updates, and related system features.

## Execution status

- [x] Refreshed branch comparison.
- [x] Identified donor-only file delta returned by GitHub compare.
- [x] Reviewed the donor's system-convergence protocol, TODO list, classification registry, and shared-upload/header/palette correction note in the prior audit pass.
- [ ] Inspect each changed file at both refs and reconcile symbols/behavior against the target's newer implementation.
- [ ] Produce a file-by-file port/keep/reject ledger with exact commit and dependency references.
- [x] Port low-risk UI changes selectively on child branch `fix/ui-color-order-toolbox-alignment-2026-10-11` (shared upload preview, palette reset, header alignment, canonical metadata wiring).
- [ ] Run targeted tests, typecheck, full tests, build, and browser smoke on the resulting target head.
- [ ] Update PR #16 with the verified integration summary and evidence after checks run.

**Latest compare snapshot (2026-10-11):** GitHub reports the donor branch as **19 commits ahead / 72 behind** the target, status `diverged`, with merge base `5ebdf48c02f87a96ce31a338622a7f131dc3cb30`; compared target head `b856b2157088fa06cb70ff51dab6dee768e0f384`. This is a snapshot, not a permanent branch fact. The donor is not to be merged wholesale.

## Safety and ownership rules

1. Work only on `master/consolidated-feature-integration` (or a dedicated child integration branch created from it). Do not modify or merge to `main` without explicit approval.
2. Keep the existing target implementation as the starting point. The donor is a source of candidate changes, not the new source of truth.
3. Preserve the current Video Publisher header toggle: **Publish / Generate**, inline beside the title, with upload-based format inference (Shorts only for a finite duration under 180 seconds and portrait/square media; otherwise Longform). Preserve the Video Manager toggle: **Manage / Generate**. Do not reintroduce Show/Hide Actions or a Longform/Shorts header toggle.
4. Do not modify the frozen `StudioHubCompletePrimitiveCatalog.tsx`.
5. Do not use `visual-test/canonical-default-system-65-66` as an implementation baseline or evidence of correctness. Do not replace current canonical CSS with its older stylesheet.
6. Do not delete or quarantine runtime code until production caller inventory and zero-caller certification are evidenced.
7. Do not create competing identities or duplicate stores for Project, ContentBuild, Video Package, Publishing Package, Asset Engine, Vault, analytics, or saved metadata sets.
8. Plans and source-contract tests are not runtime verification. Report only checks actually run and their results.

## Refreshed donor delta

GitHub's compare endpoint returned these nine file paths:

| File | Compare status | Changes | Initial disposition |
|---|---|---:|---|
| `docs/ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md` | modified | +13 | Review and reconcile as documentation; retain only accurate current claims. |
| `docs/ui/VIEWTUBE_SHARED_UPLOAD_HEADER_PALETTE_CORRECTION_2026-10-11.md` | added | +32 | Retain as evidence/context; explicitly mark implementation and deployment status accurately. |
| `src/components/ProjectStudio.tsx` | modified | +11/-14 | Inspect symbol-level behavior before porting; preserve target project/persistence logic. |
| `src/components/Toolbox.tsx` | modified | +11/-1 | Inspect header action placement, palette propagation, responsive behavior, and accessibility. |
| `src/components/metadata/CanonicalMetadataSections.tsx` | modified | +17/-4 | Inspect shared upload field integration and metadata order/contract tests. |
| `src/components/projects/ProjectBoardWorkspace.tsx` | modified | +5/-3 | Inspect header toggle migration and existing project view behavior. |
| `src/components/subtoolbox/SubToolboxPrimitiveSystem.test.tsx` | modified | +17 | Review test coverage and avoid source-text-only assertions where behavioral tests are possible. |
| `src/components/subtoolbox/SubToolboxPrimitives.tsx` | modified | +66/-9 | Inspect shared upload target, word toggle geometry, palette variables, keyboard/drop handling, and object-URL cleanup. |
| `src/styles/subtoolbox-system.css` | modified | +165/-13 | Port only scoped rules that do not regress existing desktop/mobile layouts, tokens, or other primitives. |

The compare endpoint gives per-file stats, not the full commit-to-file mapping. Build that mapping before cherry-picking or reconstructing commits. No source merge, cherry-pick, test run, build, or deployment is claimed by this document.

## Workstream 1 — UI convergence

### 1A. Shared upload frame

Verify and selectively integrate the shared image/video upload target:
- click-to-select and drag/drop behavior;
- keyboard access, focus indication, labels, and error states;
- image/video type and size validation consistent with existing field contracts;
- preview/object-URL lifecycle, including cleanup on replacement and unmount;
- palette-derived border/stroke and action placement without hard-coded per-tool copies;
- clear distinction between an ephemeral local preview and a canonical saved asset.

Acceptance: shared primitive is used by intended metadata fields; uploads do not silently imply persistence; object URLs are revoked; existing metadata ordering and project/package save behavior remain intact.

### 1B. Header word toggles and palette behavior

Review `ToolboxHeaderToggle` and related styles for:
- intrinsic label-width sizing and selected-handle geometry;
- consistent `--pair-a` / `--pair-b` palette propagation;
- reset/reallocation behavior when the parent palette changes;
- correct inline placement next to the title on desktop and mobile;
- keyboard navigation, accessible names/selected state, and no accidental form submission;
- no white-square secondary action row or mobile overflow.

Preserve target-specific Publisher and Manager labels and workflows listed in the safety rules. Do not copy a donor toggle over the target toggle without a prop/behavior comparison.

### 1C. Project workspace controls

Inspect the donor's Project Board and Project Studio changes. Use the canonical Toolbox/SubToolbox primitives for Board/Calendar and Channel/Projects selectors where that is the intended behavior. Confirm state ownership, URL/navigation behavior if present, and mobile wrapping. Avoid UI-only changes that detach the controls from the underlying project state.

### 1D. Canonical metadata upload fields

Review `CanonicalMetadataSections.tsx` for field order, shared upload primitive use, accessibility, and consistency between Publisher and Manager. Manager remains published-video metadata management and must not gain a video upload/publish flow. Publisher remains project preparation and explicit publishing.

## Workstream 2 — System-convergence domains

Use the donor's six canonical domains as an audit framework, not as proof of completion:

1. **Creator Context & Knowledge** — identify the authoritative creator/channel/context records, source freshness, and authorized read/write paths.
2. **Evidence & Intelligence** — define stable evidence IDs, provenance, freshness, confidence, and which recommendation claims they support.
3. **Project / Content / Asset Graph** — reconcile Project, ContentBuild, Video Package, Publishing Package, Asset Engine, and Vault identities and lifecycle transitions.
4. **Creator Operations & Generation** — establish operation records, generation inputs/outputs, idempotency, cancellation/retry behavior, and a single write owner per field/entity.
5. **Outcomes / Evaluation / Learning** — connect published item identity and timestamps to analytics snapshots, experiments, metadata-set lineage, and attributable outcomes.
6. **Brain Runtime & Experience** — migrate callers through stable facades and preserve user-visible continuity, permissions, observability, and recovery.

For each domain, inventory production callers and writes first; map each old service to KEEP, MERGE, PROJECT, ADAPTER, PAIR, QUARANTINE, or REMOVE; name the destination owner; write an additive successor contract; add parity tests; migrate callers; add observability; certify zero callers before quarantine/removal; then produce a post-quarantine audit and removal receipt.

The donor's own TODO/registry identifies outstanding work in caller certification, evidence IDs, Project↔ContentBuild identity writes, package mutable-field ownership, Asset/Vault identity, operation/idempotency records, outcome producer contracts, Brain surfaces/runtime integration, and legacy `gemini.ts` generation paths. These must remain explicit open tasks until verified in source and tests.

## Workstream 3 — Analytics-to-AI and metadata package backlog

This integration must not be declared complete merely because convergence docs or facade work are present. Track the following as separate implementation milestones:

1. **Publishing/outcome identity contract:** stable published-video ID, package/project ID, publication time, channel identity, metadata-set ID/version, and event provenance.
2. **Analytics ingestion and attribution:** dated snapshots, metric definitions, freshness, missing-data behavior, and association with the correct published item/package version.
3. **AI Brain evidence pipeline:** only grounded, provenance-bearing outcomes enter recommendations; no fabricated attribution or automatic mutation/publishing.
4. **Metadata goal/style profiles:** typed goals and copy styles, constraints, generation prompt/version, model/config provenance, candidate sets, and per-field lineage.
5. **Evaluation and controlled learning:** compare outcomes across comparable periods/sets; separate correlation from causal claims; retain experiment/control metadata and confidence.
6. **Governed application:** user previews and explicitly applies selected candidates; record before/after values and the decision; do not silently overwrite user edits.
7. **Recovery and observability:** idempotent event processing, retries/dead-letter visibility, audit trail, and recovery for partial writes.

## Workstream 4 — File-by-file integration procedure

For each of the nine paths:
1. Fetch the complete target and donor versions at explicit refs.
2. Inspect the exact diff and identify the source commits that touched it.
3. Identify symbols imported/changed and their dependencies.
4. Compare target implementation age/behavior; retain target-only fixes and current contracts.
5. Record one disposition: **PORT**, **PORT WITH ADAPTATION**, **DOC ONLY**, **ALREADY PRESENT**, or **REJECT**, with rationale.
6. Port one coherent change at a time; do not combine broad CSS replacement with component logic changes.
7. Add or update focused behavioral tests in the same change.
8. Run focused tests and typecheck; then full test suite/build and route-level smoke checks.
9. Record actual command, result, commit SHA, and any remaining blocker.

Do not use a whole-branch merge or blind cherry-pick as a substitute for this ledger. If history is useful, cherry-pick only after the exact commit and dependency set are verified, and only onto the integration line.

## Workstream 5 — Validation matrix

- [ ] Baseline typecheck/test/build on the exact target head, with existing failures separated from new regressions.
- [ ] SubToolbox primitive tests: word toggle, upload/drop, keyboard/focus, palette changes, cleanup.
- [ ] Toolbox responsive layout: mobile and desktop, no overflow/hidden required actions.
- [ ] Publisher: Publish/Generate remains correct; upload inference handles portrait/square under-180-second clips, landscape clips, long clips, missing metadata, and media-load errors.
- [ ] Manager: Manage/Generate remains correct; no upload/publish controls.
- [ ] Canonical metadata order and shared fields remain consistent.
- [ ] Project Board and Project Studio selectors update the real intended state.
- [ ] Project/package/asset identity and single-write-owner contracts.
- [ ] Operation idempotency/retry and outcome event provenance.
- [ ] Full test suite, static typecheck, production build, and Studio Hub route smoke tests.
- [ ] Browser/render verification tied to the exact commit/deployment SHA.
- [ ] Update PR #16 with included changes, test evidence, known failures, and deferred work.

## Pull request and completion policy

Keep work on `master/consolidated-feature-integration` and use the existing draft PR #16 as the review vehicle unless branch protections or its current base require a documented adjustment. Do not mark PR ready or merge it until the review ledger is complete and required validation evidence is attached. Never retarget or merge to `main` without explicit user approval.

## Immediate next action

Fetch both refs for all nine changed paths, plus the relevant donor commit list; produce the file-by-file disposition ledger. Start with `SubToolboxPrimitives.tsx`, `subtoolbox-system.css`, and `Toolbox.tsx` because they affect multiple tools, then validate metadata and project workspace integrations. Only after that should the convergence backend be ported domain-by-domain.


## Child-branch implementation update — 2026-10-11

The selective UI correction pass is now implemented on `fix/ui-color-order-toolbox-alignment-2026-10-11`, based on this target branch. Changes include controlled/uncontrolled preview support in the existing `SubToolboxFileTarget`, wiring to canonical metadata upload fields, palette-allocation resets, shared header alignment rules, and a focused static-render regression test. The target's measured word-toggle and existing header-action palette propagation were preserved.

The new note `docs/ui/VIEWTUBE_SHARED_UPLOAD_HEADER_PALETTE_CORRECTION_2026-10-11.md` records the exact scope. No test/build/runtime success is claimed: the focused test, typecheck, production build, and browser check still need to run. Do not merge this child branch until that gate is satisfied.
