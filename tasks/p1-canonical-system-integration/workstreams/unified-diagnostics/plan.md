# P1-03 Unified Diagnostics
**Status:** PLANNED / DISCOVERY REQUIRED | **Owner:** existing diagnostics services + domain event/receipt owners
**Capabilities:** CAP-VERIFICATION, CAP-CREATOR-OPERATIONS, CAP-BRAIN-EXPERIENCE, CAP-EVIDENCE-INTELLIGENCE

## Objective
Connect diagnostics across the six workstreams with a shared typed correlation envelope and actionable evidence while retaining existing domain event and receipt ownership.

## Reuse
src/services/diagnostics.ts; src/services/diagnostics/unified.ts; src/app/onScreenDiagnostics.ts; EvidenceLineageDiagnostics; Google proxy errors; AnalyticsErrorReporter; Brain traces/tool receipts; ContentBuild and Algorithm Intelligence event ledgers; GenerationRecord/operation receipts.

## Contract candidates
correlationId, requestId, operationId, eventId, parentEventIds, channelId, projectId, contentBuildId, assetId/version, provider/model, capabilityId, source system, timestamp, severity, structured error code, retryability, user-safe message and evidence refs. Determine optionality/version only after producer inventory; do not force irrelevant IDs on every domain.

## Phases
0. Inventory schemas, emitters, readers, event IDs, errors and UI surfaces.
1. Define typed envelope and compatibility adapters; propagate correlation identity, do not persist a universal ledger.
2. Normalize actionable error taxonomy: category, code, severity, retryability, user action, operator action, safe details and evidence references.
3. Connect Brain, Gemini, Priority-25 and public resolver producers; use build/test receipts for Studio where runtime diagnostics do not apply.
4. Traverse existing ledgers and report missing links explicitly.
5. Verify useful user/operator diagnostics without secrets or sensitive payloads.

## Acceptance
One action is traceable across relevant producers, gateway/resolver, operation receipt and outcome. Correlation ID is stable across retries; child event IDs are distinct; missing ancestry is explicit. Backward compatibility is preserved or versioned. No second event store/diagnostics DB/task ledger. Tests: test:unified-diagnostics, lineage, schema, producer and idempotency tests. Runtime: safe intentional failures and success in each applicable path.
