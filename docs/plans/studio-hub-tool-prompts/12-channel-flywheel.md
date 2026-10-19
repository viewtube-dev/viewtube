# Individual implementation prompt — Channel Flywheel

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
MERGE as a diagnostic capability within Creator Strategy Engine and analytics; a focused report is justified only if it adds measurable bottleneck diagnosis.

## Core transformation
Channel lifecycle metrics → bottleneck diagnosis and next intervention

## Inspect and reuse
- `src/services/analytics-canon/contracts.ts`
- `src/services/channelPlanningIntelligence.ts`
- `src/services/brain/OpportunityIntelligence.ts`
- `src/services/brain/BrainEvidenceContract.ts`

## Tool-specific requirements
Use Discovery → Click → Watch → Satisfaction → Return → Relationship → Community → Conversion → Revenue → Reinvestment → Creation. Map each stage to available metrics, coverage and window. Flag missing metrics; rank bottlenecks with explicit confidence/impact. Distinguish symptom from cause. Route causal questions to Causal Intelligence, tests to Experiment Lab and cross-tool priorities to Creator Strategy Engine.

## Execution contract
Inspect live branch files, callers, consumers, tests, registries, routes and persistence before editing. Confirm the smallest viable implementation, then implement it; do not stop at an audit. Treat the disposition above as a hypothesis and revise it only with source evidence. Reuse canonical contracts, IDs, service/controller logic and persistence owners. Do not create parallel registries/stores/domain models or a competing page without proving the need.

Trace producer and receiver compatibility, payload schema, evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility and approval requirements. Registry presence alone does not prove an end-to-end handoff. Keep observation, interpretation, prediction and validated findings distinct; preserve uncertainty, missingness, source window and confidence scale.

Use test-driven development: add focused regression coverage before behavior changes, including partial/missing data, legacy records, invalid payloads and approval boundaries as relevant. Run focused tests, typecheck, relevant integration tests, full suite and build if the environment allows. Report actual commands/results; never claim unrun checks passed. Remove obsolete code only after consumer search and tested replacement parity. Update the authoritative inventory/mapping without creating duplicate planning docs.

## Deliverables and acceptance
Deliver working behavior (or a precisely evidenced blocker), focused regression tests, explicit upstream/downstream mapping, canonical persistence and compatible handoffs, and a concise changed-files/test-status report. Done means real canonical inputs produce inspectable outputs with provenance, correct persistence, compatible handoff and approval safety. If evidence/data is unavailable, expose the limitation rather than simulating success.
