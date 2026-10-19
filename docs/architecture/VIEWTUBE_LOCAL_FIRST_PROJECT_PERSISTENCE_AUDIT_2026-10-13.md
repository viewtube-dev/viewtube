# Local-First Project Persistence Audit — 2026-10-13

## Scope

Audit the Project → ContentBuild → Video Package path on `master/consolidated-feature-integration`. This is focused on switching, durable browser storage, and reload recovery while YouTube is disconnected. It does not change `main`.

## Findings

### 1. Video Package storage failure could look like a successful save

**Source:** `src/services/video-package/VideoPackageRepository.ts`

Previously, `writeStored` caught a failed `localStorage.setItem` and silently moved the new package into module memory. The caller still received a saved package, but the package would be lost on refresh.

**Change:** the repository now throws a descriptive persistence error when browser storage rejects the write. A regression test simulates a rejected write and expects the save operation to report the failure.

### 2. ContentBuild persistence still swallows browser-storage write failures

**Source:** `src/services/asset-engine/ContentBuildRepository.ts`

Its `writeJson` adapter currently catches and ignores storage errors. This means ContentBuild profiles, selections, assets, or event history may not be durable even when an operation returns normally. This is a remaining risk and should be fixed with explicit storage-failure behavior and tests, with care around operations that write both build snapshots and events.

### 3. Project/package identity selection has focused unit coverage, but not full reload coverage

**Sources:**
- `src/components/projects/projectManifestation.ts`
- `src/components/projects/projectManifestation.test.ts`

The adapter matches a package by Project ID and, when supplied, ContentBuild ID. Existing tests cover selecting a package within the correct scope and preserving/following selected Projects. Those tests do not simulate a browser reload or verify that all package metadata and asset selections survive it.

### 4. Project Manifestation save status can be optimistic

**Source:** `src/components/projects/ProjectManifestation.tsx`

The save handler sets its status to `saved` immediately after calling `onSaveProject`. The callback type returns `void`, so the component cannot represent an asynchronous save result. If the callback throws synchronously, the status is not converted to an explicit error state. The next UI pass should align the callback contract and show success only after the save actually completes.

## Verification checklist

- [ ] Create two local Projects and save different titles, descriptions, tags, thumbnails, and selected metadata sets.
- [ ] Switch A → B → A; verify each Project restores only its own state.
- [ ] Refresh the app; verify Project identity, ContentBuild ID, package ID, selected metadata set, and asset references remain consistent.
- [ ] Simulate `localStorage.setItem` failure for Video Package and ContentBuild stores; ensure the UI reports failure instead of claiming success.
- [ ] Connect a YouTube channel later; verify the existing local-draft package is bound to the channel without duplicating the package.
- [ ] Run focused Vitest tests, TypeScript checks, and production build.

## Verification status

The repository edits and regression test were committed to `master/consolidated-feature-integration`. Test execution, typecheck, and production build have **not** been verified in this session. The previously reported Vercel status was blocked by a build-rate-limit failure, which is not evidence of a code-test failure.
