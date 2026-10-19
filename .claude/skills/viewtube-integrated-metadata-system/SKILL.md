---
name: viewtube-integrated-metadata-system
description: Design, implement, audit and maintain ViewTube's integrated metadata lifecycle across Projects, ContentBuild, Publishing Package, Video Publisher, Video Manager, Content Analysis, Analytics and AI Brain without creating duplicate system ownership.
---

# ViewTube Integrated Metadata System

## Trigger

Use for any task involving metadata generation, refinement, ranking, package optimization, publication metadata, live-video metadata changes, metadata history, metadata analytics, or AI-assisted publication workflows.

## Responsibility

Maintain one coherent metadata capability across canonical ViewTube systems.

## Non-goals

This skill does not:

- create a parallel metadata datastore;
- replace Project or ContentBuild ownership;
- replace Publishing Package ownership;
- replace Analytics ownership;
- turn Metadata Intelligence into a mandatory standalone application;
- remove existing Publisher generation capabilities;
- let Content Analysis directly mutate live metadata.

## Required source files

Read the current relevant repository authorities before changing behavior:

- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md`
- `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md`
- `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md`
- `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md`
- `src/views/VideoPublisher.tsx`
- `src/views/VideoManager.tsx`
- `src/components/subtoolbox/registry.ts`

Then read the task-specific integrated metadata documents under `docs/product/studio-hub/`.

## Operating model

### Publisher

Owns preparation and publication of unpublished content.

### Manager

Owns management and editing of already-published content.

### Metadata Intelligence

Provides generation, refinement, analysis, comparison, ranking, strategy, history and package intelligence inside the relevant workstation.

### Content Analysis

Interprets historical evidence and produces observations, hypotheses, conclusions and recommendations.

### AI Brain

Consumes canonical context, evidence and validated knowledge.

## Mandatory UI rules

Every metadata field must expose:

- manual edit;
- generate;
- refine;
- alternatives;
- analyze;
- history.

Users can operate manually without invoking AI.

Users can generate:

- one field;
- selected fields;
- a full package;
- multiple packages;
- mixed field/package requests.

## Mandatory provenance

Every AI operation records:

- operation ID;
- prompt recipe/version;
- context version;
- model/provider;
- request scope;
- output schema;
- result provenance.

## Mandatory history

Record:

- previous value;
- next value;
- field;
- package version;
- timestamp;
- actor;
- operation;
- publication state.

## Analytics rule

Never claim causation from simple before/after correlation.

Analysis must distinguish:

- observed;
- associated;
- hypothesized;
- concluded.

Report confounders when detectable.

## Backend procedure

1. Locate canonical owner.
2. Inspect existing behavior.
3. Preserve current functionality.
4. Define/verify contract.
5. Add failing tests.
6. Implement through the narrowest existing seam.
7. Validate AI output at boundaries.
8. Record operation/history.
9. Verify analytics linkage.
10. Run focused and full tests.

## Frontend procedure

1. Reuse existing Toolbox/SubToolbox primitives.
2. Preserve ViewTube size/token system.
3. Make manual controls immediately visible.
4. Add compact AI actions beside current inputs.
5. Use the header page-toggle pattern for advanced Intelligence views where appropriate.
6. Keep Publisher and Manager visually related.
7. Use live-state/performance/history signals to differentiate Manager.
8. Use candidate/package/evidence primitives to differentiate Intelligence.

## Prompt procedure

Compose:

system policy + task contract + creator + channel + niche + audience + content + project + ContentBuild + current package + history + analytics + goals + purpose + style + constraints + output schema.

Then choose:

scope + count + diversity + context depth + operation.

## Verification

For behavior changes:

- add/adjust tests first;
- run focused tests;
- run the repository's full relevant suite;
- run browser tests for UI;
- verify no existing Publisher function regressed.

For architecture changes:

- verify one-write-owner matrix;
- verify no duplicate data owner;
- verify provenance;
- verify retry/idempotency;
- verify history reconstruction;
- verify Brain context.

## Handoff

Produce:

- implementation summary;
- files changed;
- tests run;
- architecture decisions;
- migration notes;
- unresolved risks.

## Canonical result

The intended lifecycle is:

**Create → Generate/Write → Refine → Compare → Select → Package → Publish → Change → Measure → Analyze → Learn → Reuse**
