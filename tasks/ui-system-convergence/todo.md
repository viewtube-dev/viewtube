# UI System Convergence — Task List

**Plan:** `tasks/ui-system-convergence/plan.md`  
**Audit:** `docs/ui/VIEWTUBE_TOOLBOX_SUBTOOLBOX_STUDIO_UI_CSS_CONSOLIDATION_AUDIT_2026-10-13.md`  
**Branch:** `master/consolidated-feature-integration`  
**Status:** Planning only — no implementation tasks completed by this document.

## Phase 0 — Inventory

- [ ] UIC-1.1 — Build full CSS import graph across application, route, Toolbox, SubToolbox, Studio, Widget, and catalog entry points.
- [ ] UIC-1.2 — Build selector/token overlap ledger with consumers, ownership, specificity, tests, and proposed disposition.
- [ ] UIC-1.3 — Inventory live consumers of `ToolboxUISystem.tsx`, `data-vt-studio-control`, and Standard* controls.
- [ ] UIC-1.4 — Classify all stylesheets as canonical production, compound recipe, feature layout, catalog-only, compatibility, or legacy.

### Checkpoint A
- [ ] No CSS removal proposal based only on filename, size, or similarity.
- [ ] Every candidate duplicate has a consumer list and parity test plan.
- [ ] Dashboard/Widget and Toolbox/Studio entry-point boundaries are documented.

## Phase 1 — Canonical contracts

- [ ] UIC-2.1 — Publish the canonical token/default ownership table.
- [ ] UIC-2.2 — Map desktop/mobile and main Toolbox/SubToolbox structural geometry separately.
- [ ] UIC-3.1 — Map each primitive/compound family to its production implementation and consumers.
- [ ] UIC-3.2 — Classify each Studio UI control as migrate, variant, compose, compatibility, catalog-only, or deprecate.

### Checkpoint B
- [ ] Each shared style value has one canonical owner.
- [ ] Every new variant has a concrete consumer and test.
- [ ] Frozen `StudioHubCompletePrimitiveCatalog.tsx` remains untouched.

## Phase 2 — Entry point and consumer migration

- [ ] UIC-4.1 — Normalize eligible imports to the canonical Toolbox entry.
- [ ] UIC-4.2 — Remove the global SubToolbox bridge only after all direct consumers are certified.
- [ ] UIC-5.1 — Migrate live Studio input/textarea/select/button/dropdown consumers to canonical primitives or explicit variants.
- [ ] UIC-6.1 — Converge split-left/action CSS only after selector-level parity tests.

### Checkpoint C
- [ ] CSS ownership and runtime-isolation tests pass.
- [ ] Standalone SubToolboxes still render correctly.
- [ ] Split-left rail/divider/palette/selected/disabled/focus/mobile behavior matches the approved contract.

## Phase 3 — CSS reduction

- [ ] UIC-7.1 — Tokenize repeated geometry and state styling in production feature CSS.
- [ ] UIC-7.2 — Preserve legitimate domain-specific calendar, asset, chart, and media layouts.
- [ ] UIC-8.1 — Remove selectors/files only with zero-caller evidence and a recorded migration receipt.
- [ ] UIC-8.2 — Capture before/after CSS byte counts, selector counts, duplicate declarations, and build output.

### Checkpoint D
- [ ] No dead CSS removed without evidence.
- [ ] No catalog-only CSS is accidentally loaded as production authority.
- [ ] CSS reduction measurements are recorded; performance gains are not claimed without profiling.

## Phase 4 — Reference library and certification

- [ ] UIC-9.1 — Reconcile the production component registry/index with actual canonical primitives.
- [ ] UIC-9.2 — Keep frozen baseline, production migration examples, and proposed examples separately labeled.
- [ ] UIC-10.1 — Run CSS parse and ownership/runtime isolation tests.
- [ ] UIC-10.2 — Run relevant component tests, `npm run typecheck`, `npm run build`, and broader tests.
- [ ] UIC-10.3 — Verify desktop, narrow portrait, landscape, keyboard focus, and screen-reader state for custom controls.
- [ ] UIC-10.4 — Publish final results and remaining exception/compatibility ledger.

### Final checkpoint
- [ ] One documented token/primitive authority and understandable CSS import graph.
- [ ] No unverified CSS deletion or unresolved production consumer migration.
- [ ] No new test, typecheck, or build failures against the chosen integration baseline.
- [ ] Dashboard/Widget CSS isolation retained.
- [ ] Frozen certification catalog unchanged.
- [ ] Final report records actual test/runtime evidence and measurable CSS reduction.
