# Crown Executive Brief — Mission Priorities and Verification

**As of:** 2026-10-29  
**Repository target:** `master/consolidated-feature-integration`  
**Control Room implementation:** [PR #1167](https://github.com/viewtube-dev/viewtube/pull/1167)  
**Runtime contract:** read-only projection; source exclusively `.viewtube/exchange/**`.

## Executive assessment

Crown's mission records describe five cross-domain capability missions plus the active current-main backlog reconciliation. They are not equivalent in readiness. The five domain missions currently have work orders and schema-check receipts, but those receipts explicitly say no domain implementation has been executed under those missions. The backlog reconciliation has four partial receipts and is the only domain-level mission marked `in_progress`.

The Crown Control Room implementation is in a separate execution mission and draft PR #1167. The production build passed on the prior CI revision. The prior full-suite run exposed a defect in the new generator's mission-record validation; the generator has been repaired to require a non-empty `missionId`. A fresh CI run is in progress. Repository-wide typecheck and unrelated contract suites also report existing failures; do not attribute them all to Crown or waive them.

## Priority decisions

| Priority | Mission | Current evidence state | Why it matters | Next safe action |
|---|---|---|---|---|
| P0 | Crown Control Room Exchange runtime — `VT-MISSION-CROWN-control-room-exchange-runtime` | Draft PR #1167; build passed on earlier revision; generator regression repaired; fresh CI pending | Establishes a trustworthy, read-only executive view without creating a parallel authority | Finish focused generator tests, review typecheck/build, inspect changed files, and obtain independent verification before merge |
| P1 | Current-main backlog reconciliation — `VT-MISSION-current-main-backlog-reconciliation` | `in_progress`; receipts recon-01 through recon-04 are partial | Removes already-landed work from active intake and prevents duplicate implementations across the entire programme | Continue donor harvesting and inbound-reference rewiring; keep archives blocked until no-loss and reference gates pass; keep Task Index mutation proposal-only until the VNext writer is resolved |
| P1 | Citadel auth and sync recovery — `VT-MISSION-CITADEL-auth-sync-recovery` | High risk; work order planned; schema-check receipt partial; no implementation under this mission | Sign-in, selected-channel identity, YouTube capability and analytics hydration are foundational cross-system dependencies | Execute focused session/reconnect/cache-hydration tests without broadening OAuth scopes or creating duplicate auth/sync writers |
| P1 | Observatory dashboard evidence — `VT-MISSION-OBSERVATORY-dashboard-evidence` | Work order planned; schema-check receipt partial; L2 conflict open | Dashboard, analytics and Brain must agree on metric values, windows, grain and provenance | Resolve the recorded stale-base conflict first; refresh from current main and revalidate canonical owners and dashboard guardrails before implementation |
| P1 | Brain evidence and tool connection — `VT-MISSION-BRAIN-evidence-tool-connection` | Work order planned; schema-check receipt partial; no implementation under this mission | Grounds recommendations in bounded creator context and evidence while preserving user approval over tool actions | Verify one real recommendation-to-evidence-to-proposal path; keep proposals separate from external execution |
| P2 | Forge video package and editor — `VT-MISSION-FORGE-video-package-editor` | Work order planned; schema-check receipt partial; no implementation under this mission | Preserves project identity and asset provenance through editor/render, with publish kept separate | Prove one vertical package-to-editor-to-render path and preview/export parity for supported features |
| P2 | Compass task and artifact consolidation — `VT-MISSION-COMPASS-task-artifact-consolidation` | Work order planned; schema-check receipt partial; no Task Index mutation | Makes historical plans and artifacts traceable without a second task ledger | Produce source-linked dossiers and read-only task links; defer lifecycle changes to Task Authority |

## Cross-mission blockers and dependencies

1. **Task Index VNext writer/storage is unresolved.** No Crown surface or mission may mutate canonical task lifecycle until Task Authority confirms the active writer.
2. **Observatory has an open L2 base-drift conflict.** The recorded recommendation is to refresh its branch from current main before dashboard runtime changes.
3. **Backlog donor archival is not complete.** Recon-03 found live inbound references; recon-04 confirms only one of four principal donor sources is archive-safe. Keep remaining donors intact until harvesting and reference migration are proven.
4. **Schema-check receipts are not implementation receipts.** Brain, Citadel, Compass, Forge and Observatory must remain unverified until their real acceptance criteria are exercised.
5. **Control Room CI is not release certification.** A green build does not prove read-only behavior in the served app, correct responsive rendering, accessibility, or accurate evidence classification.

## Verification snapshot — PR #1167

- Production build: PASS on the previously tested revision.
- Public page resolver tests: PASS on the previously tested revision.
- Brain quality loop: PASS on the previously tested revision.
- Local smoke: PASS on the previously tested revision.
- Typecheck: FAIL with multiple repository-wide errors in Brain, Studio Controls/catalog and lazy-route typing.
- Full suite: FAIL; the new generator test previously found a missing `missionId` validation case. That code has been repaired; rerun evidence is pending.
- Focused contracts and Studio source-governance suite: FAIL with many existing component/catalog/CSS contract assertions.
- Deployment checks: not a release signal; external deployment rate limiting must not be confused with test evidence.

See [PR #1167](https://github.com/viewtube-dev/viewtube/pull/1167) and its [Actions runs](https://github.com/viewtube-dev/viewtube/actions?query=branch%3Afeat%2Fcrown-exchange-readonly-runtime).

## Executive direction

- Finish the Crown runtime verification slice first; keep PR #1167 draft until the generator test, typecheck/build results and independent review are reconciled.
- Keep backlog reconciliation active because it prevents duplicate work and determines the trustworthy remaining programme.
- Start Citadel as the highest-risk domain execution after assigning a current-main checkout and current canonical owners.
- Resolve Observatory's L2 conflict before any dashboard implementation.
- Execute Brain and Forge as bounded vertical slices with explicit evidence and runtime receipts.
- Keep Compass read-only and downstream of the Task Authority decision.

**Authority note:** This brief is a derived prioritization view, not a task ledger, mission-state writer, product decision or completion receipt. Royal Exchange records remain the source for Crown mission/execution evidence; Task Authority remains the only canonical task lifecycle authority.
