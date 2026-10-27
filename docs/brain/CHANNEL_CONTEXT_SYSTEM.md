# Channel Context System

**Status:** Initial implementation on `feat/channel-context-system-ui`; runtime/build verification pending.

## Ownership

- Questions and field paths: `src/context/channelContextQuestions.ts`.
- Profile shape: `src/context/ChannelContextProfile.ts`.
- Required-field completion: `src/context/ChannelContextScoring.ts`.
- Deterministic creator-answer graph projection: `src/context/ChannelContextGraphBuilder.ts`.
- Persistence: existing `vt_ai_brain_context_v1` storage and `loadAiBrainContext` / `saveAiBrainContext` in `src/services/aiBrainContext.ts`. The new `channelContext` field is backward-compatible and defaults to an empty profile for older records.
- UI: `src/views/settings/ChannelContextSettingsSection.tsx`, mounted in the existing AI Settings panel and built with exported Studio controls.

## Data and evidence boundaries

Answers are creator-provided context, not observed evidence. The graph builder labels nodes from creator answers and currently emits empty `evidenceIds`; it does not claim external verification or manufacture evidence receipts. Competitor and topic identifiers are normalized for deduplication. Required completion is based on the question registry and reports actual field paths.

The context question registry has 25 questions across identity, goals, audience, content, brand, and intelligence. Array answers are entered as comma-separated values; creativity is constrained to 1–10. The current completion score measures required-answer coverage only; it is not a confidence, readiness, or channel-performance score.

## Phase 2 — Brain prompt integration

The AI Brain chat and retry prompt paths now pass the saved channel profile into `buildAIBrainSystemPrompt`. The prompt formatter emits only non-empty fields, labels them as creator-provided and unverified, includes creator-stated blocked themes, and explicitly says that source/capability preferences do not override runtime authorization. Focused formatter tests cover empty profiles, useful context, and omission of blank claims.

The account simulation default profile also includes the new empty `channelContext` shape. The prompt integration reads the canonical existing profile at each turn, so saved settings edits can affect the next request without introducing a parallel prompt store.

## Integration boundary

The draft referenced `src/core/context/types` and `src/core/bootstrap/registerDefaultCapabilities.ts`, but those exact paths were not present on the target branch during implementation inspection. This change therefore defines a narrow local graph projection and does not invent or register a parallel capability registry. Capability bootstrap integration must use the actual canonical registry once its current owner/path is verified.
