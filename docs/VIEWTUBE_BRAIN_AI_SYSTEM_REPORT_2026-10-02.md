# ViewTube Brain & AI System Report

**Repository:** `cbrewsterthegreat/ViewTube`  
**Assessment date:** October 2, 2026

## Executive summary

ViewTube has the beginnings of a layered creator-intelligence system rather than a simple chatbot.

The intended architecture is:

```text
                    VIEWTUBE BRAIN / AI
                           │
             ┌─────────────┴─────────────┐
             │                           │
      Creator Question              Creator Context
             │                           │
             ▼                           ▼
       Task / Intent              Channel Evidence
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  Knowledge Orchestration
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
 Resource Library       Analytics            Research
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                  BrainContextBroker
                           │
                           ▼
                      Brain Runtime
                           │
                           ▼
                      Model Gateway
                           │
                           ▼
                  Creator-facing answer
```

The Resource Library is now intended to be application/runtime content under `src/features/resource-library/resources/`, rather than a `docs/` runtime dependency.

The system has advanced from simple document storage toward:

**source → candidate extraction → approval/context classification → compilation → bounded retrieval → task-aware retrieval → Brain context → response reasoning.**

## Current system components

### Brain runtime

Core conceptual components include:

- `BrainOrchestrator`
- `BrainContextBroker`
- Brain runtime/context structures
- Resource Knowledge retrieval
- creator context
- analytics/evidence context
- research context
- model gateway / response generation

The Brain should explicitly distinguish:

- **Knowledge:** Resource Library, principles, definitions, playbooks
- **Evidence:** creator analytics, channel/video/audience data
- **Research:** current public/platform information
- **Context:** creator goals, projects, preferences, constraints
- **System:** capabilities, permissions, tools, freshness

### Resource Library

There are 15 canonical Resource Library resources.

The extraction corpus previously produced:

| Classification | Count |
|---|---:|
| Approved | 118 |
| Contextual | 1 |
| Rejected | 1 |
| Total | 120 |

Pipeline:

```text
15 resources
   ↓
candidate extraction
   ↓
candidate classification
   ↓
approval / contextual qualification
   ↓
compiled knowledge index
   ↓
bounded retrieval
   ↓
task-aware retrieval
   ↓
Brain
```

Runtime resources belong under:

`src/features/resource-library/resources/`

rather than:

`docs/resources/library/`

Recent Vercel failures demonstrated why this boundary matters. A second failure exposed a Brain runtime dependency on `docs/brain/RESOURCE_KNOWLEDGE_EXTRACTION_FULL_CANDIDATE_BANK.md`; the Brain retrieval layer was changed so it no longer depends on that documentation file at runtime.

### Resource Knowledge extraction

The extraction system identifies useful:

- quotes
- phrases
- sentences
- principles
- definitions
- diagnostic frameworks
- practical guidance
- contextual statements

Pipeline:

```text
Resource
   ↓
candidate extraction
   ↓
candidate classification
   ├── approved
   ├── contextual
   └── rejected
   ↓
normalization
   ↓
validation
   ↓
runtime index
```

### Task-aware retrieval

The intended flow is:

```text
question
   ↓
task / intent
   ↓
question + task signals
   ↓
resource retrieval
   ↓
ranking
   ↓
diversification
   ↓
bounded context
```

Potential tasks include analytics diagnosis, packaging, retention, publishing, discovery, audience development, monetization, content strategy, and format selection.

### Knowledge-use policy

**Resource Library:** principles, definitions, frameworks, general explanations, source-grounded recommendations.

**Current analytics:** channel-specific observations, current video performance, audience behavior, current trends in the creator's own data.

**Research:** current external facts, current platform information, current public information.

The Brain must not turn a static Resource Library statement into a claim about the creator's current channel without evidence.

## Golden QA

A 10-question golden QA set was created around:

- revenue versus views
- CTR interpretation
- Shorts versus long-form
- weak-video diagnosis
- analytics beyond views
- thumbnail/packaging
- retention
- publishing
- recommendations
- channel diagnostics

Next step: convert these into automated runtime tests.

## Analytics integration

Analytics should answer:

> What is happening?

Resource Knowledge should answer:

> How should I interpret this?

Research should answer:

> What has changed externally?

Target reasoning:

```text
Observation
    +
Interpretation
    +
Context
    +
Current external information
    =
Actionable answer
```

Brain should consume a canonical evidence contract rather than individual dashboard implementations.

## YouTube integration

The Brain ultimately needs a coherent YouTube integration covering:

- channel
- videos
- Shorts
- views
- watch time
- retention
- CTR
- impressions
- traffic sources
- audience
- revenue
- publishing history
- metadata
- content/topic relationships

Target:

```text
YouTube APIs / synced data
          ↓
canonical data layer
          ↓
analytics/evidence contracts
          ↓
Brain evidence adapter
          ↓
BrainContextBroker
```

## Research integration

Research should remain a separate evidence class from Resource Library knowledge.

```text
Question
 ↓
Can Resource Library answer it?
 ├─ yes → use knowledge
 └─ no
      ↓
Does current information matter?
 ├─ yes → research
 └─ no → answer from available knowledge
```

## Creator context

Creator context should include:

- goals
- current project
- channel strategy
- audience
- content formats
- active experiments
- preferences
- constraints
- historical decisions

It should be structured, scoped, freshness-aware, permission-aware, task-relevant, and bounded.

## BrainContextBroker

The Broker should become the central convergence point:

```text
                    BrainContextBroker
                           │
       ┌──────────┬────────┼────────┬──────────┐
       ▼          ▼        ▼        ▼          ▼
    Creator    Analytics  Resource Research   System
    Context    Evidence   Knowledge           State
       │          │        │        │          │
       └──────────┴────────┴────────┴──────────┘
                           │
                     Context budget
                           │
                     Evidence ranking
                           │
                       Provenance
                           │
                         Brain
```

This is one of the most important architectural seams in the AI system.

## Model gateway

The model layer should remain behind a stable abstraction.

It should handle:

- model selection
- token/context limits
- system instructions
- tool invocation
- structured output
- retries
- errors
- telemetry

## Tools and action system

The future Brain should support:

```text
observe
→ diagnose
→ research
→ recommend
→ propose action
→ request confirmation
→ execute
→ verify
```

Potential domains:

- content planning
- video analysis
- asset inspection
- publishing preparation
- thumbnail analysis
- title analysis
- research
- project management
- resource creation
- dashboard configuration
- workflow automation

Consequential actions should remain explicitly controlled.

## Resource Library ↔ Brain

Already established:

```text
Resource Library
      ↓
knowledge extraction
      ↓
approval
      ↓
compiled knowledge
      ↓
retrieval
      ↓
task-aware ranking
      ↓
Brain
```

Still needed:

- concept clustering
- related knowledge retrieval
- semantic relationships
- source confidence
- freshness metadata
- source versioning
- contradiction detection
- provenance
- citation-ready response metadata
- usage telemetry

## Concept-level knowledge

Move beyond individual quotes.

Example:

```text
CTR
├── impressions
├── audience expansion
├── packaging
├── traffic source
├── returning viewers
└── format context
```

A CTR question should retrieve the concept neighborhood rather than unrelated sentences containing “CTR.”

## Knowledge graph direction

Future graph:

```text
Concept
   │
   ├── Resource
   ├── Definition
   ├── Metric
   ├── Diagnostic
   ├── Evidence
   ├── Tool
   └── Action
```

Example:

```text
Thumbnail
 ├─ affects → packaging
 ├─ relates → CTR
 ├─ requires → impressions context
 ├─ analyzed by → thumbnail tool
 ├─ informed by → Resource Library
 └─ validated by → channel evidence
```

## Current bugs / technical debt

### Runtime `docs/` dependencies

The immediate production problem was runtime imports from `docs/`. The main build has been repaired so Resource Library and Brain runtime dependencies point toward `src`.

Documentation and test fixtures may still contain historical paths; those should be normalized when they represent current architecture.

### Documentation/runtime boundary

Add CI that rejects runtime imports of `docs/` for application resources.

### Duplicate source-of-truth risk

Explicitly label artifacts as:

```text
SOURCE
GENERATED
RUNTIME
TEST FIXTURE
DOCUMENTATION
HISTORICAL
```

### Test fixtures

Brain tests using historical resource paths should use canonical runtime sources unless intentionally testing migration behavior.

## Integration gaps

| System | Brain relationship | Current need |
|---|---|---|
| Resource Library | Knowledge | Deepen semantic retrieval |
| YouTube analytics | Evidence | Canonical evidence adapter |
| YouTube channel data | Evidence | Normalize into Brain contracts |
| Research | Current external knowledge | Research escalation |
| Creator context | Work context | Structured bounded context |
| Model gateway | Reasoning | Stable abstraction |
| Tool system | Actions | Tool discovery + execution |
| Asset system | Content intelligence | Connect metadata/lineage |
| Projects | Workflow | Connect active project context |
| Dashboard | Visualization | Consume Brain results |
| Toolbox | Tools | Shared capabilities |
| Conversation OS | Orchestration | Cross-conversation continuity |
| Resource extraction | Knowledge ingestion | Productionize |
| Knowledge index | Retrieval | Add concept/relationship layer |

## Dashboard and Toolbox

The Brain should remain above the UI:

```text
Brain / AI services
        │
        ├── Dashboard consumes insights
        ├── Toolbox exposes actions
        ├── Resource Library exposes knowledge
        └── Chatbot provides conversation
```

Avoid separate Brain logic inside Dashboard, Toolbox, and Chatbot.

## Conversation OS

The Conversation OS should eventually retain:

```text
project
goal
task
decisions
constraints
evidence
research
resources used
actions taken
open questions
next steps
```

This provides durable task continuity.

## Asset intelligence

Future Brain input:

```text
Video
 ├── thumbnail
 ├── title
 ├── description
 ├── transcript
 ├── media metadata
 ├── provenance
 ├── rights
 └── derivatives
```

This enables combined reasoning over assets, visual analysis, channel analytics, and Resource Knowledge.

## AI response architecture

```text
USER
 │
 ▼
Intent / Task
 │
 ▼
Evidence requirements
 │
 ├───────────────┐
 ▼               ▼
Knowledge       Current Evidence
 │               │
 └───────┬───────┘
         ▼
       Research?
         │
         ▼
     Context Broker
         │
         ▼
     Reasoning Model
         │
         ▼
  Evidence-grounded answer
         │
         ├── explanation
         ├── evidence
         ├── uncertainty
         ├── recommendations
         └── actions
```

## Future roadmap

### Phase 1 — Stabilize

- eliminate runtime `docs/` dependencies
- canonicalize Resource paths
- verify Vercel
- normalize tests
- add stale-path CI guard
- stabilize BrainContextBroker
- verify Resource retrieval

### Phase 2 — Knowledge intelligence

- concept extraction
- concept clustering
- related-resource retrieval
- semantic ranking
- provenance
- source confidence
- freshness
- contradiction detection

### Phase 3 — Evidence intelligence

- canonical analytics contracts
- video evidence
- channel evidence
- audience evidence
- cross-video comparison
- anomaly detection
- evidence freshness

### Phase 4 — Research intelligence

- research escalation
- source evaluation
- currentness
- external evidence synthesis
- research provenance

### Phase 5 — Agentic Brain

```text
question
→ understand
→ gather
→ reason
→ plan
→ ask permission
→ execute
→ verify
→ record
```

### Phase 6 — Creator operating system

```text
Creator
  ↓
Conversation
  ↓
Brain
  ├── Knowledge
  ├── Analytics
  ├── Research
  ├── Projects
  ├── Assets
  ├── Tools
  ├── Dashboard
  └── Automation
```

## Systems to optimize first

1. **BrainContextBroker** — canonical context assembly.
2. **Resource Knowledge pipeline** — concept-aware knowledge.
3. **Analytics evidence contract** — reliable current channel evidence.
4. **Model gateway** — stable, observable abstraction.
5. **Tool/action layer** — connect reasoning to capabilities.
6. **Conversation OS** — durable task/project continuity.
7. **Research layer** — current-information escalation.
8. **Asset intelligence** — media, metadata, thumbnails, transcripts, provenance.
9. **Dashboard/Toolbox integration** — stable service contracts.

## Current-state assessment

| Area | State |
|---|---|
| Brain orchestration | Implemented / expanding |
| BrainContextBroker | Core architecture present |
| Resource Library | Implemented |
| Resource extraction | Implemented |
| Resource approval model | Implemented |
| Resource retrieval | Implemented / expanding |
| Task-aware retrieval | Implemented / expanding |
| Knowledge-use policy | Implemented conceptually |
| Golden QA | Defined |
| Analytics integration | Partial |
| Current research integration | Partial |
| Creator context | Partial |
| Tool execution | Needs deeper integration |
| Conversation continuity | Needs integration |
| Asset intelligence | Needs integration |
| Concept graph | Future |
| Contradiction detection | Future |
| Knowledge freshness | Needs implementation |
| Provenance | Partial / expanding |
| Runtime resource architecture | Recently corrected |
| Production build | Latest Vercel check reported successful |
| CI enforcement of resource paths | Needed |

## Recommended master architecture

```text
                         VIEWTUBE AI
                              │
                       ┌──────┴──────┐
                       │    BRAIN    │
                       └──────┬──────┘
                              │
                  ┌───────────┼───────────┐
                  │           │           │
             KNOWLEDGE     EVIDENCE    RESEARCH
                  │           │           │
           Resource Lib    Analytics    Web/current
                  │           │           │
                  └───────────┼───────────┘
                              │
                       CONTEXT BROKER
                              │
                    ┌─────────┴─────────┐
                    │                   │
                MODEL GATEWAY       TOOL SYSTEM
                    │                   │
                    └─────────┬─────────┘
                              │
                       CREATOR WORKFLOW
                              │
          ┌───────────┬───────┼────────┬───────────┐
          ▼           ▼       ▼        ▼           ▼
      Chatbot     Dashboard Toolbox  Projects    Assets
```

## Bottom line

ViewTube's Brain is not starting from scratch. The foundational pieces are already present: Brain orchestration, context brokering, a 15-resource knowledge base, a 120-candidate extraction corpus, approval classifications, bounded retrieval, task-aware retrieval, and a developing knowledge-use policy.

The biggest opportunity now is integration and consolidation: make Resource Knowledge, analytics evidence, research, creator context, assets, tools, projects, and conversations feed one governed Brain rather than evolving as separate systems.

The recent Vercel failures established an important architectural rule:

**runtime AI knowledge belongs under `src`; `docs` remains documentation.**

The next major stage is connecting and hardening the existing intelligence subsystems into one coherent ViewTube Brain.

# V2 Architecture Expansion — Unified Creator Intelligence

**Added:** October 2, 2026  
**Purpose:** Establish the Brain as the governed intelligence layer that can understand the creator, channel, audience, content, assets, analytics, projects, goals, resources, research, decisions, and system capabilities as one interconnected system.

## 27. Core architectural principle

The Brain is not merely a chatbot or document retrieval layer.

It is the **central intelligence and relationship layer** for ViewTube.

Every relevant subsystem must be:

1. organized into a canonical information model;
2. available to the Brain through a digestible contract;
3. attributable to an authoritative source;
4. freshness-aware;
5. provenance-aware;
6. confidence-aware;
7. connected to related entities;
8. usable as evidence or context;
9. capable of informing other domains through Brain-mediated reasoning.

The underlying systems remain authoritative for their own data. The Brain should synthesize relationships and reasoning without becoming an uncontrolled duplicate of every database.

## 28. Unified Creator Intelligence Model

The Brain should understand these first-class domains:

| Domain | What the Brain should understand |
|---|---|
| Creator | identity, preferences, experience, working style |
| Goals | objectives, priorities, success criteria |
| Channel | positioning, niche, history, configuration |
| Audience | demographics, interests, behavior, segments |
| Content | topics, formats, series, concepts |
| Videos | metadata, performance, transcripts, relationships |
| Shorts | format-specific content and performance |
| Assets | thumbnails, images, video, audio, metadata |
| Analytics | metrics, trends, anomalies, comparisons |
| Revenue | monetization and revenue evidence |
| Projects | active and historical work |
| Resources | curated knowledge and source material |
| Research | current external knowledge |
| Concepts | principles, definitions, relationships |
| Experiments | hypotheses, changes, results |
| Decisions | decisions and their reasoning |
| Conversations | questions, conclusions, unresolved issues |
| Tools | available capabilities |
| Actions | proposed and completed actions |
| History | changes over time |
| System State | capabilities, permissions, freshness, availability |

## 29. The Brain Knowledge Contract

Every source exposed to the Brain should be able to describe:

```text
WHAT is this?
WHO does it belong to?
WHEN was it true?
WHERE did it come from?
WHO owns the source of truth?
HOW reliable is it?
HOW FRESH is it?
WHAT does it relate to?
WHAT does it contradict?
WHAT does it imply?
WHAT decisions can it inform?
WHAT actions can it enable?
```

Minimum metadata should include:

```text
entity_id
entity_type
source_system
source_record_id
source_authority
observed_at
effective_at
expires_at / freshness_window
confidence
provenance
relationships
status
permissions
```

## 30. Source-of-truth architecture

The Brain should not replace domain ownership.

```text
                 BRAIN INTELLIGENCE LAYER
                         │
          ┌───────────────┼────────────────┐
          │               │                │
      KNOWLEDGE        EVIDENCE          CONTEXT
          │               │                │
 Resource Library     Analytics         Creator
 Research             YouTube           Goals
 Concepts              Videos            Projects
          │               │                │
          └───────────────┼────────────────┘
                          │
                    RELATIONSHIP LAYER
                          │
                        REASONING
                          │
                   decisions / actions
```

Each subsystem remains authoritative for its own records while the Brain owns:

- context assembly;
- cross-domain relationships;
- retrieval;
- synthesis;
- reasoning;
- decision support;
- action planning;
- feedback recording.

## 31. Bidirectional intelligence

The architecture must support more than:

```text
System → Brain
```

It should support:

```text
System
   ↕
Brain Knowledge / Relationship Layer
   ↕
Other Systems
```

Examples:

```text
Analytics ←→ Brain ←→ Resource Library
    ↕           ↕             ↕
 Audience ←→ Content ←→ Research
    ↕           ↕             ↕
 Videos   ←→ Projects ←→ Goals
    ↕           ↕             ↕
 Assets   ←→ Experiments ←→ Decisions
```

The Brain can therefore discover relationships such as:

```text
Low revenue
  ↓
Which videos?
  ↓
Which audiences?
  ↓
Which traffic sources?
  ↓
Which topics?
  ↓
Which formats?
  ↓
Which packaging?
  ↓
Which retention patterns?
  ↓
What does existing knowledge say?
  ↓
Does current research change the interpretation?
  ↓
What hypotheses or experiments should be considered?
```

## 32. Relationship model

The Brain should eventually represent relationships such as:

```text
Creator
 ├── owns → Channel
 ├── pursues → Goal
 ├── works_on → Project
 ├── targets → Audience
 └── prefers → Format

Channel
 ├── publishes → Video
 ├── serves → Audience
 ├── occupies → Niche
 └── measured_by → Analytics

Video
 ├── uses → Assets
 ├── covers → Topics
 ├── targets → Audience
 ├── produces → Analytics
 └── belongs_to → Project

Metric
 ├── describes → Video / Channel
 ├── relates_to → Audience
 └── informs → Decision

Resource
 ├── explains → Concept
 ├── informs → Diagnostic
 └── supports → Recommendation

Research
 ├── updates → Concept
 ├── contextualizes → Metric
 └── informs → Decision

Decision
 ├── responds_to → Evidence
 ├── informed_by → Knowledge
 ├── affects → Project
 └── produces → Experiment
```

## 33. Context compilation

The Brain should not load every available record into every request.

It should compile a task-specific **Creator Intelligence Context**.

```text
User request
    ↓
Intent
    ↓
Task
    ↓
Relevant entities
    ↓
Relevant relationships
    ↓
Relevant knowledge
    ↓
Current evidence
    ↓
Research requirements
    ↓
Freshness/confidence filtering
    ↓
Context budget
    ↓
Reasoning
```

The context package should be explainable:

```text
WHY was this information included?
WHERE did it come from?
HOW CURRENT is it?
HOW CONFIDENT is the system?
WHAT relationship made it relevant?
```

## 34. Cross-domain reasoning

The Brain must be able to combine multiple categories before answering.

Example:

```text
Goal:
increase qualified long-form audience

+
Audience:
returning viewers prefer topic cluster A

+
Content:
recent videos in cluster A

+
Analytics:
higher watch time but lower impressions

+
Packaging:
CTR below channel baseline

+
Resource Knowledge:
packaging principles

+
Research:
current platform/discovery context

=
multi-factor diagnosis
```

The Brain should distinguish:

- observed fact;
- derived relationship;
- interpretation;
- hypothesis;
- recommendation;
- action.

It should not silently convert one category into another.

## 35. Memory model

The Brain should maintain distinct forms of memory:

### Knowledge memory

Stable principles and reference knowledge.

### Creator memory

Preferences, goals, constraints, working style.

### Project memory

Current work, decisions, artifacts, milestones.

### Evidence memory

Historical analytics and observations.

### Decision memory

What was decided, why, and based on what evidence.

### Experiment memory

Hypothesis, intervention, measurement window, result.

### Conversation memory

Questions, conclusions, unresolved issues, commitments.

### System memory

Available tools, integrations, permissions, capabilities, failures.

These memories should have different retention and freshness rules.

## 36. Feedback loops

Every significant Brain interaction can produce structured feedback:

```text
Question
 ↓
Context
 ↓
Reasoning
 ↓
Recommendation
 ↓
Action
 ↓
Result
 ↓
New evidence
 ↓
Updated knowledge/context
 ↓
Brain
```

This creates an evolving intelligence system rather than a stateless assistant.

## 37. Confidence and uncertainty

The Brain should maintain separate confidence dimensions rather than one generic confidence score:

```text
source_confidence
data_freshness
entity_match_confidence
relationship_confidence
interpretation_confidence
recommendation_confidence
```

This allows responses to distinguish:

```text
Known
Observed
Strongly supported
Likely
Possible
Unknown
Requires research
```

## 38. Contradiction handling

When systems disagree, the Brain should not silently choose.

It should evaluate:

1. source authority;
2. freshness;
3. measurement definition;
4. time period;
5. population;
6. scope;
7. provenance;
8. known transformations.

Then record the conflict and either resolve it through the source-of-truth rules or surface the uncertainty.

## 39. Research escalation

Research should be triggered when:

- information is time-sensitive;
- current platform behavior matters;
- existing knowledge is insufficient;
- sources conflict;
- the user explicitly asks for research;
- a decision requires current external evidence.

Research results should enter the same provenance and relationship model as other knowledge.

## 40. Brain-wide optimization target

The ultimate architecture is:

```text
                         VIEWTUBE CREATOR
                                │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
              GOALS          CHANNEL          AUDIENCE
                 │               │               │
                 └───────────────┼───────────────┘
                                 ▼
                              CONTENT
                                │
                       ┌───────────┼───────────┐
                       ▼           ▼           ▼
                     VIDEOS      ASSETS      PROJECTS
                       │           │           │
                       └───────────┼───────────┘
                                 ▼
                              ANALYTICS
                                │
                                ▼
                     BRAIN RELATIONSHIP LAYER
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
      KNOWLEDGE              RESEARCH              MEMORY
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                         CONTEXT BROKER
                                │
                                ▼
                            REASONING
                                │
                   ┌────────────────┼────────────────┐
                   ▼                ▼                ▼
               RESPONSE       RECOMMENDATION       ACTION
                   │                │                │
                   └────────────────┼────────────────┘
                                ▼
                             OUTCOME
                                │
                                └────────→ BRAIN
```

## 41. New master implementation priorities

This architecture changes the implementation sequence.

### Priority 1 — Canonical Brain contracts

Define the shared entity, evidence, provenance, freshness, relationship, and context contracts.

### Priority 2 — Source adapters

Create Brain adapters for:

- creator context;
- channel;
- audience;
- videos;
- Shorts;
- analytics;
- assets;
- projects;
- Resource Library;
- research;
- Conversation OS;
- tools/system state.

### Priority 3 — Relationship layer

Connect entities across domains without duplicating their authoritative records.

### Priority 4 — Context compiler

Build the task-aware system that selects and assembles the minimum sufficient creator context.

### Priority 5 — Reasoning/evidence policy

Make the Brain explicitly distinguish observation, knowledge, inference, hypothesis, recommendation, and action.

### Priority 6 — Memory and feedback

Record decisions, experiments, outcomes, and useful conversation state.

### Priority 7 — Cross-domain QA

Create test scenarios requiring multiple systems to participate in one answer.

Examples:

- analytics + audience + content;
- video + thumbnail + CTR + Resource Knowledge;
- project + goals + channel strategy;
- research + current analytics + historical evidence;
- experiment + decision + outcome.

## 42. Definition of a complete Brain integration

A subsystem is **Brain-ready** when it has:

- canonical source of truth;
- stable adapter;
- typed entities;
- provenance;
- freshness;
- confidence;
- relationships;
- permissions;
- retrieval/query mechanism;
- context contribution rules;
- test fixtures;
- golden QA cases;
- feedback/outcome path.

A subsystem is **Brain-integrated** when it can both contribute information to the Brain and receive Brain-derived context or decisions where appropriate.

This becomes the standard for future ViewTube subsystem work.

## 43. Updated architectural conclusion

The ViewTube Brain should be treated as a **Creator Intelligence Operating System**, not simply an AI chatbot.

Its purpose is to develop a continuously updated, evidence-grounded understanding of:

**the creator + goals + niche + channel + audience + content + videos + assets + analytics + projects + resources + research + decisions + experiments + conversations + tools + history.**

The defining capability is not merely storing these categories. It is understanding the relationships between them and using those relationships to produce better context, reasoning, research, responses, recommendations, decisions, actions, and future context.

The Resource Library therefore becomes one knowledge subsystem inside a much larger intelligence fabric. Analytics becomes evidence. Research becomes current external knowledge. Projects and Conversation OS become operational memory. Assets and videos become content intelligence. Goals and audience become strategic context.

The Brain is the layer that brings them together.

**Architectural rule:** every new ViewTube subsystem should be designed with its Brain contract and cross-domain relationships from the beginning—not retrofitted later.
