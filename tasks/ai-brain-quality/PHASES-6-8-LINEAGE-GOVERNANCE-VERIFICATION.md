# Canonical Analytics → Brain Integration: Phases 6–8

**Date:** 2026-10-15  
**Branch:** `feat/brain-evidence-phases-6-8-2026-10-15`  
**Parent plan:** [CANONICAL-ANALYTICS-BRAIN-INTEGRATION.md](./CANONICAL-ANALYTICS-BRAIN-INTEGRATION.md)

## Phase 6 — recommendation → action → outcome → learning lineage

### Existing canonical lineage owners confirmed
- `AlgorithmIntelligenceEventLedger.ts` is the event identity/parent-link owner. Events carry channel, project/video scope, parent event IDs, recommendation/action-packet/workflow IDs, evidence IDs and evaluation targets.
- `AlgorithmEvaluationEngine.ts` emits a stable `algorithm-outcome:<source-event-id>` event with the source event as parent, retaining channel/project/video, recommendation identity and evidence IDs.
- `AlgorithmMonitoringSchedule.ts` explicitly records checkpoint lineage only; it does not fabricate measured outcomes or increase learning sample size.
- `AlgorithmAttributionDetail.ts` builds a signal → decision → execution → monitoring → outcome → learning timeline from parent links and stable attribution IDs.
- `AlgorithmLearningCandidates.ts` and `BrainEvaluationLoop.ts` are the governed learning/evaluation consumers. These remain the owners; no parallel ledger is introduced.

### Phase-6 disposition
**Architecture inventory completed; end-to-end lineage certification remains open.** The repository has an algorithmic lineage spine, but this work does not prove that every creator decision, project/ContentBuild, publish transaction, remote video identity, canonical analytics observation, evaluation and promoted learning record joins through one stable identity.

Acceptance proof still required:
1. stable recommendation/action identity through actual execution receipt;
2. project and ContentBuild identity through approved publishing and remote video binding;
3. canonical analytics observation IDs and comparison context on measured outcomes;
4. idempotent retries do not duplicate outcomes or learning samples;
5. no direct model output can write promoted knowledge without evidence-backed outcome and governed review;
6. an integration fixture traverses the full chain and verifies each link.

## Phase 7 — capability evidence coverage governance

Implemented in this branch:
- Added `governance/convergence/capability-evidence-map.json` as the curated source for task/test/guide/verification references.
- Updated `scripts/governance/build-capability-coverage.mjs` to consume the map rather than hardcoding empty arrays.
- The generator fails if a mapped repository-path reference does not exist.
- Regenerated `governance/convergence/capability-coverage.json`.
- References are mapped for Creator Context, Evidence & Intelligence, Brain Runtime Experience and Canonical Analytics Evidence. Outcome Learning remains incomplete because a dedicated test reference has not been established. Other capabilities remain incomplete rather than being assigned invented evidence.

CI verification of the new generator/report is pending on this branch.

## Phase 8 — production surface audit and release certification

### Caller audit
- `src/components/SidebarChatbot.tsx` and `src/views/dashboard/widgets/BrainHubWidget.tsx` are production surfaces.
- `BrainRuntimeSurfaceMigration.test.ts` and `BrainConversationArchitectureGuard.test.ts` guard the canonical `runBrainTask → BrainRuntime → BrainOrchestrator` path and reject direct `runBrainTurn` calls from those surfaces.
- BrainHubWidget passes channel/project identity, ContentBuild ID, bounded visible context and artifact references into `runBrainTask`; the runtime delegates to orchestrator and canonical Creator Context/evidence resolution.
- The UI surfaces still construct display snapshots and prompt additions. That is a remaining context-assembly convergence boundary; do not claim a fully shared surface envelope.

### Previous observed release-gate result
Run [38693153891](https://github.com/viewtube-dev/viewtube/actions/runs/38693153891) tested an earlier head:
- Passed: production build, focused contracts, source governance, local smoke.
- Failed: `npm run typecheck` with TypeScript errors in superToolViewRegistry, CommentResponder, StudioHubCompletePrimitiveCatalog, SubToolboxCompoundPrimitives, PanelBodies, ProjectVideoPackageBridge, VideoPackageRepository test typing, and StudioHubCertification.
- Full suite failed on source-contract expectations for mobile CSS (`max-width: 46%`) and VideoManagerWidget (`<WidgetSplitButton`) that do not match current source.
- Runtime lint was skipped after typecheck failed.

These are real release blockers, but that run does not establish they were introduced by the analytics/Brain changes. Do not merge or mark release-certified until the latest head is checked and failures are triaged against the base branch.

### Phase-8 exit criteria
- [x] Confirm main creator-facing Brain surfaces route through the canonical runtime facade.
- [x] Identify the remaining surface-owned prompt/snapshot composition boundary.
- [x] Record exact observed CI failures without attributing them without proof.
- [ ] Latest-head focused integration tests pass.
- [ ] Latest-head typecheck passes.
- [ ] Latest-head runtime lint passes.
- [ ] Latest-head full suite passes or baseline failures are proven unchanged.
- [ ] Latest-head local smoke passes.
- [ ] Production deployment is tied to the verified merged SHA.

## Overall status

Phase 6 is inventoried but not end-to-end certified. Phase 7's generator/report change is implemented but awaits CI. Phase 8's surface audit is complete, but release certification remains blocked until latest-head gates pass or baseline failures are independently established. No merge or deployment is claimed.
