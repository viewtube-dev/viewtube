# Conversation Handoff — Post-Merge Recovery, Studio Controls, Vault & Creator Workbench

**Date:** 2026-10-14 (updated from repository state visible during this handoff)  
**Repository:** `viewtube-dev/viewtube`  
**Canonical integration target:** `master/consolidated-feature-integration`  
**Purpose:** Preserve plans, verified findings, open questions, and unfinished work discussed in this conversation. This is a handoff and recovery plan, not a claim that every item is implemented or visually verified.

## 1. Highest-priority issue: post-merge branch drift and missing edits

The user reports that many edits appear to have been lost because work was applied to PR branches after those PRs had already been merged. A merge only integrates the PR diff as it existed at merge time. Later commits on that head branch do not automatically update the target branch.

### Required recovery workflow

1. Read the current integration branch before editing.
2. For every suspect PR, capture its merge commit, head SHA, changed files, and merge-time patch.
3. Compare the current integration tree with the merge-time result and any later commits on the PR head.
4. Check whether later edits were integrated by another PR, superseded intentionally, reverted, or remain branch-only.
5. Recover only confirmed missing behavior; do not merge stale branches wholesale.
6. Start each recovery change from the current integration branch on a new feature branch.
7. Inspect the complete diff before opening a PR; ensure it includes all intended changes and no stale unrelated changes.
8. Verify the resulting target branch after merge.
9. Run focused tests, typecheck, lint/build, and browser/computed-style checks when available. Distinguish source inspection from runtime certification.
10. Track each recovery item as **Missing / Superseded / Present / Implemented-unverified / Verified**.

Never continue implementation on a merged PR branch and then describe those later edits as integrated. Do not merge to `main`; target `master/consolidated-feature-integration`.

## 2. Repository evidence and PR ledger

PR state below is based on the GitHub metadata available during handoff. “Merged” means GitHub reports a merge, not that behavior passed browser verification.

### Studio Controls history

- [PR #78](https://github.com/viewtube-dev/viewtube/pull/78) — merged. Canonical word-toggle strokes and field ownership moved to Studio Controls; documented 44px/38px and 28px/24px defaults. No fresh build or browser certification recorded in the PR.
- [PR #79](https://github.com/viewtube-dev/viewtube/pull/79) — merged documentation follow-up, deliberately realigned with #78. Do not assume broader earlier draft changes survived its scope reset.
- [PR #82](https://github.com/viewtube-dev/viewtube/pull/82) — merged SubToolbox primitives 20/21 as thin compatibility wrappers over Studio fields; source-level checks reported, no full build/browser certification.
- [PR #84](https://github.com/viewtube-dev/viewtube/pull/84) — merged standalone field components and catalog layout fixes; tests were authored, but PR stated test/build/browser checks had not been run.
- [PR #159](https://github.com/viewtube-dev/viewtube/pull/159) — merged textarea typography/mobile typing changes. It specifies 18px standard / 14px compact textarea typography, default TITLE/DESCRIPTION placeholders, and spellcheck/autocorrect adjustments.
- [PR #160](https://github.com/viewtube-dev/viewtube/pull/160) — merged floating-label control replacement (confirm its precise diff if its scope is relevant to a recovery).
- [PR #163](https://github.com/viewtube-dev/viewtube/pull/163) — merged documentation/catalog indexing for the global defaults and exception audit; documentation only, no CSS behavior changes.
- [PR #168](https://github.com/viewtube-dev/viewtube/pull/168) — merged field sizing, fill, border/radius, and focus rules; its own description says tests, build, computed styles, and visual checks were not run.
- [PR #169](https://github.com/viewtube-dev/viewtube/pull/169) — merged recovery follow-up. Adds fixed-anchor button shadow motion and compact split-rail divider corrections, and records unresolved textarea typography conflict. Source inspection only.
- [PR #170](https://github.com/viewtube-dev/viewtube/pull/170) — closed unmerged/overlapping compact split-left fix; inspect its patch against #171 before deciding if any unique behavior remains.
- [PR #171](https://github.com/viewtube-dev/viewtube/pull/171) — merged Studio Controls audit/consolidation. Makes `heightVariant` authoritative for button geometry, protects canonical data attributes from prop-spread overwrite, replaces a long tail of corrective CSS with an authoritative contract, and adds regression assertions. Static source checks reported; tests/typecheck/lint/build/browser checks still outstanding.
- [PR #158](https://github.com/viewtube-dev/viewtube/pull/158) — closed as superseded by #159; do not treat as independently merged.

### Other workstreams referenced

- [PR #161](https://github.com/viewtube-dev/viewtube/pull/161) — merged Creator Workbench Phase 4/5 lifecycle foundation. It is **not** end-to-end completion. Tests were authored but not run; adapters, save/reload, undo/redo, and desktop/mobile preview/render QA remain.
- [PR #172](https://github.com/viewtube-dev/viewtube/pull/172) — open Creator Workbench video audio controls. Adds video volume/mute backed by existing render payload. Build/tests/browser render were not run; Vercel reported build-rate-limit failures. Check latest status before acting.
- [PR #173](https://github.com/viewtube-dev/viewtube/pull/173) — open Vault Workbench Phase 0–2 image tools. Includes audit, capability registry/Inspector integration, Canvas image transform engine and image-tool family. Tests/typecheck/lint/build/browser checks not run in the connector pass; video trim/transcode/compression/proxy and durable binary storage remain out of scope and need later phases.
- [PR #162](https://github.com/viewtube-dev/viewtube/pull/162) — merged Vault completion audit/prioritization document; documentation only.
- [PR #164](https://github.com/viewtube-dev/viewtube/pull/164) — merged expandable completed-task history; tests/build still need CI confirmation.
- [PR #165–167](https://github.com/viewtube-dev/viewtube/pull/167) — merged snapshot/publish reliability work according to GitHub metadata. These describe browser-storage hardening, not server-authoritative cross-device durability; review CI before claiming certified.
- PR #164 was already merged earlier; user explicitly warned that it had been merged a while ago. Do not redo or reopen it without evidence of a missing behavior.

## 3. Studio Controls: required global contract

Canonical sources:
- `src/studio-ui/primitives/StudioControls.tsx`
- `src/styles/studio-control-system.css`
- `src/studio-ui/tokens.ts`
- `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx`
- `src/components/studio-hub/studio-hub-primitive-catalogs.css`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`

Use the Studio Controls system as the single source of truth. Do not create a parallel primitive system or treat catalog chrome as production component styling.

### User-confirmed size rules

| Property | Standard | Compact |
|---|---:|---:|
| Control height | 44px | 28px |
| Stroke/border | 3px | 2px |
| Corner radius | 6px | 4px |
| Declared global text size | 38px | 24px |
| Weight / transform / family | Inter stack, weight 1000, uppercase/tracked as declared | Same typography policy unless a documented exception applies |

- Text inputs: 44px/38px standard; 28px/24px compact.
- Textareas: both sizes have 92px minimum height, but textarea typography is **unresolved** due to conflicting merged changes; see below. Do not silently pick a value.
- Default fill: 100% primary color for components generally; text inputs and textareas default to 50% primary color.
- Text-input and textarea focus: secondary-color outline, zero offset/gap; do not generalize this field-specific rule to unrelated families without approval.
- Word toggles: border 3px standard / 2px compact.
- Switches, radio buttons, and checkboxes: borderless, preserving their own anatomy and keyboard-visible focus indicators.
- Button shadows: keep the hard shadow anchored. Resting face reveals full shadow; hover moves the face by half the offset; click moves the face by the full offset so it covers the shadow. Do not move/rewrite the shadow or remove it on active state.
- Compact split-left button: 28px geometry, 2px outer stroke/divider, 4px radius; 1.5px resting shadow and 0.75px hover travel, including selected/hover/active/focus states.
- Earlier user-specified compact mouse-hover and mouse-click settings: 0.75 and 1.5. Confirm these remain aligned with the current #171 contract and actual CSS.
- Catalog must render actual production exports, not handcrafted replicas. Clearly mark standard-only APIs and named exceptions.

### Confirmed unresolved issue: textarea typography

PR #159 specifies 18px standard / 14px compact textarea text with `!important`. PR #168 later added 24px declarations without `!important`. The later rules therefore may not win in the cascade. PR #169 explicitly documented the conflict rather than resolving it. PR #171 may have consolidated CSS afterward; inspect current source and the #171 diff before concluding whether the conflict still exists.

**Action:** reconcile the current user requirement with both historical changes; make one authoritative source-level rule, update the exception index, and test computed styles for standard and compact textarea. Do not infer the final result from PR descriptions alone.

### Other Studio Controls verification work

1. Inspect the current CSS after #171; do not apply old fixes blindly.
2. Confirm split-left icon dimensions render correctly; earlier 44px icons appeared too small.
3. Confirm word toggles no longer overlap or overflow their module.
4. Confirm switch/radio/checkbox strokes remain absent and keyboard focus remains visible.
5. Confirm standard/compact border and radius computed values for every supported family.
6. Confirm text input placeholder and typed text use the intended primary-color styling, weight, casing, and size.
7. Confirm fill opacity and focus color/offset on actual rendered fields.
8. Confirm fixed shadow anchor and motion travel for rest/hover/active/focus/selected states.
9. Audit button typography overrides and any remaining `!important` or duplicated corrective selectors.
10. Confirm menu trigger vs dropdown panel/option exception policy; menu options should not inherit button press-shadow behavior.
11. Keep `STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md` current. A source-level discrepancy should not be called fixed until the winning cascade and behavior are verified.
12. Run focused Vitest, TypeScript, ESLint, production build and browser checks where available. Vercel build-rate-limit errors are infrastructure limits, not evidence of a code pass or fail.

## 4. Confirmed Primitive Library and component adoption

The library should contain actual canonical primitives, visibly demonstrate their sizes/tokens/states, and communicate each tool's purpose. Consumers should use shared primitives so source changes propagate; avoid hard-coded copies.

Inventory requested by the user:
- `SubToolboxButton`
- `SubToolboxIconButton`
- `SubToolboxIconTextButton`
- `SubToolboxSplitButton`
- `StudioSplitLeftButton`
- `StudioButton`
- `SubToolboxSelectableTag`
- `SubToolboxInnerActionButton`
- `SubToolboxActions`
- `SubToolboxRefineButtonBase`
- `SubToolboxGridActionButton`

Desired uses:
- Icon-over-text Load/Swap/Refresh in Projects Packages.
- Small Light/Balanced/Aggressive and 1/3/5 Sets controls.
- Medium Send to Publisher / Send Thumbnail Brief / Optimize Package / 3 Package Sets actions.
- Split-left Generate/Analyze/Refine in Manager.
- Medium split-left Text/Image Poll and other modes in Community Post.
- Project Load/Swap must be a dropdown, not a text input.
- Load/Refresh/Swap and Generate/Analyze/Refine rows should be full-width, auto-width for portrait/landscape layouts.
- Investigate vertically low icon/text alignment inside split-left buttons.

Consolidation requested:
- Replace `SubToolboxIconTextButton`, `SubToolboxSplitButton`, and `StudioSplitLeftButton` legacy implementations/usages with the chosen canonical split-left implementation where appropriate.
- Replace old `SubToolboxButton` and `StudioButton` variants referred to as the 01/02/03/04 buttons with the canonical Primary Button where intended.
- Replace the old tag editor with the attached canonical tag editor.
- Replace right-label input/textarea implementations with the floating-area text input component.
- Use the “simple” floating-area version for the former 13/14 inputs, the “v2 legend multi filters” dropdown for former 10 dropdown, “08 v1” for former 08 menu, and “09 L1” for former 09 menu.
- Verify selected-state inverse colors for selectable button groups (including Community Post play/pause split-left color-toggle behavior).
- Ensure 44px replaces old 48px sizing, square controls are 44×44, stroke remains 3px, and icon ratios match the user-provided reference.

The exact attached HTML/reference files must be inspected before implementing their ratios or typography. Do not substitute remembered approximations.

## 5. Creator Production Workbench — Phase 4/5 continuation

Implementation guide:
`docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md`

PR #161 merged the pure lifecycle foundation:
`src/features/editor/mobile/state/mediaOperationLifecycle.ts` and its tests.

Lifecycle: configure → preview → accept/cancel/fail/retry. It preserves source asset/version identity, invalidates stale previews when configuration changes, and blocks acceptance until the preview matches the latest configuration revision and has a non-empty output asset ID.

Still unfinished:
- Run its focused tests and full relevant quality gates.
- Wire the lifecycle to actual UI and processing adapters; this PR alone does not provide end-to-end image/video tools.
- Verify source preservation/non-destructive behavior.
- Verify persistence/save/reload and undo/redo.
- Execute and verify existing audio waveform, render-backed audio settings/fades, SRT import/export, caption timing nudges and editable caption timing.
- Complete desktop and mobile preview/final-render QA.
- Check open PR #172 for video volume/mute integration and validate its render output; do not claim verified based only on source contract.
- Ensure the shared script editor, image editor, video editor, and audio/caption tools use the canonical workbench/asset lifecycle instead of disconnected state.

## 6. Vault image/video Workbench plans and current status

PR #173 is the current open Phase 0–2 image-tool implementation:
`feat/vault-media-workbench-image-tools-phase-0-2-2026-10-14`.

Phase 0 audit document:
`docs/vault/VAULT_IMAGE_VIDEO_WORKBENCH_PHASE_0_AUDIT_2026-10-14.md`.

Scope already described in #173:
- Audit verified reusable image/video foundations vs gaps.
- Shared asset-aware capability registry integrated with existing Inspector; do not advertise unavailable processors.
- Canvas-based image transforms: crop, rotate, flip, resize, aspect ratios, brightness/contrast/saturation, format/quality conversion, thumbnail/web presets, palette extraction, focal-point metadata, before/after preview, download, and small derivative registration.
- Preserve original image. Larger outputs are downloaded for import rather than silently written to browser storage.
- Smart crop remains unavailable without a real vision provider.
- Does not introduce a second asset database or a full timeline editor.

Not included / next phases:
- Video trim, transcode, compression and proxy generation.
- Real provider-backed processing and smart crop.
- Durable binary storage / import pipeline and storage limits.
- Actual end-to-end browser testing for image tools and all output/import paths.
- Tests, typecheck, lint, build, accessibility and responsive browser verification for #173.
- Finish the Vault continuation plan phase by phase; user explicitly prioritized adding actual image/video control and editing tools, plus a script editor, not just Inspector/metadata scaffolding.
- Audit existing tool foundations before implementing duplicates; preserve Vault, Asset Engine, Projects, ContentBuild and ActionPacket ownership boundaries.
- Compact responsive UX and Task Center reliability remain follow-up priorities.
- Keep the distinction clear between preview/thumbnail extraction and actual media processing.

PR #162 is the documentation audit and prioritization ledger, not implementation of all listed Vault work. PR #164 task-history visibility is already merged and should not be repeated without evidence of a regression.

## 7. Manager, Publisher, Metadata Master and project lifecycle requirements

- Manager is for published videos only; it must not become a video upload flow.
- Publisher handles unpublished project publishing and should match Manager metadata layout.
- Metadata Master is an integrated feature/subtoolbox/page within Manager/Publisher, not a competing separate tool.
- Preserve the existing Publisher idea/script/edit generator but move it to a Write/Create (Create/Generate) page; the main publish UI should resemble YouTube Studio.
- Per-field generate/refine/analyze controls should be one row, not columns; preserve last-edited values and re-apply last save.
- Required publish field order:
  1. Video upload
  2. Title
  3. Thumbnail
  4. Visibility / Audience / Timestamps
  5. Description
  6. Location
  7. Playlists
  8. Community
  9. AI use
  10. Tags
  11. Category
- Visibility is a four-option dropdown; playlists are a channel playlist dropdown, not radios; location is a combo with suggestions; audience is an “is it for kids” toggle; AI use and Community are toggles.
- Education category adds timestamped questions using the 4-character-plus-colon line format.
- Tags use the color-ranking Add Tags primitive.
- Title/description use the upper-right colored-label/floating-area variant.
- Projects should track project/package metadata, thumbnails and inputs, and preserve post-publishing packages, publish dates, edits, generations, decisions and metadata changes for later analytics joins.
- Calendar integration: full-width full-interior toolbox tool (not a nested module); 42-cell month grid; max two markers plus “more”; multi-day bars; selected-day detail above calendar; status badges match Analytics sync-controller monochrome border/light transparent fill/colored all-caps thicker text; fix unscheduled projects that have scheduled publish dates and selected-date schedule button not updating the calendar.
- Header word-toggle styling should match Manager Manage/Generate and Publisher Create/Publish. Apply consistently to Projects Channel/Project and Board/Calendar, and Thumbnail Studio Studio/Analyzer.
- Audit Studio Hub color-pair order against the 12-palette rule; many upper tool icon sections were pink and need review.

## 8. Deployment and verification constraints

- Canonical integration branch is `master/consolidated-feature-integration`; never use `main` as the implementation target.
- Avoid Codespaces; use a fresh feature branch from current integration.
- Vercel status checks have reported `upgradeToPro=build-rate-limit`. Treat these as rate-limit/infrastructure failures, not successful builds and not proof of a code regression.
- A successful source edit or merged PR does not establish runtime behavior. Report exact verification performed and what remains.
- Known Render host allowlist history includes `viewtube-bsbw.onrender.com`, `viewtube-1-y36p.onrender.com`, and `viewtube-system-convergence.onrender.com`; referenced current URL was `https://viewtube-system-convergence.onrender.com/studio`. Verify current deployment status before relying on it.
- Earlier deployment logs included VideoPublisher, VideoManagerWidget, StudioHub and UIReferenceLibrary chunks. A prior report noted a red X on main; do not alter main to address it without an explicit instruction.

## 9. Recommended execution order

1. **Recover/audit current state:** inspect current #171 result and compare PR merge-time patches vs later branch-only commits. Update a per-file recovery ledger; do not repeat merged changes.
2. **Close Studio contract gaps:** resolve textarea typography, run source-level conflict scan, verify compact split-left, shadow anchor, text fill/focus, word-toggle layout and icon geometry. Update the existing exception index.
3. **Run quality gates:** focused tests, typecheck, lint/build, browser computed-style and visual verification; document blocked checks explicitly.
4. **Vault Phase 0–2:** review #173 diff/CI, run tests and browser checks, then complete image output/import/storage edge cases before adding later video processing.
5. **Creator Workbench Phase 4/5:** wire lifecycle to actual tools and verify persistence, undo/redo, audio/captions and final renders; validate #172.
6. **Primitive consolidation:** compare attached reference files and consolidate consumers to canonical Studio Controls rather than duplicating implementations.
7. **Manager/Publisher/Projects/Calendar integration:** follow the field order, shared primitives, project lifecycle and calendar contracts above.
8. **Release certification:** validate integration branch, deployment and actual browser behavior; do not equate merged PR count with completed features.

## 10. Definition of done for every recovery item

A task is done only when:
- the required behavior is specified and traceable to a user instruction or canonical design source;
- the implementation is on a fresh branch based on current integration;
- the PR diff contains the actual change;
- the PR is merged into `master/consolidated-feature-integration`;
- the merged target file/commit is rechecked;
- focused tests and applicable typecheck/lint/build pass, or a concrete blocker is recorded;
- browser/computed-style/render checks pass for visual or media behavior, or the item remains explicitly **implemented-unverified**;
- docs, exception ledger, and component-library examples agree with the actual implementation.

**Do not mark a phase or system complete merely because its plan, audit, scaffolding, or PR exists.**
