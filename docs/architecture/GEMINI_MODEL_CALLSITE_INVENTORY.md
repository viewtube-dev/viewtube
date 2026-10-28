# Gemini Model and Call-Site Inventory

**Status:** Initial verified inventory; not yet exhaustive  
**Audit date:** 2026-10-28  
**Target branch:** `master/consolidated-feature-integration`

This file tracks duplicate Gemini policy sources before consolidation. Do not treat the list of hotspots as proof that no other provider call sites exist.

## Inventory

| Concern | File | Current behavior | Planned owner after consolidation |
| --- | --- | --- | --- |
| UI model options | `src/config/aiConfig.ts` | Static `GEMINI_MODELS` array; `DEFAULT_MODEL_ID = gemini-3.1-flash-lite` | Canonical registry exports |
| Capability routing | `src/services/brain/modelRouting.ts` | Hardcoded model IDs by capability; returns requested/served model and substitution reason | Canonical resolver; preserve substitution reporting |
| Client/provider calls | `src/services/gemini.ts` | Direct SDK construction, local key aliases, env key fallback, canonical model list, alias inference, fallback chains, compatibility map | Canonical provider facade |
| Key validation | `src/context/GeminiKeyContext.tsx` | Lists models, chooses a generation-capable Gemini model, probes generation, persists key in localStorage | Shared registry/resolver + credential adapter |
| Metering | `src/services/billingEntitlement.ts` | Separate rate map; unknown IDs use a default Flash rate | Registry-linked pricing metadata; explicit unknown-rate handling |
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
