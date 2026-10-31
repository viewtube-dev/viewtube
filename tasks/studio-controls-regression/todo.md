# Studio Controls Regression Recovery — Checklist

## Phase 1 — Split Left input
- [ ] Add failing regression coverage for pointer/touch editability of left/right/double split inputs.
- [x] Correct split-label pointer-event ownership so the native input receives interaction.
- [x] Restore persistent primary inset stroke while preserving the shared focus behavior.
- [ ] Verify keyboard, selection, cursor, controlled and uncontrolled editing.

## Phase 2 — Auto-width defaults and imports
- [x] Inspect core primitive modules and identify missing direct global-style ownership imports.
- [x] Add canonical control-entry imports to the audited standalone primitive modules and show global full-row auto-width defaults in every primitive settings panel.
- [ ] Remove component-local width overrides from counters, sliders and toggles.
- [ ] Preserve only horizontal and vertical word-toggle content-width exceptions.
- [ ] Add tests for defaults, imports and exceptions.

## Phase 3 — Representative library
- [x] Reconcile the existing confirmed representative inventory against the catalog's explicit coverage tests and production exports.
- [ ] Compare exports against representative identifiers.
- [ ] Add missing production primitive representatives.
- [x] Preserve the existing family grouping pass and organized representative family sections.
- [x] Preserve the single-column, full-row direct representative ledger.
- [ ] Add provenance and unique identifiers.

## Phase 4 — Verification
- [ ] Focused regression tests pass.
- [ ] Studio controls test suite passes.
- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] Catalog coverage audit passes.
- [ ] Mobile and desktop interaction/visual checks pass.
- [ ] Diff reviewed for regressions, duplication and wrong file locations.
- [ ] PR created or updated with evidence.


## Execution note

The code and regression assertions above are committed to the recovery branch. Runtime tests, typecheck, production build, and browser interaction checks remain **pending** because this session has GitHub source-edit access but no repository checkout or executable project environment. Do not mark verification complete until those commands are run against this branch.
