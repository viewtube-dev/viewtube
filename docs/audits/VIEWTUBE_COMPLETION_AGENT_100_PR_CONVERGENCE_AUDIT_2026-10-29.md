# ViewTube Completion Agent — 100-PR Convergence Audit Report

**Audit date:** 2026-10-29  
**Repository:** `viewtube-dev/viewtube`  
**Audit window:** PRs #1068–#1167 (100 PRs)  
**Report branch:** `docs/completion-agent-audit-report-2026-10-29`  
**Related agent:** `docs/agents/cs-viewtube-completion-agent.md`  
**Primary release authority:** `main`  
**Feature integration line reviewed in the prior audit:** `master/consolidated-feature-integration`

> **Evidence and provenance note:** This document consolidates the findings returned by the preceding completion-agent audit in this conversation. The agent contract was re-read from the integration branch while preparing this report. The underlying 100-PR inventory, CI runs, branch comparisons, and file-level findings were not all re-executed during report publication. Accordingly, figures and findings below are explicitly attributed to the prior audit and are not represented as a fresh independent reproduction. Re-run the listed checks before using this report as a release sign-off.

## 1. Executive verdict

**NOT RELEASE-READY — production/integration authority divergence and failing quality gates remain the primary blockers.**

The preceding audit reported substantial completed and partially completed work across Brain, Studio, Calendar, Gemini/provider governance, diagnostics, public-channel resolution, and capability restoration. It also reported that most recent PRs targeted the long-lived consolidated integration branch rather than production `main`.

The correct next move is controlled reconciliation and certification—not wholesale merging of the integration branch, replaying every closed PR, or starting parallel implementations.

The completion agent's own rules require:
- one production owner per concern;
- current `main`, tests, and living authority documents to outrank older plans and donor branches;
- preservation of IDs, provenance, controls, and approvals across handoffs;
- focused regression coverage for each connected vertical slice;
- release certification across build, types, tests, responsive states, and consequential flows.

## 2. Scope and inventory reported by the preceding audit

| Measure | Prior audit result |
|---|---:|
| PRs examined | 100 |
| PR range | #1068–#1167 |
| Merged | 73 |
| Closed, unmerged | 24 |
| Open | 3 |
| Unique source branches | 94 |
| PRs targeting `master/consolidated-feature-integration` | 97 |
| PRs targeting `main` | 3 |

The preceding audit stated that it reviewed PR metadata and file manifests for the 100-PR window, compared 27 non-merged PR heads against the integration head, and examined relevant merged diffs, supersession relationships, authority documents, and GitHub Actions results.

**Coverage limitation:** It did not perform a local checkout, independently run tests on all 94 branches, or conduct a line-by-line review of every merged PR diff. The inventory counts above therefore remain prior-audit findings pending a fresh reproducible export.

## 3. Branch authority and divergence

The prior audit reported the following repository state:

| Ref | Reported commit |
|---|---|
| Production `main` | `f9b5ef8` |
| `master/consolidated-feature-integration` | `a338f0f` |

It reported the integration branch as 6,933 commits ahead and production as 67 commits ahead, with the branches diverged.

The repository metadata was rechecked during report preparation and identifies `main` as the default branch. The completion-agent contract says current `main`, tests, and living authority documents outrank older plans and donor branches. Therefore:

1. Treat `main` as the production/release authority.
2. Treat the consolidated integration branch as a donor/workstream line, not a competing release authority.
3. Do not merge the integration branch wholesale.
4. Build a capability-by-capability migration map, including dependencies, canonical owners, tests, and provenance.
5. Preserve unique work from closed/unmerged PRs before considering archival or deletion.

The exact commit SHAs and ahead/behind counts are time-sensitive and must be refreshed before any migration or release decision.

## 4. CI and release-gate findings from the prior audit

### Production `main`

The prior audit reported the latest production workflow run, [#40924020603](https://github.com/viewtube-dev/viewtube/actions/runs/40924020603), as failed.

Reported build-breaking source:
`src/components/subtoolbox/SubToolboxSplitStepper.tsx`

The reported defect was literal escaped newline text embedded in TypeScript source, resulting in Vite's `Invalid Unicode escape sequence` error and TypeScript parsing failures.

Other reported failing gates:
- local application smoke test;
- full Vitest suite;
- focused contracts;
- typecheck;
- production build.

The prior audit identified closed, unmerged PR #1126 as a possible donor for the narrow syntax repair. It also reported that PR #1126 changes API-key/account-plan access policy. **Do not merge that PR wholesale to obtain the syntax fix.** Extract and review the source repair independently; separately security-review the BYOK policy change.

The prior audit also reported that PR #1156's crash-regression test failed because the Confirmed Primitive Catalog source it expected could not be discovered on `main`. Reconcile the test's source assumptions with the production architecture instead of weakening or deleting the test without evidence.

### Consolidated integration branch

The prior audit reported workflow run [#40963277292](https://github.com/viewtube-dev/viewtube/actions/runs/40963277292) with:

| Gate | Prior reported result |
|---|---|
| Production build | Passed |
| Local smoke | Passed |
| Brain quality loop | Passed |
| Full suite | Failed |
| Typecheck | Failed |
| Focused contracts | Failed |
| Source governance | Failed |

Reported failure families included Brain retry-evidence fixture type mismatches, opportunity-evidence typing mismatches, missing Studio exports/modules, stale Brain runtime test exports, a missing testing-library dependency, and Studio primitive catalog/CSS ownership assertions.

These are historical findings from the prior audit, not a claim that those workflow runs are still the latest or that the failures remain unchanged. Refresh workflow status and logs before acting.

## 5. Workstream completion classifications

The preceding audit used the agent's classifications: **DONE, PARTIAL, CONNECT, HARDEN, CERTIFY, REMOVE**. Its reported assessments are summarized below.

| Workstream | Prior classification | Outstanding evidence or work |
|---|---|---|
| Brain creator profile and evidence | PARTIAL / CONNECT | Production migration, canonical persistence, typecheck, and end-to-end continuity |
| Brain composer and draft recovery | PARTIAL / HARDEN | Runtime and regression certification |
| Brain crash diagnostics | HARDEN / CERTIFY | Evidence-backed root cause and regression closure |
| Gemini governance | PARTIAL / CONNECT | Verify every generation operation uses canonical provider/key governance |
| Unified diagnostics | CONNECT / HARDEN | Prove coverage across all six intended systems |
| Studio Controls | HARDEN / CERTIFY | Catalog, exports, CSS ownership, and source-governance tests |
| Studio Calendar | PARTIAL / CERTIFY | YouTube schedule/live-state reconciliation and visual certification |
| Priority-25 capabilities | CONNECT / CERTIFY | Verify actual caller, backend, authorization, persistence, and runtime behavior per capability |
| Public Page Resolver | HARDEN / CERTIFY | Production integration and public-data/security verification |
| Crown Control Room | PARTIAL | Prior audit described exchange-only implementation in draft PR #1167 |

### High-priority PR-specific findings

**PR #1132 — Priority-25 capability restoration**

The prior audit reported that this PR restored 117 previously flattened files to intended `src/` locations, wired capability routes, and added canonical page-registry entries while keeping capabilities hidden/lab by default. Its description reportedly said implementations were relocated rather than rewritten and that typecheck, route checks, and Vitest had not been run.

**Completion rule:** A restored file or registered route is not proof of a working capability. Create a per-capability matrix proving UI entry point → caller → service/API → authorization → persistence/output → error/retry behavior → tests.

**PR #1126 — production build repair donor**

Treat the syntax repair and BYOK access-policy changes as separate review units. No broad cherry-pick or merge based solely on the build fix.

**PR #1156 — crash-regression test**

Resolve the production source/catalog mismatch with an architecture-backed fixture or canonical source. Preserve the regression intent.

**PRs #1160 and #1166 — Calendar**

The prior audit reported Project ownership was preserved and no second scheduling store was introduced. Remaining work included YouTube scheduled/live-state reconciliation, CI repair, and desktop/mobile visual certification.

**Brain evidence lineage**

The prior audit identified PRs #1069, #1086, and #1094 as substantial progress toward canonical creator-context persistence and evidence continuity. It described closed branches #1083, #1084, #1079, and #1087 as duplicate or superseded attempts. Confirm commit-level lineage before replaying or discarding any donor work.

## 6. Duplicate and superseded work families

The preceding audit recommended consolidation rather than independent replay:

| Work family | Prior recommended baseline / handling |
|---|---|
| Studio primitive catalog | Reconcile #1073, #1074, #1082, and later merged work |
| Studio token parity | Use #1076 plus the current target state |
| Studio upload frame/catalog | Prefer later merged implementations over old #1099 |
| Brain creator evidence | Reconcile #1069, #1086, and #1094 |
| Brain workspace | Reconcile #1098 and #1100 |
| Gemini validation | Reconcile #1124 and #1116; inspect remaining fallback differences |
| Public resolver tests | Use #1121 as a candidate baseline |
| Studio canonical file locations | Prefer #1129 over #1128 |
| Split-input repair | Use #1159 as the merged implementation baseline |

The prior audit also noted six source branch names reused by multiple PRs. A fresh lineage ledger must map each PR to its exact head SHA and merge commit; a branch name alone is not sufficient provenance.

## 7. Completion-agent governance follow-up

The agent file currently declares `skills: viewtube-completion-program` and describes repository-native skills, Herald contracts, tests, and living architecture documents as its skill integration. The prior audit reported that the named skill directory was absent in the inspected trees and identified `.claude/skills/viewtube-one-goal-completion/SKILL.md` as a compatibility skill pointing to newer authorities.

This report does not independently certify the current skill-directory state. The follow-up is to verify the actual repository tree and either:
- create/restore the declared skill at its canonical path with current authoritative instructions; or
- update the agent frontmatter and references to the existing canonical skill and current Product Completion Constitution / Integrated Application Program authorities.

Do not leave a dangling skill reference.

## 8. Dependency-ordered completion programme

### P0 — Restore a trustworthy production baseline

- [ ] Refresh current `main` SHA and workflow runs.
- [ ] Reproduce the `SubToolboxSplitStepper.tsx` parse/build failure on a clean `main` checkout.
- [ ] Extract only the narrow syntax repair from the PR #1126 donor; review BYOK policy separately.
- [ ] Repair the PR #1156 test/source mismatch without weakening regression intent.
- [ ] Run focused tests, typecheck, and production build.
- [ ] Record baseline failures separately from newly introduced failures.

**Exit criteria:** production source parses; typecheck and build are green; focused regression coverage is green; remaining full-suite failures are enumerated with owners and evidence.

### P0 — Reconcile branches, PRs, and task authority

- [ ] Re-export PRs #1068–#1167, including exact head/base SHAs, merge commits, files, checks, and branch reuse.
- [ ] Recompute the 94-branch inventory and all 27 non-merged comparisons.
- [ ] Map each unique capability/change to its canonical production home on `main`.
- [ ] Mark each donor as migrate, already represented, superseded, duplicate, or unresolved.
- [ ] Preserve unique commits and evidence before archiving branches.
- [ ] Publish a dependency graph for migration slices; never merge the integration branch wholesale.

**Exit criteria:** every PR in scope has a disposition and traceable commit lineage; no unique work is silently lost; `main` remains the sole production authority.

### P1 — Canonical system integration

- [ ] Brain profile, evidence, interaction, and outcome continuity.
- [ ] Gemini provider registry, key validation, and generation-operation governance.
- [ ] Unified diagnostics across the six requested systems, with shared event identity and actionable evidence.
- [ ] Priority-25 capability verification at runtime, not merely file/route restoration.
- [ ] Public resolver production integration, caching, provenance, and public-only boundaries.
- [ ] Studio Controls token, CSS, primitive, catalog, and export ownership convergence.

**Exit criteria:** each consequential path has one canonical owner, typed connections, preserved identity/provenance, and focused regression tests.

### P1 — Product completion and UX certification

- [ ] Calendar reconciliation with YouTube scheduled/live state.
- [ ] Studio Hub representative coverage for every canonical primitive.
- [ ] Brain composer/workspace desktop and mobile behavior.
- [ ] Loading, empty, disconnected, permission-denied, retry, and failure states.
- [ ] Cross-system evidence and execution identity continuity.

**Exit criteria:** all user-facing critical paths work in supported viewport classes and recover safely from external/API failures.

### P2 — Independent release certification

- [ ] Full Vitest suite and focused contracts.
- [ ] Typecheck, lint, and production build.
- [ ] Architecture/source-governance audits.
- [ ] Desktop, narrow desktop, mobile portrait, and landscape browser checks.
- [ ] Authenticated and unauthenticated integration flows.
- [ ] Independent review receipts and reproducible evidence.
- [ ] Update living architecture documents, completion ledger, task authority, and handoff records.

**Exit criteria:** no unexplained regressions against the same-day baseline; every completion claim links to a test, workflow, PR, or runtime receipt.

## 9. Required evidence ledger format

Every original user instruction/request/demand must be represented as one concise, independently checkable row. Do not collapse multiple requests into an ambiguous status.

| ID | User request / phase | Expected result | Status | Evidence / test | PR | Remaining gap |
|---|---|---|---|---|---|---|
| AUD-001 | Audit all work in PRs #1068–#1167 and connected branches | PR/branch inventory and dispositions | Prior audit reported; refresh required | PR export + SHA lineage ledger | — | Reproduce inventory |
| AUD-002 | Establish production vs integration authority | One production release authority | Blocked per prior audit | Current repo metadata, CLAUDE.md, compare refs | — | Controlled migration |
| AUD-003 | Restore production integrity | Green parse/build/type baseline | Open per prior audit | CI run + focused tests | — | Reproduce and repair |
| AUD-004 | Reconcile unique work without duplication | Every donor has a disposition | Partial per prior audit | Commit lineage + capability map | — | Refresh exact ancestry |
| AUD-005 | Certify canonical system integration | Connected, tested production paths | Partial per workstream | Tests, runtime receipts, architecture checks | — | Complete P1 slices |
| AUD-006 | Certify product and release readiness | Independent end-to-end evidence | Not certified | Full CI + browser + release evidence | — | Complete P2 |

**Ledger rules**
- Use one row per atomic user request or implementation phase.
- Status values: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `PARTIAL`, `CONFIRMED`, `SUPERSEDED`.
- `CONFIRMED` requires evidence, not an assertion or merged-PR status.
- Record the exact PR that delivered the result; if multiple PRs were required, list all.
- Record test/workflow URL, commit SHA, and date where available.
- Keep failed and superseded attempts visible; never erase history to make the programme look complete.

## 10. Immediate next execution sequence

1. Re-fetch `main` and integration heads, the current `CLAUDE.md`, and the current CI runs.
2. Reproduce the reported production parser failure on a clean `main` worktree.
3. Prepare a minimal production-based repair PR, with the BYOK policy change excluded.
4. Re-run production gates and resolve the #1156 regression fixture mismatch.
5. Generate the complete PR/branch lineage ledger from GitHub metadata.
6. Create separate dependency-ordered migration plans for the unique integration workstreams.
7. Execute one canonical vertical slice at a time, with tests and evidence before opening each implementation PR.

## 11. Sources and references

- [Completion agent](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/agents/cs-viewtube-completion-agent.md)
- [Repository](https://github.com/viewtube-dev/viewtube)
- [Production workflow run #40924020603](https://github.com/viewtube-dev/viewtube/actions/runs/40924020603)
- [Integration workflow run #40963277292](https://github.com/viewtube-dev/viewtube/actions/runs/40963277292)
- [PR #1126](https://github.com/viewtube-dev/viewtube/pull/1126)
- [PR #1132](https://github.com/viewtube-dev/viewtube/pull/1132)
- [PR #1156](https://github.com/viewtube-dev/viewtube/pull/1156)
- [PR #1160](https://github.com/viewtube-dev/viewtube/pull/1160)
- [PR #1166](https://github.com/viewtube-dev/viewtube/pull/1166)
- [PR #1167](https://github.com/viewtube-dev/viewtube/pull/1167)

---

**Report status:** Published as an audit/consolidation artifact. This document is not a release approval, does not claim that outstanding implementation work is complete, and does not replace fresh CI or branch-level verification.
