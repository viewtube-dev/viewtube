# Studio primitive restoration — integration-branch execution plan

**Date:** 2026-10-30  
**Source of truth:** `master/consolidated-feature-integration`  
**Visual/behavior reference:** `codex/shared-studio-interaction-focus`  
**Work branch:** `codex/studio-primitive-restoration-integration-20261030`  
**Safety rule:** never merge or cherry-pick the Codex branch wholesale.

## Fresh branch comparison

The live GitHub comparison differs from the earlier plan snapshot: the reference branch is now 95 commits ahead and 4,027 behind the integration branch. The comparison contains 23 changed paths. This is a highly divergent reference, not a safe merge candidate.

The work branch was created directly from the current integration branch. The integration branch remains authoritative for tokens, API compatibility, upload behavior, production imports, catalog structure, and all unrelated application work.

## Verified destination facts

The prior plan's missing-primitive list was written for the Codex branch as its destination and is not accurate for the current integration target. The integration target already contains:

- `StudioVerticalWordToggle` and `StudioSquareIconButtonGroup` in `StudioControls.tsx`.
- `StudioValueToggles.tsx` and `StudioSplitAccordion.tsx`, both present in the target.
- `StudioSplitTextInput.tsx` and its dedicated stylesheet.
- `StudioSplitAccordion` catalog specimens.
- The five-tier token contract and newer stepper-chevron token family.

Several production TSX implementations are byte-identical between target and reference: `StudioPlayPauseButton`, `StudioSquareIconButton`, and `StudioVerticalWordToggle`. Do not replace or duplicate these implementations when the actual drift is in CSS/catalog ownership.

The target upload frame is newer than the reference implementation: it supports `multiple`, `onFilesChange`, and image/video selection. Preserve these capabilities; restore only the intended visual treatment. The slider implementation also differs and must be reconciled against target APIs and focus ownership rather than copied blindly. The integration token file is newer and must not be rolled back.

## Confirmed defects / migration targets

1. **Vertical word toggle:** production TSX matches the reference. Target CSS contains a hard `transition: none !important` rule on the word characters and several hard-coded geometry values. Remove the conflicting fade suppression and make character color/stroke fade synchronized with the shared focus/fill treatment, token-driven, and reduced-motion aware. Preserve the original handle/word structure and global size ladder.
2. **Five-square icon group:** production TSX matches the reference. Audit and simplify the target CSS. Preserve five square faces, all primary initially, selected face secondary, shared square sizing, and overflow for notification/tooltip/ripple effects. Do not change the button group's public API unless required.
3. **Double-chevron controls:** keep the integration branch's `STUDIO_STEPPER_BUTTON_TOKENS` and shared `.vt-studio-stepper-button` owner. Inventory and migrate counter, slider, word-counter, and value-toggle consumers to this shared geometry and focus behavior. Do not reintroduce local pixel geometry or a second chevron implementation.
4. **Value toggles:** keep the existing target `StudioValueToggles.tsx` and `StudioSplitShell` foundation. Its dedicated CSS file is absent on target while its family rules are embedded in the large system stylesheet. Extract only the minimal family-owned rules into a dedicated stylesheet, import it once, and remove the corresponding duplicated monolithic rules after verifying no consumer-only selectors are lost. Keep `StudioArrowToggle`, `StudioSideToggle`, `StudioDoubleSideToggle`, `StudioBarToggle`, and `StudioDoubleSplitWordCounter`.
5. **Focus and textarea:** use the target's existing focus interaction tokens and field styles. Preserve black outer border, persistent primary inset stroke, resting primary text/stroke and 50% fill, focused black text/stroke and 15% fill, primary caret, and zero-offset secondary outline at 65% of the active border width. Synchronize text/stroke/fill fades; reduced motion must settle immediately. Do not copy the smaller legacy reference field stylesheet over the more capable target.
6. **Dropdowns:** preserve all three target variants and keyboard/ARIA behavior. Resolve trigger/menu gap, row and menu radii, row height, and opening motion through the existing dropdown tokens. Remove conflicting repeated selectors and hard-coded top/radius overrides instead of layering another override.
7. **Upload frame:** preserve the target multi-file and video-upload API. Restore the requested reference visuals without replacing the newer file-selection behavior or object-URL cleanup.
8. **Double-split slider:** reconcile the target implementation with the reference interaction design while retaining target token/focus hooks and all current API behavior. Remove obsolete inverse color/catalog styling.
9. **Play/pause:** target and reference production component implementations are identical. Keep the target component; verify the split-left styling owner and replace only if a concrete CSS/API difference is proven.
10. **Split text input:** retain the target's dedicated production primitive and badge-owned split geometry. Compare its focus/inset styling to the reference, then remove duplicate border/focus owners without changing consumer APIs.

## Confirmed Primitive Library requirements

- Every specimen uses the actual production primitive.
- No column-based design cards; use full-row or natural/auto width.
- Remove inverse-color counter and slider specimens.
- Add a dedicated Representatives section, separate from detailed family modules.
- For applicable fixed-height families, show one Standard full-row specimen, then two Compact half-row specimens, then four Micro quarter-row specimens in one uninterrupted sequence. No labels/captions/headings between those specimens. Do not invent unsupported sizes.
- Keep all standard square-icon variants together in one row and all compact variants together in one row. Include notification badge, tooltip, heart pop, bell ring, refresh spin, like/live count, state feedback, ringing-bell toggle, download-check toggle, and tooltip-refresh behavior. Do not add redundant individual catalog modules.
- Keep counters/sliders on their canonical standard styling only; no inverse examples.

## Execution and verification sequence

1. Inventory exact target consumers, token definitions, CSS import order, existing audit scripts, and catalog specimens.
2. Add regression assertions first for shared chevron geometry/focus, synchronized field fade, value-toggle anatomy, dropdown menu geometry/motion, upload multi-file/video preservation, and catalog row ordering/overflow.
3. Make minimal source-of-truth edits; avoid editing generated CSS directly. Regenerate with the existing token emitter if token values change.
4. Remove superseded CSS rules in the same change that moves ownership; do not leave both old and new selectors active.
5. Update the three canonical Studio docs and the catalog certification/decision log.
6. Run focused tests, Studio audit scripts, token generation/check, typecheck, and production build. Inspect the diff for unrelated changes, duplicate selectors, !important growth, hard-coded geometry, generated drift, and incorrect file placement.
7. Open a PR to `master/consolidated-feature-integration` only after implementation and verification. Report any verification that cannot be performed; never claim tests or visual checks that were not run.

## Current status

- [x] Work branch created from the current integration branch.
- [x] Live source/target divergence rechecked.
- [x] Target implementation inventory corrected against the earlier plan.
- [x] Identical TSX implementations identified to avoid unnecessary rewrites.
- [ ] Regression tests added and shown failing before implementation.
- [ ] CSS ownership cleanup and primitive restoration implemented.
- [ ] Confirmed Primitive Library reorganized.
- [ ] Canonical Studio docs updated.
- [ ] Focused tests, typecheck, and production build passed.
- [ ] PR opened after verification.


## Additional source: PR #1229 handoff and its code-recovery references

Opened and inspected [PR #1229](https://github.com/viewtube-dev/viewtube/pull/1229), “Document Studio Controls regression conversation handoff”. PR #1229 itself is documentation/provenance only; it does not contain production primitive changes. Its handoff points to PR #923 and the following implementation requirements, now added to this restoration's acceptance scope.

### Field glyph-stroke contract — reconcile before applying

- Simple text input: primary-colored inline glyph stroke in resting and focused states.
- Labelled/editable inputs and textareas: primary glyph stroke at rest; black glyph stroke on focus, per PR #923's implementation/body.
- TextBox: black text and black outer border, with the primary inline glyph stroke. The handoff's latest correction explicitly supersedes its older black-glyph interpretation.
- Keep the secondary focus outline separate from the inline glyph stroke.
- Do not apply one blanket field selector that erases the per-field/per-state contract. Verify actual JSX field-kind markers and effective CSS cascade.

**Conflict to resolve explicitly:** PR #923's original description says TextBox default glyph stroke black and labelled fields/textareas black on focus; the later handoff says every field, including TextBox, uses primary inline glyph stroke at all times. The later user correction is the current authority for TextBox. Keep the simple-input and labelled/textarea state distinctions unless a newer user instruction explicitly supersedes them.

### Split geometry and layout contract

- Square inner rails for split badges (left/right/double), split-left buttons, top-split modules, counters, toggles, and shared split shells.
- Rail width and height must match the inner face after subtracting both outer strokes; no stretched full-height rail.
- Top-split left/right/double grid columns must use the square inner-rail dimension and preserve a flexible center column.
- Intermodules must occupy the full available row (grid-column: 1 / -1, width 100%, no narrow column cap).
- Intermodule split rails must themselves be square and use face size minus both strokes.
- Include regression assertions for field states, square rails, top-split stroke accounting, and full-row intermodules.

### PR #923 live status correction

The current GitHub PR endpoint reports PR #923 as **merged**, with merge commit f4d15cd2488ccb415d2626372577308a78d003e1. The merge commit is an ancestor of the current integration branch (current target is ahead by 2,151 commits from that merge point). This supersedes the stale “closed/unmerged” status recorded in PR #1229's handoff. Do not attempt to recover or cherry-pick PR #923's eight commits as if they were unmerged. Instead, audit current target files for later regressions/overwrites and restore only behavior demonstrably absent. PR #923's own verification explicitly said tests/build and browser visual verification had not been run; these remain required acceptance evidence.

### Required regression coverage added to this restoration plan

- [ ] Field-kind × state matrix: simple input rest/focus; labelled input rest/focus; textarea rest/focus; TextBox default; assert glyph stroke, text/fill, perimeter, caret, and separate focus outline.
- [ ] Split-rail matrix: left/right/double badges, split-left buttons, top-split modules, counters, toggles, and shared split shells; assert square inner dimensions at each supported size.
- [ ] Top-split grid: verify left/right/double rail columns subtract both outer strokes and center remains minmax(0, 1fr).
- [ ] Intermodule layout: verify full-row span, 100% width, no narrow max-width, square rails.
- [ ] Desktop and mobile visual review for all representative families after automated checks.
