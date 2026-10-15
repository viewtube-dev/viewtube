# Phase 13 — Server-Authoritative Learning Persistence

**Implementation PR:** pending review  
**Status:** Implementation slice prepared; CI and production database verification pending.  
**Parent plan:** `PHASE-13-18-DURABLE-PRODUCTION-HANDOFF-PLAN.md`

## Scope

Extend the existing authenticated `/api/brain-intelligence` endpoint and PostgreSQL-backed `server/brain-intelligence-store.mjs`. Do not add a second persistence API or replace the existing local ledgers.

The durable record types are:
- `assetOutcome` — creator disposition and verified publication attribution for a generated asset.
- `brainOutcome` — tool/action outcome and ActionPacket/workflow/publication lineage.
- `evaluation` — canonical analytics evidence, comparison window, checkpoints, and resolved result.
- `learningCandidate` — evidence-backed candidate, named reviewer decision, and promotion lineage.

## Implementation

1. Add `viewtube_brain_learning_records`, keyed by authenticated user, connected channel, record type, and stable record ID.
2. Keep server validation strict: accept only known record types, non-empty IDs, and records whose embedded channel matches the authenticated connected channel.
3. Extend the existing GET/PUT API response with typed `learningRecords`; keep existing algorithm events and lifecycle observations unchanged.
4. Queue client writes locally before attempting delivery. Send bounded batches with credentials; only remove queue entries when the server acknowledges the complete batch.
5. Retain pending writes after network failures or HTTP 401; do not represent pending writes as server-acknowledged.
6. Merge durable records into the existing Brain outcome, asset outcome, evaluation, and learning-candidate ledgers by stable ID. A durable record wins when the same ID exists in the local cache.
7. Retry delivery when an idempotent creator action is repeated and during durable hydration.
8. Hydrate the new records alongside the existing Brain intelligence hydration path so the current evaluation inbox can recover them.

## Regression coverage

- Store-level user/channel isolation.
- Idempotent upsert by type and record ID.
- Rejection of unknown record types, missing IDs, and channel mismatches.
- Client queue acknowledgement and queue removal.
- 401 handling preserves pending records and later retry clears them.
- Existing algorithm-event and lifecycle-observation persistence contracts remain in place.

## Verification and limitations

This phase is not production-certified until:
- The focused client tests and server store tests pass on the settled PR head.
- TypeScript, runtime lint, source governance, full suite, production build, and local smoke gates pass.
- A configured PostgreSQL integration test proves persistence across a fresh server process, not just the in-memory development fallback.
- Authenticated GET/PUT is verified against a real connected account/channel and a second authorized client.
- Phase 14 recovery/reconciliation and Phase 15 publication-to-learning golden-path checks pass.

Browser-local queueing is a retry mechanism, not a substitute for server acknowledgement. No causal inference is added by persistence.
