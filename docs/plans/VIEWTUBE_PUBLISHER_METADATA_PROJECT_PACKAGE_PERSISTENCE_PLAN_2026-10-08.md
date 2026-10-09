# ViewTube Publisher Metadata → Project Package Persistence Plan

Date: 2026-10-08
Branch: audit/system-convergence-identity-certification
Status: Planned — implementation intentionally not started

## 1. Decision

Do not create a new top-level Publisher page.

Create a matching Metadata subtoolbox inside Video Publisher, using the same canonical CanonicalMetadataSections structure already used by Video Manager.

Publisher should expose a compact metadata/package mode or section inside its existing publishing workflow, rather than making the creator navigate to a second Publisher page.

The user mental model should be:

Video Publisher → Metadata → edit/generate/refine → Save to Project

The existing Metadata Master remains the optimization/intelligence workspace. It should not be duplicated inside Publisher.

## 2. Why

Current architecture already has the right pieces:

- CanonicalMetadataSections defines the shared Manager metadata UI contract.
- Video Publisher already owns title, description, tags, thumbnail/video files, playlists, visibility, scheduling and publication actions.
- Publisher already has ContentBuild-aware generation context and creates title candidate assets/variant groups.
- ProjectManifestation already represents the same Project/ContentBuild/Video Package and exposes saved metadata, thumbnail selection and asset slots.
- ContentBuild already owns durable asset identity, selections, versions, variants, events, generation/evidence/trace references.
- Publishing Package is a projection/contract of the same ContentBuild rather than a separate truth store.
- Metadata Master already supports package versions, alternatives, optimization intensity, warnings, provenance and handoffs.

The missing capability is a common write-back path from Publisher working metadata into the canonical Project/ContentBuild/Video Package, including alternatives and lineage.

## 3. User-facing goal

A creator working in Publisher must be able to:

1. Load the current Project.
2. See the same metadata sections they recognize from Manager.
3. Edit any supported field manually.
4. Generate new options.
5. Refine an existing option.
6. Analyze a field/package.
7. Save the current working metadata to the Project.
8. Save an alternative set without replacing the selected set.
9. Select one set as the current Project/Publishing Package choice.
10. Return later and see the same saved work.
11. Publish the selected/final package through Publisher.
12. Preserve the history of what was generated, changed, selected and ultimately published.

## 4. Canonical metadata UI

Publisher should use the same ordered sections as Manager:

1. Video Upload
2. Title
3. Thumbnail
4. Visibility
5. Audience
6. Timestamps
7. Description
8. Location
9. Playlists
10. Community
11. AI Use
12. Tags
13. Category

Primary fields remain Title, Thumbnail, Description, Playlists, Tags and Category.

Secondary fields remain Visibility, Audience, Timestamps, Location, Community and AI Use.

Manager-specific published-video behavior must not be copied into Publisher. Manager remains the owner of mutations to an already-published YouTube video.

Publisher-specific behavior should be added through callbacks/adapters around the same canonical component rather than a second metadata component.

## 5. Recommended Publisher composition

Keep the existing Publisher workflow and add:

VIDEO PUBLISHER
- Project Manifestation
  - current Project
  - current Content/Video identity
  - saved package state
  - load / swap / refresh
  - asset slots
- Publishing Work
  - video
  - metadata
  - publish settings
  - publish transaction
- METADATA
  - Video Upload
  - Title
  - Thumbnail
  - Visibility
  - Audience
  - Timestamps
  - Description
  - Location
  - Playlists
  - Community
  - AI Use
  - Tags
  - Category
  - Actions: GENERATE | REFINE | ANALYZE
  - Package actions: SAVE TO PROJECT | SAVE AS OPTION | SELECT | COMPARE | RESTORE

The exact visual composition should follow existing ViewTube Toolbox/SubToolbox patterns; no new raw-control subsystem should be introduced.

## 6. Separate three concepts

### Working edit
What the creator is currently typing/changing before saving.

### Saved version
A durable revision of the metadata state associated with the Project/ContentBuild.

### Alternative set
A deliberate alternative package that can be compared against another package without overwriting it.

Do not call every alternative a version.

Recommended creator-facing language:
- Save
- Save as option
- Choose this
- Compare
- Previous version
- Restore

Technical model can continue to use versions, VariantGroups and selections.

## 7. Package model

Treat a complete metadata set as a publication package option, not merely a bag of unrelated fields.

Example:

Package Option A
- Title A
- Thumbnail A
- Description A
- Tags A
- Category A
- Audience/settings
- provenance
- source/evidence
- generated/refined history

Package Option B
- Title B
- Thumbnail B
- Description B
- Tags B
- Category B
- ...

The creator can select one package option as the current working/publishing choice.

Individual fields must still retain their own asset lineage so a thumbnail or title can be traced independently.

## 8. Save flow

SAVE TO PROJECT:

1. Resolve the active Project.
2. Resolve its canonical contentBuildId.
3. Resolve/create the matching Video Package.
4. Convert changed metadata into canonical assets/versions where appropriate.
5. Attach assets to the ContentBuild.
6. Update ContentBuild selections for fields the creator chose as current.
7. Update the Video Package projection/configuration.
8. Record provenance/change event identifying Publisher as the source tool.
9. Preserve the ContentBuild revision.
10. Refresh Project Manifestation so the saved state is immediately visible.

No Publisher-local permanent metadata store should be introduced.

## 9. SAVE AS OPTION

When the creator chooses SAVE AS OPTION:

1. Resolve the same Project/ContentBuild.
2. Create or reuse the appropriate VariantGroup/package-option grouping.
3. Create assets/versions for changed fields.
4. Preserve parent asset/version relationships for refinements.
5. Add the option to the package set.
6. Do not replace the current selected package unless the creator explicitly chooses it.
7. Record provenance and generation/refinement references.
8. Make the option visible from Publisher and Project Manifestation.

Example:
Option A — current
Option B — generated
Option C — refined
Option D — manual

These are alternatives within one content identity, not four projects.

## 10. Generation and refinement lineage

Every generation/refinement should follow the existing Generation workflow where possible:

Request → Generated output → Asset / Version → Variant group / Package option → Creator selection → Project / Publishing Package → Publish

For refinement:

Title A → REFINE → Title B

Record the version relationship as edited-from.

For generation:

Title prompt/context → Title A / B / C / D → variant group → creator chooses B

Preserve model/prompt/context/evidence references through the existing generation/operation infrastructure.

## 11. Metadata Master relationship

Do not move Metadata Master's responsibilities into Publisher.

Metadata Master remains responsible for:
- package-level optimization;
- complete package alternatives;
- optimization intensity;
- readiness/quality scoring;
- warnings/conflicts;
- evidence/provenance;
- title + thumbnail relationship analysis;
- recommendation provenance;
- recommendation effectiveness;
- metadata-to-thumbnail briefs;
- intelligent package comparison.

Publisher consumes the resulting package and allows the creator to edit, refine, save, select and publish it.

A package should be transferable both directions:

Metadata Master → package handoff → Video Publisher → creator edits/selects → Project + ContentBuild + Publishing Package → Publish

and:

Publisher → selected package/current state → Metadata Master → analysis/optimization → Publisher

The handoff carries canonical identity and provenance; it does not create a duplicate package store.

## 12. Project Manifestation integration

Project Manifestation should become the visible bridge between Publisher working state and saved Project state.

It should show, at minimum:
- current Project;
- current Content/ContentBuild identity;
- saved title;
- saved thumbnail;
- saved description;
- saved tags;
- available package options;
- selected package/asset;
- latest saved revision;
- LOAD;
- SAVE;
- SWAP/CHOOSE where applicable.

Extend the existing manifestation asset-slot model rather than replacing it.

## 13. Handoff contract

Publisher must receive and preserve:
- channelId
- projectId
- contentBuildId
- videoPackageId when available
- source tool
- selected asset IDs
- package/option identity
- evidence IDs
- generation/operation references
- requested action

User-facing wording should remain simple:
- Load Project
- Use this
- Save to Project
- Save as Option
- Send to Metadata Master
- Continue in Thumbnail Studio

Do not expose ActionPacket, ToolReceipt, ContentBuild ID or operation envelope in normal UI.

## 14. Exact publication boundary

Publisher saved working state is not automatically the final published state.

Working metadata → Saved Project state → Selected package → Publishing Package → Review/checks → Approved Publish Snapshot → Publish Transaction → YouTube

The exact package used for external publication must remain attributable.

## 15. Post-publish learning

The saved metadata system should feed the broader lifecycle plan:

Generate → Refine → Save → Select → Publish → Analytics checkpoint → Outcome → Evaluation → Learning candidate

Preserve the distinction between:
- Change: what changed.
- Decision: why the creator chose the change.

Example:
Thumbnail A → Thumbnail B
Decision: Replace after low CTR recommendation.
Published: B.
Analytics: CTR increased after the change.
Evaluation: association observed; causal confidence depends on baseline/confounders.

## 16. Recommended implementation slices

### Slice 1 — Shared Publisher metadata surface
- Wire Publisher to the same CanonicalMetadataSections.
- Match Manager section order and primitive composition.
- Preserve Publisher-specific callbacks.
- Add Publisher tests for all field bindings.

### Slice 2 — Project package save adapter
Create one narrow service/controller responsible for:
- resolve Project/ContentBuild/Video Package;
- persist metadata assets/selections;
- update Project-facing metadata;
- record provenance;
- refresh manifestation.

Do not add a Publisher-local store.

### Slice 3 — Save vs Save as Option
Implement separate commands for:
- Save current state;
- Save as option;
- Choose option;
- Restore version.

Back these with ContentBuild asset/version/VariantGroup contracts.

### Slice 4 — Generation/refinement persistence
Connect existing Publisher generation/refinement actions to:
- GenerationRequest;
- ToolReceipt;
- asset/version lineage;
- option/package grouping.

### Slice 5 — Manifestation round-trip
Verify:
Publisher edit → Save → leave Publisher → return → Load Project → same metadata appears

And:
Publisher generate A/B → Save as Options → choose B → Project reflects B → Publisher reloads B

### Slice 6 — Publishing attribution
Verify:
selected package → Approved Publish Snapshot → PublishTransaction → YouTube binding

Ensure exact selected metadata/assets remain attributable.

### Slice 7 — Analytics/learning bridge
Connect published package identity to analytics checkpoints and evaluation records without creating another analytics store.

## 17. Tests

### Component
- Publisher renders all 13 canonical metadata sections.
- Field changes update Publisher state.
- Generate/refine/analyze actions receive correct slot names.
- Manager and Publisher use the same section order.
- Manager-only live-video behavior is not exposed in Publisher.

### Persistence
- Save writes to the active Project's ContentBuild.
- Save rejects missing/mismatched ContentBuild identity.
- Save reuses the correct Video Package.
- Save updates manifestation state.
- Save does not create a duplicate project/package.
- Save as Option does not replace selected option.
- Selecting an option updates canonical ContentBuild selection.
- Restore returns the previous saved state.

### Lineage
- Generated outputs retain generation references.
- Refinements retain parent relationships.
- Package options retain option/package provenance.
- Selected assets are traceable to their originating option/generation.
- Exact published selections remain attributable.

### Round-trip
- Edit → save → leave → reload.
- Generate → save as option → reload.
- Choose option → publish preparation → reload.
- Thumbnail selection persists.
- Final video selection persists.
- Metadata package persists.

### Safety
- Manager and Publisher cannot overwrite each other's ownership boundaries.
- Published-video mutations remain Manager-owned.
- Publisher remains unpublished/pre-publication owner.
- No second metadata/asset/package store is introduced.

## 18. Risks

| Risk | Mitigation |
| --- | --- |
| Publisher creates a parallel metadata store | All durable writes go through Project/ContentBuild/Video Package authorities |
| Version and option become confused | Keep saved versions separate from alternatives/VariantGroups |
| Saving a field accidentally finalizes it | Save ≠ Select ≠ Finalize |
| Generated metadata disappears after leaving tool | Round-trip persistence test is mandatory |
| Package alternatives overwrite one another | Option selection is explicit |
| Metadata Master and Publisher duplicate ownership | Metadata Master optimizes; Publisher prepares/edits/publishes |
| Thumbnail/video files remain only local File objects | Convert durable selections through canonical asset/Vault pathways |
| Published state cannot be reconstructed | Require exact publication attribution through package/snapshot/transaction chain |
| UI diverges from Manager | Shared CanonicalMetadataSections is the only metadata UI authority |

## 19. Definition of done

A creator can:

Open a Project in Video Publisher → edit metadata → generate/refine alternatives → save the current state or save alternatives → choose one → leave → return → see the same Project/package state → publish → later identify exactly what was published and connect it to analytics.

Internally the identity chain remains:

Project → ContentBuild → Asset/Version/Variant → Publishing Package → Approved Snapshot → Publish Transaction → Published Video → Analytics → Evaluation

## 20. Architectural principle

Publisher should be a room in the same Project, not another world.

The creator should never have to understand that a metadata edit passed through ContentBuild, Asset Engine, Video Package, Publishing Package and operation lineage. ViewTube should handle that automatically while preserving enough provenance to answer later:
- What did I make?
- What did I change?
- What alternatives did I create?
- Why did I choose this one?
- What actually got published?
- How did it perform?
- What should I do differently next time?

## Implementation checkpoint — saved metadata sets

Completed on the convergence branch after the original persistence slice:

- Added a canonical saved-set reader over the existing ContentBuild variant group and Vault assets.
- Added selection behavior that updates the selected metadata-package variant, restores the set's title/description/tags/thumbnail/final-render selections, and updates the existing Project Video Package's selected title/description/tags/thumbnail artifacts where those assets exist.
- Wired **Saved Metadata Sets** into Video Publisher. Selecting a set restores the metadata fields into the active Publisher form and updates the active Project's publishing metadata.
- Replaced the URL-query placeholder for **Compare** with an in-tool side-by-side comparison for title, description, tags, category, visibility, and playlists.
- The selection and save paths reuse the same ContentBuild and Project Video Package; they do not intentionally create a second project/package.

### Verification status

The changes are committed to `audit/system-convergence-identity-certification`. They have **not yet been confirmed by a successful TypeScript build, automated test run, or live Publisher interaction test**. Those remain the next verification gate. If type/build verification reveals repository-shape mismatches, fix them before treating this slice as complete.

### Remaining in this slice

- Verify that selected-set thumbnail preview is reflected in the Publisher UI (the set restores canonical thumbnail selection, but the current local file picker is separate).
- Test repeated save/select cycles for duplicate package artifacts and ensure selection labels remain clear.
- Integrate thumbnail/video byte ingestion with the existing Vault/Asset Engine upload boundary; do not persist raw browser `File` objects in localStorage or create a parallel asset store.



## Follow-up correction checkpoint — alternative isolation and selection restore

Additional fixes committed after the saved-set UI work:

- Saving in **Save as Option** mode now leaves current ContentBuild field selections and the current Video Package title/description/tags untouched; the option payload records the new option's own title/description/tag asset IDs.
- Selecting an option restores those saved asset IDs to the canonical ContentBuild selections and the existing Video Package, with stable artifact IDs and deduplicated selection provenance.
- Saved-set cards can show the selected set's thumbnail preview URL when the Vault asset exposes one; selecting a set updates the main Publisher thumbnail preview. Choosing a new local thumbnail clears the saved preview.
- Added regression assertions for preserving current selections when an alternative is saved, restoring the alternative's field selections, and avoiding duplicate package provenance on repeat selection.

## Current verification and deployment blocker

- The Vercel preview URL was checked in a browser, but it redirects to Vercel login, so the app and Publisher route could not be visually verified in that session.
- GitHub status reports that the latest branch commits' Vercel deployments are **rate limited, retry in 24 hours**. This is a deployment quota failure, not evidence of a TypeScript or runtime failure.
- The regression tests have been updated but have **not been executed in a local build/test environment**. Do not call this slice verified until tests and typecheck/build can run, and a permitted preview can be opened.

Next: obtain a build/test run outside the rate-limited Vercel deployment path, fix any reported type/test errors, then resume durable image/video ingestion through the existing Vault/Asset Engine upload boundary.


## Asset-ingestion boundary inspection

The existing Creator Vault import path is reusable for metadata extraction, hashing, duplicate checks, preview generation, tags, and project association. However, `createImportedVaultAsset` currently records a Vault asset envelope with optional `url`/`previewUrl` and metadata; the import staging model itself holds the browser `File` only during the active workflow. This does **not** prove that original video/image bytes are durably uploaded to a server-backed store.

Therefore the Publisher should not claim a selected local thumbnail/video is durably attached just because a Vault record or preview exists. The next implementation step must identify or add the canonical byte-storage transport behind Vault (for example, the existing connected storage integration if supported), then return a stable stored URL/asset reference before committing it to the Project/ContentBuild/Video Package. Do not serialize raw file bytes into localStorage as a shortcut.
