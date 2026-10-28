# Priority 25 Frontend Scaffold Integration — TODO

Source: `tasks/priority-25-frontend-scaffolds-integration-audit.md`
Working branch: `feature/priority-25-frontend-scaffolds`

## Phase 0 — Source-of-truth audit
- [x] Inspect archive inventory and README.
- [x] Identify placeholder endpoints and unverified capability classifications.
- [x] Identify existing Brain, evidence, context, public-channel, and persistence owners.
- [x] Compare feature branch with the reference branch.
- [x] Preserve existing `tasks/plan.md` and `tasks/todo.md`; use project-specific files.

## Phase 1 — Integration contracts
- [x] Establish canonical evidence/context/persistence/API/UI/flag ownership.
- [x] Prohibit guessed endpoint wiring and parallel stores/registries.
- [x] Record provider, permission, freshness, and external-side-effect gates.
- [x] Record initial capability dispositions and rollback boundary.

## Phase 2 — AI Brain vertical slice
- [x] Trace canonical evidence through `resolveEvidenceIntelligence`.
- [x] Trace the call path from `BrainOrchestrator` to `buildBrainContextPack`.
- [x] Confirm completed turns carry evidence and quality metadata before persistence.
- [x] Identify existing focused test files.
- [ ] Run focused tests in a real checkout and record results.
- [ ] Run `npm run typecheck`, `npm run check:routes`, and `npm run build`; distinguish baseline failures.
- [ ] Exercise channel-context answer persistence, reload recovery, and active-channel mismatch in a running app.
- [ ] If a gap appears, add a failing regression test before changing production code.
- [ ] Do not import duplicate scaffold Brain/context APIs or persistence.

## Next slices (blocked on Phase 2 runtime verification)
- [ ] Prompt Library handoff using existing Brain conversation owners.
- [ ] Analytics capabilities using canonical analytics/evidence services.
- [ ] Project resume and handoffs using existing project/content-build owners.
- [ ] Provider-dependent media capabilities after endpoint/schema/permission verification.
- [ ] Route, flag, and UI integration after registry and Studio export reconciliation.

## Release gate
- [ ] No active `scaffold://` API path.
- [ ] No duplicate evidence/context/conversation store or page/action registry.
- [ ] No feature enabled without verified contracts and tests.
- [ ] Record focused tests, typecheck, route check, and build results.
- [ ] Do not open a PR before these gates pass.
