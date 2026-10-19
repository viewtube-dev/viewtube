# ViewTube Vault + Projects Conversation Recovery Handoff — 2026-10-04

**Repository:** `viewtube-dev/viewtube`  
**Canonical branch inspected:** `main`  
**Recovery round:** Round 1  
**Status:** RECOVERED / REQUIRES RECONCILIATION  
**Source:** Current conversation and repository verification performed by the recovery agent

## 1. Purpose

This document preserves durable ViewTube knowledge from the conversation that produced the Vault/Projects adaptive Asset Workbench plan, implementation claims, handoff, and deployment discussion.

It is a **recovery artifact**, not a replacement for the canonical Vault master.

The canonical Vault master currently found on `main` is:

`docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`

That document states that the Vault/Asset Workbench is a reconstruction master and does not claim the complete toolset is implemented. This handoff preserves additional conversation evidence and must be reconciled against verified current code before implementation status is upgraded.

## 2. Recovery contract followed

The agent first read:

- `Recovery.md`
- `Recovery.yaml`
- `docs/recovery/AGENT_RECOVERY_PLAYBOOK.md`
- `docs/recovery/VIEWTUBE_CONVERSATION_RECOVERY_INDEX_2026-10-02.md`

The repository rules require:

`CONVERSATION → RECOVERY → ARTIFACT → GITHUB → LEDGER → VERIFICATION → RECONCILIATION`

They also require preservation of provenance, stale-write protection, and explicit distinction between plans, reports, implementations, and verified implementations.

## 3. Existing canonical Vault evidence on main

Verified on `viewtube-dev/viewtube/main`:

### Canonical Vault master

`docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`

It defines the target flow:

`asset source → ingestion → inspection → metadata → editing/transformation → derivatives → collections → discovery → lineage/provenance → rights/usage → workflow/operations → Projects/ContentBuild`

It covers:

- media inspection;
- editing/transformation;
- organization;
- governance;
- workflow;
- Projects integration;
- ContentBuild integration;
- Resource Library;
- Brain/AI;
- account/workspace permissions.

It explicitly says the complete toolset must **not** be treated as implemented merely because it is listed.

### Master rebuild plan

`docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_PLAN.md`

It independently establishes the Vault/Asset Workbench master as the canonical Vault resource and requires current-code reconciliation before implementation claims.

### Dependency map

`docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md`

It connects:

- Vault / Asset Workbench
- Asset Engine
- Resource Library
- Projects
- ContentBuild
- Brain / AI
- account/workspace boundaries.

### Creator workspace context

`docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md`

It describes Projects and Vault as connected creator-workspace systems.

### Toolbox prior art

The repository contains Toolbox/SubToolbox planning material and recovery references. Therefore the conversation's direction to reuse existing Toolbox/SubToolbox primitives is consistent with repository governance and should be reconciled against the actual current implementation.

## 4. Core product decision recovered from the conversation

The strongest durable decision in the conversation was:

> **One adaptive Vault Asset Workbench, many capabilities, few actual UI systems.**

The user explicitly rejected the idea that every capability should become a separate mini-application.

The preferred architecture is:

`Vault → selected asset(s) → adaptive Workbench → capability registry → shared SubToolbox primitives → contextual capability surface`

Capabilities should adapt based on:

- asset type;
- selection count;
- current Workbench mode;
- user-visible capability preferences;
- advanced/progressive disclosure state.

The system should show only the functions and controls the user wants to see at a given moment.

## 5. Proposed Workbench modes

The conversation proposed these conceptual modes:

1. Browse / View
2. Inspect
3. Edit
4. Compare
5. Process
6. Organize
7. Workflow

These are **conceptual modes**, not seven mandatory UI applications.

## 6. Capability inventory recovered from the conversation

### Core Asset Workbench

- Asset Workbench
- Asset Viewer
- Asset Inspector
- Asset Selection / Multi-Selection
- Asset Actions
- Asset Operations
- Tool / Capability Manager
- Tool Customization
- Contextual Controls
- Operation History / Undo
- Before / After
- Compare
- Preview / Commit / Cancel
- ActionPacket system
- Send To system

### Media preview

- Image Viewer
- Video Player
- Audio Player
- Document Viewer
- Fullscreen Viewer
- Zoom / Pan
- Playback Controls
- Waveform Viewer
- Frame Viewer
- Media Scrubber
- Frame-by-Frame Viewer

### Universal inspection

- Asset Inspector
- Metadata Inspector
- EXIF Inspector
- Technical Media Inspector
- Dimensions / Resolution
- Codec Inspector
- Color / Color-Space
- Frame Rate
- Audio Characteristics
- File / Storage
- Derivative Inspector
- Lineage Inspector
- Provenance Inspector
- Rights Inspector
- Usage Inspector
- History Inspector

### Image tools

- Basic Photo Editor
- Cropper
- Resize
- Rotate
- Flip
- Aspect-Ratio Tool
- Smart Crop
- Focal-Point Editor
- Thumbnail Generator
- Palette Extractor
- Image Format Conversion
- Quality / Compression
- Image Derivative Generator
- Before / After Image Preview

### Video tools

- Video Player
- Video Timeline
- Trim / Cut
- Crop / Reframe
- Aspect-Ratio Conversion
- Frame Extraction
- Thumbnail / Poster Frame
- Audio Extraction
- Video Compression
- Proxy Generator
- Video Format Conversion
- FFmpeg Operations
- Video Derivative Generator
- Frame Inspector
- Scene / Shot Markers
- Video Before / After
- Video Compare

### Audio tools

- Audio Player
- Waveform
- Audio Timeline
- Trim / Cut
- Audio Metadata
- Audio Extraction
- Audio Conversion
- Audio Compression
- Audio Derivative Generator
- Waveform Export
- Audio Before / After

### Content / script

- Script Editor
- Script Architect
- Document Editor
- Notes Editor
- Transcript Viewer
- Transcript Editor
- OCR
- Text Extraction
- Metadata Editor
- Caption / Subtitle Viewer
- Caption / Subtitle Editor

### Organization / Projects

- Project Builder
- Asset Group Builder
- Mini Library Builder
- Collection Builder
- Smart Collection Builder
- Saved Selection
- Asset Relationships
- Related Assets
- Tags
- Tag Editor
- Bulk Tagging
- Batch Operations
- Asset Group Browser
- Project Browser
- Mini Library Browser

### Search / discovery

- Asset Search
- Advanced Search
- Metadata Search
- Tag Search
- Filter Builder
- Saved Filters
- Find Similar
- Duplicate Detector
- Near-Duplicate Detector
- Visual Similarity
- Semantic Search
- Related Asset Finder
- Recent Assets
- Favorites
- Saved Searches

### AI-assisted

- Auto-Tagging
- Suggested Tags
- Image Description
- Object Detection
- OCR
- Transcript Generation
- Scene Detection
- Shot Detection
- Similarity Analysis
- Duplicate Analysis
- Metadata Suggestions
- Smart Crop Suggestions
- Thumbnail Suggestions
- Content Classification

### Derivatives / processing

- Derivative Generator
- Thumbnail Generator
- Proxy Generator
- Transcoder
- Compressor
- Format Converter
- Resolution Converter
- Aspect Converter
- Frame Extractor
- Audio Extractor
- Image Extractor
- Batch Processor
- FFmpeg Processor
- Processing Queue
- Processing History

### Rights / governance

- Rights Inspector
- License Inspector
- Usage Inspector
- Attribution
- Credit Information
- Usage Restrictions
- Expiration / Review Dates
- Approval State
- Protected / GOLDEN State
- Lifecycle State
- Archive State

### Provenance / lineage

- Asset Lineage
- Source Chain
- Derivative Tree
- Transformation History
- Parent / Child Assets
- Origin Information
- Import History
- Export History
- Processing History
- Relationship Graph

### Compare / review

- Two-Asset Compare
- Before / After
- Image Compare
- Video Compare
- Audio Compare
- Metadata Compare
- Version Compare
- Derivative Compare
- Side-by-Side Viewer
- Overlay Viewer
- Difference View

### Bundle / workflow

- Bundle Builder
- Bundle Projection
- Send To
- ActionPacket Builder
- Workflow Launcher
- Export Builder
- Publish Preparation
- ContentBuild Launcher
- Project Handoff
- Batch Send
- Asset Manifest
- Selection Manifest

### Tool customization

- Toolbox Manager
- Tool Visibility Manager
- Favorite Tools
- Pinned Tools
- Tool Presets
- Asset-Type Tool Presets
- Project-Specific Tool Presets
- Workspace Tool Presets
- Tool Search
- Recently Used Tools
- Contextual Tool Suggestions
- Tool Reset / Restore Defaults

## 7. Consolidation rules recovered

The conversation explicitly proposed that the large capability list should **not** become hundreds of UI components.

Target direction:

**Capabilities → approximately 12–16 conceptual categories → approximately 5–7 actual reusable UI surfaces → one adaptive Workbench**

Candidate conceptual categories:

- Media
- Edit
- Inspect
- Metadata
- Organize
- Search
- Compare
- Process
- Script/Document
- AI
- Rights
- Lineage
- Workflow

Image, video, and audio should preferably be asset-type capability packs inside shared View/Edit/Inspect/Process surfaces.

## 8. Component and layout decisions

Recovered UI principles:

- Reuse existing Toolbox/SubToolbox components and primitives.
- Do not create a competing geometry/token/layout system.
- Keep the Workbench compact and contextual.
- Use progressive disclosure.
- Let users control visible capabilities.
- Keep advanced tools such as FFmpeg, proxies, duplicate analysis, lineage, and processing out of the default clutter.
- Prefer one adaptive media surface with asset-type adapters.
- Prefer one schema/capability-driven Inspector.
- Do not turn the image editor into a general-purpose Photoshop replacement.
- Treat video editing initially as an FFmpeg-oriented asset workbench rather than a full NLE.
- Keep operations nondestructive where appropriate.
- Converge operations into a shared operation/ActionPacket/lineage workflow.

## 9. Project / Mini Library model

The conversation proposed a Project containing grouped asset libraries such as:

```
Project
  - RAW VIDEO
  - B-ROLL
  - MUSIC
  - VOICE
  - THUMBNAILS
  - SCREENSHOTS
  - DOCUMENTS
```

The grouping system should support:

- reusable groups;
- saved selections;
- smart collections;
- asset relationships;
- batch operations;
- project-specific tool presets.

This must be reconciled with the canonical Projects/ContentBuild/Vault Collection model rather than introducing a parallel storage model.

## 10. Common operation architecture

Recovered preferred operation flow:

`Asset → Operation → ActionPacket → Preview → Commit / Cancel → derivative or updated asset → lineage → Send To / Workflow`

The intent is to prevent crop, transcode, frame extraction, thumbnail generation, FFmpeg, and similar tools from each developing separate workflow architectures.

## 11. Conversation implementation claims — provenance warning

The conversation included claims that implementation had been created on another repository/branch:

- repository referenced in the conversation: `cbrewsterthegreat/ViewTube`
- branch referenced: `vault/adaptive-asset-workbench`
- claimed files included:
  - `src/features/vault-workbench/capabilities.ts`
  - `src/features/vault-workbench/capabilities.test.ts`
  - `src/services/vaultWorkspaceState.ts`
  - `src/features/vault-workbench/AdaptiveVaultAssetWorkbench.tsx`
  - `src/features/vault-workbench/AdaptiveVaultAssetWorkbench.test.tsx`
  - `src/features/vault-workbench/vault-adaptive-workbench.css`
  - `src/features/vault-workbench/useVaultAdaptiveWorkbench.ts`
  - `src/features/vault-workbench/useVaultAdaptiveWorkbench.test.ts`
  - `src/features/vault-workbench/VaultAdaptiveWorkbenchHost.tsx`
  - `src/features/vault-workbench/VaultAdaptiveWorkbenchHost.test.tsx`
  - `src/features/vault-workbench/VaultAssetInspectorPanel.tsx`
  - `src/features/vault-workbench/VaultAssetInspectorPanel.test.tsx`

**Status:** REPORTED / NOT VERIFIED IN CANONICAL REPOSITORY.

A direct search of `viewtube-dev/viewtube/main` did not surface these paths or the referenced `CreatorVaultOS` / `VaultAssetModule` names.

Do not copy or declare these implementations canonical until the source repository/branch is independently retrieved and reconciled against `viewtube-dev/viewtube/main`.

## 12. Conversation-generated documentation claims

The conversation also claimed creation of:

- `docs/architecture/VIEWTUBE_VAULT_TOOL_SYSTEM_MASTER_RESOURCE.md`
- `docs/superpowers/plans/2026-10-01-vault-adaptive-asset-workbench.md`
- `docs/handoffs/VIEWTUBE_VAULT_PROJECTS_HANDOFF_2026-10-02.md`

These paths were **not surfaced on canonical `viewtube-dev/viewtube/main`** by the searches performed during this recovery pass.

**Status:** REPORTED / NOT VERIFIED IN CANONICAL REPOSITORY.

The canonical Vault master already exists at:

`docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`

Therefore these should not be recreated blindly. Their unique content should be reconciled into the canonical master or preserved as recovery evidence as appropriate.

## 13. Deployment evidence from the conversation

The conversation also created/attempted a Render preview for a ViewTube repository:

- service claimed: `viewtube-preview-main`
- claimed branch: `main`
- claimed URL: `https://viewtube-preview-main.onrender.com`
- deployment later reported as **build_failed**
- claimed deploy ID: `dep-davi9749v7es73ftnf10`
- claimed commit: `3417b0cc9f72b5565e3c54e15e8fdecf336e38a8`

**Status:** REPORTED / FAILED as recorded in conversation; not independently re-verified against the canonical repository/Render state during this recovery pass.

The failure should be preserved as evidence rather than treated as a Vault implementation failure.

## 14. Important repository identity reconciliation

The conversation operated against:

`cbrewsterthegreat/ViewTube`

The recovery protocol now establishes:

`viewtube-dev/viewtube`

as the canonical repository.

This is a material provenance boundary.

Any code, branch, PR, deployment, document, or implementation claim from the `cbrewsterthegreat/ViewTube` context must be treated as **historical/external evidence** until it is independently verified and reconciled into `viewtube-dev/viewtube`.

Do not silently transfer branch/commit status across repositories.

## 15. Recovery findings

### WHAT WAS FOUND

The conversation contains a substantial Vault/Projects product specification centered on an adaptive Asset Workbench, plus implementation claims and a deployment attempt.

### WHERE IT CAME FROM

The source is the current ChatGPT conversation. Some claims reference another GitHub repository and branch.

### WHAT IT MEANS

The conversation provides significant additional product/design requirements beyond the concise canonical Vault master, especially:

- adaptive capability architecture;
- contextual/progressive UI;
- detailed image/video/audio tool inventory;
- Project/Mini Library grouping;
- shared operation architecture;
- consolidation rules.

### WHAT IS VERIFIED

Verified against canonical `viewtube-dev/viewtube/main`:

- Recovery system exists and is authoritative.
- Canonical Vault master exists at `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`.
- Master rebuild governance establishes Vault/Asset Workbench as a canonical system.
- Projects/ContentBuild and Resource Library are recognized as related systems.
- Toolbox/SubToolbox is an established recovery category/prior-art area.

### WHAT IS NOT VERIFIED

Not verified in canonical `main`:

- the conversation's named Workbench implementation files;
- `CreatorVaultOS` implementation;
- `VaultAssetModule` implementation under the claimed paths;
- the claimed feature branch;
- the claimed commits/PRs;
- the complete detailed tool inventory as implemented functionality;
- the Render deployment state.

### WHAT MUST HAPPEN NEXT

1. Inspect the actual Vault/asset/project runtime code in `viewtube-dev/viewtube/main`.
2. Compare it against `docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`.
3. Recover any unique content from the external `cbrewsterthegreat/ViewTube` branch if it is accessible and relevant.
4. Reconcile the adaptive Workbench proposal into the canonical Vault master.
5. Identify which capabilities are already implemented versus planned.
6. Create an evidence-backed implementation plan in the canonical repository.
7. Implement only after prior-art and ownership checks.
8. Verify tests/build/runtime before upgrading status to VERIFIED IMPLEMENTATION.

## 16. Unresolved questions

- Is `cbrewsterthegreat/ViewTube` an authorized historical/source repository for the canonical `viewtube-dev/viewtube` project?
- Is the `vault/adaptive-asset-workbench` branch still accessible?
- Which of the claimed Workbench files can be recovered?
- Which claimed implementation pieces are newer or better than current `main`?
- What current runtime code owns Vault assets and Projects?
- What is the actual canonical SubToolbox implementation on `main`?
- Which Project/Collection/ContentBuild concepts are already implemented?
- Which detailed capabilities are already implemented but not documented in the current Vault master?
- What Render service is currently canonical for ViewTube?

## 17. Continuation rule

Future agents should start from:

`docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md`

and this handoff.

Do not recreate the detailed tool inventory from memory.

Do not treat conversation implementation claims as canonical.

Use the repository's required workflow:

**SEARCH → UPDATE → EXTEND → COMBINE → CONSOLIDATE → MERGE → ADAPT → CREATE**

and preserve the distinction:

**RECOVERED SOURCE ≠ CURRENT IMPLEMENTATION ≠ VERIFIED IMPLEMENTATION.**

## 18. Recovery continuation — Projects / ContentBuild / Asset Engine / Vault convergence

**UPDATE-ID:** UPDATE-20261004-recovery-001  
**Timestamp:** 2026-10-04 02:08 EDT  
**Conversation title:** ViewTube Toolbox / Vault / Projects / Asset Engine convergence and implementation continuation  
**Main focus:** Reduce overlapping video/content/project systems and begin hardening the actual application identity spine rather than producing additional planning artifacts.

### Durable discoveries

- The conversation converged on a single system-level workflow rather than separate Projects, ContentBuild, Asset Engine, Vault, Video Package, Publishing Package, and specialist-tool silos.
- The intended durable spine is: Project → ContentBuild → Asset Engine → canonical Asset identity → Vault artifact → Video Package projection → Publishing Package snapshot → Publisher → Outcome/Learning.
- Projects owns creator planning/work-container concerns; ContentBuild is the durable content lifecycle identity; Asset Engine owns production asset relationships, versions, variants, selections, generation and lineage; Vault owns durable artifact/media storage and organization; packages are projections/snapshots rather than competing content identities.
- The user explicitly approved moving from planning into actual application/code improvements. Further planning documents should not be produced unless required by the recovery protocol or a code contract genuinely requires one.
- The first approved implementation slice is Project ↔ ContentBuild identity hardening, followed by the Project → ContentBuild → Asset → Vault → Asset Engine vertical slice.

### Code discoveries and implementation evidence

- A historical code inspection in the cbrewsterthegreat/ViewTube context found an existing ProjectContentIdentityService, ContentBuildRepository, Asset Engine services, and package/bridge code. Those findings remain REPORTED / HISTORICAL because that repository is not the connected canonical repository.
- The attempted revision-concurrency implementation exposed a real verification failure: a test change was created against a three-argument updateContentBuild API, while the corresponding production repository implementation still had the old two-argument signature. The change therefore must not be called complete.
- The correct production direction is optimistic concurrency at the ContentBuild repository boundary: read revision N, require the caller's expected revision to equal N, reject stale writes, and only then persist revision N+1.
- No canonical viewtube-dev/viewtube/main source file named src/services/asset-engine/ContentBuildRepository.ts or src/services/projects/ProjectContentIdentityService.ts was found by repository search during this recovery pass. The canonical repository currently exposes the recovery/documentation corpus and a minimal README.md; therefore the historical code implementation cannot yet be promoted to canonical implementation evidence.

### Optimizations / architecture decisions

- Do not create another identity service or another content store merely to solve convergence. First locate/recover the canonical implementation and harden its existing ownership boundaries.
- Do not remove compatibility bridges until callers are migrated, parity is demonstrated, production reachability is zero, and removal is verified.
- Package writes that duplicate ContentBuild state are a known convergence seam. They should eventually become projections/snapshots, but migration must be evidence-driven.
- The identity certification path should cover create → retry → reopen → edit → handoff → return → package → publish while preserving the same Project and ContentBuild identity and rejecting stale revisions.

### Verification

- VERIFIED: Connected GitHub account is viewtube-dev; canonical repository is viewtube-dev/viewtube; default branch is main.
- VERIFIED: Canonical recovery protocol, Recovery.md, Recovery.yaml, playbook, recovery index, and Vault/Projects recovery handoff were read from canonical main.
- VERIFIED: Canonical recovery rules require implementation to be distinguished from plans and require implemented → merged to main → verified for completion.
- VERIFIED: Canonical viewtube-dev/viewtube/main currently does not expose the historical ContentBuild/Asset Engine source paths searched above.
- REPORTED / NOT VERIFIED: Historical cbrewsterthegreat/ViewTube code paths, branches, commits, tests, and implementation status.
- FAILED: The attempted historical revision API change was not production-complete because test and implementation signatures were inconsistent.

### Blockers / unresolved items

- Recover or otherwise establish the actual canonical application source tree for viewtube-dev/viewtube before modifying production code there.
- Determine whether the historical cbrewsterthegreat/ViewTube repository/branch can be recovered and whether its code is authorized source material for canonical reconstruction.
- Reconcile the historical Project/ContentBuild/Asset Engine/Vault implementation against canonical main before transferring code.

### Next actions

1. Preserve this recovery evidence in canonical recovery state.
2. Recover the canonical application source or establish the correct source repository/branch.
3. Re-run the Project ↔ ContentBuild identity inspection against that canonical code.
4. Implement revision-safe mutation with matching production callers and tests in the canonical source.
5. Verify tests/builds before proceeding to the Asset/Vault vertical slice.
