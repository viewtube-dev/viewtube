# Studio + Toolbox Primitive Consolidation — Task Checklist

**Plan:** `docs/plans/STUDIO_TOOLBOX_PRIMITIVE_CONSOLIDATION_PLAN_2026-10-12.md`  
**Status:** Planning only; no production component changes have been made.

## Phase 1 — Inventory and baseline
- [ ] Enumerate every import, JSX usage, export, CSS selector, catalog entry, and test for old buttons, split-left controls, right-label fields, dropdown/menu variants, and tag editors.
- [ ] Classify usages by semantic role and document compatibility requirements.
- [ ] Map donor HTML sections 08, 09, 10, 13, 14 and the tag editor donor to code variants.
- [ ] Record baseline focused tests, typecheck, CSS check, lint, build, and available screenshots.
- [ ] Checkpoint A: approve usage matrix and donor mapping before code edits.

## Phase 2 — Token and size authority
- [ ] Define canonical typography, icon, stroke, radius, shadow, and color-pair tokens from the supplied HTML.
- [ ] Set component standard height to 44px; add explicit compact/micro variants where needed.
- [ ] Keep component sizing independent of structural L0/L1/L2 geometry.
- [ ] Add token/size contract tests.
- [ ] Checkpoint B: certify 44px, 32px, and 20px examples in the component library.

## Phase 3 — Buttons
- [ ] Establish canonical `PrimaryButton`; migrate ordinary action buttons from `SubToolboxButton` and `StudioButton`.
- [ ] Preserve icon-only controls as icon-only semantic controls.
- [ ] Establish canonical `SplitLeftButton` from donor design; migrate old split-left consumers.
- [ ] Add selected inverse-color play/pause variant and apply it to Community post-style choices.
- [ ] Update exports, catalog examples, and tests.
- [ ] Checkpoint C: no production consumer imports retired button APIs; interaction/visual tests pass.

## Phase 4 — Floating-label fields
- [ ] Implement floating-label input and textarea variants.
- [ ] Migrate all right-label field consumers.
- [ ] Confirm and migrate simple variants for numbered sections 13 and 14.
- [ ] Test empty/pre-filled, controlled, focus/blur, disabled/read-only, error, and accessible-label states.
- [ ] Checkpoint D: no production right-label variants remain.

## Phase 5 — Dropdowns and menus
- [ ] Implement canonical variants for 08 V1 menu-band, 09 L1 menu, and 10 V2 legend/multi-filter.
- [ ] Migrate current dropdown/menu consumers using the usage matrix.
- [ ] Test selection, multi-selection, keyboard navigation, Escape, outside click, disabled options, and focus restoration.
- [ ] Remove obsolete menu variants/CSS after all uses are migrated.
- [ ] Checkpoint E: all three donor variants pass keyboard, pointer, responsive, and visual checks.

## Phase 6 — Tag editor
- [ ] Implement the replacement L1 tag editor from the donor.
- [ ] Place plus-square Add and checkmark action to the right of the input.
- [ ] Preserve Enter-to-add, removal, duplicate/empty validation, tag order/rank/color, and controlled state.
- [ ] Migrate metadata and vault consumers.
- [ ] Checkpoint F: tag editor unit and integration tests pass.

## Phase 7 — Cleanup and certification
- [ ] Remove retired implementations, exports, duplicate CSS, and obsolete catalog entries.
- [ ] Update contract/governance tests to enforce canonical ownership and token values.
- [ ] Run focused tests, full tests, typecheck, CSS check, lint, and build.
- [ ] Capture desktop/tablet/mobile portrait/mobile landscape states for affected controls.
- [ ] Perform final standards/spec review and open implementation PR after evidence is recorded.

## Definition of done
- [ ] Single canonical owner for each requested component family.
- [ ] 44px standard height with explicit shorter variants.
- [ ] Supplied HTML defaults drive styling through shared tokens.
- [ ] All listed consumer families migrated with behavior preserved.
- [ ] No new test/build failures versus baseline.
- [ ] Visual, responsive, keyboard, and accessibility checks recorded.
