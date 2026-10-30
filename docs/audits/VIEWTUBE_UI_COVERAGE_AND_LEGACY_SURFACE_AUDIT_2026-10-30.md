# ViewTube UI Coverage & Legacy Surface Audit — First Pass

**Audit date:** 2026-10-30  
**Repository:** `viewtube-dev/viewtube`  
**Source branch:** `master/consolidated-feature-integration`  
**Audit branch:** `audit/viewtube-ui-coverage-2026-10-30`  
**Scope:** Static source inspection of route registration, page registry, primary navigation, application menu, capability scaffolds, Brain capability routing/governance, Studio entry points, and Gemini model governance.  
**Status:** First-pass findings; not a full runtime/browser certification.

## Executive summary

The repository already contains several mechanisms intended to prevent missing or stale UI: a central page registry, capability route scaffolds, a Brain capability registry, and AI-system governance registries. The main problem is that these authorities are not yet consistently synchronized or fully runtime-verified.

The strongest verified findings are:

1. **The 25-item capability roadmap is mounted as routes and classified as hidden/lab, but only 2 items are classified C and the remaining 23 are explicitly unverified.** These are not automatically missing features; they are a prioritized discovery and verification queue. Do not expose them as production functionality until their actual page, feature flag, API, permissions, and runtime behavior are checked.
2. **Route, page, primary-navigation, and application-menu definitions remain separate hard-coded surfaces.** The page-registry source itself documents this drift. This creates a real risk that routes and current capabilities exist without being discoverable through the expected navigation surface, or that labels and destinations diverge.
3. **Capability scaffold documentation contains stale implementation instructions.** It says to paste capability entries into the page registry even though the current page registry already imports the snippet, and AppRoutes already mounts CAPABILITY_ROUTES.
4. **The Brain capability governance projection is behind its source metadata.** It records a 2026-09-26 generation/audit SHA while the inspected target-branch source files have different current blob SHAs. The 14 runtime capability definitions and 14 active governance records have matching counts, but their freshness and per-record accuracy have not been re-certified against the target branch.
5. **Gemini model metadata explicitly labels pricing as legacy estimates and unverified.** This is a data-truth issue to audit anywhere pricing/cost is surfaced; the current inspection does not establish that a user-facing price is currently displayed, so it remains a follow-up verification item rather than a confirmed UI defect.

No production UI was changed during this audit.

## Findings

### F-001 — 23 capability roadmap entries remain unverified

**Severity:** P1 — verification and product-discovery gap  
**Confidence:** Confirmed registry state; runtime behavior not yet certified

Evidence:
- `src/features/capabilities/registry.ts` defines 25 roadmap capability records.
- Classification count in the current file: **2 C**, **23 unverified**.
- `src/app/capabilitiesRoutes.tsx` maps all `CAPABILITIES` entries to lazy routes.
- `src/app/pageRegistry.capabilities-snippet.ts` declares all 25 as `navigationVisibility: "hidden"` and `lifecycle: "lab"`.
- `src/app/AppRoutes.tsx` mounts `{CAPABILITY_ROUTES}`.
- `src/app/pageRegistry.ts` imports and spreads `CAPABILITY_PAGE_REGISTRY_ENTRIES`.

Interpretation:
- The 25 routes are not simply absent. They are deliberately scaffolded and hidden pending an A/B/C/D audit.
- The registry classifies 23 as unverified, so agents must not describe them as implemented/production-ready based on a route, filename, or roadmap entry alone.
- This is a strong source for discovering code that has not been connected to user-facing UI, but each candidate needs a trace through page component → store/API → service/backend → feature flag → permission → runtime test.

Required next action:
- Build a 25-row evidence matrix with page existence, imported services, API behavior, feature-flag enforcement, permission state, meaningful user action, empty/error/loading states, and runtime evidence.
- Classify each candidate A/B/C/D/unverified based on the repository's own gate definitions.
- Promote only verified capabilities into an appropriate user-facing entry point; retain hidden/lab for the rest.

### F-002 — Navigation and page discovery are not one synchronized authority

**Severity:** P1 — discoverability and stale destination risk  
**Confidence:** Confirmed source-level duplication; individual user-visible impact requires route/browser verification

Evidence:
- `src/app/pageRegistry.ts` says routes live in `AppRoutes.tsx`, visible navigation lives in `navigationContract.ts` and `applicationMenuContract.ts`, and these three sources "drift apart silently."
- `src/components/navigation/navigationContract.ts` independently hard-codes 10 primary navigation destinations.
- `src/components/navigation/applicationMenuContract.ts` independently hard-codes application-menu destinations, descriptions, keywords, and actions.
- `src/app/pageRegistry.ts` separately classifies routes and navigation visibility, with `pagesForNavigation()` as a projection helper.

Interpretation:
- Three maintained representations create multiple opportunities for stale labels, stale paths, missing menu destinations, or incorrect lifecycle/visibility.
- A route marked drawer/production in PAGE_REGISTRY is not automatically proven to be present in the actual drawer unless the drawer consumes that projection.
- The audit has not yet traced every navigation renderer to determine which source it consumes.

Required next action:
- Trace all consumers of PAGE_REGISTRY, `pagesForNavigation`, PRIMARY_NAV_ITEMS, and APPLICATION_MENU_DESTINATIONS.
- Produce a path/label/visibility reconciliation table and test every destination against AppRoutes.
- Prefer deriving navigation from the canonical page registry where semantics match; preserve explicit menu-only actions (e.g. Gemini settings) as typed actions rather than fake routes.
- Add automated drift tests for primary nav, drawer, application menu, aliases, and route lifecycle.

### F-003 — Capability scaffold instructions are stale

**Severity:** P2 — agent/documentation reliability  
**Confidence:** Confirmed

Evidence:
- `src/app/capabilitiesRoutes.tsx` describes adding CAPABILITY_ROUTES to AppRoutes and pasting page-registry entries.
- The inspected `src/app/AppRoutes.tsx` already imports and mounts CAPABILITY_ROUTES.
- The inspected `src/app/pageRegistry.ts` already imports and spreads CAPABILITY_PAGE_REGISTRY_ENTRIES.
- `src/app/pageRegistry.capabilities-snippet.ts` still describes itself as a snippet to paste into pageRegistry.

Interpretation:
- Current code has already completed the integration steps that the comments still instruct agents to perform.
- An agent following those comments could create duplicate route/registry entries or waste time attempting completed work.

Required next action:
- Rewrite comments to describe the current import-based architecture and identify the canonical edit points.
- Remove the word "snippet" or rename the file to reflect its actual role if that does not create unnecessary churn.
- Add a test that verifies the route and page registry remain connected.

### F-004 — Brain capability governance registry needs target-branch freshness reconciliation

**Severity:** P1 — governance accuracy  
**Confidence:** Confirmed metadata lag; semantic drift not yet established

Evidence:
- `src/services/brain/BrainCapabilityRegistry.ts` currently defines 14 capability IDs.
- `governance/ai-systems/registry/capabilities.json` contains 14 active records.
- The JSON declares `generatedAt: 2026-09-26T01:15:00-04:00` and `lastAuditedMainSha: fbc7d25c71fa89c312da32280d9f77182065b42a`.
- The target-branch blob SHAs inspected for the current Brain registry and domain authority differ from the registry's historical audit SHA.

Interpretation:
- Count parity is useful but does not prove exact ID, lifecycle, evidence requirement, ownership, test, and UI reachability parity.
- The governance registry must not be treated as freshly verified until regenerated/reconciled against the exact target branch head.

Required next action:
- Compare every runtime capability to its governance record by stable ID.
- Verify current ownership, source refs, tests, route/surface, permissions, evidence requirements, and lifecycle.
- Regenerate the projection from the current source rather than manually patching a stale snapshot.
- Record the exact target commit SHA and audit timestamp after verification.

### F-005 — Gemini pricing metadata is explicitly unverified legacy data

**Severity:** P2 — potential user-facing truth issue  
**Confidence:** Confirmed metadata; UI exposure not yet established

Evidence:
- `src/services/geminiModelGovernance.ts` defines model metadata and capability routing.
- Pricing fields are typed with source `legacy-app-estimate` and `verified: false`.
- The registry includes explicit legacy model entries and aliases alongside current entries.

Interpretation:
- Any UI that presents these values as current provider pricing, exact cost, or reliable cost comparison would be misleading.
- This audit has not yet confirmed which user-facing components render these fields.

Required next action:
- Search all consumers of `GEMINI_MODEL_REGISTRY`, `pricing`, `costMultiplier`, and model lifecycle.
- Ensure unverified estimates are either hidden, explicitly labelled estimates, or replaced by a verified provider-backed source.
- Verify that model pickers do not present legacy aliases as distinct current models unless compatibility behavior is intentionally explained.

## Existing positive foundations to preserve

- `AppRoutes.tsx` uses lazy route loading and mounts capability routes.
- `pageRegistry.ts` classifies routes by section, visibility, and lifecycle.
- The capability scaffold explicitly warns against creating a second universal capability database.
- Brain runtime capabilities have a bounded canonical registry.
- AI-system governance registries identify source refs, owners, lifecycle, and integration relationships.
- Gemini model governance separates capability routing from user model preference and records legacy lifecycle explicitly.

These should be connected and verified, not replaced with a competing registry or dashboard.

## Initial coverage matrix

| Surface / system | Current source found | Initial status | Required verification |
|---|---|---|---|
| Application routes | `src/app/AppRoutes.tsx` | Present | Route-to-page registry parity and browser reachability |
| Page registry | `src/app/pageRegistry.ts` | Present; separate from nav contracts | Actual consumers and stale comments |
| Primary navigation | `navigationContract.ts` | Hard-coded list | Compare to canonical production destinations |
| Application menu | `applicationMenuContract.ts` | Hard-coded list | Compare routes, labels, keywords, actions |
| Capability roadmap | `features/capabilities/registry.ts` | 25 records; 23 unverified | Per-capability end-to-end evidence |
| Capability routes | `app/capabilitiesRoutes.tsx` | All 25 mapped | Page files, flags, APIs, runtime state |
| Brain capabilities | `BrainCapabilityRegistry.ts` | 14 runtime entries | UI access, governance, evidence and permission parity |
| AI governance capabilities | `governance/ai-systems/registry/capabilities.json` | 14 active records; audit metadata old | Regenerate/reconcile against target branch |
| Studio Hub | `views/StudioHub.tsx` | Multiple tools composed into one surface | Component-to-tool registry, duplicate/hidden tools, current labels |
| Gemini models | `geminiModelGovernance.ts` | Registry present; estimates unverified | All UI consumers and live model availability |
| Settings / Brain controls | `views/Settings.tsx`, `views/BrainControlsPage.tsx` | User-facing controls present | Every setting's live effect, auth modes, stale explanatory copy |

## Next audit passes

1. **Capability runtime pass:** inspect all 25 capability pages, stores, API adapters, flags, service dependencies, and tests.
2. **Navigation reachability pass:** inspect all route/menu/drawer renderers; prove every production destination is reachable and every hidden/lab destination is intentionally hidden.
3. **Studio inventory pass:** compare all exported tools, Studio Hub modules, toolbox registries, internal tools, and actual menu entry points.
4. **Settings and Brain pass:** trace every setting/control to the runtime reader/writer and validate logged-in/logged-out states.
5. **Provider and generation pass:** compare provider/model registry, key validation, model selection UI, operation governance, and actual call sites.
6. **Legacy code pass:** trace legacy route aliases, old components, old model IDs, deprecated settings, and compatibility shims to determine whether each is still required.
7. **Runtime certification:** run targeted tests, build/type checks, and browser checks at desktop and mobile sizes before marking any UI correction complete.

## Audit rules

- A filename, route, exported symbol, TODO, registry entry, or comment is not proof that a feature works.
- A hidden route is not automatically a defect; verify intentional lifecycle and access policy.
- An absent navigation item is not automatically a missing capability; it may be intentionally embedded in a canonical parent surface.
- A code path is not a user capability until the complete caller, permission, state, error, and outcome path is verified.
- Never create a parallel registry, provider, store, Brain runtime, or UI system to fill an inventory gap.
- Do not delete legacy code until all import, route, persisted-state, compatibility, and user-guide consumers are accounted for.
- Separate confirmed findings, likely gaps, and unverified hypotheses.
- Record exact branch, commit SHA, source files, tests, and evidence for every status change.

## Source references

- [AppRoutes.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/app/AppRoutes.tsx)
- [pageRegistry.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/app/pageRegistry.ts)
- [pageRegistry.capabilities-snippet.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/app/pageRegistry.capabilities-snippet.ts)
- [capabilitiesRoutes.tsx](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/app/capabilitiesRoutes.tsx)
- [capability registry](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/features/capabilities/registry.ts)
- [BrainCapabilityRegistry.ts](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/brain/BrainCapabilityRegistry.ts)
- [AI capability governance registry](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/governance/ai-systems/registry/capabilities.json)
- [Gemini model governance](https://github.com/viewtube-dev/viewtube/blob/master/consolidated-feature-integration/src/services/geminiModelGovernance.ts)

---
**Completion status:** First-pass static audit documented. No code changes, no feature promotions, no legacy deletions, and no runtime claims have been made. The next pass must complete evidence-backed reachability checks before remediation.
