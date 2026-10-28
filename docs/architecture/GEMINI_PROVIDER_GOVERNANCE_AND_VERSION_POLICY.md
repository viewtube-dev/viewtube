# Gemini Provider Governance and Version Policy

**Status:** Phase 0/1 audit and design baseline  
**Target branch:** `master/consolidated-feature-integration`  
**Documentation branch:** `docs/gemini-governance-phase-0-1`  
**Scope:** Gemini provider integration, SDK/API versioning, model identity, generation configuration, key validation, routing, pricing, and operational evidence.

## Executive decision

ViewTube should have one canonical Gemini provider boundary and one model governance registry. Feature code must request a capability/profile through that boundary rather than select provider model IDs, instantiate `GoogleGenAI`, or implement fallback chains independently.

This document records verified source-level findings and defines the Phase 1 contract. It does **not** assert that the live Render deployment is fixed, that all call sites have been exhaustively migrated, or that the SDK/API's current live model catalog has been verified against a real API key.

## Phase 0 — source audit

### Confirmed hotspots on the target branch

| Area | Current source | Finding / risk |
| --- | --- | --- |
| Provider service | `src/services/gemini.ts` | Constructs `GoogleGenAI`, resolves keys from multiple browser storage aliases and frontend env values, stores a separate canonical model list, maps aliases, and has a provider compatibility/fallback chain. |
| UI model catalog | `src/config/aiConfig.ts` | Defines a second model catalog and `DEFAULT_MODEL_ID`. Header says “MAY 2026 EDITION”; lifecycle and availability claims must be re-verified before treated as current. |
| Capability routing | `src/services/brain/modelRouting.ts` | Hardcodes model IDs by capability and can substitute the saved preference. It exposes requested/served model and substitution reason, which should be preserved and adopted by the canonical resolver. |
| Key validation | `src/context/GeminiKeyContext.tsx` | Dynamically imports the SDK and lists models before selecting a validation candidate. This fixes hardcoded validation IDs but currently has its own selection algorithm instead of sharing the runtime registry/resolver. Stores the entered key in `localStorage`. |
| Metering | `src/services/billingEntitlement.ts` | Maintains a separate model-rate table and default rate fallback. This can make charges inaccurate when an unlisted model or fallback is served. |
| SDK dependency | `package.json` and `package-lock.json` | Declares `^1.46.0`; the lockfile resolves `node_modules/@google/genai` to exactly `1.46.0`. |
| Brain/provider architecture | `src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts` | Existing architecture guard and allowlist should be updated deliberately as consumers migrate, not bypassed. |
| Existing custom-key coverage | `src/services/__tests__/geminiCustomKeyAccess.test.ts` | Existing tests mock provider calls and must remain part of the regression suite. |

### Confirmed model drift examples

- The UI catalog's default is `gemini-3.1-flash-lite`.
- `src/services/gemini.ts` reads `vt_ai_model` with a different fallback, `gemini-3.1-flash`.
- Capability routing separately assigns fixed models for text, fast text, thinking, analysis, image, video, and audio.
- Provider compatibility mappings include legacy IDs such as `gemini-1.5-flash-latest` and `gemini-1.5-pro-latest`.
- Metering has its own model IDs and falls back to the `gemini-3.1-flash` rate for unknown model IDs.

These examples establish conflicting policy sources. They do not establish that each named model is currently available to every Google AI Studio key or API version.

### Phase 0 audit boundaries

GitHub file reads, code-search excerpts, and the lockfile confirmed the above hotspots, the three additional direct-call consumers listed below, and SDK version `1.46.0`. Search indexing returned some older revisions, so a complete inventory still requires a fresh repository-wide scan on the exact target SHA for:
- every direct `new GoogleGenAI(` and `models.generateContent` / streaming invocation;
- embeddings, cached content, files, Live API, image/video/audio and any provider-specific tool invocation;
- all model IDs in TypeScript, JavaScript, JSON, tests, scripts, deployment configuration and docs;
- all Gemini setting persistence keys and settings UI;
- all pricing/usage references and provider telemetry;
- all provider construction paths outside `src/services/gemini.ts`, including server-side routes and quarantined/legacy code.

Search indexes can lag behind the target branch; verify findings against the checked-out target SHA before editing. Preserve existing architecture guards and explicitly classify any exception.

### Security findings to carry forward

- `localStorage` is browser-accessible and can be read by injected JavaScript. A stored BYOK key is not a server-side secret.
- Vite `VITE_*` values are bundled into client code and must never contain a production secret.
- The long-term default should be server-managed credentials behind an authenticated provider route. If BYOK remains browser-side for a supported use case, document the exposure clearly, minimize persistence, provide explicit clear/revoke behavior, and never transmit keys to logs or telemetry.
- Do not migrate credentials or change account/billing semantics as an incidental part of the model-registry refactor.

## Phase 1 — version and compatibility policy

### Keep version concepts separate

1. **SDK package version** — the resolved `@google/genai` package in the lockfile.
2. **Google API version** — the SDK's explicit API version only where configured and supported by the required feature set.
3. **Provider model ID** — exact identifier sent to Google's API.
4. **Model lifecycle** — stable, preview/experimental, deprecated, or unavailable, with evidence and review date.
5. **Feature/capability contract** — whether a model supports the requested operation, modality, tools, output format, and relevant configuration.

Do not derive one version from another, and do not assume that the latest SDK automatically makes every model ID available.

### Dependency policy

- Keep the lockfile authoritative and use reproducible installs in CI.
- SDK upgrades must be reviewed through a dependency PR with release-note review and focused compatibility tests.
- Avoid a blind API-version switch. Confirm the required endpoints and feature compatibility first, then pin/configure an API version deliberately where the SDK supports it.
- Record the tested SDK version, API version, and test date in release evidence.
- Add automated dependency-update coverage only if it runs the same build, typecheck, provider-contract, and focused regression gates.

### Canonical model registry contract

The planned registry should be the only source for model metadata and expose a typed record with at least:

- canonical internal key and exact provider model ID;
- display name, provider, modality/capabilities;
- lifecycle state and whether selectable by users;
- input/output limits and supported configuration features, when verified;
- cost-rate reference and rate provenance/effective date;
- aliases and migration policy;
- fallback eligibility by capability, with explicit quality/cost bounds;
- verification source, checked-at date, and availability-cache expiry.

Do not label a model “available” based solely on its presence in a static registry. Runtime availability is key-, project-, region-, API-version-, and feature-dependent. Keep static capability metadata separate from per-credential runtime discovery.

### Resolver contract

One resolver should accept a request like:

- capability (text, fast-text, reasoning, structured JSON, image, video, audio, streaming, etc.);
- requested model or user preference, if applicable;
- task profile and explicit overrides;
- credential/provider context;
- required features and budget/entitlement constraints.

It should return a structured resolution containing:

- requested model and served model;
- capability and effective settings profile;
- whether substitution occurred and the reason;
- fallback candidates allowed by policy;
- availability/verification state;
- metering model ID and rate status.

The resolver must reject unsupported combinations before the request. Fallbacks must not mask authentication, authorization, quota, or billing errors. Never silently replace a model with a different modality or materially different quality/cost tier.

### Generation configuration contract

Use shared typed profiles with documented precedence:

**platform defaults → capability profile → user preference → task-specific override**

Validate every override against the resolved model's known capabilities. Keep modality-specific settings separate where the provider requires it. Record the effective non-secret settings in diagnostics. Do not log raw prompts or secrets by default.

### API-key validation contract

- Use the same registry/resolver policy as production generation.
- Discover model pages correctly using the SDK's supported pager/iterator API.
- Filter to models with the required operation and capability, not just names containing “Gemini”.
- Prefer a small, low-cost, verified text-capable model, but do not assume “Flash” means stable or available.
- Treat list-model success as discovery evidence only; a minimal generation probe is the end-to-end validation.
- Distinguish invalid credentials/permissions, model-not-found/unsupported, quota/rate limit, network/transient errors, and empty/blocked output.
- Ensure validation cleanup resets loading state in a `finally` path.
- Never display or log the raw key or provider response body.

### Rollout and compatibility

Implement the facade and registry additively first. Migrate one consumer at a time, retaining existing behavior until the new resolver is covered by tests. Avoid mass-rewriting all call sites in one unreviewable commit. Remove old lists/fallbacks only after the call-site inventory and tests prove no consumer depends on them.

## Acceptance criteria for Phase 0/1

- [ ] Target SHA and exact active/legacy call-site inventory recorded.
- [ ] All model ID sources, fallback chains, settings keys, and metering rates mapped.
- [ ] SDK lockfile version and API version usage verified.
- [ ] A single proposed registry/resolver contract reviewed before implementation.
- [ ] Existing provider architecture guards and exceptions documented.
- [ ] Security boundary for production credentials and BYOK explicitly decided.
- [ ] No claim of runtime compatibility without API-backed test evidence.

## Additional audited consumers and dependency evidence

- `src/services/brain/Core.ts` — direct generation consumer through the shared client
- `src/services/CollabEngine.ts` — direct generation consumer
- `src/views/dashboard/widgets/VideoCommentOperatorWidget.tsx` — direct generation consumer
- `package-lock.json` — resolves `@google/genai` to `1.46.0`

## Related source files

- `src/services/gemini.ts`
- `src/config/aiConfig.ts`
- `src/services/brain/modelRouting.ts`
- `src/context/GeminiKeyContext.tsx`
- `src/services/billingEntitlement.ts`
- `src/services/brain/__tests__/brainProviderArchitectureGuard.test.ts`
- `src/services/__tests__/geminiCustomKeyAccess.test.ts`
- `package.json` and the repository lockfile

## Change log

- 2026-10-28: Initial Phase 0/1 audit and policy baseline authored from GitHub source inspection. A repository-wide target-SHA scan, local test execution, and live-key validation remain outstanding.
