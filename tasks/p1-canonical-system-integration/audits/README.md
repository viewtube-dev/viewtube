# P1 Audit Templates and Evidence Routing
**Class:** REFERENCE | **Status:** ACTIVE | **Last Edited:** 2026-10-29

Audits are point-in-time evidence, not architecture authorities or task ledgers. Findings must be routed to the existing owner and Task Authority.

## Required audit fields
- Date, target branch and exact commit SHA.
- Workstream and existing CAP/task IDs (do not invent unresolved IDs).
- Existing Work Checked: authority, capability home, plan family, code paths, tests, active PRs/branches and handoffs.
- Finding classification: VERIFIED / PARTIAL / NEEDS_DISCOVERY; CURRENT_MAIN / BRANCH_ONLY / PR_ONLY / PLANNED / SUPERSEDED / UNKNOWN.
- Exact path, symbol, caller, route, permission, persisted identity and test evidence.
- Canonical owner and proposed typed connection.
- Duplicate/overlap risk and no-loss donor disposition.
- Focused regression and runtime evidence required.
- Task Authority proposal/receipt destination.

## Six audit passes
1. Brain: profile and communication → context/evidence → task/action → operation/receipt → outcome/evaluation/learning.
2. Gemini: every provider SDK call, validation, model capability, gateway path, generation operation and secret exposure.
3. Diagnostics: all emitters/readers, correlation IDs, event ancestry, error taxonomy, user action and secret redaction.
4. Priority-25: exact identity, registry declaration, permission/context/provider gate, production caller and user-visible result.
5. Public resolver: handle normalization, source allowlist, cache key/TTL/negative cache, provenance, logged-out path and private-source denial.
6. Studio: token source, emitter, generated output, CSS cascade ownership, primitive exports, catalog references, consumer imports and visual certification.

Do not remove code or close donor work during audit. Produce a no-loss disposition and a separate implementation proposal.


## Latest completed audit
- [Phase 0 live repository reconciliation — 2026-10-30](phase-0-reconciliation-2026-10-30.md): merged donor PRs, current code owners, Priority-25 identity search, public resolver cache, Studio source-of-truth and remaining discovery gates.
