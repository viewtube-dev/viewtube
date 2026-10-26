# ViewTube Studio design-system reference map

These are the user-designated starting points. Fetch the current version from the actual target branch before relying on them; commit-pinned links are useful historical evidence, while the consolidated integration branch may contain later edits.

## Core implementation

- Studio styles directory, pinned starting point: https://github.com/viewtube-dev/viewtube/tree/7b04d4d34b0b9a515d84c0575b01416ed5e49ff3/src/styles
- Studio primitives directory, pinned starting point: https://github.com/viewtube-dev/viewtube/tree/7b04d4d34b0b9a515d84c0575b01416ed5e49ff3/src/studio-ui/primitives
- Studio tokens: https://github.com/viewtube-dev/viewtube/blob/7b04d4d34b0b9a515d84c0575b01416ed5e49ff3/src/studio-ui/tokens.ts
- Public exports (verify current path and contents): `src/studio-ui/index.ts`

## Normative design-system documentation

- Component Library source of truth: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md
- Values, tokens, styles, settings hierarchy: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md
- Global defaults and exception index: https://github.com/viewtube-dev/viewtube/blob/3c3f37461f6fcc7d43ce01f262bf242a3931fde7/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md
- Component import inventory audit: https://github.com/viewtube-dev/viewtube/blob/3c3f37461f6fcc7d43ce01f262bf242a3931fde7/docs/ui/STUDIO_HUB_COMPONENT_IMPORT_INVENTORY_AUDIT.md

## Other required sources to discover

- Actual 12-color palette definition and theme/pair mapping.
- Canonical token emitter and generated CSS variables, if present on the target branch.
- Active Studio Hub catalog and component family registry.
- Current primitive authoring guide, visual checklist, family-specific contracts, tests, and generated inventory reports.

## Conflict handling

Do not assume every link refers to the same branch state. First inspect the explicit target branch. Use current product decisions and the current hierarchy document to resolve precedence. Record same-level conflicts for a human decision rather than inventing a winner. If code and docs disagree, document the contradiction and trace the owning layer before repairing it.


## Active Mini-size correction

- **Mini control typography and icon size: 17.5px** (not 16px).
- Canonical implementation: `src/studio-ui/tokens.ts` → `STUDIO_CONTROL_SIZE_BASE.mini` and `STUDIO_CONTROL_SIZE_CONTRACT.multiline.miniFontSize`.
- Preserve the existing 20px Mini control height, 1.5px stroke, and 3px radius. This correction changes typography/icon sizing, not the tier's geometry.
- Verify generated CSS variables and primitive consumers after changing tokens; do not hand-edit generated output as a competing source of truth.
