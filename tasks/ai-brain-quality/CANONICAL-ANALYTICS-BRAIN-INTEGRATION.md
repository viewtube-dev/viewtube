# Canonical Analytics Evidence → Brain Runtime Integration

**Status:** Phases 0–5 implemented on the work branch; release verification pending  
**Owner:** BrainRuntime + analytics-canon  
**Branch:** `fix/brain-canonical-evidence-phases-3-5-2026-10-15`  
**Pull request:** [#215](https://github.com/viewtube-dev/viewtube/pull/215)  
**Authority:** `docs/domains/BRAIN.md` and `docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md`  
**Contract:** `tasks/ai-brain-quality/SPEC-evidence-contract.md`

## Goal

Make Brain's analytics-backed reasoning consume the canonical analytics boundary and preserve evidence scope, requested reporting window, source snapshot, freshness, missingness, comparability, and measured-versus-derived status. Do not introduce a second analytics store or let unavailable metrics become numeric zeroes.

## Phase 0 — baseline and requirements-to-implementation matrix

Baseline branch: `master/consolidated-feature-integration`. Work is isolated on the branch above; no direct edits to `main` or the integration branch.

| Requirement | Existing owner / implementation | Baseline finding | Phase 0 disposition |
|---|---|---|---|
| Raw acquisition and freshness | VT-SYNC; `src/features/vt-sync-local/**` | Canonical owner exists | Reuse; do not add another ingestion path |
| Normalized analytics evidence | `src/services/analytics-canon/currentEvidence.ts`, `intelligenceEvidence.ts`, `contracts.ts`, public `index.ts` | Public evidence bundle and status/provenance fields exist | Retain as sole normalized owner |
| Reporting window | `IntelligenceEvidenceRequest.window`; selected-window fallback in `currentEvidence.ts` | API supported a requested window, but resolver did not forward a task request | Implementation required; fixed in Phase 1 |
| Task-specific dataset selection | `sectionIds` and `INTELLIGENCE_SECTION_DATASETS` | Canonical API supports it; resolver did not expose/forward it | Implementation required; fixed in Phase 1 |
| Evidence health | `src/services/brain/BrainEvidenceQuality.ts` | Coverage, scope, stale/partial/failed/unavailable, references and limitations exist | Reuse as shared quality projection |
| Unified evidence bundle | `src/services/brain/EvidenceIntelligenceResolver.ts` | Statistics/audience/evidence-record projections share one canonical bundle | Extend this facade; no parallel facade |
| Scope safety | Resolver + `BrainEvidenceQuality.ts` | Canonical mismatch blocked core projections, but opportunity projection could still run | Implementation required; fixed in Phase 2 |
| Opportunity metric semantics | `src/services/brain/OpportunityEvidenceAdapter.ts` | Missing views were converted to zero and confidence had an unsupported baseline | Regression fix and tests added in this work |
| Opportunity source convergence | Resolver currently accepts `AIBrainEvidencePack` for opportunity derivation | Opportunity evidence is not yet directly derived from canonical bundle datasets | Explicit follow-up for specialist/source convergence; do not claim complete |
| Brain task/context integration | `BrainOrchestrator.ts`, `BrainContextBroker.ts`, `EvidenceIntelligenceResolver.ts` | Shared integration exists; quality was omitted for algorithm-only requests and unscoped context could remain visible | Implemented in Phases 3–4; certification pending |
| Project/ContentBuild context | Creator Context resolver and bounded project context | Stale visible context could leak across project IDs when canonical project lookup missed | Implemented project identity guard and regression test in Phase 5 |
| Recommendation → action → outcome lineage | Existing outcome/evaluation/learning owners | No end-to-end certification in this slice | Later phase |
| Capability coverage report | `scripts/governance/build-capability-coverage.mjs` | Generator currently initializes task/test/guide/verification refs as empty arrays | Governance generator needs a separate truthful metadata change; do not hand-edit generated report |

## Phase 1 — certify and honor the canonical boundary

The supported path is:

```text
VT-SYNC snapshot
  → analytics-canon current evidence API
  → canonical dataset manifest / context bundle
  → Brain evidence quality + EvidenceRecord projection
  → Statistics / Audience projections
  → Brain task context
```

Implemented in this branch:
- Resolver accepts the canonical `AnalyticsWindow` type and forwards an explicit requested window.
- Resolver forwards task-specific `sectionIds` to the canonical API.
- Canonical API retains responsibility for resolving requested window → snapshot-selected window → `28d` fallback.
- One canonical bundle is fetched per resolver invocation and reused for quality/statistics/audience/evidence-record projections.
- No new analytics persistence or direct Brain read of VT-SYNC internals was added.
- Regression test asserts window/section request forwarding.

Known boundary: the Opportunity adapter still receives the typed Brain evidence pack rather than a direct projection of canonical dataset rows. It is scope-gated and preserves source IDs, but full source convergence is a later specialist-integration task and remains explicitly open.

## Phase 2 — shared evidence contract and safe projections

The existing evidence contract is reused; no new database or competing evidence type is introduced.

Implemented in this branch:
- Canonical evidence quality remains the common report for scope, coverage, freshness, missingness and limitations.
- A canonical channel mismatch suppresses evidence records, statistics, audience and opportunity projections before they can be consumed as valid task evidence.
- An explicitly cross-channel Brain evidence pack is rejected by the resolver; the adapter also independently guards channel scope.
- Opportunity records preserve `currentValue: null` for missing views instead of inventing zero.
- Confidence is bounded by actual metric coverage; unsupported baseline confidence is removed.
- Videos with no usable metric are excluded from metric-backed catalog opportunity derivation.
- Missing views and missing publication dates are omitted from scoring rather than treated as zero performance or maximum age.
- Evidence IDs and channel scope remain attached to emitted opportunities.
- Regression tests cover window forwarding, scope mismatch, cross-channel opportunity packs, partial/missing metrics, deduplication, and missing evidence.

The existing canonical dataset states remain `available`, `partial`, `stale`, `failed`, and `unavailable`; Brain projects these to epistemic/quality semantics. Missing is not zero. The full contract's `KNOWN`, `USER_PROVIDED`, `INFERRED`, `HYPOTHESIS`, `ESTIMATE`, and `CONFLICTING` states still need end-to-end certification across non-analytics sources; this slice does not claim those states are all produced by analytics-canon.

## Phase 3 — evidence fitness in context selection

Implemented:
- Evidence quality is evaluated against the task-selected dataset set derived from the requested canonical sections, rather than treating every unrelated dataset in the 34-dataset catalog as equally relevant.
- The quality report records requested sections and evaluated dataset IDs, alongside the selected reporting window and source snapshot.
- BrainContextBroker includes bounded task-dataset coverage, source snapshot, window, freshness, missingness, limitations, and explicit evidence-use rules.
- Unscoped or mismatched canonical evidence is blocked before channel-specific analytics, statistics, audience, and algorithm content is added to the model context.
- Missing/unavailable values remain distinct from zero; stale data is identified as historical; partial evidence requires qualified claims; insufficient evidence cannot justify precise channel-specific claims.
- Regression coverage added for task-scoped quality and context-level scope blocking.

## Phase 4 — specialist reachability and shared contract

Implemented:
- Statistics and Audience continue to use projections from the same canonical evidence bundle.
- Algorithm / Channel / Opportunity / Anomaly consumers now receive the shared evidence-quality report even when the request is not a statistics task.
- Requested reporting window and capability-derived section IDs continue through BrainOrchestrator → EvidenceIntelligenceResolver → analytics-canon.
- Canonical scope safety applies before evidence records, statistics, audience, and opportunity outputs are exposed.
- Focused integration coverage checks canonical source selection, evidence scope, selected window, and context assembly.

Certification boundary:
- Source inspection and regression tests establish these call paths, but production reachability is not certified until the latest branch's focused tests, typecheck, runtime lint, full suite, and runtime smoke checks have completed successfully.

## Phase 5 — canonical opportunities and project identity

Implemented:
- Production Opportunity Intelligence now projects catalog opportunities from the canonical `videos` dataset in the same evidence bundle used by quality/statistics, instead of deriving them from a separate Brain evidence pack.
- Opportunity output retains canonical row evidence ID and explicit provenance: owner, snapshot ID, dataset ID/status, and selected window.
- Channel mismatch, missing channel scope, failed/unavailable video dataset, and rows with no usable measured metric fail closed.
- Missing view counts remain `null`; publication-date absence is not treated as maximum age; confidence is based on measured-metric coverage.
- CreatorContextResolver refuses visible UI context whose project ID is different from, or not explicitly scoped to, the requested active project. Canonical Project → ContentBuild identity remains the preferred source.
- Regression tests cover canonical opportunity provenance/scope and stale cross-project context.

Not claimed complete:
- This phase does not certify recommendation → creator action → publishing outcome → analytics attribution → governed learning end-to-end.
- The capability-coverage generator still needs a separate governance change so task/test/guide/verification references can be represented truthfully.

## Verification commands

- Focused: `npx vitest run src/services/brain/OpportunityEvidenceAdapter.test.ts src/services/brain/__tests__/EvidenceIntelligenceResolver.test.ts src/services/brain/__tests__/BrainEvidenceQuality.test.ts`
- Related contracts: `npx vitest run src/services/brain/__tests__/EvidenceIntelligenceResolver.test.ts src/services/brain/__tests__/BrainEvidenceQualityIntegration.test.ts`
- Repository gates: `npm run typecheck`, `npm run lint:runtime`, `npm run build`, `npm test`, and the release-gates workflow.

GitHub Actions is the verification authority for this remote branch. A started or cancelled workflow is not a passing result. Build success alone does not certify typecheck, focused tests, the full suite, or runtime reachability.

## Phase 0–2 exit checklist

- [x] Establish a separate work branch from `master/consolidated-feature-integration`.
- [x] Map current owners and code paths before changing implementation.
- [x] Identify the missing reporting-window/section forwarding.
- [x] Identify the opportunity projection scope bypass.
- [x] Identify missing-as-zero and unsupported-confidence behavior.
- [x] Preserve analytics-canon as the only normalized analytics owner.
- [x] Forward requested window and task-specific dataset sections through the resolver.
- [x] Fail closed for canonical channel mismatch and explicitly cross-channel opportunity packs.
- [x] Add focused regression coverage for the above contracts.
- [x] Document remaining source-convergence and governance-generator gaps.
- [x] Integrate task-selected evidence fitness and scope-safe context assembly.
- [x] Route quality metadata to analytics-backed specialist requests, including algorithm/opportunity paths.
- [x] Project opportunities from canonical analytics rows with source/window/snapshot provenance.
- [x] Guard active project context against stale cross-project visible context.
- [ ] Confirm focused tests, typecheck, runtime lint and full suite pass on the latest branch head.
- [ ] Review CI results and any unrelated regressions before marking the PR ready.

## Remaining work after Phase 5

1. Trace evidence through recommendation → creator decision/action → publishing outcome → analytics attribution → evaluation → governed learning, including explicit outcome lineage.
2. Repair the capability-coverage generator so task/test/guide/verification metadata can be represented, then regenerate and audit derived reports.
3. Run final focused tests, typecheck, runtime lint, full suite, and runtime/browser verification; record the exact final branch SHA and actual results.
4. Reassess whether remaining Brain surfaces outside the orchestrator (including SidebarChatbot and BrainHubWidget) still assemble parallel context, and migrate only after verifying their real production callers.

This document distinguishes implementation from certification: existing files or passing documentation checks alone do not establish full production reachability.


## Phase 6–8 continuation

See [Phases 6–8 — Lineage, Governance & Verification](./PHASES-6-8-LINEAGE-GOVERNANCE-VERIFICATION.md) for the evidence-backed lineage inventory, capability-evidence generator changes, production-surface caller audit, and exact release-gate blockers.

- Phase 6: existing event/evaluation/learning lineage owners are inventoried; end-to-end recommendation-to-published-outcome-to-learning certification remains open.
- Phase 7: capability evidence map, path validation in the generator, and regenerated report are committed; latest-head CI verification remains pending.
- Phase 8: canonical runtime reachability is confirmed for SidebarChatbot and BrainHubWidget, but surface-owned prompt/snapshot composition remains a convergence boundary. Release certification is blocked until latest-head gates pass or existing base-branch failures are proven unchanged.
