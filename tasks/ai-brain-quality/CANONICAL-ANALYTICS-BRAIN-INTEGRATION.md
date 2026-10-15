# Canonical Analytics Evidence → Brain Runtime Integration

**Status:** Implementation in progress; focused regression and release-gate verification pending  
**Owner:** BrainRuntime + analytics-canon  
**Branch:** `fix/brain-canonical-evidence-missingness-2026-10-15`  
**Pull request:** [#213](https://github.com/viewtube-dev/viewtube/pull/213)  
**Authority:** `docs/domains/BRAIN.md` and `docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md`

## Goal

Make every analytics-backed Brain recommendation use the canonical analytics boundary and preserve the truth of its evidence: scope, time window, source snapshot, freshness, missingness, comparability, and measured-versus-derived status. Do not introduce a second analytics store or let unavailable metrics become numeric zeroes.

## Existing implementation verified by source inspection

| Requirement | Existing implementation | Current assessment |
|---|---|---|
| Single normalized analytics owner | `src/services/analytics-canon/currentEvidence.ts`, public barrel `src/services/analytics-canon/index.ts` | Present |
| VT-SYNC selected-window projection | `getCurrentCanonicalIntelligenceEvidence()` resolves explicit request → snapshot selection → `28d` fallback | Present; per-dataset availability still varies |
| Unified evidence bundle per Brain turn | `src/services/brain/EvidenceIntelligenceResolver.ts` | Present |
| Evidence health | `src/services/brain/BrainEvidenceQuality.ts` reports coverage, freshness, scope, source failures, missingness and limitations | Present |
| Brain context injection | `src/services/brain/BrainOrchestrator.ts` → `BrainContextBroker.ts` | Present for capabilities requesting statistics; confirm other surfaces separately |
| Specialist projections | Statistics, Audience and Opportunity adapters | Present; maintain shared owner and source IDs |
| Channel mismatch protection | Resolver suppresses canonical projections when quality reports a channel mismatch; opportunity adapter separately checks evidence-pack channel | Present; maintain regression tests |
| Missing versus zero | Quality projection marks unavailable datasets as `MISSING`; Opportunity adapter previously coerced absent views to zero | Regression fix in this PR |
| Project / ContentBuild identity | `CreatorContextResolver` and bounded project context in Brain orchestration | Partial; explicit no-project and canonical ContentBuild fixtures remain open in convergence TODO |
| End-to-end recommendation → action → outcome lineage | Existing outcome/evaluation owners and post-publish bridge | Not certified end-to-end by this change |
| Capability coverage metadata | Capability homes currently show missing task/test/guide/verification references | Governance follow-up required; do not label full capability complete from source presence alone |

## Implementation in this slice

1. Keep analytics-canon as the only normalized analytics source; do not add persistence.
2. Preserve `currentValue: null` when views are unavailable instead of fabricating `currentValue: 0`.
3. Compute confidence from available metric coverage rather than adding an unsupported 50-point baseline.
4. Exclude a video from metric-backed catalog opportunity generation when all relevant metrics are missing.
5. Do not treat missing views or publication timestamps as observed zero/old values inside opportunity scoring; omit unknown score components and normalize over known components.
6. Keep the source evidence ID and channel scope attached to each emitted opportunity.
7. Add regression tests for partial metrics, all-missing metrics, channel mismatch, deduplication, and missing evidence.

## Verification commands

- Focused: `npx vitest run src/services/brain/OpportunityEvidenceAdapter.test.ts`
- Related contracts: `npx vitest run src/services/brain/OpportunityEvidenceAdapter.test.ts src/services/brain/__tests__/EvidenceIntelligenceResolver.test.ts src/services/brain/__tests__/BrainEvidenceQuality.test.ts src/services/brain/__tests__/BrainEvidenceQualityIntegration.test.ts`
- Repository gates: `npm run typecheck`, `npm run lint:runtime`, `npm run build`, `npm test`, and the release-gates workflow.

CI is the verification authority for this remote GitHub change. A started or cancelled workflow is not a passing result. Vercel build-rate-limit failures are infrastructure signals, not evidence that source tests passed or failed.

## Definition of done

- [x] Canonical analytics remains the only normalized analytics owner.
- [x] Brain runtime uses one canonical evidence bundle for the shared quality/statistics/audience projection.
- [x] Channel mismatch is detected and canonical analytics-derived projections fail closed.
- [x] Opportunity evidence retains source evidence IDs.
- [x] Regression coverage added for missing/partial opportunity metrics.
- [ ] Focused regression test passes on the implementation commit.
- [ ] Typecheck, runtime lint, production build, and full test suite results reviewed.
- [ ] Confirm no new unrelated regressions against the integration-branch baseline.
- [ ] Reconcile task/test/guide/verification references in capability governance and regenerate derived reports.
- [ ] Complete cross-surface/runtime certification for all Brain surfaces and end-to-end outcome lineage.

## Follow-up boundary

This slice fixes one confirmed epistemic bug. It does **not** certify every specialist, Brain surface, reporting-window combination, active Project/ContentBuild case, or outcome-learning path. Those remain explicit verification work rather than being inferred complete from the existence of shared adapters.
