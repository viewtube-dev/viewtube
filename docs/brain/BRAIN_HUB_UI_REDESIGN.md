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

The example is a harness, not a replacement for production state. Wire `onOpenPrompts` and `onOpenContext` to the existing prompt library and context UI. Wire the panes to the existing Chat, My Brain/Profile, Review/Learning, and Controls/Access implementations. Import the stylesheet after the existing Studio stylesheet when adopting the shell.

This PR adds the supplied components as a separate implementation package. It does not replace the active Brain Hub view or claim that the production integration is complete.
