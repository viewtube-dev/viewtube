# System Convergence + UI Port Ledger

**Target:** `master/consolidated-feature-integration`  
**Donor:** `audit/system-convergence-identity-certification`  
**Snapshot:** 2026-10-11; comparison base SHA `b856b2157088fa06cb70ff51dab6dee768e0f384`; donor merge base `5ebdf48c02f87a96ce31a338622a7f131dc3cb30`.

This ledger is deliberately conservative. It records actual source differences seen at explicit refs and the current disposition; it is not a claim that changes have been ported or tested.

## Initial source inspection

| Path | Target blob | Donor blob | Observation | Disposition |
|---|---|---|---|---|
| `src/components/subtoolbox/SubToolboxPrimitives.tsx` | `ea7c0c94f67f3d21ab6e50ab0391c9bca3e05fe7` | `b171fb087b3a3c664078cd0c2c0c0ffac8ac6b7e` | Target already has a more advanced measured word toggle: it measures selected option geometry with ResizeObserver/window resize/font readiness and applies `is-word-toggle` / `has-noninitial-selection`. Donor toggle is the older simple segmented button rendering. Donor upload target adds controlled/uncontrolled file support, local image/video preview, tooltip and preview alt text; target retains Tight Reveal layering but lacks these props/preview lifecycle. | **Keep target toggle.** Port upload preview as a separate focused change only after callers, CSS, URL cleanup, and tests are reviewed. Do not replace the whole primitive file. |
| `src/styles/subtoolbox-system.css` | `a8d7dcc667a8b79f9370eeb9eb2ba0a2583ec952` | `63b734792682359801a5cc8a1241901f06f86a95` | Large files are nearly the same size. The shared header-toggle base rule is the same at the inspected selector; target's newer word-toggle behavior requires additional rules elsewhere. Donor has a larger CSS delta (+165/-13), which must be inspected by selector and not copied wholesale. | **Selective CSS only.** Diff individual selectors and reject any replacement of current canonical styles. |
| `src/components/Toolbox.tsx` | `9fd992c28c316d7945b22adf231c3bbee24ec14b` | `f6ed2be5d6b54848b00932330b4bea55df3f1e92` | Target already includes header-placement actions and passes `--pair-a` / `--pair-b` from its palette in the header action container. Donor changes also include pair-variable propagation in a different layout region; full symbol-level diff is still required to determine whether it is a distinct caller gap or duplicate behavior. | **Preserve target behavior; inspect exact hunks before any port.** |
| `src/components/metadata/CanonicalMetadataSections.tsx` | `efa2d433378ee4b3c52c4bdc0cde9cc5fa81b883` | `558716073363256c06de89eab3b2c91261ff3a13` | Both define the same canonical metadata order and primary/secondary group order. Donor imports `SubToolboxTopTitleDropdown`; target does not. The donor also differs in category option ordering/coverage. | **Do not port import or category list blindly.** Determine whether the dropdown is used at a call site and whether it satisfies an explicit user requirement; preserve canonical category values/order unless behavior is proven better. |
| `src/components/ProjectStudio.tsx` | `9aa49017281b4cfdfba98d80504c88828e5f1333` | `6c697da22f147c4a6cf479f70da82266b3c48780` | Donor imports `ToolboxHeaderToggle`; target does not. Candidate Channel/Projects selector migration appears unique, but the project state/navigation behavior must be traced before porting. | **Candidate port with adaptation** after checking exact JSX location and state wiring. |
| `src/components/projects/ProjectBoardWorkspace.tsx` | `6746ebef1c2ed3db265f98918105dfe02592818e` | `c6dd08d85b433b65003528b9d5b126e6d8da47f5` | Small file-level delta; candidate Board/Calendar selector migration to canonical `ToolboxHeaderToggle`. | **Candidate port with adaptation**; validate state semantics and responsive behavior. |
| `src/components/subtoolbox/SubToolboxPrimitiveSystem.test.tsx` | `387600b759f837553ea5cc06b1e84b6caecaf523` | `e756ac5e997f78769ca1b28a62a58f416215f0d6` | Donor adds 17 lines of test coverage. Existing tests use server-rendered markup/source contracts; inspect additions and strengthen behavioral coverage for measurement, keyboard behavior, upload cleanup and drop handling where feasible. | **Port relevant assertions, not whole test blindly.** |

## Documentation files

- `docs/ui/STUDIO_HUB_FULL_UI_PRIMITIVE_AUDIT_2026-10-06.md`: port factual audit additions only after comparing them with current target source; update stale branch/source claims.
- `docs/ui/VIEWTUBE_SHARED_UPLOAD_HEADER_PALETTE_CORRECTION_2026-10-11.md`: useful intent/evidence record. Preserve its caveat that tests, build and deployment were not verified; update status only when actual checks are run.

## Required next diffs before code edits

1. Review the entire `SubToolboxFileTarget` donor component, its corresponding CSS selectors, and every caller of the primitive. Confirm whether `file`, `preview`, `tooltip`, and `previewAlt` are needed by canonical metadata fields or should remain optional extension points.
2. Diff all 165 added CSS lines by selector. Categorize each as required for preview, word-toggle handle, palette, responsive behavior, or unrelated. Port only selectors required by the chosen feature.
3. Inspect exact JSX and event handlers in ProjectStudio and ProjectBoardWorkspace. Ensure view toggles preserve the existing state machine and do not create duplicate local state.
4. Inspect donor test additions; add tests for preview object URL revocation on replacement/unmount and keyboard/drop behavior if preview is ported.
5. After each cohesive port, run focused tests and static checks. If tool execution is unavailable, leave status blocked rather than claiming pass.

## Integration decisions already established

- Donor's simpler `ToolboxHeaderToggle` implementation is not an upgrade over the target's measured word toggle; keep target.
- Keep the target's current Publisher **Publish / Generate** and Manager **Manage / Generate** semantics.
- Keep the canonical metadata section order shared between Publisher and Manager.
- No source code from the donor has been merged by creating this ledger. No test/build/browser/deployment success is asserted.
