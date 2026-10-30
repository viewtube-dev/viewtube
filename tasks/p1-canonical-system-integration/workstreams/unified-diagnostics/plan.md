# P1-03 Unified Diagnostics

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PLANNED / DISCOVERY REQUIRED  
**Concern:** unified diagnostics  
**Owner:** Existing diagnostics services + domain event/receipt owners  
**Registry ID:** DOC-PLAN-P1-UNIFIEDDIAGNOSTICS  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-VERIFICATION, CAP-CREATOR-OPERATIONS, CAP-BRAIN-EXPERIENCE, CAP-EVIDENCE-INTELLIGENCE
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


## Existing task alignment (2026-10-30)
Extend the already-tracked reliability work rather than opening a competing envelope or ledger:
- VT-005: typed OperationEnvelope and deterministic scoped idempotency-key contract (existing foundation; confirm current implementation/CI).
- VT-035: correlation IDs across the creator loop.
- VT-036: structured error/failure-state taxonomy.
Current producers/owners include Brain traces, GenerationRecord/ToolReceipt, ContentBuild event stream, Algorithm Intelligence event ledger, AnalyticsErrorReporter and existing diagnostics services. No universal event store or diagnostics DB.


## Existing typed identity contract — source inspected (2026-10-30)
- `OperationEnvelope v1` already provides eventId/eventType/operationId/correlationId/causationId/idempotencyKey, channel/project/contentBuild scope, actor, evidenceRefs and artifactRefs.
- `OperationRecord v1` already models operation lifecycle/approval and lineage to trace, ActionPacket, ToolReceipt, GenerationRecord, publish transaction/snapshot, recommendation/experiment and parent operation.
- `UnifiedDiagnosticEvent` currently provides optional correlationId, evidenceRefs, recommendedActions and privacy, but no first-class eventId/operationId/causation/parent ancestry or channel/project/contentBuild scope. Determine safe optional projection from existing envelope; do not require these for non-operation diagnostics.
- `diagnostics.ts` already sanitizes secret-shaped keys, bearer tokens and sensitive query values. `unified.ts` uses adapters and the bounded in-memory ring; do not add durable diagnostics persistence.
- BrainOutcomeLedger and AlgorithmIntelligenceEventLedger already carry operation/trace/source/parent/evidence/outcome links. The gap is consistent adoption and cross-producer correlation, not another event schema or ledger.
