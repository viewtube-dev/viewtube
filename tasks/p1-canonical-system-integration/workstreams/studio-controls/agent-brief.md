# Agent brief — Studio Controls convergence

## Mission
Converge tokens, CSS ownership, primitive imports, confirmed catalog and exports using existing Studio source-of-truth. No new token or global override system.

## Canonical map
`src/studio-ui/tokens.ts` → `scripts/emit-studio-control-vars.mjs` → `src/styles/studio-control-vars.generated.css`; shared defaults in `studio-control-system.css`; primitives own their imports; confirmed catalog owns representative specimens.

## Required workflow
1. Refresh target SHA and inspect donor PR file diffs.
2. Complete cascade/import/export audit before edits.
3. Write failing tests for behavior changes; follow RED → GREEN → REFACTOR.
4. Prefer deleting duplicate declarations to adding overrides.
5. Run Studio tests and emitter parity; verify actual desktop/mobile screens.
6. Harvest donor changes file-by-file only; preserve unrelated work.
7. Submit focused PR with visual/test receipts and rollback notes.

## Required skills
TDD; Product Design audit; UI consistency/accessibility; HTML accessibility; code review; verification-before-completion. Product Design design-QA is only appropriate after a rendered implementation and source visual target exist.

## Plugins/tools
GitHub; Browser Use; Product Design audit; AI Delivery Evidence Checker. Docs AI may assist drafting only; it is not a design-system authority.
