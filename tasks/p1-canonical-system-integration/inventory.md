# Existing Code, Systems and Prior-Art Inventory
**Production Date:** 2026-10-29 | **Last Edited:** 2026-10-29 | **Class:** AUDIT | **Status:** INITIAL / PARTIAL
**Concern:** existing owners, code, tests, plans and migration leads | **Owner:** Integrated Application Program
**Registry ID:** DOC-AUDIT-P1-INTEGRATION-INVENTORY

This is a search-based routing inventory, not a runtime certification. Confirm exact paths, exports, imports, callers and tests on the live target before implementation. Classify every finding CURRENT_MAIN, BRANCH_ONLY, PR_ONLY, PLANNED, SUPERSEDED or UNKNOWN.

## P1-01 Brain continuity
**Authorities:** docs/domains/BRAIN.md; Product Architecture; Projects/ContentBuild, Asset Engine, Analytics/VT-SYNC and Channel Knowledge authorities.
**Code leads:** src/services/brain/**; BrainRuntime; BrainOrchestrator; BrainContextBroker; CreatorContextResolver; EvidenceIntelligenceResolver; BrainLearningPersistence; BrainProjectContext; BrainRuntimeSnapshot; ContentBuild event stream; Algorithm Intelligence event ledger; Channel Profile/Knowledge adapters.
**Tests:** test:brain-runtime-snapshot; test:focused; CreatorContextResolver, EvidenceIntelligenceResolver, BrainLearningPersistence, BrainProjectContext, BrainContextResolution, BrainEvaluationLoop, AlgorithmIntelligenceEventLedger and BrainCommunicationIngestion tests.
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE, CAP-PROJECT-CONTENT-IDENTITY, CAP-OUTCOME-LEARNING.
**Risk:** individually implemented subsystems may not preserve continuity across a real production journey. Do not add another profile, evidence, memory or outcome store.

## P1-02 Gemini provider/key/generation
**Authorities:** docs/domains/BRAIN.md; docs/specifications/PROMPTS.md; Product Architecture Brain Runtime and Creator Operations boundaries.
**Code leads:** BrainModelGateway; provider adapter/registry candidates; src/context/GeminiKeyContext.tsx; src/components/GeminiKeySettings.tsx; src/services/gemini.ts; brainProviderArchitectureGuard.test.ts; GenerationRecord and operation receipts.
**Tests:** test:unified-diagnostics; provider architecture guard; keyVault tests; test:focused; generation operation tests to discover.
**PR leads:** #1109 validation model correction; #1168 scanner; #1169 gateway convergence plan; #1174 provider substitution. Re-fetch status/diffs before harvesting.
**Risk:** credential readiness, provider/model availability and generation execution may be conflated. No second provider registry or direct UI SDK calls.

## P1-03 Unified diagnostics
**Authorities:** docs/governance/VERIFICATION.md; Product Completion Constitution; Integrated Application Program.
**Code leads:** src/services/diagnostics.ts; src/services/diagnostics/unified.ts; src/app/onScreenDiagnostics.ts; EvidenceLineageDiagnostics; googleProxyErrors; AnalyticsErrorReporter; Brain traces/tool receipts; ContentBuild event stream; Algorithm Intelligence event ledger; GenerationRecord/operation receipts.
**Tests:** test:unified-diagnostics; diagnostics tests in test:focused; EvidenceLineageDiagnostics and production handoff contract tests.
**Risk:** diagnostic producers may use incompatible IDs or omit next actions. Extend existing services/ledgers; no universal diagnostic database.

## P1-04 Priority-25 runtime
**Authorities:** Product Architecture capability registry; Task Authority; Verification.
**Code leads:** src/services/brain/BrainCapabilityRegistry.ts; Brain capability/task profiles; route/surface caller maps; runtime gating and feature access checks.
**Tests:** test:focused includes BrainCapabilityRegistry and BrainRuntime surface contracts; audit:ai-systems; test:ai-systems-governance; audit:reach.
**Identity blocker:** exact meaning and canonical ID for Priority-25 did not resolve in initial repository search. Search Task Index, capability registry, branch/PR names and originating work packet. Do not invent a CAP or task ID.
**Risk:** file/route/registry presence may not connect a real user action, permission, context, provider readiness and result.

## P1-05 Public resolver
**Authorities:** Brain Domain Authority; Creator Context; Product Architecture; public-handle contract to be linked after source discovery.
**Code leads:** src/services/publicHandleMode.ts; public-channel API resolver candidates; api/public-channel.node.test.mjs; publicHandleMode tests and pending-ingestion tests.
**Tests:** test:public-page-resolver.
**Risk:** tests may pass while production Brain caller remains disconnected. Verify TTL, cache identity, source provenance, stale/negative cache and public-only restrictions. No OAuth/private Analytics or fabricated counts.

## P1-06 Studio Controls
**Authorities:** docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md; docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md; docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md; docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md.
**Code leads:** src/components/subtoolbox/tokens.ts; scripts/emit-studio-control-vars.mjs; src/styles/studio-control-vars.generated.css; studio-control-core.css; studio-control-fields.css; studio-control-system.css; src/studio-ui/**; component library/catalog/certification.
**Tests:** studio:tokens; test:studio-controls; test:studio-field-style-ownership; test:studio-floating-input-typography; test:confirmed-library-layout; certify:studio-components.
**PR leads:** #935, #988, #992 and earlier Studio migrations. Inspect current diffs.
**Risk:** token, generated CSS, primitive style, catalog and export ownership can drift. Keep one token source and deterministic generated output.

## Shared governance and skills
AGENTS.md; .claude/skills/viewtube-document-system/SKILL.md; .claude/skills/viewtube-convergence-governance/SKILL.md; docs/governance/CONVERSATION_OS.md; Crown; Task Authority; Verification; governance/convergence/plan-families.json; capability-homes.json; code-ownership.json; existing conversation intake package. No new work ledger.


## Live reconciliation update — 2026-10-30
Audited target SHA: `0135fa33bf5cd59503c9feecce4977072ef60fec`. The initial leads above are discovery starting points; the following current facts supersede assumptions in the first draft.

- **Brain:** Brain Domain Authority defines six distinct product-system owners. BrainRuntime coordinates; it does not absorb creator context, analytics/evidence, Project/ContentBuild, Asset Engine, operations, or outcome persistence. Existing task leads include VT-003/004/019/020/021/022 and VT-035. Existing system-convergence tracker remains active prior art.
- **Gemini:** PRs #1109/#1168/#1169/#1174 are MERGED. #1168's static scanner and tests are now present: `scripts/audit/ai-generation-callers.mjs`, `scripts/audit/ai-generation-callers.test.mjs`, `audit:ai-generation-callers`, `test:ai-generation-callers`. #1174's `BrainModelProvider` and `createBrainModelGateway` are in `src/services/brain/runtime/BrainModelGateway.ts`; default remains Gemini. #1169 landed three existing plans under `docs/plans/` for gateway convergence, prompt governance, and provider credential security/BYOK. #1109 fixed validation to gemini-3.1-flash and normalized creator-safe errors. Current BYOK storage remains browser localStorage; not server-side encrypted vault.
- **Diagnostics:** VT-005 (OperationEnvelope/idempotency), VT-035 (correlation IDs) and VT-036 (failure taxonomy) are existing task leads. Extend these and existing domain event/receipt owners.
- **Priority-25:** not found in 13 capability records or 13 capability homes. VT-025 is an unrelated Analytics task (retire legacy selectors/cache consumers) in a temporary status projection, not a runtime capability. Keep unresolved.
- **Public resolver:** current `src/services/publicHandleMode.ts` uses a schema-v1 localStorage cache, max 20 entries, 3h TTL, positive resolved entries, handle/channel-ID matching and provenance. It nulls unavailable public metrics and cites channel page/RSS sources. Earlier 6h/3h/30m TTL values are not current code. Route candidates are `/public-channel/resolve` and `/api/public-channel`; route deployment and Brain caller still require runtime proof.
- **Studio:** current canonical token source is `src/studio-ui/tokens.ts`; `scripts/emit-studio-control-vars.mjs` reads that source and emits `src/styles/studio-control-vars.generated.css`. The earlier `src/components/subtoolbox/tokens.ts` lead is not the current emitter input. Current tier values: Supreme 60/3/6/52; Standard 44/3/6/38; Compact 28/2/4/24; Mini 20/1.5/3/17.5; Micro 12/1.5/3/10. Current token source has explicit focus widths; PR #992's derived-ratio proposal is not merged. PR #1203 emitter fix is merged. PRs #935/#988/#992 remain open and non-mergeable with overlapping donor files.
- **PR reconciliation:** #1109/#1168/#1169/#1174/#1178/#1203 merged. #935/#988/#992 open, non-mergeable. Never wholesale-merge these donor branches.


### Public resolver: additional current-main paths
- Server: `api/public-channel.mjs`; tests: `api/public-channel.node.test.mjs`, `api/public-channel.test.ts`.
- Client service: `src/services/publicHandleMode.ts`; tests: `src/services/publicHandleMode.test.ts`, `publicHandleMode.pending-ingestion.test.ts`, fixtures tests.
- Brain: `src/services/brain/runtime/BrainRuntime.ts` and `BrainRuntimeContracts.ts`; Settings, SidebarChatbot, AIBrainCommandInterface and BrainHubWidget provide explicit public context for logged-out/disconnected sessions.
- Stale scaffold: `src/features/capabilities/public-channel-resolution/` still contains a scaffold API URI and throwing write stub. Search found no production imports of its page/hook/API. Do not treat as canonical; separate no-loss cleanup required.


### Shared identity/diagnostics code inventory (2026-10-30)
- `src/services/operations/OperationEnvelope.ts` + tests: event/operation/correlation/causation/idempotency/scope/evidence/artifact contract.
- `src/services/operations/OperationRecord.ts` + tests: operation lifecycle, approval and cross-domain lineage projection.
- `src/services/diagnostics.ts`, `src/services/diagnostics/unified.ts` + tests, `src/app/onScreenDiagnostics.ts`: sanitized bounded diagnostics and adapter normalization.
- `src/services/brain/BrainAssistantContinuity.ts`, `EvidenceRecord.ts`, `BrainOutcomeLedger.ts`, `AlgorithmIntelligenceEventLedger.ts`: existing context/evidence/outcome ancestry. See [identity map](identity-map.md).
