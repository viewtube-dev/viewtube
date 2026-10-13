# ViewTube CSS Primitives & Studio Controls Authoring Guide

**Status:** ACTIVE — implementation guide  
**Authority:** Canonical authoring guide for CSS primitives, reusable components, and confirmed-library specimens  
**Owner:** UI system / Studio Controls  
**Canonical location:** docs/Studio-Controls-Authoring-Guide.md  
**Created:** 2026-10-13 (America/New_York; EDT)  
**Last Updated:** 2026-10-13 (America/New_York; EDT)  
**Source:** Studio Controls, UI Reference Library, confirmed primitive catalog, and user-directed design-system requirements  
**Related Documents:** docs/UI.md, docs/Toolbox.md, docs/Widgets.md, docs/Testing.md, src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx, src/styles/subtoolbox-system.css  
**Supersedes:** None

## 1. Purpose and governing rule

This guide defines how to add and maintain CSS primitives and Studio Controls components, reuse shared defaults, implement supported size variants, handle components outside the height system, and add honest specimens to the confirmed primitive library.

> Reuse the canonical implementation and defaults first. A confirmed-library specimen must render the real component and its real styles—not a look-alike recreation.

The confirmed library is a live reference and review surface, not a second implementation system. Do not copy production CSS into the library to imitate a component.

## 2. Source-of-truth hierarchy

Use the narrowest correct layer and let changes propagate from it:

1. **Design tokens and global defaults:** color, typography, borders, focus, radii, spacing, shadows, and shared state values.
2. **Size defaults:** dimensions and ratios that vary by supported component height.
3. **Canonical primitive:** smallest reusable control or visual behavior.
4. **Compound component:** reusable composition of primitives.
5. **Tool composition:** tool-specific layout, data flow, and orchestration.
6. **Confirmed primitive library:** live specimens, variant/state coverage, and implementation provenance.

Before building, search for existing primitives, components, CSS variables, defaults, variants, shared stylesheets, library specimens, and consumers. Reuse the canonical source. If a change should propagate across tools, change the shared source rather than patching each consumer.

## 3. Choose the correct change type

- **Fix the existing component** when the role is right and the implementation is wrong: typography, focus, border thickness, dropdown ratios, wrapping, or alignment.
- **Add a variant** when the semantic role stays the same but a reusable property changes: supported size, shape, skin, density, mark, or state presentation.
- **Create a primitive** when the smallest reusable behavior is genuinely different and cannot be expressed clearly by an existing primitive or variant.
- **Create a compound component** when multiple primitives form a reusable interaction or field, such as an input plus coordinated action row.
- **Keep a tool-level composition** for tool-specific layout, orchestration, and data wiring.

Before creating a new component, document why the closest existing component cannot meet the requirement. Prefer explicit named variants over a proliferation of unrelated boolean props.

## 4. Reuse default values, styles, and settings

Defaults are the baseline contract. Consumers should not restate values the canonical system already owns.

Reuse shared defaults for:
- font family, text size, weight, line height, and text color;
- background/foreground colors and opacity;
- border width, color, style, and radius;
- focus border/outline/glow and selected, checked, hover, active, and disabled states;
- padding, gaps, alignment, control dimensions, icon/mark sizes;
- dropdown rows, option marks, clear actions, and menu spacing;
- responsive wrapping and minimum sizing.

Rules:
1. Read the current token/default definitions before changing values.
2. Reference existing CSS custom properties or exported constants rather than copying literals.
3. Add a token only if the concept is reusable and has no existing owner.
4. Keep component-specific overrides local and explain why they are necessary.
5. Do not change a global default to fix one tool without checking all consumers.
6. Avoid inline style overrides that bypass the system; use documented token interfaces when runtime values are necessary.
7. A component may inherit a default without repeating it in its CSS. Its library specimen must demonstrate that inherited default, not invent another.
8. If a required default is missing, add it at the correct shared layer and update consumers and documentation in the same coherent change.

## 5. Components that use the height system

Use the shared height system when the component's overall control height is a supported size and typography, spacing, strokes, and state effects should scale together. Current Studio Controls families include 44px and 28px variants; 20px is valid only for families that explicitly support it. Do not assume every primitive supports every size.

### Adding a height variant

1. Confirm the component is intended to participate in the height system.
2. Find the canonical size-default map and existing variant selectors.
3. Define the new size as a coherent ratio set, not an isolated height change.
4. Include dependent values: height, horizontal padding, font size/weight, line height, icon/mark size, gap, border thickness, radius when applicable, focus outline, glow spread, and offsets.
5. Use shared variables/classes. Do not duplicate the whole component to create another height.
6. Make the size API explicit and reject or clearly handle unsupported sizes.
7. Test default, focus, hover, disabled, selected/checked, and long-content states at each supported size.
8. Check clipping, baseline alignment, overflow, and collisions with adjacent controls.
9. Add the real variant to the confirmed library with source provenance.

Scaling is proportional but not blind arithmetic. Preserve the family’s visual hierarchy and minimum legibility. Typography may use family-specific defaults; border/mark strokes, focus outlines, glow, and hit areas may have minimum values. Follow canonical family rules.

### Current text-field family requirements

These requirements belong in canonical family defaults, not as repeated hard-coded values in consumers:

- **44px text input:** 3px black default border and 3px Color 1 inline stroke. Focus adds a 1.5px Color 2 outline and the prescribed outer glow.
- **28px text input:** 2px black default border and 2px Color 1 inline stroke. Focus outline is 1px and glow is adjusted proportionally.
- Focus text remains black with the specified blue/Color 2 stroke treatment. Focus background uses a 15%-opacity Color 1 fill, not opaque white.
- Text inputs and textareas are distinct component families. Do not force a writing-area textarea into the height system.
- The specified paragraph textarea is 92px high, uses the 28px-family text sizing, and retains its own textarea dimension contract alongside the applicable shared stroke/focus treatment.

Use the component’s canonical text sizing and weight for its supported height. Do not set a consumer-specific font size merely to align a single page.

## 6. Components outside the height system

Examples include writing-area textareas, calendars/date grids, multi-row tag editors, cards/panels, responsive compound layouts, content previews, and menus whose height depends on available space or item count.

For these components:
1. Explicitly state that the component is not height-system-based and why.
2. Define its real dimension contract: fixed/min/max height, aspect ratio, content sizing, row count, grid tracks, or available space.
3. Continue to reuse shared typography, colors, borders, focus, spacing, and shadow tokens wherever applicable.
4. Reuse size-system primitives for embedded controls where practical.
5. Specify wrapping, scrolling, clamping, resizing, and overflow behavior intentionally.
6. Do not label an arbitrary dimension as a canonical 28px/44px variant.
7. Include the exception rationale in the confirmed library.

Not using the height system does not mean being exempt from the design system.

## 7. CSS and component implementation rules

### One canonical implementation
- Put shared styles in the stylesheet or component module that owns the primitive.
- Use component-scoped class names; avoid broad selectors that unexpectedly affect other tools.
- Prefer tokens/custom properties over duplicated values.
- Keep markup, styles, and state behavior aligned with the component contract.
- Do not add catalog-only overrides to conceal production defects.
- Catalog layout CSS may arrange specimens, but must not change the actual visual treatment of the control.

### Separate text inputs and textareas
Maintain separate component-family contracts and library sections. Inputs use supported control heights; textareas use writing-area dimensions and paragraph-oriented typography. They may share tokens and focus recipes without sharing the same size API.

### Complete focus treatment
Treat focus as a coordinated state: text treatment, background fill, border/inline stroke, outline, and glow. Ensure visual effects do not unintentionally change layout dimensions. Keep keyboard focus visible.

### Prevent overlap by default
- Use Grid or Flexbox with explicit gap; do not align controls using manual offsets or negative margins.
- Let switches, checkboxes, radio controls, and option groups wrap onto subsequent rows when they do not fit.
- Apply appropriate min-width: 0, max-width: 100%, and wrapping rules so intrinsic content cannot force collisions.
- Keep each interactive control in its own layout item; align labels and marks inside that item.
- Do not absolutely position siblings to fake a row.
- Test narrow containers, long labels, mixed sizes, and browser zoom.
- Dropdowns must preserve canonical size ratios, row spacing, mark sizes, and clear/action alignment at every supported size. Fix the shared menu, not only the library specimen.

## 8. Add components to the confirmed primitive library

For every new primitive/component or meaningful variant:

1. **Import the production implementation.** Use the real export and shared stylesheet/tokens.
2. **Show its real default.** Do not replace production styling with a catalog-only mock.
3. **Show relevant variants and states.** Include supported sizes, shapes/skins, selected/unselected, focus, and disabled states where meaningful.
4. **Use interactive specimens where practical.** The specimen should respond like the component.
5. **Label the contract.** Identify component, variant, size, state, and height-system participation.
6. **Record provenance.** Identify source TSX/JSX, canonical CSS, token/default source, and shared primitive dependencies.
7. **Show exceptions honestly.** Explain non-height-system behavior and demonstrate actual dimensions.
8. **Never mislabel a substitute.** If a mock is temporarily necessary, label it mock/unverified—not canonical.
9. **Compare against a real consumer.** Check that the catalog has not introduced different typography, borders, shadows, colors, or sizing.
10. **Keep helpers behavior-preserving.** Specimen wrappers may simplify presentation but must not fork the control implementation.

### Required specimen metadata

Each family should identify:
- family and component name;
- primitive/component export name;
- source implementation path and stylesheet path;
- token/default source;
- supported size(s), or explicit non-height-system designation;
- variants and meaningful states;
- key dimensions/ratio contract;
- shared primitive dependencies;
- known limitations and unverified behavior.

Distinguish canonical source, derived variant, catalog layout, and mock/unverified. They are not interchangeable.

## 9. Workflow and acceptance checklist

### Before coding
- [ ] Search existing components, tokens, CSS, defaults, and library entries.
- [ ] Identify canonical source and target branch/base.
- [ ] Choose fix, variant, primitive, compound component, or tool-level composition.
- [ ] Decide whether the component uses the height system.
- [ ] Record the default/state contract and likely affected consumers.

### During implementation
- [ ] Reuse shared defaults and CSS variables.
- [ ] Change the correct source-of-truth layer.
- [ ] Avoid duplicate implementations and catalog-only styling.
- [ ] Ensure controls wrap and cannot overlap at normal responsive widths.
- [ ] Preserve semantic accessibility, keyboard operation, and visible focus.
- [ ] Document exceptions and new tokens.

### Before declaring complete
- [ ] Confirm the confirmed library imports the actual production component.
- [ ] Confirm displayed styling matches the production implementation.
- [ ] Check all supported sizes and meaningful states.
- [ ] Check long text, narrow layouts, and overflow.
- [ ] Check related consumers for regressions.
- [ ] Run relevant typecheck, build, tests, and browser/visual checks where available.
- [ ] Report which checks ran and which did not; never describe untested work as verified.
- [ ] Update specimen provenance and relevant documentation.
- [ ] Record commit/PR and remaining blockers.

## 10. Review red flags

Request changes if:
- a new component duplicates an existing primitive without a reason;
- a consumer hard-codes values owned by canonical defaults;
- a size changes height but leaves typography, spacing, strokes, marks, or focus effects inconsistent;
- a non-height-system component is falsely presented as a standard size variant;
- text inputs and textareas are conflated without a clear contract;
- switches, checkboxes, radio buttons, or dropdown options overlap at ordinary widths;
- dropdown proportions diverge from canonical rules;
- the confirmed library uses a look-alike rather than the production component;
- catalog-only CSS makes a broken component appear correct;
- source paths, defaults, or verification claims are inaccurate or missing.

## 11. Maintenance

Update this guide when the canonical size system, shared defaults, confirmed library, or authoring workflow changes. If source code and documentation disagree, investigate and correct the source-of-truth; documentation alone does not prove implementation correctness.

### Change Log

| Update ID | Conversation / Agent | Application | Action | Created | Edited | Time | Summary | Important Information | Verification | Commit |
|---|---|---|---|---|---|---|---|---|---|
| DOC-20261013-001 | UI system authoring request | GitHub repository | CREATE | 2026-10-13 | 2026-10-13 | EDT; exact operation time not captured | Created canonical guide for primitive/component authoring, shared defaults, size variants, exceptions, layout safety, and confirmed-library specimens. | Current input/textarea and control-layout requirements are documented as family contracts, not as claims of verified implementation. | Documentation prepared; runtime checks not run. | Pending |
