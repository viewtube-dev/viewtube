# Communication Evidence Review

**Status:** Proposed; not implemented  
**Priority:** P2  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Give creators control over knowledge candidates derived from their interactions: instructions, preferences, corrections, goals, constraints, approvals and rejections—without turning every message into durable memory.

## 2. Existing footholds and verification
Backend gate: targeted current-branch search did not verify a definitive `BrainCommunicationIngestion` implementation. Locate actual communication writer, schema, read API and governance path. Do not assume the symbol or queue exists.

## 3. Proposed page structure
1. Review queue only if canonical queue exists.
2. Candidate card: exact original wording/reference, classification, proposed normalized claim, scope and stored confidence/source metadata.
3. Evidence context: related interactions and claims.
4. Review detail: confirm/edit/reject/defer/scope actions only if governance supports them.
5. History: authoritative decision and resulting record IDs.

## 4. Interaction contract
Preserve original words exactly; edit normalized interpretation separately; review one candidate; inspect authoritative result. Never auto-apply.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** First verify a real pipeline. Then test raw-text preservation, deduplication, creator/channel scope, classification uncertainty, state transitions and no direct durable writes.

**Definition of done:** Creators can see what Brain may have learned, distinguish exact words from interpretation and decide through governed workflow. If no pipeline exists, feature remains blocked/read-only.

## 8. Dependencies and risks
Verified communication event writer/schema; candidate read API; governance API; raw message identity and privacy policy.

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
Plan and only if canonical contracts exist implement Brain Communication Evidence Review. Inspect docs/domains/BRAIN.md, this plan, conversation persistence, feedback/learning capture, BrainMemoryClaims.ts, Channel Knowledge governance and search current code for ingestion/read APIs. The audit did not confirm the previously named BrainCommunicationIngestion symbol. Do not invent it, create a parallel store or assume candidates exist. Map actual writer, schema, read path and governance owner. If an essential owner is absent, report the blocker and deliver only a read-only design backed by real records. Where candidates exist, show exact original creator wording separately from normalized interpretation, with stored classification, scope, evidence, uncertainty and lifecycle. Allow actions only through existing governance. Approval for review must not silently promote durable knowledge. Preserve raw user messages byte-for-byte. Respect privacy, retention and creator/channel isolation. Use Studio primitives, responsive/accessibility behavior and all honest page states. Test raw-text integrity, scope, permissions and lifecycle. State proven/claimed/unknown backend support.
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
