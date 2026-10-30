# P1 Canonical System Integration
**Production Date:** 2026-10-29 | **Last Edited:** 2026-10-29 | **Class:** PROGRAM | **Status:** ACTIVE — PLANNING / DISCOVERY
**Concern:** six-workstream canonical convergence | **Owner:** Integrated Application Program
**Registry ID:** DOC-PROGRAM-P1-CANONICAL-INTEGRATION
**Related Authorities:** docs/governance/DOCUMENTATION.md; docs/governance/CONVERGENCE.md; docs/governance/TASK_AUTHORITY.md; docs/governance/VERIFICATION.md; docs/architecture/PRODUCT_COMPLETION_CONSTITUTION.md; docs/architecture/PRODUCT_ARCHITECTURE.md; docs/programs/INTEGRATED_APPLICATION.md; docs/domains/BRAIN.md

## Mission
Coordinate six P1 workstreams around existing production owners. This folder is a planning, discovery, audit and handoff workspace—not a task ledger, new architecture authority, or implementation status database.

## Six workstreams
1. **Brain continuity:** profile, evidence, interaction and outcome continuity. [Plan](workstreams/brain-continuity/plan.md)
2. **Gemini governance:** provider registry, key validation and generation-operation governance. [Plan](workstreams/gemini-governance/plan.md)
3. **Unified diagnostics:** shared correlation identity and actionable evidence across six systems. [Plan](workstreams/unified-diagnostics/plan.md)
4. **Priority-25 runtime:** resolve exact capability/task identity, then verify real production reachability. [Plan](workstreams/priority-25-runtime/plan.md)
5. **Public resolver:** production wiring, caching, provenance and public-only boundaries. [Plan](workstreams/public-resolver/plan.md)
6. **Studio Controls:** token, CSS, primitive, catalog and export ownership convergence. [Plan](workstreams/studio-controls/plan.md)

## Program invariants
- Converge using EXTEND → COMBINE → MERGE → GENERALIZE → ADAPT → CREATE_REVIEW.
- One canonical owner per fact/state class; adapters do not become competing truth.
- Preserve stable channel, project, ContentBuild, asset, operation, event, receipt and provenance identity.
- Runtime reachability is mandatory; file/route/registry existence is insufficient.
- No secrets in logs, diagnostics, fixtures, screenshots or receipts.
- No duplicate runtime, gateway, provider/prompt registry, profile/evidence/outcome store, event ledger, diagnostics DB, public resolver, token system, catalog or task ledger.
- Exact task status remains under Task Authority; conversation handoffs use existing handoff.md + worklog.json + review.md.
- Preserve donor work; reconcile active branches/PRs before edits; no wholesale stale-branch merges.
- Behavior changes follow TDD; visible UI changes require runtime and visual verification.

## Dependency order
0. Reconcile current branch head, Task Index, capability homes, plan families, PRs/branches and current callers.
1. Resolve owner and identity maps for all six.
2. Define diagnostics correlation semantics after producer inventory.
3. Implement bounded vertical slices with focused PRs.
4. Cross-system identity, retry, public-only and Studio export certification.
5. Update owning authorities, registry and Task Authority proposals with evidence.

## Existing Work Checked
Read Documentation Governance, Convergence Governance, Task Authority, Verification, Product Completion Constitution, Product Architecture, Integrated Application Program, Brain Domain Authority, System Convergence classification, capability registry/homes, plan families and code ownership. Code and script leads are in inventory.md. Known PR leads #1109, #1168, #1169, #1174, #935, #988 and #992 must be rechecked live before harvesting.

## Branch policy
Planning branch: docs/p1-canonical-system-integration-program. Base: master/consolidated-feature-integration. Create focused implementation branches only after live branch/PR reconciliation. Do not bundle unrelated workstreams into one code PR.

## Exit criteria
Every consequential path has one verified owner, typed connections, preserved identity/provenance, focused regression tests, production-caller runtime proof, actionable secret-safe diagnostics and a no-duplicate-owner review. No workstream is DONE based only on files, routes, registry entries, tests or build success.

**Current state:** all six plans are PLANNED / DISCOVERY REQUIRED. This package does not claim implementation or runtime completion.


## Latest reconciliation
See [Phase 0 reconciliation audit](audits/phase-0-reconciliation-2026-10-30.md) for live PR states, corrected code owners, landed Gemini plans/scanner, Studio source-of-truth, public cache behavior and Priority-25 identity findings. Audited target SHA: `0135fa33bf5cd59503c9feecce4977072ef60fec`.

## Cross-system identity and task routing

- [Cross-system identity and provenance map](identity-map.md) — current typed IDs, owner boundaries and diagnostics contract gaps.
- [Existing task crosswalk](task-crosswalk.md) — VT task IDs, continuation relationships and unresolved identity gates.

## Workstream execution packets
Each of the six workstream folders has its own README, audit checklist, test/runtime plan and agent brief. These are discovery and execution aids; they do not create task identities or claim test/runtime completion.

- [Skills and plugin routing index](skills-and-plugins.md)
- [Brain continuity packet](workstreams/brain-continuity/README.md)
- [Gemini governance packet](workstreams/gemini-governance/README.md)
- [Unified diagnostics packet](workstreams/unified-diagnostics/README.md)
- [Priority-25 runtime packet](workstreams/priority-25-runtime/README.md)
- [Public resolver packet](workstreams/public-resolver/README.md)
- [Studio Controls packet](workstreams/studio-controls/README.md)
