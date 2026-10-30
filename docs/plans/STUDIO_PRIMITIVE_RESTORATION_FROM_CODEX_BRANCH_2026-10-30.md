# Studio primitive restoration from Codex focus reference

**Date:** 2026-10-30  
**Destination:** `master/consolidated-feature-integration`  
**Reference:** `codex/shared-studio-interaction-focus`  
**Working branch:** `codex/restore-studio-primitives-focus-reference`

## Goal

Restore the verified interaction-focus branch behavior for the named Studio Controls families on the current integration baseline. This is a selective, source-backed port—not a branch merge and not a rollback of later integration work.

## Repository evidence and migration decision

The reference and destination are deeply diverged: the reference is 26 commits ahead and 3,849 commits behind the integration branch, with a merge base of `decc2b14a587199337c6741cfbe65eaf9c3112c5`. A whole-branch merge or broad cherry-pick would therefore risk removing thousands of commits of landed work.

The current destination has newer implementations and APIs in several areas. In particular, its upload frame supports multiple files and video/image defaults, and its token system supports the five size tiers. The reference upload-frame implementation is older and narrower. The port must preserve destination-only capabilities unless the requested design explicitly replaces them and a regression check proves no consumer depends on them.

## Scope and intended changes

1. **Choice controls / variance module**
   - Restore the five canonical faces: round switch, rectangular switch, radio, check checkbox, and X checkbox.
   - Restore the visible track/face behind switch handles and the choice-control background shapes.
   - Retain the reference branch's four skins and checked-state semantics.
   - Remove conflicting later overrides only after tracing the winning cascade and confirming no other family depends on them.

2. **Square icon buttons**
   - Keep the reference's orthogonal visual variant and effect API: pop-on-activation, notification badge, heart-pop, bell-ring, refresh spin, like-pop/live count, tooltip, and outcome-driven success.
   - Include persistent toggle examples (ringing bell, download/check) and tooltip refresh example.
   - In the Confirmed Primitive Library, group all standard examples in one row and all compact examples in one row; remove redundant per-effect modules while keeping every requested variant discoverable.
   - Preserve overflow for badges, tooltips, and ripples without clipping the catalog or page.

3. **Play/pause split-left button**
   - Use the reference implementation as the behavioral baseline and replace the destination implementation only if the source comparison shows a meaningful difference.
   - Preserve the destination's public API compatibility and split-left geometry.

4. **Dropdown family**
   - Reconcile standard/simple, multi-select, and split-left chevron rails to the reference's trailing alignment and shared geometry.
   - Keep one canonical token contract; remove duplicate per-variant chevron geometry and preserve the five-tier destination token model.

5. **Upload frame**
   - Port the reference visual anatomy and CSS ownership into the current upload-frame primitive.
   - Preserve destination-supported multiple-file callbacks, video/image handling, picker timing, disabled behavior, object-URL cleanup, and accessibility unless tests demonstrate those behaviors are intentionally retired.
   - Keep the frame's ratio and overflow behavior owned by its primitive/family stylesheet, not catalog CSS.

6. **Double-split slider**
   - Port the reference interaction-focus lifecycle and split-face behavior while preserving destination-specific APIs and the current size-tier system.
   - Remove duplicate slider geometry/handle overrides where the canonical family stylesheet can own them.

7. **Split text input**
   - Port the reference component anatomy and stylesheet, retaining the existing input foundation and all current consumer-facing props.
   - Reconcile border, persistent primary inset, focus outline, rails, dividers, and label centering at the proper field/split owners.

## Ownership and cleanup rules

- `tokens.ts` remains the canonical value owner; generated CSS must be emitted by `scripts/emit-studio-control-vars.mjs`.
- Production behavior/anatomy belongs in the primitive; shared defaults belong in the shared control system; genuine family geometry belongs in the family stylesheet.
- `index.ts` remains the public export surface. The Confirmed Primitive Library imports production exports and only arranges specimens.
- Preserve the current five-tier integration contract and 12-color theme pair system. Do not copy the reference's older three-tier or 14px micro assumptions into the destination.
- Delete stale or duplicate rules rather than adding another last-loaded override. Do not introduce new `!important` declarations to force the result.
- Update the Studio hierarchy, global defaults/exception index, component-library source-of-truth, and import inventory only where the implementation changes their claims.

## Test-first verification plan

1. Add failing regression coverage for choice-control track/face visibility and all five shapes/marks.
2. Add square-icon effect/state coverage, including badge overflow, activation count, tooltip, success-only download check, and reduced motion.
3. Cover play/pause controlled and uncontrolled transitions.
4. Cover dropdown chevron placement for standard/simple, multi-select, and split-left at supported tiers.
5. Cover upload selection, drag/drop, preview cleanup, multiple files, disabled state, and announcements.
6. Cover slider focus activation/fade and keyboard/range value behavior.
7. Cover split-input left/right/double anatomy and field states.
8. Run focused audit tests, typecheck, build, and browser checks at narrow mobile and desktop widths. Record actual outcomes; source inspection alone is not visual certification.

## Known source comparison findings

- The reference and destination `StudioSquareIconButton` and `StudioPlayPauseButton` declarations appear substantially identical in the inspected sections; their regressions may be caused by CSS/cascade or catalog composition rather than a missing TSX port.
- The destination `StudioUploadFrame` has additional capabilities not present in the reference implementation. A literal wholesale rollback would remove them, so the implementation must port the requested visual design while preserving these contracts.
- The destination token source has five tiers and expanded dropdown/stepper tokens; the reference token file is older. Do not replace the destination token file wholesale.
- The destination shared control stylesheet is materially larger and contains later family rules. Do not replace it wholesale with the reference stylesheet; isolate the actual conflicting rules and remove only proven drift.

## Completion criteria

- Each requested family has one production implementation and one clear style owner.
- No duplicated per-module square-icon effect implementations remain in the Confirmed Primitive Library.
- Requested variants and states are represented accurately in the catalog.
- Tokens, generated variables, exports, styles, tests, and source-of-truth docs agree.
- Focused tests, typecheck, build, and browser checks are reported separately with truthful verification status.
