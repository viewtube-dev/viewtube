# ViewTube Studio Hub — Tools

**Status:** ACTIVE — canonical tool ownership inventory
**Date:** 2026-10-05

## Canonical user-facing Round 1 inventory
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

This is proposed until runtime inventory and Round 2 reconciliation are complete.

## Pre-existing user-facing tools
| Tool | Definitive purpose | Planned relationship |
|---|---|---|
| Video Manager | Edit, generate, compare, and improve metadata for already-published videos, including titles, descriptions, thumbnails, and related metadata. | Remains standalone published-content metadata owner. |
| Video Publisher | Prepare and compile content/projects for publication, including multi-project workflows and publication metadata. | Remains standalone publication-preparation owner. |
| Content Analysis | User-controlled AI reviews of projects, videos, and content. | Historical umbrella; may split into Pre/Post Publication Analysis. |
| Video Director | Direct and coordinate creative/production execution. | Remains production-direction owner. |
| Script Architect | Structure and develop scripts. | Candidate capability/mode under Content Architect. |
| Thumbnail Studio | Create, evaluate, compare, optimize visual packaging. | Remains packaging owner; End-Screen may consolidate here. |
| Publishing Package | Compile assets, metadata, and requirements for publication readiness. | Supporting workflow/subtool of Video Publisher unless distinct ownership is proven. |
| Community Posts | Create/manage posts, polls, updates, and audience publishing. | Candidate capability under Audience Studio. |
| Comment Responder | Review/manage comments and creator responses. | Candidate capability under Audience Studio. |
| End-Screen Architect | Design viewer continuation destinations and paths. | Candidate capability under Thumbnail Studio. |
| Pre-Launch Priming | Prepare audience-facing activity and messaging before publication. | Retains pre-publication audience activation ownership. |
| Hook Generator | Generate/develop opening hooks. | Integrates with Content Architect, Script Architect, Video Director, Thumbnail Studio, Experiment Lab. |
| Tactics Engine | Convert intelligence/findings into concrete tactics, interventions, tests, and actions. | Retains action/intervention ownership; does not replace Creator Strategy Engine. |

## Capability-engine inventory
| Capability | Primary transformation | Ownership status |
|---|---|---|
| Opportunity Radar | Signals → Opportunities | User-facing candidate |
| Content Architect | Opportunities → Content Concepts | User-facing candidate |
| Video Genome | Content → Structured Content Patterns | Internal/user-facing capability candidate |
| Story Engine | Concepts → Executable Narratives | Internal capability; maps to Content Architect/Video Director |
| Asset Forge | Production Blueprints → Asset Packages | User-facing candidate |
| Audience Pulse | Audience Behavior → Relationship Opportunities | Capability; maps to Audience Studio |
| Content Autopilot | Published Content → Derivative/Follow-up Opportunities | Capability; user-facing ownership to reconcile |
| Experiment Lab | Hypotheses → Measurable Learning | Capability |
| Causal Intelligence | Results → Probable Explanations | Capability |
| Channel Simulator | Current State → Future Scenarios | Capability |
| Revenue Architect | Intelligence → Monetization Opportunities | User-facing candidate |
| Channel Flywheel | Channel System → Growth Bottleneck | Capability |
| Creator Strategy Engine | Validated Intelligence → Next Best Move | User-facing candidate |

## Standard tool specification
Every tool/capability should document:
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

## Tool boundaries
### Opportunity Radar
Question: What is becoming worth pursuing? Owns signal detection, opportunity scoring, freshness, strategic fit, demand, effort, confidence, and watchlists. Does not own final concept development.

### Content Architect
Question: What should we make about this? Bridges opportunity discovery and narrative/production planning. Does not own opportunity discovery or final editing.

### Video Genome
Question: What patterns exist in content we already have? Decomposes existing/published content into reusable structural and creative patterns. Pattern evidence is not automatically causal.

### Story Engine
Question: How should this content unfold? Owns StoryGraph, beats, hook, escalation, retention hypotheses, visual/audio mapping, payoff, CTA, and production blueprint.

### Asset Forge
Question: What assets are required and how do we resolve them? Bridges production requirements and Asset Engine/Vault. Does not become a second asset repository.

### Audience Pulse / Audience Studio
Question: Who needs attention, what do they need, and what relationship action should happen? Audience Studio is the proposed user-facing owner; Community Posts and Comment Responder may become its capabilities.

### Content Autopilot
Question: What additional value can existing content produce? Generates derivatives, follow-ups, resources, experiments, and revenue opportunities. Does not become a generic strategy engine.

### Experiment Lab
Question: What should we test to learn? Designs controlled experiments and validates creator-specific learning.

### Causal Intelligence
Question: Why did this result probably happen? Ranks explanations and alternatives while distinguishing correlation from causal evidence.

### Channel Simulator
Question: What might happen if we choose this path? Models scenario ranges/distributions and explicit assumptions. Does not guarantee outcomes.

### Revenue Architect
Question: How can this creator turn value into revenue? Maps capabilities, audience value, assets, revenue models, unit economics, scenarios, and plans.

### Channel Flywheel
Question: Where is the growth system weakest? Diagnoses the bottleneck in Discovery → Click → Watch → Satisfaction → Return → Relationship → Community → Conversion → Revenue → Reinvestment → Creation.

### Creator Strategy Engine
Question: What should the creator do next? Only Studio Hub tool with unrestricted cross-tool strategic synthesis. Produces prioritized next-best moves while preserving evidence and assumptions.

## Pre-existing consolidation rules
- Video Manager remains standalone.
- Video Publisher remains standalone.
- Content Analysis may split into Pre-Publication Analysis and Post-Publication Analysis.
- Video Director remains production-direction owner.
- Script Architect may become a Content Architect mode/subtool.
- Thumbnail Studio remains packaging owner.
- Publishing Package remains under Video Publisher unless distinct ownership is proven.
- Community Posts and Comment Responder may consolidate into Audience Studio.
- End-Screen Architect may consolidate into Thumbnail Studio.
- Pre-Launch Priming remains pre-publication audience activation.
- Hook Generator remains a hook capability.
- Tactics Engine remains the bridge from findings to executable tactics.

Consolidation means preserving functionality under a clear owner, not deleting capability.

## Tool lifecycle
Proposal → Ownership test → Contract → UI module → Implementation → Evidence/measurement → Validation → Brain learning → Governance


## Metadata Master — ACTIVE IMPLEMENTATION

**Definitive purpose:** Optimize and assemble the publication package for a video/project before publication, or prepare a proposed metadata update for an already-published video.

**Core question:** What should this video's complete publication package be?

**Owns:** generation, refinement, package comparison, package scoring, component selection, title/thumbnail relationship evaluation, publication-package readiness, and downstream metadata handoff.

**Does not own:** live published-video mutation (Video Manager), publication execution (Video Publisher), thumbnail creation (Thumbnail Studio), content interpretation (Content Analysis), durable knowledge (AI Brain), or canonical asset storage (Asset Engine/Vault).

**Primary output:** PublicationPackage.
**Primary action:** OPTIMIZE PACKAGE.
**Workflow:** Context → Analyze → Generate → Compare → Optimize → Decide → Package → Handoff.

**Required integrations:** Content Analysis → evidence/context; AI Brain → creator/channel knowledge; Thumbnail Studio → thumbnail creation; Video Publisher → publication; Video Manager → proposed live-video updates; Projects/ContentBuild → execution continuity; Asset Engine/Vault → canonical assets; ActionPacket/Handoff → transport.

**Implementation:** src/views/MetadataMaster.tsx + src/services/metadataMaster.ts.
**Mount:** /studio#metadata-master.
**UI architecture:** canonical Toolbox → Context → Optimization Brief → Generate → Publication Package Canvas → Evaluate/Compare → Handoff → History.

