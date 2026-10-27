# AI Brain Workspace — Phase 2: Prompt and Capability Discovery

## Goal

Continue the merged Studio Workspace foundation by removing avoidable blank states in the two most important discovery surfaces. The first visit to Prompt Library should expose a category without requiring an extra click; the capability browser should immediately explain the first capability's requirements and keep its detail panel synchronized with search.

## Changes

- Prompt Library opens the first category represented by the current prompt catalog on entry.
- Choosing a specific category filter opens that category so the filtered results are immediately visible. The `All categories` choice preserves the user's current accordion state.
- Capability Browser selects the first canonical registry entry on entry, so the detail pane shows the capability's real prerequisites and evidence sections rather than an empty prompt to choose something.
- Capability search selects the first matching capability, or clears the selection when there are no matches. This keeps the detail pane aligned with the result set.
- Both surfaces continue to use the existing Studio components, prompt catalog, capability registry, availability checks, and Brain request handlers.

## Ownership and safety

No new capability, prompt, evidence, or runtime registry is introduced. Selecting a capability only reveals its existing availability and evidence requirements; it does not execute it. Launching remains behind the existing explicit Ask Brain action and the existing permission/availability guards.

## Verification

The focused runtime surface contract suite now guards these defaults. The pull request's CI must run the real Vitest suite; repository-wide baseline failures recorded after the workspace foundation remain separate from this feature-specific change. Do not treat source-level contract assertions as a substitute for interactive browser verification.

## Next phases

1. Review conversation hierarchy and reduce repeated assistant chrome while preserving answer, evidence, readiness, feedback, and learning receipt ownership.
2. Improve composer capability/prompt/context handoff feedback and mobile ergonomics without replacing the canonical composer.
3. Refine context/saved-work surfaces, then run rendered desktop/mobile visual QA and regression checks.