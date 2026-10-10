# Consolidated Master Validation Checklist

**Validation target:** `master/consolidated-feature-integration`  
**CI carrier branch:** `test/consolidated-master-validation`  
**Rule:** this validation branch targets the consolidated master branch, never `main`.

## Required checks

- [ ] Production build.
- [ ] Typecheck/static quality; compare against known current-main failures.
- [ ] Focused canonical metadata order and labeled-field contract tests.
- [ ] Publisher metadata persistence tests: current save, alternative save, listing, compare, selecting and repeat selecting.
- [ ] Publisher Write/Create workspace contract tests.
- [ ] Full test suite.
- [ ] Review Video Publisher and Video Manager runtime boundaries.
- [ ] Confirm no upload or publish transaction appears in Video Manager.
- [ ] Confirm Publisher save-package and publish are separate explicit actions.
- [ ] Confirm selecting a metadata option updates the existing ContentBuild/Video Package without duplicate Project, ContentBuild or asset storage.
- [ ] Confirm all 44px component-size values are family-level tokens and do not alter structural L1 (48px).
- [ ] Confirm right-side overlay labels render correctly on Input and TextArea across relevant sizes and themes.
- [ ] Confirm canonical Toolbox/SubToolbox primitive/reference library parity and responsive/mobile behavior.
- [ ] Run browser smoke checks for Studio Hub, Publisher, Manager, Project Manifestation and saved package state.
- [ ] Record remaining failures and distinguish baseline failures from regressions.

## Current known release blockers

PR #13 CI previously failed static typecheck and the full test suite. Those failures must be rechecked on this integrated tree. The consolidated branch has not yet been certified; do not infer a pass from source-level checks alone.

## Exit criteria

All focused tests and production build pass; full-suite failures are either fixed or documented as verified baseline failures; critical Publisher → package → publish and Manager → live metadata edit flows pass smoke tests; no main branch ref is modified.
