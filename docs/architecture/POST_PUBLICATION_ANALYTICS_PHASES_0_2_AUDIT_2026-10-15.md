# Post-Publication Analytics — Phases 0–2 Audit Receipt

**Audit date:** 2026-10-15  
**Target integration branch:** `master/consolidated-feature-integration`  
**Work branch:** `work/post-publish-phases-0-2-2026-10-15`  
**Scope:** Post-publication Analytics and Outcome Pipeline + Historical Metadata Intelligence foundations  
**Rule:** this receipt distinguishes implementation evidence from verification; a merged PR or source file is not proof of production completion.

## Phase 0 — Discovery and preservation

### Canonical owners confirmed

| Concern | Canonical owner / source | Audit result |
|---|---|---|
| Project planning identity | Projects | Project remains the creator-facing planning object. |
| Cross-system lifecycle identity | ContentBuild | One ContentBuild is the lifecycle join for assets, package, publication, history and outcomes. |
| Package/publication configuration | Video Package + read-only Publishing Package projection | Do not add a second package or publication store. |
| Approved publication intent | `ApprovedPublishSnapshot` | Snapshot/hash freezes ContentBuild, project, package, selected assets, schedule and approval. |
| Publish execution/recovery | `PublishTransaction` | Existing transaction state machine and locked asset identity remain authoritative for retries. |
| YouTube binding and lifecycle events | `ContentBuildRepository` | Existing ContentBuild YouTube binding and event stream are reused. |
| Analytics evidence | analytics-canon | Raw/normalized analytics must continue to flow through canonical analytics access. |
| Evaluation and learning events | Algorithm Intelligence event ledger + Algorithm Evaluation Engine | Reuse existing evaluation targets and comparability policy; no parallel outcomes ledger. |
| Historical metadata/version provenance | ContentBuild assets/versions/events + Video Package history | Extend these owners; do not create a competing Metadata Master history store. |

### Current code and task evidence inspected

- `src/services/asset-engine/contracts.ts`
- `src/services/asset-engine/ContentBuildRepository.ts`
- `src/services/asset-engine/PublishingPackageProjection.ts`
- `src/services/asset-engine/ApprovedPublishSnapshot.ts`
- `src/services/asset-engine/PublishTransaction.ts`
- `src/services/asset-engine/PostPublishAnalyticsBridge.ts`
- `src/services/asset-engine/PostPublishAnalyticsBridge.test.ts`
- `src/services/asset-engine/ContentBuildRepository.test.ts`
- `src/services/longformOptimizationComparison.ts`
- `src/services/longformOptimizationComparison.test.ts`
- `src/views/VideoPublisher.tsx`
- `docs/product/studio-hub/INTEGRATED_METADATA_SYSTEM_EXECUTION_PLAN_2026-10-06.md`
- `tasks/viewtube-one-goal-status.md`
- `tasks/viewtube-finish-program/plan.md` and `todo.md`
- `docs/governance/TASK_AUTHORITY.md`

### Findings

1. The workflow wiring is already present on the integration line: Video Publisher writes the post-publish identity receipt after the completed transaction; Longform Optimizer routes a complete comparison to the evaluation bridge only when it finds a completed transaction for the exact ContentBuild and YouTube video. PR #135 is merged into the integration branch.
2. The typed snapshot and transaction foundations exist, but the task ledger still records VT-014, VT-015 and VT-016 as in progress. In particular, the current implementation is browser-storage-backed; it is not proof of server-authoritative persistence across devices or browser storage loss.
3. Before this change, ContentBuild event storage silently fell back on unreadable data and swallowed write failures. A caller could receive a successful-looking receipt even when its event was not persisted. Replayed post-publish binding writes could also append duplicate lifecycle events.
4. Project association was inferred only from the snapshot when a ContentBuild had no legacy Project ID. That is acceptable only if the receipt explicitly says the association is snapshot-only; it must not be represented as independently verified.
5. Analytics checkpoint events already carried the snapshot/video/ContentBuild references, but event-level idempotency was not a first-class typed repository contract.
6. The metadata execution plan already defines the right history scope: field-level changes, complete package versions, publication events, live edits, generation/refinement provenance and analytics references. Those capabilities should continue to use the canonical ContentBuild event/version stream.

### Phase 0 gate

**Discovery/preservation: completed for this implementation slice.** No new event store, analytics store, package owner or metadata-history owner is introduced.

### Explicit remaining gaps (not silently declared done)

- Server-authoritative durable ContentBuild/build-event persistence is not established by the browser localStorage adapter and remains a release blocker for claiming cross-device durability.
- PublishTransaction interrupted-reload/recovery and server-side idempotency still require their VT-016 certification fixtures.
- This tool session can edit repository files and inspect PR metadata, but cannot execute the repository's local test/build commands. CI must be used as verification evidence before lifecycle tasks are promoted to DONE.
- Historical metadata comparisons and governed learning remain downstream phases; this change establishes the identity/evidence contract, not a claim that metadata changes caused performance differences.

## Phase 1 — Canonical identity contract

A publication identity is valid only when these IDs are explicit:

`projectId` (snapshot-scoped) → `contentBuildId` → `videoPackageId` → `approvedSnapshotId + approvedSnapshotHash` → `publishTransactionId` → `youtubeVideoId` → `analytics checkpoint` → `evaluation event/outcome`.

The typed contract is `ContentBuildPublicationIdentity` in `src/services/asset-engine/contracts.ts`. It includes the schema version, source IDs, snapshot hash, selected variant asset IDs, channel association, correlation ID, idempotency key, publication timestamp and an explicit project-association status:

- `verified`: the ContentBuild's recorded Project ID matches the approved snapshot Project ID.
- `snapshot-only`: the snapshot supplies a Project ID, but the ContentBuild has no recorded Project ID to independently verify it.
- A conflicting known Project ID is rejected; no association is guessed.

## Phase 2 — Post-publication writers and replay safety

Implemented in this slice:

- ContentBuild build/event storage now fails closed on read, parse, malformed collection or write failure rather than silently discarding lifecycle history.
- ContentBuild events accept a typed optional idempotency key; replays return the existing event and key reuse for a different ContentBuild/event type is rejected.
- YouTube binding writes accept an idempotency key and avoid duplicate binding events on replay; conflicting video identities are rejected for keyed publication bindings.
- The post-publish identity receipt uses deterministic transaction/snapshot-scoped idempotency keys and embeds the canonical identity envelope in the existing ContentBuild event.
- Analytics checkpoint writes use the deterministic checkpoint ID as the ContentBuild event idempotency key.
- Regression tests were added for event replay, binding replay, receipt replay and explicit snapshot-only Project association.

**Verification state:** implementation submitted for CI verification; not yet certified. The localStorage adapter remains a browser-persistence compatibility implementation, not server-authoritative storage. Do not mark VT-014–VT-018 DONE solely because these changes merge.
