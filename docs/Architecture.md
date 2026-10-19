# ViewTube Architecture

**Status:** PROPOSED / CANONICAL ARCHITECTURE BACKBONE  
**Purpose:** Define the cross-system relationships and authority boundaries for ViewTube without replacing subsystem-specific implementation documents.

## 1. System backbone

```text
Account / Identity
        ↓
Context
        ↓
AI Brain
        ↓
UI + Toolbox
        ↓
Analytics / Projects / Studio Hub / Vault / Editor
```

The architecture is a coordination model. Each subsystem remains authoritative for its own data and implementation.

## 2. Core layers

| Layer | Responsibility |
|---|---|
| Account | identity, authentication, authorization, workspace/channel boundaries |
| Context | user, workspace, project, content, asset, conversation and task context |
| Brain | governed intelligence, knowledge, evidence, research, reasoning and actions |
| UI | primitives, styles, tokens, sizes and visual interaction patterns |
| Toolbox | reusable tools, SubToolboxes, widgets and capability surfaces |
| Analytics | synchronized data, evidence, intelligence and visualization |
| Projects | creator execution and work orchestration |
| Studio Hub | outcome-oriented intelligence tools |
| Vault | assets, metadata, lineage and media workflows |
| Editor | content creation/editing |
| Resource Library | governed knowledge inputs and reusable resources |

## 3. Canonical information flow

```text
Creator
  ↓
Account / Identity
  ↓
Workspace / Project / Context
  ↓
Tools + Analytics + Assets + Knowledge
  ↓
BrainContextBroker
  ↓
Brain / Model Gateway
  ↓
Recommendation / Decision / Action
  ↓
Project / Editor / Publishing / Verification
  ↓
Evidence + Learning
```

## 4. Brain relationship

The Brain must not duplicate every subsystem's database. It consumes governed contracts for:

- knowledge;
- current evidence;
- research;
- creator context;
- system capabilities;
- assets and metadata;
- projects and workflow state.

The Brain should return evidence-grounded reasoning, uncertainty, recommendations and controlled actions.

## 5. Authority rules

1. Current verified implementation outranks plans and recovery notes.
2. Each subject should have one canonical authority.
3. Runtime resources belong with runtime code; documentation must not become an accidental runtime dependency.
4. Recovery artifacts preserve evidence and uncertainty; they do not prove implementation.
5. Shared contracts should be documented once and reused.

## 6. Cross-system contract

The most important architectural seam is the context/evidence boundary:

```text
Account → Context → Evidence / Knowledge / Assets → Brain → Action
```

This prevents Dashboard, Toolbox, Chatbot and other surfaces from developing separate Brain logic.

## 7. Current reconciliation needs

- reconcile Account architecture with current auth/runtime code;
- establish the canonical Context model;
- reconcile UI Reference Library and Toolbox authority;
- map Analytics evidence contracts;
- reconcile Projects, Vault, Editor and Studio Hub;
- verify implementation against documentation before promoting proposed architecture to verified status.

**Primary sources:** Brain/AI System Report; Creator Workspaces Master Tool Context; Studio Hub Ten Tool Architecture; Master System Rebuild Resource Plan; recovery findings.
