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


## 7. File-level source audit — confirmed implementation details

This pass inspected the architecture and selected service/component implementations directly. These are source-backed findings, not claims that the whole application has been executed.

### Existing foundations to retain

| Capability | Confirmed source | Finding | Integration decision |
|---|---|---|---|
| Opportunity evidence normalization | `src/services/brain/OpportunityIntelligence.ts`, `OpportunityEvidenceAdapter.ts` | Opportunities already map to both `DerivedSignal` and `AlgorithmSignal`; adapters consume Brain evidence packs and Analytics Canon bundles, retain evidence IDs, reporting window, snapshot and dataset status. | Extend this path; do not add a second opportunity or analytics store. |
| Brain evidence quality and epistemic state | `src/services/brain/BrainEvidenceContract.ts` | A read-only claim projection already tracks scope, freshness, confidence, provenance, missingness and conflicts. | Reuse it for every tool's evidence/decision contract; don't create another generic claim schema. |
| Project-to-production continuity | `src/services/asset-engine/ProjectContentBuildBridge.ts` | Project data maps into a ContentBuild profile and lifecycle stage, with profile/stage changes synchronized into the repository. | Make ContentBuild the shared project-production identity; avoid tool-specific project mirrors. |
| Content build history, variants and published-video binding | `src/services/asset-engine/ContentBuildRepository.ts` | Repository APIs cover events, metadata history, asset relations/versions, variant groups/selections and binding a YouTube video. | Extend the existing lifecycle and audit trail; don't add a parallel package-history database. |
| Analytics contracts | `src/services/analytics-canon/contracts.ts` | Canonical dataset status, coverage, source and evidence bundle types already exist. | Use Analytics Canon as the common measured-data boundary. |
| Script authoring and Brain integration | `src/features/script-architect/useScriptArchitect.ts`, `src/features/script-architect/scriptBrainRuntime.ts`, `scriptProjectStore.ts` | Script Architect already uses Brain task requests, project storage, import/export, quality/budget helpers and ContentBuild tool context. | Integrate concept and story stages into this workflow rather than creating another script editor or store. |
| Video generation contracts | `src/features/video-director/generationContracts.ts` plus Video Director provider/project modules | Typed generation requests, provider jobs, preflight issues, cost estimates and idempotency-key support are present. | Asset Forge should orchestrate these contracts and Asset Engine provenance rather than reimplement generation. |
| Metadata package lifecycle | `src/services/metadataMaster.ts` | Metadata packages already support strategy, variants, scoring, validation, finalization, local persistence and handoff payloads. | Keep Metadata Master a shared capability used by Publisher and Manager, not a competing tool destination. |
| Audience/community actions | `src/features/creator-engagement/useCommentResponderController.ts`, `useCommunityPostController.ts`, `communityPostStore.ts`, plus their component entry points | Dedicated controller/store boundaries exist for distinct response and community-post actions. | Share audience evidence and learning; preserve separate action flows and their own persistence/confirmation behavior. |

### Concrete gaps and risks to verify or fix before adding tools

1. **Opportunity classification is currently broader than the evidence proves.** Both adapters emit `kind: "catalog_gap"` for every eligible measured video. The score uses relative views, recency and metric coverage; it does not itself compare against a content taxonomy, demand signal, peer baseline or explicit catalog coverage. That is a useful *catalog performance candidate* ranking, but it is not sufficient by itself to claim a content gap or emerging demand. Rename/reclassify only with compatibility checks, or add a distinct evidence-backed candidate type and a test proving the stronger claim.
2. **Opportunity baselines are not populated in the inspected adapters.** They currently emit `baselineValue: null` and `relativeDelta: null`. Do not present their rank as measured growth or a trend. A future trend opportunity must require a comparable baseline/window and preserve the comparison contract.
3. **Confidence scales need a boundary check.** Opportunity evidence uses integer 0–100 confidence, while `BrainEvidenceContract` clamps its claim confidence to 0–1. Any handoff between these contracts needs an explicit conversion and tests; do not pass the numeric value through unchanged.
4. **Workflow recipes are a partial handoff map, not the canonical 13-tool orchestration.** `src/services/brain/BrainWorkflowRecipes.ts` contains five recipes with legacy/source tool IDs (audience signal → idea, idea → packaging, retention → revision, vault → editor, shorts → editor). Reconcile these IDs and transitions against the actual registered tool IDs/routes before expanding the recipe set. Keep existing handoffs working while introducing aliases or migrations.
5. **Metadata Master currently has browser-local persistence in the inspected implementation.** `saveMetadataMasterPackage` and `listMetadataMasterPackages` use `window.localStorage`. Before treating packages as portable project records, verify synchronization/backup and the intended persistence owner; bridge to ContentBuild/project persistence only if the current storage contract does not already cover that need.
6. **Component wrappers are not separate implementations.** `src/components/MediaAnalyzer.tsx` is a compatibility export of `src/views/MediaAnalyzer`. Avoid counting or replacing wrappers as independent tools; trace route imports and all consumers first.

### Revised execution order

**P0-A — Registry and call-site inventory (read-only).** For each canonical tool, record: registered tool ID, route/page, primary component, service/controller, storage owner, upstream/downstream handoffs, feature flags, tests, and evidence contract. Search for legacy IDs in `BrainWorkflowRecipes` and tool registration before changing any IDs. Mark each item `implemented`, `partial`, `disconnected`, `planned`, `duplicate`, or `obsolete`, with file/line evidence.

**P0-B — Evidence correctness first.** Add or strengthen tests for opportunity classification, missing baseline, channel/snapshot/window scope, partial/unavailable datasets, freshness and confidence conversion. Separate a ranked *candidate* from a validated *opportunity*. Do not add UI work.

**P1 — One lifecycle and handoff contract.** Ensure Concept/Script/Video Director actions preserve project and ContentBuild IDs, operation/generation identity, source evidence IDs, selected variant, and provenance through approved publish snapshot → published video binding → Analytics Canon → evaluation/outcome → Brain evidence. Extend existing contracts only where the call-site audit demonstrates a missing field or broken edge.

**P2 — Connect workflows already represented in code.** Wire existing workflow recipes to the actual registered tool IDs and confirm both producer and receiver consume the same handoff payload. Add round-trip/compatibility tests. Avoid adding recipes that merely duplicate an existing transition under another name.

**P3 — Add only verified missing engines.** Video Genome normalization, explicit experiment exposure/assignment, causal evidence grading, scenario simulation, and revenue planning remain candidates, not assumed absences. Search all services, routes, tests, and docs before creating each.

**P4 — Consolidate after consumer migration.** Remove obsolete code only when repository-wide consumer search is clean and replacement behavior is covered by tests. Do not delete compatibility exports, stores, or legacy IDs solely because a newer architecture document names a canonical tool.

### Verification status

- Source inspection completed for the files listed above.
- No application code changed in this pass.
- No local build, typecheck, or test suite was run through this GitHub-only inspection path.
- The next implementation should begin with the opportunity evidence classification/confidence tests and the registry/call-site inventory, not a new tool scaffold.


## 8. Runtime registry and handoff audit — additional verified findings

### Two registries represent different tool universes

The repository has at least two distinct runtime inventories, and they should not be flattened into one list without a migration plan:

- `src/services/superToolRegistry.ts` defines SuperTool IDs such as `creator-canvas-os`, `audience-loop-studio`, `packaging-lab-pro`, `project-command-kanban`, `cinematic-analytics-lab`, and `retention-autopsy-experiment-engine`.
- `src/services/viewTubeToolChains.ts` separately defines operational capabilities such as `video-manager`, `video-publisher`, `metadata-master`, `content-analysis`, `thumbnail-studio`, `community-posts`, `comment-responder`, `project-calendar`, `storyboard-studio`, `vault`, `video-editor`, and `ai-brain`.

These lists have different purposes: SuperTools are larger work surfaces, while tool-chain capabilities describe payload acceptance, production handoffs, and mutation boundaries. Do not replace one registry with the other. The missing integration is an explicit, tested mapping between canonical Studio Hub capabilities and the existing surface/capability IDs.

### Existing handoff architecture is stronger than the current recipe coverage

- `src/services/brain/BrainSuperToolBridge.ts` validates source and destination IDs against the SuperTool registry, creates a canonical SuperTool action packet, carries evidence IDs, and emits a Brain signal.
- `src/services/viewTubeToolChains.ts` defines typed action packets with workflow/operation IDs, evidence, provenance, approved snapshot identity, prompt recipe identity, explicit intent and approval state. Persistence also creates generation records and queues Brain handoffs.
- `src/services/productionHandoffContracts.ts` validates destination payload compatibility, required context, snapshot hashes, prompt recipe version pairing, and creator approval/idempotency requirements for external writes.

The highest-value next change is to test and connect these contracts at the boundary, not create a third handoff format. Specifically, each recipe needs to prove that the destination capability exists, accepts the payload, and retains project/content-build/evidence/operation identity. Existing tests cover parts of the contracts but the inspected recipe file itself defines five handoffs and does not show a direct mapping to the 13 proposed product tools.

### Reachability checks exist; product-tool coverage checks do not yet establish equivalence

`src/app/__tests__/superToolViewRegistry.test.ts` already checks that mountable IDs have views, names, route reality, and no stale internalTool address. This is useful reachability governance. It does not prove that every canonical product capability is implemented, or that a proposed tool is backed by a production service rather than a prototype. Reuse this test family and add a capability mapping/coverage contract instead of building a second registry test harness.

### Implementation priorities sharpened

1. Add a **canonical capability-to-runtime mapping** (data-only mapping, no new tool runtime) connecting the 13 proposed product capabilities to existing SuperTool surfaces, operational capabilities, canonical services, and owning lifecycle stages. Every entry should state whether the capability is native, composed, partial, or genuinely missing.
2. Add **recipe contract tests** across both handoff systems. Reject nonexistent destinations, incompatible payload kinds, missing evidence/project identity where required, and unapproved external writes. Keep compatibility aliases for legacy IDs until consumer migration is proven.
3. Fix the **opportunity evidence claim boundary** with an additive, compatibility-aware classification contract and tests. Until a comparable baseline or explicit taxonomy/demand evidence exists, output must be described as a measured performance candidate, not a validated catalog gap or growth trend. Preserve channel, snapshot, selected window, dataset status, and source evidence references.
4. Only after these contracts are verified should tool-specific gaps be implemented.

### Scope and verification note

This remains a source-backed design/integration audit. The GitHub API inspection path did not provide a checked-out working tree, so no application test command has been executed and no runtime behavior is being claimed as verified. The next code change should be made in a local or connected repository workspace where the focused Vitest tests and typecheck can be run before commit.


## Follow-up source audit — handoff integrity and evidence semantics (2026-10-17)

This follow-up inspected the actual implementations on the target branch, rather than inferring readiness from filenames or route labels.

### 1. Brain workflow recipes: registry validity is only the first gate

`src/services/brain/BrainWorkflowRecipes.ts` currently declares these five handoffs:

| Recipe | Source SuperTool | Destination SuperTool | Payload | Integration check |
|---|---|---|---|---|
| Audience signal → idea | `audience-loop-studio` | `creator-canvas-os` | audienceSignal | Verify the concept receiver can consume the signal as structured input and retains evidence IDs. |
| Idea → packaging | `creator-canvas-os` | `packaging-lab-pro` | concept, hook | Verify package generation uses the same project/ContentBuild identity and the selected concept. |
| Retention → project revision | `retention-autopsy-experiment-engine` | `project-command-kanban` | diagnosis, recommendedChanges | Verify recommendations become project tasks and any proposed experiment remains a proposal until approved. |
| Vault → editor | `creator-vault-os` | `timeline-asset-vault-dock` | assetIds, sceneIntent | Verify asset IDs resolve against canonical Vault records and editor usage records lineage. |
| Shorts → editor | `shorts-extraction-studio` | `motion-scene-builder` | clipIds, editBrief | Verify clips resolve to real source media and the destination hands off to VT_E1 rather than inventing a second editor state. |

All ten source/destination IDs are present in the SuperTool registry. That is necessary but insufficient: `createBrainSuperToolHandoff` confirms both IDs exist, then creates a SuperTool action packet and emits a Brain signal. It does not itself validate the domain-specific payload against the destination's capability schema. Destination validation and external-write safeguards therefore must remain in the production handoff/receiver contracts.

**Implementation rule:** retain these recipes as orchestration adapters, but add receiver-level contract tests for payload shape, canonical identity, evidence preservation, destination compatibility, and approval semantics. Do not add another handoff format.

### 2. Opportunity evidence: current type and meaning are misaligned

`OpportunityEvidenceAdapter.ts` emits `kind: "catalog_gap"` for every eligible measured video from both the Brain evidence-pack and Analytics Canon adapters. Both adapters can provide current metric values, coverage, source evidence IDs, and (for canonical rows) snapshot/window/dataset provenance. Neither inspected adapter establishes a comparable baseline or explicit topic-demand/catalog-taxonomy coverage; both emit `baselineValue: null` and `relativeDelta: null`.

The existing `OpportunityIntelligence.ts` maps `catalog_gap` to the generic `unknown` AlgorithmSignal kind, which avoids falsely claiming a known algorithm event but does not correct the upstream label. Existing tests explicitly expect `catalog_gap`, so changing the label is a compatibility change, not a harmless rename.

**Implementation rule:** add tests for the semantic boundary before changing the union or serialized values. A measured video candidate may be ranked by observed performance/recency/metric coverage, but must not be represented as a validated content gap or measured trend without the missing comparison evidence. Preserve old persisted records and add a deliberate compatibility mapping if the kind is migrated. Confidence values also need one explicit conversion boundary: Opportunity Intelligence uses a 0–100 scale while Brain claim projections use 0–1.

### 3. Tool-chain registry: distinguish registered capability from proven end-to-end behavior

`src/services/viewTubeToolChains.ts` defines payload kinds, capability IDs, routes, mutation classes, approval states, packet identity, and suggested chains. It is a different layer from `superToolRegistry.ts`: SuperTools describe larger product/work surfaces; tool-chain capabilities describe what payloads a workflow node accepts/produces and how it may mutate state. Keep both layers and connect them through explicit mappings/contracts rather than replacing one registry with the other.

Suggested chains cover metadata-to-publish, thumbnail-to-publish, generated-image-to-community-poll, script-to-production, analysis-to-packaging, comment-to-content, video-to-next-video, tactic-to-experiment, and asset-to-editor. Treat these as proposed workflow paths until each step is verified against live producer/receiver behavior and shared operation identity.

### 4. Portability defect to trace before editing

`src/services/superToolRuntimePlanRegistry.ts` hardcodes `/Users/cwb/Downloads/viewtube/viewtubeX/docs/VT Brain` and emits `file://` links through `buildSuperToolDocHref`. This cannot resolve on other developer machines or deployed clients. Before replacing it, trace every consumer and the intended runtime (browser, local app, or documentation viewer); then choose repository-relative/hosted links appropriate to that runtime and test links for missing targets. Do not blindly replace the base with another machine path.

### 5. Test and execution status

The repository's `package.json` identifies Vitest, `npm run typecheck`, and `npm run build` as available validation commands. This audit was performed through GitHub source APIs without a checked-out working tree or package installation, so no test, typecheck, build, or browser workflow has been executed in this phase. Do not treat the existence of test files or a source review as a passing validation result.

### Next execution sequence

1. Add focused tests for opportunity semantics, missing baselines, channel/snapshot/window scope, partial/unavailable datasets, and 0–100 ↔ 0–1 confidence conversion.
2. Add Brain recipe receiver contract tests that prove IDs, payload schemas, evidence, project/ContentBuild identity, idempotency, and approval requirements survive each handoff.
3. Build the canonical Studio Hub capability → SuperTool surface → tool-chain capability → service/controller → persistence owner map. Mark each edge as verified, partial, disconnected, or planned.
4. Fix the absolute documentation path only after consumer/runtime tracing and tests.
5. Run the focused suites, then typecheck, full Vitest suite, and production build in an actual checkout. Remove or merge code only after consumer search and replacement tests demonstrate parity.


## Implementation follow-through — opportunity semantics (2026-10-17)

A first application-code correction has now been committed on `master/consolidated-feature-integration`:

- `adecd066a3667a27eb7f0658bef0b5b9ac4a1037` — add `performance_candidate` to the opportunity kind contract and keep its algorithm-signal projection conservative (`unknown`), alongside the legacy `catalog_gap` value for compatibility.
- `c64cfa078187b3ff17906b9d0b91a3d79fab7919` — both Brain-pack and Analytics Canon adapters now label newly derived metric-ranked rows `performance_candidate`, not `catalog_gap`.
- `08a8a6cfef0892cf10091b917500a6dd03b1fe48` — adapter tests now assert the new kind and explicitly assert that missing baselines and relative deltas remain null.

This is intentionally a narrow, compatibility-aware correction. It does not claim that relative in-sample scores are a content gap, a growth trend, or a causal finding. Existing persisted `catalog_gap` values remain representable; a separate migration should only be considered after the actual persistence and downstream consumer paths are enumerated.

**Validation status:** source changes and test assertions were committed through the GitHub Contents API. The test suite, typecheck, and build have not been executed in a checked-out runtime, so these commits are not yet described as verified. The GitHub code-search index still returns a stale commit for some searches; branch-ref file fetches and the branch commit list are the source of truth for this update.

### Next application phase

1. Validate the focused opportunity adapter tests, then typecheck to catch exhaustive-switch/type consumers.
2. Add contract coverage for confidence normalization between the 0–100 opportunity scale and the 0–1 Brain claim scale; do not silently reinterpret one as the other.
3. Add producer/receiver contract tests for the five Brain recipes and verify canonical asset/video/project IDs, evidence IDs, workflow/operation identity, and approval requirements.
4. Trace the runtime consumers of `buildSuperToolDocHref`; replace the machine-specific `file://` base with a portable documentation target only after choosing the correct browser/deployed destination.
