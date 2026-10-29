# Studio Controls Audit — Phases 0, 1 and 2

**Audit date:** 2026-10-29  
**Repository:** `viewtube-dev/viewtube`  
**Audited base:** `master/consolidated-feature-integration`  
**Audit branch:** `audit/studio-controls-phases-0-1-2-2026-10-29`  
**Scope:** baseline/source map (Phase 0), primitive and catalog inventory (Phase 1), defaults/exception/cascade discrepancy audit (Phase 2).  
**Status:** Source audit completed; browser-rendered certification and corrective implementation are not part of these three phases.

## Executive result

The repository already contains a substantial canonical token contract, a dedicated Confirmed Primitive Library, provenance declarations and tests. However, the current branch is not yet a single-source, mechanically reconciled system. The audit found competing catalog surfaces, a very large shared stylesheet with a significant late-override cascade, and gaps between the stated architecture and the effective implementation structure.

The confirmed catalog currently contains **49 `<Family>` entries, 49 provenance declarations and 49 `nonDefaultSettings` blocks** in `StudioHubConfirmedPrimitiveCatalog.tsx`. These are counts of source constructs, not proof that all public primitives or all actual exceptions are covered. Phase 1 must compare them against the full export/API inventory; Phase 2 must verify the accuracy and completeness of each settings block against code and computed styles.

## Phase 0 — Baseline and authority map

### Target and verified files

The intended target branch exists: `master/consolidated-feature-integration`. A separate audit branch was created from that ref. No changes were made to the target branch.

| Concern | Current source |
|---|---|
| Public Studio UI exports and stylesheet entry imports | `src/studio-ui/index.ts` |
| Canonical shared values and size tiers | `src/studio-ui/tokens.ts` |
| Main shared primitive implementations | `src/studio-ui/primitives/StudioControls.tsx` |
| Toggle family implementation | `src/studio-ui/primitives/StudioValueToggles.tsx` |
| Split text input implementation | `src/studio-ui/primitives/StudioSplitTextInput.tsx` |
| Split accordion | `src/studio-ui/primitives/StudioSplitAccordion.tsx` |
| Shared production CSS entry / cascade | `src/styles/studio-control-entry.css` |
| Shared system CSS | `src/styles/studio-control-system.css` |
| Field-specific CSS | `src/styles/studio-control-fields.css` |
| Late distillation override CSS | `src/styles/studio-control-distill-overrides.css` |
| Late recovery override CSS | `src/styles/studio-control-recovery-overrides.css` |
| Current Confirmed Primitive Library | `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` |
| Older/legacy complete catalog | `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` |
| Library shell / track selection | `src/components/ToolboxUIReferenceLibrary.tsx` |
| Existing specimen layout component | `src/components/studio-hub/ConfirmedSpecimenGrid.tsx` |
| Existing token and control contract coverage | `src/studio-ui/primitives/studio-control-contract.test.ts` |
| Existing confirmed-catalog tests | `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.test.ts`, `StudioHubConfirmedPrimitiveCatalog.test.tsx` |
| Canonical documents | The three documents under `docs/ui/` named below |

### Existing authority hierarchy (intended)

1. Current approved product contract for the exact concern.
2. `STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md` for precedence/ownership.
3. `src/studio-ui/tokens.ts` for canonical values.
4. Production primitive API and implementation.
5. Shared production CSS and registered family CSS.
6. Page composition styles.
7. Catalog/specimen presentation styles only.
8. Unexplained inline values, hard-coded geometry and late overrides treated as drift.

### Baseline caveat

The branch was inspected through repository file and directory APIs. No local checkout, package scripts, CI runs, or browser session were available in this audit execution. Therefore, this report does not claim a local test/build pass or visual certification.

## Phase 1 — Primitive and library inventory

### Public export inventory

The public barrel `src/studio-ui/index.ts` exports the following groups. The definitive machine-generated manifest should be created from this file and each referenced module during Phase 3; this list is a source-reviewed group inventory, not a claim that every export has a dedicated catalog specimen.

- **Core controls:** `StudioButton`, `StudioTwoLineButton`, `StudioSplitTwoLineButton`, `StudioActionButton`, `StudioIconButton`, `StudioCircleIconButton`, `StudioPlayPauseButton`.
- **Fields:** `StudioInput`, `StudioTextInput`, `StudioUsernameInput`, `StudioSplitLeftInput`, `StudioTextArea`, `StudioTextBox`, `Studioarea`, `StudioSplitTextInput`.
- **Split controls and badges:** `StudioSplitLeftButton`, `StudioSplitRightButton`, `StudioDoubleSplitButton`, `StudioSplitLeftBadge`, `StudioSplitRightBadge`, `StudioDoubleSplitBadge`, `StudioTopSplitModule`, `StudioCollapsingSplitModule`, `StudioCollapsingTwoLineModule`.
- **Icon button families:** `StudioSquareIconButton`, `StudioSquareIconButtonGroup`.
- **Choice and toggle controls:** `Studiotoggle`, `Studioswitch`, `Studioradio`, `Studiocheck`, `Studioxbox`, `StudioChoice`, `StudioSwitch`, `StudioWordToggle`, `StudioRadio`, `StudioCheckbox`, `StudioXCheckbox`, `StudioArrowToggle`, `StudioSideToggle`, `StudioDoubleSideToggle`, `StudioBarToggle`.
- **Dropdowns and numeric controls:** `StudioLegendMultiDropdown`, `StudioDropdown`, `StudioCounter`, `StudioSideCounter`, `StudioLeftCounter`, `StudioLeftWordCounter`, `StudioLeftWordSlider`.
- **Other public primitives:** `StudioUploadFrame`, `StudioBrainStatusBadge`, `StudioComponentGrid`, `StudioComponentGridCell`, `StudioComponentGridRow`, `StudioComponentGridSpecimen`, `StudioComponentGridSpecimenPair`, `StudioSplitAccordion`, `StudioInterModule`, `StudioChatActionGroup`, `StudioResponseMetaRow`, `StudioLedBadgeTab`, `StudioChatComposerDock`, `StudioChatResponseShell`.
- **Composition/recipes and supporting modules:** `StudioPublishingCard`, toolbox/subtoolbox layout primitives, recipes and certification utilities. These must be classified as compositions/layouts/utilities rather than incorrectly counted as control primitives.

The confirmed catalog also imports internal symbols from `StudioControls.tsx` that are not visibly exported in the public barrel list, including some specialist dropdown, tag, search, number-input and status symbols. This is not automatically a defect—some may intentionally be internal—but the inventory must explicitly classify each as public, internal-only, deprecated or accidentally missing from the barrel.

### Confirmed catalog structure

File: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`

- 49 `<Family>` render blocks.
- 49 `<Provenance>` declarations.
- 49 `nonDefaultSettings` blocks.
- Contains a titled section **“Direct Imported Primitive Representatives · Standard”**.
- Imports many controls directly from `../../studio-ui/primitives/StudioControls` and imports standalone modules for split text input, component grid, split accordion, dropdown, intermodule, response meta row, LED badge tab, chat response shell, and publishing card.
- Existing examples cover buttons/split buttons, counters/word controls, dropdowns, choices/toggles, fields, text box, icon buttons, modules, tags, upload frame, split accordion, chat response controls and LED navigation.

### Current family titles in the Confirmed catalog

1. Switches, Radios & Checkboxes
2. Split-left Badge · Standard + Compact + Micro
3. Word Toggles · Standard + Compact + Vertical
4. Direct Imported Primitive Representatives · Standard
5. INTERMODULE
6. CHANNEL SETTINGS
7. MODULE HEADER
8. COLLAPSING MODULE
9. INNER SECTION
10. CREATOR SETTINGS
11. ANSWER SUMMARY
12. ANSWER SUMMARY (second occurrence; verify whether intentional or duplicate)
13. Studio Counter Family · Double-Side / Side / Left
14. StudioDoubleSplitSlider · Supreme + Standard + Compact + Mini + Micro
15. StudioSideCounter · Supreme + Standard + Compact + Mini + Micro
16. StudioLeftWordCounter · Four-State Cycle + Five Sizes
17. StudioLeftWordSlider · Slider + Numeric Right Rail
18. Button · V1–V7 · Proportional size grid
19. Split Button Family · Left / Right / Double / Two-Line
20. Dropdown Family · Standard / Split-Left / Multi-Select
21. Switches / Toggles / Radio / Checkbox (possible overlap with item 1; verify deliberate coverage vs duplicated specimen)
22. Split Text Input · Vertical Geometry Comparison
23. StudioDropdown · Single Selection
24. StudioUsernameInput · Split Identity Field
25. StudioSplitLeftInput · Split Search Field
26. StudioIconButton · Standard
27. StudioSplitRightButton · Standard
28. StudioChoice · Standard
29. StudioLeftCounter · Standard
30. Studio Text Input · Standalone + Simple + Floating + Fixed Label
31. Studio Text Area · Standalone + Simple + Floating + Fixed Label
32. Studio Text Box · Supreme + Standard + Compact + Mini + Micro
33. Prominent Action · 60px Supreme
34. Square Icon Button · 44px + 28px
35. Square Icon Button Groups · Standard + Compact
36. Two-Line Button · Standard + Compact
37. Split Two-Line Button · Standard + Compact
38. Top Split Module · Left / Right / Double / None
39. LEFT RAIL
40. RIGHT RAIL
41. DOUBLE RAIL
42. NO RAILS
43. Split-left Button · Standard + Compact
44. Play/Pause Split-left Button · 44px + 28px
45. Circle Icon Button · 44px + 28px
46. StudioLegendMultiDropdown · Multi Selection
47. StudioSpectrumTag · Vault Metadata Exception
48. StudioCloseableBadge · Fixed 20px Exception
49. StudioTagEditor · Tokenized Actions
50. Upload Frame · Standard + Compact
51. Split-left Dropdown · Fixed Chevron Rail
52. Publishing Card · 5:7 Compound Composition
53. NEW VIDEO
54. Split Accordion · Train Motion
55. InterModule · Standard
56. PROMPT LIBRARY
57. Collapsing Split Module · Standard + Compact
58. COLLAPSING MODULE
59. COMPACT MODULE
60. Collapsing Two-Line Module · Standard
61. CREATOR SETTINGS
62. Status / navigation · LED badge and tab system
63. StudioResponseMetaRow · Compact
64. ANSWER SUMMARY
65. EVIDENCE PROVENANCE
66. StudioChatResponseShell · Compact
67. ANSWER SUMMARY
68. StudioChatActionGroup · Compact
69. StudioDoubleSplitButton · Standard
70. Arrow / Side / Double Side / Bar Toggles

Note: The extraction counted 49 `<Family>` elements; the heading list above includes nested titled anatomy modules and repeated titles, so it is not the count of independent `<Family>` elements. Those subheadings should be classified separately in the final manifest. Repeated names may represent legitimate sub-specimens, nested anatomy, or duplication and must not be removed without tracing their implementation and purpose.

### Competing catalog surfaces

The library shell `src/components/ToolboxUIReferenceLibrary.tsx` imports and offers multiple tracks/catalogs:
- `StudioHubCompletePrimitiveCatalog` (legacy complete catalog with `HardcodedGenericControl` and a broad hand-maintained `STUDIO_HUB_COMPONENT_FAMILIES` list).
- `StudioHubPrimitiveMigrationCatalog`.
- `StudioHubProductionButtonCatalog`.
- `StudioHubConfirmedPrimitiveCatalog`.
- `StudioHubConfirmedSplitTextInputCatalog`.

The shell exposes `hardcoded`, `primitive`, and `confirmed` tracks. This is useful for comparison and migration, but it conflicts with a simplistic reading of the canonical doc that there is one catalog owner and no independent subset. The docs must distinguish the active Confirmed Primitive Library from retained comparison/migration tracks and specify whether those legacy catalogs are intentionally maintained, frozen, or scheduled for retirement. Do not delete them until routing and migration references are verified.

The legacy complete catalog defines a large `STUDIO_HUB_COMPONENT_FAMILIES` array and a generic hand-built renderer. That registry is not equivalent to a production-imported representative inventory. It should not be counted as proof of confirmed primitive coverage.

### Existing specimen grid

`ConfirmedSpecimenGrid.tsx` explicitly says production integration and browser certification remain pending in its integration note. Its supported tier type is `supreme | standard | compact | micro`, omitting `mini` despite the global five-tier token contract. The implementation and documentation disagree on whether this grid is a complete canonical size comparison surface. Confirm its actual usage before deciding whether to add Mini, narrow the claim, or retire/replace the component.

## Phase 2 — Defaults, exception and cascade audit

### Canonical token facts confirmed from `tokens.ts`

Global values include Inter/system fallback; weight 1000; uppercase labels; letter-spacing -0.02; line-height 1; textarea line-height 0.85; field fill 50% at rest and 15% on focus; black outer border; primary inline stroke; secondary focus outline at 65% border width with zero offset; primary caret; row-fill width; zero split internal gap; 4px external spacing unit; clipping rather than ellipsis; flat interaction defaults.

The token file declares five explicit tiers:

| Tier | Height | Stroke | Radius | Font/icon size | Text stroke | Focus outline |
|---|---:|---:|---:|---:|---:|---:|
| Supreme | 60px | 3px | 6px | 52px | 1px | 1.95px |
| Standard | 44px | 3px | 6px | 38px | 1px | 1.95px |
| Compact | 28px | 2px | 4px | 24px | 0.5px | 1.3px |
| Mini | 20px | 1.5px | 3px | 17.5px | 0.4px | 0.975px |
| Micro | 12px | 1.5px | 3px | 10px | 0.4px | 0.975px |

Textarea/multiline is a real exception bundle: separate type sizes (Supreme computed from a ratio; Standard 18px; Compact 14px; Mini 17.5px; Micro 10px), tier-specific glyph stroke, minimum height 92px, line-height 0.85, left text alignment and vertical resize. Vertical word toggles have content-driven height instead of fixed tier height. These must be recorded as scoped API/geometry exceptions rather than repeated as global defaults.

The explicit width allow-list in `STUDIO_CONTROL_EXCEPTIONS` is `spectrumTag`, `closeableBadge`, `wordToggle`, and `tagEditorTag`. Any additional `fit-content`, max-content, fixed-width, or intrinsic-width production cases need classification: approved exception, composition-level sizing, or drift.

### High-priority confirmed discrepancies

**P0 — CSS ownership and cascade are not aligned with the simplified architecture**

- `studio-control-entry.css` imports generated variables, `studio-control-system.css`, `studio-control-core.css`, split/field/motion/parity styles, then `studio-control-distill-overrides.css` and `studio-control-recovery-overrides.css`, followed by additional geometry files.
- The shared `studio-control-system.css` is approximately 325 KB and contains approximately 339 occurrences of `!important` and hundreds of pixel-valued declarations (the static scan found 723 declarations matching a geometry/type property with a px value). These counts are rough textual indicators, not a semantic CSS audit; many declarations may be legitimate family anatomy, but the scale requires selector-level review.
- `studio-control-distill-overrides.css` contains 68 `!important` occurrences and `studio-control-recovery-overrides.css` contains 117.
- This is in tension with the documented ownership model that treats unexplained local/late overrides as drift and the contract test note that only narrow stroke-color enforcement may use `!important`, with geometry/typography not handled by late important layers. The actual selectors and final computed winners must be classified before removal.
- `studio-control-system-2.css` was confirmed unreferenced by repository code search and absent from the active stylesheet entry. It has been removed on the Phase 3–4 branch; a regression test prevents it from returning. The similarly sized file was not assumed to be a duplicate based on its name alone.

**P0 — Public barrel, internal exports and specimen provenance need explicit reconciliation**

- The Confirmed catalog imports many controls directly from `StudioControls.tsx`, while the public `src/studio-ui/index.ts` barrel exposes a narrower/different set. Catalog provenance currently proves a production-module import but does not necessarily prove the primitive is part of the intended public API.
- The inventory must add an explicit `publicExport` status and distinguish public API specimens from internal production building blocks.
- `StudioSplitTextInput` correctly has a dedicated module and CSS import, and is separately imported by the Confirmed catalog. Its internal composition uses the simple `StudioTextInput` plus split badge primitives. The catalog must describe this composition accurately and test the outer border/inner field boundary at each supported size.

**P1 — Catalog counts do not prove completeness or accurate exceptions**

- 49 `Family` blocks and 49 settings blocks are not enough to establish that all exports or all real deviations are documented.
- Several titles repeat or overlap (e.g. switches/choices, collapsing modules, creator settings, answer summary). Each occurrence must be identified as a canonical primitive, anatomy illustration, state example, or duplicate.
- The family settings strings must be checked against actual props, defaults, conditional branches and CSS. A settings block may currently omit an inline value, legacy selector, special focus/disabled treatment or unsupported tier.
- A representative may use a real component yet still fail to show all supported states or sizes. Source import, API correctness, and visual certification are separate statuses.

**P1 — Global size claims and family support can be confused**

- Global tokens define five tiers, but individual APIs narrow them. The Confirmed catalog currently labels some families as five-size while many other families are only Standard/Compact or Standard/Compact/Micro. Both can be correct if the API supports them; the copy must reflect the per-family type and tested behavior.
- `ConfirmedSpecimenGrid` omits Mini in its type while the shared tier contract includes Mini. This is a concrete documentation/type mismatch to resolve.
- Dropdown, split dropdown, multi-select and legacy simple dropdown need to be classified by exported component and actual API; visually similar menu specimens should not imply a single implementation if they use different production modules.
- Closeable badge, spectrum tag and tag-editor tag are registered content-width exceptions; their fixed geometry and motion must be called out as explicit family exceptions rather than silently presented as ordinary tiered controls.

**P1 — Existing tests are source-string contracts, not a complete proof of runtime behavior**

- `studio-control-contract.test.ts` checks token values, expected selector fragments, CSS import content, some exception presence, and specific source text. These tests provide valuable guardrails but can pass even when another later selector overrides the intended style.
- Catalog tests assert the presence of selected titles/imports and CSS snippets. They do not establish that every public export has exactly one representative or that every override has a registry entry.
- Need browser/computed-style checks for cascade winners, field rest/focus colors, split rail/divider geometry, supported tier parity, dropdown open states, responsive behavior and portaled overlays.
- Tests should be extended with inventory reconciliation and exception coverage after a stable machine-readable manifest exists.

### Known exception candidates to validate individually

1. Five-tier size token ladder and family-specific size subsets.
2. Text input/textarea state styling; textarea typography/line-height/minimum height; TextBox distinct glyph color contract.
3. Split-left/right/double rails, square rail sizing, label centering, single/double divider count, flush internal seams.
4. StudioSplitTextInput’s badge-owned perimeter and inner simple field composition.
5. Dropdown chevron rail sizes, secondary rail fill and split icon fill.
6. Double-split slider rail/center/handle geometry and reversed state.
7. Counters, word counters and word sliders with stateful labels/numeric rails.
8. Vertical word toggle’s content-driven height.
9. Spectrum tags, closeable badges and tag-editor tags with content-width behavior and motion.
10. LED badge/tab modes, animations, reduced-motion behavior and tone variants.
11. Split accordion’s supported sizes/layouts, default selection and keyboard behavior.
12. InterModule/collapsing modules’ header/body borders, full-bleed composition and compact variants.
13. Upload frame’s nested border layers and animation geometry.
14. ToolBox/SubToolbox shell dimensions, which are separate from control tier geometry.
15. Any remaining inline `style`, hard-coded dimensions/colors, family-level `!important`, focus override and deprecated alias found in the full source scan.

These are candidates based on current source and canonical contracts; each must be confirmed by symbol/selector tracing before the final exception registry is edited.

## Discrepancy register and disposition

| ID | Finding | Severity | Required disposition |
|---|---|---|---|
| AUD-001 | Active confirmed catalog and legacy/migration catalog surfaces coexist | Critical | Define active/frozen/retirement status and ownership; preserve comparison behavior until routes are traced |
| AUD-002 | Large late override layers conflict with simplified token/ownership contract | Critical | Map import order and winning selectors; remove/reduce only after behavior is protected by tests |
| AUD-003 | Token tier inventory and `ConfirmedSpecimenGrid` tier type differ (Mini omitted) | High | Correct type/docs or explicitly constrain component’s stated purpose |
| AUD-004 | 49 settings blocks are not mechanically reconciled against actual deviations | High | Generate exception manifest and coverage test |
| AUD-005 | Catalog directly imports internal symbols absent from the public barrel | High | Mark each symbol public/internal/deprecated/missing intentionally |
| AUD-006 | Repeated/nested family headings can be mistaken for duplicate or complete primitive coverage | High | Classify headings by primitive/specimen/anatomy/state and deduplicate only with evidence |
| AUD-007 | `studio-control-system-2.css` existed alongside the main system file without code references | Resolved | Repository code search returned zero references; removed the duplicate 325 KB stylesheet and added a regression guard |
| AUD-008 | Catalog tests mostly check strings and source fragments | Medium | Add manifest parity and browser/computed-style checks |
| AUD-009 | Family-level hard-coded dimensions and !important rules require semantic classification | High | Build selector/value inventory; register intentional exceptions and fix drift |
| AUD-010 | Catalog integration note explicitly says browser certification remains pending for ConfirmedSpecimenGrid | Medium | Record browser evidence separately from source/test certification |

## Phase 2 disposition

The baseline and source inventory establish the contracts and the concrete drift candidates above. No CSS or component behavior has been altered in Phases 0–2. This is intentional: removing cascade rules before tracing final winners risks regressions. The next implementation phase should start with AUD-001 through AUD-005, then proceed family-by-family with regression tests and browser evidence.

## Phase 3 — Initial implementation progress (2026-10-29)

Phase 3 has started on this audit branch. The first low-risk corrections are committed:

- **AUD-003 addressed in source:** `ConfirmedSpecimenGrid` now includes Mini in both its `SpecimenTier` union and rendered tier list. This aligns the layout vocabulary with the five-tier global contract without claiming every family supports Mini.
- **Regression guard added:** `StudioHubConfirmedPrimitiveCatalog.test.ts` asserts all five tiers remain represented in the grid and token source.
- **Static audit guard added:** `scripts/audit/confirmed-catalog-coverage.mjs` now checks the five-tier parity and the catalog-ownership contract.
- **AUD-001 documentation clarified:** the Confirmed Primitive Library is named as the active audited registry. The hardcoded and migration/primitive tracks remain preserved for comparison and migration; no routes or legacy catalogs were deleted. The docs now distinguish production import provenance from public API status.
- **No production CSS or component styling was changed.** The large cascade/override findings remain intentionally open pending selector and consumer tracing.

### Phase 3 verification status

The source changes and regression checks are committed, but the repository was inspected through GitHub APIs rather than a local checkout. Therefore the focused test, TypeScript check, production build, and browser/computed-style certification have **not** been executed in this work session. The new checks must be run before treating these changes as certified. AUD-002, AUD-004, AUD-005 and the remaining inventory/cascade reconciliation remain open.

## Phase 3 — Public export reconciliation (2026-10-29, continued)

The audit has now added a repeatable public-export-to-catalog matrix:

- `scripts/audit/studio-public-export-catalog-matrix.mjs` parses value exports from `src/studio-ui/index.ts`, checks for a rendered JSX representative in the Confirmed Primitive Library, and emits each result as `rendered-representative`, `documented-exception`, or `unresolved-gap`.
- `scripts/audit/studio-public-export-catalog-matrix.test.mjs` covers named/aliased/type-only export parsing, rejects incidental import mentions as representatives, and guards a critical list of production primitives.
- Added `npm run test:studio-public-export-catalog` as the focused test + matrix command.
- Added the missing `StudioChatComposerDock` representative with inline-actions and toolbar-actions examples. The specimens are static and explicitly do not imply a live Brain connection or submission behavior.
- Documented exceptions remain for compatibility exports (`StudioInput` and lowercase legacy aliases), grid composition helpers, and the certification surface. These are recorded as exceptions rather than falsely marked as direct representatives.

### Current source-derived matrix snapshot

The current barrel/catalog source scan found **64 Studio value exports**: **53** have direct JSX representatives in the Confirmed Primitive Library and **11** are explicit documented exceptions. The scan currently reports **zero unclassified Studio value exports**. This is a static source-derived inventory, not proof that every visual representative renders correctly or that every exception is the final API decision.

### Verification boundary

I verified the source and test contents through the GitHub API and checked the export/JSX matching logic against the retrieved source text. I have **not** executed the new Node tests, TypeScript, Vite build, or browser rendering; do not treat the matrix or composer specimen as runtime-certified until CI completes and the command is run in a checkout. The audit intentionally avoids deleting legacy exports or changing global CSS cascade rules without evidence.

## Canonical references inspected

- `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`
- `src/studio-ui/index.ts`
- `src/studio-ui/tokens.ts`
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/primitives/StudioValueToggles.tsx`
- `src/studio-ui/primitives/StudioSplitTextInput.tsx`
- `src/studio-ui/primitives/studio-control-contract.test.ts`
- `src/components/ToolboxUIReferenceLibrary.tsx`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx`
- `src/components/studio-hub/ConfirmedSpecimenGrid.tsx`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.test.ts`
- `src/styles/studio-control-entry.css`
- `src/styles/studio-control-system.css`
- `src/styles/studio-control-fields.css`
- `src/styles/studio-control-distill-overrides.css`
- `src/styles/studio-control-recovery-overrides.css`



## Phase 3 — Consolidation follow-through (2026-10-29)

- The Confirmed Primitive Library remains the active audited registry; retained legacy/migration tracks are still wired into the reference-library shell and were not deleted blindly.
- The missing `StudioChatComposerDock` import is included in the branch inherited from the dedicated correction PR, so its two static catalog specimens resolve to the existing production primitive module.
- The public-export matrix remains the contract for public representative coverage. Its 11 documented exceptions are explicit decisions to review, not evidence that all exports are ideal or permanent.

## Phase 4 — Safe CSS ownership cleanup (2026-10-29)

### Removed

- Deleted `src/styles/studio-control-system-2.css` (approximately 325 KB). The active entry imported `studio-control-system.css`, not the `-2` file; repository code search found no references to the removed filename. The two files were not byte-identical, so this is recorded as removal of an unreferenced legacy alternative, not a claim that their contents were identical.
- Removed the duplicate `--vt-studio-space-unit: 4px` declaration from `studio-control-recovery-overrides.css`. The canonical system stylesheet already owns the global spacing unit; the distinct recovery bridge `--vt-field-inline-stroke` remains until its consuming selectors are migrated.
- Corrected misleading comments that described the distill/recovery layers as the final imported stylesheets. The entry imports later family sheets for side rails, component grid, counters, and split text input; comments now reflect the actual cascade order.

### Regression guards added

- `scripts/audit/studio-control-css-ownership.test.mjs` checks that all entry imports resolve, the removed system sheet stays absent, the canonical system stylesheet is imported once, token-first/family-final order is preserved, and the recovery layer does not re-declare the global spacing unit.
- `npm run test:studio-control-css-ownership` is the focused command for this guard.

### Important declaration policy

No blanket removal of `!important` declarations was performed. The recovery layer still contains high-specificity geometry and field-state rules that may currently be necessary to beat legacy selectors. Removing them without selector-winner analysis and rendered regression tests would risk reintroducing the split-rail, field focus, and double-border defects this contract is intended to prevent. Phase 4 removes only the proven dead stylesheet and duplicate global token declaration in this pass; remaining `!important` occurrences require selector-level ownership migration, not count-based deletion.

### Verification boundary

The edits are committed to the Phase 3–4 branch, but the new Node test, existing Studio Controls suite, token emitter consistency check, TypeScript, production build, and browser/computed-style certification have not been run from a checkout in this session. Do not mark visual/runtime certification complete until those checks pass. The Vercel deployment checks previously reported the account's deployment-rate limit, which is separate from application test evidence.
