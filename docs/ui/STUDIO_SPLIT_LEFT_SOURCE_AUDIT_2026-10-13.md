# Studio Split-Left Source Audit and Correction

**Status:** Changes prepared on `fix/studio-split-left-source-unification`; build and visual verification still required.

## Findings

1. **Typography drift:** `StudioSplitLeftButton` is structurally a `StudioButton` with a split rail, but `studio-control-system.css` added a separate `.5px` text stroke and label-specific weight. That meant the label did not inherit the same computed text treatment as its parent Studio button. The split label now inherits typography instead of defining a second style.
2. **Three button implementations:** Production screens mixed `StudioSplitLeftButton`, the older `SplitLeftButton` from `SubToolboxSplitPrimitives.tsx`, and `SubToolboxGridActionButton` / hand-styled actions. Those components had separate markup and CSS ownership. The Project Manifestation Load / Swap / Refresh actions and asset swaps now use `StudioSplitLeftButton`; Video Director's remaining split-left usage was migrated too. Assemble Script, Preview Plan, Open Comment fallback, Connect Channel, and Community Post Save Draft / Connect Channel now use the Studio primitive.
3. **Double shadow:** `.vt-subtoolbox-split-button` in `subtoolbox-split-primitives.css` painted a CSS `filter: drop-shadow(...)`, while the shared consistency stylesheet also painted `box-shadow`. Hover and active states replaced the filter with additional drop-shadows, making the effect appear doubled or jump between shadow definitions. The split button now has one box-shadow source and no filter shadow; the selected state adds the black selection ring to that same shadow declaration.
4. **Selected-state mismatch:** the selected ring was defined for Studio buttons, but older split-button CSS could override the shadow or change only the fill. The split-left variants now preserve the thick black selected ring while keeping one outer shadow. The duplicate `SplitLeftButton` / `SubToolboxSplitButton` implementation and public exports have now been removed; catalog examples and production consumers use `StudioSplitLeftButton`. The separate split-dropdown and shell-action primitives remain because they have different behavior/anatomy.

## Files changed

- `src/styles/studio-control-system.css`
- `src/styles/studio-split-left-consistency.css`
- `src/styles/subtoolbox-split-primitives.css`
- `src/styles/toolbox-system.css`
- `src/views/ScriptArchitect.tsx`
- `src/views/VideoDirector.tsx`
- `src/components/CommentResponder.tsx`
- `src/components/CommunityPostGenerator.tsx`
- `src/components/projects/ProjectManifestation.tsx`
- `src/studio-ui/recipes/index.tsx`
- `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx`
- `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`
- `src/components/subtoolbox/SubToolboxSplitPrimitives.tsx` (retired duplicate split-left implementation removed)
- `src/studio-ui/index.ts` (legacy exports removed)

## Verification still required

- Run the repository typecheck, unit tests, and production build.
- Inspect Studio Button and split-left buttons at desktop and narrow portrait widths.
- Confirm selected Post Workspace buttons retain the thick black ring.
- Confirm the split-left control shows one outer shadow in default, hover, active, disabled, and selected states.
- Audit any remaining legacy `SubToolboxGridActionButton` callsites by intent; do not blindly convert every grid action if its intended anatomy is not split-left.
