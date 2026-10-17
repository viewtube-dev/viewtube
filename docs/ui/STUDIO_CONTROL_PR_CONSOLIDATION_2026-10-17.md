# Studio Control PR Consolidation — 2026-10-17

## Scope and provenance

This branch is based on `master/consolidated-feature-integration` at `35b51fbc7f8bd9be1fb0b9624f006749211bef56`. It ports the current-base-applicable portions of PR #424 (Studio-wide shadow and pointer-motion removal) into the current integration head rather than merging its stale branch wholesale.

Source PR inventory:
- #365 — canonical stepper implementation and regression/source audits.
- #377 — Studio test runner wiring and stale contract repair; current package script already contains the confirmed-library and React-hooks runner corrections.
- #386 — canonical source-owner test repairs and unrelated analytics/Brain plan updates; only changes still needed by current-base contracts should be ported.
- #390 — split-left badge/stepper foundation composition; reconcile against current `StudioControls.tsx` and CSS before porting any delta.
- #396 — hold-repeat callback lint fix; verify current implementation and static-quality result.
- #401 — post-publication lineage test and canonical icon-default assertions; retain lineage work only if not already in target, without importing stale branch snapshots.
- #424 — global Studio shadow token, shadow silhouette, and hover/press movement removal with button-owned opt-in shadow API.

## Canonical decisions

- Studio controls remain stationary through hover and press; no generic pointer-driven translate/transform, filter, or shadow transitions.
- Shadows are not global defaults. If a shadow effect is retained, it must be explicit, button-owned, and off by default. Fields use real borders and visible focus treatment.
- Keep standard 44px and compact 28px control families and their current canonical token geometry; do not import stale files wholesale from source branches.
- Canonical Studio controls and the confirmed primitive library must describe actual production behavior and defaults.
- Keep the stepper's native numeric editing, accessible action names, min/max bounds, and hold-repeat stop behavior.
- Do not close source PRs until the replacement PR contains all useful non-duplicate work, exact-head CI and focused regression checks have run, and the source-PR disposition table is complete.

## Verification required before merge/closure

1. Run `npm run typecheck`, `npm run build`, `npm run check:css`, `npm run test:studio-controls`, `npm run test:confirmed-library-layout`, `npm run test:studio-field-style-ownership`, `npm run test:studio-button-default-effects`, and focused stepper tests on this exact head.
2. Inspect the full diff for stale-hunk omissions and ensure all remaining shadow declarations are limited to explicitly opted-in buttons or approved independent floating panels.
3. Verify keyboard/focus states, reduced motion, selected-state color pairing, 44px/28px geometry, numeric editing, hold-repeat, and component-library parity.
4. Reconcile #365/#390/#396 stepper changes and #377/#386 test fixes against current-base source before calling them included. Inspect #401's lineage test separately from UI changes.
5. Only after the replacement PR is verified and all seven source PRs have an explicit disposition, close #365, #377, #386, #390, #396, #401, and #424 with a link to the replacement. Do not delete source branches unless proven identical to the target branch.

## Partial-port warning

The source branches are divergent and behind the integration target. This document and branch are not a certification that all seven PRs have been fully consolidated. Failed patch hunks must be reviewed manually, and the remaining PR-specific deltas and exact-head checks are closure blockers.
