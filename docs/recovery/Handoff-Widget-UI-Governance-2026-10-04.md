# Widget UI Governance Conversation Handoff — 2026-10-04

**Status:** VERIFIED PRESERVATION / RUNTIME ALIGNMENT UNKNOWN  
**Source:** Current ChatGPT conversation  
**Canonical repository:** `viewtube-dev/viewtube`  
**Canonical branch:** `main`

## Purpose

Preserve the substantive Widget/UI governance decisions and implementation-direction discoveries from this conversation without creating a competing UI authority.

## Material knowledge preserved

### Documentation/workflow direction

The preferred ViewTube operating loop established in the conversation is:

`documentation governance → registry → architecture → task → code → verification → evidence → authority update`

Planning should guide implementation rather than become the center of work. Existing authorities, tasks, primitives, and plans should be reused/consolidated before new systems are created.

### Widget UI system

The existing Widget system already has production primitives and a UI Reference Library. The Library is intended to contain/render the actual production primitives and serve as the visual representative of the style, token, default-size, state, and responsive system used by Widgets.

The conversation rejected rebuilding the Widget primitive system or creating another Reference Library.

### Size model

The Widget size system provides **default sizes for building Widget layouts**. Components and primitives can adapt to other sizes. A contextual size is therefore not automatically an error or a new component.

### Widget change rule

For a Widget need, choose situation-dependently:

- fix the existing Widget;
- create a new Widget;
- add a variant.

### Audit classifications

The user approved exactly four:

- CANONICAL
- DRIFT
- DEFECT
- INTENTIONAL

When something is a DEFECT, the solution is situation-dependent: fix an existing primitive/component, add a variant, create a new primitive/component, correct a token/size behavior, or fix the consumer.

### Reference Library behavior

The Library should use actual production primitives/components, show canonical visual behavior, demonstrate default and representative contextual/responsive sizing, include reusable primitives/compound components/patterns, avoid becoming a gallery of every Widget's private internals, and remain a special internal/reference surface rather than a normal creator-facing Widget.

The Library validates shared primitives; it does not by itself certify every Widget.

### Audit method

A meaningful audit must inspect both source and rendered UI:

`source/code → tokens → primitive usage → composition → overrides → rendered result`

Disagreement between Library and Widget output must be investigated rather than automatically assigning authority to either side.

## Repository reconciliation

Existing canonical `docs/UI.md` owns the shared UI Reference Library, tokens, and size-system subject and was extended with these decisions.

`docs/Widgets.md` was named as the canonical Widget target by `docs/Organization.md` and `docs/Index.md` but was absent on main; it was created as the Widget-specific authority.

No destructive cleanup or superseding of historical UI artifacts was performed.

## Verified vs unknown

**Verified:** the documentation decisions above; existence of current UI/recovery authorities; canonical main as working source of truth.

**Unknown:** complete runtime alignment of all Widget consumers; exact current source paths for every primitive/token/size/CSS/Library relationship; current visual certification state of all Widgets.

## Next actions

1. Trace canonical Widget primitive sources and token/size definitions.
2. Trace UI Reference Library imports/implementations.
3. Audit representative Widget consumers.
4. Classify discrepancies CANONICAL / DRIFT / DEFECT / INTENTIONAL.
5. Implement only evidence-backed corrections.
6. Verify rendered UI and tests before claiming implementation completion.


## Source audit — 2026-10-04 22:12:28 EDT

The first source-level reconciliation pass was executed against canonical `viewtube-dev/viewtube/main` and the preserved `recovery/pre-document-system-migration-2026-10-04` snapshot.

### Result

The previously referenced runtime paths:

- `src/views/dashboard/widgets/UIReferenceLibraryWidget.tsx`
- `src/views/dashboard/widgets/WidgetPrimitives.tsx`
- `src/views/dashboard/widgets/WidgetPrimitiveExtensions.tsx`

are not present in canonical `main`. Direct fetches returned 404. A recursive repository-tree inspection also did not find matching Widget primitive, Reference Library, Dashboard-widget, or primitive-extension source paths. The preserved pre-migration snapshot likewise does not contain those implementation paths.

### Classification

This is **not yet classified as a runtime DEFECT**. It is a **CODE_STRUCTURE / RECOVERY blocker** because the authoritative runtime implementation source has not been established.

The documentation decisions remain valid as recovered design/governance knowledge, but they must not be treated as proof that the corresponding implementation exists in current `main`.

### Required next step

Recover or identify the authoritative runtime source repository/branch and establish provenance before making Widget implementation changes. Then build the source map:

`primitive sources → tokens → default sizes → primitive CSS → Reference Library → representative Widget consumers → rendered verification/tests`

Do not reconstruct production Widget code from the governance documents alone.

### Durable findings

- `FIND-20261004-WIDGET-005` — canonical main has no verifiable Widget runtime source surface.
- `FIND-20261004-WIDGET-006` — Widget governance documentation currently has no verified canonical runtime implementation backing.


## Recovered implementation source — 2026-10-04

The missing Widget runtime surface has now been located in the accessible public repository **`themotionvisual/ViewTubeBUILD`**, branch `main`. This is recovered implementation evidence, not yet a change to canonical `viewtube-dev/viewtube/main`.

Verified source owners include:

- `src/views/dashboard/WidgetPrimitives.tsx`
- `src/views/dashboard/WidgetPrimitiveExtensions.tsx`
- `src/views/dashboard/widgetPrimitiveSystem.ts`
- `src/views/dashboard/widgetPrimitiveSystem.css`
- `src/views/dashboard/widgetPrimitiveExactHeights.css`
- `src/views/dashboard/widgetPrimitiveTones.css`
- `src/views/dashboard/widgetPrimitiveVariants.css`
- `src/views/dashboard/widgetMatrixPrimitives.css`
- `src/views/dashboard/widgetMobileContract.css`
- `src/views/dashboard/widgetArchetypeResponsive.css`
- `src/views/dashboard/widgets/UIReferenceLibraryWidget.tsx`
- `src/components/ToolboxUIReferenceLibrary.tsx`
- `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- `src/styles/toolboxPalette.ts`

The recovered source's own source-code map identifies these as current production owners and explicitly says the UI Reference Library should render the same production primitives.

### First-pass source reconciliation

The recovered implementation confirms the previously documented Widget model:

`tokens/system → production primitives → Reference Library → Widget consumers`

It also provides concrete implementation evidence for:

- the 18 / 24 / 32 / 38px primitive size lattice;
- default / primary / secondary primitive tones;
- explicit primitive states;
- size tokens for height, font, radius, stroke, shadow, padding, gap, icon size and icon stroke;
- the 12-color ViewTube spectrum;
- palette-derived widget colors and shadows;
- production Widget primitive consumers;
- a Reference Library that directly imports production primitives;
- a separate Studio Hub primitive migration/reference catalog;
- automated tests around Widget primitives and Reference Library behavior.

### Critical provenance boundary

Do **not** copy this implementation into `viewtube-dev/viewtube/main` yet. The repository relationship and canonical ownership have not been established. The correct next step is repository/history/deployment reconciliation, followed by a source comparison and explicit canonical-source decision.

This supersedes the earlier statement that the Widget implementation could not be located, while preserving the earlier evidence that it was absent from the inspected `viewtube-dev/viewtube/main` and its preserved pre-migration snapshot.
