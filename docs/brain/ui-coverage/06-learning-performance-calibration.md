# Learning Performance & Calibration

**Status:** Proposed; not implemented  
**Priority:** P2  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Show whether recommendations and learning candidates produce measurable value, with sample size, scope, metric comparability and insufficient-data states visible.

## 2. Existing footholds and verification
Footholds: `BrainEvaluationInboxPanel.tsx`, `BrainEvaluationInbox.ts`, `BrainOutcomeLedger.ts`, `AlgorithmLearningGovernance.ts`, `AlgorithmRecommendationCalibration.ts`, `BrainAttributionDetailPanel.tsx`. Verify channel-wide vs algorithm-only coverage and valid aggregation samples.

## 3. Proposed page structure
1. Overview of measured outcomes and eligible sample size.
2. Capability/task breakdown only for comparable cohorts.
3. Prediction vs measured outcome using real calibration definitions.
4. Learning lifecycle from canonical governance.
5. Attribution drill-down.
6. Limitations: insufficient samples, incomparable metrics, missing checkpoints and stale measurement.

## 4. Interaction contract
Filter by capability/task/channel/window; inspect cohort; open attribution; review candidates through existing inbox/governance. Never mix incompatible metrics.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test comparability, insufficient-data suppression, sample-size labels, channel isolation, calibration parity, lifecycle and double counting; verify mobile charts.

**Definition of done:** Creators distinguish measured improvement from anecdotes and know when Brain cannot yet calibrate a prediction.

## 8. Dependencies and risks
Outcome coverage; evaluation targets/checkpoints; metric comparability guard; governance states; reliable filters.

## 9. Implementation sequence
1. Inspect assigned branch, authority docs, active route, components, owners, tests and history.
2. Prove callers and data contracts.
3. Add failing regression tests.
4. Implement smallest coherent page using existing Brain/Studio components.
5. Verify states, mobile/desktop, keyboard and screen-reader behavior.
6. Run focused tests, typecheck/lint/build and rendered checks.
7. Update docs only with verified results.
8. Report files, owners, tests, visual checks, gaps and rollback.

## 10. Copy-ready implementation prompt
```text
Implement Brain Learning Performance & Calibration. Inspect docs/domains/BRAIN.md, this plan, BrainOutcomeLedger.ts, BrainEvaluationInbox.ts and panel, AlgorithmRecommendationCalibration.ts, AlgorithmLearningGovernance.ts, BrainAttributionDetailPanel.tsx, metric comparability utilities and tests. Build over canonical measured outcomes and governed learning records. Reuse Evaluation Inbox and attribution detail; no second ledger or review queue. Show predicted vs measured results only when evaluation target, checkpoint, metric, unit, scope, format and window are comparable. Display actual sample sizes and insufficient-data states. Separate creator preference/selection from measured performance. Show lifecycle from authoritative governance. Do not invent success rates, causal impact, calibration, cohorts or trends. Do not mix incompatible metrics/scopes. If data is insufficient, show the gap. Use Studio primitives, responsive and accessible charts/tables, and all page states. Test comparability, cohort selection, sample thresholds, scope and lifecycle. Run focused tests, build and real mobile/desktop checks. Report what is measurable and unavailable.
```


## Shared implementation contract

- Brain domain authority: `docs/domains/BRAIN.md`. Reconcile current branch code, tests, routes and history before treating a feature as missing.
- These are proposed product surfaces, not proof that a route exists. Reuse the current Brain Hub shell/navigation; do not add a parallel shell or tab system.
- Extend canonical owners. No second Brain runtime, evidence database, analytics store, trace ledger, memory store, learning ledger, capability registry or research store.
- Preserve canonical IDs, channel/project/content scope, permissions, provenance, freshness, epistemic state and governance.
- Never fabricate confidence, counts, timestamps, source links, outcomes or operation success. Missing is not zero. Do not expose private chain-of-thought.
- Use existing production Studio primitives, semantic tokens and responsive conventions. Do not create page-local control styles.
- Define loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Support keyboard/screen readers, visible focus, reduced motion, zoom, long content, narrow mobile and desktop.
- Add regression tests before behavior changes. Run focused tests, typecheck/lint/build as applicable, and actual rendered mobile/desktop checks. Report verification honestly; a passing build is not visual certification.
