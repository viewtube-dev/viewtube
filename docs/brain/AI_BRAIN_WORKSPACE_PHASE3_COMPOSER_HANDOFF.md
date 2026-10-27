# AI Brain Workspace — Phase 3: Conversation and Composer Handoff

## Goal

Make the chat feel like one continuous conversation and make every "edit first" route explain what was placed into the composer, without introducing new runtime state or a second prompt/context store.

## Changes

- Editing a capability now marks the draft as **Capability draft** in the existing composer attachment row.
- Editing a context-rail suggestion marks the draft as **Suggested action**.
- Opening a governed context correction review marks the draft as **Context correction review**.
- Drawer-originated handoffs use scroll-safe focus so the composer is focused without unexpectedly moving the page.
- Added a runtime surface contract test for these handoff labels and focus behavior.

## Ownership and safety

The existing `AIBrainCommandInterface` remains the owner of the draft and active-prompt label. `BrainComposerDock` remains the owner of rendering the existing attachment chips. The changes do not send automatically, execute a capability, mutate context, or add another state store. The creator still explicitly chooses Send.

## Verification

Source contract coverage was added. Repository CI must determine the result of the focused tests, typecheck, full suite, and governance checks. Earlier Phase 2 CI showed unrelated existing failures in Studio catalog/governance and missing/invalid Studio primitive exports, alongside a Brain prompt-category type error on an older commit; these are not represented as passing here. Run rendered desktop/mobile QA before calling the workspace fully verified.

## Next

1. Verify and resolve the current PR's feature-specific CI failures separately from repository baseline failures.
2. Inspect response-card hierarchy for repeated metadata and preserve evidence, readiness, feedback, and learning-receipt affordances.
3. Run interactive desktop/mobile QA against the deployed Studio workspace.
