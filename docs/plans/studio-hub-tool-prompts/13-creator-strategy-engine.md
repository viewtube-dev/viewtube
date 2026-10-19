# Individual implementation prompt — Creator Strategy Engine

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
BUILD this as the single cross-tool synthesis and decision surface over Brain and canonical tool outputs. Do not duplicate Brain memory, orchestration, or evidence stores.

## Core transformation
Validated intelligence + creator goals/constraints → prioritized, explainable next-best moves.

## Inspect and reuse
- `src/services/brain`
- `src/services/aiBrainSelfImprovement.ts`
- `src/services/brainAdaptiveOrchestrator.ts`
- `src/services/brainWorkflowExecution.ts`
- `src/services/brainWorkflowLearning.ts`
- `src/services/productionHandoffContracts.ts`
- `src/services/viewTubeToolChains.ts`
- `src/services/superToolRegistry.ts`

## Tool-specific requirements
Map actual Brain ownership, signals, evidence claims, workflow recipes, tool capability registry, operation packets and approvals. Synthesize existing outputs rather than recomputing or copying them. Each recommendation must include goal alignment, evidence IDs, confidence scale, impact/effort, assumptions, owner tool, next action and explicit uncertainty. Preserve packet/workflow/operation/idempotency identity and user approval for writes. Learn from outcomes only through existing governed Brain learning paths.

## Execution contract
Inspect live branch files, callers, consumers, tests, registries, routes and persistence before editing. Confirm the smallest viable implementation, then implement it; do not stop at an audit. Treat the disposition above as a hypothesis and revise it only with source evidence. Reuse canonical contracts, IDs, service/controller logic and persistence owners. Do not create parallel registries/stores/domain models or a competing page without proving the need.

Trace producer and receiver compatibility, payload schema, evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility and approval requirements. Registry presence alone does not prove an end-to-end handoff. Keep observation, interpretation, prediction and validated findings distinct; preserve uncertainty, missingness, source window and confidence scale.

Use test-driven development: add focused regression coverage before behavior changes, including partial/missing data, legacy records, invalid payloads and approval boundaries as relevant. Run focused tests, typecheck, relevant integration tests, full suite and build if the environment allows. Report actual commands/results; never claim unrun checks passed. Remove obsolete code only after consumer search and tested replacement parity. Update the authoritative inventory/mapping without creating duplicate planning docs.

## Deliverables and acceptance
Deliver working behavior (or a precisely evidenced blocker), focused regression tests, explicit upstream/downstream mapping, canonical persistence and compatible handoffs, and a concise changed-files/test-status report. Done means real canonical inputs produce inspectable outputs with provenance, correct persistence, compatible handoff and approval safety. If evidence/data is unavailable, expose the limitation rather than simulating success.
