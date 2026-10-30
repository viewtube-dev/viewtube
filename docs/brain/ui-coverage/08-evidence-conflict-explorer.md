# Evidence Conflict Explorer

**Status:** Proposed; not implemented  
**Priority:** P3  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Help creators resolve incompatible channel facts and evidence without silently choosing a source or treating a model guess as truth.

## 2. Existing footholds and verification
Footholds: `EvidenceRecord` epistemic states include `CONFLICTING`; ChannelKnowledgeProjection and BrainMemoryClaims carry claim/evidence semantics. A dedicated conflict detector/UI was not verified. Confirm canonical conflict records before building a queue.

## 3. Proposed page structure
1. Overview of canonical conflicting records only.
2. Conflict group with explicit subject/scope and source conflict relationship.
3. Comparison of claims, source, epistemic state, timestamps, scope/window and evidence IDs.
4. Resolution guidance only from deterministic resolver.
5. Resolution through existing governance; otherwise read-only.

## 4. Interaction contract
Filter by category/scope/status; compare sources; inspect evidence; resolve only via supported owner. Preserve unresolved status if no authorized action exists.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test conflict membership from canonical records, not text similarity; ensure differing scopes/windows are not falsely merged; source freshness/authority; no silent auto-resolution.

**Definition of done:** Creators see genuine recorded conflicts, compare evidence and resolve safely. Without canonical detector, UI does not fabricate conflicts or imply completeness.

## 8. Dependencies and risks
Canonical conflict records or deterministic resolver; claim identity/scope; evidence provenance; governance action contract.

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
Plan and implement Brain Evidence Conflict Explorer only as supported by canonical records. Inspect docs/domains/BRAIN.md, this plan, EvidenceRecord.ts, ChannelKnowledgeProjection.ts, BrainMemoryClaims.ts, evidence quality/resolution services and governance. Verify whether runtime emits explicit CONFLICTING states or conflict relationships and identify owner. Audit did not verify a dedicated detector. Do not invent a conflict algorithm, second claim database, duplicate resolver or text-similarity queue. If no reliable conflict source exists, report blocker and show only explicitly marked records. For real conflicts show exact claims, scope, sources, IDs, timestamps/freshness and limitations side by side. Do not treat different windows/scopes as conflicts unless canonical contract says comparable. Never automatically choose a winner. Resolve only through authorized governance; otherwise read-only. Use existing Brain/Studio conventions and accessible responsive comparison. Test false-conflict prevention, scope/window semantics, provenance, permissions and governance. State complete/partial/blocked.
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
