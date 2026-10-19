# Recent UI Branch Reconciliation and Selective Merge Plan — 2026-10-11

**Integration feature branch:** `feature/recent-ui-consolidation-2026-10-11`  
**Intended target:** `master/consolidated-feature-integration`  
**Branch base:** target branch at creation time (commit `b509cbc2fe570bf7633a34024ac057c94c41f7b5`).  
**Scope:** Recent UI, shared primitives, metadata layout, Publisher workspaces, and related fixes found across repository branches. This is an evidence-backed inventory and selective merge plan; it is not a claim that all candidates have been merged or runtime-verified.

## Guardrails

- Keep the consolidated master implementation as the base and port selectively; do not merge old branches wholesale.
- Do not merge to `main` as part of this task.
- Do not use `visual-test/canonical-default-system-65-66` as implementation baseline or proof.
- Preserve canonical Toolbox/SubToolbox primitives, shared token/palette behavior, and existing project/package identity owners.
- Preserve the product boundary: Video Manager manages already-published videos and does not upload/publish; Video Publisher prepares unpublished projects and owns publishing; Metadata Master must not become a competing Publisher/Manager implementation.
- A source diff or test file is not runtime verification. Run focused tests, typecheck, build, and live UI checks before declaring completion.

## Findings at a glance

### 1. Already merged into consolidated master: color order, toolbox alignment, shared upload preview

Branch: `fix/ui-color-order-toolbox-alignment-2026-10-11`  
Latest commit: `9132108a`  
Master contains merge commit `b509cbc2` (“Merge pull request #18 from viewtube-dev/fix/ui-color-order-toolbox-alignment-2026-10-11”), so **do not merge this branch again**.

Implemented on that branch and present in the merge:
- Shared `SubToolboxFileTarget` supports local image/video preview, reselect/change affordance, accessible hint/tooltip, and object-URL cleanup.
- Publisher and Manager canonical metadata upload fields use the shared upload primitive; local files are preview-only, not falsely treated as durable saved assets.
- Parent toolbox palette changes reset nested palette allocation/order to prevent stale child colors.
- Toolbox header title/identity rail/toggle/help/collapse controls share alignment; collapse control avoids the unwanted white square/border.
- Preserves target branch's measured header word-toggle behavior and existing palette variable propagation.
- Adds source regression coverage for upload preview/accessibility behavior.
- Corrects unset/unknown audience state to remain tri-state through saved Publisher metadata sets.
- Migrates Project Board/Studio view selectors to the canonical header toggle.
- Fixes shared upload icon import fallback.

Evidence: `docs/ui/VIEWTUBE_SHARED_UPLOAD_HEADER_PALETTE_CORRECTION_2026-10-11.md`; merge commit `b509cbc2`.

### 2. Candidate: toolbox collapse icon Chrome and reduced-motion behavior

Branch: `fix/toolbox-collapse-icon-chrome`  
Unique commits identified by branch comparison:
- `869e8853` — Fix toolbox collapse icon chrome while preserving animation.
- `317621c9` — Respect reduced motion for toolbox collapse icons.

Candidate file: `src/styles/subtoolbox-system.css`.

Disposition: **review and selectively port**. The color/alignment PR is already in master, but these two CSS commits are still branch-only relative to the current consolidated target. Compare their rules against the merged header CSS and the current `main` fix (`634e5339`, “Restore transparent animated toolbox collapse controls”) before porting. Keep transparency, animation, reduced-motion accessibility, and existing dimensions; do not overwrite the whole stylesheet.

### 3. Candidate: canonical metadata field order and component foundation audit

Branch: `feature/studio-hub-component-foundation-audit`  
Unique recent commits:
- `4908fcb8` — Align metadata controls with canonical publishing section order.
- `b0b41a2c` — Test canonical metadata visual section order.
- `baee8f01` and related docs commits — audit/reconciliation documentation.

Files identified by comparison:
- `src/components/metadata/CanonicalMetadataSections.tsx`
- `src/components/metadata/videoManagerMetadataLayout.test.ts`
- `docs/ui/STUDIO_HUB_COMPONENT_FOUNDATION_PHASE_1_SOURCE_AUDIT_2026-10-10.md`
- `docs/architecture/VIEWTUBE_BRANCH_RECONCILIATION_NEXT_STEPS_2026-10-10.md`

Disposition: **port behavior and tests selectively after three-way comparison** with the target's already-merged shared upload implementation. Preserve canonical order: Video Upload (Publisher only), Title, Thumbnail, secondary Visibility/Audience/Timestamps, Description, secondary Location, Playlists, Community, AI Use, Tags, Category. Manager must not acquire upload/publish controls. Reconcile tests so they verify both section order and correct shared upload primitive use.

### 4. Candidate: Video Publisher Write/Create workspaces

Branch: `feature/video-publisher-write-create-workspaces`  
Unique commits include:
- `a0775938` — Split Video Publisher into Write and Create workspaces.
- `86c07fec` — Add workspace contract coverage.
- `a0641cae` — Allow Publisher Render preview host.
- Related channel metadata fixes: playlist loading/delimiter/ID normalization, schedule state/persistence/validation.

Files identified:
- `src/views/VideoPublisher.tsx`
- `src/views/VideoPublisher.workspaces.test.ts`
- `vite.config.ts`
- `docs/plans/VIEWTUBE_VIDEO_PUBLISHER_WRITE_CREATE_IMPLEMENTATION_PLAN_2026-10-09.md`

Disposition: **high-value candidate, but reconcile against current target rather than replacing the file**. Preserve the Publisher's current Publish/Generate header toggle and canonical metadata sections. Keep the current Create-from-idea/script/rough-edit generation workflow on the Create page and the Write workspace separate. Check the schedule and playlist changes against the target's current controls before porting. Host allow-list changes are environment-specific and should be reviewed independently.

### 5. Candidate: Publisher saved metadata sets and package persistence

Branch: `integration/publisher-metadata-package-persistence`  
Unique files relative to the target at the last comparison:
- `src/components/PublisherMetadataPackageOptions.tsx`
- `src/services/publisherMetadataPackageOptions.ts`
- `src/services/publisherMetadataPackageOptions.test.ts`
- `src/services/publisherMetadataProjectPersistence.ts`
- `src/services/publisherMetadataProjectPersistence.test.ts`

Disposition: **compare with the newer convergence branch before porting**. This area overlaps active work on `audit/system-convergence-identity-certification`. Do not merge two implementations blindly. Use one canonical service and one saved-set component; verify that Save as Option preserves current selections, selecting an option restores the selected asset IDs into the same ContentBuild/Video Package, and repeat selection does not duplicate variants/artifacts/provenance. The currently active convergence implementation also needs build/test evidence before it is treated as complete.

### 6. Candidate: Studio Hub primitive library and compound components

Branch: `audit/system-convergence-identity-certification` (compared with consolidated master: 21 commits ahead / 95 behind at the inventory snapshot; diverged, so treat this as a file-level comparison, not a merge recommendation) and its merged UI child branch; related source/docs:
- `src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx`
- `src/views/dashboard/WidgetStandardUploadFrame.tsx` (candidate shared upload frame; compare with `SubToolboxFileTarget` to avoid maintaining two upload primitives)
- `src/components/subtoolbox/SubToolboxPrimitives.tsx`
- `src/components/subtoolbox/tokens.ts`
- `src/styles/subtoolbox-system.css`
- `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- `src/components/studio-hub/__tests__/StudioHubComponentLibraryMobileRegression.test.ts`
- `src/components/metadata/TagRankTag.tsx`
- `src/components/metadata/EducationTimestampNotes.tsx` (verify exact path/export at target ref before use)
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_UI_AUDIT_2026-10-11.md`

Patterns/features found in the audit:
- Multi-Section Script Bar reused by Script Architect.
- Nested Square Choice.
- Tag-Adjacent Split Action Row (REFINE / GENERATE / ANALYZE).
- Tone / Tension / Cinematic Dropdown.
- Ranked Metadata Tag with rank/color mapping.
- Education Timestamp Notes with timestamp validation.
- Compound primitive exports intended to replace one-off copies.
- Component-library source audit and mobile regression contract.

Disposition: **inspect target source before any port**. The audit reports these patterns on the target production Primitive track, so most may already be present; treat the branch as evidence for coverage and missing deltas, not as an instruction to duplicate the components. In the diverged audit comparison, also inspect `ProjectStudio.tsx`, `ProjectBoardWorkspace.tsx`, `Toolbox.tsx`, `CanonicalMetadataSections.tsx`, `SubToolboxPrimitives.tsx`, `SubToolboxPrimitiveSystem.test.tsx`, `subtoolbox-system.css`, and `vite.config.ts` against the target. The already-merged UI child branch contains overlapping changes, so only donor-specific behavior proven absent from target should be ported. Keep the frozen hardcoded catalog unchanged. Measure/verify performance, mobile layout, keyboard, and screen-reader behavior before further changes.

### 7. Candidate: Metadata Master v2

Branch: `feat/metadata-master-studio-hub-v2`.

Changes include Metadata Master service/view, Studio Hub navigation/handoffs, and integrations with Publisher, Manager, and Thumbnail Studio.

Disposition: **architecture review only; no wholesale merge**. Current product boundary is that Metadata Master is optimization/intelligence, not a competing top-level publishing workflow. Retain only reusable service contracts, tests, or handoff pieces that fit the current architecture and do not duplicate Manager/Publisher controls or create another package/metadata store.

### 8. Candidate: Studio Hub layout plan and general master validation

Branches:
- `feature/studio-hub-frontend-layout-plan` — documentation-only layout implementation plan.
- `test/consolidated-master-validation` and `test/consolidated-master-validation-v2` — validation branches; compare their exact test deltas before cherry-picking.
- `fix/resource-library-build-imports` — historical resource-library import fix; likely already ancestral to Metadata Master v2, but verify target source/build before treating as already resolved.
- `feature/liquid-glass-lab` — experimental visual direction; do not merge styling wholesale without explicit design selection and token compatibility review.
- `integration/viewtubebuild-2026-10-05` — older integration line; use only if a current target gap is proven.

Disposition: plans and audits may be reconciled as docs; tests are candidates after checking whether their assertions are still relevant. Do not import experimental visual treatments or old integration snapshots by default.

## Ordered merge plan

### Phase 1 — Baseline and source-of-truth check
1. Record target SHA and compare snapshots for each donor.
2. Confirm which features from the already-merged color/order/upload branch are present in target source.
3. Run dependency install, focused tests, typecheck, full tests, and production build; record inherited failures separately.
4. Verify current Publisher/Manager metadata contracts and shared primitive exports before modifying consumers.

### Phase 2 — Small isolated CSS correction
1. Compare `fix/toolbox-collapse-icon-chrome` commits with target `src/styles/subtoolbox-system.css` and current main behavior.
2. Port only missing CSS declarations and reduced-motion behavior.
3. Test transparent collapse chrome, animation, reduced motion, desktop alignment, and mobile wrapping.

### Phase 3 — Metadata section contract
1. Three-way compare target and `feature/studio-hub-component-foundation-audit` versions of `CanonicalMetadataSections.tsx`.
2. Preserve the shared upload target from the already-merged UI branch while applying only missing canonical order/label/spacing behavior.
3. Add/merge section-order regression assertions without brittle source-text-only checks where render-level tests are practical.
4. Verify Manager has no upload or publish path.

### Phase 4 — Publisher workspaces and channel controls
1. Three-way compare `VideoPublisher.tsx` and keep the target's canonical primitives and saved package flow.
2. Port Write/Create split only if absent; preserve header toggle labels and current Create workflow.
3. Reconcile playlist ID parsing, loading/error states, and schedule validation/persistence independently.
4. Keep Render/Vite host allow-list changes isolated from UI behavior and only if needed for the actual service.

### Phase 5 — Metadata package persistence
1. Compare integration branch with the active convergence implementation.
2. Select one service/component implementation and reconcile API shape, field selection, package artifact identity, and tests.
3. Verify current vs alternative save semantics, selection restore, repeat selection, thumbnail preview, and project round-trip.
4. Do not treat a local preview URL as a durable Vault asset.

### Phase 6 — Primitive library and docs
1. Check target exports and callers for every compound pattern listed above.
2. Port only missing canonical primitive code and consumer migration; no copied per-tool controls.
3. Reconcile component-library audit and layout-plan docs to the actual target source.
4. Preserve frozen catalog and excluded visual-test branch.

### Phase 7 — Verification and review
- Run focused tests for shared upload, palette propagation, metadata order, Publisher workspace, saved metadata sets, and compound primitives.
- Run TypeScript check, complete test suite, and production build.
- Test live UI at desktop, narrow portrait, and landscape; exercise click/drop/reselect upload previews, object-URL cleanup, nested palette change, collapse animation/reduced motion, section order, and Publisher workspace switching.
- Confirm Render deploy is running the intended feature branch/commit before using it as visual evidence.
- Open a PR from `feature/recent-ui-consolidation-2026-10-11` to `master/consolidated-feature-integration` only after this branch contains actual, reviewed ports and verification evidence. Keep it draft if checks are not available.

## Current status

- [x] Created a dedicated feature branch from consolidated master.
- [x] Identified the branch containing the color order, toolbox alignment, shared upload preview, and palette reset corrections; these changes are already merged to consolidated master via PR #18.
- [x] Listed candidate branches and their major recent UI changes.
- [x] Compared the current convergence branch against consolidated master and added its overlapping source paths to the selective review ledger.
- [ ] File-by-file source comparison and selective code ports.
- [ ] Focused tests, typecheck, full tests, build.
- [ ] Live browser verification.
- [ ] PR to consolidated master after evidence is available.
## Integration checkpoint — 2026-10-12

Selective ports completed into `master/consolidated-feature-integration`:

- **PR #18 — color order, toolbox alignment, shared upload preview, and palette reset:** already merged; do not re-merge `fix/ui-color-order-toolbox-alignment-2026-10-11`.
- **PR #20 — reconciliation plan:** merged the remaining UI consolidation plan document. The source branch's code was already represented in the target; this was a documentation-only delta.
- **PR #21 — toolbox collapse chrome:** merged a selective CSS port from `fix/toolbox-collapse-icon-chrome`. Preserved the target stylesheet and added only the missing overflow/transform-origin and reduced-motion declarations.
- **PR #22 — Publisher Write/Create and shared metadata controls:** merged a selective port from `feature/video-publisher-write-create-workspaces`. Publisher now separates Write (metadata and publishing transaction) from Create/Generate (idea/script/asset generation), keeps generated candidates from automatically overwriting Write inputs, supports channel-playlist dropdowns and scheduled visibility in the canonical metadata component, and retains the target's saved metadata/package persistence implementation. Related ProjectPlan and shared-control typing issues were corrected.

### Verification state after these merges

- The production build, local smoke check, focused contracts, and source-governance checks passed on the preceding PR #22 implementation commit. The final follow-up removed the generated-result auto-copy effect and updated source-contract assertions; those final edits did not receive a fresh full CI run.
- Static quality/typecheck and the full test suite were **not green** on the preceding run. Remaining failures span unrelated existing areas including `CrownLiveBrain`, Project Manifestation contracts, `StudioHubPrimitiveMigrationCatalog`, media primitives, editor-design-library templates, and Creator Vault. Full-suite failures also include stale source-contract expectations and runtime registry errors. These must be handled as a separate system-wide stabilization pass; do not attribute all failures to the selective ports.
- Vercel reported deployment rate limits, so the merged UI has not yet been visually verified through a fresh preview.

### Remaining selective merge candidates

- The primitive-library files referenced in the system-convergence audit are already represented in the consolidated target; continue file-level comparisons and do not wholesale-merge the diverged audit branch.
- The old Metadata Master and publisher-metadata persistence branches remain comparison sources only. Keep one canonical saved-set service/component and preserve the current ContentBuild/Video Package identity owners.
- Next verification gate: resolve the remaining typecheck/runtime/test failures, rerun the full CI suite, then inspect the merged Render/preview UI at desktop and mobile widths.
