# Studio Controls System Audit & Representative Library Completion

**Date:** 2026-10-30  
**Target branch:** `master/consolidated-feature-integration`  
**Mode:** Read-only audit and planning first; implementation is a separately gated follow-on.  
**Scope:** The complete Studio Controls system and all related source under `src/studio-ui/`, `src/styles/`, and `src/components/`, with supporting scripts, tests, docs, imports, and generated artifacts.

## Objective

Establish an evidence-backed inventory of every production Studio primitive, family, composition, public/internal export, supported setting, size tier, variant, and meaningful state. Reconcile the production implementation with the canonical token/style hierarchy and ensure the active **Confirmed Primitive Library** has one canonical representative for every eligible primitive and explicit specimens for every supported design variant/state that users need to compare.

The library must remain a showcase of real production exports—not a parallel implementation or a second registry. The work must identify both directions of drift: implemented capabilities missing from the library, and catalog entries that are stale, duplicate, misleading, unsupported, or disconnected from production.

## Existing authority and constraints

- Target branch is `master/consolidated-feature-integration`; preserve landed work and inspect its current HEAD and working tree before any edits.
- The repository is the source of truth. Read the current versions of:
  - `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md`
  - `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`
  - `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
  - `docs/ui/STUDIO_HUB_COMPONENT_IMPORT_INVENTORY_AUDIT.md`
  - the current Studio Controls authoring guide, palette/theme source, relevant architecture docs, tests, and generated-artifact instructions.
- The current documented active catalog is `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`. `src/components/ToolboxUIReferenceLibrary.tsx` owns the shell and route/track selector, not a competing primitive registry. Confirm these facts on the checked-out target branch before relying on them.
- The canonical six parent categories, in order, are **Text Fields**, **Buttons & Badges**, **Dropdowns**, **Controls**, **Modules & Frames**, and **Compositions**. Dropdown menus/options belong under Dropdowns; counters/sliders/toggles belong under Controls; compositions are assembled experiences, not a fallback bucket.
- Every confirmed representative must identify source module, production token/stylesheet authority, importers where known, public API status, supported tiers/states/variants, and only non-default settings that actually differ from canonical defaults.
- Keep one canonical parent representative per primitive. Nested anatomy/state examples are allowed but must be labelled as variants/states of that primitive, not separate implementations.
- Preserve the established palette, token hierarchy, five size tiers, flat-shell defaults, field/split contracts, and narrow registered exceptions. Do not promote implementation drift into a new design contract.
- Generated CSS is regenerated from its canonical emitter. Never hand-edit generated output.
- No Codespaces. Do not edit production code during the audit-only phases. Do not remove legacy tracks until routes, consumers, and migration dependencies are traced and tested.

## Existing work reconciliation and 2026-10-30 refresh

This is a continuation audit, not a restart. The target branch already contains substantial Studio Controls audit work:

- `docs/ui/STUDIO_CONTROLS_PHASE_0_1_2_AUDIT.md` records the 2026-10-29 source audit, its AUD-001 through AUD-010 discrepancy register, and subsequent Phase 3–6 source/catalog changes.
- `tasks/p1-canonical-system-integration/workstreams/studio-controls/audit-checklist.md` remains the P1 workstream checklist. It is still marked NOT RUN as a complete visual/runtime audit; do not treat this new plan as a replacement status authority.
- Existing machine checks include `scripts/audit/studio-hub-component-import-inventory.mjs`, `scripts/audit/studio-public-export-catalog-matrix.mjs`, `scripts/audit/confirmed-catalog-coverage.mjs`, and CSS/token/field/split/counter/dropdown-specific tests. Reuse and strengthen them rather than creating parallel audit utilities.
- Existing catalog shell code confirms three routed tracks: hardcoded, primitive, and confirmed. The active confirmed catalog is imported from `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`; legacy tracks remain live comparison/migration surfaces and must be traced before retirement.
- The prior source report is a historical snapshot. Its 49-family and 64-public-export figures are not current counts and must not be repeated without refresh.

**Current remote-source snapshot (2026-10-30, target branch HEAD `aa472be1b9bd7561fcfc1d8c97db4a420e410feb`):**

| Inventory | Observed result | Evidence boundary |
|---|---:|---|
| `src/studio-ui/` | 64 tracked tree entries | Recursive Git tree; includes source, tests, CSS, and nested folders |
| `src/styles/` | 45 tracked entries | Recursive Git tree; includes non-Studio styles and tests |
| `src/components/` | 416 tracked entries | Full recursive scope; not all are Studio-related |
| Studio-named/catalog/subtoolbox candidate paths | 72 | Filename/directory heuristic only; not a complete reachability classification |
| Studio public-barrel value exports matching `Studio*` | 70 | Static export extraction from `src/studio-ui/index.ts` |
| Those exports with a direct JSX/component-map match in Confirmed catalog | 70/70 | Static source match only; does not prove exactly-once visible runtime rendering or variant completeness |
| Confirmed catalog `<Family>` blocks | 48 | Static source count |
| Confirmed catalog `<Provenance>` blocks | 48 | Static source count |
| Confirmed catalog `nonDefaultSettings` blocks | 48 | Static source count |

**New findings / open questions from the refresh:**

1. A second, root-level `src/components/StudioHubConfirmedPrimitiveCatalog.tsx` (about 166 KB) coexists with the documented active `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` (about 185 KB). This is a duplicate-catalog candidate, not yet proven dead. Trace every import, route, dynamic reference, test, and build inclusion before classifying it.
2. `docs/ui/STUDIO_CONTROLS_AUTHORING_GUIDE.md` contains legacy guidance that conflicts with the newer hierarchy/token contract (for example, it specifies 32px standard type while the hierarchy and size contract specify 38px; it also overstates a single-file implementation owner despite dedicated primitive modules). Treat as stale documentation candidate; reconcile the full guide before editing.
3. The active Confirmed catalog's family/provenance/settings counts are now 48, not the 49 recorded in the 2026-10-29 audit snapshot. Identify the removed/reorganized block and update the audit snapshot only after the exact diff and intent are understood.
4. The current source-level export/catalog matrix has 70/70 matches, but it does not prove every eligible primitive has exactly one canonical visible representative, nor that all prop variants, supported size subsets, menu states, disabled/focus/selected states, and interaction paths are shown.
5. The active stylesheet entry imports generated vars, a very large shared system sheet, core, split, fields, motion, parity, distill and recovery layers, then family sheets. This is a deliberate ordered cascade today; remaining `!important` and recovery declarations require selector-winner and consumer analysis, not count-based deletion.
6. The repository's remote GitHub API does not expose local uncommitted working-tree state or execute local tests/browser capture. Phase 0 and all later runtime/visual claims remain bounded by that limitation until a real checkout/browser session is available.

**Continuation rule:** Phase 1 refresh should close only the remaining file/import/consumer classification gaps. Reuse the existing Phase 0–6 audit, test suite, and P1 checklist as prior art. Do not create a second registry, duplicate inventory generator, or competing task-status ledger.

## Phase 1 interim findings — 2026-10-30

The following are evidence-backed source findings, not yet runtime-certified defects. Keep their status open until import/reachability and browser verification are complete.

| ID | Finding | Initial priority | Evidence / next check |
|---|---|---|---|
| AUD-011 | A second root-level `src/components/StudioHubConfirmedPrimitiveCatalog.tsx` (165,587 bytes) coexists with the active nested catalog (184,924 bytes). Both define a full catalog component with the same exported name. | P1 candidate | `StudioHub.tsx` mounts `ToolboxUIReferenceLibrary`, which imports the nested file. Trace all direct/dynamic imports and tests of the root-level file before classifying it as dead or compatibility-only. |
| AUD-012 | Split Text Input has two distinct same-purpose stylesheets: `src/studio-ui/primitives/studio-split-text-input.css` (6,393 bytes) and `src/styles/studio-split-text-input.css` (5,347 bytes). The primitive imports the former; the global control entry imports the latter. Their selector sets overlap and declarations differ. | P1 | Compare exact selector/property winners and determine whether both are required; test one source owner without breaking split-left/right/double behavior. No deletion before consumer and visual proof. |
| AUD-013 | The authoring guide is stale against the current hierarchy/tokens and dedicated primitive modules. It specifies Standard 32px and Compact 14px typography while current tokens specify 38px and 24px; it says all new visual rules belong in `studio-control-system.css`, while current dedicated modules import family stylesheets. | P2 | Reconcile the complete guide with actual module/style ownership and the three current Studio authorities before editing. |
| AUD-014 | The active catalog classifier ends with `return "Compositions"` for unrecognized valid elements. The source-of-truth contract says an unrecognized primitive must not silently fall back to Compositions. | P1 candidate | Verify every current child is classified intentionally; add an explicit unknown-family failure path and a regression test if no product exception exists. |
| AUD-015 | `scripts/audit/confirmed-catalog-coverage.mjs` checks for the literal strings `Unclassified family` and `Add an explicit category rule`, but neither appears in the current active catalog source. The script is not wired into the current package scripts shown on this branch. | P2 | Determine whether this is obsolete audit tooling or a broken guard; either repair and register it or retire it through the repository's no-loss process. |
| AUD-016 | The public export matrix checks presence, not one canonical specimen or variant completeness. Current source scan finds 70/70 public Studio value exports with at least one direct catalog match, but 396 JSX tag occurrences; only 20 exports occur once and 50 occur multiple times. | P1 | Distinguish canonical representative from additional variant/state specimens; map every repeated occurrence to a supported prop/API difference and ensure no duplicate independent family is implied. |

### Additional source ownership observations

- `src/studio-ui/index.ts` imports `studio-control-entry.css`, `studio-led-badge-tab.css`, and `studio-chat-composer-dock.css`.
- `StudioTextInput.tsx` also imports `studio-control-entry.css` and its dedicated `studio-text-input.css`; `StudioChatComposerDock.tsx` imports its dedicated stylesheet which is also imported by the barrel. Verify whether repeated CSS imports are intentional and how the bundler deduplicates them.
- Standalone family modules correctly own some dedicated CSS (`StudioSplitAccordion`, `StudioInterModule`, `StudioResponseMetaRow`, `StudioChatResponseShell`, `StudioPublishingCard`, and calendar primitives). The authoring guide must reflect this actual pattern rather than imposing a single giant stylesheet as the only allowed owner.
- The 70/70 export presence result is a source-level match. It does not certify runtime rendering, correct category, supported variants, default settings, accessibility, or visual correctness.

### Refined duplicate-catalog evidence

A direct comparison of both files confirms they are not mere path aliases:

| File | Lines | Bytes | Family blocks | Provenance blocks | Settings blocks |
|---|---:|---:|---:|---:|---:|
| `src/components/StudioHubConfirmedPrimitiveCatalog.tsx` | 1,616 | 165,587 | 57 | 57 | 57 |
| `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` | 1,874 | 184,389 | 48 | 48 | 48 |

The active `ToolboxUIReferenceLibrary.tsx` import points to the nested `studio-hub/` catalog. The root-level file contains a different, older family set and omits some newer nested catalog groups (including the composer, certification, compatibility exports, composition helpers, and calendar specimens). This strongly suggests a stale donor/duplicate, but it is **not yet classified as dead** because every repository call site has not been enumerated. Preserve both until zero-caller and no-loss evidence exists.

### Refined split-field style evidence

Both split-text-input stylesheets target the same `.vt-studio-split-text-input` shell and nested input selectors. They are not identical copies: the primitive-local stylesheet has additional rail/grid positioning, focus, placeholder, and pseudo-element suppression declarations; the global stylesheet has different sizing/outline/stroke declarations. The component imports the primitive-local file while the barrel's shared entry imports the global file. Both therefore enter the application CSS graph through the public Studio barrel. The final computed winner is not knowable from source order alone without the real bundler/browser graph and must be verified before consolidating either file.

### Public/internal symbol and test/catalog crosswalk

A source scan of `StudioControls.tsx` found 56 exported Studio component symbols. Forty-five of those symbols are re-exported as value components from the public barrel; eleven remain module-only:

- `StudioNumberInput`, `StudioSearchInput`, `StudioSelect`
- `StudioVerticalWordToggle`
- `StudioSplitShell`
- `StudioSimpleDropdown`, `StudioSplitLeftDropdown`
- `StudioDoubleSplitSlider`
- `StudioBrainStatusIndicator`
- `StudioInlineStepper`, `StudioSplitStepper`

Seven of the eleven have direct specimens in the active catalog. Four have no direct catalog JSX representative: `StudioSplitShell` (likely internal anatomy/helper), `StudioSimpleDropdown` (consolidation candidate), `StudioInlineStepper`, and `StudioSplitStepper`. Their lifecycle must be classified before changing the barrel or catalog.

**AUD-017 — Existing test/catalog/public-API contract disagreement (P1 candidate):**

- `StudioHubConfirmedInlineStepperCatalog.test.tsx` expects a rendered `StudioInlineStepper` specimen in the active catalog, but the current catalog source contains no `StudioInlineStepper` marker/tag.
- `StudioControls.test.tsx` expects `StudioSplitStepper` and `StudioSimpleDropdown` in both the Confirmed catalog and public `src/studio-ui/index.ts`; the current catalog and barrel contain neither.
- Both test files are included by the repository's `test:studio-controls` script. This is a deterministic source-contract mismatch and is likely to fail the focused suite, but no test process was executed in this remote-only audit.
- Do not blindly restore `StudioSimpleDropdown`: prior product direction was to consolidate the simple dropdown into `StudioDropdown`. Reconcile/update obsolete assertions if that consolidation is still the active decision. Independently decide whether Inline/Split Stepper are current user-facing controls, internal-only helpers, or retired; if current, add correct Controls specimens and public/internal provenance.

The public barrel coverage matrix is therefore necessary but insufficient: it ignores module-exported internal components and does not reconcile stale tests against the current API/catalog contract.

### Category classifier refinement

The current additional-family section contains 11 titled family modules. Three known families are assigned to Compositions only because the classifier's final fallback returns `"Compositions"`:

- `StudioChatComposerDock · Message Composer Layout`
- `Studio Hub Certification · Full Composition`
- `Composition Helpers · Standard`

These are legitimate composition-like entries today, but their category must be explicit. The fallback is unsafe for future unknown primitive families and conflicts with the source-of-truth rule that unclassified families must not be silently treated as Compositions. Add explicit rules for known composition families, then fail closed on unknown names. Preserve the separate full-width `ConfirmedDirectPrimitiveRows` ledger while determining whether its baseline specimens duplicate the canonical family representatives or are intentional baseline examples.

### Git-history refresh

- The root-level duplicate catalog's latest path commit is 2026-10-27 (`1153ece9`, import-path correction); the nested active catalog has continued receiving family/catalog updates through 2026-10-30 (`acb8be13`). This supports the stale-donor hypothesis but still does not prove zero callers.
- Both split-text-input stylesheets received independent edits on 2026-10-29. The local primitive stylesheet was replaced with a single-perimeter layout at 23:35Z; the global stylesheet was separately repaired at 20:06Z. Their overlap therefore needs a deliberate ownership decision, not a blind delete.
- The authoring guide's last path changes are from 2026-10-19, while the token/catalog implementation has moved materially since then.

## Audit dimensions

1. **Repository and ownership:** target ref/commit, dirty state, instructions, app entry points, active catalog, style import graph, ownership of each file.
2. **Implementation discovery:** enumerate components, primitive exports, local exports, family modules, compositions, helpers, CSS modules/stylesheets, tokens, theme variables, scripts, tests, stories/fixtures, and generated artifacts.
3. **Reachability and status:** distinguish production-used, public-exported, internal-only, deprecated, compatibility-only, dead/unreferenced, test-only, and unknown. An export or file alone is not proof of a shipped primitive.
4. **Contract coverage:** for each family, record anatomy, API/settings, default and non-default behavior, supported size tiers, variants, visual states, interaction states, accessibility semantics, responsive constraints, and registered exceptions.
5. **Style ownership and cascade:** trace token → emitter/generated output → shared CSS → family CSS → primitive → consumer → specimen. Detect duplicated declarations, hard-coded values, unexplained `!important`, selector leakage, obsolete recovery rules, local geometry, conflicting import order, missing theme mappings, and orphan styles.
6. **Catalog completeness and truthfulness:** verify each representative imports the real production implementation; catalog CSS controls arrangement only; every eligible production primitive has one canonical representative; every supported variant/state is accurately represented; unsupported settings/tiers are not advertised; category taxonomy and ordering are correct.
7. **Runtime and visual quality:** verify actual rendered behavior, computed styles, responsive layouts, focus/keyboard/touch behavior, reduced motion, overflow, and theme switching. Source inspection and unit tests alone do not count as visual certification.
8. **Bidirectional UI coverage:** code-to-library (missing specimens) and library-to-code (stale, duplicate, misleading, or broken specimens).

## Deliverables

- A source-backed inventory of all relevant files and their ownership.
- A primitive/family registry matrix with canonical implementation, export status, consumers, category, settings, size support, variants, states, tests, and catalog representative.
- A token/style/cascade contradiction matrix with authority and recommended owner for each discrepancy.
- A code-to-library and library-to-code coverage report with statuses: `MISSING_UI`, `PARTIAL_UI`, `STALE_UI`, `BROKEN_WIRING`, `MISLEADING_UI`, `DUPLICATE_UI`, `COVERED`, or `UNVERIFIED`.
- A prioritized findings report (P0–P3), including evidence, impact, exact locations, and verification gaps.
- An implementation backlog split into small, dependency-ordered slices.
- After approved implementation: synchronized source-of-truth docs, exception index, import inventory, tests, generated CSS, and Confirmed Primitive Library specimens.

## Phases and tasks

### Phase 0 — Establish target and preserve work

- [ ] Confirm repository identity, target branch/HEAD, working tree state, repository instructions, build/test commands, and available browser/screenshot tooling.
- [ ] Confirm the active catalog and all routed legacy/comparison tracks; identify their consumers before proposing cleanup.
- [ ] Read the current canonical Studio docs, authoring guide, palette/theme source, token emitter, test conventions, and prior import-inventory output.

**Gate 0:** Audit uses one explicit target ref; no user changes are overwritten; no source-of-truth path is assumed without checking.

### Phase 1 — Build the complete file and dependency inventory

- [ ] Enumerate all relevant files under `src/studio-ui/`, `src/styles/`, and `src/components/`; include nested directories and extension variants.
- [ ] Trace Studio imports/exports from app entry points, catalog shell, active confirmed catalog, family components, consumer pages, and test fixtures.
- [ ] Inventory CSS imports and cascade order, including global styles, family styles, catalog styles, conditional imports, compatibility/recovery files, and generated CSS.
- [ ] Inventory token definitions, theme/palette mappings, emitters, generated outputs, and all scripts that mutate or validate Studio styles.
- [ ] Classify each file by owner and lifecycle: canonical production, consumer/composition, catalog-only, generated, test/fixture, compatibility, deprecated, or unknown.

**Gate 1:** Every in-scope file is accounted for or explicitly listed as an unresolved discovery gap; the import/style dependency graph is reproducible.

### Phase 2 — Build the production primitive and variant registry

- [ ] Extract all named React components and exported symbols from Studio UI and related components; reconcile named exports, barrel exports, default exports, aliases, and compatibility exports.
- [ ] Trace each candidate to real production call sites and determine public API status and lifecycle.
- [ ] Group components into the six canonical categories and identify genuine compositions separately from primitives and structural modules.
- [ ] For every family, record supported size tiers, settings, visual variants, interaction states, anatomy, responsive limits, accessibility semantics, and exceptions.
- [ ] Identify duplicate implementations, wrappers that fork behavior, aliases that obscure one implementation, and exports with no live consumers.

**Gate 2:** The registry distinguishes real production capabilities from dead code, fixtures, aliases, and merely exported symbols.

### Phase 3 — Audit design tokens, CSS ownership, and runtime contracts

- [ ] Compare the actual token source and theme mappings against the hierarchy and global defaults/exception index.
- [ ] Trace generated variables from emitter to output and consuming selectors; verify reproducibility without manual generated-file patches.
- [ ] Audit shared styles and each family stylesheet for conflicting geometry, color, typography, focus, motion, width, split seams, selector leakage, and import-order dependence.
- [ ] Verify the five-tier contract family by family; do not assume every family supports every tier.
- [ ] Verify fields (input, textarea, TextBox), buttons/badges, dropdowns/menus, controls, modules/frames, and compositions against their specific default/state contracts.
- [ ] Audit every exception for owner, scope, rationale, supported variants/tiers, test coverage, verification status, and exit condition when temporary.
- [ ] Mark source-confirmed behavior separately from computed-style and browser-verified behavior.

**Gate 3:** Every contradiction has evidence, authority level, narrowest correct owner, severity, and proposed resolution; ambiguous same-level conflicts remain open for a product decision.

### Phase 4 — Audit Confirmed Primitive Library completeness

- [ ] Enumerate all canonical representatives in `StudioHubConfirmedPrimitiveCatalog.tsx` and map each to the production registry.
- [ ] Verify representatives import real production exports; flag lookalike markup, local CSS reimplementations, wrappers that bypass the canonical primitive, and specimens with incorrect provenance.
- [ ] Compare registry against catalog in both directions; produce exact missing/stale/duplicate/misleading lists.
- [ ] Verify category grouping and order: Text Fields → Buttons & Badges → Dropdowns → Controls → Modules & Frames → Compositions.
- [ ] Ensure all dropdown triggers, option/menu rows, and menu states are represented under Dropdowns; all counters, word counters, sliders, word sliders, and toggle families under Controls.
- [ ] Ensure compositions such as Tag Editor, Publishing Card, Primitive Grid, Spectrum Tags, chat/composer experiences, and layout helpers remain in Compositions.
- [ ] For each canonical primitive, show one default representative plus only the additional supported variant/state specimens needed to expose real API differences; avoid duplicate independent representatives.
- [ ] Verify all non-default settings are actually non-default and all displayed size/variant choices are supported by production APIs.
- [ ] Check specimen labels, provenance, source module, stylesheet/token owner, importers, API status, size/state coverage, and catalog-only styling boundaries.

**Gate 4:** A complete crosswalk exists: every eligible production primitive maps to exactly one canonical representative; every additional specimen maps to a supported variant/state; every catalog entry maps back to live production code or is explicitly classified as legacy/unsupported.

### Phase 5 — Accessibility, responsive, performance, and visual audit

- [ ] Run the technical UI audit on the active library and representative production consumer surfaces.
- [ ] Check semantic roles/names, keyboard access, tab order, focus visibility, disabled/selected/expanded states, form labels/errors, touch targets, and reduced-motion behavior.
- [ ] Inspect desktop, tablet/narrow, mobile portrait, and mobile landscape; check clipping, horizontal overflow, rail shrinkage, label centering, menu viewport fit, and text scaling.
- [ ] Capture representative default/variant/state/theme screenshots and inspect computed styles for high-risk families.
- [ ] Check unnecessary CSS duplication, broad selectors, expensive motion/effects, import cost, and avoidable component/render overhead.
- [ ] Record visual certification only for combinations actually rendered and inspected.

**Gate 5:** Findings are evidence-backed, severity-ranked, and distinguish deterministic failures from visual judgment and unverified cases.

### Phase 6 — Findings, decisions, and implementation backlog

- [ ] Produce the file inventory, registry matrix, style contradiction matrix, catalog crosswalk, and prioritized findings.
- [ ] Separate safe mechanical fixes from contract decisions requiring approval.
- [ ] Create small implementation slices (generally 1–5 files each), ordered by token/source authority → primitive/API → production styles → catalog → docs/tests.
- [ ] Identify tasks that can be parallelized only after shared contracts and ownership are fixed.
- [ ] Present the audit and backlog for approval before modifying production code.

**Gate 6:** User reviews the evidence and approves the implementation scope; audit-only work remains read-only.

### Phase 7 — Approved implementation and library reconciliation (follow-on)

- [ ] Repair each approved issue at its canonical owner; remove obsolete declarations only after proving no live consumers and adding regression coverage.
- [ ] Regenerate generated CSS from canonical token sources.
- [ ] Add or repair canonical representatives and supported variant/state specimens in the active Confirmed catalog.
- [ ] Correct family classification and merge duplicate category/registry paths without breaking routed legacy tracks.
- [ ] Update hierarchy, component-library source-of-truth, global defaults/exception index, import inventory, and authoring guide as applicable.
- [ ] Add/adjust tests for exports, catalog registration, API support, token invariants, CSS contracts, interactions, and regression behavior.
- [ ] Run focused tests, inventory audit, typecheck/lint, production build, and the relevant browser/screenshot matrix.

**Gate 7:** No implementation is called complete until tests/build and actual visual checks pass; unresolved items are explicitly listed.

## Verification strategy

Use the repository's actual scripts discovered in Phase 0; do not invent command names. At minimum, identify and run where available:

- Studio import/component inventory audit.
- Focused primitive API and behavior tests.
- Token/emitter consistency check and generated-output diff check.
- CSS contract/computed-style tests for fields, split families, and size tiers.
- Catalog registry/category/provenance/completeness tests.
- Typecheck and lint for changed files.
- Production build.
- Browser screenshots and keyboard/interaction checks at desktop and mobile sizes.

Compare failures with the target-branch baseline and report pre-existing failures separately. No claim of visual certification without browser evidence.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Large source surface hides duplicate or orphaned styles | High | Build complete file/import/cascade inventories before proposing edits |
| Catalog looks complete but omits exported or live primitives | High | Crosswalk implementation registry and catalog in both directions |
| Catalog entries overstate public API or supported tiers | High | Trace exports, call sites, props/types, and runtime behavior |
| Old catalog tracks remain routed | High | Preserve until route and migration dependencies are tested |
| Conflicting docs encode historical decisions | High | Apply current hierarchy; label superseded notes; surface same-level conflicts |
| Generated CSS is patched manually | Medium | Verify emitter and regenerate from canonical token source |
| Visual coverage is inferred from source | High | Separate source/API, computed-style, and browser visual certification |
| Scope expands into unrelated product UI | Medium | Keep audit boundary to Studio controls and directly related consumers/styles |

## Definition of done

- Every in-scope file is inventoried and classified.
- Every real production primitive/family/composition has a lifecycle and ownership record.
- Every supported setting, tier, variant, and important state is documented accurately.
- All CSS/token/generated-output ownership paths are traced.
- Every eligible primitive has exactly one canonical representative in the active Confirmed Primitive Library.
- All extra specimens correspond to supported variants/states and are not presented as separate implementations.
- Catalog categories/order match the canonical six-category taxonomy.
- Stale, duplicate, misleading, broken, missing, and unverified entries are explicitly classified.
- Audit findings include severity, impact, evidence, and a narrow remediation owner.
- Approved fixes have regression tests, synchronized docs, regenerated artifacts, passing build/tests, and observed browser verification.


## Phase 1–2 continuation — verified test and ownership crosswalk (2026-10-30)

**Inspection ref:** `d03e28010f7a45ddaac84a3554b6eaaa3d785436` (remote source only).

### AUD-018 — Focused Studio test suite contains contradictory lifecycle assertions (P1 candidate)

The current `package.json` `test:studio-controls` command explicitly runs both `src/components/studio-hub/StudioHubConfirmedInlineStepperCatalog.test.tsx` and `src/studio-ui/primitives/StudioControls.test.tsx`. The first expects the active catalog to render a standard and compact `StudioInlineStepper`, but the active catalog currently has no `StudioInlineStepper` tag/marker. In the second test file:

- The import list imports `StudioSimpleDropdown` from `./StudioControls` and a render test instantiates it.
- Later assertions require `StudioSplitStepper` and `StudioSimpleDropdown` to exist in the catalog, implementation source, and public barrel.
- Further assertions require `StudioInlineStepper` to exist in the implementation source.
- Current `StudioControls.tsx` and `src/studio-ui/index.ts` do not export these names, and the active catalog has no matching specimens.

This is stronger than a catalog-only gap: the test file itself imports/uses an absent symbol, and several source-contract assertions conflict with the current implementation/API. The exact failing test output remains unverified because no checkout/test process was available. Do not make the tests pass by resurrecting old APIs automatically. First determine intended lifecycle for InlineStepper and SplitStepper (active, internal, or retired); reconcile SimpleDropdown with the established consolidation into StudioDropdown; then update either implementation/catalog/API or obsolete tests consistently.

### AUD-019 — Public API matrix is intentionally incomplete for module-only exports (P2)

The existing `studio-public-export-catalog-matrix.mjs` reads only `src/studio-ui/index.ts` and the active Confirmed catalog. It therefore cannot report module-only exports such as `StudioInlineStepper` / `StudioSplitStepper` in `StudioControls.tsx`, nor distinguish helpers like `StudioSplitShell` from user-facing primitives. Extend the existing matrix only after the lifecycle taxonomy is approved; do not add a second registry. The matrix's current empty `dispositions` object also means documented exceptions are not yet represented in executable source.

### AUD-020 — A legacy coverage script encodes a CSS contract that conflicts with current Studio direction (P1/P2 decision)

`scripts/audit/confirmed-catalog-coverage.mjs` contains checks for fixed geometry and several `!important` declarations, including black active bar toggles and split-text-input declarations. It also checks for unknown-family fail-closed copy that is absent from the current catalog. The script is not registered in `package.json`; meanwhile the focused suite does run newer parity, field, split, dropdown, and catalog tests. Treat the legacy script as an untrusted historical guard until each assertion is reconciled with current canonical tokens and user-approved control contracts. Do not register or run it as a release gate unchanged, and do not preserve obsolete `!important` rules solely to satisfy it.

### Verified source facts / boundaries

- The active library shell imports the nested catalog and also mounts a separate Confirmed Split Text Input catalog. This separate catalog must be included in the representative crosswalk; the 70/70 scan against the main catalog alone is not a whole-library count.
- The focused script includes dedicated component, behavior, parity, split-stepper-divider, confirmed-library-layout, CSS ownership, dropdown/counter/slider and toggle checks. This provides a test inventory, not proof that the suite passes.
- The module-only symbol inventory and all 416 `src/components/` entries remain incompletely reachability-classified. The root-level duplicate catalog still requires repository-wide call-site and dynamic-reference tracing.
- No tests, typecheck, build, computed-style capture, keyboard test, or responsive browser test were executed. GitHub source reads do not expose local dirty state or provide a runnable checkout.

**Next audit slice:** complete a component-level call-site graph (including the split-text-input secondary catalog, direct imports, lazy/dynamic references and tests), classify every module-only symbol and wrapper, then build the per-family API/variant matrix. Only after that should the existing tests/matrix be reconciled and executed in a real checkout.
