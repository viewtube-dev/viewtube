# Creator Production Workbench — Conversation Handoff
**Date:** 2026-10-14  
**Repository:** [viewtube-dev/viewtube](https://github.com/viewtube-dev/viewtube)  
**Canonical integration branch:** `master/consolidated-feature-integration`  
**Purpose:** Carry forward all creator-production-tool plans, implementation findings, decisions, and unfinished work from the October 13–14 conversation. This is a handoff/status document, not a claim that all listed work is complete or verified.

> **Scope correction:** The requested work is the creator production/editing system—image and video controls, script editor, audio/captions, and their shared workflow—not Vault maintenance queues, asset-health administration, or unrelated Vault housekeeping.

## 1. Current direction and non-negotiable architecture

Build on the existing VT_E1 editor and creator workflow. Do not create a parallel editor, project model, timeline, crop model, media database, or AI runtime.

- **Editor / VT_E1:** selected-clip controls, timeline, preview, undo/redo, edit state and render handoff.
- **Shared transform/render contract:** preview and Remotion render must interpret crop, transforms, trims, audio, and captions consistently.
- **BrainRuntime:** only creator reasoning/orchestration entry point; editor components must not call model providers directly.
- **Video Director:** owns asynchronous image/video generation jobs, provider work, progress, cancel/retry, and result handoff.
- **Asset Engine / Vault:** canonical asset identity, derivative/version persistence, provenance and lineage. Generated/exported files must not be treated as durable Vault assets merely because a browser download succeeded.
- **Projects / ContentBuild:** project and content-production identity/state; preserve these links when creating derivatives or handoffs.
- **Script Architect:** remains the full script-authoring owner. Vault text/document editing stays lightweight and must not become a second Script Architect.
- **Desktop and mobile:** share the same project/state/capability contracts; adapt layout, not behavior or schema.
- **Canonical UI:** use the established Studio controls/toolbox primitives and tokens. Do not introduce a parallel primitive/CSS system or hard-coded copies of existing controls.
- **Non-destructive editing:** preserve source assets; use accepted clip-transform patches and versioned derivatives. Mutations must participate in existing history/undo where appropriate.
- **Explicit timing:** never infer caption timing from script prose. Script-to-caption handoff requires explicit timing data or a creator-approved timing workflow.

## 2. Implementation roadmap

The original sequence remains the organizing plan, with current canonical code already containing pieces of several later phases.

### Phase 1 — Image Editing Workbench
Goal: make selected image/media clips useful for common framing operations and durable image derivatives.

- [x] Existing selected-clip transform/crop inspector is the foundation.
- [x] Centered 10% and 20% crop presets and crop-only reset exist on the canonical line.
- [x] Rotation presets (+90°, −90°) and rotation-only reset are recorded in the implementation history.
- [x] Ratio-aware crops and focal-point positioning for supported ratios are recorded on the canonical line.
- [x] Cropped PNG export and bounded resized PNG export are recorded on the canonical line.
- [x] Server-backed crop derivative registration through the existing render-worker proxy and Asset Engine is recorded on the canonical line.
- [ ] Verify crop math for all ratios, focal-point edges, and extreme/invalid source dimensions.
- [ ] Verify preview vs final Remotion render, undo/redo, and responsive desktop/mobile layout.
- [ ] Verify actual browser export and same-origin render-worker upload.
- [ ] Confirm worker storage is persistent and derivatives survive restarts.
- [ ] Verify Vault discovery, parent/source linkage, ContentBuild linkage, versioning and provenance end-to-end.
- [ ] Continue supported image adjustments (brightness/contrast/saturation if current implementation and render contract support them), image format/compression options, thumbnail composition and variant workflows without adding a parallel FX/render path.
- [ ] Make failures recoverable and distinguish a failed upload from a successful upload whose Asset Engine registration failed.

### Phase 2 — Video Editing & Control Workbench
Goal: expose core video editing operations through the existing timeline and render system.

- [x] Existing video preview/timeline and selected-clip inspector are the foundation.
- [x] Source-aware trim bounds and trim-to-playhead work are documented in the canonical implementation history.
- [x] Source slip controls and source-window alignment work have been pursued in the same VT_E1 contract.
- [x] Video frame capture and source-time mapping exist; save-to-Vault and thumbnail-candidate paths are recorded in the canonical history.
- [x] Embedded video volume/mute control work is in an open PR (see status below).
- [ ] Verify trim-left/right updates timeline and source in/out coherently for VFR/unknown-duration/edge cases.
- [ ] Verify split-at-playhead boundary guard, history/undo, and selected clip behavior.
- [ ] Verify rotation/crop/trim preview-to-render parity.
- [ ] Verify frame capture uses source time correctly for clips with source offsets, speed changes, or time mapping.
- [ ] Verify frame/crop uploads, durable worker storage, Vault visibility and lineage.
- [ ] Audit actual server-side video-processing endpoints/jobs before implementing trim-to-file, transcode, compression, resolution conversion, proxy generation or audio extraction. Do not invent a processing API based only on UI needs.
- [ ] Connect the first supported real video-processing operation using an async job contract with progress, cancel, retry, clear errors, and output ingestion into Asset Engine/Vault.
- [ ] Add explicit before/after comparison and processing-result details where they fit the existing editor surfaces.

### Phase 3 — Script Editor / Script Architect Integration
Goal: preserve the existing full Script Architect and connect it to production editing safely.

- [x] Script Architect remains the full script authoring workflow.
- [x] Script Architect plain-text export has been audited as already present on the canonical base; avoid duplicate implementations.
- [ ] Audit current script state model, draft autosave, assembled-script generation, locked-text protection, section/fragment workflows, export and handoff behavior from current source.
- [ ] Confirm whether the Script Architect direct Gemini service import remains and map it to BrainRuntime's canonical contract before changing behavior. Do not perform a speculative provider rewrite.
- [ ] Preserve drafts, last-edited inputs, locked text, section ordering, and existing script assembly behavior.
- [ ] Define a typed, explicit handoff from script sections/scenes/dialogue/narration to editor scenes, captions and media references.
- [ ] Keep script text authoring in Script Architect; editor/Vault text surfaces should remain lightweight, asset-linked, and contextual.
- [ ] Add script version/history and project/ContentBuild linkage where the current model supports them.
- [ ] Verify text export and filenames; avoid re-implementing existing TXT export.

### Phase 4 — Audio, Captions & Transcript Tools
Goal: connect timed text and audio editing to the same timeline/render contracts.

- [x] Audio waveform inspector work is recorded in canonical implementation history.
- [x] Render-backed clip volume/rate/fades and frame-driven audio fade curves are recorded in canonical history.
- [x] SRT caption import, deterministic SRT export, caption text/start/end editing and batch timing nudges are recorded in canonical history.
- [ ] Run the focused waveform helper tests and verify real browser decoding, large-input bounds, AudioContext cleanup and mobile behavior.
- [ ] Verify audio volume, rate, fades and curves are honored by both preview and final render.
- [ ] Verify SRT parser/exporter edge cases: multiline cues, overlapping cues, ordering, milliseconds/carry, long-hour timestamps, invalid/empty cues and newline handling.
- [ ] Verify caption import/export browser workflows, undo/redo and final rendered caption timing.
- [ ] Verify timing nudges operate as one undoable action, preserve cue duration/overlap and leave non-caption tracks untouched.
- [ ] Connect script sections to caption tracks only through explicit time ranges/creator-approved timing; do not guess timings from prose.
- [ ] Assess transcript extraction/OCR/speech-to-text only after identifying supported providers/jobs and data contracts.

### Phase 5 — Unified Media Operation Lifecycle
Goal: unify operation state and handoff without pretending that all UI actions already use it.

- [x] A pure `mediaOperationLifecycle.ts` contract and focused regression cases are recorded in the canonical implementation history.
- [ ] Adopt this contract in real image/video operation UI and adapters; the current pure helper is not proof that crop, audio, caption and render actions are all wired through it.
- [ ] Every operation should identify source asset/version, configuration revision, preview/result, accept/cancel/fail/retry state and output asset identity.
- [ ] Invalidate stale previews when configuration changes; do not accept a preview for an outdated revision.
- [ ] On acceptance, persist the derivative/version and lineage through Asset Engine/Vault before reporting it as a durable result.
- [ ] Preserve source identity through retry/cancel and surface recoverable failure states.
- [ ] Add consistent before/after preview, commit/cancel and result/lineage panels.
- [ ] Verify save/reload, undo/redo and desktop/mobile round-trip behavior.

### Phase 6 — AI-Assisted Production
Goal: proposal-first AI editing and generation through canonical runtime/job contracts.

- [ ] Build bounded assistant context from current selection, timeline range, project, ContentBuild and capability registry.
- [ ] Guide mode is read-only: explain features, find/open tools, walk through workflows, and explain disabled/error states without inventing capabilities.
- [ ] Assist mode proposes typed, previewable patches for trim/split/pacing, reframe/crop, audio cleanup, captions, overlays, B-roll and transitions.
- [ ] Require Accept/Revise/Reject before content mutations except explicitly safe reversible actions.
- [ ] Accepted changes must use existing editor state/history/undo.
- [ ] Generation flows through BrainRuntime → Video Director jobs → Asset Engine/Vault provenance → editor candidate → creator accept/reject.
- [ ] Support progress/cancel/retry/error/cost disclosure for asynchronous jobs.
- [ ] Keep desktop/mobile on one assistant context and stable capability IDs.
- [ ] Add evaluation for feature truth, acceptance/rejection, undo, generated asset provenance, cancellation/retry, caption timing, orientation and cross-device round trips.

## 3. Existing implementation slices recorded in the canonical resource

The canonical source of truth is `docs/editor/CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md` and its update log in `docs/editor/VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md`.

The following are recorded as existing implementation slices on the current canonical line; each still has its own verification gates unless noted:

1. Quick centered crop presets and crop-only reset.
2. Rotation presets and rotation-only reset.
3. Dedicated split-at-playhead panel using the existing reducer action.
4. Split eligibility pure helper and regression test cases.
5. Ratio-aware crop presets.
6. Source-aware trim and source slip controls.
7. Render-backed video/audio settings, including audio volume/rate/fades.
8. Frame-driven audio fade curves.
9. Video frame capture, with explicit save-to-Vault and thumbnail-candidate flows.
10. Cropped PNG export and resized PNG export.
11. Focal-point crop positioning across aspect presets.
12. Server-backed crop derivative registration through the render worker and Asset Engine.
13. SRT caption import and export.
14. Caption timing nudges and selected-caption editing.
15. Audio waveform inspector.
16. Shared media-operation lifecycle contract and tests.
17. Script Architect TXT export was found already present; preserve it and avoid a duplicate implementation.
18. Retry handling for failed render formats is recorded in the canonical resource; verify it in runtime.

**Important:** a source entry or a test file is not the same as an executed test, verified browser workflow, persistent upload, or certified feature. The canonical implementation guide explicitly says many tests/builds, undo/redo flows, browser storage paths and preview/render parity checks remain unverified.

## 4. Current open PR and branch hygiene

### Open PR found during this handoff audit
- **[PR #172 — Creator workbench: add embedded video audio controls](https://github.com/viewtube-dev/viewtube/pull/172)** — open at the time of this handoff. Adds a video-only volume control backed by existing `payload.volume` and mute/unmute backed by `payload.muted`. Review against the canonical render contract and existing audio controls before merging; verify preview/render parity and avoid duplicate controls.

### Historical/closed PR guidance
- PR #102 (quick crop) was superseded/closed.
- PR #105 (rotation and split controls) is closed in the current PR search; its behavior is represented in the current canonical source/resource, but verify the source rather than relying on the old branch or PR description.
- Ratio-aware crop, focal-point crop, frame-to-Vault, thumbnail-candidate, SRT, trim, resize/export and script export work has multiple historical/superseded PRs. The canonical implementation guide/update log records which slices are already integrated and which remain pending.
- PR #122/#124 and related crop/trim PRs were described as consolidation/supersession points. Re-check current source and current PR diff before resurrecting any older branch. Do not merge stale branches wholesale.
- One previous attempt to open/continue work on a ratio-aware crop branch had only a helper and test added before the user redirected to the handoff request. Do not assume that branch is complete or merge it without comparing against canonical source.
- Earlier GitHub-only passes reported Vercel build-rate-limit status failures and did not run local tests/build. Current CI status must be checked afresh; do not reuse old status claims.

## 5. Verification checklist — do before claiming completion

### Focused automated checks
- [ ] Run tests for `cropPresets`, `splitClipEligibility`, `mediaOperationLifecycle`, `imageCropExport`, `imageDerivativeStorage`, `srtCaptionImport`, `srtCaptionExport`, `captionTiming`, `audioWaveform`, and related editor reducer tests.
- [ ] Run typecheck and production build.
- [ ] Add/verify reducer tests for trim/source-window correctness, split, crop/transform patches, audio fades and captions.
- [ ] Resolve any test failures rather than reporting tests merely authored as passing.

### Browser / visual / integration checks
- [ ] Test portrait and landscape projects and 16:9, 1:1, 9:16, 4:5 and project-ratio crops.
- [ ] Compare editor preview and final Remotion output for crop/focal point, rotation, trim, speed/source windows, audio and captions.
- [ ] Verify all edits undo/redo and survive project save/reload.
- [ ] Test desktop and mobile layouts, touch targets, scrolling, selected clip changes and responsive overflow.
- [ ] Verify crop/frame derivative upload, persistent worker storage, Asset Engine registration, Vault discovery, ContentBuild association and lineage.
- [ ] Verify SRT download/upload in the browser and actual caption rendering.
- [ ] Verify embedded video volume/mute changes both preview and final output.
- [ ] Test failures: unavailable worker, upload failure, registration failure, invalid media, unknown duration, cancel/retry and stale previews.
- [ ] Check Vercel/CI status on current commits. If deployment is blocked by rate limits, report that honestly; never imply deployment succeeded.

## 6. Recommended immediate execution order

1. **Reconcile open PR #172** with current canonical video/audio controls and renderer behavior. Merge only if it is non-duplicative and correctly wired.
2. **Establish a verification baseline** by running focused tests/typecheck/build in an environment with repository access. Prior GitHub-only edits have not proven these checks.
3. **Finish image derivative durability**: run crop/export tests, verify persistent worker storage, Vault discovery, version/lineage and ContentBuild linkage.
4. **Finish video editing correctness**: source-aware trim/slip/split, frame capture timestamps, undo/redo, preview/render parity; then trace actual processing job endpoints before adding transcode/compression operations.
5. **Finish audio/caption integration**: waveform/browser tests, SRT round trip, caption timing and render parity; then explicit Script Architect-to-caption handoff.
6. **Audit Script Architect** current source and BrainRuntime boundary; preserve draft/assembly/locked-text behavior and existing TXT export.
7. **Adopt mediaOperationLifecycle** into real operation UI and adapters, then add common preview/accept/cancel/retry/result/lineage surfaces.
8. **Implement Brain Hub in dependency order** from `docs/editor/EDITOR_BRAIN_HUB_ASSISTANT_PLAN.md`: context → read-only guide → proposals → approved actions → captions/generation → UI hardening/evaluation.
9. **Update the canonical editor resource** after each verified slice with changed files, test evidence, remaining gates and links to the active PR. Keep the dedicated implementation guide; do not overwrite unrelated `tasks/plan.md` or `tasks/todo.md` work.

## 7. Source documents to continue from

- [Creator Production Workbench implementation guide](CREATOR_PRODUCTION_WORKBENCH_IMPLEMENTATION_2026-10-13.md)
- [YouTube Editor System Master Resource](VIEWTUBE_YOUTUBE_EDITOR_SYSTEM_MASTER_RESOURCE.md)
- [Editor Brain Hub Assistant Plan](EDITOR_BRAIN_HUB_ASSISTANT_PLAN.md)
- [Editor architecture guide](../Editor.md)
- [Vault Asset Workbench Master](../vault/VAULT_ASSET_WORKBENCH_MASTER.md) — use for asset identity/derivative/provenance contracts, not as a substitute for the editing-workbench scope.

## 8. Handoff rules for the next agent/session

- Start from `master/consolidated-feature-integration` and inspect the current source/PR state before coding.
- Prefer a small, source-backed vertical slice with focused tests over adding more UI-only controls.
- Never claim a test passed unless it was executed; never claim a deployment without confirming it.
- Keep generated outputs and edited assets tied to source identity, project/ContentBuild, operation configuration and lineage.
- Preserve one editor state model and one BrainRuntime orchestration path.
- Close or supersede stale branches only after confirming the canonical behavior and explaining the replacement PR.
- Keep user-facing updates concise but substantive: what changed, where it lives, what remains unverified, and the exact next step.
