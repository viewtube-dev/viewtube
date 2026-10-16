# Studio Control Shadow Ownership — 2026-10-15

## Contract

The canonical standalone Studio Controls system is flat and position-stable by default. A control's rendered bounds, layout bounds, and hit target must not change on hover, pointer-down, release, selection, or focus.

### Global Studio control layer

The following are prohibited in `src/styles/studio-control-system.css` and `src/studio-ui/tokens.ts`:

- Global shadow tokens, shadow defaults, and per-size shadow-offset settings.
- `box-shadow`, `drop-shadow()`, and shadow-mimicking translated pseudo-elements on fields, labels, menus, wrappers, or general controls.
- Generic hover/press transforms, lift, displacement, bounce, and elevation transitions.
- Global pointer-motion settings that couple interaction state to geometry.

Real borders, fills, outlines, keyboard focus indicators, and status-state colors remain valid. Fields must use actual borders and outlines rather than inset shadow strokes.

### Button-only opt-in

`StudioButton` and `StudioActionButton` expose an optional `shadow` prop. It defaults to false. The square icon and split-left variants reuse the canonical StudioButton API.

The CSS effect is scoped to `button[data-vt-button-shadow="true"]`. Its dimensions are visual-only and must not change layout or hit-target geometry. No hover or press transition may move the button or animate its shadow.

The animated square-icon ripple remains a button-owned effect; it is not a global shadow default.

### Required verification

- Unit tests prove that default buttons have no shadow attribute and that opt-in effects stay on real button elements.
- CSS tests verify that shadow declarations are restricted to the opt-in button selector or the approved square-icon ripple.
- Hover/active rules must not apply transform or shadow declarations.
- Verify standard (44px) and compact (28px) controls, split-left alignment, square icon animation, floating labels, focus visibility, and disabled states.
- Run `npm run test:studio-controls`, `npm run typecheck`, `npm run check:css`, and `npm run build` before merge.
- Browser certification must use the actual target deployment and tested commit.

## Scope boundary

This contract governs `src/studio-ui/*` and `src/styles/studio-control-system.css`. Toolbox/SubToolbox shell and other non-Studio primitive systems have their own migration scope and must not be assumed certified by this change.
