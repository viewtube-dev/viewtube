# Shared Upload, Toolbox Alignment, and Palette Order Fix — 2026-10-11

**Implementation branch:** `fix/ui-color-order-toolbox-alignment-2026-10-11`  
**Base:** `master/consolidated-feature-integration`  
**Donor:** `audit/system-convergence-identity-certification`

## Applied changes

- Extended the existing canonical `SubToolboxFileTarget` primitive to support controlled and uncontrolled files, local image/video previews, a selected-media change affordance, accessible tooltip copy, and object-URL cleanup.
- Connected canonical metadata video and thumbnail upload fields to the shared primitive. Existing remote/saved thumbnail previews remain supported; local `File` objects are used only for temporary preview and are not persisted as project data.
- Reset the parent toolbox's child-palette cursor when its palette index changes, and reset each child's allocated palette when the parent palette changes. This prevents stale nested palette order.
- Added shared header alignment rules so toolbox title, identity rail, toggles, help, and collapse controls share the center line. The collapse control remains transparent without the extra white square/border.
- Kept the target branch's more advanced measured word-toggle implementation and existing header-action palette-variable propagation; no wholesale donor file replacement was used.
- Retained the target's canonical metadata ordering and category options. No alternate metadata order or parallel component system was introduced.
- Added a focused static-render regression test for the upload preview and accessible change hint.

## Verification state

This is an implementation checkpoint, not a verified release. The test and source edits have been committed to this branch, but no local TypeScript check, Vitest run, production build, or live-browser test has yet been executed from this branch. Vercel's recent preview deployments were rate-limited. Render status was subsequently retrieved: service `viewtube-system-convergence` is live on commit `f7b6ecb93abd0f322f54d88f2a53fa309f505da1` from `audit/system-convergence-identity-certification`, not this child branch.

## Acceptance gate

1. Run the focused `SubToolboxPrimitiveSystem.test.tsx` test.
2. Run TypeScript checking and the production build; fix errors before merging.
3. Verify nested palette order after changing a parent palette.
4. Verify video/thumbnail click-to-select, drag/drop, preview, reselect, keyboard focus, and object-URL cleanup.
5. Check toolbox header alignment at desktop and narrow mobile widths.
6. Keep durable media ingestion behind the canonical Vault/Asset Engine boundary. A local object URL is only a preview, not a saved asset.


## Supplemental branch evidence — expanded implementation and verification record

The convergence branch's longer version of this record preserved the following intended changes; these are documented here so the design and test obligations are not lost during branch cleanup:

- Use `SubToolboxFileTarget` as the shared image/video upload frame, including click-to-select, drag/drop, local image/video preview, object-URL cleanup, color-derived strokes, and a lower-left upload action.
- Keep a concise upload/change hint and field-specific tooltip copy.
- Remove the collapse control's unintended white square/border while retaining the animated expand/shrink icon behavior.
- Align toolbox header identity, title, help, toggles, and collapse controls on a shared center line; remove extra title margin in the legacy header variant.
- Use the canonical `ToolboxHeaderToggle` word-toggle for the Project Board Board/Calendar and Project Planning Channel/Projects controls.
- Reset child palette allocation when a parent palette/index changes, avoiding stale color assignments.
- Retain a focused static-render regression test for the upload frame's preview, affordance, and tooltip.
- Keep object URLs as temporary local previews only; durable media ingestion remains the responsibility of the canonical Vault/Asset Engine path.

**Historical verification record (not a current release certification):** the donor branch reported Render builds for commits `a3d1385f85a421e7e7f783c122647d4f1ac0e0c1` and `fd3853ad038150f46eab90cc37dc1bd5ad8ee4e3`; it reported public-route checks for the earlier deployment and said TypeScript and Vitest were not run by the configured Render build. The donor also recorded a pending read-only route check for the newer commit. Re-check current target source, exact connected repository/service, CI, typecheck/tests, and live routes before treating any of this as current verified behavior.
