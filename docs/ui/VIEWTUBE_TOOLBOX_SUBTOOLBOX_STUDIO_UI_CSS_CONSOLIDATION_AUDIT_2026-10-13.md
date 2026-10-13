# ViewTube Toolbox / SubToolbox / Studio UI CSS Consolidation Audit

**Date:** 2026-10-13  
**Target branch:** `master/consolidated-feature-integration`  
**Audit mode:** Source-based static audit; no application files changed  
**Scope:** Toolbox and SubToolbox shells, primitives, layouts, Studio Hub control systems, component-library CSS, design tokens, CSS entry points, palette, and ownership tests.  
**Verification limitation:** GitHub source was inspected directly. The bundled Impeccable detector, browser screenshots, contrast measurements, Vitest, typecheck, and production build were not run in this session. Scores below are provisional source-based estimates, not runtime certification.

## Executive finding

ViewTube already has a strong canonical foundation, but it still has overlapping styling authorities and compatibility layers. The right objective is **one governed UI system with explicit layers**, not one giant CSS file and not identical UI for every tool.

Preserve specialized visuals and the hard-coded component-library certification baseline. Consolidate duplicated geometry, typography, colors, states, and responsive rules into the canonical tokens/primitives. Keep Dashboard/Widget CSS isolated from Toolbox/Studio CSS.

### Provisional health score

| Dimension | Score | Source-based evidence |
|---|---:|---|
| Accessibility | 2/4 | Custom controls have test coverage, but keyboard, focus, screen-reader, and real contrast verification were not performed. |
| Performance | 2/4 | Large global stylesheets and component catalogs exist; no browser profiling or bundle measurement was run. |
| Theming | 2/4 | Palette/tokens exist, but parallel Studio control styling and literal colors remain in production files. |
| Responsive design | 2/4 | Responsive rules and contract tests exist; narrow portrait/landscape behavior was not exercised live. |
| Implementation integrity | 2/4 | Canonical Toolbox/SubToolbox exists alongside Studio UI controls, compatibility CSS, a global SubToolbox bridge, and catalog-only styling. |
| **Total** | **10/20** | **Provisional: substantial consolidation and runtime verification required.** |

## Verified architecture and evidence

### Canonical foundation to preserve

- `src/components/Toolbox.tsx` — main Toolbox structure and header behaviors.
- `src/components/subtoolbox/SubToolboxPrimitives.tsx` — canonical control primitives.
- `src/components/subtoolbox/SubToolboxLayouts.tsx` — Stack, Grid, Actions, and Section layout recipes.
- `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx` — split-left and compound action primitives.
- `src/components/subtoolbox/tokens.ts` — component-level size and geometry variables.
- `src/styles/toolboxPalette.ts` — palette and color-pair logic.
- `src/styles/toolbox-system.css` and `src/styles/subtoolbox-system.css` — shell and primitive styling authority.
- `src/styles/toolbox-entry.css` — intended canonical CSS entry point.
- `src/styles/cssOwnershipContract.test.ts` and `src/styles/cssRuntimeIsolationContract.test.ts` — existing ownership and import-boundary contracts.
- `src/components/ToolboxUIReferenceLibrary.tsx`, `src/components/UIReferenceLibraryContent.tsx`, and `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` — library/certification surface.

The canonical Toolbox entry currently imports `toolbox-system.css` and `subtoolbox-system.css`. The ownership tests explicitly protect separation between Toolbox and Dashboard/widget CSS. Keep that boundary.

### Main consolidation risks

1. **Large SubToolbox stylesheet:** `src/styles/subtoolbox-system.css` is approximately 215 KB. This is not proof that all rules are redundant; it is a clear target for selector inventory, ownership classification, and safe decomposition.
2. **Parallel Studio control styles:** `src/styles/studio-control-system.css` defines a second attribute-scoped input/select/textarea style contract (44px standard, 32px compact, 56px action; 3px stroke; 8px radius; 4px shadow) that overlaps geometry and styling already expressed by SubToolbox tokens/primitives. Determine whether each consumer is a migration compatibility case or a legitimate distinct component before removing it.
3. **Multiple split/action CSS surfaces:** `subtoolbox-split-primitives.css`, `studio-split-left-consistency.css`, and split/action rules within `subtoolbox-system.css` require a selector-by-selector ownership map. Do not assume these files are duplicates based on names alone.
4. **Global bridge / entry overlap:** `src/index.css` imports `subtoolbox-system.css` directly, while `toolbox-entry.css` imports it as part of the canonical entry. Existing runtime-isolation tests label the index import as migration debt. Inventory direct consumers before removing the bridge; CSS bundler de-duplication is not a substitute for an ownership contract.
5. **Separate Studio UI family:** `src/components/ToolboxUISystem.tsx` defines `ROW_CONTROL_THEMES`, `CONFIG`, `UI_CONSTANTS`, and multiple demos alongside imports of `StandardButton`, `StandardInput`, `StandardDropdown`, and SubToolbox tokens. Audit each live consumer; migrate production controls to canonical primitives or document an explicit exception.
6. **Large catalog-only CSS:** `src/components/studio-hub/studio-hub-complete-primitive-catalog.css` is approximately 110 KB. It belongs to the frozen component-library/certification baseline. It must not be treated as production CSS to merge wholesale, nor should `StudioHubCompletePrimitiveCatalog.tsx` be edited as part of this plan.
7. **Additional specialized stylesheets:** `studio-hub-primitive-migration-catalog.css`, `studio-hub-production-button-catalog.css`, `subtoolbox-workflow-primitives.css`, `project-manifestation.css`, and `vault-asset-module.css` need classification as production primitive, catalog-only, feature recipe, or domain-specific styling. Keep legitimate specialized presentation while removing duplicated base geometry.
8. **Literal geometry and colors:** source samples show literal black borders and color fallbacks in primitive styles. Some are intentional high-contrast defaults; migrate only repeated design values that belong to tokens. Preserve contrast and fallback behavior.
9. **Overlapping token families:** main Toolbox and SubToolbox are different structural levels and must remain distinct. Main desktop shell is 80px/5px/16px/10px/26px; SubToolbox desktop shell is 56px/4px/12px/6px/20px. Mobile shell dimensions differ intentionally. Do not flatten them into one geometry preset.
10. **Frozen/demo versus production:** the complete primitive catalog is a certification baseline, while the migration catalog demonstrates production reuse. Their CSS and counts must remain separately classified in audits and registries.

## Severity-ranked findings

### [P1] CSS authority overlaps without a complete consumer/selector map
- **Location:** `src/styles/subtoolbox-system.css`, `src/styles/studio-control-system.css`, `src/styles/subtoolbox-split-primitives.css`, `src/styles/studio-split-left-consistency.css`.
- **Category:** Implementation integrity / Theming.
- **Impact:** A small visual fix can be overridden by a second stylesheet or only reach some consumers, leading to drift and unpredictable future edits.
- **Recommendation:** Build a selector-level ownership ledger: selector, defining file, importing entry, consumers, token source, specificity/cascade role, tests, and disposition. Merge only after parity tests.
- **Suggested action:** targeted audit and consolidation plan; no blind file concatenation.

### [P1] SubToolbox global bridge has not been retired
- **Location:** `src/index.css` direct import of `subtoolbox-system.css`; `src/styles/toolbox-entry.css`.
- **Category:** Implementation integrity.
- **Impact:** Styles can be reachable outside the intended canonical entry point, making runtime ownership and CSS removal harder to reason about.
- **Recommendation:** Inventory all direct and indirect imports, move consumers to the canonical entry, verify CSS ownership/runtime tests, then remove the bridge in a separate commit.

### [P1] Parallel Studio control family may reimplement canonical fields
- **Location:** `src/styles/studio-control-system.css`, `src/components/ToolboxUISystem.tsx`, `src/studio-ui/**`.
- **Category:** Implementation integrity / Theming.
- **Impact:** Input sizing, colors, shadows, focus and disabled states can diverge between Studio tools and standard SubToolbox controls.
- **Recommendation:** Map each live consumer to canonical primitives; port missing behavior as a variant or compound component; retain only documented compatibility adapters and catalog examples.

### [P2] Large stylesheets are not yet safely decomposed
- **Location:** `src/styles/subtoolbox-system.css` (~215 KB); `studio-hub-complete-primitive-catalog.css` (~110 KB, catalog-only).
- **Category:** Performance / Maintainability.
- **Impact:** Harder to trace cascade and selector ownership, and more risk when changing a shared rule. Actual runtime cost is not measured.
- **Recommendation:** Extract by ownership layer and family with no behavior changes first. Measure before deleting or lazy-loading rules.

### [P2] Canonical token coverage and literal values need a quantified audit
- **Location:** `SubToolboxPrimitives.tsx`, `SubToolboxSplitPrimitives.tsx`, CSS files and `ToolboxUISystem.tsx`.
- **Category:** Theming.
- **Impact:** Shared adjustments may require many edits, and equivalent controls may render differently.
- **Recommendation:** Report repeated declarations for height, stroke, radius, shadow, type, gap, palette, focus, disabled, and responsive rules. Move only true shared values to token authority.

### [P2] Runtime responsive and accessibility certification is incomplete
- **Location:** custom dropdowns/toggles, action groups, upload/file targets, reference-library previews.
- **Category:** Accessibility / Responsive.
- **Impact:** Source-level correctness cannot establish usable keyboard interaction, screen-reader state announcements, contrast, or mobile wrapping.
- **Recommendation:** Run one bounded desktop + narrow portrait + landscape pass after structural changes, then keyboard/screen-reader checks and targeted fixes.

### [P3] Inventory and generated component registry can drift
- **Location:** `STUDIO_HUB_COMPONENT_LIBRARY_COMPONENT_INDEX.md`, component family registry, reference library.
- **Category:** Implementation integrity.
- **Impact:** Developers may add duplicate controls or believe a prototype is production-canonical.
- **Recommendation:** Keep registry generation tied to production family registration and label prototype, migration, compatibility, and canonical states distinctly.

## Positive findings to preserve

- The code already has a canonical Toolbox entry point and separate shell/primitive files.
- Component-level tokens and palette-pair behavior are established.
- Layout recipes (`SubToolboxStack`, `SubToolboxGrid`, `SubToolboxActions`, `SubToolboxSection`) provide a strong reusable composition layer.
- CSS ownership and runtime isolation tests already encode important boundaries.
- The UI Reference Library separates a frozen visual baseline from a production/migration track.
- Existing documentation explicitly warns against turning standalone HTML libraries into competing production authority.
- Dashboard/widget CSS isolation is intentional and must survive the consolidation.

## Required selector/consumer inventory

For every stylesheet and major control family, record:

- CSS file and byte size;
- import path(s) and runtime entry point;
- selectors and their production consumers;
- token/default owner;
- overlapping selectors or repeated declarations;
- whether the style is production, compatibility, feature-specific, catalog-only, or legacy;
- existing test/visual fixture;
- proposed disposition: KEEP / MERGE / REPLACE WITH TOKEN / MIGRATE CONSUMERS / CATALOG-ONLY / REMOVE AFTER ZERO CALLERS;
- evidence and verification status.

## Recommended next steps

1. Create the selector and import ownership ledger before changing CSS.
2. Define canonical token ownership and variants for shell, controls, split actions, labels, fields, tags, status, and responsive behavior.
3. Migrate the Studio control family and direct SubToolbox bridge in small vertical slices.
4. Consolidate duplicate split-left/action rules only after targeted parity tests.
5. Reduce production CSS in measured batches; do not count catalog-only CSS as removable production debt.
6. Run CSS parse, ownership/runtime isolation, component tests, typecheck, production build, and bounded visual/a11y verification.

**No production code was changed by this audit.**
