# AI Brain Toolbox + Chat Overhaul — Plan, Audit, and Phases 1–2

**Date:** 2026-10-19  
**Repository:** `viewtube-dev/viewtube`  
**Target base:** `master/consolidated-feature-integration`  
**Working branch:** `feat/brain-toolbox-chat-phases-1-2`  
**Status:** Phase 1 source audit recorded; Phase 2 first control migration and regression tests committed to this branch; CI and browser visual certification pending. The full feature overhaul remains staged.  
**Primary historical design donor:** [PR #241 Brain brainstorm and frontend design](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/docs/migration/reference/PR241_VIEWTUBE_AI_BRAIN_BRAINSTORM_AND_FRONTEND_DESIGN_2026-09-12.md)

> This document consolidates the complete Brain UI overhaul proposal and the implementation sequence. The PR #241 design is a historical donor, not a current-state specification. Do not trust its old maturity percentages, route counts, model/provider assumptions, or “currently empty” assertions without rechecking the integration branch. Preserve its still-useful product requirements while following current source, tests, registries, and architecture contracts.

## 1. Product goal

Turn the Brain page into ViewTube's complete AI command center—not a cosmetically refreshed chat box. It must expose and make usable the canonical Brain capabilities, evidence, creator context, prompt policy, task execution, outcomes, and governed learning. It should serve both creators and operators, work on desktop and mobile, and provide an ambient Brain layer to other workspaces without creating a second runtime or store.

The core UI promise is: **the creator can tell what the Brain knows, what it actually used for this answer, what it cannot access, why it recommends something, what it did, what was saved, and what it learned from the outcome.**

The visual system must be cohesive with Studio Controls, but must not force every surface into one rigid layout. Reuse the real Studio primitives, global token ownership, and registered exceptions. A Brain-specific component may compose canonical primitives; it must not create a shadow implementation of them.

## 2. Existing implementation audit — Phase 1

This audit is grounded in source files fetched from `master/consolidated-feature-integration` during this work. It is a baseline, not a claim that every behavior has been browser-certified.

### Existing owners to preserve

| Area | Existing source / owner | Audit disposition |
|---|---|---|
| Primary Brain conversation page | `src/views/AIBrainCommandInterface.tsx` | Extend the current page; do not create a parallel chat experience. It already wires BrainRuntime, conversation storage, context snapshots, feedback/learning capture, capability browser, evidence drawer, context rail, and runtime panel. |
| Alternate command center / sidecar | `src/views/BrainCommandCenter.tsx`, `src/components/SidebarChatbot.tsx` | Keep ambient entry points; share claim/evidence language and canonical runtime rather than duplicating orchestration. |
| Capability discovery | `src/services/brain/BrainCapabilityRegistry.ts`, `src/components/brain/BrainCapabilityBrowser.tsx` | Existing registry-backed capability browser is the source of truth. It already evaluates Brain controls and channel/project readiness; do not hardcode a second catalog. |
| Evidence explanation | `src/components/brain/BrainEvidenceDrawer.tsx` | Exists and can present evidence-pack items, missing inputs, caveats, source navigation, and optional confidence metadata. Generalize its usage, not the evidence schema. |
| Confidence presentation | `src/components/brain/BrainConfidenceChip.tsx` | Exists but uses independent rounded/pill CSS. Phase 2 migrates its shell to the canonical Studio split-left badge primitive so it shares geometry and sizing with the global control system. |
| Context visibility | `src/components/brain/BrainContextRail.tsx`, `BrainScopeSummary.tsx`, context-used drawer in `AIBrainCommandInterface.tsx` | Existing context visibility is valuable. Keep context available distinct from context actually included in a particular turn. |
| Runtime/trace status | `src/components/brain/BrainRuntimePanel.tsx`, `src/services/brain/BrainRuntimeSnapshot.ts` | Existing runtime snapshot and panel are foundations for trace/timing/capability observability; do not fake missing values or infer successful execution from a request. |
| Structured answers / mini visuals | `src/components/brain/BrainAnswerModules.tsx` | Existing structured answer modules include mini trend visuals. Expand through typed payloads and canonical analytics, not hand-computed UI metrics. |
| Prompt system | `docs/specifications/PROMPTS.md`, `docs/specifications/prompt-registry.json`, Brain task-profile/prompt owners | Use the existing composable prompt system. UI must inspect and explain active family/defaults/overrides rather than introduce a second prompt resolver. |
| Studio controls | `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/index.ts`, `src/styles/studio-control-system.css` | Reuse exported production primitives and their tokens. The confirmed primitive library remains the catalog/certification surface, not a competing implementation. |
| Historical donor reconciliation | `docs/brain/PR241_DONOR_HARVEST_AUDIT_2026-09-24.md` | Use donor ideas selectively. That audit says core runtime assets such as BrainTrace, StyleProfile, numeric claim auditing, model routing, and creator-asset outcomes were already retained or improved. No wholesale donor merge. |

### Audit conclusions

1. The repository already has substantial Brain UI and runtime foundations. The job is to connect, standardize, and finish them—not start a parallel Brain.
2. The capability browser is already backed by `BRAIN_CAPABILITY_REGISTRY`; capability reachability must be audited against the real registry and runtime call path.
3. `BrainConfidenceChip` and `BrainEvidenceDrawer` exist, but a truly universal claim/evidence grammar is not yet demonstrated across all AI widgets, generated assets, reports, and chat turns.
4. Context availability and turn-specific evidence are different facts. UI must not imply that every available profile field or evidence item was included in the model request.
5. A runtime panel is not the same as a complete creator-friendly execution timeline or operator trace explorer. Those remain separate planned surfaces.
6. StyleProfile/runtime foundations do not prove that creator-facing style editing, variant comparison, and edit-as-teaching flows are complete.
7. Autonomy controls, schedules, quiet hours, budgets, review queue, action audit and outcome read-back require verification against current policy/storage/writer owners before the UI exposes them as operational.
8. Historical PR #241 requirements are still useful: evidence sufficiency, freshness, negative evidence, claim-level citations, evidence-gap actions, creator-correctable channel knowledge, style fingerprinting, variant comparison, opportunity prioritization, impact/calibration cards, autonomy matrix, activity feed, operator trace/eval/cost tools, and a universal “Why?” affordance.
9. PR #241 is a donor. Current architecture and contracts outrank its older assumptions. In particular, no new statistics engine, Brain runtime, generic outcome store, memory store, or prompt resolver should be created to support the redesign.
10. A completed source audit does not mean browser visual certification, end-to-end capability reachability, or production deployment verification is complete.

### Phase 1 manifest / deliverables

- [x] Confirm the required integration branch exists and use it as the base.
- [x] Fetch and review the PR #241 design donor and its 2026-09-24 harvest audit.
- [x] Identify current Brain page, command center, sidecar, capability registry/browser, confidence chip, evidence drawer, context rail, runtime panel, answer modules, prompt spec, and Studio Controls owners.
- [x] Record what exists versus what remains a design/verification gap.
- [ ] Complete full runtime reachability and route-by-route browser audit for all capability IDs.
- [ ] Capture desktop/mobile screenshots and keyboard/focus states before and after the shell redesign.
- [ ] Verify exact backend writers and policy persistence for autonomy, scheduling, outcomes, and learning before exposing controls.
- [ ] Record build/test/CI receipts after source changes; do not claim certification from a source read alone.

## 3. Design principles and trust contract

- **Evidence first:** the model interprets prepared evidence; deterministic code owns calculations, comparisons, freshness, coverage, counts, and schema validation.
- **Claim-level provenance:** AI claims should carry source/evidence references and confidence only where the confidence has a real evidence-backed definition.
- **Available ≠ used:** distinguish available context, context selected for this turn, and evidence cited in the answer.
- **Missing ≠ zero:** show missing, stale, blocked, not queried, and queried-with-no-results as different states.
- **No false execution:** “requested,” “running,” “completed,” “saved,” “approved,” and “published” must map to real states/receipts.
- **Approval boundaries:** creating a draft, handing off an ActionPacket, approving for review, and publishing are distinct. UI never implies publish approval from a workflow handoff.
- **Creator-owned autonomy:** per-action permission levels, explicit review defaults, frequency caps, quiet hours, budgets, and an audit/undo surface. Publishing remains approval-gated unless a later governed product decision explicitly changes this.
- **One canonical owner:** use BrainRuntime/BrainOrchestrator, BrainContextBroker/CreatorContextResolver, BrainCapabilityRegistry, BrainTrace/ToolReceipt, analytics-canon/VT-SYNC, Project/ContentBuild, prompt registry, and existing outcome/learning governance.
- **Accessible and responsive:** keyboard-first navigation, visible focus, screen-reader labels/status updates, 44px targets for ordinary interactive controls where the shell contract requires them, reduced motion, narrow widths, long content, zoom, and light/dark theme.
- **Studio Controls consistency:** source-backed primitives; 44px standard, 28px compact, 14px micro only where registered; black border; 3px/2px/1px stroke; 6px/4px/2px radius; Inter weight 1000; standard/compact/micro text 38px/24px/10px; letter spacing `-.02em`; primary/secondary color pairs; full-row fill by default; 4px external spacing only; no shadow/fake-shadow/geometry movement by default.
- **No CSS lookalikes:** do not re-create buttons, split badges, fields, toggles, dropdowns, or icon buttons using local one-off styling if a canonical Studio primitive exists. Brain-specific typography may be used for content reading surfaces, not to fork control geometry.

## 4. Proposed information architecture

### Desktop workspace

Three coordinated regions with independent scrolling:

1. **Left — Brain navigation and capability launcher**
   - Conversation / saved threads / search
   - Channel Mind / creator knowledge
   - Style Studio
   - Asset Studio
   - Action Board
   - Learning Ledger
   - Evidence Explorer
   - Autonomy & Controls
   - Activity Feed
   - Operator tools gated by permissions
2. **Center — Conversation workbench**
   - streaming chat history and structured answer renderer
   - claim-level evidence/confidence affordances
   - code, tables, mini charts, comparison views, generated asset previews, task/ActionPacket summaries
   - composer with attachments, prompt family, capability, context/evidence scope, output format, and run/preview controls
3. **Right — Context/evidence inspector**
   - current channel/project/ContentBuild/selected asset
   - context available vs context used in the current turn
   - evidence freshness, source status, missing inputs, conflicts, citations
   - execution receipt / “what happened” details

The three-region shell must collapse intentionally at intermediate widths. Avoid fixed-width clusters that overflow.

### Mobile workspace

- Single-column conversation as the default.
- Compact top-level destinations for Chat, Tools, and Evidence/Context.
- Capability browser and context/evidence inspector open as accessible full-screen sheets or stacked panels.
- Composer stays reachable above the keyboard and supports multiline input, attachments, send/cancel, and busy/error state.
- Avoid rendering desktop sidebars as squeezed columns; preserve the user's conversation position when opening/closing inspectors.

## 5. Chat and composer contract

### Message renderer

Render typed blocks, not just a Markdown blob:

- user and assistant messages, streaming and interrupted states
- claim-level citations and confidence/evidence affordances
- paragraphs, headings, lists, code, tables, structured KPIs, charts, trends and retention curves
- variant comparisons and generated asset previews
- capability/task invocation status and receipts
- approval cards, ActionPacket handoffs, and safe next actions
- explicit partial-answer, missing-evidence, stale-data, blocked-permission, quota, timeout, provider-error and retry states
- feedback and outcome capture without polluting model conversation history

Every chart/table must distinguish null from zero, state units and scope, show the time window and source, and not fabricate values to fill gaps.

### Composer controls

- message input and attachment picker
- prompt family / task intent
- registry-backed capability selection
- channel/project/ContentBuild scope
- evidence window, source and freshness selection when supported
- output format and length constraints
- preview / execute / approval behavior where capability allows it
- cancellation and retry only when backed by the runtime
- “show context used” and “why this answer?” access
- keyboard shortcuts and mobile-safe focus/submit behavior

### Per-response actions

Copy, edit/retry, regenerate where supported, compare variants, explain evidence, inspect context used, save output, turn into a task/ActionPacket, open the source, provide feedback, and record accept/reject/correction outcomes. Each action must map to a real existing API/owner; do not render dead controls.

## 6. Ten proposed Brain primitives

These are design candidates, not ten approved parallel implementations. Each should be built only after checking for an existing source-backed equivalent and then registered in the Brain/UI component inventory.

1. **`BrainMessageSurface`** — consistent message layout, streaming, error, partial, structured content and response actions.
2. **`BrainEvidenceBadge`** — compact, reusable evidence/confidence indicator backed by canonical Studio badges and real evidence metadata.
3. **`BrainMiniVisual`** — small metric trend/comparison visual using canonical analytics payloads and clear missingness.
4. **`BrainEvidenceDiagram`** — provenance path from source/dataset through derived signal and specialist analysis to a claim, with navigable stable references.
5. **`BrainCapabilityLauncher`** — registry-backed searchable launcher that shows intent, requirements, readiness, permissions and guided prompt; adapt existing `BrainCapabilityBrowser`.
6. **`BrainPromptStudio`** — inspect active prompt family/version, inherited defaults, creator overrides, context recipe, output schema and validation status without becoming a second prompt resolver.
7. **`BrainContextEvidencePanel`** — shows available context, actual per-turn context, cited evidence, freshness, missing inputs and contradictions as separate concepts.
8. **`BrainExecutionTimeline`** — human-readable status/receipt timeline built from BrainTrace, ToolReceipt and existing job/workflow state.
9. **`BrainAutonomyControls`** — per-action policy matrix, schedule, budget, quiet hours, frequency cap, review queue and audit log, only where backed by persisted policy.
10. **`BrainOutcomeLearningCard`** — predicted vs measured outcome, evaluation checkpoint, creator decision, evidence lineage and governed learning status.

### Compound workspaces

- `BrainWorkspaceShell`: responsive shell and navigation.
- `BrainConversationWorkbench`: chat + composer + response actions.
- `BrainTaskControlDeck`: capabilities, prompts, context/evidence and execution mode.
- `BrainIntelligenceWorkbench`: knowledge map, style fingerprint, opportunity radar and learning/outcome visuals.
- `BrainGovernanceCenter`: autonomy, permissions, schedules, budgets, trace/evaluation and audit.

### High-value historical concepts to preserve

- Editable channel knowledge map: each fact has status, confidence, source, evidence, age and conflict; creator can confirm/correct/remove via the canonical knowledge owner.
- Style fingerprint and creator-edit teaching: show style dimensions and exemplars; only persist diffs as learning signals through governed capture.
- Variant comparator: multiple drafts with rubric/evidence, creator selection captured as a real outcome.
- Opportunity radar: impact × effort only when inputs and scoring are canonical.
- Impact and calibration cards: predicted vs measured outcomes with sample size/uncertainty; suppress misleading charts when evidence is insufficient.
- Evidence explorer and evidence-gap actions: identify source, freshness, missing metric and legitimate remediation.
- Activity feed: autonomous/background actions, receipts, review and undo where supported.
- Universal “Why?” affordance and claim grammar across chat, widgets, reports and generated assets.
- Operator workbench: trace search/replay, evaluation runs, golden fixtures, prompt version diff, model substitution, cost and latency. Permission-gate operator-only details.

## 7. Phase 2 — Shared UI design-system implementation

### Contract

The Brain UI should compose canonical Studio primitives and shared semantic Brain data components. It should not add another token source, CSS control system, palette owner, or parallel capability/evidence registry.

Current Studio sources:

- `src/studio-ui/primitives/StudioControls.tsx`
- `src/studio-ui/index.ts`
- `src/styles/studio-control-system.css`
- `src/styles/studio-control-entry.css`
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`

Phase 2 immediate change: migrate `BrainConfidenceChip` to the exported `StudioSplitLeftBadge` rather than its own rounded border/padding/type geometry. Use the registered micro badge tier for this informational chip, preserve semantic confidence labels and existing confidence mapping, and keep its color tone evidence-backed. This is the first small vertical slice of the shared primitive contract; it is not a claim that every Brain control has already migrated.

### Rules for every subsequent Brain control

- Prefer `StudioButton`, `StudioTextInput`, `StudioTextArea`, `StudioSelect`, `StudioSplitLeftBadge`, `StudioDoubleSplitBadge`, and other exports from `src/studio-ui/index.ts` where their semantics fit.
- Keep body reading typography distinct from controls; use control tokens only for controls.
- No local shadow, pseudo-shadow, glow, translation, or shell movement. Follow the global Studio contract.
- Avoid rounded-pill controls where the canonical primitive uses square geometry.
- Keep labels aligned according to primitive contract, not local CSS guesses.
- Preserve a single outer border and shared split dividers; no nested/doubled strokes.
- Use palette pairs via existing Toolbox/Studio palette ownership; do not hardcode a new Brain palette as a separate authority.
- Ensure fields distinguish rest/focus, focus has no layout shift, and focus never uses a black glow/shadow.
- Document real exceptions in the Studio global-exceptions index and the confirmed library; do not silently add exceptions.
- Test source/API contracts and interactive behavior, then visually certify standard/compact and applicable micro states in a real browser.

## 8. Prompt, context, evidence and execution behavior

### Prompt system

Prompt families to expose in UI: Constitution, Analytics, Audience, Strategy, Packaging, Content, Community, Publishing, Revenue, Editor/Oracle, Research. Reuse `docs/specifications/PROMPTS.md` and `docs/specifications/prompt-registry.json`. A family requires a stable job, not just a new screen. Show inherited defaults versus overrides, active version, context recipe, output schema and validation where those data are available.

### Evidence/context contract

- Every turn has a stable turn identity and the exact resolved evidence/context snapshot.
- The UI may show general context availability, but the “used in this answer” view must be derived from that turn's actual input and output provenance.
- Numeric claims must map to canonical calculations or evidence. Model prose cannot replace a deterministic result.
- Evidence states include available, used, cited, missing, stale, blocked, not queried, queried-empty and conflicting.
- Each evidence link should retain canonical IDs and scope/window/cohort where available.
- Confidence must not be derived from styling, model tone, or a generic default.
- “Why this answer?” must be creator-readable and never expose hidden chain-of-thought; show evidence, relevant rules, caveats, calculations, context and action receipts instead.

### Runtime and action contract

- All chat/capability work routes through BrainRuntime and existing orchestrator/gateway owners.
- Capability launch must obey registry requirements and BrainUserControls.
- Tool loops remain bounded and record invocation limits in traces.
- External side effects require their owning approval path.
- ActionPacket → destination prefill must preserve IDs and provenance.
- Receipts are authoritative for whether work actually ran/saved/changed anything.
- Background/autonomous outputs land in review by default; no UI-only scheduling simulation.
- Outcomes feed existing BrainOutcomeLedger/domain ledgers and evaluation governance, not a new generic store.

## 9. Implementation phases and acceptance gates

### Phase 1 — Audit and manifest (now)

1. Inventory current page, navigation, existing Brain components, capabilities, prompt owners, context/evidence/trace, and Studio primitives.
2. Map each existing component to its source owner, consumers, data contract, and current state.
3. Compare PR #241 donor requirements against current code and the 2026-09-24 donor-harvest audit.
4. Mark each feature as source-confirmed, partially implemented, absent, or requires runtime/browser verification.
5. Identify route/capability reachability, permissions, error states, data provenance and accessibility gaps.
6. Publish the manifest and update it with evidence from tests/browser runs rather than optimistic percentages.

**Gate:** every planned surface has an owner and every claim about current capability status has a source or explicit “unverified” status.

### Phase 2 — Shared design system (started now)

1. Adopt canonical Studio primitives for Brain control shells.
2. Migrate Brain confidence/evidence labels first as the initial vertical slice.
3. Define a reusable claim/evidence composition that accepts real confidence/evidence data.
4. Remove redundant local control geometry from migrated Brain controls without rewriting content-layout typography.
5. Add component contract tests and keep the Confirmed Primitive Library as the source-backed catalog.
6. Create desktop/mobile shell tokens/layout using existing Toolbox hierarchy rather than new shell primitives where possible.

**Gate:** source-level tests pass; no duplicate control/palette/token owner; keyboard/focus and reduced-motion contracts remain intact; browser visual certification recorded separately.

### Phase 3 — Shell and toolbox navigation

- Build responsive left navigation, center workbench, right inspector and mobile sheets.
- Preserve current route identity, current thread, restore/resume behavior and selected channel/project.
- Use `brain-command-center` and existing ToolboxScaffold/super-tool registration; do not create a second page identity.
- Use the registry for all capability entries and route links to existing sub-workspaces.

### Phase 4 — Chat and composer

- Introduce typed message blocks and real streaming/cancel/retry/error states.
- Integrate attachments, prompt family, capability selection, scope, output format and execution/approval mode.
- Add per-response evidence/context/execution actions only when the backing API exists.
- Keep feedback/intake/journal records out of model history unless they are actual visible conversation turns.

### Phase 5 — Evidence and compact visuals

- Universal claim grammar and evidence ribbons.
- Context-used panel tied to stable turn IDs.
- Canonical charts, evidence lineage, evidence gaps, source freshness and null/zero distinctions.
- “Why?” from chat and applicable dashboard/widget surfaces.

### Phase 6 — Prompts, settings, permissions and handoffs

- Prompt Studio reads the current registry/resolver.
- Controls explain saved permissions vs actual data readiness.
- Per-action autonomy, scheduling, budgets and audit only when server/persistent owners support them.
- ActionPacket handoffs preserve identity and do not imply approval or publication.

### Phase 7 — Outcomes and governed learning

- Creator edits, variant selections, accepted/rejected recommendations and completed tasks create correctly typed outcome events.
- Post-publication observations join back to Project/ContentBuild and exact assets.
- Show prediction vs outcome and learning candidate/promotion state.
- Preserve correction, contradiction, expiry, and privacy/consent rules.

### Phase 8 — QA, certification and release

- Source/API tests, focused component tests, full suite, typecheck, lint/build as repo policy requires.
- Capability-by-capability end-to-end reachability matrix.
- Desktop/mobile browser screenshots at key breakpoints, keyboard/focus, zoom, reduced motion, dark/light theme and long-content checks.
- Validate source commit and deployment before claiming release.
- Update documentation registry, UI reference/certification ledger and current Brain plan.

## 10. Verification matrix

| Dimension | Required proof |
|---|---|
| Capability reachability | Every registry entry can be found, readiness/permissions are accurate, runtime call reaches its canonical owner, result/receipt is represented truthfully. |
| Evidence fidelity | Evidence shown as “used” matches the turn snapshot; every number is sourced or calculated; missing/stale/blocked states remain distinct. |
| Chat integrity | Streaming, cancel, retry, restore, visible-history filtering, attachments, structured content and errors work. |
| Prompt integrity | One resolver/registry; inherited defaults and overrides are truthful; version/provenance remains inspectable. |
| Studio consistency | Canonical primitives/tokens; no duplicated borders/shadows/palette; accurate exception documentation. |
| Responsive | Desktop three-region layout, intermediate collapse, mobile one-column and inspector sheets; no horizontal overflow. |
| Accessibility | Keyboard, focus, labels, screen-reader status, touch targets, contrast, reduced motion and zoom. |
| Visualization | Correct units/scope/window, null != zero, small-sample caveats, no unsupported precision. |
| Governance | Permission gates, review/approval boundaries, receipts, audit/undo and no UI-only autonomy. |
| Outcomes/learning | Stable lineage through Project/ContentBuild/assets/evaluation and governed learning; no duplicate stores. |
| Performance | Lazy loading for heavy panels, bounded lists, stable scrolling, no expensive chart or rerender regressions. |
| Documentation | Update canonical docs, registry/index and certification evidence; stale donor material remains clearly marked historical. |

## 11. Repository documentation/reference index

1. [Brain domain authority](../domains/BRAIN.md)
2. [PR #241 historical Brain UI brainstorm](../migration/reference/PR241_VIEWTUBE_AI_BRAIN_BRAINSTORM_AND_FRONTEND_DESIGN_2026-09-12.md)
3. [PR #241 donor harvest audit](PR241_DONOR_HARVEST_AUDIT_2026-09-24.md)
4. [Brain quick wins master implementation plan](AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md)
5. [Studio Controls global defaults and exceptions](../ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md)
6. [Studio Hub Component Library source of truth](../ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md)
7. [Toolbox UI master resource](../architecture/VIEWTUBE_TOOLBOX_UI_MASTER_RESOURCE.md)
8. [Prompt specification](../specifications/PROMPTS.md)
9. [Prompt registry](../specifications/prompt-registry.json)
10. [Product architecture](../architecture/PRODUCT_ARCHITECTURE.md)
11. [Integrated application program](../programs/INTEGRATED_APPLICATION.md)
12. [Analytics / VT-SYNC master resource](../analytics/VIEWTUBE_ANALYTICS_VT_SYNC_MASTER_RESOURCE.md)
13. [Projects / ContentBuild workflow master resource](../architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md)
14. [Toolbox promotion and workflow chains](../specifications/TOOLBOX_PROMOTION_AND_WORKFLOW_CHAINS.md)
15. [Documentation registry](../DOCUMENTATION_REGISTRY.md)
16. [Conversation OS governance](../governance/CONVERSATION_OS.md)
17. [System convergence and consolidation](../architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md)

## 12. Definition of done

- The redesign is built on the existing Brain runtime, registries, stores, and Toolbox identity.
- All ten candidate primitives have been reconciled against current source; no duplicate owner exists.
- All AI claims have accurate, accessible evidence/confidence affordances where supported.
- The interface separates context available from context actually used.
- Prompt controls, capabilities, actions, schedules, permissions and receipts are real, not mock controls.
- Desktop/mobile states and accessibility are browser-verified.
- Focused and full tests, typecheck/build, and capability reachability gates are green or any known blockers are documented with receipts.
- Docs, component catalog and certification ledger agree with the shipped source.
- The target branch/commit and deployment source are verified before release is reported.

**Current completion statement:** Phase 1 source inventory is recorded above. Phase 2 now includes a first source-backed migration: `BrainConfidenceChip` uses the production `StudioSplitLeftBadge` at the registered micro tier, preserving Brain-owned confidence mapping and adding a focused component regression test. This is the first vertical slice, not a claim that every Brain control has migrated. The focused test has been added but has not yet been executed in this connector-only workflow. Phases 3–8 are planned, not complete. Browser visual certification, end-to-end reachability, and deployment verification are still open.

## Implementation update — Phase 2 and Phase 3 (2026-10-19)

Working branch: `feat/brain-toolbox-phase-2-3`  
Target base: `master/consolidated-feature-integration`

### Phase 2 — Shared design system

- [x] `BrainConfidenceChip` uses the production `StudioSplitLeftBadge` at the registered micro tier; confidence semantics remain Brain-owned.
- [x] Added `BrainClaimEvidence` as a reusable composition for evidence packs and optional, explicitly supplied confidence.
- [x] Replaced the chat opening briefing's separate confidence/evidence controls with the shared composition.
- [x] Replaced the assistant response's compact evidence drawer invocation with the shared composition.
- [x] Migrated evidence count/provenance/confidence/inference labels to the Studio split-left badge primitive.
- [x] Removed fake shadows from the migrated evidence drawer and source action; preserved source links and the existing evidence-pack schema.
- [x] Added focused tests for claim/evidence behavior and workspace navigation route exposure.
- [ ] Execute the focused Vitest tests, Studio Controls contracts, typecheck, full suite, and browser visual certification. These have not been run from the GitHub connector workflow and must not be treated as passing.

### Phase 3 — Shell and toolbox navigation

- [x] Added `BrainWorkspaceNavigation` to the existing Brain page identity; it links to the existing Brain chat, Brain command center, Analytics, Projects, and Studio routes.
- [x] Mounted the navigation as a compact icon rail at the wide-desktop breakpoint and a labeled rail at extra-wide desktop widths.
- [x] Kept the existing conversation, runtime panel, prompt/capability launchpad, context rail, and mobile sheets in place; this is an incremental shell integration, not a second router or parallel workspace.
- [x] Preserved the existing page state and thread hydration path; navigation links use route changes only.
- [ ] Browser-verify intermediate/desktop widths, mobile portrait/landscape, keyboard focus, zoom, and no horizontal overflow.
- [ ] Verify each destination route in the running app and confirm browser history/resume behavior.

### Current evidence and limitations

Source edits and test files are committed to the working branch. GitHub source operations do not execute Vitest, typecheck, lint, or browser tests, so no green-test or visual-certification claim is made here. Phase 3 is a first shell/navigation increment: the existing center conversation and right-side launchpad/context layout is retained rather than fully restructured into independent scroll containers. Follow-up work must finish route reachability, test/CI receipts, and responsive browser certification before this phase is considered fully certified.

