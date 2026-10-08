# ViewTube Primitive System Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or superpowers:subagent-driven-development) to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Stabilize the current ViewTube primitive set by making component defaults and structural geometry explicit, consolidating primitive CSS ownership, and removing competing/contradictory overrides before adding new primitives or compound controls.

**Architecture:** 65 remains the primary geometry authority; 66 remains the split-placement/anatomy authority. Component defaults are XS=20, S=32, M=44, L=56; structural levels remain L2=32, L1=48, L0=56 and are never treated as the same ladder. Tokens define geometry once, primitive CSS consumes those tokens, and catalog CSS owns placement only.

**Tech Stack:** React 19, TypeScript 5.9, Vite, CSS, Vitest.

**Spec:** Current branch source plus the 65/66 visual audit and the Primitive System Stabilization plan approved in conversation.

## Global Constraints

- Do not modify the main branch.
- Do not add new primitive families or compound controls during this stabilization phase.
- Preserve the current primitive registry and existing ViewTube visual language.
- 65 owns geometry/sizing; 66 owns split anatomy/placement.
- Component sizes are XS=20px, S=32px, M=44px, L=56px.
- Structural levels are L2=32px, L1=48px, L0=56px.
- M=44px and L1=48px must remain distinct.
- Feature and catalog CSS must not redefine production primitive geometry.
- Avoid new !important declarations; remove declarations that only exist to defeat competing ownership.
- Top-level Toolbox shell is not redesigned in this phase.

## Review Focus

- Legacy control-size aliases producing 26/32/48/56 geometry instead of 20/32/44/56 → lock the executable control-size DNA test.
- Catalog mapping component sizes directly to structural levels → test that catalog size policy uses component sizes without redefining 65 levels.
- Duplicate primitive ownership between subtoolbox-system.css and canonical-component-defaults.css → test ownership markers and consolidate canonical defaults.
- Global index.css selectors overriding primitive fields/controls → inspect and scope or remove only rules that duplicate canonical primitive behavior.
- Responsive/catalog presentation rules accidentally changing component geometry → retain layout-only catalog rules and add a source-level ownership guard.

---

### Task 1: Lock component-size DNA separately from structural levels

**Files:**
- Modify: `src/components/subtoolbox/tokens.ts`
- Test: `src/components/subtoolbox/tokens.test.ts`

**Interfaces:**
- Produces `SUBTOOLBOX_CONTROL_SIZE_DNA` and `getControlSizeCssVars(size)`.
- Structural-level APIs remain `COMPONENT_LEVEL_DNA` and `getComponentLevelCssVars(level)`.

- [ ] **Step 1: Write failing tests** for the canonical control-size DNA: micro=20/2/4/2/10, compact=32/2/6/4/12, standard=44/3/8/5/16, action=56/3.5/9.333333/5.833333/24; also assert structural L1 remains 48.
- [ ] **Step 2: Run the focused token test and verify it fails because the new control-size authority does not exist.**
- [ ] **Step 3: Implement the new control-size DNA and CSS-variable projection in `tokens.ts`, deriving the four legacy class names from the canonical XS/S/M/L values.
- [ ] **Step 4: Run the focused token test and verify it passes.**
- [ ] **Step 5: Commit:** `refactor: separate primitive size dna from structural levels`.

### Task 2: Make primitive CSS consume the canonical control-size DNA

**Files:**
- Modify: `src/styles/subtoolbox-system.css`
- Test: `src/components/subtoolbox/tokens.test.ts`

**Interfaces:**
- Consumes `SUBTOOLBOX_CONTROL_SIZE_DNA` values mirrored as CSS custom-property defaults.
- Does not alter structural L0/L1/L2 tokens.

- [ ] **Step 1: Add failing assertions that primitive size variables are 20/32/44/56 and that standard controls are 44px rather than 48px.
- [ ] **Step 2: Run the focused test and verify the new assertions fail against the current CSS.
- [ ] **Step 3: Replace the root control-height defaults and hardcoded micro/standard geometry with the canonical 20/32/44/56 values; preserve structural-level variables separately.
- [ ] **Step 4: Run the focused tests and verify they pass.
- [ ] **Step 5: Commit:** `fix: align primitive control sizes with canonical dna`.

### Task 3: Remove the catalog's size-to-level conflation

**Files:**
- Modify: `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- Modify: `src/components/studio-hub/studio-hub-primitive-migration-catalog.css`
- Test: `src/components/subtoolbox/tokens.test.ts` or a focused catalog test if an existing catalog test harness is available.

**Interfaces:**
- Catalog size lanes consume `COMPONENT_SIZE_DNA`.
- Structural-level demos continue to use explicit L0/L1/L2 where the family actually requires structural geometry.

- [ ] **Step 1: Add a failing registry assertion that XS/S/M/L are not implemented by the L2/L2/L1/L0 structural mapping.
- [ ] **Step 2: Run the focused test and verify the current catalog mapping fails it.
- [ ] **Step 3: Replace `CATALOG_SIZES` with a component-size policy that keeps size and level separate; use component-size CSS vars for size-ladder previews.
- [ ] **Step 4: Run focused tests and verify the registry contract passes.
- [ ] **Step 5: Commit:** `fix: keep catalog component sizes separate from structural levels`.

### Task 4: Consolidate canonical primitive CSS ownership

**Files:**
- Modify: `src/styles/canonical-component-defaults.css`
- Modify: `src/styles/subtoolbox-system.css`
- Modify: `src/index.css`
- Test: `scripts/check-css.mjs` or a new focused ownership test if needed.

**Interfaces:**
- `subtoolbox-system.css` becomes the canonical primitive CSS owner.
- `canonical-component-defaults.css` is reduced to compatibility-only rules during migration, then removed from imports when its valid rules have been absorbed.
- Catalog CSS remains layout-only.

- [ ] **Step 1: Identify overlapping primitive selectors and add a failing ownership guard for canonical primitive selectors defined in multiple authority files.
- [ ] **Step 2: Run the guard and verify it identifies the known overlaps.
- [ ] **Step 3: Move only canonical primitive behavior from `canonical-component-defaults.css` into the primitive authority; remove duplicate root size variables; leave feature-specific rules untouched.
- [ ] **Step 4: Remove the canonical-defaults import when no canonical primitive ownership remains there.
- [ ] **Step 5: Run CSS/type checks and verify the ownership guard is clean.
- [ ] **Step 6: Commit:** `refactor: consolidate primitive css ownership`.

### Task 5: Remove global primitive overrides that duplicate canonical behavior

**Files:**
- Modify: `src/index.css`
- Modify: affected primitive stylesheet(s) only where the rule is moved to its proper owner.
- Test: existing CSS/type test suite.

- [ ] **Step 1: Add a focused regression assertion for canonical input/button typography and geometry surviving global stylesheet loading.
- [ ] **Step 2: Verify the assertion fails or exposes duplicate ownership before the cleanup.
- [ ] **Step 3: Scope, move, or delete only global rules that duplicate canonical primitive behavior; do not alter unrelated application styling.
- [ ] **Step 4: Run focused verification.
- [ ] **Step 5: Commit:** `refactor: remove competing global primitive overrides`.

### Task 6: Primitive certification gate

**Files:**
- Modify: `src/components/subtoolbox/tokens.test.ts`
- Modify/create: focused primitive governance test(s) if required.
- Documentation: `docs/superpowers/plans/2026-10-08-viewtube-primitive-system-stabilization.md`

- [ ] **Step 1: Add regression coverage for size DNA, structural DNA, split-size separation, and single-size policy.
- [ ] **Step 2: Run the full repository test suite available through CI.
- [ ] **Step 3: Run typecheck/build/CSS checks available through CI.
- [ ] **Step 4: Inspect the updated canonical render at desktop and mobile before declaring the primitive lock.
- [ ] **Step 5: Commit:** `test: add primitive system stabilization gates`.

## Definition of Done

- Current primitive registry is unchanged.
- Component default sizes resolve to 20/32/44/56.
- Structural L2/L1/L0 resolve to 32/48/56.
- M=44 and L1=48 remain distinct.
- Primitive CSS has one canonical ownership path.
- Catalog CSS controls placement, not primitive geometry.
- Global CSS no longer competes with canonical primitive geometry.
- No new primitive families were added.
- Tests/typecheck/build/CSS checks pass in available CI verification.
- Canonical render is visually rechecked before the primitive system is considered locked.
