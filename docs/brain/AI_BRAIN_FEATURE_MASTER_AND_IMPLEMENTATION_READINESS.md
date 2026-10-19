# AI Brain Feature Master & Implementation Readiness

**Status:** Living product/engineering roadmap; implementation status must be re-verified against the target branch before each release decision.  
**Last updated:** 2026-10-19  
**Target integration branch:** `master/consolidated-feature-integration`  
**Scope:** Creator-facing AI Brain, chatbot, context/evidence, analytics, capability discovery, handoffs, evaluation, and governed learning.  
**Purpose:** Keep one prioritized feature map with value, readiness, code footholds, acceptance criteria, risks, and verifiable implementation state.

> **Status discipline:** A feature being discussed, implemented on a branch, or merged is not equivalent to being certified. Record the exact PR/commit, target branch, tests, known failures, and runtime proof. Ratings below are planning judgments, not measured product metrics.

## 1. Product north star

The AI Brain and its chatbot should behave as one evidence-aware creator system. The user should be able to ask a question or request an action, understand what context and evidence were used, discover what Brain can do, move work into the correct product tool, review/approve side effects, and later connect the outcome to evaluation and governed learning.

Canonical flow:

```
Creator request
  → task/intent classification
  → scoped creator + channel + project context
  → evidence requirements and evidence retrieval
  → BrainRuntime / specialist capability
  → response, artifact, or typed ActionPacket
  → destination tool + explicit creator approval where needed
  → ToolReceipt / GenerationRecord / BrainTrace
  → measured outcome and evaluation
  → learning candidate
  → governed promotion to Channel Knowledge
```

### Non-negotiable architecture rules

- BrainRuntime remains the shared creator-facing intelligence entry point; do not create a parallel general-purpose Brain.
- Analytics truth comes from canonical analytics owners (including `analytics-canon` / VT-SYNC), not model-invented numbers or feature-local analytics stores.
- Context must preserve channel, project, content, time-window, freshness, and permission scope.
- Missing evidence is not zero. Distinguish observed, calculated, user-provided, inferred, estimated, stale, missing, and conflicting evidence.
- A suggested action or handoff never silently authorizes a publish, external mutation, or other consequential side effect.
- A generated response is not proof that a capability executed. Execution claims require a receipt or equivalent trace.
- Creator preferences and measured performance outcomes are different evidence classes.
- Learning is a candidate until validation, policy checks, and any required creator confirmation permit promotion.
- Prefer existing canonical registries, context brokers, receipts, and domain owners over duplicate systems.

## 2. Rating rubric

Ratings use a 1–5 scale.

**Power / creator value**
- **5:** foundational or high-leverage capability with cross-system impact.
- **4:** strong workflow improvement or important reliability/accessibility layer.
- **3:** useful capability with bounded scope.
- **2:** polish or niche improvement.
- **1:** low-impact / defer.

**Readiness**
- **5:** implemented, covered by meaningful tests, and verified in the target environment.
- **4:** strong canonical code foothold; remaining gaps are bounded.
- **3:** partial implementation or integration/testing gaps remain.
- **2:** significant architecture, ownership, or evidence gaps.
- **1:** concept only / insufficient verified foothold.

Readiness is conservative. A rating does not replace per-feature status or verification evidence.

## 3. Consolidated feature portfolio

| ID | Feature family | Power | Readiness | Intended outcome | Primary dependencies |
| --- | --- | ---: | ---: | --- | --- |
| F01 | Shared, task-specific context | 5 | 4 | Brain uses the right creator/channel/project/content context for the request, with visible scope and freshness. | BrainContextBroker / Context Resolver, Channel Profile, Projects / ContentBuild |
| F02 | Evidence provenance and answer explainability | 5 | 4 | Users can inspect what evidence supports an answer, what is missing, and why confidence is limited. | analytics-canon, evidence contracts, BrainTrace |
| F03 | Intent-aware response and output contracts | 4 | 4 | Requests resolve into useful response modes and typed outputs rather than generic chat-only replies. | BrainRuntime, task profiles, output schemas, validators |
| F04 | Capability discovery and launch | 5 | 3 | Users can find supported Brain capabilities, understand prerequisites, and launch/edit a capability request. | BrainCapabilityRegistry, evidence requirements, prompt library, BrainRuntime |
| F05 | Request-specific analytics reasoning | 5 | 3 | Analytics answers use deterministic metrics, relevant comparisons, scope checks, and honest data limitations. | analytics-canon, Statistics Intelligence, evidence resolver |
| F06 | Conversation integrity and continuity | 5 | 3 | Conversation history, follow-ups, selected context, and task identity remain coherent across Brain surfaces. | BrainConversationController, shared conversation state, identity/trace |
| F07 | Accessible and predictable controls | 4 | 3 | Keyboard, screen-reader, touch, focus, saving, and reset behavior are understandable and reliable. | Brain workspace, launchpad, Brain Hub controls, shared UI primitives |
| F08 | Typed receipts and safe handoffs | 5 | 3 | Suggestions and generated work move to destination tools with stable identity, provenance, preconditions, and approval boundaries. | ActionPacket, ToolReceipt, GenerationRecord, BrainTrace, destination owners |
| F09 | Creator profile and governed personalization | 5 | 3 | Creator-confirmed preferences and permitted memory improve relevance without silently promoting guesses. | Channel Profile, Channel Knowledge, personalization controls, privacy policy |
| F10 | Project / ContentBuild lifecycle grounding | 5 | 3 | Brain knows whether work is ideation, production, review, packaging, publishing, or post-publication analysis. | Projects, ContentBuild identity, phase resolver, context broker |
| F11 | Content idea and generation quality | 5 | 3 | Ideas and generated content fit creator goals, audience, format, evidence, and downstream package requirements. | prompt authority, context/evidence, asset generation, validators |
| F12 | Publishing package and destination integration | 5 | 3 | Brain-generated work can become a reviewable package with metadata, tags, playlist/category, schedule, and approval state. | Publishing Package, Publisher, Metadata Master, PublishTransaction |
| F13 | Outcome attribution and evaluation | 5 | 2 | Published content outcomes can be linked to the originating idea, generation, recommendation, and evidence. | stable IDs, analytics-canon, BrainOutcomeLedger, evaluation owners |
| F14 | Governed learning loop | 5 | 2 | Validated outcomes and explicit creator feedback produce auditable learning candidates, not automatic unverified rules. | Channel Knowledge, evaluation, promotion gates, freshness/decay policy |
| F15 | End-to-end observability and reliability | 5 | 3 | Every important request/action can be diagnosed across prompt, model, context, evidence, output, handoff, receipt, and outcome. | BrainTrace, GenerationRecord, ToolReceipt, health checks, tests |

These ratings are initial prioritization estimates. Re-score after inspecting the exact target-branch code and running the relevant contracts.

## 4. Code footholds and source-of-truth map

Use these canonical footholds first; verify their current location and consumers before changing behavior.

| Concern | Known foothold / authority | Change rule |
| --- | --- | --- |
| Brain UI and chat orchestration | `src/views/AIBrainCommandInterface.tsx` | Keep prompt selection, context presentation, composer behavior, and capability discovery integrated with the shared Brain flow. |
| Capability definitions | `src/services/brain/BrainCapabilityRegistry` | Extend the canonical registry; do not create a second capability catalogue. |
| Capability evidence contracts | `BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS` in the capability registry | Surface requirements as guidance, but runtime execution must still validate actual evidence. |
| User controls | `src/services/brain/BrainUserControls` | Preserve channel scoping, defaults/inheritance, and explicit permission boundaries. |
| Engine controls | `src/services/brain/BrainEngineControls` | Do not conflate engine configuration with user consent or feature permissions. |
| Conversation history | `src/services/brain/BrainConversationController` and `buildBrainConversationHistory` | Reuse the shared conversation path; test continuity across all consuming surfaces. |
| Brain dashboard controls | `src/views/dashboard/widgets/BrainHubWidget.tsx` | Show saved state and inherited/default behavior accessibly; do not imply persistence before it succeeds. |
| Context and evidence | BrainContextBroker / Context Resolver, analytics-canon, Channel Profile, Channel Knowledge | Use canonical scope, freshness, provenance, and permission contracts. |
| Trace and handoffs | BrainTrace, ActionPacket, ToolReceipt, GenerationRecord | Carry stable IDs across system boundaries and distinguish recommendation from execution. |
| Project grounding | Projects / ContentBuild and phase resolver | Preserve project/contentBuild identity; avoid parallel project memory. |
| Prompt authority | `docs/brain/VIEWTUBE_PROMPT_SYSTEM_AUTHORITY_2026-09-24.md`, prompt registry and improvement program | Version material prompt changes and retain output contracts and validators. |
| Cross-system architecture | `docs/brain/UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md` and domain authorities | This feature master is a roadmap, not a replacement for bounded architecture authorities. |

Additional AI orientation: `docs/brain/VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md`. Its phase-D notice says that it is superseded as current architecture authority by `docs/domains/BRAIN.md` for creator-facing architecture and by Conversation OS / Crown / Task Authority for repository-work continuity. Respect those boundaries.

## 5. Implementation shortlist

Work in dependency order; avoid polishing downstream surfaces before the shared context/evidence/identity contracts are sound.

1. **F01 — Context correctness:** verify task-specific context selection, project/channel scoping, freshness, and context visibility across Brain surfaces.
2. **F02 — Evidence explainability:** show provenance and missing-data caveats; ensure the UI does not overstate evidence quality.
3. **F03 — Intent and output contracts:** classify common request modes and validate structured outputs before presenting them as completed work.
4. **F04 — Capability discovery:** make the canonical capability registry searchable, show evidence prerequisites, and route requests through BrainRuntime.
5. **F05 — Analytics grounding:** use deterministic canonical metrics, compare like-for-like scopes, and test missing/stale/conflicting data.
6. **F06 — Conversation continuity:** prove follow-up turns retain intended context and task identity across full workspace, launchpad, and dashboard surfaces.
7. **F07 — Accessible controls:** verify keyboard navigation, screen-reader announcements, touch targets, save/reset states, and channel-scoped inheritance.
8. **F08 — Receipts and handoffs:** establish stable identity, destination preconditions, approval boundaries, and auditable success/failure receipts.

The remaining F09–F15 families follow once these foundations are reliable, with parallel work allowed only where ownership and dependencies are explicit.

## 6. Roadmap and status tracking

### Phase A — Trustworthy interaction foundation
- F01 shared context
- F02 evidence provenance
- F03 intent-aware outputs
- Exit gate: context and evidence scope are inspectable; missing data is explicit; response modes have tests and deterministic validation where appropriate.

### Phase B — Discoverability and interaction integrity
- F04 capability discovery
- F06 conversation continuity
- F07 accessible controls
- Exit gate: capabilities come from the canonical registry; cross-surface follow-ups retain identity; keyboard/screen-reader/touch behavior is verified.

### Phase C — Grounded analytics and action lineage
- F05 request-specific analytics
- F08 typed receipts and safe handoffs
- Exit gate: analytics derive from canonical metrics; generated/suggested work is distinguishable from executed work; approvals and side effects are explicit.

### Phase D — Creator workflow integration
- F09 personalization
- F10 Project / ContentBuild grounding
- F11 content generation quality
- F12 publishing package integration
- Exit gate: creator controls, project identity, generation provenance, and publication approval survive the end-to-end workflow.

### Phase E — Outcomes and compounding improvement
- F13 outcome attribution
- F14 governed learning
- F15 end-to-end observability
- Exit gate: published outcomes resolve to their originating work, evaluation can abstain on insufficient evidence, learning promotion is governed, and traces allow diagnosis.

### Per-feature tracking template

For every feature, maintain:
- status: `planned | claimed | in_progress | blocked | partial | implemented_branch | merged_non_target | merged_target_unverified | verified_target | certified`;
- owner and canonical subsystem;
- target branch and audited base SHA;
- implementation branch, PR, and head/merge SHA;
- changed files;
- tests run and exact pass/fail result;
- runtime evidence;
- known baseline failures and new regressions;
- next concrete step;
- acceptance gate and completion date.

Never mark `verified_target` or `certified` from a merged PR alone.

## 7. F06 / F07 implementation identity reconciliation

The implementation work performed on 2026-10-19 is recorded in PR [#621](https://github.com/viewtube-dev/viewtube/pull/621), which GitHub now reports as **merged** into `master/consolidated-feature-integration`.

PR #621's implementation title and body label:
- “F06 accessible controls” — prompt-library filtering/accessibility, composer announcements and labels, saved control status, and inherited defaults.
- “F07 capability launcher” — searchable capability browser using the existing registry, readiness states, evidence requirements, and ask/edit prompt actions.

This differs from the portfolio mapping in this document, where **F06 = conversation integrity**, **F07 = accessible controls**, and **F04 = capability discovery and launch**. Do not silently rewrite either history. Reconcile the labels by auditing the original feature brief and PR diff, then update this section and the affected statuses. For now, record the delivered scope as:
- **Accessible controls:** implementation merged in PR #621; certification remains blocked on CI/source-governance contracts until rerun and reviewed.
- **Capability browser/launcher:** implementation merged in PR #621; belongs conceptually to F04 under this portfolio.
- **Conversation integrity:** F06 acceptance is not proven by PR #621 alone and requires its own continuity tests.

PR #621 verification snapshot in its description: production build, local smoke checks, and Brain quality loop passed. Static typecheck and focused/source-governance contracts reported failures associated with Studio control exports and confirmed-library-layout expectations; later CI was still running at the time of that description. Recheck current workflow state before treating the work as certified.

## 8. Cross-system acceptance criteria

A release is not complete until applicable criteria are proven:

### Context and evidence
- Request uses the correct channel, project, content, and time-window scope.
- Evidence includes source/identity, freshness, and confidence or evidence state where applicable.
- Missing, stale, conflicting, and insufficient data are explicit and are never converted to fabricated zeroes.
- Deterministic metrics are computed by canonical domain code, not invented by the language model.

### Interaction and capabilities
- Prompt search/category filters work, including empty results and keyboard operation.
- Capability names/descriptions/intents are searchable; prerequisites and permission blocks are clear.
- Sending a capability prompt uses the shared Brain path and does not falsely report that execution occurred.
- Enter-to-send is IME-safe; labels, focus, live announcements, and target sizes are verified.
- Save/reset controls describe actual persisted state and correctly honor channel scope/inherited defaults.

### Identity, actions, and publishing
- Stable project, ContentBuild, asset, generation, and recommendation IDs survive handoffs.
- Suggested action, prepared payload, approved action, executed action, and verified result are distinct states.
- Publishing and external mutations remain behind explicit approval and canonical transaction owners.
- Tool receipts record success/failure and relevant side effects; failures remain visible and retryable where safe.

### Outcomes and learning
- Outcomes link to the exact originating content and generation/recommendation when identity exists.
- Evaluation compares equivalent scopes and can return insufficient evidence.
- Creator-confirmed preference is not conflated with inferred preference or measured performance.
- Learning candidates require evidence and policy gates; promotion is traceable, reversible where possible, and subject to freshness/decay rules.

### Reliability and regression control
- Unit/contract tests cover positive, negative, missing-data, permission-denied, stale-data, and failure cases.
- Typecheck, lint/runtime governance, focused contracts, production build, and relevant integration tests are run and recorded.
- Existing baseline failures are identified separately from regressions introduced by the feature.
- A browser/runtime smoke check verifies the actual user flow on the intended target deployment when applicable.

## 9. Risk register

| Risk | Impact | Mitigation / required proof |
| --- | --- | --- |
| Duplicate feature IDs or roadmap drift | Work is implemented under the wrong acceptance gate or omitted from the plan. | Reconcile F04/F06/F07 labels against the original brief and keep a visible migration note. |
| UI implies a capability executed | Users trust an unexecuted or unsupported action. | Separate “available to request” from “executed”; require runtime confirmation/receipt. |
| Generic or oversized context | Irrelevant evidence, token waste, cross-project leakage. | Task-specific retrieval and explicit scope/freshness tests. |
| Model-invented analytics | Misleading creator decisions. | Canonical deterministic calculations and no-data tests. |
| Permission and inheritance ambiguity | Unauthorized data use or confusing controls. | Channel-scoped controls, inherited-default actions, and accessible saved-state announcements. |
| Broken identity across tools | Outcomes cannot be attributed; learning is unreliable. | Stable IDs and end-to-end identity assertions across ActionPacket/GenerationRecord/ToolReceipt/BrainTrace. |
| Learning from noise or stale outcomes | Regressions become durable creator guidance. | Evidence thresholds, evaluation, freshness/decay, promotion gates, and audit trail. |
| Merged code mistaken for certified code | Regressions reach production. | Record CI state and target-branch/runtime evidence; distinguish merged from verified/certified. |

## 10. References

- [AI Systems Master Resource](./VIEWTUBE_AI_SYSTEMS_MASTER_RESOURCE.md)
- [Unified AI System Canonical Consolidation Contract](./UNIFIED_AI_SYSTEM_CANONICAL_CONSOLIDATION_CONTRACT_2026-09-17.md)
- [Prompt System Authority](./VIEWTUBE_PROMPT_SYSTEM_AUTHORITY_2026-09-24.md)
- [Prompt Improvement Program](./VIEWTUBE_PROMPT_IMPROVEMENT_PROGRAM_2026-09-24.md)
- [Asset Engine Canonical Backbone](./ASSET_ENGINE_CANONICAL_BACKBONE.md)
- [Universal Tool Handoffs and Suggested Chains](./UNIVERSAL_TOOL_HANDOFFS_AND_SUGGESTED_CHAINS.md)
- [F06/F07 implementation PR #621](https://github.com/viewtube-dev/viewtube/pull/621)

## 11. Change log

| Date | Change |
| --- | --- |
| 2026-10-19 | Consolidated the AI Brain feature portfolio, 1–5 power/readiness ratings, code footholds, implementation shortlist, phased roadmap, cross-system acceptance criteria, and risk register. Added explicit F04/F06/F07 identity reconciliation for PR #621; no implementation is certified solely because its PR merged. |
