# Workflow Convergence — Live Repository Reconciliation

**Date:** 2026-10-30  
**Repository:** `viewtube-dev/viewtube`  
**Working branch:** `wf-twenty-workflows`  
**Working base:** `000d58171e09bb2923e04617cacb6191a012e452`

## Branch and baseline reconciliation

The handoff bundle names `brain-upgrades` at `8160e8c68`, stacked on integration commit `0cdcace58`. The named `brain-upgrades` branch is not discoverable in the repository, and GitHub cannot resolve `8160e8c68` as a commit ref. Do not recreate that branch name or assume the abbreviated SHA is valid.

The current `master/consolidated-feature-integration` branch resolves to `000d58171e09bb2923e04617cacb6191a012e452`. A GitHub compare against `0cdcace58` identifies `0cdcace58` as the merge base and the current target as the descendant; therefore the current target contains later history than the bundle's integration baseline. The feature branch was created from the current target SHA, not from the missing donor branch.

## Canonical documents already present

The following canonical files already exist on the working base and were preserved rather than overwritten:

- `docs/brain/UNIVERSAL_TOOL_HANDOFFS_AND_SUGGESTED_CHAINS.md`
- `docs/specifications/TOOLBOX_PROMOTION_AND_WORKFLOW_CHAINS.md`
- `tasks/toolbox-workflow-convergence/CANDIDATE-MAP.md`
- `tasks/toolbox-workflow-convergence/todo.md`
- `docs/product/studio-hub/04_STUDIO_HUB_INTERACTIONS_WORKFLOWS_HANDOFFS_CONTRACTS.md`
- `docs/product/studio-hub/05_PRODUCTION_HANDOFF_SPINE.md`

The workflow convergence specification is already registered as `DOC-SPEC-TOOLBOX-WORKFLOWS` in `docs/registry.json`. No duplicate registry entry is warranted for that specification.

## Runtime foundation observed on the current target

`src/services/viewTubeToolChains.ts` already contains:

- `ViewTubeActionPacket` with workflow/operation identity, approval state, identity mode, parent packet, evidence/provenance, and context fields;
- capability metadata including required context, mutation class, and resume route;
- canonical packet load/cache functions and chain-template declarations.

This is a later and more governed implementation than the simpler foundation described in the bundle's research note. Extend these owners; do not replace them or add a second transport, workflow store, or capability registry.

## Verification limitations and next gate

The GitHub connector can inspect repository files and create commits, but it does not execute the repository's local Vitest, ESLint, or TypeScript commands. The bundle's claimed 26/26 foundation test result is historical evidence only and must be rerun in a checkout of this branch before any runtime workflow implementation is claimed complete.

The historical test paths listed in the bundle were not found at the stated locations on this target. Resolve current test locations and package scripts before running or editing tests.

## Change made

The twenty-workflow checklist was appended to `tasks/toolbox-workflow-convergence/todo.md` under Phase 2b. The list is a tracking projection of the supplied WF-01…WF-20 plan; it does not mark any workflow as implemented.

No runtime source, canonical specification, existing registry entry, or integration branch was changed.


## WF-01 follow-up — CI evidence review (2026-10-30)

**PR:** [#1221](https://github.com/viewtube-dev/viewtube/pull/1221)  
**Head:** `8e4d3937e01e9ddcde071251b4dd8e2d78cf88e3`  
**Workflow run:** `41014300660` — ViewTube release gates

The PR remains open and draft. The workflow run completed with mixed results:

- **Passed:** production build; local smoke checks; Brain quality-loop contract and suite; conversation-handoff contract; document-system test; initial public-page-resolver and vault-operation-store focused tests; Studio component-grid CSS test.
- **Failed:** full suite; static quality/typecheck; focused contracts; document audit; confirmed Studio catalog audit; Gemini governance suite.

### Failure evidence inspected

1. **Full suite:** multiple source-contract assertions expect older Brain evidence ribbon copy and Studio/component source shapes. Examples include missing expected strings `Evidence identity verified`, `Prompt evidence identity unavailable`, and stale component/layout expectations. This is evidence of repository test/source drift; it is not a WF-01 receiver regression.
2. **Typecheck:** compile errors span unrelated existing areas, including `TacticProposal` test fixtures, missing Studio exports/types (`StudioLeftWordVariant`, `StudioIconSizeVariant`), a missing `StudioPanelAccordion` module, a Studio toggle type mismatch, Brain interface test exports, and missing `@testing-library/react` declarations. Typecheck stopped the static-quality job before runtime lint.
3. **Focused contracts:** 47 of 49 files and 318 of 322 tests passed. Failures include a stale Brain runtime snapshot source assertion and `ReferenceError: descendantAlgorithmEvents is not defined`.
4. **Document audit:** `test:conversation-handoff-contract` and `test:document-system` passed, but `audit:documents` failed. The captured job output includes an audit finding payload; this needs its own document-governance remediation rather than changing WF-01 runtime behavior.
5. **Confirmed catalog audit:** the preceding Studio CSS minifier test passed; `audit:confirmed-catalog` failed after reporting several coverage checks as passing. Treat the catalog audit as an independent Studio-library blocker.
6. **Gemini governance:** 20 of 21 files and 88 of 89 tests passed. One source-contract assertion still expects the old `setApiKey(trimmedKey);` implementation shape after the Gemini key-validation flow was revised.

### Gate decision

- The production build is green, but the release-gate workflow is not green.
- These failures are not caused by the documentation-only WF-01 PR based on the inspected failure messages; several are explicit source-shape assertions or compile errors in unrelated systems.
- Do not weaken or delete these tests merely to make CI green. Reconcile each failing contract with its current canonical implementation and add behavioral assertions where source-shape assertions are stale.
- WF-01 runtime implementation remains blocked until a checkout-backed change can add the receiver tests first and run the focused test/typecheck suite. The PR's CI run does not validate the proposed receiver because no receiver code has been added.
- Do not mark WF-01 complete or promote PR #1221 out of draft on the strength of the passing production build alone.
