# ViewTube Complete Toolbox & SubToolbox Primitive/Component Migration Plan

## Objective
Replace and synchronize the current toolbox/subtoolbox primitives and components across three authoritative source systems: `motionvisual/viewtubebuild`, `viewtube-dev/viewtube` main, and the two newest attached HTML libraries.

This is a design-system migration, not a visual reskin.

## Source authority
- Source A — `motionvisual/viewtubebuild`
- Source B — current `viewtube-dev/viewtube` main branch
- Source C1 — newest desktop HTML library
- Source C2 — newest mobile HTML library
- Older HTML libraries are not authoritative.

## Phase 1 — Census and canonical numbering
1. Inventory every family in all three systems.
2. Separate semantic component families from implementation exports.
3. Align identical titles/families across desktop, mobile, and code.
4. Assign one canonical numerical ID per semantic family.
5. Keep source-specific ordering from redefining canonical order.
6. Record missing implementations and source-specific variants.
7. Produce the canonical census and renumbering matrix.

## Phase 2 — Per-component design decisions
For every canonical component:
- Compare A/B/C designs.
- Choose A, B, C, AB, AC, BC, ABC, VARIANT, or NEW.
- Decide whether it participates in the Level system.
- Decide supported/default Level.
- Decide default size and supported sizes.
- Decide tokens.
- Decide typography, including font size, weight, line height and letter spacing.
- Decide stroke, radius, shadow, fill, icon geometry and spacing.
- Decide composition and internal anatomy.
- Decide states and interaction behavior.
- Decide responsive behavior.
- Decide accessibility behavior.
- Decide whether differences are variants or separate families.
- Record rejected source elements and rationale.

## Phase 3 — Global standards
### Level
Do not force every component into Level. Each family is explicitly classified as Level-aware, Size-aware, both, or neither.

### Size
Establish canonical default sizes while allowing components to adapt beyond defaults where composition requires it.

### Split-left
Create one canonical split-left contract covering rail width, rail/label boundary, icon size/stroke, label typography, height, radius, shadow, states and responsive behavior.

### Typography
Establish family defaults rather than allowing arbitrary per-consumer values.

### Tokens
Separate global design tokens from toolbox, subtoolbox, component and variant tokens.

## Phase 4 — Library reconstruction
1. Rebuild primitive foundations.
2. Rebuild canonical component families.
3. Remove duplicate geometry definitions.
4. Make feature/tool components consume canonical primitives rather than redefining geometry.
5. Update the toolbox and subtoolbox shells.
6. Update Studio Hub consumers.

## Phase 5 — Studio Hub migration
Audit every Studio Hub toolbox/subtoolbox and replace legacy primitive/component usages with canonical families. Preserve each tool's intended workflow and single primary function.

## Phase 6 — Unusual components
Components with unusual anatomy, media behavior, workflow behavior, data presentation or specialized controls receive individual design records rather than being forced into generic patterns.

## Phase 7 — Visual and implementation validation
- Build visual comparison pages.
- Test every canonical family at its default and supported sizes.
- Test Level combinations where applicable.
- Test split-left consistency.
- Test desktop/mobile behavior.
- Run accessibility checks.
- Run implementation/TDD gates for behavior changes.
- Perform visual regression review.

## Phase 8 — Three-system synchronization
Update all three systems from the canonical decision records, document intentional source divergence, and retire superseded implementations only after consumers migrate.

## Required durable artifacts
- `VIEWTUBE_CANONICAL_COMPONENT_CENSUS_AND_RENUMBERING_MATRIX.md`
- `VIEWTUBE_COMPONENT_DESIGN_DECISION_MATRIX.md`
- `VIEWTUBE_COMPONENT_TOKEN_SYSTEM.md`
- `VIEWTUBE_PRIMITIVE_LIBRARY_MIGRATION.md`
- `VIEWTUBE_COMPONENT_LIBRARY_MIGRATION.md`
- `VIEWTUBE_STUDIO_HUB_COMPONENT_MIGRATION.md`
- `VIEWTUBE_SPLIT_LEFT_COMPONENT_STANDARD.md`
- `VIEWTUBE_COMPONENT_DEPRECATION_MAP.md`
- `VIEWTUBE_COMPONENT_VISUAL_REGRESSION_MATRIX.md`
- `VIEWTUBE_CANONICAL_COMPONENT_SYSTEM.md`

## Decision gate
No implementation replacement should be treated as canonical until its family has a completed decision record. Ambiguous or genuinely novel components go through a GrillMe/design decision gate before implementation.

## Current Phase 1 finding
The census establishes 152 desktop families, 133 mobile families, a 154-family canonical union, and 84 main-branch registry entries. The current main branch also has dedicated primitive files for core controls, split controls, media, workflow and layouts.

Source A remains pending source recovery where the connected GitHub source is not readable; it must not be guessed.