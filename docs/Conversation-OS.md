# ViewTube Conversation OS

**Status:** RECONSTRUCTION MASTER / RECONCILIATION REQUIRED  
**Authority:** canonical governance target for how ViewTube work is discovered, routed, executed, verified, and handed off.

## Purpose
Provide one executable operating model for ViewTube work without creating competing governance systems.

## Core execution model
1. Start from current `main`.
2. Route work by blast radius.
3. Load only task-relevant context.
4. Search existing resources before creating anything.
5. Identify the canonical authority.
6. Escalate consequential architecture, ownership, or destructive changes.
7. Verify with evidence proportional to risk.
8. Record exact status and identifiers.
9. Leave a resumable handoff.

## Work lanes
- **Lane 0:** trivial, low-risk operations.
- **Lane 1:** routine engineering and documentation work.
- **Lane 2:** governed/consequential work involving architecture, ownership, security, destructive changes, or other high blast radius.

Automatic escalation is required when the blast radius exceeds the current lane.

## Required governance modules
- blast-radius escalation;
- context proportionality;
- main-first discovery;
- source-of-truth hierarchy;
- reuse-before-create;
- GitHub prior-art/resource discovery;
- skill/tool/plugin selection;
- evidence-before-claims;
- risk-based verification;
- handoff/resumption;
- completion gates;
- user-facing receipts;
- proactive improvement and opportunity/risk records.

## Knowledge loop
`SOURCE → FINDING → KNOWLEDGE → DECISION → PLAN → IMPLEMENTATION → VERIFICATION → HANDOFF/REUSE`

## Evidence rule
Plans, branches, PRs, conversation responses, and recovery notes are not proof of implementation. Implementation claims require repository/runtime/test/deployment evidence appropriate to the claim.

## Context rule
Context should be proportional to the task. Prefer authoritative, relevant material over indiscriminate loading.

## Completion gate
Work is complete only when the requested artifact/change exists, its status is explicit, verification is recorded, changed paths/identifiers are known, unresolved issues are captured, and the next state can be resumed without relying on conversation memory.

## Current reconciliation state
The repository contains a Conversation OS reconstruction master plus Recovery and Brain/AI references. This file is the short canonical target; the detailed reconstruction remains source material until the governance model is fully reconciled.

**Primary source:** `docs/governance/CONVERSATION_OS_REBUILD_MASTER.md`.


## Mandatory conversation handoff and recovery log

Every material ViewTube conversation must leave a repository-resident, resumable record. Chat history is evidence, not durable project state.

### Start-of-work protocol
1. Read `Recovery.md` and `Recovery.yaml` before substantial work.
2. Identify the current repository integration target and fetch current source before editing. For this project, use `master/consolidated-feature-integration` unless the user explicitly changes the target.
3. Search existing docs, plans, handoffs, PRs, branches, and code before creating a new authority or duplicating work.
4. Separate user-approved decisions, reported observations, inferred causes, proposals, and verified implementation.

### Conversation capture protocol
Before ending a material conversation or handing work to another agent:
1. Inventory the entire available conversation for goals, requirements, constraints, decisions, rejected approaches, artifacts, code changes, branches, PRs, tests, failures, deployment observations, unresolved questions, and next actions.
2. Preserve provenance and exact identifiers. Do not turn an assistant statement or PR description into verified runtime evidence.
3. Create or update a scoped handoff under the existing recovery documentation convention. Use `docs/recovery/Handoff-<topic>-YYYYMMDD.md` unless an established domain path already owns the artifact.
4. Include an executive status, source/provenance, decisions, verified/not-verified split, changed paths, branch/PR/commit identifiers, conflicts, and ordered next actions.
5. Append a unique `REC-YYYYMMDD-<agent>-<sequence>` work-log entry to `Recovery.md`.
6. Register the same event and artifact in `Recovery.yaml`.
7. Register new durable documentation in `docs/DOCUMENTATION_REGISTRY.md` in the same PR.
8. Re-fetch each file immediately before writing and use its current blob SHA. If the SHA changes, stop and reconcile; never stale-write.

### Two-round recovery
- **Round 1 — independent capture:** preserve all unique conversation evidence, uncertainty, conflicts, and provenance. Do not prematurely choose between conflicting accounts.
- **Round 2 — reconciliation:** compare handoff claims against current target source, tests, PR merge-time diffs, current branch state, deployment/runtime evidence, and other recovery artifacts. Classify each item as PRESENT, MISSING, SUPERSEDED, CONFLICTING, or UNKNOWN. Promote an item to VERIFIED only when the evidence supports it.

### PR/branch reconciliation receipt
For every candidate PR, record current state, head/base SHA, changed paths, mergeability, full diff, and relevant checks. Classify each meaningful change as PRESENT, MISSING-UNIQUE, DUPLICATE, SUPERSEDED, CONFLICTING, or UNKNOWN. Port only useful missing changes to a fresh branch from the current integration target. Link source PRs and explain retained/discarded hunks in the replacement PR. Do not claim all unmerged work is migrated until the complete paginated candidate set has been inspected.

### Completion gate
A handoff is complete only when the durable artifact exists, Recovery.md and Recovery.yaml are synchronized, the documentation registry is updated when required, exact identifiers are recorded, verification limitations are explicit, and a future agent can resume without relying on chat history. A documentation handoff does not mean the underlying code task is complete.

**Operational companion:** `docs/recovery/AGENT_RECOVERY_PLAYBOOK.md` and `Recovery.md`.
