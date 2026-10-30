# Twenty Complete Workflows — Execution Plan

**Date:** 2026-10-30  
**Status:** implementation plan; no workflow is certified complete by this document  
**Canonical transport:** `ViewTubeActionPacket` in `src/services/viewTubeToolChains.ts`  
**Canonical workflow state:** `workflowEngine.ts`  
**Canonical asset/project/evidence owners:** existing Projects, ContentBuild, Asset Engine/Vault, Publisher, Analytics, Outcomes, and BrainRuntime systems.

## Non-negotiable implementation rules

1. Every hop uses the existing `ViewTubeActionPacket`; do not introduce bespoke transports.
2. Workflow state remains in `workflowEngine.ts`; packet cache remains the packet cache; assets remain in Vault/ContentBuild.
3. Every `external-write` hop requires creator approval and must pass the existing production handoff validation boundary.
4. Preserve one `workflowId` across a workflow and a fresh `operationId` per execution using the existing chain packet factory.
5. Advance steps only from actual handoff-inbox transitions. Never synthesize accepted/completed state.
6. Each workflow needs a canonical chain template (where new), producer/receiver wiring, contract coverage, and evidence-ID preservation assertions.
7. Extend existing owners. No second Brain runtime, packet protocol, workflow store, asset store, analytics store, or capability registry.
8. Handoff is not publication approval. Learning candidates remain candidates until the existing governance process accepts them.

## Wave 1 — Foundation certification

### WF-01 · Comment → Brain → Project
**Path:** Comment Responder → AI Brain → Projects + Calendar.  
**Build:** connect the existing audience-request producer and Brain consumer to a Projects receiver. Prefill a project draft from the packet payload; preserve comment text and all source evidence IDs on the draft/project record. Require explicit creator confirmation before project creation.  
**Acceptance:** a contract test proves evidence IDs survive into the confirmed project; no project is created merely by receiving a packet.

### WF-02 · Thumbnail → Publish
**Path:** Thumbnail Studio → Video Publisher → Video Manager.  
**Build:** certify Publisher and Manager receivers for thumbnail packets; retain ContentBuild identity, asset ID, generating-tool provenance, and origin receipt.  
**Acceptance:** an integration contract proves the exact generated thumbnail and provenance receipt arrive in the publish package without a duplicate asset.

### WF-03 · Metadata → Publish
**Path:** Metadata Master → optional Thumbnail Studio → Video Publisher.  
**Build:** wire the missing Publisher receiver and join metadata into the canonical publish package. Reuse existing Manager/Metadata Master integrations.  
**Acceptance:** metadata identity and evidence survive the handoff; no parallel publication package is created.

### WF-04 · Vault Asset → Editor
**Path:** Creator Vault → VT_E1 Editor.  
**Build:** accept canonical asset packets and stage the referenced asset on the editor timeline with its Vault provenance.  
**Acceptance:** asset ID and provenance are visible in editor state; no provider-only asset bypasses Asset Engine/Vault lineage.

### WF-05 · Analysis → Metadata → Packaging
**Path:** Content Analysis → Metadata Master → Thumbnail Studio → Pre-Launch Priming.  
**Build:** emit and consume analysis packets; carry the same evidence pack through metadata, thumbnail, and launch preparation.  
**Acceptance:** one evidence trail is inspectable across all four tools.

## Wave 2 — Remaining pilots

### WF-06 · Editor Missing-Shot Recovery
**Path:** Editor → Brain → Video Director → Asset Engine → Editor.  
**Build:** carry selected timeline range/context, generate candidate shots, register canonical output and lineage through Asset Engine, and return only the creator-selected variant. Use cheap preview before final generation.  
**Acceptance:** timeline context survives; exactly one selected canonical asset is committed and staged.

### WF-07 · 72-Hour Launch Review
**Path:** Publisher → Analytics → Daily Oracle → Video Autopsy → Video Manager.  
**Build:** carry the exact ApprovedPublishSnapshot reference; attach comparable analytics checkpoints; keep interpretation read-only until an explicit intervention proposal.  
**Acceptance:** the exact snapshot ID survives every hop; no premature edit recommendation occurs before the review window; no-change is a valid outcome.

### WF-08 · Missing Asset Finder
**Path:** Asset Engine → Vault → Generator/Research → Asset Engine → Projects.  
**Build:** resolve each empty package slot against existing Vault assets first; generate only when no suitable asset exists; retain slot-level provenance and readiness updates.  
**Acceptance:** no generation request is emitted when a Vault match exists; each filled slot has a traceable source.

### WF-09 · Thumbnail Refresh Experiment
**Path:** Video Manager → Thumbnail Studio → Variant Comparator → Video Manager → Analytics.  
**Build:** capture baseline package snapshot; create candidate variants with rationale; record selected and actually used variant IDs; gate Manager mutation on creator approval; send used-variant receipt to Analytics.  
**Acceptance:** baseline and used-variant receipts are queryable after publication; no unapproved live mutation occurs.

### WF-10 · Opportunity → Tactic → Experiment
**Path:** Opportunity Radar → Tactics Engine → Hook Generator and/or Thumbnail Studio → Projects.  
**Build:** connect existing widget producer and tactic chain; preserve opportunity evidence and carry experiment identity into the project.  
**Acceptance:** source evidence IDs trace into the experiment record; creator can choose or reject the recommendation.

## Wave 3 — Audience and lifecycle loops

### WF-11 · Audience Request → Content Wave
**Path:** Comment Responder batch → Brain clustering → Community Posts → Projects.  
**Build:** extend WF-01 for batch selection and intent clustering; produce proposals for creator review.  
**Acceptance:** no automatic community post; creator edits and approvals are recorded through existing feedback/governance paths.

### WF-12 · Script → Full Production Package
**Path:** Script Architect → Storyboard Studio → Asset Engine → Thumbnail Studio → Editor.  
**Build:** carry project style and Vault inventory; derive shot list and explicit package-slot requirements; reuse WF-08's reuse-before-generate loop.  
**Acceptance:** every required package slot is explicit and reuse-before-generate is enforced.

### WF-13 · Storyboard → Generated Sequence
**Path:** Storyboard Studio → Concept Scene Studio → Video Director → Vault → Editor.  
**Build:** preserve continuity fingerprint (subject, lens, palette, and other declared constraints); require hero-frame approval before video generation; version the shot collection.  
**Acceptance:** selected sequence retains locked continuity properties and versioned asset lineage.

### WF-14 · Longform → Shorts
**Path:** Video Manager → Shorts Extraction → Brain → Editor → Video Publisher.  
**Build:** carry source-video, transcript, and chapter evidence; rank clips for standalone payoff; link every derived Short to the source packet.  
**Acceptance:** each Short preserves parent packet and source-video lineage.

### WF-15 · Evergreen Revival
**Path:** Performance Hub → Opportunity Radar → Video Manager → Thumbnail Studio → Community Posts.  
**Build:** require fresh, comparable evidence before generating revival copy or promotion proposals; preserve incremental evaluation windows.  
**Acceptance:** stale evidence blocks promotion generation; revival is evaluated incrementally rather than by lifetime totals alone.

## Wave 4 — Governance and closure

### WF-16 · Underperforming Upload Rescue
**Path:** Video Autopsy → Brain → Thumbnail Studio → Metadata Workbench → Video Manager → Analytics.  
**Build:** serialize one hypothesis at a time; preserve baseline snapshot and predeclared evaluation window; gate each live change.  
**Acceptance:** a rescue experiment records baseline, single hypothesis, approved change, evaluation window, and comparable metric.

### WF-17 · Packaging Learning Loop
**Path:** Thumbnail Studio → Publisher → Analytics → Evaluation → Brain Learning.  
**Build:** join the exact used-variant receipt to outcomes; create governed learning candidates through the existing algorithm-learning governance. Never auto-promote.  
**Acceptance:** the system records either a governed lesson or an explicit no-promotion decision.

### WF-18 · Hook Learning Loop
**Path:** Hook Generator → Editor → Publisher → Retention Lab → Brain Learning.  
**Build:** record exact used-hook ID at publication and compare retention over a format-compatible window.  
**Acceptance:** attribution is hook-level, not merely video-level; evidence comparability is explicit.

### WF-19 · Project Postmortem
**Path:** Projects → Analytics → Outcome Ledger → Brain → Vault.  
**Build:** reconstruct plan-versus-actual from canonical workflow history and artifact links; preserve rejected directions; gate learning on evidence quality.  
**Acceptance:** the postmortem references every relevant artifact ID and clearly distinguishes observed outcomes from interpretation.

### WF-20 · Full Creator Improvement Loop
**Path:** Daily Oracle → WF-01…WF-19 → Publisher → Analytics → Outcomes → Evaluation → Brain Learning → next Daily Oracle.  
**Build:** compose existing workflows rather than implement a new umbrella engine; require outcome/evaluation closure fields on consequential packets; route promotion through existing governance.  
**Acceptance:** one complete cycle is traceable end-to-end under canonical identity, with an explicit governed learning or no-learning result.

## Delivery order

1. Certify WF-01…WF-05 against the existing runtime and current test locations.
2. Implement WF-06…WF-10 as the remaining five pilots.
3. Implement WF-11…WF-15 audience and lifecycle flows.
4. Implement WF-16…WF-20 only after outcome/evaluation closure is available.

The compact-widget promotion contract and broad widget promotion wave (C1/C8) remain separate work. They are surface restructuring, not prerequisites to creating another workflow transport.

## Per-workflow definition of done

- [ ] Chain template exists in the canonical registry where required.
- [ ] Producer and receiver use the existing ActionPacket and governed capability metadata.
- [ ] Required context is validated by the existing compatibility/context gate.
- [ ] Evidence IDs, canonical object IDs, and provenance survive the hop.
- [ ] Every external write is approval-gated and validated.
- [ ] Workflow step status reflects actual inbox state.
- [ ] Focused contract tests, lint, and scoped type checks pass.
- [ ] No duplicate persistence owner or parallel registry/store is introduced.
