---
name: css-ui-system-organizer
description: Simplify, stabilize, optimize, and organize CSS-based UI primitive and component systems, including design tokens, CSS files, TSX primitives, sizes, variants, colors, typography, buttons, shadows, animations, and strokes. Use for design-system cleanup, token consolidation, CSS/TSX hygiene, or ViewTube Studio Controls on master/consolidated-feature-integration.
---

# CSS UI System Organizer

Specialize in turning fragmented, drift-prone, or over-engineered CSS + TSX UI primitive systems into a coherent, stable, token-driven contract. Primary focus is ViewTube Studio Controls (`src/studio-ui/`, `src/styles/studio-control-*.css`) on `master/consolidated-feature-integration`.

## Core goals

1. **Simplify:** eliminate duplicate rules, competing selectors, silent overrides, and unused size/variant paths.
2. **Stabilize:** make every visual property (height, stroke, radius, font, color role, shadow, motion) come from one authoritative source; register every exception by name.
3. **Optimize:** prefer CSS variables and data attributes over deep selector chains; keep generated CSS and token objects synchronized; avoid layout-shifting focus or hover effects.
4. **Organize:** establish clear ownership boundaries: tokens own numbers, CSS owns presentation, TSX owns markup and data attributes, and the confirmed catalog owns production-backed specimens.

## Canonical architecture

| Layer | File(s) | Owns |
|---|---|---|
| Tokens | `src/studio-ui/tokens.ts` | Numeric contracts, size ladders, color roles, exceptions, width policy |
| Defaults and exceptions index | `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` | Human-readable normative rules matching tokens and CSS |
| Core CSS | `src/styles/studio-control-system.css` and any imported generated vars/core/split/fields files | Selectors, data-attribute scoping, flat interaction defaults |
| Primitives | `src/studio-ui/primitives/StudioControls.tsx`, `StudioTextInput.tsx`, `StudioTextArea.tsx` | Markup, data attributes, named primitive/exception exports |
| Confirmed catalog | `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` | Live specimens importing production primitives |

Inspect the repository before assuming every path exists or every file is still authoritative. Follow current imports and project conventions; do not create parallel sources of truth.

## Non-negotiable Studio Controls rules

- Geometry is independent of Toolbox/SubToolbox hierarchy.
- Flat interaction defaults: `box-shadow: none`, `transition: none`, and `transform: none` on shells and faces unless a named exception is registered.
- Size tier changes only dimensions (height, stroke, radius, font, icon); it must not change color ownership, text weight, label centering, or row-fill behavior.
- Micro is reserved for informational split-left badges; do not promote it to a general interactive button size.
- Every departure from global defaults must appear in the tokens exceptions object, the docs index, and the confirmed catalog.
- Text fields are left-aligned. Single-line inputs use the global 38/24px typography; textarea alone uses the registered 18/14px multiline exception.
- Focus outline offset is always 0; focus must not shift layout.
- Width defaults to row-fill. Content-width is an allow-list exception only.
- Treat the current repository implementation and user-confirmed contract as evidence; the reference snapshot is guidance to reconcile, not permission to overwrite newer intentional changes.

## Workflow

### 1. Inventory the system

- Locate token sources, CSS entry points/imports, primitive entry points, tests, documentation, and catalog/specimen files.
- Extract the size ladder (standard/compact/micro or equivalent).
- List data attributes and custom properties that control appearance.
- Identify competing selectors, `!important`, hard-coded pixel values, duplicate declarations, dead variants, and unused exports.
- Find shadows, transitions, transforms, hover/press movement, and focus rules that violate the flat contract.
- Trace the real import graph before editing generated or split CSS files.

### 2. Establish one source of truth

- Put numeric size values in the authoritative token module.
- Derive intermediate tiers mechanically where appropriate, while preserving explicit legibility floors and registered exceptions.
- Export a size contract that includes input and multiline exceptions.
- Generate CSS variables from tokens when the repository supports it; otherwise update the existing bridge and verify it remains synchronized.
- Scope rules under stable data attributes such as `[data-vt-studio-control]` and `[data-size="compact"]`.
- Do not introduce a second token generator or parallel stylesheet.

### 3. Register exceptions explicitly

Use a named, typed exception object, adapted to existing conventions:

```ts
export const STUDIO_CONTROL_GLOBAL_RULE_EXCEPTIONS = {
  vaultSpectrumTag: {
    owner: "VaultAssetModule",
    height: 15,
    rationale: "Dense metadata chip with spectrum identity",
  },
} as const
```

Record exact values and rationale where useful. Mirror each real exception in the defaults/exceptions document and render it in the confirmed catalog. Do not invent exceptions solely to preserve accidental drift.

### 4. Clean CSS

- Remove duplicate property blocks and resolve selector conflicts at their source.
- Prefer custom properties set on the root control and inherited by child faces.
- Keep flat-interaction enforcement centralized and scoped to known controls.
- Separate vars/core/split/fields only if the project already supports that organization or the change clearly improves it; maintain one authoritative entry point.
- Remove layout-shifting hover/focus effects. If motion is required, register the exception and respect `prefers-reduced-motion`.
- Avoid blanket `!important` rules as a substitute for understanding specificity and ownership.

### 5. Align TSX primitives

- Interactive controls receive `data-vt-studio-control="true"` and the correct `data-size` where applicable.
- Prefer composition and shared anatomy (for example, a single `StudioSplitShell`) over duplicated one-off components.
- Keep public APIs small; use data attributes for styling hooks where appropriate.
- Keep text alignment, weight, color ownership, and row-fill invariant across size tiers.
- Do not break existing consumers without updating them and adding regression coverage.

### 6. Verify and document

- Update the global defaults/exceptions index so it matches tokens and CSS.
- Ensure the confirmed catalog imports real production primitives rather than reimplementing them.
- Add or update regression tests for exports, data attributes, CSS contracts, size invariance, and registered exceptions.
- Run focused tests first, then relevant typecheck/lint/build or broader suites available in the repository.
- Inspect the final diff for unrelated changes, duplicate rules, accidental API changes, and undocumented exceptions.
- Report the exact files changed, commands run, outcomes, and any checks not run. Never claim verification that did not occur.

## General principles

- **One ladder, many consumers:** size tokens feed CSS variables and TSX defaults.
- **Data attributes over class soup:** stable attributes are preferred to long, fragile selector chains.
- **Exceptions are first-class:** undocumented drift is a defect.
- **No silent geometry compensation:** shadows/transforms that compensate for incorrect dimensions are forbidden unless registered.
- **Color roles, not raw colors:** primary/secondary roles remain consistent across sizes.
- **Typography weight is global:** heavy emphasis (1000 in the current Studio contract) is not size-dependent unless an exception says otherwise.
- **Focus never moves layout:** outline offset is zero and focus must not change padding or margin.
- **Catalog equals production:** specimens import the same modules that ship.

## Common tasks

- Collapse Studio control CSS into a stable contract.
- Register a named size exception for a spectrum tag.
- Remove shadows and transitions from Studio primitives.
- Derive micro from compact and synchronize tokens, CSS, docs, and catalog.
- Audit `StudioControls.tsx` for hard-coded dimensions.
- Reconcile the confirmed catalog with live primitives.
- Organize tokens, CSS, and TSX so new variants cannot silently break the system.

## Anti-patterns

- Adding a size tier without updating tokens, CSS variables, docs, catalog, and tests.
- Hard-coding dimensions in TSX or CSS when a token already owns them.
- Using `!important` to fight another stylesheet instead of fixing ownership.
- Reimplementing controls inside the catalog.
- Changing color ownership or text weight as a side-effect of resizing.
- Adding hover translation or box-shadow without a named exception.
- Treating a stale reference snapshot as more authoritative than current repository code and explicit user decisions.

## References

- [ViewTube Studio contract snapshot](references/viewtube-studio-contract.md)
- [Token and size-ladder patterns](references/token-patterns.md)
- [CSS hygiene recipes](references/css-hygiene.md)
