# Creator Production Workbench — Implementation Track

**Status:** started; first source change on feature branch  
**Branch:** `feat/creator-workbench-image-video-controls`  
**Canonical base:** `master/consolidated-feature-integration`  
**Scope:** creator-facing image/video editing controls, script authoring integration, audio/captions, and shared production handoffs. This is not Vault maintenance work.

## Grounded source audit

The following implementation facts were checked against the canonical integration branch before this work began:

- The shared editor already has a single `EditorStore` contract under `src/features/editor/mobile/state/editorState.ts`, used by responsive editor layouts. Crop is represented in `ClipVisualTransform` as normalized `cropLeft`, `cropRight`, `cropTop`, and `cropBottom` values.
- `src/shared/vtE1VisualFrame.js` normalizes crop values and provides the shared non-destructive crop style used by preview/render paths. Existing tests cover crop normalization and transform style.
- `src/features/editor/mobile/components/EditorNavigationPages.tsx` already exposes per-edge crop fields in the selected-clip inspector. It dispatches the existing `updateClipTransform` action, so edits flow through editor state/history rather than creating a second crop store.
- `src/features/editor/mobile/components/PanelBodies.tsx` already has a trim panel, track mute, clip volume and playback-rate controls. Fades/ducking are explicitly marked unavailable until their shared engine contract is confirmed.
- `src/views/ScriptArchitect.tsx` and `src/features/script-architect/useScriptArchitect.ts` implement the full Script Architect experience, including chapter/fragment inputs, locked-text verification, budget/reconciliation, draft autosave and script packet handoff. Keep this as the full authoring surface; the Vault's text editor must remain lightweight.
- The current Script Architect controller imports `generateScript` directly from `services/gemini`. This is an architecture audit finding to resolve through BrainRuntime only after tracing existing script-generation contracts and preserving current output behavior; do not replace it with a guessed API.
- `src/remotion-editor/src/engine/media/media.tsx` documents and implements non-destructive media crop support. Remotion remains the deterministic preview/final composition owner.

This audit establishes the implementation baseline; it does **not** claim all planned workbench capabilities are already implemented or verified.

## First implementation slice

The existing selected-clip Crop inspector now adds:

- **Center 10%** — applies a symmetric 10% crop on all four edges.
- **Center 20%** — applies a symmetric 20% crop on all four edges.
- **Reset Crop** — clears crop values without resetting position, scale, rotation, or opacity.
- Existing independent edge controls remain available for fine framing.

All actions dispatch through the existing `updateClipTransform` contract. The operation remains non-destructive and does not create or overwrite a source media file.

## Workstreams and acceptance criteria

### 1. Image editing workbench — first priority

- Reuse the existing selected-asset/clip identity and shared crop/transform contract.
- Add ratio-aware crop presets only when the source dimensions and output ratio are available; never label a percentage crop as a guaranteed 16:9 or 9:16 crop.
- Provide resize/resolution and supported format/compression operations only through verified processing APIs.
- Preview before/after, preserve source, and record derivative/lineage when a processing operation creates a file.
- Integrate thumbnail/poster selection with existing Thumbnail Studio and editor asset flows rather than a parallel image store.

### 2. Video control workbench

- Consolidate preview, scrub/frame inspection, trim/cut, crop/reframe, poster extraction, audio controls, conversion/compression and derivative handling around the existing editor/Vault/Asset Engine contracts.
- Reuse the existing trim, crop and clip-audio actions; do not create another timeline or editor state model.
- Any file-processing operation must expose real processing state and clear unavailable/error states. FFmpeg-backed operations must only be enabled when the actual runtime capability is available.
- Preserve cancellation/retry and source provenance for asynchronous jobs.

### 3. Script editor integration

- Keep Script Architect as the full authoring/assembly surface.
- Improve its script review/edit workflow only after mapping its current `ScriptProject`, `GeneratedScript`, draft store, locked fragments, section edits and packet handoff.
- Keep Vault text editing lightweight and asset-linked.
- Audit direct provider invocation in `useScriptArchitect`; route reasoning through BrainRuntime only via a real existing contract, while retaining locked-text verification, length reconciliation, autosave and draft recovery.
- Connect accepted script sections to scenes, timeline/captions and media candidates through explicit handoffs; never silently overwrite creator text.

### 4. Audio, captions and transcript controls

- Reuse the current editor project, track, clip, caption and undo/redo contracts.
- Add transcript/caption edits with timestamp validation and preview.
- Treat fades, ducking, extraction and conversion as unavailable until shared contracts/runtime support are proven.
- Preserve script/transcript associations and provide accessible keyboard/touch alternatives.

### 5. Shared production operations and AI assistance

- Share capability IDs across desktop/mobile; layout may adapt, but saved project semantics must not.
- AI recommendations are typed proposals with before/after preview, accept/revise/reject, undo, bounded context and evidence.
- BrainRuntime is the only creator reasoning/orchestration entry point. Video Director owns asynchronous generative-media jobs. Asset Engine/Vault owns durable asset identity and provenance.
- Generated assets remain candidates until the creator accepts/inserts them.
- Never silently delete source media, mutate a timeline without an approval boundary, or call model providers directly from editor UI.

## Verification gates

For each code slice, run focused tests and the relevant build/type checks when repository execution is available. UI changes also require:

- desktop and mobile visual inspection;
- crop normalization and preview/final render parity;
- undo/redo and project save/reload;
- keyboard and touch use;
- empty/disabled/error states;
- no source-file mutation;
- desktop → mobile → desktop round-trip preservation.

Current limitation: this GitHub-only edit pass can commit source/docs and open a PR, but it cannot honestly claim a local build, browser capture, or test run without an execution environment.

## Fourth implementation slice — ratio-aware crop presets

The Crop inspector now adds **Project Ratio** and **Square** presets for selected image/video media clips. The controls read the linked media layer's existing `width`/`height` payload (the current ingest path records dimensions while loading media) and calculate centered crop edges through `cropToAspectRatio`. The project preset uses the editor's existing landscape/portrait project setting. Both controls are disabled when the selected clip lacks supported image/video identity or factual dimensions; they do not guess a ratio or pretend to process a standalone file.

The helper returns null when dimensions or target ratio are invalid, or when the crop would exceed the editor's safe combined-edge limit. Focused Vitest cases cover landscape-to-portrait, portrait-to-landscape, exact-ratio no-op, and invalid/extreme inputs. Tests were authored, but not executed in this GitHub-only pass.

## Second implementation slice — rotation controls

The existing Transform inspector now includes clockwise and counterclockwise 90-degree rotation presets plus a rotation-only reset. These actions update only the existing `rotation` field through `updateClipTransform`; scale, position, opacity and crop are preserved. The arbitrary-angle field remains available. These controls operate on selected editor clips and are not a standalone image file processor.

## Third implementation slice — split-at-playhead

The editor already had a reducer action for splitting a clip at the current playhead, with history snapshots, but the Split tool was mapped to the Trim panel. It now has a dedicated Split Clip panel that shows the playhead and selected clip interval, enables the action only when the playhead is strictly inside the clip, dispatches the existing `splitClipAtPlayhead` action, and explains undo behavior. This wires an existing operation into the UI rather than creating a second split algorithm.

## Split eligibility contract and regression coverage

Split-button enablement is now a small pure contract in `src/features/editor/mobile/state/splitClipEligibility.ts`. It rejects missing/invalid clip intervals and non-finite playheads, and requires the playhead to be more than 1 ms inside either edge. A focused Vitest file covers interior, boundary/guard-band, and invalid-input cases. The test was added before extracting the helper, but this GitHub-only pass cannot execute it; it must be run in CI or a local checkout before claiming it passes.

## Fifth implementation slice — source-aware video trimming

The existing `trimClip` reducer changed only the timeline edge. For video/audio clips that carry `sourceInSec`/`sourceOutSec`, trimming the left edge therefore left the source in-point unchanged, so playback could begin at the wrong source frame. The reducer now adjusts the corresponding source boundary proportionally to the clip's current source-to-timeline duration ratio. Text/overlay clips without source-range fields remain timeline-only. All changes still pass through the existing reducer history, so undo restores both timeline and source boundaries.

Added focused Vitest coverage for left/right source-range updates, source-less overlay clips, and undo. Tests have been authored but were not run in this GitHub-only pass; runtime preview/render verification remains required.

## Sixth implementation slice — audio controls reach the render

The Audio panel previously edited clip-level `volume` and `playbackRate`, while the Remotion Composition read only layer-payload values. That meant the visible clip controls could diverge from final-render behavior, and the volume slider allowed values above the renderer's supported 0–1 range. A shared `resolveAudioRenderSettings` contract now gives clip-level edits precedence and falls back to existing layer payload defaults for older projects. The same resolver is used by the Audio panel and Remotion Composition; the volume control now matches the supported 0–100% range and playback rate is passed to the render Audio component.

Added focused tests for clip overrides, legacy layer-payload fallback, defaults, and clamping. Tests have been authored but not executed in this GitHub-only pass. Fade automation remains separate because the custom Audio primitive's source-offset/frame semantics need an explicit parity audit before extending its volume curve.

## Seventh implementation slice — frame-driven audio fades

The Audio panel now exposes **Fade In** and **Fade Out** duration controls (0–10 seconds). The shared audio render contract resolves clip-level fade edits over legacy layer-payload values. A deterministic `audioVolumeAtFrame` helper computes per-frame gain, including overlapping fades and mute behavior; Remotion Composition uses that helper as the Audio volume curve. Unit cases cover fade endpoints, mid-fade gain, overlapping fades, and mute. The tests are authored but have not been executed here, and final audio playback/render verification remains pending.

## Current implementation — quick media editing controls

- Added a **4:5 portrait crop preset** alongside the existing 16:9, 1:1, and 9:16 presets, removing the duplicate square action from the secondary crop row.
- Added **Quick Image Adjustments** for selected image/video media layers: brightness, contrast, saturation, Reset Tone, Reset All FX, and a shortcut to the full Effects panel. These controls use `vtE1FxCatalog` normalization and the existing `updateLayerPayload` action rather than creating a second FX vocabulary.
- Consolidated duplicate crop-helper imports and source-dimension declarations in the selected-clip inspector.
- Added **Trim Start to Playhead** and **Trim End to Playhead** shortcuts in Timeline Trim. A pure eligibility helper disables them outside the clip interior or inside the minimum-duration guard band; actions use the existing trim reducer/history.
- Added focused Vitest cases for trim-to-playhead eligibility. Tests/build, undo/redo, preview/render parity, and responsive browser verification remain pending.

## Script Architect handoff — plain-text export

Script Architect now exposes **Export TXT** alongside Copy Script and Save Packet. The export downloads the currently assembled `fullScript` unchanged as UTF-8 plain text, uses a topic/draft-derived filename with reserved filesystem characters normalized and the basename capped at 80 characters, revokes the temporary object URL, and reports failures through the existing error state. It does not change generation, draft persistence, or locked-fragment validation.

A focused Vitest suite covers filename normalization, empty-name fallback, reserved characters, and length limits. The tests/build and browser download flow remain unverified in this GitHub-only pass.

## Script Architect generation — BrainRuntime integration

Script Architect now has an injectable structured-task path. The hook routes assembly through `runBrainJsonTask` in the canonical BrainRuntime module, carries the existing Script Architect JSON response schema through the provider-neutral gateway, labels the context as a script task, attaches active-project/ContentBuild context, and preserves the existing `analysis` model capability. The existing prompt construction and `normalizeGeneratedScript` output shaping remain in place; callers that do not inject a BrainRuntime task retain the legacy provider fallback for compatibility.

A pure request-envelope helper has focused tests for schema/prompt preservation and projectless draft support. Runtime generation, locked-fragment parity, AI Brain-disabled behavior, and tests/build remain unverified in this GitHub-only pass.

## PR #120 and PR #123 consolidation

Audited both open proposals against `master/consolidated-feature-integration` before carrying their value forward.

- **PR #120 — Script Architect Export TXT:** the useful implementation is already present on the canonical base: `scriptExport.ts` and its filename tests, `downloadScript` in the Script Architect controller, and the Export TXT action beside Copy Script and Save Packet. The download keeps `fullScript` unchanged as UTF-8 text, uses a sanitized topic/draft filename, revokes the object URL, and surfaces export errors. No duplicate implementation was added.
- **PR #123 — source-slip controls:** the selected-media Trim panel, source-window display, reducer-backed `slipClip` action, and timeline-boundary tests are already present on the canonical base. The old panel exposed quarter-second steps and used broad backward/forward enablement, though. This consolidation retains the one-second actions and replaces quarter-second controls with **±0.1-second precision steps**, with each button independently enabled only when the full source window remains within known media bounds.
- The source-slip bounds logic now lives in `sourceSlipControls.ts`, with focused Vitest cases for all four step sizes, both source boundaries, and invalid windows.

Both source branches had diverged substantially from the current canonical integration branch. The existing canonical features are the source of truth; this PR adds the missing selected-media inspector integration, standardizes precision/bounds behavior, and records the reconciliation rather than merging stale branch histories.

## Fifth implementation slice — retry failed render formats

The Export/Render panel now retries only selected outputs whose latest job status is failed. A successful MP4 render remains available while a failed MOV or WebM output is retried; retry selection is a pure helper with focused Vitest coverage. Retrying creates a new job for the failed format through the existing render-job client and keeps successful output records in the panel. This is a render-job retry, not server-side cancellation; stopping client polling must not be presented as stopping the render itself.

The retry helper tests have been authored but not executed in this GitHub-only pass. Render server cancellation remains unsupported by the current client/server contract and is not exposed as a fake cancel button.

## Video frame capture slice

Added a Capture Frame as Still control for a selected video clip. When the playhead is inside that clip, the editor maps timeline time to source time using the clip's trim and slip values, captures a JPEG, and inserts it through the existing image clip ingest path at the playhead. The original video is unchanged. Capture errors are shown in the inspector.

A pure source-time helper has tests for source offsets, boundary clamping, and invalid metadata. Browser capture, insertion, undo/redo, and visual behavior still need runtime verification.

## Image crop export

Added Export Cropped Image to the selected image clip inspector. The action converts the existing crop edges into a validated pixel rectangle and downloads a PNG without changing the source image or the project's crop settings. A pure helper has tests for standard crops, full-image export, invalid dimensions, and unsafe edge combinations. Browser export and cross-origin behavior still need runtime verification. The downloaded file is not yet registered as a Vault or Asset Engine derivative.

## Script Architect export slice

Script Architect now offers Export MD alongside the existing TXT export. Markdown output includes the script topic as a heading, available angle/audience/tone metadata, and the assembled script body without rewriting the script prose. The formatter and filename helper have focused Vitest coverage. Browser download and test execution still need verification.

## Audio waveform inspector slice

The selected audio clip inspector now includes an on-demand waveform preview. It decodes the source only when requested, reduces channel samples to a bounded set of peak bars, closes the temporary AudioContext, and reports source/decoder errors. Large files are rejected before decode to limit in-panel memory use. This is a preview aid only; it does not edit audio or create a derivative. The pure peak reducer has focused tests; browser decode and responsive rendering still need verification.

## Caption import slice

The editor media toolbox now imports standard SRT files into a caption track. Parsing supports multiline text, comma or dot millisecond separators, hour timestamps, BOM-prefixed files, and ignores malformed or empty cues. Caption clips are added as one atomic editor history action, preserving the imported cue timings even when captions overlap. If no caption track exists, the import creates one as part of the same action. The parser and reducer have focused tests; runtime rendering, undo/redo, and visual styling still need verification.

## Image resize export slice

The cropped-image export now offers source-size, 720px, 1080px, and 1920px output-width presets. Output height is calculated from the crop rectangle to preserve aspect ratio, and requested widths are bounded to avoid extreme canvas allocation. The original media and non-destructive crop state remain unchanged. Pixel sizing tests were added; browser export and image-quality verification remain pending.

## Eighth implementation slice — focal-point crop positioning

Added `cropToAspectRatioAtFocalPoint`, a pure helper that preserves the selected aspect ratio while shifting the crop window toward a normalized focal point. The crop window clamps to source boundaries and never invents pixels. Regression cases cover left/right horizontal focus, lower vertical focus, invalid focal points, and aspect ratios that require no crop.

The selected-clip inspector now exposes **Left / Center / Right** focus controls when the project ratio requires horizontal cropping, or **Top / Center / Bottom** when it requires vertical cropping. These controls use the current project portrait/landscape ratio and the existing non-destructive clip transform action. They are hidden when no crop is needed and unavailable without factual source dimensions. Automated tests and preview/final-render visual parity still need to be run.

## Ninth implementation slice — server-backed crop derivative

Added a **Save Derivative to Vault** action beside the existing PNG download controls. It reuses the current non-destructive crop transform, creates the PNG locally, uploads its bytes through the same-origin `POST /api/vt-e1/render/assets` proxy, then registers the returned stable render-asset path through the canonical Asset Engine `createVersionedAsset` flow. The resulting Vault record stores operation metadata, clip/media context, normalized crop values, and project/ContentBuild linkage when the editor has a valid ContentBuild ID. If the selected media payload supplies a canonical `sourceAssetId`, the derivative records that parent relationship; it does not invent one when identity is missing.

The upload client rejects non-image files, empty outputs, files over 20 MB, failed worker responses, and URLs outside the render-assets endpoint. A worker error is shown to the user instead of claiming a save succeeded. Durable bytes depend on the render worker being configured with a persistent volume as described in `docs/vt-e1-render-worker.md`; deployment storage configuration and the browser workflow have not been verified in this pass. If the file upload succeeds but Asset Engine registration fails, the UI reports the stored path so it can be recovered rather than silently losing the reference.

## Tenth implementation slice — save captured video frames as Vault derivatives

Added **Save Frame to Vault** beside the existing **Capture Frame as Still** timeline action. It uses the same playhead-to-source-time mapping and JPEG capture path, uploads the frame through the render-worker asset endpoint, and registers it through Asset Engine as an image derivative with source/timeline time, clip identity, media name, and project/ContentBuild context when available. It does not silently insert a second timeline clip; the existing Capture Frame action remains responsible for that separate workflow.

Both image crop and video-frame save actions use the same bounded upload client and same-origin proxy, so the worker shared secret remains server-side. The actual deployment must still have the render worker configured with durable storage. Browser capture, upload, Vault listing, lineage, tests/build, and responsive QA have not been run in this pass.

## Immediate next sequence

1. Verify ratio-aware crop, rotation, split-at-playhead, source-aware trimming, and audio volume/fade curves with focused tests, undo/redo, preview/render parity, and responsive visual QA.
2. Verify ratio-aware and focal-point crop preview/render parity, then connect exported image derivatives to durable Asset Engine/Vault provenance.
3. Verify crop and frame uploads, Vault discovery, ContentBuild version/lineage, and persistent storage in a deployed environment; then connect Script Architect and caption handoffs with explicit timing.
4. Trace video processing/job APIs and connect the first real operation.
5. Map Script Architect's existing state/handoffs and resolve its BrainRuntime boundary without regressing script assembly.
6. Expand audio/caption controls only against verified shared contracts.
