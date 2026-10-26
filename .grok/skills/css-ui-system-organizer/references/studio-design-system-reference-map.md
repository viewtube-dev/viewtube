# ViewTube Studio design-system reference map

> Skill resource copy of [`docs/ui/STUDIO_DESIGN_SYSTEM_REFERENCE_MAP.md`](../../../../docs/ui/STUDIO_DESIGN_SYSTEM_REFERENCE_MAP.md). Keep this file aligned with the canonical repository document.

**Status:** Maintained navigation resource; normative rules remain in the linked hierarchy, token, primitive, and exception sources.  
**Target branch:** `master/consolidated-feature-integration`  
**Purpose:** Give designers and coding agents one verified starting map for ViewTube Studio UI work without creating a parallel design system.

## Source-of-truth rule

Always fetch the current target-branch version of relevant files before implementing or auditing. This map is navigation, not permission to rely on stale snapshots. Resolve conflicts using the current hierarchy document and explicit current product requirements. If two sources at the same authority level conflict, report the conflict instead of guessing.

## Canonical implementation

- **Tokens and control contracts:** [`src/studio-ui/tokens.ts`](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/studio-ui/tokens.ts)
- **Public exports:** [`src/studio-ui/index.ts`](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/studio-ui/index.ts)
- **Production primitives:** [`src/studio-ui/primitives/`](https://github.com/viewtube-dev/viewtube/tree/master/consolidated-feature-integration/src/studio-ui/primitives)
- **Production styles:** [`src/styles/`](https://github.com/viewtube-dev/viewtube/tree/master/consolidated-feature-integration/src/styles)
- **Confirmed primitive catalog:** [`src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx)
- **Palette source:** Locate and verify the active palette/theme implementation and its pair mapping on the current branch; preserve the existing 12-color palette and semantic roles.
- **Generated CSS variables:** Inspect the current imports and generator (including `scripts/emit-studio-control-vars.mjs`, if present) before changing generated output.

## Normative documentation

Read the current target-branch versions of these documents when relevant:

1. [Values, Tokens, Styles & Settings Hierarchy](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md) — ownership and precedence.
2. [Studio Hub Component Library Source of Truth](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md) — canonical component families and production catalog.
3. [Global Defaults and Exception Index](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md) — global contracts and registered exceptions.
4. [Studio Hub Component Import Inventory Audit](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/ui/STUDIO_HUB_COMPONENT_IMPORT_INVENTORY_AUDIT.md) — import/export and consumer inventory, when present.
5. The active primitive authoring guide, palette documentation, family contracts, tests, generated reports, and responsive/accessibility checklists linked by the sources above.

If a referenced path is missing or superseded, inspect the repository and locate the current equivalent. Do not silently treat a missing path as proof that a contract does not exist.

## Design-system ownership boundaries

| Layer | Owns | Must not do |
|---|---|---|
| Product contract / approved override | Explicit current requirements for the exact concern | Override unrelated contracts implicitly |
| Hierarchy documentation | Source precedence and change control | Replace implementation evidence |
| Tokens and palette/theme | Semantic roles, numeric values, size tiers, pair mapping | Encode page-specific layout |
| Shared primitives | Markup, behavior, accessible semantics, data attributes | Fork the design system inside a page |
| Shared/family production CSS | Visual presentation and narrowly scoped registered exceptions | Create competing global rules |
| Page/feature composition | Content hierarchy, placement, responsive layout | Redefine primitive anatomy, color, stroke, typography, or interaction |
| Catalog/showcase/tests | Production-backed examples, verification, fixtures | Become a second production implementation |

## Page redesign workflow

1. Inspect the target branch, page component tree, routes, handlers, data contracts, and responsive behavior.
2. Map each control to an existing public production export; confirm the required size, state, and anatomy are supported.
3. Compose the page using approved components. Page CSS is for layout and responsive arrangement only.
4. Preserve existing behavior, permissions, validation, loading/error/empty states, keyboard behavior, and mobile-safe-area handling.
5. If an essential capability is missing, document the gap and switch to the explicitly authorized primitive/component workflow. Do not create a lookalike control in page CSS.
6. Run applicable tests/build checks and inspect rendered desktop and mobile states before claiming visual certification.

## Primitive or design-system change workflow

1. Search exports, primitive implementations, consumers, family styles, tests, catalog registration, and docs before adding anything.
2. State the missing capability and define anatomy, API, supported sizes/variants, palette roles, states, accessibility, and responsive behavior.
3. Trace ownership and resolve conflicts before editing. Update the canonical owner rather than layering overrides over a symptom.
4. Register exceptions with a named owner, rationale, exact scope, tests, and an entry in the global defaults/exception index.
5. Update exports, production styles, generated outputs through their generator, catalog specimens, import inventory, docs, and regression tests as applicable.
6. Verify with focused tests, typecheck/build, and browser visual checks. Report checks that were not run.

## Non-negotiable constraints

- Preserve ViewTube's existing 12-color palette and actual semantic palette pairings; do not introduce arbitrary product colors or a replacement palette.
- Reuse actual production exports; catalog examples must import the real primitive.
- Do not create duplicate primitive implementations or parallel token/style sources.
- Keep page styles layout-only; keep primitive geometry and states owned by their canonical implementation.
- Treat undocumented drift, stale screenshots, and old commit-pinned references as evidence to investigate, not as authority.
- Never claim a test, build, accessibility audit, screenshot inspection, or browser verification that was not actually performed.

## Skill integration

The repository skill resource copy is maintained at `.grok/skills/css-ui-system-organizer/references/studio-design-system-reference-map.md`. Keep it aligned with this document. The skill must link this map and require reading it before Studio UI redesign, audit, or implementation work.
