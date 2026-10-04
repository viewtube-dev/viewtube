# ViewTube Studio Hub — Ten Tool Architecture & Product Specification

**Status:** Proposed / Architecture Definition  
**Date:** 2026-10-04  
**Repository:** `viewtube-dev/viewtube`  
**Branch:** `main`  
**Canonical scope:** Studio Hub outcome engines  
**Related systems:** Projects, Asset Engine/Vault, Editor, Analytics, AI Brain, Resource Library, Strategy/decision layer

---

## 1. Purpose

The ViewTube Studio Hub is the intelligence-and-action layer of ViewTube: a connected set of specialized creator tools that move a creator from one measurable state to another.

These are **outcome engines, not generic utilities and not ten chatbot panels**.

Each tool owns one primary transformation and has a decisive reason to exist. A tool should be rejected or merged if removing it does not remove a unique capability from the Studio Hub.

The ten tools are:

1. Opportunity Radar
2. Content Architect
3. Story Engine
4. Asset Forge
5. Audience Pulse
6. Experiment Lab
7. Causal Intelligence
8. Channel Simulator
9. Revenue Architect
10. Creator Strategy Engine

The tools are intentionally connected. A result from one tool can become an input to several other tools, while the **AI Brain acts as accumulated intelligence and memory** and the **Creator Strategy Engine acts as the cross-tool decision layer**.

---

# 2. Core Product Principles

## 2.1 Every tool owns a measurable state transition

The defining question for every Studio Hub tool is:

> What measurable state does this tool move the creator from, and what measurable state does it move them to?

Examples:

- Signals → Opportunities
- Opportunities → Content Concepts
- Concepts → Executable Narratives
- Narratives → Production Assets
- Audience Behavior → Relationship Opportunities
- Hypotheses → Measurable Learning
- Observed Results → Probable Explanations
- Current Channel State → Future Scenarios
- Creator/Audience Intelligence → Monetization Opportunities
- Validated Intelligence → Next Best Move

## 2.2 One primary function

A tool may participate across several workflow stages, but it must own one primary transformation.

Secondary capabilities exist only to complete that transformation.

## 2.3 Direct creation is preferred

Studio Hub tools should not merely tell the creator what to do. Where practical, the tool should directly create the useful output:

- opportunity record
- content brief
- story graph
- asset package
- audience-response opportunity
- experiment
- causal analysis
- scenario
- revenue plan
- prioritized action

## 2.4 Predictive intelligence must show uncertainty

Predictions and simulations must expose:

- evidence
- confidence
- uncertainty
- assumptions
- alternative explanations where applicable
- time horizon
- model or reasoning basis

ViewTube should never present an uncertain prediction as a guaranteed outcome.

## 2.5 Closed-loop learning

Actual creator results should feed the system back.

The loop is:

**Plan → Create → Publish → Measure → Explain → Learn → Improve → Plan again**

Successful and unsuccessful outcomes become evidence for future decisions.

## 2.6 AI Brain is bidirectional

The Brain both supplies context to Studio Hub tools and receives validated knowledge from them.

However:

- raw observations remain evidence;
- predictions remain predictions;
- hypotheses remain hypotheses;
- only validated findings become durable Brain knowledge.

## 2.7 Projects are the execution layer

When a Studio Hub result requires sustained work, it should be capable of becoming a Project with:

- objective
- brief
- evidence
- hypothesis
- deliverables
- tasks
- assets
- milestones
- experiment links
- publishing context
- outcome measurements

## 2.8 Asset Engine is the reusable production layer

Tools should not duplicate asset storage or production-asset management.

They should request, create, resolve, validate, and hand off assets through the Asset Engine/Vault.

## 2.9 Strategy Engine is the cross-tool decision layer

The Creator Strategy Engine is the one Studio Hub tool authorized to synthesize recommendations across all other Studio Hub engines.

This prevents every tool from becoming a mini strategic assistant.

---

# 3. Studio Hub System Architecture

## 3.1 Four functional layers

### Layer 1 — Data

Existing ViewTube analytics/data systems:

- Sync Controller
- Master Data Tables
- Data Visuals

Purpose: establish current, traceable evidence.

### Layer 2 — Intelligence Engines

The ten Studio Hub tools in this document.

Purpose: transform evidence into useful outcomes.

### Layer 3 — Cognitive Memory

**AI Brain**

Purpose:

- retain validated creator knowledge
- understand channel context
- connect findings across tools
- supply relevant historical context
- learn creator-specific patterns
- preserve provenance

### Layer 4 — Execution

Existing and connected ViewTube systems:

- Projects
- Asset Engine / Vault
- Editor
- Resource Library
- publishing workflows

Purpose: turn intelligence into actual creator work.

---

# 4. Shared Intelligence Contract

All ten tools should use a common handoff envelope so outputs remain interoperable.

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

## 4.1 Required provenance

Every meaningful intelligence result should retain:

- source tool
- timestamp
- input references
- evidence
- confidence
- validation state
- related project/asset references

## 4.2 Validation states

Recommended states:

- `OBSERVATION`
- `SIGNAL`
- `HYPOTHESIS`
- `PREDICTION`
- `FINDING`
- `VALIDATED`
- `REJECTED`
- `EXPIRED`

Only appropriate validated findings should become durable Brain knowledge.

---

# 5. Tool Handoff Standard

Every Studio Hub tool should expose a consistent set of handoff concepts where applicable:

- **Inspect**
- **Save**
- **Send to Brain**
- **Create Project**
- **Send to Asset Engine**
- **Send to Editor**
- **Run Experiment**
- **Simulate**
- **Use as Input**
- **View Evidence**
- **Compare**
- **Track Outcome**

A tool does not need every action, but handoffs must use consistent semantics.

---

# 6. Tool 01 — Opportunity Radar

## Primary transformation

**Signals → Opportunities**

## Definitive purpose

Discover high-value opportunities before they become obvious through ordinary channel analytics.

Opportunity Radar looks for meaningful changes across:

- search behavior
- audience behavior
- comments
- competitor performance
- content gaps
- emerging formats
- topic momentum
- old-content resurgence
- seasonal demand
- audience requests
- underserved viewer needs

It answers:

> What is becoming worth acting on?

## Unique reason for existence

Ordinary analytics primarily explains what has already happened.

Opportunity Radar exists to discover **what is becoming possible next**.

If removed, ViewTube loses its dedicated early-signal and opportunity-discovery capability.

## Inputs

- channel data
- YouTube performance data
- search/trend signals
- comments and audience language
- competitor/public signals where available
- existing Brain knowledge
- creator goals
- content history
- time horizon

## Backend structure

**Signal Collector → Signal Normalizer → Pattern Detector → Opportunity Scorer → Opportunity Graph → Opportunity Cards**

Core objects:

- Signal
- Pattern
- Opportunity
- Evidence
- Confidence
- Expiration
- PotentialValue
- RecommendedAction

## Output

An Opportunity object containing:

- opportunity title
- underlying signal
- audience affected
- estimated value
- confidence
- time sensitivity
- evidence
- explanation
- recommended action
- related content
- related projects
- related assets

## Brain intake

Raw signals are temporary evidence.

Validated opportunity patterns can become durable Brain knowledge.

Example:

> Audience interest in beginner workflows has repeatedly preceded above-baseline performance for this channel.

## Project handoff

Creates a prefilled project containing:

- objective
- target audience
- evidence
- hypothesis
- potential deliverable
- suggested assets
- recommended next tool

## Asset Engine interaction

Can request:

- references
- visual examples
- thumbnail references
- graphics
- reusable templates
- existing creator assets relevant to the opportunity

## User-facing Toolbox

### SubToolboxes

- Discover
- Signal Sources
- Filters & Focus
- Scoring Settings
- Opportunity Types
- Watchlist
- Saved Opportunities
- Quick Actions

### Primary controls

- Scan Now
- signal-source toggles
- topic/category filters
- time horizon
- opportunity threshold
- minimum confidence
- value weighting
- freshness weighting
- Save
- Watch
- Create Project
- Send to Content Architect

## Success metric

The tool succeeds when it identifies an opportunity that the creator can act on before ordinary analytics would make it obvious, producing a measurable downstream result.

---

# 7. Tool 02 — Content Architect

## Primary transformation

**Opportunity → Content Concept**

## Definitive purpose

Determine what content concept is actually worth producing from an identified opportunity.

This is not a generic idea generator.

It evaluates:

- audience fit
- creator fit
- novelty
- competitive differentiation
- expected value
- effort
- evidence
- format
- promise
- hook

## Unique reason for existence

Opportunity Radar identifies that something is worth pursuing.

Content Architect determines **what the creator should actually make about it**.

Removing it would leave a gap between opportunity discovery and production direction.

## Inputs

- Opportunity
- audience knowledge
- channel positioning
- creator strengths
- content history
- successful/failed content
- Brain knowledge
- available assets
- format constraints

## Backend

**Opportunity → Audience Model → Concept Generator → Concept Evaluator → Competitive Gap → Concept Brief**

## Output

A Content Concept containing:

- premise
- target audience
- viewer problem/desire
- promise
- novelty
- differentiation
- evidence
- recommended format
- hook
- expected outcome
- confidence
- effort estimate

## Brain intake

Uses:

- successful content patterns
- failed concepts
- audience preferences
- creator strengths
- channel positioning

Validated concept patterns can become Brain knowledge.

## Project handoff

Creates a project with:

- concept brief
- audience
- promise
- production objective
- suggested story direction
- asset requirements

## Asset Engine interaction

Requests:

- references
- visual motifs
- footage
- graphics
- thumbnails
- templates
- existing assets

## User-facing Toolbox

### SubToolboxes

- Opportunity Input
- Audience
- Format
- Concept Evaluation
- Competitive Gap
- Concept Comparison
- Actions

### Primary controls

- opportunity selector
- audience selector
- format selector
- novelty slider
- effort slider
- expected-value weighting
- Generate Concepts
- Compare Concepts
- Promote Concept
- Send to Story Engine
- Create Project

## Success metric

Produce a content concept with a clear reason to exist, a defined audience, a differentiated promise, and enough evidence to justify production.

---

# 8. Tool 03 — Story Engine

## Primary transformation

**Concept → Executable Narrative**

## Definitive purpose

Turn a chosen concept into a production-ready narrative architecture optimized for understanding, engagement, retention, and payoff.

## Unique reason for existence

Content Architect decides **what to make**.

Story Engine decides **how the experience unfolds**.

## Inputs

- content concept
- audience
- format
- runtime
- creator style
- Brain knowledge
- available assets
- desired outcome

## Backend

**Concept → Narrative Model → Beat Graph → Retention Model → Visual/Audio Mapping → Production Blueprint**

The core object should be a **StoryGraph**, not merely a large text document.

## Output

- hook
- setup
- tension
- progression
- reveals
- emotional progression
- visual beats
- audio beats
- payoff
- ending
- CTA placement
- production blueprint

## Brain intake

The Brain learns validated creator-specific patterns such as:

- which hook structures work
- which narrative pacing performs
- where retention drops
- which reveal patterns work
- which CTA placements perform

## Project handoff

Moves the project into a storyboard/production state.

## Asset Engine interaction

Every story beat can generate an asset requirement.

Example:

**Beat → Visual requirement → Asset request → Asset version → StoryGraph reference**

## User-facing Toolbox

### SubToolboxes

- Narrative Type
- Runtime
- Hook
- Beat Structure
- Retention
- Visual Mapping
- Audio Mapping
- CTA
- Story Actions

### Primary controls

- narrative type
- runtime
- retention target
- beat density
- hook style
- Generate Story Graph
- Add Beat
- Reorder Beat
- Generate Beat Asset
- Send to Asset Forge
- Send to Project/Storyboard

## Success metric

Produce a narrative structure that is directly executable by the creator/editor rather than requiring another round of strategic interpretation.

---

# 9. Tool 04 — Asset Forge

## Primary transformation

**Story / Production Blueprint → Production-Ready Asset Package**

## Definitive purpose

Translate production requirements into a complete, organized package of reusable assets.

Asset Forge is the bridge between Studio Hub intelligence and the Asset Engine.

It does not replace the Editor.

## Unique reason for existence

The Story Engine can identify what the story needs, but a production system needs an intelligent mechanism that resolves those requirements into usable assets.

## Inputs

- StoryGraph
- production blueprint
- asset requirements
- creator style
- existing Vault/Asset Engine assets
- references
- generation parameters

## Backend

**Production Blueprint → Asset Requirements Graph → Asset Resolver → Generation Pipeline → Asset Validation → Asset Package**

Core relationship:

**Asset → Project → Story → Beat → Purpose → Source → Version**

## Output

- image assets
- video assets
- graphics
- lower thirds
- title cards
- overlays
- thumbnail candidates
- visual references
- metadata
- asset manifest

## Brain intake

Can learn:

- preferred visual styles
- successful asset patterns
- reusable assets
- asset-performance relationships
- creator-specific visual conventions

## Project handoff

Attaches the asset package to the appropriate Project and production tasks.

## Editor handoff

Provides production-ready assets mapped to story beats.

## User-facing Toolbox

### SubToolboxes

- Asset Requirements
- Asset Types
- Style
- Sources
- Generation
- Quantity
- Validation
- Package

### Primary controls

- asset-type selection
- style selector
- source priority
- quantity
- generation parameters
- Generate Package
- Regenerate
- Validate
- Send to Project
- Send to Editor
- Save to Asset Engine

## Success metric

Produce the required reusable production assets with correct purpose, organization, provenance, and story/beat relationships.

---

# 10. Tool 05 — Audience Pulse

## Primary transformation

**Audience Behavior → Relationship Opportunity**

## Definitive purpose

Identify who the creator should communicate with, why they matter, what they need, and what action should happen next.

## Unique reason for existence

Analytics can show audience behavior.

Audience Pulse turns that behavior into **communication opportunities and relationships**.

## Inputs

- comments
- audience questions
- requests
- community activity
- engagement
- viewer history
- content affinity
- audience segments
- sentiment/intent signals
- Brain knowledge

## Backend

**Audience Events → Semantic Clustering → Relationship Modeling → Intent Detection → Opportunity Ranking → Communication Actions**

## Output

- response opportunities
- viewer questions
- content requests
- community-post opportunities
- FAQ candidates
- viewer segments
- loyal/fan signals
- dissatisfaction signals
- collaboration opportunities
- communication priorities

## Brain intake

Builds audience knowledge around:

- interests
- language
- behavior
- content affinity
- relationship strength
- recurring requests
- audience needs

## Project handoff

A recurring audience request can become:

- content project
- community project
- response campaign
- experiment

## Asset Engine interaction

Can request assets for:

- response graphics
- community posts
- explainers
- FAQ visuals
- audience-specific content

## User-facing Toolbox

### SubToolboxes

- Audience
- Questions
- Requests
- Fans
- Problems
- Opportunities
- Communication Actions

### Primary controls

- audience segment
- signal types
- relationship threshold
- time window
- intent filter
- Generate Opportunities
- Draft Responses
- Create Content
- Create Community Post
- Track Relationship

## Success metric

Identify a specific audience relationship opportunity and convert it into a measurable communication or content action.

---

# 11. Tool 06 — Experiment Lab

## Primary transformation

**Hypothesis → Measurable Learning**

## Definitive purpose

Give ViewTube a scientific mechanism for learning what actually works for a specific creator/channel.

## Unique reason for existence

Recommendations are not enough.

Experiment Lab converts uncertainty into evidence.

## Inputs

- hypothesis
- baseline
- variable
- control
- variants
- metric
- time period
- relevant content/assets
- channel context

## Backend

**Hypothesis → Experiment Design → Variant Creation → Execution → Measurement → Statistical Evaluation → Learning**

Experiment object:

- hypothesis
- variable
- baseline
- control
- variants
- metric
- duration
- confidence
- conclusion
- evidence

## Output

- experiment design
- variants
- measurements
- statistical result
- conclusion
- confidence
- validated learning

## Brain intake

Completed experiments can create durable knowledge only after validation.

Example:

> For this channel, question-based thumbnails outperform descriptive thumbnails under the tested conditions.

## Project interaction

Experiments can be:

- attached to an existing project
- created from a project
- generated as a standalone learning project
- connected to published content

## Asset Engine interaction

Can automatically generate:

- thumbnail variants
- title variants
- creative variants
- visual treatments
- CTA variants

## User-facing Toolbox

### SubToolboxes

- Hypothesis
- Variable
- Control
- Variants
- Measurement
- Duration
- Analysis
- Learning

### Primary controls

- hypothesis field
- variable selector
- control selector
- variant creator
- metric selector
- duration
- confidence target
- Create Experiment
- Start
- Monitor
- Analyze
- Accept Finding
- Send Finding to Brain

## Success metric

Convert a meaningful uncertainty into a reliable, measurable learning that improves future creator decisions.

---

# 12. Tool 07 — Causal Intelligence

## Primary transformation

**Observed Results → Probable Explanation**

## Definitive purpose

Explain why performance changed instead of merely reporting that it changed.

## Unique reason for existence

Analytics answers:

> What happened?

Causal Intelligence investigates:

> What probably caused it?

## Inputs

- performance data
- historical baseline
- content attributes
- publishing context
- audience changes
- traffic changes
- experiments
- external signals
- Brain knowledge

## Backend

**Events → Baseline Builder → Variable Graph → Change Detection → Counterfactual Modeling → Causal Hypotheses → Evidence Ranking**

## Output

- likely causal factors
- alternative explanations
- evidence strength
- confidence
- uncertainty
- recommended validation actions

The tool must distinguish correlation from causal evidence.

## Brain intake

Validated causal relationships may become knowledge such as:

> Videos with properties A+B+C tend to outperform baseline under conditions D.

The finding retains provenance and confidence.

## Project handoff

Can create:

- investigation project
- follow-up experiment
- content adjustment
- strategy task

## User-facing Toolbox

### SubToolboxes

- Metric
- Baseline
- Comparison Window
- Candidate Drivers
- Evidence
- Causal Hypotheses
- Confidence
- Actions

### Primary controls

- metric selector
- comparison period
- driver selection
- confidence threshold
- Analyze Cause
- Compare Hypotheses
- View Evidence
- Design Validation Experiment
- Promote to Brain

## Success metric

Produce a defensible explanation of a meaningful performance change, with evidence and uncertainty clearly represented.

---

# 13. Tool 08 — Channel Simulator

## Primary transformation

**Current Channel State → Future Scenarios**

## Definitive purpose

Let creators explore likely consequences before committing time, money, or production resources.

## Unique reason for existence

Strategy normally happens under uncertainty.

Channel Simulator makes that uncertainty explicit and lets the creator compare scenarios before acting.

## Inputs

- current channel state
- historical performance
- Brain knowledge
- upload cadence
- content mix
- audience model
- topic mix
- revenue assumptions
- resource constraints

## Backend

**Channel State → Historical Model → Brain Knowledge → Scenario Variables → Simulation → Probability Distribution → Scenario Comparison**

Predictions should be represented as ranges/distributions, not fake precise guarantees.

## Output

- scenario
- expected range
- upside
- downside
- assumptions
- confidence
- resource requirements
- comparison against baseline

## Brain intake

The Brain supplies validated knowledge to simulations.

Simulation outputs do **not automatically become Brain knowledge**.

They remain predictions until real-world outcomes validate them.

## Project handoff

A selected scenario can become a strategy or execution Project.

## User-facing Toolbox

### SubToolboxes

- Current Channel
- Scenario Variables
- Content Mix
- Cadence
- Audience
- Revenue
- Horizon
- Risk
- Compare Scenarios

### Primary controls

- scenario name
- upload cadence
- content mix
- topic focus
- forecast horizon
- risk tolerance
- resource constraints
- Simulate
- Compare
- Save Scenario
- Start Project

## Success metric

Help the creator choose between meaningful future paths with a clearer understanding of likely outcomes, risks, and resource requirements.

---

# 14. Tool 09 — Revenue Architect

## Primary transformation

**Creator Assets + Audience + Channel Intelligence → Monetization Opportunity**

## Definitive purpose

Discover and model the creator's highest-fit monetization opportunities.

This is personalized monetization, not a generic list of ways to make money.

## Unique reason for existence

Revenue opportunities depend on the intersection of:

- audience
- creator capabilities
- content
- assets
- trust
- distribution
- conversion
- economics

Revenue Architect owns that intersection.

## Inputs

- audience intelligence
- channel performance
- creator capabilities
- content catalog
- assets
- audience segments
- traffic
- engagement
- existing revenue
- potential products/services
- sponsorship/affiliate opportunities
- licensing opportunities

## Backend

**Creator Capability Graph + Audience Value Graph + Asset Graph + Revenue Models → Opportunity Matching → Unit Economics → Scenario Modeling → Revenue Plan**

## Output

- monetization opportunity
- audience
- offer/model
- value proposition
- required assets
- funnel
- estimated economics
- effort
- risk
- forecast
- experiments
- implementation plan

## Brain intake

Can learn:

- audience willingness
- conversion performance
- profitable content relationships
- creator strengths
- revenue patterns
- successful offers

## Project handoff

Creates a monetization project containing:

- offer
- audience
- assets
- funnel
- experiments
- milestones
- revenue targets

## Asset Engine interaction

Can create/request:

- landing-page assets
- product graphics
- sponsor packages
- media kits
- thumbnails
- sales assets
- promotional content

## User-facing Toolbox

### SubToolboxes

- Audience Value
- Revenue Models
- Offer
- Unit Economics
- Forecast
- Assets
- Funnel
- Experiments
- Revenue Plan

### Primary controls

- revenue model
- audience segment
- offer
- price
- conversion assumption
- effort
- forecast horizon
- Model Opportunity
- Compare Models
- Build Plan
- Create Project

## Success metric

Identify and model a monetization path with strong audience fit, economic potential, and an executable next step.

---

# 15. Tool 10 — Creator Strategy Engine

## Primary transformation

**All Validated Intelligence → Next Best Move**

## Definitive purpose

Continuously determine what the creator should do next based on goals, evidence, constraints, opportunities, experiments, audience needs, revenue opportunities, and actual results.

## Unique reason for existence

The other nine tools specialize.

Creator Strategy Engine synthesizes them.

It is the Studio Hub's decision layer.

It should not become a generic chat interface.

## Inputs

- Opportunity Radar outputs
- Content Architect outputs
- Story Engine state
- Asset Forge state
- Audience Pulse outputs
- Experiment Lab findings
- Causal Intelligence findings
- Channel Simulator scenarios
- Revenue Architect opportunities
- AI Brain knowledge
- creator goals
- constraints
- available time/resources
- project state
- actual performance results

## Backend

**Evidence Graph → Knowledge Graph → Goals → Constraints → Opportunities → Actions → Expected Value → Priority Engine → Next Best Action**

## Output

A prioritized action such as:

> Produce X now because evidence A+B supports it, expected value is Y, effort is Z, confidence is N, and the opportunity window is W.

The recommendation should include:

- action
- reason
- expected impact
- confidence
- evidence
- effort
- timing
- dependencies
- affected tools
- suggested project

## Brain relationship

The Strategy Engine consumes validated Brain knowledge and generates recommendations.

Its recommendation is not automatically durable Brain knowledge.

Actual outcomes feed back through analytics, experiments, causal analysis, and validation.

## Project handoff

The primary action should be launchable directly as a Project.

## Asset Engine interaction

If the next best move requires production assets, the strategy result should carry the required asset plan.

## User-facing Toolbox

### SubToolboxes

- Goals
- Priorities
- Constraints
- Opportunities
- Experiments
- Revenue
- Audience
- Evidence
- Next Best Move

### Primary controls

- goal
- planning horizon
- risk tolerance
- available effort
- opportunity inclusion
- experiment inclusion
- revenue inclusion
- Generate Next Best Move
- Inspect Evidence
- Compare Actions
- Start Project
- Track Outcome

## Success metric

At any meaningful point in the creator workflow, identify the highest-value feasible next action and make it executable.

---

# 16. End-to-End Studio Hub Workflow

The recommended connected workflow is:

**Opportunity Radar**  
↓  
**Content Architect**  
↓  
**Story Engine**  
↓  
**Asset Forge**  
↓  
**Projects / Editor**  
↓  
**Publish**  
↓  
**Audience Pulse + Performance Data**  
↓  
**Causal Intelligence + Experiment Lab**  
↓  
**AI Brain**  
↓  
**Channel Simulator + Revenue Architect**  
↓  
**Creator Strategy Engine**  
↓  
**Next Project / Next Action**

This is not a rigid linear pipeline.

Outputs can fan out.

For example:

- Opportunity Radar can feed Content Architect, Audience Pulse, Channel Simulator, or Strategy Engine.
- Audience Pulse can create a Content Architect input.
- Causal Intelligence can trigger Experiment Lab.
- Experiment Lab can inform Content Architect, Story Engine, or Strategy Engine.
- Revenue Architect can trigger new content, audience, or project work.
- Strategy Engine can initiate any appropriate tool.

---

# 17. Tool-to-System Handoff Matrix

| Tool | Projects | Asset Engine | Editor | AI Brain | Analytics | Other Studio Tools |
|---|---|---|---|---|---|---|
| Opportunity Radar | Create project | Request references/assets | — | Read/write validated findings | Read signals | Content Architect, Audience Pulse, Simulator, Strategy |
| Content Architect | Create project | Request production references | — | Read/write patterns | Read performance | Story Engine, Strategy |
| Story Engine | Update production project | Generate requirements | Send blueprint | Learn narrative patterns | Read retention evidence | Asset Forge |
| Asset Forge | Attach assets/tasks | Create/resolve package | Send production assets | Learn asset patterns | Read asset performance | Story Engine, Projects |
| Audience Pulse | Create content/communication project | Request communication assets | — | Build audience knowledge | Read behavior | Content Architect, Strategy |
| Experiment Lab | Attach/create experiment project | Generate variants | — | Promote validated findings | Measure results | Causal Intelligence, Strategy |
| Causal Intelligence | Create investigation/project | — | — | Promote validated causal findings | Read performance | Experiment Lab, Strategy |
| Channel Simulator | Save scenario/create project | Estimate requirements | — | Read validated knowledge | Read history | Revenue Architect, Strategy |
| Revenue Architect | Create monetization project | Create revenue assets | — | Learn monetization patterns | Read revenue/performance | Audience Pulse, Simulator, Strategy |
| Strategy Engine | Start next project | Request required assets | Route execution | Consume knowledge | Consume evidence | All tools |

---

# 18. Studio Hub Front-End Architecture

The user-facing hierarchy should remain consistent across all ten tools:

**Studio Hub**  
→ **Tool Module**  
→ **SubToolboxes**  
→ **Controls / Filters / Modes / Actions**  
→ **Workspace**  
→ **Evidence / Results / Output / Handoffs**

## 18.1 Tool Module

Each tool gets its own independent module and setup.

A tool module should expose:

- identity
- primary purpose
- current state
- primary action
- key result
- evidence status
- confidence
- handoff actions

## 18.2 SubToolbox

A SubToolbox is a focused control group.

Examples:

- Signal Sources
- Filters & Focus
- Scoring Settings
- Hypothesis
- Variants
- Evidence
- Forecast
- Revenue Model

SubToolboxes should not become separate tools.

## 18.3 Workspace

The workspace displays the actual outcome of the tool.

Examples:

- Opportunity cards
- Concept comparisons
- StoryGraph
- Asset requirements
- Audience opportunities
- Experiment results
- Causal hypotheses
- Scenario comparisons
- Revenue models
- Next-best-action queue

---

# 19. Component and Primitive Rules

The existing ViewTube UI Reference Library is the authority for the actual primitives, styles, tokens, and default sizes used across widgets.

The Studio Hub should reuse those primitives rather than inventing a second component system.

The size system defines default sizes for widget layouts; primitives and components may adapt to other sizes when required by context.

## Required primitive families

The Studio Hub should use the established ViewTube primitives for:

- buttons
- icon buttons
- inputs
- selects
- sliders
- checkboxes
- radios
- toggles
- chips
- badges
- cards
- panels
- tabs
- accordions
- toolbars
- dividers
- progress indicators
- stat blocks
- data tables
- charts
- evidence rows
- result cards
- empty states
- loading states
- error states
- confirmation states

## Widget decision rule

When a tool needs UI behavior that is not already represented:

> **Fix an existing component, create a new component, or add a variant — situation dependent.**

Do not create duplicate primitives simply because a tool has a different purpose.

---

# 20. Intelligence UX Rules

Every intelligence result should make the following visible when applicable:

### What happened?

Observation.

### What does ViewTube think it means?

Interpretation.

### Why?

Evidence.

### How certain is it?

Confidence and uncertainty.

### What should happen next?

Recommended action.

### Can I inspect it?

Evidence/provenance.

### Can I act on it?

Project/tool handoff.

### Can the Brain learn from it?

Validation state and Brain action.

This prevents opaque AI output from becoming the product's operating logic.

---

# 21. Success Model

Every tool must have a measurable success state.

| Tool | State Before | State After |
|---|---|---|
| Opportunity Radar | Unstructured signals | Ranked actionable opportunity |
| Content Architect | Opportunity | Defensible content concept |
| Story Engine | Content concept | Executable narrative |
| Asset Forge | Production requirements | Production-ready asset package |
| Audience Pulse | Audience behavior | Relationship/communication opportunity |
| Experiment Lab | Uncertainty | Measurable learning |
| Causal Intelligence | Performance change | Probable explanation |
| Channel Simulator | Current state | Compared future scenarios |
| Revenue Architect | Audience + creator assets | Monetization opportunity/plan |
| Strategy Engine | Many possible actions | Prioritized next best move |

The overarching Studio Hub success state is:

> **Creator uncertainty → evidence → decision → execution → measurable result → learning → better next decision.**

---

# 22. Build Sequence

The recommended implementation order is:

1. Shared contracts and Studio Hub foundation
2. Opportunity Radar
3. Content Architect
4. Story Engine
5. Asset Forge
6. Audience Pulse
7. Experiment Lab
8. Causal Intelligence
9. Channel Simulator
10. Revenue Architect
11. Creator Strategy Engine

This sequence establishes the upstream opportunity/content pipeline first, then audience and learning loops, then simulation/monetization, and finally the cross-tool strategy layer.

## Important implementation rule

The Creator Strategy Engine should not be implemented as a superficial dashboard before the underlying engines produce real structured outputs.

Its value depends on the quality of:

- evidence
- tool outputs
- Brain knowledge
- project state
- actual creator results

---

# 23. Development Acceptance Criteria

A Studio Hub tool is not considered architecturally complete until it has:

- one clearly defined primary transformation
- a unique reason to exist
- defined inputs
- defined outputs
- backend processing stages
- structured output object
- evidence/provenance model
- confidence/uncertainty model where applicable
- Brain intake/output behavior
- Project handoff
- Asset Engine interaction where applicable
- Editor interaction where applicable
- defined success state
- user-facing Toolbox
- SubToolboxes
- real controls
- primary action
- result workspace
- reusable ViewTube primitives
- error/loading/empty states
- handoff actions
- measurable outcome

---

# 24. Product-Level Definition

The ten Studio Hub tools together are intended to make ViewTube more than a collection of creator utilities.

They form a connected operating system:

**Discover → Decide → Create → Produce → Communicate → Measure → Explain → Learn → Simulate → Monetize → Prioritize**

The decisive product idea is not that ViewTube contains ten powerful AI tools.

It is that the ten tools form a **closed-loop creator intelligence system** in which each tool owns a distinct transformation and passes structured results into the rest of the ViewTube ecosystem.

The creator should never have to manually reconstruct context between tools.

The system should carry forward:

- evidence
- intent
- assets
- projects
- audience knowledge
- experiments
- findings
- uncertainty
- outcomes
- validated knowledge

That continuity is the core Studio Hub advantage.
