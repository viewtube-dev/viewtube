# Research Source & Provenance View

**Status:** Proposed; not implemented  
**Priority:** P3  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Make externally researched information inspectable: actual sources consulted, when, for which task, which claims they support and where coverage is incomplete.

## 2. Existing footholds and verification
Foothold: `BrainContextBroker.ts` accepts `currentResearch` text, but a canonical research source-record/receipt owner was not established. Identify actual research execution, source schema, retention and citation contract.

## 3. Proposed page structure
1. Research session header with operation/task identity and fetched time when available.
2. Source list with canonical source IDs, title/domain, retrieved time and status.
3. Claim-source mapping using explicit references.
4. Source detail with permitted excerpt/metadata, URL and freshness.
5. Gaps: missing, failed, stale, inaccessible or unlinked sources.

## 4. Interaction contract
Open original sources; filter status/domain/time; navigate from answer to exact session/source. No fabricated citations or arbitrary re-fetch.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test source IDs, claim mapping, URL safety, timestamp accuracy, failure/unavailable states, retention/licensing and session/channel isolation.

**Definition of done:** Creators inspect actual sources behind research-backed answers and distinguish fetched evidence from unsupported narrative. If only text is passed, show provenance unavailable.

## 8. Dependencies and risks
Verified research operation owner; source schema; source/claim refs; timestamps; retention/licensing and URL safety.

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
Plan and implement Brain Research Source & Provenance view. Inspect docs/domains/BRAIN.md, this plan, BrainContextBroker.ts, actual research execution/callers, operation records, receipts, source metadata, prompt/context assembly and tests. Audit verified currentResearch text input but did not establish a canonical source-record owner. Trace the producer and determine whether stable source IDs, original URLs, fetched timestamps, excerpts, claim mappings and retention metadata exist. Never infer citations from plain text, snippets or model-generated references. If only a text blob exists, show provenance unavailable and document the missing contract. Where records exist, show session identity, source title/domain, retrieved time, status, permitted excerpt, original URL and explicit claim-source links. Respect privacy, licensing, retention, URL safety and channel/project scope. Do not create another research store or fetch engine. Use existing operation owner and Brain navigation. Build responsive accessible states. Test identity, mapping, timestamps, URL safety and session isolation. Report whether fully implementable or blocked.
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
