# Implementation Plan: Toolbox / SubToolbox / Studio UI System Convergence

**Date:** 2026-10-13  
**Target branch:** `master/consolidated-feature-integration`  
**Status:** PROPOSAL — planning only; no implementation authorized by this document  
**Audit:** `docs/ui/VIEWTUBE_TOOLBOX_SUBTOOLBOX_STUDIO_UI_CSS_CONSOLIDATION_AUDIT_2026-10-13.md`

## Goal

Converge Toolbox, SubToolbox, Studio controls, component primitives, defaults, text/label treatments, palette rules, layout recipes, and CSS into **one governed ViewTube UI system**. Reduce duplicate CSS and parallel control implementations without erasing legitimate tool-specific visuals or changing behavior unintentionally.

"One system" means one token/primitive/variant authority and explicit CSS ownership—not one giant stylesheet, not one universal component with dozens of unrelated flags, and not identical screens for every tool.

## Non-negotiable constraints

1. Target only `master/consolidated-feature-integration`; do not edit `main` or deploy from this plan.
2. `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` and its frozen certification baseline are immutable during this work. Catalog-only CSS is not presumed to be production CSS debt.
3. Preserve the structural distinction between main Toolbox and SubToolbox, including their different desktop/mobile geometry contracts.
4. Preserve palette-pair semantics, component size levels, split-left anatomy, existing interactions, accessibility semantics, and saved user state.
5. Keep Dashboard/Widget CSS isolated from Toolbox/Studio CSS. Do not combine `widget-entry.css` and `toolbox-entry.css`.
6. Do not delete a stylesheet or component until imports, consumers, tests, and runtime reachability are inventoried and zero-caller certification is recorded.
7. Do not perform a whole-file CSS merge or mass selector replacement. Use focused selector/family migrations with visual parity tests.
8. Existing production primitives win over standalone HTML/prototype styling. Promote prototype details only through an explicit component contract and certification.
9. Prefer extending an existing primitive with a variant or building a compound component from canonical primitives over copying its markup/CSS.
10. No runtime or appearance claims count as verified without actual tests or visual/runtime evidence.

## Desired end state

- One canonical Toolbox entry point and clear CSS import graph.
- One token source for shared geometry, typography, spacing, palette, focus, disabled, motion, and responsive defaults.
- One canonical primitive per control family; distinct anatomy only when a real variant or purpose justifies it.
- Compound controls are compositions of canonical primitives and layout recipes.
- Feature-specific styles contain only domain behavior/layout, not copied base control geometry.
- Compatibility CSS is explicitly temporary and has a tracked exit criterion.
- Reference-library, frozen certification, migration demos, and production components are visibly distinguished.
- CSS reduction is measured by removed duplicate selectors/declarations and unreachable code, not just fewer files or fewer lines.

## Architecture / ownership model

```
Design tokens + palette
        |
        v
Canonical shell CSS + primitive CSS
        |
        +--> Toolbox / SubToolbox shell components
        |
        +--> Primitive families (input, textarea, select, buttons,
        |    split-left, toggle, checkbox/radio, tags, badges, upload,
        |    status/state panels, dropdowns)
        |
        +--> Compound components + layout recipes
        |
        +--> Tool-specific content and behavior (no copied base geometry)
        |
        +--> UI Reference Library / production certification examples
```

CSS ownership layers:

1. Tokens/defaults and palette.
2. Main Toolbox and SubToolbox shell structure.
3. Primitive-family anatomy and interaction states.
4. Compound recipes and layout composition.
5. Feature-specific layout/visualization only.
6. Catalog-only CSS and frozen reference surfaces, isolated from production authority.
7. Temporary compatibility CSS, with a named owner, consumer list, and removal checkpoint.

## Capability map and build order

| ID | Work package | Depends on | Outcome |
|---|---|---|---|
| UIC-1 | Source, selector, import, and consumer inventory | None | Evidence-based migration ledger |
| UIC-2 | Canonical token/default contract | UIC-1 | Shared values have one owner |
| UIC-3 | Primitive and compound-component contract map | UIC-1, UIC-2 | One canonical component per family/variant |
| UIC-4 | Entry-point and compatibility bridge migration | UIC-1 | Canonical CSS loading path with verified consumers |
| UIC-5 | Studio control-family migration | UIC-2, UIC-3 | Production controls use canonical primitives |
| UIC-6 | Split-left/action CSS convergence | UIC-1, UIC-2, UIC-3 | Duplicate declarations removed safely |
| UIC-7 | Feature CSS tokenization and consolidation | UIC-2, UIC-3 | Feature CSS owns layout, not primitive chrome |
| UIC-8 | Dead-code/legacy CSS retirement | UIC-4 through UIC-7 | Only certified unreachable CSS is removed |
| UIC-9 | UI Reference Library and registry parity | UIC-3, UIC-5 through UIC-8 | Library matches production authority |
| UIC-10 | Full verification and release report | All | Reproducible evidence for readiness |

## Phases and tasks

### Phase 0 — Inventory before editing

#### Task UIC-1.1: Build stylesheet import graph
- Enumerate every CSS file under `src`, importers, transitive imports, runtime entry points, and route-level lazy boundaries.
- Identify direct import of `subtoolbox-system.css` from `src/index.css` and every consumer of `toolbox-entry.css`.
- Identify any component importing feature/catalog CSS globally.
- Acceptance:
  - [ ] Every stylesheet has one or more documented import paths or is explicitly marked unreferenced.
  - [ ] Toolbox and Dashboard/Widget ownership remain isolated.
  - [ ] No deletion proposal is based on filename or file size alone.

#### Task UIC-1.2: Build selector and token overlap ledger
- Inventory duplicate/repeated rules for height, stroke, radius, shadow, type scale, spacing, palette, focus, disabled, hover, selected, loading, and responsive behavior.
- Include consumer and specificity/cascade evidence.
- Acceptance:
  - [ ] Each candidate duplicate has a source, consumer list, desired authority, and parity test.
  - [ ] Similar-looking but semantically different selectors are kept distinct until proven equivalent.

**Checkpoint A:** Review the inventory before any production CSS is removed.

### Phase 1 — Canonical contract

#### Task UIC-2.1: Publish token/default ownership table
- Map existing `tokens.ts`, `toolboxPalette.ts`, `uiTokenScale.ts`, CSS custom properties, and compatibility variables.
- Distinguish main Toolbox vs SubToolbox vs inner control geometry and desktop vs mobile defaults.
- Acceptance:
  - [ ] Every shared geometry/style token has exactly one canonical owner.
  - [ ] Aliases are documented where older consumers require them.
  - [ ] Existing desktop/mobile and L0/L1/L2 semantics are preserved.

#### Task UIC-3.1: Publish primitive-family and variant map
- Map existing primitives, compound primitives, layouts, Studio UI controls, reference-library entries, and production consumers.
- Decide KEEP / EXTEND VARIANT / COMPOSE / MIGRATE / CATALOG ONLY / DEPRECATE.
- Acceptance:
  - [ ] No new component is created where an existing primitive or compound component meets the contract.
  - [ ] Frozen certification baseline remains unchanged.
  - [ ] Every proposed new variant has a concrete consumer and test.

**Checkpoint B:** Approve ownership and variants before consumer migration.

### Phase 2 — Migrate consumers in vertical slices

#### Task UIC-4.1: Normalize CSS entry-point usage
- Migrate eligible direct consumers to the canonical entry point.
- Remove the `src/index.css` SubToolbox bridge only after consumer and visual parity proof.
- Acceptance:
  - [ ] All required controls render when loaded through the canonical entry.
  - [ ] CSS runtime isolation and ownership tests pass.
  - [ ] No unintended style loss on routes using standalone SubToolboxes.

#### Task UIC-5.1: Migrate Studio control compatibility family
- Inventory live uses of `data-vt-studio-control`, `ToolboxUISystem.tsx`, `StandardInput`, `StandardButton`, and `StandardDropdown`.
- Replace production field/control duplication with canonical primitives or explicit variants; retain catalog examples and legitimate adapters.
- Acceptance:
  - [ ] All production consumers have a documented disposition.
  - [ ] Input, textarea, select, focus, disabled, and error states match the canonical contract.
  - [ ] No behavior/API change is introduced without a regression test.

#### Task UIC-6.1: Converge split-left and action styles
- Compare `subtoolbox-split-primitives.css`, `studio-split-left-consistency.css`, and split/action selectors in `subtoolbox-system.css`.
- Port unique behavior to the owning primitive/variant, then remove duplicate rules in small commits.
- Acceptance:
  - [ ] Icon rail, label section, divider, stroke, sizing, palette, focus, selected, and disabled behavior pass parity tests.
  - [ ] Mobile wrapping and fixed-width toggle behavior remain correct.

**Checkpoint C:** After each 2–3 migration tasks, run targeted component/CSS tests and inspect a bounded screenshot matrix.

### Phase 3 — Feature stylesheet reduction

#### Task UIC-7.1: Classify feature and catalog CSS
- Classify each stylesheet as primitive authority, compound recipe, feature-specific layout, catalog-only, compatibility, or legacy.
- Migrate repeated primitive geometry to canonical variables; keep unique visualization/layout styles.
- Acceptance:
  - [ ] Feature styles no longer redefine canonical shell/control geometry unless a documented variant requires it.
  - [ ] Catalog-only styles are not loaded as production authority.
  - [ ] Domain-specific media/asset/calendar/chart layouts remain intact.

#### Task UIC-8.1: Retire proven dead CSS
- Remove only selectors/files with zero production consumers, after tests and import graph prove unreachability.
- Acceptance:
  - [ ] Every deletion cites the ledger row and zero-caller evidence.
  - [ ] No file is deleted merely because it is large or has overlapping names.
  - [ ] Existing ownership exceptions are either removed or explicitly retained with rationale.

**Checkpoint D:** Record before/after CSS file sizes, duplicate declaration counts, selector counts, and build output; do not claim performance gains without runtime measurement.

### Phase 4 — Library parity and certification

#### Task UIC-9.1: Reconcile UI Reference Library with production primitives
- Verify every canonical family is registered and rendered from production code/tokens where required.
- Keep frozen baseline and production migration examples separate.
- Acceptance:
  - [ ] Registry and generated component index are consistent.
  - [ ] Proposed/legacy/catalog-only examples are clearly labeled.
  - [ ] The frozen `StudioHubCompletePrimitiveCatalog.tsx` is untouched.

#### Task UIC-10.1: Final verification
- Run targeted tests, `npm run check:css`, CSS ownership/runtime isolation tests, `npm run typecheck`, `npm run build`, and relevant full tests.
- Perform one bounded desktop, narrow portrait, and landscape visual pass; keyboard and screen-reader checks for custom controls.
- Acceptance:
  - [ ] No new test/typecheck/build failures against the chosen integration baseline.
  - [ ] Core shell/control geometry and key states match approved reference examples.
  - [ ] Final report lists actual commands/results, remaining exceptions, CSS reduction measurements, and runtime limitations.

## Definition of done

- Canonical tokens and primitive ownership are documented.
- Production consumers use canonical components or explicitly approved variants.
- CSS entry/import graph is understandable and tested.
- Duplicate selectors/declarations are removed only after parity and reachability checks.
- Dashboard/Widget CSS remains isolated.
- UI Reference Library accurately represents the production system without editing the frozen baseline.
- Desktop/mobile, keyboard/accessibility, state behavior, CSS parsing, tests, typecheck, and build are verified.
- All remaining compatibility/feature exceptions have named owners and exit criteria.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Deleting CSS before caller inventory | Missing or broken UI on rarely visited routes | Selector/import ledger and zero-caller certification |
| Over-consolidating distinct structural levels | Main Toolbox/SubToolbox geometry regresses | Keep separate shell contracts and visual fixtures |
| Moving selectors changes cascade/specificity | Unrelated controls change appearance | Small commits, parity tests, before/after captures |
| Treating catalog CSS as production debt | Reference library breaks or baseline changes | Catalog-only classification; frozen catalog remains immutable |
| Mixing Dashboard and Toolbox CSS | Cross-surface visual regressions | Keep separate entry points and existing isolation tests |
| Replacing Studio controls without API audit | Behavior/accessibility regressions | Consumer map, adapter/variant contracts, focused tests |
| Optimizing only for fewer files | One giant unmaintainable stylesheet results | Optimize for ownership and duplicate rules, not file count |

## Open questions to resolve during inventory

- Which `ToolboxUISystem.tsx` exports are still live production consumers versus demos?
- Which direct `src/index.css` SubToolbox consumers still require the migration bridge?
- Which split-left consistency rules are intentional fixes versus duplicate base styling?
- Which feature stylesheets are truly production-loaded versus lazy/catalog-only?
- What baseline commit and visual fixtures will be used for the final no-regression comparison?
