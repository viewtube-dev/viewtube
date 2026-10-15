# Studio Controls — Global Defaults & Exception Index

**Status:** Canonical defaults parity pass in progress on `audit/confirmed-library-source-parity-2026-10-15`; source regression tests updated, execution and rendered verification pending  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Current work branch:** `audit/confirmed-library-source-parity-2026-10-15` (confirmed-catalog fidelity audit and defaults parity)  
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

## 1A. Confirmed Library fidelity pass (2026-10-15)

The Confirmed Primitive Library must describe the component that actually renders, not an idealized redraw or a stale token snapshot. Specimens import the production components; catalog CSS is limited to specimen layout and labels. Shared defaults are compared against the canonical size contract and effective CSS, while family-specific geometry and behavior are called out as exceptions.

| Concern | Effective/default contract shown in the library | Required exception note |
|---|---|---|
| Shared control geometry | Standard 44px / compact 28px; 3px / 2px border; 6px / 4px radius for ordinary buttons and fields | 44px switch/choice rectangular geometry and standard word-toggle use the supplied 7.333px radius; round and pill shapes keep their own geometry |
| Typography | Inter, weight 1000, uppercase, -0.02em tracking, 0.86 baseline line-height | Single-line inputs are 38px / 24px; textareas are 18px / 14px with multiline line-height and padding |
| Button shadow / motion | Standard 3px × 3px; compact 1.5px × 1.5px; 150ms general/hover and 300ms click timing | The prominent action is its own fixed 56px family, not a third StudioButton size |
| Icon size | Icon buttons default to large: 38px / 1.9 stroke standard and 24px / 2.0 stroke compact | Current (28px / 18px) and moderate (34px / 22px) are opt-in icon-size API variants, not the default gallery specimen |
| Focus | Fields show a separate zero-offset secondary-color accent and CSS outline; the prior live audit measured a 3px / 2px accent shadow and 1px computed outline | Buttons currently use their own visible 3px outline with 3px offset; do not describe button focus as the field focus treatment |
| Dropdown | Legend Multi is a production multi-select with standard/compact trigger geometry | Menu rows/options are not button-press surfaces; the panel may use its own stationary shadow |

The source regression test `npm run test:confirmed-library-layout` now guards the compact shadow, shared letter-spacing tokens, icon defaults, and documented geometry exceptions. **This is source-level governance, not visual certification.** Typecheck, CSS parsing, CI results, and browser verification of rendered computed styles remain required before the library can be called fully certified.

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
| Default button icon size | 38px | 24px |
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

**Current effective behavior (not yet fully aligned with the target above):** StudioButton hover moves the inner face by half the offset, but active moves the outer shell and hides the pseudo-shadow. StudioActionButton moves the outer action on hover/active and suppresses its shadow on active. The Confirmed Library now describes the action-button behavior as implemented; stable-shadow click behavior remains an explicit source-level gap.

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
| E-07 | Button typography | Button and split-left labels share the same type contract | The canonical face layer centralizes typography at 38px standard / 24px compact, weight 1000, uppercase and -0.02em tracking; shared tracking tokens now match effective CSS | **Implemented; verify visually** |
| E-08 | Button radius | Standard 6px, compact 4px | Final action face uses 6px standard / 4px compact; 44px switch and choice shapes use the supplied reference-specific 7.333px rectangular radius | **Implemented; verify effective computed styles** |
| E-09 | Button shadow and transitions | Fixed shadow anchor; face moves half shadow on hover and full shadow on click | Current CSS keeps the pseudo-shadow stationary during hover, but active moves the outer StudioButton shell and hides that shadow; StudioActionButton also moves its outer shell on hover/active. Timing tokens and CSS now agree at 150ms / 300ms | **Implemented; awaiting automated and rendered verification** |
| E-10 | Switches, radio buttons, checkboxes | Reference-specific 44px geometry and skin variants; selected state changes indicator/fill | Final contract restores 75.68×44 switch tracks, 36.667px handles, 3.667px symmetric insets, 31.68px travel, 44×44 choices, 33×33 radio dots, and explicit black/white/color-swap checkbox marks | **Implemented; awaiting visual verification** |
| E-11 | Word toggles | 44px default or 28px compact; active handle measures selected word; skin/words/gap/inset may be customized | Dynamic measured handle and inline style are intentional geometry exceptions; CSS/state transitions must be checked for border/radius/motion consistency | **Intentional dynamic-width exception; audit remaining size behavior** |
| E-12 | Floating-label input/textarea variants | The input family adds a floating-label presentation to the canonical input; the textarea family adds it to the canonical writing surface. Neither creates a second native-control family. | `variant="floating-label"` adds only wrapper/label presentation; native field semantics, typography, selected size geometry, focus, and textarea multiline behavior remain owned by the corresponding family. | **Implemented in this refactor; build, source tests, and browser verification pending** |
| E-13 | Small/small-size compatibility | CSS defines a `data-size="small"` height of 32px although canonical contract exports only standard/compact | Legacy third size can bypass the two-size rule | **Defect unless a documented migration-only exception is approved** |
| E-14 | Action-size compatibility | CSS defines `data-size="action"` height 56px and button typography overrides | The canonical exported size map exposes only standard and compact; the separate 56px StudioActionButton is a distinct family, not a StudioButton size | **Defect/compatibility debt: inventory consumers and either migrate or formally document separate non-button layout semantics** |
| E-15 | Focus and reduced motion | Focus needs visible, stable outline; reduced-motion must remain understandable | Focus uses 3px outline / 3px offset on buttons, not size-derived; reduced-motion sets transition duration to .01ms globally, suppressing most motion feedback | **Needs accessibility review and state feedback alternative** |
| E-16 | Catalog defaults panel | Gallery should expose the real defaults and list every non-default setting | Catalog renders exported global and size constants, but those constants do not reflect every CSS override; per-family non-default lists exist but do not enumerate CSS drift | **Defect: add effective-vs-declared drift and exception status to catalog** |

## 6. Component family inventory — represented vs not yet represented

The table distinguishes what is visibly represented in the Confirmed Primitive Library from related exports that are not currently demonstrated there. A nearby component is not evidence that an unshown export has been certified.

| Family / export | Primary component/source | Confirmed gallery representation | Required checks / boundary |
|---|---|---|---|
| Text Input | `StudioTextInput` — `StudioControls.tsx` / `StudioTextInput.tsx` | **Shown:** standard, compact, floating-label, fixed-label, and disabled compact specimen | Verify typography, field chrome, focus, caret, and label overlap; search/number input exports are not individually shown here |
| Text Area | `StudioTextArea` — `StudioControls.tsx` / `StudioTextArea.tsx` | **Shown:** standard/compact, floating-label, and fixed-label variants | Preserve 18px/14px typography, 92px minimum surface, multiline padding, and vertical resize |
| Floating-label input/textarea | `StudioTextInput` / `StudioTextArea` variants | **Shown as variants**, not separate native-control families | Wrapper adds label presentation only; field geometry and native semantics stay with the owning component |
| Button | `StudioButton` | **Shown:** standard/compact, default, neutral, selected, selected+disabled | Text 38px/24px; 3px/2px stroke; 6px/4px radius; actual active-shadow behavior remains documented as a gap against the stable-shadow target |
| Prominent Action | `StudioActionButton` | **Shown:** separate fixed 56px action family | 3px border, 6px radius, 20px text; current outer-control translation and active shadow suppression are described in the gallery |
| Generic Icon Button | `StudioIconButton` | **Not separately shown**; the square icon specimen is a distinct component | Do not infer this export is gallery-certified from the Square Icon Button family |
| Square Icon Button | `StudioSquareIconButton` | **Shown:** V1–V4 standard/compact and all seven effects | Default large icon preset: 38px/1.9 standard, 24px/2.0 compact; badge/success specimens are static previews, not live outcomes |
| Split-left Button | `StudioSplitLeftButton` | **Shown:** standard/compact, default, neutral, selected, selected+disabled | Divider uses 3px/2px stroke; default large icon preset is 38px/24px; active-shadow gap remains documented |
| Switch | `StudioSwitch` / `Studioswitch` | **Shown:** 44px only, round/rectangular, four skins | Standard-only API; track/handle geometry and state-specific indicator colors are exceptions to ordinary button geometry |
| Radio / Checkbox / Wide-X Checkbox | `StudioRadio`, `StudioCheckbox`, `StudioXCheckbox` | **Shown:** 44px only, shape/mark and skin variants | Selected state reveals skin-specific marks; browser checks should inspect on/off, disabled, and focus states |
| Word Toggle | `StudioWordToggle` / `Studiotoggle` | **Shown:** standard/compact and three skins | Standard radius 7.333px is reference-specific; handle width measures the active word and can be customized |
| Legend Multi Dropdown | `StudioLegendMultiDropdown` | **Shown:** closed standard trigger with selected values and two closed compact triggers | The menu is closed initially; menu options appear only after user interaction and are not currently an open-menu screenshot specimen |
| Native Select | `StudioSelect` | **Not separately shown** | Do not treat the Legend Multi multi-select as a substitute or certification for the native select export |
| Dropdown option surface | Legend Multi / dropdown CSS | **Not separately shown as an open panel** | Option typography, focus, keyboard operation, stacking, and panel geometry need rendered verification |
| Layout-only containers | `data-vt-studio-layout` rules | **Not a control primitive** | Do not report container sizing as a control component or family exception |

## 7. Current source-level parity findings (2026-10-15)

These are deterministic source findings; they are not claims from a rendered browser inspection.

1. **Shared size defaults reconciled in this pass:** compact button shadow is now 1.5px × 1.5px in tokens and effective CSS; shared tracking is -0.02em; CSS timing matches the 150ms hover/general and 300ms click tokens. Regression assertions were added, but have not yet been executed in this session.
2. **Button active-state shadow behavior remains a gap:** StudioButton moves its outer shell and hides the pseudo-shadow on active; StudioActionButton moves the outer action on hover/active and suppresses the shadow on active. The gallery now states the action-button behavior as it is implemented. Do not certify the stable-shadow click target until the CSS and component tests are reconciled.
3. **Button focus is a family-specific exception:** button focus currently uses a 3px outline with 3px offset for both sizes. Field focus uses a different secondary-color accent/outline stack; the catalog distinguishes these.
4. **No implicit third size found in current control CSS:** data-size="small" and data-size="action" selectors were not found in the audited stylesheet. StudioActionButton remains a separate fixed 56px family, not a third StudioButton size.
5. **The catalog uses production components and now calls out key exceptions:** icon metrics, switch/choice and word-toggle corner geometry, text-area typography, dropdown closed state, and action-button press behavior are described explicitly. The defaults panel still prints exported contract values rather than browser-computed styles; browser inspection is still required.
6. **Icon-size testing specimens are removed from the Confirmed Primitive Library:** production square/split-left specimens use the default large 38px/24px icon preset. Optional current/moderate API presets remain available to callers but are not displayed as size-comparison tests in the confirmed gallery.
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

- [ ] Standard defaults: 44px height, 38px type, 3px border, 6px radius, default large icon 38px / 1.9 stroke, 3px shadow, 1.5px hover movement, 3px click movement.
- [ ] Compact defaults: 28px height, 24px type, 2px border, 4px radius, default large icon 24px / 2.0 stroke, 1.5px shadow, 0.75px hover movement, 1.5px click movement.
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

This section preserves the original source patterns as historical audit evidence and records whether each is still present. A historical selector is not a current defect unless the current-status column says it remains unresolved.

| Historical finding | Historical source pattern | Current status (source-level) | Follow-up |
|---|---|---|---|
| Compact split divider used standard stroke | Old split-rail rules hard-coded `border-right-width: 3px` | **Resolved in current CSS:** the rail uses `var(--vt-studio-control-stroke)`, which resolves to 3px standard / 2px compact | Verify default/selected/focus states in browser |
| Typography diverged from size tokens | Older generic/compact/height-variant rules used competing font sizes | **Resolved in current CSS:** ordinary button faces use the 38px / 24px size contract; stale 32px/10px/36px/22px values were not found in the audited stylesheet | Keep source regression checks |
| Field radius/stroke overrode size contract | Older field selector used 8px radius and 3px border at both sizes | **Resolved in current CSS:** those override patterns were not found; fields use size-specific 6px/4px radius and 3px/2px stroke tokens | Verify computed styles after consumer CSS |
| Compact shadow contract mismatch | Token used 1px while the final CSS used 1.5px | **Resolved in this pass:** tokens and effective CSS now both use 1.5px × 1.5px | Run focused test and browser inspection |
| Transition duration mismatch | Older CSS used 180ms general / 80ms press while tokens used 150ms / 300ms | **Resolved in this pass:** CSS timing variables/fallbacks now use 150ms / 300ms | Run focused test and verify motion in browser |
| Active-state shadow moves/disappears | Active rules translate the outer button and hide its pseudo-shadow | **Still open:** this differs from the stable-shadow target contract; current gallery text describes the behavior rather than claiming it is fixed | Reconcile CSS behavior and component tests before certifying tactile interaction |
| Button focus geometry is shared across sizes | Button focus uses a 3px outline with 3px offset for both sizes | **Known exception / review needed** | Approve/document the common focus ring or define size-derived values without weakening visibility |
| Implicit third control sizes | Historical `data-size="small"` and `data-size="action"` selectors | **Resolved in current stylesheet:** those selectors were not found; StudioActionButton is a separate fixed 56px component family | Keep the 56px family documented separately |
| Dropdown options use menu-surface behavior | `.vt-studio-dropdown-option`, `.vt-studio-dropdown-menu` | **Intentional exception**; not a button-press surface | Verify keyboard focus, selection, stacking, and contrast in browser |
| Switch and choice APIs are standard-only | Switch/choice set standard size and expose no compact size prop | **Current supported API:** catalog labels these as 44px-only; no compact behavior is implied | Add compact variants only if requested and implemented with tests |

## 12. Confirmed Primitive Library exception-to-family map

Use the current represented-vs-not-represented inventory in Section 6 as the canonical gallery coverage table. This historical section is retained only as a short pointer so old component names or obsolete sizes are not mistaken for the current library contract.

- The catalog renders production components rather than handcrafted component lookalikes.
- Search/number inputs, generic StudioIconButton, native StudioSelect, and open dropdown options are exported/source-level surfaces that are **not individually represented** in the Confirmed Primitive Library gallery at this revision.
- Floating labels are variants of StudioTextInput / StudioTextArea, not separate native-control components.
- The Square Icon Button's notification and success examples are static visual previews, not live outcomes.

## 13. Evidence status and audit scope

**Verified from current source:** production primitive imports and specimen labels; standard/compact size tokens; compact shadow token/CSS alignment at 1.5px; -0.02em tracking alignment; 150ms / 300ms motion timing alignment; large default icon metrics; component-specific radius and textarea exceptions; dropdown closed initial state; static badge/success preview labeling.

**Added but not executed in this session:** source regression assertions in `scripts/audit/confirmed-library-layout.test.mjs`, exposed as `npm run test:confirmed-library-layout`. GitHub Actions, test command, typecheck, CSS parser, and production build results must be checked on the pull request.

**Not yet verified:** final computed style after every consumer stylesheet; live desktop/mobile rendering; browser-based hover/active/focus behavior; keyboard/accessibility behavior; and the remaining stable-shadow click interaction gap. No source edit alone is proof of browser certification.

