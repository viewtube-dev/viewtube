# ViewTube Frontend Scaffolds — Roadmap "Priority 25"

Drop-in frontend scaffolds for the 25 candidates in
`docs/product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md`
(branch `consolidated-feature-integration` conventions; verified stack: React 19 + Vite +
react-router-dom v7 + Tailwind v4, TypeScript, plain-TS service modules with `fetch`).

Built to the roadmap's guardrails: **no invented data** (stubs throw until the canonical
endpoint is confirmed), **no second registry/store** (registry entries target the canonical
`pageRegistry`; each capability reuses existing persistence owners), **honest states**
(idle/loading/ready/error + stale + explicit missing-data), **review-only handoffs**,
**public/degraded paths labeled as such**.

## Wiring (2 steps)

1. `src/app/AppRoutes.tsx` — add `{CAPABILITY_ROUTES_IMPORT}` inside your `<Routes>` tree
   (see `src/app/capabilitiesRoutes.tsx`).
2. `src/app/pageRegistry.ts` — paste the entries from
   `src/app/pageRegistry.capabilities-snippet.ts` so the `pageRegistry.test.ts`
   governance test (every route classified) passes. Defaults: `hidden` + `lab` until audited.

Flags: items 1 and 2 default ON (fully implemented review previews); the other
23 default OFF in `src/flags/featureFlags.ts` (localStorage override helper
included). Flip per capability as its A/B/C/D audit completes.

## Systems 1 and 2 — fully built

- **1 Channel Intelligence Engine** (`src/features/capabilities/channel-intelligence-engine/`):
  pure view-model core (`channelIntelligence.ts`) deriving performance patterns,
  audience summary, evidence-backed data-gap recommendations and a missing-input
  inventory from the canonical Brain snapshot contracts (`shared/brainContracts.ts`,
  mirrored from the `buildBrainContextPack` inputs); full tabbed page UI, honest
  disabled-analytics / endpoint-not-wired states, and vitest coverage.
- **2 Evidence-Connected AI Brain** (`src/features/capabilities/evidence-connected-brain/`):
  pure linking core (`evidenceLink.ts`) — canonical evidence-ID preservation, the
  orchestrator's invented-number scan ported from `BrainOrchestrator.ts`
  (`unsupportedNumbers`), limits assembled from evidence missingness/freshness/limitations
  and creator controls; composer + answer/limits/evidence/history UI, and a retry that
  only ever regenerates (never replays side effects), with vitest coverage.
- Both fetch data through `shared/capabilityAdapter.ts`: register the canonical service
  (e.g. `buildBrainContextPack` + analytics-canon snapshot loaders) via
  `setCapabilityAdapter(...)`, or wire the HTTP endpoint; with neither, calls fail with an
  explicit `CapabilityEndpointError` — fabricated data is impossible by construction.

## Roadmap item → files

| # | Roadmap item | Slug | Route | Files |
|---|---|---|---|---|
| 1 | Channel Intelligence Engine | `channel-intelligence-engine` | `/capabilities/channel-intelligence-engine` | `src/features/capabilities/channel-intelligence-engine/ChannelIntelligenceEnginePage.tsx`, `useChannelIntelligenceEngine.ts`, `ChannelIntelligenceEngineApi.ts`, `index.ts` |
| 2 | Evidence-Connected AI Brain | `evidence-connected-brain` | `/capabilities/evidence-connected-brain` | `src/features/capabilities/evidence-connected-brain/EvidenceConnectedBrainPage.tsx`, `useEvidenceConnectedBrain.ts`, `EvidenceConnectedBrainApi.ts`, `index.ts` |
| 3 | Channel Context Intake | `channel-context-intake` | `/capabilities/channel-context-intake` | `src/features/capabilities/channel-context-intake/ChannelContextIntakePage.tsx`, `useChannelContextIntake.ts`, `ChannelContextIntakeApi.ts`, `index.ts` |
| 4 | AI Prompt Library and Chat Handoff | `prompt-library-handoff` | `/capabilities/prompt-library-handoff` | `src/features/capabilities/prompt-library-handoff/PromptLibraryHandoffPage.tsx`, `usePromptLibraryHandoff.ts`, `PromptLibraryHandoffApi.ts`, `index.ts` |
| 5 | AI Video Editor | `ai-video-editor` | `/capabilities/ai-video-editor` | `src/features/capabilities/ai-video-editor/AiVideoEditorPage.tsx`, `useAiVideoEditor.ts`, `AiVideoEditorApi.ts`, `index.ts` |
| 6 | Shorts / Vertical Video Modes | `shorts-vertical-modes` | `/capabilities/shorts-vertical-modes` | `src/features/capabilities/shorts-vertical-modes/ShortsVerticalModesPage.tsx`, `useShortsVerticalModes.ts`, `ShortsVerticalModesApi.ts`, `index.ts` |
| 7 | Veo Video Generation Integration | `veo-video-generation` | `/capabilities/veo-video-generation` | `src/features/capabilities/veo-video-generation/VeoVideoGenerationPage.tsx`, `useVeoVideoGeneration.ts`, `VeoVideoGenerationApi.ts`, `index.ts` |
| 8 | Metadata Generation and Refinement | `metadata-refinement` | `/capabilities/metadata-refinement` | `src/features/capabilities/metadata-refinement/MetadataRefinementPage.tsx`, `useMetadataRefinement.ts`, `MetadataRefinementApi.ts`, `index.ts` |
| 9 | Thumbnail Upload and Reuse | `thumbnail-upload-reuse` | `/capabilities/thumbnail-upload-reuse` | `src/features/capabilities/thumbnail-upload-reuse/ThumbnailUploadReusePage.tsx`, `useThumbnailUploadReuse.ts`, `ThumbnailUploadReuseApi.ts`, `index.ts` |
| 10 | Ranked Tag Generation and Analysis | `ranked-tag-analysis` | `/capabilities/ranked-tag-analysis` | `src/features/capabilities/ranked-tag-analysis/RankedTagAnalysisPage.tsx`, `useRankedTagAnalysis.ts`, `RankedTagAnalysisApi.ts`, `index.ts` |
| 11 | Transcript and Language Tools | `transcript-language-tools` | `/capabilities/transcript-language-tools` | `src/features/capabilities/transcript-language-tools/TranscriptLanguageToolsPage.tsx`, `useTranscriptLanguageTools.ts`, `TranscriptLanguageToolsApi.ts`, `index.ts` |
| 12 | Caption and Subtitle Management | `caption-subtitle-management` | `/capabilities/caption-subtitle-management` | `src/features/capabilities/caption-subtitle-management/CaptionSubtitleManagementPage.tsx`, `useCaptionSubtitleManagement.ts`, `CaptionSubtitleManagementApi.ts`, `index.ts` |
| 13 | KPI and Time-Window Controls | `kpi-time-window-controls` | `/capabilities/kpi-time-window-controls` | `src/features/capabilities/kpi-time-window-controls/KpiTimeWindowControlsPage.tsx`, `useKpiTimeWindowControls.ts`, `KpiTimeWindowControlsApi.ts`, `index.ts` |
| 14 | CSV / Document Analytics | `csv-document-analytics` | `/capabilities/csv-document-analytics` | `src/features/capabilities/csv-document-analytics/CsvDocumentAnalyticsPage.tsx`, `useCsvDocumentAnalytics.ts`, `CsvDocumentAnalyticsApi.ts`, `index.ts` |
| 15 | Cross-Video Performance Comparison | `cross-video-comparison` | `/capabilities/cross-video-comparison` | `src/features/capabilities/cross-video-comparison/CrossVideoComparisonPage.tsx`, `useCrossVideoComparison.ts`, `CrossVideoComparisonApi.ts`, `index.ts` |
| 16 | Evidence Quality and Source Validation | `evidence-quality-validation` | `/capabilities/evidence-quality-validation` | `src/features/capabilities/evidence-quality-validation/EvidenceQualityValidationPage.tsx`, `useEvidenceQualityValidation.ts`, `EvidenceQualityValidationApi.ts`, `index.ts` |
| 17 | Content Opportunity Discovery | `opportunity-discovery` | `/capabilities/opportunity-discovery` | `src/features/capabilities/opportunity-discovery/OpportunityDiscoveryPage.tsx`, `useOpportunityDiscovery.ts`, `OpportunityDiscoveryApi.ts`, `index.ts` |
| 18 | Manage Channel Information | `channel-information-management` | `/capabilities/channel-information-management` | `src/features/capabilities/channel-information-management/ChannelInformationManagementPage.tsx`, `useChannelInformationManagement.ts`, `ChannelInformationManagementApi.ts`, `index.ts` |
| 19 | Public Channel Resolution Without Login | `public-channel-resolution` | `/capabilities/public-channel-resolution` | `src/features/capabilities/public-channel-resolution/PublicChannelResolutionPage.tsx`, `usePublicChannelResolution.ts`, `PublicChannelResolutionApi.ts`, `index.ts` |
| 20 | Project / Package State Persistence and Resume | `project-state-resume` | `/capabilities/project-state-resume` | `src/features/capabilities/project-state-resume/ProjectStateResumePage.tsx`, `useProjectStateResume.ts`, `ProjectStateResumeApi.ts`, `index.ts` |
| 21 | Cross-Tool Workflow Handoffs | `cross-tool-handoffs` | `/capabilities/cross-tool-handoffs` | `src/features/capabilities/cross-tool-handoffs/CrossToolHandoffsPage.tsx`, `useCrossToolHandoffs.ts`, `CrossToolHandoffsApi.ts`, `index.ts` |
| 22 | Subscriber / API Dispatch Functions | `subscriber-api-dispatch` | `/capabilities/subscriber-api-dispatch` | `src/features/capabilities/subscriber-api-dispatch/SubscriberApiDispatchPage.tsx`, `useSubscriberApiDispatch.ts`, `SubscriberApiDispatchApi.ts`, `index.ts` |
| 23 | Hidden Tools, Widgets, and Pages | `hidden-tools-pages` | `/capabilities/hidden-tools-pages` | `src/features/capabilities/hidden-tools-pages/HiddenToolsPagesPage.tsx`, `useHiddenToolsPages.ts`, `HiddenToolsPagesApi.ts`, `index.ts` |
| 24 | Advanced Studio Control Modes | `advanced-studio-controls` | `/capabilities/advanced-studio-controls` | `src/features/capabilities/advanced-studio-controls/AdvancedStudioControlsPage.tsx`, `useAdvancedStudioControls.ts`, `AdvancedStudioControlsApi.ts`, `index.ts` |
| 25 | Unified Feature Discovery and Action Registry | `feature-discovery-registry` | `/capabilities/feature-discovery-registry` | `src/features/capabilities/feature-discovery-registry/FeatureDiscoveryRegistryPage.tsx`, `useFeatureDiscoveryRegistry.ts`, `FeatureDiscoveryRegistryApi.ts`, `index.ts` |

Shared modules (all 25 use these):

| File | Purpose |
|---|---|
| `src/features/capabilities/registry.ts` | Scaffold index of all 25 (id, route, flag, footholds, classification = `unverified`) |
| `src/features/capabilities/CapabilityHub.tsx` | Searchable discovery hub at `/capabilities` (item 25 UI scaffold) |
| `src/features/capabilities/shared/asyncCapabilityStore.ts` | Honest-state store factory + `useAsyncCapability` hook |
| `src/features/capabilities/shared/CapabilityPageShell.tsx` | Page chrome: flag gate + audit-gate banner + footholds note |
| `src/features/capabilities/shared/FlagGate.tsx` | Renders page content only when the capability flag is on |
| `src/features/capabilities/shared/AsyncStateView.tsx` | Truthful idle/loading/ready/error/stale renderer |
| `src/features/capabilities/shared/EvidencePanel.tsx` | Canonical-ID evidence display (item 16 pattern; renders nothing when no pack) |
| `src/flags/featureFlags.ts` | 25 feature flags + localStorage override |
| `src/app/capabilitiesRoutes.tsx` | Lazy, code-split route table (uses the repo's `lazyRoute`) |
| `src/app/pageRegistry.capabilities-snippet.ts` | Paste-in entries for the canonical pageRegistry |
| `src/api/client.ts` | `apiFetch` wrapper; scaffold paths throw `ScaffoldEndpointError` |

## Per-capability TODOs (every item)

1. Verify implementation + active caller on `consolidated-feature-integration` and record the
   audit row the roadmap requires (branch/SHA, files, caller, state owner, tests, A/B/C/D,
   smallest vertical slice, rollback boundary).
2. Replace the throwing stub in `<Cap>Api.ts` with the confirmed endpoint (path + params),
   keeping the typed request/response contracts.
3. Confirm/write the state owner — reuse the canonical store/persistence (e.g.
   `CreatorContextResolver`, analytics-canon, Project/ContentBuild owners); never add a parallel one.
4. Replace the generic page panel with real Studio primitives from `src/studio-ui` (canonical
   exports only; no ad hoc page CSS).
5. Item-specific gates to enforce before exposure:
   - 5 AI Video Editor: only implemented ops with permission checks + truthful job states.
   - 6 Shorts: confirm behavior is implemented, not a type/prompt label.
   - 7 Veo: only configured/authorized provider paths; real job/result IDs + failure states.
   - 8 Metadata: keep draft vs saved/published distinct.
   - 9 Thumbnails: canonical asset IDs, no duplicate upload pipeline.
   - 10 Tags: reset stale results on video change; suggestions ≠ persisted tags.
   - 11 Transcripts: label missing provider data; never fabricate content.
   - 12 Captions: only expose write ops with supported APIs + authorization.
   - 13 KPI: respect stale/missing diagnostics; no inferred metrics.
   - 14 CSV: validate schema/provenance/scope; no silent dataset merging.
   - 15 Comparison: preserve cohort, filters, metric definitions across navigation.
   - 16 Evidence: display only actual diagnostics + canonical refs (see `EvidencePanel.tsx`).
   - 17 Opportunities: separate evidence-backed findings from hypotheses.
   - 18/19 Channel/public-mode: extend existing Settings UI; label live vs fixture vs degraded.
   - 20 Resume: verify save/restore/no-project states on canonical owners.
   - 21 Handoffs: review-only; retry generation only, never replay external side effects.
   - 22 Dispatch: explicit user authorization + server-side checks before reachability.
   - 23 Hidden pages: entry only via verified route graph + runtime route tests.
   - 24 Studio modes: canonical exports; keep focus/keyboard/responsive behavior.
6. Flip the flag in `src/flags/featureFlags.ts`, then the pageRegistry entry
   (`hidden`/`lab` → `drawer`/`beta`+), then run `npm run check:routes` + `npm run typecheck`.
