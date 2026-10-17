# Individual implementation prompt — Content Architect

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
MERGE concept development with Script Architect and canonical project/ContentBuild planning; not a duplicate script app.

## Core transformation
Opportunity + creator context → structured content concept

## Inspect and reuse
- `src/features/script-architect/useScriptArchitect.ts`
- `src/features/script-architect/scriptBrainRuntime.ts`
- `src/features/script-architect/scriptProjectStore.ts`
- `src/services/asset-engine/ProjectContentBuildBridge.ts`
- `src/services/asset-engine/ContentBuildRepository.ts`

## Tool-specific requirements
Inspect project planning and hook generation. Store concept brief, audience promise, format, hook candidates, creator constraints, evidence, and next action in canonical project/ContentBuild records. Keep opportunity discovery in Radar and narrative execution in Story Engine/Video Director. Preserve old workflows without parallel stores.

## Execution contract
Inspect live branch files, callers, consumers, tests, registries, routes and persistence before editing. Confirm the smallest viable implementation, then implement it; do not stop at an audit. Treat the disposition above as a hypothesis and revise it only with source evidence. Reuse canonical contracts, IDs, service/controller logic and persistence owners. Do not create parallel registries/stores/domain models or a competing page without proving the need.

Trace producer and receiver compatibility, payload schema, evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility and approval requirements. Registry presence alone does not prove an end-to-end handoff. Keep observation, interpretation, prediction and validated findings distinct; preserve uncertainty, missingness, source window and confidence scale.

Use test-driven development: add focused regression coverage before behavior changes, including partial/missing data, legacy records, invalid payloads and approval boundaries as relevant. Run focused tests, typecheck, relevant integration tests, full suite and build if the environment allows. Report actual commands/results; never claim unrun checks passed. Remove obsolete code only after consumer search and tested replacement parity. Update the authoritative inventory/mapping without creating duplicate planning docs.

## Deliverables and acceptance
Deliver working behavior (or a precisely evidenced blocker), focused regression tests, explicit upstream/downstream mapping, canonical persistence and compatible handoffs, and a concise changed-files/test-status report. Done means real canonical inputs produce inspectable outputs with provenance, correct persistence, compatible handoff and approval safety. If evidence/data is unavailable, expose the limitation rather than simulating success.
