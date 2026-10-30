# Studio Hub Component Library source of truth

**Status:** Canonical scoped Component Library / primitive-correction authority  
**Last audited main:** `988098840050f4b658a266e1a7d6fe1c4d939c81`  
**Scope:** Studio Hub Component Library catalog wiring, catalog presentation, demonstrated primitive families, and named primitive-correction contracts.  
**Studio Controls authoring guide:** [`STUDIO_CONTROLS_AUTHORING_GUIDE.md`](./STUDIO_CONTROLS_AUTHORING_GUIDE.md).  
**Related authority:** `../architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md` owns the production Toolbox/Subtoolbox system globally. Production tokens/code/tests win over catalog-only CSS.

## Catalog ownership and track lifecycle — 2026-10-29

The **Confirmed Primitive Library** in `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` is the active audited catalog for production-imported primitive representatives, provenance, family settings, and supported variants. `src/components/ToolboxUIReferenceLibrary.tsx` remains the shell and route/track selector; it must not become a second registry of primitive definitions.

The `hardcoded` and `primitive` tracks, `StudioHubCompletePrimitiveCatalog`, `StudioHubPrimitiveMigrationCatalog`, and specialized subset catalogs are retained for comparison or migration where they are still routed. They are not evidence that a control is part of the public API, and they must not silently override the Confirmed catalog's ownership. Do not delete or hide these tracks until their live routes, users, and migration dependencies have been traced and covered by tests.

Every Confirmed representative must state its source module, production stylesheet/token authority, importing files where known, public API status, supported size/state variants, and only the non-default settings that actually differ from canonical defaults. A real production import is not by itself proof of public-barrel export; classify the symbol as public, internal-only, deprecated, or intentionally unexported. Nested anatomy/state specimens are valid, but must be distinguished from the one canonical representative for a primitive so the library does not imply duplicate independent implementations.

The specimen-grid tier list must stay in parity with the global five-tier vocabulary (Supreme, Standard, Compact, Mini, Micro). A tier appearing in the grid does not assert that every primitive supports it; each family must still be constrained to the sizes its production API and rendered behavior support.

## Confirmed Primitive Library category taxonomy — 2026-10-30

The Confirmed Primitive Library renders one canonical parent group for each of these six categories, in this order:

1. **Text Fields** — native text inputs, text areas, text boxes, number inputs, identity/search/split fields, and compatibility field exports.
2. **Buttons & Badges** — action buttons, split buttons, icon buttons, Play/Pause, badges, and status/navigation badge families.
3. **Dropdowns** — single-select, split-left, multi-select dropdowns, dropdown triggers, option/menu rows, chevrons, and menu states. Dropdown menus are part of the Dropdowns family, not Compositions.
4. **Controls** — all counters, word counters, sliders, word sliders, arrow/side/double-side/bar toggles, switches, radios, and checkboxes, including compatibility control exports.
5. **Modules & Frames** — structural modules, InterModules, collapsing modules, accordions, and upload frames.
6. **Compositions** — assembled experiences such as Tag Editor, Publishing Card, Primitive Grid, Spectrum Tags, chat/composer layouts, and composition-only layout helpers.

The parent category is rendered once by `ConfirmedCatalogFamilyGroups`. Individual family specimens remain nested inside that parent; multiple specimen modules within a category are intentional and do not create duplicate category parents. Additional primitive specimens must be supplied to the same grouping pass rather than wrapped in a second independent category grid.

Classification must be explicit for newly added families. Counters and sliders must never be classified as a separate category. A dropdown menu or option-list specimen must remain under Dropdowns even when it is rendered as a standalone menu state. A composition is an assembled user-facing experience, not a fallback category for an unrecognized primitive. Unknown items remain ungrouped and surface an actionable Unclassified family warning until an explicit rule is added; they must never silently fall into Compositions.

This taxonomy changes catalog organization only. It does not authorize changes to production primitive APIs, tokens, styling, or runtime behavior.

## Studio Controls size-tier authority — 2026-10-20

The canonical production size ladder is **Supreme 60px / Standard 44px / Compact 28px / Mini 20px / Micro 12px**. TypeScript tokens are authoritative, generated CSS is emitted from those tokens, and `studio-control-system.css` owns shared tier selectors. Supreme type/icons are rounded to 52px. Mini uses 17.5px type/icons; Micro keeps 12px height and 10px type/icons with its explicit 1px stroke, 2px radius, 0.65px outline, and global `-0.02em` letter-spacing. The canonical token source is `src/studio-ui/tokens.ts`; `scripts/emit-studio-control-vars.mjs` emits `src/styles/studio-control-vars.generated.css`; production geometry is applied by `src/styles/studio-control-system.css` and the family-specific styles. Supreme dimensional tokens scale Standard by 60/44 while preserving typography ratios, color roles, and flat-shell behavior. Mini has explicit 20px height / 1.5px stroke / 3px radius and is not interpolated from neighboring tiers. Micro has explicit 12px height / 1px stroke / 2px radius and is not derived from half Compact. Mini and Micro remain family-aware and must not be added to a component whose inner geometry cannot fit. The Confirmed Primitive Library may show a tier only after the production API and rendered behavior support it.

`ToolboxUIReferenceLibrary.tsx` is the Studio Hub entry point and shell. It must not maintain an independent subset of component examples.

`StudioHubConfirmedPrimitiveCatalog.tsx` owns the active confirmed-family registry and rendered production representatives. The older Complete catalog is retained as a comparison/migration surface only while its routing and dependencies remain live; new canonical representatives belong in the Confirmed catalog.

`studio-hub-complete-primitive-catalog.css` owns catalog-only presentation. Production primitive geometry should continue moving toward shared primitive/token ownership rather than feature-local overrides.

Main Toolbox and SubToolbox are separate structural levels. Main Toolbox authority is 80px header / 5px stroke / 16px radius / 10px shadow / 26px title. Standard SubToolbox authority remains 56px / 4px / 12px / 6px / 20px. Do not globally map the main toolbox header to 56px.

Mobile shell density is intentionally tighter and **fixed by token contract**: main Toolbox 56px header / 14px radius / 6px shadow offset, SubToolbox 44px header / 10px radius / 4px shadow offset. Mobile preserves the 26px and 20px title sizes and permits up to two tight wrapped lines. The fixed mobile heights do not redefine the desktop 80px / 56px shell authority.


## Primitive Correction Authority — 2026-09-23

The following rules supersede older local family styling and are production primitive authority.

### Floating overlays
- `Tooltip`, `Tooltip Color`, and `Hover Card` use a body-level portal/floating overlay layer rather than remaining inside a Toolbox/SubToolbox stacking context.
- Floating primitive z-index authority is `--vt-floating-overlay-z`.
- Tooltip #37 remains the visual/anatomical reference for tooltip geometry.
- Tooltip variants may change fill/text treatment, but not border width, radius, connected-spout construction, or L0/L1/L2 geometry.
- The tooltip spout uses the same stroke width as its parent bubble.
- Tooltip and Hover Card automatically flip above/below their trigger at viewport edges.

### LED status family
- Labeled LED controls shrink-wrap to LED + label rather than occupying arbitrary width.
- LED label typography is intentionally strong at every component level.
- Active LEDs emit one circular ripple every eight seconds. The ripple starts at the exact core size, expands to 500% over the first three seconds, and fades fully transparent during that expansion.
- Ripple authority: 2px pair-color perimeter plus a 10px inward-blurred 30%-opacity pair-color glow.
- `LED Dot` is the bare status-light family. Its core is exactly the component-level height; ripple paint must not affect layout dimensions.

### Controller switch
- Controller Switch is one rounded track with no detached right-side label compartment.
- OFF/ON track fills are transparent versions of opposite pair colors.
- The circular thumb is fully opaque in the opposite pair color and owns the centered white OFF/ON label.
- Track fill, thumb color, and thumb position animate together.

### Scrollbars
- Horizontal and vertical scrollbar families share the same icon language and component-level end-cell geometry.
- Track interior is black.
- Thumb is pair-colored with a black border equal to component stroke; that border visually forms the maintained black gap around the thumb.
- End icons may grow inside their square cells but the cells themselves must not grow.

### Calendar
- Calendar has one canonical production size: L0.
- The Primitive Library renders only the L0 Calendar example.
- Month typography is intentionally oversized.
- Weekday/date typography is enlarged without increasing calendar-cell geometry.
- The weekday strip uses a 50%-strength opposite-pair fill.
- Selected-date typography enlarges inside the existing cell rather than resizing the cell.

### Loader family
- Inline loaders do not use a generic outer rectangle.
- Spinner diameter and label visual height are coordinated.
- Spinner base uses the opposite pair color; the active arc is longer and ends with a gradient tail rather than a hard stop.
- Canonical loading representations include Spinner, Progress, Split Gradient, Orbit, and Bars.
- The Split Gradient loader is the module-shaped option and uses pair-color split-left anatomy with a horizontally moving title gradient.

### Tree View
- Tree View prioritizes hierarchy readability while reducing row height.
- Root rows begin at 50% opposite-pair fill; each deeper depth reduces visual fill strength by 15 percentage points.
- Deeper rows use two square icon rails (pair A then pair B), followed by a left-aligned pair-A text region.
- Icons should communicate node contents rather than act as generic decoration.
- Type size and weight reduce gradually with depth while remaining larger than the superseded Tree View typography.

### Certification
- Floating overlays require viewport captures when open because their panels are portaled outside the component locator.
- Tooltip Color, Hover Card, Controller Switch, LED Light, LED Dot, both Scrollbars, Calendar, all Loader variants, and Tree View are priority visual-certification families.


## Component Library Presentation Contract — 2026-09-24

These rules apply to the Component Library presentation layer and do **not** change production-control anatomy.

### Catalog shells and width
- Numbered Component Library SubToolboxes do not draw a second heavy outer rectangle around the family.
- L0/L1/L2 demo shells are borderless labels, not nested cards.
- **The catalog owns placement; the primitive owns geometry.** Catalog CSS must not override a production primitive root with `width: fit-content !important`, `width: 100% !important`, or family-specific pixel widths.
- Component preview widths are expressed as multiples of the canonical L0/L1/L2 component height, so each level preserves the same anatomy at a different scale.
- Preview families declare one sizing mode: `intrinsic`, `fixed`, `compound`, `field`, or `canvas`.
- `intrinsic` families shrink-wrap their own content. `fixed` families derive both axes from component height. `compound` families own fixed square rails plus a proportional body minimum. `field` and `canvas` families fill an explicit preview slot rather than the entire SubToolbox.
- Desktop and mobile landscape show L0/L1/L2 on one comparison row whenever the declared geometry fits without clipping.
- Mobile portrait keeps intrinsic/fixed families in the compact two-column comparison, but compound/field/canvas families stack one level per row when their real minimum width cannot fit a half-column.
- Responsive layout must move or stack a component before violating its square rails, text body, center alignment, or canonical level ratios.

### Level parity
- L0/L1/L2 are one component anatomy, not three separately tuned designs.
- Height, stroke, radius, shadow, font, icon size, rail width, padding, and compound body minimums derive from shared component-level variables.
- Split-left rails are literal 1:1 squares and never shrink to make room for the label.
- Canonical library sample labels must render without ellipsis or clipping at their declared preview size.
- Geometry certification compares normalized ratios such as rail-width / component-height and total-width / component-height rather than only raw pixels.

### Visual Key tooltip
- `SubToolboxLegendTooltip` is the dense visual-key / legend tooltip primitive.
- It reuses the canonical floating-overlay positioning, viewport flipping, spout geometry, and z-index authority.
- Its body adds a colored title band, repeated key rows, optional swatch/icon markers, primary labels, secondary explanations, and an optional note band.
- It is intended for chart legends, status keys, workflow-state explanations, and dense visual metadata—not ordinary one-line help copy.

### Skeleton variants
- `SubToolboxSkeleton` supports `lines`, `compact`, and `media` variants.
- `compact` represents short horizontal controls/list rows with icon, text, and trailing-action geometry.
- `media` represents ratio-aware media/card loading states and supports 16:9, 1:1, and 4:5.
- All variants inherit the owning pair colors and share the canonical shimmer motion/reduced-motion behavior.


## Video Manager Structural Contract — 2026-09-25

### Equal shell rhythm
- Main Toolbox and SubToolbox content use one equal interior gutter on all four sides and between first-level children.
- Desktop/narrow authority: 6px. Mobile authority: 5px.
- SubToolbox inset wrappers do not add a second horizontal inset; the content gutter is the single spacing authority.
- Toolbox content therefore gains a small amount of top/bottom clearance while SubToolbox interiors lose the former doubled side clearance.

### Mini SubToolbox
- Mini SubToolbox is the next structural level below SubToolbox, not a styled card pretending to be a shell.
- Desktop authority: 40px header / 3px stroke / 8px radius / 4px shadow / 16px title.
- Mobile authority: 36px header / 3px stroke / 7px radius / 3px shadow / 14px title.
- Anatomy is square icon rail → title region → optional header actions → content.
- It is appropriate for tightly scoped embedded workflows such as the Video Manager thumbnail editor.

### Rich Video Selector
- Video Selector is a direct L0 compound and must not require a surrounding SubToolbox.
- Trigger anatomy follows SubToolbox split-left proportions.
- The square left rail contains the thumbnail at the top with equal visible fill margin and compact publish-date/runtime badges below it.
- Title uses up to two full lines, dynamically reduces type for long titles, uses clipping rather than ellipsis, and never deliberately renders an ellipsis.
- The opened panel is portaled above shell overflow/stacking contexts and carries the owning pair-A/pair-B values into the portal.
- Search is the first row of the opened panel and uses the canonical split-left Search field.

### Studio Upload Frame
- `StudioUploadFrame` is the default reusable upload surface in the Confirmed Primitive Library.
- It maintains a 16:9 canvas at every viewport size, with container-relative breathing layers, quarter-stroke borders, and scalable inset spacing.
- The active Toolbox pair (`--pair-a` and `--pair-b`) drives the conic perimeter, inner strokes, split rails, circle rings, and filename badge.
- The left split rail carries the upload icon; the right split rail carries the thumbnail/image icon. The default prompt uses two lines at roughly half the prior text scale.
- Hover doubles the breathing/rotation speed and increases saturation. Clicking triggers a one-second high-energy pulse before the native file picker opens. Drag/drop remains immediate.
- After an image is selected, the circular preview grows to three times its previous nominal diameter (48cqw), its primary/secondary rings slightly clip against the top and bottom edges, and a filename badge overlays the bottom edge.
- Reduced-motion preferences disable the visual animation. The component retains native file selection, keyboard activation, drag/drop, and filename announcement.
- Production ownership remains in `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`; the catalog renders that same component.

### Floating-label fields
- Labeled Input and Labeled Textarea are compound Studio controls built directly on `StudioTextInput` and `StudioTextArea`.
- The label begins inside the empty field and rises to the top edge on focus or when a value is present.
- Raised floating labels share one fixed 18px typography rule. Resting labels match the underlying field primitive and size: input 38px / 24px; textarea 18px / 14px.
- The underlying Studio primitive owns field geometry, border, inset stroke, focus treatment, and text typography.
- Floating-label wrappers own only label positioning, shared label typography, and label transitions.
- The Confirmed Primitive Library renders these production components rather than parallel SubToolbox implementations.

### Video Manager production order
1. Direct L0 Video Selector.
2. Video Details SubToolbox.
3. Labeled Title field.
4. Thumbnail Mini SubToolbox with Upload and Generate header actions.
5. Labeled Description field.
6. Publishing controls.
7. Video Tags SubToolbox using the canonical two-color Tag Editor.
8. Direct SubToolbox-level split-left Update Video Details action.

Video Stats KPI cards are intentionally removed from the editing flow. Thumbnail Generate hands the selected video context to Thumbnail Studio. Mobile portrait may stack Publishing controls and long tag actions to prevent clipped values; landscape/desktop retain denser horizontal composition.


## 2026-09-25 required certification additions

The Render/iPhone audit adds these mandatory primitive/compound demonstrations before the Component Library can be considered visually current:

- restored four-arrow Toolbox/SubToolbox collapse control, with no generic chevron replacement;
- interactive custom dropdown proof where selecting a different option visibly changes the trigger value;
- SubToolbox-level split-left full-row action at supported levels;
- reusable Thumbnail MiniSubToolbox with paint-safe Upload/Generate header actions;
- Spectrum Tag L3;
- Spectrum Tag L3 + Tag Editor #30 removable/addable compound;
- Vault Asset editable title;
- Vault Asset large selection checkbox;
- Vault Asset notes input/textarea and tag editor;
- Vault Asset landscape, portrait and intermediate-ratio contained thumbnail/media states;
- palette-sequence specimen proving Toolbox -> first SubToolbox -> sibling/nested SubToolbox ordering through the 12-color palette.

Static source presence is insufficient for dropdown and editable-asset states; these examples must be interactable in the production-import track.

## Vault Asset Module donor-parity authority — 2026-09-25

The compact Vault asset family now has a dedicated production primitive: `VaultAssetModule`.

- The source geometry and interaction donor is recorded in `VAULT_ASSET_MODULE_REFERENCE_PARITY.md`.
- `VAULT_ASSET_MODULE_DNA` is the geometry authority. The module is a fixed compound and does not scale its outer anatomy through L0/L1/L2.
- Production variants are Landscape, Landscape Swapped, Portrait Single, Portrait Double, Audio, and Document.
- Creator Vault consumes the same component rendered in the Studio Hub primitive track.
- The primitive track must use real editable title, shared spectrum tag editor, dirty-save notes, selection state, media preview, waveform and document-preview behavior.
- The hardcoded catalog stays frozen as a comparison baseline; donor-only variants may therefore exist only in the primitive track.
- Each Vault Asset Module represents one single image, video clip, audio file, or document. It is not a project/package/engine container, and higher-level Vault workflow controls must stay outside the compact module unless separately approved.
- ViewTube palette/font/focus tokens may flow into the module, but generic Toolbox CSS must not change the donor's fixed dimensions or layout.



## Metadata / Publishing Primitives — 2026-10-06

The Metadata Publisher and Video Manager use the following canonical primitives so library changes propagate to both tools:

- StudioLabeledInput — single-line field with a shared floating label that rises on focus or when populated.
- StudioLabeledTextArea — multiline field with identical label typography and the same floating-label interaction.
- SubToolboxTopTitleDropdown — compact top-title dropdown for publishing controls, including multi-select playlist menus.
- SubToolboxToggle — binary secondary metadata control.
- SubToolboxStatusBadge — compact validation/state indicator.
- SubToolboxStack, SubToolboxGrid, and SubToolboxSection — canonical compact composition primitives.

### Publishing control contract

Video Manager's publishing controls are presented as one responsive row of three dropdowns:

1. Privacy — Public, Unlisted, Private.
2. Category — the YouTube category catalog, including Education (27).
3. Playlists — populated from the authenticated user's channel playlists and persisted through the existing YouTube playlist API.

### Education metadata contract

When Category is Education, the Education Questions & Phrases component is exposed. Each non-empty line must begin with M:SS or MM:SS followed by text. Invalid lines prevent the video update from being submitted. Valid education notes are included in the video's description when saved.

These are library contracts, not local CSS skins. Toolbox/SubToolbox-only primitives remain owned by `src/components/subtoolbox/SubToolboxPrimitives.tsx` and `src/styles/subtoolbox-system.css`. Studio Hub controls are owned by `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`. Production components and catalog examples must use the correct canonical family and must not duplicate visual implementations.


## Projects UI Manifestation

`ProjectManifestation` is the shared visual authority for exposing Project + ContentBuild + Publishing Package state inside tools.

- Source: `src/components/projects/ProjectManifestation.tsx`
- Data adapter: `src/components/projects/projectManifestation.ts`
- Canonical persistence: `ContentBuildRepository` / `VideoPackageRepository`
- Canonical swap API: `setContentBuildSelection`
- Visual primitives: existing Toolbox/SubToolbox, media poster, select, buttons, tags, status badges, and output cards.

It represents the **project/package container**, not an individual Vault asset. Individual asset rendering remains owned by `VaultAssetModule`.

The manifestation must remain portable across Studio Hub tools. A tool may load the manifestation, edit its owned fields, swap canonical asset selections, and save the resulting state without creating a parallel project/package store.

Current integrations:
- `VideoManager`
- `VideoPublisher`

Reference architecture:
`docs/product/studio-hub/VIEWTUBE_PROJECTS_UI_MANIFESTATION_SYSTEM.md`


## Confirmed Primitive Toolbox — 2026-10-13

`ToolboxUIReferenceLibrary.tsx` now includes a third, separate **Component Library — Confirmed Primitives** toolbox. This is the certification surface for production components that have been explicitly confirmed; it is not a replacement for the frozen baseline or the broader migration catalog.

Initial certified families:
- `StudioButton` — production export from `src/studio-ui/primitives/StudioControls.tsx`.
- `StudioSplitLeftButton` — production export from the same TSX source, composed from `StudioButton`.
- Both use `src/styles/studio-control-system.css` for production styling.
- Both expose `heightVariant="44"` and `heightVariant="28"` variants. The split-left default now uses the same 44px standard size as StudioButton, and both share 14px, 900-weight, uppercase typography.
- The selected state remains the production `selected` prop and its shared bold selection outline; the catalog does not redraw that state.
- Each family card lists its source TSX/CSS paths, core token geometry, variants, and known import sites in small provenance text.

**Certification rule:** previews must render the actual exported component. Catalog CSS may arrange the examples but must not create a second button implementation. Add additional families here only after their source ownership, default styles, variants, and import sites have been verified.

## Simple Text Input — canonical primitive 20

The Text Input family in the Complete Component + Primitive Catalog now renders SubToolboxInput20 with the opt-in is-simple-text variant. The plain text input remains separate from primitive 137/138 labeled fields, textareas, number fields, and compound search/action inputs.

- Geometry follows shared component-level DNA: L0 56px / 4px / 12px / 24px; L1 standard 44px / 3px / 8px / 32px; L2 32px / 2px / 6px / 12px (height / stroke / radius / font size).
- Idle state: transparent pair-A fill, pair-A text and 1px inline text stroke, 1000 weight, uppercase typography.
- Focus state: pair-B outline at component stroke width, pair-A fill lightened with white, black text, and block-shaped caret where supported.
- caret-shape: block is progressive enhancement; unsupported browsers keep their native caret shape while retaining the pair-color caret.
- Production styles live in src/styles/subtoolbox-system.css; catalog CSS maps only the catalog's L0/L1/L2 size presentation. The sample uses placeholder text to make empty and focus states easy to review.

## Follow-up catalog correction — 2026-10-13

- The catalog now exposes separate **Text Input**, **20 Simple Text Input**, **Textarea**, and **21 Simple Textarea** entries alongside the plain-input and floating-label primitives. The simple input entries use canonical primitive 20 and its shared state styling; the simple textarea entry uses primitive 21.
- Text-input specimen defaults are updated to 38px and 24px type sizes, with `letter-spacing: -0.02em` and uppercase text.
- The 44px split-left icon rail now explicitly sizes the SVG glyph to 72–76% of the rail, allows overflow, and preserves the icon viewBox rather than letting a smaller inherited glyph size constrain its visual weight.
- The Dropdown family is placed on a dedicated catalog row with side-by-side specimens on wider screens and a single-column layout on narrow screens. Dropdown trigger and option text uses the same heavy uppercase typography and `-0.02em` spacing.
- These are catalog/source changes on `feat/canonical-simple-text-input-library`; browser-rendered sizing, build, and automated checks still require verification before merge.

- Added an explicit **28px Dropdown Pair** family entry: two real, keyboard-operable dropdown triggers in their own dedicated row, side by side. Both use uppercase 24px text, heavy weight, and `-0.02em` letter spacing.

## 44px control family and dropdown alignment follow-up — 2026-10-13

- Added canonical `SubToolbox44Switch`, `SubToolbox44Choice`, and `SubToolbox44WordToggle` components to the shared primitive code and control styles. The 44px switch retains the reference proportions (75.68 × 44px track, 36.667px handle, 3.667px inset, 31.68px travel); square radio/checkbox controls remain 44 × 44px.
- The catalog now presents round and rectangular switches in a single family, and circular radio + checkmark checkbox + wide-X checkbox in a second family. It excludes rectangular radios, compact-X checkboxes, and concentric radio animations. Variants shown are 1 (solid), 3 (color swap), 4 (black indicator), and 5 (white indicator).
- Word toggles are grouped together with 44px and 28px variants, using the default heavy uppercase font and proportional text/padding/radius values. Their active handle continues to measure the selected label so its position and width track the text.
- Dropdown labels now use centered flex alignment and zero vertical padding/margins to prevent the label sitting above the trigger. Text uses closer tracking, and chevrons are scaled proportionally: 18px at 28px control height and 28px at 44px.
- The size-default styling has been compacted to a two-column, 9px microtype layout where that settings group is rendered. No browser screenshot, build, or automated test has been run; final visual balance and integration still require verification.

## Canonical Studio Controls — Defaults and Primitive Coverage · 2026-10-13

**Integration authority:** `master/consolidated-feature-integration`. PR #78 is the controlling implementation for text-field ownership and selection-control anatomy. This section documents that merged contract; it must not reintroduce conflicting native-input implementations or duplicate SubToolbox visual primitives.

### Ownership and exports
- Canonical Studio field implementation and visual styling: `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`.
- `StudioInput`, `StudioSearchInput`, `StudioNumberInput`, `StudioTextArea`, `StudioSelect`, `StudioLabeledInput`, and `StudioLabeledTextArea` use the Studio Controls field contract.
- The Component Library must render the actual production exports. Compatibility names may remain as API adapters, but must not own an independent visual implementation.
- Keep the confirmed 44px/28px switch, choice, and word-toggle primitives from PR #78. Do not replace these button-based components with browser-native checkbox/radio inputs.

### Canonical field defaults
- Standard: 44px control height and 38px text.
- Compact: 28px control height and 24px text.
- Keep the text sizes stable when focused. Focus may change border/fill/indicator treatment, but must not change typography or layout geometry.
- The TypeScript size contract is authoritative; `scripts/emit-studio-control-vars.mjs` generates CSS variables, and `studio-control-system.css` consumes them. Core and recovery CSS must not redeclare the five-tier lattice. Family styles may own only family-specific anatomy and documented exceptions.

### Selection-control stroke contract — follow PR #78
- **Word toggles:** 3px solid black border at 44px and 2px solid black border at 28px.
- **Switches, radio buttons, and checkboxes:** remain borderless as specified in PR #78. Preserve their own component anatomy and keyboard-visible focus indicators; do not apply a generic black border to these families.
- The 44px switch and choice components are `SubToolbox44Switch` / `SubToolbox44Choice`; the word toggle is `SubToolbox44WordToggle`. Their styles are shared production styles, not ad hoc CSS on the catalog specimens.
- Any family-level variant must preserve the owning component's anatomy, pair-color behavior, checked/on state, disabled state, and focus visibility.

### Catalog and certification checklist
For each displayed family, identify the real export, TSX source, CSS owner, supported sizes/variants, default and checked/on states, keyboard/focus behavior, disabled behavior, and color-pair handling. Confirm the rendered catalog uses the production primitive rather than a lookalike. Build/typecheck and browser visual checks remain required before declaring the work certified; source-only checks are not visual certification.



## Studio Controls text-field contract — 2026-10-13

The canonical owners are `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`. The confirmed primitive catalog must render these production controls, not local lookalikes.

- Standard single-line fields: **44px high**, **38px** type size, weight **1000**.
- Compact single-line fields: **28px high**, **24px** type size, weight **1000**.
- Default fill: primary/accent at **50% opacity**; text and text stroke use primary/accent.
- Focus fill: primary/accent at **15% opacity**; text and text stroke switch to black.
- Primary/accent inset stroke width matches the field border width.
- Focus outline: **100% opaque secondary**, half the border stroke (1.5px standard, 1px compact).
- Caret color: primary/accent.

The catalog's Text Input, Textarea, and Number Field use the canonical Studio Controls components and select the compact variant for L2 examples.


## Closeable Badge + Tag Editor — confirmed Studio Controls family

Canonical implementation:
- TSX: `src/studio-ui/primitives/StudioControls.tsx` exports `StudioCloseableBadge` and `StudioTagEditor`.
- CSS: `src/styles/studio-control-system.css` owns badge, close-swap, fade, tag-composer, square-action, and fly-to-badge animation rules.
- Pair ownership: primary is `--pair-a`; secondary is `--pair-b`. Consumers should set the colorway on the containing scope; do not hardcode per-tag color pairs.

### Explicit global-rule exceptions

- **Closeable badge:** 20px tall pill, 16px Inter 1000 uppercase label, primary fill, label color mixed 50% with white, 16px secondary-filled close circle, primary-colored X. These dense metadata chips intentionally do not use the standard 44px / compact 28px control height.
- **Close animation:** close-circle/X colors swap three times at 180ms per cycle; the badge then fades over 1 second before its owner removes it.
- **Entry animation:** badges use a 450ms ease-out scale/fade entrance. Reduced-motion preference disables nonessential animation.
- **Tag editor actions:** plus/check squares are 32px, 3px black stroke, 8px radius, with a 4px secondary-pair offset shadow at 45% opacity. This is a named compound exception rather than a new global control size.
- **Composer:** opens a compact Studio text input and check action; Enter confirms a non-empty trimmed tag, Escape cancels, and labels normalize to uppercase up to the configured maximum length.
- **Fly transition:** newly confirmed tag text moves from the composer to its badge label; the badge then uses the canonical badge-entry treatment.
- **Accessibility:** close/add/confirm actions have accessible names and visible keyboard focus. Reduced-motion mode retains state changes without requiring animation.

Certification requirements:
- Render the production TSX exports in the Confirmed Primitive Library rather than reproducing them with catalog-only markup.
- Verify add, Enter-to-confirm, Escape-to-cancel, close-swap/fade/removal, controlled `value` / `onChange`, color-pair inheritance, keyboard focus, and reduced-motion behavior.
- The 20px badge and 32px composer action sizes are the only deliberate geometry exceptions for this family; all other typography, color and motion should inherit the Studio Controls token/pair system.


## Confirmed Button / Split-left / Icon Button Variant Matrix — 2026-10-15

The Confirmed Primitive Library must render production imports, not locally redrawn approximations. Canonical owners are StudioControls.tsx and studio-control-system.css; the catalog is a live demonstration and certification surface.

### Button families
- StudioButton: 44px standard and 28px compact; accent, neutral, danger, warning, and success tones; selected, disabled, and loading states; inherited keyboard focus, tactile press, and reduced-motion behavior.
- StudioActionButton: prominent workflow-action role, Supreme 60px by default, with standard/compact variants using shared tier tokens; no separate 56px size family.
- StudioIconButton: icon-only wrapper over StudioButton; inherits button sizing, tone, selected, disabled, loading, and focus contracts.

### Split-left families
- StudioSplitLeftButton: 44px / 28px standard and compact, fixed square icon rail, five semantic tones, selected / disabled / loading states, shared tactile press behavior.
- StudioPlayPauseButton: interactive color-swap variant with stable label geometry and persistent play/pause state.
- StudioSplitLeftBadge is informational and static, not an animated action button; do not conflate its badge anatomy with split-left button behavior.

### Square and circle icon-button families
- StudioSquareIconButton: V1 primary fill / secondary offset shadow; V2 inverse pair; V3 selectable inverse pair; V4 black face / primary icon. Standard 44×44px and compact 28×28px.
- StudioCircleIconButton: shape variant over the canonical square icon button, inheriting its skins, effects, sizing, focus and disabled behavior.
- Feature presets: heart, bell, sun-moon, lock-unlock, download-check, refresh, and like.
- Effects: standard, notification, pop-on-activation, heart-pop, bell-ring, like, unlock, download, rotated-toggle, sun-moon, lock-unlock, download-success, refresh, flip, tooltip, morph, and success.
- Animation samples must be activatable in the catalog; do not trigger them on mount. Keep movement on inner icon/feedback layers so outer geometry remains fixed.
- Heart pop uses a black fill that gradually returns to transparent over three seconds and a thicker, higher-opacity paired ripple. Lock/unlock changes only the shackle. Sun/moon uses a shared 6.5-unit outer circular reference.
- Tooltips use the fixed-label typography/geometry contract. Reduced-motion preferences suppress motion while preserving semantic state feedback.

### Catalog completeness rule
For each family, display the production source paths, standard and compact sizes where supported, each meaningful visual skin, applicable interaction effects, and selected / disabled / loading / success states. Mark outcome-driven states clearly and never imply that a successful action occurred merely because a static success specimen is visible. The catalog may organize examples but must not own a competing visual implementation.


## Vertical Studio word toggle — canonical primitive update · 2026-10-19

- `StudioVerticalWordToggle` is a separate canonical primitive beside the existing horizontal `StudioWordToggle`; it is exported from `src/studio-ui/primitives/StudioControls.tsx` and styled only in `src/styles/studio-control-system.css`.
- It inherits the Studio supreme/standard/compact/micro typography, weight, letter spacing, border stroke, and radius tokens. Only total height is exempt: two vertically stacked word faces make height content-driven rather than fixed to 60px / 44px / 28px / 12px.
- The confirmed primitive catalog demonstrates four live variants with independent state: primary/secondary, black fill, primary fill with white handle, and white fill with black handle. Word color updates at animation start; the handle uses vertical expansion/release and color-wipe motion and honors reduced-motion preferences.
- Gallery geometry is standard 2-up, compact 3-up, and micro 2×2 at the end of compact row two. Source-level tests cover the exported primitive, variant attributes, size tiers, and registered exception. Browser visual certification is still required before claiming pixel-perfect behavior.


## Studio Button — two-line text layout variant · 2026-10-19

- The two-line layout is a **variant inside the canonical Studio Button family**, implemented by `StudioButton` in `src/studio-ui/primitives/StudioControls.tsx` via `textLayout="two-line"`, `firstLine`, and `secondLine`.
- The Confirmed Primitive Library renders the variant directly in the **Button** module; it is not a separate primitive-library family or an entry in the legacy comparison catalog.
- Standard: 44px surface with two centered 18px rows. Compact: 28px surface with two centered 12px rows.
- Both rows use identical black Inter 1000 uppercase typography, `-.02em` letter spacing, and text stroke (1px standard / 0.5px compact); row spacing is evenly distributed.
- Border, radius, fill, focus and disabled behavior remain owned by `StudioButton`. `StudioTwoLineButton` remains only as a backwards-compatible wrapper around that variant.
- Build, typecheck, tests and browser visual certification must pass before declaring the visual implementation verified.


## Brain status indicator — LED 64 + Badge 45 composition

**Primitive:** `StudioBrainStatusIndicator` in `src/studio-ui/primitives/StudioControls.tsx`  
**Styles:** `src/styles/studio-control-system.css`  
**Showcase:** `src/components/brain/BrainStatusIndicatorShowcase.tsx`  
**Source test:** `src/studio-ui/primitives/StudioBrainStatusIndicator.test.tsx`

- Combines LED-light (library item 64) with borderless badge (item 45).
- Rectangular 44/28/12px tiers with 6/4/2px corner radii, not pill shapes.
- Saturated LED glow and staggered ripple rings; centered 1px black lens outline at 65% LED diameter with 60%-opacity white fill.
- Dark fill/white text and tinted fill/black text variants; running, success, warning, error, info, paused, idle, queued, processing, complete, blocked and failed states.
- Configurable pulse respects `prefers-reduced-motion`; text remains visible so color is not the only status signal.
- Browser visual certification and contrast checks remain outstanding.


## Split Accordion — confirmed primitive entry (2026-10-22)

`StudioSplitAccordion` is an independent production primitive at `src/studio-ui/primitives/StudioSplitAccordion.tsx`, styled by `src/styles/studio-split-accordion.css`. It is registered in `StudioHubConfirmedPrimitiveCatalog.tsx` with source provenance and Standard / Compact / Micro specimens.

- Do not revive, import, wrap, or reuse the retired `StudioSplitRailAccordion` implementation.
- API: `items`, `sizeVariant` (standard / compact / micro), `layout` (left / right / double), optional controlled `activeIndex` / `onActiveIndexChange`, `defaultActiveIndex`, `disabled`, and `accessibleLabel`.
- Each item exposes `id?`, `accessibleLabel`, `icon`, `content`, optional `trailing`, `disabled`, and `style`.
- The accordion defaults to the rightmost enabled item; keyboard navigation supports arrow keys, Home, and End. Inactive panels use the native `hidden` attribute, and active panels are labelled by their trigger.
- The component owns no shadows or global-token changes. The 280ms panel tween is disabled under `prefers-reduced-motion: reduce`; interaction lock remains deterministic.
- Contract coverage: `src/studio-ui/primitives/StudioSplitAccordion.test.tsx` and the confirmed catalog test. Source registration does not by itself claim browser visual certification.

## Confirmed Primitive Library grid system — 2026-10-20

The Confirmed Primitive Library uses a shared **4px spacing unit** for catalog layout. The unit governs external gaps between the catalog shell, family cards, variant grids, and specimen cells; multiples of the unit (4px, 8px, 12px, 16px) may be used to establish hierarchy. Responsive rules may change column count but must retain min-width: 0 on grid children so long labels and full-row controls cannot force horizontal overflow.

- src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx is the source-confirmed specimen registry and imports production primitives.
- src/components/studio-hub/studio-hub-primitive-catalogs.css owns catalog placement, grid columns, cell spacing, specimen captions, and source disclosure presentation only.
- src/studio-ui/primitives/StudioControls.tsx, the canonical token generator, generated token CSS, and production control styles remain the sole owners of control geometry and appearance.
- Do not use catalog-only mock controls as proof of production support. Each size tier shown must be supported by the actual primitive API and verified render behavior.
- Standard and compact comparison specimens may remain paired on narrow screens where the comparison itself is meaningful; grid containment is required even when columns are retained.
- scripts/audit/confirmed-library-layout.test.mjs protects the shared spacing unit, responsive containment, production-source provenance, and the separation between catalog layout and control-face styling.

## AI Brain chat compositions — 2026-10-23

The AI Brain chat is a consumer of the Studio control system, not a second primitive library. The following Brain-owned compositions are implemented in `src/components/brain/BrainChatPrimitives.tsx` and are composed around canonical Studio controls where interactive controls are needed:

- `BrainChatStatusBadge` — compact explicit status label; status is supplied by the canonical owner and is never inferred from missing data.
- `BrainChatMessageShell` — role-labelled, width-safe shell for user or assistant content.
- `BrainResponseSectionHeader` — compact wrap-safe response section heading with optional metadata.
- `BrainChatActionButtonGroup` — compact action group that delegates behavior to existing Brain handlers and uses `StudioButton`.
- `BrainPromptLibraryItem` — accessible selected/disabled prompt row for existing registry-backed prompt data; it does not own a prompt registry.
- `BrainComposerAccessoryRow` — wrapping accessory group for existing composer controls.

The main Brain page consumes the shared message shell for user posts and the shared response header for assistant responses. The prompt library uses `BrainPromptLibraryItem` for registry-backed selectable prompts, and response handoff actions use `BrainChatActionButtonGroup` with the existing review-only handlers. The chat status composition delegates its visual indicator to canonical `StudioBrainStatusBadge` rather than implementing a second badge face. Existing answer modules, evidence ribbon, context disclosure, prompt registry, send handler, and learning/feedback owners remain authoritative. The composer stays within the chat workspace, groups mobile shortcuts with `BrainComposerAccessoryRow`, and reserves mobile safe-area padding. The conversation viewport follows new turns when the creator is near the bottom, preserves position while they read older history, and re-enables follow mode when they submit a prompt.

Focused primitive tests live in `src/components/brain/BrainChatPrimitives.test.tsx`; the conversation auto-follow threshold is covered in `src/views/__tests__/AIBrainCommandInterface.test.tsx`. This documentation records source composition, not browser certification. Typecheck, test execution, responsive screenshots, keyboard/scroll behavior, and console inspection must be recorded separately before marking the work visually certified.

The assistant response card is composed through `BrainResponseLayout`, a reusable compound shell for the accessible response title, header slot, body, action row, and optional footer. `CreatorResponseCard` supplies its existing generation metadata, answer modules, evidence/readiness components, feedback handlers, context disclosure, and learning receipt to that shell; it does not move evidence interpretation, response generation, or learning persistence into the layout. The focused primitive test covers title/role semantics and each optional slot. This is source-level composition only; responsive and browser behavior still requires CI/runtime verification.

The chat composition layer also exports `ChatConversationViewport` and `BrainComposerShell`. The viewport owns the labelled transcript log and bottom sentinel while the Brain page retains its follow/preserve-scroll decision; the composer shell owns footer geometry and mobile safe-area padding while the page retains input, submit, stop, prompt, and context handlers. These compose existing behavior rather than adding new state or persistence owners. Focused contract tests cover the accessible log, sentinel markup, composer landmark, and safe-area class; browser certification remains outstanding.

## StudioInterModule — confirmed primitive entry (2026-10-23)

`StudioInterModule` is the canonical nested disclosure primitive at `src/studio-ui/primitives/StudioInterModule.tsx`, with visual rules in `src/styles/studio-inter-module.css`. It is publicly exported from `src/studio-ui/index.ts` and is registered in `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` as live production specimens at Compact, Standard, and Micro sizes.

- The primitive is designed to nest inside an existing module shell: it does not draw exterior left/right borders. Header rules run full width; start/end rails own only their internal divider, avoiding doubled outer strokes.
- Supports controlled `open` / `onOpenChange` and uncontrolled `defaultOpen`, collapsible and always-open modes, start/end icons, optional header styling, and standard / compact / micro size variants.
- Collapsed sections expand in place. Keyboard activation supports Enter and Space, and the disclosure header exposes `aria-expanded`.
- The AI Brain Prompt Library composes category modules containing nested prompt modules; prompt actions remain inside the expanded prompt body, including Send to Chat and Edit First. Prompt filtering and registry-backed content remain owned by the Brain page.
- The Confirmed Primitive Library demonstrates nested edge-flush composition at all three sizes; specimens are production imports, not catalog-only redraws.
- Contract tests: `src/studio-ui/primitives/StudioInterModule.test.tsx`. Source registration is not browser certification; run the focused test suite, typecheck/build, and responsive browser checks before marking visual behavior certified.

## Double Side Toggle — V1/V2 appearance matrix (2026-10-23)

The confirmed Double Side Toggle now supports only **V1** (visible center divider) and **V2** (no center divider). The corrupted V3/V4 width/divider variants are retired. The right face has an independent `rightAppearance` axis with three choices: `primary`, `secondary`, and `black-primary-text`. The Confirmed Primitive Library demonstrates all six V1/V2 × right-face combinations using the production `StudioDoubleSideToggle` primitive.

- Keyboard focus is represented by one outline around the outer component perimeter. Nested arrow controls do not draw focus outlines across the center divider.
- `StudioInterModule` Standard, Compact, and Micro specimens must fill the parent shell's available width. The parent body must not retain horizontal padding that prevents Compact/Micro headers and rails from meeting the same inner edges as Standard.
- Focused regression assertions are in `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.test.tsx`. Run the tests and a browser keyboard/visual check before certifying the focus geometry and responsive widths.


## Studio Controls expanded primitive catalog — 2026-10-27

### Current canonical specimen set

`src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` is the current Confirmed Primitive Library entry point verified during this audit. Its representative section contains full-width Standard specimens for: `StudioButton`, `StudioSplitLeftButton`, `StudioDoubleSplitButton`, `StudioTwoLineButton`, `StudioSplitTwoLineButton`, `StudioDropdown`, `StudioLegendMultiDropdown`, `StudioSplitLeftDropdown`, `StudioArrowToggle`, `StudioBarToggle`, `StudioWordToggle`, `StudioVerticalWordToggle`, `StudioNumberInput`, `StudioTextInput`, `StudioUsernameInput`, `StudioSplitLeftInput`, `StudioSplitTextInput`, `StudioTextArea`, `StudioTextBox`, `StudioSideToggle`, `StudioDoubleSideToggle`, `StudioCounter`, `StudioSideCounter`, `StudioLeftCounter`, and `StudioDoubleSplitSlider`. The catalog imports `StudioSplitTextInput` from its dedicated production module; `StudioSplitAccordion` is also a dedicated production primitive with its own stylesheet and tests.

The representative list is a source/provenance ledger, not a guarantee that every tier or state is visually certified. Catalog captions and exception notes must match the actual export API and token/CSS support; catalog-only CSS must not repair control-face geometry.

### Component-family documentation rules

- **Buttons:** distinguish single-face, split-left, double-split, two-line, and split two-line anatomy; list public size/variant props and state behavior from production API.
- **Dropdowns:** distinguish simple trailing-chevron, multi-select/legend, and split-left with a leading secondary rail; document keyboard selection and focus ownership.
- **Toggles:** keep arrow/bar/word/vertical-word/side/double-side/value-toggle semantics distinct; record bidirectional cycling and active/inactive fills only where source implements them.
- **Fields:** document editable single-line, split-shell input, textarea, and read-only TextBox separately. Record outer border, inset stroke, fill, text/glyph stroke, caret, outline, and label mode independently.
- **Counters/sliders:** document action rails, value area, separators, min/max behavior, keyboard operation, and supported tiers.
- **Accordions/modules:** record split layout, trigger semantics, keyboard navigation, inactive panel visibility, reduced-motion behavior, and whether the family is standalone or composed.

### Size and styling drift requiring follow-up

- Mini type/icon is 17.5px in tokens and generated CSS; core/recovery styles no longer redeclare the five-tier geometry.
- Micro follows Mini's shared stroke/radius/outline and letter-spacing settings; its size-specific values are 12px height and 10px type/icons. Catalog-only captions must not override the token contract.
- Micro follows the global `-0.02em` letter-spacing token; there is no Micro-specific exception.
- The three Studio contract documents must agree on intended rules and separately report implementation status. Documentation must not mark a source defect as fixed.

### Verification status — 2026-10-27

Source paths and imports were inspected. Browser visual certification, computed-style verification, keyboard/assistive-technology testing, typecheck, and build have not been run in this documentation pass. Do not describe the new representatives as fully certified until those checks are complete.


### Style ownership and minimal-change rule — 2026-10-27

- `src/studio-ui/tokens.ts` owns global size and field tokens.
- `scripts/emit-studio-control-vars.mjs` generates `src/styles/studio-control-vars.generated.css`; do not hand-edit generated values when the emitter can produce them.
- `src/styles/studio-control-system.css` owns global tier selectors and consumes generated named-tier variables.
- `src/styles/studio-control-core.css` owns generic layout/interaction behavior, not a second size ladder.
- `src/styles/studio-control-recovery-overrides.css` owns only scoped regressions that cannot yet live in the owning primitive stylesheet; it must not redefine the global size ladder.
- `StudioSplitTextInput` imports `studio-split-text-input.css` for shell perimeter, rails, inset geometry, and focus routing. Shared field typography and state colors remain owned by `studio-control-fields.css` and global tokens.
- For future changes, remove stale declarations and use existing token variables before adding CSS. Add a new selector/file only when a primitive truly owns unique anatomy that cannot be expressed by shared rules.


### Style ownership and minimal-change rule — 2026-10-27

- `src/studio-ui/tokens.ts` owns global size and field tokens.
- `scripts/emit-studio-control-vars.mjs` generates `src/styles/studio-control-vars.generated.css`; do not hand-edit generated values when the emitter can produce them.
- `src/styles/studio-control-system.css` owns global tier selectors and consumes generated named-tier variables.
- `src/styles/studio-control-core.css` owns generic layout/interaction behavior, not a second size ladder.
- `src/styles/studio-control-recovery-overrides.css` owns only scoped regressions that cannot yet live in the owning primitive stylesheet; it must not redefine the global size ladder.
- `StudioSplitTextInput` imports `studio-split-text-input.css` for shell perimeter, rails, inset geometry, and focus routing. Shared field typography and state colors remain owned by `studio-control-fields.css` and global tokens.
- For future changes, remove stale declarations and use existing token variables before adding CSS. Add a new selector/file only when a primitive truly owns unique anatomy that cannot be expressed by shared rules.


## Simplified ownership migration — 2026-10-27

Simplification must be compatibility-preserving: retain public token exports and Toolbox token dependencies in `src/studio-ui/tokens.ts`; generate semantic CSS variables from that canonical source; keep field, split, dropdown, and accordion anatomy in their family-owned stylesheets. Legacy entry imports must not be removed until every live selector from parity/recovery layers has been migrated and ownership, typecheck, build, and rendered-control checks pass. Prefer deleting duplicate rules over adding overrides.


## Phase 3–4 CSS ownership cleanup — 2026-10-29

The active stylesheet entry is `src/styles/studio-control-entry.css`. The unreferenced `studio-control-system-2.css` alternative has been removed after repository code search returned no references; the entry and a regression test now require the single canonical `studio-control-system.css` layer. The recovery stylesheet no longer re-declares the global `--vt-studio-space-unit` token.

Do not remove remaining `!important` declarations by count alone. Each declaration must be traced to its winning selector and migrated to the owning primitive/family stylesheet with regression coverage before deletion. The distill and recovery files are late cross-family correction layers, not the final stylesheets in the import order; later family sheets own their specific anatomy.


## Public export representative completeness — 2026-10-29

The Confirmed Primitive Library now renders direct representatives for every non-type `Studio*` value export from `src/studio-ui/index.ts`. The public-export matrix has no exception allow-list: a public value export without a direct JSX representative is an unresolved gap and fails the audit.

The 11 formerly excepted exports are covered explicitly:

- **Compatibility aliases (7):** `StudioInput`, `Studioarea`, `Studiotoggle`, `Studioswitch`, `Studioradio`, `Studiocheck`, and `Studioxbox`. These specimens are labelled compatibility-only; they are not presented as new canonical primitive designs.
- **Grid composition helpers (3):** `StudioComponentGridRow`, `StudioComponentGridSpecimen`, and `StudioComponentGridSpecimenPair`. Each is composed from existing production controls and shared grid primitives.
- **Certification surface (1):** `StudioHubCertification` has its own full-composition specimen and is not counted as a primitive control face.

The matrix test now requires every public Studio value export to have direct JSX coverage. This proves source-level representative presence only. Typecheck, the Studio controls test suite, production build, and browser/computed-style certification must pass before visual behavior is considered verified.


## Confirmed library organization contract

- Use one canonical family section for each control family. Put size, skin, orientation, and registered behavior variants inside that family rather than repeating the same controls in standalone duplicate sections.
- Keep the six canonical parent groups stable and ordered: Text Fields, Buttons & Badges, Dropdowns, Controls, Modules & Frames, and Compositions. Counters and sliders belong inside Controls; dropdown menus and option rows belong inside Dropdowns.
- Global Defaults + Exceptions stays a dedicated source-contract section; it is not a primitive specimen family.
- Compatibility aliases and composition helpers are documented as such and do not create parallel primitive implementations.
- Keep one canonical owner for each CSS behavior. In particular, empty Bar Toggle segments must preserve the 50% white + 50% primary blend so they remain visible against the background; active segments remain black.

## Counter and value-toggle production corrections — 2026-10-29

The confirmed production counter family uses directional chevrons for the double-split `StudioCounter` action rails, matching the existing `StudioBarToggle` icon language. `StudioLeftWordCounter` uses the shared counter numeral rest token (50% white/50% primary) and black numeral treatment during interaction focus; its opt-in color-cycle appearance remains separate.

Selectable split-left, split-right, and double-split buttons swap their label and rail fills together when selected: resting label primary / rail secondary; selected label secondary / rail primary. `StudioBarToggle` keeps its bars in the flexible center cell, uses the shared secondary focus outline, and shows the rounded percentage above the rightmost filled bar using a secondary-fill, black-text, borderless compact tooltip. Production primitive markup and production family CSS remain authoritative; catalog specimens only demonstrate these states.



## Counter width and state defaults — 2026-10-30

- StudioCounter and StudioSideCounter retain a 2:1 width-to-height number-value region as a registered family geometry exception; their action rails remain square to the selected size tier. Do not remove this ratio as a mistaken fixed-width override.
- The double-split word counter uses its solid primary value-pane fill and primary numeral color/stroke at rest. Remove accidental 50%-primary blend overrides. During interaction focus, its numeral fill and stroke turn black.
- Bar-toggle rails must not cover the center visualization. The center cell and bars paint above the rails, the outer shell retains its zero-offset secondary focus outline, and the percentage tooltip is hidden at rest and shown only while focus is within the control.
- Selected split buttons swap as one state: text pane to secondary and rails to primary. Play/Pause follows the same swap; it does not use a 50%-primary intermediate fill.
- Dropdown menus use the active Toolbox primary/secondary pair tokens. Keep unselected rows white and selected rows secondary; center trigger labels independently of the chevron and use the token-owned horizontal chevron inset.


## Confirmed Primitive Library taxonomy enforcement — 2026-10-30

The taxonomy is enforced by `classifyConfirmedCatalogItem` in `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`. Classification is fail-closed: an unrecognized family remains ungrouped and is surfaced in an actionable Unclassified family warning that requires an explicit category rule. There is no implicit Compositions fallback.

- Dropdown triggers, dropdown menu rows, option lists, and menu-state specimens classify as **Dropdowns**, regardless of whether the menu is shown as a standalone specimen.
- Counters, word counters, sliders, word sliders, switches, radios, checkboxes, and all toggle orientations classify as **Controls**.
- Text entry/display primitives classify as **Text Fields**; action buttons and badge families classify as **Buttons & Badges**.
- Structural shells classify as **Modules & Frames**. Assembled experiences and layout compositions classify as **Compositions**.
- The classifier contract test covers representative examples from every group and asserts that an unregistered family fails instead of silently entering a catch-all group.
- The catalog renders the defaults contract once, then the six parent groups once each. All primitive specimens—including compatibility exports and composition helpers—enter the same grouping pass.

This is a catalog information-architecture contract. It does not change the visual treatment, public primitive APIs, control tokens, or runtime behavior.


## Studio Controls representatives and geometry contract — 2026-10-30

- The Representatives module is a one-column, full-width inventory. Each representative uses the actual production export at Standard size; related primitives are grouped together. The current inventory names 22 primitive representatives and each must have a matching `data-vt-library-component` specimen.
- Every primitive has a family module with a real production implementation and provenance. A representative is not a catalog-only recreation. Counter and Side Counter are distinct family modules; Side Counter must not be nested inside Counter.
- Split-left, split-right, and double-split badge labels are centered against the full outside shell edges. Their label center axes must match at equal shell widths, regardless of how many square rails each anatomy has. Split text input is excluded from that centering rule and remains editable/left-aligned.
- StudioCounter uses a 2h number-value area plus two h-square rails (4h total); StudioSideCounter uses a 2h number-value area plus one h-square rail (3h total). The root width is computed from the selected tier, value-area ratio, and rail count. All associated action rails remain square (1:1).
- Split text input has one canonical stylesheet: `src/styles/studio-split-text-input.css`. `StudioSplitTextInput.tsx` imports it directly; `studio-control-entry.css` does not import a duplicate. The input is a normal editable native field inside the badge-owned shell, with a primary inset and black focused glyph fill/stroke.
- The side/double-side chevron controls share one implementation and sizing contract. Double-side's center divider has no independent secondary focus outline; only the outside shell receives it.
- Inter-modules are full width, edge-to-edge, and use square split sections without a default 4px edge inset.
- Empty bar-toggle segments use 50% white / 50% primary fill; filled segments are black. Bars match the tier text height, use 2.5:1 height-to-width geometry and a slight radius; the percentage tooltip appears on focus. Counter value ratio is named in STUDIO_COUNTER_NUMBER_TOKENS; bar height/ratio/radius/fill are named in STUDIO_BAR_TOGGLE_TOKENS and emitted from the canonical token source. Recovery CSS must not duplicate these geometries.
- Vertical word-toggle handles use measured word-block bounds (no line-height fudge) and the same side-inset/corner-radius relationship as the horizontal word-toggle handle. Competing fixed-inset recovery overrides are prohibited.
