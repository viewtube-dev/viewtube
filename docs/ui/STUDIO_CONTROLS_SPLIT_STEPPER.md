# Studio Controls — Split Stepper

## Canonical implementation
- Component: `src/components/subtoolbox/SubToolboxSplitStepper.tsx`
- Styles: `src/components/subtoolbox/subtoolbox-split-stepper.css`
- Editable value field reuses the canonical `StudioNumberInput` primitive.

## Geometry contract
- Standard: 44px outer height, 3px stroke, 6px radius.
- Compact: 28px outer height, 2px stroke, 4px radius.
- Width is fixed from the inner height: a 2:1 value field plus a square right rail. The component does not stretch to 100% or flex-grow.
- The right rail is square and contains two equal stacked buttons, each with a 2:1 width-to-height ratio.
- The value field is directly editable. Typed values update the controlled value but are not reset while the field is focused; values are clamped/committed on blur.
- No outer or value-field drop shadow. The value field uses primary color at 50% opacity, primary-colored characters, and an inset primary stroke.
- Chevron width and height are 0.68× the stepper height (twice the previous 0.34× sizing).

## Focus contract
- Editing the number applies a secondary-color outline around the entire stepper.
- Holding an increase/decrease button applies the same whole-component outline after the hold threshold; held presses repeat.
- A normal short click changes the value but does not enter focus mode.
- Keyboard focus on the rail buttons alone does not trigger the whole-component focus mode.

## Verification
Run `npm run test:studio-controls`, `npm run typecheck`, and `npm run build`. Complete rendered browser checks before visual certification.