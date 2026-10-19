# Conversation Record — Publisher Metadata Persistence, Saved Sets, and Render Check

**Date:** 2026-10-09  
**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `audit/system-convergence-identity-certification`  
**Record type:** Conversation synthesis, decisions, implementation receipt, deployment state, and continuation handoff  
**Authority:** This record preserves this conversation's decisions and verification boundaries. Current architecture authority remains in the linked canonical documents below.

## 1. Executive summary

This conversation continued the Publisher-to-Project metadata persistence slice. The intent is to let creators edit and save metadata in Video Publisher, preserve alternative metadata sets without overwriting the current selection, compare alternatives, select one set, and have the chosen state flow through the existing Project → ContentBuild → Video Package model.

The conversation also rechecked deployment status and began consolidating important decisions and implementation findings into GitHub documentation at the user's explicit request.

The current branch head at the time of this record is `a93728f2b138a7860357ba74ffea43d57c283e35` (`docs: integrate Publisher Manager Metadata Master ownership`). Render reports the matching branch deployment as **live**. This confirms Render's deployment state, not yet the complete browser-level Publisher workflow. The public Render page was checked read-only after this record was first drafted.

## 2. Decisions that must remain stable

### Product and system ownership

- **Video Publisher** owns preparing and publishing unpublished content/projects.
- **Video Manager** edits/manages already-published YouTube videos. It must not gain upload/publish controls.
- **Metadata Master** is the optimization/intelligence workspace, not a duplicate Publisher or Manager.
- Publisher and Manager share the canonical metadata-section component and the existing Toolbox/SubToolbox primitive system.
- Metadata/package intelligence belongs to the existing Project, ContentBuild, Video Package/Publishing Package, and Metadata Master flow. Do not add a parallel metadata store or a new top-level publishing page.
- Project owns intent/planning and acts as the creator-facing anchor. ContentBuild carries durable content identity and evolving selections/versions. Asset Engine/Vault owns asset identity, versions, and asset lineage. Package objects represent working/prepared publication configuration; approved snapshots/transactions belong to the publish execution boundary.
- Decision records explain *why*; technical change records explain *what changed*.
- Creator-facing UI should use natural terms such as “Saved Metadata Sets,” “Use this,” “Compare,” and “Save to Project,” not expose internal terms like ContentBuild or ActionPacket in routine controls.

### Canonical metadata order

Keep this exact order:
1. Video Upload
2. Title
3. Thumbnail
4. Visibility
5. Audience
6. Timestamps
7. Description
8. Location
9. Playlists
10. Community
11. AI Use
12. Tags
13. Category

Secondary/optional fields remain visually secondary. Do not reorder the canonical sequence.

### Persistence and asset boundaries

- “Save to Project” saves the working/current metadata state.
- “Save as Option” records an alternative without silently replacing the current title/description/tags/thumbnail selections.
- Selecting a saved option should update the canonical selected metadata-package variant and restore that option's field selections into the same ContentBuild and existing Video Package.
- Repeated selection should not duplicate variant-group members or append identical provenance records indefinitely.
- A saved option is not the same thing as a new Project or a second Video Package.
- Browser `File` objects are transient. Do not put raw file bytes/objects into localStorage or invent a second asset store. Durable thumbnail/video ingestion must use the existing Vault/Asset Engine import/storage boundary and its actual persistence semantics.
- Metadata save/selection is not equivalent to a YouTube publish transaction. Publishing remains a separately governed external side effect.

## 3. Implementation work recorded in this conversation

The following changes were authored on the working branch in the preceding conversation turns. Their presence in GitHub is distinct from a claim that each behavior has been fully runtime-tested.

- Added `src/services/publisherMetadataProjectPersistence.ts` to save current metadata or an alternative package option against the active Project/ContentBuild and existing Video Package.
- Added `src/services/publisherMetadataPackageOptions.ts` for listing saved options and selecting an option through canonical ContentBuild variant/selection APIs.
- Added `src/components/PublisherMetadataPackageOptions.tsx` for Saved Metadata Sets, selection, thumbnail preview where available, and in-tool side-by-side comparison.
- Wired the saved-set component into `src/views/VideoPublisher.tsx`, restoring selected option fields into the active Publisher form and updating the active Project metadata.
- Added or extended tests in:
  - `src/services/publisherMetadataProjectPersistence.test.ts`
  - `src/services/publisherMetadataPackageOptions.test.ts`
- Added assertions intended to guard against alternative-save overwrites, restore selected field asset IDs, and duplicate selection provenance.
- Updated the Publisher persistence plan with the saved-set checkpoint and verification caveats.

### Verification caveat

The automated test files have been authored/updated, but this conversation did **not** run a local test suite or local TypeScript build. Do not say that tests passed until a real run proves it. A Render deployment reports `live` for the branch-head commit, which is useful build/deploy evidence; still inspect deploy logs/build output if diagnosing code-level correctness, and verify the live page/Publisher flow separately.

## 4. Deployment and account observations

### Render service used for this work

- Service: `viewtube-system-convergence`
- Service ID: `srv-db3tf87lot8c73bvpalg`
- URL: https://viewtube-system-convergence.onrender.com
- Dashboard: https://dashboard.render.com/web/srv-db3tf87lot8c73bvpalg
- Repository: `https://github.com/viewtube-dev/viewtube`
- Branch: `audit/system-convergence-identity-certification`
- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Auto-deploy: enabled on commit.

The Render deployment list reported the current live deploy as commit `a93728f2b138a7860357ba74ffea43d57c283e35`, created 2026-10-09 19:00:19 UTC and finished 2026-10-09 19:03:14 UTC. The branch API reported the same commit as HEAD. Do not confuse this branch service with `viewtube` on `main`, `viewtube-canonical-test`, or `viewtube-1`; those are different Render services. The user explicitly said not to use `visual-test/canonical-default-system-65-66` as implementation baseline or UI evidence.

### Vercel

Earlier in this conversation, a preview was blocked by a Vercel login redirect and older deployments reported rate limits. The latest commit status later returned successful Vercel deployment statuses for three projects, but a success status alone does not establish anonymous browser access or verify the Publisher workflow. Re-check the current preview URL/status if it matters.

### Verification vocabulary

- GitHub write/commit success = source change exists.
- Render deploy `live` = Render reports the deployment as live.
- Build logs = evidence about compilation/build.
- Successful page navigation = evidence that the public route loads.
- Publisher interaction test = evidence that saved sets/selection/preview behave correctly.
- Do not collapse these into a single “verified” claim.

## 5. Known issues and next work

1. **Finish Render/live-page check.** Confirm the public homepage loads and determine whether the Publisher route can be reached without authentication. Do not bypass authentication.
2. **Inspect Render deploy/build logs** for the current deploy if a real TypeScript/build issue is suspected.
3. **Run the repository's actual test/typecheck/build commands** in an available build environment; the repository's `package.json` should remain the source of truth for commands. Fix real failures before marking the slice verified.
4. **Test saved-set persistence** with a current set and an alternative:
   - Save current set.
   - Save a different set as an option.
   - Confirm the current selected field assets do not change merely because an option was saved.
   - Select the alternative and confirm fields/asset selections restore.
   - Repeat selection and confirm no duplicate variant members or repeated identical provenance.
5. **Verify selected thumbnail preview** in the Publisher screen and verify selecting a new local thumbnail clears the saved preview.
6. **Implement durable thumbnail/video ingestion** by tracing and using the existing Vault import and asset persistence path. The current Vault import metadata/preview model may not itself store durable file bytes; verify the real backing-storage adapter before integrating file selection.
7. Update this record and the canonical plan with actual test/deploy outcomes. Do not claim unperformed verification.

## 6. Canonical documents to continue from

- `docs/Index.md` — primary documentation map.
- `docs/Organization.md` — ownership, consolidation, and non-destructive documentation rules.
- `docs/Architecture.md` and `docs/architecture/VIEWTUBE_INTEGRATED_CONTENT_LIFECYCLE_ANALYTICS_STUDIO_HUB_MASTER_PLAN.md` — system lifecycle and ownership.
- `docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_IDENTITY_CERTIFICATION_AUDIT_2026-10-08.md` — identity/ownership certification.
- `docs/architecture/VIEWTUBE_WHOLE_SYSTEM_OWNERSHIP_INTERACTION_AND_USER_TERMINOLOGY_AUDIT_2026-10-08.md` — system-wide ownership and creator terminology.
- `docs/architecture/VIEWTUBE_STUDIO_HUB_METADATA_BRANCH_CONSOLIDATION_2026-10-08.md` — branch consolidation findings.
- `docs/plans/VIEWTUBE_PUBLISHER_METADATA_PROJECT_PACKAGE_PERSISTENCE_PLAN_2026-10-08.md` — canonical Publisher persistence plan.
- `docs/Deployment.md` — deployment evidence rules.
- `docs/recovery/History.md` — durable operation ledger.

## 7. Continuation handoff

Continue on `audit/system-convergence-identity-certification`. Do not restart planning from scratch and do not create duplicate systems. First inspect the current branch and deployment, then test/fix the existing saved-set slice, then proceed to durable asset ingestion. Record any newly discovered decisions in the relevant canonical document and append an operation receipt to `docs/recovery/History.md`.


## 8. Public Render page check — completed

Read-only browser inspection completed on 2026-10-09 UTC:

- Homepage loads: https://viewtube-system-convergence.onrender.com/
- Studio route loads: https://viewtube-system-convergence.onrender.com/studio
- Video Publisher route loads without a sign-in redirect: https://viewtube-system-convergence.onrender.com/video-publisher
- Settings route loads: https://viewtube-system-convergence.onrender.com/settings
- No visible build/runtime/application error was found on the inspected pages.
- The public Publisher route currently shows **“NO CANONICAL PUBLISHING PACKAGE IS AVAILABLE”** and **“No projects available.”** This is an empty-project/package state, not a runtime failure; the check did not sign in, submit forms, upload files, or mutate data.
- The served JavaScript bundle reports version `0.0.0`, commit `a93728f2b138`, built at `2026-10-09T19:02:08.389Z`: https://viewtube-system-convergence.onrender.com/assets/index-Bq9KrwWw.js

This proves the public page/route loads for the served build. It does **not** prove saved metadata persistence works with a populated project, and it does not substitute for running the authored automated tests. Because documentation commits also trigger Render auto-deploy, recheck the latest deployment status after this documentation batch settles.
