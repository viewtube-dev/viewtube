# Creator Workbench — Source-Aware Timeline Trim

**Status:** Implemented on a feature branch; runtime verification pending.  
**Target:** `master/consolidated-feature-integration`

## Behavior

The shared timeline trim operation now keeps source-time offsets aligned with timeline edge changes:

- Moving the left edge adjusts `sourceInSec` by the same source/timeline-time ratio.
- Moving the right edge adjusts `sourceOutSec` using that ratio.
- Trims that would address source time before zero or beyond known source duration are rejected by the shared operation and constrained by the editor reducer where metadata is available.
- Clips without source-range fields retain the prior timeline-only behavior.
- The existing editor reducer still records accepted trim actions in normal history/undo state.

This centralizes source-time math in `src/shared/vtE1TimelineOperations.js` so editor state does not maintain a second trim algorithm.

## Regression coverage

Added cases to `src/shared/vtE1TimelineOperations.test.ts` for left/right source offset synchronization and invalid source-boundary requests. The test file has not been executed in this GitHub-only pass.

## Verification still required

1. Run the timeline operations Vitest suite and editor typecheck.
2. Verify trimming at both edges with normal-speed and source/timeline-duration-ratio clips.
3. Verify undo/redo and preview/final-render parity.
4. Verify clips with missing source duration metadata remain editable without falsely claiming bounded media.
