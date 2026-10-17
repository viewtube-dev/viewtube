# Individual implementation prompt — Opportunity Radar + Tactics Engine workflow

**Repository:** `viewtube-dev/viewtube`  
**Target branch:** `master/consolidated-feature-integration`  
**Scope:** domain/runtime integration, contracts, persistence, and tests; no unrelated UI/CSS redesign.

## Mission

Implement Opportunity Radar as a distinct Studio Hub tool that discovers and ranks evidence-backed opportunities, and connect it to the distinct Tactics Engine tool that turns validated opportunities into concrete, reviewable interventions. Treat them as a coordinated workflow with a clear handoff—not as one merged tool.

**Hard boundary: Studio Hub tools may use, call, or expose capabilities and functions from existing dashboard widgets, but they must not be combined with, absorbed into, or substituted for those widgets.** Keep the Opportunity Radar widget as its own widget and Opportunity Radar as its own Studio Hub tool. Reuse underlying services/contracts where appropriate; do not merge their identities, destinations, lifecycle, or UI surfaces.

## Outcome and responsibility split

- **Opportunity Radar owns discovery:** identify candidate opportunities from governed evidence, rank and explain them, preserve provenance/uncertainty, and manage the opportunity lifecycle through validation and acceptance.
- **Tactics Engine owns action design:** for an accepted/validated opportunity, propose tactics, explain the evidence-to-action rationale, define prerequisites and expected outcomes, identify risks/trade-offs, and produce an actionable plan for creator review.
- **The handoff connects them:** Radar supplies a typed opportunity packet; Tactics Engine returns a typed tactic plan linked to the source opportunity. Neither tool takes over the other's responsibilities.
- **Projects/ContentBuild own accepted work identity and execution lifecycle.** Tactics may create or update a project only through existing canonical contracts and creator approval boundaries.
- **Experiment Lab and Analytics Canon own experiment measurement and metric semantics.** Tactics may propose measurable hypotheses and pass them to those owners; it must not create a competing experiment or analytics system.
- **Brain owns governed evidence, learning, and orchestration.** Both tools consume its contracts; neither forks Brain memory or creates a parallel evidence store.

## Inspect and reuse

Start with these known areas, then search the live branch for actual owners, callers, consumers, tests, persistence, registries, routes, and tool/widget boundaries:

- `src/views/dashboard/widgets/OpportunityRadarWidget.tsx` — reference existing widget behavior and reusable capabilities; do not merge this widget into the Studio Hub tool.
- `src/services/brain/OpportunityIntelligence.ts`
- `src/services/brain/OpportunityEvidenceAdapter.ts`
- `src/services/analytics-canon/contracts.ts`
- `src/services/brain/BrainEvidenceContract.ts`
- Tactics Engine implementation, plans, contracts, and consumers, located by repository search rather than assumed path.
- Existing Projects/ContentBuild, Experiment Lab, analytics, Brain handoff, operation/idempotency, and creator-approval contracts.
- `superToolRegistry` and `viewTubeToolChains`: map their different roles explicitly; do not replace one with the other.

## Opportunity Radar requirements

1. Preserve source snapshot/window, dataset status, evidence IDs, freshness, confidence scale, metric definitions, and null/missing baselines.
2. Keep observations, interpretations, predictions, and validated findings distinguishable. A high score alone is not proof of demand, trend, or causality.
3. Distinguish `performance_candidate` from `catalog_gap`. Only emit a catalog-gap finding when actual taxonomy/catalog coverage or demand evidence supports it.
4. Rank candidates transparently using existing canonical scoring where valid; expose score components, limitations, and missing evidence instead of inventing precision.
5. Preserve compatible legacy records and lifecycle semantics. Trace candidate → reviewed → validated/rejected → accepted/handed-off states using the canonical owner.
6. Use reusable logic from the widget only through an appropriate service/API/contract. Keep the widget independently usable and independently registered/rendered.

## Tactics Engine requirements

1. Inspect the existing Tactics Engine before changing anything. Preserve its distinct tool identity, entry point, existing capabilities, and consumers.
2. Group its opportunity-response features with this Radar-to-Tactics workflow in documentation and handoff mapping, while keeping Tactics Engine a separate tool.
3. For each accepted opportunity, create one or more tactic proposals with:
   - source opportunity ID and evidence references;
   - target outcome and intended audience/context;
   - action steps, prerequisites, resources, and owner;
   - expected impact stated as a hypothesis, with confidence and time horizon;
   - risks, costs/trade-offs, constraints, and reasons not to act;
   - measurable success and guardrail metrics mapped to Analytics Canon;
   - optional experiment proposal routed to the existing Experiment Lab;
   - creator review/approval state and idempotent operation identity where writes are involved.
4. Keep recommendations reversible and inspectable. Do not auto-publish, execute external writes, or silently mutate a project. Require existing creator approval and destination-specific safety contracts.
5. Support rejection, deferral, supersession, and feedback so tactics do not remain falsely actionable after their source opportunity changes.
6. Return outcomes/feedback through existing Brain learning and analytics pathways with provenance; do not create a second learning loop or a separate tactics/opportunity database.

## Required end-to-end flow

`governed signals → Radar candidate → evidence review/validation → accepted opportunity packet → Tactics Engine proposal → creator review → approved project/experiment handoff → measured outcome → governed learning feedback`

Validate every producer/receiver payload and lifecycle transition. Registry presence alone is not proof of a compatible handoff. Enforce schema/version compatibility, source and destination IDs, evidence references, snapshot/window identity, project/content-build identity, operation/idempotency identity, approval status, and failure/retry semantics using existing contracts wherever possible.

## Execution contract

Inspect live branch files before editing. Establish the smallest correct integration and identify which functions can be reused without merging the widget and tool. Implement the behavior; do not stop at an audit. Treat this prompt's ownership map as a hypothesis to validate against source evidence, but treat the no-widget-merging boundary as mandatory.

Use test-driven development. Add focused regression tests for candidate classification, missing/null baselines, stale or conflicting evidence, legacy records, invalid/incompatible handoff payloads, rejected/deferred opportunities, tactic-to-source linkage, approval boundaries, idempotency, and failure/retry paths as applicable. Run focused tests, typecheck, relevant integration tests, full suite, and build when the environment permits. Report exact commands and real results; never claim unrun checks passed.

Do not delete or merge widget code, tool registrations, stores, or domain models merely to reduce duplication. First search all consumers, extract/reuse shared behavior behind a stable contract if needed, prove parity with tests, and preserve the widget's independent operation. Update the authoritative prompt inventory and tool/widget/handoff mapping rather than creating duplicate planning documents.

## Deliverables and acceptance

- Opportunity Radar remains a distinct Studio Hub tool and the existing Opportunity Radar widget remains distinct and functional.
- Tactics Engine remains a distinct tool with its own features and lifecycle.
- A typed, tested Radar → Tactics handoff connects validated opportunities to tactic proposals.
- Projects/ContentBuild, Experiment Lab, Analytics Canon, and Brain remain the canonical owners for their respective responsibilities.
- Evidence, uncertainty, approvals, provenance, and idempotency survive the full workflow.
- Focused regression coverage and a concise changed-files/test-status report are provided.
- If canonical inputs or destination capabilities are unavailable, expose a concrete blocker instead of simulating successful integration.
