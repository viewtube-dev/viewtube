# ViewTube Consolidated Master Branch

**Branch:** `master/consolidated-feature-integration`  
**Base:** `audit/system-convergence-identity-certification` (which was 79 commits ahead of current `main` at branch creation)  
**Purpose:** A separate integration/testing line for selecting the best branch work, validating interactions, and revising features without changing `main`.  
**Status:** Active integration branch; not certified for production or deployment.

## Operating rule

All branch consolidation, integration fixes, test runs, and revisions happen here first. `main` remains unchanged by this work. Do not merge this branch to `main` until the user explicitly chooses to do so after testing.

## Why this base was chosen

The system-convergence branch was the most substantial branch based directly on current main: 79 commits ahead, 0 behind, with actual system ownership audits, lifecycle plans, Publisher/Manager controls, metadata package persistence, saved metadata sets, and code changes. It is a useful integration base, not an assertion that every change in those 79 commits is correct. Its implementation must still be tested.

## Consolidated on this branch so far

### System and lifecycle foundation
- Whole-system ownership, user terminology, and interaction audit.
- Integrated content lifecycle, analytics, and Studio Hub master plan.
- Studio Hub / Metadata branch consolidation record.
- Publisher/Manager channel-connected controls plan.
- Publisher metadata project/package persistence plan and recovery notes.
- Publisher metadata save/current-vs-option persistence services and tests.
- Saved metadata set list, compare, select, and persistence UI component.
- Existing Metadata Master core is retained from current main; older Metadata Master branches are not merged wholesale.

### Publisher and Manager
- Publisher/Manager and shared canonical metadata section changes from the system-convergence line.
- Canonical metadata order test and visual layout adjustment from the component-foundation line.
- Publisher Write/Create workspace implementation plan and workspace contract test.
- Keep the role boundary: Publisher handles unpublished projects and explicit publication; Manager handles already-published videos and live metadata changes. No upload/publish controls in Manager.

### Component foundation and design system
- Studio Hub front-end component layout plan for existing tools and intelligence capabilities.
- Component-foundation source audit documenting canonical Toolbox/SubToolbox primitives, UI Reference Library, token system, labeled field primitives, and frozen certification baseline.
- Canonical metadata visual-order test.
- Right-label variants added to the canonical Input and TextArea primitives while preserving the existing overlay label behavior and the distinct structural L0/L1/L2 sizes.
- Primitive-system stabilization plan from the visual-test branch.

## Branch inventory and disposition

| Source branch | Disposition on master |
|---|---|
| `audit/system-convergence-identity-certification` | Chosen base; its 79-commit implementation and documentation are present for testing. |
| `feature/video-publisher-write-create-workspaces` | Added its unique Publisher Write/Create plan and workspace contract test. Shared implementation overlaps the chosen base. |
| `feature/studio-hub-frontend-layout-plan` | Added the detailed front-end layout implementation plan. |
| `feature/studio-hub-component-foundation-audit` | Added source audit and reconciliation docs; applied canonical metadata order change and test; added right-label primitive variants. |
| `feat/metadata-master-studio-hub` | Do not merge wholesale: divergent/old base. Use as a reference for Metadata Master features only where they are absent from main/master. Core Metadata Master already exists on main. |
| `feat/metadata-master-studio-hub-v2` | Do not merge wholesale: substantially overlaps the first Metadata Master branch and is based on an older mainline. |
| `docs/integrated-metadata-system-plan-2026-10-06` | Strictly behind current main with no unique changes in comparison; not merged. |
| `feat/integrated-metadata-system-execution-2026-10-06` | Strictly behind current main with no unique changes in comparison; not merged. |
| `visual-test/canonical-default-system-65-66` | Used as a source for the primitive-stabilization plan and right-label variant ideas. Do not copy its old full CSS wholesale: its system CSS is much smaller/older than the current file and would erase newer production rules. Further component-size, multi-select button-group, extended primitive, and migration-catalog changes require selective porting and tests. |
| `feature/liquid-glass-lab` | Keep isolated as an experimental standalone app until its own build/tests and intended integration boundary are verified; do not introduce its rendering dependencies into the main ViewTube runtime by accident. |
| `fix/resource-library-build-imports` | Behind main; no unique diff against current main. |
| `integration/viewtubebuild-2026-10-05` | Behind main; no unique diff against current main. |
| Older recovery branches | Only recover unique conversation/history evidence where missing from canonical recovery docs; do not restore old snapshots over current code/docs. |
| `docs/master-system-rebuild-resource-plan` | Historical branch based on a much older tree; use its unique planning/resources only after checking against current canonical docs. |

## Explicit non-goals / protected boundaries

- Do not modify `main`.
- Do not merge this branch into `main` automatically.
- Do not merge all divergent branches blindly.
- Do not duplicate Metadata Master, Video Package, ContentBuild, Asset Engine, project persistence, or asset storage.
- Do not remove working tool routes or workflows merely to reduce the number of top-level tools.
- Do not change the frozen `StudioHubCompletePrimitiveCatalog.tsx` hardcoded certification baseline as a shortcut.
- Do not treat a plan, branch commit, or green partial check as proof of production readiness.
- Do not replace current large canonical CSS with the older compact CSS from the visual-test branch.

## Validation blockers

The existing PR #13 CI run passed production build, focused contract tests, local smoke, account tests, and source-governance checks, but failed static type-checking and the full test suite. Failures included project-manifest optional fields, primitive migration catalog props, media primitive callback types, editor template typing, Brain fixtures, CreatorVaultOS, VideoManager, an assistant-intelligence initialization error, and a widget source-contract assertion.

The selective persistence work now on master must also be validated on this branch. No claim is made that CI, a browser render, or deployment has passed for this consolidated branch yet.

## Next integration sequence

1. Run branch CI and establish a fresh failure baseline on this exact master head.
2. Fix integration-caused type/test errors first; separately classify pre-existing mainline failures.
3. Finish wiring Saved Metadata Sets into the current Video Publisher UI and prove that selecting an option updates the existing canonical ContentBuild/Video Package without creating duplicate projects/assets.
4. Review channel-connected playlist and publish controls; verify Manager remains published-video-only.
5. Selectively port the useful component-size (44px M size), multiple-selection button group, and extended primitive families from the visual-test branch without overwriting newer tokens, CSS, or unrelated code.
6. Compare both Metadata Master variants against the retained main implementation and port only missing, tested behavior.
7. Reconcile any unique recovery/resource-library/workspace branch content against current canonical docs before bringing it in.
8. Test the combined Studio Hub routes and end-to-end project → package → publish → live metadata change → analytics feedback flow.
9. Keep all fixes and revisions on this branch until the user approves a later merge to main.

## Supporting records

- `docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_IDENTITY_CERTIFICATION_AUDIT_2026-10-08.md`
- `docs/architecture/VIEWTUBE_WHOLE_SYSTEM_OWNERSHIP_INTERACTION_AND_USER_TERMINOLOGY_AUDIT_2026-10-08.md`
- `docs/architecture/VIEWTUBE_STUDIO_HUB_METADATA_BRANCH_CONSOLIDATION_2026-10-08.md`
- `docs/architecture/VIEWTUBE_BRANCH_RECONCILIATION_NEXT_STEPS_2026-10-10.md`
- `docs/plans/VIEWTUBE_STUDIO_HUB_FRONTEND_COMPONENT_LAYOUT_IMPLEMENTATION_PLAN_2026-10-10.md`
- `docs/plans/VIEWTUBE_VIDEO_PUBLISHER_WRITE_CREATE_IMPLEMENTATION_PLAN_2026-10-09.md`
- `docs/ui/STUDIO_HUB_COMPONENT_FOUNDATION_PHASE_1_SOURCE_AUDIT_2026-10-10.md`
- `docs/superpowers/plans/2026-10-08-viewtube-primitive-system-stabilization.md`
