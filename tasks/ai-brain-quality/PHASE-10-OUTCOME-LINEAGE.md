# Phase 10 — Outcome Lineage Continuity

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Asset outcome → Brain ledger lineage and local retry idempotency implemented with regression coverage; full publication → analytics attribution → governed-learning closure remains open.

## Implementation completed in this slice

The Asset Engine outcome writer now passes stable producer identity into the existing BrainOutcomeLedger record:

- `sourceRecordId`: the persisted AssetOutcome ID;
- `traceId`: the generation trace that created the asset;
- `assetId` and `assetType`: the exact producer asset identity.

The Brain outcome ledger preserves these optional typed fields and forwards them into learning-event metadata. Existing writers remain compatible because the new fields are optional. No second outcome store was introduced. When a producer supplies a stable `idempotencyKey`, a retry of the same asset/channel/kind returns the existing AssetOutcome; BrainOutcomeLedger also deduplicates by channel + `sourceRecordId` before emitting another learning event.

Regression coverage in `src/services/brain/__tests__/assetOutcomes.test.ts` verifies that a published asset outcome retains the same trace and asset identity after it reaches BrainOutcomeLedger. The capability evidence map and generated report list this test under `CAP-OUTCOME-LEARNING`.

## Remaining end-to-end work — not certified complete

This slice closes only the Asset Engine → AssetOutcome → BrainOutcomeLedger identity hop. It does not yet prove:

1. recommendation/experiment identity survives through the exact ActionPacket or workflow that was executed;
2. publish transaction and immutable publishing snapshot retain the same Project/ContentBuild/asset/variant identity;
3. canonical analytics rows are joined to the correct published video and comparable reporting window;
4. measured outcome/evaluation records carry source evidence IDs and comparison cohort;
5. a governed learning candidate references the evaluation and supporting/contradicting evidence, and only the governance path can promote it;
6. retries are idempotent across producer systems, not merely unique within each local record.

Do not infer a successful learning result from an accepted asset or a publish event alone. Outcome observation, evaluation, causal interpretation, and durable learning promotion remain separate stages.

## Verification status

The earlier release-gates run `38693153891` passed production build, configured focused contracts, source governance, and local smoke, but failed typecheck and the full suite. The reported TypeScript errors were in files outside the canonical analytics/Brain PR diff. This establishes scope separation only; it does not prove the integration base is green or constitute an approved exception. The new lineage test and capability coverage check still need current-head CI evidence.

## Acceptance checklist

- [x] Preserve asset producer record ID and generation trace in the Brain outcome record.
- [x] Preserve asset ID/type without introducing a new store.
- [x] Add regression assertion for lineage continuity.
- [x] Register the regression test in capability coverage.
- [x] Add optional producer idempotency keys and prevent duplicate Brain ledger events for a repeated source record.
- [ ] Verify the new test and capability-coverage check on the latest PR head.
- [ ] Join recommendation/action/publish/analytics/evaluation/learning IDs end-to-end.
- [ ] Add idempotency and cross-channel/project isolation tests across the full outcome chain.
- [ ] Complete Phase 9 release gates before merge.


Next contracts: [Phase 11 — Analytics Evaluation Lineage](./PHASE-11-ANALYTICS-EVALUATION-LINEAGE.md) and [Phase 12 — Decision Effectiveness & Governed Learning](./PHASE-12-DECISION-EFFECTIVENESS-GOVERNED-LEARNING.md).
