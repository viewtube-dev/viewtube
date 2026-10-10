# ViewTube Studio Hub — Front-End Component Layout & Setup Implementation Plan

**Date:** 2026-10-10  
**Status:** Proposed implementation plan — not yet implemented or visually certified  
**Target repository:** `viewtube-dev/viewtube`  
**Target branch:** `feature/studio-hub-frontend-layout-plan`  
**Authority:** Existing Studio Hub master architecture, five-document Studio Hub architecture, current `src/views/StudioHub.tsx`, SubToolbox registry, Toolbox UI Master Resource, UI Reference Library, and the 2026-10-06 full UI/primitive audit.

## 1. Goal and definition of done

Deliver one coherent, production-ready front end for every existing and approved Studio Hub toolbox. Each tool must have an exact, documented component hierarchy; use the canonical Toolbox/SubToolbox primitives, tokens, default sizes, and states; expose its real workflow without hiding controls; and connect to the shared Project, ContentBuild, Asset Engine/Vault, Analytics, publishing, and AI Brain systems through typed contracts.

This is a plan, not a claim that all tools are already implemented. First reconcile actual routes, mounted components, registries, docs, and feature flags. Do not mistake the thirteen intelligence engines for thirteen additional top-level toolboxes: map capabilities into existing tool ownership unless an audit proves a separate user-facing workspace is necessary.

## 2. Source-of-truth and UI rules

1. Production primitive code, tokens, tests, and the Toolbox UI Master Resource own actual geometry and behavior.
2. The Studio Hub UI Reference Library demonstrates/certifies those production primitives; it is not a second implementation or a separate source of styles.
3. Fix a primitive when its existing behavior is wrong; add a variant when a meaningful new behavior is needed; create a new family only for a genuinely new interaction.
4. Do not add feature-local pixel geometry, color, radius, stroke, shadow, or bespoke native controls where a canonical primitive/variant can be used.
5. Domain-specific visualizations are allowed, but must compose canonical layout primitives and tokens.
6. Preserve the distinct Main Toolbox and SubToolbox levels. Follow current source-of-truth size tokens and responsive contracts; do not copy catalog demo CSS into production.
7. All important states must be real: empty, loading, active, success, warning, error, insufficient evidence, stale/expired when relevant, disabled, disconnected, saving, saved, and unsaved.
8. High-impact actions require explicit user intent. Generating, applying to working inputs, saving a package, promoting Brain knowledge, and publishing/updating YouTube are separate operations.

## 3. Canonical page and tool shell

### Studio Hub page

```text
StudioHubPage
 ├─ PageHeader: STUDIO HUB + short purpose
 ├─ Optional Tool Navigation / search (only if consistent with existing navigation patterns)
 ├─ UI Reference Library (collapsed by default; certification surface, not a production tool)
 └─ ToolStack
     ├─ MainToolbox (one per actual user-facing tool)
     │   ├─ ToolboxHeader
     │   │   ├─ icon rail
     │   │   ├─ tool name + one-line outcome
     │   │   ├─ context/status (project/channel when relevant)
     │   │   ├─ contextual help / Learn More
     │   │   └─ only the modes/actions appropriate to this tool
     │   └─ ToolboxBody
     │       ├─ ContextStrip (current project/content/channel + connection state)
     │       ├─ PrimaryOutcome / Workspace
     │       ├─ SubToolboxGroup(s)
     │       ├─ Evidence / provenance / confidence
     │       ├─ Result / history
     │       └─ HandoffActions
```

### Standard SubToolbox composition

```text
SubToolbox
 ├─ SubToolboxHeader: icon + concise title + optional count/status + scoped actions
 └─ SubToolboxBody
     ├─ SubToolboxSection(s)
     ├─ canonical field/control primitives
     ├─ contextual inline help and validation
     └─ section-level result/actions
```

Rules:
- Avoid duplicate nested titles, gratuitous nested shells, and controls detached from the output they affect.
- Use a single clear primary action per tool; supporting actions should be visually secondary.
- On narrow screens, stack before clipping or shrinking fixed square rails. Keep touch targets and keyboard focus accessible.
- Use shared recipes where they fit: form, editor, preview, list, upload, analytics, command. Upgrade recipe status and tests when production-ready rather than inventing one-off patterns.
- Field labels should use the canonical label/overlay-label variants; add the right-side/inside-field label variant to the canonical Input and TextArea primitives if the audit confirms it is still missing. Do not hard-code it in individual tools.
- Use the canonical split-left button and button-group patterns for Generate, Refine, Analyze, Save, Compare, and similar actions; keep icon rail proportions governed by the primitive's size level.
- Use one canonical state panel and skeleton family; do not invent per-tool loading/error cards.

## 4. Ownership map: current tools and intelligence capabilities

| User-facing workspace | Primary responsibility | Capabilities it may host or consume |
|---|---|---|
| Opportunity Radar | Rank timely, evidence-backed opportunities | Opportunity detection, demand signals, freshness, strategic fit, effort and confidence |
| Content Architect | Turn a selected opportunity into differentiated concepts | Concept generation, Script Architect / Hook capabilities, Video Genome pattern references |
| Video Director | Turn an approved concept/story into an executable production direction | Story Engine, production plan, editor handoff, production checkpoints |
| Asset Forge | Resolve production requirements into reusable asset packages | Asset requests, generation, licensing/source, missing-asset resolution, Asset Engine/Vault |
| Thumbnail Studio | Create and compare visual packaging | Thumbnail generation, visual variants, end-screen/packaging extensions where ownership audit confirms |
| Video Manager | Edit metadata for already-published videos | Existing-video selector, title/description/thumbnail/tags, change history, analytics-linked change tracking; no upload/publish transaction |
| Video Publisher | Prepare and publish unpublished projects/videos | Build/Write workspaces, metadata candidates, thumbnail/video assets, publishing package, readiness checks, explicit publish transaction |
| Pre-Publication Analysis | Review a project/package before publication | Readiness, metadata/thumbnail/script checks, evidence-backed risks and recommendations |
| Post-Publication Analysis / Content Analysis | Analyze published performance and content | Performance evidence, comparison, retention/packaging analysis, Video Genome, measured outcomes |
| Audience Studio | Convert audience behavior into relationship actions | Community Posts, Comment Responder, audience signals, requests, polls, response queue |
| Pre-Launch Priming | Prepare pre-release audience messaging and activation | Teasers, community activation, schedule, launch checklist; handoff to Audience Studio / Publisher |
| Tactics Engine | Convert an approved finding into concrete interventions | Action plans, tactical options, experiment proposals; does not own cross-tool strategy |
| Revenue Architect | Match creator, audience, assets, and content to revenue opportunities | Offer concepts, opportunity matrix, unit economics, scenario comparison |
| Creator Strategy Engine | Synthesize validated cross-tool evidence into a prioritized next move | Channel Flywheel, Channel Simulator, Causal Intelligence, Experiment Lab and Content Autopilot as capabilities, not duplicate top-level shells |
| Metadata Master | Cross-field metadata intelligence and set management | Embedded/linked capability shared with Publisher/Manager; not a competing package store |
| Hook Generator | Focused hook exploration | Prefer a focused mode/entry point into Content Architect or Video Director if runtime audit confirms consolidation is safe |
| Script Architect | Script authoring and structure | Prefer a focused mode under Content Architect/Video Director, preserving route/history/hand-off compatibility |
| Community Posts / Comment Responder | Audience publishing and response subflows | Integrate as named modes/sections of Audience Studio if user flows and route compatibility allow |
| End-Screen Architect | Viewer continuation design | Integrate with Thumbnail Studio/packaging only after confirming end-screen layout needs a distinct workspace |
| Media Analyzer | Media inspection/transcript/source analysis | Shared capability consumed by Analysis, Director, Asset Forge; preserve direct access if the existing user-facing workflow is distinct |
| Concept Scene Studio | Scene/concept visual planning | Map to Content Architect or Video Director after route/component audit; do not remove a working workflow merely to meet a target count |
| Studio Publishing Cockpit | Cross-package readiness overview | A compact orchestration/overview layer; must not become a competing metadata/package store |

**Important:** this map is the target ownership hypothesis. Before consolidating any current module, verify its route, callers, persistence, user-visible entry points, and handoffs. Preserve functionality and stable IDs; deprecate duplicate surfaces only after parity tests pass.

## 5. Exact per-tool front-end layouts

Every layout below follows the shared shell. The listed SubToolboxes are the planned visible group order, not permission to duplicate backend stores.

### 5.1 Opportunity Radar
1. Context: channel, niche/goals, date window, connected evidence sources.
2. Filters: topic, audience, format, effort, freshness, confidence, monetization relevance.
3. Ranked Opportunity workspace: list/grid with score components, freshness, evidence count and confidence.
4. Evidence drawer: source snippets/metrics, assumptions, conflicting signals, expiry.
5. Actions: Inspect, Compare, Save Watchlist, Create Project, Send to Content Architect, Defer.
6. States: no signals, stale signals, insufficient evidence, source disconnected.

### 5.2 Content Architect
1. Context / selected Opportunity or manual brief.
2. Brief inputs: audience, problem/desire, promise, format, constraints, channel goal.
3. Generate / Refine / Analyze actions and a candidate list; never overwrite approved content silently.
4. Concept comparison workspace: premise, hook, differentiation, effort, quality/performance estimates and evidence.
5. Selected concept detail: outline, hook options, risks, provenance.
6. Handoffs: Create Project, Send to Video Director, Asset Forge, Pre-Publication Analysis, or Publisher.

### 5.3 Video Director
1. Project / concept / production context.
2. Direction controls: format, runtime, style, resources, schedule, production constraints.
3. Story / beat / scene workspace with reorderable steps and visual/audio guidance.
4. Production checklist and dependencies; each task has owner/status/source.
5. Evidence and retention hypotheses separated from measured results.
6. Handoffs: Editor, Asset Forge, Projects, Publisher, analysis.

### 5.4 Asset Forge
1. Project and production blueprint selector.
2. Asset requirements list grouped by type, status, source and priority.
3. Asset detail/preview with canonical upload, generate, replace, inspect and remove controls.
4. Resolve panel: existing Vault asset, create new asset, request generation, or mark intentionally absent.
5. Validation: format, dimensions, license/source, project ownership, duplicate detection.
6. Asset manifest and handoff to Director, Publisher, Thumbnail Studio and Vault.

### 5.5 Thumbnail Studio
1. Video/project context and aspect-ratio/placement selector.
2. Brief + source media + brand/style inputs.
3. Generate / Refine / Analyze actions.
4. Variant gallery with clear candidate identity, source, style, quality estimate and compare selection.
5. Full preview/compare workspace, accessible zoom and visual diagnostics.
6. Apply to working package, Save to Asset/Vault, or hand off to Publisher/Manager; applying is not publishing.

### 5.6 Video Manager
1. Direct published-video selector/search.
2. Video Details: title, thumbnail, description.
3. Publishing metadata controls in the canonical user-approved order; optional/secondary fields remain visually compact.
4. Tags and ranking/editor; playlist/category/visibility controls use real channel data where connected.
5. Change Review: before/after values, reason, actor/source, timestamp, saved/live state.
6. Analytics context: performance before/after change dates, measured metrics and caveats.
7. Primary action: Update published metadata, with explicit confirmation and result receipt. No video upload or new-video publish controls.

### 5.7 Video Publisher
1. Header mode switch: Write (default) and Create / Generate.
2. Write: project/video context; canonical metadata fields; per-field candidate dropdowns; optional Refine/Generate/Analyze row behind one global Show/Hide Field Actions toggle.
3. Candidate actions: Preview, Apply to working input, Compare, Save candidate, Open Full Set when connected. Applying never saves the package automatically.
4. Create / Generate: rough idea/script/context, project scope, generation style and constraints; generate individual candidates or complete ranked sets.
5. Complete-set workspace: rank, side-by-side compare, Select Fields, Apply All to working inputs.
6. Publishing readiness and the full publishing transaction, clearly separate from package save.
7. Collapsible Video Package section at the bottom: Save Package, Reapply Last Save, saved versions, histories and connected candidate sets. Save Package is not Publish.
8. Persistent project/ContentBuild identity, generation provenance, quality/performance estimates and evidence references.

### 5.8 Pre-Publication Analysis
1. Project/package selector and review depth.
2. Scope controls: metadata, thumbnail, script/content, audience fit, assets, policy/readiness.
3. Evidence requirements and missing-input panel.
4. Findings list grouped by severity and confidence, each with evidence, assumptions and repair action.
5. Before/after review and re-run comparison.
6. Handoffs: send a specific fix to its owning tool, return to project, or mark reviewed. Do not edit the package silently.

### 5.9 Post-Publication Analysis / Content Analysis
1. Published video/channel/time-range selector.
2. Analysis depth and comparison cohort controls.
3. KPI/retention/packaging workspace with measurement timestamps and source freshness.
4. Findings grouped as observation, hypothesis, prediction, finding or validated result.
5. Competing explanations, confidence and data sufficiency; no causal claims from simple correlation.
6. Create experiment, hand off a metadata test to Manager/Experiment Lab, feed a candidate finding into validation.

### 5.10 Audience Studio
1. Channel and date/source context.
2. Audience queue: questions, requests, praise, confusion, feedback, intent and priority.
3. Filters/segments and relationship context.
4. Selected signal detail with source/comment/post references and confidence.
5. Actions: draft response, create community post/poll, group requests, send opportunity to Content Architect, defer/escalate.
6. Review and approval before posting; no fake connected state.

### 5.11 Pre-Launch Priming
1. Upcoming project/video and launch date.
2. Audience/goal/message brief.
3. Timeline checklist: teaser, community post, announcement, reminders, launch-day action.
4. Draft variants with audience/purpose labels and preview.
5. Schedule/readiness panel with channel connection state.
6. Handoff to Audience Studio or Publisher; external posting/scheduling is always explicit.

### 5.12 Tactics Engine
1. Input finding / goal / project context.
2. Constraints: time, resources, risk, budget and desired outcome.
3. Ranked interventions with expected mechanism, effort, evidence and uncertainty.
4. Action plan: steps, dependencies, owner, due date, success metric.
5. Experiment proposal and measurement plan.
6. Approve, create project/task, run experiment, defer. Does not replace Creator Strategy Engine.

### 5.13 Revenue Architect
1. Creator capability, audience, content/asset and goal context.
2. Revenue model filters and assumptions.
3. Opportunity/economics matrix: audience fit, effort, cost, expected range, time horizon, confidence.
4. Scenario compare and sensitivity inputs.
5. Validation checklist and risk/ethical considerations.
6. Create revenue project or send a candidate to Creator Strategy Engine. Forecasts are ranges, not guarantees.

### 5.14 Creator Strategy Engine
1. Goal / planning horizon / constraints.
2. Evidence coverage and stale/missing-source warnings.
3. Ranked Next Best Moves with why-now, expected outcome, effort, dependencies, confidence and alternatives.
4. Detail view traces recommendations to source tools and evidence.
5. Decision controls: accept, reject, defer, request more evidence.
6. Accepted move becomes a Project/task/experiment through an explicit handoff; only this tool owns cross-tool strategic synthesis.

### 5.15 Metadata Master
1. Project/video scope and field-set selector.
2. Field group: title, thumbnail, description, tags and the established optional metadata order.
3. Single candidate, full set, multiple sets and compare modes.
4. Per-input manual edit, Generate, Refine, Analyze and ranking controls.
5. Save/restore candidate sets into the shared Video Package/project identity.
6. Must not introduce an independent metadata store or duplicate Publisher/Manager's canonical save/live-update transactions.

### 5.16 Focused existing modules pending safe consolidation
- Hook Generator: hook input/context → candidate list → compare/apply/send; keep stable route until parity is verified.
- Script Architect: brief → outline/script editor → beat/retention diagnostics → save/send; can be a Content Architect mode if route and workflow parity tests pass.
- Community Posts: post type/goal/audience → draft → preview → approval/publish handoff; move under Audience Studio only after existing entry points still work.
- Comment Responder: comment queue/context → response candidates → tone/claim checks → approval/send; preserve moderation and permission boundaries.
- End-Screen Architect: video/next-destination context → layout canvas/slots → preview → CTA/outro → asset/package handoff.
- Media Analyzer: source selector/upload → transcript/metadata/scene analysis → evidence panel → structured handoff.
- Concept Scene Studio: concept/scene list → scene board → visual/audio references → asset requests → Director handoff.
- Studio Publishing Cockpit: project/package readiness summary → missing items → route to owning Publisher/Manager/Asset tool; no duplicate editing fields.
- UI Reference Library: catalog/search/filter → family group → L0/L1/L2 examples → interactive state demonstrations; remains a certification/reference surface, not a creator production tool.

## 6. Shared component and data contracts

### Required component families
- Main Toolbox and SubToolbox shells; nested Mini SubToolbox only where justified.
- Header toggle / segmented mode selector.
- Canonical Input, overlay-labeled Input, TextArea, overlay-labeled TextArea, Search, Select/Dropdown, Checkbox, Radio, Toggle/Switch, Slider/Range, Tag Editor, Badge/Status, Split-left Action, Button Group.
- Selectable/reorderable list rows, candidate cards, media preview, evidence drawer, KPI/metric strip, chart/table, state panel, skeleton, tooltip/help, dialog/drawer, toast and confirmation.
- Handoff summary/receipt and history/version rows.

### Shared context and handoff
Use the existing canonical `StudioContext`, `StudioIntelligenceEnvelope`, and `ToolHandoff` contracts. Every result retains source tool/version, creator/project references, inputs, evidence, timestamp, confidence, uncertainty, validation state, provenance and downstream references. Reference canonical objects; do not duplicate them into per-tool stores.

### State and persistence boundaries
- Project / ContentBuild: execution identity, objectives, tasks, deliverables, checkpoints.
- Video Package: durable publishing metadata/assets, versions and candidate-set references.
- Asset Engine/Vault: reusable media identity and lineage.
- Video Manager: approved live metadata changes for published content.
- Video Publisher: final pre-publication package/readiness and explicit publish transaction.
- Analytics: measured metrics, time ranges and source freshness.
- AI Brain: validated durable knowledge only; raw AI output remains a candidate until appropriate validation.
- General tool preferences may persist globally; working inputs/results are project-scoped when project identity exists. No automatic destructive reset on project switch.

## 7. Implementation waves

### Wave 0 — Inventory and baseline
- Reconcile routes, `StudioHub.tsx`, component registry, tool manifests, tests, docs and feature flags.
- Build a ledger for each module: owner, purpose, component tree, primitive usage, custom styling, state coverage, persistence, integrations, handoffs, status.
- Capture desktop, narrow, mobile portrait and mobile landscape baselines.
- Record current behavior before any consolidation; do not delete a route based on the architecture table alone.

### Wave 1 — Canonical primitive and shell corrections
- Fix missing/wrong primitives; add variants to the shared registry and Reference Library together.
- Implement overlay-labeled Input/TextArea if absent or incomplete.
- Normalize spacing, sizes, button/action rows, labels, focus, dropdown interaction, loading/empty/error states.
- Ensure the reference library renders the actual production primitives and all L0/L1/L2 geometry derives from shared ratios/tokens.
- Add visual/state tests for every changed primitive before migration.

### Wave 2 — Shared tool composition
- Create/reuse typed shell recipes for Context, Form, Editor, List, Preview, Analytics, Upload and Command.
- Create reusable EvidencePanel, CandidateList, CompareWorkspace, HandoffReceipt, HistoryPanel and StatePanel only when no canonical equivalent exists.
- Wire real callbacks, project context and connection states; remove inert controls and fake success states.

### Wave 3 — High-value lifecycle tools
- First: Video Publisher + Video Manager + shared package/candidate model.
- Second: Thumbnail Studio + Asset Forge + Vault handoffs.
- Third: Pre/Post Analysis + analytics evidence contracts.
- Fourth: Content Architect + Video Director + Project/ContentBuild handoffs.
- Each slice must be tested and rendered before starting the next.

### Wave 4 — Audience, tactics, revenue and strategy
- Audience Studio, Pre-Launch Priming and community/comment workflows.
- Tactics Engine and experiment handoffs.
- Revenue Architect and Creator Strategy Engine, with evidence lineage and uncertainty.
- Add capabilities such as Video Genome, Story Engine, Content Autopilot, Experiment Lab, Causal Intelligence, Channel Simulator and Channel Flywheel inside the owning tools unless a separate user-facing need is proven.

### Wave 5 — Safe consolidation and parity
- Evaluate Hook Generator, Script Architect, Community Posts, Comment Responder, End-Screen Architect, Media Analyzer and Concept Scene Studio for modes/subflows.
- Require route/caller inventory, feature parity, stable IDs, persistence parity, accessibility checks and user-flow tests before redirecting or removing any standalone surface.
- Keep specialized workspaces standalone if consolidation would make their primary task harder to discover or use.

### Wave 6 — Certification and release
- Run typecheck, lint, unit/contract tests, build, route smoke tests and interactive visual regression.
- Test empty/loading/error/disconnected/saved/unsaved and insufficient-evidence states.
- Verify keyboard access, visible focus, labels, contrast, mobile stacking and overlays.
- Render each tool in the real application using canonical primitives; compare against UI Reference Library.
- Verify Project/ContentBuild/Package/Vault/Analytics/Brain handoffs end-to-end.
- Publish a migration ledger with pass/fail evidence; do not label a tool complete because its component exists or its static markup test passes.

## 8. Acceptance checklist

A toolbox is complete only when:
- [ ] Its primary transformation and ownership boundary are unambiguous.
- [ ] Exact visible component tree and section order match this plan or a documented approved exception.
- [ ] All controls use canonical primitives/variants and tokens.
- [ ] Its primary action is discoverable and real.
- [ ] Results show evidence, provenance, confidence and uncertainty when relevant.
- [ ] Save/apply/promote/publish actions are distinct and correctly permissioned.
- [ ] It has empty, loading, success, warning, error, disconnected and insufficient-evidence states as relevant.
- [ ] Project and canonical object identities survive handoffs and reloads.
- [ ] Desktop and mobile render without clipped controls or broken ratios.
- [ ] Automated tests and actual interactive visual verification pass.
- [ ] The migration ledger and canonical docs are updated.

## 9. Explicit non-goals

- Do not create thirteen new top-level toolboxes just because thirteen intelligence capabilities exist.
- Do not redesign the visual system independently inside each tool.
- Do not replace working user-facing functionality with empty architectural shells.
- Do not merge every focused tool into a mega-tool if that damages discoverability.
- Do not treat AI estimates as measured analytics or correlation as causation.
- Do not make Save Package equivalent to Publish or a working-input Apply equivalent to Save.
- Do not mark the plan implemented until code, tests and live render evidence prove it.
