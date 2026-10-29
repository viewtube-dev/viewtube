# ViewTube Unified Diagnostics Integration

**Status:** Incremental implementation — adapter contract introduced; subsystem integrations remain phased work.
**Base:** `master/consolidated-feature-integration`
**Canonical frontend sink:** `src/services/diagnostics.ts`
**Focused verification:** `npm run test:unified-diagnostics`

## Objective

Normalize existing and future test, runtime, API, data, AI, and deployment signals into the current ViewTube diagnostics buffer. The system should explain a concrete failure in plain language, preserve enough safe evidence to debug it, and distinguish an observed failure from a suspected cause or a verified fix.

This is an adapter layer around the current diagnostics service, not a second event database, test runner, AI runtime, or analytics store. Existing subsystem owners remain authoritative.

## Initial six systems

1. **Google / YouTube authorization and API:** canonical session state, OAuth callback and scopes, token refresh/revocation, typed API routes, API status/quota/error classification, and logged-in/logged-out coverage.
2. **AI Brain / Gemini / evidence:** API-key validation and storage boundary, selected/served model, capability route, channel-profile/context intake, evidence pack IDs, generation outcome, and response-quality checks. Reuse CreatorContextResolver, BrainCapabilityRegistry, BrainRuntimeSnapshot/traces, ToolReceipts, and existing evidence governance. Never log keys, tokens, private chain-of-thought, or raw private payloads.
3. **Analytics / reporting:** Analytics query validation, report-family compatibility, sync freshness, table/schema/storage integrity, query outcome, report job lifecycle, dedupe/idempotency, and provenance.
4. **Accounts / billing / usage:** session identity, plan/entitlement checks, payment lifecycle, usage meter consistency, limits, and persistence. Use synthetic/test billing state; never trigger real charges in automated diagnostics.
5. **Backend APIs / storage / cross-system flow:** route contracts, input validation, status mapping, persistence, schema/migration compatibility, job/queue outcomes, and cross-service correlation.
6. **Frontend / CI / deployment health:** browser runtime and console errors, UI-to-API contracts, critical journey smoke tests, build/typecheck/lint/test outcomes, environment mismatch, and external HTTP/TLS/DNS health.

## Shared event contract

The adapter contract in `src/services/diagnostics/unified.ts` accepts:

- stable `source`, `subsystem`, `kind`, `code`
- severity and status, independently represented
- concise human-readable summary
- optional correlation ID
- expected versus actual outcome
- evidence references and recommended next actions
- confidence and privacy classification
- sanitized structured metadata

The event is retained in the existing in-memory diagnostics ring buffer. It does not introduce persistence. Existing credential-shaped key redaction is reused before structured details are exposed. Correlation IDs must be non-secret and must not contain credentials or personal data.

### Evidence semantics

- **Observed:** exact failure/status/evidence is available.
- **Suspected:** a root cause is plausible but not proven; confidence must say so.
- **Verified fix:** a regression test or independently repeatable check passed after a change.
- **Not checked:** no test or evidence was supplied. Never translate this into a pass.

No adapter may assert that an external test passed unless it supplies a normalized result backed by the runner output. Adapters must be idempotent where practical and must not automatically replay side effects.

## Integration phases

### Phase 0 — Inventory and baseline

- Map every existing diagnostics producer and UI consumer.
- Inventory auth/API, Gemini/Brain, analytics/VT-SYNC/reporting, account/billing, backend storage, CI, and deployment checks.
- Record existing commands and baseline failures before changing production behavior.
- Keep source-of-truth docs and actual code separate; historical plans are not proof of current state.

### Phase 1 — Shared contract and adapter registry

- Keep `src/services/diagnostics.ts` as the canonical buffer and sanitizer.
- Use `src/services/diagnostics/unified.ts` for external payload normalization and pluggable adapter registration.
- Add focused contract tests for registration, malformed payload rejection, source attribution, metadata, and credential redaction.
- Do not allow arbitrary adapters to replace an existing adapter ID silently.

### Phase 2 — Authorization and YouTube API

- Feed auth session, reconnect-required, scope, quota, and typed API failures into the adapter.
- Reuse canonical server-owned session and existing typed routes.
- Test refresh, revoked credentials, transient API failures, missing scopes, and one API failure not signing out the whole app.
- Add static governance tests for direct browser Google requests and token persistence only where the current canonical rules require them.

### Phase 3 — Brain and Gemini

- Instrument key validation, model availability, capability selection, context-pack assembly, evidence retrieval, generation outcome, and response validation.
- Correlate a single request across UI, server, capability, and evidence without storing the API key or hidden reasoning.
- Report missing/stale evidence distinctly from provider errors and generic fallback responses.
- Reuse canonical Brain snapshots, traces, receipts, and evidence IDs; do not add a parallel Brain runtime.

### Phase 4 — Analytics and reporting

- Attach correlation IDs to query validation, source ingestion, transform, persistence, freshness checks, and report generation.
- Preserve dataset/report family, query window, safe schema identifiers, and provenance references.
- Distinguish no data, stale data, missing scope, unsupported query, quota errors, and actual server failures.
- Verify idempotent report ingestion and UI-to-stored-data consistency.

### Phase 5 — Accounts, billing, and usage

- Normalize identity, entitlement, usage, payment-webhook, and storage failures.
- Use provider sandbox/test fixtures and idempotency keys.
- Redact payment tokens and personal data; never place raw payment payloads in the diagnostic export.
- Compare frontend entitlements with the authoritative backend decision.

### Phase 6 — Backend, frontend, CI, and deployment

- Add adapters for existing Node/Vitest tests, browser smoke tests, build/typecheck/lint, backend health, and deployment checks.
- Treat CI logs and SiteTriage results as evidence sources, not proof of internal application correctness.
- Keep external reachability/TLS/DNS findings separate from application runtime findings.
- Make failures link to the originating test, workflow run, route, or safe log excerpt.

### Phase 7 — Natural-language explanation and export

Every failure should render as: what failed, what should have happened, observed result, impact, confidence, evidence references, recommended checks, and verification status. Add filtering by subsystem/severity/status and export a sanitized report (JSON plus readable text/Markdown) from the current diagnostics interface. Export work is not complete until the UI and tests confirm the user can obtain the artifact.

### Phase 8 — Future adapter onboarding

A future test system only needs to:
1. register a unique stable adapter ID;
2. map its native result into the shared event contract;
3. supply a safe evidence reference and correlation ID where available;
4. add adapter contract tests and one representative integration test;
5. document privacy and side-effect boundaries.

Unknown or malformed adapter payloads must be rejected without crashing the app. Add a governance check so new test systems cannot bypass the canonical sink.

## Acceptance gates

- Existing diagnostics callers continue to work without requiring new fields.
- Structured detail is sanitized before being retained and exported.
- No API key, OAuth token, cookie, payment secret, private chain-of-thought, or raw sensitive payload is exported.
- All six systems can produce correlated records in the same diagnostics interface.
- Every diagnostic states evidence and confidence accurately; no fake passes or invented root causes.
- Regression tests cover each adapter and critical cross-system journey.
- CI, local test, and live external health results are labeled separately.
- Fixes are only closed when a regression test or repeatable check passes.
- Rollback removes adapter wiring without replacing subsystem source-of-truth logic.

## Current implementation boundary

The first code slice provides the shared event contract, adapter registry, safe normalization, existing-buffer integration, and focused test command. It does **not** yet mean the six production subsystems are fully instrumented, the diagnostics UI has export controls, or any tests have passed in CI. Those are follow-on phases and must be reported only when implemented and verified.
