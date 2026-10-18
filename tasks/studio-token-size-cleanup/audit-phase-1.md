# Phase 1 — Source audit findings

**Audit ref:** `master/consolidated-feature-integration`  
**Audit date:** 2026-10-18  
**Scope:** token source, base control stylesheet, field-specific stylesheet, field primitives, global contract, and Confirmed Primitive Library source.

This report records the source-level audit and the first targeted Phase 2 correction. The CSS/token/test/doc changes are committed on this work branch; browser-rendered certification is not claimed.

## Confirmed sources inspected

- `src/studio-ui/tokens.ts`
- `src/styles/studio-control-system.css`
- `src/styles/studio-text-input.css`
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/primitives/StudioTextInput.tsx`
- `src/studio-ui/primitives/StudioTextArea.tsx`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`

## Discrepancy and evidence table

| ID | Finding | Evidence | Required resolution |
|---|---|---|---|
| A1 | Field focus offset conflicted with the canonical zero-offset rule. | Import order is `studio-control-system.css` → generated vars → core → split → fields → motion. A late generic rule in `studio-control-system.css` used `outline-offset: 1px !important`, overriding the later field stylesheet. | Corrected the late generic field rule to zero offset and removed `!important`; added a scoped regression assertion. The unrelated close-button 1px focus offset remains an intentional exception. |
| A2 | Focus outline sizing had repeated conflicting values (3px/2px and 1.95px/1.3px) in the same stylesheet. | Token object, initial variable block, later legacy variable block, and floating/fixed label wrappers duplicated focus widths. | Normalized the repeated token-backed declarations to 1.95px / 1.3px / 0.65px and zero offset. A focused source-contract test now guards the ratios; runtime test execution remains outstanding. |
| A3 | Global fill documentation conflicts with the token contract. | `STUDIO_CONTROL_SIZE_BASE` sets `defaultFillOpacity: 50`; the size contract also sets text-input fill to 50%. The defaults index currently describes ordinary action faces as 100% primary fill. | Separate general Studio control defaults from explicitly solid variants. Update the documentation only after verifying the current approved family-by-family fill contract; do not change all fills globally. |
| A4 | Text stroke is not the same thing as border stroke. | `studio-text-input.css` sets native input value stroke from `--vt-studio-control-text-stroke`, while input border width is tiered separately. Textarea value strokes use the registered 0.5px / 0.35px values. | Preserve the explicit text-stroke contract. Do not mechanically replace text-stroke width with the 3px / 2px / 1px outer border width. |
| A5 | The plain input has a dedicated stylesheet with fixed geometry and typography values. | `StudioTextInput.tsx` imports `studio-text-input.css`; that file declares 44/28/14px height, 38/24/10px type, border widths, radius, fill, color, and focus text color. | Determine actual import/cascade ownership before consolidating; keep native input value typography separate from floating-label typography. Avoid introducing a second competing source. |
| A6 | Textarea contract is intentionally distinct. | `StudioTextArea.tsx` sets the shared Studio control attributes; control CSS sets textarea type to 18px standard / 14px compact, multiline line-height, and 92px minimum height. | Preserve textarea exception and test it independently from single-line input rules. |
| A7 | The token source and stylesheet contain some independently-authored defaults. | Tokens define focus fill/outline width and secondary width; the stylesheet repeats several of these as literal custom-property defaults. | Normalize only after import graph and consumer audit. Prefer the canonical token-to-CSS bridge and avoid duplicate token generators. |
| A8 | Catalog provenance points at real production primitives. | `StudioHubConfirmedPrimitiveCatalog.tsx` imports its controls from `src/studio-ui/primitives/StudioControls.tsx`. | Keep the catalog as a specimen surface, not a second implementation; visual certification still requires browser/computed-style evidence. |

## Protected invariants

- Standard / compact / micro heights: 44px / 28px / 14px.
- Border widths: 3px / 2px / 1px; radii: 6px / 4px / 2px.
- Single-line input text: 38px standard / 24px compact, left aligned.
- Textarea text: 18px standard / 14px compact, with 92px minimum writing surface.
- Native field text stroke follows its own typography contract; it is not automatically the same width as the outer border.
- Resting primary fill for fields is 50%; focus fill is 15%; focused text is black.
- Focus outline is secondary at full opacity, 65% of selected border width, zero offset.
- No black focus glow, shadow-based geometry, or layout shift.
- Do not use SubToolbox primitives as the canonical Studio field implementation.
- Do not touch the unrelated Settings redesign plan/task list.

## Verification still required

1. Trace CSS import order and all consumers of the field variables, including any generated/split CSS.
2. Find or add focused contract tests that assert final cascade requirements and token ratios.
3. Reconcile the documented 100% action-face fill with current user-approved family behavior; document real exceptions explicitly.
4. Run the repository's focused tests, relevant type/lint checks, and build on an executable checkout.
5. Verify computed styles and screenshots for standard/compact input, textarea, floating-label variants, and focus states in browser before marking visual certification complete.

**Gate status:** Source inventory, CSS import-order tracing, and family-by-family fill reconciliation are complete. Phase 2 corrections are implemented in the branch: repeated focus widths normalized, the late field focus override fixed, regression assertions added, and fill documentation clarified. The focused test/build baseline has not been executed in this environment, and browser/computed-style verification remains open; do not mark runtime certification complete until CI or a local checkout runs the suite.
