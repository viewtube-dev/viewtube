# Phase 13 — Lifecycle identity, enforceable capability policy, durable evaluation

Date: 2026-10-15  
Target: `master/consolidated-feature-integration`  
Status: **Partially implemented on the target branch; certification is incomplete.**

## Why this phase starts now

Phases 10–12 have implementation foundations: canonical ContentBuild phase resolution, governed communication classification, explicit-ID attribution resolution, and an initial read-only attribution panel in draft PR #325. They are not certified complete because production writers do not yet prove complete stable-ID propagation, stage capabilities are not enforced at all action boundaries, durable persistence does not cover every outcome/evaluation record, and current-head release gates still contain failures.

This phase turns those remaining acceptance criteria into one testable production lifecycle. A publication receipt is not a measured outcome, correlation is not causality, and prompt instructions are not authorization.

## Workstream A — canonical lifecycle identity

1. Define a versioned identity contract covering channel, project, ContentBuild, recommendation, creator decision, generation trace, selected/final asset, ActionPacket, workflow, publish transaction, approved snapshot/hash, verified video, analytics checkpoint, evaluation record and learning candidate.
2. Map each existing writer to the contract before changing behavior; preserve canonical IDs and migrate only where the source of truth exists.
3. Require explicit ancestry or exact stable IDs for every edge. Reject channel mismatch, conflicting ID reuse, missing identity and ambiguous joins.
4. Add writer-level contract tests for propagation and fail-closed cases.
5. Keep unattributed records visible; never infer attribution from timestamp proximity or project co-membership.

**Acceptance:** an end-to-end fixture proves every ID survives recommendation → creator decision → generation/selection → ActionPacket → publication → canonical checkpoint → evaluation → governed learning.

## Workstream B — enforce ContentBuild-stage capabilities

1. Keep ContentBuild as the sole owner of canonical project stage.
2. Convert the existing phase-relevant capability list into an allowlist checked by tool/action dispatch, not just prompt construction.
3. Ensure UI affordances, tool registry and backend/action dispatch use the same policy result.
4. Fail closed when canonical ContentBuild is missing, stale, belongs to another project, or has blockers that prohibit the requested action.
5. Add tests proving a capability absent from the current stage cannot execute through a direct call.

**Acceptance:** stage policy is enforced at the final action boundary; route labels or stale UI state cannot grant capability.

## Workstream C — durable outcome/evaluation persistence

1. Extend authenticated server persistence for Brain outcomes and evaluation records, reusing channel-scoped persistence conventions where appropriate.
2. Version payloads and validate channel ownership server-side.
3. Use idempotency keys for retries; detect conflicting reuse instead of silently merging incompatible outcomes.
4. Hydrate and reconcile records across devices without overwriting newer canonical publication/evaluation data.
5. Label local-only mode as local-only; never certify cross-device continuity based on browser storage.

**Acceptance:** authenticated integration tests prove create, retry, conflict, reload and second-device replay for outcome/evaluation records.

## Workstream D — communication consent and retention

Implemented in the companion consent slice:
- Per-channel `captureCreatorCommunications` opt-in defaults to off.
- The ingestion service enforces consent even when called directly.
- New events retain classification and a deterministic fingerprint, not raw message text.
- Hydration redacts legacy raw text and routes sanitized replacements through the existing durable-sync writer.

Still required:
- Verify server-side upsert replaces existing raw metadata and confirm legacy purge across devices.
- Audit chat, tool-feedback, approval, rejection and edit callers for consistent consent handling.
- Confirm opt-out prevents new capture and logs/telemetry never include raw communication content.

**Acceptance:** tests demonstrate no raw text in new local/server records, legacy records are redacted and opt-out prevents ingestion.

## Workstream E — live provider-backed lifecycle verification

1. Use fresh channel-scoped canonical VT-SYNC snapshots and verified publication receipts.
2. Exercise recommendation, creator approval/rejection, execution, publication, checkpoint capture, evaluation and governed learning.
3. Assert exact video/channel/snapshot identity at every stage; record missing metrics and freshness limitations.
4. Separate observed change, comparison, interpretation and causal claims.
5. Record provider/model identity only when the provider actually reports it.

**Acceptance:** repeatable integration/E2E evidence identifies the exact commit, test channel/scope, observed events, missing stages and limitations.

## Workstream F — release-gate baseline

Current integration has known failures in focused contracts, confirmed-library-layout/source governance, full-suite tests and runtime lint spanning Studio, Vault and UI contracts. Do not waive them or attribute them to Brain without evidence.

1. Run exact target-branch baseline and archive failing test names/logs.
2. Run the same commands on the candidate commit.
3. Fix regressions introduced by this work; route unrelated failures to their owning UI/governance plans.
4. Require focused Brain contracts, typecheck, runtime lint, full suite, production build, source governance/reachability and local smoke to pass before certification.

## Exit criteria

Phase 13 is complete only when every workstream has acceptance evidence on the same reviewed commit, attribution is validated against real caller paths, and release gates are green. Until then, phases 10–12 remain **implemented foundations, not certified complete**.


## Target-branch implementation update — 2026-10-15

Implemented foundations now include typed durable learning-record persistence, user/channel isolation, queue-and-hydrate behavior for outcomes/evaluations/candidates, default-off communication capture consent, legacy raw-text redaction, capability-specific required evidence, conservative context budgeting, exact project-ID resolution, and the attribution detail panel.

Acceptance is still blocked on database-backed integration tests, complete stable-ID propagation through every production writer, browser verification, and the broader release-gates baseline. Do not mark this phase complete from unit tests or build success alone.

## Current-base implementation slice — durable identity conflict guard

A focused Phase 13 implementation now hardens the existing authenticated learning-record store without adding another store or changing the channel/user ownership model.

- Stable identity fields are compared when a record with the same scoped identity (user, channel, record type, and record ID) is written again.
- Reusing a record ID with a conflicting asserted source/trace/asset, project, ActionPacket, recommendation, publication transaction, video, approved snapshot, or evaluation identity is rejected instead of silently overwriting the prior record.
- Missing legacy identity fields may be enriched by a later write; two non-empty, conflicting identities may not.
- Legitimate lifecycle transitions remain supported when immutable identity is preserved, such as an evaluation moving from pending to resolved.
- PostgreSQL writes serialize by scoped record key using a transaction-scoped advisory lock before reading and updating, so concurrent first-write/retry races are checked against the persisted record.
- Regression tests cover conflict rejection, preservation of the original record, and an allowed pending-to-positive evaluation update.

This slice is **not Phase 13 certification**. Remaining gates still include current-head CI, server/database-backed integration coverage, full producer-to-learning ancestry, direct action-boundary capability enforcement, consent redaction verification across devices, browser/E2E evidence, and the production-host/served-commit check.

## Consent-retention regression added

The server persistence suite now verifies that an existing channel-scoped creator-communication event containing legacy raw text is replaced by a sanitized version with the same stable event ID, and that a subsequent durable read contains no raw message text. This validates the server store's replacement behavior; a full authenticated cross-device purge/reload flow is still required for certification.

The focused Brain persistence contract suite also exercises rehydration of a channel-scoped outcome after local browser data is cleared, confirming that the durable response restores the stable outcome ID, producer record ID, and generation trace. This is a mocked authenticated-endpoint integration contract; live database and two-device browser certification remain separate gates.

## Current-base implementation slice — publication producer ancestry

The publication receipt now preserves the stable producer outcome IDs and generation trace IDs for the exact selected assets, in addition to the existing channel/project/ContentBuild, ActionPacket/workflow/recommendation/experiment, approved snapshot/hash, transaction and video identity.

- The bridge reads outcomes only for the matching channel and selected asset IDs.
- Outcome record IDs and trace IDs are deduplicated and sorted for deterministic receipts.
- Unselected assets are excluded.
- Retry handling restores ancestry already recorded on the immutable receipt and unions any still-available producer IDs, so a missing browser-local outcome does not erase previously recorded provenance.
- Regression coverage verifies selected-asset filtering, trace continuity, metadata persistence and retry restoration.

This improves the recommendation-to-publication lineage edge; it does not by itself prove that every upstream recommendation/creator-decision writer supplied its stable IDs or that downstream records are durable across devices.

## Current-base implementation slice — publish action-boundary guard

The canonical publishing transaction boundary now re-reads the current ContentBuild before creating a *new* transaction and fails closed unless its stage is one of `package`, `edit`, `review`, `launch`, or `scheduled`. It also refuses a new transaction when the canonical ContentBuild has unresolved workflow blockers. Existing transactions for the same final render still take the idempotent resume path before this new-transaction guard, preserving safe retries.

Regression tests cover direct calls from a disallowed `idea` stage and unresolved blockers. This is a publication-boundary enforcement slice, not proof that every generation, editing, metadata, scheduling, and learning action is covered by the full stage capability matrix; those boundaries still require an explicit action-to-stage policy and direct-call tests.


## Local outcome replay identity guard

The browser-side `BrainOutcomeLedger` now treats `channelId + sourceRecordId` as an idempotency lookup, not permission to silently accept different payloads. If a retry changes an already-asserted source tool, outcome, summary, confidence, generation/asset identity, ContentBuild/project, ActionPacket/workflow/recommendation/experiment, publication transaction, approved snapshot/hash, published video, or publication identity, it fails closed with a field-specific conflict. Legacy records may be enriched when a lineage field was previously absent; an exact retry returns the original record ID. Focused tests cover exact retry, conflicting trace reuse, and legacy provenance enrichment.

This guard complements the server-side stable-identity check. It does not replace authenticated cross-device replay against the real persistence service; that remains a release certification requirement.


## Current-base implementation slice — post-publication generation guard

The canonical `GenerationWorkflow` now rejects new generation request preparation and ToolReceipt recording when the canonical ContentBuild is in `published`, `monitor`, `evaluation`, `learning`, or `archived` stage. The check reads the canonical ContentBuild stage at both request preparation and receipt recording; a caller cannot bypass the guard by constructing a request object directly and attempting to record a receipt.

Regression coverage exercises both the normal request-preparation path and a direct receipt call against a published build. This is a deliberately conservative post-publication guard, **not** the complete action-to-stage capability matrix or provider-dispatch enforcement required for Phase 13 certification. Stale-revision checks, workflow-blocker policy, other generation/edit/metadata/scheduling boundaries, and direct provider invocation paths remain to be mapped and tested.


## Current-base implementation slice — stale generation revision guard

The generation receipt boundary now verifies that the request's captured `contextRevision` still equals the canonical ContentBuild revision before recording output. It also rechecks asserted channel and project scope against the current canonical build. A request prepared before a lifecycle/profile/build update is rejected rather than attaching output to stale context.

Regression coverage prepares a request, changes the canonical stage (incrementing the build revision), and proves that receipt recording fails closed without writing a `tool.output.recorded` event for the supplied output asset.

This protects the receipt boundary against stale context, but it does not cancel provider work already dispatched. Provider-side authorization/revision checks, the complete action-to-stage matrix, and live authenticated persistence/E2E certification remain open. Release gates are not waived.


## Current-base implementation slice — generation stage allowlist

The generation boundary now uses an explicit allowlist of known pre-publication/editable ContentBuild stages instead of a denylist of post-publication stages. A newly introduced or malformed future stage therefore does not automatically inherit generation permission. The same guard runs during request preparation and ToolReceipt recording, alongside the existing canonical scope and revision checks.

Regression coverage adds a direct request-preparation case for an unrecognized stage and requires fail-closed behavior. This narrows one policy gap; it does **not** certify provider dispatch authorization, the full action-to-stage matrix for non-generation actions, or cross-device durable lifecycle replay. The phase remains open pending all remaining acceptance evidence and same-commit release gates.
