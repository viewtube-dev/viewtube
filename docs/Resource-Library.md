# ViewTube Resource Library

**Status:** IMPLEMENTED / EXPANDING  
**Scope:** reusable knowledge and resource system

## Purpose
The Resource Library provides governed documentation, guides, references, playbooks and reusable creator resources.

## Runtime boundary
Runtime resource content belongs under the application/runtime resource system. Documentation under `docs/` must not become an accidental runtime dependency.

## Knowledge pipeline
```text
Resources
 ↓
Candidate extraction
 ↓
Classification
 ↓
Approval / contextual qualification
 ↓
Compiled knowledge index
 ↓
Bounded retrieval
 ↓
Task-aware retrieval
 ↓
Brain
```

Recovered Brain architecture identifies a 15-resource corpus and a 120-candidate extraction corpus with approved, contextual and rejected classifications.

## Knowledge policy
- Resource Library: principles, definitions, frameworks and general explanations.
- Analytics: current creator/channel observations.
- Research: current external/platform information.
- Context: creator goals, projects, preferences and constraints.

Static Resource Library knowledge must not be presented as current creator-specific evidence without supporting evidence.

## Connections
Resource Library connects to AI Brain, Projects, Analytics, Vault, Editor and Studio Hub.

## Current improvement areas
- concept clustering;
- related-resource retrieval;
- semantic ranking;
- provenance;
- source confidence;
- freshness;
- contradiction detection;
- citation-ready metadata;
- usage telemetry.

## Current state
The repository establishes Resource Library runtime architecture and retrieval work, while semantic knowledge improvements remain expanding work.

**Primary source:** ViewTube Brain & AI System Report.
