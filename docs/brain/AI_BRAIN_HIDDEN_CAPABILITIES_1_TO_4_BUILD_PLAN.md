# Build Plan: AI Brain Capabilities 1–4

**Target:** `master/consolidated-feature-integration`  
**Parent resource:** [Hidden Capabilities Resource & Roadmap](../product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md)  
**Scope:** (1) Channel Intelligence Engine, (2) Evidence-Connected Brain, (3) Channel Context Intake, (4) Prompt Library and Chat Handoff.  
**Constraint:** Extend canonical owners. No parallel Brain runtime, profile/context store, evidence store, analytics engine, or prompt registry.

## Outcome
A creator can maintain channel context, ask a question, receive an answer grounded in the exact evidence selected for that turn, inspect source references and limitations, and launch/edit a reusable prompt without losing provenance.

## Canonical footholds — verify current callers before edits
- [BrainContextBroker.ts](../../src/services/brain/BrainContextBroker.ts): evidence/context assembly.
- [BrainOrchestrator.ts](../../src/services/brain/BrainOrchestrator.ts): turn orchestration.
- [BrainCapabilityRegistry.ts](../../src/services/brain/BrainCapabilityRegistry.ts): existing capability definitions/selection.
- [CreatorContextResolver.ts](../../src/services/brain/CreatorContextResolver.ts): governed context facade.
- [aiBrainContext.ts](../../src/services/aiBrainContext.ts): profile/intake types and helpers.
- [AIBrainCommandInterface.tsx](../../src/views/AIBrainCommandInterface.tsx): current Brain UI/intake.
- [Chat Studio Primitive Plan](./AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md), [Brain Toolbox + Chat Plan](./AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md), [Quick Wins Master Plan](./AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md), [Feature Master & Readiness](./AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md).

These are candidate footholds, not proof of completeness or disconnection. Inspect the target branch, import/call graph, route, tests, and recent PR history first.

## Non-negotiable contracts
- Preserve raw creator input exactly; presentation sanitization cannot mutate learning, evidence matching, or follow-up inputs.
- Displayed evidence must come from the exact evidence pack supplied to the relevant turn and retain canonical IDs.
- Reuse CreatorContextResolver/envelope, BrainContextBroker, BrainOrchestrator, BrainCapabilityRegistry, evidence-quality owners, ToolReceipts and canonical output IDs where applicable.
- Show only recorded provenance (capability IDs, evidence used/missing, prompt version, actual model served if known, operation state, output reference). Never expose private chain-of-thought.
- Tool handoffs remain review-only unless an existing approved-action contract says otherwise. Retry generation only; never replay external side effects automatically.
- Use real Studio exports/tokens, keyboard and screen-reader support, visible focus, responsive behavior and reduced-motion support.

## Progress note — capability 2 first slice

The first implementation slice is committed on the target branch:
- `src/services/brain/PromptEvidenceIntegrity.ts` centralizes saved-turn evidence verification and requires content-fingerprint parity for non-empty prompt evidence.
- `src/views/AIBrainCommandInterface.tsx` now uses that shared helper, so evidence detail is not presented as verified based on IDs alone.
- `src/services/brain/PromptEvidenceIntegrity.test.ts` covers unchanged IDs with changed content, manifest mismatch, empty evidence, legacy metadata, and missing fingerprint.

This does not complete capability 2. Remaining work includes verifying that evidence displayed in each answer is the exact turn-bound model input across normal, fallback, retry, and restored turns; exercising evidence links and quality/missingness UI; and running focused tests, typecheck/build, and browser checks. The current execution environment could not reach GitHub for a local checkout, so the new test suite has not been executed here.

Follow-up slice — saved evidence quality parity: `BrainOrchestrator` now fingerprints the exact prompt-rendered record subset when persisting normal and orchestration-fallback turns, rather than attaching the pre-render selection's quality report to a potentially smaller rendered set. Added a regression case proving a report for a larger set is rejected and a report rebuilt for the persisted subset verifies. This code is committed but has not been run locally; CI/test confirmation is still required.

Follow-up slice — creator-answer evidence integrity: creator-profile evidence is also rendered into the model prompt, so it now receives its own persisted content fingerprint and ordered ID manifest. `PromptEvidenceIntegrity` verifies this manifest alongside analytics evidence; a changed creator-profile value or a missing fingerprint marks the turn as mismatched rather than allowing the analytics manifest alone to make the whole turn look verified. Regression tests cover both cases. Verification remains pending because this environment cannot run the repository's test/build commands.

Compatibility refinement: historical turns with an explicit empty creator-answer evidence list can still verify without a fingerprint, because there is no content to fingerprint. Historical turns containing non-empty creator-answer records without a fingerprint remain unverified/mismatched by design.

**Task 0.1**
- Read the linked Brain plans and [Studio hierarchy](../ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md) and [Component Library source of truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md).
- Trace context → evidence → capability → model → result UI.
- Inventory current intake fields/persistence, prompt definitions/categories/versioning, handoff APIs, tests and routes.
- Classify each of items 1–4 as A hidden-functional, B disconnected, C partial, or D legacy/duplicate.

**Acceptance**
- [ ] Exact target branch/commit and existing failures recorded.
- [ ] Source map identifies canonical owners and active callers.
- [ ] No implementation begins solely because a plan or export exists.

## Phase 1 — Evidence-backed answer and channel intelligence (1–2)
**Task 1.1: Evidence contract**
- Trace selected evidence IDs through context assembly into the exact model turn and returned citations.
- Verify source IDs, freshness/missingness, quality diagnostics and follow-up filter/cohort preservation.
- Add failing regression tests first for mismatched evidence, empty/partial/stale evidence, and lost filters.

**Task 1.2: Answer-first result UI**
- Reuse current Brain page and production Studio primitives.
- Render answer first, then 3–5 initial evidence items with expand/collapse and navigation by canonical ID.
- Show truthful empty, stale, partial, provider unavailable, and generation failure states.
- Add a compact “How this was produced” disclosure from recorded provenance only.

**Task 1.3: Channel intelligence projection**
- Inventory existing channel/video/audience/statistics/algorithm intelligence owners.
- Compose the overview from those sources; do not create another analytics engine or recompute canonical metrics.
- Link each finding to its source and label observation vs recommendation/hypothesis.

**Acceptance**
- [ ] Evidence displayed equals evidence supplied to the relevant turn.
- [ ] Numerical claims honor missing/stale-data diagnostics.
- [ ] No unsupported confidence, readiness, or model claims.
- [ ] Tests cover evidence mismatch, partial evidence, and follow-up navigation.
- [ ] Existing conversation restore and tool-routing tests remain green.

## Phase 2 — Channel context intake and correction (3)
**Task 2.1: Field/persistence reconciliation**
- Compare `aiBrainContext.ts`, current intake UI, profile adapters, CreatorContextResolver, and persisted profile shape.
- Map every question/answer to one canonical field and owner; identify orphaned/duplicate fields.
- Preserve existing creator answers; do not silently reset or migrate them.

**Task 2.2: Guided, resumable UI**
- Expose missing questions through the existing Brain/profile entry point using approved Studio primitives.
- Support save, resume, edit/correct, valid skip, and explicit completion status.
- Show confirmed/inferred/temporary/stale/unavailable only when source metadata supports it.
- Route corrections through canonical persistence/governance; no new profile store.

**Task 2.3: Runtime consumption**
- Prove saved answers flow through CreatorContextResolver into the context used by subsequent Brain turns.
- Add tests that a correction changes the resolved envelope and later context while raw input remains unchanged.

**Acceptance**
- [ ] Existing profile data survives rollout.
- [ ] Each field has one documented owner and persistence path.
- [ ] Saved corrections are consumed by Brain through the canonical resolver.
- [ ] Save/resume/error/validation and keyboard/mobile behavior are tested.

## Phase 3 — Prompt library and safe chat handoff (4)
**Task 3.1: Reuse prompt source**
- Locate current prompt definitions, registry, category/search data, versioning and handoff path.
- Reuse the canonical source; do not create a parallel registry.
- Ensure prompt ID/version can survive selection → chat submission where supported.

**Task 3.2: Discoverable prompt UI**
- Add search/category filtering and expandable prompt rows using existing Studio modules.
- Show concise explanation and expandable full prompt.
- Provide “Send to Chat” and “Edit First” actions where compatible with current design plan.
- Editing creates an editable working copy and must not silently mutate shared prompt text.

**Task 3.3: Verify handoff**
- Test empty/long prompts, edit-then-send, repeated send, keyboard navigation and mobile layout.
- Retry generation only; don't duplicate external side effects.
- Don't claim execution or save success before canonical confirmation.

**Acceptance**
- [ ] One canonical prompt source.
- [ ] Search, categories, expand, edit and send actions work.
- [ ] Origin/version provenance is preserved where supported.
- [ ] Shared prompt definitions are not mutated by editing.
- [ ] No fake success state or automatic side-effect replay.

## Checkpoints and verification
**Checkpoint A — after Phase 0:** source map/classification reviewed; scope confirmed.  
**Checkpoint B — after Phase 1:** focused evidence/context/orchestrator tests, build/typecheck and browser review of evidence states at mobile/desktop.  
**Checkpoint C — after Phases 2–3:** intake persistence/runtime tests, prompt handoff tests, conversation restore, tool-route and learning-governance tests; keyboard/mobile/reduced-motion checks.

Discover and use current package scripts. Run relevant Vitest tests, typecheck, lint/source-governance, production build, and Studio import inventory audit when relevant:
`node --test scripts/audit/studio-hub-component-import-inventory.test.mjs`
`node scripts/audit/studio-hub-component-import-inventory.mjs`
Record only checks actually run.

## Likely files (confirm from source graph)
`src/services/brain/BrainContextBroker.ts`, `BrainOrchestrator.ts`, `BrainCapabilityRegistry.ts`, `CreatorContextResolver.ts`, `src/services/aiBrainContext.ts`, `src/views/AIBrainCommandInterface.tsx`, current imported Brain UI components, focused service/UI tests, and relevant canonical docs. This is not permission to edit all files indiscriminately.

## Risks
| Risk | Mitigation |
|---|---|
| Duplicate profile/prompt/evidence storage | Canonical owner map before edits |
| Evidence mismatch | Turn-bound IDs and regression tests |
| Intake overwrites existing answers | Preserve data; explicit tested migration only |
| Fake readiness/success | Canonical diagnostics/receipts only |
| Design drift | Real Studio exports/tokens and source-of-truth docs |
| Broad Brain regressions | Thin vertical slices, checkpoints, focused commits |

## Definition of done
Items 1–4 have source-backed classifications; intended paths are reachable via real UI; evidence/context provenance is preserved; prompt origin/version is retained where supported; no parallel system is introduced; tests/build and observed responsive/accessibility checks are documented; known failures and rollback boundary are reported.


Follow-up slice — citation resolution: `BrainTurnEvidenceRibbon` now resolves response citation IDs against either the prepared evidence-pack item IDs or the verified typed prompt-record IDs. It does not trust typed record IDs when integrity is unavailable or mismatched. Added component regression cases for both verified and mismatched manifests. This fixes a false-unresolved path where the response cited typed `EvidenceRecord` IDs while the ribbon compared only evidence-pack item IDs.
## Follow-up slice — local interaction journal and retry input continuity

The canonical IndexedDB conversation-turn store remains the only persistence owner. No parallel database or interaction store was added.

- New `src/services/brain/BrainRetryContinuity.ts` and its focused test specify three explicit retry outcomes: `original_input_restored`, `fresh_evidence_retry`, and `legacy_context_reconstructed`.
- New turns persist a serializable `generationInputSnapshot` in the existing turn metadata. Before generation starts, the exact outbound `systemInstruction`, bounded model history, creator input, and the evidence records rendered into that instruction are checkpointed to the same turn. The original prompt snapshot is retained for interrupted retries.
- A saved-evidence retry restores the saved generation inputs and, when the original model-input snapshot exists, reuses its exact system instruction, history, and evidence records rather than treating rebuilt current context as original input.
- A fresh-evidence retry uses the newly assembled inputs and records its mode and input snapshot in the turn's interaction log. Legacy turns without a saved prompt snapshot are explicitly marked as reconstructed rather than verified original-input replays.
- Inbound interactions and outbound responses are appended to the existing turn metadata. Retry attempts, prompt/evidence snapshots, creator feedback, and review-only handoff receipts are also recorded locally against the canonical turn. Question-module answers and feedback-created turns receive inbound receipts automatically.
- The non-success orchestration fallback now avoids creating a new learning entry when `retryGenerationOnly` is true, preventing retry from replaying that learning side effect.
- Local provider-error fallbacks are saved as canonical conversation turns instead of existing only in React component state.

**Local persistence scope:** IndexedDB stores this history on the current mobile or desktop browser/device. This does not imply automatic cross-device synchronization, and browser data clearing/quota/eviction policies can still affect retention.

**Verification status:** `BrainRetryContinuity.test.ts` was added, but this execution path could not run the repository's test runner, typecheck, production build, or mobile/desktop browser checks. CI and runtime verification remain required; do not treat this slice as test-passing until those checks actually run.
## Follow-up slice — channel-scoped profile persistence and prompt handoff provenance

- `aiBrainContext.ts` now keys saved creator/channel context, completion, and dismissal state by the stable active channel ID when one is available. Switching channels loads that channel's profile rather than reusing the last global profile.
- The old global profile is retained. It is copied into a channel-scoped key only when its saved channel name matches the active channel label; mismatched or unscoped legacy profile data is not silently assigned to another channel.
- The Brain intake saves to the active channel scope while editing and loads again on channel switches. Brain prompt construction and `BrainOrchestrator` read the same channel-scoped owner.
- `CreatorContextResolver` now includes `creatorAnswers` from the same canonical local profile loader when personalization is enabled, allowing downstream consumers to inspect the saved intake through the resolver envelope rather than creating another store.
- `BrainPromptLibrary` actions now pass the selected canonical card identity to callers. Send-to-chat records prompt ID/version/action in the canonical turn metadata; Edit First retains that origin as a working-copy marker until the draft is sent. Shared prompt definitions are not mutated.
- Added `aiBrainContext.test.ts` coverage for channel isolation and safe legacy migration, `CreatorContextResolver.test.ts` coverage for profile flow through the envelope, and `BrainPromptLibrary.test.ts` coverage for filtering and edit isolation.
- Interaction receipts now refer to evidence IDs/request spec while the full evidence pack and exact model-input records remain in canonical turn metadata, avoiding duplicate large snapshots in the journal.

**Storage contract:** conversation/evidence/interaction history uses the existing local IndexedDB conversation store; the creator intake uses channel-scoped browser local storage. Both are local to the current browser/device on mobile or desktop and do not automatically synchronize between devices. Clearing site data, browser eviction, storage quota, or private-browsing restrictions can affect retention.

**Verification status:** changes and focused tests are committed, but this session has not run Vitest, typecheck, production build, or real mobile/desktop browser tests. Treat runtime and CI verification as pending.


Follow-up — channel-scoped creator-answer eligibility:
- The Brain no longer requires a display-name field to be populated before using creator answers loaded from the active channel-scoped profile key. The prior label check incorrectly dropped valid profile answers when a channel-scoped profile had no `identity.name`.
- Legacy global profile data remains label-gated; an unnamed or mismatched legacy record is not assigned to an active channel.
- Added regression cases in `src/services/brain/CreatorAnswerEvidence.test.ts` for scoped profiles with blank names and legacy label matching.
- Verification is still pending: GitHub reports no workflow runs for the commit. Current combined statuses show Vercel build-rate-limit failures, which do not establish a code test result. Do not treat the phase as certified until focused Vitest, typecheck, production build and browser restore/channel-switch checks are run.


## Follow-up slice — turn-level evidence continuity verification (2026-10-28)

**Implementation slice:** make the saved-model-input retry gate explicit and independently testable, without introducing a second conversation/evidence store.

- Added `resolveBrainModelInputSnapshot` to the existing `BrainRetryContinuity` module. It permits exact model-visible snapshot reuse only for generation-only retries using saved evidence when continuity is `original_input_restored` and the saved system instruction is present.
- Routed `BrainOrchestrator` through that resolver for the original system instruction, model history, analytics evidence records, and creator-answer evidence records. Fresh-evidence retries and legacy reconstructed turns continue to rebuild context.
- Added regression tests for exact snapshot restoration and negative cases: ordinary generation, non-generation-only retry, fresh evidence, legacy reconstruction, and absent/incomplete saved snapshots.
- Added an IndexedDB-backed conversation-store regression that records original and retry model-input snapshots, completes a provider-error fallback turn, and verifies both snapshots and interaction receipts survive canonical thread restoration.
- Existing canonical `model_input_snapshot` / `retry_model_input_snapshot` interaction receipts and turn metadata remain the persistence owner. No external data refresh or publishing side effect is replayed by this resolver.

**Verification status:** source changes and regression cases are committed to the feature branch, but the focused Vitest suite, typecheck, and production build have not been executed in this GitHub-only pass. Do not mark this capability phase certified until those checks run. Next verification must cover normal answer, provider-error fallback, restored conversation reload, saved-evidence retry, and fresh-evidence retry, then inspect source-link handling for missing, stale, and partial evidence.
