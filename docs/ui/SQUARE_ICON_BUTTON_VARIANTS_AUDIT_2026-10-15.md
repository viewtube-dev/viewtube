# Square Icon Button Variant Integration — Phase 0 Audit

**Date:** 2026-10-15  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** Audit the canonical Studio Square Icon Button family before extending it with the seven neo-brutalist interaction patterns.

## Executive finding

The repository already has a canonical `StudioSquareIconButton` primitive with four established visual variants (`v1`–`v4`). It is implemented in `src/studio-ui/primitives/StudioControls.tsx`, uses `StudioButton` for shared geometry and state, and is exported through `src/studio-ui/index.ts`.

The correct approach is to extend this source of truth. Do not create a parallel button family, copy the HTML reference's token system, or change global dimensions to accommodate effects.

## Source inventory

| Concern | Canonical source | Audit finding |
|---|---|---|
| Square button implementation | `src/studio-ui/primitives/StudioControls.tsx` | `StudioSquareIconButton` exists; current variant union is `v1 | v2 | v3 | v4`. |
| Base button semantics | `StudioButton` in the same file | Owns standard/compact sizing, tone, selected state, loading/disabled behavior, and shared button data attributes. |
| Size contract | `src/studio-ui/tokens.ts` | Standard: 44px height, 3px stroke, 6px radius, 28px icon, 2.5 icon stroke, 3px shadow offset. Compact: 28px height, 2px stroke, 4px radius, 18px icon, 1.65 icon stroke, 1px shadow offset. |
| Shared styling | `src/styles/studio-control-system.css` | Studio-owned rules are scoped through `data-vt-studio-control`; icon-only geometry and button-face styling are CSS-owned. |
| Public exports | `src/studio-ui/index.ts` | `StudioSquareIconButton` and its V1–V4 variant type are already public exports. |
| Component certification | `src/studio-ui/StudioHubCertification.tsx` | Existing specimen covers generic icon buttons and split-left controls but does not currently showcase the square V1–V4 family or the seven proposed effects. |
| Certification tests | `src/studio-ui/StudioHubCertification.test.tsx` | Existing tests cover ownership attributes, registered sizes, split-left geometry, and dropdown behavior; square-button variant and motion tests need adding. |
| Reduced motion | `src/styles/studio-control-system.css` | A global Studio control reduced-motion rule exists. New keyframe animations need explicit suppression/reset behavior, not just shorter transitions. |
| Palette pairing | Studio CSS variables `--pair-a` / `--pair-b` | Existing global pair ownership should be retained; no hard-coded parallel palette should be introduced. |

## Existing V1–V4 contract

- **V1:** primary (`--pair-a`) face with secondary (`--pair-b`) offset shadow.
- **V2:** secondary (`--pair-b`) face with primary (`--pair-a`) offset shadow.
- **V3:** selectable V1/V2 color swap; selection is handled by the component and exposed with `aria-pressed`.
- **V4:** black face with primary-color icon stroke.

These are established visual skins and must remain compatible. The seven interaction patterns should be additive capabilities rather than replacing or renaming V1–V4.

## Important implementation findings

1. **Do not change global size tokens.** The canonical source is 44px standard / 28px compact. A variant's badge, tooltip, rotation, flip face, or status label must not increase layout dimensions.
2. **The existing base already owns click state for V3.** Any new toggle behavior must follow its controlled/uncontrolled state conventions and must not fork state handling.
3. **Keep transforms on separate layers.** The outer button's tactile press transform must not compete with icon morphing, rotated presentation, flip transforms, badge animation, or tooltip animation.
4. **Keep effects opt-in.** Standard icon buttons must remain fast and visually quiet by default. The 450ms rotation and 500ms flip references are variant-specific, not global timing defaults.
5. **Use real operation state for success.** A success/check animation must only represent a confirmed successful action; pending and failure states must not be styled as success.
6. **Use the canonical palette pair.** Notification, success, tooltip, and selected treatments should resolve through the existing pair/tone contract instead of embedding the reference's independent colors.
7. **Preserve accessibility semantics.** One flip button remains one action; icon-only controls need accessible names; persistent toggles need correct pressed state; tooltips cannot rely exclusively on hover; reduced-motion must preserve understandable state feedback.
8. **Avoid a monolithic prop explosion.** Prefer extending the canonical primitive with a narrow interaction variant contract and isolated inner layers over adding unrelated conditionals and markup to every button.
9. **Audit consumers before broad migration.** Adopt animation only where it improves meaning; do not replace switches, checkboxes, radios, or labeled primary actions with icon buttons.

## Proposed variant mapping

| Reference | Proposed integration | Status |
|---|---|---|
| `.ib / .ib1` standard + optional pop | Existing square primitive + opt-in pop effect | Not implemented as a named effect yet |
| `.ib2` notification badge | Optional positioned badge + icon shake/badge pop | Not present in canonical square API |
| `.ib3` rotated toggle | Optional visual treatment, retaining square layout geometry | Not present in canonical square API |
| `.ib4` 3D flip | Two visual faces inside one accessible button | Not present in canonical square API |
| `.ib5` contextual tooltip | Accessible floating label/tooltip layer | Not present in canonical square API |
| `.ib6` icon morph | Separate icon wrapper with explicit active icon/state | Not present in canonical square API |
| `.ib7` completion/check | Outcome-driven success state with optional label | Not present in canonical square API |

## Phase 0 completion criteria

- [x] Canonical component and public exports identified.
- [x] V1–V4 behavior and compatibility requirements identified.
- [x] Standard/compact size and stroke tokens verified from source.
- [x] Shared CSS ownership and reduced-motion boundary identified.
- [x] Certification component and tests identified.
- [x] Architectural risks and variant mapping documented.
- [ ] Browser/runtime visual certification performed. This requires the app's executable environment and must not be claimed from source inspection alone.
- [ ] Local Vitest/typecheck/build run. GitHub source inspection alone does not prove these checks pass.

## Next phase

Phase 1 should formalize the API and animation ownership before implementation. Keep `StudioSquareIconButton` as the canonical exported primitive, preserve V1–V4, and implement optional interaction effects with CSS scoped to the square-button family. Add focused tests before migrating real consumers.
