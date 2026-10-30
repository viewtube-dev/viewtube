# Test and Runtime Plan — Gemini provider registry, key validation and generation-operation governance

**Status:** PLANNED. Do not report tests as passing until executed on the implementation branch.

## Existing test leads
test:ai-generation-callers; GeminiKeyContext tests; BrainModelGatewayBoundary tests; key vault tests; architecture guard; generation operation/receipt tests; streaming authorization/metering tests; prompt migration regression corpus; secret-redaction tests.

## Required production-caller proof
Exercise missing/invalid/valid key, unsupported model, provider outage, streaming, retry, logged-in and BYOK paths. Verify creator-safe errors, no secret leakage, correct provider/model/prompt provenance and operation receipt.

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
