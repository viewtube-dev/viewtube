# ViewTube Studio Hub — Tool Ideas & Product Architecture

**Status:** Canonical product-idea reference  
**Scope:** Studio Hub tools  
**Repository:** `viewtube-dev/viewtube`

## Purpose

This document captures the current set of Studio Hub tool ideas, what each tool does, its conceptual data model, workflow, handoffs, and relationship to the ViewTube AI Brain and shared systems.

The goal is not ten disconnected dashboards. The Studio Hub is a connected creator operating system in which each tool specializes in one job and passes structured context to the next tool.

---

# 1. Content Opportunity Engine

## Purpose

Identify the highest-value thing this creator could make next.

The engine combines audience demand, channel evidence, strategic goals, revenue potential, effort, and other signals to rank opportunities.

## Conceptual data model

```
Opportunity {
  id
  creator_id
  source_signals[]
  topic
  audience_segment
  opportunity_type
  evidence[]
  predicted_outcomes {
    reach
    retention
    audience_growth
    revenue
  }
  effort_estimate
  expiration
  confidence
  strategic_fit
  status
  resulting_project_id
}
```

## Scoring concept

**Audience Fit × Evidence Strength × Demand × Strategic Value × Revenue Potential ÷ Production Cost**

The score is a decision aid, not unquestionable truth.

## Workflow

```
Signals
  ↓
Opportunity
  ↓
Evidence
  ↓
AI Brain evaluation
  ↓
Rank
  ↓
Creator accepts
  ↓
Project
  ↓
Story Architect
  ↓
Asset Engine
  ↓
Editor
```

## Handoffs

- Story & Retention Architect
- Projects
- Experiment Lab
- AI Brain

## Brain relationship

The tool can create observations and interpretations. Durable Brain knowledge requires evidence and validation.

---

# 2. Video Genome

## Purpose

Discover repeatable patterns inside the creator's successful content.

The Video Genome turns individual videos into structured descriptions that can be compared across the channel.

## Conceptual data model

```
VideoGenome {
  video_id
  topic
  premise
  audience
  title_structure
  thumbnail_structure
  hook
  opening_pattern
  narrative_structure
  pacing
  information_density
  emotional_curve
  pattern_interrupts[]
  payoff_points
  CTA_structure
  retention_events[]
  comment_signals[]
  outcome_metrics
}
```

## Workflow

```
Analytics
  ↓
Video Genome
  ↓
Patterns
  ↓
Opportunity / Story / Experiment / Brain
```

## Important knowledge distinction

The system should distinguish:

1. Raw observation
2. Candidate interpretation
3. Candidate knowledge
4. Validated knowledge

A pattern appearing in one video should not automatically become a channel-wide rule.

## Handoffs

- Content Opportunity Engine
- Story & Retention Architect
- Experiment Lab
- AI Brain

---

# 3. Audience Signal Miner

## Purpose

Convert audience behavior and feedback into structured signals, problems, desires, requests, and opportunities.

## Conceptual data model

```
AudienceSignal {
  id
  source
  audience_segment
  signal_type
  topic
  evidence_count
  confidence
  urgency
  related_content[]
  recommended_action
  lifecycle
}
```

## Signal types

- Request
- Confusion
- Desire
- Complaint
- Praise
- Trend
- Opportunity

## Possible actions

A signal can become:

- a new Opportunity
- a Project task
- an Audience Relationship
- an Experiment
- an FAQ
- a Resource
- a Revenue Opportunity

## Workflow

```
Audience behavior / feedback
  ↓
Signal
  ↓
Cluster / interpret
  ↓
Recommended action
  ↓
Opportunity / Project / Relationship / Experiment / Resource
```

## Handoffs

- Opportunity Engine
- Creator Relationship Engine
- Experiment Lab
- Projects
- Revenue Opportunity Map

---

# 4. Story & Retention Architect

## Purpose

Transform an idea into the strongest possible viewer journey before production.

## Conceptual data model

```
StoryBlueprint {
  project_id
  premise
  audience
  promise
  hook
  opening
  beats[]
  escalation
  pattern_interrupts[]
  payoff
  CTA
  retention_hypotheses[]
  genome_references[]
  expected_risk_points[]
}
```

## Core workspace

The tool develops:

- premise
- viewer promise
- hook
- opening
- narrative beats
- escalation
- pattern interrupts
- payoff
- CTA

## Retention Risk Map

Identify potential:

- drop-off points
- weak transitions
- delayed payoff
- unclear promise
- repetitive sections
- information-density problems
- missing pattern interrupts

## Asset manifest

The tool can define required production assets:

- A-roll
- B-roll
- screenshots
- graphics
- charts
- intro animation
- thumbnail concept
- CTA graphic

## Workflow

```
Opportunity
  ↓
Story Architect
  ↓
Project
  ↓
Asset Engine
  ↓
Editor
```

## Handoffs

- Projects
- Asset Engine
- Editor
- Video Genome
- Analytics / Experiment Lab

---

# 5. Content Autopilot

## Purpose

Extract the maximum strategic value from every finished piece of content.

Rather than treating a published video as finished forever, Content Autopilot finds useful derivatives and downstream opportunities.

## Conceptual data model

```
ContentDerivative {
  source_content
  derivative_type
  audience
  strategic_reason
  source_segment
  predicted_value
  effort
  status
  resulting_asset_id
}
```

## Workflow

```
Published Video
  ↓
Analyze source
  ↓
Identify derivatives
  ↓
Rank by value
  ↓
Creator approval
  ↓
Asset Engine
  ↓
Projects
  ↓
Publishing
  ↓
Results
  ↓
AI Brain
```

## Possible derivatives

Examples include:

- short-form clips
- social posts
- follow-up videos
- educational assets
- audience resources
- visual assets
- newsletter/content extensions
- additional experiments

The exact derivative catalog should remain extensible.

## Brain relationship

The Brain learns which derivative types actually produce value rather than assuming every derivative is useful.

---

# 6. Creator Relationship Engine

## Purpose

Identify and manage audience relationships that deserve meaningful human attention.

The tool moves beyond anonymous aggregate metrics into structured relationship context while respecting privacy and access boundaries.

## Conceptual data model

```
AudienceRelationship {
  person_or_segment
  relationship_stage
  interaction_history
  interests
  contribution_history
  importance
  opportunity
  recommended_action
  last_interaction
  next_action
}
```

## Relationship stages

```
Viewer
  ↓
Returning Viewer
  ↓
Engaged Viewer
  ↓
Community Member
  ↓
Superfan
  ↓
Advocate
  ↓
Customer / Collaborator
```

## Workflow

```
Audience Signal Miner
  ↓
Relationship Engine
  ↓
Human decision
  ↓
Response / Project / Collaboration
  ↓
Interaction history
```

## Possible actions

- respond
- follow up
- recognize contribution
- create relationship task
- create collaboration opportunity
- connect relationship to Project

## Privacy principle

Only expose information that ViewTube legitimately has access to and is permitted to use.

---

# 7. Revenue Opportunity Map

## Purpose

Identify the most defensible creator-specific ways to increase revenue.

The tool combines audience information, content performance, supporting evidence, market signals, strategic fit, effort, and prerequisites.

## Conceptual data model

```
RevenueOpportunity {
  opportunity_type
  audience_segment
  supporting_content[]
  supporting_signals[]
  estimated_value
  effort
  confidence
  prerequisites[]
  strategic_fit
  status
  resulting_project_id
}
```

## Workflow

```
Audience + Content + Analytics + Market signals
  ↓
Revenue Map
  ↓
Opportunity
  ↓
Project
  ↓
Asset Engine
  ↓
Launch
  ↓
Revenue result
  ↓
AI Brain
```

## Key principle

Revenue recommendations should show the evidence behind the recommendation.

---

# 8. Experiment Lab

## Purpose

Turn creator decisions into measurable experiments and permanent learning where the evidence supports it.

## Conceptual data model

```
Experiment {
  hypothesis
  variable
  control
  treatment
  target_metric
  baseline
  test_window
  sample
  result
  confidence
  confounders[]
  conclusion
  knowledge_candidate
}
```

## Workflow

```
Question
  ↓
Hypothesis
  ↓
Experiment
  ↓
Execution
  ↓
Analytics
  ↓
Analysis
  ↓
Conclusion
  ↓
AI Brain
```

## Important rule

Not every experiment result becomes truth.

The system should consider:

- confidence
- comparability
- sample
- confounders
- baseline
- test conditions

## Handoffs

- Analytics
- AI Brain
- Projects
- Opportunity Engine
- Story Architect

---

# 9. Creator Command Brain

## Purpose

Determine the highest-leverage action the creator should take now.

This is the Studio Hub's orchestration and decision layer.

## Conceptual data model

```
Decision {
  source
  evidence[]
  impact
  urgency
  confidence
  effort
  dependency[]
  recommended_action
  action_type
  destination_tool
  project_id
  outcome
}
```

## Core question

> **What matters most right now?**

## Workflow

```
Signals from Studio Hub
  ↓
Evaluate decisions
  ↓
Prioritize
  ↓
Recommend action
  ↓
Route to destination tool
  ↓
Action
  ↓
Outcome
  ↓
New evidence
```

## Studio Hub home role

Command Brain can act as the Studio Hub's central action queue.

It should orchestrate specialized tools rather than duplicate their functions.

---

# 10. Channel Flywheel

## Purpose

Diagnose the weakest part of the creator's complete growth system.

Instead of focusing on one metric in isolation, Channel Flywheel models the complete system.

## Conceptual data model

```
ChannelSystem {
  discovery
  click
  watch
  satisfaction
  return
  relationship
  community
  conversion
  revenue
  reinvestment
  content_creation
}
```

## System stages

```
Discovery
  ↓
Click
  ↓
Watch
  ↓
Satisfaction
  ↓
Return
  ↓
Relationship
  ↓
Community
  ↓
Conversion
  ↓
Revenue
  ↓
Reinvestment
  ↓
Content Creation
  ↓
Discovery
```

## Killer feature

**Bottleneck detection**

Example:

> New viewers are arriving, but too few are becoming returning viewers.

The tool should identify:

- affected stage
- evidence
- likely causes
- confidence
- recommended action
- connected tools

## Handoffs

- Command Brain
- Experiment Lab
- Projects
- Analytics

---

# Shared Studio Hub Architecture

The major product advantage is not simply having ten tools.

The advantage is the **typed handoffs between them**.

## Core workflow

```
Opportunity Engine
      ↓
Story Architect
      ↓
Project
      ↓
Asset Engine
      ↓
Editor
      ↓
Analytics
      ↓
Experiment Lab
      ↓
AI Brain
      ↓
Command Brain
      ↓
Next Decision
```

Other loops connect audience, revenue, relationships, content derivatives, and channel-system diagnosis into the same operating system.

---

# Shared Studio Context

The tools should share a common conceptual context.

```
StudioContext {
  creator
  audience
  project
  content
  opportunity
  evidence
  goals
  constraints
  assets
  decisions
  experiments
  knowledge_refs
  provenance
}
```

This allows tools to exchange structured context instead of copying loose text between screens.

---

# AI Brain Knowledge Model

The AI Brain should preserve a strict progression:

```
RAW DATA
   ↓
OBSERVATIONS
   ↓
INTERPRETATIONS
   ↓
VALIDATED KNOWLEDGE
   ↓
STRATEGY
   ↓
DECISIONS
   ↓
ACTIONS
   ↓
RESULTS
   ↓
NEW DATA
```

## Provenance

Durable knowledge should answer:

- Why do we believe this?
- What evidence supports it?
- Which tool produced the evidence?
- Which source records support it?
- When was it observed?
- What is the confidence?
- When was it last validated?

This prevents the AI Brain from turning every AI-generated suggestion into a permanent fact.

---

# ViewTube Product-System Relationships

The Studio Hub tools connect to existing ViewTube systems.

## Projects

Projects are the execution container for approved work.

Studio Hub tools can:

- create Projects
- add tasks
- attach evidence
- attach assets
- route decisions
- track outcomes

## Asset Engine

Receives structured asset requirements from tools such as Story Architect and Content Autopilot.

## Editor

Receives production context and assets.

## Analytics

Provides performance evidence and receives experiment definitions/results.

## AI Brain

Stores validated knowledge and provides strategic reasoning.

## Vault

Provides durable project/content resources where appropriate.

## Resource Library

Provides reusable references, templates, assets, and knowledge.

---

# UI / Component-System Requirements

The existing ViewTube component library is the visual source of truth.

Use its established:

- heavy black borders
- compact uppercase typography
- colored module headers
- cards
- tags
- segmented controls
- inputs
- selects
- range controls
- tabs
- alerts
- progress indicators
- loading/skeleton states
- tooltips
- media previews
- player controls
- feedback states

## Widget rule

When a tool needs a widget:

1. Fix an existing widget if the existing widget is wrong.
2. Add a variant when the same primitive needs a meaningful variation.
3. Create a new widget only when the need is genuinely new.

## Size rule

The size system defines default layout sizes. Components and primitives remain adaptable to other sizes.

---

# User-Facing Tool Principle

Each tool must be designed as the **actual product workspace the creator uses**.

Do not replace the product with:

- configuration-only screens
- generic dashboards
- placeholder cards
- setup forms pretending to be the finished tool
- generic AI chat panels

Each tool needs:

- real controls
- realistic data
- clear primary action
- supporting actions
- detail views
- evidence/context
- states
- handoffs
- visible results

---

# Ten-Tool Summary

| # | Tool | Primary job |
|---|---|---|
| 01 | Content Opportunity Engine | Find the highest-value next thing to make |
| 02 | Video Genome | Discover repeatable success patterns |
| 03 | Audience Signal Miner | Turn audience behavior into structured opportunities |
| 04 | Story & Retention Architect | Design the strongest viewer journey |
| 05 | Content Autopilot | Extract more strategic value from finished content |
| 06 | Creator Relationship Engine | Manage high-value audience relationships |
| 07 | Revenue Opportunity Map | Find creator-specific revenue opportunities |
| 08 | Experiment Lab | Test decisions and create evidence |
| 09 | Creator Command Brain | Decide what matters most right now |
| 10 | Channel Flywheel | Find the weakest part of the growth system |

---

# Product-Level Goal

The Studio Hub should make ViewTube feel like a creator operating system rather than a collection of analytics pages.

The intended loop is:

**Discover → Understand → Decide → Plan → Produce → Publish → Engage → Measure → Experiment → Revenue → Reinvest → Learn → Decide**

The ten tools specialize each part of that loop while sharing the same creator context, evidence, Projects, assets, analytics, and AI Brain.
