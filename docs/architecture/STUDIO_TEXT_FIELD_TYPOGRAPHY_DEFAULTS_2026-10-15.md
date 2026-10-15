# Studio Text Field Typography Defaults
Date: 2026-10-15
Status: Implemented on `fix/studio-text-field-typography-defaults-2026-10-15`; pending CI and visual verification.

## Canonical global defaults
- Standard single-line text input: **38px**, inherited from the global standard control typography.
- Compact single-line text input: **24px**, inherited from the global compact control typography.
- Standard text area: **18px**.
- Compact text area: **14px**.
- Single-line text inputs do **not** have an independent reduced-size typography system. They inherit the global standard/compact control defaults (38px / 24px), including the 1000 weight, uppercase transform, -0.035em tracking, and 0.86 line-height. The separate 18px / 14px exception applies to textareas only.
- Font family, weight, casing, letter spacing, color-pair behavior, border, fill, focus, and caret continue to follow the global Studio text-field contract unless explicitly overridden below.

## Multiline exception
Text areas preserve their taller multiline writing surface and vertical resizing. Their reading metrics are size-family specific: 18px / 1.25 line-height at standard size and 14px / 1.3 line-height at compact size. Choosing compact changes the typography and compact control geometry but does not collapse the textarea into a single-line field.

## Implementation ownership
- `src/studio-ui/tokens.ts`: machine-readable `textInput` global-size inheritance and `multiline` typography contracts.
- `src/studio-ui/primitives/StudioControls.tsx`: `STUDIO_COMPONENT_GLOBAL_DEFAULTS.textFieldDefaults.typography` documents the global contract; `StudioTextInput`, search/number inputs, and `StudioTextArea` expose the shared `sizeVariant` contract.
- `src/styles/studio-control-system.css`: single-line inputs inherit global standard/compact typography; textarea-specific typography explicitly applies the 18px/14px multiline exception over the shared field base rule.

## Regression requirements
1. Standard single-line text input computes to 38px; standard textarea computes to 18px.
2. Compact single-line text input computes to 24px; compact textarea computes to 14px.
3. Placeholder and entered text share typography in each control.
4. Focus/blur does not change font size.
5. Textarea remains multiline, vertically resizable, and at least the canonical multiline minimum height.
6. Button and action typography is unchanged.
7. Verify Studio Reference Library specimens and production Studio pages after deployment.
