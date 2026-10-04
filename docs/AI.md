# ViewTube AI Brain

**Status:** IMPLEMENTED / EXPANDING ARCHITECTURE  
**Purpose:** Canonical high-level authority for ViewTube's Brain/AI intelligence layer.

## 1. Role

The Brain is the central intelligence and relationship layer for ViewTube, not merely a chatbot or document-retrieval feature.

Its major inputs are:

- Resource Library knowledge;
- current analytics/evidence;
- research;
- creator context;
- assets and metadata;
- projects;
- tools and system capabilities.

## 2. Architecture

```text
Question / Goal
      ↓
Task / Intent
      ↓
Evidence Requirements
      ↓
Knowledge + Evidence + Research + Context
      ↓
BrainContextBroker
      ↓
Model Gateway
      ↓
Evidence-grounded response
      ↓
Recommendation / Controlled Action
      ↓
Verification + Learning
```

## 3. Knowledge classes

**Knowledge:** Resource Library principles, definitions, frameworks and playbooks.

**Evidence:** current creator/channel/video/audience data.

**Research:** current external and platform information.

**Context:** goals, projects, preferences, constraints and decisions.

**System:** capabilities, permissions and freshness.

The Brain must keep these classes distinguishable.

## 4. Core components

- BrainOrchestrator
- BrainContextBroker
- resource knowledge retrieval
- creator context
- analytics/evidence context
- research context
- model gateway
- tool/action layer

The BrainContextBroker is the key convergence point.

## 5. Resource Knowledge pipeline

```text
Resources
 ↓
Candidate extraction
 ↓
Classification
 ↓
Approval / contextual qualification
 ↓
Compiled index
 ↓
Bounded retrieval
 ↓
Task-aware retrieval
 ↓
Brain
```

Runtime resource content belongs under the application/runtime resource system rather than making `docs/` a runtime dependency.

## 6. Analytics relationship

Analytics answers **what is happening**.

Resource Knowledge answers **how to interpret it**.

Research answers **what has changed externally**.

The Brain combines these with creator context to produce actionable reasoning.

## 7. Action model

The intended controlled action loop is:

```text
observe
→ diagnose
→ research
→ recommend
→ request confirmation
→ execute
→ verify
```

Consequential actions must remain explicitly controlled.

## 8. Knowledge quality

The architecture calls for:

- provenance;
- source confidence;
- freshness;
- contradiction detection;
- semantic relationships;
- bounded context;
- evidence ranking;
- citation-ready metadata.

## 9. Current state

Recovered repository evidence establishes Brain orchestration, BrainContextBroker architecture, Resource Library/retrieval systems and a developing knowledge-use policy.

Integration remains partial across analytics, research, creator context, tools, projects, assets and conversation continuity.

**Primary source:** `docs/VIEWTUBE_BRAIN_AI_SYSTEM_REPORT_2026-10-02.md`.
