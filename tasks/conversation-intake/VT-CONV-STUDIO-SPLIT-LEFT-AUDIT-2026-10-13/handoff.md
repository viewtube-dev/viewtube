# Conversation Handoff — Studio Button / Split-Left Primitive Audit

**Conversation ID:** VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13  
**Handoff ID:** VT-HANDOFF-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13  
**Produced:** 2026-10-13  
**Last Edited:** 2026-10-13  
**Source Host:** ChatGPT  
**Reconciliation Status:** UNREVIEWED

## Goal

Continue the ViewTube Studio Hub UI audit and consolidation work. Determine why Studio Button and Studio Split-Left Button have different default typography/size; identify why the metadata Generate/Analyze row, Project/Video Manager Load/Refresh actions, and Post Workspace choices have diverged into three sources/styles; explain and remove double shadows in primitives 06 and 07; identify the legacy split-left parent primitive used by “Assemble Script”, “Open Comment”, “Save Draft”, “Connect Channel”, and “Preview Plan”; migrate these to the canonical Studio split-left source.

A deployment failure has now exposed an immediate build blocker: imports for `SplitLeftButton` and `SubToolboxSplitButton` are not exported from `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx`. Resolve the export/import contract before relying on the UI migration PRs.

## Current repository state

- **Repository:** `viewtube-dev/viewtube`
- **Integration target:** `master/consolidated-feature-integration`
- **Handoff branch:** `docs/handoff-studio-split-left-audit-2026-10-13`
- **Handoff branch base:** `master/consolidated-feature-integration`
- **Relevant pull requests discovered in GitHub search:**
  - [PR #44 — Unify Studio split-left button source and shadow styling](https://github.com/viewtube-dev/viewtube/pull/44)
  - [PR #41 — Unify Studio split-left button sources and remove double shadows](https://github.com/viewtube-dev/viewtube/pull/41)
  - [PR #40 — Make Studio split-left labels inherit StudioButton typography](https://github.com/viewtube-dev/viewtube/pull/40)
  - [PR #46 — Rebuild the shared split-left stylesheet around StudioControls only](https://github.com/viewtube-dev/viewtube/pull/46)
  - [PR #35 — Normalize Studio split-left button typography and layout](https://github.com/viewtube-dev/viewtube/pull/35)
  - [PR #31 — Complete canonical split-left migration in Studio controls](https://github.com/viewtube-dev/viewtube/pull/31)
  - [PR #32 — Use canonical primitives throughout the Studio Hub component library](https://github.com/viewtube-dev/viewtube/pull/32)
- PR state and merge status must be refreshed before making any decision; search results included summaries, not definitive current checks.
- The latest supplied Render build log has timestamp 2026-10-13T11:46:06Z and fails during Vite chunk rendering with two missing exports (details below).

## Read first

1. `docs/governance/CONVERSATION_HANDOFFS.md` — canonical handoff and reconciliation rules.
2. `.claude/skills/viewtube-conversation-handoff/SKILL.md` and `.claude/skills/viewtube-conversation-handoff/templates/handoff-template.md`.
3. `src/studio-ui/primitives/StudioControls.tsx` — current `StudioButton` / `StudioSplitLeftButton` wrapper source.
4. `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx` — legacy split primitive source and missing export contract.
5. `src/styles/studio-control-system.css`, `src/styles/studio-split-left-consistency.css` (if present on the checked-out branch), and `src/styles/subtoolbox-split-primitives.css`.
6. `src/studio-ui/StudioHubCertification.tsx` and its test.
7. Existing PRs #41, #44, #46, #40 and their file diffs/checks.
8. `docs/ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md` and the canonical Studio Hub component-library source-of-truth document.

## Settled decisions and constraints

- Use one canonical Studio split-left primitive/source for the named production split-left actions; do not keep separate lookalike implementations with independent typography, geometry, shadows or markup.
- The icon rail and label body remain part of the split-left anatomy; preserve the owning toolbox's color pair and selected-state behavior.
- Typography must be inherited from the canonical Studio button defaults rather than being restated independently by split-label CSS. Confirm the intended action size instead of letting defaults silently select a different type scale.
- Shadow ownership must be singular. The legacy primitive currently has a CSS `filter: drop-shadow(...)` with hover/active filter overrides; any shared consistency stylesheet that adds `box-shadow` creates a double-shadow effect. Preserve focus/selection rings separately from the outer shadow.
- The required named controls are: “Assemble Script”, “Open Comment”, “Save Draft”, “Connect Channel”, and “Preview Plan”.
- The three divergent groups specifically called out by the user are: metadata Generate/Analyze (Generate/Refine/Analyze), Load/Refresh (including Project Manifestation and Video Manager/Space Assets actions), and Post Workspace type/action choices.
- Do not claim the fix is deployed or verified based only on a PR description or a successful source edit.
- Do not use `npm audit fix --force` as an incidental build fix; the supplied log only reports audit suggestions and Vite warnings before the actual missing-export errors.

## Work completed in the conversation

### Source-level findings confirmed from repository files / PR summaries

1. `StudioSplitLeftButton` in `src/studio-ui/primitives/StudioControls.tsx` is a wrapper around `StudioButton`. Its current component code defaults `sizeVariant = "action"`, but earlier stylesheet rules independently declared split-label typography. That creates a competing style path instead of letting the label inherit StudioButton typography.
2. The current checked-in `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx` defines `SubToolboxSplitButton` and styles it with `.vt-subtoolbox-split-button`; the source CSS uses `filter: drop-shadow(...)`, with different hover and active filters.
3. PR #41's summary attributes the different three-group sources to the metadata Generate/Refine/Analyze row, Video Manager Load Space Assets/Refreshing actions, and Post Workspace choices; it proposes migrating these to `StudioSplitLeftButton` and making action size the default.
4. PR #44's summary identifies additional alternate sources: `SubToolboxGridActionButton` and hand-styled actions. It says the named actions and Project Manifestation load/swap/refresh actions were migrated to `StudioSplitLeftButton`, and that the legacy filter/drop-shadow was removed.
5. PR #40's summary says split-label CSS declared 14px (12px narrow portrait) while a separate consistency stylesheet declared 20px (16px narrow portrait), versus StudioButton's 32px default standard typography tokens. It proposes removing split-label typography overrides and inheriting StudioButton's defaults. These are PR-authored summaries and still require diff/check verification.
6. PR #46 is explicitly about rebuilding the shared split-left stylesheet around StudioControls only. Inspect it for overlap and precedence before merging other changes.

### Build blocker from supplied Render log

At **2026-10-13T11:46:06Z**, Vite reported two `[MISSING_EXPORT]` errors:

- `src/studio-ui/StudioHubCertification.tsx:7:10` imports `SplitLeftButton` from `../components/subtoolbox/SubToolboxSplitPrimitives`, but that module does not export `SplitLeftButton`.
- `src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx:4:10` imports `SubToolboxSplitButton` from `./SubToolboxSplitPrimitives`, but that module does not export `SubToolboxSplitButton`.

Repository source fetched during this conversation showed `SubToolboxSplitPrimitives.tsx` exporting `SubToolboxSplitButton`, but not `SplitLeftButton`. Therefore the build log may reflect a different commit/source snapshot than the fetched default branch, or an in-progress branch altered the export. Do not blindly rename exports: first identify the exact Render commit and PR branch/source tree. Then either restore the required compatibility export(s) or update consumers to the intended canonical export, without creating a second button implementation. Add an export-contract test.

Other log messages:
- npm audit suggestions are advisory and not the cause of this build failure.
- Vite warns `__dirname` at `vite.config.ts:93` is incompatible with future native config-loader behavior.
- Vite warns `advancedChunks` is deprecated in favor of `codeSplitting`.
- 9,517 modules transformed before chunk binding failed.
These warnings are separate from the two fatal missing-export errors.

## Work in progress

- Reconcile PRs #41, #44, #40, #46, #35 and #31; avoid merging overlapping fixes as separate implementations.
- Establish the authoritative base/branch/commit for the supplied Render failure.
- Confirm the parent/legacy primitive for the five named action labels from actual JSX call sites and source imports, not just PR descriptions.
- Audit all Studio Hub/toolbox consumers for direct imports, raw button markup, and local CSS that produce split-left-like controls.
- Determine why the Studio Button and split-left defaults diverge at both component prop-default and CSS levels.
- Determine whether primitive IDs 06 and 07 both own shadow styling, or whether one primitive's filter is stacking with a shared stylesheet's box shadow; test normal, hover, active, selected, and focus-visible states.
- Ensure component-library production examples point at canonical source; distinguish any intentionally frozen historical/baseline catalog.

## Planned / unfinished work

### P0 — Restore build
- Locate exact Render deployment commit and compare it with the fetched integration branch.
- Fix the two missing-export bindings at their source, preferably by using one canonical implementation and only retaining compatibility aliases when necessary.
- Run production build and typecheck; record exact commit and results.

### P1 — Establish canonical component contract
- Pick the canonical public API and export path for split-left controls.
- Make `StudioSplitLeftButton` typography inherit from `StudioButton`; do not leave font-size/weight/line-height/stroke declarations on its label.
- Ensure default size maps to the intended action typography, documented and tested.
- Define exactly one outer-shadow owner. Keep focus-visible outline and selected-state ring independent.
- Confirm palette/tone and selected-state behavior survive the migration.

### P2 — Migrate the three divergent groups
- Metadata Generate/Refine/Analyze.
- Load/Refresh/Swap actions in Project Manifestation and Video Manager.
- Post Workspace choices/actions.
- Remove duplicate `SubToolboxGridActionButton` / feature-local hand-styled split-left implementations where they are used for the same action-button job.

### P3 — Migrate named actions
- Assemble Script.
- Open Comment.
- Save Draft.
- Connect Channel.
- Preview Plan.

### P4 — Verify and document
- Add/adjust source-contract tests for imports, named consumers, component default size and shadow ownership.
- Build, typecheck, run focused tests and visually compare desktop + narrow portrait, normal/hover/active/selected/focus states.
- Update the component library and audit documentation after code has actually passed checks.

## Bugs / failures / blockers

- Fatal Vite missing exports from `StudioHubCertification.tsx` and `SubToolboxCompoundPrimitives.tsx` (exact details above).
- Competing label typography declarations explain why split-left labels can differ from StudioButton labels.
- Legacy split-left CSS applies `filter: drop-shadow`; a second `box-shadow` source can produce a double shadow.
- There are several active/overlapping PRs on the same concern. Their current state, changed-file overlap, base ancestry and checks must be refreshed before selecting a survivor.
- No successful build, focused test run or live screenshot verification was established by the supplied log or source summaries.

## Important resources / PRs

- [PR #44 — Unify Studio split-left button source and shadow styling](https://github.com/viewtube-dev/viewtube/pull/44)
- [PR #41 — Unify Studio split-left button sources and remove double shadows](https://github.com/viewtube-dev/viewtube/pull/41)
- [PR #40 — Make Studio split-left labels inherit StudioButton typography](https://github.com/viewtube-dev/viewtube/pull/40)
- [PR #46 — Rebuild the shared split-left stylesheet around StudioControls only](https://github.com/viewtube-dev/viewtube/pull/46)
- [PR #35 — Normalize Studio split-left button typography and layout](https://github.com/viewtube-dev/viewtube/pull/35)
- [PR #31 — Complete canonical split-left migration in Studio controls](https://github.com/viewtube-dev/viewtube/pull/31)
- [PR #32 — Use canonical primitives throughout the Studio Hub component library](https://github.com/viewtube-dev/viewtube/pull/32)
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx`
- `src/styles/studio-control-system.css`
- `src/styles/subtoolbox-split-primitives.css`
- `src/studio-ui/StudioHubCertification.tsx`
- `src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx`
- `docs/ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md`

## Changed paths / artifacts

This handoff package is the only work created by the handoff task:
- `tasks/conversation-intake/VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13/handoff.md`
- `tasks/conversation-intake/VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13/worklog.json`
- `tasks/conversation-intake/VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13/review.md`

No production UI code was changed by the handoff task.

## Verification performed

- Read canonical handoff workflow, schema and template.
- Inspected `StudioControls.tsx` and `SubToolboxSplitPrimitives.tsx` from the fetched repository snapshot.
- Searched GitHub for split-left component source and related PRs.
- Captured the Render build log's two exact missing-export failures.
- Cross-checked PR summaries for previously identified typography, shadow and migration work.

## Verification still needed

- Identify the exact SHA that produced the supplied Render log.
- Refresh PR states and compare diffs/checks for #41/#44/#40/#46 before implementation.
- Build/typecheck/test after the missing-export fix.
- Visual verification on the deployed app.
- Confirm all named actions and three action groups use one canonical component source.
- Run a repo-wide audit for duplicate split-left markup/style and for primitive 06/07 shadow ownership.
- Reconcile this intake with Task Index, Integrated Application Program, and canonical UI authorities; this handoff itself does not claim those updates.

## Do not redo

- Do not create yet another split-left styling stylesheet without first reconciling PR #46 and existing shared CSS ownership.
- Do not add a second shadow to compensate for the existing `filter: drop-shadow`.
- Do not fix only one of the three divergent action groups while leaving the other two on different implementations.
- Do not replace the five named buttons with another custom local button component.
- Do not treat PR descriptions as verified merge/build evidence.
- Do not run `npm audit fix --force` to address the missing-export build failure.
- Do not overwrite `tasks/plan.md` or `tasks/todo.md`; this is a separate handoff/intake package.

## Exact next action

First inspect the exact Render deployment commit and the file diffs/checks for PRs #41, #44, #40 and #46. Resolve the missing-export mismatch on the correct branch, then select one canonical split-left source and migrate the three divergent groups plus the five named actions. Verify build/typecheck/focused tests before claiming completion.

## Work log

`tasks/conversation-intake/VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13/worklog.json`

## Review

`tasks/conversation-intake/VT-CONV-STUDIO-SPLIT-LEFT-AUDIT-2026-10-13/review.md`
