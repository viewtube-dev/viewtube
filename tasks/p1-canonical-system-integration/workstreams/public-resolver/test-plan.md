# Test and Runtime Plan — Public resolver production integration, caching, provenance and public-only boundaries

**Status:** PLANNED. Do not report tests as passing until executed on the implementation branch.

## Existing test leads
test:public-page-resolver; api/public-channel.node.test; api/public-channel.test; publicHandleMode tests; pending-ingestion tests; BrainRuntime public-handle contract tests; host/redirect rejection; no-key operation; cache provenance and identity mismatch tests.

## Required production-caller proof
Logged-out Settings handle selection → each Brain surface; valid, invalid, unknown, cache hit, expiry/stale, outage and RSS ingestion. Confirm private Analytics/OAuth data never enters context and missing metrics remain null.

## Evidence receipt
Record commit SHA, environment, caller/surface, auth state, fixture/source provenance, exact command and exit code, observed IDs, screenshots/log references, failures and limitations. Never include secrets or raw private payloads.

## Exit conditions
- [ ] Failing regression test first for each behavior change.
- [ ] Focused tests pass without weakening existing assertions.
- [ ] Integration and negative cases pass.
- [ ] Actual production caller exercised.
- [ ] Runtime evidence confirms owner, identity and provenance.
- [ ] Build/typecheck/full relevant suite results recorded separately.
- [ ] Independent review confirms no duplicate owner or unsupported claim.
