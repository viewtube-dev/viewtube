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

## Current-base implementation slice — publication producer ancestry

The publication receipt now preserves the stable producer outcome IDs and generation trace IDs for the exact selected assets, in addition to the existing channel/project/ContentBuild, ActionPacket/workflow/recommendation/experiment, approved snapshot/hash, transaction and video identity.

- The bridge reads outcomes only for the matching channel and selected asset IDs.
- Outcome record IDs and trace IDs are deduplicated and sorted for deterministic receipts.
- Unselected assets are excluded.
- Retry handling restores ancestry already recorded on the immutable receipt and unions any still-available producer IDs, so a missing browser-local outcome does not erase previously recorded provenance.
- Regression coverage verifies selected-asset filtering, trace continuity, metadata persistence and retry restoration.

This improves the recommendation-to-publication lineage edge; it does not by itself prove that every upstream recommendation/creator-decision writer supplied its stable IDs or that downstream records are durable across devices.
