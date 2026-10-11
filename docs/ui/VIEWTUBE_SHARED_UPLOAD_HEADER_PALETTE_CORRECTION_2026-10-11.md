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

This is an implementation checkpoint, not a verified release. The test and source edits have been committed to this branch, but no local TypeScript check, Vitest run, production build, or live-browser test has yet been executed from this branch. Vercel's recent preview deployments were rate-limited, and Render's connector did not return deployment status in the prior check.

## Acceptance gate

1. Run the focused `SubToolboxPrimitiveSystem.test.tsx` test.
2. Run TypeScript checking and the production build; fix errors before merging.
3. Verify nested palette order after changing a parent palette.
4. Verify video/thumbnail click-to-select, drag/drop, preview, reselect, keyboard focus, and object-URL cleanup.
5. Check toolbox header alignment at desktop and narrow mobile widths.
6. Keep durable media ingestion behind the canonical Vault/Asset Engine boundary. A local object URL is only a preview, not a saved asset.
