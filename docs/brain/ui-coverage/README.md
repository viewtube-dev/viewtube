# Brain Front-End Coverage Program

**Status:** Proposed planning package — documentation only  
**Repository:** `viewtube-dev/viewtube`  
**Planning base:** `master/consolidated-feature-integration`  
**Planning commit:** `b4d26f16081a2822207f699f74e9e4f753cc4f56`  
**Plan branch:** `docs/brain-ui-coverage-plans-2026-10-30`

## Purpose
Nine independently actionable feature plans and standalone coding prompts, each with creator outcome, page structure, canonical owners, interactions, dependencies, tests and acceptance criteria.

## Plans

| # | Feature | Priority | Plan |
|---:|---|---|---|
| 1 | Evidence Explorer & Evidence Health | P1 | [01-evidence-explorer.md](./01-evidence-explorer.md) |
| 2 | Universal Brain Trace Inspector | P1 | [02-universal-trace-inspector.md](./02-universal-trace-inspector.md) |
| 3 | Channel Knowledge Map | P1 | [03-channel-knowledge-map.md](./03-channel-knowledge-map.md) |
| 4 | Communication Evidence Review | P2 | [04-communication-evidence-review.md](./04-communication-evidence-review.md) |
| 5 | Creator Style Fingerprint | P2 | [05-style-fingerprint.md](./05-style-fingerprint.md) |
| 6 | Learning Performance & Calibration | P2 | [06-learning-performance-calibration.md](./06-learning-performance-calibration.md) |
| 7 | Universal Evidence Lineage | P2 | [07-universal-evidence-lineage.md](./07-universal-evidence-lineage.md) |
| 8 | Evidence Conflict Explorer | P3 | [08-evidence-conflict-explorer.md](./08-evidence-conflict-explorer.md) |
| 9 | Research Source & Provenance View | P3 | [09-research-provenance.md](./09-research-provenance.md) |

## Recommended sequence
1. Evidence Explorer.
2. Trace Inspector.
3. Channel Knowledge Map.
4. Communication Evidence Review (after backend pipeline verification).
5. Style Fingerprint.
6. Learning Performance & Calibration.
7. Universal Evidence Lineage.
8. Evidence Conflict Explorer (after canonical conflict source verification).
9. Research Provenance (after source-record contract verification).

## Shared product and architecture decisions
- One existing Brain Hub host and navigation; exact routes must be inspected.
- Existing Brain/domain owners remain authoritative.
- No duplicate runtime, store, registry, resolver, ledger, provider stack or research engine.
- Exact canonical IDs and scope; honest epistemic/freshness/missingness states.
- Existing Studio primitives/tokens only.
- Mobile/desktop, keyboard/screen-reader, focus and reduced-motion support.
- Every feature independently testable and shippable.

## Explicit backend gates
The audit found strong footholds for evidence quality, traces, knowledge, style, outcome/evaluation and bounded ContentBuild lineage. It did not verify a complete communication-candidate pipeline, a dedicated conflict detector or canonical research source records. Their plans block fabricated UI and require owner/contract verification first.

## Completion boundary
This change adds plans and prompts only. It does not implement pages, add routes, change Brain behavior or claim runtime/visual certification.


## Shared implementation contract

- Brain domain authority: `docs/domains/BRAIN.md`. Reconcile current branch code, tests, routes and history before treating a feature as missing.
- These are proposed product surfaces, not proof that a route exists. Reuse the current Brain Hub shell/navigation; do not add a parallel shell or tab system.
- Extend canonical owners. No second Brain runtime, evidence database, analytics store, trace ledger, memory store, learning ledger, capability registry or research store.
- Preserve canonical IDs, channel/project/content scope, permissions, provenance, freshness, epistemic state and governance.
- Never fabricate confidence, counts, timestamps, source links, outcomes or operation success. Missing is not zero. Do not expose private chain-of-thought.
- Use existing production Studio primitives, semantic tokens and responsive conventions. Do not create page-local control styles.
- Define loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Support keyboard/screen readers, visible focus, reduced motion, zoom, long content, narrow mobile and desktop.
- Add regression tests before behavior changes. Run focused tests, typecheck/lint/build as applicable, and actual rendered mobile/desktop checks. Report verification honestly; a passing build is not visual certification.
