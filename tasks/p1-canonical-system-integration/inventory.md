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
