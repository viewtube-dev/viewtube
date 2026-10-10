# Studio Hub Component Foundation — Phase 1 Source Audit

**Date:** 2026-10-10  
**Repository:** `viewtube-dev/viewtube`  
**Branch:** `feature/studio-hub-component-foundation-audit`  
**Status:** Initial source audit; no production UI code changed  
**Purpose:** Establish the verified starting point for the Studio Hub frontend component foundation before changing any tool layouts.

## Executive decision

Start by auditing and certifying the existing component system, not by creating a second design system or rebuilding every toolbox independently. The current repository already has a production Toolbox/SubToolbox system and a Studio Hub component reference library. The implementation must extend and correct those sources of truth.

This is a source-based first pass. It is not a claim that every tool has been inspected, nor that live desktop/mobile rendering has been certified.

## Source files inspected

| File | What it establishes |
|---|---|
| `src/views/StudioHub.tsx` | Studio Hub page composition and the currently mounted tool modules |
| `src/components/ToolboxUIReferenceLibrary.tsx` | Reference-library shell, palette handling, and separation of hardcoded baseline examples from primitive-backed examples |
| `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` | Registered component-family names and rendered primitive examples |
| `docs/ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md` | Prior source-based finding that Studio Hub mixes canonical primitives, specialized components, and bespoke layouts |
| `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` | Ownership rules for the Studio Hub library and production primitives |

## Confirmed findings

### 1. The application already has a shared component foundation

- `StudioHub.tsx` imports and mounts existing modules including Video Publisher, Thumbnail Studio, Media Analyzer, Hook Generator, Script Architect, Actionable Tactics, Video Manager, Concept Scene Studio, community tools, Studio Publishing Cockpit, Metadata Master, the UI reference library, and Video Director.
- The right path is to inventory the actual mounted modules and their composition patterns, then migrate them in controlled waves. Do not create a parallel set of replacement toolboxes.

### 2. The UI Reference Library is an existing certification surface

- `ToolboxUIReferenceLibrary.tsx` mounts `StudioHubCompletePrimitiveCatalog` and `StudioHubPrimitiveMigrationCatalog`.
- The library explicitly distinguishes a hardcoded comparison track from a primitive-backed track. Keep the comparison track as a baseline for identifying mismatches; it must not become an alternative production component registry.
- `StudioHubCompletePrimitiveCatalog.tsx` owns the registered component-family list and rendered examples. New reusable families should be added through this canonical registry rather than added only to a page or a one-off gallery.
- Catalog-only presentation CSS must not silently become the owner of production component geometry.

### 3. Preserve the hierarchy and size contracts

The existing source-of-truth documentation establishes distinct Main Toolbox and SubToolbox levels. In particular, the documented desktop authority is Main Toolbox header 80px, 5px stroke, 16px radius, 10px shadow offset, and 26px title; SubToolbox header 56px, 4px stroke, 12px radius, 6px shadow offset, and 20px title. The documented mobile levels are also distinct. These values are an audit baseline to verify against current production tokens and CSS, not permission to override the master resource with duplicated local values.

The inspected SubToolbox stylesheet defines token-backed control sizes including micro 26px, compact 32px, standard 48px, and action 56px. Avoid changing these globally as part of a Studio Hub layout pass unless the canonical master resource, component tests, and all consumers are reconciled together.

### 4. Mixed implementation patterns are a known migration risk

The existing full UI primitive audit reports a mixture of canonical Toolbox/SubToolbox primitives, specialized domain components, a separate Studio UI control family, and bespoke inline/Tailwind styling. This is consistent with the current page's direct mounting of many independent tool modules. Each mounted tool needs a component-level audit before its layout is changed.

### 5. No production code was changed in this phase

This commit records the starting evidence and work order only. No UI has been migrated, no styles have been changed, and no tests/build or live responsive screenshots have been represented as passing.

## Initial component inventory

This is the first-pass inventory, not a complete per-file certification.

| Component/system area | Current known source | Audit action |
|---|---|---|
| Main Toolbox shell | `src/components/Toolbox.tsx` and master UI resource | Verify shell, header, geometry, responsive behavior, and current tokens |
| SubToolbox shell and controls | `src/components/subtoolbox/` and `src/styles/subtoolbox-system.css` | Inventory exported primitives and variants; compare actual CSS to master resource |
| Reference-library entry/shell | `src/components/ToolboxUIReferenceLibrary.tsx` | Preserve single entry point; inspect open/collapse and mobile behavior |
| Canonical family registry | `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` | Enumerate registered families and gaps; verify each example is backed by the intended primitive |
| Migration comparison surface | `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx` | Track hardcoded-to-canonical migration without confusing examples with production ownership |
| Shared styles/tokens | `src/styles/toolboxPalette.ts`, `src/styles/subtoolbox-system.css`, and master-resource paths | Trace token ownership and identify feature-local overrides |
| Studio Hub page composition | `src/views/StudioHub.tsx` | Inventory every mounted toolbox, shell ownership, state boundary, and responsive exception |
| Domain tool layouts | Individual `src/views/*` modules and `src/components/studio-hub/*` modules | Audit each tool before modifying it; classify reusable primitive, legitimate domain component, or bespoke geometry |

## Recommended next actions

1. **Complete the source map.** Read the current Toolbox master resource, Toolbox/SubToolbox exports, tokens, styles, tests, and all current Studio Hub imports. Record exact file paths and ownership before changing code.
2. **Build a family/variant matrix.** For each primitive, record source export, visual levels/sizes, variants, states, responsive behavior, test coverage, and current consumers. Mark each item as reuse unchanged, fix, add variant, or genuinely new.
3. **Audit the field-label gap explicitly.** Verify whether Input and TextArea support the requested right-side/inside-style label in the actual production primitive and reference library. If missing, add the variant at the canonical source and registry; do not hard-code it in Video Manager or Publisher.
4. **Use a small certification slice.** Validate the canonical Main Toolbox, SubToolbox, Input, TextArea, button/action row, and dropdown/menu on desktop and mobile before migrating full tool layouts.
5. **Choose the first pilot based on reuse and safety.** Use Video Publisher and Video Manager as the first workflow pair after the shared primitives pass certification. Share field and package components where appropriate, but preserve their different ownership of pre-publication versus live published metadata.
6. **Migrate in small, testable commits.** Keep the work on this branch; run the relevant tests and build, inspect responsive screenshots, and report failures honestly before considering a merge.

## Completion criteria for Phase 1

- [ ] Every currently mounted Studio Hub module has a recorded source path and current shell/composition pattern.
- [ ] The master UI resource and its linked implementation sources have been reconciled with live tokens/CSS.
- [ ] The canonical primitive exports and family registry have a family/variant matrix.
- [ ] Missing versus existing variants are evidenced from source and tests, not guessed from a mockup.
- [ ] Known hard-coded overrides are listed with their owning file and migration target.
- [ ] Desktop and mobile baseline captures are obtained before visual migration.
- [ ] No production behavior or published metadata workflow is changed by the audit itself.

## Source links

- [Studio Hub page](../../src/views/StudioHub.tsx)
- [Toolbox UI Reference Library](../../src/components/ToolboxUIReferenceLibrary.tsx)
- [Complete Primitive Catalog](../../src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx)
- [Existing full primitive audit](../ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md)
- [Component Library source of truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md)
- [Studio Hub frontend layout implementation plan](./VIEWTUBE_STUDIO_HUB_FRONTEND_COMPONENT_LAYOUT_IMPLEMENTATION_PLAN_2026-10-10.md)


## Follow-up source check: inside-field labels already exist

A targeted inspection of `src/components/subtoolbox/SubToolboxPrimitives.tsx` found both `SubToolboxLabeledInput` and `SubToolboxLabeledTextArea`, each accepting an `overlayLabel` and rendering the canonical input/textarea primitive beneath it. The matching CSS lives in `src/styles/subtoolbox-system.css` under `.vt-subtoolbox-labeled-field` and `.vt-subtoolbox-labeled-field-overlay`; it places the label on the right side of the field and positions it near the top for a textarea.

**Decision:** Do not create a duplicate label primitive. The remaining audit task is to verify these existing variants are registered and shown correctly in the component reference library, inspect their actual sizing/contrast/placeholder behavior at each supported level, and check their use in Video Manager and Video Publisher. If a missing requirement is only a styling or size issue, correct the canonical variant and its tests rather than adding feature-local markup.

Source evidence:
- [SubToolbox primitives](../../src/components/subtoolbox/SubToolboxPrimitives.tsx)
- [SubToolbox system CSS](../../src/styles/subtoolbox-system.css)


## Follow-up source check: catalog split and first migration targets

### Canonical baseline versus primitive-backed catalog

A second targeted inspection confirms the two catalog tracks have different roles:

- `StudioHubCompletePrimitiveCatalog.tsx` labels its examples as a **frozen hardcoded certification baseline** and currently lists generic `Text Input` and `Textarea` families. It does not import or render `SubToolboxLabeledInput` or `SubToolboxLabeledTextArea`.
- `StudioHubPrimitiveMigrationCatalog.tsx` does import and render both labeled-field primitives. Therefore the variants are represented in the primitive migration track, but not as separately named families in the complete catalog's frozen hardcoded baseline.
- Keep the baseline frozen as intended. Do not insert primitive-backed implementations into the hardcoded baseline, because that would erase the comparison. The safe next change is to make sure the migration/certification surface names these as explicit field variants and records their L0/L1/L2 behavior.

### Current usage in first pilot pair

- `VideoPublisher.tsx` imports and uses `SubToolboxInput` and `SubToolboxTextArea`, but does not currently use either labeled-field wrapper by name.
- `VideoManager.tsx` does not directly import `SubToolboxInput` or `SubToolboxTextArea` in its current source. Its layout uses its own existing implementation patterns, so its field markup and styles need a closer pass before selecting which pieces to migrate.
- This supports using Publisher/Manager as a **shared primitive migration pair**, but not rewriting either tool wholesale. First compare their current field semantics, save/update actions, data ownership, and styles. Then migrate one field pattern at a time.

### Current source-based next slice

1. Inspect `StudioHubPrimitiveMigrationCatalog.tsx` around the labeled input/textarea demos and the geometry/token mapping.
2. Inspect Publisher field markup and Manager field markup/styles to identify exact hard-coded geometry and the appropriate canonical component mapping.
3. Inspect existing tests for SubToolbox primitives and component catalog contracts; add focused coverage for labeled-field variants only if the current suite lacks it.
4. Make a small implementation commit that improves the canonical primitive-backed certification surface, without changing the frozen baseline or tool behavior.
5. Run the repository's relevant test/build commands in a real checkout before declaring implementation verified. GitHub source inspection alone cannot establish compilation or browser rendering.
