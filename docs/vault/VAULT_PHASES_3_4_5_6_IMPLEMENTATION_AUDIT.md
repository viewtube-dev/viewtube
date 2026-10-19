# Vault Workbench — Phases 3–6 Implementation Audit

**Target:** `master/consolidated-feature-integration`  
**Working branch:** `vault/phases-0-1-2-workbench`  
**Status:** Implementation added; CI and merged-branch verification pending. This is not a release certification.

## Phase 3 — inspection, search, and organization

### Existing canonical capabilities retained
- `src/services/vaultAdapter.ts` remains the canonical asset record/search adapter.
- `src/services/vaultCollections.ts` persists smart collection filter state.
- `src/services/vaultManualCollections.ts` owns manual collections and collection membership.
- `src/services/vaultCustomFields.ts` owns typed custom fields.
- `src/services/vaultImageSimilarity.ts`, `vaultExif.ts`, `vaultFileMetadata.ts`, and `vaultFileHash.ts` provide supported inspection and duplicate signals.
- `CreatorVaultOS.tsx` already composes preview, collection membership, custom fields, rights fields, compare/version views, and specialist media workbenches.

### Implemented in this phase
- Added `src/services/vaultInspection.ts` to produce a read-only, normalized inspection projection for technical metadata, rights, lineage, tags, and actionable findings.
- Integrated technical summary, missing-metadata/preview/rights findings, parent lineage, and protected-state context into the canonical Inspector.
- Added tests for projection immutability, missing technical metadata, rights findings, and media-kind-specific validation.

### Boundary
Inspection findings are advisory and derived from currently stored fields. They do not prove the underlying file is readable, that rights are legally valid, or that the current user has server authorization.

## Phase 4 — operation execution, receipts, and lineage

### Implemented
- Added `src/services/vaultOperationLedger.ts`, a bounded operation receipt ledger with explicit state transitions:
  `preview → queued → processing → completed|failed`, with cancellation from pre-execution states and retry from failed.
- Records input IDs, output IDs, operation parameters, timestamps, retry count, error, and completion receipt.
- Image and video derivative-save flows now record operation IDs and link successful outputs back to the source asset.
- Inspector displays recent operation receipts associated with the selected asset.
- Added transition and receipt tests, including invalid transitions and terminal-state behavior.

### Durability limit
The ledger currently uses browser `localStorage`. It is persistent within that browser profile, but it is **not** a server audit log, cross-device operation history, durable worker queue, or authoritative actor record. Server-backed operation receipts, idempotency, cancellation of active jobs, retry scheduling, and per-user/workspace authorization remain follow-up work.

## Phase 5 — media capabilities and preflight

### Implemented / verified in source
- Image transformations use `src/services/vaultImageWorkbench.ts` and produce derivative bytes without overwriting the source.
- Video trim, proxy, transcode, frame extraction, and audio extraction use `src/services/vaultVideoWorkbench.ts`, which submits a real request to `/api/media/compress-analysis?vaultOperation=1`.
- Added a shared preflight planner that rejects unsupported/mixed media kinds, duplicate/missing IDs, more than 50 selected assets, known source files above 64 MB, and destructive overwrite requests. Protected-source overwrite attempts receive an explicit unlock-required reason.
- Image and video workbenches use the preflight contract; video preflight checks the loaded source blob size before sending it to the processor.
- Successful derivative records retain source identity, operation parameters, storage information where available, and operation receipt IDs.

### Limits / not claimed
- The preflight planner does not implement batch execution. Current workbench execution remains single-asset.
- The video endpoint requires a functioning server-side FFmpeg installation; source code wiring alone does not certify the deployed processor is configured or healthy.
- Browser IndexedDB/localStorage fallbacks are not cross-device durability. Persistent server storage depends on the deployment's configured storage directory/disk.
- No new audio transcoder, arbitrary-file speech-to-text service, or proxy worker was invented. Existing Vault task backlog records those as unimplemented where applicable.

## Phase 6 — compare, AI proposal safety, and rights governance

### Implemented
- Extended field-level comparison to include names, kinds, project/source, tags, and metadata fields, with stable nested-value comparison.
- Added `src/services/vaultReviewGovernance.ts` for rights/license/source/expiry/restriction findings.
- Integrated rights findings into the Inspector alongside the editable rights fields.
- Added a metadata-suggestion proposal contract. Suggestions remain unaccepted proposals until explicitly accepted; acceptance rejects cross-asset proposals, protected/GOLDEN assets, and attempts to rewrite lifecycle/provenance identity fields.
- Added tests for field-level differences, missing/expired rights, and protected metadata acceptance rules.

### AI integration boundary
The proposal contract is not an AI model and does not generate suggestions by itself. The existing uncompleted Vision/suggested-tag task and arbitrary local-file transcription/provider integration remain separate. No claim is made that semantic search, vision tagging, or local speech-to-text is operational.

## Security and release blockers

1. **Account/workspace authorization:** the canonical Vault asset adapter remains browser-localStorage-backed; local lifecycle guards are not server authorization.
2. **Server operation ledger:** operation receipts are browser-local, not authoritative cross-device audit records.
3. **Processor health:** deployed FFmpeg/worker availability and durable media storage need runtime verification.
4. **Batch execution:** preflight planning is present; batch transforms are not executed by this phase.
5. **AI provider:** proposal approval/provenance contracts exist, but the actual vision/suggested-tag provider is not integrated here.
6. **Verification:** focused tests, full test suite, typecheck, production build, browser testing, and deployment checks must pass on the latest PR head before merge certification.

## Focused tests added
- `src/services/__tests__/vaultInspection.test.ts`
- `src/services/__tests__/vaultOperationLedger.test.ts`
- `src/services/__tests__/vaultMediaOperations.test.ts`
- `src/services/__tests__/vaultReviewGovernance.test.ts`
- Existing `vaultAdapterIdentity.test.ts` strengthened for atomic unlock-and-overwrite rejection.

## Completion rule
Phases 3–6 have substantive source changes and focused tests authored. They must remain **IMPLEMENTED / VERIFICATION PENDING** until the exact head passes required checks and the merged target is re-read. Items above explicitly labeled limits remain open; they must not be represented as completed.
