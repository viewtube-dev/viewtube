# Studio Controls ownership convergence

**Status:** DISCOVERY / VERIFICATION REQUIRED. **Owner:** `src/studio-ui/tokens.ts` → emitter → generated CSS → primitive-owned imports → confirmed catalog specimens.

## Existing code and PRs
`src/studio-ui/tokens.ts`; `scripts/emit-studio-control-vars.mjs`; `src/styles/studio-control-vars.generated.css`; `studio-control-core.css`; `studio-control-fields.css`; `studio-control-system.css`; `StudioHubConfirmedPrimitiveCatalog.tsx`; merged PR #1203; divergent PRs #935/#988/#992.

## Guardrails
No second token source, global override layer or wholesale stale donor merge. Preserve semantic tier, field, split, primitive and catalog contracts. Prefer removing duplicate ownership over another override. Donor PRs #935/#988/#992 overlap and are deeply divergent; selective harvest only.

- [Audit checklist](audit-checklist.md)
- [Test and runtime plan](test-plan.md)
- [Agent brief](agent-brief.md)
- Parent [inventory](../../inventory.md), [task crosswalk](../../task-crosswalk.md), [verification](../../verification.md).
