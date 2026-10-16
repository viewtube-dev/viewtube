# Vault Workbench — Phases 7–10 Implementation Audit

**Repository:** `viewtube-dev/viewtube`  
**Target:** `master/consolidated-feature-integration`  
**Execution branch:** `migration/vault-operation-store-current-2026-10-16`  
**Current tracking PR:** [#429](https://github.com/viewtube-dev/viewtube/pull/429), migrated from superseded PR #395 onto current integration (foundation PR [#336](https://github.com/viewtube-dev/viewtube/pull/336) merged)  
**Status:** Phases 7–9 partially implemented; phase 10 remains pending exact-head and runtime certification.

This audit deliberately separates source changes from system guarantees that cannot be established by a client-side implementation or documentation alone.

## Phase 7 — Cross-system workflow and identity preservation

### Canonical path identified
- `src/services/assetEngine.ts` is the canonical workflow facade.
- `createAsset` resolves/creates ContentBuild context, records the generation artifact into the canonical Vault adapter, appends `asset.created`, attaches the asset to ContentBuild, and records derivative relations when parent IDs are supplied.
- `handoffAsset` attaches the canonical asset to ContentBuild, creates/persists the existing ViewTube ActionPacket, carries canonical asset ID and ContentBuild context, and appends `handoff.created`.
- These existing owners are reused; this phase does not introduce a parallel asset store, package store, or handoff packet type.

### Implemented versus pending
- **Implemented in existing source:** the canonical Asset Engine and ActionPacket/ContentBuild handoff path described above.
- **Not certified by this continuation:** the complete live vertical slice create → retry → reopen → edit → handoff → return → package → publish. A source read is not proof that every UI route and persistence boundary behaves correctly in a real browser.

## Phase 8 — Server trust, durable operations, and storage

**Status: PARTIALLY IMPLEMENTED IN BRANCH; persistent runtime configuration and worker execution remain pending.**

Added `server/vault-operation-store.mjs` and mounted it in `server/billing-server.mjs` behind the existing `getAuthenticatedViewtubeUserId` account-session resolver. The store uses per-user directories, owner checks, private/no-store responses, idempotency keys, bounded JSON requests, capped records, and persisted lifecycle history for create/list/read/cancel/retry. It fails closed with 503 when `VAULT_OPERATION_STORAGE_DIR` is not configured. Tests in `server/vault-operation-store.test.mjs` cover missing configuration, idempotency, user isolation, lifecycle persistence and invalid transitions.

**Important limit:** this stores durable operation records; it is not yet a worker queue. It does not claim a queued operation is being processed, and retry/cancel state changes do not signal a worker. The media storage and operation directories require persistent mounted storage in the deployed environment. Filesystem persistence also requires a single-writer/atomic coordination strategy before scaling the API horizontally.

Required before closure:
1. Configure and verify `VAULT_OPERATION_STORAGE_DIR` on the target deployment with a persistent mounted disk.
2. Add a real worker claim/lease/heartbeat model and connect operation types to supported media processors.
3. Add race-safe idempotency/claim transactions before horizontal scaling.
4. Verify restart recovery on the actual deployment and test absent authentication/cross-account denial through the HTTP server.

## Phase 9 — Safe batch execution and governed assistance

### Implemented in this branch
- Added `src/services/vaultBatchOperations.ts`.
- Added/extended `src/services/__tests__/vaultBatchOperations.test.ts`.
- Batch selection is bounded to 50 assets and rejects empty, duplicate, or missing IDs.
- Each item is preflighted independently. Unsupported items are skipped with a reason rather than silently processed.
- Sequential execution records per-item success, failure, output identity, receipt, and cancellation. One failure does not hide successful items.
- Source-overwrite behavior is not introduced; the shared media preflight remains derivative-only.

### Explicit limits
- The runner accepts an executor callback. It does **not** pretend all supported processors have been wired into a durable queue or invoke a real batch worker by itself.
- Callers must still connect real processor outputs to canonical asset creation, operation ledger receipts, and source lineage.
- Actual vision/tag AI provider integration remains pending; metadata suggestion proposals are not a model and rights findings are not legal clearance.

## Phase 10 — Exact-head release certification

Historical exact-head run for original PR #395: [run #1697](https://github.com/viewtube-dev/viewtube/actions/runs/38834033324), head `550625bcddec2ca40462981759335c9eda01242b`, base `3017d0c7df6d4b92f997db3692c41cdeebda38b5`. Migrated current-base PR #429 head `bbf5f7e017382014b4b0fbc8848024fa0241d22c` is under release-gate run [#1779](https://github.com/viewtube-dev/viewtube/actions/runs/38842778072); inspect its exact-head result before merge.
- Production build: **passed**.
- Local smoke: **passed**.
- Brain quality loop: **passed**.
- Source governance: **passed**.
- Static typecheck: **passed**, but the combined static-quality job **failed at runtime lint** with 2,250 errors and 158 warnings across many existing source files; examples include settings and supertools code, not the Vault operation-store module.
- Focused Vault operation-store test: **passed** as its own release-gate step. The combined focused-contracts job **failed** on existing integration contract expectations, including a Studio Hub confirmed primitive test and BrainRuntime context expectations.
- Full test suite: **failed** with multiple failures, including the same Studio Hub and BrainRuntime assertions.

These failures mean phase 10 is not certified. The available run logs do not establish that all failing checks are baseline failures, and a clean baseline run was not obtained; do not label them harmless or merge on this evidence. The Vercel commit statuses also report deployment rate limiting (“retry in 24 hours”), so this run does not certify deployment.

### Release gate
1. Focused Vault tests pass on the newest head.
2. Full test suite, typecheck, source governance, focused contracts, and production build are inspected and resolved or formally reconciled according to repository branch policy.
3. Browser flow is verified against the exact deployed commit, including console/network/error states and responsive/keyboard behavior.
4. PR is merged only when required gates permit.
5. Re-read the target branch and verify the merged commit and post-merge checks.

## Completion summary

| Phase | Status | Evidence / remaining gate |
|---|---|---|
| 7 — cross-system workflow | **PARTIAL** | Canonical Asset Engine and ActionPacket route exist; full vertical slice not runtime-certified |
| 8 — server trust and durability | **PARTIAL / DEPLOYMENT CONFIG REQUIRED** | Authenticated owner-scoped operation records and tests added; persistent disk configuration, worker execution, race-safe claims and deployed restart test pending |
| 9 — batch and governed assistance | **IMPLEMENTED IN BRANCH / PARTIAL INTEGRATION** | Planner/runner and tests authored; production processor, ledger, derivative and AI-provider wiring remains |
| 10 — release certification | **PENDING** | Latest-head CI, browser/deployment check, merge, and post-merge read-back required |

No claim is made that phases 7–10 are all production-complete. Closing these phases requires resolving the explicit gates above rather than relabeling them.
