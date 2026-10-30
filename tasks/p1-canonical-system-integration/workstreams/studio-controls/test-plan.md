# Studio Controls test and runtime plan

**Status:** PLANNED; tests have not been executed by this work packet.

## Existing test leads
- `test:studio-controls`
- `test:studio-field-style-ownership`
- `test:confirmed-library-layout`
- `test:studio-floating-input-typography`
- `certify:studio-components`
- Token emitter determinism and generated-CSS parity checks.

## Runtime proof
Open the confirmed primitive library and representative primitives on desktop and mobile. Exercise native fields at rest/focus, split left/right/double buttons, counters, sliders, toggles, dropdowns, accordion and composition specimens. Verify imports, geometry, focus, touch/keyboard behavior and generated CSS exactly match the token source.

## Exit
Failing regression first; focused tests pass; generated output is deterministic; every confirmed primitive export resolves; visual/responsive proof exists; no duplicate cascade/token/catalog owner remains; independent review approves donor disposition.
