# Phases 7–9 — Governance, Assistant Continuity, Release Certification

**Baseline:** `master/consolidated-feature-integration`  
**Prior implementation:** [Canonical analytics → Brain integration PR #215](https://github.com/viewtube-dev/viewtube/pull/215)  
**Follow-up branch:** `fix/brain-phase-7-9-governance-continuity-2026-10-15`  
**Status:** Phase 7 implemented; Phase 8 caller reachability audited; Phase 9 awaiting current-head CI.

## Phase 7 — Capability evidence map and reproducible coverage

Implemented:

- `governance/convergence/capability-evidence-map.json` is the curated source for task, test, guide, and verification references.
- Empty arrays explicitly mean “not mapped”; they do not imply evidence is absent and are not filled with guessed paths.
- `scripts/governance/build-capability-coverage.mjs` consumes the map instead of hard-coding empty arrays.
- The generator rejects unknown capability IDs, malformed reference lists, unsafe paths, and mapped references that do not exist in the checkout.
- The generated report preserves incomplete coverage rather than marking it complete.
- The release-gates `source-governance` job now runs `node scripts/governance/build-capability-coverage.mjs --check`, which validates the mapped paths and checks report reproducibility.

**Acceptance:** the new check must pass in CI on this follow-up PR's head. The change is implemented, but no passing result is claimed until that job runs.

## Phase 8 — Assistant surface continuity and caller reachability

Source audit confirms that both production-facing surfaces call the shared runtime:

- `src/components/SidebarChatbot.tsx` calls `runBrainTask({ surface: "sidebar-chatbot", ... })`.
- `src/views/dashboard/widgets/BrainHubWidget.tsx` calls `runBrainTask({ surface: "brain-hub-widget", ... })`.
- `src/services/brain/runtime/BrainRuntime.ts` delegates to `runBrainTurn` in `BrainOrchestrator`, preserving the canonical evidence resolver and context broker path.

Remaining convergence boundary:

- Both surfaces still build `AIBrainContextSnapshot` and their system prompt at the UI surface before calling the shared runtime.
- Brain Hub also reads the algorithm-intelligence portfolio for its dedicated visual panels. That display path is separate from conversational task execution, but remains a surface-specific projection to audit.
- Therefore, production caller reachability is confirmed, but full centralization of snapshot/prompt preparation is **not** claimed complete. Moving this composition into a shared preparation API requires a separate behavior-preserving change and focused surface regression tests.

## Phase 9 — Release verification and completion gate

The prior release-gates run `38693153891` for commit `cc0194b9e412d0a2a12dee6694a6034b5f7655d0` reported:

| Gate | Result | Interpretation |
|---|---|---|
| Production build | Pass | Bundle built successfully |
| Focused contracts | Pass | Configured focused suite passed; this does not prove every new regression test ran |
| Source governance | Pass | Earlier governance checks passed before this new reproducibility check was wired in |
| Local smoke | Pass | Configured Playwright smoke completed |
| Typecheck | **Fail** | Multiple TypeScript errors; runtime lint was skipped by job sequencing |
| Full suite | **Fail** | Stale source-contract assertions were reported for mobile CSS and VideoManagerWidget; complete failure classification is still required |

Representative typecheck failures in that run were in Studio primitive catalog exports/props, CSS custom-property typing, Editor `canSlip`, video-package `now` typing/test fixture, and StudioHub `SplitLeftButton`. These are outside the core analytics/Brain files and are not proven to be caused by this work. They must not be silently relabeled as passes or ignored in release certification.

Closeout checklist:

1. Confirm the new capability-coverage check passes on this PR head.
2. Run the Brain evidence-focused tests explicitly.
3. Triage typecheck and full-suite failures against the current integration baseline; fix regressions introduced by this work and classify unrelated baseline failures with evidence.
4. Run runtime lint, production build, full suite, source governance, and local smoke after the final code change.
5. Record the exact final SHA and actual gate outcomes.

## Definition of done

- [x] Curated capability evidence map exists.
- [x] Generator consumes the map and validates every mapped reference.
- [x] Reproducibility check is wired into release-gates source governance.
- [x] SidebarChatbot and BrainHubWidget runtime callers are confirmed.
- [ ] Shared prompt/snapshot preparation is centralized across Brain surfaces.
- [ ] Focused Brain evidence tests pass on the final head.
- [ ] Typecheck, runtime lint, full suite, production build, source governance, and smoke gates are green or a separately approved baseline exception is recorded.
- [ ] Final completion receipt records exact SHA and gate results.

**No merge or deployment claim is made by this document.**


## Phase 10 — Outcome lineage continuity

See [Phase 10 — Outcome Lineage Continuity](./PHASE-10-OUTCOME-LINEAGE.md). Asset Engine outcomes now pass the stable outcome record ID, generation trace, asset ID, and asset type into BrainOutcomeLedger and learning-event metadata. A regression test verifies the link, and capability coverage now references it. This is a completed identity hop, not end-to-end certification of recommendation → publish → analytics → evaluation → governed learning.


## Rebase / verification note — 2026-10-15

The follow-up branch was reconstructed from the integration history after PR #217's earlier head conflicted with overlapping Studio typecheck fixes. Studio/editor compile fixes and the duplicate publication metadata-key correction are now present on the integration branch via PRs #221 and #222. The post-publication analytics phases 2–5 work from PR #223 advanced the integration base again; this branch is now based on integration SHA `c09879c7fccf9de21a334cbe0b22fbd623cd0064`, and the ContentBuild/historical-metadata files changed by PR #223 are outside this PR's changed-file set. The latest release-gates run must still validate the exact current PR merge ref before merge.


The post-publication PR #223 typecheck blockers were reproduced from CI and fixed on this follow-up branch: metadata-history contract types are now exported, the historical analytics mock imports `vi`, and the Longform Optimizer computes baseline/follow-up summaries before applying the completeness gate. The next release-gates run must confirm these fixes and the outcome/evaluation regressions.
