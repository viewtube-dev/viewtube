# MANIFEST — flat filename → repository path

**Package:** ViewTube Priority-25 frontend scaffold (25 capability scaffolds; systems 1 & 2 fully implemented).
**Source tree:** `viewtube-frontend-scaffold/` (drop-in for [viewtube-dev/viewtube](https://github.com/viewtube-dev/viewtube)).
**Naming rule:** flat filename = repo path with every `/` replaced by `__` (e.g. `src__features__capabilities__registry.ts` → `src/features/capabilities/registry.ts`). Two special cases: `SCAFFOLD-README.md` → `README.md` (the scaffold's own readme) and `ROADMAP-REFERENCE.md` is package-only reference (already lives in the repo at `docs/product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md`).

**Source files: 118 · restore target paths: 118 (1:1, no collisions — verified)**

## Repo files (restore these into the checkout)

| Flat filename in this folder | Repository path |
|---|---|
| `SCAFFOLD-README.md` | `README.md` |
| `src__api__client.ts` | `src/api/client.ts` |
| `src__app__capabilitiesRoutes.tsx` | `src/app/capabilitiesRoutes.tsx` |
| `src__app__pageRegistry.capabilities-snippet.ts` | `src/app/pageRegistry.capabilities-snippet.ts` |
| `src__features__capabilities__CapabilityHub.tsx` | `src/features/capabilities/CapabilityHub.tsx` |
| `src__features__capabilities__advanced-studio-controls__AdvancedStudioControlsApi.ts` | `src/features/capabilities/advanced-studio-controls/AdvancedStudioControlsApi.ts` |
| `src__features__capabilities__advanced-studio-controls__AdvancedStudioControlsPage.tsx` | `src/features/capabilities/advanced-studio-controls/AdvancedStudioControlsPage.tsx` |
| `src__features__capabilities__advanced-studio-controls__index.ts` | `src/features/capabilities/advanced-studio-controls/index.ts` |
| `src__features__capabilities__advanced-studio-controls__useAdvancedStudioControls.ts` | `src/features/capabilities/advanced-studio-controls/useAdvancedStudioControls.ts` |
| `src__features__capabilities__ai-video-editor__AiVideoEditorApi.ts` | `src/features/capabilities/ai-video-editor/AiVideoEditorApi.ts` |
| `src__features__capabilities__ai-video-editor__AiVideoEditorPage.tsx` | `src/features/capabilities/ai-video-editor/AiVideoEditorPage.tsx` |
| `src__features__capabilities__ai-video-editor__index.ts` | `src/features/capabilities/ai-video-editor/index.ts` |
| `src__features__capabilities__ai-video-editor__useAiVideoEditor.ts` | `src/features/capabilities/ai-video-editor/useAiVideoEditor.ts` |
| `src__features__capabilities__caption-subtitle-management__CaptionSubtitleManagementApi.ts` | `src/features/capabilities/caption-subtitle-management/CaptionSubtitleManagementApi.ts` |
| `src__features__capabilities__caption-subtitle-management__CaptionSubtitleManagementPage.tsx` | `src/features/capabilities/caption-subtitle-management/CaptionSubtitleManagementPage.tsx` |
| `src__features__capabilities__caption-subtitle-management__index.ts` | `src/features/capabilities/caption-subtitle-management/index.ts` |
| `src__features__capabilities__caption-subtitle-management__useCaptionSubtitleManagement.ts` | `src/features/capabilities/caption-subtitle-management/useCaptionSubtitleManagement.ts` |
| `src__features__capabilities__channel-context-intake__ChannelContextIntakeApi.ts` | `src/features/capabilities/channel-context-intake/ChannelContextIntakeApi.ts` |
| `src__features__capabilities__channel-context-intake__ChannelContextIntakePage.tsx` | `src/features/capabilities/channel-context-intake/ChannelContextIntakePage.tsx` |
| `src__features__capabilities__channel-context-intake__index.ts` | `src/features/capabilities/channel-context-intake/index.ts` |
| `src__features__capabilities__channel-context-intake__useChannelContextIntake.ts` | `src/features/capabilities/channel-context-intake/useChannelContextIntake.ts` |
| `src__features__capabilities__channel-information-management__ChannelInformationManagementApi.ts` | `src/features/capabilities/channel-information-management/ChannelInformationManagementApi.ts` |
| `src__features__capabilities__channel-information-management__ChannelInformationManagementPage.tsx` | `src/features/capabilities/channel-information-management/ChannelInformationManagementPage.tsx` |
| `src__features__capabilities__channel-information-management__index.ts` | `src/features/capabilities/channel-information-management/index.ts` |
| `src__features__capabilities__channel-information-management__useChannelInformationManagement.ts` | `src/features/capabilities/channel-information-management/useChannelInformationManagement.ts` |
| `src__features__capabilities__channel-intelligence-engine__ChannelIntelligenceEngineApi.ts` | `src/features/capabilities/channel-intelligence-engine/ChannelIntelligenceEngineApi.ts` |
| `src__features__capabilities__channel-intelligence-engine__ChannelIntelligenceEnginePage.tsx` | `src/features/capabilities/channel-intelligence-engine/ChannelIntelligenceEnginePage.tsx` |
| `src__features__capabilities__channel-intelligence-engine__channelIntelligence.test.ts` | `src/features/capabilities/channel-intelligence-engine/channelIntelligence.test.ts` |
| `src__features__capabilities__channel-intelligence-engine__channelIntelligence.ts` | `src/features/capabilities/channel-intelligence-engine/channelIntelligence.ts` |
| `src__features__capabilities__channel-intelligence-engine__index.ts` | `src/features/capabilities/channel-intelligence-engine/index.ts` |
| `src__features__capabilities__channel-intelligence-engine__useChannelIntelligenceEngine.ts` | `src/features/capabilities/channel-intelligence-engine/useChannelIntelligenceEngine.ts` |
| `src__features__capabilities__cross-tool-handoffs__CrossToolHandoffsApi.ts` | `src/features/capabilities/cross-tool-handoffs/CrossToolHandoffsApi.ts` |
| `src__features__capabilities__cross-tool-handoffs__CrossToolHandoffsPage.tsx` | `src/features/capabilities/cross-tool-handoffs/CrossToolHandoffsPage.tsx` |
| `src__features__capabilities__cross-tool-handoffs__index.ts` | `src/features/capabilities/cross-tool-handoffs/index.ts` |
| `src__features__capabilities__cross-tool-handoffs__useCrossToolHandoffs.ts` | `src/features/capabilities/cross-tool-handoffs/useCrossToolHandoffs.ts` |
| `src__features__capabilities__cross-video-comparison__CrossVideoComparisonApi.ts` | `src/features/capabilities/cross-video-comparison/CrossVideoComparisonApi.ts` |
| `src__features__capabilities__cross-video-comparison__CrossVideoComparisonPage.tsx` | `src/features/capabilities/cross-video-comparison/CrossVideoComparisonPage.tsx` |
| `src__features__capabilities__cross-video-comparison__index.ts` | `src/features/capabilities/cross-video-comparison/index.ts` |
| `src__features__capabilities__cross-video-comparison__useCrossVideoComparison.ts` | `src/features/capabilities/cross-video-comparison/useCrossVideoComparison.ts` |
| `src__features__capabilities__csv-document-analytics__CsvDocumentAnalyticsApi.ts` | `src/features/capabilities/csv-document-analytics/CsvDocumentAnalyticsApi.ts` |
| `src__features__capabilities__csv-document-analytics__CsvDocumentAnalyticsPage.tsx` | `src/features/capabilities/csv-document-analytics/CsvDocumentAnalyticsPage.tsx` |
| `src__features__capabilities__csv-document-analytics__index.ts` | `src/features/capabilities/csv-document-analytics/index.ts` |
| `src__features__capabilities__csv-document-analytics__useCsvDocumentAnalytics.ts` | `src/features/capabilities/csv-document-analytics/useCsvDocumentAnalytics.ts` |
| `src__features__capabilities__evidence-connected-brain__EvidenceConnectedBrainApi.ts` | `src/features/capabilities/evidence-connected-brain/EvidenceConnectedBrainApi.ts` |
| `src__features__capabilities__evidence-connected-brain__EvidenceConnectedBrainPage.tsx` | `src/features/capabilities/evidence-connected-brain/EvidenceConnectedBrainPage.tsx` |
| `src__features__capabilities__evidence-connected-brain__evidenceLink.test.ts` | `src/features/capabilities/evidence-connected-brain/evidenceLink.test.ts` |
| `src__features__capabilities__evidence-connected-brain__evidenceLink.ts` | `src/features/capabilities/evidence-connected-brain/evidenceLink.ts` |
| `src__features__capabilities__evidence-connected-brain__index.ts` | `src/features/capabilities/evidence-connected-brain/index.ts` |
| `src__features__capabilities__evidence-connected-brain__useEvidenceConnectedBrain.ts` | `src/features/capabilities/evidence-connected-brain/useEvidenceConnectedBrain.ts` |
| `src__features__capabilities__evidence-quality-validation__EvidenceQualityValidationApi.ts` | `src/features/capabilities/evidence-quality-validation/EvidenceQualityValidationApi.ts` |
| `src__features__capabilities__evidence-quality-validation__EvidenceQualityValidationPage.tsx` | `src/features/capabilities/evidence-quality-validation/EvidenceQualityValidationPage.tsx` |
| `src__features__capabilities__evidence-quality-validation__index.ts` | `src/features/capabilities/evidence-quality-validation/index.ts` |
| `src__features__capabilities__evidence-quality-validation__useEvidenceQualityValidation.ts` | `src/features/capabilities/evidence-quality-validation/useEvidenceQualityValidation.ts` |
| `src__features__capabilities__feature-discovery-registry__FeatureDiscoveryRegistryApi.ts` | `src/features/capabilities/feature-discovery-registry/FeatureDiscoveryRegistryApi.ts` |
| `src__features__capabilities__feature-discovery-registry__FeatureDiscoveryRegistryPage.tsx` | `src/features/capabilities/feature-discovery-registry/FeatureDiscoveryRegistryPage.tsx` |
| `src__features__capabilities__feature-discovery-registry__index.ts` | `src/features/capabilities/feature-discovery-registry/index.ts` |
| `src__features__capabilities__feature-discovery-registry__useFeatureDiscoveryRegistry.ts` | `src/features/capabilities/feature-discovery-registry/useFeatureDiscoveryRegistry.ts` |
| `src__features__capabilities__hidden-tools-pages__HiddenToolsPagesApi.ts` | `src/features/capabilities/hidden-tools-pages/HiddenToolsPagesApi.ts` |
| `src__features__capabilities__hidden-tools-pages__HiddenToolsPagesPage.tsx` | `src/features/capabilities/hidden-tools-pages/HiddenToolsPagesPage.tsx` |
| `src__features__capabilities__hidden-tools-pages__index.ts` | `src/features/capabilities/hidden-tools-pages/index.ts` |
| `src__features__capabilities__hidden-tools-pages__useHiddenToolsPages.ts` | `src/features/capabilities/hidden-tools-pages/useHiddenToolsPages.ts` |
| `src__features__capabilities__kpi-time-window-controls__KpiTimeWindowControlsApi.ts` | `src/features/capabilities/kpi-time-window-controls/KpiTimeWindowControlsApi.ts` |
| `src__features__capabilities__kpi-time-window-controls__KpiTimeWindowControlsPage.tsx` | `src/features/capabilities/kpi-time-window-controls/KpiTimeWindowControlsPage.tsx` |
| `src__features__capabilities__kpi-time-window-controls__index.ts` | `src/features/capabilities/kpi-time-window-controls/index.ts` |
| `src__features__capabilities__kpi-time-window-controls__useKpiTimeWindowControls.ts` | `src/features/capabilities/kpi-time-window-controls/useKpiTimeWindowControls.ts` |
| `src__features__capabilities__metadata-refinement__MetadataRefinementApi.ts` | `src/features/capabilities/metadata-refinement/MetadataRefinementApi.ts` |
| `src__features__capabilities__metadata-refinement__MetadataRefinementPage.tsx` | `src/features/capabilities/metadata-refinement/MetadataRefinementPage.tsx` |
| `src__features__capabilities__metadata-refinement__index.ts` | `src/features/capabilities/metadata-refinement/index.ts` |
| `src__features__capabilities__metadata-refinement__useMetadataRefinement.ts` | `src/features/capabilities/metadata-refinement/useMetadataRefinement.ts` |
| `src__features__capabilities__opportunity-discovery__OpportunityDiscoveryApi.ts` | `src/features/capabilities/opportunity-discovery/OpportunityDiscoveryApi.ts` |
| `src__features__capabilities__opportunity-discovery__OpportunityDiscoveryPage.tsx` | `src/features/capabilities/opportunity-discovery/OpportunityDiscoveryPage.tsx` |
| `src__features__capabilities__opportunity-discovery__index.ts` | `src/features/capabilities/opportunity-discovery/index.ts` |
| `src__features__capabilities__opportunity-discovery__useOpportunityDiscovery.ts` | `src/features/capabilities/opportunity-discovery/useOpportunityDiscovery.ts` |
| `src__features__capabilities__project-state-resume__ProjectStateResumeApi.ts` | `src/features/capabilities/project-state-resume/ProjectStateResumeApi.ts` |
| `src__features__capabilities__project-state-resume__ProjectStateResumePage.tsx` | `src/features/capabilities/project-state-resume/ProjectStateResumePage.tsx` |
| `src__features__capabilities__project-state-resume__index.ts` | `src/features/capabilities/project-state-resume/index.ts` |
| `src__features__capabilities__project-state-resume__useProjectStateResume.ts` | `src/features/capabilities/project-state-resume/useProjectStateResume.ts` |
| `src__features__capabilities__prompt-library-handoff__PromptLibraryHandoffApi.ts` | `src/features/capabilities/prompt-library-handoff/PromptLibraryHandoffApi.ts` |
| `src__features__capabilities__prompt-library-handoff__PromptLibraryHandoffPage.tsx` | `src/features/capabilities/prompt-library-handoff/PromptLibraryHandoffPage.tsx` |
| `src__features__capabilities__prompt-library-handoff__index.ts` | `src/features/capabilities/prompt-library-handoff/index.ts` |
| `src__features__capabilities__prompt-library-handoff__usePromptLibraryHandoff.ts` | `src/features/capabilities/prompt-library-handoff/usePromptLibraryHandoff.ts` |
| `src__features__capabilities__public-channel-resolution__PublicChannelResolutionApi.ts` | `src/features/capabilities/public-channel-resolution/PublicChannelResolutionApi.ts` |
| `src__features__capabilities__public-channel-resolution__PublicChannelResolutionPage.tsx` | `src/features/capabilities/public-channel-resolution/PublicChannelResolutionPage.tsx` |
| `src__features__capabilities__public-channel-resolution__index.ts` | `src/features/capabilities/public-channel-resolution/index.ts` |
| `src__features__capabilities__public-channel-resolution__usePublicChannelResolution.ts` | `src/features/capabilities/public-channel-resolution/usePublicChannelResolution.ts` |
| `src__features__capabilities__ranked-tag-analysis__RankedTagAnalysisApi.ts` | `src/features/capabilities/ranked-tag-analysis/RankedTagAnalysisApi.ts` |
| `src__features__capabilities__ranked-tag-analysis__RankedTagAnalysisPage.tsx` | `src/features/capabilities/ranked-tag-analysis/RankedTagAnalysisPage.tsx` |
| `src__features__capabilities__ranked-tag-analysis__index.ts` | `src/features/capabilities/ranked-tag-analysis/index.ts` |
| `src__features__capabilities__ranked-tag-analysis__useRankedTagAnalysis.ts` | `src/features/capabilities/ranked-tag-analysis/useRankedTagAnalysis.ts` |
| `src__features__capabilities__registry.ts` | `src/features/capabilities/registry.ts` |
| `src__features__capabilities__shared__AsyncStateView.tsx` | `src/features/capabilities/shared/AsyncStateView.tsx` |
| `src__features__capabilities__shared__CapabilityPageShell.tsx` | `src/features/capabilities/shared/CapabilityPageShell.tsx` |
| `src__features__capabilities__shared__EvidencePanel.tsx` | `src/features/capabilities/shared/EvidencePanel.tsx` |
| `src__features__capabilities__shared__FlagGate.tsx` | `src/features/capabilities/shared/FlagGate.tsx` |
| `src__features__capabilities__shared__asyncCapabilityStore.ts` | `src/features/capabilities/shared/asyncCapabilityStore.ts` |
| `src__features__capabilities__shared__brainContracts.ts` | `src/features/capabilities/shared/brainContracts.ts` |
| `src__features__capabilities__shared__capabilityAdapter.ts` | `src/features/capabilities/shared/capabilityAdapter.ts` |
| `src__features__capabilities__shorts-vertical-modes__ShortsVerticalModesApi.ts` | `src/features/capabilities/shorts-vertical-modes/ShortsVerticalModesApi.ts` |
| `src__features__capabilities__shorts-vertical-modes__ShortsVerticalModesPage.tsx` | `src/features/capabilities/shorts-vertical-modes/ShortsVerticalModesPage.tsx` |
| `src__features__capabilities__shorts-vertical-modes__index.ts` | `src/features/capabilities/shorts-vertical-modes/index.ts` |
| `src__features__capabilities__shorts-vertical-modes__useShortsVerticalModes.ts` | `src/features/capabilities/shorts-vertical-modes/useShortsVerticalModes.ts` |
| `src__features__capabilities__subscriber-api-dispatch__SubscriberApiDispatchApi.ts` | `src/features/capabilities/subscriber-api-dispatch/SubscriberApiDispatchApi.ts` |
| `src__features__capabilities__subscriber-api-dispatch__SubscriberApiDispatchPage.tsx` | `src/features/capabilities/subscriber-api-dispatch/SubscriberApiDispatchPage.tsx` |
| `src__features__capabilities__subscriber-api-dispatch__index.ts` | `src/features/capabilities/subscriber-api-dispatch/index.ts` |
| `src__features__capabilities__subscriber-api-dispatch__useSubscriberApiDispatch.ts` | `src/features/capabilities/subscriber-api-dispatch/useSubscriberApiDispatch.ts` |
| `src__features__capabilities__thumbnail-upload-reuse__ThumbnailUploadReuseApi.ts` | `src/features/capabilities/thumbnail-upload-reuse/ThumbnailUploadReuseApi.ts` |
| `src__features__capabilities__thumbnail-upload-reuse__ThumbnailUploadReusePage.tsx` | `src/features/capabilities/thumbnail-upload-reuse/ThumbnailUploadReusePage.tsx` |
| `src__features__capabilities__thumbnail-upload-reuse__index.ts` | `src/features/capabilities/thumbnail-upload-reuse/index.ts` |
| `src__features__capabilities__thumbnail-upload-reuse__useThumbnailUploadReuse.ts` | `src/features/capabilities/thumbnail-upload-reuse/useThumbnailUploadReuse.ts` |
| `src__features__capabilities__transcript-language-tools__TranscriptLanguageToolsApi.ts` | `src/features/capabilities/transcript-language-tools/TranscriptLanguageToolsApi.ts` |
| `src__features__capabilities__transcript-language-tools__TranscriptLanguageToolsPage.tsx` | `src/features/capabilities/transcript-language-tools/TranscriptLanguageToolsPage.tsx` |
| `src__features__capabilities__transcript-language-tools__index.ts` | `src/features/capabilities/transcript-language-tools/index.ts` |
| `src__features__capabilities__transcript-language-tools__useTranscriptLanguageTools.ts` | `src/features/capabilities/transcript-language-tools/useTranscriptLanguageTools.ts` |
| `src__features__capabilities__veo-video-generation__VeoVideoGenerationApi.ts` | `src/features/capabilities/veo-video-generation/VeoVideoGenerationApi.ts` |
| `src__features__capabilities__veo-video-generation__VeoVideoGenerationPage.tsx` | `src/features/capabilities/veo-video-generation/VeoVideoGenerationPage.tsx` |
| `src__features__capabilities__veo-video-generation__index.ts` | `src/features/capabilities/veo-video-generation/index.ts` |
| `src__features__capabilities__veo-video-generation__useVeoVideoGeneration.ts` | `src/features/capabilities/veo-video-generation/useVeoVideoGeneration.ts` |
| `src__flags__featureFlags.ts` | `src/flags/featureFlags.ts` |

## Package-only files (do NOT restore into the repo)

| File | Purpose |
|---|---|
| `README.md` | Step-by-step git/PR walkthrough + copy-paste coding-agent prompt |
| `MANIFEST.md` | This file |
| `restore-to-repo.sh` | Restores flat files into a repo checkout per the mapping above |
| `ROADMAP-REFERENCE.md` | Copy of the source roadmap doc (already in the repo under `docs/product/`) |
