# Studio Token & Size System Cleanup — Plan

**Status:** Planned; implementation not started  
**Target branch:** `master/consolidated-feature-integration`  
**Skill:** `.grok/skills/css-ui-system-organizer/SKILL.md`  
**Scope:** Studio control tokens, size ladder, CSS bridge/imports, field typography, exception registry, documentation, and Confirmed Primitive Library.

## Goal

Establish one verified, token-first contract for Studio control sizes and visual defaults, then align CSS, production primitives, documentation, and catalog specimens without regressing the recently restored text inputs.

## Guardrails

- Preserve the current target branch and inspect its latest source before implementation.
- Do not edit or replace the existing Settings redesign files `tasks/plan.md` and `tasks/todo.md`.
- Do not create a parallel token generator, canonical stylesheet, or primitive implementation.
- Tokens own numeric contracts; CSS owns presentation and selector scope; TSX owns markup/data attributes; the Confirmed Primitive Library renders production primitives.
- Do not guess when sources conflict. Resolve each disagreement against the latest user-confirmed contract and rendered behavior before changing defaults.
- Standard input text remains 38px, compact input text 24px; textarea remains a named 18px/14px multiline exception.
- Preserve the primary inline strokes on text inputs and textareas, left alignment, focus outline offset 0, flat/no-shadow defaults, and row-fill defaults.
- Micro remains reserved for informational split-left badges, not general interactive buttons.
- Every real global-default exception must be represented in tokens, the defaults/exceptions index, and the Confirmed Primitive Library.
- No direct merge to the target branch as part of this plan.

## Current findings to verify

Initial inspection of `src/studio-ui/tokens.ts`, `src/styles/studio-control-system.css`, and `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` indicates potential drift:

1. Token definitions and CSS selectors repeat parts of the size contract.
2. Fill opacity differs between the CSS/token snapshot (50%) and the documentation's stated global fill (100% for ordinary action faces).
3. Focus outline values vary by tier and appear not to be derived consistently between tokens and CSS.
4. Standard/compact input typography (38px/24px) and textarea typography (18px/14px) need regression protection against floating-label sizing.
5. Token source imports SubToolbox tokens for shell-level values; confirm that this is limited to shell hierarchy and does not become the Studio component geometry authority.
6. Confirmed catalog certification must distinguish source/API checks from actual computed-style/browser verification.

These are audit leads, not pre-approved changes. Confirm current branch behavior and the user-approved design contract before modifying any values.

## Phase 1 — Inventory and contract reconciliation

- [ ] Trace the actual import graph for `src/studio-ui/tokens.ts`, `src/styles/studio-control-system.css`, and every imported/generated vars, core, split, and fields stylesheet.
- [ ] Inventory control custom properties, data attributes, size declarations, hard-coded pixel values, duplicate blocks, competing selectors, `!important`, and unused exports.
- [ ] Compare token values, CSS computed behavior, primitive props, exception registry, documentation, and catalog specimens.
- [ ] Create a discrepancy table with source, observed value, expected value, risk, and resolution decision.
- [ ] Identify the last user-confirmed values for fill opacity and focus-outline sizing; do not resolve these by inference.
- [ ] Record a pre-change baseline for focused tests and the production build where the environment allows.

**Gate A:** Do not start broad CSS cleanup until each contract disagreement has an explicit, evidence-backed decision.

## Phase 2 — Normalize the size contract

- [ ] Keep the canonical tiers: standard 44px, compact 28px, micro 14px.
- [ ] Validate compact as the appropriate base for derived micro geometry and document intentional legibility floors/overrides.
- [ ] Centralize height, border stroke, radius, font size/weight, text stroke, icon size/stroke, focus outline, fill opacity, spacing, and interaction defaults where they genuinely share a contract.
- [ ] Keep textarea typography/line-height/minimum height as a named multiline exception.
- [ ] Keep fixed labels and floating labels separate from the native input's text typography.
- [ ] Keep split geometry and special families as named exceptions rather than silently overriding ordinary size tokens.
- [ ] Add or update focused unit tests for size derivation, allowed tiers, and exception shape.

**Gate B:** Token tests pass; no consumer-facing token contract changes without an explicit reason.

## Phase 3 — Consolidate CSS and primitive consumption

- [ ] Ensure CSS consumes the canonical token/variable bridge consistently.
- [ ] Remove duplicate or contradictory declarations only after checking selector precedence and all consumers.
- [ ] Keep selectors scoped to stable Studio data attributes and avoid leaking Studio rules into Toolbox/SubToolbox.
- [ ] Preserve flat stationary defaults: no shadow, transition, or transform unless a named, approved exception exists.
- [ ] Preserve field left alignment, primary inline text stroke, correct border stroke, focus color/fill/outline, outline offset 0, and no layout shift.
- [ ] Ensure changing a size tier does not change color roles, text weight, alignment, or row-fill behavior.
- [ ] Avoid blanket `!important`; resolve ownership conflicts at their source.

**Gate C:** Focused CSS/component checks pass and the production build has no new failures.

## Phase 4 — Documentation and catalog certification

- [ ] Update `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` to reflect only verified defaults and actual exceptions.
- [ ] Ensure the exception object in the production primitive layer agrees with the documentation and catalog.
- [ ] Confirm the catalog imports production primitive exports rather than implementing its own geometry.
- [ ] Verify standard/compact controls and micro only for supported exceptions.
- [ ] Verify native input text separately from floating labels; verify textarea multiline sizing separately.
- [ ] Check split rails/dividers, square controls, switches, radios, checkboxes, badges, and width behavior.
- [ ] Record computed-style/browser evidence for visual certification; do not claim visual certification based only on source inspection.

**Gate D:** Source, docs, exceptions, catalog, tests, and rendered behavior agree.

## Verification checklist

- [ ] Focused token tests pass.
- [ ] Relevant primitive/component tests pass.
- [ ] TypeScript/lint checks relevant to changed files pass.
- [ ] Production build passes without new failures.
- [ ] No regression in 38px/24px single-line input text.
- [ ] No regression in 18px/14px textarea text or 92px minimum surface.
- [ ] Primary inline strokes and focus outlines render correctly without black focus glow or layout shift.
- [ ] Standard/compact geometry and registered micro exceptions are consistent.
- [ ] No new parallel source of truth, redundant stylesheet, or unregistered exception.
- [ ] Final diff is limited to the Studio token/size cleanup.

## Definition of done

The size ladder and global defaults have one verified authority; CSS, TSX primitives, docs, exception registry, and catalog agree; focused tests and build pass; rendered checks are recorded where available; and the existing Settings redesign work remains untouched.

## Initial file scope

Expected starting points, to be reconfirmed against current imports:
- `src/studio-ui/tokens.ts`
- `src/styles/studio-control-system.css` and its actual imported Studio control stylesheets
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/primitives/StudioTextInput.tsx`
- `src/studio-ui/primitives/StudioTextArea.tsx`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- Focused tests discovered during inventory
