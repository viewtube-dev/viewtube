# ViewTube Quick Wins 100

**Status:** REPORTED / RECONCILIATION REQUIRED  
**Authority target:** one canonical bounded implementation backlog.

## Purpose
Preserve the recovered 100-task program while preventing a historical conversation matrix from being mistaken for current implementation state.

## Completion rule
A task counts only after:

**IMPLEMENTED → VERIFIED → PR → MERGED TO main → VERIFIED ON main**

Therefore:
- audit ≠ implementation;
- plan ≠ completion;
- branch ≠ completion;
- PR ≠ merge;
- merge ≠ verification.

## Recovered task families
- QW-001–015: publish/recovery;
- QW-016–020: widget shell;
- QW-021–027: context/editor publishing;
- QW-028–031: widget/workflow contracts;
- QW-032–050: capability/workflow/ranking;
- QW-051–070: Vault/Projects/Analytics;
- QW-071–080: Brain/project intelligence;
- QW-081–087: prompt/Brain;
- QW-088–093: Editor;
- QW-094–100: production widgets.

The exact recovered titles and source mappings are preserved in the recovery matrix.

## Required task fields
ID, title, problem, evidence/source, affected files/system, owner, lane, dependency, proposed change, verification, status, branch, PR, commit, merge state, post-merge verification, superseded/replaced-by, notes.

## Allowed status
`planned → ready → in progress → blocked → implemented → verified → merged`

Also:
`superseded | deferred | rejected`

## Current canonical state
The recovered matrix is **not yet executable against canonical main as-is**. Current recovery evidence did not surface a canonical Quick Wins registry or enough implementation evidence to claim completion.

Do not invent implementation status.

## Next reconciliation
Recover the authoritative task source and reconcile each item against current `main` before creating implementation branches.

**Primary source:** `docs/recovery/handoffs/VIEWTUBE_QUICK_WINS_MATRIX_RECOVERED_2026-10-04.md`.
