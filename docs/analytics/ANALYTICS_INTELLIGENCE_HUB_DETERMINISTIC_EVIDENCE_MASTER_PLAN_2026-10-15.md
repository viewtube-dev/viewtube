# Analytics Intelligence Hub + Deterministic Evidence — Master Plan and Phases 0–10 Implementation Record

**Status:** Phases 0–4 merged via PR #241; phases 5–8 via PR #248; phases 7–10 follow-up via PR #250, all into `master/consolidated-feature-integration`. This follow-up adds a live Intelligence Hub deterministic findings panel and opts the conversational Brain runtime into full-canonical-row trend findings. Remaining release gaps are full Project/ActionPacket and publication-checkpoint integration, durable server-side event persistence, full application/browser E2E, and final release certification.  
**Date:** 2026-10-15  
**Implementation branch:** Phases 0–10 implementation slices are merged into `master/consolidated-feature-integration`; live trend/UI integration is proposed from `feat/analytics-intelligence-live-integration-2026-10-15`  
**Implementation PRs:** [#241 — deterministic findings phases 0–4](https://github.com/viewtube-dev/viewtube/pull/241), [#248 — Intelligence Hub workflow and Brain context phases 5–8](https://github.com/viewtube-dev/viewtube/pull/248), and [#250 — lifecycle outcomes, learning review, and convergence phases 7–10](https://github.com/viewtube-dev/viewtube/pull/250), merged into this integration branch. Follow-up syntax repair commit: `59f446dbe3364e0334e22fdb08bcd1350b031f93`.  
**Target integration branch:** `master/consolidated-feature-integration`  
**Scope:** Build the Analytics Intelligence Hub and deterministic analytics findings/evidence without introducing a second analytics store or allowing AI-generated prose to become metric truth.

## Executive outcome

The complete goal is to turn synchronized analytics into reproducible, source-linked findings that a creator can understand and act on. Analytics must calculate facts deterministically; Intelligence Hub may explain them; Brain may contextualize them against creator goals; Projects may carry approved actions forward; later analytics must measure outcomes. Facts, derived calculations, hypotheses, recommendations, and causal claims remain distinct.

This document consolidates the prior audit/plan and records the implementation phases, acceptance gates, current known gaps, and next work. It is the program-level source for this initiative; the narrower canonical analytics and Brain integration contracts remain authoritative for their own concerns.

## Existing documentation and implementation audit (Phase 0)

### Canonical owners to preserve

| Concern | Current owner / source | Audit disposition |
|---|---|---|
| Raw synced analytics rows and sync freshness | `src/features/vt-sync-local/**` | Keep as acquisition and raw evidence owner. |
| Visible/selectable dataset registry | `VT_SYNC_VISIBLE_TABLE_DEFINITIONS` in VT-SYNC | Use the registry; never maintain a parallel dataset list as runtime truth. |
| Normalized consumer boundary | `src/services/analytics-canon/**` and its public barrel | Sole canonical consumer-facing analytics API. |
| Dataset evidence manifest and bounded context | `src/services/analytics-canon/intelligenceEvidence.ts` | Existing versioned manifest; audited code declares 34 active datasets. Verify count against the registry in tests. |
| Current snapshot entry point | `src/services/analytics-canon/currentEvidence.ts` | Existing non-React entry point used by Brain. |
| Reporting-window vocabulary | `src/services/analytics/windows.ts` and `CANONICAL_ANALYTICS_WINDOWS` | Canonical vocabulary is `7d`, `28d`, `90d`, `365d`, `lifetime`; do not silently invent a custom window. |
| Deterministic statistics | `src/services/brain/StatisticsIntelligence.ts` | Existing calculations over canonical metric summaries; no model call. |
| Evidence record and derived signal contracts | `src/services/brain/EvidenceRecord.ts`; `tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md` | Reuse and extend only where necessary; no competing record store. |
| Evidence fitness / Brain projection | `src/services/brain/BrainEvidenceQuality.ts`, `EvidenceIntelligenceResolver.ts`, `BrainStatisticsBridge.ts` | Reuse for quality, specialist projection, and Brain integration. |
| Intelligence Hub report and preflight | `src/components/IntelligenceHub/ultimateReport.ts`, `EvidencePreflightPanel.tsx` | Preserve existing surface; deterministic evidence should be consumable without letting generated prose override facts. |
| Page-level Analytics contract | `docs/Analytics.md` | Defines Sync Controller, Intelligence Hub, Master Data Tables, Data Visuals and the Brain/Projects handoff. |

### Relevant master resources, audits, and plans

1. [Analytics / VT-SYNC Master Resource](VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md) — canonical data ownership, dataset/window contracts, migration status.
2. [VT-SYNC Analytics Architecture Master Reference](../migration/reference/VIEWTUBE_VT_SYNC_ANALYTICS_ARCHITECTURE_MASTER_REFERENCE_2026-09-03.md) — historical architecture reference for datasets, metrics, windows, provenance and deterministic insights; verify old claims against current source before using them as present-day status.
3. [YouTube Analytics Dataset Expansion Plan](YOUTUBE_ANALYTICS_DATASET_EXPANSION_PLAN.md) — capability-aware additive dataset expansion and real-account validation.
4. [Evidence & Intelligence Convergence Audit](../../tasks/system-convergence/EVIDENCE-INTELLIGENCE-AUDIT.md) — canonical analytics, quality, statistics, audience, channel, opportunity, anomaly and resolver ownership.
5. [Evidence Record & Derived Signal Contract](../../tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md) — evidence versus derived signal, comparability dimensions and provenance.
6. [AI Brain Evidence Contract](../../tasks/ai-brain-quality/SPEC-evidence-contract.md) — known/observed/calculated/inferred/stale/missing/conflicting semantics.
7. [Canonical Analytics → Brain Runtime Integration](../../tasks/ai-brain-quality/CANONICAL-ANALYTICS-BRAIN-INTEGRATION.md) — resolver window/scope forwarding and remaining Brain certification boundaries.
8. [Integrated Content Lifecycle, Analytics & Studio Hub Master Plan](../architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md) — Project → ContentBuild → assets → publishing → publication → analytics → outcome → evaluation → governed learning.
9. [Analytics page specification](../Analytics.md) — page-level tools and data handoffs.
10. `src/services/brain/__tests__/StatisticsIntelligence.test.ts` and `src/services/analytics-canon/intelligenceEvidence.test.ts` — current deterministic-statistics and canonical-evidence regression coverage.

### Phase 0 findings

- Canonical analytics evidence and basic deterministic metric summaries already exist; this is a convergence and extension task, not a greenfield data store.
- The canonical bundle contains bounded sample rows and dataset-level summaries. A sample must never be presented as a complete distribution or total. Contribution calculations require complete canonical dataset rows and a completeness guard.
- A single selected-window summary is not, by itself, a reporting-period comparison. Comparisons must carry explicit start/end boundaries for both periods and must verify channel, metric, unit/aggregation, window semantics, dataset availability and source provenance.
- Missing, failed, unavailable, stale, partial, unsupported, zero, and incompatible are different states. Never replace absent evidence with numeric zero.
- Relative change is undefined when the baseline is zero; return null rather than infinity or a fabricated percentage.
- “Material change” can use a deterministic declared threshold, but it must not be called statistical significance without a statistical test and appropriate sampling assumptions.
- Brain/LLM consumers must receive computed values, formulas, evidence references and limitations. They must not recompute or invent the numbers.
- The repository already has adjacent canonical Analytics → Brain integration work (including PRs #213 and #215 and post-publication lifecycle work such as PRs #220/#223). Their CI/merge status and exact branch heads must be checked before integration; this branch does not claim those PRs are merged or release-certified.
- No direct edit to `main`, no production deployment, and no external YouTube mutation is part of this work.

## System objective and end-to-end flow

```text
YouTube / imported records
  → VT-SYNC Local
  → analytics-canon canonical rows, summaries, freshness and provenance
  → deterministic insights (formulas + compatible periods + evidence refs)
  → Intelligence Hub (fact / interpretation / hypothesis separation)
  → Brain (creator goal and context, bounded by evidence quality)
  → creator-approved opportunity / Project / action
  → publication and outcome checkpoint
  → comparable follow-up analytics and evaluation
  → governed learning (review and approval; never automatic promotion from one correlation)
```

## Phase 1 — Canonical insight/evidence contract

The canonical analytics owners remain unchanged. The deterministic insight layer adds a small, typed projection over canonical evidence, not a new ingestion path or database.

Every insight should carry:
- stable deterministic ID derived from source identities, metric and explicit period bounds;
- kind and creator-readable label;
- channel and dataset identity;
- metric, value, unit/aggregation semantics and declared formula/version;
- current and baseline period labels/bounds when comparison is involved;
- absolute delta and relative delta (nullable if undefined);
- evidence references to canonical source datasets/snapshots;
- confidence/quality bounded by source availability and completeness;
- limitations and missingness;
- a clear epistemic category: observed source fact, deterministic calculation, bounded interpretation, or hypothesis/recommendation.

Comparisons are blocked unless:
1. channel identity is known and matches;
2. current and baseline use the same canonical reporting-window semantics;
3. each period has explicit valid start/end dates, and periods do not overlap;
4. dataset and metric exist in both bundles;
5. dataset statuses are usable and metric summaries are finite;
6. metric aggregation semantics are consistent;
7. the baseline is not silently replaced with zero.

For contribution analysis, use complete canonical dataset rows (not bounded report samples), require an explicit matching row count plus a dimension and numeric metric for every included row, and do not report shares when the denominator is zero or invalid. The current summary contract does not provide sufficient denominator metadata for CTR, rates, ratios, RPM/CPM, percentages, or average/duration metrics; the initial engine fails closed for those non-additive metrics rather than averaging or summing them incorrectly.

## Phase 2 — Deterministic Analytics Insights engine

First supported insight families:
1. **Reporting-period metric comparison** — compare matching canonical dataset/metric values across explicit non-overlapping periods. Formulas: `delta = current - baseline`; `relativeDeltaPercent = (delta / abs(baseline)) × 100` only when baseline ≠ 0.
2. **Traffic-source contribution** — group complete traffic rows by canonical traffic-source dimension, sum the chosen additive metric per source, and calculate `sharePercent = sourceSum / totalSum × 100` only when total > 0. Require a matching expected row count. Ratio/average metrics remain blocked until the canonical contract exposes the correct denominators/aggregation semantics.
3. **Material metric change** — emit a threshold-based signal only when the relative change is defined and meets the configured threshold. Label it as threshold-based materiality, not statistical significance.
4. **Coverage/freshness warnings** — make missingness and evidence fitness explicit; never infer performance from a missing dataset.

Engine requirements:
- no LLM/model calls;
- same source evidence + same inputs + same algorithm version produce identical insight IDs and values;
- deterministic ordering and bounded outputs;
- formulas and source refs travel with every result;
- channel, period, scope, dataset status and completeness checks fail closed;
- confidence is bounded and explainable;
- no causal conclusions from before/after association;
- tests include normal, zero baseline, absent metrics, stale/partial/failed evidence, channel mismatch, overlapping periods, incomplete traffic rows, zero denominator and repeatability.

## Remaining phases (3–9)

### Phase 3 — Unified findings and derived-signal contract
Reconcile engine output with `DerivedSignal` and specialist-intelligence contracts. Avoid parallel types when existing contracts can safely express the result. Keep evidence records immutable and derived signals reproducible.

### Phase 4 — Trend, comparison and anomaly integration
Route period comparisons through the same comparability guard. Reuse the existing anomaly service and bridge rather than building a duplicate detector. Expose threshold/configuration and avoid false precision for sparse samples. **Implemented:** least-squares descriptive trends over explicit, unique, valid dated canonical rows; no absent-date-to-zero imputation; minimum-observation and completeness guards; stable adapters for existing `ViewTubeAnomaly` records and sorted anomaly batches. Anomaly scores/detector semantics are preserved, not recalculated.

### Phase 5 — Intelligence Hub interpretation
**Implemented service projection:** `src/services/brain/AnalyticsIntelligenceWorkflow.ts` exposes `presentAnalyticsFindings`, keeping deterministic fact, existing interpretation, hypothesis, and recommendation separate. It carries formula/version, source snapshots, evidence refs, bounded confidence, and limitations; it filters invalid and cross-channel findings and sorts output deterministically.

**Implemented follow-up:** `src/components/IntelligenceHub/DeterministicAnalyticsFindingsPanel.tsx` renders validated findings with facts, formula/version, snapshot IDs, evidence refs, confidence heuristic, limitations, and separate interpretation/hypothesis/recommendation slots. It deliberately reports no findings when full canonical rows cannot support a valid series and does not use bounded report samples. Accessible/mobile browser verification remains a release gate.

### Phase 6 — Brain integration
**Implemented runtime seam:** `EvidenceIntelligenceResolver` accepts optional deterministic findings and returns an exact-channel guarded `analyticsFindingContext`. `BrainOrchestrator` forwards it through both `BrainContextBroker` builds. The broker adds a bounded `DETERMINISTIC ANALYTICS FINDINGS` prompt section only when analytics access is enabled, scope is usable, and findings exist; instructions explicitly prohibit recalculating or overwriting facts.

**Implemented follow-up:** `CurrentCanonicalAnalyticsInsights.ts` builds descriptive trends from full canonical `daily` rows (currently supported additive metrics: views, engaged views, watch time, likes, comments, subscribers gained), and `BrainOrchestrator` opts into these findings for statistics/algorithm-intelligence requests. The resolver verifies channel scope and the expected snapshot; the broker keeps the model from overwriting facts. Multi-period comparisons still require explicit canonical period evidence and are not inferred from a single snapshot.

### Phase 7 — Creator-goal recommendations and Projects
**Implemented contract:** `buildAnalyticsRecommendationAction` creates a proposed-only, goal-aware action with channel/project identity, finding IDs, evidence refs, metric, baseline, expected direction, canonical evaluation window, baseline snapshot IDs, and a null causal claim. Invalid or cross-channel findings are rejected; proposal does not mean approved or executed.

**Implemented follow-up:** the Intelligence Hub findings panel now accepts a creator goal, proposed action, optional existing Project ID, expected direction, and evaluation window; it records a proposed-only `RECOMMENDATION_CREATED` event through the existing ledger adapter. It explicitly says the action is not approved/executed and does not silently create or modify a Project. **Still open:** a real Project/ActionPacket handoff and creator approval state must be connected to their canonical workflow owners.

### Phase 8 — Outcome measurement and governed learning
**Implemented contract:** `evaluateAnalyticsOutcome` requires matching channel, metric and canonical window; distinct snapshots; valid explicit inclusive period dates; non-overlapping chronological equal-window periods; finite values; and a later follow-up timestamp. Missing/incompatible evidence blocks evaluation, zero baseline leaves percent change null, and all outcomes remain descriptive-association-only with `causalConclusion: null`. `buildLearningCandidateReview` requires at least three evaluated outcomes by default and always produces review-required candidates with promotion disabled.

**Still open:** the service-level evaluation/event adapters are implemented, but live publication transaction and metadata-version identities are not yet sourced automatically from canonical publication/checkpoint writers; the browser UI does not yet perform a complete source-backed follow-up evaluation; server-durable persistence and confounder capture from actual records remain open.

### Phase 9 — UX, reliability and end-to-end certification
**Implemented:** a deterministic golden-path contract test now exercises finding presentation → creator-goal recommendation → linked project/ContentBuild/video/publication transaction/metadata versions → three comparable follow-up evaluations → review-only learning candidate. It checks that evidence and identity survive the entire path and that causality/promotion remain disabled.

**Still required:** extend the fixture through real canonical dataset builders, live Intelligence Hub rendering, Brain request/response, actual Project/ActionPacket handoff, publish transaction and analytics checkpoint producers; add browser assertions for desktop/mobile. This is a service-contract golden path, not yet a full application E2E certification.

## Acceptance gates

- [ ] Canonical owner boundaries preserved; no new analytics truth store.
- [ ] Explicit period/window/filter semantics and stable evidence references.
- [ ] Missing values never become zero.
- [ ] Comparison fails closed for incompatible channels, periods, datasets or metrics.
- [ ] Traffic contributions only use complete canonical rows and valid denominators.
- [ ] Every result records formula/version, provenance, confidence and limitations.
- [ ] Deterministic repeatability tests pass.
- [ ] Intelligence Hub and Brain consume findings without recalculating metrics.
- [ ] Project/action handoff preserves creator goals and validation criteria.
- [ ] Outcome/evaluation and governed learning are tested end-to-end.
- [ ] Focused tests, typecheck, lint, full suite, production build and relevant browser smoke are run on the final head.
- [ ] CI and branch/PR conflicts are checked; no merge/deployment claim without evidence.

## Phase 0–10 implementation receipt

Code paths, validation results and remaining integration gates are recorded below. Service contracts and prompt plumbing are implemented; the end-to-end creator workflow is not complete until the listed caller/UI/persistence seams are connected.

- Phase 0: audit and ownership reconciliation recorded above; existing canonical source, Brain bridge, historical plans, adjacent PR boundaries and validation gaps are documented.
- Phase 1: `src/services/brain/DeterministicAnalyticsInsights.ts` defines explicit inclusive period bounds, stable source-linked findings, formula/version, confidence and limitations; it fails closed on unknown/mismatched channels, mismatched windows, invalid/overlapping/non-chronological or unequal-length periods, same snapshot IDs, unavailable datasets, missing metrics and non-finite values.
- Phase 2: period comparisons, threshold-based material-change signals and complete-row traffic-source contributions are implemented. Unsupported denominator-dependent metrics are rejected; zero baselines preserve null relative change; missing/partial rows and zero contribution denominators fail closed. Tests are in `src/services/brain/__tests__/DeterministicAnalyticsInsights.test.ts` and included in `npm run test:focused`.
- Phase 3: unified finding fields and `toDerivedSignal` adapter are implemented in `src/services/brain/DeterministicAnalyticsInsights.ts`; existing `DerivedSignalKind` now includes `material-change` and `contribution`. No parallel evidence store was added.
- Phase 4: descriptive linear trends and existing-anomaly adapters are implemented in the same service. Trend calculation rejects invalid/duplicate dates, unsupported metrics, unavailable evidence, incomplete series and too few observations; it never imputes missing dates as zero. Anomaly records retain detector-produced values/scores and source evidence.
- Runtime integration / release verification: these helpers are implemented but are not yet wired into the live Intelligence Hub/Brain request path. GitHub Actions release-gate runs on earlier heads were cancelled after subsequent commits; latest-head checks must be reviewed. Vercel statuses have reported build-rate-limit failures. Tests, typecheck, full suite, build, and browser verification have not been verified from this session; keep the work un-certified until those gates pass and results are reviewed.


### Phase 5–8 implementation receipt (work branch pending review/merge)

- Added `src/services/brain/AnalyticsIntelligenceWorkflow.ts`:
  - Phase 5: evidence-linked presentation projection keeps fact, interpretation, hypothesis, and recommendation as separate layers.
  - Phase 6: exact-channel Brain finding context with validated deterministic values, formula/version, source snapshot IDs, evidence refs, limitations, and a bounded list.
  - Phase 7: creator-goal-aware proposed action contract retains finding/evidence/project linkage, baseline, expected direction, and declared evaluation window; proposals are not approved or executed.
  - Phase 8: comparability-guarded before/after evaluation; zero baseline produces null percent change; causal conclusion stays null; learning candidate requires repeated evaluations and remains review-only.
- Added `src/services/brain/AnalyticsIntelligenceWorkflow.test.ts` for layer separation, scope blocking, finding filtering, recommendation provenance, metric mismatch rejection, zero-baseline behavior, and learning-review safeguards.
- Added the workflow test to `npm run test:focused`.
- Extended `src/services/brain/EvidenceIntelligenceResolver.ts` with an optional deterministic finding input and scope-guarded context projection. Existing callers may omit it without changing their current behavior.
- **Not yet certified:** GitHub Actions ran on implementation head `4e6c6a0fe0c290d43351910e8ecb41efeaeb9d19`: `npm run test:focused` passed (including the new workflow and resolver tests), `npm run typecheck` passed, `npm run build` passed, source-governance passed, and local smoke passed. `npm test` failed on the existing untouched dashboard CSS assertion expecting `max-width: 46%` in `src/views/dashboard/__tests__/WidgetPrimitives.test.tsx`; `npm run lint:runtime` failed on broad existing lint errors (2,234 errors / 159 warnings), with reported examples in untouched settings/workbench files. The PR is not release-certified because full-suite/lint are not green and the end-to-end product integration gaps listed above remain. The findings input is optional and the live Brain caller does not yet compute multi-period findings; the Intelligence Hub UI is not yet rendering the projection; action/evaluation records are not yet written into the canonical Project/publication/outcome owners; end-to-end and production persistence checks remain open.


### Phase 10 — Documentation convergence receipt

- `docs/Analytics.md` points to this master plan and now clarifies the implementation/release boundary.
- `docs/architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md` records the analytics recommendation → existing event ledger → comparable outcome → review-only learning path and its open server-durability/runtime gates.
- This master plan remains the scoped Analytics authority; Projects/ContentBuild, Asset Engine, PublishTransaction, Analytics Canon, Algorithm Intelligence events and governed learning remain their own authorities. No competing database or lifecycle was added.


### Live runtime and Intelligence Hub integration follow-up

- Added `getCurrentCanonicalIntelligenceDatasetRows` to the public `analytics-canon` barrel. It returns full rows from the current VT-SYNC snapshot for deterministic consumers; it does not return the report's bounded sample rows.
- Added `src/services/brain/CurrentCanonicalAnalyticsInsights.ts`. It computes bounded least-squares trend findings from the full canonical `daily` dataset, requiring exact channel and expected-snapshot identity. It does not impute missing dates and only attempts the declared additive metric set.
- Updated `EvidenceIntelligenceResolver` and `BrainOrchestrator` to opt into those trends for statistics/algorithm-intelligence requests. The existing `BrainContextBroker` prompt section remains scope-gated and bounded.
- Added `src/components/IntelligenceHub/DeterministicAnalyticsFindingsPanel.tsx` and mounted it in `IntelligenceHub.tsx`. It renders source-linked facts, formula/version, confidence heuristic, limitations and separate interpretation/hypothesis/recommendation layers.
- Added a creator-goal proposal form to the findings panel. Proposals are recorded via `recordAnalyticsRecommendationEvent` into the existing Algorithm Intelligence event ledger; UI copy explicitly says proposals are not approved/executed and no Project is created or changed automatically.
- Added a resolver regression test for the opt-in runtime trend path.
- **Boundaries still open:** period-to-period comparisons are not synthesized from a single snapshot; Project/ActionPacket approval and publication/checkpoint producers are not yet wired to these proposals/evaluations; event ledger storage remains browser-local; full browser E2E and release certification are still required.
