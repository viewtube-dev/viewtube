# Agent Brief — Unified diagnostics and shared event identity

## Mission
Complete this workstream by extending the existing canonical owners. Do not create parallel architecture or claim completion from file/route existence.

## Read first
1. Repository `AGENTS.md` and relevant governance authorities.
2. Parent P1 program README, plan, inventory, task crosswalk, identity map and verification matrix.
3. This workstream's plan, audit checklist and test plan.
4. Existing source owners, tests, capability homes and active PR/branch donors.

## Canonical ownership
OperationEnvelope and OperationRecord remain identity contracts; each domain event store remains its own persistence owner; diagnostics.ts/unified.ts and onScreenDiagnostics remain diagnostics projection and sanitization owners.

## Existing implementation leads
VT-005, VT-035, VT-036, VT-046; OperationEnvelope.ts; OperationRecord.ts; diagnostics.ts; diagnostics/unified.ts; onScreenDiagnostics.ts; BrainAssistantContinuity; BrainOutcomeLedger; AlgorithmIntelligenceEventLedger.

## Guardrails
No universal event store or diagnostics database. eventId ≠ operationId ≠ correlationId ≠ contextKey. Do not force operation fields onto non-operation diagnostics. Do not log prompts, credentials, private payloads or raw evidence.

## Required workflow
1. Reconcile current target SHA, task identity, work claim and PR donors.
2. Complete source/caller/ownership audit before edits.
3. Write a failing focused test before behavior changes; follow RED → GREEN → REFACTOR.
4. Implement the smallest vertical slice in the existing owner.
5. Run focused tests, typecheck/build as appropriate, and production-caller runtime proof.
6. Request independent review; update authoritative docs/registry and Task Authority only with evidence.
7. Open a focused PR; preserve unrelated work and avoid wholesale stale-branch merges.

## Required evidence
Trigger correlated Brain, generation, analytics/evidence, project/content/asset, outcome/learning and Studio export failures. Verify one trace can be traversed, recommendations are actionable, privacy redaction works and no store ownership changes.

## Recommended skills
TDD; domain modeling; codebase design; systematic debugging; code review; verification-before-completion; comprehensive QA.

## Plugins/tools
GitHub; Browser Use; AI Delivery Evidence Checker; Docs AI for drafting only.

## Handoff format
State exact task IDs, branch/PR/commit, changed paths, tests and exit codes, runtime surfaces/states, evidence IDs/provenance, unresolved risks, next action. No fabricated receipts.
