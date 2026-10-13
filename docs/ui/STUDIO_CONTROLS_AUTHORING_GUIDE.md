# Studio Controls Authoring Guide

**Status:** Canonical implementation guide  
**Scope:** Studio Hub controls, primitives, shared CSS tokens, and the Component Library.

## Canonical authoring locations

- **React primitives and public props:** `src/studio-ui/primitives/StudioControls.tsx`
- **All Studio Control styling, states, sizing, typography, motion, and focus:** `src/styles/studio-control-system.css`
- **Public exports:** `src/studio-ui/index.ts`
- **Component Library demonstrations:** `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` and its catalog stylesheet
- **Governance tests:** `src/components/SubToolboxDesignGovernance.test.ts`

Do not author Studio controls in `src/components/subtoolbox/SubToolboxPrimitives.tsx` or style them in `src/styles/subtoolbox-system.css`. Those files remain the authority for Toolbox/SubToolbox-only primitives. Compatibility exports may remain there, but must delegate to Studio Controls and must not contain a second implementation or duplicate style block.

## Required workflow

1. Search the existing Studio Controls exports and Component Library before creating a new primitive.
2. Extend the existing primitive when its semantic purpose matches; otherwise add a named primitive or a variant with a documented prop contract.
3. Put the implementation in `StudioControls.tsx`; put its visual rules in `studio-control-system.css`. Do not put visual rules inline or create catalog-only replicas.
4. Use `data-vt-studio-control="true"`, semantic data attributes, and the shared `data-size` contract. Let the nearest toolbox pair supply colors through `--pair-a` and `--pair-b`.
5. Keep standard and compact sizes synchronized with `STUDIO_COMPONENT_SIZE_DEFAULTS` and the CSS tokens. Confirmed sizes are **44px standard** with a 3px stroke and **28px compact** with a 2px stroke. Standard type is 32px / weight 1000; compact type is 14px / weight 1000. Do not add conflicting later overrides.
6. Use shared implementations in the Component Library. Show standard and compact specimens when supported; compact examples should be two-across on wide layouts and stack on narrow screens.
7. Preserve compatibility names only as wrappers/re-exports. Move styles to the canonical stylesheet before removing legacy rules.
8. Add governance tests for canonical ownership, size tokens, typography, accessible roles/labels, and removal of duplicate SubToolbox CSS.
9. Run focused Vitest tests, typecheck, and production build. Inspect 44px and 28px renderings, including focus, disabled, selected, and reduced-motion states.

## Confirmed primitive mapping

| Public name | Purpose |
| --- | --- |
| `Studioinput` / `StudioInput` | Standard/compact text input |
| `Studioarea` / `StudioTextArea` | Standard/compact multiline input |
| `Studiotoggle` | Word-based toggle with a measured active-word indicator |
| `Studioswitch` | Switch control |
| `Studioradio` | Radio choice |
| `Studiocheck` | Check-mark choice |
| `Studioxbox` | X-mark choice |

The Component Library must render production exports, not reimplement their markup or styling.

## Legend Multi dropdown

`StudioLegendMultiDropdown` belongs to the canonical Studio Controls family. Keep its trigger, option rows, and clear action aligned to the same size token. The standard specimen is full-width at 44px; compact 28px specimens appear two-across on wide layouts and stack on narrow screens. Avoid duplicate selectors that silently override its type scale.

## Completion checklist

- [ ] Primitive is exported from `StudioControls.tsx` and `src/studio-ui/index.ts`.
- [ ] Studio-owned CSS exists only in `studio-control-system.css`.
- [ ] Component Library renders the production primitive.
- [ ] No conflicting 44px/28px font-size, weight, border, or radius overrides remain.
- [ ] Existing SubToolbox consumers work through compatibility exports or have been migrated.
- [ ] Tests, typecheck, and production build pass.
- [ ] The PR documents what moved, why, and any remaining compatibility wrappers.
