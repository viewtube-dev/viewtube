# ViewTube Studio Hub — Full UI / Component / Primitive Audit

**Date:** 2026-10-06  
**Audit type:** UIAudit technical implementation + component-system audit  
**Baseline:** `main` in `viewtube-dev/viewtube`  
**Primary page:** `src/views/StudioHub.tsx`  
**Audit mode:** source/code evidence first; live visual observations are supplementary  
**Scope:** every currently mounted Studio Hub module, its Toolbox/SubToolbox structure, component/primitive usage, design-system adherence, special settings, hard-coded styling, and layout/function discoverability.

---

## 1. Executive finding

The Studio Hub is **not yet a uniformly canonical Toolbox/SubToolbox implementation**.

The page currently mounts a mixture of:

- canonical `ToolboxScaffold` / `SubToolbox` primitives;
- canonical SubToolbox control primitives;
- specialized ViewTube components that are legitimate extensions of the system;
- the separate `Studio UI` control family;
- bespoke inline visual/layout components;
- substantial hard-coded Tailwind geometry/color/shadow values.

This does **not** mean all bespoke UI must be deleted. A visual workspace such as Video Director, Thumbnail Studio, or End-Screen Architect legitimately needs specialized visualizations. The governance question is whether those specialized pieces are **built on the canonical primitive/token/layout system** or are silently creating a second UI system.

The audit therefore separates:

1. **Canonical:** uses the production Toolbox/SubToolbox system directly.
2. **Canonical + specialized:** canonical shell/controls plus legitimate domain-specific visual components.
3. **Hybrid:** canonical Toolbox system mixed with the separate `Studio UI` control family.
4. **Bespoke / drift risk:** significant custom geometry, color, shadows, fixed dimensions, or native control styling that should be reconciled with the canonical system.
5. **Intentional certification exception:** component-library demo code whose hard-coded anatomy is explicitly frozen for visual certification.

---

# 2. Ten additional audit dimensions

Before auditing individual components, these are the ten additional dimensions that should govern the Studio Hub update plan.

## A. Tool identity and decisive outcome

Every Toolbox should immediately answer:

- What is this tool?
- What transformation does it perform?
- What should the creator leave with?
- What is the primary action?

**Audit question:** Can the user understand the tool's purpose before opening or scanning its controls?

## B. Information architecture and hierarchy

Audit the relationship between:

**Toolbox → SubToolbox → Section → Control → Result → Handoff**

Check for:

- unnecessary nesting;
- duplicate titles;
- controls separated from the workspace they affect;
- important outputs buried below setup controls;
- excessive accordion depth.

## C. Primary-action visibility

Every tool needs a visually decisive primary action.

Audit:

- location;
- prominence;
- wording;
- icon;
- disabled state;
- loading state;
- relationship to required inputs.

A tool should not make the user hunt for the action that defines its purpose.

## D. Feature discoverability and completeness

Audit whether the UI exposes **all implemented functions**.

Look for:

- capabilities that exist in code but are buried;
- secondary actions with no obvious entry point;
- hidden modes;
- inaccessible history;
- generated outputs without clear next actions;
- handoffs that exist technically but are visually obscure.

## E. Component ownership and reuse

For every control ask:

1. Does a canonical primitive already exist?
2. Is the existing primitive being used?
3. If not, why?
4. Is this actually a new component family?
5. Should the existing primitive gain a variant instead?

This prevents Studio Hub from accumulating parallel controls.

## F. State architecture

Audit every tool for:

- empty;
- loading;
- active;
- success;
- warning;
- error;
- insufficient evidence;
- stale/expired where applicable;
- disabled;
- partially complete;
- saved/unsaved.

The state must be communicated through the canonical components, not improvised per tool.

## G. Workflow continuity and handoffs

Audit:

**From → To → Object → Why → Evidence → Confidence → State → Next action**

Check whether Projects, ContentBuild, Publishing Packages, Asset Engine, AI Brain, Analytics, Editor, and other tools are visually represented as real workflow relationships.

## H. Responsive composition and density

Audit:

- mobile stacking;
- narrow-container behavior;
- minimum control sizes;
- fixed heights;
- fixed widths;
- grid collapse;
- action-row behavior;
- text wrapping;
- overflow;
- scroll containment.

The size system supplies defaults; components should remain adaptable rather than being locked to arbitrary dimensions.

## I. Accessibility and interaction semantics

Audit:

- labels;
- ARIA;
- keyboard navigation;
- focus visibility;
- semantic headings;
- button semantics;
- status announcements;
- tooltip/help behavior;
- non-color-only status;
- touch targets.

Special visual controls must retain the accessibility quality of canonical controls.

## J. Visual-system integrity

Audit:

- token usage;
- palette usage;
- border weights;
- radii;
- shadows;
- typography;
- icon sizing;
- spacing;
- animation;
- dark/light behavior;
- arbitrary Tailwind values;
- hard-coded hex colors.

The target is **one ViewTube visual language**, not identical-looking tools.

---

# 3. Current Studio Hub page inventory

Current runtime source in `src/views/StudioHub.tsx` mounts:

1. Toolbox UI Reference Library
2. Video Manager
3. Concept + Scene Studio
4. Video Director
5. Studio Publishing Cockpit / Publishing Package
6. Video Publisher
7. Metadata Master
8. Media Analyzer / Content Analysis
9. Thumbnail Studio
10. Community Posts
11. Comment Responder
12. End-Screen Architect
13. Pre-Launch Priming
14. Hook Generator
15. Actionable Tactics / Tactics Engine
16. Script Architect

### Important governance mismatch

The canonical product inventory document currently defines a proposed Round 1 inventory of 13 tools:

- Opportunity Radar
- Content Architect
- Video Director
- Asset Forge
- Thumbnail Studio
- Video Manager
- Video Publisher
- Pre-Publication Analysis
- Post-Publication Analysis
- Audience Studio
- Tactics Engine
- Revenue Architect
- Creator Strategy Engine

The actual page contains a different 15-tool-plus-reference-library runtime composition.

**Recommendation:** reconcile the runtime inventory and product ownership inventory before adding more Studio Hub tools. The UI should not become the place where unresolved ownership decisions accumulate.

---

# 4. Canonical component authority

The canonical production system is centered on:

- `src/components/Toolbox.tsx`
- `src/components/subtoolbox/SubToolboxPrimitives.tsx`
- `src/components/subtoolbox/SubToolboxLayouts.tsx`
- `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx`
- `src/components/subtoolbox/tokens.ts`
- `src/styles/toolbox-system.css`
- `src/styles/subtoolbox-system.css`
- `src/styles/toolboxPalette.ts`
- `src/studio-ui/tokens.ts`

The Toolbox implementation explicitly defines the main shell geometry and canonical icon contracts.

Important canonical defaults include:

- main Toolbox stroke: 5px;
- main Toolbox shadow: 10px;
- canonical Toolbox icon props;
- canonical SubToolbox icon props;
- canonical palette cycling;
- canonical collapse behavior;
- canonical L0/L1/L2 control levels;
- canonical stack/grid/action layout primitives.

The SubToolbox primitive layer provides canonical controls including:

- Input
- TextArea
- Labeled Input
- Labeled TextArea
- Select
- Button
- Icon Button
- Header controls
- Header Toggle
- Toggle Switch
- Check Control
- Radio Control
- Tag/Tag Editor families
- File Target
- Output Card
- State Panel
- Alert
- Data Table
- Video Selector
- and other registered families.

The layout layer provides:

- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxActions`
- `SubToolboxSection`

---

# 5. Tool-by-tool component and primitive audit

## 5.1 Toolbox UI Reference Library

**Source:** lazy-mounted from `ToolboxUIReferenceLibrary`.

### Role
Canonical visual reference/certification surface.

### Important distinction
`StudioHubCompletePrimitiveCatalog.tsx` explicitly contains a **frozen hard-coded certification baseline**.

It is therefore an intentional exception to the normal production-control rule.

### Registered families
The catalog currently declares 62 component families, including:

- Primary Button
- Secondary Button
- Neutral Button
- Destructive Button
- Square Icon Button
- Split Left Button
- Head Tail Action
- Split Menu
- Dropdown
- Select Menu
- Context Menu
- Text Input
- Textarea
- Split Search
- Number Field
- Input Action
- Stepper
- Slider
- Range Slider
- Toggle
- Settings Switch
- Checkbox
- Radio
- Segmented Choice
- Button Group
- Tag
- Removable Tag
- Selectable Tag
- Tag Editor
- Badge
- Status Badge
- Progress Bar
- Progress Value
- KPI
- Stat Card
- Metric Strip
- Tooltip
- Popover
- Disclosure
- Divider
- Horizontal Scrollbar
- Vertical Scrollbar
- Data Stats Module
- Disabled Button
- Disabled Split Button
- Upload Frame
- Pagination
- Vault Landscape Asset
- Vault Portrait Asset
- Vault Audio Asset
- Vault Document Asset
- Knob Dial
- Controller Switch
- LED Light
- Alphabetical Spectrum Tags
- Icon Rail Control
- Two Color Data Stats
- Monochrome Data Stats
- Tiny Data Stats
- Tooltip Dark
- Tooltip Color
- Dashboard Pill Tags

### Status
**Intentional certification exception.**

### Audit action
Do not treat its hard-coded demo anatomy as production drift. Instead, ensure production tools consume the actual canonical families demonstrated here.

---

# 5.2 Video Manager

**Source:** `src/views/VideoManager.tsx`

### Tool shell
- `ToolboxScaffold`

### Major nested systems
- `ProjectManifestation`
- `CanonicalMetadataSections`
- `PublishingControls`
- Metadata Master handoff
- YouTube video selector/data workflow

### Canonical primitives used
- `SubToolboxActions`
- `SubToolboxAlert`
- `SubToolboxButton`
- `SubToolboxDataTable`
- `SubToolboxGridActionButton`
- `SubToolboxIconButton`
- `SubToolboxLinkButton`
- `SubToolboxOutputCard`
- `SubToolboxStatePanel`
- `SubToolboxTag`
- `SubToolboxVideoSelector`
- `SubToolboxShellAction`

### Special canonical components
- `CanonicalMetadataSections`
- `PublishingControls`
- `ProjectManifestation`
- ranked tag rendering through `SubToolboxTagEditor`

### Special settings
- canonical metadata order;
- Education category conditional behavior;
- ranked tag visualization;
- Generate / Refine / Analyze action-row behavior;
- project load/save;
- published-video ownership boundary.

### Hard-coded/drift evidence
Source contains arbitrary geometry and colors including:

- `bg-[#00CCFF]`
- `bg-[#CC99FF]`
- fixed heights such as `h-[70vh]`, `h-[500px]`
- multiple `min-h-[...]` values.

### Verdict
**Canonical + specialized, with layout cleanup required.**

The metadata architecture is one of the strongest canonical implementations, but the outer workspace still contains arbitrary sizing/color decisions that should be reconciled.

---

# 5.3 Concept + Scene Studio

**Source:** `src/views/ConceptSceneStudio.tsx`

### Toolboxes
- CONCEPT + SCENE STUDIO
- CONCEPT FORGE
- DIRECTION DECK
- SCENE DESIGN STUDIO
- PRODUCTION HANDOFF

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxDropdownControl`
- `SubToolboxGridActionButton`
- `SubToolboxInnerActionButton`
- `StandardInput`
- `StandardTextArea`

### Special behavior
- local draft persistence;
- concept candidate generation;
- scene generation;
- concept selection;
- scene reordering;
- production handoff.

### Drift evidence
Large amount of bespoke geometry/color:

- arbitrary font sizes;
- `rounded-[...]`;
- `border-[3px]`;
- arbitrary shadows;
- many hard-coded hex colors;
- fixed minimum heights.

### Verdict
**Canonical shell + substantial bespoke visual layer.**

The concept/scene cards are legitimate domain-specific workspace elements, but their geometry and visual tokens should be derived from the canonical component/token system rather than independently authored.

---

# 5.4 Video Director

**Source:** `src/views/VideoDirector.tsx`

### Toolboxes
- Video Director
- Director Brief
- Storyboard & Scope
- Director Settings
- Director Readiness
- Variation Matrix
- Catalog Digest
- Recipe Library
- Prompt Inspector
- Generation Plan

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxSection`
- `SubToolboxFieldLabel`
- `SubToolboxBadge`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxToggle`
- `SubToolboxActions`
- `SubToolboxInnerActionButton`
- `SubToolboxSurface`
- `SubToolboxFileTarget`
- `SubToolboxTag`
- `SubToolboxSelectableListRow`
- `SubToolboxDropdownControl`
- `SubToolboxMetric`
- `SubToolboxGridActionButton`

### Specialized Studio UI family
Video Director also uses:

- `StudioButton`
- `StudioInput`
- `StudioNumberInput`
- `StudioSelect`
- `StudioTextArea`
- `StudioSplitLeftButton`

and numerous specialized Director components:

- ConceptDeck
- StyleDeck
- MoodVisual
- CompositionVisual
- LensVisual
- CameraPath
- FocusDepth
- PerspectiveRig
- PaletteBoard
- GradeBoard
- TextureStack
- LightingVisual
- PacingVisual
- ShotStructure
- TransitionBridge
- SpeedCurve
- DialogueLane
- MusicBeat
- SfxLane
- AudioStage
- CaptionPreview
- TitleCanvas
- OverlayStack
- EffectsStack
- ReferenceBoard
- ContinuityLedger
- NegativeBank
- OutputCard
- OutputFrame

### Verdict
**Canonical + specialized + hybrid.**

This is the largest special-case surface in Studio Hub.

The domain-specific visual components are justified. The use of `StudioButton`, `StudioInput`, `StudioSelect`, `StudioTextArea`, and `StudioSplitLeftButton` must be reviewed against the canonical SubToolbox primitive registry.

### Priority
**P1 system migration candidate.**

---

# 5.5 Studio Publishing Cockpit / Publishing Package

**Source:** `src/components/studio-hub/StudioPublishingCockpit.tsx`

### Toolbox
- Publishing Package

### Canonical primitives
- `SubToolbox`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxOutputCard`
- `SubToolboxActions`
- `SubToolboxButton`
- `SubToolboxStatePanel`

### Special settings
- readiness state;
- transaction state;
- canonical asset IDs;
- Open Publisher / Fix Package;
- Open Project.

### Verdict
**Strong canonical implementation.**

No arbitrary geometry/color drift detected in this source.

### Improvement
Make the handoff relationship more visually explicit:

**Publishing Package → Video Publisher → YouTube**

and expose why the package is blocked when requirements are missing.

---

# 5.6 Video Publisher

**Source:** `src/views/VideoPublisher.tsx`

### Toolboxes
- VIDEO PUBLISHER
- Publishing Control
- 10-Step Transaction
- Video Upload
- Video Script
- Video Info
- Generate Assets
- Generated Assets

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `ToolboxHeaderToggle`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxActions`
- `SubToolboxButton`
- `SubToolboxFileTarget`
- `SubToolboxInput`
- `SubToolboxTextArea`
- `SubToolboxGridActionButton`
- `SubToolboxOutputCard`
- `SubToolboxStatePanel`
- `SubToolboxLinkButton`

### Shared canonical components
- `ProjectManifestation`
- `CanonicalMetadataSections`
- `MetadataMaster`
- `BrainLiveToolInbox`
- `ViewTubeHandoffReceiver`
- `PostActionReflection`

### Special settings
- workspace/intelligence mode toggle;
- longform/shorts mode;
- canonical metadata order;
- ten-step transaction;
- project loading/saving;
- package readiness;
- publish progress.

### Recent source integrity issue
A malformed literal `\\n` JSX insertion was fixed in commit:

`597ca1de3c7c644b089c4fc2825d60ac5a59b038`

### Verdict
**Strong canonical implementation.**

Primary remaining audit work is hierarchy/density rather than primitive replacement.

---

# 5.7 Metadata Master

**Source:** `src/views/MetadataMaster.tsx`

### Toolboxes
- METADATA MASTER
- 01 CONTEXT + OPTIMIZATION BRIEF
- 02 GENERATE + OPTIMIZE
- 03 PUBLICATION PACKAGE CANVAS
- 04 EVALUATE + COMPARE
- 05 HANDOFF + PUBLISHING CONTROL
- 06 PACKAGE HISTORY

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxStatePanel`
- `SubToolboxButton`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxSection`
- `SubToolboxInput`
- `SubToolboxSelect`
- `SubToolboxActions`
- `SubToolboxTextArea`
- `SubToolboxOutputCard`
- `SubToolboxAlert`

### Verdict
**Canonical.**

### Important audit requirement
Preserve the package-first workspace and do not regress into a form-only metadata panel.

---

# 5.8 Media Analyzer / Content Analysis

**Source:** `src/views/MediaAnalyzer.tsx`

### Toolboxes
- CONTENT ANALYSIS
- VIDEO
- SCRIPT
- VIDEO INFO
- ANALYSIS DIRECTIVE
- CONTENT OVERVIEW
- STRATEGIC ANALYSIS

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxFileTarget`
- `SubToolboxButton`
- `SubToolboxTextArea`
- `SubToolboxInput`

### Additional visualization
Uses chart components for analytical output.

### Drift evidence
Many hard-coded palette colors and explicit geometry:

- arbitrary colors;
- `border-[4px]`;
- `shadow-[4px_4px_0px_0px_black]`;
- additional arbitrary borders and colors.

### Verdict
**Canonical shell + visualization styling drift.**

Charts should retain their domain-specific visual identity, but surrounding controls/cards should be tokenized through the canonical system.

---

# 5.9 Thumbnail Studio

**Source:** `src/views/ThumbnailStudio.tsx`

### Toolboxes
- THUMBNAIL STUDIO
- Concept
- Styles
- Expression
- Hook Text
- Images
- Palette (60-30-10)

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxSegmentedToggle`
- `SubToolboxActionButton`
- `SubToolboxSelectableTag`
- `SubToolboxSelectableListRow`
- `SubToolboxFileTarget`
- `SubToolboxSelect`
- `SubToolboxIconButton`
- `SubToolboxDropdownControl`
- `SubToolboxButton`
- `SubToolboxGridActionButton`

### Specialized
- thumbnail history;
- image references;
- aspect ratio/image size controls;
- thumbnail generation workspace.

### Drift evidence
Significant arbitrary geometry:

- `min-h-[600px]`;
- `border-[4px]`;
- `rounded-[20px]`;
- `rounded-[32px]`;
- `rounded-[48px]`;
- multiple hard-coded shadows;
- hard-coded palette colors;
- fixed preview dimensions.

### Verdict
**Canonical controls + high bespoke visual workspace.**

### Priority
**P1 visual-system reconciliation.**

Do not flatten the thumbnail workspace into generic cards. Instead, extract its legitimate visual primitives into reusable canonical variants.

---

# 5.10 Community Posts

**Source:** `src/components/CommunityPostGenerator.tsx`

### Toolboxes
- Post Workspace
- Poll Options
- Post Media
- Linked Video
- Post Preview

### Canonical primitives
- `SubToolbox`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxActions`
- `SubToolboxInnerActionButton`
- `SubToolboxFieldLabel`
- `SubToolboxDropdownControl`
- `SubToolboxGridActionButton`
- `SubToolboxSection`
- `SubToolboxSurface`
- `SubToolboxStatePanel`
- `SubToolboxLinkButton`

### Hybrid controls
- `StudioButton`
- `StudioInput`
- `StudioSearchInput`
- `StudioSplitLeftButton`
- `StudioTextArea`

### Drift evidence
- arbitrary borders/radii/font sizes;
- hard-coded `#FF77D6`.

### Verdict
**Hybrid.**

### Priority
**P1 primitive migration.**

Map the `Studio UI` controls to canonical SubToolbox variants where equivalent components already exist.

---

# 5.11 Comment Responder

**Source:** `src/components/CommentResponder.tsx`

### Toolboxes
- Comment Queue
- Video Context
- Received Image
- Current Comment

### Canonical primitives
- `SubToolbox`
- `SubToolboxGridActionButton`
- `SubToolboxInnerActionButton`

### Hybrid controls
- `StudioButton`
- `StudioIconButton`
- `StudioTextArea`

### Drift evidence
- multiple arbitrary minimum heights;
- hard-coded colors;
- arbitrary borders/radii/shadows.

### Verdict
**Hybrid + bespoke styling.**

### Priority
**P1.**

---

# 5.12 End-Screen Architect

**Source:** `src/components/EndScreenTool.tsx`

### Toolboxes
- Concept & Layout
- Styles
- Text & Copy
- Palette
- Images

### Canonical primitives
- `SubToolbox`
- `SubToolboxFieldLabel`
- `SubToolboxTextArea`
- `SubToolboxButton`
- `SubToolboxSelectableTag`
- `SubToolboxInput`
- `SubToolboxColorPicker`
- `SubToolboxFileTarget`
- `SubToolboxSelect`
- `SubToolboxIconButton`
- `SubToolboxLinkButton`
- `SubToolboxGridActionButton`

### Specialized
- LayoutPreview;
- ReferenceImage;
- ThumbnailHistoryItem.

### Drift evidence
Large amount of custom preview geometry and shadows.

### Verdict
**Canonical controls + specialized visualizer.**

The visualizer is legitimate; its control chrome should remain canonical.

---

# 5.13 Pre-Launch Priming

**Source:** `src/components/PreLaunchPriming.tsx`

### Toolbox
- PRE-LAUNCH PRIMING

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxSelectableListRow`
- `SubToolboxFieldLabel`
- `SubToolboxInput`
- `SubToolboxButton`

### Drift evidence
- hard-coded palette colors;
- `border-[4px]`;
- custom shadow.

### Verdict
**Canonical controls with shell/style drift.**

---

# 5.14 Hook Generator

**Source:** `src/views/HookGenerator.tsx`

### Toolboxes
- HOOK GENERATOR
- Input Data

### Canonical primitives
- `ToolboxScaffold`
- `Toolbox`
- `SubToolbox`
- `SubToolboxFieldLabel`
- `SubToolboxTextArea`
- `SubToolboxButton`

### Drift evidence
- hard-coded colors;
- fixed minimum height;
- arbitrary borders/radii/shadows.

### Verdict
**Canonical shell with bespoke styling.**

The redundant use of both `ToolboxScaffold` and `Toolbox` should be reviewed for unnecessary shell layering.

---

# 5.15 Actionable Tactics / Tactics Engine

**Source:** `src/views/ActionableTactics.tsx`

### Toolboxes
- Tactics Engine
- Strategy Params

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxButton`

### Hybrid controls
- `StudioInput`
- `StudioTextArea`
- `StudioSelect`
- `StudioButton`
- `StudioSearchInput`

### Additional
- custom TacticCard;
- Markdown output;
- custom toolbox-system usage.

### Drift evidence
- arbitrary borders/shadows;
- hard-coded pink/lime colors;
- arbitrary radius.

### Verdict
**Hybrid and high-priority migration candidate.**

---

# 5.16 Script Architect

**Source:** `src/views/ScriptArchitect.tsx`

### Toolboxes
- SCRIPT ARCHITECT
- The Brief
- Format & Pacing
- Assemble
- Assumptions & Grounding
- Visual Outline
- Length Check
- Full Script
- Visual Suggestions

### Canonical primitives
- `ToolboxScaffold`
- `SubToolbox`
- `SubToolboxInput`
- `SubToolboxButton`
- `SubToolboxDropdownControl`
- `SubToolboxTextArea`
- `SubToolboxGridActionButton`

### Drift evidence
Large amount of hard-coded colors, shadows, borders, fixed dimensions, and arbitrary text sizing.

### Verdict
**Canonical controls + substantial layout/style drift.**

### Priority
**P1 visual-system reconciliation.**

---

# 6. Cross-tool primitive classification

## Tier 1 — Strong canonical

These are closest to the desired architecture:

- Metadata Master
- Studio Publishing Cockpit
- Video Publisher
- most of Video Manager

They should become reference implementations for other tools.

## Tier 2 — Canonical shell + legitimate specialized workspace

- Concept + Scene Studio
- Video Director
- Thumbnail Studio
- End-Screen Architect
- Media Analyzer

The specialized workspaces are valid, but their control chrome and tokens should be normalized.

## Tier 3 — Hybrid / migration debt

- Community Posts
- Comment Responder
- Actionable Tactics

These directly mix `Studio UI` controls with canonical SubToolbox primitives.

## Tier 4 — Canonical controls with significant styling drift

- Pre-Launch Priming
- Hook Generator
- Script Architect
- parts of Video Manager

---

# 7. Hard-coded / non-default implementation findings

The repository already contains a dedicated `scripts/audit-studio-ui-drift.mjs` detector looking for:

- hard-coded 4px borders;
- hard-coded 5px borders;
- arbitrary radii;
- arbitrary shadows;
- arbitrary heights;
- arbitrary minimum heights;
- hard-coded hex colors;
- dashed borders.

The existence of this detector is useful, but the current Studio Hub inventory shows that the resulting findings need to be turned into an **explicit migration ledger**, not simply treated as pass/fail.

### Important distinction

A hard-coded value is not automatically wrong.

Examples that may be legitimate:

- a thumbnail preview's aspect-ratio-specific geometry;
- a chart's data visualization color;
- a creative canvas coordinate;
- a certification fixture;
- a specialized visual asset.

The problem is hard-coded **control chrome** or repeated geometry that duplicates canonical primitives.

---

# 8. Special settings that must be preserved

During normalization, do not remove important tool-specific settings.

## Video Manager
- metadata canonical order;
- Education conditional UI;
- ranked tags;
- Generate/Refine/Analyze action row;
- Project Manifestation;
- published-video ownership.

## Video Publisher
- Workspace/Intelligence mode;
- Longform/Shorts mode;
- Project Manifestation;
- canonical metadata sections;
- publishing transaction;
- package readiness;
- multi-step publishing state.

## Metadata Master
- package-first canvas;
- comparison;
- optimization;
- package history;
- handoffs.

## Video Director
- scope;
- category locks;
- project overrides;
- generation recipes;
- specialized visual planning.

## Thumbnail Studio
- image/reference workflow;
- concept generation;
- history;
- palette;
- visual packaging comparison.

## Concept + Scene Studio
- local draft persistence;
- concept selection;
- scene ordering;
- production handoff.

## Analysis
- user-controlled inputs;
- evidence/result separation;
- chart output;
- post-action reflection.

## Audience tools
- community post creation;
- comment response;
- linked video/context;
- image/media context.

---

# 9. Layout audit findings

## P1 — Too many independent visual systems

The biggest architectural problem is not that tools look different. It is that several tools define their own:

- control geometry;
- input anatomy;
- button anatomy;
- border weight;
- radius;
- shadow;
- color;
- spacing.

**Plan:** migrate equivalent controls to canonical primitives first; extract legitimate new visual families second.

## P1 — Runtime inventory does not match product inventory

The page currently mounts 15 user-facing modules while the canonical Round 1 inventory describes 13 different ownership-level tools.

**Plan:** establish a single runtime/product ownership matrix.

## P1 — Hybrid `Studio UI` controls

`StudioButton`, `StudioInput`, `StudioTextArea`, `StudioSelect`, `StudioSearchInput`, and `StudioSplitLeftButton` appear in multiple Studio Hub tools.

**Plan:** determine whether each maps to an existing canonical primitive. If it does, migrate. If not, formally register it as a canonical variant/family.

## P1 — Specialized workspaces are not consistently separated from control chrome

Video Director, Thumbnail Studio, End-Screen Architect, and Concept + Scene Studio need bespoke visualization, but their control surfaces should be unmistakably canonical.

**Plan:** establish a two-layer rule:

**Canonical chrome + specialized workspace.**

## P2 — Excessive arbitrary sizing

Fixed `min-height`, `height`, `width`, radius and shadow values recur across tools.

**Plan:** replace arbitrary control geometry with size-system variants. Retain fixed dimensions only for true media/canvas constraints.

## P2 — Inconsistent palette ownership

Many tools define their own hex colors even though the Toolbox palette system already exists.

**Plan:** route UI chrome through `toolboxPalette` / canonical tokens. Allow content-specific visualization palettes only inside explicitly registered visual components.

## P2 — Action layouts need systematic review

The existence of `SubToolboxActions` and its `forceRow` behavior is good, but each tool should be checked for:

- primary action;
- secondary action;
- disabled action;
- mobile wrapping;
- action order.

## P2 — Nested toolbox depth

Several tools contain many SubToolboxes. This is useful for complex workspaces but can create a settings-dashboard feel.

**Plan:** use SubToolboxes to group a transformation, not every field.

## P2 — Output/result hierarchy

Some tools have strong output cards; others put results inside bespoke cards.

**Plan:** standardize result states and action affordances around `SubToolboxOutputCard`, `SubToolboxStatePanel`, and handoff primitives.

---

# 10. Accessibility audit

### Positive findings

The canonical primitives provide:

- semantic buttons;
- ARIA pressed states;
- header collapse semantics;
- labels;
- control-level attributes;
- accessible icon button contracts;
- state panels;
- structured header controls.

### Risks

Hybrid/custom components may bypass those guarantees.

Highest-risk surfaces:

1. Video Director custom visual controls;
2. Community Posts hybrid Studio UI controls;
3. Comment Responder hybrid controls;
4. Actionable Tactics hybrid controls;
5. Thumbnail/End-Screen custom visual controls;
6. bespoke input/action combinations.

### Required audit

Every specialized control should prove:

- keyboard operation;
- visible focus;
- accessible name;
- selected/pressed state;
- disabled state;
- error state;
- tooltip/help accessibility.

---

# 11. Responsive audit

The canonical `SubToolboxGrid` and `SubToolboxActions` systems provide the correct foundation.

However, several tools contain fixed dimensions that should be reviewed:

- Video Manager;
- Concept + Scene Studio;
- Media Analyzer;
- Thumbnail Studio;
- End-Screen Architect;
- Hook Generator;
- Comment Responder;
- Script Architect.

### Required responsive rule

Do not eliminate tool-specific composition.

Instead:

**Canonical default size → adaptive layout → specialized canvas constraint only where necessary.**

---

# 12. Implementation Integrity score

| Dimension | Score | Finding |
|---|---:|---|
| Accessibility | 2/4 | Canonical primitives are strong, but hybrid/custom controls create inconsistent semantic guarantees. |
| Performance | 3/4 | No systemic performance failure found in the static audit; several large workspaces deserve render/asset review. |
| Theming | 1/4 | Repeated hard-coded colors and geometry show substantial token drift. |
| Responsive Design | 2/4 | Canonical responsive layouts exist, but fixed dimensions recur in several tools. |
| Implementation Integrity | 2/4 | Product-specific architecture is coherent, but multiple control systems coexist. |
| **Total** | **10/20** | **Acceptable — significant work needed** |

This is a **system audit score**, not a judgment that the Studio Hub is unusable.

The strongest underlying architecture is already present. The major task is consolidating implementation around it.

---

# 13. Priority findings

## P1 — Establish one production control authority

**Problem:** canonical SubToolbox primitives coexist with the `Studio UI` family.

**Affected:** Video Director, Community Posts, Comment Responder, Actionable Tactics.

**Fix:** create a mapping table:

`legacy/special control → canonical primitive → variant required? → migration status`

Do not blindly rewrite specialized controls.

---

## P1 — Establish a specialized-workspace contract

Allow:

- Thumbnail canvas;
- Director visualization;
- Storyboard;
- End-screen preview;
- chart visualization;
- concept cards.

But require:

- canonical Toolbox shell;
- canonical SubToolbox chrome;
- canonical control primitives;
- canonical tokens;
- explicit registration for new visual families.

---

## P1 — Reconcile runtime and product inventories

Create one canonical Studio Hub registry containing:

- tool ID;
- displayed name;
- definitive purpose;
- source component;
- ownership;
- mounted route/page;
- status;
- intended Round 1/Round 2 status;
- consolidation target.

---

## P1 — Make feature completeness auditable

For each tool, maintain:

**Feature → implementation → visible control → result → handoff → state**

This prevents features from existing only in code.

---

## P2 — Replace arbitrary control geometry

Prioritize:

1. borders;
2. radii;
3. shadows;
4. input/button sizes;
5. action-row geometry;
6. typography.

---

## P2 — Normalize palette ownership

Use the Toolbox palette system for UI chrome.

Reserve hard-coded colors for:

- data visualization;
- media/canvas content;
- intentionally registered creative systems;
- certification fixtures.

---

## P2 — Normalize state components

Use canonical state primitives for:

- empty;
- loading;
- success;
- warning;
- error;
- insufficient evidence.

---

# 14. Recommended Studio Hub update plan

## Phase 1 — Inventory and ownership

Create the canonical runtime registry.

Deliverable:

`Studio Hub Runtime + Ownership Matrix`

## Phase 2 — Primitive migration matrix

For every non-canonical control:

- identify equivalent;
- migrate;
- add variant;
- register new family;
- or explicitly justify exception.

## Phase 3 — Canonical chrome pass

Normalize:

- Toolbox;
- SubToolbox;
- headers;
- controls;
- buttons;
- inputs;
- action rows;
- status;
- outputs;
- handoffs.

## Phase 4 — Specialized workspace pass

Keep the legitimate visual workspaces, but rebuild their outer visual grammar around canonical primitives.

## Phase 5 — Feature exposure audit

For every tool:

- list every implemented function;
- map it to a visible control;
- map it to a result;
- map it to a state;
- map it to a handoff.

## Phase 6 — Responsive audit

Test:

- desktop;
- tablet;
- narrow mobile;
- long labels;
- empty data;
- large data;
- disabled/loading/error states.

## Phase 7 — Accessibility audit

Verify:

- keyboard;
- focus;
- semantic names;
- ARIA;
- contrast;
- touch targets;
- non-color status.

## Phase 8 — Visual certification

Use the Studio Hub Component Library as the visual reference and certify representative controls from every tool.

## Phase 9 — Regression audit

Run the Studio UI drift detector and manually classify every remaining finding as:

- migrate;
- register;
- intentional;
- false positive.

## Phase 10 — Final system certification

The Studio Hub should pass a final matrix:

**Tool identity × function exposure × primitive authority × states × responsive × accessibility × handoff × visual consistency.**

---

# 15. Proposed audit matrix for future updates

Every Studio Hub tool should eventually have a row containing:

| Field | Required |
|---|---|
| Tool ID | Yes |
| Definitive purpose | Yes |
| Primary outcome | Yes |
| Main Toolbox | Yes |
| SubToolboxes | Yes |
| Canonical primitives | Yes |
| Specialized components | Yes |
| Legacy/hybrid controls | Must be zero or justified |
| Hard-coded geometry | Must be zero or justified |
| Hard-coded colors | Must be zero or justified |
| Special settings | Yes |
| Default size usage | Yes |
| Responsive behavior | Yes |
| Keyboard support | Yes |
| Focus support | Yes |
| Empty state | Yes |
| Loading state | Yes |
| Success state | Yes |
| Warning state | Yes |
| Error state | Yes |
| Evidence state | Where applicable |
| Primary action | Yes |
| Secondary actions | Yes |
| Result surface | Yes |
| Handoff | Yes |
| Project relationship | Where applicable |
| Brain relationship | Where applicable |
| Asset relationship | Where applicable |
| Analytics relationship | Where applicable |

---

# 16. Source-of-truth rule going forward

The Studio Hub should follow this decision sequence:

1. **Existing canonical primitive?** Use it.
2. **Existing primitive is almost right?** Fix it.
3. **Meaningful variation needed?** Add a canonical variant.
4. **Genuinely new interaction family?** Create and register a canonical component.
5. **Specialized visual workspace?** Keep it, but build its control chrome from canonical primitives.
6. **Certification demo?** Hard-coded anatomy may remain frozen.
7. **Anything else?** Treat as design-system drift until explicitly justified.

This keeps Studio Hub visually diverse where the work requires it while maintaining one underlying ViewTube UI system.

---

# 17. Final audit conclusion

ViewTube already has enough canonical infrastructure to make the Studio Hub substantially more coherent without rebuilding the entire UI.

The main opportunity is **not another visual redesign**.

The main opportunity is to make the existing system authoritative:

**one Toolbox shell → one SubToolbox system → one primitive registry → one token/size system → specialized workspace components only where the work genuinely requires them.**

The first implementation targets should be:

1. Hybrid `Studio UI` controls.
2. Runtime/product tool inventory reconciliation.
3. Hard-coded control geometry.
4. Hard-coded UI palette values.
5. Specialized workspace/chrome separation.
6. Feature-to-control completeness.
7. Responsive/state/accessibility certification.

After that, the Studio Hub can be systematically updated tool-by-tool without losing existing functionality.

---

## Suggested UIAudit execution sequence

1. **Audit** — re-run after the primitive migration pass.
2. **Layout** — normalize hierarchy, spacing, and action placement.
3. **Adapt** — certify narrow/mobile compositions.
4. **Clarify** — make tool purpose and primary actions unmistakable.
5. **Harden** — complete state/accessibility/edge-case coverage.
6. **Polish** — final production pass.

**Important:** this document is an audit and planning artifact. It intentionally does not silently modify the Studio Hub while performing the audit.
