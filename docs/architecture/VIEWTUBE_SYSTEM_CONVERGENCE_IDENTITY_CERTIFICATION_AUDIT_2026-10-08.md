# ViewTube System Convergence & Identity Certification — Initial Audit

**Branch:** `audit/system-convergence-identity-certification`  
**Base:** `main`  
**Audit date:** 2026-10-08  
**Scope:** Read-only certification of the cross-system identity backbone before new Studio Hub tool construction.

## 1. Purpose

Certify whether existing ViewTube systems can safely share one content identity from Project through ContentBuild, assets, operations, publication, analytics, outcomes, and governed learning.

This audit does not introduce a new persistence system. Findings must map to existing canonical owners.

## 2. Initial certification matrix

| System / contract | Exists | Canonical owner | Connected | Certification status | Main gap |
|---|---|---|---|---|---|
| Project identity | Yes | Projects | Yes | Partial | End-to-end verification evidence is missing |
| ContentBuild identity | Yes | Projects / ContentBuild | Yes | Partial | Capability lists tests/verification as missing; production caller inventory remains incomplete |
| Project → Video Package identity | Yes | Projects / Video Package projection | Yes | Partial | One-write-owner and bridge responsibility still need certification |
| Asset identity | Yes | Asset Engine / Vault | Partial | Partial | Version/variant lineage across Project/Vault/Editor/Publisher is not certified |
| Operation identity | Partial | Creator Operations | Partial | Not certified | ActionPacket, ToolReceipt, GenerationRecord, BrainTrace still need convergence around OperationRecord |
| Handoff identity | Yes | ActionPacket / handoff system | Partial | Not certified | Exhaustive producer/consumer inventory still open |
| Exact publish attribution | Partial | Publishing Package / Approved Publish Snapshot | Partial | Blocked / incomplete | Immutable ApprovedPublishSnapshot and publish recovery are still open |
| Post-publish ContentBuild continuity | Partial | Projects / ContentBuild + publishing | Partial | Not certified | Published binding/checkpoint chain still open |
| Analytics checkpoints | Yes | analytics-canon + ContentBuild events | Partial | Partial | Producer coverage and identity linkage are incomplete |
| Outcome identity | Yes | Outcome owners / BrainOutcomeLedger | Partial | Not certified | Unified producer identity/idempotency contract and coverage matrix are open |
| Evaluation | Yes | Evaluation owners | Partial | Partial | Consequential-action evaluation targets and producer coverage remain incomplete |
| Evidence identity | Yes | EvidenceRecord / analytics-canon | Partial | Partial | End-to-end evidence IDs still need certification |
| Brain learning | Yes | Brain / governed learning | Partial | Not certified | Outcome provenance and governed promotion must be proven across the full chain |

## 3. Evidence inspected

### Project / ContentBuild

`src/services/projects/ProjectContentIdentityService.ts` establishes a canonical transaction that synchronizes a Project to a ContentBuild, resolves the canonical Project identity, initializes the Video Package against that identity, and rejects a Video Package whose ContentBuild differs.

This is a strong foundation.

The capability record `CAP-PROJECT-CONTENT-IDENTITY` nevertheless reports missing task references, tests, and verification evidence. Implementation existence must not be treated as certification.

### Asset lineage

`CAP-ASSET-LINEAGE` identifies Asset Engine as the canonical owner and covers artifact identity, versions, variants, selections, provenance, dependencies, and outcome attribution.

The system-convergence todo still lists version/variant lineage across Project/Vault/Editor/Publisher as unfinished. This is a certification gap, not a reason to create another asset system.

### Creator operations

Current code contains ToolReceipt and GenerationRecord concepts, while ActionPacket and BrainTrace also participate in operation/provenance flows.

The convergence plan explicitly requires production caller inventory, overlap inventory, OperationRecord v1, BrainTrace mapping, provider operation contract, and idempotency tests.

Therefore **Operation ID is not yet a certified universal identity**.

### Publishing

The canonical plans still mark immutable ApprovedPublishSnapshot, PublishTransaction binding, retry/recovery/idempotency certification, and post-publish ContentBuild binding as incomplete.

This means exact used title/thumbnail/render/package attribution cannot yet be treated as fully certified across the publication boundary.

### Analytics

There is already a real implementation seam. `src/services/longformOptimizationComparison.ts` reads canonical analytics and records an `analytics.checkpoint` ContentBuild event with ContentBuild ID, video ID, comparison window, status, evidence ID, source, and comparison version.

This proves that post-publication measurement can already attach to ContentBuild. It does not prove universal coverage.

### Outcomes / learning

`BrainOutcomeLedger` and `assetOutcomes` exist, and tests verify the asset-outcome path.

However, convergence plans still identify incomplete outcome coverage across Publisher, Projects, Editor, Community, experiments, packaging, and Brain actions. The shared producer identity/idempotency contract is also unfinished.

## 4. Current architecture conclusion

The backbone is **not missing**. It is partially implemented across several canonical systems.

The current problem is:

**identity exists in pieces, but the contracts that make those identities survive every consequential handoff are not yet certified.**

The highest-risk seams are:

1. Project ↔ ContentBuild ↔ Video Package ownership.
2. Asset ↔ version ↔ variant lineage.
3. OperationRecord convergence.
4. Exact publication snapshot/used-variant attribution.
5. Post-publish ContentBuild binding.
6. Analytics checkpoint producer coverage.
7. Outcome producer identity/idempotency.
8. Evidence ID continuity.
9. Governed learning promotion.

## 5. Quick wins before Studio Hub expansion

1. Add missing Project/ContentBuild identity tests and verification fixtures.
2. Create a one-write-owner matrix for Project, ContentBuild, VideoPackage, and PublishingPackage fields.
3. Define the minimum shared OperationRecord identity without replacing existing stores.
4. Add an operation-idempotency fixture.
5. Create one end-to-end identity fixture: Project → ContentBuild → Asset/Variant → Tool → Package.
6. Create one publication identity fixture: Project → ContentBuild → Package → Approved Snapshot → Publish Transaction.
7. Create one post-publish fixture: Published Video → ContentBuild → Analytics Checkpoint → Outcome.
8. Create one evidence continuity fixture: Analytics → EvidenceRecord → Evaluation.
9. Build the outcome producer coverage matrix.
10. Do not promote Brain learning until outcome/evidence provenance is present.

## 6. First implementation vertical slice

```text
Project
  ↓
ContentBuild
  ↓
Asset + exact variant
  ↓
Tool operation
  ↓
Publishing Package
  ↓
Approved Publish Snapshot
  ↓
Published Video binding
  ↓
Analytics checkpoint
  ↓
Outcome / Evaluation
  ↓
Evidence
  ↓
Learning candidate
```

Recommended proof path:

**Project → Script Architect → Thumbnail Studio → Video Publisher → Publishing Package → post-publish analytics**

The purpose is to prove identity survival, not to add product features.

## 7. Certification gates

- [ ] Project and ContentBuild IDs survive supported handoffs.
- [ ] One-write-owner matrix is accepted.
- [ ] Asset version/variant lineage is traceable.
- [ ] One operation can be followed by a stable operation identity.
- [ ] Exact publish inputs are frozen and attributable.
- [ ] Published video remains linked to originating ContentBuild.
- [ ] Analytics checkpoint links back to publication/content identity.
- [ ] Outcome producer carries operation/content identity and idempotency semantics.
- [ ] Evidence IDs survive analytics → evaluation.
- [ ] Learning promotion requires evidence/outcome provenance.

## 7A. Publication-package certification extensions

The convergence slice must certify package-level decision lineage in addition to individual metadata or asset lineage. The following capabilities are now explicit certification targets:

| Contract | Certification requirement |
|---|---|
| Package identity | A complete publication package can be identified and tied to its Project/ContentBuild. |
| Package alternatives | Generated, compared, selected, and published package options remain distinguishable. |
| Selected package attribution | The exact package used for publication is attributable to the publication snapshot. |
| Component lineage | Title, thumbnail, description, tags, and other package components retain their own asset/version lineage inside the package. |
| Recommendation provenance | Consequential recommendations can point back to evidence, context, goals, and generation/analysis provenance. |
| Recommendation effectiveness | Recommendation → decision → implementation → outcome can be evaluated without assuming causality. |
| Optimization intent | Optimization intensity and creator goal are retained as decision context where used. |
| Package readiness | Readiness/blockers are evaluated against the same package that is approved/published. |
| Package-level outcome | Analytics/evaluation can assess the package as a whole while preserving component-level attribution. |
| Metadata → Thumbnail handoff | A metadata-generated thumbnail brief/reference can transfer context without moving thumbnail ownership out of Thumbnail Studio. |

### Required package proof

The vertical proof should be able to demonstrate:

```text
Project
  ↓
ContentBuild
  ↓
Package alternatives
  ↓
Selected package
  ↓
Approved Publish Snapshot
  ↓
Published package
  ↓
Analytics checkpoints
  ↓
Package outcome / evaluation
  ↓
Component + package learning candidates
```

The system must not conclude that a component caused an outcome merely because it was part of the selected package. Package-level attribution and component-level attribution must remain separate evidence questions.


## 8. Architectural rule

Do not respond to these gaps by creating another Project store, ContentBuild store, asset store, generic operation ledger, analytics truth store, generic outcome database, Brain, or handoff framework.

The correct pattern is:

**certify → connect → consolidate contracts → migrate → prove → remove redundancy.**

## 9. Next audit pass

The next pass should be a deeper producer/consumer inventory against current `main` source for Project/ContentBuild writes, ContentBuild event writers, AssetGenerator/GenerationWorkflow callers, ActionPacket/ToolReceipt/GenerationRecord producers, publishing snapshot/transaction writers, analytics checkpoint writers, outcome writers, evaluation writers, evidence ID producers/consumers, and Brain learning promotion paths.

The output should identify exact source paths, callers, IDs, persistence boundaries, and tests before any behavior is changed.

**Initial verdict: FOUNDATION EXISTS — CROSS-SYSTEM CERTIFICATION IS NOT YET COMPLETE.**

The next move is targeted certification and quick-win hardening, not new Studio Hub tool construction.