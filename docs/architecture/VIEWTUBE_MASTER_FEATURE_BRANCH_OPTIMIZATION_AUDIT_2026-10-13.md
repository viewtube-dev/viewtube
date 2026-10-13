# ViewTube Master Feature Branch Optimization — Baseline Audit

**Audit date:** 2026-10-13  
**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Inspected commit:** `634e5339c58c0eed2c506a3e21bd7db11d7c2f98` — [Restore transparent animated toolbox collapse controls](https://github.com/viewtube-dev/viewtube/commit/634e5339c58c0eed2c506a3e21bd7db11d7c2f98)  
**Audit mode:** GitHub source/document inspection; no local build, test, browser, or live deployment execution performed in this pass.  
**Status:** Phase 0 started; initial static baseline recorded. This is not a claim that the full application has been audited or certified.

## 1. Executive assessment

The repository already contains substantial foundations for the intended end-to-end lifecycle. The optimization problem is primarily **convergence, contract verification, workflow continuity, and UI consistency**, not starting over or creating parallel systems.

The inspected source includes:
- a shared `ProjectManifestation` component used by Video Manager and Video Publisher;
- project-to-ContentBuild identity initialization;
- canonical ContentBuild and Video Package repositories and bridge/projection services;
- publishing transaction and approved-publish-snapshot modules;
- tests for project identity, Project Manifestation, ContentBuild, Video Package, and publishing projections;
- dedicated Toolbox/Subtoolbox production primitives, a component-library catalog, and existing architecture/audit documentation.

The next step is to verify these pieces together in the running application and map the remaining gaps. A passing unit test for one service is not proof that state survives the entire Project → ContentBuild → assets → publishing package → publication → analytics path.

## 2. Branch and verification baseline

### Repository snapshot
- The branch search returned `master/consolidated-feature-integration`.
- The latest commit returned by the repository commit search was `634e5339c58c0eed2c506a3e21bd7db11d7c2f98`, focused on restoring transparent animated Toolbox/Subtoolbox collapse controls while preserving keyboard focus and reduced-motion behavior.
- The repository's `package.json` defines build, typecheck, lint, full Vitest, focused tests, component-library build/certification, architecture/governance checks, convergence audits, release preflight, and live verification scripts.
- These scripts have **not** been executed as part of this GitHub-only inspection. CI status and the actual deployed commit remain unverified.

### Available verification commands

Run in the project checkout after confirming the working tree and environment:
1. `npm run typecheck`
2. `npm run check:architecture`
3. `npm run check:css`
4. `npm run test:convergence-governance`
5. Focused identity/package/publishing/UI tests (listed below)
6. `npm test`
7. `npm run build`
8. `npm run lint:runtime` (then broader lint if feasible)
9. Release preflight and live verification only after the build/test baseline is understood.

Do not interpret a command as passing until its output and exit status have been observed.

## 3. Initial capability inventory

| Domain | Source evidence found | Initial assessment | Required next verification |
|---|---|---|---|
| Project identity | `src/services/projects/ProjectContentIdentityService.test.ts` | Tests cover deterministic identity, idempotent resolution, existing IDs, and missing channel scope. | Verify all project-creation, load, migration, and recovery entry points call the canonical service. |
| Project manifestation | `src/components/projects/ProjectManifestation.tsx`, `projectManifestation.ts`, and `projectManifestation.test.ts` | Shared project/package presentation and basic identity/thumbnail selection contracts exist. | Verify load/save/swap/refresh against persisted data in both Manager and Publisher, including error and stale-state handling. |
| ContentBuild | `src/services/asset-engine/ContentBuildRepository.ts` and related tests | Canonical repository and asset-selection test coverage exist. | Trace mutations through Project Builder, Board/Calendar, Studio Hub, Asset Engine, and publisher; check durable persistence scope. |
| Video Package / Publishing Package | `src/services/video-package/VideoPackageRepository.ts`, contracts, bridge, and `PublishingPackageProjection` | Repository and projection foundations exist. | Verify field-level round trips, package version/migration behavior, selected asset references, and exact approved snapshot. |
| Publish transaction / approved snapshot | `PublishTransaction`, `ApprovedPublishSnapshot`, and tests surfaced by repository search | Transaction/snapshot primitives and focused tests exist. | Prove the live publishing path actually uses them and that retries, partial failures, and recovery preserve identity. |
| Video Manager / Publisher | `src/views/VideoManager.tsx`, `src/views/VideoPublisher.tsx` import package/manifestation and Asset Engine code. | Shared architecture is present in source; complete behavior is not yet certified. | Enforce boundary: Manager operates on published videos (no upload); Publisher handles unpublished projects and publish flow. Verify metadata parity and package persistence. |
| Studio Hub | `docs/product/VIEWTUBE_STUDIO_HUB_MASTER_TOOL_ARCHITECTURE.md` specifies 13 canonical tools; runtime and historical audits describe a broader/older module inventory. | Architecture and runtime inventory need explicit reconciliation. | Map each canonical capability to current mounted tool, owner, inputs, output, tests, and handoffs. Do not create new pages merely to match the count. |
| UI primitives / component library | `src/components/Toolbox.tsx`, `src/components/subtoolbox/`, component-library source-of-truth doc, and Toolbox UI master resource | A canonical primitive system and documentation exist, alongside documented historical exceptions/audits. | Compare real production usage to the library; identify hard-coded copies, local CSS overrides, typography/size drift, and missing visual certification. |
| Analytics / outcomes / learning | Integrated lifecycle plan and related architecture docs identify Analytics Canon / VT-SYNC, outcome/evaluation, evidence, and governed Brain learning as authorities. | Intended lifecycle is well documented; end-to-end implementation and attribution are not yet verified. | Trace published video → analytics checkpoint → evaluation/evidence → governed learning, preserving decision/generation lineage and avoiding causal overclaim. |

## 4. Documentation drift and authority checks

Several architecture documents identify older audit baselines or describe themselves as planning/reference candidates:
- The Integrated Content Lifecycle plan explicitly warns that referenced audit dates are not proof that each requirement remains current.
- The Projects/ContentBuild and Asset Engine master resources cite a 2026-09-24 audit baseline.
- The Studio Hub Master Tool Architecture header names `main` as its branch, while this audit targets `master/consolidated-feature-integration`.
- The Toolbox UI master resource cites an older audited-main commit, and the Component Library source-of-truth doc also carries an older audit reference.

These are **reconciliation flags**, not proof that the documents are wrong. For each conflict, compare current source and tests before editing canonical documentation. Keep historical documents for provenance; update the owning living authority rather than creating another competing master plan.

## 5. Immediate P0 actions

1. **Capture an executable baseline.** Run typecheck, architecture checks, CSS checks, focused tests, full tests, and production build. Save exact command results and the commit SHA.
2. **Build a source-backed capability matrix.** For each lifecycle capability, list the canonical owner, runtime entry points, persistence service, tests, known gaps, and acceptance criteria.
3. **Trace one representative project end to end.** Verify create/load/reopen, ContentBuild identity, asset generation and selection, package save/reapply, publish approval, published-video binding, analytics checkpoint, and evidence lineage.
4. **Reconcile Studio Hub runtime inventory.** Compare the 13-tool architecture against mounted tools and current handoff contracts; mark implemented, partial, missing, duplicate, superseded, or unverified.
5. **Audit UI primitive adoption.** Identify shared primitive use versus copied/local styles, and distinguish desktop/mobile token contracts before changing dimensions globally.
6. **Turn verified gaps into small dependency-ordered changes.** Add/repair tests first; avoid broad refactors until baseline and ownership are confirmed.

## 6. Focused test starting points

- `src/services/projects/ProjectContentIdentityService.test.ts`
- `src/components/projects/projectManifestation.test.ts`
- `src/services/asset-engine/ContentBuildRepository.test.ts`
- `src/services/video-package/VideoPackageRepository.test.ts`
- `src/services/video-package/ProjectVideoPackageBridge.test.ts`
- `src/services/asset-engine/PublishingPackageProjection.test.ts`
- `src/services/asset-engine/PublishTransaction.test.ts`
- `src/services/asset-engine/ApprovedPublishSnapshot.test.ts`
- `src/components/metadata/videoManagerMetadataLayout.test.ts`

Confirm these paths and run them in the target checkout; listing a test file here does not certify it passes.

## 7. Acceptance gates for the optimization program

- One durable Project/ContentBuild identity across the creator workflow.
- Project Board and Calendar operate on the same project state.
- Asset versions, variants, selected assets, provenance, and package references remain linked after reload.
- Studio Hub tools have clear ownership and verified handoffs; overlapping tools are integrated rather than duplicated.
- Manager and Publisher share the appropriate metadata/package contracts without violating their distinct published/unpublished boundaries.
- The approved publish snapshot matches the actual publication payload.
- Analytics and evaluations can trace results to the relevant project, package, assets, and recorded decisions; correlation is not mislabeled as causation.
- UI examples reflect production primitives; changes propagate from canonical primitives rather than copied implementations.
- Critical workflow tests, build, and deployment verification pass against the same recorded commit.

## 8. Scope and limitations of this pass

This is a source/document baseline, not a complete code audit. GitHub search excerpts and selected files were used to identify concrete implementation anchors. No local checkout was available to execute commands, inspect all files systematically, capture browser screenshots, verify secrets/environment configuration, or confirm the currently deployed Render/Vercel artifact. Those items remain open and must not be reported as complete.


## 9. Concrete source-level follow-up candidates

These items are grounded in the inspected source, but still need targeted tests or runtime confirmation before being called user-visible defects.

### Candidate A — Project Manifestation can drift from the active project
- Source: `src/components/projects/ProjectManifestation.tsx`.
- The selected project state is initialized from `activeProjectId` only when the component mounts: `useState(activeProjectId || projects[0]?.id || "")`.
- No synchronization effect was present in the inspected component range. If the parent changes `activeProjectId` after mount, the selector may continue showing the previously selected project.
- **Next:** add a focused component/state regression test for active-project changes; decide whether user-selected project state should follow external active-project changes or only do so on explicit load/swap. Then fix only after the intended contract is explicit.

### Candidate B — LOAD and SWAP IN currently share the same handler
- Source: `src/components/projects/ProjectManifestation.tsx`.
- The top-row `LOAD` and `SWAP IN` split-left buttons both invoke `loadSelected`; asset-slot `SWAP` actions separately update ContentBuild selection.
- This may be intentional naming overlap, but the UI implies distinct actions. Verify the intended meaning of “swap in” and ensure it does not suggest an operation different from the one actually performed.
- **Next:** define acceptance behavior and test each action; do not invent a second persistence path if both controls are intentionally aliases.

### Candidate C — publish snapshot/transaction persistence is browser-local
- Sources: `src/services/asset-engine/ApprovedPublishSnapshot.ts` and `src/services/asset-engine/PublishTransaction.ts`.
- Both repositories use browser `localStorage` when available, in-memory fallback otherwise, and their write helpers catch storage errors without surfacing a durable-write failure.
- This can be acceptable for a local-first prototype, but it does not by itself establish server-authoritative, cross-device, or crash-safe publishing state.
- **Next:** inspect the deployed product's persistence/security model and recovery requirements. If server durability is required, plan a compatible repository adapter/migration and failure tests rather than assuming the current browser store is durable.

### Candidate D — Video Manager's helper copy describes upload as the starting action
- Source: `src/views/VideoManager.tsx`, `subtitleBase` / `subtitleHelpRail`.
- The helper text says users need to “upload the video” and offers progressive copy about uploading a script or creating from a concept. The inspected Manager view itself is built around loading the user's YouTube video catalog and editing published-video metadata.
- This is at least a product-boundary/copy mismatch with the rule that Video Manager manages published videos and has no upload workflow. The inspected range does not establish that an upload control is rendered.
- **Next:** replace misleading Manager help copy with published-video management guidance, while keeping unpublished creation/generation guidance in Video Publisher's separate Create/Write experiences. Add a regression check that Manager does not render an upload action.

### Candidate E — Current UI and lifecycle certification remains unproven
- Source shows a shared Board/Calendar toggle backed by `useProjectsWorkspace()`, and the publisher imports the package projection, publish transaction, YouTube bridge, and project metadata persistence service.
- These are positive integration anchors, not proof that reload/recovery, all metadata fields, remote publication, or analytics lineage work end to end.
- **Next:** use one test project to exercise Board ↔ Calendar, Manager ↔ Publisher package continuity, reload/reopen, publish transaction recovery, and analytics binding; record observed results against the acceptance gates above.
