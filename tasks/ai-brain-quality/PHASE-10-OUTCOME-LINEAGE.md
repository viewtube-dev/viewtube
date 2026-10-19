# Phase 10 — Outcome Lineage Continuity

**Branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Pull request:** [#217](https://github.com/viewtube-dev/viewtube/pull/217)  
**Status:** Phase 10 implementation is expanded: the immutable publication receipt carries ActionPacket/workflow/recommendation/experiment IDs; publisher completion automatically links selected published AssetOutcomes to the Brain outcome ledger; the canonical analytics evaluation path adds checkpoint lineage. Latest-head CI, production-caller reachability, and server/cross-device durability certification remain pending.

## Implementation completed in this slice

The Asset Engine outcome writer now passes stable producer identity into the existing BrainOutcomeLedger record:

- `sourceRecordId`: the persisted AssetOutcome ID;
- `traceId`: the generation trace that created the asset;
- `assetId` and `assetType`: the exact producer asset identity.

The Brain outcome ledger preserves these optional typed fields and forwards them into learning-event metadata. Existing writers remain compatible because the new fields are optional. No second outcome store was introduced. When a producer supplies a stable `idempotencyKey`, a retry of the same asset/channel/kind returns the existing AssetOutcome; BrainOutcomeLedger also deduplicates by channel + `sourceRecordId` before emitting another learning event.

Regression coverage in `src/services/brain/__tests__/assetOutcomes.test.ts` verifies that a published asset outcome retains the same trace and asset identity after it reaches BrainOutcomeLedger. The capability evidence map and generated report list this test under `CAP-OUTCOME-LEARNING`.

## Remaining end-to-end work — not certified complete

This slice now connects the publisher completion boundary to the canonical publication identity, emits that identity on ContentBuild events, records actual published exposure for a known Asset Engine render, and joins the matching outcome to BrainOutcomeLedger. It also exposes a fail-closed join from publication identity to canonical analytics video-row evidence in Phase 11. It does not yet prove:

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
- [x] Join publish transaction, approved snapshot/hash, ContentBuild, package, YouTube video, selected assets and correlation/idempotency IDs in a typed publication identity.
- [ ] Join recommendation/action/publish/analytics/evaluation/learning IDs end-to-end across durable producer systems.
- [x] Add local retry-idempotency and channel/selected-asset mismatch regression tests for publication linking.
- [ ] Add cross-system idempotency and cross-channel/project isolation tests across durable producer systems.
- [ ] Complete Phase 9 release gates before merge.


Next contracts: [Phase 11 — Analytics Evaluation Lineage](./PHASE-11-ANALYTICS-EVALUATION-LINEAGE.md) and [Phase 12 — Decision Effectiveness & Governed Learning](./PHASE-12-DECISION-EFFECTIVENESS-GOVERNED-LEARNING.md).


## Implementation update — 2026-10-15

The publication receipt now preserves optional `actionPacketId`, `workflowId`, `recommendationId`, and `experimentId`. The publisher bridge links every selected variant asset to the exact channel, transaction, approved snapshot/hash, and published video; the evaluation writer then attaches the canonical analytics checkpoint and evidence IDs to both AssetOutcome and BrainOutcomeLedger. Conflicting decision identity on a publication retry is rejected instead of silently relinking the receipt.

The remaining uncompleted boundary is cross-device/server durability and a final live-caller certification. The browser-local ledgers are retry-safe within their own stores, not a distributed transaction across independent producer systems.
