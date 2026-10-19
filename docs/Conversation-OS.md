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
