# ViewTube Definitive Component Library

Status: canonical component showcase and style contract.

## Purpose

This is the definitive visual reference for reusable ViewTube components. It shows only the confirmed production primitives, using one standard specimen per component family. The frozen certification baseline is historical comparison material, not a source of default styles.

## Standard component tokens

The canonical token authority is `src/components/subtoolbox/tokens.ts`. Component-family sizing is distinct from the geometry of the outer Toolbox and SubToolbox shells.

| Token | Confirmed default |
|---|---|
| Standard control height | 44px |
| Border/stroke | 3px |
| Corner radius | 8px |
| Shadow offset | 4px |
| Typeface | Inter, with system sans-serif fallbacks |
| Control weight | 1000 |
| Text case | Uppercase for control labels |
| Letter spacing | -0.035em |
| Control line height | 0.86 |
| Color | Canonical ViewTube palette/pair tokens; no component-local substitute palette |

These defaults are sourced from the component-level `l1` DNA and `VIEWTUBE_TYPOGRAPHY` definitions. The outer shell retains its own separate geometry tokens; do not infer shell dimensions from the 44px component control height.

## Rules for library specimens

1. Render each component family once at the standard component level (`l1`).
2. Use the real exported production primitive and its shared styles/tokens. Do not recreate a lookalike in the catalog.
3. Do not show alternate sizes, experimental treatments, or unconfirmed defaults in this definitive showcase.
4. Preserve intrinsic geometry for compound components such as media players, calendars, tables, and asset modules. Their internal controls still use canonical component tokens where supported.
5. Show meaningful states within a family only when needed to explain the component's behavior; states are not additional size variants.
6. Any proposed default change must first be implemented in the canonical token/primitive source and covered by a governance test, then reflected in this library.
7. Keep the frozen hardcoded certification baseline separate and clearly labeled as reference-only. Never copy its hardcoded anatomy into production components.

## Canonical workflow primitives

- `PrimaryButton` is the direct primitive for generation-scope selection, optimization intensity, and downstream-package inclusion choices.
- `SplitLeftButton` is the direct primitive for Project Manifestation's Load / Swap In / Refresh actions and metadata Generate / Refine / Analyze actions.
- `LegendMultiDropdown` is the 09 V2 floating-legend multi-select variant. It uses the shared dropdown state/portal implementation, canonical control tokens, selected-count feedback, checkbox state, scrollable options, and Clear All behavior.
- Channel playlist selection and the Project Load / Swap project selector must use `LegendMultiDropdown`; do not add local one-off dropdown anatomy for those workflows.
- The definitive catalog renders `Legend Multi Dropdown` from the exported production primitive. Its preview is not a separately hardcoded imitation.

## Ownership

- Token authority: `src/components/subtoolbox/tokens.ts`
- Production primitive styles: `src/styles/subtoolbox-system.css`, `src/styles/subtoolbox-split-primitives.css`, and the component-owned styles they import.
- Definitive rendered catalog: `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- Governance tests: `src/components/SubToolboxDesignGovernance.test.ts`

The catalog is not allowed to silently establish a new style. It demonstrates the confirmed token contract; shared primitive/token code remains the source of truth.
