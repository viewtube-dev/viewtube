# Studio Split-Left and Square Icon Geometry Audit

**Date:** 2026-10-15  
**Scope:** `StudioSplitLeftButton`, `StudioSquareIconButton`, shared Studio button CSS, and the confirmed primitive catalog.  
**Status:** Phases 0–3 implemented as a comparison-only branch; production defaults remain unchanged.

## Phase 0 — Audit findings

### Existing outer geometry

| Property | Standard | Compact |
|---|---:|---:|
| Button / split-left rail token | 44px | 28px |
| Outer border | 3px | 2px |
| Corner radius | 6px | 4px |
| Existing SVG box | 28 × 28px | 18 × 18px |
| Existing CSS SVG stroke width | 2.5 SVG units | 1.65 SVG units |
| SVG box / outer button height | 63.6% | 64.3% |

The split-left rail uses the same shared size token as the button height, while its SVG uses a separate icon-size token. Square icon buttons and split-left buttons both consume the shared `--vt-studio-control-icon-size` and `--vt-studio-control-icon-stroke` metrics.

The CSS size alone does not describe visible artwork. SVG `viewBox`, path margins, transforms, fill/stroke construction, and per-icon presentation attributes affect its apparent size and weight.

### Sampled production-catalog SVGs

The confirmed catalog uses `Settings2` and `Sparkles` from `lucide-react`. These Lucide icons use a 24 × 24 coordinate system. The square-button success fallback and Studio dropdown chevron also use a 24 × 24 viewBox. The canonical CSS sets SVG dimensions and stroke width on the SVG element, overriding the icons' normal presentation-attribute stroke widths where the CSS selector applies.

For a 24-unit square viewBox, rendered stroke thickness scales approximately as:

`rendered stroke = SVG stroke-width × rendered SVG width ÷ 24`

Therefore, changing the SVG box without adjusting stroke changes both the apparent artwork size and the physical stroke thickness. Other ReactNode icons passed to these public components are caller-supplied and are not guaranteed to use a 24 × 24 viewBox. Such icons must be inspected/normalized individually; the comparison presets are calibrated against the shared 24 × 24 icon family.

## Phase 1 — Shared geometry normalization

- Both primitives expose the same `iconSizeVariant` option: `current`, `moderate`, or `large`.
- The option changes only shared SVG size and stroke tokens. It does not change the 44px / 28px outer button height, border, radius, shadow, rail width, or split divider.
- The SVG remains centered by the existing grid layout.
- Existing SVG viewBoxes are preserved; they are not rewritten or cropped.
- Current remains the default, so consumers that do not specify a comparison variant retain the prior appearance.
- The confirmed component library uses the actual production primitives for the comparison rather than a catalog-only drawing.

## Phase 2 — Comparison candidates

| Candidate | Standard SVG | Compact SVG | Standard SVG / button | Compact SVG / button |
|---|---:|---:|---:|---:|
| Current | 28px | 18px | 63.6% | 64.3% |
| Moderate | 34px | 22px | 77.3% | 78.6% |
| Large | 38px | 24px | 86.4% | 85.7% |

The requested dimensions are applied to both square and split-left buttons. Button geometry remains 44px / 28px for all three candidates.

### Stroke compensation

The larger boxes use inverse stroke scaling so that their rendered stroke thickness remains close to the current baseline for a 24 × 24 viewBox:

| Candidate | Standard stroke token | Compact stroke token | Approx. rendered stroke, standard / compact |
|---|---:|---:|---:|
| Current | 2.5 | 1.65 | 2.92px / 1.24px |
| Moderate | 2.0588 | 1.35 | 2.92px / 1.24px |
| Large | 1.8421 | 1.2375 | 2.92px / 1.24px |

These are geometry calculations, not browser-measured raster stroke bounds. SVG joins, antialiasing, transforms, and paths can make perceived weight differ. The 3px standard and 2px compact outer borders remain unchanged.

## Phase 3 — Visual comparison

The confirmed primitive catalog now contains side-by-side current / moderate / large comparisons for:

- Standard square icon buttons: 28px, 34px, 38px.
- Compact square icon buttons: 18px, 22px, 24px.
- Standard split-left buttons: 28px, 34px, 38px.
- Compact split-left buttons: 18px, 22px, 24px.

Each specimen uses `Settings2`, with the same color-pair behavior and outer control dimensions. Compare icon readability, optical centering, border clearance, divider clearance, and clipping—especially the 38px icon inside a 44px rail and the 24px icon inside a 28px rail.

## Acceptance checks

- [ ] Current / moderate / large are visibly different in the confirmed library.
- [ ] Square and split-left primitives use the same size and stroke presets.
- [ ] 44px / 28px button geometry, 3px / 2px borders, radii, shadows, and interaction behavior do not change.
- [ ] Larger candidates do not clip against the face or split divider.
- [ ] Rendered icons remain optically centered.
- [ ] Other non-24 × 24 caller-supplied SVGs are inventoried before selecting a global default.
- [ ] Focused Studio Controls tests, typecheck, and a browser visual check pass before changing the default away from current.

## Files changed for the comparison

- `src/studio-ui/tokens.ts`
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/primitives/StudioControls.test.tsx`
- `src/styles/studio-control-system.css`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- `src/components/studio-hub/studio-hub-primitive-catalogs.css`
