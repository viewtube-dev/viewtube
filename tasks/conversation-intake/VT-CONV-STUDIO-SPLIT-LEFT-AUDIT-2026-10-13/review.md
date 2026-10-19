# Conversation Intake Review — Studio Split-Left Audit

**Conversation ID:** VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13  
**Status:** UNREVIEWED  
**Review date:** 2026-10-13

## Scope captured

- Studio Button versus Studio Split-Left Button default typography and size.
- Three independently styled groups: metadata Generate/Refine/Analyze, Load/Refresh actions, and Post Workspace choices.
- Double shadow reported for primitives 06 and 07.
- Canonical migration of Assemble Script, Open Comment, Save Draft, Connect Channel and Preview Plan.
- Render build failure caused by missing `SplitLeftButton` and `SubToolboxSplitButton` exports.
- Existing related PRs #35, #40, #41, #44, #46, #31 and #32.

## Initial disposition

This is a **continuation/overlap** with existing split-left consolidation work, not a new independent implementation plan. PR #44 appears broadest in its described scope, while #46 may supersede or conflict with the shared stylesheet approach; do not choose a survivor until current diffs, base branches, PR states and CI results are refreshed.

The missing-export failure is a blocking bug and must be mapped to the exact Render deployment SHA before changing exports. The checked source snapshot exports `SubToolboxSplitButton` but not `SplitLeftButton`, while the supplied Render log says both names are absent; this discrepancy likely means the log and fetched source are not from the same snapshot, but that remains an inference until SHA comparison.

## Value assessment

- **Creator impact:** HIGH — inconsistent action controls undermine the Studio-wide UI system.
- **System leverage:** HIGH — one source can normalize several tools and future consumers.
- **Urgency:** CRITICAL for the missing-export build failure; HIGH for UI consistency.
- **Reuse potential:** HIGH.
- **Confidence:** HIGH that the missing-export build is fatal based on the supplied log; MEDIUM for root-cause summaries inherited from PR descriptions until diffs are checked.
- **Estimated effort:** MEDIUM to LARGE because overlapping branches and visual verification are involved.
- **Implementation risk:** MEDIUM to HIGH if CSS/source ownership is changed without branch reconciliation.

## Required reconciliation steps

1. Resolve the Render SHA and inspect exact source at that SHA.
2. Refresh PR states and compare diffs/checks for #41, #44, #40 and #46.
3. Identify the canonical surviving task/PR and record superseded branches as donors where appropriate.
4. Verify each of the five named actions and the three divergent action groups against actual call sites.
5. Run build, typecheck, focused tests and browser visual checks.
6. Promote accepted findings to the owning UI authority and task/plan system; do not treat this intake package as a replacement for those systems.

No canonical Task Index or Integrated Application Program changes were made by this handoff operation.
