# AI Brain Workspace — Phase 3: Conversation and Composer Handoff

## Goal

Keep the chat continuous and make each edit-first route explain what was placed into the composer, without introducing a second prompt/context store.

## Handoff behavior

- Editing a capability labels the draft **Capability draft** in the existing composer attachment row.
- Editing a context-rail suggestion labels the draft **Suggested action** on desktop and mobile.
- Opening a governed context correction review labels the resulting verification prompt **Context correction review**.
- Drawer/context handoffs focus the existing composer with scroll-safe focus where supported.
- Handoff labels describe draft provenance only. They do not send a message, execute a capability, or mutate channel context; the creator still chooses Send.

## Ownership

`AIBrainCommandInterface` remains the owner of draft text and the active prompt label. `BrainComposerDock` remains responsible for rendering the existing attachment chips. This phase adds no runtime store, prompt catalog, capability registry, or parallel context model.

## Verification status

A source-contract test covers the three handoff labels and scroll-safe focus behavior. This commit was authored through GitHub's file API; local Vitest, typecheck, full-suite, and rendered desktop/mobile checks were not run in this session. Review the canonical PR's CI before merge.

## Remaining review

1. Separate feature-specific CI failures from baseline Studio governance/typecheck failures.
2. Inspect the answer-first response-card hierarchy for repeated metadata while preserving evidence, readiness, feedback, and learning receipts.
3. Run interactive desktop/mobile QA against the integrated workspace.
