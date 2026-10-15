# Vault Image / Video Workbench — Phase 0 Audit and Phase 1–2 Implementation Record

**Date:** 2026-10-14  
**Target:** `master/consolidated-feature-integration`  
**Implementation branch:** `feat/vault-media-workbench-image-tools-phase-0-2-2026-10-14`  
**Status:** Phase 0 source audit recorded; Phase 1 shared capability contract and Phase 2 image editing implemented on the branch, pending CI/runtime verification.

## Scope

This record distinguishes existing capabilities from new work. It is not a claim that video processing is complete.

## Phase 0 — Existing-system audit

### Reusable canonical foundations verified

| Capability | Canonical source | Audit finding |
|---|---|---|
| Vault UI and selection | `src/views/CreatorVaultOS.tsx` | Existing Asset Library, selected-asset Inspector, selection toolbar, Quick Look and project context are the integration point. |
| Canonical local asset records | `src/services/vaultAdapter.ts` | Existing Vault asset IDs and metadata are persisted in browser storage. Large binary durability is not solved by this adapter. |
| Image preview capture | `src/services/vaultImagePreview.ts` | Creates a reduced image preview from a local File; this is preview generation, not general image editing. |
| Image palette extraction | `src/services/vaultImagePalette.ts` | Existing pixel-based dominant palette extraction can be reused. |
| Image similarity | `src/services/vaultImageSimilarity.ts` | Existing perceptual hash/similarity utilities remain analysis tools, not editors. |
| Video poster extraction | `src/services/vaultVideoThumbnail.ts` | Browser-side video frame extraction works from a local File; it does not trim or transcode video. |
| Media preview primitives | `src/components/subtoolbox/SubToolboxMediaPrimitives.tsx` | Existing canonical media controls are available for preview/playback. |
| Background task record | `src/services/vaultTaskCenter.ts` | Existing task ledger has ingest/metadata/hash/thumbnail/transcript/proxy types; it does not yet define a durable image-transform/video-transcode worker contract. |
| Derivative/lineage ownership | Asset Engine and Vault version services | Existing ownership must be reused; a new media editor must not create a parallel identity store. |

### Gaps confirmed by source inspection

- No canonical general-purpose image transform service existed at the audited paths.
- Image preview and palette extraction did not provide crop/resize/rotate/flip/format-conversion operations.
- The existing Vault Task Center contract did not provide a dedicated image-transform operation type or a durable arbitrary-output storage seam.
- Existing video preview/thumbnail support is not proof of real video trimming, encoding, compression, or proxy generation.
- Browser localStorage is not a durable general-purpose binary store. Inline derivative registration therefore needs a conservative size limit; larger outputs must be downloaded/imported rather than silently written into browser storage.
- Smart-crop suggestions are blocked until a real vision provider is configured.
- The canonical Video Editor remains the owner for full timeline editing.

## Phase 1 — Shared adaptive Workbench foundation

Implemented on the branch:

- Added `src/features/vault-workbench/capabilities.ts`, a type-aware capability resolver.
- Added `src/features/vault-workbench/capabilities.test.ts` to specify empty selection, single-image, mixed-selection, and unavailable video-processing behavior.
- Connected capability resolution to the existing Vault Inspector.
- The UI distinguishes available capabilities from blocked video/audio processing; it does not advertise unconnected processors as available.
- Image operations are contextual inside the existing Inspector rather than a separate application or alternate Vault shell.

## Phase 2 — Image tools

Implemented on the branch:

- Added `src/services/vaultImageWorkbench.ts` for real browser Canvas transformations over image bytes.
- Added `src/services/vaultImageWorkbench.test.ts` for dimensions, crop normalization, quarter-turn rotation, quality clamping, and output-format fallback.
- Added `src/views/vault/VaultImageWorkbench.tsx` and mounted it for a single selected image in the canonical Inspector.
- Crop coordinates, resize dimensions, aspect-ratio behavior, rotate, flip, output format, and encoding quality are validated/normalized.
- Brightness, contrast, and saturation use browser Canvas filters.
- Added thumbnail-size and web-optimization presets.
- Reused the existing palette extraction service and exposed the extracted colors in the contextual workbench.
- Added focal-point X/Y metadata controls; the focal point is saved as metadata, not represented as an AI-derived crop.
- Operations produce a real encoded Blob and before/after preview. The source asset is not overwritten.
- Outputs below the conservative inline-storage limit can be registered as a new Vault image record with source asset ID, transformation parameters, output dimensions, MIME type, byte size, and derivative metadata.
- Larger outputs are downloadable and must be imported through Import & Tags; they are not falsely reported as durably registered.
- Smart crop is explicitly not advertised because no real vision provider was verified.

## Verification still required before merge

The GitHub contents API was used to author the branch. It does not run the repository's test suite. Do not treat this record as proof of green tests or browser verification.

Required checks:
1. Run the two focused Vitest files.
2. Run typecheck and changed-file lint.
3. Run the production build.
4. Test same-origin/data-URL and CORS-restricted image sources.
5. Verify rotate + crop + resize combinations visually.
6. Verify output format, actual pixel dimensions, and output bytes.
7. Verify derivative registration and Asset Library refresh for a small output.
8. Verify the large-output path downloads without creating a false Vault asset.
9. Verify mobile portrait, mobile landscape, desktop, keyboard, and screen-reader labels.
10. Confirm CI status before merge.

## Explicitly not complete in this PR

- Real video trim, crop/reframe, compression, format conversion, audio extraction, or proxy generation.
- Durable arbitrary-binary storage and a server-backed derivative pipeline.
- Smart crop / vision-backed suggestions.
- A complete asynchronous media processing worker and its progress/retry/cancel contract.
- Full browser/runtime certification.

These remain the next phases; they must not be marked complete based on the presence of video preview or thumbnail extraction.
