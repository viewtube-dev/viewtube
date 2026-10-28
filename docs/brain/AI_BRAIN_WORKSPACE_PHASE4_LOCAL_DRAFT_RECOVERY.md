# AI Brain Workspace — Phase 4: Local Composer Draft Recovery

## Goal

Recover unsent chat text and its prompt handoff context after a refresh or navigation, without introducing another state owner or sending drafts to a server.

## Behavior

- Store the unsent draft in browser localStorage, scoped to the active channel.
- Restore text, prompt label, and edited-prompt provenance together.
- A `?draft=` handoff takes precedence over the saved draft.
- Sending or clearing the draft removes the local record.
- Malformed data, unavailable storage, and quota/privacy errors are non-fatal and must never block chat.
- Drafts are limited to 50,000 characters and only persisted when a channel scope is available.

## Scope and privacy

This is browser-local recovery: it works on mobile and desktop browsers, but it does not synchronize drafts between separate devices or browsers. Draft text remains in that browser's local storage until sent, cleared, or browser data is removed. Do not use this mechanism for secrets or credentials.

## Validation

The focused store tests cover channel isolation, round-trip recovery, clearing, malformed data, missing scope, and oversized drafts. Run:

```sh
npx vitest run src/services/brain/BrainComposerDraftStore.test.ts src/views/AIBrainRuntimeSurface.contract.test.ts
npm run typecheck
npm run build
```

These commands still need to pass in CI or an executable checkout before merge.
