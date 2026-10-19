# ViewTube Studio Hub — Master Tool Architecture

**Status:** Canonical merged architecture  
**Date:** 2026-10-04  
**Repository:** \`viewtube-dev/viewtube\`  
**Branch:** \`main\`  
**Canonical scope:** Studio Hub intelligence and action engines  
**Source documents merged:**  
- \`docs/product/VIEWTUBE_STUDIO_HUB_TEN_TOOL_ARCHITECTURE.md\`
- \`docs/product/STUDIO_HUB_TOOL_IDEAS.md\`

> This document is the canonical merged specification. The two source documents remain preserved for provenance and historical reference.

---

# 1. Purpose

The ViewTube Studio Hub is the intelligence-and-action layer of ViewTube: a connected set of specialized creator tools that move a creator from one measurable state to another.

These are **outcome engines, not generic utilities and not chatbot panels**.

The source documents contained 20 named tool entries. After reconciliation, six groups were identified as materially overlapping and were combined. The result is **13 canonical Studio Hub tools**.

Every canonical tool must have:

- one primary transformation;
- a decisive reason to exist;
- a clear boundary from neighboring tools;
- inspectable evidence and provenance;
- useful direct outputs;
- consistent handoffs;
- a real creator-facing workspace;
- explicit relationship to AI Brain, Projects, Asset Engine/Vault, Editor, and Analytics.

---

# 2. Canonical 13-Tool Set

| # | Canonical tool | Primary transformation |
|---|---|---|
| 01 | Opportunity Radar | Signals → Opportunities |
| 02 | Content Architect | Opportunities → Content Concepts |
| 03 | Video Genome | Content → Structured Content Patterns |
| 04 | Story Engine | Concepts → Executable Narratives |
| 05 | Asset Forge | Production Blueprints → Production-Ready Asset Packages |
| 06 | Audience Pulse | Audience Behavior → Relationship Opportunities |
| 07 | Content Autopilot | Published Content → Derivative/Follow-up Opportunities |
| 08 | Experiment Lab | Hypotheses → Measurable Learning |
| 09 | Causal Intelligence | Observed Results → Probable Explanations |
| 10 | Channel Simulator | Current Channel State → Future Scenarios |
| 11 | Revenue Architect | Creator/Audience/Asset Intelligence → Monetization Opportunities |
| 12 | Channel Flywheel | Channel System → Growth Bottleneck |
| 13 | Creator Strategy Engine | Validated Intelligence → Next Best Move |

---

# 3. Merge Decisions

## 3.1 Opportunity Radar
**Combined:**
- Opportunity Radar
- Content Opportunity Engine

**Reason:** Both owned early opportunity discovery. The merged version combines signal detection, demand, opportunity scoring, strategic fit, revenue potential, production cost, confidence, freshness, expiration, opportunity graphing, and watchlists.

**Boundary:** Opportunity Radar answers **“What is becoming worth pursuing?”** It does not decide the final content concept.

---

## 3.2 Content Architect
**Retained as a distinct canonical tool.**

The newer architecture's Content Architect fills the gap between opportunity discovery and story design. It can consume Video Genome patterns but does not replace Video Genome.

**Boundary:** Content Architect answers **“What should we make about this?”**

---

## 3.3 Video Genome
**Retained as a distinct canonical tool.**

No equivalent tool in the ten-tool architecture performed the same transformation.

**Boundary:** Video Genome answers **“What patterns exist in content we already have?”**

It converts existing/published content into a structured representation that can be analyzed, compared, reused, and fed into other tools.

---

## 3.4 Story Engine
**Combined:**
- Story Engine
- Story & Retention Architect

**Reason:** Both owned narrative architecture and viewer-retention design. The merged tool combines premise, promise, hook, beat graph, escalation, pattern interrupts, payoff, CTA placement, retention hypotheses, retention risk, visual/audio mapping, and production blueprint.

**Boundary:** Story Engine answers **“How should this content unfold?”**

---

## 3.5 Asset Forge
**Retained as a distinct canonical tool.**

Asset Forge remains the bridge between story/production requirements and the reusable Asset Engine/Vault.

**Boundary:** Asset Forge answers **“What production assets are required, and how do we resolve them into a usable package?”**

---

## 3.6 Audience Pulse
**Combined:**
- Audience Pulse
- Audience Signal Miner
- Creator Relationship Engine

**Reason:** These three concepts all transform audience behavior into structured relationship intelligence and actions.

The merged tool covers:

- questions;
- requests;
- confusion;
- praise;
- complaints;
- desires;
- intent;
- audience segments;
- relationship strength;
- loyal viewers;
- superfans;
- advocates;
- communication opportunities;
- content requests;
- collaboration opportunities;
- response actions.

**Boundary:** Audience Pulse answers **“Who needs attention, what do they need, and what relationship action should happen next?”**

---

## 3.7 Content Autopilot
**Retained as a distinct canonical tool.**

It owns the downstream value extraction from content that has already been produced or published.

**Boundary:** Content Autopilot answers **“What additional value can this existing content produce?”**

It can generate opportunities for:

- Shorts;
- social derivatives;
- follow-up videos;
- FAQ resources;
- educational resources;
- newsletters;
- series extensions;
- audience resources;
- experiments;
- revenue opportunities.

It must not become a generic strategy engine.

---

## 3.8 Experiment Lab
**Unified into one canonical implementation.**

Both source documents described the same fundamental idea: controlled testing that converts uncertainty into evidence.

The canonical version adds rigorous validation around:

- sample quality;
- comparability;
- baseline;
- confounders;
- statistical confidence;
- repeatability;
- conclusion validity.

**Boundary:** Experiment Lab answers **“What should we test to learn?”**

---

## 3.9 Causal Intelligence
**Retained as a distinct canonical tool.**

It owns the investigation of why observed results probably happened.

**Boundary:** Causal Intelligence answers **“Why did this result probably happen?”**

It must distinguish:

- correlation;
- causal evidence;
- hypotheses;
- alternative explanations;
- confidence;
- uncertainty.

---

## 3.10 Channel Simulator
**Retained as a distinct canonical tool.**

It owns scenario modeling rather than diagnosis or strategy.

**Boundary:** Channel Simulator answers **“What might happen if we choose this path?”**

Predictions are ranges/distributions, not fake point guarantees.

---

## 3.11 Revenue Architect
**Combined:**
- Revenue Architect
- Revenue Opportunity Map

**Reason:** Both owned creator-specific monetization opportunity discovery and planning.

The merged tool combines:

- creator capabilities;
- audience value;
- content/assets;
- revenue models;
- opportunity matching;
- unit economics;
- scenario modeling;
- revenue plans.

**Boundary:** Revenue Architect answers **“How can this creator turn audience, assets, content, and capabilities into revenue?”**

---

## 3.12 Channel Flywheel
**Retained as a distinct canonical tool, but narrowed.**

Channel Flywheel diagnoses where the channel's growth system is weakest.

Canonical system:

**Discovery → Click → Watch → Satisfaction → Return → Relationship → Community → Conversion → Revenue → Reinvestment → Creation**

It identifies the bottleneck. Causal Intelligence investigates why the bottleneck exists; Creator Strategy Engine decides what to do about it.

**Boundary:** Channel Flywheel answers **“Where is the creator's growth system weakest?”**

---

## 3.13 Creator Strategy Engine
**Combined:**
- Creator Strategy Engine
- Creator Command Brain

**Reason:** Both owned cross-tool prioritization and strategic decision-making.

The merged engine consumes validated intelligence from the Studio Hub and produces a prioritized next best move.

**Boundary:** Creator Strategy Engine answers **“What should the creator do next?”**

It is the **only Studio Hub tool authorized to synthesize recommendations across all other Studio Hub engines**.

It must not become a generic chatbot.

---

# 4. Core Product Principles

## 4.1 Every tool owns a measurable state transition

Every tool must answer:

> What measurable state does this tool move the creator from, and what measurable state does it move them to?

## 4.2 One primary transformation

A tool may span multiple workflow stages, but it owns exactly one primary transformation.

Secondary functions exist only to complete that transformation.

If removing a tool does not remove unique capability, merge or reject it.

## 4.3 Direct creation is preferred

Where practical, tools should create the useful output directly:

- opportunity;
- concept brief;
- structured content analysis;
- StoryGraph;
- asset package;
- audience action;
- derivative-content package;
- experiment;
- causal analysis;
- scenario;
- revenue plan;
- prioritized action.

## 4.4 Evidence before durable knowledge

The system distinguishes:

- observations;
- signals;
- hypotheses;
- predictions;
- findings;
- validated findings;
- rejected findings;
- expired intelligence.

Only appropriately validated findings become durable AI Brain knowledge.

## 4.5 Predictions must expose uncertainty

Predictive outputs must show:

- evidence;
- confidence;
- uncertainty;
- assumptions;
- time horizon;
- reasoning/model basis;
- alternative explanations where applicable.

## 4.6 Closed-loop learning

The Studio Hub participates in:

**Plan → Create → Publish → Measure → Explain → Learn → Improve → Plan**

Actual creator results should feed future tool decisions.

## 4.7 Projects are the execution layer

Studio Hub intelligence becomes execution through Projects containing, where applicable:

- objective;
- brief;
- evidence;
- hypothesis;
- deliverables;
- tasks;
- assets;
- milestones;
- experiments;
- publishing context;
- outcome measurements.

## 4.8 Asset Engine/Vault is the reusable production layer

Studio Hub tools request, create, resolve, validate, and reference assets through the Asset Engine/Vault rather than duplicating asset storage.

## 4.9 Creator Strategy Engine is the decision layer

Only Creator Strategy Engine synthesizes cross-tool intelligence into a prioritized strategic recommendation.

---

# 5. Shared Studio Intelligence Contract

All 13 tools should use a common handoff envelope.

~~~text
StudioIntelligenceEnvelope {
  sourceTool
  sourceVersion
  creatorId
  projectId?
  timestamp
  inputReferences[]
  evidence[]
  observation?
  interpretation?
  hypothesis?
  outputType
  outputPayload
  confidence
  uncertainty
  recommendedActions[]
  brainCandidate?
  validationState
  relatedAssets[]
  relatedProjects[]
}
~~~

Every meaningful intelligence result retains:

- source tool;
- source version;
- timestamp;
- input references;
- evidence;
- confidence;
- uncertainty;
- validation state;
- related projects;
- related assets.

Recommended validation states:

- \`OBSERVATION\`
- \`SIGNAL\`
- \`HYPOTHESIS\`
- \`PREDICTION\`
- \`FINDING\`
- \`VALIDATED\`
- \`REJECTED\`
- \`EXPIRED\`

---

# 6. Shared Object Contracts

## 6.1 Opportunity

~~~text
Opportunity {
  id
  title
  sourceSignals[]
  audience
  problemOrDemand
  evidence[]
  potentialValue
  strategicFit
  effort
  freshness
  expiration
  confidence
  recommendedAction
  relatedContent[]
  relatedProjects[]
  relatedAssets[]
}
~~~

## 6.2 Content Concept

~~~text
ContentConcept {
  id
  opportunityId?
  premise
  audience
  problemOrDesire
  promise
  format
  hook
  differentiation
  evidence[]
  expectedOutcome
  effort
  confidence
}
~~~

## 6.3 StoryGraph

~~~text
StoryGraph {
  conceptId
  runtime
  hook
  beats[]
  escalation
  retentionHypotheses[]
  visualMapping[]
  audioMapping[]
  payoff
  cta
  productionBlueprint
}
~~~

## 6.4 Evidence

~~~text
Evidence {
  id
  source
  timestamp
  observation
  metric?
  reference
  quality
  relevance
}
~~~

## 6.5 KnowledgeCandidate

~~~text
KnowledgeCandidate {
  statement
  evidence[]
  validationState
  confidence
  scope
  creatorSpecificity
  expiration?
  provenance[]
}
~~~

---

# 7. Standard Tool Specification

Every canonical tool must document all of the following sections.

1. Identity
2. Primary Transformation
3. Definitive Purpose
4. Unique Reason for Existence
5. Core Question
6. Inputs
7. Data Model
8. Backend Architecture
9. Scoring / Decision Logic
10. Workflow
11. Outputs
12. Evidence Model
13. Validation Model
14. AI Brain Relationship
15. Projects Relationship
16. Asset Engine Relationship
17. Editor Relationship
18. Analytics Relationship
19. Downstream Handoffs
20. User-Facing Toolbox
21. SubToolboxes
22. Controls
23. Workspace
24. Primary Action
25. Secondary Actions
26. UI States
27. Success Metric
28. Non-Goals / Ownership Boundary

This standard is mandatory for all future Studio Hub tool specifications.

---

# 8. Canonical Tool Specifications

## Tool 01 — Opportunity Radar

### Identity
- **ID:** \`opportunity-radar\`
- **Category:** Discovery / Intelligence
- **Status:** Canonical

### Primary Transformation
**Signals → Opportunities**

### Definitive Purpose
Discover high-value opportunities before they become obvious through ordinary analytics.

### Unique Reason for Existence
Ordinary analytics explains what has happened. Opportunity Radar identifies what is becoming possible next.

### Core Question
**What is becoming worth pursuing?**

### Inputs
- channel data;
- search/trend signals;
- comments and audience language;
- public competitive signals where available;
- content history;
- creator goals;
- AI Brain context;
- time horizon.

### Data Model
Signal → Pattern → Opportunity → Evidence → Confidence → Expiration → Recommended Action.

### Backend Architecture
**Signal Collector → Signal Normalizer → Pattern Detector → Opportunity Scorer → Opportunity Graph → Opportunity Cards**

### Scoring / Decision Logic
Score using configurable weights for:
- potential value;
- strategic fit;
- freshness;
- audience demand;
- effort;
- confidence;
- time sensitivity.

### Workflow
1. Scan signals.
2. Normalize evidence.
3. detect patterns.
4. Score opportunities.
5. Rank and explain.
6. Save/watch.
7. Send to Content Architect or create Project.

### Outputs
Opportunity cards, watchlist entries, evidence-backed opportunity records, project-ready briefs.

### Evidence Model
Every opportunity must expose its underlying signals and source references.

### Validation Model
Signals remain evidence. Repeated, sufficiently supported patterns can become findings and later validated Brain knowledge.

### AI Brain Relationship
Reads creator context and validated historical patterns. Proposes Brain candidates only when evidence supports them.

### Projects Relationship
Creates prefilled projects containing objective, audience, evidence, hypothesis, deliverable, and suggested next step.

### Asset Engine Relationship
Requests relevant references and reusable assets.

### Editor Relationship
Indirect; supplies opportunity context to production workflows.

### Analytics Relationship
Consumes synced analytics and trend evidence.

### Downstream Handoffs
Content Architect, Project, Audience Pulse, Revenue Architect, Creator Strategy Engine.

### User-Facing Toolbox
**SubToolboxes:** Discover, Signal Sources, Filters & Focus, Scoring, Opportunity Types, Watchlist, Saved Opportunities, Actions.

### Controls
Scan Now, source toggles, topic filters, time horizon, threshold, confidence threshold, weighting, Save, Watch, Create Project, Send to Content Architect.

### Workspace
Ranked opportunity workspace with evidence drawer, opportunity detail, comparison, watchlist, and action rail.

### Primary Action
**Promote Opportunity**

### Secondary Actions
Save, Watch, Compare, View Evidence, Create Project, Send to Content Architect.

### UI States
Empty, scanning, active, success, warning, insufficient evidence, expired, error.

### Success Metric
A creator acts on a high-value opportunity with measurable downstream impact.

### Non-Goals
Does not own final concept development or cross-tool strategy.

---

## Tool 02 — Content Architect

### Identity
- **ID:** \`content-architect\`
- **Category:** Content Planning
- **Status:** Canonical

### Primary Transformation
**Opportunity → Content Concept**

### Definitive Purpose
Determine what content is worth producing from an identified opportunity.

### Unique Reason for Existence
Bridges opportunity discovery and story design.

### Core Question
**What should we make about this?**

### Inputs
Opportunity, audience knowledge, positioning, creator strengths, content history, Brain knowledge, assets, format constraints, Video Genome patterns.

### Data Model
Content Concept with premise, audience, problem/desire, promise, novelty, differentiation, evidence, format, hook, expected outcome, effort, confidence.

### Backend Architecture
**Opportunity → Audience Model → Concept Generator → Concept Evaluator → Competitive Gap → Concept Brief**

### Scoring / Decision Logic
Evaluate audience fit, creator fit, differentiation, expected value, evidence, effort, format fit, and novelty.

### Workflow
1. Select opportunity.
2. Model audience.
3. Generate concepts.
4. compare concepts.
5. Evaluate evidence and competitive gap.
6. Promote one.
7. Send to Story Engine or Project.

### Outputs
Concept briefs, concept comparisons, production recommendations.

### Evidence Model
Every promoted concept retains its originating opportunity and evidence.

### Validation Model
Concepts remain proposals until production outcomes validate their assumptions.

### AI Brain Relationship
Uses creator strengths, audience preferences, historical successes/failures, and positioning.

### Projects Relationship
Creates a project-ready concept brief.

### Asset Engine Relationship
Can request references and existing assets.

### Editor Relationship
Indirect; sends chosen concept toward narrative and production.

### Analytics Relationship
Uses historical performance as evidence.

### Downstream Handoffs
Video Genome, Story Engine, Project, Asset Forge, Creator Strategy Engine.

### User-Facing Toolbox
Opportunity Input, Audience, Format, Evaluation, Competitive Gap, Concept Comparison, Actions.

### Controls
Opportunity selector, audience selector, format selector, novelty, effort, value weighting, Generate, Compare, Promote, Send to Story Engine, Create Project.

### Workspace
Concept comparison workspace with evidence, scoring, competitive gap, and promotion rail.

### Primary Action
**Promote Concept**

### Secondary Actions
Compare, Inspect Evidence, Save, Create Project, Send to Story Engine.

### UI States
Empty, generating, active, success, warning, insufficient evidence, error.

### Success Metric
A differentiated concept is justified strongly enough to enter narrative/production.

### Non-Goals
Does not own opportunity discovery or narrative architecture.

---

## Tool 03 — Video Genome

### Identity
- **ID:** \`video-genome\`
- **Category:** Content Intelligence
- **Status:** Canonical

### Primary Transformation
**Existing Content → Structured Content Patterns**

### Definitive Purpose
Decompose existing and published content into comparable structural, creative, audience, and performance features.

### Unique Reason for Existence
Creates a reusable machine-readable representation of what the creator has already made and what patterns exist inside it.

### Core Question
**What patterns exist in our content, and which ones are repeatable?**

### Inputs
Published videos, drafts, transcripts, titles, thumbnails, chapters, hooks, pacing, comments, retention, engagement, outcomes.

### Data Model
Video → Segments → Features → Patterns → Performance Relationships.

### Backend Architecture
**Content Ingestion → Segmentation → Semantic Extraction → Structural Analysis → Performance Alignment → Pattern Graph**

### Feature Set
Topic, premise, audience, title, thumbnail, hook, narrative structure, pacing, information density, emotion, pattern interrupts, payoff, CTA, comments, retention, performance.

### Scoring / Decision Logic
Detect repeated patterns and correlate features with observed outcomes while preserving uncertainty and avoiding automatic causal claims.

### Workflow
1. Ingest content.
2. Decompose.
3. Extract features.
4. Align with performance.
5. Detect patterns.
6. Compare content.
7. Send patterns to downstream tools.

### Outputs
Video profiles, pattern cards, comparisons, reusable content structures, evidence references.

### Evidence Model
Every pattern points back to specific source content and observed measurements.

### Validation Model
Pattern ≠ causation. Repeated patterns become stronger evidence only after repeated validation.

### AI Brain Relationship
Provides historical creator-specific patterns and can propose validated patterns as Brain knowledge.

### Projects Relationship
Can provide references and templates to new projects.

### Asset Engine Relationship
Can identify reusable visual/asset patterns.

### Editor Relationship
Can provide structural references and pattern templates.

### Analytics Relationship
Aligns content features with performance data.

### Downstream Handoffs
Content Architect, Story Engine, Content Autopilot, Experiment Lab, Causal Intelligence, Creator Strategy Engine.

### User-Facing Toolbox
Content Library, Genome Scan, Feature Map, Pattern Explorer, Comparisons, Evidence, Reuse.

### Controls
Select Content, Analyze, Compare, Filter, Feature toggles, Pattern threshold, Save Pattern, Send to Content Architect, Send to Story Engine.

### Workspace
Content profile plus feature timeline, pattern cards, evidence, and comparison views.

### Primary Action
**Analyze Content**

### Secondary Actions
Compare, Save Pattern, Reuse Pattern, View Evidence, Send to Story Engine.

### UI States
Empty, ingesting, analyzing, active, partial analysis, insufficient data, success, error.

### Success Metric
Expose repeatable and inspectable content patterns that improve future decisions.

### Non-Goals
Does not decide the creator's next strategic move.

---

## Tool 04 — Story Engine

### Identity
- **ID:** \`story-engine\`
- **Category:** Narrative / Retention
- **Status:** Canonical

### Primary Transformation
**Concept → Executable Narrative**

### Definitive Purpose
Turn a concept into a production-ready narrative architecture optimized for understanding, engagement, retention, and payoff.

### Unique Reason for Existence
Decides how the viewer experience unfolds after Content Architect decides what should be made.

### Core Question
**How should this content unfold?**

### Inputs
Concept, audience, format, runtime, creator style, Brain knowledge, Video Genome patterns, assets, desired outcome.

### Data Model
StoryGraph, Beat, Hook, Retention Hypothesis, Visual Beat, Audio Beat, CTA, Production Requirement.

### Backend Architecture
**Concept → Narrative Model → Beat Graph → Retention Model → Visual/Audio Mapping → Production Blueprint**

### Scoring / Decision Logic
Evaluate hook strength, beat progression, payoff timing, retention risk, clarity, escalation, and CTA placement.

### Workflow
1. Import concept.
2. Choose narrative form.
3. Generate StoryGraph.
4. Review beats.
5. map retention risks.
6. map visual/audio needs.
7. generate production blueprint.
8. send to Asset Forge/Project/Editor.

### Outputs
StoryGraph, beat plan, retention map, production blueprint.

### Evidence Model
References Video Genome patterns and Brain findings when used.

### Validation Model
Retention predictions remain hypotheses until measured.

### AI Brain Relationship
Learns validated hook, pacing, reveal, and CTA patterns.

### Projects Relationship
Moves project into storyboard/production state.

### Asset Engine Relationship
Maps every beat to asset requirements.

### Editor Relationship
Sends executable narrative structure and beat mappings.

### Analytics Relationship
Receives historical retention patterns.

### Downstream Handoffs
Asset Forge, Project, Editor, Experiment Lab.

### User-Facing Toolbox
Narrative Type, Runtime, Hook, Beat Structure, Retention, Visual Mapping, Audio Mapping, CTA, Story Actions.

### Controls
Narrative type, runtime, retention target, beat density, hook style, Generate StoryGraph, Add Beat, Reorder Beat, Generate Asset Requirement, Send to Asset Forge.

### Workspace
Interactive StoryGraph/beat workspace with retention overlays and production mappings.

### Primary Action
**Build StoryGraph**

### Secondary Actions
Edit Beat, Reorder, Compare Structure, Generate Asset Requirement, Send to Asset Forge, Send to Project.

### UI States
Empty, generating, active, warning, retention-risk, success, insufficient evidence, error.

### Success Metric
A creator/editor can execute the narrative without another strategic interpretation layer.

### Non-Goals
Does not own concept discovery or asset storage.

---

## Tool 05 — Asset Forge

### Identity
- **ID:** \`asset-forge\`
- **Category:** Production Assets
- **Status:** Canonical

### Primary Transformation
**Production Blueprint → Production-Ready Asset Package**

### Definitive Purpose
Resolve production requirements into organized, reusable assets.

### Unique Reason for Existence
Bridges intelligence-driven production requirements and the Asset Engine/Vault.

### Core Question
**What assets does this production require, and how do we make/resolve them?**

### Inputs
StoryGraph, production blueprint, asset requirements, style, Vault assets, references, generation parameters.

### Data Model
Asset → Project → Story → Beat → Purpose → Source → Version.

### Backend Architecture
**Blueprint → Requirements Graph → Asset Resolver → Generation Pipeline → Validation → Asset Package**

### Scoring / Decision Logic
Prioritize existing reusable assets, creator style fit, quality, purpose match, provenance, and production cost.

### Workflow
1. Read requirements.
2. Resolve existing assets.
3. Identify missing assets.
4. Generate/acquire candidates.
5. Validate.
6. package.
7. attach to Project/Editor/Vault.

### Outputs
Asset packages, manifests, references, generated assets, thumbnail candidates, overlays, graphics, media.

### Evidence Model
Asset provenance and purpose must remain attached.

### Validation Model
Validate quality, format, rights/provenance where applicable, purpose, and relationship to story beat.

### AI Brain Relationship
Learns validated creator visual conventions and successful reusable asset patterns.

### Projects Relationship
Attaches asset packages to project tasks and deliverables.

### Asset Engine Relationship
Primary integration.

### Editor Relationship
Supplies production-ready mapped assets.

### Analytics Relationship
Can receive performance feedback on asset variants.

### Downstream Handoffs
Editor, Project, Vault, Experiment Lab, Content Autopilot.

### User-Facing Toolbox
Asset Requirements, Asset Types, Style, Sources, Generation, Quantity, Validation, Package.

### Controls
Asset type, style, source priority, quantity, generation parameters, Generate, Regenerate, Validate, Send to Project, Send to Editor, Save to Vault.

### Workspace
Requirement-to-asset mapping workspace with previews, validation, provenance, and package status.

### Primary Action
**Build Asset Package**

### Secondary Actions
Resolve Existing, Generate, Regenerate, Validate, Compare, Send to Editor, Save.

### UI States
Empty, resolving, generating, validating, partial, success, blocked, error.

### Success Metric
All required production assets are available, valid, organized, and mapped to purpose.

### Non-Goals
Does not replace Vault storage or the Editor.

---

## Tool 06 — Audience Pulse

### Identity
- **ID:** \`audience-pulse\`
- **Category:** Audience / Relationship Intelligence
- **Status:** Canonical

### Primary Transformation
**Audience Behavior → Relationship Opportunity**

### Definitive Purpose
Identify who needs attention, what they need, why they matter, and what action should happen next.

### Unique Reason for Existence
Turns audience behavior into actionable relationship intelligence rather than another analytics report.

### Core Question
**Who needs attention, what do they need, and what should we do next?**

### Inputs
Comments, questions, requests, community activity, engagement, viewer history, affinity, segments, sentiment/intent signals, Brain context.

### Data Model
Audience Event → Signal → Intent → Relationship State → Opportunity → Action.

### Backend Architecture
**Audience Events → Semantic Clustering → Relationship Modeling → Intent Detection → Opportunity Ranking → Communication Actions**

### Scoring / Decision Logic
Rank by intent, relevance, relationship strength, urgency, strategic value, and actionability.

### Workflow
1. Collect audience signals.
2. Cluster.
3. detect intent.
4. classify relationship.
5. rank opportunities.
6. choose action.
7. respond/create content/create community action.

### Outputs
Questions, requests, relationship signals, response opportunities, content requests, collaboration opportunities, community actions.

### Evidence Model
Every opportunity links to underlying audience evidence.

### Validation Model
Audience signals are observations until repeated/supporting evidence establishes a stronger finding.

### AI Brain Relationship
Builds validated audience knowledge while retaining source provenance.

### Projects Relationship
Audience opportunities can become content, community, response, or experiment projects.

### Asset Engine Relationship
Requests audience-specific graphics/explainers/resources.

### Editor Relationship
Can create content requests.

### Analytics Relationship
Combines audience behavior with performance data.

### Downstream Handoffs
Content Architect, Content Autopilot, Project, Experiment Lab, Creator Strategy Engine.

### User-Facing Toolbox
Audience, Questions, Requests, Fans, Problems, Opportunities, Communication Actions.

### Controls
Segment, signal type, relationship threshold, time window, intent filter, Generate Opportunities, Draft Responses, Create Content, Create Community Post, Track Relationship.

### Workspace
Audience opportunity queue with relationship context, evidence, recommended actions, and communication tools.

### Primary Action
**Act on Audience Opportunity**

### Secondary Actions
Respond, Create Content, Create Community Post, Save, Track Relationship, Create Project.

### UI States
Empty, syncing, active, high-priority alert, insufficient evidence, success, error.

### Success Metric
Convert audience behavior into a measurable relationship or content action.

### Non-Goals
Does not own general channel strategy.

---

## Tool 07 — Content Autopilot

### Identity
- **ID:** \`content-autopilot\`
- **Category:** Content Reuse / Expansion
- **Status:** Canonical

### Primary Transformation
**Published Content → Derivative and Follow-Up Opportunities**

### Definitive Purpose
Extract additional strategic and production value from existing content.

### Unique Reason for Existence
Prevents valuable published work from being treated as finished when it can generate additional outputs.

### Core Question
**What additional value can this existing content produce?**

### Inputs
Published content, Video Genome, analytics, Audience Pulse, Brain, opportunities, assets.

### Data Model
Source Content → Extracted Element → Derivative Opportunity → Output Package → Performance.

### Backend Architecture
**Content Selection → Genome Analysis → Value Extraction → Derivative Generator → Opportunity Ranking → Output Package**

### Scoring / Decision Logic
Prioritize by source performance, audience demand, novelty, effort, shelf life, and expected downstream value.

### Workflow
1. Select source content.
2. Analyze genome.
3. identify reusable elements.
4. Generate derivatives.
5. rank opportunities.
6. create output packages.
7. send to Project/Editor/Experiment Lab.

### Outputs
Shorts, social posts, follow-ups, FAQ resources, newsletters, series extensions, audience resources, experiments, revenue opportunities.

### Evidence Model
Every derivative references source content and the extracted evidence.

### Validation Model
Predicted derivative performance remains a hypothesis until measured.

### AI Brain Relationship
Uses validated content patterns and feeds validated reuse learnings back.

### Projects Relationship
Creates derivative projects and follow-up work.

### Asset Engine Relationship
Reuses or requests required production assets.

### Editor Relationship
Primary production handoff.

### Analytics Relationship
Uses source performance and tracks derivative outcomes.

### Downstream Handoffs
Project, Editor, Asset Forge, Experiment Lab, Revenue Architect.

### User-Facing Toolbox
Source Content, Extraction, Derivatives, Follow-Ups, Opportunities, Packages.

### Controls
Choose Source, Analyze, Generate Derivatives, Rank, Select Output, Package, Send to Editor, Create Project.

### Workspace
Source-content workspace showing extracted elements and ranked derivative opportunities.

### Primary Action
**Generate More Value**

### Secondary Actions
Preview, Compare, Package, Create Project, Send to Editor, Run Experiment.

### UI States
Empty, analyzing, generating, active, partial, success, error.

### Success Metric
Produce measurable additional value from existing content at lower marginal effort.

### Non-Goals
Does not replace Story Engine for entirely new narrative architecture.

---

## Tool 08 — Experiment Lab

### Identity
- **ID:** \`experiment-lab\`
- **Category:** Learning / Validation
- **Status:** Canonical

### Primary Transformation
**Hypothesis → Measurable Learning**

### Definitive Purpose
Convert uncertainty into creator-specific evidence through controlled experiments.

### Unique Reason for Existence
Recommendations become reliable only when the system can test them.

### Core Question
**What should we test to learn?**

### Inputs
Hypothesis, baseline, variable, control, variants, metric, duration, content/assets, channel context.

### Data Model
Experiment with hypothesis, variable, baseline, control, variants, metric, duration, sample, confidence, conclusion, evidence.

### Backend Architecture
**Hypothesis → Experiment Design → Variant Creation → Execution → Measurement → Statistical Evaluation → Learning**

### Scoring / Decision Logic
Evaluate sample quality, comparability, effect size, confidence, confounders, and repeatability.

### Workflow
1. Define hypothesis.
2. Select variable.
3. Establish baseline/control.
4. Create variants.
5. Execute.
6. Measure.
7. evaluate.
8. conclude.
9. validate learning.

### Outputs
Experiment designs, variants, results, conclusions, validated learning.

### Evidence Model
All conclusions retain test conditions and raw measurements.

### Validation Model
A conclusion must meet configured evidence thresholds before becoming durable Brain knowledge.

### AI Brain Relationship
Validated experiments are high-value Brain inputs.

### Projects Relationship
Experiments can attach to or create Projects.

### Asset Engine Relationship
Can create experiment-specific asset variants.

### Editor Relationship
Can provide controlled content variants.

### Analytics Relationship
Consumes measurement data.

### Downstream Handoffs
AI Brain, Causal Intelligence, Content Architect, Story Engine, Creator Strategy Engine.

### User-Facing Toolbox
Hypothesis, Variable, Control, Variants, Measurement, Duration, Analysis, Learning.

### Controls
Hypothesis, variable, control, variant creator, metric, duration, confidence target, Run, Measure, Evaluate, Validate Learning.

### Workspace
Experiment board with design, execution status, measurement, statistical result, and learning panel.

### Primary Action
**Run Experiment**

### Secondary Actions
Design Variant, Compare, Pause, Evaluate, Validate, Save Learning.

### UI States
Draft, ready, running, insufficient sample, evaluating, success, inconclusive, error.

### Success Metric
Turn a meaningful uncertainty into validated creator-specific learning.

### Non-Goals
Does not claim causation from a simple A/B result beyond what the evidence supports.

---

## Tool 09 — Causal Intelligence

### Identity
- **ID:** \`causal-intelligence\`
- **Category:** Explanation / Diagnosis
- **Status:** Canonical

### Primary Transformation
**Observed Results → Probable Explanations**

### Definitive Purpose
Investigate why observed changes probably happened.

### Unique Reason for Existence
Separates explanation from correlation and from strategic recommendation.

### Core Question
**Why did this result probably happen?**

### Inputs
Analytics, experiments, Video Genome features, audience signals, channel state, Brain knowledge, Channel Flywheel bottlenecks.

### Data Model
Event → Baseline → Variables → Relationships → Causal Hypothesis → Evidence Ranking → Confidence.

### Backend Architecture
**Events → Baseline Builder → Variable Graph → Change Detection → Counterfactual Modeling → Causal Hypotheses → Evidence Ranking**

### Scoring / Decision Logic
Rank explanations by evidence, temporal fit, counterfactual plausibility, confounding risk, consistency, and alternative explanations.

### Workflow
1. Define outcome.
2. establish baseline.
3. identify changed variables.
4. model relationships.
5. generate hypotheses.
6. compare evidence.
7. rank explanations.
8. expose uncertainty.

### Outputs
Causal hypotheses, evidence graphs, alternative explanations, confidence assessments.

### Evidence Model
Must show source measurements and distinguish observed facts from interpretation.

### Validation Model
Causal claims require stronger evidence than correlation.

### AI Brain Relationship
Validated causal findings can become durable knowledge with provenance and scope.

### Projects Relationship
Can create diagnostic projects or inform existing ones.

### Asset Engine Relationship
Indirect.

### Editor Relationship
Can inform content diagnosis and future production.

### Analytics Relationship
Primary evidence source.

### Downstream Handoffs
Experiment Lab, Channel Simulator, Creator Strategy Engine, Content Architect.

### User-Facing Toolbox
Outcome, Baseline, Variables, Evidence Graph, Hypotheses, Alternatives, Confidence.

### Controls
Select Outcome, Baseline Window, Variables, Run Analysis, Compare Hypotheses, View Evidence, Create Experiment.

### Workspace
Evidence graph with ranked causal hypotheses and alternative explanations.

### Primary Action
**Explain Result**

### Secondary Actions
Compare, Inspect Evidence, Create Experiment, Send to Strategy.

### UI States
Insufficient evidence, analyzing, active, high uncertainty, success, error.

### Success Metric
Provide a better-supported explanation without overstating causality.

### Non-Goals
Does not own final strategic prioritization.

---

## Tool 10 — Channel Simulator

### Identity
- **ID:** \`channel-simulator\`
- **Category:** Prediction / Scenario Modeling
- **Status:** Canonical

### Primary Transformation
**Current Channel State → Future Scenarios**

### Definitive Purpose
Model plausible outcomes of alternative creator decisions.

### Unique Reason for Existence
Allows the creator to compare possible paths before committing.

### Core Question
**What might happen if we choose this path?**

### Inputs
Channel state, historical model, Brain knowledge, scenario variables, experiments, audience state, revenue state.

### Data Model
Scenario → Variables → Assumptions → Distribution → Outcome Range → Confidence.

### Backend Architecture
**Channel State → Historical Model → Brain Knowledge → Scenario Variables → Simulation → Probability Distribution → Scenario Comparison**

### Scoring / Decision Logic
Use historical evidence and explicit assumptions. Output ranges/distributions, not false precision.

### Workflow
1. Define current state.
2. choose scenario variables.
3. run simulations.
4. compare distributions.
5. inspect assumptions.
6. save scenario.
7. send to Strategy.

### Outputs
Scenario ranges, probability distributions, assumptions, comparison views.

### Evidence Model
Every prediction identifies its evidence basis.

### Validation Model
Predictions remain predictions until measured.

### AI Brain Relationship
Consumes validated historical knowledge. Does not automatically write predictions as knowledge.

### Projects Relationship
Can inform project selection and planning.

### Asset Engine Relationship
Can estimate scenario impact of asset choices.

### Editor Relationship
Indirect.

### Analytics Relationship
Consumes historical and current channel data.

### Downstream Handoffs
Creator Strategy Engine, Revenue Architect, Experiment Lab.

### User-Facing Toolbox
Current State, Variables, Scenarios, Assumptions, Simulation, Comparison.

### Controls
Select State, Variable, Scenario, Time Horizon, Run Simulation, Compare, Save Scenario.

### Workspace
Scenario comparison workspace with distributions, assumptions, evidence, and sensitivity.

### Primary Action
**Simulate Scenario**

### Secondary Actions
Compare, Inspect Assumptions, Save, Create Experiment, Send to Strategy.

### UI States
Insufficient data, simulating, active, high uncertainty, success, error.

### Success Metric
Improve decision quality by exposing plausible consequences before action.

### Non-Goals
Does not claim guaranteed future outcomes.

---

## Tool 11 — Revenue Architect

### Identity
- **ID:** \`revenue-architect\`
- **Category:** Monetization
- **Status:** Canonical

### Primary Transformation
**Creator/Audience/Asset Intelligence → Monetization Opportunities**

### Definitive Purpose
Identify, evaluate, and plan creator-specific revenue opportunities.

### Unique Reason for Existence
Transforms the creator's actual capabilities, audience, assets, and channel intelligence into economically grounded monetization paths.

### Core Question
**How can this creator turn existing value into revenue?**

### Inputs
Creator capabilities, audience value, content, assets, channel intelligence, revenue models, goals, constraints.

### Data Model
Capability → Audience Value → Asset → Revenue Model → Opportunity → Unit Economics → Plan.

### Backend Architecture
**Capability Graph + Audience Value Graph + Asset Graph + Revenue Models → Opportunity Matching → Unit Economics → Scenario Modeling → Revenue Plan**

### Scoring / Decision Logic
Evaluate fit, audience demand, margin, effort, risk, scalability, time-to-revenue, and strategic alignment.

### Workflow
1. Map capabilities.
2. map audience value.
3. identify assets.
4. match revenue models.
5. model economics.
6. compare opportunities.
7. create revenue plan.

### Outputs
Revenue opportunities, economics, scenarios, plans, dependencies.

### Evidence Model
Opportunity recommendations retain audience, content, and financial evidence.

### Validation Model
Revenue assumptions remain hypotheses until actual results validate them.

### AI Brain Relationship
Learns validated monetization patterns.

### Projects Relationship
Creates monetization projects and milestones.

### Asset Engine Relationship
Identifies required product/content assets.

### Editor Relationship
Can generate content required for monetization paths.

### Analytics Relationship
Uses audience and channel performance.

### Downstream Handoffs
Creator Strategy Engine, Projects, Content Architect, Content Autopilot.

### User-Facing Toolbox
Capabilities, Audience Value, Offers, Revenue Models, Economics, Scenarios, Plan.

### Controls
Revenue Model, Audience Segment, Price, Cost, Effort, Scenario, Compare, Build Plan.

### Workspace
Revenue opportunity matrix with unit economics and scenario comparison.

### Primary Action
**Build Revenue Plan**

### Secondary Actions
Compare, Simulate, Inspect Economics, Create Project, Send to Strategy.

### UI States
Empty, modeling, active, insufficient evidence, warning, success, error.

### Success Metric
Produce a realistic, evidence-supported monetization plan with measurable economics.

### Non-Goals
Does not own general creator strategy.

---

## Tool 12 — Channel Flywheel

### Identity
- **ID:** \`channel-flywheel\`
- **Category:** Growth Diagnosis
- **Status:** Canonical

### Primary Transformation
**Channel System → Growth Bottleneck**

### Definitive Purpose
Identify the weakest stage in the creator's growth system.

### Unique Reason for Existence
Provides a system-level bottleneck diagnosis without becoming another strategy engine.

### Core Question
**Where is the creator's growth system weakest?**

### Model
**Discovery → Click → Watch → Satisfaction → Return → Relationship → Community → Conversion → Revenue → Reinvestment → Creation**

### Inputs
Channel analytics, audience behavior, content performance, revenue data, Video Genome, Audience Pulse, Causal Intelligence.

### Data Model
Flywheel Stage → Health → Bottleneck → Evidence → Impact → Investigation Need.

### Backend Architecture
**Stage Metrics → Normalization → Bottleneck Detection → Impact Ranking → Diagnostic Handoff**

### Scoring / Decision Logic
Compare stage health against channel-specific baselines and identify the stage with the greatest constraint on downstream flow.

### Workflow
1. Calculate stage health.
2. map dependencies.
3. detect bottleneck.
4. rank impact.
5. send bottleneck to Causal Intelligence.
6. send resulting diagnosis to Strategy.

### Outputs
Flywheel health map, bottleneck, evidence, diagnostic priority.

### Evidence Model
Each bottleneck must be backed by stage-specific measurements.

### Validation Model
Bottleneck is a diagnosis, not a causal conclusion.

### AI Brain Relationship
Uses validated channel patterns and can record validated recurring bottlenecks.

### Projects Relationship
Can create a growth-improvement project.

### Asset Engine Relationship
Indirect.

### Editor Relationship
Can indicate where production needs to improve.

### Analytics Relationship
Primary evidence source.

### Downstream Handoffs
Causal Intelligence, Experiment Lab, Creator Strategy Engine.

### User-Facing Toolbox
Flywheel, Stage Health, Bottleneck, Evidence, History, Actions.

### Controls
Time Window, Stage Filters, Compare Period, Diagnose Bottleneck, View Evidence, Send to Causal Intelligence.

### Workspace
Full flywheel visualization with stage health and bottleneck detail.

### Primary Action
**Diagnose Bottleneck**

### Secondary Actions
Compare Periods, View Evidence, Send to Causal Intelligence, Create Project.

### UI States
Insufficient data, calculating, active, bottleneck found, balanced, warning, error.

### Success Metric
Identify the growth constraint most worth investigating.

### Non-Goals
Does not explain causality or choose the final strategic action.

---

## Tool 13 — Creator Strategy Engine

### Identity
- **ID:** \`creator-strategy-engine\`
- **Category:** Cross-Tool Decision
- **Status:** Canonical

### Primary Transformation
**Validated Intelligence → Next Best Move**

### Definitive Purpose
Synthesize validated intelligence and creator constraints into a prioritized action.

### Unique Reason for Existence
This is the only Studio Hub tool that owns cross-tool strategic prioritization.

### Core Question
**What should the creator do next?**

### Inputs
Validated Brain knowledge, opportunities, concepts, audience intelligence, experiments, causal findings, simulations, revenue opportunities, flywheel bottlenecks, creator goals, constraints, current projects.

### Data Model
Evidence Graph → Knowledge Graph → Goals → Constraints → Opportunities → Actions → Expected Value → Priority.

### Backend Architecture
**Evidence Graph → Knowledge Graph → Goal/Constraint Model → Opportunity/Action Matching → Expected Value → Priority Engine → Next Best Action**

### Scoring / Decision Logic
Rank actions by:
- expected impact;
- confidence;
- evidence quality;
- effort;
- urgency;
- strategic fit;
- dependencies;
- creator goals;
- current project load.

### Workflow
1. Gather validated intelligence.
2. understand current goals/constraints.
3. enumerate candidate actions.
4. estimate value/cost.
5. rank.
6. explain recommendation.
7. create/modify Project.
8. track outcome.

### Outputs
Next Best Action containing:
- action;
- reason;
- expected impact;
- confidence;
- evidence;
- effort;
- timing;
- dependencies;
- affected tools;
- suggested project.

### Evidence Model
Recommendations must show why they were selected and which evidence supports them.

### Validation Model
Strategy recommendations remain recommendations until outcomes are measured.

### AI Brain Relationship
Primary cross-tool consumer of validated Brain knowledge and a source of validated strategic learnings after outcomes.

### Projects Relationship
Can create, prioritize, or modify Projects.

### Asset Engine Relationship
Can request production resources when the selected action requires them.

### Editor Relationship
Can route selected actions into production.

### Analytics Relationship
Consumes current and historical measurements.

### Downstream Handoffs
Projects, Content Architect, Story Engine, Asset Forge, Audience Pulse, Experiment Lab, Revenue Architect, Channel Simulator, Causal Intelligence.

### User-Facing Toolbox
Context, Goals, Constraints, Intelligence, Opportunities, Actions, Priority, Plan.

### Controls
Goal selector, constraint selector, time horizon, effort ceiling, priority weighting, Generate Recommendations, Compare Actions, Accept Action, Create Project, Track Outcome.

### Workspace
Decision workspace showing current state, evidence, candidate actions, ranking, rationale, dependencies, and execution handoff.

### Primary Action
**Choose Next Best Move**

### Secondary Actions
Inspect Evidence, Compare Actions, Adjust Constraints, Create Project, Defer, Track Outcome.

### UI States
No intelligence, gathering context, analyzing, recommendation ready, insufficient evidence, conflicting evidence, success, error.

### Success Metric
Consistently help the creator choose a high-value next action that produces measurable downstream progress.

### Non-Goals
Does not replace specialist engines, generic chat, or raw analytics.

---

# 9. End-to-End Studio Hub Architecture

~~~text
                         ┌─────────────────┐
                         │  Video Genome   │
                         └────────┬────────┘
                                  │
Signals ──► Opportunity Radar ──► Content Architect
                                  │
                                  ▼
                            Story Engine
                                  │
                                  ▼
                             Asset Forge
                                  │
                                  ▼
                              Projects
                                  │
                                  ▼
                               Editor
                                  │
                                  ▼
                              Publish
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       Audience Pulse     Content Autopilot       Analytics
              │                   │                   │
              │                   │                   ▼
              │                   │           Causal Intelligence
              │                   │                   │
              │                   ▼                   ▼
              │              New Content        Experiment Lab
              │                   │                   │
              └───────────────────┴──────────┬────────┘
                                             ▼
                                         AI Brain
                                             │
                         ┌───────────────────┼─────────────────┐
                         ▼                   ▼                 ▼
                 Channel Simulator    Revenue Architect   Channel Flywheel
                         │                   │                 │
                         └───────────────────┼─────────────────┘
                                             ▼
                                  Creator Strategy Engine
                                             │
                                             ▼
                                      Next Best Move
                                             │
                                             ▼
                                      Next Project
~~~

---

# 10. Cross-Tool Ownership Rules

| Question | Owning tool |
|---|---|
| What is becoming worth pursuing? | Opportunity Radar |
| What should we make about it? | Content Architect |
| What patterns already exist in our content? | Video Genome |
| How should the content unfold? | Story Engine |
| What production assets are required? | Asset Forge |
| Who needs attention and what relationship action is needed? | Audience Pulse |
| What additional value can existing content produce? | Content Autopilot |
| What should we test to learn? | Experiment Lab |
| Why did this result probably happen? | Causal Intelligence |
| What might happen if we choose this path? | Channel Simulator |
| How can we turn value into revenue? | Revenue Architect |
| Where is the growth system weakest? | Channel Flywheel |
| What should we do next? | Creator Strategy Engine |

No tool should silently take ownership of another tool's primary question.

---

# 11. Studio Hub UI Architecture

The existing ViewTube UI Reference Library is the visual source of truth.

The Studio Hub must use the established ViewTube:

- primitives;
- components;
- tokens;
- style system;
- size system;
- widget patterns.

The **size system defines default layout sizes**. Components and primitives remain adaptable to other sizes.

When a tool needs a widget:

1. **Fix** an existing widget if the existing widget is wrong.
2. **Add a variant** when the same primitive needs a meaningful variation.
3. **Create a new widget** only when the requirement is genuinely new.

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

Every tool must present its actual user-facing workspace, not a configuration-only mockup.

Required UI capabilities:

- real controls;
- realistic data;
- primary action;
- supporting actions;
- evidence/context;
- result view;
- detail views;
- handoffs;
- empty/loading/active/success/warning/error states.

---

# 12. Implementation Order

Build and validate one canonical Toolbox at a time.

1. Opportunity Radar
2. Content Architect
3. Video Genome
4. Story Engine
5. Asset Forge
6. Audience Pulse
7. Content Autopilot
8. Experiment Lab
9. Causal Intelligence
10. Channel Simulator
11. Revenue Architect
12. Channel Flywheel
13. Creator Strategy Engine

For each tool:

1. lock ownership;
2. define data contract;
3. define backend transformation;
4. define UI module;
5. use existing primitives first;
6. build SubToolboxes;
7. implement real controls;
8. implement states;
9. implement evidence;
10. implement handoffs;
11. validate against the tool's success metric;
12. only then proceed to the next tool.

---

# 13. Integration Requirements

The 13 tools must share:

- creator identity;
- channel context;
- project references;
- asset references;
- evidence references;
- Brain context;
- analytics context;
- provenance;
- confidence;
- uncertainty;
- validation state.

A tool output should be usable as input by multiple downstream tools where logically appropriate.

The system should avoid duplicated data models and duplicated intelligence pipelines.

---

# 14. Validation and Governance

A Studio Hub tool is not complete merely because its UI exists.

A tool is complete when:

- its primary transformation is unambiguous;
- its ownership boundary is documented;
- its data model is defined;
- its evidence is inspectable;
- its uncertainty is explicit where applicable;
- its Brain relationship is defined;
- its Project relationship is defined;
- its Asset Engine relationship is defined;
- its downstream handoffs work;
- its UI uses the ViewTube component system;
- its success metric is measurable;
- its output can feed the closed learning loop.

For predictive tools, never promote a prediction to validated knowledge merely because the prediction was generated.

For causal tools, never label correlation as causation without adequate evidence.

For strategy recommendations, always retain the evidence and assumptions behind the recommendation.

---

# 15. Final Canonical List

### 01 — Opportunity Radar
**Signals → Opportunities**

### 02 — Content Architect
**Opportunities → Content Concepts**

### 03 — Video Genome
**Content → Structured Content Patterns**

### 04 — Story Engine
**Concepts → Executable Narratives**

### 05 — Asset Forge
**Production Blueprints → Production-Ready Asset Packages**

### 06 — Audience Pulse
**Audience Behavior → Relationship Opportunities**

### 07 — Content Autopilot
**Published Content → Derivative/Follow-Up Opportunities**

### 08 — Experiment Lab
**Hypotheses → Measurable Learning**

### 09 — Causal Intelligence
**Observed Results → Probable Explanations**

### 10 — Channel Simulator
**Current Channel State → Future Scenarios**

### 11 — Revenue Architect
**Creator/Audience/Asset Intelligence → Monetization Opportunities**

### 12 — Channel Flywheel
**Channel System → Growth Bottleneck**

### 13 — Creator Strategy Engine
**Validated Intelligence → Next Best Move**

---

# 16. Source-to-Canonical Lineage

| Source tool | Canonical destination | Decision |
|---|---|---|
| Opportunity Radar | Opportunity Radar | Combined with Content Opportunity Engine |
| Content Opportunity Engine | Opportunity Radar | Combined |
| Content Architect | Content Architect | Retained |
| Video Genome | Video Genome | Retained |
| Story Engine | Story Engine | Combined with Story & Retention Architect |
| Story & Retention Architect | Story Engine | Combined |
| Asset Forge | Asset Forge | Retained |
| Audience Pulse | Audience Pulse | Combined with Audience Signal Miner + Creator Relationship Engine |
| Audience Signal Miner | Audience Pulse | Combined |
| Creator Relationship Engine | Audience Pulse | Combined |
| Content Autopilot | Content Autopilot | Retained |
| Experiment Lab | Experiment Lab | Unified implementation |
| Causal Intelligence | Causal Intelligence | Retained |
| Channel Simulator | Channel Simulator | Retained |
| Revenue Architect | Revenue Architect | Combined with Revenue Opportunity Map |
| Revenue Opportunity Map | Revenue Architect | Combined |
| Channel Flywheel | Channel Flywheel | Retained and narrowed |
| Creator Strategy Engine | Creator Strategy Engine | Combined with Creator Command Brain |
| Creator Command Brain | Creator Strategy Engine | Combined |

**Result: 20 source entries → 13 canonical tools.**

---

# 17. Product-Level Goal

The Studio Hub should make ViewTube feel like a creator operating system rather than a collection of analytics pages.

The canonical loop is:

**Discover → Understand → Decide → Plan → Produce → Publish → Engage → Measure → Explain → Experiment → Monetize → Reinvest → Learn → Decide**

The 13 tools specialize this loop while sharing creator context, evidence, Projects, assets, analytics, and AI Brain.

---

# 18. Canonical Status Rule

From this point forward, new Studio Hub architecture should be added to this master document first.

The two source documents remain historical/source references unless explicitly reactivated.

Any future tool proposal must prove:

1. a unique primary transformation;
2. a unique reason to exist;
3. non-overlap with the 13 canonical tools;
4. the standard tool specification sections;
5. the required ViewTube UI/toolbox architecture.

If it cannot satisfy those conditions, it should become a capability, variant, subtoolbox, or feature of an existing canonical tool rather than a new Studio Hub tool.

---

# 19. Studio Hub Tool Interaction Architecture

The 13 Studio Hub tools are not 13 isolated pages. They form a typed **interaction graph** in which each tool owns one transformation and passes structured results to the next appropriate tool.

The interaction model is:

**Context → Evidence → Specialized Transformation → Typed Result → Handoff → Execution/Measurement → Learning**

A tool should interact with another tool through a declared contract, not by duplicating its logic, scraping another tool's UI, or silently taking ownership of another tool's decision.

## 19.1 Interaction Rules

1. **Every handoff has a reason.** A tool may send data downstream only when the receiving tool can perform a transformation the sender does not own.
2. **Outputs remain attributable.** Every handoff retains `sourceTool`, source version, evidence, confidence, uncertainty, validation state, and references.
3. **The receiving tool does not inherit ownership.** Receiving an input does not allow a tool to perform the sender's primary transformation.
4. **Tools may have multiple consumers.** A useful result can fan out to several tools without creating duplicate records.
5. **The canonical object remains linked.** Tools reference the original Opportunity, Concept, StoryGraph, AssetManifest, Finding, Experiment, Scenario, or Project rather than creating disconnected copies.
6. **User-controlled promotion is preferred.** High-impact transitions should expose the handoff and its rationale in the UI.
7. **Validated knowledge is different from operational context.** Tools may consume observations, signals, hypotheses, and predictions, but only validated findings become durable AI Brain knowledge.
8. **Execution happens through Projects.** Studio Hub tools recommend, prepare, analyze, and hand off; Projects owns execution state, tasks, milestones, and delivery.
9. **Analytics measures outcomes.** Analytics is the measurement source; Studio Hub tools interpret those measurements for their own specialized purpose.
10. **AI Brain stores durable knowledge.** AI Brain is not a passive database dump and should not receive every raw tool output.
11. **No circular ownership loops.** Feedback loops are allowed, but the same decision must not bounce between tools without a new evidence state, user decision, or measured outcome.
12. **Creator Strategy Engine is the strategic synthesis boundary.** Other tools can recommend actions inside their own domain, but only Creator Strategy Engine combines cross-tool recommendations into the prioritized next best move.

## 19.2 Canonical Tool-to-Tool Interaction Matrix

| From | Primary interaction | To | Handoff |
|---|---|---|---|
| Opportunity Radar | Converts emerging signals into an actionable opportunity | Content Architect | OpportunityContext |
| Opportunity Radar | Surfaces audience demand requiring relationship attention | Audience Pulse | Opportunity + AudienceSignal references |
| Opportunity Radar | Identifies possible monetization opportunities | Revenue Architect | OpportunityContext |
| Opportunity Radar | Provides validated/qualified opportunities for prioritization | Creator Strategy Engine | OpportunityContext |
| Content Architect | Converts an opportunity into a content concept | Story Engine | ContentConcept |
| Content Architect | Uses historical content patterns to improve concept quality | Video Genome | PatternRequest / ContentReferences |
| Content Architect | Creates execution-ready concept context | Projects | ProjectBrief |
| Content Architect | Requests production requirements | Asset Forge | ProductionRequirementRequest |
| Content Architect | Provides candidate concepts for strategic prioritization | Creator Strategy Engine | ContentConcept |
| Video Genome | Supplies reusable content patterns | Content Architect | PatternSet |
| Video Genome | Supplies structural references for narrative design | Story Engine | PatternSet |
| Video Genome | Finds reusable segments and derivative candidates | Content Autopilot | ContentPatternSet |
| Video Genome | Provides feature/evidence context for experiments | Experiment Lab | PatternEvidence |
| Video Genome | Provides observed pattern evidence for causal analysis | Causal Intelligence | PatternEvidence |
| Video Genome | Supplies validated historical patterns | Creator Strategy Engine | ValidatedPatternReference |
| Story Engine | Converts a concept into a production blueprint | Asset Forge | StoryGraph + ProductionBlueprint |
| Story Engine | Moves narrative work into execution | Projects | StoryBlueprint / ProjectBrief |
| Story Engine | Provides production-ready structure to Editor | Editor | EditBlueprint |
| Story Engine | Provides narrative assumptions for later measurement | Experiment Lab | RetentionHypothesis / ExperimentCandidate |
| Story Engine | Provides validated narrative patterns to strategy | Creator Strategy Engine | StoryPatternReference |
| Asset Forge | Resolves production requirements into assets | Projects | AssetManifest |
| Asset Forge | Makes production-ready assets available to Editor | Editor | ProductionAssetPackage |
| Asset Forge | Identifies asset gaps that may affect a project | Creator Strategy Engine | AssetConstraint |
| Audience Pulse | Turns audience needs into content opportunities | Content Architect | AudienceOpportunity |
| Audience Pulse | Creates relationship actions | Projects | RelationshipAction / ProjectTask |
| Audience Pulse | Provides audience segments and needs to Revenue Architect | Revenue Architect | AudienceValueContext |
| Audience Pulse | Supplies audience evidence for Opportunity Radar | Opportunity Radar | AudienceSignal |
| Audience Pulse | Supplies audience hypotheses for experiments | Experiment Lab | AudienceHypothesis |
| Content Autopilot | Turns published content into derivative opportunities | Content Architect | DerivativeOpportunity |
| Content Autopilot | Creates derivative production packages | Projects | DerivativeProjectBrief |
| Content Autopilot | Requests existing/reusable assets | Asset Forge | AssetReuseRequest |
| Content Autopilot | Identifies follow-up experiments | Experiment Lab | ExperimentCandidate |
| Content Autopilot | Identifies monetization extensions | Revenue Architect | MonetizationCandidate |
| Experiment Lab | Produces measured learning | Causal Intelligence | ExperimentResult |
| Experiment Lab | Produces validated findings when evidence supports them | AI Brain | KnowledgeCandidate |
| Experiment Lab | Supplies learning to strategy | Creator Strategy Engine | ValidatedFinding / ExperimentResult |
| Causal Intelligence | Explains observed outcomes | Experiment Lab | CausalHypothesis / TestCandidate |
| Causal Intelligence | Produces probable explanations for Flywheel bottlenecks | Channel Flywheel | CausalFinding |
| Causal Intelligence | Produces validated causal findings for durable knowledge | AI Brain | KnowledgeCandidate |
| Causal Intelligence | Supplies explanations to strategy | Creator Strategy Engine | CausalFinding |
| Channel Simulator | Uses current intelligence to model possible futures | Creator Strategy Engine | ScenarioSet |
| Channel Simulator | Tests consequences of strategic/content choices | Content Architect | ScenarioConstraint / ScenarioResult |
| Channel Simulator | Tests revenue paths | Revenue Architect | RevenueScenario |
| Channel Simulator | Provides scenario hypotheses for Experiment Lab | Experiment Lab | ScenarioHypothesis |
| Revenue Architect | Turns monetization intelligence into a revenue plan | Projects | RevenueProjectBrief |
| Revenue Architect | Identifies content required for a revenue path | Content Architect | RevenueContentRequirement |
| Revenue Architect | Identifies assets required for monetization | Asset Forge | MonetizationAssetRequest |
| Revenue Architect | Supplies revenue opportunities to strategy | Creator Strategy Engine | RevenueOpportunity |
| Channel Flywheel | Identifies the weakest growth stage | Causal Intelligence | BottleneckDiagnostic |
| Channel Flywheel | Identifies where an experiment could improve flow | Experiment Lab | BottleneckExperimentCandidate |
| Channel Flywheel | Supplies system-level diagnosis to strategy | Creator Strategy Engine | FlywheelBottleneck |
| Creator Strategy Engine | Turns cross-tool intelligence into a prioritized move | Projects | NextBestMove / ProjectBrief |
| Creator Strategy Engine | Routes a chosen content action | Content Architect | StrategicContentDirective |
| Creator Strategy Engine | Routes a chosen production action | Story Engine / Asset Forge | StrategicProductionDirective |
| Creator Strategy Engine | Routes a chosen learning action | Experiment Lab | StrategicExperimentDirective |
| Creator Strategy Engine | Routes a chosen monetization action | Revenue Architect | StrategicRevenueDirective |
| Creator Strategy Engine | Routes a chosen growth investigation | Causal Intelligence / Channel Flywheel | StrategicDiagnosticDirective |


## 19.2.1 Pre-existing user-facing Studio Hub interaction matrix

The pre-existing Studio Hub tools are part of the interaction architecture and must be treated as real user-facing owners. Their capabilities may be implemented through the newer intelligence engines, but the user-facing tool remains the owner of its stated workflow.

| From | Primary interaction | To | Handoff |
|---|---|---|---|
| Video Manager | Supplies published-video metadata, historical variants, and current packaging context for opportunity discovery | Opportunity Radar | PublishedContentContext |
| Video Manager | Supplies historical titles, descriptions, thumbnails, and metadata outcomes to analysis | Pre-Publication Analysis / Post-Publication Analysis | MetadataHistoryContext |
| Video Manager | Sends selected published-video metadata into audience/performance diagnosis | Post-Publication Analysis | PublishedMetadataContext |
| Video Manager | Sends a selected published video for derivative or improvement work | Content Architect | ExistingContentOpportunityRequest |
| Video Manager | Sends packaging history and performance evidence to Thumbnail Studio | Thumbnail Studio | PackagingHistoryContext |
| Video Manager | Sends selected published content into Content Autopilot capability | Post-Publication Analysis / Content Architect | DerivativeContext |
| Video Manager | Sends a completed metadata improvement back for user approval and application | Video Manager | MetadataRevision |
| Video Publisher | Receives project-ready content, assets, metadata, and readiness findings | Publishing Package | PublicationPackageRequest |
| Video Publisher | Receives final pre-publication review findings | Pre-Publication Analysis | PublicationReviewRequest |
| Video Publisher | Receives approved title/description/thumbnail/package recommendations | Thumbnail Studio / Content Architect | PublicationPackagingContext |
| Video Publisher | Receives project/content readiness from Projects | Projects | PublicationReadyProject |
| Video Publisher | Sends publication outcome and final package context to post-publication analysis | Post-Publication Analysis | PublishedPackageContext |
| Video Publisher | Sends publication timing/readiness context to Pre-Launch Priming | Pre-Launch Priming | LaunchPrimingContext |
| Video Publisher | Sends completed publication package to Video Manager after publishing | Video Manager | PublishedVideoRecord |
| Content Analysis | Routes a user-selected analysis into the appropriate pre- or post-publication workflow | Pre-Publication Analysis / Post-Publication Analysis | AnalysisContext |
| Content Analysis | Sends structured findings to Tactics Engine for actionable interventions | Tactics Engine | AnalysisFinding |
| Content Analysis | Sends content findings to Content Architect when a new/revised concept is warranted | Content Architect | ContentFinding |
| Content Analysis | Sends audience/content findings to Opportunity Radar | Opportunity Radar | OpportunitySignal |
| Content Analysis | Sends packaging findings to Thumbnail Studio | Thumbnail Studio | PackagingFinding |
| Content Analysis | Sends production findings to Video Director | Video Director | ProductionFinding |
| Video Director | Receives a promoted concept and turns it into coordinated production direction | Content Architect | ProductionDirectionRequest |
| Video Director | Receives story/script structure for production execution | Content Architect | StoryProductionBrief |
| Video Director | Requests required production assets | Asset Forge | ProductionAssetRequest |
| Video Director | Sends production-ready direction and assets into Projects | Projects | ProductionProjectBrief |
| Video Director | Sends edit/assembly requirements to Editor | Editor | EditDirection |
| Video Director | Sends production issues or missing requirements back to Tactics Engine | Tactics Engine | ProductionConstraint |
| Script Architect | Receives a promoted concept and develops script structure | Content Architect | ScriptArchitectureRequest |
| Script Architect | Sends script structure into Video Director for production coordination | Video Director | ScriptProductionBrief |
| Script Architect | Sends hooks/script variants into Hook Generator for refinement | Hook Generator | HookRefinementRequest |
| Script Architect | Sends completed script package into Projects | Projects | ScriptProjectBrief |
| Thumbnail Studio | Receives packaging findings and performance context | Post-Publication Analysis | ThumbnailAnalysisContext |
| Thumbnail Studio | Receives concept/story context for packaging development | Content Architect | PackagingConceptContext |
| Thumbnail Studio | Receives end-screen/viewer-path requirements | End-Screen Architect | EndScreenDesignRequest |
| Thumbnail Studio | Sends approved thumbnail/end-screen package into Video Publisher | Video Publisher | PublicationPackagingPackage |
| Thumbnail Studio | Sends packaging variants to Experiment Lab | Experiment Lab | PackagingExperimentCandidate |
| Publishing Package | Collects assets, metadata, thumbnail, end-screen, and publication requirements | Video Publisher | PublicationPackage |
| Publishing Package | Requests missing assets or production deliverables | Asset Forge / Video Director | PackageAssetRequest |
| Publishing Package | Requests final pre-publication validation | Pre-Publication Analysis | PublicationValidationRequest |
| Publishing Package | Returns publication-ready status and package evidence to Video Publisher | Video Publisher | PublicationReadiness |
| Community Posts | Uses audience findings and opportunities to create audience-facing posts | Audience Studio | CommunityPostContext |
| Community Posts | Sends post performance and audience response into Post-Publication Analysis | Post-Publication Analysis | CommunityResponseEvidence |
| Community Posts | Sends post concepts to Content Architect when they reveal content demand | Content Architect | AudienceDemandSignal |
| Community Posts | Sends selected audience opportunities to Opportunity Radar | Opportunity Radar | CommunityOpportunitySignal |
| Comment Responder | Sends comment themes, questions, requests, and response outcomes to Audience Studio | Audience Studio | CommentAudienceContext |
| Comment Responder | Sends high-value audience demand into Content Architect | Content Architect | CommentContentDemand |
| Comment Responder | Sends emerging audience signals into Opportunity Radar | Opportunity Radar | CommentOpportunitySignal |
| Comment Responder | Sends difficult/repeated response patterns into Tactics Engine | Tactics Engine | ResponseTacticCandidate |
| End-Screen Architect | Receives content destination and continuation-path context | Thumbnail Studio | EndScreenPackagingContext |
| End-Screen Architect | Receives performance findings about viewer continuation | Post-Publication Analysis | ContinuationPerformanceContext |
| End-Screen Architect | Sends viewer-path variants into Experiment Lab | Experiment Lab | EndScreenExperimentCandidate |
| End-Screen Architect | Sends approved continuation package into Video Publisher | Video Publisher | EndScreenPublicationPackage |
| Pre-Launch Priming | Receives publication timing and content context | Video Publisher | LaunchScheduleContext |
| Pre-Launch Priming | Uses audience opportunity/context to prepare pre-launch activity | Opportunity Radar | PreLaunchSignalContext |
| Pre-Launch Priming | Uses content concept and hook context to create anticipation messaging | Content Architect / Hook Generator | PreLaunchContentContext |
| Pre-Launch Priming | Sends pre-launch actions into Projects | Projects | PreLaunchProjectTasks |
| Pre-Launch Priming | Sends pre-launch results into Post-Publication Analysis for later comparison | Post-Publication Analysis | PrimingOutcomeContext |
| Hook Generator | Receives concepts, scripts, and analysis findings requiring stronger openings | Content Architect / Script Architect | HookInputContext |
| Hook Generator | Sends hook candidates to Thumbnail Studio when title/thumbnail/hook packaging must be evaluated together | Thumbnail Studio | HookPackagingContext |
| Hook Generator | Sends hook variants to Experiment Lab | Experiment Lab | HookExperimentCandidate |
| Hook Generator | Sends selected hook into Video Director and Projects | Video Director / Projects | ApprovedHook |
| Tactics Engine | Converts findings into concrete creator tactics, interventions, tests, and actions | Projects | TacticProjectBrief |
| Tactics Engine | Converts analysis findings into targeted corrective actions | Pre-Publication Analysis / Post-Publication Analysis | AnalysisTactic |
| Tactics Engine | Converts opportunity findings into actionable tests or interventions | Opportunity Radar | OpportunityActionPlan |
| Tactics Engine | Converts audience findings into response/relationship tactics | Audience Studio | AudienceTactic |
| Tactics Engine | Sends learning-oriented tactics into Experiment Lab | Experiment Lab | TacticExperimentCandidate |
| Tactics Engine | Sends strategic action candidates to Creator Strategy Engine | Creator Strategy Engine | TacticCandidate |
| Tactics Engine | Sends selected production tactics to Video Director | Video Director | ProductionTactic |
| Tactics Engine | Sends selected publishing tactics to Video Publisher | Video Publisher | PublishingTactic |
| Tactics Engine | Sends selected metadata tactics to Video Manager | Video Manager | MetadataTactic |

## 19.2.2 New/consolidated user-facing tool interactions

These are the planned interactions for the current Round 1 user-facing inventory. They complement, rather than replace, the capability-engine matrix above.

| From | Primary interaction | To | Handoff |
|---|---|---|---|
| Opportunity Radar | Promotes a general opportunity into content development | Content Architect | OpportunityContext |
| Opportunity Radar | Supplies opportunity evidence to post-publication diagnosis | Post-Publication Analysis | OpportunityAnalysisContext |
| Opportunity Radar | Supplies revenue-specific opportunities to monetization planning | Revenue Architect | RevenueOpportunityCandidate |
| Opportunity Radar | Supplies qualified opportunities to strategic prioritization | Creator Strategy Engine | OpportunityContext |
| Content Architect | Converts opportunity into concept/story/script planning | Video Director | ContentProductionBrief |
| Content Architect | Requests production assets | Asset Forge | ProductionRequirementRequest |
| Content Architect | Sends concept/script decisions into Pre-Publication Analysis | Pre-Publication Analysis | PrePublicationReviewRequest |
| Content Architect | Receives post-publication findings for concept iteration | Post-Publication Analysis | ContentRevisionContext |
| Content Architect | Sends selected concepts into Video Publisher when ready for packaging | Video Publisher | PublicationConceptPackage |
| Content Architect | Receives tactics and strategic directives without surrendering concept ownership | Tactics Engine / Creator Strategy Engine | ConceptDirective |
| Video Director | Receives concept/script/hook context and coordinates production | Content Architect / Hook Generator | ProductionDirectionContext |
| Video Director | Requests production-ready assets | Asset Forge | ProductionAssetRequest |
| Video Director | Sends production status and constraints into Pre-Publication Analysis | Pre-Publication Analysis | ProductionReviewContext |
| Video Director | Sends completed production into Video Publisher | Video Publisher | ProductionReadyPackage |
| Asset Forge | Supplies production assets to Video Director | Video Director | ProductionAssetPackage |
| Asset Forge | Supplies assets required for publication packaging | Video Publisher / Publishing Package | PublicationAssetPackage |
| Asset Forge | Supplies monetization assets requested by Revenue Architect | Revenue Architect | RevenueAssetPackage |
| Thumbnail Studio | Supplies packaging candidates to Pre-Publication Analysis | Pre-Publication Analysis | PackagingReviewRequest |
| Thumbnail Studio | Receives post-publication performance evidence | Post-Publication Analysis | PackagingPerformanceContext |
| Thumbnail Studio | Supplies approved thumbnails/end-screen packaging to Video Publisher | Video Publisher | PublicationPackagingPackage |
| Video Manager | Provides published-video context to Opportunity Radar | Opportunity Radar | PublishedContentContext |
| Video Manager | Receives post-publication analysis findings and applies approved metadata changes | Post-Publication Analysis | MetadataOptimizationContext |
| Video Manager | Sends metadata history to Thumbnail Studio and Content Architect | Thumbnail Studio / Content Architect | MetadataHistoryContext |
| Video Publisher | Receives final project, assets, metadata, and packaging | Projects / Asset Forge / Thumbnail Studio | PublicationPackageContext |
| Video Publisher | Sends final pre-publication package to Pre-Publication Analysis | Pre-Publication Analysis | FinalPrePublicationReview |
| Video Publisher | Sends published result into Video Manager | Video Manager | PublishedVideoRecord |
| Video Publisher | Sends publication timing to Pre-Launch Priming | Pre-Launch Priming | LaunchScheduleContext |
| Pre-Publication Analysis | Reviews content, packaging, metadata, production readiness, and risks before publication | Video Publisher | PublicationReadinessFinding |
| Pre-Publication Analysis | Sends corrective actions to Tactics Engine | Tactics Engine | PrePublicationTactic |
| Pre-Publication Analysis | Sends concept/script/packaging changes to their owning tools | Content Architect / Video Director / Thumbnail Studio | RevisionRequest |
| Pre-Publication Analysis | Sends evidence-backed publication decision context to Creator Strategy Engine when a strategic tradeoff exists | Creator Strategy Engine | PrePublicationDecisionContext |
| Post-Publication Analysis | Reviews published content with actual performance/audience evidence | Video Manager | PublishedMetadataFinding |
| Post-Publication Analysis | Identifies content opportunities from observed outcomes | Opportunity Radar | PostPublicationOpportunitySignal |
| Post-Publication Analysis | Sends findings into Content Architect for iteration | Content Architect | ContentIterationFinding |
| Post-Publication Analysis | Sends audience findings to Audience Studio | Audience Studio | AudienceFinding |
| Post-Publication Analysis | Sends packaging findings to Thumbnail Studio / End-Screen Architect | Thumbnail Studio / End-Screen Architect | PackagingFinding |
| Post-Publication Analysis | Sends causal/experimental candidates to Tactics Engine / Experiment Lab | Tactics Engine / Experiment Lab | LearningCandidate |
| Audience Studio | Consolidates Community Posts and Comment Responder workflows | Community Posts / Comment Responder | AudienceActionContext |
| Audience Studio | Sends audience demand and relationship opportunities to Content Architect | Content Architect | AudienceOpportunity |
| Audience Studio | Sends audience opportunities to Opportunity Radar | Opportunity Radar | AudienceSignal |
| Audience Studio | Sends audience value/context to Revenue Architect | Revenue Architect | AudienceValueContext |
| Audience Studio | Sends selected audience actions into Projects | Projects | AudienceActionProject |
| Audience Studio | Sends response tactics to Tactics Engine | Tactics Engine | AudienceTactic |
| Tactics Engine | Turns specialist findings into executable interventions | Projects | TacticProjectBrief |
| Tactics Engine | Supplies domain-specific action candidates to Creator Strategy Engine | Creator Strategy Engine | TacticCandidate |
| Revenue Architect | Converts revenue opportunities into monetization plans | Projects | RevenueProjectBrief |
| Revenue Architect | Requests content required for revenue path | Content Architect | RevenueContentRequirement |
| Revenue Architect | Requests assets required for offers/monetization | Asset Forge | MonetizationAssetRequest |
| Revenue Architect | Uses audience value from Audience Studio | Audience Studio | RevenueAudienceContext |
| Revenue Architect | Supplies revenue opportunities to Creator Strategy Engine | Creator Strategy Engine | RevenueOpportunity |
| Creator Strategy Engine | Prioritizes cross-tool actions without taking specialist ownership | Tactics Engine / Content Architect / Video Director / Revenue Architect | StrategicDirective |
| Creator Strategy Engine | Sends the selected next-best move into execution | Projects | NextBestMove |
| Creator Strategy Engine | Can request investigation before committing to a strategic action | Pre-Publication Analysis / Post-Publication Analysis | StrategicReviewRequest |
| Creator Strategy Engine | Can request growth/content opportunity discovery | Opportunity Radar | StrategicDiscoveryRequest |
| Creator Strategy Engine | Can request monetization planning | Revenue Architect | StrategicRevenueDirective |

### 19.2.3 Planned pre-existing-tool consolidation boundaries

The interaction graph must preserve these ownership boundaries while allowing capability consolidation:

| Pre-existing tool | Planned relationship to newer architecture |
|---|---|
| Video Manager | Remains a standalone published-content metadata owner; consumes post-publication intelligence rather than becoming the analysis engine. |
| Video Publisher | Remains a standalone publication-preparation owner; Publishing Package is a supporting workflow/subtool rather than a competing owner. |
| Content Analysis | Remains the historical umbrella concept; implementation may split it into Pre-Publication Analysis and Post-Publication Analysis while preserving shared analysis infrastructure. |
| Video Director | Remains the production-direction owner; it consumes Content Architect, Hook Generator, Asset Forge, and analysis outputs. |
| Script Architect | Remains a historical/pre-existing capability owner during migration; script architecture may become a mode/subtool of Content Architect without losing the capability. |
| Thumbnail Studio | Remains the visual-packaging owner; End-Screen Architect may become a packaging subtool while preserving viewer-path functionality. |
| Publishing Package | Remains a publication-package capability/workflow under Video Publisher unless a distinct ownership need is proven. |
| Community Posts | Remains an audience-publishing capability under Audience Studio if consolidated. |
| Comment Responder | Remains an audience-response capability under Audience Studio if consolidated. |
| End-Screen Architect | Remains a viewer-continuation capability under Thumbnail Studio if consolidated. |
| Pre-Launch Priming | Remains the pre-publication audience-activation capability and coordinates with Video Publisher, Content Architect, Opportunity Radar, and Projects. |
| Hook Generator | Remains the hook-generation capability and should integrate with Content Architect, Script Architect, Video Director, Thumbnail Studio, and Experiment Lab. |
| Tactics Engine | Remains the action/intervention engine and is the bridge from specialist findings to executable tactics; it does not replace Creator Strategy Engine's cross-tool prioritization. |


## 19.3 The Main Creator Workflow

The normal creation path should behave like a chain of specialized transformations:

```text
Signals / Audience / Existing Content
              │
              ▼
      ┌─────────────────┐
      │ Opportunity      │
      │ Radar            │
      └────────┬────────┘
               │ Opportunity
               ▼
      ┌─────────────────┐
      │ Content          │
      │ Architect        │
      └────────┬────────┘
               │ ContentConcept
               ▼
      ┌─────────────────┐
      │ Story Engine     │
      └────────┬────────┘
               │ StoryGraph / Blueprint
               ▼
      ┌─────────────────┐
      │ Asset Forge      │
      └────────┬────────┘
               │ AssetManifest
               ▼
      ┌─────────────────┐
      │ Projects         │
      └────────┬────────┘
               │ execution
               ▼
      ┌─────────────────┐
      │ Editor           │
      └────────┬────────┘
               │
               ▼
            Publish
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
   Audience  Content  Analytics
    Pulse   Autopilot    │
       │       │         ▼
       │       │    Causal Intelligence
       │       │         │
       │       └────┐    │
       │            ▼    ▼
       │       Experiment Lab
       │            │
       └────────────┴───────┐
                            ▼
                         AI Brain
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       Channel Simulator Revenue Architect Channel Flywheel
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                 Creator Strategy Engine
                            │
                            ▼
                      Next Best Move
                            │
                            ▼
                         Projects
```

This is a **workflow graph**, not a requirement that every creator use every tool for every project.

## 19.4 Interaction With Existing Studio Hub / Workspace Systems

The Studio Hub tools must also interact cleanly with the existing ViewTube workspace systems:

### Projects — execution system

Projects receives actionable outputs from Studio Hub and turns them into execution state.

Typical flow:

```text
Studio Tool
   ↓
Typed Brief / Directive
   ↓
Project
   ├── Objective
   ├── Evidence
   ├── Hypothesis
   ├── Deliverables
   ├── Tasks
   ├── Assets
   ├── Milestones
   ├── Experiments
   └── Outcome Measurements
```

Projects should not re-run Studio Hub intelligence. It executes and tracks the chosen work.

### Analytics — measurement system

Analytics provides measurements to the tools and receives no authority to make cross-tool strategy decisions.

```text
Analytics
   ├── Sync Controller
   ├── Intelligence Hub
   ├── Master Data Tables
   └── Data Visuals
             │
             ▼
       Studio Hub tools
```

Analytics answers **what happened / what is measured**. Specialized Studio Hub tools answer their respective transformation questions.

### AI Brain — durable intelligence system

AI Brain receives validated knowledge candidates rather than every raw observation.

```text
Tool Output
   ↓
Evidence
   ↓
Interpretation
   ↓
Hypothesis / Prediction
   ↓
Finding
   ↓
Validation
   ↓
AI Brain Knowledge
```

AI Brain then supplies validated creator-specific knowledge back to the tools.

### Asset Engine / Vault — reusable production system

Asset Forge is the primary Studio Hub gateway into reusable production assets, but other tools may request assets through typed references.

```text
Story / Concept / Revenue / Autopilot requirement
                  ↓
              Asset Forge
                  ↓
       Asset Engine / Vault
                  ↓
          AssetManifest
                  ↓
        Projects / Editor
```

No Studio Hub tool should create a second asset-storage system.

### Editor — production system

Editor consumes production-ready narrative and asset references.

```text
Story Engine → EditBlueprint
Asset Forge  → ProductionAssetPackage
                         ↓
                      Editor
                         ↓
                    Published Work
```

Editor owns editing and assembly, not opportunity discovery or strategy.

### Resource Library — reference system

The Resource Library supplies reusable source material, references, documentation, templates, and other governed resources.

Studio Hub tools should reference Resource Library records instead of embedding duplicated copies of the same resource.

### Account / Creator Context — identity and permissions

Every handoff must retain creator/account scope and respect the permissions of the originating workspace.

No tool should infer identity from a free-text handoff.

## 19.5 Handoff Object

Where a full object contract is not necessary, tools should use a common handoff envelope:

```text
ToolHandoff {
  id
  sourceTool
  sourceVersion
  targetTool
  creatorId
  projectId?
  timestamp
  handoffType
  primaryObjectRef
  supportingReferences[]
  evidence[]
  assumptions[]
  confidence
  uncertainty
  validationState
  requestedAction
  userDecision?
  provenance[]
}
```

The receiving tool should be able to reconstruct enough context to continue the workflow without asking the creator to manually re-enter information that already exists in ViewTube.

## 19.6 Fan-Out and Fan-In Rules

### Fan-out

One result can feed several tools when each consumer has a legitimate use.

Example:

```text
Opportunity
   ├── Content Architect
   ├── Audience Pulse
   ├── Revenue Architect
   └── Creator Strategy Engine
```

This does not mean each tool creates a separate opportunity record. They reference the canonical Opportunity.

### Fan-in

Creator Strategy Engine may receive:

```text
Opportunity
Concept
Audience Finding
Experiment Finding
Causal Finding
Scenario
Revenue Opportunity
Flywheel Bottleneck
Project State
Creator Goal
       │
       ▼
Creator Strategy Engine
       │
       ▼
Next Best Move
```

No other tool gets equivalent unrestricted fan-in authority.

## 19.7 Feedback Loops

The important feedback loops are:

### Content learning loop

```text
Video Genome
   ↓
Content Architect
   ↓
Story Engine
   ↓
Projects / Editor
   ↓
Publish
   ↓
Analytics
   ↓
Causal Intelligence / Experiment Lab
   ↓
AI Brain
   ↓
Content Architect / Story Engine
```

### Audience loop

```text
Publish
   ↓
Audience Pulse
   ↓
Audience needs / relationship actions
   ├── Content Architect
   ├── Projects
   └── Opportunity Radar
```

### Monetization loop

```text
Audience + Content + Assets + Channel Intelligence
                    ↓
             Revenue Architect
                    ↓
             Revenue Plan
                    ↓
                 Projects
                    ↓
                Results
                    ↓
                Analytics
                    ↓
        Causal Intelligence / AI Brain
                    ↓
          Revenue Architect
```

### Growth loop

```text
Analytics
   ↓
Channel Flywheel
   ↓
Bottleneck
   ↓
Causal Intelligence
   ↓
Experiment Lab
   ↓
Measured Result
   ↓
AI Brain
   ↓
Creator Strategy Engine
   ↓
Next Best Move
```

## 19.8 What Each Tool Should NOT Do

| Tool | Must not become |
|---|---|
| Opportunity Radar | A generic content planner or strategy chatbot |
| Content Architect | A story editor or analytics dashboard |
| Video Genome | A causal engine or strategy engine |
| Story Engine | A general project manager or asset repository |
| Asset Forge | A general asset database outside the Asset Engine/Vault |
| Audience Pulse | A generic CRM replacing the workspace's relationship systems |
| Content Autopilot | A cross-tool strategy engine |
| Experiment Lab | A generic analytics dashboard |
| Causal Intelligence | A prediction engine that presents hypotheses as facts |
| Channel Simulator | A strategy recommender or guaranteed forecast |
| Revenue Architect | A generic business chatbot |
| Channel Flywheel | A causal-analysis replacement or strategy engine |
| Creator Strategy Engine | A generic chatbot or replacement for specialist tools |

## 19.9 Interaction UI Requirements

Every cross-tool handoff should be visible to the user as an intentional action where practical.

A handoff UI should show:

- **From:** originating tool;
- **To:** receiving tool;
- **Object:** what is being handed off;
- **Why:** reason for the handoff;
- **Evidence:** supporting evidence;
- **Confidence:** confidence level;
- **State:** observation/signal/hypothesis/prediction/finding/validated;
- **What happens next:** receiving tool's primary transformation;
- **User action:** Accept, Review, Edit, Save, Defer, or Cancel where appropriate.

The creator should never have to wonder why a result appeared in another tool.

## 19.10 Interaction Completion Criteria

Studio Hub integration is complete when:

- every canonical tool has documented upstream inputs;
- every canonical tool has documented downstream consumers;
- each handoff uses a typed object or `ToolHandoff`;
- source provenance survives the handoff;
- evidence and uncertainty survive the handoff;
- canonical objects are referenced rather than duplicated;
- Projects owns execution state;
- Analytics owns measurement;
- AI Brain owns durable validated knowledge;
- Asset Engine/Vault owns reusable assets;
- Editor owns editing/assembly;
- Creator Strategy Engine owns cross-tool strategic synthesis;
- no tool silently assumes another tool's primary transformation;
- user-facing handoffs are understandable and actionable;
- closed-loop learning can return measured results to the relevant tools.

# 20. User-Facing Studio Hub Reassessment — 2026-10-04

The current conversation introduced an important ownership correction to the 13-engine architecture above.

The **13 canonical engines in this document must not automatically be interpreted as 13 new user-facing Studio Hub Toolboxes**. The pre-existing Studio Hub already contains definitive creator-facing tools, including Video Manager, Video Publisher, Content Analysis, Thumbnail Studio, and related production/audience workflows.

The current Round 1 proposal is to preserve the intelligence-engine architecture as a **capability and interaction model**, while separately determining the actual user-facing Toolbox inventory through reconciliation with the existing Studio Hub.

## 20.1 User-facing ownership principles

1. Existing tools retain their definitive purpose when that purpose is already distinct and useful.
2. A new Toolbox is justified only when it owns a unique primary transformation and reason to exist.
3. Related capabilities should be consolidated into an existing Toolbox when doing so does not blur its primary purpose.
4. A capability may remain an internal engine, mode, subtoolbox, or workflow without becoming a new top-level Toolbox.
5. Specialized opportunity systems may coexist when their opportunity domain is explicit. For example, Revenue Architect may own revenue opportunities while Opportunity Radar owns general content opportunities.
6. Tool interactions must pass typed context rather than duplicate ownership.

## 20.2 Clarified existing-tool boundaries

| Tool | Definitive ownership |
|---|---|
| Video Manager | Metadata management for already-published videos: titles, descriptions, thumbnails, and related metadata |
| Video Publisher | Pre-publication compilation and preparation, including multi-project publication work and publication metadata |
| Pre-Publication Analysis | User-controlled AI review before publication |
| Post-Publication Analysis | AI review after publication using actual content/performance/audience evidence; may produce opportunity candidates |
| Revenue Architect | Income generation and revenue opportunity development |
| Content Architect | Proposed consolidation of concept, story, and script planning |
| Thumbnail Studio | Visual packaging; End-Screen functionality may be consolidated here |
| Audience Studio | Proposed consolidation of Community Posts and Comment Responder |

### 20.2.1 Pre-existing Studio Hub tools

The following tools predate the current 13-engine proposal and must be treated as existing user-facing Studio Hub ownership when reconciling the architecture:

| Pre-existing tool | Definitive purpose |
|---|---|
| **Video Manager** | Manages, edits, generates, compares, and improves metadata for already-published videos, including titles, descriptions, and thumbnails. |
| **Video Publisher** | Prepares and compiles projects/content for publication, including multi-project workflows and publication metadata. |
| **Content Analysis** | Generates user-controlled AI reviews of projects, videos, and other content; the final architecture may split this into dedicated pre- and post-publication tools. |
| **Video Director** | Directs and coordinates the creative and production execution of a video or content project. |
| **Script Architect** | Structures and develops scripts from concepts into executable written content; its functions are candidates for consolidation into Content Architect. |
| **Thumbnail Studio** | Creates, evaluates, compares, and optimizes thumbnail packaging; End-Screen functionality is a candidate for consolidation here. |
| **Publishing Package** | Compiles the assets, metadata, and requirements needed to make content publication-ready; this may become a workflow/subtool of Video Publisher. |
| **Community Posts** | Creates and manages community posts, polls, updates, and other direct audience-publishing interactions; candidate for consolidation into Audience Studio. |
| **Comment Responder** | Reviews and manages audience comments and supports creator responses; candidate for consolidation into Audience Studio. |
| **End-Screen Architect** | Designs end-screen destinations and viewer continuation paths; candidate for consolidation into Thumbnail Studio rather than automatically remaining a top-level Toolbox. |
| **Pre-Launch Priming** | Prepares audience-facing activity and messaging intended to build anticipation before content is published. |
| **Hook Generator** | Generates and develops opening hooks for videos and other content; its final ownership should be reconciled with Content Architect. |
| **Tactics Engine** | Converts intelligence and findings into concrete creator tactics, interventions, tests, and actions. |

These are **pre-existing tools**, not newly invented replacements. Proposed consolidation means preserving their useful functionality under a definitive owner, not discarding the underlying capability.

## 20.3 Proposed user-facing inventory

This is **PROPOSED / ROUND 1**, not final canonical implementation:

1. Opportunity Radar
2. Content Architect
3. Video Director
4. Asset Forge
5. Thumbnail Studio
6. Video Manager
7. Video Publisher
8. Pre-Publication Analysis
9. Post-Publication Analysis
10. Audience Studio
11. Tactics Engine
12. Revenue Architect
13. Creator Strategy Engine

The following earlier engine concepts remain useful but are not automatically separate Toolboxes:

- Video Genome
- Audience Pulse
- Content Autopilot
- Experiment Lab
- Causal Intelligence
- Channel Simulator
- Channel Flywheel
- End-Screen Architect
- Publishing Package

Their final ownership must be reconciled against the existing Studio Hub implementation and canonical documentation.

## 20.4 Important distinction

The architecture now has two related but different questions:

**Capability architecture:** What intelligence and transformations ViewTube needs.

**User-facing Toolbox architecture:** Which existing or new tools should own those transformations.

The capability architecture should inform the Toolbox architecture without forcing a one-engine-per-Toolbox mapping.

**Round 1 status:** The user-facing inventory above is preserved as conversation evidence. Do not rename, merge, delete, or create production Toolboxes from this proposal until the existing Studio Hub inventory and implementation are reconciled.


# 21. Five-Document Studio Hub Documentation Split — 2026-10-05

The Studio Hub master has been structurally decomposed into five focused documents. The original master remains preserved as the source during migration and verification.

Canonical split:
1. `docs/product/studio-hub/01_STUDIO_HUB_ARCHITECTURE.md` — architecture, implementation, migration, governance.
2. `docs/product/studio-hub/02_STUDIO_HUB_TOOLS.md` — canonical/user-facing tools and all pre-existing tools.
3. `docs/product/studio-hub/03_STUDIO_HUB_INTELLIGENCE_AI_BRAIN_PROMPTS.md` — intelligence engines, AI generation, prompts, and AI Brain connection.
4. `docs/product/studio-hub/04_STUDIO_HUB_INTERACTIONS_WORKFLOWS_HANDOFFS_CONTRACTS.md` — interactions, workflows, handoffs, and contracts.
5. `docs/product/studio-hub/05_STUDIO_HUB_UI_ARCHITECTURE.md` — Toolbox/UI architecture, Reference Library rules, controls, states, and handoff UI.

The split intentionally contains **exactly five documents**. No separate index, pre-existing-tools folder, interactions folder, contracts folder, or per-tool document family is introduced at this stage.

The source master must not be deleted or declared superseded until source coverage and cross-document consistency are verified.
