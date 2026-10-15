# Post-Publication Analytics + Historical Metadata Intelligence — Phases 6–8 Implementation Receipt

**Date:** 2026-10-15  
**Implementation branch:** `work/post-publish-phases-2-5-current-integration-2026-10-15`  
**Pull request:** [#223 — draft, pending verification](https://github.com/viewtube-dev/viewtube/pull/223)  
**Scope:** AI Brain integration and governed learning; metadata-operation/prompt provenance; creator-facing history and performance comparison.

## Phase 6 — AI Brain integration and governed learning

### Canonical Brain evidence projection
- Extended `readBrainRuntimeSnapshot` with a `metadataIntelligence` projection sourced from the selected ContentBuild event stream.
- Exposes metadata-version count, comparison count, ready comparison count, candidate count, promoted-knowledge count, and latest comparison ID/status/evidence references.
- The projection does not create a second analytics store or a parallel Brain memory.

### Historical evidence in metadata generation
- Metadata Master now resolves historical metadata versions and performance comparisons through explicit ContentBuild/video IDs.
- It supplies up to three recent comparison summaries to the existing metadata-generation strategy prompt, including changed fields, before/follow-up metrics, windows, and status.
- The prompt explicitly states that the evidence is descriptive association, not causal proof; missing metrics remain unknown and comparisons must not become unquestioned rules.
- Evidence references from the resolver are carried into the metadata-operation receipt.

### Governed learning
Added `src/services/MetadataLearningGovernance.ts`:
- A learning candidate can only be created from ready comparisons with explicit field changes, metric direction, metadata-version IDs, and evidence IDs.
- Candidate creation requires at least three independent metadata versions and is idempotent.
- Candidates remain `pending-creator-review`; they are not automatically promoted into Brain knowledge.
- Promotion requires explicit named creator approval, at least five independent metadata versions, and evidence references.
- Candidate and promotion events preserve `interpretation: "descriptive-association-only"` and `causalConclusion: null`.

## Phase 7 — metadata operation and prompt provenance

Added `src/services/MetadataOperationProvenance.ts` and wired it into Metadata Master generation.

The operation receipt records:
- operation and ContentBuild IDs, project/video references, fields, revision, output package IDs, evidence references;
- recipe ID/version and known provider/model identity;
- a deterministic input fingerprint rather than raw prompt/source text;
- an idempotency key and timestamp.

Metadata Master uses the declared recipe marker `metadata-master.seo-package@1`. Provider is identified as the Gemini service adapter; model is left unknown because the current call path does not return a verified model identifier. This is a provenance adapter, not a claim that a centralized Prompt Registry already governs all generation calls.

Also wired the immutable ContentBuild metadata-version API into:
- Video Publisher after remote verification and successful publication identity receipt, linked to the completed PublishTransaction, ApprovedPublishSnapshot ID/hash, published video, selected assets and receipt evidence;
- Video Manager after YouTube confirms a live metadata write, recording the field-level before/after values under a canonical immutable metadata version.

The creator-facing history projection now includes the metadata-operation receipt without indiscriminately exposing unrelated tool-output events.

## Phase 8 — creator-facing publication history and outcome experience

Metadata Master now includes **07 CHANGE + OUTCOME HISTORY**, shared by its standalone and embedded Publisher/Manager placements.

The panel displays recent canonical ContentBuild history with:
- operation/event type, timestamp, tool/actor and operation reference;
- field-level before/after values for metadata-version events;
- baseline/follow-up windows, available metric deltas, status and evidence-reference count for historical comparisons;
- explicit messaging that temporal association does not prove causation and that incomplete metrics are unknown.

Saved package drafts remain a separate list; the new panel surfaces the actual ContentBuild lifecycle/history stream rather than treating a local package list as the full publication history.

## Regression coverage added

- `MetadataLearningGovernance.test.ts`: minimum independent comparison threshold, creator review, five-version promotion gate, idempotent candidate/promotion, and Brain summary projection.
- `MetadataOperationProvenance.test.ts`: recipe/context provenance, input fingerprinting without raw source text, and idempotent operation receipts.
- `BrainRuntimeSnapshot.test.ts`: metadata evidence is projected into Brain runtime without causal claims.
- `historicalMetadataIntelligence.test.ts`: historical comparison results are available to the exact-ID context resolver.
- Added these suites plus ContentBuild repository and Brain snapshot tests to `npm run test:focused`.

## Verification / remaining gates

- Tests and typecheck/build were **not run in this session**; source and test files were updated through GitHub's contents API.
- The repository's current Vercel status checks were already failing due to build-rate limits; those failures are not a passing verification signal.
- PR #223 remains draft until focused tests, typecheck, build and the full publication → history → analytics → comparison → governed-learning golden path pass.
- A27 server-authoritative persistence and interrupted-reload/remote reconciliation remain open. The current ContentBuild/ApprovedPublishSnapshot/PublishTransaction adapters are browser-storage-backed; this work does not claim cross-device durability.
- No production deployment or external YouTube mutation was performed by these changes.
