# ViewTube UI Branch Consolidation Audit

**Date:** 2026-10-13  
**Repository:** `viewtube-dev/viewtube`  
**Integration target:** `master/consolidated-feature-integration`  
**Target baseline SHA at audit start:** `b8da238794dddd87005e48f813d0b44476ddf8bd`  
**Status:** Inventory and selective-reconciliation pass in progress. This document is not authorization to merge into `main` or delete branches.

## Purpose

Reconcile UI improvements across branches without losing unique code, tests, design decisions, or recovery history. The intended end state is one canonical implementation per primitive/component family, a component library that renders those actual production primitives, audited consumers, evidence-backed verification, and only then removal of obsolete branches.

This audit extends—not replaces—the existing:
- `docs/plans/STUDIO_TOOLBOX_PRIMITIVE_CONSOLIDATION_PLAN_2026-10-12.md`
- `docs/plans/STUDIO_TOOLBOX_PRIMITIVE_CONSOLIDATION_TASKS_2026-10-12.md`
- `docs/design/VIEWTUBE_DEFINITIVE_COMPONENT_LIBRARY.md`
- `docs/architecture/VIEWTUBE_CONSOLIDATED_MASTER_VALIDATION_CHECKLIST.md`

The unrelated `tasks/plan.md` and `tasks/todo.md` Settings redesign plan are intentionally untouched.

## Initial repository findings

1. The branch search returned 40 branch names. The integration target is at SHA `b8da238794dddd87005e48f813d0b44476ddf8bd`.
2. The existing component-library contract names `src/components/subtoolbox/tokens.ts` as token authority, `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx` as the definitive rendered catalog, and `src/components/SubToolboxDesignGovernance.test.ts` as a governance test location.
3. The definitive library contract records 44px standard controls, 3px stroke, 8px radius, 4px shadow offset, Inter/1000 uppercase control typography, -0.035em tracking, and 0.86 line-height. Component sizing must remain separate from structural Toolbox/SubToolbox sizing.
4. The consolidated-master validation checklist explicitly says not to merge this integration line into `main` without the required release gate and explicit user approval.
5. A workflow-run lookup for the target SHA returned no PR-triggered workflow runs. This is not proof that no other checks exist; it means this audit cannot claim a green CI result from that lookup.
6. Current UI work already has merged PRs and documentation, but their own descriptions report missing build/test/visual verification. Merge state alone is not certification.

## Branch inventory

The initial GitHub branch search returned these 40 refs:

- `audit/system-convergence-identity-certification`
- `docs/integrated-metadata-system-plan-2026-10-06`
- `docs/master-system-rebuild-resource-plan`
- `docs/recovery-canonical-sync`
- `feat/canonical-action-and-legend-primitives`
- `feat/canonical-split-left-followup-clean`
- `feat/canonical-viewtube-minimal-primitives`
- `feat/integrated-metadata-system-execution-2026-10-06`
- `feat/metadata-master-studio-hub`
- `feat/metadata-master-studio-hub-v2`
- `feat/studio-canonical-input-primitives-20-21`
- `feature/liquid-glass-lab`
- `feature/recent-ui-consolidation-2026-10-11`
- `feature/studio-hub-component-foundation-audit`
- `feature/studio-hub-frontend-layout-plan`
- `feature/video-publisher-write-create-workspaces`
- `fix/component-library-canonical-replacements`
- `fix/project-dropdown-action-rows-split-alignment`
- `fix/resource-library-build-imports`
- `fix/studio-split-left-consistency`
- `fix/toolbox-collapse-icon-chrome`
- `fix/ui-color-order-toolbox-alignment-2026-10-11`
- `integration/production-button-library-merge`
- `integration/publisher-metadata-package-persistence`
- `integration/publisher-write-create-selective-port-2026-10-11`
- `integration/resource-library-15-creator-guides-2026-10-13`
- `integration/toolbox-collapse-selective-port-2026-10-11`
- `integration/viewtubebuild-2026-10-05`
- `main`
- `master/analytics-status-badge-primitive-2026-10-12`
- `master/calendar-toolbox-status-badges-2026-10-11`
- `master/consolidated-feature-integration`
- `plan/studio-toolbox-primitives-consolidation`
- `recovery/conversation-2026-10-04-ui-render`
- `recovery/pre-document-system-migration-2026-10-04`
- `recovery/round-2-ui-render-reconciliation-2026-10-04`
- `recovery/2026-10-04-account-youtube-round1`
- `test/consolidated-master-validation`
- `test/consolidated-master-validation-v2`
- `ui/component-library-production-buttons`
- `visual-test/canonical-default-system-65-66`

This is the observed branch inventory at the time of the search. Re-query immediately before any deletion because refs can change while the audit is in progress.

## Initial compare results and dispositions

Compare direction below is integration target as base, candidate branch as head.

| Candidate | Compare result | Initial disposition |
|---|---|---|
| `main` | Diverged: main is 19 commits ahead and 391 behind the integration target | Keep separate. Reconcile provenance and deployment policy; do not merge or delete. |
| `feature/recent-ui-consolidation-2026-10-11` | Candidate has 0 unique commits; target is 216 commits ahead | Likely redundant for code. Check its associated PR/docs and preserve any unique decision records before considering deletion. |
| `fix/component-library-canonical-replacements` | Candidate has 0 unique commits; target is 92 commits ahead | Likely redundant for code. Verify PR/history and unique artifacts before cleanup. |
| `fix/ui-color-order-toolbox-alignment-2026-10-11` | Candidate has 0 unique commits; target is 221 commits ahead | PR history indicates its work was already incorporated. Verify no uncommitted remote delta before cleanup. |
| `feat/canonical-split-left-followup-clean` | Candidate has 0 unique commits; target is 101 commits ahead | Likely redundant for code; verify associated PR/decision history before cleanup. |
| `master/calendar-toolbox-status-badges-2026-10-11` | Candidate has 0 unique commits; target is 162 commits ahead | Likely redundant for code; verify associated PR and calendar changes before cleanup. |
| `feat/canonical-action-and-legend-primitives` | 12 candidate-only commits; 66 target-only commits | Review as a donor; compare each changed file against current canonical code and port only behavior or tests not already present. Do not wholesale merge stale ancestry. |
| `master/analytics-status-badge-primitive-2026-10-12` | 4 candidate-only commits; 160 target-only commits | Do not wholesale merge. Its badge CSS has older 14px/1px dense styling, while target already has 18px/2px dense styling and a newer definitive catalog. Compare semantics/tests; port only a demonstrated missing behavior. |
| `feat/studio-canonical-input-primitives-20-21` | 1 candidate-only commit; 11 target-only commits | Inspect its documentation/catalog delta. The target already includes the input primitive work in PR #37; port only a genuinely missing doc registration if confirmed. |
| `ui/component-library-production-buttons` | 8 candidate-only commits; 391 target-only commits | Stale donor with potential unique catalog work. Compare with definitive component-library PRs #32–#34 and #33 before porting; never merge whole branch. |
| `test/consolidated-master-validation-v2` | 1 candidate-only commit; 298 target-only commits | Inspect checklist delta and retain useful validation evidence; no production merge needed if the checklist is already on target. |

**Important:** Ahead/behind counts are not sufficient alone to delete a branch. A unique commit may contain valuable documentation or audit evidence even when its code is obsolete; a zero-ahead branch may still contain untracked external work or a PR that needs closure.

## Relevant PR/document evidence found

- PR #37 — canonical input/textarea primitives 20, 21, 137, 138 and catalog registration. Its description says runtime visual verification is still required.
- PR #35 — split-left typography/layout normalization; build and live visual check were still required in its description.
- PR #34 — metadata/project actions migrated to canonical primitives; test/build commands were not run in the PR environment.
- PR #33 and #32 — definitive component library and canonical primitive specimens/governance; verification was not claimed complete.
- PR #28 — the existing Studio + Toolbox primitive consolidation plan and checklist.
- PR #24 — Project Calendar scheduling/toolbox consistency changes; successful build and deployed browser QA were still required.
- PR #21 — selective toolbox collapse behavior port; target branch was deliberately kept separate from main.
- PR #20 — reconciliation documentation for the recent UI consolidation branch.
- PR #16 — draft validation PR; its description explicitly says not to merge until CI is reviewed.
- PR #15 — superseded validation PR; PR #16 is the stated replacement.
- PR #25 — production button catalog work surfaced in PR search; compare against the newer canonical library work before deciding whether to close as redundant.

PR search metadata did not reliably expose normalized state for every result. Verify each PR's current GitHub state and checks before any merge or closure.

## Consolidation rules

1. **Target only** `master/consolidated-feature-integration` during this pass. Do not update `main` as a side effect.
2. **Inventory before deletion:** compare all 40 branch refs, PR heads/bases, unique commits, file diffs, CI/checks, deployments, and documentation/recovery references.
3. **Port by semantic family:** tokens and base primitives first; compound controls next; consumers and component-library specimens after; docs/tests in the same change set.
4. **Do not copy old CSS snapshots over the current target.** The status-badge branch is a concrete example of a stale style that conflicts with the current target.
5. **Preserve consumer boundaries:** Video Manager manages published videos and must not gain upload/publish controls; Video Publisher handles unpublished projects/publishing; project/package persistence and saved metadata sets must retain their current contracts.
6. **One source of truth:** the component library renders actual production primitives; tokens and primitive code—not catalog-local CSS—own component appearance.
7. **Tests prove behavior:** do not weaken/remove governance tests to make a merge pass. Run focused tests and full repository checks on the exact candidate SHA.
8. **Evidence before claims:** record exact commit SHA, command, exit result, CI status, and browser/viewport evidence. A rate-limited Vercel deployment is not a passing or failing source build.
9. **Branch cleanup last:** delete only after the target contains all useful unique work, the PR is merged/closed appropriately, the branch is not a deployment/workflow/recovery reference, and the branch head is recorded in this ledger.
10. **Recovery history is not disposable.** Recovery branches and reference-only visual baselines must be reviewed for provenance value before archival/deletion.

## Work sequence

### A. Complete the branch/PR matrix
- [ ] Re-query all branches and record their current heads.
- [ ] For every branch, record merge base, ahead/behind counts, unique commit subjects, changed paths, open PRs, CI state, and disposition.
- [ ] Identify deployment/workflow references and any recovery-only evidence.
- [ ] Separate redundant code, unique code, docs-only deltas, experiments, and protected refs.

### B. Selective integration
- [ ] Review candidate-only commits in the action/legend, badge, input, component-library, and validation branches.
- [ ] Diff candidate files against current target to detect already-incorporated behavior.
- [ ] Create small, focused ports/PRs only for missing behavior or documentation.
- [ ] Resolve conflicts semantically; do not accept stale branch snapshots wholesale.

### C. Canonical primitive and component audits
- [ ] Inventory primitive exports, imports, JSX use sites, CSS selectors, catalog entries, and tests.
- [ ] Detect duplicate button/split-left/input/textarea/dropdown/tag/status-badge implementations.
- [ ] Confirm 44px standard component size, 3px stroke, 8px radius, 4px shadow, typography and palette contracts.
- [ ] Confirm component-library specimens render production primitives.
- [ ] Check the specific reported defects: inconsistent Studio vs Studio split-left text defaults, multiple style sources for Generate/Analyze, Load/Refresh and Post workspace actions, double shadows, control-row alignment, toolbox color order, and badge typography/stroke.

### D. Verification
- [ ] Establish exact baseline on current integration SHA.
- [ ] Run focused primitive/component governance tests.
- [ ] Run metadata, project/package persistence, Publisher/Manager boundary, calendar, and component-library tests.
- [ ] Run `npm run typecheck`, `npm run check:css`, `npm run lint`, `npm test`, and `npm run build` using the repository lockfile/dependencies where execution access is available.
- [ ] Record inherited failures separately from regressions.
- [ ] Inspect desktop/tablet/mobile screenshots and keyboard/focus/disabled/loading/error states when browser access is available.
- [ ] Update `docs/architecture/VIEWTUBE_CONSOLIDATED_MASTER_VALIDATION_CHECKLIST.md` with evidence; do not mark unchecked items complete without evidence.

### E. Cleanup
- [ ] Publish a final branch disposition table: keep, merge/port, archive, or delete.
- [ ] Confirm unique commit and artifact preservation for each proposed deletion.
- [ ] Close superseded PRs with links to their replacements; retain a clear PR audit trail.
- [ ] Delete only confirmed obsolete non-protected branches, recording deleted ref names and final SHAs.
- [ ] Re-run branch inventory and verify only intended refs were removed.

## Definition of done

- Every observed branch has a recorded disposition and provenance review.
- All useful unique UI, primitive, component-library, test, and documentation work is incorporated or explicitly preserved as reference.
- One canonical implementation owns each shared primitive family.
- Production consumers and the definitive component library use that source.
- Required audits, regression tests, typecheck, CSS checks, lint, build, and visual/interaction verification have evidence and disposition.
- Integration head and any deployment SHA are recorded.
- Obsolete branches are removed only after verification; `main`, the integration target, active deployment refs, and valuable recovery/reference branches are protected unless separately authorized.


## Branch compare sweep — 2026-10-13

The remaining branch refs were compared with `master/consolidated-feature-integration` at target SHA `b8da238794dddd87005e48f813d0b44476ddf8bd`. “Ahead” means commits not shared by ancestry; it does **not** prove the source changes are absent from target, because squash/cherry-pick merges can preserve content while changing commit ancestry. File-level comparison and PR/deployment review remain required for every diverged branch.

| Branch | Ahead | Behind | Changed-path signal from comparison | Initial review category |
|---|---:|---:|---|---|
| `audit/system-convergence-identity-certification` | 21 | 312 | Toolbox, metadata sections, project board, primitive test/CSS, upload frame, vite config, UI audit docs | High-priority donor review; PR #18 describes selective ports, so inspect current content before further porting |
| `docs/integrated-metadata-system-plan-2026-10-06` | 0 | 460 | None | Likely superseded ancestry; preserve/verify docs before cleanup |
| `docs/master-system-rebuild-resource-plan` | 0 | 5383 | None | Very stale docs/history branch; inspect provenance before archival |
| `docs/recovery-canonical-sync` | 1 | 5361 | Recovery document catalog | Recovery artifact review; do not delete until catalog/history is reconciled |
| `feat/canonical-action-and-legend-primitives` | 12 | 66 | Metadata sections, Project Manifestation, shared split/system CSS, Manager, Publisher | High-priority selective donor review |
| `feat/canonical-split-left-followup-clean` | 0 | 101 | None | Likely superseded; verify PR trail |
| `feat/canonical-viewtube-minimal-primitives` | 7 | 109 | Governance test, split primitive, Studio certification, split CSS, Video Director | Donor review; compare tests and selected-state behavior against current implementation |
| `feat/integrated-metadata-system-execution-2026-10-06` | 0 | 445 | None | Likely superseded; verify package persistence and PR trail |
| `feat/metadata-master-studio-hub` | 23 | 479 | Metadata Master service/tests, Studio Hub, Thumbnail Studio, Manager/Publisher, dashboard data, architecture docs | High-risk stale donor; preserve package and tool-boundary behavior, no wholesale merge |
| `feat/metadata-master-studio-hub-v2` | 17 | 477 | Same core metadata/tool paths and docs as v1 | Compare with v1 and target; choose the best verified implementation, do not merge both blindly |
| `feat/studio-canonical-input-primitives-20-21` | 1 | 11 | Component-library index documentation | Check docs-only delta after PR #37 |
| `feature/liquid-glass-lab` | 28 | 5028 | Isolated lab app, tests, docs, skill, and tasks plan | Experimental project; not part of production primitive consolidation unless explicitly adopted |
| `feature/recent-ui-consolidation-2026-10-11` | 0 | 216 | None | Likely superseded code; preserve/review reconciliation docs before cleanup |
| `feature/studio-hub-component-foundation-audit` | 6 | 391 | Audit docs, metadata layout/test | Donor/audit review; compare test and docs content before cleanup |
| `feature/studio-hub-frontend-layout-plan` | 1 | 391 | Frontend component layout plan | Documentation-only reconciliation candidate |
| `feature/video-publisher-write-create-workspaces` | 4 | 312 | Publisher, workspace tests, implementation plan, vite config | Donor review; compare against current Publisher and PR #22 before porting |
| `fix/component-library-canonical-replacements` | 0 | 92 | None | Likely superseded code; verify PR/history |
| `fix/project-dropdown-action-rows-split-alignment` | 0 | 134 | None | Likely superseded code; verify PR #27 and target content |
| `fix/resource-library-build-imports` | 0 | 478 | None | Likely superseded code; verify resource-library build fix remains present |
| `fix/studio-split-left-consistency` | 0 | 30 | None | Likely superseded; verify split-left typography/behavior before cleanup |
| `fix/toolbox-collapse-icon-chrome` | 2 | 391 | Shared toolbox CSS | Donor review; PR #19/#21 describe selective ports, so compare exact reduced-motion/transform rules |
| `fix/ui-color-order-toolbox-alignment-2026-10-11` | 0 | 221 | None | Likely superseded; PR #21 says its work is already an ancestor of target |
| `integration/production-button-library-merge` | 0 | 147 | None | Likely superseded; compare with definitive library PRs #32–#34 |
| `integration/publisher-metadata-package-persistence` | 5 | 391 | Publisher package options and project persistence services/tests | High-priority behavior donor; verify round-trip/saved-set tests and exact target contents |
| `integration/publisher-write-create-selective-port-2026-10-11` | 0 | 190 | None | Likely superseded; compare current Publisher workspace implementation |
| `integration/resource-library-15-creator-guides-2026-10-13` | 16 | 29 | Resource registry, guide markdown, registry test and handoff docs | Content-level comparison required; PR #36 describes this contribution as merged, but ancestry diverged |
| `integration/toolbox-collapse-selective-port-2026-10-11` | 0 | 204 | None | Likely superseded; verify PR #21 |
| `integration/viewtubebuild-2026-10-05` | 0 | 619 | None | Stale donor; inspect provenance/deployment references before cleanup |
| `master/analytics-status-badge-primitive-2026-10-12` | 4 | 160 | Calendar, migration catalog, status badge primitive/CSS | Donor review only; target currently has different dense badge geometry, so compare behavior and token contracts rather than copying CSS |
| `master/calendar-toolbox-status-badges-2026-10-11` | 0 | 162 | None | Likely superseded; verify calendar/status-badge implementation and PR trail |
| `plan/studio-toolbox-primitives-consolidation` | 0 | 128 | None | Plan likely merged; verify docs are present on target and retain as historical source |
| `recovery/conversation-2026-10-04-ui-render` | 8 | 5311 | Recovery state, index, catalog, deployment/toolbox source, handoff | Protected recovery source until all records are reconciled and registered |
| `recovery/pre-document-system-migration-2026-10-04` | 0 | 5249 | None | Protected historical recovery snapshot; archive rather than delete until provenance check |
| `recovery/round-2-ui-render-reconciliation-2026-10-04` | 0 | 5259 | None | Protected historical recovery snapshot; archive rather than delete until provenance check |
| `recovery/2026-10-04-account-youtube-round1` | 0 | 5316 | None | Protected historical recovery snapshot; archive rather than delete until provenance check |
| `test/consolidated-master-validation` | 1 | 300 | Validation checklist | Compare checklist revision and retain the most complete validated record |
| `test/consolidated-master-validation-v2` | 1 | 298 | Validation checklist | Compare with prior validation branch and current target; do not merge stale checklist wholesale |
| `ui/component-library-production-buttons` | 8 | 391 | Production button catalog, Toolbox/library, primitive CSS, mobile regression test | Compare against current definitive library and PR #33; port only missing catalog/test coverage |
| `visual-test/canonical-default-system-65-66` | Not yet individually compared | Not yet individually compared | Frozen visual baseline/reference | Protect as a reference baseline; not a production source branch |

### Compare interpretation

- The compare sweep covers the observed branch list except the integration target itself; `main` was compared separately (19 ahead / 391 behind).
- The `visual-test/canonical-default-system-65-66` ref still needs an individual compare and provenance review. Its reference-only role means it is protected even if it has no unique commits.
- No branches were deleted, and no donor branch was merged wholesale during this pass.
- The next actionable review is content-level comparison of the highest-risk donor groups: metadata package persistence, Publisher Write/Create, action/legend primitives, component-library/catalog, split-left defaults, toolbox collapse motion, status badges, and the system-convergence audit. For each, check whether the target already contains the intended behavior, tests, and docs before proposing a port.


## Content-level spot checks — 2026-10-13

These spot checks were performed after the ancestry sweep to distinguish commit ancestry from actual file state.

### Confirmed already-present / newer target content

- **Resource library:** `src/features/resource-library/resourceLibraryRegistry.ts` has the same blob SHA on the integration target, the dedicated 15-guide branch, and `main` (`805011e8d81329937c340bc55068f9116e693254`). The guide `comments-community-and-audience-feedback-playbook.md` is also identical between target and main (`7b5cf0c73cbd79f54499e3693158d932a4f43569`). This is strong evidence that the resource-library registry/guide work is already represented; do not re-merge the donor branch wholesale. The other resource documentation differences between target and main still need per-file review.
- **Publisher package persistence:** target versions of `publisherMetadataProjectPersistence.ts` and `publisherMetadataPackageOptions.ts` differ from the dedicated donor branch and include later handling for intentionally blank metadata assets and nullable audience values. The donor must not overwrite the newer target implementation. Compare associated tests before proposing any port.
- **Canonical metadata/actions:** `CanonicalMetadataSections.tsx` and `ProjectManifestation.tsx` differ materially between target and `feat/canonical-action-and-legend-primitives`. The target has newer metadata props and selected-project resolution behavior; the old donor must not replace target files wholesale.
- **Target vs main CSS:** `src/styles/subtoolbox-system.css` differs substantially. The target declares a 44px standard component control and canonical 1000-weight / -0.035em / 0.86-line-height button defaults; `main` retains 48px standard controls and older 14px/800-weight button/input defaults in the inspected rules. The target also contains canonical split/dropdown and definitive-catalog rules not present at the same locations in main. Do not merge `main` CSS wholesale into the integration target; only review isolated additions against current target tokens and tests.
- **Status badge donor:** the donor branch uses a 14px dense badge with a 1px border, while the target's outlined dense badge uses an 18px height and 2px border. Preserve target styling unless a newer approved design contract explicitly supersedes it.
- **System-convergence audit docs:** the full UI audit and shared-upload/palette audit already exist on the target, but the donor audit has supplemental sections documenting the right-side overlay-label fix and upload/header/palette work. These sections should be reconciled into the target's durable audit docs with their original unverified/verified status preserved, not copied as claims of current runtime certification.

### Immediate donor decisions

- Resource library branch: registry and sampled guide already represented; finish review of README/handoff and all changed guide bodies, then mark the branch content as represented if they match.
- Publisher persistence branch: retain target code; run focused round-trip/saved-set tests before declaring the behavior verified.
- Action/legend branch: retain target code; use donor only as historical source for requirements/tests.
- `main`: selectively review useful documentation and isolated behavior; no wholesale merge due to branch divergence and incompatible CSS defaults.
- Status-badge donor: do not port its stale dimensions over target.
