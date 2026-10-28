# Priority Brain + Studio Integration Plan

**Target:** `master/consolidated-feature-integration`  
**Working branch:** `feature/priority-brain-context-studio`  
**Scope:** Evidence-connected AI Brain, creator/channel context intake, and Studio design-system integration.

## Guardrails
- Extend canonical owners. No second Brain runtime, evidence store, analytics engine, conversation store, creator-profile store, route registry, capability registry, or Studio primitive catalog.
- Use `src/services/brain/CreatorContextResolver.ts` as the read-only context convergence facade over channel profile, creator answers, style, project/ContentBuild, surface selection and evidence references.
- Reuse the existing IndexedDB-backed AI Brain conversation store and turn lifecycle. Persist original user text verbatim and attach evidence references to existing turn records; do not create parallel local-storage history.
- Answers may cite only the evidence pack supplied to that turn. Numerical claims must originate from canonical analytics/statistics output. Missing or stale data constrains the answer.
- Studio work uses `src/studio-ui` exports and tokens. The library must demonstrate real production primitives, not catalog-only lookalikes.
- Keep new capabilities hidden/flagged until service paths and UI are audited and tested. A review handoff is not publish approval.

## Workstream A — Evidence-connected Brain
1. Trace active Brain UI/controller through `BrainOrchestrator`, `buildBrainContextPack`, evidence resolution and conversation persistence on this branch.
2. Add regression tests for exact raw-message round trip, turn-bound evidence IDs, unsupported-number handling, missing-data limits, and retry without replaying external side effects.
3. Connect answer UI to the evidence pack already attached to the completed turn. Show the answer first, then expandable sources, freshness, limitations and calculation provenance.
4. Keep generation retry distinct from tool/action replay; preserve stable turn IDs and restoration.
5. Verify empty, stale, partial and unavailable evidence states. No fabricated evidence or confidence.
**Acceptance:** links resolve to canonical IDs from the same turn; numeric answers trace to canonical calculations; retries do not duplicate side effects; restoration tests pass.

## Workstream B — Creator and channel context intake
1. Inspect existing profile intake/settings and channel-handle/public-channel resolution before changing UI.
2. Project existing context through `resolveCreatorContext`; show channel/project/content/asset scope and missing or fallback values.
3. Route edits through existing canonical profile/answer persistence. Preserve original inputs; do not add a second profile database or browser-only source of truth.
4. Save context and interactions through existing local-first owners on desktop and mobile; show sync status only when supported.
5. Test channel/project switching, empty profile, disabled personalization, refresh/restore and partial profile completion.
**Acceptance:** no silent cross-channel fallback; saved answers survive reload through canonical persistence; context updates the next Brain turn; redundant questions are avoided.

## Workstream C — Studio design system
1. Audit `StudioControls`, token source, generated CSS and confirmed primitive catalog before edits.
2. Preserve the five-tier ladder: Supreme 60px, Standard 44px, Compact 28px, Mini 20px, Micro 12px, including explicit Mini/Micro stroke and typography rules.
3. Test field states: text inputs/textareas/textboxes keep black outer border and primary inset stroke; focus uses black text/glyph, primary 15% fill, secondary outline and primary caret. TextBox must not use primary glyphs with black text.
4. Verify split-family rails, one full-height black divider, connected edges, full-height rails and clipped labels.
5. Expand Confirmed Primitive Library with actual exported production representatives, full width, only after API/rendered behavior is verified.
6. Add visual/regression coverage for size tiers and field/split-family states.
**Acceptance:** generated CSS matches tokens; no lookalikes; representatives resolve to real exports; field focus and split anatomy match production contracts.

## Execution order
- **Phase 0 — Source audit:** compare branch with target, trace real callers/tests, identify duplicate work and branch drift.
- **Phase 1 — Integrity/evidence:** raw-message preservation, canonical turn evidence, numerical safety, retry semantics.
- **Phase 2 — Context/persistence:** profile convergence, channel scoping, reload/restore.
- **Phase 3 — Studio primitives:** field/split regressions, then catalog completeness.
- **Phase 4 — End-to-end verification:** unit/integration tests, typecheck, production build, mobile/desktop smoke tests and PR review.

## Validation policy
Do not mark work complete merely because a type/helper/page exists. Record exact commands and results. If an endpoint is unwired, label it unavailable and keep the capability gated. Reconcile the branch with the current target and pass required checks before merge.
