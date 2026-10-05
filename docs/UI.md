# ViewTube UI

**Status:** PROPOSED / CANONICAL UI AUTHORITY TARGET  
**Purpose:** Define the shared UI/design-system boundary used by ViewTube widgets and tools.

## 1. UI Reference Library

The UI Reference Library is intended to contain the actual primitives/reference representatives of the:

- visual style;
- design tokens;
- component system;
- default size system.

It is the visual authority used by widgets and tools.

## 2. Size system

The size system defines **default sizes for widget layouts**.

Components and primitives may adapt to other sizes when required by context.

Therefore:

```text
Size system = default layout guidance
Components/primitives = adaptable building blocks
```

## 3. Widget decision rule

When a widget need arises, choose based on the situation:

1. fix the existing widget;
2. create a new widget;
3. add a variant.

Do not create duplicates merely because a new surface needs a slightly different presentation.

## 4. Design-system layers

```text
Tokens / Style
      ↓
Primitives
      ↓
Components
      ↓
Widgets
      ↓
Tool / SubToolbox layouts
      ↓
Pages / Studio Hub
```

The UI Reference Library should represent the lower-level visual system used throughout these layers.

## 5. Toolbox relationship

The Toolbox and SubToolbox should consume the shared UI system rather than becoming an independent visual system.

Tools should expose actual user-facing controls through reusable components and primitives.

## 6. Current reconciliation needs

The repository contains multiple UI/component recovery artifacts and Toolbox plans. These need consolidation into one authoritative UI system while preserving historical evidence.

Verify:

- current component implementation;
- reference-library contents;
- tokens;
- size definitions;
- responsive behavior;
- production-vs-reference boundaries;
- Toolbox/SubToolbox integration.

**Primary sources:** Studio Hub Ten Tool Architecture; Creator Workspace recovery; Toolbox Component Library Plan; UI recovery artifacts.

## 7. Widget UI Reference Library truth model

The Widget UI Reference Library is a **production reference implementation**, not merely a gallery or documentation mock. It should contain and render the actual production Widget primitives/components that represent the shared visual style, design tokens, default widget-layout sizes, responsive behavior, reusable states, and interaction patterns.

The dependency direction is:

`tokens/style → default size system → production primitives/components → UI Reference Library → widget compositions`

The Library may demonstrate representative contextual sizes and responsive behavior, but those examples must exercise the same production primitives rather than parallel implementations. It validates and demonstrates the system; it does not independently redefine it.

## 8. Widget size-system rule

The established Widget size system defines **default sizes to use when building widget layouts**. It is not a rigid list of permitted component dimensions. Components and primitives may adapt to other sizes when the surrounding layout, density, responsive context, or interaction requirements justify it.

## 9. Widget change decision rule

When a Widget need is identified, choose according to the situation: **fix the existing Widget, create a new Widget, or add a variant**. Do not create duplicates merely because a layout requires a different presentation.

## 10. Widget audit classification

Use exactly four classifications: **CANONICAL** (correct system use), **DRIFT** (a canonical solution exists but is bypassed/duplicated/misused), **DEFECT** (the shared system or implementation is inadequate), and **INTENTIONAL** (legitimate Widget-specific behavior/composition).

For a DEFECT, the corrective action is situation-dependent: fix the existing primitive/component, correct token/size behavior, add a variant, create a new primitive/component, or fix the consuming Widget.

## 11. Composition and semantics

Canonical primitives standardize reusable behavior and visual language; they do not require every Widget to have identical composition. Widgets may arrange shared primitives differently for their own workflows, hierarchy, labels, grouping, and interaction sequences. Semantic/functionality outranks superficial visual similarity; materially different interaction semantics may justify a new primitive/component.

## 12. Reference Library scope

The Widget UI Reference Library should represent foundational production primitives, reusable compound components, canonical shared patterns, and representative default/contextual/responsive states. It should not become a gallery of every Widget's custom internal implementation. It is a special internal/reference surface, not an ordinary creator-facing Widget with independent business meaning or analytics identity.

## 13. Validation rule

Disagreement between the Reference Library and a consuming Widget must be investigated rather than resolved by assuming either side is automatically correct. Trace **source/code → tokens → primitive usage → composition → overrides → rendered result** and classify the result CANONICAL, DRIFT, DEFECT, or INTENTIONAL. Both source/code and rendered UI are required for meaningful certification. The Reference Library provides the shared-primitives baseline; it does not by itself certify an individual Widget.

## 14. Provenance and current status

These decisions were established in the 2026-10-04 Widget UI governance conversation and reconciled against the current canonical documentation system.

**Status:** VERIFIED as project/documentation decision; **runtime implementation alignment:** UNKNOWN pending source-level trace of the canonical Widget primitive, token, size, CSS, Reference Library, and consumer paths.

**Related:** `docs/Widgets.md`, `docs/Toolbox.md`, `docs/Architecture.md`, `docs/recovery/handoffs/VIEWTUBE_ROUND_2_UI_RENDER_RECONCILIATION_2026-10-04.md`.
