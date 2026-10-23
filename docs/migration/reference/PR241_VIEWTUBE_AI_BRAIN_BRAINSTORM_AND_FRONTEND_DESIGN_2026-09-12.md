> **Historical donor reference — PR #241**  
> Preserved from donor head `031230f0726063bf52895c693da26c06ca6b4264` on 2026-09-24.  
> This document captures a 2026-09-12 point-in-time audit/design state. Its maturity percentages, reachability counts, branch status, provider assumptions and “current” claims are **not current authority**.  
> Use `docs/brain/PR241_DONOR_HARVEST_AUDIT_2026-09-24.md`, current Brain architecture docs, current code, and `docs/architecture/VIEWTUBE_FINISH_PROGRAM_2026-09-24.md` for present status.  
> Valuable requirements and feature ideas are retained below as donor evidence.

# ViewTube AI Brain — Optimization Brainstorm and Front-End Design

**Date:** 2026-09-12
**Status:** Design brainstorm. **No implementation authorized.** Awaiting approval per the brainstorming process.
**Classification:** Architectural (new subsystems + restructuring)
**Companion:** `docs/VIEWTUBE_AI_SYSTEMS_VERIFIED_AUDIT_AND_IMPLEMENTATION_PLAN_2026-09-12.md`

**Decisions taken as input:**
- Brain is **both** a destination and an ambient layer, built in parallel.
- Surfaces serve **creators and operators** (trace/eval/cost tooling is in scope).
- **Autonomy is creator-configurable.** The Brain must ship a settings and control module where each creator sets what it may do on its own, including scheduled generation of community posts and content ideas.

---

## The framing problem

A brain is invisible. Everything valuable about it — what it knows, why it believes something, how sure it is, what it learned, what it did while you were away — has no natural shape on screen.

So the front-end job is not "add a chat window." It is to **externalize five things**:

| What must become visible | Today | Consequence |
|---|---|---|
| What it knows | Nothing | Creator can't correct a wrong belief |
| What it looked at | Nothing | Creator can't tell insight from guess |
| How sure it is, and why | A static chip | Confidence is decorative |
| What it learned from you | Empty UI | Product never feels like it improves |
| What it did on its own | N/A | Autonomy is unsafe without an audit trail |

This framing drives every component proposed below.

There is a second, sharper problem the audit exposed. **The AI currently looks more trustworthy than it is.** Ten of 52 dashboard widgets call `gemini.ts` generators directly with no evidence, no evaluation and no grounding check, and they render with the same visual authority as canonical analytics. Any front-end work that adds polish without fixing grounding widens that gap. This constrains the sequencing recommendation in Part 3.

---

# Part 1 — System optimization ideas

Sixty ideas, grouped. Each is tagged: **[P]** proven practice, **[N]** novel to ViewTube, **[Q]** quick win (< 1 week), **[D]** has a hard dependency.

## 1.1 Evidence and grounding

1. **Evidence Planner** — typed dataset requests per intent, not generic summaries. [P]
2. **Evidence sufficiency preflight** — decide *before* generating whether the question is answerable. [N] Turns the system's biggest weakness into its most trust-building behavior: "I can answer the CTR half of this; I'd need retention data for the rest."
3. **Freshness decay** — evidence carries an age; confident claims degrade automatically as data staleness grows. [N]
4. **Negative evidence as a first-class value** — distinguish "we looked and found nothing" from "we never looked." These are different facts and currently collapse to the same silence. [N]
5. **Evidence diffing** — "since I last looked at this video, traffic sources shifted." [N] Makes returning to the product feel alive.
6. **Claim-level citation** — every numeric sentence carries a hoverable evidence ref, not one citation list per answer. [P]
7. **Evidence gap → action** — every gap renders as a one-click fix (connect a source, run a sync, import a CSV). [N] Converts limitation into onboarding.

## 1.2 Statistics (the model interprets, never calculates)

8. **Deterministic `StatisticsEngine`.** [P][D: Phase 2]
9. **Per-channel expected-range models** — "this is inside your normal band" is far more useful than a raw number. [P]
10. **Change-point detection** — find *when* it shifted, which is what creators actually ask. [P]
11. **Automatic cohort construction** — comparable videos by format, length, topic, age. [P]
12. **Counterfactuals** — "had CTR held at your baseline, this would be ≈ 41K views." [N] The single most persuasive output shape for creators.
13. **Significance gating** — no claim ships on noise. [P] Directly prevents the most common AI-analytics failure: confident narration of randomness.
14. **Seasonality decomposition** — day-of-week and holiday effects separated before anything is called a trend. [P]

## 1.3 Context engineering

15. **Token-based budgeting** with a real tokenizer, replacing character clipping. [Q]
16. **Relevance-ranked retrieval** scored on relevance, authority, freshness, contradiction risk. [P]
17. **Context compaction** — summarize older turns rather than dropping them at `.slice(0,4)`. [P]
18. **Just-in-time retrieval** — model requests more mid-turn. [D: tool loop]
19. **Per-task context recipes** — "diagnose a drop" and "draft a script" need different context shapes; one budget for both is why both are mediocre. [N]
20. **Prompt caching on stable prefixes** — constitution + channel profile are identical across turns. Large, immediate cost reduction. [P][Q]
21. **Scratchpad / structured note-taking** for multi-step reasoning. [P]

## 1.4 Model access and cost

22. **Server-side gateway.** [D: Phase 1] Prerequisite for 23–27 and for all scheduling.
23. **Model routing by task difficulty** — cheap model for tag generation, strong model for strategy. Most spend today is on a mid-tier default for everything.
24. **Report model substitution** — stop silent downgrades. [Q]
25. **Batch mode** for bulk operations (tags for 50 videos), which is dramatically cheaper than 50 calls.
26. **Streaming** for scripts and long reports — perceived latency is most of felt quality.
27. **Per-creator budget with graceful degradation** — degrade to a cheaper model and *say so* rather than failing.

## 1.5 Generation quality

28. **`StyleProfile`** — editable descriptor + 4–5 exemplars + embedding. [D: Phase 3]
29. **Style fidelity scoring and gating.** [N]
30. **Structured outputs everywhere** — markdown blobs cannot be scored, diffed, routed or learned from. [Q per generator]
31. **Multi-draft self-selection** — generate 3, rank against the rubric, present the winner with alternates one click away. [P] Large quality gain for modest cost.
32. **Per-asset-type rubric judges.** [P]
33. **Anti-pattern injection** — include the channel's *underperforming* titles as negative exemplars. [N] Nobody does this; it is cheap and the signal is strong.
34. **Format-aware generation** — shorts, long-form and community posts obey different rules.
35. **Series memory** — episode 12 matches episodes 1–11 in structure and voice. [N]
36. **Production-quality tier** — creator declares their bar (fast/weekly/cinematic) and it changes b-roll density, script detail and shot suggestions. [N] Directly serves "loyal to production quality."
37. **Hook/thumbnail/title co-generation** — generate as a *package* so they reinforce rather than compete. [N]

## 1.6 Learning — the loop that has never run

38. **Write the outcomes.** Both ledgers have zero writers today.
39. **Analytics read-back** at 24h/7d/28d joining published assets to measured performance. [D: Phase 1]
40. **Confidence calibration** — stated vs measured success, adjusted over time.
41. **Contradiction detection and demotion.**
42. **Experiment lifecycle** — hypothesis → intervention → measurement → learning.
43. **Edit-distance learning** — **when a creator edits a generated script, diff it.** [N] That diff is the highest-quality style signal the system can ever obtain: a paired (model output, creator-corrected output) example on the creator's own content. Capturing it costs almost nothing and it is strictly better training signal than any thumbs-up.
44. **Rejection reasons** — when a creator discards a recommendation, capture *why* in one tap. Rejections teach more than acceptances.
45. **Cross-channel pattern mining**, opt-in and privacy-gated — "channels in your niche and size band found X." [D: server]
46. **Recommendation lineage** — stable ID from evidence to outcome.

## 1.7 Tools and actions

47. **~12 semantic tools** rather than 65 exposed functions. [P]
48. **Bounded tool loop** with per-turn call caps recorded in the trace.
49. **Creator-configurable approval tiers.** (See Part 2.7.)
50. **ActionPacket → destination prefill**, completing handoffs.
51. **Wire the handoff inbox** — already written, currently unreachable.

## 1.8 Observability

52. **Durable `BrainTrace`.**
53. **Trace viewer** (operator).
54. **Eval harness**, three grader channels.
55. **Regression gating** as a separate CI check.
56. **Cost and latency dashboards** by feature, model and channel.

## 1.9 Autonomy and scheduling *(from your decision)*

57. **Autonomy policy engine** — a per-action-type permission matrix owned by the creator, not a global setting.
58. **Scheduler** — daily brief, weekly content ideas, community post drafts, anomaly watch. [D: Phase 1 — a closed browser cannot run a schedule]
59. **Draft queue** — autonomous output *always* lands in review; nothing the Brain writes publishes itself unless the creator explicitly enables that per action type.
60. **Frequency caps and quiet hours**, plus a full autonomy audit log with undo.

---

# Part 2 — Front-end design

## 2.1 The organizing metaphor

The Brain gets **one destination** and **one ambient grammar**, and they share components. The destination is where you go to *understand and configure* the Brain. The ambient layer is where the Brain *shows up while you work*.

The grammar — three primitives used identically everywhere — is what stops these from diverging:

```
  ┌──────────────────────────────────────────────────┐
  │  CLAIM          "Browse impressions fell 34%"    │
  │  ├── confidence chip    medium · retention 9d old│
  │  └── evidence ribbon    ▇▇▇▇▇ ▇▇▇ ▇▇ ▇          │
  │                         traffic_day · video_day  │
  └──────────────────────────────────────────────────┘
```

Every AI-produced statement in the product — in a widget, a chat turn, a report, a generated asset — is a **Claim** carrying a **Confidence chip** and an **Evidence ribbon**. You already have `BrainConfidenceChip` and `BrainEvidenceDrawer`; this promotes them from chat-only to universal.

## 2.2 Destination — "The Brain" toolbox

Built on `ToolboxScaffold` per `viewtube-toolbox-builder`, claiming the existing `brain-command-center` super-tool ID. Nine sub-toolboxes:

### ① Conversation
The existing chat, upgraded: inline evidence ribbons, per-claim confidence, a "show your work" expansion revealing the trace in creator-readable form, and surface-awareness ("you were looking at the retention chart for *Video X*").

### ② Channel Mind — *the knowledge base, verbalized*
The typed Channel Profile rendered as an **editable knowledge map**. Sections: identity, niche, pillars, audience promises, formats, creative rules, preferences, goals, baselines, validated patterns, known anti-patterns, current strategic state.

Every fact shows its confidence, source, evidence, age and contradictions. Every fact is **confirmable, correctable or deletable by the creator.**

This is the literal answer to "verbalize their knowledge base and turn it into digestible actionable outputs." It also solves a trust problem no chat interface can: today, if the Brain believes something wrong about a channel, the creator has no way to see or fix it.

*Component idea — the Knowledge Map.* A hierarchical or force-directed map of what the Brain knows, node colour = confidence, red edges = contradictions, dimmed = expiring. Click a node to confirm or correct. Novel, and the single most compelling demo surface in the product.

### ③ Style Studio
The `StyleProfile` editor. Shows the extracted descriptor in plain language ("wry, technical, never hypey; cold opens; no 'in this video'"), fully editable. Shows the 4–5 exemplars with swap controls. Shows fidelity scores on recent generations.

*Component idea — the Style Fingerprint.* A radar over stylometric dimensions (pace, formality, sentence length, vocabulary richness, hook style, density). Overlay "your last 10 videos" against "this draft" as two shapes. Style match becomes instantly legible without reading a number.

*Component idea — Diff-as-teaching.* Creator edits a draft inline; the diff is captured as a style signal with an optional one-tap "why." Editing becomes teaching. (Idea 43.)

### ④ Asset Studio
Unified generation for every asset type — script, short, b-roll plan, image, thumbnail concept, community post, comment reply, topic ideas, title, description, tags, timestamps, education questions.

Three panels: **Evidence** (what this is grounded in), **Style** (which profile, fidelity score), **Output** (variants).

*Component idea — Variant Comparator.* Three drafts side by side with per-dimension rubric scores. The creator's pick is captured as a learning signal, so choosing is training.

### ⑤ Action Board
Ranked actionable tasks — the thing a YouTuber actually wants. Each card: what to do, expected impact, effort, the evidence behind it, confidence. Accept / reject / snooze, with rejection reasons captured (idea 44).

*Component idea — Opportunity Radar.* Impact × effort quadrant view of `OpportunityIntelligence` output, so priority is spatial rather than a list ranking the creator must trust blindly.

### ⑥ Learning Ledger
Currently a UI rendering a permanently empty list. Made real: what the Brain learned, from what, what it got right and wrong.

*Component idea — Impact Cards.* For each past recommendation: predicted vs actual, with the delta. Accountability visible by default.

*Component idea — Calibration Chart.* Stated confidence on one axis, measured success rate on the other, with the diagonal drawn. A product that shows creators where its own confidence is miscalibrated earns more trust than one that hides it.

### ⑦ Autonomy & Controls — *your settings module*
See 2.7. The control room for what the Brain may do alone.

### ⑧ Evidence Explorer
What data the Brain has, freshness per dataset, what's missing, what's blocked by permissions, and one-click connect for each gap.

### ⑨ Activity Feed
"While you were away" — every autonomous action, with undo. Non-negotiable companion to any scheduling feature.

## 2.3 Ambient layer

The Brain appears where the work happens. Five mechanisms:

**A. Universal "Why?" affordance.** Every chart, widget and data point gets an explain action. Requires the `WidgetContext` contract so the Brain knows exactly which widget, dataset, window, entity, filters and selected point are in view. This is the highest-value ambient feature and the one that makes the Analytics page AI-native rather than a dashboard with a chatbot bolted on.

**B. Claim grammar everywhere.** Confidence chip + evidence ribbon on every AI statement in every surface (2.1).

**C. The 10 rogue widgets, rerouted.** `ThumbAIWidget`, `TagGeneratorWidget`, `TitleRewriterWidget`, `CommunityPostWidget`, `CommentReplyWidget`, `ImageGeneratorWidget`, `DescriptionEditorWidget` and peers keep their exact appearance but route through `AssetGenerator`. They gain evidence, style fidelity, evaluation and outcome capture **with no visual redesign.** Highest ratio of architectural gain to UI work in the whole plan.

**D. Smart empty and degraded states.** A widget with no data explains why and offers the fix, instead of rendering an empty axis.

**E. Context-aware sidecar.** `GlobalBrainSidecar` learns what page it's on and offers the two or three things worth asking here.

## 2.4 Operator tooling

Trace viewer (search, filter, replay a turn) · eval dashboard (metric trends, regressions, per-case drill-down) · golden fixture manager · prompt version diff and rollback · cost monitor by feature/model/channel · model-substitution monitor.

## 2.5 Component inventory

| Component | Status | Used by |
|---|---|---|
| `BrainConfidenceChip` | **exists** — promote to universal | everything |
| `BrainEvidenceDrawer` | **exists** — generalize | everything |
| `BrainContextRail` | **exists** | Conversation, sidecar |
| `BrainWorkflowRunPanel` | **exists** | Action Board |
| `GlobalBrainSidecar` | **exists** — add surface awareness | ambient |
| `BrainUserControlPanel` | **exists** — grows into Autonomy Console | ⑦ |
| `ClaimBlock` | new | universal grammar |
| `EvidenceRibbon` | new | universal grammar |
| `KnowledgeMap` | new | ② |
| `StyleFingerprint` | new | ③ |
| `VariantComparator` | new | ④ |
| `OpportunityRadar` | new | ⑤ |
| `ImpactCard` / `CalibrationChart` | new | ⑥ |
| `AutonomyMatrix` / `ScheduleBuilder` | new | ⑦ |
| `EvidenceGapCard` | new | ⑧, ambient |
| `ActivityFeed` | new | ⑨ |
| `TraceTimeline` | new | operator (+ optional creator) |
| `WhyButton` | new | every widget |

Six existing components carry real weight. Roughly twelve new ones, most of them small.

## 2.6 Charts

Per `dataviz` and `viewtube-widget-dashboard`: the Knowledge Map, Style Fingerprint, Opportunity Radar, Calibration Chart and Trace Timeline are all new chart forms and must use the canonical palette, honour light/dark, preserve null/zero/partial distinctions, and degrade legibly at phone width. The Calibration Chart in particular must never imply precision it lacks — small samples get wide intervals or no chart.

## 2.7 The Autonomy Console

Your requirement: creators decide for themselves, including scheduled generation.

**The matrix.** Rows are action types; columns are autonomy levels. Every cell is the creator's choice, defaulting to the leftmost column.

```
                          Ask me   Draft for   Do it
                          first    review      alone
  Content ideas             ○         ●          ○
  Video topic research      ○         ●          ○
  Script drafts             ●         ○          ○
  Titles / tags / desc.     ○         ●          ○
  Thumbnail concepts        ○         ●          ○
  Community posts           ○         ●          ○
  Comment replies           ●         ○          ○
  Publish anything          ●         ─          ─      ← locked
```

**Schedules.** Per action type: frequency, day/time, quantity, and which channel or project. "Generate 5 content ideas every Monday 9am" and "draft 3 community posts weekly, hold for review" are first-class, creator-built rules.

**Budgets.** Spend cap per period with a visible meter, and explicit degrade-or-stop behaviour on exhaustion.

**Quiet hours and frequency caps** so autonomy can't become noise.

**Three rules I'd hold regardless of configuration:**
1. **Publishing is never autonomous.** Posting to a creator's channel in their voice without review is the one irreversible action, and the audit found output quality is not yet measured. Revisit once Phase 6 calibration data exists.
2. **Everything autonomous is undoable**, and lands in the Activity Feed.
3. **Scheduling requires the server-side gateway.** A schedule that only fires when a browser tab is open isn't a schedule. This is a genuine Phase 1 dependency, not a preference.

---

# Part 3 — Approach proposals

You chose destination and ambient in parallel. Three ways to do that; they differ in what gets built first, not in the end state.

### Approach A — Contract-first ("one runtime, two skins")
Build `BrainRuntime`, `WidgetContext`, `StyleProfile` and the Claim grammar first. Destination and ambient then become thin skins over shared contracts.

*For:* no divergence, cheapest total, both surfaces stay consistent forever.
*Against:* slowest to first visible pixel; several weeks of work with nothing to show.

### Approach B — Vertical slice ("one asset type, all the way through")
Pick one asset type — **community posts** is the best candidate: you already generate them, they're low-risk, high-frequency, and they exercise style, evidence, scheduling and outcome measurement — and build it completely: gateway → evidence → style → eval → outcome read-back → Asset Studio panel → ambient widget → autonomy row → schedule.

*For:* proves every contract against something real; earliest honest learning; a working demo in weeks; de-risks the other 64 generators.
*Against:* first slice's design may need generalizing later.

### Approach C — Surface-led ("make it visible, then make it true")
Build the destination toolbox and ambient chips over the current backend, upgrade the backend behind stable UI.

*For:* fastest perceived progress.
*Against:* **I'd reject this one.** The audit's central finding is that the system already looks more trustworthy than it is — a weak number guard, no grounding, ungoverned generators rendering with analytics-grade authority. Approach C adds confidence chips and evidence ribbons to output that has neither. It would ship a trust surface over an untrustworthy substrate, which is worse than the current state, because right now at least nothing is claiming to be grounded.

### Recommendation: **B, then A**

Run the community-post slice end to end to validate the contracts on something real, then generalize with Approach A's discipline. This gets you a genuine working demo of the whole loop — evidence → style → generation → scheduling → measurement → learning — in one narrow lane, before committing the full front-end surface area.

Concretely, the slice would deliver: server-side gateway for one path, `StyleProfile` for one asset type, `AssetGenerator` with evaluation, the community-post autonomy row and schedule, the draft queue and Activity Feed, outcome read-back at 7d, and the first real rows in the Learning Ledger.

---

# Part 4 — Open questions before implementation

1. **Style extraction source.** Published titles and descriptions are easy. Do you have script or transcript archives to extract from, or should the first `StyleProfile` be creator-authored with extraction added later?
2. **Community-post slice, or a different one?** Titles/tags is higher-frequency but harder to attribute; scripts are highest value but slowest to measure.
3. **Does the trace get a creator-facing view?** You chose "creators + operator tooling" — I'd add a simplified creator "show your work" panel as a trust feature, but it's extra scope.
4. **Cross-channel learning.** Opt-in pattern mining across channels is powerful and privacy-sensitive. In or out of scope?
5. **Knowledge Map ambition.** A structured editable list is a fraction of the cost of an interactive graph and delivers most of the value. Which?

---

# Approval gate

**No implementation has begun and none will until you approve.** Per the brainstorming process, the next step is a written spec for whichever approach you choose, followed by an implementation plan.

To proceed, I need: the approach (B-then-A recommended), an answer on the slice choice, and a decision on the Knowledge Map's ambition. The other open questions can be resolved during the spec.


---

# Part 5 — Evidence-first UI integration addendum (2026-10-19)

**Purpose:** Connect the original destination-plus-ambient design to the Brain evidence/provenance work now present in the integration branch. This addendum updates implementation guidance; it does not rewrite the historical 2026-09-12 brainstorm or treat every proposed UI as implemented.

**Current implementation anchors verified on `master/consolidated-feature-integration`:**
- [PR #667 — preserve rich evidence through provenance](https://github.com/viewtube-dev/viewtube/pull/667) is merged. `EvidenceRecord` carries typed source, metric, value, freshness, epistemic state, confidence, availability and provenance metadata; `BrainTrace` can retain rich evidence records alongside compatibility ID lists. Missing metric records can be represented explicitly, and capture time is no longer fabricated as the metric's observation time.
- [PR #674 — enforce the model gateway in orchestration](https://github.com/viewtube-dev/viewtube/pull/674) is merged. Both normal and repair generation use the provider-neutral Brain model gateway.
- [PR #723 — fail closed on evidence grade parity mismatch](https://github.com/viewtube-dev/viewtube/pull/723) is merged. The evidence selected for a turn is graded and rendered under a parity contract; missing or mismatched grades must block analytics-derived prompt context rather than merely add a warning.
- The implementation plan remains the execution checklist: [AI Brain Quick Wins — Master Implementation, Evidence & UX Plan](../../../brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md). These merges strengthen the substrate; they do not mean the whole front-end surface or all 60 brainstorm items are complete.

## 5.1 Updated product invariant: one evidence identity from answer to UI

The core front-end contract is now stricter than “show a citation somewhere.” A user-facing claim must be derived from the **same turn-bound evidence records that passed the prompt evidence grade**. The UI must not reconstruct a friendlier or broader evidence list from a separate snapshot, analytics query, cached profile, or display-only summary.

For every evidence-backed claim, preserve and make inspectable:
- Stable evidence ID, owner/source, source reference and source snapshot.
- Metric/value/unit, time window and applicable scope (channel/video/project/filter).
- Observation time and update/capture time as distinct concepts; unknown observation time stays unknown.
- Freshness, confidence, epistemic state, availability/missingness and known limitations.
- The turn/trace identity and prompt-context fingerprint needed to reproduce what the model actually saw.

**Fail closed:** if the displayed claim cannot resolve to the graded records for that turn, label it unverified or withhold the evidence-backed claim. Do not show a green confidence indicator over an ungraded value. A warning is not a substitute for blocking unsupported analytics context.

## 5.2 Universal Claim surface — shared component contract

Promote the existing `BrainConfidenceChip` and `BrainEvidenceDrawer` into shared presentation primitives rather than building per-tool evidence widgets. Introduce or formalize a `ClaimBlock` / `EvidenceRibbon` composition with a single data contract:

1. **Claim text/value** — keep source facts distinct from model interpretation.
2. **Epistemic label** — observed, calculated/derived, creator-provided/confirmed, inferred, hypothesis, estimate, conflicting, missing, or unknown where applicable. Use the canonical evidence vocabulary; do not invent a second UI-only taxonomy.
3. **Confidence and freshness** — show only when supported by the underlying record and explain what the score means. Never use confidence as decoration or as a substitute for evidence.
4. **Evidence ribbon** — compact source names/record count plus a keyboard-accessible “Inspect evidence” action.
5. **Evidence detail** — source, exact value/unit, window, scope, observation/update timestamps, freshness, limitations, missing metrics and a stable destination.
6. **Provenance action** — “How this was produced” opens the relevant turn trace and identifies the model served, prompt/context version, evidence IDs/omissions and output identity when recorded.

Use this same composition in chat answers, Analytics insights, charts and widgets, generated assets, content briefs, recommendation cards, learning reports and operator evaluations. A surface may choose a compact or expanded layout, but it must not change the meaning of the evidence.

## 5.3 Make uncertainty and missingness visually honest

The UI must distinguish these states instead of collapsing them into empty text, zero, or one generic warning:

| Data state | Required presentation |
|---|---|
| Known numeric zero | Render zero as a real measured value |
| Missing / unavailable | Render “Unavailable” or “Not provided”; never substitute zero |
| Not requested / not checked | Say it was not checked; do not imply a negative result |
| Partial coverage | Show the value with a visible partial-coverage qualifier |
| Stale | Show the age/update time and qualify claims that depend on it |
| Inferred / hypothesis / estimate | Name the epistemic state and avoid presenting it as observed fact |
| Conflicting evidence | Surface the disagreement and sources; do not silently choose one |
| Grade or provenance mismatch | Block analytics-derived claims for that turn and explain the repair path |

Do not imply a precise observation timestamp when the source only records when data was copied. If `observedAt` is unknown, the interface should say so or omit the date while still exposing `updatedAt` separately.

## 5.4 Map the evidence contract to the nine Brain destinations

| Destination | Evidence-first behaviour |
|---|---|
| **Conversation** | Inline claim evidence; “show your work” expands the exact turn evidence, limitations and trace summary. |
| **Channel Mind** | Each profile fact shows source, age, confidence and epistemic state; creator corrections become proposed, attributable updates rather than silent overwrites. |
| **Style Studio** | Show which creator-confirmed examples and style-profile version informed a draft; distinguish style judgment from measured performance. |
| **Asset Studio** | Pin the evidence snapshot, brief version, style version, prompt family and output identity to each generated variant. Regeneration/revision creates a new version, not a mutation of the prior receipt. |
| **Action Board** | Recommendation cards link to the evidence and outcome lineage; acceptance, rejection reason and snooze are structured feedback events. |
| **Learning Ledger** | Show recommendation → evidence → prediction → measured outcome → candidate → governed promotion. Label provisional learnings separately from confirmed patterns. |
| **Autonomy & Controls** | Permission, schedule, budget, approval tier and resulting action receipt must be visible together; generation and publication permissions remain distinct. |
| **Evidence Explorer** | Browse canonical records by owner/source, metric, scope, window, freshness, availability and snapshot; explain each gap and offer a permitted recovery action. |
| **Activity Feed / operator trace** | Show what happened, what evidence/context was used, what output/action resulted, whether it was reviewed, and how to undo or retry where supported. |

The ambient sidecar and “Why?” affordance must pass a typed `WidgetContext` (widget ID, dataset/evidence IDs, entity, time window, filters and selected datum) into the same evidence-resolution path. It must not use the visible chart label as a substitute for the underlying query context.

## 5.5 Accessibility and responsive behaviour are part of the evidence contract

- **Keyboard-first inspection:** every evidence ribbon, confidence detail, source link, chart point explanation and trace expansion must be reachable and operable without a pointer. Provide visible focus and predictable focus return from drawers/dialogs.
- **Screen-reader semantics:** expose claim text, epistemic state, freshness and evidence-action purpose as meaningful labels; announce newly loaded evidence and blocked/degraded states without repeatedly reading entire dashboards.
- **Never rely on colour alone:** pair state colours with text/icons/patterns and explicit labels. Red/green must not be the only way to distinguish conflict, freshness or validation.
- **Contrast and text sizing:** meet WCAG contrast requirements for text, controls, focus indicators and chart marks in both themes. Keep essential evidence readable at zoom and phone width.
- **Charts need equivalent text:** provide a concise textual summary and accessible table/list for evidence, missingness and comparisons; tooltips alone are insufficient.
- **Motion and status:** respect reduced-motion settings. Do not communicate loading, success, or failure only through animation.
- **Touch and narrow layouts:** source ribbons can wrap or collapse to a clearly labelled count, but must not drop source identity, stale/missing qualifiers or the evidence-inspection action.
- **Safe recovery:** when evidence is unavailable, explain why and present only actions the user is allowed to take. Do not make a “connect” or “sync” affordance appear successful before the system confirms it.

## 5.6 Shared UI primitives and integration rules

Build on existing primitives where possible; avoid a parallel “Brain-only” component library or a new evidence store.

- `ClaimBlock`: canonical presentation for one fact or interpretation plus epistemic state.
- `EvidenceRibbon`: compact, responsive summary of the exact record IDs backing the claim.
- `BrainEvidenceDrawer`: detailed record inspector shared by all surfaces.
- `BrainConfidenceChip`: optional, sourced confidence display with an explanatory accessible label.
- `EvidenceGapCard`: actionable missingness/permission/freshness explanation.
- `TraceTimeline`: user-safe provenance sequence for a turn or generation.
- `WidgetContext`: typed context handoff for “Why?” and contextual chat.
- `LearningLineage`: shared presentation of recommendation, prediction, outcome and promotion status.

Each component consumes typed canonical records or IDs that resolve through the turn's evidence envelope. It must not accept arbitrary display-only confidence or a hand-authored evidence summary as proof. Keep data resolution, grade validation, authorization and actions in services; components render the result and expose accessible user actions.

## 5.7 Revised implementation sequence and release gates

1. **Evidence integrity (backend gate):** preserve canonical record IDs and rich provenance; grade and render the same ordered records; reject absent/mismatched grades. This is strengthened by merged PRs #667 and #723.
2. **Provider-neutral execution:** keep normal and repair calls behind the gateway, as in merged PR #674.
3. **Shared claim contract:** define the typed UI view model as a projection of canonical evidence, not a second evidence owner. Test ID parity and all epistemic/missingness states.
4. **One vertical slice:** deliver one Analytics claim from chart/WidgetContext → evidence resolution → graded model context → ClaimBlock → inspectable source/trace. Then carry the same primitives into one generated asset and one recommendation.
5. **Creator correction and learning:** wire claim corrections, acceptance/rejection reasons, and measured outcomes to structured events with stable lifecycle identity.
6. **Accessible destination/ambient rollout:** generalize to all nine destinations only after the vertical slice passes parity, accessibility, responsive and regression tests.
7. **Operator certification:** compare golden cases, exact evidence IDs/omissions, served-model identity, latency/cost and output outcome. Re-baseline deliberately when evidence selection changes; do not tune the baseline merely to make a regression green.

**Release acceptance criteria**
- Every displayed evidence-backed claim resolves to the exact evidence records graded for its turn.
- A changed value, reordered/changed record identity, missing grade or unresolved ID cannot silently render as grounded.
- Zero, missing, not checked, partial, stale, inferred and conflicting are distinguishable in UI and accessible text.
- Keyboard and screen-reader users can inspect sources and understand blocked/degraded states.
- Every handoff preserves scope, filters and stable entity/evidence identity.
- No new front-end surface claims a capability is live until the underlying service, permission and recovery path are verified.

## 5.8 Status discipline

This is integration guidance, not a claim that every proposed destination/component has shipped. Track each surface as **implemented and verified**, **implemented but not verified**, **partial**, or **proposed** against the current code and test evidence. The old Part 4 approval questions and approval gate remain a record of the original brainstorm date; current implementation authority comes from the integration branch, the Quick Wins plan, current architecture contracts and merged PRs—not from the historical status banner.


## 5.9 Audit-driven UI integration backlog — 2026-10-22

This section connects the evidence, orchestration, context, capability, receipt and learning work to the surfaces a creator or operator actually uses. It supplements the historical brainstorm without rewriting its dated findings. The current implementation plan is [AI Brain Quick Wins — Master Implementation, Evidence & UX Plan](../../../brain/AI_BRAIN_QUICK_WINS_MASTER_IMPLEMENTATION_PLAN.md).

### Current code footholds confirmed by source inspection

| UI / service foothold | What is present in source | What the UI must not assume |
|---|---|---|
| `BrainCapabilityBrowser.tsx` | Capability registry and evidence requirements are consumed; availability has explicit ready/needs-data/blocked states; disabled actions have reasons, live status text, labels and visible focus styling. | Do not rebuild a second capability list or claim “ready” means a request has already passed runtime evidence/permission checks. Preserve the reason and re-check at dispatch. |
| `BrainRuntimeSnapshot.ts` | Snapshot projections join requests, ToolReceipts, traces and generation records and expose IDs, evidence, served-model status and output references. | A join being available in the service does not mean every result card displays it or that every ID resolves in the UI. |
| `BrainTrace.ts` | Trace contract includes requested/returned/missing evidence, output reference and requested-versus-served model identity. | Never show requested model as the served model; never label an output saved without a canonical output reference and authoritative status. The current default trace sink is not itself proof of durable server-side audit storage. |
| `BrainEvidenceQuality.ts` + `BrainContextBroker.ts` | Evidence quality is based on typed `EvidenceRecord` values and the prompt path has a fail-closed parity contract. | Do not create a UI-only evidence summary or recompute a friendlier grade. Render the same ordered record IDs that were graded for the turn. |
| `BrainWorkflowRunPanel.tsx` | Workflow recommendations, step statuses and user-operated start/complete/block actions are rendered. | The panel's workflow step state is not a substitute for a ToolReceipt, generation record or publication-owner status. Receipt-backed result cards remain a separate integration check. |

These are source-level observations, not claims that end-to-end behavior or accessibility has passed automated and manual verification.

### 5.9.1 One presentation projection; canonical data stays canonical

Add a typed, read-only **Brain Turn Presentation** projection assembled from the existing conversation turn, turn-bound evidence envelope, quality report, BrainTrace, runtime snapshot, ToolReceipt and output asset references. This is a view model, not a new database, evidence store, profile, trace, or lifecycle owner.

The projection should expose only fields needed by the UI:

- turn and operation IDs, current status, and retry relationship;
- the exact ordered evidence IDs and typed records supplied to the model, plus the grade/fingerprint that approved them;
- requested, returned, missing, stale, partial and unavailable evidence as distinct states;
- prompt family/version, capability IDs, and model identity only when the runtime marks the served identity as known;
- receipt ID, output asset/generation record ID, trace ID, and authoritative operation status when each exists;
- context entries with source/scope and confirmed, inferred, or temporary status only where the canonical owner actually provides that status;
- correction/review actions backed by their existing governance APIs.

Every displayed link/action must carry canonical IDs and scope. If an ID cannot resolve, render an explicit unavailable/unresolved state and do not silently substitute a similarly named record. A missing field is “not recorded” or “unknown,” not a guessed value.

### 5.9.2 Shared components that make the new backend features usable

Extend existing Studio Controls and Brain components rather than creating a parallel design system.

| Shared component / pattern | Contract and UI behavior | Reuse across |
|---|---|---|
| **ClaimBlock** | One claim, its epistemic label, source-backed numeric values, freshness and claim-specific evidence action. Confidence is omitted when unsupported; colour is never the only signal. | Chat answers, analytics insights, reports, generated assets and recommendations. |
| **EvidenceRibbon + EvidenceDrawer** | Ribbon shows the exact record IDs behind a claim; drawer inspects owner/source, metric, value/unit, scope/window, observation/update times, freshness, availability, confidence, limitations and provenance. Show missing records explicitly. | Chat, chart “Why?”, result cards, creator profile and operator trace. |
| **EvidenceGapCard** | States whether data is missing, stale, partial, permission-blocked, not checked, or searched with no result. Offers only a real permitted recovery action; reports success only after the service confirms it. | Analytics readiness, capability browser, empty search states and setup flows. |
| **ContextUsedDrawer** | Shows the actual context envelope used on this turn, with source and scope; provides correction/confirm actions through canonical governance. Distinguishes durable profile facts from turn-local or inferred context. | Chat, Creator Profile/Channel Mind and generated content review. |
| **Receipt-backed ResultCard** | Separate proposed, started, blocked, saved and failed states. “Open output” requires a resolvable canonical asset/output ID; show receipt and originating turn/operation IDs. | Workflow panel, generation results, handoff destinations and activity feed. |
| **TraceTimeline** | User-safe event sequence: request → context/evidence → capability/tool → receipt/output → evaluation/outcome. Explain status and IDs without exposing private chain-of-thought or hidden deliberation. | Creator answer details and operator diagnostics, with role-appropriate fields. |
| **LearningReviewCard** | Candidate, review decision and promotion are separate states. Accept/reject reason is captured structurally; durable knowledge changes only after the authoritative governance response. | Learning inbox, correction receipts and creator profile. |
| **Action/ApprovalControl** | States exactly what will happen, which data/context is in scope, whether an external side effect occurs, and which approval tier is required. Navigation or “prepare” never implies publish approval. | Capability shortcuts, workflows, publishing packages and autonomy settings. |

Use existing Studio Controls for geometry, typography, focus and responsive behavior. The Brain layer should compose these primitives and supply semantic data; it must not create shadow systems of custom inputs, badges, or status tokens.

### 5.9.3 Connect each capability to a visible product surface

1. **Conversation and restoration**
   - Keep raw creator text immutable in storage/learning paths; display sanitization remains presentation-only.
   - Preserve turn IDs, evidence filters, resolved cohort and source scope on restore and retry.
   - Make “original context” versus “refresh evidence” an explicit choice when data may have changed.
   - Keep non-conversation records out of model history. The transcript must not quietly absorb meeting notes, journal entries, intake forms, or system events.

2. **Evidence selection and analytics**
   - Render the evidence pack recorded for that turn, not a fresh search or a prose reconstruction.
   - Keep count, format, date window, ranking metric and filters attached to the pack and to navigation.
   - Claim-level citations open the exact source/calculation; chart context includes the dataset, selected entity, time window, filters and selected datum.
   - Staleness, partial coverage, missing inputs and “not checked” must downgrade the visible readiness state and be explained in text. Do not present a green/complete state if the quality/readiness owner did not produce one.

3. **Creator context and corrections**
   - Provide a visible context strip for Channel → Project → ContentBuild → selected asset, with explicit no-selection states.
   - Show which profile facts were actually used in an answer. Mark confirmed/inferred/temporary only when the canonical resolver exposes that distinction; until then, show source and uncertainty without inventing a structured status.
   - A correction should identify the target fact, scope, source turn and proposed change. The next turn should either reflect the authoritative change or show the unresolved inconsistency.

4. **Capabilities, workflows and handoffs**
   - Derive available actions from `BrainCapabilityRegistry` and current availability/permission checks. Explain blocked actions beside the control.
   - Distinguish selecting/editing a prompt from submitting it; distinguish navigation from starting work; distinguish a started operation from a completed side effect.
   - A retry must be idempotent with respect to external actions. Link attempts to the original turn and receipt rather than replaying publication or another irreversible action.

5. **Generation, publishing and learning**
   - Result cards link to canonical output assets and ToolReceipts. A workflow step being “complete” is not proof that a package is saved or publish-ready.
   - Publishing readiness comes from the publishing owner. Show blockers and approval state from that owner; never infer publish approval from generated content or a green workflow step.
   - Show recommendation → prediction → intervention → measured outcome → candidate → governed promotion as separate linked states. A creator correction is not automatically durable learning.

6. **Operator inspection**
   - Offer a detailed trace view for evidence IDs/omissions, prompt version, known served-model identity, receipt/output refs, evaluation and failure status.
   - Keep operational diagnostics separate from creator-facing explanations. Neither surface displays private chain-of-thought.
   - Show cost/latency only when measured values are available; do not render placeholders as metrics.

### 5.9.4 Audit gaps to close before broad UI rollout

The latest source review answered several questions at code level, but it did not execute tests or certify end-to-end behavior. Prioritize these unresolved items:

| Priority | Gap requiring verification | Required test or proof |
|---|---|---|
| P0 | Restored conversations retain the evidence filters, cohort and turn identity used originally. | Round-trip test: create turn → persist → restore → assert raw text, turn ID, filters and evidence IDs match exactly. |
| P0 | Evidence shown in every surface equals evidence graded and supplied for that turn. | Shared contract test covering ordered IDs, values/fingerprint, missingness, expansion and navigation; changed or unresolved evidence must fail closed. |
| P0 | Result cards are backed by canonical ToolReceipts and output asset IDs. | Exercise proposed → started → saved/failed; assert receipt/output references and prevent “saved” without authoritative output. |
| P1 | Empty search and unavailable evidence states are truthful. | Distinguish no result, not queried, permission denied, stale source and source unavailable; verify each recovery action is real. |
| P1 | Stale/partial analytics readiness reaches creator-facing UI. | Remove or stale one required dataset; assert visible state, claim wording and input-level explanation downgrade. |
| P1 | Capability routing has no registry bypass. | Enumerate all capability/tool dispatch call sites; test each route against registry requirements and receipt production. |
| P1 | Provenance payloads use a safe allowlist and IDs resolve. | Serialization denylist/allowlist test plus canonical-ID resolver test; requested model is never presented as served model. |
| P1 | Corrections reconcile context, profile and saved answers. | Apply a correction; assert next-turn envelope and profile reflect the governed result or surface a conflict. |
| P1 | Workflow, chat and evidence controls are accessible on keyboard/mobile/screen readers. | Automated semantic/axe-style checks where available plus manual keyboard, focus-return, screen-reader, zoom/reflow and reduced-motion walkthroughs. |
| P2 | Fake states, dead links and lost filters are absent across the whole Brain UI. | Route/state inventory with canonical owner, empty/loading/error/success state, deep-link resolution and back/restore coverage. |

**Test execution honesty:** static source inspection is not a passing test. Record exact command, environment, exit status and CI run for every reported test. If dependencies are unavailable, mark the behavior “implemented but not verified” or “not verified”; do not infer a green result from code presence.

### 5.9.5 Accessible UI acceptance checklist

- Every control has a semantic name, keyboard operation, visible focus and predictable focus return after drawers/dialogs.
- Dynamic status changes use appropriate live regions without announcing entire panels repeatedly.
- Disabled actions explain the unmet permission/evidence/context requirement in text and remain disabled at dispatch if the requirement is still unmet.
- Evidence state uses text/icons as well as colour; chart/tooltips have equivalent text or tabular access.
- Narrow layouts and zoom preserve source identity, uncertainty, status and the evidence-inspection action.
- Motion respects reduced-motion preferences; loading/success/failure is not communicated only through animation.
- Standard/compact/micro Studio Controls retain their established sizing and visual contracts; no one-off Brain-only primitive family is introduced.
- Creator-facing trace summaries exclude chain-of-thought, hidden deliberation and internal-only scoring.
- No state is shown as saved, reviewed, approved, published or learned until the canonical owner confirms it.

## 5.10 Recommended delivery sequence — 2026-10-22

Deliver a thin vertical slice before broad UI expansion:

1. **Turn contract:** one canonical presentation projection joins turn, evidence pack, quality grade, trace and IDs; add parity and unresolved-ID tests.
2. **Claim-to-source slice:** take one Analytics claim from typed evidence through the prompt/grade contract into a ClaimBlock and EvidenceDrawer, preserving filters and source IDs.
3. **Receipt-backed result slice:** connect one generation/workflow result to its ToolReceipt, output asset and trace; prove each visible status against canonical records.
4. **Context/correction slice:** display the actual envelope used, propose a correction, and verify the governed result on the next turn.
5. **Learning/outcome slice:** link recommendation and prediction to measured outcome, review candidate and promotion event without skipping governance.
6. **Expand across surfaces:** apply the same components to the Brain destination, contextual chat, analytics “Why?”, Creator Profile, publishing package and operator activity view.
7. **Certify accessibility and regressions:** run restore/routing/governance tests, evidence golden cases, responsive/keyboard/screen-reader checks and the deliberate grounding-regression baseline before declaring the rollout complete.

Each delivery should identify the canonical owner, source files, regression test, relevant PR/commit, rollback, and status (**implemented and verified**, **implemented but not verified**, **partial**, **proposed**). Do not mark the UI integration complete just because a component renders or a build succeeds.

---

# Implementation follow-through — AI Brain trust and feature access (2026-10-22)

This section is a current implementation note, not a revision of the historical 2026-09-12 audit. Treat the older maturity claims above as donor evidence; verify all live behavior against the target branch and current tests.

## First UI slice: make provenance inspectable on the AI Brain page

The Brain page already mounts `BrainRuntimePanel` above the conversation. Extend that canonical surface rather than adding a parallel dashboard or a second evidence store.

- Show lineage totals for linked chains, outcome-attributed chains, evaluated chains, learning chains, and unresolved chains.
- Add a keyboard-accessible, native disclosure for the latest recorded chain. Show request, ContentBuild, operation, workflow, receipt, trace, generation-record, served-model, and evidence IDs.
- Distinguish “no chain recorded” from “chain complete.” Surface unresolved links and operation identity mismatches as explicit warnings.
- Keep the display to approved provenance metadata. Never render private chain-of-thought, hidden reasoning, or internal free-form scratchpads.
- Keep the embedded/mobile runtime strip compact; provide the detailed inspection in the full runtime panel. Do not make hover the only way to reach IDs or warnings.

The associated implementation slice is intended to be tested in `src/components/brain/BrainRuntimePanel.test.tsx` and `src/views/AIBrainRuntimeSurface.contract.test.ts`. CI—not the presence of assertions alone—determines whether the slice is verified.

## AI Brain page information architecture

Use the existing page as the shared workspace, with a stable conversation center and contextual panels that reuse canonical data:

1. **Conversation and work state:** preserve raw message text in storage; distinguish a draft, a prepared plan, an approved action, a running operation, and a saved result. Restoring a thread must restore its evidence filters and scope, not just its messages.
2. **Context bar:** show active channel, project, ContentBuild/revision, selected surface, and any lock/clear controls. Any correction should route through existing governed profile/context paths; label confirmed, inferred, and temporary facts structurally rather than relying on prompt prose alone.
3. **Evidence and claim inspection:** use the exact ordered evidence pack supplied to the model as the source for both the explanation and user-visible evidence cards. Show evidence ID, source, observation/update time, freshness, confidence/epistemic state, scope, missing inputs, and limitations where available. An empty result must explain whether data is missing, unavailable, filtered out, or not queried.
4. **Result and operation receipts:** each proposed/started/saved result should resolve to its canonical output asset and ToolReceipt/operation identity. Retries may repeat generation but must not replay external side effects. Missing receipts must be presented as missing—not simulated success.
5. **Learning review:** keep preference learning separate from performance learning. Show candidate evidence and sample sufficiency, and distinguish candidate, under review, approved, promoted, rejected, and blocked states from authoritative governance records.
6. **Analytics diagnosis:** let creators move from a claim or chart into the exact metric/window/scope and source records used. Surface stale/partial/missing coverage and comparisons that are not semantically compatible before presenting a confident conclusion.
7. **Creator controls:** expose autonomy, memory/personalization, evidence access, model/cost limits, and approval requirements as real persisted settings with visible reasons when a capability is blocked.

## Shared visual and accessibility contract

- Prefer existing Studio controls and Brain components, including `BrainRuntimePanel`, `BrainEvidenceDrawer`, `BrainContextRail`, `BrainCapabilityBrowser`, and `BrainWorkflowRunPanel`; do not create a competing primitive system.
- Keep status words and icons paired with text. Use explicit loading, empty, partial, stale, blocked/permission, error/retry, and success/next-action states; never make color the only signal.
- Ensure every disclosure and action works with keyboard, has a visible focus state, has a programmatic name, and remains usable at mobile widths and high zoom. Avoid hover-only details and respect reduced-motion preferences.
- Preserve filters and scope during drawer open/close, navigation, conversation restore, and deep-link entry.
- Link provenance using canonical IDs, not display labels or reconstructed identities. If an ID cannot be resolved, say so.
- Keep developer diagnostics distinct from creator-facing explanations; expose approved lineage metadata, not internal reasoning traces.

## Delivery order and acceptance gates

1. **Trust surface:** show latest lineage and unresolved links in the runtime panel (current first slice).
2. **Evidence parity:** enforce and test that rendered evidence IDs/fingerprint match the records actually graded and supplied to the prompt.
3. **Context restore:** round-trip raw messages, scope, and evidence filters through storage and restore.
4. **Receipts and actions:** trace every capability call to a canonical receipt/output; prove retries do not duplicate external effects.
5. **Learning and outcomes:** join published output to measured checkpoints, evaluation, candidate review, and governed promotion.
6. **Accessibility and reliability certification:** keyboard/mobile/screen-reader checks plus a full lifecycle acceptance scenario from question → evidence → operation → receipt → publication → analytics → evaluation → learning.

For each delivery, report the requirement-to-commit mapping, canonical owners reused, tests actually executed, CI result, known failures, and deferred gaps. Static source inspection is not runtime verification, and pre-existing CI debt must be reported separately from failures introduced by a change.


## 5.11 AI Brain page — evidence-first implementation plan (2026-10-22)

**Purpose:** make the existing AI Brain page the usable front door to the new evidence, context, orchestration, capability, receipt, outcome and learning contracts. This is a build plan, not a claim that these surfaces are already connected. The 2026-09-12 sections remain historical; current ownership and status must be checked against `master/consolidated-feature-integration`.

### Page structure: one workspace, progressive disclosure

1. **Workspace header and context bar**
   - Persistent scope: active channel, project, ContentBuild/revision, selected asset or analytics surface.
   - Explicit unset/cleared states; changing scope must visibly affect subsequent requests.
   - Preserve scope and evidence filters on thread restore, navigation, retry and deep links.
   - Do not write transient UI selections into durable creator memory without the existing governed action.

2. **Conversation center**
   - Preserve raw creator message text in storage and learning capture; sanitization is display-only.
   - Each turn has a clear state: answering, needs evidence, proposed action, awaiting approval, running, saved, blocked or failed.
   - Make “Discuss”, “Prepare” and “Execute” distinct interaction intents. Execute must invoke the real approval/capability contract, never infer approval from a chat response.
   - Restore only actual conversation turns to model history, while preserving original turn identity and scope.

3. **Claim and evidence inspection**
   - Reuse `BrainConfidenceChip` and `BrainEvidenceDrawer`; extend them rather than creating parallel trust controls.
   - The turn's typed evidence records and grade/fingerprint are the source of truth. The claim ribbon, drawer, trace and model input must reference the same ordered IDs and values.
   - Every numeric/analytics claim links to the exact metric, unit, entity, time window, filters and calculation/source records.
   - Show observed/derived/creator-provided/inferred/hypothesis/estimate/conflicting/missing states only when the canonical evidence contract supports them. Never upgrade unknown data into a fact.
   - Empty states must distinguish “searched, no result”, “not queried”, “filtered out”, “missing data”, “stale”, “permission blocked” and “source unavailable”.

4. **Context used and correction flow**
   - A per-turn “Context used” disclosure lists only the actual envelope entries supplied, with source and scope.
   - Corrections target an identified fact and call the canonical context/profile governance API. Show pending versus confirmed outcomes; verify the next turn or expose a conflict.
   - Until the resolver provides structured confirmed/inferred/temporary status, do not fabricate those badges from prompt prose.

5. **Capability and action tray**
   - Derive actions from `BrainCapabilityRegistry`, its evidence requirements, user controls and runtime permission checks.
   - Every blocked action explains the unmet requirement in text and is revalidated at dispatch.
   - A persistent work tray tracks proposed → prepared → awaiting approval → started → completed/failed. Navigation or opening a toolbox is not an operation receipt.
   - Retries link to the original operation and must not repeat irreversible external side effects.

6. **Receipt-backed output cards**
   - Reuse `BrainWorkflowRunPanel` for workflow steps, but do not treat step completion as proof of a saved asset or publish readiness.
   - Each generation/result card resolves to its canonical output asset, ToolReceipt, operation/turn and trace where available.
   - Render “saved” only when the output owner confirms the saved state; unresolved IDs and missing receipts remain explicit.
   - Publishing approval/readiness is read from the publishing owner, not inferred from generated text or workflow color.

7. **Learning and activity**
   - Show preference learning separately from performance learning.
   - Keep recommendation, prediction, intervention, measured outcome, learning candidate, review decision and promotion as linked but separate states.
   - Capture accept/reject/correction reasons structurally where the canonical API supports them; only governance can promote durable knowledge.
   - Creator activity shows confirmed actions and outcomes. Operator trace details remain role-appropriate and exclude chain-of-thought.

### Shared UI contract

- Use the existing Studio Controls design system for geometry, typography, focus and sizing; use existing Brain components as compositions of canonical data.
- Every control has a semantic name, keyboard support, visible focus, logical focus return, and a text explanation for disabled states.
- Status is expressed through text/icon as well as color. Loading, partial, stale, missing, blocked, failed and saved are distinct.
- Drawers and disclosures preserve scroll, filters and selected entity; mobile and high zoom must retain the evidence/source action.
- Respect reduced motion; no hover-only evidence, status or controls.
- Do not show private reasoning, internal scratchpads, unsupported confidence, guessed model identity, simulated receipts or decorative readiness scores.

### Phased build order

| Phase | Build slice | Required regression proof | Exit gate |
|---|---|---|---|
| 0. Audit inventory | Map current AI Brain page route, components, state sources and action dispatches. Mark each surface verified / partial / proposed. | Source inventory links every control to its owner and test; no assumed routes. | Agree on the exact existing page footholds before editing. |
| 1. Turn presentation contract | Add a typed, read-only projection over the existing turn, evidence pack/grade, trace, operation, receipt and output records. | Missing/unresolved IDs remain explicit; projection creates no parallel persistence. | All displayed state is derived from canonical records. |
| 2. Evidence-first claim | Wire one analytics claim end-to-end into a shared claim block and evidence drawer. | Ordered IDs and values match model-supplied and graded evidence; stale/mutated/unresolved evidence fails closed. | One vertical slice proves claim-to-source navigation and filter preservation. |
| 3. Context and restore | Show turn scope/context used; preserve raw text, turn ID, cohort and evidence filters through restore. | Round-trip tests plus correction propagation test. | Restored turns retain original scope; corrected facts reflect governed state or explicit conflict. |
| 4. Capability and receipt | Connect one generation action and result card to registry, operation, ToolReceipt, output asset and trace. | Proposed/started/saved/failed state tests; retries do not duplicate side effects. | No “saved” state without authoritative output and resolvable identity. |
| 5. Outcome and learning | Link recommendation → prediction → measured outcome → candidate review → governed promotion. | State-machine and lineage tests; insufficient data remains explicit. | No implicit promotion and no conflation of preference with performance learning. |
| 6. Expand and certify | Apply the proven patterns to contextual sidecar, analytics “Why?”, creator profile, publishing and operator surfaces. | Golden evidence cases, routing/governance tests, keyboard/screen-reader/mobile/zoom/reduced-motion checks. | End-to-end acceptance and CI evidence are reported; unrelated existing failures are separated. |

### First implementation targets and boundaries

Start with `src/views/AIBrainCommandInterface.tsx` and its existing turn/render/action owners; inspect actual call sites before choosing seams. Reuse `BrainRuntimePanel`, `BrainEvidenceDrawer`, `BrainConfidenceChip`, `BrainCapabilityBrowser`, `BrainWorkflowRunPanel`, `GlobalBrainSidecar`, `BrainTrace`, `BrainRuntimeSnapshot`, conversation storage and learning governance. Do not introduce a second conversation store, evidence pack, creator profile, receipt ledger, action engine or UI primitive family.

The first code PR should be one vertical slice, not a page-wide redesign: typed presentation contract + evidence parity test + one claim-to-source UI connection. Only then expand to receipts and context corrections.

### Definition of done

- Every shown claim uses the evidence actually supplied and graded for that turn, or clearly says it is ungrounded/limited.
- Every visible action and result state is backed by a canonical capability/operation/receipt/output owner.
- Scope, filters and IDs survive restore, retry and navigation.
- Corrections and learning use existing governance.
- Keyboard, screen-reader, narrow-screen, zoom and reduced-motion checks have execution evidence.
- Final report lists requirement-to-commit mapping, files changed, tests actually run, CI results, known unrelated failures and rollback path.


### Implementation record — accessible AI Journal capture (2026-10-22)

The first UI implementation slice is in progress on `/ai-brain`:

- Extracted the existing AI Journal overlay into `src/components/brain/BrainJournalDialog.tsx`; this is a presentation/accessibility boundary, not a new journal store.
- Added a named modal contract (`role="dialog"`, `aria-modal`, title and description relationships) and a programmatic label for the entry field.
- Added initial focus, Escape-to-close, Tab focus containment and focus restoration when the dialog closes.
- Kept save behavior on the existing `handleJournalSave` / AI Journal flow. The dialog explicitly states that saving a note does not promote it to confirmed knowledge.
- Added a component regression test for the accessible dialog contract and empty-save prevention.

**Verification status:** the test is committed on the implementation branch but has not yet been reported green by CI. This slice does not certify the broader restore, evidence-parity, receipt-lineage, or full accessibility checklist. The next implementation gate remains a turn-bound evidence presentation contract and claim-to-source parity, followed by receipt-backed result states.


### Verification note — UI evidence integration PR #785 (2026-10-22)

The first implementation PR, [#785](https://github.com/viewtube-dev/viewtube/pull/785), merged the accessible AI Journal dialog and turn-bound typed evidence list into the target branch. The CI run showed `production-build` and `local-smoke` passing. The Brain quality-loop, static-quality and focused-contract jobs failed on other currently failing contracts; this run does not certify the new UI tests as fully green. The broader browser accessibility walkthrough remains outstanding. Deployment previews were rate-limited by the Vercel account, so no deployed visual verification is claimed.

Next: fix/confirm the type-safe evidence metadata guard, then continue with receipt-backed result states and canonical context correction. Do not treat workflow-step status as a ToolReceipt or saved-output proof.


### Follow-through — receipt-backed output card (2026-10-22)

The Brain runtime panel now projects the latest provenance chain into a small output card only when the chain contains a ToolReceipt and every receipt output asset ID exists in the same current ContentBuild snapshot. It displays the receipt, ContentBuild, generation-record and trace IDs, plus output asset and version IDs. If the receipt is absent, contains no output IDs, belongs to a different/unavailable build, or references missing assets, the UI shows an explicit unavailable/withheld state; it never emits a stale “saved” card.

The runtime snapshot now exposes its canonical ContentBuild asset IDs for this read-only check. Tests cover resolved output, missing/stale output IDs, missing receipts, and snapshot asset identity. CI for this follow-up is pending; the browser/mobile/screen-reader verification gate remains open.


### Follow-through — truthful context provenance labels (2026-10-22)

The next /ai-brain slice replaces guessed certainty labels in the per-turn Context used disclosure with labels that describe what the source actually establishes:

- Channel is presented as active scope, not as a confirmed fact.
- Project labels identify canonical project / ContentBuild provenance or visible UI context, without inferring epistemic certainty from the source name.
- ContentBuild and selected video/asset are described as linked IDs or current surface selection.
- Missing project, build and selection are explicitly shown as not supplied.
- “Correct context” is renamed “Propose correction” because the control seeds a correction request; it does not itself mutate a profile or confirm a durable fact.

A pure projection helper and regression tests cover canonical/visible provenance and missing-scope states. This is presentation-only: no new profile, memory, or evidence store. The change does not claim that context correction propagation is complete; the next slice should connect a proposed correction to the existing governance path and prove the next turn reflects the governed result or exposes a conflict.

**Verification status:** source and test are committed on the implementation branch; CI is pending. No local test execution is claimed.

---

# Current implementation bridge — 2026-10-22

**Purpose:** Connect the historical design ideas above to the current integrated Brain implementation and to the next UI/accessibility work. This section is a current working addendum; it does not retroactively make the 2026-09-12 audit claims current, nor does it treat static source inspection as runtime verification.

## Verified code footholds and recent runtime work

The following source footholds exist on `master/consolidated-feature-integration` at the time this addendum was prepared:

- `src/views/AIBrainCommandInterface.tsx` is the main Brain conversation surface. It already carries per-message evidence-pack and typed evidence-record fields, readiness diagnostics, context snapshots, learning receipts, and imports the Brain evidence/context UI components.
- `src/components/brain/BrainEvidenceDrawer.tsx` is the existing creator-facing evidence disclosure. It preserves evidence IDs in Analytics deep links and communicates inference vs. measured evidence, missing inputs, caveats, and source references.
- `src/components/brain/BrainConfidenceChip.tsx` is a shared confidence primitive backed by Studio Controls.
- `src/components/brain/BrainWorkflowRunPanel.tsx` represents workflow recommendations and local workflow-chain progress, but its visible code does not establish a canonical ToolReceipt/output-asset link. Do not label a workflow as saved/published merely because a local chain exists.
- `src/services/brain/BrainTrace.ts`, `EvidenceRecord.ts`, and `BrainRuntimeSnapshot.ts` are the runtime/provenance footholds. Rich evidence records now have a path into trace/runtime provenance, and the canonical projector preserves explicit missingness and avoids inventing an observation timestamp from bundle-capture time.
- PR #667 (rich evidence provenance) and PR #674 (model gateway boundary) were confirmed merged when this addendum was prepared. Those merges improve traceability and provider-neutral routing; they do **not** prove the complete UI, evaluation, or learning loop is finished.

These are source-level observations. They are not a claim that the full test suite, keyboard audit, screen-reader audit, or end-to-end behavior has passed.

## Front-end integration principle

Build the Brain page as a **trust-and-action workspace**, not a collection of unrelated AI panels. The UI must render the canonical records already used by runtime and governance code. It must not invent a second state store, synthesize receipt IDs, or turn an unverified model claim into a visually authoritative metric.

### Shared claim contract

Use one reusable claim presentation across chat answers, insights, workflow recommendations, generated assets, and analytics summaries:

1. **Claim text** — the human-readable statement.
2. **Evidence status** — measured, calculated, creator-confirmed, inferred, hypothesis, estimated, conflicting, stale, or missing, using the canonical epistemic vocabulary once it is unified.
3. **Confidence** — sourced from the evidence/quality result, not inferred from styling or model tone.
4. **Evidence references** — stable canonical IDs, source, observation/update timestamps, freshness, coverage, and missing inputs where available.
5. **Action** — inspect the source, correct creator context, sync missing data, compare a compatible cohort, or dismiss/propose a correction.
6. **Lineage** — operation/workflow/content-build/output/trace/receipt IDs when the backing record actually supplies them.

Do not display every technical ID by default. Show creator-readable source labels first; make canonical IDs, version details, and diagnostic fields expandable for operators. Keep chain-of-thought and private internal reasoning out of the UI.

### Recommended Brain page information architecture

- **Conversation:** the primary work surface. Each assistant turn owns the exact evidence pack and readiness state used for that answer. The visible evidence list must be derived from the same recorded IDs/records that were supplied to the model; on mismatch, show a clear integrity warning and withhold detailed provenance rather than silently substituting a different list.
- **Context & Channel Mind:** a reviewable panel for creator profile facts and active context. Mark each item confirmed, inferred, temporary, or conflicting; show source and age; make correction a proposed governed update with a visible outcome. Do not imply that a prompt-policy sentence is equivalent to structured context metadata.
- **Evidence & Analytics:** a drill-down for evidence selection constraints (count, date window, format, ranking, filters), data freshness, coverage, and missingness. Preserve filters and canonical evidence IDs across navigation and restore. Empty states must distinguish “searched and found none,” “not requested,” “source unavailable,” and “not connected.”
- **Actions & Work tray:** one persistent list of proposed, awaiting approval, started, completed, blocked, failed, and saved/published outcomes. Each state must come from the canonical workflow/operation/publication record. A view/open handoff is review-only; it is not approval or execution.
- **Learning review:** separate user preference/context corrections from performance-learning candidates. Accept/reject feedback must be structured and attributable; candidates stay candidates until the canonical governance path confirms promotion.
- **Operator diagnostics:** gated/role-appropriate access to trace, evaluation, actual model served, prompt/context versions, cost/latency, failure reason, and evidence omissions. This surface should explain failures without exposing chain-of-thought or secrets.

### Accessibility and interaction contract

- Use semantic landmarks and heading hierarchy; every panel has a meaningful title and predictable reading order.
- All controls are keyboard reachable with visible focus; disclosure widgets use native disclosure semantics or equivalent accessible state, and expanded state is announced.
- Buttons and icon-only actions have accessible names; disabled actions explain the blocking reason in adjacent text, not only a tooltip or color.
- Status is never communicated by color alone. Pair state colors with visible labels/icons and accessible text.
- Evidence rows, chips, confidence indicators, and compact controls must meet the shared Studio Controls size contract and touch-target minimums; don't introduce local bespoke geometry to imitate existing primitives.
- Respect reduced-motion preferences; progress and state changes must remain understandable without animation.
- At narrow widths, evidence and lineage content wraps rather than clipping; dialogs and drawers trap/restore focus correctly; deep links restore filters and selected evidence.
- Screen-reader text should distinguish evidence quantity from evidence quality (e.g. “4 sources; 1 stale; 2 missing inputs”), and announce loading, empty, mismatch, and failure states.
- Never use “saved,” “approved,” “published,” “complete,” or “high confidence” unless the canonical record supports that claim.

## Highest-priority UI implementation sequence

| Phase | Implementation | Acceptance evidence |
|---|---|---|
| UI-1 | Add a shared evidence integrity/status summary to each answer using the exact recorded prompt evidence IDs and typed records. | Regression test proves rendered IDs equal prompt-supplied IDs; mismatches render a warning, not a fabricated evidence list. |
| UI-2 | Make empty, partial, stale, unavailable, and conflicting evidence states explicit and actionable in the evidence drawer. | Component tests cover each state and verify links retain count/date/format/ranking/filter constraints. |
| UI-3 | Add a persistent action/work tray backed by canonical operation/workflow/output records. | Every item resolves to a real record; proposed/started/saved/published are distinct states; retry does not replay external side effects. |
| UI-4 | Add reviewable creator-context facts and governed correction flow. | Correction updates or reports inconsistency across resolver/profile/saved answers; inferred facts cannot silently become confirmed. |
| UI-5 | Connect learning review to canonical candidate/governance records and expose promotion outcomes. | Candidate remains unpromoted until the governance API confirms it; reject reason and actor are preserved. |
| UI-6 | Add operator trace/evaluation detail and link it from creator-facing explanations without exposing private reasoning. | Provenance whitelist test; actual served-model identity only; each visible reference resolves to a canonical record. |
| UI-7 | Run keyboard, screen-reader, mobile/reflow, focus-management, and reduced-motion audits over the complete Brain route. | Automated accessibility checks plus documented manual walkthrough; report actual results and existing failures separately. |

## Next implementation slice

Start with **UI-1 + UI-2**, not a visual redesign. Reuse the current `AIBrainCommandInterface`, `BrainEvidenceDrawer`, `BrainTurnEvidenceRibbon`, `BrainClaimEvidence`, `BrainConfidenceChip`, and Studio Controls. First add/strengthen tests around the exact evidence record/ID contract and truthful missing/stale/empty states; then implement the smallest accessible UI change. Keep the historical brainstorm as a donor reference and record verified implementation status in the current Brain implementation plan as work lands.

## Explicitly unverified

- Whether conversation restore retains all evidence-selection filters end-to-end.
- Whether every registry capability call produces a canonical ToolReceipt and whether any call sites bypass the registry.
- Whether stale/partial inputs consistently downgrade all readiness/confidence outputs.
- Whether every user-facing output card resolves to canonical receipt and output-asset IDs.
- Whether all creator-context facts have structured confirmed/inferred/temporary state and corrections reconcile across stores.
- Whether the golden grounding suite and the full focused/typecheck suite pass on the current integrated branch.
- Full keyboard, screen-reader, mobile, and reduced-motion verification.

Do not mark these complete until source tracing, executable tests, or documented accessibility checks provide evidence.


### Follow-through — scoped Brain output navigation to Vault (2026-10-22)

The Brain runtime output card links each verified output asset to `/vault` with both `assetId` and `contentBuildId`. The Vault page validates the requested ID against the canonical Vault inventory and matching ContentBuild before selecting the asset. It opens the Inspector, preserves existing library filters, and announces success through a status region. Invalid IDs, unavailable builds, and scope mismatches produce an alert and do not select the asset.

This reuses existing Vault and ContentBuild owners; it introduces no alternate asset store or routing registry. Tests cover scoped URL encoding, asset/build resolution, mismatched scope, and the Brain card's rendered-link contract.

**Verification status:** source and tests are committed on the implementation branch; CI and browser-level accessibility verification are pending. No local test execution or screen-reader certification is claimed. Next: connect “Propose correction” to the canonical learning/governance path and verify the next turn reflects the governed result or exposes an unresolved conflict.


### Implementation record — governed context correction flow (2026-10-22)

The AI Brain page's existing **Propose correction** action now opens a dedicated accessible dialog showing the current statement, source ID, knowledge class, lifecycle, and confirmation state. A creator can edit the replacement statement and submit it through the canonical learning/governance service.

Active memory claims use the explicit teaching path and are only reported as applied after the replacement claim is resolvable. Model hypotheses and learning candidates are recorded as unconfirmed correction proposals because no generic source-specific update contract exists for them; their original records remain unchanged. The dialog supports Escape dismissal, focus restoration/trapping, visible result/error messaging, and a next-turn verification prompt after a governed claim update.

Regression tests cover claim routing, channel isolation, empty input, proposal-only sources, dialog semantics, and explicit-vs-inferred status. **Verification status:** CI and live keyboard/screen-reader/mobile checks are pending. No local execution or accessibility certification is claimed.


### Implementation record — prompt evidence identity in the Brain conversation (2026-10-22)

The AI Brain response evidence panel now receives an explicit prompt-evidence integrity state derived from the turn's saved metadata:

- **Verified:** the typed evidence records are valid and their ordered IDs exactly match the stored prompt evidence manifest.
- **Unavailable:** a legacy turn did not save a complete prompt manifest. This is not labeled as a mismatch.
- **Mismatch:** a manifest exists but its records/IDs are malformed or disagree. The UI exposes an accessible alert and withholds record-level provenance rather than implying that a different evidence set was supplied to the model.

The state is restored with saved turns and recalculated after generation retries. This is a presentation of the existing canonical turn metadata, not a second evidence store; it deliberately does not compare unrelated video/evidence-pack IDs against analytics record IDs as if they shared a namespace.

Regression tests cover all three states and the visible alert/status semantics. **Verification status:** CI pending; no local test execution, live browser verification, or accessibility certification is claimed. Next: broaden the same disclosure to explicitly distinguish empty, partial, stale, unavailable, and conflicting source data, then run the complete Brain-route keyboard/mobile/screen-reader audit.

### Implementation record — explicit evidence-quality conditions (2026-10-22)

Follow-through for UI-2 in the audit-driven backlog:

- The AI Brain evidence ribbon distinguishes an empty prepared selection from a source with missing data; it explicitly avoids treating an empty selection as proof that the source has no records.
- When prompt evidence identity is verified, the ribbon summarizes partial coverage and counts stale, missing, and conflicting typed records using the same turn-bound `EvidenceRecord` objects.
- When identity is mismatched, detailed record-derived condition counts remain withheld. Legacy turns without a prompt manifest stay marked unavailable rather than being mislabeled as mismatches.
- The summary pairs text with status color and uses a labeled semantic region. Existing disclosure sections continue to use native `details/summary` keyboard interaction and visible focus styles.

Regression cases cover empty selection, partial coverage, stale/missing/conflicting records, legacy record absence, and preservation of count/date/format/ranking/filter constraints in evidence navigation. The prompt-record list now labels partial availability/coverage and stale/missing/conflicting epistemic states beside each typed record. When the prompt manifest is verified, each record link carries its canonical evidence ID plus owner, source reference, snapshot ID, metric, window, channel scope, and the turn's selection constraints. The Analytics page now renders an accessible incoming-context panel for that handoff, but explicitly says the constraints are not automatically applied and the current live row has not been verified as the same historical record. **Verification remains pending:** CI and live keyboard/mobile/screen-reader checks are not yet green/certified. The existing `aiBrainConversationStore.test.ts` round-trip test covers persisted request constraints; a mounted-page restore walkthrough remains open. True sentence-level numeric claim links are also still open: `CreatorBrainResponse` currently carries turn-level `evidenceIds`, not a governed claim-to-record mapping, so the UI must not imply that every number is individually supported merely because a record is linked in the same answer.

### Implementation record — canonical recent-work tray (2026-10-22)

The embedded Brain runtime panel now exposes a collapsible **Recent work** tray sourced from the five most recent request-attributed provenance chains. Each entry shows request/receipt/ContentBuild/trace identity and any explicit lineage limitation. An output links to Vault only when the existing receipt resolver confirms the receipt, ContentBuild scope and every output asset ID against the current snapshot.

The UI deliberately uses conservative state labels. A missing receipt is not called a failure or a completed action; a recorded receipt without resolvable output is not called saved; a verified output does not imply publication. Empty history is scoped to the active ContentBuild. This is a first UI-3 slice, not a complete work tray: proposed/started/failed action states require canonical owner records, and broader history, restoration, keyboard/mobile/screen-reader checks remain open.

Regression tests cover recent-chain projection and verified output navigation. **Verification status:** CI pending; no local test execution or accessibility certification is claimed.
### Readiness correction — stale data is never green (2026-10-22)

Static review found a UI truthfulness defect: the readiness badge selected its green state from `dataStatus === ready` even when the same diagnostic snapshot reported stale or missing datasets. The page now uses a small pure presentation resolver so stale data becomes a warning, missing inputs prevent a green state, and fully synced/complete data is green only when stale and missing counts are both zero.

Regression tests cover stale-ready, missing-ready, clean-ready, partial, and unavailable states. This is a readiness-label correction, not a claim that model confidence is automatically calibrated or downgraded; that requires an evidence-backed confidence contract. CI and live accessibility checks remain pending.

---

# Current implementation bridge — AI Brain UI integration (2026-10-23)

> **Purpose:** Connect the historical PR #241 product ideas to the current integration-branch implementation and identify the next UI work that is still justified by source. This addendum does not rewrite the historical audit above. Old maturity percentages, “current state” claims, and donor branch assumptions remain historical only.

## 1. Current implementation anchors

The AI Brain page should remain one creator workspace over canonical Brain services and Studio Controls. It must not grow a parallel chat runtime, prompt catalog, evidence store, profile store, or custom design system.

| User-facing capability | Current source owner | Integration rule |
|---|---|---|
| Main conversation, raw prompt, restore, retry, feedback and learning capture | `src/views/AIBrainCommandInterface.tsx`, `src/services/aiBrainConversationStore.ts`, `src/services/brain/BrainConversationController.ts` | Preserve raw user text and stable turn IDs. Render-safe copy is a presentation derivative only. |
| Shared chat states and response composition | `src/components/brain/BrainChatPrimitives.tsx` | Reuse `BrainChatMessageShell`, `BrainResponseSectionHeader`, `BrainChatActionButtonGroup`, `BrainPromptLibraryItem`, `BrainComposerAccessoryRow`, and `BrainResponseLayout`. These are Brain compositions, not replacements for Studio primitives. |
| Prompt and capability discovery | `src/components/brain/BrainCapabilityBrowser.tsx`, `src/services/brain/BrainCapabilityRegistry.ts`, existing prompt-card builders/registry | Availability and evidence requirements must come from the registry and current controls. Selecting a prompt uses the existing handler; opening a capability is not publication approval. |
| Evidence shown for a particular turn | `src/components/brain/BrainTurnEvidenceRibbon.tsx`, `src/components/brain/BrainClaimEvidence.tsx`, `src/services/brain/EvidenceRecord.ts` | Keep prepared, cited, unresolved, missing, stale, partial, and conflicting evidence distinct. Only verified prompt records may be presented as the exact evidence supplied to the model. |
| Data readiness and missing analytics inputs | `BrainDataReadiness` in `src/views/AIBrainCommandInterface.tsx`, `src/views/brainDataReadiness.ts`, canonical analytics/VT-SYNC diagnostics | Render real missing-input and freshness states; never infer “ready” from absent diagnostics or convert missing metrics to zero. |
| Context used and creator corrections | `BrainContextUsedDrawer` in `src/views/AIBrainCommandInterface.tsx`, `src/components/brain/BrainContextRail.tsx`, `src/components/brain/BrainContextCorrectionDialog.tsx`, `src/services/brain/CreatorContextResolver.ts` | “Available context” and “context used this turn” must remain separate. Corrections are proposals routed through the existing governance path, not silent profile mutation. |
| Runtime and output provenance | `src/components/brain/BrainRuntimePanel.tsx`, `src/services/brain/BrainRuntimeSnapshot.ts`, `src/services/brain/BrainTrace.ts`, canonical ToolReceipt/ContentBuild owners | Show a saved-output card only when its receipt and referenced asset resolve. A request, tool handoff, or generation start is not proof of a saved result. |
| Learning receipt and review | Learning receipt card in `src/views/AIBrainCommandInterface.tsx`, existing Brain learning governance services | A visible receipt must identify the canonical entry and status. Review/correction/rejection is not durable promotion unless the governance owner confirms promotion. |
| Global control visuals and interaction semantics | `src/studio-ui/primitives/StudioControls.tsx`, `src/studio-ui/index.ts`, `src/studio-ui/tokens.ts`, `src/styles/studio-control-system.css` | Use real exported controls, registered token exceptions and confirmed-library specimens. Do not create Brain-only button, input, badge, spacing or focus implementations. |

## 2. Implementation already landed — do not rebuild

The following merged PRs provide the present foundation and should be treated as source history, not as proof of full browser certification:

- [#618](https://github.com/viewtube-dev/viewtube/pull/618) — context and evidence provenance UI.
- [#621](https://github.com/viewtube-dev/viewtube/pull/621) — accessible controls and registry-backed capability launcher.
- [#649](https://github.com/viewtube-dev/viewtube/pull/649) and [#667](https://github.com/viewtube-dev/viewtube/pull/667) — prompt evidence identity and rich evidence provenance.
- [#674](https://github.com/viewtube-dev/viewtube/pull/674) — provider-neutral model gateway boundary.
- [#828](https://github.com/viewtube-dev/viewtube/pull/828) and [#829](https://github.com/viewtube-dev/viewtube/pull/829) — shared chat compositions, prompt-library items, action groups and conversation follow behavior.
- [#831](https://github.com/viewtube-dev/viewtube/pull/831) — defined conversation viewport/follow refs.
- [#833](https://github.com/viewtube-dev/viewtube/pull/833) and [#835](https://github.com/viewtube-dev/viewtube/pull/835) — shared assistant response layout and TSX correction.
- [#836](https://github.com/viewtube-dev/viewtube/pull/836) and [#838](https://github.com/viewtube-dev/viewtube/pull/838) — further Studio control alignment across the Brain shell.

These changes do not by themselves establish that restore filters survive, every output card resolves to a receipt, every interaction works at mobile widths, or keyboard/screen-reader behavior has been certified.

## 3. Front-end integration principles

### A. Make the conversation the stable center

- Keep one conversation viewport and one composer. The viewport owns vertical scrolling; the composer remains available without covering the final turn, navigation, or mobile keyboard.
- Auto-follow only when the creator is already near the bottom, on a new submitted prompt, or when the creator explicitly returns to latest. Do not pull the viewport away from older messages during passive updates.
- Keep the raw submitted text immutable in storage. Any sanitization or shortening belongs to display-only copy and must not change learning, evidence selection, or restored conversation content.
- Give every turn a stable ID and make its evidence, context, receipt, and learning disclosures refer to that same ID.

### B. Use one evidence grammar across all AI surfaces

- Use the same evidence vocabulary in chat responses, analytics answers, generated assets, runtime panels and follow-up tools: **prepared**, **cited**, **unresolved**, **missing**, **stale**, **partial**, **conflicting**, and **identity unverified**.
- Keep “evidence available to the system” separate from “evidence supplied to this model call,” and keep both separate from “evidence cited by the answer.”
- Every evidence link should carry canonical evidence ID, source/snapshot ID, metric, window, channel/project scope and recorded selection constraints where available. Opening the destination must not silently discard filters.
- A missing or empty selection should explain exactly what is unknown: “no items selected” is not the same as “the source contains no records.” An invalid manifest must withhold record-level details rather than showing a substitute evidence set.
- Use claim-level evidence only where the claim is actually backed by the referenced records. Avoid duplicating a large evidence panel under every paragraph; show a compact answer-level summary with expandable claim-level detail.

### C. Make context and correction explainable

- Provide two clear views: **context available** (profile/project/selection data that could be used) and **context used for this turn** (the exact recorded envelope or its canonical references).
- Label each context entry as creator-confirmed, inferred, temporary, or unavailable only when that state exists in the canonical record. Do not infer the label from prose or UI color.
- Corrections should preview the old value and proposed value, explain the scope, and show pending/accepted/rejected status from the governance response. A correction must not appear as a saved fact before the canonical owner confirms it.
- Preserve context revision, channel/project/content-build IDs and turn ID across corrections and restored sessions so stale context is detectable.

### D. Treat actions and results as an auditable state machine

- Keep action states explicit: **available → prepared → running → completed/failed → saved/unsaved → reviewed/approved** as supported by the canonical owner. Do not collapse these into a green badge.
- Every generated output card must resolve to a canonical output asset/version and ToolReceipt. If the receipt is absent, unresolved or points to missing assets, show a truthful blocked/unverified state rather than a success card.
- Retry may repeat generation but must not repeat an external side effect unless the canonical operation contract explicitly permits it.
- A tool handoff is review-only by default. Publishing approval, scheduling and durable learning promotion remain distinct governed actions.
- Learning UI should separate feedback on one answer, a proposed learning candidate, review status and promoted durable knowledge.

### E. Accessibility is a behavior contract

- Use native buttons, inputs, disclosure semantics and headings wherever possible. Every icon-only action needs a stable accessible name; selected states use `aria-pressed` or an equivalent semantic state, and disabled actions expose a readable reason nearby.
- Ensure focus remains predictable when drawers/dialogs open and close; restore focus to the triggering control. Escape closes transient surfaces where appropriate, without losing unsaved creator input.
- Announce only meaningful turn/status changes through a polite live region; do not repeatedly announce the entire transcript. Streaming text must not trap keyboard focus.
- Support keyboard-only use, mobile touch targets, narrow widths, landscape, zoom/reflow, reduced motion and safe-area/virtual-keyboard layouts.
- Keep color supplemental: labels and text must communicate partial, stale, unavailable, error and success states without relying on color alone.

## 4. Next implementation and verification phases

Work in small PRs against `master/consolidated-feature-integration`; do not mark a phase complete from a merged PR alone.

1. **CI and test-contract repair.** Make the new chat composition tests use dependencies actually installed by this repository, or add and lock the required test dependencies intentionally. Do not suppress typecheck errors. Separate known Studio-control contract failures from Brain-specific failures.
2. **Conversation restore contract.** Add a regression test proving raw text, evidence manifest IDs, evidence selection constraints, and context revision survive save → restore → next turn. If filters are not currently persisted, add them to the existing turn metadata owner rather than a new store.
3. **Output-card lineage.** Audit each visible “saved/generated” result path against ToolReceipt, output asset/version and ContentBuild IDs. Add a canonical link or explicit unresolved state; do not invent receipts.
4. **Truthful states and action feedback.** Verify empty, unavailable, stale, partial, mismatched, interrupted, retrying, completed-but-unsaved, and rejected-learning states. All states must use canonical status sources.
5. **Accessibility and responsive certification.** Run focused tests, typecheck, production build, keyboard-only flows, screen-reader semantics, reduced-motion checks, mobile viewport/virtual keyboard and scroll-follow tests, and console/network inspection. Capture screenshots at representative mobile and desktop widths.
6. **Final cross-system acceptance.** Follow one real turn from raw prompt through prompt evidence manifest, response citations, context snapshot, action receipt/output reference, creator feedback and learning governance. Record IDs at every step and report any unresolved edge explicitly.

## 5. Current verification caveat

As of this addendum, source review confirms that the shared chat compounds and turn-evidence disclosures are present in the integration branch. It does **not** establish full behavior or visual certification. Recent CI for the Brain UI follow-up had the Brain quality-loop, production build and local-smoke jobs passing, while source-governance and focused-contract jobs failed and static-quality reported test/dependency/type errors. The precise failures must be rechecked against the current run before being called fixed; some failures originate in the shared Studio Controls contract and should not be disguised as Brain regressions.

The current execution plan remains [AI Brain Chat — Studio Primitive Build Plan](../../brain/AI_BRAIN_CHAT_STUDIO_PRIMITIVES_BUILD_PLAN_2026-10-23.md) and [AI Brain Toolbox + Chat Overhaul](../../brain/AI_BRAIN_TOOLBOX_CHAT_REDESIGN_AND_IMPLEMENTATION_PLAN_2026-10-19.md). This addendum connects their current implementation to PR #241 without treating the historical donor as live source authority.


---

## Implementation status update — 2026-10-23

The following follow-up work is now merged into `master/consolidated-feature-integration`:

- [#844 — PR241 design-to-implementation bridge](https://github.com/viewtube-dev/viewtube/pull/844): connects historical product ideas to current AI Brain source owners and records the next implementation gates.
- [#845 — chat primitive test dependency fix](https://github.com/viewtube-dev/viewtube/pull/845): removes the unsupported DOM-testing dependency from chat primitive render-contract tests.
- [#846 — evidence and context provenance restore coverage](https://github.com/viewtube-dev/viewtube/pull/846): adds round-trip assertions for request constraints, prompt evidence IDs/records, context revision and creator-context snapshot.
- [#848 — remaining Studio control migration](https://github.com/viewtube-dev/viewtube/pull/848): migrates quick-action cards, profile coverage actions and the context-correction dialog to canonical Studio controls.

**Open follow-ups:**
- [#849 — standardize workflow and learning inbox controls](https://github.com/viewtube-dev/viewtube/pull/849): migrates workflow actions, live handoff actions, evidence-tracing controls and governed learning review/promotion actions.
- [#851 — standardize user and settings controls](https://github.com/viewtube-dev/viewtube/pull/851): migrates Brain user-policy checkboxes, settings switches, and panel actions to canonical Studio controls. A shared range-slider primitive remains a system-level gap.

**Verification caveat remains:** merges are not a substitute for green CI or browser certification. The latest observed runs still reported shared Studio Controls export/type failures and a source-governance assertion; production build, local smoke and Brain quality-loop passed on the recent control-sweep run, while full-suite was still running at the last check. Re-check the current run before treating any gate as resolved. Keyboard/screen-reader behavior, mobile virtual-keyboard/scroll behavior and the end-to-end turn lineage still require explicit certification.
