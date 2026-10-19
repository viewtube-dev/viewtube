<!-- Source: Superhuman Docs master, mirrored without changing roadmap claims. -->
<!-- Source URL: https://docs.superhuman.com/d/_djJG_RekIgX/AI-Brain-Feature-Master-Implementation-Readiness_suQM85X8 -->
<!-- Repository target: master/consolidated-feature-integration -->

# ViewTube AI Brain — Consolidated Feature Master

## Purpose and rating rubric

This document merges repeated chatbot, user-facing Brain UI, evidence, context, publishing, and learning proposals into distinct feature families. It is a roadmap/reference—not a claim that every feature is missing or runtime-verified.

**Power (P, 1–5):** user/business impact. **Readiness (R, 1–5):** current code foothold, not effort. **Confidence:** High = repository docs/code explicitly support the foothold; Medium = caller/UI needs tracing; Low = mostly proposed. “Quick win” means bounded integration work, subject to target-branch verification and tests.

## Consolidated catalogue

### F01 — Explicit creator context and scope

**Merged:** context bar; channel/project/video/asset selection; context drawer; no-project state; clear/switch context.  
**Feature:** show channel, project, ContentBuild/content item, selected asset, and analytics window in Chat; inspect/change/clear each field; explicitly label absent or fallback context.  
**P5/R4 · High · Quick win.**  
**Foothold:** `src/services/brain/CreatorContextResolver.ts` is documented as a read-only facade delegating to existing owners without new persistence.  
**Acceptance:** no silent cross-channel/project fallback; context refreshes on switch; empty state explicit; channel-scope tests.

### F02 — Evidence-grounded answers and provenance

**Merged:** “Based on” links; claim-level evidence; freshness/missing-data indicators; reproducible snapshots; fact/hypothesis/recommendation labels; answer evidence drawer.  
**Feature:** relevant answers expose source records, metric/filter/window, freshness, missing inputs, and statement type. Do not present heuristic scores as calibrated probabilities.  
**P5/R4 · High for evidence architecture, Medium for UI wiring · Quick win.**  
**Foothold:** system-convergence docs mark EvidenceRecord projection and EvidenceIntelligenceResolver read-only facade as implemented; canonical analytics truth is `analytics-canon`. A 2026-09-27 audit said `BrainAnalyticsEvidence` had no production caller then.  
**Acceptance:** claims trace to canonical evidence; stale/missing data constrains wording; no invented citations.

### F03 — Request-specific retrieval and deterministic analytics

**Merged:** honor requested count/format/date/metric; compatible comparisons; analytics query translation; statistics routing; evidence sufficiency gates.  
**Feature:** pass explicit query constraints to existing evidence/statistics services; calculate numbers deterministically; show actual sample size and limitations.  
**P5/R3 · Medium · Near-term.**  
**Foothold:** capability/evidence requirements are referenced in prior inspection; EvidenceIntelligenceResolver is the documented projection direction.  
**Acceptance:** “top 10 long-form videos last year” cannot silently become a generic top-five/recent sample; incompatible cohorts flagged; insufficient evidence produces a precise limitation.

### F04 — Conversation integrity and safe recovery

**Merged:** preserve exact words; exclude background events from model history; avoid repeated questions; retry interrupted answers; preserve drafts; stop/edit/resend.  
**Feature:** persist original user messages verbatim; separate display sanitization from stored instructions; build model history from visible chat plus selected decisions; retry generation without replaying external actions.  
**P5/R3 · Medium · Near-term.**  
**Foothold to reverify:** earlier inspection named `aiBrainConversationStore.ts`, `beginAIBrainTurn()`, `resumeAIBrainThread()`, `completeAIBrainTurn()`, and `BrainConversationController.ts`.  
**Acceptance:** exact message round-trip; background events excluded; no duplicate side effects on retry; IME composition/drafts preserved.

### F05 — Intent-sensitive answer formatting

**Merged:** remove generic growth filler; direct answers for direct questions; diagnosis-specific evidence; artifact-first outputs.  
**Feature:** format by intent (answer, diagnosis, ideation, asset, handoff, status); never inject a growth plan merely because few modules were returned.  
**P4/R4 · Medium-high · Quick win.**  
**Foothold:** prior inspection identified `formatCreatorGrowthModules()` and response modes.  
**Acceptance:** no irrelevant 30-day plan in a direct answer; diagnosis retains caveats; asset request returns the requested artifact.

### F06 — Accessible, predictable controls

**Merged:** keyboard/touch/screen-reader support; readable type; focus management; simple/advanced settings; save/cancel/reset/inheritance; unsaved-change protection.  
**Feature:** accessible names/descriptions, visible focus, non-color status, usable hit areas, save announcements, inherited/overridden labels, reset preview/confirmation.  
**P4/R3 · Medium · Near-term.**  
**Foothold to reverify:** prior page inspection identified `AIBrainCommandInterface.tsx` and `BrainControlsPage.tsx`, with Save and Reset channel overrides.  
**Acceptance:** keyboard/screen-reader/zoom/mobile QA; focus returns after dialogs; reset scope clear; unsaved edits protected.

### F07 — Capability browser and prompt launcher

**Merged:** searchable prompts, categories/favorites/recents, shortcuts, prerequisite labels, unavailable reasons, preview/edit before send, explain advise/draft/prepare/execute.  
**Feature:** use authoritative capability registry; show output, required context/data, action mode, and why unavailable. Preview never executes consequential work.  
**P4/R4 · Medium-high · Quick win.**  
**Foothold to reverify:** `BrainCapabilityRegistry.ts`, prompt cards, capability statuses, and preview flow were referenced in prior inspection.  
**Acceptance:** no duplicate registry; prerequisites actionable; no surprise execution.

### F08 — Receipt-backed results and safe handoffs

**Merged:** open relevant tool with context; output cards; ToolReceipt/output IDs; proposed/started/saved/verified states; recovery.  
**Feature:** handoffs carry canonical IDs/evidence refs; result cards distinguish proposed, started, saved, approved, executed, verified.  
**P5/R3 · Medium · Near-term.**  
**Foothold to reverify:** prior inspection names `resolveAIBrainToolRoute()`, `AIBrainChatHandoff`, `ToolReceipt`, output IDs, and `BrainRuntimeSnapshot.ts`.  
**Acceptance:** no success claim without receipt/verification; review-only by default; reconcile unknown remote state before retry.

## Highest-impact and easiest likely starts

| Rank | Feature | Power/readiness | Small first slice | Gate |
| --- | --- | --- | --- | --- |
| 1 | F01 Context/scope | 5/4 | Render resolved context + explicit empty/clear state | Target-branch caller and channel-isolation tests |
| 2 | F02 Evidence/provenance | 5/4 | Show canonical evidence refs and missingness | Every claim maps to evidence |
| 3 | F05 Intent formatting | 4/4 | Remove unconditional generic fallback | Golden tests for direct answer/diagnosis/asset |
| 4 | F07 Capability launcher | 4/4 | Search/category from existing registry | Preview cannot execute |
| 5 | F04 Conversation/retry | 5/3 | Retry interrupted generation only | No side-effect replay |
| 6 | F06 Accessibility | 4/3 | Fix names, focus, save status, unsaved state | Keyboard/screen-reader/mobile QA |
| 7 | F03 Query-specific retrieval | 5/3 | One query shape: count+format+date+metric | Real sample counts and deterministic numbers |
| 8 | F08 Receipt-backed results | 5/3 | One canonical output/receipt card | Failure/partial/unknown states tested |

**Critical caveat:** a helper/type existing does not prove the feature is implemented. Verify active caller, UI reachability, canonical owner, tests, and runtime behavior. Do not build on `BrainAnalyticsEvidence` without a fresh caller audit.

## Remaining consolidated features

### F09 — Creator knowledge and learning governance

**Merged:** “What Brain knows”; confirmed vs inferred facts; preference corrections; scope/expiry; feedback reasons; learning inbox/receipts; preference learning separate from performance learning.  
**Feature:** manage facts, preferences, goals, temporary instructions, and proposed learning with source/scope/status/expiry and edit/reject/narrow/defer actions. Separate saved insight, proposed preference, and durable knowledge.  
**P5/R3 · Medium · Near-term.**  
**Foothold to reverify:** context envelope, question answers, learning IDs, memory changes, `listAlgorithmLearningCandidatesForReview()`, and `reviewAlgorithmLearningCandidate()` were referenced in prior inspection.  
**Acceptance:** no silent durable mutation; preference ≠ outcome; source/scope visible; deletion language accurate.

### F10 — Project/package readiness in chat

**Merged:** “what is ready?”; package checklist; blockers vs suggestions; asset/slot/variant status; capability readiness.  
**Feature:** use canonical project/ContentBuild and publishing-owner data to show stage, assets, variants, blockers, missing requirements, and publication state. Asset count alone never proves publish readiness.  
**P4/R3 · Medium · Near-term.**  
**Foothold:** prior notes reference `BrainRuntimeSnapshot.ts` and ContentBuild fields; architecture emphasizes canonical owners.  
**Acceptance:** no arbitrary first-project selection; publishing owner validates readiness; stale/unknown state labeled.

### F11 — Versioned brief, asset, and package continuity

**Merged:** durable brief; generate from approved revision; selective dependency-aware revision; provenance/alternatives; coherent package variants; freeze approved package.  
**Feature:** connect brief revision → generated assets → package revision → approval snapshot. Track provenance and warn about outdated assets.  
**P5/R2 · Low-medium · Strategic.**  
**Foothold:** architecture goals mention ContentBuild, publishing package sets, ActionPacket/GenerationRecord/ToolReceipt/BrainTrace; ownership and lineage need audit.  
**Acceptance:** canonical lineage; approval freezes exact assets/metadata/destination/schedule; material changes require reapproval.

### F12 — Recommendation-to-outcome learning loop

**Merged:** lifecycle IDs; prediction/review windows; launch review; outcome evaluation; acceptance/rejection reasons; end-to-end certification.  
**Feature:** link recommendation, creator decision, executed change, published package, measured outcome, evaluation, and learning candidate; record prediction before outcome.  
**P5/R2 · Low-medium · Strategic.**  
**Foothold:** lifecycle identities and learning review are named in project goals/prior inspection; end-to-end continuity is not verified.  
**Acceptance:** outcome ≠ preference; comparable publication ages; prediction evaluated against declared metric/window; counterexamples retained.

### F13 — Operations, permissions, budgets, recovery

**Merged:** discuss/prepare/execute modes; approvals; budgets; pending/running/failed operations; disconnected dependencies; activity center; publishing recovery.  
**Feature:** one center for mode, permissions, budgets, approvals, status, readiness, and recovery. Tool access never implies publish authorization.  
**P5/R2 · Low-medium · Strategic.**  
**Foothold:** handoff/receipt/runtime snapshot reportedly exist; complete activity aggregation unverified.  
**Acceptance:** explicit execution mode; approval binds to exact action/package; remote state reconciled before retry.

### F14 — Consistency, factuality, instruction boundaries

**Merged:** title-thumbnail-script promise consistency; factual claim review; prompt-injection boundaries; contradictions; difficult-scenario tests.  
**Feature:** flag unsupported claims, mismatched promises, contradictory evidence/preferences, and untrusted imported instructions. Treat comments/transcripts/pages as evidence, never tool authorization.  
**P4/R2 · Low-medium · Strategic.**  
**Acceptance:** claim/source inspection; imported content cannot override permissions; contradictions yield resolving tests; blockers separated from suggestions.

### F15 — Chart-to-chat and bounded experiments

**Merged:** chart selection opens evidence-backed chat; diagnostic trees; balanced portfolio; bounded experiments; hypothesis-led variants; distribution-vs-content diagnosis.  
**Feature:** preserve chart cohort/filter in chat; experiments specify hypothesis, metric, comparison, effort, and review window before execution.  
**P4/R2 · Low-medium · Strategic.**  
**Foothold:** canonical analytics/evidence projection documented; chart-to-chat and experiment lifecycle not verified.  
**Acceptance:** selection survives handoff; evaluate before executing; avoid unsupported causal claims.

## Roadmap / delivery sequence

**Phase 0 — source verification**

- Target branch: `master/consolidated-feature-integration` (not main).

- Record HEAD; inspect every candidate on that branch.

- Map service → active caller → UI route → tests → canonical owner.

- Default-branch links are discovery, not proof of target-branch state.

**Phase 1 — dependable chat:** F01, F04, F05, F02.  
**Phase 2 — actionable chat:** F07, F03, F08, F06.  
**Phase 3 — governed continuity:** F09, F10, F11, F12, F13, F14, F15.

## Cross-cutting acceptance rules

- No parallel analytics/profile/project/package/receipt/learning store.

- Claims and outputs trace to sources/versions where supported.

- Privacy and scope enforced in services, not only UI.

- Prepared ≠ approved ≠ executed ≠ verified.

- Conversation tone is not approval; retries do not replay side effects.

- Test keyboard, screen reader, zoom, touch, focus return, and non-color states.

- Show stale/missing data; reconcile unknown remote state before retry.

- Test one complete creator journey end to end.

## Repository references found

These commit-pinned links were located on the repository default branch, **not verified target-branch snapshots**. Re-open on `master/consolidated-feature-integration` before coding.

1. [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/src/services/brain/CreatorContextResolver.ts) — read-only context facade.

2. [System convergence TODO](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/todo.md) — context/evidence checklist.

3. [Creator context reachability audit](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/CREATOR-CONTEXT-REACHABILITY.md) — facade scope/migration.

4. [Evidence intelligence audit](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/EVIDENCE-INTELLIGENCE-AUDIT.md) — caller audit; BrainAnalyticsEvidence no-caller/donor at audit time.

5. [EvidenceRecord / DerivedSignal contract](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md) — evidence semantics.

6. [System classification](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/SYSTEM-CLASSIFICATION.md) — canonical owner/facade classifications.

7. [Integrated application program](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/docs/programs/INTEGRATED_APPLICATION.md) — cross-system convergence.

8. [System convergence architecture](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md) — owner/adapter migration.

## Requested resources / attribution

- **Idea Generator:** consolidated overlapping ideas into shared feature families and rated impact/readiness.

- **Matt Skills Curated — Research:** applied primary-source and fact-vs-recommendation discipline.

- **Docs AI / Superhuman Docs:** durable master reference created in Superhuman Docs.

- **agent.spot:** not used for product recommendations; this is repository roadmap synthesis, not external AI tool selection.

- **Superpowers:** no corresponding available tool/skill was confirmed in this session; no work is attributed to it.

## Open questions for the branch audit

1. Which listed code paths are active on the target branch now?

2. Which chat surface is primary versus legacy/duplicate?

3. What callers/schemas own EvidenceIntelligenceResolver, ToolReceipt, runtime snapshots, and candidate review?

4. Which tests cover scope, retry, receipt state, and learning governance?

5. Which features exist but are unreachable from UI?

**Next action:** audit target-branch callers/tests for F01–F08, then create a small, verified implementation batch.
