---
name: viewtube-studio-design
description: Use when designing, implementing, auditing, or maintaining ViewTube front-end pages, sections, responsive layouts, Studio Controls primitives, reusable components, design tokens, palette/theme values, production styles, or the Studio component-library documentation. Page composition must use existing approved ViewTube components; primitive creation and design-system maintenance are separate explicit workflows.
---

# ViewTube Studio Design System Steward

## Mission

Maintain and apply ViewTube's established UI system. Preserve its colorful neo-brutalist visual identity, its existing 12-color palette, semantic palette pairing, tokens, Studio Controls primitives, reusable components, and documented style hierarchy.

This skill has two intentionally separate modes:

1. **Compose a product interface** — redesign pages, sections, dashboards, and responsive layouts using only existing, approved ViewTube primitives and components. Do not invent a new control, recreate a component in local CSS, or introduce page-specific visual styling that competes with the design system.
2. **Build or maintain the design system** — when explicitly asked, or when a page task reveals a real missing capability, inspect, propose, build, repair, test, and document primitives/components, tokens, styles, palette integration, and their source-of-truth documents. Do not quietly build a new primitive inside a page redesign.

The repository is the source of truth. This skill is a steward of the repository's current contracts, not a replacement design system.

## Mandatory rules

- Read the current target branch's source and relevant design documents before making implementation claims or edits. Links in this skill are starting points, not proof that their referenced revision is current.
- Preserve the existing 12-color palette and its actual semantic roles/pairings. Never invent a replacement palette, use arbitrary hex values for product UI, or assume illustrative colors from design references are ViewTube tokens.
- Use the canonical theme/palette and token system for fills, strokes, borders, outlines, typography, spacing, radii, states, and motion. Verify where each token is actually defined and how themes supply it.
- Page and section composition may control placement, order, responsive arrangement, and container layout. It must not redefine a primitive's anatomy, color, fill, stroke, focus, typography, size tier, or interaction behavior.
- Always reuse the real production export. Never build a lookalike control with ad hoc HTML/CSS when an existing primitive or component fits.
- A catalog specimen is evidence of a component, not a second implementation. It must import the real production primitive and must not become production styling authority.
- When a real component gap exists, stop page composition, document the gap, and use the design-system maintenance workflow. After the new primitive/component is built, exported, tested, documented, and approved, compose the page with it.
- Do not treat current implementation drift as a legitimate alternative contract. Detect contradictions and report them; reconcile the lowest-authority implementation with the highest valid current contract.
- Do not edit generated files manually when an emitter or generator owns them. Update the canonical source, regenerate, and verify the output.
- Never claim build, browser, screenshot, accessibility, or regression verification unless that check was actually run and its result observed.

## Source-of-truth hierarchy

Follow the current hierarchy document and explicit current product requirements. The current documented hierarchy is:

1. Explicit current product contract or approved override for the exact concern.
2. `STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md` — ownership, precedence, change control.
3. Canonical semantic values and design tokens, including the real 12-color palette and size/type/state tokens.
4. Shared production primitives and their contracts.
5. Shared production styles.
6. Family-specific production styles and registered exceptions.
7. Page/feature composition styles — layout only.
8. Catalog, showcase, demo, and test-fixture styles — specimens only.
9. Unregistered local declarations, inline styles, unexplained `!important`, and legacy overrides — presumed drift until justified.

If the current hierarchy document has moved or been superseded on the target branch, find the current authoritative version and record the change. Do not assume a commit-linked reference is current on every branch.

## Required repository inspection

Before coding, inspect the target branch, working tree, relevant imports/exports, and actual component implementation. Do not use Codespaces unless explicitly requested. Do not change branches, create a PR, or target a branch without following the user's stated repository workflow.

Core paths to inspect and verify on the target branch:

- `src/studio-ui/tokens.ts` — canonical Studio control values and size contracts.
- `src/studio-ui/index.ts` — public primitive exports.
- `src/studio-ui/primitives/` — real primitive implementations.
- `src/styles/` — shared production styles, theme/palette integration, field styles, generated token output, and family styles.
- `scripts/emit-studio-control-vars.mjs` — inspect if generated Studio CSS variables are used on the target branch.
- The active Studio Hub entry/catalog source identified by the source-of-truth documentation. Do not assume an older catalog file is still the active one.
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`.
- `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md`.
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`.
- `docs/ui/STUDIO_HUB_COMPONENT_IMPORT_INVENTORY_AUDIT.md`.
- Any current authoring guide, palette definition, exception index, tests, and generated reports referenced by those documents.

Use the repository's actual target branch/ref to fetch these sources. If one of the supplied references is missing on the target branch, locate the current equivalent and report the discrepancy rather than silently substituting another file.

## Workflow A — redesign an existing page or section

1. **Inspect.** Read the page and its real component tree, identify existing primitives/components, routes, behavior, data contracts, tokens, and responsive conventions. Review relevant source-of-truth docs.
2. **Inventory reuse.** Map each proposed visible control to an existing public export or domain component. Confirm that the component supports the required size, state, and anatomy. Reuse the current component rather than rebuilding it.
3. **Define composition only.** Specify hierarchy, grouping, page grid, container widths, responsive ordering, and content placement. Use layout CSS for placement; use the existing component API for component appearance.
4. **Check for gaps.** If a required control or state does not exist, do not imitate it locally. Record the missing capability and switch to Workflow B only after scope/authorization is clear.
5. **Implement.** Preserve routes, data flow, event handlers, validation, loading/error/empty states, permissions, keyboard behavior, and existing product features. Use the existing 12-color palette and semantic tokens.
6. **Verify.** Run applicable checks and inspect actual rendered layouts at relevant desktop, tablet, and mobile widths. Test representative interactive states and overflow. Do not certify visual quality from source inspection alone.
7. **Report.** List changed files, reused components, responsive behavior, tests actually run, visual checks actually observed, remaining issues, and any unresolved design-system contradictions.

### Page-composition prohibition

For page redesigns, do not:

- invent new button/input/dropdown/toggle/card styles;
- use raw palette hexes, arbitrary CSS values, or local CSS to mimic a Studio primitive;
- duplicate a primitive under a new component name;
- redefine global border, focus, fill, typography, or size-tier rules at page scope;
- use catalog/demo CSS as production style authority;
- add a dependency solely to replace an existing primitive or solve a simple composition problem;
- omit existing page behavior just to make a static mockup look correct.

If a primitive exposes a missing API, document the limitation and use Workflow B rather than circumventing it.

## Workflow B — build, repair, or extend a primitive/component

1. **Confirm the gap.** Search public exports, primitive files, existing family patterns, catalog registry, consumers, tests, and docs. Demonstrate why existing components cannot meet the requirement.
2. **Establish the contract.** Define purpose, anatomy, API, supported variants/sizes, semantic token roles, layout behavior, all relevant states, accessibility, responsive behavior, and any exception to global defaults.
3. **Resolve authority before editing.** Compare the current product request, hierarchy doc, tokens, primitive implementation, production CSS, family styles, generated output, catalog, and tests. Identify which layer is wrong instead of blindly copying a conflicting value.
4. **Propose exceptions narrowly.** An exception must have an owner, rationale, exact scope, test coverage, and entry in the canonical exception index. Do not turn a local defect into a global token.
5. **Implement in the proper owner.** Put API and behavior in the production primitive; semantic/shared values in canonical tokens/theme; global behavior in shared production CSS; truly unique geometry in family styles; only layout in page composition; only specimen arrangement in catalog CSS.
6. **Preserve the 12-color palette.** Reference existing theme/pair variables and semantic roles. Trace palette selection to its source. Never hard-code a new palette in the component. Verify all required theme pairs exist.
7. **Maintain exports and registry.** Add the public export and catalog registration where appropriate. Keep the specimen wired to the real production component. Update import inventories and other affected documentation when the source graph changes.
8. **Test.** Add or update API/contract tests, behavior tests, and visual/computed-style checks where available. Test all supported size tiers and important states. Run the documented inventory audit, focused tests, typecheck/lint, and build when the project provides them.
9. **Reconcile generated artifacts.** Use the canonical emitter/generator; never manually patch generated CSS to hide a token mismatch.
10. **Verify and document.** Inspect rendered output and responsive behavior. Update canonical docs and exception records in the same change. Mark visual certification only when browser/computed-style evidence exists.

## Workflow C — audit and reconcile design-system contradictions

1. Gather current source files and docs from one explicit target branch/ref. Note each file's revision/commit where practical.
2. Build a concern matrix for palette roles, typography, size tiers, borders/strokes/outlines, fills, motion, widths, split geometry, exports, generated variables, and catalog examples.
3. For each disagreement, record: claim A/source, claim B/source, precedence level, implementation evidence, likely impact, recommendation, and required tests.
4. Follow the hierarchy. A higher-authority current contract wins; lower-level mismatches are implementation drift. If two same-level sources conflict or the active product contract is ambiguous, do not invent a resolution: surface the contradiction and ask for a decision.
5. Trace each rule through token → primitive API → production CSS → family CSS → consumer/page → catalog/test. Do not fix only the visible selector if the source of the mismatch is higher in the chain.
6. Fix at the narrowest correct owner. Remove obsolete overrides only after proving they are unused and their replacement is covered by tests.
7. Update source-of-truth documentation, exception index, imports/inventory, tests, and generated output as needed.
8. Report fixed, still-open, and not-verified issues separately. Never call a source-confirmed specimen visually certified without rendered evidence.

## Workflow D — maintain the design documentation

Treat the following as living resources that should be kept accurate and mutually consistent:

- Component library source of truth: registry/catalog ownership, canonical production paths, component family contracts, certification boundaries.
- Values/tokens/styles/settings hierarchy: precedence, ownership, dependency direction, and CSS layering.
- Global defaults and exception index: true global defaults and only genuine registered family exceptions.
- Component import inventory audit: reproducible commands, entry point, import graph interpretation, known limitations, and current results.
- Primitive authoring guide and visual checklist, if present.

For every meaningful system change:

- Update docs in the same change as the implementation.
- Prefer linking to canonical sources over duplicating long tables of values in several docs.
- If duplicated values are required for readability, label the canonical owner and add a consistency test or audit.
- Keep historical notes clearly marked as superseded rather than leaving contradictory advice presented as active.
- Do not rewrite docs to claim the repository is compliant before the implementation and verification support that claim.
- Include open contradictions, unsupported size tiers, stale exports, missing palette pairs, unregistered exceptions, and gaps in test/browser coverage.

## Established Studio contracts to verify, not blindly assume

The supplied source documents currently describe these intended rules; verify they remain current on the target branch:

- Five size tiers: Supreme 60px, Standard 44px, Compact 28px, Mini 20px, Micro 12px. Size support is family-aware.
- Supreme uses the Standard stroke/radius system; Micro uses the Mini stroke/radius system.
- Inter font stack, heavy Studio labels, uppercase control text, and tight tracking according to canonical tokens.
- Primary/secondary semantic roles are sourced from palette pair variables, not page-local hex literals.
- Black outer border by default; field inset stroke and focus outline are distinct layers.
- Resting fields: primary text/glyph treatment, primary 50% fill, black border, persistent primary inset stroke, primary caret.
- Focused fields: black text/glyph treatment, primary 15% fill, black outer border, persistent primary inset stroke, secondary focus outline at the documented ratio/offset, primary caret.
- TextBox has its own explicit black text/glyph rule while retaining the primary inset and secondary outline.
- Flush split seams, correct rails/dividers, zero unintended internal gaps, clipping rather than unintended ellipses, and flat default interactions.
- Generated CSS variables must come from the canonical emitter when that generation path is active.

Mini typography and icon size are 17.5px. Treat this as the intended contract and update canonical tokens, generated CSS variables, affected primitive consumers, and normative references together. Audit any remaining 16px Mini typography/icon/floating-label values and migrate them to 17.5px unless a specifically documented and approved family exception applies. Do not leave the token source contradicting this contract.

## Responsive and accessibility requirements

- Test real narrow mobile widths and desktop widths; do not treat a desktop page scaled down as a mobile design.
- Use responsive composition for stacking, ordering, wrapping, and scrolling while preserving component anatomy.
- Keep keyboard navigation, visible focus, semantic labels, screen-reader names, and form errors intact.
- Do not rely on color alone to convey status. Check contrast, text zoom, long labels, and reduced-motion preferences.
- Where a Studio primitive's nominal size is smaller than a recommended touch target, preserve the visual primitive but ensure the interaction hit area is usable without distorting its canonical visible geometry.
- Never invent breakpoints; follow established project breakpoints and verify them in source.

## Verification and completion criteria

A task is complete only to the level actually evidenced:

- **Source inspected:** relevant source and docs were read.
- **Source/API verified:** exports, prop contracts, and source tests checked.
- **Build verified:** relevant build/typecheck/lint commands ran successfully.
- **Behavior verified:** actual interactions and state transitions tested.
- **Visual verified:** rendered screenshots/computed styles inspected at the relevant sizes.
- **Accessible checks performed:** named checks and findings recorded; do not claim a full accessibility audit without the appropriate tests.

State which levels were achieved. A passing build is not visual certification. A catalog entry is not proof of correct production usage. A written contract is not proof that runtime behavior matches it.

## Default output format

For page redesigns:
1. Existing component inventory and source of truth.
2. Layout/composition plan.
3. Changes made and components reused.
4. Desktop/mobile checks and test results.
5. Remaining issues or component gaps.

For primitive work:
1. Gap and existing alternatives checked.
2. Contract and token/owner decisions.
3. Files changed and public exports.
4. Tests/build/browser evidence.
5. Documentation and exception updates.
6. Unresolved contradictions and follow-up work.

For audits:
1. Findings ranked by severity.
2. Evidence and source precedence.
3. Proposed or applied repair by owning layer.
4. Tests and verification status.
5. Open questions requiring a product decision.

Be precise and candid. Never report unperformed edits, checks, repository actions, or PR creation as successful.
