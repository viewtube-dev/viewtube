# ViewTube Projects, Asset Engine & Publishing Package Component Systems — Master Design Plan

**Status:** Planning authority — design and implementation specification  
**Created:** 2026-10-13  
**Target integration branch:** `master/consolidated-feature-integration`  
**Working branch:** `docs/projects-asset-publishing-component-master-plan-2026-10-13`  
**Scope:** 20 reusable primitives, component families, compound layouts, and connected workbenches spanning Projects, ContentBuild, Asset Engine, Vault, publishing packages, Metadata Master, Video Manager/Publisher, Studio Hub, tool handoffs, Analytics/VT-SYNC, and Brain learning.  
**Implementation status:** These are plans, not a claim that all 20 components exist or are implemented. Existing runtime files and contracts must be inspected before each implementation; the paths below distinguish verified authorities from candidate integration points.

## 1. Executive direction

Build a coherent set of reusable UI manifestations over ViewTube's existing content lifecycle, not a second product architecture. The user-facing journey is:

**Project → ContentBuild revision → assets and generation receipts → Video/Publishing Package → approved publish snapshot → publication → Analytics/VT-SYNC checkpoint → outcome → reusable learning.**

The canonical learning loop is **Decision → Change → Exposure → Analytics → Outcome → Learning**. Components should make the current object, its state, its source, and its next safe action obvious. A visual card must not become a new data owner.

The twenty designs are: (1) Project Manifestation Panel, (2) Project Identity & Lifecycle Header, (3) Project Board & Calendar Card Family, (4) Project Brief & Planning Workspace, (5) Asset Engine Workspace Family, (6) Asset Slot / Variant / Version Selector, (7) Asset Lineage & Provenance Inspector, (8) Vault Asset Browser & Inspector, (9) Generation & Variant Comparison Workbench, (10) Publishing Package Summary Card, (11) Publishing Package Editor Layout, (12) Metadata Master Set Comparison Workbench, (13) Publication Readiness & Validation Panel, (14) Approved Publish Snapshot & Publication Status Timeline, (15) Video Manager Metadata Change & Revision Panel, (16) Universal Send-To & Handoff Composer, (17) Workflow Chain & Step Progress Family, (18) Decision / Change / Generation History Timeline, (19) Analytics Checkpoint & Outcome Evaluation Card, and (20) ContentBuild Lifecycle Map & Learning Loop.

## 2. Source-of-truth rules and inspected document set

This plan was prepared against the contents available on `master/consolidated-feature-integration`. Several older source documents carry stale “last audited main” or branch headers; their architecture is useful, but those headers are not evidence that the target branch has the same current runtime state. Implementation must confirm code on the target branch.

### Architecture and product sources reviewed

- `docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md` — cross-system project, ContentBuild, Video Package, publishing, Vault handoff, YouTube binding, analytics and learning boundaries.
- `docs/architecture/VIEWTUBE_ASSET_ENGINE_MASTER_RESOURCE.md` — asset versions/options, generation context and receipts, selection/finalization, provenance, packaging, handoffs and outcome attribution.
- `docs/architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md` — end-to-end lifecycle and the decision/change/exposure/analytics/outcome/learning loop.
- `docs/product/studio-hub/VIEWTUBE_PROJECTS_UI_MANIFESTATION_SYSTEM.md` — shared project UI manifestation layer and adapter/repository boundaries.
- `docs/product/studio-hub/METADATA_MASTER_IMPLEMENTATION_PLAN.md` — Metadata Master ownership and its CONTEXT → ANALYZE → GENERATE → COMPARE → OPTIMIZE → DECIDE → PACKAGE → HANDOFF workflow.
- `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md` and `docs/product/VIEWTUBE_STUDIO_HUB_TEN_TOOL_ARCHITECTURE.md` — tool roles, shared object contracts and common handoff expectations. Their branch/header metadata may be stale.
- `docs/brain/UNIVERSAL_TOOL_HANDOFFS_AND_SUGGESTED_CHAINS.md` — ViewTubeActionPacket, Send-To, chain builder/runtime boundaries and creator approval for external mutations.
- `docs/analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md` — canonical analytics consumers, VT-SYNC and window vocabulary.
- `docs/architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md` — Toolbox/SubToolbox geometry, primitive families, responsive and accessibility contracts.
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` — component catalog and primitive-correction authority.
- `docs/Index.md` — navigation and canonical-document rules.

The reviewed source set is the relevant architecture/document set identified for this plan, not a claim that every Markdown file in the repository has been individually audited. Before implementation, update the canonical owning document if a conflict is discovered; do not silently fork its contract.

### Canonical implementation authorities

**Toolbox/SubToolbox shell:** `src/components/subtoolbox/tokens.ts`, `src/components/Toolbox.tsx`, `src/styles/toolbox-system.css`, `src/styles/subtoolbox-system.css`, plus their contract tests.

**Standalone Studio controls:** `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`. Use these for canonical Studio controls. Do not create a competing primitive system in `src/components/subtoolbox/SubToolboxPrimitives.tsx` or `src/styles/subtoolbox-system.css`; those files serve the broader shell/subtoolbox system and are not a substitute for Studio Controls.

**Project manifestation:** `src/components/projects/ProjectManifestation.tsx` and `src/components/projects/projectManifestation.ts`; existing identity/repository/projection concepts include `ProjectContentIdentityService`, `ContentBuildRepository`, `PublishingPackageProjection`, and `VideoPackageRepository`. Confirm exact exported symbols and import paths in the target branch before wiring new UI.

**Handoff protocol:** `src/services/viewTubeToolChains.ts` defines the canonical ViewTubeActionPacket protocol. `SendToMenu`, `WorkflowChainBuilder.tsx`, and `workflowEngine.ts` are known integration points to reconcile with that protocol, not permission to introduce another runtime.

**Analytics:** consumers use `src/services/analytics-canon/`; VT-SYNC lives in `src/features/vt-sync-local/`; window vocabulary is in `src/services/analytics/windows.ts`. Confirm current exported APIs before coding.

### Non-negotiable implementation rules

1. One canonical data owner per domain. UI components project data; they do not create parallel project, asset, package, history, AI Brain, analytics, or workflow stores.
2. Reuse canonical Toolbox/SubToolbox shell, Studio Controls primitives, UI Reference Library tokens, and catalogued components. Extend a primitive or add a variant when that closes the gap; add a new primitive only after verifying no canonical equivalent exists.
3. Keep domain boundaries clear: Metadata Master coordinates package alternatives and decisions; Video Manager manages already-published videos and metadata changes; Video Publisher prepares and executes publication of an unpublished package; Thumbnail Studio owns thumbnail creation; Content Analysis interprets content; durable creator data remains with its canonical owners.
4. All destructive/external changes (especially live YouTube metadata changes, publish/schedule actions, and overwriting approved assets) require explicit creator confirmation and a visible preview/receipt.
5. Preserve provenance: project ID, ContentBuild ID/revision, asset/version/generation receipt, package ID/revision, handoff/action packet ID, publication identity, analytics window/source, and outcome links where applicable.
6. Do not hard-code shell dimensions into individual components. Existing shell geometry includes Main Toolbox 80px, SubToolbox/L0 56px, L1 48px, L2 32px; those are structural levels, not universal card or input sizes.
7. Use inherited SubToolbox palette pairs and canonical tokens. Do not add arbitrary palette overrides, duplicated shadows, hand-built controls, or isolated one-off CSS.
8. Keyboard navigation, semantic labels, focus visibility, ARIA states, contrast, touch targets, reduced-motion behavior, empty/loading/error/offline/stale states, and responsive overflow are requirements, not polish tasks.
9. Treat geometry below as a design contract expressed in ratios and token-relative constraints. Exact pixel measurements for cards, gutters and component internals are proposals to be validated against existing token values and actual page density before implementation.
10. Preserve the existing Studio Hub / Toolbox information architecture. Add these as reusable components and subtoolbox modules, not twenty new top-level tools.

## 3. Shared design language and data contracts

### Visual contract

- **Shell:** canonical Toolbox/SubToolbox hierarchy; use its existing level and responsive rules.
- **Panels:** shared panel/card recipes and tokenized borders, backgrounds, spacing, radius and elevation. Default to a single subtle border; no stacked borders or double shadows.
- **Typography:** inherit the canonical primitive's type ramp, weight, line height and stroke. Do not independently restyle a field or button in a compound component.
- **Controls:** use canonical Studio Controls and catalogued Toolbox controls. Selects, menus and popovers must visually attach to their trigger, inherit its width rules, and align their type sizing to the associated 44px / 28px control families where applicable.
- **Actions:** primary action is singular and explicit. Secondary actions use standard buttons; destructive actions require warning/confirmation. Generate, Analyze, Refine and Compare actions use existing split-left button families/variants where available rather than hand-built icon/button pairs.
- **Status:** use the existing status badge/tag, progress, metric and state-panel primitives. Color is paired with text/icon; never rely on color alone.
- **Density:** information first, controls second, provenance and advanced detail in expandable sections. Avoid oversized cards when a compact summary plus inspector is clearer.
- **Copy:** use direct labels and verbs: “Open project”, “Save version”, “Compare variants”, “Use this version”, “Prepare package”, “Review changes”, “Send to…”, “Publish”, “View results”. Clearly distinguish “saved”, “selected”, “approved”, “published”, and “measured”.
- **Responsive behavior:** wide desktop uses two-column workspace layouts when content supports it; narrower layouts stack primary content before inspector/actions; mobile keeps critical actions reachable and allows horizontal scrolling only for genuinely tabular comparisons.
- **Interaction states:** idle, hover, focus, pressed, disabled, loading, success, warning, error, empty, stale/out-of-date, pending approval, and partially available where meaningful.

### Shared domain envelope

Where applicable, components consume canonical identifiers and revisions rather than copying full domain objects: `projectId`, `contentBuildId`, ContentBuild revision, asset ID/version/variant/generation receipt, `videoPackageId` / package revision, publication/video ID, action packet/handoff ID, and analytics window/source IDs. The view model may join read-only projections from canonical repositories/services, but mutation commands must be sent to the owner service and returned with a receipt or error. Missing identifiers are shown as “not linked” rather than guessed.

---

## 4. The 20 component and compound-system specifications

## 1. Project Manifestation Panel

**Function and success vision.** A reusable project card/panel that loads and saves the active creator project and manifests its connected ContentBuild, selected assets, publishing package, status, and last-known activity. It is the shared entry point, not another project database or a miniature project editor.

**Back-end/domain integration.** Project identity service; ContentBuild selection/repository; package projection/repository; asset summary and handoff references. Use existing `ProjectManifestation` and adapter as the baseline. Preserve `projectId`, active selection, ContentBuild revision, package ID/revision, and callbacks/commands such as load/save. Resolve current APIs before extension.

**Front-end composition and reuse.** Compose existing panel/card, project thumbnail/media poster, status badge, metadata rows, primary/secondary buttons, and compact overflow menu. Add variants for compact list row, standard project card, and expanded inspector panel; do not fork a separate card implementation per page.

**Visual specification.** Standard card ratio approximately 1.55:1 in board/grid mode; compact row ratio is fluid with a fixed thumbnail region around 16:9. Header contains project title and one status badge. Main region has thumbnail/cover at left or above on narrow screens, two or three high-value metadata lines, and a compact linked-object strip. Footer holds one primary action and a secondary menu. Use one border, tokenized surface and radius, no nested shadow. Copy examples: “Open project”, “Resume ContentBuild”, “View package”. Keep secondary IDs in inspector, not on the face of the card.

**Behavior/states.** Loading skeleton preserves final geometry. Empty projects offer a single create/start action. Missing package/assets show “Not created” rather than fake completeness. Save/load errors retain prior UI state and surface retry. Switching project requires no silent overwrite of unsaved edits; prompt or use existing dirty-state policy.

**Code connections.** Verified UI baseline: `src/components/projects/ProjectManifestation.tsx`, `src/components/projects/projectManifestation.ts`. Connect through canonical project and package services. Candidate hosts include Projects, Project Board, Video Manager, Video Publisher and relevant Studio Hub tool subtoolboxes; confirm actual page modules before editing.

**Workflow/handoff integration.** A selected project supplies context to tools and Send-To packets. Opening a project must preserve identity across Studio Hub and publication flows. Handoff payload includes project/build/package references, not an embedded duplicate project.

**Data integrity and acceptance.** Test save/load round-trip, switching projects, missing IDs, stale revisions, keyboard activation, responsive card variants and the same project rendered consistently in at least two host tools.

## 2. Project Identity & Lifecycle Header

**Function.** A compact persistent header showing which project/build/package is active and where it sits in the lifecycle, reducing context loss between tools.

**Back-end integration.** Read canonical project identity, ContentBuild revision/status, package state and publication linkage. Derive stage from canonical data; do not store a second lifecycle status.

**Front-end and reuse.** Use title/description primitive, breadcrumb, status badge, segmented stage indicator or progress primitive, and standard action menu. Variants: compact toolbar, full workspace header, narrow/mobile header.

**Visual specification.** A horizontal header with a 70/30 content-to-actions balance on wide screens. Title and concise subtitle left; status plus two compact actions right. Lifecycle stages appear as a thin labeled stepper below, not a giant progress bar. Single divider at bottom; inherited shell background; truncation with accessible full title. Copy distinguishes “Draft”, “In progress”, “Ready for review”, “Approved”, “Published”, and “Outcome available” only when supported by canonical state.

**Behavior.** Stage click navigates only when that destination exists; completed does not mean approved. Show stale/out-of-date badge when current view is behind the owner revision.

**Code connections.** Compose ProjectManifestation and canonical shell primitives; derive state from project, ContentBuild and package services. Exact page consumers and status enums must be verified in branch code.

**Workflow.** Remains visible across project subtools and handoff destinations. It is the primary visual guard against editing the wrong project/package.

**Acceptance.** No duplicated lifecycle state; header changes correctly on project switch; accessible progress semantics; long names and small viewport do not hide the active identity.

## 3. Project Board & Calendar Card Family

**Function.** Shared project card family for board columns, timeline/calendar dates and compact schedule lists. Board and calendar views are different layouts over the same project identity, not separate project records.

**Back-end integration.** Project repository and planning/scheduling data; links to ContentBuild and publishing package; channel/calendar assignment. Do not treat a planned date as a scheduled/published event without an authoritative state.

**Front-end/reuse.** Extend Project Manifestation with variants: board card, calendar day card, agenda row, and drag-preview card. Reuse calendar primitives, status badges, compact metadata, thumbnail, and menus.

**Visual specification.** Board card is a vertical card with a 16:9 thumbnail occupying roughly one-third of its height; calendar card is date-first and compact, showing title plus one status indicator; agenda row is horizontal with date/time column and content. Avoid stuffing full descriptions or all metadata into a calendar cell. Show channel/platform icon only when linked. Drag affordance is subtle and never the only way to reschedule.

**Behavior.** Keyboard-accessible move/reschedule actions complement drag-and-drop. Schedule conflicts and invalid transitions show inline reasons. Empty dates remain uncluttered; overlapping entries collapse to a count/expand action.

**Code connections.** Reuse the canonical calendar component/system referenced by the Project Board toolbox and existing project planning code; identify exact current calendar module before implementation. Use project services, not local-only mock event state.

**Workflow.** Opens the same project/build in Project Manifestation; schedule handoff can flow to Publisher only when publication readiness and approval rules permit.

**Acceptance.** Board/calendar consistency, timezone correctness, keyboard scheduling, conflict messaging, responsive density, and no duplicate project identity across views.

## 4. Project Brief & Planning Workspace

**Function.** Structured planning surface for idea, audience, promise, format, objectives, channel, timing, constraints, and acceptance criteria before production begins.

**Back-end integration.** Canonical project brief/planning fields and ContentBuild initialization. Store edits through project owner service with revision tracking; do not create a shadow “brief database”.

**Front-end/reuse.** Use canonical title/description inputs, selects, tags, checkbox/toggle, segmented controls, collapsible sections, guidance panel and save-state indicator. Variants: guided setup, compact edit panel, read-only brief summary.

**Visual specification.** Two-column desktop layout: roughly 2/3 editable brief, 1/3 contextual guide or readiness checklist; stack on narrow screens. Group fields by creator task rather than technical schema. Labels sit above inputs; help text below; no labels embedded only as placeholders. Top row contains project title and save state. Optional fields are collapsed under “More planning details”.

**Behavior.** Autosave only if an existing canonical save policy supports it; otherwise explicit save. Unsaved status is visible. Validate required values inline and keep optional sections skippable.

**Code connections.** Project and ContentBuild services plus Studio Controls and Toolbox shell; exact form schemas and persistence modules must be confirmed before implementation.

**Workflow.** Completed brief seeds context packets for Asset Engine and Studio Hub tools. Later changes should appear as a decision/change event if the canonical history contract supports it.

**Acceptance.** Brief survives reload and tool handoff; fields are accessible; missing optional data does not block unrelated work; revision conflict offers reconcile/reload, not silent overwrite.

## 5. Asset Engine Workspace Family

**Function.** The common workspace shell for creating, organizing, generating, selecting and finalizing assets attached to a ContentBuild. It is a family of layouts, not a replacement for specialized asset tools.

**Back-end integration.** Asset Engine canonical asset/version/variant/generation receipt contracts, ContentBuild association, selected/finalized asset projection, package links and provenance. Generation provider calls remain with existing engines/services.

**Front-end/reuse.** Combine Project Identity Header, asset grid/list, selected asset preview, filter/sort controls, progress/state panels, generation form and inspector. Variants: browse, generate, review/select, and compact embedded asset section.

**Visual specification.** Desktop uses a 60/40 split between asset workspace and inspector; inspector can collapse. Grid tiles use a stable media ratio appropriate to asset kind (thumbnail 16:9, portrait 9:16, square 1:1, audio/document icon ratio). Selected state uses canonical focus/selection border, not a second shadow. Generation controls are grouped above/beside results, with one primary generation action and advanced controls collapsed.

**Behavior.** Distinguish generated, saved, selected, finalized and package-attached. Long-running generation exposes progress and receipt status. Retry creates a new generation attempt rather than erasing a previous successful version.

**Code connections.** Asset Engine services and current asset workspace/tool modules, ContentBuild repository and shared primitives. Exact runtime module names are to be discovered from imports and tests before implementation.

**Workflow.** Handoffs include asset ID/version and generation receipt. Approved asset selection updates the canonical projection consumed by Publishing Package, Thumbnail Studio, Video Publisher and other tools.

**Acceptance.** Asset ownership, retries, selection and finalization persist; unsupported asset types degrade gracefully; no parallel asset store or bespoke grid primitive is introduced.

## 6. Asset Slot, Variant & Version Selector

**Function.** A shared control to assign one asset or version to a named role—thumbnail, end screen, intro, script, video, caption, supporting image—or compare/select among variants.

**Back-end integration.** Canonical asset slots, asset/version IDs, variant family and selection/finalization commands. Enforce role/type compatibility through domain validation, not UI-only checks.

**Front-end/reuse.** Reuse media poster, dropdown/select, variant chips/tags, thumbnail preview, status badge and button primitives. Variants: inline slot picker, gallery picker, and version dropdown.

**Visual specification.** Slot row: role label and current selection at left, preview thumbnail or type icon center, “Choose version” control at right. Picker opens an anchored panel matching trigger width or a deliberate wider gallery overlay; menu styling and typography inherit canonical select/popover rules. Variants show preview, short name, version, status and date; provenance remains in details.

**Behavior.** Choosing a candidate previews the effect before finalizing. “Selected” and “Finalized” are separate. Incompatible types are disabled with an explanation. Replacing a package-bound asset prompts for impact review if required.

**Code connections.** Asset Engine asset/version selection service and shared select/gallery/panel primitives. Reuse the same slot selector in Asset Engine, Metadata Master where applicable, and Publisher package review.

**Workflow.** Selection updates the owner projection and informs package readiness. Handoff transmits the chosen asset/version, not merely a filename or URL.

**Acceptance.** Type validation, persistence, keyboard picker navigation, missing/deleted asset handling, and explicit finalization behavior are covered.

## 7. Asset Lineage & Provenance Inspector

**Function.** Explain where an asset came from, how it changed, which prompt/input/engine produced it, which versions relate to it, who selected it, and which package/publication/outcome used it.

**Back-end integration.** Asset Engine provenance and generation receipts; ContentBuild revision; package association; handoff/action packet; publication and analytics references where available. Show unavailable links as unknown, not inferred facts.

**Front-end/reuse.** Inspector drawer/panel, timeline, definition list, badge/tag, link button, collapsible raw receipt details. Variants: compact provenance summary and full lineage inspector.

**Visual specification.** Inspector is a right-side panel on wide desktop and a full-height drawer/sheet on narrow layouts. Summary section first: asset name, type, current version and state. Below, chronological lineage with each event as a compact row: event type, timestamp, actor/engine, version and link. Raw IDs and receipt payloads are secondary, copyable technical details. Avoid large dense JSON by default.

**Behavior.** Events are append-only display entries; edits do not rewrite history. Broken references display a warning and can be retried/refreshed. Long histories paginate or virtualize.

**Code connections.** Asset provenance/receipt services and shared inspector/timeline primitives. Exact event schema and current lineage readers must be confirmed before implementation.

**Workflow.** Inspector links to the generating tool, ContentBuild, package and downstream outcomes. Send-To can pass lineage references to a compatible tool.

**Acceptance.** Provenance fields are evidence-backed, missing data is explicit, history is stable and accessible, and users can distinguish “created by” from “currently selected for”.

## 8. Vault Asset Browser & Inspector

**Function.** Search and retrieve existing creator assets from Vault, preview metadata and provenance, and attach/reuse an asset in the active project/build without creating a second file library.

**Back-end integration.** Canonical Vault and Asset Engine asset sources, permissions/availability, tags/search, project associations, versions and import/attach commands. Verify actual Vault APIs before building.

**Front-end/reuse.** Reuse shared search input, filter chips, media grid/list, thumbnail, selection checkbox, inspector and state panel. Variants: browse-only, choose-to-attach modal, and embedded Vault subtoolbox.

**Visual specification.** Search and filters at top; results grid/list in main area; inspector at right on desktop. Each tile shows preview, short name, asset type and one status. Keep filters collapsible on small screens. Selection mode has a fixed footer with count and “Attach selected” action; the action is disabled until selection is valid.

**Behavior.** Search, sort, type filter, multi-select and preview must preserve current project context. Attaching creates a relationship through the canonical owner, not a file copy unless the domain command explicitly requires one. Unavailable/permission-denied assets remain distinguishable.

**Code connections.** Existing Vault browser and Asset Engine services; canonical Toolbox and Studio controls. Find and reuse actual Vault module names before editing.

**Workflow.** Can receive a project/build context through handoff, and returns asset references plus version/provenance to the caller.

**Acceptance.** No duplicate asset record on attach, stable search and filters, empty/offline/error states, accessible multi-select, and correct permission behavior.

## 9. Generation & Variant Comparison Workbench

**Function.** Compare multiple generated candidates or versions against the same brief and criteria, then select, reject, refine or send a candidate onward with traceable reasons.

**Back-end integration.** Generation receipts, variant groups, prompt/input context, scoring/analysis output, asset selection commands and decision/change history. Scoring is advisory unless the owning service explicitly defines an automated gate.

**Front-end/reuse.** Candidate cards, media preview, segmented view (grid/side-by-side), score/criteria rows, comparison table, refine/analyze split-left actions and decision buttons. Reuse standard split-left primitives; no hand-built duplicate action buttons.

**Visual specification.** Default 3-up comparison on wide screens; 2-up on medium and 1-up on narrow. All candidates share equal preview dimensions and aligned metadata rows. Side-by-side mode synchronizes preview sizing and keeps criteria rows aligned. Use badges for “current”, “recommended”, “selected” and “rejected”; recommendation must not imply approval. Primary action “Use this version”; secondary “Refine” and “Inspect source”.

**Behavior.** Candidate differences and scoring basis are visible. Selection creates a durable decision/selection record. Regeneration adds candidates without silently removing prior candidates. Keyboard can move focus among candidates and activate compare/select.

**Code connections.** Asset Engine generation/variant services, Metadata Master comparison logic where the compared objects are metadata sets, canonical card/table/control primitives. Share the comparison layout, not the domain-specific scoring model.

**Workflow.** Selected candidate becomes the slot/package asset or Metadata Master candidate and its receipt follows handoff.

**Acceptance.** Equal comparison geometry, reproducible candidate identity, selection persistence, evidence behind recommendations and no accidental destructive overwrite.

## 10. Publishing Package Summary Card

**Function.** A compact canonical snapshot of a Video/Publishing Package showing readiness, selected assets, metadata-set status, revision and next action.

**Back-end integration.** PublishingPackageProjection, VideoPackageRepository and canonical package revision/status; ContentBuild identity; selected asset references; publication linkage if already published.

**Front-end/reuse.** Project card variant, metadata summary rows, status badge, progress indicator, thumbnail poster and action menu. Variants: compact list, full card and embedded package summary.

**Visual specification.** Horizontal card in lists, approximately 3:1 ratio; grid version around 1.5:1. Leading thumbnail; middle contains title, revision/status and two-line summary; trailing actions align vertically. Readiness indicator is a labeled status plus concise missing-item count, not a misleading percentage unless computed canonically.

**Behavior.** Summary refreshes when package revision changes. Stale projections show “Updated elsewhere — refresh”. “Open package” is safe; “Publish” is shown only to authorized, ready states and still requires confirmation.

**Code connections.** Canonical package projection/repository and Project Manifestation. Exact service signatures and package state enums must be verified.

**Workflow.** Links package to Publisher, Metadata Master, selected assets, approved snapshot, publication and Analytics.

**Acceptance.** Summary matches package detail, stale states are detectable, no duplicated package data is stored, and action visibility follows canonical permissions/readiness.

## 11. Publishing Package Editor Layout

**Function.** The main workspace to assemble and edit an unpublished package, preserving current content creation workflows while providing a clear metadata-and-assets publication form.

**Back-end integration.** Canonical package repository/projection, saved metadata sets, selected thumbnail/video/other assets, ContentBuild revision, validation and approval commands. Distinguish draft working state from approved publish snapshot.

**Front-end/reuse.** Use Project Identity Header, package summary, shared metadata field primitives, media upload/preview where Publisher supports it, title/description/tags/category/playlist controls, secondary visibility/audience/timestamp/location/community/AI-use controls, and readiness panel. Respect the canonical metadata order from existing Publisher/Manager plan: video/upload area where relevant, title, thumbnail, small secondary visibility/audience/timestamps, description, optional location, playlists, optional community, optional AI use, tags, category. Manager specifically must not have video upload; this design is Publisher/package editor only.

**Visual specification.** Desktop main form approximately 2/3 width with a 1/3 sticky package/readiness summary. On narrow screens, form first, summary as collapsible section. Fields use canonical type sizing/weights and label placement; avoid oversized secondary controls. Playlist uses a connected dropdown, location uses a combo input with suggestions, audience/AI-use/community use the agreed yes/no toggle style, and tags use the ranked/color tag component plus Add Tags primitive. Education category reveals the timestamped questions/phrases textarea with format validation. No old “9 playlists” or “13 category” placeholder UI.

**Behavior.** Save draft, compare/apply metadata set, validate, and approve are separate actions. Preserve last-edited input state and offer explicit re-apply-last-save where supported. No silent publish or metadata application.

**Code connections.** Video Publisher package/metadata persistence modules, canonical controls and package repository. Existing Create/Write workflow remains separate from the metadata publication page; do not delete or fold its generator into this form. Verify actual page/component paths and saved-field schema before changes.

**Workflow.** Receives package from Project/ContentBuild/Metadata Master; sends approved snapshot to publication flow; post-publish tracking links publication and analytics.

**Acceptance.** Reload persistence, canonical field order, no duplicate controls, form validation, dirty-state protection, explicit approval, and correct boundary from Video Manager.

## 12. Metadata Master Set Comparison Workbench

**Function.** Generate, compare, optimize, select and package coherent alternative metadata sets, instead of competing with Publisher or Manager as a separate publishing executor.

**Back-end integration.** Metadata Master workflow and package context; analytics and goals as evidence inputs; title/description/tags/category/thumbnail references; scoring and decision receipts. Does not mutate live YouTube metadata itself.

**Front-end/reuse.** Context panel, criteria selector, set cards, side-by-side field comparison, ranked tag list, analysis result panel, choose/optimize/package actions. Reuse comparison workbench layout and canonical metadata primitives.

**Visual specification.** Top context strip (project/package, goal, audience, evidence window), followed by 2–4 metadata set cards. Each card aligns the same fields in the same order; long descriptions can expand, tags wrap consistently, and score rationale is visible below score. Avoid rainbow scores: use standard semantic status/score tokens and textual rationale. Main action “Use this set in package”; never label it “Publish”.

**Behavior.** Generate creates a new candidate set with provenance; compare does not mutate package; apply writes a new package revision or selected set via owner service after explicit confirmation. Score confidence and evidence freshness are shown.

**Code connections.** `docs/product/studio-hub/METADATA_MASTER_IMPLEMENTATION_PLAN.md` is the role/flow authority. Connect existing Metadata Master implementation and canonical package/analytics services; exact runtime paths must be inventoried before editing.

**Workflow.** Flow: CONTEXT → ANALYZE → GENERATE → COMPARE → OPTIMIZE → DECIDE → PACKAGE → HANDOFF. Handoff contains selected set and evidence IDs.

**Acceptance.** Coherent sets are compared field-for-field; applying creates a traceable revision; no direct live-channel mutation; stale analytics is disclosed.

## 13. Publication Readiness & Validation Panel

**Function.** Explain whether a package can be safely submitted for publication and exactly what remains to fix, without making readiness a vague score.

**Back-end integration.** Canonical package validation rules, required-field schemas, asset checks, platform/channel constraints, approval state and permission checks. Validation service is authoritative; UI only renders results.

**Front-end/reuse.** State panel, checklist rows, badges, progress only if defined, inline field links, and grouped errors/warnings/information. Variants: compact readiness badge/popover and full validation panel.

**Visual specification.** Summary at top (“Ready”, “Needs attention”, “Blocked”); next show blockers, then warnings, then optional recommendations. Each row has a status icon, concise explanation and “Fix” link. Do not use a large green score to obscure a blocker. Single panel border; errors include text, icon and field location.

**Behavior.** Validate can run on demand and after meaningful edits. Results carry the revision they validated; if package revision changes, mark old results stale. “Fix” navigates/focuses the relevant field. A ready result still does not bypass creator approval.

**Code connections.** Package validation service and shared state/checklist primitives. Validation schema paths and platform rules must be discovered and referenced, not duplicated in React.

**Workflow.** Used by Publisher and package editor; Metadata Master can read warnings; approved snapshot requires validation against the same package revision.

**Acceptance.** Stale result detection, accessible error navigation, deterministic rules, no false “ready” on missing data, and tests for blocker/warning/valid transitions.

## 14. Approved Publish Snapshot & Publication Status Timeline

**Function.** Preserve the exact package revision and metadata/assets the creator approved, then show publication lifecycle events and reconcile them with actual platform state.

**Back-end integration.** Approved snapshot/receipt, package revision, publication attempt, platform video ID, publish/schedule state, reconciliation results and audit history. Use existing canonical package/publish records.

**Front-end/reuse.** Snapshot summary, locked field previews, event timeline, status badges, receipt details and “view current package” link. Variants: approval confirmation summary, post-publish status panel, and audit view.

**Visual specification.** Top strip with snapshot ID/revision, approval time and approver. Read-only metadata summary follows canonical field order; differences from current working draft use an explicit “Draft differs from approved snapshot” banner. Timeline rows align event time, event/status icon and event description. Raw IDs remain secondary/copyable.

**Behavior.** Snapshot is immutable in the UI. New edits create a newer draft/revision, not mutate the approved record. Platform publish failures and reconciliation discrepancies are shown distinctly from local success.

**Code connections.** Package approval/publishing services, canonical audit/event model and platform adapter. Confirm current snapshot and publication reconciliation modules in branch source.

**Workflow.** Starts from Publisher approval, then tracks submit/schedule/publish/reconcile and links to Analytics when a platform identity is known.

**Acceptance.** Snapshot is reproducible, approved content is immutable, failed attempts remain visible, and local versus platform-confirmed status cannot be confused.

## 15. Video Manager Metadata Change & Revision Panel

**Function.** Safely manage metadata of already-published videos, showing proposed changes, current values, history and observed performance context. Video Manager is not an upload tool.

**Back-end integration.** Existing published video/channel binding, canonical metadata read/write, revision/audit records, analytics evidence and approval/confirmation receipts. All external mutation flows through the current platform adapter.

**Front-end/reuse.** Reuse metadata fields and order from Publisher but render published-video context; add before/after comparison, change summary, revision history and confirm panel. No video upload field. Keep visibility/audience/timestamps as compact secondary fields; no numbered control labels and no publishing controls above title/thumbnail.

**Visual specification.** Left/main form around 65%, right context/history around 35% on wide screens. At top show published video identity, current platform status and last sync time. For each changed field, show current value and proposed value with a textual “Changed” indicator. Main CTA “Review changes”; separate final “Apply to YouTube” confirmation. No silent write on blur or generation.

**Behavior.** Draft changes are local/persisted according to canonical policy until reviewed. Show conflict when remote values changed since last fetch. On apply, show pending, confirmed or failed result with receipt and retry policy.

**Code connections.** Existing Video Manager, shared metadata subtoolbox and canonical platform/analytics services; verify exact code paths. Reuse package/metadata fields without importing Publisher-only upload behavior.

**Workflow.** May receive a new metadata set from Metadata Master, but application remains explicit. Subsequent analytics checkpoints link the revision/change receipt to exposure/outcomes.

**Acceptance.** No upload control; before/after diff is correct; remote conflict and API failure paths are safe; mutation requires explicit confirmation.

## 16. Universal Send-To & Handoff Composer

**Function.** Let any tool pass a project, asset, metadata set, package or analysis result to another compatible tool with clear payload, context and intended action.

**Back-end integration.** Canonical `ViewTubeActionPacket` protocol in `src/services/viewTubeToolChains.ts`, SendToMenu foundation and existing tool capability contracts. Do not create another handoff format or workflow runtime.

**Front-end/reuse.** Standard Send-To menu, destination list, context preview, payload chips, compatibility/status hints, confirm action and receipt panel. Variants: inline menu, full handoff composer and compact handoff receipt.

**Visual specification.** Menu is anchored to trigger and shares its alignment/typography. Full composer is a two-column desktop panel: payload/context at left, destination and expected result at right; stacks on narrow screens. Each destination shows tool name, purpose and compatibility, not a decorative icon alone. Preview packet contents in readable labels; raw JSON is advanced/copyable.

**Behavior.** Incompatible destinations are disabled with explanation. User can inspect and remove optional context fields where policy permits. External mutations require creator approval. On success, return handoff ID, destination, accepted/rejected status and next-step link.

**Code connections.** `src/services/viewTubeToolChains.ts`, existing `SendToMenu`, tool registration/capability sources and shared menu/panel primitives. Reconcile `WorkflowChainBuilder.tsx` and `workflowEngine.ts` with canonical packets.

**Workflow.** Connects Projects, Asset Engine, Metadata Master, Publisher/Manager, Studio Hub and Analytics; packets carry IDs/revisions/receipts, not cloned objects.

**Acceptance.** Packet schema is validated; incompatible handoffs explain why; receipts are durable; approval gates are enforced; no parallel workflow runtime is introduced.

## 17. Workflow Chain & Step Progress Family

**Function.** Visualize and run supported multi-tool chains with ordered steps, prerequisites, handoff data and clear recovery when a step fails.

**Back-end integration.** Existing workflow engine/chain builder and canonical ActionPacket contract, step status/receipt, retry/idempotency rules, and approval boundaries.

**Front-end/reuse.** Stepper, compact chain card, progress/state panel, tool icon/label, dependency marker, retry button and receipt detail. Variants: embedded chain preview, full builder canvas/list and run-progress timeline.

**Visual specification.** Default linear list/stepper rather than an unbounded flowchart. Each step shows ordinal, tool/purpose, state, concise input/output summary and action. Branches/dependencies use clear connector lines and labels; no color-only state. Builder can use a node layout only if keyboard/screen-reader ordering remains meaningful. Keep controls grouped in the row.

**Behavior.** Distinguish pending, ready, running, blocked, awaiting approval, succeeded, failed and skipped. Retry uses canonical idempotency rules; completed steps are not replayed blindly. Chain edits are distinct from execution of a saved chain.

**Code connections.** `WorkflowChainBuilder.tsx`, `workflowEngine.ts`, `src/services/viewTubeToolChains.ts` and shared stepper/state primitives. Confirm module paths and current runtime contracts before modification.

**Workflow.** Chain steps may include project preparation, asset generation, metadata comparison, package validation, creator approval, publishing and analytics review, but must honor each tool's ownership.

**Acceptance.** Failure and resume behavior are explicit; packets/receipts link across steps; no accidental duplicate publication; accessible linear navigation exists even for branched chains.

## 18. Decision, Change & Generation History Timeline

**Function.** Provide a unified read-only chronological view of meaningful changes and decisions for a project/build/package: edits, generated candidates, selected versions, handoffs, approvals and publication events.

**Back-end integration.** Existing history/audit/event contracts across project, asset, package, handoff and publication domains. This component aggregates evidence; it is not a new event store.

**Front-end/reuse.** Timeline rows, event badges, actor/engine label, expandable diff/receipt and filter chips. Variants: compact recent activity and full audit timeline.

**Visual specification.** Vertical timeline with narrow date/time rail and wider event content. Group adjacent events by day; collapse repeated low-value generation logs by default but retain counts and access to details. Each entry shows action, actor/source, affected object, revision and “View details”. Before/after changes use aligned diff rows.

**Behavior.** Filters do not change underlying records. Pagination and stable sorting support long histories. Missing or late-arriving events are labeled. Editing a record never erases the original event.

**Code connections.** Canonical domain history/receipt services and shared timeline/inspector primitives; map source APIs before implementation. Do not create a generic local history table to fill missing event coverage.

**Workflow.** Opens from Project, Asset, Package, Manager and Publisher. History entries link to the tool and object that owns the change.

**Acceptance.** Source links and timestamps are trustworthy, diffs are readable, long histories remain performant, and unsupported history categories are disclosed.

## 19. Analytics Checkpoint & Outcome Evaluation Card

**Function.** Tie a publication or metadata/creative change to a defined analytics window, evidence set, observed outcome and interpretation—without presenting correlation as proof of causation.

**Back-end integration.** Canonical Analytics consumers in `src/services/analytics-canon/`, VT-SYNC in `src/features/vt-sync-local/`, window vocabulary in `src/services/analytics/windows.ts`, publication/change exposure IDs and outcome attribution contracts.

**Front-end/reuse.** Metric card, window selector, source/freshness badge, trend visual where a canonical chart is available, checkpoint summary and “View evidence” link. Variants: compact checkpoint, evaluation detail and comparison across windows.

**Visual specification.** Header names the video/change and evaluation window. Show at most three primary metrics initially; secondary metrics expand. Every value has a label, unit, date range and source/freshness indicator. Avoid unsupported composite scores. Use existing Analytics Data Visuals registry rather than inventing chart styling. The interpretation block separates observed facts from hypothesis/recommendation.

**Behavior.** Window and source changes refresh data through canonical services. Missing data is “not available” rather than zero. Stale sync shows timestamp and refresh status. Comparisons require aligned windows or a clear explanation.

**Code connections.** Analytics-canon, VT-SYNC and shared metric/state primitives. Exact query/aggregation APIs and chart registry contracts must be confirmed in source.

**Workflow.** Used after publication and in Metadata Master/Brain feedback. Each evaluation points to the relevant change, exposure and publication IDs where evidence exists.

**Acceptance.** Metrics match canonical analytics outputs; windows are explicit; freshness is visible; no second analytics truth store or causal overclaim is introduced.

## 20. ContentBuild Lifecycle Map & Learning Loop

**Function.** A compact end-to-end map of a piece of content from idea through planning, assets, package, approval, publication, measurement and reusable learning. It explains dependencies and gaps; it is not a second workflow engine.

**Back-end integration.** Project/ContentBuild/package canonical identity and revision, asset lineage, handoff receipts, approved snapshot, publication identity, analytics checkpoints and learning records. Derive each stage from owner systems.

**Front-end/reuse.** Lifecycle stepper/map, stage status badges, linked object summaries, missing-link callouts, decision/change history, outcome card and “Next recommended action”. Reuse all prior components instead of creating bespoke versions of their cards.

**Visual specification.** Desktop shows a left-to-right lifecycle rail with 6–8 named stages and a linked detail panel for the selected stage. Narrow layout becomes a vertical stepper. Stage nodes use label + state + one compact datum; selected stage shows linked records, missing requirements and next action. Completed, approved and published states are distinct. Use a subtle connector line; no decorative animation that obscures state.

**Behavior.** Clicking a stage navigates to its canonical tool/object. Missing links identify the owning system and safe repair action. Recommendations explain the evidence and can be dismissed; any action that mutates or publishes still requires explicit confirmation.

**Code connections.** Composition layer over Project Manifestation, Asset Engine workspace, package summary/editor, approval timeline, handoff receipt and Analytics checkpoint. Reuse canonical domain readers rather than deriving a shadow lifecycle database.

**Workflow.** Embeds in Project and Studio Hub, and supports Brain learning from decision → change → exposure → analytics → outcome → learning. Learned guidance should reference source evidence and context; it must not auto-apply live metadata or publish.

**Acceptance.** Lifecycle is consistent with owner records; every stage links to a canonical object/tool; missing states are actionable; analytics/outcomes retain attribution; no duplicate workflow or history store is created.

---

## 5. Integration matrix

| Component | Primary owner(s) | Canonical UI building blocks | Key connected surfaces |
|---|---|---|---|
| 1 Project Manifestation | Projects / project identity | card, media poster, status, buttons | Projects, Board, Manager, Publisher, Studio Hub |
| 2 Identity & Lifecycle Header | Projects / ContentBuild / package projection | header, breadcrumb, badge, stepper | All project-aware workspaces |
| 3 Board & Calendar Family | Projects / planning | calendar, card, agenda row, menu | Projects, Project Board, scheduling |
| 4 Brief & Planning Workspace | Projects / ContentBuild initialization | fields, selects, tags, collapsible panels | Project Builder, Asset Engine context |
| 5 Asset Engine Workspace | Asset Engine | grid, preview, inspector, progress | Vault, Studio tools, package |
| 6 Asset Slot / Variant Selector | Asset Engine | select, media tile, tags, preview | Asset Engine, Metadata Master, Publisher |
| 7 Provenance Inspector | Asset Engine / receipts | inspector, timeline, badges | Vault, Asset Engine, package, analytics |
| 8 Vault Browser | Vault / Asset Engine | search, filters, grid, inspector | Project, ContentBuild, tools |
| 9 Generation Comparison | Asset Engine / Metadata Master domain logic | candidate cards, comparison table, split buttons | Generation tools, package |
| 10 Package Summary | Publishing Package projection | card, status, thumbnail, progress | Projects, Publisher, Metadata Master |
| 11 Package Editor | Publishing Package / Publisher | canonical metadata fields, readiness | Video Publisher, Project |
| 12 Metadata Set Comparison | Metadata Master | field comparison, ranked tags, score rationale | Metadata Master, Publisher |
| 13 Readiness Panel | package validation | checklist, state panel, field links | Publisher, package editor |
| 14 Approved Snapshot Timeline | package/publishing owner | read-only summary, timeline, receipt | Publisher, publication status |
| 15 Manager Revision Panel | published-video/platform metadata | canonical fields, diff, history | Video Manager, Analytics |
| 16 Send-To Composer | ActionPacket/handoff protocol | menu, payload chips, receipt | All compatible tools |
| 17 Workflow Chain Family | existing workflow runtime | stepper, progress, receipt | Studio Hub, Brain, handoffs |
| 18 History Timeline | existing domain events/receipts | timeline, diff, filters | Project, asset, package, tools |
| 19 Analytics Checkpoint | Analytics/VT-SYNC | metric cards, window selector, evidence | Analytics, Manager, Brain |
| 20 Lifecycle Map | composition only; no new data owner | stepper/map, linked summaries | Projects, Studio Hub, Brain |

## 6. Implementation sequence and gates

### Phase A — Verify contracts and shared composition
1. Inspect the target branch for the exact current ProjectManifestation props, identity/repository/projection contracts, asset/package types, handoff packet schema, analytics APIs and relevant tests.
2. Map each proposed component to an existing canonical primitive/component in the UI Reference Library and Component Library source of truth.
3. Record any unresolved conflict in the canonical owning document; do not invent missing API signatures or status enums.
4. Establish shared view-model types only where they are presentation projections and do not duplicate durable state.

**Gate:** each design has a verified owner service, a reuse map, and an identified host location.

### Phase B — Projects and assets
Implement 1–9 in order: identity/panel first, then planning/board, then asset workspace, slots, provenance, Vault integration and comparison. Prefer extension/variants over net-new primitives. Each component must work both standalone and embedded.

**Gate:** project/build/asset identity and revision round-trips work; provenance and selection are traceable; responsive and keyboard interaction checks pass.

### Phase C — Packages and metadata
Implement 10–15: package summary, package editor, Metadata Master comparison, validation, immutable approved snapshot timeline and Manager revisions. Preserve the distinct Publisher/Manager responsibilities and current Write/Create split.

**Gate:** package persistence, metadata order, explicit approval, external mutation receipts, stale revision handling and platform reconciliation are demonstrated.

### Phase D — Tool integration and handoffs
Implement 16–18 against the canonical ActionPacket and existing workflow runtime. Connect tool capability declarations and receipt IDs; do not make a second orchestrator or generic history database.

**Gate:** compatible and incompatible handoffs are tested; failure/retry is safe; chain resume does not repeat external mutations; history links resolve to owner records.

### Phase E — Analytics and learning
Implement 19–20 using canonical analytics and lifecycle projections. Keep observed facts, hypotheses and recommendations visibly distinct.

**Gate:** analytics values and windows match canonical sources; attribution links survive revisions and publication; Brain learning is evidence-linked and never silently applies changes.

### Phase F — Certification and release readiness
For every component, complete:
- unit/contract tests for props, state and owner-service calls;
- integration tests for project/build/package identity and persistence;
- accessibility checks for keyboard, focus, ARIA, contrast, labels and reduced motion;
- responsive checks at the actual Toolbox/SubToolbox breakpoints;
- visual comparison against canonical tokens and existing primitives;
- empty/loading/error/offline/stale/conflict states;
- CSS audit for duplicate selectors, one-off tokens, stacked borders and double shadows;
- documentation links and UI Reference Library catalog entries;
- a final UI audit that records reused vs extended vs new primitives.

Do not declare complete based solely on compilation or a screenshot. Record checks actually run and remaining gaps; do not claim tests/builds passed unless executed.

## 7. Acceptance criteria for the whole system

The master plan is considered implemented only when all of the following are true:

1. All 20 designs have a canonical owner, a code integration map, a component reuse decision and a testable acceptance contract.
2. Project, ContentBuild, asset, package, publication, handoff and analytics identities remain linked end-to-end.
3. Saved state is durable through reload and navigation where the canonical owner promises persistence; unsaved/dirty/stale states are visible.
4. Generated candidates, selected/finalized assets, metadata sets and approved snapshots are distinguishable and traceable.
5. Video Manager edits published videos only; Video Publisher prepares/publishes unpublished packages and retains its separate Write/Create workflow.
6. Metadata Master coordinates coherent alternatives and decisions but does not mutate live channel metadata or execute publication.
7. All external mutations require explicit creator confirmation and return a visible receipt or actionable failure.
8. Handoff uses ViewTubeActionPacket and existing chain/runtime contracts; no parallel workflow engine.
9. Analytics reads canonical services and explicit windows; no parallel analytics store and no unsupported causal claims.
10. Every visual element uses canonical shell/primitive tokens or a documented, reviewed new variant; no hard-coded copies of standard primitives.
11. Accessibility, responsive behavior and all major UI states are tested and documented.
12. The canonical docs and UI Reference Library are updated as implementations land, with code links and actual validation evidence.

## 8. Risks and decisions to resolve during implementation

- **Stale document metadata:** some architecture files say “last audited main” or mention another branch. Treat their contracts as guidance and verify the current integration branch.
- **Unknown runtime symbols:** the source docs identify canonical concepts and some verified paths, but exact service exports, validation schemas and host pages must be checked before imports are added.
- **Projection vs mutation:** UI should read a unified projection but send writes to the domain owner. Never let a card or view model become an accidental source of truth.
- **Overloaded workbenches:** use compact summary + inspector, progressive disclosure and shared variants; do not show every field in every context.
- **Misleading readiness/analytics:** show rule-specific blockers and source/window metadata. Avoid ungrounded “score” percentages or causal language.
- **Accidental publication:** keep draft, selected, approved, submitted, scheduled, published and platform-confirmed states separate; preserve confirmation gates.
- **Design-system divergence:** shell geometry, standalone control geometry and content card dimensions are different concerns. Reuse the right authority and do not make a new universal sizing scale for the whole UI.
- **Scope creep:** this plan defines 20 component designs. It does not authorize wholesale merges, changes to `main`, edits to frozen primitive catalog files, or implementation without per-phase ownership/contract verification.

## 9. Canonical documentation follow-through

As components are implemented, update the owning documents rather than maintaining competing summaries:
- Projects/ContentBuild/Video Package workflow authority for identity and lifecycle changes.
- Asset Engine master resource for assets, versions, variants, receipts and lineage.
- Metadata Master implementation plan and Publisher/Manager persistence/controls plans for metadata/package behavior.
- Universal Tool Handoffs and Suggested Chains for ActionPacket and workflow integration.
- Analytics/VT-SYNC master resource for checkpoints, windows and outcome attribution.
- Toolbox UI Master Resource and Studio Hub Component Library source of truth for primitives, variants, visual contracts and audits.
- `docs/Index.md` only if this new plan needs to be surfaced as a canonical navigation entry after review/acceptance.

**Planning deliverable boundary:** this document defines the design and implementation plan. It does not claim the 20 designs have been implemented, tested, or deployed.
