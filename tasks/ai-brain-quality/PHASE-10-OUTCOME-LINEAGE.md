# Phase 10 — Outcome Lineage Continuity

**Branch:** `fix/brain-canonical-evidence-missingness-2026-10-15`  
**Pull request:** [#213](https://github.com/viewtube-dev/viewtube/pull/213)  
**Status:** Asset outcome → Brain ledger lineage implemented with regression coverage; full publication → analytics attribution → governed-learning closure remains open.

## Implementation completed in this slice

The Asset Engine outcome writer now passes stable producer identity into the existing BrainOutcomeLedger record:

- `sourceRecordId`: the persisted AssetOutcome ID;
- `traceId`: the generation trace that created the asset;
- `assetId` and `assetType`: the exact producer asset identity.

The Brain outcome ledger preserves these optional typed fields and forwards them into the learning-event metadata. Existing writers remain compatible because the new fields are optional. No second outcome store was introduced.

Regression coverage in `src/services/brain/__tests__/assetOutcomes.test.ts` now verifies that a published asset outcome retains the same trace and asset identity after it reaches the Brain ledger.

The capability evidence map and generated coverage report now list this regression test under `CAP-OUTCOME-LEARNING`.

## Remaining end-to-end work — not certified complete

This slice closes only the Asset Engine → AssetOutcome → BrainOutcomeLedger identity hop. It does not yet prove:

1. recommendation/experiment identity survives through the exact ActionPacket or workflow that was executed;
2. publish transaction and immutable publishing snapshot retain the same Project/ContentBuild/asset/variant identity;
3. canonical analytics rows are joined to the correct published video and comparable reporting window;
4. measured outcome/evaluation records carry the source evidence IDs and comparison cohort;
5. a governed learning candidate references the evaluation and supporting/contradicting evidence, and only the governance path can promote it;
6. retries are idempotent across producer systems, not merely unique within each local record.

Do not infer a successful learning result from an accepted asset or a publish event alone. Outcome observation, evaluation, causal interpretation, and durable learning promotion remain separate stages.

## Verification status

The earlier release-gates run `38693153891` passed production build, configured focused contracts, source governance, and local smoke, but failed typecheck and the full suite. Its type errors were in files outside the analytics/Brain PR diff; that is evidence of scope separation, not proof the repository baseline is green. A current-head run and explicit Brain evidence + asset-outcome tests are still required before release certification.

## Acceptance checklist

- [x] Preserve asset producer record ID and generation trace in the Brain outcome record.
- [x] Preserve asset ID/type without introducing a new store.
- [x] Add regression assertion for lineage continuity.
- [x] Register the regression test in capability coverage.
- [ ] Verify the new test and capability-coverage check on the latest PR head.
- [ ] Join recommendation/action/publish/analytics/evaluation/learning IDs end-to-end.
- [ ] Add idempotency and cross-channel/project isolation tests across the full outcome chain.
- [ ] Complete Phase 9 release gates before merge.
