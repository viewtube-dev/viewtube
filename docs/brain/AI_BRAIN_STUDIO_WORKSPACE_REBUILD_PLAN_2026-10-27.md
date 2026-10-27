# AI Brain Studio Workspace Rebuild — 2026-10-27

## Decision

Adopt **Studio Workspace** as the visual and interaction direction for the full AI Brain page. The conversation remains the primary work surface; navigation and creator context are supporting rails on wide screens and collapse away on smaller screens. The composer remains attached to the conversation and keeps prompt, capability, context, and journal actions discoverable without making the message field compete with a dashboard of controls.

This is a composition redesign, not a replacement of Brain's domain runtime.

## Non-negotiable ownership boundaries

- AIBrainCommandInterface remains the page/controller and owner of conversation actions, route state, composer input, and drawer visibility.
- BrainRuntimePanel remains the owner of runtime, request, receipt, trace, and provenance status. Runtime status is not re-created in the page.
- BrainComposerDock and StudioChatComposerDock remain the composer and Studio primitive owners. Page CSS may arrange them, but must not replace their semantics or interaction contract.
- BrainContextRail remains the owner of the contextual creator workspace, prompt policy, profile coverage, and quick actions.
- BrainCapabilityBrowser and the existing Prompt Library remain backed by the current capability registry and prompt catalog.
- Evidence displayed for an answer must continue to come from that turn's canonical evidence records. Runtime receipts and lineage must not be described as proof of an output unless the existing receipt/build verification confirms it.
- Reuse the existing Studio color-pair variables (--pair-a, --pair-b) and control tokens. Do not add shadow/lift/hover-motion effects or create replacement controls in page CSS.

## Layout contract

### Wide desktop (1536px and above)

- Three-rail layout: compact workspace navigation, bounded conversation, and a scrollable creator-context rail.
- The conversation receives the largest share of horizontal space.
- Context rail content has its own scroll boundary so it cannot grow the whole page or steal the conversation scroll owner.
- Runtime summary remains at the top and retains its native disclosure for deeper lineage details.

### Desktop/tablet (1280–1535px)

- Two-column layout: compact navigation and conversation.
- The context rail is hidden from the main grid but remains available from the composer context action.
- Do not leave an empty third grid column.

### Mobile (below 1280px)

- Single-column conversation layout; desktop navigation and right rail are removed from the grid.
- Prompt/capability and context sheets remain the discoverable route to supporting workspaces.
- Preserve the current visual viewport/keyboard height handling and conversation follow behavior.
- Keep the composer inside the bounded chat shell and respect bottom safe-area insets.

## Visual and interaction contract

- Use white work surfaces on a quiet neutral canvas, black Studio borders, and the established primary/secondary pair tokens for interactive fields.
- Keep answer-first rendering, response actions, evidence details, readiness disclosures, and learning receipts in their current canonical owners.
- Default text entry has a black outer border and a primary-colored inset stroke; focused text and glyph stroke become black, the primary inset remains, the fill drops to 15%, and the secondary focus outline uses the Studio standard width ratio with zero offset.
- No ellipsis should be introduced by this page layout. Avoid decorative shadows, lifted hover states, and movement-based feedback.
- Keyboard composition, disabled/sending states, focus visibility, labels, safe areas, and reduced motion are part of the contract.

## Implementation sequence

1. **Workspace foundation** — apply an explicit page-scoped composition contract, fix the empty desktop third column by populating the existing context rail, and establish one bounded conversation column with responsive rails.
2. **Composer and entry states** — align the textarea's default/focus appearance with the canonical Studio field contract while preserving the current submission handler, IME protection, prompt state, and composer actions.
3. **Conversation hierarchy** — audit the current message, answer-first, response action, evidence, readiness, and learning-receipt compositions. Remove redundant chrome without duplicating response/evidence logic.
4. **Prompt Library and capabilities** — keep the existing catalog and capability registry; refine disclosure, search/filter hierarchy, and send-to-chat versus edit-first flows using approved Studio controls.
5. **Context and saved work** — refine the context rail and drawers, preserving project/selection actions, correction governance, runtime provenance, receipt-backed output verification, and learning review.
6. **Regression and release** — run focused tests, typecheck, lint, production build, accessibility checks, and rendered desktop/mobile verification. Reconcile against the target branch and report results honestly before merge.

## Regression coverage added in this phase

- AIBrainStudioWorkspace.contract.test.ts guards the page region hooks, responsive rail behavior (including the intermediate two-column breakpoint), bounded conversation/composer contract, safe-area handling, and reduced-motion support.
- BrainComposerDock.contract.test.ts guards the default and focused Studio textarea field states.
- AIBrainStudioChrome.contract.test.ts guards the answer-first response hierarchy against repeating the Copilot brand in both the outer module and response header.
- AIBrainCommandInterface.test.tsx updates the existing rendered-page assertion for the new AI Brain title.

## Verification status

The GitHub source was inspected on master/consolidated-feature-integration before changes. This work is on codex/ai-brain-studio-workspace-rebuild. Repository commands and rendered browser verification have not yet been run in a local checkout; do not treat source-contract preflight checks as a substitute for Vitest, typecheck, build, accessibility, or visual verification.