# Studio Controls Inline Stepper — Todo

Plan: docs/studio-controls/inline-stepper-plan-2026-10-15.md
Branch: plan/studio-controls-inline-stepper
Status: Implementation committed; validation pending.

## Phase 0 — Inspect and baseline
- [x] Audit canonical Studio Controls exports/catalog and nearby primitive naming.
- [x] Audit shared 44px/28px tokens, split-left text input, and numeric input behavior.
- [x] Identify focused test, source-governance, typecheck, lint, and build commands.
- [ ] Record baseline failures before modifying component code.

## Phase 1 — Contract tests first
- [x] Add tests for horizontal 1:2:1 geometry and standard/compact variants.
- [x] Add tests for direct typing, increment/decrement, decimal steps, and controlled values.
- [x] Add tests for min/max bounds, numeric normalization, accessible action labels, and draft commits. Pointer/keyboard event-level tests remain limited by the available test harness.
- [x] Add governance assertions for canonical Studio Controls ownership and global token use.

## Phase 2 — Implement
- [x] Implement StudioInlineStepper.tsx.
- [x] Implement token-driven studio-inline-stepper.css.
- [ ] Keep StudioSplitStepper unchanged and avoid SubToolbox imports/classes.

## Phase 3 — Register
- [x] Export the new primitive through the canonical Studio Controls entry point.
- [x] Add the primitive to the canonical reference catalog.
- [x] Document the distinction from the existing vertical-rail split stepper.

## Phase 4 — Verify
- [ ] Focused tests pass.
- [ ] Studio Controls/source-governance checks pass or remaining baseline failures are clearly identified.
- [ ] Typecheck, lint, and production build results recorded.
- [ ] Standard/compact browser render, focus, disabled, and bounds visually inspected.
- [x] Update this todo with implementation evidence; unverified checks remain open.
\n\n## Execution limitation\n- Local clone/test execution was blocked because the runtime could not resolve github.com. CI and browser verification remain pending; no test/build/lint success is claimed.\n