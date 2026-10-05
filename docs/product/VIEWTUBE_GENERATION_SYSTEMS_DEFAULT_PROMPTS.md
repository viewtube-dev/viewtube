# ViewTube — Generation Systems & Default Prompts

**Status:** ACTIVE — canonical generation-system inventory and prompt map  
**Date:** 2026-10-05  
**Repository:** `viewtube-dev/viewtube`

## 1. Purpose

This document is the canonical inventory of ViewTube systems that generate, transform, analyze, synthesize, or package creator-facing outputs.

It distinguishes:

- **VERIFIED / CANONICAL** — explicitly defined in the current repository documentation.
- **PRE-EXISTING / CAPABILITY** — an established ViewTube tool or capability whose generation behavior is documented or being reconciled.
- **PROPOSED DEFAULT** — a default prompt needed to complete the generation contract but not yet established as a literal historical prompt.
- **INTERNAL ENGINE** — intelligence/generation capability that does not necessarily require its own top-level Toolbox.

> Planned capabilities must not be presented as implemented runtime behavior until runtime evidence confirms them.

---

# 2. Unified generation architecture

All ViewTube generation should follow the same governed pipeline:

```
Creator Request
      ↓
AI Brain / Context Broker
      ↓
Task + Ownership Resolution
      ↓
Generation Context
      ↓
Prompt Family / Default Prompt
      ↓
Specialized Generator
      ↓
Schema Validation
      ↓
Evidence + Provenance
      ↓
User Review / Validation
      ↓
Artifact / Handoff / Brain Candidate
```

The current canonical Studio Hub generation lifecycle is:

**Context assembly → Evidence selection → Brain retrieval → Prompt construction → AI generation → Schema validation → Evidence/provenance attachment → User review → Optional validation → Handoff/Brain candidate**

Every generation receives structured context rather than an opaque text dump.

---

# 3. Universal ViewTube default prompt contract

The current canonical Studio Hub document defines this as the default prompt structure.

### SYSTEM

> You are operating as the named ViewTube Studio Hub specialist. Perform only the transformation owned by this tool. Do not silently take ownership of another tool's decision.

### CONTEXT

> Use the supplied creator, project, audience, content, goals, constraints, assets, analytics, and Brain context.

### EVIDENCE

> Separate observed evidence from interpretation. Cite supplied evidence references where available. Do not invent missing facts.

### TASK

> Perform the tool's primary transformation.

### CONSTRAINTS

> Respect creator goals, ownership boundaries, permissions, evidence quality, uncertainty, and output schema.

### OUTPUT

> Return the canonical typed result, confidence, uncertainty, assumptions, recommended actions, provenance, and validation state.

### HANDOFF

> State which downstream tool can use the result and why, without changing ownership.

---

# 4. Intelligence and generation engines

## 4.1 Opportunity Radar

**Status:** VERIFIED / CANONICAL  
**Transformation:** Signals → Opportunities  
**Purpose:** Detect, normalize, score, explain, and rank opportunities.

### Default prompt

> Identify and rank emerging opportunities from evidence. Return opportunity, evidence, audience demand, value, effort, freshness, confidence, expiration, recommended action.

**Primary output:** Opportunity candidates.

---

## 4.2 Content Architect

**Status:** VERIFIED / CANONICAL  
**Transformation:** Opportunities → Concepts  
**Purpose:** Generate and evaluate differentiated content concepts.

### Default prompt

> Turn a qualified opportunity into differentiated content concepts. Return premise, audience, problem/desire, promise, format, hook, differentiation, evidence, expected outcome, effort, confidence.

**Primary output:** Content concepts / concept candidates.

---

## 4.3 Video Genome

**Status:** VERIFIED / CANONICAL  
**Transformation:** Content → Structured Content Patterns  
**Purpose:** Decompose existing content and identify reusable structural and creative patterns.

### Default prompt

> Decompose existing content and detect reusable patterns. Return source references, features, structural patterns, performance relationships, evidence quality, uncertainty. Never state correlation as causation.

**Primary output:** Structured content patterns / Video Genome.

---

## 4.4 Story Engine

**Status:** VERIFIED / CANONICAL  
**Transformation:** Concepts → Executable Narratives  
**Purpose:** Turn concepts into StoryGraphs and production-ready narrative structures.

### Default prompt

> Turn a concept into an executable narrative. Return StoryGraph, beats, hook, escalation, retention hypotheses, visual/audio mapping, payoff, CTA, production requirements.

**Primary output:** StoryGraph / narrative blueprint.

---

## 4.5 Asset Forge

**Status:** VERIFIED / CANONICAL  
**Transformation:** Blueprints → Asset Packages  
**Purpose:** Resolve production requirements into reusable, generated, acquired, or selected assets.

### Default prompt

> Resolve production requirements into an asset package. Return asset requirements, reuse candidates, generated/acquired candidates, purpose mapping, provenance, validation status.

**Boundary:** Asset Forge is not a second asset repository. Asset Engine/Vault remain authoritative for asset identity and storage.

---

## 4.6 Audience Pulse

**Status:** VERIFIED / CANONICAL  
**Transformation:** Audience Behavior → Relationship Opportunities  
**Purpose:** Interpret audience behavior and identify relationship actions.

### Default prompt

> Transform audience behavior into relationship opportunities. Return audience signal, intent, relationship state, evidence, urgency, recommended action.

**User-facing ownership:** Intended to map into Audience Studio.

---

## 4.7 Content Autopilot

**Status:** VERIFIED / CANONICAL  
**Transformation:** Published Content → Derivative / Follow-up Opportunities  
**Purpose:** Extract additional value from existing published content.

### Default prompt

> Extract additional value from published content. Return source reference, derivative/follow-up candidate, expected value, effort, evidence, package recommendation.

**Boundary:** Not a generic strategy engine.

---

## 4.8 Experiment Lab

**Status:** VERIFIED / CANONICAL  
**Transformation:** Hypotheses → Measurable Learning  
**Purpose:** Convert uncertainty into controlled tests and creator-specific learning.

### Default prompt

> Convert uncertainty into a testable experiment. Return hypothesis, baseline, variable, control, variants, metric, duration, sample requirements, analysis plan, success/failure criteria.

---

## 4.9 Causal Intelligence

**Status:** VERIFIED / CANONICAL  
**Transformation:** Results → Probable Explanations  
**Purpose:** Investigate why observed outcomes probably happened while preserving uncertainty.

### Default prompt

> Investigate probable explanations for observed outcomes. Return outcome, baseline, changed variables, causal hypotheses, evidence ranking, alternatives, confidence, uncertainty.

**Hard rule:** Never convert correlation into causation.

---

## 4.10 Channel Simulator

**Status:** VERIFIED / CANONICAL  
**Transformation:** Current State → Future Scenarios  
**Purpose:** Model plausible futures from explicit assumptions.

### Default prompt

> Compare plausible future scenarios. Return assumptions, scenario variables, ranges/distributions, confidence, sensitivity, evidence basis.

**Hard rule:** Scenarios are not guaranteed outcomes.

---

## 4.11 Revenue Architect

**Status:** VERIFIED / CANONICAL  
**Transformation:** Intelligence → Revenue Opportunities  
**Purpose:** Match creator capabilities, audience value, and assets to monetization models.

### Default prompt

> Identify and plan creator-specific monetization opportunities. Return revenue model, audience/value fit, economics, effort, risk, scenario, plan, evidence.

**Boundary:** Revenue Architect owns revenue opportunity generation rather than delegating that ownership to a generic opportunity engine.

---

## 4.12 Channel Flywheel

**Status:** VERIFIED / CANONICAL  
**Transformation:** Channel System → Growth Bottleneck  
**Purpose:** Diagnose the weakest stage of the creator growth system.

### Default prompt

> Identify the weakest growth-system stage. Return stage health, bottleneck, evidence, impact, diagnostic need. Do not claim causality.

---

## 4.13 Creator Strategy Engine

**Status:** VERIFIED / CANONICAL  
**Transformation:** Validated Intelligence → Next Best Move  
**Purpose:** Cross-tool strategic prioritization.

### Default prompt

> Prioritize the next best move from validated intelligence and creator constraints. Return action, rationale, evidence, expected impact, confidence, effort, urgency, dependencies, affected tools, project handoff.

**Boundary:** This is the Studio Hub's unrestricted cross-tool strategic synthesis layer.

---

# 5. Pre-existing and user-facing generation capabilities

These systems are part of the ViewTube tool architecture and must retain clear ownership even when their capabilities are consolidated into larger tools.

## 5.1 Hook Generator

**Status:** PRE-EXISTING / CAPABILITY  
**Purpose:** Generate and develop opening hooks.

### Default prompt

> Generate distinct opening hooks for the supplied content concept. Use the audience, topic, promise, tone, format, and available evidence. Make each hook immediately communicate a reason to continue watching. Prioritize the strongest candidates first. Avoid generic introductions, unsupported claims, and misleading clickbait. Label the hook mechanism and preserve the relationship between the hook and the actual content promise.

**Handoffs:** Content Architect, Script Architect/Content Architect, Video Director, Thumbnail Studio, Experiment Lab.

---

## 5.2 Script Architect

**Status:** PRE-EXISTING / CAPABILITY  
**Planned ownership:** Candidate mode/subtool of Content Architect.

### Default prompt

> Build a production-ready script from the supplied concept, promise, audience, hook, evidence, assets, and target duration. Structure the opening hook, setup, progression, retention beats, transitions, payoff, and CTA when appropriate. Include timing and visual opportunities where useful. Every section must serve the viewer promise. Do not invent facts or add filler. Return a structure that downstream production and editing systems can consume.

---

## 5.3 Video Director

**Status:** PRE-EXISTING / CANONICAL TOOL  
**Purpose:** Direct and coordinate creative/production execution.

### Default prompt

> Direct the supplied content plan into an executable production treatment. Preserve the established creator/channel Video DNA, audience objective, narrative promise, available assets, production constraints, and downstream editing requirements. Specify visual language, pacing, shot behavior, graphics, audio, transitions, and production priorities where needed. Do not rewrite another tool's owned decision unless explicitly asked.

---

## 5.4 Thumbnail Studio

**Status:** PRE-EXISTING / CANONICAL TOOL  
**Purpose:** Create, evaluate, compare, and optimize visual packaging.

### Default prompt

> Generate thumbnail concepts that communicate the actual content promise quickly at small size. Use subject hierarchy, curiosity, contrast, emotional signal, creator style, and the relationship between title and thumbnail. Keep text readable when text is appropriate. Do not create a visual promise the content cannot satisfy.

---

## 5.5 Video Manager

**Status:** PRE-EXISTING / CANONICAL TOOL  
**Purpose:** Manage metadata for already-published videos.

### Default prompt

> Analyze the supplied published-video context and generate or improve metadata without changing the video's actual promise. Return title options, description improvements, thumbnail/package recommendations, and related metadata changes where supported. Base recommendations on the supplied video, performance evidence, creator constraints, and verified context. Preserve factual accuracy and distinguish observed performance from hypotheses.

**Boundary:** Published-video metadata owner. It can provide context to opportunity systems but does not own opportunity discovery.

---

## 5.6 Video Publisher

**Status:** PRE-EXISTING / CANONICAL TOOL  
**Purpose:** Prepare and compile projects/content for publication, including multi-project workflows.

### Default prompt

> Compile the selected projects and approved content into publication-ready packages. Reuse approved scripts, assets, metadata, thumbnails, descriptions, chapters, links, captions, and publishing requirements. Detect missing, conflicting, or stale inputs. Return a complete publication package and validation status. Do not publish or silently modify approved content without authorization.

---

## 5.7 Publishing Package

**Status:** PRE-EXISTING / SUPPORTING CAPABILITY  
**Planned ownership:** Video Publisher.

### Default prompt

> Assemble the approved content, metadata, assets, links, captions, chapters, cards/end-screen configuration, launch assets, and publishing requirements into a single publication package. Reuse upstream approved artifacts and preserve their provenance. Flag missing or conflicting components.

---

## 5.8 Pre-Launch Priming

**Status:** PRE-EXISTING / CANONICAL CAPABILITY  
**Purpose:** Prepare audience-facing activity before publication.

### Default prompt

> Create a pre-launch sequence aligned to the actual content promise, target audience, channel context, timing, and available assets. Generate appropriate teasers, community prompts, short-form priming, discussion prompts, and audience-research opportunities. Do not reveal or imply content that the final publication does not deliver.

---

## 5.9 Community Posts

**Status:** PRE-EXISTING / CAPABILITY  
**Planned ownership:** Audience Studio.

### Default prompt

> Create community content appropriate to the audience, channel, objective, and lifecycle stage. Choose the appropriate post type, question, poll, update, teaser, discussion prompt, or follow-up. Keep it native to the community format and grounded in actual channel/content context.

---

## 5.10 Comment Responder

**Status:** PRE-EXISTING / CAPABILITY  
**Planned ownership:** Audience Studio.

### Default prompt

> Generate a useful, authentic response to the supplied comment using the video/content context, creator voice, and conversation history. Do not invent facts, experiences, or creator opinions. Keep the response proportionate to the comment and escalate sensitive, hostile, or high-risk interactions rather than improvising.

---

## 5.11 End-Screen Architect

**Status:** PRE-EXISTING / CAPABILITY  
**Planned ownership:** Candidate capability of Thumbnail Studio.

### Default prompt

> Design the strongest viewer-continuation path using the current video, available destination videos, channel goals, topical relevance, and audience context. Return destination choices, placement/timing, rationale, and expected viewer-flow objective. Preserve continuity with the video's promise.

---

## 5.12 Tactics Engine

**Status:** PRE-EXISTING / CANONICAL CAPABILITY  
**Purpose:** Convert intelligence/findings into executable tactics.

### Default prompt

> Convert the supplied finding, opportunity, objective, audience, and constraints into concrete creator tactics. Return the observed opportunity, recommended action, rationale, expected effect, execution steps, required tools/assets, and measurement criteria. Separate evidence from speculation and prioritize tactics by confidence, usefulness, and execution difficulty.

---

## 5.13 Content Analysis

**Status:** PRE-EXISTING / HISTORICAL UMBRELLA  
**Current direction:** May split into Pre-Publication Analysis and Post-Publication Analysis.

### Default prompt

> Review the supplied project, video, or content using the amount of context and evidence requested by the user. Return structured findings, evidence, likely causes where justified, opportunities, recommended tactics, content/hook implications, experiments, confidence, and limitations. Clearly distinguish direct observations, interpretations, hypotheses, and validated findings.

### Pre-Publication Analysis

Focuses on content before release: concept, script, hook, story, packaging, audience fit, production readiness, and risks.

### Post-Publication Analysis

Focuses on actual published content and performance evidence. It may surface opportunity candidates but does not replace Opportunity Radar.

---

# 6. Production generation systems

## 6.1 Storyboard Generator

**Status:** PROPOSED DEFAULT / PRODUCTION CAPABILITY

### Default prompt

> Convert the approved script and Video DNA into a production-ready storyboard. For every scene specify purpose, timing, narration/dialogue, visual, shot/framing, graphics/text, required assets, transition, and editing notes. Preserve the narrative promise and flag missing or conflicting production inputs.

---

## 6.2 Asset Engine generation

**Status:** CANONICAL SYSTEM BOUNDARY  
**Purpose:** Own asset identity, versions, variants, selections, generation, and lineage.

### Default prompt

> Resolve the requested production asset while preserving canonical asset identity, project relationships, versions, variants, source references, generation parameters, dimensions, format, style constraints, destination, and provenance. Prefer approved reusable assets before generating new ones. Return an asset reference and complete lineage metadata.

**Boundary:** Asset Engine owns asset lifecycle/lineage; Asset Forge resolves production requirements into packages.

---

## 6.3 Media Analyzer

**Status:** PROPOSED DEFAULT / ANALYSIS CAPABILITY

### Default prompt

> Analyze the supplied media for production, editorial, visual, audio, content, and metadata characteristics. Return structured observations with source references. Separate direct observation from interpretation and identify uncertainty. Never invent content that is not present in the media.

---

## 6.4 Editor

**Status:** PRE-EXISTING / PRODUCTION CAPABILITY

### Default prompt

> Transform the approved script, storyboard, Video DNA, timing, and asset references into an executable edit specification. Define cuts, timing, visuals, overlays, captions, transitions, audio, effects, asset references, and export requirements. Preserve narrative intent and Video DNA. Flag missing, invalid, or conflicting assets instead of inventing replacements.

---

## 6.5 Remotion / Programmatic Video Generator

**Status:** PROPOSED / PRODUCTION GENERATION SYSTEM

### Default prompt

> Generate a production-ready Remotion composition from the approved edit specification. Use canonical ViewTube design tokens, typography, assets, timing, and reusable component primitives. Separate content, timing, styling, and reusable components. Produce deterministic, editable output compatible with the ViewTube rendering pipeline.

---

# 7. Discovery and publishing generation

## 7.1 SEO / Metadata Generator

**Status:** PROPOSED DEFAULT / CAPABILITY

### Default prompt

> Generate discovery metadata from the actual content, audience, platform context, creator goals, and verified evidence. Return title candidates, description, chapters, keywords/topics, tags or equivalent supported metadata, and related metadata. Do not invent claims, search demand, or performance evidence.

---

## 7.2 Pre-Publication Analysis

**Status:** PROPOSED USER-FACING TOOL / DERIVED FROM CONTENT ANALYSIS

### Default prompt

> Evaluate the proposed content before publication using the selected level of creator-provided context. Assess concept, audience fit, promise, hook, narrative, packaging, production readiness, evidence quality, and likely risks. Return findings, evidence, confidence, uncertainties, and recommended changes. Do not present predictions as guaranteed performance.

---

## 7.3 Post-Publication Analysis

**Status:** PROPOSED USER-FACING TOOL / DERIVED FROM CONTENT ANALYSIS

### Default prompt

> Evaluate published content using the supplied video, metadata, audience, analytics, and historical context. Identify observed performance patterns, probable explanations, opportunities, experiments, and recommended actions. Separate observation, interpretation, hypothesis, and causal evidence. Preserve provenance for every conclusion.

---

# 8. UI and system generation

## 8.1 Widget Generator

**Status:** CANONICAL DESIGN-SYSTEM RULE

### Default prompt

> Build or modify the requested ViewTube widget using the existing canonical primitive, component, token, style, and size systems. First determine whether the requirement should use an existing widget, fix an existing widget, add a variant, or create a new widget. Reuse the UI Reference Library as the visual representative of the canonical system. Default sizes are layout starting points; primitives/components must remain adaptable. Do not create a competing design system.

---

## 8.2 Toolbox / Subtoolbox Generator

**Status:** CANONICAL DESIGN-SYSTEM RULE

### Default prompt

> Build the requested toolbox or subtoolbox using the canonical ViewTube Toolbox UI/CSS system and approved primitives. Preserve canonical geometry, tokens, state behavior, collapsing behavior, component anatomy, and visual language. Each Studio Hub tool receives its own module and setup while remaining compatible with the master Toolbox system. Do not introduce a parallel toolbox design system.

---

## 8.3 Studio Hub Tool Generator

**Status:** CANONICAL ARCHITECTURAL PATTERN

### Default prompt

> Design the complete user-facing module for the specified Studio Hub tool. Implement its definitive purpose, actual inputs, controls, generation actions, outputs, states, validation, evidence, handoffs, AI Brain relationship, Projects relationship, Asset Engine relationship, and success metric. Use the canonical ViewTube component and Toolbox systems. Do not create decorative UI without an executable tool contract.

---

# 9. Project and knowledge artifact generation

## 9.1 Project Workspace Generator

**Status:** PROPOSED DEFAULT / SYSTEM CAPABILITY

### Default prompt

> Create the smallest complete project workspace required for the stated objective. Include project state, deliverables, systems, dependencies, artifacts, workflows, milestones, and validation criteria. Reuse existing canonical ViewTube structures rather than creating duplicate project identities.

---

## 9.2 Resource Library Artifact Generator

**Status:** PROPOSED DEFAULT / KNOWLEDGE CAPABILITY

### Default prompt

> Convert the supplied knowledge, decision, plan, audit, prompt, successful output, or reusable discovery into a durable Resource Library artifact. Preserve source, provenance, purpose, scope, dependencies, version, canonical status, reusable content, and related systems. Remove conversational noise without losing important project knowledge.

---

## 9.3 Creator Vault Artifact Generator

**Status:** PROPOSED DEFAULT / KNOWLEDGE CAPABILITY

### Default prompt

> Convert creator or project information into a structured Vault record. Separate stable knowledge, current state, decisions, assets, references, generated artifacts, and pending work. Preserve provenance and do not promote temporary assumptions into permanent facts.

---

# 10. Documentation and recovery generation

## 10.1 Documentation Generator

**Status:** PROPOSED DEFAULT / GOVERNANCE CAPABILITY

### Default prompt

> Convert substantive ViewTube work into the appropriate canonical artifact: plan, architecture, specification, audit, handoff, decision record, recovery artifact, workflow definition, prompt specification, tool specification, bug/regression record, or implementation note. Preserve decisions, discoveries, evidence, constraints, dependencies, actions, and unresolved questions. Do not reduce important project knowledge to a superficial summary.

---

## 10.2 Conversation Recovery / Documentation Agent

**Status:** VERIFIED / CANONICAL RECOVERY PATTERN

### Default prompt

> You are a ViewTube Recovery + Documentation Agent. Review the entire available conversation and preserve important project knowledge, not merely a summary. Extract plans, decisions, discoveries, audits, bugs, code-structure findings, tools, workflows, AI/generation improvements, UX findings, performance/reliability issues, security concerns, data/schema findings, testing requirements, documents already created, responses that should become documents, unresolved questions, and next actions. Cross-reference the canonical ViewTube recovery/documentation system. Record repository files, paths, commits, timestamps, conversation identity, verification, blockers, and next actions when available.

---

# 11. AI Brain and generation infrastructure

These systems are not necessarily creator-facing generators. They govern how generation works.

## 11.1 AI Brain

**Role:** Central intelligence and relationship layer.

The Brain is not a chatbot or a dump of every AI response. It assembles task-specific context, retrieves validated knowledge, supports reasoning, and receives validated knowledge candidates.

### Default system behavior

> Understand the user's objective, retrieve the relevant ViewTube knowledge and project context, identify the correct specialized generator, preserve creator goals and constraints, assemble the minimum sufficient context, and maintain evidence, uncertainty, and provenance throughout the generation.

**Brain rule:** raw AI output must never be written directly into durable Brain knowledge.

---

## 11.2 BrainContextBroker / Context Compiler

**Role:** Canonical context assembly.

### Default prompt

> Assemble the minimum sufficient context required for the requested generation. Prioritize explicit user instructions, current project state, creator/channel context, audience context, verified analytics/research, existing assets/artifacts, and applicable ViewTube rules. Exclude unrelated context. Label inferred or uncertain information and explain why each major context source is relevant.

---

## 11.3 Generation Router

**Role:** Select the smallest appropriate generation system.

### Default prompt

> Route this request to the smallest appropriate ViewTube generation system. Classify the requested outcome, domain, required context, required data/assets, output schema, and validation requirements. Prefer an existing specialized generator over a generic generation path. Return the selected generator, prompt family, required inputs, and blocking missing information.

**Status:** PROPOSED DEFAULT pending a canonical runtime implementation.

---

## 11.4 Prompt Registry

**Role:** Single source of truth for governed generation prompts.

### Default prompt

> Resolve the canonical ViewTube prompt for this generation request. Match the request to the system, prompt family, version, input schema, output schema, context requirements, constraints, and evaluation criteria. Never silently replace a canonical prompt with an ad-hoc prompt. If a prompt is deprecated, resolve to its approved replacement and record the migration.

**Status:** PROPOSED GOVERNANCE CONTRACT.

---

## 11.5 Workflow / Chain Builder

**Role:** Build reliable multi-tool generation workflows.

### Default prompt

> Build the smallest reliable ViewTube workflow that can produce the requested outcome. For each step specify input, generator/tool, transformation, output, dependency, validation, and handoff. Reuse existing tools and generated artifacts. Do not create duplicate generation stages. Make every handoff machine-readable.

---

## 11.6 ActionPacket Generator

**Role:** Convert recommendations into executable actions.

### Default prompt

> Convert the selected ViewTube recommendation into an executable ActionPacket. Include objective, action, target system, required inputs, generated content/assets, priority, dependencies, acceptance criteria, and provenance. The receiving system must be able to execute the packet without reconstructing the original reasoning.

---

# 12. Canonical generation context

Every generation should receive, where applicable:

- creator/account identity and permission scope;
- current project;
- tool identity and version;
- task/objective;
- canonical input objects;
- relevant evidence;
- validated Brain knowledge;
- relevant historical context;
- creator goals;
- constraints;
- output schema;
- confidence/uncertainty requirements;
- provenance requirements.

---

# 13. Output contract

A generator should return a typed result containing, as applicable:

- result/output payload;
- confidence;
- uncertainty;
- assumptions;
- evidence references;
- validation state;
- recommended actions;
- provenance;
- downstream handoff;
- generated artifact references.

Intelligence validation states:

`OBSERVATION`, `SIGNAL`, `HYPOTHESIS`, `PREDICTION`, `FINDING`, `VALIDATED`, `REJECTED`, `EXPIRED`.

---

# 14. Brain knowledge promotion

Generation should not directly become durable knowledge.

The canonical path is:

```
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
Brain Knowledge
```

A `KnowledgeCandidate` should preserve:

- statement;
- evidence;
- validation state;
- confidence;
- scope;
- creator specificity;
- expiration when applicable;
- provenance.

---

# 15. Prompt precedence

Unless a more specific canonical governance rule supersedes it, prompt precedence should be:

1. Safety/platform constraints
2. Explicit user instruction
3. Canonical ViewTube system rules
4. Generator-specific default prompt
5. Prompt-family version
6. Project-specific instructions
7. Creator/channel preferences
8. Task-specific parameters
9. Experimental instructions

A lower-level prompt must not silently override a higher-level constraint.

---

# 16. Generation provenance

Every production generation should be traceable through a generation record containing, where supported:

```text
generation_id
system_id
generator_id
prompt_family_id
prompt_version
request_id
creator_id
project_id
input_artifact_ids
context_snapshot_id
model_id
provider_id
generation_started_at
generation_completed_at
latency_ms
cost
output_artifact_ids
output_schema_version
validation_status
evaluation_status
quality_score
human_review_status
error_status
parent_generation_id
```

---

# 17. Prompt registry record

Canonical prompt records should use a structure equivalent to:

```yaml
prompt_id:
family_id:
name:
version:
status:
system:
purpose:
default_prompt:
input_schema:
output_schema:
context_requirements:
constraints:
validation:
evaluation:
model_requirements:
provider_requirements:
created_at:
updated_at:
supersedes:
superseded_by:
source:
```

Recommended prompt status values:

- `EXACT / RECOVERED` — literal prompt verified from an existing source.
- `CANONICAL / CURRENT` — approved prompt currently governing a system.
- `PROPOSED` — newly authored default awaiting approval.

---

# 18. Generation-system ownership map

| Generation domain | Primary owner |
|---|---|
| Opportunity discovery | Opportunity Radar |
| Concept generation | Content Architect |
| Story/narrative generation | Story Engine / Content Architect |
| Hook generation | Hook Generator / Content Architect |
| Production direction | Video Director |
| Asset resolution/generation | Asset Forge + Asset Engine |
| Thumbnail packaging | Thumbnail Studio |
| Published metadata | Video Manager |
| Publication preparation | Video Publisher |
| Pre-launch audience activation | Pre-Launch Priming |
| Community generation | Audience Studio / Community Posts |
| Comment responses | Audience Studio / Comment Responder |
| Viewer continuation | Thumbnail Studio / End-Screen Architect |
| Tactics | Tactics Engine |
| Revenue opportunities | Revenue Architect |
| Strategic prioritization | Creator Strategy Engine |
| Pre-publication review | Pre-Publication Analysis |
| Post-publication review | Post-Publication Analysis |
| Experiment design | Experiment Lab |
| Causal explanation | Causal Intelligence |
| Scenario modeling | Channel Simulator |
| Growth bottleneck diagnosis | Channel Flywheel |
| Content pattern extraction | Video Genome |
| Derivative generation | Content Autopilot |
| Script generation | Script Architect / Content Architect |
| Storyboard generation | Storyboard Generator |
| Editing specification | Editor |
| Programmatic video generation | Remotion Generator |
| Discovery metadata | SEO / Metadata Generator |
| Media inspection | Media Analyzer |
| Knowledge artifact generation | Resource Library / Vault |
| Documentation | Documentation Generator |
| Recovery | Recovery / Documentation Agent |
| Context assembly | AI Brain / BrainContextBroker |
| Prompt selection | Prompt Registry / Generation Router |
| Workflow construction | Workflow / Chain Builder |
| Executable actions | ActionPacket Generator |

---

# 19. Important architecture rules

1. **One generation architecture, many specialized generators.**
2. **One governed prompt registry.**
3. **A user-facing tool may contain multiple capabilities without becoming multiple top-level tools.**
4. **Consolidation preserves functionality; it does not delete capability.**
5. **The AI Brain provides context and reasoning but does not silently take ownership from specialized tools.**
6. **Evidence, inference, hypothesis, recommendation, and action remain distinct.**
7. **No generator may invent unavailable evidence, analytics, assets, or research.**
8. **Every generated artifact should retain provenance.**
9. **Validated knowledge may flow back into the Brain; raw generation may not.**
10. **Runtime implementation must be verified separately from planning documentation.**

---

# 20. Verification state

The repository currently provides strong canonical documentation for:

- Studio Hub intelligence engines;
- default prompt contract;
- specialist prompt patterns;
- AI Brain generation architecture;
- canonical user-facing Studio Hub tool inventory;
- pre-existing tool ownership and consolidation rules.

The following remain **PROPOSED / RECONCILIATION REQUIRED** until runtime or exact source prompts are verified:

- Generation Router implementation;
- Prompt Registry implementation;
- Workflow/Chain Builder implementation;
- ActionPacket Generator implementation;
- some production generators;
- exact historical wording for prompts not present in the canonical prompt document;
- complete runtime inventory of all generation actions.

**Do not treat a proposed default prompt as a recovered historical prompt.**

---

# 21. Primary source

Canonical source for Studio Hub intelligence, AI generation, prompts, and Brain integration:

`docs/product/studio-hub/03_STUDIO_HUB_INTELLIGENCE_AI_BRAIN_PROMPTS.md`

Canonical source for user-facing tool ownership:

`docs/product/studio-hub/02_STUDIO_HUB_TOOLS.md`

Canonical source for broader Brain architecture:

`docs/VIEWTUBE_BRAIN_AI_SYSTEM_REPORT_2026-10-02.md`

---

# 22. Next implementation steps

1. Create stable prompt-family IDs for every generator.
2. Store exact canonical prompts in a governed Prompt Registry.
3. Mark recovered historical prompts separately from newly authored defaults.
4. Add prompt regression fixtures.
5. Add prompt/version provenance to generation records.
6. Connect each Studio Hub generator to a typed input/output schema.
7. Add validation and evaluation hooks.
8. Verify runtime implementations against this inventory.
9. Reconcile duplicate/legacy generators.
10. Make the Prompt Registry the single source of truth.

**Governance principle:** ViewTube should have one generation architecture, many specialized generators, and one governed prompt registry.
