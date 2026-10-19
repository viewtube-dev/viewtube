# ViewTube CSS Primitives & Studio Controls Authoring Guide

**Status:** ACTIVE — canonical authoring guide
**Authority:** How to extend the Studio Controls system and represent it in the confirmed primitive library
**Owner:** UI system / Studio Controls
**Canonical location:** docs/Studio-Controls-Authoring-Guide.md
**Created / Last Updated:** 2026-10-13 (America/New_York; EDT)
**Related:** docs/UI.md, docs/Toolbox.md, docs/Widgets.md, docs/Testing.md
**Canonical implementation files:** src/studio-ui/primitives/StudioControls.tsx and src/styles/studio-control-system.css

## 1. Governing rule: build in the canonical Studio Controls system

All new primitives and components for this system belong in:

- TSX: src/studio-ui/primitives/StudioControls.tsx
- CSS: src/styles/studio-control-system.css

Do not add new canonical Studio Controls primitives to src/components/subtoolbox/SubToolboxPrimitives.tsx or src/styles/subtoolbox-system.css. Those are a separate/legacy implementation surface, not the destination for new components in this system. Do not import their components into the confirmed library as a shortcut when the goal is to represent the canonical Studio Controls system.

The confirmed primitive library must show the actual canonical Studio Controls exports and shared CSS. It is a live reference and verification surface, not a parallel implementation or collection of look-alike mockups.

If existing tools still use the SubToolbox implementation, do not silently fork new work into it. Determine the migration/adaptor plan for those consumers while keeping new canonical work in StudioControls.tsx and studio-control-system.css. If a legacy component is displayed for comparison, label it legacy/non-canonical.

## 2. System layers

Use these layers in order:

1. Shared tokens and global defaults: color, typography, borders, focus states, radii, spacing, shadows, and other system-wide values.
2. Size defaults: values that intentionally vary by supported control height.
3. Canonical primitive: one reusable control or visual behavior.
4. Compound component: a meaningful composition of primitives, such as a field with coordinated actions or a dropdown with selection and clear actions.
5. Tool composition: tool-specific data, orchestration, and layout.
6. Confirmed primitive library: real specimens imported from the canonical system with accurate provenance.

Shared styling belongs in the canonical stylesheet or shared token definitions. Avoid copies of CSS and repeated literal values in consumers.

## 3. Find before building; choose the right change

Search StudioControls.tsx, studio-control-system.css, existing tokens/default maps, the confirmed library, and current consumers. Identify the closest primitive, its API, defaults, variants, and affected usages.

- Fix an existing component when its intended role is correct but its implementation is wrong.
- Add a named variant when the role is the same but a reusable property differs (size, shape, skin, mark, density, or state treatment).
- Add a primitive only when behavior is genuinely distinct and cannot be represented cleanly by an existing primitive or variant.
- Add a compound component when several primitives form a reusable interaction or layout.
- Keep one-off orchestration at the tool layer.

Do not duplicate a primitive merely to avoid updating the canonical implementation. If the API cannot express the need, extend it deliberately and document compatibility impact.

## 4. Reuse canonical defaults

Defaults are a shared contract. Reuse canonical values for font family/size/weight/line-height/text color; foreground/background; border and inline stroke; focus outline/glow; radii/padding/gaps; icon/mark dimensions; disabled/selected/checked states; dropdown rows, checkmarks and action alignment; and responsive wrapping/overflow.

Read current definitions before changing them. Reference shared variables/constants instead of copying values into each component. Add a token only when the concept is reusable and has no existing owner. Keep one-off overrides local, narrowly scoped, and justified. Do not change a global default to solve one consumer without checking all other consumers.

If a default is missing, add it at the shared source-of-truth layer and update affected consumers and the confirmed library in the same coherent change.

## 5. Height-system variants

Use the shared height system for controls whose outer height is a supported control size and whose typography, spacing, borders, marks, and focus treatment are designed to scale together. The Studio system includes 44px and 28px families where explicitly supported; do not assume every component supports every height.

When adding a height variant:

1. Confirm the component belongs to the height system.
2. Extend canonical size defaults and the component API rather than cloning the component.
3. Define the complete ratio set together: height, padding, typography, line-height, icon/mark size, gaps, border/inline stroke, radius, focus outline, glow, and offsets.
4. Preserve family-specific typography defaults; do not set consumer-specific text values to force alignment.
5. Make supported sizes explicit in the API. Do not silently approximate an unsupported size.
6. Test default, hover, focus, disabled, selected/checked, long text, and narrow-container behavior at every supported size.
7. Add the real variant to the confirmed library and identify its default source.

Scaling is intentional, not blind arithmetic. Preserve visual hierarchy and usability. Border and focus effects must not accidentally change layout dimensions.

### Text input and textarea contracts

Text inputs and textareas are separate component families. Do not merge them into one height API.

- 44px text input: default 3px black border and 3px Color 1 inline stroke. On focus, add the 1.5px Color 2 outline and prescribed outer glow.
- 28px text input: default 2px black border and 2px Color 1 inline stroke. On focus, use a 1px outline and proportionally adjusted glow.
- Focused text remains black with the required blue/Color 2 stroke treatment. Focus background uses a 15%-opacity Color 1 fill, not opaque white.
- Input typography follows the canonical default for its component height.
- The paragraph textarea is not governed by the control-height system. Its specified writing-area height is 92px, with 28px-family text sizing and applicable shared border/inline/focus/glow treatment.

Implement these rules once in canonical family defaults. Consumers and library specimens should inherit them, not repeat the values.

## 6. Components outside the height system

Examples include writing textareas, calendars/date grids, tag editors, cards/panels, content previews, and responsive multi-row compositions.

1. Explicitly mark the component as outside the height system and explain why.
2. Define its real sizing contract: fixed/min/max height, aspect ratio, content-driven sizing, grid/row structure, or available space.
3. Reuse shared typography, color, border, focus, spacing, and shadow defaults wherever applicable.
4. Reuse canonical height-based primitives for embedded controls where practical.
5. Define wrapping, scrolling, clipping, resizing, and narrow-width behavior intentionally.
6. Do not label an arbitrary dimension as a 28px/44px control variant.

Outside the height system does not mean outside the design system.

## 7. CSS and layout safety

- Put canonical Studio Controls styles in studio-control-system.css, using component-scoped selectors and shared tokens.
- Do not use catalog-only CSS to conceal defects in the real component.
- Avoid broad selectors, manual offsets, negative margins, and absolutely positioned siblings used to fake alignment.
- Use Grid or Flexbox with explicit gaps. Switches, checkboxes, radio controls, and option groups must wrap to another row when they do not fit; they must not overlap or become misaligned.
- Use min-width: 0, max-width: 100%, and suitable wrapping rules when content can force overflow.
- Keep each interactive control in its own layout item and align labels/marks within that item.
- Dropdowns must preserve canonical size ratios, row spacing, mark sizing, and clear/action alignment at each supported size.
- Check keyboard focus, accessible semantics/labels, zoom, long labels, narrow widths, and overflow.

## 8. Add to the confirmed primitive library

1. Import the real component from the canonical Studio Controls module (src/studio-ui/primitives/StudioControls.tsx or its approved public export).
2. Ensure the real shared stylesheet, studio-control-system.css, is loaded through the intended application path.
3. Do not import SubToolboxPrimitives or style a catalog mock as though it were canonical Studio Controls.
4. Show the real default and meaningful supported variants/states.
5. Use interactive specimens where practical so state changes exercise the real component.
6. Label family, export name, size/variant, states, and whether it participates in the height system.
7. Record TSX source, canonical CSS, token/default source, supported sizes, and dependencies.
8. For components outside the height system, state the actual dimension contract and exception rationale.
9. If a mock is temporarily necessary, label it mock/unverified; never call it a confirmed canonical specimen.
10. Compare the specimen with a real tool consumer to ensure typography, borders, focus, sizing, and behavior match.

Each family should document component/export name, source path, stylesheet, default/token source, supported sizes or explicit exception, variants/states, key dimensions, dependencies, and limitations.

## 9. Required workflow and acceptance checklist

Before coding:
- [ ] Search canonical Studio Controls TSX/CSS, defaults, tokens, consumers, and library.
- [ ] Choose fix, variant, primitive, compound component, or tool composition.
- [ ] Decide whether it belongs to the height system.
- [ ] Record the intended default/state contract and affected consumers.

During coding:
- [ ] Implement new canonical primitives/components in StudioControls.tsx and studio-control-system.css.
- [ ] Reuse shared defaults; avoid duplicate implementations and hard-coded consumer values.
- [ ] Ensure responsive layouts wrap and do not overlap.
- [ ] Preserve accessibility and visible keyboard focus.
- [ ] Update the confirmed library to use the real canonical export.

Before declaring complete:
- [ ] Verify the library specimen matches the production component.
- [ ] Check each supported size and meaningful state.
- [ ] Check narrow layouts, long content, overflow, and alignment.
- [ ] Check affected consumers for regressions.
- [ ] Run available typecheck, build, tests, and browser/visual checks.
- [ ] Report which checks ran and which did not; never imply unrun checks passed.
- [ ] Update provenance and related documentation.
- [ ] Record commit/PR and remaining blockers.

## 10. Review red flags

Reject a change if it adds new canonical controls to the SubToolbox files; duplicates a primitive without justification; copies shared defaults into consumers; changes height without updating related ratios; falsely labels a non-height-system component as a size variant; permits controls to overlap; fixes dropdown proportions only in the catalog; or uses a hand-built look-alike instead of the real component.

## Change log

| Update ID | Action | Date | Summary | Verification | Commit |
|---|---|---|---|---|---|
| DOC-20261013-001 | CREATE / CORRECT | 2026-10-13 EDT | Established the canonical authoring rules and explicitly designated StudioControls.tsx + studio-control-system.css as the source of truth. | Documentation only; runtime/build/browser checks not run. | Pending |