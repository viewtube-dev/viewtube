# Brain Quality Phases 0–2 — Evidence and Context Resolution

**Workstream:** AI Brain Evaluation and Learning Loop / Brain Context Resolution  
**Status:** implementation branch created; verification pending  
**Target:** `master/consolidated-feature-integration`  
**Implementation branch:** `brain-phase-0-2-evidence-context`  
**Scope:** Phase 0 baseline inventory; Phase 1 shared evidence contract; Phase 2 task-aware context resolution  
**Rule:** This is a read-only projection over canonical owners. It introduces no evidence database, Project store, or new Brain runtime.

## Executive result

The target already contained meaningful foundations, but the evidence and context contracts were not complete end-to-end. This branch adds a shared typed evidence projection and health summary, feeds that projection through the canonical evidence resolver into Brain prompt context, and replaces final blind context clipping with task-aware selection, deduplication, budget accounting, and explicit omission reporting.

This work is **not certified yet**: repository tests, typecheck, lint, and build have not been run from this connector session. Do not treat the implementation branch as merged or release-ready until those gates run against the current integration tip.

## Phase 0 — Baseline inventory and reconciliation

### Pinned baseline

- Target branch: `master/consolidated-feature-integration`
- Target commit observed by GitHub compare: `86e44cd417c3d2b0fb1a2a6fc1a8220cf661b780`
- Existing PR: [#217 — outcome, analytics evaluation, and governed learning lineage](https://github.com/viewtube-dev/viewtube/pull/217)
- PR #217 head: `aaf7220eadf5270e6cafe434e1626979fbe8480d`
- Merge base: `dd8eddfef154f5be6641b87ce89d0936e84e0b60`
- GitHub compare reports the PR branch is **43 commits ahead and 140 behind** the target; the histories have diverged.
- PR #217 remains open and unmerged. Its own release-gate summary reports production build, focused contracts, local smoke, source governance, and TypeScript typecheck passed on its recorded head; `npm run lint:runtime` and the full `npm test` failed. Vercel checks were also reported rate-limited. These results belong to the PR head, not this branch or current target tip.

### Existing production path verified in source

```text
analytics-canon
  → EvidenceIntelligenceResolver
      → canonical evidence bundle / EvidenceRecord projection
      → BrainEvidenceQuality
      → deterministic Statistics / optional Audience / Opportunity evidence
  → BrainOrchestrator
      → resolveCreatorContext
      → BrainContextBroker
      → model generation / fallback
```

Creator context currently delegates to existing owners:
- Channel Profile / Channel Knowledge through `ChannelProfileAdapter` and `ChannelKnowledgeProjection`;
- Style through `StyleProfile`;
- Project context through `BrainProjectContext`;
- linked ContentBuild through `ContentBuildRepository` when a canonical Project with `contentBuildId` is provided;
- current surface/selection context through the existing surface adapters.

### Existing files and tests inspected

| Area | Existing artifact | Baseline finding |
|---|---|---|
| Domain authority | `docs/domains/BRAIN.md` | Correctly establishes BrainRuntime as orchestration owner, analytics-canon as analytics owner, and scoped/fresh evidence requirements. |
| Prompt authority | `docs/specifications/PROMPTS.md` | Requires provenance, versioning, evidence grounding, bounded context, and no silent learning. |
| Evidence projection | `src/services/brain/EvidenceRecord.ts` | Existing analytics-to-EvidenceRecord projection; original epistemic states were only observed/derived/creator_confirmed/stale/missing. |
| Evidence quality | `src/services/brain/BrainEvidenceQuality.ts` | Existing canonical analytics quality report for coverage, freshness, missingness and channel scope; not yet a shared all-producer epistemic contract. |
| Evidence facade | `src/services/brain/EvidenceIntelligenceResolver.ts` | Existing read-only facade that uses one canonical analytics snapshot and blocks analytics-derived projections when channel scope is not exact. |
| Creator context | `src/services/brain/CreatorContextResolver.ts` | Existing read-only facade over Profile/Knowledge/Style/Project/ContentBuild and surface state. |
| Context assembly | `src/services/brain/BrainContextBroker.ts` | Existing fixed section caps followed by a final string slice; no task-aware ranking at the final budget boundary. |
| Runtime caller | `src/services/brain/BrainOrchestrator.ts` | Production caller for evidence resolution, Creator Context, and both context-pack builds. |
| Evidence integration test | `src/services/brain/__tests__/BrainEvidenceQualityIntegration.test.ts` | Existing source-contract checks for bounded quality in Brain context and one Evidence Intelligence envelope. |
| Creator context reachability | `tasks/system-convergence/CREATOR-CONTEXT-REACHABILITY.md` | Records prior resolver migration and explicitly notes the canonical Project/ContentBuild and caller-coverage follow-ups. |
| Current checklist | `tasks/ai-brain-quality/plan.md`, `CAPABILITY-MAP.md`, `todo.md` | Plans describe the desired contract; the original evidence-contract checklist was still open on the target. |

### PR #217 reconciliation decision

Do **not** merge PR #217 wholesale as a dependency for phases 0–2. It owns later outcome/publication/evaluation/learning continuity and has substantial divergence from the target. Preserve its useful lineage work as a separate reconciliation stream:
1. compare each changed outcome/evaluation file against the latest target;
2. retain only changes whose invariants and tests still apply;
3. rerun focused evaluation-ledger tests, `lint:runtime`, full tests, typecheck and build on the rebased head;
4. do not bypass failing checks or infer current-target health from the PR's earlier run.

### Baseline risk register

| Risk | Status | Required follow-up |
|---|---|---|
| Multiple evidence vocabularies | Addressed additively on this branch | Extend adapters as non-analytics evidence producers migrate; never replace their stores. |
| Missing evidence interpreted as zero | Guarded in the new projection | Keep regression test; ensure every future producer preserves missingness before numeric conversion. |
| Contradictory evidence | Basic same-scope, same-metric, same-window conflict reporting added | Add explicit conflict resolution policy and producer-specific entity identity where needed. |
| Wrong-channel evidence | Existing analytics resolver fails closed; shared contract adds scope assessment | Keep exact-channel runtime tests and extend to project/video scope. |
| Context over-budget truncation | Addressed with task-aware final selection | Verify quality under real tokenization and representative rich/sparse fixtures. |
| Project context falls back to visible UI context | Known transitional behavior | Complete canonical Project lookup and ensure visibleContext supplies only ephemeral selection, not durable Project truth. |
| Sidebar / Brain Hub context parity | Not certified by this slice | Inventory and migrate all creator-facing surfaces to the shared resolver. |
| Existing repository-wide red checks | Known from PR #217 report; current target baseline not rerun here | Run current-target baseline and compare failures before declaring this branch green. |

## Phase 1 — Shared evidence contract

### Implementation added

- `src/services/brain/BrainEvidenceContract.ts`
  - Defines the shared epistemic vocabulary: `KNOWN`, `OBSERVED`, `CALCULATED`, `USER_PROVIDED`, `INFERRED`, `HYPOTHESIS`, `ESTIMATE`, `STALE`, `MISSING`, `CONFLICTING`.
  - Projects existing `EvidenceRecord` values into a stable claim envelope with owner/source/snapshot IDs, channel/project/ContentBuild/video scope, metric/value/unit, timeframe, freshness, confidence, provenance and limitations.
  - Maps legacy source states without mutating the source record.
  - Forces missing claims to `value: null`; missing is never zero.
  - Adds scope assessment and bounded health reporting for coverage, missingness, stale records, scope mismatch and conflicting values.
  - Conflict grouping includes metric and time-window identity to avoid comparing different reporting windows as if they were the same claim.
- `src/services/brain/EvidenceIntelligenceResolver.ts`
  - Projects canonical EvidenceRecords to shared claims and exposes `evidenceClaims` and `sharedEvidenceHealth` on the runtime envelope.
  - Does not expose evidence claims to prompt consumers when channel scope is not verified; health can still describe the blocked projection.
- `src/services/brain/BrainOrchestrator.ts` and `BrainContextBroker.ts`
  - Pass the shared evidence health/claims to context assembly.
  - Add an explicit prompt section with epistemic state, value/unknown marker, source owner/reference, scope, provenance references, and limitations.
  - Retain the existing `analytics-canon` source-of-truth boundary.

### Tests added

- `src/services/brain/BrainEvidenceContract.test.ts`
  - preserves canonical source provenance;
  - asserts missing is null, never zero;
  - rejects channel/project scope mismatch;
  - reports stale evidence and conflicting values.

## Phase 2 — Task-aware context resolution

### Implementation added

- `src/services/brain/BrainContextResolution.ts`
  - Resolves task intent using the existing `BrainTaskProfileRegistry`.
  - Ranks evidence, creator style, Project, Channel Knowledge, conversation, niche knowledge and research by task relevance.
  - Reserves priority for the system instruction, creator controls and task instructions.
  - Deduplicates identical long context sections.
  - Enforces the final character budget before model invocation.
  - Emits explicit selected/omitted section IDs, including truncation/duplicate reasons.
  - Restores original section order after selection so the prompt remains readable.
- `src/services/brain/BrainContextBroker.ts`
  - Uses the resolver instead of silently slicing the concatenated prompt at the budget boundary.
  - Adds omission IDs to the existing `BrainContextBudget` report.
  - Counts shared evidence-contract text in the evidence budget.
- `src/services/brain/BrainContextResolution.test.ts`
  - checks task relevance under tight budgets;
  - checks final budget compliance and omission reporting;
  - checks duplicate section elimination.

### Important scope boundary

This slice improves the **final context selection/budget boundary** and adds an evidence-aware prompt contract. It does not claim every context source has been migrated. The following remain open before Phase 2 can be certified across the product:
- canonical Project lookup when only `projectId` is provided (the current resolver accepts a canonical Project object but the orchestration call does not yet provide one);
- full per-capability required/optional evidence-class matrix;
- token-based budgeting calibrated to the actual selected model tokenizer (current compatibility contract is character-based);
- Sidebar Chatbot and Brain Hub context assembly parity;
- representative runtime tests for rich/sparse/new channels, no project, personalization disabled, stale/conflicting evidence, and cross-channel isolation.

## Verification gate

**Not run in this connector session.** The following must pass on the latest branch head before merge:
1. `npx vitest run src/services/brain/BrainEvidenceContract.test.ts src/services/brain/BrainContextResolution.test.ts src/services/brain/__tests__/BrainEvidenceQualityIntegration.test.ts src/services/brain/__tests__/CreatorContextResolver.test.ts`
2. `npm run typecheck` (or the repository's current canonical typecheck command)
3. `npm run lint:runtime`
4. `npm test`
5. production build
6. source-governance / reachability checks and `git diff --check`
7. review all failures against the same-day target baseline; do not bypass unrelated red checks.

## Completion state

- Phase 0: **baseline inventory and PR reconciliation recorded**; execution-gate baseline still needs a fresh run.
- Phase 1: **shared contract and runtime projection implemented on this branch**; tests added, not executed here.
- Phase 2: **task-aware final context resolution implemented on this branch**; tests added, not executed here; canonical Project lookup and surface parity remain explicit follow-ups.
- Merge/release: **not claimed**.
