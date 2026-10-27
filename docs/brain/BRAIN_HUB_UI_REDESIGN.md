# AI Brain Hub — mobile/desktop UI redesign

This document accompanies the Brain Hub shell components in `src/components/brain/brain-hub-redesign/`.

## Intent

- Replace the dense Chat / My Brain / Review / Controls title-and-subtitle tabs with a compact split-rail accordion: Chat, Profile, Learning, Access.
- Move Prompts and Context actions to a utility row directly below primary navigation.
- Keep the bottom composer focused on message entry and sending.
- Use a general conversational placeholder: “Ask anything about your channel, content, or next upload…”
- Preserve existing Brain runtime, context resolver, prompt library, conversation history, and existing pane functionality.
- Keep mobile navigation compact and desktop navigation standard.
- Retain keyboard support, visible focus, and reduced-motion behavior.

## Component inventory

- `BrainHubPrimaryNav.tsx`: four-pane split-rail navigation.
- `BrainHubUtilityRow.tsx`: Prompts, Context, and optional Tools shortcuts.
- `BrainHubComposer.tsx`: message textarea and Send action only.
- `BrainHubShell.tsx`: title, navigation, utilities, status, active panel, and composer.
- `BrainHubShell.example.tsx`: isolated example wiring.
- `brain-hub-shell.css`: page layout and split-rail fallback styling.

## Integration notes

The example remains a harness; the production integration is in `src/views/AIBrainCommandInterface.tsx`. The active page now uses the split-rail navigation while preserving the existing Chat, My Brain/Profile, Review/Learning, and Controls/Access pane state and content. Prompts, Context, and optional Tools launch the existing production drawers. The composer keeps the existing Brain runtime and history, with the utility actions removed from its toolbar.

The shell stylesheet is imported after the Studio UI import. The existing Studio primitives remain the source of truth for the composer field and send action; the split-rail and utility row use the package's fallback layout styles.
