# Project + Metadata Updates: Backend/UI Audit and Phase Plan

**Date:** 2026-10-13  
**Status:** Phase 1 audit and plan  
**Target branch:** `master/consolidated-feature-integration`  
**Working branch:** `feat/metadata-sets-styles-goals`  
**Scope:** Project-linked metadata packages, metadata sets, update/edit workflow, history, analytics, and reusable front-end component systems.

## 1. Product decisions already established

- Keep the active editing experience quiet and task-focused. Show very little secondary detail while the creator is editing, refining, or adjusting metadata.
- Let users opt into more visible controls, context, and detail through settings.
- Make detailed history and analytics fully available, but place them in their own dedicated tool or location. Do not combine an analytics/history workspace with day-to-day metadata management.
- Preserve the boundary between preparing a package, handing it off, and changing/publishing a live video. Selecting or restoring a set must never silently mutate a live video.
- Use canonical project, ContentBuild, Asset Engine, ActionPacket, and handoff relationships. Do not create a parallel project/asset ledger.
- Compose new experiences from canonical ViewTube primitives and components. Do not establish a competing component/CSS system.
- Preserve existing Video Publisher and Video Manager ownership boundaries.

## 2. Phase 1 audit findings

### Backend / state model

**Already present in the current Metadata Master implementation**
- A package model with project/content-build/video references, metadata fields, goal, intensity, style, score, warnings, locked/applied slots, timestamps, and provenance.
- A generation brief that passes goal, intensity, and style guidance into the existing SEO generation service.
- Candidate set construction, deterministic preferred-style-first ordering, style/strategy labels, package validation/scoring, and an ActionPacket handoff payload.
- A best-effort browser-local package save and a recent-package listing.

**Gaps and risks to address**
1. **Persistence is local and best-effort.** Packages are stored in browser localStorage, capped at 25 records. This is not a durable, cross-device/project-history source of truth and save failures are intentionally swallowed.
2. **Sets are not durable as sets.** The generated `sets` collection and selected-set ID live in React component state. The package save function stores packages, not a complete set collection with set identity, comparison relationships, and selected state.
3. **History is not an event history.** The current history list is reconstructed from saved package records. It does not represent a reliable timeline of edits, generations, refinements, comparisons, decisions, restores, handoffs, or publishing outcomes.
4. **Analytics are not a first-class capability here.** The package score is a heuristic readiness score, not performance analytics. The UI must not present it as evidence of actual reach, CTR, retention, subscriber conversion, or revenue impact.
5. **Candidate differentiation needs verification.** The strategy brief requests coherent, distinct packages, but the current result adaptation can fall back to shared description/tags/category/thumbnail values when a title candidate does not supply alternatives for those fields. Candidate completeness and true differentiation need tests and, if required, a generation-contract adjustment.
6. **Backward compatibility needs a normalization path.** Previously saved local records may not contain the newer `style` field. Reads should normalize legacy records safely instead of trusting the current TypeScript type.
7. **Project association needs an explicit lifecycle.** Verify how packages are listed, restored, and separated by `projectId`, `contentBuildId`, channel, and video. Avoid mixing packages from different projects.
8. **Handoffs must carry provenance and explicit intent.** Keep the package, project/build/video references, selected metadata, settings, warnings, and relevant evidence together; require explicit review before downstream mutation.

### Front-end / interaction model

**Already present**
- Context fields, goal/style/intensity controls, source material, generation scope, a metadata package canvas, package readiness/warnings, candidate set cards, apply-to-downstream toggles, save/reset actions, and handoff buttons.
- Existing Toolbox/SubToolbox layout and primitive usage in the current view.

**Gaps and risks**
1. **Settings compete with editing.** Context, goal, style, and intensity are presented in the main working flow. Advanced configuration should be progressively disclosed and its visibility controlled by a user preference.
2. **History is embedded in the management screen.** A collapsible “Package History” section currently shows only the five most recent saved packages. Move detailed history and analytics to a dedicated tool/location; keep only a quiet, optional link or last-saved hint in the editor.
3. **Comparison is shallow.** Current set cards emphasize title and a truncated description. A useful comparison needs field-level differences, the style/goal context, and clear select/restore semantics without crowding the editing canvas.
4. **Saving and selecting are underspecified.** Clearly distinguish working draft, selected candidate, saved package, restored version, and handoff-ready package. Selecting a set changes the working draft; it must not imply publication.
5. **Editing feedback must remain low-noise.** Keep warnings, scores, provenance, and detailed reasoning available on demand or through a display preference. Do not persistently dominate the editing workspace with analysis panels.
6. **Field-level controls need a consistent pattern.** Generate/refine/analyze actions should be available when relevant, but compact and consistent with canonical primitives. Do not add a permanent row of noisy actions to every field by default.
7. **Real analytics and heuristic assessment need different labels and locations.** The readiness score and validation warnings belong to the editing flow in a compact form; actual performance history and analysis belong in the dedicated history/analytics surface.

**Visual audit limitation:** These findings are grounded in source-code inspection. A live browser screenshot audit is still pending because the browser capture task has not returned a completed result; do not treat this source review as visual verification.

## 3. Recommended low-noise editing behavior

Default editing mode:
- Show the project/video identity, current package fields, the primary generate/save actions, and a compact saved/unsaved state.
- Keep advanced goal/style/intensity controls collapsed behind “Generation settings.”
- Keep verbose scores, warnings, provenance, candidate diagnostics, and event detail behind a disclosure or the user's chosen detail setting.
- Avoid displaying the detailed history list or analytics charts in the editor.
- Preserve the user's display preference across sessions.

Optional display preferences:
- **Focus:** editing controls and essential status only.
- **Standard:** editing controls plus concise package warnings and candidate labels.
- **Detailed:** expose goal/style/intensity, score breakdowns, provenance, and more comparison context in the editor.
- Detailed history and analytics remain available in their own tool regardless of editor display preference.

## 4. Ten component / compound-system proposals

These are proposed components or compositions, not ten new primitives. Reuse the canonical component library and add a new primitive only if a genuine reusable capability is missing.

1. **Project Metadata Identity Header** — compact project/video identity, ContentBuild association, current package status, and a clear project switch/context affordance.
2. **Metadata Working-State Strip** — quiet state indicator for Draft / Unsaved / Saved / Restored / Handoff Ready, with only the primary next action.
3. **Metadata Package Canvas** — responsive composition of title, thumbnail brief, description, tags, chapters, category, playlists, end-screen, and schedule fields using existing primitives.
4. **Metadata Field Action Rail** — a consistent, optionally revealed Generate / Refine / Analyze / Restore action group for a focused field; hidden by default when the user prefers Focus mode.
5. **Generation Settings Disclosure** — compact expandable panel for goal, intensity, style, and generation count, honoring the user's display preference.
6. **Metadata Set Card** — concise candidate identity, style/goal summary, key field previews, selected state, and explicit Select / Save actions.
7. **Metadata Difference Compare Matrix** — side-by-side or field-by-field comparison that highlights only differences across candidate sets and allows choosing fields without forcing a full-package switch.
8. **Review Changes / Apply Drawer** — explicit before/after diff, locked-field protection, selected-field apply, and confirmation before handoff or live-video update.
9. **Project Update Queue / Handoff Panel** — a focused list of proposed metadata changes and target workflows, preserving project/build/video identity and requiring explicit review before mutation.
10. **Project History & Metadata Analytics Explorer** — a separate tool/location for detailed event timeline, package/version snapshots, generation and refinement history, decisions, handoffs, publish/update records, and performance metrics when connected data is available. Do not embed this detailed explorer in the day-to-day editor.

## 5. Phase plan

### Phase 1 — Audit and product contract (this document)
- Inspect the current package/service model and Metadata Master UI.
- Record the existing behavior, gaps, ownership boundaries, and the ten component proposals.
- Capture the low-noise editing rule and separate history/analytics requirement.
- Confirm the two unresolved product choices listed below.

### Phase 2 — Canonical package and set persistence
- Define the canonical package/set/version/event contracts and migrations for legacy records.
- Persist set identity, all candidate fields, selected state where appropriate, goal/intensity/style, project/build/video association, provenance, and meaningful edit/generation decisions.
- Scope all reads/writes to the correct project/channel/build.
- Reuse existing canonical persistence/Project/ContentBuild infrastructure where available; do not create an isolated long-term store.
- Add tests for old records, set save/restore, project separation, and handoff payload integrity.

### Phase 3 — Quiet metadata editing workspace
- Recompose the editor around the working package.
- Move advanced settings behind a disclosure and add Focus / Standard / Detailed preference.
- Build the Metadata Set Card and Difference Compare Matrix using existing primitives.
- Add explicit unsaved state, field-level actions, and review-before-apply behavior.
- Remove the embedded detailed history list; retain only a low-noise link to the dedicated history/analytics surface.

### Phase 4 — Dedicated Project History & Metadata Analytics
- Build a separate Studio Hub tool or project-history location.
- Show a filterable timeline of meaningful events: generated, refined, edited, selected, saved, restored, compared, handed off, published, and updated.
- Show before/after snapshots and provenance with project/video filters.
- Show performance analytics only when backed by actual channel/video analytics data; label heuristic package quality separately.
- Keep event capture lightweight and avoid recording every keystroke by default.

### Phase 5 — Project updates and workflow handoffs
- Add explicit change review and update queue.
- Connect package handoffs to Video Publisher, Video Manager, Thumbnail Studio, and other supported tools using ActionPacket and canonical IDs.
- Require explicit confirmation for live-video changes and preserve existing ownership boundaries.
- Verify that project updates and decisions can be traced from package to handoff and, where available, resulting performance.

### Phase 6 — Verification and rollout
- Run unit/contract tests for package normalization, persistence, candidate distinction, and handoffs.
- Run typecheck, lint, production build, source-governance checks, and focused browser interaction tests.
- Complete screenshot-based UI/accessibility review across desktop and mobile.
- Do not merge into `master/consolidated-feature-integration` until relevant required checks are green and unrelated baseline failures are distinguished from regressions.

## 6. Acceptance criteria

- Goal, intensity, and style alter generation instructions and persist with the selected candidate.
- Each candidate's fields are meaningfully distinct where the generator claims they are; missing variants are not disguised as distinct packages.
- Sets and package versions can be saved and restored with project-safe scoping and legacy normalization.
- The editing default is quiet; advanced information is available through user-controlled display settings.
- Detailed history and analytics are available in a separate tool/location, not mixed into the main metadata management workspace.
- Actual analytics are sourced from real performance data; heuristic scores are labeled as heuristics.
- Selecting/restoring a candidate never publishes or mutates a live video.
- All new UI composes canonical primitives/components and follows the canonical studio control system.
- Project/build/video identity and provenance survive supported handoffs.
- Automated checks and visual verification are recorded truthfully before merge.

## 7. Product questions for confirmation

1. **History placement:** Unless you prefer otherwise, should Phase 4 create a dedicated **Project History & Metadata Analytics** tool in Studio Hub, with filters for project, content build, and video?
2. **Event detail:** Unless you prefer otherwise, should history capture meaningful milestones and saved before/after snapshots (generation, refinement, edits saved, set selection, restore, handoff, publish/update) rather than every keystroke? This keeps the audit trail useful without making normal editing noisy or excessively heavy.
