# Audit Checklist — Priority-25 capability identity and production runtime verification

**Audit status:** NOT RUN in this work packet. Source leads below are inventory, not certification.

## Ownership and source audit
- [ ] Refresh target branch SHA and compare active branches/PRs.
- [ ] Confirm canonical owner and domain authority.
- [ ] Inventory current source files, exports, imports, routes, runtime callers and tests.
- [ ] Identify existing task/capability IDs; do not allocate replacements here.
- [ ] Classify every candidate as current-main, branch-only, PR-only, planned, stale or unknown.
- [ ] Identify duplicate stores, adapters, registries, routes and dead scaffolds without deleting them.

## Workstream-specific audit
Find original Priority-25 packet/PR/task/branch/hand-off; resolve capability ID and user journey; inspect registry/home, runtime surface, permissions, caller graph and route; test actual runtime reachability and failure states; prove no shadow implementation.

## Evidence and disposition
- [ ] Record exact paths, line ranges, SHAs, test commands and observed results.
- [ ] Record open questions, risks, missing caller proof and negative cases.
- [ ] For cleanup, prove zero callers, no-loss migration, parity and rollback before deletion.
- [ ] Obtain independent review before implementation or completion claims.
