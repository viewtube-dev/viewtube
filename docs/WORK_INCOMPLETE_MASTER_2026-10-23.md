# ViewTube Incomplete Work Master — 2026-10-23

**Target integration branch:** `master/consolidated-feature-integration`  
**Repository:** [viewtube-dev/viewtube](https://github.com/viewtube-dev/viewtube)  
**Purpose:** Single working register of unfinished work surfaced in conversations, plans, branch/PR descriptions, and recent implementation attempts from **2026-10-16 through 2026-10-23**.  
**Status rule:** A merged PR means its source changes landed; it does **not** mean tests, runtime behavior, accessibility, responsive layout, or deployment have been certified. Do not mark a workstream done without current-head evidence.

> This is a reconciliation document, not a claim that every branch was exhaustively inspected or every test was run. Recheck the live target branch and PR/CI state before acting. Avoid duplicate implementations and never merge a stale branch just to close it.

## 1. Executive summary

The immediate priority is to **finish verification and reconciliation**, not start another broad rewrite.

1. **AI Brain chat completion and regression certification** — the structural and evidence/prompt-library increments have landed across #733, #744, #779, #802, #818, #819, #845–#847, and #859. Their descriptions repeatedly state that tests, typecheck, full-suite, browser, mobile, or accessibility verification were not run in the connector session. Verify current source and close those acceptance gaps.
2. **Studio Controls release gates and visual contracts** — #856, #858, #860 and #862 have merged. #860 reported the confirmed-catalog audit, production build, smoke, and Brain quality loop passing, but also reported failures in `test:focused`, `test:confirmed-library-layout`, and `typecheck`; the full suite was still running at the last observation. #862 reports Vercel rate-limit statuses, not a successful build, and lacks local/browser verification. Do not equate merged with green.
3. **AI Brain evidence loop / runtime truth** — reconcile the exact typed `EvidenceRecord[]` passed to the model with the records graded for quality and stored in the turn snapshot. The recurring defect is that prompt evidence, graded evidence, and snapshot evidence can diverge (snapshot stores only evidence ID strings in the reported path). Keep the canonical records and stable IDs consistent end-to-end.
4. **Composer / conversation viewport** — #847 superseded stale-base #843 and landed the shared `BrainComposerShell` and `ChatConversationViewport`. Verify the reported `conversationViewportRef is not defined` runtime error is absent, scroll-follow behavior is stable, and mobile interactions do not jump the page upward.
5. **Studio controls follow-through** — validate the confirmed catalog hierarchy and PR #756 button grid, size tiers and field contracts, ten-bar/responsive bar-toggle behavior, focus/multiselect changes, SplitAccordion motion/geometry, Vault migrations, and publishing/upload ratios. Reconcile conflicts between old branch contracts and the latest user requirements before changing CSS.
6. **No speculative UI** — capabilities, attachments, action modes, prompt provenance, durable permissions, and learning status must only be shown as operational when the canonical API/store actually supports them.

## 2. Source-of-truth and operating rules

- Start every task with a fresh audit of `master/consolidated-feature-integration`, its current working tree/head, merged PRs, open/draft PRs, and the exact files already changed. Preserve landed work.
- Use the existing owners. No parallel Brain runtime, conversation/prompt registry, evidence store, analytics engine, persistence store, token system, or second Studio component library.
- Canonical Brain footholds include:
  - `src/views/AIBrainCommandInterface.tsx`
  - `src/components/brain/BrainQuestionPrompt.tsx`
  - `src/components/brain/BrainAnswerModules.tsx`
  - existing `BrainClaimEvidence`, `BrainTurnEvidenceRibbon`, `BrainEvidenceDrawer`, `BrainContextRail`, `BrainRuntimePanel`, `BrainComposerShell`, and `ChatConversationViewport`
  - existing Brain runtime, capability registry, prompt registry/resolver, conversation storage, EvidenceRecord/prompt-manifest, trace/receipt, outcome ledger, Project/ContentBuild and analytics-canon/VT-SYNC owners.
- Canonical Studio footholds include:
  - `src/studio-ui/primitives/StudioControls.tsx`, dedicated primitive modules, `src/studio-ui/tokens.ts`
  - `src/styles/studio-control-system.css` and the relevant field/entry/distillation CSS
  - `src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx` and `studio-hub-primitive-catalogs.css`
  - `scripts/audit/confirmed-catalog-coverage.mjs`, the Studio contract tests, and release-gates workflow.
- The Confirmed Primitive Library is a specimen/catalog of **real production exports**, not a second implementation.
- Add a regression test before changing behavior; run the narrow tests first, then relevant contract tests, typecheck, lint/build, full suite, and browser/accessibility checks. Record receipts and commit SHA.
- Never interpret Vercel daily deployment/build-rate-limit errors as passing or failing application code. Use GitHub Actions/local test output for code validation.
- Do not use Codespaces. Do not focus on Vercel as the primary implementation route.
- Only open a new PR after real repository edits exist; target `master/consolidated-feature-integration`. Prefer a small, reviewable follow-up PR with explicit verification status.

## 3. Priority register

### P0 — Must resolve before declaring the recent work complete

#### P0.1 — Current-head Studio Controls quality gates

**Relevant PRs:** [#856](https://github.com/viewtube-dev/viewtube/pull/856), [#858](https://github.com/viewtube-dev/viewtube/pull/858), [#860](https://github.com/viewtube-dev/viewtube/pull/860), [#862](https://github.com/viewtube-dev/viewtube/pull/862). All are reported merged.

- [ ] Re-run the release gates on the **current target head**, not an earlier PR head:
  - `npm run audit:confirmed-catalog`
  - `npm run test:focused`
  - `npm run test:confirmed-library-layout`
  - `npm run typecheck`
  - Studio control contract/motion tests and Brain quality loop
  - lint/build, smoke, and full test suite.
- [ ] Triage the known focused-test failures involving `StudioInlineStepper` / control-contract assertions and confirmed-library Button grid/CSS assertions; establish whether they remain on current head and fix or document exact baseline blockers.
- [ ] Check current typecheck failures rather than assuming they were resolved by later PRs.
- [ ] Confirm the full suite completed and capture the exact CI run/commit SHA.
- [ ] Run browser visual checks at mobile portrait, mobile landscape, tablet/intermediate, desktop, and wide desktop. Include keyboard focus, zoom, reduced motion, long content, light/dark theme where supported, and no horizontal overflow.
- [ ] Keep build-rate-limit checks categorized as infrastructure-only.

**Acceptance:** Current-head CI/test receipts are attached; no unresolved introduced failure is mislabeled as baseline; catalog and controls are visually checked.

#### P0.2 — AI Brain chat and Studio primitive verification

**Relevant PRs:** [#733](https://github.com/viewtube-dev/viewtube/pull/733), [#744](https://github.com/viewtube-dev/viewtube/pull/744), [#779](https://github.com/viewtube-dev/viewtube/pull/779), [#802](https://github.com/viewtube-dev/viewtube/pull/802), [#818](https://github.com/viewtube-dev/viewtube/pull/818), [#819](https://github.com/viewtube-dev/viewtube/pull/819), [#845](https://github.com/viewtube-dev/viewtube/pull/845), [#846](https://github.com/viewtube-dev/viewtube/pull/846), [#847](https://github.com/viewtube-dev/viewtube/pull/847), [#859](https://github.com/viewtube-dev/viewtube/pull/859).

- [ ] Audit the current source against `docs/brain/AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md` and the canonical [2026-10-19 redesign plan](AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md). Treat both as plans plus incremental history, not proof of completion.
- [ ] Verify `conversationViewportRef is not defined` is fixed in the running page and covered by a regression check if it was a real runtime regression.
- [ ] Verify one labelled conversation log, stable turn IDs, bottom sentinel, correct near-bottom follow policy, no forced scroll when reading older turns, and correct behavior on restore/retry.
- [ ] Verify the compact composer remains anchored at the bottom with mobile safe-area/keyboard handling and does not cause the page to jump upward when tapping buttons, focusing textareas, opening menus/dropdowns, or changing selection.
- [ ] Confirm composer keyboard behavior: Enter sends, Shift+Enter adds a newline, IME composition is not submitted, busy/stop/send behavior is correct, height resets appropriately, and focus remains usable.
- [ ] Verify prompt-library modules are collapsed by default, expand **in place**, list the prompts in the selected registry category, and keep preview plus **Send to chat** / **Edit first** inside the expanded module. Preserve search/filter and existing send/edit handlers; no new prompt registry.
- [ ] Verify response modules, user posts, creator prompts, response metadata, status badges, evidence actions, and feedback actions are compact, aligned, keyboard operable, and built from canonical Studio primitives.
- [ ] Check the current catalog has specimens for any newly introduced reusable chat primitives, with source provenance and contract tests; do not add a duplicate badge/button/input primitive where one already exists.
- [ ] Run focused Brain/chat/restore tests, Studio contracts, typecheck, full suite, browser checks, accessibility checks and long-conversation/performance checks.

**Acceptance:** No runtime errors; prompt and composer behavior works on mobile and desktop; tests and browser/accessibility results are recorded. Merged PRs are not counted as certified until these checks pass.

#### P0.3 — Evidence loop consistency (data integrity)

**Related documents:** `docs/brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md`, `docs/brain/AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md`, [PR #818](https://github.com/viewtube-dev/viewtube/pull/818), [PR #819](https://github.com/viewtube-dev/viewtube/pull/819), [PR #846](https://github.com/viewtube-dev/viewtube/pull/846).

- [ ] Trace the actual model prompt evidence from `BrainContextBroker.buildBrainContextPack` / `snapshot.inferredProfile.topEvidenceVideos` through evidence grading and turn persistence.
- [ ] Resolve the known mismatch: the prompt's evidence may differ from the `EvidenceRecord[]` graded by `BrainEvidenceQuality.buildBrainEvidenceQuality`; the runtime snapshot path was reported to retain only evidence ID strings.
- [ ] Make the exact typed canonical `EvidenceRecord[]` (or canonical record references with verified resolution) flow through broker → grader → snapshot → evidence ribbon/drawer → analytics handoff. Do not independently rebuild a second evidence list at each layer.
- [ ] Confirm the prompt evidence manifest matches the records actually sent to the model; citations must resolve against that prepared list, not merely have a plausible ID.
- [ ] Preserve prepared-versus-cited distinction, evidence quality state (empty selection, partial coverage, stale, missing, conflicting, legacy/unavailable), exact `EvidenceRequestSpec`, and stable source/video/snapshot/turn IDs.
- [ ] Confirm missing values remain missing and zero remains a real measurement; all numbers need canonical source/calculation references.
- [ ] Check local fallback, retry, restored turns and every response path emit the same evidence metadata contract.
- [ ] Verify Analytics handoff displays incoming evidence IDs and constraints honestly; do not imply a historical row was verified or filters were applied unless that actually occurred.

**Acceptance:** Prompt input, graded records, persisted snapshot, visible citations and handoff all refer to the same turn-bound evidence. Empty/missing/stale/conflicting cases remain distinct and are regression-tested.

#### P0.4 — Studio interaction regressions and recent contracts

**Relevant PRs:** [#817](https://github.com/viewtube-dev/viewtube/pull/817), [#858](https://github.com/viewtube-dev/viewtube/pull/858), [#862](https://github.com/viewtube-dev/viewtube/pull/862).

- [ ] Verify text inputs/textareas show the correct default primary glyph stroke, black focused text, 15% primary focus fill, primary inline stroke retained on focus, and secondary outline with correct width and zero offset.
- [ ] Verify clipping inside borders without ellipses on button/action/split/label faces.
- [ ] Verify multiselect shows the first selected label plus a separate black in-trigger `+N` badge, not a concatenated count string.
- [ ] Verify bar toggles display the intended number of bars at common widths, preserve proportional fill, step one bar at a time, and do not regress to a single centered bar. Reconcile the earlier desired ten-bar display with the new responsive-count behavior; use a deliberate supported `barCount` where the contract calls for a fixed count.
- [ ] Verify value-toggle focus-within outlines, focused arrows, centered side-counter dividers, and square/circular icon-button geometry.
- [ ] Verify no mobile tap/focus/menu interaction causes unintended viewport/page translation or upward jump.
- [ ] Ensure no fake shadows, geometry-moving hover/press animation, duplicate split borders, or unintended global focus glow.

**Acceptance:** Targeted regression tests pass and the real controls match the global contract at all supported tiers.

### P1 — Finish AI Brain functional and governance acceptance

The recent UI increments landed but the 2026-10-19 plan explicitly left several acceptance gates open.

#### Chat / prompt / capability reachability
- [ ] Create a capability-by-capability matrix from the canonical registry: discoverable entry → correct readiness/permission → canonical runtime call → real result/receipt → inspectable provenance.
- [ ] Verify attachments, cancellation, prompt-family overrides, output-format controls, and explicit execution-mode chooser only if canonical runtime/API support exists. Do not expose inert UI for unsupported functions.
- [ ] Ensure hidden feedback, journal, quick-action and intake records do not leak into model history unless they are actual visible conversation turns; preserve bounded recent project decisions, chronology and stable IDs.
- [ ] Verify exact creator-authored text survives sanitization, storage, learning capture, evidence matching and follow-up resolution. Keep raw text immutable; display text may be separately formatted.
- [ ] Test interrupted-turn retry: retry generation only, never repeat external side effects; link attempts to the original turn and preserve its evidence pack/history.

#### Context, prompts and permissions
- [ ] Verify context used by a response is tied to that exact turn and labelled confirmed/inferred/temporary; distinguish context available from context actually used.
- [ ] Ensure previously answered learning questions are not asked again unless outdated, contradicted or explicitly reopened; offer correction rather than silently discarding conflicts.
- [ ] Populate active prompt family/version, inherited defaults, creator overrides and schema from a turn-specific resolver/trace API. A model response describing its own prompt is not authoritative provenance.
- [ ] Verify browser-local saved permission gates are not represented as server-persisted policy; check event consumers, cross-tab synchronization and channel/global override behavior.
- [ ] Confirm external-action and publishing approval boundaries remain explicit; a handoff is not approval or publication.

#### Outcomes and governed learning
- [ ] Audit event producers for creator edits, variant selection, recommendation acceptance/rejection, task completion, publication and analytics checkpoints.
- [ ] Verify outcome lineage joins to exact Project → ContentBuild → asset → approved publication → published video → analytics/evaluation identities; do not infer missing IDs from labels/URLs.
- [ ] Keep measured outcomes separate from creator preference and keep asset decisions from being double-counted in general Brain outcome totals.
- [ ] Verify correction, contradiction, expiry, consent/privacy exclusions, channel-scoped versus global learning, and evaluation-candidate promotion gates.
- [ ] Keep learning candidate review/promotion in the existing Evaluation Inbox/governance path; observational UI must not mutate durable profile memory or promote candidates.
- [ ] Use existing BrainTrace/ToolReceipt and evaluation surfaces for observability; no parallel observability store.

### P1 — Studio Controls library and migrations

#### Confirmed Primitive Library / button grid
- [ ] Inspect current catalog source after #856/#858, confirm specimens import real Studio exports, and preserve existing stateful behavior.
- [ ] Verify the eight collapsed-by-default families and Global Defaults + Exceptions first/collapsed; ensure word toggles live under Text Controls and split badges under Buttons.
- [ ] Reconcile and visually verify the requested Button grid from PR #756: one Supreme full-width; two Supreme halves; Standard full-width; two Standard halves; standard fractions (1/3, 1/4, 1/6, and 2×1/8); compact fractions (1/3, 1/4, 2/9, 1/9, 1/12); then compact/micro rows including 3×1/8, 2×1/16 and micro subrows 7A/7B. Check actual breakpoints and avoid obsolete grid assertions.
- [ ] Check the actual Button and Split-left sections—not only generic catalog cards—use the intended grid.
- [ ] Confirm every confirmed specimen records production source/export and applicable exceptions; distinguish source-confirmed from browser-visually-certified.

#### Global token and field contract reconciliation
- [ ] Keep one sizing authority in `src/studio-ui/tokens.ts` and the variable emitter. Normative tiers in the current contract are Supreme 60px, Standard 44px, Compact 28px, Micro 12px, with registered family-specific micro support only.
- [ ] Verify stroke/radius/type/icon sizing and external-only 4px gaps; no internal split seams, duplicated borders, global shadows or shell movement.
- [ ] Resolve conflicting historical line-height statements before editing: older PRs #713/#718 used 0.75; a later user instruction requested replacing all relevant 0.75 sources/tokens with 0.85; the current global defaults document says 1.0. Audit current target source and the latest explicit requirement, identify intended field/textarea-specific exceptions, update source + docs + tests together, and do not blindly restore a stale branch value.
- [ ] Verify raised floating labels, textarea minimum writing surface, caret color, focus fill/stroke/outline, clipping, and StudioTextBox behavior against the latest contract.
- [ ] Confirm status indicator badges are rectangular (not accidentally pill-shaped) where requested.
- [ ] Verify `StudioCircleIconButton` is fully circular and square icon-button groups are content-width where required.

#### SplitAccordion / split-family / motion
- [ ] Audit the current `StudioSplitAccordion` source and `studio-split-accordion.css` after #765; keep the retired `StudioSplitRailAccordion` out of active imports, exports, styles and catalog mentions.
- [ ] Reconcile the latest “StudioSplitAccordion Train Motion Complete Pack” proposal against current source before applying it. Do not overwrite later merged behavior with a stale full-file replacement.
- [ ] Preserve square 1:1 icon rails, single shared dividers, correct trailing divider for an open non-last pane, rightmost enabled default-open item, arrow/Home/End keyboard behavior, 280ms hover-preview lock, and reduced-motion behavior.
- [ ] Confirm no shadows, fake shadows, geometry translation, or extra global token changes. Motion should affect only the explicitly allowed inner state/label presentation.
- [ ] Re-run split accordion contract tests and visually verify Standard 44px, Compact 28px, and Micro 12px where supported.

#### Vault / upload / publishing migrations
- [ ] Reconcile draft migration branches and source PRs before cherry-picking: #713 and #718 were described as unfinished/draft; #771 fixed three retired split-input call sites; avoid reintroducing removed exports.
- [ ] Audit every remaining legacy spectrum-tag and word-toggle consumer; remove old exports/styles only after all consumers migrate.
- [ ] Finish nested-module-shell audit for Compare & Versions, Inspector, Relationships & Duplicates and equivalents.
- [ ] Audit all nested upload consumers, multi-file selection/drop behavior, header toggle behavior, textarea focus/caret/labels and StudioTextBox variants.
- [ ] Preserve canonical Vault search, Upload Frame, Sort/State/View dropdowns, Tags/Import and Direct/Staged toggles where already migrated on the target.
- [ ] Verify publishing card aspect ratio is **5:7** and upload frame is **16:9** at real consuming callsites; ensure responsive behavior does not stretch the inner face incorrectly.
- [ ] Run typecheck, lint, build, focused migration contracts and mobile portrait/landscape/desktop browser checks.

### P2 — Documentation, historical branches, and release hygiene
- [ ] Update `docs/brain/AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md`, `AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md`, the Brain quick-wins master plan, Studio defaults/exceptions index, Confirmed Library source-of-truth doc, documentation registry and certification ledger with real status/receipts.
- [ ] Update plan checkboxes only when code, tests and required certification have evidence. Mark incomplete phases as “implemented, not certified” when appropriate.
- [ ] Reconcile open/draft PRs #713 and #718 against the current base and later merged changes. Do not merge stale branches wholesale; harvest only unique, still-needed changes with a current-base diff.
- [ ] Reconcile the consolidation PR history (#452 and source PRs #365/#377/#386/#390/#396/#401/#424) and explicitly disposition any unique analytics/Brain work outside its intended scope. Do not close source PRs until unique changes are accounted for.
- [ ] Keep #843 closed/superseded by #847; do not revive the stale-base branch.
- [ ] Re-check all PRs and branch tips immediately before opening any follow-up; branch names alone are not proof of current content.
- [ ] Verify the Render deployment source commit and running app only after source gates pass; do not report deployment readiness based on a preview status alone.

## 4. GitHub reconciliation snapshot

Observed from GitHub connector results on 2026-10-23. Recheck live state before execution.

| PR | Observed status | What landed / why it matters | Remaining work |
|---|---|---|---|
| [#729](https://github.com/viewtube-dev/viewtube/pull/729) | Merged | Overhaul plan, source audit, confidence chip migration | Tests and browser certification |
| [#733](https://github.com/viewtube-dev/viewtube/pull/733) | Merged | Brain evidence composition, workspace navigation, multiline composer, turn evidence ribbon, null-vs-zero trend fix | Focused/full tests, typecheck, routes, responsive/accessibility certification; historic static-quality, focused-contract, source-governance and Brain quality-loop failures need current-head triage |
| [#744](https://github.com/viewtube-dev/viewtube/pull/744) | Merged | Studio-backed composer/question controls, split-right button | Tests, typecheck/build and visual certification |
| [#779](https://github.com/viewtube-dev/viewtube/pull/779) | Merged | Inspectable lineage in existing Brain runtime panel | Tests and lineage verification |
| [#790](https://github.com/viewtube-dev/viewtube/pull/790) | Merged | Brain UI/accessibility bridge documentation | Validate implementation against requirements |
| [#802](https://github.com/viewtube-dev/viewtube/pull/802) | Merged | Evidence request constraints displayed on restored turns | Tests and browser verification |
| [#817](https://github.com/viewtube-dev/viewtube/pull/817) | Merged | Toggle divider/focus parity contracts | Execute current contract tests and browser checks |
| [#818](https://github.com/viewtube-dev/viewtube/pull/818) | Merged | Truthful evidence quality states | CI + keyboard/screen-reader/mobile certification |
| [#819](https://github.com/viewtube-dev/viewtube/pull/819) | Merged | Evidence-to-Analytics trace, resolved citation counts, handoff panel | Verify exact record/filters and accessibility; tests |
| [#845](https://github.com/viewtube-dev/viewtube/pull/845) | Merged | Fix chat primitive tests to avoid absent test dependencies | Execute tests/typecheck |
| [#846](https://github.com/viewtube-dev/viewtube/pull/846) | Merged | Restore evidence/context provenance regression | Execute conversation-store suite/typecheck |
| [#847](https://github.com/viewtube-dev/viewtube/pull/847) | Merged | Replaces #843; composer shell + conversation viewport | Runtime, scroll, mobile keyboard, tests/build/browser checks |
| [#856](https://github.com/viewtube-dev/viewtube/pull/856) | Merged | Studio distillation layer and catalog family grouping | Tests/typecheck/build/browser checks |
| [#858](https://github.com/viewtube-dev/viewtube/pull/858) | Merged | Completes catalog grouping and audit refinements | Confirmed-layout/focused tests and visual certification |
| [#859](https://github.com/viewtube-dev/viewtube/pull/859) | Merged | Prompt library collapsed inline modules with actions inside | Browser, keyboard and mobile verification |
| [#860](https://github.com/viewtube-dev/viewtube/pull/860) | Merged | Runs confirmed catalog audit in release gates | Audit/build/smoke/Brain loop reported passed; focused tests, confirmed-library layout, typecheck reported failing; full suite status incomplete at last observation |
| [#862](https://github.com/viewtube-dev/viewtube/pull/862) | Merged | Field/multiselect/focus/adaptive bar contracts | Current-head test/build/browser verification; Vercel rate-limit failures are not code receipts |
| [#843](https://github.com/viewtube-dev/viewtube/pull/843) | Closed, not merged | Stale-base composer/viewport attempt | Superseded by #847; leave closed |
| [#713](https://github.com/viewtube-dev/viewtube/pull/713) | Reported draft/unfinished | Partial Vault migration cleanup | Reconcile unique changes; complete audits/tests before merge |
| [#718](https://github.com/viewtube-dev/viewtube/pull/718) | Reported draft/unfinished | Fields and Vault primitive migrations | Stale/diverged base risk; reconcile, do not merge blindly |
| [#765](https://github.com/viewtube-dev/viewtube/pull/765) | Merged | Split accordion CSS replacement | Run contract tests/build and visual verification |
| [#771](https://github.com/viewtube-dev/viewtube/pull/771) | Merged | Removed three retired split-input callsites | Fresh build to prove no further missing exports |
| [#644](https://github.com/viewtube-dev/viewtube/pull/644) | Search result only; recheck live status | AI Brain master resource + skill | Verify canonical docs are present/linked and use the current resource |
| [#634](https://github.com/viewtube-dev/viewtube/pull/634) | Search result only; recheck live status | Brain feature master/readiness roadmap | Verify current status and consistency with merged work |
| [#452](https://github.com/viewtube-dev/viewtube/pull/452) | Search result only; recheck live status | Consolidation of Studio source PRs | Release gates and unique-change disposition required |

### Branches worth auditing (not an instruction to merge them)

The GitHub branch search surfaced branches including:

- `master/consolidated-feature-integration` — canonical target.
- `feat/brain-governed-inbox-studio-controls-2026-10-23`
- `feat/brain-settings-studio-controls-2026-10-23`
- `feat/brain-studio-controls-context-and-composer`
- `feat/brain-studio-controls-shell-2026-10-23`
- `feat/studio-controls-distill-library-fix-pack`
- `fix/studio-controls-contract-pack-2026-10-23`
- `fix/studio-controls-confirmed-library-grid`
- `fix/studio-controls-coherent-contract`
- `fix/studio-controls-catalog-current-integration-2026-10-17`
- `fix/studio-controls-catalog-integration-head-2026-10-17`
- `fix/complete-studio-controls-vault-migrations-final` and related `-rebased`, `-v2` branches
- `consolidate/studio-controls-prs-365-377-386-390-396-401-424-2026-10-17` and `...-current-base-2026-10-17`
- `codex/studio-controls-vault-migration`, `codex/vertical-word-toggle-studio-controls`

Branch presence is not proof of an open PR, unique commits, or unmerged useful work. Compare each relevant branch against the latest target and the merged PR graph before harvesting.

## 5. Recommended execution sequence

1. **Freeze scope and establish the exact target SHA.** Pull current PR states, release-gate results, and changed-file lists. Record the target commit in the work log.
2. **Run current-head gates before more edits.** Capture baseline failures for typecheck, focused contracts, confirmed-library layout, Brain quality loop, build and full suite.
3. **Fix true regressions first:** undefined viewport ref, scroll/page-jump behavior, bar-toggle count/rendering, field/focus/multiselect contracts, catalog grid assertions. Add regression tests.
4. **Close the AI Brain evidence integrity loop.** Trace prompt records → grading → turn snapshot → ribbon/drawer → Analytics handoff. This precedes cosmetic expansion because UI must not claim unsupported evidence.
5. **Certify chat and prompt library.** Test composer, sticky bottom behavior, prompt modules, existing runtime actions, restore/retry, mobile keyboard, accessibility and long conversations.
6. **Close Studio Controls source/consumer audits.** Confirm actual primitive exports and catalog specimens, SplitAccordion, Vault legacy consumers, upload/publishing ratios, size tiers and line-height decisions.
7. **Run full verification on the resulting head.** Typecheck, lint, relevant tests, full suite, production build, smoke and browser matrix. Separate introduced defects from reproducible baseline debt.
8. **Update docs and PRs.** Update this register and canonical plans with status and evidence; open a focused follow-up PR only for actual edits, with explicit target branch and no stale-base changes.
9. **Release verification.** Verify the deployed source commit and live page only after required checks pass. Do not claim production readiness before that.

## 6. Definition of complete

A task can be marked **Done** only when all applicable criteria are met:

- [ ] Current target source has been inspected and duplicate/stale implementations are excluded.
- [ ] Behavior is implemented through canonical owners and documented contracts.
- [ ] Regression tests exist and pass; relevant focused contracts, typecheck, lint/build and full suite are accounted for.
- [ ] Browser verification covers mobile portrait/landscape and desktop breakpoints, keyboard/focus, accessibility, reduced motion and long content as applicable.
- [ ] No fake status, unsupported evidence, mock action, invented readiness, or approval/publishing implication is exposed.
- [ ] Canonical docs, registry and certification ledger match actual code.
- [ ] The commit/PR and any deployment source are identified; blockers and unverified areas remain explicit.

**Last updated:** 2026-10-23. Reconcile this document with live GitHub state whenever work resumes.
