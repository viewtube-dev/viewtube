# Studio Controls Regression Recovery — Conversation Handoff

**Conversation date:** 2026-10-30  
**Conversation name:** Studio Controls regression recovery and handoff  
**Application / product:** ViewTube  
**Source application:** ChatGPT  
**Source conversation link:** UNKNOWN — no verified share URL was supplied  
**Repository:** viewtube-dev/viewtube  
**Intended target branch:** master/consolidated-feature-integration  
**Last updated:** 2026-10-30  
**Package status:** PARTIALLY_RECONCILED

> Update this exact package in place. Preserve its history and update handoff.md, worklog.json and review.md together; do not create a duplicate package.

## Executive handoff — ten sentences maximum

1. This conversation concerns recovery of Studio Controls field-stroke and split-family geometry regressions.
2. The final field contract is a primary-colored inline glyph stroke on every text field in every state, including TextBox; TextBox retains black text and a black outer border.
3. The simple input must retain its primary inline glyph stroke at rest and focus.
4. Split-family rails and icon sections must be square, top-split sizing must account for both outer strokes, and intermodules must fill the available row.
5. Regression assertions were added or revised, but no focused tests, build, or browser visual verification were run in this conversation.
6. PR #923 is closed and unmerged; GitHub reports eight commits unique to its source branch relative to the target and 1,903 target commits beyond the branch.
7. The observed source head is 9bb5424896765e1a348f0a8e37846c426c0f31d8; PR-opening head and post-opening lineage are unknown.
8. The branch is not safe to merge wholesale; recover only changes proven missing and still correct on the current target.
9. This package records evidence and open acceptance work without treating conversation-local implementation as canonical completion.
10. Next: reconcile the eight unique commits, selectively recover on a fresh target-based branch, then run focused tests/build and desktop/mobile visual checks.

## Unfinished work — single-line checkboxes

- [ ] VT-CWI-001 — Reconcile eight unique commits on codex/studio-controls-regression-recovery against current target and selectively recover still-useful changes — PARTIAL — PR #923 closed unmerged; branch 1,903 commits behind target.
- [ ] VT-CWI-002 — Verify primary inline glyph stroke across simple inputs, labelled inputs, textareas and TextBox in rest/focus states; TextBox text and border stay black — PARTIAL — tests not run.
- [ ] VT-CWI-003 — Verify square rails for split badges, split-left/double-split buttons, top-split modules, counters, toggles and intermodules — PARTIAL — browser verification not run.
- [ ] VT-CWI-004 — Run focused Studio tests, CSS/audit tests and repository build on the reconciled branch — NOT STARTED.
- [ ] VT-CWI-005 — Inspect desktop/mobile representatives, capture and analyze screenshots, correct defects and reverify — NOT STARTED.
- [ ] VT-CWI-006 — Open a fresh PR against master/consolidated-feature-integration after recovery and verification — BLOCKED on CWI-001/CWI-004/CWI-005.

## Complete user instruction register

- [ ] REQ-001 — Restore simple input primary inline glyph stroke in rest and focus — PARTIAL — branch codex/studio-controls-regression-recovery; PR #923 closed unmerged.
- [ ] REQ-002 — All text inputs, textareas and TextBox retain primary inline glyph stroke at all times — PARTIAL — latest correction supersedes earlier black-focused-stroke interpretation.
- [ ] REQ-003 — TextBox keeps black text and black outer border with primary inline glyph stroke — PARTIAL — CSS/test assertions changed; runtime unverified.
- [ ] REQ-004 — Split-family icon/rail sections are square across badges, buttons, modules, counters and toggles — PARTIAL — CSS/assertions changed; visual proof outstanding.
- [ ] REQ-005 — Intermodules fill the available row and keep split sections square — PARTIAL — CSS/assertions changed; visual proof outstanding.
- [ ] REQ-006 — Complete the conversation handoff log process in repository docs — IN_PROGRESS — package/index staged on docs branch; no PR opened.

## Decisions to preserve

- The latest field-stroke instruction is authoritative: all text fields use primary-colored inline glyph stroke in every state.
- TextBox remains black text with a black outer border; only its inline glyph stroke is primary-colored.
- The secondary focus outline is separate from the inline glyph stroke.
- Do not add another CSS override layer or assume a selector works without checking production JSX and cascade.
- Do not merge the stale Studio branch wholesale.
- No test pass, build pass, browser verification or successful delivery is claimed.

## Links to documents and artifacts

- PR #923 (closed): https://github.com/viewtube-dev/viewtube/pull/923
- Observed branch head: https://github.com/viewtube-dev/viewtube/commit/9bb5424896765e1a348f0a8e37846c426c0f31d8
- Branch compare: https://github.com/viewtube-dev/viewtube/compare/master/consolidated-feature-integration...codex/studio-controls-regression-recovery
- Conversation Handoffs authority: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/governance/CONVERSATION_HANDOFFS.md
- Handoff skill: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/.claude/skills/viewtube-conversation-handoff/SKILL.md
- Reconciliation skill: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/.claude/skills/viewtube-conversation-work-reconciliation/SKILL.md
- Task Authority: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/governance/TASK_AUTHORITY.md
- Documentation Governance: https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/governance/DOCUMENTATION.md
- This handoff: https://github.com/viewtube-dev/viewtube/blob/docs/studio-controls-regression-handoff-2026-10-30/tasks/conversation-intake/VT-CONV-2026-10-30-STUDIO-CONTROLS-REGRESSION/handoff.md
- This worklog: https://github.com/viewtube-dev/viewtube/blob/docs/studio-controls-regression-handoff-2026-10-30/tasks/conversation-intake/VT-CONV-2026-10-30-STUDIO-CONTROLS-REGRESSION/worklog.json
- This review: https://github.com/viewtube-dev/viewtube/blob/docs/studio-controls-regression-handoff-2026-10-30/tasks/conversation-intake/VT-CONV-2026-10-30-STUDIO-CONTROLS-REGRESSION/review.md

## Branch and PR reconciliation

| Branch | Target | PR | Opening head | Current head | Merge SHA | Target presence | Classification |
|---|---|---:|---|---|---|---|---|
| codex/studio-controls-regression-recovery | master/consolidated-feature-integration | #923 | UNKNOWN | 9bb5424896765e1a348f0a8e37846c426c0f31d8 | NONE | NO for eight commits reported unique | CLOSED_UNMERGED / POST-PR LINEAGE UNKNOWN |\n| docs/studio-controls-regression-handoff-2026-10-30 | master/consolidated-feature-integration | #1229 | 97651224b3d05fe02a5e907258763157bc467e14 | 97651224b3d05fe02a5e907258763157bc467e14 (opening snapshot) | NONE | NO — PR open | OPEN_PR |

GitHub compare reports eight commits ahead, 1,903 behind, status diverged, and 21 changed paths. The PR-opening head is unavailable, so post-opening commits cannot be distinguished. The PR has no merge SHA. Treat the eight commits as unrecovered until every change is checked against the current target; do not assume every listed path or hunk is still missing.

The documentation package is on docs/studio-controls-regression-handoff-2026-10-30, based on the intended target, and is proposed in open PR #1229. GitHub currently reports mergeable=false; this has not been resolved or explained yet.

## Integration maturity

| Architecture | Backend | Frontend | Integration | Tests | Runtime | Responsive | Documentation | Release |
|---|---|---|---|---|---|---|---|---|
| PARTIAL | NOT_APPLICABLE | PARTIAL | PARTIAL | PARTIAL | NONE | PARTIAL | PARTIAL | NONE |

- TESTS_WITHOUT_RUNTIME_PROOF: assertions were edited but no focused test/build result is available.
- IMPLEMENTED_BUT_UNCONNECTED: source changes do not prove effective cascade or actual desktop/mobile rendering.
- DOCUMENTATION_WITHOUT_IMPLEMENTATION: this handoff package does not itself recover or ship the Studio fixes.

## Five finishing / improvement proposals

1. Branch recovery manifest: compare PR-opening changes, later commits and target-equivalent hunks; first inspect PR #923 timeline and every unique commit.
2. Field-state contract matrix: test each field primitive × rest/focus × fill/stroke/border/focus outline; first inventory actual JSX and CSS owners.
3. Split-geometry contract matrix: test split families for square rails, divider ownership and full-width behavior; first map JSX classes to canonical CSS owners.
4. Visual regression evidence set: capture desktop/mobile representatives for fields, badges, buttons, modules, counters, toggles and intermodules; first define stable routes/stories.
5. Handoff validator coverage: extend existing contract tests for identity, instruction completeness, artifact links, branch lineage and all nine maturity axes; first inspect existing schema/tests.

These remain proposals only; route them through the existing Ideas Registry and improvement recommendations.

## Exact next action

Recover the PR #923 timeline and compare its eight unique commits against current target. Preserve only still-needed changes on a fresh target-based branch, then run focused tests/build and desktop/mobile visual verification.

## Closure checklist

- [ ] Every distinct user instruction has a stable REQ ID and truthful delivery state.
- [ ] Every meaningful work item has a VT-CWI ID and explicit disposition.
- [ ] All created/changed artifacts are linked.
- [ ] Branch and PR history, including post-PR work, is reconciled.
- [ ] Integration gaps use all nine Task Authority maturity axes.
- [ ] Five proposals are routed through existing authorities or remain explicitly proposed.
- [ ] Focused tests/build pass on the recovered current-target branch.
- [ ] Desktop/mobile screenshots are captured, analyzed, corrected and reverified.
- [ ] A fresh PR is opened only after recovery and verification.
- [ ] No duplicate task/status ledger or idea registry is created.