# ViewTube AI Brain — Consolidated Feature Master & Implementation Readiness

**Status:** Active roadmap/reference  
**Last reviewed:** 2026-10-19  
**Target repository:** `viewtube-dev/viewtube`  
**Target branch for implementation:** `master/consolidated-feature-integration`  
**Purpose:** Consolidate overlapping proposals for the AI Brain chatbot, user-facing experience, evidence/context, publishing, and learning into a single implementation-readiness reference.

> This is a roadmap and audit guide, not a claim that every feature is missing or runtime-verified. A helper, type, service, or UI component existing does not prove that the capability is reachable or complete. Verify the active caller, UI route, canonical owner, tests, and runtime behavior on the target branch.

## 1. Rating rubric

- **Power (P, 1–5):** user/business impact.
- **Readiness (R, 1–5):** strength of the current code foothold, not implementation effort.
- **Confidence:** High means repository documentation/code explicitly supports the foothold; Medium means caller/UI wiring still needs tracing; Low means the feature is mostly proposed or its end-to-end lineage is unverified.
- **Quick win:** bounded integration work that still requires target-branch verification and tests.
- **Near-term:** meaningful multi-step work or cross-owner wiring.
- **Strategic:** broader contracts, lifecycle, governance, or end-to-end integration work.

## 2. Consolidated feature catalogue

### F01 — Explicit creator context and scope

**Merged proposals:** Context bar; channel/project/video/asset selection; context drawer; no-project state; clear/switch context.

**Feature:** Show channel, project, ContentBuild/content item, selected asset, and analytics window in Chat. Let the creator inspect, change, or clear each field, and explicitly label absent or fallback context.

**Priority/readiness:** P5 / R4 · High confidence · Quick win.

**Foothold:** `src/services/brain/CreatorContextResolver.ts` is documented as a read-only facade delegating to existing owners without creating new persistence.

**Acceptance criteria:**
- No silent cross-channel or cross-project fallback.
- Context refreshes when scope changes.
- Empty and unavailable states are explicit.
- Channel-scope behavior is covered by tests.

### F02 — Evidence-grounded answers and provenance

**Merged proposals:** “Based on” links; claim-level evidence; freshness/missing-data indicators; reproducible snapshots; fact/hypothesis/recommendation labels; answer evidence drawer.

**Feature:** Relevant answers expose source records, metric/filter/window, freshness, missing inputs, and statement type. Do not present heuristic scores as calibrated probabilities.

**Priority/readiness:** P5 / R4 · High confidence for evidence architecture; Medium for UI wiring · Quick win.

**Foothold:** System-convergence documents describe EvidenceRecord projection and an EvidenceIntelligenceResolver read-only facade; canonical analytics truth is `analytics-canon`. A 2026-09-27 audit reported that `BrainAnalyticsEvidence` had no production caller at that time.

**Acceptance criteria:**
- Claims trace to canonical evidence where supported.
- Stale or missing data constrains the wording.
- No invented citations or source records.
- Refresh/snapshot behavior is reproducible where the underlying owner supports it.

### F03 — Request-specific retrieval and deterministic analytics

**Merged proposals:** Honor requested count/format/date/metric; compatible comparisons; analytics query translation; statistics routing; evidence sufficiency gates.

**Feature:** Pass explicit query constraints to existing evidence/statistics services, calculate numbers deterministically, and show actual sample size and limitations.

**Priority/readiness:** P5 / R3 · Medium confidence · Near-term.

**Foothold:** Capability/evidence requirements have been referenced in prior inspection; EvidenceIntelligenceResolver is the documented projection direction.

**Acceptance criteria:**
- “Top 10 long-form videos last year” cannot silently become a generic top-five or recent sample.
- Incompatible cohorts are flagged rather than compared as if equivalent.
- Insufficient evidence produces a precise limitation.
- Calculations and filters can be traced to the selected data.

### F04 — Conversation integrity and safe recovery

**Merged proposals:** Preserve exact words; exclude background events from model history; avoid repeated questions; retry interrupted answers; preserve drafts; stop/edit/resend.

**Feature:** Persist original user messages verbatim; separate display sanitization from stored instructions; build model history from visible chat plus selected decisions; retry generation without replaying external actions.

**Priority/readiness:** P5 / R3 · Medium confidence · Near-term.

**Footholds to reverify:** Earlier inspection named `aiBrainConversationStore.ts`, `beginAIBrainTurn()`, `resumeAIBrainThread()`, `completeAIBrainTurn()`, and `BrainConversationController.ts`.

**Acceptance criteria:**
- Exact message round-trip is preserved.
- Background events are excluded from user-authored model history.
- Retrying generation does not duplicate external side effects.
- IME composition and drafts are preserved.

### F05 — Intent-sensitive answer formatting

**Merged proposals:** Remove generic growth filler; direct answers for direct questions; diagnosis-specific evidence; artifact-first outputs.

**Feature:** Format by intent (answer, diagnosis, ideation, asset, handoff, status). Never inject a growth plan merely because few modules were returned.

**Priority/readiness:** P4 / R4 · Medium-high confidence · Quick win.

**Foothold:** Prior inspection identified `formatCreatorGrowthModules()` and response modes.

**Acceptance criteria:**
- A direct question does not receive an irrelevant 30-day plan.
- Diagnosis retains relevant evidence and caveats.
- An asset request returns the requested artifact or clearly explains why it cannot.
- Formatting follows the request rather than a generic response template.

### F06 — Accessible, predictable controls

**Merged proposals:** Keyboard/touch/screen-reader support; readable type; focus management; simple/advanced settings; save/cancel/reset/inheritance; unsaved-change protection.

**Feature:** Accessible names/descriptions, visible focus, non-color status, usable hit areas, save announcements, inherited/overridden labels, and clear reset scope/confirmation.

**Priority/readiness:** P4 / R3 · Medium confidence · Near-term.

**Original foothold to reverify:** Earlier page inspection identified `AIBrainCommandInterface.tsx` and `BrainControlsPage.tsx`, including save and reset channel overrides.

**Acceptance criteria:**
- Keyboard, screen-reader, zoom, and mobile QA passes.
- Focus returns appropriately after dialogs.
- Reset scope is clear before an override is cleared.
- Unsaved edits are protected from accidental loss.
- Saved state is announced accessibly and accurately.

### F07 — Capability browser and prompt launcher

**Merged proposals:** Searchable prompts; categories/favorites/recents; shortcuts; prerequisite labels; unavailable reasons; preview/edit before send; clear distinctions between advise/draft/prepare/execute.

**Feature:** Use the authoritative capability registry. Show output, required context/data, action mode, and why a capability is unavailable. Previewing must not execute consequential work.

**Priority/readiness:** P4 / R4 · Medium-high confidence · Quick win.

**Foothold to reverify:** `BrainCapabilityRegistry.ts`, prompt cards, capability statuses, and preview flow were referenced in prior inspection.

**Acceptance criteria:**
- No duplicate capability registry is introduced.
- Prerequisites and unavailable reasons are actionable.
- Preview/edit is separate from consequential execution.
- No surprise execution.
- Capability availability never overstates what has actually run.

### F08 — Receipt-backed results and safe handoffs

**Merged proposals:** Open the relevant tool with context; output cards; ToolReceipt/output IDs; proposed/started/saved/verified states; recovery.

**Feature:** Handoffs carry canonical IDs/evidence references. Result cards distinguish proposed, started, saved, approved, executed, and verified states.

**Priority/readiness:** P5 / R3 · Medium confidence · Near-term.

**Foothold to reverify:** Prior inspection names `resolveAIBrainToolRoute()`, `AIBrainChatHandoff`, `ToolReceipt`, output IDs, and `BrainRuntimeSnapshot.ts`.

**Acceptance criteria:**
- No success claim without a receipt or verification appropriate to the operation.
- Review-only is the default for consequential work.
- Unknown remote state is reconciled before retry.
- Handoffs preserve canonical context and artifact identity.

### F09 — Creator knowledge and learning governance

**Merged proposals:** “What Brain knows”; confirmed vs. inferred facts; preference corrections; scope/expiry; feedback reasons; learning inbox/receipts; preference learning separate from performance learning.

**Feature:** Manage facts, preferences, goals, temporary instructions, and proposed learning with source, scope, status, and expiry, plus edit/reject/narrow/defer actions. Separate saved insight, proposed preference, and durable knowledge.

**Priority/readiness:** P5 / R3 · Medium confidence · Near-term.

**Footholds to reverify:** Context envelope, question answers, learning IDs, memory changes, `listAlgorithmLearningCandidatesForReview()`, and `reviewAlgorithmLearningCandidate()` were referenced in prior inspection.

**Acceptance criteria:**
- No silent durable knowledge mutation.
- Creator preference is not conflated with measured performance outcomes.
- Source and scope are visible.
- Expiry and deletion language accurately describe what is retained or removed.

### F10 — Project/package readiness in chat

**Merged proposals:** “What is ready?”; package checklist; blockers vs. suggestions; asset/slot/variant status; capability readiness.

**Feature:** Use canonical project/ContentBuild and publishing-owner data to show stage, assets, variants, blockers, missing requirements, and publication state. Asset count alone never proves publish readiness.

**Priority/readiness:** P4 / R3 · Medium confidence · Near-term.

**Foothold:** Prior notes reference `BrainRuntimeSnapshot.ts` and ContentBuild fields; architecture emphasizes canonical owners.

**Acceptance criteria:**
- No arbitrary first-project selection.
- The publishing owner validates readiness.
- Stale and unknown state is labelled.
- Blockers are distinguished from optional recommendations.

### F11 — Versioned brief, asset, and package continuity

**Merged proposals:** Durable brief; generate from approved revision; selective dependency-aware revision; provenance/alternatives; coherent package variants; freeze approved package.

**Feature:** Connect brief revision → generated assets → package revision → approval snapshot. Track provenance and warn about outdated assets.

**Priority/readiness:** P5 / R2 · Low-medium confidence · Strategic.

**Foothold:** Architecture goals mention ContentBuild, publishing package sets, ActionPacket/GenerationRecord/ToolReceipt/BrainTrace; ownership and lineage need an audit.

**Acceptance criteria:**
- Canonical lineage links revisions and generated assets.
- Approval freezes the exact assets, metadata, destination, and schedule.
- Material changes require reapproval.
- Alternatives remain distinct from the approved/current package.

### F12 — Recommendation-to-outcome learning loop

**Merged proposals:** Lifecycle IDs; prediction/review windows; launch review; outcome evaluation; acceptance/rejection reasons; end-to-end certification.

**Feature:** Link recommendation, creator decision, executed change, published package, measured outcome, evaluation, and learning candidate. Record predictions before outcomes are observed.

**Priority/readiness:** P5 / R2 · Low-medium confidence · Strategic.

**Foothold:** Lifecycle identities and learning review are named in project goals/prior inspection; end-to-end continuity is not verified.

**Acceptance criteria:**
- Outcome is not treated as preference.
- Comparisons use comparable publication ages/windows.
- Predictions are evaluated against a declared metric and review window.
- Counterexamples and negative outcomes are retained.

### F13 — Operations, permissions, budgets, recovery

**Merged proposals:** Discuss/prepare/execute modes; approvals; budgets; pending/running/failed operations; disconnected dependencies; activity center; publishing recovery.

**Feature:** One center for mode, permissions, budgets, approvals, status, readiness, and recovery. Tool access never implies publishing authorization.

**Priority/readiness:** P5 / R2 · Low-medium confidence · Strategic.

**Foothold to reverify:** Handoff/receipt/runtime snapshot reportedly exist; complete activity aggregation is unverified.

**Acceptance criteria:**
- Execution mode is explicit.
- Approval binds to the exact action/package being approved.
- Unknown remote state is reconciled before retry.
- Failure and recovery paths preserve input/context and prevent duplicate execution.

### F14 — Consistency, factuality, instruction boundaries

**Merged proposals:** Title-thumbnail-script promise consistency; factual claim review; prompt-injection boundaries; contradictions; difficult-scenario tests.

**Feature:** Flag unsupported claims, mismatched promises, contradictory evidence/preferences, and untrusted imported instructions. Treat comments, transcripts, and pages as evidence, never as tool authorization.

**Priority/readiness:** P4 / R2 · Low-medium confidence · Strategic.

**Acceptance criteria:**
- Claims can be inspected against their sources.
- Imported content cannot override permissions or system policy.
- Contradictions yield explicit uncertainty or a resolving test.
- Blockers are separated from suggestions.

### F15 — Chart-to-chat and bounded experiments

**Merged proposals:** Chart selection opens evidence-backed chat; diagnostic trees; balanced portfolio; bounded experiments; hypothesis-led variants; distribution-vs-content diagnosis.

**Feature:** Preserve chart cohort/filter in chat. Experiments specify hypothesis, metric, comparison, effort, and review window before execution.

**Priority/readiness:** P4 / R2 · Low-medium confidence · Strategic.

**Foothold:** Canonical analytics/evidence projection is documented; chart-to-chat and experiment lifecycle are not verified.

**Acceptance criteria:**
- Chart selection/filter survives handoff to chat.
- Hypotheses and evaluation criteria are defined before executing an experiment.
- Avoid unsupported causal claims.
- Results are tied to the intended comparison and review window.

## 3. Prioritization and delivery sequence

### Phase 0 — Source verification

1. Target branch is `master/consolidated-feature-integration`, not `main`.
2. Record target-branch HEAD before implementation.
3. Map service → active caller → UI route → tests → canonical owner.
4. Default-branch links are discovery aids, not proof of target-branch state.

### Phase 1 — Dependable chat

**F01, F04, F05, F02**

Establish explicit context, trustworthy conversation history, intent-sensitive answers, and evidence provenance.

### Phase 2 — Actionable chat

**F07, F03, F08, F06**

Make capabilities discoverable, honor exact query constraints, provide safe receipt-backed handoffs, and ensure accessible controls.

### Phase 3 — Governed continuity

**F09, F10, F11, F12, F13, F14, F15**

Connect knowledge governance, project/package readiness, revision lineage, outcome learning, operational controls, factuality, and bounded experiments.

### Suggested early implementation order

Prioritize features with high user impact and a verifiable integration seam. Treat the order as a recommendation, not as proof that a feature is absent:
1. Verify and close context/scope gaps (F01).
2. Verify evidence provenance and answer constraints (F02/F03).
3. Protect conversation integrity and recovery (F04).
4. Improve intent-sensitive answer formatting (F05).
5. Deliver the capability browser/prompt launcher (F07).
6. Close accessible control gaps (F06).
7. Verify receipts and safe handoffs (F08).
8. Move to governed continuity features (F09–F15) as canonical owners and end-to-end tests are established.

## 4. Cross-cutting acceptance rules

- Do not introduce parallel analytics, profile, project, package, receipt, or learning stores.
- Claims and outputs trace to sources/versions where supported.
- Privacy and scope are enforced in services, not only in UI.
- **Prepared ≠ approved ≠ executed ≠ verified.**
- Conversation tone is not approval; retries do not replay side effects.
- Test keyboard, screen reader, zoom, touch, focus return, and non-color states.
- Show stale/missing data; reconcile unknown remote state before retry.
- Test at least one complete creator journey end to end.
- Keep authoritative ownership in the domain system; Brain coordinates and reasons rather than silently replacing source-of-truth records.

## 5. Repository references to re-check on the target branch

The following commit-pinned links were discovered on the repository default branch in the original research. They were **not verified target-branch snapshots** at that time; reopen each on `master/consolidated-feature-integration` before relying on it for implementation.

1. [CreatorContextResolver.ts](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/src/services/brain/CreatorContextResolver.ts) — read-only context facade.
2. [System convergence TODO](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/todo.md) — context/evidence checklist.
3. [Creator context reachability audit](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/CREATOR-CONTEXT-REACHABILITY.md) — facade scope/migration.
4. [Evidence intelligence audit](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/EVIDENCE-INTELLIGENCE-AUDIT.md) — caller audit; the no-caller finding for BrainAnalyticsEvidence reflects the audit time.
5. [EvidenceRecord / DerivedSignal contract](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/EVIDENCE-RECORD-DERIVED-SIGNAL-CONTRACT.md) — evidence semantics.
6. [System classification](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/tasks/system-convergence/SYSTEM-CLASSIFICATION.md) — canonical owner/facade classifications.
7. [Integrated application program](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/docs/programs/INTEGRATED_APPLICATION.md) — cross-system convergence.
8. [System convergence architecture](https://github.com/viewtube-dev/viewtube/blob/bcc561d3c96e435252c1cc8ec544283030117322/docs/architecture/VIEWTUBE_SYSTEM_CONVERGENCE_AND_CONSOLIDATION.md) — owner/adapter migration.

## 6. Source attribution

- **Idea Generator:** consolidated overlapping ideas into shared feature families and rated impact/readiness.
- **Matt Skills Curated — Research:** applied primary-source and fact-vs-recommendation discipline.
- **Docs AI / Superhuman Docs:** durable master reference created in Superhuman Docs.
- **agent.spot:** not used for product recommendations; this is repository roadmap synthesis, not external AI-tool selection.
- **Superpowers:** no corresponding available tool/skill was confirmed in the original session; no work is attributed to it.

## 7. Open questions for the branch audit

1. Which listed code paths are active on the target branch now?
2. Which chat surface is primary versus legacy/duplicate?
3. What callers/schemas own EvidenceIntelligenceResolver, ToolReceipt, runtime snapshots, and candidate review?
4. Which tests cover scope, retry, receipt state, and learning governance?
5. Which features exist but are unreachable from UI?

## 8. Implementation status note — 2026-10-19

**F06 and F07 implementation:** PR [#621](https://github.com/viewtube-dev/viewtube/pull/621) was merged into `master/consolidated-feature-integration` on 2026-10-19. The implementation adds accessible prompt search/category filtering and announcements, improved control hit areas and inherited-default actions, and a searchable capability browser using the existing registry with prerequisite/readiness messaging and edit-before-send support.

**Verification status:** The recorded CI evidence showed the production build, local smoke checks, and Brain quality loop passing. Static typecheck and focused/source-governance contracts still reported Studio stepper export and confirmed-library-layout contract failures. Do not treat the complete release-gate suite as green solely because PR #621 merged; re-run and resolve the remaining gates independently.

**Next action:** audit target-branch callers/tests for F01–F08, then deliver small implementation batches with explicit canonical ownership and verified acceptance criteria.
