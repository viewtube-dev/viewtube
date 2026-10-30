# Studio Controls System Audit — Task List

Source: `tasks/studio-controls-audit/plan.md`  
Target: `master/consolidated-feature-integration`  
Mode: Audit-first; no production edits before Gate 6 approval.

## Phase 0 — Target and preservation
- [ ] T0.1 Confirm repository, target HEAD, working tree, instructions, test/build commands, and browser tooling.
- [ ] T0.2 Confirm active Confirmed catalog, shell routes, and legacy/comparison track consumers.
- [ ] T0.3 Read current Studio hierarchy, library source of truth, defaults/exception index, import inventory, authoring guide, palette/theme, and emitter instructions.

### Checkpoint 0
- [ ] One explicit target ref recorded; existing user work preserved; current authority files confirmed.

## Phase 1 — File and dependency inventory
- [ ] T1.1 Enumerate all files under `src/studio-ui/`.
- [ ] T1.2 Enumerate all Studio-related files under `src/styles/` and build the CSS import/cascade graph.
- [ ] T1.3 Enumerate Studio-related files under `src/components/`, including catalog, shell, consumers, and compositions.
- [ ] T1.4 Trace token/theme/emitter/generated CSS ownership and validation scripts.
- [ ] T1.5 Classify all files by production, composition, catalog, generated, test, compatibility, deprecated, or unknown ownership.

### Checkpoint 1
- [ ] Complete file inventory and reproducible import/style dependency graph.

## Phase 2 — Primitive registry
- [ ] T2.1 Extract component/export inventory and reconcile barrels, aliases, wrappers, and compatibility exports.
- [ ] T2.2 Trace production consumers and determine public/internal/deprecated/dead status.
- [ ] T2.3 Classify all live families into the six canonical categories.
- [ ] T2.4 Record each family's API, supported tiers, variants, states, anatomy, responsive/accessibility constraints, and exceptions.

### Checkpoint 2
- [ ] Registry distinguishes production capabilities from exports, aliases, fixtures, and dead code.

## Phase 3 — Token and style audit
- [ ] T3.1 Compare token and theme sources against canonical global contracts.
- [ ] T3.2 Verify generated CSS emitter/output consistency.
- [ ] T3.3 Audit shared and family styles for cascade, duplication, hard-coded values, `!important`, focus, geometry, motion, split seams, and selector leakage.
- [ ] T3.4 Verify five-tier support and field/split/family-specific contracts.
- [ ] T3.5 Audit exception ownership, scope, tests, verification status, and exit conditions.

### Checkpoint 3
- [ ] Contradiction matrix records evidence, authority, impact, and narrowest owner.

## Phase 4 — Library completeness
- [ ] T4.1 Map every Confirmed catalog specimen to a real production implementation/export.
- [ ] T4.2 Build bidirectional registry/catalog crosswalk and classify coverage gaps.
- [ ] T4.3 Verify six-category order and family placement.
- [ ] T4.4 Verify one canonical representative per primitive and accurate variant/state specimens.
- [ ] T4.5 Verify specimen provenance, defaults/non-default settings, supported tiers, and production-import boundaries.

### Checkpoint 4
- [ ] Every eligible primitive has exactly one canonical representative; all extra specimens map to supported variants/states.

## Phase 5 — Technical and visual audit
- [ ] T5.1 Run technical accessibility, responsive, performance, theming, and implementation-integrity audit.
- [ ] T5.2 Test keyboard, focus, disabled/selected/expanded states, labels/errors, touch targets, and reduced motion.
- [ ] T5.3 Inspect desktop/tablet/mobile portrait/mobile landscape and key overflow/split/menu cases.
- [ ] T5.4 Capture and inspect representative computed-style and browser screenshots; record exact verified combinations.

### Checkpoint 5
- [ ] Findings are evidence-backed and source/API/computed-style/browser verification levels are distinct.

## Phase 6 — Findings and approval
- [ ] T6.1 Produce file inventory, primitive registry, contradiction matrix, catalog crosswalk, and P0–P3 findings.
- [ ] T6.2 Separate safe fixes from product-contract decisions and identify dependencies.
- [ ] T6.3 Break approved fixes into 1–5-file implementation slices.
- [ ] T6.4 Present audit report and implementation backlog for approval.

### Approval gate
- [ ] User approves implementation scope before any production code/style/catalog changes.

## Phase 7 — Approved implementation (follow-on)
- [ ] T7.1 Repair canonical token/primitive/style owners and remove proven-obsolete drift.
- [ ] T7.2 Regenerate generated CSS through the emitter.
- [ ] T7.3 Complete Confirmed catalog representatives and supported variant/state specimens.
- [ ] T7.4 Reconcile category grouping and preserve routed legacy tracks until safe retirement.
- [ ] T7.5 Synchronize canonical docs, exception index, authoring guide, and import inventory.
- [ ] T7.6 Add registry, export, token, CSS, interaction, and regression tests.
- [ ] T7.7 Run focused tests, typecheck/lint, production build, and browser certification.

### Final checkpoint
- [ ] All in-scope files classified.
- [ ] All eligible production primitives represented exactly once.
- [ ] All supported variants/states represented accurately.
- [ ] No misleading or unsupported catalog claims.
- [ ] Tests/build pass with pre-existing failures distinguished.
- [ ] Desktop/mobile visual and accessibility evidence recorded.
- [ ] Remaining risks and unverified cases documented.
