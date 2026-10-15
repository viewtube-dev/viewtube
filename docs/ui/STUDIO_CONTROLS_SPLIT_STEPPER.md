# Studio Controls — Split Stepper Family

## Canonical primitive
- Public export: `StudioSplitStepper` from `src/studio-ui/primitives/StudioControls.tsx`.
- Implementation: `src/studio-ui/primitives/StudioSplitStepper.tsx`.
- Canonical styles: `src/studio-ui/primitives/studio-split-stepper.css`.
- The previous `SubToolboxSplitStepper` import path remains as a compatibility re-export; it contains no competing implementation or component styles.
- The Studio Hub primitive library renders the exported production component directly.

## Geometry and global defaults
- Standard height: 44px, 3px stroke, global standard radius.
- Compact height: 28px, compact stroke/radius from the shared Studio Controls contract.
- Width is fixed from the component's inner height: a 2:1 value input plus a square right rail. The component does not stretch to 100% or flex-grow.
- The right rail contains two equal stacked 2:1 button rows. The vertical seam and centered horizontal divider are rail-owned overlays and do not consume layout dimensions.
- No outer or value-field shadow.
- The number field remains a native editable `input[type="number"]`; it uses the global input typography, primary characters, primary fill at 50% opacity, and inset stroke. The inner edge is squared to avoid a doubled seam.
- The rail uses the global secondary color-pair fill at full opacity; chevrons are black and doubled from the earlier icon size.
- Shared global Studio Controls tokens remain authoritative. No stepper-specific global dimensions are introduced.

## Behavior and focus
- Tap/click increments or decrements by one step (the default step is 1).
- Holding a rail button begins accelerated repetition after the hold threshold; the repeat delay decreases as the hold continues and stops at bounds or pointer release/cancel/leave.
- Keyboard entry remains native. Controlled external values synchronize when the input is not being edited; typed values are clamped and committed on blur.
- The full-component focus outline appears while the number field is being edited or after a button is held long enough to enter repeat mode. A short button click does not activate this outline.
- The increment/decrement buttons have accessible names, native button semantics, visible keyboard focus, and disabled boundary states.

## Verification
Run `npm run test:split-stepper-divider-layout`, `npm run test:studio-controls`, `npm run typecheck`, and `npm run build`. Complete rendered browser checks before visual certification. Regression coverage should assert fixed proportions, standard/compact sizes, native number input, seam ownership and alignment, equal rail rows, accessible focus, bounds, and hold-repeat/focus separation.
