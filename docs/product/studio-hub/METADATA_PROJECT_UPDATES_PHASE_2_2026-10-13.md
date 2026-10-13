# Metadata + Project Updates — Phase 2: History Foundation

**Date:** 2026-10-13  
**Branch:** `feat/metadata-project-updates-phase-2`  
**Status:** Implementation in progress  
**Canonical base:** `master/consolidated-feature-integration`

## User decisions to preserve

- Keep the active editing/management workspace quiet. Show very little supporting information while a creator is making edits, refinements, or adjustments by default.
- Allow the creator to opt into more visible configuration/status detail through settings.
- Make detailed history and analytics fully available in a distinct History / Analytics tool or location. Do not combine the detailed history and analytics workspace with the live-video management workflow.
- Use existing canonical ViewTube components and data owners. Do not create a parallel project, ContentBuild, package, analytics, Brain-memory, or event store.

## Phase 2 objective

Build a durable, inspectable history foundation linking metadata candidates and package versions to their Project/ContentBuild identity, creator/AI operations, publication events, live changes, and analytics references.

The canonical event owner is `src/services/asset-engine/ContentBuildRepository.ts`. Metadata history is a typed projection over the existing ContentBuild event stream, not a separate localStorage history ledger.

## Audit findings

### Backend

1. `ContentBuildEvent` already provides event IDs, ContentBuild identity, timestamps, actor/tool IDs, before/after state, asset references, generation receipt IDs, ActionPacket IDs, trace IDs, and metadata.
2. `ContentBuildRepository` already persists and queries events. New metadata history should extend this event vocabulary and reuse `appendContentBuildEvent` / `listContentBuildEvents`.
3. The current Metadata Master package service stores a bounded working-package list in localStorage. That is useful for draft restoration but is not a complete, immutable history ledger.
4. Metadata generation already carries goal, intensity, style, and provenance, but the user needs those details linked to versioned events rather than relying on the currently visible working form.
5. Analytics must remain canonical in the existing Analytics system. History records should hold references to metric sources/windows and observations, not become a competing analytics store.

### Front end

1. Metadata Master currently shows context, goal/style/intensity, generation scope, locked components, package fields, evaluation, comparison, handoff, and a local history list in the same workspace.
2. The detailed timeline/analytics experience should be separated from the editing surface.
3. Default editing mode should prioritize metadata fields and the immediate actions. Advanced configuration and operational detail should be opt-in.
4. Package state must distinguish generated, selected, edited, saved, handed off, and published. Selecting a candidate must never silently mutate a live video.

## Implemented in this slice

- Extended the canonical ContentBuild event type union with metadata/package/publication/analysis event families.
- Added `src/services/metadataHistory.ts`, which projects package versions, field-level changes, live metadata changes, publication events, and analytics associations into the canonical ContentBuild event stream.
- Added focused contract tests in `src/services/metadataHistory.test.ts`.
- Connected Metadata Master generation, default candidate selection, explicit candidate selection, and save operations to the history service when a canonical `contentBuildId` is available.
- Connected successful Video Manager metadata saves to canonical history for known ContentBuild/video bindings; visibility and playlist changes are recorded separately from field edits.
- Connected successful, remotely verified publishing transactions to a `package.published` event that references the approved snapshot and canonical Video Package. Repeated completion calls do not duplicate the publication event.
- Kept the existing package draft persistence intact; it is not used as the history ledger.
- Collapsed the Context / Optimization Brief, Evaluate / Compare, and Handoff / Publishing Control sections by default. Generation and the working package remain immediately available; saved-package summaries stay separate from the detailed event timeline.

## Event coverage

The shared event vocabulary now supports:

- metadata created, refined, replaced, and selected;
- package created, versioned, and published;
- published metadata changes;
- title, thumbnail, description, and tags changes;
- publishing-setting changes;
- analysis completion, observation recording, and knowledge promotion;
- analytics checkpoints that reference canonical metric sources and before/after windows.

Each event should retain as available: project ID, ContentBuild ID, video ID, metadata package ID/version, field, previous value, next value, operation/operation ID, actor/tool, prompt version, reason, provenance, and timestamp.

A missing ContentBuild ID must not cause a second store to be created. In that case the helper does not write a non-canonical history record; callers should surface an appropriate context/persistence status.

## Low-noise interaction rule

Default editing view:

- metadata inputs and primary edit actions;
- only essential save/apply status;
- compact selected-set/style identification when relevant;
- no always-open event timeline, analytics charts, provenance blocks, or verbose scoring explanations.

Opt-in detail settings may reveal:

- generation configuration and provenance;
- lock/apply state;
- scores and warnings;
- event/version details;
- evidence and analytics references.

Full history and analytics remain accessible in a separate History / Analytics workspace. The editing workspace may show a compact link or count, but not a detailed timeline or analytics dashboard.

## Ten component / compound-system candidates

Build these only from canonical Studio Controls / toolbox primitives and existing component families where possible.

1. **Metadata Field Action Row** — field input plus compact Generate / Refine / Analyze / Alternatives actions; action visibility follows the quiet-mode preference.
2. **Metadata Goal–Style–Intensity Brief** — compact configuration group with one-line descriptions and a collapsed advanced state.
3. **Metadata Candidate Package Card** — coordinated title, thumbnail direction, description, tags, goal, and style, with Select / Compare / Save.
4. **Package Comparison Matrix** — side-by-side field differences across two to five candidate packages, with per-field winner/selection and no forced whole-package replacement.
5. **Selected Package Composer** — safely combines selected fields into the working package and shows which values are from the current draft, a candidate, or manual edits.
6. **Project Metadata Status Strip** — compact project/ContentBuild/package identity and save state; expands only when requested.
7. **Publication & Metadata Timeline** — a separate, filterable event timeline with event type, actor, timestamp, operation, package version, and linked video/project identity.
8. **Before / After Change Inspector** — field-level previous/next values, reason, actor, operation ID, and links to the originating package version.
9. **Analytics Outcome Observation Card** — metric references, before/after windows, observed changes, confidence, confounders, and explicit observed/associated/hypothesized/concluded labels.
10. **Evidence & Provenance Drawer** — on-demand details for prompt version, generation receipt, ActionPacket/trace, source context, analytics references, and learned-knowledge status.

## Phase 2 implementation plan

1. **Canonical event schema** — done in this branch; validate compatibility against ContentBuild event consumers.
2. **Package/field event builder** — done in this branch; deterministic diff and event projection covered by focused tests.
3. **Metadata Master recording hooks** — done in this branch for generated candidates, selected candidate, and package saves when ContentBuild scope is available.
4. **Live Manager change integration** — implemented for successful core metadata writes and visibility/playlist settings when the published video already has a canonical ContentBuild binding. Thumbnail asset lineage and unbound legacy videos remain follow-up cases.
5. **Publication transaction integration** — implemented: a verified successful publish writes `package.published` against the canonical ContentBuild event stream and references the approved snapshot/package; repeated completion is idempotent.
6. **History query/projection** — implemented as a ContentBuild event filter; validate project, ContentBuild, video, package, event-type, and time-range filtering as the UI query contract is added.
7. **Dedicated History / Analytics location** — next: render the detailed timeline and outcome analysis outside the Video Manager editing workspace.
8. **Quiet-mode UI settings** — partially implemented: advanced context, evaluation, and handoff sections are collapsed by default. A persisted user preference to reveal selected detail levels remains next.
9. **Tests and gates** — focused service tests and publication idempotency coverage added; full suite, typecheck, production build, source governance, and browser checks are running or remain to be verified.

## Acceptance criteria

- A package creation or save is reconstructable from canonical ContentBuild events.
- Field-level changes retain previous and next values without recording every keystroke.
- Generated alternatives, selected candidates, and manual saves are distinguishable.
- Live metadata history is written only after a successful live mutation.
- Publication events link to the actual published package/version.
- Analytics references point to the canonical Analytics source and do not copy a second analytics database.
- The detailed timeline/analytics experience is separate from editing/management.
- Advanced details are opt-in; default editing remains visually quiet.
- Selecting/restoring a candidate never silently publishes or mutates live metadata.
