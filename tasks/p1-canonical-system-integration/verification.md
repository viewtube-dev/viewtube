# P1 Integration Verification Matrix
**Production Date:** 2026-10-29 | **Last Edited:** 2026-10-29 | **Class:** SPECIFICATION | **Status:** ACTIVE — planning contract
**Concern:** evidence gates for six P1 workstreams | **Owner:** Verification + Integrated Application Program
**Registry ID:** DOC-SPEC-P1-INTEGRATION-VERIFICATION

## Required receipt
Record workstream/CAP/task IDs; branch/PR/commit; paths; environment; exact route/caller; authenticated/logged-out state; correlation/operation/event IDs; fixture/data provenance; commands and exit codes; screenshots/log refs; failures/limitations; reviewer and next action. Never include secrets or raw private payloads.

## Verification layers
1. Static owner/import/caller map.
2. Typed contract tests: schema, errors, missingness, provenance, identity.
3. Focused regression tests.
4. Producer→adapter→consumer integration; retries/idempotency and negative cases.
5. Actual production-caller runtime reachability.
6. Actionable secret-safe diagnostics.
7. Visual/responsive proof for visible Brain/settings/Studio flows.
8. Build/typecheck/full suite; separate pre-existing from introduced failures.

## Workstream gates
| Workstream | Focused gates | Runtime proof |
|---|---|---|
| Brain | CreatorContextResolver, EvidenceIntelligenceResolver, BrainRuntimeSnapshot, BrainLearningPersistence, BrainEvaluationLoop, BrainProjectContext, BrainCommunicationIngestion, event ancestry/outcome tests | profile→evidence→task→action→outcome journey |
| Gemini | provider/gateway, architecture guard, GeminiKeyContext, key vault, operation/receipt, prompt governance | key validation, provider/model selection, reasoning + generation, invalid/unsupported/outage |
| Diagnostics | test:unified-diagnostics, schema/lineage/producer/idempotency tests | correlated success and safe failure |
| Priority-25 | identity-specific tests, audit:reach, AI governance | real caller and permission/context negative cases |
| Public resolver | test:public-page-resolver | logged-out handle, cache states, public-only proof |
| Studio | test:studio-controls, field ownership, parity, catalog, geometry | real exports, keyboard/touch, desktop/mobile visual proof |

## Repository commands
test:unified-diagnostics; test:public-page-resolver; test:studio-controls; test:studio-field-style-ownership; test:confirmed-library-layout; test:focused; audit:ai-systems; test:ai-systems-governance; audit:reach; typecheck; build; npm test when scope/environment permit. Script names were found in package.json; confirm exact test paths on implementation branch.

## Evidence rule
A passing test proves only its assertions. A build proves buildability. A route proves registration. A registry proves declaration. Runtime receipt proves only the observed path/state.
