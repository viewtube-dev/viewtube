# ViewTube Hidden / Underexposed Capabilities — Source Resource & Exposure Roadmap

**Repository:** [viewtube-dev/viewtube](https://github.com/viewtube-dev/viewtube)  
**Implementation target:** `master/consolidated-feature-integration`  
**Purpose:** Source-backed inventory of high-value existing capabilities that may be underexposed, disconnected, partial, or missing a discoverable UI. This is an audit resource, not a declaration that all 25 items are currently hidden or complete.

## How to use this resource

For each candidate, verify on the target branch: (1) implementation exists, (2) an active caller reaches it, (3) a user-facing route/control exists, (4) state and results are wired correctly, and (5) tests/runtime behavior support exposure. Classify as **A hidden and functional**, **B UI disconnected**, **C partial**, or **D legacy/duplicate/unsafe**. Only A/B items should be described as “hidden” after verification. C items need a completion plan; D items should not be exposed.

**Architecture guardrails**
- Extend canonical owners; do not create a second Brain runtime, context store, evidence store, project store, or capability registry.
- Keep raw user input unchanged. Displayed evidence must be from the exact evidence pack supplied to the turn and retain canonical IDs.
- Do not invent confidence, metrics, readiness, model identity, receipts, saved state, or success.
- Tool handoffs are review-only unless an existing approved-action contract says otherwise. Retry generation only; never replay external side effects automatically.
- Build UI from real Studio primitives and canonical tokens. Catalog specimens must import production exports.
- Public-channel/no-key paths must state what data is unavailable and must not disguise fixture or degraded data as live data.

## Priority 25

### 1. Channel Intelligence Engine
**User value:** One coherent view of channel patterns, videos, audience, and recommendations.  
**Likely code footholds:** [BrainContextBroker.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainContextBroker.ts), [BrainOrchestrator.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainOrchestrator.ts), [BrainCapabilityRegistry.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainCapabilityRegistry.ts).  
**Audit:** Confirm specialist intelligence sources, provenance, freshness/missingness, and active UI caller. Do not create a parallel analytics engine.

### 2. Evidence-Connected AI Brain
**User value:** Answers linked to actual supporting videos/data and clear limits.  
**Likely code footholds:** [BrainContextBroker.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainContextBroker.ts), [BrainOrchestrator.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainOrchestrator.ts), [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/CreatorContextResolver.ts).  
**Audit:** Trace canonical evidence IDs from selection through model input to result UI; confirm evidence displayed is the same evidence supplied.

### 3. Channel Context Intake
**User value:** Collect and edit creator goals, audience, niche, formats, and channel identity once, then reuse them consistently.  
**Likely code footholds:** [aiBrainContext.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/aiBrainContext.ts), [AIBrainCommandInterface.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/AIBrainCommandInterface.tsx), [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/CreatorContextResolver.ts).  
**Audit:** Determine which questions/profile fields and save paths already exist; converge through CreatorContextResolver and existing persistence.

### 4. AI Prompt Library and Chat Handoff
**User value:** Find, preview, edit, and send existing prompts to Brain without copy/paste.  
**Likely code footholds:** [AIBrainCommandInterface.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/AIBrainCommandInterface.tsx), [BrainCapabilityRegistry.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainCapabilityRegistry.ts).  
**Audit:** Locate the current prompt registry, category data, prompt versioning, and handoff contract before adding UI; do not create a second registry.

### 5. AI Video Editor
**User value:** Discover and invoke implemented AI-assisted editing workflows with preview and safe apply/undo.  
**Audit foothold:** Inspect existing video/editor services, route registry, and active callers; do not assume the UI or execution contract exists from naming alone.  
**Gate:** Expose only operations with real implementation, permission checks, and truthful operation states.

### 6. Shorts / Vertical Video Modes
**User value:** Reach existing short-form generation or editing modes through clear workflow entry points.  
**Audit foothold:** Search current generation mode enums, video package/content-build handlers, and production consumers.  
**Gate:** Confirm short-form behavior is implemented, not merely a type or prompt label.

### 7. Veo Video Generation Integration
**User value:** Discover supported video generation settings, status, results, and errors.  
**Audit foothold:** Inspect provider adapters, generation service, capability registry, and UI call sites.  
**Gate:** Expose only configured/authorized provider paths; show real job/result IDs and failure states.

### 8. Metadata Generation and Refinement
**User value:** Generate and compare title/description/metadata alternatives and save the selected result.  
**Audit foothold:** Inspect metadata services and existing video update path; verify provider output and write authorization.  
**Gate:** Preserve drafts versus saved/published state distinctly.

### 9. Thumbnail Upload and Reuse
**User value:** Reuse the canonical thumbnail asset/upload workflow from relevant creator tasks.  
**Audit foothold:** Inspect thumbnail/media asset services and upload callers.  
**Gate:** Reuse canonical asset IDs and avoid duplicate upload pipelines.

### 10. Ranked Tag Generation and Analysis
**User value:** Generate, rank, compare, add/remove, and reset tag analysis for the active video.  
**Audit foothold:** Inspect tag/SEO services and state ownership.  
**Gate:** Reset stale results on video changes and distinguish suggestions from persisted tags.

### 11. Transcript and Language Tools
**User value:** Reach supported transcript retrieval, language selection, and transcript processing.  
**Audit foothold:** Inspect transcript providers, language contracts, and consumers.  
**Gate:** Label missing transcript/provider data accurately; don't fabricate transcript content.

### 12. Caption and Subtitle Management
**User value:** Access existing caption workflows and supported subtitle operations.  
**Audit foothold:** Inspect caption APIs, permission boundaries, timing/editor utilities, and active UI callers.  
**Gate:** Only expose editing/write operations that have supported APIs and authorization.

### 13. KPI and Time-Window Controls
**User value:** Compare metrics across supported periods and selected KPIs.  
**Audit foothold:** Inspect analytics-canon services, query filters, date range controls, and metric definitions.  
**Gate:** Respect stale/missing-data diagnostics; do not infer unsupported metrics.

### 14. CSV / Document Analytics
**User value:** Analyze imported data alongside relevant project/channel evidence.  
**Audit foothold:** Inspect existing import parsers, file analysis paths, and evidence normalization.  
**Gate:** Validate schema, source provenance, and data scope; do not silently merge incompatible datasets.

### 15. Cross-Video Performance Comparison
**User value:** Compare videos and identify supported differences in topic, format, or performance.  
**Audit foothold:** Inspect analytics-canon and video cohort/selection paths.  
**Gate:** Preserve selected cohort, filters, and metric definitions through follow-up navigation.

### 16. Evidence Quality and Source Validation
**User value:** Show source, freshness, missingness, and evidence limits next to Brain answers.  
**Likely code footholds:** [BrainContextBroker.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainContextBroker.ts) imports the evidence quality report type; verify the current report owner and UI mapping on target branch.  
**Gate:** Display only actual quality diagnostics and canonical evidence references.

### 17. Content Opportunity Discovery
**User value:** Make existing supported topic/opportunity findings actionable.  
**Audit foothold:** Inspect channel intelligence orchestrators, evidence cohorts, prompt/capability registry, and existing output cards.  
**Gate:** Separate evidence-backed findings from hypotheses and expose the underlying source records.

### 18. Manage Channel Information
**User value:** One reliable, accessible place to view/update channel identity, profile, and source settings.  
**Likely code footholds:** [Settings.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/Settings.tsx), [SettingsAccountPanel.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/settings/SettingsAccountPanel.tsx), [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/CreatorContextResolver.ts).  
**Important:** Settings and public-channel controls already have UI surfaces in source. Treat this as a consolidation/reachability/state-correctness candidate, not automatically as a missing page.

### 19. Public Channel Resolution Without Login
**User value:** Resolve a public channel handle without requiring account login or a YouTube API key, where the configured public/fixture/degraded path supports it.  
**Likely code footholds:** [publicHandleMode.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/publicHandleMode.ts), [Settings.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/Settings.tsx), [SettingsAccountPanel.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/views/settings/SettingsAccountPanel.tsx).  
**Important:** Existing settings UI is present. Verify the no-key path, channel-handle ingest, real versus fixture data, and error states before claiming hidden functionality.

### 20. Project / Package State Persistence and Resume
**User value:** Reopen an existing project/build/package and resume from canonical saved state.  
**Likely code foothold:** [Projects / Asset Engine / ContentBuild workflow resource](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md), plus [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/CreatorContextResolver.ts), which imports ContentBuild repository/contracts.  
**Gate:** Reuse canonical Project/ContentBuild/asset owners; do not introduce another persistence store. Verify save, restore, and no-project states.

### 21. Cross-Tool Workflow Handoffs
**User value:** Carry canonical outputs and provenance between existing supported tools.  
**Audit foothold:** Inspect tool handoff contracts, output asset IDs, origin IDs, and receipts.  
**Gate:** Handoffs remain review-only unless an existing approved-action contract explicitly allows more.

### 22. Subscriber / API Dispatch Functions
**User value:** Make supported dispatch actions reachable with permission and result feedback.  
**Audit foothold:** Locate service/API handlers and inspect auth, scopes, side effects, and current callers.  
**Gate:** Never expose internal or privileged operations without explicit user authorization and server-side checks.

### 23. Hidden Tools, Widgets, and Pages
**User value:** Reach implemented production routes/tools that lack navigation or contextual entry points.  
**Audit:** Use route graph, import inventory, exports, active callers, and runtime route tests. An exported component alone is not proof of a feature.

### 24. Advanced Studio Control Modes
**User value:** Reach supported control modes while retaining consistent focus, keyboard, responsive, and size behavior.  
**Code footholds:** [Studio primitives](https://github.com/viewtube-dev/viewtube/tree/master/consolidated-feature-integration/src/studio-ui/primitives), [Studio exports](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/studio-ui/index.ts), [Studio tokens](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/studio-ui/tokens.ts).  
**Gate:** Use canonical production exports; don't make a catalog lookalike or add ad hoc page CSS.

### 25. Unified Feature Discovery and Action Registry
**User value:** Make verified capabilities discoverable through navigation/search/contextual actions.  
**Audit foothold:** Inspect route registry, BrainCapabilityRegistry, toolbox/subtoolbox registry, and existing help/user-guide index.  
**Gate:** Reuse each domain's canonical registry; create no parallel universal capability database unless architecture authority approves it.

## Build plans

Two focused plans accompany this resource:
- [AI Brain capabilities 1–4 implementation plan](../brain/AI_BRAIN_HIDDEN_CAPABILITIES_1_TO_4_BUILD_PLAN.md)
- [Channel/profile/public mode/persistence capabilities 18–20 plan](./CHANNEL_MANAGEMENT_AND_PERSISTENCE_18_TO_20_BUILD_PLAN.md)

## Reference documents, audits, and plans

### Brain architecture and readiness
- [AI Brain Quick Wins Master Implementation Plan](../brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md) — shared evidence/context/UX invariants and prioritized improvements.
- [AI Brain Feature Master & Implementation Readiness](../brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md) — roadmap and readiness rubric; explicitly not proof every feature is missing or complete.
- [AI Brain Toolbox + Chat Redesign Plan](../brain/AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md) — chat, prompt, handoff, outcome and provenance work; inspect its current phase status.
- [AI Brain Chat Studio Primitive Build Plan](../brain/AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md) — production Studio primitive usage and open verification.
- [Creator Context capability contract](../capabilities/creator-context.md) — canonical context owner and product routing.
- [Creator Context reachability audit](../../tasks/system-convergence/CREATOR-CONTEXT-REACHABILITY.md) — first migration/reachability evidence; historical audit date must be respected.
- [PR #241 AI Systems verified audit (historical donor)](../migration/reference/PR241_VIEWTUBE_AI_SYSTEMS_VERIFIED_AUDIT_AND_IMPLEMENTATION_PLAN_2026-09-12.md) — historical only, not current authority.

### Studio design system and component audits
- [Studio Hub Component Library source of truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md) — catalog ownership and real production primitives.
- [Studio values/tokens/styles/settings hierarchy](../ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md) — normative styling ownership and precedence.
- [Studio Controls defaults and exception index](../ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md) — reviewed 2026-10-27; verify code/runtime conformance.
- [Studio Hub component import inventory audit](../ui/STUDIO_HUB_COMPONENT_IMPORT_INVENTORY_AUDIT.md) — reproducible import graph and unresolved imports.

### Project persistence and cross-system ownership
- [Projects / Asset Engine / ContentBuild workflow resource](../architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md) — canonical Project → ContentBuild → asset/package ownership.
- [System convergence and consolidation](../architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md) — canonical-system boundaries and convergence direction.
- [AI Systems Master Resource](../brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md) — retain as historical/provenance donor where superseded; follow its migration notice and current domain authorities.

## Required audit output before implementation

For every candidate, record:
- exact target branch and commit SHA;
- implementation files and exports;
- active caller / route / UI control;
- canonical state and persistence owner;
- tests and latest observed results;
- classification A/B/C/D;
- smallest vertical slice, acceptance criteria, and rollback boundary.

Do not call a feature “hidden” merely because its implementation is exported or its plan describes it. Do not claim build, browser, or visual verification unless run and observed.
