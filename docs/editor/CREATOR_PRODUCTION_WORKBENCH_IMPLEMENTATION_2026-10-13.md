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

## Fifth implementation slice — quick media adjustments

The selected image/video clip inspector now consolidates crop controls into one preset grid: project ratio, 16:9, 9:16, 4:5, 1:1, reset, and centered 10%/20% crops. Presets are disabled if source dimensions are unavailable or the required crop exceeds the helper's safety limit.

The same inspector exposes quick brightness, contrast, and saturation controls. These use the shared `vtE1FxCatalog` contract and the existing `updateLayerPayload` action; Reset Tone, Reset All FX, and Full FX Panel shortcuts are included. These are reversible editor-layer adjustments, not destructive source-file processing.

The source repair also consolidated duplicate crop-helper imports and duplicate source-dimension declarations. The selected media layer is the single source for dimensions and FX payload values. This is a source-level correction; typecheck/build and runtime preview/render parity still need to be executed.

## Immediate next sequence

1. Run `npm run typecheck`, `npm run build`, the FX catalog tests, and focused editor tests; verify undo/redo and preview/final-render parity for crop, rotation, and quick FX.
2. Inspect the actual image processing/derivative contract before adding source-file resize, conversion, or export operations. Do not label timeline layer transforms as file processing.
3. Trace video processing/job APIs and connect one real operation end-to-end, including status and error behavior.
4. Map Script Architect's existing state/handoffs and resolve its BrainRuntime boundary through the canonical task contract without regressing script assembly or locked-fragment verification.
5. Expand audio/caption controls only against verified shared contracts and the existing editor project state.
