# Branch and PR Donor Index
**Class:** REFERENCE | **Status:** ACTIVE — recheck before use | **Last Edited:** 2026-10-29

This is a discovery index only, not authoritative PR status. Always query GitHub live and inspect exact head/base SHAs and changed files before harvesting.

## Program branch
- Planning: docs/p1-canonical-system-integration-program
- Target: master/consolidated-feature-integration
- Scope: documentation/planning package only.

## Known donor leads
| PR | Workstream | Discovery lead | Required action |
|---|---|---|---|
| #1109 | Gemini | validation model correction | inspect current state, tests, merged status and surviving code |
| #1168 | Gemini/diagnostics | AI generation priority scanner | inspect unique scanner and branch-only callers |
| #1169 | Brain/Gateway | model gateway convergence plan | preserve plan and implementation relationships |
| #1174 | Brain/Gateway | provider substitution/current | inspect focused tests, Studio failures and unresolved typecheck/full-suite status |
| #935 | Studio | shared stroke/split input | inspect current diff and current source ownership |
| #988 | Studio | token/CSS/field contract | inspect mergeability, current target parity and donor-only fixes |
| #992 | Studio | token/focus geometry refactor | inspect current head/base and whether superseded by later simplification |

## Rules
- Never assume open/closed/merged status from this index.
- Compare donor branch with current target before editing.
- Harvest unique useful commits/files selectively; record donor SHA and destination.
- Do not merge stale branches wholesale or create parallel implementations.
- Create separate implementation branches after scope and task identity are accepted.
