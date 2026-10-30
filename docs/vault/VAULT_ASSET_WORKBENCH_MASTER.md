# ViewTube Vault / Asset Workbench — Tools, Capabilities, Plans & Systems Reference

**Status:** CANONICAL RECONSTRUCTION / PRODUCT-ARCHITECTURE REFERENCE  
**Implementation status:** Reference architecture is defined. Phases 0–6 have implementation work; phases 7–10 are now being advanced on `vault/phases-0-1-2-workbench`. Exact-head CI, cross-system certification, server authorization/durable queue, and production runtime certification remain pending. Do not infer completion from branch writes alone.  
**Canonical repository:** viewtube-dev/viewtube  
**Primary owner document:** docs/vault/VAULT_ASSET_WORKBENCH_MASTER.md  
**Related overview:** docs/Vault.md  
**Recovery evidence:** docs/recovery/handoffs/VIEWTUBE_VAULT_PROJECTS_CONVERSATION_RECOVERY_2026-10-04.md

## Conversation continuity and domain update ownership

The global [Conversation Handoffs specification](../governance/CONVERSATION_HANDOFFS.md) owns long-thread continuity, the complete user-instruction register, all-domain work capture, branch/PR reconciliation and work disposition. Use one package at `tasks/conversation-intake/<conversation-id>/` containing `handoff.md`, `worklog.json` and `review.md` whenever its triggers apply. Update an existing package in place when the user says **“Update the unfinished work log.”**; do not create a second Vault conversation log.

This Vault master and its phase/audit documents remain authoritative for Vault-specific architecture, implementation checkpoints, operation/asset lineage, technical evidence and acceptance gaps. Their domain-specific status tables are projections, not substitutes for the global conversation worklog or Task Authority. For material Vault changes, update the relevant Vault authority/audit and append its domain change record where provided; capture all distinct user instructions and cross-domain unfinished work in the global package. Preserve historical recovery documents as provenance, not as competing current handoffs.

## Current implementation checkpoint — October 15, 2026 (phases 0–10 continuation)

The active continuation is tracked in [Phases 0–2 implementation audit](VAULT_PHASES_0_1_2_IMPLEMENTATION_AUDIT.md), [Phases 3–6 implementation audit](VAULT_PHASES_3_4_5_6_IMPLEMENTATION_AUDIT.md), and [Phases 7–10 implementation audit](VAULT_PHASES_7_8_9_10_IMPLEMENTATION_AUDIT.md), on PR [#336](https://github.com/viewtube-dev/viewtube/pull/336) targeting `master/consolidated-feature-integration`.

- **Phase 0:** canonical source ownership and baseline gaps documented.
- **Phase 1:** stable local asset identity, stale-selection guards, and protected/lifecycle mutation policy strengthened with regression tests.
- **Phase 2:** adaptive mode/capability host integrated; video/audio processing is not advertised without verified processors.
- **Phase 3:** read-only technical/rights/lineage inspection and actionable findings added while reusing canonical search, collections, custom fields, and metadata services.
- **Phase 4:** bounded operation ledger with guarded state transitions, input/output lineage, retry/error/receipt fields; derivative flows associate operations and lineage.
- **Phase 5:** shared media-operation preflight enforces compatible media kind, selection/source limits, protected-source restrictions, and derivative-only behavior.
- **Phase 6:** field-level comparison, rights/license/source/expiry/restriction findings, and explicit metadata suggestion proposal/acceptance safeguards added.

**Release state:** IMPLEMENTATION IN BRANCH / EXACT-HEAD CI VERIFICATION PENDING. The browser `localStorage` adapter and operation ledger are not server durability or server authorization. The media preflight contract is not proof a deployed worker is healthy. Metadata suggestions are proposals, not a connected AI model. Rights findings are not legal clearance. Do not merge or certify until the latest-head tests, typecheck/build, browser verification, and target-branch read-back are complete.

## 1. Purpose and product promise

Vault is ViewTube's durable asset and media workbench. It helps creators ingest, find, understand, organize, transform, compare, govern, reuse, and hand off assets across projects and production workflows.

The product direction is **one adaptive Vault Asset Workbench, many capabilities, a small set of reusable surfaces**. The capability inventory is deliberately much larger than the number of screens. Do not turn every tool name into a separate mini-application.

The Workbench should continuously answer:
1. What asset or selection am I working on?
2. What can I do to it, given its type, state, permissions, and context?
3. What will happen if I perform this operation?
4. Where will the result, history, and provenance be recorded, and where can I send it next?

## 2. System boundary and canonical flow

Target flow:

SOURCE → INGEST/RESOLVE → CANONICAL ASSET IDENTITY → PREVIEW/INSPECT → METADATA/GOVERNANCE → OPERATION → PREVIEW/RESULT → COMMIT/CANCEL → DERIVATIVE/VERSION + LINEAGE → COLLECTION/PROJECT → WORKFLOW HANDOFF

The wider creator lifecycle is:

PROJECT → CONTENTBUILD → ASSET ENGINE → CANONICAL ASSET IDENTITY → VAULT ARTIFACT → VIDEO/PUBLISHING PACKAGE PROJECTION → PUBLISHER → OUTCOME/LEARNING

These are connected responsibilities, not competing asset stores:

- **Vault:** durable asset access, organization, inspection, media operations, provenance, rights, and reuse.
- **Asset Engine:** asset creation/resolution, relationships, versions/variants, production selections, derivation, lineage, and operation handoff. Verify exact code ownership against canonical source before migration.
- **Projects:** creator work containers, planning, project membership, and navigation into related assets.
- **ContentBuild:** durable content-production lifecycle identity and state.
- **Resource Library:** curated reusable reference resources; not a second media-asset database.
- **Brain / AI:** interprets asset and workflow context, suggests actions, and assists generation; it must not become the canonical asset store.
- **Video/Publishing Packages:** downstream projections or snapshots assembled from project/content/asset data, not a rival canonical asset identity.
- **Account/workspace system:** authentication, authorization, ownership, and scope boundaries.
- **Analytics:** relevant performance evidence for asset decisions when data exists; analytics must not silently rewrite creator-approved assets.

If current implementation contradicts this target, record the discrepancy and evidence. Do not assume the target is already implemented.

## 3. Workbench interaction model

### 3.1 Shared surfaces, not one screen per capability

Use these conceptual modes as navigation/state within one adaptive Workbench:

1. **Browse / View** — find, select, preview, and navigate assets.
2. **Inspect** — descriptive and technical metadata, history, rights, lineage, and health.
3. **Edit** — supported, focused, preferably non-destructive changes.
4. **Compare** — assets, versions, metadata, or operation results.
5. **Process** — conversions, derivatives, extraction, batch jobs, and other operations.
6. **Organize** — tag, group, collect, relate, and assign assets to project contexts.
7. **Workflow** — bundles/manifests, send assets to tools, and hand off to Projects/ContentBuild or downstream production.

These are modes, not seven mandatory applications. Capability panels should be available contextually inside shared surfaces.

### 3.2 Adaptation inputs

Capability resolution should consider asset type(s), selection count, current mode, lifecycle/processing state, permissions, available metadata and dependencies, creator preferences, project/content context, advanced disclosure state, and operation availability/errors.

Do not enable an action when prerequisites are missing. Explain why an unavailable action is disabled when the user can reasonably address the missing prerequisite.

### 3.3 Progressive disclosure

Prioritize frequent, safe operations. Put advanced controls (raw FFmpeg options, proxy settings, duplicate-analysis tuning, detailed lineage, batch-processing parameters) behind contextual expansion. Support capability search, pinning/favorites, user-visible tool preferences, presets, and restore-defaults behavior when the foundation is stable.

### 3.4 Reuse canonical UI primitives

Use existing canonical Toolbox/SubToolbox shells, primitives, tokens, and component-library conventions. Do not invent a parallel Workbench geometry, sizing, control, or CSS system. Inspect exact canonical source files and APIs before coding. Compose existing primitives; add a reusable variant when justified rather than copying/hard-coding primitive markup or styles.

## 4. Capability taxonomy and inventory

This is a **target catalog**, not proof of implementation. Every capability needs an evidence-backed status record.

### A. Core Workbench and selection
- Adaptive Asset Workbench
- Asset grid/list and contextual viewer
- Single-asset and multi-asset selection
- Selection summary and primary asset
- Contextual action menu
- Capability/tool search
- Tool visibility, pinning, favorites, and recent tools
- Asset-type and project/workspace presets
- Operation history and available undo/redo
- Before/after preview
- Preview / commit / cancel controls
- Shared operation/ActionPacket handoff
- Send To and workflow launcher
- Empty, loading, unsupported-type, permission-denied, and error states

### B. Preview and playback
- Image viewer with zoom/pan/fullscreen
- Video player with playback controls and scrubbing
- Audio player and waveform
- Frame viewer and frame-by-frame navigation
- Document viewer
- Transcript/caption preview
- Before/after media preview
- Preview of generated derivatives and conversion results

### C. Universal inspection and metadata
- General asset inspector
- Descriptive metadata editor
- Technical media inspector
- EXIF inspector when source data supports it
- File/storage information
- Dimensions and resolution
- Duration, frame rate, codec, container, and color-space information when applicable
- Audio channel/sample-rate/characteristic information when available
- Derivative/version inspector
- Asset health and validation results
- Import/export/processing history
- Provenance and source attribution
- Lineage and relationship inspector
- Rights, license, usage, and restriction inspector
- Lifecycle, approval, protected/GOLDEN, and archive state

### D. Image capabilities
- Crop and aspect-ratio crop
- Resize and resolution conversion
- Rotate and flip
- Basic image adjustments where supported
- Smart crop and focal-point editing
- Palette/color extraction
- Format conversion
- Quality/compression controls
- Thumbnail/poster generation
- Image derivative generation
- Image extraction from supported media
- Image comparison and before/after view

### E. Video capabilities
- Video preview and timeline/scrubber
- Trim/cut
- Crop/reframe and aspect-ratio conversion
- Frame extraction and poster-frame selection
- Audio extraction
- Video compression and format conversion
- Resolution conversion
- Proxy generation
- FFmpeg-backed operations where dependency and policy permit
- Scene/shot markers and frame inspection where supported
- Video derivative generation
- Before/after and version comparison

This is an asset-workbench scope, not a commitment to build a full nonlinear video editor. Full timeline editing needs a separate product decision.

### F. Audio capabilities
- Audio playback and waveform
- Audio timeline and trim/cut
- Audio metadata inspection
- Audio extraction from video
- Audio format conversion and compression
- Audio derivative generation
- Waveform export
- Before/after audio preview

### G. Documents, scripts, transcripts, captions
- Document and notes editor
- Script/text preview and editing when appropriate
- Transcript viewer/editor
- OCR and text extraction
- Caption/subtitle viewer/editor
- Metadata editing
- Text extraction from supported assets

Vault document tools should remain focused on asset-linked documents. They should not become a second full Script Architect or general-purpose editor where an existing canonical tool owns that job.

### H. Organization and relationships
- Collections and collection builder
- Asset groups and group builder
- Smart collections
- Saved selections
- Tags and tag editor
- Bulk tagging/classification
- Related assets
- Parent/child and source/derivative relationships
- Project asset browser
- Project-specific asset groupings
- Mini-library concepts only when reconciled with canonical Projects/Collections
- Batch operations

### I. Search and discovery
- Asset search
- Advanced search and filters
- Search by metadata, tags, type, source, project, state, and date where fields exist
- Filter builder and saved filters/searches
- Recent assets and favorites
- Find similar
- Duplicate and near-duplicate detection
- Visual similarity and semantic search only when supported by real services/data
- Related-asset discovery

### J. AI-assisted capabilities
- Auto-tagging and suggested tags
- Asset description
- Object/content classification
- OCR/text extraction
- Transcript generation
- Scene/shot detection
- Similarity and duplicate analysis
- Metadata suggestions
- Smart-crop suggestions
- Thumbnail/poster suggestions
- Suggested asset relationships

AI outputs are proposals until accepted. Preserve source evidence, model/service provenance where available, creator edits, and approval state. AI must not silently overwrite approved metadata or replace a creator's master asset.

### K. Derivatives and processing
- Derivative generator
- Thumbnail/poster generator
- Proxy generator
- Transcoder and compressor
- Format, resolution, and aspect-ratio conversion
- Frame, audio, and image extraction
- Batch processor
- FFmpeg operation adapter
- Processing queue
- Processing history and retry/error handling

### L. Rights, lifecycle, and governance
- Rights and license information
- Attribution and credit
- Usage restrictions and permitted-use context
- Expiration/review dates where applicable
- Approval state
- Protected/GOLDEN state
- Lifecycle and archive state
- Destructive-operation warning and confirmation
- Ownership/workspace authorization
- Retention/deletion behavior consistent with account and data policies

### M. Provenance, lineage, and auditability
- Source chain and origin
- Import and export history
- Parent/child asset links
- Derivative tree
- Transformation history
- Processing records
- Operation inputs and outputs
- Relationship graph where useful
- Actor/time and decision evidence for consequential changes
- Links to downstream project/content/package usage when available

### N. Compare, review, and quality
- Two-asset compare
- Image/video/audio compare where supported
- Before/after comparison
- Metadata compare
- Version and derivative compare
- Side-by-side, overlay, and difference views where meaningful
- Validation/quality findings
- Review and approval context

### O. Bundles, handoffs, and downstream workflow
- Bundle builder and bundle projection
- Asset manifest and selection manifest
- Export builder
- Send To action
- ActionPacket creation/preview
- Workflow launcher
- Batch handoff
- Project handoff
- ContentBuild launcher
- Publish-preparation handoff where applicable
- Destination validation and handoff receipt

## 5. Canonical Tool Record Contract

Every implemented or actively planned capability should have a structured record. A tool name alone is not a sufficient specification.

| Field | Required definition |
|---|---|
| ID / canonical name | Stable identifier and user-facing label |
| Purpose | Single user outcome; avoid overlapping owners |
| Category / mode | Taxonomy and Workbench surface |
| Supported inputs | Asset types, selection cardinality, required metadata |
| Preconditions | Required state, permissions, dependencies, destination |
| User controls | Fields, defaults, advanced options, validation |
| Operation semantics | Read-only, metadata mutation, source mutation, or derivative creation |
| Outputs | Asset IDs, metadata, derivative, job, manifest, handoff receipt |
| Canonical owner | One subsystem responsible for behavior/data |
| Dependencies | Runtime services, libraries, external tools, APIs |
| State model | Applicable operation states |
| Failure/retry | Recoverable errors, retry safety, idempotency, cancellation |
| Permissions | User/workspace/project ownership and action authorization |
| Consequence | Reversible, destructive, costly, externally visible, or consequential |
| Preview/confirmation | What the user sees before commit |
| Provenance | Inputs, source IDs, operation parameters, output/parent IDs |
| UI entry | Exact surface and component/primitive used |
| Runtime reference | Exact canonical source path and symbol |
| Tests | Focused, integration, and UI/runtime evidence |
| Status | Exact implementation status |
| Source/decision | Requirement source and approved decision if any |

Use the repository status vocabulary: VERIFIED, REPORTED, INFERRED, PROPOSED, IMPLEMENTED, VERIFIED IMPLEMENTATION, FAILED, BLOCKED, SUPERSEDED, UNKNOWN. Use UNKNOWN when runtime ownership or implementation cannot yet be located.

## 6. Shared operation architecture

Operations should converge on a common contract instead of each tool inventing a separate execution lifecycle.

Preferred flow:

SELECTED ASSETS → CAPABILITY/ACTION → VALIDATE → OPERATION REQUEST/ACTIONPACKET → PREVIEW OR CONFIRMATION → EXECUTE → RESULT RECEIPT → DERIVATIVE/METADATA CHANGE → LINEAGE/HISTORY → OPTIONAL SEND TO/HANDOFF

Required behavior:
- Validate asset existence, input type, selection cardinality, permissions, and parameters before execution.
- Preserve original assets by default where practical; make destructive changes explicit.
- Show expected outputs and consequences before committing consequential actions.
- Use idempotency/retry protection for operations that may be retried.
- Represent queued/running/succeeded/failed/cancelled state for asynchronous work.
- Preserve useful errors and recovery paths; never silently drop failed operations.
- Record input IDs, parameters, operation identity, output IDs, timestamps, and provenance where supported.
- Make cancellation behavior explicit.
- Support batch operations with per-item results and partial-failure visibility.
- Connect successful outputs to lineage and downstream handoffs.
- Avoid duplicating operation identity across ActionPacket, generation records, Vault history, ContentBuild events, and Brain traces; reconcile IDs and receipts where these systems already exist.

Conceptual states: DRAFT → VALIDATED → QUEUED → RUNNING → SUCCEEDED / FAILED / CANCELLED. Not every operation needs every state; synchronous operations may skip queue/run states but must report outcomes consistently.

### Data integrity rules
- Stable asset identity survives rename, metadata edits, project handoffs, and derivative creation.
- A derivative remains linked to its source and does not silently replace source identity.
- A creator-approved master remains available when generating variants.
- Metadata-only edits should not create duplicate media records.
- Use optimistic concurrency or equivalent protection where multiple editors can update the same mutable record.
- Deletion/archive and external export require clear scope, authorization, and consequences.

## 7. Asset and collection model

Conceptual entities below must be reconciled with actual canonical schemas before implementation; they are not approval to add duplicate tables:

- **Asset:** canonical durable identity and asset-level metadata.
- **AssetVersion / Derivative:** version or transformed output linked to parent/source and operation.
- **AssetRelationship:** typed relation such as source/derivative, related, alternate, or project-role relation.
- **Collection:** reusable organization of assets.
- **SavedSelection:** persistent selection where supported.
- **Operation / OperationReceipt:** request, state, outcome, and result evidence.
- **LineageEvent:** provenance/transform relation and actor/time evidence.
- **RightsRecord:** license, attribution, restriction, expiry/review data.
- **AssetManifest / Bundle:** portable selection/output projection for handoff.
- **ProjectMembership / ContentBuild link:** contextual links, not duplicate asset identities.

A project may group assets such as RAW VIDEO, B-ROLL, MUSIC, VOICE, THUMBNAILS, SCREENSHOTS, and DOCUMENTS. Implement these as collections/groups or project-role labels using existing ownership. Do not create a second project/library storage model.

## 8. Integration contracts

### Projects
Open Vault with project context where supplied. Show project-related assets and groups without claiming membership if no durable link exists. Preserve canonical asset IDs across navigation and support return navigation/handoff receipts where available.

### ContentBuild and Asset Engine
Resolve or create assets through the canonical asset service. Preserve project/content identity through create, retry, reopen, edit, handoff, return, package, and publish. Keep asset selection, role, variant, and lineage connected to the owning ContentBuild. Treat packages as projections/snapshots rather than a competing source of truth. Reconcile actual code ownership before moving responsibilities.

### Resource Library
Link curated reference resources to assets only through explicit supported relationships. Keep reference documentation distinct from user media assets where schemas differ.

### Brain / AI
Provide selected asset metadata, provenance, rights, project context, and operation history as scoped context. Treat AI suggestions as proposals until approved. Keep Brain out of canonical asset persistence unless architecture explicitly assigns it that role.

### Analytics
Use performance evidence only where the analytics contract provides relevant asset-level attribution. Do not infer causality without evidence. Preserve provenance of analytics-derived recommendations.

### Account/workspace security
Enforce authorization at the service boundary, not only by hiding UI controls. Scope assets, collections, operations, and exports correctly. Validate destination permissions before handoff/export. Treat external processing and AI services as explicit dependencies with clear failure and privacy behavior.

## 9. UI and interaction standards

- Reuse canonical Toolbox/SubToolbox shells and studio control primitives.
- Keep one clear purpose and primary success outcome per capability surface.
- Use consistent labels, sizes, focus states, validation, and errors from the canonical component system.
- Make selection count and target asset obvious.
- Keep frequent actions visible; advanced controls use progressive disclosure.
- Distinguish read-only inspection from editing/execution.
- Clearly distinguish Preview, Apply/Commit, and Cancel.
- Confirm destructive or externally consequential actions.
- Show progress, partial batch failures, retries, and operation history.
- Preserve last valid inputs where appropriate; never silently discard edits on navigation.
- Provide empty, loading, unsupported, permission, validation, and failure states.
- Avoid page-specific CSS patches that bypass shared primitives.
- Avoid duplicated component markup/CSS; add a reusable primitive/variant when justified.

## 10. Security, safety, and reliability

- Authorize every data-changing or exporting operation.
- Treat user input and asset metadata as untrusted; validate and escape appropriately.
- Constrain file paths, resource use, codecs/arguments, timeouts, and output destinations for external media processors.
- Avoid constructing shell commands from raw user input when invoking FFmpeg or similar tools.
- Set file size, duration, and resource limits; report limit failures.
- Protect against path traversal, unsafe archive extraction, MIME/content mismatch, and malicious media/document payloads.
- Use safe temporary-file handling and clean up failed jobs.
- Do not expose private asset URLs or metadata across workspace boundaries.
- Record consequential actions and failures with useful non-secret diagnostics.
- Respect rights, license, consent, retention, and export restrictions.
- Prevent duplicate derivatives and duplicate external side effects during retries.
- Do not claim security or performance guarantees without tests or review evidence.

## 11. Testing and verification matrix

For each capability, verify applicable layers:

1. **Unit:** eligibility, input validation, metadata mapping, parameter normalization, state transitions.
2. **Component:** selected context, enabled/disabled actions, form validation, preview/commit/cancel, error/empty states.
3. **Service/integration:** permissions, persistence, job execution, derivative linking, lineage/history, retry/idempotency, partial batch results.
4. **Cross-system:** Projects ↔ Vault ↔ ContentBuild ↔ Asset Engine ↔ package handoff identity preservation.
5. **Browser/runtime:** actual preview, controls, console/network errors, loading/progress, keyboard/focus behavior.
6. **Build/release:** focused tests, full suite, production build, deployment verification against exact commit.

Minimum acceptance:
- Purpose and canonical owner are unambiguous.
- Inputs/preconditions and permission checks are defined.
- UI is wired to real runtime behavior, not placeholder state.
- Success and failure paths are tested.
- Output identity, history, and provenance are correct where applicable.
- No regression in adjacent capability surfaces.
- Evidence links to exact tests/source/commit and status is truthful.

## 12. Implementation plan and sequencing

This is a dependency-ordered plan, not a claim of completed implementation.

### Phase 0 — Establish canonical source and baseline
Inspect the canonical application source tree, package scripts, routes, schemas, services, tests, and existing Vault/Asset Engine/Projects implementations. Map capabilities to the Tool Record Contract. Confirm canonical UI primitives and Toolbox/SubToolbox ownership. Capture baseline tests/build and known failures. Search before creating new components, services, schemas, or documents.

**Exit gate:** verified current-code inventory and clear implemented/partial/missing/blocked status.

### Phase 1 — Identity, permissions, and selection foundation
Confirm one canonical asset identity and service owner. Confirm workspace/project membership and authorization. Certify selection IDs and primary-asset semantics. Define version/derivative relationships and mutation concurrency. Test identity stability, unauthorized access, stale updates, and invalid selections.

**Exit gate:** reusable, tested asset identity and selection contracts.

### Phase 2 — Workbench host and capability registry
Build or harden one adaptive host. Normalize capability definitions and eligibility rules. Route actions to canonical surfaces while preserving selection/navigation context. Support asset-type and multi-selection-aware availability. Add search, visibility preferences, favorites/pinning, and progressive disclosure after routing is stable.

**Exit gate:** one host routes supported actions without mini-app duplication or lost context.

### Phase 3 — Inspection and organization baseline
Make preview, metadata/technical inspection, tags, collections, search, and filtering reliable. Establish error, empty, loading, and permission states. Link asset details to lineage/history when data exists.

**Exit gate:** creators can find, inspect, and organize assets reliably.

### Phase 4 — Shared operation pipeline
Standardize validation, preview/confirmation, execution, status, retry/cancel semantics, receipts, and history. Support derivatives and batch operations through the same envelope. Connect outputs to lineage and handoff.

**Exit gate:** a representative operation per supported asset type uses the shared pipeline end to end.

### Phase 5 — Media capability packs
Add image crop/resize/conversion and derivative generation. Add focused video trim/reframe/frame/audio extraction, conversion, and proxy features as supported. Add audio trim/conversion/waveform capabilities as supported. Isolate processing dependencies and limit resources.

**Exit gate:** each shipped operation has real output, safe failure handling, tests, and provenance.

### Phase 6 — Compare, AI assistance, rights, and advanced processing
Add comparison and validation. Integrate AI suggestions with approval/provenance. Complete rights/license/usage/lifecycle workflows. Add advanced FFmpeg, duplicate analysis, and semantic discovery only when services, security, and resource controls are verified.

**Exit gate:** advanced capabilities are safe, explainable, permission-aware, and measurable.

### Phase 7 — Cross-system workflow and certification
Certify Vault ↔ Projects ↔ ContentBuild ↔ Asset Engine ↔ package handoff. Verify identity through create → retry → reopen → edit → handoff → return → package → publish. Verify Resource Library and Brain integrations do not create duplicate stores. Test real deployment and representative creator flows.

**Exit gate:** vertical slice works on canonical main and exact commit is verified.

### Phase 8 — Server trust, durable operations, and storage boundary
Bind asset reads/writes and operation execution to the authenticated account/workspace contract. Move authoritative operation receipts and queued job state to server-backed persistence with idempotency, cancellation, retry policy, resource limits, and per-workspace authorization. Verify durable media storage configuration. Do not substitute localStorage, UI-only guards, or an unauthenticated endpoint for server trust.

**Exit gate:** authorization tests prove cross-workspace denial; operation/job records survive process restart; retry/cancel/idempotency and storage failure behavior are verified. If the repository's account/workspace contract or production storage is not available, mark this phase BLOCKED rather than inventing a second auth system.

### Phase 9 — Safe batch execution and governed AI assistance
Run eligible batch items through the canonical operation/Asset Engine path with per-item receipts, partial-failure visibility, bounded concurrency, cancellation, source preservation, and lineage. Connect vision/tag suggestions only through an available approved provider; keep proposals separate from accepted metadata and preserve provenance. Rights findings are advisory and must not be represented as legal approval.

**Exit gate:** real supported processors produce derivatives, every output links to its source and operation, failed items can be retried safely, and AI suggestions are explicitly reviewed before applying.

### Phase 10 — End-to-end certification and release
Test the canonical lifecycle from asset creation through operation/retry, browser reload, edit, project/ContentBuild handoff, return, package assembly, and publication integration. Verify responsive and keyboard-accessible behavior, empty/error/loading states, logs/network behavior, exact-head tests/typecheck/build, live deployment, and post-merge target read-back. Track pre-existing failures separately but do not waive required gates silently.

**Exit gate:** required checks are green on the exact PR head, representative browser/runtime paths pass against the matching deployed commit, changes are merged, and the target branch is re-read and verified.

Required workflow: SEARCH → INSPECT → TEST → IMPLEMENT → VERIFY → DOCUMENT → MERGE → POST-MERGE VERIFY. Use test-first development for behavior changes. Do not mark work complete based on a plan, passing isolated mock tests, or a deployment unrelated to the verified commit.

## 13. Prior implementation/recovery evidence and provenance boundaries

### Canonical repository evidence
The canonical repository contains this master and docs/Vault.md, defining Vault as a reconstruction target and requiring runtime verification. This confirms documented architecture, not completion of all listed capabilities.

### Historical external Workbench claims
A previous conversation reported an implementation branch in cbrewsterthegreat/ViewTube, branch vault/adaptive-asset-workbench, with candidate files including:
- src/features/vault-workbench/capabilities.ts and tests
- src/services/vaultWorkspaceState.ts
- src/features/vault-workbench/AdaptiveVaultAssetWorkbench.tsx and tests
- src/features/vault-workbench/useVaultAdaptiveWorkbench.ts and tests
- src/features/vault-workbench/VaultAdaptiveWorkbenchHost.tsx and tests
- src/features/vault-workbench/VaultAssetInspectorPanel.tsx and tests
- src/features/vault-workbench/vault-adaptive-workbench.css

**Status: REPORTED / NOT VERIFIED AS CANONICAL.** Do not copy or claim these as current implementation until the source branch is accessible, authorized, and reconciled against canonical main.

The recovery also reported prior external pull requests for shared Workbench actions, navigation context, and handler behavior. These are useful leads, not proof that equivalent code exists in viewtube-dev/viewtube/main. Verify before porting or duplicating them.

A historical Render preview was reported as failed to build. That is historical deployment evidence and does not establish a Vault runtime defect or current deployment status.

### Unresolved questions
- What exact runtime source tree is canonical and active for the connected repository?
- Which asset repository/schema/service owns canonical identity?
- Is the historical adaptive Workbench branch accessible and authorized as a donor?
- Which action/navigation context primitives already exist on canonical main?
- What is the actual current Toolbox/SubToolbox host and component API?
- Which collection, project-membership, and derivative models already exist?
- Which media-processing dependencies are installed and supported in production?
- Which rights/retention/security requirements are implemented?
- What is the current canonical deployment and exact verified commit?

## 14. Architectural risks and optimization opportunities

| Risk / opportunity | Why it matters | Recommended control |
|---|---|---|
| Every capability becomes a separate mini-app | Duplicated UI and inconsistent behavior | One host, shared surfaces, capability registry |
| Parallel asset stores or identity services | Broken lineage and handoff | Extend canonical identity/service |
| Operations each implement their own lifecycle | Inconsistent retries, errors, history | Shared operation contract and receipt |
| Hard-coded tool UI bypasses primitives | Style and accessibility drift | Canonical Toolbox/SubToolbox primitives |
| AI overwrites approved assets | Loss of creator intent | Suggestions/variants by default; explicit approval |
| Derivatives lose source lineage | Untraceable outputs | Parent/source IDs and operation provenance |
| UI-only permission checks | Unauthorized service calls | Enforce permissions at service boundaries |
| Heavy processing runs unbounded | Reliability/cost/security risks | Queue/resource/time limits and safe failures |
| Package state duplicates ContentBuild/asset state | Conflicting sources of truth | Projections/snapshots and explicit sync contracts |
| External branch assumptions treated as canonical | Wrong code ported or duplicated | Verify donor provenance and compare current code |
| Catalog mistaken for completion | False project status | Require code/test/runtime evidence per tool |

## 15. Capability status register

Use this high-level status rule; do not fabricate per-tool completion:

- **Architecture and inventory:** DOCUMENTED in this master.
- **Canonical runtime mapping:** UNKNOWN until source files and symbols are inspected.
- **External adaptive Workbench code:** REPORTED / NOT VERIFIED IN CANONICAL REPOSITORY.
- **Individual tools:** UNKNOWN unless individually evidenced in a Tool Record.
- **Production/deployment status:** UNKNOWN until exact canonical commit and live service are verified.

After source inspection, maintain an evidence-backed table: ID | Capability | Status | Canonical source | Tests | UI entry | Dependencies | Gap | Next action. Keep that table current rather than duplicating this master into another inventory document.

## 16. Completion and change governance

A capability is not complete merely because it is listed, designed, stubbed, or implemented in an unmerged branch.

Completion requires:
1. Runtime implementation on canonical source.
2. Correct UI entry and capability routing.
3. Permission, state, error, and consequence behavior.
4. Relevant tests and runtime verification.
5. Merge to canonical main.
6. Post-merge verification against the resulting commit.
7. Updated Tool Record and recovery/work log where material.

Before changing this document or related source, fetch latest version and SHA. If the file changes during work, re-fetch and reconcile rather than overwriting. Preserve historical evidence and explicitly mark superseded decisions; do not erase conflicts silently.

## 17. Primary related documents

- docs/Vault.md — concise product/system overview.
- docs/recovery/handoffs/VIEWTUBE_VAULT_PROJECTS_CONVERSATION_RECOVERY_2026-10-04.md — recovered adaptive Workbench inventory, decisions, and historical claims.
- docs/governance/MASTER_SYSTEM_REBUILD_RESOURCE_PLAN.md — master-resource planning context.
- docs/governance/MASTER_SYSTEM_REBUILD_DEPENDENCY_MAP.md — cross-system dependencies.
- docs/product/VIEWTUBE_CREATOR_WORKSPACES_MASTER_TOOL_CONTEXT.md — creator-workspace context.
- docs/migration/reference/VAULT_TOOL_DONOR_REHARVEST_2026-09-24.md — historical donor research to inspect before rebuilding overlapping tools.
- docs/architecture/ASSET_ENGINE_CONTENTBUILD_IMPLEMENTATION_PLAN_2026-09-20.md — Asset Engine/ContentBuild planning context; verify against current code.

## 18. Final operating principle

**One canonical asset identity. One adaptive Workbench. Shared operation semantics. Reusable UI primitives. Explicit provenance. Evidence-backed implementation status.**

The catalog describes what Vault should support; runtime, tests, and verified deployment determine what Vault actually supports.
