# Phase 12 — Decision Effectiveness and Governed Learning

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Evidence-gated candidate creation, named creator review, five-independent-publication promotion gate, and promotion through the existing BrainMemoryClaims/Channel Knowledge governance path are implemented with regression coverage. Current-head release gates and production-data certification remain pending.

## Objective

Connect resolved evaluations to reviewable learning candidates without turning creator acceptance, one successful post, or a before/after correlation into durable Brain knowledge. Reuse the existing `viewTubeEvaluationLedger` workflow-candidate records and the canonical Channel Profile/Brain governance path.

## Implemented

- `proposeEvaluationLearningCandidate` requires a resolved evaluation, non-empty evidence references, available evidence, and comparable evidence or an explicit experimentally-supported assessment.
- A channel-scoped candidate must include the same channel as its source evaluation. A project-scoped evaluation cannot be relabeled to another project.
- Candidate records preserve evaluation ID, source outcome IDs, evaluation outcome, reporting window, comparability status, evidence status, and evidence record IDs.
- Candidate creation always starts in `candidate` state. It does not approve or promote learning.
- Approval requires a named reviewer; unreviewed candidates cannot be promoted.
- Promotion requires at least five distinct published videos with positive, available, comparable evaluations matching channel, project, source/recommendation, and reporting window.
- Promotion creates a descriptive-association learning entry with evidence and reviewed-by provenance, then uses the existing `promoteBrainClaim` governance path and rebuilds affected context packs. It explicitly records no causal conclusion.
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

`src/services/viewTubeEvaluationLedger.test.ts` verifies candidate gating, scope matching, retry idempotency, named reviewer requirements, and promotion only after five independent positive/comparable publication evaluations. Promotion tests assert evidence lineage and that causal conclusion remains null.

## Remaining boundaries

- The current local workflow candidate is not itself canonical Channel Knowledge.
- A candidate's existence is not proof of effectiveness, causality, or approval.
- Cross-system atomic retry safety, richer cohort selection, contradiction accumulation, candidate supersession/expiry, and fresh-account production verification remain separate certification work. Publication identity and canonical video-row evidence joins are implemented in Phases 10–11.
- The current browser-local ledgers are not a cross-device durable source of truth.

## Acceptance

- [x] Preserve evaluation-to-candidate lineage and evidence IDs.
- [x] Require resolved, strictly scope-matched, evidence-backed, comparable input.
- [x] Make candidate retries idempotent by caller key within the same evaluation/channel/project scope.
- [x] Reject channel candidates when the source evaluation has no matching channel identity.
- [x] Keep candidate creation separate from approval/promotion.
- [x] Require explicit named review before approval.
- [x] Require five distinct positive, available, comparable published-video evaluations before promotion.
- [x] Promote through the existing Channel Knowledge governance path and rebuild affected context packs.
- [x] Add regression tests for gating, scope, retry idempotency, review and promotion.
- [ ] Verify the new tests and all release gates on the latest PR head.
- [ ] Certify the complete production recommendation → creator decision → immutable publish snapshot → canonical analytics → evaluation → governed Channel Knowledge path with live data and cross-system retry safety.


## Implementation update — 2026-10-15

Promotion is now a distinct async operation, `promoteEvaluationLearningCandidateToChannelKnowledge`. It requires an approved candidate with a named reviewer, enabled channel personalization, and at least five distinct published videos with positive outcomes, available evidence, matching channel/project/source/recommendation/window, and comparable metrics. It captures a creator-confirmed analytics learning entry with all supporting evaluation/evidence IDs, uses the existing `promoteBrainClaim` path, and rebuilds affected context packs. It keeps `causalConclusion: null` and records the supporting IDs on the candidate.

This remains descriptive-association learning. Cross-device durability, contradiction/supersession policy for this candidate family, and current-head CI certification are still open.
