# Studio Controls — Split Stepper Family

## Canonical primitive
- Export: `SubToolboxSplitStepper` from `src/components/subtoolbox/SubToolboxSplitStepper.tsx`.
- Styles: `src/components/subtoolbox/subtoolbox-split-stepper.css`.
- Value section occupies a 2:1 width ratio; the right square rail is split into two equal horizontal rows. Each chevron button is therefore a 2:1 rectangle.
- The value pane uses the primary palette color at 50% opacity. Both rail buttons use the secondary palette color at full opacity; chevrons remain black.
- Component height, stroke, radius, shadow, font and color pairings inherit Studio Controls tokens. `size="compact"` and `size="standard"` select the shared compact/standard height tokens.
- Click/tap increments by one step. Holding begins with a deliberate delay, then repeats at 220ms, 110ms, 65ms and 38ms as hold duration increases. Pointer release, leave, cancellation and unmount stop repeat.
- Controlled API: `value`, `onValueChange`; optional `min`, `max`, `step`, `level`, `size`, `disabled`, `ariaLabel`.
- Accessible controls expose Increase/Decrease labels, respect min/max, announce the current value, and show visible keyboard focus.

## Integration note
Use the shared primitive in Studio tools and the Primitive track of the UI Reference Library; do not recreate its geometry in feature-level CSS. Existing `SubToolboxStepper` remains a compatibility API until its call sites are migrated.
