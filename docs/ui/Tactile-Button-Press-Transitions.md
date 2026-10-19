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
## Phase 4 — Accessibility and interaction boundaries

- The tactile press selectors require `:active:not(:disabled)`; disabled controls never translate into the depressed position. Disabled Studio buttons explicitly retain `transform: none`.
- Keyboard focus remains independently visible through each button family's `:focus-visible` outline. Motion rules do not remove focus indicators.
- Under `prefers-reduced-motion: reduce`, button root, pseudo-shadow, and face transitions are disabled with an important override. State and shadow changes remain immediate.
- Dropdown triggers and menu options are not members of the `data-vt-studio-button="true"` tactile family. Their interaction geometry stays stationary; menu panels may retain their own stationary panel shadow. Existing focus-visible styling for options remains intact.
- Switches, radios, and checkboxes keep their own indicator-state motion and reduced-motion contract; they do not inherit the extruded-button press behavior.
- Split-left rail width, divider stroke, icon dimensions, selected-color inversion, and focus ring remain unchanged by press state.

## Phase 5 — Regression coverage

The focused contract tests now assert:

- 180ms normal button motion and 80ms press timing;
- root translation follows the configured X/Y shadow offset;
- pseudo-element shadow opacity reaches zero while pressed and the inner face remains at zero translation;
- standard 44px and compact 28px variants retain their 3px/6px and 2px/4px border/radius geometry;
- standard/compact icon metrics remain 28px/2.5 stroke and 18px/1.65 stroke;
- square icon variants preserve primary/secondary pair mapping, selected v3 inversion, and v4 black-face/primary-icon treatment;
- disabled controls cannot depress, keyboard focus remains visible, and reduced-motion transitions are disabled;
- SubToolbox button, split-action, icon-button, and media-control families use disabled-safe active selectors and reduced-motion overrides;
- dropdown triggers/options remain outside the extruded press selectors.

These are source-contract assertions, not a substitute for browser-rendered visual certification. The test suite has been updated but has not been executed in this editing session.

## Phase 6 — Inheritance and authoring rules

New primitives may join the tactile family only when they use the canonical button root/face anatomy or explicitly implement the same contract. Do not copy a parallel press model into a feature-local stylesheet.

For every new or changed eligible button:

1. Use the shared 180ms normal / 80ms press tokens.
2. Derive the pressed translation from the same X/Y offset that positions the resting shadow.
3. Remove or fade the resting shadow during press; never move the inner face independently.
4. Exclude disabled states from hover/press transforms and preserve a visible keyboard focus ring.
5. Disable transitions under reduced motion.
6. Preserve component-owned color pairing, selected-state inversion, border/radius geometry, and split-left rail/divider anatomy.
7. Keep dropdown triggers, menu options, switches, radios, and checkboxes on their own interaction contracts unless the design system explicitly revises those boundaries.
8. Add a focused regression assertion and a browser screenshot for both standard and compact sizes before visual certification.

## Acceptance status

- **Phases 0–4:** implemented in source and documented.
- **Phase 5:** focused regression assertions added; test execution remains pending.
- **Phase 6:** authoring/inheritance contract documented.
- **Still open:** run the focused Vitest file and relevant repository checks, then visually certify standard/compact, hover/pressed, disabled, focus-visible, selected, and reduced-motion states in a browser. Do not mark the work fully certified until these checks pass.
