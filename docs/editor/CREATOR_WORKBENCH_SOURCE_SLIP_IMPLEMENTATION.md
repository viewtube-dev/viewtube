# Creator Workbench — Source Slip Controls

**Status:** Implemented on a feature branch; runtime verification pending.  
**Target:** `master/consolidated-feature-integration`

## Behavior

The VT_E1 Trim tool now exposes the existing source-slip operation for clips with known source duration metadata.

- Displays source in/out and total source duration.
- Offers −1s, −0.25s, +0.25s and +1s source-window nudges.
- Disables backward/forward nudges when the source window is at the respective boundary.
- Dispatches the existing `slipClip` reducer action, which calls the shared `slipTimelineClip` operation.
- Keeps the clip's timeline start/end fixed; the selected source window moves inside that slot.
- Leaves the controls unavailable when source duration is unknown instead of assuming an unlimited source.

Timeline trim remains a separate control. No second timeline model or processing pipeline was added.

## Verification status

Regression cases were added to `src/shared/vtE1TimelineOperations.test.ts` to cover source-window clamping at both ends while preserving timeline edges. Tests, build/typecheck, undo/redo runtime behavior, and responsive visual QA have not yet been executed in this GitHub-only pass.

## Next

1. Run the shared timeline operation tests.
2. Verify source-window readouts update after each nudge and undo/redo restores the previous window.
3. Confirm the desktop editor mounts the same panel/action contract.
4. Continue tracing durable image derivative storage and the Script Architect ↔ BrainRuntime boundary.
