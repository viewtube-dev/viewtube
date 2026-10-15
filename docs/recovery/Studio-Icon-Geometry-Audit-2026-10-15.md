# Studio Split-Left and Square Icon Geometry Comparison

Date: 2026-10-15

## Phase 0 — Existing geometry audit

The shared Studio controls currently use a 44px standard / 28px compact outer height, with 3px / 2px borders and 6px / 4px radii. Existing SVG boxes are 28px / 18px. That is approximately 63.6% / 64.3% of the outer button height.

The SVG CSS stroke values are 2.5 / 1.65 SVG units. SVG width alone does not determine visible artwork size: viewBox dimensions, path margins, transforms, fill-vs-stroke construction, and icon-specific attributes all affect appearance. The comparison uses Settings2 from the shared Lucide 24×24 icon family. Caller-supplied SVGs with other viewBoxes need individual review.

For a 24-unit viewBox, approximate rendered stroke thickness is SVG stroke-width × rendered size ÷ 24. Increasing the icon box without compensation would also make the stroke heavier.

## Phase 1 — Shared geometry

Both `StudioSquareIconButton` and `StudioSplitLeftButton` expose the same `iconSizeVariant` property: `current`, `moderate`, or `large`. It only changes the shared icon-size and icon-stroke tokens. Outer button size, border, radius, rail width, divider, shadow, and interaction behavior are unchanged. `current` remains the default.

## Phase 2 — Candidate dimensions

| Candidate | Standard icon | Compact icon | Standard / outer height | Compact / outer height |
|---|---:|---:|---:|---:|
| Current | 28px | 18px | 63.6% | 64.3% |
| Moderate | 34px | 22px | 77.3% | 78.6% |
| Large | 38px | 24px | 86.4% | 85.7% |

Stroke tokens are inversely scaled for a 24×24 viewBox to keep the nominal rendered stroke close to the current baseline: current 2.5 / 1.65, moderate 2.0588 / 1.35, large 1.8421 / 1.2375. These are geometric estimates; browser rasterization, line joins, path geometry, and non-24×24 icons may look different.

## Phase 3 — Visual specimens

The confirmed primitive catalog now shows side-by-side current, moderate, and large options for:
- Square icon buttons at standard 44px and compact 28px heights.
- Split-left buttons at standard 44px and compact 28px heights.

All candidates use production components, so the comparison reflects the actual component styling. Inspect edge clearance, optical centering, stroke weight, icon detail, and any clipping—especially 38px artwork inside a 44px button and 24px artwork inside a 28px button.

## Verification status

Source-level regression tests cover the shared props, all six dimensions, the unchanged 3px / 2px border contract, and the catalog comparison specimens. CI and browser visual verification are still required before selecting a new default. The current preset remains the default until the visual comparison is reviewed.
