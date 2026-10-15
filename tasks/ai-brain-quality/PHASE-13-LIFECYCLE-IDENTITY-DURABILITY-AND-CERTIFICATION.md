# Phase 13 — Lifecycle identity, enforceable capability policy, durable evaluation

Date: 2026-10-15  
Target: `master/consolidated-feature-integration`  
Status: **Plan opened; implementation and certification are incomplete.**

## Why this phase starts now

Phases 10–12 have their implementation foundations: canonical ContentBuild phase resolution, governed communication classification, explicit-ID attribution resolution, and an initial read-only attribution panel in draft PR #325. They are not yet certified complete because production writers do not yet prove complete stable-ID propagation, stage capabilities are not enforced at all action boundaries, durable persistence does not cover every outcome/evaluation record, and current-head release gates still contain failures.

This phase turns those remaining acceptance criteria into one testable production lifecycle. It does not treat a publication receipt as a measured outcome, a correlation as causality, or a prompt instruction as an authorization boundary.

## Workstream A — canonical lifecycle identity

1. Define a versioned identity contract covering channel, project, ContentBuild, recommendation, creator decision, generation trace, selected/final asset, ActionPacket, workflow, publish transaction, approved snapshot/hash, verified video, analytics checkpoint, evaluation record, and learning candidate.
2. Map each existing writer to the contract before changing behavior; preserve existing canonical IDs and migrate only where the source of truth exists.
3. Require explicit ancestry or exact stable IDs for every edge. Reject channel mismatch, conflicting ID reuse, missing identity, and ambiguous joins.
4. Add writer-level contract tests for both successful propagation and fail-closed cases.
5. Keep unattributed records visible in the inbox; never infer attribution from timestamp proximity or project co-membership alone.

**Acceptance:** an end-to-end fixture proves every ID survives recommendation → creator decision → generation/selection → ActionPacket → publication → canonical checkpoint → evaluation → governed learning.

## Workstream B — enforce ContentBuild-stage capabilities

1. Keep ContentBuild as the sole owner of the canonical project stage.
2. Convert the existing phase-relevant capability list into an allowlist checked by tool/action dispatch, not just prompt construction.
3. Ensure UI affordances, tool registry and backend/action dispatch use the same policy result.
4. Fail closed when the canonical ContentBuild snapshot is missing, stale, belongs to another project, or has blockers that prohibit the requested action.
5. Add tests proving a capability absent from the current stage cannot be executed through a direct call, even if the prompt or UI requests it.

**Acceptance:** stage policy is enforced at the final action boundary, and route labels or stale UI state cannot grant capability.

## Workstream C — durable outcome/evaluation persistence

1. Extend authenticated server persistence for Brain outcomes and evaluation records, reusing the existing channel-scoped persistence conventions where appropriate.
2. Version payloads and validate channel ownership server-side.
3. Use idempotency keys for retries; detect conflicting reuse rather than silently merging incompatible outcomes.
4. Hydrate, reconcile and replay records across devices without overwriting newer canonical publication/evaluation data.
5. Keep local-only mode explicitly labeled as local-only; never certify cross-device continuity based on browser storage.

**Acceptance:** authenticated integration tests prove create, retry, conflict, reload, and second-device replay for outcome and evaluation records.

## Workstream D — communication consent and retention

Implemented in the companion consent slice:
- Per-channel `captureCreatorCommunications` opt-in defaults to off.
- The ingestion service enforces consent even when called directly.
- New events retain classification and a deterministic fingerprint, not raw message text.
- Hydration redacts legacy raw text and routes sanitized events through the existing durable-sync writer.

Still required:
- Verify server-side upsert semantics actually replace the previous raw metadata.
- Verify the legacy purge against authenticated durable data and another device.
- Audit every chat, tool-feedback, approval, rejection and edit caller for consistent consent handling.
- Confirm opt-out prevents new capture and that logs/telemetry never include raw message content.

**Acceptance:** tests demonstrate no raw text in new local or server records, legacy records are redacted, and opt-out prevents ingestion.

## Workstream E — live provider-backed lifecycle verification

1. Use fresh channel-scoped canonical VT-SYNC snapshots and verified publication receipts.
2. Exercise recommendation, creator approval/rejection, execution, publication, checkpoint capture, evaluation and governed learning.
3. Assert exact video/channel/snapshot identity at each stage; record missing metrics and freshness limitations.
4. Separate observed change, comparison, interpretation and causal claims.
5. Record provider/model identity only when the provider actually reports it.

**Acceptance:** a repeatable integration/E2E receipt identifies the exact commit, test data/channel scope, observed events, missing stages, and known limitations.

## Workstream F — release-gate baseline

The current repository has known failures in focused contracts, confirmed-library-layout/source governance, full-suite tests and runtime lint that span Studio, Vault and UI contracts. These are not to be waived or attributed to Brain without evidence.

1. Run the exact target-branch baseline and archive the failing test names/logs.
2. Run the same commands on the candidate commit.
3. Fix regressions introduced by this work; route unrelated failures to their owning UI/governance plans.
4. Require focused Brain contracts, typecheck, runtime lint, full suite, production build, source governance/reachability and local smoke to pass before certification.

## Exit criteria

Phase 13 is complete only when all workstreams have acceptance evidence on the same reviewed commit, the attribution chain is validated against real caller paths, and release gates are green. Until then, phases 10–12 remain **implemented foundations, not certified complete**.
