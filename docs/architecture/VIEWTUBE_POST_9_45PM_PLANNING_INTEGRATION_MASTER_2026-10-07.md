# ViewTube — Post-9:45 PM EST Planning, Audit & Integration Master

**Status:** ACTIVE — consolidated planning record  
**Created:** 2026-10-07  
**Coverage window:** Work and planning produced after **9:45 PM EST on 2026-10-07**  
**Repository:** `viewtube-dev/viewtube`  
**Purpose:** Preserve and consolidate the ViewTube planning, architecture, audits, decisions, integration proposals, sequencing, quick wins, and post-publishing analytics/learning requirements developed during this work window.

> **This document is a consolidation layer, not a new system authority.** Existing canonical owners remain authoritative. New proposals in this document must be reconciled into those owners rather than implemented as parallel databases, stores, identity systems, analytics authorities, Brain systems, or handoff frameworks.

---

## 1. Executive direction

The strongest conclusion from the post-9:45 PM work is:

> **Do not build the next generation of Studio Hub tools first. Finish the connective tissue that makes Projects, ContentBuild, Asset Engine, publishing, analytics, decisions, AI/Brain, handoffs, and Studio Hub operate as one lifecycle.**

The intended lifecycle is:

```text
CHANNEL / CREATOR
      ↓
PROJECT
      ↓
CONTENT BUILD
      ↓
RESEARCH / CONCEPT / SCRIPT / STORY
      ↓
GENERATIONS / ASSETS / VARIANTS / VERSIONS
      ↓
VIDEO PACKAGE
      ↓
PUBLISHING PACKAGE
      ↓
VIDEO PUBLISHER
      ↓
YOUTUBE
      ↓
POST-PUBLISH ANALYTICS
      ↓
OUTCOME / EVALUATION
      ↓
EVIDENCE / LEARNING
      ↓
BRAIN / FUTURE DECISIONS
      ↓
NEXT OPPORTUNITY / PROJECT
```

Studio Hub should sit on top of this lifecycle as the creator-facing execution layer.

The most important new extension is to make the lifecycle capable of answering:

- What decision was made?
- Why was it made?
- What evidence supported it?
- What exactly changed?
- Which generated variant was selected?
- Which exact variant was actually published?
- When was it exposed?
- What happened in analytics afterward?
- What other variables changed at the same time?
- What outcome was observed?
- How strong is the evidence?
- Was the recommendation effective?
- Was the generation useful?
- Should the lesson become governed Brain knowledge?
- How should that learning affect the next decision?

---

# 2. Work captured from the post-9:45 PM planning session

## 2.1 Initial cross-system integration brainstorm

The first integration brainstorm reviewed:

- Studio Hub plans
- Projects page plans
- Project System plans
- ContentBuild System plans
- Asset Engine plans
- AI / Brain connections
- handoff plans
- future Studio Hub tool plans
- publishing continuity
- analytics and learning continuity

### Central finding

The systems should not be built as independent feature collections.

They should be assembled around a single durable content lifecycle:

```text
Project
→ ContentBuild
→ Asset / Generation lineage
→ Video Package
→ Publishing Package
→ Published Video
→ Analytics
→ Evaluation
→ Learning
→ Future Project / Opportunity
```

### Recommended implementation sequence

1. System convergence and authority cleanup
2. Project / ContentBuild identity certification
3. Operation + handoff identity
4. Decision / Change / Generation lineage
5. Publishing snapshot + exact-used-variant attribution
6. Post-publish ContentBuild continuity
7. Analytics checkpoint → evaluation bridge
8. Decision / Outcome timeline and graph
9. Brain learning loop
10. Studio Hub tool integrations
11. New Studio Hub tools
12. Cross-project intelligence / Creator Strategy Engine

### Preferred first implementation slice

Use a small, real end-to-end path to prove the architecture:

```text
Project
  ↓
Script Architect
  ↓ Send To / Handoff
Thumbnail Studio
  ↓ Save to ContentBuild
Video Publisher
  ↓
Publishing Package
  ↓
Published Video
  ↓
Analytics checkpoint
  ↓
Outcome / evaluation
```

This proves the connective architecture before multiplying tools.

---

# 3. Planning-authority audit

The planning authorities reviewed during this work window were identified as follows.

| Authority | Known creation / audit point | Role |
|---|---|---|
| Projects / ContentBuild Workflow Master | Created 2026-09-22; last audited main 2026-09-24 | Living cross-system Projects / ContentBuild authority |
| Asset Engine Master Resource | 2026-09-20; last audited main 2026-09-24 | Asset/version/variant/generation/publishing contracts |
| Studio Hub Master Tool Architecture | 2026-10-04 | Canonical Studio Hub architecture |
| Studio Hub AI / Brain / Prompts | 2026-10-05 | Active AI/Brain/prompt target |
| Studio Hub Interactions / Handoffs | 2026-10-05 | Active interaction and workflow contract target |
| Toolbox Promotion / Workflow Chains | Last edited 2026-09-27 | Workflow and promotion specification |
| Finish Program | 2026-09-24 | Dated convergence/completion source |
| System Convergence Plan | Created/edited 2026-09-26 | Active convergence implementation plan |

### Important authority rule

Dates above are planning-history dates, not permission to ignore newer code or decisions.

When documents disagree:

1. inspect current production code;
2. identify the latest accepted product decision;
3. preserve useful historical reasoning;
4. reconcile the result into the living authority;
5. do not create another competing authority.

---

# 4. Studio Hub audit findings

A full Studio Hub UI/architecture audit identified ten dimensions that should remain part of future tool certification:

1. Tool identity and decisive outcome
2. Information architecture and hierarchy
3. Primary-action visibility
4. Feature discoverability/completeness
5. Component ownership/reuse
6. State architecture
7. Workflow continuity/handoffs
8. Responsive composition/density
9. Accessibility/interaction semantics
10. Visual-system integrity

### Runtime Studio Hub inventory observed

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

### Important product/architecture mismatch

The runtime inventory differs from the canonical Round 1 proposal of:

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

This must be reconciled before adding more top-level tools.

### Audit score

The cross-tool audit identified:

- Accessibility: 2/4
- Performance: 3/4
- Theming: 1/4
- Responsive behavior: 2/4
- Implementation integrity: 2/4

**Total: 10/20**

This means the next priority is convergence and certification, not uncontrolled surface-area expansion.

### Primary UI architecture recommendation

```text
ONE Toolbox shell
      ↓
ONE SubToolbox system
      ↓
ONE primitive registry
      ↓
ONE token / size system
      ↓
SPECIALIZED WORKSPACE COMPONENTS
only where genuinely required
```

All new Studio Hub tools must use the existing canonical Toolbox/SubToolbox primitives.

Do not create duplicate controls when a canonical ViewTube component already exists.

---

# 5. Existing canonical lifecycle foundation

The current Projects / ContentBuild authority already establishes:

- Project as creator-facing planning container
- ContentBuild as durable content identity/lifecycle spine
- Asset Engine as orchestration/facade
- Video Package as structured creative/production/publishing contract
- Publishing Package as YouTube-facing publication configuration
- Vault as durable artifact/media identity
- specialist tools as producers/consumers of the same ContentBuild scope

### Required identity

```text
Project.contentBuildId
=
VideoPackage.contentBuildId
=
Asset.contentBuildId
=
Editor / Publisher contentBuildId
```

A mismatch is an error.

No surface may silently create or choose a second ContentBuild.

### Existing hard invariants

- One Project maps to one durable ContentBuild identity.
- Normal Video Package persistence requires canonical ContentBuild identity.
- Conflicting ContentBuild package writes must be rejected.
- Stale package writes must not overwrite newer ContentBuild revisions.
- Version and Option/Variant are different concepts.
- Selected is reversible and does not imply Final.
- Finalization/approval is explicit.
- Publishing/Launch/Readiness are projections or services, not parallel truth stores.
- Analytics remains canonical metric truth.
- ContentBuild stores identity/checkpoint references rather than becoming an analytics authority.
- Learning remains governed.
- Outcomes never rewrite historical creative truth.

---

# 6. New master concept: Content Decision & Outcome History

The post-publish extension should be treated as a capability across the existing lifecycle, not a new standalone database.

It should connect:

```text
DECISION
   ↓
REASON / EVIDENCE
   ↓
CHANGE
   ↓
EXACT VERSION
   ↓
PUBLICATION / EXPOSURE
   ↓
ANALYTICS CHECKPOINTS
   ↓
OUTCOME
   ↓
EVALUATION
   ↓
LEARNING
```

This is the missing connective layer needed to make ViewTube capable of learning from the consequences of creator decisions.

---

# 7. Decision vs. Change

This distinction is mandatory.

### Change

Records **what technically changed**.

Examples:

- title changed from A → B
- thumbnail asset changed from #4 → #7
- description paragraph updated
- tags changed
- script version changed
- hook changed
- generated image replaced
- prompt changed
- metadata generated again

### Decision

Records **why an intentional choice was made**.

Examples:

- selected thumbnail #7 because it scored better on the defined criteria
- changed title after analysis identified a packaging weakness
- rejected an AI recommendation
- rolled back a thumbnail
- chose to run an experiment
- deferred a recommendation because evidence was insufficient

A technical change can occur without a creator decision. A decision should be capable of causing one or more changes.

---

# 8. Decision Registry

Add a governed Decision Registry capability to the existing lifecycle.

Each decision should be capable of recording:

- stable Decision ID
- Project ID
- ContentBuild ID
- Channel ID
- operation ID
- actor
- timestamp
- decision type
- affected object
- prior version
- new version
- reason
- supporting evidence IDs
- analysis/finding IDs
- recommendation ID when applicable
- confidence
- expected outcome
- expected direction
- decision state
- downstream change IDs
- experiment ID when applicable

### Decision states

At minimum:

- KEEP
- REJECT
- MODIFY
- SELECT
- PUBLISH
- ROLLBACK
- TEST
- DEFER
- APPROVE

---

# 9. Change / Event Registry

The existing event and operation infrastructure should be extended rather than replaced.

Every consequential change should be attributable to:

- Project
- ContentBuild
- operation ID
- source tool
- actor
- exact object/version
- before state where appropriate
- after state
- timestamp
- reason/decision link
- downstream publication relationship

This creates an auditable content history without creating a second content database.

---

# 10. Generation lineage

Every meaningful generation should support:

```text
Generation
   ↓
Variants
   ↓
Selection
   ↓
Use
   ↓
Publication / Exposure
   ↓
Outcome
```

Examples:

- title generations
- thumbnail generations
- scripts
- hooks
- descriptions
- tags
- images
- scenes
- prompts
- analyses
- recommendations

### Critical attribution rule

Only the exact selected/used/published variant should receive direct exposure/outcome attribution.

Generated-but-unused alternatives should remain lineage records, not be falsely treated as exposed experiments.

---

# 11. Analysis lineage

Analysis should become part of the decision chain:

```text
ANALYSIS
   ↓
FINDING
   ↓
RECOMMENDATION
   ↓
CREATOR DECISION
   ↓
SCRIPT / ASSET / METADATA CHANGE
   ↓
PUBLISH
   ↓
ANALYTICS
   ↓
EVALUATION
   ↓
LEARNING CANDIDATE
```

This allows ViewTube to later answer:

- Which analyses led to useful changes?
- Which recommendations were accepted?
- Which recommendations were rejected?
- Which recommendations produced measurable improvement?
- Which analysis patterns repeatedly proved unreliable?
- Which recommendation types are useful for this creator?

---

# 12. Post-Publish Project Timeline

The Project timeline should become a chronological projection of the complete content lifecycle.

Example:

```text
Oct 01  Idea
Oct 02  Opportunity identified
Oct 03  Concept selected
Oct 04  Script generated
Oct 05  Hook revised
Oct 06  Thumbnails generated
Oct 06  Thumbnail #7 selected
Oct 07  Metadata optimized
Oct 07  Package approved
Oct 08  Published
Oct 09  Analytics checkpoint
Oct 11  Low CTR detected
Oct 12  Title changed
Oct 15  CTR improves
Oct 18  Evaluation
Oct 19  Learning candidate
Oct 20  Brain knowledge review
```

The timeline should be a projection of canonical events, not a new event store.

Potential sources:

- project events
- ContentBuild events
- generation records
- tool receipts
- handoffs
- decisions
- changes
- publication receipts
- analytics checkpoints
- experiments
- comments/community events
- evaluations
- learning candidates

---

# 13. Decision Graph

In addition to the timeline, provide a graph view for causal/evidence reasoning:

```text
Analysis
   ↓
Finding
   ↓
Decision
   ↓
Change
   ↓
Exact Variant
   ↓
Published
   ↓
Analytics
   ↓
Evaluation
   ↓
Learning Candidate
   ↓
Future Recommendation
```

This graph should make relationships inspectable without claiming causality where the data cannot support it.

---

# 14. Analytics integration

Analytics remains the canonical metric authority.

The new lifecycle layer should reference Analytics/VT-SYNC rather than duplicating metric storage.

The integration should support:

- analytics checkpoints
- metric snapshots/windows
- exact ContentBuild identity
- exact published asset identity
- publication timestamps
- change points
- experiment IDs
- baseline windows
- post-change windows
- data sufficiency
- metric/dimension compatibility
- missingness/provenance
- evaluation references

### Evaluation model

For consequential changes:

```text
BASELINE
   ↓
CHANGE POINT
   ↓
STABILIZATION WINDOW
   ↓
EVALUATION WINDOW
   ↓
COMPARISON
   ↓
CONFIDENCE / UNCERTAINTY
```

Each evaluation should record:

- metric
- scope
- unit
- baseline window
- comparison window
- changed variable(s)
- expected direction
- observed direction
- data sufficiency
- confounders
- confidence
- causal-attribution status
- evidence references

---

# 15. Causality discipline

ViewTube must not convert temporal correlation into causal certainty.

Example:

> Title changed → CTR increased.

That does **not** automatically mean:

> Title caused the CTR increase.

At the same time:

- thumbnail may have changed;
- traffic source may have changed;
- audience mix may have changed;
- seasonality may have changed;
- distribution may have changed;
- another experiment may have been active.

The system should distinguish:

1. **Observed**
2. **Evidence-supported association**
3. **Experimentally supported learning**

Recommended language:

> **Association observed; causal attribution insufficient.**

Only stronger evidence should promote a lesson into stronger durable Brain knowledge.

---

# 16. Experiment attribution

Version & Experiment Manager should eventually support alternative:

- scripts
- hooks
- edits
- titles
- thumbnails
- cuts
- prompts
- metadata
- packages

Each experiment needs:

- experiment ID
- hypothesis
- variants
- selection/exposure relationship
- start/end
- target metric(s)
- baseline
- comparison
- outcome
- evaluation
- confidence
- confounders
- final conclusion
- learning disposition

---

# 17. Recommendation effectiveness

Track recommendations separately from raw analytics.

For each recommendation:

```text
Recommendation
→ Creator response
→ Action taken
→ Result
→ Evaluation
→ Effectiveness
```

Possible outcomes:

- accepted + helpful
- accepted + neutral
- accepted + harmful
- rejected + later validated
- rejected + later disproven
- modified before use
- deferred
- insufficient evidence

This creates a feedback mechanism for improving future Brain recommendations.

---

# 18. Analysis accuracy tracking

Analysis systems should also be evaluated.

For example:

```text
Analysis Finding
→ Recommendation
→ Creator Action
→ Outcome
→ Evaluation
```

Over time ViewTube can determine:

- which analysis types are accurate;
- which recommendations are reliable;
- which confidence scores are calibrated;
- which patterns produce false positives;
- which analysis domains need better evidence;
- which analyses should be downgraded or retired.

This is a major part of the future AI/Brain evaluation system.

---

# 19. Generation success tracking

Track the effectiveness of generations without assuming every generation is good or bad.

Useful dimensions:

- generated
- reviewed
- selected
- rejected
- modified
- used
- published
- retained
- replaced
- downstream outcome

This allows questions such as:

- Which generation systems produce selected outputs?
- Which prompts produce useful variants?
- Which generated thumbnails survive into publication?
- Which generated metadata requires heavy editing?
- Which generated scripts lead to successful outcomes?

---

# 20. Metadata effectiveness

Metadata changes should be attributable individually.

Track:

- title versions
- description versions
- tags
- category
- playlists
- visibility
- audience settings
- timestamps
- thumbnail changes
- metadata-generation operations
- creator decisions
- publication exposure
- analytics checkpoints
- evaluation

This supports future questions such as:

> What happened after this title change?

rather than merely:

> What is the current title?

---

# 21. Thumbnail effectiveness

Thumbnail lineage should connect:

```text
Generated Thumbnail
→ Candidate
→ Selected
→ Published
→ Exposure
→ CTR / related metrics
→ Evaluation
```

Thumbnail variants that were generated but never published must remain distinguishable from exposed variants.

---

# 22. Script / Hook effectiveness

Scripts and hooks should eventually be evaluated through the same lineage.

Examples:

- hook version
- script version
- selected version
- production version
- published version
- relevant downstream analytics
- retention-related observations where valid
- evaluation
- learning status

The system must avoid attributing downstream performance to a script/hook when multiple uncontrolled changes make the relationship uncertain.

---

# 23. Failed-decision learning

The learning system must learn from failures as well as successes.

Examples:

- recommendation rejected and later shown useful
- recommendation accepted and produced poor outcome
- generated asset selected but later replaced
- metadata change rolled back
- experiment inconclusive
- analysis repeatedly overestimated an opportunity

Failed decisions should produce evidence, not automatic negative rules.

---

# 24. Rollback intelligence

When a creator rolls back:

```text
Change A
→ Outcome
→ Rollback
→ Outcome after rollback
```

The system should preserve the complete history.

Rollback must never erase the earlier decision or outcome.

---

# 25. Cross-project learning

Once multiple projects have sufficiently strong evidence, ViewTube can compare patterns across projects.

Examples:

- repeated thumbnail improvements
- recurring title patterns
- reliable audience-response patterns
- recurring failed recommendations
- successful formats
- effective publishing windows
- effective metadata strategies

Cross-project learning must preserve channel scope and evidence boundaries.

A lesson observed on one creator/channel must not silently become a universal rule.

---

# 26. Learning promotion levels

Use explicit evidence levels.

### Level 1 — Observed

Example:

> CTR increased 14% after a thumbnail change.

### Level 2 — Evidence-supported association

Example:

> CTR increased after the thumbnail change across a sufficiently comparable baseline and evaluation window.

### Level 3 — Experimentally supported learning

Example:

> A controlled comparison indicates the thumbnail variant improved the target metric.

Only stronger evidence should become strong durable Brain knowledge.

---

# 27. Brain integration

The Brain should consume governed evidence.

The Brain should not silently rewrite itself from raw analytics.

Target:

```text
Analytics
   ↓
Outcome
   ↓
Evaluation
   ↓
Evidence Record
   ↓
Learning Candidate
   ↓
Governed Review / Promotion
   ↓
Brain Knowledge
   ↓
Future Recommendation
```

This preserves the existing principle that Brain learning is governed and evidence-backed.

---

# 28. Universal contracts to converge

The post-9:45 work identified these as the highest-value shared contracts:

1. Project Context
2. Tool Context
3. Handoff
4. Output / Result
5. Operation ID
6. Asset Reference
7. Evidence Reference
8. Brain Context Resolver
9. Readiness / Blocker model
10. History / Version / Variant model
11. Decision record
12. Change record
13. Generation lineage
14. Analytics checkpoint
15. Outcome record
16. Evaluation record
17. Learning candidate

These should be implemented through existing canonical owners wherever possible.

---

# 29. Quick wins before major Studio Hub expansion

Before building a large number of new tools:

### Quick win 1 — Universal Project Load / Swap

Every relevant Studio Hub tool should be able to load/swap the same Project / ContentBuild context.

### Quick win 2 — Universal Tool Context

Every specialist tool receives:

```text
projectId
contentBuildId
channelId
selected assets
evidence
source tool
requested action
operation ID
```

### Quick win 3 — Universal Send To / Handoff

Make handoffs carry identity and intent, not just navigation.

### Quick win 4 — Universal Result Contract

Every tool should return:

- outputs
- asset IDs
- versions
- evidence IDs
- operation ID
- status
- blockers
- suggested next destinations

### Quick win 5 — Exact Asset Identity

Every meaningful output must resolve to a canonical asset/version/variant identity.

### Quick win 6 — Evidence References

Analysis and recommendations should preserve the evidence used.

### Quick win 7 — Readiness / Blocker Model

Replace scattered “ready/not ready” logic with one canonical readiness model.

### Quick win 8 — Operation Identity

Consequential operations need stable IDs for debugging, attribution, analytics, and learning.

### Quick win 9 — Timeline Projection

Expose existing canonical events as a Project timeline before creating new event storage.

### Quick win 10 — Decision / Change linkage

Start recording why important changes occurred before attempting advanced AI learning.

---

# 30. Hurdles / bugs / architectural risks to eliminate first

## 30.1 Duplicate authority

Do not introduce:

- second Project DB
- second ContentBuild
- second asset store
- second analytics authority
- second Brain
- second handoff framework
- second generation abstraction
- second metadata system
- second timeline/event store

## 30.2 Runtime/product inventory mismatch

Reconcile the actual Studio Hub tool inventory against the canonical product inventory before creating new tools.

## 30.3 Legacy generation paths

Migrate legacy direct generation paths into current Brain / Asset Engine / handoff patterns without removing working creator functionality.

## 30.4 Specialized-tool chrome drift

Bring specialized tools onto canonical Toolbox/SubToolbox systems instead of creating independent UI systems.

## 30.5 Hard-coded styling

Continue removing hard-coded control geometry/palette where canonical tokens/components already exist.

## 30.6 Responsive and accessibility debt

The audit identified significant responsive/accessibility/theming gaps. These should be certified as part of tool completion rather than postponed indefinitely.

## 30.7 Publication freeze gap

An immutable ApprovedPublishSnapshot is still an open target.

## 30.8 Publish transaction gap

A resumable/idempotent PublishTransaction and remote verification path remain open targets.

## 30.9 Post-publish producer coverage

Analytics checkpoint writers and outcome/evaluation producer coverage need completion.

## 30.10 Metric comparability

Metric × dimension compatibility must be explicitly governed by the Analytics/VT-SYNC system.

---

# 31. Existing repo plans that already support this direction

The post-9:45 planning did not invent the entire concept from scratch. Existing repo architecture already contains substantial foundations.

### Projects / ContentBuild Workflow Master

Already defines:

- analytics checkpoint writers
- immutable exact-used-variant / PublishedSelectionReceipt attribution
- outcome/evaluation records
- Version & Experiment Manager
- Post-Publish Learning Loop
- Project Timeline opportunity
- Project Memory
- Project Intelligence

### Finish Program

Already identifies:

- AssetSlotRegistry
- ApprovedPublishSnapshot
- PublishTransaction binding/recovery
- post-publish ContentBuild identity
- Editor → Asset Engine → outcome closure
- publishing → analytics → evaluation → learning

### Master Product / Tools / Workstation Architecture

Already identifies:

- analytics store
- event/job layer
- evidence layer
- knowledge/RAG
- agent gateway
- shared identity
- generic outcome/evaluation infrastructure
- correlation/idempotency envelope

### Integrated Application

Already calls for:

- attributable title/thumbnail/metadata/package variants
- experiment → outcome → learning connection
- exact publication attribution
- analytics/VT-SYNC canonical dataset/window ownership
- BrainRuntime + Creator Context + Evidence & Intelligence
- GenerationRecord / ActionPacket / ToolReceipt convergence
- recommendation → approval → action → receipt → outcome → evaluation → learning

### Current-main unfinished-work audit

Already identifies:

- analytics checkpoint → evaluation bridge
- producer identity contract
- correlation IDs
- post-publish identity
- metric comparability
- durable state/idempotency/observability

### Workflow / Handoff specifications

Already identify:

- contextual destination ranking
- creator-learning workflow preference signals
- workflow chains
- ActionPacket receipts
- evidence IDs
- canonical identities
- outcome integration

---

# 32. Recommended master implementation order

## Phase 0 — Stabilize and converge

- reconcile documentation authorities
- reconcile runtime/product Studio Hub inventory
- certify canonical primitives
- identify duplicate systems
- close obvious implementation drift
- establish operation/correlation identity

## Phase 1 — Project identity

- certify Project → ContentBuild identity
- certify ProjectManifestation / load/swap
- certify specialist-tool context

## Phase 2 — Lifecycle backbone

- ContentBuild → Asset Engine
- generation lineage
- asset/version/variant identity
- selection/finalization
- handoff/output contracts

## Phase 3 — Decision history

- Decision Registry
- Change Registry
- reason/evidence references
- decision → change linkage
- operation identity

## Phase 4 — Publishing attribution

- ApprovedPublishSnapshot
- PublishTransaction
- exact-used-variant receipt
- YouTube binding
- publication timestamp/state

## Phase 5 — Post-publish continuity

- post-publish ContentBuild identity
- analytics checkpoint writers
- project timeline
- experiment references
- metadata/change history

## Phase 6 — Evaluation

- baseline/evaluation windows
- metric compatibility
- confounder handling
- evidence sufficiency
- recommendation effectiveness
- generation effectiveness

## Phase 7 — Brain learning

- learning candidates
- evidence levels
- governed promotion
- creator/channel scope
- future recommendation feedback

## Phase 8 — Studio Hub integration

- retrofit existing tools
- universal Project Context
- universal Handoff
- universal Result
- timeline/decision visibility
- analytics feedback visibility

## Phase 9 — New Studio Hub tools

Only now expand the new tool inventory.

Every new tool must have:

- one decisive outcome
- canonical Project/ContentBuild context
- canonical primitives
- defined inputs
- defined outputs
- generation lineage
- decision/change handling
- evidence
- handoff
- analytics relationship
- success metric
- failure/blocker state

## Phase 10 — Cross-project intelligence

After sufficient evidence:

- Creator Strategy Engine
- Opportunity Radar
- advanced cross-project learning
- recommendation ranking
- strategy-level experimentation

---

# 33. Proposed Studio Hub integration rule

Every Studio Hub tool should be treated as one node in the content lifecycle.

A tool should answer:

### Before execution

- What Project am I operating on?
- What ContentBuild am I operating on?
- What previous work exists?
- What evidence exists?
- What decisions have already been made?
- What assets/variants exist?
- What blockers exist?
- What is the intended outcome?

### During execution

- What operation is occurring?
- What is being generated?
- What changed?
- What decision caused the change?
- What evidence supported it?

### After execution

- What was produced?
- What exact version was selected?
- Where was it saved?
- What tool should receive it next?
- What should be measured?
- What should appear in the timeline?
- What outcome can eventually be associated with it?

---

# 34. Future Studio Hub tool requirements

The future tool system should preserve the existing decision that tools have one primary purpose.

Examples:

### Video Manager

Published-video management only.

### Video Publisher

Unpublished project/package preparation and publication workflow.

### Metadata Master

Metadata intelligence/capability embedded into appropriate publishing workflows rather than becoming a duplicate publishing workstation.

### Content Analysis

Potentially pre-publication and post-publication analysis surfaces, with adjustable creator input.

### Revenue Architect

Dedicated revenue-generation tool and potential Opportunity system.

### Audience Studio

Potential consolidation of community-post and comment-related functionality.

### Content Architect / Script / Story Engine

Potential consolidation where functions overlap, subject to canonical tool ownership.

### Thumbnail Studio / End-Screen Architect

Potential consolidation where their workflow and outcome boundaries support it.

No proposed tool should be added merely because a feature can be placed in a new toolbox.

---

# 35. Acceptance criteria for the integrated system

The architecture should eventually satisfy all of the following:

- One Project has one durable ContentBuild.
- Every relevant tool receives the same identity.
- Every consequential operation has stable operation identity.
- Every generated output has lineage.
- Every selected/final asset is distinguishable from unused variants.
- Every important decision can record its reason and evidence.
- Every technical change can be connected to its decision when applicable.
- Exact published assets are attributable.
- Post-publish analytics can resolve the same ContentBuild.
- Analytics remains owned by Analytics/VT-SYNC.
- Before/after comparisons have explicit windows.
- Metric compatibility is checked.
- Confounders are recorded.
- Causal claims are evidence-bounded.
- Outcomes feed evaluation.
- Evaluations produce governed learning candidates.
- Brain learning requires governed promotion.
- Timeline and Decision Graph are projections of canonical records.
- No parallel Project, ContentBuild, Asset, Analytics, Memory, Brain, or Handoff authority is introduced.
- New Studio Hub tools use canonical ViewTube UI primitives.
- New tools are measured from the beginning.

---

# 36. Canonical references

The consolidation should be reconciled against these existing authorities:

- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md`
- `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md`
- `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md`
- `docs/product/studio-hub/02_STUDIO_HUB_TOOLS.md`
- `docs/product/studio-hub/03_STUDIO_HUB_INTELLIGENCE_AI_BRAIN_PROMPTS.md`
- `docs/product/studio-hub/04_STUDIO_HUB_INTERACTIONS_WORKFLOWS_HANDOFFS_CONTRACTS.md`
- `docs/programs/INTEGRATED_APPLICATION.md`
- `docs/architecture/VIEWTUBE_MASTER_PRODUCT_TOOLS_WORKSTATION_ARCHITECTURE.md`
- `docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md`
- `docs/architecture/VIEWTUBE_FINISH_PROGRAM_2026-09-24.md`
- `tasks/viewtube-finish-program/plan.md`
- `tasks/viewtube-finish-program/todo.md`
- `tasks/viewtube-finish-program/BACKLOG-REGISTRY.md`
- `tasks/system-convergence/todo.md`
- `docs/brain/UNIVERSAL_TOOL_HANDOFFS_AND_SUGGESTED_CHAINS.md`
- `docs/specifications/TOOLBOX_PROMOTION_AND_WORKFLOW_CHAINS.md`
- `docs/VIEWTUBE_100_ITEM_CURRENT_MAIN_UNFINISHED_WORK_AUDIT_2026-09-25.md`
- `ideas/lists/product/current-main-audit-expansion-opportunities.md`
- `docs/product/VIEWTUBE_GENERATION_SYSTEMS_DEFAULT_PROMPTS.md`

---

# 37. Document governance

This master is a **post-9:45 PM planning consolidation**.

It should not silently supersede canonical architecture.

When a proposal here becomes accepted:

1. update the appropriate canonical authority;
2. update the implementation task/backlog;
3. record the decision;
4. identify the code owner;
5. implement through the existing owner;
6. test the behavior;
7. update this document's status;
8. preserve the original reasoning when useful.

When an item is disproven or superseded, mark it rather than deleting its history.

**Core rule:**

> **Consolidate the architecture before expanding it. Track decisions and outcomes before teaching the Brain from them. Measure exact work before attributing results.**
