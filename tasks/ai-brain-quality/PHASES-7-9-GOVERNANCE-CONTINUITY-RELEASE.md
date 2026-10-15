# Phases 7–9 — Governance, Assistant Continuity, Release Certification

**Branch:** `fix/brain-canonical-evidence-missingness-2026-10-15`  
**Pull request:** [#213](https://github.com/viewtube-dev/viewtube/pull/213)  
**Date:** 2026-10-15  
**Status:** Phase 7 implementation added; Phase 8 caller reachability audited; Phase 9 is blocked until the latest-head CI is green.

## Phase 7 — Capability evidence map and reproducible coverage

Implemented on this branch:

- `governance/convergence/capability-evidence-map.json` is the curated source for task, test, guide, and verification references. Empty arrays explicitly mean “not mapped”; they are not silently replaced with guessed paths.
- `scripts/governance/build-capability-coverage.mjs` now consumes that map instead of hard-coding empty arrays.
- The generator rejects unknown capability IDs, malformed reference lists, unsafe paths, and references that do not exist in the checkout.
- The generated report retains the distinction between mapped and unmapped capabilities; it does not mark incomplete coverage as complete.
- `npm run generate:capability-coverage` regenerates the report.
- `npm run check:capability-coverage` checks the report for reproducibility and verifies mapped paths.
- The release-gates `source-governance` job runs that check.

**Phase 7 acceptance:** the new check must pass on the current PR head. The generator/map implementation is committed, but no passing result is claimed until CI runs against that head.

## Phase 8 — Assistant surface continuity and caller reachability

Source audit confirmed that both production-facing surfaces use the shared runtime entry point:

- `src/components/SidebarChatbot.tsx` calls `runBrainTask({ surface: "sidebar-chatbot", ... })`.
- `src/views/dashboard/widgets/BrainHubWidget.tsx` calls `runBrainTask({ surface: "brain-hub-widget", ... })`.
- `src/services/brain/runtime/BrainRuntime.ts` delegates to `runBrainTurn` in `BrainOrchestrator`, preserving the canonical evidence resolver and context broker path.

Scope and remaining convergence boundary:

- Both surfaces still build `AIBrainContextSnapshot` and their system prompt at the UI surface before calling the shared runtime.
- Brain Hub also reads the algorithm-intelligence portfolio for its dedicated visual panels. That separate display path is not evidence that the conversational task bypasses the runtime, but it remains a parallel surface-specific projection to keep under audit.
- This phase does **not** claim all Brain UI context composition has been centralized. The production caller/runtime path is verified by source inspection; fully moving snapshot and prompt construction into a shared context-preparation API requires a separate behavior-preserving change and surface regression tests.

## Phase 9 — Release verification and completion gate

The release gate is intentionally evidence-based. The observed workflow for commit `cc0194b9e412d0a2a12dee6694a6034b5f7655d0` (run `38693153891`) reported:

| Gate | Observed result | Meaning |
|---|---|---|
| Production build | Pass | The app bundle builds |
| Focused contracts | Pass | The configured focused suite passed; this is not proof every new regression test ran |
| Source governance | Pass | Existing governance checks passed before the new capability-coverage check was added |
| Local smoke | Pass | Configured Playwright smoke completed |
| Typecheck | **Fail** | Multiple TypeScript errors; runtime lint was skipped by job sequencing |
| Full test suite | **Fail** | At least two existing source-contract assertions were stale relative to current UI markup/CSS; other failures must be read from the complete log before classification |

Representative typecheck failures in that run were in Studio primitive catalog exports/props, CSS custom-property typing, Editor `canSlip`, video-package `now` typing/test fixture, and StudioHub `SplitLeftButton`. These are not proven to be caused by the analytics/Brain changes. Do not hide them, relabel them as passes, or merge this PR as certified while they remain red.

Required closeout on the current head:

1. Run the new capability-coverage reproducibility check and inspect any stale-reference failures.
2. Run the Brain evidence-focused tests explicitly, in addition to the workflow's broader focused-contract job.
3. Fix or explicitly baseline-classify typecheck and full-suite failures; then run runtime lint.
4. Re-run production build, full suite, local smoke, and source governance after the final code change.
5. Record the exact final head SHA and outcomes. Mark complete only when required gates pass or a separately approved baseline exception is recorded.

## Definition of done

- [x] Capability evidence references have a curated source file.
- [x] Generator consumes and validates mapped references.
- [x] Reproducibility check is wired into release-gates source governance.
- [x] SidebarChatbot and BrainHubWidget production caller paths to BrainRuntime are confirmed.
- [ ] Surface-owned snapshot/prompt construction is fully centralized (tracked as a separate behavior-preserving convergence task).
- [ ] Current-head focused evidence tests pass.
- [ ] Current-head typecheck, runtime lint, full suite, build, source governance, and smoke gates pass.
- [ ] Final completion receipt records the exact verified SHA and gate results.

**No merge or production-deployment claim is made by this document.**
