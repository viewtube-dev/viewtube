# Shared Upload Frame, Toolbox Header, Toggle, and Palette Correction — 2026-10-11

Branch: `audit/system-convergence-identity-certification`

## Changes implemented

- `SubToolboxFileTarget` is now the shared image/video upload frame. It supports click-to-select and drag/drop, displays a local image preview or video frame after selection, revokes its generated object URL on cleanup, preserves the color-derived frame strokes, and overlays the circular upload action at the lower-left of the preview.
- Added the concise hover/focus hint: “Click or drop a file to upload or change it.” The canonical metadata video and thumbnail upload frames now use the shared primitive, with field-specific tooltip copy.
- Removed the header-collapse control's white square surface and border via shared CSS, retaining the existing `AnimatedToggleIcon` outward/inward four-point icon crossfade and rotation used by the Widget Lab primitive track.
- Removed the extra top margin from the legacy header-variant title and added shared center-line alignment rules for header identity, title, help, toggles, and collapse controls.
- Replaced the Project Board Board/Calendar segmented control and Project Planning Channel/Projects toggle with the canonical `ToolboxHeaderToggle` word-toggle primitive.
- Reset subtoolbox palette allocation when the parent palette changes, and reset each child allocation against the changed parent index. This prevents the 12-color sequence from retaining stale assignments after a palette change.
- Added a focused static-render test for the shared upload frame's preview, affordance, and tooltip.

## Verification

- These changes are committed on the branch; the current head is recorded by GitHub.
- GitHub currently reports no check runs for the latest commit. No successful TypeScript build or Vitest run has been observed yet.
- A read-only Render check for `https://viewtube-system-convergence.onrender.com/studio` was started; the browser session has not yet returned a terminal result at the time of this update.
- The Render connector cannot list deployment status in this session because its linked-account action fails with `link_id must identify an eligible linked account`.
- Therefore this is an implementation checkpoint, **not a verified release**. The next gate is a successful typecheck/build and an interactive upload/header/toggle check on a fresh deployment.

## Notes

The preview is an ephemeral browser object URL for local feedback only. It is not a substitute for the canonical Vault/Asset Engine ingestion path and does not persist media bytes. Durable storage must continue through the existing asset boundary.
