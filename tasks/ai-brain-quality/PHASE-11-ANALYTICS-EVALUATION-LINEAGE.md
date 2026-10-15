# Phase 11 — Analytics Checkpoints and Before/After Evaluation

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Evaluation contract, guarded writer, verified publication receipt, canonical video-row join, source outcome/trace/action lineage, immutable analytics-checkpoint event, and checkpoint-bridge invocation are implemented. Current-head CI, direct production-caller reachability, and data freshness/coverage still require verification.

## Objective

Extend the existing `viewTubeEvaluationLedger` rather than create another evaluation store. Each evaluation should retain the identities and evidence needed to compare an intended change with an observed result, while clearly separating observation from causal interpretation.

## Implemented contract

`EvaluationRecord` now optionally retains:

- source outcome IDs and producer record IDs, when a linked published outcome exists;
- generation trace and asset IDs;
- published video ID and immutable publication transaction/snapshot identity;
- baseline and comparison snapshot IDs;
- selected reporting window;
- comparability status and evidence status;
- declared confounders;
- causal assessment (`observed_association`, `experimentally_supported`, or `insufficient_evidence`);
- matching analytics checkpoint event IDs (only when the event identifies the same published video);\n- a caller idempotency key.

Evaluation creation is idempotent when the caller supplies the same key in the same channel/project scope. Existing records without the new optional metadata remain readable. The current writer remains subject to the existing creator-learning control.

The contract deliberately does not calculate a causal effect from two metric objects. Canonical metric-comparability policy and canonical analytics evidence remain authoritative for metric meaning, window, snapshot, freshness, missingness, and scope. An absent metric is not zero, and a temporal increase alone is not proof that a decision caused the change.

## Before/after sequence

1. Record the baseline snapshot/window and the selected published variant.
2. Record the change point and the producer decision/action identity.
3. Collect a comparison snapshot for a stated window.
4. Attach canonical evidence IDs, comparability and freshness/missingness state.
5. Record known confounders and the strength of the conclusion.
6. Resolve the evaluation as positive, neutral, or negative without rewriting its source evidence.

## Regression coverage

`src/services/viewTubeEvaluationLedger.test.ts` checks scoped idempotent evaluation creation, pending-versus-resolved behavior, evidence-backed candidate input, comparability gates, and cross-channel isolation.

## Explicitly not claimed complete

- The evaluation writer now accepts the typed publication identity and requires the published YouTube video ID to exist in the same current canonical `videos` dataset snapshot and channel scope before creating an evaluation. It records the canonical row evidence ID, snapshot ID, selected window, approved snapshot/hash, transaction, package, ContentBuild, and selected asset IDs.
- This is an identity join, not proof that the available metrics are sufficient or causally comparable. `projectAssociationStatus: snapshot-only` remains explicit where the legacy project association cannot be verified.
- Checkpoint collection is intentionally limited to ContentBuild `analytics.checkpoint` events whose `youtubeVideoId`/`publishedVideoId` matches the exact publication. Missing checkpoint events remain an empty list; canonical video-row evidence is still required.
- No claim is made that every upstream analytics provider has emitted a checkpoint.
- The system must not claim causality unless the evaluation has appropriate experimental support.

## Acceptance

- [x] Evaluation records can preserve source outcome/asset/trace/video/snapshot/window lineage.
- [x] Idempotent retry support is available when a producer supplies a stable key.
- [x] Evidence and comparability semantics are explicit in the type contract.
- [x] Regression tests cover the evaluation writer and learning-candidate preconditions.
- [ ] Verify focused tests, typecheck, runtime lint, full suite and build on the latest PR head.
- [x] Implement a fail-closed publication-identity → canonical video-row join in the evaluation service.
- [ ] Verify current production callers, fresh canonical rows and release gates on the latest PR head.


## Implementation update — 2026-10-15

`recordAnalyticsCheckpointForEvaluation` now invokes the canonical publication evaluator after recording the existing ContentBuild/algorithm checkpoint. It passes the typed publication identity, selected analytics window, and an explicitly non-causal default assessment. The canonical evaluation writer requires the immutable publication receipt and exact channel-scoped video row, appends an idempotent `analytics.checkpoint` event, and propagates that checkpoint ID/evidence to linked outcome records.

This makes the bridge-to-evaluation path callable end-to-end; it does not establish that every analytics sync/provider currently invokes the bridge in production. That reachability and fresh-data certification remain open.
