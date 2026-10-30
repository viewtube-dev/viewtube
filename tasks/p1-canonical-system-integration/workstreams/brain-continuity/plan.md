# P1-01 Brain Continuity

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PHASE 1 IDENTITY MAP COMPLETE; RUNTIME CERTIFICATION AND PHASES 2–6 OPEN  
**Concern:** brain continuity  
**Owner:** BrainRuntime + Creator Context + Evidence/Analytics + Projects/ContentBuild + Outcomes/Learning  
**Registry ID:** DOC-PLAN-P1-BRAINCONTINUITY  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE, CAP-PROJECT-CONTENT-IDENTITY, CAP-OUTCOME-LEARNING
**Status:** PHASE 0 PARTIAL / PHASE 1 SOURCE MAP COMPLETE — BROWSER JOURNEY UNVERIFIED | **Owner:** BrainRuntime + Creator Context + Evidence/Analytics + Projects/ContentBuild + Outcomes/Learning
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE, CAP-PROJECT-CONTENT-IDENTITY, CAP-OUTCOME-LEARNING

## Objective
Prove creator profile facts, interactions, evidence, Project/ContentBuild identity, actions, measured outcomes and governed learning remain connected through the actual Brain production path.

## Reuse
BrainRuntime/BrainOrchestrator; BrainContextBroker/CreatorContextResolver; Channel Profile/Knowledge; analytics-canon/VT-SYNC; EvidenceIntelligenceResolver/EvidenceRecord; Projects/ContentBuild; existing operation/receipt records, ContentBuild event stream, Algorithm Intelligence event ledger and evaluation/learning owners.

## Phases
0. Trace one user action from profile/context read through evidence, Brain task, action/receipt, outcome/checkpoint and evaluation.
1. Map channelId, profile/knowledge IDs, evidence/source IDs, projectId, contentBuildId, operationId, eventId, receiptId, outcomeId and checkpoint IDs.
2. Verify freshness, provenance, scope, missingness and confirmed-vs-inferred semantics through context pack, prompt and trace.
3. Attribute instructions, corrections, preferences, approvals/rejections and observations to correct channel/project/operation; preserve governed promotion.
4. Join recommendation → creator decision → execution → publication/asset → measured outcome → evaluation by explicit stable references, never time proximity.
5. Certify representative success, retry and failure journeys.
6. Remove duplicate bridges only after caller inventory, parity, tests and rollback proof.

## Acceptance
Stable IDs survive every applicable boundary; missing is not zero; stale/conflicting evidence remains explicit; inferred facts cannot overwrite confirmed facts; writes are idempotent; no new durable store. Focused tests: CreatorContextResolver, EvidenceIntelligenceResolver, BrainRuntimeSnapshot, BrainLearningPersistence, BrainEvaluationLoop, BrainProjectContext, BrainCommunicationIngestion, event ancestry and outcome pipeline. Runtime: one browser-visible profile→evidence→task→action→outcome journey with sanitized receipt.


## Phase 0 — production-path discovery checkpoint (2026-10-29)

**Result:** STATIC SOURCE TRACE COMPLETE; END-TO-END RUNTIME CERTIFICATION NOT YET PROVEN.

**Scope inspected:** `viewtube-dev/viewtube`, target branch `master/consolidated-feature-integration`. The exact target branch was confirmed in the repository branch search. The repository default branch is `main`; code-search results from the default branch were treated as discovery hints only. Files below were fetched explicitly from the target branch ref. The branch-head commit SHA was not exposed by the branch-search response, so the historical `Last Audited Main SHA` above is intentionally not replaced with a blob SHA.

### A. Reconstructed source path

```text
Channel Profile / Channel Knowledge / Style / Project + ContentBuild
  → CreatorContextResolver.resolveCreatorContext
  → BrainOrchestrator.runBrainTurn
      → EvidenceIntelligenceResolver.resolveEvidenceIntelligence
          → analytics-canon canonical snapshot
          → EvidenceRecord[] / evidence quality / specialist projections
      → BrainContextBroker.buildBrainContextPack
      → BrainModelGateway
      → BrainTrace + conversation turn/model-input snapshot
  → ActionPacket / GenerationWorkflow
      → GenerationRequest + ContextManifest
      → ContentBuild tool.input event
      → ToolReceipt + GenerationRecord + output assets
      → ContentBuild tool.output event
  → creator decision / BrainOutcomeLedger or Algorithm Intelligence event
  → checkpoint / AlgorithmEvaluationLoop
  → Learning Candidate
  → governed review / promotion
  → Channel Knowledge (only through governed promotion)
```

This is a reconstructed architecture path, not a claim that one live browser session has exercised every edge.

### B. Verified source findings

| Boundary | Existing canonical foothold | Phase 0 finding |
| --- | --- | --- |
| Creator context | `CreatorContextResolver.ts` | Read-only facade over existing profile, knowledge, style, project/ContentBuild, surface and selection owners. Channel-scoped reads and personalization/project controls are gated. Tests cover canonical Project + linked ContentBuild and disabled/no-channel cases. |
| Evidence | `EvidenceIntelligenceResolver.ts`, `EvidenceRecord.ts` | Read-only projection over one canonical analytics snapshot; exact channel-scope checks gate analytics-derived projections. Brain records the evidence records actually rendered into the model prompt. |
| Brain task | `BrainOrchestrator.ts`, `BrainContextBroker.ts` | Orchestrator resolves creator context and evidence before building the bounded prompt context, calls the governed model gateway, and captures model-input snapshot/evaluation metadata. |
| Trace | `BrainTrace.ts` | Trace contains task/capability, evidence, context budget, prompt versions, requested/served model, grades and output reference. Default sink remains capped browser localStorage; a server sink can be injected but no active server sink registration was established in this source audit. |
| Project / ContentBuild | `ContentBuildRepository.ts`, `GenerationWorkflow.ts` | Generation requests validate channel/project scope and ContentBuild revision; input/output events retain request, context manifest, operation projection, receipt and asset/evidence references. ContentBuild repository's inspected default persistence is browser localStorage. |
| Operations | `operations/OperationRecord.ts` | Shared typed lifecycle/projection contract exists for ActionPacket, GenerationRequest and ToolReceipt. It explicitly is not a new persistence owner; GenerationWorkflow embeds projections in existing ContentBuild event metadata. |
| Outcomes | `BrainOutcomeLedger.ts`, `assetOutcomes.ts` | Outcomes carry sourceRecordId, operation/workflow/trace, project/contentBuild, action packet, publication identity, evidence and analytics checkpoint references. Source-record retries are checked for conflicting immutable fields. Browser-local ledger is queued to the existing authenticated Brain learning persistence endpoint. |
| Algorithm events | `AlgorithmIntelligenceEventLedger.ts` | Events carry operation/trace/output/workflow, parent-event and evidence IDs; writes use browser cache plus asynchronous existing server-sync adapter. Event ancestry is explicit. |
| Evaluation / learning | `BrainEvaluationLoop.ts`, `AlgorithmLearningCandidates.ts`, `AlgorithmLearningGovernance.ts` | Canonical VT-SYNC evaluation emits outcome-measured events with parent references; candidates and reviews are event-backed. Review-for-profile is not itself a durable Channel Profile mutation. |
| Lineage diagnostics | `EvidenceLineageDiagnostics.ts` | Read-only reconstruction checks missing parents, duplicate IDs, cycles and unverified evidence references across ContentBuild events and Algorithm Intelligence events. It explicitly cannot verify external evidence absent from those ledgers. |

### C. Identity map — fields and joins

| Identity | Existing carriers / join behavior | Finding |
| --- | --- | --- |
| `channelId` | CreatorContextEnvelope, EvidenceIntelligenceEnvelope, BrainTrace, GenerationRequest, outcomes, Algorithm events | Present and used for channel-scoped reads/writes; cross-channel isolation still needs a live journey test. |
| Profile / knowledge IDs | Creator context metadata includes knowledge record/conflict IDs and profile load time | Knowledge IDs are carried; profile provenance is represented by channel scope/load timestamp in the inspected envelope, not yet proven as a stable profile-record reference through every downstream record. |
| `evidenceIds` / source IDs | EvidenceRecord, prompt input snapshot, BrainTrace returned records, GenerationRequest, ToolReceipt, outcome and Algorithm events | Strong additive coverage; exact equality between the prompt evidence, trace, action and later outcome has not been certified in a live run. |
| `projectId` / `contentBuildId` | Creator context, request/manifest/receipt, ContentBuild events, outcomes | Canonical generation path validates scope and revision; context fallback and non-generation surfaces still require uniform runtime proof. |
| `operationId` / `workflowId` | GenerationRequest, ToolReceipt, GenerationRecord, BrainTrace, OperationRecord projection, outcome and Algorithm event | Propagated through generation records and projections, but not uniformly established on the initial reasoning trace or every action/outcome producer. |
| `eventId` / `parentEventIds` | ContentBuild event stream and Algorithm Intelligence event ledger | Explicit ancestry exists; cross-ledger ancestry can still report incomplete/unverified. |
| `receiptId` | ToolReceipt embedded in ContentBuild output event | Receipt is available for generation path; not every consequential action path has been proven to emit one. |
| `outcomeId` | BrainOutcomeRecord and Algorithm Intelligence events | Separate owners remain; joins are not yet universal. |
| checkpoint IDs | BrainOutcome analyticsCheckpointIds; ContentBuild lifecycle event types; Algorithm checkpoint events | Carried in selected paths; producer coverage and exact event ancestry remain open. |

### D. Concrete continuity gaps discovered

1. **Reasoning trace is not operation-linked by default.** `BrainOrchestrator` starts the question trace with channel/kind but does not supply an operationId/workflowId in the inspected call. Its outputRef is the response ID. This leaves the initial Brain reasoning operation dependent on later explicit handoff references rather than a guaranteed shared operation identity.
2. **Runtime snapshot join keys are narrower than the shared identity contract.** `BrainRuntimeSnapshot` matches Brain outcomes and direct Algorithm events by ActionPacket ID or workflow ID; it collects operation IDs and flags conflicts, but does not use operationId as a direct outcome/event join key. Do not broaden joins by timestamp or project co-membership.
3. **Snapshot chain coverage is generation-request-led.** `readBrainRuntimeSnapshot` builds provenance chains from GenerationRequest records found in ContentBuild events. A pure Brain reasoning turn or other consequential action without that request record is not represented as a complete provenance chain by this snapshot.
4. **Trace durability is not certified.** The default BrainTrace sink is browser localStorage, capped at 200 traces. The injectable server sink is a seam, not proof that production registers one.
5. **Multiple durability boundaries remain.** ContentBuild events, BrainTrace, BrainOutcomeLedger and Algorithm Intelligence each have browser-local caches; outcome and Algorithm event paths have server-sync adapters, while the inspected BrainTrace and ContentBuild default paths remain local. Cross-device/restart durability cannot be assumed uniformly.
6. **Outcome attribution coverage remains partial.** BrainOutcomeLedger's strong sourceRecordId idempotency and publication-lineage enrichment exist, but producers do not yet prove full Project/Publisher/Editor/Community/Experiment coverage. Algorithm event lineage also requires exact parent/operation/workflow propagation.
7. **Context resolver failures are collapsed to null in BrainOrchestrator.** The inspected caller catches resolver errors and continues with null context; this avoids crashing a turn but does not itself provide a visible diagnostic proving which context sections were unavailable.

### E. Existing tests and what they prove

Inspected test sources (not executed in this audit):
- `src/services/brain/__tests__/CreatorContextResolver.test.ts` — aggregation, canonical Project/ContentBuild, exact Project ID, disabled controls and no-channel behavior.
- `src/services/brain/__tests__/BrainChannelKnowledgeIntegration.test.ts` — facade use by Orchestrator and Broker.
- `src/services/brain/__tests__/EvidenceIntelligenceResolver.test.ts` — one canonical snapshot, requested window and scope behavior.
- `src/services/brain/BrainRuntimeSnapshot.test.ts` — synthetic request/manifest/receipt/trace/outcome fixture and operation mismatch handling.
- `src/services/operations/OperationRecord.test.ts` — projections, idempotency-key construction and approval lifecycle.
- `src/services/brain/BrainCommunicationIngestion.test.ts` — consent, classification, raw-text non-retention, redaction and idempotent replay.

These are focused contract/unit tests. The BrainRuntimeSnapshot fixture is synthetic and does not prove a real production producer chain.

### F. Phase 0 exit decision

**Static source discovery: COMPLETE.**  
**End-to-end production journey: NOT CERTIFIED.**

The remaining Phase 0 gate is a browser-visible, sanitized journey with one real channel/project:
1. resolve creator profile/knowledge and canonical Project/ContentBuild context;
2. capture the exact evidence IDs supplied to the Brain task;
3. record the actual task trace and served model;
4. follow one approved ActionPacket or GenerationWorkflow handoff into its receipt/output event;
5. record the creator decision/outcome with the same stable identity;
6. observe a canonical analytics checkpoint and evaluation event;
7. inspect the resulting ancestry and verify missing/unverified stages are explicit.

No source code or tests were changed/run as part of this discovery checkpoint. No data store, bridge or legacy path is approved for removal. The next implementation work must close the identified identity/durability/coverage gaps using existing owners and must not create a parallel continuity database or event ledger.


## Phase advancement — 2026-10-29

**Phase 1 — identity map: SOURCE MAPPING COMPLETE; producer/runtime certification OPEN.**

The identity inventory above is now the canonical field map for this workstream. The following rules are binding for implementation and diagnostics:

| Identity | Canonical rule | Required proof |
| --- | --- | --- |
| Channel scope | Every channel-owned record must retain the exact channelId; a missing channel is not a wildcard. | Cross-channel isolation test at resolver, trace, outcome and event boundaries. |
| Profile / knowledge | Keep owner record IDs and confirmed/inferred state where the source exposes them; do not synthesize a stable profile ID from channelId or loadedAt. | Context-pack and trace snapshots identify the exact source records and confidence/confirmation semantics. |
| Evidence | Preserve EvidenceRecord.id plus provenance.evidenceIds; prompt evidence means records actually rendered, not merely retrieved. | Exact prompt-to-trace evidence-set comparison, including stale, missing and unverified markers. |
| Project / ContentBuild | Carry projectId and contentBuildId independently; validate their relationship and revision at each write boundary. | Wrong-project and stale-revision rejection tests. |
| Operation / workflow | operationId is the primary cross-system operation join; workflowId groups a multi-step workflow. ActionPacket/request/receipt IDs remain typed source identities, not substitutes. | Same operationId/workflowId survives reasoning, handoff, receipt, outcome and evaluation where applicable. |
| Events | eventId is unique within its owning ledger; parentEventIds express causality across ledgers only when the referenced parent is explicit and resolvable. | Missing-parent, duplicate-ID, cycle and cross-ledger ancestry tests. |
| Receipt / outcome / checkpoint | Keep receiptId, outcomeId and checkpoint IDs as separate immutable references; never infer them from time or project membership. | Idempotent retry and exact outcome-to-checkpoint lineage tests. |

**Phase 2 — freshness, provenance, scope and semantic-state verification: PARTIAL (static contract review only).**

Source confirms a canonical analytics snapshot, typed evidence records, exact channel checks in the evidence resolver, and capture of records actually rendered to the prompt. It does not yet prove, in a production session, that:
- the same evidence IDs and source IDs survive context-pack → model input → trace → action → outcome;
- freshness and missingness are preserved without converting missing values to zero;
- confirmed facts remain distinguishable from inferred hypotheses at every downstream consumer;
- conflicting or stale records remain visible in creator-facing diagnostics;
- resolver failures are distinguishable from legitimately empty context.

**Phase 3 — interaction attribution: NOT STARTED.** No producer inventory or runtime proof has yet established complete channel/project/operation attribution for instructions, corrections, preferences, approvals, rejections and observations. Preserve the existing consent/redaction rules in BrainCommunicationIngestion and route profile/knowledge changes only through the existing governed promotion path.

**Phase 4 — recommendation-to-evaluation joins: PARTIAL SOURCE SUPPORT; NOT CERTIFIED.** Existing ActionPacket, GenerationRequest, ToolReceipt, BrainOutcomeRecord, publication identity and Algorithm Intelligence event fields provide join material. Runtime snapshot matching is still narrower than the identity contract and must not be repaired with timestamps or project co-membership. Add or extend tests before changing join semantics.

**Phase 5 — representative journey certification: BLOCKED.** Required journeys are success, idempotent retry, and failure/recovery, each with sanitized evidence and exact IDs. The available Browser Use execution service rejected the read-only verification attempt because the project has insufficient credits. No authenticated browser session or real creator/project data was available in this run. No production action was attempted.

**Phase 6 — duplicate-bridge removal: NOT AUTHORIZED.** No caller inventory, parity run, migration proof or rollback evidence has been produced. Keep all existing owners and bridges intact. Do not add a second trace, outcome, profile, evidence or operation store.

### Phase gates and immediate execution order

1. Restore a safe browser-verification environment (or provide an authorized staging session) and complete the Phase 0/5 sanitized end-to-end journey. No production writes.
2. Build the producer inventory for interaction/outcome events and capture a representative record from each existing owner.
3. Add failing focused tests for operationId joins, evidence-set continuity, stale/missing/confirmed-vs-inferred semantics, and idempotent retry/failure recovery.
4. Implement only the smallest changes inside existing canonical owners; register server-backed trace persistence only if an existing authenticated persistence contract is verified. Do not invent a new endpoint or store.
5. Run the repository's focused test commands from package.json, then the relevant broader suite, typecheck and build; record exact commands and results.
6. Reconstruct the success/retry/failure chains using the existing lineage diagnostics. Only then consider bridge removal with caller inventory, parity and rollback proof.

**Execution boundary:** Phase 1's field/relationship map is complete as a source-level artifact. Phase 2 is a static review, not a runtime certification. Phases 3–6 remain open. No behavioral code change is claimed, no test is claimed as run, and no data has been changed.


## Existing task and plan alignment (2026-10-30)
- Existing Task Authority leads: VT-003 (Project/ContentBuild context), VT-004 (Opportunity evidence), VT-019 (control scope), VT-020/#021 (Hook Generator and Script Architect canonical runtime migration), VT-022 (AI regression/evaluation corpus), VT-035 (creator-loop correlation IDs). These remain governed by the existing Task Authority/ledger projection; this plan does not allocate replacements.
- Existing prior art: `tasks/system-convergence/todo.md`, `docs/domains/BRAIN.md`, Brain capability homes and `docs/plans/VIEWTUBE_BRAIN_MODEL_GATEWAY_CONVERGENCE_PLAN_2026-10-29.md`.
- The runtime/gateway provider seam is already implemented; this workstream focuses on continuity of IDs and evidence/outcomes across existing owners, not rebuilding BrainRuntime or gateway.
