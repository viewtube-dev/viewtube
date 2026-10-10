# Video Publisher Write / Create Workspace Implementation Plan

**Date:** 2026-10-09  
**Repository:** `viewtube-dev/viewtube`  
**Implementation branch:** `feature/video-publisher-write-create-workspaces`  
**Base:** `audit/system-convergence-identity-certification`  
**Status:** DECISIONS CONFIRMED — implementation not yet verified

## 1. Product decisions confirmed in conversation

### Workspace navigation
- Video Publisher opens on **Write** by default.
- The toolbox header uses the existing ViewTube `ToolboxHeaderToggle` visual/interaction pattern to switch between **Write** and **Create / Generate**.
- The existing generation-first Video Publisher front-page experience moves to **Create / Generate**; preserve its current input and output capabilities.
- A separate global **Show / Hide Field Actions** toggle also lives in the toolbox header.
- General tool preferences persist across projects. Project-specific values and candidates remain associated with their own project.

### Write metadata fields
- Preserve the canonical metadata section order from the existing Publisher/Manager controls plan.
- Each applicable metadata field has: current input; a candidate dropdown directly underneath; then a row of **Refine / Generate / Analyze** buttons.
- The global field-action toggle hides/shows all these action rows. Hiding rows must not clear field values, candidates, or analysis.
- Candidate dropdowns show candidate value, score when available, generation style, and actions: Preview, Apply, Compare, Save, and Open Full Set when a connected set exists.
- Generate and Refine create candidates; Analyze does not change the current input.
- Applying a candidate updates the current working input only. It does not automatically save the package or publish.
- Scores distinguish **General Quality** and **YouTube Performance Potential**, with optional combined ranking. Scores are estimates unless supported by clearly identified historical evidence.

### Create / Generate
- Support individual-field generation and complete metadata-set generation.
- Complete sets are ranked by default, with side-by-side comparison for selected sets.
- A complete set supports **Apply All** and **Select Fields**. Applying updates working inputs only.
- Preserve candidate sets, style, provenance, and history when available; open a full set only when it is genuinely connected.
- The existing generation workflow and its output/export actions must not be lost during the page split.

### Video Package and working state
- A collapsible **Video Package** section sits at the bottom of Write, not in the toolbox header.
- It includes Save Package, Reapply Last Save, saved versions/options, history, and connected candidate sets where supported.
- Keep three states distinct: current working inputs, last-saved canonical package, and generated candidates/sets.
- Inputs retain their last-edited state; do not automatically replace them with saved values when navigating or switching projects.
- Reapply Last Save explicitly restores the selected project's last-saved values into its working inputs without deleting candidate history.
- Project, ContentBuild, Publishing Package / Video Package, Asset Engine, and Analytics retain their established ownership. Do not add a parallel authoritative package store.
- Saving a package is not publishing. Publication remains a separate explicit transaction.

### Post-publication analytics learning
- Show canonical YouTube analytics alongside metadata/package-change history where available.
- Use observed outcomes to improve future recommendations, while distinguishing measured values, associations, hypotheses, and conclusions.
- Record time windows and confounders; do not claim that a metadata change caused an outcome without sufficient evidence.
- Reuse the existing Metadata Intelligence history/analytics architecture and canonical Analytics source; do not create another metrics database.

## 2. Baseline implementation findings

Primary file: `src/views/VideoPublisher.tsx`.
- Current header toggles are `WORKSPACE | INTELLIGENCE` and `LONGFORM | SHORTS`, implemented with `ToolboxHeaderToggle`.
- Current Workspace view includes `CanonicalMetadataSections`, project/package save controls, and `PublisherMetadataPackageOptions`.
- The same view also includes a publishing transaction section and upload/publish operations.
- Current Create-like generation form and generated-asset results are rendered later in the same view, behind the `result` state.
- `handleGenerate` calls `generateSeoData`, updates `result`, and records versioned title candidates plus description/tags assets against the active ContentBuild when a context exists.
- Current generation results are also copied immediately into `publishTitle`, `publishDescription`, and `publishTags` by an effect. This must be changed carefully so generating does not silently overwrite Write inputs.
- Current saved package option selection updates the field states and also calls `updateProject`; review this against the new distinction between applying a candidate and saving.
- `MetadataMaster` is currently the Intelligence header mode. Reconcile this existing route/view without losing its functionality or creating a competing store.
- `CanonicalMetadataSections` is the shared metadata layout authority and must remain shared with Video Manager.
- Existing candidate provenance and ContentBuild asset variant services should be reused rather than recreated.

Related canonical documents:
- `docs/plans/VIEWTUBE_PUBLISHER_MANAGER_CHANNEL_CONNECTED_CONTROLS_PLAN_2026-10-09.md`
- `docs/product/studio-hub/VIDEO_PUBLISHER_MANAGER_HYBRID_UI_PLAN_2026-10-06.md`
- `docs/product/studio-hub/METADATA_INTELLIGENCE_HISTORY_AND_ANALYTICS_ARCHITECTURE_2026-10-06.md`
- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md`

## 3. Ordered implementation slices

### Slice 0 — Guardrails and tests (first)
1. Inspect the complete `VideoPublisher.tsx`, `CanonicalMetadataSections.tsx`, `PublisherMetadataPackageOptions.tsx`, relevant package persistence/repository services, and existing tests on this branch.
2. Add regression tests for current generation not overwriting Write values, apply-not-save behavior, project isolation, and saved-package reapplication.
3. Confirm current UI state persistence patterns and canonical package APIs before introducing new state.
4. Preserve current publishing transaction behavior and test its entry points independently from the new workspace toggle.

**Gate:** tests and state contracts are in place before UI refactoring.

### Slice 1 — Workspace split
1. Replace the existing Publisher `WORKSPACE | INTELLIGENCE` toggle with the agreed **WRITE | CREATE / GENERATE** toggle using `ToolboxHeaderToggle`.
2. Make Write the default.
3. Put the existing generation-first form/results in Create / Generate with minimal visual/behavior changes.
4. Keep project selection/context available and preserve the selected project across page toggles.
5. Ensure Write still owns the final pre-publication transaction and Create never starts publishing merely by generating/applying.

**Gate:** toggle changes only the visible workspace; it does not reset project or field state.

### Slice 2 — Working inputs vs generated candidates
1. Remove automatic result-to-Write-input replacement after generation.
2. Model candidates as proposals with field/slot, text/payload, style, score dimensions when available, provenance, source set, project ID, and ContentBuild ID.
3. Use existing Asset Engine/versioned-asset records as the lineage source where appropriate.
4. Applying a candidate updates only the working input.
5. Analyze results are read-only with respect to the current input.
6. Keep candidate application separate from package persistence and publishing.

**Gate:** generation, analysis, and page navigation never silently overwrite current values.

### Slice 3 — Shared field action rows and candidate dropdowns
1. Extend the shared canonical metadata field component API rather than creating separate Publisher-only metadata controls.
2. Add the dropdown between each input and its action row.
3. Add Preview / Apply / Compare / Save / Open Full Set only when each action is supported by the candidate data.
4. Add one global Show / Hide Field Actions toggle in the toolbox header.
5. Use ViewTube primitives/reference-library variants; do not hardcode one-off control styles.
6. Confirm Video Manager does not accidentally gain Publisher-only upload controls.

**Gate:** canonical field order remains unchanged; global toggle only controls row visibility.

### Slice 4 — Full set generation, comparison, and selective application
1. Support individual candidate generation and complete set generation.
2. Rank complete sets by available quality/performance dimensions, exposing explanations and uncertainty.
3. Add side-by-side comparison for selected sets.
4. Implement Apply All and Select Fields into working inputs.
5. Open Full Set only for a real connected set; never fabricate unavailable siblings.
6. Preserve style, provenance, source asset relationships, and project/package identity.

**Gate:** applying a set updates selected working inputs only and creates no duplicate package store.

### Slice 5 — Video Package section and working-state lifecycle
1. Add a collapsible Video Package section at the bottom of Write.
2. Move/compose package actions there: Save Package and Reapply Last Save.
3. Display saved versions/options/history using existing repository/services.
4. Keep current working inputs, last-saved canonical package, and candidate history distinct.
5. Preserve tool-level preferences across projects while keeping metadata values and candidates project-specific.
6. Do not auto-reset fields on tool navigation/project switching; Reapply Last Save is explicit.

**Gate:** edit → generate → apply → navigate → return preserves current working state; Reapply Last Save restores the selected project's saved values; save does not publish.

### Slice 6 — Analytics and evidence-linked learning
1. Inspect canonical Analytics APIs and existing metadata history/analytics architecture.
2. Link package versions and metadata change events to analytics checkpoints/time windows.
3. Show observed changes separately from associations, hypotheses, and conclusions.
4. Use outcome evidence to inform future recommendations with confidence and scope, without overclaiming causality.
5. Reuse canonical Analytics metrics and Brain knowledge promotion rules.

**Gate:** metrics remain owned by Analytics; metadata records reference analytics windows/observations rather than duplicating a metric database.

### Slice 7 — Verification and release
- Focused tests for the new workspace toggle, candidate handling, package round-trip, project isolation, and publishing transaction guardrails.
- Run repository-declared typecheck, test, and build scripts.
- Inspect generated diffs for regressions in Video Manager, Project Builder, Metadata Master, and Toolbox primitives.
- Record exact test/build/deployment outcomes. Do not claim checks passed unless actually run.
- Deploy only after the branch is reviewed and accepted; do not merge to main as part of this slice without explicit approval.

## 4. Acceptance checklist

- [ ] Write opens by default.
- [ ] Header toggle matches the existing ViewTube ToolboxHeaderToggle pattern and switches Write / Create / Generate.
- [ ] Current generation-first front page is preserved on Create / Generate.
- [ ] Generation no longer silently replaces Write inputs.
- [ ] Field action rows appear below the candidate dropdown and can be globally shown/hidden from the toolbox header.
- [ ] Candidate dropdown includes supported score/style/actions and opens a full set only when connected.
- [ ] Analyze does not modify field values.
- [ ] Apply updates working values only; save and publish are separate.
- [ ] Complete sets can be ranked, compared side-by-side, applied all-at-once or by selected fields.
- [ ] Bottom-of-Write Video Package section is collapsible and includes Save Package and Reapply Last Save.
- [ ] Last-edited working values and candidates are project-specific; tool preferences persist across projects.
- [ ] Reapply Last Save restores values without deleting candidate history.
- [ ] No parallel authoritative metadata/package/analytics store is introduced.
- [ ] Manager remains published-video-only; Publisher owns pre-publication upload and publication transaction.
- [ ] Analytics-informed recommendations distinguish observed facts from estimates and avoid unsupported causal claims.
- [ ] Focused tests, typecheck, full tests, build, and deployment status are reported accurately.

## 5. First implementation target

Start with **Slice 0 and Slice 1 only**. Do not attempt the entire candidate dropdown, package history, and analytics learning in one large edit. The highest-risk current behavior is the effect that copies generation results directly into Write inputs. Add regression coverage for that behavior before moving the generation workspace behind the new header toggle.
