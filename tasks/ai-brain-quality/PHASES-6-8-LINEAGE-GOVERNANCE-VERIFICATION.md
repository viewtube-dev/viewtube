# Canonical Analytics → Brain Integration: Phases 6–8

**Date:** 2026-10-15  
**Branch:** `fix/brain-canonical-evidence-missingness-2026-10-15`  
**Parent plan:** [CANONICAL-ANALYTICS-BRAIN-INTEGRATION.md](./CANONICAL-ANALYTICS-BRAIN-INTEGRATION.md)  
**PR:** [#213](https://github.com/viewtube-dev/viewtube/pull/213)

## Phase 6 — recommendation → action → outcome → learning lineage

### Existing canonical lineage owners confirmed

- `AlgorithmIntelligenceEventLedger.ts` is the event identity/parent-link owner. Events carry channel, project/video scope, parent event IDs, recommendation/action-packet/workflow IDs, evidence IDs and evaluation targets.
- `AlgorithmEvaluationEngine.ts` emits a stable `algorithm-outcome:<source-event-id>` event with the source event as parent, retaining channel/project/video, recommendation identity and evidence IDs.
- `AlgorithmMonitoringSchedule.ts` explicitly records checkpoint lineage only; it does not fabricate measured outcomes or increase learning sample size.
- `AlgorithmAttributionDetail.ts` builds a signal → decision → execution → monitoring → outcome → learning timeline from parent links and stable attribution IDs.
- `AlgorithmLearningCandidates.ts` and `BrainEvaluationLoop.ts` are the governed learning/evaluation consumers. They remain the owners; this work does not create a parallel ledger.

### Phase-6 disposition

**Architecture inventory completed; end-to-end lineage certification remains open.** The event model has a viable algorithmic lineage spine, but the repository does not yet prove every creator decision, project/content-build, publish transaction, remote published-video identity, canonical analytics observation, evaluation, and promoted learning record joins through one stable identity. The missing proof is not papered over by assuming IDs are interchangeable.

Required acceptance proof still outstanding:
1. one stable recommendation/action identity preserved through the actual execution receipt;
2. project and ContentBuild identity preserved through approved publishing and remote video binding;
3. canonical analytics observation IDs and comparison context attached to outcome measurements;
4. idempotent retries do not duplicate outcomes or learning samples;
5. no direct model output can write durable/promoted knowledge without evidence-backed outcome and governed review;
6. a fixture/integration test traverses the entire chain and verifies every link.

## Phase 7 — capability evidence coverage governance

Implemented on this branch:
- Added `governance/convergence/capability-evidence-map.json` as the curated source for capability task/test/guide/verification references.
- Updated `scripts/governance/build-capability-coverage.mjs` to consume that map instead of hardcoding empty arrays.
- The generator fails closed if any mapped repository-path reference does not exist.
- Regenerated `governance/convergence/capability-coverage.json`.
- Mapped references for Creator Context, Evidence & Intelligence, Brain Runtime Experience and Canonical Analytics Evidence. Outcome Learning has tasks/guides/verification references but correctly remains incomplete because a specific test reference has not yet been established. Other capabilities remain incomplete rather than being assigned invented evidence.

Verification is pending for the new generator change until CI runs on the latest branch head. The checked-in report was regenerated from the same data/coverage rules as the generator.

## Phase 8 — production surface audit and release certification

### Caller audit

- `src/components/SidebarChatbot.tsx` and `src/views/dashboard/widgets/BrainHubWidget.tsx` are known production surfaces.
- `BrainRuntimeSurfaceMigration.test.ts` and `BrainConversationArchitectureGuard.test.ts` provide source-level architecture guards for the canonical `runBrainTask → BrainRuntime → BrainOrchestrator` path and prevent direct `runBrainTurn` calls from the surfaces.
- BrainHubWidget passes channel/project identity, ContentBuild ID, bounded visible context and artifact references into `runBrainTask`. Runtime then delegates to the orchestrator and canonical Creator Context / evidence resolution.
- The UI surfaces still construct their display snapshot and system-prompt additions. This is not a second analytics store, but it is a remaining context-assembly convergence boundary; do not claim a single fully shared surface envelope yet.

### Latest observed release-gate run before the Phase 7 commits

Run [38693153891](https://github.com/viewtube-dev/viewtube/actions/runs/38693153891) tested an earlier branch head and completed with **failure**:
- Passed: production build, focused contracts, source governance, local smoke.
- Failed: `npm run typecheck` with TypeScript errors in unrelated/current integration surfaces (superToolViewRegistry, CommentResponder, StudioHubCompletePrimitiveCatalog, SubToolboxCompoundPrimitives, PanelBodies, ProjectVideoPackageBridge, VideoPackageRepository test typing, StudioHubCertification).
- Full suite failed on at least two stale source-contract expectations: mobile widget CSS expecting `max-width: 46%` and VideoManagerWidget expecting `<WidgetSplitButton` while current source uses different layout/primitives.
- Runtime lint was skipped because typecheck failed.

Those failures are real release blockers, but the available logs do not establish that they were introduced by this analytics/Brain change. Do not merge or mark the work release-certified until the latest head is checked and the failures are triaged against the base branch.

### Phase-8 exit criteria

- [x] Confirm the main creator-facing Brain surfaces route through the canonical runtime facade.
- [x] Identify the remaining surface-owned prompt/snapshot composition boundary.
- [x] Record exact observed CI failures without attributing them to this change without proof.
- [ ] Latest-head focused integration tests pass.
- [ ] Latest-head typecheck passes.
- [ ] Latest-head runtime lint passes.
- [ ] Latest-head full suite passes or documented baseline failures are proven unchanged on the base branch.
- [ ] Latest-head local smoke passes.
- [ ] Production deployment is tied to the verified merged SHA (not a branch build or prior deployment).

## Overall status

Phases 0–5 are implemented, subject to release verification. Phase 7's generator/report change is implemented but CI validation is pending. Phase 6 is inventoried but not end-to-end certified. Phase 8's surface audit is complete, but release certification is **blocked** until the latest branch's gates pass or existing base-branch failures are independently established. No merge or deployment is claimed.
