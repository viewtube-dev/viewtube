# AI Brain Chat — Studio Primitive Build Plan

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Status:** Implementation plan; this document is not evidence that the listed components have been built or browser-certified.  
**Primary authority:** [AI Brain Toolbox + Chat Overhaul](./AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md)

## Outcome

Finish the creator-facing AI Brain chat as a compact, legible, continuously scrolling conversation workspace built from the real Studio Controls system. Extend the existing page and data owners; do not create a second chat, runtime, prompt registry, persistence store, token system, or parallel component library.

## Scope and implementation order

### 0. Audit before editing

Inspect the current target branch, existing consumers, tests, and merged PRs before writing code. In particular reconcile PR #729 (overhaul plan and confidence badge), #733 (workspace/evidence phases), #744 (Studio controls for composer and question actions), #779 (evidence lineage), #790 (UI/accessibility bridge), #802 (restored constraints), #818 (evidence quality states), #819 (Analytics evidence trace), and the current Studio Controls contract. Do not redo merged work; implement only gaps proven in source.

Canonical owners:
- Main chat: `src/views/AIBrainCommandInterface.tsx`
- Studio primitives: `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/tokens.ts`, `src/styles/studio-control-system.css`
- Brain question prompts: `src/components/brain/BrainQuestionPrompt.tsx`
- Existing response modules: `src/components/brain/BrainAnswerModules.tsx`
- Evidence and context: `BrainClaimEvidence`, `BrainTurnEvidenceRibbon`, `BrainEvidenceDrawer`, `BrainContextRail`, `BrainRuntimePanel`
- Existing prompt and capability registries remain authoritative.

### 1. Add only missing Studio-owned chat primitives

Audit the primitive exports and actual page usage first. Add reusable primitives to Studio Controls only where a semantically equivalent primitive does not already exist:

- **Chat status badge:** compact, non-interactive state label with explicit status/tone mapping and accessible text.
- **Chat action button group:** aligned compact action row built from canonical Studio buttons/square icon buttons; consistent hit areas, labels, focus and disabled states.
- **Chat message shell primitives:** role-neutral message surface plus user/assistant variants, preserving natural-width reading measure and compact vertical rhythm. Avoid introducing a second generic button, badge, input, or color-token implementation.
- **Response section header / metadata row:** compact title, status, timestamp or provenance slots, wrapping safely on mobile.
- **Prompt-library item and prompt group:** keyboard-operable selection rows/cards using existing prompt registry data, with compact title/description and clear selected/disabled state.
- **Composer accessory row:** compact attach/context/capability/action slots using existing functionality, with overflow moved to a menu or disclosure rather than consuming permanent width.

Every new primitive must be exported from the Studio system, documented in the Confirmed Primitive Library, and covered by component/contract tests. Prefer composition of existing Studio primitives over a new primitive when possible.

### 2. Build compound chat systems

Create or consolidate Brain-specific compound components under the existing Brain component area, composed exclusively from Studio primitives:

1. **CreatorChatEntry** — user or assistant role, content, optional structured response, action row, and turn status. Preserve original prompt separately from normalized/generated response text. Long content must wrap without clipping.
2. **BrainResponseLayout** — default response shell with compact header, readable response body, optional typed answer modules, claim/evidence ribbon, source/provenance disclosure, warnings/missing-input state, and existing feedback/learning actions. Render only data actually returned by canonical owners; do not fabricate confidence, evidence counts, success, or outcome state.
3. **BrainPromptLibraryPanel** — compact searchable/grouped view of existing prompt cards and registry-backed capabilities. Selection inserts or dispatches through existing handlers; it must not create a second prompt catalog.
4. **BrainComposer** — fixed-bottom composer built on canonical `StudioTextArea`, with concise accessory/action rows, send/stop/disabled states, keyboard behavior, and responsive safe-area padding. Preserve current submit, dynamic-growth, context, and capability behavior.
5. **ChatConversationViewport** — single vertical scroll owner for all turns. Keep the newest turn visible on submit/streaming without stealing scroll when a user intentionally reads older turns. No nested scroll traps; long sessions must not grow the page indefinitely.

Prefer consolidating existing JSX into these named compounds instead of creating a parallel chat implementation.

### 3. Layout contract

- The composer is anchored to the bottom of the chat workspace, not the browser window in a way that covers navigation or page controls. Account for mobile safe areas and virtual keyboards.
- Conversation content scrolls independently; the composer remains available while reading and sending. Reserve its measured height so the final message is never obscured.
- Use compact, consistent gaps; align matching controls to the same heights and shared columns. Avoid oversized empty bands, decorative panels, unnecessary separators, redundant headings, and persistent toolbars that displace conversation content.
- User and assistant entries have distinct, consistent role cues but share typography, spacing, and action alignment. Response content should be naturally flowing, left-readable, and content-width-aware.
- Keep secondary functions discoverable without keeping every control permanently visible. Use labelled overflow/disclosure for lower-frequency actions.
- Desktop: readable message measure within a full-width conversation column; context/evidence surfaces may remain available in existing panels. Mobile: one-column chat, wrapping controls, no horizontal page overflow.
- Use Studio token values and registered exceptions. Do not add Brain-only hex colors, parallel design tokens, fake shadows, movement, or one-off CSS approximations of existing primitives.

### 4. Required behavior

- User posts preserve the exact submitted prompt and show only safe, intentional status metadata.
- Assistant responses support plain text, existing typed answer modules, evidence/provenance, context-used disclosure, warnings, and learning/feedback actions without inventing missing data.
- Evidence availability and evidence actually used remain distinct. Preserve integrity states such as verified, unavailable, mismatch, missing, stale, partial, or conflicting where the canonical data provides them.
- Prompt library selection, composer send, retry, feedback, save, context/capability actions, and disclosure toggles remain wired to existing handlers and registries.
- Empty, loading/streaming, error, partial answer, unavailable evidence, restored turn, and long-history states all have explicit, truthful UI.
- Keyboard: visible focus, logical tab order, Enter/Shift+Enter semantics clearly communicated, Escape closes transient panels where appropriate, and icon-only actions have accessible names. Announce new assistant turns/status changes without announcing the entire transcript repeatedly.
- Respect reduced motion. Do not auto-scroll a user away from history they are actively reading.

### 5. Test-first implementation and verification

Write failing focused tests before changing behavior. Add or extend tests for:
- Studio primitive exports, variants, token/geometry contract and accessible labels.
- User/assistant entry rendering, long text wrapping, structured response sections, missing/partial evidence states, and no fabricated status.
- Composer send/stop/disabled states, keyboard behavior, dynamic height, mobile safe area, and viewport reservation.
- Prompt library filtering/selection and integration with existing prompt handlers.
- Auto-scroll behavior: follow newest turn when already at bottom; preserve scroll position when reading older turns.
- Responsive layout at narrow mobile, mobile landscape, and desktop widths; keyboard-only navigation and reduced motion.
- Existing Brain evidence, prompt, runtime, context, and learning tests remain green.

Discover and use the repository's actual package scripts. Run focused tests, typecheck/build, relevant Brain and Studio contract suites, then browser verification with screenshots, computed geometry, keyboard/scroll checks, and console/network inspection. Report unrun checks explicitly; a merged PR or passing unit tests alone is not visual certification.

### 6. Definition of done

- All missing controls are real Studio primitives or documented compositions—not local replicas.
- Confirmed Primitive Library shows the actual exported primitives and compound examples.
- Main Brain page uses the shared compounds; no duplicate chat/page or parallel prompt/runtime/store.
- Fixed-bottom composer is compact, reachable, and never covers the last message or mobile controls.
- Conversation scroll remains smooth and stable through long history and new streamed turns.
- All message, response, prompt-library, feedback, evidence, and composer controls work and are keyboard accessible.
- Typecheck, build, focused tests, relevant regression tests, and browser visual checks are recorded with evidence.
- Registry/docs are updated; PR lists implemented files, test output, screenshots, remaining limitations, and explicitly distinguishes implemented from not certified.

## Delivery rule

Work in small, reviewable commits on a branch based on `master/consolidated-feature-integration`. Do not merge automatically. First deliver the primitive/compound foundation and chat layout, then complete prompt library and response details, then run the full verification pass. Any feature that already exists should be reused and tested rather than rebuilt.
