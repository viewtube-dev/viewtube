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


## Phase 0–2 implementation branch — 2026-10-15

- Implementation receipt and baseline/PR #217 reconciliation: `tasks/ai-brain-quality/PHASES-0-2-EVIDENCE-CONTEXT-COMPLETION.md`.
- The shared evidence contract and task-aware final context resolver are implemented on `brain-phase-0-2-evidence-context`.
- Do not mark the work certified or merged until focused tests, typecheck, runtime lint, full suite, production build, and source-governance checks pass on the current target baseline.
- Remaining Phase 2 gaps are explicit in the completion record: canonical Project lookup from `projectId`, full per-capability evidence requirements, token-based budgeting, and Sidebar/Brain Hub parity.


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


## Phase 3 — Prompt governance

- [x] Version the prompt registry and declare required provenance/reachability fields.
- [x] Define prompt/constitution/context-resolver/schema versioning semantics and safe migration gates.
- [x] Document that registry status is inventory, not proof of runtime reachability or migration.
- [ ] Populate owner, production callers, prompt family/version, schema/context versions and reachability evidence for every production-reachable prompt/generator.
- [ ] Prove caller reachability and migrate families incrementally with fixtures and baseline comparisons.

## Phase 4 — Generation and validation loop

- [x] Record canonical task-profile → structured generation → deterministic evaluation → one bounded repair → independent revalidation → safe fallback contract.
- [x] Add regression coverage for wrong task mode and incomplete audience-task responses.
- [x] Preserve existing numeric-claim and creative-draft validation coverage.
- [ ] Test repair success, repair rejection and provider failure/fallback receipts.
- [ ] Verify generation provenance (prompt/schema/context/model, evidence, Project/ContentBuild and repair metadata) on real caller paths.
- [ ] Run focused Brain tests and golden suite, typecheck, runtime lint, full test suite, build, source-governance/reachability audit and diff checks.
- [ ] Attach exact-commit verification evidence before certification.
