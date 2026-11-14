# Studio Controls ownership convergence

**Status:** DISCOVERY / VERIFICATION REQUIRED. **Owner:** `src/studio-ui/tokens.ts` → emitter → generated CSS → primitive-owned imports → confirmed catalog specimens.

## Existing code and PRs
`src/studio-ui/tokens.ts`; `scripts/emit-studio-control-vars.mjs`; `src/styles/studio-control-vars.generated.css`; `studio-control-core.css`; `studio-control-fields.css`; `studio-control-system.css`; `StudioHubConfirmedPrimitiveCatalog.tsx`; merged PR #1203; divergent PRs #935/#988/#992.

## Guardrails
No second token source, global override layer or wholesale stale donor merge. Preserve semantic tier, field, split, primitive and catalog contracts. Prefer removing duplicate ownership over another override. Donor PRs #935/#988/#992 overlap and are deeply divergent; selective harvest only.

- [Audit checklist](audit-checklist.md)
- [Test and runtime plan](test-plan.md)
- [Agent brief](agent-brief.md)
- Parent [inventory](../../inventory.md), [task crosswalk](../../task-crosswalk.md), [verification](../../verification.md).


## Source reconciliation — 2026-11-13

**Audited target:** `master/consolidated-feature-integration` at `767a223bb383addcaf6492d67a3b29ac53934b43`. The Studio recovery branch `fix/studio-controls-regression-recovery-2026-10-31` compares as **352 commits ahead / 30 behind** and is cross-domain. Do not merge it wholesale; harvest verified unique changes file-by-file.

### Canonical documentation updated in the consolidation PR

- `docs/ui/STUDIO_VALUES_TOKENS_STYLES_SETTINGS_HIERARCHY.md`: field fill semantics now explicitly say 50% white / 50% primary at rest and 85% white / 15% primary on focus; double-split slider uses secondary side rails, primary center track and 50% white/secondary active progress.
- `docs/ui/STUDIO_CONTROLS_GLOBAL_DEFAULTS_AND_EXCEPTION_INDEX.md`: same field contract; Standard/Compact-only stepper limits; square icon group content-width exception and palette.
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md`: target catalog/export coverage addendum and unresolved stepper/public-barrel gap.

### Target-branch source observations

- The Confirmed Primitive catalog contains 174 `data-vt-library-component` occurrences and 73 distinct identifier values. This is not a count of unique public exports or complete coverage; several legacy-looking identifiers require cleanup/reconciliation.
- `StudioSquareIconButtonGroup` is exported by the public barrel and represented in the catalog with a Standard specimen and Standard/Compact family module. Its default/fallback contains five faces; caller-supplied children can vary the count.
- `StudioInlineStepper` and `StudioSplitStepper` exist in `StudioControls.tsx`, but are absent from the public barrel and Confirmed Primitive catalog at the audited target ref. Both support Standard/Compact only. Do not invent other sizes.

### PR donor evidence sampled (descriptions, not verification receipts)

- [PR #1243](https://github.com/viewtube-dev/viewtube/pull/1243) describes side-counter and icon-rail input families, identifies the shared native input line-height rule as a source-level glyph alignment cause, and explicitly leaves bottom inset clipping/browser verification unresolved.
- [PR #1258](https://github.com/viewtube-dev/viewtube/pull/1258) describes side and double-split text input primitives and catalog modules; its description says tests were added but not executed.
- [PR #1229](https://github.com/viewtube-dev/viewtube/pull/1229) describes a Studio regression conversation-intake package; its package paths were not found on the target branch in this pass and need PR-head reconciliation.

### Verification boundary

No Studio tests, build, computed-style checks, screenshots or assistive-technology tests were run as part of this documentation audit. Source-level findings do not certify visual behavior. Re-run focused Studio controls tests and browser checks across supported sizes before closing defects or merging Studio implementation donors.

The master documentation index and source ledger are tracked in [PR #1259](https://github.com/viewtube-dev/viewtube/pull/1259).
