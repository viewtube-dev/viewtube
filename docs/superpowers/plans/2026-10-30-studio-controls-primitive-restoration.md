# Studio Controls primitive restoration and interaction pass

**Date:** 2026-10-30  
**Destination:** `codex/shared-studio-interaction-focus`  
**Safety snapshot:** `backup/codex-shared-studio-interaction-focus-20261030`  
**Canonical source inspected:** `master/consolidated-feature-integration`

## Goal

Port the requested Studio primitive behavior into the existing destination branch without replacing its broader application state or importing unrelated master-branch changes. Keep `StudioSplitShell`, the canonical token layer, production primitives, family styles, catalog specimens, and tests as the ownership chain.

## Branch safety and compatibility finding

The destination branch was duplicated before any edits. The GitHub compare reports that the destination is 26 commits ahead of the canonical source's merge base and 4,027 commits behind `master/consolidated-feature-integration`; the branches are diverged. Therefore, do **not** merge or wholesale-copy master files into the destination. Port only the required Studio changes after checking each destination dependency and preserving its existing behavior.

The destination currently lacks these master-side exports/implementations: `StudioVerticalWordToggle`, `StudioSquareIconButtonGroup`, `StudioLeftWordCounter`, `StudioTextBox`, `StudioValueToggles`, and `StudioSplitAccordion`. The destination `StudioControls.tsx` does contain `StudioSplitShell`, so it is the split anatomy foundation to retain and extend.

## Canonical behavior to port

1. **Vertical word toggle:** restore the original visual design and public API from the canonical implementation; do not approximate it with a generic word toggle. Register its actual supported sizes/variants in the library.
2. **Focus and character fade:** use the global focus contract and existing interaction tokens. Resting/focused character color and stroke must fade in sync with the field's focus fill/outline; focus must not cause geometry movement. Respect reduced motion.
3. **Textarea:** black outer border; persistent primary inset stroke; resting primary text/glyph stroke and primary 50% fill; focused black text/glyph stroke, primary 15% fill, secondary outline at 65% of border width with zero offset, primary caret. Preserve the dedicated multiline typography/min-height contract.
4. **Counter chevron:** port the canonical chevron sizing/interaction behavior through the shared counter token family, not local magic values.
5. **Accordion:** port `StudioSplitAccordion` as a standalone production primitive and its dedicated stylesheet, with keyboard and reduced-motion behavior, then add real catalog specimens and regression coverage.
6. **Square button group:** five square buttons as the default primitive presentation; all five begin with primary fill; selecting one changes only the selected square to secondary fill. Preserve accessible button semantics and controlled/uncontrolled behavior already used by the component family.
7. **Value toggles:** restore/rebuild `StudioArrowToggle`, `StudioSideToggle`, `StudioDoubleSideToggle`, `StudioBarToggle`, and `StudioDoubleSplitWordCounter` on `StudioSplitShell`. Keep the implementations small, share common option/value behavior, and remove redundant family overrides.
8. **Dropdown/open-menu defaults:** token-own the trigger/menu gap, menu and row corner radii, row/control size relationship, and simple open animation. Preserve existing dropdown variants and keyboard/ARIA behavior.

## Implementation sequence

### Phase 1 — target-branch contract and dependency audit
- Inspect destination token definitions, split shell API, field primitives, dropdown implementation, CSS import order, catalog entry point, tests, and package scripts.
- Inspect the corresponding canonical-source implementations only as references; port behavior rather than whole files where destination APIs differ.
- Record the precise export/import paths and existing callers before changing public APIs.
- Resolve the canonical token values and existing family exceptions; do not create a second token generator or edit generated CSS by hand.

### Phase 2 — regression tests first
- Add failing source/API tests for vertical toggle export and variants, five-square selection fill behavior, value-toggle exports and split anatomy, textarea focus colors/fill/outline/inset, dropdown menu gap/radius/motion tokens, and accordion keyboard/reduced-motion contracts.
- Add focused interaction/component tests where the repository's existing test harness supports them.
- Verify each new assertion fails for the intended missing behavior before implementation.

### Phase 3 — production implementation
- Extend the destination's existing `StudioSplitShell` and token sources only where needed.
- Add the standalone value-toggle and accordion modules with explicit exports.
- Restore vertical word toggle and square-button-group in their current owning primitive module or a dedicated module consistent with repository conventions.
- Implement the synchronized field focus fade in shared field interaction ownership; do not add a parallel focus system.
- Add dropdown open-menu defaults to shared dropdown tokens and the canonical dropdown family styles.
- Regenerate generated CSS using the existing emitter.

### Phase 4 — catalog and documentation
- Add specimens that import the actual production primitives, including all five size examples where the family supports them.
- Keep catalog CSS limited to specimen layout.
- Update the hierarchy, component-library source-of-truth, and global defaults/exception index documents together.
- Record genuine exceptions only; do not repeat global defaults in each family.

### Phase 5 — verification and delivery
- Run the focused audit/component tests, token emitter check, typecheck, lint, and production build using the repository's available scripts.
- Inspect the final diff for unrelated files, duplicated selectors/tokens, generated-file drift, wrong file placement, and `!important` additions.
- Report tests actually run and their outcomes. Do not claim browser visual verification unless it was performed.
- Open a PR from `codex/shared-studio-interaction-focus` to its intended integration base only after the implementation and tests are complete.

## Acceptance criteria

- No wholesale master merge and no unrelated application changes.
- Existing destination behavior and landed work remain intact.
- All requested primitives are exported from the public Studio UI entry point and are represented by real production-backed catalog specimens.
- All field focus layers remain distinct: black outer border, persistent primary inset, black focused text/glyph stroke, primary focus fill/caret, secondary outline.
- All new geometry, colors, sizes, timing, and animation values are token-owned or justified as a registered family exception.
- No new duplicate implementation, parallel token system, hand-edited generated CSS, or undocumented override layer.
- Automated verification passes; any unavailable or failing verification is reported explicitly.
