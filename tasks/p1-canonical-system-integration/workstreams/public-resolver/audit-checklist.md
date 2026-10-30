# Audit Checklist — Public resolver production integration, caching, provenance and public-only boundaries

**Audit status:** NOT RUN in this work packet. Source leads below are inventory, not certification.

## Ownership and source audit
- [ ] Refresh target branch SHA and compare active branches/PRs.
- [ ] Confirm canonical owner and domain authority.
- [ ] Inventory current source files, exports, imports, routes, runtime callers and tests.
- [ ] Identify existing task/capability IDs; do not allocate replacements here.
- [ ] Classify every candidate as current-main, branch-only, PR-only, planned, stale or unknown.
- [ ] Identify duplicate stores, adapters, registries, routes and dead scaffolds without deleting them.

## Workstream-specific audit
Verify normalized handle/channel identity; cache key isolation, freshness and expiry; sourceRefs/fetchedAt/limitations; endpoint host/redirect/size/time bounds; RSS and page parse behavior; public-only prompt/evidence; logged-out caller wiring; identify stale scaffold zero-import proof.

## Evidence and disposition
- [ ] Record exact paths, line ranges, SHAs, test commands and observed results.
- [ ] Record open questions, risks, missing caller proof and negative cases.
- [ ] For cleanup, prove zero callers, no-loss migration, parity and rollback before deletion.
- [ ] Obtain independent review before implementation or completion claims.
