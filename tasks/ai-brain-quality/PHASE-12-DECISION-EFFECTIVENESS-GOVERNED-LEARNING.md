# Phase 12 — Decision Effectiveness and Governed Learning

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Evidence-gated candidate creation implemented; governed promotion and causal effectiveness remain unverified end-to-end.

## Objective

Connect resolved evaluations to reviewable learning candidates without turning creator acceptance, one successful post, or a before/after correlation into durable Brain knowledge. Reuse the existing `viewTubeEvaluationLedger` workflow-candidate records and the canonical Channel Profile/Brain governance path.

## Implemented

- `proposeEvaluationLearningCandidate` requires a resolved evaluation, non-empty evidence references, available evidence, and comparable evidence or an explicit experimentally-supported assessment.
- A channel-scoped candidate must include the same channel as its source evaluation. A project-scoped evaluation cannot be relabeled to another project.
- Candidate records preserve evaluation ID, source outcome IDs, evaluation outcome, reporting window, comparability status, evidence status, and evidence record IDs.
- Candidate creation always starts in `candidate` state. It does not approve or promote learning.
- Existing explicit candidate review remains a separate action. This helper does not write validated Channel Knowledge or alter prompts/model memory.
- Candidate generation is blocked when creator learning is disabled.

## Decision-effectiveness dimensions

Future decision effectiveness views should distinguish, rather than collapse into one score:

1. intended goal and recommendation provenance;
2. whether the creator accepted/rejected/modified the recommendation;
3. whether the exact selected variant was actually published;
4. measured outcome and comparison window;
5. evidence coverage, freshness, missingness and comparability;
6. known confounders and strength of causal support;
7. downstream effects and sufficient sample size;
8. contradictory observations and whether the conclusion remains current.

Acceptance is a creator decision signal; publication is exposure evidence; analytics is an observation; evaluation is an interpretation; governed promotion is a separate approval. They must not be treated as interchangeable.

## Regression coverage

`src/services/viewTubeEvaluationLedger.test.ts` verifies that pending, non-comparable, and cross-channel evaluations cannot create a candidate; a resolved, evidence-backed, comparable evaluation can create a reviewable candidate while preserving its lineage.

## Remaining boundaries

- The current local workflow candidate is not itself canonical Channel Knowledge.
- A candidate's existence is not proof of effectiveness, causality, or approval.
- Cross-system retry idempotency, immutable publish transaction joins, analytics attribution, cohort selection, contradiction accumulation, candidate supersession/expiry, and governed Channel Profile promotion remain separate certification work.
- The current browser-local ledgers are not a cross-device durable source of truth.

## Acceptance

- [x] Preserve evaluation-to-candidate lineage and evidence IDs.
- [x] Require resolved, strictly scope-matched, evidence-backed, comparable input.
- [x] Make candidate retries idempotent by caller key within the same evaluation/channel/project scope.
- [x] Reject channel candidates when the source evaluation has no matching channel identity.
- [x] Keep candidate creation separate from approval/promotion.
- [x] Add regression tests for gating and scope.
- [ ] Verify the new tests and all release gates on the latest PR head.
- [ ] Demonstrate the complete recommendation → creator decision → immutable publish snapshot → canonical analytics → evaluation → governed Channel Knowledge path with stable IDs and retry safety.
