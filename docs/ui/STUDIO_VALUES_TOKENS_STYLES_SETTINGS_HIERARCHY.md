# Studio UI — Values, Tokens, Styles & Settings Hierarchy

**Status:** Normative architecture and reconciliation contract  
**Scope:** ViewTube Studio UI, including Studio Controls, Studio Hub/Component Library, Brain surfaces that consume Studio primitives, and their shared styling layers.  
**Target branch:** `master/consolidated-feature-integration`  
**Last reviewed:** 2026-10-30

This document defines **where decisions belong, which source wins, how exceptions are registered, and how changes are verified**. It does not claim that every existing implementation already conforms. Existing drift is a defect to reconcile, not an alternative source of truth.

## 1. The hierarchy

Resolve every styling question from the first applicable level below. A lower level cannot silently override a higher one.

1. **Explicit current product contract / approved override** — the current task or an explicitly recorded, still-active decision for the exact concern.
2. **This hierarchy document** — establishes ownership, precedence, and change control.
3. **Canonical semantic values and design tokens** — named colors, spacing, type roles, size tiers, radii, strokes, motion, and state values.
4. **Shared production primitives and their contracts** — component anatomy, supported variants/sizes, state behavior, and accessible semantic elements.
5. **Shared production styles** — the shared CSS that applies token values and primitive contracts.
6. **Family-specific styles and registered exceptions** — only what is genuinely unique to that component family.
7. **Page/feature composition styles** — layout and placement only; must not redefine primitive appearance.
8. **Catalog, showcase, story, demo, and test-fixture styles** — presentation of specimens only; never production authority.
9. **Local one-off declarations, inline styles, unexplained !important rules, and legacy overrides** — presumed drift until justified and registered.

When levels disagree, follow the higher level and repair the lower-level implementation. Do not copy a lower-level workaround into another page. An explicit override only applies to the concern and scope it names; it does not grant blanket permission to bypass shared tokens.

## 2. Ownership map

| Concern | Owner | Must not be owned by |
|---|---|---|
| Semantic color roles and palette pairing | Theme/palette tokens | Page-local hex literals or catalog CSS |
| Size tiers and dimensions | Studio token definitions | Per-page pixel overrides |
| Typography roles and complete type bundles | Shared typography tokens / primitive contract | Isolated font-size declarations |
| Spacing rhythm and external gaps | Shared spacing tokens and composition layout | Simultaneous gap + margin + padding for the same separation |
| Border, inline stroke, outline, radius | Token values + production primitive/family contract | Catalog styling or ad hoc focus selectors |
| Default, hover, pressed, focused, disabled states | Shared primitive contract and production styles | Each consumer reimplementing state logic |
| Split rails, dividers, fixed geometry | Production primitive | Parent grid or specimen CSS |
| Position, order, responsive arrangement | Page/feature composition | Production primitive, unless intrinsic to its anatomy |
| Specimen grid, captions, examples | Catalog-only stylesheet | Production control stylesheet |
| Approved family exception | Exception index + component test | Unrecorded local CSS |
| Runtime-generated CSS variables | Token emitter and generated output | Manual edits to generated files |

### Current known Studio source locations

- Tokens and global contracts: `src/studio-ui/tokens.ts`
- Public primitive exports: `src/studio-ui/index.ts`
- Shared control implementation: `src/studio-ui/primitives/StudioControls.tsx`
- Shared production control styling: `src/styles/studio-control-system.css`
- Entry/field styles: `src/styles/studio-control-entry.css`, `src/styles/studio-control-fields.css` (verify these paths exist on the branch before editing)
- Generated variables, when present: `src/styles/studio-control-vars.generated.css`, emitted by `scripts/emit-studio-control-vars.mjs`
- Family-specific primitive/style files: the owning primitive module and its dedicated stylesheet
- Catalog specimens/presentation: `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and its catalog stylesheet; the component-library registry/source-of-truth document identifies the active catalog entry point.
- Existing Studio contract index: `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- Existing Component Library ownership reference: `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`

**Repository reconciliation (2026-10-27):** TypeScript tokens are the size authority; generated CSS is emitted from them; `studio-control-system.css` owns the shared tier selectors. Core and recovery stylesheets no longer redeclare the global five-tier geometry. Mini and Micro use `-0.02em`; Micro uses its explicit 1px stroke / 2px radius / 0.65px focus outline while retaining its 12px height and 10px type/icon size.

## 3. Definitions

- **Value:** a raw primitive value such as a color, length, opacity, duration, or font-size.
- **Token:** a named, reusable value with a stable semantic or dimensional role.
- **Semantic token:** communicates purpose (for example, primary, secondary, border, focus outline), not a component-specific location.
- **Component token:** a value scoped to a production primitive or family when a shared semantic token cannot express the need.
- **Style:** the rule that applies a token to an element, state, or layout.
- **Setting:** a public, intentional API choice exposed to a caller, such as size, variant, orientation, or disabled state.
- **Default:** behavior applied when no explicit supported setting is supplied.
- **Exception:** a documented, narrowly scoped departure from a default, backed by implementation and regression coverage.
- **Generated artifact:** output derived from a canonical source; regenerate it rather than editing it manually.
- **Composition:** where/how a primitive is placed, sized by its container, ordered, or made responsive.
- **Specimen:** a demonstration of the real production primitive, not a parallel implementation.

Do not create a token merely to name an accidental one-off. Promote a value to a shared token when it represents a stable cross-family role or intentional scale step.

## 4. Canonical Studio global contract

These are the intended shared defaults. A named family contract may narrow support or define anatomy, but must not silently redefine global meaning.

| Property | Intended default |
|---|---|
| Typeface | `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| Weight | `1000` for Studio control labels, unless an explicit text-role exception is registered |
| Case | Uppercase for control labels/tags |
| Letter spacing | `-0.02em`; only registered family exceptions differ |
| Line height | `1` for control text; multiline reading roles may declare a separate explicit role |
| Primary / secondary | `--pair-a` / `--pair-b` |
| Outer border | Black (`#000`) unless a family contract explicitly says otherwise |
| Ordinary field fill | Primary at 50% opacity |
| Focused field fill | Primary at 15% opacity |
| Ordinary field text/glyph stroke | Primary |
| Focused field text/glyph stroke | Black |
| Field inline inset stroke | Primary, always present, same width as the outer border |
| Field focus outline | Secondary, 65% of border width, offset `0` |
| Caret | Primary, including focus |
| Width | Fill available row/module width by default |
| Split internal seam/gap | `0`; sections are flush |
| External spacing unit | `4px` where the shared spacing system applies |
| Text overflow | Clip; never use ellipsis on canonical single-line Studio controls |
| Motion / elevation | Flat shell: no shadow, lift, translation, or geometry movement by default |
| Focus geometry | Must not shift layout |

### Field state contract

**Resting text input / textarea:** black outer border, primary inline inset stroke at all times, primary text and glyph stroke, primary 50% fill, primary caret.

**Focused text input / textarea:** black outer border, primary inline inset stroke retained, black text and glyph stroke, primary 15% fill, secondary outline at 65% of border width with zero offset, primary caret. The outer border must not become primary on focus.

**TextBox:** black text and black glyph stroke, primary inline inset stroke, secondary outline. Do not substitute the generic primary glyph stroke simply because the component is a field.

These are distinct visual layers: outer border, inline inset stroke, and focus outline. One must not be omitted or substituted for another. Text-input caret width/shape behavior is a separate runtime behavior to test; it must not be inferred from color tokens alone.

## 5. Size-tier authority

The Studio tier names and intended heights are:

| Tier | Height | Intended stroke | Intended radius | Intended type/icon size |
|---|---:|---:|---:|---:|
| Supreme | 60px | 3px | 6px | 52px |
| Standard | 44px | 3px | 6px | 38px |
| Compact | 28px | 2px | 4px | 24px |
| Mini | 20px | Mini stroke system: 1.5px | 3px | 17.5px |
| Micro | 12px | 1px | 2px | 10px |

The tier is a complete bundle, not a height alone: record height, border/stroke, radius, typography size/weight/stroke, icon size/stroke, focus outline, fill behavior, line-height, case, and letter spacing together. **Supreme uses Standard's 3px / 6px geometry; Micro has its own explicit 1px / 2px geometry. Do not revive the obsolete 1.5px / 3px Micro interpretation.**

Support is family-aware. A family may expose only the tiers its real inner geometry can support. Do not advertise a size in a catalog unless the production API and implementation actually support it.

The external 4px spacing rhythm is not an internal split gap and does not change a component's fixed rail geometry.

## 6. Tokens, styles, and settings: dependency direction

Use this dependency direction:

```text
Product contract / approved override
              ↓
Design-system hierarchy and exception register
              ↓
Theme + semantic tokens + dimensional/type/motion tokens
              ↓
Production primitive API and family contract
              ↓
Shared production CSS + family-specific production CSS
              ↓
Feature/page composition (placement and responsive layout)
              ↓
Catalog/specimens (demonstrate production behavior)
              ↓
Tests, computed-style checks, screenshots, and runtime verification
```

Generated variables are a build artifact of the token layer and must be regenerated from their emitter. Tests verify the chain; they do not become a competing design authority.

### Token naming rules

1. Name by meaning first (`primary`, `focus-outline`, `control-height`), then by family/tier when necessary.
2. Keep units explicit and consistent. Do not mix unitless values and CSS lengths without a clear contract.
3. Keep state values grouped with the role they affect (rest/focus/disabled).
4. Avoid duplicating the same literal in tokens, component CSS, catalog CSS, and tests. Tests may assert the canonical contract but should not become a second source of defaults.
5. Do not alias unrelated systems merely because their current values happen to match.
6. If a token is absent from an active theme, do not use it as if it existed. Either register the missing theme entry as a proposal or change the usage to a token the theme actually defines.
7. Never use a generated CSS variable as the source from which the canonical token is re-derived.

## 7. Stylesheet layering and CSS rules

Recommended cascade responsibilities:

1. Theme variables and base reset
2. Canonical token variables / generated token output
3. Shared Studio control system
4. Shared field/entry styling
5. Primitive-family stylesheet
6. Explicitly named recovery/compatibility overrides, imported last only while required
7. Feature composition
8. Catalog-only presentation

This ordering is a responsibility map, not permission to keep conflicting declarations. A last-imported recovery stylesheet is temporary debt: every rule must identify the regression it repairs, be scoped to the smallest stable primitive/state selector, and have an exit condition. Move durable rules back to their canonical owner and remove obsolete overrides.

CSS rules:

- Avoid broad selectors that unintentionally style similarly named components.
- Avoid `!important` unless the cascade has a documented, tested reason; do not use it to hide ownership problems.
- Do not define primitive geometry in catalog styles.
- Do not use shadows to fake borders, separators, or missing inset strokes.
- A split shell uses one shared divider per boundary, never doubled borders or a gap colored by the page background.
- Labels center within their own region, not the entire compound shell unless that is the contract.
- Fixed square rails must not shrink to rescue a label; let the composition wrap/stack instead.
- Motion and state transitions must not move the control's geometry unless an explicit family contract requires it.

## 8. Known reconciliation conflicts on the reviewed branch

The following discrepancies were visible when comparing the target branch's `src/studio-ui/tokens.ts` and `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` with the later recovery decisions. This is a reconciliation list, not a claim that code has been changed.

| Concern | Later intended contract | Observed conflict to reconcile |
|---|---|---|
| Supreme stroke/radius | 3px / 6px Standard system | TypeScript tokens and recovery CSS agree; superseded proportional values remain in historical documentation and catalog notes and must not be treated as current global defaults |
| Mini type/icon size | 17.5px | Token source and generated CSS declare 17.5px; system selector consumes generated variables | Source aligned; runtime verification outstanding |
| Micro stroke/radius | 1px / 2px explicit Micro geometry | Tokens, generated CSS, and system selector align; duplicate tier declarations removed from core/recovery | Source aligned; runtime verification outstanding |
| Micro focus outline | 0.975px (65% of the 1.5px Mini-system stroke), offset 0 | Token and generated CSS values are consumed by the system selector | Source aligned; runtime verification outstanding |
| Focused text fields | Black outer border and black text/glyph stroke; primary inset remains; secondary outline | Verify all field selectors and textarea variants; any primary outer/focus stroke is a regression |
| TextBox | Black text and glyph stroke; primary inset; secondary outline | Verify no inherited generic primary glyph rule overrides the TextBox contract |
| Catalog authority | Real production exports; catalog CSS only arranges specimens | Audit every specimen for direct production imports and prevent lookalike implementations |
| Recovery overrides | Temporary, scoped, documented | Check whether a recovery stylesheet exists and is loaded last; do not assume a path merely because it is named in an earlier plan |

Resolve these in the implementation and existing normative index in the same change that updates tokens. Do not “solve” them by silently changing this document to match stale code. If a decision is intentionally changed later, update the explicit override, tokens, generated output, tests, and both Studio contract documents together.

## 9. Settings and public API contract

A public setting is valid only if it is:
- deliberately named and typed;
- supported by the production primitive;
- documented with its default and allowed values;
- represented accurately in the component library;
- covered by API/behavior regression tests.

Settings such as `size`, `variant`, `disabled`, orientation, and split configuration must not duplicate styling logic in each consumer. Prefer one shared primitive implementation and typed variants over feature-local forks. Do not preserve dead exports or ambiguous variants solely to support an obsolete specimen; confirm imports before removal.

Changing a token must not implicitly change public API semantics. Changing a setting's meaning requires an explicit contract update and tests.

## 10. Exception registry requirements

Every exception entry must include:

- **ID / family / exact scope**
- **Reason** — why the global default cannot express the requirement
- **Changed properties** — only the properties that differ
- **Supported tiers/states/variants**
- **Owning production file(s)**
- **Public API and specimen location**
- **Regression test(s)**
- **Verification status** — source/API tested, computed-style tested, browser visual tested, or not yet verified
- **Exit condition** for temporary compatibility/recovery rules

Do not repeat shared defaults in each family entry. An exception is not approved by appearing in a comment, screenshot, catalog, or local CSS alone.

## 11. Verification and change protocol

For every token/style/settings change:

1. **Audit first:** inspect the target branch and working tree; read the current token source, primitive, imports, family stylesheet, tests, generated-output script, and existing docs. Preserve landed work and avoid duplicate implementations.
2. **Resolve ownership:** identify the highest applicable authority and write down any conflict before editing.
3. **Change canonical source first:** token or primitive contract before dependent CSS. Update generated output through its emitter, never by hand.
4. **Update consumers:** remove duplicate overrides, then update family CSS and specimen arrangement only where their own responsibilities require it.
5. **Update documentation together:** this hierarchy, `STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`, and `STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` when their scopes are affected.
6. **Test the contract:** unit/API tests, CSS invariants, and regression cases for all affected tiers/states.
7. **Verify rendered behavior:** inspect computed styles and browser captures for relevant size/state combinations. Source tests are not visual certification.
8. **Report evidence honestly:** list files changed, commands/tests run, what passed/failed, visual coverage, and remaining drift. Never claim a build or browser check that was not run.

Minimum field regression matrix: input, textarea, and TextBox at rest and focus; assert outer border, inset stroke, fill, text/glyph stroke, outline color/width/offset, and caret color independently. Include typing-start/after-space caret-width behavior as a separate interaction test if that defect is in scope.

Minimum split regression matrix: each supported split anatomy and tier; assert rail dimensions, rail colors, divider count, no internal gap, label centering/clipping, and no doubled borders.

## 12. What is not authoritative

The following never overrule the hierarchy by themselves:

- old PR descriptions or historical audit snapshots;
- old comments that conflict with the current contract;
- a screenshot without source/provenance;
- a catalog specimen implemented with lookalike markup;
- local CSS that happens to look correct today;
- generated CSS edited without its source emitter;
- a majority of drifting pages when a shared production component owns the role;
- a passing unit test that does not verify the relevant rendered property.

## 13. Definition of done

This document is the architecture contract, not proof of implementation completion. The system is reconciled only when:

- canonical tokens encode the approved tier and field contracts;
- generated CSS matches its source;
- production primitives consume those tokens without conflicting local overrides;
- every genuine exception is registered and tested;
- catalog specimens use real production exports;
- the existing defaults/exception index agrees with this hierarchy;
- automated tests pass and relevant rendered states are verified;
- remaining deviations are explicitly listed rather than described as complete.

**Authority summary:** contract decides meaning; tokens name values; primitives define behavior and anatomy; production styles apply tokens; composition places controls; catalogs demonstrate them; tests and browser evidence verify them.


## Studio Controls documentation reconciliation — 2026-10-27

This update records the current production primitive surface and remaining source/document disagreements found during a read-only audit of `master/consolidated-feature-integration`. It updates documentation authority only; it does not claim that CSS, generated output, tests, or rendered visuals were repaired by this change.

### Canonical family inventory

The Confirmed Primitive Library at `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` contains a full-width representative row set backed by production imports for buttons (standard, split-left, double-split, two-line, split two-line); dropdowns (simple, multi, split-left); toggles (arrow, bar, horizontal/vertical word, side, double-side); fields (single-line, split text input, textarea, read-only TextBox); counters (standard, side, left); and double-split slider. `StudioSplitTextInput` comes from `src/studio-ui/primitives/StudioSplitTextInput.tsx`; `StudioSplitAccordion` is a standalone primitive with its own production module and stylesheet.

A catalog row is evidence of registration and wiring, not by itself evidence of all variants, accessibility states, or pixel-level behavior. Each family record should identify exact export/module, style owner, supported size tiers, public variants, semantic/keyboard behavior, regression tests, and verification level.

### Verified implementation/documentation conflicts

- `src/studio-ui/tokens.ts` defines Mini as 20px / 1.5px stroke / 3px radius / 17.5px type and icon. Generated CSS now reflects 17.5px; core/recovery no longer redeclare the tier.
- Micro is 12px / 1px stroke / 2px radius / 10px type and icon, with a 0.65px outline and global `-0.02em` letter-spacing.
- Micro uses the global `-0.02em` letter-spacing token; no Micro-specific exception is registered.
- `StudioSplitTextInput` imports `src/styles/studio-split-text-input.css` for shell anatomy. Shared typography and field states remain owned by `studio-control-fields.css`; the entry stylesheet no longer carries split-input-specific rules.
- Editable fields use primary text/stroke and a primary inset at rest; focused fields switch text/stroke to black while retaining the primary inset and using a secondary outline at 65% of border width. TextBox remains black text/stroke with primary inset and secondary outline. The border, inset, and outline are independent layers.

### Verification boundary

Source inspection and source/test updates covered the three target documents, tokens, generated CSS, system/core/recovery stylesheets, split-input stylesheet ownership, and parity tests. Automated tests, typecheck, build, computed-style capture, assistive-technology run, and desktop/mobile browser screenshots remain outstanding because this pass used remote repository editing without a runnable checkout.


## 14. Studio Controls family and alignment contracts — 2026-10-30

- **Split text centering:** split-left, split-right, and double-split badges center label text against the complete outer shell. Rail count and rail placement do not shift the center axis. Editable split text input remains left-aligned and is explicitly excluded from badge centering.
- **Counter anatomy:** StudioCounter and StudioSideCounter use a 2:1 number-value region; their action rails remain 1:1 squares. This is a family geometry exception, not a second global size ladder. The ratio is sourced from STUDIO_COUNTER_NUMBER_TOKENS.valueAreaAspectRatio and emitted to CSS.
- **Bar toggles:** empty segments are a 50%-white / 50%-primary blend; filled segments are black. Bars match the selected tier's text height, retain a 2.5:1 height-to-width ratio, and use a slight radius. STUDIO_BAR_TOGGLE_TOKENS is the family authority for height/text ratio, height/width ratio, radius, empty fill mix, and full fill color.
- **Double-side toggles:** both sides reuse the shared side-toggle arrow controls and metrics. The central divider is a structural black seam only; the outer shell alone owns the secondary focus outline.
- **Inter-modules:** full width by default, zero horizontal container inset, square split sections, and no inherited external 4px gap at their edges.
- **Focus transition:** text fill and glyph stroke change together and use the same duration/easing. The secondary outline fades on blur; no abrupt reset.
- **Confirmed Library:** top representatives are one-column/full-width, use actual production exports, and include a specimen for every primitive in the representative inventory. Family modules group related primitives; Counter and Side Counter are separate modules.

## 15. Automated Studio Controls acceptance gate — 2026-10-30

The permanent source regression suite is `scripts/audit/studio-controls-system-audit.test.mjs`. It is part of `npm run test:studio-controls` and the release-gates workflow. It must verify:

1. Five-tier token/generated-CSS parity and actual component consumption.
2. Default/focus field colors, matching glyph stroke, persistent primary inset, caret, secondary outline, and synchronized transitions.
3. TextBox black text/glyph with primary inset and secondary outline.
4. Outer-edge split badge centering, square rails, flush seams, and split-input editability.
5. Counter 2:1 number areas and 1:1 rails; synchronized arrow-button metrics; outer-only double-side focus outline.
6. Bar-toggle empty/full colors, 2.5:1 ratio, tier-matched height, radius, tooltip visibility.
7. Vertical word-toggle measured handle bounds and horizontal-handle parity.
8. Full-width inter-modules and representative/family-module coverage in the Confirmed Library.

Browser certification remains mandatory for computed geometry, typing/focus behavior, focus fade, tooltip display, and all supported size tiers. A passing static source test is not a visual sign-off.
