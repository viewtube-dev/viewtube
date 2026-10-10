# Consolidated Master Validation Checklist

Target branch: `master/consolidated-feature-integration`

This checklist applies only to the consolidated integration branch. It is not authorization to merge into `main`.

## Guardrails
- [ ] Confirm `main` has not been changed by this validation effort.
- [ ] Keep Video Manager limited to already-published videos; no upload or publish controls.
- [ ] Keep Video Publisher responsible for unpublished projects and the complete publishing flow.
- [ ] Keep Metadata Master as a package-level metadata workflow, reusing canonical project/package/assets services.
- [ ] Do not modify the frozen `StudioHubCompletePrimitiveCatalog.tsx` baseline to make tests pass.
- [ ] Do not replace current canonical CSS/tokens with older branch snapshots.

## Build and automated checks
- [ ] Run dependency install using the repository's lockfile.
- [ ] Run TypeScript/static type-check.
- [ ] Run focused tests for metadata section order and Video Manager boundaries.
- [ ] Run Publisher metadata package persistence and saved metadata option tests.
- [ ] Run Studio Hub primitive/reference-library tests, including right-label variants, component-size DNA, and multiple-selection button groups.
- [ ] Run the full test suite.
- [ ] Run the production build.
- [ ] Record exact commands, commit SHA, and pass/fail results. Do not report a check as passed unless its result is available.

## Functional workflow validation
- [ ] Load or create a project and open its existing canonical Video Package / ContentBuild.
- [ ] Generate or refine metadata and save it into the current package.
- [ ] Save a second metadata set without replacing the selected set.
- [ ] Compare/select saved sets and confirm selection updates the existing package.
- [ ] Confirm title, description, thumbnail, tags, category, playlist and optional metadata retain their intended values.
- [ ] Confirm channel-connected playlist choices are sourced from the user's channel where integration is available.
- [ ] Confirm category Education timestamped questions enforce the documented timestamp format.
- [ ] Publish an unpublished project through Publisher; verify Manager does not expose publishing/upload controls.
- [ ] Edit metadata on a published video through Manager and record the change event/date for later analytics comparison.
- [ ] Confirm no duplicate project, package, or asset store is created.
- [ ] Exercise mobile layouts and keyboard focus, including right-side title/description labels and disabled states.

## Known inherited failure baseline
Prior CI on related branch `feature/studio-hub-component-foundation-audit` passed production build and some focused checks but failed type-check/full suite in areas recorded in `docs/architecture/VIEWTUBE_CONSOLIDATED_MASTER_BRANCH_2026-10-10.md`. Reclassify failures against the exact current master SHA before attributing them to these changes.

## Release gate
- [ ] All required checks are green or explicitly dispositioned with evidence.
- [ ] A reviewer has inspected the complete branch diff and any inherited changes.
- [ ] The user explicitly approves any later merge to `main`.

Until all release gates are satisfied, this branch remains an integration/revision line only.
