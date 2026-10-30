# P1 Workstream → Existing Task Crosswalk
**Production Date:** 2026-10-30 | **Last Edited:** 2026-10-30 | **Class:** REFERENCE | **Status:** ACTIVE — PROPOSAL ONLY
**Concern:** prevent duplicate task creation and preserve existing VT identities | **Owner:** Task Authority / Integrated Application Program
**Registry ID:** DOC-REF-P1-TASK-CROSSWALK
**Audited target SHA:** d62d0aa4fcb09515a7b0d636a13fc6ee6f47d5e0

## Task identity warning
`docs/governance/TASK_AUTHORITY.md` is the canonical lifecycle/identity authority, but Task Index VNext structured storage/writer is not yet committed. `tasks/viewtube-one-goal-status.md` explicitly remains a temporary human-readable projection. This crosswalk is not a task ledger and does not mutate status. Do not allocate new permanent IDs here.

## Existing task relationships

| P1 workstream | Existing task IDs / references | Relationship | Remaining distinction |
|---|---|---|---|
| Brain continuity | VT-003, VT-004, VT-019, VT-020, VT-021, VT-022, VT-035 | CONTINUATION / EXPANDS | Profile/evidence/context/outcome continuity needs an end-to-end identity receipt; no new Brain store |
| Gemini provider/key/generation | VT-020, VT-021; merged PRs #1109/#1168/#1169/#1174 | CONTINUATION / VERIFICATION | Existing generator migrations and provider plans; key security decision and caller reachability remain |
| Unified diagnostics | VT-005, VT-035, VT-036, VT-046 | CONTINUATION / EXPANDS | Extend OperationEnvelope and existing diagnostics; runtime coverage across six systems remains |
| Priority-25 runtime | None proven | UNRESOLVED | VT-025 is unrelated Analytics task; do not substitute |
| Public resolver | Roadmap item 19 in stale capability scaffold; existing Settings/Brain runtime source | IMPLEMENTATION / CERTIFICATION ID UNRESOLVED | Production code is source-wired; no permanent VT task identity found in current projection |
| Studio Controls | VT-032, VT-033; donor PRs #935/#988/#992; merged #1203 | RELATED / EXPANDS | Existing tasks are broad UI cleanup P2; no dedicated P1 Studio convergence task identity found |

## Relevant task details from the temporary projection
- **VT-003 (P0 VERIFYING):** resolve active Project/ContentBuild context uniformly; remaining proof across non-dashboard BrainRuntime consumers.
- **VT-004 (P0 VERIFYING):** canonical Opportunity evidence feed; remaining shared production feed certification.
- **VT-005 (P0 IN_PROGRESS):** typed OperationEnvelope/idempotency contract; current note says focused tests exist, CI/runtime verification pending.
- **VT-006 (P0 READY):** map producer families to existing ledgers/events.
- **VT-019 (P1 READY):** classify/fix implicit readBrainUserControls scope.
- **VT-020/#021 (P1 NOT_STARTED):** migrate Hook Generator and Script Architect through canonical generation/runtime.
- **VT-022 (P1 NOT_STARTED):** versioned AI regression/evaluation corpus.
- **VT-025 (P1 IN_PROGRESS):** retire legacy Analytics selectors/cache consumers — not Priority-25 runtime.
- **VT-032/#033 (P2 IN_PROGRESS):** broad UI primitive/shell convergence; not a dedicated Studio Controls P1 task.
- **VT-034 (P1 NOT_STARTED):** persistence schema/channel/project namespace audit.
- **VT-035 (P1 NOT_STARTED):** correlation IDs across Brain→build→publish→evaluation.
- **VT-036 (P1 NOT_STARTED):** structured error/failure-state taxonomy.
- **VT-046 (P1 NOT_STARTED):** failure-path E2E matrix.

## Task Authority next steps
1. Resolve Priority-25's source identity and intended user journey.
2. Reconcile whether Brain/Gemini work is a continuation of VT-020/021 or a separate verification-only proposal.
3. Attach diagnostics work to VT-005/035/036 and VT-046 acceptance evidence.
4. Propose a dedicated public-resolver certification task only after checking the Task Authority history and the roadmap item 19 provenance.
5. Propose a dedicated Studio Controls P1 integration task only after reviewing VT-032/033 scope and donor PR history.
6. Use Task Authority mutation proposal only when canonical Task Index writer/storage path is positively resolved.
