# P1 Canonical System Integration — Execution Plan
**Production Date:** 2026-10-29 | **Last Edited:** 2026-10-29 | **Class:** PROGRAM_PLAN | **Status:** ACTIVE — PLANNING
**Concern:** phase sequencing for six P1 system concerns | **Owner:** Integrated Application Program
**Registry ID:** DOC-PLAN-P1-CANONICAL-INTEGRATION

## Phase 0 — Reconcile
- [ ] Resolve live target branch HEAD and record exact SHA.
- [ ] Inspect Task Index and attach/allocate task IDs through Task Authority only.
- [ ] Inspect plan families, capability homes, ownership map, active PRs/branches and code callers.
- [ ] Reconcile PRs #1109, #1168, #1169, #1174, #935, #988, #992 and newer donors.
- [ ] Resolve Priority-25 identity.
- [ ] Classify every finding current-main / branch-only / PR-only / planned / superseded / unknown.

## Phase 1 — Ownership and contracts
- [ ] Complete owner and caller map per workstream.
- [ ] Map stable IDs and provenance across boundaries.
- [ ] Define typed contracts/adapters only where existing contracts are insufficient.
- [ ] Agree shared diagnostics correlation semantics after producer inventory.
- [ ] Route unresolved architecture questions to existing Open Questions Queue.

## Phase 2 — Bounded implementation
- [ ] Brain continuity vertical slice.
- [ ] Gemini provider/key/generation slice.
- [ ] Diagnostics propagation slice.
- [ ] Priority-25 production caller slice.
- [ ] Public resolver production wiring/cache/provenance slice.
- [ ] Studio Controls token/CSS/primitive/catalog/export slice.
Each slice gets a focused branch/PR unless a tightly coupled contract requires a justified combined change.

## Phase 3 — Cross-system integration
- [ ] Correlation/operation/event identity across relevant producers and consumers.
- [ ] Retry/idempotency and missing ancestry.
- [ ] Provider/key error taxonomy and secret-safe diagnostics.
- [ ] Public-only restrictions at runtime.
- [ ] Studio generated token/CSS/primitive/catalog/export consistency.
- [ ] Production-caller tests for each capability.

## Phase 4 — Certification
- [ ] Focused tests and relevant full gates.
- [ ] Runtime/browser checks for actual user flows.
- [ ] Duplicate owner/import/route/registry/store audit.
- [ ] Update owning authorities and docs/registry.json.
- [ ] Submit Task Authority proposals with receipts.
- [ ] Update capability homes/code ownership/plan-family records where durable.
- [ ] Archive/quarantine donors only after no-loss and zero-caller proof.
- [ ] Publish final evidence-based integration audit.

## Global exit
Each consequential path has one canonical owner, typed connections, preserved identity/provenance, focused regression tests, production-caller runtime proof, actionable diagnostics and explicit legacy disposition. Merged/build-green is not equivalent to DONE.


## Phase 0 reconciliation outcome — 2026-10-30
Phase 0 source reconciliation has been completed and merged via PR #1205. Follow-up source maps and six workstream execution packets are prepared in PR #1208. Current findings and corrected owners are in `audits/phase-0-reconciliation-2026-10-30.md`, `identity-map.md`, and `task-crosswalk.md`. Do not repeat Phase 0 from scratch; refresh only if target SHA changes.

Remaining Phase 0 identity gate: Priority-25 still has no confirmed capability/task identity. VT-025 is an unrelated Analytics task. Task Index VNext structured storage/writer is also not present; Task Authority remains the lifecycle authority and the one-goal file remains a temporary projection.
