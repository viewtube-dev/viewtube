# Agent Brief — Gemini provider registry, key validation and generation-operation governance

## Mission
Complete this workstream by extending the existing canonical owners. Do not create parallel architecture or claim completion from file/route existence.

## Read first
1. Repository `AGENTS.md` and relevant governance authorities.
2. Parent P1 program README, plan, inventory, task crosswalk, identity map and verification matrix.
3. This workstream's plan, audit checklist and test plan.
4. Existing source owners, tests, capability homes and active PR/branch donors.

## Canonical ownership
BrainModelGateway/BrainModelProvider owns provider seam; GeminiKeyContext/key-vault owns key validation/storage; canonical generation runtime and OperationEnvelope/OperationRecord/ToolReceipt own operation governance; prompt registry/spec owns prompt inventory and policy.

## Existing implementation leads
Merged PRs #1109, #1168, #1169, #1174; BrainModelGateway.ts; GeminiKeyContext; scripts/audit/ai-generation-callers.mjs and tests; docs/plans/VIEWTUBE_BRAIN_MODEL_GATEWAY_CONVERGENCE_PLAN_2026-10-29.md; VIEWTUBE_AI_PROMPT_MIGRATION_AND_QUALITY_GOVERNANCE_PLAN_2026-10-29.md; VIEWTUBE_PROVIDER_CREDENTIAL_SECURITY_AND_BYOK_PLAN_2026-10-29.md.

## Guardrails
Do not infer a full provider registry from an interface seam. Gemini remains default. BYOK localStorage is not encrypted server storage. Never expose keys in errors/logs. No direct provider calls from UI.

## Required workflow
1. Reconcile current target SHA, task identity, work claim and PR donors.
2. Complete source/caller/ownership audit before edits.
3. Write a failing focused test before behavior changes; follow RED → GREEN → REFACTOR.
4. Implement the smallest vertical slice in the existing owner.
5. Run focused tests, typecheck/build as appropriate, and production-caller runtime proof.
6. Request independent review; update authoritative docs/registry and Task Authority only with evidence.
7. Open a focused PR; preserve unrelated work and avoid wholesale stale-branch merges.

## Required evidence
Exercise missing/invalid/valid key, unsupported model, provider outage, streaming, retry, logged-in and BYOK paths. Verify creator-safe errors, no secret leakage, correct provider/model/prompt provenance and operation receipt.

## Recommended skills
TDD; AI engineering; codebase design; security-oriented doubt-driven development; systematic debugging; code review; verification-before-completion.

## Plugins/tools
GitHub; Browser Use; AI Delivery Evidence Checker; AI App Readiness Checker for formal AI app readiness only.

## Handoff format
State exact task IDs, branch/PR/commit, changed paths, tests and exit codes, runtime surfaces/states, evidence IDs/provenance, unresolved risks, next action. No fabricated receipts.
