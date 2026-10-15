# Studio Controls — Global Defaults & Exception Index

**Status:** Confirmed Library phases 1–5 are implemented on `fix/confirmed-library-phases-4-6-2026-10-15`; automated execution and rendered verification pending  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Current work branch:** `fix/confirmed-library-phases-4-6-2026-10-15` (phase 4–5 implementation; phase 6 verification in progress)  
**Last reviewed:** 2026-10-15  
**Canonical implementation:** `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`  
**Confirmed component gallery:** `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and `src/components/studio-hub/studio-hub-primitive-catalogs.css`

## 1. Purpose and authority

This document is the working reference for the global defaults, size contracts, intentional component exceptions, and known implementation drift in the Studio Controls system. It distinguishes:

1. **Declared defaults** — values exported from `STUDIO_COMPONENT_GLOBAL_DEFAULTS` and `STUDIO_COMPONENT_SIZE_DEFAULTS`.
2. **Effective CSS behavior** — the cascade currently present in `studio-control-system.css`; this can contradict the declarations.
3. **Intentional exceptions** — behavior required by a component's function (for example, a dropdown menu has no press shadow).
4. **Unapproved drift / defects** — legacy or duplicate CSS that bypasses the shared size and state contracts.

When values conflict, the desired authority is the exported size/global contract plus the canonical CSS implementation. A later selector must not silently redefine a shared default. Exceptions must be listed in code and in the Confirmed Primitive Library.

## 2. Global defaults shared by both sizes

| Property | Global default / policy | Application |
|---|---|---|
| Font family | `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif` | All control text |
| Font weight | `1000` (maximum-heavy emphasis) | All control text unless a documented functional exception applies |
| Text transform | Uppercase | Buttons, fields, labels, dropdown options |
| Letter spacing | `-0.035em` | General controls; a component may document a narrower exception |
| Line height | `0.86` baseline; component geometry may align a label using a documented equivalent | Text controls and button labels |
| Primary / secondary color authority | Primary = `--pair-a`; secondary = `--pair-b` | Shared color-pair contract |
| Text color | Action labels are black; text fields use primary (`--pair-a`) at rest and black only while focused | Component/state dependent |
| Stroke color | Black (`#000`) unless a documented state-specific text stroke applies | Outer borders and default button outlines |
| Background fill | Ordinary buttons use the primary color; text fields use primary at 50% opacity at rest and 15% in focus | State-specific; menu panel is a separate surface |
| Motion easing | `ease-out` | All transitions |
| Border-radius policy | Size-specific: standard 6px; compact 4px | All components unless an explicitly indexed exception is approved |
| Border-width policy | Size-specific: standard 3px; compact 2px | All components unless an explicitly indexed exception is approved |
| Shadow / focus policy | Hard offset shadows belong to button faces and stationary dropdown panels. Text fields retain a primary inset stroke and a separate secondary-color focus accent; do not confuse the accent shadow with the computed CSS outline. | Component and state specific |
| Stable shadow geometry | Shadow anchor/offset stays fixed; button face moves independently | All shadowed buttons |
| Hover press depth | Move halfway across the declared shadow offset; preserve the shadow anchor | All shadowed buttons |
| Click press depth | Move the remaining half so the face covers the shadow completely; shadow does not travel with the face | All shadowed buttons |
| Motion timing | Hover 150ms; click 300ms per current size constants | Buttons; must be reconciled with CSS transition definitions |
| Reduced motion | Preserve state feedback while minimizing motion | Must not erase all state hierarchy or affordance |

## 3. Canonical size contracts

These values come from `STUDIO_COMPONENT_SIZE_DEFAULTS` in `StudioControls.tsx`. They are the intended contract, not proof that the CSS currently honors them.

| Property | Standard (44px) | Compact (28px) |
|---|---:|---:|
| Control height | 44px | 28px |
| Outer border stroke | 3px | 2px |
| Corner radius | 6px | 4px |
| Text size | 38px | 24px |
| Font weight | 1000 | 1000 |
| Button shadow X/Y | 3px / 3px | 1.5px / 1.5px |
| Hover transition | 150ms | 150ms |
| Hover face movement | 1.5px (half of 3px) | 0.75px (half of 1.5px) |
| Click transition | 300ms | 300ms |
| Click face movement | 3px (full offset; covers shadow) | 1.5px (full offset; covers shadow) |
| Icon size | 28px | 18px |
| Icon stroke | 2.5px | 1.65px |

**Resolved in this branch:** The final CSS contract now keeps text-field radius/stroke size-specific, uses a 3px standard / 2px compact split-left divider, and gives placeholder/value text the same primary-color typography at rest. The 44px switch/choice family intentionally follows the supplied `viewtube-control-library-44px.html` geometry rather than the generic button/field radius token.


### 44px switch / choice geometry reference

The supplied Library file **`viewtube-control-library-44px.html`** is the geometry authority for the switch, radio, checkbox, and word-toggle family. The Studio CSS preserves these exact ratios:

- Switch track: **75.68 × 44px** (1.72:1); round radius 999px; rectangular radius **7.333px**.
- Handle: **36.667 × 36.667px**, inset **3.667px** from the left/top; on travel **31.68px**, leaving the same approximately 3.667px inset at the right.
- Square radio/checkbox control: **44 × 44px**; radio indicator: **33 × 33px**.
- Rectangular choice radius: **7.333px**; compact inner rectangle radius: **1.833px**.
- Solid selected state fills with primary; color-swap selected state uses secondary fill with primary handle/check mark. Black- and white-indicator skins override checkbox mark strokes explicitly.

These ratios are specific to the 44px switch/choice family and do not override the general 6px standard / 4px compact radius contract for fields and action buttons.

## 4. Required state model for all buttons

The face and shadow are separate visual layers. The shadow's position must remain invariant in the page coordinate system while the button face translates over it.

| State | Standard | Compact | Required behavior |
|---|---:|---:|---|
| Rest | Shadow 3px × 3px | Shadow 1.5px × 1.5px | Face at origin; full shadow visible |
| Hover | Face translates 1.5px × 1.5px | Face translates 0.75px × 0.75px | Face covers half the shadow; shadow anchor does not move |
| Active/click | Face translates 3px × 3px | Face translates 1.5px × 1.5px | Face covers shadow fully; no visible shadow remains |
| Selected | Same geometry as its size/state | Same geometry as its size/state | Selection swaps colors/indicators only; never thickens borders or moves shadow |
| Focus-visible | Stable geometry plus visible focus indicator | Stable geometry plus visible focus indicator | No layout shift |
| Disabled | Stable geometry; disabled affordance | Stable geometry; disabled affordance | No accidental press animation |

**Resolved in this branch:** action buttons now keep the shadow on a stationary outer button layer while the inner `[data-vt-studio-button-face]` translates. Hover moves the face by half the shadow offset; active moves it by the full offset over 300ms. The shadow is not moved or removed.

## 5. Exception index

Exceptions below are either intentional semantic exceptions or known drift. Only intentional exceptions should remain after remediation.

| ID | Component / family | Intended exception | Current source behavior / issue | Status |
|---|---|---|---|---|
| E-01 | Text inputs, search/number inputs | Native field semantics; primary-color default text and stroke; inset primary stroke; secondary focus outline | Final contract now applies primary default text/fill/stroke, consistent placeholder/value typography, size-specific border/radius, and black focused text | **Implemented; awaiting tests and browser verification** |
| E-02 | Textareas | Taller writing surface; resize behavior; standard 18px / compact 14px copy; 92px minimum height | Final contract preserves a 92px minimum height in both sizes, 18px/14px typography, and 1000 weight | **Implemented; awaiting tests and browser verification** |
| E-03 | Dropdown trigger | Trigger behaves like a button; menu overlays content | Trigger gets a white-mixed background; component class may have separate sizing and state styling | **Review token inheritance and size conformance** |
| E-04 | Dropdown menu / options | No button shadow and no press-motion on options; menu can use its own panel geometry | `.vt-studio-dropdown-menu` follows the 6px / 4px size radius and shared 3px / 1.5px stationary panel shadow; options keep 14px typography, 40px minimum height and 2px separator as documented menu-surface exceptions | **Intentional menu exception; document and visually verify** |
| E-05 | Split-left button rail/divider | Rail is a separate colored icon region; divider matches the declared size stroke | Final contract uses 3px standard and 2px compact dividers and styles rail/label inside the face wrapper | **Implemented; awaiting tests and browser verification** |
| E-06 | Split-left selected state | Selected state swaps primary/secondary colors only; geometry is unchanged | Final face/rail selectors swap fills without changing border widths, radius, or the stationary shadow | **Implemented; awaiting visual verification** |
| E-07 | Button typography | Button and split-left labels share the same type contract | The canonical face layer centralizes typography at 38px standard / 24px compact, weight 1000, uppercase and -0.035em tracking, removing the competing parent-level font-size rules | **Implemented; verify visually** |
| E-08 | Button radius | Standard 6px, compact 4px | Final action face uses 6px standard / 4px compact; 44px switch and choice shapes use the supplied reference-specific 7.333px rectangular radius | **Implemented; verify effective computed styles** |
| E-09 | Button shadow and transitions | Fixed shadow anchor; face moves half shadow on hover and full shadow on click | Final contract anchors shadow on the outer button and moves only the inner face at 150ms hover / 300ms active | **Implemented; awaiting automated and rendered verification** |
| E-10 | Switches, radio buttons, checkboxes | Reference-specific 44px geometry and skin variants; selected state changes indicator/fill | Final contract restores 75.68×44 switch tracks, 36.667px handles, 3.667px symmetric insets, 31.68px travel, 44×44 choices, 33×33 radio dots, and explicit black/white/color-swap checkbox marks | **Implemented; awaiting visual verification** |
| E-11 | Word toggles | 44px default or 28px compact; active handle measures selected word; skin/words/gap/inset may be customized | Dynamic measured handle and inline style are intentional geometry exceptions; CSS/state transitions must be checked for border/radius/motion consistency | **Intentional dynamic-width exception; audit remaining size behavior** |
| E-12 | Floating-label input/textarea wrappers | Wrapper adds label positioning, not a second editable control | Wrapper classes are separately styled in catalog CSS; ensure they do not change field size/radius/stroke or duplicate focus rings | **Needs cross-file cascade audit** |
| E-13 | Small/small-size compatibility | CSS defines a `data-size="small"` height of 32px although canonical contract exports only standard/compact | Legacy third size can bypass the two-size rule | **Defect unless a documented migration-only exception is approved** |
| E-14 | Action-size compatibility | CSS defines `data-size="action"` height 56px and button typography overrides | The canonical exported size map exposes only standard and compact; the separate 56px StudioActionButton is a distinct family, not a StudioButton size | **Defect/compatibility debt: inventory consumers and either migrate or formally document separate non-button layout semantics** |
| E-15 | Focus and reduced motion | Focus needs visible, stable outline; reduced-motion must remain understandable | Focus uses 3px outline / 3px offset on buttons, not size-derived; reduced-motion sets transition duration to .01ms globally, suppressing most motion feedback | **Needs accessibility review and state feedback alternative** |
| E-16 | Catalog defaults panel | Gallery should expose the real defaults and list every non-default setting | Catalog renders exported global and size constants, but those constants do not reflect every CSS override; per-family non-default lists exist but do not enumerate CSS drift | **Defect: add effective-vs-declared drift and exception status to catalog** |

## 6. Component family index — what to verify in the Confirmed Primitive Library

The canonical gallery currently uses production exports (good), and has family-level “NON-DEFAULT SETTINGS” lists. Keep this provenance and extend it with a visible global exception index.

| Family in library | Primary component/source | Required checks |
|---|---|---|
| Text Input / Search / Number | `StudioTextInput`, `StudioSearchInput`, `StudioNumberInput` — `StudioControls.tsx` | Standard/compact font, border, radius, fill, focus ring, caret; no stale 8px radius |
| Text Area | `StudioTextArea` | Control chrome follows size; explicitly document multiline minimum-height/resize exception |
| Floating Label Input | `StudioLabeledInput` | Wrapper adds label only; no geometry override |
| Floating Label Text Area | `StudioLabeledTextArea` | Wrapper adds label only; document multiline height |
| Button | `StudioButton` | 38px/24px text contract, 3px/2px stroke, 6px/4px radius, shadow anchor and press states |
| Icon Button | `StudioIconButton` | Same button contract; icon 28px/18px; no independent shadow/radius override |
| Split-left Button | `StudioSplitLeftButton` | Divider 3px/2px; selected/default identical geometry; rail icon 28px/18px; stable shadow |
| Switch | `Studioswitch` | Track/handle dimensions; radius exception by shape; currently standard-only API |
| Radio / Checkbox | `StudioChoice` | 44px size, shape/mark variants; selected/default geometry unchanged |
| Word Toggle | `Studiotoggle` | 44px/28px geometry; measured active handle; documented custom words/gap/inset |
| Legend Multi Dropdown | `StudioLegendMultiDropdown` | Trigger follows control contract; menu/options documented as a separate non-button-shadow surface |
| Generic Dropdown | `StudioDropdown` / dropdown trigger and menu CSS | Confirm exported size API and menu geometry exceptions |
| Dropdown option | `.vt-studio-dropdown-option` | Explicitly approved 14px text, 40px min height, no shadow/motion; keyboard/focus audit |
| Layout-only containers | `data-vt-studio-layout` rules | Not control primitives; don't misreport their sizing as control exceptions |

## 7. Source-level defects already verified

These are deterministic source findings from `studio-control-system.css` and `StudioControls.tsx`; they are not claims from a rendered browser inspection.

1. **Compact split-left divider is too thick:** compact size declares 2px border, but split-left rail rules specify 3px.
2. **Split-left divider remains thick in selected state:** selected styles change fills, not the divider width; the shared 3px rule remains in force.
3. **Field corner radius bypasses global size contract:** later field selector forces `border-radius: 8px`.
4. **Button typography has contradictory sources:** declared 38px/24px, generic button 32px, compact 10px, then height variants 36px/22px with `!important`, plus repeated split-label font sizes.
5. **Shadow moves instead of staying anchored:** hover changes shadow offset and active state removes it while translating the button.
6. **Timing constants and CSS disagree:** constants declare hover 150ms and click 300ms; CSS transitions declare 180ms.
7. **A third `small` size exists only in CSS:** 32px height.
8. **A third `action` size exists only in CSS:** 56px height.
9. **Focus geometry is hard-coded:** button focus outline is 3px with 3px offset for both sizes.
10. **Catalog can overstate compliance:** it prints exported constants rather than calculated effective CSS and has no top-level table of exceptions/known drift.

## 8. Correction plan

### Phase 1 — Freeze the contract
- Confirm the 44px/28px standard/compact tokens above as the only default control sizes.
- Make `STUDIO_COMPONENT_SIZE_DEFAULTS` the machine-readable source for both TSX and CSS; where CSS custom properties cannot be derived directly, keep an explicitly tested mirror.
- Define named CSS custom properties for border width, radius, font size, icon size/stroke, shadow offset, hover depth, click depth, and transition durations.
- Remove `small` and `action` as implicit third control sizes, or add an explicit reviewed exception record for each consumer before removal.

### Phase 2 — Correct CSS cascade and component API
- Replace duplicate split-left rules with one canonical rule set.
- Set rail divider to `var(--vt-studio-control-stroke)` in both sizes and all states.
- Remove hard-coded field radius 8px and use size radius token.
- Remove font-size overrides (32px, 10px, 36px !important, 22px !important, repeated split label sizes) and use 38px/24px tokens consistently.
- Add explicit `sizeVariant` support for switches/choices if both sizes are required; otherwise label these as approved standard-only components and don't imply compact support.
- Ensure wrappers only position labels and do not redefine field geometry.

### Phase 3 — Rebuild stable-shadow interaction
- Implement shadow as a fixed-position pseudo-element or dedicated shadow layer behind a separately translated button face.
- Rest: face at zero, full shadow visible.
- Hover: face translates by half the size-specific shadow offset; shadow anchor remains unchanged.
- Active: face translates by the full offset, covering the shadow completely.
- Selected state changes only pair colors/indicator; no border, radius, shadow-offset, or layout changes.
- Keep focus-visible and disabled states geometrically stable.
- Make motion timings match the exported constants and honor reduced-motion preferences without losing clear state feedback.

### Phase 4 — Update Confirmed Primitive Library
- Keep the gallery rendering actual production exports, not hand-built lookalikes.
- Display the standard/compact contracts from the exported constants.
- Add an “Exceptions & Deviations” section that differentiates approved functional exceptions from current defects.
- Add every family-level non-default prop/state to the existing family module notes; include default/selected/hover/active/focus/disabled samples where meaningful.
- Show compact split-left default and selected side by side so divider width can be visually checked.
- Make the field radius, stroke, text size, shadow depth and timings explicit in the family descriptions.

### Phase 5 — Verification and governance
- Add tests for exported constants, TSX data attributes, and the required CSS token references / forbidden hard-coded overrides.
- Run focused tests, typecheck, lint/static checks, and production build.
- Capture standard and compact library states for desktop and mobile; inspect default, hover, active, selected, focus-visible, and disabled.
- Record actual outcomes, screenshots/artifact references, and unresolved exceptions in this document.
- Only after verification, mark exceptions as approved or fixed; do not label the system “confirmed” solely because constants are displayed.

## 9. Acceptance criteria

- [ ] Standard defaults: 44px height, 38px type, 3px border, 6px radius, 28px icon, 3px shadow, 1.5px hover movement, 3px click movement.
- [ ] Compact defaults: 28px height, 24px type, 2px border, 4px radius, 18px icon, 1.5px shadow, 0.75px hover movement, 1.5px click movement.
- [ ] Compact split-left divider is 2px in default, hover, active, selected, and focus-visible states.
- [ ] Button shadow anchor never moves; hover face covers half; click face covers all.
- [ ] Selected state does not change geometry.
- [ ] No undocumented 8px field radius, 3px compact divider, 32px/10px/36px/22px button typography override, or implicit 32px/56px third size remains.
- [ ] Every exception is recorded in source and Confirmed Primitive Library with reason, owner/source, and verification state.
- [ ] All listed component families are checked at each supported size.
- [ ] Tests/build and rendered visual checks pass; any unavailable verification is explicitly reported.

## 10. Audit limitations

- This audit used source-level inspection of the canonical TSX, canonical CSS, and Confirmed Primitive Library catalog.
- It verifies the listed conflicting declarations directly in source; it does **not** establish the final computed style after every consumer stylesheet, nor confirm live browser rendering.
- A repository-wide search of all importing components and all CSS files is still required to discover every consumer-specific override. The index above is the verified initial inventory, not a claim that every override across the entire repository has already been found.
- No runtime screenshots, browser accessibility scan, automated tests, typecheck, or production build were executed as part of creating this document.


## 11. Concrete source override index (2026-10-14)

This section maps each verified conflict to the source declaration pattern responsible for it. Selectors are written as they appear in the stylesheet so a follow-up implementation can find and remove the override without relying on generated line numbers.

| Finding | Source declaration / selector pattern | Why it violates the contract | Required correction |
|---|---|---|---|
| Compact split divider uses standard stroke | `button[data-vt-studio-control][data-height-variant="28"] [data-vt-studio-split-rail] { border-right-width: 3px; }` | Compact outer stroke is 2px; the divider becomes disproportionately thick. | Remove the local width and set `border-right: var(--vt-studio-control-stroke) solid #000`. |
| Shared split divider forces 3px | `button[data-vt-studio-control="true"][data-split-left="true"] [data-vt-studio-split-rail] { border-right: 3px solid #000; }` | This later/general selector can reintroduce the 3px divider after compact rules. | Use the inherited size token; verify default, selected, hover, active and focus. |
| Standard/compact font size diverges from exported constants | `button[data-vt-studio-control]` sets 32px; compact sets 10px; height variants set 36px/22px with `!important`; split labels repeat font sizes | The exported contract is 38px standard and 24px compact. The cascade makes the gallery's displayed values misleading. | Delete duplicate font declarations and set one token-driven font size per size. |
| Text fields get 8px radius | `[data-vt-studio-control="true"]:is(input:not(...), textarea) { border-radius: 8px; }` | Bypasses the 6px standard / 4px compact radius. | Use `var(--vt-studio-control-radius)`; ensure the compact token is applied to all field types. |
| Text fields get forced 3px border | Same late text-field selector: `border: 3px solid #000` | Compact fields must use 2px outer stroke. | Derive border width from `--vt-studio-control-stroke`; explicitly audit inset/focus stroke separately. |
| Shadow offset changes on hover | `button[data-vt-studio-control]:hover:not(:disabled)` changes `box-shadow` offsets and `transform` | Shadow moves with the state instead of staying fixed while the face covers it. | Separate shadow from moving face with a stable pseudo-element/layer; hover moves face by half offset only. |
| Active state hides shadow as a style change | `button[data-vt-studio-control]:active:not(:disabled) { box-shadow: none; transform: translate(...); }` | The shadow is removed rather than geometrically covered by the face. | Keep shadow anchored and translate face by full offset on active. |
| Transition duration contradicts size constants | Button and field rules use `180ms`; constants specify hover 150ms / click 300ms | Behavior cannot be reasoned about from the exported defaults. | Use separate size/state transition tokens: hover 150ms, click 300ms. |
| Focus outline is not size-derived | `button[data-vt-studio-control]:focus-visible { outline: 3px solid ...; outline-offset: 3px; }` | Compact and standard controls get identical focus geometry without an approved exception. | Define a size-derived focus token or explicitly approve a single focus-ring exception for accessibility. |
| Third sizes bypass the public size map | `[data-size="small"]` and `[data-size="action"]` selectors | The TSX size map exports only standard/compact. Consumers can silently create undocumented sizes. | Search all consumers; migrate to standard/compact or add a separately reviewed semantic exception with tests. |
| Menu options intentionally differ | `.vt-studio-dropdown-option`, `.vt-studio-dropdown-menu` | Menu rows are not the same geometry as control buttons and should not inherit button press-shadow behavior. | Retain as a documented exception; ensure menu keyboard focus/selection remains visible and contrast is checked. |
| Switch and choice APIs are standard-only | `Studioswitch` and `StudioChoice` hard-code `data-size="standard"`; no size prop | The catalog can imply a universal two-size rule where the component API supports only standard geometry. | Either add compact API variants and real CSS or clearly mark standard-only support in the component and library. |

## 12. Confirmed Primitive Library exception-to-family map

The gallery component at `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` already renders production exports and includes a global defaults card plus a “Global Exceptions & Known Deviations” list. Preserve this production-component provenance; do not replace it with handcrafted preview markup.

| Library family | Current source / exception record | Required catalog treatment |
|---|---|---|
| Canonical + Global Defaults | `STUDIO_COMPONENT_GLOBAL_DEFAULTS`, `STUDIO_COMPONENT_SIZE_DEFAULTS` | Display both size contracts and the global policy; distinguish declared values from effective CSS values until computed-style checks pass. |
| Studio Text Input / Search / Number | `StudioTextInput`, `StudioSearchInput`, `StudioNumberInput` | Show standard and compact; record border/radius/focus/caret and text-color policy; remove field radius/stroke overrides. |
| Studio Text Area | `StudioTextArea` | Show both sizes; separately label multiline minimum height/resize as a functional exception, not a replacement size. |
| Floating Label Input / Text Area | `StudioLabeledInput`, `StudioLabeledTextArea` | Show wrapper plus underlying field; wrapper may position labels only and must not add a second border/radius/focus ring. |
| Button | `StudioButton` | Default, selected, hover, active, focus-visible, disabled at both sizes; same radius/stroke/type/shadow geometry contract. |
| Icon Button | `StudioIconButton` | Both sizes; icon 28px/18px with documented stroke; label and focus accessibility. |
| Split-left | `StudioSplitLeftButton` | Explicit default and selected compact examples side-by-side; assert divider 2px compact / 3px standard and stable shadow anchor. |
| Switches | `Studioswitch` | Current 44px standard-only API must be labelled; do not imply compact support until implemented. Document track/handle and shape radius as a component-specific geometry contract. |
| Radio + Checkbox | `StudioChoice` | Current 44px standard-only API must be labelled; selected state may alter indicator/fill but never outer size or border width. |
| Word Toggles | `Studiotoggle` | 44px/28px; custom words, handle measurement, inset, scale, gap are intentional exceptions. Verify outer stroke/radius and state transitions. |
| Legend Multi Dropdown | `StudioLegendMultiDropdown` | Trigger follows size contract; listbox/options are menu-surface exceptions, not buttons. |
| Generic Dropdown / options | `.vt-studio-dropdown-menu`, `.vt-studio-dropdown-option` | Record menu shadow/radius, option typography/min-height, separators, keyboard focus and selected treatment. |
| Layout containers | `data-vt-studio-layout` | Exclude from button/field size compliance counts; document layout sizing separately. |

## 13. Evidence status and audit scope

**Verified from source:** exported size/global constants; duplicate CSS rules for split-left rails, button typography, field radius/stroke, hover/active shadow behavior, timing, focus outline, and undeclared `small`/`action` sizes; production catalog renders real component exports and lists known deviations.

**Not yet verified:** final computed style after every consumer stylesheet; every importing consumer across the repository; live desktop/mobile rendering; browser-based hover/active behavior; automated regression checks; build/test outcomes. No finding in this document should be marked “fixed” based on a source edit alone. After remediation, update each row with the verification method and result.

**Governance rule:** An exception is valid only when (1) it has a stable ID, (2) the affected component and size are named, (3) the reason is functional/accessibility-related rather than historical convenience, (4) the exception is represented in the component-library family notes, and (5) a test or rendered check verifies it. All other divergences are defects, not exceptions.


## 14. Additional global-policy conflicts confirmed during this pass

These findings extend the exception index; they are source-level observations, not a claim about final computed styles.

| Finding | Source | Conflict | Required correction |
|---|---|---|---|
| Global field fill policy is centralized in the canonical field rule | `STUDIO_COMPONENT_GLOBAL_DEFAULTS.textFieldDefaults` vs early and later field selectors in `studio-control-system.css` | TypeScript describes default primary at 50% opacity and focus primary at 15%; CSS uses both transparent-mixed and white-mixed fills across overlapping selectors. | Keep one canonical default/focus field-state rule and test the computed fill in both sizes; placeholder typography must match entered text. |
| Global focus says no gap, CSS adds one | `STUDIO_COMPONENT_GLOBAL_DEFAULTS.focusOutline` vs `:focus/:focus-visible` field rule | Policy says no gap; one field focus rule sets `outline-offset: 1px`. | Set text-input and textarea focus outline offset to 0; standard/compact focus and secondary-outline widths are machine-readable tokens. |
| Global menu policy contradicts panel styling | `STUDIO_COMPONENT_GLOBAL_DEFAULTS.shadowPolicy` vs `.vt-studio-dropdown-menu` | Policy describes dropdown menus/options as having no shadows, while the menu panel defines a hard offset shadow. Options and panel are different surfaces but the policy does not clearly distinguish them. | Clarify the contract: menu options have no button shadow or press-motion; explicitly decide whether the floating panel may have a stationary panel shadow. Record the decision in the dropdown exception row and library. |
| Focus and inset strokes are not fully size-driven | Text-field base and later canonical field selectors | Multiple selectors define inset width, outer stroke, outline width and outline offset; some use literals and one uses `!important`. | Express outer stroke and inset stroke with separate named size tokens; avoid duplicate state selectors and unnecessary `!important`. |
| Catalog style must not be read as primitive geometry | `studio-hub-primitive-catalogs.css` | Reference cards/headings have their own frame border, radius and shadow values, distinct from the production control under test. | Keep card styles scoped to catalog wrappers; identify them as reference framing and never include them in primitive compliance measurements. |

### Global-default completeness checklist

For both **standard (44px)** and **compact (28px)**, the executable contract and library must expose all of the following—not only height:

- Typography: font family, text size, weight, transform, tracking, line-height and text stroke.
- Geometry: height, box-sizing, outer border width/color, corner radius, padding and icon rail/label layout.
- Icons: width/height and stroke width.
- Color: primary/secondary pair mapping, default/selected/hover/pressed fills, text/indicator colors and disabled treatment.
- Shadow: X/Y offset, shadow color/opacity, stable anchor, hover travel and pressed travel.
- Motion: hover duration, click duration, easing and reduced-motion fallback.
- Focus: focus-visible ring color, stroke width, offset, and whether it changes layout (it must not).
- Fields: default/focus fill opacity, outer border, inset stroke, caret, placeholder and text stroke.
- State invariants: selected/default geometry match; disabled controls do not press; hover/active never thicken a border or divider.
- Exceptions: component, variant, affected size, property, reason, owner/source, library entry and verification evidence.

If a value is not defined in the current exported constants (for example, shadow opacity, field inset stroke by size, or focus offset by size), mark it **undefined / needs contract decision** rather than inventing a default. The correction phase must add it to the contract before styling it.

### Change note — 2026-10-14

This pass reuses this existing canonical document rather than creating a competing duplicate. The document is linked from `docs/UI.md`; `docs/Index.md` already links to this path. The global contract remains a declared baseline, and the exceptions remain open until CSS is reconciled and browser/test evidence is recorded.


## 14. Revised field-only requirements (user-confirmed 2026-10-14)

- Text inputs: standard 44px high with 38px text; compact 28px high with 24px text.
- Text areas: both standard and compact use a 92px minimum height. Text areas are the documented exception to standard/compact height and text-size defaults; they still follow the size-specific border and corner-radius rules.
- Field border width follows the global size token: standard 3px, compact 2px.
- Field corner radius follows the global size token: standard 6px, compact 4px.
- Default fill is 100% primary color for all components except text inputs and text areas, whose default fill is 50% primary color.
- Focus styling applies to text inputs and text areas only. The secondary-color outline must have zero offset (no gap). Do not add focus-outline styling to other component families unless explicitly approved.
- Remove any obsolete exception entries that describe the field border/radius as defects after these rules are implemented; keep source-level legacy declarations in the drift audit until a repository-wide cascade audit confirms they no longer win.

**Implementation note:** A final authoritative CSS block was added for field selectors to neutralize older duplicate declarations. It must be followed by computed-style checks and, where practical, earlier duplicate declarations should be consolidated rather than leaving a permanent cascade workaround.


## 15. Post-merge recovery audit — 2026-10-14

**Audit branch:** `audit/recover-post-merge-studio-edits-20261014`  
**Integration baseline:** `master/consolidated-feature-integration` at `19c2b2870c16144cb09703f83c587c06dcec3cb0`  
**Purpose:** Record verified cascade and integration discrepancies before restoring implementation changes. This section is source inspection, not browser certification.

### Verified discrepancy: PR #168 field focus rule is not the sole effective rule

The current integration CSS still contains the earlier general field focus rule:

```css
[data-vt-studio-control]:is(input, textarea, select):focus,
[data-vt-studio-control]:is(input, textarea, select):focus-visible {
  outline-offset: 1px;
}
```

PR #168 appends a more specific field-only correction with `outline-offset: 0 !important` for text inputs and textareas. That correction should win for those matched inputs/textareas, but the general selector remains active for selects and still declares a 1px gap. The contract must therefore be stated precisely: zero gap for text inputs and textareas only; select/menu focus is a separate component-family decision and must not accidentally inherit the field correction.

### Verified conflict: textarea type-size declarations contradict one another

The integration CSS contains a PR #159 textarea-specific rule using `font-size: 18px !important` for standard textareas and `14px !important` for compact textareas. PR #168 subsequently appends a rule requesting `font-size: 24px` for both sizes without `!important`. Because the earlier 18px/14px declarations are important and the later 24px declarations are not, the later declarations do not override them. The intended textarea typography is resolved here as 18px standard / 14px compact at font weight 1000, matching the multiline exception in the size contract.

The canonical contract now explicitly selects 18px standard / 14px compact at font weight 1000 and preserves the 92px minimum height. Obsolete competing textarea declarations must be removed or verified not to win.

### Verified surviving source-level drift

The integration CSS still contains declarations inconsistent with the declared global size/motion contract, including:
- Generic button typography declarations of 32px standard and 10px compact.
- Button height-variant overrides of 36px standard and 22px compact, including `!important` on button font sizes.
- Compact split-left rail `border-right-width: 3px`, inconsistent with the 2px compact stroke.
- Button hover/click transitions at 180ms while the exported size contract declares 150ms hover and 300ms click.
- Active buttons remove the shadow (`box-shadow: none`) while translating by the full shadow offset. This violates the fixed-shadow-anchor contract; the face should move over the anchored shadow rather than the shadow disappearing or changing offset.
- The generic button hover rule rewrites the box-shadow offset instead of keeping the anchor fixed.

These are not inferred from a PR's description: they are present in the current integration CSS source. Their exact rendered impact still requires browser computed-style and visual checks.

### Post-merge branch handling finding

The former PR #168 head branch, `fix/studio-primitive-size-shadow-contracts-20261014`, currently compares as **3 commits ahead and 39 behind** the integration branch. The PR is already merged. Its head is therefore not a safe place to continue work, and those three branch-only commits must be inspected individually before deciding whether any contain recoverable changes. Do not merge that stale branch wholesale because it is heavily behind the integration baseline.

### Recovery ledger

| Finding | Evidence in integration | Action |
|---|---|---|
| Textarea font-size conflict (#159 vs #168) | Important 18px/14px rules coexist with later non-important 24px rules | Resolve requirements and consolidate to one authoritative selector |
| Field focus offset | General selector says 1px; #168 text input/textarea correction says 0px important | Keep zero-gap scope limited to text inputs/textareas; document other field-like controls separately |
| Button shadow anchor | Hover rewrites shadow offset; active removes shadow | Restore fixed shadow anchor and move the face only |
| Compact split rail stroke | Compact rail explicitly uses 3px right border | Make rail divider consume compact 2px stroke token |
| Button typography | 32/10 and 36/22 rules remain beside declared 38/24 size defaults | Reconcile button label typography with confirmed primitive-specific exceptions |
| Stale #168 head | 3 ahead / 39 behind integration | Inspect the three unique commits; selectively cherry-pick/reimplement only verified missing work |

### Verification boundary

This recovery pass confirms source-level discrepancies. It does not claim that every one of these defects was caused by editing an already-merged PR, nor that any fix has been visually certified. Before calling a finding recovered, compare its original PR/commit patch with the current target branch, apply the correction on a fresh branch from the current integration baseline, inspect the resulting diff, and verify the merged commit. Run available typecheck/tests/build and browser computed-style checks when possible.


## 16. Post-PR #189 completion — 2026-10-15

PR #189 is merged. This follow-up starts from the current `master/consolidated-feature-integration` head and does not replay the stale pre-merge branch.

### Phase 3 — Finish canonical field behavior
- Keep a single primary-colored native insertion-caret declaration in the canonical field block.
- Preserve the 92px multiline minimum, standard 18px / compact 14px type, and weight 1000.
- Ensure placeholders inherit the exact value typography and use the primary color.
- Use size tokens for default/focus fill, border, radius, outline width, secondary focus accent, and zero offset.

### Phase 4 — Complete button, split-left, and dropdown contracts
- Ordinary buttons are standard/compact only; 56px prominent actions remain a distinct `StudioActionButton` family.
- Split-left geometry uses shared height/stroke/radius/shadow/icon tokens; selected state swaps pair colors only.
- Legend Multi's floating label must not participate in trigger sizing; selected-value text is shrinkable and ellipsized rather than pushing the chevron/count outside the control.
- The trigger has no button shadow or press translation. The floating menu panel is a separate surface and may use its own stationary shadow.
- Dropdown option typography/row height are explicitly documented menu exceptions.

### Phase 5 — Confirmed Primitive Library and evidence
- The gallery imports the actual Studio components and names them with their public canonical exports.
- The global defaults panel formats nested objects recursively; it must never show `[object Object]`.
- Word-toggle skins 1, 3, 4, and 5 are rendered from a single collection in one four-column variant container per size row.
- Keep library-only frame styles scoped to catalog wrappers; do not let them redefine the production component.
- Run source governance, focused Vitest, TypeScript, production build, and rendered desktop/mobile checks. A successful source diff alone is not visual certification.

**Phase 3–5 status:** PR #191 merged to `master/consolidated-feature-integration`. Source changes are part of the current integration head; visual certification is still a separate gate.

## 17. Confirmed Library phases 6–8 — 2026-10-15

### Phase 6 — canonical source and component provenance
- The Confirmed Primitive Library imports the real Studio exports from `src/studio-ui/primitives/StudioControls.tsx`; production control behavior remains owned by `src/styles/studio-control-system.css`.
- Catalog provenance identifies those two files. Catalog CSS is restricted to specimen layout and explanatory metadata; it must not redefine production dropdown rows, word-toggle geometry, or component tokens.
- The library renders `StudioActionButton` as a distinct 56px prominent-action family. It is not a third size of `StudioButton`; ordinary buttons remain 44px standard / 28px compact.
- The global defaults inspector formats nested values recursively and must not display `[object Object]`.

### Phase 7 — one layout contract for control variants
- Switch, radio, checkbox, and word-toggle skins use the same four-column `.vt-confirmed-control-variants` structure. Word-toggle variants 1, 3, 4, and 5 come from one data-driven skin collection, repeated by size row.
- The compact row uses the same markup with a size data attribute; responsive CSS may move the columns to two across on narrow screens without creating a second component/layout implementation.
- Dropdown specimen CSS controls only stacking, overflow, and the standard-full-row / compact-two-up specimen arrangement. Its geometry, option typography, borders, and shadows remain defined by the production Studio dropdown stylesheet.
- Superseded confirmed-catalog dropdown typography overrides and legacy split word-toggle layout classes are removed. Do not delete unrelated `.vt-complete-catalog` styles solely because they share this combined stylesheet; that is a separate legacy catalog surface and needs its own migration.

### Phase 8 — governance and verification
- The governance test checks canonical Studio imports, source provenance, recursive defaults formatting, the distinct 56px action family, one data-driven word-toggle skin collection, responsive shared variant-grid selectors, and absence of superseded Confirmed Library dropdown overrides.
- A source test is not a substitute for runtime verification. Run the focused governance test, TypeScript check, CSS parser, production build, and browser review for standard/compact, selected/disabled, focus-visible, open dropdown stacking, narrow widths, and reduced motion.
- **Verification boundary:** this branch's source edits do not imply that those commands or browser checks have passed. Record actual CI results and browser evidence before declaring phases 6–8 fully certified.


## 18. Confirmed Library phases 1–3 — 2026-10-15

### Phase 1 — Canonical + Global Defaults display
- The library renders the exported `STUDIO_COMPONENT_GLOBAL_DEFAULTS` and `STUDIO_COMPONENT_SIZE_DEFAULTS` values rather than copying a second set of token values into the gallery.
- The gallery now explains standard 44px / 3px stroke / 6px radius and compact 28px / 2px stroke / 4px radius in natural language.
- Field behavior is described by state: at rest, primary-color text/caret, 50% primary fill, black outer border, and primary inset stroke; focused, 15% primary fill and black text while retaining the inset stroke and secondary-color accent.
- The prior live audit measured the visible secondary-color accent as a 3px standard / 2px compact box shadow, while the computed outline itself measured 1px. The two layers are documented separately; this note is historical evidence, not certification of a new deployment.

### Phase 2 — Four-skin control rows
- Switches, word toggles, radios, checkboxes, and X checkboxes label the four skin variants as `SOLID`, `COLOR SWAP`, `BLACK`, and `WHITE`.
- Every skin set uses one four-column row. Narrow-screen rules preserve the four-item row with a minimum column width rather than silently stacking each skin into its own row.
- Skin labels describe the actual variant names; the internal skin prop values remain unchanged.

### Phase 3 — Standard / compact specimen layout
- Standalone text inputs, labeled inputs, buttons, split-left buttons, and dropdowns use a full-width standard specimen row followed by a two-column compact A / compact B row.
- Standalone compact text input now has both A and B specimens.
- Button and split-left families use two columns so each standard specimen spans the full row and its compact A/B specimens sit together underneath; selected-state examples follow the same grouping.
- The gallery-only CSS controls specimen layout and does not redefine production component geometry or interaction behavior.

**Verification boundary:** source changes are recorded; automated checks and live browser review are still required before marking the new layout visually certified. The known compact button wrapper/face width discrepancy must be rechecked against the resulting deployed CSS.


## 19. Confirmed Library phases 4–6 — 2026-10-15

### Phase 4 — Natural-language non-default settings
- Rewrote the visible settings notes for switches, radio/checkbox/X-checkbox controls, word toggles, text inputs, text areas, ordinary buttons, prominent actions, split-left buttons, labeled fields, and the Legend Multi dropdown.
- Notes now explain what the setting changes, the default state, selected/disabled/loading/focused behavior, and which behavior is shared versus a component-specific exception.
- Corrected the labeled-field documentation: the actual public prop is `label`; there is no `overlayLabel` prop.
- The notes distinguish the dropdown trigger from the floating menu panel and its options. Menu options do not use button-press shadows or press motion; any panel shadow is stationary.
- The wording describes the current source contract; it is not a substitute for checking computed styles in the deployed UI.

### Phase 5 — Floating-label geometry and Compact B focus exception
- Floating-label type is reduced from 32px to 24px (25% smaller); the lifted label box padding is reduced from 3px / 6px to 2.25px / 4.5px, and its corner radius from 4px to 3px.
- The lifted label uses `translateY(-75%) scale(.75)`, placing the bottom quarter of the label box across the top edge of the black control border. The field's canonical size, border, and radius are not changed.
- Labels retain Inter, weight 1000, uppercase treatment, and a 0.5px text stroke matching the current text color.
- `StudioLabeledInput` now exposes an explicit `variant="a" | "b"` specimen variant. Only the Compact B library specimen uses `variant="b"`; its focused/focus-visible input receives a solid secondary-color outline at the compact 2px focus width and zero offset. The rule is scoped to that variant and does not change Compact A, standard fields, or textarea focus.
- Reduced-motion handling remains in place for floating-label transitions.

### Phase 6 — Regression and visual verification gate
- Extended `scripts/audit/confirmed-library-layout.test.mjs` to assert the label geometry, text stroke, explicit Compact B variant, scoped secondary-color focus stroke, and accurate natural-language settings text.
- Source-level review must also confirm the phase 1–3 four-skin and standard/compact layouts, the real public prop names, and no duplicate catalog borders or production-geometry overrides.
- Run `npm run test:confirmed-library-layout`, `npm run typecheck`, `npm run check:css`, the relevant/full test suite, and `npm run build`; record each result rather than inferring success from a source diff.
- Visually inspect standard and compact labeled inputs at rest, focused, populated, disabled, and keyboard focus-visible states; verify Compact B alone gets the solid 2px secondary stroke, the bottom quarter of the label box overlaps the black border, and no clipping, duplicate borders, layout shift, or shadow doubling occurs. Repeat at desktop and narrow portrait/landscape widths and check reduced motion.
- Recheck the known compact button wrapper/face width discrepancy in a deployed browser. Vercel deployment rate limiting and a failed/cancelled workflow are not visual or build certification.

### Phase 6 verification record — GitHub Actions run 38690129673
- **Passed:** `npm run test:confirmed-library-layout` (after correcting the button specimen label expectations); `git diff --check`; `npm run check:routes`; `npm run check:css`; `npm run check:quarantine`; `npm run check:src-governance`; `npm run check:privacy-src`; AI-system governance tests; focused contracts; account tests; production build; and local Playwright smoke checks.
- **Blocked by repository-wide issues outside this change:** `npm run typecheck` fails in unrelated files including `src/app/superToolViewRegistry.ts`, `src/components/CommentResponder.tsx`, `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx`, `src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx`, `src/features/editor/mobile/components/PanelBodies.tsx`, `src/services/video-package/ProjectVideoPackageBridge.ts`, `src/services/video-package/VideoPackageRepository.test.ts`, and `src/studio-ui/StudioHubCertification.tsx`. `npm test` also fails existing assertions expecting obsolete mobile-widget CSS and an obsolete `<WidgetSplitButton>` implementation; neither is in this PR's changed-file list.
- **Passed live browser inspection:** on 2026-10-15, the public [Studio deployment](https://publisher-3n7h.onrender.com/studio) showed 24px TITLE/DESCRIPTION labels, the label box overlapping the black top border, the additional solid secondary-color focus accent on Compact B (Compact A retained the shared treatment), and SOLID / COLOR SWAP / BLACK / WHITE control skins in four-column rows. Labeled-input Compact A/B specimens were side-by-side. The inspection was read-only; no forms were submitted, no text was entered, and no data/settings were changed. Screenshots were captured by the browser inspection tool.
- The focused regression test initially caught a stale expected specimen label; the assertion was corrected to match the actual rendered labels and passed in the subsequent CI run.

**Verification boundary:** phases 4–5 are implemented; the dedicated layout regression, source-governance checks, CSS parser, production build, focused tests, local smoke checks, and the four requested live visual checks pass. Phase 6 remains partially blocked by unrelated repository-wide typecheck/full-suite failures and remaining browser checks for populated/disabled states, narrow portrait/landscape widths, reduced motion, and the compact button wrapper/face width discrepancy. Do not describe the overall typecheck/full suite as passing.


### Follow-up: button shadow ownership and split-left edges — 2026-10-15
- PR #206 moved the hard offset shadow from the animated face to the stationary outer button for both 44px/28px Studio buttons and the separate 56px action-button family. Hover/press movement remains on the face, so the shadow no longer travels with the face.
- Split-left outer wrappers now explicitly reset native appearance, border, and background, and remain overflow-visible. The actual face owns the black border and radius and clips the icon rail inside that radius. This removes the extra light wrapper edge and prevents the wrapper from clipping the stationary shadow.
- Regression coverage was added for stationary shadow ownership, face-only movement, split-left overflow, and wrapper reset.
- PR #206 merged to `master/consolidated-feature-integration` at `45a4bb8627e6710cc9cb1368a2a05287d76ec645`. Focused Confirmed Library tests, source-governance/CSS checks, focused contracts, production build, and local Playwright smoke passed. Repository-wide typecheck remains blocked by the unrelated errors listed above; live Render visual inspection remains outstanding.
