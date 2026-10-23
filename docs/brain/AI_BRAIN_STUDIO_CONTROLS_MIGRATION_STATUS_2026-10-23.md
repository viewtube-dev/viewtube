# AI Brain Studio Controls Migration — Status

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Follow-up branch:** `feat/brain-disclosure-triggers-followup-2026-10-23-r2`  
**Status:** Implemented source changes; automated tests and visual certification pending.

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
   `npx vitest run src/views/AIBrainStudioChrome.contract.test.ts src/components/brain/BrainContextRail.contract.test.ts src/components/brain/BrainTurnEvidenceRibbon.test.tsx src/components/brain/BrainDisclosureStudio.contract.test.ts`
2. Run `npm run typecheck` and `npm run build`.
3. Run relevant Brain and Studio control regression suites; distinguish pre-existing repository failures from regressions on this branch.
4. Capture and inspect the Brain page at ~390px mobile width and desktop width; verify badge labels, the three context actions, evidence disclosure, keyboard focus, and console output.
5. Reconcile this branch with the latest target base before review. Do not treat source assertions as browser certification.

PR [#840](https://github.com/viewtube-dev/viewtube/pull/840) for the status/evidence changes was merged automatically before tests or browser verification ran, despite being created as a draft with an explicit no-merge warning. This follow-up disclosure work is intentionally still unsubmitted pending test/build/browser verification; do not infer that the merged PR is fully certified.


## Follow-up: native disclosure triggers

- Added shared Studio-owned disclosure-trigger styling in `src/styles/studio-control-split.css`, already imported by the Studio control entrypoint.
- Migrated the context-used drawer and data-readiness disclosure in `AIBrainCommandInterface.tsx`, plus selection-constraints and prompt-evidence disclosures in `BrainTurnEvidenceRibbon.tsx`.
- Triggers remain native `<summary>` elements inside `<details>`; no nested interactive buttons were introduced. The trigger uses the active primary/secondary pair, compact label typography, token-backed outline geometry, and no motion/shadow.
- Added contract coverage for page and evidence-ribbon disclosure markup.
- Source-level implementation only. Tests, typecheck/build, keyboard/browser checks, mobile viewport checks, and screenshots must still be executed before the PR is ready.


### Extended disclosure audit

- Also migrated all disclosure triggers in `BrainEvidenceDrawer.tsx` and `BrainRuntimePanel.tsx` to the same shared Studio summary skin, including compact inline and standard-width forms.
- Added `BrainDisclosureStudio.contract.test.ts` to check native disclosure semantics, complete summary coverage, the existing stylesheet import, paired colors, and no motion transitions.

- Extended the same contract to structured `BrainAnswerModules` disclosures: compact 28px Studio geometry, primary/secondary pair rails, and clipped (not ellipsized) module titles replace the one-off colored summary header. Prose-only module accent markers remain unchanged.
