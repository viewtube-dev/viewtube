# AI Brain Workspace — Phase 3: Composer Handoff

## Goal

Make the message composer communicate the context that will shape the next request, without turning the bottom of the chat into a dense toolbar. Keep message submission, context ownership, and prompt ownership in the existing page/controller and canonical Studio composer primitives.

## Changes

- When a creator has an active surface selection, the composer shows a compact, accessible context badge alongside the active prompt badge.
- Activating the context badge opens the existing context drawer, so the label is a real review action rather than decorative metadata.
- The text area advertises its Enter / Shift+Enter keyboard shortcuts to assistive technology.
- Composer text uses the Studio project's 17.5px adjustment for the 16px-derived entry setting, including mobile.
- Regression contracts cover the context handoff, shortcut metadata, and typography.

## Ownership and safety

The active selection is read from the existing `surfaceSelection` state. This phase does not create a second context store, change what the backend receives, or imply that context is attached if no selection exists. Prompt clearing remains owned by the existing active-prompt callback.

## Verification

CI is authoritative for TypeScript, focused tests, full tests, and build status. Source contracts do not replace browser verification at desktop and mobile widths. Existing repository-wide Studio catalog and typecheck failures should be triaged separately unless the updated CI identifies a failure introduced by this phase.

## Follow-up

1. Make answer cards less repetitive while preserving evidence, readiness, feedback, and learning receipt ownership.
2. Audit the conversation's first-run state and mobile scrolling with browser screenshots.
3. Complete desktop/mobile keyboard and accessibility checks.
