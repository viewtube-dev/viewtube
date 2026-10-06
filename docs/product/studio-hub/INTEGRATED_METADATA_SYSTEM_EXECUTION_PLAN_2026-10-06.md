# Integrated Metadata System — Execution Plan

## Phase 0 — Discovery and preservation

- Inventory current VideoPublisher generation workflow.
- Inventory current VideoManager editing workflow.
- Inventory Thumbnail Studio's alternate-page/header toggle pattern.
- Inventory SubToolbox component usage.
- Inventory Publishing Package and Video Package contracts.
- Inventory ContentBuild and Project identity/history.
- Inventory current AI Brain context and prompt systems.
- Inventory analytics canonical APIs.
- Inventory tests and browser QA.

**Gate:** no current Publisher capability is lost or duplicated.

## Phase 1 — Ownership contracts

Create a one-write-owner matrix for:

- Project;
- ContentBuild;
- VideoPackage;
- PublishingPackage;
- publication state;
- live metadata;
- analytics;
- Brain memory;
- history/events.

**Gate:** every mutable field has exactly one canonical owner.

## Phase 2 — History foundation

Implement/extend publication and metadata change records.

Support:

- single-field changes;
- multi-field changes;
- complete package versions;
- publication events;
- live edits;
- generation/refinement provenance;
- analytics references.

**Gate:** a complete timeline can reconstruct what happened.

## Phase 3 — Metadata operation contract

Create the deep Metadata Operation Module.

Support:

- generate;
- refine;
- analyze;
- rank;
- compare;
- package.

Implement structured input/output schemas and operation IDs.

**Gate:** all metadata AI calls pass through a consistent contract without creating a duplicate data owner.

## Phase 4 — Prompt registry

Build versioned recipes.

Minimum recipe families:

- title;
- description;
- tags;
- chapters;
- package;
- refinement;
- ranking;
- package comparison;
- historical analysis.

Add purpose/style/constraint composition.

**Gate:** every AI result records recipe and version provenance.


## UI hierarchy gate — applies to Publisher, Manager, and Intelligence

Before implementation proceeds past the frontend phase, enforce the canonical section order:

**Video Upload → Title → Thumbnail → Visibility → Audience → Timestamps → Description → Location → Playlists → Community → AI Use → Tags → Category**

Treat Video Upload, Title, Thumbnail, Description, Playlists, Tags, and Category as primary sections. Treat Visibility, Audience, Timestamps, Location, Community, and AI Use as secondary/optional sections with compact/tiny UI, especially switches and other binary controls. Their lower visual weight must never change their position or make them disappear from the semantic sequence.

Add automated/component coverage for the ordering and visual hierarchy, plus browser QA for collapsed/empty/populated states and responsive layouts.

## Phase 5 — Publisher redesign

Preserve the current strong generation workflow.

Add:

- manual-first field editing;
- Generate;
- Refine;
- Alternatives;
- selected-field generation;
- full-package generation;
- multi-package generation;
- package selection;
- safe apply;
- history.

Add header toggle:

**WORKSPACE ↔ INTELLIGENCE**

**Gate:** manual-only publication remains fully functional.

## Phase 6 — Manager redesign

Keep Publisher and Manager component families visually related.

Manager adds live-video signals:

- Published status;
- performance;
- history;
- before/after changes;
- safe update.

Add the same Intelligence view.

**Gate:** Manager can perform every intended manual live edit without AI.

## Phase 7 — Content Analysis integration

Add:

- change timeline;
- analytics alignment;
- before/after comparison;
- single-field impact;
- package impact;
- historical pattern detection;
- confidence;
- hypothesis/conclusion separation.

**Gate:** analysis never claims causality beyond evidence.

## Phase 8 — AI Brain integration

Create Context Envelope resolution from canonical owners.

Feed Brain:

- current content;
- channel/niche;
- package;
- history;
- analytics evidence;
- validated knowledge.

Promote only evidence-backed observations.

**Gate:** no duplicate Brain memory or analytics store.

## Phase 9 — Advanced intelligence

Add:

- candidate sets;
- package matrix;
- strategy controls;
- historical evidence;
- AI ranking;
- human ranking;
- package evolution;
- experiment planning.

## Phase 10 — Frontend certification

Run:

- component tests;
- accessibility checks;
- browser interaction tests;
- visual comparison;
- responsive tests;
- long-content tests;
- empty/error/loading tests.

## Phase 11 — Migration and cleanup

- Remove duplicate metadata-generation paths only after parity is proven.
- Retain compatibility adapters where required.
- Update docs and registries.
- Mark old Metadata Master standalone architecture as superseded.
- Preserve provenance.

## Phase 12 — Learning loop

After deployment:

- observe changes;
- associate analytics;
- generate observations;
- validate;
- promote knowledge;
- improve future generation recipes.

## Definition of done

The system is complete when the same metadata can move through:

**manual → generated → refined → compared → selected → packaged → published → changed → measured → analyzed → learned → reused**

without losing identity, provenance, history or user control.
