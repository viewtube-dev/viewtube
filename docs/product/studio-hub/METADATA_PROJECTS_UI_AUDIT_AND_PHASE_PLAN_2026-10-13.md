# Metadata + Projects Updates — Backend/UI Audit and Phase Plan

**Status:** Phase 1 in progress — lifecycle certification fixture  
**Date:** 2026-10-13  
**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `feat/metadata-sets-styles-goals`  
**Scope:** Metadata sets, project/package manifestation, update lineage, and the path from a project to measured post-publication outcomes.

## Decisions locked from the user

- Accept the prior recommendations except recommendation 3: **do not restore/rearrange workflows, remove misplaced controls, or consolidate duplicate orchestration as part of this work.** This plan is additive and certification-focused.
- Keep the working/editing surface quiet. Default to concise labels and little explanatory copy. Longer explanations, advanced options, and contextual help appear only when the user enables them in preferences.
- Detailed history and analytics must be fully accessible in a separate tool/location, not mixed into the live metadata-editing workspace. Metadata Manager/Master should link to that location, not become an analytics dashboard.
- Reuse existing Project, ContentBuild, Asset Engine/Vault, Video Package/Publishing Package, ActionPacket, Analytics Canon/VT-SYNC, Evidence, and Outcome/Evaluation authorities. Do not add a parallel store.
- Keep the existing Video Manager and Video Publisher ownership boundaries unchanged.

## 1. Backend audit — findings from source inspection

### Existing foundations to preserve

| Area | Existing source/contract | Current capability evidenced |
|---|---|---|
| Project identity | `src/services/projects/ProjectContentIdentityService.ts` | Resolves Project to a canonical ContentBuild and initializes the Video Package against that identity. Existing tests cover idempotency and local-draft scope. |
| Content lifecycle and event history | `src/services/asset-engine/ContentBuildRepository.ts` | Stores build identity, revisions, asset IDs, selections, versions, variants, YouTube binding, and append-only lifecycle events including asset selection/finalization and analytics checkpoints. |
| Asset/version/selection lineage | `ContentBuildRepository.ts` | Supports attaching assets, versioning, variant groups, selecting/finalizing slots, and event provenance. |
| Video Package | `src/services/video-package/contracts.ts`, `VideoPackageRepository.ts`, `ProjectVideoPackageBridge.ts` | Typed package with project/content-build identity, title/thumbnail variants, description/tags, publishing state, provenance, handoffs, and compatibility projection to ContentBuild. Repository validates stored package shapes and has recovery behavior. |
| Publishing boundary | `src/services/asset-engine/PublishingPackageProjection.ts`, `PublishTransaction.ts`, `ApprovedPublishSnapshot.ts` | Read-only package projection and explicit approved publish snapshot/transaction boundaries; publication should not be simulated by editing metadata UI state. |
| Analytics evidence | `src/services/longformOptimizationComparison.ts`, Analytics Canon/VT-SYNC | Existing comparison flow records an `analytics.checkpoint` event on the same ContentBuild and references an analytics evidence window. |
| Evidence and outcomes | `src/services/brain/EvidenceRecord.ts`, `src/services/brain/BrainOutcomeLedger.ts`, `src/services/brain/AlgorithmEvaluationEngine.ts` | Existing evidence schema carries project/content-build/video/asset identity, freshness, confidence, metric context, and provenance. Outcome/evaluation services exist but producer coverage and lifecycle continuity still need certification. |
| Project manifestation | `src/components/projects/projectManifestation.ts` and `ProjectManifestation.tsx` | Projects UI can project current metadata, selected thumbnail, saved asset slots, ContentBuild identity, package identity, and swap/load affordances. |

### Gaps and risks to verify in Phase 1

1. **Metadata Master has a separate local draft key.** `src/services/metadataMaster.ts` stores at most 25 package snapshots under `viewtube:metadata-master:packages:v1`; it is not the canonical Video Package repository.
2. **Metadata Master history is not a complete lifecycle history.** The UI currently renders only the five most recent saved package records inside a collapsed `PACKAGE HISTORY` subtoolbox. It does not represent every edit, generation, selection, handoff, publish event, analytics checkpoint, and evaluation as one navigable timeline.
3. **Metadata package persistence is best-effort.** `saveMetadataMasterPackage` swallows storage errors, while `listMetadataMasterPackages` parses the raw array without validating/backfilling legacy records. The UI must not imply a durable save if persistence failed.
4. **Set state and package state differ.** Generated sets are held in component state; the local history stores the selected primary package, not the full set collection. Saved set round-trip and set identity across reloads need explicit tests.
5. **Project identity can be missing in the Metadata Master UI.** The view resolves workspace ContentBuild context, but the UI currently permits manually typed concept/niche and a free-form published video ID. Phase 1 must prove the canonical identity path rather than treating those text fields as authoritative identity.
6. **The package model and metadata-master model are adjacent, not yet certified as one persistence round-trip.** The former has schema validation, provenance, canonical ContentBuild links, and compatibility projections; the latter has goal/intensity/style and package scores. A safe adapter/contract mapping must be tested before attempting deeper integration.
7. **Analytics/evaluation continuity is only partially proven by individual service tests.** Existing code can record an analytics checkpoint and existing evaluation/outcome services exist; Phase 1 must verify that project, ContentBuild, package, selected assets, published video, evidence/checkpoint, and evaluation all reference the same lifecycle identity.
8. **Copy density is higher than the preferred editing experience.** The current UI shows a score explanation, ownership alert, goal/style helper descriptions, and a status line by default. The target is a compact editing surface with optional guidance; this should be implemented without removing controls or rearranging workflows.
9. **Detailed history/analytics are currently mixed into the Metadata Master component.** The existing collapsed history block is only a summary, not a complete audit surface. Full timeline and measurement views belong in a separate location owned by the existing lifecycle/analytics authorities.

These are source-level findings. Runtime visual verification and test/build certification remain pending until the Phase 1 fixture is run against the branch.

## 2. Front-end audit — current manifestations

| Feature | Current manifestation | Audit status |
|---|---|---|
| Goal / intensity / style | Goal dropdown, three intensity buttons, style dropdown | Present; settings reach the generation brief. |
| Context | Concept, niche, audience, script, duration, channel, references, optional video ID | Present; canonical project selection/load needs stronger manifestation. |
| Generate 1/3/5 sets | Generation action and set-count controls | Present; verify every returned candidate has a coherent full package and correct style/config metadata. |
| Editable package | Title, thumbnail direction/text, description, tags, chapters, category, playlists, end-screen | Present; field-level actions/dirty-state consistency need follow-up. |
| Package evaluation | Heuristic score and warnings | Present; clearly label score as a heuristic, not a predicted outcome. |
| Candidate sets | Cards show label, score, strategy/style, title and description, with a Use action | Partial; not a full comparison or persisted multi-set workspace. |
| Save / handoff | Save package and handoffs to Publisher, Thumbnail Studio, Manager | Present; verify identity and persistence semantics; no live publish/mutation from selecting a set. |
| Project manifestation | Shared Projects component exists | Present elsewhere; must be connected/verified in metadata workflow without creating another project selector authority. |
| History | Five latest package records, collapsed inline | Insufficient; move detailed history to a separate location and keep only a small optional link/summary in editing. |
| Analytics / outcomes | Not represented as a full view in Metadata Master | Correct ownership direction; expose in separate Analytics/Content Analysis location through canonical IDs. |
| Guidance copy | Helper paragraphs and ownership explanation visible by default | Change target: concise by default, expanded guidance only when preference is enabled. |
| UI primitives | Metadata Master uses `components/subtoolbox/SubToolboxPrimitives` and SubToolbox layouts | Existing implementation debt; do not perform the excluded workflow/control-removal/duplicate-orchestration recommendation in this phase. New components must follow the canonical UI-system direction once their required primitive/component source is confirmed. |

## 3. Phase 1 — vertical lifecycle certification fixture

**Goal:** prove the existing contracts carry one item of content through the lifecycle without introducing replacement services.

### Fixture path

`Project → ContentBuild → Asset/Option → Video Package → Published Video → Analytics Checkpoint → Outcome/Evaluation`

### Work items

1. Build a deterministic integration fixture from existing test helpers and canonical services.
2. Create/resolve one Project and assert one canonical `projectId` + `contentBuildId` pair.
3. Attach at least one metadata asset/option and select it through ContentBuild selection APIs; assert version/selection events retain the same ContentBuild identity.
4. Create/load the existing Video Package and assert project/content-build scope matches the fixture. Verify selected metadata/asset references survive repository round-trip.
5. Bind a published-video identity through the existing ContentBuild API; do not upload or mutate a live YouTube video.
6. Record a deterministic analytics checkpoint/evidence reference against the same ContentBuild and published video identity, using the existing checkpoint event contract.
7. Exercise the existing evaluation/outcome contract with deterministic observations and assert it references the same source event/evidence and preserves unavailable/insufficient-data semantics.
8. Assert the event chain is traceable in chronological order and that no duplicate Project, ContentBuild, Video Package, asset identity, or analytics store is created.
9. Run focused tests first, then repository typecheck and build; report exact results without treating Vercel deployment throttling as a test failure.
10. Document any broken link as a concrete follow-up task; do not broaden into workflow rearrangement or ownership refactoring.

### Acceptance criteria

- Every stage can be traced to the same `projectId`, `contentBuildId`, and, after binding, `videoId`.
- Metadata asset/option IDs are preserved through selection, package projection, and publish snapshot references.
- Analytics checkpoint carries a real source/window reference and is recorded on the same ContentBuild.
- Evaluation distinguishes measured, unavailable, insufficient, and pending states; it does not fabricate a positive result.
- Re-running the fixture is deterministic and idempotent where the existing contracts promise idempotency.
- No parallel project, package, analytics, or history store is introduced.
- No live publishing or remote mutation is performed by the fixture.

## 4. Follow-on phases

### Phase 2 — saved-set round-trip and shared metadata contract
- Define/test a compatibility mapping from Metadata Master candidate sets to canonical Video Package artifacts/versions.
- Persist full set identity/configuration and selected working state using existing package/ContentBuild authorities where supported.
- Normalize legacy Metadata Master records safely; preserve recoverable raw data on migration failure.
- Make save errors visible instead of silently claiming success.

### Phase 3 — concise editing UI + optional guidance preference
- Keep goal/style/intensity and essential actions visible.
- Default to compact labels and no explanatory paragraphs while the user is editing.
- Add one preference such as **Show guidance and explanations** (off by default); only then reveal goal/style explanations, score interpretation, and contextual help.
- Keep loading/error/save feedback brief and actionable.
- Do not remove existing controls or rearrange workflow sections in this plan.

### Phase 4 — dedicated history and analytics location
- Provide a separate Metadata History / Performance location, linked from Metadata Master and project manifestation.
- History timeline reads canonical ContentBuild events, package versions, ActionPacket/ToolReceipt/GenerationRecord provenance where available, publish transactions, and change events.
- Analytics views read Analytics Canon/VT-SYNC and evidence references; no metric duplication into metadata records.
- Show before/after windows, freshness, scope, exact changed fields, selected variants, observed outcomes, confidence, and limitations.
- Keep interpretation (Content Analysis) separate from raw measurement (Analytics); do not embed the full dashboard into the edit surface.

### Phase 5 — ten reusable component/compound-system builds
Build only after the Phase 1 lifecycle contract is certified and after checking the canonical primitive/component library.

1. **Project + ContentBuild Context Strip** — compact project/video identity, current build, status, and switch/load action.
2. **Metadata Package Manifest Card** — title/thumbnail/description/tag completeness, current version, readiness, and source identity.
3. **Metadata Set Comparison Workspace** — compare complete package candidates, highlight field differences, select one working set. (Listed as a future candidate; do not use this item as authorization to rearrange current workflows.)
4. **Metadata Field Editor Group** — consistent field, dirty state, field-level generation/refinement actions, and optional help.
5. **Version / Variant Selector** — show available saved versions and candidate variants with selected/final distinctions.
6. **Change Summary Strip** — compact “what changed” view with previous → current values, shown on demand.
7. **Save / Restore State Control** — saved/unsaved/error states, restore-last-save action, and safe recovery feedback.
8. **Handoff Package Preview** — destination, included fields/assets, identity, and explicit confirm action before sending.
9. **Lifecycle Event Timeline** — dedicated history location; filters metadata edits, generations, package versions, selections, handoffs, publication, and checkpoints.
10. **Metadata Outcome Comparison Panel** — dedicated analytics location; compare canonical before/after windows and expose metric scope, evidence, confidence, and limitations.

The ten items are proposed component/system work, not ten new primitive families. Prefer existing canonical primitives and variants; only create a new primitive when a reusable interaction/visual contract is genuinely missing.

## 5. Non-goals and guardrails

- No workflow restoration/rearrangement, removal of misplaced controls, or duplicate-orchestration cleanup in this work (excluded recommendation 3).
- No new analytics truth store, history database, project store, asset store, package authority, or AI provider path.
- No silent application of a selected metadata set to a published video.
- No publication action from the metadata-editing workspace.
- No dense explanatory prose in the normal editing state.
- No claims that a metadata change caused an outcome without comparable evidence and appropriate qualification.

## 6. Open implementation questions (non-blocking for Phase 1)

1. Should the separate history/performance location be a dedicated Metadata History page linked from Analytics, or a section within the existing Analytics tool? Default plan: a distinct route/location with Analytics owning measurements and Content Analysis owning interpretation.
2. Should the optional guidance preference be global to ViewTube or scoped to Metadata Master? Default plan: scoped to Metadata Master first, using the existing settings/preference pattern.
3. Should metadata candidate sets be retained as first-class Video Package variants or represented as package versions with linked title/thumbnail variant groups? Phase 1 will inspect the existing contracts and document the best-fit mapping; it will not invent a parallel set store.


## 7. Runtime UI inspection — 2026-10-13

Read-only inspection of [Studio Hub](https://viewtube-system-convergence.onrender.com/studio) completed after Render's cold start. The global Analytics navigation points to [Local Analytics](https://viewtube-system-convergence.onrender.com/local-analytics).

Observed on the rendered page:

- Metadata Master is available as a collapsed pink toolbox between Video Publisher and Content Analysis.
- The six current sections render: Context + Optimization Brief; Generate + Optimize; Publication Package Canvas; Evaluate + Compare; Handoff + Publishing Control; Package History.
- Empty package readiness is 34/100 (Needs Work), with missing title, description, tags, and thumbnail-direction warnings. This is an empty-state score, not evidence of a generated package's quality.
- Package History is empty, and no inline analytics panel is present. A separate global Analytics destination is available.
- Video Manager renders its metadata editing sections and fields; its project area reports no projects available in the inspected session. Publisher reports no canonical publication package ready.
- Thumbnail Studio and End-Screen Architect show missing AI/API-key prompts.
- No runtime exception, console error/warning, or broken image was observed during read-only reload. No forms were submitted and no settings or data were changed.

This confirms the source-level findings: the editing flow and handoff controls are present; history is only a short, empty package list; full analytics already has a separate route; and the project/package lifecycle was not populated in the inspected session. Runtime observation is limited to the deployed build at the URLs above, not the proposed branch.


## 8. Phase 1 verification record — 2026-10-13

GitHub Actions release-gate run [#337](https://github.com/viewtube-dev/viewtube/actions/runs/38468338790) ran against the Phase 1 lifecycle fixture before the focused-contract script was updated.

- **Lifecycle fixture:** passed in the full-suite log (`MetadataLifecycleCertification.test.ts`, 1 test).
- **Production build:** passed.
- **Local smoke:** passed.
- **Source governance:** passed.
- **Focused contracts:** passed (the existing focused suite; the lifecycle fixture was not yet included in that job's explicit test list).
- **Static quality/typecheck:** failed on existing errors in unrelated registry, UI primitive, component, and Video Package files; the lifecycle fixture was not among the reported type errors.
- **Full suite:** failed on numerous existing unrelated UI/source-contract, Vault, ContentBuild, and Video Package assertions. The new lifecycle fixture itself passed.
- **Vercel:** deployment status is blocked by the account's build-rate-limit gate; this is not a reported application build failure.

The focused-contracts script now explicitly includes `src/services/projects/MetadataLifecycleCertification.test.ts` so the next run directly certifies this phase's fixture. Re-run CI after this commit and review the new results. Phase 1 is **implemented but not fully certified** until the focused run and repository gates are rechecked; do not claim the whole repository is green.
