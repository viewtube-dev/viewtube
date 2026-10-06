# ViewTube Studio Hub — UI Architecture

**Status:** ACTIVE — canonical UI architecture target
**Date:** 2026-10-05

## Purpose
Studio Hub tools must be real creator-facing workspaces, not configuration-only mockups.

The ViewTube UI Reference Library is the visual source of truth for primitives, components, tokens, styles, and default sizes.

## UI reference rules
- The UI Reference Library contains the actual primitives and visual representatives of the ViewTube style/token/size system.
- The size system defines default sizes for widget layouts.
- Components and primitives remain adaptable to other sizes.
- When a widget requirement appears: fix an existing widget if it is wrong; add a variant if the existing primitive needs a meaningful variation; create a new widget only when the requirement is genuinely new.
- Do not create parallel visual systems inside Studio Hub.

## Standard Tool Module
~~~text
Tool Module
 ├── Tool Header
 ├── Primary Outcome
 ├── SubToolboxes
 │    ├── Controls
 │    ├── Filters
 │    └── Modes
 ├── Main Workspace
 ├── Evidence / Context
 ├── Result
 └── Handoff Actions
~~~

Every tool must show its actual user-facing layout and controls.

## Required UI capabilities
- real controls;
- realistic data/content;
- primary action;
- supporting actions;
- evidence/context;
- result view;
- detail views;
- typed handoffs;
- empty, loading, active, success, warning, and error states;
- insufficient-evidence state where relevant;
- user-controlled promotion.

## Tool header
The header should make ownership immediately understandable:
- tool name;
- primary transformation/outcome;
- short description;
- status/context;
- Learn More / contextual help;
- relevant project/content scope.

## SubToolboxes
SubToolboxes organize controls without creating competing top-level tools.

Typical groups:
- Context
- Inputs
- Filters
- Modes
- Evidence
- Generation
- Evaluation
- Actions
- Handoffs
- History

## Main workspace
The main workspace prioritizes the transformation.

Examples:
- Opportunity Radar: ranked opportunity cards + evidence drawer.
- Content Architect: concept comparison workspace.
- Video Director: production direction workspace.
- Asset Forge: requirement-to-asset mapping.
- Thumbnail Studio: packaging comparison.
- Video Manager: published metadata management.
- Video Publisher: multi-project publication readiness.
- Pre/Post Analysis: evidence and findings workspace.
- Audience Studio: audience opportunity queue.
- Tactics Engine: action/intervention workspace.
- Revenue Architect: revenue opportunity/economics matrix.
- Creator Strategy Engine: decision workspace.

## Evidence/context layer
AI-driven results should expose source, evidence, confidence, uncertainty, assumptions, validation state, related project/content/asset, and provenance.

Do not hide important reasoning behind a generic chatbot surface.

## Result/action layer
Typical actions:
- Save
- Compare
- Review Evidence
- Edit
- Promote
- Create Project
- Send to Tool
- Run Experiment
- Save to Brain when validation permits
- Defer
- Cancel

The receiving tool should show what it will do with a handoff.

## Handoff UI
Show:
From → To → Object → Why → Evidence → Confidence → State → Next action

High-impact handoffs should require appropriate user review rather than silently changing project state.

## State architecture
### Empty
Explain what the tool does and what input is required.

### Loading
Show the current operation and progress without pretending a result exists.

### Active
Show usable controls and current evidence.

### Success
Show the result and next logical actions.

### Warning
Explain uncertainty, missing evidence, conflicts, or constraints.

### Error
Explain what failed and provide a recoverable next action.

### Insufficient Evidence
Distinguish lack of evidence from a negative finding.

### Expired
For time-sensitive opportunities/predictions, explain why the result is stale.

## UI ownership
- Studio Hub tools own specialized workspaces.
- Projects owns execution views.
- Analytics owns measurement views.
- AI Brain owns durable knowledge views.
- Asset Engine/Vault owns reusable asset views.
- Editor owns editing views.
- Resource Library owns reference-resource views.

Do not duplicate another system's canonical workspace merely to make a handoff feel local.

## Responsive and adaptable sizing
The ViewTube size system supplies default layout sizes. Components/primitives can adapt to different contexts. The goal is predictable defaults with responsive composition, not one fixed component size.

## Accessibility and interaction quality
Studio Hub UI should maintain:
- semantic controls;
- keyboard-accessible interactions;
- visible focus;
- clear labels;
- appropriate contrast;
- meaningful empty/loading/error states;
- non-color-only status communication;
- accessible tooltips/help;
- predictable navigation;
- readable evidence and uncertainty.

## UI implementation sequence
1. confirm ownership;
2. identify existing UI Reference Library primitives;
3. identify default size/layout;
4. reuse existing widgets;
5. fix existing widgets when incorrect;
6. add variants where needed;
7. create a new widget only for genuinely new requirements;
8. build Tool Module;
9. add SubToolboxes;
10. implement real controls;
11. implement evidence/context;
12. implement result/actions;
13. implement handoffs;
14. implement all relevant states;
15. verify against the tool success metric.

## UI governance
Every Studio Hub UI change must answer:
- Is there an existing primitive?
- Is there an existing widget?
- Can it be fixed?
- Is a variant sufficient?
- Why is a new widget necessary?
- Which token/style/size source controls it?
- Which tool owns the interaction?
- Does the change duplicate another workspace?
- Does the UI expose evidence and uncertainty appropriately?

The UI system evolves through the existing ViewTube Reference Library rather than one-off Studio Hub styling.


## Metadata Master UI module — ACTIVE

Metadata Master uses the standard Tool Module with a distinctive package-first interior:

~~~text
METADATA MASTER
 ├── Context + Optimization Brief
 ├── Generate + Optimize
 ├── Publication Package Canvas
 │    ├── Title
 │    ├── Thumbnail Direction
 │    ├── Description
 │    ├── Tags
 │    ├── Chapters
 │    ├── Category
 │    ├── Playlists
 │    └── End Screen / Related Video
 ├── Evaluate + Compare
 │    ├── Package Score
 │    ├── Warnings
 │    └── Package A/B/C
 ├── Handoff + Publishing Control
 └── Package History
~~~

The Package Canvas is the primary workspace. Individual fields remain editable, but the user can generate/refine the whole package or selected components.

The UI preserves the title/thumbnail relationship as one packaging decision rather than treating those assets as unrelated fields.

