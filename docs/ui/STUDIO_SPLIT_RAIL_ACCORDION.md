# Studio Split Rail Accordion

Canonical Studio Controls primitive for a three-way split-left control with synchronized expansion.

- Source: `src/studio-ui/primitives/StudioSplitRailAccordion.tsx`
- Styles: `src/studio-ui/primitives/StudioSplitRailAccordion.css`
- Reuses the Studio size and color-pair tokens; no independent design tokens or shadow layer.
- Three square 1:1 icon rails stay visible. Only the content pane associated with the active rail is expanded.
- Rightmost item is active by default. Hover/focus previews the matching pane; clicking selects it. Leaving the group restores the selected pane.
- Supports standard 44px and compact 28px sizes, controlled/uncontrolled selection, disabled items, custom content, and activation callbacks.
- One shared outer stroke; internal dividers are single strokes. No shell shadows, movement, or transitions.
