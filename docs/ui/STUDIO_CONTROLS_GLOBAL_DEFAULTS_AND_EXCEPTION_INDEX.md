# Studio Controls — Definitive Global Defaults, Size Contract & Primitive Exceptions

**Status:** Canonical requirements reference; implementation and rendered verification must be checked against the source files below.  
**Reviewed:** 2026-10-27  
**Repository:** `viewtube-dev/viewtube`  
**Work branch:** `master/consolidated-feature-integration` (canonical integration target)  
**Canonical sources:** `src/studio-ui/tokens.ts`, `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/primitives/StudioTextInput.tsx`, `src/studio-ui/primitives/StudioTextArea.tsx`, `src/studio-ui/primitives/StudioSplitAccordion.tsx`, `src/styles/studio-control-system.css`, `src/styles/studio-split-accordion.css`  
**Rendered reference:** `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and `src/components/studio-hub/studio-hub-primitive-catalogs.css`

> This document is the normative reference for Studio primitives. Historical notes and old audit snapshots elsewhere in this file are superseded by this section. When implementation differs, treat it as drift to fix—not as a new default—unless an exception is explicitly registered below and represented in the Confirmed Primitive Library.

## Confirmed catalog ownership and certification

The Confirmed Primitive Library is a production-component specimen and provenance surface—not a second control implementation. Specimens import real primitives from `src/studio-ui/primitives/StudioControls.tsx` or a dedicated production primitive module when the family is intentionally standalone (for example, `StudioSplitAccordion`). The catalog stylesheet owns family cards, grids, specimen arrangement, and disclosure panels; production control geometry, typography, fill, stroke, shadow, and motion belong to the Studio token/control stylesheet system.

**NON-DEFAULT SETTINGS** must list only true departures from shared defaults. Do not repeat the 44px/28px lattice, global typography, ordinary selected/disabled behavior, or generic interaction rules under every family. Keep family-specific anatomy, real variants, and registered exceptions; put global contracts in the defaults strip and this index.

The canonical five-tier ladder is Supreme (60px), Standard (44px), Compact (28px), Mini (20px), and Micro (12px). Mini uses 1.5px stroke, 3px radius, and 17.5px type/icons. Micro keeps 12px height and 10px type/icons while inheriting Mini's 1.5px stroke, 3px radius, 0.975px outline, and global `-0.02em` letter-spacing. TypeScript tokens are the only sizing authority; generated CSS is emitted from tokens and `studio-control-system.css` consumes it.

A family is **source-confirmed** only when its specimen uses the production export, provenance identifies TSX/CSS/tokens/import paths, exception notes are concise, and source/API regression tests cover the public contract. Full visual certification additionally requires computed-style/browser evidence for standard, compact, and applicable exception sizes. The word “confirmed” alone is not proof that visual regression passed.


## Split Accordion — independent primitive contract (2026-10-22)

- Canonical component: `src/studio-ui/primitives/StudioSplitAccordion.tsx`; family stylesheet: `src/styles/studio-split-accordion.css`.
- It is a new standalone implementation. It must not import, wrap, or depend on the retired `StudioSplitRailAccordion` implementation.
- Supported size API is Standard (44px), Compact (28px), and Micro (12px). The outer shell uses the shared tier stroke/radius; inner icon faces remain square (38px / 24px / 10px).
- Horizontal single-open layout defaults to the rightmost enabled item. Left, right, and double split layouts are supported; keyboard navigation uses arrow keys, Home, and End.
- Activation holds hover-preview changes for 280ms. Reduced-motion removes the CSS transition while preserving deterministic interaction state.
- No shadow, fake shadow, movement, or component-specific global-token change is introduced. Panel content is hidden when inactive and is labelled by its controlling trigger.
- The Confirmed Primitive Library specimen and component/catalog contract tests are the source-certification surface. Visual browser certification must be reported separately from source/test certification.

## 1. Global defaults — independent of size

These rules apply first. The selected size tier changes dimensions, not the meaning of the shared color, alignment, typography, or layout rules.

| Property | Canonical default |
|---|---|
| Font family | `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| Font weight | `1000` (maximum-heavy emphasis); no accidental thin inherited weight |
| Font synthesis | Disabled for badge labels where supported, so synthetic light styles do not override the heavy weight |
| Text transform | Uppercase for control labels and tags |
| Letter spacing | `-0.02em`; only named component exceptions may differ |
| Baseline line-height | `1` for single-line controls; textarea multiline exception is `0.85` from the multiline token |
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

The intended size contract is Supreme (60px / 3px / 6px / 52px), Standard (44px / 3px / 6px / 38px), Compact (28px / 2px / 4px / 24px), Mini (20px / 1.5px / 3px / 17.5px), and Micro (12px / 1.5px / 3px / 10px), expressed as height / border stroke / radius / type size. Supreme deliberately reuses the Standard stroke/radius system; Micro reuses the Mini stroke/radius system. Global line-height `1` remains the single-line default; textarea uses the explicit multiline exception `0.85`.

| Property | Supreme | Standard | Compact | Mini | Micro |
|---|---:|---:|---:|---:|
| Control height | 60px | 44px | 28px | 20px | 12px |
| Border/stroke width | 3px | 3px | 2px | 1.5px | 1.5px |
| Corner radius | 6px | 6px | 4px | 3px | 3px |
| Text size | 52px | 38px | 24px | 17.5px | 10px |
| Text weight | 1000 | 1000 | 1000 | 1000 | 1000 |
| Text stroke | 1px | 1px | 0.5px | 0.4px | 0.4px |
| Icon size | 52px | 38px | 24px | 17.5px | 10px |
| Default icon stroke | 1.9 | 1.9 | 2 | 1.6 | 1.6 |
| Secondary focus-outline width (when applicable) | 1.95px | 1.95px | 1.3px | 0.975px | 0.975px |
| Standard gap token | 4px external only | 4px | 4px | 4px | 4px |
| Floating-label height | 52px where supported | 38px | 24px | 17.5px where supported | 10px where supported |
| Floating-label raised-offset ratio | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
| Text transform | Uppercase | Uppercase | Uppercase | Uppercase | Uppercase |
| Letter spacing | -0.02em | -0.02em | -0.02em | -0.02em | -0.02em |
| Line height | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |

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
| Split-left button/badge | Square icon rail: 1:1 at selected tier; remaining label area flexes | Secondary rail by default, size-tier icon centered; label centered in remaining region |
| Split-right badge | Square action rail: 1:1 at selected tier; label region flexes | Secondary rail by default, centered icon and centered label |
| Double-split badge | Two square rails, each 1:1 at selected tier; flexible label region between | Both rails secondary by default; centered icons; exactly two shared dividers |
| Unified split shell | `StudioSplitShell` is the single left/right/double anatomy used by split-left buttons and split badges; button uses `faceOnly`, username uses the field slot | One size-token owner for rail dimensions, divider stroke, centered label typography, shell radius, and clipping; BEM class names remain compatibility hooks |
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

- Typography ownership: the native input value/placeholder remains 38px standard / 24px compact. Floating-label presentation keeps the native input text unchanged; the shared raised label is 18px for every field type and size.
- Floating-label shared metrics (identical for `StudioTextInput` and `StudioTextArea` at the same size tier): resting label typography follows the primitive: input 38px / 24px and textarea 18px / 14px, with matching primitive color and text-stroke; all raised labels share one 18px rule; the raised label sits 48% above the outer black border (prior 40% × the 1.2 offset ratio). Text inputs and text areas must read the same `floatingLabelHeight` / `floatingLabelOffsetRatio` tokens — no separate hard-coded values per field type.
- Alignment: left; vertically centered.
- Standard/compact type: 38px / 24px, weight 1000, uppercase, `-0.02em` tracking, default line-height (`1`).
- Geometry: 44px / 28px high, 3px / 2px border, 6px / 4px radius.
- Resting fill: primary color at 50% opacity.
- Resting value, placeholder, and caret: primary color.
- Outer border: black, size-tier stroke.
- Resting inline text stroke: primary color, matching the resting text color and selected size-tier width.
- Focus fill: primary color at 15% opacity.
- Focus text and inline text stroke: black (`#000000`), matching one another.
- Focus caret: primary color (`--pair-a`), not black.
- Focus outline: secondary color at 100% opacity, width 65% of the selected border (1.95px standard / 1.3px compact / 0.975px Mini and Micro), outline offset 0.
- Focus must not shift layout. Do not add a gap between the field and its focus outline.
- Micro inherits Mini's 0.975px outline (65% of the 1.5px stroke). All controls and floating-field wrappers consume the same tier token; no Micro-specific override is permitted.

### Multiline textarea (registered typography exception)

- Alignment: left; text starts at the top of the writing area with normal multiline padding.
- Standard type: 18px, weight 1000, 0.5px text stroke, multiline line-height (`0.85`).
- Compact type: 14px, weight 1000, 0.35px text stroke, multiline line-height (`0.85`).
- Minimum writing surface: 92px.
- Resize: vertical.
- Geometry still follows the selected size tier: standard 44px family / 3px border / 6px radius; compact 28px family / 2px border / 4px radius. The 92px minimum surface may make the textarea taller than the nominal one-line control height.
The multiline exception is sourced from `STUDIO_CONTROL_SIZE_BASE.multiline` in `src/studio-ui/tokens.ts` and emitted by `scripts/emit-studio-control-vars.mjs` into `src/styles/studio-control-vars.generated.css`. Do not use the single-line input font-size or text-stroke tokens for textarea glyphs.

- Rest/focus fill and color contract matches the text input: 50% primary at rest, 15% primary on focus, primary text at rest, black text on focus, secondary 100%-opacity outline at 65% of the selected border width, offset 0.
- Floating/fixed label variants are presentation variants of the same textarea primitive, not separate typography or border systems. Resting floating labels match the native field primitive and size tier; every raised label is 18px, regardless of input/textarea type or standard/compact size.
- No internal gap: textarea shells and any split anatomy inside them are flush; the 4px spacing unit is reserved for external gaps between whole controls.

## 6. Registered primitive-specific exceptions

Exceptions are allowed only when documented here, in `STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS`, and in the Confirmed Primitive Library. An exception must not accidentally propagate to other components.

| Exception | Exact exception | Why it exists |
|---|---|---|
| Vault spectrum tag | 15px high, 2px border, 4px radius, 8px type, weight 900, 0.3px letter spacing; alphabetical spectrum fill mixed 35% with white; resolved spectrum text/border color | Dense asset-vault metadata chip with an established spectrum-color identity |
| Closeable badge | Named family exception: 20px pill height, no outer border, 16px Inter 1000 uppercase label, primary fill, 16px secondary close control with primary glyph | Dense removable metadata chip; this fixed geometry does not redefine the global five-tier lattice |
| Tag editor plus/check action | Compact 28px face, 2px stroke, 4px radius, no shadow | Dense inline tag-editing affordance; action remains square |
| Textarea typography | 18px standard / 14px compact, 0.5px / 0.35px text stroke, line-height `0.85`, min-height 92px, vertical resize | Multiline reading/writing needs a separate text scale and taller surface |
| Prominent action button | Supreme 60px by default; standard/compact variants use shared tier tokens; flat shell, no shadow | Workflow emphasis is a component role, not a separate 56px geometry tier |
| Switch/choice geometry | 44px reference uses 7.333px rectangular radius, 1.72:1 switch track, and the exact handle/indicator ratios in §3 | Matches the supplied 44px HTML reference; does not redefine ordinary button/field radius |
| Icon preset variants | Default large preset is 38px / 1.9 standard and 24px / 2.0 compact; moderate 34px/22px and compact 28px/18px are opt-in only | Optional icon density must not silently become the global default |
| Floating-label variants | Labels add presentation only; native field geometry, type scale, alignment, focus, and textarea behavior remain owned by the field primitive | Prevents a second field family and duplicate borders/focus rings |
| Studio upload frame | Responsive 16:9 canvas; container-relative quarter-width breathing-layer strokes and spacing; left upload/right thumbnail split rails; two-line half-scale prompt; uploaded image preview grows to 3× its original circle size with primary/secondary rings slightly clipped at the frame edges; filename badge overlays the bottom; no shadow | Upload surface is a canvas, not a fixed-height ordinary control |

## 7. Global prohibitions and governance

1. No undocumented pill-ratio badge styling.
2. No thin inherited badge font; use Inter weight 1000 for global badges and their labels. The Vault Spectrum Tag is the explicitly registered weight-900 exception.
3. No hard-coded intermediate control sizes. The canonical lattice is Supreme 60px / Standard 44px / Compact 28px / Mini 20px / Micro 12px; documented content-driven and family-specific exceptions remain explicit.
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

- Supreme / standard / compact / mini / micro face geometry: 60px / 44px / 28px / 20px / 12px; border: 3px / 3px / 2px / 1.5px / 1.5px; radius: 6px / 6px / 4px / 3px / 3px; typography and icon: 52px / 38px / 24px / 17.5px / 10px.
- Inter-component gap remains 4px for all tiers; micro is an explicit 12px tier and is not derived by halving Compact.
- Studio shells are flat: no shadow, hover/press transform, or geometry-moving transition.
- Both rails in a double split use the secondary color role.
- Text-field focus uses a secondary outline at 65% of border width and zero offset.
- Width defaults to row fill. Content width is opt-in through `data-vt-studio-width="content"` for spectrum tags and closeable badges only.
- The generated CSS variables are maintained by `scripts/emit-studio-control-vars.mjs`; generated output is committed at `src/styles/studio-control-vars.generated.css`.

### Contract files

- `src/studio-ui/tokens.ts`: size ladder, width exceptions, color roles and complete CSS-var projection (`studioSizeTierToCssVars` includes typography, icon stroke, focus, fill, and floating-label metrics).
- `src/styles/studio-control-core.css`: flat geometry, size tiers and width policy.
- `src/styles/studio-control-split.css`: shared split grid, rail and label contract.
- `src/styles/studio-control-fields.css`: inline field stroke and focus contract.
- `src/studio-ui/primitives/studio-control-contract.test.ts`: focused invariants for size tiers, double rails, focus treatment and exception registration.

Visual verification is still required in the running app for supreme/standard/compact/micro split badges and split-left buttons. Automated tests and typecheck must be run in CI or a checked-out workspace before merge; remote repository editing in this session did not provide a runnable local checkout.


## Vertical Studio word toggle — registered height exception

- Canonical primitive: `StudioVerticalWordToggle` in `src/studio-ui/primitives/StudioControls.tsx`; CSS owner: `src/styles/studio-control-system.css`; live specimens: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`.
- The two stacked word faces create a content-driven height. This is the sole size-lattice exception: standard typography/stroke/radius tokens remain 38px / 3px / 6px, compact remains 24px / 2px / 4px, and Micro uses 10px type with the shared Mini 1.5px / 3px stroke/radius system. The resulting overall height is content-driven and is not forced to the 60px / 44px / 28px / 12px lattice.
- Four variants: primary/secondary pair; black fill with the inactive word colored to match the handle color at the start of the last transition and the active word black on the colored handle; primary fill/border with secondary text and a white handle; white fill/border with a black handle and inverse text.
- Word colors change quickly at the beginning of the handle animation; the handle expands vertically, releases to the other word, and uses a vertical color wipe on alternating transitions. Reduced-motion settles immediately.
- Catalog layout: standard two per row; compact three per row; a 2×2 micro matrix occupies the remaining two cells at the end of compact row two. Every specimen has independent state.


## Brain LED status badge — registered component variant

- Canonical primitive: `StudioBrainStatusBadge` in `src/studio-ui/primitives/StudioControls.tsx`; CSS owner: `src/styles/studio-control-system.css`; Component Library specimens: `Brain Status LED Badges` in `StudioHubCompletePrimitiveCatalog.tsx`.
- Anatomy: borderless pill badge with white uppercase text on black, or black uppercase text on a lighter tint matching the saturated LED color. A smaller LED sits to the left of the label; the LED core does not change the badge's layout size.
- Tones: green, cyan, purple, yellow, red, and blue. Variants include dark-fill/saturated-LED and light-tinted-fill/black-text.
- Density variants: standard (24px badge surface, 10px LED), compact (20px surface, 8px LED), and micro (12px surface, 5px LED). These are status badges, not ordinary 44px/28px input/button geometry.
- Active LED ripple follows the library's eight-second cycle: saturated ring starts at the LED core, expands to five times its size over three seconds and fades. Reduced-motion disables the ripple. Inactive state dims the core and removes the ripple.
- Status labels are descriptive, not actions. Consumers must pass the real status and must not show “ready”, “synced” or “complete” unless the owning workflow reports that state.


## Brain status indicator variant family

`StudioBrainStatusIndicator` uses rectangular 44/28/12px tiers with 6/4/2px corner radii. Its LED has a 1px black lens outline at 65% diameter with 60%-opacity white overlay, saturated state glow/ripples, and reduced-motion fallback. Dark variant uses white text; tinted variant uses black text. See the Studio Controls primitive and component-library source of truth.


## Confirmed Primitive Library grid contract — 2026-10-20

The Confirmed Primitive Library uses a **single 4px gap unit** for all catalog-level and nested grid/row spacing. The final normalization layer in `src/components/studio-hub/studio-hub-primitive-catalogs.css` sets catalog gaps, family spacing, specimen spacing, and control-matrix spacing to `--vt-confirmed-space-1` (4px). It is layout-only and must not alter production primitive geometry.

- Use CSS Grid with `minmax(0, 1fr)` columns for equal-width specimens; use `min-width: 0` and `box-sizing: border-box` to prevent overflow.
- Full-row specimens span all grid columns. Textareas and wide field examples occupy the full row.
- Choice/radio/checkbox skins retain four columns where the content fits; standard word toggles remain one per row and compact word toggles remain two per row. Square icon variants may use a four-item row with horizontal overflow when necessary.
- Responsive rules change placement only. They must not change production size tier, stroke, typography, fill, split anatomy, or behavior.
- The confirmed catalog imports production primitives from `src/studio-ui/primitives/StudioControls.tsx`. The complete catalog is a legacy comparison surface and must not be treated as the geometry source of truth.
- The grid contract is regression-tested in `src/studio-ui/primitives/studio-control-contract.test.ts`. Source tests do not replace browser verification at desktop and narrow mobile widths, including open dropdowns, textareas, split controls, compact specimens, and status badges.


## Source reconciliation audit — 2026-10-27

### Intended contract versus observed source

| Concern | Intended contract | Source observation | Status |
|---|---|---|---|
| Supreme | 60px height; Standard stroke/radius system (3px / 6px); 52px type/icon | TypeScript tokens and recovery CSS agree on 3px / 6px | Source-aligned; browser verification outstanding |
| Mini type/icon | 20px height; 1.5px / 3px geometry; 17.5px type/icon | Token and generated CSS align; duplicate tier declarations removed from core/recovery | Source aligned; runtime verification outstanding |
| Micro | 12px; Mini stroke/radius system (1.5px / 3px); 10px type/icon; 0.975px outline; `-0.02em` letter-spacing | Tokens, generated CSS, and system selector align | Source aligned; runtime verification outstanding |
| Micro letter spacing | Shared `-0.02em` | TypeScript token matches the global contract | Source aligned; runtime verification outstanding |
| Editable field inset | Primary inset persists at rest and focus; focus changes text/glyph to black | Shared field rules own editable text/stroke/color/caret; recovery field rules preserve the standard inset; split input owns its shell border and gradient inset in `studio-split-text-input.css` and routes focus through its shell | Source aligned; computed-style/browser verification outstanding |
| TextBox | Black text/glyph; primary inset; secondary outline | Recovery CSS declares black text/glyph, primary inset, secondary outline | Source-aligned; browser verification outstanding |
| Catalog provenance | Real production exports; catalog CSS owns arrangement only | Confirmed catalog imports production primitives, including dedicated `StudioSplitTextInput` and `StudioSplitAccordion` | Source registration confirmed; visual certification outstanding |

### Required follow-up

1. Reconcile Mini typography in `src/styles/studio-control-recovery-overrides.css` with the 17.5px TypeScript token and regenerate/verify dependent output if required.
2. Verify the emitter output, focused field/split tests, typecheck/build, computed styles, and desktop/mobile layouts.
3. Run token emitter consistency checks, focused tests, typecheck/build, computed-style assertions, and desktop/mobile browser inspection for all five tiers.
4. Test editable input, textarea, TextBox, and split input separately at rest and focus. Assert outer border, inset, fill, text/glyph stroke, caret, outline width/color/offset, and divider count.

**Verification boundary:** This is a source/documentation audit, not rendered visual certification. No tests, build, computed-style capture, browser screenshots, or assistive-technology tests were run in this pass.


### Source-of-truth and split-field inheritance

- Token source: `src/studio-ui/tokens.ts`.
- Generated CSS: `src/styles/studio-control-vars.generated.css`, emitted by `scripts/emit-studio-control-vars.mjs`.
- Global size selectors: `src/styles/studio-control-system.css` only; core and recovery styles must not reintroduce tier geometry.
- Split input: the component imports its shell stylesheet. Shared field rules own matching text typography, rest/focus colors, caret, and text stroke. The split shell owns its outer border, rails, persistent inset geometry, and focus outline routing.
- Preferred maintenance: remove duplicate/stale declarations and use existing token variables before adding CSS. Each real exception needs one owner and a matching catalog/documentation entry.


### Source-of-truth and split-field inheritance

- Token source: `src/studio-ui/tokens.ts`.
- Generated CSS: `src/styles/studio-control-vars.generated.css`, emitted by `scripts/emit-studio-control-vars.mjs`.
- Global size selectors: `src/styles/studio-control-system.css` only; core and recovery styles must not reintroduce tier geometry.
- Split input: the component imports its shell stylesheet. Shared field rules own matching text typography, rest/focus colors, caret, and text stroke. The split shell owns its outer border, rails, persistent inset geometry, and focus outline routing.
- Preferred maintenance: remove duplicate/stale declarations and use existing token variables before adding CSS. Each real exception needs one owner and a matching catalog/documentation entry.


## Simplification ownership rule — 2026-10-27

The token source in `src/studio-ui/tokens.ts` is authoritative. The emitter must derive tier values from that source; generated CSS is never hand-edited. Shared tier aliases and global shell defaults must have one CSS owner, while field appearance, split anatomy, and accordion motion remain in their family sheets. Do not remove recovery/parity styles until their required selectors have been migrated and covered by ownership tests. Preserve Mini's 17.5px type/icons and Micro's Mini-matched stroke/radius/outline (1.5px / 3px / 0.975px). Global letter-spacing remains `-0.02em`; field defaults retain the black outer border, primary inset stroke, primary caret, and black focused text/glyph stroke with secondary zero-offset outline.

## Studio counter, split-selection, and bar-toggle refinements — 2026-10-29

- **StudioCounter controls:** the standard double-split counter uses the same left/right chevron glyphs as StudioBarToggle. Hold-repeat, min/max bounds, keyboard activation, and the existing split-shell rails remain unchanged.
- **StudioLeftWordCounter default:** the value pane retains the primary background; its resting numeral fill and glyph stroke use the shared 50%-white / 50%-primary counter token (`--vt-studio-number-rest-color`). Interaction focus switches the numeral fill/stroke to black. The opt-in color-cycle variant remains an explicit exception.
- **Selectable split buttons:** the label/text pane and rail exchange semantic pair fills on selection. Resting label = primary and rail = secondary; selected label = secondary and rail = primary. This applies consistently to split-left, split-right, and double-split buttons without changing their shared geometry or dividers.
- **StudioBarToggle:** the bar track occupies only the flexible center cell between the square rails. Its focus outline uses the shared zero-offset secondary outline at 65% of the control stroke. The rightmost filled bar carries a compact, no-stroke secondary-fill / black-text percentage tooltip; the displayed value is rounded to the nearest whole percent.

These are production primitive/family rules, not catalog overrides. The bar track overflow exception is scoped to the bar-toggle shell so the floating percentage label can remain visible; the flexible center track is still constrained between the fixed rails.

