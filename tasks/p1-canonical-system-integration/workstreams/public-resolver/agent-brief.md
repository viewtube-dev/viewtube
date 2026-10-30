# Agent Brief — Public resolver production integration, caching, provenance and public-only boundaries

## Mission
Complete this workstream by extending the existing canonical owners. Do not create parallel architecture or claim completion from file/route existence.

## Read first
1. Repository `AGENTS.md` and relevant governance authorities.
2. Parent P1 program README, plan, inventory, task crosswalk, identity map and verification matrix.
3. This workstream's plan, audit checklist and test plan.
4. Existing source owners, tests, capability homes and active PR/branch donors.

## Canonical ownership
Settings public handle selection → publicHandleMode client service → api/public-channel.mjs server endpoint → BrainRuntime publicHandleContext → SidebarChatbot/AIBrainCommandInterface/BrainHubWidget. Public context is distinct from authenticated channelId.

## Existing implementation leads
publicHandleMode.ts; api/public-channel.mjs; api/public-channel.node.test.mjs; api/public-channel.test.ts; publicHandleMode tests; BrainRuntime.ts; BrainRuntimeContracts.ts; explicit Settings/Sidebar/AI Brain/Brain Hub callers.

## Guardrails
Current cache is schema v1, max 20 entries, positive 3-hour TTL; do not claim proposed 6h/3h/30m policy is implemented. No OAuth/private Analytics/fabricated metrics. Stale scaffold under src/features/capabilities/public-channel-resolution is not canonical.

## Required workflow
1. Reconcile current target SHA, task identity, work claim and PR donors.
2. Complete source/caller/ownership audit before edits.
3. Write a failing focused test before behavior changes; follow RED → GREEN → REFACTOR.
4. Implement the smallest vertical slice in the existing owner.
5. Run focused tests, typecheck/build as appropriate, and production-caller runtime proof.
6. Request independent review; update authoritative docs/registry and Task Authority only with evidence.
7. Open a focused PR; preserve unrelated work and avoid wholesale stale-branch merges.

## Required evidence
Logged-out Settings handle selection → each Brain surface; valid, invalid, unknown, cache hit, expiry/stale, outage and RSS ingestion. Confirm private Analytics/OAuth data never enters context and missing metrics remain null.

## Recommended skills
TDD; security/doubt-driven development; systematic debugging; code review; comprehensive QA; domain modeling.

## Plugins/tools
GitHub; Browser Use; AI Delivery Evidence Checker; SiteTriage only if a deployed endpoint has DNS/TLS/edge availability issues.

## Handoff format
State exact task IDs, branch/PR/commit, changed paths, tests and exit codes, runtime surfaces/states, evidence IDs/provenance, unresolved risks, next action. No fabricated receipts.
