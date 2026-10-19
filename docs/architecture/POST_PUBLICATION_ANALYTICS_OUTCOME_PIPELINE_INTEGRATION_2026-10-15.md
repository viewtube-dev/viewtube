# Post-Publication Analytics Pipeline Integration

Date: 2026-10-15  
Branch: `work/post-publish-production-pipeline-2026-10-15`  
Target: `master/consolidated-feature-integration`

## Workflow wiring

Canonical phase-three analytics sync now invokes `runPostPublicationOutcomePipeline` and returns a compact status summary in `CanonicalSyncOverview`: published builds checked, daily checkpoints recorded, recommendation outcomes, metadata comparisons, skipped work, failures, and completion time.

The pipeline uses exact channel, ContentBuild, published-video, completed PublishTransaction, and approved-snapshot identity. It does not join by title or fuzzy text. Missing transaction lineage or a missing latest complete daily row is surfaced as partial status rather than treated as a successful measurement.

## Daily checkpoints and outcomes

For each verified published ContentBuild, the pipeline queries the latest eight complete daily analytics days for that exact video. It records one checkpoint per video/day, with evidence IDs and previous-seven-day baselines. Due recommendation targets are preserved and evaluated against the same metric observations. Without a due recommendation, the checkpoint uses observational `inspect` targets rather than inventing an optimization direction.

Missing metrics remain unknown, not zero. Outcomes retain exact publication and metadata lineage and use `causalConclusion: null`.

## Historical metadata intelligence

The sync pass reviews up to the 12 most recent immutable metadata versions per published ContentBuild. Once a version has a complete seven-day follow-up window, it fetches and records a canonical daily comparison. Ready comparisons with sufficient coverage are not fetched repeatedly; partial comparisons can be retried as data coverage advances. The result remains descriptive association, not causal proof.

## Tests

Added `src/services/postPublicationOutcomePipeline.test.ts` to `npm run test:focused`. It covers channel isolation, exact-video analytics query, daily checkpoint creation, recommendation-linked outcome evaluation, and historical comparison. The existing golden-path test covers publication identity through creator-review learning.

## Release gates and limitations

Implementation is wired into the real canonical phase-three sync path. CI must confirm the focused suite, typecheck, build, full suite, lint and smoke; code presence is not proof of passing checks.

Live release certification still requires a healthy release endpoint and exact deployed-commit verification. The Render Publisher service needs its Start Command configured to `npm run start:production` so the API and frontend are both started.

ContentBuild, metadata history, approved snapshots and PublishTransactions remain browser-backed. The workflow is integrated into the creator's canonical analytics sync, but cross-device/server-authoritative durability and interrupted-reload reconciliation remain open.
