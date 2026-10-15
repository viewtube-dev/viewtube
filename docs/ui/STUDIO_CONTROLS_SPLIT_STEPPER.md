# Studio Controls — Split Stepper

## Geometry and defaults

- Standard size is 44px tall; compact is 28px tall.
- Overall width is fixed to three times the active height, never full-width or intrinsic auto width.
- The value field occupies a 2:1 width-to-height ratio. The right rail is square and contains two equal 2:1 buttons stacked in one column.
- The value field uses the canonical `StudioTextInput` primitive with a 3px standard / 2px compact inline stroke, a 50% primary-color fill, and primary-color characters.
- No shadow is applied to the stepper, value field, or buttons.
- Chevron dimensions are doubled from the previous 0.34×height to 0.68×height.
- Focus mode outlines the full stepper when the value input is focused/being edited. A button press activates that outline only after a 160ms hold threshold, so a tap/click alone does not enter focus mode.
- Buttons increment immediately on press and repeat while held, with accelerating repeat timing; release, pointer leave/cancel, and unmount stop repetition.
- Keyboard editing supports Enter to commit and Escape to discard the draft. Values are clamped to the configured minimum/maximum.

## Canonical implementation

- Component: `src/components/subtoolbox/SubToolboxSplitStepper.tsx`
- Styles: `src/components/subtoolbox/subtoolbox-split-stepper.css`
- Regression tests: `src/components/subtoolbox/SubToolboxSplitStepper.test.tsx`
- Primitive migration catalog uses this component rather than the legacy `SubToolboxStepper`.

## Verification boundary

The component contract tests are included in `npm run test:studio-controls`. Treat automated test and build results as required evidence; the CSS and source edits alone do not constitute rendered browser certification.
