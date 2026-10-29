# Gemini Model and Call-Site Inventory

**Status:** Reconciled source inventory; repository-wide scan remains incomplete because indexed search results can point to stale commits  
**Audit date:** 2026-10-28  
**Target branch:** `master/consolidated-feature-integration`

This file tracks duplicate Gemini policy sources before consolidation. Do not treat the list of hotspots as proof that no other provider call sites exist.

## Inventory

| Concern | File | Current behavior | Planned owner after consolidation |
| --- | --- | --- | --- |
| UI model options | `src/config/aiConfig.ts` | Compatibility projection of `GEMINI_MODEL_REGISTRY`; default remains `gemini-3.1-flash-lite`. | Canonical registry exports |
| Capability routing | `src/services/brain/modelRouting.ts` | Compatibility facade over `resolveGeminiModel`; modality-required substitutions are explicit and known-compatible user model choices are honored. | Canonical resolver; preserve substitution reporting |
| Client/provider calls | `src/services/gemini.ts` | Owns SDK construction, key resolution, request/metering boundary, registry-based canonicalization and active-model resolution; legacy compatibility map/fallback sequence remains. | Canonical provider facade; fallback map needs capability-aware retirement |
| Key validation | `src/context/GeminiKeyContext.tsx` | Dynamically imports the SDK, consumes `models.list()` and saves through the shared key vault. It does not require one guessed generation model to succeed; invalid-key errors are rejected while catalog/permission/transient failures are reported as saved-but-unverified. | Credential adapter; availability diagnostics remain separate from key persistence |
| Metering | `src/services/billingEntitlement.ts` | Reads model rates from the canonical registry and treats models without a registered rate as unknown instead of applying a blanket Flash rate. Existing rates are legacy estimates and explicitly unverified. | Registry-linked pricing metadata; verified pricing still requires provider pricing review |
| Provider architecture guard | `src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts` | Scans direct provider calls with an exception allowlist | Guard all consumers to canonical facade, exceptions reviewed |
| Custom-key tests | `src/services/__tests__/geminiCustomKeyAccess.test.ts` | Tests custom-key access using a mocked SDK | Keep and extend as facade integration coverage |
| Brain core consumer | `src/services/brain/Core.ts` | Direct `models.generateContent` through shared client | Migrate to canonical facade |
| Collaboration consumer | `src/services/CollabEngine.ts` | Direct `models.generateContent` through shared client | Migrate to canonical facade |
| Comment operator consumer | `src/views/dashboard/widgets/VideoCommentOperatorWidget.tsx` | Direct `models.generateContent` through shared client | Migrate to canonical facade |
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
