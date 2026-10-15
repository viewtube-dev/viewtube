# Brain Quality Phases 0–2 — Current Integration Reconciliation

**Date:** 2026-10-15  
**Workstream:** AI Brain Evaluation and Learning Loop / Brain Context Resolution  
**Target:** `master/consolidated-feature-integration`  
**Reconciliation branch:** `work/brain-quality-phases-0-2-reconcile-2026-10-15`  
**Status:** Existing foundations confirmed on the integration branch; Phase 2 completion and release verification remain open.

## Decision

Do not re-merge the stale `brain-phase-0-2-evidence-context` branch wholesale. GitHub reports it has diverged substantially from the current integration branch (47 commits ahead / 440 behind at comparison time). Its useful Phase 0–2 code has already been carried into the integration history; the old branch is a donor, not the merge target.

The canonical implementation remains additive and read-only. No new analytics store, evidence database, Project store, Brain runtime, or learning ledger is introduced.

## Phase 0 — baseline and ownership reconciliation

**Present on target (source inspected):**
- `docs/domains/BRAIN.md` defines BrainRuntime, evidence, context, outcome, evaluation, and learning boundaries.
- `src/services/brain/EvidenceIntelligenceResolver.ts` is the read-only Brain-facing facade over `analytics-canon`.
- `src/services/brain/CreatorContextResolver.ts` projects Channel Profile/Knowledge, Style, Project/ContentBuild, and ephemeral surface-selection context.
- `src/services/brain/BrainContextBroker.ts` builds the final prompt context.
- `src/services/brain/BrainOutcomeLedger.ts` records creator action outcomes; evaluation and learning remain separate owners.
- The stale PR #217 must not be merged wholesale; its history diverged from the integration target.

**Phase 0 gate:** ownership is identified, but a fresh same-target test baseline and final source-governance/reachability run are still required. Historical CI results from other heads are not proof of current health.

## Phase 1 — shared evidence contract

**Implementation present on target:**
- `src/services/brain/BrainEvidenceContract.ts` defines `KNOWN`, `OBSERVED`, `CALCULATED`, `USER_PROVIDED`, `INFERRED`, `HYPOTHESIS`, `ESTIMATE`, `STALE`, `MISSING`, and `CONFLICTING`.
- Claims preserve owner/source/snapshot IDs, channel/project/ContentBuild/video scope, metric/value/unit, timeframe, confidence, provenance, and limitations.
- Missing evidence is projected as `null`, never numeric zero.
- Scope and evidence-health helpers report missingness, stale claims, scope mismatches, and same-scope conflicts.
- `EvidenceIntelligenceResolver` attaches the shared claims/health to the canonical resolver envelope, with analytics-canon remaining the source of truth.

**Phase 1 gate:** contract regression tests exist, but latest-target execution is not certified. Add producer-specific entity identity and conflict resolution only where the canonical source contracts support them; do not guess or merge incompatible records.

## Phase 2 — task-aware context resolution

**Implementation present on target:**
- `src/services/brain/BrainContextResolution.ts` ranks context by task intent, reserves priority for system/control/task instructions, removes duplicate long sections, enforces a character budget, and reports selected/omitted/truncated sections.
- `BrainContextBroker.ts` uses the resolver rather than silently slicing the concatenated prompt.
- Focused tests cover relevance under a tight budget, omission reporting, and deduplication.

**Still open before Phase 2 can be certified:**
1. Canonical Project lookup when only `projectId` is supplied. The resolver currently accepts a canonical Project object but the orchestration caller does not reliably provide one; visible UI context must remain ephemeral and cannot substitute for canonical Project truth.
2. A complete per-capability required/optional evidence-class matrix, rather than the current partial task-to-section list.
3. Model-aware token budgeting. Current enforcement is character-based; do not claim tokenizer-accurate budgeting until a supported tokenizer/budget contract exists.
4. Context-path parity across Sidebar Chatbot, Brain Hub, and the full Brain workspace. Verify each actual caller before migrating it.
5. Representative runtime tests for rich/sparse/new channels, missing Project, personalization disabled, stale/conflicting evidence, and cross-channel isolation.

## Acceptance and release gates

- [ ] Add focused tests for any remaining Phase 2 behavior before changing implementation.
- [ ] Run `npx vitest run src/services/brain/BrainEvidenceContract.test.ts src/services/brain/BrainContextResolution.test.ts src/services/brain/__tests__/BrainEvidenceQualityIntegration.test.ts src/services/brain/__tests__/CreatorContextResolver.test.ts`.
- [ ] Run `npm run typecheck`, `npm run lint:runtime`, `npm test`, and `npm run build`.
- [ ] Run source-governance/reachability checks and `git diff --check`.
- [ ] Compare failures against the same-day integration baseline; do not bypass unrelated red checks.
- [ ] Record the exact tested commit and results before merge/release.

**Current conclusion:** Phase 0 inventory and Phase 1/2 implementation foundations are present on the integration branch. This is not a certification claim. The immediate implementation priority is the canonical Project lookup and Phase 2 runtime-coverage gaps, with tests written first.
