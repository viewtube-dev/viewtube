# ViewTube Integrated Metadata System — Master Plan

**Date:** 2026-10-06  
**Status:** Architecture / implementation plan  
**Scope:** Projects, ContentBuild, Publishing Package, Video Publisher, Video Manager, Content Analysis, AI Brain, Analytics, SubToolbox UI

## Executive decision

Do **not** make Metadata Master a competing top-level metadata application or create a parallel Metadata Engine data store.

Instead, metadata intelligence becomes a **shared capability integrated into canonical ViewTube systems**:

- **Project / ContentBuild** owns source context and content identity.
- **Publishing Package** owns the structured publication package and its versions.
- **Video Publisher** owns preparation, configuration, scheduling, review, and publication of unpublished content.
- **Video Manager** owns management and changes to already-published videos.
- **Content Analysis** owns evidence-based analysis of content, metadata changes, packages, and outcomes.
- **AI Brain** provides contextual reasoning, memory, prompt orchestration, and learned knowledge.
- **Analytics** remains the canonical measurement source.
- **Publication & Metadata History** records immutable events linking inputs/packages/changes to time and analytics windows.
- **Metadata Master** becomes an integrated advanced intelligence view/subtoolbox, available where metadata decisions are being made, with a toggle/header pattern similar to existing tools that expose alternate pages.

## Core purpose separation

| Surface | Singular purpose | Primary question |
|---|---|---|
| Video Publisher | Prepare and publish unpublished content | “How do I get this video ready and publish it?” |
| Video Manager | Manage already-published content | “How do I change/manage this live video?” |
| Content Analysis | Analyze evidence and learn | “What happened, why might it have happened, and what should we learn?” |
| Metadata Intelligence / Master view | Optimize metadata decisions | “What is the strongest metadata/package strategy?” |
| Publishing Package | Durable publication state | “What exactly is the publication package?” |
| ContentBuild | Durable content identity/history | “What is this piece of content and how did it evolve?” |

Metadata intelligence is therefore a **capability**, not a competing ownership layer.

## UX principle

Every metadata field must make these actions immediately accessible:

**Write/Edit · Generate · Refine · Alternatives · Analyze · History**

The controls must work at multiple scopes:

- one field
- multiple selected fields
- one complete package
- multiple complete packages
- mixed combinations
- current-value refinement
- new generation
- style/purpose constrained generation
- AI ranking
- human selection
- package comparison

AI is never mandatory.

## Recommended interface model

Use a hybrid model:

1. Normal Publisher/Manager layouts remain the primary workstations.
2. Each metadata field exposes compact generation/refinement controls.
3. A **Metadata Intelligence** SubToolbox provides deeper comparison, ranking, package generation, strategy and history.
4. The header may use the existing **view/page toggle pattern** used by tools such as Thumbnail Studio to switch between the normal workstation and the advanced intelligence view.
5. The intelligence view remains context-bound to the current Project, ContentBuild, Publishing Package or published video.

This gives users advanced power without making them navigate to a separate application.

## Canonical flow

```
Project
  ↓
ContentBuild
  ↓
Publishing Package
  ↓
Video Publisher
  ↓
Published Video
  ↓
Video Manager
  ↓
Change Events
  ↓
Analytics
  ↓
Content Analysis
  ↓
Learned Knowledge → AI Brain → future Projects/ContentBuilds
```

Metadata Intelligence runs across the flow rather than replacing any node.

## Historical learning requirement

Every publication package and metadata change should be versioned and associated with:

- content/video identity
- project
- ContentBuild
- publishing package/version
- changed fields
- previous values
- new values
- actor
- operation type
- timestamp
- publication state
- publication date
- analytics windows
- relevant metrics
- traffic/context dimensions where available
- generation/refinement operation identity
- prompt/configuration identity
- AI recommendation identity
- subsequent outcome observations

The system must distinguish:

- **observed fact**
- **correlation**
- **hypothesis**
- **confidence**
- **conclusion**
- **recommendation**

It must never represent correlation as proven causation.

## Generation model

Support all of the following from the same underlying capability:

- Generate one title.
- Generate ten titles.
- Generate one description.
- Generate multiple descriptions.
- Generate a complete package.
- Generate five complete packages.
- Generate selected fields.
- Generate different strategies in parallel.
- Refine the current value.
- Generate alternatives without replacing current values.
- Generate with purpose.
- Generate with style.
- Generate for channel niche.
- Generate from topic/content context.
- Generate using analytics history.
- Generate from historical winning patterns.
- Generate conservative, balanced, or experimental variants.
- Rank individual candidates.
- Rank complete packages.
- Curate the strongest mixed package from candidates.

## Non-goals

Do not:

- create a second analytics database;
- create a second project/content identity;
- create a second publishing-package authority;
- force users through AI generation;
- make Publisher dependent on Metadata Intelligence;
- make Manager dependent on Metadata Intelligence;
- let Content Analysis mutate live metadata directly;
- allow an AI-generated result to silently replace user-authored content;
- claim causal certainty from observational analytics.

## Implementation order

1. Inventory current Publisher, Manager, Publishing Package, ContentBuild, Brain and analytics contracts.
2. Produce a one-write-owner matrix.
3. Define publication/metadata history event schema.
4. Define generation/refinement operation contract.
5. Preserve and isolate the current Publisher generation workflow.
6. Redesign Publisher around manual + optional AI controls.
7. Redesign Manager around the same field/component language but live-video state.
8. Add Metadata Intelligence toggle/view.
9. Add historical analysis to Content Analysis.
10. Integrate Brain context and learned knowledge.
11. Add ranking/package experimentation.
12. Add prompt library and generation recipes.
13. Add tests and browser QA.
14. Migrate without deleting current Publisher capabilities.
15. Verify all handoffs and history lineage.

## Acceptance criteria

The redesign is successful when:

- a user can manually create an entire publication package without AI;
- a user can generate one input without generating anything else;
- a user can generate selected inputs;
- a user can generate a complete package;
- a user can generate multiple complete packages;
- a user can refine any current input;
- a user can compare and rank candidates;
- Publisher remains a complete publishing workstation;
- Manager remains a complete live-video workstation;
- Metadata Intelligence does not become a third publishing tool;
- every generated/refined package has provenance;
- package and field changes are historically recoverable;
- Content Analysis can associate changes with analytics periods;
- Brain can consume validated observations without duplicating canonical ownership;
- all operations are reversible and auditable.
