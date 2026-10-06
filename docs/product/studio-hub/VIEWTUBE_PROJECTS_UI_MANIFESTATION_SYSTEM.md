# ViewTube Projects UI Manifestation System

## Purpose

The Projects UI Manifestation System is the shared visual layer for loading, editing, saving, and swapping a creator's complete Project state inside Studio Hub tools.

It is intentionally **not** a second project database.

The canonical lifecycle remains:

`Project → ContentBuild → Publishing Package → Tool`

The manifestation layer makes that lifecycle visible and actionable.

## Canonical identity

Every manifested project may carry:

- `projectId`
- `contentBuildId`
- `videoPackageId`
- ContentBuild revision
- Project status / format
- saved metadata
- saved thumbnail selection
- saved creative assets
- saved production/render assets

Project identity is resolved through the existing `ProjectContentIdentityService`.

ContentBuild selections remain durable through `ContentBuildRepository`.

Publishing Package state remains projected through `PublishingPackageProjection` and `VideoPackageRepository`.

## UI component

### `ProjectManifestation`

Source:

`src/components/projects/ProjectManifestation.tsx`

The component provides:

1. **Project Load / Swap**
   - project selector
   - LOAD
   - SWAP IN
   - REFRESH

2. **Manifest Identity**
   - thumbnail/poster
   - working title
   - project name
   - status
   - format
   - ContentBuild identity
   - Publishing Package identity
   - saved tags
   - description preview

3. **Saved Content / Ready to Swap**
   - Title
   - Thumbnail
   - Description
   - Tags
   - Script
   - Storyboard
   - Final Video
   - available saved version count
   - SWAP control where a canonical asset selection exists

4. **Tool handoff**
   - LOAD INTO TOOL
   - SAVE PROJECT STATE

## Data adapter

Source:

`src/components/projects/projectManifestation.ts`

The adapter converts the existing Project + Publishing Package structures into one UI-safe manifestation.

It does not duplicate or own asset storage.

Thumbnail resolution prefers the selected Publishing Package thumbnail preview URL and falls back to the Project thumbnail URL.

Metadata resolution prefers the creator-facing Project fields while recognizing package metadata when present.

## Swapping

Asset swapping uses the existing:

`setContentBuildSelection(contentBuildId, slot, assetId)`

This means a swap updates the canonical ContentBuild selection rather than creating a second copy.

The Publishing Package projection can therefore observe the new selection.

This applies to:

- title
- thumbnail
- description
- tags
- script
- storyboard
- final render

## Tool integration

### Video Manager

Video Manager now exposes Project Manifestation before its publishing controls.

Loading a Project hydrates the Manager's editable:

- title
- description
- tags
- thumbnail

Saving Manager changes also persists the corresponding Project metadata when an active Project exists.

Video Manager remains the owner of already-published YouTube video changes.

### Video Publisher

Video Publisher now exposes the same Project Manifestation.

Loading a Project hydrates:

- concept
- niche
- audience
- script
- title
- description
- tags

Saving the Publisher state persists the Project-facing content fields.

Publisher remains the owner of unpublished publishing preparation and publication workflow.

## Design-system rule

The manifestation UI uses the existing ViewTube Toolbox/SubToolbox primitives.

Production code must not create parallel button, select, tag, media-poster, status-badge, or output-card implementations when a canonical primitive exists.

## Future extensions

The same component can be embedded in:

- Metadata Master
- Thumbnail Studio
- Content Architect
- Script / Story tooling
- Content Analysis
- Revenue Architect
- Audience tools
- Project Builder
- Asset Engine
- future Studio Hub tools

The intended UX is:

**select Project → see its complete saved manifestation → load/swap it → edit in the tool → save back to the canonical Project/ContentBuild state.**

This makes Projects portable across tools instead of forcing every tool to reconstruct project context independently.
