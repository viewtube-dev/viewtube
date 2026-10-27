# AI Brain Workspace — Phase 3: Conversation hierarchy and composer

## Intent

Make the conversation read as a conversation first, not as a collection of internal system panels. The user-facing answer label is consistent whether a turn completed or was interrupted. Preserve the underlying turn, retry, evidence, context, feedback, and learning ownership.

## Changes in this slice

- Align interrupted assistant turns with the same concise **ANSWER** heading used for completed turns; interruption and retry details remain in the message body.
- Add a regression contract for the shared answer-first hierarchy.
- Keep the existing canonical composer as the only send surface. Enter sends, Shift+Enter inserts a newline, active prompts remain explicitly clearable, and prompt/capability/context launchers remain available without inventing a parallel action store.

## Guardrails

- No prompt or capability auto-executes from selection.
- Existing evidence manifests and evidence records remain the provenance source.
- Retry and refresh-evidence choices remain explicit.
- Do not treat source-text contract checks as browser verification.

## Verification status

This is a focused source change, not a claim that the repository is green. The current Phase 2 pull request's CI reports repository-wide type/test/governance failures, including Studio primitive export/type errors and evidence-rendering assertions. Those failures must be triaged separately; this phase should not conceal them by weakening checks.
