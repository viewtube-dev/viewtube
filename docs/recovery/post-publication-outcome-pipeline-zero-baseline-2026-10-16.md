# Post-publication outcome pipeline — implementation note

**Date:** 2026-10-16  
**Branch:** `feat/post-publication-outcome-pipeline-certification-2026-10-16`  
**Status:** Partial implementation; production certification pending.

## Change

The canonical `AlgorithmEvaluationEngine` previously used a null relative-change delta as zero when evaluating increase/decrease/hold targets. A zero baseline makes relative change undefined; coercing it to zero could incorrectly mark an outcome as met or missed. The engine now records that target as unavailable unless the caller supplied an explicit absolute `targetValue`. An explicit target remains evaluable with a zero baseline.

The evaluation timestamp also now uses nullish coalescing, preserving an explicitly supplied timestamp of zero for deterministic replay/tests.

## Regression coverage

Added tests for:
- zero baseline + relative-change target => unavailable / insufficient data;
- zero baseline + explicit absolute target => normal target evaluation;
- explicit zero evaluation timestamp => honored.

## Certification limits

These changes address evaluation correctness only. They do not establish full end-to-end production verification, provider connectivity, server-authoritative persistence, governed Brain promotion, or deployed-commit certification. Those remain pending focused CI, integration tests, and live environment verification.
