# Studio Split-Left and Square Icon Geometry Comparison

Date: 2026-10-15

## Phase 0 — Existing geometry audit

The shared Studio controls use a 44px standard / 28px compact outer height, with 3px / 2px borders and 6px / 4px radii. Existing SVG boxes are 28px / 18px, approximately 63.6% / 64.3% of the outer button height.

SVG box dimensions alone do not determine visible artwork size: viewBox dimensions, path margins, transforms, fill-vs-stroke construction, and icon-specific attributes all affect appearance. The comparison uses Settings2 from the shared Lucide 24×24 icon family. Caller-supplied SVGs with other viewBoxes need individual review.

For a 24-unit viewBox, approximate rendered stroke thickness is SVG stroke-width × rendered size ÷ 24. Increasing the icon box without compensation would also make the stroke heavier.

## Phase 1 — Shared geometry

Both `StudioSquareIconButton` and `StudioSplitLeftButton` expose the same `iconSizeVariant` property: `current`, `moderate`, or `large`. It changes shared icon-size and icon-stroke tokens only. Outer button size, border, radius, rail width, divider, shadow, and interaction behavior remain governed by the existing component contract. `current` remains the default.

## Phase 2 — Candidate dimensions

| Candidate | Standard icon | Compact icon | Standard / outer height | Compact / outer height |
|---|---:|---:|---:|---:|
| Current | 28px | 18px | 63.6% | 64.3% |
| Moderate | 34px | 22px | 77.3% | 78.6% |
| Large | 38px | 24px | 86.4% | 85.7% |

Stroke tokens are calibrated toward the outer border: current 2.5 / 1.65, moderate 2.0588 / 1.35, selected large 1.9 / 2.0. For a 24×24 viewBox, nominal rendered stroke is token × rendered icon size ÷ 24: 1.9 × 38 ÷ 24 ≈ 3.01px; 2.0 × 24 ÷ 24 = 2px. Browser rasterization, line joins, path geometry, and non-24×24 icons may look different.

## Phase 3 — Visual specimens

The confirmed primitive catalog shows side-by-side current, moderate, and large options for:
- Square icon buttons at standard 44px and compact 28px heights.
- Split-left buttons at standard 44px and compact 28px heights.

All candidates use production components. Inspect edge clearance, optical centering, stroke weight, icon detail, and clipping—especially 38px artwork inside a 44px button and 24px artwork inside a 28px button.

## Verification status

Source-level regression tests cover the shared props, requested dimensions, unchanged standard/compact border tokens, and catalog comparison specimens. CI and browser visual verification remain required before selecting a new default. The current preset remains the default until the visual comparison is reviewed.
