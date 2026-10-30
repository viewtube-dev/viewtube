---
name: viewtube-p1-canonical-integration
description: Coordinate and implement the six P1 canonical system integration workstreams in ViewTube: Brain continuity, Gemini provider/key/generation governance, unified diagnostics, Priority-25 runtime verification, public resolver production integration and Studio Controls ownership convergence. Use when auditing, planning, implementing or verifying any of these cross-system paths.
---

# ViewTube P1 Canonical Integration

## Governing authorities
Read AGENTS.md; docs/governance/DOCUMENTATION.md; docs/governance/CONVERGENCE.md; docs/governance/TASK_AUTHORITY.md; docs/governance/VERIFICATION.md; docs/architecture/PRODUCT_COMPLETION_CONSTITUTION.md; docs/architecture/PRODUCT_ARCHITECTURE.md; docs/programs/INTEGRATED_APPLICATION.md; docs/domains/BRAIN.md when Brain/provider work is involved; and the relevant Toolbox/Studio authority for controls.

Program workspace: tasks/p1-canonical-system-integration/.

## Required procedure
1. Read the program index, execution plan, inventory and the selected workstream plan.
2. Resolve CAP/task identity and capability home; for Priority-25, stop until exact identity is proven.
3. Inspect current target code, callers, tests, route/permissions, branch/PR donors and handoffs.
4. Classify findings CURRENT_MAIN / BRANCH_ONLY / PR_ONLY / PLANNED / SUPERSEDED / UNKNOWN.
5. Record one canonical owner for each fact/state class. Prefer extending existing typed interfaces and stores.
6. Define the smallest vertical slice and observable acceptance criteria.
7. For behavior changes, write a failing focused test before implementation; use repository-native commands.
8. Implement on a short-lived branch based on latest target SHA; keep PR scope focused.
9. Verify integration and production caller at runtime. Add screenshot/visual proof for visible UI.
10. Audit stable identity, provenance, retries/idempotency, security and actionable diagnostics.
11. Update the owning authority and registry when durable contracts change; submit exact task changes through Task Authority.
12. Reconcile donor work and archive only after no-loss and zero-caller proof.

## Workstream boundaries
- Brain: BrainRuntime orchestrates; Creator Context, analytics/evidence, Projects/ContentBuild, Asset Engine and outcomes retain their own truth.
- Gemini: BrainModelGateway/provider layer owns model execution; key validation is a separate credential-readiness boundary; Creator Operations owns generation operation lifecycle.
- Diagnostics: extend existing diagnostic services and domain event/receipt owners; no new universal event database.
- Priority-25: runtime caller verification, not route/file restoration; resolve exact identity first.
- Public resolver: public-only source policy, cache/provenance and real Brain caller; no OAuth/private Analytics in public mode.
- Studio: one semantic token source, emitter, generated output, CSS ownership chain, production primitives and catalog/export mapping.

## Non-negotiable
No duplicate runtime, gateway, provider/prompt registry, profile/evidence/outcome store, diagnostics DB, event ledger, task ledger, public resolver, token system or catalog. No secrets in evidence. No invented IDs or runtime claims. Merged is not DONE.
