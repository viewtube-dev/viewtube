# Individual implementation prompt — Channel Simulator

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
IMPLEMENT as a scenario capability inside Creator Strategy Engine or Revenue Architect first; separate tool only if independently testable value is proven.

## Core transformation
Current channel state + explicit assumptions → scenario ranges and sensitivities

## Inspect and reuse
- `src/services/channelPlanningIntelligence.ts`
- `src/services/projectPlanningIntelligence.ts`
- `src/services/analytics-canon/contracts.ts`
- `src/services/brain/BrainEvidenceContract.ts`

## Tool-specific requirements
Inspect existing planning, forecast, analytics and monetization scenarios. Prefer ranges/sensitivity analysis to point predictions. Store assumptions, input window, data sufficiency, model/version, uncertainty and comparison. No guarantees or fabricated inputs. Reuse canonical project/strategy decisions; backtest when historical data permits before calling outputs forecasts.

## Execution contract
Inspect live branch files, callers, consumers, tests, registries, routes and persistence before editing. Confirm the smallest viable implementation, then implement it; do not stop at an audit. Treat the disposition above as a hypothesis and revise it only with source evidence. Reuse canonical contracts, IDs, service/controller logic and persistence owners. Do not create parallel registries/stores/domain models or a competing page without proving the need.

Trace producer and receiver compatibility, payload schema, evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility and approval requirements. Registry presence alone does not prove an end-to-end handoff. Keep observation, interpretation, prediction and validated findings distinct; preserve uncertainty, missingness, source window and confidence scale.

Use test-driven development: add focused regression coverage before behavior changes, including partial/missing data, legacy records, invalid payloads and approval boundaries as relevant. Run focused tests, typecheck, relevant integration tests, full suite and build if the environment allows. Report actual commands/results; never claim unrun checks passed. Remove obsolete code only after consumer search and tested replacement parity. Update the authoritative inventory/mapping without creating duplicate planning docs.

## Deliverables and acceptance
Deliver working behavior (or a precisely evidenced blocker), focused regression tests, explicit upstream/downstream mapping, canonical persistence and compatible handoffs, and a concise changed-files/test-status report. Done means real canonical inputs produce inspectable outputs with provenance, correct persistence, compatible handoff and approval safety. If evidence/data is unavailable, expose the limitation rather than simulating success.
