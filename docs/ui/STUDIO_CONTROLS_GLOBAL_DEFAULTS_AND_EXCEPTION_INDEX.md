# Studio Controls — Global Defaults & Exception Index

**Status:** Confirmed Library source-parity audit in progress on `reconcile/confirmed-library-and-stepper-2026-10-15`; tests updated, execution and rendered verification pending  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Current work branch:** `reconcile/confirmed-library-and-stepper-2026-10-15` (confirmed-catalog fidelity audit and default-style parity)  
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

## 1A. Confirmed Library source-parity pass (2026-10-15)

The Confirmed Primitive Library must describe the production component that actually renders, not an idealized redraw or a stale token snapshot. Catalog specimens import production primitives; catalog CSS should only control specimen layout. The gallery should distinguish declared shared defaults, effective CSS, family-specific exceptions, and examples that are static visual previews rather than live operation outcomes.

| Concern | Current source-aligned representation | Exception / verification boundary |
|---|---|---|
| Shared geometry | Standard 44px / compact 28px; 3px / 2px border; 6px / 4px radius for ordinary buttons and fields | 44px switch/choice rectangular corners and standard word-toggle use reference-specific 7.333px radii |
| Typography | Inter, weight 1000, uppercase, -0.02em tracking, 0.86 baseline line-height | Single-line inputs 38px / 24px; textareas 18px / 14px with multiline padding/line-height |
| Button shadow and motion | Standard 3px × 3px; compact 1.5px × 1.5px; 180ms general/hover, 80ms active press | Active shadow movement still differs from the stable-shadow target; see Section 7 |
| Default icon size | Large preset: 38px / 1.9 stroke standard; 24px / 2.0 stroke compact | Current 28px/18px and moderate 34px/22px presets are optional API variants, not default gallery specimens |
| Dropdown | Legend Multi is a production multi-select; gallery shows closed triggers with initial selection/placeholder | Menu opens only after interaction; this gallery does not depict an initially open menu |
| Icon effects | Notification count and success state are static gallery previews | They are not real notification counts or live successful operations |

The source regression command is `npm run test:confirmed-library-layout`. Assertions now cover the compact shadow, shared tracking/motion tokens, default icon metrics, actual specimen states, and static-preview labels. **Source assertions are not visual certification.** Test execution, typecheck, CSS parsing, production build, and rendered browser checks remain required.

## 2. Global defaults shared by both sizes

| Property | Global default / policy | Application |
|---|---|---|
| Font family | `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif` | All control text |
| Font weight | `1000` (maximum-heavy emphasis) | All control text unless a documented functional exception applies |
| Text transform | Uppercase | Buttons, fields, labels, dropdown options |
| Letter spacing | `-0.02em` | Matches the effective Studio control CSS; a component may document a narrower exception |
| Line height | `0.86` baseline; component geometry may align a label using a documented equivalent | Text controls and button labels |
| Primary / secondary color authority | Primary = `--pair-a`; secondary = `--pair-b` | Shared color-pair contract |
| Text color | Action labels are black; text fields use primary (`--pair-a`) at rest and black only while focused | Component/state dependent |
| Stroke color | Black (`#000`) unless a documented state-specific text stroke applies | Outer borders and default button outlines |
| Background fill | Ordinary buttons use the primary color; text fields use primary at 50% opacity at rest and 15% in focus | State-specific; menu panel is a separate surface |
| Motion easing | `ease-out` | All transitions |
| Border-radius policy | Size-specific: standard 6px; compact 4px | All components unless an explicitly indexed exception is approved |
| Border-width policy | Size-specific: standard 3px; compact 2px | All components unless an explicitly indexed exception is approved |
| Shadow / focus policy | Hard offset shadows belong to button faces and stationary dropdown panels. Text fields retain a primary inset stroke and a separate secondary-color focus accent; do not confuse the accent shadow with the computed CSS outline. | Component and state specific |
| Stable shadow geometry (target) | Shadow anchor/offset stays fixed; button face moves independently | Target contract; current active-state mismatch is documented in Section 7 and is not certified as fixed |
| Hover press depth | Move halfway across the declared shadow offset; preserve the shadow anchor | Standard button hover follows this target; the prominent action moves its outer control instead |
| Click press depth | Move the remaining half so the face covers the shadow completely; shadow does not travel with the face | Current active-state rules still move the outer shell and hide the shadow; see Section 7 |
| Motion timing | General/hover 180ms; active press 80ms | CSS variables/fallbacks and exported tokens now agree; test and browser verification are pending |
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
| General/hover transition | 180ms | 180ms |
| Hover face movement | 1.5px (half of 3px) | 0.75px (half of 1.5px) |
| Active press transition | 80ms | 80ms |
| Click face movement | 3px (full offset; covers shadow) | 1.5px (full offset; covers shadow) |
| Default button icon size | 38px | 24px |
| Default large button-icon stroke | 1.9px | 2.0px |

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
| E-12 | Floating-label input/textarea variants | The input family adds a floating-label presentation to the canonical input; the textarea family adds it to the canonical writing surface. Neither creates a second native-control family. | `variant="floating-label"` adds only wrapper/label presentation; native field semantics, typography, selected size geometry, focus, and textarea multiline behavior remain owned by the corresponding family. | **Implemented in this refactor; build, source tests, and browser verification pending** |
| E-13 | Small/small-size compatibility | CSS defines a `data-size="small"` height of 32px although canonical contract exports only standard/compact | Legacy third size can bypass the two-size rule | **Defect unless a documented migration-only exception is approved** |
| E-14 | Action-size compatibility | CSS defines `data-size="action"` height 56px and button typography overrides | The canonical exported size map exposes only standard and compact; the separate 56px StudioActionButton is a distinct family, not a StudioButton size | **Defect/compatibility debt: inventory consumers and either migrate or formally document separate non-button layout semantics** |
| E-15 | Focus and reduced motion | Focus needs visible, stable outline; reduced-motion must remain understandable | Focus uses 3px outline / 3px offset on buttons, not size-derived; reduced-motion sets transition duration to .01ms globally, suppressing most motion feedback | **Needs accessibility review and state feedback alternative** |
| E-16 | Catalog defaults panel | Gallery should expose the real defaults and list every non-default setting | Catalog renders exported global and size constants, but those constants do not reflect every CSS override; per-family non-default lists exist but do not enumerate CSS drift | **Defect: add effective-vs-declared drift and exception status to catalog** |

## 6. Component family inventory — represented vs not yet represented

This inventory separates visible Confirmed Primitive Library specimens from related exports that are not currently demonstrated in the gallery. A related component is not certified by proximity to a similar specimen.

| Family / export | Primary component/source | Confirmed gallery representation | Required checks / boundary |
|---|---|---|---|
| Text Input | `StudioTextInput` — `StudioControls.tsx` / `StudioTextInput.tsx` | **Shown:** standard, compact, floating-label, fixed-label, and disabled compact specimen | Search/number input exports are not individually shown here; verify typography, field chrome, focus, caret, and label overlap |
| Text Area | `StudioTextArea` — `StudioControls.tsx` / `StudioTextArea.tsx` | **Shown:** standard/compact, floating-label, and fixed-label variants | Preserve 18px/14px typography, 92px minimum surface, multiline padding, and vertical resize |
| Floating-label input/textarea | `StudioTextInput` / `StudioTextArea` variants | **Shown as variants**, not separate native-control families | Wrapper adds label presentation only; field geometry and native semantics stay with the owning component |
| Button | `StudioButton` | **Shown:** standard/compact, default, neutral, selected, selected+disabled | Text 38px/24px; 3px/2px stroke; 6px/4px radius; active-shadow behavior remains a gap against the stable-shadow target |
| Prominent Action | `StudioActionButton` | **Shown:** separate fixed 56px action family | 3px border, 6px radius, 20px text; outer-control translation and active shadow suppression are described in the gallery |
| Generic Icon Button | `StudioIconButton` | **Not separately shown**; square icon specimen is a distinct component | Do not infer this export is gallery-certified from the Square Icon Button family |
| Square Icon Button | `StudioSquareIconButton` | **Shown:** V1–V4 standard/compact and all seven effects | Default large icon preset: 38px/1.9 standard, 24px/2.0 compact; badge/success specimens are static previews, not live outcomes |
| Split-left Button | `StudioSplitLeftButton` | **Shown:** standard/compact, default, neutral, selected, selected+disabled | Divider uses 3px/2px stroke; default large icon preset is 38px/24px; active-shadow gap remains documented |
| Switch | `StudioSwitch` / `Studioswitch` | **Shown:** 44px only, round/rectangular, four skins | Standard-only API; track/handle geometry and state-specific indicator colors are exceptions to ordinary button geometry |
| Radio / Checkbox / Wide-X Checkbox | `StudioRadio`, `StudioCheckbox`, `StudioXCheckbox` | **Shown:** 44px only, shape/mark and skin variants | Selected state reveals skin-specific marks; browser checks should inspect on/off, disabled, and focus states |
| Word Toggle | `StudioWordToggle` / `Studiotoggle` | **Shown:** standard/compact and three skins | Standard radius 7.333px is reference-specific; handle width measures the active word and can be customized |
| Legend Multi Dropdown | `StudioLegendMultiDropdown` | **Shown:** closed standard trigger with selected values and two closed compact triggers | Menu options appear only after user interaction; the gallery does not start with an open-menu specimen |
| Native Select | `StudioSelect` | **Not separately shown** | Do not treat the Legend Multi multi-select as a substitute or certification for native select |
| Dropdown option surface | Legend Multi / dropdown CSS | **Not separately shown as an open panel** | Option typography, focus, keyboard operation, stacking, and panel geometry need rendered verification |
| Layout-only containers | `data-vt-studio-layout` rules | **Not a control primitive** | Do not report container sizing as a control component or family exception |

## 7. Current source-level parity findings (2026-10-15)

These are deterministic source findings; they are not claims from a rendered browser inspection.

1. **Shared defaults reconciled in this pass:** compact button shadow is now 1.5px × 1.5px in tokens and effective CSS; shared tracking is -0.02em; exported motion tokens now match effective CSS at 180ms general/hover and 80ms active press. Regression assertions were added but are not yet executed.
2. **Button active-state shadow behavior remains a gap:** StudioButton moves its outer shell and hides the pseudo-shadow on active; StudioActionButton moves the outer action on hover/active and suppresses the shadow on active. The gallery now describes the action behavior as implemented. Do not certify stable-shadow click behavior until CSS and component tests are reconciled.
3. **Button focus is a family-specific exception:** button focus uses a 3px outline with 3px offset for both sizes. Field focus uses a separate secondary-color accent/outline stack; the catalog distinguishes these.
4. **No implicit third size found in current control CSS:** `data-size="small"` and `data-size="action"` selectors were not found in the audited stylesheet. StudioActionButton remains a separate fixed 56px family, not a third StudioButton size.
5. **The catalog uses production components and calls out key exceptions:** icon metrics, switch/choice and word-toggle corner geometry, textarea typography, dropdown closed state, and action-button press behavior are described explicitly. The defaults panel still prints exported contract values rather than browser-computed styles; browser inspection is required.
6. **Icon-size testing specimens are absent from the Confirmed Primitive Library:** production square/split-left specimens use the default large 38px/24px icon preset. Optional current/moderate API presets remain available to callers but are not shown as size-comparison tests in the confirmed gallery.
7. **Dropdown specimens begin closed:** selected values are shown on the standard trigger; compact examples show closed trigger/count geometry. Their labels no longer imply the menu is already open.

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


## 11. Historical source override index and current disposition (2026-10-14 findings, rechecked 2026-10-15)

This section preserves historical selector patterns and records whether each remains present. A historical pattern is not a current defect unless the current-status column says it remains unresolved.

| Historical finding | Historical source pattern | Current status (source-level) | Follow-up |
|---|---|---|---|
| Compact split divider used standard stroke | Old split-rail rules hard-coded 3px | **Resolved in current CSS:** rail uses `var(--vt-studio-control-stroke)` for 3px standard / 2px compact | Verify default/selected/focus states in browser |
| Typography diverged from size tokens | Older generic/compact/height-variant rules used competing font sizes | **Resolved in current CSS:** ordinary button faces use 38px / 24px; stale 32px/10px/36px/22px values were not found in the audited stylesheet | Keep source regression checks |
| Field radius/stroke overrode size contract | Older field selector used 8px radius and 3px border at both sizes | **Resolved in current CSS:** those override patterns were not found; fields use size-specific 6px/4px radius and 3px/2px stroke tokens | Verify computed styles after consumer CSS |
| Compact shadow token mismatch | Token used 1px while effective CSS used 1.5px | **Resolved in this pass:** tokens and effective CSS both use 1.5px × 1.5px | Run focused test and browser inspection |
| Transition duration mismatch | Older tokens used 150ms / 300ms while effective CSS used 180ms / 80ms | **Resolved in this pass:** exported tokens now match effective CSS at 180ms / 80ms | Run focused test and verify motion in browser |
| Active-state shadow moves/disappears | Active rules translate the outer button and hide its pseudo-shadow | **Still open:** this differs from the stable-shadow target; current gallery text describes behavior rather than claiming it is fixed | Reconcile CSS behavior and component tests before certifying tactile interaction |
| Button focus geometry is shared across sizes | Button focus uses 3px outline and 3px offset for both sizes | **Known exception / review needed** | Approve/document the common focus ring or define size-derived values without weakening visibility |
| Implicit third control sizes | Historical `data-size="small"` and `data-size="action"` selectors | **Resolved in current stylesheet:** those selectors were not found; StudioActionButton is a separate fixed 56px component family | Keep 56px family documented separately |
| Menu options intentionally differ | `.vt-studio-dropdown-option`, `.vt-studio-dropdown-menu` | **Intentional exception**; not a button-press surface | Verify keyboard focus, selection, stacking, and contrast in browser |
| Switch and choice APIs are standard-only | Switch/choice expose no compact size prop | **Current supported API:** gallery labels these as 44px-only; no compact behavior is implied | Add compact variants only if requested and implemented with tests |

## 12. Confirmed Primitive Library exception-to-family map

Use the current represented-vs-not-represented inventory in Section 6 as the canonical gallery coverage table. This older map is retained as a pointer so historical component names and sizes are not mistaken for the current library contract.

- The gallery renders production components, not handcrafted lookalikes.
- Search/number inputs, generic StudioIconButton, native StudioSelect, and open dropdown options are exported/source-level surfaces not individually represented in the Confirmed Primitive Library at this revision.
- Floating labels are variants of StudioTextInput / StudioTextArea, not separate native-control components.
- The Square Icon Button notification and success examples are static visual previews, not live outcomes.

## 13. Evidence status and audit scope

**Verified from current source:** production primitive imports and specimen labels; standard/compact size tokens; compact shadow token/CSS alignment at 1.5px; -0.02em tracking alignment; 180ms / 80ms motion timing alignment; large default icon metrics; component-specific radius and textarea exceptions; dropdown closed initial state; static badge/success preview labeling.

**Added but not executed in this session:** source regression assertions in `scripts/audit/confirmed-library-layout.test.mjs`, exposed as `npm run test:confirmed-library-layout`. GitHub Actions, test command, typecheck, CSS parser, and production build results must be checked on the pull request.

**Not yet verified:** final computed style after every consumer stylesheet; live desktop/mobile rendering; browser-based hover/active/focus behavior; keyboard/accessibility behavior; and the remaining stable-shadow click interaction gap. No source edit alone is proof of browser certification.

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
- **Current-source correction (2026-10-15):** the effective active selectors still move the outer StudioButton shell and hide the pseudo-shadow; StudioActionButton also moves the outer shell on hover/active. The earlier note above overstated stable-shadow behavior for active press. Section 7 and the current catalog descriptions are the current source-level status; rendered verification remains outstanding.
- PR #206 merged to `master/consolidated-feature-integration` at `45a4bb8627e6710cc9cb1368a2a05287d76ec645`. Focused Confirmed Library tests, source-governance/CSS checks, focused contracts, production build, and local Playwright smoke passed. Repository-wide typecheck remains blocked by unrelated existing errors; the full suite also fails on an existing `WidgetSplitButton` source-contract assertion. Live Render visual inspection remains outstanding.


## 20. Confirmed Library density, text-field typography, and deployment gate — 2026-10-15

### Global defaults panel
- The default view shows a one-line summary of standard/compact geometry, global 38px/24px single-line input typography, the textarea-only 18px/14px exception, and the compact shadow size.
- The exhaustive size cards, full global token map, exceptions, and explanatory focus notes live inside an accessible collapsed `details/summary` panel. Opening it exposes the full canonical values; leaving it closed avoids making the library page vertically dominated by the global-defaults reference.
- The expanded global token map uses three columns on wider screens and two on narrow screens.

### Compact button shadow contract
- Standard buttons retain a symmetric 3px × 3px hard shadow offset.
- Compact buttons use a symmetric 1.5px × 1.5px offset, matching the effective CSS and current token contract. Hover moves the inner face by half the offset, but the active rule currently moves the outer StudioButton shell and hides the pseudo-shadow; StudioActionButton also moves its outer shell on hover/active and suppresses its shadow on active. The stable-shadow click behavior remains unresolved and must not be described as fixed.
- The outer button remains overflow-visible; the split-left face owns the black border and radius and clips only its internal icon rail/content.

### Shared text-field typography and module ownership
- Source audit found the root cause of the single-line input mismatch: the root `--vt-studio-text-input-*` custom properties were explicitly set to 18px / 14px, overriding the global 38px / 24px size family. The textarea selectors correctly use 18px / 14px as a multiline writing-surface exception; the root input variables and input-specific selectors must instead follow the global tokens. The single-line input selectors had no corresponding font-size override, so standard and compact inputs could look like the same compact size when upstream declarations/cascades applied.
- The resolved contract is explicit for all four public field forms: `StudioTextInput` and `StudioLabeledInput` use global 38px standard / 24px compact typography with the global 0.86 line height; `StudioTextArea` and `StudioLabeledTextArea` alone use the multiline exception of 18px standard / 14px compact. Textareas retain their multiline-only 92px minimum surface, padding, and 1.25 / 1.3 line heights.
- Related components are grouped in two modules:
  - `src/studio-ui/primitives/StudioTextInput.tsx`: standalone, search, number, and labeled single-line inputs.
  - `src/studio-ui/primitives/StudioTextArea.tsx`: standalone and labeled multiline textareas.
  - `StudioControls.tsx` re-exports these modules for compatibility with existing imports.
- CSS owns single-line input typography explicitly by `data-size`, using the global 38px / 24px font-size tokens and 0.86 line-height. Textarea-only selectors use the separate 18px / 14px tokens and multiline line-height. Labeled components compose the same native primitives instead of maintaining a second style path.

### Word-toggle catalog contract
- Word toggles show three skins only: SOLID, COLOR SWAP, and BLACK. The fourth WHITE skin remains available to switches/radios/checkboxes but is intentionally omitted from the word-toggle examples.
- Standard word-toggle specimens each occupy their own row.
- Compact word-toggle specimens use a centered three-column layout; component alignment and margins are explicitly centered rather than inherited from the global word-toggle left-alignment reset.
- Both the Confirmed Primitive Library and Complete Primitive Catalog use this contract.

### Commit / PR / deployment confirmation record
- **Target branch:** `master/consolidated-feature-integration`
- **Studio defaults implementation PR:** [#219 — Compact Studio defaults and fix shared text-field typography](https://github.com/viewtube-dev/viewtube/pull/219) — merged 2026-10-15; merge commit `c5d885bcaf0ee9bb464484557192136d110d2265`.
- **Typecheck follow-up PR:** [#221 — Follow up Studio primitive integration and restore typecheck](https://github.com/viewtube-dev/viewtube/pull/221) — merged 2026-10-15; merge commit `2d6c0208f971fad91b4ef6df5dbfc5fc0b06c9a1`.
- **Current follow-up:** [PR #222 — Remove duplicate publication transaction metadata key](https://github.com/viewtube-dev/viewtube/pull/222) is intended to clear the remaining TypeScript error reported by PR #221 CI. Its checks must run before considering typecheck clean.
- **Deployment URL:** https://publisher-3n7h.onrender.com/studio
- **Deployment status:** not yet confirmed for these changes. A merged PR or successful build does not alone prove the hosted deployment has picked up the commit.
- **Required confirmation:** after PR #222 is reviewed/merged, verify the Render service's deployed commit includes the latest merge SHA, reload the Studio page, confirm the defaults panel is collapsed by default, inspect standard/compact input computed font sizes (38px/24px) and textarea computed font sizes (18px/14px), compare compact button face/shadow bounds, and check three word-toggle skins plus standard stacking / compact centering in both catalogs. Record the deployed commit and actual browser result here.
- **Verification boundary:** PR #221's CI reported the production build, focused contracts, local smoke checks, and source governance passing, but TypeScript failed on a duplicate `publishTransactionId` key and the full test suite reported 100 failing tests across 47 files. PR #222 removes that duplicate key; do not describe the full suite as passing until a fresh run confirms it. Do not describe the UI as deployed until the deployed commit and rendered page are confirmed.

### Correction — input typography versus textarea exception — 2026-10-15

A previous entry in section 20 incorrectly described 18px / 14px as shared typography for all inputs and textareas. That wording was wrong. The canonical contract is:

- **Single-line inputs** (`StudioTextInput`, search/number inputs, and `StudioLabeledInput`): global **38px standard / 24px compact**, weight 1000, uppercase, global 0.86 line-height.
- **Multiline textareas only** (`StudioTextArea` and `StudioLabeledTextArea`): **18px standard / 14px compact**, weight 1000, multiline 1.25 / 1.3 line-height, 92px minimum height, vertical resize.
- Both families retain global 44px / 28px geometry, 3px / 2px borders, and 6px / 4px radii. The textarea typography and height are functional exceptions; they do not redefine global single-line input typography.

The implementation had incorrectly assigned the textarea exception to the `textInput` tokens and added important CSS overrides to single-line inputs. The correction restores the input tokens to the global size contract and scopes 18px / 14px styles to textarea selectors only. Regression coverage explicitly checks both contracts and the Confirmed Library wording.

## 9. Floating-label consolidation plan

**Target:** remove the standalone `StudioLabeledInput` and `StudioLabeledTextArea` component APIs and expose their behavior only as variants of `StudioTextInput` and `StudioTextArea`.

1. **Contract and API**
   - [x] Add `variant="simple" | "floating-label"` to the canonical single-line input family (simple is the default).
   - [x] Add the same variant contract to the canonical textarea family.
   - [x] Keep `label` and optional `level="l0" | "l1" | "l2"` on the floating-label variant.
   - [x] Keep the input-only Compact B specimen as `floatingLabelVariant="b"`; it must not become a second field component.
   - [x] Keep the label typography/overlap CSS shared and preserve family-specific text sizes.
2. **Consumer migration**
   - [x] Move Confirmed Primitive Library examples into the Studio Text Input and Studio Text Area family sections.
   - [x] Convert the Complete Primitive Catalog entries to `StudioTextInput` / `StudioTextArea` variants.
   - [x] Remove the standalone component names from `StudioControls.tsx` and the public `src/studio-ui/index.ts` barrel.
   - [ ] Audit all remaining repository consumers and remove any stale imports or calls before merge.
3. **Regression coverage**
   - [x] Update source-governance assertions to require variants and forbid the old exports.
   - [ ] Run focused source-governance tests and production build; fix any failures before merge.
   - [ ] Inspect the rendered Studio catalog for standard/compact labels, focused/filled states, and textarea resizing.
4. **Definition of done**
   - [ ] No source imports/exports/references to the two removed component names remain.
   - [ ] Input variant retains 38px standard / 24px compact typography and 44px / 28px geometry.
   - [ ] Textarea variant retains 18px standard / 14px compact typography, 92px minimum height, multiline padding, and vertical resize.
   - [ ] Label typography remains the same across field sizes; wrapper changes do not add a second border or focus ring.
   - [ ] Tests/build pass and rendered behavior is verified before merge/deployment.
