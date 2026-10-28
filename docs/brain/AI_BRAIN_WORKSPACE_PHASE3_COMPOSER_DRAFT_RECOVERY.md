# AI Brain Workspace — Phase 3: Composer Draft Recovery

## Goal

Make the bottom-of-chat composer feel safe and forgiving without adding another state owner or replacing the canonical Studio composer.

## Change

- When a message draft exists, expose a visible **Clear draft** action in the existing composer attachment row.
- Keep active prompt and active context indicators in that same row; the clear action only clears typed draft text.
- Continue to route text changes through the existing `onChange` handler and leave submission, prompt selection, context selection, and Brain state with the page controller.
- The action is a canonical `StudioButton`, has an explicit accessible name, and only appears when the draft contains non-whitespace text.

## Ownership and safety

This adds no new store, draft persistence mechanism, prompt registry, context registry, or runtime action. It does not send or discard a message silently: clearing is an explicit user action and is reversible only by typing again.

## Verification

The runtime surface contract suite checks the action marker, accessible name, and existing `onChange("")` handoff. CI still needs to validate this change against the repository's current full suite and source-governance checks. A successful production build or smoke test alone is not a substitute for those checks.

## Next

1. Verify composer behavior on narrow mobile viewports and with a long multiline draft.
2. Reconcile outstanding repository-wide typecheck and governance failures against the target branch before treating the workspace PR as merge-ready.
3. Continue refining context handoff and answer/evidence disclosure without introducing parallel state.
