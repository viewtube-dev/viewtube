# Channel Knowledge Map

**Status:** Proposed; not implemented  
**Priority:** P1  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Make channel knowledge transparent and correctable: what Brain believes, why, whether confirmed or inferred, and how a creator can correct/expire it through canonical governance.

## 2. Existing footholds and verification
Footholds: `ChannelProfileAdapter.ts`, `ChannelKnowledgeProjection.ts`, `BrainMemoryClaims.ts`, ChannelIntelligence and Creator Context reachability inventory. Confirm exact write/governance API before enabling edits.

## 3. Proposed page structure
1. Overview grouped by actual lifecycle/epistemic state.
2. Knowledge groups using real projection categories.
3. Claim list with statement, class, status, scope, source and timestamps when present.
4. Claim detail with evidence refs, supporting/conflicting sources, history and provenance.
5. Review actions: confirm, correct, reject, narrow or expire only through authorized governance.

## 4. Interaction contract
Search/filter claims; inspect source evidence; submit correction/review; compare current/proposed values; display authoritative outcome. No direct model writes.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test creator/channel isolation, lifecycle, evidence IDs, stale/conflicting claims, permissions, validation, governance response and rollback.

**Definition of done:** Creators inspect provisional and active knowledge, understand source/scope and correct it without bypassing governance or creating another memory store.

## 8. Dependencies and risks
Knowledge projection; authorized mutation/review API; identity/scope; evidence refs; lifecycle and expiry semantics.

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
Implement the Brain Channel Knowledge Map. Inspect docs/domains/BRAIN.md, this plan, ChannelProfileAdapter.ts, ChannelKnowledgeProjection.ts, BrainMemoryClaims.ts, Channel Profile/Knowledge governance APIs, existing My Brain surfaces, tests and history. Build a creator-facing page over the canonical projection. Group/filter real claims and distinguish creator-confirmed, observed, inferred, provisional, stale, conflicting and expired only where the source contract supports them. Show actual scope, evidence refs, source, provenance, status and timestamps. Enable confirm/correct/reject/narrow/expire only through an existing authorized governance operation. Verify every action API first; if unsupported, keep read-only and report the gap. Never promote model output directly or create a new memory database, claim registry or parallel learning path. Reuse Brain Hub and Studio primitives. Add all page states, responsive and accessible behavior. Test scope, evidence links, permissions and lifecycle transitions. Run focused tests, typecheck/build and actual mobile/desktop checks; report gaps honestly.
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
