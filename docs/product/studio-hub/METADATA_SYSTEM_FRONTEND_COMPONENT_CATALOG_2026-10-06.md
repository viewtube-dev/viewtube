# Integrated Metadata System — Frontend Component & Primitive Catalog

## Rule


## Canonical section hierarchy

The metadata component system must render the following sequence without reordering:

**Video Upload → Title → Thumbnail → Visibility → Audience → Timestamps → Description → Location → Playlists → Community → AI Use → Tags → Category**

Primary components are used for Video Upload, Title, Thumbnail, Description, Playlists, Tags, and Category. Secondary components are intentionally compact for Visibility, Audience, Timestamps, Location, Community, and AI Use; many are binary or yes/no controls and should use switches, compact pills, badges, or tiny inline selectors rather than full SubToolboxes.

This hierarchy is a layout contract, not a content suggestion. Empty or collapsed secondary controls retain their semantic position, and intelligence/generation actions must not create an alternate ordering.

Use existing ViewTube Toolbox/SubToolbox primitives and the UI component library wherever possible. The new system adds only components that communicate metadata-specific concepts that cannot be expressed clearly with existing primitives.

## Existing primitive families to reuse

- ToolboxScaffold
- SubToolbox
- SubToolboxGrid
- SubToolboxSection
- SubToolboxActions
- SubToolboxInput
- SubToolboxTextArea
- SubToolboxSelect
- SubToolboxButton
- SubToolboxOutputCard
- SubToolboxStatePanel
- SubToolboxAlert
- existing headers, badges, toggles, tabs, previews and size tokens

## New special components

### MetadataField
Universal metadata field container.

### MetadataFieldActionBar
Immediate Edit / Generate / Refine / Alternatives / Analyze / History controls.

### GenerationScopeBar
Single / Selected / Full / Batch.

### CandidateCard
One generated/refined candidate.

### CandidateSet
Group of candidates generated for one request.

### PackageCard
Complete metadata package candidate.

### PackageMatrix
Cross-package comparison.

### RankPanel
AI/human ranking.

### EvidenceTimeline
Metadata changes and analytics events on one timeline.

### ImpactCard
Before/after outcome evidence.

### PackageLineage
Version graph.

### StrategyControl
Purpose/style/diversity/context controls.

### ContextInspector
What information influenced the result.

### PromptRecipeControl
Saved generation recipe selector.

### SafeApplyDiff
Exact pending changes.

### LearningCard
Observation → evidence → confidence → recommendation.

## Component anatomy

Every metadata field should visually communicate:

```
TITLE
Current value
────────────────────────
[Edit] [Generate] [Refine]
[Alternatives] [Analyze] [History]
```

For constrained layouts, actions collapse into a compact overflow but remain immediately discoverable.

## Component states

Every component supports:

- empty;
- current;
- generating;
- generated;
- refined;
- selected;
- rejected;
- loading;
- error;
- stale;
- applied;
- historical.

## Selection model

Selections must support:

- one candidate;
- multiple candidates;
- package;
- multiple packages;
- field-level selection from multiple packages.

## Information density

Default ViewTube compact size tokens should be used.

Avoid large AI cards that consume vertical space without increasing decision quality.

## Responsive behavior

Desktop:

- multi-column candidate comparison;
- package matrix;
- evidence timeline.

Tablet:

- two-column comparison;
- stacked evidence.

Mobile:

- single-column;
- horizontal candidate navigation;
- sticky scope/action bar.

## Visual communication test

A user should be able to identify:

- Publisher = publishing workstation;
- Manager = live-video workstation;
- Intelligence = optimization/analysis;
- Content Analysis = evidence/learning;

without reading long descriptions.

## QA requirements

Test:

- visual hierarchy;
- component consistency;
- keyboard operation;
- long metadata;
- empty state;
- batch state;
- generation loading;
- error state;
- package comparison;
- history timeline;
- mobile layout.
