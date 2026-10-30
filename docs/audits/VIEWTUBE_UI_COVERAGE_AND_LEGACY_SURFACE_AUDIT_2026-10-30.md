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


## Second-pass addendum — capability loader and navigation wiring

**Audit pass date:** 2026-10-30  
**Source branch:** `master/consolidated-feature-integration`  
**Scope:** Target-branch source inspection of the capability route loader, two representative capability pages and their API adapters, the actual navigation consumers, and existing route governance tests.

### F-006 — Capability page loader expects filenames that do not match the actual page modules

**Severity:** P1 — lazy route runtime failure  
**Confidence:** Confirmed by source and directory listings

Evidence:
- `src/app/capabilitiesRoutes.tsx` builds the lazy import key as `../features/capabilities/${slug}/${slug}Page.tsx`.
- The route's Vite glob is `../features/capabilities/**/*Page.tsx`, so it only registers actual files matching the glob.
- The `channel-intelligence-engine` directory contains `ChannelIntelligenceEnginePage.tsx`, not `channel-intelligence-enginePage.tsx`.
- The `evidence-connected-brain` directory contains `EvidenceConnectedBrainPage.tsx`, not `evidence-connected-brainPage.tsx`.
- The loader throws `Capability page module not found` when its computed key is absent.

Impact:
- These two registered routes cannot resolve their page modules through the current slug-derived loader. The failure is deferred until the lazy route is rendered, so route registration and page-registry tests can pass while navigation to the page fails.
- This is a confirmed defect for the two inspected pages. The remaining 23 page directories still require filename-by-filename verification; do not extrapolate a complete failure count without that inspection.

Required remediation:
- Make the capability registry carry an explicit page-module key/path, or use a canonical slug-to-loader mapping generated from the existing page files.
- Add a test that resolves every `CAPABILITIES` entry against the exact Vite glob key and asserts every loader exists.
- Do not rename files wholesale without checking imports, history, and ownership; explicit mapping may be the lower-churn correction.

### F-007 — Evidence-connected Brain page is still a review-preview, not an evidence-connected user capability

**Severity:** P1 — feature claim / implementation gap  
**Confidence:** Confirmed from page source

Evidence:
- `EvidenceConnectedBrainPage.tsx` defines `REVIEW_PREVIEW_CONTROLS` locally with all controls enabled instead of reading canonical Brain user controls.
- The page creates `suppliedPack` as a memoized empty array: `useMemo(() => [], [])`.
- The answer builder receives that empty pack for every turn, so the page cannot display the exact evidence pack supplied to the Brain turn.
- The page itself labels the controls as review-preview values and comments that the canonical evidence loader is not wired.
- `EvidenceConnectedBrainApi.ts` can call the shared `runBrainTurn` adapter or configured endpoint, but that alone does not connect the returned turn's evidence pack to the page's `suppliedPack`.

Impact:
- The page can submit a Brain question, but its central advertised evidence-linking behavior is not integrated. Its UI deliberately falls back to “no evidence pack supplied” rather than displaying evidence.
- Keep this capability classified as lab/unverified until it consumes the exact canonical evidence pack and canonical user controls for the same turn.

Required remediation:
- Return or retain the exact evidence pack identity and refs from the canonical Brain turn result; do not reconstruct a second evidence store.
- Read controls through the canonical Brain user-controls reader.
- Add tests proving that evidence shown in the UI is the exact evidence supplied to that turn, and that disabled analytics/personalization controls are respected.

### F-008 — Existing page-registry navigation projection is not the source consumed by the inspected navigation renderers

**Severity:** P1 — registry synchronization / discoverability risk  
**Confidence:** Confirmed for the inspected renderers

Evidence:
- `AdaptiveNavigationShell.tsx` imports and consumes `PRIMARY_NAV_ITEMS` from `navigationContract.ts`.
- `ApplicationAccountMenu.tsx` imports and consumes `APPLICATION_MENU_DESTINATIONS` and `APPLICATION_MENU_GROUPS` from `applicationMenuContract.ts`.
- `pageRegistry.ts` separately exposes `pagesForNavigation()` and describes itself as the single source for path/title/section/visibility/lifecycle, while its own header says navigation contracts have not yet adopted it.
- `pageRegistry.test.ts` validates registry shape and route classification, but does not prove that the visible renderers derive their destinations from the page registry.
- `routeRegistryGovernance.test.ts` verifies that hard-coded primary-nav and application-menu paths exist in the statically parsed AppRoutes source. It does not verify page-registry visibility/lifecycle parity or lazy capability module resolution.

Impact:
- The page registry is currently a classification inventory, not the effective source of truth for the visible navigation destinations. Updating a page's registry visibility/lifecycle does not, by itself, update the inspected nav/menu contracts.
- Existing route governance protects only part of the relationship; it misses the lazy-loader defect in F-006.

Required remediation:
- Decide and document whether PAGE_REGISTRY is intended to govern navigation now or is only a future projection.
- If it is canonical, derive eligible route destinations from it while retaining typed menu-only actions and intentional menu metadata in their appropriate contracts.
- Extend tests to assert lifecycle/visibility parity, route alias behavior, menu-only actions, and all dynamic capability loader keys.

## Second-pass status

- Confirmed two capability page filename mismatches; remaining capability directories not exhaustively enumerated in this pass.
- Confirmed the evidence-connected Brain page is explicitly preview-wired with an empty evidence pack and hard-coded preview controls.
- Confirmed the inspected primary navigation and application menu consume separate contracts rather than the page-registry projection.
- No application source code was changed. No capability was promoted. No legacy code was deleted.
- No test suite, typecheck, production build, or browser runtime test was executed in this pass. Findings are source-evidence findings, not a claim of runtime certification.


## Third-pass addendum — exhaustive Priority 25 module and rollout wiring

**Audit pass date:** 2026-10-30  
**Source branch:** `master/consolidated-feature-integration`  
**Scope:** Exhaustive directory inventory of the 25 capability modules, route-loader key construction, shared page shell, feature-flag registry, capability hub, and existing route governance tests.

### F-009 — All 25 capability route loader keys mismatch the actual page-module filenames

**Severity:** P1 — all Priority 25 detail routes are expected to fail on lazy module resolution  
**Confidence:** Confirmed by exhaustive source directory inventory and loader implementation

Evidence:
- `CAPABILITIES` contains 25 kebab-case slugs and declares an explicit `files.page` path for each capability.
- The `src/features/capabilities` directory contains 25 matching capability directories (excluding the shared support directory); every capability directory has its own PascalCase `*Page.tsx` module.
- The actual filenames follow the explicit registry paths, for example `ChannelIntelligenceEnginePage.tsx`, `EvidenceConnectedBrainPage.tsx`, `AiVideoEditorPage.tsx`, `KpiTimeWindowControlsPage.tsx`, and `CsvDocumentAnalyticsPage.tsx`.
- `src/app/capabilitiesRoutes.tsx` ignores the already-declared `files.page` field and instead constructs `../features/capabilities/${slug}/${slug}Page.tsx`.
- The Vite glob is keyed by actual source paths, so kebab-case generated keys do not match the PascalCase filenames.
- The loader throws `Capability page module not found` when the computed key is absent.

Impact:
- The two mismatches in F-006 are representative, not isolated: the mismatch applies to all 25 capability detail routes.
- `/capabilities` can render the capability index, but selecting any detail route attempts a missing lazy module key.
- The capability detail page's shared flag gate cannot protect or render a page whose module never resolves.
- Existing route-governance tests only parse static `<Route path>` strings and therefore do not validate the Vite glob key or lazy import resolution.

Required remediation:
- Use the canonical `CAPABILITIES[].files.page` value to resolve each Vite glob module, normalizing it to the glob's exact relative key; do not duplicate filename conventions or rename all page files.
- Add a test that iterates all 25 capability records and asserts that each declared page path exists and resolves to one exact Vite glob key.
- Add a route-level test that renders or resolves every capability route so lazy import failures are caught before release.

### F-010 — Rollout flags exist and are enforced in the shared page shell, but only after lazy module resolution

**Severity:** P1 — rollout gate ordering / misleading discoverability  
**Confidence:** Confirmed by source

Evidence:
- `src/features/capabilities/shared/CapabilityPageShell.tsx` calls `isCapabilityFlagEnabled(capability.id)` and wraps page content in `FlagGate`.
- `src/flags/featureFlags.ts` defines all 25 capability flags and defaults only the first two review previews to enabled; the other 23 default off.
- `CapabilityHub.tsx` displays each capability's enabled/disabled flag state and links to its detail route.
- The route loader resolves the page module before the page component can render its shared shell and flag gate.

Impact:
- The rollout gate is present; this is not a finding that all 25 pages bypass flags.
- However, the gate is downstream of the broken lazy import. It cannot make any detail route load successfully.
- After the loader is fixed, verify that direct URL access, hub links, and local-storage overrides all retain the intended hidden/lab policy. A feature flag is not a substitute for route lifecycle or authorization.

Required remediation:
- Preserve the existing canonical flag registry and shared `CapabilityPageShell`; do not add another flag system.
- Resolve the module first using the declared page path, then retain the shared shell's flag gate.
- Add tests for default-off behavior, the two preview exceptions, unknown slugs, and explicit local override behavior.

### F-011 — Existing governance tests miss the capability lazy-loader contract

**Severity:** P2 — regression detection gap  
**Confidence:** Confirmed from test source

Evidence:
- `src/app/__tests__/pageRegistry.test.ts` extracts static route paths from `AppRoutes.tsx` and checks page-registry classification.
- `src/app/__tests__/routeRegistryGovernance.test.ts` checks that primary-navigation and application-menu paths occur in the statically parsed route set, plus duplicate IDs in selected registries.
- Neither test imports or validates `CAPABILITIES`, inspects the Vite glob keys, checks each `files.page` path, or resolves each lazy loader.

Impact:
- CI can pass route and registry governance while every Priority 25 detail route still has an invalid lazy module key.
- This is a concrete example of why route existence and UI registration must be distinguished from functional user access.

Required remediation:
- Add a dedicated capability-route governance test around the declared page-module paths and the loader-key mapping.
- Keep static route-registry tests; extend them rather than replacing them.

## Third-pass status

- Exhaustively inspected all 25 capability directories and their page-module filenames.
- Confirmed the slug-derived lazy-loader key is incompatible with all 25 actual PascalCase page filenames.
- Confirmed the shared feature-flag gate exists and is applied by the page shell; it is reached only after the detail module loads.
- Confirmed current route governance tests do not exercise capability lazy-module resolution.
- No application source code was changed. No feature was promoted. No legacy code was deleted.
- No tests, typecheck, production build, or browser runtime tests were executed. This remains source-level verification, not runtime certification.


## Fourth-pass addendum — navigation registry and super-tool route metadata

**Audit pass date:** 2026-10-30  
**Source branch:** `master/consolidated-feature-integration`  
**Scope:** Primary navigation, application menu, page registry consumers, route-prefetch map, super-tool route metadata, Brain surface matching, and related governance tests.

### F-012 — Page lifecycle/visibility registry is not the runtime source for primary navigation

**Severity:** P2 — duplicated navigation authority and drift risk  
**Confidence:** Confirmed by source search and consumer inspection

Evidence:
- `src/app/pageRegistry.ts` describes `PAGE_REGISTRY` as the single source of truth for route, section, navigation visibility, and lifecycle.
- It exports `pagesForNavigation()`, but repository search finds its only callsites in `src/app/__tests__/pageRegistry.test.ts`; the runtime primary navigation does not consume it.
- `src/components/navigation/navigationContract.ts` independently hard-codes the 10 primary navigation destinations in `PRIMARY_NAV_ITEMS`.
- `src/components/navigation/applicationMenuContract.ts` independently hard-codes 16 application-menu destinations, labels, descriptions, paths, keywords, and groups.
- `AdaptiveNavigationShell.tsx` renders the primary navigation from `PRIMARY_NAV_ITEMS`; `ApplicationAccountMenu.tsx` renders the application menu from `APPLICATION_MENU_DESTINATIONS`.
- Existing route governance tests prove these hard-coded visible paths occur in `AppRoutes.tsx`, and page-registry tests prove route paths are classified. They do not prove that the runtime navigation is generated from or consistent with the lifecycle/visibility metadata in `PAGE_REGISTRY`.

Impact:
- The page registry is useful route/lifecycle metadata and is consumed by other surfaces such as recent destinations and the quick switcher, but it is not yet the single runtime authority for the primary nav or application menu.
- A destination can be marked hidden/lab/legacy in `PAGE_REGISTRY` while remaining independently listed in a navigation contract unless separate code and tests are updated.
- This is a real duplicated-source-of-truth risk, not evidence that the current 10 primary links or 16 menu entries are individually broken.

Required remediation:
- Decide whether the canonical registry should drive navigation or remain descriptive metadata. Do not claim it is the runtime navigation source until the consumers actually use it.
- If adopting it, migrate incrementally and preserve menu-specific metadata/actions (such as the Gemini settings action) as a thin extension, not a second route registry.
- Add a governance test comparing every visible navigation destination with the matching page-registry entry's visibility and lifecycle; explicitly account for query strings, action-only entries, and aliases.

### F-013 — Super-tool route metadata contains direct paths not served by the router

**Severity:** P2 — stale user-facing route labels and incorrect Brain surface matching  
**Confidence:** Confirmed by source and consumer inspection

Evidence:
- `src/app/AppRoutes.tsx` serves internal tools through `/tools` and `/tools/:toolId`; the mounted view registry constructs the canonical tool URL with `superToolRoute(id)`, which returns `/tools/${id}`.
- `src/services/superToolRegistry.ts` still advertises direct paths that are not declared in `AppRoutes.tsx`, including `/shorts-extraction`, `/brain-command-center`, `/retention-autopsy`, and `/workflow-chain-builder`.
- The route arrays are not dead metadata: `src/components/SuperToolRail.tsx` displays them, `src/views/UserGuide.tsx` uses the first route as a tool link destination, and `src/services/brain/BrainSurfaceContext.ts` matches active paths against them to populate `superToolIds`.
- `src/app/__tests__/superToolViewRegistry.test.ts` validates the runtime plan's `currentRouteReality` for mounted tools, but it does not validate the separate `SUPER_TOOLS[].routes` array against actual routes or the canonical `/tools/:toolId` resolver.

Impact:
- Some guide/tool surfaces can advertise direct URLs that fall through to the catch-all redirect instead of opening the tool.
- Brain surface context can fail to associate the canonical `/tools/:toolId` route with its super-tool when the registry only lists legacy/direct paths.
- This is separate from the already-correct `currentRouteReality` contract; the audit must reconcile both fields without changing editor-bound VT_E1 boundaries or embedded routes.

Required remediation:
- Preserve `SUPER_TOOLS` as the canonical tool-concept registry, but distinguish canonical mount route from legitimate host/embedded surfaces.
- For mounted tools, ensure the canonical `/tools/:toolId` path is represented wherever route matching or direct linking requires it.
- Remove or redirect stale direct paths only after checking bookmarks, persisted Brain command actions, guide links, and embedded host routes.
- Add tests for every route exposed by user-facing tool links and for `buildBrainSurfaceContext({ pathname: superToolRoute(id) })`.

### Fourth-pass status

- Confirmed primary navigation and application menu remain independent hard-coded contracts; the page registry's visibility helper is not used by runtime navigation.
- Confirmed four stale direct super-tool paths are advertised while the router's canonical mounted-tool route is `/tools/:toolId`.
- Confirmed super-tool route metadata is consumed by the User Guide, SuperToolRail, and Brain surface context.
- No application source code was changed. No route was removed or promoted.
- No tests, typecheck, production build, or browser runtime tests were executed. This remains source-level verification, not runtime certification.


## Fifth-pass addendum — Studio Hub inventory and Component Library authority

**Audit pass date:** 2026-10-30  
**Source branch:** `master/consolidated-feature-integration`  
**Scope:** Studio Hub's live component imports, Toolbox Reference Library tracks, canonical confirmed catalog, legacy comparison catalog, and Studio audit documentation.

### F-014 — Studio Hub's scoped audit plan is missing four currently mounted modules

**Severity:** P2 — stale audit coverage / incomplete front-end inventory  
**Confidence:** Confirmed by direct source-to-document comparison

Evidence:
- Current `src/views/StudioHub.tsx` mounts 16 top-level modules/sections: Toolbox UI Reference Library, Video Manager, Concept Scene Studio, Video Director, Studio Publishing Cockpit, Video Publisher, Metadata Master, Media Analyzer, Thumbnail Studio, Community Posts, Comment Responder, End-Screen Architect, Pre-Launch Priming, Hook Generator, Actionable Tactics, and Script Architect.
- `docs/architecture/STUDIO_HUB_UNIFORM_PRIMITIVE_AUDIT_PLAN_2026-09-16.md` says its current top-level inventory contains 12 systems and lists the Reference Library, Video Manager, Video Publisher, Media Analyzer, Thumbnail Studio, Community Posts, Comment Responder, End-Screen Architect, Pre-Launch Priming, Hook Generator, Actionable Tactics, and Script Architect.
- The plan omits four live StudioHub imports/sections: `ConceptSceneStudio`, `VideoDirector`, `StudioPublishingCockpit`, and `MetadataMaster`.

Impact:
- The scoped primitive audit plan can be read as a complete Studio Hub inventory while excluding four live user-facing modules.
- Those omitted modules can escape shell, state, mobile, and primitive coverage if the plan is followed literally.

Required remediation:
- Refresh the plan's inventory from the actual `StudioHub.tsx` import/render graph.
- Distinguish top-level modules from nested submodules and reference/certification surfaces; do not inflate the count with controls or child components.
- Keep the existing StudioHub source as runtime authority and the scoped audit plan as a generated/reconciled work plan.

### F-015 — Component Library index still names the legacy comparison catalog as the production registry

**Severity:** P2 — stale source-of-truth pointer / misleading catalog documentation  
**Confidence:** Confirmed by current code and canonical documentation

Evidence:
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_SOURCE_OF_TRUTH.md` states that `StudioHubConfirmedPrimitiveCatalog.tsx` is the active audited catalog for production-imported primitive representatives and that `StudioHubCompletePrimitiveCatalog.tsx` is retained as a comparison/migration surface, not the current production-family authority.
- `src/components/studio-hub/StudioHubCompletePrimitiveCatalog.tsx` explicitly describes itself as the legacy comparison catalog and exports the 76-entry `STUDIO_HUB_COMPONENT_FAMILIES` list.
- `docs/ui/STUDIO_HUB_COMPONENT_LIBRARY_COMPONENT_INDEX.md` still labels itself a generated production-registry reference and points its source/count at that legacy Complete catalog (76 families).
- `src/components/ToolboxUIReferenceLibrary.tsx` currently renders three distinct tracks: Hardcoded comparison, Primitive migration, and Confirmed primitives. The old track is intentionally retained and visibly labeled as a frozen comparison baseline; its presence is not itself a defect.

Impact:
- The component index can lead an auditor or agent to treat the legacy comparison family list as the active production registry.
- This conflicts with the newer source-of-truth contract and risks edits or feature claims being made against the wrong catalog.

Required remediation:
- Regenerate or rewrite the component index from the Confirmed catalog's actual family/provenance source.
- Label the Complete catalog and its 76-entry list explicitly as legacy comparison inventory.
- Preserve the three UI tracks until their documented consumers and migration dependencies are verified; do not delete the comparison baseline as part of this documentation correction.

### Fifth-pass status

- Compared the current StudioHub render tree against the September scoped audit plan; found four omitted live modules.
- Confirmed the Complete catalog contains 76 comparison families and is explicitly described as legacy.
- Confirmed the active Component Library source-of-truth document assigns production representative authority to the Confirmed catalog, while the generated component index still points at Complete.
- Confirmed the Reference Library intentionally renders Hardcoded, Primitive, and Confirmed tracks; this is a comparison/certification surface, not three independent production implementations.
- No application source code was changed. No catalog track was deleted or promoted.
- No tests, typecheck, production build, or browser runtime tests were executed. This remains source-level verification, not runtime certification.


### F-016 — User Guide search index omits several live Studio Hub modules

**Severity:** P2 — incomplete feature discovery/documentation  
**Confidence:** Confirmed by current StudioHub imports and User Guide search-index construction

Evidence:
- `src/views/StudioHub.tsx` mounts Concept + Scene Studio, Video Director, Studio Publishing Cockpit, Metadata Master, Community Posts, Comment Responder, End-Screen Architect, Pre-Launch Priming, and Actionable Tactics as live Studio modules.
- `src/views/UserGuide.tsx` builds its searchable destination index from `GUIDE_FEATURES`, `GUIDE_TOOLS`, datasets, metrics, and widgets.
- `src/content/guide-v2/featureRegistry.ts` has a generic Studio Hub feature entry and individual entries for some Studio tools (for example Video Manager, Media Analyzer, Video Publisher, Hook Generator, Script Architect, Packaging Lab Pro, Thumbnail Studio, Algorithm Architect, and Storyboard Studio), but no individual feature entries for the nine modules listed above.
- `src/content/guide-v2/toolRegistry.ts` derives its tool entries from `SUPER_TOOLS`; the current 16 super-tool definitions are a separate concept inventory and do not provide named entries for those nine StudioHub modules.

Impact:
- Those modules are accessible within Studio Hub, so this is not a missing-runtime-UI finding.
- However, users searching the User Guide for these exact tools/functions will not find a dedicated result explaining what the module does or how to reach it.
- The generic Studio Hub entry does not expose the full module-level feature inventory or their ownership/handoff distinctions.

Required remediation:
- Reconcile the Guide feature registry against the actual StudioHub module inventory and canonical Studio Hub ownership document.
- Add module-level guide entries only where a distinct user-facing capability needs its own explanation; use the parent Studio Hub route plus a stable section anchor where available rather than inventing new standalone routes.
- Preserve the distinction between a module, a subtool, a capability, and a super-tool so the Guide does not create a parallel product taxonomy.



## Sixth-pass addendum — Settings, Brain controls, and Gemini provider surfaces

**Audit pass date:** 2026-10-30  
**Source branch:** `master/consolidated-feature-integration`  
**Scope:** Settings AI panel, model selector, key-vault persistence, Gemini model governance, Brain user-control storage, and public-handle selection boundaries.

### F-017 — Settings describes the Gemini key store as a secure vault, but the implementation is browser localStorage

**Severity:** P1 — credential-storage disclosure and security-expectation mismatch  
**Classification:** `MISLEADING_UI`  
**Confidence:** Confirmed by Settings copy and key-vault implementation

Evidence:
- `src/views/settings/SettingsAiPanel.tsx` tells users: “The existing secure vault remains the storage authority.”
- `src/services/keyVault.ts` implements `getBrowserStorage()` by returning browser `localStorage`; Gemini key aliases are read from and written to `yt_api_key`, `vt_gemini_api_key`, `gemini_api_key`, and `google_api_key`.
- `setVaultKey("gemini", value)` writes the trimmed API key to each of those localStorage entries. There is no encryption or server-side secret-vault operation in this implementation.
- `src/services/gemini.ts` retrieves the key through `getVaultKey` and constructs the provider client in the browser.

Impact:
- “Secure vault” can reasonably lead users to expect protected secret storage, while the current implementation is same-origin JavaScript-accessible browser storage.
- This is a security disclosure/UI-copy mismatch, not evidence that the key is transmitted to an unintended third party.
- Existing key aliases may preserve backward compatibility; do not remove them without a migration and consumer audit.

Required remediation:
- Either migrate BYOK credentials to an appropriately protected server-side secret store with an explicit threat model, or accurately disclose browser-local storage and its limitations in Settings.
- Do not call localStorage-backed storage encrypted or secure.
- Preserve the canonical `keyVault.ts` API and key-updated event while changing the backing store; do not create a second vault abstraction.
- Add tests for storage behavior, migration/alias cleanup, and the user-facing disclosure.

### F-018 — Gemini API-key save state confirms persistence, but the Settings flow has no provider-validation state

**Severity:** P2 — incomplete credential setup feedback  
**Classification:** `PARTIAL_UI`  
**Confidence:** Confirmed by Settings event path and provider-client construction

Evidence:
- `src/views/Settings.tsx` initializes the key field from `getVaultSnapshot().gemini`; its save handler calls `setVaultSnapshot({ gemini: geminiKey })` and reports “API key saved.”
- `src/views/settings/SettingsAiPanel.tsx` exposes a key input and Save action, but no Validate/Test action or validation status.
- `src/services/gemini.ts` checks only that a key exists before constructing `GoogleGenAI`; provider rejection is surfaced later when a generation operation runs.
- The save confirmation is accurate as a persistence confirmation; it does not establish that the key is valid, enabled for the requested API, or authorized for the selected model.

Impact:
- Users can complete the visible setup flow with a malformed, revoked, or unauthorized key and only discover the failure on a later generation attempt.
- Do not change the save message to imply validation. A separate, explicit validation state would make the setup contract clearer.

Required remediation:
- Keep Save and provider validation as distinct states/actions.
- If a safe validation operation is added, use a minimal provider-supported request, avoid logging or echoing key material, and report valid / invalid / unavailable distinctly.
- Retain the current persistence path and do not add an alternate key registry.

### Sixth-pass positive evidence and boundaries

- `src/config/aiConfig.ts` derives the model selector's options directly from `GEMINI_MODEL_REGISTRY`; it is a projection, not a competing model list.
- `AIModelSelector` persists the user preference through the existing Brain context and calls `resolveGeminiModel` to display the effective text model when substitution occurs.
- `src/services/gemini.ts` applies canonical model resolution, capability-specific generation profiles, bounded fallback, and emits model-fallback telemetry through the existing governance layer. This is a meaningful canonical foundation; do not replace it with a parallel provider registry.
- The model governance registry explicitly marks retained pricing as `legacy-app-estimate` and `verified: false`. Preserve that uncertainty; do not present those figures as verified current provider pricing.
- `src/services/brain/BrainUserControls.ts` provides a channel-scoped control record with a global fallback and explicit controls for analytics, projects, comments, Vault, Publisher, interaction learning, and external-action approval. Existing Brain services consume these controls; this audit did not establish a missing controls surface or bypass.
- `src/services/publicHandleMode.ts` reads the user's explicit `vt_ingest_mode === "public_handle"` selection. Public-page snapshots deliberately null subscriber/video/view counts and per-video engagement counts rather than inventing private analytics. The generic Brain runtime is documented not to read browser storage directly; callers supply selected public-handle context.
- The public-handle evidence inspected here is not a complete end-to-end proof that every Brain entry point enforces public-only boundaries. Continue tracing each caller and context-pack builder before certifying that boundary.

### Sixth-pass status

- Confirmed the mismatch between “secure vault” UI copy and browser localStorage credential persistence.
- Confirmed the Settings save action persists a key but does not validate it with the provider.
- Confirmed the model selector projects from the canonical Gemini governance registry and the generation client consumes the canonical resolver/profile/fallback layer.
- Confirmed public-page ingestion strips analytics counts rather than fabricating them; end-to-end public-only Brain enforcement remains unverified.
- No application source code was changed. No key, model, or Brain policy was modified.
- No tests, typecheck, production build, provider request, or browser runtime tests were executed. This remains source-level verification, not runtime certification.
