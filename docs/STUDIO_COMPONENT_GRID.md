# Studio Component Grid

## Purpose

Compose real Studio primitives in a fixed matrix. Columns range from 1–5; rows from 1–3; size tiers are supreme, standard, compact, mini, and micro. Corners can use token radius or square edges.

```tsx
<StudioComponentGrid cols={2} rows={2} size="standard" corners="radius">
  <StudioComponentGridCell col={1} row={1}><StudioLeftCounter ... /></StudioComponentGridCell>
  <StudioComponentGridCell col={2} row={1}><StudioDropdown ... /></StudioComponentGridCell>
  <StudioComponentGridRow row={2}><StudioDoubleSideToggle ... /></StudioComponentGridRow>
</StudioComponentGrid>
```

## Ownership

- Grid CSS owns placement, gaps, equal-height rows, and optional square corners only.
- Primitive CSS owns faces, chevrons, dividers, focus, and interaction.
- Global side-rail parity is specified in [PRIMITIVE_SIDE_RAIL_CONTRACT.md](./PRIMITIVE_SIDE_RAIL_CONTRACT.md).
- Specimens accept production primitive elements from the caller; they do not fabricate demo controls.
