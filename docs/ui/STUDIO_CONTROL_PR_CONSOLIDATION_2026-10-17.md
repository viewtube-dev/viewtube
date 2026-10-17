# Studio Control PR Consolidation — 2026-10-17

## Current-base reconstruction

Replacement branch: `consolidate/studio-controls-prs-365-377-386-390-396-401-424-current-base-2026-10-17`  
Base: `master/consolidated-feature-integration` at the current integration head when this branch was created.  
Source consolidation draft: https://github.com/viewtube-dev/viewtube/pull/442 (stale-base draft; this current-base branch supersedes it).

## Source PR inventory and disposition

- **#365 — stepper foundation/source contracts.** Canonical `StudioControls.tsx` and `studio-control-system.css` remain the owners. Keep native numeric editing, 44px/28px variants, bounds normalization, keyboard activation, and hold-repeat bounds. Source-owner and divider audit assertions are updated.
- **#377 — release-gate runner and contract repairs.** Current integration already has the Vitest runner wiring and current-base contract updates. The replacement keeps tests on the canonical source; unrelated Brain/metadata assertions must remain as found on the current target.
- **#386 — current source-owner test repairs plus unrelated analytics/Brain work.** Canonical Studio source-owner and confirmed-library assertions are included. Its analytics consumer migrations and Brain plan documents are outside this Studio-control scope and are not silently imported; they remain visible on source PR #386 for separate disposition.
- **#390 — shared split-left foundation.** Reuse `StudioSplitLeftContent` for `StudioSplitLeftButton`, `StudioSplitLeftBadge`, and the stepper action cells; compose editable stepper fields from `StudioUsernameInput`; preserve accessible labels, keyboard behavior, pointer hold-repeat, and existing grid slots.
- **#396 — hold-repeat static-quality fix.** Use `scheduleRepeatRef.current()` for recursive scheduling and assert that behavior in the divider source contract.
- **#401 — publication lineage and icon defaults.** The publication checkpoint lineage assertions are already present on the current integration baseline. The Studio catalog retains the 38px/1.9 standard and 24px/2.0 compact large icon preset as the default.
- **#424 — remove global Studio shadow and pointer movement.** Remove global shadow/motion tokens and generic hover/press transforms, filters, shadows, and transitions. Any retained shadow is a button-owned opt-in, off by default; controls remain stationary. Floating-label and explicitly scoped icon feedback remain separate component effects.

## Canonical decisions

- Standard control geometry is 44px with 3px stroke and 6px radius; compact is 28px with 2px stroke and 4px radius.
- Component-library specimens and explanatory text must match production defaults and variants.
- No generic hover/press movement, filter, shadow, or transition. Focus remains visible through outlines; do not use a shadow as a field border or focus indicator.
- Split-left button and badge composition shares one source of rail/label structure. Stepper actions use that same primitive foundation instead of parallel button markup.
- Do not weaken tests to suppress regressions. Treat infrastructure failures separately from code failures.

## Verification and closure gates

1. Wait for exact-head GitHub release-gates workflow; review each job and its logs.
2. Run typecheck, production build, CSS parse, Studio control tests, stepper tests, confirmed-library layout, source-governance checks, and focused interaction tests on the final head.
3. Review the final CSS for residual global shadow declarations and pointer-driven transitions. Verify explicit shadow opt-in is off by default and stable across standard/compact controls.
4. Verify 44px/28px geometry, numeric editing, bounds, pointer repeat, keyboard activation, focus visibility, reduced motion, catalog parity, and the rendered Studio controls.
5. Inspect #377/#386/#401 changes against current integration; the #386 analytics/Brain changes are intentionally outside this UI replacement and must be explicitly dispositioned before closing that source PR.
6. Close source PRs only after the replacement is verified and every source PR has an explicit included/already-integrated/out-of-scope disposition. Do not delete source branches unless proven identical to the target.

## Current status

This PR is a consolidation candidate, **not release-certified**. Vercel checks have reported build-rate limits; they do not certify the application. The source PRs remain open pending exact-head verification and final disposition.