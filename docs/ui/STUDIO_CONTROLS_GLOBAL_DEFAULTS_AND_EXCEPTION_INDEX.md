# Studio Controls — Definitive Global Defaults, Size Contract & Primitive Exceptions

**Status:** Canonical requirements reference; implementation and rendered verification must be checked against the source files below.  
**Reviewed:** 2026-10-17  
**Repository:** `viewtube-dev/viewtube`  
**Work branch:** `fix/studio-primitive-global-size-and-field-contract-2026-10-17`  
**Canonical sources:** `src/studio-ui/tokens.ts`, `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/primitives/StudioTextInput.tsx`, `src/studio-ui/primitives/StudioTextArea.tsx`, `src/styles/studio-control-system.css`  
**Rendered reference:** `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and `src/components/studio-hub/studio-hub-primitive-catalogs.css`

> This document is the normative reference for Studio primitives. Historical notes and old audit snapshots elsewhere in this file are superseded by this section. When implementation differs, treat it as drift to fix—not as a new default—unless an exception is explicitly registered below and represented in the Confirmed Primitive Library.

## 1. Global defaults — independent of size

These rules apply first. The selected size tier changes dimensions, not the meaning of the shared color, alignment, typography, or layout rules.

| Property | Canonical default |
|---|---|
| Font family | `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| Font weight | `1000` (maximum-heavy emphasis); no accidental thin inherited weight |
| Font synthesis | Disabled for badge labels where supported, so synthetic light styles do not override the heavy weight |
| Text transform | Uppercase for control labels and tags |
| Letter spacing | `-0.02em`; only named component exceptions may differ |
| Baseline line-height | `0.86` for single-line controls; multiline areas use their registered line-height below |
| Primary color | `--pair-a` |
| Secondary color | `--pair-b` |
| Default fill | Buttons, badges, and ordinary action faces use 100% primary fill unless the variant explicitly denotes secondary/alternate state |
| Alternate / split-rail fill | Secondary color; split icon rails are secondary by default |
| Default label color | Black (`#000`) unless a primitive/state contract explicitly specifies primary-colored text |
| Default outer border | Black (`#000`) |
| Label alignment | Centered for buttons, badges, split labels, steppers' action controls, radio/checkbox marks, and icon buttons |
| Icon alignment | Centered on both axes within its face/rail; use the selected size tier's icon size/stroke |
| Default width | Fill the available row/module width (`width: 100%` / flex-fill) |
| Intrinsic-width exception | Text-content primitives may opt into content width; they must not force every ordinary control to intrinsic width |
| Split sections | Icon/action rail is fixed by the selected size tier; label region flexes into remaining width; label is centered within its region |
| Split dividers | Exactly one shared divider for a single split; exactly two shared dividers for a double split; no duplicated adjacent borders |
| Shadows and movement | No shadow, transition, hover/click translation, or geometry movement on canonical Studio primitive shells. Any legacy motion/effect must be explicitly named and approved; no shadow-based geometry compensation |
| Focus | No layout shift. Text input/textarea focus outline offset is 0; focus color/width are specified in the field contract |
| Width vs ratio | Row fill is the default layout rule; fixed aspect ratios constrain the control face/rail, not the surrounding row's ability to fill its module |

## 2. Size-based global defaults

The size tier determines height, border stroke, radius, typography, icon size, and icon stroke. Do not independently override one of these properties without a registered exception.

| Property | Standard | Compact | Micro |
|---|---:|---:|---:|
| Control height | 44px | 28px | 14px |
| Border/stroke width | 3px | 2px | 1px |
| Corner radius | 6px | 4px | 2px |
| Text size | 38px | 24px | 10px |
| Text weight | 1000 | 1000 | 1000 |
| Text stroke | 1px | 0.5px | 0.25px |
| Icon size | 38px | 24px | 10px |
| Default icon stroke | 1.9px | 2px | 1.5px |
| Secondary focus-outline width (when applicable) | 1.95px | 1.3px | 0.65px |
| Standard gap token | 4px | 4px | 4px |
| Text transform | Uppercase | Uppercase | Uppercase |
| Letter spacing | -0.02em | -0.02em | -0.01em |
| Line height | 0.86 | 0.86 | 1.0 |

**Color/ratio invariant:** A size change scales geometry and typography; it must not silently change primary/secondary color ownership, text weight, label centering, split-rail color, or row-fill behavior.

## 3. Fixed-ratio primitive families

A fixed ratio belongs to the actual control face, indicator, rail, or segment. It does not mean the complete parent row must stop filling available width.

| Primitive family | Fixed geometry / ratio | Color and alignment |
|---|---|---|
| Square toggles / selectable square controls | 1:1 face, sized to the selected tier | Primary default face; selected alternate treatment may use secondary; mark centered |
| Switches | Preserve the supplied 44px reference geometry: standard track 75.68 × 44px (1.72:1), round track radius 999px; handle 36.667 × 36.667px with 3.667px inset. Scale proportionally for a supported compact variant only when its implementation explicitly supports it. | Track/handle colors follow the selected skin; handle centered vertically and travels symmetrically |
| Checkbox | 1:1 square face at the selected size; centered check/X glyph | Primary/secondary skin rules; mark centered; mark stroke explicitly defined per skin |
| Radio button | 1:1 outer footprint; circular face/indicator; centered inner dot | Skin/state owns colors; dot centered |
| Square icon button | 1:1 outer face at selected size | Primary for v1; secondary for v2; v3 swaps primary/secondary when selected; v4 black face with primary icon; icon centered |
| Circle icon button | 1:1 footprint with circular face | Same palette variants as square icon button; glyph centered and inset using the named icon preset |
| Inline stepper | Horizontal 1:2:1 composition: square decrement action : flexible value field : square increment action | Action faces use size-tier geometry and global colors; glyphs centered |
| Split stepper | Editable value pane is 2:1 relative to its square action rail; action rail is vertically split into two equal actions | Shared borders; centered action glyphs; selected size determines rail dimension |
| Split-left button/badge | Square icon rail: 1:1 at selected tier; remaining label area flexes | Secondary rail by default, size-tier icon centered; label centered in remaining region |
| Split-right badge | Square action rail: 1:1 at selected tier; label region flexes | Secondary rail by default, centered icon and centered label |
| Double-split badge | Two square rails, each 1:1 at selected tier; flexible label region between | Both rails secondary by default; centered icons; exactly two shared dividers |
| Unified split shell | `StudioSplitShell` is the single left/right/double anatomy used by split-left buttons, split badges, and username inputs; button uses `faceOnly`, username uses the field slot | One size-token owner for rail dimensions, divider stroke, centered label typography, shell radius, and clipping; BEM class names remain compatibility hooks |
| Close control within closeable badge | Circular 1:1 face sized from the badge's tier | Secondary fill; icon centered; does not reintroduce a pill ratio for the badge |

## 4. Text-content-width primitive families

These are content-driven components, not fixed-width row controls. Their intrinsic width is intentional; parent layout may still constrain them.

| Primitive | Width behavior | Shared rules / allowed difference |
|---|---|---|
| Spectrum tags | Intrinsic/content width | Alphabetical spectrum color mapping is the registered visual exception below; label centered and heavy |
| Closeable tags/badges | Intrinsic/content width based on label + close control | No pill ratio; global size tier, border, radius, font weight, and palette. Close icon centered |
| Word toggles | Width determined by the words and their measured active segment; must stay inside its container | Active handle fits measured word without overlap or overflow; text centered; state swaps color only and does not change outer geometry |
| Tag editor | Row/container may fill; individual tags remain content-width; action controls are square | Plus/check actions use compact 28px / 2px / 4px geometry unless a future documented size variant is added |

## 5. Text fields — explicit alignment and state contract

**Both single-line text inputs and multiline textareas are left-aligned.** Text alignment is not a size variant and must never flip to right alignment.

### Single-line input (default)

- Typography ownership: the native input value/placeholder remains 38px standard / 24px compact. Floating-label presentation scales only the raised label to its registered 80% size; it must never shrink the native input text.
- Alignment: left; vertically centered.
- Standard/compact type: 38px / 24px, weight 1000, uppercase, `-0.02em` tracking, 0.86 line-height.
- Geometry: 44px / 28px high, 3px / 2px border, 6px / 4px radius.
- Resting fill: primary color at 50% opacity.
- Resting value, placeholder, and caret: primary color.
- Outer border: black, size-tier stroke.
- Inline text stroke: primary color, matching the outer border width.
- Focus fill: primary color at 15% opacity.
- Focus text: black.
- Focus outline: secondary color at 100% opacity, width 65% of the selected border (1.95px / 1.3px / 0.65px standard / compact / micro), outline offset 0.
- Focus must not shift layout. Do not add a gap between the field and its focus outline.

### Multiline textarea (registered typography exception)

- Alignment: left; text starts at the top of the writing area with normal multiline padding.
- Standard type: 18px, weight 1000, 0.5px text stroke, line-height 1.25.
- Compact type: 14px, weight 1000, 0.35px text stroke, line-height 1.3.
- Minimum writing surface: 92px.
- Resize: vertical.
- Geometry still follows the selected size tier: standard 44px family / 3px border / 6px radius; compact 28px family / 2px border / 4px radius. The 92px minimum surface may make the textarea taller than the nominal one-line control height.
- Rest/focus fill and color contract matches the text input: 50% primary at rest, 15% primary on focus, primary text at rest, black text on focus, secondary 100%-opacity outline at 65% of the selected border width, offset 0.
- Floating/fixed label variants are presentation variants of the same textarea primitive, not separate typography or border systems.

## 6. Registered primitive-specific exceptions

Exceptions are allowed only when documented here, in `STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS`, and in the Confirmed Primitive Library. An exception must not accidentally propagate to other components.

| Exception | Exact exception | Why it exists |
|---|---|---|
| Vault spectrum tag | 15px high, 2px border, 4px radius, 8px type, weight 900, 0.3px letter spacing; alphabetical spectrum fill mixed 35% with white; resolved spectrum text/border color | Dense asset-vault metadata chip with an established spectrum-color identity |
| Closeable badge | Not a global-rule exception: standard/compact/micro 44/28/14px height, 3/2/1px border, 6/4/2px radius, 38/24/10px type, weight 1000, uppercase, black text, primary fill; circular close action uses secondary fill | Must follow global size/color/type rules; explicitly no 999px pill geometry |
| Tag editor plus/check action | Compact 28px face, 2px stroke, 4px radius, no shadow | Dense inline tag-editing affordance; action remains square |
| Textarea typography | 18px standard / 14px compact, 0.5px / 0.35px text stroke, line-height 1.25 / 1.3, min-height 92px, vertical resize | Multiline reading/writing needs a separate text scale and taller surface |
| Prominent action button | Separate 56px action family, 3px stroke, 6px radius, no shadow | Workflow emphasis is not a third size tier of ordinary 44px/28px controls |
| Switch/choice geometry | 44px reference uses 7.333px rectangular radius, 1.72:1 switch track, and the exact handle/indicator ratios in §3 | Matches the supplied 44px HTML reference; does not redefine ordinary button/field radius |
| Icon preset variants | Default large preset is 38px / 1.9 standard and 24px / 2.0 compact; moderate 34px/22px and compact 28px/18px are opt-in only | Optional icon density must not silently become the global default |
| Floating-label variants | Labels add presentation only; native field geometry, type scale, alignment, focus, and textarea behavior remain owned by the field primitive | Prevents a second field family and duplicate borders/focus rings |

## 7. Global prohibitions and governance

1. No undocumented pill-ratio badge styling.
2. No thin inherited badge font; use Inter weight 1000 for global badges and their labels. The Vault Spectrum Tag is the explicitly registered weight-900 exception.
3. No hard-coded 48px control size. The canonical ordinary lattice is 44px / 28px, plus the explicitly defined 14px micro tier.
4. No asymmetric split rails, off-center icons, label misalignment, or duplicated split borders.
5. No fixed-width ordinary buttons/fields where row-fill is required; intrinsic width is reserved for content primitives.
6. No global rule should override a named exception, and no exception should leak to sibling primitives.
7. Catalog entries must render the production component, list its source path and non-default settings, and clearly label static preview states.
8. Source assertions alone are not visual certification. Required release verification: run focused tests, typecheck, production build, and browser inspection of all size tiers, split variants, text alignment, badge weight, switch/choice ratios, and field focus states.
9. Update this reference, the machine-readable tokens/exception registry, CSS, and Confirmed Primitive Library together whenever a contract changes.

## 8. Canonical source ownership

- Global size and field tokens: `src/studio-ui/tokens.ts`
- Component APIs and exception registry: `src/studio-ui/primitives/StudioControls.tsx`
- Single-line input implementation: `src/studio-ui/primitives/StudioTextInput.tsx`
- Textarea implementation: `src/studio-ui/primitives/StudioTextArea.tsx`
- Effective style rules: `src/styles/studio-control-system.css`
- Production primitive specimens: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- Catalog-only presentation: `src/components/studio-hub/studio-hub-primitive-catalogs.css`

**Verification status:** This document records the intended canonical contract. Do not infer that all runtime visuals are certified until the checks and browser verification in §7 have actually passed.

---

## Historical audit archive

The material below this point is retained for provenance only. Its dated findings, prior defaults, and incomplete plans do not override the definitive contract above. Where historical entries disagree with §§1–8, §§1–8 win and the implementation must be reconciled.

