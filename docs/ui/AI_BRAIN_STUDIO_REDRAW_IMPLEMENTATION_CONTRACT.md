# AI Brain Studio redesign — implementation contract

**Target:** `master/consolidated-feature-integration`  
**Working branch:** `ai-brain-studio-redesign`  
**Scope:** AI Brain workspace, chat controls, capability browser, Brain controls, and the partially completed Prompt Library.

## Non-negotiable design-system rules

1. Use existing approved exports from `src/studio-ui` and existing Brain components. Do not recreate controls with bespoke markup or CSS.
2. Canonical tokens and production primitives own colors, typography, borders, split geometry, focus, and interaction states. Page-level styles own only placement and responsive composition.
3. Preserve the current behavior and data flow: conversation history, evidence/context, permissions, capability prerequisites, prompt selection/edit/send, and the pinned composer.
4. Desktop and mobile must both be first-class. Avoid horizontal overflow, preserve keyboard access, and keep the composer usable while the mobile visual viewport changes.
5. Repair the existing Prompt Library rather than creating a parallel implementation.

## Work sequence

1. Establish a source inventory and baseline tests for the existing page and prompt/capability flows.
2. Reconcile hard-coded visual treatments in Brain components with approved Studio tokens and primitive contracts.
3. Refactor the workspace shell without changing route IDs or underlying Brain behavior.
4. Finish Prompt Library category, expansion, send-to-chat, and edit-first states using approved controls.
5. Verify capability status against real controls/evidence prerequisites and keep unavailable actions disabled with a clear reason.
6. Run repository typecheck, focused tests, build, and browser checks at desktop and mobile viewports.

## Acceptance criteria

- All controls use real approved Studio exports.
- No page-local color, border, radius, or focus override is used to imitate a Studio primitive.
- Prompt send/edit flows and capability prerequisites remain functional.
- Chat conversation region is the scroll owner; composer remains accessible during keyboard/viewport resize.
- Desktop and mobile are checked for keyboard operation, focus visibility, clipping, touch targets, and horizontal overflow.
- Any unsupported primitive variant is reported rather than simulated locally.

## Audit status

Initial source inspection confirmed that the AI Brain already imports Studio primitives, but `BrainCapabilityBrowser.tsx` and the main page include page-local visual styling. This is a source-level finding only; browser verification and the full baseline test run remain outstanding.
