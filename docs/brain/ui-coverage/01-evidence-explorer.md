# Evidence Explorer & Evidence Health

**Status:** Implementation in progress; validation pending  
**Priority:** P1  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Help creators inspect exactly what evidence powers Brain answers: available and missing datasets, freshness, scope, provenance, limitations and turn-specific records.

## 2. Existing footholds and verification
Footholds: `EvidenceIntelligenceResolver.ts`, `BrainEvidenceQuality.ts`, `EvidenceRecord.ts`, `analytics-canon`, `BrainEvidenceDrawer.tsx`. Verify production caller, turn-bound evidence pack and route on the implementation branch.

## 3. Proposed page structure
1. Header: channel/scope and snapshot identity.
2. Health summary: coverage, epistemic confidence category, freshness and scope match from canonical reports only.
3. Dataset list: status, updated time, row count, missing metrics and evidence refs.
4. Record detail: typed record, source owner, provenance IDs, window, scope and limitations.
5. Gaps/actions: missing, stale, failed or permission-blocked inputs; link to refresh/settings only if a real action exists.
6. Based-on navigation: exact evidence used by the selected Brain turn.

## 4. Interaction contract
Filter by dataset/state/window/source; expand datasets; inspect records; open exact source; navigate from an answer while preserving turn and filters. A view refresh must not imply upstream data refresh.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test exact evidence-pack parity; scope mismatch fails closed; missing is not zero; stale/partial/failed/unavailable distinctions; stable IDs; permissions; empty vs unavailable; filter-preserving navigation; mobile overflow and accessibility.

**Definition of done:** Creators can answer what evidence Brain used, what was missing, how old it is, what scope it covers and what limitations apply. Every displayed record resolves to a canonical ID.

## 8. Dependencies and risks
Canonical resolver/quality contracts; turn-bound evidence identity; current Brain navigation; source-owner actions where available.

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
Implement the ViewTube Brain Evidence Explorer in viewtube-dev/viewtube. First inspect docs/domains/BRAIN.md, this plan, current Brain Hub routes, EvidenceIntelligenceResolver.ts, BrainEvidenceQuality.ts, EvidenceRecord.ts, analytics-canon, BrainEvidenceDrawer.tsx, callers, tests and history. Verify the exact turn-bound evidence contract before coding. Build a creator-facing projection over canonical evidence owners: dataset health, coverage, freshness, scope match, missingness, limitations, provenance and the exact records used by a selected turn. Reuse existing UI and Studio primitives. Do not add another evidence store, analytics engine, resolver, confidence formula or Brain shell. Never invent records, timestamps, confidence or refresh capabilities; missing is not zero. Distinguish observed, stale, missing, partial, failed, unavailable and conflicting only as source contracts permit. If an action does not exist, explain rather than fake it. Implement responsive/mobile and desktop layouts, all page states, keyboard/screen-reader support, focus, reduced motion and overflow. Add failing regression tests first; run focused tests, typecheck/build and actual rendered checks. Report owners, files, tests, visual/accessibility checks and gaps honestly.
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


## Implementation checkpoint — 2026-10-30

- **Branch:** `feat/brain-evidence-explorer-2026-10-30`
- **Surface:** Existing Brain Hub tab at `/ai-brain?tab=evidence`; no parallel route or shell.
- **Implemented in this pass:** Canonical dataset health, evidence fitness/coverage/scope summary, window selection, dataset status/search filters, EvidenceRecord inspection, source/provenance metadata and explicit unavailable/restricted/unscoped/error states.
- **Ownership:** Reads through `resolveEvidenceIntelligence`; analytics truth remains `analytics-canon`; permission checks use `readBrainUserControls`.
- **Turn boundary:** The panel labels itself as the current channel snapshot. Exact past-turn evidence remains in that turn's existing evidence ribbon/drawer; this panel does not claim snapshot records were all used by a selected answer.
- **Refresh boundary:** Recheck re-reads the current local canonical snapshot and does not trigger an upstream YouTube sync.
- **Validation:** Automated tests and build have not yet been run in the current execution environment. Do not treat this checkpoint as release-ready until focused tests, typecheck, build and rendered mobile/desktop checks are completed.
