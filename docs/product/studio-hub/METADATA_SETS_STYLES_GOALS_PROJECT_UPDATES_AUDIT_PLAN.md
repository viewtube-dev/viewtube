# Metadata Sets, Styles, Goals, Projects & Updates — Phase 1 Audit and UI Plan

**Status:** Phase 1 audit complete; implementation plan proposed  
**Branch:** `feat/metadata-sets-styles-goals`  
**Scope:** Backend/service contracts, current Metadata Master UI, project/package identity, history/analytics boundaries, and component opportunities.

## 1. Product decisions to preserve

- Keep the normal editing workflow quiet and compact. Show very little explanatory copy, history, analytics, and secondary detail while the user is editing. Let the user explicitly turn on richer guidance/details in settings.
- Detailed history and analytics must remain fully available in a dedicated tool, tab, or separate location. Do not combine a full history/analytics workspace with the everyday metadata editing surface.
- Selecting or restoring a set edits the working package; it must not silently publish or mutate live video metadata.
- Preserve existing project, ContentBuild, Asset Engine, Brain, ActionPacket, and handoff ownership. Do not introduce a parallel project store or analytics ledger.
- Reuse canonical ViewTube primitives. For controls, the canonical design authority is `src/studio-ui/primitives/StudioControls.tsx` and `src/styles/studio-control-system.css`; use the existing Toolbox/SubToolbox shell and layout primitives where appropriate. Do not grow another feature-local control design system.

## 2. Backend / service audit

### Present and useful

- `src/services/metadataMaster.ts` defines typed goals (`reach`, `search`, `browse`, `subscribers`, `revenue`, `authority`), intensities (`light`, `balanced`, `aggressive`), and styles (`search-first`, `curiosity-led`, `authority-led`, `channel-native`, `story-led`).
- `buildMetadataStrategyBrief` supplies goal, intensity, style, coherence, differentiation, and trust guidance.
- `generateSeoData` accepts the strategy brief and the response schema allows each candidate to carry title, thumbnail prompt/text, description, tags, and category.
- The package model includes project/content-build/video IDs, editable metadata, locked/applied slots, warnings, score, generated timestamp, source, and provenance.
- Handoffs carry goal, intensity, style, metadata, warnings, score, lock/apply state, and provenance through the existing ActionPacket flow.
- The package quality score and warnings are deterministic heuristics, not observed YouTube performance analytics. The UI must identify them as readiness/quality heuristics, not predicted results or proven performance.

### Gaps and risks found

1. **Generated sets are not durably saved as sets.** The UI keeps candidate sets in component state, but `saveMetadataMasterPackage` stores only packages in localStorage. The history list is package records, not a set/decision event history.
2. **History is not a restore workflow.** The current history section shows at most five records and has no load/restore action, no filtering, no project scope, and no detailed event timeline.
3. **Saved data is browser-local and best-effort.** The service silently catches storage errors and uses the `viewtube:metadata-master:packages:v1` key. Legacy/malformed records are parsed as the current type without normalization or defaulting missing style fields. Treat this as a local draft cache, not canonical project persistence.
4. **Set identity and versioning need clearer semantics.** Each candidate gets a UUID and a version index, but there is no stable parent package ID or explicit relationship between generated set, selected set, saved snapshot, and later edits.
5. **Locked components are not demonstrably enforced in generation.** Locks are stored in state/package metadata, but the generation brief does not currently include locked slots and the candidate-application path does not visibly preserve locked values from the working draft.
6. **Applied slots are not a full application contract yet.** They are carried in the payload, but the current canvas edits all fields and the handoff sends the whole package plus the selected slot list. Downstream receivers must explicitly honor the list or it is only descriptive state.
7. **Project association can be incomplete.** Generation resolves a workspace ContentBuild context, but if that lookup is absent the package may be saved with null project/content-build identity. Add an explicit unlinked-draft state and preserve/resolve canonical identity when the user resumes a project.
8. **Candidate styles are assigned by array index.** This assumes the provider returns a correctly ordered and complete list. Validate candidate count/shape and store each candidate's actual strategy/style metadata alongside it. Do not claim a style was used if it was only assigned after generation.
9. **Provenance is a list of labels, not a full event trace.** It cannot currently explain which input/settings changed, which source evidence was used, what was generated versus manually edited, or which decision led to a saved version.
10. **No observed performance link is present in this package service.** Keep historical YouTube performance/analytics in a separate analytics/history capability, linked by canonical video/project/package IDs and timestamps. Do not infer causal lift from package score.

## 3. Front-end audit

### Already represented

- Context fields: concept, niche, audience, script/transcript, length, channel handle, reference links, optional published video ID.
- Goal, style, intensity, and set-count selectors.
- Generate/optimize action and lock controls.
- Editable package canvas for title, thumbnail direction/text, description, tags, chapters, category, playlists, and end-screen/related-video plan.
- Readiness heuristic, warnings, ephemeral package-set cards, explicit handoff buttons, save/reset actions.
- A collapsed-by-default package history section.

### Main UX issues

1. The normal workspace exposes six large numbered sections, with most sections initially open. This is too much simultaneous interface for an editing task and does not follow the user's low-noise preference.
2. The package cards only offer Select/Use. There is no durable set save/restore, duplicate, rename, pin/favorite, compare-differences, or edit-history workflow.
3. The history section is collapsed, but when opened it only shows five records and cannot restore a record. It is not the requested detailed history experience.
4. The goal/style/intensity controls are visible, but there is no compact one-line summary for the active configuration after the user collapses the configuration area.
5. The score is visually prominent while detailed supporting analysis is shallow. Present the score as a compact status by default and make rubric/evidence details opt-in.
6. The UI uses `SubToolboxPrimitives` for its controls. Audit and migrate applicable controls to the canonical Studio Controls system, preserving the canonical toolbox shell/layout rather than duplicating control CSS.
7. Playlist IDs are edited as comma-separated text, which is not a creator-friendly channel playlist selector.
8. Save feedback is only a status string; the user cannot easily distinguish saved snapshot from unsaved edits or restore a previous snapshot.
9. The reset action clears the current candidate list and creates a fresh draft; there is no unsaved-changes guard or restore-last-save path.
10. Detailed analytics, decision history, and generation events should not be added as more panels to this editing toolbox. Give them a dedicated history/analytics location with a link back to the working project/package.

## 4. Phase 1 conclusion

**Keep the current editor focused on the next decision and the current package. Move deep inspection into a separate destination.**

Default editing surface:
- compact active-project/package context;
- goal/style/intensity summary, with configuration hidden/collapsible after selection;
- current metadata fields and compact field actions;
- candidate-set strip/cards with Select and Compare;
- save status and a small set of clear next actions.

Optional detail settings:
- helper copy and explanations;
- full readiness rubric and warnings;
- generation provenance;
- advanced lock/apply controls;
- expanded package metadata.

Dedicated History & Analytics destination:
- full package and set timeline;
- generation/refinement/edit/save/restore/handoff events;
- before/after diffs by field;
- who/what changed the value and when;
- linked project, ContentBuild, video, and package identities;
- available performance metrics and source timestamps;
- goal/style/strategy decisions alongside observed outcomes, without asserting causation without evidence;
- filters, search, and restore-as-new-draft action.

## 5. Ten component / compound-system opportunities

These are candidates for reusable compositions built from canonical primitives, not ten new primitive families by default.

1. **Project & Package Context Bar** — active project/content-build/video identity, package status, and a compact switch/return affordance.
2. **Metadata Strategy Brief Control** — compact goal + intensity + style selectors, concise active summary, and optional help copy.
3. **Metadata Candidate Set Card** — title/thumbnail preview, style and goal chips, selected/saved states, and compact Select/Compare/More actions.
4. **Metadata Set Comparison Workspace** — side-by-side or field-diff comparison for title, thumbnail direction/text, description, tags, category, and other supported fields.
5. **Metadata Field Editor Row** — canonical label/input with optional Generate/Refine/Analyze actions revealed by the user's detail setting or per-field menu.
6. **Lock & Apply Field Matrix** — clear separation between “preserve during generation” and “include in handoff,” with explicit enforced semantics.
7. **Save State & Restore Control** — saved/unsaved state, last-saved timestamp, restore-last-save, and unsaved-change confirmation.
8. **Generation Run Summary** — compact status, selected configuration, candidate count, and expandable provenance/diagnostics.
9. **Package Readiness Summary** — small readiness badge by default; opt-in score rubric, warnings, evidence, and field-level recommendations.
10. **Project Update Timeline & Analytics Explorer** — a dedicated tool/location for event history, package versions, diffs, linked outcomes, filters, and restore-as-new-draft. This is intentionally separate from the editing surface.

## 6. Implementation plan after the audit

### Phase 2 — Contract and persistence integrity
- Define the relationship between project, ContentBuild, metadata package, candidate set, saved snapshot, and event.
- Add normalization/backfill for legacy local drafts (including missing style).
- Persist candidate sets and selected-set identity through the existing canonical project/package path where supported; keep localStorage only as a recoverable cache.
- Enforce locked fields during candidate creation/application.
- Define exact applied-slot behavior for handoff receivers.
- Add tests for restore, versioning, candidate ownership, legacy records, lock behavior, and no-live-mutation guarantees.

### Phase 3 — Low-noise editing UI
- Collapse configuration and secondary sections after setup; show only a compact active configuration summary.
- Keep field actions compact and reveal extra explanations/actions only when requested.
- Add clear saved/unsaved and restore-last-save behavior.
- Build candidate-card and compare compositions using canonical controls.
- Migrate feature controls to Studio Controls where appropriate.

### Phase 4 — Separate History & Analytics destination
- Build the Project Update Timeline & Analytics Explorer as a dedicated tool/location.
- Record generation, field edits, refinements, save/restore, selection, and handoff events through the existing governed project/handoff infrastructure.
- Link available analytics by canonical identities and source timestamps; distinguish observed metrics from heuristic package scores.
- Provide filters, field diffs, and restore-as-new-draft.

### Phase 5 — Verification and integration
- Unit/contract tests and typecheck.
- Test save/reload/restore and project identity preservation.
- Test that selecting/restoring never publishes or mutates live metadata.
- Verify the editing UI remains quiet by default and detail settings reveal additional copy/analysis.
- Verify the history/analytics experience is separate from the editing workflow.
- Run build, focused tests, source-governance checks, and browser interaction checks.

## 7. Verification status observed during Phase 1

Workflow run [38455639646](https://github.com/viewtube-dev/viewtube/actions/runs/38455639646):
- Production build: **passed**.
- Focused contracts and account tests: **passed**.
- Source governance and route/CSS/quarantine checks: **passed**.
- Local smoke: **passed**.
- Typecheck: **failed** due to errors reported in other existing files: `src/app/superToolViewRegistry.ts`, `src/components/CommentResponder.tsx`, `src/components/SubToolboxDesignGovernance.test.ts`, `src/components/subtoolbox/SubToolboxCompoundPrimitives.tsx`, `src/services/video-package/ProjectVideoPackageBridge.ts`, `src/services/video-package/VideoPackageRepository.test.ts`, and `src/studio-ui/StudioHubCertification.tsx`. None of the logged type errors points to the Metadata Master files, but a clean base-branch comparison is needed before calling them pre-existing.
- Full suite and other jobs were cancelled in this run; do not report the whole workflow as green.
- Vercel deployment statuses have separately reported a build-rate-limit upgrade restriction; that is not evidence of a source-code test failure.

## 8. Questions / decisions

No blocking product questions remain for Phase 1. The defaults are:
- low-noise editing;
- advanced copy/details opt-in;
- detailed history and analytics in a separate tool/location;
- package/set restore changes the working draft only;
- canonical component system and project identity remain authoritative.

Next execution step: implement Phase 2 contract/persistence fixes before adding more editing UI, so the front end represents real, durable behavior rather than adding controls around ephemeral state.
