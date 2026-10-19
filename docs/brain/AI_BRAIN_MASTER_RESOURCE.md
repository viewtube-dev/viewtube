# ViewTube AI Brain — Master Resource Document

**Purpose.** Single source of truth for the prompts, principles, quick-win implementation brief, idea system, and skill contract that govern AI Brain work.  
**Scope.** Chatbot, Creator Context, Evidence, Analytics, Learning, ContentBuild, Packaging, and the user-facing Brain page.  
**Rule.** Extend existing owners. Never create parallel Brain runtimes, memory stores, analytics engines, or package databases.

---

## 1. Foundational Principles (apply to every prompt and change)

1. **Continuity over novelty** — A creator must move from question → evidence → decision → artifact → publication → measured outcome without losing identity or provenance.
2. **Inspectability** — Every material claim, recommendation, and status must be openable to its supporting records.
3. **Exact provenance** — Recommendations, packages, and learnings carry stable IDs through the full lifecycle.
4. **Honest execution states** — Distinguish proposed / awaiting approval / running / completed / verified. Generated text is never a completed tool action.
5. **Evidence is not instruction** — Comments, transcripts, research pages, and imports inform answers; they never override creator intent or grant tool permissions.
6. **Preference ≠ performance** — Selecting a title is preference evidence; a measured outcome is performance evidence. Keep them separate until a valid outcome connects them.
7. **Surgical change** — Prefer the smallest diff that produces correct behavior. Reuse existing systems only.
8. **Accessibility & clarity** — New UI must be keyboard-accessible, screen-reader friendly, and consistent with Studio controls.

---

## 2. Section 11 Quick-Wins Implementation Prompt

*Use this prompt (or the skill that embeds it) whenever implementing the immediate, existing-system improvements.*

```
You are a senior engineer working on the ViewTube AI Brain on the master/consolidated-feature-integration branch. Implement every quick win listed below in a single coordinated pass. Reuse existing systems only—no new databases, no new Brain runtime, no parallel memory stores, no new analytics engines.

GLOBAL QUALITY RULES
- Prefer the smallest, most surgical diff that produces the correct behavior.
- Never break existing conversation restoration, tool handoffs, or learning governance.
- All new UI must be keyboard-accessible, screen-reader friendly, and consistent with the Studio control system.
- Every new surface must surface real data from existing owners; never invent confidence scores, fake readiness, or placeholder receipts.
- Preserve full provenance: every displayed evidence item, receipt, or context item must link to its canonical ID.
- After implementation, the chatbot must still pass the existing end-to-end conversation restore and tool-route tests.

IMPLEMENTATION ORDER (safe sequence)
1 → 13 → 2 → 4 → 14 → 3 → 12 → 11 → 5 → 6 → 10 → 7 → 8 → 9 → 15 → 16 → 17 → 18 → 19

1. Preserve the creator’s exact words
Current: sanitizeCreatorFacingBrainCopy() mutates user messages before storage.
Required: Store the original user message exactly. Apply friendly terminology only at presentation time.
Optimization:
- Dual representation: rawUserMessage (immutable) + optional displayUserMessage.
- beginAIBrainTurn(), learning, evidence matching, and follow-up resolution always use rawUserMessage.
- Unit test that “failed”, “error”, and “API” survive storage and appear correctly in learning-event capture.

2. Select evidence according to the actual question
Current: buildAIBrainEvidencePack() always returns five top + five recent videos.
Required: Parse request for count, format, period, ranking metric before selecting.
Optimization:
- Extract lightweight EvidenceRequestSpec (count, formats, since/until, rankBy, filters).
- Graceful shortfall: return what exists and surface it in readiness summary.
- Prefer synced video inventory; cache resolved cohort on the turn for stable “Based on” links.

3. Compact “Based on” evidence section under answers
Required: After every evidence-using answer, render a compact “Based on” block with clickable references.
Optimization:
- Reuse AIBrainEvidencePack.items + evidenceIds already on the turn.
- Default 3–5 most relevant items; expand on demand.
- Each item opens the correct analytics/video surface with original filters.
- Never show evidence that was not actually supplied to the model for that turn.

4. Show data readiness before analytics advice
Required: Before any analytics diagnosis, display a small readiness summary (e.g. “Partial channel data · revenue unavailable · traffic data 3 days stale”).
Optimization:
- Source exclusively from buildVtSyncDiagnosticsSummary(), sourceStatuses, availableMetrics, missingInputs.
- Use the same state to constrain the answer (no invented revenue diagnosis when revenue is missing).
- Make the readiness chip expandable to the exact missing datasets.

5. Replace numerical profile-confidence with evidence-coverage checklist
Required: Remove arbitrary 0–1 score. Replace with concrete checklist (“Channel description ✓ · 42 videos analyzed · Goals unconfirmed · Style preference confirmed”).
Optimization:
- Derive from inferredProfile, saved question answers, and capability-status list.
- Show only items that affect the current answer.
- Incomplete items are actionable links (“Confirm goals”, “Add style examples”).

6. Stop re-asking questions the creator already answered
Required: Before proposing any follow-up, reconcile against saved questionAnswers.
Optimization:
- Treat an answer as valid unless outdated, contradicted, or explicitly reopened.
- Surface subtle “You previously said…” reference so the creator can correct it.
- Keep logic inside answerAIBrainQuestionModule() so chat and onboarding share it.

7. One-click “Retry this response” for interrupted turns
Required: When a turn is interrupted, offer “Retry this response” that reuses the original prompt + context.
Optimization:
- Retry generation only; never auto-replay external side-effects.
- Preserve original turn ID and evidence pack.
- If context is now stale, show a one-line warning and let the creator choose.

8. Review-only tool handoff buttons
Required: Contextual buttons (“Open in Thumbnail Studio”, “Prepare metadata draft”, “Review in Projects”) that carry selected content + evidence.
Optimization:
- Reuse resolveAIBrainToolRoute(), AIBrainChatHandoff, and command-action registry.
- Always set reviewOnly: true. Opening ≠ approving an external publish.
- Pre-fill destination with exact evidence IDs and originating chat turn.

9. Visible receipts for corrections and learning events
Required: After a correction or preference is captured, show a short receipt (what was recorded, scope, conversation context vs learning candidate vs durable knowledge).
Optimization:
- Source from captureAIBrainLearningEvent(), learningEntryIds, memoryChanges.
- Offer immediate Correct / Reject that route through existing governance.
- Never auto-promote a learning candidate to durable knowledge from the receipt.

10. Remove automatic generic filler modules
Required: Stop injecting “Why This Is Happening” / “30-Day Goal Path” when irrelevant to intent.
Optimization:
- Make formatCreatorGrowthModules() intent-aware.
- Direct factual question → direct answer; diagnosis → evidence + caveats; asset request → asset.
- Attach growth-plan modules only for strategy/planning intent.
- Preserve existing response-mode system.

11. Visible context strip + “Context used” drawer
Required: Persistent strip (Channel → Project → ContentBuild → Selected video/asset) and a drawer listing exact CreatorContextEnvelope items used.
Optimization:
- Reuse CreatorContextResolver.ts and the existing envelope.
- Allow clear or lock of any selection from the strip.
- In the drawer mark each item confirmed / inferred / temporary and provide one-click correction path (feeds item 9).

12. Evidence button under analytics answers
Required: Evidence button that expands supporting videos, search terms, traffic sources, and missing inputs via existing BrainAnalyticsEvidence helpers.
Optimization:
- Call buildAnalyticsEvidenceExplanation() but never display default 0.85 / 0.6 confidence numbers.
- Present only measured coverage and missing inputs.
- Keep button adjacent to the claim it supports (claim-level, not answer-level).

13. Clean conversation history
Required: Apply the same conversation-source filter used for visible turns when building model history. Exclude feedback, journal, quick-action, and intake records.
Optimization:
- Keep a bounded window of the most recent relevant project decisions inside the context budget.
- Apply the filter consistently in both controller and history builder.

14. Route numerical questions through existing statistics capabilities
Required: Before generating an explanation that contains numbers, route through statistics-intelligence / analytics-diagnosis and surface missing-evidence requirements from BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS.
Optimization:
- If required evidence is absent, return a clear “I don’t have X data” message instead of a plausible number.
- Attach the actual calculation result (not a model paraphrase) so the “Based on” section can link to it.

15. Contextual shortcuts from the capability registry
Required: Generate contextual shortcuts (Explain performance, Find patterns in best videos, Suggest search opportunity, One priority, Draft a hook) from BrainCapabilityRegistry.ts.
Optimization:
- Only show shortcuts whose evidence requirements are currently satisfied.
- Disable unavailable shortcuts with a one-line reason rather than hiding them.
- Clicking a shortcut pre-populates the composer with the canonical prompt card.

16. “How this answer was produced” drawer
Required: Drawer showing capabilities invoked, evidence returned/missing, prompt versions, actual model served, operation status, and output reference.
Optimization:
- Source exclusively from existing Brain traces and BrainRuntimeSnapshot.ts.
- Provenance and concise status only—no private chain-of-thought.
- Available on every completed turn.

17. Result cards backed by real ToolReceipts
Required: After any generation, show a result card with saved output, destination, version, and receipt ID. Distinguish “draft proposed”, “operation started”, and “output saved”.
Optimization:
- Join generation requests with ToolReceipt records and output asset IDs from the runtime snapshot.
- Never claim “created” solely because the chatbot emitted text.
- Offer direct “Open output” to the canonical asset.

18. Project / package status answers from ContentBuild data
Required: “What is ready for this project?” returns a concise status card (stage, asset count, selected slots, variant groups, blockers, publication status).
Optimization:
- Use only existing ContentBuild fields from the runtime snapshot.
- Never claim publish-ready unless the publishing owner’s own readiness check has passed.
- If no project is selected, refuse to guess and prompt the creator to choose one.

19. Learning-review queue as review cards inside chat
Required: Surface pending candidates from listAlgorithmLearningCandidatesForReview() as review cards with Hold / Reject / Approve-for-profile-review.
Optimization:
- Reuse reviewAlgorithmLearningCandidate() exactly. Approval for review ≠ durable knowledge update.
- Show supporting examples and scope on the card.
- After action, update the card in place and keep the decision in conversation history for audit.

DEFINITION OF DONE
- Existing conversation-restore, tool-route, and learning-governance tests still pass.
- New smoke coverage for “Based on”, readiness, retry, and learning-receipt surfaces.
- Deliver as focused, reviewable commits that map cleanly to the numbered items above.
```

---

## 3. Consolidated Idea System (Categories 1–12)

*Strategic north star. Use when prioritising larger work beyond the quick wins.*

### 1. Chatbot & Brain Orchestration
- Persistent working-context bar (channel, project, ContentBuild, video, package, analytics window). Explicit change/lock; no silent cross-scope leakage.
- Intent classification → correct capability, evidence requirements, output format, permissions.
- Structured action cards (change, evidence, target, benefit/limitations, tool, cost/approval). Accepting prefills; never auto-executes.
- Live capability & readiness map. Distinguish “explain”, “draft”, “execute after approval”.
- Resumable chat-to-tool handoffs carrying question, constraints, evidence, candidates.
- Honest operational states inside the conversation.
- Decision-oriented response structure for strategic questions; concise answers for simple ones.
- Persistent work tray / conversation-to-project linkage with full provenance.

### 2. Creator Profile, Context & Preferences
- Editable “What the Brain knows / Context used” inspector (source, confirmation, freshness).
- Strict separation: facts, preferences, goals, hypotheses, temporary instructions, performance findings.
- Layered preference precedence (creator → channel → series → project → one-off) with explicit conflict resolution.
- Corrections become reviewable proposed updates with examples; never silent permanent rewrite.
- Style learning from approved examples/edits, presented for approval before promotion.
- Production-aware context (time, budget, equipment, capacity, accessibility, cadence).
- Privacy/retention controls and “don’t use for personalization” vs “delete” distinctions.
- Time-bound goals and temporary strategy overrides that auto-expire or require review.

### 3. Analytics-Connected Reasoning
- Single analytics scope contract (channel, population, format, metric, filters, window, timezone, freshness) exposed in every answer.
- Deterministic calculations routed through existing statistics code; model interprets results.
- Comparable-video cohort builder + enforced comparability checks before any ranking.
- Diagnostic decomposition trees (impressions, CTR, retention, traffic, audience, packaging, timing) with supported/plausible/contradicted/untestable labels.
- Chart ↔ chat handoffs that pass exact selection and observations.
- Freshness & missing-data preflight; never treat missing as zero.
- Saved analytical questions that can be refreshed.

### 4. Evidence Quality & Explainability
- Claim-level evidence attachments with observations, calculations, source, freshness, limitations.
- Visible evidence-state labels: measured, calculated, creator-provided, inferred, hypothesis, stale, missing, conflicting.
- Contradiction queue/resolver; surface conflict and propose resolving experiment.
- Task-dependent freshness and answerability gate (bounded hypothesis + smallest next step when evidence insufficient).
- Instruction-boundary protection: retrieved content is evidence only.
- Flag and preserve original snapshot when evidence behind an active recommendation changes.

### 5. System Prompts, Model Governance & Routing
- Readable prompt-context preview / assembly debugger.
- Versioned prompt families by capability sharing common safety/evidence rules; record exact version + model.
- Task-specific context budgets and readiness gates.
- Prompt-change evaluation gates and regression suites from real creator scenarios.
- Permission-safe tool instructions kept outside natural-language prompts.
- Capability-, cost-, and quality-aware model routing; deterministic code for calculations.
- Controlled rollback of prompt families.

### 6. Learning Loops & Evaluation
- Complete recommendation lifecycle with stable identities; missing links stay visible.
- Structured rejection/acceptance reasons that influence future proposals differently.
- Reviewable learning-candidate inbox (examples, counterexamples, scope, expiry); require approve/reject/narrow/defer.
- Strict separation of preference learning from performance learning.
- Prediction ledger (expected direction, metric, window, uncertainty) compared with actual results.
- Conditional, reversible, time-aware lessons with expiry and supersession.
- Separate usefulness metrics (accuracy, acceptance, execution success, attributable outcomes).

### 7. Content Ideas & Strategic Planning
- Ideas from explicit opportunity gaps with clear “why this channel now”.
- Evidence-backed brief for every idea (problem, promise, evidence, format, fit, effort, uncertainty, hypothesis).
- Duplication / topic-overlap detection against published, scheduled, active, and rejected work.
- Portfolio-level planning balanced against real capacity; honest exploitation-vs-exploration trade-offs.
- Idea-to-experiment promotion into scoped ContentBuild with hypothesis and evaluation checkpoints.
- Comment-to-content pipelines that preserve source comments and avoid over-weighting small vocal groups.

### 8. Content Generation & Asset Continuity
- All generation consumes the same approved, versioned creative brief; warn on older revisions.
- Cross-artifact promise consistency checks (title ↔ thumbnail ↔ opening ↔ script ↔ description ↔ video).
- Source-backed factual review pass; creative embellishment kept separate from factual assertion.
- Dependency-aware / surgical regeneration; preserve approved sections and show diffs.
- Full generation lineage (inputs, brief revision, prompt version, model, operation ID, edits).
- Production-feasibility checks against available assets, equipment, budget, permissions, capacity.
- Editable generation checkpoints (brief → outline → sections → assembly → final).

### 9. Publishing Package Sets
- Package as one coherent, versioned set (video, title, thumbnail, description, captions, chapters, destination, schedule).
- Variants carry explicit experimental identity and hypotheses; never mix unrelated pieces silently.
- Package readiness validator (required assets, metadata, rights, captions, destination rules, constraints).
- Exact approved-package snapshot frozen at approval; consequential change invalidates approval.
- Publication-to-package reconciliation and recoverable failure conversations (idempotency preserved).
- Package identity carried through later analytics for correct attribution.

### 10. Post-Publish Intelligence, Reliability & Control
- Scope-aware post-launch reviews at comparable video-age windows.
- Separation of content-quality changes from distribution/exposure changes; competing explanations when attribution is uncertain.
- Creator-controlled action budgets separate from external publishing permissions.
- Cross-system health / readiness view answering “Why can’t you do this?” with concrete dependencies.
- End-to-end trace explorer as a projection over existing records.
- Recoverable long-running operations with checkpoints, partial results, and safe retries.
- One certified end-to-end creator journey as the acceptance test for the whole system.

### 11. Immediate / Existing-System Quick Wins
*(See Section 2 for the full implementation prompt. Highest-leverage first.)*

### 12. User-Facing AI Brain Page & Interaction Design
- Clear destinations: Chat / Capabilities / My Brain / Controls.
- Persistent context-and-permissions bar that is inspectable and impossible to miss.
- Quick-settings drawer for everyday toggles with plain-language “What changes?” explanations.
- Fully accessible controls (names, focus, hit targets, readable text, no color-only status).
- Predictable save/reset/inheritance with “Unsaved changes”, sticky actions, and announced status.
- Searchable, categorized capability/prompt browser with favorites, recent, requirement labels, preview-before-send.
- Improved composer: multiline, Stop, Retry, Edit & resend, Copy, Open output, “New response” indicator, draft preservation.
- Informative, recoverable feedback actions with clear consequences and undo paths.
- Editable “What the Brain knows about me” manager (facts, preferences, goals, temporary instructions, proposed learning).
- Single review-and-activity center with prepared / approved / executed / verified states.
- Plain-language readiness panel with direct next-action links.

---

## 4. Recommended Prioritization

**Phase A — Foundations that unlock everything else**  
Visible working scope · Claim-level evidence · Exact package approval snapshots · Recommendation-to-outcome lineage · Shared versioned creative briefs.

**Phase B — Immediate existing-system wins (Section 2)**  
Exact message preservation · Question-specific evidence · Readiness display · Review-only handoffs · Clean history · Statistics routing.

**Phase C — UI clarity and accessibility (Category 12)**  
Context strip · Accessible controls · Predictable settings · Capability browser · Composer improvements.

**Phase D — Acceptance test**  
One fully verified end-to-end journey: question → inspect evidence → approve idea → generate assets → assemble package → approve publication → review outcomes → accept/reject learning candidate, with stable identities and provenance throughout.

---

## 5. Key Existing Systems to Reuse (never replace)

| Area | Primary owners / functions |
|------|---------------------------|
| Conversation & turns | beginAIBrainTurn, completeAIBrainTurn, resumeAIBrainThread, conversation store |
| Evidence | buildAIBrainEvidencePack, AIBrainEvidencePack, BrainAnalyticsEvidence, buildAnalyticsEvidenceExplanation |
| Creator context | CreatorContextResolver, CreatorContextEnvelope, inferredProfile, questionAnswers |
| Diagnostics / readiness | buildVtSyncDiagnosticsSummary, sourceStatuses, availableMetrics, missingInputs |
| Capabilities & routing | BrainCapabilityRegistry, resolveAIBrainToolRoute, AIBrainChatHandoff, BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS |
| Learning | captureAIBrainLearningEvent, listAlgorithmLearningCandidatesForReview, reviewAlgorithmLearningCandidate |
| Runtime / receipts | BrainRuntimeSnapshot, ToolReceipt records, ContentBuild data |
| Formatting | formatCreatorGrowthModules, response modes, intent classification |

---

## 6. Non-Goals (explicit)

- No second BrainRuntime or parallel memory / analytics / package store.
- No invented confidence scores presented as calibrated probabilities.
- No silent promotion of learning candidates to durable knowledge.
- No auto-execution of external publishing or account-changing actions from chat.
- No treatment of retrieved content (comments, transcripts, web pages) as instructions.
- No generic filler modules forced onto every response type.

---

## 7. How to Use This Document

| Need | Go to |
|------|-------|
| Implement the 19 quick wins right now | Section 2 (full prompt) |
| Prioritise larger Brain work | Sections 3 + 4 |
| Write or update a skill / agent instruction | Sections 1, 5, 6 + the skill file |
| Review a PR for correctness | Sections 1, 5, 6 and the acceptance criteria in Section 2 |
| Onboard a new engineer to AI Brain direction | Entire document, especially Sections 1 and 4 |

---

*Last consolidated from the multi-set idea corpus and the Section 11 quick-win optimization pass. Treat this file as the living master resource; update it when new prompt families or quick wins are approved.*
