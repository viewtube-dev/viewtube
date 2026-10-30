# P1-05 Public Resolver Production Integration

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PLANNED / DISCOVERY REQUIRED  
**Concern:** public resolver production integration  
**Owner:** Existing Public Channel Resolver + BrainRuntime caller + public-handle mode/cache  
**Registry ID:** DOC-PLAN-P1-PUBLICRESOLVER  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE
**Status:** PLANNED / DISCOVERY REQUIRED | **Owner:** existing Public Channel Resolver + BrainRuntime caller + public-handle mode/cache
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE

## Objective
Wire the existing public-channel resolver into the real Brain task path with bounded cache, explicit provenance and enforceable public-only boundaries.

## Existing code leads
src/services/publicHandleMode.ts; public-channel API resolver candidates; api/public-channel.node.test.mjs; publicHandleMode tests and pending-ingestion tests; package command test:public-page-resolver. Inspect exact production caller/exports first.

## Public-only contract
Logged-out identity is the Settings channel handle. Use YouTube-first public metadata/video sources; other public sources only when needed and attributed. Never use OAuth, private Analytics or private account state. Never fabricate counts or missing facts. Return normalized handle/channel identity, source refs, fetchedAt, freshness/cache status and limitations. Cache is not truth; scope entries to normalized handle and include schema/version, expiry and negative reason. Candidate TTLs from earlier design (metadata 6h, videos 3h, negative 30m) must be confirmed against current source before becoming constants. Anonymous history remains in existing local history owner.

## Phases
0. Inspect resolver/API/cache/normalization/production Brain caller/tests/PRs.
1. Define typed result/provenance and negative/error taxonomy.
2. Connect resolver through BrainRuntime without another context broker.
3. Enforce public-only policy at access boundaries.
4. Test freshness, invalidation, negative cache and handle isolation.
5. Runtime certify empty, valid, unknown handle, partial data, stale cache and provider failure.
6. Document provenance and limitations.

## Acceptance
Production Brain path invokes resolver; every fact has source/fetchedAt; missing remains missing; cache states distinguishable and scoped; no OAuth/private calls; logged-out experience is truthfully labeled. Run test:public-page-resolver and runtime proof.
