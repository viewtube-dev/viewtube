# Studio button default effects contract

Date: 2026-10-16

## Ownership

- Canonical button primitives/components (StudioButton, StudioActionButton, and wrappers that compose them) own the shared default shadow and paint-state transition contract.
- Button hover/press feedback may change shadow, fill, text/icon color, border color, filter, or opacity. The control box, hit target, button face, and label must not translate or change dimensions to simulate a press.
- Square-icon animation remains an explicit icon-specific effect; generic button shadow styling must not consume its animation pseudo-elements.
- Badges, input fields, dropdown menu surfaces, and stepper action cells are not button-effect hosts. They stay flat and stationary; fields retain visible focus outlines.
- Stepper action cells remain operable buttons for accessibility, but do not inherit button-family elevation or press transitions.

## Size contract

- Standard: 44px height, 3px stroke, 38px icon preset where the large icon family is selected.
- Compact: 28px height, 2px stroke, 24px icon preset where the large icon family is selected.
- Motion offsets are zero. Standard/compact shadow dimensions are visual tokens only and never contribute to layout sizing.

## Motion and accessibility

The vendored CSS Animation Creator skill and its performance/accessibility references are guidance, not authority to add dependencies or animate every component. Prefer paint-only transitions for button feedback, avoid layout thrash, honor prefers-reduced-motion, and validate on constrained/mobile devices. The existing ViewTube design contract takes precedence over generic examples that lift, scale, or translate buttons.

## Verification

Run:

- npm run test:studio-button-default-effects
- npm run test:studio-controls
- npm run typecheck
- npm run check:css
- npm run build

Then perform visual certification on the exact tested commit and deployment. This document is not itself proof those gates passed.
