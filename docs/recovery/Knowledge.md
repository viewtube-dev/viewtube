# ViewTube Knowledge Operating System

**Purpose:** The canonical system for turning conversations, code, audits, plans, ideas, failures, and implementation evidence into organized, reusable ViewTube project intelligence.

## 1. Core principle
Chat is a discovery surface. GitHub is the durable knowledge system.

Every material contribution follows:
**CAPTURE → CLASSIFY → PRESERVE → CONNECT → EVALUATE → DECIDE → IMPLEMENT → VERIFY → REUSE**

Do not let important knowledge remain only in a conversation.

## 2. Knowledge layers
- **Source / Evidence:** conversation evidence, repository/code evidence, tests/builds/deployments, external evidence, artifacts, exact identifiers.
- **Findings:** bugs, code-structure issues, architecture discoveries, UX problems, performance/security/reliability issues, data/model problems, workflow/handoff problems, AI-system problems.
- **Knowledge:** architecture, systems, tools, design system, data models, workflows, integrations, governance, technical constraints.
- **Decisions:** approved decisions, rejected approaches, constraints, tradeoffs, priorities, superseded decisions.
- **Plans / Opportunities:** plans, improvements, new tools, experiments, optimizations, roadmap candidates.
- **Implementation / Verification:** code changes, files, tests, builds, deployments, verification, measured results.
- **Handoffs / Active Work:** current state, next action, blockers, dependencies, exact paths and commits, unresolved questions.

## 3. Canonical repository structure
Use an existing project document when one already owns the subject. Recovery documentation must not create competing authorities.

    docs/recovery/
      Index.md
      Agent.md
      Playbook.md
      Knowledge.md
      Findings.md
      Handoff.md
      [project knowledge, plans, audits, design, architecture, implementation, and historical records]

## 4. Document selection rules
- Existing canonical document → update it.
- Several related documents → consolidate into the authoritative document and preserve source history.
- No canonical document → create one in the appropriate domain.
- Conversation-specific evidence that should not become canonical → a flat recovery/handoff artifact.
- Superseded material → mark `SUPERSEDED` or retain as historical evidence; do not create unnecessary archive folders.

Never create multiple documents that compete to define the same system without explicitly declaring their relationship.

## 5. Finding lifecycle
**OBSERVED → CLASSIFIED → EVIDENCED → EVALUATED → DECIDED → IMPLEMENTED → VERIFIED**

Not every finding reaches implementation. Ideas may remain PROPOSED; unresolved facts may remain UNKNOWN; failures remain valuable evidence.

## 6. Finding classes
BUG · REGRESSION · CODE_STRUCTURE · ARCHITECTURE · TOOL_IMPROVEMENT · NEW_TOOL · WORKFLOW · HANDOFF · AI_IMPROVEMENT · UX_PRODUCT · PERFORMANCE · SECURITY_RELIABILITY · DATA_MODEL · TESTING_VERIFICATION · DEPENDENCY · DEPLOYMENT

## 7. Evidence and status
Use the recovery status vocabulary: VERIFIED, REPORTED, INFERRED, PROPOSED, IMPLEMENTED, VERIFIED IMPLEMENTATION, FAILED, BLOCKED, SUPERSEDED, UNKNOWN.

Preserve: SOURCE → DISCOVERY → DECISION → IMPLEMENTATION → VERIFICATION.

## 8. Optimization loop
Every conversation and major engineering task should ask:
1. What exists?
2. What works?
3. What is broken?
4. What is unnecessarily complicated?
5. What is duplicated?
6. What is missing?
7. What should be improved?
8. What new tool or capability would remove recurring friction?
9. What could be automated?
10. What should the next agent know?
11. What evidence would prove the change worked?

## 9. Round 1 / Round 2
**Round 1:** preserve evidence and unique contributions without prematurely reconciling conflicts.
**Round 2:** consolidate duplicates, reconcile contradictions, establish authoritative versions, and convert scattered knowledge into coherent system documents.

## 10. Quality gate
A contribution is complete only when it has durable artifact(s), correct classification, provenance, status, related links, findings/opportunities, exact changed paths, verification state, and a next action or explicit closure.

The goal is **maximum reusable project intelligence with minimum duplication and ambiguity**.
