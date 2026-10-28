# AI Brain Workspace — Phase 3: Conversation hierarchy and composer

## Intent

Make the conversation read as a conversation first, not as a collection of internal system panels. The user-facing answer label is consistent whether a turn completed or was interrupted. Preserve the underlying turn, retry, evidence, context, feedback, and learning ownership.

## Changes in this slice

- Align interrupted assistant turns with the same concise **ANSWER** heading used for completed turns; interruption and retry details remain in the message body.
- Remove the extra outer `StudioInterModule` accordion from completed assistant answers. The existing `BrainResponseLayout` is now the single answer shell, so the creator sees one headline and one coherent response instead of an accordion wrapped around another response card.
- Keep learning receipts and interrupted/retry states in their explicit Studio modules; they are exceptional states with distinct actions.
- Add a regression contract that prevents the completed answer from regaining its redundant outer accordion.
- Keep the existing canonical composer as the only send surface. Enter sends, Shift+Enter inserts a newline, and prompt/capability/context launchers remain available without inventing a parallel action store.
- Editing a saved prompt labels the active prompt in the composer; the label clears when the draft is cleared or sent.
- An active surface selection appears as an accessible context badge that opens the existing context drawer. No context badge appears when there is no active selection.
- Expose Enter / Shift+Enter shortcuts to assistive technology and use the 17.5px composer text-size adjustment, including mobile.

## Guardrails

- No prompt or capability auto-executes from selection.
- Existing evidence manifests and evidence records remain the provenance source.
- Retry and refresh-evidence choices remain explicit.
- Do not treat source-text contract checks as browser verification.

## Verification status

This is a focused source change, not a claim that the repository is green. The previous CI run had passing production-build, local-smoke, and Brain quality-loop jobs, but failed the full suite, typecheck, focused contracts, and catalog governance. Logs show broad Studio primitive/export/type mismatches and stale catalog assertions in addition to Brain render-contract failures. Fresh CI runs are queued for the answer-shell change. Keep these failures visible and fix feature-specific regressions without weakening checks.
