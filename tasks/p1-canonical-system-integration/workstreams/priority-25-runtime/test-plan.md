# Test and Runtime Plan — Priority-25 capability identity and production runtime verification

**Status:** PLANNED. Do not report tests as passing until executed on the implementation branch.

## Existing test leads
After identity is confirmed: capability registry schema/uniqueness tests; BrainRuntime dispatch/authorization tests; caller reachability; route-to-runtime integration; audit:reach; audit:ai-systems; test:ai-systems-governance; negative permission/context tests.

## Required production-caller proof
No implementation runtime gate can be claimed until identity is confirmed. Then invoke from intended user surface with valid/invalid permissions, empty/stale context, service outage and retry; collect exact caller and runtime receipt.

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
