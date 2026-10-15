# ViewTube Brain Quality & Learning — Task List

## Evidence contract
- [x] Inventory canonical evidence types and producers (see `PHASES-0-2-EVIDENCE-CONTEXT-COMPLETION.md`).
- [x] Define additive epistemic/provenance projection (`BrainEvidenceContract.ts`).
- [x] Implement evidence-health calculation for coverage, missingness, stale state, scope and same-window conflicts.
- [x] Integrate evidence health and scoped claims into Brain context.
- [x] Add missing/scope/provenance regression tests (execution pending).

## Channel knowledge
- [ ] Inventory Channel Profile + learning governance types.
- [ ] Define typed Channel Knowledge projection.
- [ ] Add temporal/reinforcement/contradiction semantics.
- [ ] Add scoped retrieval.
- [ ] Connect governed promotion.

## Context + prompts
- [ ] Capability-specific context requirements.
- [x] Task-aware ranking/deduplication/character budget and explicit omission reporting (`BrainContextResolution.ts`; test execution pending).
- [ ] Prompt inventory.
- [ ] Prompt constitution.
- [ ] Versioned prompt families + provenance.

## Quality + outcomes
- [ ] Task-specific quality-loop profiles.
- [ ] Deterministic validators.
- [ ] Evidence-backed critique.
- [ ] Outcome attribution completeness.
- [ ] Cohort/window evaluation.

## Learning + assistant
- [ ] Learning candidate reinforcement.
- [ ] Promotion/hold/reject/supersede flow.
- [ ] Knowledge decay/review.
- [ ] Shared assistant context resolver.
- [ ] Explainability/Brain health surface.

## Final gates
- [ ] No parallel canonical owner introduced.
- [ ] No model direct-write path to validated learning.
- [ ] No missing evidence coerced to zero.
- [ ] Every promoted learning traces to evidence/outcomes.
- [ ] Focused tests/typecheck/build green versus current-main baseline.


## Prompt registry/reachability expansion
- [ ] Audit every registry entry for production callers.
- [ ] Assign owner/family/version/schema/context recipe to every reachable prompt.
- [ ] Mark aliases and dead exports separately.
- [ ] Migrate unsafe legacy prompt rules into canonical Prompt Constitution/families.
- [ ] Establish rich/sparse/empty/stale/disabled prompt eval baselines.
- [ ] Remove legacy prompt paths only after zero production reachability.


## Phase 0–2 implementation and current-target reconciliation — 2026-10-15

- Historical implementation receipt: `tasks/ai-brain-quality/PHASES-0-2-EVIDENCE-CONTEXT-COMPLETION.md`.
- Current integration audit: `tasks/ai-brain-quality/PHASES-0-2-CURRENT-INTEGRATION-RECONCILIATION-2026-10-15.md`.
- The shared evidence contract and task-aware context resolver are present on `master/consolidated-feature-integration`; the old implementation branch is a donor only and must not be merged wholesale.
- Phase 0 ownership inventory and Phase 1 evidence-contract foundations are present; neither is release-certified until current-target checks run.
- Phase 2 remains open for canonical Project lookup from `projectId`, a complete per-capability evidence requirements matrix, supported model-aware token budgeting, Sidebar/Brain Hub/full-workspace parity, and representative runtime isolation tests.
- Do not mark the work certified until focused tests, typecheck, runtime lint, full suite, production build, source-governance/reachability checks, and same-day baseline comparison pass.


## Phase 6–7 implementation branch — 2026-10-15

- Implementation receipt: `tasks/ai-brain-quality/PHASES-6-7-PUBLICATION-OUTCOME-EVALUATION-COMPLETION.md`.
- Publication identity receipts now bind the completed publish transaction to the verified YouTube video and approved snapshot hash; these receipts explicitly do not claim performance or causality.
- Video-level canonical analytics now fail closed when the exact video row is missing; channel aggregates cannot be used as a substitute.
- Certification remains pending: durable server persistence, real snapshot/baseline checks, production integration tests, and branch CI/typecheck/build.


## Phase 8 — Assistant continuity (2026-10-15)

- [x] Add a shared continuity envelope with normalized page/tool/channel/project/build/video context.
- [x] Reuse the canonical task-aware context resolver and return selected/omitted section trace.
- [x] Add explicit limitations when scope or evidence identifiers are absent.
- [x] Add regression tests for trace and budget behavior (execution pending).
- [ ] Wire the trace through Sidebar, Brain Hub, and full Brain workspace callers.
- [ ] Verify creator preferences remain distinct from performance-derived learning.
- [ ] Browser/mobile test the same question across assistant surfaces.

## Phase 9 — Brain health and certification (2026-10-15)

- [x] Add a read-only health snapshot projection for evidence, knowledge, evaluation backlog, and learning-review states.
- [x] Add reusable Brain Health panel with status, counts, and alerts.
- [x] Fail closed to `insufficient_data` when evidence health is unavailable.
- [ ] Connect canonical live source adapters and embed the panel in the Brain workspace.
- [ ] Run focused tests, typecheck, full suite, production build, reachability/governance audits, and diff checks.
- [ ] Compare failures against the current integration baseline and record certification receipt.
- [ ] Reconcile branch conflicts and obtain review before merge.


## Phase 10 — Project-centered creation workflow

- [x] Resolve current project phase from canonical ContentBuild stage.
- [x] Return phase-relevant capabilities and workflow blockers.
- [x] Fail closed when canonical ContentBuild state is unavailable.
- [x] Add project context regression tests.
- [x] Include canonical lifecycle phase, relevant capabilities and blockers in BrainContextBroker prompt context.\n- [ ] Enforce phase capabilities in live UI/tool affordances.
- [ ] Verify all project surfaces provide the canonical ContentBuild snapshot.

## Phase 11 — Communication ingestion

- [x] Add multi-label classification for creator communication categories.
- [x] Record classified communication as an immutable intelligence evidence event.
- [x] Make communication identity idempotent and reject conflicting replays.
- [x] Explicitly prevent automatic durable-memory promotion.
- [x] Connect Sidebar Copilot, AI Brain, and Brain Hub chat messages behind personalization and learn-from-interactions controls.\n- [ ] Connect non-chat tool feedback, approval/rejection and edit events.
- [ ] Confirm privacy, consent, retention and durable persistence behavior.

## Phase 12 — Recommendation and asset attribution

- [x] Resolve attribution chains from recommendation through decision, execution, publication, outcome and learning candidate.
- [x] Use explicit event ancestry and exact stable identity fields; reject cross-channel links.
- [x] Report missing stages without time-based inference.
- [ ] Complete stable-ID propagation across generation, selected variants, ActionPackets, publish, evaluation and learning writers.
- [ ] Surface the attribution chain in the live Brain/Studio UI.
- [ ] Validate against real lifecycle data and run focused tests/typecheck/full suite/build/governance checks.
