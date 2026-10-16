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
- [x] Test repair success, repair rejection and provider failure/fallback receipts in `brainQualityLoop.test.ts` (all three passed in release-gates run 1297).
- [ ] Verify generation provenance (prompt/schema/context/model, evidence, Project/ContentBuild and repair metadata) on real caller paths.
- [ ] Run focused Brain tests and golden suite, typecheck, runtime lint, full test suite, build, source-governance/reachability audit and diff checks.
- [ ] Attach exact-commit verification evidence before certification.

## Phases 5–12 — cross-phase safety and behavioral audit (2026-10-15)

- [x] Add behavioral tests for repair success, repaired-candidate rejection, provider failure, safe fallback and turn receipt fields.
- [x] Add a Node contract audit for bounded generation/one repair/revalidation/fallback receipts (Phase 5).
- [x] Guard publication identity vs. measured performance/causality boundaries (Phases 6–7).
- [x] Guard continuity trace omissions and fail-closed Brain health status (Phases 8–9).
- [x] Guard canonical ContentBuild phase resolution and governed communication ingestion (Phases 10–11).
- [x] Guard channel-scoped explicit attribution and unresolved-stage reporting (Phase 12).
- [x] Execute `test:brain-quality-loop-contract` and `test:brain-quality-loop`; both passed on PR #310 head `d75850788c3f4c9e80108148845480e1306ba30a` (release-gates run 1297).
- [ ] Verify full prompt/schema/context/model/evidence provenance on real production caller paths.
- [ ] Finish live UI adoption, server-authoritative persistence/consent/retention, stable-ID propagation and production lifecycle validation noted in the individual phase sections.
- [x] Typecheck, production build, and local browser smoke passed on the same release-gates run.\n- [ ] Full phase certification remains blocked: broader focused-contract and full-suite jobs fail on existing UI/Vault/Studio contract mismatches; `test:confirmed-library-layout` fails on stale catalog assertions; `lint:runtime` reports 2,239 repository-wide errors. Reconcile those baseline failures and rerun governance/reachability plus the complete suite before certification.


## Follow-up implementation — provenance receipts and phase-10 contract fixtures (2026-10-15)

- [x] Version the canonical context resolver (brain-context-resolution-v1).
- [x] Add output-schema version, resolver version, evidence IDs, channel/project/ContentBuild scope, context budget, explicit model-identity availability, and repair outcome to Brain learning/turn receipts across success and fallback paths.
- [x] Record the requested model from the canonical Gemini model selector on production paths; injected test/custom generators are explicitly marked unknown, and served model remains null because the adapter does not expose it.
- [x] Correct the project lifecycle test to assert the canonical ContentBuild stage name (package).
- [x] Supply a canonical stage and workflow state in the project-context fixture; missing stage remains fail-closed in production.
- [ ] Run test:brain-quality-loop, project lifecycle/context tests, typecheck, and release gates on this exact branch.
- [ ] Expose the provider-reported served model version from the Gemini response without changing the structured output contract.
- [ ] Add project revision, style profile version, and selected/omitted context-section IDs only when their canonical source contracts are available.
- [ ] Full phases 5–12 remain uncertified until the live UI, durable server persistence/consent, stable-ID lifecycle propagation, and full-suite baseline failures listed above are resolved.


## Current integration reconciliation — 2026-10-15

- [x] Add capability-specific required-evidence mappings and tests for absent required sections.
- [x] Add bounded context token estimates, output reservation, safety margin, and selected/omitted-section reporting.
- [x] Resolve requested project IDs from the canonical Brain project index and pass that index through BrainRuntime and the three Brain chat surfaces.
- [x] Add authenticated user/channel-scoped durable learning-record read/write, retry queue, hydration, and regression tests.
- [x] Add default-off creator communication capture consent enforced inside the ingestion service.
- [x] Redact legacy raw creator communication text and stop retaining raw text in new communication events.
- [x] Surface the attribution detail panel in Brain Command Center.
- [ ] Run the release gates on the final exact commit and fix any Brain-specific failures.
- [ ] Run the durable-store Node tests independently before the Studio controls gate; the focused script now orders these tests before the known failing Studio gate.
- [ ] Validate PostgreSQL-backed persistence and authenticated channel isolation against a real test database.
- [ ] Complete stable-ID lifecycle propagation and production data verification before certification.

## Creator-context turn receipt provenance — current integration follow-up

- [x] Record the canonical Creator Context envelope version and profile/selection timestamps in successful, repaired, validation-fallback, and provider-error turn/learning receipts.
- [x] Preserve project-context source, style-profile availability, and bounded channel-knowledge/contradiction IDs without storing raw creator communications or inventing revision/model identifiers.
- [x] Add a populated-context regression fixture for the Brain quality loop.
- [ ] Verify exact-head focused Brain tests, typecheck, build, and release gates.
- [ ] Verify provider-served model identity only if the provider adapter exposes it.
- [ ] Propagate canonical project/ContentBuild revisions only from authoritative source contracts.
- [ ] Full phase certification remains blocked by live caller reachability, consent/persistence E2E, full-suite/runtime-lint debt, and real lifecycle lineage validation.
