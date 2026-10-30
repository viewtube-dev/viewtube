# Gemini provider registry, key validation and generation-operation governance

**Status:** DISCOVERY / VERIFICATION REQUIRED. **Canonical owner:** BrainModelGateway/BrainModelProvider owns provider seam; GeminiKeyContext/key-vault owns key validation/storage; canonical generation runtime and OperationEnvelope/OperationRecord/ToolReceipt own operation governance; prompt registry/spec owns prompt inventory and policy.

## Existing code and task links
Merged PRs #1109, #1168, #1169, #1174; BrainModelGateway.ts; GeminiKeyContext; scripts/audit/ai-generation-callers.mjs and tests; docs/plans/VIEWTUBE_BRAIN_MODEL_GATEWAY_CONVERGENCE_PLAN_2026-10-29.md; VIEWTUBE_AI_PROMPT_MIGRATION_AND_QUALITY_GOVERNANCE_PLAN_2026-10-29.md; VIEWTUBE_PROVIDER_CREDENTIAL_SECURITY_AND_BYOK_PLAN_2026-10-29.md.

## Guardrails
Do not infer a full provider registry from an interface seam. Gemini remains default. BYOK localStorage is not encrypted server storage. Never expose keys in errors/logs. No direct provider calls from UI.

## Work packet
- [Audit checklist](audit-checklist.md)
- [Test and runtime plan](test-plan.md)
- [Agent brief](agent-brief.md)
- Parent [program inventory](../../inventory.md), [task crosswalk](../../task-crosswalk.md), [identity map](../../identity-map.md), [verification matrix](../../verification.md).

This folder is a work packet, not a new source-of-truth store or task ledger. Record implementation status in the owning Task Authority and attach evidence receipts.
