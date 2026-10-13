# Metadata + Projects Front-End / Backend Audit and Phase 1 Plan

**Date:** 2026-10-13  
**Scope:** Metadata Master, publication packages, project/content-build linkage, metadata updates, and the front-end components that represent them.  
**Branch:** `feat/metadata-sets-styles-goals`  
**Status:** Phase 1 audit complete; implementation plan proposed.  
**Live UI inspected:** https://viewtube-system-convergence.onrender.com/studio

## 1. User decisions that govern this plan

- Keep the normal editing experience low-noise. Do not show detailed history, analytics, provenance, or diagnostic detail while a user is making ordinary edits unless they enable those details in settings or explicitly open them.
- Make detailed history and analytics fully available in a dedicated tool/location. Do not combine that workspace with the day-to-day metadata management surface.
- Keep project, ContentBuild, package, and asset identity connected to the existing canonical systems. Do not create parallel project/package/asset stores.
- Selecting, editing, saving, or restoring a package must not publish it or silently mutate live YouTube metadata.
- Reuse canonical Studio Controls primitives and shared components. Do not extend the legacy SubToolbox primitive system for new canonical controls.

## 2. Audit summary

### Front end — observed in the deployed Studio

The public Studio page eventually loaded after a Render cold-start interstitial. Metadata Master is mounted and exposes five primary areas: Context, Generate & Optimize, Publication Package Canvas, Evaluate & Compare, and Handoff & Publishing Control. It also has a collapsed Package History section.

Observed current UI state:
- Projects / Packages showed **No projects available**; Load and Swap In were disabled.
- Video Manager requested a YouTube channel connection before it could load videos.
- Metadata Master showed an empty working package, a heuristic readiness score of **34/100**, and warnings for missing title, description, tags, and thumbnail direction.
- The generation scope selector offered 1, 3, or 5 package sets.
- Goal, intensity, and style settings were present in the current source/UI.
- Save Package, Reset Working Package, Send to Publisher, Send Thumbnail Brief, and Propose Live Update were visible.
- The page showed **MISSING API KEY: SETTINGS**. Generation could not be validated end-to-end without configuring the key; no settings, authentication, or data mutation was attempted.

Sources:
- Live Studio: https://viewtube-system-convergence.onrender.com/studio
- Settings destination shown by the warning (not opened): https://viewtube-system-convergence.onrender.com/settings

### Front-end source observations

Source inspected:
- `src/views/MetadataMaster.tsx`
- `src/services/metadataMaster.ts`
- `src/services/gemini.ts`
- `src/services/metadataMaster.test.ts`

Findings:
1. Metadata Master already has context fields, goal/intensity/style controls, generation count, locked fields, a package canvas, score/warnings, candidate cards, handoff actions, and a collapsed history section.
2. Candidate cards currently show title, description, score, strategy, and style, but do not provide a strong side-by-side field-level comparison or a clear changed-fields preview.
3. Package history currently renders only the latest five saved package entries in the Metadata Master view. The service stores at most 25 package records in browser localStorage.
4. The history card is a display-only summary in the inspected component; it does not expose a complete version timeline, detailed change diffs, event filters, or analytics.
5. The current UI is built from `Toolbox` / `SubToolbox` and `SubToolboxPrimitives` imports. New canonical UI work should use `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`, composing existing shared layouts rather than adding more feature-local control styling.
6. The package canvas represents title, thumbnail direction/text, description, tags, chapters, category, playlist IDs, end-screen plan, and schedule. Playlist IDs are currently edited as a comma-separated text input rather than a channel-connected picker.
7. The visible package score is explicitly labelled heuristic. It should be treated as a completeness/quality aid, not a prediction of performance.
8. The component keeps generation candidates in view state. The package service persists package records, but the candidate-set collection itself is not persisted as a first-class saved set collection in the inspected service.
9. The package service catches localStorage failures silently. The interface can therefore report “saved” without a durable server-side persistence guarantee.
10. Package context can receive project/content-build/video identifiers through the existing workspace resolver, and handoff uses the existing ActionPacket flow. Preserve that integration.

### Backend / service-layer observations

In the inspected code, metadata generation is invoked from the client through `generateSeoData` and the configured Gemini client. The inspected Metadata Master package service is a client-side domain/persistence layer, not evidence of a durable server API.

Existing capabilities:
- Typed package model with projectId, contentBuildId, videoId, goal, intensity, style, metadata fields, lock/apply selections, warnings, score, timestamps, source, and provenance.
- Deterministic package scoring and validation warnings.
- Generation strategy brief containing goal, intensity, and style guidance.
- Package-to-handoff serialization preserving goal, intensity, style, score, warnings, locks, applied slots, and provenance.
- ActionPacket handoff to Publisher, Manager, or Thumbnail Studio.

Gaps / risks:
- Browser localStorage is the persistence mechanism observed in `metadataMaster.ts`; it is browser-local, best-effort, and capped at 25 package records. It is not a shared project-level source of truth.
- Legacy stored records are parsed as the new TypeScript package type without a normalization/backfill layer. Newly required fields such as `style` may be absent from older saved records.
- Saved metadata sets are not persisted as a complete collection with their own IDs, labels, style, strategy, package snapshot, and selection history.
- The inspected package model does not provide a structured event log for edits, refinements, generation attempts, decisions, apply operations, handoffs, or publication outcomes.
- No evidence from this source slice establishes durable cross-device history or complete performance analytics. Those must integrate with existing project, analytics, and event infrastructure if available; do not invent a parallel analytics store.
- The current candidate-style mapping is a prompt direction, not proof of five independent generation algorithms. The UI must not claim more algorithmic separation than the generator provides.
- Current score/warnings are useful local checks but do not establish YouTube ranking, CTR, retention, revenue, or causal performance outcomes.

## 3. Phase 1 objective

**Make the canonical project and metadata package state clear, safe, and recoverable before expanding analytics or history.**

Phase 1 is a design and contract phase with a small implementation boundary:
1. Define the project → ContentBuild → publication package → metadata set relationships.
2. Define what is saved, what is a working draft, what is selected, and what is merely proposed.
3. Define a low-noise default editing surface and an opt-in detail setting.
4. Define explicit preview/apply boundaries for metadata updates.
5. Define the dedicated history/analytics destination and its data contract, without embedding its detailed views in Metadata Master.
6. Record component contracts and acceptance checks before implementation is expanded.

## 4. Recommended primary workflow

`OPEN PROJECT / CONTENT BUILD → LOAD WORKING PACKAGE → EDIT OR GENERATE → REVIEW CHANGES → SAVE DRAFT → EXPLICIT HANDOFF`

For a published video, any live update must be an explicit proposal passed to Video Manager for review. Metadata Master must not directly publish or mutate live metadata.

### Low-noise defaults

Default editing view shows:
- project/video identity and a compact status;
- goal, intensity, and preferred style;
- the current metadata fields;
- candidate sets;
- one compact readiness state;
- primary actions: Generate/Optimize, Save, Compare, and Send/Handoff where applicable.

Default editing view hides:
- full event history;
- detailed provenance/evidence;
- detailed score breakdown;
- analytics charts and performance timelines;
- internal diagnostic information.

An explicit **Show details** preference may expose relevant diagnostic detail in the editing surface. Full history and analytics remain available in their own dedicated tool/location regardless of that preference.

## 5. Ten proposed component systems

### 1. Project Identity & Scope Header
**Purpose:** Make the active project, ContentBuild, target video, and package status unambiguous.  
**Composition:** Project selector/identity, ContentBuild label, published/unpublished state, compact saved/dirty indicator, link to project.  
**Acceptance:** Every action operates on an explicit canonical project/build/video context or clearly says it is an unlinked draft.

### 2. Project ↔ ContentBuild ↔ Package Relationship Map
**Purpose:** Show how the working package relates to its owning project, build, video, and referenced assets without creating another project system.  
**Composition:** Compact relationship chips or expandable lineage view; canonical IDs remain internal unless details are opened.  
**Acceptance:** Uses existing canonical IDs and resolvers; missing links are visible and recoverable.

### 3. Project Update Snapshot
**Purpose:** Summarize meaningful current changes to the project/package without showing a noisy event feed during editing.  
**Composition:** Compact “Unsaved changes” / “Saved” state, count of changed fields, last successful save; optional expanded diff.  
**Acceptance:** Distinguishes local edits from saved package state and does not claim server persistence when only local persistence succeeded.

### 4. Metadata Optimization Brief
**Purpose:** Let the user set intent without making configuration dominate the editing surface.  
**Composition:** Goal, intensity, preferred style, concise helper copy, compact summary; details can collapse.  
**Acceptance:** Settings affect generation and persist with each candidate/package; no hidden defaults are misrepresented.

### 5. Metadata Package Canvas
**Purpose:** Make the current working package the primary editing surface.  
**Composition:** Canonical title, thumbnail, description, tags, chapters, category, playlists, end-screen, schedule, and other supported fields, composed from canonical Studio Controls.  
**Acceptance:** Uses shared primitives; field edits update the working draft only; no live mutation.

### 6. Metadata Set Gallery & Candidate Card
**Purpose:** Make coherent alternatives easy to identify and select.  
**Composition:** Candidate label, title, thumbnail direction, compact description, style/goal summary, score label, selected state, select/save actions.  
**Acceptance:** Each saved set persists its complete package snapshot and settings; candidate styles are shown accurately; selecting a set restores a draft, not a live video.

### 7. Change Preview & Apply Matrix
**Purpose:** Show exactly what will change before a package is handed off or a published video update is proposed.  
**Composition:** Field-by-field current vs proposed values, changed-field indicators, apply checkboxes, locked-field protection, confirm action.  
**Acceptance:** Never applies changes to a live video without an explicit confirmation and the Video Manager ownership path.

### 8. Field Action Rail (Quiet by Default)
**Purpose:** Offer Generate, Refine, Analyze, and alternative-selection actions for individual fields without crowding normal editing.  
**Composition:** Canonical split-left/action buttons and dropdowns; hidden/collapsed by default unless the user enables detailed field actions.  
**Acceptance:** Default editing stays low-noise; actions are consistent across fields and use shared components.

### 9. Package Save / Restore & Recovery Controls
**Purpose:** Make save, restore, draft recovery, and persistence status reliable.  
**Composition:** Save state, Restore saved set, Restore last save, unsaved-change warning, local-vs-durable persistence indicator where relevant.  
**Acceptance:** Old records are normalized; failures are visible; restore behavior is predictable; persistence follows the canonical project/package contract.

### 10. Metadata History & Performance Analytics Workspace (separate tool)
**Purpose:** Provide complete history and analytics without mixing them into everyday metadata management.  
**Composition:** Dedicated timeline of generations, edits, refinements, selections, saves, handoffs, applied updates, and publication events; filters by project/build/video/date/event; version diff; outcome metrics and links to the platform analytics source.  
**Acceptance:** Detailed history and analytics are fully accessible here; Metadata Master only shows a compact link/status by default. Analytics distinguishes correlation from causation and clearly identifies missing data.

## 6. Phase plan

### Phase 1 — Audit, contracts, and design decisions
- Complete source and deployed-UI audit (this document).
- Confirm canonical project/build/package/set identities and ownership boundaries.
- Define low-noise default and opt-in details behavior.
- Define package/set persistence and backward-compatible normalization.
- Define change-preview/apply behavior.
- Define the separate history/analytics workspace and event contract.
- Audit available existing analytics/event services before proposing storage or APIs.

### Phase 2 — Package and set reliability
- Add backward-compatible package normalization for legacy browser records.
- Persist complete candidate sets and selected-set metadata using the existing canonical project/package infrastructure where available.
- Make save failures and persistence scope explicit.
- Add focused tests for save/restore, set selection, style/goal/intensity restoration, and handoff payloads.

### Phase 3 — Canonical low-noise UI
- Build/reuse the ten component systems above, beginning with Project Identity, Optimization Brief, Package Canvas, Set Gallery, Change Preview, and Save/Restore.
- Use `StudioControls.tsx` and `studio-control-system.css` for canonical controls.
- Keep field-level actions and detailed diagnostics hidden/collapsed by default with a user preference to display them.

### Phase 4 — Separate history and analytics
- Build the dedicated workspace on existing analytics and event infrastructure.
- Add full version/event timeline, field diffs, filters, provenance, and performance metrics where data exists.
- Link to it from Metadata Master without embedding detailed analytics into the editor.

### Phase 5 — Verification
- Unit tests for normalization, package/set persistence, diff/apply safety, and event contracts.
- Interaction tests for generate/select/edit/save/restore/handoff.
- Browser verification for desktop and mobile.
- Verify empty, unavailable-project, missing-key, stale-context, save-failure, and generation-failure states.
- Confirm no live mutation occurs without explicit review.
- Run focused tests, typecheck, lint, and production build before merge.

## 7. Questions for product decisions

These are the remaining decisions that materially affect the contract:

1. **Project scope:** Should an unlinked metadata draft be allowed, or must users choose a Project/ContentBuild before saving a package?
2. **Saved set ownership:** Should candidate sets live inside each publication package version, or should users be able to promote a set into a reusable named template across projects? Recommendation: package-scoped by default; reusable templates can be a separate future feature.
3. **Restore behavior:** Should “Restore” replace the working draft immediately, or first show a diff/confirmation when unsaved edits exist? Recommendation: confirm only when unsaved edits would be overwritten.
4. **Apply behavior:** For unpublished packages, should selected fields be prepared for Publisher as a package; for published videos, should every proposed field change require explicit review in Video Manager? Recommendation: yes to both.
5. **Details preference:** Should detailed field actions and diagnostics be controlled by one global Studio preference, or separate preferences for field actions and diagnostics? Recommendation: separate toggles so users can show actions without showing diagnostics.
6. **Analytics scope:** Should the dedicated history/analytics workspace be project-first with video-level filters, or video-first with project/build context? Recommendation: project-first, with filters for build and video.
7. **History retention:** Should the product show all available events indefinitely, or use a retention policy based on available storage/source systems? Recommendation: surface all history available from the canonical source and disclose any retention limits rather than promising indefinite retention.

## 8. Phase 1 exit criteria

- [ ] Canonical identity and ownership contract documented.
- [ ] Low-noise default and opt-in detail preference defined.
- [ ] Package/set save, restore, and legacy normalization contract defined.
- [ ] Change preview and live-update safety boundary defined.
- [ ] Dedicated history/analytics location and event contract defined.
- [ ] Existing analytics/event infrastructure inspected before adding new storage.
- [ ] Product questions above resolved or defaults explicitly accepted.
