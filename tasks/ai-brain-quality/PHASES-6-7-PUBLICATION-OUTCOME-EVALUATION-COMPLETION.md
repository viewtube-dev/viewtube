# AI Brain phases 6–7 implementation receipt: publication lineage and outcome evaluation

Date: 2026-10-15
Branch: `brain-phase-0-2-evidence-context`
Scope: Phase 6 (recommendation/action/publication identity) and Phase 7 (canonical outcome measurement/evaluation).

## Phase 6 — identity and publication lineage

Implemented:
- `BrainPublicationOutcomeBridge.ts` defines an immutable, versioned publication identity receipt.
- The receipt binds channel, ContentBuild, ContentBuild revision, package, publish transaction/idempotency key, approved snapshot ID/hash, exact YouTube video ID, locked title/thumbnail/render/description/tag assets, schedule, publish timestamp and project-association status.
- `completePublishTransaction` emits a `PUBLICATION_CONFIRMED` intelligence event only when the transaction is completed and the canonical ContentBuild reports the same YouTube video as published.
- Repeated completion retries the idempotent receipt path instead of duplicating publication events.
- Project linkage is deliberately labelled `snapshot-only`; the bridge does not imply that a legacy project association was independently verified.
- Publication confirmation is explicitly not a performance evaluation and makes no causal claim.

Tests added/extended:
- `BrainPublicationOutcomeBridge.test.ts`: identity lineage, no false performance/causality claim, idempotency, rejects unverified or mismatched publication.
- `PublishTransaction.test.ts`: completed publication emits one identity receipt with the exact approved snapshot hash and video/package identity.

## Phase 7 — canonical measurement and evaluation

Implemented:
- Video-scoped canonical metric resolution now fails closed unless the canonical `videos` dataset contains the exact requested video ID and a numeric metric on that row.
- It no longer substitutes channel summary metrics or unrelated sample rows when the published video row is absent.
- Channel-level evaluation can still use canonical aggregates when no video ID is requested.
- The evaluation path continues to preserve canonical snapshot IDs, evidence-row/field IDs, comparison context, baseline snapshot, lifecycle cohort, evaluation targets, and explicit `insufficient_data` / unavailable metric states.
- Evaluation remains separate from publication identity. A successful publish event does not count as a measured performance outcome or as evidence for learning sample size.

Tests added:
- `CanonicalAlgorithmEvaluation.test.ts`: a missing exact video row returns no metric even when unrelated video rows and channel aggregates are present.

## Safety and acceptance boundaries

- Missing metrics remain missing; no fallback to zero.
- Channel summary data cannot masquerade as a specific video's performance.
- Publication is not causal attribution.
- A publish receipt is not an analytics checkpoint and does not itself create `OUTCOME_MEASURED`.
- Existing canonical analytics and evaluation owners remain authoritative; no parallel analytics store was introduced.

## Still open; do not claim these phases fully certified

1. The current event/outcome ledgers still use browser-local storage. Server-authoritative durable persistence and multi-device reconciliation remain open.
2. Real YouTube analytics snapshots must be exercised end-to-end for the exact published video, reporting window and source freshness; unit coverage is not production data certification.
3. The caller that supplies the historical baseline snapshot must prove it is a genuine comparable pre-intervention snapshot or use the existing lifecycle-cohort path. Temporal sequence alone is not causal attribution.
4. Production integration should be tested against actual Publisher completion and remote verification, not only service-level fixtures.
5. Run focused tests, typecheck, lint, full suite and production build on this branch; resolve any new or baseline failures before merging.
6. The PR branch must be rebased/reconciled with the current target branch before merge. Do not treat an open PR or successful file writes as merge/certification.

## Changed source

- `src/services/brain/BrainPublicationOutcomeBridge.ts`
- `src/services/brain/AlgorithmIntelligenceEventLedger.ts`
- `src/services/asset-engine/PublishTransaction.ts`
- `src/services/brain/CanonicalAlgorithmEvaluation.ts`
- `src/services/brain/__tests__/BrainPublicationOutcomeBridge.test.ts`
- `src/services/brain/__tests__/CanonicalAlgorithmEvaluation.test.ts`
- `src/services/asset-engine/PublishTransaction.test.ts`
