# Studio Controls Regression Recovery — Checklist

## Phase 1 — Split Left input
- [ ] Add failing regression coverage for pointer/touch editability of left/right/double split inputs.
- [ ] Correct split-label pointer-event ownership so the native input receives interaction.
- [ ] Restore persistent primary inset stroke and shared focus behavior.
- [ ] Verify keyboard, selection, cursor, controlled and uncontrolled editing.

## Phase 2 — Auto-width defaults and imports
- [ ] Inventory primitive modules and stylesheet ownership.
- [ ] Ensure canonical global full-row auto-width is imported and visible in each relevant module.
- [ ] Remove component-local width overrides from counters, sliders and toggles.
- [ ] Preserve only horizontal and vertical word-toggle content-width exceptions.
- [ ] Add tests for defaults, imports and exceptions.

## Phase 3 — Representative library
- [ ] Generate inventory from public exports and real implementations.
- [ ] Compare exports against representative identifiers.
- [ ] Add missing production primitive representatives.
- [ ] Organize all variants and families together.
- [ ] Keep representatives full-row or naturally auto-width; no column layout.
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
