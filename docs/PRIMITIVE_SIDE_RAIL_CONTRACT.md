# Primitive-level side-rail button contract

**Scope:** Global Studio Controls primitives, not grid-only.

Applies to side counters, side toggles, double side toggles, arrow toggles, bar toggle arrows, and dropdown chevron rails. The Component Grid composes primitives only and never redefines rail width, chevron size, or press animation.

## Canonical metrics

- `--vt-side-rail-size` aliases the active `--vt-studio-control-height`.
- Rail width equals the control height: supreme 60px, standard 44px, compact 28px, mini 20px, micro 12px.
- Stroke and radius come from the active size tokens. Supreme uses the standard stroke/radius system; micro follows mini stroke/radius.
- Chevron scales with the rail (approximately 62% of its size; stacked up/down glyphs use 72% of that).
- Side-counter and side-toggle rails share `vt-studio-counter-pop`; reduced-motion disables the animation.
- `StudioValueToggles.tsx` keeps `StudioSplitShell`; arrow buttons must not set inline dimensions.

## Ownership

1. `studio-side-rail-unify.css`, loaded from `studio-control-entry.css`, owns shared rail geometry after legacy family styles.
2. `studio-control-system.css` must not retain the old hard-coded 38px arrow rail or SVG sizing.
3. `StudioControls.tsx` and `StudioValueToggles.tsx` retain production primitive markup and interaction.
4. `studio-component-grid.css` owns placement, gaps, equal-height rows, and optional square corners only.

## Acceptance

Verify without any grid present: standard side-counter rail width and standard side-toggle arrow column are both 44px; compact 28px; mini 20px; micro 12px; supreme 60px. Check the confirmed catalog, Brain, Settings, and Hub. Grid specimens must use real Studio primitives, not demo shells.
