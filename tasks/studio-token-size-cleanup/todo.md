# Studio Token & Size System Cleanup — Task List

Plan: `tasks/studio-token-size-cleanup/plan.md`  
Target: `master/consolidated-feature-integration`

## Phase 1 — Inventory and reconcile

- [x] Trace token and CSS import ownership, including generated/split styles.
- [x] Inventory hard-coded dimensions, repeated custom properties, selector conflicts, `!important`, and unused variants/exports in the field-focus path.
- [x] Compare tokens, CSS, primitives, exception registry, docs, and catalog for the scoped field contract.
- [x] Reconcile field fill (50% resting / 15% focused) against explicitly solid button/badge family exceptions.
- [x] Resolve focus-outline sizing and derivation discrepancies (1.95px / 1.3px / 0.65px; offset 0).
- [ ] Record executable baseline tests/build; no local execution environment or successful CI result has yet verified this branch.

### Checkpoint A
- [x] Every conflicting default in the scoped field-focus/fill contract has an evidence-backed resolution.
- [x] Production styling changed only after source and import-order reconciliation.
- [ ] Baseline test/build result recorded.

## Phase 2 — Normalize tokens

- [x] Validate source declarations for standard 44px, compact 28px, micro 14px contracts.
- [x] Verify micro focus-outline derivation and explicit text/icon legibility overrides.
- [x] Normalize duplicated focus-outline widths without creating a second token source.
- [x] Preserve 38px/24px input typography and the 18px/14px textarea exception.
- [x] Add/update focused size-contract and exception tests.
- [ ] Execute focused size-contract tests and typecheck/build; source edits alone are not test evidence.

### Checkpoint B
- [ ] Token tests pass (tests authored/updated but not executed).
- [x] Exceptions remain typed, named, justified, and limited to real departures.

## Phase 3 — Consolidate CSS and primitive consumption

- [ ] Remove only verified duplicate/conflicting declarations.
- [ ] Keep Studio selector scope and import ownership clear.
- [ ] Preserve flat/no-shadow/no-movement defaults.
- [ ] Preserve field left alignment, primary inline strokes, focus behavior, and no layout shift.
- [ ] Preserve row-fill defaults and size-independent color/alignment contracts.
- [ ] Run focused component checks, relevant lint/type checks, and production build.

### Checkpoint C
- [ ] No input/textarea regression.
- [ ] No new build failure or cross-system CSS leak.

## Phase 4 — Sync docs and certify catalog

- [ ] Align the defaults/exceptions index with verified source behavior.
- [ ] Align the exception registry and catalog notes.
- [ ] Confirm catalog specimens import production primitives.
- [ ] Verify standard/compact controls and supported micro exceptions.
- [ ] Record computed-style/browser evidence before claiming visual certification.

### Checkpoint D
- [ ] Tokens, CSS, TSX, docs, exception registry, tests, and catalog agree.
- [ ] Final diff is scoped to Studio token/size cleanup.
- [ ] Existing Settings redesign plan and task list remain unchanged.
