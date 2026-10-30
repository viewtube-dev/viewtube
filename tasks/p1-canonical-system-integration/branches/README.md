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


## Live status refresh — 2026-10-30
- #1109, #1168, #1169, #1174, #1178 and #1203 are merged.
- #935, #988 and #992 remain open and non-mergeable. Their file sets overlap across tokens, emitter, generated CSS, field CSS, catalog and tests; harvest only after current-target comparison.
- Current audited target SHA: `0135fa33bf5cd59503c9feecce4977072ef60fec`.
- Phase 0 evidence: `../audits/phase-0-reconciliation-2026-10-30.md`.

### Studio donor divergence (measured against target SHA `0135fa33bf5cd59503c9feecce4977072ef60fec`)
- #935: 53 commits ahead / 1,643 behind; 16 changed paths.
- #988: 36 ahead / 1,361 behind; 16 changed paths.
- #992: 11 ahead / 1,339 behind; 10 changed paths.
- Pairwise overlaps: #935/#988 = 6 files; #935/#992 = 4 files; #988/#992 = 6 files. Union = 29 paths.
- All three are DIVERGED. Selective donor harvesting only; no wholesale merge.
