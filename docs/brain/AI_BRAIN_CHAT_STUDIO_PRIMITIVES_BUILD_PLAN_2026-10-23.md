# AI Brain Chat — Studio Primitive Build Plan

**Date:** 2026-10-23  
**Target base:** `master/consolidated-feature-integration`  
**Status:** Implementation plan with partial source updates recorded below; full acceptance and browser certification remain open.  
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


## Implementation checkpoint — 2026-10-23

The primitive/compound foundation is already present in the target branch; continue by closing behavior and evidence-contract gaps rather than creating duplicate controls.

- **Merged foundation:** PRs [#828](https://github.com/viewtube-dev/viewtube/pull/828), [#829](https://github.com/viewtube-dev/viewtube/pull/829), [#831](https://github.com/viewtube-dev/viewtube/pull/831), [#833](https://github.com/viewtube-dev/viewtube/pull/833), [#835](https://github.com/viewtube-dev/viewtube/pull/835), [#836](https://github.com/viewtube-dev/viewtube/pull/836), [#838](https://github.com/viewtube-dev/viewtube/pull/838), [#848](https://github.com/viewtube-dev/viewtube/pull/848), [#849](https://github.com/viewtube-dev/viewtube/pull/849), and [#851](https://github.com/viewtube-dev/viewtube/pull/851) cover shared chat compositions, viewport behavior, response layout and Studio-control alignment.
- **Evidence UI foundation:** [#779](https://github.com/viewtube-dev/viewtube/pull/779), [#802](https://github.com/viewtube-dev/viewtube/pull/802), [#818](https://github.com/viewtube-dev/viewtube/pull/818), and [#819](https://github.com/viewtube-dev/viewtube/pull/819) cover turn evidence lineage, restored selection constraints, truthful evidence quality and Analytics handoff.
- **Prompt-library follow-up (this branch):** the existing registry-backed prompt library now groups cards by their existing category into collapsed, inline Studio module headers. Opening a module reveals its related prompt rows in place; selecting a prompt shows its preview and the existing “Send to chat” / “Edit first” actions inside that same module. Search/filter and the existing `handleSend` / `setInput` handlers remain authoritative. This is source implementation only; interaction, keyboard, and responsive behavior still require runtime verification.
- **Current follow-up:** the active claim-to-evidence implementation branch introduces optional mappings for numeric claims. The runtime filters links against the actual prompt records and direct value matches; the UI exposes them only under verified prompt identity and explicitly warns that value matching does not prove trend or causal wording.
- **Next:** verify CI on the exact PR head; fix only evidenced Brain-specific failures without hiding existing Studio/source-governance debt; then continue output-card lineage, governed action feedback, and mobile/keyboard/screen-reader certification.
- **Not certified:** no claim is made here that typecheck, full-suite, live browser, mobile virtual-keyboard, screen-reader, or end-to-end lineage checks have passed. See the PR241 bridge in [the historical design reference](../migration/reference/PR241_VIEWTUBE_AI_BRAIN_BRAINSTORM_AND_FRONTEND_DESIGN_2026-09-12.md).


## Implementation checkpoint — 2026-10-23 (action-plan tracker)

- Connected response action recommendations to a collapsed **Track next actions** disclosure in the AI Brain answer card.
- Reused the existing workflow recommendation and tracking components; no parallel action-plan card system was introduced.
- Reworded the UI to distinguish browser-local tracking from real tool execution and canonical saved outputs.
- Approval-gated steps cannot be activated by a local button press. The tracker requires a governance callback that explicitly confirms approval; no such callback is currently connected from the AI Brain page, so those steps remain gated.
- Added tests for response-to-plan mapping, empty action lists, approval rejection/absence, approval success, and honest tracker labels.
- Next: replace local-only progress with canonical workflow receipts and operation status, then certify keyboard, screen-reader, mobile viewport and virtual-keyboard behavior.
- Test execution and accessibility certification remain pending CI/browser evidence; added tests are not evidence of passing tests.


## Implementation update — StudioInterModule integration (2026-10-23)

- [x] The AI Brain Prompt Library outer shell now uses the real `StudioInterModule` primitive, containing the existing search/filter controls and nested category → prompt modules.
- [x] User posts render inside a non-collapsible compact `StudioInterModule` entry.
- [x] Assistant responses, interrupted turns, and learning receipts render inside expanded-by-default compact `StudioInterModule` entries. Existing response modules, feedback, handoffs, evidence ribbons, context disclosure, retry actions, and learning receipt actions remain the behavior owners.
- [x] Module header color pairs reference the existing `TOOLBOX_PALETTE`; no new color-token system was introduced.
- [x] Extended `src/views/AIBrainRuntimeSurface.contract.test.ts` to require the intermodule integration in user entries, assistant entries, and the registry-backed prompt library.
- [ ] Run the focused Vitest contract, Studio Controls tests, typecheck, production build, and browser checks on this exact branch head. Static source checks were performed, but these commands were not run in this environment.
- [ ] Browser-certify module focus behavior, message expansion/collapse, nested prompt selection, mobile edge alignment, long-message wrapping, and composer/viewport geometry.

This update records source changes only. It does not claim that the focused test, typecheck, build, or browser certification passed.


## Follow-up implementation update — prompt modules, spectrum order, and mobile composer (2026-10-23)

- [x] Individual prompt rows inside category groups use the existing compact `StudioCollapsingSplitModule`, not `StudioInterModule`. Category groups remain grouped and collapsible; only one prompt detail stays open at a time.
- [x] Prompt categories follow their first appearance in the canonical prompt registry rather than alphabetical sorting; prompts within each category preserve registry order.
- [x] Category and prompt modules use the 12-stop `TOOLBOX_PALETTE` cycle with the matching sub-toolbox pair at offset +4.
- [x] `SEND TO CHAT` and `EDIT FIRST` now use compact `StudioSplitTwoLineButton` controls, with opposite color-pair orientation for visual distinction.
- [x] Mobile chat workspace is bounded to the viewport; the central conversation column uses a single vertical scroll owner with `touch-pan-y`, while the bottom composer remains in the flex layout.
- [x] Prompt Library / Channel Context launchers and the bottom send action use compact split two-line controls; the composer textarea grows programmatically and no longer exposes a manual resize handle.
- [x] Extended the runtime surface contract test to cover compact prompt modules, split two-line actions, spectrum pairing, registry ordering, and touch scrolling.
- [ ] Run Vitest, typecheck, production build, and browser verification. Source checks alone do not certify layout or interactions.
