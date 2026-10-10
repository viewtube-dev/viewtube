# Consolidated Master Validation Checklist

**Validation target:** `master/consolidated-feature-integration`  
**CI carrier branch:** `test/consolidated-master-validation-v2`  
**Rule:** this validation branch targets the consolidated master branch, never `main`.

## Required checks
- [ ] Production build.
- [ ] Typecheck/static quality; compare against known current-main failures.
- [ ] Focused canonical metadata order and right-label field contract tests.
- [ ] Publisher metadata persistence tests: current save, alternative save, listing, compare, selecting, repeat selecting.
- [ ] Publisher Write/Create workspace contract tests.
- [ ] Multi-select button group can toggle each option independently on/off.
- [ ] Full test suite.
- [ ] Review Video Publisher and Video Manager runtime boundaries.
- [ ] Confirm no upload or publish transaction appears in Video Manager.
- [ ] Confirm Publisher package save and publish are separate explicit actions.
- [ ] Confirm selecting a metadata option updates the existing ContentBuild/Video Package without duplicate Project, ContentBuild or asset storage.
- [ ] Confirm 44px family-level component size tokens do not alter structural L1 (48px).
- [ ] Confirm right-side overlay labels render on Input and TextArea across sizes/themes.
- [ ] Confirm canonical Toolbox/SubToolbox primitive/reference library parity and responsive/mobile behavior.
- [ ] Browser smoke checks for Studio Hub, Publisher, Manager, Project Manifestation and saved package state.
- [ ] Record remaining failures, distinguishing baseline failures from regressions.

## Known blockers
PR #13 CI previously failed static typecheck and the full test suite. Recheck those on this integrated tree. The consolidated branch is not yet certified.

## Exit criteria
Focused tests and production build pass; full-suite failures are fixed or verified baseline failures; critical Publisher → package → publish and Manager → live metadata edit flows pass smoke tests; no main branch ref is modified.
