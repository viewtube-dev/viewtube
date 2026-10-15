# Tactile Button Press Transitions

**Status:** Implemented on master/consolidated-feature-integration  
**Scope:** Studio Controls and SubToolbox extruded button families  
**Purpose:** Make a pressed button read as a physical surface moving down into its background, rather than a face sliding over a stationary shadow.

## Phase 0 — Audit findings

The control library had several competing press models:

- Canonical Studio buttons moved only the inner face while the shadow pseudo-element stayed anchored; the active transition was 300ms.
- Studio action buttons used a separate native shadow and moved the face independently.
- SubToolbox buttons and split actions removed their shadow and translated the whole control, but used scattered defaults and did not consistently use the short press duration.
- Component-level SubToolbox buttons already used token-derived shadow offsets; icon and media controls had separate active rules.
- Dropdown triggers/options and switch, radio, and checkbox controls have their own interaction contracts and must not accidentally inherit the extruded-button effect.

## Phase 1 — Motion and geometry contract

| State | Duration | Behavior |
|---|---:|---|
| Normal / hover | 180ms | Smooth, restrained response |
| Press (:active) | 80ms | Short, tactile depression |
| Reduced motion | No transition | State changes remain immediate |

The shadow offset is the source of truth for displacement. Existing standard/compact dimensions, border widths, radii, color-pair assignments, selected colors, and split-left rail geometry remain unchanged.

## Phase 2 — Physical depression

For eligible Studio buttons, the button root translates by its X/Y shadow offsets while the pseudo-element shadow fades out. The inner face is reset to zero translation while pressed, preventing double movement. Studio action buttons use the same root-level motion while their native box shadow is removed.

For SubToolbox buttons, split actions, component-level buttons, icon buttons, and media controls, the pressed state removes the native shadow and translates the complete surface by its configured shadow offset. The active transition is 80ms.

## Phase 3 — Rollout and safeguards

- Applied the shared 180ms/80ms contract to the canonical Studio button, square icon, and split-left families through their shared button-face/root selectors.
- Applied the contract to Studio action buttons without moving the face independently.
- Applied the short press timing to SubToolbox buttons, component-level buttons, icon buttons, split actions, and media controls.
- Preserved split-left rail/divider geometry and selected-state color inversion.
- Kept dropdown/menu triggers stationary and shadow-free; menu options do not gain extruded press movement.
- Disabled controls do not receive active movement.
- Added reduced-motion overrides for the relevant button shells, pseudo-shadows, and faces.

## Verification status

CSS and regression assertions were updated in src/studio-ui/primitives/StudioControls.test.tsx. The repository test suite has **not** been executed in this editing session. The latest observed Vercel status was blocked by the account's build-rate limit, so deployment/build success is not claimed.