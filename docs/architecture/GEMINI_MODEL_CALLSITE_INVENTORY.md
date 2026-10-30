# Gemini Model and Call-Site Inventory

**Status:** Reconciled source inventory; exact-commit v2 report generated; manual classification in progress  
**Audit date:** 2026-10-30  
**Baseline:** `master/consolidated-feature-integration` · **Implementation branch:** `feat/p1-gemini-governance-reconciliation-2026-10-29`

This file tracks duplicate Gemini policy sources before consolidation. Do not treat the list of hotspots as proof that no other provider call sites exist.

## Inventory

| Concern | File | Current behavior | Planned owner after consolidation |
| --- | --- | --- | --- |
| UI model options | `src/config/aiConfig.ts` | Compatibility projection of `GEMINI_MODEL_REGISTRY`; default remains `gemini-3.1-flash-lite`. | Canonical registry exports |
| Capability routing | `src/services/brain/modelRouting.ts` | Compatibility facade over `resolveGeminiModel`; modality-required substitutions are explicit and known-compatible user model choices are honored. | Canonical resolver; preserve substitution reporting |
| Client/provider calls | `src/services/gemini.ts` | Owns SDK construction, key resolution, request/metering boundary, registry-based canonicalization and active-model resolution; legacy compatibility map/fallback sequence remains. | Canonical provider facade; fallback map needs capability-aware retirement |
| Key validation | `src/context/GeminiKeyContext.tsx` | Dynamically imports the SDK, consumes `models.list()` and saves through the shared key vault. It does not require one guessed generation model to succeed; invalid-key errors are rejected while catalog/permission/transient failures are reported as saved-but-unverified. | Credential adapter; availability diagnostics remain separate from key persistence |
| Metering | `src/services/billingEntitlement.ts` | Reads model rates from the canonical registry and treats models without a registered rate as unknown instead of applying a blanket Flash rate. Existing rates are legacy estimates and explicitly unverified. | Registry-linked pricing metadata; verified pricing still requires provider pricing review |
| Provider architecture guard | `src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts` | Explicit provider-owner/credential-validation allowlist only; Brain Core, CollabEngine and VideoCommentOperatorWidget no longer appear as direct-provider exceptions. UI guard expects zero direct provider calls. | Keep provider SDK construction in provider owner and credential validation only |
| Custom-key tests | `src/services/__tests__/geminiCustomKeyAccess.test.ts` | Tests custom-key access using a mocked SDK | Keep and extend as facade integration coverage |
| Brain core consumer | `src/services/brain/Core.ts` | **Migrated on the current reconciliation branch** to `defaultBrainModelGateway.generateJsonObject`; Gemini is dynamically loaded by the gateway adapter. | Keep Brain Core provider-neutral; protect with `CoreGateway.contract.test.ts` |
| Collaboration consumer | `src/services/CollabEngine.ts` | **Migrated on reconciliation branch** to `defaultBrainModelGateway.generateJsonObject`; Google Search grounding is passed through the gateway/provider adapter; invalid/empty peer results fail closed rather than returning mock creators. | Keep search grounding and schema validation covered by gateway tests |
| Comment operator consumer | `src/views/dashboard/widgets/VideoCommentOperatorWidget.tsx` | **Migrated on reconciliation branch** to `generatePinnedCommentDraft` in the governed `creatorAssets` / `AssetGenerator` path. The strategy records prompt/model receipt, trace, operation/workflow identity, grounding and review findings. | Preserve creator review before posting; no generation call in the widget |
| Video Publisher SEO | `src/views/VideoPublisher.tsx` | **Migrated on the reconciliation branch** to `generateVideoPublisherSeoPackage` through a dedicated `videoPublisherSeoStrategy` and the existing AssetGenerator / Gemini asset runner. Preserves the complete `SeoResult` shape, six title candidates, descriptions, tags, category, pinned comments, community posts, Shorts script, education moments and social copy. Prompt receipt and trace are passed into ToolReceipt. The strategy explicitly forwards Google Search grounding. Exact-head CI for the newest migration is pending. | Keep the strategy specialist-owned; add ingestion/retry parity coverage and migrate the other `generateSeoData` callers separately |
| SDK dependency | `package.json` + `package-lock.json` | Declared range `^1.46.0`; lockfile resolves exactly `1.46.0` | Dependency policy + lockfile evidence |

## Drift to resolve

1. Default model differs between the UI registry and runtime preference fallback.
2. Capability routing can override user preference while runtime alias/fallback logic can perform additional substitutions.
3. Legacy model IDs remain in compatibility candidates without a recorded lifecycle/verification date.
4. Validation's model selection is independent from runtime resolution.
5. Metering has its own model list and an implicit default rate for unknown models.
6. Browser key storage and frontend env fallback make the production credential boundary unclear.
7. The repository has an architecture guard; migrations must update its allowlist intentionally and keep the guard effective.

## Required exhaustive scan

Run on a clean checkout of the exact base commit before implementation. These are suggested commands; adjust glob exclusions to the repository's current tooling.

```sh
rg -n --hidden --glob '!node_modules/**' --glob '!dist/**' \
  'new GoogleGenAI|@google/genai|models\.generateContent(Stream)?|models\.embedContent|gemini-[0-9]' .
rg -n --hidden --glob '!node_modules/**' --glob '!dist/**' \
  'VITE_(GEMINI|GOOGLE)_API_KEY|vt_gemini_api_key|vt_ai_model|gemini_api_key|google_api_key|yt_api_key' .
rg -n --hidden --glob '!node_modules/**' --glob '!dist/**' \
  'GEMINI_MODEL_RATES|costMultiplier|estimateMeterQuote|applyMeterChargeEvent|getActiveModel|resolveModelForCapability' src server api scripts
```

For every hit, classify as:
- production runtime;
- tests/mocks;
- build/dev tooling;
- documentation/reference;
- quarantined/legacy;
- intentional direct-provider exception.

Record path, exported entry point, capability, key source, model source, settings source, retry/fallback behavior, metering path, and test coverage. Do not migrate quarantined/reference files as active runtime code without proving they are reachable.

## Phase 1 design decisions

- SDK package and API version are separate policies.
- Lockfile, not semver range text alone, determines the resolved SDK version in a reproducible build.
- Static registry metadata must not be mistaken for per-key availability.
- Capability routing and user preference should produce one explicit resolution with a visible substitution reason.
- Pricing must use the actual served model; unknown rates must be explicit rather than silently mapped to another model.
- Validation must use the same resolver and operation requirements as generation.
- Fallbacks must be bounded, capability-compatible, and forbidden for authentication/authorization/quota errors.
- Production secrets belong in server-managed secret storage. Browser BYOK must be an explicit product/security decision.
- Keep telemetry privacy-safe and avoid logging keys, raw provider payloads, or prompts by default.

## Evidence status

Verified by reading the current target-branch source and lockfile:
- the six source files listed in the inventory;
- the declared `@google/genai` package range in `package.json` and lockfile-resolved version `1.46.0`;
- the presence of a provider architecture guard and custom-key access tests.

Not yet verified:
- exhaustive target-SHA repository-wide call-site/model ID list;
- the API version actually used by all runtime entry points;
- live availability of listed model IDs;
- real-key generation success;
- local typecheck/test/build results;
- current production Render behavior.

Do not mark these items complete until they have supporting output.


## Reconciliation snapshot — 2026-10-28

The governance implementation branch is based on the current target branch, not the older feature branch ancestry. The prior feature branch diverged from the target (10 commits ahead / 25 behind at reconciliation), so only the relevant registry, UI projection, routing facade, metering changes, and tests were ported. The prior branch's credential-validation version was intentionally not copied because the target already contains the later shared-key-vault implementation.

### Runtime changes staged on the reconciliation branch

- `src/services/geminiModelGovernance.ts` owns the static model metadata, aliases, capability routing, failure classification, and typed generation-profile resolver.
- `src/config/aiConfig.ts` derives selector options from the registry instead of maintaining another model list.
- `src/services/brain/modelRouting.ts` is a compatibility facade over the shared resolver.
- `src/services/gemini.ts` uses the registry to canonicalize provider model IDs and routes `getActiveModel` through the resolver. Existing provider fallback candidates remain for compatibility and still require a separate, capability-aware cleanup.
- `src/services/billingEntitlement.ts` obtains rates from registry metadata and does not silently price an unregistered model as Flash. Registry pricing remains explicitly unverified.
- `src/components/ui/AIModelSelector.tsx` shows the model actually resolved for text capability and explains a substitution when one occurs.
- `src/services/__tests__/geminiModelGovernance.test.ts` covers alias normalization, preference/capability resolution, unknown models, failure fallback policy, generation-setting precedence, and invalid setting rejection.

### Phase status and evidence boundary

- **Phase 0 — inventory:** key active hotspots and known direct-call consumers are listed. A complete repository-wide inventory is **not yet proven**; GitHub indexed search has returned an older commit, so its results are discovery hints, not target-SHA evidence. A clean checkout/search at the exact PR base and classification of every hit are still required.
- **Phase 1 — policy:** SDK package, API version, model ID, lifecycle, capability, availability, pricing, and credential boundary are documented as separate concepts. The package lock currently resolves `@google/genai` to `1.46.0`; this is not proof of live API compatibility.
- **Phase 2 — registry/resolver:** UI catalog, Brain routing, and provider active-model selection now use the shared registry/resolver. The provider compatibility fallback map is still a separate legacy policy surface and must be removed only after capability-aware integration tests cover existing consumers.
- **Phase 3 — profiles/diagnostics:** typed generation settings resolve in platform → capability → user → task order and validate ranges/capability compatibility. The model selector exposes the resolved text model and substitution reason. Existing provider call sites still supply their own operation-specific `config` values; migrating every one to the profile API is not claimed complete until call-site inventory and regression coverage are run.

### Required final verification

Run on a clean checkout of the exact PR head/base:
```sh
npm ci
npx vitest run src/services/__tests__/geminiModelGovernance.test.ts src/context/GeminiKeyContext.test.ts src/services/__tests__/geminiCustomKeyAccess.test.ts
npx tsc --noEmit
npm run build
```
Also run the repository's provider architecture guard and full test suite. No test, typecheck, build, real-key probe, or production deployment result is claimed by this source-edit pass.


## Phase 4 provider boundary update — 2026-10-29

The shared `getAiClient()` wrapper is now the point where request capability, effective generation profile, provider fallback, and served-model attribution converge.

- Both `generateContent` and `generateContentStream` pass through the same bounded fallback executor.
- Capability inference recognizes explicit thinking config and image/video/audio MIME markers; text is the conservative default.
- The capability resolver runs before entitlement preflight so the preflight quote uses the selected capability-compatible model.
- The response's actual served model is tracked even when the SDK omits `modelVersion`, then used for post-response metering.
- Only generation-profile keys are extracted from task config; provider tools, response schema, system instruction, and other SDK options are preserved as task configuration.
- Fallback telemetry contains model IDs, operation, reason, attempt, and timestamp only. It does not include prompts, API keys, account identifiers, or raw provider errors.

Phase 4 does not claim every caller explicitly annotates capability. Requests with nonstandard media payload structures remain a migration target for an explicit capability parameter. The legacy candidate map is retained until live compatibility and modality-preserving candidate evidence is available.


## 2026-10-29 reconciliation update

- PR #1131, #1134, #1168, #1174, #1176 and #1178 are merged and form the preserved baseline.
- `src/services/brain/Core.ts` is migrated on `feat/p1-gemini-governance-reconciliation-2026-10-29` to the existing provider-neutral BrainModelGateway. This is one caller migration, not proof that all creator generation is governed.
- Remaining explicit direct-call migration targets include `src/services/CollabEngine.ts` and `src/views/dashboard/widgets/VideoCommentOperatorWidget.tsx`. The widget must migrate through its approved Creator Operations boundary rather than bypassing specialist operation policy.
- The exhaustive exact-head scan, operation/prompt provenance certification, live-key runtime matrix, and zero-caller proof remain open. No test, typecheck, build, or live-provider result is claimed by this source-edit pass.


## Reconciliation — 2026-10-30

### Caller migrations on the reconciliation branch

- `src/services/brain/Core.ts`: reflection moved to the existing provider-neutral BrainModelGateway.
- `src/services/CollabEngine.ts`: peer research moved to the BrainModelGateway; Google Search grounding is retained as a typed gateway input and forwarded by the Gemini adapter. Empty/invalid results fail rather than fabricating a mock creator.
- `src/views/dashboard/widgets/VideoCommentOperatorWidget.tsx`: direct SDK use removed. Pinned comment drafting now calls `generatePinnedCommentDraft`, which uses the existing `creatorAssets` / `AssetGenerator` specialist path, an explicit `comment_reply` strategy, channel/video context, prompt version, trace and model receipt. Posting remains a separate user-triggered action.

### Credential validation

`src/context/geminiKeyValidation.ts` now classifies invalid credentials, permission denial, rate limiting, provider outage and generic verification failure separately. The key context preserves the existing rule: only explicit credential rejection prevents saving; degraded model discovery does not block BYOK entry. Diagnostics contain sanitized classifications, never the key or raw error text.
- `src/context/GeminiKeyContext.runtime.test.tsx` exercises successful model discovery, explicit invalid-key rejection, and saved-but-unverified permission/rate-limit/provider-outage cases against a mocked SDK; this is application runtime coverage, not live Google API certification.

### Provenance propagation

- Governed AssetGenerator records include operation/workflow IDs, trace ID, prompt family/version, schema version, evidence refs, repair count and requested/served model.
- `recordToolReceipt` accepts and carries the prompt receipt into ContentBuild output event metadata.
- `operationRecordFromToolReceipt` retains the prompt receipt in its metadata projection.
- ConceptSceneStudio now passes the generated asset's prompt receipt into its ToolReceipt.
- Legacy VideoPublisher SEO generation is still an identified gap; its current `providerPath: "legacy-generateSeoData"` receipt does not include a governed prompt/model receipt.

### CI evidence

Run #5408 (before the latest nullable receipt typing correction) was not a Gemini certification run: the source-governance job stopped at the unrelated Studio split-text-input catalog assertion, and therefore did not produce the caller artifact. Repository-wide typecheck also reported multiple unrelated Brain/Studio/test typing failures plus one GenerationWorkflow nullable-idempotency error from this branch; the branch-specific error was corrected afterward. The focused-contracts job reported an unrelated `PublishTransaction.test.ts` undefined `getPublishTransaction` failure (309 passed, 1 failed). Brain quality loop and conversation handoff jobs passed; full suite was cancelled.

A separate `gemini-governance` job now runs the exact PR head independently of those unrelated jobs. It runs the expanded static audit (named/namespace export references, direct SDK construction and generation/streaming/embedding calls, literal dynamic Gemini imports, model-ID literals, credential aliases, provider allowlist and pricing/metering/fallback source files), focused key/gateway/creator-asset/provenance/architecture tests, and uploads the JSON inventory. The latest run has not yet completed; do not treat the artifact or tests as passed until the job reports success.


The release-gates workflow now runs `test:ai-generation-callers`, generates `audit:ai-generation-callers` from the checked-out commit, and uploads the JSON inventory as an artifact. This is an exact-commit static scan of exports from `src/services/gemini.ts`; it is not by itself proof of runtime reachability or a complete scan of every direct SDK invocation. Review the artifact and architecture guard together before declaring Phase 0 complete.

### Remaining evidence boundary

No real Gemini API key was used. No live provider availability, quota, unsupported-model, outage, or successful generation result is claimed. Legacy provider compatibility candidates remain until live capability parity and zero-caller proof are recorded.

## Exact-head automated caller inventory — run #5435

The generated `gemini-caller-inventory` artifact reports:

- 73 exported symbols in `src/services/gemini.ts`.
- 43 exports with production import-and-reference matches; these include non-generation helpers such as configuration, key checks and model selection, so this count is not 43 independent model operations.
- 29 exports with no static import reference; do not delete them without dynamic/re-export/reachability review.
- 66 direct SDK invocation sites, concentrated in `src/services/gemini.ts` plus the explicit SDK model-list validation in `GeminiKeyContext`.
- Four literal dynamic Gemini imports: two expected gateway adapter imports and two remaining UI imports (`AskMeWidget` / `TitleRewriterWidget`).
- 20 model-ID literals and 18 credential-alias references requiring classification.

Active production callers identified by the artifact include ActionableTactics, Channelytics, ResearchLab, Projects, VideoManager, MediaAnalyzer, AlgorithmArchitect, IntelligenceHub, DailyAdviceWidget, dashboard VideoManager/VideoUploader/AIJournal/CollabMatchmaker widgets, EndScreenTool, PreLaunchPriming, HookGenerator, creator-engagement comment response, script architect, project/studio storyboard flows, tag/thumbnail tools, VideoAutopsy and several provider-level Brain orchestration paths. The full per-export path/line list is retained in the workflow artifact rather than duplicated here.

The artifact is from commit `9bd68ab8a657144f80abc71b6384e4ee7c60e1b7`, before the latest VideoPublisher migration. Regenerate it on the current PR head before using it as zero-caller evidence. The static scan remains a reachability lead, not a runtime proof.
