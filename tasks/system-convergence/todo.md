# System Convergence — To Do

**Created:** 2026-09-26  
**Last edited:** 2026-09-26

## Foundation

- [x] Create convergence master architecture.
- [x] Define six canonical target systems.
- [x] Define KEEP / MERGE / PROJECT / ADAPTER / PAIR / QUARANTINE / REMOVE vocabulary.
- [x] Establish donor-harvest-before-removal rule.
- [ ] Complete production caller inventory for every classified subsystem.
- [ ] Add exact current-main SHA and reachability evidence to every classification row.
- [ ] Identify duplicate persistent stores separately from duplicate APIs.

## Creator Context & Knowledge

- [x] Inventory ChannelProfileAdapter callers.
- [x] Inventory ChannelKnowledgeProjection callers.
- [x] Inventory StyleProfile callers.
- [x] Inventory BrainMemoryClaims/NicheKnowledge callers.
- [x] Inventory BrainProjectContext callers.
- [x] Inventory BrainSurfaceContext/Selection callers.
- [x] Define CreatorContextEnvelope.
- [x] Implement read-only CreatorContextResolver.
- [x] Add channel-scope/privacy tests.
- [ ] Add project/no-project tests.
- [x] Add personalization-disabled tests.
- [x] Migrate BrainContextBroker.
- [ ] Migrate SidebarChatbot context assembly.
- [ ] Migrate BrainHubWidget context assembly.
- [ ] Classify now-redundant adapter behavior.

## Evidence & Intelligence

- [x] Inventory all analytics-canon consumers in Brain.
- [x] Implement unified EvidenceRecord projection. Contract: `tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md`.
- [x] Map BrainAnalyticsEvidence.
- [x] Map BrainStatisticsBridge.
- [x] Map BrainAudienceBridge.
- [x] Map AudienceEvidenceCollector.
- [x] Map AnomalySignalBridge.
- [x] Map OpportunityEvidenceAdapter.
- [x] Preserve Statistics/Audience/Channel/Opportunity specialists.
- [ ] Audit Algorithm Intelligence helper/ledger sprawl.
- [x] Add metric comparability guard.
- [ ] Certify evidence IDs end-to-end.

## Project / Content / Asset Graph

- [ ] Inventory Project↔ContentBuild identity writes.
- [ ] Inventory VideoPackage mutable fields.
- [ ] Inventory PublishingPackage mutable fields.
- [ ] Identify fields that can become projections.
- [ ] Define one-write-owner matrix.
- [ ] Reduce VideoPackageContentBuildBridge responsibilities.
- [ ] Reduce ProjectVideoPackageBridge responsibilities.
- [ ] Define Asset Engine/Vault shared asset identity contract.
- [ ] Certify version/variant lineage across Project/Vault/Editor/Publisher.

## Creator Operations

- [ ] Inventory AssetGenerator production callers.
- [ ] Inventory GenerationWorkflow production callers.
- [ ] Inventory ActionPacket/ToolReceipt/GenerationRecord overlap.
- [x] Define OperationRecord v1 contract and lifecycle projection. — `src/services/operations/OperationRecord.ts`; implementation/tests in the OperationRecord v1 next-plan branch.
- [ ] Map BrainTrace onto operation lineage.
- [ ] Define media-provider operation contract.
- [x] Define approval/undo/irreversibility metadata in the shared contract.
- [x] Add operation idempotency-key and lifecycle-gate tests.
- [ ] Verify current-head focused CI/typecheck.
- [ ] Certify one ActionPacket → GenerationWorkflow → ToolReceipt → BrainTrace → publish/outcome pilot.
- [ ] Execute the server-authoritative persistence plan only after the backend/auth owner is confirmed.
- [ ] Follow `tasks/system-convergence/OPERATION-RECORD-V1-NEXT-PLAN.md` for phase gates.

## Outcomes / Evaluation / Learning

- [ ] Inventory BrainOutcomeLedger writers/readers.
- [ ] Inventory algorithm ledgers and observations.
- [ ] Inventory assetOutcomes producers.
- [ ] Inventory publish/project/editor/community outcomes.
- [ ] Define shared producer identity contract.
- [ ] Define idempotency keys.
- [ ] Build coverage matrix.
- [ ] Preserve specialist evaluators.
- [ ] Preserve governed learning promotion.
- [ ] Prove no direct model→durable-knowledge write.

## Brain Runtime & Experience

- [ ] Inventory all creator-facing AI surfaces.
- [ ] Confirm every reasoning call uses BrainRuntime.
- [ ] Confirm every model call uses BrainModelGateway/governed generator or documented media gateway.
- [ ] Unify conversation/context envelope across Sidebar/Brain Hub/Studio/Widgets/Editor.
- [ ] Create widget intelligence/context adapter.
- [ ] Complete Editor typed proposal integration.
- [ ] Complete Studio Hub operation handoff integration.

## Legacy donor harvest

- [ ] Inventory all production `gemini.ts` imports/calls.
- [ ] Separate provider helpers from creator-generation behavior.
- [ ] Harvest prompt rules.
- [ ] Harvest schemas.
- [ ] Harvest validation/error behavior.
- [ ] Harvest tests/fixtures.
- [ ] Harvest useful UI behavior.
- [ ] Migrate family-by-family.
- [ ] Quarantine only after zero production reachability.

## Certification

- [ ] No duplicate canonical owner.
- [ ] No duplicate writable package field.
- [ ] No direct analytics truth bypass.
- [ ] No direct creator-reasoning provider bypass.
- [ ] No untraceable consequential generation.
- [ ] No outcome producer without identity/idempotency contract.
- [ ] No promoted learning without evidence/outcome provenance.
- [ ] All quarantined paths have successor and donor-harvest receipts.
- [ ] Fresh reachability audit passes before removal.

## Creator Context first runtime seam — 2026-09-26

- [x] Migrate BrainOrchestrator Channel Knowledge read through CreatorContextResolver.
- [x] Migrate BrainOrchestrator bounded algorithm Project context through CreatorContextResolver.
- [x] Preserve existing canonical stores; no new persistence introduced.
- [x] Prove RED→GREEN architecture tests in CI.
- [x] Replace visibleContext-derived Project details with canonical Project + ContentBuild resolution.
- [ ] Add explicit no-project and canonical-ContentBuild resolver fixtures.


## Evidence & Intelligence first runtime seam — 2026-09-27

- [x] Complete runtime caller classification for BrainStatisticsBridge, BrainAudienceBridge, BrainAnalyticsEvidence, AudienceEvidenceCollector, AnomalySignalBridge and OpportunityEvidenceAdapter.
- [x] Add `EvidenceIntelligenceResolver` as a read-only runtime projection facade.
- [x] Prove resolver RED contract before implementation.
- [x] Route one canonical analytics snapshot to evidence quality, Statistics Intelligence and optional Audience Intelligence.
- [x] Route Opportunity evidence through the same Brain runtime facade while preserving its deterministic builder.
- [x] Verify BrainOrchestrator migration GREEN in CI.
- [ ] Prove BrainStatisticsBridge and BrainAudienceBridge have zero production callers after merge.
- [ ] Donor-harvest BrainAnalyticsEvidence evidence-explanation behavior before quarantine decision.
- [x] Define the broader `EvidenceRecord / DerivedSignal` cross-domain contract.
- [x] Add metric-comparability guard before cross-window/cross-population comparisons.


## Evaluation comparability seam — 2026-09-27

- [x] Promote MetricComparabilityPolicy into `analytics-canon` while preserving the legacy import path as a compatibility re-export.
- [x] Add metric-key mismatch protection to the canonical policy.
- [x] Project analytics evidence into typed `EvidenceRecord[]` from the same canonical snapshot used by Brain evidence intelligence.
- [x] Normalize Anomaly and Opportunity evidence through shared `DerivedSignal` contracts.
- [x] Carry source-field unit/aggregation/entity/format/window/availability metadata into canonical Algorithm observations.
- [x] Carry canonical baseline comparison context into evaluation targets without overwriting explicit baseline values.
- [x] Reject semantically incompatible canonical baseline/current comparisons before relative-change calculation.
- [x] Preserve legacy/lifecycle evaluation behavior until those baseline producers gain typed comparison contexts.
- [x] Prove 7/7 AlgorithmEvaluationEngine tests and 6/6 CanonicalAlgorithmEvaluation tests GREEN.
- [ ] Extend comparability to experiment and data-visual consumers (VT-024).

## OperationRecord v1 — Phase 2 identity bridge slice (2026-10-15)
- [x] Add optional `operationId` / `workflowId` fields to `GenerationRecord` without breaking legacy records.
- [x] Populate those fields for ActionPacket-backed generation records.
- [x] Carry one operation/workflow pair through GenerationWorkflow requests, ToolReceipts, OperationRecord projections, and ContentBuild input/output event metadata.
- [x] Allow canonical Asset Engine context to pass operation identity into created assets, generated records, and ActionPacket handoffs.
- [x] Expose explicit operation/workflow mismatches in BrainRuntime provenance; suppress workflow-based outcome joins when explicit identity conflicts exist.
- [x] Add focused regression assertions for identity continuity and mismatch detection.
- [ ] Thread operation identity from every live producer into AssetEngine and AssetGenerator, including existing generation/variant callsites.
- [ ] Add full parity tests for legacy receipts, missing identity fields, retry/replay and cross-channel isolation.
- [ ] Execute exact-head GenerationWorkflow, OperationRecord, BrainRuntimeSnapshot and full release-gate tests before marking Phase 2 complete.

