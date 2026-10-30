# P1-02 Gemini Provider, Key and Generation Governance

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-30  
**Class:** PROGRAM  
**Status:** ACTIVE — GOVERNED CALLER MIGRATION IN PROGRESS  
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
| 0 — exhaustive inventory | **AUTOMATED EXACT-HEAD INVENTORY GENERATED; CLASSIFICATION PARTIAL** | Run #5435 generated and uploaded the exact-commit v2 inventory. It reports 73 exports, 43 production-referenced exports, 29 exports with no static import reference, 66 direct-provider invocation sites, four literal dynamic Gemini imports, 20 model-ID literals and 18 credential-alias references. Manual classification identified the direct SDK calls as concentrated in the provider owner (`gemini.ts`) and key-validation boundary (`GeminiKeyContext`); dynamic imports still include two legacy UI consumers (`AskMeWidget` and `TitleRewriterWidget`). The artifact predates the latest VideoPublisher migration, so a fresh exact-head artifact is still required. Static scan limitations remain documented. |
| 1 — provider/model governance | **IMPLEMENTED — LIVE UNVERIFIED** | Canonical registry, aliases, capability resolver, generation profiles, served-model tracking and bounded fallback are preserved from merged work. Live availability by key/project/API version, lifecycle review of compatibility candidates and verified pricing remain open. |
| 2 — key validation | **IMPLEMENTED — RUNTIME PENDING** | Model-list validation remains separate from generation. Failure classification now distinguishes rejected credentials, permission denial, rate limiting, provider outage and generic verification failure. Invalid credentials are rejected; degraded discovery saves the key with an actionable message. Classifier and provider-mocked runtime tests are authored for valid, invalid, permission-denied, rate-limited and unavailable responses; real-key checks remain pending. |
| 3 — gateway/operation migration | **IN PROGRESS — FIVE MIGRATION SLICES, MORE CALLERS REMAIN** | Brain reflection and CollabEngine use BrainModelGateway; pinned-comment drafting uses `creatorAssets` / `AssetGenerator`; VideoPublisher SEO now uses a dedicated full-package AssetGenerator strategy and persists its prompt receipt through ToolReceipt. Specialist strategies can now declare provider tools, preserving Google Search grounding for VideoPublisher SEO. The exact-head inventory still shows other active legacy callers, including SeoGenerator, MetadataMaster, VideoUploader, AskMeWidget, TitleRewriterWidget and creator/analytics tools. Do not call this phase complete until every production caller is classified and migrated to its approved boundary. |
| 4 — operation provenance | **PARTIAL — RECEIPT PROPAGATION AND RETRY DEDUPLICATION IMPLEMENTED; END-TO-END PARITY OPEN** | Governed asset records capture trace, prompt family/version, schema version, requested/served model, evidence and repair count. ToolReceipt carries the prompt receipt into ContentBuild output events and OperationRecord metadata; ConceptSceneStudio and VideoPublisher now supply it. Receipt completion deduplicates repeated completions by scoped idempotency key. The event reader import defect found in run #5435 was corrected and the focused Gemini job passed on run #5437. Downstream ingestion, generation-record identity and retry/usage/cost parity across all legacy flows remain open. |
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

## Follow-on implementation — 2026-10-30

- Corrected the collaboration-provider rejection test to use an explicit rejected-promise implementation. The previous `mockRejectedValue` setup threw while configuring the mock under the current Vitest runner, before the rejection assertion could execute.
- Changed the exact-head Gemini inventory artifact upload to run under `if: always()`, so a focused-test failure no longer discards the audit evidence.
- Added idempotent ToolReceipt completion: a repeated output event with the same ContentBuild, tool and idempotency key returns the original canonical receipt instead of appending a duplicate output event. Added a retry regression test.
- Run #5434 is queued for the updated exact head. Do not mark these changes verified until its focused Gemini job and artifact are inspected.
- Phase 3 remains open: Video Publisher still calls the legacy `generateSeoData` path. Phase 4 remains open until the SEO migration and downstream asset-ingestion parity are verified. Phase 5 remains a live-key gate and cannot be certified from mocked tests.

- Run #5435 produced the first reviewable v2 exact-head inventory artifact. Manual classification of its summary found 43 production-referenced exports (not all are generators), 29 exports with no static import reference, 66 provider invocation sites concentrated in `gemini.ts` and the key-validation boundary, and four literal dynamic imports. The dynamic UI consumers `AskMeWidget` and `TitleRewriterWidget` remain migration targets. The artifact predates the VideoPublisher migration and must be regenerated against the current head.
- Fixed the `listContentBuildEvents` import to come from `ContentBuildRepository`, not `ToolContext`. Run #5435 had failed three GenerationWorkflow tests with `listContentBuildEvents is not a function`; the focused Gemini job then passed on run #5437 at commit `03c02f39f2e1c280da4bc79de96e9b15768c3ace`.
- Migrated `VideoPublisher` SEO generation from `generateSeoData` to a dedicated `videoPublisherSeoStrategy` through `generateVideoPublisherSeoPackage` and the existing `AssetGenerator` / `geminiAssetModelRunner`. The strategy retains the full legacy SEO result shape, validates candidate uniqueness and required metadata, and passes the generated prompt receipt and trace into ToolReceipt.
- Added specialist-level provider tool forwarding through AssetGenerator, the asset runner and `generateSchemaJsonObject`; VideoPublisher SEO explicitly retains Google Search grounding via `googleSearch`.
- Added strategy contract tests and provider-tool forwarding tests, and included them in the Gemini governance CI command. These newest changes were committed after run #5437 and have not yet received exact-head CI evidence.
- Run #5437: dedicated Gemini governance passed, production build passed, local smoke passed, Brain quality loop passed, and conversation handoff contract passed. Focused-contracts still fails at the unrelated `PublishTransaction.test.ts` missing `getPublishTransaction`; source governance fails at the unrelated confirmed Studio catalog assertion; repository typecheck remains red on unrelated Brain/Studio/test errors. Full-suite status was still in progress at the last observation.
- Phase 5 remains an external live-key gate: no authorized live Gemini credential was available in this work session. Phase 6 remains blocked because other production callers and compatibility paths remain. Do not claim all phases complete or retire compatibility paths.

## Follow-up PR and latest verification — 2026-10-30

- PR #1179 merged at `03c02f39f2e1c280da4bc79de96e9b15768d6cc`. Changes committed to its feature branch after that merge are isolated in draft PR #1182 against the updated `master/consolidated-feature-integration` target.
- PR #1182 contains the VideoPublisher SEO migration, full-output specialist strategy, Google Search tool forwarding, public-handle BYOK identity fallback, retry event-reader correction, tests and refreshed governance documentation.
- Run #5439 at commit `64d0908869c4b46205916b484584b2fdf3cbc776` built successfully, but the Gemini governance job failed one new strategy test because the expected findings omitted the intentional `title_candidate_count` rubric finding. The test expectation was corrected in commit `f8407e1433ce731d04b3308216d00e2edb97e99d`.
- Run #5441 was triggered for that corrected head; it was still pending with no jobs returned at the last poll. The latest public-handle identity adjustment in commit `d067530510d58efce16450dde0690cccbab6cb2f` is after run #5439 and is not covered by that run; exact-head CI must be checked again after the corrected run.
- Run #5439 also showed production build success, Brain quality loop success and conversation-handoff success. Source governance failed at the unrelated Studio confirmed-catalog audit. Repository-wide typecheck still reports existing Brain/Studio/test typing failures; no Gemini-specific type error was present in the emitted error list. Focused/full-suite and smoke jobs were not all complete at the time of review.
- PR #1182 remains draft and unmerged. No live Gemini key was used. Phases 3, 4, 5 and 6 remain partial/blocked as described above; no compatibility path has been retired.

## Additional caller-migration pass — 2026-10-30

- Migrated `SeoGenerator`, `MetadataMaster`, and `VideoUploaderWidget` off `generateSeoData` onto the existing `generateVideoPublisherSeoPackage` specialist strategy. `MetadataMaster` reuses one operation ID for its prompt receipt and metadata provenance record; the Video Uploader now requires the connected channel identity instead of generating under an invented identity.
- Migrated `AskMeWidget` and `TitleRewriterWidget` away from literal dynamic imports of `gemini.ts` and onto the existing `defaultBrainModelGateway.generateJsonObject` contract. Ask Me now requires a non-empty structured answer; Title Rewriter validates the returned title/score objects and describes scores as subjective packaging estimates, not measured CTR.
- The exact-head run #5442 at `7c56011318b04029008cbe98c3b16f29650106a9` passed the dedicated Gemini governance job: caller audit, inventory generation/upload, and all 15 focused test files (70 tests). Production build, local smoke, Brain quality loop, and conversation handoff also passed. Repository-wide typecheck, Studio confirmed-catalog, `test:focused` (unrelated missing `getPublishTransaction`), and full suite remain failed.
- The #5442 inventory still showed `generateSeoData` references in SeoGenerator, MetadataMaster, and VideoUploaderWidget and dynamic imports in AskMeWidget / TitleRewriterWidget; those five UI call sites have since been migrated in commits after that audited SHA. The inventory must be regenerated at the current branch head before updating counts or claiming zero legacy references.
- Phase 3 is still in progress: many active exports remain in `gemini.ts`, including analytics, planning, tags, thumbnails, scripts, comments, storyboards and other creator operations. The two migrated UI callers now use BrainModelGateway; specialist asset calls use AssetGenerator. No blanket compatibility wrapper is being introduced to disguise unmigrated callers.
- Phase 4 is partial: Video Publisher and Metadata Master carry prompt receipts into ContentBuild/metadata provenance where a canonical build exists; standalone SeoGenerator and VideoUploader have AssetGenerator prompt receipts but do not yet have a verified ContentBuild ingestion/OperationRecord projection. Retry, usage/cost, GenerationRecord and downstream ingestion parity across all caller families remains open.
- The latest code commits after run #5442 have not yet received exact-head CI. Do not claim their typecheck/build/tests passed until a new run verifies them.
- Phase 5 remains blocked on an authorized live Gemini test credential and controlled provider scenarios. Do not ask the user to paste a secret into chat; use the approved key vault or CI secret path.
- Phase 6 remains blocked: retain the provider compatibility map and legacy paths until every active production caller is migrated, a fresh exact-head inventory plus runtime tracing proves zero bypasses, and live capability parity is certified.

## Follow-on reconciliation — 2026-10-30 (post-merge)

- PR #1179 was merged at `ff631ca86263448fe32c5cab3c5900c6c726ccfb`. Its final implementation includes the governed Video Publisher SEO package migration; the older inventory artifact was generated before that migration and must not be used to claim that Video Publisher remains legacy.
- Reviewed run #5435's exact-head inventory. It reports 73 exports / 43 production-referenced exports / 29 with no static import reference / 66 direct SDK call matches / 4 literal dynamic imports / 20 model ID literals / 18 credential alias references. The 66 SDK invocation matches are 65 calls inside `src/services/gemini.ts` plus one SDK constructor in GeminiKeyContext key validation. This is consistent with a provider-owner boundary plus credential-validation boundary, not 66 UI-level direct callers.
- Dynamic Gemini imports: BrainModelGateway's two adapter imports are the canonical provider boundary; AskMeWidget and TitleRewriterWidget remain application-level dynamic imports and need migration or a documented approved boundary.
- The 43 production-referenced exports span multiple modalities and concerns. They must be triaged individually: structured reasoning/JSON, specialist content assets, image/video generation, speech, transcript/media analysis, model status and key-state checks. Do not funnel image/video/speech through the JSON gateway or delete exports just because 29 currently have no static import reference.
- Run #5435's Gemini governance job failed because the branch imported `listContentBuildEvents` from ToolContext, where it is private. The correction imports it from `ContentBuildRepository` and performs idempotency lookup before revision/lifecycle checks, so a retry after the first output event advances the build revision returns the original receipt.
- The merged PR's other failures remain separate: Studio catalog/source-governance assertions, repository-wide Brain/Studio/test type errors, focused PublishTransaction test missing `getPublishTransaction`, and the full suite. Local smoke, Brain quality loop and conversation handoff contract passed in #5435.
- Phase 5 cannot be certified without an authorized live Gemini credential. No credential was available in this session; do not claim live key, quota, permission, unsupported-model, outage or generation certification.
- Phase 6 remains blocked until all active production callers are migrated/classified, a fresh exact-head audit proves zero bypasses, and live capability parity is demonstrated.

## Additional caller-migration pass — 2026-10-30

- Migrated `SeoGenerator`, `MetadataMaster`, and `VideoUploaderWidget` off `generateSeoData` onto the existing `generateVideoPublisherSeoPackage` specialist strategy. `MetadataMaster` reuses one operation ID for its prompt receipt and metadata provenance record; the Video Uploader now requires the connected channel identity instead of generating under an invented identity.
- Migrated `AskMeWidget` and `TitleRewriterWidget` away from literal dynamic imports of `gemini.ts` and onto the existing `defaultBrainModelGateway.generateJsonObject` contract. Ask Me now requires a non-empty structured answer; Title Rewriter validates the returned title/score objects and describes scores as subjective packaging estimates, not measured CTR.
- The exact-head run #5442 at `7c56011318b04029008cbe98c3b16f29650106a9` passed the dedicated Gemini governance job: caller audit, inventory generation/upload, and all 15 focused test files (70 tests). Production build, local smoke, Brain quality loop, and conversation handoff also passed. Repository-wide typecheck, Studio confirmed-catalog, `test:focused` (unrelated missing `getPublishTransaction`), and full suite remain failed.
- The #5442 inventory still showed `generateSeoData` references in SeoGenerator, MetadataMaster, and VideoUploaderWidget and dynamic imports in AskMeWidget / TitleRewriterWidget; those five UI call sites have since been migrated in commits after that audited SHA. The inventory must be regenerated at the current branch head before updating counts or claiming zero legacy references.
- Phase 3 is still in progress: many active exports remain in `gemini.ts`, including analytics, planning, tags, thumbnails, scripts, comments, storyboards and other creator operations. The two migrated UI callers now use BrainModelGateway; specialist asset calls use AssetGenerator. No blanket compatibility wrapper is being introduced to disguise unmigrated callers.
- Phase 4 is partial: Video Publisher and Metadata Master carry prompt receipts into ContentBuild/metadata provenance where a canonical build exists; standalone SeoGenerator and VideoUploader have AssetGenerator prompt receipts but do not yet have a verified ContentBuild ingestion/OperationRecord projection. Retry, usage/cost, GenerationRecord and downstream ingestion parity across all caller families remains open.
- The latest code commits after run #5442 have not yet received exact-head CI. Do not claim their typecheck/build/tests passed until a new run verifies them.
- Phase 5 remains blocked on an authorized live Gemini test credential and controlled provider scenarios. Do not ask the user to paste a secret into chat; use the approved key vault or CI secret path.
- Phase 6 remains blocked: retain the provider compatibility map and legacy paths until every active production caller is migrated, a fresh exact-head inventory plus runtime tracing proves zero bypasses, and live capability parity is certified.

## Exact-head inventory refresh — run #5469

- Exact-head v2 audit at `dc36b8961084b303ec8ce9e3c6ea16fd1db423bd`: 73 exports, 42 production-referenced exports, 30 with no static import reference, 66 direct SDK invocation sites, 2 literal dynamic Gemini imports, 19 model-ID literals and 18 credential-alias references.
- The only two dynamic imports are the approved provider-adapter imports inside `BrainModelGateway`; AskMeWidget and TitleRewriterWidget no longer import `gemini.ts` dynamically.
- The 42 production references include helpers, not 42 independent model operations. Active remaining groups include analytics/research, project planning, tags, thumbnails, scripts, storyboards, comments, end-screen, journal/community and media analysis.
- Run #5469 caller audit and inventory upload passed; production build and conversation-handoff passed. The Gemini focused suite failed three GenerationWorkflow tests because output event idempotency reused the input event key. The correction namespaces output keys separately while retaining the request key in metadata.
- Run #5470 is queued for the correction; do not claim the corrected focused suite passed until exact-head results are inspected.
- Phase 0 remains partial until every export and direct SDK hit is classified as provider owner, credential validation, governed adapter, active legacy caller, test or unreachable code.
