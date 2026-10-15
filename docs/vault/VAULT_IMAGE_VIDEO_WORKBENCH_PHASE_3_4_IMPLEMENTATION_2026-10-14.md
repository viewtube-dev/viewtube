# Vault Image / Video Workbench — Phases 3–4

**Date:** 2026-10-14  
**Branch:** `feat/vault-video-workbench-storage-phases-3-4-2026-10-14`  
**Target:** `master/consolidated-feature-integration`  
**Status:** Implemented on branch; automated and deployment/runtime verification pending.

This document continues `VAULT_IMAGE_VIDEO_WORKBENCH_PHASE_0_AUDIT_2026-10-14.md` and PR #173. It does not claim that the changes have passed CI or production browser testing.

## Phase 3 — Real video operation tools

### Implemented on this branch

- Added `src/services/vaultVideoWorkbench.ts` as the typed browser adapter for real server-side FFmpeg output.
- Added `server/vault-media-processing.mjs` with an allowlisted operation contract:
  - trim a clip with explicit start/end seconds;
  - create a bounded proxy;
  - transcode/compress to MP4 or WebM;
  - extract a still frame as JPEG/PNG;
  - extract audio as M4A.
- Input/output size limits default to 64 MiB, job duration is capped at 300 seconds, and FFmpeg execution is time-limited. The request cannot supply arbitrary FFmpeg arguments.
- Routed the new operation contract through the existing `/api/media/compress-analysis?vaultOperation=1` endpoint to avoid creating a competing media server.
- Added `src/views/vault/VaultVideoWorkbench.tsx` and mounted it inside the existing selected-video Inspector.
- Added trim range controls, quality presets, operation selection, real output preview, download, and non-destructive derivative creation.
- Video output stays distinct from the source asset; derivative records carry source asset ID, operation, parameters, byte size, lifecycle, and a compact preview where applicable.
- Capability resolution now exposes video processing as configured. The actual operation still reports a clear failure if FFmpeg or the API route is unavailable.

### Test coverage added

- `server/vault-media-processing.test.mjs`: trim validation, source-duration checks, allowlisted FFmpeg arguments, frame extraction arguments, and proxy duration cap.
- `src/services/vaultVideoWorkbench.test.ts`: client-side validation, real binary response contract, and rejecting non-video inputs.

### Runtime dependencies / constraints

- The server environment must have FFmpeg installed.
- Source upload and output limits are intentionally conservative; this is not a full nonlinear timeline editor.
- The API currently accepts common video containers only. Unsupported formats fail instead of being silently coerced.

## Phase 4 — Binary derivative storage and lineage

### Implemented on this branch

- Added `src/services/vaultMediaBinaryStore.ts`, an IndexedDB-backed binary store for actual output Blobs, independent of the Vault localStorage asset metadata list.
- Added `src/services/vaultMediaBinaryStore.test.ts` covering binary persistence, source linkage, listing, deletion, and required lineage.
- The Video Workbench saves local binary bytes with a stable binary ID and source asset ID, and registers a canonical Vault derivative record referencing that ID.
- Saved video derivatives have a compact persisted poster; extracted-frame previews are downscaled before being stored as data URLs to avoid embedding full-resolution output bytes in localStorage.
- Added `server/vault-media-storage.mjs` and authenticated `/api/vault/media-binaries` upload/read routes in the existing account server. Server storage is owner-scoped by authenticated user, validates the source/operation lineage, uses generated IDs and atomic temp-file renames, and limits stored output size.
- The server storage seam intentionally returns `VAULT_MEDIA_STORAGE_NOT_CONFIGURED` unless `VAULT_MEDIA_STORAGE_DIR` is configured. This prevents ephemeral deployment filesystem storage from being described as durable.
- The client tries authenticated server storage after the local IndexedDB write; if server storage is unavailable it preserves the local copy and clearly identifies that scope. A saved derivative can resolve from local IndexedDB or its server binary ID.

### Test coverage added

- `server/vault-media-storage.test.mjs`: upload/read round-trip, account isolation, and explicit not-configured behavior.

### Deployment requirement

For cross-session and cross-device server durability, configure `VAULT_MEDIA_STORAGE_DIR` to a mounted persistent disk directory on the media/API service. A default ephemeral filesystem is deliberately not treated as durable. Browser IndexedDB is durable across reloads on the same browser/device but is not cloud sync or backup.

## Required verification before merge

- Run the focused tests:
  - `npx vitest run server/vault-media-processing.test.mjs server/vault-media-storage.test.mjs src/services/vaultVideoWorkbench.test.ts src/services/vaultMediaBinaryStore.test.ts src/features/vault-workbench/capabilities.test.ts src/services/vaultImageWorkbench.test.ts`
- Run `npm run typecheck`, `npm run lint:runtime`, `npm run build`, and relevant architecture/CSS checks.
- Verify server authentication and `BILLING_ORIGIN` in the deployed topology.
- Verify FFmpeg is installed and actual outputs play for trim, proxy, transcode, frame extraction, and audio extraction.
- Verify the API route receives multipart uploads and that configured persistent disk survives a service restart/redeploy.
- Verify local-only fallback, remote storage success, wrong-account read rejection, and the 413/503 failure states.
- Browser-test desktop, mobile portrait, mobile landscape, keyboard access, and source preservation.
- Do not mark production/cross-device durability certified until the persistent disk is configured and tested after restart.
