# Canonical Post-Publish Identity Contract

**Version:** 1  
**Owner:** ContentBuild lifecycle / Asset Engine  
**Consumers:** Video Publisher, PublishTransaction, analytics-canon checkpoint bridge, Algorithm Intelligence / evaluation  
**Related plan:** `POST_PUBLICATION_ANALYTICS_PHASES_0_2_AUDIT_2026-10-15.md`

## Purpose

Preserve the exact approved content and publication identity from the creator's Project through remote publication and measured outcomes. This contract extends the existing ContentBuild event stream; it does not introduce a new history, analytics, or outcome store.

## Canonical identity chain

1. `projectId` — creator planning identity; the approved snapshot is the immutable source for the project ID used by that publication.
2. `contentBuildId` — canonical lifecycle join across asset versions, package, publication, events and outcomes.
3. `videoPackageId` — package/configuration identity used by the transaction.
4. `approvedSnapshotId` + `approvedSnapshotHash` — immutable approved publication intent.
5. `publishTransactionId` + `idempotencyKey` — external-write/recovery identity.
6. `youtubeVideoId` — exact remote entity confirmed by the completed transaction.
7. `analytics checkpoint ID` + evidence references — the observed period and source data.
8. Existing Algorithm Intelligence event/evaluation IDs — the evaluation and outcome trail.

Never join records by title text, URL, timestamps, or fuzzy similarity when an explicit ID is absent. Return an explicit missing/unverified association instead.

## Typed envelope

The canonical TypeScript shape is `ContentBuildPublicationIdentity` in `src/services/asset-engine/contracts.ts`:

- `schemaVersion`
- `contentBuildId`
- `projectId`
- `projectAssociationStatus`
- `videoPackageId`
- `publishTransactionId`
- `youtubeVideoId`
- `channelId` (nullable; never invented)
- `approvedSnapshotId`
- `approvedSnapshotHash`
- `selectedVariantAssetIds`
- `correlationId`
- `idempotencyKey`
- `publishedAt` (nullable until known)

## Validation rules

- The publish transaction must be completed.
- Its YouTube ID must equal the supplied remote video ID.
- The approved snapshot must pass its hash check and match the transaction's snapshot ID/hash, ContentBuild ID and package ID.
- The ContentBuild must exist.
- If a ContentBuild Project ID is present, it must match the approved snapshot Project ID; a conflict is a hard error.
- If the ContentBuild has no Project ID to verify, emit `projectAssociationStatus: "snapshot-only"`; do not claim a verified Project join.
- Selected asset IDs come from the transaction's immutable asset lock, not current mutable package selections.
- Replaying the same transaction/snapshot identity must return the existing receipt and must not duplicate binding/history events.
- Reusing an idempotency key for a different ContentBuild or event type is rejected.
- A checkpoint is eligible for evaluation only when the exact completed publication transaction, ContentBuild and YouTube ID agree. Evaluation remains under the existing Algorithm Evaluation Engine and metric comparability policy.

## Ownership matrix

| Data | Sole canonical owner |
|---|---|
| Project planning and creator intent | Projects |
| Cross-system lifecycle identity and event history | ContentBuild |
| Package configuration and approval | Video Package / ApprovedPublishSnapshot |
| Publication transaction and retry receipts | PublishTransaction |
| Remote YouTube identity/status | ContentBuild YouTube binding, confirmed through Publisher/YouTube bridge |
| Analytics acquisition and normalization | analytics-canon |
| Evaluation and outcome events | Algorithm Intelligence / Algorithm Evaluation Engine |
| Governed durable learning | existing Brain knowledge/promotion governance |

No parallel store may become authoritative for any row.

## Durability boundary

The current ContentBuild repository adapter stores browser state in localStorage when available. Fail-closed reads/writes and idempotency improve replay safety, but localStorage is not server-authoritative durability. Cross-device recovery, browser-clearing recovery, and multi-writer concurrency remain unverified until the server-authoritative persistence migration is implemented and certified.
