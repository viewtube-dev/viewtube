# Studio Controls — Global Defaults & Exception Index

**Status:** Audit baseline / correction plan (not a certification that rendered controls currently conform)  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Audit work branch:** `fix/studio-primitive-size-shadow-contracts-20261014`  
**Last reviewed:** 2026-10-14  
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
| Text color | Black by default; text fields use primary-color text in default mode per exported field policy | Component/state dependent |
| Stroke color | Black (`#000`) unless a documented state-specific text stroke applies | Outer borders and default button outlines |
| Background fill | Buttons use primary; text fields use primary at 50% opacity | Default state |
| Motion easing | `ease-out` | All transitions |
| Border-radius policy | Size-specific: standard 6px; compact 4px | All components unless an explicitly indexed exception is approved |
| Border-width policy | Size-specific: standard 3px; compact 2px | All components unless an explicitly indexed exception is approved |
| Shadow policy | Hard offset shadow is for buttons only. Dropdown menus/options do not use press-motion; text fields use inset primary stroke and focus outline. | Semantic exception, not permission for arbitrary per-component drift |
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

**Critical contract note:** The constants currently call the compact outer stroke 2px, but the CSS explicitly gives compact split-left rails a 3px right border in one rule and later reintroduces a 3px rail border in a more general rule. The CSS also contains a later text-field rule that forces an 8px radius, overriding the intended 6px standard radius. These are confirmed source-level contradictions.

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

CSS currently uses the button's own `box-shadow` and changes the shadow offsets on hover, then removes the shadow and translates the button on active. This violates the stable-shadow-anchor contract: the shadow is coupled to the moving face in hover and disappears as a style change rather than being covered by the face.

## 5. Exception index

Exceptions below are either intentional semantic exceptions or known drift. Only intentional exceptions should remain after remediation.

| ID | Component / family | Intended exception | Current source behavior / issue | Status |
|---|---|---|---|---|
| E-01 | Text inputs, search/number inputs | Native field semantics; default field text color/stroke follows field policy; inset primary stroke; secondary focus outline | Later canonical field rule forces `border-radius: 8px`, `border: 3px`, and inset stroke `1px` for all sizes; compact sizing is inconsistent | **Defect: remove hard-coded radius/stroke and use size tokens** |
| E-02 | Textareas | Taller writing surface; resize behavior; compact minimum height may be smaller | Generic textarea rules use 144px minimum height and compact/small 72px; typography/padding also overridden; clarify if 28px means control chrome height or multiline minimum height | **Needs explicit documented geometry exception** |
| E-03 | Dropdown trigger | Trigger behaves like a button; menu overlays content | Trigger gets a white-mixed background; component class may have separate sizing and state styling | **Review token inheritance and size conformance** |
| E-04 | Dropdown menu / options | No button shadow and no press-motion on options; menu can use its own panel geometry | `.vt-studio-dropdown-menu` uses 8px fallback radius and shadow fallback 4px; options have fixed 14px font, 40px minimum height and 2px separator, outside the 44/28 control contracts | **Intentional menu exception; document and visually verify** |
| E-05 | Split-left button rail/divider | Rail is a separate colored icon region; divider should match the button's declared stroke size | Compact variant explicitly uses `border-right-width: 3px`; later general split rail uses `border-right: 3px solid #000`. This causes the reported thick compact divider in default and selected states | **Defect: derive divider from size stroke token** |
| E-06 | Split-left selected state | Selected state swaps primary/secondary colors only; geometry is unchanged | Selected CSS explicitly preserves shadow but does not neutralize the conflicting 3px rail rules; selected state can inherit same thick divider | **Defect: selected state must not override geometry** |
| E-07 | Button typography | Button and split-left labels share the same type contract | Base button CSS declares 32px; compact declares 10px; height variant 44 forces 36px !important; compact height variant forces 22px !important. Split label rules repeat sizes, then later inherit. This conflicts with declared 38px/24px defaults | **Defect: remove contradictory type declarations; one token source** |
| E-08 | Button radius | Standard 6px, compact 4px | Base token radius 6px; compact selector sets 4px; later field-only rule sets 8px. Other class/inline rules need repository-wide scan | **Partial defect confirmed; standard button radius still needs full cascade audit** |
| E-09 | Button shadow and transitions | Fixed shadow anchor; face moves half shadow on hover and full shadow on click | Hover changes box-shadow offsets; active sets shadow none and translates button. CSS transitions use 180ms, while constants say 150ms/300ms | **Defect: separate face/shadow layers and unify timings** |
| E-10 | Switches, radio buttons, checkboxes | 44px square controls with variant skins/shape; selected state changes indicator/fill | Implementations hard-code `data-size="standard"` even though switch/choice APIs have no size prop; CSS family rules and tokens must be audited against intended 44px / stroke / radius values | **Needs audit; explicit API only supports standard currently** |
| E-11 | Word toggles | 44px default or 28px compact; active handle measures selected word; skin/words/gap/inset may be customized | Dynamic measured handle and inline style are intentional geometry exceptions; CSS/state transitions must be checked for border/radius/motion consistency | **Intentional dynamic-width exception; audit remaining size behavior** |
| E-12 | Floating-label input/textarea wrappers | Wrapper adds label positioning, not a second editable control | Wrapper classes are separately styled in catalog CSS; ensure they do not change field size/radius/stroke or duplicate focus rings | **Needs cross-file cascade audit** |
| E-13 | Small/small-size compatibility | CSS defines a `data-size="small"` height of 32px although canonical contract exports only standard/compact | Legacy third size can bypass the two-size rule | **Defect unless a documented migration-only exception is approved** |
| E-14 | Action-size compatibility | CSS defines `data-size="action"` height 56px and button typography overrides | The canonical exported size map has only standard and compact; action is an undocumented third size relative to this contract | **Defect/compatibility debt: inventory consumers and either migrate or formally document separate non-button layout semantics** |
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
| Global field fill policy is not singular | `STUDIO_COMPONENT_GLOBAL_DEFAULTS.textFieldDefaults` vs early and later field selectors in `studio-control-system.css` | TypeScript describes default primary at 50% opacity and focus primary at 15%; CSS uses both transparent-mixed and white-mixed fills across overlapping selectors. | Keep one canonical default/focus field-state rule and test the computed fill in both sizes. |
| Global focus says no gap, CSS adds one | `STUDIO_COMPONENT_GLOBAL_DEFAULTS.focusOutline` vs `:focus/:focus-visible` field rule | Policy says no gap; one field focus rule sets `outline-offset: 1px`. | Set the field outline offset to 0 unless a named, indexed variant explicitly needs separation. |
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
