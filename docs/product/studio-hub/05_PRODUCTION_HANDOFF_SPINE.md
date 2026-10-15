# Production Handoff Spine — Publishing, Analysis, Analytics, Prompts, Brain, and Studio Hub

**Status:** implementation foundation in progress; production certification is still required  
**Target branch:** `master/consolidated-feature-integration`  
**Implementation branch:** `work/production-handoff-spine-2026-10-15`

## Purpose

Connect the existing ViewTube systems through one inspectable, typed handoff chain. This extends the canonical ActionPacket/Handoff, ContentBuild, Vault/Asset Engine, Publishing, Analytics, Evaluation, and Brain owners. It does **not** create a second workflow database, prompt registry, analytics store, asset store, or Brain runtime.

The Studio Hub is the creator-facing workflow surface. It should reveal the path and state of the work; Projects owns execution state; specialized tools own their transformations; Publisher owns publication; Manager owns live published-video edits; Analytics owns measurement; AI Brain owns validated durable knowledge; and Creator Strategy Engine owns cross-tool synthesis.

## Canonical production lifecycle

```text
Creator / Account Context + Project
                |
                v
     Context Resolver + Prompt Registry
       (recipe/version/context manifest)
                |
                v
       Analysis / Specialist Tool
                |
                v
    Typed ViewTubeActionPacket (handoff)
       | workflowId + operationId
       | canonical object references
       | evidence + prompt provenance
       | approval / mutation intent
       v
       Destination Tool / Studio Hub
                |
                +--> GenerationRecord / Tool Receipt
                +--> Vault / Asset Engine artifact
                +--> ContentBuild event + asset/version link
                |
                v
     Publisher: Approved Snapshot + PublishTransaction
                |
                v
      Verified Publication Identity Receipt
                |
                v
      VT-SYNC / Canonical Analytics Checkpoint
                |
                v
    Outcome + Evaluation Ledger (scoped evidence)
                |
                v
    Brain review candidate (not auto-promoted)
                |
                v
  Creator-approved Brain knowledge / strategy finding
                |
                v
  Studio Hub → Projects ActionPacket → next work
```

This is a graph with optional branches, not a mandatory sequence for every creator. Handoffs transport references and decisions; they do not transfer ownership or external-write permission.

## One identity envelope across the chain

Every newly created ActionPacket now receives a `workflowId` and `operationId` unless the producer explicitly supplies them. Related operations can preserve `parentPacketId`, `recommendationId`, and `experimentId`. Existing packets are read compatibly and marked `identityMode: "legacy-derived"` when IDs must be derived from the packet ID. A legacy fallback is compatibility, not proof of end-to-end identity certification.

Where available, the envelope also carries:

- creator, Project, ContentBuild, channel, published video, and selected asset IDs;
- evidence references and context-manifest ID;
- prompt recipe ID and version (never raw prompt or private source text by default);
- expected/approved snapshot IDs and hashes;
- intent, approval state, named approver, approval timestamp, and idempotency key;
- experiment/recommendation references and resume route.

The same identifiers are copied into Brain inbox projections, GenerationRecord metadata, Vault artifact metadata, and ContentBuild handoff events. Existing stores remain the specialized owners of their records.

## Destination validation and mutation safety

The shared production-handoff validator checks:

1. Packet/source identity and that the destination is not the source tool.
2. Payload compatibility against the canonical tool capability registry.
3. Destination readiness and declared required context.
4. Paired prompt recipe ID/version provenance.
5. Approved snapshot hash consistency when an expected hash is supplied.
6. Explicit named creator approval, approval timestamp, and an idempotency key when an `execute` intent targets an external-write capability.

An external-write packet is not accepted for execution merely because it can be routed. Preparation and proposal handoffs remain safe defaults. Video Publisher and Video Manager continue to own their respective external mutation flows and must independently confirm their normal approval/remote-success contracts. The handoff validator is a guardrail, not a replacement publishing API.

The Brain handoff consumer now uses this validator when listing and accepting packets. Completion requires an accepted handoff, a still-present packet, a registered destination, and a valid contract. Completed workflow learning uses the packet's workflow identity when the caller does not provide a chain identity.

## Prompt and analysis continuity

Prompt provenance is represented by recipe ID/version, context-manifest ID, and the existing metadata-operation receipts. Do not persist raw prompt text or private source text simply to connect systems. Each analysis result should preserve:

- the source content/version it analyzed;
- evidence IDs and metric/window definitions;
- uncertainty, validation state, and known limitations;
- prompt recipe/version and context manifest;
- generated output/asset IDs and the next typed handoff.

The canonical Prompt Registry remains the authority for prompt definitions. The handoff packet records which recipe/version was used; it does not become a second prompt registry.

## Publication → analytics → Brain closure

Publication identity must bind the exact ContentBuild, Project association status, PublishTransaction, ApprovedPublishSnapshot ID/hash, selected asset/variant IDs, channel, YouTube video, and decision/workflow lineage.

Analytics checkpoints and evaluations must only join evidence for that exact publication and compatible channel/snapshot/window. Missing metrics remain unknown. A temporal association is not causal proof. Outcome records preserve their source record, trace, asset/version, evidence, checkpoint, and idempotency identity. Brain candidates remain review-only until the configured evidence threshold and explicit named creator approval are satisfied.

The Studio Hub should expose this as a timeline/chain view over existing receipts—not as a second workflow state store—with:
**source → transformation → destination → exact packet → produced artifact/version → evidence → approval → measured outcome → Brain decision**.

## Studio Hub handoff UX contract

Every handoff should expose, where practical:

- **From / To** — canonical tool IDs and human labels.
- **Object** — payload type and canonical Project/ContentBuild/video/asset references.
- **Why** — requested action and expected outcome.
- **Evidence** — evidence IDs, source window, confidence and uncertainty.
- **Prompt** — recipe/version and context-manifest reference when applicable.
- **State** — queued, opened, accepted, blocked, completed, dismissed, failed or resumable status.
- **Approval** — required/not required, decision, approver and timestamp.
- **Next step** — destination route/resume target and what the creator needs to do.
- **Lineage** — workflow/operation/parent-packet IDs and output receipts.

A blocked handoff should show the precise missing context or safety condition, not silently disappear or route to an incompatible tool. A creator can review, edit, accept, defer or dismiss; the system does not infer external permission from a recommendation.

## Ownership and integration map

| Concern | Canonical owner | Handoff responsibility |
|---|---|---|
| Creator/account permissions | Account / Creator Context | Supplies scoped identity; never infer identity from free text |
| Project, tasks, milestones, experiments | Projects | Owns execution state and next actions |
| Prompt definitions | Prompt Registry / Prompt System | Recipe and version provenance in each operation |
| Analysis and interpretation | Specialist analysis tools | Evidence-backed, typed result with uncertainty |
| Cross-tool transport | ViewTubeActionPacket / Brain Handoff Inbox | Preserve identity, context, approval and provenance |
| Generated artifacts | Asset Engine / Vault | Own asset identity, version and reusable artifact provenance |
| Publication | Video Publisher | Own approved snapshot, publish transaction, remote confirmation |
| Published-video edits | Video Manager | Own live video selection, creator approval and confirmed mutation |
| Measurement | VT-SYNC / Analytics Canon | Own canonical snapshots, metrics, windows and evidence |
| Outcomes and evaluations | Outcome / Evaluation ledgers | Join actions to measured, scoped evidence idempotently |
| Validated creator knowledge | AI Brain | Review, govern and promote supported learning |
| Cross-tool strategy | Creator Strategy Engine | Synthesize validated findings into next-best moves |
| Creator-facing orchestration | Studio Hub | Display/resume workflows and handoffs; no duplicate owner |

## Verification requirements

### Contract tests
- compatible and incompatible payloads;
- required context and missing context;
- external-write execution without approval;
- approved execution without idempotency key;
- mismatched approved snapshot hash;
- missing prompt recipe version;
- legacy packet identity marked as non-certified;
- acceptance/completion state transitions and idempotent retries.

### Integration tests
- Analysis → Metadata Master → Thumbnail Studio → Publisher.
- Project/ContentBuild → approved publication → verified publication identity.
- Publication identity → canonical analytics checkpoint → outcome/evaluation.
- Outcome/evaluation → review-only Brain candidate → named creator approval.
- Brain/Creator Strategy finding → Studio Hub → Projects ActionPacket.
- The exact workflow/operation, ContentBuild, selected asset/version, evidence and approval identities survive every supported hop.

### Production gates still required
- focused contracts, full test suite, typecheck, runtime lint, build, source governance and smoke;
- server-authoritative persistence and interrupted-reload/remote reconciliation;
- live `/api/release` identity matching the certified commit;
- read-only browser verification of Studio, Publisher, Manager, Analytics and Brain surfaces;
- proof that real analytics data and prompt recipe provenance flow through the deployed consumers.

The current browser-backed ActionPacket/ContentBuild/ApprovedPublishSnapshot/PublishTransaction adapters do **not** establish cross-device durability. A passing focused contract test or a merged PR alone does not certify production.

## Implementation slice delivered by this branch

- Added the production handoff contract and fail-closed external-write checks.
- Extended ActionPacket with workflow/operation, context, prompt recipe, decision, approval and snapshot lineage.
- Carried the lineage into Brain inbox items, GenerationRecord metadata and ContentBuild handoff receipts.
- Integrated validation into the live Brain handoff list/accept/complete boundary.
- Added focused contract tests.

This slice establishes shared rails. The remaining chain-level integration and release checks are intentionally tracked as certification gates rather than claimed complete.


## Identity phase completion ledger — 2026-10-15

This ledger reconciles the requested identity-system phases 10–12 from the earlier outcome/learning plan with phases 0–2 of the integrated lifecycle completion plan. It is an implementation ledger, not a claim that the deployed runtime has been certified.

### Phase 0 — authoritative baseline and conflict recovery

**Implementation state: BASELINED; release certification pending.**

- Re-established `master/consolidated-feature-integration` as the target and created a clean work branch from that target rather than trying to force-merge the conflicted PR branch.
- Compared PR #273's changed-file patches against current target files and replayed the compatible changes onto the clean branch; preserved current target content where a hunk did not apply cleanly.
- Kept the canonical owners: ActionPacket/Workflow Chain for handoff identity; ContentBuild for content identity/events; Publisher for publication; Analytics Canon/VT-SYNC for measurements; Outcome/Evaluation ledgers for measured outcomes; Brain governance for knowledge promotion.
- Did not mark the capability-coverage record complete merely because tests were added. A passing test list is not proof of full live-path or durable-persistence coverage.

### Phase 1 — publication and metadata lifecycle identity

**Implementation state: CODED; focused verification pending.**

- ActionPackets carry workflow, operation, parent packet, Project, ContentBuild, channel/video/assets, prompt recipe/version, context manifest, recommendation/experiment, approval and snapshot identities.
- Shared destination validation checks payload compatibility, required context, prompt recipe pairing, snapshot-hash consistency, and explicit named approval plus idempotency for external-write execution.
- Brain handoff list/accept/complete paths use the same validator. A blocked packet reports why; legacy-derived IDs are explicitly non-certified.
- Publication transactions can persist workflow/operation/ActionPacket/recommendation/experiment identity at transaction creation. A retry with conflicting identity is rejected rather than silently relinking an already-approved publication.
- Transaction-start events record that identity alongside the approved snapshot hash and locked assets.

### Phase 2 — analytics and outcome attribution

**Implementation state: CODED; focused verification pending.**

- The post-publication bridge resolves the completed transaction, approved snapshot, ContentBuild, YouTube video and selected variant assets before recording a checkpoint.
- Workflow, operation, ActionPacket, recommendation and experiment identity flow from the publication transaction into the publication identity receipt, checkpoint event, and recommendation-evaluation metadata.
- The post-publication pipeline uses canonical analytics and preserves exact ContentBuild/video/transaction/snapshot identity; it does not fuzzy-match titles or claim that temporal association proves causality.
- Existing metric comparability and missing-data rules remain authoritative. Unknown data stays unknown.

### Phase 10 — publication and outcome lineage

**Implementation state: CODED; production producer coverage pending.**

- Preserve the exact approved snapshot, publish transaction, YouTube video binding, ContentBuild, selected assets and workflow identity as one lineage.
- Duplicate/retry behavior remains idempotent. Conflicting video or immutable identity bindings must fail rather than overwrite attribution.
- Remaining gate: prove every production Publisher entry path supplies the identity envelope when it is available; optional transaction identity is backward-compatible for existing callers.

### Phase 11 — canonical analytics evaluation

**Implementation state: CODED; runtime/data certification pending.**

- Analytics checkpoints are generated from the canonical analytics path and linked to the verified publication transaction and snapshot.
- Checkpoint identity, evidence IDs, observation windows and evaluation targets are preserved. Evaluation metadata includes workflow and operation identity where captured.
- Recommendation outcomes are retried independently from checkpoint creation so a partial write can recover without duplicating the outcome.
- Interpretation remains descriptive-association-only unless stronger experimental evidence supports a causal claim.

### Phase 12 — governed learning

**Implementation state: GOVERNANCE RETAINED; end-to-end promotion proof pending.**

- The pipeline records measured outcomes/evaluations; it does not directly promote an outcome to durable Brain knowledge.
- Candidate review, explicit creator approval, evidence sufficiency, comparability and the existing promotion threshold remain required. In particular, do not promote a generalizable rule from a single video: the existing plan requires reviewed promotion supported by at least five distinct published videos with positive, available and comparable evaluations.
- Failed, missing, incomparable or low-confidence evidence remains a non-promoted candidate or an explicit gap.

### Verification gates before calling these phases certified

1. Run the new production-handoff contract tests and SuperTool identity regression test.
2. Run `npm run test:focused`, typecheck, runtime lint, production build, source-governance and release smoke against the final branch head.
3. Verify the live Publisher path supplies identity into transaction creation and that checkpoint/evaluation events preserve it after reload/retry.
4. Verify deployed `/api/release` identity matches the certified commit and the deployed Prompt Registry/context resolver, Analytics Canon and Brain governance are reachable.
5. Verify server-authoritative/cross-device persistence separately. Browser-backed local storage is not durable cross-device persistence and is not sufficient for production certification.

Until these gates pass, status is **implementation advanced; not production-certified**. A Vercel build-rate-limit failure is infrastructure status, not a passing code gate; likewise a successful preview deployment alone is not end-to-end evidence.
# Production Handoff Spine — Publishing, Analysis, Analytics, Prompts, Brain, and Studio Hub

**Status:** implementation foundation in progress; production certification is still required  
**Target branch:** `master/consolidated-feature-integration`  
**Implementation branch:** `work/production-handoff-spine-2026-10-15`

## Purpose

Connect the existing ViewTube systems through one inspectable, typed handoff chain. This extends the canonical ActionPacket/Handoff, ContentBuild, Vault/Asset Engine, Publishing, Analytics, Evaluation, and Brain owners. It does **not** create a second workflow database, prompt registry, analytics store, asset store, or Brain runtime.

The Studio Hub is the creator-facing workflow surface. It should reveal the path and state of the work; Projects owns execution state; specialized tools own their transformations; Publisher owns publication; Manager owns live published-video edits; Analytics owns measurement; AI Brain owns validated durable knowledge; and Creator Strategy Engine owns cross-tool synthesis.

## Canonical production lifecycle

```text
Creator / Account Context + Project
                |
                v
     Context Resolver + Prompt Registry
       (recipe/version/context manifest)
                |
                v
       Analysis / Specialist Tool
                |
                v
    Typed ViewTubeActionPacket (handoff)
       | workflowId + operationId
       | canonical object references
       | evidence + prompt provenance
       | approval / mutation intent
       v
       Destination Tool / Studio Hub
                |
                +--> GenerationRecord / Tool Receipt
                +--> Vault / Asset Engine artifact
                +--> ContentBuild event + asset/version link
                |
                v
     Publisher: Approved Snapshot + PublishTransaction
                |
                v
      Verified Publication Identity Receipt
                |
                v
      VT-SYNC / Canonical Analytics Checkpoint
                |
                v
    Outcome + Evaluation Ledger (scoped evidence)
                |
                v
    Brain review candidate (not auto-promoted)
                |
                v
  Creator-approved Brain knowledge / strategy finding
                |
                v
  Studio Hub → Projects ActionPacket → next work
```

This is a graph with optional branches, not a mandatory sequence for every creator. Handoffs transport references and decisions; they do not transfer ownership or external-write permission.

## One identity envelope across the chain

Every newly created ActionPacket now receives a `workflowId` and `operationId` unless the producer explicitly supplies them. Related operations can preserve `parentPacketId`, `recommendationId`, and `experimentId`. Existing packets are read compatibly and marked `identityMode: "legacy-derived"` when IDs must be derived from the packet ID. A legacy fallback is compatibility, not proof of end-to-end identity certification.

Where available, the envelope also carries:

- creator, Project, ContentBuild, channel, published video, and selected asset IDs;
- evidence references and context-manifest ID;
- prompt recipe ID and version (never raw prompt or private source text by default);
- expected/approved snapshot IDs and hashes;
- intent, approval state, named approver, approval timestamp, and idempotency key;
- experiment/recommendation references and resume route.

The same identifiers are copied into Brain inbox projections, GenerationRecord metadata, Vault artifact metadata, and ContentBuild handoff events. Existing stores remain the specialized owners of their records.

## Destination validation and mutation safety

The shared production-handoff validator checks:

1. Packet/source identity and that the destination is not the source tool.
2. Payload compatibility against the canonical tool capability registry.
3. Destination readiness and declared required context.
4. Paired prompt recipe ID/version provenance.
5. Approved snapshot hash consistency when an expected hash is supplied.
6. Explicit named creator approval, approval timestamp, and an idempotency key when an `execute` intent targets an external-write capability.

An external-write packet is not accepted for execution merely because it can be routed. Preparation and proposal handoffs remain safe defaults. Video Publisher and Video Manager continue to own their respective external mutation flows and must independently confirm their normal approval/remote-success contracts. The handoff validator is a guardrail, not a replacement publishing API.

The Brain handoff consumer now uses this validator when listing and accepting packets. Completion requires an accepted handoff, a still-present packet, a registered destination, and a valid contract. Completed workflow learning uses the packet's workflow identity when the caller does not provide a chain identity.

## Prompt and analysis continuity

Prompt provenance is represented by recipe ID/version, context-manifest ID, and the existing metadata-operation receipts. Do not persist raw prompt text or private source text simply to connect systems. Each analysis result should preserve:

- the source content/version it analyzed;
- evidence IDs and metric/window definitions;
- uncertainty, validation state, and known limitations;
- prompt recipe/version and context manifest;
- generated output/asset IDs and the next typed handoff.

The canonical Prompt Registry remains the authority for prompt definitions. The handoff packet records which recipe/version was used; it does not become a second prompt registry.

## Publication → analytics → Brain closure

Publication identity must bind the exact ContentBuild, Project association status, PublishTransaction, ApprovedPublishSnapshot ID/hash, selected asset/variant IDs, channel, YouTube video, and decision/workflow lineage.

Analytics checkpoints and evaluations must only join evidence for that exact publication and compatible channel/snapshot/window. Missing metrics remain unknown. A temporal association is not causal proof. Outcome records preserve their source record, trace, asset/version, evidence, checkpoint, and idempotency identity. Brain candidates remain review-only until the configured evidence threshold and explicit named creator approval are satisfied.

The Studio Hub should expose this as a timeline/chain view over existing receipts—not as a second workflow state store—with:
**source → transformation → destination → exact packet → produced artifact/version → evidence → approval → measured outcome → Brain decision**.

## Studio Hub handoff UX contract

Every handoff should expose, where practical:

- **From / To** — canonical tool IDs and human labels.
- **Object** — payload type and canonical Project/ContentBuild/video/asset references.
- **Why** — requested action and expected outcome.
- **Evidence** — evidence IDs, source window, confidence and uncertainty.
- **Prompt** — recipe/version and context-manifest reference when applicable.
- **State** — queued, opened, accepted, blocked, completed, dismissed, failed or resumable status.
- **Approval** — required/not required, decision, approver and timestamp.
- **Next step** — destination route/resume target and what the creator needs to do.
- **Lineage** — workflow/operation/parent-packet IDs and output receipts.

A blocked handoff should show the precise missing context or safety condition, not silently disappear or route to an incompatible tool. A creator can review, edit, accept, defer or dismiss; the system does not infer external permission from a recommendation.

## Ownership and integration map

| Concern | Canonical owner | Handoff responsibility |
|---|---|---|
| Creator/account permissions | Account / Creator Context | Supplies scoped identity; never infer identity from free text |
| Project, tasks, milestones, experiments | Projects | Owns execution state and next actions |
| Prompt definitions | Prompt Registry / Prompt System | Recipe and version provenance in each operation |
| Analysis and interpretation | Specialist analysis tools | Evidence-backed, typed result with uncertainty |
| Cross-tool transport | ViewTubeActionPacket / Brain Handoff Inbox | Preserve identity, context, approval and provenance |
| Generated artifacts | Asset Engine / Vault | Own asset identity, version and reusable artifact provenance |
| Publication | Video Publisher | Own approved snapshot, publish transaction, remote confirmation |
| Published-video edits | Video Manager | Own live video selection, creator approval and confirmed mutation |
| Measurement | VT-SYNC / Analytics Canon | Own canonical snapshots, metrics, windows and evidence |
| Outcomes and evaluations | Outcome / Evaluation ledgers | Join actions to measured, scoped evidence idempotently |
| Validated creator knowledge | AI Brain | Review, govern and promote supported learning |
| Cross-tool strategy | Creator Strategy Engine | Synthesize validated findings into next-best moves |
| Creator-facing orchestration | Studio Hub | Display/resume workflows and handoffs; no duplicate owner |

## Verification requirements

### Contract tests
- compatible and incompatible payloads;
- required context and missing context;
- external-write execution without approval;
- approved execution without idempotency key;
- mismatched approved snapshot hash;
- missing prompt recipe version;
- legacy packet identity marked as non-certified;
- acceptance/completion state transitions and idempotent retries.

### Integration tests
- Analysis → Metadata Master → Thumbnail Studio → Publisher.
- Project/ContentBuild → approved publication → verified publication identity.
- Publication identity → canonical analytics checkpoint → outcome/evaluation.
- Outcome/evaluation → review-only Brain candidate → named creator approval.
- Brain/Creator Strategy finding → Studio Hub → Projects ActionPacket.
- The exact workflow/operation, ContentBuild, selected asset/version, evidence and approval identities survive every supported hop.

### Production gates still required
- focused contracts, full test suite, typecheck, runtime lint, build, source governance and smoke;
- server-authoritative persistence and interrupted-reload/remote reconciliation;
- live `/api/release` identity matching the certified commit;
- read-only browser verification of Studio, Publisher, Manager, Analytics and Brain surfaces;
- proof that real analytics data and prompt recipe provenance flow through the deployed consumers.

The current browser-backed ActionPacket/ContentBuild/ApprovedPublishSnapshot/PublishTransaction adapters do **not** establish cross-device durability. A passing focused contract test or a merged PR alone does not certify production.

## Implementation slice delivered by this branch

- Added the production handoff contract and fail-closed external-write checks.
- Extended ActionPacket with workflow/operation, context, prompt recipe, decision, approval and snapshot lineage.
- Carried the lineage into Brain inbox items, GenerationRecord metadata and ContentBuild handoff receipts.
- Integrated validation into the live Brain handoff list/accept/complete boundary.
- Added focused contract tests.

This slice establishes shared rails. The remaining chain-level integration and release checks are intentionally tracked as certification gates rather than claimed complete.


## Identity phase completion ledger — 2026-10-15

This ledger reconciles the requested identity-system phases 10–12 from the earlier outcome/learning plan with phases 0–2 of the integrated lifecycle completion plan. It is an implementation ledger, not a claim that the deployed runtime has been certified.

### Phase 0 — authoritative baseline and conflict recovery

**Implementation state: BASELINED; release certification pending.**

- Re-established `master/consolidated-feature-integration` as the target and created a clean work branch from that target rather than trying to force-merge the conflicted PR branch.
- Compared PR #273's changed-file patches against current target files and replayed the compatible changes onto the clean branch; preserved current target content where a hunk did not apply cleanly.
- Kept the canonical owners: ActionPacket/Workflow Chain for handoff identity; ContentBuild for content identity/events; Publisher for publication; Analytics Canon/VT-SYNC for measurements; Outcome/Evaluation ledgers for measured outcomes; Brain governance for knowledge promotion.
- Did not mark the capability-coverage record complete merely because tests were added. A passing test list is not proof of full live-path or durable-persistence coverage.

### Phase 1 — publication and metadata lifecycle identity

**Implementation state: CODED; focused verification pending.**

- ActionPackets carry workflow, operation, parent packet, Project, ContentBuild, channel/video/assets, prompt recipe/version, context manifest, recommendation/experiment, approval and snapshot identities.
- Shared destination validation checks payload compatibility, required context, prompt recipe pairing, snapshot-hash consistency, and explicit named approval plus idempotency for external-write execution.
- Brain handoff list/accept/complete paths use the same validator. A blocked packet reports why; legacy-derived IDs are explicitly non-certified.
- Publication transactions can persist workflow/operation/ActionPacket/recommendation/experiment identity at transaction creation. A retry with conflicting identity is rejected rather than silently relinking an already-approved publication.
- Transaction-start events record that identity alongside the approved snapshot hash and locked assets.

### Phase 2 — analytics and outcome attribution

**Implementation state: CODED; focused verification pending.**

- The post-publication bridge resolves the completed transaction, approved snapshot, ContentBuild, YouTube video and selected variant assets before recording a checkpoint.
- Workflow, operation, ActionPacket, recommendation and experiment identity flow from the publication transaction into the publication identity receipt, checkpoint event, and recommendation-evaluation metadata.
- The post-publication pipeline uses canonical analytics and preserves exact ContentBuild/video/transaction/snapshot identity; it does not fuzzy-match titles or claim that temporal association proves causality.
- Existing metric comparability and missing-data rules remain authoritative. Unknown data stays unknown.

### Phase 10 — publication and outcome lineage

**Implementation state: CODED; production producer coverage pending.**

- Preserve the exact approved snapshot, publish transaction, YouTube video binding, ContentBuild, selected assets and workflow identity as one lineage.
- Duplicate/retry behavior remains idempotent. Conflicting video or immutable identity bindings must fail rather than overwrite attribution.
- Remaining gate: prove every production Publisher entry path supplies the identity envelope when it is available; optional transaction identity is backward-compatible for existing callers.

### Phase 11 — canonical analytics evaluation

**Implementation state: CODED; runtime/data certification pending.**

- Analytics checkpoints are generated from the canonical analytics path and linked to the verified publication transaction and snapshot.
- Checkpoint identity, evidence IDs, observation windows and evaluation targets are preserved. Evaluation metadata includes workflow and operation identity where captured.
- Recommendation outcomes are retried independently from checkpoint creation so a partial write can recover without duplicating the outcome.
- Interpretation remains descriptive-association-only unless stronger experimental evidence supports a causal claim.

### Phase 12 — governed learning

**Implementation state: GOVERNANCE RETAINED; end-to-end promotion proof pending.**

- The pipeline records measured outcomes/evaluations; it does not directly promote an outcome to durable Brain knowledge.
- Candidate review, explicit creator approval, evidence sufficiency, comparability and the existing promotion threshold remain required. In particular, do not promote a generalizable rule from a single video: the existing plan requires reviewed promotion supported by at least five distinct published videos with positive, available and comparable evaluations.
- Failed, missing, incomparable or low-confidence evidence remains a non-promoted candidate or an explicit gap.

### Verification gates before calling these phases certified

1. Run the new production-handoff contract tests and SuperTool identity regression test.
2. Run `npm run test:focused`, typecheck, runtime lint, production build, source-governance and release smoke against the final branch head.
3. Verify the live Publisher path supplies identity into transaction creation and that checkpoint/evaluation events preserve it after reload/retry.
4. Verify deployed `/api/release` identity matches the certified commit and the deployed Prompt Registry/context resolver, Analytics Canon and Brain governance are reachable.
5. Verify server-authoritative/cross-device persistence separately. Browser-backed local storage is not durable cross-device persistence and is not sufficient for production certification.

Until these gates pass, status is **implementation advanced; not production-certified**. A Vercel build-rate-limit failure is infrastructure status, not a passing code gate; likewise a successful preview deployment alone is not end-to-end evidence.
