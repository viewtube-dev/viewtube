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


## Additional confirmed-library and shared-design requirements

These are global requirements for the port and supersede any narrower specimen/layout assumptions above.

1. **Canonical double-chevron design — system-wide import:** identify the exact double-chevron button implementation and styling on `master/consolidated-feature-integration`. Import that same design into every production component and primitive that uses the double-chevron button, not just the counter being modified. First inventory all usages across Studio primitives, modules, and catalog-backed components; then migrate them to one shared implementation/token contract. Preserve each component's semantics and interaction behavior while eliminating visual drift and duplicate local chevron treatments.
2. **Canonical focus styling — system-wide import:** likewise identify the canonical focus implementation and apply it consistently to every applicable Studio component and primitive, not only textareas or fields. Reuse the same focus state mechanism, color/stroke layers, transition/fade timing, and reduced-motion behavior. Keep legitimate component-specific exceptions documented; do not leave competing local focus systems or partial styling.
3. **Confirmed Primitive Library layout:** do not arrange primitive designs in columns. Each specimen must use the full available row or its natural/auto width. Remove column-based specimen grids and avoid fixed equal-width cards that distort the primitive's native geometry.
4. **Remove inverse counter/slider styling:** exclude the inverse-color designs currently shown for counters and sliders from the Confirmed Primitive Library. Show the canonical standard design only; do not retain inverse variants as alternate examples or silently preserve them as catalog-only styling.
5. **Consistent size specimen matrix for every applicable primitive module:** for modules whose primitives use the usual fixed-height Studio control sizing, show these examples together in this exact sequence:
   - one Standard example spanning the full row;
   - two Compact examples, each occupying half the row;
   - four Micro examples, each occupying one quarter of the row.
   Keep the examples adjacent in a single specimen sequence, with **no intervening text, headings, labels, captions, or explanatory content** between the examples. The module heading may precede the sequence; explanatory material, if necessary, follows it. Use the actual production primitive at each supported size and let the specimen container provide the row fractions. Do not fabricate unsupported size variants. Document any primitive that legitimately does not support this size matrix.
6. **Representatives section:** add a dedicated Representatives section to the Confirmed Primitive Library. It should provide the curated, easy-to-scan representative set of real production primitives, distinct from the detailed family/module sections. Each representative must use the canonical design and production component; no mock-only replicas or inverse counter/slider variants. Keep its layout full-row or auto-width, never column cards.

### Additional implementation and verification tasks

- Inventory every double-chevron and focus-style consumer on both source and destination branches before edits; use the source branch's exact shared implementation as the design reference.
- Add regression coverage for cross-family double-chevron parity and focus parity, including focus-visible, keyboard interaction, pointer interaction where relevant, and reduced motion.
- Reorganize the Confirmed Primitive Library specimen layout and add the Representatives section as part of the same catalog pass.
- Verify every applicable module follows the Standard 1×full / Compact 2×half / Micro 4×quarter specimen sequence with no labels inserted between specimens.
- Audit the resulting catalog for column layouts, inverse counter/slider specimens, inconsistent chevrons, and component-specific focus drift.


## Execution checkpoint — 2026-10-31

This checkpoint records repository inspection only; it does not certify completion.

### Present in the destination branch

- The branch contains production implementations for `StudioVerticalWordToggle`, `StudioSquareIconButtonGroup`, `StudioTextBox`, `StudioLeftWordCounter`, `StudioSplitAccordion`, and the five value-toggle exports.
- `src/studio-ui/index.ts` exports the restored primitive names and associated public prop types.
- Dedicated stylesheets exist for restored primitives, value toggles, split accordion, and shared focus.
- `StudioRestoredPrimitives.test.tsx`, `StudioValueToggles.test.tsx`, and the restored-primitives Node audit are present and wired into `test:studio-controls`.
- The confirmed catalog contains a Representatives implementation and size-matrix markup, and the plan's layout audit was expanded.

### Static audit findings still requiring resolution or proof

- `StudioValueToggles.tsx` imports `StudioSplitShell` and `STUDIO_LEFT_WORD_OPTIONS` from `StudioControls.tsx`, while `StudioControls.tsx` re-exports the value-toggle module. This is an ES-module cycle. The imported bindings appear to be consumed from component render paths, but the cycle must be exercised by the focused tests and typecheck; extract the shared shell/options into a dependency-neutral module if the tests or runtime expose initialization problems.
- CSS ownership is split across component-level imports (`StudioControls.tsx`, `StudioValueToggles.tsx`, and `StudioSplitAccordion.tsx`), the Studio entry stylesheet, and the late focus import in `main.tsx`. Confirm the production bundle's effective order and check for duplicate inclusion before calling ownership resolved.
- The catalog layout audit currently asserts the presence of `!important` in layout selectors. Review whether those declarations are genuinely necessary against the actual host layout; the user requirement is to prefer removing overrides rather than expanding them.
- The shared focus selector and reduced-motion rule exist, but source inspection alone does not prove parity for keyboard focus, pointer-driven interaction dwell, and synchronized character fades across every consumer.

### Verification evidence available at this checkpoint

- GitHub reports the three Vercel deployment status contexts as successful for head commit `cf51380744daa8f3a25f9c10e4f84c299bdbb266`. These are deployment statuses, not test, typecheck, or build results.
- GitHub returned no Actions workflow runs for that commit.
- The repository's `test:studio-controls`, `typecheck`, and `build` commands have not been executed in this environment. A local clone attempt was blocked because this environment could not resolve `github.com`.
- The open draft PR #631 is reported as not mergeable. The branch comparison against `master/consolidated-feature-integration` is diverged (185 commits ahead and 4,275 behind at this inspection).

### Next required actions

1. Resolve or explicitly validate the value-toggle/controls module cycle.
2. Verify stylesheet inclusion/order and remove avoidable duplicate imports/overrides.
3. Run `npm run test:studio-controls`, `npm run typecheck`, and `npm run build` in a repository-capable environment; fix every failure and rerun affected commands.
4. Add/execute browser-level checks for representative focus, chevron, and catalog layout behavior if browser verification is available.
5. Reassess the intended base branch and divergence before changing PR #631; do not retarget or merge wholesale without a dependency-aware reconciliation.
6. Keep the PR draft until all verification gates pass.
