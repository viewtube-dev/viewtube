# P1 Cross-System Identity and Provenance Map
**Production Date:** 2026-10-30 | **Last Edited:** 2026-10-30 | **Class:** SPECIFICATION | **Status:** ACTIVE — SOURCE MAP / CONTRACT GAPS
**Concern:** stable identity across the six canonical product systems and Studio surface | **Owner:** Integrated Application Program
**Registry ID:** DOC-SPEC-P1-CROSS-SYSTEM-IDENTITY
**Audited target SHA:** 0135fa33bf5cd59503c9feecce4977072ef60fec

## Purpose
Map existing typed identity fields before changing behavior. This is a crosswalk, not a new schema, persistence owner, event ledger or diagnostics database. Existing domain owners remain authoritative.

## Six canonical product systems
Product Architecture names six canonical systems. Diagnostics must correlate their events without merging their stores.

| System | Existing owner/source | Existing identity/provenance fields | Required join |
|---|---|---|---|
| Creator Context & Knowledge | CreatorContextResolver, Channel Profile/Knowledge, BrainProjectContext | channelId, projectId, ContentBuild ID, profile/knowledge scope and version/provenance | Explicit channel/project scope; confirmed facts remain distinguishable from inferred |
| Evidence & Intelligence | VT-SYNC, analytics-canon, EvidenceRecord, specialist modules | evidence ID, owner/sourceId, channel/project/contentBuild/video scope, source route, fetched/captured time, epistemic state, provenance refs | Evidence IDs survive selection, prompt rendering, result and outcome |
| Project / Content / Asset Graph | Projects, ContentBuild, Asset Engine/Vault | projectId, contentBuildId, asset IDs/version/variant IDs, publication identity | Same durable content identity through generation, asset, publish and outcomes |
| Creator Operations & Generation | OperationRecord, OperationEnvelope, ActionPacket, ToolReceipt, GenerationRecord | operationId, workflowId, idempotencyKey, traceId, actionPacketId, toolReceiptId, generationRecordId, provider/model/prompt refs where available | One operation identity and retry key; domain owners retain writes |
| Outcomes, Evaluation & Learning | BrainOutcomeLedger, AlgorithmIntelligenceEventLedger, analytics checkpoints, evaluation and learning owners | outcome ID, sourceRecordId, operationId, traceId, parentEventIds, recommendationId, checkpoint IDs, evidence IDs, publication IDs | Explicit ancestry and source identity; no joins by time proximity |
| Brain Runtime & Experience | BrainRuntime, BrainAssistantContinuity, BrainModelGateway | surface, taskProfileId, contextKey, channel/project/contentBuild/video IDs, evidenceIds, continuity trace | Runtime request correlation connects context/evidence to operation and result |

Studio Controls is a cross-cutting UI system, not a seventh product truth system. Its identity is source/export based: semantic token source → emitter → generated CSS → primitive export → catalog specimen → consumer import.

## Existing contracts

### OperationEnvelope v1
Source: `src/services/operations/OperationEnvelope.ts`
- eventId, eventType, operationId, correlationId, causationId, idempotencyKey, occurredAt
- channelId, projectId, contentBuildId, actor
- evidenceRefs, artifactRefs
- deterministic scoped idempotency-key builder

This is a normalized contract/helper over existing domain events, not a store.

### OperationRecord v1
Source: `src/services/operations/OperationRecord.ts`
- operationId, workflowId, idempotencyKey, kind/status/mutation class/approval
- lineage: creator/channel/project/contentBuild/video, asset/evidence IDs, trace, ActionPacket, ToolReceipt, GenerationRecord, publish transaction/snapshot, recommendation/experiment and parent operation
- operation lifecycle and approval gates

This is a typed projection; existing ActionPacket/GenerationRequest/ToolReceipt/GenerationRecord/BrainTrace/publishing owners keep their own persistence.

### Brain continuity and outcomes
- `BrainAssistantContinuity.ts`: deterministic contextKey and trace with surface, scope, selected/omitted context sections, evidence IDs and limitations.
- `EvidenceRecord.ts`: typed evidence, source/owner/scope/provenance/epistemic semantics; only actually rendered evidence should be claimed as model context.
- `BrainOutcomeLedger.ts`: sourceRecordId + operationId/traceId + project/contentBuild/asset/publication/checkpoint/evidence links; idempotent retry and conflict detection.
- `AlgorithmIntelligenceEventLedger.ts`: operationId/traceId/outputRef, sourceId, parentEventIds, recommendation/action/workflow IDs and evidence IDs; monotonic identity merge.

### Diagnostics
Sources: `src/services/diagnostics.ts`, `src/services/diagnostics/unified.ts`, `src/app/onScreenDiagnostics.ts`.
- Existing shared diagnostic event: source, subsystem, kind, severity/status/code/summary, optional correlationId, expected/actual, evidenceRefs, recommendedActions, confidence, privacy, metadata.
- Canonical sanitizer redacts secret-shaped keys, bearer tokens and sensitive query values.
- Unified adapters normalize into the existing bounded in-memory diagnostics ring; no durable diagnostic database is introduced.

## Contract gaps to validate
1. `UnifiedDiagnosticEvent` currently has correlationId/evidenceRefs but no first-class eventId, operationId, causationId/parentEventIds or channel/project/contentBuild scope. Determine which fields can be safely optional and propagated from OperationEnvelope; do not require them for non-operation diagnostics.
2. Ensure a single correlationId is created at the initiating user action and retained across provider retry/streaming, operation receipt, domain events and outcome. eventId remains unique per event; causation/parent IDs express ancestry.
3. Keep OperationEnvelope and OperationRecord distinct: envelope describes a domain event; record describes an operation lifecycle. Do not conflate eventId with operationId.
4. Diagnostics may reference evidence/artifact IDs, but must not copy raw evidence, prompt content, credentials, or private provider payloads.
5. Brain contextKey is a deterministic context fingerprint, not an operation/correlation ID. Keep those namespaces distinct.
6. Public-handle evidence uses public channel/video refs and sourceRefs; it must not acquire connected-account/private Analytics identity.
7. Studio build/test receipts should reference commit, test suite, token source and generated output hashes; no creator-operation ID is needed for static control CSS unless a real operation exists.

## Proposed adoption sequence
1. Trace one Brain request and one generation operation from user action to receipt/outcome; record which IDs exist at each boundary.
2. Trace one public-handle request, proving public-only provenance and no authenticated/private context.
3. Trace one diagnostics event emitted by each canonical system; list missing fields and safe adapters.
4. Add optional identity fields only after source/consumer inventory and failing contract tests.
5. Preserve existing event stores and domain writers; use adapter projections only where needed.
6. Verify retries preserve correlationId/idempotencyKey while generating distinct event IDs.

## Verification
Use existing OperationEnvelope/OperationRecord tests, BrainAssistantContinuity/Runtime tests, EvidenceRecord and BrainOutcomeLedger/AlgorithmIntelligenceEventLedger tests, `test:unified-diagnostics`, public resolver tests and Studio token/export tests. Runtime receipts must include exact build SHA, surface, session state, correlation/operation/event IDs where applicable, provenance and observed outcome.
