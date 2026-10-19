---
name: viewtube-ai-brain-improvement
description: Use when planning, auditing, implementing, reviewing, or updating ViewTube AI Brain chat, evidence, context, capabilities, analytics reasoning, provenance, outputs, or learning governance.
---

# ViewTube AI Brain Improvement Workflow

## Mission
Improve the existing ViewTube AI Brain by extending canonical owners and existing runtime systems. Do not create a new Brain runtime, database, parallel memory store, analytics engine, or duplicate capability registry.

## Start every task
1. Confirm repository viewtube-dev/viewtube and target branch master/consolidated-feature-integration.
2. Read docs/brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md, docs/brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md, and docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md.
3. Inspect the actual target branch, implementation, neighboring tests and history before assuming a feature is missing. Historical docs are not proof of current status.
4. Map each requirement to canonical owner, code foothold, UI surface, provenance ID, governance boundary, test and rollback strategy.
5. Separate verified facts, hypotheses, proposals and blockers.

## Non-negotiable contracts
- Preserve creator raw message exactly. Presentation sanitization must never mutate learning, evidence matching or follow-up inputs.
- Never invent analytics, readiness, confidence, model identity, receipts, saved outputs or operation success.
- Evidence shown must come from the exact evidence pack supplied to the relevant turn and retain canonical IDs.
- Prompt evidence and its grade must use the same ordered `EvidenceRecord[]`; if the grade is missing or its IDs/fingerprint differ from the records being rendered, fail closed and omit analytics-derived claims.
- Reuse synced inventories and turn-bound cohorts; preserve filters for later evidence navigation.
- Readiness and numerical answers must be constrained by real missing-input diagnostics and existing capability evidence requirements.
- Reuse CreatorContextResolver/envelope, BrainCapabilityRegistry, BrainRuntimeSnapshot/traces, ToolReceipts, ContentBuild and learning governance.
- Tool handoffs remain review-only unless a distinct existing approved-action contract says otherwise. Opening a tool is never publication approval.
- Learning candidates remain candidates until canonical governance changes their state. Approval for review is not durable knowledge promotion.
- Retry generation only; never replay external side effects automatically.
- Do not expose private chain-of-thought. Provenance may include capability IDs, evidence, prompt version, actual model served, operation state and output references.
- New controls follow Studio conventions and support keyboard use, screen readers, focus management, responsive layouts and reduced motion.

## Implementation loop
1. Scope numbered requirements and dependencies; keep diffs surgical.
2. Discover source, types, owners, registries, tests, feature flags and route contracts.
3. Map exact files and canonical data path. Flag unreachable donor helpers before wiring them.
4. Test first: add a regression test that fails for the reported defect.
5. Implement by reusing existing contracts; avoid new storage or parallel logic.
6. Verify focused tests, conversation restore, tool-route, learning-governance, typecheck, lint/source-governance and production build as applicable.
7. Audit UI for fake state, misleading empty panels, inaccessible controls, dead links and lost filters. Test keyboard-only and mobile layout.
8. Confirm every shown evidence/output/receipt/context item resolves to a canonical ID.
9. Review behavior changes, files, tests, known failures, compatibility impact and rollback.
10. Ship focused commits mapped to numbered requirements.

## UI patterns
- **Based on:** only evidence supplied to current turn; 3–5 items initially; expandable list; preserve IDs and filters.
- **Readiness:** canonical diagnostics; show stale/partial/missing metrics and link to exact inputs.
- **Context used:** exact envelope entries and confirmed/inferred/temporary status; corrections use existing governance paths.
- **How produced:** capability IDs, evidence returned/missing, prompt version, actual model served, operation status and output reference; no chain-of-thought.
- **Result cards:** real ToolReceipts and canonical output asset IDs; distinguish proposed, started and saved.
- **Learning cards:** canonical candidate list/review action; show scope/examples and update only after authoritative response.
- **Unavailable actions:** when useful, disable with truthful reason; never simulate readiness.

## Acceptance checklist
- [ ] Raw user text survives unchanged through storage and learning capture.
- [ ] Model history excludes non-conversation sources and is bounded by relevance/context budget.
- [ ] Evidence selection honors explicit count, format, date and ranking constraints.
- [ ] Missing/stale data constrains analytics and numerical claims.
- [ ] Evidence shown equals evidence supplied to the model.
- [ ] Context, profile and saved answers reconcile with actionable corrections.
- [ ] Retry does not replay side effects.
- [ ] Tool handoffs are review-only and retain origin/evidence IDs.
- [ ] Receipts and output cards are backed by canonical records.
- [ ] Learning review uses governance API and cannot silently promote durable knowledge.
- [ ] Keyboard/screen-reader and Studio visual conventions are verified.
- [ ] Conversation restore, tool routing and learning governance tests pass.
- [ ] Final report separates verified results from assumptions and pre-existing failures.

## Required final report
List requirement-to-commit mapping; files changed; canonical owners reused; tests actually run and results; evidence/provenance checks; accessibility checks; known failures and risks; deferred work and why. Never claim a test or browser check ran unless execution evidence confirms it.
