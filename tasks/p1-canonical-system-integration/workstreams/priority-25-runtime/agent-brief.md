# Agent Brief — Priority-25 capability identity and production runtime verification

## Mission
Complete this workstream by extending the existing canonical owners. Do not create parallel architecture or claim completion from file/route existence.

## Read first
1. Repository `AGENTS.md` and relevant governance authorities.
2. Parent P1 program README, plan, inventory, task crosswalk, identity map and verification matrix.
3. This workstream's plan, audit checklist and test plan.
4. Existing source owners, tests, capability homes and active PR/branch donors.

## Canonical ownership
Capability registry and capability home own definition; BrainRuntime and actual feature caller own execution; Task Authority owns task identity. Exact identity is unresolved.

## Existing implementation leads
No Priority-25 identity found among 13 capability records/homes. VT-025 is unrelated Analytics legacy selector/cache retirement. Existing audit commands: audit:reach, audit:ai-systems; tests: test:ai-systems-governance.

## Guardrails
Do not substitute VT-025 for Priority-25. Do not invent capability IDs, routes or callers. Do not mark restored because a file, registry row or route exists.

## Required workflow
1. Reconcile current target SHA, task identity, work claim and PR donors.
2. Complete source/caller/ownership audit before edits.
3. Write a failing focused test before behavior changes; follow RED → GREEN → REFACTOR.
4. Implement the smallest vertical slice in the existing owner.
5. Run focused tests, typecheck/build as appropriate, and production-caller runtime proof.
6. Request independent review; update authoritative docs/registry and Task Authority only with evidence.
7. Open a focused PR; preserve unrelated work and avoid wholesale stale-branch merges.

## Required evidence
No implementation runtime gate can be claimed until identity is confirmed. Then invoke from intended user surface with valid/invalid permissions, empty/stale context, service outage and retry; collect exact caller and runtime receipt.

## Recommended skills
TDD; planning/task breakdown; doubt-driven development; codebase design; code review; comprehensive QA; resume-interrupted-task.

## Plugins/tools
GitHub; Browser Use; AI Delivery Evidence Checker. Do not use AI App Readiness Checker unless the identified capability is itself an AI app submission.

## Handoff format
State exact task IDs, branch/PR/commit, changed paths, tests and exit codes, runtime surfaces/states, evidence IDs/provenance, unresolved risks, next action. No fabricated receipts.
