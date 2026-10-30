# Toolbox Promotion + Workflow Chain Convergence — To Do

**Status:** PROPOSAL / RECONCILIATION WORKSPACE  
**Permanent VT task IDs:** NOT ALLOCATED  
**Baseline:** main at 3ed2bc91f324338fd110a160d65ddbed93806142

## Phase 0 — Current-main reconciliation

- [ ] Re-audit current main immediately before implementation.
- [ ] Build capability matrices for the twenty promotion/consolidation candidates.
- [ ] Classify each as KEEP_WIDGET / PROMOTE_TOOLBOX / WIDGET_PLUS_TOOLBOX / MERGE_WORKBENCH / RETIRE_AFTER_PARITY.
- [ ] Verify every proposed owner against Product Architecture and Domain Authorities.
- [ ] Identify all existing persisted widget IDs affected by merge/rename.
- [x] Audit the core ActionPacket/SendToMenu runtime foundation (capability registry, SendToMenu, ThumbnailHandoffBar, workflow learning, WorkflowChainBuilder).
- [ ] Complete the exhaustive producer/consumer inventory across all tools/widgets.
- [ ] Identify overlap with system-convergence OperationRecord work.
- [ ] Produce no-loss donor map for existing widget consolidation plans.

### Checkpoint 0

- [ ] No candidate is based only on file size.
- [ ] No new backend owner is proposed for an already-owned capability.
- [ ] Existing tasks/plans have been linked instead of duplicated.

## Phase 1 — Shared promotion + handoff contracts

- [ ] C1 define compact-widget → Toolbox open/resume context contract.
- [ ] C1 add return/resume behavior contract.
- [x] C2 confirm accepts / produces already exist in VIEWTUBE_TOOL_CAPABILITIES.
- [ ] C2 extend metadata with requiredContext / mutationClass / resumable destination / explicit suggested handoffs where needed.
- [ ] C2 bridge universal tool capability metadata with WidgetRegistry rather than duplicating fields.
- [ ] C2 add mutation/external-write classification.
- [ ] C2 add registry validation tests.
- [ ] C3 reconcile operation/workflow identity with system-convergence plan.
- [ ] C10 add identity-continuity fixtures.

### Checkpoint 1

- [ ] Two unrelated widget/tool pairs can use the same promotion contract.
- [ ] Tool compatibility can be determined without bespoke hard-coded branching.
- [ ] Project/ContentBuild/video/asset/evidence identity survives a test handoff.

## Phase 2 — Five pilot chains

### Pilot A — Thumbnail Refresh Experiment
- [ ] Manager → Thumbnail Studio handoff.
- [ ] variant provenance + selected/used variant.
- [ ] return to Manager.
- [ ] analytics/evaluation binding.
- [ ] preserve baseline package snapshot.

### Pilot B — Comment → New Video
- [ ] Comment Operations audience-request packet.
- [ ] Brain opportunity interpretation.
- [ ] Project creation handoff.
- [ ] preserve source comment evidence IDs.

### Pilot C — Editor Missing-Shot Recovery
- [ ] Editor selection/range context packet.
- [ ] Video Director generation request.
- [ ] Asset Engine canonical output/lineage.
- [ ] return selected candidate to Editor.
- [ ] no direct provider-only durable asset path.

### Pilot D — 72-Hour Launch Review
- [ ] ApprovedPublishSnapshot handoff.
- [ ] comparable analytics evidence.
- [ ] Daily Oracle / Autopsy interpretation.
- [ ] Video Manager intervention proposal.
- [ ] explicit no-change path.

### Pilot E — Missing Asset Finder
- [ ] package-slot requirement packet.
- [ ] Vault existing-asset lookup first.
- [ ] conditional generator/research handoff.
- [ ] Asset Engine slot assignment.
- [ ] readiness refresh.

### Checkpoint 2

- [ ] All five pilots use the same packet vocabulary.
- [ ] At least three materially different asset/evidence types are supported.
- [ ] External writes remain behind creator approval.
- [ ] Every generated artifact retains provenance.

## Phase 3 — Workflow registry + chain viewer

- [x] C4 confirm existing VIEWTUBE_SUGGESTED_TOOL_CHAINS foundation (8 templates).
- [ ] C4 generalize the existing suggested-chain model into the structured workflow-recipe schema.
- [ ] Encode the forty recipes from the specification.
- [ ] Validate tool IDs and payload compatibility.
- [ ] Mark external-write boundaries.
- [ ] Mark required Project/ContentBuild/video/asset/evidence context per recipe.
- [x] C5 confirm existing WorkflowChainBuilder/workflowEngine chain, step, status, artifact and provenance foundation.
- [ ] C5 converge existing chain builder with universal ActionPacket/GenerationRecord/ContentBuild receipts.
- [ ] Show source, transformations, destinations, artifacts, evidence, approval state and outcomes.
- [ ] Extend/normalize paused/stopped/failed/complete states without creating a second workflow store.

### Checkpoint 3

- [ ] Recipe catalog is a reusable projection, not a hidden task ledger.
- [ ] Chain viewer can reconstruct one full pilot from receipts/packets.
- [ ] Missing provenance is displayed as missing rather than invented.

## Phase 4 — Core promotion wave

- [ ] Video Director capability matrix.
- [ ] Video Publisher capability matrix.
- [ ] Video Manager capability matrix.
- [ ] Video Autopsy capability matrix.
- [ ] Daily Oracle capability matrix.
- [ ] Brain Hub capability matrix.
- [ ] Comment Operations capability matrix.
- [ ] Longform Optimization capability matrix.
- [ ] Video Asset Engine capability matrix.
- [ ] Thumbnail Studio family capability matrix.
- [ ] Define compact Dashboard signature for every WIDGET_PLUS_TOOLBOX candidate.
- [ ] Define internal Toolbox pages/modes for promoted workstations.
- [ ] Add persisted-layout migration plans before any widget ID retirement.

### Checkpoint 4

- [ ] No promoted Toolbox embeds WidgetShell.
- [ ] No Dashboard widget mounts a full Studio Toolbox as a shortcut.
- [ ] Capability parity is explicit where Dashboard and Studio expose the same job.

## Phase 5 — Domain workbench consolidation

- [ ] Metadata / SEO Workbench consolidation matrix.
- [ ] Retention Lab consolidation matrix.
- [ ] Keyword Intelligence consolidation matrix.
- [ ] Publishing Calendar consolidation matrix.
- [ ] Audience Intelligence consolidation matrix.
- [ ] Discovery & Distribution consolidation matrix.
- [ ] Monetization Intelligence consolidation matrix.
- [ ] Harvest unique behavior from every donor widget before retirement.
- [ ] Migrate persisted IDs/layout state where required.
- [ ] Remove old implementations only after parity + zero reachability.

## Phase 6 — Brain ranking + creator preference

- [ ] C6 rank destinations using packet type + Project context + evidence + User Controls.
- [ ] Always expose compatible manual destinations.
- [ ] Never suggest destinations lacking required context.
- [x] C7 accepted/rejected handoff preference signals are already creator-learning gated.
- [ ] Certify privacy/retention/freshness semantics for the existing preference store.
- [ ] Route any broader promotion of preference feedback through governed outcome/evaluation learning rather than direct model memory.

## Phase 7 — Outcome / evaluation closure

- [ ] C11 define expected outcome/evaluation fields for consequential recipes.
- [ ] Attach exact used variant or approved snapshot where relevant.
- [ ] Reuse canonical metric-comparability guard.
- [ ] Add evaluation checkpoint semantics.
- [ ] Prove one packaging pilot closes action → outcome → evaluation → learning-candidate path.

## Phase 8 — Responsive + accessibility certification

- [ ] C12 desktop.
- [ ] C12 narrow desktop/tablet.
- [ ] C12 mobile portrait.
- [ ] C12 mobile landscape.
- [ ] loading.
- [ ] empty.
- [ ] disconnected.
- [ ] stale.
- [ ] error.
- [ ] keyboard/focus.
- [ ] touch target / scroll / overflow.
- [ ] screenshot analysis under Verification contract.

## Final checkpoint

- [ ] Dashboard acts as compact instrument panel rather than a set of mini-apps.
- [ ] Promoted workstations use canonical Toolbox/SubToolbox primitives.
- [ ] Forty workflows reuse shared contracts rather than forty bespoke integrations.
- [ ] Project/ContentBuild/asset/evidence identities survive supported chains.
- [ ] External writes are creator-controlled.
- [ ] Generated assets and AI outputs retain operation/prompt/model/provenance receipts.
- [ ] No duplicate canonical persistence owner was introduced.
- [ ] Any removed widgets have capability-parity and layout-migration evidence.
- [ ] Exact Task Authority identities are reconciled before permanent VT task allocation.


## Phase 2b — Twenty complete workflows

**Execution plan:** `tasks/toolbox-workflow-convergence/PLAN-TWENTY-COMPLETE-WORKFLOWS.md` (to be added in this branch).  
**Rule:** each workflow requires a canonical ActionPacket hop, real inbox-state advancement, preserved evidence IDs, an approval gate for external writes, a focused contract test, and no new persistence owner.

### Wave 1 — Foundation certification

- [ ] WF-01 — Comment → Brain → Project; preserve source comment evidence IDs; require creator confirmation before project creation.
- [ ] WF-02 — Thumbnail → Publisher → Manager; preserve ContentBuild identity and generating-tool provenance.
- [ ] WF-03 — Metadata Master → optional Thumbnail Studio → Publisher; join the existing publish package rather than create a parallel copy.
- [ ] WF-04 — Vault asset → Editor; stage the canonical asset with provenance.
- [ ] WF-05 — Content Analysis → Metadata Master → Thumbnail Studio → Pre-Launch; preserve one evidence trail.

### Wave 2 — Remaining pilots

- [ ] WF-06 — Editor missing-shot recovery; retain timeline range and commit only the selected canonical asset.
- [ ] WF-07 — 72-hour launch review; carry the exact ApprovedPublishSnapshot and comparable analytics evidence.
- [ ] WF-08 — Missing Asset Finder; search Vault before generating and preserve package-slot provenance.
- [ ] WF-09 — Thumbnail refresh experiment; preserve baseline, selected/used variant, and approval-gated Manager update.
- [ ] WF-10 — Opportunity → Tactic → Experiment; preserve opportunity evidence and experiment identity.

### Wave 3 — Audience and lifecycle

- [ ] WF-11 — Batched audience request → Brain clustering → Community proposal → Project; never auto-post.
- [ ] WF-12 — Script → storyboard → Asset Engine → thumbnail → Editor; enforce reuse-before-generate.
- [ ] WF-13 — Storyboard → generated sequence; preserve continuity fingerprint and hero-frame approval.
- [ ] WF-14 — Longform → Shorts; retain parent packet and transcript/chapter evidence lineage.
- [ ] WF-15 — Evergreen revival; block promotion copy when freshness evidence is stale.

### Wave 4 — Governance and closure

- [ ] WF-16 — Underperforming upload rescue; serialize one hypothesis at a time and preserve baseline/window.
- [ ] WF-17 — Packaging learning; use exact used-variant receipt and governed, non-automatic learning promotion.
- [ ] WF-18 — Hook learning; attribute the exact used hook to a comparable retention window.
- [ ] WF-19 — Project postmortem; reference every artifact and preserve rejected directions.
- [ ] WF-20 — Full creator improvement loop; close action → outcome → evaluation → governed learning → next cycle.

### Phase 2b verification gate

- [ ] Verify each chain against the current capability registry and real producer/receiver paths before marking implementation complete.
- [ ] Extend existing contract tests; do not create a parallel chain registry or packet protocol.
- [ ] Prove evidence-ID preservation for every workflow.
- [ ] Prove creator approval for every external-write hop.
- [ ] Confirm paused/stopped/failed/complete state derives from real inbox/workflow state.
- [ ] Record focused lint, Vitest, and scoped type-check evidence per workflow.


### WF-01 — Live receiver audit (2026-10-30)

**Status: BLOCKED AT RECEIVER / CREATOR-APPROVAL BOUNDARY — do not mark complete.**

Verified against the current integration branch:

- [x] Comment Responder/Audience Pulse producer emits the canonical ViewTubeActionPacket and carries source evidence IDs.
- [x] Brain handoff inbox persists packet identity, evidence, provenance, workflow and operation identity.
- [x] Brain live integration validates packet compatibility against the registered destination.
- [x] ProjectCreationDialog uses initializeProjectContentIdentity before addProject/setActiveProject.
- [ ] `project-calendar` receiver consumes the incoming packet and presents a prefilled Project draft.
- [ ] Prefill maps only explicitly supported fields and preserves packet/evidence/provenance references.
- [ ] Draft review is distinct from accepting the handoff.
- [ ] Explicit creator confirmation is required before the existing Project creation path runs.
- [ ] Rejection/dismissal creates no Project and does not complete the handoff.
- [ ] Confirmed creation is idempotent and links the resulting Project/ContentBuild to the originating packet.
- [ ] Regression tests cover evidence continuity, duplicate delivery, rejection/no-create, and confirmed create.

**Safety findings:**

1. `BrainLiveToolInbox` currently labels its action "Load into tool" but calls `acceptToolIntegration` immediately after prefill. This collapses review and acceptance.
2. At least one consumer (`useCommunityPostController`) reads pending integrations and calls open + accept while applying a draft in an effect. That behavior must not be copied into Project creation.
3. `project-calendar` currently does not declare `evidence` in its accepted payload kinds. Do not advertise it as a compatible evidence receiver until the actual receiver exists and is tested.
4. `ViewTubeHandoffReceiver` is a URL packet loader/display component; it does not itself provide the durable inbox-state/creator-approval semantics WF-01 requires.
5. The Project receiver should reuse `ProjectCreationDialog` and `initializeProjectContentIdentity`; do not add a second Project store, create directly from packet payloads, or auto-call `addProject`.

**Verification limitation:** GitHub file APIs permit source inspection and commits but do not provide a local checkout/test runner. No runtime code was changed and no Vitest/lint/typecheck result is claimed. Before implementation, run the repository's actual focused tests in a checkout; add the new contract tests first (RED), then implement the smallest receiver path (GREEN).


### WF-01 — Receiver integration design decision (2026-10-30)

**Canonical UI entry point:** `src/components/projects/ProjectBuilderModule.tsx`, not a new route or project store. It already owns the shared `ProjectCreationDialog` and workspace scope. The `project-calendar` capability route resolves to `/projects`.

**Draft handoff path:**

1. Mount `BrainLiveToolInbox destinationToolId="project-calendar"` in Project Builder.
2. Extend the inbox prefill callback with an optional handoff context (handoff ID + packet ID + source/evidence/provenance identity); preserve existing one-argument consumers.
3. For the Project receiver only, opening/loading a packet must leave it in `opened`; do not call `acceptToolIntegration` merely because prefill was applied.
4. Add a typed, allow-listed Project draft mapper. Do not spread arbitrary packet payload properties into a `Project`. Keep the originating packet ID, source tool, evidence IDs, and provenance available to the confirmation flow.
5. Pass the draft into the existing `ProjectCreationDialog` as initial values. Keep fields editable. Dialog close/reject must not call `addProject` or mark the handoff complete.
6. On explicit Initialize Project action, validate the draft, initialize canonical Project/ContentBuild identity with `initializeProjectContentIdentity`, then persist through `addProject` / `setActiveProject`. Only after successful creation should the handoff transition to accepted/completed and record its resulting Project identity.
7. Make confirmation idempotent. A retry after successful creation must resolve the already-created Project from a canonical packet-to-project association, not create another Project. This association must extend the existing handoff/Project identity owner; do not create a second localStorage registry.

**Required regression tests (write first):**

- A compatible comment/evidence packet appears in Project Builder and remains `opened` after prefill (not accepted/completed).
- Only explicitly allow-listed fields populate the Project draft; unknown payload keys are ignored.
- Evidence IDs, packet ID, source tool, provenance, channel and existing Project/ContentBuild context remain available after prefill.
- Closing/rejecting the draft creates no Project and leaves a dismissible handoff.
- Explicit confirmation calls the canonical identity initializer and creates exactly one Project/ContentBuild.
- Repeated confirmation/re-delivery resolves the same Project and does not duplicate it.
- A failed identity initialization leaves the handoff uncompleted and permits a safe retry.
- Existing inbox consumers retain their current callback compatibility; review/acceptance semantics are not silently changed for unrelated destinations.

**Known contract mismatch:** current `project-calendar.accepts` omits `comment` and `evidence`. Do not add either until the receiver and tests above exist. The producer should target the Project capability only with a payload kind that the typed mapper actually supports, or the shared capability contract must be deliberately extended alongside the receiver.

**Current limitation:** source inspection is complete enough to specify the integration boundary, but this environment cannot resolve GitHub for a local checkout and GitHub file APIs cannot execute Vitest. No runtime implementation or test result is claimed.
