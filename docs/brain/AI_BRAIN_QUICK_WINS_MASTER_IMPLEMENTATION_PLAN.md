# ViewTube AI Brain Quick Wins — Master Implementation, Evidence & UX Plan

**Status:** Proposed execution plan  
**Repository:** viewtube-dev/viewtube  
**Target branch:** master/consolidated-feature-integration  
**Scope:** The 19 immediate quick wins plus bounded, high-value additions  
**Architecture rule:** Extend existing owners and runtime only. No new database, parallel memory store, Brain runtime, or analytics engine.

## 1. Executive direction

Deliver the 19 changes as focused commits in dependency order, with shared provenance and UI patterns. Preserve raw input, reuse existing evidence/context/trace/receipt owners, and make every interface a faithful projection of canonical state.

The goal is an answer that shows what it used, what it could not access, what it did, what it saved, and how the creator can correct it.

### Quality invariants

1. Raw input is immutable. User-authored text used for learning, evidence matching and follow-up resolution is preserved exactly.
2. No unsupported claims. Numerical and readiness claims require canonical data/calculations; missing data is named.
3. Evidence is turn-bound. The UI shows only evidence supplied to the model for that turn. Persist canonical IDs and resolved cohort so later links remain stable.
4. Canonical ownership wins. Reuse BrainRuntime, traces, capability registry, CreatorContextResolver, analytics-canon/VT-SYNC diagnostics, ContentBuild, ToolReceipts, learning governance and conversation storage.
5. Approval boundaries remain explicit. Tool handoffs never imply publish approval; approval-for-review never promotes durable knowledge.
6. Restoration and routing are protected. Preserve turn identity, history filtering, tool-route semantics and existing restore/handoff behavior.
7. Accessible by default. Keyboard operation, visible focus, semantic labels, status announcements, touch-sized controls, reduced motion and responsive layouts.
8. No fake status. Never invent confidence, readiness, receipts, model identity, metrics or operation success.
9. Test before implementation. Add a failing regression test for each behavior change, then implement the smallest passing diff.
10. Commit evidence. Each commit maps to numbered items, tests, source owners and acceptance results.

## 2. Workstream map

| Workstream | Items | Outcome |
|---|---:|---|
| Input integrity and conversation hygiene | 1, 13 | Exact user text and clean, bounded model history |
| Evidence selection and numerical safety | 2, 4, 14 | Request-aware cohort, readiness gates, real calculations |
| Answer transparency | 3, 12, 16 | Based on, claim-level evidence, production provenance |
| Creator context and profile truth | 5, 6, 11 | Actionable coverage, no redundant questions, context drawer |
| Recovery and safe operations | 7, 8, 17, 18 | Safe retry, review-only handoff, truthful output/package cards |
| Learning governance and relevance | 9, 10, 15, 19 | Receipts, intent-aware answers, shortcuts, review queue |

## 3. Ordered implementation plan

Follow the required order because it prioritizes data integrity and evidence safety before UI expansion.

### Wave A — Integrity foundations (items 1 and 13)

**1. Preserve exact creator words**
- Inspect sanitizeCreatorFacingBrainCopy(), beginAIBrainTurn(), turn record types and learning capture.
- Store rawUserMessage unchanged; derive optional displayUserMessage only for presentation.
- Feed raw text to learning capture, evidence matching, follow-up resolution and intent decisions.
- Test the literal words “failed”, “error”, and “API” through persistence and learning-event capture.
- Older records without rawUserMessage should read their existing message field without rewriting history.

**13. Clean model history**
- Apply one canonical visible-conversation source filter in both controller and history builder.
- Exclude feedback, journal, quick-action and intake records from model history when they are not visible conversation turns.
- Keep a bounded, relevance-ranked window of recent project decisions within the current context budget.
- Preserve chronology and stable turn IDs. Test restore, exclusions, truncation and project-decision retention.

**Gate A:** raw text survives storage and learning; hidden/background records cannot leak into model history; conversation restore passes.

### Wave B — Evidence and numerical truth (items 2, 4, 14)

**2. Request-aware evidence selection**
- Add lightweight EvidenceRequestSpec: count, format, date range, ranking metric and filters.
- Parse explicit prompt-card constraints before free text; do not guess ambiguous windows or ranking semantics.
- Select from existing synced inventory; do not re-query if a suitable inventory snapshot exists.
- Persist the resolved cohort on the turn and use it for all later evidence links.
- Return fewer results when needed and state the shortfall in the readiness summary.

**4. Readiness before analytics advice**
- Build readiness only from buildVtSyncDiagnosticsSummary(), sourceStatuses, availableMetrics and missingInputs.
- Attach the same structured state to model input so unavailable revenue or stale traffic cannot become fabricated diagnosis.
- Make the readiness chip open a detail panel listing dataset, freshness, available metrics and missing inputs.
- If diagnostics are absent, show “Readiness unavailable” rather than inferring green status.

**14. Route numerical questions through statistics capabilities**
- Route numeric/comparative questions through existing statistics-intelligence / analytics-diagnosis capabilities.
- Enforce BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS before calculation.
- Use canonical calculation output as structured answer data, not a model paraphrase.
- Missing inputs return a precise “I don’t have X data for this calculation” response.
- Store the calculation/output reference for evidence navigation.

**Gate B:** constraints work; cohort is stable; missing inputs constrain generation; every displayed number has a canonical calculation or source.

### Wave C — Evidence transparency (items 3 and 12)

**3. Compact Based on section**
- Render only when the turn has a real evidence pack.
- Use AIBrainEvidencePack.items and evidenceIds captured for that exact turn.
- Show 3–5 relevant items initially, with keyboard-operable expansion.
- Preserve video, search-term, traffic-source or calculation IDs and original filters in destination routes.
- Never substitute a similar-looking source that was not included in model context.

**12. Claim-level analytics evidence**
- Integrate buildAnalyticsEvidenceExplanation() only after checking production reachability and canonical ownership.
- Strip numerical confidence placeholders such as 0.85/0.6; show measured coverage and missing inputs only.
- Attach evidence control to the specific claim/card it supports.
- Avoid duplicating the answer-level evidence panel.

**Gate C:** UI evidence exactly matches model-supplied evidence; every reference resolves; filters survive navigation.

### Wave D — Context and creator profile (items 11, 5, 6)

**11. Context strip and Context used drawer**
- Reuse CreatorContextResolver.ts and the current CreatorContextEnvelope.
- Show Channel → Project → ContentBuild → selected video/asset with explicit empty states.
- Allow clearing and locking supported selections without unintended canonical mutations.
- Drawer lists exact envelope items used in the answer and labels each confirmed, inferred or temporary.
- Corrections enter existing learning/governance flow with source ID and scope.

**5. Replace profile confidence score**
- Remove arbitrary 0–1 score from creator-facing UI.
- Derive concrete coverage rows from inferredProfile, saved question answers and capability status.
- Display only checklist entries relevant to the current answer.
- Incomplete entries link to real confirmation/correction actions.

**6. Stop re-asking answered questions**
- Reconcile saved questionAnswers inside answerAIBrainQuestionModule() for chat and onboarding.
- Treat prior answers as valid unless marked outdated, contradicted by newer evidence, or explicitly reopened.
- Add “You previously said…” with correction affordance when reused.
- Record why a value was invalidated; do not silently discard conflicts.

**Gate D:** no duplicate question when a valid answer exists; context sources are inspectable; corrections use canonical paths.

### Wave E — Relevance and recovery (items 10 and 7)

**10. Intent-aware growth modules**
- Refine formatCreatorGrowthModules() without replacing response modes.
- Factual questions receive direct answers; diagnosis receives evidence and caveats; asset requests receive the asset; strategy/planning may include growth modules.
- Test the intent matrix so generic “Why This Is Happening” / “30-Day Goal Path” sections are not attached to unrelated requests.

**7. Retry interrupted turns**
- Show Retry this response only for canonical interrupted/retryable turns.
- Retry generation only; do not re-run external side effects or tool actions.
- Link retry attempt to original turn and retain its evidence pack.
- If freshness/context changed, show a precise warning and offer original-context vs fresh-data choice.
- Preserve prior attempt history rather than overwrite the interrupted record.

**Gate E:** intent matrix passes; retry creates a linked generation attempt without side effects; stale data is explicit.

### Wave F — Review-only handoffs, receipts and shortcuts (items 8, 9, 15)

**8. Review-only handoff buttons**
- Reuse resolveAIBrainToolRoute(), AIBrainChatHandoff and the command-action registry.
- Set reviewOnly: true for these buttons.
- Carry selected content ID, evidence IDs, source turn ID and current context.
- Destination displays origin and evidence references. Navigation is not approval or publishing authorization.

**9. Learning/correction receipts**
- Build receipts from captureAIBrainLearningEvent(), learningEntryIds and memoryChanges.
- Distinguish conversation context, learning candidate and confirmed durable knowledge.
- Provide Correct / Reject actions through existing governance.
- A candidate receipt cannot auto-promote itself; show status only when canonical state confirms it.

**15. Capability shortcuts**
- Derive shortcuts from BrainCapabilityRegistry.ts, not a second hardcoded list.
- Support Explain performance, Find patterns in best videos, Suggest search opportunity, One priority and Draft a hook when capabilities exist.
- Show unavailable shortcuts disabled with the real unmet evidence requirement.
- Clicking selects the canonical prompt card and pre-populates the composer; it does not silently submit.

**Gate F:** handoffs remain review-only; receipts are backed by event IDs; shortcut availability follows evidence requirements.

### Wave G — Provenance and truthful results (items 16, 17, 18)

**16. How this answer was produced drawer**
- Read only existing Brain traces and BrainRuntimeSnapshot.ts.
- Show invoked capability IDs, evidence returned/missing, prompt version, actual served model, operation status and output reference.
- No private chain-of-thought or hidden deliberation.
- Provide an accessible control on every completed turn; incomplete turns show only available status.

**17. Result cards backed by ToolReceipts**
- Join generation requests to real ToolReceipt records and output asset IDs already in the snapshot.
- Distinguish Draft proposed, Operation started and Output saved.
- Only show Open output when a canonical output asset is known and navigable.
- Never infer success from assistant prose alone.

**18. Project/package status answers**
- Use only ContentBuild fields exposed by the runtime snapshot.
- Show stage, asset count, selected slots, variant groups, blockers and publication status as available.
- Require an explicit selected project; if absent, ask the creator to select one.
- Publish-ready is true only when the publishing owner's own readiness check passed.

**Gate G:** trace and receipt IDs resolve; model identity comes from serving metadata; output claims match operation state; package status cannot bypass publishing readiness.

### Wave H — Governed learning queue (item 19)

**19. Learning review cards in chat**
- List pending candidates via listAlgorithmLearningCandidatesForReview().
- Render supporting examples, scope, source references and current review state.
- Hold / Reject / Approve-for-profile-review actions call reviewAlgorithmLearningCandidate() exactly.
- Approval for review must not directly update durable creator knowledge.
- Update the card after the canonical action succeeds; preserve decision in conversation history for audit.

**Gate H:** governance tests prove each action; durable profile changes only through the separate governed path.

## 4. Additional high-value improvements

1. **Evidence contract validator:** shared test helper verifies every rendered evidence ID exists in the turn pack and every link has a valid route.
2. **Unified answer-state vocabulary:** normalize user-facing states across answers, retries, receipts and outputs while canonical owners remain authoritative.
3. **Freshness-aware caching:** reuse inventory/cohort on a turn; invalidate only when source version/freshness changes. Original turn evidence stays immutable.
4. **Coverage explanations:** distinguish no data, stale data, unsupported metric, zero-match filter and partial cohort.
5. **Contradiction-aware context:** when saved answers conflict with newer facts, show both source and timestamp and request resolution only when needed.
6. **Trace-based interaction telemetry:** measure evidence expansion, context corrections, retries, shortcut starts and learning-review decisions using existing traces/events.
7. **Accessibility contract tests:** focus order, names/labels, live-region messages, disclosure states, keyboard-only operation and mobile target sizes.
8. **Existing-config kill switches:** disable risky UI surfaces without deleting evidence or mutating turn records.
9. **Golden conversation fixtures:** deterministic factual, diagnostic, numerical, asset, interrupted, learning and project-status conversations.
10. **Provenance integrity report:** count unresolved evidence IDs, missing receipt joins, unsupported numeric claims and absent trace fields.

## 5. Front-end information architecture

### Answer layout
1. Direct, intent-appropriate answer.
2. Readiness chip when analytics/data limitations matter.
3. Claim-level evidence affordance next to supported analytics claims.
4. Compact Based on block with 3–5 real sources and Show all.
5. Context strip and shortcuts where relevant.
6. Turn actions: Retry (interrupted only), Review in tool (when routable), Result (when saved), Learning receipt (when captured), and How this answer was produced.

Do not display empty panels. Keep secondary panels collapsed by default, but never hide a material caveat.

### Context strip
A responsive strip with four canonical slots: Channel, Project, ContentBuild, selected video/asset. Each shows the selected value or explicit empty state. Clear and lock controls require accessible names and keyboard support. Lock holds context selection for later turns; it does not change canonical project ownership.

### Evidence and readiness drawers
- **Readiness:** dataset, status/freshness, available metrics, missing inputs, affected claims and supported next action.
- **Evidence:** source type, canonical ID, title/label, relevant metric/date range, why selected and destination.
- **Context used:** exact envelope entries, origin, confirmed/inferred/temporary state and correction action.
- **Production:** capability IDs, prompt version, actual served model, evidence returned/missing, operation status and output reference; no chain-of-thought.

Use semantic disclosure buttons, aria-expanded, labelled regions, focus restoration on close, Escape support and live announcements for asynchronous results. Respect reduced motion and Studio's stationary-control styling.

### Learning review card
Show candidate summary, source/scope, supporting examples, current state, and Hold / Reject / Approve for profile review. Confirm governance-changing actions when appropriate. After action, update in place from canonical response and announce status to assistive technology.

### Result card
Show saved artifact label, canonical asset ID, destination, version and receipt ID. Derive status from the actual operation receipt. Disable Open output if no canonical destination exists and explain why.

## 6. Suggested focused commit plan

1. brain: preserve raw user turn text — item 1.
2. brain: filter and bound model conversation history — item 13.
3. brain: select evidence from request constraints — item 2.
4. brain: gate analytics advice on data readiness — item 4.
5. brain: route numerical questions through verified statistics — item 14.
6. brain(ui): show turn-bound evidence references — item 3.
7. brain(ui): add claim-level analytics evidence — item 12.
8. brain(ui): expose creator context used by each answer — item 11.
9. brain(ui): replace profile score with actionable coverage — item 5.
10. brain: reconcile saved creator answers before asking — item 6.
11. brain: make growth modules intent-aware — item 10.
12. brain(ui): add safe retry for interrupted turns — item 7.
13. brain(ui): add review-only contextual handoffs — item 8.
14. brain(ui): show governed learning receipts — item 9.
15. brain(ui): derive contextual shortcuts from registry — item 15.
16. brain(ui): expose answer provenance drawer — item 16.
17. brain(ui): show receipt-backed generation results — item 17.
18. brain: answer project readiness from ContentBuild — item 18.
19. brain(ui): add governed learning review cards — item 19.
20. test(brain): cover quick-win surfaces end to end — smoke/regression coverage.

Split further when ownership boundaries or tests justify it. Each commit includes focused tests and avoids unrelated formatting/generated-file churn.

## 7. Test and release gates

### Focused tests
- Raw message exactness and learning-event capture.
- Visible/model history filter and bounded project-decision window.
- EvidenceRequestSpec count, format, date, ranking, no-match and shortfall.
- Readiness-to-prompt constraints; no revenue claim when revenue unavailable.
- Numeric capability routing and canonical calculation payload.
- Evidence pack/UI ID parity and destination-filter preservation.
- Context envelope state and correction path.
- Saved-answer reconciliation and conflict invalidation.
- Intent-to-growth-module matrix.
- Retry linking and no external side effects.
- Review-only handoff metadata.
- Learning receipt source IDs and governance routing.
- Capability shortcut availability from evidence requirements.
- Trace/model/prompt/operation/output provenance.
- ToolReceipt/output asset join and truthful status.
- Project selection and publishing-owner readiness.
- Learning candidate review state and durable-knowledge boundary.

### Required regression suite
Run the repository's actual commands for conversation restore E2E, tool-route/handoff tests, learning-governance tests, focused Brain service/components, typecheck, lint, source-governance contracts and production build. Include keyboard/screen-reader-oriented component checks and a mobile layout smoke test.

Do not claim the full suite passes unless logs confirm it. Record unrelated failures separately and compare with baseline.

### Manual smoke sequence
1. Direct factual question: no generic growth filler.
2. Ranked video cohort with format/date constraints: correct selection and shortfall.
3. Numerical question with missing metric: clear missing-data response, no invented number.
4. Expand Based on: all sources were supplied to that turn and links preserve filters.
5. Inspect readiness and context-used drawers.
6. Interrupt and retry: linked turn/evidence, no side-effect replay.
7. Review-only handoff: origin/evidence IDs visible in destination.
8. Capture correction and review candidate: receipt and governance status, no silent promotion.
9. Generate output: result status matches ToolReceipt and asset ID.
10. Project readiness with and without selected project.

## 8. Ten-document repository index

These documents provide architecture, current-state, evidence and workflow context. Check each document's status and linked source paths before relying on historical recommendations.

1. **AI Brain feature master and implementation readiness** — docs/brain/AI_BRAIN_FEATURE_MASTER_AND_IMPLEMENTATION_READINESS.md  
   Consolidated F01–F15 inventory, priorities and acceptance criteria. Start here for scope alignment.

2. **ViewTube AI Systems master resource** — docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md  
   Living orientation for AI ownership, current work and cross-system boundaries.

3. **Unified AI system canonical consolidation contract** — docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md  
   Canonical integration constraints and phased convergence; prevents parallel runtimes and duplicate ownership.

4. **Brain & AI system report** — docs/VIEWTUBE_BRAIN_AI_SYSTEM_REPORT_2026-10-02.md  
   Current-state assessment and integration opportunities across analytics, research, context, tools, projects, assets and conversation continuity.

5. **Evidence & Intelligence convergence audit** — tasks/system-convergence/EVIDENCE-INTELLIGENCE-AUDIT.md  
   Evidence adapter reachability and donor-candidate findings; important before integrating analytics evidence helpers.

6. **Unfinished Work master resource** — docs/VIEWTUBE_UNFINISHED_WORK_MASTER_RESOURCE_2026-09-11.md  
   Cross-system dependencies, outstanding integration work and known constraints.

7. **100-item current-main unfinished-work audit** — docs/VIEWTUBE_100_ITEM_CURRENT_MAIN_UNFINISHED_WORK_AUDIT_2026-09-25.md  
   Prioritized integration gaps; validate target-branch status before treating an item as open.

8. **Project / ContentBuild / Video Package / Asset Engine consolidation authority** — docs/architecture/PROJECT_CONTENTBUILD_ASSET_ENGINE_VIDEO_PACKAGE_CONSOLIDATION_2026-09-22.md  
   Canonical identity and ownership boundaries for project, package, asset and publication state.

9. **Projects / ContentBuild workflow master resource** — docs/architecture/VIEWTUBE_PROJECTS_CONTENTBUILD_WORKFLOW_MASTER_RESOURCE.md  
   Workflow contracts and handoffs for project/content/asset lifecycle and publishing readiness.

10. **Asset Engine ContentBuild implementation plan** — docs/architecture/ASSET_ENGINE_CONTENTBUILD_IMPLEMENTATION_PLAN_2026-09-20.md  
    Implementation details for ContentBuild-backed assets and package lifecycle. Treat dated status as historical until reverified.

### Backend and UI footholds to verify before editing
- sanitizeCreatorFacingBrainCopy(), beginAIBrainTurn(), turn record types and learning capture.
- buildAIBrainEvidencePack(), synced video inventory, evidence pack types and evidence ID storage.
- buildVtSyncDiagnosticsSummary() in src/services/aiBrainCommandInterface.ts.
- answerAIBrainQuestionModule() and formatCreatorGrowthModules() in src/services/aiBrainConversationStore.ts.
- src/views/AIBrainCommandInterface.tsx for current chat rendering and action surfaces.
- CreatorContextResolver.ts and CreatorContextEnvelope.
- BrainCapabilityRegistry.ts and BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS.
- BrainRuntimeSnapshot.ts, Brain traces, generation records and ToolReceipt joins.
- BrainAnalyticsEvidence and buildAnalyticsEvidenceExplanation(); the evidence audit flags reachability as something to verify before use.
- listAlgorithmLearningCandidatesForReview() and reviewAlgorithmLearningCandidate().
- ContentBuild snapshot and publishing owner's readiness check.
- Existing Studio control primitives, accessible patterns and chat tests.

## 9. Governance and definition of done

Complete only when all 19 behaviors are implemented or explicitly blocked by a verified owner/contract gap; each behavior has focused tests; restore, routing and learning-governance tests pass; new UI is keyboard-accessible and Studio-consistent; claims/actions use canonical data and provenance; and the final PR records commit mapping, test evidence, residual risks and rollback guidance.

A green build alone is not proof of correctness. A UI that looks complete but lacks canonical evidence is not complete. A learning action that bypasses governance is a regression, not an optimization.


## Evidence parity hardening — 2026-10-19

**Verified implementation:** `BrainOrchestrator` selects `promptEvidenceRecords` once from the resolved evidence envelope, builds `BrainEvidenceRecordQuality` from that array, and passes both into `buildBrainContextPack`. The quality report includes the ordered record IDs and evidence fingerprint.

**Gap found during review:** `BrainContextBroker` detected a fingerprint mismatch and described it in the prompt, but still rendered the supplied evidence records. That is not a fail-closed gate: a changed value could remain visible after the grade became stale.

**Verified implementation:** [PR #723](https://github.com/viewtube-dev/viewtube/pull/723) is merged. A missing or mismatched record grade blocks analytics-derived prompt context, with regression coverage for a metric changing after grading. Keep the acceptance criteria below as continuing regression requirements; a merged PR does not by itself certify every broader evidence/UI surface.

**Acceptance criteria:**
- The same selected records are rendered and graded.
- Missing grade with non-empty prompt evidence blocks analytics context.
- Changed value, reordered records, or changed record identity after grading blocks analytics context.
- A valid grade for the exact records preserves normal rendering.
- Tests prove both the valid and fail-closed paths.


## Front-end integration reference — 2026-10-19

The shared evidence-to-UI contract and accessibility guidance now live in [Part 5 of the PR241 Brain brainstorm/front-end design reference](../migration/reference/PR241_VIEWTUBE_AI_BRAIN_BRAINSTORM_AND_FRONTEND_DESIGN_2026-09-12.md#part-5--evidence-first-ui-integration-addendum-2026-10-19). Treat that addendum as the companion UI integration design—not as proof that the proposed components have shipped. The core release gate remains exact parity between the turn's graded evidence records and evidence shown in the UI.


## Front-end integration and audit follow-up — 2026-10-22

The [PR241 Brain brainstorm/front-end design reference, Part 5.9–5.10](../migration/reference/PR241_VIEWTUBE_AI_BRAIN_BRAINSTORM_AND_FRONTEND_DESIGN_2026-09-12.md#59-audit-driven-ui-integration-backlog--2026-10-22) now maps the evidence, context, capability, trace, receipt and learning work to accessible product surfaces. It is an implementation guide, not a claim that every surface is complete.

### Source-grounded findings

- `BrainCapabilityBrowser.tsx` already consumes `BrainCapabilityRegistry`, exposes availability reasons, uses semantic labels/live status and visible keyboard focus. Extend this source of truth; do not create another capability catalog. Dispatch must still re-check requirements.
- `BrainRuntimeSnapshot.ts` contains projections that join requests, ToolReceipts, traces and generation records. Verify each user-facing card consumes these joins and renders canonical IDs; service availability alone does not prove UI wiring.
- `BrainTrace.ts` has the fields needed for user-safe provenance, including evidence returned/missing, output reference and requested/served model identity. Do not imply durable server-side audit retention unless the active sink confirms it.
- `BrainWorkflowRunPanel.tsx` manages workflow step state, but its step status must not be treated as proof of a saved output, ToolReceipt, or publication readiness.
- The latest audit scorecard was static code review. Restore filters, truthful empty states, full capability-bypass coverage, stale-readiness presentation, provenance allowlisting/canonical-ID resolution, receipt-backed result cards and full accessibility walkthroughs remain unverified until tests and/or manual checks provide evidence.

### Next UI delivery gate

1. Add a typed, read-only turn presentation projection from canonical turn/evidence/grade/trace/receipt/output owners.
2. Prove exact ordered evidence parity from model input to each claim ribbon/drawer, including filters, missingness, changed values and unresolved IDs.
3. Ship one accessible analytics claim-to-source vertical slice before applying it across the product.
4. Ship one receipt-backed generation result with truthful proposed/started/saved/failed states.
5. Connect context corrections to the canonical governance path and verify the next-turn result.
6. Run restoration, routing, governance, evidence-golden and accessibility checks; report command/CI evidence rather than treating source presence or a successful build as behavioral proof.

**UI acceptance:** every claim has resolvable evidence or an explicit limitation; every result status is backed by canonical records; every action exposes permission/approval boundaries; and keyboard, screen-reader, narrow-layout, zoom and reduced-motion behavior are verified. No parallel evidence store, profile, receipt ledger, or Brain-only component system is introduced.
