# Post-Publication Analytics + Historical Metadata Intelligence — Phases 9–10 Certification

**Date:** 2026-10-15  
**Target integration branch:** `master/consolidated-feature-integration`  
**Implementation work branch:** `work/post-publish-phases-2-5-current-integration-2026-10-15`  
**Follow-up PR:** [#232 — regression fixes and golden-path certification](https://github.com/viewtube-dev/viewtube/pull/232)

## Phase 9 — End-to-end regression certification

Added `src/services/PostPublicationMetadataGoldenPath.test.ts` and included it in `npm run test:focused`.

The fixture runs the real local domain adapters through this sequence:

1. Create a canonical ContentBuild associated with a Project and channel.
2. Freeze the ready Publishing Package into an immutable ApprovedPublishSnapshot and begin a PublishTransaction.
3. Record upload identity and remote-verification completion; complete the transaction.
4. Bind the exact YouTube video to the same ContentBuild, transaction, snapshot hash, and selected asset IDs.
5. Record a day-7 analytics checkpoint and pass observations/evaluation targets to the existing Algorithm evaluation bridge.
6. Replay the checkpoint and verify the ContentBuild checkpoint event is idempotent.
7. Record three immutable metadata versions against the published video and approved publication lineage.
8. Query a deterministic canonical-analytics fixture and persist three historical metadata comparisons.
9. Create a review-only Brain learning candidate from three ready, distinct metadata-version comparisons.
10. Verify the Brain-facing metadata summary reports versions, comparisons, candidate count and evidence, with `causalConclusion: null`.

The second fixture case rejects an analytics checkpoint whose video ID differs from the completed publication transaction. Existing focused suites continue to cover missing/incomplete metric windows, invalid snapshot/video lineage, failed/retried transactions, comparison idempotency, creator approval and the five-version promotion threshold.

The analytics provider and Algorithm evaluation boundary are deterministic test doubles; the publication, snapshot, ContentBuild, metadata-history, comparison and learning-governance adapters in the fixture are the real implementations. This fixture does not call YouTube or mutate a live creator account.

## Phase 10 — deployment and production certification

Certification is fail-closed. A merged PR, successful build, or reachable page alone is not proof that the correct release is deployed.

### Required release gates

- `npm run test:focused` — includes the end-to-end golden path.
- `npm run typecheck`.
- `npm run lint:runtime`.
- `npm run build`.
- Full `npm test` suite and the `local-smoke` Playwright workflow.
- `git diff --check` and the source-governance checks in `.github/workflows/release-gates.yml`.
- Confirm the release commit is on `master/consolidated-feature-integration` before the master integration deploy is considered a candidate.
- Read `/api/release` from the intended live deployment and compare the reported commit/branch/environment to the certified release identity.
- Run a read-only browser smoke against the master integration URL `https://publisher-3n7h.onrender.com`; verify the release endpoint and application routes render without uncaught browser errors.
- Record the final deployed SHA, branch, environment, deployment timestamp, smoke result and workflow run URL below.

### Current certification record

- CI workflow: [ViewTube release gates run #851](https://github.com/viewtube-dev/viewtube/actions/runs/38702649440).
- At the time this record was written, run #851 was pending; its final result must be checked before release approval.
- Vercel status checks report build-rate-limit failures. Those checks are neither a passing build nor evidence that the Render master-integration deployment is current.
- Expected live target for master integration: `https://publisher-3n7h.onrender.com`.
- **Deployed SHA / branch / environment:** not certified yet.
- **Live release endpoint and browser smoke:** pending final result.
- **Production deployment:** not triggered by this change. Do not deploy or mark production certified while required gates are failing or pending.

### Remaining release blockers

- Resolve every typecheck, focused-test, full-suite, lint, build, or smoke failure from the current release-gates run.
- Merge the verified follow-up into `master/consolidated-feature-integration`, then verify the live release identity and route smoke against that exact commit.
- A27 server-authoritative persistence and interrupted-reload/remote reconciliation remain outside this phase. Current ContentBuild, ApprovedPublishSnapshot and PublishTransaction persistence is browser-backed; this release does not claim cross-device durability.

## Certification decision

Phase 9 implementation is present in source and is wired into the focused test suite; its pass/fail result is owned by the release-gates run. Phase 10 is **not certified** until CI finishes successfully and the live Render release identity matches the certified integration commit.