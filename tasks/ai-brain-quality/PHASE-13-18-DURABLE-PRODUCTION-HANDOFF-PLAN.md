# Phases 13–18 — Durable Production Handoffs, Recovery, and Certification

**Status:** Plan opened after integrating the Phase 0–12 implementation slices. Phases 0–12 are not considered production-certified until the current release gates, the canonical publication-to-learning golden path, and deployed-commit checks pass.

**Canonical target:** `master/consolidated-feature-integration`

**Existing authorities to extend (do not create parallel systems):**
- `docs/domains/BRAIN.md` — Brain evidence, action, outcome, and governed learning.
- `docs/specifications/PROMPTS.md` — prompt provenance and validation.
- `src/services/asset-engine/ContentBuildRepository.ts` and `PublishTransaction.ts` — canonical ContentBuild and publication transaction identity.
- `src/services/asset-engine/PostPublishAnalyticsBridge.ts` — publication identity and analytics checkpoint bridge.
- `src/services/analytics-canon/` — canonical analytics evidence and dataset joins.
- `src/services/viewTubeEvaluationLedger.ts` — evaluation and learning-candidate records.
- Existing ActionPacket, Brain Channel Knowledge, and production-handoff contracts.

## Phase 13 — Server-authoritative persistence

**Goal:** Make outcome, checkpoint, evaluation, review, and promotion records durable across reloads, browser profiles, and devices.

1. Inventory existing backend persistence APIs and the canonical database/schema before adding storage.
2. Add a repository adapter to the existing server-authoritative store; retain local/browser storage only as a cache or explicit offline queue.
3. Persist stable record IDs, channel scope, producer/source IDs, publication identity, approved snapshot ID/hash, video ID, checkpoint IDs, evidence window, and review actor/timestamp.
4. Make writes idempotent on stable event/operation identity; do not deduplicate unrelated events merely because their visible payloads match.
5. Define explicit offline behavior: queued, acknowledged, rejected, retryable, or conflict; never display an unacknowledged local write as server-certified.
6. Add migration/version handling and redact secrets from persistence and diagnostics.

**Acceptance:** integration tests prove records survive a fresh client session and are visible to a second authorized client; retries produce one logical record; channel authorization is enforced by the server.

## Phase 14 — Recovery, replay, and reconciliation

**Goal:** Recover safely after a browser refresh, network interruption, retry, or partially completed publishing flow.

1. Reconcile publication transactions with ContentBuild events, approved snapshots, YouTube bindings, analytics checkpoints, Brain outcomes, and evaluations by immutable IDs.
2. Add bounded replay for missing downstream records without duplicating completed upstream transactions.
3. Represent gaps explicitly (missing checkpoint, stale analytics, mismatched channel/video, invalid snapshot hash, permission denial); do not silently infer evidence.
4. Provide deterministic conflict rules when a local queued record disagrees with server-authoritative state.
5. Add fault-injection tests for interrupted writes, duplicate callbacks, out-of-order checkpoints, stale snapshots, and partial retries.

**Acceptance:** replay repairs recoverable gaps, quarantines non-recoverable identity conflicts, and leaves an inspectable audit trail.

## Phase 15 — Canonical publication-to-learning golden path

**Goal:** Prove the entire causal lineage without treating correlation as proof of causation.

1. Create a test ContentBuild and ActionPacket with stable channel/project/workflow/recommendation/experiment identities.
2. Approve and hash a publish snapshot; publish through the canonical transaction path.
3. Record the resulting publication receipt and bind the exact channel/video identity.
4. Ingest canonical analytics checkpoints for declared comparison windows and retain freshness/coverage metadata.
5. Evaluate only matching published-video rows; label missing, stale, incomparable, or low-coverage evidence as inconclusive.
6. Link source asset outcomes and Brain outcomes to the same publication identity.
7. Create a learning candidate only from qualifying evaluations; require named creator review and the existing promotion gate before writing Channel Knowledge.
8. Verify stable identity and attribution through the full path, including duplicate delivery and retries.

**Acceptance:** a single inspectable test trace links approved snapshot → publication transaction → analytics checkpoint → evaluation → outcome → reviewed learning candidate; negative cases fail closed.

## Phase 16 — Cross-surface production handoffs

**Goal:** Connect the canonical pipeline across Publisher, Analytics Intelligence, AI Brain, prompt systems, production tools, Projects, and Studio Hub.

1. Use the canonical ActionPacket as the handoff envelope; validate required inputs, outputs, permissions, evidence references, and destination capability before accepting a handoff.
2. Preserve prompt recipe/version, model route, input evidence IDs, validation results, and generated artifact IDs on each relevant action.
3. Make creator approval explicit before publishing, applying metadata changes, executing consequential actions, or promoting learning.
4. Surface the same lineage IDs and current status in Publisher, Analytics, Brain, Projects, and Studio Hub; do not maintain divergent per-surface copies.
5. Route handoff failures back to the originating tool with actionable recovery state and a durable event record.
6. Keep unsupported actions unavailable rather than simulating successful execution.

**Acceptance:** contract tests and browser E2E tests prove that handoff state, approval status, and lineage agree across all participating surfaces.

## Phase 17 — Governance, privacy, and operational health

**Goal:** Certify that durable lineage is appropriately scoped, inspectable, and safe to operate.

1. Enforce channel/project authorization at read and write boundaries, including replay and promotion.
2. Audit retention, deletion, export, secret redaction, user correction, and rejected/withdrawn approvals.
3. Expose health for evidence freshness, checkpoint coverage, retry backlog, failed reconciliation, and unresolved handoffs.
4. Add diagnostics that report IDs and status without leaking credentials or sensitive prompt content.
5. Keep descriptive associations separate from causal claims; require sufficient independent publications and explicit reviewer approval for promotion.

**Acceptance:** negative permission tests pass; health surfaces expose incomplete lineage; no unsupported causal claim can be promoted.

## Phase 18 — Release and deployment certification

**Goal:** Certify the exact integrated and deployed commit, not merely a feature branch.

1. Resolve TypeScript, focused-contract, source-governance, full-suite, production-build, and local-smoke failures on the settled integration head.
2. Run the Brain quality loop and all production-handoff golden-path tests on the exact candidate SHA.
3. Run browser E2E against the deployed candidate and verify the deployment's reported commit matches the tested SHA.
4. Exercise publication, analytics refresh, reload/recovery, evaluation, creator review, and governed promotion with test data.
5. Record the evidence bundle: commit SHA, workflow run IDs, test summaries, deployment URL/commit, data freshness, and known limitations.
6. Merge or promote only when required checks are green; no check bypasses or manual success labels.

**Acceptance:** a signed-off release record references the exact tested and deployed commit, all required gates are green, and the golden-path trace can be inspected end to end.

## Execution order and exit criteria

- First stabilize the existing integration head and get the Phase 0–12 focused, governance, type, build, and full-suite gates green.
- Implement Phases 13–14 before claiming durable cross-session production lineage.
- Implement Phases 15–16 before claiming end-to-end cross-surface handoffs.
- Implement Phase 17 before enabling broad production rollout.
- Complete Phase 18 last, against the deployed commit.
- Keep each phase in a reviewable PR with tests and explicit evidence; preserve current canonical implementations and avoid wholesale branch replacement.

**Certification rule:** merged code is not the same as a completed phase. A phase is complete only when its implementation, regression tests, integration path, and stated acceptance evidence all pass on the current candidate.
