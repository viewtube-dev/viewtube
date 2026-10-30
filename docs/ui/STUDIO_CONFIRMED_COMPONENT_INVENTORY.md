# Studio Confirmed Component Inventory

**Status:** Source-backed inventory for the active Confirmed library  
**Source of truth:** `src/studio-ui/index.ts` for public value exports; `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` for production specimens and category placement.

The Confirmed library uses six parent groups. Each public Studio component value export must have a `data-vt-library-component` specimen in the active catalog. Compatibility exports remain visible but are labeled as compatibility; they are not treated as new canonical implementations.

## Text Fields

- `StudioTextInput`
- `StudioInput` — compatibility alias
- `StudioUsernameInput`
- `StudioSplitLeftInput`
- `StudioSplitTextInput` — left, right, and double-rail variants live inside this same Text Fields group
- `StudioTextArea`
- `Studioarea` — compatibility alias
- `StudioTextBox`

## Dropdowns

- `StudioDropdown` — canonical single-select menu
- `StudioLegendMultiDropdown` — multi-select menu
- `StudioSplitLeftDropdown` — split-left layout variant
- `StudioSimpleDropdown` is not a separate public menu engine or a separate family; it is a compatibility wrapper around `StudioDropdown`.

Dropdown menus belong in Dropdowns, not Compositions. A composition may contain dropdown instances as children, but those instances do not create a second dropdown catalog family.

## Controls

- Choices: `StudioChoice`, `StudioSwitch`, `StudioRadio`, `StudioCheckbox`, `StudioXCheckbox`
- Word/value toggles: `StudioWordToggle`, `StudioArrowToggle`, `StudioSideToggle`, `StudioDoubleSideToggle`, `StudioBarToggle`, `StudioDoubleSplitWordCounter`
- Counters: `StudioCounter`, `StudioSideCounter`, `StudioLeftCounter`, `StudioLeftWordCounter`
- Sliders: `StudioDoubleSplitSlider`, `StudioLeftWordSlider`
- Compatibility controls: `Studiotoggle`, `Studioswitch`, `Studioradio`, `Studiocheck`, `Studioxbox`

Counters, sliders, switches, radios, checkboxes, word toggles, and value toggles belong together under Controls.

## Buttons & Badges

- Buttons: `StudioButton`, `StudioTwoLineButton`, `StudioSplitTwoLineButton`, `StudioActionButton`, `StudioIconButton`, `StudioSplitLeftButton`, `StudioSplitRightButton`, `StudioDoubleSplitButton`, `StudioSquareIconButton`, `StudioSquareIconButtonGroup`, `StudioCircleIconButton`, `StudioPlayPauseButton`
- Badges/status tabs: `StudioSplitLeftBadge`, `StudioSplitRightBadge`, `StudioDoubleSplitBadge`, `StudioBrainStatusBadge`, `StudioBrainStatusIndicator`, `StudioLedBadgeTab`

## Modules & Frames

- `StudioTopSplitModule`
- `StudioCollapsingSplitModule`
- `StudioCollapsingTwoLineModule`
- `StudioInterModule`
- `StudioSplitAccordion`
- `StudioUploadFrame`

## Compositions

- Tags and metadata: `StudioSpectrumTag`, `StudioCloseableBadge`, `StudioTagEditor`
- Component-grid layout: `StudioComponentGrid`, `StudioComponentGridCell`, `StudioComponentGridRow`, `StudioComponentGridSpecimen`, `StudioComponentGridSpecimenPair`
- Publishing: `StudioPublishingCard`
- Chat composition: `StudioChatActionGroup`, `StudioResponseMetaRow`, `StudioChatResponseShell`, `StudioChatComposerDock`
- Calendar composition primitives: `StudioCalendarEventChip`, `StudioCalendarMediaRail`
- Full-surface composition: `StudioHubCertification`

A component used inside another composition remains listed in its owning category. For example, a dropdown rendered inside the Publishing Card remains a Dropdown primitive; the card itself remains a Composition.

## Explicit exclusions

- InlineStepper and SplitStepper are removed and are not part of the current component inventory or Confirmed catalog.
- Do not create a second text-field or dropdown family to represent layout variants.
- Do not create a duplicate primitive family for compatibility wrappers.
- Do not place dropdown menu primitives under Compositions.

## Coverage rule

The catalog test derives public Studio value exports from `src/studio-ui/index.ts` and asserts that every exported component has a Confirmed specimen. Type-only exports are API contracts, not rendered component specimens, and are excluded from that runtime coverage assertion.

A catalog specimen establishes source-level representation only. It does not certify computed CSS, keyboard behavior, responsive layout, or visual parity; those still require the browser/runtime audit.
