# ViewTube Toolbox

**Status:** RECONSTRUCTION / CANONICAL TARGET  
**Purpose:** Define the reusable tool, SubToolbox and widget capability layer without duplicating UI or Brain architecture.

## 1. Role

The Toolbox is the user-facing capability surface for reusable ViewTube tools and controls.

It sits between shared UI primitives/components and higher-level creator workflows.

```text
UI Reference Library
        ↓
Primitives / Components
        ↓
Widgets
        ↓
Toolbox / SubToolbox
        ↓
Projects / Studio Hub / Dashboard / other surfaces
```

## 2. Toolbox versus SubToolbox

A **Toolbox** is the broader tool/capability surface.

A **SubToolbox** groups related controls or operations within a tool.

A tool should expose its real user-facing controls through this hierarchy rather than creating disconnected UI systems.

## 3. Widget system

Widgets are reusable compositions built from the shared primitives, components, styles, tokens and default sizes.

The UI Reference Library is the visual representative of that system.

When a need arises:

**fix → create new → add variant**, depending on the situation.

## 4. Brain relationship

The Toolbox should expose capabilities; it should not contain separate copies of Brain intelligence.

```text
Brain / services
      ↓
Tool contracts
      ↓
Toolbox controls
      ↓
User action
      ↓
Verification / result
```

## 5. Tool contract

Each reusable tool should document, where applicable:

- purpose;
- inputs;
- workflow;
- outputs;
- controls;
- components;
- dependencies;
- permissions;
- Brain relationship;
- project handoff;
- evidence/verification;
- implementation status.

## 6. Current issues and risks

Recovered work identifies Toolbox/SubToolbox instability and compatibility/export concerns. The safe direction is consolidation and surgical compatibility restoration rather than rebuilding known-good systems from memory.

The current canonical implementation must be verified before this document is promoted from reconstruction to verified architecture.

## 7. Current reconciliation needs

- identify the current Toolbox implementation;
- identify canonical SubToolbox primitives;
- reconcile component/reference-library sources;
- map tool-specific controls;
- verify export compatibility;
- separate historical recovery artifacts from current implementation;
- document production verification.

**Primary sources:** Toolbox Component Library Plan; Creator Workspace recovery; Studio Hub Ten Tool Architecture; Toolbox compatibility/export recovery.
