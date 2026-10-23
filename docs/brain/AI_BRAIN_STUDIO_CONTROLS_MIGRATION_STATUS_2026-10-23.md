# AI Brain Studio Controls Migration — Status

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Merged status branch:** `feat/brain-status-evidence-studio-followup-2026-10-23`  
**Disclosure follow-up branch:** `feat/brain-studio-disclosure-summary-followup-2026-10-23`  
**Status:** PR #840 merged automatically before verification; disclosure-trigger follow-up is being prepared separately. Automated tests and visual certification remain pending.

## Already merged

PRs [#836](https://github.com/viewtube-dev/viewtube/pull/836) and [#838](https://github.com/viewtube-dev/viewtube/pull/838) moved the composer send action, prompt search/filtering, prompt/capability controls, workspace navigation, and remaining chat actions onto Studio Controls. Those merges are not proof of full-plan completion or visual certification.

## Implemented on the working branch

- Replaced active channel/project/ContentBuild/selection chips with Studio split badges. The ContentBuild chip shows a short visible ID while retaining the full value in its accessible label and title.
- Changed the context strip actions to compact Studio split buttons with short visible labels and explicit accessible names.
- Replaced the one-off generation badge and data-readiness chip with the existing Brain status badge primitive.
- Replaced the learning-receipt status chip with a micro Studio split badge.
- Replaced evidence snapshot, prepared/cited counts, unresolved-citation/gap chips, quality-condition chips, and record freshness/readiness chips with Studio split badges. Removed inline background-color overrides from these chips.
- Migrated the context rail's two raw buttons, topic chips, and profile-status markers to Studio controls. Panel headers now use the primary pair token rather than different local accent colors.
- Added contract coverage for the migrated context/status/evidence surfaces.

Brain runtime, evidence resolution and integrity logic, receipts, learning promotion, prompt registries, and persistence were not changed.

## Static source audit

The current branch source audit confirms:
- `AIBrainCommandInterface.tsx` has no raw `<button>`, `<input>`, or `<select>` elements.
- `BrainContextRail.tsx` has no raw `<button>`, `<input>`, or `<select>` elements.
- The migrated evidence chips no longer use inline background-color styles or the replaced local status-chip classes.

This is a source audit only, not an executed test suite.

## Required before review/merge

1. Run focused tests:
   `npx vitest run src/views/AIBrainStudioChrome.contract.test.ts src/components/brain/BrainContextRail.contract.test.ts src/components/brain/BrainTurnEvidenceRibbon.test.tsx`
2. Run `npm run typecheck` and `npm run build`.
3. Run relevant Brain and Studio control regression suites; distinguish pre-existing repository failures from regressions on this branch.
4. Capture and inspect the Brain page at ~390px mobile width and desktop width; verify badge labels, the three context actions, evidence disclosure, keyboard focus, and console output.
5. Reconcile this branch with the latest target base before review. Do not treat source assertions as browser certification.

PR [#840](https://github.com/viewtube-dev/viewtube/pull/840) was created as a draft but was merged automatically before verification completed. The disclosure-trigger follow-up is on a fresh branch based on the latest target tip to avoid carrying forward branch divergence. Do not merge follow-up work until tests, typecheck/build, and browser verification complete.


## Disclosure trigger follow-up (fresh branch)

- Added the reusable `StudioDisclosureSummary` primitive with native `<summary>` semantics and a shared Studio stylesheet.
- Replaced local hover/focus skins in the Brain context-used and data-readiness disclosures and in evidence selection-constraint and prompt-record disclosures.
- Added source contract tests for the primitive and its Brain consumers.
- Fresh branch is based on the latest observed target tip `d5bad6583687b44592288cf182f9f84bf406db1d`; this is a targeted follow-up, not a rebase of the older merged branch.
- Test runner, typecheck, build, browser, keyboard, mobile viewport, and screenshot checks have **not** been executed in this environment.