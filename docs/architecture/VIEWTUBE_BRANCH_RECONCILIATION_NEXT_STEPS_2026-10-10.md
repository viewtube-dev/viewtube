# ViewTube Branch Reconciliation — 2026-10-10

**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `feature/studio-hub-component-foundation-audit`  
**Purpose:** Record the live branch comparison and CI evidence before integrating Studio Hub, Publisher/Manager, and Metadata Master changes.

## Decision

Do not merge the 79-commit `audit/system-convergence-identity-certification` branch wholesale, and do not merge PR #13 until its failed checks are understood. Preserve its work as a source branch for selective, evidence-based integration.

## Live comparison: main → system-convergence branch

GitHub compare reports the audit branch is **79 commits ahead and 0 behind main**. The compare currently lists these branch-only files/changes:

- System and tool ownership/terminology audit; system-convergence certification audit.
- Integrated content lifecycle, analytics, and Studio Hub master plan additions.
- Publisher/Manager channel-connected controls plan.
- Publisher metadata project/package persistence plan.
- Recovery notes for the Publisher metadata render work.
- `PublisherMetadataPackageOptions.tsx`.
- `publisherMetadataProjectPersistence.ts` and its tests.
- `publisherMetadataPackageOptions.ts` and its tests.
- Changes to `CanonicalMetadataSections.tsx`, `VideoPublisher.tsx`, `VideoManager.tsx`, `simpleYouTubeApi.ts`, `server/simple-youtube.mjs`, and `vite.config.ts`.

This is not just a documentation branch. It contains implementation that must be reviewed before being declared superseded.

## Disposition by workstream

### A. Metadata Master branches

The existing consolidation record on the audit branch says the core Metadata Master implementation and planning are already on `main`. The two older integrated-metadata branches compare as strictly behind main with no unique changes. Do not merge these branches wholesale. Preserve the documented ownership boundary: Metadata Master optimizes publication packages; Video Publisher prepares and executes publication; Video Manager changes live published-video metadata.

### B. Publisher package persistence and saved metadata options

**Disposition: candidate for selective integration, not yet approved.**

The audit branch adds service and UI code to save a current metadata package or alternative package into the canonical ContentBuild/Video Package model, list/compare saved options, and select an option without creating a duplicate Project or ContentBuild. Focused tests cover current-vs-option selection and repeat selection.

Before porting these files to a clean branch based on current main, verify:
1. All imports and domain types resolve against current main.
2. Video Package and ContentBuild selection updates remain canonical and do not introduce a parallel store.
3. Selected options update the intended package metadata while unselected alternatives remain non-current.
4. Thumbnail/video assets are referenced by canonical IDs, not duplicated as a second asset repository.
5. The component is mounted only in the Publisher workflow and the user can clearly save current metadata versus save an alternative.
6. Focused tests, typecheck, full tests, and production build pass on the integration branch.

### C. Publisher/Manager channel-connected controls

**Disposition: inspect and integrate as a separate, narrow change.**

The branch changes both tools and shared metadata sections. Preserve the role boundary: Publisher owns unpublished projects and explicit publishing; Manager owns published videos only. Confirm playlist options come from the connected channel and that upload/publish actions do not appear in Manager. Confirm shared canonical metadata ordering and existing Project Manifestation remain intact.

### D. Canonical metadata visual order / PR #13

**Disposition: keep open, but do not merge yet.**

The intended order remains: video upload; title; thumbnail; optional visibility/audience/timestamps; description; optional location; playlists; optional community/AI use; tags; category. The hardcoded certification baseline must remain frozen; production variants belong in the canonical primitive-backed implementation/reference track.

### E. Older Metadata Master/Studio Hub branch-only UI revisions

**Disposition: reject wholesale restoration.**

The existing consolidation record identifies older Video Manager/Publisher variants that remove Project Manifestation, replace canonical metadata sections with duplicate local controls, or reintroduce duplicate publication controls. Do not cherry-pick those UI rewrites merely because they exist on the old branches.

## PR #13 CI result — run 38077623977

Passed:
- production build
- focused contract tests
- account tests
- local smoke checks
- source-governance checks

Failed:
- static-quality at `npm run typecheck`
- full suite at `npm test`

The typecheck output includes failures in `projectManifestation.ts` (optional `videoPackage.creative/production`), `StudioHubPrimitiveMigrationCatalog.tsx` (unsupported `notes` prop), `SubToolboxMediaPrimitives.tsx` (conflicting `onVolumeChange` type), editor design-library templates, a Brain test fixture, `CreatorVaultOS.tsx`, and `VideoManager.tsx` (around the async expression at line 449 and nullable thumbnail callback). The full suite also reports an initialization error in `assistantIntelligenceSystem.ts` and a widget source-contract assertion. These are broader than the three files in PR #13; fix or baseline them in scoped follow-up work rather than claiming the PR is green.

## Ordered next steps

1. **Keep PR #13 unmerged.** Treat the failed checks as release blockers and preserve the intended metadata-order change.
2. **Create a clean integration branch from current main** for Publisher package persistence only. Port the two services, tests, and package-options component with minimal necessary wiring; do not port the full 79-commit branch.
3. Run focused tests and typecheck on that isolated change. If unrelated repository typecheck errors block validation, record the baseline separately and ensure no new errors are introduced.
4. Review channel-connected controls and Publisher/Manager ownership as a separate change, then run the relevant tests/build.
5. Resolve the specific PR #13 typecheck/test blockers in small commits, distinguishing pre-existing failures from regressions.
6. Only after the branch set is classified and relevant checks pass, decide whether to merge the visual-order PR and then the selective package-persistence PR.

## Safety rules

- Never merge the entire 79-commit audit branch just to capture its useful work.
- Never recreate Metadata Master features already present on main.
- Never restore old Manager/Publisher UI paths that duplicate canonical metadata controls.
- Never modify the frozen hardcoded primitive certification baseline as a shortcut.
- Never claim tests or browser rendering passed unless the corresponding run proves it.
