# Studio Hub Planned Tools — Master Integration Reconciliation

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Assessment date:** 2026-10-17  
**Purpose:** Determine which planned Studio Hub capabilities should be added, merged into existing tools, optimized, or replaced without introducing parallel architectures.

## Executive decision

Do not build 13 new standalone tools or pages. The branch already contains substantial capability in Brain, analytics, ContentBuild, Asset Engine, script/story production, creator engagement, metadata, and Studio Hub. The main task is capability reconciliation and workflow integration—not starting from zero.

The canonical product definition is `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md`. It defines 13 outcome engines and explicitly merges overlapping concepts. The integrated lifecycle plan, `docs/architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md`, says to reuse Projects/ContentBuild, Asset Engine/Vault, Operation identity/ActionPacket/ToolReceipt/GenerationRecord, Publishing Package/Approved Publish Snapshot, Analytics Canon/VT-SYNC, Outcome/Evaluation, Evidence, and governed Brain learning. Those are the architecture authorities; do not add competing stores or generic history systems.

## Repository evidence inspected

The target branch tree was read at commit `c4b7ab76ad2ffd6612aaffa28c60196a97d957e1`. This is a tree-level inventory, not a claim that every listed service is fully wired or production-complete.

Existing relevant implementations include:

- Studio Hub library and publishing surface: `src/components/studio-hub/StudioPublishingCockpit.tsx`, `StudioHubConfirmedPrimitiveCatalog.tsx`, `StudioHubCompletePrimitiveCatalog.tsx`, and the related catalog tests.
- Content concepts: `src/features/concept-scene-studio/model.ts`.
- Script creation and project persistence: `src/features/script-architect/useScriptArchitect.ts`, `scriptProjectStore.ts`, `scriptBrainRuntime.ts`, with tests.
- Production orchestration and generation contracts: `src/features/video-director/` including `generationContracts.ts`, `promptCompiler.ts`, `projectStore.ts`, `surfaceHandoff.ts`, `providerRouter.ts`, and contract tests.
- Audience/creator engagement: `src/components/CommentResponder.tsx`, `src/components/CommunityPostGenerator.tsx`, `src/features/creator-engagement/useCommentResponderController.ts`, `useCommunityPostController.ts`, and `communityPostStore.ts`.
- Existing creator tools: `src/components/MediaAnalyzer.tsx`, `EndScreenTool.tsx`, and `PreLaunchPriming.tsx`.
- Metadata: `src/services/metadataMaster.ts` and `MetadataOperationProvenance.ts`.
- Brain and opportunity evidence: `src/services/brain/OpportunityIntelligence.ts`, `OpportunityEvidenceAdapter.ts`, `BrainEvidenceContract.ts`, `BrainEvaluationLoop.ts`, `BrainPromptGovernance.ts`, `BrainOutcomeLedger.ts`, `AlgorithmStrategyEngine.ts`, `ChannelIntelligence.ts`, `AudienceIntelligence.ts`, and `BrainWorkflowRecipes.ts`.
- Lifecycle and asset lineage: `src/services/asset-engine/ContentBuildRepository.ts`, `ProjectContentBuildBridge.ts`, `GenerationWorkflow.ts`, `ApprovedPublishSnapshot.ts`, `PublishingPackageProjection.ts`, `PostPublishAnalyticsBridge.ts`, and `EvidenceLineageDiagnostics.ts`.
- Canonical analytics: `src/services/analytics-canon/` including contracts, current evidence, metric comparability, and VT-SYNC adapter.

The tree shows strong reusable foundations. It does not establish that all 13 planned tools have end-to-end user flows, reliable data sources, or complete tests. That must be verified at the call-site and runtime level before any code is retired.

## Recommended disposition by canonical tool

Disposition meanings:
- **Merge**: combine overlapping product concepts behind one clear owner.
- **Extend**: add a missing capability to an existing authoritative tool/service.
- **Compose**: expose existing services together through a workflow; avoid another engine/store.
- **Validate first**: planned capability is not proven absent merely because a matching filename was not found.

| Canonical tool | Decision | Existing capability to reuse | Recommended change / boundary |
|---|---|---|---|
| 1. Opportunity Radar | **Extend** | `OpportunityIntelligence`, `OpportunityEvidenceAdapter`, Brain evidence and channel intelligence | Consolidate Content Opportunity Engine concepts into Opportunity Radar. Add only missing signal-source coverage, freshness/expiry, scoring provenance, and project handoff after inspecting current contracts. Radar discovers/scorers opportunities; it does not own final content concept selection. |
| 2. Content Architect | **Merge capability, not persistence** | Concept + Scene Studio, Script Architect, Brain context, Video Director inputs | Combine concept evaluation, brief, audience fit, and production requirements as one concept-to-blueprint flow. Reuse script/project models; do not introduce another script store or generic idea generator. |
| 3. Video Genome | **Validate first; likely compose** | Media Analyzer, analytics canon, existing video/content analysis | Inventory Media Analyzer's actual analysis outputs before creating a new engine. Add a structured, comparable pattern representation only if current outputs cannot support reuse across tools. |
| 4. Story Engine | **Merge** | Script Architect, Video Director storyboard, prompt compiler, generation contracts | Fold Story & Retention Architect functionality into the Story Engine capability within the existing script/production flow. Keep story graph, retention hypotheses, and production blueprint as typed outputs; avoid a competing script editor/store. |
| 5. Asset Forge | **Compose / extend** | Asset Engine/Vault, generation workflow, asset provenance, Thumbnail Studio, EndScreenTool | Make Asset Forge the planning/resolution workflow for production assets, not a second asset library or renderer. Route all asset creation, versions, and lineage through Asset Engine/Vault. |
| 6. Audience Pulse | **Merge** | Comment Responder, Community Posts, creator-engagement controllers/stores, AudienceEvidenceCollector, AudienceIntelligence | Consolidate audience signals and relationship actions under one capability while preserving specialized comment reply and community-post actions as modes/subtools. Avoid duplicate audience stores and separate signal miners. |
| 7. Content Autopilot | **Extend** | ContentBuild identity, published package/snapshot, post-publish analytics bridge, asset engine, project workflow | Add derivative/follow-up opportunity generation as a downstream workflow over existing published content. Reuse source video and ContentBuild lineage; don't duplicate publication history or become a second cross-tool strategy engine. |
| 8. Experiment Lab | **Compose / extend** | Analytics Canon, metric comparability, evidence, outcomes/evaluation, Brain evaluation loop | Add experiment assignment, hypothesis, baseline, variant exposure, and conclusion validity only where absent. Attribute outcomes to the exact exposed variant and preserve confounders/uncertainty. First locate and inspect any existing experiment services. |
| 9. Causal Intelligence | **Compose / extend** | Analytics Canon, Brain evidence, evaluation and attribution services | Add causal reasoning as an evidence-backed analysis workflow, not another analytics store. Separate correlation, hypothesis, causal evidence, alternative explanations, and confidence. Validate current attribution/evaluation coverage before implementation. |
| 10. Channel Simulator | **Validate first; add narrowly if missing** | Channel Intelligence, analytics canon, scenario-related strategy services if present | Search the whole branch for scenario/projection models before creating anything. If no adequate simulator exists, add a small assumptions-driven scenario capability with ranges and horizons, not a promise-generating forecast system. |
| 11. Revenue Architect | **Merge / extend** | Existing revenue/monetization tools and Brain/channel intelligence; verify exact runtime owners | Reconcile Revenue Opportunity Map into one Revenue Architect owner. Preserve existing monetization functions; add unit economics and scenario planning only after a code-level inventory of current revenue tools. |
| 12. Channel Flywheel | **Compose** | ChannelIntelligence, AlgorithmStrategyEngine, canonical analytics and outcome signals | Use a bottleneck diagnostic over the existing channel lifecycle data. Keep diagnosis separate from causal explanation and from the final strategic recommendation. Avoid another channel analytics engine. |
| 13. Creator Strategy Engine | **Merge / extend** | AlgorithmStrategyEngine, ChannelIntelligence, Brain orchestration/evaluation | Consolidate Creator Command Brain and cross-tool strategy into one prioritized decision owner. It synthesizes validated outputs; it must not replace the Brain's context/evidence/governance infrastructure or become a generic chatbot. |

## Existing tool consolidation boundaries

These are recommended ownership decisions, not authorization to delete source files without dependency tracing.

1. **Concept + Scene Studio + Script Architect + Video Director:** connect as a concept-to-story-to-production progression. Keep their specialized models and execution responsibilities; do not create a fourth parallel content/script system.
2. **Media Analyzer + Video Genome:** first establish whether Media Analyzer's analysis outputs can be normalized into reusable content patterns. Add a Video Genome adapter or capability before considering a separate page/service.
3. **Thumbnail Studio + End-Screen Architect/EndScreenTool:** potentially unify as visual packaging/asset planning while retaining distinct thumbnail and end-screen deliverables and validation.
4. **Comment Responder + Community Posts + Audience Pulse:** unify evidence and audience-intelligence ownership; preserve distinct actions and permission semantics.
5. **Pre-Launch Priming + Opportunity/Channel Intelligence:** map signal inputs and handoffs before merging. Do not erase a unique publishing-preparation workflow just because it shares data.
6. **Metadata Master + Publisher + Manager:** Metadata Master should remain a shared metadata capability/subtoolbox, not a competing publishing destination. Publisher owns unpublished publishing flow; Manager owns published-video management. Reuse `metadataMaster.ts` and operation provenance.
7. **All generation/asset flows:** reuse Operation identity, generation records, receipts, ContentBuild, and Asset Engine lineage. Do not add a parallel generic history/decision database.

## Priority order

### P0 — Establish truth and prevent duplicate architecture
- Build a source-backed runtime inventory of each existing tool, route, service, persisted model, feature flag, tests, and production consumer.
- For each planned tool, classify: complete, partial, disconnected, planned only, duplicate, or obsolete.
- Map all proposed features to existing service owners and contracts.
- Identify existing tests and actual missing coverage before writing replacement code.

### P1 — Complete shared lifecycle contracts
- Verify the same project/ContentBuild identity travels through concept, script, generation, asset selection, publish snapshot, published-video binding, analytics, evaluation, and Brain learning.
- Ensure operation IDs, receipts, provenance, and idempotency are reused.
- Record the exact selected/used variant rather than attributing outcomes to every generated variant.
- Keep observations, hypotheses, predictions, findings, and validated knowledge distinct.

### P2 — Deliver the highest-value integrated workflows
1. Opportunity Radar → Content Architect → Story Engine → existing production flow.
2. Existing production/assets → Publishing Package/Approved Publish Snapshot → publish → canonical analytics → evaluation/evidence → governed Brain learning.
3. Audience evidence → Audience Pulse actions → project/content follow-up.
4. Published content → Content Autopilot derivative opportunity → project/asset workflow.
5. Analytics/evaluation → Experiment Lab and Causal Intelligence → Channel Flywheel → Creator Strategy Engine.

### P3 — Add only proven capability gaps
- Video Genome reusable pattern normalization.
- Experiment assignment/exposure and validity checks.
- Causal evidence and alternative-explanation support.
- Scenario simulator with explicit assumptions and uncertainty.
- Revenue opportunity/unit-economics additions after current revenue-tool inventory.

### P4 — Consolidate implementation and verify
- Remove redundant code only after all call sites migrate and behavior has regression tests.
- Avoid broad file deletion or rename-only refactors.
- Run focused tests, relevant integration tests, typecheck/lint, and production build; report actual results and any blocked checks.
- Update the canonical architecture and recovery notes with the decisions and remaining gaps.

## Acceptance criteria

- Every canonical tool has one decisive outcome, one clear owner, and a known set of reused services.
- No new parallel Brain, analytics, asset, metadata, operation-history, project, or handoff system.
- Every consequential action can be traced to its inputs, operation, source tool, output, and resulting project/asset/version where applicable.
- Published outcomes remain linked to their originating ContentBuild and exact selected variant.
- New durable Brain knowledge follows the existing validation/governance path.
- Duplicate capabilities are merged only after unique behavior, consumers, and tests are accounted for.
- Every completion claim is backed by a file-level inspection or test result.

## Limitations and next audit required

This reconciliation is based on the canonical architecture documents and target-branch tree/source paths. It is not yet a full call-graph audit of every route, service implementation, persistence adapter, feature flag, or runtime user flow. In particular, exact current ownership for Revenue Architect, Channel Simulator, Experiment Lab, and Video Genome must be confirmed by searching all relevant source and tests before implementation or removal decisions are finalized.

**Safe next action:** perform the file-level consumer/call-site audit for P0 and convert each confirmed gap into a small implementation task with tests. Do not start by scaffolding all 13 tools.
