# AI Brain Channel Knowledge & Prompt Provenance — Phases 2/3 Execution

**Class:** AUDIT  
**Status:** ACTIVE — PHASE 2 CONTRACT RECONCILIATION STARTED; PHASE 3 PROMPT/PROVENANCE RECONCILIATION STARTED; IMPLEMENTATION GATES OPEN  
**Date:** 2026-11-11  
**Target:** `master/consolidated-feature-integration`  
**Target SHA inspected:** `a279e52e63e816c0409a02e2feb4807f20c56e4b`  
**Execution branch:** `docs/ai-brain-knowledge-evidence-consolidation-2026-11-11`  
**Authorities:** `docs/domains/BRAIN.md`, `docs/specifications/PROMPTS.md`, `docs/specifications/prompt-registry.json`, existing P1 Brain Quality and Brain Continuity workstreams

## 1. Scope and decision

This packet starts Phases 2 and 3 by reconciling the actual target-branch implementation footholds, identifying missing proofs, and defining implementation slices and acceptance gates.

It does not claim that runtime implementation is complete. No code behavior is changed by this packet. The next implementation pass must use test-first changes against the canonical owners already present.

**Non-negotiable ownership rule:** extend Channel Profile / Channel Knowledge, existing learning governance and persistence, Prompt System Authority, BrainTaskProfileRegistry, BrainModelGateway and BrainTrace. Do not add a second memory store, learning database, prompt registry, prompt authority, provider gateway, Brain runtime or context broker.

## 2. Phase 2 — Channel Knowledge and governed learning

### 2.1 Target-branch footholds inspected

| File / owner | Verified behavior in source | What this proves |
|---|---|---|
| `src/services/brain/ChannelKnowledgeProjection.ts` | Projects channel-scoped BrainMemoryClaim rows, ChannelKnowledgeModel hypotheses and learning candidates into a typed read projection. | A read projection already exists; no new knowledge store is needed. |
| Same | Preserves claim confirmation, evidence refs, validity dates, supersession links, source identity and contradiction markers. Expired claims become stale. | Useful epistemic and temporal metadata already has a projection path. |
| Same | Retrieval scores relevance, confidence and freshness; stale/superseded/rejected rows are not active by default; candidate and stale inclusion are explicit opt-ins. | Retrieval is bounded and defaults away from stale or unreviewed candidates. |
| Same | An `approve_for_profile_review` candidate remains `LEARNING_CANDIDATE`, lifecycle `candidate`, with `validated: false`. | Review approval is not promotion or validated learning. |
| `src/services/brain/__tests__/ChannelKnowledgeProjection.test.ts` | Tests explicit creator preference provenance, expired learning exclusion, supersession, approval-not-promotion, rejected history, contradiction surfacing and relevance ranking. | Existing projection invariants have focused unit coverage. |
| `src/services/brain/BrainLearningPersistence.ts` | Queues channel-bound outcome/evaluation/candidate envelopes locally, flushes batches to the existing `/api/brain-intelligence?channelId=` endpoint with credentials, and hydrates existing ledgers from server rows. | A persistence bridge already exists for outcomes, evaluations and learning candidates. |
| Same | A 401 leaves writes unacknowledged; queue removal occurs only after the server acknowledges the complete batch count; hydration filters by requested channel. | The client bridge has explicit retry and channel filtering behavior, but server enforcement still needs proof. |

### 2.2 Important limits and open risks

1. **The projection is not the promotion authority.** It consumes claims/model/candidates. Only the existing Channel Profile / learning-governance path may create validated durable knowledge.
2. **Candidate provenance needs stronger acceptance tests.** A candidate must retain non-empty, resolvable source evidence IDs and source event IDs; sample size must be consistent with independent outcome identity, not merely a caller-supplied integer.
3. **Temporal semantics need end-to-end proof.** Verify validFrom/validTo, decay, stale transitions, supersession and contradiction retention across persistence, hydration, projection and prompt retrieval—not just projection fixtures.
4. **Durability is not yet certified.** The client calls the existing brain-intelligence endpoint, but this source inspection does not prove server schema validation, authorization, tenant/channel isolation, immutable identity conflict handling, transactional idempotency, or fresh-session hydration under real authenticated sessions.
5. **Creator confirmation and measured performance must remain distinct.** Explicit preference is user-provided knowledge; observed performance patterns require independently linked, comparable outcomes. A creator approval is not an outcome.
6. **Projection completeness is not universal.** The inspected projection takes BrainMemoryClaim, ChannelKnowledgeModel and candidate inputs; all producers and the canonical Channel Profile promotion writer still need a producer-to-consumer census.

### 2.3 Phase 2 implementation order

| Slice | Change | Required regression proof | Status |
|---|---|---|---|
| 2A — lifecycle contract | Reconcile claim/candidate/review/promotion/reject/supersede state transitions with the canonical governance writer. | Approval does not promote; rejected history remains inspectable; only the promotion owner emits validated knowledge. | READY FOR TDD |
| 2B — evidence-backed candidates | Validate source evidence IDs, source event IDs, channel scope, independent outcome identity and comparable sample basis before candidate creation. | Empty/foreign/missing/duplicate evidence refs fail closed; retries are idempotent; no unsupported sample count. | OPEN |
| 2C — persistence boundary | Trace server endpoint schema/auth/ownership and align client queue semantics with server idempotency. | Authenticated channel A cannot read/write channel B; 401/5xx retain pending rows; duplicate retry is safe; conflicting immutable IDs reject. | OPEN |
| 2D — hydration and retrieval | Prove a fresh authenticated session hydrates canonical ledgers and projection retrieval respects lifecycle/freshness/scope. | Same channel survives reload; cross-channel rows never hydrate; stale/superseded/rejected remain excluded by default; contradictions remain visible. | OPEN |
| 2E — context integration | Trace the exact Channel Knowledge rows selected into Brain context and model input; preserve record IDs/fingerprint and omissions. | Selected IDs equal rendered input; no candidate promoted by retrieval; creator-confirmed preference precedence remains intact. | OPEN |

### 2.4 Phase 2 exit criteria

- Every promoted knowledge record links to canonical source evidence/outcome IDs, source event ancestry, reviewer decision and exact channel scope.
- The promotion writer is the sole authority for validated learning.
- Approval-for-review is not promotion; reject/hold/supersede history is retained.
- Freshness, temporal validity, contradiction and confidence survive persistence and hydration.
- Cross-channel access fails closed in server and client paths.
- No new durable store is introduced.
- Focused tests and an authenticated fresh-session journey pass at the exact target SHA.

## 3. Phase 3 — Prompt reachability and generation provenance

### 3.1 Target-branch footholds inspected

| File / owner | Verified behavior in source | What this proves |
|---|---|---|
| `docs/specifications/PROMPTS.md` | Defines instruction precedence, prompt-family taxonomy, context recipes, output contracts, deterministic validators, quality loops and provenance requirements. | Prompt authority exists and is the source of truth for prompt behavior. |
| `docs/specifications/prompt-registry.json` | Registry is versioned and inventories prompt constants/source files/families/statuses and migration targets. | A registry exists, but inventory metadata is not proof of production reachability. |
| `src/services/brain/BrainTaskProfileRegistry.ts` | Resolves creator request text into a bounded task profile, asset kind/count/subject and task instruction. | Task profiles already provide a typed entry point for task-specific behavior. |
| `src/services/brain/runtime/BrainModelGateway.ts` | Provides a provider-neutral interface and lazily delegates generation to the Gemini compatibility provider. | A canonical provider-neutral generation boundary exists. |
| `src/services/brain/BrainOrchestrator.ts` | Resolves task profile, records prompt/context/schema versions and requested/served model identity, calls the default gateway for structured generation, and performs bounded repair. | The primary Brain turn already has substantial trace/provenance instrumentation. |
| `src/services/brain/BrainTrace.ts` | Trace supports operation/workflow IDs, task profile, evidence records, context included/dropped, prompt versions, provider/requested/served model identity, grades, repairs and output reference. | The trace schema can carry the required lineage without creating a second trace store. |

### 3.2 Concrete gaps found

1. **Registry reachability is not complete.** The registry lists source files and legacy prompt constants, but a complete bidirectional inventory of production callers, test-only callers and dead candidates was not proven in this audit.
2. **Prompt provenance is uneven across callers.** The primary Brain orchestrator records orchestrator, context resolver and output-schema versions. Other generation callers still need exact caller-to-trace coverage.
3. **Provider boundary migration is incomplete.** The BrainModelGateway is provider-neutral, but the orchestrator still imports Gemini helpers directly for requested-model resolution and current niche research. These imports are not proof of a second generation gateway, but they are explicit compatibility seams that must be classified and narrowed.
4. **Served model identity must remain provider-reported.** Trace supports a nullable served model and explicit identity status. Do not infer served model from requested model, provider defaults or UI settings.
5. **Prompt family/context recipe metadata needs stable versioning.** Each consequential caller should identify family, constitution, task profile, context recipe/resolver, output schema and evidence snapshot. Missing version data must remain unknown, not be filled with a guessed default.
6. **No silent migration.** Prompt aliases and legacy constants may be retired only after production reachability is zero and output/quality parity is demonstrated for the replacement family.

### 3.3 Phase 3 implementation order

| Slice | Change | Required regression proof | Status |
|---|---|---|---|
| 3A — exact caller inventory | Generate an exact-target inventory of prompt constants, aliases, task profiles, templates, provider helpers and production call sites. Classify each as production-reachable, test-only, dead-code candidate or unverified with source evidence. | Every registry entry has a caller/source disposition; inventory artifact is tied to exact commit SHA. | READY FOR TDD / INVENTORY |
| 3B — trace coverage | Add or complete shared prompt provenance metadata for consequential generation callers using existing BrainTrace/turn metadata. | Every production caller writes truthful prompt family/version, context recipe, schema, evidence IDs and operation/output identity where applicable. | OPEN |
| 3C — provider identity | Normalize provider-reported requested/served model metadata through existing gateway/provider adapter and trace. | Requested and served model remain distinct; unknown served identity remains null with explicit status; fallback identity is truthful. | OPEN |
| 3D — task-profile parity | Verify every task profile maps to the correct prompt family, required/useful/forbidden context and deterministic validator. | Rich/sparse/empty/stale/disabled fixtures across task families; no UI surface bypasses task profile or gateway without documented exception. | OPEN |
| 3E — migration/quarantine | Migrate one prompt family/caller cohort at a time; remove old constants only after zero-caller proof and parity. | Output-schema/quality baselines and caller search prove no production path remains. | OPEN |

### 3.4 Phase 3 exit criteria

- Every consequential production generation is traceable to exact caller, task profile, prompt family/version, constitution/context/schema versions and selected evidence.
- Requested model and provider-reported served model are distinct; unavailable served identity remains explicitly unknown.
- Provider execution stays behind BrainModelGateway or an explicitly documented domain adapter.
- Every prompt registry item has a current reachability classification tied to an exact commit.
- Prompt migration preserves task quality and output contracts; no unverified legacy path is deleted.
- No second prompt registry, gateway, runtime, context broker or trace store is introduced.

## 4. Required cross-phase sequence

1. Close Phase 0/1 baseline blockers before claiming those phases certified.
2. Complete Phase 2A/2B contract and evidence-source validation before changing promotion or persistence behavior.
3. Verify the existing persistence endpoint and governance writer before extending any durable learning path.
4. Complete Phase 3A caller inventory before prompt migrations or legacy removals.
5. Add trace coverage before migrating callers so before/after provenance is comparable.
6. Run focused tests first, then the relevant full gates and authenticated browser journeys.
7. Re-pin the target SHA and attach test/run receipts to the canonical Task Authority work item before marking any phase complete.

## 5. Verification status on 2026-11-11

The documentation branch's first GitHub Actions run for commit `b3a0cc15c6c5939904d8e6e79d96e32f32ea16ac` completed with an overall **failure**:

- Passed: production build; Brain quality-loop contract and tests; local browser smoke.
- Failed: document-system audit, source-governance (confirmed catalog), Gemini-governance test group, focused-contract gate, full test suite and TypeScript typecheck.
- The document audit reported multiple ACTIVE registry documents claiming the same Priority-25 runtime, public-resolver and Studio Controls execution-packet concerns. These are pre-existing registry-authority conflicts, not Phase 2/3 behavior.
- The confirmed-catalog job reported missing Studio split-input stylesheet/specimens and multiple Studio primitive styling/coverage assertions. This is outside the Brain Phase 2/3 code scope but blocks the aggregate source-governance gate.
- The focused-contract job stopped at a Studio specimen assertion before later focused suites ran.
- Typecheck reported existing failures across Studio exports/types, OpportunityEvidenceAdapter tests, generationStore tests and Brain command-interface test exports; no Phase 2/3 code was changed in that run.
- Gemini-governance's caller inventory step succeeded, but its subsequent focused Vitest group failed. Its detailed failing assertions require follow-up before the provider/key boundary can be certified.

This run is useful as the current branch baseline, not a green Phase 0/1 certification. The complete job logs are attached to GitHub Actions run 6184.

**Not performed:** no local checkout, no runtime code edit, no focused Phase 2/3 test execution, no live authenticated persistence journey, no production caller census artifact inspection, no browser journey for Channel Knowledge hydration, and no Task Authority claim/receipt mutation.

## 6. Next execution gates

- Phase 0/1: resolve or classify the aggregate CI failures; run Brain-specific evidence/context and public/private isolation tests; verify source-governance/document registry and Task Authority claim.
- Phase 2: inspect the server implementation behind `/api/brain-intelligence` and the canonical Channel Profile promotion writer, then write failing regression tests before any behavior change.
- Phase 3: retrieve and inspect the exact-commit Gemini caller inventory artifact; build a complete prompt/caller map; then add trace-coverage tests before changing any caller.
