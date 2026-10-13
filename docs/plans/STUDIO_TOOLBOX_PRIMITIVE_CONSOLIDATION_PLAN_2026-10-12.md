# Studio + Toolbox Primitive Consolidation Plan

**Date:** 2026-10-12  
**Status:** Proposed plan; source audit completed, implementation not started  
**Repository baseline:** `master/consolidated-feature-integration`  
**Visual authority:** `ViewTube-Primitives-Components-Source-6-3.html` (44px source in the current conversation)  
**Related donor:** `ViewTube_Neobrutalist_Tag_Editor_L1.html` for the replacement tag editor

## Goal

Consolidate Studio and Toolbox UI controls around the supplied 44px component source. Make one canonical owner for each visual/behavioral primitive, route consumers through it, and remove duplicate button, split-left, field-label, menu, and tag-editor implementations only after their consumers and behavior are accounted for.

This is a migration, not a global find-and-replace. Preserve semantics, callback contracts, accessibility, disabled/loading states, and feature-specific behavior while removing duplicate visual authorities.

## Source audit findings

### Confirmed duplication and drift

1. **Two button/control systems coexist.**
   - `src/components/subtoolbox/SubToolboxPrimitives.tsx` owns `SubToolboxButton`, `SubToolboxIconTextButton`, standard inputs/textareas, right-label fields, tags, and menu controls.
   - `src/studio-ui/primitives/StudioControls.tsx` owns `StudioButton`, `StudioSplitLeftButton`, `StudioInput`, `StudioTextArea`, and related wrappers.
   - `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx` separately owns `SubToolboxSplitButton`.
   - The wrappers are not all identical in behavior or props, so migration needs an explicit compatibility map.

2. **Default control heights conflict.**
   - The supplied HTML declares `--vt-h: 44px`, with a 3px stroke, 8px radius, 4px shadow offset, 28px rail icon, and 36px chevron hit area.
   - `src/components/subtoolbox/tokens.ts` already defines component size DNA with M=44px, but structural L0/L1/L2 are 56/48/32px.
   - `src/styles/subtoolbox-system.css` and `src/styles/studio-control-system.css` still default standard controls to 48px.
   - Component size and structural hierarchy must remain separate concepts; changing the default component height must not accidentally redefine toolbox shell/header geometry.

3. **Typography has competing defaults.**
   - The supplied HTML uses Inter, weight 1000, uppercase control text, 0.86 line height, -0.035em tracking, and 32px / 22px / 14px type tokens.
   - Existing shared controls include 14px / 800–900-weight defaults and separate letter-spacing/line-height rules.
   - The new token mapping must distinguish display/action labels from input content, helper labels, menu rows, and small controls. Do not apply 32px indiscriminately to editable text or secondary labels.

4. **Field-label variants differ.**
   - The current API exposes `SubToolboxLabeledInput` and `SubToolboxLabeledTextArea` with a `right-label` variant.
   - The supplied source contains floating-label input and textarea anatomy (`.vt-field`, `.vt-field--area`, and value/focus state).
   - Floating labels must remain programmatically associated with their fields and work for controlled/pre-filled values, focus, blur, validation, and screen readers.

5. **Dropdown variants overlap.**
   - Existing `SubToolboxMenu`, `SubToolboxSplitDropdown`, `SubToolboxTopTitleDropdown`, and `StudioDropdown` cover overlapping menu patterns.
   - The supplied HTML has distinct 08 V1 menu-band, 09 L1 menu, and 10 V2 legend/multi-filter patterns. Each should map to one explicit variant of the canonical dropdown/menu primitive, not a copy of its CSS or behavior.

6. **Tag editor replacement is a separate compound migration.**
   - The current `SubToolboxTagEditor` is used in metadata and vault surfaces.
   - The replacement donor is the L1 neobrutalist tag editor. Its add/remove interactions, keyboard behavior, validation, and controlled tag state must be preserved; the requested plus-square add control and checkmark action should remain clear and aligned with the input.

7. **Tests and component catalogs encode old names.**
   - The component library/migration catalogs, Studio certification, Video Manager contract tests, and primitive tests explicitly reference the current component names.
   - These contracts need deliberate updates; do not weaken or delete tests just to make a rename pass.

### Source files identified

- `src/components/subtoolbox/SubToolboxPrimitives.tsx`
- `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx`
- `src/components/subtoolbox/tokens.ts`
- `src/styles/subtoolbox-system.css`
- `src/styles/studio-control-system.css`
- `src/styles/toolbox-entry.css`
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/primitives/StudioDropdown.tsx`
- `src/studio-ui/index.ts`
- `src/components/CommunityPostGenerator.tsx`
- `src/components/metadata/CanonicalMetadataSections.tsx`
- `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx`
- `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- `src/components/ToolboxUIReferenceLibrary.test.tsx`
- `src/components/SubToolboxDesignGovernance.test.ts`
- `src/studio-ui/StudioHubCertification.test.tsx`
- `src/views/VideoManager.contract.test.ts`
- `src/views/VideoDirector.contract.test.tsx`

This is a source-backed starting inventory, not yet an exhaustive count of every import, CSS selector, or runtime instance. Phase 1 must generate that complete inventory before deleting exports or styles.

## Architecture decisions proposed

1. **One shared token authority:** map the supplied HTML's values into canonical tokens, with named semantic aliases for typography and control sizes.
2. **One primary action button:** introduce/standardize `PrimaryButton` as the default action button; migrate ordinary uses of `SubToolboxButton` and `StudioButton` to it. Keep dedicated icon-only controls where icon-only semantics are required.
3. **One split-left button:** one canonical `SplitLeftButton` implements the supplied `vt-split` anatomy, play/pause inverse-color selected variant, sizing, and accessibility contract. Replace `SubToolboxIconTextButton`, `SubToolboxSplitButton`, and `StudioSplitLeftButton` usages as requested, after checking whether any use is not semantically a split-left action.
4. **44px component default:** M/standard controls default to 44px. Add a smaller explicit size variant for compact contexts (use the donor's 32px family where it fits, and 20px only for intentionally micro controls). Keep 56px large controls as an explicit variant; do not map structural L1 directly to component M.
5. **Named input variants:** replace right-label overlay fields with floating-label input/textarea variants; simple input/textarea presentation replaces the specified legacy 13/14 variants after the numbering is confirmed against the donor.
6. **Named dropdown variants:** canonicalize the 08 V1 menu-band, 09 L1 menu, and 10 V2 legend/multi-filter menu as explicit variants with shared trigger, option, keyboard, and focus behavior.
7. **One tag editor:** migrate all tag editor consumers to the supplied L1 editor, preserving ranked/color tag presentation where that is a data requirement rather than an alternate editor implementation.
8. **Compatibility only at public seams:** use temporary re-exports/adapters during migration if required to keep the app buildable; remove obsolete component implementations and exports after consumer migration and test updates.

## Implementation phases

### Phase 1 — Inventory and baseline (read-only except audit artifacts)
- Search every TSX import/JSX use, CSS selector, export/barrel, story/catalog entry, and test for the old component names and relevant class names.
- Record each usage's semantics: ordinary action, selected choice, icon-only action, split-left action, dropdown trigger, input, textarea, tag editor, or menu-band.
- Capture current desktop and mobile reference-library and representative consumer screenshots where runtime/browser access is available.
- Run the existing focused tests, typecheck, CSS check, and build to establish a baseline.
- Produce a migration matrix with counts and owning files before code removal.

**Acceptance:** a complete old-name usage inventory; baseline command results recorded; exact HTML donor section mapped to each requested variant.

### Phase 2 — Canonical tokens and size contract
- Add the supplied palette-independent design values to the canonical token layer: Inter stack, font weights/sizes, leading/tracking, 44px standard height, 3px stroke, 8px radius, 4px shadow offset, 28px rail icon, and 36px chevron hit area.
- Update shared CSS to consume tokens instead of defining 48px standard defaults independently.
- Define explicit 44px standard, 32px compact, and 20px micro variants where needed; retain 56px as an intentional large/action option.
- Keep structural Toolbox/SubToolbox shell tokens separate from control family size tokens.
- Add token/size contract tests before migrating consumers.

**Checkpoint A:** token contract tests pass; 44px and short variants render correctly in the component catalog at narrow and wide widths.

### Phase 3 — Primary and split-left button migration
- Implement the canonical `PrimaryButton` and `SplitLeftButton` APIs with forwarded refs, standard button attributes, disabled/loading states, selected state, and semantic ARIA.
- Migrate ordinary `SubToolboxButton` / `StudioButton` uses to `PrimaryButton`; preserve icon-only button semantics and domain-specific compound controls.
- Migrate split-left usages, including metadata Generate/Refine/Analyze actions and Community post-style choices.
- Implement the play/pause split-left color-toggle variant: selected state inverses rail/body colors; group buttons retain consistent dimensions where labels differ.
- Update exports/barrels, catalogs, and tests. Keep compatibility adapters only until all consumers compile and pass.

**Checkpoint B:** no production consumer imports the retired button APIs; Community post-style selection and action rows pass interaction and visual checks.

### Phase 4 — Floating-label input and textarea migration
- Implement canonical floating-label input and textarea variants from the supplied source.
- Replace `right-label` field anatomy in consumers, including metadata fields, with the floating-area variant.
- Replace the donor's specified simple versions for sections 13 and 14 after confirming the exact numbered family names.
- Verify pre-filled values, empty values, focus/blur, controlled values, errors, disabled/read-only states, and accessible labels.

**Checkpoint C:** all legacy right-label usages are migrated; input and textarea tests cover value and focus states.

### Phase 5 — Dropdown/menu consolidation
- Map 08 V1 menu-band, 09 L1 menu, and 10 V2 legend/multi-filter dropdown from the donor into named variants of the canonical dropdown/menu API.
- Migrate usages of the current overlapping menu/dropdown primitives according to the Phase 1 matrix.
- Preserve selected/multi-selected values, option icons, disabled options, outside click, Escape, arrow-key behavior, focus restoration, and responsive placement.
- Remove duplicated dropdown CSS and obsolete variants only when their usage count reaches zero.

**Checkpoint D:** all three donor variants work in keyboard and pointer flows; no migrated consumer depends on retired dropdown styling.

### Phase 6 — Tag editor replacement
- Implement the donor L1 tag editor as the single canonical editor.
- Keep plus-square Add control and checkmark action to the right of the entry field, with Enter-to-add, remove controls, duplicate/empty handling, and accessible labels.
- Migrate metadata and vault consumers, preserving tag order/ranking/color information and external controlled-state contracts.
- Remove the old editor implementation/styles after all consumers move.

**Checkpoint E:** tag editor unit/interaction tests pass; Video Manager metadata and vault flows retain their tag data behavior.

### Phase 7 — Cleanup, certification, and removal
- Remove retired component implementations, exports, duplicate CSS rules, and obsolete catalog entries.
- Update all source-based contract tests to assert the canonical API and visual tokens rather than old names.
- Run focused tests, full test suite, typecheck, CSS check, lint, and production build using the repository scripts.
- Capture desktop, tablet/narrow, mobile portrait, and mobile landscape screenshots for buttons, fields, dropdowns, tags, Community post styles, Metadata Manager/Publisher, and the component library.
- Compare with the supplied HTML donor and inspect console/accessibility issues before opening the implementation PR.

**Final acceptance:**
- one authoritative implementation per requested component family;
- standard control height is 44px with intentional shorter variants;
- defaults derive from the supplied HTML token contract;
- all requested consumer migrations complete;
- no dead exports/duplicate CSS for retired variants;
- tests/build pass with no new failures versus baseline;
- visual and interaction checks are recorded, not assumed.

## Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Broad API rename breaks many tools | High | Inventory first; migrate in compile-safe slices; temporary adapters only when needed |
| Typography values are too large for dense labels | High | Use semantic size roles from the donor; test long labels and narrow layouts rather than applying one font size everywhere |
| 44px component size is confused with L1 structural size | High | Keep component size DNA separate from L0/L1/L2 structure |
| Dropdown variants lose keyboard behavior during CSS replacement | High | Preserve interaction contract and add behavior tests before deleting old implementations |
| Tag editor drops ranking/color or saved state | High | Map props/data shape before replacing; add metadata/vault integration tests |
| Existing tests encode implementation names | Medium | Update tests to validate behavior and canonical ownership, not simply remove assertions |
| Screenshot/browser runtime unavailable | Medium | Report the blocker and do not claim visual certification |

## Verification commands

Use repository-defined commands, confirmed from `package.json`:
- `npm test -- <focused test path(s)>` (Vitest supports focused files)
- `npm run typecheck`
- `npm run check:css`
- `npm run lint`
- `npm run build`

The exact focused test list is selected after Phase 1's inventory. Do not claim tests or screenshots pass until they are run.
