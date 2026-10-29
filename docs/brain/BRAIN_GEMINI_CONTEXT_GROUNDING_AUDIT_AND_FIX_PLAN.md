# Brain Gemini and Context Grounding — Audit and Fix Plan

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** ACTIVE_PLAN  
**Status:** ACTIVE  
**Concern:** Brain chat model execution, creator context, capability selection, evidence grounding, and truthful generation status  
**Owner:** BrainRuntime  
**Registry ID:** DOC-PLAN-BRAIN-GEMINI-CONTEXT-GROUNDING  
**Target repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Planning branch:** `plan/brain-gemini-context-grounding-audit`
**Implementation branch:** `fix/brain-gemini-context-grounding-phases-0-1`  
**Related authorities:** `docs/domains/BRAIN.md`, `docs/brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md`, `docs/brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md`, `docs/specifications/PROMPTS.md`, `docs/governance/VERIFICATION.md`

## Objective

When a creator has configured a Gemini API key, Brain chat must attempt model generation through the canonical runtime, supply the correct channel/project/profile/context and only eligible evidence for the current turn, select capabilities appropriate to the creator's request, and report honestly when generation or grounding is unavailable. Generic fallback text must not masquerade as a model-grounded answer.

This is a diagnosis and implementation plan, not a claim that the live failure has already been reproduced or that any fix has been implemented.

## Scope and non-goals

**In scope**
- Key availability and freshness at the moment a chat turn starts.
- Canonical Gemini provider invocation and model errors.
- Generation-path, fallback-reason, repair, and validation transitions.
- Creator context, profile, channel/project scope, evidence and context-budget selection.
- Intent and capability selection.
- End-to-end provenance from prompt/context through generated, validated, persisted and rendered response.
- Tests and focused diagnostic telemetry needed to isolate future regressions.

**Out of scope**
- A second Brain runtime, provider registry, profile store, evidence store, or capability registry.
- Replacing Gemini or changing provider policy without parity evidence.
- Weakening evidence safety, numeric-claim validation, creator permissions, or channel-scope checks merely to make responses sound more confident.
- Treating the presence of a key as proof that the key is valid, the provider call succeeded, or private analytics are accessible.

## Verified code footholds

These are source-level observations on `master/consolidated-feature-integration`; they are not a verified explanation of the user's live session.

1. `src/views/AIBrainCommandInterface.tsx` computes `canUseGemini = hasGeminiKey()` during render and passes it to `runBrainTask({ allowModel: canUseGemini })`. The send path builds a fresh context snapshot and system prompt, then invokes the canonical runtime. The component catch path also builds a local fallback response.
2. `src/services/brain/runtime/BrainRuntime.ts` delegates to `runBrainTurn` in `src/services/brain/BrainOrchestrator.ts`.
3. `src/services/brain/BrainOrchestrator.ts` initializes a basic-guidance fallback, calls the model gateway only when `allowModel` is true, validates generated output, may retry a repair, and can return `basic_guidance` with `model_disabled`, `provider_error`, `validation_failed`, or `repair_failed` paths.
4. `src/services/brain/runtime/BrainModelGateway.ts` currently delegates structured generation to `generateStructuredBrainResponse` in `src/services/gemini.ts`.
5. `src/services/brain/BrainContextBroker.ts` assembles context sections including channel evidence, channel profile, evidence gaps/quality, statistics, audience and algorithm intelligence, channel knowledge, active project, creator style, saved memory, channel-provided context, creator-answer evidence, recent conversation and public research. It enforces creator controls, scope/quality gates and a context budget.
6. `src/services/brain/BrainContextResolution.ts` resolves task-specific required sections, budget priorities and reports selected/omitted section IDs. Existing tests cover budget omission and required-section gaps.
7. `src/services/brain/BrainCapabilityRegistry.ts` selects from the canonical registry using inferred intent, creator controls, channel data availability and a bounded capability count.
8. `src/services/__tests__/brainOrchestrator.test.ts`, `src/services/brain/BrainContextResolution.test.ts`, `src/services/brain/BrainCapabilityRegistry.test.ts`, `src/services/__tests__/brainUserControls.test.ts`, and `src/services/keyVault.test.ts` are existing relevant test footholds. The current suite already explicitly covers a model draft that is downgraded after failed validation/repair.

## Ranked hypotheses — must be tested, not assumed

### H1 — Model generation is disabled at turn start

The key may be saved without causing the mounted chat surface to re-evaluate `hasGeminiKey()`, or the settings and provider may resolve different effective values. Prediction: a reproduction will show `allowModel=false` / `model_disabled` even though the key is present in the intended settings store.

### H2 — Provider invocation or model selection fails

A key can be present but invalid, restricted, over quota, incompatible with the selected model, or blocked by a request/schema error. Prediction: the orchestrator trace shows a provider failure and the provider boundary reports a specific redacted error class. A key-presence boolean alone will not detect this.

### H3 — Validation/repair downgrades an otherwise useful model response

Prediction: the provider call succeeds and returns structured output, but the validation/repair trace ends with `validation_failed` or `repair_failed` and the UI shows Basic Guidance. Compare validator reasons against the actual creator request before changing any acceptance rule.

### H4 — Relevant profile/evidence/context is omitted or stale

Creator controls, channel-scope mismatch, evidence-record quality parity, missing data, stale snapshots, or context-budget resolution may omit needed sections. Prediction: the turn's canonical source snapshot contains the expected context, but the resolved model prompt does not—or the canonical source snapshot itself is empty/stale.

### H5 — Capability/intent selection or post-generation formatting loses specificity

Prediction: the prompt is correctly grounded but the selected capability IDs/intent are wrong, or the structured model output is specific while the validated/persisted/rendered answer becomes generic. Compare each stage using the same turn ID.

## Architecture and data-flow contract

```text
Key Vault / effective settings
        ↓
AIBrainCommandInterface (current key readiness + raw user message)
        ↓
buildAIBrainContextSnapshot + system prompt
        ↓
BrainRuntime → BrainOrchestrator
        ├─ BrainTaskProfileRegistry / BrainCapabilityRegistry
        ├─ BrainContextBroker → BrainContextResolution
        ├─ canonical evidence/profile/context owners
        └─ BrainModelGateway → generateStructuredBrainResponse (Gemini)
        ↓
validation / bounded repair / truthful fallback
        ↓
persisted turn + BrainTrace / model-input snapshot
        ↓
rendered answer + generation badge + context/evidence provenance
```

No new owner or parallel data store is permitted. Reuse the current key vault, settings, runtime, capability registry, context broker/resolver, evidence records, traces, conversation persistence, and learning governance.

## Execution plan

### Phase 0 — Reproduce the exact symptom and preserve evidence

- [ ] Capture one redacted real chat turn where a configured key still yields Basic Guidance or a generic answer.
- [ ] Record the same turn's generation path, fallback reason, requested/served model, provider error class, validation/repair reasons, task-profile ID, capability IDs, trace ID, and persisted turn ID.
- [ ] Compare the actual effective key readiness at send time with the Key Vault's saved state. Never log or copy the key itself.
- [ ] Establish one deterministic failing test at the earliest correct seam. A test that only checks the badge is insufficient.
- [ ] Inspect `docs/governance/VERIFICATION.md` requirements before claiming runtime or browser verification.

**Gate 0:** We can state whether the first failure is key-readiness, provider invocation, context assembly, validation, persistence, or rendering. If no safe reproducible trace is available, record the blocker and request a redacted trace rather than guessing.

### Phase 1 — Make model readiness reactive and truthful (H1/H2)

- [x] Add regression tests for Gemini-key save/clear notifications in `src/services/keyVault.test.ts` and a mounted-surface contract in `src/views/AIBrainRuntimeSurface.contract.test.ts` (execution still pending).
- [x] Replace render-only `canUseGemini = hasGeminiKey()` with state refreshed on the canonical key-change event, existing `yt_settings_updated`, and cross-tab `storage` events; clean up listeners on unmount.
- [x] Trace the canonical Key Vault write/update notification and the provider's `getAiSettings()/resolveGeminiApiKey()` path. Reuse the existing notification/store contract; no second key store was introduced.
- [ ] Keep key presence separate from provider health. Surface missing key, invalid/rejected key, model-unavailable, quota/rate limit, timeout, and other provider failures only when supported by actual error classification.
- [ ] Ensure a failed provider call records a truthful fallback reason and never reports Full Brain/model success.
- [ ] Verify key material is redacted from logs, traces, telemetry, screenshots and test fixtures.

**Acceptance:** Saving/changing a key while the page is mounted changes readiness for the next turn; valid configuration reaches the provider boundary; invalid configuration produces an actionable, accurately classified failure.

### Phase 2 — Prove and fix context/evidence continuity (H4)

- [ ] For the captured turn, compare the source snapshot with the prompt input and resolved context sections.
- [ ] Assert the expected channel identity, project/content build, profile fields, and permitted evidence IDs remain in scope for the same channel and turn.
- [ ] Assert required section IDs are either selected or surfaced as explicit omissions/gaps; do not silently present the turn as fully grounded.
- [ ] Trace creator controls and evidence-quality/scope blocks to their canonical source. Fix only the actual faulty owner or stale snapshot dependency.
- [ ] Verify selected/omitted section reporting is retained in existing trace/model-input metadata where supported; extend existing metadata only if a specific evidence gap is proven.

**Acceptance:** The exact context shown as used is the context supplied to the model; no cross-channel leakage; missing or blocked evidence remains a truthful limitation; required-context omissions are visible and testable.

### Phase 3 — Fix intent/capability and answer-validation defects (H3/H5)

- [ ] Add table-driven cases for direct question, strategy request, analytics diagnosis, channel-profile question, and creator-asset generation.
- [ ] For each case, assert task-profile ID, selected capability IDs, required context sections, and response mode.
- [ ] Replay a real downgraded model output against `validateBrainResponse`; classify each rejection as legitimate safety/evidence enforcement or an incorrect heuristic.
- [ ] Repair only the faulty rule. Keep numeric/evidence safeguards and retry/side-effect boundaries intact.
- [ ] Ensure repaired model output is evaluated with the same required context and that a failed repair preserves a clear failure reason.
- [ ] Compare structured model output → validated response → persisted turn → rendered response, all tied to one turn ID.

**Acceptance:** Good contextual responses are not downgraded by unrelated heuristic checks; genuinely unsafe or ungrounded answers remain blocked; direct questions receive direct answers and task-specific requests receive the correct output type.

### Phase 4 — Provenance and creator-facing status

- [ ] Keep the generation badge derived from the authoritative generation path and fallback reason.
- [ ] Make the existing “How produced”/runtime details reveal actual model served, capability IDs, evidence returned/missing, prompt version, repair state and operation outcome where recorded.
- [ ] Do not display a model identity, capability execution, evidence citation or success state without corresponding runtime records.
- [ ] Keep detailed diagnostics collapsed by default while making actionable provider/context failures discoverable.

**Acceptance:** A creator can distinguish model-generated, repaired-model, and local basic-guidance answers; a developer can diagnose why without accessing secrets or private chain-of-thought.

### Phase 5 — Verification and release gate

- [ ] Run focused tests first:
  `npx vitest run src/services/__tests__/brainOrchestrator.test.ts src/services/brain/BrainContextResolution.test.ts src/services/brain/BrainCapabilityRegistry.test.ts src/services/__tests__/brainUserControls.test.ts src/services/keyVault.test.ts`
- [ ] Run relevant broader Brain/runtime/context tests, source-governance checks, and typecheck using the repository's actual scripts.
- [ ] Run `npm run build`.
- [ ] Verify signed-in and logged-out paths if both can reach the same Brain surface, plus a key added after page mount.
- [ ] Perform browser verification with a real permitted test key and non-sensitive fixture context; inspect network/provider errors and confirm no key appears in artifacts.
- [ ] Capture a before/after trace showing the same request uses the expected context and an actual served model, or reports a truthful limitation.

**Release gate:** No merge based solely on source assertions. Tests, build, and browser/runtime evidence must be reported separately.

## Required test matrix

| Scenario | Expected result |
|---|---|
| No key configured | No provider attempt; truthful missing-key state; fallback identified as model-disabled/configuration-missing |
| Key added while Brain Hub is mounted | Next turn re-reads effective readiness and attempts generation |
| Key exists but provider rejects it | Provider error recorded without exposing the key; fallback does not claim model generation |
| Provider call succeeds | Model path and actual model identity are recorded where provider exposes them |
| Model response fails validation and repair | Validation/repair reasons explain the downgrade; no false Full Brain badge |
| Channel profile exists, analytics permission disabled | Allowed profile/context can be used; private analytics are not leaked; limitations are explicit |
| Evidence scope or quality mismatches | Mismatched evidence is blocked; no channel-specific claims from blocked evidence |
| Context budget omits a required section | Omission is recorded and the answer is constrained rather than silently presented as fully grounded |
| Creator asks a direct factual question | Correct task intent; direct response without unrelated growth-plan filler |
| Contextual model answer is persisted and rendered | Final text and provenance correspond to the same canonical turn and evidence pack |

## Rollback and safety

- Keep changes limited to the faulty existing owner and its tests.
- Preserve the current model gateway and runtime contracts.
- Do not retry external side effects; retry generation only.
- If a fix weakens evidence validation or changes context permissions, revert it and correct the owner rather than bypassing the guard.
- Keep all diagnostic logs redacted and remove temporary debug instrumentation before merge.

## Current audit status

### Phase 0–1 implementation checkpoint (2026-10-29)

- [x] Confirmed a stale-readiness defect candidate: `canUseGemini` was a render-time constant, so key changes made while the Brain surface remained mounted had no subscription-driven refresh.
- [x] Added `GEMINI_KEY_UPDATED_EVENT` from the existing Key Vault writer; the event contains no key material and is emitted after Gemini key save/clear.
- [x] Made Brain Hub readiness reactive to Key Vault updates, the existing Settings `yt_settings_updated` event, and browser `storage` events.
- [x] Authored focused Key Vault notification tests and a Brain surface contract test.
- [x] CI executed the Key Vault regression tests (5/5 passed) and Brain runtime surface contract tests (15/15 passed); production build passed.
- [ ] Full focused aggregate is not green: unrelated existing Studio-control/Comment Responder contract failures are present. Static typecheck also fails on errors in untouched Studio controls, route loaders, Brain orchestrator, and test dependencies; inspect CI logs before deciding which baseline defects need separate reconciliation.
- [ ] Capture a real redacted turn trace from the reported live failure. The stale-readiness issue is a confirmed source defect for mounted surfaces, but it is not yet proven to be the sole cause of the user's generic responses.


- Source-level route and key gate inspected.
- Source-level fallback/validation transitions inspected.
- Source-level context broker, context-budget resolver and capability selector inspected.
- Existing relevant test footholds identified.
- **Not yet reproduced against a live browser/session.**
- **PR CI ran:** production build passed; local smoke passed; Brain quality loop passed; the keyVault test file (5 tests) and Brain runtime surface contract file (15 tests) passed inside the focused aggregate.
- **PR CI is not green overall:** source governance fails in the confirmed Studio catalog audit; the broad focused suite has multiple unrelated existing contract failures; typecheck reports errors in files outside this change. Full-suite result was still running at the time of this update.
- **No implementation fix is claimed.**

The first implementation commit must be justified by the captured failure and include a regression test that goes red before the fix.
