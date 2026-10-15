# Studio Controls Inline Stepper — Todo

Plan: docs/studio-controls/inline-stepper-plan-2026-10-15.md
Branch: plan/studio-controls-inline-stepper
Status: Planning artifact only; implementation not started.

## Phase 0 — Inspect and baseline
- [ ] Audit canonical Studio Controls exports/catalog and nearby primitive naming.
- [ ] Audit shared 44px/28px tokens, split-left text input, and numeric input behavior.
- [ ] Identify focused test, source-governance, typecheck, lint, and build commands.
- [ ] Record baseline failures before modifying component code.

## Phase 1 — Contract tests first
- [ ] Add tests for horizontal 1:2:1 geometry and standard/compact variants.
- [ ] Add tests for direct typing, increment/decrement, decimal steps, and controlled values.
- [ ] Add tests for min/max boundaries, disabled state, keyboard/pointer behavior, and draft commits.
- [ ] Add governance assertions for canonical Studio Controls ownership and global token use.

## Phase 2 — Implement
- [ ] Implement StudioInlineStepper.tsx.
- [ ] Implement token-driven studio-inline-stepper.css.
- [ ] Keep StudioSplitStepper unchanged and avoid SubToolbox imports/classes.

## Phase 3 — Register
- [ ] Export the new primitive through the canonical Studio Controls entry point.
- [ ] Add the primitive to the canonical reference catalog.
- [ ] Document the distinction from the existing vertical-rail split stepper.

## Phase 4 — Verify
- [ ] Focused tests pass.
- [ ] Studio Controls/source-governance checks pass or remaining baseline failures are clearly identified.
- [ ] Typecheck, lint, and production build results recorded.
- [ ] Standard/compact browser render, focus, disabled, and bounds visually inspected.
- [ ] Update this todo with evidence; do not mark unverified checks complete.
