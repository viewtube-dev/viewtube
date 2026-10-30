# Test and Runtime Plan — Unified diagnostics and shared event identity

**Status:** PLANNED. Do not report tests as passing until executed on the implementation branch.

## Existing test leads
test:unified-diagnostics; diagnostics.test; diagnostics/unified.test; OperationEnvelope and OperationRecord tests; EvidenceLineageDiagnostics tests; sanitizer tests; producer adapter tests; retry/idempotency tests.

## Required production-caller proof
Trigger correlated Brain, generation, analytics/evidence, project/content/asset, outcome/learning and Studio export failures. Verify one trace can be traversed, recommendations are actionable, privacy redaction works and no store ownership changes.

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
