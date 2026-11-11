# Studio Design Intelligence, Source Map & Primitive Registry

**Status:** Branch-audited foundation; implementation inventory remains source-backed  
**Target ref:** `fix/studio-controls-regression-recovery-2026-10-31`  
**Audited:** 2026-11-11  
**Scope:** Studio design-system authority discovery, source precedence, primitive registry ownership, provenance, and change-impact handoffs.

> This document maps existing authority. It does not create a second token system, duplicate primitive implementation, shadow registry, or substitute for production code/tests. If this map and current executable evidence disagree, report the drift and update this map only after the owning source is reconciled.

## Completion status

| Phase | Outcome | Status |
|---|---|---|
| 1. Design Intelligence | Establish authority order, interpret the current contract, identify drift and unresolved conflicts. | **Complete — source-audited** |
| 2. Source-of-Truth Discovery | Verify exact branch paths for the design contract, tokens, generator, generated CSS, CSS entry, primitives, exports, catalog, and tests. | **Complete — source map recorded** |
| 3. Universal Primitive Registry | Reuse the Confirmed Primitive Library as the canonical production specimen/provenance registry; define required registry metadata and category rules. | **Foundation complete — consumer/API completeness is still a rolling audit, not falsely certified** |

The third phase is deliberately not called fully certified: the catalog and barrel are inspectable, but a complete per-symbol consumer graph and rendered verification matrix require ongoing source/test/browser evidence.

## Authority order

Resolve Studio questions in this order:

1. **Current executable source and tests on the selected ref** — actual behavior, token values, exports, stylesheet imports, and contract tests.
2. **Normative Studio requirements** — `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` for global defaults, size semantics, exceptions, and field/split contracts.
3. **Confirmed catalog authority** — `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` for catalog ownership, category taxonomy, provenance, specimens, and catalog-only presentation.
4. **Authoring guide** — `docs/ui/STUDIO_CONTROLS_AUTHORING_GUIDE.md` for implementation workflow and ownership boundaries.
5. **Historical plans, handoffs, and screenshots** — evidence/prior art only; never silently promote them over current source or normative contracts.

A filename or branch label does not make a document authoritative. Confirm its scope and current implementation before relying on it.

## Verified source map

The following paths were fetched from `fix/studio-controls-regression-recovery-2026-10-31` during this audit.

| Concern | Canonical path | Ownership |
|---|---|---|
| Global Studio tokens and field defaults | `src/studio-ui/tokens.ts` | TypeScript token authority; includes explicit five-tier size base and shared color/focus roles |
| Token-to-CSS generator | `scripts/emit-studio-control-vars.mjs` | Generates CSS variables from TypeScript tokens |
| Generated variables | `src/styles/studio-control-vars.generated.css` | Generated output; edit through the generator |
| Studio CSS entry | `src/styles/studio-control-entry.css` | Imports generated vars, shared system/core, family styles, and remaining recovery/parity layers |
| Shared control rules | `src/styles/studio-control-system.css` | Shared control geometry, color roles, and baseline behavior |
| Field rules | `src/styles/studio-control-fields.css`, `src/styles/studio-text-input.css` | Editable-field states and persistent inset treatment |
| Split rules | `src/styles/studio-control-split.css` | Shared split anatomy and rails |
| Main primitive module | `src/studio-ui/primitives/StudioControls.tsx` | Main Studio primitive APIs and shared split shell |
| Text input primitive | `src/studio-ui/primitives/StudioTextInput.tsx` | Simple, floating-label, and fixed-label single-line input API |
| Textarea primitive | `src/studio-ui/primitives/StudioTextArea.tsx` | Simple, floating-label, and fixed-label multiline API |
| Value toggles and double-split word counter | `src/studio-ui/primitives/StudioValueToggles.tsx` | Arrow/side/double-side/bar toggle family and shared counter variant |
| Standalone primitive modules | `src/studio-ui/primitives/StudioSplitTextInput.tsx`, `StudioSplitAccordion.tsx`, `StudioDropdown.tsx`, `StudioComponentGrid.tsx`, `StudioCalendarPrimitives.tsx`, `StudioInterModule.tsx`, `StudioResponseMetaRow.tsx`, `StudioLedBadgeTab.tsx`, `StudioChatComposerDock.tsx`, `StudioChatResponseShell.tsx` | Dedicated modules where the family is intentionally separate |
| Public export surface | `src/studio-ui/index.ts` | Public barrel; a catalog import alone does not prove public API status |
| Confirmed production specimens and provenance | `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` | Active catalog registry and rendered specimens |
| Catalog disclosure primitives | `src/components/studio-hub/ConfirmedCatalogModules.tsx` | Family/primitive disclosure shells only; not a primitive registry |
| Normative defaults and exceptions | `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` | Global requirements and named exceptions |
| Component-library authority | `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` | Catalog taxonomy, ownership, and presentation rules |
| Authoring workflow | `docs/ui/STUDIO_CONTROLS_AUTHORING_GUIDE.md` | Implementation boundaries and completion checklist |
| Token/contract tests | `src/studio-ui/primitives/studio-control-contract.test.ts` | Size, split, and focus contract checks |
| Catalog and cross-component governance | `src/components/SubToolboxDesignGovernance.test.ts` and catalog-focused tests | Ownership, integration, and catalog invariants |

### CSS ownership finding

The audited branch's `studio-control-entry.css` imports `studio-control-system.css` and `studio-control-core.css`, then split/field/motion/parity styles and the files `studio-control-distill-overrides.css` and `studio-control-recovery-overrides.css`, followed by side-rail, component-grid, word-counter, and final text-input styles. This is observed branch state, not an endorsement of indefinite override stacking. Any cleanup must trace each rule to its owning layer, preserve behavior, and remove superseded rules with regression coverage; do not add another late override to this chain.

## Contract snapshot used by the registry

The branch's TypeScript token source defines five explicit tiers:

| Tier | Height | Stroke | Radius | Type/icon |
|---|---:|---:|---:|---:|
| Supreme | 60px | 3px | 6px | 52px |
| Standard | 44px | 3px | 6px | 38px |
| Compact | 28px | 2px | 4px | 24px |
| Mini | 20px | 1.5px | 3px | 17.5px |
| Micro | 12px | 1px | 2px | 10px |

The token module also records primary/secondary color roles, 50% primary field fill at rest, 15% primary field fill on focus, primary text/glyph at rest, black text/glyph on focus, persistent primary inset, and a secondary focus outline at 65% of border width with zero offset. The family API may narrow supported tiers; never infer support from the global ladder alone.

The audited `StudioTextInput` API supports `simple`, `floating-label`, and `fixed-label` presentations. The textarea has corresponding presentation modes but explicitly excludes Micro because of its minimum writing-surface geometry. Keep these family constraints in the registry rather than claiming every family supports every tier.

## Universal Primitive Registry ownership

**Canonical registry:** `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`.

The Confirmed catalog is the active production specimen/provenance registry. `src/components/ToolboxUIReferenceLibrary.tsx` remains its shell/route selector; it must not become a second primitive-definition registry. The Complete, Migration, hardcoded, and primitive tracks are comparison/migration surfaces only where still routed. Do not delete them until their routes, users, and dependencies are traced and tested.

The registry is a source-backed catalog, not a new data store. Its records are represented by production imports, family specimens, and provenance declarations. Each family record must retain:

- Canonical family/category and a unique canonical representative.
- Production symbol and exact source module.
- Owning stylesheet and token/generator authority.
- Known importing/consumer paths; unknown consumers must be marked unknown, not guessed.
- Public API classification: `public`, `internal-only`, `deprecated`, or `intentionally-unexported`, checked against `src/studio-ui/index.ts`.
- Supported sizes and variants verified from the actual prop type/implementation.
- States and interaction/accessibility contract.
- Only true non-default settings and registered exceptions.
- Source/test certification status and separate visual certification evidence.
- Last-audited ref and evidence links/paths.

### Canonical category taxonomy

Use exactly these six parent categories, in this order:

1. **Text Fields** — native inputs, textareas, text boxes, number inputs, identity/search/split fields, and compatibility field exports.
2. **Buttons & Badges** — action/split/icon buttons, Play/Pause, badges, and status/navigation badge families.
3. **Dropdowns** — single-select, split-left, multi-select, triggers, option/menu rows, chevrons, and menu states.
4. **Controls** — counters, word counters, sliders, word sliders, arrow/side/double-side/bar toggles, switches, radios, and checkboxes.
5. **Modules & Frames** — structural modules, InterModules, collapsing modules, accordions, and upload frames.
6. **Compositions** — assembled experiences such as Tag Editor, Publishing Card, Primitive Grid, Spectrum Tags, chat/composer layouts, and composition-only helpers.

Counters and sliders are controls, never a separate category. Dropdown menus stay under Dropdowns. Compositions are assembled experiences, not a fallback for unknown primitives. Unclassified families must be surfaced as actionable warnings rather than silently grouped.

### Source-observed family coverage

The Confirmed catalog currently imports and renders specimens from the following production modules. This is a source inventory, not a claim that every imported symbol is public or fully visually certified.

| Source module | Cataloged family coverage |
|---|---|
| `StudioControls.tsx` | Buttons, two-line/action/split buttons, input compatibility exports, switches/radios/checkboxes, badges, dropdowns, counters, sliders, word controls, icon buttons/groups, modules, Play/Pause, upload frame, tags, and global exceptions |
| `StudioValueToggles.tsx` | Arrow, side, double-side, and bar toggles; double-split word counter |
| `StudioTextInput.tsx` | Canonical single-line text input |
| `StudioTextArea.tsx` | Canonical multiline textarea |
| `StudioSplitTextInput.tsx` | Split text input |
| `StudioSplitAccordion.tsx` | Split accordion |
| `StudioDropdown.tsx` | Dropdown |
| `StudioComponentGrid.tsx` | Component grid composition primitive |
| `StudioCalendarPrimitives.tsx` | Calendar event chips, multi-day bars, thumbnail chips, and media rail |
| `StudioInterModule.tsx` | InterModule and two-line InterModule |
| `StudioResponseMetaRow.tsx` | Response metadata row |
| `StudioLedBadgeTab.tsx` | LED badge tab |
| `StudioChatComposerDock.tsx` | Chat composer dock |
| `StudioChatResponseShell.tsx` | Chat response shell |
| `StudioPublishingCard.tsx` | Publishing-card composition |

### Registry update protocol

When adding or changing a primitive:

1. Search the Confirmed catalog, production modules, and public barrel before creating anything.
2. Reuse the existing semantic primitive when it matches; add a dedicated module only for a genuinely separate family.
3. Verify prop types and implementation before recording supported sizes, variants, states, or accessibility claims.
4. Add/update the production specimen and provenance in the Confirmed catalog; never build a catalog-only visual clone.
5. Check `src/studio-ui/index.ts` and record public/internal/deprecated status explicitly.
6. Trace consumers with repository search; record exact paths and mark incomplete coverage honestly.
7. Update the owning normative document only when a user-approved contract changes; do not rewrite requirements to match a regression.
8. Add/update focused source/API tests. Source certification and browser visual certification are separate statuses.
9. Run focused tests, typecheck, and build using the commands in `package.json`; record exact commands and outcomes.
10. Remove obsolete catalog entries only after route/consumer/migration coverage proves they are no longer needed.

## Shared handoff contract for the first three sections

Every Design Intelligence → Source Discovery → Component Intelligence handoff carries:

- Task goal and explicit repository/ref.
- Working-tree state (`unknown` unless observed).
- Authoritative source paths and the exact revision/refs inspected.
- Contract rules applied and conflicts found.
- Primitive/family name, implementation module, CSS/token owners, export status, supported variants, and consumer paths (or explicit unknown).
- Evidence confidence and certification level.
- Proposed changes, dependencies, acceptance criteria, and unresolved questions.

Do not infer the repository commit SHA from a file blob SHA. Do not call source inspection a visual audit. Do not claim tests/build/browser verification unless those checks were actually executed.

## Known gaps and next acceptance work

- A complete consumer graph for every cataloged symbol has not been established by this source-map pass.
- Every catalog import still needs explicit public/internal/deprecated classification against the export barrel.
- The Confirmed catalog's provenance coverage must be checked family by family; a shared source import is not sufficient evidence of complete metadata.
- The CSS entry still contains multiple recovery/parity layers whose ownership and removal candidates need a separate rule-level audit.
- Visual certification remains separate and requires browser/computed-style evidence at supported tiers and states.

These gaps are visible work items, not hidden assumptions. The first three phases establish the authority and registry framework so the next audits can be evidence-backed and non-duplicative.
