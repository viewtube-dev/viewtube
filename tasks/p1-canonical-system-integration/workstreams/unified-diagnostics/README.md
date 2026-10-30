# Unified diagnostics and shared event identity

**Status:** DISCOVERY / VERIFICATION REQUIRED. **Canonical owner:** OperationEnvelope and OperationRecord remain identity contracts; each domain event store remains its own persistence owner; diagnostics.ts/unified.ts and onScreenDiagnostics remain diagnostics projection and sanitization owners.

## Existing code and task links
VT-005, VT-035, VT-036, VT-046; OperationEnvelope.ts; OperationRecord.ts; diagnostics.ts; diagnostics/unified.ts; onScreenDiagnostics.ts; BrainAssistantContinuity; BrainOutcomeLedger; AlgorithmIntelligenceEventLedger.

## Guardrails
No universal event store or diagnostics database. eventId ≠ operationId ≠ correlationId ≠ contextKey. Do not force operation fields onto non-operation diagnostics. Do not log prompts, credentials, private payloads or raw evidence.

## Work packet
- [Audit checklist](audit-checklist.md)
- [Test and runtime plan](test-plan.md)
- [Agent brief](agent-brief.md)
- Parent [program inventory](../../inventory.md), [task crosswalk](../../task-crosswalk.md), [identity map](../../identity-map.md), [verification matrix](../../verification.md).

This folder is a work packet, not a new source-of-truth store or task ledger. Record implementation status in the owning Task Authority and attach evidence receipts.
