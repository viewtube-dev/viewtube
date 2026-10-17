# Individual implementation prompt — Video Genome

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
BUILD as a reusable analysis capability first; separate destination only if existing Content Analysis/Analytics lacks a clear owner.

## Core transformation
Videos + analytics + transcript/structure evidence → versioned content patterns

## Inspect and reuse
- `src/services/contentAnalysis.ts`
- `src/services/analytics-canon/contracts.ts`
- `src/services/longformOptimization.ts`
- `src/services/brain/BrainEvidenceContract.ts`
- `src/services/brain/OpportunityIntelligence.ts`

## Tool-specific requirements
Use canonical video inventory, transcript/scene analysis and metric windows. Separate observation, interpretation and validated knowledge. Patterns cite source video IDs, timestamps where available, sample, window, confidence and provenance. Never infer causality from correlation or generalize from one video. Provide typed handoffs to Content Architect, Story Engine, Experiment Lab and Brain.

## Execution contract
Inspect live branch files, callers, consumers, tests, registries, routes and persistence before editing. Confirm the smallest viable implementation, then implement it; do not stop at an audit. Treat the disposition above as a hypothesis and revise it only with source evidence. Reuse canonical contracts, IDs, service/controller logic and persistence owners. Do not create parallel registries/stores/domain models or a competing page without proving the need.

Trace producer and receiver compatibility, payload schema, evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility and approval requirements. Registry presence alone does not prove an end-to-end handoff. Keep observation, interpretation, prediction and validated findings distinct; preserve uncertainty, missingness, source window and confidence scale.

Use test-driven development: add focused regression coverage before behavior changes, including partial/missing data, legacy records, invalid payloads and approval boundaries as relevant. Run focused tests, typecheck, relevant integration tests, full suite and build if the environment allows. Report actual commands/results; never claim unrun checks passed. Remove obsolete code only after consumer search and tested replacement parity. Update the authoritative inventory/mapping without creating duplicate planning docs.

## Deliverables and acceptance
Deliver working behavior (or a precisely evidenced blocker), focused regression tests, explicit upstream/downstream mapping, canonical persistence and compatible handoffs, and a concise changed-files/test-status report. Done means real canonical inputs produce inspectable outputs with provenance, correct persistence, compatible handoff and approval safety. If evidence/data is unavailable, expose the limitation rather than simulating success.
