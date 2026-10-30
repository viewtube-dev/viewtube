# P1-02 Gemini Provider, Key and Generation Governance
**Status:** PLANNED / DISCOVERY REQUIRED | **Owner:** BrainModelGateway + provider layer + Creator Operations
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-OPERATIONS

## Ownership
BrainRuntime orchestrates reasoning. BrainModelGateway owns model execution. Existing provider registry/adapter owns provider/model metadata and supported operations. GeminiKeyContext/key vault owns key entry, secure storage and validation. Creator Operations / GenerationRecord / ToolReceipt owns generation operation identity, status, retry and provenance. Prompt specification/registry owns prompt identity/version.

## Phases
0. Inventory SDK imports, generateContent calls, model IDs, validation, key storage, generation callers and allowlists; reconcile PR #1109/#1168/#1169/#1174.
1. Normalize Gemini provider/model capabilities and structured availability; no silent downgrade.
2. Separate key validation from generation; distinguish invalid key, unsupported model, permission, quota, network and provider outage; support logged-in/out key entry where supported.
3. Move creator reasoning/generation callers behind existing gateway/approved operation boundaries, shrinking direct-SDK allowlists one caller at a time.
4. Preserve operationId, provider/model/version, prompt/version, provenance, status, timestamps, retry/idempotency, usage/cost where available, error and result/asset reference.
5. Runtime certify key add/validate, reasoning and generation success/failure in applicable account states.
6. Remove direct provider paths only after zero-caller proof.

## Acceptance
No creator-facing model call bypasses gateway or governed specialist operation; credential validation is not generation; no secrets in logs/diagnostics; provider/model mismatch is actionable; no hidden fallback; operation and prompt/provider/model provenance survive retries and asset ingestion. Test provider/gateway, architecture guard, GeminiKeyContext, key vault, operation/receipt/idempotency and prompt governance. Runtime includes valid/invalid key, unsupported model, outage and successful generation.
