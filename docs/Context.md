# ViewTube Context

**Status:** PROPOSED / CANONICAL MODEL TARGET  
**Purpose:** Establish the shared context model connecting identity, work, intelligence and actions.

## 1. Context hierarchy

```text
User
 ↓
Account / Identity
 ↓
Workspace
 ↓
Project
 ↓
Conversation / Task
 ↓
Content / Video
 ↓
Asset / Evidence
 ↓
Brain Context
```

Context may also include goals, preferences, constraints, audience, channel strategy, active experiments, decisions and relevant history.

## 2. Context classes

| Class | Examples |
|---|---|
| Identity | creator, account, permissions |
| Work | workspace, project, task, active workflow |
| Content | video, Shorts, topic, series, metadata |
| Asset | thumbnail, transcript, media, derivative |
| Evidence | analytics, channel data, observations |
| Knowledge | Resource Library principles and definitions |
| Research | current external/platform information |
| System | capabilities, tools, freshness, permissions |
| Conversation | goals, decisions, constraints, open questions |

## 3. Context selection

Context should be:

- structured;
- scoped;
- freshness-aware;
- permission-aware;
- task-relevant;
- bounded.

The BrainContextBroker is the intended convergence point for assembling this context.

## 4. Evidence versus knowledge

Static knowledge must not be presented as current creator-specific evidence.

```text
Knowledge → interpretation
Evidence  → what is happening
Research  → what changed externally
Context   → why it matters here
```

These classes should remain distinguishable through the Brain pipeline.

## 5. Provenance

Every important context item should be attributable to an authoritative source and, where applicable, carry freshness/confidence information.

Target lifecycle:

```text
Source → Context → Reasoning → Decision → Action → Verification
```

## 6. Current state

The Context model is a cross-system architecture target, not yet a fully verified runtime contract.

It must be reconciled across Account, Brain, Conversation OS, Projects, Vault, Analytics and Creator Workspaces before implementation claims are made.

**Primary sources:** Brain/AI System Report; Creator Workspace recovery; recovery artifact inventory; Master System Rebuild Resource Plan.
