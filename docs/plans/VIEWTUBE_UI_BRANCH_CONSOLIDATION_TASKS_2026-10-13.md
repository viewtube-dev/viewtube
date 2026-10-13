# ViewTube UI Branch Consolidation — Execution Checklist

**Parent audit:** `docs/plans/VIEWTUBE_UI_BRANCH_CONSOLIDATION_AUDIT_2026-10-13.md`  
**Target:** `master/consolidated-feature-integration`  
**Status:** In progress. No branch deletions or production code merges have been performed by this audit pass.

## Gate 1 — Inventory and provenance
- [ ] Re-query all branches and capture current branch heads.
- [ ] Record per-branch compare results against integration target.
- [ ] Inspect all candidate-only commit subjects and changed paths.
- [ ] Map every branch to open/closed/merged PRs and current checks.
- [ ] Identify deployment/workflow dependencies and recovery/documentation value.
- [ ] Mark protected refs: `main`, integration target, active deployment refs, recovery branches, and frozen visual baselines.

## Gate 2 — Donor review
- [ ] `feat/canonical-action-and-legend-primitives`: compare its 12 unique commits against current metadata/project actions and dropdown primitives.
- [ ] `master/analytics-status-badge-primitive-2026-10-12`: compare badge behavior and tests; do not reintroduce its older 14px/1px dense style over the target's newer 18px/2px style.
- [ ] `feat/studio-canonical-input-primitives-20-21`: check the unique component-index documentation delta after PR #37.
- [ ] `ui/component-library-production-buttons`: compare its catalog work with PRs #32–#34 and the definitive library contract.
- [ ] `test/consolidated-master-validation-v2`: check whether its unique checklist commit is already represented in the target.
- [ ] For each donor, record: keep as-is, selectively port, documentation-only port, superseded, or archive.

## Gate 3 — UI ownership and consumer audits
- [ ] Inventory source exports, imports, JSX uses, CSS selectors, and tests for each primitive family.
- [ ] Identify duplicate visual/behavioral owners and document compatibility requirements.
- [ ] Verify standard component sizing and typography tokens against the supplied design source and definitive library contract.
- [ ] Verify the definitive library renders production primitives, not copied lookalikes.
- [ ] Audit button/split-left variants, input/textarea labels, dropdowns, tags, status badges, toolbox header toggles, and calendar markers.
- [ ] Audit all relevant consumers, including Studio Hub, Video Manager, Video Publisher, metadata toolboxes, Project Manifestation, Project Board/calendar, analytics, and resource library.
- [ ] Verify metadata/package persistence and published-vs-unpublished tool boundaries remain unchanged.

## Gate 4 — Regression and verification evidence
- [ ] Establish baseline results on the exact current target SHA.
- [ ] Run focused primitive/governance tests.
- [ ] Run metadata persistence/saved-set and Manager/Publisher contract tests.
- [ ] Run calendar/project scheduling tests.
- [ ] Run component-library responsive/source-contract tests.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run check:css`.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Record exact command, SHA, result, and inherited failures.
- [ ] Review visual states at desktop, tablet, mobile portrait, and mobile landscape.
- [ ] Review keyboard navigation, focus restoration, disabled/loading/error states, and reduced motion.
- [ ] Update the consolidated-master validation checklist with evidence.

## Gate 5 — Merge/port
- [ ] Only create focused ports for confirmed missing work.
- [ ] Run checks on each candidate PR before merge.
- [ ] Review all diffs for stale tokens, duplicate styles, and unrelated changes.
- [ ] Merge/port only into `master/consolidated-feature-integration`.
- [ ] Keep `main` separate; no merge into `main` without a separate release decision.

## Gate 6 — Branch cleanup
- [ ] Complete the branch disposition matrix for all observed branches.
- [ ] Preserve all unique useful commits, docs, audit evidence, and provenance.
- [ ] Close superseded PRs with links to the accepted replacement.
- [ ] Verify no branch is referenced by a deployment, workflow, open PR, recovery protocol, or required visual baseline.
- [ ] Delete only branches that are proven obsolete and approved by the cleanup rules.
- [ ] Record deleted branch names and final SHAs.
- [ ] Re-query branch inventory and confirm intended refs only were removed.

## Completion rule

Do not mark any gate complete by inference. No tests, builds, visual checks, merges, or deletions may be described as completed until the corresponding result is available and recorded.
