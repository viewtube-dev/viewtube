# Universal Evidence Lineage

**Status:** Proposed; not implemented  
**Priority:** P2  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Let creators follow verified ancestry of a recommendation or artifact—source evidence, context, operation, output, decision, execution, measured outcome and learning—with missing/unverified edges explicit.

## 2. Existing footholds and verification
Footholds: `EvidenceLineageDiagnostics.ts` is documented as read-only reconstruction over ContentBuild events and Algorithm Intelligence ledger, with bounded coverage. Do not claim it proves external evidence or every Brain operation.

## 3. Proposed page structure
1. Header with root record/scope.
2. Graph/timeline of verified records and explicit missing/unverified edges.
3. Stage detail: source event, parent IDs, evidence/output IDs, operation/receipt and status.
4. Coverage boundary listing inspected ledgers and sources outside projection.
5. Exact links to evidence, trace, asset, project or evaluation.

## 4. Interaction contract
Select root; expand ancestors/descendants; switch graph/timeline; open exact related records. Never infer edges by time proximity or project co-membership.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test cycles, duplicate/missing parents, delayed parents, unresolved refs, idempotency, external-source boundary and no inferred edges.

**Definition of done:** Creators distinguish verified ancestry from incomplete/unverified relationships and know which ledgers support the view.

## 8. Dependencies and risks
EvidenceLineageDiagnostics; ContentBuild parent links; Algorithm ledger; BrainTrace/evidence refs; stable operation/output IDs.

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
Implement Universal Evidence Lineage. Inspect docs/domains/BRAIN.md, docs/programs/INTEGRATED_APPLICATION.md, this plan, EvidenceLineageDiagnostics.ts, ContentBuild event contracts, Algorithm Intelligence ledger, BrainTrace, EvidenceRecord and asset/project provenance. Map exactly what diagnostics reconstruct. Documented coverage is ContentBuild ancestry plus Algorithm Intelligence ledger; it does not prove every external evidence reference or every Brain operation. Build a graph/timeline over canonical IDs. Show verified links, missing parents, duplicate IDs, cycles, unresolved refs and unverified/external edges distinctly. Connect traces, evidence, outputs, receipts, creator decisions, outcomes and learning only with exact stable identity or explicit ancestry. Never infer causality from time/name/project. Do not create another ledger or relationship database. Keep projection read-only unless owner APIs explicitly allow more. Provide accessible timeline/list alternative, mobile layout and scope filters. Test cycles, delayed parents, duplicates, unresolved refs and false-edge prevention. Report proven/incomplete/unverified/out-of-scope stages.
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
