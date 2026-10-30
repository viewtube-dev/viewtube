# Public resolver production integration, caching, provenance and public-only boundaries

**Status:** DISCOVERY / VERIFICATION REQUIRED. **Canonical owner:** Settings public handle selection → publicHandleMode client service → api/public-channel.mjs server endpoint → BrainRuntime publicHandleContext → SidebarChatbot/AIBrainCommandInterface/BrainHubWidget. Public context is distinct from authenticated channelId.

## Existing code and task links
publicHandleMode.ts; api/public-channel.mjs; api/public-channel.node.test.mjs; api/public-channel.test.ts; publicHandleMode tests; BrainRuntime.ts; BrainRuntimeContracts.ts; explicit Settings/Sidebar/AI Brain/Brain Hub callers.

## Guardrails
Current cache is schema v1, max 20 entries, positive 3-hour TTL; do not claim proposed 6h/3h/30m policy is implemented. No OAuth/private Analytics/fabricated metrics. Stale scaffold under src/features/capabilities/public-channel-resolution is not canonical.

## Work packet
- [Audit checklist](audit-checklist.md)
- [Test and runtime plan](test-plan.md)
- [Agent brief](agent-brief.md)
- Parent [program inventory](../../inventory.md), [task crosswalk](../../task-crosswalk.md), [identity map](../../identity-map.md), [verification matrix](../../verification.md).

This folder is a work packet, not a new source-of-truth store or task ledger.
