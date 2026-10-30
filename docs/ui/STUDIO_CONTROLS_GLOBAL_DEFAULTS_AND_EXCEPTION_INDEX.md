# Studio Controls — Definitive Global Defaults, Size Contract & Primitive Exceptions

**Status:** Canonical requirements reference; implementation and rendered verification must be checked against the source files below.  
**Reviewed:** 2026-10-30  
**Repository:** `viewtube-dev/viewtube`  
**Work branch:** `codex/shared-studio-interaction-focus` (implementation branch); `master/consolidated-feature-integration` remains the integration target  
**Canonical sources:** `src/studio-ui/tokens.ts`, `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/primitives/StudioValueToggles.tsx`, `src/studio-ui/primitives/StudioSplitAccordion.tsx`, `src/styles/studio-control-system.css`, `src/styles/studio-control-split.css`, `src/styles/studio-control-focus.css`  
**Rendered reference:** `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and `src/components/studio-hub/studio-hub-primitive-catalogs.css`

> This document is the normative reference for Studio primitives. Historical notes and old audit snapshots elsewhere in this file are superseded by this section. When implementation differs, treat it as drift to fix—not as a new default—unless an exception is explicitly registered below and represented in the Confirmed Primitive Library.

## Confirmed catalog ownership and certification

The Confirmed Primitive Library is a production-component specimen and provenance surface—not a second control implementation. Specimens import real primitives from `src/studio-ui/primitives/StudioControls.tsx`. The catalog stylesheet owns family cards, grids, specimen arrangement, and disclosure panels; production control geometry, typography, fill, stroke, shadow, and motion belong to the Studio token/control stylesheet system.

**NON-DEFAULT SETTINGS** must list only true departures from shared defaults. Do not repeat the 44px/28px lattice, global typography, ordinary selected/disabled behavior, or generic interaction rules under every family. Keep family-specific anatomy, real variants, and registered exceptions; put global contracts in the defaults strip and this index.

The current five-tier ladder is Supreme 60px, Standard 44px, Compact 28px, Mini 20px, and Micro 12px. Micro is a supported interactive size. A 14px badge or a fixed 20px closeable badge is a named component exception; neither changes the global ladder. Do not add a second token generator or duplicate generated stylesheet when the current source already owns the contract.

A family is **source-confirmed** only when its specimen uses the production export, provenance identifies TSX/CSS/tokens/import paths, exception notes are concise, and source/API regression tests cover the public contract. Full visual certification additionally requires computed-style/browser evidence for standard, compact, and applicable exception sizes. The word “confirmed” alone is not proof that visual regression passed.


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
| Default fill | Fields use 50% primary fill at rest and 15% on focus. Solid button/badge/action faces may use 100% primary only where their family contract explicitly specifies a solid face; do not generalize that exception to fields or all controls. |
| Alternate / split-rail fill | Secondary color; split icon rails are secondary by default |
| Default label color | Black (`#000`) unless a primitive/state contract explicitly specifies primary-colored text |
| Default outer border | Black (`#000`) |
| Label alignment | Centered for buttons, badges, split labels, steppers' action controls, radio/checkbox marks, and icon buttons |
| Icon alignment | Centered on both axes within its face/rail; use the selected size tier's icon size/stroke |
| Default width | Fill the available row/module width (`width: 100%` / flex-fill) |
| Intrinsic-width exception | Text-content primitives may opt into content width; they must not force every ordinary control to intrinsic width |
| Split sections | Icon/action rail is fixed by the selected size tier; label region flexes into remaining width; label is centered within its region |
| Split dividers | Exactly one shared divider for a single split; exactly two shared dividers for a double split; no duplicated adjacent borders |
| Internal gap (split shells) | `0` — rails and faces are flush with no white seam; the 4px spacing unit applies only to external gaps between whole controls in grids/rows |
| Shadows and movement | No shadow, transition, hover/click translation, or geometry movement on canonical Studio primitive shells. Any legacy motion/effect must be explicitly named and approved; no shadow-based geometry compensation |
| Focus | No layout shift. Text input/textarea focus outline offset is 0; focus color/width are specified in the field contract |
| Width vs ratio | Row fill is the default layout rule; fixed aspect ratios constrain the control face/rail, not the surrounding row's ability to fill its module |

## 2. Size-based global defaults

The size tier determines height, border stroke, radius, typography, icon size, and icon stroke. Do not independently override one of these properties without a registered exception.

| Property | Supreme | Standard | Compact | Mini | Micro |
|---|---:|---:|---:|---:|---:|
| Control height | 60px | 44px | 28px | 20px | 12px |
| Border/stroke width | 3px | 3px | 2px | 1.5px | 1px |
| Corner radius | 6px | 6px | 4px | 3px | 2px |
| Text size | 52px | 38px | 24px | 17.5px | 10px |
| Text weight | 1000 | 1000 | 1000 | 1000 | 1000 |
| Text stroke | 1px | 1px | 0.5px | 0.4px | 0.4px |
| Icon size | 52px | 38px | 24px | 17.5px | 10px |
| Default icon stroke | 1.9px | 1.9px | 2px | 1.6px | 1.5px |
| Secondary focus-outline width | 1.95px | 1.95px | 1.3px | 0.975px | 0.65px |
| Standard gap token | 4px (external only) | 4px | 4px | 4px | 4px |
| Floating-label height | 44px | 32px | 21px | 17.5px | 10px |
| Floating-label raised-offset ratio | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
| Text transform | Uppercase | Uppercase | Uppercase | Uppercase | Uppercase |
| Letter spacing | -0.02em | -0.02em | -0.02em | -0.02em | -0.02em |
| Line height | 1 | 0.86 | 0.86 | 1 | 1 |

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

## Dropdown, counter, and slider shared contracts

- **Dropdown chevrons:** one token-owned size/stroke source shared by the simple single-select, split-left dropdown, and Legend Multi dropdown. Standard glyph 28px / stroke 2.5; compact glyph 18px / stroke 1.65. The trailing chevron always occupies the right rail.
- **Simple dropdown:** value pane plus trailing chevron only; it must not render a split rail.
- **Split-left dropdown:** canonical split-shell outer border; fixed leading rail uses secondary fill and a centered black icon; the value pane flexes; a separate trailing rail contains the chevron. Do not put the chevron in the icon rail or add duplicate adjacent borders.
- **Side counter action divider:** horizontal separator is a centered overlay at the 50% boundary, with thickness equal to the selected counter stroke token. It does not consume either action row's height.
- **Counter / slider numeral state:** at rest, number fill and glyph stroke share the 50% white mix of the number-area background. On focus, press, or hold, number fill and stroke are both black. Right-counter value-area background remains unchanged while active.
- These are shared contracts, not family-specific size exceptions. Tokens own dimensions and state colors, generated CSS variables mirror the token module, CSS owns the rendering, and the production primitive owns semantic markup.

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
- Floating-label shared metrics (identical for `StudioTextInput` and `StudioTextArea` at the same size tier): resting label height 32px standard / 21px compact (line-height 1, so the label box height equals its font size); raised label at 80% = 25.6px / 16.8px; the raised label sits 48% above the outer black border (prior 40% × the 1.2 offset ratio). Text inputs and text areas must read the same `floatingLabelHeight` / `floatingLabelOffsetRatio` tokens — no separate hard-coded values per field type.
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
- Floating/fixed label variants are presentation variants of the same textarea primitive, not separate typography or border systems. Floating labels use the shared label metrics registered in §5 (32px / 21px resting height, 80% raised scale, 48% raised offset) — identical to text inputs at the same size tier.
- No internal gap: textarea shells and any split anatomy inside them are flush; the 4px spacing unit is reserved for external gaps between whole controls.

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
| Studio upload frame | Ratio-based media canvas: 16:9 at every breakpoint, 12px outer radius, 2px inset black frame with 4px primary + 2px secondary inner strokes; center circle keeps 4px primary + 2px secondary outer rings before and after upload; pill typography uses compact 24px / Inter 1000 / -.02em; no shadow | Upload surface is a canvas, not a fixed-height ordinary control |

## 7. Global prohibitions and governance

1. No undocumented pill-ratio badge styling.
2. No thin inherited badge font; use Inter weight 1000 for global badges and their labels. The Vault Spectrum Tag is the explicitly registered weight-900 exception.
3. No hard-coded 48px control size. The canonical ordinary lattice is 44px / 28px, plus the explicitly defined 14px micro tier.
4. No asymmetric split rails, off-center icons, label misalignment, or duplicated split borders.
5. No internal gap on any control shell: split rails and faces are flush (no white seam), and the 4px spacing unit is for external grids/rows between whole controls only.
6. No fixed-width ordinary buttons/fields where row-fill is required; intrinsic width is reserved for content primitives.
7. No global rule should override a named exception, and no exception should leak to sibling primitives.
8. Catalog entries must render the production component, list its source path and non-default settings, and clearly label static preview states.
9. Source assertions alone are not visual certification. Required release verification: run focused tests, typecheck, production build, and browser inspection of all size tiers, split variants, text alignment, badge weight, switch/choice ratios, and field focus states.
10. Update this reference, the machine-readable tokens/exception registry, CSS, and Confirmed Primitive Library together whenever a contract changes.

## 8. Canonical source ownership

- Global size and field tokens: `src/studio-ui/tokens.ts`
- Component APIs and exception registry: `src/studio-ui/primitives/StudioControls.tsx`
- Single-line input implementation: `src/studio-ui/primitives/StudioTextInput.tsx`
- Textarea implementation: `src/studio-ui/primitives/StudioTextArea.tsx`
- Effective style rules: `src/styles/studio-control-system.css`
- Production primitive specimens: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- Canonical upload frame: `StudioUploadFrame` in `src/studio-ui/primitives/StudioControls.tsx`, styled in `src/styles/studio-control-system.css` and demonstrated in the Confirmed Primitive Library.
- Catalog-only presentation: `src/components/studio-hub/studio-hub-primitive-catalogs.css`

**Verification status:** This document records the intended canonical contract. Do not infer that all runtime visuals are certified until the checks and browser verification in §7 have actually passed.

---

## Historical audit archive

The material below this point is retained for provenance only. Its dated findings, prior defaults, and incomplete plans do not override the definitive contract above. Where historical entries disagree with §§1–8, §§1–8 win and the implementation must be reconciled.



## Unified split-shell stabilization update — 2026-10-17

The split-left button, split-left/right/double badges, and username composite input use the shared `StudioSplitShell` anatomy in `src/studio-ui/primitives/StudioControls.tsx`. The shell exposes `data-vt-studio-split=left|right|double`, `data-vt-studio-split-rail` with `data-rail=start|end`, and `data-vt-studio-split-label`. Button face-only mode reuses the same rail/label markup inside `StudioButton`.

### Stabilized defaults

- Standard / compact / micro face geometry: 44px / 28px / 14px; border: 3px / 2px / 1px; radius: 6px / 4px / 2px; typography and icon: 38px / 24px / 10px.
- Inter-component gap remains 4px for all tiers; micro is half the compact geometry.
- Studio shells are flat: no shadow, hover/press transform, or geometry-moving transition.
- Both rails in a double split use the secondary color role.
- Text-field focus uses a secondary outline at 65% of border width and zero offset.
- Width defaults to row fill. Content width is opt-in through `data-vt-studio-width="content"` for spectrum tags and closeable badges only.
- The generated CSS variables are maintained by `scripts/emit-studio-control-vars.mjs`; generated output is committed at `src/styles/studio-control-vars.generated.css`.

### Contract files

- `src/studio-ui/tokens.ts`: size ladder, width exceptions, color roles and CSS-var projection.
- `src/styles/studio-control-core.css`: flat geometry, size tiers and width policy.
- `src/styles/studio-control-split.css`: shared split grid, rail and label contract.
- `src/styles/studio-control-fields.css`: inline field stroke and focus contract.
- `src/studio-ui/primitives/studio-control-contract.test.ts`: focused invariants for size tiers, double rails, focus treatment and exception registration.

Visual verification is still required in the running app for standard/compact/micro split badges, username input, and split-left buttons. Automated tests and typecheck must be run in CI or a checked-out workspace before merge; remote repository editing in this session did not provide a runnable local checkout.
