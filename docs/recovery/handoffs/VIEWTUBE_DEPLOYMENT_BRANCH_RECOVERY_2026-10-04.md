# ViewTube Deployment + Branch Recovery Conversation — 2026-10-04

## Update metadata

- **UPDATE-ID:** UPDATE-20261004-deployment-branch-recovery-001
- **Eastern timestamp:** 2026-10-04 02:10 EDT
- **Conversation title:** ViewTube Recovery + Deployment / Branch Reconciliation Conversation
- **Round:** 1
- **Canonical repository:** `viewtube-dev/viewtube`
- **Canonical branch:** `main`
- **Historical/external repository:** `cbrewsterthegreat/ViewTube`
- **Source:** Current ChatGPT conversation and directly inspected GitHub repository state.
- **Status discipline:** Historical deployment/branch claims are preserved as REPORTED unless directly verified against canonical `main`.

## 1. Main focus

This conversation recovered and reconciled ViewTube deployment, branch, build-error, Resource Library, Toolbox/SubToolbox, Render, and Vercel knowledge. The central objective became:

> Make the current canonical `main` build/deployable, preserve legitimate work from today's branches, and ensure the deployed artifact actually corresponds to the current `main` commit.

The user explicitly required that runtime application imports remain inside `src`.

## 2. Canonical repository identity

The recovery protocol establishes `viewtube-dev/viewtube` as the canonical repository for durable recovery.

`cbrewsterthegreat/ViewTube` is an important historical/external source repository used in this conversation for branch, PR, deployment, and implementation evidence. Its claims must not automatically be promoted to canonical implementation.

Conflict rule:

**current verified implementation > verified tests/deployments > current canonical docs > explicit approved decisions > recovery artifacts > plans > general discussion**

## 3. Major deployment/debugging evidence

### Render: missing npm start

A Render deployment successfully completed the Vite build, uploaded the build, and then failed during runtime because Render executed:

```
npm start
```

and the package did not contain a `start` script.

Observed failure:

```
npm error Missing script: "start"
```

Later inspection of canonical `main` found `package.json` containing:

```json
"build": "vite build",
"start": "vite preview --host 0.0.0.0 --port $PORT"
```

**Status:** VERIFIED on the inspected canonical `main` source.

### Render: historical Toolbox missing exports

An earlier deployment failed because several imports were missing from `src/components/Toolbox.ts`, including:

- `SubToolboxDropdownControl`
- `SubToolboxGridActionButton`
- `StandardInput`
- related Toolbox compatibility exports

The current canonical `main` inspection showed those compatibility exports present.

**Status:** Historical failure REPORTED; current source fix VERIFIED by source inspection. A successful current production build still requires an actual build/deployment verification.

### Vercel: historical Resource Library import failure

A Vercel deployment cloned:

```
Branch: feat/analytics-vt-sync-showcase-data-v2
Commit: a66f653
```

and failed with unresolved imports such as:

```
../../../docs/resources/library/how-youtube-recommendations-and-discovery-work.md?raw
```

from:

```
src/features/resource-library/resourceLibraryRegistry.ts
```

This was an older deployment commit and should not be treated as the current `main` implementation.

Current canonical `main` was later inspected and showed the Resource Library registry using:

```
import.meta.glob("./resources/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
})
```

and the resource directory exists under:

```
src/features/resource-library/resources/
```

**Important correction:** Do NOT copy the Markdown resources into `src` again merely because of the old Vercel error. Current `main` already has the source-local Resource Library architecture.

### User architectural constraint

The user explicitly stated:

> There should be no imports outside of `src`.

This is an active implementation constraint for runtime application code.

## 4. Current canonical main checkpoint

Direct GitHub inspection during this recovery cycle identified current canonical `main` as:

```
914eaf0d8ca25d916a8b7db5e37b9cc6e7a11457
```

reported as the merge of PR #63 at 2026-10-02 14:26:27 UTC.

**Status:** VERIFIED by direct GitHub inspection during this conversation.

A current successful `npm run build` against this exact SHA was NOT executable through the available GitHub connector in this conversation. Therefore build/deployment cleanliness remains UNKNOWN until Vercel/Render actually builds this exact `main` SHA.

## 5. Branch / merge recovery knowledge

The conversation investigated branches edited around October 2, 2026 and attempted to distinguish:

- work already merged to `main`;
- work merged only into another feature branch;
- open/unmerged work;
- deployable checkpoints;
- branch ancestry and PR destinations.

Important workstreams discussed:

### Analytics

```
feat/analytics-vt-sync-showcase-data-v2
```

PR #49 was reported as an open analytics workstream and included:

- 240-video showcase data;
- 365-day daily metrics;
- 365×8 traffic-by-day data;
- upload-time coverage;
- reconciliation tests.

**Status:** REPORTED from prior conversation evidence; must be verified against canonical `main` before treating as current implementation.

### Resource Library source-only fix

```
fix/resource-library-src-only
```

The branch/PR work was intended to ensure Resource Library runtime assets remain under `src` and avoid runtime imports from `docs`.

A prior PR #50 was reported as merged into the analytics feature branch rather than directly into `main`.

**Status:** REPORTED historical branch relationship; current canonical `main` already contains the source-local Resource Library architecture, so the old PR should not be blindly merged.

### Do not merge blindly

A prior recovery attempt created PR #65 but found it not safely mergeable because it contained unrelated Toolbox/analytics changes alongside the Resource Library fix.

Decision:

> Preserve focused fixes and avoid merging a mixed branch merely to obtain one fix.

## 6. Merge-all-work plan recovered from the conversation

The user asked for a plan to merge all legitimate work.

Required sequence:

1. Freeze the current `main` checkpoint.
2. Inventory every relevant branch and PR.
3. Compare each branch against current `main`.
4. Identify unique commits already represented in `main`.
5. Identify legitimate unmerged work.
6. Reconcile Resource Library changes without duplicating source files.
7. Reconcile analytics work separately.
8. Resolve Toolbox/SubToolbox conflicts against the current canonical implementation.
9. Run the actual production build.
10. Deploy an isolated preview from the candidate.
11. Verify the preview.
12. Merge focused work to `main`.
13. Verify the resulting `main` SHA.
14. Deploy exactly that `main` SHA.
15. Verify that the deployment is serving the new `main`, not an old feature-branch commit.

Completion rule:

**implemented → merged to `main` → verified**

A branch existing, a PR being closed, or a feature branch merging into another feature branch does not by itself establish completion.

## 7. Recovery of substantive decisions and discoveries

### Deployment

- Always verify the deployment commit/ref.
- Do not assume a Vercel/Render deployment represents current `main`.
- Historical deployment logs may belong to stale feature commits.
- A successful build is distinct from a successful runtime deployment.
- Render requires a valid `start` script when configured as a Node service.
- Vercel/Vite must resolve every runtime import from repository paths actually included in the deployment.

### Resource Library

- Runtime resource imports must stay under `src`.
- Current canonical registry uses a local `import.meta.glob`.
- Canonical runtime resources are under `src/features/resource-library/resources/`.
- Documentation under `docs/resources/library/` remains valuable canonical/reference documentation, but runtime code must not import from it under the user's current constraint.
- Do not duplicate resources simply to satisfy an obsolete deployment error.

### Toolbox / SubToolbox

- Earlier work exposed missing-export drift between views and `Toolbox.ts`.
- Compatibility exports were added/observed in current canonical `main`.
- Toolbox/SubToolbox is a high-risk integration area and should be verified by actual build rather than source inspection alone.

### Branch governance

- Branches can contain overlapping work.
- A PR merged into a feature branch is not equivalent to merging into `main`.
- Branch/PR state must be recorded with exact destination and commit SHA.
- Recovery artifacts must distinguish canonical repository state from historical external repository evidence.

## 8. Failed/rejected approaches preserved

1. Treating an old Vercel error from `a66f653` as proof that current `main` still imports from `docs`.
2. Re-copying Resource Library Markdown into `src` without first inspecting current `main`.
3. Blindly merging a mixed PR containing unrelated Toolbox/analytics changes just to obtain a Resource Library fix.
4. Treating a branch or PR state as implementation completion without a current `main` verification.
5. Claiming a deployment succeeded without verifying the exact deployed commit.

## 9. Verification matrix

| Finding | Status | Evidence |
|---|---|---|
| Canonical repository is `viewtube-dev/viewtube` | VERIFIED | Recovery protocol + direct repository inspection |
| Canonical branch is `main` | VERIFIED | Recovery protocol + repository state |
| Current `main` checkpoint is `914eaf0d8ca25d916a8b7db5e37b9cc6e7a11457` | VERIFIED | Direct GitHub inspection |
| Resource Library registry uses source-local glob | VERIFIED | Direct `main` source inspection |
| Resource Library resources exist under `src/features/resource-library/resources/` | VERIFIED | Direct `main` source inspection |
| `npm start` exists on current `main` | VERIFIED | Direct `package.json` inspection |
| Toolbox compatibility exports exist on current `main` | VERIFIED | Direct `Toolbox.ts` inspection |
| Current `main` production build passes | UNKNOWN | Connector could inspect source but did not execute build |
| Current `main` is deployed to Vercel | UNKNOWN | Deployment action/verification not completed in this recovery cycle |
| Historical `a66f653` Vercel Resource Library failure | REPORTED/VERIFIED LOG EVIDENCE | User-provided Vercel log |
| All historical branches are safely merged to canonical `main` | UNKNOWN | Requires current branch/PR reconciliation |

## 10. Recommended implementation priorities

### P0 — Verify current main
Build and deploy the exact current `main` SHA.

### P0 — Runtime import boundary
Automate a check that fails CI when application/runtime files under `src` import outside the allowed source boundary.

### P0 — Deployment provenance
Every deployment should record:
- repository;
- branch;
- commit SHA;
- build result;
- deployment URL;
- verification result.

### P1 — Branch reconciliation
Create a machine-readable branch/PR ledger distinguishing:
- first edit;
- last edit;
- merge destination;
- first/last merge;
- merged-to-main status;
- latest SHA;
- PR;
- build status;
- deployment status;
- unique work remaining.

### P1 — Toolbox compatibility gate
Add build/contract tests that ensure every exported Toolbox primitive used by a view exists before deployment.

### P1 — Resource Library contract
Add a test ensuring all registered Markdown resources resolve from `src/features/resource-library/resources/` and that no registry import points into `docs/`.

## 11. Open questions / blockers

- A real production build of current canonical `main` still needs to be executed.
- The exact current state of all historical branches/PRs must be reconciled against canonical `main`.
- Vercel deployment must be verified against the current `main` SHA.
- Render deployment should likewise be verified against the current `main` SHA if Render remains a deployment target.
- Historical `cbrewsterthegreat/ViewTube` work must remain explicitly non-canonical until reconciled with `viewtube-dev/viewtube/main`.

## 12. Next actions

1. Build current canonical `main` at `914eaf0d8ca25d916a8b7db5e37b9cc6e7a11457`.
2. Capture the complete build log.
3. Fix only reproducible current errors.
4. Create/refresh an isolated preview deployment from current `main`.
5. Verify the deployed commit.
6. Reconcile unmerged branch work one branch/PR at a time.
7. Update the canonical recovery state after each material integration.

## 13. File inventory for this recovery cycle

### Added
- `docs/recovery/handoffs/VIEWTUBE_DEPLOYMENT_BRANCH_RECOVERY_2026-10-04.md`

### Edited
- No existing canonical repository file was overwritten during creation of this handoff. Recovery master/index/YAML updates require a latest-SHA-safe append/update operation and must not be performed from stale/truncated copies.

## 14. Provenance

```
USER REQUESTS
  ↓
Conversation deployment/build logs
  ↓
GitHub branch/PR/source inspection
  ↓
Canonical Recovery protocol
  ↓
This durable recovery handoff
```

Historical claims remain labeled according to evidence quality. Current source facts were verified directly against canonical `main`.

