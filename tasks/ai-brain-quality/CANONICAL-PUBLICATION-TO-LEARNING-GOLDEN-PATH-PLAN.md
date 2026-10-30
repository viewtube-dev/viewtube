# Next Plan — Canonical Publication-to-Learning Golden Path

**Purpose:** After the current integration head is validated and the Phase 0–13 release blockers are reconciled, certify the full creator-approved feedback loop from a Brain recommendation through publication, analytics evidence, evaluation, and governed learning.

**Depends on:** PR #340 current-base reconciliation; the existing Phase 7–12 outcome/evaluation/governed-learning implementation; Phase 13 durable learning persistence. This plan extends the canonical services and contracts; it does not create a second workflow, analytics source, or knowledge store.

## Canonical path

1. **Recommendation and evidence.** Produce a recommendation from current canonical Analytics Intelligence evidence. Preserve dataset/snapshot IDs, selected window, freshness, coverage, and evidence IDs. If evidence is absent or stale, the recommendation must say so.
2. **Creator approval.** Bind the recommendation to the canonical Project and ActionPacket. Record the creator's explicit approval, reviewer identity, action scope, and any changed inputs. No implicit approval or background publish.
3. **Approved publication snapshot.** Generate and hash the approved metadata/asset snapshot. Carry channel, project, ContentBuild, workflow, ActionPacket, recommendation, experiment, and selected-asset IDs into the publication transaction.
4. **Publication confirmation.** Execute the existing PublishTransaction and record a stable publication receipt. Bind the exact connected channel and published video ID; verify the approved snapshot/hash and transaction identity on retries.
5. **Post-publication checkpoints.** Use PostPublishAnalyticsBridge to record idempotent analytics checkpoints with observation timestamps, window definitions, source IDs, coverage, freshness, and comparability.
6. **Canonical evidence join.** Join analytics only on the exact published video and matching channel/snapshot. Never substitute title/date similarity or convert missing rows into zero. Mark insufficient, stale, mismatched, or low-coverage evidence inconclusive.
7. **Evaluation.** Create a durable EvaluationRecord with baseline/comparison snapshot IDs, selected window, evidence IDs, checkpoint IDs, outcome, confounders, and explicit causal-assessment level.
8. **Outcome lineage.** Link asset outcomes and Brain outcomes to the same immutable publication identity. Preserve source record, trace, asset, transaction, approved snapshot/hash, video, and ActionPacket lineage.
9. **Governed learning candidate.** Create a candidate only from a resolved evaluation with available evidence and qualifying comparability. Candidate creation does not approve or promote knowledge.
10. **Human review and promotion.** Require a named reviewer and explicit approval. Promotion must use the existing Brain Channel Knowledge governance path, enforce minimum independent published-video evidence, retain positive and contradictory observations, and record descriptive association only unless a controlled experiment supports causality.
11. **Cross-session recovery.** Reopen the Studio/Brain surface in a fresh client session, hydrate durable records, flush queued writes, and verify that IDs and review/promotion state are unchanged.
12. **Evidence bundle.** Capture candidate commit SHA, workflow run IDs, publication receipt, snapshot/hash, checkpoint IDs, evaluation record, outcome links, reviewer decision, and promoted claim/decision IDs.

## Required contract tests

- Successful path: approved ActionPacket → approved snapshot → publication receipt → current canonical analytics rows → evaluation → linked outcomes → reviewed candidate → governed promotion.
- Duplicate publication callback, checkpoint delivery, outcome write, evaluation request, and candidate request remain idempotent.
- Channel mismatch, wrong video ID, transaction mismatch, snapshot/hash mismatch, missing approval, or unselected asset fails closed.
- Missing/stale/partial/incomparable analytics produces an inconclusive evaluation and cannot produce a promotion candidate.
- Reused idempotency key with changed publication or evidence scope is rejected.
- 401/offline persistence keeps the write queued and unacknowledged; retry after authentication persists exactly one logical record.
- Fresh-client hydration restores the same channel-scoped record IDs and reviewer state.
- Promotion requires the configured minimum of independent published videos and the existing positive-rate guard; conflicting outcomes remain attached.
- No code path labels observational correlation as causal proof.

## Execution gates

### Gate A — Current integration validation
- TypeScript, focused contracts, Brain quality loop, source governance, production build, and local smoke must pass on the exact head.
- Triage the current full-suite and runtime-lint baseline failures without weakening or bypassing tests.
- Confirm the candidate branch is based on the current integration head.

### Gate B — Golden-path integration
- Add one deterministic integration test spanning the existing publication, analytics, evaluation, outcome, and learning services.
- Add fault-injection and duplicate-delivery cases around every asynchronous boundary.
- Verify the persisted server response and the local hydrated view match on stable identity and state.

### Gate C — Production certification
- Run against configured PostgreSQL and an authenticated connected channel; prove persistence across a fresh server process/client session.
- Verify the deployed commit SHA equals the tested candidate SHA.
- Publish a signed-off evidence bundle and list any unsupported or incomplete paths explicitly.

## Definition of done

The path is complete only when every required contract test passes, all required release gates are green, the exact deployed commit is verified, and the end-to-end evidence bundle proves the creator-approved lineage. A merged implementation without that evidence is not certified.


## Cross-program execution alignment — 2026-10-29

This golden path is the publication/evaluation/learning integration phase of the consolidated program:
`tasks/p1-canonical-system-integration/workstreams/ai-brain-quality-and-systems-management/plan.md` Phase 5.

Before implementation, complete Phase 0 baseline and verify the existing canonical publication owners and Phase 0–4 dependencies. Reuse the existing `BrainRuntimeSnapshot` provenance projection where useful; do not add a parallel provenance ledger.

Additional explicit verification requirements:
- exact stable identity propagation across request, context manifest, tool receipt, BrainTrace, ActionPacket, selected/final asset, PublishTransaction, analytics checkpoint, outcome, EvaluationRecord and learning candidate;
- distinguish an evaluation event reference from a fully resolved durable EvaluationRecord;
- prove authenticated server persistence and fresh-client hydration, not merely local/browser state;
- test exact video/channel/snapshot/hash joins and idempotency under duplicate/retried delivery;
- record exact tested commit and workflow evidence.

No golden-path implementation or certification is claimed by this documentation update.
