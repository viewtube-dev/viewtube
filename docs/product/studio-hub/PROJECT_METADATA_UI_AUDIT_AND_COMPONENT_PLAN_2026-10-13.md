# Project + Metadata Updates — Front-End/Backend Audit and UI Plan

**Status:** Phase 1 audit and architecture plan  
**Date:** 2026-10-13  
**Scope:** ViewTube Projects / ContentBuild / publication packages / Metadata Master / dedicated metadata history and analytics  
**Implementation boundary:** Additive work on the existing canonical project, ContentBuild, asset, package, ActionPacket, Analytics, and AI Brain systems. Do not introduce parallel stores.

## 1. User decisions that govern this plan

- Proceed with the recommendations already discussed, except recommendation **#3**, which is explicitly excluded. Do not reintroduce it under another name.
- Keep the working interface quiet while the creator is editing, refining, or adjusting metadata. Show only the controls and feedback needed for the current task by default.
- Put optional guidance, expanded explanations, advanced settings, and additional contextual copy behind user-controlled display/settings affordances.
- Detailed history, change lineage, and analytics must be fully available in a **dedicated tool or distinct location**. Do not combine the history/analytics workspace with the day-to-day metadata editing/management workspace.
- Preserve the existing ViewTube component system and canonical data owners. Prefer repairing/reusing components or adding variants over copying primitives or adding a parallel UI system.

## 2. Phase 1 audit summary

### Backend and data contracts

The current Metadata Master implementation already has a useful typed package foundation:

- Goal: reach, search, browse, subscribers, revenue, authority.
- Intensity: light, balanced, aggressive.
- Style: search-first, curiosity-led, authority-led, channel-native, story-led.
- Package fields include title, thumbnail direction/text, description, tags, category, chapters, playlists, end-screen plan, schedule, locked/applied slots, score, warnings, source, and provenance.
- Generation reuses the existing `generateSeoData` capability and now accepts an optional strategy brief. Its structured title candidate schema can carry candidate-level title, thumbnail direction/text, description, tags, and category.
- Package handoff payload carries the goal, intensity, style, warnings, score, lock/apply selections, and provenance.
- A deterministic heuristic score and validation warnings are present. The UI correctly labels the score as heuristic rather than analytics evidence.
- Project and ContentBuild identifiers are represented on the package, and the UI calls the existing workspace ContentBuild context resolver.
- ActionPacket handoff already provides a boundary to Video Publisher, Video Manager, and Thumbnail Studio.

**Backend/data gaps to address in later implementation phases:**

1. Metadata packages are persisted under a versioned localStorage key, capped at 25 records, and persistence errors are silently treated as best-effort. This is a local draft layer, not durable cross-device history.
2. Candidate sets live in React component state. Only the primary candidate is saved by generation; alternative sets and the selected-set identity are not independently persisted.
3. The current history list is a small projection of saved packages, not a complete event ledger. It does not record every edit/refinement/selection and is not connected to outcome analytics.
4. Legacy records are parsed as the current TypeScript shape without normalization/backfill for fields such as style or missing identifiers.
5. Candidate styles are assigned in the UI based on candidate array index. The result schema does not return a validated explicit style identifier per candidate, so the displayed style can diverge from what the model actually produced.
6. The context resolver contributes project/content-build IDs, but the current generation call should be audited to ensure the resolved project/content context itself—not only Brain context and a few input fields—actually influences generation.
7. The current score is a deterministic completeness/quality heuristic. It must not be represented as measured performance or as evidence that a package will improve results.
8. The package model includes fields such as schedule, but not every declared field is surfaced as a fully functional editor in the current canvas. Lock/apply state and field-level actions need contract verification.
9. Save, restore, version creation, and handoff need consistent behavior and clear receipts. A successful-looking UI status must only appear after the underlying operation succeeds.

### Front-end implementation

**Already represented:**
- Context and source-material inputs.
- Goal, style, and intensity controls.
- Generate/optimize action and 1/3/5 candidate count.
- Locked component controls.
- Package canvas for title, thumbnail direction/text, description, tags, chapters, category, playlists, and end-screen plan.
- Heuristic score and validation warnings.
- Candidate cards with title, description, strategy/style, and select/use action.
- Explicit handoffs to Publisher, Manager, and Thumbnail Studio.
- Save/reset actions.

**Partially represented or missing:**
- Candidate cards do not yet provide a true field-by-field comparison or persist every alternative.
- The visible package history is embedded in Metadata Master. It is only a small list, does not restore a chosen historical version, and is not the requested dedicated history/analytics location.
- No complete edit/change timeline or analytics outcome explorer is manifested in the current Metadata Master view.
- Minimal editing mode versus optional expanded guidance/settings is not yet a clear user-controlled display preference.
- Project/ContentBuild identity and relationships are mostly implicit rather than communicated as a compact, reliable context.
- Field-level generate/refine/analyze actions and their optional visibility are not yet implemented consistently in the canvas.
- The current “applied slots” UI communicates selection, but its effect on actual downstream application needs to be proven end-to-end.
- Save/unsaved/restore status, conflict/stale-package states, and operation receipts need explicit behavior and tests.
- The UI uses the legacy `SubToolboxPrimitives` import in this view. Before adding or adjusting controls, verify the repository's canonical Studio Controls / component-library direction and use the mandated canonical primitives rather than copying or extending the legacy primitive family.

## 3. Canonical architecture boundaries

- **Project** owns project identity and the project-level workflow.
- **ContentBuild** owns the canonical content instance and lineage.
- **Asset Engine / Vault** owns canonical asset records and references.
- **Publishing Package** owns the assembled publication-ready field set and its versions.
- **Metadata Master** owns candidate generation, evaluation, selection, and assembly of proposed metadata packages. It does not silently mutate a published video.
- **Video Publisher** owns publication execution and scheduling.
- **Video Manager** owns live published-video changes.
- **Analytics** remains the canonical source for metrics.
- **Metadata Intelligence** (a dedicated tool/location) owns the user-facing exploration of metadata change history, analytics associations, evidence, observations, and learning—not day-to-day package editing.
- **AI Brain** provides contextual reasoning and can receive validated knowledge candidates through existing contracts.
- **ActionPacket/Handoff** carries explicit, reviewable transfers between tools.

Reuse the existing architecture described in `METADATA_INTELLIGENCE_HISTORY_AND_ANALYTICS_ARCHITECTURE_2026-10-06.md` and `INTEGRATED_METADATA_BACKEND_AI_BRAIN_PLAN_2026-10-06.md`. Do not create a competing analytics database, project store, Brain store, or asset store.

## 4. Ten proposed components / compound systems

These are design targets, not a mandate to create ten separate standalone React components. Compose from canonical primitives and only extract reusable components when they have a clear contract and more than one use.

1. **Project Identity + ContentBuild Context Bar**  
   Compactly shows the active project/content build, current content identity, and relevant destination. It should make context visible without turning the header into a dashboard.

2. **Project Stage / Next-Action Strip**  
   A restrained representation of where the content is in its workflow—plan, create, package, publish, performance—and the appropriate next action. It must route to existing owners rather than duplicate their workflows.

3. **ContentBuild ↔ Asset ↔ Publishing Package Relationship Map**  
   A compact relationship view showing which script/video/assets and package belong to the active content build. Use canonical IDs and asset references; do not create a second asset registry.

4. **Metadata Goal + Style + Intensity Control Cluster**  
   A compact settings cluster with distinct goal, style, and intensity meanings. Detailed explanations stay hidden until requested; the selected configuration remains visible in a small summary.

5. **Quiet Metadata Working Canvas**  
   A consistent compound layout for title, thumbnail, description, tags, chapters, category, playlist, end-screen, and other supported publishing fields. Prioritize editing space and field hierarchy over explanatory copy.

6. **Optional Field Action Rail**  
   Reusable field-level Generate / Refine / Analyze controls. Keep them hidden or compact by default and expose them through the user's display preference or a field menu. Preserve existing field content until a replacement is explicitly accepted.

7. **Metadata Candidate Compare Board**  
   Compare A/B/C or other generated candidates across the fields that actually differ, with a clear selected-working-set state. Include the candidate's validated style and provenance, not an inferred label based only on array position.

8. **Lock + Apply Scope Matrix**  
   Makes the difference between preserving a field, selecting a field for a downstream package, and applying/publishing a change unambiguous. Locking must constrain generation; apply selection must have a tested downstream effect.

9. **Save / Restore / Working-State Control**  
   Minimal saved/unsaved state, save, restore-last-save, and conflict/recovery feedback. It should preserve edits and the active package/set without interrupting the editing flow. Historical exploration beyond immediate recovery belongs in the dedicated Metadata Intelligence location.

10. **Metadata Intelligence Explorer (separate tool/location)**  
    A dedicated history and analytics workspace with filters by project, ContentBuild, video, package/version, field, operation, and time window. It should show the event timeline, before/after values, source/actor, prompt/operation provenance, analytics periods and metrics, associated observations, confidence, confounders, and any knowledge promoted to Brain. Distinguish observed facts, temporal associations, hypotheses, and stronger conclusions. Do not embed this full experience into Metadata Master.

## 5. Interaction and copy rules

- Default editing mode: low-noise, concise labels, no repeated explanatory paragraphs, no history feed, no analytics panels.
- User-controlled options may reveal: help text, field-level AI actions, advanced generation controls, provenance detail, and expanded package evaluation.
- Never overwrite a field just because a generation completed. Make acceptance/application explicit and preserve the current working draft.
- Clearly distinguish **candidate**, **selected working set**, **saved package version**, **ready for handoff**, and **published/live**.
- Clearly distinguish **heuristic score** from measured analytics.
- Keep save and generation feedback short and transient where appropriate; persistent errors must explain recovery.
- Use canonical Studio Controls and component-library variants. Do not author parallel styling in the legacy SubToolbox primitive files if the canonical studio-control system owns the control.

## 6. Delivery phases

### Phase 1 — Audit + design contract (this phase)
- Audit current package types, generation contract, persistence, context resolution, handoff, and Metadata Master UI.
- Record user decisions, architecture boundaries, ten component targets, and acceptance criteria.
- Identify mismatches between the actual code and the intended user-facing behavior.

### Phase 2 — Data contract + persistence safety
- Define/validate candidate style identity in generated results.
- Normalize legacy package records with safe defaults.
- Persist candidate sets and selected working state using the canonical package/project owner where supported.
- Establish stable operation/version identifiers and clear save/handoff receipts.
- Add tests before changing behavior.

### Phase 3 — Quiet editing UI
- Use canonical Studio Controls and existing compound components.
- Build the compact context bar, goal/style/intensity controls, working canvas, optional field action rail, compare board, and save/restore controls.
- Remove the detailed history panel from Metadata Master; link to the dedicated Metadata Intelligence location.
- Keep all current edits intact when generation, selection, errors, or navigation occur.

### Phase 4 — Dedicated Metadata Intelligence history + analytics
- Integrate with the existing metadata event and analytics architecture.
- Record generation, refinement, selection, save/version, handoff, publication, and live metadata change events with provenance.
- Associate analytics references and before/after windows without copying canonical analytics into a competing store.
- Build the separate timeline and outcome analysis workspace.

### Phase 5 — Project/ContentBuild and handoff integration
- Verify active project/content-build context reaches generation and persists through candidates, packages, assets, and ActionPacket.
- Make downstream field application and handoff outcomes observable and recoverable.
- Preserve the ownership boundary between Metadata Master, Publisher, Manager, Thumbnail Studio, Analytics, and Brain.

### Phase 6 — Certification
- Focused unit/contract tests, legacy-record tests, persistence tests, operation idempotency tests, and component interaction tests.
- Typecheck, lint, production build, source governance, and relevant existing test suites.
- Browser verification at desktop and narrow/mobile widths.
- Verify that the default editing surface is quiet, optional details can be enabled, and history/analytics are fully usable in their separate location.

## 7. Acceptance criteria

- Goal, intensity, and style are distinct, validated, persisted, and actually influence generation.
- Every candidate's declared style matches its actual generation direction and remains attached to the full candidate package.
- Every candidate can be selected, compared, edited, saved, and restored without losing its other fields.
- Existing package and project identity are preserved through persistence and handoff.
- Legacy saved data is safely normalized; failed persistence is not reported as success.
- The editing UI is low-noise by default and exposes extra guidance/actions only when requested.
- Detailed history and analytics are fully available in a separate Metadata Intelligence tool/location and are not mixed into the managing/editing workspace.
- Metrics remain owned by Analytics; project, ContentBuild, assets, and Brain remain owned by their canonical systems.
- All controls use canonical primitives/components and all changed behaviors have focused tests.
- No publishing or live-video mutation occurs without an explicit user-directed action and appropriate destination workflow.

## 8. Phase 1 open questions to resolve before implementing behavior

1. **Persistence authority:** should saved candidate sets and package versions be persisted through the existing Publishing Package / project owner immediately, or is local draft persistence an acceptable temporary fallback while the canonical persistence contract is wired?
2. **Project context display:** should the context bar always show the active project and ContentBuild names, or should it collapse to a compact identity indicator once the context is established?
3. **Optional controls preference:** should the show/hide preference for field-level AI actions and expanded guidance be per-user global, per-tool, or remembered per project?
4. **Metadata Intelligence placement:** should the dedicated history/analytics experience appear as a separate Studio Hub tool, a Project workspace destination, or both routes to one shared tool/view?
