# Creator Style Fingerprint

**Status:** Proposed; not implemented  
**Priority:** P2  
**Destination:** Existing Brain Hub; exact route to verify

## 1. Creator outcome
Make the channel style model understandable and teachable through measurable characteristics and real exemplars, not invented personality scores.

## 2. Existing footholds and verification
Footholds: `StyleProfile.ts`, `styleMetrics.ts`; repository classification identifies a governed generation dependency through AssetGenerator. Verify stored dimensions, examples and creator-edit API.

## 3. Proposed page structure
1. Style summary with profile scope/version and supported dimensions.
2. Dimension views for only supported voice, vocabulary, pacing, structure and visual preferences.
3. Exemplars with source asset/content and provenance.
4. Draft-vs-approved differences only where paired records exist.
5. Corrections only through canonical creator-controlled style governance.

## 4. Interaction contract
Switch supported scope; open exemplars; inspect metric definitions; compare exact draft/approved pair; submit correction only if update contract exists.

## 5. Data and architecture boundaries
Read from canonical owners. Preserve exact IDs, scope, timestamps, provenance and epistemic state. Mutations must use existing authorized owner/governance APIs. Unsupported backend capability is a blocker, not a reason to create local fake state.

## 6. Required states and experience
Implement shared loading, populated, empty, partial/stale, unavailable/permission-blocked and error states. Responsive desktop/mobile composition, long-content handling, keyboard and screen-reader access, visible focus, status announcements and reduced motion are required. Use current Studio primitives/tokens.

## 7. Tests and acceptance
**Required tests:** Test profile scope/version, unsupported metric omission, exemplar provenance, exact asset pairing, permissions and no fabricated scores.

**Definition of done:** Creators understand supported style dimensions, see real examples and can correct through real owner; no pseudo-precision.

## 8. Dependencies and risks
StyleProfile read contract; styleMetrics; AssetGenerator; canonical update semantics; paired asset lineage.

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
Implement the Creator Style Fingerprint. Inspect docs/domains/BRAIN.md, this plan, StyleProfile.ts, styleMetrics.ts, AssetGenerator callers, asset outcome/diff records, My Brain surfaces and tests. Build a faithful style profile using only dimensions the canonical contracts provide. Explain each metric, show scope/version and link real exemplars. Omit unsupported dimensions; do not invent scores, percentiles, voice labels or personality traits. Show draft/creator-approved pairs only when exact identity links exist, never infer from timestamps or similar titles. Editing requires a verified canonical style-governance API; otherwise remain read-only. Reuse Brain Hub and Studio primitives/tokens. Support responsive desktop/mobile, keyboard/screen readers, focus, reduced motion and all page states. Test metric provenance, profile scope, exemplar IDs and pair identity. Run focused tests and actual rendered checks; report supported and unsupported dimensions.
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
