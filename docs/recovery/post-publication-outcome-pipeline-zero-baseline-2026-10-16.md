# Post-publication outcome pipeline — implementation note

**Date:** 2026-10-16  
**Branch:** `feat/post-publication-outcome-pipeline-certification-2026-10-16`  
**Status:** Partial implementation; production certification pending.

## Change

The canonical `AlgorithmEvaluationEngine` previously used a null relative-change delta as zero when evaluating increase/decrease/hold targets. A zero baseline makes relative change undefined; coercing it to zero could incorrectly mark an outcome as met or missed. The engine now records that target as unavailable unless the caller supplied an explicit absolute `targetValue`. An explicit target remains evaluable with a zero baseline.

The evaluation timestamp also now uses nullish coalescing, preserving an explicitly supplied timestamp of zero for deterministic replay/tests.

## Second correctness fix: zero-valued checkpoint scheduling

`BrainEvaluationLoop` also used truthiness checks for `now`, `maximum`, and `checkpointAt`. This silently replaced a deterministic timestamp of `0` with wall-clock time and excluded a checkpoint scheduled exactly at epoch zero. It now uses nullish defaults and an explicit non-null checkpoint check, and preserves the actual checkpoint in due-time and overdue calculations. A dedicated regression test covers a checkpoint at `0`.

## Retry correctness: provisional recommendation outcomes

The post-publication pipeline previously treated any existing `OUTCOME_MEASURED` event as final. That could strand a recommendation after an `insufficient_data` evaluation, even when later canonical analytics became available. It now suppresses duplicate work only for terminal measured statuses (`positive`, `neutral`, `negative`, `mixed`) and permits provisional insufficient-data outcomes to be retried. Regression coverage was added.

## Regression coverage

Added tests for:
- zero baseline + relative-change target => unavailable / insufficient data;
- zero baseline + explicit absolute target => normal target evaluation;
- explicit zero evaluation timestamp => honored.

## Certification limits

These changes address evaluation correctness only. They do not establish full end-to-end production verification, provider connectivity, server-authoritative persistence, governed Brain promotion, or deployed-commit certification. Those remain pending focused CI, integration tests, and live environment verification.
