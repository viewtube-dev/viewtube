# P1-05 Public Resolver Production Integration

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-30  
**Class:** PROGRAM  
**Status:** ACTIVE — PHASE 0 COMPLETE / PHASE 1 PARTIALLY IMPLEMENTED; VERIFICATION BLOCKED  
**Concern:** public resolver production integration  
**Owner:** Existing Public Channel Resolver + BrainRuntime caller + public-handle mode/cache  
**Registry ID:** DOC-PLAN-P1-PUBLICRESOLVER  
**Discovery Base SHA:** cfafde00519ce29a4507dcc7ec7d2cad96798303  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE

## Objective

Wire the existing public-channel resolver into the real Brain task path with bounded cache, explicit provenance and enforceable public-only boundaries.

## Canonical ownership and inspected production paths

- `api/public-channel.mjs` is the existing unauthenticated YouTube page + RSS resolver. It validates YouTube hosts, manually checks redirect targets, bounds response size, applies a request timeout, and returns public metadata with all performance counts null.
- `server/billing-server.mjs` exposes the handler at `/public-channel/resolve`; the app API route is `api/public-channel.mjs`.
- `src/services/publicHandleMode.ts` is the existing browser adapter. It normalizes handle-like inputs, calls the server resolver, rejects fixture IDs as live results, and preserves explicitly enabled fixture fallback. It currently performs independent requests for `resolvePublicChannel` and `fetchPublicChannelSnapshot`; this duplicates upstream work during Settings selection.
- `src/views/Settings.tsx` owns the explicit user action for selecting a public handle. It persists `vt_public_channel_handle`, `vt_public_channel_input`, `vt_public_channel_id`, `vt_ingest_mode`, and, after successful snapshot fetch, `vt_public_channel_snapshot`.
- `src/services/aiBrainCommandInterface.ts` currently reads `vt_public_channel_snapshot` synchronously in `readStoredPublicChannelSnapshot`, checks active channel identity in `publicSnapshotMatchesActiveChannel`, and merges public video titles into `buildAIBrainContextSnapshot`. It does **not** invoke the resolver or refresh stale/missing snapshots on the Brain task path. This synchronous builder is used by multiple surfaces, so making it async would be a broad breaking change; integrate refresh at the canonical async task boundary instead.
- Public evidence is deliberately title/date-only: `publicChannelEvidenceVideo` sets all performance metrics to null. The Brain context snapshot labels the source partial and discloses that performance metrics are unavailable.
- Existing local anonymous history ownership is outside the resolver; do not move it or create another store.

## Phase 0 — discovery findings (complete)

### Existing tests and commands

- `api/public-channel.node.test.mjs`: endpoint behavior, parsing, YouTube allowlist, redirect rejection, direct channel-ID resolution, and method rejection.
- `src/services/publicHandleMode.test.ts`: server-side resolver use, no API-key leakage, fixture boundaries, mismatched identity rejection, and unavailable resolver behavior.
- `src/services/publicHandleMode.pending-ingestion.test.ts`: persistence of valid unresolved handles without inventing channel IDs.
- `npm run test:public-page-resolver`: runs the Node-native endpoint tests and the two Vitest suites.
- Repository package scripts also expose `typecheck` and `build`; CI is the executable validation gate where no checkout/runtime is available.

### Donor PR reconciliation

All relevant resolver foundation work is already merged into the target lineage and must be reused, not replayed:

- [#1028](https://github.com/viewtube-dev/viewtube/pull/1028) — public-handle ingestion endpoint, Settings selection, local snapshot storage and public-only limits (merged).
- [#1032](https://github.com/viewtube-dev/viewtube/pull/1032) — unresolved-handle persistence and pending-ingestion tests (merged).
- [#1105](https://github.com/viewtube-dev/viewtube/pull/1105) — server-side public resolver, public-only payload and resolver hardening (merged).
- [#1121](https://github.com/viewtube-dev/viewtube/pull/1121) — reconciled Node-native endpoint test runner on the current integration head (merged).
- [#1130](https://github.com/viewtube-dev/viewtube/pull/1130) — redirect boundary hardening and focused CI workflow (merged).
- [#1111](https://github.com/viewtube-dev/viewtube/pull/1111) — superseded by #1121; closed without merge. Do not port.
- [#1178](https://github.com/viewtube-dev/viewtube/pull/1178) — canonical P1 plan only; does not claim runtime integration.

No separate public-channel cache/provenance implementation PR was found in the repository PR search. No donor branch should be merged wholesale.

## Public-only contract

Logged-out identity is the Settings channel handle. Use YouTube-first public metadata/video sources; other public sources only when needed and attributed. Never use OAuth, private Analytics or private account state. Never fabricate counts or missing facts. Return normalized handle/channel identity, source refs, fetchedAt, freshness/cache status and limitations. Cache is not truth; scope entries to normalized handle and include schema/version, expiry and negative reason. Candidate TTLs from earlier design (metadata 6h, videos 3h, negative 30m) are hypotheses, not approved constants; confirm with tests and observed source behavior before adopting them. Anonymous history remains in the existing local history owner.

## Phases

0. Inspect resolver/API/cache/normalization/production Brain caller/tests/PRs. **Complete.**
1. Define typed result/provenance and negative/error taxonomy. **Partially implemented:** positive-result provenance and bounded browser cache added; typed negative/error taxonomy, stale fallback and full identity-mismatch hardening remain. Focused resolver CI passed; typecheck and wider CI remain failing.
2. Connect resolver through the canonical async Brain task boundary without another context broker or changing the synchronous snapshot-builder contract.
3. Enforce public-only policy at access boundaries, including logged-out identity and isolation from connected/private channel data.
4. Test freshness, invalidation, negative cache and handle isolation.
5. Runtime certify empty, valid, unknown handle, partial data, stale cache and provider failure.
6. Document provenance and limitations.

## Phase 1 design constraints

- Keep `publicHandleMode.ts` as the one browser adapter and `api/public-channel.mjs` as the one public upstream resolver.
- Introduce no new resolver service, context broker, event store, or anonymous-history owner.
- Normalize once and use the normalized handle/channel ID as the cache key; never use raw user input as an unbounded key.
- Cache envelope must carry a schema version, normalized identity, fetched timestamp, expiry, positive/negative outcome, source refs, limitations and a typed reason for negative results.
- A cache hit must preserve original `fetchedAt` and clearly report cached/stale status; refreshing must never relabel old evidence as newly fetched.
- Do not cache transient provider/network failures as “not found”; negative cache only definitive invalid/unknown outcomes and preserve the reason.
- A channel ID and handle returned together must be identity-consistent before caching or using the snapshot.
- All public video metrics remain null. Public metadata cannot be treated as authenticated ownership or private analytics.
- Browser storage must be bounded and resilient to malformed/old entries; no cache entry may leak across handles.
- Current implementation caches only successful public snapshots for a 3-hour combined metadata/video TTL. It does not cache negative results or transient failures. Per-field TTLs and stale-while-revalidate are intentionally not implemented yet.

## Acceptance

Production Brain task path invokes the existing resolver when a public handle is selected and the cached result is absent/expired; every public fact has source and fetchedAt; missing remains missing; cache states distinguishable and scoped; transient failures do not poison negative cache; no OAuth/private calls; logged-out experience is truthfully labeled. Run `npm run test:public-page-resolver`, relevant Brain tests, typecheck, build and runtime proof.

## Verification record

- Phase 0 source inspection and PR reconciliation performed against `master/consolidated-feature-integration` at base SHA `cfafde00519ce29a4507dcc7ec7d2cad96798303`.
- Source and existing test files were inspected through GitHub.
- Phase 1 added a versioned, bounded (20-entry) browser cache, normalized request-identity keys, positive-result provenance, source references, limitations, original fetchedAt preservation, and null metric enforcement. Tests were added for cache reuse, handle isolation, malformed storage, and metric redaction.
- GitHub Actions did execute the branch at head `3d33002943dbeda4b415709e0495a33ae13c5712`: `npm run test:public-page-resolver` **passed**; production `npm run build` **passed**; typecheck **failed**; the broader focused-contract and full-suite jobs **failed**; source-governance also failed at the confirmed-catalog audit. The local container still cannot clone GitHub, so no local run is claimed. The focused resolver result validates the new cache tests, but the PR is not green.
- Phase 1 remains incomplete: typed negative/error taxonomy, expiry/stale behavior tests, robust handle-vs-channel identity checks, and runtime integration are still outstanding. The generic `BrainRuntimeRequest` currently has no explicit public-handle identity/mode field; the only confirmed identity source is Settings-owned local storage. Do not couple the generic runtime to browser storage or infer public mode from `channelId` (which may represent a connected/private channel). Add an explicit, caller-provided public-handle context contract and tests before wiring refresh.
