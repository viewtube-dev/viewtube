# Consolidated 25-Item Implementation Backlog — Lifecycle, Metadata, UI, and Release

**Target branch:** `master/consolidated-feature-integration`  
**Date:** 2026-10-11  
**Purpose:** Convert the current 25-item gap inventory into an implementation order tied to canonical plans and release gates. This is a working backlog, not proof that any listed feature is absent or incomplete in the current source. Verify each item against the exact branch head before coding.

## Source-of-truth reading order

1. [Integrated Content Lifecycle, Analytics & Studio Hub Master Plan](./VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md)
2. [Post-9:45 PM Planning Integration Master](./VIEWTUBE_POST_9_45PM_PLANNING_INTEGRATION_MASTER_2026-10-07.md)
3. [System Convergence and Consolidation](./VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md)
4. [Integrated Metadata System Execution Plan](../product/studio-hub/INTEGRATED_METADATA_SYSTEM_EXECUTION_PLAN_2026-10-06.md)
5. [Toolbox UI Master Resource](./VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md)
6. [Studio Hub Component Library Source of Truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md)
7. [October 11 Studio Hub Component Library UI Audit](../ui/STUDIO_HUB_COMPONENT_LIBRARY_UI_AUDIT_2026-10-11.md)
8. [Consolidated Master Validation Checklist](./VIEWTUBE_CONSOLIDATED_MASTER_VALIDATION_CHECKLIST.md)

The focused plans establish intent and contracts; current source establishes behavior; tests and runtime checks establish completion. If a linked path does not exist at the current target ref, record that as a documentation-path reconciliation item rather than assuming its contents.

## Execution policy

- Work only on `master/consolidated-feature-integration` or a dedicated child branch from it. Do not merge to `main` without explicit approval.
- Extend canonical services and identity owners; do not create parallel project/package/asset/analytics stores.
- Preserve the boundary: Publisher prepares/publishes unpublished projects; Manager edits already-published videos; Metadata Master proposes and compares package-level candidates but does not silently apply or publish.
- Keep the frozen `StudioHubCompletePrimitiveCatalog.tsx` unchanged and do not use the excluded visual-test branch as implementation authority.
- Before implementation, annotate every backlog item with source evidence: current implementation location, plan contract, known gaps, tests, and acceptance criteria.
- Do not call an item complete because a plan, UI component, persistence helper, or source-contract test exists.

## Phase 0 — Baseline and ownership (blocking gate)

- [ ] Record exact target SHA and clean comparison snapshot.
- [ ] Run dependency install from the repository lockfile.
- [ ] Run typecheck, focused tests, full test suite, and production build; classify inherited failures separately from regressions.
- [ ] Trace the canonical write owner and stable identity for Project, ContentBuild, Video Package, Publishing Package, Asset Engine/Vault, metadata option/set, publish transaction, and analytics checkpoint.
- [ ] Confirm the PR's target/base and release gates; keep PR #16 in review/draft state until evidence is attached.

**Exit gate:** reproducible baseline with exact commands, SHA, logs/results, and a documented failure classification.

## Phase 1 — Publisher persistence and metadata lineage (items 01–05)

### 01. Saved Metadata Sets in Publisher
- [ ] Trace `publisherMetadataPackageOptions.ts`, its persistence service, tests, and `PublisherMetadataPackageOptions.tsx` to the current Publisher route.
- [ ] Wire the existing saved-set UI to the canonical current package without introducing another store.
- [ ] Verify loading, empty/error states, selecting, and saving.

### 02. End-to-end project/package round trip
- [ ] Test edit/generate/refine/save/leave/reopen/restore across the canonical Project + ContentBuild + package identity.
- [ ] Confirm thumbnails and other assets retain stable IDs and do not depend on stale local object URLs.

### 03. Save / Save as Option / Choose / Restore
- [ ] Specify the distinction between active working state, saved alternative, selected option, and restored snapshot.
- [ ] Test that Save as Option does not replace the current selection unless explicitly chosen.
- [ ] Test restore and conflict behavior when the package has changed since a snapshot was saved.

### 04. Generation, refinement, and asset lineage
- [ ] Persist operation/generation IDs, model/prompt/config provenance where available, parent generation, field-level source, selected asset ID, package ID, option ID/version, actor, and timestamp.
- [ ] Preserve manual edits and represent missing legacy lineage honestly.

### 05. Exact approved-publication attribution
- [ ] Define a publish snapshot/transaction tied to the exact package version and selected title, thumbnail, description, tags, category, playlist and optional fields.
- [ ] Record approval and actual publish result separately from a merely saved or selected option.
- [ ] Ensure the post-publication record reflects what the platform accepted, including partial failure/normalization.

**Exit gate:** a repeatable package round-trip test and a traceable approved/actual publication record.

## Phase 2 — Channel-connected controls and metadata contract (items 06–11)

### 06. Channel playlist selector
- [ ] Trace channel authentication, playlist API/service, paging, stable playlist IDs, and retry/expired-auth handling.
- [ ] Implement searchable multi-select using the authenticated channel's playlists; keep Publisher and Manager consistent.
- [ ] Test loading, empty, pagination, error, retry, and stale-channel states.

### 07. Visibility and scheduling
- [ ] Model Public, Private, Unlisted, and Scheduled in ViewTube's domain.
- [ ] Treat Scheduled as a schedule with validated future date/time; map only valid platform privacy values to YouTube.
- [ ] Test timezone, invalid/past time, missing schedule, and API payload mapping.

### 08. Location autocomplete
- [ ] Identify an existing approved place provider/service before adding a new dependency.
- [ ] Implement spelling-tolerant suggestions, keyboard navigation, selected-place resolution, loading/error/retry, and manual-entry policy.
- [ ] Keep credentials server-side where applicable.

### 09. Audience unknown state
- [ ] Preserve `true | false | unset` through load/edit/save/publish.
- [ ] Show the required “IS IT MADE FOR KIDS?” wording and never silently convert unset to false.
- [ ] Verify platform-specific field mapping and required confirmation.

### 10. AI-use tracking versus platform disclosure
- [ ] Preserve legacy `aiUse` metadata and migrate it without silent data loss.
- [ ] Model general AI assistance separately from the platform's altered/synthetic-content disclosure.
- [ ] Validate the disclosure mapping against current platform requirements before publishing.

### 11. Canonical 13-section metadata workflow
- [ ] Verify exact shared order: Video Upload, Title, Thumbnail, Visibility, Audience, Timestamps, Description, Location, Playlists, Community, AI Use, Tags, Category.
- [ ] Keep Manager upload/publish-free while reusing the relevant metadata fields.
- [ ] Test section order, duplicate controls, values, Education timestamp validation, and shared field contracts.

**Exit gate:** Publisher/Manager metadata contract tests pass and channel-connected fields behave correctly against real or safely mocked service contracts.

## Phase 3 — Publishing analytics and governed learning (items 12–16)

### 12. Published-package identity to analytics checkpoints
- [ ] Connect publish transaction, platform video ID, channel ID, package/version/option IDs, selected variant IDs, and checkpoint IDs.
- [ ] Validate that every checkpoint belongs to the correct published item and time window.
- [ ] Define missing, delayed, duplicated, and corrected analytics behavior.

### 13. Decision/change lineage
- [ ] Capture before/after values or asset IDs, reason, evidence, actor, timestamp, operation ID, source tool, package/version, and publication/outcome association.
- [ ] Keep “what changed” separate from “why it changed.”
- [ ] Inventory producers and certify coverage for Publisher, Manager, Metadata Master, and applicable generation tools.

### 14. Outcome/evaluation loop
- [ ] Define metric names/units, baseline windows, evaluation windows, comparison cohorts, minimum evidence, and missing-data behavior.
- [ ] Connect publication → checkpoint → outcome → evaluation.
- [ ] Label correlation as correlation; do not claim causation without a valid experiment/design.

### 15. Governed AI Brain learning
- [ ] Emit evidence-bearing learning candidates from validated outcomes.
- [ ] Include provenance, confidence, scope, freshness, and contraindications.
- [ ] Route durable knowledge changes through existing governance/promotion, with auditability and a human approval path where required.
- [ ] Do not add a parallel AI memory or learning store.

### 16. Manager analytics-linked history
- [ ] Display published-video metadata changes with before/after values, timestamp, reason, and associated performance window.
- [ ] Distinguish observed analytics from inferred impact.
- [ ] Link history to the exact publish snapshot and relevant checkpoint.

**Exit gate:** trace one published video through approved package → actual publish → analytics checkpoint → evaluated outcome → governed learning candidate.

## Phase 4 — Metadata Master and generation workflows (items 17–20)

### 17. Metadata Master workspace
- [ ] Compare current implementation against its plan and identify missing layout/functionality at source level.
- [ ] Complete package canvas, compare/evaluation workspace, inspector, and explicit handoffs using canonical Toolbox/SubToolbox primitives.
- [ ] Keep it candidate/proposal oriented; no silent writes or publishing.

### 18. Metadata set comparison and scoring
- [ ] Define transparent score dimensions and evidence used for each score.
- [ ] Implement cross-set comparison, conflicts/redundancy, title-thumbnail alignment, readiness warnings, and locked-field protection.
- [ ] Separate deterministic validation from subjective model assessment; expose uncertainty.

### 19. Goal/style strategies informed by outcomes
- [ ] Define typed goal and copy-style profiles, constraints, candidate-set lineage, and generation configuration/version.
- [ ] Feed only relevant, provenance-bearing channel/project/package and analytics evidence into the existing generation stack.
- [ ] Test comparable evidence selection and avoid a competing prompt/provider architecture.

### 20. Publisher Write / Create workflow
- [ ] Verify Write supports field-level metadata work and Create/Generate supports idea/script/rough-video workflows.
- [ ] Confirm candidate sets, per-field generate/refine/analyze, explicit Apply, separate Save and Publish, and preservation of last-edited values.
- [ ] Keep selected package state stable when switching workflow pages.

**Exit gate:** end-to-end Metadata Master proposal → user review/apply → package save → Publisher handoff, with no implicit publish.

## Phase 5 — Canonical UI system and accessibility (items 21–23)

### 21. 44px standard and multi-select button groups
- [ ] Audit current canonical tokens and existing component variants before implementation.
- [ ] Apply the 44px control standard only to the approved component families; preserve the 3px stroke and intended ratios.
- [ ] Add canonical multi-select button-group behavior without replacing the frozen catalog or copying legacy CSS.

### 22. Primitive-family and migration coverage
- [ ] Reconcile audit requests against the current primitive catalog, component-library source of truth, and actual tool call sites.
- [ ] Add variants to canonical primitive code and component library; migrate callers rather than duplicating markup/styles.
- [ ] Keep the reference library demonstrations bound to the actual production primitives/tokens.

### 23. Responsive, keyboard, and screen-reader certification
- [ ] Test narrow mobile and desktop layouts, focus order, keyboard activation, Escape behavior, accessible names/selected state, screen-reader announcements, disabled states, and dropdown focus return.
- [ ] Measure UI Reference Library mount/render cost and defer/lazy-load only if measurement justifies it.
- [ ] Attach browser/device/viewport evidence to the exact commit SHA.

**Exit gate:** accessibility and responsive test matrix has evidence, not just source assertions.

## Phase 6 — Recovery, documentation, and release (items 24–25)

### 24. Recovery/resource/experimental-workspace reconciliation
- [ ] Reconcile unique recovery history and decisions into canonical recovery docs; do not wholesale merge historical branches.
- [ ] Check resource-library manifests for canonical vs historical/imported/unverified references.
- [ ] Keep Liquid Glass/experimental workspace isolated until dependencies, build, and integration boundary are proven.

### 25. Green reproducible release baseline
- [ ] Run install, typecheck, focused tests, full tests, production build, persistence round trips, channel-connected controls, mobile/accessibility, and lifecycle integration checks at exact target SHA.
- [ ] Classify each failure as inherited, introduced, flaky, environmental, or unresolved with evidence.
- [ ] Review full diff and update PR with exact commits, tests, known issues, and deferred tasks.
- [ ] Require explicit user approval before any merge to `main`.

## Recommended delivery slices

| Slice | Scope | Why it comes first | Required evidence |
|---|---|---|---|
| A | Baseline + identity/write-owner map | Prevents duplicate implementations and misattributed failures | Exact SHA, commands/logs, ownership table |
| B | Saved metadata sets + round trip + lineage | Establishes persistence foundation for later learning | Automated reopen/restore tests |
| C | Channel-connected controls + 13-section contract | Prevents invalid or silently altered publish metadata | Service/contract tests and UI checks |
| D | Publish snapshot + analytics checkpoints + history | Creates reliable outcome attribution | Traceable published-video example |
| E | Evaluation + governed learning + goal/style packages | Uses measured evidence safely | Provenance/evaluation tests and explicit promotion path |
| F | Metadata Master/Publisher UX + canonical UI/a11y | Makes the workflows coherent and verifiable | Behavioral, accessibility, responsive evidence |
| G | Recovery reconciliation + release gate | Leaves a reproducible maintainable integration line | PR review packet and green/dispositioned checks |

## Status tracking template

For each item, maintain: **Status** (unverified / blocked / ready / in progress / implemented / validated), **source path + symbol**, **plan contract**, **change commit**, **test command + result**, **runtime evidence**, **remaining risk**, and **next action**. No item may move to validated without reproducible evidence on the exact integration head.
