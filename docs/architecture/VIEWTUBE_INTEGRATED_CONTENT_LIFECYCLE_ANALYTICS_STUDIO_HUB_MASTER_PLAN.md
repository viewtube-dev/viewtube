# ViewTube Integrated Content Lifecycle, Analytics & Studio Hub Implementation Master Plan

**Status:** Initial consolidation / planning authority candidate  
**Planning window:** 2026-10-07, work consolidated from the post-9:45 PM EST planning and audit discussions  
**Repository:** `viewtube-dev/viewtube`

## 1. Purpose

This document consolidates the recent Studio Hub, Projects, ContentBuild, Asset Engine, AI/Brain, handoff, publishing, analytics, and post-publication planning into one implementation-oriented view.

The goal is not to create another parallel architecture. It is to connect the existing canonical systems so that one piece of content can be traced from project creation through generation, decisions, asset selection, publication, analytics, evaluation, and governed learning.

### Core lifecycle

```text
Creator / Channel
      ↓
Project
      ↓
ContentBuild
      ↓
Research / Concept / Script / Story
      ↓
Generations / Assets / Variants / Versions
      ↓
Video Package / Publishing Package
      ↓
Video Publisher
      ↓
YouTube / Publication
      ↓
Analytics / VT-SYNC Checkpoints
      ↓
Outcome / Evaluation
      ↓
Evidence
      ↓
Governed Brain Learning
      ↓
Next Opportunity / Project
```

Studio Hub tools operate across this lifecycle rather than becoming a second lifecycle of their own.

---

## 2. Architectural rule

**Do not create parallel stores or competing ownership systems.**

Reuse and connect:

- Projects / ContentBuild as durable content identity.
- Asset Engine / Vault as asset, version, variant, and provenance authority.
- Operation identity / ActionPacket / ToolReceipt / GenerationRecord for consequential work identity.
- Publishing Package / Approved Publish Snapshot for exact publication state.
- Analytics Canon / VT-SYNC for canonical analytics evidence.
- Outcome / Evaluation infrastructure for measured results.
- Evidence records for provenance and confidence.
- Brain / governed learning for durable knowledge promotion.
- Existing Studio Hub toolboxes, subtoolboxes, primitives, and handoff contracts.

The integration plan should extend these authorities, not introduce another generic history database, analytics store, metadata system, AI brain, asset store, or handoff framework.

---

## 3. Recent planning authorities and audit status

The recent review identified these important authorities:

| Authority | Approx. latest planning/audit point reviewed | Role |
|---|---:|---|
| Projects / ContentBuild Workflow Master | 2026-09-24 audit | Canonical lifecycle, identity, checkpoints, outcome/evaluation direction |
| Asset Engine Master Resource | 2026-09-24 audit | Canonical asset identity and lineage |
| Studio Hub Master Tool Architecture | 2026-10-04 | Canonical Studio Hub tool architecture |
| Studio Hub AI / Brain / Prompts | 2026-10-05 | AI context, generation, and Brain integration target |
| Studio Hub Interactions / Handoffs | 2026-10-05 | Cross-tool workflow and handoff contracts |
| Toolbox Promotion / Workflow Chains | 2026-09-27 | Tool promotion, chains, receipts, learning-loop direction |
| Finish Program | 2026-09-24 | Completion/convergence source; some authority has moved to Integrated Application |
| System Convergence Plan | 2026-09-26 | Cross-system convergence and implementation direction |

These dates are planning/audit reference points, not guarantees that every individual requirement in those documents remains current. Canonical ownership must be checked before implementation.

---

## 4. What the recent audits established

### 4.1 Studio Hub audit

The Studio Hub audit covered:

1. Tool identity and decisive outcome.
2. Information architecture and hierarchy.
3. Primary-action visibility.
4. Feature discoverability/completeness.
5. Component ownership/reuse.
6. State architecture.
7. Workflow continuity/handoffs.
8. Responsive composition/density.
9. Accessibility/interaction semantics.
10. Visual-system integrity.

The runtime inventory includes existing tools such as Video Manager, Video Publisher, Concept + Scene Studio, Video Director, Studio Publishing Cockpit, Metadata Master, Media Analyzer, Thumbnail Studio, Community Posts, Comment Responder, End-Screen Architect, Pre-Launch Priming, Hook Generator, Actionable Tactics, and Script Architect.

A major architectural issue is the mismatch between runtime composition and the earlier canonical product inventory. Reconcile ownership and inventory before adding new Studio Hub tools.

The audit also found migration debt around hybrid controls, hard-coded styling, responsive behavior, specialized workspace chrome, feature-to-control completeness, and accessibility/state certification.

### 4.2 Product architecture audit

The broader architecture already contains the needed conceptual layers:

- analytics store / Analytics Canon,
- event/job infrastructure,
- evidence,
- knowledge/RAG,
- agent gateway,
- Projects / ContentBuild,
- Asset Engine,
- Brain,
- outcome/evaluation/learning,
- correlation and operation identity.

The problem is primarily **connection and producer coverage**, not a lack of another top-level system.

### 4.3 Existing convergence work

Existing plans already identify:

- unified producer identity,
- correlation IDs,
- operation idempotency,
- post-publish ContentBuild identity,
- publish → analytics → evaluation continuity,
- exact selected/used variant attribution,
- outcome/evaluation coverage,
- governed learning promotion,
- cross-surface handoff identity.

The implementation should harvest and connect these existing plans rather than recreate them.

---

# 5. New integrated post-publication model

The biggest expansion from the recent planning is to make the entire content lifecycle measurable and traceable after publication.

## 5.1 Decision → Change → Exposure → Analytics → Outcome → Learning

Every consequential content decision should be capable of following this chain:

```text
Decision
  ↓
Reason / Evidence
  ↓
Change
  ↓
Exact Version / Variant
  ↓
Publication / Exposure
  ↓
Analytics Checkpoints
  ↓
Outcome
  ↓
Evaluation
  ↓
Learning Candidate
  ↓
Governed Brain Knowledge
```

### Critical distinction

**Change** records what technically changed.

**Decision** records why an intentional choice was made.

For example:

- Change: title changed from A to B.
- Decision: creator selected B because analysis showed the original title underperformed and the new title better matched the intended audience.

Both need lineage.

---

# 6. Decision and change lineage

Extend existing identity and receipt infrastructure with a consistent model for:

### Decision Registry

Record:

- decision ID,
- project ID,
- ContentBuild ID,
- affected object,
- actor,
- decision type,
- reason,
- evidence references,
- confidence,
- previous version,
- selected/new version,
- operation ID,
- timestamp,
- downstream publication relationship,
- eventual outcome/evaluation relationship.

Suggested decision states:

- KEEP
- REJECT
- MODIFY
- SELECT
- PUBLISH
- ROLLBACK
- TEST
- DEFER
- APPROVE

### Change/Event Registry

Record the actual state transition:

- object,
- field/asset/version changed,
- old value/version,
- new value/version,
- operation ID,
- actor,
- source tool,
- timestamp,
- publication relationship.

Do not duplicate the existing event/operation infrastructure; extend or map into it.

---

# 7. Generation lineage

Every meaningful AI or generation operation should support:

```text
Generation
  ↓
Generated Variants
  ↓
Selection / Rejection
  ↓
Exact Used Variant
  ↓
Publication / Exposure
  ↓
Outcome
```

This applies to:

- titles,
- thumbnails,
- descriptions,
- tags,
- scripts,
- hooks,
- story structures,
- edits,
- renders,
- prompts/packages,
- other generated assets.

Only the exact selected/used variant should receive exposure/outcome attribution.

Generation provenance should preserve, where available:

- model,
- prompt/template,
- context,
- operation ID,
- source inputs,
- generated variants,
- selected variant,
- user decision,
- resulting asset/version.

---

# 8. Analysis lineage

AI and human analysis should be traceable through:

```text
Analysis
  ↓
Finding
  ↓
Recommendation
  ↓
Creator Decision
  ↓
Change
  ↓
Publication
  ↓
Analytics
  ↓
Evaluation
```

This allows ViewTube to eventually answer:

- Which recommendations were accepted?
- Which recommendations were rejected?
- Which recommendations were actually effective?
- Which analyses repeatedly produced useful recommendations?
- Which recommendations created no measurable benefit?
- Which analysis patterns should be trusted more or less?

This also enables recommendation-effectiveness tracking without assuming that every recommendation caused an outcome.

---

# 9. Post-publish ContentBuild continuity

After publication, the ContentBuild must remain the durable identity for the work.

The chain should remain intact:

```text
Project
  ↓
ContentBuild
  ↓
Publishing Package
  ↓
Approved Publish Snapshot
  ↓
Published Video Binding
  ↓
Analytics Checkpoints
  ↓
Experiments / Changes
  ↓
Outcome / Evaluation
  ↓
Learning
```

The system must not create a disconnected “published video history” that loses the originating project and asset lineage.

---

# 10. Analytics checkpoint framework

Analytics should be attached to the same ContentBuild and publication identity.

Each checkpoint should preserve enough information to make comparisons meaningful:

- metric,
- metric definition/type,
- scope,
- unit,
- time window,
- timestamp,
- data source,
- baseline window,
- comparison window,
- selected publication variant,
- relevant traffic/audience context,
- missingness,
- comparability status,
- sufficient-data status,
- correlation/operation IDs where applicable.

Existing metric-comparability policy must remain authoritative.

### Checkpoint examples

- publication baseline,
- early post-publication checkpoint,
- stabilization checkpoint,
- experiment checkpoint,
- metadata-change checkpoint,
- long-term outcome checkpoint.

---

# 11. Before/after evaluation

For changes made after publication:

```text
Baseline
  ↓
Change Point
  ↓
Stabilization Period
  ↓
Evaluation Window
  ↓
Comparison
  ↓
Evidence / Confidence
```

The system should not automatically claim causality.

Example:

> CTR increased after a thumbnail change.

This may be an observed association.

If traffic source, audience mix, title, topic, seasonality, recommendation distribution, or other variables also changed, the system should record those possible confounders and avoid claiming that the thumbnail caused the increase unless evidence supports that conclusion.

Preferred evidence language:

- observed,
- associated with,
- insufficient evidence for causal attribution,
- experimentally supported,
- high-confidence learning.

---

# 12. Decision effectiveness

The integrated system should eventually measure the effectiveness of:

- title decisions,
- thumbnail decisions,
- metadata changes,
- script changes,
- hook changes,
- packaging changes,
- publication timing,
- audience/community actions,
- AI recommendations,
- human decisions,
- experiments.

This does **not** mean reducing creator decisions to simplistic scores.

Effectiveness should consider:

- intended outcome,
- measured outcome,
- evidence quality,
- comparison quality,
- confidence,
- confounders,
- downstream effects,
- whether the decision was actually implemented,
- whether enough data exists.

---

# 13. Learning model

Learning should progress through evidence levels.

### Level 1 — Observed

Example:

> CTR increased 14% after thumbnail variant B was selected.

### Level 2 — Evidence-supported association

Comparable baseline and post-change windows show a meaningful association with adequate data.

### Level 3 — Experimentally supported learning

A controlled or sufficiently strong experiment provides evidence for an effect.

Only appropriately validated evidence should become strong durable Brain knowledge.

The system must never silently promote a single correlation, creator preference, AI inference, or one-off success into durable Channel Knowledge.

---

# 14. New integrated functions to plan

These are capabilities to integrate into existing systems, not automatically separate products.

1. Decision Registry
2. Change/Event Registry
3. Generation Lineage
4. Decision-to-Outcome Attribution
5. Post-Publish ContentBuild Timeline
6. Analytics Checkpoint Framework
7. Before/After Evaluation
8. Experiment Attribution
9. Confounder Detection
10. Decision Effectiveness Analysis
11. Learning Candidate Generation
12. Failed Decision Learning
13. Rollback Intelligence
14. Recommendation Effectiveness
15. Analysis Accuracy Tracking
16. Generation Success Tracking
17. Metadata Effectiveness Tracking
18. Thumbnail Effectiveness Tracking
19. Script/Hook Effectiveness Tracking
20. Cross-Project Learning

These should map to existing domain owners rather than becoming a new monolithic “analytics intelligence” subsystem.

---

# 15. Lifecycle timeline

A creator should eventually be able to inspect a unified timeline such as:

```text
PROJECT: Egypt History Video

Oct 01  Idea
Oct 02  Opportunity identified
Oct 03  Concept created
Oct 04  Script created
Oct 05  Hook revised
Oct 06  Thumbnails generated
Oct 06  Thumbnail #7 selected
Oct 07  Metadata optimized
Oct 07  Publishing package approved
Oct 08  Published
Oct 09  Analytics checkpoint
Oct 11  Low CTR detected
Oct 12  Title changed
Oct 15  CTR improves
Oct 18  Evaluation
Oct 19  Learning candidate
Oct 20  Governed Brain knowledge
```

The timeline should be backed by real operation, asset, decision, publication, analytics, and evaluation identity—not a UI-only activity feed.

---

# 16. Decision Graph

In addition to the timeline, create a graph-capable relationship model:

```text
Analysis
   ↓
Finding
   ↓
Recommendation
   ↓
Decision
   ↓
Title / Thumbnail / Metadata / Asset Change
   ↓
Published Variant
   ↓
Analytics
   ↓
Evaluation
   ↓
Learning Candidate
```

This lets ViewTube answer “why is this version here?” and “what happened after we made this decision?” without reconstructing the answer from disconnected logs.

---

# 17. Studio Hub integration

Studio Hub should consume the integrated lifecycle rather than own separate versions of it.

Every tool should eventually understand:

- current Project,
- current ContentBuild,
- available assets,
- relevant previous decisions,
- applicable evidence,
- current generation context,
- handoff targets,
- current publishing state,
- relevant analytics,
- prior outcomes,
- governed Brain knowledge.

A universal Studio Hub context layer should provide this context.

### Universal tool contracts

Standardize:

- Project Load / Swap,
- Tool Context,
- Send To / Handoff,
- Output / Result,
- Operation ID,
- Asset Reference,
- Evidence Reference,
- Brain Context Resolver,
- readiness/blocker state,
- history/version/variant references.

---

# 18. Recommended implementation order

## Phase 0 — Stabilize and converge

Before adding new Studio Hub tools:

- reconcile canonical authorities,
- remove duplicate ownership,
- inventory current implementations,
- certify IDs,
- identify obsolete plans,
- resolve major handoff inconsistencies,
- establish one-write-owner rules,
- verify operation/correlation identity,
- address known idempotency and state-machine gaps.

### Quick wins

1. Universal Project Load/Swap.
2. Universal Tool Context.
3. Universal Send To/Handoff.
4. Universal Output/Result contract.
5. Universal Operation ID.
6. Universal Asset reference.
7. Universal Evidence reference.
8. Universal Brain context resolver.
9. Universal readiness/blocker model.
10. Universal history/version/variant model.

---

## Phase 1 — Project / ContentBuild identity certification

Certify:

```text
Project → ContentBuild → Asset → Tool → Package
```

IDs must survive all supported handoffs.

Use the existing ProjectManifestation system to expose and manipulate Project/Publishing Package context in Studio Hub tools.

---

## Phase 2 — Asset Engine backbone

Certify:

- asset identity,
- version identity,
- variant identity,
- derivative lineage,
- exact selection,
- exact-used-variant attribution,
- Project/ContentBuild linkage.

---

## Phase 3 — Universal Studio Hub context

Every tool gets the same lifecycle context model.

Do not make every tool independently reconstruct Project, asset, AI, or Brain context.

---

## Phase 4 — AI / Brain integration

Connect:

- creator context,
- Project/ContentBuild context,
- evidence,
- prior decisions,
- prior outcomes,
- generation provenance,
- governed learning.

AI should recommend and reason using canonical context but should not silently write durable knowledge.

---

## Phase 5 — Studio Hub ↔ Asset Engine

Every tool that generates or modifies assets should use canonical asset identity and lineage.

---

## Phase 6 — Decision / Change / Generation lineage

Add the integrated tracking model described in sections 5–14.

This should be built before large-scale creation of new Studio Hub tools so every new tool is measurable from day one.

---

## Phase 7 — Publishing closure

Complete:

- AssetSlotRegistry,
- ApprovedPublishSnapshot,
- PublishTransaction binding/recovery,
- post-publish ContentBuild identity,
- exact selected title/thumbnail/render/package attribution.

---

## Phase 8 — Analytics → Evaluation bridge

Complete producer coverage so consequential actions can declare:

- expected outcome,
- metric,
- evaluation target,
- checkpoint,
- comparison semantics.

Then connect measured results to the originating operation, decision, ContentBuild, and exact used variant.

---

## Phase 9 — Lifecycle timeline / Decision Graph

Expose the underlying lineage through creator-facing UI.

The first useful surface can be a ContentBuild history/timeline before building a more sophisticated graph visualization.

---

## Phase 10 — Brain learning loop

Close:

```text
Recommendation
 → Approval
 → Action
 → Receipt
 → Outcome
 → Evaluation
 → Learning Candidate
 → Governed Promotion
```

Include user ratings/rejections and post-publish analytics while preserving evidence discipline.

---

## Phase 11 — Studio Hub tool waves

Only after the shared foundation is stable should the new Studio Hub tools be implemented in waves.

Each tool must have:

- one decisive primary outcome,
- one canonical owner,
- existing Toolbox/SubToolbox primitives,
- Project/ContentBuild context,
- canonical asset identity,
- standard handoffs,
- operation identity,
- generation lineage,
- decision lineage,
- output/result contract,
- analytics/evaluation hooks where consequential,
- Brain/evidence integration where appropriate.

---

## Phase 12 — Cross-project intelligence

Once enough trustworthy outcomes exist, build higher-order intelligence such as:

- Opportunity Radar,
- Creator Strategy Engine,
- cross-project pattern detection,
- recommendation effectiveness,
- reusable experiment knowledge,
- strategy-level analytics.

Do not build these systems around unvalidated correlations.

---

# 19. First implementation slice

The safest first vertical slice is:

```text
Project
  ↓
Script Architect
  ↓
Send To
  ↓
Thumbnail Studio
  ↓
Save to ContentBuild
  ↓
Video Publisher
  ↓
Publishing Package
  ↓
Publish
  ↓
Analytics Checkpoint
  ↓
Evaluation
```

Prove the complete identity and receipt chain with existing tools before expanding the tool inventory.

This validates the architecture with real production behavior rather than designing the entire future system first.

---

# 20. Studio Hub product-inventory reconciliation

Before adding tools, reconcile the runtime inventory against the canonical proposed product inventory.

The earlier canonical proposal included:

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

The runtime already contains overlapping/specialized systems.

Potential consolidations already identified:

- Content Architect + Script / Story Engine → one coherent creation architecture where appropriate.
- Thumbnail Studio + End-Screen Architect → potentially one packaging/visual architecture if ownership remains clear.
- Community Posts + comment-related functions → Audience-oriented system where appropriate.
- Content Analysis → potentially separate pre-publication and post-publication analysis capabilities.
- Revenue Architect → remain a distinct income-generation system, potentially with Opportunity capabilities.

Do not create a new tool merely because a capability is missing from the product list. First determine whether it belongs as an improvement to an existing owner.

---

# 21. Existing special ownership rules

### Video Manager

Owns already-published videos.

It is the live editing/management workstation for published YouTube metadata and related controls.

It may consume analytical context and intelligence but remains the owner of changing published video metadata.

### Video Publisher

Owns unpublished projects and publishing preparation.

It can work across multiple projects and compile publishing work, but its decisive purpose remains publishing preparation.

### Metadata Intelligence

Should be a shared capability embedded into the publishing workflows, not a competing publishing workstation.

---

# 22. UI architecture requirements

The integrated lifecycle must use the existing ViewTube UI system.

Rules:

- Use default Toolbox and SubToolbox components/primitives.
- Do not recreate existing controls with raw HTML when a canonical primitive exists.
- Shared changes must use canonical primitives so fixes propagate.
- Specialized workspace components are allowed only where the function genuinely requires them.
- Toolbox UI Reference Library remains the visual source of truth.
- Existing style, token, size, state, responsive, accessibility, and motion systems remain authoritative.
- Distinguish disconnected, empty, loading, partial/unsupported, error/retry, permission/quota-blocked, and success states.
- Keep component ownership explicit.

The recent Studio Hub audit should become an implementation gate rather than a one-time visual review.

---

# 23. Stability gates before large implementation

Before starting the broad new-tool build, eliminate these classes of problems:

### Architecture

- duplicate owners,
- duplicate stores,
- ambiguous IDs,
- parallel handoff systems,
- conflicting lifecycle definitions.

### Data

- missing ContentBuild identity,
- missing publication binding,
- missing exact-used-variant identity,
- missing operation/correlation IDs,
- weak version/variant lineage.

### Analytics

- non-comparable metrics,
- missing checkpoint identity,
- missing baseline windows,
- missing data-quality/missingness states,
- unsupported causal claims.

### AI

- lost project context,
- missing generation provenance,
- recommendations without stable IDs,
- silent learning promotion,
- disconnected Brain context.

### UI

- hybrid/noncanonical controls,
- hard-coded geometry,
- inconsistent states,
- responsive failures,
- accessibility gaps,
- tool inventory duplication.

---

# 24. Major hurdles to solve early

1. **Identity continuity:** IDs must survive the entire lifecycle.
2. **Exact attribution:** identify the exact title, thumbnail, package, render, or variant that was actually published.
3. **Operation continuity:** connect generation, decision, handoff, publish, and evaluation operations.
4. **Analytics comparability:** avoid invalid before/after comparisons.
5. **Causal overclaiming:** distinguish correlation from causation.
6. **Learning governance:** prevent accidental Brain knowledge promotion.
7. **Tool ownership:** prevent multiple tools from owning the same state.
8. **UI convergence:** prevent new tools from recreating canonical primitives.
9. **State recovery:** support interrupted/failed workflows without duplicate writes.
10. **Cross-project reuse:** preserve lineage while allowing useful generalized learning.

---

# 25. What success looks like

A future creator should be able to ask ViewTube:

> Why did we choose this thumbnail?

And ViewTube can answer:

- which analysis suggested it,
- which variants were generated,
- which were rejected,
- who/what selected the final version,
- what evidence supported the decision,
- which operation produced it,
- which exact asset version was published,
- what happened to the video afterward,
- what analytics were observed,
- whether the comparison was valid,
- whether the result was merely associated or experimentally supported,
- whether the decision was rolled back,
- and whether any governed learning was created from it.

Likewise, ViewTube should eventually be able to answer:

> Which of our past decisions actually worked?

without pretending that every observed correlation is causal.

---

# 26. Canonical source mapping

This plan should remain subordinate to domain-specific authorities, including:

- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md`
- `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md`
- `docs/architecture/VIEWTUBE_MASTER_PRODUCT_TOOLS_WORKSTATION_ARCHITECTURE.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/programs/INTEGRATED_APPLICATION.md`
- `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md`
- Studio Hub AI / Brain / prompt architecture
- Studio Hub interactions / handoff contracts
- `docs/specifications/TOOLBOX_PROMOTION_AND_WORKFLOW_CHAINS.md`
- system-convergence tasks and backlog
- existing Analytics Canon / VT-SYNC implementation
- existing Brain governed-learning authorities

This document is an integration and implementation map, not permission to override a domain owner.

---

# 27. Immediate next actions

1. Reconcile the canonical document/authority map.
2. Certify Project → ContentBuild → Asset → Publishing identity continuity.
3. Certify Operation ID / ActionPacket / ToolReceipt / GenerationRecord convergence.
4. Finish exact-used-variant publication attribution.
5. Finish post-publish ContentBuild identity.
6. Connect Analytics checkpoints to outcome/evaluation.
7. Add decision/change/generation lineage to the existing infrastructure.
8. Build the first complete lifecycle slice using existing Studio Hub tools.
9. Expose the lifecycle timeline.
10. Validate Brain learning promotion against real evidence.
11. Only then expand the future Studio Hub tool set.

## Guiding principle

**Connect first. Measure second. Learn third. Expand tools fourth.**

The objective is one ViewTube content lifecycle—not a collection of disconnected tools that happen to share a UI.


## Branch consolidation — 2026-10-08

A source-level review of every branch named for Studio Hub or Metadata Master found four relevant branches. Their useful Metadata Master planning and implementation are already present in current `main`; the branch-only Video Manager/Video Publisher revisions are older hybrid UI paths and are intentionally not reintroduced. The detailed disposition is recorded in `docs/architecture/VIEWTUBE_STUDIO_HUB_METADATA_BRANCH_CONSOLIDATION_2026-10-08.md`.

This establishes a recovery rule for future work: **consolidate architectural knowledge and still-valid code, not branch history blindly.** Current canonical primitives, Project Manifestation, Metadata Master ownership, Publishing Package boundaries, ActionPacket/Handoff contracts, and analytics/Brain lineage remain authoritative.
