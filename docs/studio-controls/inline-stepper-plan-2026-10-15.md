# Studio Controls Inline Stepper — Implementation Plan

Date: 2026-10-15
Repository: viewtube-dev/viewtube
Base branch: master/consolidated-feature-integration
Planning branch: plan/studio-controls-inline-stepper
Status: Plan only — no component implementation or runtime behavior changed.

## Goal

Add a new canonical **Studio Controls** numeric stepper with a horizontal [-] [22] [+] layout. The center field accepts direct numeric typing; the left and right square buttons decrement and increment the value. This is not a SubToolbox component and must follow the global Studio Controls token, typography, color-pair, focus, disabled, and standard/compact rules.

## Existing-system findings

- The integration branch already contains StudioSplitStepper, a different component with a 2:1 editable value pane and a vertically stacked up/down rail.
- Existing PRs #341, #344, and #345 establish the current canonical Studio Controls split-stepper family and shared token-governance direction.
- The new horizontal control must not silently replace or rename that vertical-rail component. Keep both primitives unless a later explicit consolidation decision is made.
- Global Studio Controls sizing uses standard 44px and compact 28px dimensions. Consume the canonical size tokens instead of introducing independent hard-coded sizing.
- Existing tasks/plan.md and tasks/todo.md belong to the Settings Frontend Redesign and are unrelated; do not overwrite or append this work to those files.

## Proposed component contract

- **Provisional name:** StudioInlineStepper (confirm against nearby naming conventions during implementation).
- **Owner:** src/studio-ui/primitives/; export through the canonical Studio Controls primitive entry/catalog.
- **Structure:** one compound control in a fixed 1:2:1 width ratio: square decrement button, editable numeric input, square increment button. Both buttons match the center field's outer height and use shared borders/seam overlays so no double-width divider appears.
- **Sizes:** standard (44px) and compact (28px), driven by the existing Studio Controls size contract and tokens.
- **Value API:** controlled numeric value, onValueChange, optional min, max, step, size, disabled, and accessible label; mirror the established primitive API style where practical.
- **Input:** native editable number input. Preserve the user's draft while typing; normalize/clamp only at well-defined commit boundaries, and never emit NaN/Infinity. Respect decimal steps and browser keyboard editing.
- **Buttons:** decrement/increment by step; stop at min/max; disable each direction independently at its boundary. Keyboard activation and pointer activation must each change the value exactly once. Do not add hold-repeat unless the established product interaction contract specifically requires it.
- **Styling:** reuse the shared Studio Controls font, weight, letter spacing, color pairing, fill opacity, stroke, radius, focus ring, disabled treatment, and motion tokens. No SubToolbox classes, imports, or token authority.
- **Accessibility:** named decrement/increment buttons, labeled numeric input, visible focus, disabled semantics, and predictable keyboard behavior.
- **Governance:** register the component as a canonical Studio Controls primitive and document its distinction from StudioSplitStepper.

## Implementation phases

### Phase 0 — Inspect and baseline
1. Inspect the current integration branch's Studio Controls primitive exports/catalog, token definitions, number input, split-left input CSS, and neighboring tests.
2. Confirm the repository's focused Studio Controls test/build commands and existing naming convention.
3. Capture baseline status for the touched test commands; do not treat unrelated existing failures as stepper regressions.

### Phase 1 — Contract tests first
4. Add failing tests for render/layout contract, controlled typing, decrement/increment, step and decimal behavior, min/max boundaries, disabled state, accessible names, and draft/commit behavior.
5. Add source-governance assertions that the component lives in Studio Controls and consumes global tokens rather than SubToolbox primitives or duplicated constants.

### Phase 2 — Primitive implementation
6. Implement the TSX component and value normalization based on the established Studio numeric input patterns.
7. Implement CSS for the horizontal 1:2:1 geometry, square side buttons, single stroke-owned seams, standard/compact sizing, and shared interaction states.
8. Keep the existing StudioSplitStepper unchanged.

### Phase 3 — Library integration
9. Export and register StudioInlineStepper in the canonical Studio Controls primitive library/catalog.
10. Add a compact contract/reference entry that explicitly distinguishes the horizontal inline layout from the vertical-rail split stepper.

### Phase 4 — Verification
11. Run the focused component tests and source-governance tests.
12. Run the prescribed Studio Controls suite, typecheck, lint, and production build as supported by repository scripts.
13. Inspect a rendered browser result at standard and compact sizes, including focus, disabled, and min/max states.
14. Record exact commands/results and separate pre-existing failures from regressions. Do not claim visual/browser certification without an actual rendered check.

## Acceptance criteria

- [ ] New horizontal [-] [value] [+] control exists as a canonical Studio Controls primitive.
- [ ] Left/right buttons are square and the control follows the 1:2:1 geometry.
- [ ] Center numeric field is directly editable.
- [ ] Standard 44px and compact 28px variants use global size tokens.
- [ ] Increment/decrement obey step, min/max, disabled state, and keyboard/pointer input.
- [ ] Invalid/intermediate drafts do not leak NaN/Infinity or unexpectedly overwrite active typing.
- [ ] Shared Studio Controls tokens govern typography, colors, borders, focus, and disabled styling.
- [ ] No SubToolbox dependency or duplicate competing styling authority is introduced.
- [ ] Existing StudioSplitStepper behavior and tests remain unchanged.
- [ ] Catalog/export integration, focused tests, broader validation, and browser visual check are documented.
