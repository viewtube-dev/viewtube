# P1 Execution Plan — Brain Quality, Publication-to-Learning, and AI Systems Management

**Date:** 2026-10-29  
**Target:** `master/consolidated-feature-integration`  
**Documentation branch:** `docs/ai-brain-systems-reconciliation-2026-10-29`  
**Status:** reconciliation plan; implementation and release certification not yet claimed  
**Canonical work state:** Task Authority / P1 Canonical System Integration workstream  
**Scope:** reconcile the AI Brain Quality and AI Systems Management task lists, execute the highest-value incomplete work, and certify user-facing access without introducing parallel owners.

## 1. Executive decision

Execute the unfinished work as one dependency-ordered program with two connected outcomes:

1. A trustworthy creator-facing Brain loop: evidence → context → governed generation → creator decision → publication → measured outcome → evaluation → reviewed learning → Channel Knowledge.
2. A read-only AI Systems management projection that explains current system ownership, prompt/model provenance, runtime lineage, freshness, health and missing UI access.

Do not create another Brain runtime, evidence database, analytics store, Channel Knowledge store, prompt authority, task ledger, agent ledger, or publishing workflow. Extend the canonical owners below.

## 2. Source-of-truth boundaries

| Concern | Canonical owner | Execution rule |
|---|---|---|
| Creator reasoning/orchestration | `BrainRuntime` | One creator-facing reasoning path |
| Evidence truth | analytics-canon and existing evidence producers | Brain evidence contract is an additive projection |
| Context | `BrainContextBroker` / Creator Context resolver | One task-aware, bounded resolver |
| Channel knowledge | Channel Profile / Channel Knowledge + learning governance | Candidate, review and promotion remain distinct |
| Prompt behavior | `docs/specifications/PROMPTS.md` + prompt registry | Registry is inventory, not runtime truth |
| Generation provenance | GenerationRequest, ContextManifest, ToolReceipt, BrainTrace | Join stable IDs; never fuzzy-match |
| Project/work identity | Projects + ContentBuild | Preserve exact project/build revisions |
| Assets | Vault / Asset Engine | Reference canonical IDs, do not copy payloads |
| Publication | PublishTransaction + approved snapshot | Creator approval required; retries idempotent |
| Outcomes/evaluation | BrainOutcomeLedger and canonical evaluation owners | Preserve comparability and causal limits |
| Repository work continuity | Conversation OS / Crown / Task Authority / Herald | Do not add another task or claim ledger |
| AI management UI | Existing Brain Hub / Studio surfaces | Read-only projection first; no managed actions |

## 3. Verified target-branch footholds

The following files were fetched from the requested target branch. Their existence is implementation evidence, not proof of complete production reachability or successful tests in this session.

- `src/services/brain/BrainEvidenceContract.ts`: typed epistemic projection, provenance, scope checks and missing-as-null behavior.
- `src/services/brain/BrainContextResolution.ts`: task/capability evidence requirements, ranking, explicit omissions and model-window-aware budgeting when a window is supplied; character fallback remains explicit.
- `src/services/brain/ChannelKnowledgeProjection.ts` and `src/services/brain/__tests__/ChannelKnowledgeProjection.test.ts`: channel-scoped typed projection, freshness/supersession/contradiction handling, retrieval, and a test proving review approval alone is not validated learning.
- `src/services/brain/BrainRuntimeSnapshot.ts` and its test: a read-only snapshot already joins Project/ContentBuild, GenerationRequest, ContextManifest, ToolReceipt, BrainTrace, outcomes and explicit algorithm-intelligence event ancestry. It also reports unresolved lineage rather than fuzzy-attributing.
- `docs/specifications/PROMPTS.md` and `docs/specifications/prompt-registry.json`: prompt constitution, families, migration gates and required provenance contract exist; population of every reachable caller remains incomplete.
- `tasks/ai-brain-quality/CANONICAL-PUBLICATION-TO-LEARNING-GOLDEN-PATH-PLAN.md`: the intended publication/evaluation/governed-learning lifecycle and fault cases are already specified.

Important interpretation: these footholds change several previously “not started” tasks to **partial**. They do not certify live callers, persistence, UI adoption, database behavior, production publication, or full CI.

## 4. Priority and phase order

### Phase 0 — Baseline, authority and task reconciliation
**Priority:** P0 prerequisite  
**Purpose:** establish an exact, reproducible baseline before changing runtime behavior.

Tasks:
- Pin the target branch HEAD SHA and compare it with the audited SHA stored in AI-system registries.
- Inspect repository instructions, canonical domain docs, Prompt System spec, Task Authority and existing P1 workstream plans.
- Reconcile PR/branch donors; do not wholesale-merge stale or divergent donor branches.
- Run focused baseline tests for evidence, context, Channel Knowledge, BrainRuntimeSnapshot and publication/evaluation contracts.
- Record existing failures separately from regressions; never weaken tests to make the baseline green.
- Create/confirm a collision-free work claim in the canonical work-governance system.

**Exit:** exact base SHA, work ownership, dependency map, test commands and known baseline failures recorded. No feature is marked certified from historical CI.

### Phase 1 — Evidence and context contract certification
**Priority:** P1  
**Canonical owners:** EvidenceRecord / analytics-canon, BrainEvidenceContract, BrainContextBroker.

Tasks:
- Run and extend missing-vs-zero, stale, conflicting, provenance and channel/project/video scope tests.
- Complete the capability-to-required/optional/forbidden evidence matrix against the live capability registry.
- Verify every selected evidence item is the exact evidence supplied to the current model turn; retain canonical IDs and omissions.
- Verify Project lookup from projectId and exact ContentBuild identity across every production caller.
- Verify model-window budgets, output reservation and safety margin; retain explicit character fallback when model context size is unknown.
- Exercise rich, sparse, empty, stale, disabled-personalization and cross-channel-isolation fixtures.

**Exit:** no unsupported numeric claims; no scope leakage; missing evidence stays missing; caller-level tests prove parity across Sidebar, Brain Hub and full Brain workspace.

### Phase 2 — Channel Knowledge and governed learning
**Priority:** P1  
**Canonical owners:** Channel Profile / Channel Knowledge projection and existing learning governance.

Tasks:
- Inventory canonical claim, profile, hypothesis, candidate, review, promotion and persistence contracts.
- Complete the projection contract for creator-confirmed preferences, observed facts, performance patterns, hypotheses, candidates, validated, rejected and superseded learning.
- Verify temporal validity, reinforcement thresholds, contradiction retention, expiry/decay and scoped retrieval.
- Trace each candidate to independent outcome/evidence IDs and preserve channel/project/video/window scope.
- Connect hold/reject/approve-for-review/promote/supersede only through the existing governance API.
- Verify review approval is not promotion; models cannot write validated learning directly.
- Verify durable server persistence, consent, retry behavior, authenticated channel isolation and fresh-session hydration.

**Exit:** every promoted claim resolves to its source evidence/outcomes, reviewer decision and canonical knowledge record; no parallel memory store.

### Phase 3 — Prompt registry reachability and generation provenance
**Priority:** P1  
**Canonical owners:** Prompt System Authority, prompt registry, BrainTaskProfileRegistry, BrainModelGateway, BrainTrace.

Tasks:
- Inventory every prompt, alias, task profile, strategy, template and provider helper.
- Trace production callers in both directions; classify `production_reachable`, `test_only`, `dead_code_candidate` or `unverified` only with call-graph evidence.
- Populate owner, family, prompt/constitution/context/schema versions, context recipe, caller IDs, requested model, served model when provider-reported, and evaluation baseline.
- Add rich/sparse/empty/stale/disabled fixtures and deterministic quality baselines.
- Migrate one prompt family/surface at a time; compare outputs and task completion before redirecting callers.
- Expose provider-reported served model identity where the adapter actually supplies it. Keep null/unknown when unavailable.
- Remove legacy paths only after zero production reachability is demonstrated.

**Exit:** every consequential production generation has truthful prompt/context/model/evidence provenance; no fabricated served-model value; no silent prompt migration.

### Phase 4 — Brain quality loop and assistant continuity
**Priority:** P1  
**Canonical owners:** BrainTaskProfileRegistry, validators, BrainRuntime, shared context resolver and existing turn receipts.

Tasks:
- Complete task-specific quality-loop profiles and deterministic validators.
- Verify the bounded loop: generate → validate → at most one repair → independent revalidation → safe fallback.
- Add evidence-backed critique only where the task profile warrants it; validators remain authoritative.
- Verify raw creator text remains unchanged for storage/learning while presentation sanitization stays separate.
- Wire continuity trace and selected/omitted context through Sidebar, Brain Hub and full workspace.
- Connect non-chat tool feedback, approvals/rejections and creator edits through consent-governed event ingestion.
- Preserve the distinction between creator preference and measured performance.
- Connect live Brain health to canonical source adapters; show insufficient-data states honestly.

**Exit:** equivalent task/context/provenance behavior across assistant surfaces; no automatic side-effect replay; no hidden chain-of-thought exposure.

### Phase 5 — Publication-to-learning golden path
**Priority:** P1; depends on Phases 0–4 and the canonical publication owner  
**Canonical plan:** `tasks/ai-brain-quality/CANONICAL-PUBLICATION-TO-LEARNING-GOLDEN-PATH-PLAN.md`.

Tasks:
- Verify approved ActionPacket, reviewer identity and immutable approved publication snapshot/hash.
- Verify PublishTransaction binds the exact channel, video, snapshot and idempotency identity.
- Verify post-publication analytics checkpoints are idempotent and preserve observation windows, source IDs, coverage and freshness.
- Join only the exact published video and matching channel/snapshot; never substitute channel aggregates or title/date similarity.
- Create durable evaluation records with baseline/comparison IDs, confounders and causal-assessment level.
- Propagate stable identity through recommendation, generation, selected variant, ActionPacket, publication, checkpoint, outcome, evaluation and candidate.
- Require human review and existing minimum independent-video/positive-rate gates before promotion.
- Test duplicate callbacks, retries, mismatched channel/video/transaction/hash, missing approval, offline/401 queues and fresh-session recovery.
- Capture the complete exact-commit evidence bundle.

**Exit:** one deterministic integration test proves the whole approved lifecycle; PostgreSQL/authenticated-channel and fresh-client tests pass; observational correlation is never labeled causal proof.

### Phase 6 — AI Systems read-only runtime projection
**Priority:** P1/P2  
**Canonical owners:** existing governance registries, Herald, BrainRuntimeSnapshot, BrainTrace, ContentBuild, Vault/Asset Engine and outcome/evaluation owners.

Tasks:
- Reuse and extend `BrainRuntimeSnapshot` where it already joins request/manifest/receipt/trace/build/outcome lineage.
- Determine which runtime facts are absent from the snapshot: Vault asset/version/relationship references, full evaluation records, learning review/promotion details, prompt/model joins and freshness/main-SHA provenance.
- Add only read-only adapters over canonical owners; no copied payload store and no second event ledger.
- Preserve exact IDs, source owner, timestamps, unresolved reasons and identity mismatch states.
- Keep repository-agent claims/receipts in Herald and canonical work-management systems; AI Systems management consumes projections only.

**Exit:** a generated result can be followed through evidence, prompt, model, context, request, receipt, trace, Project/ContentBuild, asset, publication, outcome, evaluation and learning decision, with unresolved links visible.

### Phase 7 — UI coverage audit and Brain Hub management surface
**Priority:** P1/P2  
**Canonical UI:** existing Brain Hub and Studio surfaces; no parallel tab/navigation system.

Tasks:
- Audit implementation-to-UI and UI-to-implementation for all AI capabilities, routes, settings, providers, tools, permissions and lifecycle actions.
- Classify findings as MISSING_UI, PARTIAL_UI, STALE_UI, BROKEN_WIRING, MISLEADING_UI, DUPLICATE_UI, COVERED or UNVERIFIED.
- Check entitlement/feature gates, mobile navigation, alternate entry points, command surfaces and accessibility before declaring UI missing.
- Correct stale labels/contracts and expose existing operations with truthful disabled reasons.
- Deliver read-only Overview, Systems, Agents/Runs, Prompts, Plans, Evidence/Traces, Knowledge/Learning, Audit and Health using existing Studio primitives.
- Display freshness, audited target SHA, canonical IDs, source links and unresolved/partial states.
- Verify keyboard, screen reader, mobile, reduced motion, loading/empty/error states and filter preservation.
- Do not enable managed DO/UNDO actions in this phase.

**Exit:** every surfaced control reaches its canonical implementation; every important supported capability has an appropriate discoverable entry; no fake readiness or simulated receipts.

### Phase 8 — Health, governance, CI and certification
**Priority:** P1  
Tasks:
- Reconcile registry audited-main SHA and record freshness.
- Add/verify broken-doc reference, stale-SHA, reachability, writer-less ledger, direct-provider bypass, analytics-canon bypass and prompt-provenance checks.
- Run focused tests, typecheck, runtime lint, full suite, production build, source governance, reachability audit and diff checks.
- Compare every failure with the Phase 0 baseline.
- Run blind-agent orientation, positive/negative skill trigger, collision, stale-doc, donor-history and completion-receipt tests.
- Verify no competing Brain/governor/task/learning/evidence owner exists.
- Record exact tested SHA, workflow IDs, test commands/results, accessibility results and remaining blockers.

**Exit:** exact-commit certification receipt; current-main presence and deployed SHA are independently proven. A merge alone is not certification.

### Parallel lower-priority track — Public agent readiness
Keep this isolated from private AI management data. Decide public-safe `llms.txt`/optional `llms-full.txt`, improve AGENTS.md and sitemap, canonical/meta/OG/JSON-LD and static public text, then rerun Agent Ready and preserve score delta. Never expose private prompts, user data, evidence, internal registries or operational secrets.

## 5. First execution batch (highest leverage)

1. Phase 0 exact-target baseline and branch/registry freshness reconciliation.
2. Phase 1 evidence/context focused contracts and caller parity.
3. Phase 2 Channel Knowledge governance/persistence gap audit.
4. Phase 3 prompt caller inventory and provenance coverage matrix.
5. Phase 6 reuse/audit BrainRuntimeSnapshot before designing any additional projector.
6. Phase 7 code-to-UI/UI-to-code audit to identify the highest-impact missing or stale controls.
7. Select one end-to-end golden-path slice only after its canonical publication and persistence seams are verified.

These steps unlock the most other unfinished work while minimizing duplicate implementation and broad risky changes.

## 6. Required task/receipt discipline

For each execution slice record:
- stable task ID and canonical owner;
- observed target SHA and branch;
- exact files and dependencies;
- baseline and post-change commands/results;
- evidence IDs and runtime proof;
- PR/commit and current-main integration state;
- accessibility/runtime checks where UI changes;
- rollback and follow-up items.

Use existing Task Authority / Crown / Herald / Conversation OS contracts. Do not add a second claim or completion ledger.

## 7. Explicit non-goals

- No new Brain runtime, provider registry, prompt authority, analytics store, Channel Knowledge database, publication workflow or task ledger.
- No model direct-write to validated learning.
- No promotion from one outcome, model self-rating or unreviewed inference.
- No fuzzy identity joins or numeric-zero substitution for missing evidence.
- No automatic external side-effect replay.
- No managed AI-system actions before read-side certification.

## 8. Session verification record

**Repository:** `viewtube-dev/viewtube`  
**Target ref:** `master/consolidated-feature-integration`  
**Documentation branch:** `docs/ai-brain-systems-reconciliation-2026-10-29`  
**Inspected source footholds:** listed in Section 3.  
**Tests executed in this documentation pass:** none.  
**Build/typecheck/runtime/browser checks:** not executed.  
**Certification:** not claimed.  
**Next action:** Phase 0 exact-head baseline, then focused Phase 1/2 tests and UI/reachability inventory.


## 9. Initial UI coverage reconnaissance

A first repository search was performed using the UI Coverage Auditor workflow. It found the management workspace remains explicitly listed as unfinished in `tasks/ai-systems-management/todo.md` and `tasks/ai-systems-management/plan.md`. Search also surfaced a standalone Studio Hub concept HTML and architecture documents, but those do not prove a production-mounted Brain Hub management route.

The available search results did not establish the live route → component → action → service → authorization → persisted/runtime effect path for the proposed Overview, Systems, Agents/Runs, Prompts, Plans, Evidence/Traces, Knowledge/Learning, Audit and Health views. Therefore the management workspace is **UNVERIFIED**, not conclusively `MISSING_UI`. The next audit must inspect router/navigation registries, actual component imports/usages, feature/permission gates, mobile variants and runtime call paths before classifying each surface.

The creator-facing Brain Health panel and attribution panel are separate from the proposed AI Systems management workspace. Their existence in earlier task notes is not proof that canonical live source adapters and all assistant surfaces consume them.
