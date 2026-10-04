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
