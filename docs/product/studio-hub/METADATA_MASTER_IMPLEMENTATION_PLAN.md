# Metadata Master — Studio Hub Toolbox Implementation Plan

**Status:** ACTIVE — implementation plan  
**Date:** 2026-10-06  
**Branch:** `feat/metadata-master-studio-hub`

## 1. Definitive purpose

**Metadata Master turns a video/project into an optimized, testable publication package.**

It owns:
- understanding the current publication context;
- generating coherent metadata/package alternatives;
- analyzing and scoring package quality;
- deciding which package components should be applied;
- coordinating title + thumbnail + description + tags + chapters + routing + publishing decisions;
- packaging the approved result for downstream tools.

It does **not** own:
- live published-video metadata mutation — Video Manager;
- final publication execution/scheduling — Video Publisher;
- thumbnail asset creation — Thumbnail Studio;
- content interpretation — Content Analysis;
- durable creator knowledge — AI Brain;
- canonical asset storage — Asset Engine/Vault.

## 2. Primary workflow

`CONTEXT → ANALYZE → GENERATE → COMPARE → OPTIMIZE → DECIDE → PACKAGE → HANDOFF`

The primary action is **OPTIMIZE PUBLICATION PACKAGE**.

Secondary modes:
- Generate alternatives
- Fix problems only
- Refine selected components
- Preserve locked components
- Compare package sets
- Prepare A/B/C test candidates

## 3. Publication Package

Metadata Master produces a typed package containing:
- title;
- description;
- tags;
- category;
- chapter/timestamp draft;
- playlist/routing decisions;
- end-screen / related-video recommendations;
- thumbnail brief/reference;
- publishing goal;
- optimization intensity;
- selected package version;
- readiness/quality score;
- warnings/conflicts;
- provenance/evidence;
- handoff destination.

The package is versioned in the local draft layer and transported across ViewTube with the existing ActionPacket/Handoff system.

## 4. UI architecture

Use only the canonical Toolbox/SubToolbox shell and existing primitive families.

### Toolbox
**METADATA MASTER**
- purpose: Optimize and assemble the publication package
- status/readiness indicator
- contextual project/video scope

### SubToolboxes

1. **Context**
   - project/video
   - content goal
   - format
   - audience
   - channel context

2. **Optimization Brief**
   - goal: Reach / Search / Browse / Subscribers / Revenue / Authority
   - intensity: Light / Balanced / Aggressive
   - preserve/lock fields
   - analyze channel history

3. **Generate**
   - complete package
   - selected components
   - 1–5 package sets
   - individual alternatives

4. **Package Canvas**
   - title
   - thumbnail
   - description
   - tags
   - chapters
   - category
   - playlist
   - end-screen/related-video
   - each component can expand for edit/generate/compare/apply

5. **Evaluate**
   - package score
   - component scores
   - contradiction detection
   - redundancy detection
   - title/thumbnail relationship
   - channel-fit warnings
   - evidence/confidence

6. **Compare**
   - Package A/B/C
   - mix-and-match selection
   - rank and select

7. **Apply / Handoff**
   - selected components
   - send to Video Publisher
   - send to Video Manager when a published video is in scope
   - send thumbnail brief to Thumbnail Studio
   - review before mutation

8. **History**
   - package versions
   - generation records
   - previous decisions
   - provenance

## 5. SubToolbox primitive rules

Use:
- `SubToolbox`
- `SubToolboxStack`
- `SubToolboxGrid`
- `SubToolboxActions`
- `SubToolboxSection`
- `SubToolboxInput`
- `SubToolboxTextArea`
- `SubToolboxSelect`
- `SubToolboxButton`
- `SubToolboxOutputCard`
- `SubToolboxStatePanel`
- `SubToolboxAlert`
- existing tag/status/output primitives where appropriate.

No feature-local shell geometry, palette authority, or duplicate control CSS.

## 6. Cross-tool architecture

### Content Analysis → Metadata Master
Supplies:
- transcript/content understanding;
- detected topics;
- audience;
- claims;
- chapters;
- strongest moments;
- evidence;
- pre/post-publication context.

Metadata Master transforms this into packaging decisions.

### Thumbnail Studio ↔ Metadata Master
Metadata Master supplies:
- title;
- audience;
- package goal;
- promise;
- thumbnail brief;
- visual constraints.

Thumbnail Studio supplies:
- thumbnail asset;
- thumbnail variants;
- packaging evidence.

The title/thumbnail pair is evaluated together.

### Video Publisher ← Metadata Master
Metadata Master produces a **Publication Package**. Publisher:
- validates it;
- attaches production assets;
- handles upload;
- handles scheduling/privacy;
- executes publication.

Publisher should not become a second metadata optimization engine.

### Video Manager ← Metadata Master
For an already-published video:
- Metadata Master imports current metadata as baseline;
- recommends optimized changes;
- creates a proposed package;
- Video Manager owns the actual live-video mutation.

Metadata Master never silently overwrites published metadata.

### AI Brain
Reads validated creator/channel context and supplies:
- channel language;
- historical preferences;
- audience knowledge;
- successful packaging patterns;
- constraints.

Metadata Master can return validated findings as knowledge candidates through existing Brain/Handoff infrastructure.

### Projects / ContentBuild / Asset Engine
The tool preserves `channelId + projectId + contentBuildId` and references canonical assets rather than creating a parallel asset store.

## 7. ActionPacket integration

Register:
`metadata-master`

Accept:
- video
- script
- metadata
- analysis
- evidence
- asset
- thumbnail

Produce:
- metadata
- thumbnail
- analysis
- evidence
- asset
- json

Suggested targets:
- Video Publisher
- Video Manager
- Thumbnail Studio
- Content Analysis
- AI Brain
- Projects/Vault where supported

## 8. Implementation phases

### Phase 1 — Toolbox + package model
- add Metadata Master view;
- add publication-package types/service;
- add local draft persistence;
- add Studio Hub mount;
- add dashboard tool entry;
- add ActionPacket capability.

### Phase 2 — Real generation
- reuse existing metadata-generation capability;
- generate coherent title/description/tag/category candidates;
- support 1–5 sets;
- retain generation provenance;
- avoid creating a second AI/provider system.

### Phase 3 — Evaluation
- deterministic package/readiness scoring;
- contradiction/redundancy checks;
- title/thumbnail pairing;
- preserve/lock controls;
- compare/rank workspace.

### Phase 4 — Handoffs
- Metadata Master → Video Publisher;
- Metadata Master → Video Manager;
- Metadata Master → Thumbnail Studio;
- incoming package receivers;
- explicit handoff UI.

### Phase 5 — Certification
- component contract tests;
- interaction tests;
- responsive/browser verification;
- build;
- source-governance checks;
- Studio Hub visual regression;
- package/handoff persistence tests.

## 9. Acceptance criteria

Metadata Master is complete only when:
- it has one unmistakable primary outcome;
- it uses canonical Toolbox/SubToolbox primitives;
- the main workspace is the Publication Package, not a generic form;
- generation can operate on the whole package or selected components;
- alternatives can be compared and selected;
- the user controls what is applied;
- package provenance/evidence survives handoffs;
- Video Publisher owns publication;
- Video Manager owns live-video mutation;
- Thumbnail Studio owns thumbnail creation;
- no duplicate asset store or parallel shell is introduced;
- mobile and desktop layouts remain usable;
- loading/empty/error/blocked/stale states are implemented;
- focused tests and production build pass.

## 10. Implementation boundary

This is an additive Studio Hub tool. Existing Video Manager and Video Publisher functionality remains intact. Metadata Master is introduced as the **optimization/package authority between content understanding and publication execution**, with explicit handoffs rather than ownership duplication.
