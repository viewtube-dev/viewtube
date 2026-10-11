# Studio Hub Component Library UI Audit — 2026-10-11

**Target branch:** `master/consolidated-feature-integration`  
**Scope:** Studio Hub production primitive catalog, Script Architect section timeline, metadata tag/timestamp patterns, and component-library coverage.  
**Method:** Static source audit against the production catalog, primitive exports, and representative consumer views. The browser preview/build/test runner was not available during this pass, so the scores below are a source-based assessment, not a runtime certification. No detector output or contrast measurements are claimed.

## Audit health score

| Dimension | Score | Evidence |
|---|---:|---|
| Accessibility | 2/4 | New script timeline has semantic list semantics when read-only and button semantics when selectable. Interactive dropdown and composite controls still need keyboard/screen-reader verification. |
| Performance | 2/4 | The primitive catalog renders each registered family at L0/L1/L2 in one page; this is a large inspection surface and can create substantial initial DOM/render work. |
| Theming | 3/4 | Production track reuses `SubToolbox`, shared component-level CSS variables, and canonical primitives. Some existing tool demos still use explicit palette colors as example content. |
| Responsive design | 2/4 | The migration catalog has compact portrait/landscape placement rules and narrow-screen CSS. The new compact action row and dropdown need a real mobile viewport check. |
| Implementation integrity | 3/4 | The library clearly separates the frozen hardcoded baseline from the production primitive track. The missing compound patterns below now use shared primitives rather than copies. |
| **Total** | **12/20** | **Acceptable — significant verification work remains.** |

## Findings

### [P2] Library first-render cost needs measurement
- **Location:** `src/components/ToolboxUIReferenceLibrary.tsx:30`; `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx` (catalog family map).
- **Category:** Performance.
- **Evidence:** The production track maps the full family list into SubToolboxes and renders each family at multiple control levels. This is useful for inspection but can produce a large mounted component tree.
- **Impact:** Slower initial rendering and more work when opening the reference library, especially on mobile or lower-powered devices.
- **Recommendation:** Measure the real route before changing behavior. If it is slow, defer rendering of unopened family previews or virtualize the family list while preserving palette and level controls.

### [P2] Mobile layout of compound action examples remains unverified
- **Location:** `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx`, `Tag-Adjacent Split Action Row` renderer and `CATALOG_PREVIEW_GEOMETRY`.
- **Category:** Responsive design.
- **Evidence:** The new example deliberately keeps REFINE / GENERATE / ANALYZE in one compact row to match the requested interaction. Source-only review cannot establish that all labels remain legible at the narrowest viewport.
- **Impact:** Small labels may become cramped or truncate on a phone, making actions harder to distinguish.
- **Recommendation:** Capture the library at desktop, narrow portrait, and landscape widths; keep the requested single row where it fits and verify a usable fallback at the smallest supported width.

### [P2] Keyboard and screen-reader behavior needs live verification
- **Location:** `src/components/Toolbox.tsx` — `SubToolboxDropdownControl`; `src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx` — nested square choices.
- **Category:** Accessibility.
- **Evidence:** These controls are custom components rather than native `select` elements. The new nested-square example exposes a labeled square control and a separate text button, avoiding nested interactive elements. This source review did not exercise focus order, Escape behavior, or screen-reader announcements.
- **Impact:** If keyboard focus or expanded/selected state is not announced correctly, keyboard and assistive-technology users may have difficulty selecting options.
- **Recommendation:** Verify Tab/Shift+Tab, Enter/Space, Escape, visible focus, and selected/expanded announcements with keyboard and a screen reader. Repair only confirmed failures.

### [P2] Automated verification is not yet complete
- **Location:** `src/components/studio-hub/__tests__/StudioHubComponentLibraryMobileRegression.test.ts`.
- **Category:** Implementation integrity.
- **Evidence:** A source-regression assertion was added for the six newly registered families and the Script Architect migration, but the test suite and production build have not been executed in this environment.
- **Impact:** Type mismatches, runtime rendering errors, or real responsive regressions could remain undiscovered.
- **Recommendation:** Run the focused regression test, typecheck, and production build; then inspect one batched desktop/mobile browser pass.

## Missing patterns found and added

These patterns were absent as distinct entries in the production migration catalog despite existing in real tool flows or being needed by the requested workflow:

1. **Multi-Section Script Bar** — extracted into `SubToolboxScriptBar` and now used by Script Architect rather than maintaining a one-off inline timeline.
2. **Nested Square Choice** — compact options with the canonical square check control and an independent text action.
3. **Tag-Adjacent Split Action Row** — tag editor with REFINE / GENERATE / ANALYZE split-left buttons directly underneath.
4. **Tone / Tension / Cinematic Dropdown** — catalog example using the existing arrow-triggered `SubToolboxDropdownControl` and its color-pair behavior.
5. **Ranked Metadata Tag** — real `TagRankTag` component with score/rank color mapping.
6. **Education Timestamp Notes** — real `EducationTimestampNotes` component with timestamp validation.

The 62-family hardcoded catalog remains frozen and unchanged. New examples are registered on the production **Primitive** track; this avoids conflating migration coverage with the old visual baseline.

## Positive findings

- The reference library deliberately separates hardcoded baseline examples from the production primitive track.
- The new script bar is a reusable primitive with weighted segments, optional selection callbacks, and semantic read-only list items.
- Existing dropdown, split-left button, checkbox, tag editor, ranked-tag, and timestamp-field implementations are reused instead of copied into a new styling system.
- The migration catalog already has responsive geometry metadata and dedicated narrow portrait/landscape rules.
- A regression test now guards the newly registered component families and confirms Script Architect uses the shared script bar.

## Recommended next actions

1. **[P2]** Run the focused component-library regression test and production typecheck/build.
2. **[P2]** Inspect the library and Script Architect at desktop, narrow portrait, and landscape sizes; fix any confirmed overflow or touch-target issue.
3. **[P2]** Verify keyboard and screen-reader behavior for custom dropdown and square-choice controls.
4. Finish with a polish pass after confirmed fixes.

**Status:** Source audit and catalog additions committed; runtime certification remains open.
