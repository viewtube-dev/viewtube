# AI Brain Studio Controls Migration — Status

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Working branch:** `feat/brain-status-evidence-studio-followup-2026-10-23`  
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
   `npx vitest run src/views/AIBrainStudioChrome.contract.test.ts src/components/brain/BrainContextRail.contract.test.ts src/components/brain/BrainTurnEvidenceRibbon.test.tsx`
2. Run `npm run typecheck` and `npm run build`.
3. Run relevant Brain and Studio control regression suites; distinguish pre-existing repository failures from regressions on this branch.
4. Capture and inspect the Brain page at ~390px mobile width and desktop width; verify badge labels, the three context actions, evidence disclosure, keyboard focus, and console output.
5. Reconcile this branch with the latest target base before review. Do not treat source assertions as browser certification.

No pull request has been opened for this working branch because previous Brain-shell PRs were automatically merged before their verification status was resolved.


## Disclosure summary follow-up — rebased on latest target

- Fresh branch: `feat/brain-studio-disclosure-summary-rebased-2026-10-23`.
- Base commit observed at branch creation: `6c2a0a18a7718f31c513ee7a38fac413eb1fa3b7` on `master/consolidated-feature-integration`.
- Adds exported `StudioDisclosureSummary`, shared stylesheet, contract tests, and standard/compact specimens in the Confirmed Primitive Library.
- Migrates the two Brain context/readiness disclosures and the two evidence-ribbon disclosures to the shared primitive while preserving native `details/summary` semantics.
- This branch was created fresh because the earlier follow-up branch had drifted 42 commits behind the moving target.
- **Verification not yet executed:** Vitest, typecheck, production build, browser interaction, keyboard-only disclosure operation, and mobile viewport checks. Do not merge before these gates are completed.

- Extended the shared primitive with a `structured` appearance for data-rich answer-module headers, preserving the module's grid content and per-module accent while centralizing native disclosure semantics and focus styling.
- Migrated `BrainAnswerModules.tsx` as well; the audited Brain chat/evidence/runtime/disclosure consumers in this change set now contain no raw `<summary>` elements.
- Latest target comparison shows the target branch advanced after this branch was created; the changed-file audit found no independent target edits in the touched consumer files. Recheck branch ancestry and mergeability before opening a PR.

- At the latest comparison, this branch is **30 commits ahead and 6 behind** the target. The target advanced after the branch was created; the changed-file audit found the target copies of the touched consumer files still match the original pre-change source, but ancestry/mergeability must be rechecked before PR creation.
- No GitHub Actions workflow runs are associated with the latest branch commits. Automated tests and build have not run, and no PR is open for this follow-up.
