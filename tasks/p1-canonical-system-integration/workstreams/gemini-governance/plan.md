# P1-02 Gemini Provider, Key and Generation Governance

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-30  
**Class:** PROGRAM  
**Status:** ACTIVE — IMPLEMENTATION IN PROGRESS  
**Concern:** gemini provider, key and generation governance  
**Owner:** BrainModelGateway + provider layer + Creator Operations  
**Registry ID:** DOC-PLAN-P1-GEMINIGOVERNANCE  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-OPERATIONS
**Status:** IMPLEMENTATION IN PROGRESS | **Owner:** BrainModelGateway + provider layer + Creator Operations
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

| Phase | Status | Verified implementation / remaining gate |
| --- | --- | --- |
| 0 — exhaustive inventory | **PARTIAL — AUTOMATED AUDIT WIRED** | Added the exact-commit `audit:ai-generation-callers` report and `test:ai-generation-callers` to release-gates CI, with a downloadable artifact. The latest run has not completed yet; manually classify its exact-head output before claiming exhaustive coverage. |
| 1 — provider/model governance | **IMPLEMENTED — LIVE UNVERIFIED** | Canonical registry, aliases, capability resolver, generation profiles, served-model tracking and bounded fallback are preserved from merged work. Live availability by key/project/API version, lifecycle review of compatibility candidates and verified pricing remain open. |
| 2 — key validation | **IMPLEMENTED — RUNTIME PENDING** | Model-list validation remains separate from generation. Failure classification now distinguishes rejected credentials, permission denial, rate limiting, provider outage and generic verification failure. Invalid credentials are rejected; degraded discovery saves the key with an actionable message. Classifier and provider-mocked runtime tests are authored for valid, invalid, permission-denied, rate-limited and unavailable responses; real-key checks remain pending. |
| 3 — gateway/operation migration | **IN PROGRESS — THREE CALLERS MIGRATED** | Brain reflection uses `BrainModelGateway`; collaboration research uses the same gateway with Google Search grounding forwarded through the provider adapter; the dashboard pinned-comment widget now uses the governed `creatorAssets` / `AssetGenerator` path. Direct-provider UI guard now expects zero UI violations. Exact-head caller audit may identify additional legacy generation exports and callers. |
| 4 — operation provenance | **PARTIAL — RECEIPT PROPAGATION ADDED** | Governed asset records already capture trace, prompt family/version, schema version, requested/served model, evidence and repair count. `recordToolReceipt` now carries the prompt receipt into ContentBuild output events and the OperationRecord metadata projection; ConceptSceneStudio supplies it. Legacy `VideoPublisher` generation still records a legacy provider path without a governed prompt receipt; retry/idempotency and downstream asset-ingestion parity need further closure. |
| 5 — runtime certification | **NOT CERTIFIED** | CI is being used for static/unit/build verification. No live Gemini key was available or used for this work. Valid/invalid-key, unsupported-model, permission, quota, outage, reasoning and generation success/failure matrix remains an external runtime gate. |
| 6 — remove direct paths | **BLOCKED — DO NOT RETIRE YET** | The UI direct-provider guard is now zero-tolerance. Keep `gemini.ts` as the provider owner and `GeminiKeyContext` as credential validation. Do not remove compatibility candidates or remaining legacy paths until exact-head inventory, approved-boundary migration, runtime parity and zero-caller evidence are all complete. |

### CI findings and scope boundaries

The first observed release-gates run (#5408, before the latest receipt typing fix) exposed existing repository-wide blockers before the Gemini caller audit could run:

- `audit:confirmed-catalog` fails the Studio split text input shell/rails assertion. This is outside P1-02 and is not changed by this branch.
- Repository-wide `typecheck` reports unrelated existing BrainRetryContinuity / OpportunityEvidenceAdapter test types, Studio export/token/accordion types, AIBrainCommandInterface test exports, and a missing `@testing-library/react` type/module. It also caught one nullable idempotency typing issue introduced here; that specific issue was corrected in the subsequent branch commit.
- `test:focused` reports an unrelated `PublishTransaction.test.ts` failure (`getPublishTransaction is not defined`; 309 passed, 1 failed).
- `brain-quality-loop` and `conversation-handoff-contract` passed in that run. Local smoke completed successfully before the run was cancelled by a newer PR synchronization. Full-suite status was cancelled, not passed.

To avoid the Studio gate masking Gemini evidence, a dedicated `gemini-governance` CI job now checks out the exact PR head, runs the caller audit and focused Gemini/key/provenance/architecture tests, and uploads the inventory artifact. Its latest exact-head result is still pending; no pass is claimed yet.

### Current branch implementation slice

Branch: `feat/p1-gemini-governance-reconciliation-2026-10-29`

- Added a regression contract requiring Brain reflection to use `defaultBrainModelGateway.generateJsonObject`.
- Migrated `reflectAndCompress` in `src/services/brain/Core.ts` to the existing gateway. Gemini remains dynamically loaded by the gateway adapter; Brain Core no longer dynamically imports the provider service or invokes `models.generateContent`.
- Removed `src/services/brain/Core.ts` from the direct-provider architecture guard allowlist.
- Focused tests have been authored but have **not** been executed in this editing environment. CI must verify the exact branch head before this slice is considered complete.

### Next required work

1. Download and inspect the exact-head `gemini-caller-inventory` artifact; classify every referenced export and every direct SDK call as provider owner, credential validation, governed adapter, active legacy caller, test, or unreachable code.
2. Migrate any additional active creator-facing legacy callers through the existing Brain gateway or the appropriate Creator Operations / AssetGenerator specialist boundary. Do not route specialist creator assets through generic Brain JSON calls.
3. Migrate the legacy Video Publisher SEO-generation flow to governed title/description/tag strategies and pass its prompt receipt through ToolReceipt; preserve existing ContentBuild scope and stage guards.
4. Complete Phase 4 parity for retry attempts, idempotency, generation records, output assets, ContentBuild events and downstream ingestion; never fabricate missing model/prompt metadata.
5. Run the controlled live-provider matrix with an authorized test key and supported models; record provider/API version, model requested/served, operation ID, status, usage where returned and sanitized error class.
6. Retire the compatibility fallback map and direct provider paths only after exact zero-caller proof, capability parity and live certification.
