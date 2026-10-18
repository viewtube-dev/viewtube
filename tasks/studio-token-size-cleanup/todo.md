# Studio Token & Size System Cleanup — Task List

Plan: `tasks/studio-token-size-cleanup/plan.md`  
Target: `master/consolidated-feature-integration`

## Phase 1 — Inventory and reconcile

- [ ] Trace token and CSS import ownership, including generated/split styles.
- [ ] Inventory hard-coded dimensions, repeated custom properties, selector conflicts, `!important`, and unused variants/exports.
- [ ] Compare tokens, CSS, primitives, exception registry, docs, and catalog.
- [ ] Resolve the fill-opacity disagreement using the latest approved contract and rendered behavior.
- [ ] Resolve focus-outline sizing and derivation discrepancies.
- [ ] Record baseline tests/build and a discrepancy/resolution table.

### Checkpoint A
- [ ] Every conflicting default has an evidence-backed resolution.
- [ ] No production styling changed before contract reconciliation.

## Phase 2 — Normalize tokens

- [ ] Validate standard 44px, compact 28px, micro 14px contracts.
- [ ] Verify micro derivation and explicit legibility overrides.
- [ ] Centralize shared numeric contracts without creating a second token source.
- [ ] Preserve 38px/24px input typography and the 18px/14px textarea exception.
- [ ] Add/update focused size-contract and exception tests.

### Checkpoint B
- [ ] Token tests pass.
- [ ] Exceptions are typed, named, justified, and limited to real departures.

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
