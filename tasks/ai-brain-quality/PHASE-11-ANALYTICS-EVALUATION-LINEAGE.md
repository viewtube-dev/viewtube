# Phase 11 — Analytics Checkpoints and Before/After Evaluation

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Evaluation contract and guarded writer implemented; production publish-to-analytics join remains unverified.

## Objective

Extend the existing `viewTubeEvaluationLedger` rather than create another evaluation store. Each evaluation should retain the identities and evidence needed to compare an intended change with an observed result, while clearly separating observation from causal interpretation.

## Implemented contract

`EvaluationRecord` now optionally retains:

- source outcome IDs and producer record IDs;
- generation trace and asset IDs;
- published video ID;
- baseline and comparison snapshot IDs;
- selected reporting window;
- comparability status and evidence status;
- declared confounders;
- causal assessment (`observed_association`, `experimentally_supported`, or `insufficient_evidence`);
- a caller idempotency key.

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

- The production publisher's immutable approved snapshot has not yet been proven to bind to a canonical analytics row by the same project/ContentBuild/variant identity.
- No automated ingestion of every analytics checkpoint is claimed by adding optional fields to the evaluation record.
- The system must not claim causality unless the evaluation has appropriate experimental support.

## Acceptance

- [x] Evaluation records can preserve source outcome/asset/trace/video/snapshot/window lineage.
- [x] Idempotent retry support is available when a producer supplies a stable key.
- [x] Evidence and comparability semantics are explicit in the type contract.
- [x] Regression tests cover the evaluation writer and learning-candidate preconditions.
- [ ] Verify focused tests, typecheck, runtime lint, full suite and build on the latest PR head.
- [ ] Prove the production publish → canonical analytics checkpoint join using current production callers and immutable publication identity.
