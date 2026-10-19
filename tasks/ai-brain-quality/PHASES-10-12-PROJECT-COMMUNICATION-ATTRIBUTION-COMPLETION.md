# AI Brain phases 10–12 implementation receipt

Date: 2026-10-15
Branch: `brain-phases-10-12-project-comms-attribution`
Target: `master/consolidated-feature-integration`
Scope: project-centered phase context, creator communication as governed evidence, and explicit recommendation-to-learning attribution.

## Phase 10 — Project-centered creation workflow

Implemented:
- `src/services/brain/BrainProjectLifecycle.ts` maps the canonical ContentBuild stage to a bounded lifecycle phase and relevant capabilities.
- Canonical workflow blockers are preserved.
- `BrainProjectContext.ts` adds the resolved lifecycle to the existing `AlgorithmProjectContext`; `BrainContextBroker.ts` passes phase, phase-relevant capabilities and blockers into the live Brain prompt policy. ContentBuild remains the stage owner.
- Missing canonical ContentBuild data returns `insufficient_context` rather than guessing from UI labels.

Acceptance still outstanding:
- Connect relevant capabilities to the live Brain runtime/UI filtering.
- Ensure Sidebar, Brain Hub, Studio Hub, and project tools supply the same canonical ContentBuild snapshot.
- Verify route changes, stale visible context, archived projects, and workflow blockers in a running browser.

## Phase 11 — Communication ingestion

Implemented:
- `src/services/brain/BrainCommunicationIngestion.ts` classifies creator communications into instruction, preference, correction, criticism, factual claim, goal, constraint, approval, rejection, experiment note, and style feedback.
- `recordCreatorCommunicationEvidence` stores communication as an immutable `CREATOR_COMMUNICATION_CLASSIFIED` event in the existing Algorithm Intelligence ledger. Sidebar Copilot, full AI Brain, and Brain Hub invoke it only when Brain, personalization, and learn-from-interactions controls are enabled.
- Stable channel + communication identity makes replays idempotent and rejects reuse of an ID for different text.
- Event metadata explicitly says `durableMemoryPromoted: false` and `promotionRequiresGovernedReview: true`.
- Neutral text is left unclassified rather than mislabeled as a fact. This path does not write directly to Channel Profile or validated knowledge.

Acceptance still outstanding:
- Wire chat turns, tool feedback, creator edits, approvals/rejections, and experiment notes to the ingestion function.
- Review text minimization, consent, privacy and retention boundaries.
- Verify durable persistence and server replay behavior.

## Phase 12 — Recommendation and asset attribution

Implemented:
- `src/services/brain/BrainAttributionChain.ts` resolves a read-only chain from recommendation through creator decision, execution, publication, measured outcome, and learning candidate.
- Links use same-channel explicit ancestry, source/event references, and exact stable identifiers; project co-membership or timestamp proximity alone never establishes a link.
- Cross-channel recommendation lookup fails closed.
- Incomplete chains enumerate missing stages; publication confirmation is not treated as performance evidence or causal proof.
- Existing event, decision and publication ledgers remain the writers; no parallel attribution store was introduced.

Acceptance still outstanding:
- Ensure generation, selected final variants, ActionPackets, publishing transactions, analytics evaluations and learning writers consistently propagate shared stable IDs.
- Surface attribution chains in live Brain/Studio workflows.
- Verify against production lifecycle records and confirm no ambiguous joins.

## Files added/updated

- `src/services/brain/BrainProjectLifecycle.ts`
- `src/services/brain/BrainProjectLifecycle.test.ts`
- `src/services/brain/BrainCommunicationIngestion.ts`
- `src/services/brain/BrainCommunicationIngestion.test.ts`
- `src/services/brain/BrainAttributionChain.ts`
- `src/services/brain/BrainAttributionChain.test.ts`
- `src/services/brain/AlgorithmIntelligenceEventLedger.ts`
- `src/services/brain/AlgorithmIntelligenceOrchestrator.ts`
- `src/services/brain/BrainProjectContext.ts`
- `src/services/brain/BrainProjectContext.test.ts`
- `tasks/ai-brain-quality/plan.md`
- `tasks/ai-brain-quality/todo.md`

## Verification

Regression tests have been authored but not executed during this session. The three live chat surfaces now call communication ingestion behind the existing user controls. Typecheck, full suite, production build, reachability/governance checks, and browser verification have not been executed. This is **implementation foundation complete, phases 10–12 not yet certified complete**. Do not claim production readiness until live wiring and verification gates pass.


## Current integration reconciliation — 2026-10-15

Communication capture is now opt-in per channel (default off) and the ingestion service enforces consent even if a caller forgets its UI guard. New events retain classification, a deterministic fingerprint, and provenance rather than raw creator text. Hydration performs a one-time redaction migration for older events. Durable learning records are now persisted through the authenticated Brain Intelligence API and restored into existing outcome/evaluation/candidate ledgers.

The Brain Command Center now exposes the existing read-only attribution detail panel. Capability evidence requirements, conservative context budgeting, and exact-ID project resolution are also integrated on the target branch.

**Still uncertified:** database-backed integration verification, complete stable-ID propagation across all production writers, browser verification of attribution and consent controls, and a green full release-gates run. The current CI baseline still has unrelated Studio UI/catalog failures and typecheck errors.
