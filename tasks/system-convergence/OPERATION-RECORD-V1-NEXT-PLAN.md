# OperationRecord v1 — Next Plan After Outcome-Lineage Phases

**Date:** 2026-10-15  
**Parent work:** AI Brain phases 7–12; outcome/evaluation/learning integration  
**Implementation branch:** `feat/operation-record-v1-and-outcome-loop-next-plan-2026-10-15`  
**Status:** Phase 0–1 implementation plus a Phase 2 identity-projection slice in progress; later phases are planned, not certified.

## Why this is next

Phases 7–12 established the outcome/evaluation/learning path: publication identity, asset outcome linkage, canonical analytics joins, checkpoint-aware evaluation, evidence-gated candidates, named review, and governed promotion. The remaining architectural gap is that the same creator action is represented by overlapping ActionPacket, GenerationRequest, ToolReceipt, GenerationRecord, BrainTrace, ContentBuild events, and publication receipts. We need a shared identity and lifecycle projection before expanding producer coverage or changing persistence.

**Non-negotiable rule:** OperationRecord is a shared contract/projection, not a new independent event store. Existing systems keep their write authority until a separately reviewed durability migration establishes the canonical backend.

## Phase 0 — Reconcile and certify outcome-learning phases 7–12

- [x] Land publication outcome/evaluation/learning implementation on current integration through replacement PR #269.
- [x] Add capability-evidence coverage for phases 10–12 through PR #270.
- [x] Preserve the distinction between observation, evaluation, causal interpretation, review, and durable knowledge promotion.
- [x] Keep focused Brain quality-loop checks as a distinct signal.
- [ ] Re-run and certify the complete current integration gate after unrelated UI/governance/typecheck failures are repaired.
- [ ] Certify a real-account publication → canonical analytics row → evaluation → reviewed candidate → promotion golden path.
- [ ] Verify retry idempotency across producer boundaries and reload/restart boundaries.

**Current evidence:** the latest integration release-gates run reported production build, local smoke, and Brain quality-loop success. Focused UI contracts, source-governance UI assertions, full suite, and typecheck still failed. The feature is implemented, but end-to-end production certification is not complete.

## Phase 1 — OperationRecord v1 contract and first projection

- [x] Define a versioned operation envelope with stable operation/workflow identity.
- [x] Define lifecycle states, explicit approval metadata, mutation class, reversibility/undo, errors, and timestamps.
- [x] Define shared lineage for creator/channel/project/ContentBuild/video/assets/evidence/trace/ActionPacket/ToolReceipt/GenerationRecord/publication/recommendation/experiment.
- [x] Define scoped idempotency-key construction.
- [x] Enforce legal lifecycle transitions and explicit approval before write operations run.
- [x] Project ActionPacket and ToolReceipt identities without replacing their stores.
- [x] Attach the same operation identity to existing ContentBuild input/output events for GenerationWorkflow.
- [x] Add regression tests for identity continuity, lifecycle gates, and receipt lineage.
- [ ] Verify this branch's focused test and typecheck results in CI.

## Phase 2 — Complete the identity bridge without store duplication

Progress on 2026-10-15:
- Added optional `operationId` and `workflowId` to the shared `GenerationRecord` contract and populated them for ActionPacket-backed generation records.
- GenerationWorkflow requests and ToolReceipts now carry a stable operation/workflow pair, write that pair into ContentBuild input/output event metadata, and project the same identity into OperationRecord.
- Canonical Asset Engine context and generated records can carry operation/workflow identity when a producer supplies it.
- BrainRuntime provenance exposes operation/workflow identity and reports `operation_identity_mismatch` rather than silently joining conflicting explicit IDs.
- Added regression assertions for request/receipt identity continuity and conflict detection.

1. Add optional operation/workflow identity to GenerationRecord and BrainTrace projections where absent.
2. Make the GenerationWorkflow request, ToolReceipt, ActionPacket, BrainTrace, and ContentBuild event agree on the same operationId/workflowId.
3. Extend BrainRuntimeSnapshot to expose unresolved/mismatched operation links as diagnostics, not fabricated lineage.
4. Add parity tests for legacy records and records without optional fields.
5. Inventory production callers before migrating any other writer.

**Acceptance:** a single generation/handoff pilot can be followed from context/evidence through action, receipt, trace, assets, publication, outcome, and evaluation using one stable operation identity.

## Phase 3 — Outcome producer coverage and idempotency matrix

- Inventory writers/readers for Publisher, Project, Editor/render/export, Community/comments, experiments/package selection, Brain, and Asset Engine.
- Map every producer to the canonical outcome/evaluation owner.
- Specify per-producer idempotency keys and retry/replay behavior.
- Preserve specialist evaluators; use shared operation identity rather than another ledger.
- Add tests for duplicate delivery, partial retries, cross-channel/project isolation, missing evidence, and contradictory outcomes.

**Acceptance:** every priority producer has an owner, stable source identity, scope, idempotency rule, evidence path, and test.

## Phase 4 — Server-authoritative persistence decision and migration

- Inventory available server/API/database infrastructure and auth boundaries before selecting a backend.
- Specify tenant/channel authorization, conflict/version semantics, retention, migrations, and auditability.
- Implement a repository interface over the existing contract; keep browser storage as a compatibility/cache adapter only where appropriate.
- Migrate outcome/evaluation/approved-snapshot/publish-transaction state in reversible slices.
- Add cross-device, reload, offline/retry, and concurrent-write tests.

**Acceptance:** critical outcome and publication identity survives browser restart/device change and has a server-authoritative write owner. Do not claim this based on localStorage tests.

## Phase 5 — Publish recovery and remote reconciliation

- Bind each publish transaction to an immutable approved snapshot/hash.
- Resume from persisted step receipts; retry optional steps independently.
- Reconcile remote YouTube state after interrupted requests and avoid duplicate external writes.
- Preserve exact published asset/variant and metadata version identity.
- Exercise timeout-after-remote-success, reload-mid-transaction, stale snapshot, partial metadata update, and duplicate callback fixtures.

**Acceptance:** recovery is idempotent and cannot silently substitute later edits or a different asset.

## Phase 6 — Golden-path and surface certification

- Run the full fixture from Creator Context/Evidence → BrainRuntime → ActionPacket → OperationRecord projection → generation receipt/asset version → approved publish → YouTube binding → analytics checkpoint → evaluation → reviewed learning candidate.
- Assert all identity joins, scope boundaries, evidence IDs, idempotency keys, and audit records.
- Verify no direct model-to-durable-knowledge write and no duplicate persistence owner.
- Certify the real-account path separately from deterministic fixtures.
- Update capability evidence, system-convergence checklist, and release report with exact commit/run links.

**Acceptance:** production claims are backed by both deterministic E2E evidence and current-head release gates.

## Merge and release policy

- Target `master/consolidated-feature-integration`; do not edit `main` directly.
- One reversible PR per phase; current integration wins over stale branches.
- Never bypass failing checks. Separate feature-specific green tests from repository-wide release certification.
- Do not mark a phase complete while its acceptance criteria remain unchecked.
