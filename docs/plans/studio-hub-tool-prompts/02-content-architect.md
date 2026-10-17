# Individual implementation prompt — Content Architect

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Work type:** source/runtime integration; no unrelated UI/CSS redesign.

## Mission
MERGE the planned concept-development tool with Script Architect and the existing project/content-build planning path; retain a distinct capability, not a duplicate script app.

## Core transformation
Opportunity + creator context → structured content concept

## Required repository investigation
Before editing, inspect the live branch versions of the existing feature, service, store, type, registry, routes, docs, tests, and consumers listed below. Search all callers and downstream readers; do not trust stale code-search excerpts. Confirm the real implementation status and data ownership. Record the smallest viable implementation path, then execute it—do not stop after an audit or a plan.

## Existing implementation to inspect and reuse
- `src/features/script-architect/useScriptArchitect.ts`
- `src/features/script-architect/scriptBrainRuntime.ts`
- `src/features/script-architect/scriptProjectStore.ts`
- `src/services/asset-engine/ProjectContentBuildBridge.ts`
- `src/services/asset-engine/ContentBuildRepository.ts`

## Tool-specific implementation requirements
Inspect Script Architect, project planning, hook generation, and ContentBuild contracts. Make concept brief, audience promise, format, hook candidates, creator constraints, evidence links, and next action part of the canonical project/content-build record. Keep opportunity discovery in Opportunity Radar and narrative beat execution in Story Engine/Video Director. Preserve existing script workflows through adapters or migration, not parallel stores.

## Shared implementation rules
1. Reuse canonical contracts, registries, service/controller logic, persistence owners, and existing project/video/asset IDs. Extend existing code when ownership matches; do not introduce a parallel registry, duplicate store, shadow domain model, or competing page without proving the need.
2. Treat the proposed disposition above as the starting hypothesis. If source evidence proves a better combine/merge/build decision, document the evidence and update the decision before implementing.
3. Trace every handoff producer and receiver. Verify payload schema, source evidence/provenance, project/content-build identity, workflow/operation/idempotency identity, destination compatibility, and approval requirements. Registry presence alone does not prove an end-to-end handoff works.
4. Keep observations, interpretations, predictions, and validated findings distinct. Preserve source snapshot/window, confidence scale, missingness, uncertainty, and compatibility for existing persisted records. Never invent evidence or imply causality/forecast certainty unsupported by data.
5. Follow test-driven development: add or update focused regression tests before behavior changes; test success, missing/partial data, legacy records, invalid payloads, and safety/approval boundaries as applicable. Then run focused tests, typecheck, relevant integration tests, full test suite, and production build if the environment allows. Report commands and actual results; never claim unrun checks passed.
6. Remove duplicate/obsolete code only after searching all consumers and proving replacement parity with tests. Avoid mass renames and unrelated refactors.
7. Update the canonical tool inventory/mapping and this tool’s acceptance notes so planned vs implemented vs verified status stays honest.

## Deliverables
- A working implementation or a clearly evidenced blocker with the remaining code-level steps (not just recommendations).
- Focused regression tests for the primary transformation and at least one failure/uncertainty boundary.
- Explicit mapping to canonical upstream inputs and downstream handoffs.
- Updated docs only where they are the authoritative source; no duplicate planning files.
- A concise completion report listing files changed, integration choice, tests run/passed/blocked, and known limitations.

## Definition of done
The tool performs its primary transformation using real canonical inputs, returns inspectable structured outputs with provenance, persists through the correct existing owner, hands off a compatible packet to the next tool, respects user approvals, and has automated regression coverage. If any of these are not possible with available source data, the implementation must expose the limitation rather than simulate success.
