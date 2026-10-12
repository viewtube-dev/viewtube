# Saved Metadata Sets Round-Trip Audit — 2026-10-11

## Scope

Repository: `viewtube-dev/viewtube`
Branch: `master/consolidated-feature-integration`

This is a source review and implementation pass. It is **not** a claim that Vitest, typecheck, production build, or browser-level tests passed. No changes were made to `main`.

## Findings and changes committed

1. **Current vs. option save semantics**
   - `VideoPublisher.tsx` updates legacy Project title/description/tags and publishing metadata only when mode is `current`; option save must not overwrite the active Project fields.
   - Save mode remains explicit: `current` or `option`.

2. **Canonical media selection**
   - `publisherMetadataProjectPersistence.ts` now resolves thumbnail and final-render selections from explicit state references or the current canonical ContentBuild selection.
   - Current saves explicitly set or clear the thumbnail and final-render slots. An explicit `null` is not silently replaced by an older selection.
   - The selected canonical thumbnail artifact is passed into persistence from Publisher where one already exists.

3. **Local thumbnail limitation made explicit**
   - A newly selected browser `File` is not yet a durable Vault asset. Publisher now warns that this thumbnail is local and is not attached to the saved package. This avoids claiming a package round-trip that has not happened.
   - Remaining implementation: ingest the selected file through the canonical asset/Vault workflow and then persist its stable asset ID. Do not store a temporary object URL as durable asset identity.

4. **Empty metadata fields**
   - Metadata option selection explicitly clears the prior field selection when the chosen option has no valid asset ID.
   - Persistence creates explicit metadata assets for intentionally blank title, description, and tags, so selecting a blank field option can preserve that intent.

5. **Selected-option hydration**
   - `PublisherMetadataPackageOptions.tsx` now hydrates the selected saved set when a ContentBuild is opened and when the selected option changes. A callback ref prevents parent re-renders from repeatedly overwriting edits.

6. **Regression coverage added or present**
   - Existing tests cover listing current/alternative sets, selecting an option without creating a second Project/ContentBuild, repeat-selection provenance stability, explicitly unset Audience, and blank field asset selections.
   - Added a persistence test for canonical thumbnail/final-video references and their ContentBuild selection slots.

## Relevant commits

- `504ddf784130019ea8d2645d89e613abea6f96e9` — canonical media selection in persistence.
- `c036718ec7d48b6a000be7e9f99424f568819a14` — pass selected canonical thumbnail references from Publisher.
- `31547fa6e1ddfb97987d78eb077f66f91bb89858` — canonical media reference regression test.
- `536bcf8a97ff8d50d3dbdc4f7b4cc1e807f4d0c6` — hydrate selected metadata set on project open.

## Remaining gaps / release gate

- Ingest newly selected thumbnail files into the canonical Vault/Asset Engine; then test selection, reload, and preview restoration.
- Ensure the selected final video is a resolvable canonical asset and that its identity is included in the package snapshot.
- Add UI/integration tests for project switch and browser reload, including title, description, tags, category, visibility/schedule, Audience (true/false/null), timestamps, location, Community, AI-use state, playlists, thumbnail, and final video.
- Define whether metadata packages must sync across devices. Current ContentBuild/Vault adapters use browser `localStorage`; same-browser reload does not prove cross-device durability.
- Run the actual repository checks after checkout: targeted Vitest files, `npm run typecheck`, `npm run build`, and browser-based round-trip testing.
- Confirm Vercel/CI status before any deployment. At the time of this audit, no GitHub Actions workflow runs were returned for the reviewed commits; Vercel checks were pending in the latest queried status.

## Acceptance criteria

A round trip is certified only when:
1. Save Current updates the active package and Project fields.
2. Save as Option adds a candidate without mutating the active Project or selected package option.
3. Selecting a saved option restores every persisted field and canonical asset reference.
4. Explicitly blank fields and Audience `null` survive selection and reload.
5. Switching projects cannot leak options between ContentBuilds.
6. Tests, typecheck, build, and runtime checks pass on this branch.
