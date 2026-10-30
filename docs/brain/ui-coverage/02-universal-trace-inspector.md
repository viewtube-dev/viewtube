# Universal Brain Trace Inspector

**Status:** Proposed; not implemented  
**Priority:** P1  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Let creators inspect observable operation provenance—what ran, capabilities, evidence requested/returned/missing, context inclusion, prompt/model identity and output—without exposing private reasoning.

## 2. Existing footholds and verification
Footholds: `BrainTrace.ts` / `listBrainTraces`, `BrainRuntimeSnapshot.ts`, `BrainRuntimePanel.tsx`, `BrainAttributionDetailPanel.tsx`. The trace module documents a browser-local interim sink; verify active sink, retention and privacy before claiming durable/cross-device history.

## 3. Proposed page structure
1. Activity header with scope filters and retention notice.
2. Operation timeline: time, kind, status, capability and output ref.
3. Trace detail: intent, task profile, requested/returned/missing evidence, context included/dropped, latency, status and failure.
4. Provenance: prompt versions, requested vs served model/provider status, grader results and repair attempts when present.
5. Related records: exact evidence/output/receipt/outcome links only when IDs exist.

## 4. Interaction contract
Search/filter by date, kind, status and capability; open trace; follow exact IDs; copy trace ID. No replay or external action. Retry only if a distinct approved contract is wired.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test channel isolation, status variants, missing evidence, unavailable model identity, local/server sink disclosure, no chain-of-thought fields, output identity and keyboard use.

**Definition of done:** Creators understand operation-level provenance and follow exact references without seeing private chain-of-thought or being misled about durability.

## 8. Dependencies and risks
Trace sink and retention; operation identity; evidence/output refs; safe creator-facing field allowlist.

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
Implement the Universal Brain Trace Inspector. Inspect docs/domains/BRAIN.md, this plan, BrainTrace.ts, listBrainTraces, active trace sink, BrainRuntimeSnapshot.ts, BrainRuntimePanel.tsx, BrainAttributionDetailPanel.tsx, routes, tests and history. Build one creator-safe history/detail surface across supported Brain operation kinds, reusing existing trace and attribution contracts. Expose only stored fields: operation identity/kind/status, timestamps, capabilities, requested/returned/missing evidence, included/dropped context, prompt versions, requested/served model identity status, latency, failure, grader summary and output refs. Determine whether the active sink is local or server-backed and state retention honestly. Never expose chain-of-thought, secrets, raw provider payloads or unrelated creator data. Do not add another trace store or replay side effects. Preserve channel/project scope and exact IDs. Define all page states and responsive/accessibility behavior using Studio primitives. Test scope isolation, field allowlist, links and sink disclosure; run focused checks and actual mobile/desktop rendering. Report unverified areas.
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
