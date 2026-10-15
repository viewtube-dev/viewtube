# Studio Text Field Typography Defaults
Date: 2026-10-15
Status: Implemented on `fix/studio-text-field-typography-defaults-2026-10-15`; pending CI and visual verification.

## Canonical global defaults
- Standard text input: **18px**.
- Compact text input: **14px**.
- Standard text area: **18px**.
- Compact text area: **14px**.
- Text-input typography is separate from button/action typography (38px standard / 24px compact button labels remain unchanged).
- Font family, weight, casing, letter spacing, color-pair behavior, border, fill, focus, and caret continue to follow the global Studio text-field contract unless explicitly overridden below.

## Multiline exception
Text areas preserve their taller multiline writing surface and vertical resizing. Their reading metrics are size-family specific: 18px / 1.25 line-height at standard size and 14px / 1.3 line-height at compact size. Choosing compact changes the typography and compact control geometry but does not collapse the textarea into a single-line field.

## Implementation ownership
- `src/studio-ui/tokens.ts`: machine-readable `textInput` and `multiline` typography contracts.
- `src/studio-ui/primitives/StudioControls.tsx`: `STUDIO_COMPONENT_GLOBAL_DEFAULTS.textFieldDefaults.typography` documents the global contract; `StudioTextInput`, search/number inputs, and `StudioTextArea` expose the shared `sizeVariant` contract.
- `src/styles/studio-control-system.css`: standard/compact input selectors set 18px/14px independently of oversized button tokens; textarea-specific typography explicitly wins over the shared field base rule.

## Regression requirements
1. Standard text input and standard textarea compute to 18px.
2. Compact text input and compact textarea compute to 14px.
3. Placeholder and entered text share typography in each control.
4. Focus/blur does not change font size.
5. Textarea remains multiline, vertically resizable, and at least the canonical multiline minimum height.
6. Button and action typography is unchanged.
7. Verify Studio Reference Library specimens and production Studio pages after deployment.
