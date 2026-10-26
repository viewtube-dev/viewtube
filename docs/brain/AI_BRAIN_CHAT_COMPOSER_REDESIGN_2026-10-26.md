# AI Brain Chat Composer Redesign

**Date:** 2026-10-26  
**Target:** `master/consolidated-feature-integration`  
**Implementation branch:** `ai-brain-composer-redesign-2026-10-26`  
**Status:** Initial implementation in progress; automated and rendered verification required before merge.

## Goal

Replace the crowded bottom-of-chat interaction with a natural, accessible writing surface and a small set of recognizable entry points. Keep the text field primary, make tools discoverable without a dense toolbar, and preserve all existing conversation/runtime behavior.

## Source-of-truth boundaries

- `src/components/brain/BrainComposerDock.tsx` owns the Brain-specific composer composition and forwards actions to the existing page owners.
- `src/studio-ui/primitives/StudioChatComposerDock.tsx` owns reusable dock structure and supports both legacy inline actions and a bottom action row.
- `src/styles/studio-chat-composer-dock.css` owns dock layout only; individual control visuals remain owned by Studio Controls.
- `BrainCapabilityBrowser`, the existing Prompt Library, context rail, journal dialog, and canonical Brain runtime remain the owners of their respective features.
- Do not introduce a second message submission path, capability registry, prompt store, evidence store, or conversation store.

## Initial design decisions

1. Use a concise, open-ended placeholder: “What would you like to work on?”
2. Keep the message editor spacious, multiline, and bounded in height; use an internal scroll after the maximum height.
3. Place secondary entry points in a compact bottom row: **Prompts**, **Tools**, **Context**, and the existing **AI Journal** action.
4. Keep the send action visually distinct and disable it for empty drafts or while a request is in flight.
5. Preserve Enter-to-send, Shift+Enter newline, and IME composition safety.
6. Show a low-emphasis keyboard hint when idle and the existing truthful Brain status when busy.
7. Reuse approved Studio controls and existing color tokens/pairs; do not create page-local button lookalikes.
8. Keep the default dock layout backward-compatible for any other consumers by making the new bottom-action layout opt-in.

## Acceptance criteria

- Composer text entry precedes tool actions in the visual and DOM order.
- Tool buttons have concise visible labels and descriptive accessible names.
- Empty and whitespace-only drafts cannot be submitted from the composer.
- Sending state disables repeat sends and truthfully indicates work in progress.
- The current draft, submission handler, and existing conversation/runtime contracts remain unchanged.
- Narrow mobile layouts keep the editor and send action reachable, respect safe-area insets, and do not force horizontal page overflow.
- Existing shared dock behavior is preserved for consumers that do not opt into the new layout.
- Focused tests, typecheck, production build, and a rendered desktop/mobile accessibility review pass before merge.

## Verification record

- Added focused static-render regression tests for field hierarchy, capability entry points, keyboard guidance, and send disabled/busy states.
- Local test execution and rendered browser/device verification are pending; source presence alone is not treated as proof of behavior.
