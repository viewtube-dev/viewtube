# P1-01 Brain Continuity

**Production Date:** 2026-10-29  
**Last Edited:** 2026-10-29  
**Class:** PROGRAM  
**Status:** ACTIVE — PHASE 0 SOURCE TRACE COMPLETE; RUNTIME CERTIFICATION OPEN  
**Concern:** brain continuity  
**Owner:** BrainRuntime + Creator Context + Evidence/Analytics + Projects/ContentBuild + Outcomes/Learning  
**Registry ID:** DOC-PLAN-P1-BRAINCONTINUITY  
**Last Audited Main SHA:** 61cfb726db9b32de53b9c89a5a339db696782a11  
**Capabilities:** CAP-BRAIN-EXPERIENCE, CAP-CREATOR-CONTEXT, CAP-EVIDENCE-INTELLIGENCE, CAP-PROJECT-CONTENT-IDENTITY, CAP-OUTCOME-LEARNING
**Status:** PHASE 0 PARTIAL — SOURCE TRACE DOCUMENTED; BROWSER JOURNEY UNVERIFIED | **Owner:** BrainRuntime + Creator Context + Evidence/Analytics + Projects/ContentBuild + Outcomes/Learning
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
