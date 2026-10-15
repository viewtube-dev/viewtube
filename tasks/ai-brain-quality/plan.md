# Implementation Plan — ViewTube Brain Quality & Learning

Date: 2026-09-24
Status: phased implementation in progress; see dated completion receipts. Phase 8–9 helpers are on `brain-phase-0-2-evidence-context-reconciled`; live consumer adoption and certification remain gated on repository checks.

## Architecture
Canonical data → evidence-contract → channel-knowledge → task context resolver → prompt system → AI quality loop → creator action → outcome evaluation → learning governance → Channel Profile.

## Wave 1 — Evidence quality
1. Inventory current evidence types/builders and map them to the shared epistemic contract.
2. Add an additive evidence projection/adapter rather than replacing analytics-canon contracts.
3. Add evidence-health calculation: coverage, freshness, scope, missingness, contradiction.
4. Integrate bounded evidence health into BrainContextBroker/BrainRuntime.
5. Add architecture tests for scope/provenance and missing != zero.

Checkpoint: no model behavior regression; analytics-canon remains sole normalized analytics owner.

## Wave 2 — Channel knowledge
6. Inventory ChannelProfileAdapter and existing learning/governance records.
7. Add typed knowledge projection and temporal metadata under Channel Profile ownership.
8. Add reinforcement/contradiction/supersession rules.
9. Add task-scoped knowledge retrieval.
10. Connect governed learning promotion to typed Channel Knowledge.

Checkpoint: model cannot directly write validated learning.

## Wave 3 — Context resolution
11. Define task context requirements by Brain capability.
12. Rank evidence/knowledge by relevance, confidence, freshness and scope.
13. Deduplicate and expose contradictions.
14. Add token/context budgets and explicit omissions.
15. Replace broad context assembly incrementally.

## Wave 4 — Prompt system
16. Inventory creator-facing prompts and direct Gemini generation paths.
17. Introduce shared prompt constitution.
18. Split prompts into versioned families: evidence, analytics, audience, strategy, packaging, content, community, critique, evaluation.
19. Store prompt/schema/context-resolver versions with generation provenance.
20. Remove unsupported causal claims, fabricated SEO metrics and pseudo-precision.

## Wave 5 — AI quality loop
21. Define task profiles: direct, generate+validate, strategy+generate+critique+validate+revise.
22. Add deterministic validators for structural constraints.
23. Add evidence-backed critique for high-value outputs.
24. Require package-level title/thumbnail/hook evaluation where applicable.
25. Measure retry/revision cost and avoid unnecessary multi-pass generation.

## Wave 6 — Outcome evaluation
26. Preserve recommendation/generation/package identity into creator decisions and verified publication; bind completed publication to ContentBuild, package, YouTube video, approved snapshot/hash and locked assets. (Foundation added; see Phase 6–7 receipt.)
27. Evaluate at appropriate windows (1h/6h/24h/72h/7d/28d where supported), requiring the exact video row for video-scoped metrics. (Fail-closed row resolution added; production snapshot verification remains.)
28. Compare against correct format/topic/traffic/duration cohorts and explicit baseline snapshots.
29. Separate observed results, comparison, interpretation and causal claims.
30. Surface unattributed outcomes and evaluation backlog; do not treat publication receipts as performance outcomes.

## Wave 7 — Governed learning
31. Create/reuse learning candidates from evaluations.
32. Accumulate supporting and contradictory observations.
33. Apply promotion/hold/reject/supersede governance.
34. Promote only through canonical Channel Profile path.
35. Add stale-knowledge review/decay.

## Wave 8 — Assistant continuity
36. Give Sidebar/Brain Hub/full Brain workspace the same resolver and knowledge path.
37. Resolve current page/tool/project/video context.
38. Support explain-why/evidence trace for recommendations.
39. Learn creator preferences separately from performance learnings.
40. Add Brain health view: evidence coverage, stale knowledge, contradictions, evaluation backlog and learning candidates.

## Verification gates
Every behavioral slice: focused tests → architecture guards → typecheck → production build. UI slices additionally require browser/mobile verification. Compare failures against same-day main baseline.

## Rollout
Each wave lands as small reversible PRs. Current main is rebased/merged forward before each PR. Historical branches are donors only; never wholesale merge stale AI branches.


## Prompt modernization authority

Wave 4 and all later creator-generation migrations use these current references:

> The dated Prompt Improvement Program is donor/provenance. Durable prompt behavior is owned by `docs/specifications/PROMPTS.md`; exact work state should be reconciled into the Integrated Application Program / Task Index.

- `docs/specifications/PROMPTS.md`
- `docs/brain/VIEWTUBE_PROMPT_IMPROVEMENT_PROGRAM_2026-09-24.md`
- `docs/specifications/prompt-registry.json`

The registry expands the original Brain-only Prompt System wave to cover legacy `prompts.ts`, legacy `gemini.ts` generation/refinement functions, Oracle/editor prompt templates, Brain task profiles and governed AssetGenerator strategies. Do not create a second prompt modernization track.


## Phase 8 — Assistant continuity implementation update (2026-10-15)

- Added `BrainAssistantContinuity.ts`: shared task-profile/context-budget resolution, normalized channel/project/build/video scope, selected/omitted section trace, and explicit missing-scope/evidence limitations.
- Added deterministic regression tests for task selection, trace identifiers, missing scope, and budget omissions.
- Existing `BrainContextBroker` / `runBrainTask` remain the canonical orchestration path; the helper is additive and does not introduce a second context or memory store.
- Still required before Phase 8 can be certified: adopt the trace in each live Sidebar, Brain Hub, and full-workspace caller; confirm creator preferences remain separate from performance learning; browser/mobile verification.

## Phase 9 — Brain health and release certification

- Added `BrainHealthSnapshot.ts` as a read-only projection over canonical evidence health, Channel Knowledge records, evaluation backlog, and learning-review counts.
- Added reusable `BrainHealthPanel.tsx` for evidence coverage, stale knowledge, conflicts, overdue evaluations, unattributed outcomes, and learning-review backlog.
- Missing evidence health yields `insufficient_data`; the view never promotes learning or infers causality.
- Certification remains blocked until live source adapters feed the health projection, the panel is wired into the canonical Brain surface, focused tests/typecheck/full suite/build and governance checks run green, and the feature branch is reconciled with its target.


## Phase 10 — Project-centered creation workflow (2026-10-15)

- Added `BrainProjectLifecycle.ts`, resolving the active phase from the canonical ContentBuild stage, returning only the capabilities relevant to that stage, and preserving workflow blockers.
- Attached lifecycle resolution to the existing `AlgorithmProjectContext` via `BrainProjectContext`; no second project-stage owner was introduced.
- Missing canonical ContentBuild state returns `insufficient_context`; the resolver does not guess from route labels or stale visible UI context.
- Tests specify canonical-stage mapping, stage-scoped capabilities, blockers, audience-promise presence, and fail-closed behavior.
- The canonical phase now enters BrainContextBroker's active project context and prompt policy. Still required: enforce the capability list in live UI/tool affordances and verify every project screen passes the canonical ContentBuild snapshot.

## Phase 11 — Communication ingestion (2026-10-15)

- Added deterministic multi-label classification for instruction, preference, correction, criticism, factual claim, goal, constraint, approval, rejection, experiment note, and style feedback.
- Added `recordCreatorCommunicationEvidence`, which writes an immutable `CREATOR_COMMUNICATION_CLASSIFIED` event through the existing Brain intelligence ledger, with idempotent communication identity and related event links.
- Communication events explicitly set `durableMemoryPromoted: false` and `promotionRequiresGovernedReview: true`. Classification does not directly mutate Channel Profile or validated knowledge.
- Connected the Sidebar Copilot, full AI Brain, and Brain Hub chat send paths; capture is gated by enabled + personalization + learn-from-interactions controls, and neutral text is not classified as a fact. Still required: connect non-chat tool feedback, approval/rejection and edit flows; establish privacy/retention policy and verify server persistence/consent boundaries.

## Phase 12 — Recommendation and asset attribution (2026-10-15)

- Added `BrainAttributionChain.ts`, a read-only resolver joining recommendation → creator decision → execution → publication → measured outcome → learning candidate by explicit parent/event IDs and exact stable identity fields.
- The resolver rejects cross-channel joins and never infers causality or joins solely by timestamp or shared project membership.
- Incomplete chains report missing stages rather than fabricating success. Publication confirmation remains lifecycle evidence, not performance proof.
- Existing recommendation-decision and publication event contracts remain the writers; the resolver does not create a parallel ledger.
- Still required: wire all generation/selection/action-packet/publish/evaluation/learning writers to stable common IDs and surface the chain in the live Brain/Studio UI; validate against production lifecycle data.

## Phase 10–12 certification gate

The implementation and initial live wiring are committed on `brain-phases-10-12-project-comms-attribution`. Regression tests have been authored but not executed in this session. Do not certify complete until focused tests, typecheck, full suite, production build, reachability/governance audits, and browser verification pass on the current integration baseline.


## Phase 3 — Prompt governance reconciliation (2026-10-15)

- Updated `docs/specifications/prompt-registry.json` to registry v3 with an explicit governance contract: required provenance fields, reachability states, migration gates, versioning rules and safety invariants.
- Updated `docs/specifications/PROMPTS.md` with the governed registry contract and a reachability-based migration gate.
- The registry inventory currently includes 49 legacy prompt constants and 14 Brain task profiles. The governance contract is defined, but production caller reachability and per-entry provenance are not yet fully populated/certified.
- Do not remove or redirect legacy prompt/provider paths until callers are identified, representative fixtures exist, output baselines are compared, and zero legacy production reachability is demonstrated.

## Phase 4 — Generation and validation loop (2026-10-15)

- The canonical `BrainOrchestrator` already performs task-profile routing, structured output normalization, deterministic response evaluation, one bounded repair attempt, independent repaired-candidate validation, safe fallback on failed repair/provider errors, and turn metadata recording.
- Added regression tests for task-mode mismatch and audience-task completeness alongside existing tests for invented numeric claims in structured output and valid creative drafts containing numbers.
- Updated the prompt specification with the bounded generation/repair/fallback contract and the certification matrix.
- Still required: execute focused tests and the representative Brain golden suite; test repair-success/repair-rejection/provider-failure paths; verify prompt/schema/context/model provenance fields are consistently present in real turn receipts; inspect live caller reachability; run typecheck, runtime lint, full suite, production build and governance audits.

## Phase 3–4 certification gate

This work is implemented as an additive registry/specification update and validator regression-test slice on `work/brain-quality-phases-3-4-2026-10-15`. It is **not certified complete** until the test and build evidence above is attached to the exact reviewed commit. The prompt registry's declared contract must not be confused with complete per-entry population or proven production migration.


## Current integration reconciliation — 2026-10-15

- Added capability-to-evidence requirements and explicit missing-evidence reporting; context resolution now supports a conservative character/token budget with reserved output and safety margin.
- Passed the canonical Brain project index through the chat surfaces and runtime; exact project IDs resolve against the index instead of falling back to a neighboring active project.
- Added authenticated, user-and-channel-scoped persistence for typed learning records, with idempotent record keys and hydration into outcome, evaluation, asset-outcome, and learning-candidate ledgers.
- Added a default-off per-channel creator-communication capture control, service-level consent enforcement, fingerprint-only new records, and migration redaction for legacy raw communication text.
- Connected the attribution detail panel to the Brain Command Center.
- **Certification remains open.** The release-gates run for the current implementation passes the Brain quality loop, production build, and local browser smoke. Focused contracts still fail in unrelated Studio controls/catalog assertions; typecheck reports existing Studio dropdown and action-packet projection errors; source-governance reports four stale Studio library-layout assertions. Full-suite verification and database-backed persistence validation remain required.
