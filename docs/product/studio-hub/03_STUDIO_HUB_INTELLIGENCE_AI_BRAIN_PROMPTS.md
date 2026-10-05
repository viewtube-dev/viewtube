# ViewTube Studio Hub — Intelligence, AI Generation, Prompts & AI Brain

**Status:** ACTIVE — canonical intelligence/AI integration target
**Date:** 2026-10-05

## Purpose
This document connects Studio Hub intelligence engines, AI generation behavior, default prompt architecture, and AI Brain read/write and validation.

The AI Brain is a durable knowledge layer, not a dump of every AI response.

## Intelligence lifecycle
Evidence → Observation → Signal → Hypothesis / Prediction → Finding → Validation → Knowledge → Decision → Action → Outcome → New Evidence

Validation states:
OBSERVATION, SIGNAL, HYPOTHESIS, PREDICTION, FINDING, VALIDATED, REJECTED, EXPIRED.

Only appropriately validated findings become durable Brain knowledge.

## Intelligence engines
| Engine | Transformation | AI role |
|---|---|---|
| Opportunity Radar | Signals → Opportunities | Detect, normalize, score, explain opportunities. |
| Content Architect | Opportunities → Concepts | Generate/evaluate concepts. |
| Video Genome | Content → Patterns | Extract structured content patterns. |
| Story Engine | Concepts → Narratives | Generate/evaluate StoryGraphs. |
| Asset Forge | Blueprints → Assets | Resolve/generate production assets. |
| Audience Pulse | Audience behavior → Relationship opportunities | Cluster, infer intent, rank relationship actions. |
| Content Autopilot | Published content → Derivatives | Extract additional value and generate follow-up packages. |
| Experiment Lab | Hypotheses → Learning | Design tests and evaluate evidence. |
| Causal Intelligence | Results → Explanations | Compare causal hypotheses and alternatives. |
| Channel Simulator | State → Scenarios | Model plausible futures with uncertainty. |
| Revenue Architect | Intelligence → Revenue opportunities | Match capabilities/audience/assets to revenue models. |
| Channel Flywheel | Channel → Bottleneck | Diagnose system constraint. |
| Creator Strategy Engine | Validated intelligence → Next best move | Cross-tool prioritization. |

## AI generation architecture
Every generation receives structured context rather than an opaque text dump.

### Generation context
- creator/account identity and permission scope;
- current project, when applicable;
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

### Generation stages
Context assembly → Evidence selection → Brain retrieval → Prompt construction → AI generation → Schema validation → Evidence/provenance attachment → User review → Optional validation → Handoff/Brain candidate

## Default prompt contract
### SYSTEM
You are operating as the named ViewTube Studio Hub specialist. Perform only the transformation owned by this tool. Do not silently take ownership of another tool's decision.

### CONTEXT
Use the supplied creator, project, audience, content, goals, constraints, assets, analytics, and Brain context.

### EVIDENCE
Separate observed evidence from interpretation. Cite supplied evidence references where available. Do not invent missing facts.

### TASK
Perform the tool's primary transformation.

### CONSTRAINTS
Respect creator goals, ownership boundaries, permissions, evidence quality, uncertainty, and output schema.

### OUTPUT
Return the canonical typed result, confidence, uncertainty, assumptions, recommended actions, provenance, and validation state.

### HANDOFF
State which downstream tool can use the result and why, without changing ownership.

## Default specialist prompt patterns
### Opportunity Radar
Identify and rank emerging opportunities from evidence. Return opportunity, evidence, audience demand, value, effort, freshness, confidence, expiration, recommended action.

### Content Architect
Turn a qualified opportunity into differentiated content concepts. Return premise, audience, problem/desire, promise, format, hook, differentiation, evidence, expected outcome, effort, confidence.

### Video Genome
Decompose existing content and detect reusable patterns. Return source references, features, structural patterns, performance relationships, evidence quality, uncertainty. Never state correlation as causation.

### Story Engine
Turn a concept into an executable narrative. Return StoryGraph, beats, hook, escalation, retention hypotheses, visual/audio mapping, payoff, CTA, production requirements.

### Asset Forge
Resolve production requirements into an asset package. Return asset requirements, reuse candidates, generated/acquired candidates, purpose mapping, provenance, validation status.

### Audience Pulse
Transform audience behavior into relationship opportunities. Return audience signal, intent, relationship state, evidence, urgency, recommended action.

### Content Autopilot
Extract additional value from published content. Return source reference, derivative/follow-up candidate, expected value, effort, evidence, package recommendation.

### Experiment Lab
Convert uncertainty into a testable experiment. Return hypothesis, baseline, variable, control, variants, metric, duration, sample requirements, analysis plan, success/failure criteria.

### Causal Intelligence
Investigate probable explanations for observed outcomes. Return outcome, baseline, changed variables, causal hypotheses, evidence ranking, alternatives, confidence, uncertainty.

### Channel Simulator
Compare plausible future scenarios. Return assumptions, scenario variables, ranges/distributions, confidence, sensitivity, evidence basis.

### Revenue Architect
Identify and plan creator-specific monetization opportunities. Return revenue model, audience/value fit, economics, effort, risk, scenario, plan, evidence.

### Channel Flywheel
Identify the weakest growth-system stage. Return stage health, bottleneck, evidence, impact, diagnostic need. Do not claim causality.

### Creator Strategy Engine
Prioritize the next best move from validated intelligence and creator constraints. Return action, rationale, evidence, expected impact, confidence, effort, urgency, dependencies, affected tools, project handoff.

## AI Brain connection
### Read path
Tools may read validated creator-specific knowledge, audience patterns, content patterns, production conventions, experiment learnings, causal findings, revenue learnings, creator goals, and durable constraints.

### Write path
Tool outputs become Brain candidates only when validation requirements are met.

Tool output → Evidence → Interpretation → Hypothesis/Prediction → Finding → Validation → Brain Knowledge

Raw observations remain evidence. Predictions remain predictions. Hypotheses remain hypotheses.

### Knowledge candidate
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

## Brain governance
Durable knowledge preserves source tool, source version, creator/account scope, evidence, validation state, confidence, uncertainty, timestamp, expiration when applicable, provenance, and affected tools.

The Brain must not overwrite a verified finding with unsupported generation.

## Intelligence envelope
~~~text
StudioIntelligenceEnvelope {
  id
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

## Learning loop
Plan → Create → Publish → Measure → Explain → Learn → Improve → Plan

Examples:
- Content performance → Causal Intelligence → validated finding → AI Brain → Content Architect.
- Audience response → Audience Pulse → content opportunity → Content Architect.
- Experiment result → Experiment Lab → validated learning → AI Brain → future experiments.
- Revenue result → Revenue Architect → validated economics → AI Brain.
- Growth bottleneck → Channel Flywheel → Causal Intelligence → Experiment Lab → Strategy.

## AI quality boundaries
- Never invent evidence.
- Never treat predictions as facts.
- Never treat correlation as causation.
- Never write raw AI output directly into durable knowledge.
- Never silently change another tool's ownership.
- Preserve provenance through every generation.
- Show uncertainty when evidence is weak.
- Require user control for high-impact promotion where appropriate.
