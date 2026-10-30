# P1-02 Gemini Provider, Key and Generation Governance

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PLANNED / DISCOVERY REQUIRED  
**Concern:** gemini provider, key and generation governance  
**Owner:** BrainModelGateway + provider layer + Creator Operations  
**Registry ID:** DOC-PLAN-P1-GEMINIGOVERNANCE  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-OPERATIONS
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


## Implementation reconciliation — 2026-10-29

The plan is no longer discovery-only. The following merged work is part of the current integration baseline and must be preserved:

- **PR #1131 (merged):** canonical model registry, alias/capability resolver, generation profiles, model selector projection, and registry-linked metering.
- **PR #1134 (merged):** bounded capability-preserving fallback and privacy-safe fallback telemetry.
- **PR #1168 (merged):** streaming authorization, entitlement preflight, and usage metering parity; its caller-audit commands remain required evidence.
- **PR #1174 (merged):** provider-neutral `BrainModelGateway` contract and injectable provider factory. Production caller migration was explicitly out of scope for that PR.
- **PR #1176 (merged):** shared `getAiClient()` generation-profile/fallback boundary, modality-aware resolution, and served-model attribution.
- **PR #1178 (merged):** canonical P1 workstream ownership and integration governance.

### Current phase status

| Phase | Status | Evidence / remaining gate |
| --- | --- | --- |
| 0 — exhaustive inventory | **PARTIAL** | Known callers and governance hotspots are mapped. A fresh exact-head repository-wide scan of SDK construction, all generation/streaming/embedding/media calls, model IDs, key aliases, pricing and provider allowlists is still required. |
| 1 — provider/model governance | **IMPLEMENTED, NOT LIVE-CERTIFIED** | Registry and resolver are canonical. Static metadata does not prove current availability for every key/project/API version; legacy compatibility candidates and unverified prices remain. |
| 2 — key validation | **PARTIAL** | Key entry uses the shared vault and model-list discovery; valid keys can be saved while verification is degraded, and invalid credentials are rejected. Add focused taxonomy/cleanup coverage and verify no secret reaches diagnostics. |
| 3 — gateway/operation migration | **IN PROGRESS** | This branch moves Brain reflection in `src/services/brain/Core.ts` through the existing `BrainModelGateway`. `CollabEngine.ts` and `VideoCommentOperatorWidget.tsx` remain explicit migration targets; the latter needs its approved Creator Operations boundary, not a generic Brain gateway shortcut. |
| 4 — operation provenance | **OPEN** | Served-model attribution exists at the provider boundary. End-to-end operationId, prompt/version, provenance, retry/idempotency, status, usage/cost and result/asset references are not yet certified across retries and ingestion. |
| 5 — runtime certification | **NOT RUN** | No controlled valid/invalid-key, unsupported-model, quota/outage, reasoning, or successful generation runtime matrix is claimed. |
| 6 — remove direct paths | **BLOCKED** | Do not remove compatibility paths or shrink allowlists further until exact zero-caller proof and runtime parity are recorded. |

### Current branch implementation slice

Branch: `feat/p1-gemini-governance-reconciliation-2026-10-29`

- Added a regression contract requiring Brain reflection to use `defaultBrainModelGateway.generateJsonObject`.
- Migrated `reflectAndCompress` in `src/services/brain/Core.ts` to the existing gateway. Gemini remains dynamically loaded by the gateway adapter; Brain Core no longer dynamically imports the provider service or invokes `models.generateContent`.
- Removed `src/services/brain/Core.ts` from the direct-provider architecture guard allowlist.
- Focused tests have been authored but have **not** been executed in this editing environment. CI must verify the exact branch head before this slice is considered complete.

### Next required work

1. Complete the exact-head Phase 0 inventory and reconcile the `npm run audit:ai-generation-callers` / `npm run test:ai-generation-callers` evidence from PR #1168.
2. Migrate the remaining Brain/creator callers one at a time through the correct existing gateway or approved specialist operation, with parity tests.
3. Close the Phase 4 provenance contract across operation receipts, retries, and asset ingestion.
4. Run the controlled runtime matrix for key states, model mismatch, quota, outage, reasoning and generation success/failure.
5. Remove legacy direct-provider paths only after architecture guard zero-caller evidence.
