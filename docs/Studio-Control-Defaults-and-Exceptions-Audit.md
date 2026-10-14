# Studio Controls Global Defaults & Exception Index

**Status:** Active audit baseline — source-inspected, not yet visually certified  
**Repository:** `viewtube-dev/viewtube`  
**Audit branch:** `fix/studio-primitive-size-shadow-contracts-20261014`  
**Canonical implementation:** `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`  
**Reference surface:** Studio Hub → Confirmed Primitive Library (`StudioHubConfirmedPrimitiveCatalog.tsx`)  
**Purpose:** Define the expected defaults for standard and compact controls, index source-level exceptions and conflicts, and make the Confirmed Primitive Library an auditable representation of the implementation.

> This document distinguishes **intended contract** from **observed source declarations**. It does not claim that browser-rendered output has been verified. Where CSS declarations conflict, the conflict is recorded rather than pretending one value is reliably authoritative without computed-style/browser evidence.

## 1. Authority and inheritance rules

1. `src/studio-ui/primitives/StudioControls.tsx` owns the canonical Studio React primitive APIs and declares `STUDIO_COMPONENT_GLOBAL_DEFAULTS` and `STUDIO_COMPONENT_SIZE_DEFAULTS`.
2. `src/styles/studio-control-system.css` owns the actual CSS geometry, typography, color, focus and interaction behavior. It must agree with the TypeScript contracts.
3. `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` renders the Confirmed Primitive Library and must show the actual canonical primitives, defaults, variants and every intentional exception.
4. `src/components/studio-hub/studio-hub-primitive-catalogs.css` owns catalog presentation only. It must not accidentally change the appearance of the primitive being demonstrated.
5. The same default applies to every component at a given size. An exception is valid only when it is explicitly named, justified by the component's function, declared in the component API/size contract, and represented in the library. A selector that silently overrides a default is not a documented exception.
6. The visual library is a verification surface, not a second implementation. Do not recreate a component using approximate catalog-only CSS.

## 2. Global defaults shared by both sizes

| Property | Canonical default / policy | Source declaration / note |
|---|---|---|
| Font family | `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif` | TS global defaults and CSS button/field rules |
| Font weight | `1000` (maximum emphasis) | TS global defaults; some selectors set it separately |
| Text transform | Uppercase | TS global defaults and CSS |
| Letter spacing | `-0.035em` | TS global defaults; dropdown options currently use `-.025em` (exception/conflict) |
| Line height | `0.86` for the general control text contract | TS global defaults; some button variants override to `1` |
| Ink / default text color | Black unless a component/state explicitly uses the primary pair color | TS global defaults; split rails/labels and fields have state-specific rules |
| Pair mapping | Primary = `--pair-a`; secondary = `--pair-b` | TS global defaults; retain shared inherited pair tokens |
| Button fill | Primary pair color | TS global defaults and CSS |
| Text-field fill | Primary at 50% opacity in default mode | TS global defaults; actual CSS has both transparent and white-mixed versions |
| Button shadow | Hard offset shadow, button-only; position must not change between rest/hover/pressed states | TS policy; current CSS violates stable-location rule by changing offsets |
| Dropdown/menu shadow | None on menu options; dropdown panel policy must be explicit and consistent | TS comment says menus/options have no shadows, but `.vt-studio-dropdown-menu` currently has a shadow (conflict) |
| Text-field border | Black outer border plus primary-color inset stroke | TS defaults; CSS has conflicting inset widths/colors |
| Focus | Secondary-color outline, no visual gap; text stroke follows current text color | TS defaults; CSS currently sets `outline-offset: 1px` in one focus rule |
| Motion easing | `ease-out` | TS global defaults; individual CSS transitions currently use different durations |
| Disabled state | Clear non-interactive affordance without changing geometry | CSS sets opacity/filter; verify across all families |
| Geometry | `box-sizing: border-box`; declared dimensions include borders | CSS base rule; enforce consistently on nested rails and labels |

## 3. Canonical size contracts

These are the declared defaults in `STUDIO_COMPONENT_SIZE_DEFAULTS`. They are the baseline for every component unless an exception is explicitly listed in §7.

| Property | Standard | Compact |
|---|---:|---:|
| Control height | 44px | 28px |
| Border/stroke width | 3px | 2px |
| Corner radius | 6px | 4px |
| Text size | 38px | 24px |
| Font weight | 1000 | 1000 |
| Hard-shadow X offset | 3px | 1.5px |
| Hard-shadow Y offset | 3px | 1.5px |
| Hover transition duration | 150ms | 150ms |
| Hover travel (half shadow) | 1.5px | 0.75px |
| Click transition duration | 300ms | 300ms |
| Click travel (full shadow) | 3px | 1.5px |
| Icon size | 28px | 18px |
| Icon stroke | 2.5px | 1.65px |
| Focus outline width | 1.5px | 1px |
| Color pair | primary `--pair-a`, secondary `--pair-b` | Same |
| Text casing / family / weight | Global defaults | Same |

### Required shadow-state model

- **Rest:** button face is at its rest position; full hard shadow is visible at the size-specific offset.
- **Hover:** button face moves by exactly half of its size-specific shadow offset; the shadow remains anchored to the original resting location. The visible gap is therefore reduced by half.
- **Pressed/click:** button face moves by the full size-specific offset and covers the shadow completely. The shadow itself does not translate, resize or change origin.
- **Return:** button face transitions back to rest; shadow remains anchored throughout.
- The shadow must be implemented as a stable pseudo-element or equivalent independently positioned layer. Changing `box-shadow` offsets on hover/active is not compliant because it moves the shadow.
- Reduced-motion preferences may shorten/disable interpolation, but must preserve a clear pressed/selected state and must not create layout movement.

## 4. Component families in scope

The Confirmed Primitive Library and code audit must cover both standard and compact sizes wherever the component supports them:

- `StudioButton`
- `StudioIconButton`
- `StudioSplitLeftButton`
- `StudioTextInput`, `StudioSearchInput`, `StudioNumberInput`
- `StudioTextArea`
- `StudioLabeledInput`, `StudioLabeledTextArea`
- `StudioLegendMultiDropdown` and its trigger/options/menu
- `Studioswitch`
- `StudioChoice` (radio and checkbox)
- `Studiotoggle` (word toggle)
- Related selected, hover, pressed, focus-visible, disabled, open, checked/on and unchecked/off states
- Any compatibility aliases or wrapper components still used by Studio Hub consumers

The API currently has several naming/size representations: `sizeVariant="standard" | "compact"`, `data-size`, `data-height-variant="44" | "28"`, and fixed-size classes for the switch/choice/word-toggle families. These must be reconciled into one documented size token per rendered component. Do not assume that a `data-size` attribute alone controls a component whose CSS uses `data-height-variant` or a family-specific class.

## 5. Source audit: confirmed conflicts and likely violations

The findings below are source-verified conflicts in the files named. Some require computed-style/browser checks to determine the final winning declaration. They should be treated as defects until resolved or explicitly accepted.

| ID | Severity | Location | Current source evidence | Contract broken / impact | Required correction |
|---|---|---|---|---|---|
| EX-01 | P1 | `studio-control-system.css`, button hover/active rules | Hover changes shadow offset to the hover offset; active sets `box-shadow:none` and translates by the full offset | Shadow moves/disappears as a property instead of staying anchored; violates fixed-origin shadow model | Render shadow on a stationary pseudo-element; animate only the face |
| EX-02 | P1 | `studio-control-system.css`, compact split rail | `data-height-variant="28" [data-vt-studio-split-rail]` sets `border-right-width: 3px` | Compact divider is 3px despite compact stroke contract of 2px | Use the compact stroke token; remove isolated hard-coded width |
| EX-03 | P1 | `studio-control-system.css`, repeated split rail rules | Later broad rule sets `border-right: 3px solid #000` for all `data-vt-studio-control="true"` split-left rails | Compact default and selected states can inherit/reacquire thick vertical divider | Define divider once from size variable; default/selected must share geometry |
| EX-04 | P1 | `studio-control-system.css`, text fields | Base field radius uses `var(--vt-studio-control-radius)`, but a later canonical-field rule sets `border-radius: 8px` | Standard fields can show old/larger radius instead of 6px; compact fields can be overridden too | Use the size token, with no later literal radius |
| EX-05 | P1 | `studio-control-system.css`, split-left button dimensions | General size contract uses 28px compact, but later rules hard-code 44px columns/rails and apply standard height to `data-size="standard"` | Size behavior is split across `data-size` and `data-height-variant`; risk of wrong rail, radius or geometry | One size selector/token drives height, rail, stroke, radius, icon and text |
| EX-06 | P1 | `studio-control-system.css`, button typography | Base button is 32px; compact override says 10px; height-variant 44 says 36px; height-variant 28 says 22px; size contract says 38px/24px | Four competing font-size declarations; actual size depends on selector specificity/order | Make buttons consume the canonical size variable; remove contradictory hard-coded sizes |
| EX-07 | P1 | `studio-control-system.css`, corner radii | Base token says 6px/4px, but a later text-field rule uses 8px; dropdown menu fallback uses 8px; catalog presentation has separate larger radii | Old global sizes leak into components and reference surfaces | Primitive radii come from size tokens; catalog chrome must be visibly separate and documented |
| EX-08 | P1 | `studio-control-system.css`, button transitions | CSS uses 180ms transitions; size contract specifies 150ms hover and 300ms click | Declared interaction durations are not followed | Use size contract durations and distinct hover/press transition timings |
| EX-09 | P1 | `studio-control-system.css`, selected split-left state | Selected-state rules assign rail/label colors separately; shadow rule resets to full offset | Selected state has separate shadow declaration and can behave differently from default/hover/pressed | State changes may alter color only; geometry, divider and shadow origin remain identical |
| EX-10 | P1 | `StudioControls.tsx` + CSS | Switch/choice components use `data-size="standard"` and fixed `vt-studio-44-*` classes; their APIs do not expose compact size | Compact defaults are not uniformly available across families; library may imply support that API lacks | Either add true compact variants using canonical size contract or mark these families standard-only explicitly |
| EX-11 | P1 | `StudioControls.tsx` / `studio-control-system.css` | `STUDIO_COMPONENT_GLOBAL_DEFAULTS` declares fields and policy but CSS field text uses both 38px and 24px literals and conflicting default/focus stroke rules | TypeScript is descriptive rather than executable authority; drift is easy | Bind CSS to shared custom properties generated/validated against the TypeScript contract |
| EX-12 | P1 | `studio-control-system.css`, text-field focus | Focus rule sets `outline-offset: 1px` although global policy says no gap | Focus halo has a gap; inconsistent focus treatment | Use zero outline offset unless a named variant explicitly requires a gap |
| EX-13 | P1 | `studio-control-system.css`, dropdown panel/options | Global policy says dropdown menus/options have no shadows; `.vt-studio-dropdown-menu` declares a hard shadow; options use 14px and `-.025em` | Menu behavior/typography contradict global defaults without documented exception | Decide and document panel-vs-option policy; use tokenized typography and no shadow for options |
| EX-14 | P2 | `studio-control-system.css`, fields and buttons | Text fields have 180ms transitions and multiple focus definitions; buttons have 180ms while tokens specify 150/300ms | Motion durations vary between components of the same size | Normalize transitions by size and state; preserve accessible focus feedback |
| EX-15 | P2 | `StudioControls.tsx`, word toggle | Default state uses measured handle width and custom defaults (`handleInset`, `wordGap`, scale) outside the standard/compact geometry object | Variant-specific geometry isn't in the size table; hard to audit across both sizes | Add these parameters to a documented variant contract and show them in the catalog |
| EX-16 | P2 | `studio-hub-primitive-catalogs.css` | Catalog headings/cards include independent 4px/3px borders, 12px radii and 6px shadows | Catalog chrome is not itself a primitive, but can be confused with the component's canonical defaults | Label as reference-card framing; isolate styles from primitive DOM and document as catalog-only |
| EX-17 | P2 | `StudioHubConfirmedPrimitiveCatalog.tsx` | Catalog declares `Size = "44px" | "28px"`, while component API uses `standard | compact` and size attributes use strings | Mapping layer can hide incorrect props/defaults | Show both user-facing size and actual prop/attribute mapping; add assertion that catalog variant equals rendered attributes |
| EX-18 | P2 | `StudioControls.tsx` / CSS | Standard button typography override says 36px and compact says 22px, while global size defaults specify 38px and 24px | Component library and declared defaults disagree | Treat 38px/24px as authority unless a specific component exception is formally approved |
| EX-19 | P2 | `studio-control-system.css`, menu surface | Dropdown menu uses variable fallback radius 8px and shadow 4px, not standard 6px/3px or compact 4px/1.5px | Dropdown surface sizing is not tied to the selected size | Use size tokens or document panel as a separately sized overlay primitive |
| EX-20 | P2 | Size support / defaults | `data-size="small"` (32px) and `data-size="action"` (56px) CSS rules exist, but canonical `STUDIO_COMPONENT_SIZE_DEFAULTS` only defines standard/compact | Undocumented extra sizes create a second size system | Deprecate/remove small/action selectors or add complete audited contracts; do not leave partial sizes |
| EX-21 | P2 | Focus and nested controls | Field inset stroke and focus outline are set through overlapping base and later rules, including `!important` | Focus ring and inner stroke can differ by selector order and mode | One field-state definition per default/focus state; no avoidable `!important` |
| EX-22 | P2 | `STUDIO_COMPONENT_GLOBAL_DEFAULTS` vs rendered CSS | TS says button text default 38px by size contract, but generic CSS button base says 32px before further overrides | Public contract does not directly describe computed style | Consolidate the declarations and test computed values for each size/family |

## 6. Confirmed Primitive Library coverage checklist

Each family entry must show these sections, including when a value is the default:

1. **Default contract:** standard and compact values for height, text size, border width, corner radius, icon size/stroke, shadow offset, hover travel/duration, click travel/duration.
2. **Component-only exceptions:** exact prop/variant, reason, and property differences; write “None” if there are none.
3. **State examples:** rest, hover, pressed, selected/checked, focus-visible, disabled; only relevant states for the family.
4. **Token/provenance:** component export, implementation file, CSS selector/token owner.
5. **Rendered data:** effective `data-size`, `data-height-variant`, and family class values for the example.
6. **Compliance status:** Pass / Fail / Not tested, with a test or screenshot reference. Never label as confirmed solely because the source exists.
7. **Non-default settings:** every prop that changes the default, including skin, tone, shape, level, selected state, fixed handle width, handle inset/scale, word gap, menu height and field level.
8. **No hidden CSS exceptions:** list any fixed literal declarations affecting a primitive; the catalog's own card/frame styling must be clearly identified as catalog-only.

### Required families and current API notes

| Family | Standard | Compact | Audit note |
|---|---|---|---|
| Button | Supported | Supported | Uses `StudioButton`; resolve 36/22px CSS overrides vs 38/24px size contract |
| Icon button | Supported | Supported | Inherits `StudioButton`; icon geometry must derive from size |
| Split-left button | Supported | Supported | Highest priority: compact divider 3px and fixed 44px overrides are present |
| Text/search/number input | Supported | Supported | Verify radii, font size, focus outline/inset stroke |
| Textarea | Supported | Supported | Height may be content/min-height behavior; text-size and radius remain size-bound |
| Labeled input/textarea | Supported | Supported | Wrapper/label is composition; underlying input remains canonical |
| Legend multi dropdown | Supported | Supported | Trigger and menu need separate documented overlay contract |
| Switch | Standard implementation | Not currently exposed | Uses fixed `vt-studio-44-switch` class |
| Radio/checkbox choice | Standard implementation | Not currently exposed | Uses fixed `vt-studio-44-choice` class |
| Word toggle | 44px and 28px option | Available by explicit `size` prop | Uses fixed family class; needs contract mapping and measured-handle exception documentation |

## 7. Approved-exception register

**No visual exception is approved by this audit yet.** The following are known implementation-specific settings that must either be made into explicit exceptions or removed. They are not automatically approved merely because the code currently contains them.

| Exception ID | Component / variant | Current deviation | Required disposition |
|---|---|---|---|
| A-01 | Dropdown panel | Overlay currently declares shadow and 8px radius | Decide panel contract explicitly; document separately from menu options |
| A-02 | Dropdown option | 14px text, `-.025em` tracking, 40px minimum height | Approve as dense-menu exception or align to size defaults |
| A-03 | Textarea | 144px standard min-height; 72px compact min-height | Valid content-surface exception if intentional; typography/border/radius still follow size |
| A-04 | Floating labels | Label overlay and `level=l0/l1/l2` | Layout-only variation; input geometry remains size-based |
| A-05 | Word toggle | Measured/fixed handle width, inset, width scale and word gap | Must be explicitly documented as toggle-specific geometry; must not alter control text/border/radius/shadow contracts |
| A-06 | Switch / radio / checkbox | Currently standard-only API | Either add compact variants or state clearly that compact is unsupported; no faux compact catalog entry |
| A-07 | Small/action attributes | 32px/56px partial CSS sizes exist without full TS size objects | Remove/deprecate or define full size contracts before use |
| A-08 | Catalog framing | Card/header styles use their own larger borders/radii/shadows | Keep isolated and label as library chrome, never as primitive defaults |

## 8. Corrective plan

### Phase 1 — Establish one executable source of truth
- Make the size contract complete for all supported sizes.
- Export CSS custom-property values or add tests that prove CSS computed values equal the TypeScript contract.
- Normalize size naming: `standard ↔ 44px`, `compact ↔ 28px`; remove partial `small/action` variants unless fully supported.
- Settle field focus/default stroke policy in one place.

### Phase 2 — Repair shared geometry and interactions
- Replace moving `box-shadow` offsets with a fixed-position shadow layer and independently moving button face.
- Implement hover at half the shadow offset and pressed at the full offset.
- Ensure default, selected, hover and pressed split-left states share the same divider thickness and border geometry.
- Remove hard-coded 44px compact overrides, 3px compact divider declarations, legacy 8px field radius, and 36/22px typography overrides.
- Apply standard 6px/3px/38px and compact 4px/2px/24px consistently (plus the other declared size-specific properties).

### Phase 3 — Reconcile component families
- Align button/icon/split-left variants.
- Audit text fields and floating-label compositions.
- Decide/document dropdown panel and option exceptions.
- Add true compact switch/choice variants or clearly mark them standard-only and remove compact claims.
- Add a complete word-toggle size/geometry contract.

### Phase 4 — Bring the Confirmed Primitive Library into compliance
- Update each family module's bottom “non-default settings” section with all actual non-default props/values.
- Display global and per-size defaults directly from exported contracts where possible, not manually copied numbers.
- Add source/provenance, size/attribute mapping, exception ID and compliance status.
- Distinguish catalog frame styles from the primitive itself.

### Phase 5 — Verification and merge gate
- Add tests for token-contract parity and rendered attributes.
- Test default/hover/pressed/selected/focus-visible/disabled for both sizes and all supported families.
- Run typecheck, lint, focused primitive tests and production build.
- Inspect screenshots at desktop and narrow/mobile widths; capture standard and compact controls in one batched visual pass.
- Mark each library entry Pass only with evidence. Resolve remaining P0/P1 issues before PR merge.

## 9. Audit verdict

**Current status: FAIL — source contract drift is verified.** The strongest evidence is the contradictory CSS for compact split rails, fixed 44px geometry in shared selectors, button typography values that conflict with the size table, legacy 8px field radius, and hover/active rules that move or replace the shadow. The code already has useful central TypeScript defaults and a canonical Studio primitive family, but the CSS does not consistently implement that contract.

**Not yet verified:** actual computed styles in a browser, all runtime consumer overrides, screenshot parity, test/build results, or the final visual state of every catalog family. The source audit is therefore not a claim that every listed conflict is visible in every rendered state.

## 10. Source index

- `src/studio-ui/primitives/StudioControls.tsx` — public primitive APIs and global/size defaults.
- `src/styles/studio-control-system.css` — canonical CSS; conflicting declarations indexed in EX-01 through EX-22.
- `src/studio-ui/tokens.ts` — Studio facade over Toolbox/SubToolbox token geometry; inspect for cross-system mismatches before changing shared tokens.
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` — rendered confirmed primitive families, size mapping and non-default settings.
- `src/components/studio-hub/studio-hub-primitive-catalogs.css` — catalog presentation rules; keep reference-card styles separate from control styles.
- `docs/UI.md` — UI system canonical overview.
- This document — global size contract and implementation exception/audit index.
